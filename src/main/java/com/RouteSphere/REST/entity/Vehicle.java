package com.RouteSphere.REST.entity;

import com.RouteSphere.REST.enums.FuelType;
import com.RouteSphere.REST.enums.VehicleStatus;
import com.RouteSphere.REST.enums.VehicleType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "vehicle")
@Data
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleNumber;
    private Double vehicleCapacity;

    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    private FuelType fuelType;

    @Enumerated(EnumType.STRING)
    private VehicleStatus vehicleStatus;

    private LocalDate insuranceExpiry;

    @OneToMany(mappedBy = "vehicle")
    @JsonManagedReference
    private List<Trip> trips;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "maintenance_id")
    private Maintenance maintenance;
}
