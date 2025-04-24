package com.project.uber.service.implementation;

import com.project.uber.model.Client;
import com.project.uber.model.Company;
import com.project.uber.model.Driver;
import com.project.uber.repository.ClientRepository;
import com.project.uber.repository.CompanyRepository;
import com.project.uber.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyServiceImpl {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private DriverRepository driverRepository;


    public List<Driver> getDriversByCompany(Long companyId) {
        return driverRepository.findByCompanyId(companyId);
    }

    public Company registerCompany(Company company) {
        company.setPassword(passwordEncoder.encode(company.getPassword()));
        return companyRepository.save(company);
    }

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Optional<Company> getCompanyById(Long id) {
        return companyRepository.findById(id);
    }

    public Optional<Company> addClientToCompany(Long companyId, Client client) {
        Optional<Company> companyOptional = companyRepository.findById(companyId);

        if (companyOptional.isPresent()) {
            Company company = companyOptional.get();
            client.setCompany(company); // Associa o cliente à empresa
            clientRepository.save(client); // Salva o cliente primeiro
            company.getClients().add(client); // Adiciona o cliente à lista da empresa

            companyRepository.save(company); // Atualiza a empresa no banco
            return Optional.of(company);
        }
        return Optional.empty();
    }


    public List<Client> getClientsByCompany(Long companyId) {
        return clientRepository.findByCompanyId(companyId);
    }
}

