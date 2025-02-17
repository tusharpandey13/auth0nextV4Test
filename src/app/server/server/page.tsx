import { auth0 } from "@/lib/auth0";
import Profile from "@/app/components/Profile";

export default async function DashboardPage() {
  let accessToken: string = "";
  let fcat: string = "";
  try {
    const session = await auth0.getSession();
    if (session){
      accessToken = (await auth0.getAccessToken()).token;
      fcat = (await auth0.getFederatedConnectionAccessToken({connection: "google-oauth2"})).token;
    }
    let events = [];
    let error = null;

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${new Date().toISOString()}&maxResults=10&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${fcat}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch events: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      events = data.items || [];
    } catch (e: any) {
      error = e.message || "Failed to fetch events.";
      // console.error("Error fetching Google Calendar events:", e);
    }

    return (
      <Profile
        isLoading={false}
        events = {events}
        error = {error}
        accessToken={accessToken}
        user={session?.user}
        pageType=""
      />
    );
  } catch (error) {
    return <>{JSON.stringify(error)}</>;
  }
}
