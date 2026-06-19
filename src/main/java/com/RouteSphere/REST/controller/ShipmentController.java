package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateShipmentRequest;
import com.RouteSphere.REST.dto.Response.ShipmentResponse;
import com.RouteSphere.REST.service.ShipmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shipment")
@Data
@AllArgsConstructor
@Tag(name = "Shipment Controller")
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping
    public ShipmentResponse createShipment(@Valid @RequestBody CreateShipmentRequest request){
        return shipmentService.createShipment(request);
    }

    @GetMapping("/{shipmentId}")
    public ShipmentResponse findByShipmentId(@PathVariable Long shipmentId){
        return shipmentService.findByShipmentId(shipmentId);
    }

    @PutMapping("/{shipmentId}")
    public ShipmentResponse updateShipment(@PathVariable Long shipmentId,@Valid @RequestBody CreateShipmentRequest request){
        return shipmentService.updateShipment(shipmentId, request);
    }

    @DeleteMapping("/{shipmentId}")
    public  String deleteShipment(@PathVariable Long shipmentId){
        return shipmentService.deleteShipment(shipmentId);
    }
}
