"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/stores/cart";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/books/data";
import FadeIn from "@/components/animations/FadeIn";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clearCart);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderInfo, setOrderInfo] = useState({
    name: user?.user_metadata?.name || "",
    phone: "",
    address: "",
    addressDetail: "",
    zipcode: "",
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center px-6">
        <FadeIn>
          <div className="text-center">
            <div className="w-16 h-px bg-neutral-300 mx-auto mb-8" />
            <h1 className="text-3xl font-extralight text-neutral-900 mb-4">
              No Items to Checkout
            </h1>
            <p className="text-sm text-neutral-400 mb-8">
              Add some books to your cart first.
            </p>
            <Link
              href="/books"
              className="inline-block border border-neutral-900 text-neutral-900 px-8 py-3 text-sm tracking-[0.1em] uppercase hover:bg-neutral-900 hover:text-white transition-all duration-300"
            >
              Browse Books
            </Link>
          </div>
        </FadeIn>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!orderInfo.name || !orderInfo.phone || !orderInfo.address) {
      setError("모든 필수 항목을 입력해 주세요.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const paymentId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

      // PortOne v2 SDK 동적 로드
      let PortOne: typeof import("@portone/browser-sdk/v2") | null = null;
      try {
        PortOne = await import("@portone/browser-sdk/v2");
      } catch {
        PortOne = null;
      }

      if (!PortOne) {
        // PortOne SDK 미설치 시 데모 모드
        await simulateDemoPayment(paymentId);
        return;
      }

      const response = await PortOne.requestPayment({
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID!,
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!,
        paymentId,
        orderName:
          items.length === 1
            ? items[0].book.title
            : `${items[0].book.title} 외 ${items.length - 1}건`,
        totalAmount: totalPrice(),
        currency: "CURRENCY_KRW",
        payMethod: "CARD",
      });

      if (response && !response.code) {
        // 서버에서 결제 검증
        const confirmRes = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentId,
            orderId: paymentId,
            amount: totalPrice(),
          }),
        });

        if (confirmRes.ok) {
          clearCart();
          router.push(`/checkout/complete?orderId=${paymentId}`);
        } else {
          setError("결제 확인에 실패했습니다. 고객센터에 문의해 주세요.");
        }
      } else {
        setError(response?.message || "결제가 취소되었습니다.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "결제 처리 중 오류가 발생했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const simulateDemoPayment = async (paymentId: string) => {
    // 데모: 2초 대기 후 완료 처리
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearCart();
    router.push(`/checkout/complete?orderId=${paymentId}`);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-5xl mx-auto px-6 md:px-12">
      <FadeIn>
        <h1 className="text-3xl md:text-4xl font-extralight text-neutral-900 mb-2">
          Checkout
        </h1>
        <p className="text-sm text-neutral-400 mb-12">
          Complete your order
        </p>
      </FadeIn>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Shipping Info */}
        <div className="lg:col-span-2">
          <FadeIn delay={0.1}>
            <h2 className="text-xs tracking-[0.15em] uppercase text-neutral-400 mb-6">
              Shipping Information
            </h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={orderInfo.name}
                    onChange={(e) =>
                      setOrderInfo({ ...orderInfo, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-400 transition-colors"
                    placeholder="수령인 이름"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={orderInfo.phone}
                    onChange={(e) =>
                      setOrderInfo({ ...orderInfo, phone: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-400 transition-colors"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 mb-2">
                    Zipcode
                  </label>
                  <input
                    type="text"
                    value={orderInfo.zipcode}
                    onChange={(e) =>
                      setOrderInfo({ ...orderInfo, zipcode: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-400 transition-colors"
                    placeholder="우편번호"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={orderInfo.address}
                    onChange={(e) =>
                      setOrderInfo({ ...orderInfo, address: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-400 transition-colors"
                    placeholder="기본 주소"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs tracking-[0.1em] uppercase text-neutral-400 mb-2">
                  Detail Address
                </label>
                <input
                  type="text"
                  value={orderInfo.addressDetail}
                  onChange={(e) =>
                    setOrderInfo({
                      ...orderInfo,
                      addressDetail: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm focus:outline-none focus:border-neutral-400 transition-colors"
                  placeholder="상세 주소 (동/호수)"
                />
              </div>
            </div>
          </FadeIn>

          {/* Order Items */}
          <FadeIn delay={0.2}>
            <h2 className="text-xs tracking-[0.15em] uppercase text-neutral-400 mb-6 mt-12">
              Order Items
            </h2>
            <div className="divide-y divide-neutral-100">
              {items.map((item) => (
                <div
                  key={item.book.id}
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <p className="text-sm text-neutral-900">{item.book.title}</p>
                    <p className="text-xs text-neutral-400">
                      {item.book.author} &middot; Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm text-neutral-700">
                    {formatPrice(item.book.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <FadeIn delay={0.25}>
            <div className="bg-neutral-50 p-8 sticky top-28">
              <h2 className="text-xs tracking-[0.15em] uppercase text-neutral-400 mb-6">
                Payment Summary
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-neutral-200">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="text-neutral-700">
                    {formatPrice(totalPrice())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Shipping</span>
                  <span className="text-neutral-700">Free</span>
                </div>
              </div>

              <div className="flex justify-between mb-8">
                <span className="text-sm font-medium text-neutral-900">
                  Total
                </span>
                <span className="text-lg font-extralight text-neutral-900">
                  {formatPrice(totalPrice())}
                </span>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-3.5 bg-neutral-900 text-white text-sm tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : `Pay ${formatPrice(totalPrice())}`}
              </button>

              <p className="mt-4 text-[10px] text-neutral-400 text-center leading-relaxed">
                By completing your purchase, you agree to our Terms of Service
                and Privacy Policy.
              </p>

              <Link
                href="/cart"
                className="block mt-4 text-xs text-neutral-400 hover:text-neutral-700 transition-colors text-center"
              >
                Back to Cart
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
