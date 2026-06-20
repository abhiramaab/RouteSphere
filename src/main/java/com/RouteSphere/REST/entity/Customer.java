package com.RouteSphere.REST.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String contactPerson;
    private String email;
    private String address;
    private String city;
    private String state;
    private Integer pincode;
    private String country;
    private String gst;

    @OneToMany(mappedBy = "customer")
    @JsonManagedReference
    private List<Shipment> shipments;

    @OneToMany(mappedBy = "customer")
    @JsonManagedReference
    private List<Trip> trip;

}
