<h3>How to Implement Stripe in Your Project</h3>


<h1>✅Step-1:</h1> Visit this site https://stripe.com and create a free account.


<h1>✅Step-2: install stripe in your project</h1>

 👉go to Dashboard → Developers → API keys and copy the Publishable key & Secret key
 👉add Publishable key & Secret key in your .env file


<h1>✅Step-3: Create a Stripe instance</h1> 

create src/config/stripe.ts and write this text below in your strive file

import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27", // বা latest version
});


<h1>✅Step 4: Make Payment Intent API</h1> 

right now create a route, that will created a Stripe payment intent get the amount from req or frontend 



<h1>✅Step 5: Frontend </h1> 
Call backend payment api from frontent after completing the backend using frontend SDK of Stripe

✅ Step 6: Save the appointment after successful payment

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



