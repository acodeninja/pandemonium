import {PortapackDevice, listConnectedDevices} from '@/lib/serial.ts';
import React, {createContext, useState} from 'react';

export type PortapackDevicesContextValue = {
  devices: PortapackDevice[];
  device?: PortapackDevice;
  refreshDevices: () => void;
  setDevice: (_: PortapackDevice) => void;
}

export const PortapackDevicesContext = createContext<PortapackDevicesContextValue>({
  device: undefined,
  devices: [],
  refreshDevices: () => {
  },
  setDevice: (_: PortapackDevice) => {
  },
});

export function WithPortapackDevices({children}: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<PortapackDevice[]>([]);
  const [device, setDevice] = useState<PortapackDevice>();

  function refreshDevices() {
    listConnectedDevices()
      .then(d => setDevices(d))
      .then(() => setDevice(undefined));
  }

  return (
    <PortapackDevicesContext.Provider value={{device, devices, refreshDevices, setDevice}}>
      {children}
    </PortapackDevicesContext.Provider>
  );
}
