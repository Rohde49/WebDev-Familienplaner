FROM node:20-alpine

WORKDIR /app

# Dependencies zuerst für Cache
COPY package.json package-lock.json ./
RUN npm ci

# Restlicher Code
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
