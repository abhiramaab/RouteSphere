package com.RouteSphere.REST.config;

import com.RouteSphere.REST.repository.UserRepository;
import com.RouteSphere.REST.security.JwtFilter;
import com.RouteSphere.REST.security.JwtUtil;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserRepository userRepository;
    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/swagger/**", "/v3/api-docs/**", "/").permitAll()
                        .requestMatchers("/api/user/**").hasRole("ADMIN")
                        .requestMatchers("/api/customer/**").hasRole("DISPATCHER")
                        .requestMatchers("/api/driver/**").hasRole("DISPATCHER")
                        .requestMatchers("/api/invoice/**").hasRole("DISPATCHER")
                        .requestMatchers("/api/vehicle/**").hasRole("DISPATCHER")
                        .requestMatchers("/api/trip/**").hasRole("DISPATCHER")
                        .requestMatchers("/api/fuelLog/**").hasRole("DRIVER")
                        .requestMatchers("/api/maintenance/**").hasRole("DRIVER")
                        .requestMatchers("/api/shipment/**").hasRole("DISPATCHER")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
