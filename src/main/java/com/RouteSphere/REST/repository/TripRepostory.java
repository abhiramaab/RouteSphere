package com.RouteSphere.REST.repository;

import com.RouteSphere.REST.entity.Driver;
import com.RouteSphere.REST.entity.Trip;
import com.RouteSphere.REST.enums.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TripRepostory extends JpaRepository<Trip, Long> {


}
