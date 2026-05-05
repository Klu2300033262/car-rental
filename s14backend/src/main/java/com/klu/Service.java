package com.klu;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

@org.springframework.stereotype.Service
public class Service {

    @Autowired
    UserRepo repo1;

    @Autowired
    CarRepo repoCar;

    @Autowired
    BookingsRepo repoBooking;

    @Autowired
    LocationsRepo repoLocation;

    // --- USER ---
    public String insertData(User user) {
        repo1.save(user);
        return "Inserted Successfully";
    }

    public User loginCheck(User user) {
        User user2 = repo1.findByEmail(user.getEmail());
        if (user2 == null) {
            return user;
        } else {
            if (new Cryptography().decryptData(user2.getPassword()).equals(user.getPassword())) {
                return user2;
            } else {
                return user;
            }
        }
    }

    // --- CAR METHODS ---
    public String insertCar(Car car) {
        repoCar.save(car);
        return "Inserted Successfully";
    }

    public List<Car> retrieveCars() {
        return repoCar.findAll();
    }

    public String updateCar(Car car) {
        repoCar.save(car);
        return "Updated";
    }

    public String deleteCar(int pid) {
        if (repoCar.findById(pid).isPresent()) {
            repoCar.deleteById(pid);
            return "Deleted";
        } else {
            return "Element Not Present";
        }
    }

    // --- BOOKING METHODS ---
    public String insertBooking(Bookings booking) {
        repoBooking.save(booking);
        return "Booking Confirmed";
    }

    public List<Bookings> retrieveBookings() {
        return repoBooking.findAll();
    }

    public String updateBooking(Bookings booking) {
        repoBooking.save(booking);
        return "Updated";
    }

    public String deleteBooking(int pid) {
        if (repoBooking.findById(pid).isPresent()) {
            repoBooking.deleteById(pid);
            return "Deleted";
        } else {
            return "Element Not Present";
        }
    }

    // --- LOCATIONS METHODS ---
    public String insertLocation(Locations location) {
        repoLocation.save(location);
        return "Inserted Successfully";
    }

    public List<Locations> retrieveLocations() {
        return repoLocation.findAll();
    }

    public String updateLocation(Locations location) {
        repoLocation.save(location);
        return "Updated";
    }

    public String deleteLocation(int pid) {
        if (repoLocation.findById(pid).isPresent()) {
            repoLocation.deleteById(pid);
            return "Deleted";
        } else {
            return "Element Not Present";
        }
    }

    public List<User> retrieveUsers() {
        return repo1.findAll();
    }    
}
