import {getLogger} from '@/lib/logging.ts';
import {invoke} from '@tauri-apps/api/core';

export type PortapackDevice = {
  identifier: string,
  serial: PortapackSerialDevice,
};

export type PortapackSerialDevice = {
  ports: string[],
  manufacturer?: string,
  product?: string,
  serial_number?: string,
  product_id: number,
  vendor_id: number,
};

export type PortapackDeviceInfo = {
  kernel: string,
  compiler: string,
  architecture: string,
  core_variant: string,
  port_info: string,
  platform: string,
  board: string,
  mayhem_version: string,
  hackrf_board_rev: string,
  reference_source: string,
  reference_freq: string,
  build_time: string,
}

export async function listConnectedDevices(): Promise<PortapackDevice[]> {
  const devices = JSON.parse(await invoke('refresh_connected_devices')) as PortapackDevice[];
  getLogger().info('found serial devices', devices);
  return devices;
}

export async function getDeviceInfo(device: PortapackDevice): Promise<PortapackDeviceInfo> {
  const deviceInfo = JSON.parse(await invoke('get_device_info', {identifier: device.identifier})) as PortapackDeviceInfo;
  getLogger().info('retrieved device info', deviceInfo);
  return deviceInfo;
}
