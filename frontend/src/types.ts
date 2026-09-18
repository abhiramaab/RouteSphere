export type ShipmentStatus = 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
export type ShipmentPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type DriverStatus = 'AVAILABLE' | 'ON_DUTY' | 'OFF_DUTY';
export type VehicleStatus = 'AVAILABLE' | 'IN_TRANSIT' | 'UNDER_SERVICE';
export type VehicleType = 'TRUCK' | 'VAN' | 'MINI_TRUCK' | 'CONTAINER';
export type FuelType = 'PETROL' | 'DIESEL' | 'ELECTRIC';
export type TripStatus = 'SCHEDULED' | 'DISPATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Shipment {
  id: number;
  trackingNumber: string;
  origin: string;
  destination: string;
  weightKg: number;
  status: ShipmentStatus;
  priority: ShipmentPriority;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  estimatedDelivery: string;
  assignedDriverId?: number;
  assignedVehicleId?: number;
  customerId?: number;
  invoiceId?: number;
}

export interface Driver {
  id: number;
  fullName: string;
  licenseNumber: string;
  phone: string;
  status: DriverStatus;
  assignedVehiclePlate?: string;
  tripsCompleted: number;
  rating: number;
  experienceYears?: number;
  avatarUrl: string;
}

export interface Vehicle {
  id: number;
  plateNumber: string;
  model: string;
  type: VehicleType;
  capacityKg: number;
  currentOdometerKm: number;
  status: VehicleStatus;
  fuelEfficiencyKmPerL: number;
  fuelType?: FuelType;
  lastMaintenanceDate: string;
}

export interface Trip {
  id: number;
  tripCode: string;
  shipmentId: number;
  trackingNumber: string;
  driverName: string;
  vehiclePlate: string;
  origin: string;
  destination: string;
  status: TripStatus;
  startTime: string;
  eta: string;
  distanceKm: number;
  progressPercent: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  customerId?: number;
  amount: number;
  status: PaymentStatus;
  issuedDate: string;
  dueDate: string;
  shipmentTracking: string;
}

export interface Customer {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  city: string;
  state?: string;
  address?: string;
  pincode?: string;
  country?: string;
  gst?: string;
}

export interface FuelLog {
  id: number;
  fuelQuantity: number;
  fuelCost: number;
  fuelStation: string;
  driverName: string;
  driverId?: number;
  shipmentId: number;
  customerName?: string;
  vehicleId?: number;
  vehicleNumber?: string;
}

export interface Maintenance {
  id: number;
  serviceType: string;
  serviceCost: number;
  lastServiceDate: string;
  nextServiceDate?: string;
  remarks?: string;
  vehicleStatus: VehicleStatus;
  vehicleId: number;
}

export interface LogisticsMetrics {
  activeShipments: number;
  fleetUtilizationPercent: number;
  onTimeDeliveryRate: number;
  totalRevenueMonthly: number;
  availableDrivers: number;
  pendingDeliveries: number;
}
