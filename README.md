This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Firebase configuration

Before starting the app, configure the Firebase Web app values in
`.env.local`. In the [Firebase console](https://console.firebase.google.com/),
open project `m-edai`, go to **Project settings > Your apps**, select the Web
app, and copy its configuration values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_web_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=m-edai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=m-edai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=m-edai.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=366802840585
NEXT_PUBLIC_FIREBASE_APP_ID=your_web_app_id
```

Replace the placeholder API key in `.env.local` with the actual `apiKey`
value, then restart the development server. The API key is a browser Firebase
credential, but restrict it to the required APIs and allowed web origins in
Google Cloud Console.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
