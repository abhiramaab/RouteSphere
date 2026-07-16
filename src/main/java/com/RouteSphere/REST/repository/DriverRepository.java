package com.RouteSphere.REST.repository;

import com.RouteSphere.REST.entity.Driver;
import com.RouteSphere.REST.enums.DriverStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Long> {

    Optional<Driver> findFirstByDriverStatus(DriverStatus driverStatus);
}
