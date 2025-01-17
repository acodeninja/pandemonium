import {PortapackDevice, PortapackDeviceInfo, getDeviceInfo} from '@/lib/serial.ts';
import {useEffect, useState} from 'react';
import {Badge} from '@/components/ui/badge.tsx';

export default function StatusBar({device}: {device?: PortapackDevice}) {
  const [deviceInfo, setDeviceInfo] = useState<PortapackDeviceInfo>();

  useEffect(() => {
    if (device)
      getDeviceInfo(device)
        .then(setDeviceInfo);
  }, [device]);

  return (
    <div className="border-t pb-1 px-2">
      {device && (
        <>
          <Badge variant="outline" className="mr-2 rounded bg-gray-400 text-black">{device.serial.manufacturer}: {device.serial.product}</Badge>
          <Badge variant="outline" className="mr-2 rounded bg-green-800">Mayhem: {deviceInfo?.mayhem_version}</Badge>
          <Badge variant="outline" className="mr-2 rounded bg-red-800">CONNECTION</Badge>
        </>
      )}
    </div>
  );
}
