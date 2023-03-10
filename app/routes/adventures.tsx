import type { LoaderArgs, MetaFunction} from "@remix-run/node";
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

export const meta: MetaFunction = () => {
  return {
    title: "My Adventures",
  };
};

export default function AdventuresPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="bg-base-200 p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
