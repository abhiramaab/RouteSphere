package com.RouteSphere.REST.service;

import com.RouteSphere.REST.dto.Request.LoginRequest;
import com.RouteSphere.REST.dto.Request.RegisterRequest;
import com.RouteSphere.REST.dto.Response.UserResponse;
import com.RouteSphere.REST.entity.User;

public interface UserService {

    String deleteUser(Long userId);
    UserResponse updateUser(Long userId, RegisterRequest request);

}
