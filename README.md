# dxndre-wp

## Theme SCSS

`assets/main.scss` is the build entry and defines the cascade order. Bootstrap configuration
and imports live in `_theme-bootstrap.scss`. Public page styles, private workspaces and DX Command
each have named partials. Some later component refinements still span several features because
their position in the import list determines which declarations win.

Add styles to the matching partial. Keep new components scoped to their own classes and
nest component states and related selectors close to their base rule. Aim for four levels of
nesting or fewer. Use Bootstrap's `media-breakpoint-up()` for grid breakpoints, and use
`respond-from()` for existing custom minimum widths or explicit media types. Keep intentional
WordPress, plugin and dashboard overrides close to the feature that depends on them.

- `npm run lint:scss` reports SCSS syntax, duplicate selectors and properties, specificity,
  nesting, and `!important` usage.
- `npm run lint:scss:fix` applies Stylelint fixes. Review the resulting cascade before keeping them.
- `npm run format:scss` applies the tab-based formatting.
- `npm run format:scss:check` verifies formatting.
- `npm run check:scss` runs formatting verification, Stylelint and the production build.

Stylelint reports existing convention and cascade issues as warnings. Prettier owns indentation
and whitespace. The legacy specificity and duplicate-selector warnings require component-level
review, particularly where WordPress or plugins supply their own styles. The dependency lock
pins a Sass configuration compatible with the repository's existing Stylelint 14 toolchain.
