package com.project.uber.controller;

import com.project.uber.dtos.OrderSummaryDto;
import com.project.uber.model.Client;
import com.project.uber.model.Company;
import com.project.uber.model.Driver;
import com.project.uber.model.Vehicle;
import com.project.uber.repository.CompanyRepository;
import com.project.uber.repository.DriverRepository;
import com.project.uber.repository.VehicleRepository;
import com.project.uber.service.implementation.CompanyServiceImpl;
import com.project.uber.service.interfac.DriverService;
import com.project.uber.service.interfac.OrderService;
import com.project.uber.service.interfac.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
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
    private CompanyRepository companyRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private DriverService driverService;

    @Transactional()
    @GetMapping("/{companyId}/logo")
    public ResponseEntity<byte[]> getCompanyLogo(@PathVariable Long companyId) {
        Optional<Company> optionalCompany = companyRepository.findById(companyId);
        if (optionalCompany.isPresent() && optionalCompany.get().getLogo() != null) {
            byte[] logo = optionalCompany.get().getLogo();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG); // ou IMAGE_JPEG, dependendo do tipo
            return new ResponseEntity<>(logo, headers, HttpStatus.OK);
        } else {
            return ResponseEntity.notFound().build();
        }
    }



    @Transactional()
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Username e senha são obrigatórios");
        }

        try {
            Long companyId = companyService.authenticateCompany(username, password);
            return ResponseEntity.ok(Collections.singletonMap("companyId", companyId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciais inválidas");
        }
    }
    @Transactional()
    @PostMapping("/register")
    public ResponseEntity<?> registerCompany(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String birthdate,
            @RequestParam String phoneNumber,
            @RequestParam int taxPayerNumber,
            @RequestParam String street,
            @RequestParam String city,
            @RequestParam String postalCode,
            @RequestParam(required = false) MultipartFile logo
    ) {
        try {
            Company company = new Company(name, email, password, birthdate,
                    phoneNumber, taxPayerNumber, street, city, postalCode);

            if (logo != null && !logo.isEmpty()) {
                company.setLogo(logo.getBytes());
            }

            Company savedCompany = companyService.registerCompany(company);
            return ResponseEntity.ok(savedCompany);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao registar empresa.");
        }
    }

    @Transactional()
    @PostMapping("/{companyId}/add-driver")
    public ResponseEntity<Driver> addDriverToCompany(@PathVariable Long companyId, @RequestBody Driver driverRequest) {
        Optional<Driver> savedDriver = driverService.addDriverToCompany(companyId, driverRequest);
        return savedDriver.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @Transactional()
    @GetMapping("/{companyId}/vehicles")
    public ResponseEntity<List<Vehicle>> getVehiclesByCompany(@PathVariable Long companyId) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByCompany(companyId);
        return ResponseEntity.ok(vehicles);
    }
    @Transactional
    @PostMapping("/{companyId}/add-vehicle")
    public ResponseEntity<Vehicle> addVehicleToCompany(
            @PathVariable Long companyId,
            @RequestBody Vehicle vehicle
    ) {
        Optional<Vehicle> savedVehicle = vehicleService.addVehicleToCompany(companyId, vehicle);
        return savedVehicle
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Transactional()
    @GetMapping("/{companyId}/drivers")
    public ResponseEntity<List<Driver>> getDriversByCompany(@PathVariable Long companyId) {
        List<Driver> drivers = driverRepository.findByCompanyId(companyId);
        return ResponseEntity.ok(drivers);
    }
    @Transactional()
    @GetMapping("/{companyId}/orders-last-14-days")
    public List<OrderSummaryDto> getOrdersLast14Days(@PathVariable Long companyId) {
        return orderService.getOrdersLast14Days(companyId);
    }

    @Transactional()
    @GetMapping("/{companyId}/order-stats")
    public ResponseEntity<Map<String, Long>> getOrderStatistics(@PathVariable Long companyId) {
        Map<String, Long> stats = orderService.getOrderStatistics(companyId);
        return ResponseEntity.ok(stats);
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

    @Transactional()
    @PostMapping("/{companyId}/add-client")
    public ResponseEntity<Company> addClientToCompany(@PathVariable Long companyId, @RequestBody Client client) {
        Optional<Company> updatedCompany = companyService.addClientToCompany(companyId, client);

        return updatedCompany
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @Transactional()
    @GetMapping("/{companyId}/clients")
    public ResponseEntity<List<Client>> getClientsByCompany(@PathVariable Long companyId) {
        List<Client> clients = companyService.getClientsByCompany(companyId);
        return ResponseEntity.ok(clients);
    }


}