package com.RouteSphere.REST.dto.Request;

import com.RouteSphere.REST.enums.FuelType;
import com.RouteSphere.REST.enums.VehicleStatus;
import com.RouteSphere.REST.enums.VehicleType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateVehicleRequest {

    @NotBlank(message = "Vehicle number cannot be empty")
    private String vehicleNumber;

    @NotNull(message = "Vehicle capacity cannot be empty")
    private Double vehicleCapacity;

    @NotBlank(message = "Vehicle type cannot be empty")
    private VehicleType vehicleType;

    @NotBlank(message = "Fuel type cannot be empty")
    private FuelType fuelType;


    private VehicleStatus vehicleStatus;

    @NotBlank(message = "Insurance expiry cannot be empty")
    private LocalDate insuranceExpiry;
}
