import { LogNum } from "./logNum.js";

const coeffs = [
  1.5957691187, 5.37366e-8, 0.72670769, -9.229e-7, 5.3498e-5, -9.0342e-5,
  1.049448e-4, -3.0263611e-3, 2.99472642e-4, -1.98173433e-4, 9.4285766e-5,
  -3.1366467e-5, 7.1524366e-6, 1.09550613e-6, 1.079959e-7, -6.208087e-9,
  1.585371e-10,
];

class NormalDist {
  readonly table: readonly number[];
  readonly logNumTable: readonly LogNum[];

  constructor() {
    const table = [];
    const logNumTable = [];

    for (let z = 0.0; z <= 3.99; z += 0.01) {
      table.push(NormalDist.computeCDF(z));
    }
    for (let z = 4.0; z <= 20.0; z += 0.1) {
      logNumTable.push(NormalDist.computeLogNumCDF(LogNum.from(z)));
    }

    this.table = table;
    this.logNumTable = logNumTable;
  }

  private static readonly sqrt2pi = Math.sqrt(2 * Math.PI);
  private static readonly logNumSqrt2pi = LogNum.from(NormalDist.sqrt2pi);

  private static computeCDF(z: number) {
    let sum = coeffs[0];
    let tmp = 1;

    for (let i = 1; i < 16; i++) {
      tmp *= z;
      sum += coeffs[i] * tmp;
    }

    return 1 / (1 + Math.exp(-sum * z));
  }

  private static computeLogNumCDF(z: LogNum) {
    return new LogNum(
      -Math.log1p(Math.exp(Math.log(2) - z.toNum() * Math.sqrt(2 * Math.PI))),
    );

    const toSum = [z];
    let tmp = z;

    for (let i = 1; i < 15; i++) {
      tmp = tmp.mul(z.pow(2).div(LogNum.from(2 * i + 1)));
      toSum.push(tmp);
    }

    return LogNum.from(0.5).add(
      LogNum.sum(toSum)
        .div(NormalDist.logNumSqrt2pi)
        .mul(LogNum.fromExp(-z.pow(2).toNum() / 2)),
    );
  }
}

export const Normal = new NormalDist();
