"use client"

import './globals.css';
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl mb-12"><b>nextjs-auth0</b> V4 Demo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-lg bg-white rounded-lg border border-gray-300">
        <Link href="/client" className="block p-10 border-b md:border-b-0 md:border-r border-gray-300 hover:bg-blue-500 hover:text-white group rounded-tl-lg rounded-bl-lg">
          <h2 className="text-2xl font-semibold group-hover:text-white">Client</h2>
          <p className="mt-2 text-gray-600 group-hover:text-white">Go to the client page</p>
        </Link>
        <Link href="/server/server" className="block p-10 hover:bg-blue-500 hover:text-white group rounded-tr-lg rounded-br-lg">
          <h2 className="text-2xl font-semibold group-hover:text-white">Server</h2>
          <p className="mt-2 text-gray-600 group-hover:text-white">Go to the server page</p>
        </Link>
      </div>
    </main>
  );
}
