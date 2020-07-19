FROM node:12.18

COPY build roadey/build/
COPY node_modules roadey/node_modules/
COPY tenacious-text-279818-efd74155cec4.json roadey/

CMD npm run deploy --prefix roadey/build