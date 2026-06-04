#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use rfd::FileDialog;
use std::path::{Path, PathBuf};

fn caminho_protegido(path: &Path) -> bool {
    let protegidos = [
        "C:\\Windows",
        "C:\\Program Files",
        "C:\\Program Files (x86)",
        "C:\\Users\\Default",
    ];

    let canonico = match path.canonicalize() {
        Ok(p) => p,
        Err(_) => return true,
    };

    let caminho_str = canonico.to_string_lossy();

    protegidos
        .iter()
        .any(|p| caminho_str.starts_with(p))
}

#[tauri::command]
fn remove_file(path: String) -> Result<bool, String> {
    let path = PathBuf::from(path);

    if caminho_protegido(&path) {
        return Err("Arquivo protegido".into());
    }

    if !path.exists() {
        return Err("Arquivo não encontrado".into());
    }

    fs::remove_file(path).map_err(|e| e.to_string())?;
    Ok(true)
}

#[tauri::command]
fn remove_dir(path: String) -> Result<bool, String> {
    let path = PathBuf::from(path);

    if caminho_protegido(&path) {
        return Err("Pasta protegida".into());
    }

    if !path.exists() {
        return Err("Pasta não encontrada".into());
    }

    fs::remove_dir(path).map_err(|e| e.to_string())?;
    Ok(true)
}

#[tauri::command]
fn select_folder() -> Option<String> {
    let res = FileDialog::new()
        .pick_folder();

    match res {
        Some(path) => Some(path.to_string_lossy().to_string()),
        None => None
    }
}

#[tauri::command]
fn open_file(path: String) -> Result<(), String> {
    open::that(path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_file(path: String) -> Result<bool, String> {
    fs::write(path, "").map_err(|e| e.to_string())?;
    
    Ok(true)
}

#[tauri::command]
fn create_dir(path: String) -> Result<bool, String> {
    fs::create_dir(path).map_err(|e| e.to_string())?;
    Ok(true)
}

#[tauri::command]
fn rename_file(path: String, name: String) -> Result<bool, String> {
    fs::rename(path, name).map_err(|e| e.to_string())?;
    Ok(true)
}

#[tauri::command]
fn write_file(path: String, content: String) -> Result<(), String> {
    fs::write(path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn is_folder(path: String) -> bool {
    fs::metadata(path)
        .map(|meta| meta.is_dir())
        .unwrap_or(false)
}

#[tauri::command]
fn list_files(path: String) -> Result<Vec<String>, String> {
    let entries = fs::read_dir(&path)
        .map_err(|e| e.to_string())?;

    let files = entries
        .filter_map(|e| e.ok())
        .map(|e| e.file_name().to_string_lossy().to_string())
        .collect();

    Ok(files)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            list_files,
            write_file,
            read_file,
            select_folder,
            is_folder,
            open_file,
            create_file,
            create_dir,
            rename_file,
            remove_file,
            remove_dir
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}