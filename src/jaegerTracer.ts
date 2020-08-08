import * as opentracing from 'opentracing';

const initJaegerTracer = require('jaeger-client').initTracer;

export let tracer;
export let isJaegerActive = false;

export function init(serviceName: string, host: string) {
  const config = {
    serviceName: serviceName,
    sampler: {
      type: 'probabilistic',
      param: 1,
    },
    reporter: {
      logSpans: true,
      agentHost: host,
      agentPort: '6832',
    },
  };
  const options = {
    logger: {
      info: function logInfo(msg: string) {
        console.log('INFO  ', msg);
      },
      error: function logError(msg: string) {
        console.log('ERROR ', msg);
      },
    },
  };
  isJaegerActive = true;
  return initJaegerTracer(config, options);
}
export function jaegerTracerInit(serviceName, host) {
  tracer = init(serviceName, host) as opentracing.Tracer;
}

export function jaegerCreate(
  controller: string,
  operation: string,
  headers: any,
) {
  if (!isJaegerActive) return null;
  let traceSpan: opentracing.Span;
  // NOTE: OpenTracing type definitions at
  // <https://github.com/opentracing/opentracing-javascript/blob/master/src/tracer.ts>
  const parentSpanContext = tracer.extract(opentracing.FORMAT_HTTP_HEADERS);
  const tags = {
    [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_SERVER,
    method: controller,
    headers,
  };
  if (parentSpanContext) {
    traceSpan = tracer.startSpan(operation, {
      childOf: parentSpanContext,
      tags,
    });
  } else {
    console.log('startSpan - no headers');
    traceSpan = tracer.startSpan(operation, {
      tags,
    });
  }
  return traceSpan;
}

function finishSpanWithResult(
  span: opentracing.Span,
  status: number,
  errorTag?: boolean,
) {
  if (!isJaegerActive) return null;
  span.setTag(opentracing.Tags.HTTP_STATUS_CODE, status);
  if (errorTag) {
    span.setTag(opentracing.Tags.ERROR, true);
  }
  span.finish();
}

export function jaegerError(span: opentracing.Span, status = 500) {
  finishSpanWithResult(span, status, true);
}

export function jaegerSuccess(span: opentracing.Span, status = 200) {
  finishSpanWithResult(span, status);
}

export function createSchemaSpan(
  schemaName: string,
  operation: string,
  parentSpan?: opentracing.Span,
) {
  if (parentSpan) {
    return tracer.startSpan(operation, {
      childOf: parentSpan,
      tags: {
        [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_SERVER,
        [opentracing.Tags.COMPONENT]: schemaName,
      },
    });
  } else {
    return tracer.startSpan(operation, {
      tags: {
        [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_SERVER,
        [opentracing.Tags.COMPONENT]: schemaName,
      },
    });
  }
}

export async function traceMongoQuery(
  parentSpan: opentracing.Span,
  traceName: string,
  documentQuery: any,
) {
  if (!isJaegerActive) {
    return await documentQuery;
  }
  const traceSpan = tracer.startSpan(traceName, {
    childOf: parentSpan,
    tags: {
      [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_RPC_SERVER,
      [opentracing.Tags.COMPONENT]: 'mongodb',
    },
  });
  const documentResult = await documentQuery;
  traceSpan.finish();
  return documentResult;
}
