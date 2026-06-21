package com.RouteSphere.REST.controller;

import com.RouteSphere.REST.dto.Request.CreateDriverRequest;
import com.RouteSphere.REST.dto.Request.UpdateDriverRequest;
import com.RouteSphere.REST.dto.Response.CustomerResponse;
import com.RouteSphere.REST.dto.Response.DriverIdsResponse;
import com.RouteSphere.REST.dto.Response.DriverResponse;
import com.RouteSphere.REST.service.DriverService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/driver")
@Data
@Tag(name = "Driver Controller")
@AllArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @PostMapping
    public DriverResponse createDriver(@Valid @RequestBody CreateDriverRequest request){
        return driverService.createDriver(request);
    }

    @GetMapping("/{id}")
    public DriverResponse findDriverById(@PathVariable Long id){
        return driverService.findDriverById(id);
    }

    @GetMapping
    public List<DriverIdsResponse> findAllDrivers(){
        return driverService.findAllDrivers();
    }

    @DeleteMapping("/{driverId}")
    public String deleteDriver(@PathVariable Long driverId){
        return driverService.deleteDriver(driverId);
    }

    @PutMapping("/{driverId}")
    public DriverResponse updateDriver(@PathVariable Long driverId, @Valid @RequestBody UpdateDriverRequest request){
        return driverService.updateDriver(driverId, request);
    }

    @GetMapping
    public Page<DriverResponse> findAll(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "asc") String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return driverService.findAll(pageable);

    }
}
