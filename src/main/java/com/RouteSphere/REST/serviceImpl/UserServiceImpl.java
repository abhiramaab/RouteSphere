package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.LoginRequest;
import com.RouteSphere.REST.dto.Request.RegisterRequest;
import com.RouteSphere.REST.dto.Response.UserResponse;
import com.RouteSphere.REST.entity.User;
import com.RouteSphere.REST.repository.UserRepository;
import com.RouteSphere.REST.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public String deleteUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
        return "User has been deleted : " + user.getUsername();
    }

    @Override
    public UserResponse updateUser(Long userId, RegisterRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());

        User updatedUser = userRepository.save(user);
        UserResponse userResponse = new UserResponse();
        user.setPassword(updatedUser.getPassword());
        user.setEmail(updatedUser.getEmail());
        user.setUsername(updatedUser.getUsername());
        return userResponse;
    }
}
