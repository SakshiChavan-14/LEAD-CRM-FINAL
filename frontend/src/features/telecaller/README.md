# Telecaller Feature Domain

## Overview
Provides the complete Telecaller workspace including dialer modal, call logs, follow-up management, recordings viewer, and Twilio/Voice Device integration.

## Responsibilities
- Voice device initialization, connection lifecycle, and microphone permission management.
- Telecaller overview metrics and daily task summary.
- Audio recording modal player.

## Key Entry Points
- `TelecallerOverviewTab.jsx` — Primary telecaller dashboard view.
- `useVoiceDevice.js` — Custom hook wrapping Twilio voice device integration.
- `CallDetailsModal.jsx` — Detailed call log inspector and audio player.

## Dependencies
- `@/components/ui/`
- `@/components/table/`
