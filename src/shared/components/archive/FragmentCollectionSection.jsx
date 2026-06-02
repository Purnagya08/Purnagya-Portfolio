import { getFragmentsByLocation } from '@shared/constants/memoryFragments'
import { MemoryFragmentBeacon } from '@shared/components/archive/MemoryFragmentBeacon'

export function FragmentCollectionSection({
  location,
  title = 'Memory fragment collection',
  subtitle = 'Collect archived fragments hidden in this module.',
}) {
  const fragments = getFragmentsByLocation(location)

  if (fragments.length === 0) {
    return null
  }

  return (
    <section className="rounded-nexus-lg border border-(--glass-border) bg-void-900/25 p-nexus-5">
      <p className="nexus-label text-signal-brass">Fragment collection</p>
      <h2 className="mt-nexus-2 font-heading text-heading-md font-semibold text-starlight-50">
        {title}
      </h2>
      <p className="mt-nexus-3 text-body-sm text-starlight-300">{subtitle}</p>

      <div className="mt-nexus-5 grid gap-nexus-3 sm:grid-cols-2 lg:grid-cols-3">
        {fragments.map((fragment) => (
          <MemoryFragmentBeacon fragmentId={fragment.id} key={fragment.id} />
        ))}
      </div>
    </section>
  )
}