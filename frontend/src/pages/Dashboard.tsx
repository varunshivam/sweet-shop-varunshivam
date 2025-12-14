import { useEffect, useState } from "react";
import { getSweets, addToCart } from "../api";

interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export default function Dashboard() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      setLoading(true);
      const response = await getSweets();

      // normalize price (backend sends string)
      const normalized = response.data.map((s: any) => ({
        ...s,
        price: Number(s.price),
      }));

      setSweets(normalized);
    } catch (error) {
      console.error("Failed to load sweets:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD TO CART (FIXED) ================= */
  const handleAddToCart = async (sweetId: number) => {
    try {
      await addToCart(sweetId, 1);
      alert("Added to cart");
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Failed to add to cart");
    }
  };
  /* ====================================================== */

  const filteredSweets = sweets.filter((sweet) => {
    const matchesSearch = sweet.name
      .toLowerCase()
      .includes(query.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || sweet.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...Array.from(new Set(sweets.map((s) => s.category))),
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading delicious sweets...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>🍬 Sweet Paradise</h1>
        <p>Discover our delightful collection of sweets</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for your favorite sweets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              background:
                selectedCategory === cat
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "rgba(255, 255, 255, 0.9)",
              color: selectedCategory === cat ? "white" : "#4a5568",
              padding: "10px 24px",
              fontSize: "14px",
              textTransform: "capitalize",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredSweets.length === 0 ? (
        <div className="empty-state">
          <div className="emoji">🍭</div>
          <h3>No sweets found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid">
          {filteredSweets.map((sweet) => (
            <div className="sweet-card" key={sweet.id}>
              <h4>{sweet.name}</h4>
              <span className="category">{sweet.category}</span>

              <div className="price">₹{sweet.price.toFixed(2)}</div>

              <div className="quantity">
                {sweet.quantity > 0 ? (
                  <>
                    Stock:
                    <span className="quantity-badge">
                      {sweet.quantity} units
                    </span>
                  </>
                ) : (
                  <span className="out-of-stock">⚠️ Out of Stock</span>
                )}
              </div>

              <button
                disabled={sweet.quantity < 1}
                onClick={() => handleAddToCart(sweet.id)}
              >
                {sweet.quantity < 1 ? "❌ Out of Stock" : "🛒 Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
