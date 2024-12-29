import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/utils/asgardeo.server";

export const loader = () => redirect("/login");

export const action = ({ request }: ActionFunctionArgs) => {
  return authenticator.authenticate("asgardeo", request);
};