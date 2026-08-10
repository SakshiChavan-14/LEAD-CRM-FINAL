# Sprint 19 — Search Result Ranking & Relevance

## Executive Summary
Search results must feel intuitive and relevant. Global and feature-level searches will employ a weighted ranking system to ensure the most valuable matches appear first.

---

## Entity Ranking Weights

When aggregating cross-entity results (e.g., Global Search), results should be ranked by entity relevance based on the user's role and context.

| Match Field | Weight | Description |
| :--- | :--- | :--- |
| **Exact Lead / Employee ID** | ★★★★★ | Highest priority. If a user types an exact ID, it should be the top result. |
| **Lead / User Name** | ★★★★★ | Primary identification field. |
| **Phone Number / Mobile** | ★★★★☆ | High priority for CRM operations and telecalling. |
| **Email Address** | ★★★★☆ | High priority for communication. |
| **Company / Organization** | ★★★☆☆ | Secondary identifier. |
| **Course / Subject** | ★★☆☆☆ | Contextual identifier. |
| **Remarks / Notes** | ★☆☆☆☆ | Lowest priority. Used as a fallback for deep text search. |

---

## Result Sorting Strategy

1. **Exact Matches First**: Strings matching the query exactly (case-insensitive) rank higher than partial matches.
2. **Starts With vs Contains**: `"John"` matching `"John Doe"` ranks higher than matching `"Elton John"`.
3. **Recency Factor**: If two leads match with equal text relevance, the more recently updated or interacted-with lead ranks higher.
