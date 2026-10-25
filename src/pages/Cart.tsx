import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const products = [
  { id: 'p1', name: 'Premium Dog Food', price: 2500, stock: 10 },
  { id: 'p2', name: 'Cat Treats', price: 450, stock: 25 },
  { id: 'p3', name: 'Chew Toy', price: 350, stock: 15 },
  { id: 'p4', name: 'Grooming Brush', price: 800, stock: 12 },
  { id: 'p5', name: 'Pet Collar', price: 650, stock: 20 },
  { id: 'p6', name: 'Vitamin Supplements', price: 1200, stock: 8 },
];

export default function Cart() {
  const { data, updateCartQuantity, removeFromCart, addOrder } = useApp();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', city: '', pincode: '' });

  const cartItems = data.cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product!.price * item.quantity), 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill all required fields');
      return;
    }
    addOrder({ items: data.cart, total: subtotal, shippingDetails: formData });
    alert('Order placed successfully! (Demo order - no payment processed)');
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Shopping Cart</h1>
        </div>
        <div className="card empty-state">
          <ShoppingBag size={48} />
          <h3>Your cart is empty</h3>
          <p>Add some products from the shop</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Shopping Cart</h1>
        <p>{cartItems.length} items in cart</p>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        <div>
          {cartItems.map(item => (
            <div key={item.productId} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{item.product!.name}</h3>
                <p style={{ color: 'var(--brand-primary)', fontWeight: '600' }}>₹{item.product!.price}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button className="btn btn-secondary" style={{ padding: '0.375rem' }} onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}>
                  <Minus size={16} />
                </button>
                <span style={{ minWidth: '40px', textAlign: 'center' }}>{item.quantity}</span>
                <button className="btn btn-secondary" style={{ padding: '0.375rem' }} onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>
              <div style={{ fontWeight: '600', minWidth: '80px', textAlign: 'right' }}>₹{item.product!.price * item.quantity}</div>
              <button className="btn btn-danger" style={{ padding: '0.375rem' }} onClick={() => removeFromCart(item.productId)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="card-title" style={{ marginBottom: '1rem' }}>Order Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: '600' }}>
            <span>Total</span>
            <span>₹{subtotal}</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowCheckout(true)}>
            Proceed to Checkout
          </button>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>Demo checkout - no payment required</p>
        </div>
      </div>

      {showCheckout && (
        <div className="modal-overlay" onClick={() => setShowCheckout(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Checkout (Demo)</h2>
              <button className="btn btn-secondary" onClick={() => setShowCheckout(false)}>✕</button>
            </div>
            <form onSubmit={handleCheckout}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input type="tel" className="form-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Address *</label>
                  <textarea className="form-textarea" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required></textarea>
                </div>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input type="text" className="form-input" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input type="text" className="form-input" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} required />
                  </div>
                </div>
                <div style={{ padding: '0.75rem', background: '#fff3cd', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
                  <strong>Order Total: ₹{subtotal}</strong><br/>
                  <span style={{ color: '#856404' }}>No real payment will be processed. This is a demo.</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCheckout(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Place Order (Demo)</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
