const numToStr: string[] = [];
for (let i = 0; i <= 89; i++) {
  numToStr[i] = i.toString();
}

const strToNum: Record<string, number> = {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
};

export class Decimal {
  private precision: number; // 小数位数 精度
  private ponitPos: number = -1; // 小数点位置
  private decimalPlaces: number = 0; // 小数位数 // 由两个数相加得来
  private _value: string;
  static ZERO = new Decimal('0');
  get value(): string {
    return this._value;
  }

  constructor(value: string | number | Decimal = '0', precision: number = 10) {
    if (value instanceof Decimal) {
      this._value = value.toString();
      // 小数点后的数据个数
      this.decimalPlaces = value.decimalPlaces;
    } else {
      // 解析输入值并规范化
      const strValue = value.toString();
      const parts = strValue.split('.');
      this._value = parts.join('');
      // 小数点位数
      this.decimalPlaces = parts[1] ? parts[1].length : 0;
    }
    // 默认保留10为小数
    this.precision = precision;
  }

  /**
   * 返回进位值和对于的加入的值 只支持 0 - 89
   * 返回一个对象 ch: 当前单元的值 carryValue: 进位值
   * @param curValue 当前单元的值
   * @returns
   */
  private addUnit(curValue: number): { ch: string; carryValue: number } {
    if (curValue < 0 || curValue > 89) {
      // 如果超出范围，手动计算
      const ch = (curValue % 10).toString();
      const carryValue = Math.floor(curValue / 10);
      return { ch, carryValue };
    }

    const curStr: string = numToStr[curValue];
    // 如果大于9
    if (curStr.length > 1) {
      return {
        ch: curStr[1],
        carryValue: strToNum[curStr[0]],
      };
    } else {
      return {
        ch: curStr[0],
        carryValue: 0,
      };
    }
  }

  /**
   * 计算一个值len = 1 和另一个值 len = n 的字符串结果
   * @param ch: 竖式计算中的单元
   * @param longStr: 竖式计算中的长字符串
   * @param zeroPadding: 竖式计算中的零填充 用于在尾部填充零
   * @returns
   */
  private mulUnit(ch: string, longStr: string, zeroPadding: number = 0): string {
    if (ch.length > 1) return '';
    const mul: number = strToNum[ch];
    if (mul === undefined) return '';

    const len: number = longStr.length;
    let carryValue: number = 0; // 进位值

    let result: string = '0'.repeat(zeroPadding);
    for (let i = len - 1; i >= 0; --i) {
      const digit = strToNum[longStr[i]];
      if (digit === undefined) return '';

      // 计算当前的值 加上进位的值
      const curValue: number = digit * mul + carryValue;

      const res = this.addUnit(curValue);
      carryValue = res.carryValue;
      result += res.ch;
    }
    if (carryValue !== 0) {
      result += numToStr[carryValue];
    }
    return result.split('').reverse().join('');
  }

  public toString(): string {
    // 根据 decimalPlaces 插入小数点
    if (this.decimalPlaces === 0) return this.value;

    const integerPart = this.value.slice(0, -this.decimalPlaces);
    const fractionalPart = this.value.slice(-this.decimalPlaces);
    return `${integerPart}.${fractionalPart}`;
  }

  /**
   * 与另一个Decimal对象进行加法运算
   * @param o 要相加的Decimal对象
   * @returns 返回加法运算后的Decimal结果
   */
  public add(o: Decimal): Decimal {
    let a: string = o.value;
    let b: string = this.value;
    let carryValue: number = 0; // 进位值
    let result: string = '';
    let newA: string = '';
    let newB: string = '';

    if (o.decimalPlaces < this.decimalPlaces) {
      const diff = this.decimalPlaces - o.decimalPlaces;
      a = a + '0'.repeat(diff);
    } else {
      const diff = o.decimalPlaces - this.decimalPlaces;
      b = b + '0'.repeat(diff);
    }

    //小数点个数的最大值
    this.decimalPlaces = Math.max(o.decimalPlaces, this.decimalPlaces);

    if (a.length > b.length) {
      newB = '0'.repeat(a.length - b.length) + b;
      newA = a;
    } else {
      newA = '0'.repeat(b.length - a.length) + a;
      newB = b;
    }

    // 进行加减法处理
    for (let i = newA.length - 1; i >= 0; --i) {
      const digitA = strToNum[newA[i]];
      const digitB = strToNum[newB[i]];

      if (digitA === undefined || digitB === undefined) {
        return Decimal.ZERO;
      }

      const curValue: number = digitA + carryValue + digitB;
      const res = this.addUnit(curValue);
      carryValue = res.carryValue;
      result += res.ch;
    }

    if (carryValue !== 0) {
      result += numToStr[carryValue];
    }

    // 反转字符串
    this._value = result.split('').reverse().join('');

    return this;
  }

  /**
   * 与另一个Decimal对象进行减法运算
   * @param o 要相减的Decimal对象
   * @returns 返回减法运算后的Decimal结果
   */
  // public sub(_o:Decimal): Decimal {

  //     return this;
  // }

  /**
   *
   * @param o
   * @returns
   */
  public mul(o: Decimal): Decimal {
    const a: string = o.value;
    const b: string = this.value;

    const shortStr: string = a.length < b.length ? a : b;
    const longStr: string = a.length < b.length ? b : a;

    this.decimalPlaces = o.decimalPlaces + this.decimalPlaces;
    let result = Decimal.ZERO;
    for (let i = shortStr.length - 1; i >= 0; --i) {
      const ch = shortStr[i];
      const res = this.mulUnit(ch, longStr, shortStr.length - 1 - i);
      result = result.add(new Decimal(res));
    }
    this._value = result.value;
    return this;
  }

  /**
   * 与另一个Decimal对象进行除法运算
   * @param o 要相除的Decimal对象
   * @returns 返回除法运算后的Decimal结果
   */
  // public div(_o:Decimal): Decimal {

  //     return this;
  // }
}
