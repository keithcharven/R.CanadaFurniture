-- R. Canada Furniture — Seed Data
USE rcanada_furniture;

-- ============================================
-- ADMIN + SAMPLE USERS
-- ============================================
-- Password: Admin123! (bcrypt hash)
INSERT INTO users (full_name, email, password_hash, phone, role, address) VALUES
('R. Canada Admin', 'admin@rcanada.com', '$2b$10$ex0IUj/MTXNMeKnzI.wUiexxgVbX9nTdFmTeFoegToO/pyxyaVceG', '+63 912 000 0001', 'admin', 'R. Canada HQ, Makati City'),
('Maria Santos', 'maria@example.com', '$2b$10$ex0IUj/MTXNMeKnzI.wUiexxgVbX9nTdFmTeFoegToO/pyxyaVceG', '+63 917 111 2222', 'customer', '123 Rizal Ave, Manila'),
('Juan Cruz', 'juan@example.com', '$2b$10$ex0IUj/MTXNMeKnzI.wUiexxgVbX9nTdFmTeFoegToO/pyxyaVceG', '+63 918 333 4444', 'customer', '456 Mabini St, Cebu City');



-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, description) VALUES
('Living Room', 'living-room', 'Sofas, coffee tables, entertainment centers, and accent chairs to make your living room the heart of your home.'),
('Bedroom', 'bedroom', 'Beds, nightstands, dressers, and wardrobes for your perfect sanctuary.'),
('Dining', 'dining', 'Dining tables, chairs, buffets, and bar stools for memorable meals.'),
('Office', 'office', 'Desks, office chairs, bookshelves, and storage to power your productivity.'),
('Decor', 'decor', 'Lamps, mirrors, vases, throw pillows, and wall art to add personality.'),
('Outdoor', 'outdoor', 'Patio sets, garden furniture, and outdoor accessories for alfresco living.');

-- ============================================
-- PRODUCTS
-- ============================================
INSERT INTO products (category_id, name, slug, description, price, stock_quantity, material, dimensions, is_featured) VALUES
-- Living Room
(1, 'Rosewood Velvet Sofa', 'rosewood-velvet-sofa', 'A luxurious 3-seater sofa with soft velvet upholstery in blush pink, featuring gold-finish metal legs for a modern boutique look.', 45990.00, 12, 'Velvet, Metal', '210 x 85 x 80 cm', TRUE),
(1, 'Marble-Top Coffee Table', 'marble-top-coffee-table', 'Elegant round coffee table with genuine white marble top and brushed brass base. A statement piece for any living room.', 18500.00, 20, 'Marble, Brass', '90 x 90 x 45 cm', TRUE),
(1, 'Luna Accent Chair', 'luna-accent-chair', 'Sculptural accent chair with curved backrest, upholstered in bouclé fabric with oak legs.', 15990.00, 15, 'Bouclé Fabric, Oak', '72 x 70 x 78 cm', FALSE),
(1, 'Floating TV Console', 'floating-tv-console', 'Wall-mounted entertainment console with cable management, solid walnut veneer finish.', 22800.00, 8, 'Walnut Veneer, MDF', '180 x 40 x 35 cm', TRUE),

-- Bedroom
(2, 'Cloud Nine King Bed', 'cloud-nine-king-bed', 'Upholstered king platform bed with tufted headboard in cream linen. Solid wood slat support included.', 38990.00, 10, 'Linen, Solid Wood', '200 x 190 x 120 cm', TRUE),
(2, 'Moonlight Nightstand', 'moonlight-nightstand', 'Compact bedside table with two drawers and soft-close hardware. Painted matte white with gold handles.', 7990.00, 30, 'MDF, Metal', '50 x 40 x 55 cm', FALSE),
(2, 'Aria Dresser', 'aria-dresser', 'Six-drawer dresser with beveled mirror option, crafted from solid acacia wood with a warm honey finish.', 28500.00, 6, 'Acacia Wood', '140 x 50 x 80 cm', FALSE),
(2, 'Serenity Wardrobe', 'serenity-wardrobe', 'Two-door wardrobe with internal shelving and hanging rail. Clean lines in matte charcoal finish.', 32000.00, 5, 'Engineered Wood', '120 x 60 x 200 cm', FALSE),

