package com.RouteSphere.REST.repository;

import com.RouteSphere.REST.dto.Response.MaintenanceResponse;
import com.RouteSphere.REST.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {

    Optional<Maintenance> findByVehicleId(Long vehicleId);
}
