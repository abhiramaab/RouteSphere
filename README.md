# RouteSphere - Logistics and Fleet Management

## Overview

RouteSphere is a RESTful backend application developed using Spring Boot for logistics and fleet management operations. The application provides APIs for managing customers, shipments, drivers, vehicles, trips, invoices, fuel logs, and vehicle maintenance while implementing JWT-based authentication and role-based authorization.

---

# Technology Stack

- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- Hibernate
- MySQL
- Maven
- JWT Authentication
- Swagger / OpenAPI
- Resend Email API
- Lombok
- SLF4J + Logback

---

# Features

# Features

- JWT Authentication
- Role-Based Authorization
- Customer Management
- Driver Management
- Vehicle Management
- Shipment Management
- Trip Management
- Invoice Management
- Fuel Log Management
- Vehicle Maintenance Management
- Automated Shipment Email Notifications
- Automated Payment Confirmation Emails
- Logging using SLF4J & Logback
- Global Exception Handling
- Swagger API Documentation

---

# Project Structure

```
# Project Structure

```text
src/main/java/com/RouteSphere/REST/
│
├── config/
│   ├── OpenApiConfig.java
│   ├── PasswordConfig.java
|   ├── ResendConfig.java
│   ├── SecurityConfig.java
│   └── SwaggerSecurityConfig.java
│
├── controller/
│   ├── AuthController.java
│   ├── CustomerController.java
│   ├── DriverController.java
│   ├── FuelLogController.java
│   ├── InvoiceController.java
│   ├── MaintenanceController.java
│   ├── ShipmentController.java
│   ├── TripController.java
│   ├── UserController.java
│   └── VehicleController.java
│
├── dto/
│   ├── Request/
│   │   ├── CreateCustomerRequest.java
│   │   ├── CreateDriverRequest.java
│   │   ├── CreateFuelLogRequest.java
│   │   ├── CreateInvoiceRequest.java
│   │   ├── CreateMaintenanceRequest.java
│   │   ├── CreateShipmentRequest.java
│   │   ├── CreateTripRequest.java
│   │   ├── CreateVehicleRequest.java
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   └── UpdateDriverRequest.java
│   │
│   └── Response/
│       ├── AuthResponse.java
│       ├── CustomerResponse.java
│       ├── DriverIdsResponse.java
│       ├── DriverResponse.java
│       ├── FuelLogResponse.java
│       ├── InvoiceResponse.java
│       ├── MaintenanceResponse.java
│       ├── ShipmentResponse.java
│       ├── TripResponse.java
│       ├── UserResponse.java
│       └── VehicleResponse.java
│
├── entity/
│   ├── Customer.java
│   ├── Driver.java
│   ├── FuelLog.java
│   ├── Invoice.java
│   ├── Maintenance.java
│   ├── Shipment.java
│   ├── Trip.java
│   ├── User.java
│   └── Vehicle.java
│
├── enums/
│   ├── DriverStatus.java
│   ├── FuelType.java
│   ├── PaymentStatus.java
│   ├── Role.java
│   ├── ShipmentPriority.java
│   ├── ShipmentStatus.java
│   ├── TripStatus.java
│   ├── VehicleStatus.java
│   └── VehicleType.java
│
├── exception/
│   ├── ErrorResponse.java
│   ├── GlobalExceptionHandler.java
│   └── NotFoundException.java
│
├── repository/
│   ├── CustomerRepository.java
│   ├── DriverRepository.java
│   ├── FuelLogRepository.java
│   ├── InvoiceRepository.java
│   ├── MaintenanceRepository.java
│   ├── ShipmentRepository.java
│   ├── TripRepository.java
│   ├── UserRepository.java
│   └── VehicleRepository.java
│
├── security/
│   ├── CustomUserDetails.java
│   ├── JwtFilter.java
│   └── JwtUtil.java
│
├── service/
│   ├── AuthService.java
│   ├── CustomerService.java
│   ├── DriverService.java
|   ├── EmailService.java
│   ├── FuelLogService.java
│   ├── InvoiceService.java
│   ├── MaintenanceService.java
│   ├── ShipmentService.java
│   ├── TripService.java
│   ├── UserService.java
│   └── VehicleService.java
│
├── serviceImpl/
│   ├── AuthServiceImpl.java
│   ├── CustomerServiceImpl.java
│   ├── DriverServiceImpl.java
|   ├── EmailServiceImpl.java
│   ├── FuelLogServiceImpl.java
│   ├── InvoiceServiceImpl.java
│   ├── MaintenanceServiceImpl.java
│   ├── ShipmentServiceImpl.java
│   ├── TripServiceImpl.java
│   ├── UserServiceImpl.java
│   └── VehicleServiceImpl.java
│
└── RestApplication.java

