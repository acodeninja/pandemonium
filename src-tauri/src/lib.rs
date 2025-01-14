extern crate mio_serial;
use mio_serial::SerialPortType;

#[tauri::command]
fn list_connected_devices() -> String {
    let mut ports = mio_serial::available_ports().expect("cannot open serial ports");
    ports
        .retain(|x| match x.port_type {
            SerialPortType::UsbPort(_) => true,
            _ => false,
        });
    serde_json::to_string(&ports).unwrap()
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![list_connected_devices])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
