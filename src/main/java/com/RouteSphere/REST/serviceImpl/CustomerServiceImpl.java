package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateCustomerRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.entity.Customer;
import com.RouteSphere.REST.repository.CustomerRepository;
import com.RouteSphere.REST.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    public CustomerResponse createCustomer(CreateCustomerRequest request) {

        log.info("Creating customer with email: {}", request.getEmail());

        customerRepository.findByEmail(request.getEmail()).ifPresent(customer -> {
            log.warn("Customer with email {} already exists", request.getEmail());
            throw new RuntimeException("Customer already exists");
        });

        Customer customer = new Customer();

        customer.setCompanyName(request.getCompanyName());
        customer.setContactPerson(request.getContactPerson());
        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());
        customer.setCity(request.getCity());
        customer.setState(request.getState());
        customer.setPincode(request.getPincode());
        customer.setCountry(request.getCountry());
        customer.setGst(request.getGst());

        Customer savedCustomer = customerRepository.save(customer);

        log.info("Customer created successfully with id: {}", savedCustomer.getId());

        return mapToResponse(savedCustomer);
    }

    @Override
    public CustomerResponse findById(Long customerId) {

        log.info("Retrieving customer with id: {}", customerId);

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> {
                    log.warn("Customer with id {} not found", customerId);
                    return new RuntimeException("Customer not found");
                });

        return mapToResponse(customer);
    }

    @Override
    public String deleteCustomer(Long customerId) {

        log.info("Deleting customer with id: {}", customerId);

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> {
                    log.warn("Customer with id {} not found", customerId);
                    return new RuntimeException("Customer not found");
                });

        customerRepository.delete(customer);

        log.info("Customer deleted successfully with id: {}", customerId);

        return "Customer with id: " + customerId + " has been deleted";
    }

    @Override
    public CustomerResponse updateCustomer(Long customerId, CreateCustomerRequest request) {

        log.info("Updating customer with id: {}", customerId);

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> {
                    log.warn("Customer with id {} not found", customerId);
                    return new RuntimeException("Customer not found");
                });

        customer.setCompanyName(request.getCompanyName());
        customer.setContactPerson(request.getContactPerson());
        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());
        customer.setCity(request.getCity());
        customer.setState(request.getState());
        customer.setPincode(request.getPincode());
        customer.setCountry(request.getCountry());
        customer.setGst(request.getGst());

        Customer updatedCustomer = customerRepository.save(customer);

        log.info("Customer updated successfully with id: {}", updatedCustomer.getId());

        return mapToResponse(updatedCustomer);
    }

    @Override
    public Page<CustomerResponse> findAll(Pageable pageable) {

        log.info("Retrieving all customers. Page: {}, Size: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        return customerRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    private CustomerResponse mapToResponse(Customer customer) {

        CustomerResponse response = new CustomerResponse();

        response.setCustomerId(customer.getId());
        response.setCompanyName(customer.getCompanyName());
        response.setContactPerson(customer.getContactPerson());
        response.setEmail(customer.getEmail());
        response.setAddress(customer.getAddress());
        response.setCity(customer.getCity());
        response.setState(customer.getState());
        response.setPincode(customer.getPincode());
        response.setCountry(customer.getCountry());
        response.setGst(customer.getGst());

        return response;
    }
}