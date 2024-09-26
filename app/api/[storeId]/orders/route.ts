import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo/connectDB";
import { Order } from "@/Models/Order";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await auth();
    const user = session?.user?.name;

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is Required", { status: 400 });
    }

    await dbConnect();

    const storeOrders = await Order.find({
      storeId: params.storeId,
    }).lean().sort({ createdAt: -1 });

    return NextResponse.json(storeOrders);
  } catch (error) {
    console.log("[ORDERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


