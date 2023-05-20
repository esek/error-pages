import fs from 'fs/promises';

const DIST_PATH = './dist';

const buildNginxConf = (errorPages) => `server {
    listen 80;
    index index.html;
    server_name localhost;
    root /usr/share/nginx/html;

    ${errorPages}

    location /testing {
        fastcgi_pass unix:/does/not/exist;
    }
}
`;

const filterFiles = (files) => {
  // status code files are either xxx.html or xxx/index.html
  const regex = /(\d{3})(?:.html|$)$/;
  return files
    .filter((file) => regex.test(file))
    .map((file) => {
      const [, match] = file.match(regex);

      return {
        statusCode: match,
        isDirectory: !file.endsWith('.html'),
      };
    });
};

const readFileNames = async () => {
  const res = await fs.readdir(DIST_PATH);
  return filterFiles(res);
};

const generateNginxConf = async () => {
  const files = await readFileNames();
  const errorPages = files
    .map(({ statusCode, isDirectory }) => {
      const location = isDirectory
        ? `/${statusCode}/index.html`
        : `/${statusCode}.html`;
      return `error_page ${statusCode} ${location};`;
    })
    .join('\n');

  const locations = files
    .map(({ statusCode, isDirectory }) => {
      const location = isDirectory
        ? `/${statusCode}/index.html`
        : `/${statusCode}.html`;

      return `location = ${location} {
            root /usr/share/nginx/html;
            internal;
        }`;
    })
    .join('\n');

  const nginxConf = buildNginxConf(errorPages + '\n' + locations);

  console.log(nginxConf);
};

generateNginxConf();
