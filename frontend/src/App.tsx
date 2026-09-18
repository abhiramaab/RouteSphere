import React, { useCallback, useEffect, useState } from 'react';
import { RouteSphereApi, type Session } from './api';
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
} from './types';
import {
  INITIAL_METRICS,
  INITIAL_CUSTOMERS,
} from './mockData';

import { LoginScreen } from './components/screens/LoginScreen';
import { Sidebar, NavTab } from './components/shell/Sidebar';
import { Topbar } from './components/shell/Topbar';
import { OverviewScreen } from './components/screens/OverviewScreen';
import { ShipmentsScreen } from './components/screens/ShipmentsScreen';
import { FleetScreen } from './components/screens/FleetScreen';
import { DriversScreen } from './components/screens/DriversScreen';
import { TripsScreen } from './components/screens/TripsScreen';
import { InvoicesScreen } from './components/screens/InvoicesScreen';
import { CustomersScreen } from './components/screens/CustomersScreen';
import { FuelLogsScreen } from './components/screens/FuelLogsScreen';
import { MaintenanceScreen } from './components/screens/MaintenanceScreen';

import { CreateShipmentModal } from './components/modals/CreateShipmentModal';
import { CreateDriverModal } from './components/modals/CreateDriverModal';
import { CreateVehicleModal } from './components/modals/CreateVehicleModal';
import { CreateInvoiceModal } from './components/modals/CreateInvoiceModal';
import { CreateCustomerModal } from './components/modals/CreateCustomerModal';
import { CreateFuelLogModal } from './components/modals/CreateFuelLogModal';
import { CreateMaintenanceModal } from './components/modals/CreateMaintenanceModal';
import { TripDispatchModal } from './components/modals/TripDispatchModal';
import { ArchitectureModal } from './components/modals/ArchitectureModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { DocumentationModal } from './components/modals/DocumentationModal';
import { SectionHeading } from './components/ui/atoms';

