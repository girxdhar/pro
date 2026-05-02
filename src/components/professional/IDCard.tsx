import { useState, useEffect } from "react";
import profileImage from "./profilepic.png";

export default function NeonIDCard() {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [idleTime, setIdleTime] = useState(0);

  useEffect(() => {
    if (isDragging) return;
    let start;
    const animate = (t) => {
      if (!start) start = t;
      setIdleTime(t - start);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isDragging]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;

    const move = (em) => {
      setDragOffset({
        x: em.clientX - startX,
        y: em.clientY - startY,
      });
    };

    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      setIsDragging(false);

      const startOffset = { ...dragOffset };
      let startTime = performance.now();
      const duration = 240;

      const animateBack = (t) => {
        const dt = (t - startTime) / duration;
        if (dt < 1) {
          const wobble = Math.sin(dt * Math.PI * 4) * (1 - dt) * 15;
          setDragOffset({
            x: startOffset.x * (1 - dt),
            y: startOffset.y * (1 - dt) + wobble,
          });
          requestAnimationFrame(animateBack);
        } else {
          setDragOffset({ x: 0, y: 0 });
        }
      };

      requestAnimationFrame(animateBack);
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };

  const idleX = Math.sin(idleTime * 0.0015) * 1.5;
  const idleY = Math.sin(idleTime * 0.0012) * 1.5;
  const idleSwayX = Math.sin(idleTime * 0.001) * 6;

  const cardX = dragOffset.x + idleSwayX;
  const cardY = dragOffset.y;

  const threadDx = cardX;
  const threadDy = cardY + 120;
  const threadLength = 100 + Math.sqrt(threadDx * threadDx + threadDy * threadDy) * 0.15;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start px-6"
      style={{ background: "linear-gradient(180deg, #111, #333, #111)" }}
    >
      {/* WRAPPER: Thread + Connector + Card */}
      <div
        onMouseDown={handleMouseDown}
        className="relative flex flex-col items-center cursor-grab active:cursor-grabbing"
        style={{
          transform: `translate(${cardX}px, ${cardY}px)
                      rotateX(${dragOffset.y * 0.05 + idleX}deg)
                      rotateY(${dragOffset.x * 0.05 + idleY}deg)`,
          transformOrigin: "top center",
          transition: isDragging ? "none" : "transform 0.18s ease-out",
        }}
      >
        {/* THREAD */}
        <div
          className="w-3 bg-black"
          style={{
            height: `${threadLength}px`,
            transition: isDragging ? "none" : "height 0.2s ease-out",
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
            <span className="line-through">Front End Dev</span> <br />
            Vibe coder
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

          <div className="w-full flex flex-col items-center">
            <h1
              className="text-2xl mb-1"
              style={{
                color: "#0f9d58",
                fontFamily: "'Space Grotesk', monospace",
              }}
            >
              giridhar.
            </h1>
            <p className="text-xs opacity-75 mb-3" style={{ color: "#2BC20E" }}>
              Software Development Engineer
            </p>
          </div>

          <div className="flex flex-col gap-2 text-xs mb-4 text-gray-400 items-center">
            <div>girxdhar@gmail.com</div>
            <div>Madikeri, India.</div>
          </div>

          <div className="mt-2 w-full flex justify-between text-[10px] text-gray-500 border-t border-[#0C8900] pt-2">
            <span>VALID UNTIL: 2026</span>
            <span className="flex items-center gap-1">✔ VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
