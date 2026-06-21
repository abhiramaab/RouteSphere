package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateMaintenanceRequest;
import com.RouteSphere.REST.dto.Response.MaintenanceResponse;
import com.RouteSphere.REST.dto.Response.VehicleResponse;
import com.RouteSphere.REST.entity.Maintenance;
import com.RouteSphere.REST.entity.Vehicle;
import com.RouteSphere.REST.repository.MaintenanceRepository;
import com.RouteSphere.REST.repository.VehicleRepository;
import com.RouteSphere.REST.service.MaintenanceService;
import com.sun.tools.javac.Main;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final VehicleRepository vehicleRepository;

    @Override
    public MaintenanceResponse createMaintenance(CreateMaintenanceRequest request) {
        Maintenance  maintenance = new Maintenance();
        maintenance.setServiceType(request.getServiceType());
        maintenance.setVehicleId(request.getVehicleId());
        maintenance.setRemarks(request.getRemarks());
        maintenance.setServiceCost(request.getServiceCost());
        maintenance.setLastServiceDate(request.getLastServiceDate());
        maintenance.setNextServiceDate(request.getNextServiceDate());
        Maintenance savedMaintenance = maintenanceRepository.save(maintenance);

        MaintenanceResponse maintenanceResponse = new MaintenanceResponse();
        maintenanceResponse.setMaintenanceId(savedMaintenance.getId());
        maintenanceResponse.setLastServiceDate(savedMaintenance.getLastServiceDate());
        maintenanceResponse.setNextServiceDate(savedMaintenance.getNextServiceDate());
        maintenanceResponse.setServiceCost(savedMaintenance.getServiceCost());
        maintenanceResponse.setServiceType(savedMaintenance.getServiceType());
        maintenanceResponse.setRemarks(savedMaintenance.getRemarks());
        maintenanceResponse.setVehicleId(savedMaintenance.getVehicleId());
        return maintenanceResponse;
    }

    @Override
    public String deleteMaintenance(Long MaintenanceId) {
        Maintenance maintenance = maintenanceRepository.findById(MaintenanceId).orElseThrow(() -> new RuntimeException("maintenance id not found"));
        maintenanceRepository.delete(maintenance);
      return "Deleted maintenance with id: " + MaintenanceId;
    }

    @Override
    public MaintenanceResponse updateMaintenance(Long MaintenanceId, CreateMaintenanceRequest request) {
        Maintenance maintenance = maintenanceRepository.findById(MaintenanceId).orElseThrow(() -> new RuntimeException("Maintenance not found"));

        maintenance.setLastServiceDate(request.getLastServiceDate());
        maintenance.setNextServiceDate(request.getNextServiceDate());
        maintenance.setServiceCost(request.getServiceCost());
        maintenance.setServiceType(request.getServiceType());
        maintenance.setRemarks(request.getRemarks());
        maintenance.setVehicleStatus(request.getVehicleStatus());

        Maintenance updatedMaintenance = maintenanceRepository.save(maintenance);

        MaintenanceResponse maintenanceResponse = new MaintenanceResponse();
        maintenanceResponse.setMaintenanceId(updatedMaintenance.getId());
        maintenanceResponse.setLastServiceDate(updatedMaintenance.getLastServiceDate());
        maintenanceResponse.setNextServiceDate(updatedMaintenance.getNextServiceDate());
        maintenanceResponse.setServiceCost(updatedMaintenance.getServiceCost());
        maintenanceResponse.setServiceType(updatedMaintenance.getServiceType());
        maintenanceResponse.setRemarks(updatedMaintenance.getRemarks());
        maintenanceResponse.setVehicleId(updatedMaintenance.getVehicleId());
        maintenanceResponse.setVehicleStatus(updatedMaintenance.getVehicleStatus());
        return maintenanceResponse;
    }

    @Override
    public MaintenanceResponse getMaintenance(Long MaintenanceId) {
        Maintenance  maintenance = maintenanceRepository.findById(MaintenanceId).orElseThrow(() -> new RuntimeException("Maintenance not found"));
        MaintenanceResponse maintenanceResponse = new MaintenanceResponse();
        maintenanceResponse.setMaintenanceId(maintenance.getId());
        maintenanceResponse.setLastServiceDate(maintenance.getLastServiceDate());
        maintenanceResponse.setNextServiceDate(maintenance.getNextServiceDate());
        maintenanceResponse.setServiceCost(maintenance.getServiceCost());
        maintenanceResponse.setServiceType(maintenance.getServiceType());
        maintenanceResponse.setRemarks(maintenance.getRemarks());
        maintenanceResponse.setVehicleId(maintenance.getVehicleId());
        return maintenanceResponse;
    }

    @Override
    public MaintenanceResponse findByVehicleId(Long id) {
        Maintenance maintenance = maintenanceRepository.findById(id).orElseThrow(() -> new RuntimeException("Maintenance not found"));

        MaintenanceResponse maintenanceResponse = new MaintenanceResponse();
        maintenanceResponse.setVehicleId(maintenance.getVehicleId());
        maintenanceResponse.setRemarks(maintenance.getRemarks());
        maintenanceResponse.setLastServiceDate(maintenance.getLastServiceDate());
        maintenanceResponse.setNextServiceDate(maintenance.getNextServiceDate());
        maintenanceResponse.setServiceCost(maintenance.getServiceCost());
        maintenanceResponse.setServiceType(maintenance.getServiceType());
        maintenanceResponse.setRemarks(maintenance.getRemarks());
        maintenanceResponse.setMaintenanceId(maintenance.getId());
        return maintenanceResponse;
    }

    @Override
    public Page<MaintenanceResponse> findAll(Pageable pageable) {
        return maintenanceRepository.findAll(pageable).map(this::mapToRepsonse);
    }

    private MaintenanceResponse mapToRepsonse(Maintenance maintenance) {
        MaintenanceResponse maintenanceResponse = new MaintenanceResponse();
        maintenanceResponse.setMaintenanceId(maintenance.getId());
        maintenanceResponse.setLastServiceDate(maintenance.getLastServiceDate());
        maintenanceResponse.setNextServiceDate(maintenance.getNextServiceDate());
        maintenanceResponse.setServiceCost(maintenance.getServiceCost());
        maintenanceResponse.setServiceType(maintenance.getServiceType());
        maintenanceResponse.setRemarks(maintenance.getRemarks());
        maintenanceResponse.setVehicleId(maintenance.getVehicleId());
        return maintenanceResponse;
    }
}
