import { Authenticator } from "remix-auth";
import { AsgardeoStrategy } from "@asgardeo/remix-auth-asgardeo";
import { createCookieSessionStorage } from "@remix-run/node";

interface User {
    id: string;
    name: string;
}

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ["s3cr3t"], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

// Create an instance of the authenticator, pass a generic with what your
// strategies will return and will be stored in the session
export const authenticator = new Authenticator<User>(sessionStorage);

const asgardeoStrategy = new AsgardeoStrategy(
  {
    authorizedRedirectUrl: "http://localhost:5173/auth/asgardeo/callback",
    clientID: process.env.ASGARDEO_CLIENT_ID ?? "",
    clientSecret: process.env.ASGARDEO_CLIENT_SECRET ?? "",
    baseUrl: process.env.ASGARDEO_BASE_URL ?? "",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    console.log({accessToken, refreshToken, extraParams})
    // Get the user data from your DB or API using the tokens and profile
    return {
        id: 'djjd',
        name: profile.displayName
    } as User;
  }
);

authenticator.use(asgardeoStrategy);

// you can also export the methods individually for your own usage
export const { getSession, commitSession, destroySession } = sessionStorage;