package com.RouteSphere.REST.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
@Tag(name = "Home Controller", description = "Application home page")
public class HomeController {

    @GetMapping(produces = MediaType.TEXT_HTML_VALUE)
    @Operation(summary = "Display the application home page")
    public String home() {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <title>RouteSphere API</title>
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