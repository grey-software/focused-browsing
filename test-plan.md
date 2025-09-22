# Test Plan for Focus Extension State Machine

## Test Scenarios

### 1. DISABLED → ENABLED (The Problem Case)
**Setup**: Website starts with toggle OFF
**Action**: Use popup to turn toggle ON
**Expected**: Page reloads, website becomes focused (blocking content)

### 2. ENABLED_FOCUSED → ENABLED_UNFOCUSED  
**Setup**: Website has toggle ON and is focused
**Action**: Use popup to turn toggle OFF  
**Expected**: Instant unfocus (no reload), content becomes visible

### 3. ENABLED_UNFOCUSED → ENABLED_FOCUSED
**Setup**: Website has toggle ON but unfocused
**Action**: Use popup to turn toggle ON
**Expected**: Instant focus (no reload), content becomes blocked

### 4. ENABLED → DISABLED (Complete Off)
**Setup**: Website has toggle ON (any focus state)
**Action**: Use popup to completely disable website
**Expected**: Instant cleanup, all functionality stops

## Debug Logs to Watch For:
- `transitioning from DISABLED to ENABLED, triggering reload`
- `switching to FOCUSED mode` 
- `switching to DISABLED, cleaning up controller`
- `Detected reload after enabling [website] from disabled state`