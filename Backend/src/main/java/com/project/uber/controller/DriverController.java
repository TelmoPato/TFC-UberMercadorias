package com.project.uber.controller;
import com.project.uber.repository.DriverRepository;
import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import com.project.uber.dtos.*;
import com.project.uber.enums.OrderStatus;
import com.project.uber.infra.exceptions.BusinessException;
import com.project.uber.model.Driver;
import com.project.uber.service.implementation.EmailServiceImpl;
import com.project.uber.service.interfac.AuthenticationService;
import com.project.uber.service.interfac.DriverService;
import com.project.uber.service.interfac.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// This Java code is part of a Spring Boot project located in the package and is responsible for managing driver-related functionalities.
// It includes several imports from the project's own structure as well as Spring framework components.

// This class, DriverController, is annotated with @RestController, indicating it's a Spring MVC controller with REST API responses.
// The @RequestMapping("/driver") annotation sets the base URI for all request mappings inside this controller.

@RestController
@RequestMapping("/driver")
public class DriverController {

    // Spring's @Autowired annotation is used to auto-wire beans into the class.
    // Below are the fields for services and components used in this controller.
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private DriverService driverService;

    @Autowired
    private DriverRepository driverRepository;
    @Autowired
    private OrderService orderService;
    @Autowired
    private EmailServiceImpl emailService;


    @Transactional()
    @DeleteMapping("/drivers/{id}")
    public ResponseEntity<?> deleteDriverCompany(@PathVariable Long id) {
        try {
            driverRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao deletar condutor");
        }
    }

    // This method handles POST requests to "/register" and registers a new driver.
    @PostMapping("/register")
    public ResponseEntity<DriverDto> register(@RequestBody Driver driver) {
        try {
            // Chama o serviço para salvar o driver baseado nos dados do DTO
            DriverDto savedDriver = driverService.saveDriver(driver);
            // Retorna uma resposta de sucesso com o DTO do driver salvo
            return ResponseEntity.ok(savedDriver);
        } catch (Exception e) {
            // Em caso de outros erros, retorna uma resposta de InternalServerError
            throw new BusinessException("Driver already exists!");
        }
    }
    // This method handles driver authentication with a POST request to "/login".
    @PostMapping("/login")
    public ResponseEntity<?> auth(@RequestBody AuthDto authDto) { // ResponseEntity is used to represent the whole HTTP response: status code, headers, and body.
        if (authDto == null || authDto.email() == null || authDto.password() == null) {
            throw new BusinessException("Email and password are mandatory.");
        }
        try {
            // Authentication logic, including the creation and verification of authentication tokens.
            var usuarioAutenticationToken = new UsernamePasswordAuthenticationToken(authDto.email(), authDto.password());
            authenticationManager.authenticate(usuarioAutenticationToken);
            String token = authenticationService.getDriverTokenJwt(authDto);
            return ResponseEntity.ok(token);
        } catch (AuthenticationException e) {
            // Handles authentication failures.
            throw new BusinessException("Error authenticating driver: " + e.getMessage());
        }
    }

