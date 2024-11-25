import { keys } from "lodash";

export function parseJsonDeep(target: unknown) {
  let parsedTarget: Record<string, unknown> | unknown;

  try {
    parsedTarget = JSON.parse(target as string);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return target;
  }

  const stack: { obj: any; key?: string; parent?: any }[] = [];

  if (typeof parsedTarget === "object" && parsedTarget !== null) {
    stack.push({ obj: parsedTarget });
  }

  while (stack.length > 0) {
    const { obj, key, parent } = stack.pop()!;

    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        if (typeof obj[i] === "string") {
          try {
            obj[i] = JSON.parse(obj[i]);
            stack.push({ obj: obj[i] });
          } catch {
            // Skip parsing if JSON.parse fails
          }
        } else if (typeof obj[i] === "object" && obj[i] !== null) {
          stack.push({ obj: obj[i] });
        }
      }
    } else if (typeof obj === "object" && obj !== null) {
      keys(obj).forEach((key) => {
        const value = obj[key];
        if (typeof value === "string") {
          try {
            obj[key] = JSON.parse(value);
            stack.push({ obj: obj[key] });
          } catch {
            // Skip parsing if JSON.parse fails
          }
        } else if (typeof value === "object" && value !== null) {
          stack.push({ obj: value });
        }
      });
    }

    if (key && parent) {
      parent[key] = obj;
    }
  }

  return parsedTarget;
}
