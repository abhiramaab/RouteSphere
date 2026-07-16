package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateFuelLogRequest;
import com.RouteSphere.REST.dto.Response.FuelLogRespone;
import com.RouteSphere.REST.service.FuelLogService;
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
@RequestMapping("/api/fuellog")
@RequiredArgsConstructor
@Tag(name = "Fuel Log Controller", description = "Manage fuel log operations")
public class FuelLogController {

    private final FuelLogService fuelLogService;

    @PostMapping
    @Operation(summary = "Create a fuel log")
    public FuelLogRespone createFuelLog(@Valid @RequestBody CreateFuelLogRequest request) {
        return fuelLogService.createFuelLog(request);
    }

    @GetMapping("/{fuelLogId}")
    @Operation(summary = "Retrieve a fuel log by ID")
    public FuelLogRespone getFuelLog(@PathVariable Long fuelLogId) {
        return fuelLogService.getFuelLog(fuelLogId);
    }

    @PutMapping("/{fuelLogId}")
    @Operation(summary = "Update a fuel log by ID")
    public FuelLogRespone updateFuelLog(@PathVariable Long fuelLogId,
                                        @Valid @RequestBody CreateFuelLogRequest request) {
        return fuelLogService.updateFuelLog(fuelLogId, request);
    }

    @DeleteMapping("/{fuelLogId}")
    @Operation(summary = "Delete a fuel log by ID")
    public String deleteFuelLog(@PathVariable Long fuelLogId) {
        return fuelLogService.deleteFuelLog(fuelLogId);
    }

    @GetMapping
    @Operation(summary = "Retrieve all fuel logs")
    public Page<FuelLogRespone> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return fuelLogService.findAll(pageable);
    }
}