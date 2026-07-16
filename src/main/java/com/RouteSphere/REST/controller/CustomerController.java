package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateCustomerRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@Tag(name = "Customer Controller", description = "Manage customer operations")
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    @Operation(summary = "Create a customer")
    public CustomerResponse createCustomer(@Valid @RequestBody CreateCustomerRequest request) {
        return customerService.createCustomer(request);
    }

    @GetMapping("/{customerId}")
    @Operation(summary = "Retrieve a customer by ID")
    public CustomerResponse getCustomerById(@PathVariable Long customerId) {
        return customerService.findById(customerId);
    }

    @PutMapping("/{customerId}")
    @Operation(summary = "Update a customer by ID")
    public CustomerResponse updateCustomer(@PathVariable Long customerId,
                                           @Valid @RequestBody CreateCustomerRequest request) {
        return customerService.updateCustomer(customerId, request);
    }

    @DeleteMapping("/{customerId}")
    @Operation(summary = "Delete a customer by ID")
    public String deleteCustomer(@PathVariable Long customerId) {
        return customerService.deleteCustomer(customerId);
    }

    @GetMapping
    @Operation(summary = "Retrieve all customers")
    public Page<CustomerResponse> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return customerService.findAll(pageable);
    }
}