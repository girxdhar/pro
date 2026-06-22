import { useState, useEffect, useRef } from "react";
import IDCard from "./IDCard";
import { portfolioData } from "../../data/portfolioData";
import { ChevronDown, ExternalLink } from "lucide-react";

type CardBlock =
  | { type: "section"; label: string }
  | { type: "text-card"; body: string }
  | { type: "entry-card"; title: string; meta?: string; body?: string; tags?: string[]; link?: string }
  | { type: "skill-card"; label: string; tags: string[] }
  | { type: "cmd-list"; items: string[] }
  | { type: "contact-card"; fields: { icon: string; value: string; href?: string; displayValue?: string }[] }
  | { type: "about-card"; data: any };

type HistoryItem = { command: string; output: string | CardBlock[] };

const Tag = ({ text }: { text: string }) => (
  <span className="inline-block border border-[#174a17] text-[#10b981] bg-[#021002] px-1.5 py-0.5 mr-1.5 mb-1.5 text-[10px] uppercase tracking-wide">
    {text}
  </span>
);

const SectionHeader = ({ label }: { label: string }) => (
  <div className="mb-4 mt-2 flex items-center animate-type-in">
    <div className="text-[#4ade80] font-bold tracking-widest uppercase text-xs">=== {label} ===</div>
  </div>
);

const EntryCard = ({
  title, meta, body, tags, link
}: {
  title: string; meta?: string; body?: string; tags?: string[]; link?: string;
}) => (
  <fieldset className="border border-[#173a17] px-3 pb-3 pt-2 mb-3 bg-[#020602] font-mono animate-type-in">
    <legend className="text-[#4ade80] text-[11px] px-2 font-bold tracking-wider">
      {title}
    </legend>
    {meta && (
      <div className="text-[#0ea5e9] text-[11px] sm:text-[10px] mb-2 flex items-start gap-1.5 tracking-wide uppercase">
        <span className="text-[#4b5563] font-bold">@</span>
        <span className="opacity-90">{meta}</span>
      </div>
    )}
    {body && (
      <div className="text-[#a3b1a3] text-xs sm:text-[11px] mb-2.5 leading-relaxed pl-3 border-l-2 border-[#173a17]/50">
        {body}
      </div>
    )}
    {tags && tags.length > 0 && (
      <div className="mt-2 flex flex-wrap">
        {tags.map((t, i) => <Tag key={i} text={t} />)}
      </div>
    )}
    {link && (
      <div className="mt-2 border-t border-[#173a17] pt-2">
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-[#58a6ff] hover:underline hover:text-[#4ade80] transition-colors text-[11px]"
        >
            [ LINK: {link} ]
        </a>
      </div>
    )}
  </fieldset>
);

const SkillCard = ({ label, tags }: { label: string; tags: string[] }) => (
  <fieldset className="border border-[#103040] px-3 pb-3 pt-2 mb-3 bg-[#01050a] font-mono animate-type-in">
    <legend className="text-[#0ea5e9] text-[11px] px-2 font-bold tracking-wider uppercase">
      {label}
    </legend>
    <div className="flex flex-wrap mt-1">
      {tags.map((t, i) => (
        <span key={i} className="inline-block text-[#58a6ff] mr-2 mb-1">
          <span className="opacity-50">#</span>{t}
        </span>
      ))}
    </div>
  </fieldset>
);

const CmdList = ({ items }: { items: string[] }) => (
  <fieldset className="border border-[#173a17] px-3 pb-3 pt-2 mb-3 bg-[#020602] font-mono animate-type-in">
    <legend className="text-[#10b981] text-[11px] px-2 font-bold tracking-wider">
      AVAILABLE
    </legend>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 mt-1">
      {items.map((item, i) => (
        <div key={i} className="text-[#4ade80] flex items-center gap-1.5">
          <span className="text-[#4b5563] text-[9px]">▶</span> {item}
        </div>
      ))}
    </div>
  </fieldset>
);

const TextCard = ({ body }: { body: string }) => (
  <fieldset className="border border-[#173a17] px-3 pb-3 pt-2 mb-3 bg-[#020602] font-mono animate-type-in">
    <legend className="text-[#4ade80] text-[11px] px-2 font-bold tracking-wider">
      INFO
    </legend>
    <div className="text-[#d1e6d1] leading-relaxed whitespace-pre-wrap opacity-90">
      {body}
    </div>
  </fieldset>
);

const TypeWriter = ({ text, speed = 20, delay = 0 }: { text: string; speed?: number; delay?: number }) => {
  const [chars, setChars] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let i = 0;
      const int = setInterval(() => {
        i += 1;
        setChars(i);
        if (i >= text.length) clearInterval(int);
      }, speed);
      return () => clearInterval(int);
    }, delay);
    return () => clearTimeout(t);
  }, [text, speed, delay]);
  return <>{text.slice(0, chars)}</>;
};

