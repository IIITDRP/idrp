package com.idrp.backend.service;

import com.idrp.backend.entity.Inquiry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * PRD CT-08: e-mails the IDRP team about every stored inquiry. Optional - it does
 * nothing unless both spring.mail.host and app.inquiry.notify-to are configured, and a
 * mail failure is only logged: the inquiry is already safely in the database.
 */
@Component
public class InquiryNotifier {

    private static final Logger log = LoggerFactory.getLogger(InquiryNotifier.class);

    private final ObjectProvider<JavaMailSender> mailSender;
    private final String[] recipients;
    private final String from;
    private final String adminUrl;

    public InquiryNotifier(ObjectProvider<JavaMailSender> mailSender,
                           @Value("${app.inquiry.notify-to:}") String notifyTo,
                           @Value("${app.inquiry.notify-from:}") String from,
                           @Value("${app.inquiry.admin-url:}") String adminUrl) {
        this.mailSender = mailSender;
        this.recipients = Arrays.stream(notifyTo.split(","))
                .map(String::trim).filter(s -> !s.isEmpty()).toArray(String[]::new);
        this.from = from;
        this.adminUrl = adminUrl;
    }

    @Async
    public void notifyNewInquiry(Inquiry inquiry) {
        JavaMailSender sender = mailSender.getIfAvailable();
        if (sender == null || recipients.length == 0) {
            return;
        }
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(recipients);
            if (!from.isBlank()) {
                mail.setFrom(from);
            }
            mail.setReplyTo(inquiry.getEmail());
            mail.setSubject("[IDRP] New " + inquiry.getFormType() + " inquiry from " + inquiry.getFullName());
            mail.setText(String.join("\n",
                    "A new inquiry was submitted on the IDRP website.",
                    "",
                    "Type:         " + inquiry.getFormType(),
                    "Name:         " + inquiry.getFullName(),
                    "Email:        " + inquiry.getEmail(),
                    "Phone:        " + dashIfBlank(inquiry.getPhone()),
                    "Organisation: " + dashIfBlank(inquiry.getOrganization()),
                    "Page:         " + dashIfBlank(inquiry.getSourcePage()),
                    "",
                    dashIfBlank(inquiry.getMessage()),
                    "",
                    adminUrl.isBlank() ? "" : "Open in the admin panel: " + adminUrl + "/admin/inquiries"));
            sender.send(mail);
        } catch (Exception e) {
            log.warn("Inquiry {} saved, but the notification e-mail failed: {}", inquiry.getId(), e.getMessage());
        }
    }

    private static String dashIfBlank(String value) {
        return value == null || value.isBlank() ? "-" : value;
    }
}
