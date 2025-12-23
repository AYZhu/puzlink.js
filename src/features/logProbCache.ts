import { knownLogProbs } from "../data/knownLogProbs.js";
import { LogNum } from "../lib/logNum.js";

class LogProbCache {
  useCache: boolean;
  knownLogProbs: Record<string, LogNum>;
  wrapCompute: (
    name: string,
    fn: () => LogNum,
    existing: LogNum | undefined,
  ) => LogNum;

  constructor(data: Record<string, number>) {
    this.useCache = true;
    this.knownLogProbs = {};
    for (const [name, logProb] of Object.entries(data)) {
      this.knownLogProbs[name] = LogNum.fromExp(logProb);
    }
    this.wrapCompute = (_, fn) => fn();
  }

  *dump(): Generator<string> {
    yield `export const knownLogProbs: Record<string, number> = {`;
    for (const [name, logProb] of Object.entries(this.knownLogProbs)) {
      yield `  "${name}": ${logProb.toLog().toString()},`;
    }
    yield `};`;
  }

  get(name: string, defaultLogProb: () => LogNum): LogNum {
    if (this.useCache && name in this.knownLogProbs) {
      return this.knownLogProbs[name]!;
    }
    const logProb = this.wrapCompute(
      name,
      defaultLogProb,
      this.knownLogProbs[name],
    );
    this.knownLogProbs[name] = logProb;
    return logProb;
  }
}

/**
 * We wrap the log prob cache in a class so we can do stuff like print
 * debug output and whatever.
 */
export const KnownLogProbs = new LogProbCache(knownLogProbs);
