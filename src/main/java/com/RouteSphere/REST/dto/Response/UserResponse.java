package com.RouteSphere.REST.dto.Response;

import com.RouteSphere.REST.enums.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.util.List;


@Data
public class UserResponse {

    private Long Userid;

    private String username;
    private String password;
    private String email;
    private Role role;

}
