import { useMemo, useState } from 'react';
import { ADMIN_CATEGORIES, useMenu } from '../../context/MenuContext';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const AdminMenuManager = () => {
  const { items, addItem, removeItem, resetMenu } = useMenu();
  const [form, setForm] = useState({
    name: '',
    image: '',
    description: '',
    price: '',
    category: ADMIN_CATEGORIES[0],
    tags: {
      bestseller: false,
      veg: false,
      nonveg: false
    }
  });

  const itemCountByCategory = useMemo(() => {
    const map = new Map();
    for (const c of ADMIN_CATEGORIES) map.set(c, 0);
    for (const i of items) map.set(i.category, (map.get(i.category) || 0) + 1);
    return map;
  }, [items]);

  const handleTagChange = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: {
        ...prev.tags,
        [tag]: !prev.tags[tag]
      }
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const priceNum = Number(form.price);
    if (!form.name.trim() || !form.description.trim() || !Number.isFinite(priceNum)) return;

    // Convert boolean tags to array
    const selectedTags = Object.entries(form.tags)
      .filter(([_, isSelected]) => isSelected)
      .map(([tag]) => tag);

    addItem({
      name: form.name.trim(),
      image:
        form.image.trim() ||
        'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=1200&q=70',
      description: form.description.trim(),
      price: priceNum,
      category: form.category,
      tags: selectedTags
    });

    setForm({
      name: '',
      image: '',
      description: '',
      price: '',
      category: ADMIN_CATEGORIES[0],
      tags: { bestseller: false, veg: false, nonveg: false }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0b0e] via-[#0f0f14] to-[#0b0b0e] text-white">
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-csk-yellow">Admin Menu Manager</h1>
            <p className="mt-3 text-gray-300">
              Frontend simulation of admin-controlled menu. Add items with one category and multiple tags.
            </p>
          </div>
          <button
            type="button"
            onClick={resetMenu}
            className="self-start md:self-auto rounded-full px-5 py-2.5 text-sm font-semibold bg-[#14151a] ring-1 ring-white/10 hover:ring-csk-yellow/60 text-white transition shadow-soft"
          >
            Reset sample menu
          </button>
        </div>

        {/* Category summary */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ADMIN_CATEGORIES.map((c) => (
            <div key={c} className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-5 hover:ring-csk-yellow/60 transition">
              <div className="text-sm font-semibold text-white">{c}</div>
              <div className="mt-1 text-2xl font-bold text-csk-yellow">{itemCountByCategory.get(c) || 0}</div>
              <div className="mt-1 text-xs text-gray-300">items</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-8">
          {/* Add form */}
          <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
            <h2 className="font-heading text-2xl font-semibold text-white">Add food item</h2>
            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="text-sm font-medium text-gray-200">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Classic Chicken Shawarma"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f14] px-4 py-3 outline-none text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-200">Image URL (optional)</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f14] px-4 py-3 outline-none text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-200">Description</label>
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Short appetizing description..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f14] px-4 py-3 outline-none text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-200">Price (₹)</label>
                  <input
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    placeholder="120"
                    inputMode="numeric"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f14] px-4 py-3 outline-none text-white placeholder:text-gray-500 focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-200">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f0f14] px-4 py-3 outline-none text-white focus:ring-2 focus:ring-csk-yellow/70 focus:border-transparent"
                  >
                    {ADMIN_CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#0f0f14]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tag Selection */}
              <div>
                <label className="text-sm font-medium text-gray-200 block mb-2">Tags</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.tags.bestseller}
                      onChange={() => handleTagChange('bestseller')}
                      className="rounded bg-[#0f0f14] border-white/20 text-csk-yellow focus:ring-csk-yellow/70"
                    />
                    <span className="text-white text-sm">Bestseller</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.tags.veg}
                      onChange={() => handleTagChange('veg')}
                      className="rounded bg-[#0f0f14] border-white/20 text-csk-yellow focus:ring-csk-yellow/70"
                    />
                    <span className="text-white text-sm">Veg</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.tags.nonveg}
                      onChange={() => handleTagChange('nonveg')}
                      className="rounded bg-[#0f0f14] border-white/20 text-csk-yellow focus:ring-csk-yellow/70"
                    />
                    <span className="text-white text-sm">Non-Veg</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-csk-yellow px-6 py-3 text-sm font-semibold text-[#0b0b0f] hover:bg-csk-yellowSoft transition shadow-soft ring-1 ring-csk-yellow/60 inline-flex items-center justify-center gap-2"
              >
                <FiPlus /> Add item
              </button>
            </form>
          </div>

          {/* Items list */}
          <div className="bg-[#14151a] rounded-2xl shadow-soft ring-1 ring-white/10 p-6">
            <h2 className="font-heading text-2xl font-semibold text-white">Current items</h2>
            <p className="mt-2 text-sm text-gray-300">
              These items are stored in localStorage and used by the user-facing Menu page.
            </p>

            <div className="mt-6 space-y-3 max-h-[520px] overflow-auto pr-1">
              {items.map((i) => (
                <div key={i.id} className="flex items-start gap-4 rounded-xl ring-1 ring-white/10 p-4 bg-[#0f0f14] hover:ring-csk-yellow/60 transition">
                  <img src={i.image} alt={i.name} className="h-16 w-16 rounded-xl object-cover ring-2 ring-transparent hover:ring-csk-yellow/70 transition" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate">{i.name}</div>
                        <div className="text-xs text-gray-300 mt-1">
                          {i.category} • <span className="text-csk-yellow">₹{i.price}</span>
                        </div>
                        {i.tags && i.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {i.tags.map(t => (
                              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 uppercase tracking-wide">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(i.id)}
                        className="text-gray-400 hover:text-red-400 transition"
                        aria-label="Remove item"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-center py-10 text-gray-400">No items yet. Add your first item.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminMenuManager;


