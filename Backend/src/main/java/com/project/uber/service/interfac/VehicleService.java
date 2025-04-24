package com.project.uber.service.interfac;

import com.project.uber.model.Vehicle;

import java.util.List;
import java.util.Optional;

public interface VehicleService {

    List<Vehicle> getVehiclesByCompany(Long companyId);

    Optional<Vehicle> addVehicleToCompany(Long companyId, Vehicle vehicle);
}
