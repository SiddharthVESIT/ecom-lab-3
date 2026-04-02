-- Seed dummy users
INSERT INTO users (full_name, email, password_hash, role) VALUES
  ('Alice Smith', 'alice@example.com', crypt('password123', gen_salt('bf', 12)), 'customer'),
  ('Bob Jones', 'bob@example.com', crypt('password123', gen_salt('bf', 12)), 'customer'),
  ('Charlie Davis', 'charlie@example.com', crypt('password123', gen_salt('bf', 12)), 'customer'),
  ('Dave Wilson', 'dave@example.com', crypt('password123', gen_salt('bf', 12)), 'customer')
ON CONFLICT (email) DO NOTHING;

-- Create some orders using DO block
DO $$ 
DECLARE
  alice_id UUID;
  bob_id UUID;
  charlie_id UUID;
  dave_id UUID;
  p1_id BIGINT;
  p2_id BIGINT;
  p3_id BIGINT;
  alice_cart BIGINT;
  bob_cart BIGINT;
  charlie_cart BIGINT;
  dave_cart BIGINT;
BEGIN
  -- Get user IDs
  SELECT id INTO alice_id FROM users WHERE email = 'alice@example.com';
  SELECT id INTO bob_id FROM users WHERE email = 'bob@example.com';
  SELECT id INTO charlie_id FROM users WHERE email = 'charlie@example.com';
  SELECT id INTO dave_id FROM users WHERE email = 'dave@example.com';

  -- Get some product IDs
  SELECT id INTO p1_id FROM products WHERE sku = 'SB-MATCHA-001';
  SELECT id INTO p2_id FROM products WHERE sku = 'BR-DARKSEA-001';
  SELECT id INTO p3_id FROM products WHERE sku = 'HM-AMAI-001';

  -- Alice's Cart & Order 1 (Completed)
  INSERT INTO carts (user_id, status) VALUES (alice_id, 'completed') RETURNING id INTO alice_cart;
  INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (alice_cart, p1_id, 2);
  INSERT INTO orders (user_id, cart_id, order_number, status, subtotal_cents, shipping_cents, total_cents)
  VALUES (alice_id, alice_cart, 'ORD-2026-001', 'delivered', 3700, 500, 4200);

  -- Bob's Cart & Order 2 (Processing)
  INSERT INTO carts (user_id, status) VALUES (bob_id, 'completed') RETURNING id INTO bob_cart;
  INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (bob_cart, p2_id, 3);
  INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (bob_cart, p3_id, 1);
  INSERT INTO orders (user_id, cart_id, order_number, status, subtotal_cents, shipping_cents, total_cents)
  VALUES (bob_id, bob_cart, 'ORD-2026-002', 'processing', 12100, 0, 12100);

  -- Charlie's Cart & Order 3 (Pending)
  INSERT INTO carts (user_id, status) VALUES (charlie_id, 'completed') RETURNING id INTO charlie_cart;
  INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (charlie_cart, p1_id, 1);
  INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (charlie_cart, p2_id, 1);
  INSERT INTO orders (user_id, cart_id, order_number, status, subtotal_cents, shipping_cents, total_cents)
  VALUES (charlie_id, charlie_cart, 'ORD-2026-003', 'pending', 3050, 500, 3550);

  -- Dave's Cart & Order 4 (Shipped)
  INSERT INTO carts (user_id, status) VALUES (dave_id, 'completed') RETURNING id INTO dave_cart;
  INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (dave_cart, p3_id, 1);
  INSERT INTO orders (user_id, cart_id, order_number, status, subtotal_cents, shipping_cents, total_cents)
  VALUES (dave_id, dave_cart, 'ORD-2026-004', 'shipped', 8500, 0, 8500);

END $$;
