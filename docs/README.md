# Weekly Operations Follow-Up Board™ - UBuildOS Day 07

A bounded Day-07 proof build that combines four standardized source types into one inspectable weekly action view.

## What it proves
- imports 4 source types: invoices, support, projects, sales;
- preserves source type, source record ID, original fields, normalized fields, mapping status/reason, and a source reference;
- deterministic known mappings become `MAPPED`;
- missing/ambiguous due date or priority becomes visible `REVIEW` rather than a guessed value;
- responsive public surface works from narrow mobile through desktop.

## Run locally
Serve the `product/` directory with any static HTTP server. No backend, credentials, network integration, or external service is required.

## Limits
This package uses synthetic public-safe data. It does not claim live CRM/accounting/helpdesk/project integrations, automated follow-up actions, or business outcomes.

## Producer / reviewer replay
From the candidate root:
- `python tests.py` — replay the normal frozen Day-07 verifier.
- `python negative_controls.py` — replay the frozen tamper/false-PASS controls in `fixtures/negative_controls.json`.

The negative-control harness mutates disposable copies only and regenerates superficial `SHA256SUMS.txt` metadata before each verifier replay. The locked candidate itself is never modified by the harness.
