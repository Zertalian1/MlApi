FROM node:alpine


EXPOSE 3000
COPY ./ ./
RUN npm install
RUN npm install yup
RUN npm install formik
CMD ["npm", "run", "dev"]