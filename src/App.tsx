import { useState } from 'react';
import Terminal from './components/professional/Terminal';
import VSCode from './components/professional/VSCode';

export default function App() {
  const [view, setView] = useState<'terminal' | 'vscode'>('terminal');

  return (
    <div className="min-h-screen bg-[#0a0e14]">
      <div className="px-4 py-4">
        {view === 'terminal' ? (
          <Terminal onSwitchView={() => setView('vscode')} />
        ) : (
          <VSCode onSwitchView={() => setView('terminal')} />
        )}
      </div>
    </div>
  );
}
