import { OrderStatus } from "../models/order.model";

interface CreateOrderItemInput {
    product: string;
    quantity: number;
}

export interface CreateOrderInput {
    items: CreateOrderItemInput[];
}

export interface UpdateOrderStatusInput {
    status: OrderStatus;
}
