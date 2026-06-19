package com.RouteSphere.REST.dto.Request;

import com.RouteSphere.REST.enums.PaymentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateInvoiceRequest {

    @NotBlank(message = "Invoice number cannot be empty")
    private String invoiceNumber;

    @NotBlank(message = "Invoice date cannot be empty")
    private LocalDate invoiceDate;

    @NotBlank(message = "Customer name cannot be empty")
    private String customerName;

    @NotNull(message = "GST amount cannot be empty")
    private BigDecimal gstAmount;

    @NotBlank(message = "Payment status cannot be empty")
    private PaymentStatus paymentStatus;
}
