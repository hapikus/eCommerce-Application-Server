## Table of Contents

- [JWT Authorization](#JWT_Authorization)
- [Registration](#Registration)
- [Login](#Login)

## JWT_Authorization

JWT (JSON Web Token) is a widely used standard for securing web applications and APIs. It provides a compact, self-contained way to transmit information between parties in a secure manner. JWTs are commonly used for authorization and authentication purposes.

### How JWT Authorization Works

`Token Creation`: When a user logs in successfully, the server generates a JWT containing user information (claims), including user ID and possibly other data relevant to the application.

`Token Signing`: The server signs the JWT using a secret key known only to the server. This signature ensures the integrity of the token and verifies that it hasn't been tampered with.

`Token Issuance`: The server sends the signed JWT back to the client, typically as part of the response to a successful login request. The client stores the token securely, usually in a secure HTTP-only cookie or local storage.

`Token Usage`: To access protected resources or endpoints on the server, the client includes the JWT in the Authorization header of its HTTP requests. The JWT is often prefixed with the word "Bearer" (e.g., Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...).

`Token Verification`: The server receives the JWT in each protected request. It verifies the token's signature using the secret key. If the signature is valid and the token hasn't expired, the server allows access to the protected resource. Otherwise, it denies access.

`Token Expiration`: JWTs can have an expiration (e.g., 15 minutes, 1 hour) to enhance security. When a token expires, the client needs to obtain a new one. This is typically done using a refresh token, which is also securely stored and used to request a new access token.

## Registration

### How can I register a new user?

To register a new user, you need to make a `POST` request to the registration endpoint using the following information:

**Request URL:**

__https://codefrondlers.store/api/registration__

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "JohnDoe@gmail.com",
  "dob": "Date",
  "password": "mysecurepassword",

  "defaultShippingCheck": true,
  "shipCountry": "shipCountry",
  "shipCity": "shipCity",
  "shipStreet": "shipStreet",
  "shipPostalCode": "shipPostalCode",

  "defaultBillingCkeck": false,
  "billCountry": "billCountry",
  "billCity": "billCity",
  "billStreet": "billStreet",
  "billPostalCode": "billPostalCode",
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "JohnDoe@gmail.com",
    "id": "64d0eceef13b24d08c5d2ed9",
    "isActivated": false
  }
}
```

`accessToken`: A short-lived token used for authenticating subsequent requests to protected resources on the server.

`refreshToken`: A long-lived token used to obtain a new accessToken when the current one expires.

`user`: An object containing user details, such as the email, user ID, and activation status.

## Login

The login endpoint is used to authenticate existing users of your application. It allows users to log in by providing their registered email address and password. Upon successful authentication, the endpoint returns access and refresh tokens along with user information.

### How can I login a user?

To login a user, you need to make a `POST` request to the login endpoint using the following information:

**Request URL:**

__https://codefrondlers.store/api/login__

**Request Body:**
```json
{
  "email": "JohnDoe@gmail.com",
  "password": "mysecurepassword"
}
```

email: The user's registered email address.
password: The user's password.

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "JohnDoe@gmail.com",
    "id": "64d0eceef13b24d08c5d2ed9",
    "isActivated": false
  }
}
```

`accessToken`: A short-lived token used for authenticating subsequent requests to protected resources on the server.

`refreshToken`: A long-lived token used to obtain a new accessToken when the current one expires.

`user`: An object containing user details, such as the email, user ID, and activation status.
