# Focus Extension Logic Analysis

## Current Implementation Issues

### Popup Behavior:
- `websiteToggles.linkedin/youtube` = `true` means "website functionality enabled" 
- `websiteToggles.linkedin/youtube` = `false` means "website functionality disabled"
- `isDisabledToEnabled` correctly detects `false → true` transitions

### Focus.ts Interpretation:
- When `isEnabled = true`: Should be FOCUSED mode (blocking content)
- When `isEnabled = false`: Should be UNFOCUSED mode (not blocking content)

## The Problem:
There's a semantic mismatch. The popup treats the toggle as "enabled/disabled" but focus.ts treats it as "focused/unfocused".

## Correct Behavior Should Be:
1. **DISABLED** (`websiteToggles = false`): No content script, no functionality
2. **ENABLED** (`websiteToggles = true`): Content script active, can be focused or unfocused

## Solution:
The popup toggle should control whether the website functionality is enabled/disabled, NOT focused/unfocused.
Focus/unfocus should be controlled by keypress or a separate mechanism.

## Test Scenarios to Validate:

### Scenario 1: DISABLED → ENABLED (Reload Required)
- **Initial**: `websiteToggles.youtube = false`, no content script
- **Action**: Popup toggle ON → `websiteToggles.youtube = true`
- **Expected**: Page reloads, content script initializes, website becomes FOCUSED

### Scenario 2: ENABLED_FOCUSED → DISABLED (Instant)
- **Initial**: `websiteToggles.youtube = true`, controller exists, mode = FOCUSED
- **Action**: Popup toggle OFF → `websiteToggles.youtube = false`  
- **Expected**: Instant unfocus + cleanup, no reload

### Scenario 3: ENABLED_UNFOCUSED → DISABLED (Instant)
- **Initial**: `websiteToggles.youtube = true`, controller exists, mode = UNFOCUSED
- **Action**: Popup toggle OFF → `websiteToggles.youtube = false`
- **Expected**: Instant cleanup, no reload

### Scenario 4: FOCUSED ↔ UNFOCUSED via Keypress (Instant)
- **Initial**: `websiteToggles.youtube = true`, controller exists
- **Action**: Shift+Shift keypress
- **Expected**: Instant toggle between FOCUSED/UNFOCUSED, no storage change

### Scenario 5: DISABLED → ENABLED → DISABLED (Mixed)
- **Initial**: `websiteToggles.youtube = false`
- **Action 1**: Toggle ON → Should reload
- **Action 2**: After reload, toggle OFF → Should instantly disable