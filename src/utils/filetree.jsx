import React, { useState, useRef, useEffect, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";

const FileIcon = ({ ext, isFolder, name }) => {
  const spacing = name
  ? (name.match(/\//g) || []).length + 1
  : 1;

  if (isFolder) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: `${spacing * 10}px`, width: "16px", height: "16px" }} fill="#0c0a1a" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v1H3V7z" />
        <path d="M3 9h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
      </svg>
    );
  }

  const colors = {
    css: "#0084ff",
    js: "#ffd000",
    html: "#f33100",
    php: "#9200f3",
    json: "#e5ff54",
    cpp: "#375fff",
    default: "#a8a0aa",
  };

  const fill = colors[ext] || colors.default;

  return (
    <svg viewBox="0 0 24 24" style={{ marginLeft: `${spacing * 10}px`, width: "14px", height: "14px" }} fill={fill}>
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
  );
};

export default function FileTree({
  node,
  parent,
  pastaAtual,
  folders,
  arquivoAtivo,
  abrirArquivo,
}) {
  const [aberto, setAberto] = useState(false);
  const [lista, setLista] = useState([]);
  const [isFolder, setIsFolder] = useState(false);

  const ext = node.split(".").pop();
  const caminhoAtual = parent ? `${parent}/${node}` : node;

  useEffect(() => {
    async function verificar() {
      const resultado = await testarSeEPasta(caminhoAtual);
      setIsFolder(resultado);
    }

    verificar();
  }, [caminhoAtual]);

  const testarSeEPasta = async (nomeArquivo) => {
    try {
      const caminhoCompleto = `${pastaAtual}/${nomeArquivo}`;
      return await invoke("is_folder", { path: caminhoCompleto });
    } catch (err) {
      return false;
    }
  };

  async function carregarPasta() {
    try {
      const caminho = `${pastaAtual}/${caminhoAtual}`;
      const arquivos = await invoke("list_files", { path: caminho });
      setLista(arquivos);
    } catch (err) {
      console.error("Erro ao carregar pasta:", err);
    }
  }

  if (!isFolder) {
    return (
      <li
        className={`file-${parent ? "inside" : "item"} ${arquivoAtivo === caminhoAtual ? "active" : ""}`}
        onClick={() => abrirArquivo(caminhoAtual)}
        data-path={String(caminhoAtual)}
      >
        <FileIcon ext={ext} isFolder={false} name={caminhoAtual} />
        <span>{node}</span>
      </li>
    );
  }

  return (
    <li>
      <div
        className={`file-${parent ? "inside" : "item"}`}
        onClick={() => {
          if (!aberto) {
            setLista([])
            carregarPasta();
          }
          setAberto(!aberto);
        }}
        data-path={String(caminhoAtual)}
      >
        <FileIcon isFolder={true} name={caminhoAtual} />
        <span>{node}{aberto ? " ->" : " <-"}</span>
      </div>

      {aberto && (
        <ul>
          {lista.map((file) => (
            <FileTree
              key={`${caminhoAtual}/${file}`}
              node={file}
              parent={caminhoAtual}
              pastaAtual={pastaAtual}
              folders={folders}
              arquivoAtivo={arquivoAtivo}
              abrirArquivo={abrirArquivo}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