const AsciiWriter = ({ text, speed = 60, delay = 0 }: { text: string; speed?: number; delay?: number }) => {
  const [lines, setLines] = useState(0);
  const arr = text.split('\n');
  useEffect(() => {
    const t = setTimeout(() => {
      let i = 0;
      const int = setInterval(() => {
        i++;
        setLines(i);
        if (i >= arr.length) clearInterval(int);
      }, speed);
      return () => clearInterval(int);
    }, delay);
    return () => clearTimeout(t);
  }, [text, speed, delay]);
  return <>{arr.slice(0, lines).join('\n')}</>;
};

const AboutCard = ({ data }: { data: any }) => (
  <fieldset className="border border-[#173a17] px-3 pb-3 pt-2 mb-3 bg-[#020602] font-mono animate-type-in overflow-hidden">
    <legend className="text-[#4ade80] text-[11px] px-2 font-bold tracking-wider uppercase">
      {data.title || "ABOUT ME"}
    </legend>
    <div className="flex flex-col md:flex-row gap-4 mb-3 items-center md:items-start pt-2 min-w-0">
      {data.ascii && (
        <div className="w-full md:w-auto flex justify-center md:justify-start overflow-hidden">
          <pre
            className="text-[#4ade80] text-[8px] min-[380px]:text-[9px] sm:text-[10px] md:text-[11px] leading-[0.9] opacity-85 font-mono whitespace-pre max-w-full overflow-x-auto px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              textShadow: "0 0 4px rgba(74,222,128,0.35)",
            }}
          >
            <AsciiWriter text={data.ascii} speed={45} />
          </pre>
        </div>
      )}
      <div className="flex-1 w-full min-w-0 min-h-[90px]">
        <div className="text-[#0ea5e9] font-bold tracking-wider mb-2 text-xs">
          ❯ <TypeWriter text={data.role} delay={500} speed={25} />
        </div>
        <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-x-2 gap-y-1 text-[11px] mb-2 pl-3 border-l-2 border-[#173a17]/50">
          <div className="text-[#a3b1a3]">LOC: <span className="text-[#d1e6d1]"><TypeWriter text={data.location} delay={800} /></span></div>
          <div className="text-[#a3b1a3]">SYS: <span className="text-[#4ade80] animate-pulse"><TypeWriter text={data.status} delay={1000} /></span></div>
          {data.stats && Object.entries(data.stats).map(([k, v], idx) => (
            <div key={idx} className="text-[#a3b1a3] uppercase">{k}: <span className="text-[#eab308]"><TypeWriter text={v as string} delay={1200 + (idx * 200)} /></span></div>
          ))}
        </div>
      </div>
    </div>
    <div className="text-[#d1e6d1] text-xs leading-relaxed whitespace-pre-wrap opacity-90 border-t border-[#173a17] pt-3 px-1 min-h-[60px]">
      <TypeWriter text={data.content} delay={2000} speed={15} />
    </div>
  </fieldset>
);

