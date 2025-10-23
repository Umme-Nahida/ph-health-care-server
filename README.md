<h2>How to Implement Stripe in Your Project</h2>


<h3>✅Step-1:</h3> Visit this site https://stripe.com and create a free account.


<h3>✅Step-2: install stripe in your project</h3>

 👉go to Dashboard → Developers → API keys and copy the Publishable key & Secret key
 👉add Publishable key & Secret key in your .env file


<h3>✅Step-3: Create a Stripe instance</h3> 

### 🧾 Stripe Configuration

```typescript
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27", // বা latest version
});
```


<h3>✅Step 4: Make Payment Intent API</h3> 

right now create a route, that will created a Stripe payment intent get the amount from req or frontend 

```typescript
import express, { Request, Response } from "express";
import { stripe } from "../config/stripe";

const router = express.Router();

router.post("/create-payment-intent", async (req: Request, res: Response) => {
  try {
    const { amount } = req.body; // amount টাকা হিসেবে নেবে (যেমন 500 = 500 taka)

    // Stripe amount নেয় *paisa/cents* এ, তাই ×100 করো
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "bdt", // বা "usd"
      payment_method_types: ["card"],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment intent error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;

```


<h3>✅Step 5: Frontend </h3> 
Call backend payment api from frontent after completing the backend using frontend SDK of Stripe


```typescript
const res = await fetch("/api/create-payment-intent", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ amount: 500 }),
});

const data = await res.json();
const clientSecret = data.clientSecret;

```

<h3>✅Step 6: Save the appointment after successful payment</h3> 


When the payment is confirmed, go to your backend /appointment route and create the appointment record.
Make sure to set paymentStatus: "paid" in the database.

🚀 Bonus Tips:

Enable Test Mode in your Stripe Dashboard so you can test using dummy cards.
👉 Use the test card: 4242 4242 4242 4242 (any future expiry date, and any 3-digit CVC).

Use Prisma to update the status field in the Payment or Appointment table.











How to Add Open AI in your project: 
1. install open AI and add openAi configuration in your config file or others file as your wish
2. add added api key in your env file 
3. get symptoms in your aiSuggestions service folder
4. create a prompt using chatgpt for getting a result 
5. add completion
6. convert response in a json format 



