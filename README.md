# Money

### Take-home pay calculator for the UK and Belgium

Enter your salary and see your tax, contributions and take-home pay per year, month,
week or day.

![Screen sample](screensample.png)

## Features

**UK**

- Tax years 2020/21 to 2026/27 (England, Wales and Northern Ireland).
- Pension contributions as standard (net pay) or salary sacrifice.
- Student loan Plan 1, 2, 4 and 5, plus postgraduate loans.
- Bonus or overtime with no pension contribution, and other salary sacrifice
  (for example childcare vouchers).
- Compare your pay with other UK taxpayers.

**Belgium**

- Income years 2022 to 2026, for a white-collar employee taxed alone.
- Social security (13.07%), personal income tax with the tax-free amount and flat-rate
  work expenses, municipal tax (your own rate) and the special social security contribution.
- Dependent children and the extra amount for single parents.
- Compare your pay with the median and the lowest and top 10% of full-time employees
  (Statbel).
- Not included: the work bonus for lower salaries, joint taxation, other dependants, the
  extra amount for children under 3 and the refundable tax credit for children.

**Both**

- Charts: take-home pay at other salaries and tax on your next £100 or €100.
- Your inputs are kept in the address bar, so you can bookmark or share a result.
- Light and dark themes.

## Development

Requires Node.js 20 or later.

```bash
npm install
npm run dev      # start the dev server
npm test         # run the unit tests
npm run build    # build for production into dist/
```

To build and serve with Docker:

```bash
docker build -t money .
docker run -p 8080:80 money
```

## Updating rates

Each country has its own folder in [`src/countries`](src/countries):

- UK rates: [`src/countries/uk/rules.ts`](src/countries/uk/rules.ts). Add a new tax year at the
  top of `TAX_YEARS`. The income comparison data is in
  [`src/countries/uk/percentiles.ts`](src/countries/uk/percentiles.ts).
- Belgian rates: [`src/countries/be/rules.ts`](src/countries/be/rules.ts). Add a new income year
  at the top of `BELGIAN_YEARS`. The pay comparison data is in
  [`src/countries/be/pay.ts`](src/countries/be/pay.ts).

Built with React, TypeScript, Vite and Recharts.
