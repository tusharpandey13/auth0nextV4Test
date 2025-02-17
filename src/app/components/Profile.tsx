import { User } from "@auth0/nextjs-auth0/types";

type ProfileProps = Readonly<{
  isLoading: boolean;
  user: User | undefined | null;
  pageType: string;
  accessToken: string | null;
  events: any[];
  error: string | null;
}>;

export default function Profile({
  isLoading,
  user,
  pageType,
  accessToken,
  events,
  error,
}: ProfileProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Show the original login page UI
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="grid grid-cols-1 gap-4 p-4 min-w-lg max-w-lg">
          <div className="col-span-1">
            <div className="flex items-center justify-center">
              <div className="p-8 rounded-lg w-full max-w-md border border-gray-100 bg-white">
                <h1 className="text-l mb-8 text-center inter text-gray-600">
                  {pageType}
                </h1>
                <div className="flex flex-col space-y-4">
                  <a href="/auth/login?screen_hint=signup">
                    <button className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 px-6 py-3 text-lg w-full transition duration-300 inter">
                      Sign up
                    </button>
                  </a>
                  <a href="/auth/login">
                    <button className="bg-gray-600 text-white rounded-lg hover:bg-gray-700 px-6 py-3 text-lg w-full transition duration-300 inter">
                      Log in
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
          {accessToken && (
            <div className="col-span-1">
              <p>Access Token:</p>
              <code className="block overflow-x-auto bg-gray-100 p-2 rounded whitespace-nowrap">
                {accessToken}
              </code>
            </div>
          )}
        </div>
      </div>
    );
  }

  // User is logged in, show profile and calendar
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                User Profile
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Welcome, {user.name}!
              </p>
            </div>
            <a href="/auth/logout">
              <button className="bg-red-600 text-white rounded-lg hover:bg-red-700 px-6 py-3 text-sm transition duration-300">
                Log out
              </button>
            </a>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Google Calendar Events
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {events.length === 0 && !error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">No events found.</span>
            </div>
          )}

          <ul className="shadow-sm rounded-md divide-y divide-gray-200">
            {events.map((event) => (
              <li key={event.id} className="px-6 py-4 bg-white hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">{event.summary}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(event.start.dateTime || event.start.date).toLocaleString()}
                    </p>
                  </div>
                  {event.location && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {event.location}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
