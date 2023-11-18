import axios from "axios";
import qs from "qs";
import { env } from "~/env.mjs";

export const helloCall = async (params: {
  query_string: string, offset: number, search_type: string,
}) => {
  const { data } = await axios.get<{
    resultString: string;
  }>(env.BACKEND_URI, {
    params,
    timeout: 8000,
    headers: {
      Accept: "application/json", // Specify that we want JSON in return
    },
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
  });
  return data;
};

