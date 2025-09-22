# Focus Extension Test Suite

## Test Environment Setup
1. Load extension in Chrome developer mode
2. Open browser console (F12) 
3. Navigate to YouTube or LinkedIn
4. Use popup and keypress to trigger state changes
5. Monitor console logs for state transitions

---

## 📋 Test Scenarios

### ✅ Test 1: DISABLED → ENABLED (Reload Required)
**Setup:**
1. Open popup, turn OFF YouTube toggle 
2. Navigate to YouTube (should load normally, no blocking)
3. Verify in console: `"Detected website: Youtube (disabled) - no controller initialized"`

**Action:** 
- Open popup, turn ON YouTube toggle

**Expected Results:**
- Console: `"youtube - transitioning from DISABLED to ENABLED, triggering reload"`
- Page reloads automatically
- After reload, console: `"Detected reload after enabling youtube from disabled state"`
- After reload, console: `"Detected website: Youtube (enabled) - controller initialized"`
- Content should be blocked (focused mode active)
- Popup switch shows loading for 2.5 seconds

---

### ✅ Test 2: ENABLED_FOCUSED → DISABLED (Instant)
**Setup:**
1. YouTube is enabled and blocking content (focused mode)
2. Verify console: `"Website controller initialized and ready"`
3. Verify content is blocked

**Action:**
- Open popup, turn OFF YouTube toggle

**Expected Results:**
- Console: `"youtube - transitioning from ENABLED to DISABLED, cleaning up controller"`
- NO page reload
- Content immediately becomes visible
- Popup switch shows loading for 350ms only
- Extension functionality completely stops

---

### ✅ Test 3: ENABLED_UNFOCUSED → DISABLED (Instant)
**Setup:**
1. YouTube is enabled but not blocking content (unfocused mode)
2. Use Shift+Shift to ensure unfocused state
3. Verify content is visible but extension is active

**Action:**
- Open popup, turn OFF YouTube toggle

**Expected Results:**
- Console: `"youtube - transitioning from ENABLED to DISABLED, cleaning up controller"`
- NO page reload
- Extension functionality stops
- Popup switch shows loading for 350ms only

---

### ✅ Test 4: FOCUSED ↔ UNFOCUSED via Keypress (Instant)
**Setup:**
1. YouTube is enabled (`websiteToggles.youtube = true`)
2. Controller is active

**Action:**
- Press Shift+Shift repeatedly

**Expected Results:**
- Instant switching between focused (blocked) and unfocused (visible) content
- Console logs showing mode changes
- NO storage changes to `websiteToggles`
- NO page reloads
- Popup toggle position should NOT change

---

### ✅ Test 5: DISABLED → ENABLED → DISABLED (Mixed)
**Setup:**
1. Start with YouTube disabled

**Actions:**
1. Popup toggle ON (should reload)
2. After reload, popup toggle OFF (should instantly disable)

**Expected Results:**
1. **First action**: Page reload, controller initialized, focused mode
2. **Second action**: Instant cleanup, no reload, extension stops

---

## 🔍 Debug Log Patterns to Watch For

### Successful DISABLED → ENABLED:
```
youtube - transitioning from DISABLED to ENABLED, triggering reload
[PAGE RELOADS]
Detected reload after enabling youtube from disabled state  
Detected website: Youtube (enabled) - controller initialized
```

### Successful ENABLED → DISABLED:
```
youtube - transitioning from ENABLED to DISABLED, cleaning up controller
[NO RELOAD]
```

### Successful Keypress Toggle:
```
Focus mode changed [no mention of reload or storage]
[NO RELOAD]
```

---

## ❌ Red Flags (Should NOT Happen)
- Page reload on keypress toggle
- Page reload when going ENABLED → DISABLED  
- Storage changes during keypress toggle
- Missing controller initialization after DISABLED → ENABLED reload
- Multiple reloads in succession
- Loading indicator showing wrong duration (2.5s vs 350ms)

---

## 🛠 Debugging Commands
```javascript
// Check current storage state
browser.storage.local.get(['websiteToggles', 'appState', 'pendingReload', 'websiteLoading'])

// Check current controller state (run in content script context)
console.log('Controller:', websiteController ? 'exists' : 'null')
console.log('Current website:', Website[currentWebsite])
console.log('State manager:', stateManager ? 'exists' : 'null')
```