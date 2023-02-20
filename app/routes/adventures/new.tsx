import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";

import { getAdventureTemplateListItems } from "~/models/adventure-template.server";
import { createAdventure } from "~/models/adventure.server";
import { requireUserId } from "~/session.server";

export async function loader() {
  const adventureTemplateListItems = await getAdventureTemplateListItems();
  return json({ adventureTemplateListItems });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const adventureTemplateId = formData.get("adventureTemplateId");

  if (typeof adventureTemplateId !== "string" || adventureTemplateId.length === 0) {
    return json(
      { errors: { adventureTemplateId: "You need to select an Adventure Template" } },
      { status: 400 }
    );
  }

  const adventure = await createAdventure({ adventureTemplateId, userId });

  return redirect(`/adventures/${adventure.id}`);
}

export default function NewAdventurePage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const adventureTemplateRef = React.useRef<HTMLSelectElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.adventureTemplateId) {
      adventureTemplateRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Adventure Template: </span>
          <select
            ref={adventureTemplateRef}
            name="adventureTemplateId"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.adventureTemplateId ? true : undefined}
            aria-errormessage={
              actionData?.errors?.adventureTemplateId ? "adventure-template-id-error" : undefined
            }
          >
            { data.adventureTemplateListItems.map(template =>
              <option key={template.id} value={template.id}>{template.title}</option>  
            )}
          </select>
        </label>
        {actionData?.errors?.adventureTemplateId && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.adventureTemplateId}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Start
        </button>
      </div>
    </Form>
  );
}
