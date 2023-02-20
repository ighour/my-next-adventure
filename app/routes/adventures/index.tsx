import { Link } from "@remix-run/react";

export default function AdventureIndexPage() {
  return (
    <p>
      No adventure selected. Select an adventure on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        start a new adventure.
      </Link>
    </p>
  );
}
