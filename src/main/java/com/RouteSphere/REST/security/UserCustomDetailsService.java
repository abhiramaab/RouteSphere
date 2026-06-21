package com.RouteSphere.REST.security;

import com.RouteSphere.REST.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserCustomDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.RouteSphere.REST.entity.User users = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new User(users.getEmail(), users.getPassword(), List.of(new SimpleGrantedAuthority("ROLE_" + users.getRole().name())));
    }

}
