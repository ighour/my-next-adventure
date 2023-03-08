import type { LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/adventures");
  }
  return redirect("/join")
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}
