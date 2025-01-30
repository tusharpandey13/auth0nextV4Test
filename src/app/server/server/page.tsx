import { auth0 } from "@/lib/auth0";
import Profile from "@/app/components/Profile";

export default async function DashboardPage() {
  let accessToken:string = "";
  try {
    const session = await auth0.getSession();
    if(session) accessToken = (await auth0.getAccessToken()).token;

    return (
      <Profile
        user={session?.user}
        isLoading={false}
        pageType="Server"
        accessToken={accessToken}
      />
    );
  } catch (error) {
    return <>{JSON.stringify(error)}</>;
  }
}
