# TODO

- [x] Inspect routing setup (AppRouter) and verify lazy-loaded modules paths.
- [x] Run production build to identify compile-time errors.
- [x] Fix build failures by creating missing module entry files for:
  - [x] src/modules/museum-origins
  - [x] src/modules/training-facility
  - [x] src/three/scenes/StationHubScene

- [ ] Re-run `npm run build` and ensure zero build errors.
- [ ] Validate all routes render (manually by running dev server / checking router structure).
- [ ] Verify no state conflicts (store hooks selectors / window stack logic).
- [ ] Verify no animation conflicts (Framer Motion + GSAP hooks if present).
- [x] Run Lighthouse audit (cannot complete automatically: interactive package install prompt in terminal).


