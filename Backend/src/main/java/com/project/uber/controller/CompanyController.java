package com.project.uber.controller;

import com.project.uber.dtos.OrderSummaryDto;
import com.project.uber.model.Client;
import com.project.uber.model.Company;
import com.project.uber.model.Driver;
import com.project.uber.model.Vehicle;
import com.project.uber.repository.DriverRepository;
import com.project.uber.repository.VehicleRepository;
import com.project.uber.service.implementation.CompanyServiceImpl;
import com.project.uber.service.interfac.DriverService;
import com.project.uber.service.interfac.OrderService;
import com.project.uber.service.interfac.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/company")
public class CompanyController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CompanyServiceImpl companyService;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private DriverService driverService;

    @PostMapping("/{companyId}/add-driver")
    public ResponseEntity<Driver> addDriverToCompany(@PathVariable Long companyId, @RequestBody Driver driverRequest) {
        Optional<Driver> savedDriver = driverService.addDriverToCompany(companyId, driverRequest);
        return savedDriver.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{companyId}/vehicles")
    public ResponseEntity<List<Vehicle>> getVehiclesByCompany(@PathVariable Long companyId) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByCompany(companyId);
        return ResponseEntity.ok(vehicles);
    }

    @PostMapping("/{companyId}/add-vehicle")
    public ResponseEntity<Vehicle> addVehicleToCompany(@PathVariable Long companyId, @RequestBody Vehicle vehicle) {

        Optional<Vehicle> savedVehicle = vehicleService.addVehicleToCompany(companyId, vehicle);
        return savedVehicle.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{companyId}/drivers")
    public ResponseEntity<List<Driver>> getDriversByCompany(@PathVariable Long companyId) {
        List<Driver> drivers = driverRepository.findByCompanyId(companyId);
        return ResponseEntity.ok(drivers);
    }

    @GetMapping("/{companyId}/orders-last-14-days")
    public List<OrderSummaryDto> getOrdersLast14Days(@PathVariable Long companyId) {
        return orderService.getOrdersLast14Days(companyId);
    }


    @GetMapping("/{companyId}/order-stats")
    public ResponseEntity<Map<String, Long>> getOrderStatistics(@PathVariable Long companyId) {
        Map<String, Long> stats = orderService.getOrderStatistics(companyId);
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/register")
    public ResponseEntity<Company> registerCompany(@RequestBody Company company) {
        Company savedCompany = companyService.registerCompany(company);
        return ResponseEntity.ok(savedCompany);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        Optional<Company> company = companyService.getCompanyById(id);
        return company.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }


    @PostMapping("/{companyId}/add-client")
    public ResponseEntity<Company> addClientToCompany(@PathVariable Long companyId, @RequestBody Client client) {
        Optional<Company> updatedCompany = companyService.addClientToCompany(companyId, client);

        return updatedCompany
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{companyId}/clients")
    public ResponseEntity<List<Client>> getClientsByCompany(@PathVariable Long companyId) {
        List<Client> clients = companyService.getClientsByCompany(companyId);
        return ResponseEntity.ok(clients);
    }


}

