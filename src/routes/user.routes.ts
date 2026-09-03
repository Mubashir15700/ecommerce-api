import { Router } from "express";
import { getProfile, getUsers, updateProfile, updateStatus } from "../controllers/user.controller";
import { UserRole } from "../models/user.model";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { updateProfileValidator, updateUserStatusValidator } from "../validators/user.validator";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

router.get(
    "/me",
    authenticate,
    asyncHandler(getProfile)
);

router.patch(
    "/me",
    authenticate,
    updateProfileValidator,
    validate,
    asyncHandler(updateProfile)
);

router.get(
    "/",
    authenticate,
    authorize(UserRole.ADMIN),
    asyncHandler(getUsers)
);

router.patch(
    "/:id/status",
    authenticate,
    authorize(UserRole.ADMIN),
    updateUserStatusValidator,
    validate,
    asyncHandler(updateStatus)
);

export default router;
