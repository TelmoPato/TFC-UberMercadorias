package com.project.uber.dtos;


import java.time.LocalDate;

public class OrderSummaryDto{
    private LocalDate date;
    private long totalOrders;
    private long completedOrders;

    public OrderSummaryDto(LocalDate date, long totalOrders, long completedOrders) {
        this.date = date;
        this.totalOrders = totalOrders;
        this.completedOrders = completedOrders;
    }

    public LocalDate getDate() {
        return date;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }
}

