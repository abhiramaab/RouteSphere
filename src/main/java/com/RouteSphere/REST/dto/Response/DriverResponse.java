package com.RouteSphere.REST.dto.Response;

import com.RouteSphere.REST.enums.DriverStatus;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class DriverResponse {

    private Long id;

    private String driverName;
    private String driverPhone;
    private String driverLicenseNumber;
    private LocalDate driverLicenseExpiry;
    private Double experienceYears;

    private DriverStatus driverStatus;
    private List<Long> tripIds;
}
