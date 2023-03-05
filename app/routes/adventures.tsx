import { Outlet } from "@remix-run/react";

import Navbar from "~/components/Navbar";

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
