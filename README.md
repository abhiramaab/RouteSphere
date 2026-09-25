<p align="center">
  <a href="https://routesphere.abhiram.tech">
    <img src="./assets/routesphere-logo-dark.svg#gh-dark-mode-only" alt="RouteSphere" width="300" />
    <img src="./assets/routesphere-logo-light.svg#gh-light-mode-only" alt="RouteSphere" width="300" />
  </a>
</p>

<h1 align="center">Enterprise Fleet Operations &amp; Logistics Management Engine</h1>

<p align="center">
  Cloud-native fleet telemetry, dispatch orchestration, and automated billing platform.<br/>
  Engineered with Java 21, Spring Boot 3, Spring Security, Hibernate, MySQL, and React.
</p>

<p align="center">
  <a href="https://routesphere.abhiram.tech">
    <img src="https://img.shields.io/badge/Live_Platform-routesphere.abhiram.tech-2563EB?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Platform" />
  </a>
  <a href="https://github.com/abhiramaab/RouteSphere">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot 3" />
  <img src="https://img.shields.io/badge/Spring_Security-JWT-6DB33F?style=flat-square&logo=springsecurity&logoColor=white" alt="Spring Security" />
  <img src="https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Hibernate-ORM-59666C?style=flat-square&logo=hibernate&logoColor=white" alt="Hibernate" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
</p>

---

<details>
<summary><strong>Table of Contents</strong></summary>

