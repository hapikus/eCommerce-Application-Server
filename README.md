## Table of Contents

- [User Registration](#User-Registration)

## User Registration

### How can I register a new user?

To register a new user, you need to make a `POST` request to the registration endpoint using the following information:

**Request URL:**

__http://localhost:5000/api/registration__

**Request Body:**
```json
{
  "email": "test3@test3.com",
  "password": "mysecurepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

After sending the request, you will receive a response containing access and refresh tokens, as well as user details:

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "test4@test4.com",
    "id": "64d0eceef13b24d08c5d2ed9",
    "isActivated": false
  }
}
```

### What are the access and refresh tokens used for?

The access token (`accessToken`) and refresh token (`refreshToken`) are both essential for user authentication and authorization. The access token is a short-lived token that grants access to protected resources on the server. It contains user information and is used for making authenticated requests.

The refresh token is a long-lived token that is used to obtain a new access token when the current one expires. It helps to maintain user sessions without requiring users to repeatedly log in. Both tokens should be securely stored and transmitted.

### How do I use the refresh token?

When your access token expires, you can use the refresh token to obtain a new access token without requiring the user to log in again. To use the refresh token, you can include it in the Cookies of your request. The server will then issue a new access token if the refresh token is valid.

Please note that security measures must be in place to protect the refresh token, as it provides a longer window of access.
