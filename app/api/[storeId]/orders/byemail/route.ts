import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo/connectDB";
import { Order } from "@/Models/Order";

export async function GET(
  req: Request
) {
  try {

    const url = new URL(req.url);
    const emailId = url.searchParams.get("emailId");

   
    if (!emailId) {
        return new NextResponse("Email ID is Required", { status: 400 });
      }

    await dbConnect();

    const orders = await Order.find({
        useremail: emailId,
      }).lean().sort({ createdAt: -1 });

      return NextResponse.json(orders, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
  } catch (error) {
    console.log('[ORDERS_GET_BY_EMAIL]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


