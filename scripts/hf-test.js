import http from "k6/http";
import { check, sleep } from "k6";

/*
  ENV VARIABLES
  Run like:
  k6 run -e HF_TOKEN=xxx scripts/hf-test.js
*/

const TOKEN = __ENV.HF_TOKEN;
const MODEL = __ENV.MODEL || "gpt2";
const BASE_URL =
  __ENV.BASE_URL ||
  `https://router.huggingface.co/hf-inference/models/${MODEL}`;

/*
  LOAD PROFILE
*/
export const options = {
  vus: 3,
  duration: "1m",
  thresholds: {
    http_req_duration: ["p(95)<5000"],
    http_req_failed: ["rate<0.1"]
  }
};

/*
  REQUEST BODY
*/
const payload = JSON.stringify({
  inputs: "Explain performance testing in simple words.",
  parameters: {
    max_new_tokens: 50,
    temperature: 0.7
  }
});

/*
  HEADERS
*/
const params = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json"
  }
};

/*
  TEST EXECUTION
*/
export default function () {
  const res = http.post(BASE_URL, payload, params);

  check(res, {
    "status is success": (r) => r.status === 200 || r.status === 503 || r.status === 429,
    "response received": (r) => r.body && r.body.length > 0
  });

  sleep(1);
}
