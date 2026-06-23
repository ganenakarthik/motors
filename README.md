# GreenGram — Waste, Reimagined

An immersive, scroll-driven product experience for **GreenGram**, a concept smart bin designed to make waste segregation feel intelligent, tangible, and a little cinematic.

The site tells the product story through a real-time 3D bin, ambient UI, and motion-rich chapters: from the cost of contamination to a connected circular-economy future.

![GreenGram product visual](src/assets/hero.png)

## What’s inside

- A scroll-synchronised, real-time 3D smart-bin scene built with React Three Fiber
- Animated lid movement, LED glow, cinematic lighting, bloom, and camera choreography
- Smooth scrolling and chapter transitions powered by Lenis, GSAP, and Framer Motion
- A dark, editorial interface with glass panels, telemetry widgets, film grain, and a custom cursor trail
- Fully responsive landing-page experience, built with React, TypeScript, Vite, and Tailwind CSS

## The idea

GreenGram imagines a dual-chamber bin that separates wet organics from dry recyclables at the source. The experience explores the product’s hardware, sensor-driven measurements, user incentives, and potential for a city-scale waste network.

> This repository is a front-end concept/prototype. The hardware data, telemetry, and rewards shown in the experience are illustrative.

## Tech stack

| Area | Tools |
| --- | --- |
| App | React 19, TypeScript, Vite |
| 3D | Three.js, React Three Fiber, Drei |
| Motion | Framer Motion, GSAP + ScrollTrigger, Lenis |
| Visual effects | React Three Postprocessing, Bloom |
| Styling | Tailwind CSS |

## Run it locally

**Prerequisites:** Node.js 20+ and npm.

```bash
git clone https://github.com/ganenakarthik/motors.git
cd motors
npm install
npm run dev
```

Vite will print the local URL (usually `http://localhost:5173`).

## Useful commands

```bash
npm run dev      # start the development server
npm run build    # type-check and build for production
npm run preview  # preview the production build
npm run lint     # run ESLint
```

## Project structure

```text
src/
├── App.tsx                     # Scroll-story, layout, and motion chapters
├── components/
│   ├── SmartBin.tsx            # The 3D dual-chamber bin model
│   ├── SmartBinScene.tsx       # Scroll-to-3D scene choreography
│   └── CustomCursor.tsx        # Cursor and particle-trail interaction
└── assets/                     # Project visuals
```

## Experience notes

For the full effect, view on a desktop or laptop with hardware acceleration enabled. The scene is still responsive, but the custom cursor and dense visual layers are deliberately designed for a pointer-driven screen.

## License

No license has been specified yet. All rights reserved unless the project owner adds a license file.
 
 Made by "Rex"