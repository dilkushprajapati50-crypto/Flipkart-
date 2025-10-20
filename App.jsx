
import React, { useEffect, useState } from 'react';

// Single-file React + Tailwind e‑commerce scaffold (Updated)
// भाषा: हिंदी UI और निर्देश

export default function App() {
  const initialProducts = [
    {
      id: 'shoe-nike-001',
      title: 'Running Shoes (Size: 8-11)',
      brand: 'Branded Shoes',
      desc: 'हाई-कंफर्ट running shoes, breathable mesh, rubber sole.',
      price: 3799,
      img: 'https://via.placeholder.com/600x600?text=Running+Shoes',
      stock: 25,
    },
    {
      id: 'watch-omega-001',
      title: 'Classic Analog Watch',
      brand: 'Branded Watches',
      desc: 'स्टेनलेस स्टील, 2 साल वारंटियों जैसा विवरण (demo).',
      price: 12499,
      img: 'https://via.placeholder.com/600x600?text=Analog+Watch',
      stock: 12,
    },
    {
      id: 'mobile-x-128',
      title: 'Smartphone X - 128GB',
      brand: 'Branded Mobiles',
      desc: '6.6" display, 128GB, dual camera - demo listing.',
      price: 17999,
      img: 'https://via.placeholder.com/600x600?text=Smartphone+X',
      stock: 7,
    },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [checkout, setCheckout] = useState({ name: '', phone: '', address: '' });
  const [order, setOrder] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  function addToCart(p) {
    setCart((prev) => {
      const curr = prev[p.id] ? { ...prev[p.id] } : { ...p, qty: 0 };
      if (curr.qty + 1 > p.stock) return prev;
      curr.qty += 1;
      return { ...prev, [p.id]: curr };
    });
  }

  function changeQty(id, qty) {
    setCart((prev) => {
      const copy = { ...prev };
      if (qty <= 0) {
        delete copy[id];
      } else {
        copy[id].qty = qty;
      }
      return copy;
    });
  }

  function total() {
    return Object.values(cart).reduce((s, it) => s + it.price * it.qty, 0);
  }

  async function placeOrderDemo() {
    if (!checkout.name || !checkout.phone || !checkout.address) {
      alert('कृपया पूरा नाम, मोबाइल और पता भरें');
      return;
    }
    const newOrder = {
      id: 'DEMO-' + Date.now(),
      items: Object.values(cart),
      total: total(),
      info: checkout,
      status: 'Placed (Demo)',
      date: new Date().toISOString(),
    };
    setOrder(newOrder);
    setCart({});
    setShowCart(false);
  }

  function tryAdmin() {
    if (adminPass === 'admin123') {
      setIsAdminMode(true);
      alert('Admin मोड चालू');
    } else {
      alert('गलत पासवर्ड (demo)');
    }
  }

  function updateStock(id, newStock) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: Number(newStock) } : p)));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dilkush Shop</h1>
            <div className="text-sm text-gray-500">Shoes · Watches · Mobiles</div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCart((s) => !s)}
              className="px-3 py-2 border rounded hover:bg-gray-100"
            >
              Cart ({Object.values(cart).reduce((n, it) => n + it.qty, 0)})
            </button>
            <button
              onClick={() => { window.scrollTo(0, 0); setIsAdminMode(false); setAdminPass(''); }}
              className="px-3 py-2 border rounded hover:bg-gray-100 text-sm"
            >
              Home
            </button>
            <button
              onClick={() => {
                const pass = prompt('Admin पासवर्ड डालें (demo)');
                if (pass) {
                  setAdminPass(pass);
                  tryAdmin();
                }
              }}
              className="px-3 py-2 border rounded hover:bg-gray-100 text-sm"
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <section className="bg-white rounded p-6 mb-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-semibold">Branded Products — भरोसे के साथ</h2>
            <p className="mt-2 text-gray-600">हमारी साइट पर आप shoes, watches और mobiles पा सकते हैं। (Demo listing)</p>
          </div>
          <div>
            <img src="https://via.placeholder.com/420x200?text=Shop+Banner" alt="banner" className="rounded" />
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded p-4 shadow-sm flex flex-col">
              <img src={p.img} alt={p.title} className="h-56 w-full object-cover rounded" />
              <h3 className="mt-3 font-semibold">{p.title}</h3>
              <div className="text-sm text-gray-600">{p.desc}</div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">₹{p.price.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-gray-500">Stock: {p.stock}</div>
                </div>
                <div>
                  <button
                    onClick={() => addToCart(p)}
                    disabled={p.stock === 0}
                    className="px-4 py-2 rounded border hover:bg-gray-100"
                  >
                    Add
                  </button>
                </div>
              </div>

              {isAdminMode && (
                <div className="mt-3 border-t pt-2">
                  <div className="text-sm font-medium">Admin: Update Stock</div>
                  <input
                    type="number"
                    defaultValue={p.stock}
                    onBlur={(e) => updateStock(p.id, e.target.value)}
                    className="w-32 rounded border p-1 mt-2"
                  />
                </div>
              )}
            </div>
          ))}
        </section>

        {showCart && (
          <div className="fixed right-6 top-20 w-96 bg-white rounded shadow-lg p-4 z-50">
            <h4 className="font-semibold">आपका Cart</h4>
            <div className="mt-3 space-y-3 max-h-64 overflow-auto">
              {Object.values(cart).length === 0 && <div className="text-gray-600">Cart खाली है।</div>}
              {Object.values(cart).map((it) => (
                <div key={it.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{it.title}</div>
                    <div className="text-sm text-gray-500">₹{it.price.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={it.qty}
                      min={0}
                      max={it.stock}
                      onChange={(e) => changeQty(it.id, Number(e.target.value))}
                      className="w-16 rounded border p-1"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Total</div>
                <div className="font-bold">₹{total().toLocaleString('en-IN')}</div>
              </div>

              <div className="mt-3">
                <input
                  placeholder="पूरा नाम"
                  value={checkout.name}
                  onChange={(e) => setCheckout((s) => ({ ...s, name: e.target.value }))}
                  className="w-full rounded border p-2 mt-2"
                />
                <input
                  placeholder="मोबाइल नंबर"
                  value={checkout.phone}
                  onChange={(e) => setCheckout((s) => ({ ...s, phone: e.target.value }))}
                  className="w-full rounded border p-2 mt-2"
                />
                <textarea
                  placeholder="पूरा पता"
                  value={checkout.address}
                  onChange={(e) => setCheckout((s) => ({ ...s, address: e.target.value }))}
                  className="w-full rounded border p-2 mt-2"
                />
              </div>

              <div className="mt-3 flex gap-2">
                <button onClick={placeOrderDemo} className="flex-1 px-4 py-2 rounded bg-blue-600 text-white">
                  Place Order (Demo)
                </button>
                <button onClick={() => setShowCart(false)} className="px-4 py-2 rounded border">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {order && (
          <section className="mt-6 bg-white p-4 rounded shadow-sm">
            <h4 className="font-semibold">ऑर्डर पक्का हुआ (Demo)</h4>
            <p className="text-sm text-gray-600 mt-2">Order ID: {order.id}</p>
            <p className="text-sm">Total: ₹{order.total.toLocaleString('en-IN')}</p>
            <p className="text-sm mt-2">Status: {order.status}</p>
          </section>
        )}

        <footer className="mt-10 text-center text-sm text-gray-500">
          <div>© {new Date().getFullYear()} Dilkush Shop</div>
          <div className="mt-2">नोट: ब्रांडेड प्रोडक्ट बेचने के लिए authorized reseller agreement और authenticity जरूरी है।</div>
        </footer>
      </main>
    </div>
  );
}