- [Overview](#overview)
- [System Architecture & Dispatch Lifecycle](#system-architecture--dispatch-lifecycle)
- [System Design & Core Modules](#system-design--core-modules)
  - [1. Dispatch Orchestration & Trip State Machine](#1-dispatch-orchestration--trip-state-machine)
  - [2. Fleet Telematics & Preventative Maintenance](#2-fleet-telematics--preventative-maintenance)
  - [3. Automated Invoicing & Billing Lifecycle](#3-automated-invoicing--billing-lifecycle)
  - [4. Role-Based Access Control & JWT Security](#4-role-based-access-control--jwt-security)
  - [5. Resilient Event Notifications & Alerts](#5-resilient-event-notifications--alerts)
- [Technology Stack](#technology-stack)
- [Quickstart Guide](#quickstart-guide)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Environment Configuration](#2-environment-configuration)
  - [3. Running Backend Services](#3-running-backend-services)
  - [4. Running Frontend Dashboard](#4-running-frontend-dashboard)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Shipment & Dispatch Management](#shipment--dispatch-management)
  - [Fleet & Telematics](#fleet--telematics)
  - [Billing & Invoicing](#billing--invoicing)
- [Project Directory Layout](#project-directory-layout)

</details>

---

## Overview

RouteSphere is an enterprise-grade logistics orchestration and fleet operations engine. In modern freight operations, tracking physical assets across variable routes demands synchronized dispatch workflows, audit-proof billing, preventative vehicle maintenance schedules, and role-enforced telemetry visibility.

RouteSphere addresses these requirements with a modular architecture:

* **Dispatch Orchestration**: State-driven shipment pipelines coordinating origin-to-destination handoffs, driver allocations, and capacity constraints.
* **Telematics & Fuel Audit Logs**: Systematic tracking of vehicle odometer readings, fuel consumption expenditures, and scheduled maintenance windows.
* **Automated Accounting Workflows**: Real-time generation of billing invoices upon delivery completion with email receipt notifications.
* **Granular Role-Based Security**: Decoupled access policies separating dispatch managers, operational fleet coordinators, and auditing personnel.

---

## System Architecture & Dispatch Lifecycle

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
        │   REST Controller Layer   │ ──► Swagger / OpenAPI 3.0 Doc Spec
        └───────────────────────────┘
                      │
                      ▼
 ┌────────────────────────────────────────────────────────┐
 │            SPRING BOOT 3 SERVICE ORCHESTRATION         │
 │                                                        │
 │  1. Shipment Lifecycle Engine (PENDING -> DELIVERED)   │
 │  2. Fleet Allocation & Driver Capacity Validator       │
 │  3. Trip Dispatch & Milestone Tracking                 │
 │  4. Automated Invoice Generation on Fulfillment        │
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

## System Design & Core Modules

### 1. Dispatch Orchestration & Trip State Machine
* **Deterministic Trip Transitions**: Enforces a strict status flow (`PENDING` -> `ASSIGNED` -> `IN_TRANSIT` -> `DELIVERED` -> `COMPLETED`).
* **Resource Conflict Avoidance**: Validates driver readiness, vehicle operational status, and active load assignments before confirming dispatch schedules.
* **Shipment Manifest Tracking**: Consolidates multi-package consignments against destination waybills and recipient records.

### 2. Fleet Telematics & Preventative Maintenance
* **Odometer & Usage Tracking**: Logs vehicle operating metrics to schedule preventative maintenance before mechanical faults cause dispatch downtime.
* **Fuel Consumption Ledger**: Tracks every fuel log entry (liters, cost per unit, fueling station, driver identity) against trip mileage to calculate operational costs per kilometer.
* **Fleet Availability Register**: Flags inactive or servicing vehicles to prevent double-booking during dispatch waves.

### 3. Automated Invoicing & Billing Lifecycle
* **Automated Invoice Trigger**: Delivery confirmation automatically triggers invoice generation containing freight charges, taxes, and customer bill-to details.
* **Payment Settlement Tracking**: Maintains payment statuses (`UNPAID`, `PARTIALLY_PAID`, `PAID`) linked directly to the originating shipment identifier.

### 4. Role-Based Access Control & JWT Security
* **Stateless Security**: Intercepts requests via Spring Security filters, verifying HMAC-signed JWT tokens and claims.
* **Least-Privilege Authorization**: Segregates operational endpoints so drivers, dispatchers, and financial auditors access only their required resources.

### 5. Resilient Event Notifications & Alerts
* **Transactional Dispatch Updates**: Emits asynchronous customer notifications via Resend API on key milestones (shipment created, driver dispatched, proof of delivery signed).
* **Payment Acknowledgement**: Automatically transmits formatted receipts upon invoice settlement.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| Backend Services | Java 21, Spring Boot 3.x, Spring MVC, Maven |
| Security | Spring Security 6, Stateless JWT Authentication, BCrypt |
| Database & ORM | MySQL 8.x, Hibernate, Spring Data JPA |
| Operations Dashboard | React 18, TypeScript, Vite, Tailwind CSS |
| API Documentation | Swagger UI, OpenAPI 3.0 |
| Notification Service | Resend API Integration |
| Logging & Monitoring | SLF4J, Logback Structured Logging |
| Containerization | Docker, Docker Compose |

---

## Quickstart Guide

### 1. Prerequisites
* **Java Development Kit (JDK) 21**
* **MySQL 8.x** running locally or via Docker
* **Node.js 18+** and **npm**
* **Apache Maven 3.9+**

### 2. Environment Configuration
Configure your database and mail credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/routesphere_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

jwt.secret=your_secure_256_bit_secret_key_here
jwt.expiration=86400000

resend.api.key=your_resend_api_key
```

### 3. Running Backend Services

```bash
# Clone the repository
git clone https://github.com/abhiramaab/RouteSphere.git
cd RouteSphere

# Build and run with Maven
./mvnw clean spring-boot:run
```

The Spring Boot backend will start on `http://localhost:8080`.
Access Swagger API documentation at: `http://localhost:8080/swagger-ui/index.html`.

### 4. Running Frontend Dashboard

```bash
cd frontend
npm install
npm run dev
```

The frontend dashboard will be available at `http://localhost:5173`.
Live interactive instance: **[routesphere.abhiram.tech](https://routesphere.abhiram.tech)**

---

## API Reference

### Authentication
* `POST /api/auth/register` - Register new user account
* `POST /api/auth/login` - Authenticate credentials and obtain JWT bearer token

### Shipment & Dispatch Management
* `POST /api/shipments` - Create a new shipment manifest
* `GET /api/shipments` - List all shipments with status and origin/destination filters
* `GET /api/shipments/{id}` - Fetch shipment details and consignment items
* `PUT /api/shipments/{id}` - Update shipment milestones and state

### Fleet & Telematics
* `POST /api/vehicles` - Register vehicle asset (make, model, license, capacity)
* `GET /api/vehicles` - Retrieve fleet inventory and operational availability
* `POST /api/drivers` - Register certified driver profile
* `POST /api/fuel-logs` - Record fuel expenditure and odometer reading
* `POST /api/maintenance` - Schedule or record maintenance servicing

### Billing & Invoicing
* `POST /api/invoices` - Generate customer invoice for shipment
* `GET /api/invoices/{id}` - Fetch invoice billing status and total freight breakdown
* `PUT /api/invoices/{id}/pay` - Record settlement transaction

---

## Project Directory Layout

```text
RouteSphere/
├── assets/                          # Dual-mode logos and architecture assets
│   ├── routesphere-logo-dark.svg
│   └── routesphere-logo-light.svg
├── frontend/                        # React 18 & Vite Operations Console
│   ├── src/                         # Dashboard views, state hooks, components
│   └── package.json
├── src/main/java/com/RouteSphere/REST/
│   ├── config/                      # Security, OpenAPI, and Resend configs
│   ├── controller/                  # REST controllers (Auth, Shipments, Fleet)
│   ├── dto/                         # Request and Response payload contracts
│   ├── entity/                      # JPA Entities (Shipment, Vehicle, Trip, Invoice)
│   ├── exception/                   # Global exception handling & error models
│   ├── repository/                  # Spring Data JPA repositories
│   └── service/                     # Dispatch orchestration & domain logic
├── pom.xml                          # Maven build dependencies
└── Dockerfile                       # Container deployment definition
```

---

<p align="center">
  Built by <a href="https://github.com/abhiramaab">Abhirama</a> · Live at <a href="https://portfolio.abhiram.tech">portfolio.abhiram.tech</a>
</p>
