package com.RouteSphere.REST.dto.Request;

import com.RouteSphere.REST.enums.VehicleStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    private String serviceType;

    @NotNull(message = "Service cost cannot be empty")
    private BigDecimal serviceCost;

    @NotBlank(message = "Last service date cannot be empty")
    private LocalDate lastServiceDate;

    private LocalDate nextServiceDate;

    @NotBlank(message = "Incase of no remark please type 'none'")
    private String remarks;

    @NotNull(message = "Vehicle id cannot be empty")
    private Long vehicleId;

    @NotBlank(message = "Vehicle status cannot be empty")
    private VehicleStatus vehicleStatus;
}
