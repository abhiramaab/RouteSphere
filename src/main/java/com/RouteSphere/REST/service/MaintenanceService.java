package com.RouteSphere.REST.service;

import com.RouteSphere.REST.dto.Request.CreateMaintenanceRequest;
import com.RouteSphere.REST.dto.Response.MaintenanceResponse;
import com.RouteSphere.REST.entity.Maintenance;
import com.sun.tools.javac.Main;

import java.util.List;

public interface MaintenanceService {

    MaintenanceResponse createMaintenance(CreateMaintenanceRequest request);
    String deleteMaintenance(Long MaintenanceId);
    MaintenanceResponse updateMaintenance(Long MaintenanceId, CreateMaintenanceRequest request);
    MaintenanceResponse getMaintenance(Long MaintenanceId);

    MaintenanceResponse findByVehicleId(Long id);

}
