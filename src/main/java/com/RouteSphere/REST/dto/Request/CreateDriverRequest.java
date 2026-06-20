package com.RouteSphere.REST.dto.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    private String driverPhone;

    @NotBlank(message = "Driver license cannot be empty")
    private String driverLicenseNumber;

    @NotBlank(message = "Driver license expiry cannot be empty")
    private LocalDate driverLicenseExpiry;

    @NotNull(message = "Driver experience cannot be empty")
    private Double experienceYears;
}
