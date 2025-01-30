import { User } from "@auth0/nextjs-auth0/types";

type ProfileProps = Readonly<{
  isLoading: boolean;
  user: User | undefined | null;
  pageType: string;
  accessToken: string | null;
}>;

export default function Profile({
  isLoading,
  user,
  pageType,
  accessToken,
}: ProfileProps) {
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="grid grid-cols-1 gap-4 p-4 min-w-lg max-w-lg">
        <div className="col-span-1">
          <div className="flex items-center justify-center">
            <div className="p-8 rounded-lg w-full max-w-md border border-gray-100 bg-white">
              <h1 className="text-l mb-8 text-center inter text-gray-600">
                {pageType} page
              </h1>
              {!user ? (
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
              ) : (
                <>
                  <div className="flex flex-col items-center mb-8 space-y-4">
                    <h1 className="text-3xl mb-8 text-center inter">
                      Welcome, {user.name}!
                    </h1>
                    <img
                      src={user.picture}
                      alt="User Avatar"
                      className="w-24 h-24 rounded-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-4">
                    <a href="/auth/logout">
                      <button className="bg-red-600 text-white rounded-lg hover:bg-red-700 px-6 py-3 text-lg w-full transition duration-300 inter">
                        Log out
                      </button>
                    </a>
                  </div>
                </>
              )}
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
