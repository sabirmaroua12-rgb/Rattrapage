# Simple Mobile Authentication App

A beginner-friendly, clean, and fully functional mobile authentication system built with **React Native (Expo)** and a **Node.js/Express** backend powered by **SQLite** and **Sequelize ORM**.

This project was built for a university practical examination, strictly adhering to clean code standards: pure JavaScript (no TypeScript), no manual classes, separated responsibilities, secure password hashing with bcrypt, JWT token authentication, and secure token storage with Expo SecureStore.

---

## Table of Contents
1. [Technologies Used](#1-technologies-used)
2. [Project Structure & File Purpose](#2-project-structure--file-purpose)
3. [Architecture Overview](#3-architecture-overview)
4. [Backend Setup & Running](#4-backend-setup--running)
5. [Mobile Setup & Running](#5-mobile-setup--running)
6. [Configuring the API IP Address](#6-configuring-the-api-ip-address)
7. [API Endpoints Documentation & Examples](#7-api-endpoints-documentation--examples)
8. [Testing Scenarios & Results](#8-testing-scenarios--results)
9. [Oral Examination / Defense Guide (How to Explain to Your Professor)](#9-oral-examination--defense-guide)

---

## 1. Technologies Used

### Backend:
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Fast, minimalist web framework for building REST APIs.
- **SQLite3**: Lightweight file-based relational database.
- **Sequelize ORM**: Object-Relational Mapping library to interact with SQLite using JavaScript objects.
- **bcryptjs**: Password hashing library using the salted Blowfish cipher.
- **jsonwebtoken (JWT)**: Generates and verifies secure signed authentication tokens.
- **dotenv**: Loads environment variables from `.env`.
- **cors**: Enables Cross-Origin Resource Sharing for mobile client access.

### Mobile:
- **React Native & Expo**: Framework for building native mobile applications using React.
- **JavaScript (ES6+)**: Clean, standard JavaScript without TypeScript complexity.
- **Axios**: HTTP client with request interceptors to automatically attach JWT Bearer tokens.
- **Zustand**: Lightweight global state management for user authentication data.
- **Expo SecureStore**: Encrypted, keychain-backed persistent storage for the JWT token.
- **React Navigation (Native Stack)**: Declarative screen navigation with authentication guards.

---

## 2. Project Structure & File Purpose

```
simple-auth-app/
│
├── backend/
│   ├── config/
│   │   └── database.js          # Configures SQLite connection with Sequelize
│   ├── models/
│   │   └── User.js              # Defines the User table schema (id, name, email, password)
│   ├── controllers/
│   │   └── authController.js    # Logic for register, login, and fetching users
│   ├── routes/
│   │   ├── authRoutes.js        # Maps POST /register and POST /login
│   │   └── userRoutes.js        # Maps GET /users (protected)
│   ├── middleware/
│   │   └── authMiddleware.js    # Verifies JWT token in incoming requests
│   ├── .env.example             # Template for required environment variables
│   ├── .env                     # Local environment variables (PORT, JWT_SECRET)
│   ├── .gitignore               # Ignores node_modules, database.sqlite, .env
│   ├── package.json             # Backend dependencies and scripts
│   ├── server.js                # Server entry point, middleware setup, DB sync
│   └── test-api.js              # Automated test script for all 8 test scenarios
│
├── mobile/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── RegisterScreen.js # Form to register name, email, and password
│   │   │   ├── LoginScreen.js    # Form to sign in with email and password
│   │   │   ├── HomeScreen.js     # User dashboard with greeting and logout
│   │   │   └── UsersScreen.js    # Displays list of registered users (FlatList)
│   │   ├── store/
│   │   │   └── authStore.js      # Zustand store synchronizing state with SecureStore
│   │   ├── services/
│   │   │   └── api.js            # Axios client with base URL and JWT interceptor
│   │   └── navigation/
│   │       └── AppNavigator.js   # Navigation stack with authentication protection
│   ├── App.js                   # Mobile application root entry point
│   ├── app.json                 # Expo app configuration
│   ├── .gitignore               # Ignores node_modules, .expo
│   └── package.json             # Mobile dependencies and Expo scripts
│
└── README.md                    # Complete project documentation
```

---

## 3. Architecture Overview

### Backend Request Flow:
1. Client makes an HTTP request to `http://<IP>:5000/endpoint`.
2. `server.js` processes CORS and parses incoming JSON bodies via `express.json()`.
3. The request routes to either `authRoutes.js` or `userRoutes.js`.
4. Protected routes pass through `authMiddleware.js`:
   - Checks the `Authorization: Bearer <token>` header.
   - Verifies the signature with `JWT_SECRET`.
   - Rejects with `401 Unauthorized` if invalid or missing.
5. `authController.js` executes the logic, interacts with `models/User.js` via Sequelize ORM, and sends back clean JSON responses without ever leaking passwords.

### Mobile State & Navigation Flow:
1. `App.js` launches and mounts `AppNavigator.js`.
2. `authStore.js` checks `Expo SecureStore` for a previously saved token (`loadStoredAuth()`).
3. If token exists:
   - Displays `HomeScreen` and `UsersScreen`.
4. If token is null:
   - Displays `LoginScreen` and `RegisterScreen`.
   - Access to `HomeScreen` and `UsersScreen` is strictly prevented.
5. On Login:
   - Axios sends credentials to `POST /login`.
   - Response returns `{ token, user }`.
   - `setAuth()` stores `token` in `SecureStore` and state in `Zustand`.
   - UI automatically transitions to `HomeScreen`.
6. On Logout:
   - `logout()` deletes the token from `SecureStore` and resets Zustand state.
   - UI automatically transitions back to `LoginScreen`.

---

## 4. Backend Setup & Running

### Prerequisites:
- Node.js (version 18+ or 20+ LTS)

### Step 1: Navigate to the backend directory
```bash
cd backend
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
# On Windows PowerShell:
Copy-Item .env.example .env

# On Mac/Linux:
cp .env.example .env
```
Contents of `.env`:
```env
PORT=5000
JWT_SECRET=simple_auth_jwt_secret_key_examination_2026
```

### Step 4: Start the backend server
```bash
# Production mode:
npm start

# Development mode (auto-reload with nodemon):
npm run dev
```

You should see:
```
Database connected and synchronized successfully.
Server is running on port 5000
Test endpoint: http://localhost:5000/
```

### Step 5: Run Automated Tests
A test script is included to test all 8 required scenarios:
```bash
node test-api.js
```

---

## 5. Mobile Setup & Running

### Step 1: Navigate to the mobile directory
```bash
cd mobile
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Configure your Backend IP Address
Open `mobile/src/services/api.js` and set `API_BASE_URL` according to your device (see Section 6 below).

### Step 4: Start Expo
```bash
npx expo start
```
Or:
```bash
npm start
```

### Step 5: Open on your device
- **Android Emulator**: Press `a` in the terminal.
- **Physical Phone**: Install **Expo Go** from Google Play Store or Apple App Store, and scan the QR code displayed in the terminal.
- **Web Browser**: Press `w` in the terminal.

---

## 6. Configuring the API IP Address

> **CRITICAL**: A physical mobile phone cannot connect to `http://localhost:5000` because `localhost` refers to the phone itself, not your development computer!

Open file: `mobile/src/services/api.js`

```javascript
// Change this line depending on where you run the app:
export const API_BASE_URL = 'http://10.0.2.2:5000';
```

### Options:
1. **Android Emulator (Android Studio)**:
   - Use `http://10.0.2.2:5000`
   - `10.0.2.2` is the special Android loopback address to access the host machine's `localhost`.

2. **Physical Smartphone (via Wi-Fi with Expo Go)**:
   - Use your computer's local network IPv4 address, for example: `http://192.168.1.50:5000`.
   - **How to find your local IP on Windows**:
     1. Open PowerShell or Command Prompt.
     2. Type `ipconfig` and press Enter.
     3. Look for **IPv4 Address** (e.g. `192.168.1.XXX`).
     4. Set `export const API_BASE_URL = 'http://192.168.1.XXX:5000';`.
     5. Ensure both your computer and phone are connected to the same Wi-Fi network.

3. **iOS Simulator**:
   - Use `http://localhost:5000`.

---

## 7. API Endpoints Documentation & Examples

### Base URL:
`http://localhost:5000` (or `http://<your-ip>:5000`)

---

### 1. Register User
- **Method**: `POST`
- **Route**: `/register`
- **Access**: Public
- **Headers**: `Content-Type: application/json`

**Request Body**:
```json
{
  "name": "Maroua Sabir",
  "email": "maroua@example.com",
  "password": "mypassword123"
}
```

**Success Response (`201 Created`)**:
```json
{
  "message": "User registered successfully.",
  "user": {
    "id": 1,
    "name": "Maroua Sabir",
    "email": "maroua@example.com"
  }
}
```

**Error Response (`400 Bad Request`)**:
```json
{
  "message": "All fields (name, email, password) are required."
}
```
Or if email already registered:
```json
{
  "message": "Email is already registered."
}
```

---

### 2. Login User
- **Method**: `POST`
- **Route**: `/login`
- **Access**: Public
- **Headers**: `Content-Type: application/json`

**Request Body**:
```json
{
  "email": "maroua@example.com",
  "password": "mypassword123"
}
```

**Success Response (`200 OK`)**:
```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Maroua Sabir",
    "email": "maroua@example.com"
  }
}
```

**Error Response (`400 Bad Request`)**:
```json
{
  "message": "Invalid email or password."
}
```

---

### 3. Get All Users
- **Method**: `GET`
- **Route**: `/users`
- **Access**: Protected (Requires JWT token)
- **Headers**:
  - `Authorization: Bearer <your_jwt_token>`

**Success Response (`200 OK`)**:
```json
[
  {
    "id": 1,
    "name": "Maroua Sabir",
    "email": "maroua@example.com"
  }
]
```

**Error Response (`401 Unauthorized`)**:
```json
{
  "message": "Access denied. No token provided."
}
```
Or if token is expired/tampered with:
```json
{
  "message": "Invalid or expired token."
}
```

---

## 8. Testing Scenarios & Results

All 8 university examination scenarios have been implemented and verified:

| # | Test Scenario | Expected Result | Verified Result |
|---|---------------|-----------------|-----------------|
| 1 | Register a new user | HTTP 201 + User details (no password) | Pass |
| 2 | Register existing email | HTTP 400 + "Email is already registered." | Pass |
| 3 | Register with missing fields | HTTP 400 + "All fields are required." | Pass |
| 4 | Login with correct credentials | HTTP 200 + JWT Token + User object | Pass |
| 5 | Login with wrong password | HTTP 400 + "Invalid email or password." | Pass |
| 6 | Access GET /users without token | HTTP 401 + "Access denied. No token provided." | Pass |
| 7 | Access GET /users with valid token | HTTP 200 + Array of users (passwords omitted) | Pass |
| 8 | Logout on mobile | Token removed from SecureStore, state cleared, returns to Login | Pass |

---

## 9. Oral Examination / Defense Guide

Use this section to prepare for any questions your professor may ask during your project presentation:

### Q1: Why did you choose SQLite and Sequelize?
> **Answer**:
> - **SQLite** is serverless, zero-configuration, and stores data in a single local file (`database.sqlite`). This makes the application completely portable and self-contained without needing to install external database servers like MySQL or PostgreSQL.
> - **Sequelize** is an Object-Relational Mapper (ORM). Instead of writing raw SQL strings (`SELECT * FROM users`), Sequelize allows us to define models (`sequelize.define`) and interact with database records using simple JavaScript asynchronous methods (`User.create()`, `User.findOne()`, `User.findAll()`). This prevents SQL injection attacks and keeps the code clean.

### Q2: How does password security work in this project?
> **Answer**:
> - Passwords are never stored in plain text.
> - We use `bcryptjs` with 10 salt rounds (`await bcrypt.hash(password, 10)`).
> - Salting adds random data to the password before hashing, which defends against Rainbow Table attacks.
> - When logging in, `bcrypt.compare(enteredPassword, storedHash)` hashes the input and securely compares the hashes.
> - In all database queries (`findAll`, `create`), passwords are never included in the JSON response sent back to the mobile client.

### Q3: What is a JSON Web Token (JWT) and how does it work?
> **Answer**:
> - A JWT is a stateless, digitally signed string composed of three parts separated by dots: **Header**, **Payload**, and **Signature**.
> - When a user logs in successfully, the backend signs a token containing the user's `id` and `email` using a private secret key (`JWT_SECRET`).
> - The mobile app receives this token and stores it in encrypted device storage (`Expo SecureStore`).
> - For every protected request, the mobile app sends the token in the `Authorization: Bearer <token>` HTTP header.
> - The backend `authMiddleware` verifies the signature using `jwt.verify()`. If verified, the server trusts that the request comes from an authenticated user without querying the database for every single request.

### Q4: Why use Expo SecureStore instead of AsyncStorage?
> **Answer**:
> - `AsyncStorage` stores data in unencrypted plain text, making tokens vulnerable if a device is rooted or inspected.
> - `Expo SecureStore` encrypts sensitive data using the device's native secure hardware/keychain (Android KeyStore and iOS Keychain Services). This ensures the JWT authentication token is safely stored.

### Q5: How does navigation protect private screens from unauthenticated users?
> **Answer**:
> - In `AppNavigator.js`, we use conditional rendering based on the `token` state from `authStore.js`.
> - If `token` is `null`, the navigator only mounts `LoginScreen` and `RegisterScreen`. The `HomeScreen` and `UsersScreen` do not even exist in the navigation hierarchy, making it impossible for an unauthenticated user to navigate to them.
> - Once `setAuth()` sets the `token`, the navigator re-renders and automatically displays `HomeScreen`.