export const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(RouteSphereApi.getSession());
  const [authed, setAuthed] = useState<boolean>(
    RouteSphereApi.isAuthenticated() || RouteSphereApi.isDemoMode()
  );

  const [tab, setTab] = useState<NavTab>('overview');
  const [demoMode, setDemoMode] = useState(RouteSphereApi.isDemoMode());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [metrics, setMetrics] = useState<LogisticsMetrics>(INITIAL_METRICS);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);

  // modals
  const [showShipment, setShowShipment] = useState(false);
  const [showDriver, setShowDriver] = useState(false);
  const [showVehicle, setShowVehicle] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const [showFuel, setShowFuel] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [showArch, setShowArch] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [dispatchTarget, setDispatchTarget] = useState<Shipment | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [m, s, d, v, t, i, c, f, mt] = await Promise.all([
        RouteSphereApi.getMetrics(),
        RouteSphereApi.getShipments(),
        RouteSphereApi.getDrivers(),
        RouteSphereApi.getVehicles(),
        RouteSphereApi.getTrips(),
        RouteSphereApi.getInvoices(),
        RouteSphereApi.getCustomers(),
        RouteSphereApi.getFuelLogs(),
        RouteSphereApi.getMaintenance(),
      ]);
      setMetrics(m);
      setShipments(s);
      setDrivers(d);
      setVehicles(v);
      setTrips(t);
      setInvoices(i);
      setCustomers(c);
      setFuelLogs(f);
      setMaintenance(mt);
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) void loadData();
  }, [authed, loadData, demoMode]);

  const handleToggleDemoMode = (v: boolean) => {
    setDemoMode(v);
    RouteSphereApi.setDemoMode(v);
  };

  const handleLogout = () => {
    RouteSphereApi.logout();
    setSession(null);
    setAuthed(false);
  };

  // ----- create handlers -----
  const handleCreateShipment = async (data: Partial<Shipment> & { invoiceId: number }) => {
    const created = await RouteSphereApi.createShipment(data);
    setShipments((prev) => [created, ...prev]);
    setShowShipment(false);
    void loadData();
  };

  const handleCreateDriver = async (data: {
    fullName: string;
    phone: string;
    licenseNumber: string;
    experienceYears?: number;
  }) => {
    const created = await RouteSphereApi.createDriver(data);
    setDrivers((prev) => [created, ...prev]);
    setShowDriver(false);
  };

  const handleCreateVehicle = async (data: {
    plateNumber: string;
    model: string;
    capacityKg: number;
    type: Vehicle['type'];
    fuelType?: Vehicle['fuelType'];
  }) => {
    const created = await RouteSphereApi.createVehicle(data);
    setVehicles((prev) => [created, ...prev]);
    setShowVehicle(false);
  };

  const handleCreateInvoice = async (data: {
    invoiceNumber: string;
    invoiceDate: string;
    gstAmount: number;
    paymentStatus: Invoice['status'];
    customerId: number;
  }) => {
    const created = await RouteSphereApi.createInvoice(data);
    setInvoices((prev) => [created, ...prev]);
    setShowInvoice(false);
    void loadData();
  };

  const handleCreateCustomer = async (data: {
    companyName: string;
    contactPerson: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    gst: string;
  }) => {
    const created = await RouteSphereApi.createCustomer(data);
    setCustomers((prev) => [created, ...prev]);
    setShowCustomer(false);
  };

  const handleCreateFuel = async (data: {
    fuelQuantity: number;
    fuelCost: number;
    fuelStation: string;
    shipmentId: number;
  }) => {
    const created = await RouteSphereApi.createFuelLog(data);
    setFuelLogs((prev) => [created, ...prev]);
    setShowFuel(false);
  };

  const handleCreateMaintenance = async (data: {
    serviceType: string;
    serviceCost: number;
    lastServiceDate: string;
    nextServiceDate?: string;
    remarks?: string;
    vehicleId: number;
    vehicleStatus: Maintenance['vehicleStatus'];
  }) => {
    const created = await RouteSphereApi.createMaintenance(data);
    setMaintenance((prev) => [created, ...prev]);
    setShowMaintenance(false);
    void loadData();
  };

  const handleDispatch = async (data: {
    shipmentId: number;
    driverId: number;
    vehicleId: number;
  }) => {
    const trip = await RouteSphereApi.dispatchTrip(data);
    setTrips((prev) => [trip, ...prev]);
    setShipments((prev) =>
      prev.map((s) => (s.id === data.shipmentId ? { ...s, status: 'IN_TRANSIT' } : s))
    );
    setDrivers((prev) =>
      prev.map((d) => (d.id === data.driverId ? { ...d, status: 'ON_DUTY' } : d))
    );
    setVehicles((prev) =>
      prev.map((v) => (v.id === data.vehicleId ? { ...v, status: 'IN_TRANSIT' } : v))
    );
    setDispatchTarget(null);
    setTab('trips');
  };

  const quickDispatch = () => {
    const pending = shipments.find((s) => s.status === 'PENDING');
    if (pending) setDispatchTarget(pending);
    else setTab('shipments');
  };

  if (!authed) {
    return (
      <LoginScreen
        onLoggedIn={() => {
          setSession(RouteSphereApi.getSession());
          setAuthed(true);
        }}
      />
    );
  }

  const headings: Record<NavTab, { title: string; description: string }> = {
    overview: { title: 'Operations overview', description: 'Live network health at a glance' },
    shipments: { title: 'Shipments', description: 'Track and dispatch consignments' },
    trips: { title: 'Trips & dispatch', description: 'Active routes and driver assignments' },
    fleet: { title: 'Fleet', description: 'Vehicle status, capacity and utilization' },
    drivers: { title: 'Drivers', description: 'Directory, availability and performance' },
    customers: { title: 'Customers', description: 'Accounts that own invoices and shipments' },
    invoices: { title: 'Invoices', description: 'Billing, collections and payment status' },
    fuel: { title: 'Fuel logs', description: 'Consumption, cost and per-litre rate' },
    maintenance: { title: 'Maintenance', description: 'Service history and upcoming services' },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-ink-50">
      <Sidebar
        currentTab={tab}
        onSelectTab={setTab}
        onOpenArchitecture={() => setShowArch(true)}
        onOpenDocs={() => setShowDocs(true)}
        shipmentsCount={shipments.length}
        activeTripsCount={trips.filter((t) => t.status === 'IN_PROGRESS').length}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        mobileOpen={mobileNav}
        onCloseMobile={() => setMobileNav(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobile={() => setMobileNav(true)}
          onOpenCreateShipment={() => setShowShipment(true)}
          onOpenCreateDriver={() => setShowDriver(true)}
          onOpenCreateVehicle={() => setShowVehicle(true)}
          onCreateInvoice={() => setShowInvoice(true)}
          onCreateCustomer={() => setShowCustomer(true)}
          onCreateFuel={() => setShowFuel(true)}
          onCreateMaintenance={() => setShowMaintenance(true)}
          onOpenDispatch={quickDispatch}
          onOpenSettings={() => setShowSettings(true)}
          onOpenDocs={() => setShowDocs(true)}
          onLogout={handleLogout}
          session={session}
          demoMode={demoMode}
          onToggleDemoMode={handleToggleDemoMode}
          query={query}
          onQueryChange={setQuery}
        />

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto max-w-[1400px]">
            <SectionHeading
              title={headings[tab].title}
              description={headings[tab].description}
              action={
                loading ? (
                  <span className="flex items-center gap-2 text-[12px] text-ink-400">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink-200 border-t-brand-500" />
                    Syncing…
                  </span>
                ) : (
                  <button
                    onClick={() => setShowDocs(true)}
                    className="text-[12px] font-semibold text-brand-600 hover:text-brand-700"
                  >
                    How it works →
                  </button>
                )
              }
            />

            {tab === 'overview' && (
              <OverviewScreen
                metrics={metrics}
                shipments={shipments}
                trips={trips}
                drivers={drivers}
                onOpenShipment={(s) => setDispatchTarget(s)}
                onGoToTab={setTab}
              />
            )}
            {tab === 'shipments' && (
              <ShipmentsScreen
                shipments={shipments}
                query={query}
                onCreate={() => setShowShipment(true)}
                onDispatch={(s) => setDispatchTarget(s)}
                onRefresh={loadData}
              />
            )}
            {tab === 'trips' && (
              <TripsScreen trips={trips} query={query} onDispatch={quickDispatch} />
            )}
            {tab === 'fleet' && (
              <FleetScreen
                vehicles={vehicles}
                query={query}
                onCreate={() => setShowVehicle(true)}
                onCreateMaintenance={() => setShowMaintenance(true)}
              />
            )}
            {tab === 'drivers' && (
              <DriversScreen drivers={drivers} query={query} onCreate={() => setShowDriver(true)} />
            )}
            {tab === 'customers' && (
              <CustomersScreen
                customers={customers}
                query={query}
                onCreate={() => setShowCustomer(true)}
                onCreateInvoice={() => setShowInvoice(true)}
              />
            )}
            {tab === 'invoices' && (
              <InvoicesScreen
                invoices={invoices}
                query={query}
                onCreate={() => setShowInvoice(true)}
              />
            )}
            {tab === 'fuel' && (
              <FuelLogsScreen fuelLogs={fuelLogs} query={query} onCreate={() => setShowFuel(true)} />
            )}
            {tab === 'maintenance' && (
              <MaintenanceScreen
                records={maintenance}
                vehicles={vehicles}
                query={query}
                onCreate={() => setShowMaintenance(true)}
              />
            )}
          </div>
        </main>
      </div>

      {/* create chain */}
      <CreateCustomerModal
        open={showCustomer}
        onClose={() => setShowCustomer(false)}
        onSubmit={handleCreateCustomer}
      />
      <CreateInvoiceModal
        open={showInvoice}
        onClose={() => setShowInvoice(false)}
        onSubmit={handleCreateInvoice}
        customers={customers}
        onCreateCustomer={() => {
          setShowInvoice(false);
          setShowCustomer(true);
        }}
      />
      <CreateShipmentModal
        open={showShipment}
        onClose={() => setShowShipment(false)}
        onSubmit={handleCreateShipment}
        invoices={invoices}
        onCreateInvoice={() => {
          setShowShipment(false);
          setShowInvoice(true);
        }}
      />
      <CreateDriverModal
        open={showDriver}
        onClose={() => setShowDriver(false)}
        onSubmit={handleCreateDriver}
      />
      <CreateVehicleModal
        open={showVehicle}
        onClose={() => setShowVehicle(false)}
        onSubmit={handleCreateVehicle}
      />
      <CreateFuelLogModal
        open={showFuel}
        onClose={() => setShowFuel(false)}
        onSubmit={handleCreateFuel}
        shipments={shipments}
      />
      <CreateMaintenanceModal
        open={showMaintenance}
        onClose={() => setShowMaintenance(false)}
        onSubmit={handleCreateMaintenance}
        vehicles={vehicles}
      />
      <TripDispatchModal
        shipment={dispatchTarget}
        drivers={drivers}
        vehicles={vehicles}
        onClose={() => setDispatchTarget(null)}
        onConfirm={handleDispatch}
      />
      <ArchitectureModal open={showArch} onClose={() => setShowArch(false)} />
      <DocumentationModal open={showDocs} onClose={() => setShowDocs(false)} />
      <SettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        demoMode={demoMode}
        onToggleDemoMode={handleToggleDemoMode}
        onSaved={loadData}
      />
    </div>
  );
};

export default App;
