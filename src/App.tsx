import './App.css';
import {Route, Routes} from 'react-router';
import HomeView from '@/views/Home.tsx';
import MainLayout from '@/layouts/Main.tsx';
import {WithSerialDevices} from '@/context/SerialDevices.tsx';

function App() {
  return (
    <WithSerialDevices>
      <MainLayout>
        <Routes>
          <Route index element={<HomeView />} />
        </Routes>
      </MainLayout>
    </WithSerialDevices>
  );
}

export default App;
