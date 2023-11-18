import axios from "axios";
import qs from "qs";

const LOCAL_BACKEND_URI = "http://python:8002"
const BACKEND_URI = "http://192.168.137.17:8002"

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

