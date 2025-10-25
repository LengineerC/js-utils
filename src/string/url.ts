/**
 * 提取url参数
 * @param url url字符串
 * @returns 参数对象
 */
export function getParams(url: string) {
  const matches = url.matchAll(/[?&]([^=#&]+)=([^&#]*)/g);
  const params: Record<string, string> = {};

  for (const match of matches) {
    const [_, key, value] = match;
    params[key] = value;
  }

  return params;
}
