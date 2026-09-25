# RouteSphere Architecture & Technical Specification

RouteSphere is an enterprise-grade fleet logistics management and route dispatch engine engineered with Java 21, Spring Boot 3, Spring Security, Hibernate, MySQL, and React.

---

## 1. System Architecture & Dispatch Lifecycle

```text
 Client / Operations Dashboard (React 18 + Vite)
                      │
                      ▼
        ┌───────────────────────────┐
        │   JWT Auth & RBAC Filter  │ ──(Unauthorized)──► HTTP 401 / 403 Forbidden
        └───────────────────────────┘
                      │ (Authenticated Principal)
                      ▼
        ┌───────────────────────────┐
        │   REST Controller Layer   │ ──► Swagger / OpenAPI 3.0 Documentation
        └───────────────────────────┘
                      │
                      ▼
 ┌────────────────────────────────────────────────────────┐
 │            SPRING BOOT 3 SERVICE ORCHESTRATION         │
 │                                                        │
 │  1. Shipment Lifecycle Engine (PENDING -> DELIVERED)   │
 │  2. Fleet Allocation & Driver Capacity Validator       │
 │  3. Trip Dispatch & Milestone Tracking                 │
 │  4. Automated Invoicing Generation on Fulfillment      │
 │  5. Fuel Economy & Telematics Ledger Calculation       │
 └────────────────────────────────────────────────────────┘
         │                                       │
         ▼                                       ▼
 ┌───────────────────────┐             ┌───────────────────────┐
 │   MySQL Persistence   │             │   Resend Mail Gateway │
 │ (Hibernate/JPA ACID)  │             │ (Trip & Billing Notif)│
 └───────────────────────┘             └───────────────────────┘
```

---

## 2. Dispatch State Machine

Trip and shipment states transition through a deterministic lifecycle:
* `PENDING`: Initial manifest created, pending vehicle and driver availability checks.
* `ASSIGNED`: Vehicle capacity verified and certified driver allocated.
* `IN_TRANSIT`: Shipment departed; odometer milestones logged.
* `DELIVERED`: Recipient signature captured; triggers automated customer invoice generation.
* `COMPLETED`: Invoiced, freight charges settled, vehicle freed for subsequent dispatch.

---

## 3. Fleet Telematics & Preventative Maintenance

* **Odometer Logging**: Records trip mileage against vehicle registries to proactively flag service thresholds.
* **Fuel Consumption Ledger**: Computes cost per kilometer and detects anomalous fuel consumption spikes across trips.
* **Availability Locking**: Prevents double-booking vehicles or drivers during active trips.

---

## 4. Automated Invoicing & Settlement

* Freight charges are calculated based on shipment weight, distance, and rate tiers.
* Upon fulfillment, an immutable invoice record is created and dispatched via Resend API.
* Payment states (`UNPAID`, `PARTIALLY_PAID`, `PAID`) are tracked with relational foreign keys to the originating shipment.
