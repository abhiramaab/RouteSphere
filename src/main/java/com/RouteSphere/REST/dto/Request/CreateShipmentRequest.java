package com.RouteSphere.REST.dto.Request;

import com.RouteSphere.REST.enums.ShipmentPriority;
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
public class CreateShipmentRequest {

    @NotBlank(message = "Tracking number cannot be empty")
    private String trackingNumber;

    @NotBlank(message = "Pickup location cannot be empty")
    private String pickupLocation;

    @NotBlank(message = "Delivery location cannot be empty")
    private String deliveryLocation;

    @NotBlank(message = "Pickup date cannot be empty")
    private LocalDate pickupDate;

    private LocalDate deliveryDate;

    @NotNull(message = "Weight cannot be blank")
    @Min(value = 1, message = "Minimum weight should be 1")
    private Double weight;

    private ShipmentPriority shipmentPriority;

}
