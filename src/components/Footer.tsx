import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="bank-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h4>Institucional</h4>
            <ul>
              <li><a href="#">Sobre Nós</a></li>
              <li><a href="#">Carreiras</a></li>
              <li><a href="#">Imprensa</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Atendimento</h4>
            <ul>
              <li><a href="#">Central de Ajuda</a></li>
              <li><a href="#">Canais Digitais</a></li>
              <li><a href="#">Ouvidoria</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Segurança</h4>
            <ul>
              <li><a href="#">Dicas de Segurança</a></li>
              <li><a href="#">Proteção de Dados</a></li>
            </ul>
          </div>
          
          <div className="footer-section social-section">
            <h4>Siga-nos</h4>
            <div className="social-icons">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Banco Digital. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}