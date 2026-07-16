package com.RouteSphere.REST.serviceImpl;

import com.RouteSphere.REST.service.EmailService;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final Resend resend;

    @Value("${resend.from}")
    private String from;

    @Override
    public void sendShipmentCreatedEmail(String to, String trackingNumber) {

        log.info("Sending shipment created email to {}", to);

        String subject = "Shipment Created";

        String html = """
                <h2>RouteSphere</h2>
                <p>Your shipment has been created successfully!</p>

                <b>Tracking Number:</b> %s
                """.formatted(trackingNumber);

        sendEmail(to, subject, html);
    }

    @Override
    public void sendShipmentDeliveredEmail(String to, String trackingNumber) {

        log.info("Sending shipment delivered email to {}", to);

        String subject = "Shipment Delivered";

        String html = """
                <h2>RouteSphere</h2>
                <p>Your shipment has been delivered successfully!</p>

                <b>Tracking Number:</b> %s
                """.formatted(trackingNumber);

        sendEmail(to, subject, html);
    }

    @Override
    public void sendPaymentsSuccessfulEmail(String to, String invoiceNumber) {

        log.info("Sending payment successful email to {}", to);

        String subject = "Payment Successful";

        String html = """
                <h2>RouteSphere</h2>
                <p>Your payment was successful!</p>

                <b>Invoice Number:</b> %s
                """.formatted(invoiceNumber);

        sendEmail(to, subject, html);
    }

    private void sendEmail(String to, String subject, String html) {

        CreateEmailOptions options = CreateEmailOptions.builder()
                .from(from)
                .to(to)
                .subject(subject)
                .html(html)
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(options);

            log.info("Email sent successfully. Email ID: {}", response.getId());

        } catch (ResendException e) {

            log.error("Failed to send email to {}", to, e);

        }
    }
}