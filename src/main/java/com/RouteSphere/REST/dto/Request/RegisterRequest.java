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

    @NotBlank(message = "Username cannot be blank")
    @Size(max = 20, message = "Username cannot exceed 20 characters")
    private String username;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, message = "Password must be atleast 6 characters.")
    private String password;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email")
    private String email;
}
