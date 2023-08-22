// DO NOT EDIT. This file is generated by deco.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $$$0 from "./loaders/ProductList.ts";
import * as $$$1 from "./loaders/ProductDetailsPage.ts";
import * as $$$2 from "./loaders/ProductListingPage.ts";
import * as $$$3 from "./loaders/cart.ts";
import * as $$$$$$$$$0 from "./actions/cart/updateCoupons.ts";
import * as $$$$$$$$$1 from "./actions/cart/updateItems.ts";
import * as $$$$$$$$$2 from "./actions/cart/addItems.ts";

const manifest = {
  "loaders": {
    "apps/shopify/loaders/cart.ts": $$$3,
    "apps/shopify/loaders/ProductDetailsPage.ts": $$$1,
    "apps/shopify/loaders/ProductList.ts": $$$0,
    "apps/shopify/loaders/ProductListingPage.ts": $$$2,
  },
  "actions": {
    "apps/shopify/actions/cart/addItems.ts": $$$$$$$$$2,
    "apps/shopify/actions/cart/updateCoupons.ts": $$$$$$$$$0,
    "apps/shopify/actions/cart/updateItems.ts": $$$$$$$$$1,
  },
  "name": "apps/shopify",
  "baseUrl": import.meta.url,
};

export type Manifest = typeof manifest;

export default manifest;
