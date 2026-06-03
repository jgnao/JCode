import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect, useMemo } from "react";
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
//Logo
import logo from "./assets/teste.png";
import logoExplorer from "./assets/128x128.png";
import { event } from "@tauri-apps/api";

export default function Profile() {

  const trocar_pagina = useNavigate();
  const appWindow = getCurrentWindow();

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="menu-items">
          <img src={logoExplorer} alt="" style={{ width: "30px" }} />
          <div className="jcode-title">JCode</div>
          <div className="menu-item">Editar</div>
          <div className="menu-item">Terminal</div>
          <div className="menu-item">Ver</div>
          <div className="menu-item">Ajuda</div>
        </div>

        <div className="app-title" id="appTitle">
          Perfil - JCode
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
            <div className="activity-icon" title="Explorador" type="button" onClick={() => {
              trocar_pagina("/")
            }}>
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
            <div className="activity-icon active" title="Perfil" type="button">
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

        <main className="editor-container">
          <div className=" settings-page">
            <h2>Perfil</h2>

            <section className="setting-group">
              <h3>Aparência</h3>

              <div className="setting-item">
                <label>Tema</label>
                <select>
                  <option>Escuro</option>
                  <option>Claro</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Tamanho da Fonte</label>
                <input type="number" min="10" max="40" defaultValue="14" />
              </div>
            </section>

            <section className="setting-group">
              <h3>Editor</h3>

              <div className="setting-item">
                <label>Word Wrap</label>
                <input type="checkbox" />
              </div>

              <div className="setting-item">
                <label>Mostrar Números de Linha</label>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="setting-item">
                <label>Auto Save</label>
                <input type="checkbox"/>
              </div>
            </section>

            <section className="setting-group">
              <h3>Arquivos</h3>

              <div className="setting-item">
                <label>Restaurar Sessão ao Abrir</label>
                <input type="checkbox" defaultChecked />
              </div>

              <div className="setting-item">
                <label>Confirmar Antes de Excluir</label>
                <input type="checkbox" defaultChecked />
              </div>
            </section>
          </div>
        </main>
      </div>

      <footer className="status-bar">
        <div className="status-left">
          <div className="status-item">
            <span className="branch-pill">⑂ Profile</span>
          </div>
        </div>
      </footer>
    </div>
  );
}