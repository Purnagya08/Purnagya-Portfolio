import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNexusStore } from '../../store/nexusStore';
import { SFX } from '../../audio/audioEngine';

const COMMANDS = [
  'help', 'about', 'skills', 'projects', 'achievements',
  'future', 'clear', 'hub', 'mission', 'research',
  'origin', 'training', 'challenge', 'present', 'ai',
];

const CMD_MAP = {
  about:        'origins',
  skills:       'training',
  projects:     'missions',
  achievements: 'achievements',
  future:       'future',
  mission:      'missions',
  research:     'research',
  origin:       'origins',
  training:     'training',
  challenge:    'challenges',
  present:      'present',
  ai:           'nexusai',
};

const HELP_TEXT = `
╔══════════════════════════════════════════╗
║         NEXUS TERMINAL v1.0.0            ║
╠══════════════════════════════════════════╣
║  help        – show this menu            ║
║  about       – Museum of Origins         ║
║  skills      – Training Facility         ║
║  projects    – Mission Control           ║
║  achievements– Achievement Observatory   ║
║  future      – Future Galaxy             ║
║  research    – Research Labs             ║
║  origin      – Museum of Origins         ║
║  training    – Training Facility         ║
║  challenge   – Challenge Galaxy          ║
║  present     – Present Station           ║
║  ai          – NEXUS AI Assistant        ║
║  hub         – Return to Command Hub     ║
║  clear       – Clear terminal            ║
╚══════════════════════════════════════════╝
`.trim();

function execCommand(cmd, store) {
  const c = cmd.trim().toLowerCase();
  if (!c) return null;
  if (c === 'help')  return HELP_TEXT;
  if (c === 'clear') return '__CLEAR__';
  if (c === 'hub') {
    store.navigateTo(null);
    return '> Navigating to Command Hub…';
  }
  if (CMD_MAP[c]) {
    store.navigateTo(CMD_MAP[c]);
    return `> Navigating to ${c.toUpperCase()}…`;
  }
  if (COMMANDS.includes(c)) {
    store.navigateTo(c);
    return `> Launching ${c.toUpperCase()}…`;
  }
  return `⚠  COMMAND NOT RECOGNIZED: "${cmd}"\n   Type 'help' for available commands.`;
}

function useFocusTrap(containerRef, active) {
  useEffect(() => {
    if (!active || !containerRef.current) return;
    const el = containerRef.current;
    const focusable = () =>
      Array.from(el.querySelectorAll(
        'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
      ));
    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last  = items[items.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };
    el.addEventListener('keydown', handleKeyDown);
    const items = focusable();
    if (items.length) items[0].focus();
    return () => el.removeEventListener('keydown', handleKeyDown);
  }, [active, containerRef]);
}

