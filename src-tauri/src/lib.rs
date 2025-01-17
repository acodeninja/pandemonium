mod serial;

extern crate mio_serial;

use crate::serial::{PortapackDevice};
use std::sync::Mutex;
use tauri::{Builder, Manager, State};

#[derive(Default)]
struct AppState {
    devices: Vec<PortapackDevice>,
}

#[tauri::command]
fn get_device_info(state: State<'_, Mutex<AppState>>, identifier: &str) -> String {
  for device in &state.lock().unwrap().devices {
    if device.identifier == identifier {
      return serde_json::to_string(&device.get_device_information()).expect("Failed to serialize device info");
    }
  }
  "".to_string()
}

#[tauri::command]
fn refresh_connected_devices(state: State<'_, Mutex<AppState>>) -> String {
    let mut locked_state = state.lock().unwrap();
    locked_state.devices = serial::get_connected_devices();
    serde_json::to_string(&locked_state.devices).unwrap()
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    Builder::default()
        .setup(|app| {
            app.manage(Mutex::new(AppState::default()));
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            refresh_connected_devices,
            get_device_info,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
