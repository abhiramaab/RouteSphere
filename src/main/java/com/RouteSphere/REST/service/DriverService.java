package com.RouteSphere.REST.service;

import com.RouteSphere.REST.dto.Request.CreateDriverRequest;
import com.RouteSphere.REST.dto.Request.UpdateDriverRequest;
import com.RouteSphere.REST.dto.Response.DriverIdsResponse;
import com.RouteSphere.REST.dto.Response.DriverResponse;
import com.RouteSphere.REST.entity.Driver;
import com.RouteSphere.REST.entity.Trip;

import java.util.List;

public interface DriverService {

    DriverResponse createDriver(CreateDriverRequest request);
    DriverResponse findDriverById(Long driverId);
    List<DriverIdsResponse> findAllDrivers();
    String deleteDriver(Long driverId);
    DriverResponse updateDriver(Long driverId, UpdateDriverRequest request);
}
