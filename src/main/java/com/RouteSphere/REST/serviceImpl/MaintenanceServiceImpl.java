package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateMaintenanceRequest;
import com.RouteSphere.REST.dto.Response.MaintenanceResponse;
import com.RouteSphere.REST.entity.Maintenance;
import com.RouteSphere.REST.repository.MaintenanceRepository;
import com.RouteSphere.REST.service.MaintenanceService;
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
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;

    @Override
    public MaintenanceResponse createMaintenance(CreateMaintenanceRequest request) {

        log.info("Creating maintenance record for vehicle id: {}", request.getVehicleId());

        Maintenance maintenance = new Maintenance();

        maintenance.setServiceType(request.getServiceType());
        maintenance.setVehicleId(request.getVehicleId());
        maintenance.setRemarks(request.getRemarks());
        maintenance.setServiceCost(request.getServiceCost());
        maintenance.setLastServiceDate(request.getLastServiceDate());
        maintenance.setNextServiceDate(request.getNextServiceDate());
        maintenance.setVehicleStatus(request.getVehicleStatus());

        Maintenance savedMaintenance = maintenanceRepository.save(maintenance);

        log.info("Maintenance record created successfully with id: {}", savedMaintenance.getId());

        return mapToResponse(savedMaintenance);
    }

    @Override
    public String deleteMaintenance(Long maintenanceId) {

        log.info("Deleting maintenance record with id: {}", maintenanceId);

        Maintenance maintenance = maintenanceRepository.findById(maintenanceId)
                .orElseThrow(() -> {
                    log.warn("Maintenance with id {} not found", maintenanceId);
                    return new RuntimeException("Maintenance not found");
                });

        maintenanceRepository.delete(maintenance);

        log.info("Maintenance deleted successfully with id: {}", maintenanceId);

        return "Deleted maintenance with id: " + maintenanceId;
    }

    @Override
    public MaintenanceResponse updateMaintenance(Long maintenanceId, CreateMaintenanceRequest request) {

        log.info("Updating maintenance record with id: {}", maintenanceId);

        Maintenance maintenance = maintenanceRepository.findById(maintenanceId)
                .orElseThrow(() -> {
                    log.warn("Maintenance with id {} not found", maintenanceId);
                    return new RuntimeException("Maintenance not found");
                });

        maintenance.setLastServiceDate(request.getLastServiceDate());
        maintenance.setNextServiceDate(request.getNextServiceDate());
        maintenance.setServiceCost(request.getServiceCost());
        maintenance.setServiceType(request.getServiceType());
        maintenance.setRemarks(request.getRemarks());
        maintenance.setVehicleStatus(request.getVehicleStatus());

        Maintenance updatedMaintenance = maintenanceRepository.save(maintenance);

        log.info("Maintenance updated successfully with id: {}", updatedMaintenance.getId());

        return mapToResponse(updatedMaintenance);
    }

    @Override
    public MaintenanceResponse getMaintenance(Long maintenanceId) {

        log.info("Retrieving maintenance with id: {}", maintenanceId);

        Maintenance maintenance = maintenanceRepository.findById(maintenanceId)
                .orElseThrow(() -> {
                    log.warn("Maintenance with id {} not found", maintenanceId);
                    return new RuntimeException("Maintenance not found");
                });

        return mapToResponse(maintenance);
    }

    @Override
    public MaintenanceResponse findByVehicleId(Long vehicleId) {

        log.info("Retrieving maintenance for vehicle id: {}", vehicleId);

        Maintenance maintenance = maintenanceRepository.findByVehicleId(vehicleId)
                .orElseThrow(() -> {
                    log.warn("Maintenance not found for vehicle id {}", vehicleId);
                    return new RuntimeException("Maintenance not found");
                });

        return mapToResponse(maintenance);
    }

    @Override
    public Page<MaintenanceResponse> findAll(Pageable pageable) {

        log.info("Retrieving all maintenance records. Page: {}, Size: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        return maintenanceRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    private MaintenanceResponse mapToResponse(Maintenance maintenance) {

        MaintenanceResponse response = new MaintenanceResponse();

        response.setMaintenanceId(maintenance.getId());
        response.setLastServiceDate(maintenance.getLastServiceDate());
        response.setNextServiceDate(maintenance.getNextServiceDate());
        response.setServiceCost(maintenance.getServiceCost());
        response.setServiceType(maintenance.getServiceType());
        response.setRemarks(maintenance.getRemarks());
        response.setVehicleId(maintenance.getVehicleId());
        response.setVehicleStatus(maintenance.getVehicleStatus());

        return response;
    }
}