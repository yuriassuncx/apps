import { getCookies } from "std/http/cookie.ts";
import { AppContext } from "../../mod.ts";
import { getCartCookie, setCartCookie } from "../../utils/cart.ts";
import { UpdateItems } from "../../utils/storefront/queries.ts";
import {
  CartFragment,
  UpdateItemsMutation,
  UpdateItemsMutationVariables,
} from "../../utils/storefront/storefront.graphql.gen.ts";

type UpdateLineProps = {
  lines: Array<{
    id: string;
    quantity?: number;
  }>;
};

const action = async (
  { lines }: UpdateLineProps,
  req: Request,
  ctx: AppContext,
): Promise<CartFragment | null> => {
  const { storefront } = ctx;
  const cookies = getCookies(req.headers);
  const selectedCartBrand = cookies["selectedCartBrand"];
  const cartId = getCartCookie(req.headers, selectedCartBrand);

  if (!cartId) {
    throw new Error("Missing cart id");
  }

  const { payload } = await storefront.query<
    UpdateItemsMutation,
    UpdateItemsMutationVariables
  >({
    variables: { cartId, lines },
    ...UpdateItems,
  });

  setCartCookie(ctx.response.headers, cartId);

  return payload?.cart ?? null;
};

export default action;
