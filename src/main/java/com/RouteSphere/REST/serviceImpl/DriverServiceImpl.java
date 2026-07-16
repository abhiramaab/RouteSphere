package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateDriverRequest;
import com.RouteSphere.REST.dto.Request.UpdateDriverRequest;
import com.RouteSphere.REST.dto.Response.DriverResponse;
import com.RouteSphere.REST.entity.Driver;
import com.RouteSphere.REST.entity.Trip;
import com.RouteSphere.REST.enums.DriverStatus;
import com.RouteSphere.REST.repository.DriverRepository;
import com.RouteSphere.REST.service.DriverService;
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
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;

    @Override
    public DriverResponse createDriver(CreateDriverRequest request) {

        log.info("Creating driver with license number: {}", request.getDriverLicenseNumber());

        Driver driver = new Driver();

        driver.setDriverName(request.getDriverName());
        driver.setDriverPhone(request.getDriverPhone());
        driver.setDriverLicenseExpiry(request.getDriverLicenseExpiry());
        driver.setDriverLicenseNumber(request.getDriverLicenseNumber());
        driver.setExperienceYears(request.getExperienceYears());
        driver.setDriverStatus(DriverStatus.AVAILABLE);

        Driver savedDriver = driverRepository.save(driver);

        log.info("Driver created successfully with id: {}", savedDriver.getId());

        return mapToResponse(savedDriver);
    }

    @Override
    public DriverResponse findDriverById(Long driverId) {

        log.info("Retrieving driver with id: {}", driverId);

        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with id {} not found", driverId);
                    return new RuntimeException("Driver not found");
                });

        DriverResponse response = mapToResponse(driver);
        response.setTripIds(driver.getTrips().stream().map(Trip::getId).toList());

        return response;
    }

    @Override
    public String deleteDriver(Long driverId) {

        log.info("Deleting driver with id: {}", driverId);

        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with id {} not found", driverId);
                    return new RuntimeException("Driver not found");
                });

        if (!driver.getTrips().isEmpty()) {
            log.warn("Driver {} is assigned to trips", driverId);
            throw new RuntimeException("Driver is assigned to trips and cannot be deleted");
        }

        driverRepository.delete(driver);

        log.info("Driver deleted successfully with id: {}", driverId);

        return "Driver Deleted Successfully : " + driver.getDriverName();
    }

    @Override
    public DriverResponse updateDriver(Long driverId, UpdateDriverRequest request) {

        log.info("Updating driver with id: {}", driverId);

        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with id {} not found", driverId);
                    return new RuntimeException("Driver not found");
                });

        driver.setDriverName(request.getDriverName());
        driver.setDriverLicenseExpiry(request.getDriverLicenseExpiry());
        driver.setDriverLicenseNumber(request.getDriverLicenseNumber());
        driver.setDriverPhone(request.getDriverPhone());
        driver.setExperienceYears(request.getExperienceYears());
        driver.setDriverStatus(request.getDriverStatus());

        Driver updatedDriver = driverRepository.save(driver);

        log.info("Driver updated successfully with id: {}", updatedDriver.getId());

        return mapToResponse(updatedDriver);
    }

    @Override
    public Page<DriverResponse> findAll(Pageable pageable) {

        log.info("Retrieving all drivers. Page: {}, Size: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        return driverRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    private DriverResponse mapToResponse(Driver driver) {

        DriverResponse response = new DriverResponse();

        response.setId(driver.getId());
        response.setDriverName(driver.getDriverName());
        response.setDriverLicenseExpiry(driver.getDriverLicenseExpiry());
        response.setDriverLicenseNumber(driver.getDriverLicenseNumber());
        response.setExperienceYears(driver.getExperienceYears());
        response.setDriverPhone(driver.getDriverPhone());
        response.setDriverStatus(driver.getDriverStatus());

        return response;
    }
}