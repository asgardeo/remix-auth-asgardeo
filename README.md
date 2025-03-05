<h1 align="center" style="color: #343a40;margin: 20px 0;">
  <p align="center">Remix Auth Asgardeo</p>
</h1>

<div align="center">
  <a href="https://github.com/asgardeo/remix-auth-asgardeo/actions/workflows/release.yml"><img src="https://github.com/asgardeo/remix-auth-asgardeo/actions/workflows/release.yml/badge.svg" alt="🚀 Release"></a>
  <a href="https://github.com/asgardeo/remix-auth-asgardeo/actions/workflows/builder.yml"><img src="https://github.com/asgardeo/remix-auth-asgardeo/actions/workflows/builder.yml/badge.svg" alt="🧱 Builder"></a>
  
  <a href="https://stackoverflow.com/questions/tagged/wso2is"><img src="https://img.shields.io/badge/Ask%20for%20help%20on-Stackoverflow-orange" alt="Stackoverflow"></a>
  <a href="https://discord.gg/wso2"><img src="https://img.shields.io/badge/Join%20us%20on-Discord-%23e01563.svg" alt="Discord"></a>
  <a href="https://github.com/asgardeo/remix-auth-asgardeo/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License"></a>
  <a href="https://twitter.com/intent/follow?screen_name=wso2"><img src="https://img.shields.io/twitter/follow/wso2.svg?style=social&label=Follow" alt="Twitter"></a>
</div>

<br>

[Remix Auth](https://remix.run/resources/remix-auth) is a flexible authentication framework for [Remix](https://remix.run/) applications that allows developers to implement various strategies for user authentication.

The Asgardeo strategy is a custom implementation of the [OAuth2Strategy](https://github.com/sergiodxa/remix-auth-oauth2) designed specifically for integrating with [Asgardeo](https://wso2.com/asgardeo), an identity-as-a-service (IDaaS) platform. This strategy enables developers to authenticate users against an Asgardeo organization using OpenID Connect (OIDC).

## Supported runtimes

| Runtime    | Has Support |
| ---------- | ----------- |
| Node.js    | ✅          |
| Cloudflare | ✅          |

## How to use

### Install the dependency

Using NPM:

```shell
npm i @asgardeo/remix-auth-asgardeo
```

Using Yarn:

```shell
yarn add @asgardeo/remix-auth-asgardeo
```

Using PNPM:

```shell
pnpm add @asgardeo/remix-auth-asgardeo
```

Using Bun:

```shell
bun add @asgardeo/remix-auth-asgardeo
```

### Create an Asgardeo organization

Head over to [Asgardeo](https://wso2.com/asgardeo) and sign up for an organization.

### Register an application

Follow the steps on the [Asgardeo documentation](https://wso2.com/asgardeo/docs/guides/applications/register-oidc-web-app/) to create an application and get the client ID, and client secret. Provide the following values when required.

 - Authorized redirect URL: `http://localhost:5173/auth/asgardeo/callback`
 - Allowed origins: `http://localhost:5173`

### Create the Asgardeo strategy instance

```ts
// app/utils/asgardeo.server.ts
import { Authenticator } from "remix-auth";
import { AsgardeoStrategy } from "remix-auth-asgardeo";

// Create an instance of the authenticator, pass a generic with what your
// strategies will return and will be stored in the session
export const authenticator = new Authenticator<User>(sessionStorage);

let asgardeoStrategy = new AsgardeoStrategy(
  {
    authorizedRedirectUrl: "http://localhost:5173/auth/asgardeo/callback",
    clientID: "YOUR_ASGARDEO_CLIENT_ID",
    clientSecret: "YOUR_ASGARDEO_CLIENT_SECRET",
    baseUrl: "https://api.asgardeo.io/t/<YOUR_ASGARDEO_ORG_NAME>",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    return User.findOrCreate({ email: profile.emails[0].value });
  }
);

authenticator.use(asgardeoStrategy);
```

### Setup application routes

```ts
// app/routes/login.tsx
export default function Login() {
  return (
    <Form action="/auth/asgardeo" method="post">
      <button>Login with Asgardeo</button>
    </Form>
  );
}
```

```ts
// app/routes/auth.asgardeo.tsx
import type { ActionFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/utils/asgardeo.server";

export let loader = () => redirect("/login");

export let action = ({ request }: ActionFunctionArgs) => {
  return authenticator.authenticate("asgardeo", request);
};
```

```ts
// app/routes/auth.asgardeo.callback.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/utils/asgardeo.server";

export let loader = ({ request }: LoaderFunctionArgs) => {
  return authenticator.authenticate("asgardeo", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
};
```

```ts
// app/routes/auth.logout.ts
import type { ActionFunctionArgs } from "@remix-run/node";

import { redirect } from "@remix-run/node";

import { destroySession, getSession } from "~/utils/asgardeo.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const logoutURL = new URL(process.env.ASGARDEO_LOGOUT_URL); // i.e https://api.asgardeo.io/t/pavinduorg/oidc/logout

  logoutURL.searchParams.set("client_id", process.env.ASGARDEO_CLIENT_ID);
  logoutURL.searchParams.set("returnTo", process.env.ASGARDEO_RETURN_TO_URL);

  return redirect(logoutURL.toString(), {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
```

## Contribute
Please read [Contributing Guide](CONTRIBUTING.md) for details on how to contribute to Remix Auth Asgardeo. Refer to [General Contribution Guidelines](http://wso2.github.io/) for details on our code of conduct, and the process for submitting pull requests to us.

### Reporting issues
We encourage you to report issues, improvements, and feature requests creating [Github Issues](https://github.com/asgardeo/remix-auth-asgardeo/issues).

**Important**: Please be advised that security issues MUST be reported to <a href="mailto:security@wso2.com">security@wso2com</a>, not as GitHub issues, in order to reach the proper audience. We strongly advise following the WSO2 Security Vulnerability Reporting Guidelines when reporting the security issues.

## License
This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
