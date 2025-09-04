


import LivroComEmprestimo from './componentes/LivroComEmprestimo';
import FormularioLivro from './componentes/FormularioLivro';
import FormularioEmprestimo from './componentes/FormularioEmprestimo';
import FormularioMembro from './componentes/FormularioMembro';

function App() {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Sistema de Biblioteca</h1>
  <FormularioMembro />
  <hr />
  <FormularioLivro />
  <hr />
  <FormularioEmprestimo />
  <hr />
  <LivroComEmprestimo />
    </div>
  );
}

export default App;
