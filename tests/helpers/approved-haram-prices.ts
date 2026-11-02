import approvedPrices from "../fixtures/approved-haram-prices.json" with { type: "json" };

// Preserve the immutable localization fixture and change only approved Haram prices.
export const withApprovedHaramPrices = (baseline: any): any => {
  const expected = structuredClone(baseline);
  expected.haram = expected.haram.map((item: any) => ({...item, price: approvedPrices[item.id as keyof typeof approvedPrices]}));
  for (const [route, page] of Object.entries(expected.routes) as [string, any][]) {
    if (!/^\/menu\/haram\/[a-z]{2}\/$/.test(route)) continue;
    page.products = page.products.map((item: any) => {
      const price = approvedPrices[item.id as keyof typeof approvedPrices];
      return {...item, price, currencyText: item.currencyText.replace(String(item.price), String(price))};
    });
  }
  return expected;
};
