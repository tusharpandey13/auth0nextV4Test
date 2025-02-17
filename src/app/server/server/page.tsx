import { auth0 } from "@/lib/auth0";
import Profile from "@/app/components/Profile";

export default async function DashboardPage() {
  let accessToken: string = "";
  let fcat: string = "";
  let events = [];
  const error = null;
  try {
    const session = await auth0.getSession();
    if (session){
      // get auth0 accessToken
      accessToken = (await auth0.getAccessToken()).token;

      // get cached FCAT
      fcat = (await auth0.getFederatedConnectionAccessToken({connection: "google-oauth2"})).token;

      // get google calendar data
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
