import { useState, useEffect, useRef } from "react";
import profileImage from "./image.png";
import { ExternalLink, ShieldCheck } from "lucide-react";

export default function NeonIDCard() {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [idleTime, setIdleTime] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isDragging) return;
    let start;
    let frameId;
    const animate = (t) => {
      if (!start) start = t;
      setIdleTime(t - start);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isDragging]);

  const updateDrag = (x, y) => {
    dragOffsetRef.current = { x, y };
    setDragOffset({ x, y });
  };

  const handleDragStart = (clientX, clientY) => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsDragging(true);
    const startX = clientX - dragOffsetRef.current.x;
    const startY = clientY - dragOffsetRef.current.y;

    const moveMouse = (e) => {
      e.preventDefault();
      updateDrag(e.clientX - startX, e.clientY - startY);
    };
    
    const moveTouch = (e) => {
      // Prevent scrolling while dragging
      if (e.cancelable) e.preventDefault(); 
      updateDrag(e.touches[0].clientX - startX, e.touches[0].clientY - startY);
    };

    const up = () => {
      document.removeEventListener("mousemove", moveMouse);
      document.removeEventListener("mouseup", up);
      document.removeEventListener("touchmove", moveTouch);
      document.removeEventListener("touchend", up);
      setIsDragging(false);

      const startOffset = { ...dragOffsetRef.current };
      let startTime = performance.now();

      const animateBack = (t) => {
        const elapsed = (t - startTime) / 1000; // time in seconds
        
        // Damped harmonic oscillator: e^(-decay * t) * cos(freq * t)
        const decay = 2.2; // Lower decay for a longer, realistic settling time
        const freq = Math.PI * 4; // Bounces per second factor
        const envelope = Math.exp(-decay * elapsed) * Math.cos(freq * elapsed);
        
        // If the remaining amplitude is larger than 0.1% of the initial drag, keep animating
        if (Math.abs(envelope) > 0.001) {
          updateDrag(
            startOffset.x * envelope,
            startOffset.y * envelope
          );
          animationRef.current = requestAnimationFrame(animateBack);
        } else {
          // It has fully settled naturally
          updateDrag(0, 0);
          animationRef.current = null;
        }
      };

      animationRef.current = requestAnimationFrame(animateBack);
    };

    document.addEventListener("mousemove", moveMouse, { passive: false });
    document.addEventListener("mouseup", up);
    document.addEventListener("touchmove", moveTouch, { passive: false });
    document.addEventListener("touchend", up);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  const idleX = Math.sin(idleTime * 0.0015) * 1.5;
  const idleY = Math.sin(idleTime * 0.0012) * 1.5;
  const idleSwayX = Math.sin(idleTime * 0.001) * 6;

  const cardX = dragOffset.x + idleSwayX;
  const cardY = dragOffset.y;

  // Use thread length to control Y position physically instead of CSS translateY
  // This keeps the top of the thread perfectly glued to the header
  const threadLength = Math.max(10, 100 + cardY + Math.abs(cardX) * 0.05);

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-start relative overflow-hidden w-full"
      style={{ background: "linear-gradient(180deg, #111 0vh, #333 50vh, #111 100vh)" }}
    >
      {/* HEADER SECTION */}
      <div className="w-full bg-black px-4 py-1.5 flex items-center justify-between border-b border-[#111] z-10 shrink-0 shadow-[0_0_15px_rgba(0,255,0,0.05)]">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#39ff14]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse shadow-[0_0_8px_#39ff14]"></span>
          <span className="tracking-widest uppercase font-bold drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">Secure Link Active</span>
        </div>
        
        <button
          onClick={() => {
            window.location.href = "https://girxdhar.github.io/personal";
          }}
          className="group transition-transform duration-300 hover:scale-105"
        >
          <div className="relative bg-[#050608] border border-[#1a1a1a] group-hover:border-[#39ff14] rounded-md px-3 py-1 transition-colors duration-300 shadow-[0_0_8px_rgba(57,255,20,0.2)] group-hover:shadow-[0_0_15px_rgba(57,255,20,0.5)] flex items-center gap-1.5">
            <span className="text-[#39ff14] text-[9px] font-mono font-bold tracking-wider uppercase drop-shadow-[0_0_2px_rgba(57,255,20,0.8)]">Personal Profile</span>
            <ExternalLink className="w-3 h-3 text-[#39ff14] drop-shadow-[0_0_2px_rgba(57,255,20,0.8)]" />
          </div>
        </button>
      </div>

      {/* WRAPPER: Thread + Connector + Card */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative flex flex-col items-center cursor-grab active:cursor-grabbing"
        style={{
          transform: `translate(${cardX}px, 0px)
                      rotateX(${dragOffset.y * 0.05 + idleX}deg)
                      rotateY(${dragOffset.x * 0.05 + idleY}deg)`,
          transformOrigin: "top center",
        }}
      >
        {/* THREAD */}
        <div
          className="w-3 bg-black"
          style={{
            height: `${threadLength}px`,
            boxShadow: "0 0 8px #000",
          }}
        />

        {/* CONNECTOR */}
        <div className="relative w-12 h-10 -mt-1 flex justify-center">
          <div
            className="absolute w-10 h-6 rounded-full top-0"
            style={{
              border: "2px solid black",
              background: "linear-gradient(135deg, #222, #000)",
              boxShadow: "inset 0 2px 4px rgba(255,255,255,0.15)",
            }}
          />
          <div
            className="absolute w-6 h-6 rounded-full top-2"
            style={{
              background: "radial-gradient(circle, #333, #000)",
              boxShadow: "inset 0 2px 4px rgba(255,255,255,0.15)",
            }}
          />
          <div
            className="absolute w-1 h-4 rounded-full top-6"
            style={{
              background: "linear-gradient(#333, #000)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
            }}
          />
        </div>

        {/* CARD */}
        <div
          className="relative bg-[#0a0a0a] rounded-xl shadow-lg max-w-[260px] w-full
                     p-6 pt-16 flex flex-col text-[#58ff49] font-mono select-none"
        >
          <div className="absolute top-3 left-5 text-[7px] opacity-50 text-gray-400">
            Engineer
          </div>

          <div className="absolute top-3 right-5 text-[8px] opacity-50">
            ID: #2027-Top-G
          </div>

          <div className="w-30 h-30 rounded-full border-4 border-black shadow-md overflow-hidden mb-4 self-center">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full flex flex-col items-center mt-2">
            <h1
              className="text-xl mb-1 font-bold tracking-tight drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]"
              style={{
                color: "#10b981",
                fontFamily: "'Courier New', monospace",
              }}
            >
            <span className='text-xs'>&gt; _</span> giridhar
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-widest drop-shadow-[0_0_2px_rgba(57,255,20,0.5)] mb-3" style={{ color: "#39ff14" }}>
              Software Development Engineer
            </p>
          </div>

          <div className="flex flex-col gap-2 text-xs mb-4 text-gray-400 items-center">
            <div>girxdhar@gmail.com</div>
            <div>Madikeri, India.</div>
          </div>

          <div className="mt-3 w-full flex justify-between text-[8px] text-gray-400 border-t border-[#10b981]/30 pt-3">
            <span className="opacity-90 tracking-widest">EXP: 2026.01</span>
            <span className="flex items-center gap-1.5 font-bold tracking-widest text-[#39f014]">
              <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
