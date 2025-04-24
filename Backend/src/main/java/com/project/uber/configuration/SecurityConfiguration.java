package com.project.uber.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(cors -> cors.configurationSource(request -> {  //ADICIONADO TELMO
                    var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                    corsConfig.setAllowedOrigins(List.of("http://localhost:3000", "http://192.168.1.69:3000"));// Permite Next.js
                    corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfig.setAllowedHeaders(List.of("*"));
                    corsConfig.setAllowCredentials(true);
                    return corsConfig;
                }))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.POST, "/client/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/client/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/driver/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/driver/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ws-endpoint/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/ws/**").permitAll() // Adicionado
                        .requestMatchers(HttpMethod.POST, "/company/{companyId}/add-driver").permitAll()
                        .requestMatchers(HttpMethod.GET, "/company/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/company/{companyId}/add-vehicle").permitAll()
                        .requestMatchers(HttpMethod.POST, "/company/{companyId}/add-client").permitAll()
                        .requestMatchers(HttpMethod.POST, "/company/register").permitAll()
                        .requestMatchers("/error").permitAll() // Adicionado
                        .requestMatchers(HttpMethod.POST, "/app/broadcast").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/notifications").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
