// frontend/src/App.tsx
import LivroComEmprestimo from './componentes/LivroComEmprestimo';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Sistema de Biblioteca</h1>
      <hr />
      <LivroComEmprestimo />
    </div>
  );
}

export default App;