import { deleteItem } from "@/app/actions";
import { useForm } from "@conform-to/react";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { redis } from "@/lib/redis";

// stripe webhook
export async function POST(req: Request) {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature") as string;

  let event;

  try {
    // construct the webhook
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_SECRET_WEBHOOK as string
    );
  } catch (error: unknown) {
    return new Response("Webhook Error", { status: 400 });
  }

  // for completed sessions
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      await prisma.order.create({
        data: {
          amount: session.amount_total as number,
          status: session.status as string,
          userId: session.metadata?.userId,
        },
      });

      // delete the item from the redis db
      await redis.del(`cart-${session.metadata?.userId}`);

      break;
    }
    default: {
      console.log("Unhandled event type");
    }
  }

  return new Response(null, { status: 200 });
}
