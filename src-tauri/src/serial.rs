use mio_serial::{SerialPort, SerialPortType};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::io::{Read, Write};
use std::time::Duration;

pub const DEFAULT_BAUD: u32 = 9600;
pub const DEFAULT_COMMAND_TIMEOUT: u32 = 200;

#[derive(Serialize, Deserialize, Clone)]
pub struct PortapackDevice {
    pub identifier: String,
    pub serial: PortapackSerialDevice,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PortapackSerialDevice {
    pub ports: Vec<String>,
    pub manufacturer: Option<String>,
    pub product: Option<String>,
    pub serial_number: Option<String>,
    pub product_id: u16,
    pub vendor_id: u16,
    pub baud_rate: u32,
    pub command_timeout: Duration,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PortapackDeviceInfo {
  pub kernel: String,
  pub compiler: String,
  pub architecture: String,
  pub core_variant: String,
  pub port_info: String,
  pub platform: String,
  pub board: String,
  pub mayhem_version: String,
  pub hackrf_board_rev: String,
  pub reference_source: String,
  pub reference_freq: String,
  pub build_time: String,
}

impl PortapackDevice {
    fn get_device_connection(&self) -> Box<dyn SerialPort> {
        mio_serial::new(self.serial.ports[0].clone(), self.serial.baud_rate)
            .open()
            .unwrap_or_else(|e| {
                eprintln!(
                    "Failed to open \"{}\". Error: {}",
                    self.serial.ports[0].clone(),
                    e
                );
                ::std::process::exit(1);
            })
    }

    pub fn get_device_information(&self) -> PortapackDeviceInfo {
        let mut port = self.get_device_connection();
        let _ = port
            .write("info\r".as_bytes())
            .expect("Error writing to serial port");

        let buffer: &mut [u8] = &mut [0u8; 1024];

        std::thread::sleep(self.serial.command_timeout);

        let _ = port.read(buffer).expect("Error reading serial port");
        let output =
            std::str::from_utf8(buffer).expect("Error converting serial port output to UTF-8");

        let mut information = PortapackDeviceInfo {
            kernel: "".to_string(),
            compiler: "".to_string(),
            architecture: "".to_string(),
            core_variant: "".to_string(),
            port_info: "".to_string(),
            platform: "".to_string(),
            board: "".to_string(),
            mayhem_version: "".to_string(),
            hackrf_board_rev: "".to_string(),
            reference_source: "".to_string(),
            reference_freq: "".to_string(),
            build_time: "".to_string(),
        };

        for line in output.split("\r\n").collect::<Vec<&str>>() {
            if !line.contains(":") {
                continue;
            }
            let (key, value) = line.split_once(":").unwrap();

            let clean_key = key.trim().to_lowercase().replace(" ", "_");
            let clean_value = value.trim().to_string();

            match clean_key.as_str() {
                "kernel" => {
                    information.kernel = clean_value;
                }
                "compiler" => {
                    information.compiler = clean_value;
                }
                "architecture" => {
                    information.architecture = clean_value;
                }
                "core_variant" => {
                    information.core_variant = clean_value;
                }
                "port_info" => {
                    information.port_info = clean_value;
                }
                "platform" => {
                    information.platform = clean_value;
                }
                "board" => {
                    information.board = clean_value;
                }
                "mayhem_version" => {
                    information.mayhem_version = clean_value;
                }
                "hackrf_board_rev" => {
                    information.hackrf_board_rev = clean_value;
                }
                "reference_source" => {
                    information.reference_source = clean_value;
                }
                "reference_freq" => {
                    information.reference_freq = clean_value;
                }
                "build_time" => {
                    information.build_time = clean_value;
                }
                _ => {}
            }
        }

        port.flush().unwrap();

        information
    }
}

pub fn get_connected_devices() -> Vec<PortapackDevice> {
    let mut ports = mio_serial::available_ports().expect("cannot open serial ports");

    ports.retain(|x| match &x.port_type {
        SerialPortType::UsbPort(p) => p.product == Option::from("PortaPack Mayhem".to_string()),
        _ => false,
    });

    let mut devices: HashMap<u16, PortapackDevice> = HashMap::new();

    for port in ports {
        match port.port_type {
            SerialPortType::UsbPort(p) => {
                let identifier = p.pid + p.vid;

                if devices.contains_key(&identifier) {
                    devices
                        .get_mut(&identifier)
                        .expect("no such device")
                        .serial
                        .ports
                        .append(&mut vec![port.port_name])
                } else {
                    devices.insert(
                        identifier,
                        PortapackDevice {
                          identifier: port.port_name.clone().into(),
                          serial: PortapackSerialDevice {
                                ports: vec![port.port_name.into()],
                                manufacturer: p.manufacturer,
                                product: p.product,
                                serial_number: p.serial_number,
                                product_id: p.pid,
                                vendor_id: p.vid,
                                baud_rate: DEFAULT_BAUD,
                                command_timeout: Duration::from_millis(
                                    DEFAULT_COMMAND_TIMEOUT.into(),
                                ),
                            },
                        },
                    );
                }
            }
            _ => {}
        }
    }

    devices.into_values().collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_get_connected_devices() {
        let result = get_connected_devices();
        let device = result[0].clone();

        assert_eq!(device.identifier, "/dev/cu.usbmodemTransceiver1");
        assert_eq!(device.serial.ports.len(), 2);
        assert_eq!(device.serial.ports, vec!["/dev/cu.usbmodemTransceiver1", "/dev/tty.usbmodemTransceiver1"]);
        assert_eq!(
            device.serial.manufacturer,
            Option::from("Great Scott Gadgets".to_string())
        );
        assert_eq!(
            device.serial.product,
            Option::from("PortaPack Mayhem".to_string())
        );
        assert_eq!(
            device.serial.serial_number,
            Option::from("Transceiver".to_string())
        );
        assert_eq!(device.serial.product_id, 24600);
        assert_eq!(device.serial.vendor_id, 7504);
    }

    #[test]
    fn test_get_device_information() {
        let result = get_connected_devices();
        let information = result[0].get_device_information();

        assert_eq!(information.kernel, "2.6.8");
        assert_eq!(
            information.compiler,
            "GCC 9.2.1 20191025 (release) [ARM/arm-9-branch revision 277599]"
        );
        assert_eq!(information.architecture, "ARMv6-M");
        assert_eq!(information.core_variant, "Cortex-M0");
        assert_eq!(information.port_info, "Preemption through NMI");
        assert_eq!(information.platform, "LPC43xx M0");
        assert_eq!(information.board, "PortaPack Application");
        assert_eq!(information.mayhem_version, "v2.1.0");
        assert_eq!(information.hackrf_board_rev, "R1-R8");
        assert_eq!(information.reference_source, "External");
        assert_eq!(information.reference_freq, "10.0000 MHz");
        assert_eq!(information.build_time, "Dec 20 2024 - 07:09:16");
    }
}
