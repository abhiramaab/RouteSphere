package com.RouteSphere.REST.dto.Request;

import com.RouteSphere.REST.enums.TripStatus;
import com.RouteSphere.REST.enums.VehicleStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
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
public class CreateTripRequest {

    @NotBlank(message = "Trip number cannot be empty")
    @Size(max = 30, message = "Trip number too long")
    private String tripNumber;

    @NotBlank(message = "Start location cannot be empty")
    @Size(max = 100, message = "Start location too long")
    private String startLocation;

    @NotBlank(message = "End location cannot be empty")
    @Size(max = 100, message = "End location too long")
    private String endLocation;

    @NotNull(message = "Start date cannot be empty")
    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull(message = "Trip status cannot be empty")
    private TripStatus tripStatus;

    @NotNull(message = "Distance cannot be empty")
    @DecimalMin(value = "2.0", message = "Minimum chargeable distance is 2")
    private Double distance;

    @NotNull(message = "Vehicle status cannot be empty")
    private VehicleStatus vehicleStatus;

    @NotNull(message = "Shipment id cannot be empty")
    @Min(value = 1, message = "Shipment id cannot be less than 1")
    private Long shipmentId;
}