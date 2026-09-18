import {
  Shipment,
  Driver,
  Vehicle,
  Trip,
  Invoice,
  LogisticsMetrics,
  Customer,
  FuelLog,
  Maintenance,
  ShipmentPriority,
  VehicleType,
  FuelType,
} from './types';
import {
  INITIAL_METRICS,
  INITIAL_SHIPMENTS,
  INITIAL_DRIVERS,
  INITIAL_VEHICLES,
  INITIAL_TRIPS,
  INITIAL_INVOICES,
  INITIAL_CUSTOMERS,
  INITIAL_FUEL_LOGS,
  INITIAL_MAINTENANCE,
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

/** Spring Data returns Page<T> = { content: [...], totalElements, ... } */
function unwrapPage<T>(body: unknown): T[] {
  if (Array.isArray(body)) return body as T[];
  if (body && typeof body === 'object' && Array.isArray((body as { content?: T[] }).content)) {
    return (body as { content: T[] }).content;
  }
  return [];
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
    let res: Response;
    try {
      res = await fetch(`${this.getApiUrl()}${path}`, {
        ...init,
        headers: { ...this.getAuthHeaders(), ...(init?.headers || {}) },
      });
    } catch {
      throw new ApiError('Unable to reach the API. Is the backend running?', 0);
    }
    if (res.status === 401 || res.status === 403) {
      throw new ApiError('Session expired or insufficient role for this action.', res.status);
    }
    if (!res.ok) {
      let message = `Request failed (${res.status})`;
      try {
        const body = await res.json();
        message = body.message || body.error || JSON.stringify(body);
      } catch {
        /* ignore */
      }
      throw new ApiError(message, res.status);
    }
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    if (!text || text.startsWith('"') || (!text.trim().startsWith('{') && !text.trim().startsWith('['))) {
      return text as unknown as T;
    }
    return JSON.parse(text) as T;
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
      const activeVehicles = vehicles.filter((v) => v.status === 'IN_TRANSIT').length;
      const fleetUtilizationPercent = vehicles.length
        ? Math.round((activeVehicles / vehicles.length) * 100)
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
        fleetUtilizationPercent,
        onTimeDeliveryRate,
        totalRevenueMonthly,
        availableDrivers,
        pendingDeliveries,
      };
    } catch {
      return INITIAL_METRICS;
    }
  }

  // ---------- customers ----------
  static async getCustomers(): Promise<Customer[]> {
    if (this.isDemoMode()) return this.getStoredList('rs_customers', INITIAL_CUSTOMERS);
    try {
      const body = await this.request<unknown>('/api/customer?size=100');
      return unwrapPage<any>(body).map(mapCustomerFromBackend);
    } catch (e) {
      console.warn('GET /api/customer unavailable, using fallback', e);
      return this.getStoredList('rs_customers', INITIAL_CUSTOMERS);
    }
  }

  static async createCustomer(data: {
    companyName: string;
    contactPerson: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    gst: string;
  }): Promise<Customer> {
    if (!this.isDemoMode()) {
      try {
        const created = await this.request<any>('/api/customer', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        return mapCustomerFromBackend(created);
      } catch (e) {
        if (e instanceof ApiError && e.status !== 0) throw e;
        console.warn('POST /api/customer failed, using local store', e);
      }
    }
    const customers = this.getStoredList('rs_customers', INITIAL_CUSTOMERS);
    const newCustomer: Customer = { id: Date.now(), ...data };
    this.setStoredList('rs_customers', [newCustomer, ...customers]);
    return newCustomer;
  }

  // ---------- shipments ----------
  static async getShipments(): Promise<Shipment[]> {
    if (this.isDemoMode()) return this.getStoredList('rs_shipments', INITIAL_SHIPMENTS);
    try {
      const body = await this.request<unknown>('/api/shipment?size=100');
      const list = unwrapPage<any>(body);
      if (list.length) return list.map((s) => mapShipmentFromBackend(s));
    } catch (e) {
      console.warn('GET /api/shipment unavailable, using fallback', e);
    }
    return this.getStoredList('rs_shipments', INITIAL_SHIPMENTS);
  }

  static async createShipment(shipment: Partial<Shipment> & { invoiceId?: number }): Promise<Shipment> {
    if (!this.isDemoMode()) {
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
        shipmentPriority: shipment.priority || 'MEDIUM',
        invoiceId: shipment.invoiceId,
      };
      if (!payload.invoiceId) {
        throw new ApiError(
          'An invoice is required to create a shipment. Create a customer and invoice first.',
          400
        );
      }
      const created = await this.request<any>('/api/shipment', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return mapShipmentFromBackend(created, shipment);
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
      priority: shipment.priority || 'MEDIUM',
      customerName: shipment.customerName || 'Walk-in Customer',
      customerEmail: shipment.customerEmail || 'logistics@routesphere.app',
      customerId: shipment.customerId,
      invoiceId: shipment.invoiceId,
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
      const body = await this.request<unknown>('/api/driver?size=100');
      const list = unwrapPage<any>(body);
      if (list.length) return list.map((d) => mapDriverFromBackend(d));
    } catch (e) {
      console.warn('GET /api/driver unavailable, using fallback', e);
    }
    return this.getStoredList('rs_drivers', INITIAL_DRIVERS);
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
        if (e instanceof ApiError && e.status !== 0) throw e;
        console.warn('POST /api/driver failed, using local store', e);
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
      const body = await this.request<unknown>('/api/vehicle?size=100');
      const list = unwrapPage<any>(body);
      if (list.length) return list.map((v) => mapVehicleFromBackend(v));
    } catch (e) {
      console.warn('GET /api/vehicle unavailable, using fallback', e);
    }
    return this.getStoredList('rs_vehicles', INITIAL_VEHICLES);
  }

  static async createVehicle(vehicleData: {
    plateNumber: string;
    model: string;
    capacityKg: number;
    type: VehicleType;
    fuelType?: FuelType;
  }): Promise<Vehicle> {
    if (!this.isDemoMode()) {
      try {
        const payload = {
          vehicleNumber: vehicleData.plateNumber,
          vehicleCapacity: vehicleData.capacityKg,
          vehicleType: vehicleData.type,
          fuelType: vehicleData.fuelType || 'DIESEL',
          vehicleStatus: 'AVAILABLE',
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
        if (e instanceof ApiError && e.status !== 0) throw e;
        console.warn('POST /api/vehicle failed, using local store', e);
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
      status: 'AVAILABLE',
      fuelEfficiencyKmPerL: 4.5,
      fuelType: vehicleData.fuelType || 'DIESEL',
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
    };
    this.setStoredList('rs_vehicles', [newVehicle, ...vehicles]);
    return newVehicle;
  }

  // ---------- trips ----------
  static async getTrips(): Promise<Trip[]> {
    if (this.isDemoMode()) return this.getStoredList('rs_trips', INITIAL_TRIPS);
    try {
      const body = await this.request<unknown>('/api/trip?size=100');
      const list = unwrapPage<any>(body);
      if (list.length) return list.map((t) => mapTripFromBackend(t));
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
        if (created && typeof created === 'object') return mapTripFromBackend(created);
      } catch (e) {
        if (e instanceof ApiError && e.status !== 0) throw e;
        console.warn('POST /api/trip failed, using local store', e);
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
    if (vehicle) {
      vehicle.status = 'IN_TRANSIT';
      this.setStoredList('rs_vehicles', [...vehicles]);
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
      const body = await this.request<unknown>('/api/invoice?size=100');
      const list = unwrapPage<any>(body);
      if (list.length) return list.map((i) => mapInvoiceFromBackend(i));
    } catch (e) {
      console.warn('GET /api/invoice unavailable, using fallback', e);
    }
    return this.getStoredList('rs_invoices', INITIAL_INVOICES);
  }

  static async createInvoice(data: {
    invoiceNumber: string;
    invoiceDate: string;
    gstAmount: number;
    paymentStatus: Invoice['status'];
    customerId: number;
  }): Promise<Invoice> {
    if (!this.isDemoMode()) {
      const payload = {
        invoiceNumber: data.invoiceNumber,
        invoiceDate: data.invoiceDate,
        gstAmount: data.gstAmount,
        paymentStatus: data.paymentStatus,
        customerId: data.customerId,
      };
      const created = await this.request<any>('/api/invoice', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return mapInvoiceFromBackend(created, data);
    }
    const invoices = this.getStoredList('rs_invoices', INITIAL_INVOICES);
    const newInvoice: Invoice = {
      id: Date.now(),
      invoiceNumber: data.invoiceNumber,
      customerName: 'Customer',
      customerId: data.customerId,
      amount: data.gstAmount,
      status: data.paymentStatus,
      issuedDate: data.invoiceDate,
      dueDate: data.invoiceDate,
      shipmentTracking: '—',
    };
    this.setStoredList('rs_invoices', [newInvoice, ...invoices]);
    return newInvoice;
  }

  // ---------- fuel logs ----------
  static async getFuelLogs(): Promise<FuelLog[]> {
    if (this.isDemoMode()) return this.getStoredList('rs_fuel', INITIAL_FUEL_LOGS);
    try {
      const body = await this.request<unknown>('/api/fuellog?size=100');
      const list = unwrapPage<any>(body);
      if (list.length) return list.map((f) => mapFuelLogFromBackend(f));
    } catch (e) {
      console.warn('GET /api/fuellog unavailable, using fallback', e);
    }
    return this.getStoredList('rs_fuel', INITIAL_FUEL_LOGS);
  }

  static async createFuelLog(data: {
    fuelQuantity: number;
    fuelCost: number;
    fuelStation: string;
    shipmentId: number;
  }): Promise<FuelLog> {
    if (!this.isDemoMode()) {
      const created = await this.request<any>('/api/fuellog', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return mapFuelLogFromBackend(created, data);
    }
    const logs = this.getStoredList('rs_fuel', INITIAL_FUEL_LOGS);
    const shipments = this.getStoredList('rs_shipments', INITIAL_SHIPMENTS);
    const shipment = shipments.find((s) => s.id === data.shipmentId);
    const newLog: FuelLog = {
      id: Date.now(),
      fuelQuantity: data.fuelQuantity,
      fuelCost: data.fuelCost,
      fuelStation: data.fuelStation,
      driverName: 'Assigned driver',
      shipmentId: data.shipmentId,
      customerName: shipment?.customerName,
    };
    this.setStoredList('rs_fuel', [newLog, ...logs]);
    return newLog;
  }

  // ---------- maintenance ----------
  static async getMaintenance(): Promise<Maintenance[]> {
    if (this.isDemoMode()) return this.getStoredList('rs_maintenance', INITIAL_MAINTENANCE);
    try {
      const body = await this.request<unknown>('/api/maintenance?size=100');
      const list = unwrapPage<any>(body);
      if (list.length) return list.map((m) => mapMaintenanceFromBackend(m));
    } catch (e) {
      console.warn('GET /api/maintenance unavailable, using fallback', e);
    }
    return this.getStoredList('rs_maintenance', INITIAL_MAINTENANCE);
  }

  static async createMaintenance(data: {
    serviceType: string;
    serviceCost: number;
    lastServiceDate: string;
    nextServiceDate?: string;
    remarks?: string;
    vehicleId: number;
    vehicleStatus: Maintenance['vehicleStatus'];
  }): Promise<Maintenance> {
    if (!this.isDemoMode()) {
      const created = await this.request<any>('/api/maintenance', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return mapMaintenanceFromBackend(created, data);
    }
    const records = this.getStoredList('rs_maintenance', INITIAL_MAINTENANCE);
    const newRecord: Maintenance = { id: Date.now(), ...data };
    this.setStoredList('rs_maintenance', [newRecord, ...records]);
    return newRecord;
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
  const priorityMap: Record<string, ShipmentPriority> = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    NORMAL: 'MEDIUM',
    EXPRESS: 'HIGH',
    URGENT: 'HIGH',
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
    priority: priorityMap[s.shipmentPriority] || fallback?.priority || 'MEDIUM',
    customerName: s.customerName || fallback?.customerName || 'Unknown customer',
    customerEmail: s.customerEmail || fallback?.customerEmail || '',
    customerId: s.customerId ?? fallback?.customerId,
    invoiceId: s.invoiceId ?? fallback?.invoiceId,
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
    AVAILABLE: 'AVAILABLE',
    ACTIVE: 'AVAILABLE',
    IN_TRANSIT: 'IN_TRANSIT',
    UNDER_MAINTENANCE: 'UNDER_SERVICE',
    IN_MAINTENANCE: 'UNDER_SERVICE',
    UNDER_SERVICE: 'UNDER_SERVICE',
    OUT_OF_SERVICE: 'UNDER_SERVICE',
    DECOMMISSIONED: 'AVAILABLE',
  };
  return {
    id: v.vehicleId ?? v.id ?? fallback?.id ?? Date.now(),
    plateNumber: v.vehicleNumber || fallback?.plateNumber || '',
    model: fallback?.model || `${v.vehicleType || 'VEHICLE'} Unit`,
    type: (v.vehicleType as VehicleType) || fallback?.type || 'TRUCK',
    capacityKg: v.vehicleCapacity ?? fallback?.capacityKg ?? 0,
    currentOdometerKm: v.odometer ?? fallback?.currentOdometerKm ?? 0,
    status: statusMap[v.vehicleStatus] || 'AVAILABLE',
    fuelEfficiencyKmPerL: fallback?.fuelEfficiencyKmPerL ?? 4.0,
    fuelType: (v.fuelType as FuelType) || fallback?.fuelType || 'DIESEL',
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
  const status = statusMap[t.tripStatus] || 'SCHEDULED';
  return {
    id: t.id ?? Date.now(),
    tripCode: t.tripNumber || `TRIP-${t.id ?? Math.floor(Date.now() / 1000)}`,
    shipmentId: t.shipmentId ?? 0,
    trackingNumber: t.shipmentTracking || '—',
    driverName: t.driverName || 'Unassigned',
    vehiclePlate: t.vehicleNumber || '—',
    origin: t.startLocation || '—',
    destination: t.endLocation || '—',
    status,
    startTime: t.startDate || '—',
    eta: t.endDate || '—',
    distanceKm: t.distance ?? 0,
    progressPercent: status === 'COMPLETED' ? 100 : status === 'IN_PROGRESS' ? 55 : 0,
  };
}

function mapInvoiceFromBackend(i: any, fallback?: Partial<Invoice>): Invoice {
  const statusMap: Record<string, Invoice['status']> = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
    OVERDUE: 'PENDING',
  };
  return {
    id: i.invoiceId ?? i.id ?? fallback?.id ?? Date.now(),
    invoiceNumber: i.invoiceNumber || fallback?.invoiceNumber || '—',
    customerName: i.customerName || fallback?.customerName || '—',
    customerId: i.customerId ?? fallback?.customerId,
    amount: Number(i.gstAmount ?? i.amount ?? fallback?.amount ?? 0),
    status: statusMap[i.paymentStatus] || fallback?.status || 'PENDING',
    issuedDate: i.invoiceDate || fallback?.issuedDate || '—',
    dueDate: i.invoiceDate || fallback?.dueDate || '—',
    shipmentTracking: '—',
  };
}

function mapCustomerFromBackend(c: any): Customer {
  return {
    id: c.customerId ?? c.id ?? Date.now(),
    companyName: c.companyName || '',
    contactPerson: c.contactPerson || '',
    email: c.email || '',
    city: c.city || '',
    state: c.state || '',
    address: c.address || '',
    pincode: c.pincode || '',
    country: c.country || '',
    gst: c.gst || '',
  };
}

function mapFuelLogFromBackend(f: any, fallback?: Partial<FuelLog>): FuelLog {
  return {
    id: f.id ?? fallback?.id ?? Date.now(),
    fuelQuantity: Number(f.fuelQuantity ?? fallback?.fuelQuantity ?? 0),
    fuelCost: Number(f.fuelCost ?? fallback?.fuelCost ?? 0),
    fuelStation: f.fuelStation || fallback?.fuelStation || '—',
    driverName: f.driverName || fallback?.driverName || '—',
    driverId: f.driverId ?? fallback?.driverId,
    shipmentId: f.shipmentId ?? fallback?.shipmentId ?? 0,
    customerName: f.customerName || fallback?.customerName,
    vehicleId: f.vehicleId ?? fallback?.vehicleId,
    vehicleNumber: f.vehicleNumber || fallback?.vehicleNumber,
  };
}

function mapMaintenanceFromBackend(m: any, fallback?: Partial<Maintenance>): Maintenance {
  return {
    id: m.MaintenanceId ?? m.maintenanceId ?? m.id ?? fallback?.id ?? Date.now(),
    serviceType: m.serviceType || fallback?.serviceType || '—',
    serviceCost: Number(m.serviceCost ?? fallback?.serviceCost ?? 0),
    lastServiceDate: m.lastServiceDate || fallback?.lastServiceDate || '—',
    nextServiceDate: m.nextServiceDate || fallback?.nextServiceDate,
    remarks: m.remarks || fallback?.remarks || '',
    vehicleStatus: m.vehicleStatus || fallback?.vehicleStatus || 'AVAILABLE',
    vehicleId: m.vehicleId ?? fallback?.vehicleId ?? 0,
  };
}

export const mapShipment = mapShipmentFromBackend;
export const mapDriver = mapDriverFromBackend;
export const mapVehicle = mapVehicleFromBackend;
export const mapTrip = mapTripFromBackend;
export const mapInvoice = mapInvoiceFromBackend;
export const mapCustomer = mapCustomerFromBackend;
export const mapFuelLog = mapFuelLogFromBackend;
export const mapMaintenance = mapMaintenanceFromBackend;
