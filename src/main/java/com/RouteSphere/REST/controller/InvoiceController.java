package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateInvoiceRequest;
import com.RouteSphere.REST.dto.Response.InvoiceResponse;
import com.RouteSphere.REST.service.InvoiceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoice")
@Data
@Tag(name = "Invoice Controller")
@AllArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    public InvoiceResponse createInvoice(@Valid @RequestBody CreateInvoiceRequest request){
        return invoiceService.createInvoice(request);
    }

    @GetMapping("/id/{invoiceId}")
    public InvoiceResponse findByInvoiceId(@Valid @PathVariable("invoiceId") Long invoiceId){
        return invoiceService.findByInvoiceId(invoiceId);
    }

    @GetMapping("/number/{invoiceNumber}")
    public InvoiceResponse findByInvoiceNumber(@PathVariable("invoiceNumber") String invoiceNumber){
        return invoiceService.findByInvoiceNumber(invoiceNumber);
    }

    @DeleteMapping("/{invoiceId}")
    public String deleteInvoice(@PathVariable("invoiceId") Long invoiceId){
        return invoiceService.deleteInvoice(invoiceId);
    }

    @PutMapping("/{invoiceId}")
    public InvoiceResponse updateInvoice(@PathVariable("invoiceId") Long invoiceId, @RequestBody CreateInvoiceRequest request){
        return invoiceService.updateInvoice(invoiceId, request);
    }


}
