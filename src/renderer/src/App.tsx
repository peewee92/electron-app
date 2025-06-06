import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(prev => prev + 1);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>👋 欢迎来到我的 React App</h1>
      <p>你已经点击了 <strong>{count}</strong> 次。</p>
      <button onClick={handleClick} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        点我 +1
      </button>
    </div>
  );
}

export default App;
