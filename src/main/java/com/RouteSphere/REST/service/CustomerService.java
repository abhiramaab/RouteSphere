package com.RouteSphere.REST.service;

import com.RouteSphere.REST.dto.Request.CreateCustomerRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

public interface CustomerService {

    CustomerResponse createCustomer(CreateCustomerRequest request);
    CustomerResponse findById(Long customerId);
    String deleteCustomer(Long customerId);
    CustomerResponse updateCustomer(Long customerId, CreateCustomerRequest request);
    Page<CustomerResponse> findAll(Pageable pageable);

}
