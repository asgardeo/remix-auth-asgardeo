import type { LoaderFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/utils/asgardeo.server";

export const loader = ({ request }: LoaderFunctionArgs) => {
  return authenticator.authenticate("asgardeo", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
};