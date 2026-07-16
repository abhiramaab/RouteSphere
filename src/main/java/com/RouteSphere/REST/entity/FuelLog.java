package com.RouteSphere.REST.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "fuelLog")
@Data
public class FuelLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal fuelQuantity;
    private BigDecimal fuelCost;
    private String fuelStation;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "trip_id")
    private Trip  trip;
}
