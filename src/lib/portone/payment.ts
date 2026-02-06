"use client";

interface PaymentRequest {
  storeId: string;
  channelKey: string;
  paymentId: string;
  orderName: string;
  totalAmount: number;
  currency: string;
  payMethod: string;
}

/**
 * PortOne v2 결제 요청
 * @portone/browser-sdk 설치 후 사용
 * npm install @portone/browser-sdk
 */
export async function requestPayment(params: PaymentRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PortOne: any = await import(
    /* webpackIgnore: true */ "@portone/browser-sdk/v2"
  ).catch(() => null);

  if (!PortOne) {
    throw new Error(
      "PortOne SDK not found. Install with: npm install @portone/browser-sdk"
    );
  }

  return PortOne.requestPayment(params);
}
