import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 5 },
    { duration: "10s", target: 50 }, // sudden spike
    { duration: "30s", target: 5 }
  ]
};

export default function () {
  http.get("https://httpbin.org/get");
  sleep(1);
}
