declare module "@portone/browser-sdk/v2" {
  interface PaymentRequest {
    storeId: string;
    channelKey: string;
    paymentId: string;
    orderName: string;
    totalAmount: number;
    currency: string;
    payMethod: string;
    [key: string]: unknown;
  }

  interface PaymentResponse {
    code?: string;
    message?: string;
    paymentId?: string;
    transactionType?: string;
    txId?: string;
  }

  export function requestPayment(
    params: PaymentRequest
  ): Promise<PaymentResponse>;
}
