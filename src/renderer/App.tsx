import { useState } from 'react';
import { Button } from 'antd'

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(prev => prev + 1);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <Button type="primary">Button</Button>
    </div>
  );
}

export default App;
