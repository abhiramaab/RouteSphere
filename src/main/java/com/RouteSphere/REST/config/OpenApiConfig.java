package com.RouteSphere.REST.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI RouteSphereAPI(){
        return new OpenAPI()
                .info(new Info().title("RouteSphereAPI")
                        .description("RouteSphere is a RESTful backend application developed using Spring Boot for logistics and fleet management operations.")
                        .version("1.6"));

    }
}
