package com.RouteSphere.REST.service;

import com.RouteSphere.REST.dto.Request.CreateVehicleRequest;
import com.RouteSphere.REST.dto.Response.VehicleResponse;

public interface VehicleService {

    VehicleResponse createVehicle(CreateVehicleRequest request);
    VehicleResponse findByVehicleId(Long vehicleId);
    String deleteVehicle(Long vehicleId);
    VehicleResponse updateVehicle(Long vehicleId, CreateVehicleRequest request);
}
