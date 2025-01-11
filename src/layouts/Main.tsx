import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar.tsx';
import Logo from '@/assets/logo.svg';
import React from 'react';
import {ScrollArea} from '@/components/ui/scroll-area.tsx';
import StatusBar from '@/components/StatusBar.tsx';
import { getCurrentWindow } from '@tauri-apps/api/window';

function MainLayout({children}: {children?: React.ReactNode}) {
  const appWindow = getCurrentWindow();

  return (
    <div className="flex flex-col h-screen w-screen">
      <header className="flex">
        <Menubar data-tauri-drag-region className="w-screen">
          <a
            href="https://github.com/acodeninja/pandemonium/tree/main?tab=readme-ov-file#readme"
            target="_blank"
            rel="noreferrer noopener"
            className="px-3"
          >
            <img src={Logo} alt="Pandemonium Logo" className="w-5 h-5" />
          </a>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem 
                onClick={() => appWindow.close()}
              >Exit</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </header>
      <main className="flex-1">
        <ScrollArea className="w-[100%] p-3">
          {children}
        </ScrollArea>
      </main>
      <footer className="flex mx-3 my-2">
        <StatusBar />
      </footer>
    </div>
  );
}

export default MainLayout;
