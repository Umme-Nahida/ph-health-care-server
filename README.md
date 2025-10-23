<h4>How to Implement Stripe in Your Project<h4/>


Step-1: Visit this site https://stripe.com and create a free account.
Step-2: install stripe in your project using this command 

# go to Dashboard → Developers → API keys and copy the Publishable key & Secret key
# add Publishable key & Secret key in your .env file


Step 3: Create a Stripe instance 

create src/config/stripe.ts and write this text below in your strive file

import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27", // বা latest version
});

Step 4: Payment Intent API বানাও

right now create a route, that will created a Stripe payment intent get the amount from req or frontend 


Step 5: Frontend 
Call backend payment api from frontent after completing the backend using frontend SDK of Stripe

Step 6: ।

💾 Step 6: Payment success হলে appointment save করো

যখন payment confirm হয়ে যাবে, তখন তোমার backend /appointment route-এ গিয়ে appointment তৈরি করে দিও, এবং সেখানে paymentStatus: "paid" রাখো।

🚀 Bonus Tips:

Stripe Dashboard এ test mode চালু করে নাও, তাহলে dummy card দিয়ে টেস্ট করতে পারবে:
👉 4242 4242 4242 4242 (expiry যেকোনো future date, CVC যেকোনো 3 digit)

Prisma দিয়ে Payment বা Appointment টেবিলে status update করো।











How to Add Open AI in your project: 
1. install open AI and add openAi configuration in your config file or others file as your wish
2. add added api key in your env file 
3. get symptoms in your aiSuggestions service folder
4. create a prompt using chatgpt for getting a result 
5. add completion
6. convert response in a json format 



