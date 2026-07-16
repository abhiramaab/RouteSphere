package com.RouteSphere.REST.service;

import com.RouteSphere.REST.dto.Request.LoginRequest;
import com.RouteSphere.REST.dto.Request.RegisterRequest;
import com.RouteSphere.REST.dto.Response.AuthResponse;

public interface AuthService {

    String register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
