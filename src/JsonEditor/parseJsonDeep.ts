export function parseJsonDeep(target: any) {
  let parsedTarget: any;

  try {
    parsedTarget = JSON.parse(target);
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    parsedTarget = target;
  }

  if (typeof parsedTarget === "object" && parsedTarget !== null) {
    Reflect.ownKeys(parsedTarget).forEach((key) => {
      parsedTarget[key] = parseJsonDeep(parsedTarget[key]);
    });
  } else if (Array.isArray(parsedTarget)) {
    parsedTarget.forEach((item, index) => {
      parsedTarget[index] = parseJsonDeep(item);
    });
  }

  return parsedTarget;
}
