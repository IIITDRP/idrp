package com.idrp.backend.entity;

/**
 * PRD Phase 1 SP-02: every startup has exactly one status.
 * Funded supersedes Incubated, which supersedes Pre-Incubated.
 */
public enum StartupStatus {
    PRE_INCUBATED,
    INCUBATED,
    FUNDED
}
