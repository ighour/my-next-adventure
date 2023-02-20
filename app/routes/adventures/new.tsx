import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";

import { getAdventureTemplateListItems } from "~/models/adventure-template.server";
import { createAdventure } from "~/models/adventure.server";
import { checkUsersExistsByEmail, getUserById } from "~/models/user.server";
import { requireUser } from "~/session.server";

export async function loader() {
  const adventureTemplateListItems = await getAdventureTemplateListItems();
  return json({ adventureTemplateListItems });
}

export async function action({ request }: ActionArgs) {
  const user = await requireUser(request);

  const formData = await request.formData();
  const adventureTemplateId = formData.get("adventureTemplateId");
  const participants = formData.get("participants");

  const errorFields = {
    adventureTemplateId: null,
    participants: null
  }

  if (typeof adventureTemplateId !== "string" || adventureTemplateId.length === 0) {
    return json(
      { errors: { ...errorFields, adventureTemplateId: "You need to select an Adventure Template" } },
      { status: 400 }
    );
  }

  if (typeof participants !== "string" || participants.trim().length === 0) {
    return json(
      { errors: { ...errorFields, participants: "You need to add other participants e-mails separated by comma" } },
      { status: 400 }
    );
  }

  const otherUsersEmail = participants.trim().split(",");

  if (!(await checkUsersExistsByEmail(otherUsersEmail))) {
    return json(
      { errors: { ...errorFields, participants: "One or more participants were not found" } },
      { status: 400 }
    );
  }

  if (otherUsersEmail.includes(user.email)) {
    return json(
      { errors: { ...errorFields, participants: "You cannot add yourself" } },
      { status: 400 }
    );
  }

  const adventure = await createAdventure({ adventureTemplateId, userId: user.id, otherUsersEmail });

  return redirect(`/adventures/${adventure.id}`);
}

export default function NewAdventurePage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const adventureTemplateRef = React.useRef<HTMLSelectElement>(null);
  const participantsRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.adventureTemplateId) {
      adventureTemplateRef.current?.focus();
    }
    if (actionData?.errors?.participants) {
      participantsRef.current?.focus();
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
          <div className="pt-1 text-red-700" id="adventure-template-id-error">
            {actionData.errors.adventureTemplateId}
          </div>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Participants (emails separated by comma): </span>
          <input
            ref={participantsRef}
            name="participants"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.participants ? true : undefined}
            aria-errormessage={
              actionData?.errors?.participants ? "participants-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.participants && (
          <div className="pt-1 text-red-700" id="participants-error">
            {actionData.errors.participants}
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
