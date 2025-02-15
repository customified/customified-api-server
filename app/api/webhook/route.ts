import { Stripe } from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from '@/lib/stripe';
import { dbConnect } from '@/lib/mongo/connectDB';
import { Order } from "@/Models/Order";
import { SessionMetadata } from "@/Models/Metadata";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(', ');

  if (event.type === "checkout.session.completed") {
    await dbConnect();

    const metadataId = session.metadata?.metadataId;
    if (!metadataId) {
      return new NextResponse("Invalid metadata ID", { status: 400 });
    }

    const metadata = await SessionMetadata.findById(metadataId);
    if (!metadata) {
      return new NextResponse("Metadata not found", { status: 404 });
    }

    const { storeId, userName, userEmail, cartItems } = metadata;
    const parsedCartItems = JSON.parse(cartItems);

    // Create the order
    await Order.create({
      storeId,
      isPaid: true,
      username: userName,
      useremail: userEmail,
      orderItems: parsedCartItems.map((cartItem: any) => ({
        product: {
          id: cartItem.product.id,
          name: cartItem.product.name,
          image: cartItem.product.image,
          category: cartItem.category,
          quantity: cartItem.quantity,
          productSize: cartItem.productSize,
          quantities: cartItem.quantities,
          upgrades: cartItem.upgrades,
          unitCost: cartItem.unitCost,
          totalCost: cartItem.totalCost,
          design: cartItem.design,
          orderNote: cartItem.orderNote,
        },
      })),
      address: addressString,
      phone: session?.customer_details?.phone || '',
      status: 'Order Placed',
    });

    // Delete the metadata after the order is created
    await SessionMetadata.findByIdAndDelete(metadataId);
  }

  return new NextResponse(null, { status: 200 });
}
