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

router.get("/product/:title", productController.getProduct);

module.exports = router;
