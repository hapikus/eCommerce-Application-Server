const Router = require("express").Router;
const {body} = require("express-validator");

const userController = require("../controllers/user-controller");
const productController = require("../controllers/product-controller");
const authMiddleware = require('../middlewares/auth-middleware');
const basketController = require("../controllers/basket-controller");

const router = new Router();

//* POST registration
/**
 * @swagger
 * /registration:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided information. This endpoint allows users to register by providing their personal information, including address details.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 32
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 32
 *               password:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 32
 *               email:
 *                 type: string
 *                 format: email
 *               dob:
 *                 type: string
 *                 format: date  # Assuming 'dob' is a date field
 *               defaultShippingCheck:
 *                 type: boolean
 *               shipCountry:
 *                 type: string
 *               shipCity:
 *                 type: string
 *               shipStreet:
 *                 type: string
 *               shipPostalCode:
 *                 type: string
 *               defaultBillingCkeck:
 *                 type: boolean
 *               billCountry:
 *                 type: string
 *               billCity:
 *                 type: string
 *               billStreet:
 *                 type: string
 *               billPostalCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/UserDto'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       param:
 *                         type: string
 *                       msg:
 *                         type: string
 *                       value:
 *                         type: string
 *       500:
 *         description: Internal Server Error
 */

//* POST login
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Log in with a registered email and password to get access tokens.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/UserDto'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       param:
 *                         type: string
 *                       msg:
 *                         type: string
 *                       value:
 *                         type: string
 *       500:
 *         description: Internal Server Error
 */

//* POST user/check-password
/**
 * @swagger
 * /user/check-password:
 *   post:
 *     summary: Check if the provided password is correct for the user
 *     description: Check if the provided password matches the user's stored password.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: refreshToken
 *         in: cookie
 *         required: true
 *         description: The refresh token used to authenticate the user.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The password to check.
 *                 example: "myPassword123"
 *     responses:
 *       200:
 *         description: Successful response indicating that the password is correct.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that the password is correct.
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that the provided password is incorrect or the token is invalid.
 *       500:
 *         description: Internal Server Error
 */

//* GET user
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get user information
 *     description: Retrieve user information for the authenticated user based on the provided refresh token.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: refreshToken
 *         in: cookie
 *         required: true
 *         description: The refresh token used to authenticate the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with user information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that the user is not authenticated.
 *       500:
 *         description: Internal Server Error
 */

//* GET user/get-basket
/**
 * @swagger
 * /user/get-basket:
 *   get:
 *     summary: Get the user's basket ID.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve the user's basket ID based on the provided refresh token.
 *     parameters:
 *       - name: refreshToken
 *         in: cookie
 *         required: true
 *         description: The refresh token used to authenticate the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's basket ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 basketId:
 *                   type: string
 *                   description: The ID of the user's basket.
 *       400:
 *         description: Bad request. Possible reasons include missing or invalid refresh token.
 *       404:
 *         description: Not found. The user associated with the provided email was not found.
 *       500:
 *         description: Internal server error.
 */

//* PUT user
/**
 * @swagger
 * /user:
 *   put:
 *     summary: Update user profile
 *     description: Update the user's profile information.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updateUserBody:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the user to update.
 *                   email:
 *                     type: string
 *                     description: The updated email address (optional).
 *                   firstName:
 *                     type: string
 *                     description: The updated first name (optional).
 *                   lastName:
 *                     type: string
 *                     description: The updated last name (optional).
 *                   dob:
 *                     type: string
 *                     format: date  # Assuming 'dob' is a date field
 *                   password:
 *                     type: string
 *                     description: The updated password (optional).
 *     responses:
 *       200:
 *         description: Successful response with updated user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating a bad request or error.
 *       500:
 *         description: Internal Server Error
 */

//* POST logout
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: User logout
 *     description: Log the user out by removing the refresh token from the server. This effectively logs the user out and invalidates their token.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: [] 
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 acknowledged:
 *                   type: boolean
 *                   description: Indicates whether the logout request was acknowledged.
 *                 deletedCount:
 *                   type: number
 *                   description: The number of tokens deleted (typically 0 or 1).
 *       500:
 *         description: Internal Server Error
 */

