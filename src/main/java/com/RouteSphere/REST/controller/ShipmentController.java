package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateShipmentRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.dto.Response.ShipmentResponse;
import com.RouteSphere.REST.service.ShipmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    @GetMapping
    public Page<ShipmentResponse> findAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "asc") String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return shipmentService.findAll(pageable);

    }
}