```

---

# User Roles

## Role-based access control

JWT authentication is enforced on all routes via `JwtFilter`.
Roles are assigned at registration and embedded in the token.

### Roles

| Role       | Description                                                   |
|------------|---------------------------------------------------------------|
| ADMIN      | Full user management access                                   |
| DISPATCHER | Manages customers, drivers, trips, vehicles, invoices, and shipments |
| DRIVER     | Logs fuel usage and maintenance records                       |

### Endpoint permissions

| Endpoint prefix       | Allowed role              |
|-----------------------|---------------------------|
| /api/auth/**          | Public (no auth required) |
| /api/user/**          | ADMIN                     |
| /api/customer/**      | DISPATCHER                |
| /api/driver/**        | DISPATCHER                |
| /api/invoice/**       | DISPATCHER                |
| /api/vehicle/**       | DISPATCHER                |
| /api/trip/**          | DISPATCHER                |
| /api/shipment/**      | DISPATCHER                |
| /api/fuelLog/**       | DRIVER                    |
| /api/maintenance/**   | DRIVER                    |
| Any other request     | Authenticated (any role)  |

### Authentication flow

1. Client calls `POST /api/auth/login` with credentials
2. Server validates and returns a signed JWT
3. Client includes the token in all subsequent requests:
   `Authorization: Bearer <token>`
4. `JwtFilter` intercepts each request, validates the token,
   and populates the `SecurityContext` with the user's role
5. Spring Security enforces role checks via `hasRole()`

### Notes

- CSRF is disabled (stateless JWT — no session cookies)
- Swagger UI is publicly accessible at `/v3/api/**` and `/swagger-ui/index.html`
- Passwords are hashed using `PasswordConfig` (BCrypt)
---

# Application Architecture

```
Client
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Repositories
   │
   ▼
MySQL Database

             │
             ▼
      Email Service (Resend)

             │
             ▼
        Customer Email
```

# Business Workflow

## 1. User Registration

```
POST /api/auth/register
```

Creates a new user with one of the available roles.

---

## 2. User Authentication

```
POST /api/auth/login
```

Returns a JWT token for accessing secured endpoints.

---

## 3. Customer Creation

```
POST /api/customer
```

Stores customer information used for shipment processing.

---

## 4. Driver Creation

```
POST /api/driver
```

Default Status

```
AVAILABLE
```

---

## 5. Vehicle Creation

```
POST /api/vehicle
```

Default Status

```
AVAILABLE
```

---

## 6. Shipment Creation

```
POST /api/shipment
```

Each shipment is associated with a customer.

---

## 7. Invoice Creation

```
POST /api/invoice
```

Each invoice is associated with a shipment.

---

## 8. Trip Creation

```
POST /api/trip
```

During trip creation the system:

* Selects the first available driver
* Selects the first available vehicle
* Assigns both to the trip
* Updates driver status to `ON_TRIP`
* Updates vehicle status to `IN_TRANSIT`
* Associates the trip with the selected shipment

---

## 9. Fuel Log Creation

```
POST /api/fuelLog
```

Using the shipment reference, the system retrieves:

* Trip
* Driver
* Vehicle
* Customer

and stores the corresponding fuel log.

---

## 10. Maintenance Management

```
POST /api/maintenance
```

Maintenance records are stored against vehicles for service history tracking.

---

# Entity Relationships

```
Customer
    │
    └── One Customer → Many Shipments

Shipment
    │
    ├── One Shipment → One Invoice
    └── One Shipment → One Trip

Trip
    │
    ├── Many Trips → One Driver
    ├── Many Trips → One Vehicle
    └── One Trip → Many Fuel Logs

Vehicle
    │
    └── Many Vehicles → One Maintenance Record
```
## Email Notifications

The application automatically sends transactional emails using the Resend Email API.

### Shipment Created

When a shipment is created:

- Shipment details are saved
- Customer email is retrieved
- Shipment confirmation email is sent

### Shipment Delivered

When a shipment is marked as delivered:

- Customer receives a delivery confirmation email

### Payment Successful

When an invoice payment is completed:

- Customer receives a payment confirmation email

---

# REST Endpoints

## Authentication

```
POST   /api/auth/register
POST   /api/auth/login
```

## Customer

```
POST    /api/customer
GET     /api/customer/{id}
GET     /api/customer
PUT     /api/customer/{id}
DELETE  /api/customer/{id}
```

## Driver

```
POST    /api/driver
GET     /api/driver/{id}
GET     /api/driver
PUT     /api/driver/{id}
DELETE  /api/driver/{id}
```

## Vehicle

```
POST    /api/vehicle
GET     /api/vehicle/{id}
GET     /api/vehicle
PUT     /api/vehicle/{id}
DELETE  /api/vehicle/{id}
```

## Shipment

```
POST    /api/shipment
GET     /api/shipment/{id}
GET     /api/shipment
PUT     /api/shipment/{id}
DELETE  /api/shipment/{id}
```

## Trip

```
POST    /api/trip
GET     /api/trip/{id}
GET     /api/trip
PUT     /api/trip/{id}
DELETE  /api/trip/{id}
```

## Invoice

```
POST    /api/invoice
GET     /api/invoice/{id}
GET     /api/invoice
PUT     /api/invoice/{id}
DELETE  /api/invoice/{id}
```

## Fuel Log

```
POST    /api/fuelLog
GET     /api/fuelLog/{id}
GET     /api/fuelLog
PUT     /api/fuelLog/{id}
DELETE  /api/fuelLog/{id}
```

## Maintenance

```
POST    /api/maintenance
GET     /api/maintenance/{vehicleId}
GET     /api/maintenance
PUT     /api/maintenance/{id}
DELETE  /api/maintenance/{id}
```

---

# Status Definitions

## Driver Status

```
AVAILABLE
ON_TRIP
OFF_DUTY
INACTIVE
```

## Vehicle Status

```
AVAILABLE
IN_TRANSIT
UNDER_MAINTENANCE
OUT_OF_SERVICE
```

## Trip Status

```
SCHEDULED
STARTED
COMPLETED
CANCELLED
```

## Shipment Priority

```
LOW
MEDIUM
HIGH
URGENT
```

## Payment Status

```
PENDING
PAID
FAILED
```

---

# Security

- JWT Authentication
- BCrypt Password Encoding
- Stateless Session Management
- Role-Based Authorization
- Request Validation
- Global Exception Handling
- Swagger/OpenAPI Documentation

---

# Logging

The application uses SLF4J with Logback for centralized logging.

Logs include:

- User authentication
- Customer operations
- Driver operations
- Vehicle operations
- Shipment lifecycle
- Invoice processing
- Fuel log operations
- Maintenance records
- Email delivery status

---

# Future Scope

- Driver availability scheduling
- Live shipment tracking
- GPS integration
- Route optimization
- Dashboard analytics
- Audit logging
- Kubernetes deployment
- AWS cloud deployment
- Redis caching
- RabbitMQ / Kafka messaging
- SMS integration
- Push notifications

---


