import bcrypt from "bcryptjs";

import { User, UserRole } from "../../src/models/user.model";
import {
    registerUser,
    loginUser,
} from "../../src/services/auth.service";

describe("Auth Service", () => {
    describe("register", () => {
        it("should register a new customer", async () => {
            const result = await registerUser({
                name: "Test User",
                email: "test@example.com",
                password: "Password@123",
            });

            expect(result).toBeDefined();
            expect(result.user).toBeDefined();
            expect(result.token).toBeDefined();

            expect(result.user.name).toBe("Test User");
            expect(result.user.email).toBe("test@example.com");
            expect(result.user.role).toBe(UserRole.CUSTOMER);
        });
    });

    describe("login", () => {
        it("should login with valid credentials", async () => {
            const password = "Password@123";

            const hashedPassword = await bcrypt.hash(password, 12);

            await User.create({
                name: "Test User",
                email: "login@example.com",
                password: hashedPassword,
                role: UserRole.CUSTOMER,
                isActive: true,
            });

            const result = await loginUser({
                email: "login@example.com",
                password,
            });

            expect(result).toBeDefined();
            expect(result.user).toBeDefined();
            expect(result.token).toBeDefined();

            expect(result.user.email).toBe("login@example.com");
        });

        it("should reject invalid password", async () => {
            const hashedPassword = await bcrypt.hash(
                "Password@123",
                12
            );

            await User.create({
                name: "Test User",
                email: "invalid@example.com",
                password: hashedPassword,
                role: UserRole.CUSTOMER,
                isActive: true,
            });

            await expect(
                loginUser({
                    email: "invalid@example.com",
                    password: "WrongPassword@123",
                })
            ).rejects.toThrow("Invalid email or password");
        });
    });
});
