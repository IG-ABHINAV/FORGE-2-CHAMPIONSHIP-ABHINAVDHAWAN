import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './index.css';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  const icon = type === 'success' ? '✅' : '❌';
  return <div className={`toast ${type}`}>{icon} {msg}</div>;
}

// ── Priority badge ────────────────────────────────────────────────────────────
function PriorityBadge({ p }) {
  const map = { urgent:'badge-urgent', high:'badge-high', medium:'badge-medium', low:'badge-low' };
  return <span className={`badge ${map[p] || 'badge-low'}`}>{p}</span>;
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ s }) {
  const map = { open:'badge-open', in_progress:'badge-in_progress', resolved:'badge-resolved', closed:'badge-closed' };
  return <span className={`badge ${map[s] || 'badge-low'}`}>{s?.replace('_',' ')}</span>;
}

// ── Auth Page ─────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode]     = useState('login');
  const [email, setEmail]   = useState('');
  const [pass, setPass]     = useState('');
  const [name, setName]     = useState('');
  const [org, setOrg]       = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const url  = mode === 'login' ? '/v1/login' : '/v1/register';
      const body = mode === 'login'
        ? { email, password: pass }
        : { org_name: org, name, email, password: pass };
      const res = await axios.post(url, body);
      onLogin(res.data.access_token);
    } catch (err) {
      setError(err.response?.data?.message || (mode === 'login' ? 'Login failed.' : 'Registration failed.'));
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="logo-mark">
          <div className="logo-icon">⚡</div>
          <span className="logo-name">PulseDesk</span>
        </div>
        <p className="auth-subtitle">Multi-tenant AI-powered support helpdesk</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={submit}>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Organization Name</label>
                <input className="form-input" type="text" required placeholder="Acme Corp" value={org} onChange={e => setOrg(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" type="text" required placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
              </div>
            </>
          )}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" required placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" required placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === 'login'
            ? <>No account? <span onClick={() => { setMode('register'); setError(''); }}>Register organization</span></>
            : <>Have an account? <span onClick={() => { setMode('login'); setError(''); }}>Sign in</span></>}
        </div>
      </div>
    </div>
  );
}

