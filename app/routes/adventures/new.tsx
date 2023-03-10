import type { ActionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import * as React from "react";
import { useState } from "react";

import { getAdventureTemplateListItems } from "~/models/adventure-template.server";
import { createAdventureFromTemplate } from "~/models/adventure.server";
import { requireUser } from "~/session.server";

import defaultCoverImage from "~/assets/adventure_cover.png";

export async function loader() {
    const adventureTemplateListItems = await getAdventureTemplateListItems();
    return json({ adventureTemplateListItems });
}

export async function action({ request }: ActionArgs) {
    const user = await requireUser(request);

    const formData = await request.formData();
    const adventureTemplateId = formData.get("adventureTemplateId");

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

    const adventure = await createAdventureFromTemplate({ adventureTemplateId, userId: user.id });

    return redirect(`/adventures/${adventure.id}`);
}

export const meta: MetaFunction = () => {
    return {
        title: "New Adventure",
    };
};

export default function NewAdventurePage() {
    const data = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const adventureTemplateIdRef = React.useRef<HTMLSelectElement>(null);
    const [selectedAdventureTemplateId, setSelectedAdventureTemplateId] = useState(data.adventureTemplateListItems[0].id);

    React.useEffect(() => {
        if (actionData?.errors?.adventureTemplateId) {
            adventureTemplateIdRef.current?.focus();
        }
    }, [actionData]);

    const onChangeAdventureTemplate = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAdventureTemplateId(event.target.value)
    }

    const selectedAdventureTemplate = data.adventureTemplateListItems.find(atli => atli.id === selectedAdventureTemplateId);

    return (
        <div className="mx-auto w-full max-w-md px-8">
            <h2 className="text-2xl mb-5">Create an Adventure</h2>
            <Form
                method="post"
                className="space-y-6"
            >
                <div className="form-control w-full">
                    <label className="label" htmlFor="adventure-template-id">
                        <span className="label-text">Adventure Edition</span>
                    </label>
                    <select
                        ref={adventureTemplateIdRef}
                        id="adventureTemplateId"
                        required
                        autoFocus={true}
                        name="adventureTemplateId"
                        className={clsx("select select-bordered", `${actionData?.errors?.adventureTemplateId ? "select-error" : ""}`)}
                        aria-invalid={actionData?.errors?.adventureTemplateId ? true : undefined}
                        aria-errormessage={
                            actionData?.errors?.adventureTemplateId ? "adventure-template-id-error" : undefined
                        }
                        onChange={onChangeAdventureTemplate}
                    >
                        {data.adventureTemplateListItems.map(template =>
                            <option key={template.id} value={template.id}>{template.title}</option>
                        )}
                    </select>
                    {actionData?.errors?.adventureTemplateId && (
                        <div className="pt-1 text-red-700" id="adventure-template-id-error">
                            {actionData.errors.adventureTemplateId}
                        </div>
                    )}
                </div>

                {selectedAdventureTemplate &&
                    <div>
                        <div className="card w-96 h-96 overflow-hidden bg-base-100 shadow-xl image-full">
                            <figure><img src={selectedAdventureTemplate.coverImage ?? defaultCoverImage} alt="Shoes" /></figure>
                            <div className="card-body">
                                <div>
                                    <p className="mb-3 font-bold">{selectedAdventureTemplate.maxJoiners + 1} adventurers</p>
                                    <p>{selectedAdventureTemplate.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <button
                    type="submit"
                    className="btn btn-block btn-circle btn-primary"
                >
                    Create
                </button>
            </Form>
        </div>
    );
}
