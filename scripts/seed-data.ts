import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDatabase from "../src/config/database";
import { User, UserRole } from "../src/models/user.model";
import { Category } from "../src/models/category.model";
import {
    Product,
    ProductStatus,
} from "../src/models/product.model";

dotenv.config();

const seedData = async (): Promise<void> => {
    try {
        await connectDatabase();

        console.log("Clearing existing seed data...");

        await Product.deleteMany({
            sku: {
                $in: [
                    "SAMSUNG-S25",
                    "SAMSUNG-A56",
                    "IPHONE-17",
                    "IPHONE-17-PRO",
                    "MACBOOK-AIR-M4",
                    "DELL-XPS-15",
                    "SONY-WH1000XM6",
                    "LG-OLED-C4",
                ],
            },
        });

        await Category.deleteMany({
            name: {
                $in: [
                    "Electronics",
                    "Mobiles",
                    "Android Phones",
                    "iPhones",
                    "Laptops",
                    "Audio",
                    "Televisions",
                ],
            },
        });

        await User.deleteMany({
            email: {
                $in: [
                    "john@example.com",
                    "jane@example.com",
                ],
            },
        });

        // --------------------------------------------------
        // USERS
        // --------------------------------------------------

        const customerPassword = await bcrypt.hash(
            "Customer@123",
            12
        );

        const customer1 = await User.create({
            name: "John Customer",
            email: "john@example.com",
            password: customerPassword,
            role: UserRole.CUSTOMER,
            isActive: true,
        });

        const customer2 = await User.create({
            name: "Jane Customer",
            email: "jane@example.com",
            password: customerPassword,
            role: UserRole.CUSTOMER,
            isActive: true,
        });

        // --------------------------------------------------
        // CATEGORIES
        // --------------------------------------------------

        const electronics = await Category.create({
            name: "Electronics",
            parent: null,
            isActive: true,
        });

        const mobiles = await Category.create({
            name: "Mobiles",
            parent: electronics._id,
            isActive: true,
        });

        const laptops = await Category.create({
            name: "Laptops",
            parent: electronics._id,
            isActive: true,
        });

        const audio = await Category.create({
            name: "Audio",
            parent: electronics._id,
            isActive: true,
        });

        const androidPhones = await Category.create({
            name: "Android Phones",
            parent: mobiles._id,
            isActive: true,
        });

        const iphones = await Category.create({
            name: "iPhones",
            parent: mobiles._id,
            isActive: true,
        });

        // --------------------------------------------------
        // PRODUCTS
        // --------------------------------------------------

        const products = await Product.insertMany([
            {
                name: "Samsung Galaxy S25",
                sku: "SAMSUNG-S25",
                description:
                    "Samsung Galaxy S25 smartphone with advanced performance and camera features.",
                price: 79999,
                salePrice: 74999,
                stock: 20,
                category: androidPhones._id,
                status: ProductStatus.ACTIVE,
            },

            {
                name: "Samsung Galaxy A56",
                sku: "SAMSUNG-A56",
                description:
                    "Samsung Galaxy A56 with a large display and long-lasting battery.",
                price: 45999,
                salePrice: 42999,
                stock: 35,
                category: androidPhones._id,
                status: ProductStatus.ACTIVE,
            },

            {
                name: "iPhone 17",
                sku: "IPHONE-17",
                description:
                    "Apple iPhone 17 with powerful performance and an advanced camera system.",
                price: 89999,
                salePrice: 84999,
                stock: 15,
                category: iphones._id,
                status: ProductStatus.ACTIVE,
            },

            {
                name: "iPhone 17 Pro",
                sku: "IPHONE-17-PRO",
                description:
                    "Apple iPhone 17 Pro with premium performance and professional camera capabilities.",
                price: 119999,
                salePrice: 114999,
                stock: 10,
                category: iphones._id,
                status: ProductStatus.ACTIVE,
            },

            {
                name: "MacBook Air M4",
                sku: "MACBOOK-AIR-M4",
                description:
                    "Apple MacBook Air powered by the M4 chip.",
                price: 114999,
                salePrice: 109999,
                stock: 12,
                category: laptops._id,
                status: ProductStatus.ACTIVE,
            },

            {
                name: "Dell XPS 15",
                sku: "DELL-XPS-15",
                description:
                    "Dell XPS 15 premium performance laptop.",
                price: 149999,
                salePrice: 139999,
                stock: 8,
                category: laptops._id,
                status: ProductStatus.ACTIVE,
            },

            {
                name: "Sony WH-1000XM6",
                sku: "SONY-WH1000XM6",
                description:
                    "Sony wireless noise-cancelling headphones.",
                price: 39999,
                salePrice: 34999,
                stock: 25,
                category: audio._id,
                status: ProductStatus.ACTIVE,
            },

            {
                name: "LG OLED C4",
                sku: "LG-OLED-C4",
                description:
                    "LG OLED 4K smart television with premium picture quality.",
                price: 139999,
                salePrice: 124999,
                stock: 6,
                category: electronics._id,
                status: ProductStatus.ACTIVE,
            },
        ]);

        // --------------------------------------------------
        // OUTPUT
        // --------------------------------------------------

        console.log("\nSeed completed successfully!\n");

        console.log("\nCustomers:");
        console.log(`${customer1._id} - john@example.com`);
        console.log(`${customer2._id} - jane@example.com`);
        console.log("Password: Customer@123");

        console.log("\nCategories:");

        console.log(`Electronics: ${electronics._id}`);
        console.log(`Mobiles: ${mobiles._id}`);
        console.log(`Android Phones: ${androidPhones._id}`);
        console.log(`iPhones: ${iphones._id}`);
        console.log(`Laptops: ${laptops._id}`);
        console.log(`Audio: ${audio._id}`);

        console.log("\nProducts:");

        products.forEach((product) => {
            console.log(
                `${product.name} | ${product.sku} | ${product._id}`
            );
        });

        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
};

seedData();
