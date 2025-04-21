import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ClientesList from './pages/ClientesList';
import ClienteDetail from './pages/ClienteDetail';
import ContasList from './pages/ContasList';
import ContaDetail from './pages/ContaDetail';
import AgenciasList from './pages/AgenciasList';
import AgenciaDetail from './pages/AgenciaDetail';
import './styles/global.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Header />
                
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<ClientesList />} />
                        <Route path="/cliente/:id" element={<ClienteDetail />} />
                        <Route path="/contas" element={<ContasList />} />
                        <Route path="/conta/:id" element={<ContaDetail />} />
                        <Route path="/agencias" element={<AgenciasList />} />
                        <Route path="/agencia/:id" element={<AgenciaDetail />} />
                    </Routes>
                </main>
                
                <Footer />
            </div>
        </Router>
    );
}

export default App;