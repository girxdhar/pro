import React, { useMemo, useState, useEffect } from 'react';
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
  Mail,
  Github,
  Linkedin,
  Code2,
  Database,
  Palette,
  Zap,
} from 'lucide-react';

// Mock portfolio data
const portfolioData = {
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'Seattle, WA',
      period: '2022 - Present',
      description: 'Leading full-stack development initiatives',
      achievements: [
        'Architected scalable microservices handling 1M+ requests/day',
        'Reduced load time by 40% through optimization',
        'Mentored 5 junior developers'
      ]
    },
    {
      title: 'Software Engineer',
      company: 'Innovation Labs',
      location: 'San Francisco, CA',
      period: '2020 - 2022',
      description: 'Full-stack development and ML integration',
      achievements: [
        'Built ML pipeline for image recognition',
        'Implemented CI/CD reducing deployment time by 60%',
        'Collaborated across 3 teams for product launch'
      ]
    }
  ],
  projects: [
    {
      name: 'AI Image Processor',
      description: 'Production-grade deep learning pipeline for image enhancement',
      technologies: ['Python', 'TensorFlow', 'FastAPI', 'Docker'],
      link: 'github.com/project1'
    },
    {
      name: 'Real-time Analytics Dashboard',
      description: 'High-performance dashboard for streaming data visualization',
      technologies: ['React', 'TypeScript', 'WebSocket', 'D3.js'],
      link: 'github.com/project2'
    }
  ],
  skills: {
    languages: ['TypeScript', 'Python', 'JavaScript', 'Go', 'SQL'],
    frameworks: ['React', 'Next.js', 'Node.js', 'TensorFlow', 'FastAPI'],
    tools: ['Docker', 'AWS', 'Git', 'PostgreSQL', 'Redis']
  },
  contact: {
    email: 'giridhar@example.com',
    github: 'github.com/giridhar',
    linkedin: 'linkedin.com/in/giridhar'
  }
};

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

const languageColors: Record<string, string> = {
  typescriptreact: '#3178c6',
  json: '#f1e05a',
  markdown: '#7b61ff',
  plaintext: '#858585',
};

const WindowControls: React.FC = () => (
  <div className="flex items-center gap-2">
    <button title="Minimize" className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center hover:bg-white/5 rounded transition-colors">
      <Minus className="w-3 h-3 md:w-4 md:h-4 text-[#cfcfcf]" />
    </button>
    <button title="Maximize" className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center hover:bg-white/5 rounded transition-colors">
      <Square className="w-3 h-3 md:w-4 md:h-4 text-[#cfcfcf]" />
    </button>
    <button title="Close" className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center hover:bg-red-600 rounded transition-colors">
      <X className="w-3 h-3 md:w-4 md:h-4 text-white" />
    </button>
  </div>
);

