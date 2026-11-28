package com.idrp.backend.entity;

/**
 * Portfolio stage of a startup. A startup may hold several at once
 * (for example one that is both Incubated and Funded).
 */
public enum StartupStatus {
    PRE_INCUBATED,
    INCUBATED,
    FUNDED
}
