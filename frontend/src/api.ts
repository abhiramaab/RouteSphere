import { Shipment, Driver, Vehicle, Trip, Invoice, LogisticsMetrics } from './types';
import { 
  INITIAL_METRICS, 
  INITIAL_SHIPMENTS, 
  INITIAL_DRIVERS, 
  INITIAL_VEHICLES, 
  INITIAL_TRIPS, 
  INITIAL_INVOICES 
} from './mockData';

const BACKEND_URL_KEY = 'routesphere_api_url';
const TOKEN_KEY = 'routesphere_jwt_token';
const DEMO_MODE_KEY = 'routesphere_demo_mode';

export class RouteSphereApi {
  private static isDemoMode(): boolean {
    const val = localStorage.getItem(DEMO_MODE_KEY);
    return val === null ? true : val === 'true';
  }

  public static setDemoMode(enable: boolean) {
    localStorage.setItem(DEMO_MODE_KEY, String(enable));
  }

  public static getApiUrl(): string {
    return localStorage.getItem(BACKEND_URL_KEY) || 'http://localhost:8080';
  }

  public static setApiUrl(url: string) {
    localStorage.setItem(BACKEND_URL_KEY, url);
  }

  public static getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public static setStoredToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  // In-memory / local storage cache for demo mode
  private static getStoredList<T>(key: string, defaultData: T[]): T[] {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return defaultData;
    }
  }

  private static setStoredList<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public static async getMetrics(): Promise<LogisticsMetrics> {
    return INITIAL_METRICS;
  }

  public static async getShipments(): Promise<Shipment[]> {
    if (this.isDemoMode()) {
      return this.getStoredList('rs_shipments', INITIAL_SHIPMENTS);
    }
    try {
      const res = await fetch(`${this.getApiUrl()}/api/shipments`, {
        headers: this.getAuthHeaders()
      });
      if (!res.ok) throw new Error('API offline');
      return await res.json();
    } catch {
      return this.getStoredList('rs_shipments', INITIAL_SHIPMENTS);
    }
  }

  public static async createShipment(shipment: Partial<Shipment>): Promise<Shipment> {
    if (!this.isDemoMode()) {
      try {
        const payload = {
          trackingNumber: `RS-${shipment.origin?.slice(0, 3).toUpperCase() || 'IND'}-${Math.floor(1000 + Math.random() * 9000)}`,
          pickupLocation: shipment.origin || 'Bengaluru Hub',
          deliveryLocation: shipment.destination || 'Mumbai Terminal',
          pickupDate: new Date().toISOString().split('T')[0],
          deliveryDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0],
          weight: shipment.weightKg || 1500,
          shipmentPriority: shipment.priority || 'NORMAL',
          invoiceId: 1
        };
        const res = await fetch(`${this.getApiUrl()}/api/shipments`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const createdBackend = await res.json();
          return {
            id: createdBackend.id || Date.now(),
            trackingNumber: createdBackend.trackingNumber || payload.trackingNumber,
            origin: createdBackend.pickupLocation || payload.pickupLocation,
            destination: createdBackend.deliveryLocation || payload.deliveryLocation,
            weightKg: createdBackend.weight || payload.weight,
            status: createdBackend.shipmentStatus || 'PENDING',
            priority: createdBackend.shipmentPriority || payload.shipmentPriority,
            customerName: shipment.customerName || 'Reliance Retail Supply',
            customerEmail: shipment.customerEmail || 'logistics@reliance.com',
            createdAt: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
          };
        }
      } catch (e) {
        console.warn('Backend POST /api/shipments unavailable, falling back to local store', e);
      }
    }

    const shipments = this.getStoredList('rs_shipments', INITIAL_SHIPMENTS);
    const trackingCode = `RS-${shipment.origin?.slice(0, 3).toUpperCase() || 'IND'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newShipment: Shipment = {
      id: Date.now(),
      trackingNumber: trackingCode,
      origin: shipment.origin || 'Bengaluru Hub',
      destination: shipment.destination || 'Mumbai Terminal',
      weightKg: shipment.weightKg || 1200,
      status: 'PENDING',
      priority: shipment.priority || 'NORMAL',
      customerName: shipment.customerName || 'Reliance Retail Supply',
      customerEmail: shipment.customerEmail || 'logistics@reliance.com',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    };
    const updated = [newShipment, ...shipments];
    this.setStoredList('rs_shipments', updated);
    return newShipment;
  }

  public static async createDriver(driverData: {
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
          driverLicenseExpiry: new Date(Date.now() + 365 * 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
          experienceYears: driverData.experienceYears || 5.0
        };
        const res = await fetch(`${this.getApiUrl()}/api/drivers`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const backendDriver = await res.json();
          return {
            id: backendDriver.id || Date.now(),
            fullName: backendDriver.driverName || driverData.fullName,
            licenseNumber: backendDriver.driverLicenseNumber || driverData.licenseNumber,
            phone: backendDriver.driverPhone || driverData.phone,
            status: backendDriver.driverStatus || 'AVAILABLE',
            tripsCompleted: 0,
            rating: 5.0,
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          };
        }
      } catch (e) {
        console.warn('Backend POST /api/drivers unavailable, falling back to local store', e);
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
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    };
    const updated = [newDriver, ...drivers];
    this.setStoredList('rs_drivers', updated);
    return newDriver;
  }

  public static async createVehicle(vehicleData: {
    plateNumber: string;
    model: string;
    capacityKg: number;
    type: 'TRUCK' | 'VAN' | 'SEMI_TRUCK';
  }): Promise<Vehicle> {
    if (!this.isDemoMode()) {
      try {
        const payload = {
          vehicleNumber: vehicleData.plateNumber,
          vehicleCapacity: vehicleData.capacityKg,
          vehicleType: vehicleData.type,
          fuelType: 'DIESEL',
          vehicleStatus: 'ACTIVE',
          insuranceExpiry: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0]
        };
        const res = await fetch(`${this.getApiUrl()}/api/vehicles`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const backendVehicle = await res.json();
          return {
            id: backendVehicle.id || Date.now(),
            plateNumber: backendVehicle.vehicleNumber || vehicleData.plateNumber,
            model: vehicleData.model,
            type: backendVehicle.vehicleType || vehicleData.type,
            capacityKg: backendVehicle.vehicleCapacity || vehicleData.capacityKg,
            currentOdometerKm: 0,
            status: backendVehicle.vehicleStatus || 'ACTIVE',
            fuelEfficiencyKmPerL: 4.5,
            lastMaintenanceDate: new Date().toISOString().split('T')[0]
          };
        }
      } catch (e) {
        console.warn('Backend POST /api/vehicles unavailable, falling back to local store', e);
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
      lastMaintenanceDate: new Date().toISOString().split('T')[0]
    };
    const updated = [newVehicle, ...vehicles];
    this.setStoredList('rs_vehicles', updated);
    return newVehicle;
  }

  public static async getDrivers(): Promise<Driver[]> {
    if (!this.isDemoMode()) {
      try {
        const res = await fetch(`${this.getApiUrl()}/api/drivers`, {
          headers: this.getAuthHeaders()
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            return list.map((d: any) => ({
              id: d.id,
              fullName: d.driverName,
              licenseNumber: d.driverLicenseNumber,
              phone: d.driverPhone,
              status: d.driverStatus || 'AVAILABLE',
              assignedVehiclePlate: d.assignedVehicleNumber,
              tripsCompleted: d.tripsCompleted || 0,
              rating: 4.8,
              avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
            }));
          }
        }
      } catch (e) {
        console.warn('Backend GET /api/drivers unavailable, using fallback', e);
      }
    }
    return this.getStoredList('rs_drivers', INITIAL_DRIVERS);
  }

  public static async getVehicles(): Promise<Vehicle[]> {
    if (!this.isDemoMode()) {
      try {
        const res = await fetch(`${this.getApiUrl()}/api/vehicles`, {
          headers: this.getAuthHeaders()
        });
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            return list.map((v: any) => ({
              id: v.id,
              plateNumber: v.vehicleNumber,
              model: `${v.vehicleType} Haulage Unit`,
              type: v.vehicleType || 'TRUCK',
              capacityKg: v.vehicleCapacity || 15000,
              currentOdometerKm: v.odometer || 45000,
              status: v.vehicleStatus || 'ACTIVE',
              fuelEfficiencyKmPerL: 4.0,
              lastMaintenanceDate: v.insuranceExpiry || '2026-09-01'
            }));
          }
        }
      } catch (e) {
        console.warn('Backend GET /api/vehicles unavailable, using fallback', e);
      }
    }
    return this.getStoredList('rs_vehicles', INITIAL_VEHICLES);
  }

  public static async getTrips(): Promise<Trip[]> {
    return this.getStoredList('rs_trips', INITIAL_TRIPS);
  }

  public static async dispatchTrip(tripData: {
    shipmentId: number;
    driverId: number;
    vehicleId: number;
  }): Promise<Trip> {
    if (!this.isDemoMode()) {
      try {
        const payload = {
          tripNumber: `TRIP-EXP-${Date.now().toString().slice(-6)}`,
          startLocation: 'Bengaluru Hub',
          endLocation: 'Mumbai Terminal',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0],
          tripStatus: 'IN_PROGRESS',
          distance: 980.0,
          vehicleStatus: 'ACTIVE',
          shipmentId: tripData.shipmentId
        };
        await fetch(`${this.getApiUrl()}/api/trips`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload)
        });
      } catch (e) {
        console.warn('Backend POST /api/trips unavailable, using fallback', e);
      }
    }

    const shipments = this.getStoredList('rs_shipments', INITIAL_SHIPMENTS);
    const drivers = this.getStoredList('rs_drivers', INITIAL_DRIVERS);
    const vehicles = this.getStoredList('rs_vehicles', INITIAL_VEHICLES);
    const trips = this.getStoredList('rs_trips', INITIAL_TRIPS);

    const shipment = shipments.find(s => s.id === tripData.shipmentId);
    const driver = drivers.find(d => d.id === tripData.driverId);
    const vehicle = vehicles.find(v => v.id === tripData.vehicleId);

    if (shipment) {
      shipment.status = 'IN_TRANSIT';
      shipment.assignedDriverId = driver?.id;
      shipment.assignedVehicleId = vehicle?.id;
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
      eta: '48h Estimated',
      distanceKm: 850,
      progressPercent: 5,
    };

    const updatedTrips = [newTrip, ...trips];
    this.setStoredList('rs_trips', updatedTrips);
    return newTrip;
  }

  public static async getInvoices(): Promise<Invoice[]> {
    return this.getStoredList('rs_invoices', INITIAL_INVOICES);
  }

  private static getAuthHeaders(): HeadersInit {
    const token = this.getStoredToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }
}