//* GET activate/{link}:
/**
 * @swagger
 * /activate/{link}:
 *   get:
 *     summary: Activate user account
 *     description: Activate a user account using the activation link provided in the URL.
 *     tags:
 *       - User
 *     parameters:
 *       - name: link
 *         in: path
 *         description: The activation link provided in the URL.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User account activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that the user account was activated successfully.
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 */

//* GET refresh
/**
 * @swagger
 * /refresh:
 *   get:
 *     summary: Refresh access tokens
 *     description: Refresh the user's access tokens using the provided refresh token.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - name: refreshToken
 *         in: cookie
 *         description: The refresh token stored in a cookie.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Refresh successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating unauthorized access.
 *       500:
 *         description: Internal Server Error
 */

//* GET product/all-categories
/**
 * @swagger
 * /product/all-categories:
 *   get:
 *     summary: Get all unique product categories
 *     description: Retrieve a list of all unique product categories.
 *     tags:
 *       - Product
 *     responses:
 *       200:
 *         description: Successful response with a list of unique product categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: array
 *                   description: An array containing unique product categories.
 *                   items:
 *                     type: string
 *                     description: A unique product category.
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that no categories were found.
 *       500:
 *         description: Internal Server Error
 */

//* GET product/top-categories
/**
 * @swagger
 * /product/top-categories:
 *   get:
 *     summary: Get top product categories
 *     description: Retrieve a list of the top product categories based on product counts.
 *     tags:
 *       - Product
 *     responses:
 *       200:
 *         description: Successful response with a list of top product categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   description: An array containing the top product categories.
 *                   items:
 *                     type: string
 *                     description: A top product category.
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that no top categories were found.
 *       500:
 *         description: Internal Server Error
 */

//* GET product/top-first-genres
/**
 * @swagger
 * /product/top-first-genres:
 *   get:
 *     summary: Get top product genres
 *     description: Retrieve a list of the top product genres based on product counts.
 *     tags:
 *       - Product
 *     responses:
 *       200:
 *         description: Successful response with a list of top the first product genres.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that no top the first genres were found.
 *       500:
 *         description: Internal Server Error
 */

//* GET product/top-first-themes
/**
 * @swagger
 * /product/top-first-themes:
 *   get:
 *     summary: Get top the first product themes
 *     description: Retrieve a list of the top product themes based on product counts.
 *     tags:
 *       - Product
 *     responses:
 *       200:
 *         description: Successful response with a list of top product themes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that no top the first themes were found.
 *       500:
 *         description: Internal Server Error
 */

//* GET product/random
/**
 * @swagger
 * /product/random:
 *   get:
 *     summary: Get random products
 *     description: Retrieve a list of random products based on the specified number.
 *     tags:
 *       - Product
 *     parameters:
 *       - name: num
 *         in: query
 *         description: The number of random products to retrieve.
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *     responses:
 *       200:
 *         description: Successful response with a list of random products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that no random products were found.
 *       500:
 *         description: Internal Server Error
 */

//* GET product/random-discount
/**
 * @swagger
 * /product/random-discount:
 *   get:
 *     summary: Get random products with discount
 *     description: Retrieve a list of random products with a discount based on the specified number.
 *     tags:
 *       - Product
 *     parameters:
 *       - name: num
 *         in: query
 *         description: The number of random products with a discount to retrieve.
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 5
 *     responses:
 *       200:
 *         description: Successful response with a list of random products with discount.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that no random products with discount were found.
 *       500:
 *         description: Internal Server Error
 */

