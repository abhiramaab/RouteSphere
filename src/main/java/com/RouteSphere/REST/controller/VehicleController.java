package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateVehicleRequest;
import com.RouteSphere.REST.dto.Response.VehicleResponse;
import com.RouteSphere.REST.service.VehicleService;
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
@RequestMapping("/api/vehicle")
@RequiredArgsConstructor
@Tag(name = "Vehicle Controller", description = "Manage vehicle operations")
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    @Operation(summary = "Create a vehicle")
    public VehicleResponse createVehicle(@Valid @RequestBody CreateVehicleRequest request) {
        return vehicleService.createVehicle(request);
    }

    @GetMapping("/{vehicleId}")
    @Operation(summary = "Retrieve a vehicle by ID")
    public VehicleResponse getVehicle(@PathVariable Long vehicleId) {
        return vehicleService.findByVehicleId(vehicleId);
    }

    @PutMapping("/{vehicleId}")
    @Operation(summary = "Update a vehicle by ID")
    public VehicleResponse updateVehicle(@PathVariable Long vehicleId,
                                         @Valid @RequestBody CreateVehicleRequest request) {
        return vehicleService.updateVehicle(vehicleId, request);
    }

    @DeleteMapping("/{vehicleId}")
    @Operation(summary = "Delete a vehicle by ID")
    public String deleteVehicle(@PathVariable Long vehicleId) {
        return vehicleService.deleteVehicle(vehicleId);
    }

    @GetMapping
    @Operation(summary = "Retrieve all vehicles")
    public Page<VehicleResponse> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return vehicleService.findAll(pageable);
    }
}