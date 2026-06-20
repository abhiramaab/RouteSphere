package com.RouteSphere.REST.controller;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
@Data
public class HomeController {

    @GetMapping
    public String home() {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>Logistics API</title>
            <style>
                body{
                    font-family:Arial,sans-serif;
                    text-align:center;
                    margin-top:100px;
                    background:#f5f5f5;
                }
                a{
                    display:inline-block;
                    padding:12px 24px;
                    background:#28a745;
                    color:white;
                    text-decoration:none;
                    border-radius:6px;
                    font-size:18px;
                }
            </style>
        </head>
        <body>
            <h1>RouteSphere REST API</h1>
            <p>RouteSphere is a RESTful backend application developed using Spring Boot for logistics and fleet management operations.</p>

            <a href="/swagger-ui/index.html">
                View Swagger Documentation
            </a>
        </body>
        </html>
        """;
    }
}
