import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  CheckCircle,
  Activity,
  PieChart as PieChartIcon,
  Target,
  Clock,
  AlertCircle,
  FileText,
  RefreshCw,
  Database,
  AlertTriangle,
  BarChart3,
  LineChart
} from 'lucide-react';
import TimeFilter from '../../components/Dashboard/TimeFilter/TimeFilter';
import MetricCard from '../../components/Dashboard/MetricCard/MetricCard';
import LineChartComponent from '../../components/Dashboard/Charts/LineChart';
import AreaChart from '../../components/Dashboard/Charts/AreaChart';
import PieChart from '../../components/Dashboard/Charts/PieChart';
import DonutChart from '../../components/Dashboard/Charts/DonutChart';
import BarChart from '../../components/Dashboard/Charts/BarChart';
import StackedBarChart from '../../components/Dashboard/Charts/StackedBarChart';
import FunnelChart from '../../components/Dashboard/Charts/FunnelChart';
import SimpleHeatmapChart from '../../components/Dashboard/Charts/SimpleHeatmapChart';
import AlertsPanel from '../../components/Dashboard/AlertsPanel/AlertsPanel';
import SummaryBox from '../../components/Dashboard/SummaryBox/SummaryBox';
import dashboardAPI from '../../api/dashboardApi';
import authApi from '../../api/authApi';
import './Dashboard.scss';

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('this_week');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  
  const controllerRef = useRef(null);
  const loadingTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);

  // الكشف عن حجم الشاشة
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 576);
      setIsTablet(width >= 576 && width < 992);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // تحميل بيانات المستخدم
  const loadUserData = async () => {
    try {
      const storedUser = authApi.getUser();
      if (storedUser) {
        setUser(storedUser);
      }
      
      try {
        const userResponse = await authApi.me();
        if (userResponse.success) {
          setUser(userResponse.data);
        }
      } catch (userError) {
        console.error('User data error:', userError);
      }
    } catch (error) {
      console.error('❌ User data error:', error);
    }
  };

  // تحميل بيانات لوحة التحكم - بدون بيانات افتراضية
  const loadDashboardData = async (period, isRefresh = false) => {
    console.log('🔄 Loading dashboard data...', { period, isRefresh });
    
    // إلغاء أي طلب سابق
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    
    // إنشاء AbortController جديد
    controllerRef.current = new AbortController();
    
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      // تحميل بيانات المستخدم
      loadUserData();
      
      // إزالة الـ timeout - نريد الانتظار حتى يجلب البيانات الحقيقية
      // نستخدم timeout طويل جداً فقط للحماية من التعلق الأبدي (30 ثانية)
      loadingTimeoutRef.current = setTimeout(() => {
        console.log('⏰ Loading timeout - network seems slow but still waiting...');
        // لا نستخدم بيانات افتراضية، فقط نعرض رسالة أن الاتصال بطيء
        if (!dashboardData) {
          setError('جاري تحميل البيانات... قد يستغرق هذا بعض الوقت بسبب بطء الاتصال');
        }
      }, 10000); // 10 ثواني فقط للتنبيه وليس لاستخدام بيانات افتراضية
      
      // تحميل بيانات لوحة التحكم مع إشارة الإلغاء
      const data = await dashboardAPI.getAllDashboardData(period);
      
      // تنظيف الـ timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      console.log('✅ API data received, setting state...');
      
      // التحقق من صحة البيانات
      if (!data) {
        throw new Error('لم يتم استلام بيانات من الخادم');
      }
      
      // تحديث الحالة
      setDashboardData(data);
      setLastRefresh(new Date());
      setError(null);
      setIsLoading(false);
      setIsRefreshing(false);
      
      console.log('✅ State updated successfully');
      
    } catch (err) {
      // إذا كان الخطأ بسبب الإلغاء، نتجاهله
      if (err.name === 'AbortError') {
        console.log('Request was aborted');
        return;
      }
      
      console.error('❌ Error in loadDashboardData:', err);
      
      // تنظيف الـ timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      
      // عرض الخطأ ولكن نبقى في حالة تحميل إذا كان dashboardData فارغ
      setError(`حدث خطأ: ${err.message || 'فشل تحميل البيانات'}`);
      
      // نبقى في حالة تحميل ولا نستخدم بيانات افتراضية
      // نعيد محاولة التحميل تلقائياً بعد 3 ثواني إذا كان الخطأ متعلق بالشبكة
      if (err.message?.includes('network') || err.message?.includes('fetch')) {
        console.log('Network error, retrying in 3 seconds...');
        setTimeout(() => {
          if (isLoading || isRefreshing) {
            loadDashboardData(period, isRefresh);
          }
        }, 3000);
      } else {
        // للخطأ غير الشبكي، نوقف التحميل ونعرض الخطأ
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  };

  // تحميل البيانات عند تحميل الصفحة
  useEffect(() => {
    console.log('🎬 useEffect triggered, isInitialMount:', isInitialMount.current);
    
    if (isInitialMount.current) {
      loadDashboardData(timeFilter);
      isInitialMount.current = false;
    }
    
    return () => {
      console.log('🧹 Cleanup function called');
      
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    };
  }, [timeFilter]);

  // تحديث البيانات عند تغيير الفترة الزمنية
  const handleTimeFilterChange = (newPeriod) => {
    console.log('🔄 Time filter changed to:', newPeriod);
    setTimeFilter(newPeriod);
  };

  // تحديث البيانات يدوياً
  const handleRefresh = () => {
    console.log('🔃 Manual refresh triggered');
    loadDashboardData(timeFilter, true);
  };

  // معالجة تسجيل الخروج
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      authApi.clearAuthData();
      window.location.href = '/login';
    }
  };

  // التحقق من حالة البيانات - بدون بيانات افتراضية
  const isDataReady = !isLoading && !isRefreshing && dashboardData !== null;
  
  console.log('📊 Current state:', {
    isLoading,
    isRefreshing,
    hasDashboardData: !!dashboardData,
    isDataReady,
    error
  });

  // ارتفاع المخططات حسب الجهاز
  const getChartHeight = () => {
    if (isMobile) return 250;
    if (isTablet) return 280;
    return 320;
  };

  const chartHeight = getChartHeight();

  // حجم الأيقونات حسب الجهاز
  const getIconSize = () => {
    if (isMobile) return 20;
    if (isTablet) return 24;
    return 32;
  };

  // عرض حالة التحميل - نبقى هنا حتى يتم جلب البيانات الحقيقية
  if (isLoading || (!dashboardData && !error)) {
    return (
      <div className="dashboard dashboard--loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>جاري تحميل بيانات لوحة التحكم...</p>
          <p className="loading-subtitle">يرجى الانتظار، جلب البيانات من الخادم...</p>
          {error && error.includes('بطء') && (
            <p className="loading-warning">{error}</p>
          )}
        </div>
      </div>
    );
  }

  // عرض حالة الخطأ - مع إمكانية إعادة المحاولة
  if (error && !dashboardData) {
    return (
      <div className="dashboard dashboard--error">
        <div className="error-container">
          <AlertTriangle size={48} />
          <h3>حدث خطأ في تحميل البيانات</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button 
              className="retry-button"
              onClick={handleRefresh}
            >
              <RefreshCw size={18} />
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Page Header */}
      <motion.div
        className="dashboard__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="dashboard__header-content">
          <div className="dashboard__title-section">
            <h1 className="dashboard__title">
              <TrendingUp size={getIconSize()} />
              لوحة التحكم
            </h1>
            <p className="dashboard__subtitle">
              نظرة شاملة على أداء التطبيق وإحصائيات المتدربين
            </p>
            {user && (
              <div className="user-info">
                <span className="user-name">مرحباً، {user.name}</span>
                <button 
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
          
          <div className="dashboard__header-actions">
            <TimeFilter value={timeFilter} onChange={handleTimeFilterChange} />
            <button 
              className="refresh-button"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw size={18} className={`refresh-icon ${isRefreshing ? 'refreshing' : ''}`} />
              {isRefreshing ? 'جاري التحديث...' : 'تحديث'}
            </button>
            {lastRefresh && (
              <span className="last-refresh">
                آخر تحديث: {lastRefresh.toLocaleTimeString('ar-EG', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Error Message (non-critical) */}
      {error && dashboardData && (
        <motion.div 
          className="dashboard__error-alert"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertTriangle size={24} />
          <span>{error}</span>
          <button 
            className="retry-button"
            onClick={handleRefresh}
          >
            إعادة المحاولة
          </button>
        </motion.div>
      )}

      {/* Loading overlay for refreshing */}
      {isRefreshing && (
        <div className="refreshing-overlay">
          <div className="refreshing-spinner">
            <RefreshCw size={32} className="refreshing" />
            <p>جاري تحديث البيانات...</p>
          </div>
        </div>
      )}

      {/* المحتوى الرئيسي - يظهر فقط عند وجود بيانات حقيقية */}
      {dashboardData && (
        <>
          {/* Key Metrics */}
          <motion.div
            className="dashboard__metrics-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MetricCard
              title="الاشتراكات النشطة"
              value={dashboardData.metrics?.totalSubscriptions || 0}
              change={dashboardData.metrics?.previousPeriodChange?.subscriptions || 0}
              icon={Users}
              color="primary"
              format="number"
            />
            
            <MetricCard
              title="تسجيلات جديدة"
              value={dashboardData.metrics?.newRegistrations || 0}
              change={dashboardData.metrics?.previousPeriodChange?.registrations || 0}
              icon={Activity}
              color="blue"
              format="number"
              showLineChart={!isMobile && !isTablet}
            />
            
            <MetricCard
              title="إجمالي الدخل"
              value={dashboardData.metrics?.totalRevenue || 0}
              change={dashboardData.metrics?.previousPeriodChange?.revenue || 0}
              icon={DollarSign}
              color="green"
              format="currency"
              currency="$"
            />
            
            <MetricCard
              title="متوسط مدة الاشتراك"
              value={dashboardData.metrics?.avgSubscriptionDuration || 0}
              change={0}
              icon={Calendar}
              color="orange"
              format="duration"
              unit="شهر"
            />
            
            <MetricCard
              title="معدل الإنجاز"
              value={dashboardData.metrics?.completionRate || 0}
              change={5}
              icon={CheckCircle}
              color="purple"
              format="percentage"
              progress={dashboardData.metrics?.completionRate || 0}
            />
          </motion.div>

          {/* Charts Grid */}
          <div className="dashboard__charts-grid">
            {/* Growth Analytics */}
            <motion.div 
              className="chart-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="chart-card__header">
                <div className="chart-card__title">
                  <LineChart size={isMobile ? 16 : 20} />
                  <h3>تحليل النمو</h3>
                </div>
                <span className="chart-card__subtitle">عدد الاشتراكات بمرور الوقت</span>
              </div>
              <div className="chart-card__content">
                {dashboardData.growth?.length > 0 ? (
                  <LineChartComponent data={dashboardData.growth} height={chartHeight} />
                ) : (
                  <div className="chart-no-data">
                    <BarChart3 size={32} />
                    <p>لا توجد بيانات متاحة</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Revenue Analytics */}
            <motion.div 
              className="chart-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
            >
              <div className="chart-card__header">
                <div className="chart-card__title">
                  <DollarSign size={isMobile ? 16 : 20} />
                  <h3>تحليل الدخل</h3>
                </div>
                <span className="chart-card__subtitle">الدخل اليومي / الأسبوعي / الشهري</span>
              </div>
              <div className="chart-card__content">
                {dashboardData.revenue?.length > 0 ? (
                  <AreaChart data={dashboardData.revenue} height={chartHeight} />
                ) : (
                  <div className="chart-no-data">
                    <LineChart size={32} />
                    <p>لا توجد بيانات متاحة</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Payment Status */}
            <motion.div 
              className="chart-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="chart-card__header">
                <div className="chart-card__title">
                  <PieChartIcon size={isMobile ? 16 : 20} />
                  <h3>حالات الدفع</h3>
                </div>
                <span className="chart-card__subtitle">توزيع حالات الدفع</span>
              </div>
              <div className="chart-card__content">
                {dashboardData.paymentStatus?.length > 0 ? (
                  <PieChart data={dashboardData.paymentStatus} height={chartHeight} />
                ) : (
                  <div className="chart-no-data">
                    <PieChartIcon size={32} />
                    <p>لا توجد بيانات متاحة</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Program Types */}
            <motion.div 
              className="chart-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
            >
              <div className="chart-card__header">
                <div className="chart-card__title">
                  <Target size={isMobile ? 16 : 20} />
                  <h3>توزيع البرامج</h3>
                </div>
                <span className="chart-card__subtitle">أنواع البرامج الأكثر طلبًا</span>
              </div>
              <div className="chart-card__content">
                {dashboardData.programTypes?.length > 0 ? (
                  <DonutChart data={dashboardData.programTypes} height={chartHeight} />
                ) : (
                  <div className="chart-no-data">
                    <Target size={32} />
                    <p>لا توجد بيانات متاحة</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Completion Rate */}
            <motion.div 
              className="chart-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="chart-card__header">
                <div className="chart-card__title">
                  <CheckCircle size={isMobile ? 16 : 20} />
                  <h3>إنجاز البرامج</h3>
                </div>
                <span className="chart-card__subtitle">نسبة الالتزام لكل نوع برنامج</span>
              </div>
              <div className="chart-card__content">
                {dashboardData.completion?.length > 0 ? (
                  <BarChart data={dashboardData.completion} height={chartHeight} />
                ) : (
                  <div className="chart-no-data">
                    <BarChart3 size={32} />
                    <p>لا توجد بيانات متاحة</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Heatmap */}
            <motion.div 
              className="chart-card chart-card--wide"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 }}
            >
              <div className="chart-card__header">
                <div className="chart-card__title">
                  <Clock size={isMobile ? 16 : 20} />
                  <h3>أفضل أوقات التفاعل</h3>
                </div>
                <span className="chart-card__subtitle">حرارة الالتزام خلال الأسبوع</span>
              </div>
              <div className="chart-card__content">
                <SimpleHeatmapChart height={chartHeight} />
              </div>
            </motion.div>
          </div>

          {/* Bottom Section - Alerts & Summary */}
          <div className="dashboard__bottom-section">
            <motion.div 
              className="alerts-container"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <AlertsPanel alerts={dashboardData.alerts || []} />
            </motion.div>
            
            <motion.div 
              className="summary-container"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
            >
              <SummaryBox metrics={dashboardData.metrics} alerts={dashboardData.alerts} />
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;