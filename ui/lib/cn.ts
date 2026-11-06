export type ClassPart = string | false | null | undefined;

/** className 组合器：过滤假值后以空格连接。 */
export function cn(...parts: ClassPart[]): string {
  return parts.filter(Boolean).join(' ');
}
