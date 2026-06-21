package com.RouteSphere.REST.dto.Request;

import com.RouteSphere.REST.enums.FuelType;
import com.RouteSphere.REST.enums.VehicleStatus;
import com.RouteSphere.REST.enums.VehicleType;
import jakarta.validation.constraints.DecimalMin;
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
public class CreateVehicleRequest {

    @NotBlank(message = "Vehicle number cannot be empty")
    @Size(max = 20, message = "Vehicle number too long")
    private String vehicleNumber;

    @NotNull(message = "Vehicle capacity cannot be empty")
    @DecimalMin(value = "0.1", message = "Vehicle capacity must be greater than 0")
    private Double vehicleCapacity;

    @NotNull(message = "Vehicle type cannot be empty")
    private VehicleType vehicleType;

    @NotNull(message = "Fuel type cannot be empty")
    private FuelType fuelType;

    @NotNull(message = "Vehicle status cannot be empty")
    private VehicleStatus vehicleStatus;

    @NotNull(message = "Insurance expiry cannot be empty")
    private LocalDate insuranceExpiry;
}