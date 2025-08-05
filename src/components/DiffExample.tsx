import React, { useState } from "react";
import DiffViewer from "./DiffViewer";

const DiffExample: React.FC = () => {
  const [oldText] = useState(`function hello(name) {
  console.log('Hello ' + name);
  return 'Hello ' + name;
}`);

  const [newText] = useState(`function greet(name, greeting = 'Hello') {
  console.log(\`\${greeting}, \${name}!\`);
  return \`\${greeting}, \${name}!\`;
}`);

  return (
    <div style={{ padding: 20 }}>
      <h2>文件差异对比示例</h2>
      <DiffViewer
        oldText={oldText}
        newText={newText}
        fileName="example.js"
        showCharacterDiff={true}
      />
    </div>
  );
};

export default DiffExample;
