import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { paymentId, orderId, amount } = body;

  if (!paymentId || !amount) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    // PortOne 서버 API로 결제 검증
    // 실제 운영 시 아래 로직을 활성화
    //
    // const response = await fetch(
    //   `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
    //   {
    //     headers: {
    //       Authorization: `PortOne ${process.env.PORTONE_API_SECRET}`,
    //     },
    //   }
    // );
    // const payment = await response.json();
    //
    // if (payment.status === "PAID" && payment.amount.total === amount) {
    //   // Supabase에 주문 정보 저장
    //   return NextResponse.json({ success: true, paymentId, orderId });
    // } else {
    //   return NextResponse.json(
    //     { error: "Payment verification failed" },
    //     { status: 400 }
    //   );
    // }

    // 데모 모드: 항상 성공
    return NextResponse.json({
      success: true,
      paymentId,
      orderId,
      amount,
      message: "Payment confirmed (demo mode)",
    });
  } catch {
    return NextResponse.json(
      { error: "Payment confirmation failed" },
      { status: 500 }
    );
  }
}
