import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faList, faCogs, faBell, faChartPie } from '@fortawesome/free-solid-svg-icons';

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
  const productsSectionRef = React.useRef(null);

  
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

          {/* Product List */}
          <motion.h2 ref={productsSectionRef} className="text-2xl font-bold mb-6 mt-10 text-cyan-200" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            Your Products
          </motion.h2>
          {products.length === 0 ? (
            <motion.div className="text-center text-white/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              No products found for your startup.
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map((product, idx) => (
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
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: '#22d3ee', color: '#fff' }}
                    whileTap={{ scale: 0.95 }}
                    className="ml-2 px-5 py-2 rounded-xl font-bold text-cyan-200 border-2 border-cyan-400 bg-[#232946] shadow-lg transition-all duration-200 z-20"
                    disabled={deleting === product._id}
                    onClick={() => handleDelete(product._id)}
                  >
                    {deleting === product._id ? 'Deleting...' : 'Delete'}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile; 