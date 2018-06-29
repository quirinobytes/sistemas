# specify the node base image with your desired version node:<version>
FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install -g

#RUN npm install crawler-js 
COPY dataMining /root/workspace/bolsa-systems/blueMoney/dataMining/
RUN ln -s /usr/local/bin/node /usr/bin/node

#RUN rm /root/workspace/bolsa-systems/blueMoney/dataMining/node_modules

RUN mkdir /root/workspace/bolsa-systems/blueMoney/csv/all -p

RUN ln -s /usr/src/app/node_modules /root/workspace/bolsa-systems/blueMoney/dataMining/node_modules

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]




######################
#CMD [ "npm", "load" ]
#ENTRYPOINT ["/root/workspace/bolsa-systems/blueMoney/dataMining/mining.sh"]
#RUN ping www.google.com.br
#RUN git clone https://github.com/quirinobytes/workspace.git
#RUN ls -la
#ENTRYPOINT ["node","bolsa.js"]