//* POST product/catalog
/**
 * @swagger
 * /product/catalog:
 *   post:
 *     summary: Get products from the catalog
 *     description: Retrieve products from the catalog based on specified filters and pagination options.
 *     tags:
 *       - Product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageNumber:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               pageLimit:
 *                 type: integer
 *                 minimum: 1
 *                 example: 10
 *               sortColumn:
 *                 type: string
 *                 enum: [gameTitle, price, devCompany]
 *                 example: gameTitle
 *               sortDirection:
 *                 type: string
 *                 enum: [up, down]
 *                 example: up
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Single-player", "Online PvP"]
 *               themes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Strategy"]
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Simulation"]
 *               minPrice:
 *                 type: number
 *                 minimum: 0
 *                 example: 0
 *               maxPrice:
 *                 type: number
 *                 minimum: 0
 *                 example: 100
 *     responses:
 *       200:
 *         description: Successful response with catalog products and total count.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                   description: An array containing catalog products.
 *                 totalProducts:
 *                   type: integer
 *                   description: The total number of products matching the filters.
 *                 filters:
 *                   type: object
 *                   properties:
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: All unique tags from selected games.
 *                     genres:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: All unique genres from selected games.
 *                     themes:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: All unique themes from selected games.
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating a bad request or error.
 *       500:
 *         description: Internal Server Error
 */

//* GET product/search
/**
 * @swagger
 * /product/search:
 *   get:
 *     summary: Search products by game title
 *     description: Search for products by game title using a query string.
 *     tags:
 *       - Product
 *     parameters:
 *       - name: query
 *         in: query
 *         description: The search query to find products by game title.
 *         required: true
 *         schema:
 *           type: string
 *           example: "Call of Duty"
 *     responses:
 *       200:
 *         description: Successful response with search results.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating a bad request or error.
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that no matching game titles were found.
 *       500:
 *         description: Internal Server Error
 */

//* GET product/{title}
/**
 * @swagger
 * /product/{title}:
 *   get:
 *     summary: Get a product by game title
 *     description: Retrieve a product by its game title.
 *     tags:
 *       - Product
 *     parameters:
 *       - name: title
 *         in: path
 *         description: The game title of the product to retrieve.
 *         required: true
 *         schema:
 *           type: string
 *           example: "Path of Exile"
 *     responses:
 *       200:
 *         description: Successful response with the product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating a bad request or error.
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating that the product was not found.
 *       500:
 *         description: Internal Server Error
 */

//* POST baskets/create
/**
 * @swagger
 * /basket/create:
 *   post:
 *     summary: Create a new basket.
 *     tags: [Basket]
 *     responses:
 *       200:
 *         description: Successful response with a new basket ID.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */

//* POST baskets/add-to-user
/**
 * @swagger
 * /basket/add-to-user:
 *   post:
 *     summary: Add a basket to a user.
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               basketId:
 *                 type: string
 *             example:
 *               basketId: "basketIdValue"
 *     responses:
 *       200:
 *         description: Successful response with the updated user basket ID.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized (user not authenticated).
 *       500:
 *         description: Internal server error.
 */

//* POST baskets/merge-baskets
/**
 * @swagger
 * /basket/merge-baskets:
 *   post:
 *     summary: Merge an anonymous basket into a user basket.
 *     tags: [Basket]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               basketAnonId:
 *                 type: string
 *               basketUserId:
 *                 type: string
 *             example:
 *               basketAnonId: "anonBasketIdValue"
 *               basketUserId: "userBasketIdValue"
 *     responses:
 *       200:
 *         description: Successful response with the merged user basket ID.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized (user not authenticated).
 *       500:
 *         description: Internal server error.
 */

//* GET basket/{basketId}/get-basket-items
/**
 * @swagger
 * /basket/{basketId}/get-basket-items:
 *   get:
 *     summary: Get the user's basket.
 *     tags: [Basket]
 *     description: Retrieve the user's basket based on the provided basket ID.
 *     parameters:
 *       - name: basketId
 *         in: path
 *         required: true
 *         description: The ID of the basket to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's basket.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 basketId:
 *                   type: string
 *                   description: The ID of the user's basket.
 *                 items:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                   description: A map of game titles to their quantities in the basket.
 *                 promo:
 *                   type: string
 *                   description: The promo code applied to the basket (default is an empty string).
 *       400:
 *         description: Bad request. Invalid basket ID.
 *       404:
 *         description: Not found. The specified basket was not found.
 *       500:
 *         description: Internal server error.
 */

