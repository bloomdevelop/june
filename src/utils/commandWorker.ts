import { parentPort, workerData } from "node:worker_threads";

(async () => {
  try {
    // Dynamic import of the command file
    const { file } = workerData;
    // Use absolute path for import
    const { default: cmd } = await import(file);

    if (!cmd || typeof cmd !== "object") {
      parentPort?.postMessage({ error: `Invalid export in ${file}` });
      return;
    }
    if (typeof cmd.name !== "string" || !cmd.name.trim()) {
      parentPort?.postMessage({ error: `Command name is missing or invalid in ${file}` });
      return;
    }
    if (typeof cmd.execute !== "function") {
      parentPort?.postMessage({ error: `Command ${cmd.name} (from ${file}) is missing an execute function.` });
      return;
    }
    parentPort?.postMessage({ cmd });
  } catch (error) {
    parentPort?.postMessage({ error: error instanceof Error ? error.message : String(error) });
  }
})();
