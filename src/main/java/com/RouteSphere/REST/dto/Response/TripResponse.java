package com.RouteSphere.REST.dto.Response;

import com.RouteSphere.REST.entity.Driver;
import com.RouteSphere.REST.entity.FuelLog;
import com.RouteSphere.REST.entity.Vehicle;
import com.RouteSphere.REST.enums.DriverStatus;
import com.RouteSphere.REST.enums.TripStatus;
import com.RouteSphere.REST.enums.VehicleStatus;
import com.RouteSphere.REST.enums.VehicleType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TripResponse {

    private Long id;

    private String tripNumber;
    private String startLocation;
    private String endLocation;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double distance;
    private TripStatus tripStatus;


    private Long driverId;
    private String driverName;
    private DriverStatus driverStatus;
    private VehicleType vehicleType;

    private Long vehicleId;
    private String vehicleNumber;

    private Long fuelLogId;
}