const MenuBar: React.FC = () => {
  const menuItems = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'];
  return (
    <div className="h-7 md:h-8 bg-[#232323] border-b border-[#1b1b1b] flex items-center gap-2 md:gap-3 px-2 md:px-3 text-[10px] md:text-xs text-[#d0d0d0] select-none overflow-x-auto">
      {menuItems.map((m) => (
        <div key={m} className="px-1.5 md:px-2 py-1 hover:bg-white/3 rounded cursor-default transition-colors whitespace-nowrap">
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
      className={`w-full h-10 md:h-11 flex items-center justify-center transition-colors relative ${
        view === sidebarView ? 'text-white' : 'text-[#9a9a9a] hover:text-white'
      }`}
    >
      {view === sidebarView && <div className="absolute left-0 w-0.5 h-10 md:h-11 bg-white"></div>}
      {icon}
    </button>
  );

  return (
    <div className={`flex flex-col items-center w-10 md:w-12 bg-[#2f2f2f] border-r border-[#232323] py-2`}>
      <div className="mb-1">{btn('Explorer', <Files className="w-4 h-4 md:w-5 md:h-5" />, 'explorer')}</div>
      <div className="mb-1">{btn('Search', <Search className="w-4 h-4 md:w-5 md:h-5" />, 'search')}</div>
      <div className="mb-1">{btn('Source Control', <GitBranch className="w-4 h-4 md:w-5 md:h-5" />, 'git')}</div>
      <div className="mb-1">{btn('Run and Debug', <Bug className="w-4 h-4 md:w-5 md:h-5" />, 'debug')}</div>
      <div className="mb-1">{btn('Extensions', <Package className="w-4 h-4 md:w-5 md:h-5" />, 'extensions')}</div>
      <div className="mt-auto mb-1">{btn('Settings', <Settings className="w-4 h-4 md:w-5 md:h-5" />)}</div>
    </div>
  );
};

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
              className="flex items-center gap-2 px-3 py-1 hover:bg-[#2b2b2b] cursor-pointer text-sm rounded transition-colors"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4 text-[#bfbfbf]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[#bfbfbf]" />
              )}
              {expanded ? <FolderOpen className="w-4 h-4 text-[#dcb67a]" /> : <FolderIcon className="w-4 h-4 text-[#dcb67a]" />}
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
                    <div className={`w-4 h-4 flex items-center justify-center transition-colors ${
                      file.language === 'typescriptreact' ? 'text-[#3178c6]' : 
                      file.language === 'json' ? 'text-[#f1e05a]' : 
                      file.language === 'markdown' ? 'text-[#7b61ff]' : 'text-[#9a9a9a]'
                    }`}>{file.icon}</div>
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
          className="w-full bg-[#333333] text-[#e8e8e8] px-2 py-1.5 rounded text-sm outline-none border border-[#3b3b3b] focus:border-[#4ea6ff] transition-colors"
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
                className="flex items-center gap-2 px-2 py-1 hover:bg-[#2b2b2b] cursor-pointer rounded text-sm transition-colors"
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
    <div className="text-[10px] text-[#cfcfcf] uppercase tracking-wider font-semibold mb-4">Source Control</div>
    <div className="text-sm text-[#9a9a9a]">
      <div className="flex items-center gap-2 mb-3 p-2 bg-[#1a1a1a] rounded">
        <GitBranch className="w-4 h-4 text-[#4ec9b0]" />
        <span className="text-[#e6e6e6]">main</span>
      </div>
      <div className="text-[#6a9955] text-xs p-2 bg-[#1a1a1a] rounded">✓ No changes</div>
      <div className="mt-4 text-xs text-[#9a9a9a]">
        <div className="mb-2">• Working tree clean</div>
        <div>• All commits pushed</div>
      </div>
    </div>
  </div>
);

const DebugView: React.FC = () => (
  <div className="flex-1 px-3 py-2">
    <div className="text-[10px] text-[#cfcfcf] uppercase tracking-wider font-semibold mb-4">Run and Debug</div>
    <div className="text-sm text-[#9a9a9a]">
      <div className="p-3 bg-[#1a1a1a] rounded border border-[#2a2a2a] mb-3">
        <div className="flex items-center gap-2 text-[#4ec9b0] mb-2">
          <Bug className="w-4 h-4" />
          <span className="text-xs font-semibold">Debug Console</span>
        </div>
        <div className="text-xs text-[#d4d4d4]">No active debug session</div>
      </div>
      <button className="w-full px-3 py-2 bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs rounded transition-colors">
        Start Debugging
      </button>
    </div>
  </div>
);

const ExtensionsView: React.FC = () => (
  <div className="flex-1 px-3 py-2 overflow-y-auto">
    <div className="text-[10px] text-[#cfcfcf] uppercase tracking-wider font-semibold mb-4">Extensions</div>
    <div className="space-y-2">
      {['Prettier', 'ESLint', 'GitLens', 'Live Server'].map((ext) => (
        <div key={ext} className="p-2 bg-[#1a1a1a] rounded border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#4ec9b0]" />
            <span className="text-xs text-[#e6e6e6]">{ext}</span>
          </div>
          <div className="text-[10px] text-[#9a9a9a] mt-1">Installed</div>
        </div>
      ))}
    </div>
  </div>
);

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
            className={`flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 cursor-pointer border-r border-[#2b2b2b] text-xs md:text-sm transition-all ${
              activeFile === tab ? 'bg-[#1a1a1a] text-white border-t-2 border-t-[#4ea6ff]' : 'bg-[#2b2b2b] text-[#d0d0d0] hover:bg-[#2a2a2a]'
            }`}
          >
            <div className="w-3 h-3 flex items-center justify-center text-[#9a9a9a]">{file.icon}</div>
            <span className="max-w-[6rem] md:max-w-[9rem] truncate">{file.name}</span>
            <button
              onClick={(e) => closeTab(tab, e)}
              className="ml-1 w-5 h-5 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
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

const LineNumbers: React.FC<{ count: number }> = ({ count }) => (
  <div className="pr-3 select-none text-xs leading-6 font-mono text-[#6f6f6f] hidden md:block">
    <div className="bg-[#0b0b0b] rounded-l px-2 py-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-5 leading-5">
          {i + 1}
        </div>
      ))}
    </div>
  </div>
);

