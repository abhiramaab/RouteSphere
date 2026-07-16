package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateInvoiceRequest;
import com.RouteSphere.REST.dto.Response.InvoiceResponse;
import com.RouteSphere.REST.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoice")
@RequiredArgsConstructor
@Tag(name = "Invoice Controller", description = "Manage invoice operations")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    @Operation(summary = "Create an invoice")
    public InvoiceResponse createInvoice(@Valid @RequestBody CreateInvoiceRequest request) {
        return invoiceService.createInvoice(request);
    }

    @GetMapping("/id/{invoiceId}")
    @Operation(summary = "Retrieve an invoice by ID")
    public InvoiceResponse findByInvoiceId(@PathVariable Long invoiceId) {
        return invoiceService.findByInvoiceId(invoiceId);
    }

    @GetMapping("/number/{invoiceNumber}")
    @Operation(summary = "Retrieve an invoice by invoice number")
    public InvoiceResponse findByInvoiceNumber(@PathVariable String invoiceNumber) {
        return invoiceService.findByInvoiceNumber(invoiceNumber);
    }

    @PutMapping("/{invoiceId}")
    @Operation(summary = "Update an invoice by ID")
    public InvoiceResponse updateInvoice(@PathVariable Long invoiceId,
                                         @Valid @RequestBody CreateInvoiceRequest request) {
        return invoiceService.updateInvoice(invoiceId, request);
    }

    @DeleteMapping("/{invoiceId}")
    @Operation(summary = "Delete an invoice by ID")
    public String deleteInvoice(@PathVariable Long invoiceId) {
        return invoiceService.deleteInvoice(invoiceId);
    }

    @GetMapping
    @Operation(summary = "Retrieve all invoices")
    public Page<InvoiceResponse> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return invoiceService.findAll(pageable);
    }
}