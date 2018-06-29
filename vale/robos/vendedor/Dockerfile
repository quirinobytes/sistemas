# specify the node base image with your desired version node:<version>
FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY datafiles/cotacoes-v.json /root/workspace/bolsa-systems/blueMoney/backEnd/robos/vendedor/datafiles/cotacoes-v.json
COPY cotacoes-v.json /root/workspace/bolsa-systems/blueMoney/backEnd/robos/datafiles/
COPY forever.sh /usr/bin/forever.sh
RUN npm install -g

RUN ln -s /usr/local/bin/node /usr/bin/node

COPY . .

CMD [ "npm", "start" ]
