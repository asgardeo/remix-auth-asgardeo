import { Form } from "@remix-run/react";

export default function Login() {
    return (
      <>
      <Form action="/auth/asgardeo" method="post">
        <button>Login with Asgardeo</button>
      </Form>
      </>
    );
  }
  