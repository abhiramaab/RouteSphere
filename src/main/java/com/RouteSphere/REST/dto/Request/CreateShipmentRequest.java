package com.RouteSphere.REST.dto.Request;

import com.RouteSphere.REST.enums.ShipmentPriority;
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
public class CreateShipmentRequest {

    @NotBlank(message = "Tracking number cannot be empty")
    @Size(max = 30, message = "Tracking number too long")
    private String trackingNumber;

    @NotBlank(message = "Pickup location cannot be empty")
    @Size(max = 100, message = "Pickup location too long")
    private String pickupLocation;

    @NotBlank(message = "Delivery location cannot be empty")
    @Size(max = 100, message = "Delivery location too long")
    private String deliveryLocation;

    @NotNull(message = "Pickup date cannot be empty")
    private LocalDate pickupDate;

    private LocalDate deliveryDate;

    @NotNull(message = "Weight cannot be empty")
    @DecimalMin(value = "0.1", message = "Weight must be greater than 0")
    private Double weight;

    @NotNull(message = "Shipment priority cannot be empty")
    private ShipmentPriority shipmentPriority;

    @NotNull(message = "Invoice id cannot be blank")
    private Long invoiceId;
}