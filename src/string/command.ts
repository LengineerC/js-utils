/**
 * 命令构建器
 */
export class CommandBuilder {
  private parts: string[] = [];

  private escape(value: string) {
    if (/[\s"'\\]/.test(value)) {
      const escaped = value.replace(/(["\\])/g, "\\$1");
      return `"${escaped}"`;
    }
    return value;
  }

  /**
   * 添加命令主体
   * @param cmd 命令主体
   * @returns 当前实例
   */
  public command(cmd: string) {
    this.parts.push(cmd);
    return this;
  }

  /**
   * 添加参数
   * @param value 参数值
   * @returns 当前实例
   */
  public arg(value: string | number) {
    if (typeof value === 'string') this.parts.push(this.escape(value));
    else this.parts.push(String(value));
    return this;
  }

  /**
   * 添加标志
   * @param flag 标志
   * @param value 标志值
   * @returns 当前实例
   */
  public flag(flag: string, value?: string | number | boolean) {
    if (value === undefined || value === true) {
      this.parts.push(flag);
    } else if (value !== false) {
      this.parts.push(flag, this.escape(String(value)));
    }
    return this;
  }

  /**
   * 添加选项
   * @param key 选项键
   * @param value 选项值
   * @returns 当前实例
   */
  public option(key: string, value?: string | number | boolean) {
    if (value === undefined || value === false) return this;
    if (value === true) {
      this.parts.push(key);
    } else {
      this.parts.push(`${key}=${this.escape(String(value))}`);
    }
    return this;
  }

  /**
   * 将命令构建为字符串
   * @returns 构建后的命令字符串
   */
  public toString() {
    return this.parts.join(' ');
  }

  /**
   * 构建命令
   * @returns 构建后的命令对象
   */
  public build() {
    if (this.parts.length === 0) {
      throw new Error('Command is empty');
    }

    const [command, ...args] = this.parts;

    return {
      command,
      args: args.filter(a => a !== ''),
    };
  }
};
