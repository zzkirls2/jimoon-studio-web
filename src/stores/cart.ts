import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book } from "@/types/book";

export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (book) => {
        const { items } = get();
        const existing = items.find((item) => item.book.id === book.id);

        if (existing) {
          set({
            items: items.map((item) =>
              item.book.id === book.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { book, quantity: 1 }] });
        }
      },

      removeItem: (bookId) => {
        set({ items: get().items.filter((item) => item.book.id !== bookId) });
      },

      updateQuantity: (bookId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.book.id === bookId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.book.price * item.quantity,
          0
        ),
    }),
    {
      name: "publisher-cart",
    }
  )
);
