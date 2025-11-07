/**
 * 版本号比较，可直接用于两个版本好相比，也可以通过Array.prototype.sort调用，使版本号从小到大排序，支持1.0.0和包含使用-连接的预发布版本标签1.0.0-alpha
 * @param {string} a 版本a
 * @param {string} b 版本b
 * @returns {number} 0相等，1a>b，-1b<a
 */
export function compareVersion(a: string, b: string): number {
  const parseVersion = (version: string) => {
    const [main, preRelease] = version.split('-');
    const parts = main.split('.').map(Number);
    return { parts, preRelease };
  };

  const v1 = parseVersion(a);
  const v2 = parseVersion(b);

  for (let i = 0; i < Math.max(v1.parts.length, v2.parts.length); i++) {
    const num1 = v1.parts[i] || 0;
    const num2 = v2.parts[i] || 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  if (v1.preRelease === undefined && v2.preRelease !== undefined) return 1;
  if (v1.preRelease !== undefined && v2.preRelease === undefined) return -1;
  if (v1.preRelease && v2.preRelease) {
    return v1.preRelease.localeCompare(v2.preRelease);
  }

  return 0;
}
