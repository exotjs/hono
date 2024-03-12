# Benchmarks

## Run

Start the servers with Bun and run the bechmark for each scenario:

```sh
bun run baseline.ts
bun run trace-active.ts
bun run trace-disabled.ts
bun run trace-10x.ts
bun run inspector-disabled.ts
```

Run [bombardier](https://github.com/codesenberg/bombardier):

```sh
bombardier --fasthttp -c 100 -d 30s http://localhost:3000/
```

## Results

|Test|Change per request|
|----|------|
|Inspector deactivated|+0.24ms|
|Tracing disabled (metrics only)|+0.96ms|
|Tracing enabled (metrics + tracing)|+2.21ms|

### Baseline

```
Statistics        Avg      Stdev        Max
  Reqs/sec     60459.74    3765.83   68092.08
  Latency        1.65ms   169.48us    15.93ms
  HTTP codes:
    1xx - 0, 2xx - 1813761, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:    10.32MB/s
```

### Trace

#### Inspector deactivated

All instruments deactivated using `inspector.deactivate()`.

```
Statistics        Avg      Stdev        Max
  Reqs/sec     52987.28    2764.45   59752.47
  Latency        1.89ms   148.78us    16.42ms
  HTTP codes:
    1xx - 0, 2xx - 1589606, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:     9.04MB/s
```

#### Tracing disabled

Only tracing deactivated using `inspector.instruments.traces.deactivate()`. Server metrics are still enabled.

```
Statistics        Avg      Stdev        Max
  Reqs/sec     38323.91    2111.00   44467.22
  Latency        2.61ms   226.15us    25.20ms
  HTTP codes:
    1xx - 0, 2xx - 1149801, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:     6.54MB/s
```

#### Tracing enabled

Tracing and server metrics enabled.

```
Statistics        Avg      Stdev        Max
  Reqs/sec     25888.03    3396.47   33243.14
  Latency        3.86ms   581.49us    21.25ms
  HTTP codes:
    1xx - 0, 2xx - 776809, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:     4.42MB/s
```

#### Tracing enabled with 10 nested traces

Statistics        Avg      Stdev        Max
  Reqs/sec     14969.42    1197.50   17193.54
  Latency        6.68ms   628.20us    26.74ms
  HTTP codes:
    1xx - 0, 2xx - 449113, 3xx - 0, 4xx - 0, 5xx - 0
    others - 0
  Throughput:     2.56MB/s