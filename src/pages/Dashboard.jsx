import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Package, Clock, AlertTriangle, CheckCircle, UploadCloud, ChevronDown, ChevronUp, FileText, File } from 'lucide-react';
import './Dashboard.css';

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

// Upload Area Component
const UploadArea = ({ onProcessComplete }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.type === 'application/json' || droppedFile.name.endsWith('.csv')) {
         setFile(droppedFile);
      } else {
         alert("Only PDF, JSON, and CSV files are supported currently.");
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcessFile = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:5000/process-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        if (onProcessComplete) {
           onProcessComplete(result);
        }
        setFile(null); // Reset after success
      } else {
        alert("Failed to process orders: " + (result.error || "Unknown error"));
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      alert("Error connecting to backend server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const getFileIcon = () => {
    if (!file) return null;
    if (file.type === 'application/pdf') return <FileText size={48} className="text-red-400 mb-4 mx-auto" />;
    if (file.type === 'application/json') return <File size={48} className="text-yellow-400 mb-4 mx-auto" />;
    return <File size={48} className="text-blue-400 mb-4 mx-auto" />;
  };

  return (
    <div className="glass-card p-6 upload-section">
      <h3 className="section-title-sm mb-4">Upload Orders</h3>
      <div 
        className={`drag-area ${isDragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="drag-content">
          {!file && <UploadCloud size={48} className="upload-icon mb-4" />}
          {file ? (
            <div className="file-info text-center w-full">
              {getFileIcon()}
              <p className="font-semibold text-primary truncate overflow-hidden max-w-[250px] mx-auto">{file.name}</p>
              <p className="text-secondary text-sm mt-1">{formatBytes(file.size)}</p>
              
              {isProcessing ? (
                <div className="loading-container mt-6 flex flex-col items-center">
                   <div className="processing-spinner"></div>
                   <p className="text-secondary mt-3">AI Analyzing Document...</p>
                </div>
              ) : (
                <div className="flex gap-2 mt-4 justify-center">
                  <button className="btn btn-secondary glass flex-1" onClick={() => setFile(null)}>Cancel</button>
                  <button className="btn btn-primary flex-1" onClick={handleProcessFile}>Process File</button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="font-semibold text-lg">Drag & Drop order file here</p>
              <p className="text-secondary mt-2">PDF, JSON, or CSV (max 50MB)</p>
              <label className="btn btn-secondary glass mt-4 cursor-pointer">
                Browse Files
                <input type="file" className="hidden-input" accept=".pdf,.json,.csv" onChange={handleFileSelect} />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Orders Result Component
const OrderResults = ({ data }) => {
  const ordersToDisplay = (data && data.orders && data.orders.length > 0) ? data.orders : [];

  const [expandedId, setExpandedId] = useState(null);

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    const statusClasses = {
      processing: 'badge-info',
      completed: 'badge-success',
      attention: 'badge-danger'
    };
    const badgeClass = statusClasses[s] || 'badge-primary';
    
    return (
      <span className={`badge ${badgeClass}`}>
        {(status || 'processing').toUpperCase()}
      </span>
    );
  };

  return (
    <div className="glass-card p-6 results-section">
      <div className="flex justify-between items-center mb-6">
        <h3 className="section-title-sm">Recent Processing Results</h3>
        <button className="btn text-sm">View All</button>
      </div>
      
      <div className="orders-list">
        {ordersToDisplay.map((order, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`order-item glass ${expandedId === idx ? 'expanded' : ''}`}
          >
            <div 
              className="order-header" 
              onClick={() => setExpandedId(expandedId === idx ? null : idx)}
            >
              <div className="order-info">
                <span className="order-id font-mono text-primary">{order.order_id}</span>
                <span className="order-customer">{order.company}</span>
              </div>
              <div className="order-meta">
                <span className="order-total">{order.price || '$0.00'}</span>
                {getStatusBadge(order.status || 'processing')}
                {expandedId === idx ? <ChevronUp size={20} className="text-secondary" /> : <ChevronDown size={20} className="text-secondary" />}
              </div>
            </div>
            
            {expandedId === idx && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="order-details"
              >
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Product / Items</span>
                    <span className="detail-value">{order.product || '-'} ({order.quantity || '0'})</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Urgency Level</span>
                    <span className={`urgency-dot ${(order.urgency || 'normal').toLowerCase()}`}>{order.urgency || 'normal'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Weight</span>
                    <span className="detail-value">{order.weight || '-'}</span>
                  </div>
                </div>
                {order.status && order.status.toLowerCase() === 'attention' && (
                  <div className="alert-box mt-4">
                    <AlertTriangle size={16} />
                    <span>Inventory shortage for SKU-992. Waiting on supervisor override.</span>
                  </div>
                )}
                <div className="details-actions mt-4">
                  <button className="btn btn-secondary glass btn-sm">View Invoice</button>
                  <button className="btn btn-primary btn-sm">Manage Rules</button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [processedData, setProcessedData] = useState(null);

  const metrics = [
    { title: "Total Orders Processed", value: processedData?.orders?.length ? 124892 + processedData.orders.length : 124892, icon: <Package className="text-blue-500" />, color: "blue" },
    { title: "Processing Rate", value: 450, suffix: "/min", icon: <Clock className="text-green-500" />, color: "green" },
    { title: "Needs Attention", value: processedData?.issues?.length || 12, icon: <AlertTriangle className="text-red-500" />, color: "red" },
    { title: "Success Rate", value: 99.8, suffix: "%", icon: <CheckCircle className="text-emerald-500" />, color: "emerald" },
  ];

  return (
    <div className="dashboard-container">
      <div className="container dashboard-content">
        <header className="dashboard-header mb-8 mt-4">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold"
          >
            Operations <span className="text-gradient">Dashboard</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-secondary mt-2"
          >
            Real-time fulfillment and inventory monitoring.
          </motion.p>
        </header>

        {/* Metrics Row */}
        <div className="metrics-grid mb-8">
          {metrics.map((metric, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-card p-6 metric-card border-top-${metric.color}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-secondary font-medium">{metric.title}</span>
                <div className={`icon-container bg-${metric.color}-dim`}>
                  {metric.icon}
                </div>
              </div>
              <div className="metric-value-container flex items-baseline gap-1">
                <span className="metric-value text-3xl font-bold font-mono">
                  <AnimatedCounter value={metric.value} />
                </span>
                {metric.suffix && <span className="text-secondary font-medium">{metric.suffix}</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-main-grid">
          <div className="grid-left">
            <UploadArea onProcessComplete={(data) => setProcessedData(prev => ({
              success: true,
              orders: [...(data?.orders || []), ...(prev?.orders || [])]
            }))} />
          </div>
          <div className="grid-right">
            <OrderResults data={processedData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
