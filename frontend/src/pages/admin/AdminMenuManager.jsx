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
  });

  const itemCountByCategory = useMemo(() => {
    const map = new Map();
    for (const c of ADMIN_CATEGORIES) map.set(c, 0);
    for (const i of items) map.set(i.category, (map.get(i.category) || 0) + 1);
    return map;
  }, [items]);

  const onSubmit = (e) => {
    e.preventDefault();
    const priceNum = Number(form.price);
    if (!form.name.trim() || !form.description.trim() || !Number.isFinite(priceNum)) return;

    addItem({
      name: form.name.trim(),
      image:
        form.image.trim() ||
        'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=1200&q=70',
      description: form.description.trim(),
      price: priceNum,
      category: form.category,
    });

    setForm((p) => ({ ...p, name: '', image: '', description: '', price: '' }));
  };

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">Admin Menu Manager</h1>
            <p className="mt-3 text-csk-text">
              Frontend simulation of admin-controlled menu. Add items with one category. The user-facing Menu page will
              automatically show ONLY categories that have items.
            </p>
          </div>
          <button
            type="button"
            onClick={resetMenu}
            className="self-start md:self-auto rounded-full px-5 py-2.5 text-sm font-semibold bg-white ring-1 ring-black/10 hover:bg-csk-cream transition shadow-soft"
          >
            Reset sample menu
          </button>
        </div>

        {/* Category summary */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ADMIN_CATEGORIES.map((c) => (
            <div key={c} className="bg-white rounded-2xl shadow-soft ring-1 ring-black/5 p-5">
              <div className="text-sm font-semibold text-csk-charcoal">{c}</div>
              <div className="mt-1 text-2xl font-bold text-csk-charcoal">{itemCountByCategory.get(c) || 0}</div>
              <div className="mt-1 text-xs text-csk-text">items</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-8">
          {/* Add form */}
          <div className="bg-white rounded-2xl shadow-soft ring-1 ring-black/5 p-6">
            <h2 className="font-heading text-2xl font-semibold">Add food item</h2>
            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="text-sm font-medium text-csk-charcoal">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Classic Chicken Shawarma"
                  className="mt-2 w-full rounded-xl border border-black/10 bg-csk-cream px-4 py-3 outline-none focus:ring-2 focus:ring-csk-yellow/60"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-csk-charcoal">Image URL (optional)</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-xl border border-black/10 bg-csk-cream px-4 py-3 outline-none focus:ring-2 focus:ring-csk-yellow/60"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-csk-charcoal">Description</label>
                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Short appetizing description..."
                  className="mt-2 w-full rounded-xl border border-black/10 bg-csk-cream px-4 py-3 outline-none focus:ring-2 focus:ring-csk-yellow/60"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-csk-charcoal">Price (₹)</label>
                  <input
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    placeholder="120"
                    inputMode="numeric"
                    className="mt-2 w-full rounded-xl border border-black/10 bg-csk-cream px-4 py-3 outline-none focus:ring-2 focus:ring-csk-yellow/60"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-csk-charcoal">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="mt-2 w-full rounded-xl border border-black/10 bg-csk-cream px-4 py-3 outline-none focus:ring-2 focus:ring-csk-yellow/60"
                  >
                    {ADMIN_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-csk-yellow px-6 py-3 text-sm font-semibold text-csk-charcoal hover:bg-csk-yellowSoft transition shadow-soft inline-flex items-center justify-center gap-2"
              >
                <FiPlus /> Add item
              </button>
            </form>
          </div>

          {/* Items list */}
          <div className="bg-white rounded-2xl shadow-soft ring-1 ring-black/5 p-6">
            <h2 className="font-heading text-2xl font-semibold">Current items</h2>
            <p className="mt-2 text-sm text-csk-text">
              These items are stored in localStorage and used by the user-facing Menu page.
            </p>

            <div className="mt-6 space-y-3 max-h-[520px] overflow-auto pr-1">
              {items.map((i) => (
                <div key={i.id} className="flex items-start gap-4 rounded-xl ring-1 ring-black/5 p-4">
                  <img src={i.image} alt={i.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-csk-charcoal truncate">{i.name}</div>
                        <div className="text-xs text-csk-text mt-1">
                          {i.category} • ₹{i.price}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(i.id)}
                        className="text-csk-charcoal/70 hover:text-red-600 transition"
                        aria-label="Remove item"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    <div className="mt-2 text-sm text-csk-text line-clamp-2">{i.description}</div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-center py-10 text-csk-text">No items yet. Add your first item.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminMenuManager;


