FROM node:20-alpine

WORKDIR /app

# Copy root configurations
COPY package*.json ./
COPY tsconfig.base.json ./

# Copy api workspace and dependencies
COPY apps/api ./apps/api
COPY packages/types ./packages/types
COPY packages/ai-engine ./packages/ai-engine

# Install dependencies for workspace
RUN npm install

# Generate Prisma Client
RUN cd apps/api && npx prisma generate

# Build API
RUN npm run build --workspace=apps/api

EXPOSE 3001

CMD ["npm", "start", "--workspace=apps/api"]
