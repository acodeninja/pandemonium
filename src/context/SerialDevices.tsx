import React, {createContext, useState} from 'react';
import {SerialDevice, listConnectedDevices} from '@/lib/serial.ts';

export type SerialDevicesContextValue = {
  devices: SerialDevice[];
  device?: SerialDevice;
  refreshDevices: () => void;
  setDevice: (_: SerialDevice) => void;
}

export const SerialDevicesContext = createContext<SerialDevicesContextValue>({
  device: undefined,
  devices: [],
  refreshDevices: () => {
  },
  setDevice: (_: SerialDevice) => {
  },
});

export function WithSerialDevices({children}: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<SerialDevice[]>([]);
  const [device, setDevice] = useState<SerialDevice>();

  function refreshDevices() {
    listConnectedDevices()
      .then(d => setDevices(d))
      .then(() => setDevice(undefined));
  }

  return (
    <SerialDevicesContext.Provider value={{device, devices, refreshDevices, setDevice}}>
      {children}
    </SerialDevicesContext.Provider>
  );
}
