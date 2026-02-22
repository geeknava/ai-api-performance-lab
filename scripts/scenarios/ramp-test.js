import http from "k6/http";
import { check, sleep } from "k6";

/*
  ENV VARIABLES
  Example run:
  k6 run -e API_KEY=xxx -e PROVIDER=openai scripts/scenarios/ramp-test.js
*/

const PROVIDER = __ENV.PROVIDER || "openai";
const API_KEY = __ENV.API_KEY;
const MODEL = __ENV.MODEL || "gpt-3.5-turbo";

/*
  ENDPOINT CONFIG
*/
const endpoints = {
  openai: {
    url: "https://api.openai.com/v1/chat/completions",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: "Explain load testing briefly." }],
      max_tokens: 40
    })
  },

  huggingface: {
    url: `https://router.huggingface.co/hf-inference/models/${MODEL}`,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: "Explain load testing briefly.",
      parameters: { max_new_tokens: 40 }
    })
  }
};

const target = endpoints[PROVIDER];

/*
  STAGED LOAD PROFILE
*/
export const options = {
  stages: [
    { duration: "30s", target: 2 },   // warmup
    { duration: "1m", target: 5 },    // light load
    { duration: "1m", target: 10 },   // moderate
    { duration: "1m", target: 20 },   // stress
    { duration: "30s", target: 0 }    // cooldown
  ],

  thresholds: {
    http_req_duration: ["p(95)<6000"],
    http_req_failed: ["rate<0.1"]
  }
};

/*
  EXECUTION
*/
export default function () {
  const res = http.post(target.url, target.body, { headers: target.headers });

  check(res, {
    "valid status": (r) => [200, 429, 503].includes(r.status),
    "response received": (r) => r.body && r.body.length > 0
  });

  sleep(1);
}
