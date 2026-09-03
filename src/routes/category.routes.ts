import { Router } from "express";
import { UserRole } from "../models/user.model";
import { create, getCategories, getTree, remove, update } from "../controllers/category.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { createCategoryValidator, updateCategoryValidator } from "../validators/category.validator";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize(UserRole.ADMIN),
    createCategoryValidator,
    validate,
    asyncHandler(create)
);

router.get(
    "/",
    authenticate,
    asyncHandler(getCategories)
);

router.get(
    "/tree",
    authenticate,
    asyncHandler(getTree)
);

router.patch(
    "/:id",
    authenticate,
    authorize(UserRole.ADMIN),
    updateCategoryValidator,
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
