import type { LoaderArgs} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import Navbar from "~/components/Navbar";
import { getUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) {
    return redirect("/");
  }
  return json({});
}

export default function AdventuresPage() {
  return (
    <div className="flex flex-col">
      <Navbar />

      <main className="bg-base-200 p-6">
        <Outlet />
      </main>
    </div>
  );
}
