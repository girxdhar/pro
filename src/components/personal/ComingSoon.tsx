export default function ComingSoon() {
  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-[#007acc] to-[#238636] opacity-20 animate-pulse"></div>
          <h1 className="relative text-6xl text-white">
            Coming Soon
          </h1>
        </div>
        
        <p className="text-[#8b949e] text-xl max-w-md mx-auto">
          The Personal section is currently under construction. Stay tuned for updates!
        </p>
        
        <div className="flex items-center justify-center gap-2 text-[#58a6ff]">
          <div className="w-2 h-2 bg-[#58a6ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-[#58a6ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-[#58a6ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
