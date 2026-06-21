package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateMaintenanceRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.dto.Response.MaintenanceResponse;
import com.RouteSphere.REST.entity.Maintenance;
import com.RouteSphere.REST.service.MaintenanceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@Data
@AllArgsConstructor
@Tag(name = "Maintenance Controller")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping
    public MaintenanceResponse createMaintenance(@Valid @RequestBody CreateMaintenanceRequest request){
        return maintenanceService.createMaintenance(request);
    }

    @GetMapping("/{id}")
    public MaintenanceResponse getMaintenance(@PathVariable Long id){
        return maintenanceService.getMaintenance(id);
    }

    @DeleteMapping("/{id}")
    public String deleteMaintenance(@PathVariable Long id){
        return maintenanceService.deleteMaintenance(id);
    }

    @PatchMapping("/{id}")
    public MaintenanceResponse updateMaintenance(@PathVariable Long id, @RequestBody CreateMaintenanceRequest request){
        return maintenanceService.updateMaintenance(id, request);
    }

    @GetMapping("/vehicle/{vehicleId}")
    public MaintenanceResponse findByVehicleId(@PathVariable Long vehicleId){
        return maintenanceService.findByVehicleId(vehicleId);
    }

    @GetMapping
    public Page<MaintenanceResponse> findAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "asc") String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return maintenanceService.findAll(pageable);

    }
}
