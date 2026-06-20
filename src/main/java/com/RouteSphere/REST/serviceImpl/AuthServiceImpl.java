package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.LoginRequest;
import com.RouteSphere.REST.dto.Request.RegisterRequest;
import com.RouteSphere.REST.dto.Response.AuthResponse;
import com.RouteSphere.REST.entity.User;
import com.RouteSphere.REST.enums.Role;
import com.RouteSphere.REST.repository.UserRepository;
import com.RouteSphere.REST.security.JwtUtil;
import com.RouteSphere.REST.service.AuthService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public String Register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(Role.DISPATCHER);
        userRepository.save(user);
        return "Registered Successfully : " + user.getUsername();
    }

    @Override
    public AuthResponse Login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!matches) {
            throw new RuntimeException("Wrong password");
        }
        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token);
    }
}
