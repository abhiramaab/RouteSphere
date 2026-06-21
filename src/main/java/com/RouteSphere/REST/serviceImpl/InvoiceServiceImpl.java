package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateInvoiceRequest;
import com.RouteSphere.REST.dto.Response.InvoiceResponse;
import com.RouteSphere.REST.entity.Invoice;
import com.RouteSphere.REST.repository.InvoiceRespository;
import com.RouteSphere.REST.service.InvoiceService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRespository invoiceRespository;

    @Override
    public InvoiceResponse createInvoice(CreateInvoiceRequest request) {
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(request.getInvoiceNumber());
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setCustomerName(request.getCustomerName());
        invoice.setGstAmount(request.getGstAmount());
        invoice.setPaymentStatus(request.getPaymentStatus());
        invoice.setGstAmount(request.getGstAmount());

        Invoice savedInvoice = invoiceRespository.save(invoice);

        InvoiceResponse invoiceResponse = new InvoiceResponse();
        invoiceResponse.setInvoiceNumber(savedInvoice.getInvoiceNumber());
        invoiceResponse.setInvoiceDate(savedInvoice.getInvoiceDate());
        invoiceResponse.setCustomerName(savedInvoice.getCustomerName());
        invoiceResponse.setGstAmount(savedInvoice.getGstAmount());
        invoiceResponse.setPaymentStatus(savedInvoice.getPaymentStatus());
        invoiceResponse.setInvoiceId(savedInvoice.getId());
        return invoiceResponse;
    }

    @Override
    public InvoiceResponse findByInvoiceId(Long invoiceId) {
        Invoice invoice = invoiceRespository.findById(invoiceId).orElseThrow(() -> new RuntimeException("invoice id not found"));
        InvoiceResponse invoiceResponse = new InvoiceResponse();
        invoiceResponse.setInvoiceNumber(invoice.getInvoiceNumber());
        invoiceResponse.setInvoiceDate(invoice.getInvoiceDate());
        invoiceResponse.setCustomerName(invoice.getCustomerName());
        invoiceResponse.setGstAmount(invoice.getGstAmount());
        invoiceResponse.setPaymentStatus(invoice.getPaymentStatus());
        invoiceResponse.setInvoiceId(invoice.getId());
        return invoiceResponse;
    }

    @Override
    public InvoiceResponse findByInvoiceNumber(String invoiceNumber) {
        Invoice invoice = invoiceRespository.findByInvoiceNumber(invoiceNumber).orElseThrow(() -> new RuntimeException("invoice number not found"));
        InvoiceResponse invoiceResponse = new InvoiceResponse();
        invoiceResponse.setInvoiceNumber(invoice.getInvoiceNumber());
        invoiceResponse.setInvoiceDate(invoice.getInvoiceDate());
        invoiceResponse.setCustomerName(invoice.getCustomerName());
        invoiceResponse.setGstAmount(invoice.getGstAmount());
        invoiceResponse.setPaymentStatus(invoice.getPaymentStatus());
        invoiceResponse.setInvoiceId(invoice.getId());
        return invoiceResponse;
    }

    @Override
    public String deleteInvoice(Long invoiceId) {
        Invoice invoice = invoiceRespository.findById(invoiceId).orElseThrow(() -> new RuntimeException("invoice id not found"));
        invoiceRespository.delete(invoice);
        return "Invoice Deleted Successfully : " + invoice.getInvoiceNumber();
    }

    @Override
    public InvoiceResponse updateInvoice(Long invoiceId, CreateInvoiceRequest request) {
        Invoice invoice = invoiceRespository.findById(invoiceId).orElseThrow(() -> new RuntimeException("invoice id not found"));
        invoice.setGstAmount(request.getGstAmount());
        invoice.setPaymentStatus(request.getPaymentStatus());
        invoice.setInvoiceNumber(invoice.getInvoiceNumber());
        invoice.setShipment(invoice.getShipment());
        invoice.setCustomerName(request.getCustomerName());

        Invoice updatedInvoice = invoiceRespository.save(invoice);
        InvoiceResponse invoiceResponse = new InvoiceResponse();
        invoiceResponse.setInvoiceNumber(updatedInvoice.getInvoiceNumber());
        invoiceResponse.setInvoiceDate(updatedInvoice.getInvoiceDate());
        invoiceResponse.setCustomerName(updatedInvoice.getCustomerName());
        invoiceResponse.setGstAmount(updatedInvoice.getGstAmount());
        invoiceResponse.setPaymentStatus(updatedInvoice.getPaymentStatus());
        invoiceResponse.setInvoiceId(updatedInvoice.getId());
        return invoiceResponse;
    }

    @Override
    public Page<InvoiceResponse> findAll(Pageable pageable) {
        return invoiceRespository.findAll(pageable).map(this::mapToResponse);
    }

    private InvoiceResponse mapToResponse(Invoice invoice) {
        InvoiceResponse invoiceResponse = new InvoiceResponse();
        invoiceResponse.setInvoiceNumber(invoice.getInvoiceNumber());
        invoiceResponse.setInvoiceDate(invoice.getInvoiceDate());
        invoiceResponse.setCustomerName(invoice.getCustomerName());
        invoiceResponse.setGstAmount(invoice.getGstAmount());
        invoiceResponse.setPaymentStatus(invoice.getPaymentStatus());
        invoiceResponse.setInvoiceId(invoice.getId());
        return invoiceResponse;
    }
}
