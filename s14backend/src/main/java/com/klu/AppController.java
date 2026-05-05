package com.klu;

import java.util.Map;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.klu.service.OtpService;
import com.klu.service.TwilioSmsService;

@RestController
@CrossOrigin // Allow frontend access
public class AppController {

    @Autowired
    Service obj;

    Cryptography cryp = new Cryptography();

    @Autowired
    OtpService otpService;

    @Autowired
    TwilioSmsService smsService;

    // --- HOME ---
    @GetMapping("/home")
    public String home() {
        return "Welcome to Car Rental Backend";
    }

    // --- USERS ---
    @PostMapping("/user")
    public String registerUser(@RequestBody User user) {
        user.setPassword(cryp.encryptData(user.getPassword()));
        return obj.insertData(user);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return obj.retrieveUsers();
    }

    // --- LOGIN ---
    @PostMapping("/check")
    public User login(@RequestBody User user) {
        return obj.loginCheck(user);
    }

    // --- OTP ---
    private String formatPhone(String phone) {
        if (!phone.startsWith("+")) {
            return "+91" + phone; // prepend country code
        }
        return phone;
    }

    @PostMapping("/send-otp")
    public String sendOtp(@RequestBody Map<String, String> payload) {
        String phone = payload.get("phone");
        if (phone == null || phone.isEmpty()) return "Phone number required";

        phone = formatPhone(phone); // consistently format

        String otp = otpService.generateOtp(phone);
        smsService.sendSms(phone, "Your OTP is: " + otp);

        return "OTP sent to " + phone;
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody Map<String, String> payload) {
        String phone = payload.get("phone");
        String otp = payload.get("otp");
        if (phone == null || otp == null) return "Invalid input";

        phone = formatPhone(phone); // same formatting
        return otpService.validateOtp(phone, otp) ? "Verified" : "Invalid OTP";
    }

    // --- CARS ---
    @PostMapping("/car")
    public String addCar(@RequestBody Car car) {
        return obj.insertCar(car);
    }

    @GetMapping("/cars")
    public List<Car> getAllCars() {
        return obj.retrieveCars();
    }

    @PutMapping("/car")
    public String updateCar(@RequestBody Car car) {
        return obj.updateCar(car);
    }

    @DeleteMapping("/car")
    public String deleteCar(@RequestParam("pid") int pid) {
        return obj.deleteCar(pid);
    }

    // --- BOOKINGS ---
    @PostMapping("/booking")
    public String addBooking(@RequestBody Bookings booking) {
        return obj.insertBooking(booking);
    }

    @GetMapping("/bookings")
    public List<Bookings> getAllBookings() {
        return obj.retrieveBookings();
    }

    @PutMapping("/booking")
    public String updateBooking(@RequestBody Bookings booking) {
        return obj.updateBooking(booking);
    }

    @DeleteMapping("/booking")
    public String deleteBooking(@RequestParam("pid") int pid) {
        return obj.deleteBooking(pid);
    }

    // --- LOCATIONS ---
    @PostMapping("/location")
    public String addLocation(@RequestBody Locations location) {
        return obj.insertLocation(location);
    }

    @GetMapping("/locations")
    public List<Locations> getAllLocations() {
        return obj.retrieveLocations();
    }

    @PutMapping("/location")
    public String updateLocation(@RequestBody Locations location) {
        return obj.updateLocation(location);
    }

    @DeleteMapping("/location")
    public String deleteLocation(@RequestParam("pid") int pid) {
        return obj.deleteLocation(pid);
    }
}
