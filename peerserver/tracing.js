/*tracing.js*/  
const opentelemetry = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations, } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter, } = require("@opentelemetry/exporter-trace-otlp-proto");
const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-proto");
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { ExpressInstrumentation } = require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { Resource } = require("@opentelemetry/resources");

var jaegerServiceName = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: "evolua-microservice-peerserver",
})

    const sdk = new opentelemetry.NodeSDK({
    traceExporter: new OTLPTraceExporter({
      // optional - default url is http://localhost:4318/v1/traces
      url: "http://192.168.15.3:4318/v1/traces",
      // optional - collection of custom headers to be sent with each request, empty by default
      headers: {},
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
      url: 'http://192.168.15.3:4318/v1/metrics', // url is optional and can be omitted - default is http://localhost:4318/v1/metrics
      headers: {}, // an optional object containing custom headers to be sent with each request
      concurrencyLimit: 1, // an optional limit on pending requests
      }),
    }),
   // instrumentations: [getNodeAutoInstrumentations()],
      instrumentations: [
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
        new MongoDBInstrumentation(),
      ],
    });

    sdk.addResource(jaegerServiceName)
    sdk.start();

