/**
 * 矩阵
 */
export class Matrix {
  private data: number[][];
  public rows: number;
  public cols: number;

  /**
   * @param {number} rows 行数
   * @param {number} cols 列数
   * @param {number} defaultValue 默认填充值（默认0）
   */
  public constructor(rows: number, cols: number, defaultValue: number = 0) {
    if (rows <= 0 || cols <= 0) throw new Error('Invalid matrix size');

    this.rows = rows;
    this.cols = cols;
    this.data = Array.from({ length: rows }, () => Array(cols).fill(defaultValue));
  }

  /**
   * 从数组构建矩阵
   * @param arr 数组
   * @returns {Matrix} 返回后的矩阵
   */
  public static fromArray(arr: number[][]) {
    const rows = arr.length;
    const cols = arr[0].length;
    const mat = new Matrix(rows, cols);
    for (let i = 0; i < rows; i++) {
      if (arr[i].length !== cols) throw new Error('All rows must have same length');
      for (let j = 0; j < cols; j++) {
        mat.data[i][j] = arr[i][j];
      }
    }
    return mat;
  }

  /**
   * 获取单位矩阵
   * @param {number} size 行列数
   * @returns {Matrix} 单位矩阵
   */
  public static identity(size: number): Matrix {
    const mat = new Matrix(size, size);

    for (let i = 0; i < size; i++) {
      mat.data[i][i] = 1;
    }

    return mat;
  }

  /**
   * 获取矩阵元素
   * @param {number} row 行索引
   * @param {number} col 列索引
   * @returns {number} 元素值
   */
  public get(row: number, col: number): number {
    return this.data[row][col];
  }

  /**
   * 设置矩阵元素
   * @param {number} row 行索引
   * @param {number} col 列索引
   * @param {number} value 元素值
   */
  public set(row: number, col: number, value: number) {
    this.data[row][col] = value;
  }

  /**
   * 转置矩阵
   * @returns {Matrix} 转置矩阵
   */
  public transpose(): Matrix {
    const result = new Matrix(this.cols, this.rows);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.data[j][i] = this.data[i][j];
      }
    }

    return result;
  }

  /**
   * 矩阵加法
   * @param {Matrix} other 另一个矩阵
   * @returns {Matrix} 相加后的矩阵
   */
  public add(other: Matrix): Matrix {
    if (other.rows !== this.rows || other.cols !== this.cols)
      throw new Error('Matrix size mismatch');

    const result = new Matrix(this.rows, this.cols);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.data[i][j] = this.data[i][j] + other.data[i][j];
      }
    }

    return result;
  }

  /**
   * 矩阵减法
   * @param {Matrix} other 另一个矩阵
   * @returns {Matrix} 相减后的矩阵
   */
  public subtract(other: Matrix): Matrix {
    if (other.rows !== this.rows || other.cols !== this.cols)
      throw new Error('Matrix size mismatch');

    const result = new Matrix(this.rows, this.cols);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.data[i][j] = this.data[i][j] - other.data[i][j];
      }
    }

    return result;
  }

  /**
   * （传入的矩阵或数字右乘原矩阵）矩阵乘法
   * @param {Matrix} other 另一个矩阵或数字
   * @returns {Matrix | number} 相乘后的矩阵
   */
  public multiply(other: Matrix | number): Matrix {
    if (typeof other === 'number') {
      const result = new Matrix(this.rows, this.cols);
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          result.data[i][j] = this.data[i][j] * other;
        }
      }
      return result;
    }

    if (this.cols !== other.rows) throw new Error('Matrix size mismatch for multiplication');

    const result = new Matrix(this.rows, other.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < other.cols; j++) {
        let sum = 0;

        for (let k = 0; k < this.cols; k++) {
          sum += this.data[i][k] * other.data[k][j];
        }

        result.data[i][j] = sum;
      }
    }

    return result;
  }

  /**
   * 判断是否为方阵
   * @returns {boolean} 如果行数等于列数返回 true，否则 false
   */
  public isSquare(): boolean {
    return this.rows === this.cols;
  }

  /**
   * 计算行列式（仅方阵可用，浮点安全）
   * @returns {number} 行列式值
   * @throws {Error} 如果不是方阵
   */
  public determinant(): number {
    if (!this.isSquare()) throw new Error('Determinant is only defined for square matrices');

    const n = this.rows;
    const mat = this.toArray().map(row => [...row]);
    let det = 1;
    let swapCount = 0;

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(mat[k][i]) > Math.abs(mat[maxRow][i])) maxRow = k;
      }

      if (Math.abs(mat[maxRow][i]) < Number.EPSILON) return 0;

      if (i !== maxRow) {
        [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];
        swapCount++;
      }

      for (let j = i + 1; j < n; j++) {
        const factor = mat[j][i] / mat[i][i];
        for (let k = i; k < n; k++) {
          mat[j][k] -= factor * mat[i][k];
          if (Math.abs(mat[j][k]) < Number.EPSILON) mat[j][k] = 0;
        }
      }
    }

    for (let i = 0; i < n; i++) {
      det *= mat[i][i];
    }

    return swapCount % 2 === 0 ? det : -det;
  }

  /**
   * 判断两个矩阵是否相等（考虑浮点误差）
   * @param other 另一个矩阵
   * @returns boolean
   */
  public equals(other: Matrix): boolean {
    if (this.rows !== other.rows || this.cols !== other.cols) return false;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.abs(this.data[i][j] - other.data[i][j]) > Number.EPSILON) return false;
      }
    }
    return true;
  }

  /**
   * 计算方阵的逆矩阵
   * @returns {Matrix} 逆矩阵
   * @throws {Error} 如果不是方阵或矩阵不可逆
   */
  public inverse(): Matrix {
    if (!this.isSquare()) throw new Error('Inverse is only defined for square matrices');

    if (Math.abs(this.determinant()) < Number.EPSILON) {
      throw new Error('Matrix is singular (determinant is 0) and cannot be inverted');
    }

    const n = this.rows;
    const mat = this.toArray().map((row, i) => [
      ...row,
      ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
    ]);

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(mat[k][i]) > Math.abs(mat[maxRow][i])) maxRow = k;
      }

      if (Math.abs(mat[maxRow][i]) < Number.EPSILON) {
        throw new Error('Matrix is singular and cannot be inverted');
      }

      if (i !== maxRow) [mat[i], mat[maxRow]] = [mat[maxRow], mat[i]];

      const pivot = mat[i][i];
      for (let j = 0; j < 2 * n; j++) {
        mat[i][j] /= pivot;
        if (Math.abs(mat[i][j]) < Number.EPSILON) mat[i][j] = 0;
      }

      for (let j = 0; j < n; j++) {
        if (j === i) continue;
        const factor = mat[j][i];
        for (let k = 0; k < 2 * n; k++) {
          mat[j][k] -= factor * mat[i][k];
          if (Math.abs(mat[j][k]) < Number.EPSILON) mat[j][k] = 0;
        }
      }
    }

    const result = new Matrix(n, n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        result.data[i][j] = mat[i][j + n];
      }
    }

    return result;
  }

  /**
   * 打印矩阵
   */
  public print(): void {
    console.table(this.data);
  }

  /**
   * 返回矩阵二维数组副本
   * @returns {number[][]} 二维数组
   */
  public toArray(): number[][] {
    return this.data.map(row => [...row]);
  }
}
