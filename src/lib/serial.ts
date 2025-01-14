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

export async function listConnectedDevices(): Promise<SerialPortInfo[]> {
  const devices = JSON.parse(await invoke('list_connected_devices'));
  getLogger().info('found serial devices', {devices});
  return devices;
}
