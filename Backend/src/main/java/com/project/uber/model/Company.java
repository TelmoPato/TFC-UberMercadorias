package com.project.uber.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "companies")
public class Company extends User {

    @JsonIgnore
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<Driver> drivers;

    @JsonIgnore
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<Client> clients;

    @JsonIgnore
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<Vehicle> vehicles;

    public Company(String name, String email, String password, String birthdate,
                   String phoneNumber, int taxPayerNumber, String street,
                   String city, String postalCode) {
        super(name, email, password, birthdate, phoneNumber, taxPayerNumber, street, city, postalCode);
    }
}
