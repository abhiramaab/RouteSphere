package com.RouteSphere.REST.dto.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, message = "Password must be atleast 6 characters.")
    private String password;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email")
    private String email;
}
