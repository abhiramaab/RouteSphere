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
} from './types';
import {
  INITIAL_METRICS,
  INITIAL_SHIPMENTS,
  INITIAL_DRIVERS,
  INITIAL_VEHICLES,
  INITIAL_TRIPS,
  INITIAL_INVOICES,
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

import { CreateShipmentModal } from './components/modals/CreateShipmentModal';
import { CreateDriverModal } from './components/modals/CreateDriverModal';
import { CreateVehicleModal } from './components/modals/CreateVehicleModal';
import { TripDispatchModal } from './components/modals/TripDispatchModal';
import { ArchitectureModal } from './components/modals/ArchitectureModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { SectionHeading } from './components/ui/atoms';

export const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(RouteSphereApi.getSession());
  const [authed, setAuthed] = useState<boolean>(RouteSphereApi.isAuthenticated() || RouteSphereApi.isDemoMode());

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

  const [showShipment, setShowShipment] = useState(false);
  const [showDriver, setShowDriver] = useState(false);
  const [showVehicle, setShowVehicle] = useState(false);
  const [showArch, setShowArch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [dispatchTarget, setDispatchTarget] = useState<Shipment | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [m, s, d, v, t, i, c] = await Promise.all([
        RouteSphereApi.getMetrics(),
        RouteSphereApi.getShipments(),
        RouteSphereApi.getDrivers(),
        RouteSphereApi.getVehicles(),
        RouteSphereApi.getTrips(),
        RouteSphereApi.getInvoices(),
        RouteSphereApi.getCustomers(),
      ]);
      setMetrics(m);
      setShipments(s);
      setDrivers(d);
      setVehicles(v);
      setTrips(t);
      setInvoices(i);
      setCustomers(c);
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

  const handleCreateShipment = async (data: Partial<Shipment>) => {
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
    type: 'TRUCK' | 'VAN' | 'SEMI_TRUCK' | 'TRAILER';
    fuelType?: string;
  }) => {
    const created = await RouteSphereApi.createVehicle(data);
    setVehicles((prev) => [created, ...prev]);
    setShowVehicle(false);
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
    setDispatchTarget(null);
    setTab('trips');
  };

  const openDispatchFor = (s: Shipment) => setDispatchTarget(s);

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
    invoices: { title: 'Invoices', description: 'Billing, collections and payment status' },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-ink-50">
      <Sidebar
        currentTab={tab}
        onSelectTab={setTab}
        onOpenArchitecture={() => setShowArch(true)}
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
          onOpenDispatch={quickDispatch}
          onOpenSettings={() => setShowSettings(true)}
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
                  <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {demoMode ? 'Demo data' : 'Live API'}
                  </span>
                )
              }
            />

            {tab === 'overview' && (
              <OverviewScreen
                metrics={metrics}
                shipments={shipments}
                trips={trips}
                drivers={drivers}
                onOpenShipment={openDispatchFor}
                onGoToTab={setTab}
              />
            )}
            {tab === 'shipments' && (
              <ShipmentsScreen
                shipments={shipments}
                query={query}
                onCreate={() => setShowShipment(true)}
                onDispatch={openDispatchFor}
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
              />
            )}
            {tab === 'drivers' && (
              <DriversScreen
                drivers={drivers}
                query={query}
                onCreate={() => setShowDriver(true)}
              />
            )}
            {tab === 'invoices' && <InvoicesScreen invoices={invoices} query={query} />}
          </div>
        </main>
      </div>

      <CreateShipmentModal
        open={showShipment}
        onClose={() => setShowShipment(false)}
        onSubmit={handleCreateShipment}
        customers={customers}
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
      <TripDispatchModal
        shipment={dispatchTarget}
        drivers={drivers}
        vehicles={vehicles}
        onClose={() => setDispatchTarget(null)}
        onConfirm={handleDispatch}
      />
      <ArchitectureModal open={showArch} onClose={() => setShowArch(false)} />
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
