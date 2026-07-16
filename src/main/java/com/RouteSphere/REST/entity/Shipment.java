package com.RouteSphere.REST.entity;

import com.RouteSphere.REST.enums.ShipmentPriority;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "shipment")
@Data
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trackingNumber;
    private String pickupLocation;
    private String deliveryLocation;
    private LocalDate pickupDate;
    private LocalDate deliveryDate;
    private Double weight;

    @Enumerated(EnumType.STRING)
    private ShipmentPriority shipmentPriority;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    @JsonBackReference
    private Customer customer;

    @OneToOne(mappedBy = "shipment", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Invoice invoice;

    @OneToOne
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    @JsonBackReference
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    @JsonBackReference
    private Vehicle vehicle;
}