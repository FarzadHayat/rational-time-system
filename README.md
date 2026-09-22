# Rational Time System (RTS)

A modern, synchronized dashboard for the Rational Time System—a universal, timezone-free decimal time protocol and 13-month calendar.

Live at: [https://rts.farzadhayat.dev](https://rts.farzadhayat.dev)

## Features

- **Decimal Clock:** Tracks global standard time, where a day is divided into 10 hours, each containing 100 minutes, and each minute containing 100 seconds.
- **13-Month Calendar:** A precise calendar containing 13 equal months of exactly 28 days each, leaving one extra day per year as a Global Holiday.
- **Real-time Daylight Globe:** A fully interactive 3D globe showing the current terminator line (day/night boundary) and the exact sun position synced to real time.
- **RTS-to-Gregorian Converter:** Instantly click any day on the RTS calendar to see its exact standard Gregorian equivalent.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- [React Globe (WebGL/ThreeJS)](https://github.com/vasturiano/react-globe.gl)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

## Getting Started

First, install dependencies:
```bash
pnpm install
```

Then, run the development server:
```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
