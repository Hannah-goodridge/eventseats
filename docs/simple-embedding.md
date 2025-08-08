# EventSeats Embedding Guide

EventSeats can be easily embedded into any website using a simple iframe. No complex APIs or JavaScript required!

## How It Works

1. **Your booking system** runs as normal at `https://your-domain.com`
2. **Embed pages** are available at `https://your-domain.com/embed/[showId]/[performanceId]`
3. **External websites** embed these pages using simple HTML iframes

## For Your Customers (Theatre Groups/Venues)

### Basic Embed Code
```html
<iframe src="https://eventseats.hannahgoodridge.dev/embed/SHOW_ID/PERFORMANCE_ID"
        width="800"
        height="600"
        frameborder="0"
        style="border: 1px solid #ddd; border-radius: 8px;">
</iframe>
```

### Responsive Embed Code
```html
<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%; overflow: hidden;">
    <iframe src="https://your-booking-system.com/embed/SHOW_ID/PERFORMANCE_ID"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;">
    </iframe>
</div>
```

## Getting Show and Performance IDs

1. Go to your booking system
2. Navigate to the show you want to embed
3. The URL will be: `/book/SHOW_ID/PERFORMANCE_ID`
4. Use those same IDs in the embed URL: `/embed/SHOW_ID/PERFORMANCE_ID`

## Examples

### WordPress
Add to any post/page using HTML block:
```html
<h3>Book Tickets Now</h3>
<iframe src="https://your-booking-system.com/embed/hamlet-2024/march-15-8pm"
        width="100%"
        height="600"
        frameborder="0"
        style="border: 1px solid #ddd; border-radius: 8px;">
</iframe>
```

### Any Website
```html
<!DOCTYPE html>
<html>
<head>
    <title>Book Tickets - Hamlet</title>
</head>
<body>
    <h1>Shakespeare's Hamlet</h1>
    <p>March 15, 2024 at 8:00 PM</p>

    <iframe src="https://your-booking-system.com/embed/hamlet-2024/march-15-8pm"
            width="800"
            height="600"
            frameborder="0"
            style="border: 1px solid #ddd; border-radius: 8px;">
    </iframe>
</body>
</html>
```

## That's It!

No complex setup, no API keys, no JavaScript required. Just copy, paste, and update the show/performance IDs.

## Technical Details

- **Secure**: Uses HTTPS and proper iframe security headers
- **Mobile-friendly**: Responsive design works on all devices
- **Fast**: No extra JavaScript to load
- **Simple**: Just HTML - works anywhere
- **Open Source**: No proprietary code or complex dependencies

## Benefits for Your Customers

1. **Easy to implement** - Just copy/paste HTML
2. **Works everywhere** - Any website, CMS, or platform
3. **Professional looking** - Clean, branded booking interface
4. **Secure** - All payments processed on your secure system
5. **No technical knowledge required** - Simple HTML

This makes your open-source booking system much more valuable to potential users!
