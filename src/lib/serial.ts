import {getLogger} from '@/lib/logging.ts';
import {invoke} from '@tauri-apps/api/core';

type SerialPortInfo = {
   port_name: string;
   port_type: {
       UsbPort: {
           manufacturer: string;
           pid: number;
           product: string;
           serial_number: string;
           vid: number
       };
   };
};

export type SerialDevice = {
  paths: string[];
  manufacturer: string;
  pid: number;
  product: string;
  serialNumber: string;
  vid: number
};

export async function listConnectedDevices(): Promise<SerialDevice[]> {
  const rawDevices = JSON.parse(await invoke('list_connected_devices')) as SerialPortInfo[];
  const devices = Object.values(rawDevices
    .reduce((accumulator, currentDevice: SerialPortInfo): Record<string, SerialDevice> => {
      const deviceId = `${currentDevice.port_type.UsbPort.pid}-${currentDevice.port_type.UsbPort.vid}`;
      const existingDevice = accumulator[deviceId];

      if (!existingDevice) {
        accumulator[deviceId] = {
          manufacturer: currentDevice.port_type.UsbPort.manufacturer,
          paths: [currentDevice.port_name],
          pid: currentDevice.port_type.UsbPort.pid,
          product: currentDevice.port_type.UsbPort.product,
          serialNumber: currentDevice.port_type.UsbPort.serial_number,
          vid: currentDevice.port_type.UsbPort.vid,
        };
      } else {
        existingDevice.paths.push(currentDevice.port_name);
      }
      return accumulator;
    }, {} as Record<string, SerialDevice>));

  getLogger().info('found serial devices', devices);
  return devices;
}
