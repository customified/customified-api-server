import { Order } from "@/Models/Order";
import { Stores } from "@/Models/Store";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongo/connectDB";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string, orderId: string } }
) {
  try {
    const session = await auth();
    const user = session?.user?.name;

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.orderId) {
      return new NextResponse("Order ID is Required", { status: 400 });
    }

    await dbConnect() 

    const storeByUserId = await Stores.findOne({
      admin: user,
      _id: params.storeId,
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const order = await Order.deleteOne({
      _id: params.orderId,
    });

    return NextResponse.json(order, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.log('[ORDER_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    if (!params.orderId) {
      return new NextResponse("Order ID is Required", { status: 400 });
    }

    await dbConnect();

    const order = await Order.findOne({
      _id: params.orderId,
    }).lean();

    return NextResponse.json(order, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.log('[ORDER_GET]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
