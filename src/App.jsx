import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, X, Code, PenTool, Cpu, Send, Menu, ArrowLeft, ArrowUpRight, Crosshair, Terminal, Activity } from 'lucide-react';

// --- 自定義組件：駭客解碼文字 (Hacker Text Decode Effect) ---
const HackerText = ({ text, className }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
  
  const handleMouseEnter = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        text.split("").map((letter, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <span onMouseEnter={handleMouseEnter} className={`cursor-pointer ${className}`}>
      {displayText}
    </span>
  );
};

// --- 自定義組件：故障文字效果 (Glitch Text) ---
const GlitchText = ({ text, size = "text-6xl", className = "" }) => (
  <div className={`relative inline-block group ${className}`}>
    <span className={`relative z-10 ${size} font-black`}>{text}</span>
    <span className={`absolute top-0 left-[2px] -z-10 ${size} font-black text-blue-500 opacity-0 group-hover:opacity-70 animate-glitch-1`}>{text}</span>
    <span className={`absolute top-0 -left-[2px] -z-10 ${size} font-black text-red-500 opacity-0 group-hover:opacity-70 animate-glitch-2`}>{text}</span>
  </div>
);

// --- 打字機組件 ---
const TypewriterText = ({ lines, speed = 40, onComplete }) => {
  const [displayedLines, setDisplayedLines] = useState(Array(lines.length).fill(''));
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedLines(Array(lines.length).fill(''));
    setCurrentLineIndex(0);
    setIsComplete(false);
  }, [JSON.stringify(lines)]);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      if (!isComplete) { setIsComplete(true); if (onComplete) onComplete(); }
      return;
    }
    const currentLineFullText = lines[currentLineIndex];
    const currentLineDisplayed = displayedLines[currentLineIndex];

    if (currentLineDisplayed.length < currentLineFullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] += currentLineFullText[currentLineDisplayed.length];
          return newLines;
        });
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setCurrentLineIndex(prev => prev + 1), 200);
      return () => clearTimeout(timeout);
    }
  }, [displayedLines, currentLineIndex, lines, speed, isComplete, onComplete]);

  return (
    <span className="font-black leading-tight font-mono">
      {displayedLines.map((line, i) => <React.Fragment key={i}>{line}{i < lines.length - 1 && <br />}</React.Fragment>)}
      <span className="animate-pulse text-orange-500 inline-block ml-1">█</span>
    </span>
  );
};

