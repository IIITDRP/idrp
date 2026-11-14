package com.idrp.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Structured, one-line-per-request access log: method, path, status, duration, client IP.
 * Runs first (Ordered.HIGHEST_PRECEDENCE) so the timer covers rate limiting, auth, and
 * the actual handler.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger("com.idrp.backend.access");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        long start = System.currentTimeMillis();
        try {
            filterChain.doFilter(request, response);
        } finally {
            long durationMs = System.currentTimeMillis() - start;
            log.info("method={} path={} status={} durationMs={} ip={}",
                    request.getMethod(), request.getRequestURI(), response.getStatus(), durationMs, clientIp(request));
        }
    }

    private String clientIp(HttpServletRequest request) {
        // Client IP is resolved by Tomcat (server.forward-headers-strategy=native), which only
        // trusts X-Forwarded-For from known proxies - never parse the raw header here, since a
        // client can set it to anything and dodge rate limits or forge audit entries.
        return request.getRemoteAddr();
    }
}