const FileContentRenderer: React.FC<{ type: FileType | null }> = ({ type }) => {
  if (!type) return null;

  switch (type) {
    case 'home':
      return (
        <div className="flex">
          <LineNumbers count={22} />
          <div className="flex-1 p-3 md:p-4 text-xs leading-5 font-mono">
            <div className="mb-4 animate-fade-in">
              <div className="text-[#4ec9b0] text-base md:text-lg font-semibold">Welcome — I'm <span className="text-[#7fdcff]">giridhar.</span></div>
              <div className="text-[#cfcfcf] text-xs md:text-sm mt-1">Software & AI Engineer — I build full-stack systems & creative ML products.</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-[#121212] p-3 rounded border border-[#202020] hover:border-[#303030] transition-all hover:shadow-lg">
                <div className="text-sm font-medium text-[#9fe7d4]">Featured Project</div>
                <div className="text-xs text-[#bdbdbd] mt-2">A production-grade image-processing pipeline using deep learning & edge-optimized inference.</div>
              </div>

              <div className="bg-[#121212] p-3 rounded border border-[#202020] hover:border-[#303030] transition-all hover:shadow-lg">
                <div className="text-sm font-medium text-[#9fe7d4]">Current Focus</div>
                <div className="text-xs text-[#bdbdbd] mt-2">System design for scalable ML infra, accessibility-first UI design, and performant frontends.</div>
              </div>

              <div className="bg-[#121212] p-3 rounded border border-[#202020] hover:border-[#303030] transition-all hover:shadow-lg">
                <div className="text-sm font-medium text-[#9fe7d4]">Quick Links</div>
                <div className="text-xs text-[#bdbdbd] mt-2">Projects • Resume • Contact</div>
              </div>

              <div className="bg-[#121212] p-3 rounded border border-[#202020] hover:border-[#303030] transition-all hover:shadow-lg">
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
          <div className="flex-1 p-3 md:p-4 text-xs leading-5">
            <div className="bg-[#0f0f0f] p-3 md:p-4 rounded border border-[#202020]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-lg flex items-center justify-center border border-[#2a2a2a]">
                  <User className="w-6 h-6 md:w-8 md:h-8 text-[#9adbf0]" />
                </div>
                <div>
                  <div className="text-[#4fc1ff] text-sm md:text-base font-semibold">giridhar.</div>
                  <div className="text-xs text-[#cfcfcf] mt-1">Seattle, WA • Software & AI Engineer</div>
                </div>
              </div>

              <div className="mt-4 text-xs md:text-sm text-[#d0d0d0] leading-relaxed">
                I'm a developer who focuses on crafting clear, maintainable systems — with strong emphasis on accessibility and performance. I believe in building software that not only works, but works elegantly.
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#0b0b0b] p-3 rounded border border-[#1e1e1e] hover:border-[#2e2e2e] transition-colors">
                  <div className="text-xs text-[#9cdcfe] font-medium mb-2">Interests</div>
                  <div className="text-xs text-[#cfcfcf]">AI, System Design, Web Performance, Accessibility</div>
                </div>
                <div className="bg-[#0b0b0b] p-3 rounded border border-[#1e1e1e] hover:border-[#2e2e2e] transition-colors">
                  <div className="text-xs text-[#9cdcfe] font-medium mb-2">Approach</div>
                  <div className="text-xs text-[#cfcfcf]">Design first, measure often, ship small iterations.</div>
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
          <div className="flex-1 p-3 md:p-4 text-xs leading-5">
            <div className="font-mono text-[#d4d4d4]">{'{'}</div>
            <div className="ml-4 font-mono text-[#9cdcfe]">"experience": [</div>
            {portfolioData.experience.map((exp, i) => (
              <div key={i} className="ml-4 md:ml-8 border-l-2 border-[#0e639c] pl-3 md:pl-4 bg-[#0b0b0b] p-3 mt-2 rounded hover:bg-[#0f0f0f] transition-colors">
                <div className="font-mono text-[#9cdcfe] text-xs md:text-sm">"title": <span className="text-[#ce9178]">"{exp.title}"</span></div>
                <div className="font-mono text-[#9cdcfe] text-xs">"company": <span className="text-[#ce9178]">"{exp.company}"</span></div>
                <div className="text-[10px] md:text-xs text-[#9a9a9a] mt-1">{exp.location} • {exp.period}</div>
                <p className="text-xs text-[#d4d4d4] mt-2">{exp.description}</p>
                <div className="mt-2 space-y-1">
                  {exp.achievements.map((ach, j) => (
                    <div key={j} className="flex items-start gap-2 text-[10px] md:text-xs text-[#bfbfbf]">
                      <Circle className="w-2 h-2 text-[#4ec9b0] mt-1 flex-shrink-0" />
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
          <div className="flex-1 p-3 md:p-4 text-xs leading-5">
            <div className="text-[#569cd6] font-mono text-xs md:text-sm">import {'{'} <span className="text-[#9cdcfe]">ProjectCard</span> {'}'}</div>
            <div className="mt-3 space-y-3">
              {portfolioData.projects.map((proj, i) => (
                <div key={i} className="bg-[#0b0b0b] p-3 md:p-4 rounded border border-[#202020] hover:border-[#303030] transition-all hover:shadow-lg">
                  <div className="text-sm md:text-base text-[#4fc1ff] font-semibold">{proj.name}</div>
                  <div className="text-xs text-[#d0d0d0] mt-2 leading-relaxed">{proj.description}</div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {proj.technologies.map((tech, j) => (
                      <span key={j} className="text-[10px] md:text-xs bg-[#111111] px-2 py-1 rounded border border-[#202020] hover:border-[#303030] transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a href={`https://${proj.link}`} className="text-xs text-[#7fb8ff] hover:text-[#9fd0ff] mt-3 inline-block transition-colors">{proj.link}</a>
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
          <div className="flex-1 p-3 md:p-4 text-xs leading-5">
            <div className="font-mono text-[#9cdcfe] text-sm mb-4">"skills": {'{'}</div>
            
            <div className="space-y-6">
              <div className="bg-[#0b0b0b] p-4 rounded-lg border border-[#1e1e1e]">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-4 h-4 text-[#4ec9b0]" />
                  <div className="text-xs text-[#9cdcfe] font-semibold">Languages</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.skills.languages.map((lang, i) => (
                    <span key={i} className="text-xs bg-[#1a1a1a] px-3 py-1.5 rounded border border-[#2a2a2a] text-[#d4d4d4] hover:border-[#3a3a3a] transition-colors">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#0b0b0b] p-4 rounded-lg border border-[#1e1e1e]">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-[#4ec9b0]" />
                  <div className="text-xs text-[#9cdcfe] font-semibold">Frameworks & Libraries</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.skills.frameworks.map((fw, i) => (
                    <span key={i} className="text-xs bg-[#1a1a1a] px-3 py-1.5 rounded border border-[#2a2a2a] text-[#d4d4d4] hover:border-[#3a3a3a] transition-colors">
                      {fw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#0b0b0b] p-4 rounded-lg border border-[#1e1e1e]">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-[#4ec9b0]" />
                  <div className="text-xs text-[#9cdcfe] font-semibold">Tools & Platforms</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {portfolioData.skills.tools.map((tool, i) => (
                    <span key={i} className="text-xs bg-[#1a1a1a] px-3 py-1.5 rounded border border-[#2a2a2a] text-[#d4d4d4] hover:border-[#3a3a3a] transition-colors">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="font-mono text-[#d4d4d4] mt-4">{'}'}</div>
          </div>
        </div>
      );

    case 'contact':
      return (
        <div className="flex">
          <LineNumbers count={20} />
          <div className="flex-1 p-3 md:p-4 text-xs leading-5">
            <div className="bg-[#0f0f0f] p-4 md:p-6 rounded border border-[#202020]">
              <div className="text-[#4fc1ff] text-base md:text-lg font-semibold mb-4">Let's Connect</div>
              
              <div className="space-y-3">
                <a href={`mailto:${portfolioData.contact.email}`} className="flex items-center gap-3 p-3 bg-[#0b0b0b] rounded border border-[#1e1e1e] hover:border-[#2e2e2e] transition-colors group">
                  <Mail className="w-5 h-5 text-[#4ec9b0] group-hover:text-[#6ed9bc] transition-colors" />
                  <div>
                    <div className="text-xs text-[#9a9a9a]">Email</div>
                    <div className="text-sm text-[#d4d4d4] group-hover:text-[#4fc1ff] transition-colors">{portfolioData.contact.email}</div>
                  </div>
                </a>

                <a href={`https://${portfolioData.contact.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-[#0b0b0b] rounded border border-[#1e1e1e] hover:border-[#2e2e2e] transition-colors group">
                  <Github className="w-5 h-5 text-[#4ec9b0] group-hover:text-[#6ed9bc] transition-colors" />
                  <div>
                    <div className="text-xs text-[#9a9a9a]">GitHub</div>
                    <div className="text-sm text-[#d4d4d4] group-hover:text-[#4fc1ff] transition-colors">{portfolioData.contact.github}</div>
                  </div>
                </a>

                <a href={`https://${portfolioData.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-[#0b0b0b] rounded border border-[#1e1e1e] hover:border-[#2e2e2e] transition-colors group">
                  <Linkedin className="w-5 h-5 text-[#4ec9b0] group-hover:text-[#6ed9bc] transition-colors" />
                  <div>
                    <div className="text-xs text-[#9a9a9a]">LinkedIn</div>
                    <div className="text-sm text-[#d4d4d4] group-hover:text-[#4fc1ff] transition-colors">{portfolioData.contact.linkedin}</div>
                  </div>
                </a>
              </div>

              <div className="mt-6 p-3 bg-[#0b0b0b] rounded border border-[#1e1e1e]">
                <div className="text-xs text-[#6a9955]">// Always open to interesting opportunities</div>
                <div className="text-xs text-[#6a9955]">// Feel free to reach out!</div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

const StatusBar: React.FC<{ activeFile: FileType | null; fileStructure: typeof fileStructure }> = ({ activeFile, fileStructure }) => {
  const file = activeFile ? fileStructure.flatMap((f) => f.files).find((f) => f.type === activeFile) : null;
  const lang = file?.language || 'plaintext';

  return (
    <div className="h-5 md:h-6 bg-[#007acc] flex items-center justify-between px-2 md:px-3 text-[10px] md:text-xs text-white select-none">
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>
        <div className="hidden md:flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          <span>0</span>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        {file && (
          <>
            <div className="flex items-center gap-1">
              <Circle className="w-2 h-2" style={{ color: languageColors[lang] }} />
              <span className="capitalize">{lang.replace('react', ' React')}</span>
            </div>
            <div className="hidden md:block">UTF-8</div>
          </>
        )}
        <div className="hidden md:block">LF</div>
      </div>
    </div>
  );
};

const VSCodePortfolio: React.FC<VSCodeProps> = ({ onSwitchView }) => {
  const [sidebarView, setSidebarView] = useState<SidebarView>('explorer');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['src', 'content', 'data']);
  const [openTabs, setOpenTabs] = useState<FileType[]>(['home']);
  const [activeFile, setActiveFile] = useState<FileType | null>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleFolder = (name: string) => {
    setExpandedFolders((prev) => (prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]));
  };

  const openFile = (type: FileType) => {
    if (!openTabs.includes(type)) {
      setOpenTabs((prev) => [...prev, type]);
    }
    setActiveFile(type);
  };

  const closeTab = (type: FileType, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = openTabs.filter((t) => t !== type);
    setOpenTabs(newTabs);
    if (activeFile === type) {
      setActiveFile(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null);
    }
  };

  return (
    <div className="w-full h-screen bg-[#1a1a1a] text-[#d4d4d4] flex flex-col font-sans overflow-hidden">
      {/* Title Bar */}
      <div className="h-8 md:h-9 bg-[#2f2f2f] flex items-center justify-between px-2 md:px-3 border-b border-[#1b1b1b]">
        <div className="flex items-center gap-2">
          <div className="text-xs md:text-sm font-semibold text-white flex items-center gap-1">
            <Code2 className="w-3 h-3 md:w-4 md:h-4 text-[#4ea6ff]" />
            <span className="hidden md:inline">Portfolio</span>
            <span className="md:hidden">Port.</span>
          </div>
          <span className="text-[10px] md:text-xs text-[#9a9a9a] hidden sm:inline">— giridhar's workspace</span>
        </div>
        <WindowControls />
      </div>

      <MenuBar />

      <div className="flex flex-1 overflow-hidden">
        <ActivityBar
          sidebarView={sidebarView}
          setSidebarView={setSidebarView}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Sidebar */}
        {!sidebarCollapsed && (
          <div className="w-48 md:w-64 bg-[#1f1f1f] border-r border-[#232323] flex flex-col overflow-hidden">
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
              <SearchView
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                fileStructure={fileStructure}
                openFile={openFile}
              />
            )}
            {sidebarView === 'git' && <GitView />}
            {sidebarView === 'debug' && <DebugView />}
            {sidebarView === 'extensions' && <ExtensionsView />}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs
            openTabs={openTabs}
            fileStructure={fileStructure}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            closeTab={closeTab}
          />

          <div className="flex-1 bg-[#1a1a1a] overflow-auto">
            {activeFile ? (
              <FileContentRenderer type={activeFile} />
            ) : (
              <div className="h-full flex items-center justify-center text-[#6a9a9a] text-sm">
                Open a file to get started
              </div>
            )}
          </div>
        </div>
      </div>

      <StatusBar activeFile={activeFile} fileStructure={fileStructure} />
    </div>
  );
};

export default VSCodePortfolio;