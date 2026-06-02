import { Container } from '@shared/components/ui/Container'

export function Footer() {
  return (
    <footer className="border-t border-(--glass-border) py-6 text-body-sm text-starlight-400">
      <Container className="flex items-center justify-between gap-4">
        <span className="font-mono text-label tracking-interface uppercase">
          NEXUS // Engineer Logbook
        </span>
        <span>Built with care by Purnagya.</span>
      </Container>
    </footer>
  )
}
