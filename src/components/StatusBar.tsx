import {Badge} from '@/components/ui/badge.tsx';

export default function StatusBar() {
  return (
    <div>
      <Badge variant="outline" className="mr-2 rounded bg-red-800">CONNECTION</Badge>
      <Badge variant="outline" className="mr-2 rounded">COMMUNICATION</Badge>
    </div>
  );
}
