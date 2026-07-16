package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateShipmentRequest;
import com.RouteSphere.REST.dto.Response.ShipmentResponse;
import com.RouteSphere.REST.service.ShipmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shipment")
@RequiredArgsConstructor
@Tag(name = "Shipment Controller", description = "Manage shipment operations")
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping
    @Operation(summary = "Create a shipment")
    public ShipmentResponse createShipment(@Valid @RequestBody CreateShipmentRequest request) {
        return shipmentService.createShipment(request);
    }

    @GetMapping("/{shipmentId}")
    @Operation(summary = "Retrieve a shipment by ID")
    public ShipmentResponse findByShipmentId(@PathVariable Long shipmentId) {
        return shipmentService.findByShipmentId(shipmentId);
    }

    @PutMapping("/{shipmentId}")
    @Operation(summary = "Update a shipment by ID")
    public ShipmentResponse updateShipment(@PathVariable Long shipmentId,
                                           @Valid @RequestBody CreateShipmentRequest request) {
        return shipmentService.updateShipment(shipmentId, request);
    }

    @DeleteMapping("/{shipmentId}")
    @Operation(summary = "Delete a shipment by ID")
    public String deleteShipment(@PathVariable Long shipmentId) {
        return shipmentService.deleteShipment(shipmentId);
    }

    @GetMapping
    @Operation(summary = "Retrieve all shipments")
    public Page<ShipmentResponse> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return shipmentService.findAll(pageable);
    }
}