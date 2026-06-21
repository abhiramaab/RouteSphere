package com.RouteSphere.REST.dto.Response;

import com.RouteSphere.REST.entity.Customer;
import com.RouteSphere.REST.entity.Invoice;
import com.RouteSphere.REST.enums.ShipmentPriority;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ShipmentResponse {

    private Long id;

    private String trackingNumber;
    private String pickupLocation;
    private String deliveryLocation;
    private LocalDate pickupDate;
    private LocalDate deliveryDate;
    private Double weight;
    private ShipmentPriority shipmentPriority;


    private Long customerId;

    private Long invoiceId;
}
