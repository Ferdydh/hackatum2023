import axios from "axios";
import qs from "qs";

const BACKEND_URI = "http://localhost:8002"

export const helloCall = async (params: {
  query_string: string
}) => {
  const { data } = await axios.get<{
    resultString: string;
  }>(BACKEND_URI + "/v1/hello/test", {
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

