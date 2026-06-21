package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateFuelLogRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.dto.Response.FuelLogRespone;
import com.RouteSphere.REST.service.FuelLogService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fuellog")
@Data
@Tag(name = "Fuel Log Controller")
@AllArgsConstructor
public class FuelLogController {

    private final FuelLogService fuelLogService;

    @PostMapping
    public FuelLogRespone createFuelLog(@Valid @RequestBody CreateFuelLogRequest request){
        return fuelLogService.createFuelLog(request);
    }

    @GetMapping("/{id}")
    public FuelLogRespone getFuelLog(@PathVariable Long id){
        return fuelLogService.getFuelLog(id);
    }

    @DeleteMapping("/{fuelLogId}")
    public String deleteFuelLog(@PathVariable Long fuelLogId){
        return fuelLogService.deleteFuelLog(fuelLogId);
    }

    @PutMapping("/{fuelLogId}")
    public FuelLogRespone updateFuelLog(@PathVariable Long fuelLogId, @Valid @RequestBody CreateFuelLogRequest request){
        return fuelLogService.updateFuelLog(fuelLogId, request);
    }

    @GetMapping
    public Page<FuelLogRespone> findAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "asc") String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return fuelLogService.findAll(pageable);

    }
}
