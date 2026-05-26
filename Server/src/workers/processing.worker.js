const { parentPort } = require('worker_threads');

/**
 * Perform heavy/CPU-intensive arithmetic task
 * @param {Object} data - Input payload (e.g. number of iterations)
 */
const runHeavyTask = (data) => {
  const start = Date.now();
  const iterations = data.iterations || 50000000; // Default count
  let accumulator = 0;

  for (let i = 0; i < iterations; i++) {
    accumulator += Math.sqrt(i) * Math.sin(i);
  }

  const durationMs = Date.now() - start;

  return {
    accumulator,
    durationMs,
    processedItems: iterations,
    timestamp: new Date().toISOString(),
  };
};

// Listen for message events from the main thread
if (parentPort) {
  parentPort.on('message', (message) => {
    try {
      const result = runHeavyTask(message);
      parentPort.postMessage({ success: true, result });
    } catch (error) {
      parentPort.postMessage({ success: false, error: error.message });
    }
  });
}
