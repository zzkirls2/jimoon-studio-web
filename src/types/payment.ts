export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  status: "pending" | "paid" | "cancelled" | "refunded";
  payment_id?: string;
  created_at: string;
}

export interface OrderItem {
  book_id: string;
  quantity: number;
  price: number;
}
