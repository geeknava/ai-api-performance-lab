import http from "k6/http";
import { check, sleep } from "k6";

/*
  CONFIG — set these via environment variables
  Example run:
  k6 run -e OPENAI_API_KEY=xxx scripts/openai-test.js
*/

const API_KEY = __ENV.OPENAI_API_KEY;
const BASE_URL = __ENV.BASE_URL || "https://api.openai.com/v1/chat/completions";
const MODEL = __ENV.MODEL || "gpt-3.5-turbo";

/*
  LOAD PROFILE
*/
export const options = {
  vus: 5,
  duration: "1m",
  thresholds: {
    http_req_duration: ["p(95)<3000"],
    http_req_failed: ["rate<0.05"]
  }
};

/*
  REQUEST PAYLOAD
*/
const payload = JSON.stringify({
  model: MODEL,
  messages: [
    { role: "user", content: "Explain performance testing in one sentence." }
  ],
  max_tokens: 50
});

/*
  HEADERS
*/
const params = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
};

/*
  TEST EXECUTION
*/
export default function () {
  const res = http.post(BASE_URL, payload, params);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "has response body": (r) => r.body && r.body.length > 0
  });

  sleep(1);
}
