import React, { useCallback, useEffect, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { parseJsonDeep } from "./parseJsonDeep";
import { ResizeBox } from "../ResizeBox";
import { db } from "../Database/jsonParseHistory";

try {
  loader.config({ monaco });
} catch (e) {
  console.error("Error configuring Monaco loader:", e);
}

// 提取样式到对象
const styles = {
  container: {
    width: "100vw",
    display: "flex",
    overflow: "hidden",
  } as React.CSSProperties,
  output: {
    flex: 1,
    backgroundColor: "blueviolet",
    overflow: "hidden",
  } as React.CSSProperties,
};

function JsonEditor() {
  const [jsonValue, setJsonValue] = useState<unknown>(null);
  const [orgValue, setOrgValue] = useState<string>("");

  // 处理编辑器内容变化
  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setOrgValue(value);
      db.jsonParseHistory.add({
        jsonString: value,
        date: new Date().getTime(),
      });
    }
    try {
      const parsedValue = parseJsonDeep(value);
      console.log("🚀 ~ Parsed JSON:", parsedValue);
      setJsonValue(parsedValue);
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      setJsonValue(null);
    }
  }, []);

  useEffect(() => {
    db.jsonParseHistory.toArray().then((data) => {
      console.log("🚀 ~ arr:", data);
      if (data.length) {
        const history = data.pop();
        setOrgValue(history?.jsonString || "");
        handleEditorChange(history?.jsonString);
      }
    });
  }, []);

  return (
    <div style={styles.container}>
      <ResizeBox>
        <MonacoEditor value={orgValue} onChange={handleEditorChange} />
      </ResizeBox>

      <div style={styles.output}>
        <MonacoEditor
          value={JSON.stringify(jsonValue, null, 4) || ""}
          readOnly
        />
      </div>
    </div>
  );
}

// 提取通用 MonacoEditor 组件
function MonacoEditor({
  value,
  onChange,
  readOnly = false,
}: {
  value?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
}) {
  return (
    <Editor
      theme="vs-dark"
      defaultLanguage="json"
      value={value}
      onChange={onChange}
      options={{
        readOnly,
        automaticLayout: true, // 自动布局
      }}
    />
  );
}

export default JsonEditor;
