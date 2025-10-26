export class CommandBuilder {
  private parts: string[] = [];

  private escape(value: string) {
    if (/[\s"'\\]/.test(value)) {
      const escaped = value.replace(/(["\\])/g, "\\$1");
      return `"${escaped}"`;
    }
    return value;
  }

  public command(cmd: string) {
    this.parts.push(cmd);
    return this;
  }

  public arg(value: string | number) {
    if (typeof value === 'string') this.parts.push(this.escape(value));
    else this.parts.push(String(value));
    return this;
  }

  public flag(flag: string, value?: string | number | boolean) {
    if (value === undefined || value === true) {
      this.parts.push(flag);
    } else if (value !== false) {
      this.parts.push(flag, this.escape(String(value)));
    }
    return this;
  }

  public option(key: string, value?: string | number | boolean) {
    if (value === undefined || value === false) return this;
    if (value === true) {
      this.parts.push(key);
    } else {
      this.parts.push(`${key}=${this.escape(String(value))}`);
    }
    return this;
  }

  public toString() {
    return this.parts.join(' ');
  }

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
