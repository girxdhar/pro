// VSCode.tsx
import React, { useMemo, useState } from 'react';
import {
  File as FileIcon,
  Folder as FolderIcon,
  FolderOpen,
  Search,
  GitBranch,
  Settings,
  ChevronRight,
  ChevronDown,
  X,
  Terminal as TerminalIcon,
  Files,
  Bug,
  Package,
  Circle,
  AlertTriangle,
  Minus,
  Square,
  Menu,
  ChevronLeft,
  User,
  Layers,
  FileText,
  FileJson,
} from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

type FileType = 'home' | 'about' | 'experience' | 'projects' | 'skills' | 'contact';
type SidebarView = 'explorer' | 'search' | 'git' | 'debug' | 'extensions';

interface FileItem {
  name: string;
  icon?: React.ReactNode;
  type: FileType;
  language: string;
}

interface VSCodeProps {
  onSwitchView: () => void;
}

/* ---------- File structure (keeps your original files & languages) ---------- */
const fileStructure: { name: string; files: FileItem[] }[] = [
  {
    name: 'src',
    files: [
      { name: 'home.tsx', icon: <FileText className="w-4 h-4" />, type: 'home', language: 'typescriptreact' },
      { name: 'projects.tsx', icon: <FileText className="w-4 h-4" />, type: 'projects', language: 'typescriptreact' },
    ],
  },
  {
    name: 'content',
    files: [
      { name: 'about.md', icon: <FileIcon className="w-4 h-4" />, type: 'about', language: 'markdown' },
      { name: 'contact.md', icon: <FileIcon className="w-4 h-4" />, type: 'contact', language: 'markdown' },
    ],
  },
  {
    name: 'data',
    files: [
      { name: 'experience.json', icon: <FileJson className="w-4 h-4" />, type: 'experience', language: 'json' },
      { name: 'skills.json', icon: <FileJson className="w-4 h-4" />, type: 'skills', language: 'json' },
    ],
  },
];

/* ---------- language -> color mapping for header accent ---------- */
const languageColors: Record<string, string> = {
  typescriptreact: '#3178c6',
  json: '#f1e05a',
  markdown: '#7b61ff',
  plaintext: '#858585',
};

/* ---------- Small subcomponents ---------- */

const WindowControls: React.FC = () => (
  <div className="flex items-center gap-2">
    <button title="Minimize" className="w-7 h-7 flex items-center justify-center hover:bg-white/5 rounded">
      <Minus className="w-4 h-4 text-[#cfcfcf]" />
    </button>
    <button title="Maximize" className="w-7 h-7 flex items-center justify-center hover:bg-white/5 rounded">
      <Square className="w-4 h-4 text-[#cfcfcf]" />
    </button>
    <button title="Close" className="w-7 h-7 flex items-center justify-center hover:bg-red-600 rounded">
      <X className="w-4 h-4 text-white" />
    </button>
  </div>
);

const MenuBar: React.FC = () => {
  const menuItems = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'];
  return (
    <div className="h-8 bg-[#232323] border-b border-[#1b1b1b] flex items-center gap-3 px-3 text-xs text-[#d0d0d0] select-none">
      {menuItems.map((m) => (
        <div key={m} className="px-2 py-1 hover:bg-white/3 rounded cursor-default">
          {m}
        </div>
      ))}
    </div>
  );
};

