import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Auth Asgardeo Demo" },
    { name: "description", content: "This application demonstrates the usage of remix asgardeo strategy to secure Remix applications" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to the Remix Auth Asgardeo demo</h1>
      <ul>
        <li>
          <a
            href="/login"
            rel="noreferrer"
          >
            Login
          </a>
        </li>
      </ul>
    </div>
  );
}
