package com.project.uber.repository;

import com.project.uber.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    Client findByEmail(String email);
    Client findByPhoneNumber(String phoneNumber);
    Client findByTaxPayerNumber(int taxPayerNumber);

    List<Client> findByCompanyId(Long companyId);



}

