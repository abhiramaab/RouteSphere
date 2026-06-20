package com.RouteSphere.REST.entity;

import com.RouteSphere.REST.enums.TripStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "trip")
@Data
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tripNumber;
    private String startLocation;
    private String endLocation;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double distance;

    @Enumerated(EnumType.STRING)
    private TripStatus tripStatus;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @OneToMany(mappedBy = "trip")
    @JsonManagedReference
    private List<FuelLog> fuelLogs;

    @OneToOne(mappedBy = "trip")
    @JsonBackReference
    private Shipment shipment;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "customer_id")
    private Customer customer;
}
