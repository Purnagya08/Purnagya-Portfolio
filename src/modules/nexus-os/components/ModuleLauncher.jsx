import { ModuleGlyph } from '@modules/nexus-os/components/ModuleGlyph'
import { cn } from '@shared/utils/cn'

export function ModuleLauncher({ isActive, module, onClick, onFocus, setRef }) {
  return (
    <button
      aria-label={`Open ${module.label}`}
      className={cn(
        'group rounded-nexus-md border p-nexus-3 text-left transition duration-300 ease-nexus-out',
        'border-transparent bg-void-900/28 hover:-translate-y-0.5 hover:border-(--glass-border-highlight) hover:bg-hull-700/55 hover:shadow-instrument',
        isActive && 'border-(--glass-border-highlight) bg-hull-700/55',
      )}
      onClick={onClick}
      onFocus={onFocus}
      ref={setRef}
      type="button"
    >
      <ModuleGlyph module={module} />
      <span className="mt-nexus-3 block font-heading text-sm font-semibold text-starlight-100">
        {module.label}
      </span>
      <span className="mt-1 block font-mono text-[0.625rem] tracking-interface text-starlight-500 uppercase">
        {module.code}
      </span>
    </button>
  )
}
