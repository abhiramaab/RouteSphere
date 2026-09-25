# RouteSphere REST API Reference

Comprehensive endpoint contracts for RouteSphere's logistics and fleet management platform.

## Base URL
* Local Backend: `http://localhost:8080`
* Operations Dashboard: `https://routesphere.abhiram.tech`
* Swagger UI: `http://localhost:8080/swagger-ui/index.html`

---

## 1. Authentication
* `POST /api/auth/register` - Create new operator profile
* `POST /api/auth/login` - Authenticate with email/password and obtain HMAC JWT bearer token

---

## 2. Shipment & Dispatch Management
* `POST /api/shipments` - Create shipment manifest with consignments and route
* `GET /api/shipments` - List all shipments with status and origin/destination filters
* `GET /api/shipments/{id}` - Fetch single shipment details and tracking milestones
* `PUT /api/shipments/{id}` - Advance shipment milestone (`IN_TRANSIT`, `DELIVERED`)

---

## 3. Fleet & Vehicle Telematics
* `POST /api/vehicles` - Register vehicle asset (make, model, license, capacity)
* `GET /api/vehicles` - List fleet inventory and availability status
* `POST /api/drivers` - Register driver profile and licensing credentials
* `POST /api/fuel-logs` - Record fueling expenditure, liters, and odometer reading
* `POST /api/maintenance` - Record or schedule vehicle servicing

---

## 4. Invoicing & Billing
* `POST /api/invoices` - Generate customer invoice for completed shipment
* `GET /api/invoices/{id}` - Fetch invoice billing status and line items
* `PUT /api/invoices/{id}/pay` - Record invoice settlement payment
