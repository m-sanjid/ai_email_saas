# AI Email SaaS Platform

A powerful AI-powered email template builder with real email sending capabilities.

## Features

- **AI-Generated Templates**: Create professional email templates with just a few clicks using our AI assistant
- **Drag-and-Drop Editor**: Easily customize your templates with our intuitive drag-and-drop editor
- **Real Email Testing**: Test your emails before sending to ensure they look perfect on all devices
- **Email Sending**: Send your templates as real emails through SMTP integration
- **Template Sharing**: Share your templates with team members or clients
- **Responsive Design**: All templates are mobile-responsive and look great on any device
- **User Authentication**: Secure user authentication with Google OAuth
- **Dashboard**: Monitor your email statistics and template usage

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, shadcn/ui
- **Authentication**: Google OAuth
- **Database**: Convex
- **Email**: Nodemailer
- **Animation**: Motion One

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Copy `.env.example` to `.env.local` and fill in the required environment variables:

```bash
cp .env.example .env.local
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

- `SMTP_HOST`: SMTP server host (e.g., smtp.gmail.com)
- `SMTP_PORT`: SMTP server port (e.g., 587)
- `SMTP_SECURE`: Whether to use TLS (true/false)
- `SMTP_USER`: SMTP username/email
- `SMTP_PASSWORD`: SMTP password or app password
- `DEFAULT_FROM_EMAIL`: Default sender email address
- `NEXT_PUBLIC_BASE_URL`: Base URL of your application
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `NEXT_PUBLIC_CONVEX_URL`: Convex database URL

## Email Testing

To test email sending functionality:

1. Set up your SMTP credentials in the `.env.local` file
2. Create an email template in the editor
3. Use the "Send Test Email" button to send a test email
4. For Gmail, you need to use an app password. [Learn more](https://support.google.com/accounts/answer/185833?hl=en)

## Deployment

This project can be deployed on [Vercel](https://vercel.com/) or any other hosting provider that supports Next.js applications.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## PROJECT DESCRIPTION

This is a AI email SAAS project in which you can create good looking emails from scratch using AI or choose from available templete

THis is project from a tutorial
