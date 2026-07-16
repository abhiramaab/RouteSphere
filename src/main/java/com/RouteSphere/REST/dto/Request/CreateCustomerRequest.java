package com.RouteSphere.REST.dto.Request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCustomerRequest {

    @NotBlank(message = "Company name cannot be empty")
    @Size(max = 50, message = "Company name too long")
    private String companyName;

    @NotBlank(message = "Contact person cannot be empty")
    private String contactPerson;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email")
    private String email;

    @NotBlank(message = "Address cannot be empty")
    @Size(max = 60, message = "Address cannot exceed 60 characters")
    private String address;

    @NotBlank(message = "City cannot be empty")
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "City can contain only letters"
    )
    private String city;

    @NotBlank(message = "State cannot be empty")
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "State can contain only letters"
    )
    private String state;

    @NotBlank(message = "Pincode cannot be empty")
    @Pattern(regexp = "^[0-9]{6}$", message = "Invalid pincode")
    private String pincode;

    @NotBlank(message = "Country cannot be empty")
    @Pattern(
            regexp = "^[A-Za-z ]+$",
            message = "Country can contain only letters"
    )
    private String country;

    @NotBlank(message = "GST cannot be empty")
    @Pattern(
            regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$",
            message = "Invalid GST Number"
    )
    private String gst;
}
