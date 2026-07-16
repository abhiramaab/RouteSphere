package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateVehicleRequest;
import com.RouteSphere.REST.dto.Response.VehicleResponse;
import com.RouteSphere.REST.entity.Vehicle;
import com.RouteSphere.REST.repository.VehicleRepository;
import com.RouteSphere.REST.service.VehicleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    @Override
    public VehicleResponse createVehicle(CreateVehicleRequest request) {

        log.info("Creating vehicle with number: {}", request.getVehicleNumber());

        Vehicle vehicle = new Vehicle();

        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setVehicleCapacity(request.getVehicleCapacity());
        vehicle.setFuelType(request.getFuelType());
        vehicle.setInsuranceExpiry(request.getInsuranceExpiry());
        vehicle.setVehicleStatus(request.getVehicleStatus());

        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        log.info("Vehicle created successfully with id: {}", savedVehicle.getId());

        return mapToResponse(savedVehicle);
    }

    @Override
    public VehicleResponse findByVehicleId(Long vehicleId) {

        log.info("Retrieving vehicle with id: {}", vehicleId);

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> {
                    log.warn("Vehicle with id {} not found", vehicleId);
                    return new RuntimeException("Vehicle not found");
                });

        return mapToResponse(vehicle);
    }

    @Override
    public String deleteVehicle(Long vehicleId) {

        log.info("Deleting vehicle with id: {}", vehicleId);

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> {
                    log.warn("Vehicle with id {} not found", vehicleId);
                    return new RuntimeException("Vehicle not found");
                });

        vehicleRepository.delete(vehicle);

        log.info("Vehicle deleted successfully with id: {}", vehicleId);

        return "Vehicle Deleted Successfully : " + vehicle.getVehicleNumber();
    }

    @Override
    public VehicleResponse updateVehicle(Long vehicleId, CreateVehicleRequest request) {

        log.info("Updating vehicle with id: {}", vehicleId);

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> {
                    log.warn("Vehicle with id {} not found", vehicleId);
                    return new RuntimeException("Vehicle not found");
                });

        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setVehicleCapacity(request.getVehicleCapacity());
        vehicle.setFuelType(request.getFuelType());
        vehicle.setInsuranceExpiry(request.getInsuranceExpiry());
        vehicle.setVehicleStatus(request.getVehicleStatus());
        vehicle.setVehicleType(request.getVehicleType());

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);

        log.info("Vehicle updated successfully with id: {}", updatedVehicle.getId());

        return mapToResponse(updatedVehicle);
    }

    @Override
    public Page<VehicleResponse> findAll(Pageable pageable) {

        log.info("Retrieving all vehicles. Page: {}, Size: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        return vehicleRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    private VehicleResponse mapToResponse(Vehicle vehicle) {

        VehicleResponse response = new VehicleResponse();

        response.setVehicleId(vehicle.getId());
        response.setVehicleNumber(vehicle.getVehicleNumber());
        response.setVehicleCapacity(vehicle.getVehicleCapacity());
        response.setFuelType(vehicle.getFuelType());
        response.setInsuranceExpiry(vehicle.getInsuranceExpiry());
        response.setVehicleStatus(vehicle.getVehicleStatus());
        response.setVehicleType(vehicle.getVehicleType());

        return response;
    }
}