type TypeString = "Undefined" | "Array" | "Object" | "Number" | "String" | "Boolean" | "Symbol" | "BigInt";

// 合并函数，支持数组、对象及基本类型的合并，避免循环引用
export function TsMerge(
  obj1: unknown,
  obj2: unknown,
  opt: 1 | 2 = 1, // 限定 opt 只能是 1（替换）或 2（拼接），默认 1
  seen: WeakMap<object, object> = new WeakMap() // 用于检测循环引用，映射原对象到合并结果
): unknown | null {
  // 获取值的类型字符串（如 "Array"、"Object" 等）
  const getType = (val: unknown): TypeString => {
    return Object.prototype.toString.call(val).slice(8, -1) as TypeString;
  };

  const typeObj1 = getType(obj1);
  const typeObj2 = getType(obj2);

  // 忽略 undefined：若其中一个为 undefined，返回另一个
  if (typeObj1 === "Undefined") return obj2;
  if (typeObj2 === "Undefined") return obj1;

  // 类型不同时无法合并，返回 null
  if (typeObj1 !== typeObj2) return null;

  // 处理循环引用：如果 obj1 或 obj2 已在 `seen` 中，返回其合并结果
  // 我们使用 WeakMap 将源对象映射到合并结果对象，这样遇到循环引用时可以返回已创建的引用
  if (typeof obj1 === 'object' && obj1 !== null && seen.has(obj1 as object)) {
    return seen.get(obj1 as object);
  }
  if (typeof obj2 === 'object' && obj2 !== null && seen.has(obj2 as object)) {
    return seen.get(obj2 as object);
  }

  // 处理数组：根据 opt 决定替换或拼接
  if (typeObj1 === "Array") {
    // 断言为数组类型（类型守卫）
    const arr1 = obj1 as unknown[];
    const arr2 = obj2 as unknown[];

    switch (opt) {
      case 1: // 替换：返回 obj2 的副本
        return [...arr2];
      case 2: // 拼接：合并两个数组
        return [...arr1, ...arr2];
      default:
        return [...arr2];
    }
  }

  // 处理对象：深层合并子属性
  if (typeObj1 === "Object") {
  const mergeObj: Record<string, unknown> = {}; // 存储合并结果的对象
    const obj1Obj = obj1 as Record<string, unknown>; // 断言为对象类型
    const obj2Obj = obj2 as Record<string, unknown>;

  // 在递归合并前先把目标对象放入 seen，以处理循环引用情况
  if (typeof obj1 === 'object' && obj1 !== null) seen.set(obj1 as object, mergeObj);
  if (typeof obj2 === 'object' && obj2 !== null) seen.set(obj2 as object, mergeObj);
    // 复制 obj1 的自身属性
    for (const key in obj1Obj) {
      if (obj1Obj.hasOwnProperty(key)) {
        mergeObj[key] = obj1Obj[key];
      }
    }

    // 合并 obj2 的属性（覆盖或递归合并）
    for (const key in obj2Obj) {
      if (obj2Obj.hasOwnProperty(key)) {
        const val2 = obj2Obj[key];
        if (val2 === undefined) continue; // 忽略 undefined 值

        // 若 obj1 中已有该属性，递归合并；否则直接添加
        if (mergeObj.hasOwnProperty(key)) {
          const val1 = mergeObj[key];
          const mergedVal = TsMerge(val1, val2, opt, seen); // 传递 `seen` 用于循环引用检测
          mergeObj[key] = mergedVal !== null ? mergedVal : val2;
        } else {
          // 如果 val2 是对象或数组，需要在 seen 中记录以处理其内部循环引用
          if (typeof val2 === 'object' && val2 !== null) {
            // 如果已经存在映射，直接复用（可能由外层占位创建）
            if (seen.has(val2 as object)) {
              mergeObj[key] = seen.get(val2 as object);
            } else {
              // 创建占位并记录到 seen，随后用占位作为目标递归合并以填充占位的属性
              const placeholder: any = Array.isArray(val2) ? [] : {};
              seen.set(val2 as object, placeholder);
              // 使用 placeholder 作为 obj1，使递归把 val2 的内容合并到 placeholder 上
              const filled = TsMerge(placeholder, val2, opt, seen);
              mergeObj[key] = filled !== null ? filled : placeholder;
            }
          } else {
            mergeObj[key] = val2;
          }
        }
      }
    }

    return mergeObj;
  }

  // 处理基本类型（数字、字符串等）：直接用 obj2 覆盖
  return obj2;
}
