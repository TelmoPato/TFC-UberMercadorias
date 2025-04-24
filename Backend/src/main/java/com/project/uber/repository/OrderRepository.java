package com.project.uber.repository;


import com.project.uber.enums.OrderStatus;
import com.project.uber.model.Order;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByClientId(Long clientId);
    List<Order> findByDriverId(Long driverId);

    long countByDriverIdInAndStatus(List<Long> driverIds, OrderStatus status);

    @Query("SELECT o FROM Order o WHERE o.driver.company.id = :companyId AND o.date >= :startDate")
    List<Order> findOrdersLast14Days(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate);


   // @NotNull
   // Optional<Order> findById(@NotNull Long id);

}
