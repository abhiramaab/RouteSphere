package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateShipmentRequest;
import com.RouteSphere.REST.dto.Response.ShipmentResponse;
import com.RouteSphere.REST.entity.Shipment;
import com.RouteSphere.REST.enums.ShipmentPriority;
import com.RouteSphere.REST.repository.ShipmentRepository;
import com.RouteSphere.REST.service.ShipmentService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional
public class ShipmentServiceImpl implements ShipmentService {

    private final ShipmentRepository shipmentRepository;

    @Override
    public ShipmentResponse createShipment(CreateShipmentRequest request) {
        Shipment shipment = new Shipment();

        shipment.setTrackingNumber(request.getTrackingNumber());
        shipment.setDeliveryLocation(request.getDeliveryLocation());
        shipment.setDeliveryDate(request.getDeliveryDate());
        shipment.setPickupLocation(request.getPickupLocation());
        shipment.setPickupDate(request.getPickupDate());
        shipment.setWeight(request.getWeight());
        shipment.setShipmentPriority(ShipmentPriority.MEDIUM);

        Shipment savedShipment = shipmentRepository.save(shipment);

        ShipmentResponse shipmentResponse = new ShipmentResponse();
        shipmentResponse.setId(savedShipment.getId());
        shipmentResponse.setTrackingNumber(savedShipment.getTrackingNumber());
        shipmentResponse.setDeliveryLocation(savedShipment.getDeliveryLocation());
        shipmentResponse.setDeliveryDate(savedShipment.getDeliveryDate());
        shipmentResponse.setPickupLocation(savedShipment.getPickupLocation());
        shipmentResponse.setPickupDate(savedShipment.getPickupDate());
        shipmentResponse.setWeight(savedShipment.getWeight());
        shipmentResponse.setShipmentPriority(savedShipment.getShipmentPriority());
        return shipmentResponse;
    }

    @Override
    public ShipmentResponse findByShipmentId(Long id) {
        Shipment shipment = shipmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Shipment not found"));
        ShipmentResponse shipmentResponse = new ShipmentResponse();
        shipmentResponse.setId(shipment.getId());
        shipmentResponse.setTrackingNumber(shipment.getTrackingNumber());
        shipmentResponse.setDeliveryLocation(shipment.getDeliveryLocation());
        shipmentResponse.setDeliveryDate(shipment.getDeliveryDate());
        shipmentResponse.setPickupLocation(shipment.getPickupLocation());
        shipmentResponse.setPickupDate(shipment.getPickupDate());
        shipmentResponse.setWeight(shipment.getWeight());
        shipmentResponse.setShipmentPriority(shipment.getShipmentPriority());
        return shipmentResponse;
    }

    @Override
    public String deleteShipment(Long shipmentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId).orElseThrow(() -> new RuntimeException("Shipment not found"));
        shipmentRepository.delete(shipment);
        return "Shipment Deleted Successfully : " + shipment.getId();
    }

    @Override
    public ShipmentResponse updateShipment(Long shipmentId, CreateShipmentRequest request) {
        Shipment shipment = shipmentRepository.findById(shipmentId).orElseThrow(() -> new RuntimeException("Shipment not found"));
        shipment.setTrackingNumber(request.getTrackingNumber());
        shipment.setDeliveryLocation(request.getDeliveryLocation());
        shipment.setDeliveryDate(request.getDeliveryDate());
        shipment.setPickupLocation(request.getPickupLocation());
        shipment.setPickupDate(request.getPickupDate());
        shipment.setWeight(request.getWeight());
        shipment.setShipmentPriority(request.getShipmentPriority());
        Shipment updatedShipment = shipmentRepository.save(shipment);
        ShipmentResponse shipmentResponse = new ShipmentResponse();
        shipmentResponse.setId(updatedShipment.getId());
        shipmentResponse.setTrackingNumber(updatedShipment.getTrackingNumber());
        shipmentResponse.setDeliveryLocation(updatedShipment.getDeliveryLocation());
        shipmentResponse.setDeliveryDate(updatedShipment.getDeliveryDate());
        shipmentResponse.setPickupLocation(updatedShipment.getPickupLocation());
        shipmentResponse.setPickupDate(updatedShipment.getPickupDate());
        shipmentResponse.setWeight(updatedShipment.getWeight());
        shipmentResponse.setShipmentPriority(updatedShipment.getShipmentPriority());
        return shipmentResponse;
    }
}
