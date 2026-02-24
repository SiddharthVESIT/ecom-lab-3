import {
  createCart,
  getActiveCartByUserId,
  getCartSummary,
  updateCartItemQuantity,
  upsertCartItem
} from './cart.repository.js';

async function ensureCart(userId) {
  return (await getActiveCartByUserId(userId)) || createCart(userId);
}

export async function addCartItem(userId, productId, quantity = 1) {
  const cart = await ensureCart(userId);
  await upsertCartItem(cart.id, productId, quantity);
  return getCartTotals(userId);
}

export async function changeCartItemQuantity(userId, productId, quantity) {
  const cart = await ensureCart(userId);
  await updateCartItemQuantity(cart.id, productId, quantity);
  return getCartTotals(userId);
}

export async function getCartTotals(userId) {
  const cart = await ensureCart(userId);
  const items = await getCartSummary(cart.id);
  const subtotalCents = items.reduce((sum, item) => sum + Number(item.line_total_cents), 0);

  return {
    cartId: cart.id,
    items,
    subtotalCents,
    subtotal: (subtotalCents / 100).toFixed(2)
  };
}
