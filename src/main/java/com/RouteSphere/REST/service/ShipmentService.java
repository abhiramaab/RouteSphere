package com.RouteSphere.REST.service;

import com.RouteSphere.REST.dto.Request.CreateShipmentRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.dto.Response.ShipmentResponse;
import com.RouteSphere.REST.entity.Shipment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ShipmentService {

    ShipmentResponse createShipment(CreateShipmentRequest request);
    ShipmentResponse findByShipmentId(Long id);
    String deleteShipment(Long shipmentId);
    ShipmentResponse updateShipment(Long shipmentId, CreateShipmentRequest request);
    Page<ShipmentResponse> findAll(Pageable pageable);
}
