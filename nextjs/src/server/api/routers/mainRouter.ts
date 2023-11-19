import { z } from "zod";
import { Directory } from "~/lib/types";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import axios from "axios";
import qs from "qs";

const LOCAL_BACKEND_URI = "http://python:8002/v1/api/";
const BACKEND_URI = "http://192.168.137.17:8002/v1/api/";

export const mainRouter = createTRPCRouter({
  get_project_directory: publicProcedure.query(async () => {
    const { data } = await axios.get<Directory[]>(
      BACKEND_URI + "get_project_directory",
    );

    // const { data } = await axios.get<Directory[]>(BACKEND_URI + "get_project_directory", {
    //   timeout: 8000,
    //   headers: {
    //     Accept: "application/json", // Specify that we want JSON in return
    //   },
    //   paramsSerializer: (params: any) =>
    //     qs.stringify(params, { arrayFormat: "repeat" }),
    // });

    return {
      root: data,
    };
  }),

  open_file: publicProcedure
    .input(z.object({ full_path: z.string() }))
    .query(async ({ input }) => {
      const { data } = await axios.post<string>(BACKEND_URI + "open_file", {
        full_path: input.full_path,
      });

      return {
        file_content: data,
      };
    }),

  new_file: publicProcedure
    .input(z.object({ full_path: z.string() }))
    .query(async ({ input }) => {
      const { data } = await axios.post<Directory[]>(BACKEND_URI + "new_file", {
        full_path: input.full_path,
      });

      return {
        root: data,
      };
    }),

  edit_file: publicProcedure
    .input(z.object({ full_path: z.string() }))
    .input(z.object({ new_contents: z.string() }))
    .query(async ({ input }) => {
      const { data } = await axios.post<boolean>(BACKEND_URI + "edit_file", {
        full_path: input.full_path,
        new_contents: input.new_contents,
      });

      return {
        success: data,
      };
    }),

  terminal_execute: publicProcedure
    .input(z.object({ command: z.string() }))
    .mutation(async ({ input }) => {
      type TerminalExecuteType = {
        output: string;
        new_project_directory: Directory[];
      };

      const { data } = await axios.post<TerminalExecuteType>(
        BACKEND_URI + "terminal_execute",
        {
          command: input.command,
        },
      );

      return {
        output: data.output,
        new_project_directory: data.new_project_directory,
      };
    }),
});
