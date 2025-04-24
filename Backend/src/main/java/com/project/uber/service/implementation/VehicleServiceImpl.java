package com.project.uber.service.implementation;

import com.project.uber.model.Company;
import com.project.uber.model.Vehicle;
import com.project.uber.repository.CompanyRepository;
import com.project.uber.repository.VehicleRepository;
import com.project.uber.service.interfac.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleServiceImpl implements VehicleService{

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Override
    public List<Vehicle> getVehiclesByCompany(Long companyId) {
        return vehicleRepository.findByCompanyId(companyId);
    }
    @Override
    public Optional<Vehicle> addVehicleToCompany(Long companyId, Vehicle vehicle) {
        Optional<Company> companyOptional = companyRepository.findById(companyId);

        if (companyOptional.isPresent()) {
            vehicle.setCompany(companyOptional.get());
            vehicle.setDriver(null);  // 🚀 Garante que o driver não seja obrigatório
            return Optional.of(vehicleRepository.save(vehicle));
        }
        return Optional.empty();
    }

}

