package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateTripRequest;
import com.RouteSphere.REST.dto.Response.TripResponse;
import com.RouteSphere.REST.service.TripService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trip")
@Data
@Tag(name = "Trip Controller")
@AllArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    public TripResponse createTrip(@Valid @RequestBody CreateTripRequest request) {
        return tripService.createTrip(request);
    }

    @GetMapping("/{tripId}")
    public TripResponse findByTripId(@PathVariable("tripId") Long tripId) {
        return tripService.findTripById(tripId);
    }

    @DeleteMapping("/{tripId}")
    public String deleteTrip(@PathVariable("tripId") Long tripId) {
        return tripService.deleteTripById(tripId);
    }

    @PutMapping("/{tripId}")
    public TripResponse updateTrip(@PathVariable Long tridId,@Valid @RequestBody CreateTripRequest request){
        return tripService.updateTripById(tridId, request);
    }
}
