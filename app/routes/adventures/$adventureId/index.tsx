import type { LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader({ request, params }: LoaderArgs) {
  return redirect("challenges")
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}