export default function DCPartySite() {
  const [currentPage, setCurrentPage] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  
  // 表單狀態
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', service: '', email: '' });
  const [isAnimating, setIsAnimating] = useState(false);

  const THEME_COLOR = '#FF4500';

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
    if (currentPage === 'contact') setFormStep(0);
  }, [currentPage]);

  const handleNextStep = () => {
    if (formData.name === '' && formStep === 0) return;
    if (formData.service === '' && formStep === 1) return;
    setIsAnimating(true);
    setTimeout(() => { setFormStep(prev => prev + 1); setIsAnimating(false); }, 300);
  };

  const handlePrevStep = () => {
    if (formStep > 0) { setIsAnimating(true); setTimeout(() => { setFormStep(prev => prev - 1); setIsAnimating(false); }, 300); }
  };

  // --- 強化的 CSS 樣式 ---
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;800&display=swap');

    body { font-family: 'JetBrains Mono', monospace; }

    /* 3D Grid Floor Effect */
    .grid-container {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #000;
      perspective: 450px; /* 視角深度 */
      z-index: 0;
    }

    .grid-floor {
      position: absolute;
      bottom: -30%;
      left: -50%;
      width: 200%;
      height: 100%;
      background-image: 
        linear-gradient(rgba(255, 69, 0, 0.4) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 69, 0, 0.4) 1px, transparent 1px);
      background-size: 60px 60px;
      transform: rotateX(70deg); /* 壓扁變成地板 */
      transform-origin: 50% 0%;
      animation: grid-fly 1s linear infinite; /* 無限飛行循環 */
      mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%); /* 地平線淡出 */
      box-shadow: 0 -100px 100px -50px rgba(255, 69, 0, 0.3) inset; /* 地平線光暈 */
    }

    @keyframes grid-fly {
      0% { transform: rotateX(70deg) translateY(0); }
      100% { transform: rotateX(70deg) translateY(60px); } /* 必須等於 background-size 的高度 */
    }

    /* Glitch Animations */
    @keyframes glitch-1 {
      0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
      20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
      40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
      60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
      80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
      100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
    }
    @keyframes glitch-2 {
      0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
      20% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 2px); }
      40% { clip-path: inset(30% 0 20% 0); transform: translate(2px, 1px); }
      60% { clip-path: inset(10% 0 80% 0); transform: translate(-2px, -2px); }
      80% { clip-path: inset(40% 0 40% 0); transform: translate(2px, 1px); }
      100% { clip-path: inset(50% 0 30% 0); transform: translate(-2px, -1px); }
    }
    .animate-glitch-1 { animation: glitch-1 0.4s infinite linear alternate-reverse; }
    .animate-glitch-2 { animation: glitch-2 0.4s infinite linear alternate-reverse; }

    /* Scanline Effect */
    .scanlines::before {
      content: " ";
      display: block;
      position: absolute;
      top: 0; left: 0; bottom: 0; right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      z-index: 100;
      background-size: 100% 2px, 3px 100%;
      pointer-events: none;
    }

    /* Marquee */
    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    .animate-marquee { animation: marquee 15s linear infinite; }
    .animate-marquee-reverse { animation: marquee 15s linear infinite reverse; }

    /* Utility */
    .text-stroke { -webkit-text-stroke: 1px rgba(255,69,0,0.8); color: transparent; }
    ::-webkit-scrollbar { width: 0px; background: transparent; }
    
    /* Tech Border (Clip Path) */
    .tech-border {
      clip-path: polygon(
        0 0, 
        100% 0, 
        100% calc(100% - 20px), 
        calc(100% - 20px) 100%, 
        0 100%
      );
    }
  `;

  const Logo = ({ className }) => (
    <div className={`flex items-center gap-2 ${className} group`}>
      <div className="relative">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="group-hover:animate-spin transition-all duration-700">
          <path d="M10 5V35H20C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5H10Z" fill="#FF4500" mask="url(#cutout)"/>
          <mask id="cutout">
            <rect width="100%" height="100%" fill="white"/>
            <path d="M18 12H20C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28H18V12Z" fill="black"/>
            <rect x="5" y="18" width="10" height="4" fill="black"/>
          </mask>
        </svg>
        <div className="absolute inset-0 bg-orange-500 blur-md opacity-40 animate-pulse"></div>
      </div>
      <span className="text-2xl font-black tracking-widest text-[#FF4500]">PARTY_</span>
    </div>
  );

  const navLinks = [{ id: 'services', label: 'SERVICES' }, { id: 'work', label: 'WORK' }, { id: 'blog', label: 'BLOG' }];

  // --- 首頁：誇張動態與 3D 網格 ---
  const HomeContent = () => (
    <>
      <section className="relative h-screen flex flex-col justify-center overflow-hidden bg-black">
        {/* 3D 格子地板容器 */}
        <div className="grid-container">
          <div className="grid-floor"></div>
        </div>
        
        {/* 掃描線遮罩 */}
        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none"></div>

        {/* 浮動的裝飾數據 */}
        <div className="absolute top-20 right-10 font-mono text-orange-500/50 text-xs flex flex-col items-end gap-1">
          <span>SYS_READY: TRUE</span>
          <span>MEM_ALLOC: 84%</span>
          <span>FPS: {Math.floor(Math.random() * 60 + 60)}</span>
        </div>

        {/* 主視覺：更加誇張的傾斜與故障效果 */}
        <div className="relative z-10 flex flex-col gap-0 rotate-[-5deg] scale-110 pointer-events-none select-none mix-blend-screen">
          <div className="flex whitespace-nowrap animate-marquee border-y border-orange-500/20 bg-black/50 backdrop-blur-sm py-2">
            <span className="text-[12vw] font-black leading-none uppercase px-4 text-white drop-shadow-[0_0_10px_rgba(255,69,0,0.8)]">
              DIGITAL CUSTOM PARTY_
            </span>
            <span className="text-[12vw] font-black leading-none uppercase px-4 text-white drop-shadow-[0_0_10px_rgba(255,69,0,0.8)]">
              DIGITAL CUSTOM PARTY_
            </span>
          </div>
          <div className="flex whitespace-nowrap animate-marquee-reverse py-2">
            <span className="text-[12vw] font-black leading-none uppercase px-4 text-stroke opacity-80">
              SOFTWARE // AI VIDEO // WEB // SOFTWARE // AI VIDEO // WEB //
            </span>
          </div>
        </div>

        {/* 底部行動號召 */}
        <div className="absolute bottom-20 left-8 md:left-20 max-w-xl z-20">
          <div className="flex items-center gap-2 text-orange-500 font-mono text-sm mb-2 animate-pulse">
            <Activity size={16} /> SYSTEM_ONLINE
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 text-white glitch-layer">
            WE BUILD <span className="text-orange-500 bg-white/10 px-2">CHAOS</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-md font-mono text-sm border-l-2 border-orange-500 pl-4">
            &gt; 初始化客製化程序... <br/>
            &gt; 載入 AI 視覺模組... <br/>
            &gt; 準備顛覆您的數位體驗。
          </p>
          <button 
            onClick={() => setCurrentPage('contact')}
            className="group relative px-8 py-4 bg-orange-600 text-black font-black hover:bg-white transition-all tech-border flex items-center gap-4 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">START_PROJECT <ArrowRight size={20}/></span>
            <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
          </button>
        </div>
      </section>
    </>
  );

  // --- 服務頁面：HUD 風格卡片 ---
  const ServicesContent = () => (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-neutral-950 relative overflow-hidden">
      {/* 背景雜訊 */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-end gap-4 mb-16">
          <h2 className="text-6xl md:text-9xl font-black text-white leading-none">
            OUR_<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">ARSENAL</span>
          </h2>
          <Cpu className="text-orange-500 w-16 h-16 mb-4 animate-bounce" />
        </div>
        
        <div className="grid gap-8">
          {[
            { 
              id: '001', title: 'CUSTOM_SOFTWARE', icon: <Terminal size={32}/>,
              desc: '擺脫套版束縛。我們構建軍規級的企業大腦，ERP、CRM 或任何您想像得到的邏輯系統。',
              stats: ['REACT', 'PYTHON', 'CLOUD']
            },
            { 
              id: '002', title: 'AI_VISUALS', icon: <Crosshair size={32}/>,
              desc: '利用 Midjourney 與 Stable Diffusion 的算力，生成讓視網膜懷孕的視覺衝擊。',
              stats: ['GEN-AI', 'SORA', 'MOTION']
            },
            { 
              id: '003', title: 'WEB_EXPERIENCE', icon: <Code size={32}/>,
              desc: '這不是網站，這是 WebGL 打造的數位藝術品。讓用戶在滾動中迷失，然後買單。',
              stats: ['THREE.JS', 'WEBGL', 'UI/UX']
            }
          ].map((service) => (
            <div key={service.id} className="group relative border border-white/20 hover:border-orange-500 bg-black/50 p-8 transition-all duration-300 hover:transform hover:scale-[1.02] hover:bg-orange-900/10 tech-border">
              {/* 角落裝飾 */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-orange-500"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-orange-500"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-orange-500"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-orange-500"></div>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="text-orange-500 font-mono text-xl opacity-50 group-hover:opacity-100">[{service.id}]</div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-orange-500/20 p-2 rounded text-orange-500">{service.icon}</div>
                    <h3 className="text-3xl md:text-5xl font-black text-white">
                      <HackerText text={service.title} />
                    </h3>
                  </div>
                  <p className="text-gray-400 text-lg font-mono mb-6 max-w-2xl border-l border-white/20 pl-4 group-hover:border-orange-500 transition-colors">
                    {service.desc}
                  </p>
                  <div className="flex gap-2">
                    {service.stats.map(tag => (
                      <span key={tag} className="text-xs font-bold bg-white/10 px-2 py-1 text-orange-500 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="text-white/20 w-16 h-16 group-hover:text-orange-500 group-hover:rotate-[-45deg] transition-all duration-500 self-center"/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // --- 作品集：RGB 色散效果 ---
  const WorkContent = () => (
    <div className="pt-32 pb-20 px-6 min-h-screen bg-white text-black font-mono">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-6xl md:text-9xl font-black mb-12 tracking-tighter">
          PROJECTS<span className="text-orange-500">_</span>LOG
        </h2>
        
        <div className="grid md:grid-cols-2 gap-16">
          {[
            { id: 1, img: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=800&q=80", title: "Project Alpha" },
            { id: 2, img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80", title: "Project Beta" },
            { id: 3, img: "https://images.unsplash.com/photo-1558655146-d09347e0c766?auto=format&fit=crop&w=800&q=80", title: "Project Gamma" },
            { id: 4, img: "https://images.unsplash.com/photo-1614741118868-4d7d37dbd3fe?auto=format&fit=crop&w=800&q=80", title: "Project Delta" }
          ].map((item) => (
            <div key={item.id} className="group cursor-pointer block">
              <div className="relative overflow-hidden aspect-video bg-black mb-4 tech-border">
                {/* 圖片 RGB 分離效果 */}
                <img 
                  src={item.img}
                  alt={item.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300 relative z-10"
                />
                <div className="absolute inset-0 bg-orange-500 mix-blend-color-dodge opacity-0 group-hover:opacity-50 transition-opacity z-20"></div>
                {/* 裝飾線 */}
                <div className="absolute top-4 right-4 text-white z-30 opacity-0 group-hover:opacity-100 font-bold">
                  REC ●
                </div>
              </div>
              <div className="flex justify-between items-end border-b-4 border-black pb-2 group-hover:border-orange-500 transition-colors">
                <div>
                  <div className="text-xs font-bold text-orange-500 mb-1">CASE_STUDY_0{item.id}</div>
                  <h3 className="text-3xl font-black uppercase flex items-center gap-2">
                    {item.title}
                  </h3>
                </div>
                <ArrowUpRight className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // --- 部落格：科技雜誌風 ---
  const BlogContent = () => {
    const posts = [
      { id: 1, date: '2024.03.15', category: 'INSIGHT', title: 'AI 將如何重塑 2024 年的網頁設計趨勢？', excerpt: '探討生成式 AI 工具如何改變 UI/UX 的工作流程。', img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80" },
      { id: 2, date: '2024.02.28', category: 'TECH', title: 'Web3 與企業軟體的結合', excerpt: '區塊鏈技術在供應鏈管理與數據安全中的實際應用。', img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80" },
      { id: 3, date: '2024.02.10', category: 'DESIGN', title: '極簡主義已死？高飽和度色彩的回歸', excerpt: '為什麼品牌開始擁抱更混亂、更大膽的視覺語言？', img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80" },
      { id: 4, date: '2024.01.20', category: 'CASE STUDY', title: '我們如何用 2 週時間打造沈浸式 3D 展廳', excerpt: 'Three.js 與 React Three Fiber 技術深度剖析。', img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" },
    ];

    return (
      <div className="pt-32 pb-20 px-6 min-h-screen bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl md:text-9xl font-black mb-12">TRANSMISSIONS<span className="animate-blink">_</span></h2>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
            {posts.map((post) => (
              <article key={post.id} className="group cursor-pointer border-l-2 border-white/10 hover:border-orange-500 pl-6 transition-colors duration-300">
                <div className="flex items-center gap-4 text-orange-500 text-xs font-mono mb-4">
                  <span>{post.date}</span>
                  <span>//</span>
                  <span>{post.category}</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-bold mb-4 group-hover:text-orange-500 transition-colors leading-tight">
                  <GlitchText text={post.title} size="text-2xl md:text-4xl" />
                </h3>
                <p className="text-gray-400 mb-6 font-mono text-sm">
                  {post.excerpt}
                </p>
                <div className="inline-block bg-white/10 px-4 py-2 text-xs font-bold hover:bg-orange-500 hover:text-black transition-colors">
                  READ_FULL_LOG
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- 聯絡表單：終端機風格 ---
  const ContactContent = () => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        if (formStep === 2) handleNextStep();
        else handleNextStep();
      }
    };

    const getQuestionText = () => {
      switch(formStep) {
        case 0: return ["> SYSTEM_INIT...", "> 請問您的代號 (Name) 是？"];
        case 1: return [`> ACCESS_GRANTED: ${formData.name}`, "> 需要什麼樣的支援 (Service)？"];
        case 2: return ["> TARGET_LOCKED.", "> 請輸入通訊頻率 (Email) 以接收數據。"];
        default: return [];
      }
    };

    return (
      <div className="min-h-screen bg-black text-orange-500 font-mono flex items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 left-0 h-1 bg-orange-500 transition-all duration-500 shadow-[0_0_20px_#ff4500]" style={{ width: `${((formStep + 1) / 3) * 100}%` }}></div>

        <div className={`max-w-4xl w-full relative z-10 p-8 border border-orange-500/30 bg-black/80 backdrop-blur tech-border transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          
          {formStep === 0 && (
            <div className="space-y-8">
              <div className="text-xs opacity-50">STEP 01 // IDENTITY</div>
              <h2 className="text-3xl md:text-5xl min-h-[120px]">
                <TypewriterText lines={getQuestionText()} />
              </h2>
              <input 
                type="text" 
                placeholder="TYPE_HERE_" 
                className="w-full bg-transparent text-4xl md:text-6xl font-bold border-b-2 border-orange-500/50 focus:border-orange-500 focus:outline-none placeholder-orange-500/20 py-4 text-white"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <button onClick={handleNextStep} disabled={!formData.name} className="flex items-center gap-2 hover:gap-4 transition-all text-xl font-bold uppercase disabled:opacity-30">
                [ EXECUTE ] <ArrowRight />
              </button>
            </div>
          )}

          {formStep === 1 && (
            <div className="space-y-8">
              <div className="text-xs opacity-50">STEP 02 // MISSION_TYPE</div>
              <h2 className="text-3xl md:text-5xl min-h-[120px]">
                 <TypewriterText lines={getQuestionText()} />
              </h2>
              <div className="flex flex-wrap gap-4 mt-8">
                {['SOFTWARE_DEV', 'AI_VISUALS', 'WEB_DESIGN', 'FULL_PACKAGE'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setFormData({...formData, service: opt});
                      setTimeout(() => handleNextStep(), 200);
                    }}
                    className={`px-6 py-3 text-lg font-bold border border-orange-500 hover:bg-orange-500 hover:text-black transition-all ${formData.service === opt ? 'bg-orange-500 text-black' : 'text-orange-500'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
               <button onClick={handlePrevStep} className="mt-8 text-sm opacity-50 hover:opacity-100 flex items-center gap-2">
                 &lt; REVERT
               </button>
            </div>
          )}

          {formStep === 2 && (
            <div className="space-y-8">
               <div className="text-xs opacity-50">STEP 03 // UPLINK</div>
              <h2 className="text-3xl md:text-5xl min-h-[120px]">
                 <TypewriterText lines={getQuestionText()} />
              </h2>
              <input 
                type="email" 
                placeholder="user@domain.com" 
                className="w-full bg-transparent text-4xl md:text-6xl font-bold border-b-2 border-orange-500/50 focus:border-orange-500 focus:outline-none placeholder-orange-500/20 py-4 text-white"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                onKeyPress={handleKeyPress}
                autoFocus
              />
              <div className="flex items-center justify-between pt-8">
                <button onClick={handlePrevStep} className="text-sm opacity-50 hover:opacity-100 flex items-center gap-2">&lt; REVERT</button>
                <button 
                  onClick={() => setFormStep(3)} 
                  className="bg-orange-500 text-black text-xl font-black px-8 py-4 hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(255,69,0,0.5)]"
                >
                  TRANSMIT_DATA
                </button>
              </div>
            </div>
          )}

           {formStep === 3 && (
            <div className="text-center space-y-8 py-20">
              <h2 className="text-6xl md:text-8xl font-black glitch-layer text-white">SUCCESS</h2>
              <p className="text-2xl text-orange-500 font-mono">DATA_PACKET_SENT.</p>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                我們的特務會盡快透過通訊頻率與 {formData.name} 取得聯繫。OVER.
              </p>
              <button 
                onClick={() => {setCurrentPage('home'); setFormStep(0); setFormData({name:'', service:'', email:''})}}
                className="inline-block mt-8 border-b border-orange-500 pb-1 hover:text-white transition-colors"
              >
                RETURN_HOME
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden font-sans selection:bg-orange-500 selection:text-black cursor-crosshair">
      <style>{styles}</style>

      {/* 自定義游標 (準心) */}
      <div 
        className="hidden md:block fixed w-8 h-8 pointer-events-none z-[100] top-0 left-0 mix-blend-difference"
        style={{ transform: `translate(${mousePos.x - 16}px, ${mousePos.y - 16}px)` }}
      >
        <div className="w-full h-full border border-orange-500 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
        </div>
        <div className="absolute top-1/2 left-full w-4 h-[1px] bg-orange-500"></div>
        <div className="absolute top-1/2 right-full w-4 h-[1px] bg-orange-500"></div>
        <div className="absolute left-1/2 top-full h-4 w-[1px] bg-orange-500"></div>
        <div className="absolute left-1/2 bottom-full h-4 w-[1px] bg-orange-500"></div>
      </div>
      
      {/* 導航欄 */}
      <nav className={`fixed top-0 left-0 w-full px-8 py-6 flex justify-between items-center z-50 transition-all duration-300 ${currentPage === 'contact' ? 'bg-transparent' : 'bg-black/80 backdrop-blur border-b border-white/10'}`}>
        <div className="cursor-pointer" onClick={() => setCurrentPage('home')}>
          <Logo />
        </div>

        <div className="hidden md:flex gap-12 items-center font-mono text-sm">
          {navLinks.map((link) => (
            <button 
              key={link.id}
              onClick={() => setCurrentPage(link.id)}
              className={`hover:text-orange-500 transition-colors ${currentPage === link.id ? 'text-orange-500 font-bold' : 'text-gray-400'}`}
            >
              [ {link.label} ]
            </button>
          ))}
          <button 
            onClick={() => setCurrentPage('contact')}
            className="px-6 py-2 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black transition-all font-bold uppercase flex items-center gap-2"
          >
            <Send size={14}/> Start_Project
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </nav>

      {/* 手機選單 */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur z-40 flex flex-col justify-center items-center gap-8 md:hidden font-mono">
          <button onClick={() => {setCurrentPage('home'); setMenuOpen(false)}} className="text-3xl text-white hover:text-orange-500">HOME</button>
          {navLinks.map((link) => (
            <button 
              key={link.id}
              onClick={() => {setCurrentPage(link.id); setMenuOpen(false)}}
              className="text-3xl text-white hover:text-orange-500 uppercase"
            >
              {link.label}
            </button>
          ))}
           <button 
              onClick={() => {setCurrentPage('contact'); setMenuOpen(false)}}
              className="text-3xl text-orange-500 border border-orange-500 px-6 py-2"
            >
              START_PROJECT
            </button>
        </div>
      )}

      {/* 頁面內容渲染區域 */}
      <main className="transition-opacity duration-500 ease-in-out">
        {currentPage === 'home' && <HomeContent />}
        {currentPage === 'services' && <ServicesContent />}
        {currentPage === 'work' && <WorkContent />}
        {currentPage === 'blog' && <BlogContent />}
        {currentPage === 'contact' && <ContactContent />}
      </main>

      {/* Footer */}
      {currentPage !== 'contact' && (
        <footer className="bg-neutral-950 text-gray-500 py-12 px-8 flex flex-col md:flex-row justify-between items-end border-t border-white/10 font-mono text-xs">
          <div className="mb-8 md:mb-0">
            <Logo className="mb-4 scale-75 origin-left opacity-50" />
            <p>TAIPEI_OPERATIONS_CENTER</p>
          </div>
          <div className="text-right">
            <p className="text-orange-500">SYS_VER: 2.0.24</p>
            <p className="mt-2">© DCPARTY ALL RIGHTS RESERVED.</p>
          </div>
        </footer>
      )}
    </div>
  );
}