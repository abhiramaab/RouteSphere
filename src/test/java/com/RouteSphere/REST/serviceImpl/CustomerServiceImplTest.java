package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateCustomerRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.entity.Customer;
import com.RouteSphere.REST.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CustomerServiceImplTest {

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerServiceImpl customerService;

    private Customer customer;
    private CreateCustomerRequest request;

    @BeforeEach
    public void setUp() {
        request = new CreateCustomerRequest();
        request.setCity("Bengaluru");
        request.setAddress("Sy no 28, Anekal");
        request.setGst("29AAHDNMA2819CZ!");
        request.setCompanyName("Flikart Seller services Pvt Ltd");
        request.setEmail("fssl@flikart.in");
        request.setContactPerson("Manav Sharma");
        request.setState("Karnataka");
        request.setPincode("566789");

        customer = new Customer();
        customer.setCity(request.getCity());
        customer.setAddress(request.getAddress());
        customer.setGst(request.getGst());
        customer.setCompanyName(request.getCompanyName());
        customer.setEmail(request.getEmail());
        customer.setContactPerson(request.getContactPerson());
        customer.setState(request.getState());
        customer.setPincode(request.getPincode());
        customer.setId(1L);
    }

    @Nested
    @DisplayName("Create customer")
    class CreateCustomerTests {

        @Test
        void shouldCreateCustomerSuccessfully() {
            when(customerRepository.save(any(Customer.class))).thenReturn(customer);
            CustomerResponse response = customerService.createCustomer(request);
            assertEquals(1L, response.getCustomerId());
            assertEquals(request.getContactPerson(), response.getContactPerson());
            assertEquals(request.getCity(), response.getCity());
            assertEquals(request.getGst(), response.getGst());
            assertEquals(request.getEmail(), response.getEmail());
            assertEquals(request.getPincode(), response.getPincode());
            assertEquals(request.getCountry(), response.getCountry());
            assertEquals(request.getCompanyName(), response.getCompanyName());
            assertEquals(request.getAddress() , response.getAddress());

            verify(customerRepository).save(any(Customer.class));

        }
    }
}
