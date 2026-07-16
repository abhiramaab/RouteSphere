package com.RouteSphere.REST.dto.Response;

import com.RouteSphere.REST.entity.Vehicle;
import com.RouteSphere.REST.enums.VehicleStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class MaintenanceResponse {

    private Long MaintenanceId;

    private String serviceType;
    private BigDecimal serviceCost;
    private LocalDate lastServiceDate;
    private LocalDate nextServiceDate;
    private String remarks;
    private VehicleStatus vehicleStatus;

    private Long vehicleId;
}
