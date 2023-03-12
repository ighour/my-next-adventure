import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { getUserId, createUserSession } from "~/session.server";

import { createUser, createUserFromInvite, getUserByEmail, getUserByUsername } from "~/models/user.server";
import { safeRedirect, validateEmail, validateUsername } from "~/utils";
import { decrementInvite, getValidInvite } from "~/models/invite.server";
import { getJoinableAdventureByInviteId, joinAdventure } from "~/models/adventure.server";
import clsx from "clsx";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");
  const code = formData.get("code");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  const baseErrors = {
    email: null,
    username: null,
    password: null,
    code: null
  };

  if (!validateEmail(email)) {
    return json(
      { errors: { ...baseErrors, email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (!validateUsername(username)) {
    return json(
      { errors: { ...baseErrors, username: "Username is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { ...baseErrors, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { ...baseErrors, password: "Password is too short" } },
      { status: 400 }
    );
  }

  if (typeof code !== "string" || code.length === 0) {
    return json(
      { errors: { ...baseErrors, code: "Invite Code is required" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          ...baseErrors,
          email: "A user already exists with this email",
        },
      },
      { status: 400 }
    );
  }

  const existingUsername = await getUserByUsername(username);
  if (existingUsername) {
    return json(
      {
        errors: {
          ...baseErrors,
          username: "This username is already being used",
        },
      },
      { status: 400 }
    );
  }

  const { invite, error: inviteError } = await getValidInvite({ code });
  if (invite) {
    const user = await createUserFromInvite(email, username, password, code);
    // @TODO - create user and update invite in transaction
    await decrementInvite({ code })
    return createUserSession({
      request,
      userId: user.id,
      remember: false,
      redirectTo,
    });
  }

  const { adventure, error: adventureInviteError } = await getJoinableAdventureByInviteId({ inviteId: code });
  if (adventure) {
    const user = await createUser(email, username, password);
    const joinedAdventure = await joinAdventure({ id: adventure.id, userId: user.id });
    return createUserSession({
      request,
      userId: user.id,
      remember: false,
      redirectTo: `/adventures/${joinedAdventure.id}`,
    });
  }

  return json(
    {
      errors: {
        ...baseErrors,
        code: inviteError || adventureInviteError || "Invalid invite code",
      },
    },
    { status: 400 }
  );
}

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const codeRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.username) {
      usernameRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors?.code) {
      codeRef.current?.focus();
    }
  }, [actionData]);

  return (
    <main className="bg-base-200 p-6 min-h-screen flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold my-10 text-base-content">My Next Challenge</h2>
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <div className="form-control w-full">
            <label className="label" htmlFor="email">
              <span className="label-text">Email address</span>
            </label>
            <input
              ref={emailRef}
              id="email"
              required
              autoFocus={true}
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={actionData?.errors?.email ? true : undefined}
              aria-describedby="email-error"
              className={clsx("input input-bordered", `${actionData?.errors?.email ? "input-error" : ""}`)}
              placeholder="your@email.here"
            />
            {actionData?.errors?.email && (
              <div className="pt-1 text-red-700" id="email-error">
                {actionData.errors.email}
              </div>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label" htmlFor="password">
              <span className="label-text">Password</span>
            </label>
            <input
              ref={passwordRef}
              id="password"
              required
              name="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
              className={clsx("input input-bordered", `${actionData?.errors?.password ? "input-error" : ""}`)}
              placeholder="type here"
            />
            {actionData?.errors?.password && (
              <div className="pt-1 text-red-700" id="password-error">
                {actionData.errors.password}
              </div>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label" htmlFor="username">
              <span className="label-text">Username</span>
            </label>
            <input
              ref={usernameRef}
              id="username"
              required
              name="username"
              type="text"
              aria-invalid={actionData?.errors?.username ? true : undefined}
              aria-describedby="username-error"
              className={clsx("input input-bordered", `${actionData?.errors?.username ? "input-error" : ""}`)}
              placeholder="yourusername"
            />
            {actionData?.errors?.username && (
              <div className="pt-1 text-red-700" id="username-error">
                {actionData.errors.username}
              </div>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label" htmlFor="code">
              <span className="label-text">Invite Code</span>
            </label>
            <input
              ref={codeRef}
              id="code"
              required
              name="code"
              type="text"
              aria-invalid={actionData?.errors?.code ? true : undefined}
              aria-describedby="code-error"
              className={clsx("input input-bordered", `${actionData?.errors?.code ? "input-error" : ""}`)}
              placeholder="s2Ad1..."
            />
            {actionData?.errors?.code && (
              <div className="pt-1 text-red-700" id="code-error">
                {actionData.errors.code}
              </div>
            )}
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="btn btn-block btn-circle btn-primary"
          >
            Create Account
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-base-content">
              Already have an account?{" "}
              <Link
                className="link link-primary"
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Sign in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </main>
  );
}
