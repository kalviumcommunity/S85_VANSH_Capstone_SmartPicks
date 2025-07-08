import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faList, faCogs, faBell, faChartPie, faSearch, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

const sidebarLinks = [
  { label: 'Add Product', icon: faPlus, action: () => window.location.href = '/addproduct' },
  { label: 'View Products', icon: faList, action: (ref) => ref && ref.current && ref.current.scrollIntoView({ behavior: 'smooth' }) },
  { label: 'Analytics', icon: faChartPie, action: null, soon: true },
  { label: 'Notifications', icon: faBell, action: null, soon: true },
  { label: 'Settings', icon: faCogs, action: null, soon: true },
];

const Profile = () => {
  const [products, setProducts] = useState([]);
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const productsSectionRef = React.useRef(null);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle edit form changes
  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditForm({
      productName: product.productName,
      description: product.description,
      productCategory: product.productCategory,
      stocks: product.stocks,
      color: product.color || '',
      usp: product.usp || ''
    });
    setShowEditModal(true);
  };

  // Handle save edited product
  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('startupToken');
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/products/edit/${editingProduct._id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the product in the local state
      setProducts(prev => prev.map(p => 
        p._id === editingProduct._id ? { ...p, ...editForm } : p
      ));
      
      setShowEditModal(false);
      setEditingProduct(null);
      setEditForm({});
      alert('Product updated successfully!');
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    setEditForm({});
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('startupToken');
        if (!token) {
          setError('Not authenticated.');
          setLoading(false);
          return;
        }
        const decoded = jwtDecode(token);
        const startupId = decoded.StartupId;
        // Fetch startup details
        const startupRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/startups/profile/${startupId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStartup(startupRes.data.startup);
        // Fetch products for this startup
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/products/bystartup/${startupId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProducts(res.data.products || []);
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare chart data (products added per month)
  const chartData = (() => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const counts = Array(12).fill(0);
    products.forEach((p) => {
      const d = new Date(p.createdAt);
      counts[d.getMonth()]++;
    });
    return months.map((m, i) => ({ month: m, products: counts[i] }));
  })();

  // Stats
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stocks || 0), 0);
  const uniqueCategories = new Set(products.map((p) => p.productCategory)).size;

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    setDeleting(productId);
    try {
      const token = localStorage.getItem('startupToken');
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/products/delete/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert('Failed to delete product.');
    } finally {
      setDeleting('');
    }
  };

  // Sidebar animation variants
  const sidebarVariants = {
    hidden: { x: -120, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 60, damping: 18, staggerChildren: 0.08 } },
  };
  const linkVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen w-full flex bg-[#10182a] text-white">
      {/* Animated Glassy Sidebar */}
      <motion.aside
        className="fixed top-0 left-0 z-30 h-screen w-24 md:w-72 bg-white/10 backdrop-blur-2xl rounded-none md:rounded-tr-3xl md:rounded-br-3xl shadow-2xl flex flex-col items-center py-8 px-2 md:px-4 border border-cyan-400/20"
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
        {/* Animated Startup Logo */}
        {startup && (
          <motion.div
            className="mb-6 flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-cyan-300 bg-white/20 shadow-lg"
            whileHover={{ scale: 1.08, rotate: 6, boxShadow: '0 0 32px 0 #22d3ee88' }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <motion.img
              src={startup.StartupLogo}
              alt={startup.StartupName}
              className="object-cover w-full h-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            />
          </motion.div>
        )}
        {/* Welcome message */}
        {startup && (
          <motion.div
            className="text-xl font-bold text-white/90 mb-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Welcome,<br />
            <span className="text-cyan-300">{startup.StartupName}</span>
          </motion.div>
        )}
        {/* Sidebar Links */}
        <motion.nav className="flex flex-col gap-4 w-full mt-2" initial="hidden" animate="visible" variants={sidebarVariants}>
          {sidebarLinks.map((link, idx) => (
            <motion.button
              key={link.label}
              onClick={() => link.action && link.action(idx === 1 ? productsSectionRef : undefined)}
              className={`flex items-center gap-4 w-full px-6 py-4 rounded-2xl font-semibold text-lg bg-white/10 hover:bg-cyan-400/20 text-white/90 shadow-md transition-all duration-200 focus:outline-none relative ${link.soon ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
              style={{ fontFamily: 'Poppins', backdropFilter: 'blur(8px)' }}
              disabled={!link.action}
              variants={linkVariants}
              whileHover={!link.soon ? { scale: 1.07, boxShadow: '0 0 24px 0 #22d3ee55' } : {}}
            >
              <FontAwesomeIcon icon={link.icon} className="text-2xl" />
              {link.label}
              {link.soon && (
                <span className="ml-3 px-2 py-1 rounded-full bg-cyan-400/30 text-xs text-cyan-100 font-bold animate-pulse">SOON</span>
              )}
            </motion.button>
          ))}
        </motion.nav>
      </motion.aside>

      {/* Main Content (with left margin for sidebar) */}
      <main className="flex-1 pl-80 pr-10 py-10 bg-[#10182a] min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Startup Details at the top */}
          {startup && (
            <motion.div className="rounded-2xl bg-[#1a2236] p-8 mb-10 shadow-xl flex flex-col md:flex-row items-center gap-8 border border-cyan-400/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <img src={startup.StartupLogo} alt={startup.StartupName} className="w-28 h-28 object-cover rounded-2xl border-4 border-cyan-300 shadow-lg" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-cyan-200 mb-2">{startup.StartupName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/90 text-base">
                  <div><span className="font-semibold text-cyan-300">Type:</span> {startup.StartupType}</div>
                  <div><span className="font-semibold text-cyan-300">Email:</span> {startup.StartupEmail}</div>
                  {startup.StartupUSP && <div><span className="font-semibold text-cyan-100">USP:</span> {startup.StartupUSP}</div>}
                  {startup.StartupOrigin && <div><span className="font-semibold text-cyan-100">Origin:</span> {startup.StartupOrigin}</div>}
                  {startup.StartupFounderEmail && <div><span className="font-semibold text-cyan-100">Founder Email:</span> {startup.StartupFounderEmail}</div>}
                  {startup.StartupWebsiteLink && <div><span className="font-semibold text-cyan-100">Website:</span> <a href={startup.StartupWebsiteLink} className="underline text-cyan-200" target="_blank" rel="noopener noreferrer">{startup.StartupWebsiteLink}</a></div>}
                  {startup.StartupInstaLink && <div><span className="font-semibold text-cyan-100">Instagram:</span> <a href={startup.StartupInstaLink} className="underline text-cyan-200" target="_blank" rel="noopener noreferrer">{startup.StartupInstaLink}</a></div>}
                  <div><span className="font-semibold text-cyan-100">Startup ID:</span> {startup.StartupId}</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <motion.div className="rounded-2xl p-8 flex flex-col items-center bg-gradient-to-br from-cyan-400/60 to-blue-800/80 shadow-xl border border-cyan-400/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-4xl font-bold mb-2">{totalProducts}</span>
              <span className="uppercase text-sm tracking-widest">Products</span>
            </motion.div>
            <motion.div className="rounded-2xl p-8 flex flex-col items-center bg-gradient-to-br from-blue-400/60 to-cyan-800/80 shadow-xl border border-cyan-400/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-4xl font-bold mb-2">{totalStock}</span>
              <span className="uppercase text-sm tracking-widest">Total Stock</span>
            </motion.div>
            <motion.div className="rounded-2xl p-8 flex flex-col items-center bg-gradient-to-br from-cyan-200/60 to-blue-600/80 shadow-xl border border-cyan-400/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-4xl font-bold mb-2">{uniqueCategories}</span>
              <span className="uppercase text-sm tracking-widest">Categories</span>
            </motion.div>
          </div>

          {/* Chart */}
          <div className="bg-[#1a2236] rounded-2xl p-8 mb-10 shadow-xl border border-cyan-400/10">
            <h2 className="text-lg font-bold mb-4 text-cyan-200">Products Added Per Month</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#aeb8fe" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#aeb8fe" fontSize={12} />
                <YAxis stroke="#aeb8fe" fontSize={12} allowDecimals={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#2e335a" />
                <Tooltip contentStyle={{ background: '#232946', border: 'none', color: '#fff' }} />
                <Area type="monotone" dataKey="products" stroke="#22d3ee" fillOpacity={1} fill="url(#colorProd)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Product List with Search */}
          <motion.div ref={productsSectionRef} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-200">Your Products</h2>
              
              {/* Search Bar */}
              <div className="relative mt-4 md:mt-0">
                <div className="flex items-center bg-[#1a2236] rounded-xl px-4 py-2 border border-cyan-400/20">
                  <FontAwesomeIcon icon={faSearch} className="text-cyan-300 mr-3" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent outline-none text-white placeholder-white/60 w-64"
                  />
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <motion.div className="text-center text-white/60 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {searchTerm ? 'No products found matching your search.' : 'No products found for your startup.'}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProducts.map((product, idx) => (
                  <motion.div
                    key={product._id}
                    className="rounded-2xl bg-[#1a2236] p-6 flex flex-col md:flex-row items-center gap-6 shadow-lg border border-cyan-400/10"
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.08, duration: 0.5, type: 'spring' }}
                  >
                    <img src={product.productImage} alt={product.productName} className="w-24 h-24 object-cover rounded-xl border-2 border-cyan-300 shadow-md" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-cyan-200 mb-1">{product.productName}</h3>
                      <p className="text-white/80 mb-2">{product.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-cyan-400/30 px-3 py-1 rounded-full text-xs">Category: {product.productCategory}</span>
                        <span className="bg-cyan-200/30 px-3 py-1 rounded-full text-xs">Stocks: {product.stocks}</span>
                        {product.color && <span className="bg-blue-400/30 px-3 py-1 rounded-full text-xs">Color: {product.color}</span>}
                        {product.usp && <span className="bg-blue-200/30 px-3 py-1 rounded-full text-xs">USP: {product.usp}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: '#22d3ee', color: '#fff' }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-xl font-bold text-cyan-200 border-2 border-cyan-400 bg-[#232946] shadow-lg transition-all duration-200"
                        onClick={() => handleEditProduct(product)}
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: '#ef4444', color: '#fff' }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-xl font-bold text-red-300 border-2 border-red-400 bg-[#232946] shadow-lg transition-all duration-200"
                        disabled={deleting === product._id}
                        onClick={() => handleDelete(product._id)}
                      >
                        {deleting === product._id ? 'Deleting...' : 'Delete'}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1a2236] rounded-2xl p-8 max-w-md w-full border border-cyan-400/20 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-cyan-200">Edit Product</h3>
                <button
                  onClick={handleCancelEdit}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-cyan-200 text-sm font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    value={editForm.productName || ''}
                    onChange={(e) => handleEditFormChange('productName', e.target.value)}
                    className="w-full px-4 py-2 bg-[#232946] border border-cyan-400/20 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-cyan-200 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => handleEditFormChange('description', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 bg-[#232946] border border-cyan-400/20 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">Category</label>
                    <input
                      type="text"
                      value={editForm.productCategory || ''}
                      onChange={(e) => handleEditFormChange('productCategory', e.target.value)}
                      className="w-full px-4 py-2 bg-[#232946] border border-cyan-400/20 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">Stocks</label>
                    <input
                      type="number"
                      value={editForm.stocks || ''}
                      onChange={(e) => handleEditFormChange('stocks', parseInt(e.target.value))}
                      className="w-full px-4 py-2 bg-[#232946] border border-cyan-400/20 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">Color</label>
                    <input
                      type="text"
                      value={editForm.color || ''}
                      onChange={(e) => handleEditFormChange('color', e.target.value)}
                      className="w-full px-4 py-2 bg-[#232946] border border-cyan-400/20 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-200 text-sm font-medium mb-2">USP</label>
                    <input
                      type="text"
                      value={editForm.usp || ''}
                      onChange={(e) => handleEditFormChange('usp', e.target.value)}
                      className="w-full px-4 py-2 bg-[#232946] border border-cyan-400/20 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 border border-cyan-400/20 text-cyan-200 rounded-xl hover:bg-cyan-400/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-cyan-400 text-white rounded-xl hover:bg-cyan-500 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile; 