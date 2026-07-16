package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateTripRequest;
import com.RouteSphere.REST.dto.Response.TripResponse;
import com.RouteSphere.REST.service.TripService;
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
@RequestMapping("/api/trip")
@RequiredArgsConstructor
@Tag(name = "Trip Controller", description = "Manage trip operations")
public class TripController {

    private final TripService tripService;

    @PostMapping
    @Operation(summary = "Create a trip")
    public TripResponse createTrip(@Valid @RequestBody CreateTripRequest request) {
        return tripService.createTrip(request);
    }

    @GetMapping("/{tripId}")
    @Operation(summary = "Retrieve a trip by ID")
    public TripResponse findByTripId(@PathVariable Long tripId) {
        return tripService.findTripById(tripId);
    }

    @PutMapping("/{tripId}")
    @Operation(summary = "Update a trip by ID")
    public TripResponse updateTrip(@PathVariable Long tripId,
                                   @Valid @RequestBody CreateTripRequest request) {
        return tripService.updateTripById(tripId, request);
    }

    @DeleteMapping("/{tripId}")
    @Operation(summary = "Delete a trip by ID")
    public String deleteTrip(@PathVariable Long tripId) {
        return tripService.deleteTripById(tripId);
    }

    @GetMapping
    @Operation(summary = "Retrieve all trips")
    public Page<TripResponse> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return tripService.findAll(pageable);
    }
}