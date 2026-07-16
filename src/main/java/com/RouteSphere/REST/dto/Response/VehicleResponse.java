package com.RouteSphere.REST.dto.Response;

import com.RouteSphere.REST.entity.Maintenance;
import com.RouteSphere.REST.enums.FuelType;
import com.RouteSphere.REST.enums.VehicleStatus;
import com.RouteSphere.REST.enums.VehicleType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class VehicleResponse {

    private Long vehicleId;

    private String vehicleNumber;
    private Double vehicleCapacity;

    private VehicleType vehicleType;

    private FuelType fuelType;
    private VehicleStatus vehicleStatus;

    private LocalDate insuranceExpiry;
    private List<MaintenanceResponse> serviceMaintenanceIds;
}
