# Focus Extension State Machine Design

## States
1. **DISABLED**: No controller, no functionality
2. **ENABLED_FOCUSED**: Controller active, blocking content
3. **ENABLED_UNFOCUSED**: Controller active, not blocking content

## Transitions
1. **DISABLED → ENABLED_FOCUSED**: Reload required (controller initialization needed)
2. **ENABLED_FOCUSED → ENABLED_UNFOCUSED**: Instant (controller.renderFocusMode)
3. **ENABLED_UNFOCUSED → ENABLED_FOCUSED**: Instant (controller.renderFocusMode)  
4. **ENABLED_* → DISABLED**: Instant (controller cleanup)

## Implementation Strategy
- Single storage listener handles all transitions
- Clean separation of concerns:
  - Reload logic for DISABLED → ENABLED
  - Instant toggle logic for ENABLED ↔ ENABLED
  - Cleanup logic for ENABLED → DISABLED

## Flow
1. **Page Load**: Determine initial state, initialize accordingly
2. **Storage Change**: Route to appropriate transition handler
3. **Post-Reload**: Detect reload reason and apply correct focus mode