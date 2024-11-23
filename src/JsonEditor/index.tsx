import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useEffect, useState } from "react";
import { parseJsonDeep } from "./parseJsonDeep";

try {
  loader.config({ monaco });
} catch (e) {
  console.error(e);
}

function JsonEditor(props: { value: any }) {
  const [jsonValue, setJsonValue] = useState<any>();

  return (
    <div style={{ flex: 1, display: "flex" }}>
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          defaultLanguage="json"
          onChange={(value) => {
            console.log("value", parseJsonDeep(value));
            setJsonValue(parseJsonDeep(value));
          }}
        />
      </div>
      <div style={{ flex: 3 }}>
        <Editor
          height="100%"
          defaultLanguage="json"
          value={JSON.stringify(jsonValue, null, 4)}
        />
      </div>
    </div>
  );
}

export default JsonEditor;
