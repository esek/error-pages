# 🚫 Error pages

Trying to collect all the 404s, 403s, 500s, etc. for the .esek domain in one place.

## How it works

The pages are build statically using [`Astro`](https://astro.build/). These are then hosted using [`nginx`](https://www.nginx.com/). And used as error pages using [`traefik`](https://traefik.io/).

Build all the pages with `pnpm build`. This will build the pages in the `dist` folder. The dist folder is then used in the Dockerfile in conjunction with `nginx` to serve the pages.

### Static assets

The `public` directory contains all the static assets. These are copied to the `dist` folder when building the pages.

> Note that these all have to be in the `/public/assets` folder. This is due to the `nginx` mapping that path to the `/assets` path.

### Nginx config

The `nginx` config is generated based on the status pages in the `dist` folder. This is done using the `scripts/nginx-conf.js` file. This file is run when building the Docker image.
