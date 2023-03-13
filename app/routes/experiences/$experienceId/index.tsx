import { redirect } from "@remix-run/node";

export async function loader() {
  return redirect("challenges")
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}
