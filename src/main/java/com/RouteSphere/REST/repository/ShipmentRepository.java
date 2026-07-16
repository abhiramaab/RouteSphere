package com.RouteSphere.REST.repository;

import com.RouteSphere.REST.entity.Shipment;
import com.RouteSphere.REST.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {

    Optional<Shipment> findByTrip(Trip trip);
}
