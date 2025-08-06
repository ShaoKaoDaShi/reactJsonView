import React, { useState } from "react";
import PreciseDiffViewer from "../../components/PreciseDiffViewer";
import EnhancedDiffViewer from "../../components/EnhancedDiffViewer";

const PreciseDiffViewerPage: React.FC = () => {
  const [oldText] = useState(`function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

function formatPrice(price) {
  return '$' + price.toFixed(2);
}`);

  const [newText] = useState(`function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};`);

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <h2>精确字符级差异对比</h2>
      <p>此组件会精确显示：</p>
      <ul>
        <li>删除行中被删除的字符（红色背景）</li>
        <li>新增行中新增的字符（绿色背景）</li>
        <li>修改行中具体变化的字符（新增绿色，删除红色）</li>
      </ul>

      {/* <PreciseDiffViewer
        oldText={oldText}
        newText={newText}
        fileName="utils.js"
      /> */}
      <EnhancedDiffViewer
        oldText={oldText}
        newText={newText}
        fileName="utils.js"
      />
    </div>
  );
};

export default PreciseDiffViewerPage;
