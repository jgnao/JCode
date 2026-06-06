import React, { useState, useRef, useEffect, useMemo } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import logoExplorer from "../assets/128x128.png";

export function WindowControls() {
    const appWindow = getCurrentWindow();

    return (
        <div className="window-controls">
            <span className="control-dot dot-minimize" onClick={() => appWindow.minimize()}></span>
            <span className="control-dot dot-maximize" onClick={() => appWindow.toggleMaximize()}></span>
            <span className="control-dot dot-close" onClick={() => appWindow.close()}></span>
        </div>
    )
}

export function MenuItens({MenuItem}) {

    return (
        <div className="menu-items">
            <img src={logoExplorer} alt="" style={{ width: "30px" }} />
            <div className="jcode-title">JCode</div>
            <MenuItem item={"arquivo"} />
            <MenuItem item={"editar"} />
            <MenuItem item={"terminal"} />
            <MenuItem item={"gitHub"} />
        </div>
    )
}