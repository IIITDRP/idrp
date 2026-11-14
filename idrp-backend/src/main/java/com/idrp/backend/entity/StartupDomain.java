package com.idrp.backend.entity;

/**
 * PRD Phase 1 SP-03 domain taxonomy. A startup may carry more than one domain.
 * OTHER covers ventures that fit none of the eight PRD domains; the free-text
 * {@code sector} on the startup still describes them precisely.
 */
public enum StartupDomain {
    HEALTH_TECH,
    AI_SAAS,
    IOT_SMART_ENERGY,
    TRAVEL_TECH,
    DEEP_TECH,
    AUTO_TECH,
    EDTECH,
    PLATFORM_TECH,
    OTHER
}