-- Dining
(3, 'Harvest Oak Dining Table', 'harvest-oak-dining-table', 'Solid oak dining table seating 6, with a live-edge design and natural grain finish. Handcrafted beauty.', 35990.00, 7, 'Solid Oak', '180 x 90 x 76 cm', TRUE),
(3, 'Petal Dining Chair (Set of 2)', 'petal-dining-chair-set', 'Modern dining chairs with petal-shaped backrests, upholstered seats, and powder-coated black metal legs.', 9990.00, 25, 'Fabric, Metal', '48 x 55 x 82 cm', FALSE),
(3, 'Minimalist Buffet Sideboard', 'minimalist-buffet-sideboard', 'Streamlined sideboard with three cabinets and a sliding door, natural teak finish.', 24500.00, 4, 'Teak', '160 x 45 x 75 cm', FALSE),

-- Office
(4, 'Executive Standing Desk', 'executive-standing-desk', 'Electric height-adjustable desk with solid bamboo top, dual motors, memory presets, and cable tray.', 29990.00, 14, 'Bamboo, Steel', '160 x 70 x 65-125 cm', TRUE),
(4, 'Ergo Mesh Office Chair', 'ergo-mesh-office-chair', 'Ergonomic task chair with breathable mesh back, adjustable lumbar support, and 4D armrests.', 16500.00, 18, 'Mesh, Nylon, Metal', '65 x 65 x 100-115 cm', TRUE),
(4, 'Modular Bookshelf', 'modular-bookshelf', 'Five-tier open shelving unit with metal frame and oak shelves. Can be combined for a library wall.', 11990.00, 22, 'Oak, Metal', '80 x 35 x 180 cm', FALSE),

-- Decor
(5, 'Blush Ceramic Vase Set', 'blush-ceramic-vase-set', 'Set of 3 handcrafted ceramic vases in graduating sizes, finished in soft blush and cream glazes.', 3490.00, 40, 'Ceramic', '12-25 cm tall', FALSE),
(5, 'Gold Arc Floor Lamp', 'gold-arc-floor-lamp', 'Statement arc floor lamp with brushed gold finish and linen drum shade. Dimmable with foot switch.', 8990.00, 16, 'Metal, Linen', '45 x 45 x 180 cm', TRUE),
(5, 'Woven Wall Mirror', 'woven-wall-mirror', 'Round mirror with hand-woven rattan frame. Adds warmth and texture to any wall.', 5990.00, 20, 'Rattan, Glass', '80 cm diameter', FALSE),
(5, 'Velvet Throw Pillow (Pair)', 'velvet-throw-pillow-pair', 'Pair of plush velvet cushion covers with hidden zipper. Available in dusty rose, sage, and ivory.', 1990.00, 50, 'Velvet', '45 x 45 cm', FALSE),

-- Outdoor
(6, 'Teak Patio Dining Set', 'teak-patio-dining-set', 'Solid teak 4-seater outdoor dining set with slatted table and stackable chairs. Weather-resistant.', 42990.00, 5, 'Solid Teak', 'Table: 120 x 80 x 75 cm', FALSE),
(6, 'Rattan Egg Chair', 'rattan-egg-chair', 'Hanging egg chair with powder-coated steel frame and weather-resistant PE rattan weave. Includes cushion.', 19990.00, 9, 'PE Rattan, Steel', '105 x 95 x 195 cm', TRUE);

-- ============================================
-- PRODUCT IMAGES (placeholder URLs)
-- ============================================
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
(1, '/uploads/products/rosewood-velvet-sofa-1.jpg', 1),
(2, '/uploads/products/marble-coffee-table-1.jpg', 1),
(3, '/uploads/products/luna-accent-chair-1.jpg', 1),
(4, '/uploads/products/floating-tv-console-1.jpg', 1),
(5, '/uploads/products/cloud-nine-king-bed-1.jpg', 1),
(6, '/uploads/products/moonlight-nightstand-1.jpg', 1),
(7, '/uploads/products/aria-dresser-1.jpg', 1),
(8, '/uploads/products/serenity-wardrobe-1.jpg', 1),
(9, '/uploads/products/harvest-oak-dining-table-1.jpg', 1),
(10, '/uploads/products/petal-dining-chair-1.jpg', 1),
(11, '/uploads/products/minimalist-buffet-1.jpg', 1),
(12, '/uploads/products/executive-standing-desk-1.jpg', 1),
(13, '/uploads/products/ergo-mesh-chair-1.jpg', 1),
(14, '/uploads/products/modular-bookshelf-1.jpg', 1),
(15, '/uploads/products/blush-ceramic-vase-1.jpg', 1),
(16, '/uploads/products/gold-arc-floor-lamp-1.jpg', 1),
(17, '/uploads/products/woven-wall-mirror-1.jpg', 1),
(18, '/uploads/products/velvet-throw-pillow-1.jpg', 1),
(19, '/uploads/products/teak-patio-set-1.jpg', 1),
(20, '/uploads/products/rattan-egg-chair-1.jpg', 1);