export default function TerminalMode() {
  const { terminalOpen, setTerminalOpen } = useNexusStore();

  const [input,   setInput]   = useState('');
  const [lines,   setLines]   = useState([
    '  NEXUS OPERATING SYSTEM  v1.0.0',
    '  Type "help" to see all commands.',
    '',
  ]);
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [suggest, setSuggest] = useState('');

  const containerRef = useRef(null);
  const inputRef     = useRef(null);
  const outputRef    = useRef(null);

  useFocusTrap(containerRef, terminalOpen);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (terminalOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [terminalOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '`' && !terminalOpen) {
        e.preventDefault();
        setTerminalOpen(true);
        SFX.keypress();
      } else if (e.key === 'Escape' && terminalOpen) {
        e.preventDefault();
        setTerminalOpen(false);
        SFX.keypress();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [terminalOpen, setTerminalOpen]);

  const onInputChange = useCallback((e) => {
    const val = e.target.value;
    setInput(val);
    SFX.keypress();
    if (val) {
      const match = COMMANDS.find((c) => c.startsWith(val.toLowerCase()) && c !== val.toLowerCase());
      setSuggest(match ? val + match.slice(val.length) : '');
    } else {
      setSuggest('');
    }
  }, []);

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Tab' && suggest) {
      e.preventDefault();
      setInput(suggest);
      setSuggest('');
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = input.trim();
      const addLine = (text) =>
        setLines((prev) => [
          ...prev,
          `NEXUS> ${cmd}`,
          ...(text ? text.split('\n') : []),
          '',
        ]);
      if (cmd) {
        const result = execCommand(cmd, useNexusStore.getState());
        if (result === '__CLEAR__') {
          setLines([]);
        } else {
          addLine(result ?? '');
        }
        setHistory((prev) => [cmd, ...prev.slice(0, 49)]);
        setHistIdx(-1);
      }
      setInput('');
      setSuggest('');
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistory((hist) => {
        const next = Math.min(histIdx + 1, hist.length - 1);
        setHistIdx(next);
        setInput(hist[next] ?? '');
        return hist;
      });
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistory((hist) => {
        const next = Math.max(histIdx - 1, -1);
        setHistIdx(next);
        setInput(next === -1 ? '' : hist[next] ?? '');
        return hist;
      });
    }
  }, [input, suggest, histIdx]);

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-label="NEXUS Spaceship Terminal"
          className="fixed inset-0 z-[9000] overflow-hidden"
          style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-black/96" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,rgba(0,255,100,0.025) 0px,rgba(0,255,100,0.025) 1px,transparent 1px,transparent 3px)',
              animation: 'scanline 8s linear infinite',
              mixBlendMode: 'overlay',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)' }}
          />
          <button
            onClick={() => setTerminalOpen(false)}
            className="absolute top-4 right-6 text-[10px] tracking-widest text-green-500/50 hover:text-green-400 transition-colors focus:outline-none focus:ring-1 focus:ring-green-500"
            aria-label="Close terminal (Escape)"
          >
            [ESC] CLOSE
          </button>

          <div className="absolute inset-0 flex flex-col p-4 pt-12 sm:p-8 sm:pt-14">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-500/20">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <span className="ml-4 text-[10px] sm:text-xs tracking-[0.3em] text-green-500/60">
                NEXUS TERMINAL — AUTHENTICATED
              </span>
            </div>

            <div
              ref={outputRef}
              className="flex-1 overflow-y-auto overflow-x-hidden text-green-400 text-[11px] sm:text-sm leading-relaxed mb-4"
              aria-live="polite"
              aria-atomic="false"
            >
              {lines.map((line, i) => (
                <div
                  key={i}
                  className="whitespace-pre-wrap break-all"
                  style={{
                    color: line.startsWith('NEXUS>')
                      ? '#4ade80'
                      : line.startsWith('⚠')
                      ? '#f87171'
                      : 'rgba(74,222,128,0.7)',
                  }}
                >
                  {line || '\u00A0'}
                </div>
              ))}
            </div>

            <div className="relative flex items-center border-t border-green-500/20 pt-3">
              <span className="text-green-400 mr-2 text-[11px] sm:text-sm shrink-0">NEXUS&gt;</span>
              {suggest && (
                <span
                  className="absolute left-[4.5rem] sm:left-20 top-3 text-green-500/30 text-[11px] sm:text-sm pointer-events-none select-none whitespace-pre"
                  aria-hidden="true"
                >
                  {suggest}
                </span>
              )}
              <input
                ref={inputRef}
                type="text"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="flex-1 bg-transparent outline-none text-green-400 text-[11px] sm:text-sm caret-green-400"
                value={input}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                aria-label="Terminal command input"
                aria-autocomplete="list"
              />
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block', width: '0.55ch', height: '1.1em',
                  backgroundColor: '#4ade80',
                  animation: 'cursorBlink 1s steps(2) infinite',
                  verticalAlign: 'middle', marginLeft: 2, flexShrink: 0,
                }}
              />
            </div>

            <div className="mt-3 text-[9px] sm:text-[10px] text-green-900 tracking-widest flex flex-wrap gap-x-4 gap-y-1">
              <span>↑↓ HISTORY</span>
              <span>TAB AUTOCOMPLETE</span>
              <span>ENTER EXECUTE</span>
              <span>ESC CLOSE</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
