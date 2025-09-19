# Build stage for backend
FROM python:3.10 as backend

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

# Build stage for frontend
FROM node:18-alpine as frontend

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Final stage
FROM python:3.10-slim

# Install Node.js for running the frontend
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Copy backend from backend stage
WORKDIR /app
COPY --from=backend /app /app

# Copy frontend from frontend stage
WORKDIR /usr/src/app
COPY --from=frontend /usr/src/app /usr/src/app

# Install frontend dependencies
RUN npm ci --only=production

# Expose ports
EXPOSE 8000 4000

# Create startup script
RUN echo '#!/bin/bash\n\
# Start backend\n\
cd /app && uvicorn app.main:app --host 0.0.0.0 --port 8000 &\n\
\n\
# Start frontend\n\
cd /usr/src/app && npm start &\n\
\n\
# Wait for any process to exit\n\
wait -n\n\
\n\
# Exit with status of process that exited first\n\
exit $?' > /usr/local/bin/start.sh

RUN chmod +x /usr/local/bin/start.sh

CMD ["/usr/local/bin/start.sh"]