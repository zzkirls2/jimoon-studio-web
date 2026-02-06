import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, data } = body;

  // PortOne 웹훅 처리
  // type: "Transaction.Paid", "Transaction.Cancelled", etc.

  switch (type) {
    case "Transaction.Paid": {
      const { paymentId } = data;
      // Supabase에서 주문 상태를 "paid"로 업데이트
      // const supabase = createServerClient();
      // await supabase.from('orders').update({ status: 'paid' }).eq('payment_id', paymentId);
      console.log(`Payment confirmed via webhook: ${paymentId}`);
      break;
    }

    case "Transaction.Cancelled": {
      const { paymentId } = data;
      // 주문 취소 처리
      console.log(`Payment cancelled via webhook: ${paymentId}`);
      break;
    }

    default:
      console.log(`Unhandled webhook type: ${type}`);
  }

  return NextResponse.json({ received: true });
}
