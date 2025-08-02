"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("./user.interface");
const router = express_1.default.Router();
router.post('/register', user_controller_1.UserController.createUser);
router.get('/', (0, checkAuth_1.checkAuth)((user_interface_1.Role.ADMIN)), user_controller_1.UserController.getAllUsers);
router.patch('/:id', (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserController.updateUser);
router.patch('/block/:id', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), user_controller_1.UserController.blockOrUnblock);
exports.userRoutes = router;
