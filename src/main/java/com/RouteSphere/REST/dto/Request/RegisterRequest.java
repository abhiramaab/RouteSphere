package com.RouteSphere.REST.dto.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 3, max = 20,
            message = "Username must be between 3 and 20 characters")
    private String username;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, max = 100,
            message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email")
    @Size(max = 100, message = "Email is too long")
    private String email;
}