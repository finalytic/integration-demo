FROM node:18-bullseye-slim as build
WORKDIR /app

COPY src ./src
COPY dist ./dist
COPY package.json ./

RUN sed -i 's/devDependencies/ignore/g' package.json
RUN sed -i 's/optionalDependencies/ignore/g' package.json
RUN npm install --omit dev --omit optional

FROM node:18-bullseye-slim as main
RUN apt update && apt install -y ca-certificates
COPY --from=build /app /
ENV NODE_ENV=production
CMD ["npm", "start"]
