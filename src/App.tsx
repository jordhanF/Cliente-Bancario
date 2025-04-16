import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientesList from './pages/ClientesList';
import ClienteDetail from './pages/ClienteDetail';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ClientesList />} />
                <Route path="/cliente/:id" element={<ClienteDetail />} />
            </Routes>
        </Router>
    );
}

export default App;