import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDatabase from "../src/config/database";
import { User, UserRole } from "../src/models/user.model";

dotenv.config();

const seedAdmin = async (): Promise<void> => {
    try {
        await connectDatabase();

        const name = process.env.ADMIN_NAME;
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!name || !email || !password) {
            throw new Error("Admin environment variables are not configured");
        }

        const existingAdmin = await User.findOne({
            email: email.toLowerCase(),
        });

        if (existingAdmin) {
            console.log("Admin user already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: UserRole.ADMIN,
            isActive: true,
        });

        console.log("Admin user created successfully");
        console.log(`Email: ${email}`);

        process.exit(0);
    } catch (error) {
        console.error("Failed to seed admin:", error);
        process.exit(1);
    }
};

seedAdmin();
