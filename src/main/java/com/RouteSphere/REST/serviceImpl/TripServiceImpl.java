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
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TripServiceImpl implements TripService {

    private final TripRepostory tripRepostory;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final ShipmentRepository shipmentRepository;

    @Override
    public TripResponse createTrip(CreateTripRequest request) {

        Driver driver = driverRepository.findFirstByDriverStatus(DriverStatus.AVAILABLE).orElseThrow(() -> new RuntimeException("Driver not found"));

        Vehicle vehicle = vehicleRepository.findFirstByVehicleStatus(VehicleStatus.AVAILABLE).orElseThrow(() -> new RuntimeException("Vehicle not found"));
        Shipment shipment = shipmentRepository.findById(request.getShipmentId()).orElseThrow(() -> new RuntimeException("Shipment not found"));
        if (shipment.getTrip() != null) {
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
        driver.setDriverStatus(DriverStatus.ON_TRIP);
        vehicle.setVehicleStatus(VehicleStatus.IN_TRANSIT);
        trip.setTripStatus(TripStatus.SCHEDULED);


        Trip savedTrip = tripRepostory.save(trip);

        shipment.setTrip(savedTrip);
        shipmentRepository.save(shipment);


        TripResponse tripResponse = new TripResponse();

        tripResponse.setId(savedTrip.getId());
        tripResponse.setDistance(savedTrip.getDistance());
        tripResponse.setDriverStatus(savedTrip.getDriver().getDriverStatus());
        tripResponse.setStartDate(savedTrip.getStartDate());
        tripResponse.setEndDate(savedTrip.getEndDate());
        tripResponse.setStartLocation(savedTrip.getStartLocation());
        tripResponse.setEndLocation(savedTrip.getEndLocation());
        tripResponse.setTripStatus(savedTrip.getTripStatus());
        tripResponse.setDriverId(savedTrip.getDriver().getId());
        tripResponse.setTripNumber(savedTrip.getTripNumber());
        tripResponse.setDriverName(savedTrip.getDriver().getDriverName());

        tripResponse.setVehicleNumber(savedTrip.getVehicle().getVehicleNumber());
        tripResponse.setVehicleType(savedTrip.getVehicle().getVehicleType());
        tripResponse.setVehicleId(savedTrip.getVehicle().getId());
        return tripResponse;


    }

    @Override
    public TripResponse findTripById(Long tripId) {
        Trip trip = tripRepostory.findById(tripId).orElseThrow(() -> new RuntimeException("Trip not found"));
        TripResponse tripResponse = new TripResponse();
        tripResponse.setId(trip.getId());
        tripResponse.setDistance(trip.getDistance());
        tripResponse.setVehicleId(trip.getVehicle().getId());
        tripResponse.setDriverStatus(DriverStatus.ON_TRIP);
        tripResponse.setStartDate(trip.getStartDate());
        tripResponse.setEndDate(trip.getEndDate());
        tripResponse.setStartLocation(trip.getStartLocation());
        tripResponse.setEndLocation(trip.getEndLocation());
        tripResponse.setTripNumber(trip.getTripNumber());
        tripResponse.setTripStatus(trip.getTripStatus());
        tripResponse.setDriverId(trip.getDriver().getId());
        tripResponse.setDriverName(trip.getDriver().getDriverName());

        tripResponse.setVehicleNumber(trip.getVehicle().getVehicleNumber());
        tripResponse.setVehicleType(trip.getVehicle().getVehicleType());
        tripResponse.setVehicleId(trip.getVehicle().getId());
        return tripResponse;
    }

    @Override
    public String deleteTripById(Long tripId) {
        Trip trip = tripRepostory.findById(tripId).orElseThrow(() -> new RuntimeException("Trip not found"));
        tripRepostory.delete(trip);
        return "Trip has been deleted : " + trip.getTripNumber();
    }

    @Override
    public List<TripResponse> findAllTrips() {
        List<Trip> trips = tripRepostory.findAll();

        return trips.stream().map(trip -> {
            TripResponse tripResponse = new TripResponse();
            tripResponse.setId(trip.getId());
            tripResponse.setDistance(trip.getDistance());
            tripResponse.setVehicleId(trip.getVehicle().getId());
            tripResponse.setDriverStatus(DriverStatus.ON_TRIP);
            tripResponse.setStartDate(trip.getStartDate());
            tripResponse.setEndDate(trip.getEndDate());
            tripResponse.setStartLocation(trip.getStartLocation());
            tripResponse.setEndLocation(trip.getEndLocation());
            tripResponse.setTripStatus(trip.getTripStatus());
            tripResponse.setDriverId(trip.getDriver().getId());
            tripResponse.setDriverName(trip.getDriver().getDriverName());
            tripResponse.setVehicleNumber(trip.getVehicle().getVehicleNumber());
            tripResponse.setVehicleType(trip.getVehicle().getVehicleType());
            tripResponse.setVehicleId(trip.getVehicle().getId());
            return tripResponse;
        })
                .toList();
    }

    @Override
    public TripResponse updateTripById(Long tripId, CreateTripRequest request) {
        Trip trip = tripRepostory.findById(tripId).orElseThrow(() -> new RuntimeException("Trip not found"));
        trip.setTripStatus(request.getTripStatus());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setStartLocation(request.getStartLocation());
        trip.setEndLocation(request.getEndLocation());
        trip.setTripNumber(request.getTripNumber());
        trip.setDistance(request.getDistance());
        trip.setTripNumber(trip.getTripNumber());

        Trip updatedTrip = tripRepostory.save(trip);
        TripResponse tripResponse = new TripResponse();
        tripResponse.setId(updatedTrip.getId());
        tripResponse.setDistance(updatedTrip.getDistance());
        tripResponse.setStartDate(updatedTrip.getStartDate());
        tripResponse.setEndDate(updatedTrip.getEndDate());
        tripResponse.setStartLocation(updatedTrip.getStartLocation());
        tripResponse.setEndLocation(updatedTrip.getEndLocation());
        tripResponse.setTripStatus(updatedTrip.getTripStatus());
        tripResponse.setDriverId(updatedTrip.getDriver().getId());
        tripResponse.setDriverName(updatedTrip.getDriver().getDriverName());
        tripResponse.setVehicleNumber(updatedTrip.getVehicle().getVehicleNumber());
        tripResponse.setVehicleType(updatedTrip.getVehicle().getVehicleType());
        tripResponse.setVehicleId(updatedTrip.getVehicle().getId());
        return tripResponse;
    }
}
