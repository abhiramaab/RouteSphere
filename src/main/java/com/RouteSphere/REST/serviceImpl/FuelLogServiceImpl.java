package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateFuelLogRequest;
import com.RouteSphere.REST.dto.Response.FuelLogRespone;
import com.RouteSphere.REST.entity.FuelLog;
import com.RouteSphere.REST.entity.Shipment;
import com.RouteSphere.REST.entity.Trip;
import com.RouteSphere.REST.repository.FuelLogRepository;
import com.RouteSphere.REST.repository.ShipmentRepository;
import com.RouteSphere.REST.service.FuelLogService;
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
public class FuelLogServiceImpl implements FuelLogService {

    private final FuelLogRepository fuelLogRepository;
    private final ShipmentRepository shipmentRepository;

    @Override
    public FuelLogRespone createFuelLog(CreateFuelLogRequest request) {

        log.info("Creating fuel log for shipment id: {}", request.getShipmentId());

        Shipment shipment = shipmentRepository.findById(request.getShipmentId())
                .orElseThrow(() -> {
                    log.warn("Shipment with id {} not found", request.getShipmentId());
                    return new RuntimeException("Shipment not found");
                });

        Trip trip = shipment.getTrip();

        if (trip == null) {
            log.warn("No trip assigned for shipment {}", shipment.getId());
            throw new RuntimeException("No Trip assigned to this shipment");
        }

        FuelLog fuelLog = new FuelLog();
        fuelLog.setFuelStation(request.getFuelStation());
        fuelLog.setFuelQuantity(request.getFuelQuantity());
        fuelLog.setFuelCost(request.getFuelCost());
        fuelLog.setTrip(trip);

        FuelLog savedFuelLog = fuelLogRepository.save(fuelLog);

        log.info("Fuel log created successfully with id: {}", savedFuelLog.getId());

        return mapToResponse(savedFuelLog);
    }

    @Override
    public FuelLogRespone getFuelLog(Long fuelLogId) {

        log.info("Retrieving fuel log with id: {}", fuelLogId);

        FuelLog fuelLog = fuelLogRepository.findById(fuelLogId)
                .orElseThrow(() -> {
                    log.warn("Fuel log with id {} not found", fuelLogId);
                    return new RuntimeException("FuelLog not found");
                });

        return mapToResponse(fuelLog);
    }

    @Override
    public String deleteFuelLog(Long fuelLogId) {

        log.info("Deleting fuel log with id: {}", fuelLogId);

        FuelLog fuelLog = fuelLogRepository.findById(fuelLogId)
                .orElseThrow(() -> {
                    log.warn("Fuel log with id {} not found", fuelLogId);
                    return new RuntimeException("FuelLog not found");
                });

        fuelLogRepository.delete(fuelLog);

        log.info("Fuel log deleted successfully with id: {}", fuelLogId);

        return "FuelLog Deleted Successfully : " + fuelLogId;
    }

    @Override
    public FuelLogRespone updateFuelLog(Long fuelLogId, CreateFuelLogRequest request) {

        log.info("Updating fuel log with id: {}", fuelLogId);

        FuelLog fuelLog = fuelLogRepository.findById(fuelLogId)
                .orElseThrow(() -> {
                    log.warn("Fuel log with id {} not found", fuelLogId);
                    return new RuntimeException("FuelLog not found");
                });

        fuelLog.setFuelCost(request.getFuelCost());
        fuelLog.setFuelQuantity(request.getFuelQuantity());
        fuelLog.setFuelStation(request.getFuelStation());

        FuelLog updatedLog = fuelLogRepository.save(fuelLog);

        log.info("Fuel log updated successfully with id: {}", updatedLog.getId());

        return mapToResponse(updatedLog);
    }

    @Override
    public Page<FuelLogRespone> findAll(Pageable pageable) {

        log.info("Retrieving all fuel logs. Page: {}, Size: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        return fuelLogRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    private FuelLogRespone mapToResponse(FuelLog fuelLog) {

        FuelLogRespone response = new FuelLogRespone();

        response.setId(fuelLog.getId());
        response.setFuelCost(fuelLog.getFuelCost());
        response.setFuelQuantity(fuelLog.getFuelQuantity());
        response.setFuelStation(fuelLog.getFuelStation());

        Trip trip = fuelLog.getTrip();

        response.setDriverId(trip.getDriver().getId());
        response.setDriverName(trip.getDriver().getDriverName());

        response.setVehicleId(trip.getVehicle().getId());
        response.setVehicleNumber(trip.getVehicle().getVehicleNumber());

        response.setShipmentId(trip.getShipment().getId());

        response.setCustomerId(trip.getCustomer().getId());
        response.setCustomerName(trip.getCustomer().getCompanyName());

        return response;
    }
}