const Router = require("express").Router;
const {body} = require("express-validator");

const userController = require("../controllers/user-controller");
const productController = require("../controllers/product-controller");
const authMiddleware = require('../middlewares/auth-middleware');

const router = new Router();

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
router.put("/user", userController.updateUser);
router.delete("/user", userController.deleteUser);

router.get('/user/address/billing', authMiddleware, userController.getBillingAddresses);
router.put('/user/address/billing', authMiddleware, userController.updateBillingAddresses);
router.post('/user/check-password', userController.checkPassword);
router.get('/user/address/shipping', authMiddleware, userController.getShippingAddresses);
router.put('/user/address/shipping', authMiddleware, userController.updateShippingAddresses);
router.delete('/user/address/:id', authMiddleware, userController.deleteAddress);

router.get("/product/all-categories", productController.getAllCategories);
router.get("/product/random", productController.getRandProducts);
router.get("/product/random-discount", productController.getRandProductsWithDiscount);
router.get("/product/catalog", productController.getCatalogProducts);
router.get("/product/:title", productController.getProduct);

module.exports = router;
