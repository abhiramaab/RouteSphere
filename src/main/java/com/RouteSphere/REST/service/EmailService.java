package com.RouteSphere.REST.service;


public interface EmailService {

    void sendShipmentCreatedEmail(String to, String trackingNumber);
    void sendShipmentDeliveredEmail(String to, String trackingNumber);
    void sendPaymentsSuccessfulEmail(String to, String invoiceNumber);
}
