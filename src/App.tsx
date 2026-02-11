import { useTheme } from './hooks';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-xl">
      <div className="card">
        <h1>vBank Dashboard</h1>
        <p className="text-secondary">
          Welcome to your digital banking prototype
        </p>
        
        <button className="btn btn-primary" onClick={toggleTheme}>
          Current Theme: {theme}
        </button>
        
        <div className="flex gap-md mt-lg">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-secondary">Secondary Button</button>
          <button className="btn btn-ghost">Ghost Button</button>
        </div>
        
        <div className="mt-lg">
          <label htmlFor="test-input">Test Input</label>
          <input 
            id="test-input"
            type="text" 
            placeholder="Enter some text..." 
          />
        </div>
      </div>
    </div>
  );
}

export default App;