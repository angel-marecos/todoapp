# pull oficial base image
FROM node:13.12.0

# set working directory
WORKDIR /usr/src/app

# installl app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# add app
COPY . ./

# start app
CMD ["npm", "start"]