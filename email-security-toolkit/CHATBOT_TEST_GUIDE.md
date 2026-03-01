# Chatbot Testing Guide

## Quick Test Steps

### 1. Test API Error Handling

#### Test Missing API Key
1. Remove or comment out `VITE_ANTHROPIC_API_KEY` in `.env`
2. Restart dev server: `npm run dev`
3. Open app, run a domain check
4. Click "Ask AI" button
5. Type a question and send
6. **Expected:** Error message: "⚠️ API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file to enable AI features."

#### Test Invalid API Key
1. Set `VITE_ANTHROPIC_API_KEY=invalid_key` in `.env`
2. Restart dev server
3. Send a message in chatbot
4. **Expected:** Error message: "⚠️ Invalid API key. Please check your VITE_ANTHROPIC_API_KEY configuration."

#### Test Network Error (Simulated)
1. Disconnect from internet
2. Send a message in chatbot
3. **Expected:** Error message: "⚠️ Network error. Please check your connection and try again."
4. **Expected:** Automatic retry after 1 second
5. **Expected:** Second retry after 2 seconds
6. **Expected:** Final error if still failing

#### Test Successful Request
1. Add valid API key to `.env`
2. Restart dev server
3. Send a message: "What is SPF?"
4. **Expected:** AI responds with explanation
5. **Expected:** No errors in console

### 2. Test Responsiveness

#### Desktop (1440px+)
1. Open browser at full width
2. Click "Ask AI"
3. **Expected:** Modal centered with max-width 600px
4. **Expected:** Margins on both sides
5. Send a long message with no spaces: "thisisaverylongmessagewithnospacestotesttextwrapping"
6. **Expected:** Text wraps correctly, no horizontal scroll

#### Tablet (768px)
1. Resize browser to 768px width
2. **Expected:** Modal width adjusts, still centered
3. **Expected:** Message bubbles max-width 85%
4. **Expected:** All content visible

#### Mobile (640px)
1. Resize to 640px or use mobile device
2. **Expected:** Chatbot goes fullscreen
3. **Expected:** No border radius
4. **Expected:** Input font-size is 16px (prevents iOS zoom)
5. **Expected:** Close button is 44x44px

#### Small Mobile (480px)
1. Resize to 480px
2. **Expected:** Smaller avatar (32px)
3. **Expected:** Smaller fonts but still readable
4. **Expected:** Message bubbles max-width 82%

#### Extra Small (360px)
1. Resize to 360px (smallest common phone)
2. **Expected:** All content fits without horizontal scroll
3. **Expected:** Padding is 10px
4. **Expected:** Message bubbles max-width 80%
5. **Expected:** Text is 12px minimum (readable)
6. **Expected:** Close button is 40x40px minimum

### 3. Test Text Wrapping

#### Long Words
1. Send message: "supercalifragilisticexpialidocious"
2. **Expected:** Word breaks correctly
3. **Expected:** No horizontal scroll

#### Long URLs
1. Send message: "https://www.example.com/very/long/path/that/should/wrap/correctly"
2. **Expected:** URL wraps at appropriate points
3. **Expected:** No overflow

#### Mixed Content
1. Send message with long text and emojis
2. **Expected:** Everything wraps correctly
3. **Expected:** Emojis display properly

### 4. Test UI Elements

#### Timestamp Contrast
1. Send a message
2. Check timestamp below message
3. **Expected:** Color is #aaa (light gray)
4. **Expected:** Readable against dark background
5. Use browser DevTools to check contrast ratio
6. **Expected:** Contrast ratio ≥ 4.5:1

