package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateCustomerRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.entity.Customer;
import com.RouteSphere.REST.repository.CustomerRepository;
import com.RouteSphere.REST.service.CustomerService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    public CustomerResponse createCustomer(CreateCustomerRequest request) {
        customerRepository.findByEmail(request.getEmail()).ifPresent(Customer -> {
            throw new RuntimeException("Customer already exists");
        });

        Customer customer = new Customer();

        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());
        customer.setCity(request.getCity());
        customer.setCountry(request.getCountry());
        customer.setPincode(request.getPincode());
        customer.setGst(request.getGst());
        customer.setContactPerson(request.getContactPerson());
        customer.setCompanyName(request.getCompanyName());
        customer.setGst(request.getGst());
        customer.setState(request.getState());

        Customer savedCustomer = customerRepository.save(customer);

        CustomerResponse customerResponse = new CustomerResponse();

        customerResponse.setCustomerId(savedCustomer.getId());
        customerResponse.setCity(savedCustomer.getCity());
        customerResponse.setCountry(savedCustomer.getCountry());
        customerResponse.setPincode(savedCustomer.getPincode());
        customerResponse.setGst(savedCustomer.getGst());
        customerResponse.setEmail(savedCustomer.getEmail());
        customerResponse.setAddress(savedCustomer.getAddress());
        customerResponse.setState(savedCustomer.getState());
        customerResponse.setContactPerson(savedCustomer.getContactPerson());
        customerResponse.setCompanyName(savedCustomer.getCompanyName());

        return customerResponse;
    }

    @Override
    public CustomerResponse findById(Long customerId) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> new RuntimeException("Customer not found"));

        CustomerResponse customerResponse = new CustomerResponse();
        customerResponse.setCustomerId(customer.getId());
        customerResponse.setCity(customer.getCity());
        customerResponse.setCountry(customer.getCountry());
        customerResponse.setPincode(customer.getPincode());
        customerResponse.setGst(customer.getGst());
        customerResponse.setEmail(customer.getEmail());
        customerResponse.setAddress(customer.getAddress());
        customerResponse.setState(customer.getState());
        customerResponse.setContactPerson(customer.getContactPerson());
        customerResponse.setCompanyName(customer.getCompanyName());
        return customerResponse;
    }

    @Override
    public String deleteCustomer(Long customerId) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> new RuntimeException("Customer not found"));
        customerRepository.delete(customer);
        return "Customer with id: " + customerId + " has been deleted";
    }

    @Override
    public CustomerResponse updateCustomer(Long customerId, CreateCustomerRequest request) {
        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> new RuntimeException("Customer not found"));
        Customer updateCustomer = new Customer();
        updateCustomer.setEmail(request.getEmail());
        updateCustomer.setAddress(request.getAddress());
        updateCustomer.setCity(request.getCity());
        updateCustomer.setCountry(request.getCountry());
        updateCustomer.setPincode(request.getPincode());
        updateCustomer.setGst(request.getGst());
        updateCustomer.setContactPerson(request.getContactPerson());
        updateCustomer.setCompanyName(request.getCompanyName());

        customerRepository.save(updateCustomer);

        CustomerResponse customerResponse = new CustomerResponse();
        customerResponse.setCustomerId(customer.getId());
        customerResponse.setCity(customer.getCity());
        customerResponse.setCountry(customer.getCountry());
        customerResponse.setPincode(customer.getPincode());
        customerResponse.setGst(customer.getGst());
        customerResponse.setEmail(customer.getEmail());
        customerResponse.setAddress(customer.getAddress());
        customerResponse.setState(customer.getState());
        customerResponse.setContactPerson(customer.getContactPerson());
        customerResponse.setCompanyName(customer.getCompanyName());
        return customerResponse;

    }

    @Override
    public Page<CustomerResponse> findAll(Pageable pageable) {
        return customerRepository.findAll(pageable).map(this::mapToResponse);
    }

    private CustomerResponse mapToResponse(Customer customer) {
        CustomerResponse customerResponse = new CustomerResponse();
        customerResponse.setCustomerId(customer.getId());
        customerResponse.setCity(customer.getCity());
        customerResponse.setCountry(customer.getCountry());
        customerResponse.setPincode(customer.getPincode());
        customerResponse.setGst(customer.getGst());
        customerResponse.setEmail(customer.getEmail());
        customerResponse.setAddress(customer.getAddress());
        customerResponse.setState(customer.getState());
        customerResponse.setContactPerson(customer.getContactPerson());
        customerResponse.setCompanyName(customer.getCompanyName());
        return customerResponse;
           }
}
