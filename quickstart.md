
# Quickstart Guide for Auth0 Next.js V4 SDK (Beta)

This guide will walk you through integrating **Auth0 authentication** into your Next.js application using the **Auth0 Next.js V4 SDK (beta)**. By the end of this guide, you’ll have a fully functional authentication system in your Next.js app, complete with sign-up, login, and logout functionality. We’ll also explain key concepts and logic to help beginners understand how everything works.

---

## 1. Configure Your Auth0 Tenant

### What is a Tenant?

A **tenant** in Auth0 is an isolated environment where you manage your applications, users, and settings. Think of it as a workspace for your app’s authentication needs.

### Steps:

1. **Log in to Auth0**: Go to the [Auth0 Dashboard](https://manage.auth0.com/) and log in or sign up for an account.
    
2. **Create a Tenant**: If you don’t already have one, create a tenant. This will be your app’s authentication environment.
    
3. **Add an Application**:
    
    - In the Auth0 Dashboard, navigate to **Applications > Applications**.
        
    - Click **Create Application**.
        
    - Choose **Regular Web Applications** as the application type (since we’re building a Next.js app).
        
    - Click **Create**.
        
4. **Configure Redirect and Logout URLs**:
    
    - In your application settings, scroll down to the **Application URIs** section.
        
    - Add the following URLs:
        
        - **Allowed Callback URLs**: `http://localhost:3000/auth/callback`
            
            - This is where Auth0 will redirect users after they log in.
                
        - **Allowed Logout URLs**: `http://localhost:3000`
            
            - This is where Auth0 will redirect users after they log out.
                
    - Save your changes.
        

---

## 2. Install the SDK

The **Auth0 Next.js V4 SDK** simplifies integrating Auth0 into your Next.js app. It handles authentication flows, session management, and more.

Run the following command to install the SDK:

bash

Copy

npm install @auth0/nextjs-auth0@beta

---

## 3. Add Environment Variables

Environment variables are used to securely store sensitive information like your Auth0 credentials. Create a `.env.local` file in the root of your project and add the following:

env

Copy

AUTH0_DOMAIN=your-auth0-domain
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_SECRET=a-random-secret-string
APP_BASE_URL=http://localhost:3000

### Explanation:

- **AUTH0_DOMAIN**: Your Auth0 tenant domain (e.g., `your-tenant.auth0.com`).
    
- **AUTH0_CLIENT_ID** and **AUTH0_CLIENT_SECRET**: These are provided in your Auth0 application settings.
    
- **AUTH0_SECRET**: A random string used to encrypt the session cookie. You can generate one using a tool like `openssl rand -hex 32`.
    
- **APP_BASE_URL**: The base URL of your Next.js app (e.g., `http://localhost:3000`).
    

---

## 4. Create the Auth0 SDK Client

The `Auth0Client` is the core of the SDK. It provides methods for handling authentication, sessions, and user data.

Create a file named `auth0.ts` in the `src/lib` directory and add the following code:

typescript

Copy

import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client();

### What’s Happening Here?

- We import the `Auth0Client` class from the SDK.
    
- We create an instance of `Auth0Client` and export it as `auth0`. This instance will be used throughout your app to interact with Auth0.
    

---

## 5. Add the Authentication Middleware

Middleware in Next.js allows you to run code before a request is completed. In this case, we’ll use it to enforce authentication on specific routes.

Create a `middleware.ts` file in the root of your project (or inside the `src` directory if you’re using one):

typescript

Copy

import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

### Explanation:

- The `middleware` function intercepts incoming requests and applies Auth0’s authentication logic.
    
- The `matcher` configuration ensures that the middleware runs on all routes except for static files and metadata.
    

---

## 6. Add the Landing Page Content

The landing page (`src/app/page.tsx`) is where users will interact with your app. It will display different content based on whether the user is logged in or not.

Update the `src/app/page.tsx` file with the following code:

tsx

Copy

import { auth0 } from "@/lib/auth0";
import './globals.css';

export default async function Home() {
  // Fetch the user session
  const session = await auth0.getSession();

  // If no session, show sign-up and login buttons
  if (!session) {
    return (
      <main className="page">
        <a href="/auth/login?screen_hint=signup">
          <button className="white">Sign up</button>
        </a>
        <a href="/auth/login">
          <button>Log in</button>
        </a>
      </main>
    );
  }

  // If session exists, show a welcome message and logout button
  return (
    <main>
      <h1>Welcome, {session.user.name}!</h1>
      <p>
        <a href="/auth/logout">
          <button>Log out</button>
        </a>
      </p>
    </main>
  );
}

### Explanation:

- **`auth0.getSession()`**: This method checks if the user is logged in by retrieving their session. If no session exists, it returns `null`.
    
- **Conditional Rendering**:
    
    - If there’s no session, the app displays **Sign up** and **Log in** buttons.
        
    - If a session exists, the app displays a welcome message with the user’s name and a **Log out** button.
        

---

## 7. Add Logout Functionality

The logout functionality is already included in the `page.tsx` file. When the user clicks the **Log out** button, they are redirected to the Auth0 logout endpoint, which clears their session and redirects them back to your app.

---

## 8. Run Your Application

Start your Next.js development server:

bash

Copy

npm run dev

Visit `http://localhost:3000` in your browser. You should see:

- A **Sign up** and **Log in** button if the user is not authenticated.
    
- A welcome message and a **Log out** button if the user is authenticated.