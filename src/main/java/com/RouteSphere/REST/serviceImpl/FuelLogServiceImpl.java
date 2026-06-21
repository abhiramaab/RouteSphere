package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateFuelLogRequest;
import com.RouteSphere.REST.dto.Response.FuelLogRespone;
import com.RouteSphere.REST.entity.*;
import com.RouteSphere.REST.repository.CustomerRepository;
import com.RouteSphere.REST.repository.DriverRepository;
import com.RouteSphere.REST.repository.FuelLogRepository;
import com.RouteSphere.REST.repository.ShipmentRepository;
import com.RouteSphere.REST.service.FuelLogService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FuelLogServiceImpl implements FuelLogService {

    private final FuelLogRepository fuelLogRepository;
    private final DriverRepository driverRepository;
    private final ShipmentRepository shipmentRepository;
    private final CustomerRepository customerRepository;


    @Override
    public FuelLogRespone createFuelLog(CreateFuelLogRequest request) {

        Shipment shipment = shipmentRepository.findById(request.getShipmentId()).orElseThrow(() -> new RuntimeException("Shipment not found"));

        Trip trip = shipment.getTrip();

        if (trip == null) {
            throw new RuntimeException("No Trip assigned to this shipment");
        }

        Driver driver = trip.getDriver();
        Vehicle vehicle = trip.getVehicle();
        Customer customer = shipment.getCustomer();

        FuelLog fuelLog = new FuelLog();
        fuelLog.setFuelStation(request.getFuelStation());
        fuelLog.setFuelQuantity(request.getFuelQuantity());
        fuelLog.setFuelCost(request.getFuelCost());

        fuelLog.setTrip(trip);

        FuelLog savedFuelLog = fuelLogRepository.save(fuelLog);

        FuelLogRespone fuelLogRespone = new FuelLogRespone();
        fuelLogRespone.setId(savedFuelLog.getId());
        fuelLogRespone.setFuelCost(savedFuelLog.getFuelCost());
        fuelLogRespone.setFuelQuantity(savedFuelLog.getFuelQuantity());
        fuelLogRespone.setFuelStation(savedFuelLog.getFuelStation());

        fuelLogRespone.setDriverId(driver.getId());
        fuelLogRespone.setDriverName(driver.getDriverName());

        fuelLogRespone.setVehicleId(vehicle.getId());
        fuelLogRespone.setVehicleNumber(vehicle.getVehicleNumber());

        fuelLogRespone.setShipmentId(shipment.getId());

        fuelLogRespone.setCustomerId(customer.getId());
        fuelLogRespone.setCustomerName(customer.getCompanyName());

        return fuelLogRespone;
    }

    @Override
    public FuelLogRespone getFuelLog(Long fuelLogId) {
        FuelLog fuelLog = fuelLogRepository.findById(fuelLogId).orElseThrow(() -> new RuntimeException("FuelLog not found"));

        FuelLogRespone fuelLogRespone = new FuelLogRespone();
        fuelLogRespone.setId(fuelLog.getId());
        fuelLogRespone.setFuelCost(fuelLog.getFuelCost());
        fuelLogRespone.setFuelQuantity(fuelLog.getFuelQuantity());
        fuelLogRespone.setFuelStation(fuelLog.getFuelStation());

        fuelLogRespone.setDriverId(fuelLog.getTrip().getDriver().getId());
        fuelLogRespone.setDriverName(fuelLog.getTrip().getDriver().getDriverName());

        fuelLogRespone.setVehicleId(fuelLog.getTrip().getVehicle().getId());
        fuelLogRespone.setVehicleNumber(fuelLog.getTrip().getVehicle().getVehicleNumber());

        fuelLogRespone.setShipmentId(fuelLog.getTrip().getShipment().getId());

        fuelLogRespone.setCustomerId(fuelLog.getTrip().getCustomer().getId());
        fuelLogRespone.setCustomerName(fuelLog.getTrip().getCustomer().getCompanyName());

        return fuelLogRespone;

    }

    @Override
    public String deleteFuelLog(Long fuelLogId) {
        FuelLog fuelLog = fuelLogRepository.findById(fuelLogId).orElseThrow(() -> new RuntimeException("FuelLog not found"));
        fuelLogRepository.delete(fuelLog);
        return "FuelLog Deleted Successfully : " + fuelLogId;
    }

    @Override
    public FuelLogRespone updateFuelLog(Long fuelLogId, CreateFuelLogRequest request) {
        FuelLog fuelLog = fuelLogRepository.findById(fuelLogId).orElseThrow(() -> new RuntimeException("FuelLog not found"));

        fuelLog.setFuelCost(request.getFuelCost());
        fuelLog.setFuelQuantity(request.getFuelQuantity());
        fuelLog.setFuelStation(request.getFuelStation());

        FuelLog updatedLog = fuelLogRepository.save(fuelLog);

        FuelLogRespone fuelLogRespone = new FuelLogRespone();
        fuelLogRespone.setId(updatedLog.getId());
        fuelLogRespone.setFuelCost(updatedLog.getFuelCost());
        fuelLogRespone.setFuelQuantity(updatedLog.getFuelQuantity());
        fuelLogRespone.setFuelStation(updatedLog.getFuelStation());

        Trip trip = updatedLog.getTrip();

        fuelLogRespone.setDriverId(trip.getDriver().getId());
        fuelLogRespone.setDriverName(trip.getDriver().getDriverName());

        fuelLogRespone.setVehicleId(trip.getVehicle().getId());
        fuelLogRespone.setVehicleNumber(trip.getVehicle().getVehicleNumber());

        Shipment shipment = trip.getShipment();

        fuelLogRespone.setShipmentId(shipment.getId());
        fuelLogRespone.setCustomerId(shipment.getCustomer().getId());
        fuelLogRespone.setCustomerName(shipment.getCustomer().getCompanyName());
        return fuelLogRespone;
    }

    @Override
    public Page<FuelLogRespone> findAll(Pageable pageable) {
        return fuelLogRepository.findAll(pageable).map(this::mapToResponse);
    }

    private FuelLogRespone mapToResponse(FuelLog fuelLog) {
        FuelLogRespone fuelLogRespone = new FuelLogRespone();
        fuelLogRespone.setId(fuelLog.getId());
        fuelLogRespone.setFuelCost(fuelLog.getFuelCost());
        fuelLogRespone.setFuelQuantity(fuelLog.getFuelQuantity());
        fuelLogRespone.setFuelStation(fuelLog.getFuelStation());
        fuelLogRespone.setDriverId(fuelLog.getTrip().getDriver().getId());
        fuelLogRespone.setDriverName(fuelLog.getTrip().getDriver().getDriverName());
        fuelLogRespone.setVehicleId(fuelLog.getTrip().getVehicle().getId());
        fuelLogRespone.setVehicleNumber(fuelLog.getTrip().getVehicle().getVehicleNumber());
        fuelLogRespone.setShipmentId(fuelLog.getTrip().getShipment().getId());
        fuelLogRespone.setCustomerId(fuelLog.getTrip().getCustomer().getId());
        fuelLogRespone.setCustomerName(fuelLog.getTrip().getCustomer().getCompanyName());
        return fuelLogRespone;
    }


}
