package com.RouteSphere.REST.service;

import com.RouteSphere.REST.dto.Request.CreateTripRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.dto.Response.TripResponse;
import com.RouteSphere.REST.entity.Trip;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TripService {

    TripResponse createTrip(CreateTripRequest request);
    TripResponse findTripById(Long tripId);
    String deleteTripById(Long tripId);
    List<TripResponse> findAllTrips();
    TripResponse updateTripById(Long TripId, CreateTripRequest request);
    Page<TripResponse> findAll(Pageable pageable);
}
