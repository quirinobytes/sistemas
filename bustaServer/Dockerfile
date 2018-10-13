# FROM ubuntu:18.04
FROM node:4.9.1-alpine

WORKDIR /usr/src/app

#RUN rmdir /usr/src/app/node_modules
COPY . .
COPY server/ /server/
COPY hosts /etc/hosts

ENV DATABASE_URL=postgres://bustaeos:PASSWORD@172.17.0.1/bustaeosdb
ENV BIP32_DERIVED_KEY=xprv9s21ZrQH143K2JF8RafpqtKiTbsbaxEeUaMnNHsm5o6wCW3z8ySyH4UxFVSfZ8n7ESu7fgir8imbZKLYVBxFPND1pniTZ81vKfd45EHKX73 
RUN echo bip_var $BIP32_DERIVED_KEY
RUN npm install
RUN npm install gulp
#RUN gulp build

EXPOSE 3841

CMD ["npm", "start"]

