package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.RegisterRequest;
import com.RouteSphere.REST.dto.Response.UserResponse;
import com.RouteSphere.REST.entity.User;
import com.RouteSphere.REST.repository.UserRepository;
import com.RouteSphere.REST.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public String deleteUser(Long userId) {

        log.info("Deleting user with id: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User with id {} not found", userId);
                    return new RuntimeException("User not found");
                });

        userRepository.delete(user);

        log.info("User deleted successfully with id: {}", userId);

        return "User has been deleted : " + user.getUsername();
    }

    @Override
    public UserResponse updateUser(Long userId, RegisterRequest request) {

        log.info("Updating user with id: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User with id {} not found", userId);
                    return new RuntimeException("User not found");
                });

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        User updatedUser = userRepository.save(user);

        log.info("User updated successfully with id: {}", updatedUser.getId());

        UserResponse response = new UserResponse();
        response.setUsername(updatedUser.getUsername());
        response.setEmail(updatedUser.getEmail());

        return response;
    }
}