// ── Create Ticket Form ────────────────────────────────────────────────────────
function CreateTicketForm({ onCreated, onToast }) {
  const [title, setTitle]     = useState('');
  const [desc, setDesc]       = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await axios.post('/v1/tickets', { title, description: desc, priority });
      setTitle(''); setDesc(''); setPriority('medium');
      onToast('Ticket created successfully!', 'success');
      onCreated();
    } catch (err) {
      onToast(err.response?.data?.message || 'Failed to create ticket.', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="card" style={{ animationDelay: '0.1s' }}>
      <div className="card-header">
        <span className="card-title">🎫 New Ticket</span>
      </div>
      <form onSubmit={submit}>
        <div className="form-group">
          <label className="form-label">Subject</label>
          <input className="form-input" type="text" required placeholder="Brief summary of the issue…" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" required placeholder="Describe the problem in detail…" value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="low">🟢 Low</option>
            <option value="medium">🔵 Medium</option>
            <option value="high">🟡 High</option>
            <option value="urgent">🔴 Urgent</option>
          </select>
        </div>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit Ticket →'}
        </button>
      </form>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ user, tickets, loading, onRefresh, onToast, onLogout }) {
  const [filter, setFilter] = useState('all');

  const stats = {
    total:      tickets.length,
    open:       tickets.filter(t => t.status === 'open').length,
    urgent:     tickets.filter(t => t.priority === 'urgent').length,
    resolved:   tickets.filter(t => t.status === 'resolved').length,
  };

  const filtered = filter === 'all' ? tickets : tickets.filter(t =>
    filter === 'open'     ? t.status === 'open' :
    filter === 'urgent'   ? t.priority === 'urgent' :
    filter === 'resolved' ? t.status === 'resolved' : true
  );

  const initials = (user?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon" style={{width:32,height:32,fontSize:15,borderRadius:8}}>⚡</div>
          <span className="logo-name">PulseDesk</span>
        </div>

        <div className="nav-section" style={{marginTop:0}}>Main</div>
        <button className="nav-item active"><span className="nav-icon">🎫</span> Tickets <span className="nav-badge">{stats.open}</span></button>
        <button className="nav-item"><span className="nav-icon">📊</span> Dashboard</button>
        <button className="nav-item"><span className="nav-icon">🤖</span> AI Agents</button>

        <div className="divider" />
        <div className="nav-section">Workspace</div>
        <button className="nav-item"><span className="nav-icon">📁</span> Knowledge Base</button>
        <button className="nav-item"><span className="nav-icon">⚙️</span> Settings</button>

        <div className="sidebar-bottom">
          {user && (
            <div className="user-card">
              <div className="user-avatar">{initials}</div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-role">{user.organization?.name}</div>
              </div>
              <button className="btn-logout" onClick={onLogout} title="Sign out">↩</button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="topbar">
          <div>
            <div className="page-title">Ticket Queue</div>
            <div className="page-subtitle">Manage and track support requests for {user?.organization?.name}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: 'Total Tickets', value: stats.total, cls: 'blue'  },
            { label: 'Open',          value: stats.open,    cls: 'green' },
            { label: 'Urgent',        value: stats.urgent,  cls: 'red'   },
            { label: 'Resolved',      value: stats.resolved,cls: 'amber' },
          ].map((s, i) => (
            <div className="stat-card" key={s.label} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-value ${s.cls}`}>{s.value}</div>
              <div className="stat-change">across your organization</div>
            </div>
          ))}
        </div>

        {/* Panel */}
        <div className="panel-grid">
          {/* Ticket list */}
          <div>
            <div className="filter-row">
              {['all','open','urgent','resolved'].map(f => (
                <button key={f} className={`btn-sm ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
              <button className="btn-sm" onClick={onRefresh} style={{marginLeft:'auto'}}>↻ Refresh</button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px 0' }}>
                <div className="card-header" style={{ marginBottom: 0 }}>
                  <span className="card-title">All Tickets</span>
                  <span className="card-count">{filtered.length} showing</span>
                </div>
              </div>
              <div style={{ padding: '16px 24px 24px' }}>
                {loading ? (
                  [1,2,3].map(i => <div key={i} className="skeleton skeleton-ticket" />)
                ) : filtered.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🎫</div>
                    <div className="empty-text">No tickets found.</div>
                  </div>
                ) : (
                  <div className="ticket-list">
                    {filtered.map(t => (
                      <div className="ticket-item" key={t.id}>
                        <div className="ticket-top">
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="ticket-title">{t.title}</div>
                            <div className="ticket-meta">#{t.id} · {t.user?.name || 'Unknown'} · {new Date(t.created_at).toLocaleDateString()}</div>
                          </div>
                          <div className="badges">
                            <PriorityBadge p={t.priority} />
                            <StatusBadge s={t.status} />
                          </div>
                        </div>
                        {t.description && <p className="ticket-desc">{t.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Create form */}
          <div>
            <CreateTicketForm onCreated={onRefresh} onToast={onToast} />

            {/* Agent info card */}
            <div className="card" style={{ marginTop: 16, animationDelay: '0.2s' }}>
              <div className="card-title" style={{ marginBottom: 12, fontSize: 14 }}>🤖 Active Agents</div>
              {[
                { name: 'Hermes', role: 'Product Owner · Planning', model: 'moonshotai/kimi-k2.6', color: '#6366f1' },
                { name: 'OpenClaw', role: 'Dev Agent · Coding', model: 'z-ai/glm-5.1', color: '#10b981' },
              ].map(a => (
                <div key={a.name} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ width:32, height:32, background:a.color+'22', border:`1px solid ${a.color}44`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>🤖</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>{a.name}</div>
                    <div style={{ fontSize:11, color:'var(--text-3)' }}>{a.role}</div>
                  </div>
                  <div style={{ fontSize:10, background:`${a.color}18`, color:a.color, padding:'2px 8px', borderRadius:99, border:`1px solid ${a.color}33`, whiteSpace:'nowrap' }}>
                    online
                  </div>
                </div>
              ))}
              <div style={{ fontSize:11, color:'var(--text-3)', marginTop:12, textAlign:'center' }}>
                EastRouter · 3 models active
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [token, setToken]     = useState(() => localStorage.getItem('pd_token') || '');
  const [user, setUser]       = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null);

  if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type }); 
  }, []);

  const fetchUser = useCallback(async () => {
    try { const r = await axios.get('/v1/me'); setUser(r.data); }
    catch { handleLogout(); }
  }, []);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try { const r = await axios.get('/v1/tickets'); setTickets(r.data.data || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (token) { fetchUser(); fetchTickets(); }
  }, [token]);

  const handleLogin = (t) => {
    localStorage.setItem('pd_token', t);
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    setToken(t);
  };

  const handleLogout = () => {
    try { axios.post('/v1/logout'); } catch {}
    localStorage.removeItem('pd_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(''); setUser(null); setTickets([]);
  };

  if (!token) return <AuthPage onLogin={handleLogin} />;

  return (
    <>
      <Dashboard
        user={user}
        tickets={tickets}
        loading={loading}
        onRefresh={fetchTickets}
        onToast={showToast}
        onLogout={handleLogout}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </>
  );
}
