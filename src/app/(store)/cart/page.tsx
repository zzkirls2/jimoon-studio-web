"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cart";
import { formatPrice } from "@/lib/books/constants";
import FadeIn from "@/components/animations/FadeIn";

const COVER_COLORS: Record<string, string> = {
  "1": "#e8e0d4",
  "2": "#d4dce8",
  "3": "#dce8d4",
  "4": "#e8d4d4",
  "5": "#d4e8e4",
  "6": "#e4dce8",
};

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const totalItems = useCartStore((s) => s.totalItems);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center px-6">
        <FadeIn>
          <div className="text-center">
            <div className="w-16 h-px bg-[#e8c4b8]/30 mx-auto mb-8" />
            <h1 className="text-3xl font-extralight text-black mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-sm text-black/60 mb-8">
              Discover our collection and find your next read.
            </p>
            <Link
              href="/books"
              className="inline-block border border-[#5d6a7a] text-[#5d6a7a] px-8 py-3 text-sm tracking-[0.1em] uppercase hover:bg-[#b5737a] hover:text-white hover:border-[#b5737a] transition-all duration-300"
            >
              Browse Books
            </Link>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-5xl mx-auto px-6 md:px-12">
      <FadeIn>
        <h1 className="text-3xl md:text-4xl font-extralight text-black mb-2">
          Shopping Cart
        </h1>
        <p className="text-sm text-black/60 mb-12">
          {totalItems()} {totalItems() === 1 ? "item" : "items"}
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Items */}
        <div className="lg:col-span-2 space-y-0 divide-y divide-[#e8c4b8]/30">
          {items.map((item, i) => (
            <FadeIn key={item.book.id} delay={i * 0.05}>
              <div className="flex gap-6 py-8 first:pt-0">
                {/* Mini cover */}
                <div
                  className="w-20 h-28 flex-shrink-0 rounded-sm"
                  style={{
                    backgroundColor:
                      COVER_COLORS[item.book.id] || "#e5e5e5",
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/books/${item.book.id}`}
                        className="text-sm font-light text-black hover:text-black/60 transition-colors line-clamp-1"
                      >
                        {item.book.title}
                      </Link>
                      <p className="text-xs text-black/50 mt-0.5">
                        {item.book.author}
                      </p>
                    </div>
                    <p className="text-sm text-black/70 whitespace-nowrap">
                      {formatPrice(item.book.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity */}
                    <div className="flex items-center border border-[#e8c4b8]/30">
                      <button
                        onClick={() =>
                          updateQuantity(item.book.id, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-black/50 hover:text-black transition-colors text-sm"
                      >
                        -
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center text-sm text-black/70 border-x border-[#e8c4b8]/30">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.book.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-black/50 hover:text-black transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.book.id)}
                      className="text-xs text-black/50 hover:text-red-500 transition-colors tracking-wider uppercase"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <FadeIn delay={0.2}>
            <div className="bg-[#fef9f3] p-8 sticky top-28">
              <h2 className="text-xs tracking-[0.15em] uppercase text-black/50 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-[#e8c4b8]/30">
                <div className="flex justify-between text-sm">
                  <span className="text-black/60">Subtotal</span>
                  <span className="text-black/70">
                    {formatPrice(totalPrice())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black/60">Shipping</span>
                  <span className="text-black/70">Free</span>
                </div>
              </div>

              <div className="flex justify-between mb-8">
                <span className="text-sm font-medium text-black">
                  Total
                </span>
                <span className="text-lg font-extralight text-black">
                  {formatPrice(totalPrice())}
                </span>
              </div>

              <Link
                href="/checkout"
                className="block w-full py-3.5 bg-[#5d6a7a] text-white text-sm tracking-[0.1em] uppercase text-center hover:bg-[#b5737a] transition-colors duration-300"
              >
                Proceed to Checkout
              </Link>

              <div className="mt-4 flex items-center justify-between">
                <Link
                  href="/books"
                  className="text-xs text-black/50 hover:text-[#b5737a] transition-colors"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs text-black/50 hover:text-red-500 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
