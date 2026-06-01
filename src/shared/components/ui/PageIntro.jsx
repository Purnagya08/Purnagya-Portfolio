import { Container } from '@shared/components/ui/Container'

export function PageIntro({ eyebrow, title, children }) {
  return (
    <Container className="py-20">
      <p className="text-sm font-semibold tracking-[0.25em] text-cyan-300 uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-6xl">
        {title}
      </h1>
      <div className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
        {children}
      </div>
    </Container>
  )
}