//* GET basket/{basketId}/get-basket-full
/**
 * @swagger
 * /basket/{basketId}/get-basket-full:
 *   get:
 *     summary: Get the user's full basket with game details and promotions.
 *     tags:
 *       - Basket
 *     description: Retrieve the user's basket with game details and applied promotions based on the provided basket ID.
 *     parameters:
 *       - name: basketId
 *         in: path
 *         required: true
 *         description: The ID of the basket to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's full basket with game details and promotions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 basketId:
 *                   type: string
 *                   description: The ID of the user's basket.
 *                 items:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       gameTitle:
 *                         type: string
 *                         description: The title of the game.
 *                       descriptionShort:
 *                         type: string
 *                         description: Short description of the game.
 *                       price:
 *                         type: number
 *                         description: Original price of the game.
 *                       discountPrice:
 *                         type: number
 *                         description: Discounted price of the game (if applicable).
 *                       sortPrice:
 *                         type: number
 *                         description: Price after sorting.
 *                       promoPrice:
 *                         type: number
 *                         description: Price after applying the promotion.
 *                       basketQuantity:
 *                         type: number
 *                         description: Quantity of the game in the basket.
 *                 promo:
 *                   type: string
 *                   description: The promo code applied to the basket (default is an empty string).
 *       400:
 *         description: Bad request. Invalid basket ID.
 *       404:
 *         description: Not found. The specified basket was not found.
 *       500:
 *         description: Internal server error.
 */

//* DELETE basket/{basketId}/clear
/**
 * @swagger
 * /basket/{basketId}/clear:
 *   delete:
 *     summary: Clear all items from a basket.
 *     tags: [Basket]
 *     description: Remove all items from the specified basket, making it empty.
 *     parameters:
 *       - name: basketId
 *         in: path
 *         required: true
 *         description: The ID of the basket to be cleared.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Basket cleared successfully.
 *       400:
 *         description: Bad request. Possible reasons include the basket not found.
 */

//* POST baskets/{basketId}/add-item
/**
 * @swagger
 * /basket/{basketId}/add-item:
 *   post:
 *     summary: Add an item to a basket
 *     tags: [Basket]
 *     description: Add a new item with a quantity of 1 to the specified basket.
 *     parameters:
 *       - name: basketId
 *         in: path
 *         required: true
 *         description: The ID of the basket where the item will be added.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameTitle:
 *                 type: string
 *             example:
 *               gameTitle: "EVE Online"
 *     responses:
 *       200:
 *         description: The basket ID where the item was added.
 *       400:
 *         description: Bad request. Possible reasons include the basket not found or the game title already existing in the basket.
 */

//* PATCH basket/{basketId}/change-quantity
/**
 * @swagger
 * /basket/{basketId}/change-quantity:
 *   patch:
 *     summary: Change the quantity of items in a basket
 *     tags: [Basket]
 *     description: Update the quantity of items in the specified basket for each gameTitle provided in the request.
 *     parameters:
 *       - name: basketId
 *         in: path
 *         required: true
 *         description: The ID of the basket where item quantities will be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemUpdates:
 *                 type: object
 *                 properties:
 *                   "gameTitle 1":
 *                     type: number
 *                   "gameTitle 2":
 *                     type: number
 *                 example:
 *                   "EVE Online": 2
 *                   "Path of Exile": 3
 *     responses:
 *       200:
 *         description: Quantity updated successfully.
 *       400:
 *         description: Bad request. Possible reasons include the basket not found or invalid gameTitles in itemUpdates.
 */

//* delete basket/{basketId}/remove-item
/**
 * @swagger
 * /basket/{basketId}/remove-item:
 *   post:
 *     summary: Remove a product from a basket.
 *     tags: [Basket]
 *     description: Remove a product with the specified gameTitle from the specified basket.
 *     parameters:
 *       - name: basketId
 *         in: path
 *         required: true
 *         description: The ID of the basket from which the product will be removed.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameTitle:
 *                 type: string
 *             example:
 *               gameTitle: "EVE Online"
 *     responses:
 *       200:
 *         description: Product removed successfully.
 *       400:
 *         description: Bad request. Possible reasons include the basket not found or the product not found in the basket.
 */

