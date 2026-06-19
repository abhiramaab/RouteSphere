package com.RouteSphere.REST.service;

import com.RouteSphere.REST.dto.Request.CreateCustomerRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.entity.Customer;

public interface CustomerService {

    CustomerResponse createCustomer(CreateCustomerRequest request);
    CustomerResponse findById(Long customerId);
    String deleteCustomer(Long customerId);
    CustomerResponse updateCustomer(Long customerId, CreateCustomerRequest request);

}
