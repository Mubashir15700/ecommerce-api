import { Router } from "express";
import { create, getAll, getOne, remove, update } from "../controllers/product.controller";
import {
    authenticate,
    authorize,
} from "../middlewares/auth.middleware";
import { UserRole } from "../models/user.model";
import { asyncHandler } from "../utils/async-handler";
import { validate } from "../middlewares/validation.middleware";
import { createProductValidator, updateProductValidator } from "../validators/product.validator";

const router = Router();

router.get(
    "/",
    authenticate,
    asyncHandler(getAll)
);

router.get(
    "/:id",
    authenticate,
    asyncHandler(getOne)
);

router.post(
    "/",
    authenticate,
    authorize(UserRole.ADMIN),
    createProductValidator,
    validate,
    asyncHandler(create)
);

router.patch(
    "/:id",
    authenticate,
    authorize(UserRole.ADMIN),
    updateProductValidator,
    validate,
    asyncHandler(update)
);

router.delete(
    "/:id",
    authenticate,
    authorize(UserRole.ADMIN),
    asyncHandler(remove)
);

export default router;
