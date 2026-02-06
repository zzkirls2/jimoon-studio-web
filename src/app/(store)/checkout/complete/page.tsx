"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FadeIn from "@/components/animations/FadeIn";

function CompleteContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen pt-32 flex flex-col items-center justify-center px-6">
      <FadeIn>
        <div className="text-center max-w-md">
          {/* Checkmark */}
          <div className="w-16 h-16 rounded-full border-2 border-green-500 flex items-center justify-center mx-auto mb-8">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-extralight text-neutral-900 mb-4">
            Order Complete
          </h1>

          <p className="text-sm text-neutral-400 leading-relaxed mb-3">
            Thank you for your purchase. Your order has been confirmed
            and will be shipped within 2-3 business days.
          </p>

          {orderId && (
            <p className="text-xs text-neutral-300 mb-10">
              Order ID: {orderId}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/books"
              className="inline-block border border-neutral-900 text-neutral-900 px-8 py-3 text-sm tracking-[0.1em] uppercase hover:bg-neutral-900 hover:text-white transition-all duration-300"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="text-sm text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

export default function CheckoutCompletePage() {
  return (
    <Suspense>
      <CompleteContent />
    </Suspense>
  );
}
