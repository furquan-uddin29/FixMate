-- FixMate Demo Seed Data
-- Demonstrates realistic service marketplace data for CSE 3292 evaluation

-- 1. Insert Services
INSERT INTO public.services (id, name, slug, category, short_description, full_description, base_price, estimated_duration, icon, image_url, is_active)
VALUES
('s1111111-1111-1111-1111-111111111111', 'Emergency Plumbing & Pipe Repair', 'plumbing-repair', 'Plumbing', 'Fast leak fixes, pipe replacements, drain unclogging, and fixture installations.', 'Comprehensive residential plumbing services by certified master plumbers. Includes diagnostic inspection, pipe repairs, faucet installation, and sewer line clearing with standard 90-day warranty.', 49.00, '1 - 2 hours', 'Droplet', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80', true),
('s2222222-2222-2222-2222-222222222222', 'Electrical Troubleshooting & Wiring', 'electrical-troubleshooting', 'Electrical', 'Circuit breaker fixes, rewiring, switchboard upgrades, and light installations.', 'Licensed electricians solving short circuits, power outages, flickering lights, ceiling fan wiring, and electrical panel upgrades with full safety compliance.', 59.00, '1 - 3 hours', 'Zap', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80', true),
('s3333333-3333-3333-3333-333333333333', 'AC Master Service & Gas Refill', 'ac-master-service', 'AC Repair', 'Complete HVAC deep jet wash, cooling problem diagnostics, and refrigerant refilling.', 'Complete split and central AC servicing. Includes filter and coil deep cleaning, refrigerant pressure checks, leak detection, and compressor health analysis.', 69.00, '1.5 - 2.5 hours', 'Wind', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80', true),
('s4444444-4444-4444-4444-444444444444', 'Refrigerator & Washing Machine Repair', 'appliance-repair', 'Appliance Repair', 'Diagnostic and component replacement for all major refrigerator, washer, and dryer brands.', 'Expert technicians for home appliances. We diagnose motor issues, PCB failures, thermostat errors, cooling loss, and drum vibration with genuine OEM replacement parts.', 45.00, '1 - 2 hours', 'Cpu', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', true),
('s5555555-5555-5555-5555-555555555555', 'Interior & Exterior Wall Painting', 'wall-painting', 'Painting', 'Precision wall damp proofing, premium color coating, and modern accent walls.', 'Professional painters using odorless, eco-friendly washable paint. Includes surface putty smoothing, primer application, and high-coverage dual finish.', 89.00, '4 - 8 hours', 'Paintbrush', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', true),
('s6666666-6666-6666-6666-666666666666', 'Deep Home Sanitization & Cleaning', 'home-sanitization', 'Cleaning', 'Intensive kitchen, bathroom, and carpet deep steam cleaning and disinfection.', 'Hospital-grade sanitization for homes and apartments. Covers grout scrubbing, kitchen grease degreasing, sofa extraction, and multi-surface disinfection.', 55.00, '2 - 4 hours', 'Sparkles', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80', true),
('s7777777-7777-7777-7777-777777777777', 'Custom Carpentry & Furniture Repair', 'carpentry-service', 'Carpentry', 'Door lock replacements, hinge alignment, custom shelving, and wooden furniture repairs.', 'Experienced carpenters for woodwork, door hinge adjustments, modern cabinet repairs, wardrobe assembly, and laminate restoration.', 50.00, '1 - 3 hours', 'Hammer', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', true),
('s8888888-8888-8888-8888-888888888888', 'Smart Home & Security CCTV Setup', 'smart-home-cctv', 'Smart Home', 'Smart doorbell, Wi-Fi security camera installation, and smart lock automation.', 'Certified smart home technicians for Nest, Ring, IP security cameras, Wi-Fi mesh systems, and automated smart locks with smartphone app synchronization.', 75.00, '2 - 3 hours', 'ShieldCheck', 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Pricing Rates
INSERT INTO public.pricing (service_id, base_price, labor_charge, emergency_fee, additional_fee_rate, currency)
VALUES
('s1111111-1111-1111-1111-111111111111', 49.00, 30.00, 25.00, 15.00, 'USD'),
('s2222222-2222-2222-2222-222222222222', 59.00, 35.00, 30.00, 20.00, 'USD'),
('s3333333-3333-3333-3333-333333333333', 69.00, 40.00, 35.00, 25.00, 'USD'),
('s4444444-4444-4444-4444-444444444444', 45.00, 35.00, 25.00, 15.00, 'USD'),
('s5555555-5555-5555-5555-555555555555', 89.00, 45.00, 40.00, 20.00, 'USD'),
('s6666666-6666-6666-6666-666666666666', 55.00, 25.00, 20.00, 15.00, 'USD'),
('s7777777-7777-7777-7777-777777777777', 50.00, 30.00, 25.00, 15.00, 'USD'),
('s8888888-8888-8888-8888-888888888888', 75.00, 40.00, 30.00, 25.00, 'USD')
ON CONFLICT DO NOTHING;
