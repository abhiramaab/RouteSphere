package com.RouteSphere.REST.dto.Request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDriverRequest {

    @NotBlank(message = "Driver name cannot be empty")
    private String driverName;

    @NotBlank(message = "Driver phone cannot be empty")
    @Size(min = 10, max = 10, message = "Phone number must be 10 digits")
    private String driverPhone;

    @NotBlank(message = "Driver license cannot be empty")
    @Size(max = 20, message = "License number too long")
    private String driverLicenseNumber;

    @NotNull(message = "Driver license expiry cannot be empty")
    private LocalDate driverLicenseExpiry;

    @NotNull(message = "Driver experience cannot be empty")
    @DecimalMin(value = "0.0", inclusive = true,
            message = "Experience cannot be negative")
    private Double experienceYears;
}
