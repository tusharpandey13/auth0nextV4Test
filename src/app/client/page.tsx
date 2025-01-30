"use client";
import { useUser, getAccessToken } from "@auth0/nextjs-auth0";
import Profile from "../components/Profile";
import { useEffect, useState } from "react";

// fetch access token on client
async function fetchAccessToken() {
  try {
    return await getAccessToken();
  } catch (err) {
    console.log(err);
  }
}

export default function ClientPage() {
  // useUser hook
  const { user, isLoading, error } = useUser();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    fetchAccessToken().then(setAccessToken);
  }, []);

  return (
    <Profile
      user={user}
      isLoading={isLoading}
      pageType="Client"
      accessToken={accessToken}
    />
  );
}
