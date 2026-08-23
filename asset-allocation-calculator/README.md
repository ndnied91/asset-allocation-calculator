# Asset Allocation Calculator

A calculator that takes a USD amount and shows the resulting split across a
configurable set of cryptocurrencies, using live exchange rates from Coinbase.

## Stack

- Vue 3 + Vite
- Tailwind CSS

## Running it
​```
npm install
npm run dev
​```



## How it works

The app fetches live crypto rates from Coinbase as soon as the page loads.
Enter a USD amount, and it shows how much of each asset you'd get based on
the configured split (70% BTC / 30% ETH by default). Click Refresh to pull
the latest rates at any time — a "last updated" timestamp shows how fresh
the prices are.

## Notes on some decisions

- **Config-driven split** — the crypto list and percentages live in a single
  array (`cryptoAllocations` in `AssetAllocationCalculator.vue`). Adding a
  third asset or changing the percentages is a one-line change, everything
  else (pricing display, allocation boxes, layout) updates automatically.
  There's a validation check that stops the app and shows an error if the
  percentages don't add up to 100%, rather than silently showing wrong
  numbers.

- **Input validation** — the amount field rejects empty, non-numeric, zero,
  and negative values with an inline error rather than letting invalid
  input silently produce a blank or incorrect allocation. This mirrors
  the same principle as the config-sum check above: fail visibly and early
  rather than show the user numbers that don't mean anything.

- **Rates fetched once on load, plus manual refresh** — rather than
  continuous polling. Given the scope of this app, a manual refresh with a
  "last updated" timestamp felt like the right amount of complexity for the
  time available, and it still covers the volatility concern without the
  overhead of an ongoing polling loop. While a refresh is in progress, the
  button is visually disabled and a guard clause blocks any additional
  clicks or keyboard activations from stacking up duplicate requests, see
  the accessibility notes below for why it's not the native `disabled`
  attribute. See "Polling or a live price feed" in Next Steps for how this
  could be extended.

- **Component split** — split into focused, single-purpose components rather
  than one large file with everything in it. `RatesDisplay` is purely
  presentational as it just displays whatever rates/loading/error state it's
  given as props, and emits a `refresh` event on click, without knowing
  anything about how the data is fetched. `AssetAllocationCalculator` owns
  the actual data fetching and the allocation math, since that's the
  component that needs the rates for its calculations. `AllocationBox` is a
  small reusable component used once per crypto in the results — the same
  component renders for BTC, ETH, or any additional asset added to the
  config, rather than duplicating markup per coin. This keeps each piece
  easier to reason about on its own and makes the UI easy to extend without
  touching unrelated logic.

- **Separation of concerns beyond components** — pure math and formatting
  logic lives in `utils.js`, and the Coinbase fetch logic lives in
  `api/coinbase.js`, both separate from the Vue components themselves.
  Functions like `getPriceFromRate`, `calculateAllocation`, and the
  formatters get imported wherever they're needed instead of being
  rewritten per component, which limits duplication and reduces the chance
  of the same logic drifting out of sync in two places if it's ever changed.

- **Accessibility** — labeled inputs, `aria-live` regions for values that
  update dynamically without a page reload, inline validation messages tied
  to the input via `aria-describedby`, and a Refresh button that stays
  keyboard-focusable while a fetch is in progress (used `aria-disabled` +
  `pointer-events-none` instead of the native `disabled` attribute, which
  would remove it from the tab order).

- **Responsive layout** — the allocation boxes use a flexible layout that
  grows each box to fill the available width (so 2 boxes stretch to fill
  the row rather than sitting narrow with empty space), and wraps to a new
  line once there isn't room for another box. Each box also grows to match
  the tallest one in its row, so a long number in one box doesn't leave its
  siblings looking mismatched.


## Tests Performed

Manual testing, since automated tests weren't required for this assignment:

- Valid amount entry: confirmed correct BTC/ETH split calculation
- Empty input: shows no allocation, no false validation error
- Zero and negative amounts: shows a validation error, blocks calculation
- Non-numeric input: shows a validation error, blocks calculation
- Very large decimal amounts (e.g. `100000000.123456789`): confirmed the
  app handles it without breaking
- Comma-formatted display while typing (e.g. `100,000`): confirmed the
  underlying value used for calculation stays a clean number
- Added a third crypto (SOL) to the config: confirmed its price and
  allocation box appeared correctly, and removing it cleanly removed both
  again, with no other code changes needed
- Refresh button: confirmed it re-fetches rates and recalculates any
  existing allocation automatically
- Repeated Refresh clicks / repeated Enter presses while a fetch is in
  progress: confirmed duplicate requests are blocked
- Keyboard navigation: confirmed the Refresh button stays focusable and
  doesn't lose focus while loading or after an error
- Simulated API failure: confirmed the error state displays correctly
- Misconfigured `cryptoAllocations` (percentages not summing to 100%):
  confirmed the app shows a config error and blocks the calculator
- Mobile viewport: confirmed the allocation boxes stretch to fill the
  available width, wrap to a new line once there isn't room, and stay
  equal height across a row
- Long allocation values: confirmed text wraps inside the box instead of
  overflowing


## Next Steps

1. **Polling or a live price feed** — currently rates only update on load or
   manual refresh. A production version could poll periodically or use a
   websocket for live updates, with proper cleanup.

2. **User-configurable split** — the allocation percentages are currently a
   developer-set config, not something the end user can adjust. The
   config-sum validation is already built with this in mind, since the same
   check would become load-bearing the moment percentages became user input.
   A natural next step would be a dropdown populated from all the currencies
   Coinbase's API returns, letting the user add/remove cryptos and adjust
   each one's percentage split directly in the UI.

3. **Price change indicators** — showing whether each price went up or down
   since the last refresh (e.g. a small up/down arrow with color), by
   comparing the previous fetch's prices to the new ones.

4. **Persisting the last entered amount** — e.g. in localStorage, so a
   refreshed page doesn't lose what the user typed.

5. **Broader test coverage** — the assignment didn't call for automated
   tests, so this was tested manually (empty/negative/invalid input, failed
   API calls, keyboard navigation, mobile layout). A production app would
   have unit tests around the allocation math and formatting helpers in
   particular, since those are pure functions and straightforward to test.

6. **Support for other base currencies** — the Coinbase endpoint's
   `currency` parameter accepts more than just USD, so a user could pick
   GBP, EUR, etc. as their base currency instead. I'd default to USD and
   let the user explicitly select a different currency from a dropdown,
   rather than trying to auto-detect it from browser locale or geolocation
   — those signals are unreliable enough (a UK user with an en-US browser
   setting, for example) that guessing wrong on a money app is worse than
   just asking.



This isn't a complete list, just some ideas that came up while building,
things I could add without reworking what's already there.