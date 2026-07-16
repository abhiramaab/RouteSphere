package com.RouteSphere.REST.dto.Request;

import com.RouteSphere.REST.enums.VehicleStatus;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMaintenanceRequest {

    @NotBlank(message = "Service type cannot be empty")
    @Size(max = 50, message = "Service type too long")
    private String serviceType;

    @NotNull(message = "Service cost cannot be empty")
    @DecimalMin(value = "0.00", message = "Service cost cannot be negative")
    @DecimalMax(value = "1000000.00", message = "Service cost too large")
    private BigDecimal serviceCost;

    @NotNull(message = "Last service date cannot be empty")
    private LocalDate lastServiceDate;

    private LocalDate nextServiceDate;

    @Size(max = 255, message = "Remarks too long")
    private String remarks;

    @NotNull(message = "Vehicle id cannot be empty")
    @Min(value = 1, message = "Invalid vehicle id")
    private Long vehicleId;

    @NotNull(message = "Vehicle status cannot be empty")
    private VehicleStatus vehicleStatus;
}