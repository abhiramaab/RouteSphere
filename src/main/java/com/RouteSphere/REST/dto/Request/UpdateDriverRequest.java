package com.RouteSphere.REST.dto.Request;

import com.RouteSphere.REST.enums.DriverStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDriverRequest {

    @NotBlank(message = "Driver name cannot be empty")
    @Size(max = 50, message = "Driver name too long")
    private String driverName;

    @NotBlank(message = "Driver phone cannot be empty")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Invalid phone number"
    )
    private String driverPhone;

    @NotBlank(message = "Driver license number cannot be empty")
    @Size(max = 20, message = "License number too long")
    private String driverLicenseNumber;

    @NotNull(message = "Driver license expiry cannot be empty")
    private LocalDate driverLicenseExpiry;

    @NotNull(message = "Experience cannot be empty")
    @DecimalMin(value = "0.0", message = "Experience cannot be negative")
    private Double experienceYears;

    @NotNull(message = "Driver status cannot be empty")
    private DriverStatus driverStatus;
}