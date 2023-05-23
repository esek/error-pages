import fs from 'fs/promises';

const DIST_PATH = './dist';

const buildNginxConf = (errorPages, locations) => `server {
    listen 80 default_server;
    root /usr/share/nginx/html;

    ${errorPages}

    ${locations}
    
    location / {
      return 404;
  }

  # Static assets
  location /assets {
    alias /usr/share/nginx/html/assets;
  }

  location /_astro {
    alias /usr/share/nginx/html/_astro;
  }
}
`;

const filterFiles = (files) => {
  // status code files are all xxx.html
  const regex = /(\d{3}).html$/;

  return files
    .filter((file) => regex.test(file))
    .map((file) => {
      const [, match] = file.match(regex);

      return match;
    });
};

const readFileNames = async () => {
  const res = await fs.readdir(DIST_PATH);
  return filterFiles(res);
};

const generateNginxConf = async () => {
  const files = await readFileNames();
  const errorPages = files
    .map((statusCode) => `error_page ${statusCode} /${statusCode}.html;`)
    .join('\n    ');

  const locations = files
    .map(
      (statusCode) => `location /${statusCode}.html {
      internal;
}`
    )
    .join('\n    ');

  const nginxConf = buildNginxConf(errorPages, locations);

  console.log(nginxConf);
};

generateNginxConf();
