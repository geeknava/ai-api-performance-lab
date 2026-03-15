import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 3,
  duration: "1m"
};

const url = "http://localhost:11434/api/generate";

const payload = JSON.stringify({
  model: "llama3",
  prompt: "Explain performance testing in simple words.",
  stream: false
});

const params = {
  headers: {
    "Content-Type": "application/json"
  }
};

export default function () {
  const res = http.post(url, payload, params);

  check(res, {
    "status is 200": (r) => r.status === 200
  });

  sleep(1);
}
