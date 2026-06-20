package com.RouteSphere.REST.dto.Request;

import com.RouteSphere.REST.enums.DriverStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDriverRequest {


    @NotBlank(message = "Driver name cannot be empty")
    private String driverName;

    @NotBlank(message = "Driver phone cannot be empty")
    private String driverPhone;

    @NotBlank(message = "Driver license number cannot be empty")
    private String driverLicenseNumber;

    @NotBlank(message = "Driver license expiry cannot be empty")
    private LocalDate driverLicenseExpiry;

    @NotBlank(message = "Experience name cannot be empty")
    private Double experienceYears;

    @NotBlank(message = "Driver status cannot be empty")
    private DriverStatus driverStatus;
}
