package com.klu;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingsRepo extends JpaRepository<Bookings, Integer> {
}