#### Typing Indicator
1. Send a message
2. **Expected:** Animated dots appear while AI is thinking
3. **Expected:** Three dots bounce in sequence
4. **Expected:** Dots are cyan color (#00ffff)

#### Header Overflow
1. Resize to 360px
2. **Expected:** Title "AuthGuard AI" visible
3. **Expected:** Subtitle truncates with ellipsis if too long
4. **Expected:** Close button always visible

#### Close Button
1. Test on desktop: hover should change color
2. Test on mobile: button is 44x44px
3. Click/tap close button
4. **Expected:** Chatbot closes smoothly

### 5. Test Input Bar

#### Fixed Position
1. Open chatbot
2. Scroll messages up and down
3. **Expected:** Input bar stays at bottom
4. **Expected:** Input bar doesn't scroll with messages

#### Auto-Scroll
1. Send multiple messages to fill the chat
2. **Expected:** Chat auto-scrolls to show latest message
3. **Expected:** Smooth scroll animation

#### Input Sizing
1. Type a short message
2. **Expected:** Input height is 44px minimum
3. Type a long multi-line message
4. **Expected:** Input expands up to 120px max
5. **Expected:** Scrollbar appears if exceeds 120px

#### iOS Zoom Prevention
1. Test on iOS device or simulator
2. Tap input field
3. **Expected:** No zoom (font-size is 16px)

### 6. Test Error Retry

#### Automatic Retry
1. Simulate transient error (disconnect briefly)
2. Send message
3. **Expected:** Error message: "⚠️ I encountered an error. Retrying..."
4. **Expected:** Retry after 1 second
5. **Expected:** If still fails, retry after 2 seconds
6. **Expected:** If still fails after 2 retries, show final error

#### No Retry for Permanent Errors
1. Remove API key
2. Send message
3. **Expected:** Error about missing API key
4. **Expected:** No retry attempts

### 7. Test Console Logging

#### Error Logging
1. Open browser DevTools console
2. Trigger an error (invalid API key)
3. **Expected:** Console shows `[Chatbot Error]` with:
   - timestamp
   - question
   - error message
   - stack trace
   - retryCount

#### AI Service Logging
1. Trigger API error
2. **Expected:** Console shows `[AI Service Error]` with:
   - timestamp
   - message
   - code
   - name

### 8. Test Accessibility

#### Keyboard Navigation
1. Open chatbot
2. Press Tab key
3. **Expected:** Focus moves to input field
4. Type message and press Enter
5. **Expected:** Message sends
6. Press Escape
7. **Expected:** Chatbot closes

#### Screen Reader (Optional)
1. Enable screen reader (NVDA, JAWS, VoiceOver)
2. Open chatbot
3. **Expected:** Announces "AuthGuard AI, Email Security Assistant"
4. Send message
5. **Expected:** Announces "Loading" during AI response
6. **Expected:** Announces AI response when complete

### 9. Test Touch Interactions (Mobile)

#### Touch Targets
1. Test on touch device
2. **Expected:** All buttons are 44x44px minimum
3. **Expected:** Easy to tap without mistakes

#### Swipe Gestures
1. Try swiping down on chatbot
2. **Expected:** Chatbot doesn't close (no swipe-to-close implemented)

#### Keyboard Behavior
1. Tap input field
2. **Expected:** Keyboard appears
3. **Expected:** Input scrolls into view
4. **Expected:** Messages area shrinks to accommodate keyboard

### 10. Test Safe Area Insets (iOS Notch)

#### iPhone with Notch
1. Test on iPhone X or newer
2. **Expected:** Content respects safe area
3. **Expected:** No content hidden behind notch
4. **Expected:** Input bar above home indicator

---

## Automated Testing Commands

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Expected Console Output (No Errors)

When everything works correctly, you should see:
```
✓ No errors in console
✓ No warnings about API key (if configured)
✓ Smooth HMR updates during development
✓ No horizontal scroll warnings
✓ No layout shift warnings
```

---

## Common Issues & Solutions

### Issue: "API key not configured"
**Solution:** Add `VITE_ANTHROPIC_API_KEY` to `.env` file and restart dev server

### Issue: Horizontal scrolling on mobile
**Solution:** Already fixed - check if using latest code

### Issue: Text not wrapping
**Solution:** Already fixed - check CSS has `word-break: break-word`

### Issue: Input zooms on iOS
**Solution:** Already fixed - input font-size is 16px

### Issue: Close button too small
**Solution:** Already fixed - button is 44x44px minimum

### Issue: Timestamps hard to read
**Solution:** Already fixed - color is #aaa with better contrast

---

## Performance Benchmarks

Expected performance:
- **Initial load:** <1 second
- **Chatbot open:** <200ms
- **Message send:** <100ms (UI update)
- **AI response:** 2-5 seconds (depends on API)
- **Scroll to bottom:** <300ms (smooth)
- **Close chatbot:** <200ms

---

## Browser DevTools Checks

### Network Tab
- Check API requests to `https://api.anthropic.com/v1/messages`
- Verify headers include `x-api-key`
- Check response status codes

### Console Tab
- No errors (except intentional test errors)
- Error logs have proper format
- No memory leaks

### Elements Tab
- Inspect `.chatbot-container` width at different sizes
- Check `.message-bubble` max-width calculations
- Verify `.chatbot-input` font-size is 16px on mobile

### Performance Tab
- No layout thrashing
- Smooth 60fps animations
- No long tasks blocking main thread

---

## Sign-Off Checklist

Before marking as complete:
- [ ] All API error types tested
- [ ] All breakpoints tested (360px, 480px, 640px, 768px, 1024px, 1440px)
- [ ] Text wrapping works for long words and URLs
- [ ] Timestamps have good contrast
- [ ] Typing indicator animates correctly
- [ ] Header doesn't overflow
- [ ] Close button is touch-friendly
- [ ] Input bar stays at bottom
- [ ] Auto-scroll works
- [ ] No horizontal scrolling at any size
- [ ] Retry mechanism works
- [ ] Console logging is detailed
- [ ] No errors in production build
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome
- [ ] Keyboard navigation works
- [ ] Touch targets are 44x44px minimum

---

**Testing Status:** Ready for QA
**Last Updated:** 2026-02-25
