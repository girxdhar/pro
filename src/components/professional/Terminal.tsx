import { useState, useEffect, useRef } from "react";
import IDCard from "./IDCard";
import { portfolioData } from "../../data/portfolioData";
import { User, ChevronDown, Loader2 } from "lucide-react";

export default function Terminal({ onSwitchView }) {
  const [commandHistory, setCommandHistory] = useState<{ command: string; output: string }[]>([]);
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
    { action: "SYSTEM ONLINE: NO ERRORS DETECTED", status: "ACTIVE", color: "text-[#10b981]" }
  ];

  useEffect(() => {
    const tick = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString());
    }, 1000);
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
    if (termRef.current) {
      observer.observe(termRef.current);
    }
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
    let timeoutId: NodeJS.Timeout;

    const typeNextLine = () => {
      if (currentLine < bootLines.length) {
        currentLine++;
        setVisibleBootLines(currentLine);
        // Randomize delay for authentic terminal I/O feel
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

  const interpret = (cmd: string) => {
    const lower = cmd.toLowerCase();
    
    if (["hello", "hi", "hey"].includes(lower)) {
      return "╭── [ SYSTEM MESSAGE ]\n│ Hello there! Welcome to my terminal.\n╰── Type 'help' to see available commands.";
    }
    
    if (lower === "help") {
      return "╭── [ AVAILABLE COMMANDS ]\n" +
             "│\n" +
             "├── > about\n" +
             "├── > experience\n" +
             "├── > skills\n" +
             "├── > projects\n" +
             "├── > education\n" +
             "├── > contact\n" +
             "╰── > clear";
    }
    
    if (lower === "clear") return "CLEAR_SCREEN";
    
    if (lower.includes("about")) {
      // Simple word wrap for about text to keep the box neat
      const text = portfolioData.about.content.match(/.{1,60}(?:\s|$)/g)?.join("\n│   ") || portfolioData.about.content;
      return `╭── [ ABOUT ME ]\n│\n│   ${text.trim()}\n│\n╰───────────────────────────────────────────────`;
    }
    
    if (lower.includes("experience")) {
      const exp = portfolioData.experience.map((e, i, arr) => {
        const isLast = i === arr.length - 1;
        const branch = isLast ? "╰──" : "├──";
        const pipe = isLast ? " " : "│";
        return `${branch} [ ${e.title.toUpperCase()} ]\n${pipe}    @ ${e.company} | ${e.period}\n${pipe}    > ${e.description}`;
      }).join("\n│\n");
      return `╭── [ EXPERIENCE LOG ]\n│\n${exp}`;
    }
    
    if (lower.includes("skills")) {
      return (
        `╭── [ TECHNICAL SKILLS ]\n` +
        `│\n` +
        `├── [ LANGUAGES ]\n` +
        `│   ╰── ${portfolioData.skills.languages.join(", ")}\n` +
        `│\n` +
        `├── [ FRAMEWORKS ]\n` +
        `│   ╰── ${portfolioData.skills.frameworks.join(", ")}\n` +
        `│\n` +
        `╰── [ TOOLS ]\n` +
        `    ╰── ${portfolioData.skills.tools.join(", ")}`
      );
    }
    
    if (lower.includes("projects")) {
      const proj = portfolioData.projects.map((p, i, arr) => {
        const isLast = i === arr.length - 1;
        const branch = isLast ? "╰──" : "├──";
        const pipe = isLast ? " " : "│";
        return `${branch} [ ${p.name.toUpperCase()} ]\n${pipe}    > ${p.description}\n${pipe}    > Link: ${p.link}`;
      }).join("\n│\n");
      return `╭── [ PROJECT DIRECTORY ]\n│\n${proj}`;
    }
    
    if (lower.includes("education")) {
      const edu = portfolioData.education.map((e, i, arr) => {
        const isLast = i === arr.length - 1;
        const branch = isLast ? "╰──" : "├──";
        const pipe = isLast ? " " : "│";
        return `${branch} [ ${e.degree.toUpperCase()} ]\n${pipe}    > ${e.institution}\n${pipe}    > Class of ${e.year}`;
      }).join("\n│\n");
      return `╭── [ EDUCATION RECORDS ]\n│\n${edu}`;
    }
    
    if (lower.includes("contact")) {
      return `╭── [ SECURE COMM CHANNEL ]\n│\n├── > EMAIL  : ${portfolioData.contact.email}\n╰── > GITHUB : ${portfolioData.contact.github}`;
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
    let index = 0;
    const animInterval = setInterval(() => {
      setCommandHistory((prev) => {
        const last = prev[prev.length - 1];
        if (!last || last.command !== cmd) {
          return [...prev, { command: cmd, output: output.slice(0, index) }];
        } else {
          return [...prev.slice(0, prev.length - 1), { command: cmd, output: output.slice(0, index) }];
        }
      });
      index++;
      if (index > output.length) {
        clearInterval(animInterval);
        setLocked(false);
      }
    }, 14);
  };

  const handleEnter = (e) => {
    if (e.key !== "Enter" || locked || !input.trim()) return;
    runCommand(input.trim());
    setInput("");
  };

  const renderOutput = (text: string) => {
    return text.split('\n').map((line, i) => {
      const treeMatch = line.match(/^([╭╰├│─\s]*)(.*)$/);
      if (treeMatch) {
        const [, treePart, contentPart] = treeMatch;
        let content = <span className="text-[#d1e6d1]">{contentPart}</span>;
        
        if (text.includes("[ ERROR ]")) {
          content = <span className="text-[#ff5f56]">{contentPart}</span>;
        } else if (contentPart.match(/\[.*\]/)) {
          content = <span className="text-[#58a6ff] font-bold tracking-wide">{contentPart}</span>;
        } else if (contentPart.includes("Link:")) {
          const parts = contentPart.split(/(Link:.*)/);
          const url = parts[1] ? parts[1].replace("Link:", "").trim() : "#";
          content = (
            <>
              <span className="text-[#8b949e]">{parts[0]}</span>
              <a href={url} target="_blank" rel="noreferrer" className="text-[#39ff14] hover:underline cursor-pointer">
                {parts[1]}
              </a>
            </>
          );
        } else if (contentPart.includes("@") && contentPart.includes("|")) {
          content = <span className="text-[#eab308]">{contentPart}</span>;
        } else if (contentPart.trim().startsWith(">")) {
          if (text.includes("AVAILABLE COMMANDS") || text.includes("SECURE COMM CHANNEL")) {
            content = <span className="text-[#39ff14]">{contentPart}</span>;
          } else {
            content = <span className="text-[#8b949e]">{contentPart}</span>;
          }
        }

        return (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            <span className="text-[#4b5563]">{treePart}</span>
            {content}
          </div>
        );
      }
      return <div key={i} className="text-[#d1e6d1] whitespace-pre-wrap leading-relaxed">{line}</div>;
    });
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
      `}</style>


      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[100dvh] lg:min-h-0">
        <div className="lg:col-span-1 bg-black border-b lg:border-b-0 lg:border-r border-[#252525] min-h-[100dvh] lg:min-h-0 flex flex-col justify-center relative snap-start snap-always">
          <div className="lg:sticky lg:top-6 w-full">
            <IDCard />
          </div>
          <div 
            className="absolute bottom-20 left-1/2 -translate-x-1/2 lg:hidden text-[#10b981] opacity-70 animate-bounce flex flex-col items-center gap-1 z-50 cursor-pointer"
            onClick={() => document.getElementById('terminal-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-[10px] tracking-widest uppercase font-mono drop-shadow-md">Terminal</span>
            <ChevronDown className="w-6 h-6 drop-shadow-md" />
          </div>
        </div>

        <div id="terminal-section" className="lg:col-span-2 bg-[#050608] min-h-[100dvh] lg:min-h-0 flex flex-col relative snap-start snap-always">
          <div className="sticky top-0 z-50 flex flex-col shadow-md">
            <div className="bg-[#0b0f14] px-4 pt-6 pb-2 lg:py-2 flex items-center justify-between border-b border-[#252525]">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <span className="text-xs text-[#8b949e]">giri@portfolio:~</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#8b949e]">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full transition-all"
                  style={{ background: cursorVisible ? "#059232" : "#057816" }}
                ></span>
                <span>online</span>
              </div>
              <div className="opacity-70">{time}</div>
            </div>
            </div>
            
            <div className="px-6 py-3 border-b border-[#252525] bg-[#0b0f14] text-xs flex items-center gap-2 flex-wrap sm:text-xs">
              <span className="text-white">giri</span>
              <span className="text-[#6b7280]">@</span>
              <span className="text-[#58a6ff]">terminal</span>
              <span className="text-[#6b7280]">:~$</span>
              <span className="text-[#d1e6d1]">ls quick_actions/</span>
              <select
                disabled={locked}
                className="ml-2 bg-[#0b0f14] border border-[#4b5563] hover:border-[#10b981]/70 text-[#2BC20E] outline-none px-2 py-1 rounded cursor-pointer disabled:opacity-40 transition-colors"
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
                <option value="clear">clear</option>
              </select>
            </div>
          </div>

          <div
            ref={termRef}
            className="p-4 flex-1 overflow-y-auto lg:h-[600px]"
            onClick={() => inputRef.current?.focus()}
          >
            {booting ? (
              <div className="text-sm sm:text-xs" style={{ fontFamily: "'Courier New', monospace", textShadow: "0 0 2px rgba(57,255,20,0.3)" }}>
                {inView && bootLines.slice(0, visibleBootLines).map((line, i) => (
                  <div key={i} className="flex items-center justify-between mb-1 opacity-90 hover:opacity-100 transition-opacity">
                    <span className="text-[#39ff14] drop-shadow-[0_0_2px_rgba(57,255,20,0.5)] tracking-tight">{line.action}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-[#252525] hidden sm:inline-block">........................</span>
                      <span className={`font-bold ${line.color} drop-shadow-md`}>[{line.status}]</span>
                    </span>
                  </div>
                ))}
                {visibleBootLines < bootLines.length && inView && (
                  <div className="flex items-center gap-3 mt-6 text-[#39ff14] opacity-80">
                    <span className="font-bold text-lg">{spinnerChar}</span>
                    <span className="animate-pulse tracking-widest font-bold uppercase">Loading system modules...</span>
                    <span className="animate-ping">█</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                {commandHistory.map((item, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex items-center gap-1 text-sm sm:text-xs">
                      <span className="text-white">giri</span>
                      <span className="text-[#6b7280]">@</span>
                      <span className="text-[#58a6ff]">terminal</span>
                      <span className="text-[#6b7280]">:~$</span>
                      <span className="text-[#d1e6d1]">{item.command}</span>
                    </div>
                    <div className="font-mono text-sm sm:text-xs mb-2">
                      {renderOutput(item.output)}
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
                      className="flex-1 bg-transparent text-[#e5e7eb] outline-none text-sm sm:text-xs"
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
