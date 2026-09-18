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

  public static async getDrivers(): Promise<Driver[]> {
    return this.getStoredList('rs_drivers', INITIAL_DRIVERS);
  }

  public static async getVehicles(): Promise<Vehicle[]> {
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
