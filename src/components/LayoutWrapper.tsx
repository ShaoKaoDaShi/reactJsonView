import styled from "styled-components";

export const LayoutWrapper = styled.div`
  * {
    transition: all 0.2s cubic-bezier(0.42, 0, 0.58, 1); //淡入淡出效果
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    //滚动条轨道
    ::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 3px;
    }
    //滚动条样式
    ::-webkit-scrollbar-thumb {
      background: #b8babc;
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #7a7c7d;
    }
    /* 鼠标放入展示滚动条 */
    *:hover::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
  }
`;
