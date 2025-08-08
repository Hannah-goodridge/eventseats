# Simple Embedding Guide

The Show Bookings System can be easily embedded into external websites using simple HTML iframes. No complex APIs or JavaScript required!

## Quick Start

```html
<iframe src="https://your-booking-system.com/embed/SHOW_ID/PERFORMANCE_ID"
        width="800"
        height="600"
        frameborder="0"
        style="border: 1px solid #ddd; border-radius: 8px;">
</iframe>
```

Just replace `SHOW_ID` and `PERFORMANCE_ID` with the actual IDs from your system.

## Getting Show and Performance IDs

1. Go to your booking system admin
2. View the show you want to embed
3. Copy the IDs from the URL or show details
4. Or use: `GET /api/shows` to list all shows and performances

## Responsive Embedding

For mobile-friendly embedding:

```html
<div style="position: relative; width: 100%; height: 0; padding-bottom: 75%; overflow: hidden; border: 1px solid #ddd; border-radius: 8px;">
    <iframe src="https://your-booking-system.com/embed/SHOW_ID/PERFORMANCE_ID"
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;">
    </iframe>
</div>
```

## WordPress Integration

Add this to any WordPress post/page using an HTML block:

```html
<h3>Book Your Tickets</h3>
<iframe src="https://your-booking-system.com/embed/SHOW_ID/PERFORMANCE_ID"
        width="100%"
        height="600"
        frameborder="0"
        style="border: 1px solid #ddd; border-radius: 8px; max-width: 800px;">
</iframe>
```

## Full Example

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Tickets - Hamlet</title>
</head>
<body>
    <header>
        <h1>Shakespeare's Hamlet</h1>
        <p>March 15, 2024 at 8:00 PM</p>
    </header>

    <main>
        <section>
            <h2>Book Your Tickets Now</h2>
            <iframe src="https://your-booking-system.com/embed/hamlet-2024/march-15-8pm"
                    width="800"
                    height="600"
                    frameborder="0"
                    style="border: 1px solid #ddd; border-radius: 8px; max-width: 100%;">
            </iframe>
        </section>
    </main>
</body>
</html>
```

## Benefits

✅ **Simple** - Just copy/paste HTML
✅ **No JavaScript required** - Works everywhere
✅ **Secure** - Uses your existing secure booking system
✅ **Mobile-friendly** - Responsive design
✅ **Open Source** - No proprietary dependencies
✅ **Fast** - No extra scripts to load

## Technical Details

- Uses existing `/api/shows` and `/api/bookings` endpoints
- Proper iframe security headers configured
- CORS enabled for cross-origin embedding
- Works with any website, CMS, or platform
- No API keys or complex setup required

## That's It!

Your open-source booking system now supports embedding without any complex APIs or dependencies. Just share this guide with your users!