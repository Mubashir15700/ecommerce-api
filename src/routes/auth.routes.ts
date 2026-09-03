import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { validate } from "../middlewares/validation.middleware";
import {
    loginValidator,
    registerValidator,
} from "../validators/auth.validator";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

router.post(
    "/register",
    registerValidator,
    validate,
    asyncHandler(register)
);

router.post(
    "/login",
    loginValidator,
    validate,
    asyncHandler(login)
);

export default router;
