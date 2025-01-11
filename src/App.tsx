import './App.css';
import {Route, Routes} from 'react-router';
import HomeView from '@/views/Home.tsx';
import MainLayout from '@/layouts/Main.tsx';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route index element={<HomeView />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
