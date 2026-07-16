package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.LoginRequest;
import com.RouteSphere.REST.dto.Request.RegisterRequest;
import com.RouteSphere.REST.dto.Response.AuthResponse;
import com.RouteSphere.REST.entity.User;
import com.RouteSphere.REST.enums.Role;
import com.RouteSphere.REST.repository.UserRepository;
import com.RouteSphere.REST.security.JwtUtil;
import com.RouteSphere.REST.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public String register(RegisterRequest request) {

        log.info("Registering user with email: {}", request.getEmail());

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.DISPATCHER);

        userRepository.save(user);

        log.info("User registered successfully with username: {}", user.getUsername());

        return "Registered Successfully : " + user.getUsername();
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        log.info("Login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.error("User not found with email: {}", request.getEmail());
                    return new RuntimeException("User not found");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Invalid password for email: {}", request.getEmail());
            throw new RuntimeException("Wrong password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        log.info("User logged in successfully: {}", user.getEmail());

        return new AuthResponse(token);
    }
}