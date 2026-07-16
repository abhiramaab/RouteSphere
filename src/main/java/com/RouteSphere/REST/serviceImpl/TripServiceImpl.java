package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateTripRequest;
import com.RouteSphere.REST.dto.Response.TripResponse;
import com.RouteSphere.REST.entity.Driver;
import com.RouteSphere.REST.entity.Shipment;
import com.RouteSphere.REST.entity.Trip;
import com.RouteSphere.REST.entity.Vehicle;
import com.RouteSphere.REST.enums.DriverStatus;
import com.RouteSphere.REST.enums.TripStatus;
import com.RouteSphere.REST.enums.VehicleStatus;
import com.RouteSphere.REST.repository.DriverRepository;
import com.RouteSphere.REST.repository.ShipmentRepository;
import com.RouteSphere.REST.repository.TripRepostory;
import com.RouteSphere.REST.repository.VehicleRepository;
import com.RouteSphere.REST.service.TripService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class TripServiceImpl implements TripService {

    private final TripRepostory tripRepostory;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final ShipmentRepository shipmentRepository;

    @Override
    public TripResponse createTrip(CreateTripRequest request) {

        log.info("Creating trip with number: {}", request.getTripNumber());

        Driver driver = driverRepository.findFirstByDriverStatus(DriverStatus.AVAILABLE)
                .orElseThrow(() -> {
                    log.warn("No available driver found");
                    return new RuntimeException("Driver not found");
                });

        Vehicle vehicle = vehicleRepository.findFirstByVehicleStatus(VehicleStatus.AVAILABLE)
                .orElseThrow(() -> {
                    log.warn("No available vehicle found");
                    return new RuntimeException("Vehicle not found");
                });

        Shipment shipment = shipmentRepository.findById(request.getShipmentId())
                .orElseThrow(() -> {
                    log.warn("Shipment with id {} not found", request.getShipmentId());
                    return new RuntimeException("Shipment not found");
                });

        if (shipment.getTrip() != null) {
            log.warn("Shipment {} already has a trip assigned", shipment.getId());
            throw new RuntimeException("Trip already assigned to this shipment");
        }

        driver.setDriverStatus(DriverStatus.ON_TRIP);
        vehicle.setVehicleStatus(VehicleStatus.IN_TRANSIT);

        driverRepository.save(driver);
        vehicleRepository.save(vehicle);

        Trip trip = new Trip();
        trip.setTripNumber(request.getTripNumber());
        trip.setStartLocation(request.getStartLocation());
        trip.setEndLocation(request.getEndLocation());
        trip.setDriver(driver);
        trip.setVehicle(vehicle);
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setDistance(request.getDistance());
        trip.setTripStatus(TripStatus.SCHEDULED);

        Trip savedTrip = tripRepostory.save(trip);

        shipment.setTrip(savedTrip);
        shipmentRepository.save(shipment);

        log.info("Trip created successfully with id: {}", savedTrip.getId());

        return mapToResponse(savedTrip);
    }

    @Override
    public TripResponse findTripById(Long tripId) {

        log.info("Retrieving trip with id: {}", tripId);

        Trip trip = tripRepostory.findById(tripId)
                .orElseThrow(() -> {
                    log.warn("Trip with id {} not found", tripId);
                    return new RuntimeException("Trip not found");
                });

        return mapToResponse(trip);
    }

    @Override
    public String deleteTripById(Long tripId) {

        log.info("Deleting trip with id: {}", tripId);

        Trip trip = tripRepostory.findById(tripId)
                .orElseThrow(() -> {
                    log.warn("Trip with id {} not found", tripId);
                    return new RuntimeException("Trip not found");
                });

        tripRepostory.delete(trip);

        log.info("Trip deleted successfully with id: {}", tripId);

        return "Trip has been deleted : " + trip.getTripNumber();
    }

    @Override
    public List<TripResponse> findAllTrips() {

        log.info("Retrieving all trips");

        return tripRepostory.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TripResponse updateTripById(Long tripId, CreateTripRequest request) {

        log.info("Updating trip with id: {}", tripId);

        Trip trip = tripRepostory.findById(tripId)
                .orElseThrow(() -> {
                    log.warn("Trip with id {} not found", tripId);
                    return new RuntimeException("Trip not found");
                });

        trip.setTripNumber(request.getTripNumber());
        trip.setStartLocation(request.getStartLocation());
        trip.setEndLocation(request.getEndLocation());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setDistance(request.getDistance());
        trip.setTripStatus(request.getTripStatus());

        Trip updatedTrip = tripRepostory.save(trip);

        log.info("Trip updated successfully with id: {}", updatedTrip.getId());

        return mapToResponse(updatedTrip);
    }

    @Override
    public Page<TripResponse> findAll(Pageable pageable) {

        log.info("Retrieving all trips. Page: {}, Size: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        return tripRepostory.findAll(pageable)
                .map(this::mapToResponse);
    }

    private TripResponse mapToResponse(Trip trip) {

        TripResponse response = new TripResponse();

        response.setId(trip.getId());
        response.setTripNumber(trip.getTripNumber());
        response.setDistance(trip.getDistance());
        response.setStartDate(trip.getStartDate());
        response.setEndDate(trip.getEndDate());
        response.setStartLocation(trip.getStartLocation());
        response.setEndLocation(trip.getEndLocation());
        response.setTripStatus(trip.getTripStatus());

        response.setDriverId(trip.getDriver().getId());
        response.setDriverName(trip.getDriver().getDriverName());
        response.setDriverStatus(trip.getDriver().getDriverStatus());

        response.setVehicleId(trip.getVehicle().getId());
        response.setVehicleNumber(trip.getVehicle().getVehicleNumber());
        response.setVehicleType(trip.getVehicle().getVehicleType());

        return response;
    }
}