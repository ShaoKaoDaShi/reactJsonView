import { keys } from "lodash";

export function parseJsonDeep(target: unknown) {
  let parsedTarget: Record<string, unknown> | string;

  try {
    parsedTarget = JSON.parse(target as string);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    parsedTarget = target as string;
  }

  if (typeof parsedTarget === "object" && parsedTarget !== null) {
    keys(parsedTarget).forEach((key) => {
      parsedTarget[key] = parseJsonDeep(parsedTarget[key]);
    });
  } else if (Array.isArray(parsedTarget)) {
    parsedTarget.forEach((item, index) => {
      parsedTarget[index] = parseJsonDeep(item);
    });
  }

  return parsedTarget;
}
