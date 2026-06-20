package com.RouteSphere.REST.repository;

import com.RouteSphere.REST.entity.Trip;
import com.RouteSphere.REST.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
