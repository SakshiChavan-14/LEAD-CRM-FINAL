# 4. Ownership Before Reuse

## Context
Prematurely extracting code into shared folders creates false abstractions, tight coupling, and unneeded complexity.

## Decision
Code belongs to the feature that created it until cross-feature reuse across at least 3 distinct feature domains is proven.

## Consequences
- Reduces premature abstraction overhead.
- Features maintain full control over their evolution until common patterns emerge naturally.
