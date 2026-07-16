package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.RegisterRequest;
import com.RouteSphere.REST.dto.Response.UserResponse;
import com.RouteSphere.REST.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "User Controller", description = "Manage user operations")
public class UserController {

    private final UserService userService;

    @PutMapping("/{userId}")
    @Operation(summary = "Update a user by ID")
    public UserResponse updateUser(@PathVariable Long userId,
                                   @Valid @RequestBody RegisterRequest request) {
        return userService.updateUser(userId, request);
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Delete a user by ID")
    public String deleteUser(@PathVariable Long userId) {
        return userService.deleteUser(userId);
    }
}