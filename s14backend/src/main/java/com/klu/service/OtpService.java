package com.klu.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class OtpService {

    private Map<String, String> otpStore = new HashMap<>();

    // Generate OTP
    public String generateOtp(String phone) {
        String otp = String.valueOf(new Random().nextInt(899999) + 100000);
        otpStore.put(phone, otp);
        System.out.println("OTP for " + phone + ": " + otp); // Print for manual testing
        return otp;
    }

    // Validate OTP
    public boolean validateOtp(String phone, String otp) {
        if (phone == null || otp == null) return false;
        return otp.equals(otpStore.get(phone));
    }
}
