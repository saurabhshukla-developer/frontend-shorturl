import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  XMarkIcon, 
  GlobeAltIcon, 
  DevicePhoneMobileIcon, 
  ComputerDesktopIcon,
  MapPinIcon,
  ClockIcon,
  GlobeAmericasIcon,
  BuildingOfficeIcon,
  WifiIcon
} from '@heroicons/react/24/outline';
import { urlService } from '../services/urlService';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ClickLogsModal = ({ isOpen, onClose, urlId, urlName }) => {
  const [clickLogs, setClickLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [topCountries, setTopCountries] = useState([]);
  const [topBrowsers, setTopBrowsers] = useState([]);
  const [topDevices, setTopDevices] = useState([]);
  const [topOperatingSystems, setTopOperatingSystems] = useState([]);
  const [topISPs, setTopISPs] = useState([]);

  // Use ref to track if modal should be open
  const shouldBeOpen = useRef(isOpen);
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);

  // Debug logging
  useEffect(() => {
    console.log('ClickLogsModal - isOpen prop changed:', isOpen);
    console.log('ClickLogsModal - urlId:', urlId);
    console.log('ClickLogsModal - urlName:', urlName);
    
    shouldBeOpen.current = isOpen;
    setInternalIsOpen(isOpen);
  }, [isOpen, urlId, urlName]);

  // Memoize the fetch function to prevent unnecessary re-renders
  const fetchClickLogs = useCallback(async () => {
    if (!urlId) return;
    
    console.log('ClickLogsModal - Fetching click logs for URL:', urlId);
    
    try {
      setLoading(true);
      const response = await urlService.getUrlClickLogs(urlId, { page: 1, limit: 100 });
      
      console.log('ClickLogsModal - API response:', response);
      
      if (response.success) {
        console.log('Backend response data:', response.data);
        setClickLogs(response.data.clickLogs);
        setStats(response.data.stats);
        setTopCountries(response.data.topCountries || []);
        setTopBrowsers(response.data.topBrowsers || []);
        setTopDevices(response.data.topDevices || []);
        
        // Process additional analytics data
        processAnalyticsData(response.data.clickLogs);
      }
    } catch (error) {
      console.error('ClickLogsModal - Error fetching click logs:', error);
      toast.error('Failed to fetch click logs: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [urlId]);

  // Process analytics data from click logs
  const processAnalyticsData = (logs) => {
    console.log('Processing analytics data from logs:', logs);
    
    // Countries
    const countryCounts = {};
    // Browsers
    const browserCounts = {};
    // Operating Systems
    const osCounts = {};
    const ispCounts = {};
    
    logs.forEach(log => {
      // Process countries
      if (log.country && log.country !== 'Unknown') {
        countryCounts[log.country] = (countryCounts[log.country] || 0) + 1;
      }
      
      // Process browsers
      if (log.browser && log.browser !== 'Unknown') {
        browserCounts[log.browser] = (browserCounts[log.browser] || 0) + 1;
      }
      
      // Process operating systems
      if (log.operatingSystem && log.operatingSystem !== 'Unknown') {
        osCounts[log.operatingSystem] = (osCounts[log.operatingSystem] || 0) + 1;
      }
      
      // Process ISPs
      if (log.isp && log.isp !== 'Unknown') {
        ispCounts[log.isp] = (ispCounts[log.isp] || 0) + 1;
      }
    });
    
    console.log('Processed counts:', { countryCounts, browserCounts, osCounts, ispCounts });
    
      // Update top countries if we have data and backend didn't provide it
  if (Object.keys(countryCounts).length > 0) {
    const processedCountries = Object.entries(countryCounts)
      .map(([country, count]) => ({ _id: country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    setTopCountries(processedCountries);
    console.log('Set top countries:', processedCountries);
  }
  
  // Update top browsers if we have data and backend didn't provide it
  if (Object.keys(browserCounts).length > 0) {
    const processedBrowsers = Object.entries(browserCounts)
      .map(([browser, count]) => ({ _id: browser, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    setTopBrowsers(processedBrowsers);
    console.log('Set top browsers:', processedBrowsers);
  }
    
    setTopOperatingSystems(
      Object.entries(osCounts)
        .map(([os, count]) => ({ _id: os, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    );
    
    setTopISPs(
      Object.entries(ispCounts)
        .map(([isp, count]) => ({ _id: isp, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    );
  };

  // Only fetch when modal opens
  useEffect(() => {
    if (internalIsOpen && urlId) {
      console.log('ClickLogsModal - Modal opened, fetching data...');
      fetchClickLogs();
    }
  }, [internalIsOpen, urlId, fetchClickLogs]);

  const handleClose = useCallback(() => {
    console.log('ClickLogsModal - handleClose called');
    setInternalIsOpen(false);
    onClose();
  }, [onClose]);

  const getDeviceIcon = (device) => {
    switch (device?.toLowerCase()) {
      case 'mobile':
        return <DevicePhoneMobileIcon className="w-4 h-4 text-blue-500" />;
      case 'desktop':
        return <ComputerDesktopIcon className="w-4 h-4 text-green-500" />;
      case 'tablet':
        return <DevicePhoneMobileIcon className="w-4 h-4 text-purple-500" />;
      default:
        return <ComputerDesktopIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCountryFlag = (countryCode) => {
    if (!countryCode || countryCode === 'Unknown') return '🌍';
    
    // Convert country code to flag emoji
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  };

  const getBrowserIcon = (browser) => {
    const browserName = browser?.toLowerCase() || '';
    if (browserName.includes('chrome')) return '🔵';
    if (browserName.includes('firefox')) return '🟠';
    if (browserName.includes('safari')) return '🔵';
    if (browserName.includes('edge')) return '🔵';
    return '🌐';
  };

  const getOSIcon = (os) => {
    const osName = os?.toLowerCase() || '';
    if (osName.includes('windows')) return '🪟';
    if (osName.includes('mac')) return '🍎';
    if (osName.includes('linux')) return '🐧';
    if (osName.includes('android')) return '🤖';
    if (osName.includes('ios')) return '🍎';
    return '💻';
  };

  // Prepare chart data
  const countryChartData = topCountries.length > 0 ? topCountries.map(country => ({
    name: country._id === 'Unknown' ? 'Unknown' : country._id,
    value: country.count,
    fill: `hsl(${Math.random() * 360}, 70%, 50%)`
  })) : [{ name: 'No Data', value: 1, fill: '#e5e7eb' }];

  const browserChartData = topBrowsers.length > 0 ? topBrowsers.map(browser => ({
    name: browser._id === 'Unknown' ? 'Unknown' : browser._id,
    clicks: browser.count
  })) : [{ name: 'No Data', clicks: 0 }];

  const deviceChartData = topDevices.length > 0 ? topDevices.map(device => ({
    name: device._id === 'Unknown' ? 'Unknown' : device._id,
    clicks: device.count
  })) : [{ name: 'No Data', clicks: 0 }];

  const osChartData = topOperatingSystems.length > 0 ? topOperatingSystems.map(os => ({
    name: os._id === 'Unknown' ? 'Unknown' : os._id,
    clicks: os.count
  })) : [{ name: 'No Data', clicks: 0 }];

  // Debug logging for chart data
  console.log('Chart Data Debug:', {
    topCountries,
    topBrowsers,
    topDevices,
    topOperatingSystems,
    countryChartData,
    browserChartData,
    deviceChartData,
    osChartData
  });

  // Don't render anything if modal is not open
  if (!internalIsOpen) {
    console.log('ClickLogsModal - Modal not open, not rendering');
    return null;
  }

  console.log('ClickLogsModal - Rendering modal with internalIsOpen:', internalIsOpen);

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          maxWidth: '1600px',
          width: '100%',
          height: '90vh',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid #f1f5f9',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: '700', 
              margin: 0,
              marginBottom: '6px'
            }}>
              📊 Click Analytics for "{urlName}"
            </h3>
            <p style={{ 
              fontSize: '14px', 
              margin: 0,
              opacity: 0.9
            }}>
              Comprehensive insights into your URL's performance and audience
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('ClickLogsModal - Close button clicked');
              handleClose();
            }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              padding: '10px',
              cursor: 'pointer',
              color: 'white',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <XMarkIcon style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Main Content */}
        <div style={{ 
          flex: 1,
          padding: '20px 24px',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto 1fr',
          gap: '20px',
          gridTemplateAreas: `
            "stats stats"
            "charts table"
          `
        }}>
          {/* Stats Overview */}
          <div style={{ 
            gridArea: 'stats',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '20px', 
              borderRadius: '16px',
              textAlign: 'center',
              color: 'white',
              boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
            }}>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '800', 
                marginBottom: '6px'
              }}>
                {stats.totalClicks || 0}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>Total Clicks</div>
            </div>
            <div style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              padding: '20px', 
              borderRadius: '16px',
              textAlign: 'center',
              color: 'white',
              boxShadow: '0 10px 25px rgba(240, 147, 251, 0.3)'
            }}>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '800', 
                marginBottom: '6px'
              }}>
                {stats.uniqueIPs || 0}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>Unique Visitors</div>
            </div>
            <div style={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              padding: '20px', 
              borderRadius: '16px',
              textAlign: 'center',
              color: 'white',
              boxShadow: '0 10px 25px rgba(79, 172, 254, 0.3)'
            }}>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '800', 
                marginBottom: '6px'
              }}>
                {stats.countries || 0}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>Countries</div>
            </div>
            <div style={{ 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              padding: '20px', 
              borderRadius: '16px',
              textAlign: 'center',
              color: 'white',
              boxShadow: '0 10px 25px rgba(67, 233, 123, 0.3)'
            }}>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '800', 
                marginBottom: '8px'
              }}>
                {stats.browsers || 0}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9, fontWeight: '500' }}>Browsers</div>
            </div>
          </div>

          {/* Charts Section */}
          <div style={{ 
            gridArea: 'charts',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Countries Chart */}
            <div style={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '16px',
              padding: '16px',
              height: '160px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '700', 
                color: '#1e293b', 
                margin: '0 0 12px 0',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                <GlobeAltIcon className="w-4 h-4 text-blue-500" />
                Top Countries
              </h4>
              {countryChartData.length > 0 && countryChartData[0].name !== 'No Data' ? (
                console.log('Rendering country chart with data:', countryChartData) ||
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={45}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {countryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  color: '#64748b',
                  fontSize: '13px'
                }}>
                  No country data available
                </div>
              )}
            </div>

            {/* Browsers Chart */}
            <div style={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '16px',
              padding: '16px',
              height: '160px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '700', 
                color: '#1e293b', 
                margin: '0 0 12px 0',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                🌐 Top Browsers
              </h4>
              {browserChartData.length > 0 && browserChartData[0].name !== 'No Data' ? (
                console.log('Rendering browser chart with data:', browserChartData) ||
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={browserChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  color: '#64748b',
                  fontSize: '13px'
                }}>
                  No browser data available
                </div>
              )}
            </div>

            {/* Operating Systems Chart */}
            <div style={{ 
              backgroundColor: 'white', 
              border: '1px solid #e2e8f0', 
              borderRadius: '16px',
              padding: '16px',
              height: '160px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '700', 
                color: '#1e293b', 
                margin: '0 0 12px 0',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                💻 Top Operating Systems
              </h4>
              {osChartData.length > 0 && osChartData[0].name !== 'No Data' ? (
                console.log('Rendering OS chart with data:', osChartData) ||
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={osChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      fontSize="10px"
                      tick={{ fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize="10px"
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="clicks" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '100%',
                  color: '#64748b',
                  fontSize: '13px'
                }}>
                  No OS data available
                </div>
              )}
            </div>
          </div>

          {/* Click Logs Table */}
          <div style={{ 
            gridArea: 'table',
            backgroundColor: 'white', 
            border: '1px solid #e2e8f0', 
            borderRadius: '16px', 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ 
              padding: '16px 20px', 
              borderBottom: '1px solid #e2e8f0',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '700', 
                color: '#1e293b', 
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                📈 Recent Click History
              </h4>
            </div>
            
            {loading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid #e2e8f0',
                  borderTop: '4px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '20px'
                }}></div>
                <p style={{ color: '#64748b', margin: 0, fontSize: '16px', fontWeight: '500' }}>Loading click logs...</p>
              </div>
            ) : clickLogs.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px', 
                color: '#64748b',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                  <p style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 8px 0' }}>No click logs found</p>
                  <p style={{ fontSize: '14px', margin: 0, opacity: 0.7 }}>This URL hasn't been clicked yet</p>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                      <th style={{ 
                        padding: '12px 16px', 
                        textAlign: 'left', 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        color: '#475569', 
                        textTransform: 'uppercase',
                        borderBottom: '1px solid #e2e8f0',
                        letterSpacing: '0.5px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ClockIcon className="w-3 h-3" />
                          Time & Date
                        </div>
                      </th>
                      <th style={{ 
                        padding: '12px 16px', 
                        textAlign: 'left', 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        color: '#475569', 
                        textTransform: 'uppercase',
                        borderBottom: '1px solid #e2e8f0',
                        letterSpacing: '0.5px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <GlobeAmericasIcon className="w-3 h-3" />
                          Location & ISP
                        </div>
                      </th>
                      <th style={{ 
                        padding: '12px 16px', 
                        textAlign: 'left', 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        color: '#475569', 
                        textTransform: 'uppercase',
                        borderBottom: '1px solid #e2e8f0',
                        letterSpacing: '0.5px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ComputerDesktopIcon className="w-3 h-3" />
                          Device & Browser
                        </div>
                      </th>

                    </tr>
                  </thead>
                  <tbody>
                    {clickLogs.slice(0, 8).map((log, index) => (
                      <tr key={index} style={{ 
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.parentElement.style.backgroundColor = '#f0f9ff';
                        e.target.parentElement.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.parentElement.style.backgroundColor = index % 2 === 0 ? 'white' : '#f8fafc';
                        e.target.parentElement.style.transform = 'translateX(0)';
                      }}
                      >
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '13px', 
                          color: '#1e293b'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <span style={{ fontWeight: '700', color: '#1e293b' }}>
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            <span style={{ fontSize: '11px', color: '#64748b' }}>
                              {new Date(log.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '13px', 
                          color: '#1e293b'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {/* Location Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '18px' }}>{getCountryFlag(log.countryCode)}</span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                <span style={{ fontWeight: '600', color: '#1e293b' }}>
                                  {log.city && log.city !== 'Unknown' ? log.city : 'Unknown City'}
                                </span>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>
                                  {log.regionName && log.regionName !== 'Unknown' ? log.regionName : 'Unknown Region'}
                                </span>
                                <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                                  {log.country && log.country !== 'Unknown' ? log.country : 'Unknown Country'}
                                </span>
                              </div>
                            </div>
                            {/* ISP Info */}
                            {log.isp && log.isp !== 'Unknown' && (
                              <div style={{ 
                                backgroundColor: '#f1f5f9',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                fontSize: '11px',
                                color: '#475569',
                                fontWeight: '500'
                              }}>
                                <BuildingOfficeIcon className="w-3 h-3 inline mr-1" />
                                {log.isp}
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={{ 
                          padding: '12px 16px', 
                          fontSize: '13px', 
                          color: '#1e293b'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {/* Device Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {getDeviceIcon(log.device)}
                              <span style={{ 
                                fontWeight: '600', 
                                color: '#1e293b',
                                backgroundColor: '#f0f9ff',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                border: '1px solid #dbeafe'
                              }}>
                                {log.device && log.device !== 'Unknown' ? log.device : 'Unknown'}
                              </span>
                            </div>
                            {/* Browser Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '14px' }}>{getBrowserIcon(log.browser)}</span>
                              <span style={{ 
                                fontSize: '11px', 
                                color: '#475569',
                                backgroundColor: '#f8fafc',
                                padding: '3px 6px',
                                borderRadius: '4px',
                                border: '1px solid #e2e8f0',
                                fontWeight: '500'
                              }}>
                                {log.browser && log.browser !== 'Unknown' ? `${log.browser} ${log.browserVersion || ''}` : 'Unknown Browser'}
                              </span>
                            </div>
                            {/* OS Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '14px' }}>{getOSIcon(log.operatingSystem)}</span>
                              <span style={{ 
                                fontSize: '10px', 
                                color: '#64748b',
                                backgroundColor: '#fef3c7',
                                padding: '2px 4px',
                                borderRadius: '3px',
                                border: '1px solid #fde68a'
                              }}>
                                {log.operatingSystem && log.operatingSystem !== 'Unknown' ? log.operatingSystem : 'Unknown OS'}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ClickLogsModal;
