# Cybersecurity Dashboard

## Overview
This project is a **Cybersecurity Dashboard** built using **React** for the frontend and **Node.js/Express** for the backend. The application monitors incoming requests, blocks IPs exhibiting suspicious behavior, and provides real-time updates on server status and blocked IPs. The project also includes a simulated DoS attack to demonstrate rate-limiting and failover mechanisms.

---

## Features
- **Rate Limiting**: Automatically blocks IPs exceeding request limits.
- **IP Blocking**: Logs and blocks IPs violating request policies.
- **Failover Mechanism**: Switches between primary and secondary servers during downtime.
- **Real-Time Updates**: Updates the frontend with new blocked IPs and server status using **Socket.IO**.
- **Request Logging**: Tracks all incoming requests with metadata such as IP, endpoint, and server status.
- **DoS Attack Simulation**: Demonstrates rate-limiting capabilities via simulated Denial-of-Service (DoS) attacks.

---

## Technology Stack
### Frontend
- **React**
- **Axios** for API communication
- **Socket.IO Client** for real-time updates

### Backend
- **Node.js**
- **Express** for server setup
- **Socket.IO** for real-time communication
- **MongoDB** for storing logs and blocked IPs
- **Express Rate-Limit** for rate limiting
- **geoip-lite** for IP location services
- **Morgan** for HTTP request logging

---

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally
- Ngrok (for exposing local server)

### Backend Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure MongoDB:
   Ensure MongoDB is running on `mongodb://127.0.0.1:27017/cybersecurity`. You can change this in `server.js` if needed.

4. Start the server:
   ```bash
   node server.js
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Expose Local Server
1. Use **Ngrok** to expose the backend:
   ```bash
   ngrok http 5000
   ```
2. Update the `BASE_URL` in both frontend and backend files with the Ngrok URL.

---

## Project Structure

### Backend
```
backend/
├── models/
│   ├── BlockedIP.js        # Schema for blocked IPs
│   └── RequestLog.js       # Schema for request logs
├── middlewares/
│   └── ipSpoofingDetection.js  # Middleware for detecting spoofing
├── server.js               # Main server file
```

### Frontend
```
frontend/
├── src/
│   ├── App.js              # Main React Component
│   ├── styles.js           # Centralized styles
│   └── components/         # Reusable React components
```

---

## Usage

### Dashboard Features
- View **blocked IPs** and their timestamps.
- Monitor **request logs** with details such as IP, endpoint, and method.
- Observe real-time **server status** updates during failovers.

### Simulate DoS Attack
1. Click **"Start DoS Attack"** on the frontend.
2. Observe blocked IPs and server status changes in real time.

---

## APIs
### Public Endpoints
- **GET `/api/resource`**  
  Rate-limited resource endpoint. Demonstrates failover handling.
- **GET `/api/logs`**  
  Retrieves all request logs.
- **GET `/api/blocked-ips`**  
  Retrieves all blocked IPs.

---

## Real-Time Events
- **`blocked-ip`**  
  Emits newly blocked IPs to connected clients.
- **`server-switch`**  
  Emits server status changes (Primary/Secondary).

---



## Future Improvements
- Add **authentication** for accessing the dashboard.
- Integrate **IP Geolocation** to show location data on the dashboard.
- Enhance **failover mechanism** for distributed systems.
