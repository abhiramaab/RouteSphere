package com.RouteSphere.REST.dto.Request;

import com.RouteSphere.REST.enums.PaymentStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    @Size(max = 20, message = "Invoice number too long")
    private String invoiceNumber;

    @NotNull(message = "Invoice date cannot be empty")
    private LocalDate invoiceDate;

    @NotBlank(message = "Customer name cannot be empty")
    @Size(max = 50, message = "Customer name too long")
    private String customerName;

    @NotNull(message = "GST amount cannot be empty")
    @DecimalMin(value = "0.00",
            message = "GST amount cannot be negative")
    private BigDecimal gstAmount;

    @NotNull(message = "Payment status cannot be empty")
    private PaymentStatus paymentStatus;
}
