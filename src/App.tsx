import './App.css';
import {Route, Routes} from 'react-router';
import HomeView from '@/views/Home.tsx';
import MainLayout from '@/layouts/Main.tsx';
import {WithPortapackDevices} from '@/context/PortapackDevices.tsx';

function App() {
  return (
    <WithPortapackDevices>
      <MainLayout>
        <Routes>
          <Route index element={<HomeView />} />
        </Routes>
      </MainLayout>
    </WithPortapackDevices>
  );
}

export default App;
