package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.RegisterRequest;
import com.RouteSphere.REST.dto.Response.UserResponse;
import com.RouteSphere.REST.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@Data
@Tag(name = "User Controller")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/{userId}")
    public UserResponse updateUser(@PathVariable("userId") Long userId,@Valid @RequestBody RegisterRequest request){
        return userService.updateUser(userId, request);
    }

    @DeleteMapping("/{userId}")
    public String deleteUser(@PathVariable("userId") Long userId){
        return userService.deleteUser(userId);
    }
}
