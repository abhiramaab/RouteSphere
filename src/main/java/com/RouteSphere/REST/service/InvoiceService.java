package com.RouteSphere.REST.service;

import com.RouteSphere.REST.dto.Request.CreateInvoiceRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.dto.Response.InvoiceResponse;
import com.RouteSphere.REST.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface InvoiceService {

    InvoiceResponse createInvoice(CreateInvoiceRequest request);
    InvoiceResponse findByInvoiceId(Long invoiceId);
    InvoiceResponse findByInvoiceNumber(String invoiceNumber);
    String deleteInvoice(Long invoiceId);
    InvoiceResponse updateInvoice(Long invoiceId, CreateInvoiceRequest request);
    Page<InvoiceResponse> findAll(Pageable pageable);
}
