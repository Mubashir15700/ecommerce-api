# E-Commerce REST API

A backend REST API for an e-commerce platform built with **Node.js, Express.js, TypeScript, MongoDB, and Mongoose**.

The API supports user authentication and role-based authorization, multi-level product categories, product management, and order management with stock validation.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Jest
- Supertest
- Swagger
- Docker

## Features

### Authentication & User Management

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control
- Admin and Customer roles
- View authenticated user profile
- Admin user management
- Activate/deactivate users

### Category Management

- Create, update, and delete categories
- Unlimited nested category levels
- Parent-child relationships
- Category hierarchy/tree API
- Validation against invalid/circular relationships

### Product Management

- Admin product CRUD
- Product fields:
  - Name
  - SKU
  - Description
  - Price
  - Sale price
  - Stock
  - Category
  - Status
- Customer product listing
- Search products
- Filter by category
- Filter by price range
- Sorting
- Pagination
- Parent-category filtering includes descendant categories

### Order Management

- Customers can place orders with multiple products
- Product and stock availability validation
- Backend price calculation
- Automatic stock reduction
- Customers can view their own orders
- Admin can view all orders
- Admin can update order status

Order status flow:

```text
Pending → Confirmed → Processing → Shipped → Delivered
                                      ↘ Cancelled
```

## Project Structure

```text
ecommerce-api/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── category.controller.ts
│   │   ├── product.controller.ts
│   │   └── order.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── logger.middleware.ts
│   │   ├── not-found.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── category.model.ts
│   │   ├── product.model.ts
│   │   └── order.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── category.routes.ts
│   │   ├── product.routes.ts
│   │   └── order.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── category.service.ts
│   │   ├── product.service.ts
│   │   └── order.service.ts
│   ├── utils/
│   │   ├── app-error.ts
│   │   └── async-handler.ts
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   ├── category.validator.ts
│   │   ├── product.validator.ts
│   │   └── order.validator.ts
│   ├── app.ts
│   └── server.ts
├── scripts/
│   ├── seed-admin.ts
│   └── seed-data.ts
├── tests/
│   ├── unit/
│   │   └── auth.service.test.ts
│   ├── integration/
│   │   ├── auth.test.ts
│   │   └── order.test.ts
│   └── setup.ts
├── postman/
│   ├── ecommerce-api.postman_collection.json
│   └── ecommerce-api.postman_environment.json
├── .env.example
├── .gitignore
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
└── tsconfig.test.json
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 20+
- MongoDB
- npm

### Installation

Clone the repository:

```bash
git clone <repository-url>
cd ecommerce-api
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
```

Do not commit `.env` to the repository.

An `.env.example` file is included to show the required environment variables.

### Run the Development Server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

### Health Check

```http
GET /api/health
```

Example response:

```json
{
  "success": true,
  "message": "E-commerce API is running"
}
```

## Available Scripts

```bash
npm run dev
```

Runs the development server with automatic restart.

```bash
npm run build
```

Compiles the TypeScript project.

```bash
npm start
```

Runs the compiled application.

```bash
npm test
```

Runs the test suite.

```bash
npm run test:watch
```

Runs tests in watch mode.

```bash
npm run test:coverage
```

Runs tests and generates a coverage report.

## API Documentation

Postman collection and environment files are included in the postman/ folder.

The folder contains:

- Postman collection JSON file
- Postman environment JSON file

Import both files into Postman to test the API endpoints.

## Authentication

Protected endpoints require a JWT access token.

Send the token using the `Authorization` header:

```http
Authorization: Bearer <token>
```

## User Roles

| Role | Description |
|---|---|
| `customer` | Can browse products, manage their profile, and place/view their own orders |
| `admin` | Can manage users, categories, products, and orders |

## Testing

The project uses:

- Jest for unit testing
- Supertest for API integration testing

Run:

```bash
npm test
```

## Docker

Docker support is included for running the API and MongoDB in containers.

Build and start the services:

```bash
docker compose up --build
```

Stop the services:

```bash
docker compose down
```

## Error Handling

The API follows consistent HTTP status codes and uses centralized error handling for:

- Validation errors
- Authentication errors
- Authorization errors
- Resource not found
- Duplicate resources
- Invalid requests
- Database errors

## Security

The API includes:

- JWT authentication
- Password hashing
- Role-based authorization
- Helmet security headers
- CORS configuration
- Environment-based secrets
- Input validation
