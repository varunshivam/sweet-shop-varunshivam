import { useEffect, useState } from "react";
import { getSweets, addSweet, updateSweet, deleteSweet } from "../api";

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export default function Admin() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Sweet>({
    id: 0,
    name: "",
    category: "",
    price: 0,
    quantity: 0,
  });

  const loadSweets = async () => {
    setLoading(true);
    const res = await getSweets();
    setSweets(
      res.data.map((s: any) => ({
        ...s,
        price: Number(s.price),
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    loadSweets();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addSweet(form);
    setForm({ id: 0, name: "", category: "", price: 0, quantity: 0 });
    loadSweets();
  };

  const handleSave = async (id: number) => {
    await updateSweet(id, {
      name: form.name,
      category: form.category,
      price: form.price,
      quantity: form.quantity,
    });
    setEditingId(null);
    loadSweets();
  };

  const adjustQuantity = async (sweet: Sweet, delta: number) => {
    await updateSweet(sweet.id, {
      quantity: sweet.quantity + delta,
    });
    loadSweets();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this sweet?")) {
      await deleteSweet(id);
      loadSweets();
    }
  };

  if (loading) {
    return <div className="loading">Loading Admin Panel…</div>;
  }

  return (
    <div className="container">
      <div className="admin-header">
        <h1>⚙️ Admin – Sweet Management</h1>
        <p>Logged in as administrator</p>
      </div>

      {/* ADD SWEET */}
      <div className="card">
        <h2>Add New Sweet</h2>
        <form onSubmit={handleAdd}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: Number(e.target.value) })
            }
            required
          />
          <button>Add Sweet</button>
        </form>
      </div>

      {/* SWEET LIST */}
      <div className="grid">
        {sweets.map((sweet) => (
          <div className="sweet-card" key={sweet.id}>
            {editingId === sweet.id ? (
              <>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                />
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                />
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: Number(e.target.value) })
                  }
                />
                <button onClick={() => handleSave(sweet.id)}>Save</button>
                <button
                  className="secondary"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h4>{sweet.name}</h4>
                <span className="category">{sweet.category}</span>
                <div className="price">₹{sweet.price.toFixed(2)}</div>
                <div className="quantity">Stock: {sweet.quantity}</div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => {
                      setEditingId(sweet.id);
                      setForm(sweet);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button onClick={() => adjustQuantity(sweet, 1)}>➕</button>
                  <button
                    onClick={() => adjustQuantity(sweet, -1)}
                    disabled={sweet.quantity === 0}
                  >
                    ➖
                  </button>
                  <button
                    className="danger"
                    onClick={() => handleDelete(sweet.id)}
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
