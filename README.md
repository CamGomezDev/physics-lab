# physics-lab

This is a web application for simulating mechanical physics in 2D. The deployed app is a static site served from `public/`, and all of the graphics are handled by p5.js. The physics engine and all of the physics calculations were written by me. The main file from which all of the calculations and physics parts are being handled is `public/js/main.js`.

The main app can be accessed at [physicslab.io](https://physicslab.io/).

<p align="center">
  <img src="https://github.com/CamGomezDev/physics-lab/blob/master/img/git.gif">
</p>

To begin the interaction you must only press the buttons on the upper right like Mass or Incline and add them to the world (by clicking any part of the grid). You can toggle on thinks like gravity or the floor. Then just press Play on the bottom right. The code is not very commented.

This was done to participate on the Google Science Fair.

## AWS Amplify deployment

This repository includes an [`amplify.yml`](./amplify.yml) file so AWS Amplify Hosting deploys the static files in `public/` directly.

- Build output directory: `public`
- Build command: no app build is required
- Runtime: static hosting only, no Node/Express server is needed in Amplify

If you connect this repository to Amplify Hosting, it should deploy without additional build configuration. The current app does not require a rewrite rule because it is served from a single static entry point and does not use client-side routed paths.
