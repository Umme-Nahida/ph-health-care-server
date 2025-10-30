import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME,
    jwt_secret: process.env.JWT_SECRET,
    jwt_expire_in: process.env.JWT_EXPIRES_IN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_expire_in: process.env.JWT_EXPIRES_IN_REFRESH,
    reset_pass_secret: process.env.RESET_PASS_TOKEN,
        reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    open_router_api_key: process.env.OPEN_ROUTER_API_KEY,
    stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
    stripe_secret_key: process.env.STRIPE_PUBLISHABLE_SECRET_KEY,
    stripe_webhook_secret: process.env.Stripe_Webhook_Scret,
    emailSender: {
        email: process.env.EMAIL,
        app_pass: process.env.APP_PASS
    },
    salt_round: process.env.SALT_ROUND,
    reset_pass_link: process.env.RESET_PASS_LINK
}