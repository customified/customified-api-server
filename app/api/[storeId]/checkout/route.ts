import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { dbConnect } from "@/lib/mongo/connectDB";
import { Order } from "@/Models/Order";
import { SessionMetadata } from "@/Models/Metadata";
import { IUpgrade } from "@/Models/Upgrade";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

interface CartItem {
  id: string;
  product: {
    id: string;
    image: string;
    name: string;
  };
  category: string | null;
  quantity: number;
  productSize: string | undefined;
  quantities: { [key: string]: number };
  upgrades: { [key: string]: IUpgrade };
  unitCost: number | string;
  totalCost: number;
  design?: {
    front: {
        userdesign : string | null;
        textproperties: Array<{ text: string; fontFamily: string; fill: string }> | null;
        imagesInDesign: string[] | null;
    } | null ,
    back: {
        userdesign : string | null;
        textproperties:  Array<{ text: string; fontFamily: string; fill: string }> | null;
        imagesInDesign: string[] | null;
    } | null
}
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { cartItems, user, isExistingOrder, orderId } = await req.json();

  if (!user || !user.name || !user.email) {
    return new NextResponse("User information is required", { status: 400 });
  }

  await dbConnect();

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let order;

  if (isExistingOrder) {
    // Fetch the existing order
    order = await Order.findById(orderId);
    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Prepare line_items from the existing order
    order.orderItems.forEach((orderItem: any) => {
      line_items.push({
        quantity: orderItem.product.quantity,
        price_data: {
          currency: "USD",
          product_data: {
            name: orderItem.product.name,
            images: [orderItem.product.image],
          },
          unit_amount: Number(orderItem.product.unitCost) * 100,
        },
      });
    });
  } else {
    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return new NextResponse("Cart items are required", { status: 400 });
    }
  
    cartItems.forEach((cartItem: CartItem) => {
      line_items.push({
        quantity: cartItem.quantity,
        price_data: {
          currency: "USD",
          product_data: {
            name: cartItem.product.name,
            images: [cartItem.product.image],
          },
          unit_amount: Math.round(Number(cartItem.unitCost) * 100),
        },
      });
    });

    // Store metadata in the database
    const metadata = await SessionMetadata.create({
      storeId: params.storeId,
      userName: user.name,
      userEmail: user.email,
      cartItems: JSON.stringify(cartItems), 
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: {
        metadataId: metadata._id.toString(), 
      },
    });

    return NextResponse.json({ url: session.url }, {
      headers: corsHeaders,
    });
  }
}