const ActivityBar: React.FC<{
  sidebarView: SidebarView;
  setSidebarView: (v: SidebarView) => void;
  collapsed: boolean;
  setCollapsed: (b: boolean) => void;
}> = ({ sidebarView, setSidebarView, collapsed, setCollapsed }) => {
  const btn = (title: string, icon: React.ReactNode, view?: SidebarView) => (
    <button
      onClick={() => view && setSidebarView(view)}
      title={title}
      className={`w-full h-11 flex items-center justify-center transition-colors relative ${
        view === sidebarView ? 'text-white' : 'text-[#9a9a9a] hover:text-white'
      }`}
    >
      {view === sidebarView && <div className="absolute right-7.5 w-0.5 h-15 bg-white"></div>}
      {icon}
    </button>
  );

  return (
    <div className={`flex flex-col items-center ${collapsed ? 'w-12' : 'w-12'} bg-[#2f2f2f] border-r border-[#232323] py-2`}>
      <div className="mb-1">{btn('Explorer', <Files className="w-5 h-5" />, 'explorer')}</div>
      <div className="mb-1">{btn('Search', <Search className="w-5 h-5" />, 'search')}</div>
      <div className="mb-1">{btn('Source Control', <GitBranch className="w-5 h-5" />, 'git')}</div>
      <div className="mb-1">{btn('Run', <Bug className="w-5 h-5" />)}</div>
      <div className="mb-1">{btn('Extensions', <Package className="w-5 h-5" />)}</div>
      <div className="mt-auto mb-1">{btn('Settings', <Settings className="w-5 h-5" />)}</div>

      {/* collapse control for mobile */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mt-4 mb-1 text-[#9a9a9a] hover:text-white"
        title="Toggle sidebar"
      >
        <Menu className="w-4 h-4" />
      </button>
    </div>
  );
};

/* ---------- Explorer, Search, Git views ---------- */

const ExplorerView: React.FC<{
  fileStructure: typeof fileStructure;
  expandedFolders: string[];
  toggleFolder: (name: string) => void;
  openFile: (type: FileType) => void;
  activeFile: FileType | null;
}> = ({ fileStructure, expandedFolders, toggleFolder, openFile, activeFile }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-3 py-2 text-[10px] text-[#cfcfcf] uppercase tracking-wider font-semibold">Explorer</div>

      {fileStructure.map((folder) => {
        const expanded = expandedFolders.includes(folder.name);
        return (
          <div key={folder.name}>
            <div
              onClick={() => toggleFolder(folder.name)}
              className="flex items-center gap-2 px-3 py-1 hover:bg-[#2b2b2b] cursor-pointer text-sm rounded"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4 text-[#bfbfbf]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[#bfbfbf]" />
              )}
              <FolderIcon className="w-4 h-4 text-[#bfbfbf]" />
              <span className="text-[#e6e6e6] font-medium">{folder.name}</span>
            </div>

            {expanded && (
              <div className="ml-3">
                {folder.files.map((file) => (
                  <div
                    key={file.type}
                    onClick={() => openFile(file.type)}
                    className={`flex items-center gap-2 px-3 py-1 rounded cursor-pointer text-sm transition-colors ${
                      activeFile === file.type ? 'bg-[#333438] text-white' : 'text-[#cfcfcf] hover:bg-[#2b2b2b]'
                    }`}
                  >
                    {/* subtle muted icon */}
                    <div className="w-4 h-4 flex items-center justify-center text-[#9a9a9a]">{file.icon}</div>
                    <span className="truncate">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const SearchView: React.FC<{
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  fileStructure: typeof fileStructure;
  openFile: (t: FileType) => void;
}> = ({ searchQuery, setSearchQuery, fileStructure, openFile }) => {
  const allFiles = fileStructure.flatMap((f) => f.files);
  const filtered = searchQuery ? allFiles.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase())) : [];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-3 py-2 text-[10px] text-[#cfcfcf] uppercase tracking-wider font-semibold">Search</div>
      <div className="px-3 py-2">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search files..."
          className="w-full bg-[#333333] text-[#e8e8e8] px-2 py-1.5 rounded text-sm outline-none border border-[#3b3b3b] focus:border-[#4ea6ff]"
        />
      </div>

      {searchQuery && (
        <div className="px-3 py-2">
          <div className="text-xs text-[#9a9a9a] mb-2">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </div>
          <div className="space-y-1">
            {filtered.map((file) => (
              <div
                key={file.type}
                onClick={() => openFile(file.type)}
                className="flex items-center gap-2 px-2 py-1 hover:bg-[#2b2b2b] cursor-pointer rounded text-sm"
              >
                <div className="w-4 h-4 text-[#9a9a9a]">{file.icon}</div>
                <span className="text-[#e6e6e6]">{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const GitView: React.FC = () => (
  <div className="flex-1 px-3 py-2">
    <div className="text-[10px] text-[#cfcfcf] uppercase tracking-wider font-semibold">Source Control</div>
    <div className="mt-3 text-sm text-[#9a9a9a]">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-4 h-4" />
        <span>main</span>
      </div>
      <div className="text-[#6a9955]">No changes</div>
    </div>
  </div>
);

/* ---------- Tabs component (smaller tabs) ---------- */
const Tabs: React.FC<{
  openTabs: FileType[];
  fileStructure: typeof fileStructure;
  activeFile: FileType | null;
  setActiveFile: (t: FileType | null) => void;
  closeTab: (t: FileType, e: React.MouseEvent) => void;
}> = ({ openTabs, fileStructure, activeFile, setActiveFile, closeTab }) => {
  return (
    <div className="flex bg-[#252526] border-b border-[#1e1e1e] overflow-x-auto">
      {openTabs.map((tab) => {
        const file = fileStructure.flatMap((f) => f.files).find((f) => f.type === tab);
        if (!file) return null;
        return (
          <div
            key={tab}
            onClick={() => setActiveFile(tab)}
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-r border-[#2b2b2b] text-sm ${
              activeFile === tab ? 'bg-[#1a1a1a] text-white border-t-2 border-t-[#4ea6ff]' : 'bg-[#2b2b2b] text-[#d0d0d0]'
            }`}
          >
            <div className="w-3 h-3 flex items-center justify-center text-[#9a9a9a]">{file.icon}</div>
            <span className="max-w-[9rem] truncate text-sm">{file.name}</span>

            {/* close button visible */}
            <button
              onClick={(e) => closeTab(tab, e)}
              className="ml-1 w-6 h-6 flex items-center justify-center hover:bg-white/5 rounded opacity-100"
              title="Close"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Line numbers (styled container) ---------- */
const LineNumbers: React.FC<{ count: number }> = ({ count }) => (
  <div className="pr-3 select-none text-xs leading-6 font-mono text-[#6f6f6f]">
    <div className="bg-[#0b0b0b] rounded-l px-2 py-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-5 leading-5">
          {i + 1}
        </div>
      ))}
    </div>
  </div>
);

/* ---------- File content renderers (improved Home/About/Skills UI) ---------- */
const FileContentRenderer: React.FC<{ type: FileType | null }> = ({ type }) => {
  if (!type) return null;

  switch (type) {
    case 'home':
      return (
        <div className="flex">
          <LineNumbers count={22} />
          <div className="flex-1 p-4 text-xs leading-5 font-mono">
            <div className="mb-4">
              <div className="text-[#4ec9b0] text-lg font-semibold">Welcome — I'm <span className="text-[#7fdcff]">giridhar.</span></div>
              <div className="text-[#cfcfcf] text-sm mt-1">Software & AI Engineer — I build full-stack systems & creative ML products.</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-[#121212] p-3 rounded border border-[#202020]">
                <div className="text-sm font-medium text-[#9fe7d4]">Featured Project</div>
                <div className="text-xs text-[#bdbdbd] mt-2">A production-grade image-processing pipeline using deep learning & edge-optimized inference.</div>
              </div>

              <div className="bg-[#121212] p-3 rounded border border-[#202020]">
                <div className="text-sm font-medium text-[#9fe7d4]">Current Focus</div>
                <div className="text-xs text-[#bdbdbd] mt-2">System design for scalable ML infra, accessibility-first UI design, and performant frontends.</div>
              </div>

              <div className="bg-[#121212] p-3 rounded border border-[#202020]">
                <div className="text-sm font-medium text-[#9fe7d4]">Quick Links</div>
                <div className="text-xs text-[#bdbdbd] mt-2">Projects • Resume • Contact</div>
              </div>

              <div className="bg-[#121212] p-3 rounded border border-[#202020]">
                <div className="text-sm font-medium text-[#9fe7d4]">Skills Snapshot</div>
                <div className="text-xs text-[#bdbdbd] mt-2">React • TypeScript • Python • ML • Accessibility</div>
              </div>
            </div>

            <div className="mt-4 text-[#6a9955]">// Use the sidebar to explore more</div>
          </div>
        </div>
      );

    case 'about':
      return (
        <div className="flex">
          <LineNumbers count={26} />
          <div className="flex-1 p-4 text-xs leading-5">
            <div className="bg-[#0f0f0f] p-3 rounded border border-[#202020]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#151515] rounded flex items-center justify-center">
                  <User className="w-6 h-6 text-[#9adbf0]" />
                </div>
                <div>
                  <div className="text-[#4fc1ff] text-sm font-semibold">giridhar.</div>
                  <div className="text-xs text-[#cfcfcf] mt-1">Seattle, WA • Software & AI Engineer</div>
                </div>
              </div>

              <div className="mt-3 text-xs text-[#d0d0d0]">
                I'm a developer who focuses on crafting clear, maintainable systems — with strong emphasis on accessibility and performance.
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-[#0b0b0b] p-2 rounded border border-[#1e1e1e]">
                  <div className="text-xs text-[#9cdcfe] font-medium">Interests</div>
                  <div className="text-xs text-[#cfcfcf] mt-1">AI, System Design, Web Performance</div>
                </div>
                <div className="bg-[#0b0b0b] p-2 rounded border border-[#1e1e1e]">
                  <div className="text-xs text-[#9cdcfe] font-medium">Approach</div>
                  <div className="text-xs text-[#cfcfcf] mt-1">Design first, measure often, ship small iterations.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'experience':
      return (
        <div className="flex">
          <LineNumbers count={48} />
          <div className="flex-1 p-4 text-xs leading-5">
            <div className="font-mono text-[#d4d4d4]">{'{'}</div>
            <div className="ml-4 font-mono text-[#9cdcfe]">"experience": [</div>
            {portfolioData.experience.map((exp, i) => (
              <div key={i} className="ml-8 border-l-2 border-[#0e639c] pl-4 bg-[#0b0b0b] p-3 mt-2 rounded">
                <div className="font-mono text-[#9cdcfe]">"title": <span className="text-[#ce9178]">"{exp.title}"</span></div>
                <div className="font-mono text-[#9cdcfe]">"company": <span className="text-[#ce9178]">"{exp.company}"</span></div>
                <div className="text-xs text-[#9a9a9a] mt-1">{exp.location} • {exp.period}</div>
                <p className="text-xs text-[#d4d4d4] mt-2">{exp.description}</p>
                <div className="mt-2 space-y-1">
                  {exp.achievements.map((ach, j) => (
                    <div key={j} className="flex items-start gap-2 text-xs text-[#bfbfbf]">
                      <Circle className="w-2 h-2 text-[#4ec9b0]" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="ml-4 font-mono text-[#d4d4d4]">]</div>
            <div className="font-mono text-[#d4d4d4]">{'}'}</div>
          </div>
        </div>
      );

    case 'projects':
      return (
        <div className="flex">
          <LineNumbers count={36} />
          <div className="flex-1 p-4 text-xs leading-5">
            <div className="text-[#569cd6] font-mono">import {'{'} <span className="text-[#9cdcfe]">ProjectCard</span> {'}'}</div>
            <div className="mt-3 space-y-3">
              {portfolioData.projects.map((proj, i) => (
                <div key={i} className="bg-[#0b0b0b] p-3 rounded border border-[#202020]">
                  <div className="text-[#4fc1ff] font-semibold">{proj.name}</div>
                  <div className="text-xs text-[#d0d0d0] mt-1">{proj.description}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {proj.technologies.map((tech, j) => (
                      <span key={j} className="text-xs bg-[#111111] px-2 py-1 rounded border border-[#202020]">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a href={proj.link} className="text-xs text-[#7fb8ff] mt-2 inline-block">{proj.link}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'skills':
      return (
        <div className="flex">
          <LineNumbers count={30} />
          <div className="flex-1 p-4 text-xs leading-5">
            <div className="font-mono text-[#9cdcfe]">"skills": {'{'}</div>
            <div className="ml-4 mt-2">
              <div className="text-xs text-[#9cdcfe]">languages:</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {portfolioData.skills.languages.map((l, i) => (
                  <span key={i} className="text-xs bg-[#0b0b0b] px-2 py-1 rounded border border-[#1e1e1e]">{l}</span>
                ))}
              </div>

              <div className="text-xs text-[#9cdcfe] mt-3">frameworks:</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {portfolioData.skills.frameworks.map((f, i) => (
                  <span key={i} className="text-xs bg-[#0b0b0b] px-2 py-1 rounded border border-[#1e1e1e]">{f}</span>
                ))}
              </div>

              <div className="text-xs text-[#9cdcfe] mt-3">tools:</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {portfolioData.skills.tools.map((t, i) => (
                  <span key={i} className="text-xs bg-[#0b0b0b] px-2 py-1 rounded border border-[#1e1e1e]">{t}</span>
                ))}
              </div>
            </div>
            <div className="mt-3 font-mono text-[#d4d4d4]">{'}'}</div>
          </div>
        </div>
      );

    case 'contact':
      return (
        <div className="flex">
          <LineNumbers count={20} />
          <div className="flex-1 p-4 text-xs leading-5">
            <div className="bg-[#0b0b0b] p-3 rounded border border-[#202020]">
              <div className="text-sm text-[#4fc1ff] font-semibold">Contact</div>
              <div className="mt-2 text-xs text-[#d0d0d0]">I'm always open to collaborating — reach out below.</div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className="text-[#4ec9b0] text-lg">📧</div>
                  <div>
                    <div className="text-xs text-[#9a9a9a]">Email</div>
                    <div className="text-xs text-[#4ec9b0] font-mono">{portfolioData.contact.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-[#4ec9b0] text-lg">🐙</div>
                  <div>
                    <div className="text-xs text-[#9a9a9a]">GitHub</div>
                    <div className="text-xs text-[#4ec9b0] font-mono">{portfolioData.contact.github}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

/* ---------- Status bar (refined, not all-blue) ---------- */
const StatusBar: React.FC<{
  cursorPosition: { line: number; col: number };
  activeFile: FileType | null;
  fileStructure: typeof fileStructure;
}> = ({ cursorPosition, activeFile, fileStructure }) => {
  const lang = activeFile ? fileStructure.flatMap((f) => f.files).find((fi) => fi.type === activeFile)?.language : 'plaintext';
  const langColor = languageColors[lang] || '#7b7b7b';

  return (
    <div className="h-7 bg-[#121212] flex items-center justify-between px-3 text-[11px] text-[#d4d4d4] border-t border-[#1a1a1a]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Circle className="w-2 h-2" />
          <span>No Issues</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="px-2 py-0.5 rounded text-[11px] bg-[#0f0f0f] border border-[#222]">Ln {cursorPosition.line}, Col {cursorPosition.col}</div>
        <div className="px-2 py-0.5 rounded text-[11px] bg-[#0f0f0f] border border-[#222]">UTF-8</div>
        <div className="px-2 py-0.5 rounded text-[11px] border border-[#222] font-mono" style={{ background: '#0b0b0b' }}>
          <span style={{ color: langColor, fontWeight: 600 }}>{lang}</span>
        </div>
      </div>
    </div>
  );
};

/* ---------- Main VSCode component (refactored) ---------- */
export default function VSCode({ onSwitchView }: VSCodeProps) {
  // state
  const [activeFile, setActiveFile] = useState<FileType | null>(null); // now can be null -> no file open
  const [openTabs, setOpenTabs] = useState<FileType[]>([]); // start with none open (welcome)
  const [portfolioExpanded, setPortfolioExpanded] = useState(true);
  const [sidebarView, setSidebarView] = useState<SidebarView>('explorer');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(fileStructure.map((f) => f.name));
  const [searchQuery, setSearchQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [activityCollapsed, setActivityCollapsed] = useState(false);

  // responsive: collapse explorer on small screens
  const [explorerCollapsed, setExplorerCollapsed] = useState(false);

  const toggleFolder = (folderName: string) =>
    setExpandedFolders((prev) => (prev.includes(folderName) ? prev.filter((f) => f !== folderName) : [...prev, folderName]));

  const openFile = (fileType: FileType) => {
    if (!openTabs.includes(fileType)) setOpenTabs((p) => [...p, fileType]);
    setActiveFile(fileType);
    setExplorerCollapsed(false); // ensure explorer visible when user opens
    // reset cursor position (simulate)
    setCursorPosition({ line: 1, col: 1 });
  };

  const closeTab = (fileType: FileType, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newTabs = openTabs.filter((t) => t !== fileType);
    setOpenTabs(newTabs);
    if (activeFile === fileType) {
      setActiveFile(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null);
    }
  };

  const closeAllTabs = () => {
    setOpenTabs([]);
    setActiveFile(null);
  };

  const getLanguageColor = (language: string) => languageColors[language] || '#858585';
  const activeFileLanguage = useMemo(
    () => (activeFile ? fileStructure.flatMap((f) => f.files).find((fi) => fi.type === activeFile)?.language : 'plaintext'),
    [activeFile]
  );
  const headerAccent = getLanguageColor(activeFileLanguage || 'plaintext');

  // open/close explorer on mobile
  const toggleExplorerCollapsed = () => setExplorerCollapsed((s) => !s);

  return (
    <div className="min-h-screen bg-[#0b0b0c] flex items-start justify-center p-4">
      <div className="w-full max-w-7xl bg-[#101011] rounded-lg overflow-hidden shadow-2xl border border-[#232425]">
        {/* Floating Terminal Toggle */}
        <button
          onClick={onSwitchView}
          className="fixed top-6 right-6 z-50 group"
          title="Switch to Terminal"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#10b981] blur-xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-[#0f1520] to-[#0b0f13] border border-[#263238] rounded-full p-3 shadow hover:border-[#10b981]">
              <TerminalIcon className="w-5 h-5 text-[#10b981]" />
            </div>
          </div>
        </button>

        {/* Title Bar (left) and Window Controls (right) */}
        <div className="flex items-center justify-between border-b border-[#151515]">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-[13px] text-[#dcdcdc] font-medium">giridhar. - Visual Studio Code</div>
            {/* Menu bar appears below; mobile toggle show/hide */}
            <button
              onClick={toggleExplorerCollapsed}
              className="ml-3 text-[#9a9a9a] hover:text-white md:hidden"
              title="Toggle explorer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 px-4">
            {/* WindowMenu (keeps MenuBar under title as requested) */}
            <div className="hidden md:block">
              
            </div>

            <WindowControls />
          </div>
        </div>

        {/* Menu bar for small screens (below title) */}
        <div className="md:hidden border-b border-[#151515]">
          <MenuBar />
        </div>
        <MenuBar />
        <div className="flex h-[72vh] md:h-[78vh]">
          {/* Activity Bar */}
          <ActivityBar
            sidebarView={sidebarView}
            setSidebarView={setSidebarView}
            collapsed={activityCollapsed}
            setCollapsed={setActivityCollapsed}
          />
            
          {/* Sidebar / Explorer */}
          <div
            className={`bg-[#161616] border-r border-[#1a1a1a] transition-all ${
              explorerCollapsed ? 'hidden md:block w-0' : 'w-64 md:w-64'
            }`}
          >
            {/* Sidebar top (Explorer/controls like VS Code) */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#151515]">
              <div className="text-xs text-[#cfcfcf] font-semibold">EXPLORER</div>
              <div className="flex items-center gap-2">
                <button
                  className="text-[#9a9a9a] hover:text-white"
                  onClick={() => setPortfolioExpanded((p) => !p)}
                  title="Toggle portfolio"
                >
                  {portfolioExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                <button
                  className="text-[#9a9a9a] hover:text-white"
                  onClick={() => setSidebarView('search')}
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Under the menu (Explorer / Search / Git) */}
            <div className="h-full flex flex-col">
              {sidebarView === 'explorer' && (
                <ExplorerView
                  fileStructure={fileStructure}
                  expandedFolders={expandedFolders}
                  toggleFolder={toggleFolder}
                  openFile={openFile}
                  activeFile={activeFile}
                />
              )}

              {sidebarView === 'search' && (
                <SearchView searchQuery={searchQuery} setSearchQuery={setSearchQuery} fileStructure={fileStructure} openFile={openFile} />
              )}

              {sidebarView === 'git' && <GitView />}
            </div>
          </div>

          {/* Main editor area */}
          <div className="flex-1 flex flex-col bg-[#0b0b0b]">
            {/* Tabs (smaller) - only show when tabs exist */}
{openTabs.length > 0 && (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <Tabs
        openTabs={openTabs}
        fileStructure={fileStructure}
        activeFile={activeFile}
        setActiveFile={(f) => setActiveFile(f)}
        closeTab={closeTab}
      />
    </div>

    {/* quick actions on the tab bar */}
    <div className="flex items-center gap-2 px-3">
      <button
        onClick={() => {
          // "Close all"
          closeAllTabs();
        }}
        title="Close All"
        className="text-sm text-[#9a9a9a] hover:text-white px-2 py-1"
      >
        X
      </button>
    </div>
  </div>
)}

            {/* Editor header - accent depends on file type when a file is active */}
            <div
              className="flex items-center justify-between px-4 py-2"
              style={{ borderBottom: `3px solid ${activeFile ? headerAccent : 'transparent'}`, background: '#0a0a0a' }}
            >
              <div className="flex items-center gap-3">
                <div className="text-sm text-[#eaeaea] font-medium">
                  {activeFile
                    ? fileStructure.flatMap((f) => f.files).find((fi) => fi.type === activeFile)?.name
                    : 'Welcome'}
                </div>
                <div className="text-xs text-[#9b9b9b] font-mono">
                  {activeFile ? activeFile : 'No file open'}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#bdbdbd]">
                <div className="px-2 py-0.5 rounded bg-[#0f0f0f] border border-[#222]">Auto Save: Off</div>
                <div className="px-2 py-0.5 rounded bg-[#0f0f0f] border border-[#222]">Spaces: 2</div>
              </div>
            </div>

            {/* Editor content area */}
            <div className="flex-1 overflow-auto">
              {/* If no files open show welcome screen (VS Code welcome style) */}
{openTabs.length === 0 || !activeFile ? (
  <div className="h-full w-full flex items-center justify-center p-6 bg-[#1e1e1e]">
    <div className="max-w-2xl w-full">
      {/* Terminal header with blinking cursor */}
      <div className="flex items-center gap-3 mb-6">
        <TerminalIcon className="w-8 h-8 text-[#4ec9b0]" />
        <div className="font-mono text-[#cccccc] text-lg flex items-center">
          <span>portfolio</span>
          <span className="ml-1 text-[#4ec9b0]">@workspace</span>
          <span className="mx-2 text-[#858585]">~</span>
          <span className="inline-block w-2 h-5 bg-[#cccccc] animate-pulse ml-1"></span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[#858585] mb-8 font-mono">
        No file is currently open. Select a file from the Explorer to get started.
      </p>

      {/* Simple action cards */}
      <div className="space-y-3">
        <button
          onClick={() => openFile('about')}
          className="w-full text-left p-4 bg-[#252526] hover:bg-[#2a2d2e] border border-[#3e3e42] rounded transition-colors duration-150"
        >
          <div className="flex items-center gap-3">
            <FileIcon className="w-4 h-4 text-[#519aba]" />
            <div>
              <div className="text-sm text-[#cccccc] font-medium mb-1">about.md</div>
              <div className="text-xs text-[#858585]">Learn about my background and experience</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => openFile('projects')}
          className="w-full text-left p-4 bg-[#252526] hover:bg-[#2a2d2e] border border-[#3e3e42] rounded transition-colors duration-150"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-[#519aba]" />
            <div>
              <div className="text-sm text-[#cccccc] font-medium mb-1">projects.tsx</div>
              <div className="text-xs text-[#858585]">View my portfolio of work</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => openFile('skills')}
          className="w-full text-left p-4 bg-[#252526] hover:bg-[#2a2d2e] border border-[#3e3e42] rounded transition-colors duration-150"
        >
          <div className="flex items-center gap-3">
            <FileJson className="w-4 h-4 text-[#4ec9b0]" />
            <div>
              <div className="text-sm text-[#cccccc] font-medium mb-1">skills.json</div>
              <div className="text-xs text-[#858585]">Technologies and tools I work with</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => openFile('contact')}
          className="w-full text-left p-4 bg-[#252526] hover:bg-[#2a2d2e] border border-[#3e3e42] rounded transition-colors duration-150"
        >
          <div className="flex items-center gap-3">
            <FileIcon className="w-4 h-4 text-[#519aba]" />
            <div>
              <div className="text-sm text-[#cccccc] font-medium mb-1">contact.md</div>
              <div className="text-xs text-[#858585]">Get in touch with me</div>
            </div>
          </div>
        </button>
      </div>

      {/* Bottom hint */}
      <div className="mt-8 text-xs text-[#6a737d] font-mono">
        <span className="text-[#4ec9b0]">Tip:</span> Use the Explorer sidebar to browse all files
      </div>
    </div>
  </div>
) : (
                // active file content
                <div className="min-h-full">
                  <FileContentRenderer type={activeFile} />
                </div>
              )}
            </div>

            {/* Status bar */}
            <StatusBar cursorPosition={cursorPosition} activeFile={activeFile} fileStructure={fileStructure} />
          </div>
        </div>
      </div>
    </div>
  );
}
