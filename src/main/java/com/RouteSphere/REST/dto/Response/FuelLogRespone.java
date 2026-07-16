package com.RouteSphere.REST.dto.Response;

import com.RouteSphere.REST.entity.FuelLog;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class FuelLogRespone {

    private Long id;

    private BigDecimal fuelQuantity;
    private BigDecimal fuelCost;
    private String fuelStation;
    private String driverName;
    private Long driverId;
    private Long shipmentId;
    private Long customerId;
    private String customerName;
    private Long vehicleId;
    private String vehicleNumber;
}