//* POST basket/{basketId}/add-promo
/**
 * @swagger
 * /basket/{basketId}/add-promo:
 *   post:
 *     summary: Add a promo to a basket
 *     tags: [Basket]
 *     description: Add a promo code to the specified basket.
 *     parameters:
 *       - name: basketId
 *         in: path
 *         required: true
 *         description: The ID of the basket where the promo will be added.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               promo:
 *                 type: string
 *             example:
 *               promo: "First order"
 *     responses:
 *       200:
 *         description: The basket ID where the promo was added.
 *       400:
 *         description: Bad request. Possible reasons include the basket not found or an invalid promo code.
 */

//* POST basket/{basketId}/delete-promo
/**
 * @swagger
 * /basket/{basketId}/delete-promo:
 *   delete:
 *     summary: Delete the promo from a basket
 *     tags: [Basket]
 *     description: Remove the promo code from the specified basket.
 *     parameters:
 *       - name: basketId
 *         in: path
 *         required: true
 *         description: The ID of the basket from which the promo will be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The basket ID from which the promo was deleted.
 *       400:
 *         description: Bad request. Possible reasons include the basket not found or no promo code to delete.
 */

router.post(
  "/registration",
  body('firstName').isLength({min: 2, max: 32}),
  body('lastName').isLength({min: 2, max: 32}),
  body('password').isLength({min: 3, max: 32}),
  body('email').isEmail(),
  userController.registration,
);
router.post("/login", body("email").isEmail(), userController.login);
router.post("/logout", userController.logout);

router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);

router.get("/users", authMiddleware, userController.getUsers);
router.get("/user", authMiddleware, userController.getUser);
router.get('/user/get-basket-id', authMiddleware, userController.getUserBasket);
router.put("/user", authMiddleware, userController.updateUser);
router.delete("/user", authMiddleware, userController.deleteUser);

router.post("/user/address/billing/addAndGetAll", authMiddleware, userController.addAndGetAllBillingAddress);
router.post('/user/address/billing', authMiddleware, userController.getBillingAddresses);
router.put('/user/address/billing', authMiddleware, userController.updateBillingAddresses);

router.post("/user/address/shipping/addAndGetAll", authMiddleware, userController.addAndGetAllShippingAddress);
router.post('/user/address/shipping', authMiddleware, userController.getShippingAddresses);
router.put('/user/address/shipping', authMiddleware, userController.updateShippingAddresses);

router.delete('/user/address/:id', authMiddleware, userController.deleteAddress);

router.post('/user/check-password', userController.checkPassword);

router.get("/product/all-categories", productController.getAllCategories);
router.get("/product/top-categories", productController.getTopCategories);
router.get("/product/top-first-genres", productController.getTopFirstGenres);
router.get("/product/top-first-themes", productController.getTopFirstThemes);

router.get("/product/random", productController.getRandProducts);
router.get("/product/random-discount", productController.getRandProductsWithDiscount);
router.post("/product/catalog", productController.getCatalogProducts);
router.get("/product/search", productController.searchProducts);
router.get("/product/:title", productController.getProduct);

router.post('/basket/create', basketController.create);
router.post('/basket/add-to-user', authMiddleware, basketController.addToUser);
router.post('/basket/merge-baskets', authMiddleware, basketController.mergeBaskets);
router.get('/basket/:basketId/get-basket-items', basketController.getBasket);
router.get('/basket/:basketId/get-basket-full', basketController.getBasketFull);
router.delete('/basket/:basketId/clear', basketController.clearBasket);

router.post('/basket/:basketId/add-item', basketController.addItem);
router.patch('/basket/:basketId/change-quantity', basketController.changeQuantity);
router.post('/basket/:basketId/remove-item', basketController.removeItem);

router.post('/basket/:basketId/add-promo', basketController.addPromo);
router.delete('/basket/:basketId/delete-promo', basketController.deletePromo);

module.exports = router;
