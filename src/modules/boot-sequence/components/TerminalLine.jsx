import { bootOperations } from '@modules/boot-sequence/data/bootSequence'

export function TerminalLine({ index, lineRef, progressRef }) {
  const operation = bootOperations[index]

  return (
    <li className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
      <span className="text-signal-steel" aria-hidden="true">
        &gt;
      </span>
      <div>
        <div className="flex items-center justify-between gap-4">
          <span
            aria-label={operation.label}
            className="invisible text-starlight-200"
            ref={lineRef}
          />
          <span className="hidden text-[0.625rem] tracking-data text-starlight-500 uppercase sm:inline">
            {operation.meta}
          </span>
        </div>
        <div className="mt-2 h-px overflow-hidden bg-hull-700">
          <span
            className="block h-full origin-left scale-x-0 bg-nexus-archive"
            ref={progressRef}
          />
        </div>
      </div>
    </li>
  )
}