    // This method deletes a driver's account.
    @GetMapping("/deleteDriver") // Handles GET requests to "/deleteDriver".
    public ResponseEntity<?> deleteDriver(@RequestHeader("Authorization") String token) {
        try {
            // Validates token and retrieves driver ID. Ensures all orders are deleted before proceeding with driver deletion.
            Long driverId = validateTokenAndGetDriverId(token);

            driverService.deleteDriver(driverId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (BusinessException e) {
            // Handles exceptions during driver deletion.
            throw new BusinessException("Error deleting client " + e.getMessage());
        }
    }
    @GetMapping("/checkDriverStatus") // Handles GET requests to "/deleteDriver".
    public ResponseEntity<Boolean> statusDriver(@RequestHeader("Authorization") String token) {
        try {
            // Validates token and retrieves driver ID. Ensures all orders are deleted before proceeding with driver deletion.
            Long driverId = validateTokenAndGetDriverId(token);

            Boolean isOnline = driverService.checkDriverStatus(driverId);
            return new ResponseEntity<>(isOnline, HttpStatus.OK);
        } catch (BusinessException e) {
            // Handles exceptions during driver deletion.
            throw new BusinessException("Error deleting client " + e.getMessage());
        }
    }


    //obtem a encomenda pelo id
    @GetMapping("/getOrder/{orderId}")
    public ResponseEntity<OrderDto> getOrder(@PathVariable Long orderId, @RequestHeader("Authorization") String token) {
        validateTokenAndGetDriverId(token);

        try {
            OrderDto order = orderService.getOrderDtoById(orderId);
            return new ResponseEntity<>(order, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new OrderDto());
        }

    }

    @PutMapping("/setCurrentLocation") // Handles PUT requests to "/online".
    public ResponseEntity<?> setCurrentLocation(@RequestBody String location, @RequestHeader("Authorization") String token) {
        Long driverId = validateTokenAndGetDriverId(token);
        try {
            System.out.println("\n\n\nlocation: " + location + "\n\n\n");
            if (location == null || location.isEmpty()) {
                throw new BusinessException("Location must be provided to continue.");
            }
            driverService.updateDriverLocationAndStatus(driverId, location, true);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // Handles exceptions when setting driver status.
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // This method sets a driver's status to online.
    @PutMapping("/online") // Handles PUT requests to "/online".
    public ResponseEntity<?> setDriverOnline(@RequestHeader("Authorization") String token, @RequestBody Driver request) {
        Long driverId = validateTokenAndGetDriverId(token);
        try {
            // Validates location information and updates the driver's status.
            String location = request.getLocation();
            if (location == null || location.isEmpty()) {
                throw new BusinessException("Location must be provided to go online.");
            }
            driverService.updateDriverLocationAndStatus(driverId, location, true);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // Handles exceptions when setting driver status.
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // This method sets a driver's status to offline.
    @PutMapping("/offline") // Handles PUT requests to "/offline".
    public ResponseEntity<?> setDriverOffline(@RequestHeader("Authorization") String token) {
        Long driverId = validateTokenAndGetDriverId(token);
        try {
            // Updates the driver's status to offline.
            driverService.setDriverOnlineStatus(driverId, false);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // Handles exceptions when setting driver status.
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // This PUT mapping method is designed to handle the confirmation of a pickup by a driver.
    @PutMapping("/pick-up/{orderId}")
    public ResponseEntity<?> confirmPickUp(
            @PathVariable Long orderId,  // The order details needed for the pickup confirmation.
            @RequestHeader("Authorization") String token) { // The token is required to authenticate the driver.
        try {
            validateTokenAndGetDriverId(token); // Validates the token and retrieves the driver ID.
            orderService.pickupOrderStatus(orderId); // Calls the order service to confirm the pickup.
            return ResponseEntity.ok().build(); // Returns an OK response if successful.
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // Returns a bad request response if an exception occurs.
        }
    }
    // This PUT mapping method is designed to handle the confirmation of a pickup by a driver.
    @PutMapping("/deliver/{orderId}")
    public ResponseEntity<?> confirmDeliver(
            @PathVariable Long orderId,  // The order details needed for the pickup confirmation.
            @RequestHeader("Authorization") String token) { // The token is required to authenticate the driver.
        try {
            Long driverId = validateTokenAndGetDriverId(token); // Validates the token and retrieves the driver ID.
            orderService.deliverOrderStatus(orderId, driverId); // Calls the order service to confirm the pickup.
            return ResponseEntity.ok().build(); // Returns an OK response if successful.
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // Returns a bad request response if an exception occurs.
        }
    }

    // This PUT mapping method is designed to handle the confirmation of a pickup by a driver.
    @PutMapping("/cancelled/{orderId}")
    public ResponseEntity<?> cancelledOrder(
            @PathVariable Long orderId,  // The order details needed for the pickup confirmation.
            @RequestHeader("Authorization") String token) { // The token is required to authenticate the driver.
        try {
            Long driverId = validateTokenAndGetDriverId(token); // Validates the token and retrieves the driver ID.
            orderService.cancelledOrderStatus(orderId, driverId); // Calls the order service to confirm the pickup.
            return ResponseEntity.ok().build(); // Returns an OK response if successful.
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // Returns a bad request response if an exception occurs.
        }
    }

    @GetMapping("/getDriverSalary") // Handles GET requests to "/deleteDriver".
    public ResponseEntity<Double> getDriverSalary(@RequestHeader("Authorization") String token) {
        try {
            // Validates token and retrieves driver ID. Ensures all orders are deleted before proceeding with driver deletion.
            Long driverId = validateTokenAndGetDriverId(token);

            Double salary = driverService.getDriverSalary(driverId);
            return new ResponseEntity<>(salary, HttpStatus.OK);
        } catch (BusinessException e) {
            // Handles exceptions during driver deletion.
            throw new BusinessException("Error deleting client " + e.getMessage());
        }
    }

    // This POST method is for sending simple messages via email.
    @PostMapping("/sendSimpleMessage")
    public ResponseEntity<Void> sendSimpleMessage(@RequestBody EmailDto emailDto) { // Takes an email DTO which includes the details needed for the email.
        emailService.sendSimpleMessage(emailDto); // Uses the email service to send a message.
        return ResponseEntity.ok().build(); // Returns an OK response after sending the message.
    }

    // This GET method retrieves the driver profile based on the provided token.
    @GetMapping("/viewProfile")
    public ResponseEntity<?> viewProfile(
            @RequestHeader("Authorization") String token) { // The token is used to authenticate and identify the driver.
        Long driverId = validateTokenAndGetDriverId(token); // Validates the token and retrieves the driver ID.
        DriverDto driverDto = driverService.viewProfile(driverId); // Retrieves the driver profile using the driver service.
        return new ResponseEntity<>(driverDto, HttpStatus.OK); // Returns the driver profile with an OK status.
    }

    // This GET method retrieves the driver profile based on the provided token.
    @GetMapping("/getDriverId")
    public ResponseEntity<Long> getDriverId(
            @RequestHeader("Authorization") String token) { // The token is used to authenticate and identify the driver.
        Long driverId = validateTokenAndGetDriverId(token); // Validates the token and retrieves the driver ID.
        return new ResponseEntity<>(driverId, HttpStatus.OK); // Returns the driver profile with an OK status.
    }

    // This POST method allows the driver to edit their profile.
    @PostMapping("/editProfile")
    public ResponseEntity<?> editProfile(
            @RequestBody DriverDto driverDto, // The driver DTO with the updated profile information.
            @RequestHeader("Authorization") String token) { // The token for driver authentication.
        Long driverId = validateTokenAndGetDriverId(token); // Validates the token and retrieves the driver ID.
        DriverDto newDriver = driverService.editProfile(driverId, driverDto); // Updates the driver profile.
        return new ResponseEntity<>(newDriver, HttpStatus.OK); // Returns the updated profile with an OK status.
    }

    // This GET method retrieves the order history for a driver.
    @GetMapping("/orderHistory")
    public ResponseEntity<List<OrderDto>> getDriverOrderHistory(
            @RequestHeader("Authorization") String token) { // The token is used to authenticate the driver.
        try {
            Long driverId = validateTokenAndGetDriverId(token); // Validates the token and retrieves the driver ID.
            List<OrderDto> orderHistory = driverService.getDriverOrderHistory(driverId); // Fetches the order history from the order service.
            return new ResponseEntity<>(orderHistory, HttpStatus.OK); // Returns the order history with an OK status.
        } catch (BusinessException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); // Returns an unauthorized status if there's an issue with token validation.
        }
    }

    // This POST method handles password changes for the driver.
    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordDto changePasswordDto, // Contains the old and new password.
            @RequestHeader("Authorization") String token) { // The token for driver authentication.
        Long driverId = validateTokenAndGetDriverId(token); // Validates the token and retrieves the driver ID.
        driverService.changePassword(driverId, changePasswordDto.oldPassword(), changePasswordDto.newPassword()); // Changes the password using the driver service.
        return new ResponseEntity<>(HttpStatus.OK); // Returns an OK status upon successful password change.
    }

    // verify if the token is valid
    @GetMapping("/isValidToken")
    public ResponseEntity<Boolean> isValidToken(@RequestHeader("Authorization") String token) {
        try {
            validateTokenAndGetDriverId(token);
            return new ResponseEntity<>(true, HttpStatus.OK);
        } catch (BusinessException e) {
            return new ResponseEntity<>(false, HttpStatus.OK);
        }
    }

    // This private method validates the JWT token and extracts the driver ID from it.
    private Long validateTokenAndGetDriverId(String token) {
        // Assumes the token is prefixed by "Bearer ", which is typical in HTTP authorization headers.
        String tokenSliced = token.substring("Bearer ".length());

        Long driverId = authenticationService.getDriverIdFromToken(tokenSliced);
        if (driverId == null || driverId <= 0) {
            throw new BusinessException("Invalid token");
        }
        return driverId;
    }
}