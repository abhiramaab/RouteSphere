package com.RouteSphere.REST.dto.Request;

import com.RouteSphere.REST.enums.TripStatus;
import com.RouteSphere.REST.enums.VehicleStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTripRequest {

    @NotBlank(message = "Trip number cannot be empty")
    private String tripNumber;

    @NotBlank(message = "Start location cannot be empty")
    private String startLocation;

    @NotBlank(message = "End location cannot be empty")
    private String endLocation;

    @NotBlank(message = "Start date cannot be empty")
    private LocalDate startDate;

    private LocalDate endDate;
    private TripStatus tripStatus;

    @NotNull(message = "Distance cannot be blank")
    @Min(value = 2, message = "Minimum chargeable distance is 2")
    private Double distance;

    private VehicleStatus vehicleStatus;

    @NotNull(message = "Shipment id cannt be blank")
    @Min(value = 1, message = "Shipment id cannot be less than 1")
    private Long shipmentId;
}
