package com.klu.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioSmsService {

    private static final Logger logger = LoggerFactory.getLogger(TwilioSmsService.class);

    @Value("${twilio.account.sid}")
    private String sid;

    @Value("${twilio.auth.token}")
    private String token;

    @Value("${twilio.phone.number}")
    private String fromNumber;

    @PostConstruct
    private void initTwilio() {
        Twilio.init(sid, token);
        logger.info("Twilio initialized successfully");
    }

    public void sendSms(String to, String body) {
        try {
            Message.creator(new PhoneNumber(to), new PhoneNumber(fromNumber), body).create();
            logger.info("SMS sent to {}", to);
        } catch (Exception e) {
            logger.error("Twilio SMS failed: {}", e.getMessage());
            // Do not throw exception — allow OTP to work even if SMS fails
        }
    }
}
