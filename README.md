# JETSETR

Cinematic one-page travel site: a 500vh scroll-scrubbed video hero (WebCodecs frame bank with `video.currentTime` fallback), followed by About, Services, Destinations and a multi-type enquiry form (General / Destination / Cruise / Corporate & MICE).

```bash
npm install
npm run dev
```

Enquiry submissions POST as JSON to `VITE_ENQUIRY_ENDPOINT` (e.g. Formspree) if set in `.env`; otherwise they are logged to the console.
