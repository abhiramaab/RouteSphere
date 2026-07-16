package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateMaintenanceRequest;
import com.RouteSphere.REST.dto.Response.MaintenanceResponse;
import com.RouteSphere.REST.service.MaintenanceService;
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
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
@Tag(name = "Maintenance Controller", description = "Manage vehicle maintenance operations")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping
    @Operation(summary = "Create a maintenance record")
    public MaintenanceResponse createMaintenance(@Valid @RequestBody CreateMaintenanceRequest request) {
        return maintenanceService.createMaintenance(request);
    }

    @GetMapping("/{maintenanceId}")
    @Operation(summary = "Retrieve a maintenance record by ID")
    public MaintenanceResponse getMaintenance(@PathVariable Long maintenanceId) {
        return maintenanceService.getMaintenance(maintenanceId);
    }

    @PatchMapping("/{maintenanceId}")
    @Operation(summary = "Update a maintenance record by ID")
    public MaintenanceResponse updateMaintenance(@PathVariable Long maintenanceId,
                                                 @Valid @RequestBody CreateMaintenanceRequest request) {
        return maintenanceService.updateMaintenance(maintenanceId, request);
    }

    @DeleteMapping("/{maintenanceId}")
    @Operation(summary = "Delete a maintenance record by ID")
    public String deleteMaintenance(@PathVariable Long maintenanceId) {
        return maintenanceService.deleteMaintenance(maintenanceId);
    }

    @GetMapping("/vehicle/{vehicleId}")
    @Operation(summary = "Retrieve maintenance by vehicle ID")
    public MaintenanceResponse findByVehicleId(@PathVariable Long vehicleId) {
        return maintenanceService.findByVehicleId(vehicleId);
    }

    @GetMapping
    @Operation(summary = "Retrieve all maintenance records")
    public Page<MaintenanceResponse> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return maintenanceService.findAll(pageable);
    }
}