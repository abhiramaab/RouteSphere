package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateShipmentRequest;
import com.RouteSphere.REST.dto.Response.ShipmentResponse;
import com.RouteSphere.REST.entity.Customer;
import com.RouteSphere.REST.entity.Driver;
import com.RouteSphere.REST.entity.Invoice;
import com.RouteSphere.REST.entity.Shipment;
import com.RouteSphere.REST.entity.Vehicle;
import com.RouteSphere.REST.enums.DriverStatus;
import com.RouteSphere.REST.enums.ShipmentPriority;
import com.RouteSphere.REST.enums.VehicleStatus;
import com.RouteSphere.REST.repository.DriverRepository;
import com.RouteSphere.REST.repository.InvoiceRespository;
import com.RouteSphere.REST.repository.ShipmentRepository;
import com.RouteSphere.REST.repository.VehicleRepository;
import com.RouteSphere.REST.service.EmailService;
import com.RouteSphere.REST.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final EmailService emailService;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final InvoiceRespository invoiceRespository;

    @Override
    public ShipmentResponse createShipment(CreateShipmentRequest request) {

        log.info("Creating shipment with tracking number: {}", request.getTrackingNumber());

        Shipment shipment = new Shipment();

        shipment.setTrackingNumber(request.getTrackingNumber());
        shipment.setDeliveryLocation(request.getDeliveryLocation());
        shipment.setDeliveryDate(request.getDeliveryDate());
        shipment.setPickupLocation(request.getPickupLocation());
        shipment.setPickupDate(request.getPickupDate());
        shipment.setWeight(request.getWeight());
        shipment.setShipmentPriority(ShipmentPriority.MEDIUM);

        Invoice invoice = invoiceRespository.findById(request.getInvoiceId())
                .orElseThrow(() -> {
                    log.warn("Invoice with id {} not found", request.getInvoiceId());
                    return new RuntimeException("Invoice not found");
                });

        Driver driver = driverRepository.findFirstByDriverStatus(DriverStatus.AVAILABLE)
                .orElseThrow(() -> {
                    log.warn("No available driver found");
                    return new RuntimeException("No driver available");
                });

        Vehicle vehicle = vehicleRepository.findFirstByVehicleStatus(VehicleStatus.AVAILABLE)
                .orElseThrow(() -> {
                    log.warn("No available vehicle found");
                    return new RuntimeException("No vehicle available");
                });

        Customer customer = invoice.getCustomer();

        shipment.setInvoice(invoice);
        shipment.setCustomer(customer);
        shipment.setDriver(driver);
        shipment.setVehicle(vehicle);

        driver.setDriverStatus(DriverStatus.ON_TRIP);
        vehicle.setVehicleStatus(VehicleStatus.IN_TRANSIT);

        driverRepository.save(driver);
        vehicleRepository.save(vehicle);

        Shipment savedShipment = shipmentRepository.save(shipment);

        invoice.setShipment(savedShipment);
        invoiceRespository.save(invoice);

        emailService.sendShipmentCreatedEmail(
                customer.getEmail(),
                savedShipment.getTrackingNumber()
        );

        log.info("Shipment created successfully with id: {}", savedShipment.getId());

        return mapToResponse(savedShipment);
    }

    @Override
    public ShipmentResponse findByShipmentId(Long shipmentId) {

        log.info("Retrieving shipment with id: {}", shipmentId);

        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> {
                    log.warn("Shipment with id {} not found", shipmentId);
                    return new RuntimeException("Shipment not found");
                });

        return mapToResponse(shipment);
    }

    @Override
    public String deleteShipment(Long shipmentId) {

        log.info("Deleting shipment with id: {}", shipmentId);

        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> {
                    log.warn("Shipment with id {} not found", shipmentId);
                    return new RuntimeException("Shipment not found");
                });

        shipmentRepository.delete(shipment);

        log.info("Shipment deleted successfully with id: {}", shipmentId);

        return "Shipment Deleted Successfully : " + shipment.getId();
    }

    @Override
    public ShipmentResponse updateShipment(Long shipmentId, CreateShipmentRequest request) {

        log.info("Updating shipment with id: {}", shipmentId);

        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> {
                    log.warn("Shipment with id {} not found", shipmentId);
                    return new RuntimeException("Shipment not found");
                });

        shipment.setTrackingNumber(request.getTrackingNumber());
        shipment.setDeliveryLocation(request.getDeliveryLocation());
        shipment.setDeliveryDate(request.getDeliveryDate());
        shipment.setPickupLocation(request.getPickupLocation());
        shipment.setPickupDate(request.getPickupDate());
        shipment.setWeight(request.getWeight());
        shipment.setShipmentPriority(request.getShipmentPriority());

        Shipment updatedShipment = shipmentRepository.save(shipment);

        log.info("Shipment updated successfully with id: {}", updatedShipment.getId());

        return mapToResponse(updatedShipment);
    }

    @Override
    public Page<ShipmentResponse> findAll(Pageable pageable) {

        log.info("Retrieving all shipments. Page: {}, Size: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        return shipmentRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    private ShipmentResponse mapToResponse(Shipment shipment) {

        ShipmentResponse response = new ShipmentResponse();

        response.setId(shipment.getId());
        response.setTrackingNumber(shipment.getTrackingNumber());
        response.setPickupLocation(shipment.getPickupLocation());
        response.setDeliveryLocation(shipment.getDeliveryLocation());
        response.setPickupDate(shipment.getPickupDate());
        response.setDeliveryDate(shipment.getDeliveryDate());
        response.setWeight(shipment.getWeight());
        response.setShipmentPriority(shipment.getShipmentPriority());

        if (shipment.getInvoice() != null) {
            response.setInvoiceId(shipment.getInvoice().getId());
        }

        if (shipment.getCustomer() != null) {
            response.setCustomerId(shipment.getCustomer().getId());
        }

        if (shipment.getDriver() != null) {
            response.setDriverId(shipment.getDriver().getId());
        }

        if (shipment.getVehicle() != null) {
            response.setVehicleId(shipment.getVehicle().getId());
        }

        return response;
    }
}