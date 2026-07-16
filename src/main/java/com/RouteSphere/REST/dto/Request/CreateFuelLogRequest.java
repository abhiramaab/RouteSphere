package com.RouteSphere.REST.dto.Request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateFuelLogRequest {

    @NotNull(message = "Fuel quantity cannot be empty")
    @DecimalMin(value = "0.1", message = "Fuel quantity must be greater than 0")
    @DecimalMax(value = "1000.0", message = "Fuel quantity too large")
    private BigDecimal fuelQuantity;

    @NotNull(message = "Fuel cost cannot be empty")
    @DecimalMin(value = "1.00", message = "Fuel cost cannot be less than 1")
    @DecimalMax(value = "100000.00", message = "Fuel cost cannot exceed 1,00,000")
    private BigDecimal fuelCost;

    @NotBlank(message = "Fuel station cannot be empty")
    @Size(max = 50, message = "Fuel station name too long")
    private String fuelStation;

    @NotNull(message = "Shipment id cannot be empty")
    @Min(value = 1, message = "Shipment id can't be less than 1")
    private Long shipmentId;
}
