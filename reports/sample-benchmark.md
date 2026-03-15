# Sample Benchmark Report

Test Target: HTTP Test Endpoint  
Tool: k6  
Date: Initial Experiment

## Test Profile

- Virtual Users: 5
- Duration: 1 minute
- Scenario: constant load

## Results

| Metric | Value |
|------|------|
Average latency | 320 ms |
P95 latency | 540 ms |
Requests/sec | 14 |
Error rate | 0.2%

## Observations

- Latency remained stable during constant load
- Minor errors observed due to endpoint throttling
