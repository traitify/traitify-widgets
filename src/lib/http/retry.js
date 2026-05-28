export const DEFAULT_RETRY_OPTIONS = {
  backoffFactor: 2,
  exceptions: ["TypeError"],
  interval: 500,
  intervalRandomness: 0.5,
  max: 5,
  maxInterval: Number.MAX_SAFE_INTEGER,
  methods: ["delete", "get", "head", "options", "post", "put"],
  statuses: [429]
};

const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

const computeDelay = (attempt, options) => {
  const base = options.interval * (options.backoffFactor ** attempt);
  const jitter = base * options.intervalRandomness * Math.random();

  return Math.min(base + jitter, options.maxInterval);
};

const shouldRetry = ({attempt, error, method, options, response}) => {
  if(attempt >= options.max) { return false; }
  if(options.retryIf) { return options.retryIf({attempt, error, response}); }
  if(!options.methods.includes(method.toLowerCase())) { return false; }
  if(error) { return options.exceptions.includes(error.name); }
  if(response) { return options.statuses.includes(response.status); }

  return false;
};

const withRetry = ({fetch, method, options}) => {
  const merged = {...DEFAULT_RETRY_OPTIONS, ...options};

  const attempt = (attemptNumber) => fetch()
    .then((response) => ({response}))
    .catch((error) => ({error}))
    .then(({error, response}) => {
      if(shouldRetry({attempt: attemptNumber, error, method, options: merged, response})) {
        if(merged.retryBlock) { merged.retryBlock({attempt: attemptNumber, error, response}); }

        return delay(computeDelay(attemptNumber, merged)).then(() => attempt(attemptNumber + 1));
      }

      if(error) { throw error; }

      return response;
    });

  return attempt(0);
};

export default withRetry;
