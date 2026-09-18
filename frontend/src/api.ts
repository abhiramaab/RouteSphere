import { Shipment, Driver, Vehicle, Trip, Invoice, LogisticsMetrics, Customer } from './types';
import {
  INITIAL_METRICS,
  INITIAL_SHIPMENTS,
  INITIAL_DRIVERS,
  INITIAL_VEHICLES,
  INITIAL_TRIPS,
  INITIAL_INVOICES,
  INITIAL_CUSTOMERS,
} from './mockData';

const BACKEND_URL_KEY = 'routesphere_api_url';
const TOKEN_KEY = 'routesphere_jwt_token';
const ROLE_KEY = 'routesphere_role';
const EMAIL_KEY = 'routesphere_email';
const DEMO_MODE_KEY = 'routesphere_demo_mode';

export type Role = 'ADMIN' | 'DISPATCHER' | 'DRIVER';

export interface Session {
  token: string;
  email: string;
  role: Role;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function decodeJwt(token: string): { sub?: string; role?: string; exp?: number } {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export class RouteSphereApi {
  // ---------- config ----------
  static isDemoMode(): boolean {
    const val = localStorage.getItem(DEMO_MODE_KEY);
    return val === null ? true : val === 'true';
  }

  static setDemoMode(enable: boolean) {
    localStorage.setItem(DEMO_MODE_KEY, String(enable));
  }

  static getApiUrl(): string {
    return localStorage.getItem(BACKEND_URL_KEY) || 'http://localhost:8080';
  }

  static setApiUrl(url: string) {
    localStorage.setItem(BACKEND_URL_KEY, url.replace(/\/$/, ''));
  }

  // ---------- session ----------
  static getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  static getSession(): Session | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    return {
      token,
      email: localStorage.getItem(EMAIL_KEY) || '',
      role: (localStorage.getItem(ROLE_KEY) as Role) || 'DISPATCHER',
    };
  }

  static isAuthenticated(): boolean {
    const token = this.getStoredToken();
    if (!token) return false;
    const { exp } = decodeJwt(token);
    if (exp && exp * 1000 < Date.now()) {
      this.logout();
      return false;
    }
    return true;
  }

  static logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(EMAIL_KEY);
  }

