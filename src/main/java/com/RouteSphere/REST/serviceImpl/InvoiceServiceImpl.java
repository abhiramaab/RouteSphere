package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.dto.Request.CreateInvoiceRequest;
import com.RouteSphere.REST.dto.Response.InvoiceResponse;
import com.RouteSphere.REST.entity.Customer;
import com.RouteSphere.REST.entity.Invoice;
import com.RouteSphere.REST.repository.CustomerRepository;
import com.RouteSphere.REST.repository.InvoiceRespository;
import com.RouteSphere.REST.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRespository invoiceRespository;
    private final CustomerRepository customerRepository;

    @Override
    public InvoiceResponse createInvoice(CreateInvoiceRequest request) {

        log.info("Creating invoice with number: {}", request.getInvoiceNumber());

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> {
                    log.warn("Customer with id {} not found", request.getCustomerId());
                    return new RuntimeException("Customer not found");
                });

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(request.getInvoiceNumber());
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setGstAmount(request.getGstAmount());
        invoice.setPaymentStatus(request.getPaymentStatus());
        invoice.setCustomer(customer);

        Invoice savedInvoice = invoiceRespository.save(invoice);

        log.info("Invoice created successfully with id: {}", savedInvoice.getId());

        return mapToResponse(savedInvoice);
    }

    @Override
    public InvoiceResponse findByInvoiceId(Long invoiceId) {

        log.info("Retrieving invoice with id: {}", invoiceId);

        Invoice invoice = invoiceRespository.findById(invoiceId)
                .orElseThrow(() -> {
                    log.warn("Invoice with id {} not found", invoiceId);
                    return new RuntimeException("Invoice not found");
                });

        return mapToResponse(invoice);
    }

    @Override
    public InvoiceResponse findByInvoiceNumber(String invoiceNumber) {

        log.info("Retrieving invoice with number: {}", invoiceNumber);

        Invoice invoice = invoiceRespository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> {
                    log.warn("Invoice with number {} not found", invoiceNumber);
                    return new RuntimeException("Invoice not found");
                });

        return mapToResponse(invoice);
    }

    @Override
    public String deleteInvoice(Long invoiceId) {

        log.info("Deleting invoice with id: {}", invoiceId);

        Invoice invoice = invoiceRespository.findById(invoiceId)
                .orElseThrow(() -> {
                    log.warn("Invoice with id {} not found", invoiceId);
                    return new RuntimeException("Invoice not found");
                });

        invoiceRespository.delete(invoice);

        log.info("Invoice deleted successfully with id: {}", invoiceId);

        return "Invoice Deleted Successfully : " + invoice.getInvoiceNumber();
    }

    @Override
    public InvoiceResponse updateInvoice(Long invoiceId, CreateInvoiceRequest request) {

        log.info("Updating invoice with id: {}", invoiceId);

        Invoice invoice = invoiceRespository.findById(invoiceId)
                .orElseThrow(() -> {
                    log.warn("Invoice with id {} not found", invoiceId);
                    return new RuntimeException("Invoice not found");
                });

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> {
                    log.warn("Customer with id {} not found", request.getCustomerId());
                    return new RuntimeException("Customer not found");
                });

        invoice.setInvoiceNumber(request.getInvoiceNumber());
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setGstAmount(request.getGstAmount());
        invoice.setPaymentStatus(request.getPaymentStatus());
        invoice.setCustomer(customer);

        Invoice updatedInvoice = invoiceRespository.save(invoice);

        log.info("Invoice updated successfully with id: {}", updatedInvoice.getId());

        return mapToResponse(updatedInvoice);
    }

    @Override
    public Page<InvoiceResponse> findAll(Pageable pageable) {

        log.info("Retrieving all invoices. Page: {}, Size: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        return invoiceRespository.findAll(pageable)
                .map(this::mapToResponse);
    }

    private InvoiceResponse mapToResponse(Invoice invoice) {

        InvoiceResponse response = new InvoiceResponse();

        response.setInvoiceId(invoice.getId());
        response.setInvoiceNumber(invoice.getInvoiceNumber());
        response.setInvoiceDate(invoice.getInvoiceDate());
        response.setGstAmount(invoice.getGstAmount());
        response.setPaymentStatus(invoice.getPaymentStatus());
        response.setCustomerId(invoice.getCustomer().getId());
        response.setCustomerName(invoice.getCustomer().getCompanyName());

        return response;
    }
}