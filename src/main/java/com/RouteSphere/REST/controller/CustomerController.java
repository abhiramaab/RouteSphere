package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateCustomerRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.entity.Customer;
import com.RouteSphere.REST.service.CustomerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@Tag(name = "Customer Controller")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public CustomerResponse createCustomer(@Valid @RequestBody CreateCustomerRequest request) {
        return customerService.createCustomer(request);
    }

    @GetMapping("/{customerId}")
    public CustomerResponse getCustomerById(@PathVariable("customerId") Long customerId) {
        return customerService.findById(customerId);
    }

    @DeleteMapping("/{id}")
    public String deleteCustomer(@PathVariable("id") Long id) {
        return customerService.deleteCustomer(id);
    }

    @PutMapping("/{customerId}")
    public CustomerResponse updateCustomer(@PathVariable("customerId") Long customerId, @RequestBody CreateCustomerRequest request){
        return customerService.updateCustomer(customerId, request);
    }

    @GetMapping
    public Page<CustomerResponse> findAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "asc") String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return customerService.findAll(pageable);

    }

}
