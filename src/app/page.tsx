"use client"

import './globals.css';
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl mb-12"><b>nextjs-auth0</b><br></br> Federated Connections Demo</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-0 max-w-lg bg-white rounded-lg border border-gray-300">
        <Link href="/server/server" className="block p-10 hover:bg-blue-500 hover:text-white group rounded-lg">
          <h2 className="text-2xl font-semibold group-hover:text-white">Google Calendar Events</h2>
          <p className="mt-2 text-gray-600 group-hover:text-white">Fetch GCalendar events using Google's federated connection access token</p>
        </Link>
      </div>
    </main>
  );
}
