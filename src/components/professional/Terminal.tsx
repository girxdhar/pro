import { useState, useEffect, useRef } from "react";
import IDCard from "./IDCard";
import { portfolioData } from "../../data/portfolioData";
import { Code2 } from "lucide-react";

export default function Terminal({ onSwitchView }) {
  const [commandHistory, setCommandHistory] = useState<{ command: string; output: string }[]>([]);
  const [input, setInput] = useState("");
  const [locked, setLocked] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [time, setTime] = useState("");
  const [booting, setBooting] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLDivElement>(null);

const bootLines = [
  "INITIALIZING SYSTEM SEQUENCE 0xA23F... OK",
  "LOADING BIOS EXTENSIONS: [0x0012,0x00AF,0x0F3D]",
  "MEMORY MAP CHECK: 640KB BASE, 63MB EXTENDED... VERIFIED",
  "CPU CORE 0 INIT: CPUID=0x6F1A, CACHE=256KB",
  "CPU CORE 1 INIT: CPUID=0x6F1B, CACHE=256KB",
  "APIC TABLE CHECK: INTERRUPTS 0x0F, 0x1B, 0x3C ENABLED",
  "PCI BUS SCAN: DEVICE 00:1F.2, 01:00.0, 02:0A.1 DETECTED",
  "PCI DEVICE 00:1F.2 DRIVER LOAD: INIT CODE 0xC0FFEE",
  "GPU BIOS LOAD: CHECKSUM 0x7FA12B... OK",
  "VGA TEXT MODE ENABLED, RESOLUTION 80x25",
  "AUDIO CHIP 0 SYNC: DRIVER VERSION 0x03AB",
  "SOUND CARD INIT COMPLETE: BUFFER ALLOCATED",
  "IRQ VECTOR TABLE CHECK: 0x20-0x2F PASSED",
  "IO APIC CONFIG: BASE 0xFEE00000",
  "KERNEL MODULE LOADER START: 32 MODULES FOUND",
  "SYSTEM ONLINE: NO ERRORS DETECTED"
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
    const bootTimer = setTimeout(() => {
      setBooting(false);
      setLocked(false);
    }, 4000);
    return () => clearTimeout(bootTimer);
  }, []);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [commandHistory, booting]);

  const interpret = (cmd: string) => {
    const lower = cmd.toLowerCase();
    if (["hello", "hi", "hey"].includes(lower))
      return "Hello there! Welcome to my terminal. Type 'help' to see commands.";
    if (lower === "help")
      return "Commands:\n about\n experience\n skills\n projects\n education\n certifications\n contact\n clear";
    if (lower === "clear") return "CLEAR_SCREEN";
    if (lower.includes("about")) return portfolioData.about.content;
    if (lower.includes("experience"))
      return portfolioData.experience.map((e) => `${e.title} @ ${e.company}\n${e.period}\n${e.description}`).join("\n\n");
    if (lower.includes("skills"))
      return (
        `Languages:\n  ${portfolioData.skills.languages.join(", ")}\n\n` +
        `Frameworks:\n  ${portfolioData.skills.frameworks.join(", ")}\n\n` +
        `Tools:\n  ${portfolioData.skills.tools.join(", ")}`
      );
    if (lower.includes("projects"))
      return portfolioData.projects.map((p, i) => `${i + 1}. ${p.name}\n   ${p.description}`).join("\n\n");
    if (lower.includes("education"))
      return portfolioData.education.map((e) => `${e.degree}\n${e.institution} (${e.year})`).join("\n\n");
    if (lower.includes("contact"))
      return `Email: ${portfolioData.contact.email}\nGitHub: ${portfolioData.contact.github}`;
    return `Unknown command '${cmd}'. Type 'help'.`;
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

  return (
    <div
      className="max-w-7xl mx-auto rounded-lg overflow-hidden border border-[#1d1d1d] relative"
      style={{ background: "#000", fontFamily: "'VT323','Courier New','monospace'" }}
    >
      <button
        disabled={locked}
        onClick={onSwitchView}
        className="fixed top-6 right-6 z-50 group disabled:opacity-40"
      >
        <div className="relative bg-[#0b0f14] border border-[#30363d] rounded-full p-3">
          <Code2 className="w-5 h-5 text-[#0ea5e9]" />
        </div>
      </button>

      <div className="bg-[#0b0f14] px-4 py-2 flex items-center justify-between border-b border-[#252525]">
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

      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1 bg-black  border-r border-[#252525]">
          <div className="sticky top-6">
            <IDCard />
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#050608]">
          <div className="px-6 py-3 border-b border-[#252525] bg-[#0b0f14] text-xs flex items-center gap-2 flex-wrap">
            <span className="text-[#10b981]">~$</span>
            <span className="text-[#6b7280] mx-2">quick:</span>
            {["about", "experience", "skills", "projects"].map((s, i) => (
              <span key={s}>
                <button
                  disabled={locked}
                  onClick={() => runCommand(s)}
                  className="text-[#2BC20E] hover:underline disabled:opacity-40"
                >
                  {s}
                </button>
                {i < 3 && <span className="text-[#6b7280] mx-1">|</span>}
              </span>
            ))}
          </div>

          <div
            ref={termRef}
            className="p-4 h-[600px] overflow-y-auto sm:h-[500px]"
            onClick={() => inputRef.current?.focus()}
          >
            {booting ? (
              <pre className="text-[#2BC20E] text-sm sm:text-xs">
                {bootLines.map((l, i) => (
                  <div
                    key={i}
                    style={{ animation: `fadeIn 0.3s ease ${i * 0.2}s forwards`, opacity: 0 }}
                  >
                    {l}
                  </div>
                ))}
                <style>{`
                  @keyframes fadeIn {
                    to { opacity: 1; }
                  }
                `}</style>
              </pre>
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
                    <pre className="text-[#d1e6d1] whitespace-pre-wrap text-sm sm:text-xs">{item.output}</pre>
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
                      autoFocus
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
