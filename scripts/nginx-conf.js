import fs from 'fs/promises';

const DIST_PATH = './dist';

const buildNginxConf = (errorPages) => `server {
    listen 80;
    server_name localhost;

    ${errorPages}
    
    location / {
      root  /usr/share/nginx/html;
      internal;
  }
}
`;

const filterFiles = (files) => {
  // status code files are all xxx-page.html
  const regex = /(\d{3})-page.html$/;

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
    .map((statusCode) => `error_page ${statusCode} ${statusCode}-page.html;`)
    .join('\n    ');

  // const locations = files
  //   .map(({ statusCode, isDirectory }) => {
  //     const location = isDirectory
  //       ? `/${statusCode}/index.html`
  //       : `/${statusCode}.html`;

  //     return `location = ${location} {
  //           root /usr/share/nginx/html;
  //           internal;
  //       }`;
  //   })
  //   .join('\n');

  const nginxConf = buildNginxConf(errorPages);

  console.log(nginxConf);
};

generateNginxConf();
