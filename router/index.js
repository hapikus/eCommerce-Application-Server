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
 * /baskets/create:
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
 * /baskets/add-to-user:
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
 * /baskets/merge-baskets:
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

//! добавить authMiddleware
router.post('/baskets/create', basketController.create);
router.post('/baskets/add-to-user', basketController.addToUser);
router.post('/baskets/merge-baskets', basketController.mergeBaskets);

module.exports = router;
