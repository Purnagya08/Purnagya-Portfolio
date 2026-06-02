import { useMemo, useState } from 'react'
import {
  findCommand,
  getCommandRecord,
  getSuggestions,
  terminalCommands,
} from '@modules/terminal-mode/data/terminalCommands'

function makeEntry(type, text, extra = {}) {
  return {
    id: `${type}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    text,
    ...extra,
  }
}

const defaultEntries = [
  makeEntry('system', 'NEXUS Terminal Mode initialized.'),
  makeEntry('system', 'Type `help` to inspect available navigation commands.'),
]

export function useTerminalMode({ onNavigate }) {
  const [entries, setEntries] = useState(defaultEntries)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(true)

  const suggestions = useMemo(() => getSuggestions(input), [input])

  function pushEntries(nextEntries) {
    setEntries((current) => [...current, ...nextEntries])
  }

  function runCommand(rawValue) {
    const value = rawValue.trim().toLowerCase()
    if (!value) {
      return
    }

    const matched = findCommand(value)
    const commandEntry = makeEntry('command', value)

    if (!matched) {
      pushEntries([
        commandEntry,
        makeEntry(
          'error',
          `Unknown command: ${value}. Use help for valid commands.`,
        ),
      ])
      setHistory((current) => [...current, value])
      setHistoryIndex(-1)
      setInput('')
      return
    }

    if (matched.command === 'help') {
      pushEntries([
        commandEntry,
        makeEntry('result', 'Available commands:'),
        ...terminalCommands.map((item) =>
          makeEntry('result', `• ${item.command} // ${item.description}`),
        ),
      ])
    } else {
      const record = getCommandRecord(matched.command)
      const recordEntries = record
        ? [
            makeEntry('result', record.heading),
            ...record.lines.map((line) => makeEntry('result', line)),
          ]
        : [makeEntry('result', 'Command executed.')]

      pushEntries([commandEntry, ...recordEntries])

      if (matched.route) {
        pushEntries([
          makeEntry('hint', `Route hint: ${matched.route}`),
          makeEntry(
            'hint',
            'Use the suggestion panel action to open this route directly.',
            { route: matched.route },
          ),
        ])
      }
    }

    setHistory((current) => [...current, value])
    setHistoryIndex(-1)
    setInput('')
  }

  function triggerSuggestion(command) {
    setInput(command)
    setShowSuggestions(true)
  }

  function openCommandRoute(command) {
    const matched = findCommand(command)
    if (matched?.route) {
      onNavigate(matched.route)
    }
  }

  function clearTerminal() {
    setEntries([
      makeEntry('system', 'Terminal output cleared.'),
      makeEntry('system', 'Type `help` to inspect available navigation commands.'),
    ])
  }

  function handleInputKeyDown(event) {
    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault()
      clearTerminal()
      return
    }

    if (event.key === 'Tab') {
      if (suggestions.length > 0) {
        event.preventDefault()
        setInput(suggestions[0].command)
      }
      return
    }

    if (event.key === 'Escape') {
      setShowSuggestions(false)
      return
    }

    if (event.key === 'ArrowUp') {
      if (history.length === 0) {
        return
      }
      event.preventDefault()
      const nextIndex =
        historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInput(history[nextIndex])
      return
    }

    if (event.key === 'ArrowDown') {
      if (history.length === 0) {
        return
      }
      event.preventDefault()
      const nextIndex =
        historyIndex < 0
          ? -1
          : Math.min(history.length - 1, historyIndex + 1)

      if (nextIndex === history.length - 1 && historyIndex === history.length - 1) {
        setHistoryIndex(-1)
        setInput('')
      } else if (nextIndex < 0) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(nextIndex)
        setInput(history[nextIndex])
      }
      return
    }

    if (event.key.length === 1) {
      setShowSuggestions(true)
    }
  }

  return {
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
  }
}