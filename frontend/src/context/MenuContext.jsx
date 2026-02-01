import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const MenuContext = createContext(null);

const STORAGE_KEY = 'csk_menu_items_v1';

export const ADMIN_CATEGORIES = ['Shawarma', 'Kebab', 'Barbeque', 'Beverages'];

const DEFAULT_ITEMS = [
  {
    id: 'seed-1',
    category: 'Shawarma',
    name: 'Classic Chicken Shawarma',
    description: 'Juicy chicken, fresh veggies, creamy garlic sauce, wrapped warm.',
    price: 120,
    tags: ['nonveg', 'bestseller'],
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=1200&q=70',
  },
  {
    id: 'seed-2',
    category: 'Kebab',
    name: 'Chicken Seekh Kebab',
    description: 'Smoky, spiced, and grilled—served with onion & mint chutney.',
    price: 160,
    tags: ['nonveg'],
    image: 'https://images.unsplash.com/photo-1555992336-cbf95d43f0f3?auto=format&fit=crop&w=1200&q=70',
  },
  {
    id: 'seed-3',
    category: 'Barbeque',
    name: 'BBQ Chicken (Half)',
    description: 'Charred edges, juicy center, and a balanced smoky glaze.',
    price: 240,
    tags: ['nonveg'],
    image: 'https://images.unsplash.com/photo-1604909052579-6e9d8f86b1bb?auto=format&fit=crop&w=1200&q=70',
  },
  {
    id: 'seed-4',
    category: 'Beverages',
    name: 'Fresh Lime Soda',
    description: 'Crisp, refreshing, and perfectly balanced.',
    price: 60,
    tags: ['veg', 'bestseller'],
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=70',
  },
];

const safeParse = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const MenuProvider = ({ children }) => {
  const [items, setItems] = useState(DEFAULT_ITEMS);

  useEffect(() => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY));
    if (stored && stored.length > 0) setItems(stored);
  }, []);

  // Try to fetch foods from backend to replace local seed data when available
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch('/api/foods');
        if (!res.ok) return; // keep defaults if backend not available
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(f => ({
            id: f._id,
            _id: f._id,
            category: f.categoryName || (f.category && f.category.name) || f.category,
            name: f.name,
            description: f.description,
            price: f.price,
            tags: [],
            image: f.image,
            available: f.available
          }));
          setItems(mapped);
        }
      } catch (err) {
        // ignore - keep defaults
      }
    };
    fetchFoods();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const categories = useMemo(() => {
    // Dynamic categories visible to users: ONLY those that have at least one item.
    const set = new Set(items.map((i) => i.category).filter(Boolean));
    // Keep a stable order based on allowed admin categories
    return ADMIN_CATEGORIES.filter((c) => set.has(c));
  }, [items]);

  const addItem = (item) => {
    const id = `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    // Ensure tags is always an array
    const newItem = { ...item, id, tags: Array.isArray(item.tags) ? item.tags : [] };
    setItems((prev) => [{ ...newItem }, ...prev]);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const resetMenu = () => {
    setItems(DEFAULT_ITEMS);
  };

  const value = {
    items,
    categories,
    addItem,
    removeItem,
    resetMenu,
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenu = () => {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error('useMenu must be used within MenuProvider');
  return ctx;
};


