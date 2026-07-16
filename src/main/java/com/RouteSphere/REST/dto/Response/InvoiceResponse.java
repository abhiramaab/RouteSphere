package com.RouteSphere.REST.dto.Response;

import com.RouteSphere.REST.enums.PaymentStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class InvoiceResponse {

    private Long invoiceId;

    private String invoiceNumber;
    private LocalDate invoiceDate;
    private String customerName;
    private BigDecimal gstAmount;
    private PaymentStatus paymentStatus;

    private Long customerId;
}