  static async login(email: string, password: string): Promise<Session> {
    const res = await fetch(`${this.getApiUrl()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      let message = 'Invalid email or password.';
      try {
        const body = await res.json();
        message = body.message || body.error || message;
      } catch {
        /* ignore */
      }
      throw new ApiError(message, res.status);
    }
    const data = await res.json();
    const token: string = data.token;
    const claims = decodeJwt(token);
    const role = ((claims.role || 'DISPATCHER') as Role).toUpperCase() as Role;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(EMAIL_KEY, email);
    return { token, email, role };
  }

  static async register(payload: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }): Promise<string> {
    const res = await fetch(`${this.getApiUrl()}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    if (!res.ok) throw new ApiError(text || 'Registration failed.', res.status);
    return text;
  }

  // ---------- request helper ----------
  private static getAuthHeaders(): HeadersInit {
    const token = this.getStoredToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private static async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.getApiUrl()}${path}`, {
      ...init,
      headers: { ...this.getAuthHeaders(), ...(init?.headers || {}) },
    });
    if (res.status === 401 || res.status === 403) {
      throw new ApiError('Session expired or insufficient role.', res.status);
    }
    if (!res.ok) {
      let message = `Request failed (${res.status})`;
      try {
        const body = await res.json();
        message = body.message || body.error || message;
      } catch {
        /* ignore */
      }
      throw new ApiError(message, res.status);
    }
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : (undefined as T);
  }

  // ---------- local demo store ----------
  private static getStoredList<T>(key: string, defaultData: T[]): T[] {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return defaultData;
    }
  }

  private static setStoredList<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // ---------- metrics ----------
  static async getMetrics(): Promise<LogisticsMetrics> {
    if (this.isDemoMode()) return INITIAL_METRICS;
    try {
      const [shipments, drivers, vehicles, invoices] = await Promise.all([
        this.getShipments(),
        this.getDrivers(),
        this.getVehicles(),
        this.getInvoices(),
      ]);
      const activeShipments = shipments.filter((s) =>
        ['PENDING', 'IN_TRANSIT'].includes(s.status)
      ).length;
      const pendingDeliveries = shipments.filter((s) => s.status === 'PENDING').length;
      const availableDrivers = drivers.filter((d) => d.status === 'AVAILABLE').length;
      const activeVehicles = vehicles.filter((v) => v.status === 'ACTIVE').length;
      const fleetUtilizationPercent = vehicles.length
        ? Math.round(((vehicles.length - activeVehicles) / vehicles.length) * 100 + 40)
        : 0;
      const paid = invoices.filter((i) => i.status === 'PAID').length;
      const onTimeDeliveryRate = invoices.length
        ? Math.round((paid / invoices.length) * 1000) / 10
        : 0;
      const totalRevenueMonthly = invoices
        .filter((i) => i.status === 'PAID')
        .reduce((sum, i) => sum + i.amount, 0);
      return {
        activeShipments,
        fleetUtilizationPercent: Math.min(100, fleetUtilizationPercent),
        onTimeDeliveryRate,
        totalRevenueMonthly,
        availableDrivers,
        pendingDeliveries,
      };
    } catch {
      return INITIAL_METRICS;
    }
  }

  // ---------- shipments ----------
  static async getShipments(): Promise<Shipment[]> {
    if (this.isDemoMode()) return this.getStoredList('rs_shipments', INITIAL_SHIPMENTS);
    try {
      const list = await this.request<any[]>('/api/shipment');
      return (list || []).map((s) => mapShipmentFromBackend(s));
    } catch (e) {
      console.warn('GET /api/shipment unavailable, using fallback', e);
      return this.getStoredList('rs_shipments', INITIAL_SHIPMENTS);
    }
  }

  static async createShipment(shipment: Partial<Shipment>): Promise<Shipment> {
    if (!this.isDemoMode()) {
      try {
        const payload = {
          trackingNumber:
            shipment.trackingNumber ||
            `RS-${(shipment.origin || 'IND').slice(0, 3).toUpperCase()}-${Math.floor(
              1000 + Math.random() * 9000
            )}`,
          pickupLocation: shipment.origin || 'Bengaluru Hub',
          deliveryLocation: shipment.destination || 'Mumbai Terminal',
          pickupDate: new Date().toISOString().split('T')[0],
          deliveryDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0],
          weight: shipment.weightKg || 1500,
          shipmentPriority: shipment.priority || 'NORMAL',
          customerId: shipment.customerId ?? null,
          invoiceId: shipment.invoiceId ?? null,
        };
        const created = await this.request<any>('/api/shipment', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        return mapShipmentFromBackend(created, shipment);
      } catch (e) {
        console.warn('POST /api/shipment failed, falling back to local store', e);
      }
    }
    return this.createShipmentLocal(shipment);
  }

  private static createShipmentLocal(shipment: Partial<Shipment>): Shipment {
    const shipments = this.getStoredList('rs_shipments', INITIAL_SHIPMENTS);
    const trackingCode = `RS-${(shipment.origin || 'IND').slice(0, 3).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;
    const newShipment: Shipment = {
      id: Date.now(),
      trackingNumber: shipment.trackingNumber || trackingCode,
      origin: shipment.origin || 'Bengaluru Hub',
      destination: shipment.destination || 'Mumbai Terminal',
      weightKg: shipment.weightKg || 1200,
      status: 'PENDING',
      priority: shipment.priority || 'NORMAL',
      customerName: shipment.customerName || 'Walk-in Customer',
      customerEmail: shipment.customerEmail || 'logistics@routesphere.app',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    };
    this.setStoredList('rs_shipments', [newShipment, ...shipments]);
    return newShipment;
  }

  static async updateShipmentStatus(id: number, status: Shipment['status']): Promise<void> {
    if (this.isDemoMode()) {
      const shipments = this.getStoredList('rs_shipments', INITIAL_SHIPMENTS);
      this.setStoredList(
        'rs_shipments',
        shipments.map((s) => (s.id === id ? { ...s, status } : s))
      );
      return;
    }
    await this.request(`/api/shipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ shipmentStatus: status }),
    });
  }

  static async deleteShipment(id: number): Promise<void> {
    if (this.isDemoMode()) {
      const shipments = this.getStoredList('rs_shipments', INITIAL_SHIPMENTS);
      this.setStoredList('rs_shipments', shipments.filter((s) => s.id !== id));
      return;
    }
    await this.request(`/api/shipment/${id}`, { method: 'DELETE' });
  }

  // ---------- drivers ----------
  static async getDrivers(): Promise<Driver[]> {
    if (this.isDemoMode()) return this.getStoredList('rs_drivers', INITIAL_DRIVERS);
    try {
      const list = await this.request<any[]>('/api/driver');
      return (list || []).map((d) => mapDriverFromBackend(d));
    } catch (e) {
      console.warn('GET /api/driver unavailable, using fallback', e);
      return this.getStoredList('rs_drivers', INITIAL_DRIVERS);
    }
  }

  static async createDriver(driverData: {
    fullName: string;
    phone: string;
    licenseNumber: string;
    experienceYears?: number;
  }): Promise<Driver> {
    if (!this.isDemoMode()) {
      try {
        const payload = {
          driverName: driverData.fullName,
          driverPhone: driverData.phone.replace(/\D/g, '').slice(-10),
          driverLicenseNumber: driverData.licenseNumber,
          driverLicenseExpiry: new Date(Date.now() + 365 * 2 * 24 * 3600 * 1000)
            .toISOString()
            .split('T')[0],
          experienceYears: driverData.experienceYears || 5.0,
        };
        const created = await this.request<any>('/api/driver', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        return mapDriverFromBackend(created, driverData);
      } catch (e) {
        console.warn('POST /api/driver failed, falling back to local store', e);
      }
    }
    const drivers = this.getStoredList('rs_drivers', INITIAL_DRIVERS);
    const newDriver: Driver = {
      id: Date.now(),
      fullName: driverData.fullName,
      licenseNumber: driverData.licenseNumber,
      phone: driverData.phone,
      status: 'AVAILABLE',
      tripsCompleted: 0,
      rating: 5.0,
      experienceYears: driverData.experienceYears || 5,
      avatarUrl: '',
    };
    this.setStoredList('rs_drivers', [newDriver, ...drivers]);
    return newDriver;
  }

  // ---------- vehicles ----------
  static async getVehicles(): Promise<Vehicle[]> {
    if (this.isDemoMode()) return this.getStoredList('rs_vehicles', INITIAL_VEHICLES);
    try {
      const list = await this.request<any[]>('/api/vehicle');
      return (list || []).map((v) => mapVehicleFromBackend(v));
    } catch (e) {
      console.warn('GET /api/vehicle unavailable, using fallback', e);
      return this.getStoredList('rs_vehicles', INITIAL_VEHICLES);
    }
  }

  static async createVehicle(vehicleData: {
    plateNumber: string;
    model: string;
    capacityKg: number;
    type: 'TRUCK' | 'VAN' | 'SEMI_TRUCK' | 'TRAILER';
    fuelType?: string;
  }): Promise<Vehicle> {
    if (!this.isDemoMode()) {
      try {
        const payload = {
          vehicleNumber: vehicleData.plateNumber,
          vehicleCapacity: vehicleData.capacityKg,
          vehicleType: vehicleData.type,
          fuelType: vehicleData.fuelType || 'DIESEL',
          vehicleStatus: 'ACTIVE',
          insuranceExpiry: new Date(Date.now() + 365 * 24 * 3600 * 1000)
            .toISOString()
            .split('T')[0],
        };
        const created = await this.request<any>('/api/vehicle', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        return mapVehicleFromBackend(created, vehicleData);
      } catch (e) {
        console.warn('POST /api/vehicle failed, falling back to local store', e);
      }
    }
    const vehicles = this.getStoredList('rs_vehicles', INITIAL_VEHICLES);
    const newVehicle: Vehicle = {
      id: Date.now(),
      plateNumber: vehicleData.plateNumber,
      model: vehicleData.model,
      type: vehicleData.type,
      capacityKg: vehicleData.capacityKg,
      currentOdometerKm: 0,
      status: 'ACTIVE',
      fuelEfficiencyKmPerL: 4.5,
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
    };
    this.setStoredList('rs_vehicles', [newVehicle, ...vehicles]);
    return newVehicle;
  }

  // ---------- trips ----------
  static async getTrips(): Promise<Trip[]> {
    if (this.isDemoMode()) return this.getStoredList('rs_trips', INITIAL_TRIPS);
    try {
      const list = await this.request<any[]>('/api/trip');
      if (list && list.length) return list.map(mapTripFromBackend);
    } catch (e) {
      console.warn('GET /api/trip unavailable, using fallback', e);
    }
    return this.getStoredList('rs_trips', INITIAL_TRIPS);
  }

  static async dispatchTrip(tripData: {
    shipmentId: number;
    driverId: number;
    vehicleId: number;
  }): Promise<Trip> {
    if (!this.isDemoMode()) {
      try {
        const shipments = await this.getShipments();
        const shipment = shipments.find((s) => s.id === tripData.shipmentId);
        const payload = {
          tripNumber: `TRIP-${Date.now().toString().slice(-6)}`,
          startLocation: shipment?.origin || 'Origin Hub',
          endLocation: shipment?.destination || 'Destination',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0],
          tripStatus: 'IN_PROGRESS',
          distance: 0,
          driverId: tripData.driverId,
          vehicleId: tripData.vehicleId,
          shipmentId: tripData.shipmentId,
        };
        const created = await this.request<any>('/api/trip', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (created) return mapTripFromBackend(created);
      } catch (e) {
        console.warn('POST /api/trip failed, falling back to local store', e);
      }
    }

    const shipments = this.getStoredList('rs_shipments', INITIAL_SHIPMENTS);
    const drivers = this.getStoredList('rs_drivers', INITIAL_DRIVERS);
    const vehicles = this.getStoredList('rs_vehicles', INITIAL_VEHICLES);
    const trips = this.getStoredList('rs_trips', INITIAL_TRIPS);

    const shipment = shipments.find((s) => s.id === tripData.shipmentId);
    const driver = drivers.find((d) => d.id === tripData.driverId);
    const vehicle = vehicles.find((v) => v.id === tripData.vehicleId);

    if (shipment) {
      shipment.status = 'IN_TRANSIT';
      this.setStoredList('rs_shipments', [...shipments]);
    }
    if (driver) {
      driver.status = 'ON_DUTY';
      this.setStoredList('rs_drivers', [...drivers]);
    }

    const newTrip: Trip = {
      id: Date.now(),
      tripCode: `TRIP-${shipment?.trackingNumber || 'IND-01'}`,
      shipmentId: tripData.shipmentId,
      trackingNumber: shipment?.trackingNumber || 'RS-EXP-001',
      driverName: driver?.fullName || 'Assigned Driver',
      vehiclePlate: vehicle?.plateNumber || 'KA-01-EXP',
      origin: shipment?.origin || 'Bengaluru',
      destination: shipment?.destination || 'Destination',
      status: 'IN_PROGRESS',
      startTime: 'Just now',
      eta: '48h estimated',
      distanceKm: 850,
      progressPercent: 5,
    };
    this.setStoredList('rs_trips', [newTrip, ...trips]);
    return newTrip;
  }

  // ---------- invoices ----------
  static async getInvoices(): Promise<Invoice[]> {
    if (this.isDemoMode()) return this.getStoredList('rs_invoices', INITIAL_INVOICES);
    try {
      const list = await this.request<any[]>('/api/invoice');
      return (list || []).map(mapInvoiceFromBackend);
    } catch (e) {
      console.warn('GET /api/invoice unavailable, using fallback', e);
      return this.getStoredList('rs_invoices', INITIAL_INVOICES);
    }
  }

  // ---------- customers ----------
  static async getCustomers(): Promise<Customer[]> {
    if (this.isDemoMode()) return this.getStoredList('rs_customers', INITIAL_CUSTOMERS);
    try {
      const list = await this.request<any[]>('/api/customer');
      return (list || []).map((c) => ({
        id: c.customerId ?? c.id,
        companyName: c.companyName || '',
        contactPerson: c.contactPerson || '',
        email: c.email || '',
        city: c.city || '',
      }));
    } catch {
      return this.getStoredList('rs_customers', INITIAL_CUSTOMERS);
    }
  }

  static async pingApi(): Promise<boolean> {
    if (this.isDemoMode()) return false;
    try {
      const res = await fetch(`${this.getApiUrl()}/api/auth/login`, { method: 'POST' });
      return res.status < 500;
    } catch {
      return false;
    }
  }
}

// ---------- mappers: backend DTO -> frontend type ----------
function mapShipmentFromBackend(s: any, fallback?: Partial<Shipment>): Shipment {
  const priorityMap: Record<string, Shipment['priority']> = {
    LOW: 'NORMAL',
    MEDIUM: 'NORMAL',
    HIGH: 'EXPRESS',
    NORMAL: 'NORMAL',
    URGENT: 'URGENT',
    EXPRESS: 'EXPRESS',
  };
  const statusMap: Record<string, Shipment['status']> = {
    PENDING: 'PENDING',
    CREATED: 'PENDING',
    IN_TRANSIT: 'IN_TRANSIT',
    OUT_FOR_DELIVERY: 'IN_TRANSIT',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
  };
  return {
    id: s.id ?? s.shipmentId ?? fallback?.id ?? Date.now(),
    trackingNumber: s.trackingNumber || fallback?.trackingNumber || 'RS-0000',
    origin: s.pickupLocation || fallback?.origin || 'Unknown origin',
    destination: s.deliveryLocation || fallback?.destination || 'Unknown destination',
    weightKg: s.weight ?? fallback?.weightKg ?? 0,
    status: statusMap[s.shipmentStatus] || fallback?.status || 'PENDING',
    priority: priorityMap[s.shipmentPriority] || fallback?.priority || 'NORMAL',
    customerName: s.customerName || fallback?.customerName || 'Unknown customer',
    customerEmail: s.customerEmail || fallback?.customerEmail || '',
    createdAt: s.pickupDate ? new Date(s.pickupDate).toISOString() : new Date().toISOString(),
    estimatedDelivery: s.deliveryDate
      ? new Date(s.deliveryDate).toISOString()
      : new Date().toISOString(),
    assignedDriverId: s.driverId ?? fallback?.assignedDriverId,
    assignedVehicleId: s.vehicleId ?? fallback?.assignedVehicleId,
  };
}

function mapDriverFromBackend(d: any, fallback?: Partial<Driver>): Driver {
  const statusMap: Record<string, Driver['status']> = {
    AVAILABLE: 'AVAILABLE',
    ON_TRIP: 'ON_DUTY',
    ON_DUTY: 'ON_DUTY',
    OFF_DUTY: 'OFF_DUTY',
    INACTIVE: 'OFF_DUTY',
  };
  return {
    id: d.id ?? fallback?.id ?? Date.now(),
    fullName: d.driverName || fallback?.fullName || 'Unnamed driver',
    licenseNumber: d.driverLicenseNumber || fallback?.licenseNumber || '',
    phone: d.driverPhone || fallback?.phone || '',
    status: statusMap[d.driverStatus] || 'AVAILABLE',
    assignedVehiclePlate: d.assignedVehicleNumber,
    tripsCompleted: d.tripIds?.length || 0,
    rating: 4.8,
    experienceYears: d.experienceYears ?? fallback?.experienceYears,
    avatarUrl: '',
  };
}

function mapVehicleFromBackend(v: any, fallback?: Partial<Vehicle>): Vehicle {
  const statusMap: Record<string, Vehicle['status']> = {
    AVAILABLE: 'ACTIVE',
    ACTIVE: 'ACTIVE',
    IN_TRANSIT: 'ACTIVE',
    UNDER_MAINTENANCE: 'IN_MAINTENANCE',
    IN_MAINTENANCE: 'IN_MAINTENANCE',
    OUT_OF_SERVICE: 'DECOMMISSIONED',
    DECOMMISSIONED: 'DECOMMISSIONED',
  };
  return {
    id: v.vehicleId ?? v.id ?? fallback?.id ?? Date.now(),
    plateNumber: v.vehicleNumber || fallback?.plateNumber || '',
    model: fallback?.model || `${v.vehicleType || 'VEHICLE'} Unit`,
    type: v.vehicleType || fallback?.type || 'TRUCK',
    capacityKg: v.vehicleCapacity ?? fallback?.capacityKg ?? 0,
    currentOdometerKm: v.odometer ?? fallback?.currentOdometerKm ?? 0,
    status: statusMap[v.vehicleStatus] || 'ACTIVE',
    fuelEfficiencyKmPerL: fallback?.fuelEfficiencyKmPerL ?? 4.0,
    lastMaintenanceDate: v.insuranceExpiry || fallback?.lastMaintenanceDate || '—',
  };
}

function mapTripFromBackend(t: any): Trip {
  const statusMap: Record<string, Trip['status']> = {
    SCHEDULED: 'SCHEDULED',
    DISPATCHED: 'DISPATCHED',
    IN_PROGRESS: 'IN_PROGRESS',
    STARTED: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
  };
  return {
    id: t.id ?? Date.now(),
    tripCode: t.tripNumber || `TRIP-${t.id ?? Math.floor(Date.now() / 1000)}`,
    shipmentId: t.shipmentId ?? 0,
    trackingNumber: t.shipmentTracking || '—',
    driverName: t.driverName || 'Unassigned',
    vehiclePlate: t.vehicleNumber || '—',
    origin: t.startLocation || '—',
    destination: t.endLocation || '—',
    status: statusMap[t.tripStatus] || 'SCHEDULED',
    startTime: t.startDate || '—',
    eta: t.endDate || '—',
    distanceKm: t.distance ?? 0,
    progressPercent:
      statusMap[t.tripStatus] === 'COMPLETED'
        ? 100
        : statusMap[t.tripStatus] === 'IN_PROGRESS'
        ? 55
        : 0,
  };
}

function mapInvoiceFromBackend(i: any): Invoice {
  return {
    id: i.invoiceId ?? i.id ?? Date.now(),
    invoiceNumber: i.invoiceNumber || '—',
    customerName: i.customerName || '—',
    amount: Number(i.gstAmount ?? i.amount ?? 0),
    status: (i.paymentStatus as Invoice['status']) || 'PENDING',
    issuedDate: i.invoiceDate || '—',
    dueDate: i.invoiceDate || '—',
    shipmentTracking: '—',
  };
}

export const mapShipment = mapShipmentFromBackend;
export const mapDriver = mapDriverFromBackend;
export const mapVehicle = mapVehicleFromBackend;
export const mapTrip = mapTripFromBackend;
export const mapInvoice = mapInvoiceFromBackend;
