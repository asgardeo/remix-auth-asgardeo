import type { ActionFunctionArgs } from "@remix-run/node";

import { redirect } from "@remix-run/node";

import { destroySession, getSession } from "../utils/asgardeo.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const logoutURL = new URL(process.env.ASGARDEO_LOGOUT_URL ?? "");

  logoutURL.searchParams.set("client_id", process.env.ASGARDEO_CLIENT_ID ?? "");
  logoutURL.searchParams.set("returnTo", process.env.ASGARDEO_RETURN_TO_URL ?? "");

  return redirect(logoutURL.toString(), {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