const ContactCard = ({ fields }: { fields: { icon: string; value: string; href?: string; displayValue?: string }[] }) => (
  <fieldset className="border border-[#3a2a0a] px-3 pb-2 pt-2 mb-3 bg-[#0a0701] font-mono animate-type-in">
    <legend className="text-[#eab308] text-[11px] px-2 font-bold tracking-wider">
      COMM_CHANNELS
    </legend>
    <div className="mt-1">
      {fields.map((f, i) => (
        <div key={i} className="flex items-center gap-2 py-1 border-b border-[#2a1a05] last:border-b-0">
          <span className="text-[#eab308] font-bold min-w-[80px] opacity-80">
            {f.icon}
          </span>
          <span className="text-[#4b5563]">|</span>
          {f.href ? (
            <a href={f.href} target={f.href.startsWith("mailto:") ? "_self" : "_blank"} rel="noreferrer" className="text-[#4ade80] hover:underline break-all flex items-center gap-1 group w-fit">
              <span className={f.displayValue ? "underline decoration-[#4ade80]/50 group-hover:decoration-[#4ade80]" : ""}>{f.displayValue || f.value}</span>
              {f.displayValue && <ExternalLink size={11} className="opacity-70 group-hover:opacity-100 mt-0.5" />}
            </a>
          ) : (
            <span className="text-[#d1e6d1] break-all opacity-90">{f.value}</span>
          )}
        </div>
      ))}
    </div>
  </fieldset>
);

const renderCards = (blocks: CardBlock[]) => (
  <div className="w-full mt-1">
    {blocks.map((block, i) => {
      switch (block.type) {
        case "section":
          return <SectionHeader key={i} label={block.label} />;
        case "text-card":
          return <TextCard key={i} body={block.body} />;
        case "entry-card":
          return (
            <EntryCard
              key={i}
              title={block.title}
              meta={block.meta}
              body={block.body}
              tags={block.tags}
              link={block.link}
            />
          );
        case "skill-card":
          return <SkillCard key={i} label={block.label} tags={block.tags} />;
        case "cmd-list":
          return <CmdList key={i} items={block.items} />;
        case "about-card":
          return <AboutCard key={i} data={block.data} />;
        case "contact-card":
          return <ContactCard key={i} fields={block.fields} />;
        default:
          return null;
      }
    })}
  </div>
);

const renderOutput = (text: string) => {
  return text.split("\n").map((line, i) => {
    const treeMatch = line.match(/^([╭╰├│─\s]*)(.*)$/);
    if (treeMatch) {
      const [, treePart, contentPart] = treeMatch;
      let content = <span className="text-[#d1e6d1]">{contentPart}</span>;

      if (text.includes("[ ERROR ]")) {
        content = <span className="text-[#ff5f56]">{contentPart}</span>;
      } else if (contentPart.match(/\[.*\]/)) {
        content = <span className="text-[#58a6ff] font-bold tracking-wide">{contentPart}</span>;
      } else if (contentPart.trim().startsWith(">")) {
        content = <span className="text-[#4ade80]">{contentPart}</span>;
      }

      return (
        <div key={i} className="whitespace-pre-wrap leading-relaxed">
          <span className="text-[#4b5563]">{treePart}</span>
          {content}
        </div>
      );
    }
    return (
      <div key={i} className="text-[#d1e6d1] whitespace-pre-wrap leading-relaxed">
        {line}
      </div>
    );
  });
};

