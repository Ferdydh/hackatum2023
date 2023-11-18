"use client";

import { api } from "~/trpc/react";

export function HelloComponent() {

  const { data, isLoading } = api.hello.hello.useQuery({ text: "dude" });

  return (
    <div>

      <button></button>

      {data && !isLoading &&
        <div>
          <span>{data.greeting}</span>
          <span>{data.python}</span>
        </div>}
    </div>
  );
}
