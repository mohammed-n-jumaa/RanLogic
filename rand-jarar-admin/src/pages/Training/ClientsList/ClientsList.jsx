import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  ChevronLeft,
  Download,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import ClientCard from '../../../components/Training/ClientCard';
import AddClientModal from '../../../components/Training/AddClientModal';
import trainingApi from '../../../api/trainingApi';
import notify from '../../../lib/notify';
import './ClientsList.scss';
import { t } from '../../../i18n';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('active');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClients, setSelectedClients] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  useEffect(() => {
    fetchClients();
  }, []);
  
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await trainingApi.getAllTrainees();
      if (response.data.success) {
        setClients(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      notify.fire({
        icon: 'error',
        title: t('خطأ'),
        text: t('حدث خطأ أثناء جلب البيانات'),
        confirmButtonText: t('حسناً'),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddClient = async (formData) => {
    try {
      console.log('handleAddClient called');
      console.log('Editing client:', editingClient);
      
      let response;
      
      if (editingClient) {
        console.log('Updating client with ID:', editingClient.id);
        
        // Update existing client - use POST with _method=PUT for FormData
        response = await trainingApi.updateTrainee(editingClient.id, formData);
        
        console.log('Update response:', response);
        
        if (response.data.success) {
          // Refresh the clients list to get updated data
          await fetchClients();
          
          // Close modal first
          setIsModalOpen(false);
          setEditingClient(null);
          
          // Then show success message
          notify.fire({
            icon: 'success',
            title: t('تم التحديث'),
            text: t('تم تحديث بيانات المتدرب بنجاح'),
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } else {
        console.log('Creating new client');
        
        // Create new client
        response = await trainingApi.createTrainee(formData);
        
        console.log('Create response:', response);
        
        if (response.data.success) {
          // Refresh the clients list to get new data
          await fetchClients();
          
          // Close modal first
          setIsModalOpen(false);
          
          // Then show success message
          notify.fire({
            icon: 'success',
            title: t('تمت الإضافة'),
            text: t('تم إضافة المتدرب بنجاح'),
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
      
    } catch (error) {
      console.error('Error saving client:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = t('حدث خطأ أثناء الحفظ');
      
      if (error.response?.status === 422) {
        // Validation error
        const errors = error.response.data.errors;
        if (errors) {
          const errorMessages = Object.values(errors).flat();
          errorMessage = errorMessages.join('\n');
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      // Show error after modal interaction
      setTimeout(() => {
        notify.fire({
          icon: 'error',
          title: t('خطأ'),
          text: errorMessage,
          confirmButtonText: t('حسناً'),
        });
      }, 100);
    }
  };
  
  const handleEditClient = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };
  
  const handleDeleteClient = async (id) => {
    const result = await notify.fire({
      title: t('هل أنت متأكد؟'),
      text: t('سيتم حذف جميع البيانات المرتبطة بهذا المتدرب'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e91e63',
      cancelButtonColor: '#6c757d',
      confirmButtonText: t('نعم، احذف'),
      cancelButtonText: t('إلغاء'),
    });
    
    if (result.isConfirmed) {
      try {
        const response = await trainingApi.deleteTrainee(id);
        
        if (response.data.success) {
          setClients(clients.filter(c => c.id !== id));
          
          notify.fire({
            icon: 'success',
            title: t('تم الحذف'),
            text: t('تم حذف المتدرب بنجاح'),
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error('Error deleting client:', error);
        notify.fire({
          icon: 'error',
          title: t('خطأ'),
          text: error.response?.data?.message || t('حدث خطأ أثناء الحذف'),
          confirmButtonText: t('حسناً'),
        });
      }
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };
  
  const handleSelectClient = (id) => {
    setSelectedClients(prev => 
      prev.includes(id) 
        ? prev.filter(clientId => clientId !== id)
        : [...prev, id]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(client => client.id));
    }
  };
  
  const handleBulkDelete = () => {
    if (selectedClients.length === 0) return;
    
    notify.fire({
      title: t('حذف متعدد'),
      text: t('هل تريد حذف {0} متدرب؟', selectedClients.length),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('نعم، احذف'),
      cancelButtonText: t('إلغاء'),
    }).then((result) => {
      if (result.isConfirmed) {
        selectedClients.forEach(id => handleDeleteClient(id));
        setSelectedClients([]);
      }
    });
  };
  
  const handleExportData = () => {
    notify.fire({
      icon: 'success',
      title: t('تم التصدير'),
      text: t('سيتم تحميل الملف خلال ثوانٍ'),
      timer: 2000,
      showConfirmButton: false,
    });
  };
  
  const filteredClients = clients.filter(client => {
  const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       client.phone?.includes(searchTerm);

  const getStatus = () => {
    if (!client.subscription_start_date || !client.subscription_end_date) return 'pending';
    return new Date(client.subscription_end_date) < new Date() ? 'expired' : 'active';
  };

  const matchesFilter = filterStatus === 'all' || getStatus() === filterStatus;
  return matchesSearch && matchesFilter;
});
  
  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      case 'oldest':
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      default:
        return 0;
    }
  });
  
  const stats = {
    total: clients.length,
    active: clients.filter(c => {
      if (!c.subscription_end_date) return false;
      return new Date(c.subscription_end_date) >= new Date();
    }).length,
    expired: clients.filter(c => {
      if (!c.subscription_end_date) return false;
      return new Date(c.subscription_end_date) < new Date();
    }).length,
    pending: clients.filter(c => !c.subscription_start_date || !c.subscription_end_date).length
  };
  
  if (isLoading) {
    return (
      <div className="clients-list__loading">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="loading-container"
        >
          <Loader className="spinner" size={40} />
          <p>{t('جاري تحميل البيانات...')}</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="clients-list">
      {/* Header Section */}
      <div className="clients-list__header">
        <div className="container">
          <div className="header-content">
            <div className="title-section">
              <div className="breadcrumb">
                <ChevronLeft size={16} />
                <span>{t('لوحة التحكم')}</span>
                <span className="separator">/</span>
                <span className="active">{t('إدارة المتدربين')}</span>
              </div>
              <h1 className="title">
                <Users className="title-icon" size={28} />
                {t('إدارة المتدربين')}
              </h1>
              <p className="subtitle">
                {t('قم بإدارة جميع بيانات المتدربين والبرامج التدريبية')}
              </p>
            </div>
            
            <div className="header-actions">
            
              
              <motion.button
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={18} />
                <span>{t('إضافة متدرب')}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="container">
        <motion.div
          className="stats-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-card">
            <div className="stat-icon stat-primary">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">{t('إجمالي المتدربين')}</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-trend positive">
                <span>{t('+12% عن الشهر الماضي')}</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon stat-success">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">{t('نشط')}</div>
              <div className="stat-value">{stats.active}</div>
              <div className="stat-percentage">
                <span>{clients.length > 0 ? Math.round((stats.active / clients.length) * 100) : 0}%</span>
              </div>
            </div>
            <div className="stat-progress">
              <div 
                className="progress-bar success" 
                style={{ width: `${clients.length > 0 ? (stats.active / clients.length) * 100 : 0}%` }}
              />
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon stat-danger">
              <XCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">{t('منتهي')}</div>
              <div className="stat-value">{stats.expired}</div>
              <div className="stat-percentage">
                <span>{clients.length > 0 ? Math.round((stats.expired / clients.length) * 100) : 0}%</span>
              </div>
            </div>
            <div className="stat-progress">
              <div 
                className="progress-bar danger" 
                style={{ width: `${clients.length > 0 ? (stats.expired / clients.length) * 100 : 0}%` }}
              />
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon stat-warning">
              <AlertCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-label">{t('معلّق')}</div>
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-percentage">
                <span>{clients.length > 0 ? Math.round((stats.pending / clients.length) * 100) : 0}%</span>
              </div>
            </div>
            <div className="stat-progress">
              <div 
                className="progress-bar warning" 
                style={{ width: `${clients.length > 0 ? (stats.pending / clients.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Action Bar */}
      <div className="container">
        <motion.div
          className="action-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {selectedClients.length > 0 ? (
            <div className="selected-info">
              <span className="selected-count">{selectedClients.length} {t('عنصر محدد')}</span>
              <button 
                className="btn-clear"
                onClick={() => setSelectedClients([])}
              >
                {t('إلغاء التحديد')}
              </button>
              <button 
                className="btn-delete-bulk"
                onClick={handleBulkDelete}
              >
                <ChevronDown size={16} />
                <span>{t('حذف المحدد')}</span>
              </button>
            </div>
          ) : (
            <div className="refresh-wrapper">
              <button 
                className="btn-action refresh"
                onClick={fetchClients}
                title={t('تحديث البيانات')}
              >
                <RefreshCw size={18} />
                <span>{t('تحديث')}</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Search and Filters */}
      <div className="container">
        <motion.div
          className="search-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="search-wrapper">
            <div className="search-box">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder={t('ابحث عن متدرب...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>
            
            <div className="filters-wrapper">
              <button 
                className="btn-filters-toggle"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              >
                <Filter size={18} />
                <span>{t('تصفية')}</span>
                <ChevronDown className={`chevron ${isFiltersOpen ? 'open' : ''}`} size={16} />
              </button>
              
              {isFiltersOpen && (
                <motion.div 
                  className="filters-dropdown"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="filter-group">
                    <div className="filter-box">
                      <label>{t('حالة المتدرب:')}</label>
                      <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">{t('جميع الحالات')}</option>
                        <option value="active">{t('نشط')}</option>
                        <option value="expired">{t('منتهي')}</option>
                        <option value="pending">{t('معلق')}</option>
                      </select>
                    </div>
                    
                    <div className="filter-box">
                      <label>{t('ترتيب حسب:')}</label>
                      <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="newest">{t('الأحدث أولاً')}</option>
                        <option value="oldest">{t('الأقدم أولاً')}</option>
                        <option value="name">{t('حسب الاسم')}</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="results-info">
            <span className="results-count">
              {t('عرض')} {sortedClients.length} {t('من')} {clients.length} {t('متدرب')}
            </span>
            {sortedClients.length > 0 && (
              <button 
                className="btn-select-all"
                onClick={handleSelectAll}
              >
                {selectedClients.length === filteredClients.length ? t('إلغاء تحديد الكل') : t('تحديد الكل')}
              </button>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Clients Grid */}
      <div className="container">
        <motion.div
          className="content-area"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {sortedClients.length > 0 ? (
              <div className="clients-grid">
                {sortedClients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className={`client-item ${selectedClients.includes(client.id) ? 'selected' : ''}`}
                  >
                    <div className="client-select">
                      <input
                        type="checkbox"
                        checked={selectedClients.includes(client.id)}
                        onChange={() => handleSelectClient(client.id)}
                      />
                    </div>
                    <ClientCard
                      client={client}
                      onEdit={() => handleEditClient(client)}
                      onDelete={() => handleDeleteClient(client.id)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Users size={64} />
                <h3>{t('لا يوجد متدربين')}</h3>
                <p>{t('ابدأ بإضافة متدرب جديد')}</p>
                <motion.button
                  className="btn btn-primary empty-btn"
                  onClick={() => setIsModalOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={18} />
                  <span>{t('إضافة أول متدرب')}</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Pagination */}
      {sortedClients.length > 0 && (
        <div className="container">
          <motion.div
            className="pagination"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="pagination-info">
              <span>{t('عرض 1-')}{Math.min(10, sortedClients.length)} {t('من')} {sortedClients.length}</span>
            </div>
            <div className="pagination-controls">
              <button className="pagination-btn prev" disabled>
                {t('السابق')}
              </button>
              <button className="pagination-btn active">1</button>
              {sortedClients.length > 10 && <button className="pagination-btn">2</button>}
              {sortedClients.length > 20 && <button className="pagination-btn">3</button>}
              <button className="pagination-btn next">
                {t('التالي')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal */}
      <AddClientModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddClient}
        editClient={editingClient}
      />
    </div>
  );
};

export default ClientsList;