export default function Terminal({ onSwitchView }: { onSwitchView?: () => void }) {
  const [commandHistory, setCommandHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState("");
  const [locked, setLocked] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [time, setTime] = useState("");
  const [booting, setBooting] = useState(true);
  const [inView, setInView] = useState(false);
  const [visibleBootLines, setVisibleBootLines] = useState(0);
  const [spinnerChar, setSpinnerChar] = useState("-");
  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLDivElement>(null);

  const bootLines = [
    { action: "INITIALIZING SYSTEM SEQUENCE 0xA23F", status: "OK", color: "text-[#10b981]" },
    { action: "LOADING BIOS EXTENSIONS: [0x0012,0x00AF]", status: "DONE", color: "text-[#10b981]" },
    { action: "MEMORY MAP CHECK: 640KB BASE, 63MB EXT", status: "VERIFIED", color: "text-[#10b981]" },
    { action: "CPU CORE 0 INIT: CPUID=0x6F1A", status: "READY", color: "text-[#0ea5e9]" },
    { action: "CPU CORE 1 INIT: CPUID=0x6F1B", status: "READY", color: "text-[#0ea5e9]" },
    { action: "APIC TABLE CHECK: INTERRUPTS ENABLED", status: "PASS", color: "text-[#10b981]" },
    { action: "PCI BUS SCAN: DEVICE DETECTED", status: "OK", color: "text-[#10b981]" },
    { action: "GPU BIOS LOAD: CHECKSUM 0x7FA12B", status: "OK", color: "text-[#10b981]" },
    { action: "VGA TEXT MODE ENABLED", status: "80x25", color: "text-[#eab308]" },
    { action: "AUDIO CHIP 0 SYNC: DRIVER VERSION 0x03AB", status: "OK", color: "text-[#10b981]" },
    { action: "IRQ VECTOR TABLE CHECK: 0x20-0x2F", status: "PASSED", color: "text-[#10b981]" },
    { action: "KERNEL MODULE LOADER START", status: "32 FOUND", color: "text-[#0ea5e9]" },
    { action: "SYSTEM ONLINE: NO ERRORS DETECTED", status: "ACTIVE", color: "text-[#10b981]" },
  ];
  useEffect(() => {
    const tick = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(tick);
  }, []);
  useEffect(() => {
    const blink = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (termRef.current) observer.observe(termRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!booting) return;
    const chars = ["-", "\\", "|", "/"];
    let i = 0;
    const spin = setInterval(() => {
      i = (i + 1) % chars.length;
      setSpinnerChar(chars[i]);
    }, 100);
    return () => clearInterval(spin);
  }, [booting]);
  useEffect(() => {
    if (!inView) return;
    let currentLine = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    const typeNextLine = () => {
      if (currentLine < bootLines.length) {
        currentLine++;
        setVisibleBootLines(currentLine);
        timeoutId = setTimeout(typeNextLine, Math.random() * 200 + 50);
      } else {
        timeoutId = setTimeout(() => {
          setBooting(false);
          setLocked(false);
        }, 800);
      }
    };
    timeoutId = setTimeout(typeNextLine, 200);
    return () => clearTimeout(timeoutId);
  }, [inView]);
  useEffect(() => {
    if (!locked && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [locked, commandHistory]);
  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [commandHistory, booting]);

  const interpret = (cmd: string): string | CardBlock[] => {
    const lower = cmd.toLowerCase().trim();

    if (["hello", "hi", "hey"].includes(lower)) {
      return "╭── [ SYSTEM MESSAGE ]\n│ Hello there! Welcome to my terminal.\n╰── Type 'help' to see available commands.";
    }

    if (lower === "help") {
      return [
        { type: "section", label: "AVAILABLE COMMANDS" },
        { type: "cmd-list", items: ["about", "experience", "skills", "projects", "education", "contact", "clear"] },
      ];
    }

    if (lower === "clear") return "CLEAR_SCREEN";

    if (lower.includes("about")) {
      return [
        { type: "about-card", data: portfolioData.about },
      ];
    }

    if (lower.includes("experience")) {
      return [
        { type: "section", label: "EXPERIENCE LOG" },
        ...portfolioData.experience.map((e) => ({
          type: "entry-card" as const,
          title: e.title.toUpperCase(),
          meta: `${e.company || (e as any).Organization || ""} · ${e.period}`,
          body: e.description,
          tags: e.achievements,
        })),
      ];
    }

    if (lower.includes("skills")) {
      return [
        { type: "section", label: "TECHNICAL SKILLS" },
        { type: "skill-card", label: "LANGUAGES", tags: portfolioData.skills.languages },
        { type: "skill-card", label: "FRAMEWORKS", tags: portfolioData.skills.frameworks },
        { type: "skill-card", label: "TOOLS", tags: portfolioData.skills.tools },
        { type: "skill-card", label: "SOFT SKILLS", tags: portfolioData.skills.soft },
      ];
    }

    if (lower.includes("projects")) {
      return [
        { type: "section", label: "PROJECT DIRECTORY" },
        ...portfolioData.projects.map((p) => ({
          type: "entry-card" as const,
          title: p.name.toUpperCase(),
          meta: p.technologies.join(" · "),
          body: p.description,
          link: p.link,
        })),
      ];
    }

    if (lower.includes("education")) {
      return [
        { type: "section", label: "EDUCATION RECORDS" },
        ...portfolioData.education.map((e) => ({
          type: "entry-card" as const,
          title: e.degree.toUpperCase(),
          meta: e.institution || "",
          body: [e.year ? `Class of ${e.year}` : "", e.honors || ""].filter(Boolean).join(" · "),
        })),
      ];
    }

    if (lower.includes("contact")) {
      return [
        { type: "section", label: "SECURE COMM CHANNEL" },
        {
          type: "contact-card",
          fields: [
            { icon: "EMAIL", value: portfolioData.contact.email, href: `mailto:${portfolioData.contact.email}` },
            { icon: "GITHUB", value: portfolioData.contact.github, href: portfolioData.contact.github, displayValue: "@girxdhar" },
            { icon: "LINKEDIN", value: portfolioData.contact.linkedin, href: portfolioData.contact.linkedin, displayValue: "@girxdhar" },
            { icon: "INSTAGRAM", value: portfolioData.contact.Instagram, href: `https://www.instagram.com/${portfolioData.contact.Instagram.replace('@', '')}/` },
          ],
        },
      ];
    }

    return `╭── [ ERROR ]\n│ Command not found: '${cmd}'.\n╰── Type 'help' for a list of available commands.`;
  };

  const runCommand = (cmd: string) => {
    setLocked(true);
    const output = interpret(cmd);

    if (output === "CLEAR_SCREEN") {
      setCommandHistory([]);
      setLocked(false);
      return;
    }

    if (Array.isArray(output)) {
      setCommandHistory([{ command: cmd, output: [] }]);

      let index = 0;
      const renderNextBlock = () => {
        setCommandHistory((prev) => {
          const newHistory = [...prev];
          const lastIndex = newHistory.length - 1;
          const currentOutput = newHistory[lastIndex].output as CardBlock[];

          if (index < output.length) {
            newHistory[lastIndex] = {
              ...newHistory[lastIndex],
              output: [...currentOutput, output[index]]
            };
            return newHistory;
          }
          return prev;
        });

        index++;
        if (index < output.length) {
          setTimeout(renderNextBlock, Math.random() * 300 + 200);
        } else {
          setLocked(false);
        }
      };
      setTimeout(renderNextBlock, Math.random() * 300 + 200);
    } else {
      const lines = output.split('\n');
      setCommandHistory([{ command: cmd, output: "" }]);

      let index = 0;
      const renderNextLine = () => {
        setCommandHistory((prev) => {
          const newHistory = [...prev];
          const lastIndex = newHistory.length - 1;
          const currentLines = newHistory[lastIndex].output as string;

          if (index < lines.length) {
            newHistory[lastIndex] = {
              ...newHistory[lastIndex],
              output: currentLines ? currentLines + "\n" + lines[index] : lines[index]
            };
            return newHistory;
          }
          return prev;
        });

        index++;
        if (index < lines.length) {
          setTimeout(renderNextLine, Math.random() * 80 + 60);
        } else {
          setLocked(false);
        }
      };
      setTimeout(renderNextLine, Math.random() * 80 + 60);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || locked || !input.trim()) return;
    runCommand(input.trim());
    setInput("");
  };

  return (
    <div
      className="max-w-7xl mx-auto w-full h-[100dvh] lg:h-auto overflow-y-auto lg:overflow-visible snap-y snap-mandatory scroll-smooth md:rounded-lg md:border border-[#1d1d1d] relative"
      style={{ background: "#000", fontFamily: "'VT323','Courier New','monospace'" }}
    >
      <style>{`
        .text-\\[\\#58a6ff\\] { color: #58a6ff; }
        .text-\\[\\#d1e6d1\\] { color: #d1e6d1; }
        .text-\\[\\#01b012\\] { color: #01b012; }
        .text-\\[\\#2BC20E\\] { color: #2BC20E; }
        .bg-\\[\\#050608\\] { background-color: #050608; }

        @keyframes typeIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-type-in {
          animation: typeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .neon-border-wrapper { position: relative; display: inline-block; }
        .neon-border-wrapper::after {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 6px;
          background: linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(74,222,128,0.9) 40%, rgba(74,222,128,0.15) 60%, rgba(0,0,0,0) 100%);
          background-size: 200% 100%;
          animation: neon-slide 2.6s linear infinite;
          pointer-events: none;
          mix-blend-mode: screen;
          opacity: 0.55;
          filter: drop-shadow(0 0 4px rgba(74,222,128,0.35));
        }
        @keyframes neon-slide {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .neon-border-wrapper select { position: relative; z-index: 3; }
        .neon-border-wrapper .orbit { position: absolute; inset: -8px; display: block; pointer-events: none; z-index: 2; }
        .neon-border-wrapper .orbit { transform-origin: center center; animation: orbit-rotate 1.9s linear infinite; }
        .neon-border-wrapper .orbit .segment {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translateX(-50%);
          width: 22px;
          height: 3px;
          border-radius: 2px;
          background: linear-gradient(90deg, rgba(74,222,128,0) 0%, rgba(74,222,128,0.95) 50%, rgba(74,222,128,0) 100%);
          filter: blur(0.6px);
          opacity: 0.95;
        }
        @keyframes orbit-rotate { to { transform: rotate(360deg); } }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[100dvh] lg:min-h-0">
        <div className="lg:col-span-1 bg-black border-b lg:border-b-0 lg:border-r border-[#252525] min-h-[100dvh] lg:min-h-0 flex flex-col justify-center relative snap-start snap-always">
          <div className="lg:sticky lg:top-6 w-full">
            <IDCard />
          </div>
          <div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 lg:hidden text-[#10b981] opacity-70 animate-bounce flex flex-col items-center gap-1 z-50 cursor-pointer"
            onClick={() => document.getElementById("terminal-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            <span className="text-[10px] tracking-widest uppercase font-mono drop-shadow-md">Terminal</span>
            <ChevronDown className="w-6 h-6 drop-shadow-md" />
          </div>
        </div>
        <div
          id="terminal-section"
          className="lg:col-span-2 bg-[#050608] min-h-[100dvh] lg:min-h-0 flex flex-col relative snap-start snap-always"
        >
          <div className="sticky top-0 z-50 flex flex-col shadow-md">
            <div className="bg-[#0b0f14] px-4 pt-6 pb-2 lg:py-2 flex items-center justify-between border-b border-[#252525]">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-xs text-[#8b949e]">giri@portfolio:~</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#8b949e]">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full transition-all"
                    style={{ background: cursorVisible ? "#059232" : "#057816" }}
                  />
                  <span>online</span>
                </div>
                <div className="opacity-70">{time}</div>
              </div>
            </div>
            <div className="px-4 py-2 border-b border-[#252525] bg-[#0b0f14] text-xs flex items-center gap-2 flex-wrap">
              <span className="text-white">giri</span>
              <span className="text-[#6b7280]">@</span>
              <span className="text-[#58a6ff]">terminal</span>
              <span className="text-[#6b7280]">:~$</span>
              <span className="text-[#d1e6d1]">ls quick_actions/</span>
              <span className="ml-2 text-[11px] text-[#9ca3af] font-semibold sm:hidden">Quick actions</span>
              <span id="quick-actions-desc" className="ml-2 text-[11px] text-[#9ca3af] sm:hidden">Tap to run common commands</span>

              <div className="ml-2 neon-border-wrapper">
                <select
                  id="quick-actions-select"
                  aria-label="Quick actions menu"
                  aria-describedby="quick-actions-desc"
                  title="Quick actions: run common commands (about, experience, skills, projects, education, contact, clear)"
                  disabled={locked}
                  className="bg-[#0b0f14] border border-[#4b5563] hover:border-[#10b981]/70 text-[#2BC20E] outline-none px-2 py-1 rounded cursor-pointer disabled:opacity-40 transition-colors"
                  onChange={(e) => {
                    if (e.target.value) {
                      runCommand(e.target.value);
                      e.target.value = "";
                    }
                  }}
                >
                  <option value="">-- select action --</option>
                  <option value="about">about</option>
                  <option value="experience">experience</option>
                  <option value="skills">skills</option>
                  <option value="projects">projects</option>
                  <option value="education">education</option>
                  <option value="contact">contact</option>
                  <option value="clear">clear</option>
                </select>
              </div>
            </div>
          </div>
          <div
            ref={termRef}
            className="p-4 flex-1 overflow-y-auto lg:h-[600px]"
            onClick={() => inputRef.current?.focus()}
          >
            {booting ? (
              <div
                className="text-sm sm:text-xs"
                style={{ fontFamily: "'Courier New', monospace", textShadow: "0 0 2px rgba(74,222,128,0.3)" }}
              >
                {inView &&
                  bootLines.slice(0, visibleBootLines).map((line, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between mb-1 opacity-90 hover:opacity-100 transition-opacity"
                    >
                      <span className="text-[#4ade80] drop-shadow-[0_0_2px_rgba(74,222,128,0.5)] tracking-tight">
                        {line.action}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-[#252525] hidden sm:inline-block">........................</span>
                        <span className={`font-bold ${line.color} drop-shadow-md`}>[{line.status}]</span>
                      </span>
                    </div>
                  ))}
                {visibleBootLines < bootLines.length && inView && (
                  <div className="flex items-center gap-3 mt-6 text-[#4ade80] opacity-80">
                    <span className="font-bold text-lg">{spinnerChar}</span>
                    <span className="animate-pulse tracking-widest font-bold uppercase">Loading system modules...</span>
                    <span className="animate-ping">█</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                {commandHistory.map((item, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex items-center gap-1 text-sm sm:text-xs mb-1">
                      <span className="text-white">giri</span>
                      <span className="text-[#6b7280]">@</span>
                      <span className="text-[#58a6ff]">terminal</span>
                      <span className="text-[#6b7280]">:~$</span>
                      <span className="text-[#d1e6d1]">{item.command}</span>
                    </div>
                    <div className="font-mono text-sm sm:text-xs">
                      {Array.isArray(item.output)
                        ? renderCards(item.output)
                        : renderOutput(item.output)}
                    </div>
                  </div>
                ))}
                {!locked && (
                  <div className="text-sm sm:text-xs flex items-center">
                    <span className="text-white">giri</span>
                    <span className="text-[#6b7280]">@</span>
                    <span className="text-[#01b012]">terminal</span>
                    <span className="text-[#6b7280]">:~$</span>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleEnter}
                      className="flex-1 bg-transparent text-[#e5e7eb] outline-none text-sm sm:text-xs ml-1"
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                    />
                    <span className="text-[#004611]">{cursorVisible ? "█" : " "}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
