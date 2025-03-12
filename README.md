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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## How to setup project

1. Go to Google Cloud and select your project (ie Meal Tracker)
2. Click on "Service Accounts" in the hamburger menu
3. Click the "Keys" tab
4. Click the "Add key" dropdown and select the "Create new key" option
5. In the modal, select the "JSON" key type and click the "Create" button
6. Your browser will automatically downloads the file
7. Move the file into the root diretory of this project
8. Rename the json file to "credentials.json"
9. Duplicate the ".env.example" file and rename it to ".env"
10. Get the spreadsheet ID from the spreadsheet url
11. Paste it after "SPREADSHEET_ID=" in the ".env" file
12. Go into the spreadsheet in your browser, click the "Share" button
13. Paste the "client_email" from the "credentials.json" file into the field
14. Uncheck "Notify people" and click the "Send" button