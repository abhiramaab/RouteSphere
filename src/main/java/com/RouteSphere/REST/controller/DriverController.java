package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateDriverRequest;
import com.RouteSphere.REST.dto.Request.UpdateDriverRequest;
import com.RouteSphere.REST.dto.Response.DriverResponse;
import com.RouteSphere.REST.service.DriverService;
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
@RequestMapping("/api/driver")
@RequiredArgsConstructor
@Tag(name = "Driver Controller", description = "Manage driver operations")
public class DriverController {

    private final DriverService driverService;

    @PostMapping
    @Operation(summary = "Create a driver")
    public DriverResponse createDriver(@Valid @RequestBody CreateDriverRequest request) {
        return driverService.createDriver(request);
    }

    @GetMapping("/{driverId}")
    @Operation(summary = "Retrieve a driver by ID")
    public DriverResponse findDriverById(@PathVariable Long driverId) {
        return driverService.findDriverById(driverId);
    }

    @PutMapping("/{driverId}")
    @Operation(summary = "Update a driver by ID")
    public DriverResponse updateDriver(@PathVariable Long driverId,
                                       @Valid @RequestBody UpdateDriverRequest request) {
        return driverService.updateDriver(driverId, request);
    }

    @DeleteMapping("/{driverId}")
    @Operation(summary = "Delete a driver by ID")
    public String deleteDriver(@PathVariable Long driverId) {
        return driverService.deleteDriver(driverId);
    }

    @GetMapping
    @Operation(summary = "Retrieve all drivers")
    public Page<DriverResponse> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return driverService.findAll(pageable);
    }
}