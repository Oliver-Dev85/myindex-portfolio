import { useState, useEffect } from 'react'
import './App.css'
import ChatBox from './ChatBox';

// Se você tiver a imagem do projeto salva em assets, pode importá-la assim:
// import projectImg from './assets/project-img-html.png'

function App() {
  // ==========================================================================
  // 1. SISTEMA DE TEMA (CLARO/ESCURO)
  // ==========================================================================
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  // ==========================================================================
  // 2. CONTROLE DO MENU RESPONSIVO (HAMBÚRGUER)
  // ==========================================================================
  const [menuAberto, setMenuAberto] = useState(false);

  // ==========================================================================
  // 3. BARRA DE PROGRESSO DE SCROLL
  // ==========================================================================
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Limpeza de memória
  }, []);

  // ==========================================================================
  // 4. INTEGRAÇÃO DO FORMULÁRIO COM O WHATSAPP
  // ==========================================================================
  const [form, setForm] = useState({ nome: '', email: '', proposta: '' });

  const enviarWhatsapp = () => {
    if (!form.nome || !form.email || !form.proposta) {
      alert('Por favor, preencha todos os campos (Nome, E-mail e Mensagem) antes de enviar.');
      return;
    }

    const numeroTelefone = "5585988415344";
    const textoMensagem = `Olá! Meu nome é ${form.nome} (${form.email}). Tenho a seguinte proposta: ${form.proposta}`;
    const urlFinal = `https://wa.me/${numeroTelefone}?text=${encodeURIComponent(textoMensagem)}`;
    
    window.open(urlFinal, '_blank');

    // Limpa os campos após o envio
    setForm({ nome: '', email: '', proposta: '' });
  };

  // ==========================================================================
  // 5. CONTROLE DO MODAL DE CERTIFICADOS
  // ==========================================================================
  const [modalConfig, setModalConfig] = useState({ aberto: false, url: '', extensao: '' });

  const abrirModal = (fileUrl: string) => {
    if (!fileUrl || fileUrl === 'localdedestino/') {
      alert('Este certificado estará disponível em breve!');
      return;
    }

    const extension = fileUrl.split('.').pop()?.toLowerCase() || '';
    setModalConfig({ aberto: true, url: fileUrl, extensao: extension });
    document.body.style.overflow = 'hidden'; // Trava o scroll da página
  };

  const fecharModal = () => {
    setModalConfig({ aberto: false, url: '', extensao: '' });
    document.body.style.overflow = ''; // Destrava o scroll
  };

  // Atalho para fechar com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fecharModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* BARRA DE PROGRESSO DINÂMICA */}
      <div id="progress-container">
        <div id="progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* HEADER / NAVBAR */}
      <header className="navbar">
        <div className="logo">
          <span id="titulo-dev-oliver">DEV <span>OLIVER</span></span>
        </div>

        <button 
          className="menu-toggle" 
          id="menu-toggle" 
          aria-label="Abrir Menu" 
          aria-expanded={menuAberto}
          aria-controls="nav-menu"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <nav className={`nav-menu ${menuAberto ? 'active' : ''}`} id="nav-menu">
          <ul>
            <li><a href="#home" onClick={() => setMenuAberto(false)}>Início</a></li>
            <li><a href="#sobre" onClick={() => setMenuAberto(false)}>Sobre</a></li>
            <li><a href="#habilidades" onClick={() => setMenuAberto(false)}>Habilidades</a></li>
            <li><a href="#projetos" onClick={() => setMenuAberto(false)}>Projetos</a></li>
            <li><a href="#certificados" onClick={() => setMenuAberto(false)}>Qualificações</a></li>
            <li><a href="#contato" onClick={() => setMenuAberto(false)}>Contato</a></li>
          </ul>
        </nav>

        <button id="theme-toggle" aria-label="Mudar Tema" onClick={toggleTheme}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button> 
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main>
        {/* SEÇÃO HERO */}
        <section id="home" className="section-padding revelar">
          <div className="hero-content">
            <h1 className="animar-entrada">Olá, eu sou Oliver, um desenvolvedor júnior.</h1>
            <p className="animar-entrada-atrasada">Estou graduando em análise e desenvolvimento de sistemas. Busco oportunidade de emprego na área para aplicar meus conhecimentos no Front-End. Além disso, possuo conhecimento tanto em aplicações como Excel Avançado, MySql e Power BI para tratamento de dados, como conhecimento nas linguagens básicas de programação Front-End. Estou disponível para participar de processos seletivos e entrevistas.</p>
            <a href="#projetos" className="btn-primary">Ver Projetos</a>
          </div>
          <div className="hero-animation"></div>
        </section>

        {/* SEÇÃO SOBRE */}
        <section id="sobre" className="section-padding">
          <h2>Sobre mim</h2>
          <div className="sobre-container">
            <p>Criei esse site para exemplificar meus conhecimentos no Front-End, e um pouco no Back-End. Possuo conhecimento em HTML5, CSS3, JavaScript, React, Tailwind CSS, MySql, e alguns outros.</p>
            <a href="localdedestino/curriculo_BI_BD_AN.pdf" download="curriculo_BI_BD_AN.pdf" className="btn-secondary btn-view-cert">
              Baixar Currículo (PDF)
            </a>
          </div>
        </section>

        {/* SEÇÃO HABILIDADES */}
        <section id="habilidades" className="section-padding">
          <h2>Minhas Habilidades</h2>
          <div className="skills-grid">
            <div className="skill-card revelar"><h3>HTML5</h3></div>
            <div className="skill-card revelar delay-1"><h3>CSS3</h3></div>
            <div className="skill-card revelar delay-2"><h3>JavaScript</h3></div>
            <div className="skill-card revelar delay-3"><h3>Tailwind CSS</h3></div>
            <div className="skill-card revelar delay-4"><h3>Power BI</h3></div>
            <div className="skill-card revelar delay-5"><h3>MySQL</h3></div>
            <div className="skill-card revelar delay-6"><h3>React</h3></div>
          </div>
        </section>

        {/* SEÇÃO PROJETOS */}
        <section id="projetos" className="section-padding">
          <h2>Projetos em Destaque</h2>
          <div className="projects-grid">
            <article className="project-card">
              <div className="project-image">
                <img src="MyIndex/frontend/public/localdedestino/project-img-html.png" alt="Imagem dos códigos HTML do projeto do meu site"/>
              </div>

              <div className="project-content">
                <h3>Portfólio Profissional</h3>
                <p>Portfólio profissional responsivo desenvolvido para apresentar projetos, certificações e experiências de forma organizada.</p>
              
                <div className="features">
                  <h4>Funcionalidades:</h4>
                  <ul>
                    <li>Navegação suave entre seções</li>
                    <li>Layout responsivo</li>
                    <li>Formulário de contato</li>
                    <li>Integração com GitHub</li>
                    <li>Exibição de certificações</li>
                  </ul>
                </div>
              
                <div className="techs">
                  <h3>Tecnologias:</h3>
                  <div>
                    <span>#HTML</span>
                    <span>#CSS</span>
                    <span>#JavaScript</span>
                  </div>
                </div>

                <div className="project-links">
                  <a href="localdedestino/project-img-html.png" target="_blank" rel="noreferrer">Acessar Demo</a>
                </div>
              </div>
            </article>  
          </div>
        </section>

        {/* SEÇÃO FUTUROS PROJETOS */}
        <section id="future-projects" className="section-padding">
          <div className="future-content">
            <div className="future-icon"><i className="fa-solid fa-rocket"></i></div>
            <div className="future-text-wrapper">
              <h2>Novos projetos em breve!</h2>
              <p>Estou sempre trabalhando em novas ideias e soluções. Fique ligado!</p>
            </div>
            <span>
              <a href="https://github.com/Oliver-Dev85" target="_blank" rel="noreferrer" className="btn-github-link" aria-label="Veja meu GitHub">Veja meu GitHub</a>
            </span>
          </div>
        </section>

        {/* SEÇÃO CERTIFICADOS */}
        <section id="certificados" className="section-padding">
          <h2>Qualificações & Certificados</h2>
          <ul className="certificados-lista">
            <li className="skill-card revelar">
              <span>Graduando em Análise e Desenvolvimento de Sistemas - Anhanguera 2026</span>
              <button className="btn-view-cert" onClick={() => abrirModal("localdedestino/cert-facul-ads-unopar.pdf")}>Visualizar</button>
            </li>
            <li className="skill-card revelar delay-1">
              <span>Certificação de Design Responsivo para Web - FreeCodeCamp</span>
              <button className="btn-view-cert" onClick={() => abrirModal("localdedestino/certificado-responsivo.jpg")}>Visualizar</button>
            </li>
            <li className="skill-card revelar delay-2">
              <span>Certificação JavaScript - FreeCodeCamp</span>
              <button className="btn-view-cert" onClick={() => abrirModal("localdedestino/certificado-js.jpg")}>Visualizar</button>
            </li>
            <li className="skill-card revelar delay-3">
              <span>Certificação de Bibliotecas de Desenvolvimento Front-End - FreeCodeCamp</span>
              <button className="btn-view-cert" onClick={() => abrirModal("localdedestino/certificado-libraries.jpg")}>Visualizar</button>
            </li>
            <li className="skill-card revelar delay-4">
              <span>Certificação em Python - FreeCodeCamp</span>
              <button className="btn-view-cert" onClick={() => abrirModal("localdedestino/")}>Visualizar</button>
            </li>
            <li className="skill-card revelar delay-5">
              <span>Certificação de Banco de Dados Relacionais - FreeCodeCamp</span>
              <button className="btn-view-cert" onClick={() => abrirModal("localdedestino/certificado-db.jpg")}>Visualizar</button>
            </li>
            <li className="skill-card revelar delay-6">
              <span>Certificação de Desenvolvimento Back-End e APIs - FreeCodeCamp</span>
              <button className="btn-view-cert" onClick={() => abrirModal("localdedestino/certificado-backend.jpg")}>Visualizar</button>
            </li>
          </ul>
        </section>

        {/* SEÇÃO CONTATO */}
        <section id="contato" className="section-padding">
          <h2>Vamos Conversar?</h2>
          <form action="https://api.web3forms.com/submit" method="POST" className="contato-form">
            <input type="hidden" name="access_key" value="3128f0e9-63c7-42ca-b6ef-ab802d076807"/>

            <div className="input-group">
              <input 
                type="text" 
                id="nome" 
                name="name" 
                placeholder="Seu Nome" 
                aria-label="Seu Nome" 
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </div>

            <div className="input-group">
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Seu E-mail" 
                aria-label="Seu E-mail" 
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="input-group">
              <textarea 
                id="proposta" 
                name="message" 
                placeholder="Sua mensagem ou Proposta de Trabalho" 
                aria-label="Sua mensagem ou Proposta de Trabalho" 
                required
                value={form.proposta}
                onChange={(e) => setForm({ ...form, proposta: e.target.value })}
              ></textarea>
            </div>

            <input type="hidden" name="redirect" value="https://api.web3forms.com/success"/>

            <div className="form-actions">
              <button type="submit" className="btn-submit">Enviar via e-mail</button>
              <button type="button" id="btnWhatsapp" className="btn-whatsapp" onClick={enviarWhatsapp}>Enviar via WhatsApp</button>
            </div>
          </form>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-socials">
          <span>
            <a href="https://www.instagram.com/gab.oliver85/?__pwa=1" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-instagram icone-instagram"></i>
            </a>
          </span>
          <span>
            <a href="https://wa.me/5585988415344" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-whatsapp icone-whatsapp"></i>
            </a>
          </span>
          <span>
            <a href="https://github.com/Oliver-Dev85" target="_blank" rel="noreferrer">
              <i className="fa-brands fa-github icone-github"></i>
            </a>
          </span>
        </div>
        <p>&copy; 2026 Dev Oliver. Desenvolvido com React & TypeScript.</p>
      </footer>

      {/* ADICIONE O CHATBOX AQUI, LOGO APÓS O FOOTER */}
      <ChatBox />
    <div/>

      {/* MODAL DE CERTIFICADOS DINÂMICO */}
      {modalConfig.aberto && (
        <div 
          id="cert-modal" 
          className="modal active"
          onClick={(e) => e.target === e.currentTarget && fecharModal()} // Fecha se clicar no fundo escuro
        >
          <span className="modal-close" onClick={fecharModal}>&times;</span>
          <div className="modal-content">
            
            {/* Se for PDF, renderiza o iframe */}
            {modalConfig.extensao === 'pdf' && (
              <iframe 
                src={modalConfig.url} 
                title="Visualizador PDF" 
                style={{ width: "100%", height: "400px", border: "none" }} 
              />
            )}

            {/* Se for Imagem, renderiza a tag img */}
            {['jpg', 'jpeg', 'png', 'webp'].includes(modalConfig.extensao) && (
              <img id="modal-img" src={modalConfig.url} alt="Preview Certificado"/>
            )}

            <a id="modal-download" href={modalConfig.url} download className="btn-download-cert">
              Baixar Arquivo
            </a>
          </div>
        </div>
      )}
    </>
  )
}

export default App