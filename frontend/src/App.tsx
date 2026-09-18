import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { MetricsCards } from './components/MetricsCards';
import { LiveRouteMap } from './components/LiveRouteMap';
import { ShipmentTable } from './components/ShipmentTable';
import { FleetGrid } from './components/FleetGrid';
import { DriverList } from './components/DriverList';
import { InvoiceList } from './components/InvoiceList';
import { TripDispatchModal } from './components/TripDispatchModal';
import { CreateDriverModal } from './components/CreateDriverModal';
import { CreateVehicleModal } from './components/CreateVehicleModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { RouteSphereApi } from './api';
import { 
  Shipment, 
  Driver, 
  Vehicle, 
  Trip, 
  Invoice, 
  LogisticsMetrics 
} from './types';
import { 
  INITIAL_METRICS, 
  INITIAL_SHIPMENTS, 
  INITIAL_DRIVERS, 
  INITIAL_VEHICLES, 
  INITIAL_TRIPS, 
  INITIAL_INVOICES 
} from './mockData';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [showArchModal, setShowArchModal] = useState<boolean>(false);
  const [showCreateDriverModal, setShowCreateDriverModal] = useState<boolean>(false);
  const [showCreateVehicleModal, setShowCreateVehicleModal] = useState<boolean>(false);
  const [showCreateShipmentModal, setShowCreateShipmentModal] = useState<boolean>(false);

  // Core domain state
  const [metrics, setMetrics] = useState<LogisticsMetrics>(INITIAL_METRICS);
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);

  // Dispatch state
  const [selectedShipmentForDispatch, setSelectedShipmentForDispatch] = useState<Shipment | null>(null);

  useEffect(() => {
    loadData();
  }, [isDemoMode]);

  const loadData = async () => {
    try {
      const [m, s, d, v, t, i] = await Promise.all([
        RouteSphereApi.getMetrics(),
        RouteSphereApi.getShipments(),
        RouteSphereApi.getDrivers(),
        RouteSphereApi.getVehicles(),
        RouteSphereApi.getTrips(),
        RouteSphereApi.getInvoices(),
      ]);
      setMetrics(m);
      setShipments(s);
      setDrivers(d);
      setVehicles(v);
      setTrips(t);
      setInvoices(i);
    } catch (e) {
      console.error('Error loading data, using local fallback', e);
    }
  };

  const handleToggleDemoMode = (val: boolean) => {
    setIsDemoMode(val);
    RouteSphereApi.setDemoMode(val);
  };

  const handleCreateShipment = async (data: Partial<Shipment>) => {
    const created = await RouteSphereApi.createShipment(data);
    setShipments((prev) => [created, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      activeShipments: prev.activeShipments + 1,
      pendingDeliveries: prev.pendingDeliveries + 1,
    }));
    setShowCreateShipmentModal(false);
  };

  const handleCreateDriver = async (data: {
    fullName: string;
    phone: string;
    licenseNumber: string;
    experienceYears?: number;
  }) => {
    const created = await RouteSphereApi.createDriver(data);
    setDrivers((prev) => [created, ...prev]);
    setShowCreateDriverModal(false);
  };

  const handleCreateVehicle = async (data: {
    plateNumber: string;
    model: string;
    capacityKg: number;
    type: 'TRUCK' | 'VAN' | 'SEMI_TRUCK';
  }) => {
    const created = await RouteSphereApi.createVehicle(data);
    setVehicles((prev) => [created, ...prev]);
    setShowCreateVehicleModal(false);
  };

  const handleDispatchTrip = async (data: {
    shipmentId: number;
    driverId: number;
    vehicleId: number;
  }) => {
    const newTrip = await RouteSphereApi.dispatchTrip(data);
    setTrips((prev) => [newTrip, ...prev]);
    
    // Update shipment status locally
    setShipments((prev) =>
      prev.map((s) => (s.id === data.shipmentId ? { ...s, status: 'IN_TRANSIT' } : s))
    );

    // Update driver status
    setDrivers((prev) =>
      prev.map((d) => (d.id === data.driverId ? { ...d, status: 'ON_DUTY' } : d))
    );

    setSelectedShipmentForDispatch(null);
    setCurrentTab('trips');
  };

  const handleTriggerQuickDispatch = () => {
    const pending = shipments.find((s) => s.status === 'PENDING') || shipments[0];
    if (pending) {
      setSelectedShipmentForDispatch(pending);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        onOpenArchitecture={() => setShowArchModal(true)}
        isDemoMode={isDemoMode}
        onToggleDemoMode={handleToggleDemoMode}
        onOpenCreateShipment={() => setShowCreateShipmentModal(true)}
        onOpenCreateDriver={() => setShowCreateDriverModal(true)}
        onOpenCreateVehicle={() => setShowCreateVehicleModal(true)}
        onOpenDispatch={handleTriggerQuickDispatch}
      />

      <div className="flex flex-1">
        {/* Left Operations Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenArchitecture={() => setShowArchModal(true)}
          shipmentsCount={shipments.length}
          activeTripsCount={trips.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-y-auto">
          {/* Overview Tab */}
          {currentTab === 'overview' && (
            <div className="space-y-6">
              <MetricsCards metrics={metrics} />

              <LiveRouteMap
                trips={trips}
                onSelectTrip={() => setCurrentTab('trips')}
                onOpenDispatch={handleTriggerQuickDispatch}
              />

              <ShipmentTable
                shipments={shipments}
                onCreateShipment={handleCreateShipment}
                onDispatchTrip={(s) => setSelectedShipmentForDispatch(s)}
                forceOpenModal={showCreateShipmentModal}
                onCloseModal={() => setShowCreateShipmentModal(false)}
              />
            </div>
          )}

          {/* Shipments Tab */}
          {currentTab === 'shipments' && (
            <div className="space-y-6">
              <ShipmentTable
                shipments={shipments}
                onCreateShipment={handleCreateShipment}
                onDispatchTrip={(s) => setSelectedShipmentForDispatch(s)}
                forceOpenModal={showCreateShipmentModal}
                onCloseModal={() => setShowCreateShipmentModal(false)}
              />
            </div>
          )}

          {/* Trips & Dispatch Tab */}
          {currentTab === 'trips' && (
            <div className="space-y-6">
              <LiveRouteMap 
                trips={trips} 
                onOpenDispatch={handleTriggerQuickDispatch}
              />
            </div>
          )}

          {/* Fleet & Vehicles Tab */}
          {currentTab === 'fleet' && (
            <div className="space-y-6">
              <FleetGrid 
                vehicles={vehicles} 
                onOpenCreateVehicle={() => setShowCreateVehicleModal(true)}
              />
            </div>
          )}

          {/* Drivers Tab */}
          {currentTab === 'drivers' && (
            <div className="space-y-6">
              <DriverList 
                drivers={drivers} 
                onOpenCreateDriver={() => setShowCreateDriverModal(true)}
              />
            </div>
          )}

          {/* Invoices & Billing Tab */}
          {currentTab === 'invoices' && (
            <div className="space-y-6">
              <InvoiceList invoices={invoices} />
            </div>
          )}
        </main>
      </div>

      {/* Dispatch Modal */}
      {selectedShipmentForDispatch && (
        <TripDispatchModal
          shipment={selectedShipmentForDispatch}
          drivers={drivers}
          vehicles={vehicles}
          onClose={() => setSelectedShipmentForDispatch(null)}
          onConfirmDispatch={handleDispatchTrip}
        />
      )}

      {/* Create Driver Modal */}
      {showCreateDriverModal && (
        <CreateDriverModal
          onClose={() => setShowCreateDriverModal(false)}
          onSubmit={handleCreateDriver}
        />
      )}

      {/* Create Vehicle Modal */}
      {showCreateVehicleModal && (
        <CreateVehicleModal
          onClose={() => setShowCreateVehicleModal(false)}
          onSubmit={handleCreateVehicle}
        />
      )}

      {/* Architecture Modal */}
      {showArchModal && (
        <ArchitectureModal onClose={() => setShowArchModal(false)} />
      )}
    </div>
  );
};
export default App;
