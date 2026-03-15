-- Seed data for Zen Chocolatier products

INSERT INTO products (sku, name, category, description, price_cents, image_url, is_active)
VALUES
  -- Signature Bonbons
  ('SB-MATCHA-001', 'Uji Matcha Truffle', 'signature_bonbons',
   'A velvety ganache infused with ceremonial-grade Uji matcha, enrobed in premium dark chocolate. Each bite reveals layers of earthy umami and subtle sweetness.',
   1850, 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600', TRUE),

  ('SB-YUZU-002', 'Yuzu Citrus Bonbon', 'signature_bonbons',
   'Bright and aromatic yuzu curd nestled within a white chocolate shell, finished with a delicate gold leaf accent. A perfect balance of tart and sweet.',
   2100, 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600', TRUE),

  ('SB-SAKURA-003', 'Sakura Blossom Praline', 'signature_bonbons',
   'Cherry blossom-infused praline with a whisper of rose salt, hand-painted with edible sakura petals. Captures the fleeting beauty of spring.',
   1950, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600', TRUE),

  ('SB-HOJICHA-004', 'Hojicha Caramel', 'signature_bonbons',
   'Roasted green tea caramel with smoky depth, layered in milk chocolate. The slow-roasted hojicha adds a toasty warmth to every bite.',
   1750, 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600', TRUE),

  ('SB-WASABI-005', 'Wasabi Dark Ganache', 'signature_bonbons',
   'Real wasabi root blended into 72% dark chocolate ganache for a bold, tingling finish. Not for the faint of heart — a true connoisseur experience.',
   2200, 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600', TRUE),

  ('SB-MISO-006', 'White Miso Bonbon', 'signature_bonbons',
   'Sweet white miso paste folded into a butterscotch ganache, creating an addictive savory-sweet profile with incredible depth.',
   1900, 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=600', TRUE),

  -- Bars
  ('BR-DARKSEA-001', 'Dark Sea Salt Bar', 'bars',
   'Single-origin 70% dark chocolate from Okinawa cacao, finished with hand-harvested Amami sea salt. A masterclass in simplicity and craft.',
   1200, 'https://images.unsplash.com/photo-1553452118-621e1f860f43?w=600', TRUE),

  ('BR-MATMILK-002', 'Matcha Milk Chocolate Bar', 'bars',
   'Creamy Hokkaido milk chocolate blended with stone-ground ceremonial matcha. Smooth, rich, and irresistibly green.',
   1400, 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600', TRUE),

  ('BR-GENMAICHA-003', 'Genmaicha Rice Crisp Bar', 'bars',
   'Toasted brown rice pieces folded into 55% milk chocolate, inspired by Japan''s beloved genmaicha tea. Crunchy, nutty, and satisfying.',
   1100, 'https://images.unsplash.com/photo-1575377427642-087cf684f29d?w=600', TRUE),

  ('BR-SESAME-004', 'Black Sesame Crunch Bar', 'bars',
   'Roasted black sesame seeds and brittle caramel shards layered within white chocolate. An homage to traditional Japanese confections.',
   1300, 'https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?w=600', TRUE),

  ('BR-KINAKO-005', 'Kinako Soybean Bar', 'bars',
   'Roasted soybean flour (kinako) blended into 60% dark chocolate with a hint of kuromitsu (black sugar syrup). A taste of Japanese nostalgia.',
   1250, 'https://images.unsplash.com/photo-1623660053975-cf75a8be0908?w=600', TRUE),

  -- Hampers
  ('HM-KYOTO-001', 'Kyoto Connoisseur Collection', 'hampers',
   'A curated selection of 12 signature bonbons, 2 artisan bars, and a tin of ceremonial matcha — all nestled in a handcrafted paulownia wood box.',
   8500, 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?w=600', TRUE),

  ('HM-SAKURA-002', 'Sakura Season Gift Set', 'hampers',
   'Limited edition spring collection featuring sakura bonbons, cherry blossom bark, and a rose-gold chocolate spoon. Wrapped in washi paper.',
   6200, 'https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?w=600', TRUE),

  ('HM-TASTING-003', 'Omakase Tasting Box', 'hampers',
   'Chef''s choice of 8 seasonal bonbons, changing monthly. An ever-evolving journey through Japan''s finest cacao and local ingredients.',
   4500, 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=600', TRUE),

  ('HM-IMPERIAL-004', 'Imperial Gift Hamper', 'hampers',
   'The ultimate Zen Chocolatier experience: 24 bonbons, 4 bars, matcha set, and a hand-signed certificate of authenticity. Presented in a lacquered box.',
   15000, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600', TRUE)

ON CONFLICT (sku) DO NOTHING;
