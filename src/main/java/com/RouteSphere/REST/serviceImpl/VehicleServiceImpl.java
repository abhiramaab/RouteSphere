package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateVehicleRequest;
import com.RouteSphere.REST.dto.Response.VehicleResponse;
import com.RouteSphere.REST.entity.Vehicle;
import com.RouteSphere.REST.enums.VehicleStatus;
import com.RouteSphere.REST.enums.VehicleType;
import com.RouteSphere.REST.repository.VehicleRepository;
import com.RouteSphere.REST.service.VehicleService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    @Override
    public VehicleResponse createVehicle(CreateVehicleRequest request) {
        Vehicle vehicle = new Vehicle();

        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setVehicleType(VehicleType.MINI_TRUCK);
        vehicle.setVehicleCapacity(request.getVehicleCapacity());
        vehicle.setFuelType(request.getFuelType());
        vehicle.setInsuranceExpiry(request.getInsuranceExpiry());
        vehicle.setVehicleStatus(VehicleStatus.AVAILABLE);

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        VehicleResponse vehicleResponse = new VehicleResponse();
        vehicleResponse.setVehicleId(savedVehicle.getId());
        vehicleResponse.setVehicleNumber(vehicle.getVehicleNumber());
        vehicleResponse.setVehicleCapacity(savedVehicle.getVehicleCapacity());
        vehicleResponse.setFuelType(savedVehicle.getFuelType());
        vehicleResponse.setInsuranceExpiry(savedVehicle.getInsuranceExpiry());
        vehicleResponse.setVehicleType(savedVehicle.getVehicleType());
        vehicleResponse.setVehicleStatus(savedVehicle.getVehicleStatus());
        return vehicleResponse;
    }

    @Override
    public VehicleResponse findByVehicleId(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new RuntimeException("Vehicle Not Found"));
        VehicleResponse vehicleResponse = new VehicleResponse();
        vehicleResponse.setVehicleId(vehicle.getId());
        vehicleResponse.setVehicleNumber(vehicle.getVehicleNumber());
        vehicleResponse.setVehicleCapacity(vehicle.getVehicleCapacity());
        vehicleResponse.setFuelType(vehicle.getFuelType());
        vehicleResponse.setVehicleType(vehicle.getVehicleType());
        vehicleResponse.setInsuranceExpiry(vehicle.getInsuranceExpiry());
        vehicleResponse.setVehicleStatus(vehicle.getVehicleStatus());
        return vehicleResponse;
    }

    @Override
    public String deleteVehicle(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new RuntimeException("Vehicle Not Found"));
        vehicleRepository.delete(vehicle);
        return "Vehicle Deleted Successfully : " + vehicle.getVehicleNumber();
    }

    @Override
    public VehicleResponse updateVehicle(Long vehicleId, CreateVehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new RuntimeException("Vehicle Not Found"));
        Vehicle updateVehicle = new Vehicle();
        updateVehicle.setVehicleNumber(request.getVehicleNumber());
        updateVehicle.setVehicleCapacity(request.getVehicleCapacity());
        updateVehicle.setFuelType(request.getFuelType());
        updateVehicle.setInsuranceExpiry(request.getInsuranceExpiry());
        updateVehicle.setVehicleStatus(request.getVehicleStatus());

        Vehicle updatedVehicle = vehicleRepository.save(updateVehicle);

        VehicleResponse vehicleResponse = new VehicleResponse();
        vehicleResponse.setVehicleId(vehicle.getId());
        vehicleResponse.setVehicleNumber(updatedVehicle.getVehicleNumber());
        vehicleResponse.setVehicleCapacity(updatedVehicle.getVehicleCapacity());
        vehicleResponse.setFuelType(updatedVehicle.getFuelType());
        vehicleResponse.setInsuranceExpiry(updatedVehicle.getInsuranceExpiry());
        vehicleResponse.setVehicleType(updatedVehicle.getVehicleType());
        vehicleResponse.setVehicleStatus(updatedVehicle.getVehicleStatus());
        return vehicleResponse;
    }
}
