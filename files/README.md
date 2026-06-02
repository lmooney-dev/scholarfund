# ScholarFund Landing Page — Setup Guide

You have three files: `index.html`, `styles.css`, `script.js`. All you need.

## Quick Preview (30 seconds)

1. Download all three files into the same folder
2. Double-click `index.html`
3. It opens in your browser — that's your site

Works offline. No server needed.

## Going Live (Free, 5 Minutes)

**Easiest path: Netlify Drop**

1. Go to https://app.netlify.com/drop
2. Drag the entire folder containing all 3 files onto the page
3. Get a live URL instantly like `https://amazing-name-12345.netlify.app`
4. Share that link

Free forever for this kind of site. Add a custom domain later (from Namecheap) for $12/year.

**Alternative: Vercel** (also free) at https://vercel.com/new — works the same way.

## Make the Waitlist Form Actually Work (2 Minutes)

The form is currently set up but needs a Formspree ID to actually email you submissions.

1. Go to https://formspree.io and create a free account
2. Click "New Form" — name it "ScholarFund Waitlist"
3. Enter your email (where signups should be sent)
4. Copy the form ID (looks like `xrgjkqwe` — 8 random characters)
5. Open `index.html` in any text editor
6. Find this line:
   ```
   <form id="signup-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
7. Replace `YOUR_FORM_ID` with your actual form ID
8. Save and re-upload to Netlify

Free Formspree gives you 50 submissions/month — way more than you need at this stage.

## Editing the Site

**Want to change copy?** Open `index.html` in any text editor (TextEdit on Mac, Notepad on Windows, VS Code if you have it). Find the text, edit it, save. Refresh your browser.

**Want to change colors?** Open `styles.css`. At the top there's a `:root` section with all the colors. Change the hex codes.

**Want to add a section?** Copy an existing `<section>` block in the HTML, edit the content. The CSS will already style it.

## Connecting Your Domain

When you buy `scholarfund.com` (or whatever name you choose) from Namecheap:

1. In Netlify, go to your site → Domain settings → Add custom domain
2. Netlify gives you DNS records to point your domain at
3. In Namecheap, paste those records into your domain's DNS settings
4. Wait 10-60 minutes for it to propagate
5. Done — your site is at your real domain

## Important Notes

- The counter numbers start at student=12, parent=8, investor=15 (so it doesn't look like you have zero signups when you launch). Change these in `script.js` at the top under `STARTING`.
- Counters update locally per browser. For real cross-browser tracking, you'll need a real backend later. Fine for now.
- All form submissions land in your email via Formspree once set up.

## Files in This Folder

- `index.html` — the page structure
- `styles.css` — all the styling
- `script.js` — interactive features (calculator, modal, form)
- `README.md` — this file

That's it. You own all of this. Edit freely.
