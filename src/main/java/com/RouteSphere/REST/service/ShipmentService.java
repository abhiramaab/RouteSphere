package com.RouteSphere.REST.service;

import com.RouteSphere.REST.dto.Request.CreateShipmentRequest;
import com.RouteSphere.REST.dto.Response.ShipmentResponse;
import com.RouteSphere.REST.entity.Shipment;

public interface ShipmentService {

    ShipmentResponse createShipment(CreateShipmentRequest request);
    ShipmentResponse findByShipmentId(Long id);
    String deleteShipment(Long shipmentId);
    ShipmentResponse updateShipment(Long shipmentId, CreateShipmentRequest request);
}
