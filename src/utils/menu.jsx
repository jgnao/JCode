import React, { useState, useRef, useEffect, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function Menu({ x, y, arquivo, pastaAtual, atualizarPasta, desativar }) {
    const [conteudo, setConteudo] = useState("")
    const reiniciar = () => {
        window.location.reload();
    }

    const atualizar = () => {
        desativar();
        atualizarPasta();
    }

    const criar_arquivo = async () => {
        if (conteudo == "") return;
        if (!arquivo) {
            console.log(conteudo)
            const caminhoCompleto = `${pastaAtual}\\${conteudo}`;
            console.log(caminhoCompleto)
            try {
                await invoke("create_file", {
                    path: caminhoCompleto,
                });
            } catch (err) {
                console.error(err);
            }
            atualizar();
            return
        };
        const form = arquivo.split(" ->")[0]
        const form2 = form.split(" <-")[0]
        console.log(form, form2)
        console.log(conteudo)
        const caminhoCompleto = `${pastaAtual}\\${form2}\\${conteudo}`;
        console.log(caminhoCompleto)
        try {
            await invoke("create_file", {
                path: caminhoCompleto,
            });
        } catch (err) {
            console.error(err);
        }
        atualizar();
    };

    const testarSeEPasta = async (caminho) => {
        try {
            return await invoke("is_folder", { path: caminho });
        } catch (err) {
            return false;
        }
    };

    const criar_pasta = async () => {
        if (conteudo == "") return;
        if (!arquivo) {
            console.log(conteudo)
            const caminhoCompleto = `${pastaAtual}\\${conteudo}`;
            try {
                await invoke("create_dir", {
                    path: caminhoCompleto,
                });
            } catch (err) {
                console.error(err);
            }
            atualizar();
            return
        };
        const form = arquivo.split(" ->")[0]
        const form2 = form.split(" <-")[0]
        const caminhoCompleto = `${pastaAtual}\\${form2}\\${conteudo}`;
        try {
            await invoke("create_dir", {
                path: caminhoCompleto,
            });
        } catch (err) {
            console.error(err);
        }
        atualizar();
    };

    const deletar = async () => {
        if (!arquivo) return;
        const form = arquivo.split(" ->")[0]
        const form2 = form.split(" <-")[0]
        console.log(form, form2)
        const caminhoCompleto = `${pastaAtual}\\${form2}`;
        let isFolder = await testarSeEPasta(caminhoCompleto)
        console.log(isFolder)
        
        if (isFolder) {
            console.log(caminhoCompleto)
            try {
                await invoke("remove_dir", {
                    path: caminhoCompleto,
                });
            } catch (err) {
                console.error(err);
            }
            atualizar();
            return
        }
        try {
            await invoke("remove_file", {
                path: caminhoCompleto,
            });
        } catch (err) {
            console.error(err);
        }
        atualizar();
    };

    const renomear = async () => {
        if (conteudo == "") return;
        if (!arquivo) return;

        const form = arquivo.split(" ->")[0];
        const form2 = form.split(" <-")[0];

        const caminhoCompleto = `${pastaAtual}\\${form2}`;

        console.log(caminhoCompleto, conteudo);

        const caminhosem = caminhoCompleto.replaceAll("/", "\\");
        const caminhoSplit = caminhosem.split("\\");
        const p = caminhoSplit.pop();
        const caminhoAtualizado = caminhoSplit.join("\\");

        console.log(caminhosem)
        console.log(caminhoSplit)
        console.log(caminhoAtualizado);

        try {
            await invoke("rename_file", {
                path: caminhoCompleto,
                name: `${caminhoAtualizado}\\${conteudo}`,
            });
        } catch (err) {
            console.error(err);
        }
        atualizar();
    };

    return (
        <div className="menu" style={{ position: "fixed", left: x, top: y }}>
            <ul>
                {pastaAtual && (<li><button className="context-item" onClick={criar_pasta}>Nova Pasta</button></li>)}
                {pastaAtual && arquivo && (<li><button className="context-item" onClick={renomear}>Renomear</button></li>)}
                {pastaAtual && (<li><button className="context-item" onClick={criar_arquivo}>Novo Arquivo</button></li>)}
                {pastaAtual && arquivo && (<li><button className="context-item" onClick={deletar}>Deletar</button></li>)}
                <li><button className="context-item" onClick={atualizar}>Atualizar</button></li>
                <li><button className="context-item" onClick={reiniciar}>Reiniciar</button></li>
                {(<textarea className="name-area" name="" id="" rows="1" cols="10" placeholder="Name" onInput={e => { setConteudo(e.target.value); }} />)}
            </ul>
        </div>
    );
}