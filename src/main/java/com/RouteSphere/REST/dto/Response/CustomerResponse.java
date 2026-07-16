package com.RouteSphere.REST.dto.Response;

import lombok.Data;

import java.util.List;

@Data
public class CustomerResponse {

    private Long customerId;

    private String companyName;
    private String contactPerson;
    private String email;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String country;
    private String gst;


    private List<Long> shipmentIds;
}
