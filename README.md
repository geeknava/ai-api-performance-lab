# AI API Performance Lab

Goal: Benchmark latency, throughput, and error behavior of public AI APIs under load.

Why this project?
AI APIs behave very differently from traditional REST APIs:
- cold starts
- rate limits
- dynamic latency
- token quotas
- async model loading

This lab provides reusable k6 scripts for benchmarking AI inference endpoints.

Current Status
Testing HuggingFace + OpenAI endpoints.
Encountered routing + permission issues (documented in /docs).

This repo will continuously publish findings + benchmarks.
