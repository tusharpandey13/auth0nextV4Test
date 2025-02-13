"use client";
import React from "react";
import { SWRConfig } from "swr";
export function Auth0Provider({ user, children }) {
    return (React.createElement(SWRConfig, { value: {
            fallback: {
                "/auth/profile": user
            }
        } }, children));
}
