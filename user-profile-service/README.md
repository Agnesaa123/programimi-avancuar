User Profile Service
Description: The User Profile Service is a microservice built with Node.js and Express.js that allows users to register, login, and manage their profiles with JWT authentication.

Features: 
User Registration: Allows users to register with email, password, name, and address.
Login: Users can authenticate with email and password.
Profile Management: Users can view and update their profiles (protected routes).


Technologies:
Node.js
Express.js
JWT (JSON Web Token)
bcrypt
uuid


Setup Instructions:

Clone the repository:
git clone https://github.com/Agnesaa123/user-profile-service.git

Install dependencies:
cd user-profile-service
npm install

Start the server:
npm start
The service will run on http://localhost:3000.

API Endpoints:
Health Check

GET /health

Response:

json
{
    "status": "UP",
    "service": "user-profile-service"
}

Register User

POST /users

Request Body:
{
  "email": "testuser@example.com",
  "password": "password123",
  "name": "Test User",
  "address": "Test Address"
}

Response:
{
    "id": "6fd442cc-89c1-4e08-9c2d-1c6a271d54f4",
    "email": "testuser@example.com",
    "name": "Test User",
    "address": "Test Address",
    "registrationDate": "2025-04-03T15:38:50.909Z"
}

Login User

POST /auth/login

Request Body:
{
  "email": "testuser@example.com",
  "password": "password123"
}

Response:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZmZDQ0MmNjLTg5YzEtNGUwOC05YzJkLTFjNmEyNzFkNTRmNCIsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDM2OTU0NzcsImV4cCI6MTc0Mzc4MTg3N30.Smi2MP2ZRhhesdCD7wXLgg5WDLqxsE8LNxfXfyzY2iA",
    "userId": "6fd442cc-89c1-4e08-9c2d-1c6a271d54f4"
}

Get Profile (Authenticated)

GET /users/me
Authorization: Bearer Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZmZDQ0MmNjLTg5YzEtNGUwOC05YzJkLTFjNmEyNzFkNTRmNCIsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDM2OTUwODMsImV4cCI6MTc0Mzc4MTQ4M30.ZpvquYmfSoEZLEpvktfewthhAsNs2IDhX-ebKg4j14U

Response:
{
    "id": "6fd442cc-89c1-4e08-9c2d-1c6a271d54f4",
    "email": "testuser@example.com",
    "name": "Test User",
    "address": "Test Address",
    "registrationDate": "2025-04-03T15:38:50.909Z",
    "lastLogin": null
}

Update Profile (Authenticated)

PUT /users/:id
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZmZDQ0MmNjLTg5YzEtNGUwOC05YzJkLTFjNmEyNzFkNTRmNCIsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDM2OTUwODMsImV4cCI6MTc0Mzc4MTQ4M30.ZpvquYmfSoEZLEpvktfewthhAsNs2IDhX-ebKg4j14U

Request Body:
{
    "id": "6fd442cc-89c1-4e08-9c2d-1c6a271d54f4",
    "email": "testuser@example.com",
    "name": "Updated User",
    "address": "Updated Address",
    "registrationDate": "2025-04-03T15:38:50.909Z",
    "lastLogin": null
}