import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// Essentials
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
//Shortcuts
import { shortcuts } from "./essentials/keyboardcuts"
//CSS
import "./App.css";
// File-Tree
import FileTree from "./utils/fileTree";
import CodeEditor from "./utils/codeEditor";
import Menu from "./utils/menu";
import SubMenu from "./utils/submenu";
//Logo
import logo from "./assets/teste.png";
import logoExplorer from "./assets/128x128.png";
import { event } from "@tauri-apps/api";


export default function Editor() {
  const [pastaAtual, setPastaAtual] = useState("");
  const [arquivos, setArquivos] = useState([]);
  const [arquivosAbertos, setArquivosAbertos] = useState([]);
  const [siderbar, setSidebarActive] = useState(false);
  const [arquivoAtivo, setArquivoAtivo] = useState(null);
  const [conteudoCodigo, setConteudoCodigo] = useState("");
  const [subMenu, setSubMenu] = useState("");
  const [folders, setFolders] = useState({});
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0, active: false, arquivo: null });
  const [submenuPos, setSubMenuPos] = useState({ x: 0, y: 0, active: false });

  const trocar_pagina = useNavigate();
  const appWindow = getCurrentWindow();

  const extensao = useMemo(() => {
    return arquivoAtivo ? arquivoAtivo.split(".").pop() : "";
  }, [arquivoAtivo]);

  const pastaSelecionada = useMemo(() => {
    return pastaAtual ? pastaAtual.split("\\").pop() : "";
  }, [pastaAtual]);

  const Fsidebar = () => {
    setSidebarActive(!siderbar)
  }

  const desativar_menu = () => {
    setMenuPos({
      x: 0,
      y: 0,
      active: false,
      arquivo: null
    });
  }

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      const arquivo = e.target.closest(".file-tree") || e.target.className == "sidebar";
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
      console.log(arquivo)
      console.log(e.target.textContent)
      console.log(e.target.className)
      console.log(e.target.dataset.path)
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")

      if (arquivo) {
        setMenuPos({
          x: e.clientX,
          y: e.clientY,
          active: true,
          arquivo: e.target.dataset.path
        });
        return
      }
      desativar_menu();
    };

    const handleClick = (e) => {
      if (e.target.closest(".menu")) return
      desativar_menu();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const abrir_submenu = (e) => {
    setSubMenuPos({
      x: e.clientX,
      y: e.clientY,
      active: true,
    });
  }
  const desativar_submenu = (e) => {
    setSubMenuPos({
      x: 0,
      y: 0,
      active: false,
    });
  }

  useEffect(() => {
    const handleClick = (e) => {
      if (!submenuPos.active) return;
      if (e.target.closest(".menu")) return;

      desativar_submenu();
    }
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [submenuPos.active]);


  useEffect(() => {
    async function checkFolders() {
      const result = {};
      await Promise.all(
        arquivos.map(async (file) => {
          const is = await testarSeEPasta(file);
          result[file] = is;
        })
      );
      setFolders(result);
    }

    if (arquivos.length > 0) {
      checkFolders();
    }
  }, [arquivos]);

  const atualizar = async () => {
    try {
      if (pastaAtual) {
        const lista = await invoke("list_files", { path: pastaAtual });
        setArquivos(lista);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const testarSeEPasta = async (nomeArquivo) => {
    try {
      const caminhoCompleto = `${pastaAtual}/${nomeArquivo}`;
      return await invoke("is_folder", { path: caminhoCompleto });
    } catch (err) {
      return false;
    }
  };

  const testar = async (nomeArquivo) => {
    if (!nomeArquivo) return;
    try {
      const caminhoCompleto = `${pastaAtual}/${nomeArquivo}`;
      const ext = nomeArquivo.split(".").pop();

      if (ext === "html") {
        await invoke("open_file", { path: caminhoCompleto });
      } else if (ext === "php") {
        const parts = pastaAtual.split("htdocs");
        const relativePath = parts[parts.length - 1] || "";
        await invoke("open_file", {
          path: `https://localhost${relativePath}/${nomeArquivo}`
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selecionarPasta = async () => {
    try {
      const pasta = await invoke("select_folder");
      if (pasta) {
        setPastaAtual(pasta);
        const lista = await invoke("list_files", { path: pasta });
        setArquivos(lista);
        setArquivoAtivo(null);
        setArquivosAbertos([]);
        setConteudoCodigo("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const abrirArquivo = async (nomeArquivo) => {
    const ext = nomeArquivo.split(".").pop();
    let extensions = [
      "html",
      "js",
      "css",
      "json",
      "txt",
      "cpp",
      "php"
    ]

    if (!extensions.includes(ext.toLowerCase())) {
      return
    }

    setArquivoAtivo(nomeArquivo);

    if (!arquivosAbertos.includes(nomeArquivo)) {
      setArquivosAbertos(prev => [...prev, nomeArquivo]);
    }

    const caminhoCompleto = `${pastaAtual}/${nomeArquivo}`;
    try {
      const texto = await invoke("read_file", { path: caminhoCompleto });
      setConteudoCodigo(texto);
    } catch (err) {
      console.error(err);
    }
  };

  const fecharArquivo = (e, arquivoParaFechar) => {
    if (e) e.stopPropagation();

    const novosArquivos = arquivosAbertos.filter(a => a !== arquivoParaFechar);
    setArquivosAbertos(novosArquivos);

    if (arquivoAtivo === arquivoParaFechar) {
      const proximo = novosArquivos[novosArquivos.length - 1] || null;
      if (proximo) {
        abrirArquivo(proximo);
      } else {
        setArquivoAtivo(null);
        setConteudoCodigo("");
      }
    }
  };

  const salvarArquivo = async () => {
    if (!arquivoAtivo) return;
    const caminhoCompleto = `${pastaAtual}/${arquivoAtivo}`;
    try {
      await invoke("write_file", {
        path: caminhoCompleto,
        content: conteudoCodigo,
      });
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="app-container">
      <header className="navbar">
        <div className="menu-items">
          <img src={logoExplorer} alt="" style={{ width: "30px" }} />
          <div className="jcode-title">JCode</div>
          <div className="menu-item" onClick={(e) => {
            e.stopPropagation();
            abrir_submenu(e)
            setSubMenu("arquivo");
          }}>Arquivo</div>
          <div className="menu-item" onClick={(e) => {
    e.stopPropagation();
            abrir_submenu(e)
            setSubMenu("editar");
          }}>Editar</div>
          <div className="menu-item" onClick={(e) => {
    e.stopPropagation();
            abrir_submenu(e)
            setSubMenu("terminal");
          }}>Terminal</div>
          <div className="menu-item">Ajuda</div>
        </div>

        <div className="app-title" id="appTitle">
          {arquivoAtivo ? `${arquivoAtivo.split("/").pop()} — JCode` : "JCode"}
        </div>

        <div className="window-controls">
          <span className="control-dot dot-minimize" onClick={() => appWindow.minimize()}></span>
          <span className="control-dot dot-maximize" onClick={() => appWindow.toggleMaximize()}></span>
          <span className="control-dot dot-close" onClick={() => appWindow.close()}></span>
        </div>
      </header>

      <div className="main-body">
        <nav className="activity-bar">
          <div className="activity-group">
            <div className="activity-icon active" title="Explorador">
              <svg viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
              </svg>
            </div>
            <div className="activity-icon" title="Pesquisar">
              <svg viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>
          </div>
          <div className="activity-group">
            <div className="activity-icon" title="Perfil" type="button" onClick={() => {
              trocar_pagina("/profile")
            }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="64"
                height="64"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <div className="activity-icon" title="Configurações" type="button" onClick={() => {
              trocar_pagina("/config")
            }}>
              <svg viewBox="0 0 24 24">
                <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
              </svg>
            </div>
          </div>
        </nav>

        <aside className={siderbar ? ("d-none") : "sidebar"}>
          <div className="sidebar-title">Explorador</div>
          <div className="sidebar-folder">{!pastaSelecionada ? "Nenhuma pasta selecionada" : pastaSelecionada}</div>

          {!pastaAtual ? (
            <>
              <button onClick={selecionarPasta} id="tes" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} className="select-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" /></svg>
                Abrir Pasta
              </button>
              <img src={logo} alt="" style={{ marginTop: "60%" }} />
              <h4 style={{ textAlign: "center", color: "#b3b3b3", fontWeight: 400, marginTop: "20%" }}>Ainda não há uma pasta aberta</h4>
              <h5 style={{ textAlign: "center", color: "#b3b3b3", fontWeight: 400 }}>Abra uma pasta antes de começar a codificar</h5>
            </>
          ) : (
            <ul className="file-tree" id="fileTree">
              {arquivos.map(file => (
                <FileTree
                  key={file}
                  node={file}
                  parent={null}
                  pastaAtual={pastaAtual}
                  folders={folders}
                  arquivoAtivo={arquivoAtivo}
                  abrirArquivo={abrirArquivo}
                />
              ))}
            </ul>
          )}
        </aside>

        <main className="editor-container">
          <div className="tabs-bar" id="tabsBar">
            {arquivosAbertos.map(arquivo => (
              <div
                className={`tab ${arquivoAtivo === arquivo ? "active" : ""}`}
                onClick={() => abrirArquivo(arquivo)}
                key={arquivo}
              >
                <span>{arquivo.split("/").pop()}</span>
                <span
                  className="tab-close"
                  onClick={(e) => fecharArquivo(e, arquivo)}
                  style={{ fontWeight: "bold", color: "#8c00ff", marginLeft: "8px" }}
                  title="Fechar arquivo"
                >
                  x
                </span>
              </div>
            ))}
          </div>

          <div className="code-area-wrapper">
            {(arquivoAtivo && <CodeEditor
              key={arquivoAtivo}
              value={conteudoCodigo}
              onChange={setConteudoCodigo}
              ext={extensao.toLowerCase()}
              salvar={salvarArquivo}
            />)}
          </div>
        </main>
      </div>

      {submenuPos.active && <SubMenu x={submenuPos.x} y={submenuPos.y} tipo={subMenu} funcoes={{
        Fsidebar,
        selecionarPasta,
        salvarArquivo
      }} />}
      {menuPos.active && pastaSelecionada && <Menu x={menuPos.x} y={menuPos.y} arquivo={menuPos.arquivo} pastaAtual={pastaAtual} atualizarPasta={atualizar} desativar={desativar_menu} />}

      <footer className="status-bar">
        <div className="status-left">
          <div className="status-item">
            <span className="branch-pill">⑂ Main</span>
          </div>
          {(extensao.toUpperCase() == "HTML" || extensao.toUpperCase() == "PHP") && (<div className="status-item test-pill" style={{ color: "#ef4444" }} onClick={() => testar(arquivoAtivo)}>● Test</div>)}
        </div>
        <div className="status-right">
          <div className="status-item">Ln {conteudoCodigo.split("\n").length}, Col 1</div>
          <div className="status-item" id="languageIndicator">{extensao.toUpperCase()}</div>
        </div>
      </footer>
    </div>
  );
}