import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { helloCall } from "~/server/services/pythonConnection";

export const helloRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const result = await helloCall(input.text);

      return {
        greeting: `Hello ${input.text} from NextJS server`,
        python: `Hello ${result} from NextJS server`,
      };
    }),
});
