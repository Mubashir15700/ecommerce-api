import { Router } from "express";
import { create, getAll, getMine, getMineById, updateStatus } from "../controllers/order.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/async-handler";
import { validate } from "../middlewares/validation.middleware";
import { createOrderValidator, updateOrderStatusValidator } from "../validators/order.validator";
import { UserRole } from "../models/user.model";

const router = Router();

router.post(
    "/",
    authenticate,
    createOrderValidator,
    validate,
    asyncHandler(create)
);

router.get(
    "/my",
    authenticate,
    authorize(UserRole.CUSTOMER),
    asyncHandler(getMine)
);

router.get(
    "/my/:id",
    authenticate,
    authorize(UserRole.CUSTOMER),
    asyncHandler(getMineById)
);

router.get(
    "/",
    authenticate,
    authorize(UserRole.ADMIN),
    asyncHandler(getAll)
);

router.patch(
    "/:id/status",
    authenticate,
    authorize(UserRole.ADMIN),
    updateOrderStatusValidator,
    validate,
    asyncHandler(updateStatus)
);

export default router;
