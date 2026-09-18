export type ShipmentStatus = 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
export type ShipmentPriority = 'NORMAL' | 'EXPRESS' | 'URGENT';
export type DriverStatus = 'AVAILABLE' | 'ON_DUTY' | 'OFF_DUTY';
export type VehicleStatus = 'ACTIVE' | 'IN_MAINTENANCE' | 'DECOMMISSIONED';
export type VehicleType = 'TRUCK' | 'VAN' | 'TRAILER' | 'SEMI_TRUCK';
export type TripStatus = 'SCHEDULED' | 'DISPATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';

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
  amount: number;
  status: PaymentStatus;
  issuedDate: string;
  dueDate: string;
  shipmentTracking: string;
}

export interface LogisticsMetrics {
  activeShipments: number;
  fleetUtilizationPercent: number;
  onTimeDeliveryRate: number;
  totalRevenueMonthly: number;
  availableDrivers: number;
  pendingDeliveries: number;
}
