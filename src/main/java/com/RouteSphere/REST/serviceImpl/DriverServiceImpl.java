package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateDriverRequest;
import com.RouteSphere.REST.dto.Request.UpdateDriverRequest;
import com.RouteSphere.REST.dto.Response.DriverIdsResponse;
import com.RouteSphere.REST.dto.Response.DriverResponse;
import com.RouteSphere.REST.entity.Driver;
import com.RouteSphere.REST.entity.Trip;
import com.RouteSphere.REST.enums.DriverStatus;
import com.RouteSphere.REST.repository.DriverRepository;
import com.RouteSphere.REST.service.DriverService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;

    @Override
    public DriverResponse createDriver(CreateDriverRequest request) {

        Driver  driver = new Driver();

        driver.setDriverName(request.getDriverName());
        driver.setDriverPhone(request.getDriverPhone());
        driver.setDriverLicenseExpiry(request.getDriverLicenseExpiry());
        driver.setDriverLicenseNumber(request.getDriverLicenseNumber());
        driver.setExperienceYears(request.getExperienceYears());

        driver.setDriverStatus(DriverStatus.AVAILABLE);

        Driver savedDriver = driverRepository.save(driver);

        DriverResponse driverResponse = new DriverResponse();

        driverResponse.setId(savedDriver.getId());
        driverResponse.setDriverName(savedDriver.getDriverName());
        driverResponse.setDriverLicenseExpiry(savedDriver.getDriverLicenseExpiry());
        driverResponse.setDriverLicenseNumber(savedDriver.getDriverLicenseNumber());
        driverResponse.setExperienceYears(savedDriver.getExperienceYears());
        driverResponse.setDriverPhone(savedDriver.getDriverPhone());
        driverResponse.setDriverStatus(savedDriver.getDriverStatus());

        return driverResponse;
    }

    @Override
    public DriverResponse findDriverById(Long driverId) {
        Driver driver = driverRepository.findById(driverId).orElseThrow(() -> new RuntimeException("Driver Not Found"));

        DriverResponse driverResponse = new DriverResponse();
        driverResponse.setId(driver.getId());
        driverResponse.setDriverName(driver.getDriverName());
        driverResponse.setDriverLicenseExpiry(driver.getDriverLicenseExpiry());
        driverResponse.setDriverLicenseNumber(driver.getDriverLicenseNumber());
        driverResponse.setExperienceYears(driver.getExperienceYears());
        driverResponse.setDriverPhone(driver.getDriverPhone());
        driverResponse.setDriverStatus(driver.getDriverStatus());

        driverResponse.setTripIds(driver.getTrips().stream().map(Trip::getId).toList());

        return driverResponse;
    }

    @Override
    public List<DriverIdsResponse> findAllDrivers() {
        List<Driver> drivers = driverRepository.findAll();

        return drivers.stream().map(driver -> {
            DriverIdsResponse driverResponse = new DriverIdsResponse();
            driverResponse.setDriverId(driver.getId());
            driverResponse.setDriverName(driver.getDriverName());
            return driverResponse;
        })
                .toList();



    }

    @Override
    public String deleteDriver(Long driverId) {
        Driver driver = driverRepository.findById(driverId).orElseThrow(() -> new RuntimeException("Driver Not Found"));

        if (!driver.getTrips().isEmpty()) {
            throw new RuntimeException("Driver is assigned to trips and cannot be deleted");
        }

        driverRepository.delete(driver);
        return "Driver Deleted Successfully : " + driver.getDriverName();
    }

    @Override
    public DriverResponse updateDriver(Long driverId, UpdateDriverRequest request) {
        Driver driver = driverRepository.findById(driverId).orElseThrow(() -> new RuntimeException("Driver Not Found"));

        driver.setDriverName(request.getDriverName());
        driver.setDriverLicenseExpiry(request.getDriverLicenseExpiry());
        driver.setDriverLicenseNumber(request.getDriverLicenseNumber());
        driver.setDriverPhone(request.getDriverPhone());
        driver.setExperienceYears(request.getExperienceYears());
        driver.setDriverStatus(request.getDriverStatus());

        Driver updatedDriver = driverRepository.save(driver);
        DriverResponse driverResponse = new DriverResponse();
        driverResponse.setId(driverId);
        driverResponse.setDriverName(updatedDriver.getDriverName());
        driverResponse.setDriverLicenseExpiry(updatedDriver.getDriverLicenseExpiry());
        driverResponse.setDriverLicenseNumber(updatedDriver.getDriverLicenseNumber());
        driverResponse.setExperienceYears(updatedDriver.getExperienceYears());
        driverResponse.setDriverPhone(updatedDriver.getDriverPhone());
        driverResponse.setDriverStatus(updatedDriver.getDriverStatus());
        return driverResponse;
    }

    @Override
    public Page<DriverResponse> findAll(Pageable pageable) {
        return driverRepository.findAll(pageable).map(this::mapToResponse);
    }

    private DriverResponse mapToResponse(Driver driver) {
        DriverResponse driverResponse = new DriverResponse();
        driverResponse.setId(driver.getId());
        driverResponse.setDriverName(driver.getDriverName());
        driverResponse.setDriverLicenseExpiry(driver.getDriverLicenseExpiry());
        driverResponse.setDriverLicenseNumber(driver.getDriverLicenseNumber());
        driverResponse.setExperienceYears(driver.getExperienceYears());
        driverResponse.setDriverPhone(driver.getDriverPhone());
        driverResponse.setDriverStatus(driver.getDriverStatus());
        return driverResponse;
    }


}
