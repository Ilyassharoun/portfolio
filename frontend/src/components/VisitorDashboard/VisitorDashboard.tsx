import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  LogOut,
  Globe,
  Clock,
  Compass,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Monitor
} from 'lucide-react';
import './VisitorDashboard.css';

interface VisitorStats {
  totalVisitors: number;
  uniqueVisitors: number;
}

interface VisitorData {
  ipAddress: string;
  formattedIP?: string;
  userAgent: string;
  timestamp: string;
  path: string;
  location: string;
}

const VisitorDashboard: React.FC = () => {
  const [stats, setStats] = useState<VisitorStats>({ totalVisitors: 0, uniqueVisitors: 0 });
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<VisitorData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchData = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      const [statsResponse, visitorsResponse] = await Promise.all([
        axios.get('https://portfolio-backend-ceqv.onrender.com/api/visitors/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('https://portfolio-backend-ceqv.onrender.com/api/visitors', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsResponse.data);
      setVisitors(visitorsResponse.data);
      setFilteredVisitors(visitorsResponse.data);
      setError('');
    } catch (err: any) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('token');
        navigate('/login', { state: { message: 'Session expired. Please log in again.' } });
      } else {
        setError('Failed to load visitor telemetry analytics');
        console.error('Error fetching visitor data:', err);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredVisitors(visitors);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredVisitors(
        visitors.filter(
          (v) =>
            (v.formattedIP || v.ipAddress).toLowerCase().includes(term) ||
            v.location.toLowerCase().includes(term) ||
            v.path.toLowerCase().includes(term) ||
            v.userAgent.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, visitors]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('visitorTracked');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading-container">
        <div className="spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Top Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-badge">
            <ShieldCheck size={24} className="badge-icon" />
          </div>
          <div>
            <h1 className="dashboard-title">Analytics Dashboard</h1>
            <p className="dashboard-subtitle">Real-time visitor tracking and metrics</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            className={`btn-refresh ${isRefreshing ? 'spinning' : ''}`}
            onClick={() => fetchData(true)}
            title="Refresh Data"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>

          <button className="btn-logout" onClick={handleLogout} title="End Session">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {error && <div className="dashboard-error-banner">{error}</div>}

      {/* Analytics KPI Cards */}
      <section className="stats-grid">
        <div className="stat-card total-card">
          <div className="stat-card-header">
            <span className="stat-label">Total Visits</span>
            <div className="icon-wrapper total-icon">
              <Users size={22} />
            </div>
          </div>
          <div className="stat-value">{stats.totalVisitors.toLocaleString()}</div>
          <div className="stat-footer">
            <TrendingUp size={14} /> <span>All-time recorded sessions</span>
          </div>
        </div>

        <div className="stat-card unique-card">
          <div className="stat-card-header">
            <span className="stat-label">Unique Visitors</span>
            <div className="icon-wrapper unique-icon">
              <UserCheck size={22} />
            </div>
          </div>
          <div className="stat-value">{stats.uniqueVisitors.toLocaleString()}</div>
          <div className="stat-footer">
            <Globe size={14} /> <span>Distinct IP addresses</span>
          </div>
        </div>

        <div className="stat-card ratio-card">
          <div className="stat-card-header">
            <span className="stat-label">Return Rate</span>
            <div className="icon-wrapper ratio-icon">
              <Compass size={22} />
            </div>
          </div>
          <div className="stat-value">
            {stats.totalVisitors > 0
              ? `${((stats.uniqueVisitors / stats.totalVisitors) * 100).toFixed(1)}%`
              : '0%'}
          </div>
          <div className="stat-footer">
            <UserCheck size={14} /> <span>New vs returning ratio</span>
          </div>
        </div>
      </section>

      {/* Visitor Logs Section */}
      <section className="logs-section">
        <div className="logs-header">
          <div className="logs-title-area">
            <h2>Visitor Logs</h2>
            <span className="badge-count">{filteredVisitors.length} entries</span>
          </div>

          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by IP, location, or path..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th><MapPin size={16} /> IP Address</th>
                <th><Globe size={16} /> Location</th>
                <th><Compass size={16} /> Path</th>
                <th><Monitor size={16} /> Device / User Agent</th>
                <th><Clock size={16} /> Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.length > 0 ? (
                filteredVisitors.map((visitor, idx) => (
                  <tr key={idx}>
                    <td className="ip-cell">
                      <span className="ip-badge">{visitor.formattedIP || visitor.ipAddress}</span>
                    </td>
                    <td>
                      <span className="location-pill">
                        {visitor.location || 'Unknown'}
                      </span>
                    </td>
                    <td className="path-cell">
                      <code>{visitor.path}</code>
                    </td>
                    <td className="agent-cell" title={visitor.userAgent}>
                      {visitor.userAgent}
                    </td>
                    <td className="time-cell">
                      {new Date(visitor.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="no-data">
                    No visitor logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default VisitorDashboard;