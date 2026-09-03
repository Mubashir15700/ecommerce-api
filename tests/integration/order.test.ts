import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import app from "../../src/app";
import { User, UserRole } from "../../src/models/user.model";
import {
    Product,
    ProductStatus,
} from "../../src/models/product.model";
import { Category } from "../../src/models/category.model";
import { OrderStatus } from "../../src/models/order.model";

describe("Order Management - Create Order", () => {
    let customerToken: string;
    let productId: string;

    beforeAll(async () => {
        const hashedPassword = await bcrypt.hash("Password@123", 12);

        const customer = await User.create({
            name: "Test Customer",
            email: "customer@test.com",
            password: hashedPassword,
            role: UserRole.CUSTOMER,
            isActive: true,
        });

        customerToken = jwt.sign(
            {
                userId: customer._id.toString(),
                role: customer.role,
            },
            process.env.JWT_SECRET || "test_secret",
            {
                expiresIn: "1d",
            }
        );

        const category = await Category.create({
            name: "Electronics",
            parent: null,
            isActive: true,
        });

        const product = await Product.create({
            name: "Test Smartphone",
            sku: "TEST-PHONE-001",
            description: "Test smartphone for order testing",
            price: 1000,
            salePrice: 900,
            stock: 10,
            category: category._id,
            status: ProductStatus.ACTIVE,
        });

        productId = product._id.toString();
    }, 30000);

    it("should create an order successfully", async () => {
        const response = await request(app)
            .post("/api/orders")
            .set("Authorization", `Bearer ${customerToken}`)
            .send({
                items: [
                    {
                        product: productId,
                        quantity: 2,
                    },
                ],
            });

        expect(response.status).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Order created successfully"
        );

        expect(response.body.data).toBeDefined();

        expect(response.body.data.status).toBe(
            OrderStatus.PENDING
        );

        expect(response.body.data.totalAmount).toBe(1800);

        expect(response.body.data.items).toHaveLength(1);

        expect(response.body.data.items[0].name).toBe(
            "Test Smartphone"
        );

        expect(response.body.data.items[0].sku).toBe(
            "TEST-PHONE-001"
        );

        expect(response.body.data.items[0].price).toBe(900);

        expect(response.body.data.items[0].quantity).toBe(2);

        expect(response.body.data.items[0].subtotal).toBe(1800);

        const updatedProduct = await Product.findById(productId);

        expect(updatedProduct).not.toBeNull();
        expect(updatedProduct?.stock).toBe(8);
    }, 30000);
});
