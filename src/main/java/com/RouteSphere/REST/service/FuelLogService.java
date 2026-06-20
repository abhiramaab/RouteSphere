package com.RouteSphere.REST.service;

import com.RouteSphere.REST.dto.Request.CreateFuelLogRequest;
import com.RouteSphere.REST.dto.Response.FuelLogRespone;
import com.RouteSphere.REST.entity.FuelLog;

public interface FuelLogService {

    FuelLogRespone createFuelLog(CreateFuelLogRequest request);
    FuelLogRespone getFuelLog(Long id);
    String deleteFuelLog(Long fuelLogId);
    FuelLogRespone updateFuelLog(Long fuelLogId, CreateFuelLogRequest request);

}
