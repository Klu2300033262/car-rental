package com.klu.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String apiKey;

    @Value("${sendgrid.from.email}")
    private String fromEmail;

    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        Email from = new Email(fromEmail);
        String subject = "Your Auto Elite Verification Code";
        Email to = new Email(toEmail);
        Content content = new Content("text/plain", 
            "Welcome to Auto Elite Rentals!\n\n" +
            "Your OTP for account verification is: " + otp + "\n\n" +
            "This code will expire in 5 minutes.");
        
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(apiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println("SendGrid Status: " + response.getStatusCode());
        } catch (IOException ex) {
            System.err.println("SendGrid failed: " + ex.getMessage());
        }
    }
}
