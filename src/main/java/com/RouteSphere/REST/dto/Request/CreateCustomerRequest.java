package com.RouteSphere.REST.dto.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCustomerRequest {

    @NotBlank(message = "Company name cannot be empty")
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
    @Size(max = 30, message = "Invalid City")
    private String city;

    @NotBlank(message = "State cannot be empty")
    @Size(max = 30, message = "Invalid State")
    private String state;

    @NotNull(message = "Pincode cannot be blank")
    @Size(min = 6, max = 6, message = "Invalid pincode")
    private Integer pincode;

    @NotBlank(message = "Country cannot be empty")
    @Size(max = 20, message = "Invalid country")
    private String country;

    @NotBlank(message = "GST cannot be empty")
    @Size(max = 15, min = 15, message = "Invalid GST")
    private String gst;
}
