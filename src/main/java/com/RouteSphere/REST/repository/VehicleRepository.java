package com.RouteSphere.REST.repository;

import com.RouteSphere.REST.entity.Vehicle;
import com.RouteSphere.REST.enums.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Optional<Vehicle> findFirstByVehicleStatus(VehicleStatus vehicleStatus);
}
