package com.RouteSphere.REST.entity;

import com.RouteSphere.REST.enums.VehicleStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "maintenance")
@Data
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serviceType;
    private BigDecimal serviceCost;
    private LocalDate lastServiceDate;
    private LocalDate nextServiceDate;
    private String remarks;
    private Long vehicleId;
    private VehicleStatus vehicleStatus;

    @OneToMany(mappedBy = "maintenance")
    @JsonManagedReference
    private List<Vehicle> vehicles;
}
