package com.RouteSphere.REST.service;

import com.RouteSphere.REST.dto.Request.CreateVehicleRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.dto.Response.VehicleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VehicleService {

    VehicleResponse createVehicle(CreateVehicleRequest request);
    VehicleResponse findByVehicleId(Long vehicleId);
    String deleteVehicle(Long vehicleId);
    VehicleResponse updateVehicle(Long vehicleId, CreateVehicleRequest request);
    Page<VehicleResponse> findAll(Pageable pageable);
}
