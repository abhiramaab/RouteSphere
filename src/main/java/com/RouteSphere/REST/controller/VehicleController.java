package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateVehicleRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.dto.Response.VehicleResponse;
import com.RouteSphere.REST.entity.Vehicle;
import com.RouteSphere.REST.service.VehicleService;
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
@RequestMapping("/api/vehicle")
@Data
@Tag(name = "Vehicle Controller")
@AllArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    public VehicleResponse createVehicle(@Valid @RequestBody CreateVehicleRequest request) {
        return vehicleService.createVehicle(request);
    }

    @GetMapping("/{vehicleId}")
    public VehicleResponse getVehicle(@PathVariable("vehicleId") Long vehicleId) {
        return vehicleService.findByVehicleId(vehicleId);
    }

    @PutMapping("/{vehicleId}")
    public VehicleResponse updateVehicle(@PathVariable("vehicleId") Long vehicleId, @RequestBody CreateVehicleRequest request) {
        return vehicleService.updateVehicle(vehicleId, request);
    }

    @DeleteMapping("/{id}")
    public String deleteVehicle(@PathVariable("id") Long vehicleId) {
        return vehicleService.deleteVehicle(vehicleId);
    }

    @GetMapping
    public Page<VehicleResponse> findAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "asc") String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return vehicleService.findAll(pageable);

    }
}
