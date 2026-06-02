import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import {
  terminalShortcuts,
} from '@modules/terminal-mode/data/terminalCommands'
import { useTerminalMode } from '@modules/terminal-mode/hooks/useTerminalMode'
import { Container } from '@shared/components/ui/Container'
import { SystemBadge } from '@shared/components/ui/SystemBadge'
import { cn } from '@shared/utils/cn'

export function TerminalModePage() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const inputRef = useRef(null)
  const outputRef = useRef(null)

  const {
    clearTerminal,
    entries,
    handleInputKeyDown,
    input,
    openCommandRoute,
    runCommand,
    setInput,
    setShowSuggestions,
    showSuggestions,
    suggestions,
    triggerSuggestion,
  } = useTerminalMode({
    onNavigate: (route) => navigate(route),
  })

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-terminal-reveal]',
        { autoAlpha: 0, y: reduceMotion ? 0 : 12 },
        {
          autoAlpha: 1,
          duration: reduceMotion ? 0.01 : 0.68,
          ease: 'power3.out',
          stagger: reduceMotion ? 0 : 0.06,
          y: 0,
        },
      )
    }, pageRef)

    return () => context.revert()
  }, [])

  useEffect(() => {
    outputRef.current?.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [entries])

  useEffect(() => {
    function handleGlobalShortcuts(event) {
      if (event.ctrlKey && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleGlobalShortcuts)

    return () => window.removeEventListener('keydown', handleGlobalShortcuts)
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    runCommand(input)
    setShowSuggestions(true)
  }

  return (
    <div className="relative isolate overflow-hidden bg-void-950" ref={pageRef}>
      <TerminalAtmosphere />

      <Container className="relative py-section">
        <section
          className="grid items-end gap-nexus-8 lg:grid-cols-[1fr_22rem]"
          data-terminal-reveal
        >
          <div>
            <SystemBadge tone="steel">Alternate navigation system</SystemBadge>
            <p className="mt-nexus-5 nexus-label text-starlight-500">
              Terminal Mode // technical visitor interface
            </p>
            <h1 className="mt-nexus-4 max-w-4xl font-heading text-heading-xl font-semibold text-starlight-50">
              Command-line access to the archive.
            </h1>
            <p className="mt-nexus-5 max-w-2xl text-body-lg text-starlight-300">
              This mode provides a professional terminal surface for quick
              navigation and focused retrieval. Commands are deterministic,
              local, and optimized for engineering visitors.
            </p>
          </div>

          <aside className="nexus-glass-subtle rounded-nexus-lg p-nexus-5">
            <p className="nexus-label text-signal-brass">Keyboard shortcuts</p>
            <ul className="mt-nexus-4 space-y-2 text-body-sm text-starlight-300">
              {terminalShortcuts.map(([shortcut, meaning]) => (
                <li className="flex items-center justify-between gap-4" key={shortcut}>
                  <span className="font-mono text-[0.625rem] tracking-interface text-starlight-100 uppercase">
                    {shortcut}
                  </span>
                  <span className="text-right">{meaning}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="mt-nexus-8" data-terminal-reveal>
          <article className="nexus-glass-elevated overflow-hidden rounded-nexus-lg">
            <header className="flex items-center justify-between gap-4 border-b border-(--glass-border) bg-void-900/40 px-nexus-4 py-nexus-3">
              <p className="font-mono text-[0.625rem] tracking-interface text-starlight-500 uppercase">
                nexus-terminal://mode/professional
              </p>
              <button
                className="rounded-nexus-sm border border-(--glass-border) px-3 py-1 font-mono text-[0.625rem] tracking-interface text-starlight-300 uppercase transition hover:border-(--glass-border-highlight)"
                onClick={clearTerminal}
                type="button"
              >
                clear
              </button>
            </header>

            <div className="grid gap-0 lg:grid-cols-[1fr_18rem]">
              <div className="border-r border-(--glass-border) bg-void-900/48">
                <div
                  className="h-[28rem] overflow-y-auto px-nexus-5 py-nexus-5"
                  ref={outputRef}
                >
                  <ol className="space-y-3 font-mono text-body-sm text-starlight-300">
                    {entries.map((entry) => (
                      <li
                        className={cn(
                          entry.type === 'command' && 'text-starlight-100',
                          entry.type === 'error' && 'text-signal-red',
                          entry.type === 'hint' && 'text-signal-blue',
                        )}
                        key={entry.id}
                      >
                        {entry.type === 'command' ? (
                          <>
                            <span className="text-signal-steel">nexus@archive:~$ </span>
                            {entry.text}
                          </>
                        ) : (
                          entry.text
                        )}
                      </li>
                    ))}
                  </ol>
                </div>

                <form className="border-t border-(--glass-border) px-nexus-4 py-nexus-4" onSubmit={handleSubmit}>
                  <label className="sr-only" htmlFor="terminal-command-input">
                    Terminal command input
                  </label>
                  <div className="flex items-center gap-3 rounded-nexus-md border border-(--glass-border) bg-void-900/65 px-3 py-3">
                    <span className="font-mono text-[0.625rem] tracking-interface text-signal-steel uppercase">
                      nexus@archive:~$
                    </span>
                    <input
                      autoComplete="off"
                      className="w-full bg-transparent font-mono text-body-sm text-starlight-100 outline-none"
                      id="terminal-command-input"
                      onChange={(event) => {
                        setInput(event.target.value)
                        setShowSuggestions(true)
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={handleInputKeyDown}
                      placeholder="Type command..."
                      ref={inputRef}
                      spellCheck={false}
                      value={input}
                    />
                  </div>
                </form>
              </div>

              <aside className="bg-void-900/25 px-nexus-4 py-nexus-4">
                <p className="nexus-label text-starlight-500">Command suggestions</p>
                <div className="mt-nexus-3 grid gap-2">
                  {showSuggestions && suggestions.length > 0 ? (
                    suggestions.map((suggestion) => (
                      <div
                        className="rounded-nexus-sm border border-(--glass-border) bg-void-900/55 p-nexus-3"
                        key={suggestion.command}
                      >
                        <button
                          className="w-full text-left font-mono text-[0.625rem] tracking-interface text-starlight-100 uppercase"
                          onClick={() => triggerSuggestion(suggestion.command)}
                          type="button"
                        >
                          {suggestion.command}
                        </button>
                        <p className="mt-2 text-body-sm text-starlight-300">
                          {suggestion.description}
                        </p>
                        {suggestion.route ? (
                          <button
                            className="mt-3 rounded-nexus-pill border border-(--glass-border) px-3 py-1 font-mono text-[0.56rem] tracking-interface text-signal-blue uppercase transition hover:border-(--glass-border-highlight)"
                            onClick={() => openCommandRoute(suggestion.command)}
                            type="button"
                          >
                            Open Route
                          </button>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-body-sm text-starlight-400">
                      No suggestions available. Press Esc to hide or type a new prefix.
                    </p>
                  )}
                </div>
              </aside>
            </div>
          </article>
        </section>
      </Container>
    </div>
  )
}

function TerminalAtmosphere() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 -z-30 bg-nexus-space" />
      <div className="nexus-grid pointer-events-none absolute inset-0 -z-20 opacity-42" />
      <div className="pointer-events-none absolute top-20 right-[8%] -z-10 size-72 rounded-full bg-signal-steel/7 blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 left-[7%] -z-10 size-80 rounded-full bg-signal-blue/7 blur-3xl" />
    </>
  )
}