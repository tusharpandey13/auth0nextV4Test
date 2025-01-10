import { auth0 } from "@/lib/auth0"

import './globals.css';

export default async function Home() {
  const session = await auth0.getSession()

  if (!session) {
    return (
      <main className="page">
        <a href="/auth/login?screen_hint=signup"><button className="white">Sign up</button></a>
        <a href="/auth/login"><button>Log in</button></a>
      </main>
    )
  }

  return (
    <main>
      <h1>Welcome, {session.user.name}!</h1>
      <p><a href="/auth/logout"><button>Log out</button></a></p>
    </main>
  )
}
