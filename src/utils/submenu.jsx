import React, { useState, useRef, useEffect, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { menu } from "@tauri-apps/api";

export default function SubMenu({ x, y, tipo, funcoes }) {

    const reiniciar = () => {
        window.location.reload();
    };

    const menus = {
        arquivo: [
            {
                nome: "Selecionar Arquivo",
                acao: funcoes.selecionarPasta
            },
            {
                nome: "Salvar Arquivo",
                acao: funcoes.salvarArquivo
            },
            {
                nome: "Desativar Explorador",
                acao: funcoes.Fsidebar
            }
        ],
        editar: [
            {
                nome: "Teste",
                acao: funcoes.abrirGitHub
            },
            {
                nome: "Teste 2",
                acao: funcoes.abrirGitHub
            }
        ],
        terminal: [
            {
                nome: "Teste 3",
                acao: funcoes.abrirGitHub
            }
        ],
        gitHub: [
            {
                nome: "Abrir GitHub",
                acao: funcoes.abrirGitHub
            }
        ],
    };

    return (
        <div
            className="menu"
            style={{ position: "fixed", left: x, top: y }}
        >
            <ul>
                {menus[tipo]?.map((e, index) => (
                    <li key={index}>
                        <button className="context-item" onClick={e.acao}>{e.nome}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}