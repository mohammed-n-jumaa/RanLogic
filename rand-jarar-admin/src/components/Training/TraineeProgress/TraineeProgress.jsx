import React, { useState, useEffect } from 'react';
import {
  TrendingDown, Flame, Droplets, Trophy, Award,
  Plus, X, Check, Trash2, Camera, Shield, Lock, Edit,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import trainingApi from '../../../api/trainingApi';
import './TraineeProgress.scss';

const Tip = ({ text, children, block }) => {
  const [show, setShow] = useState(false);
  const Tag = block ? 'div' : 'span';
  return (
    <Tag
      className="tp-tip-wrap"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && <span className="tp-tip">{text}</span>}
    </Tag>
  );
};

const dayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
const statusText = { done: 'أكمل التمرين', missed: 'لم يتمرن', today: 'اليوم', future: 'لم يأتِ بعد' };
const colors = ['#ED93B1', '#5DCAA5', '#AFA9EC', '#85B7EB', '#FAC775', '#F09595'];

const TraineeProgress = ({ clientId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddChallenge, setShowAddChallenge] = useState(false);
  const [newChallenge, setNewChallenge] = useState({ name_ar: '', name_en: '', duration_days: 30, color: '#ED93B1' });
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [saving, setSaving] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => { fetchData(); }, [clientId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await trainingApi.getTraineeProgress(clientId);
      if (res.data.success) setData(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAwardBadge = async (badgeId) => {
    try { await trainingApi.awardBadge(clientId, badgeId); fetchData(); } catch (err) { console.error(err); }
  };

  const handleRevokeBadge = async (badgeId) => {
    try { await trainingApi.revokeBadge(clientId, badgeId); fetchData(); } catch (err) { console.error(err); }
  };

  const handleCreateChallenge = async () => {
    if (!newChallenge.name_ar || saving) return;
    setSaving(true);
    try {
      await trainingApi.createChallenge(newChallenge);
      setNewChallenge({ name_ar: '', name_en: '', duration_days: 30, color: '#ED93B1' });
      setShowAddChallenge(false);
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleUpdateChallenge = async () => {
    if (!editingChallenge || saving) return;
    setSaving(true);
    try {
      await trainingApi.updateChallenge(editingChallenge.id, editingChallenge);
      setEditingChallenge(null);
      fetchData();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDeleteChallenge = async (id) => {
    if (!window.confirm('حذف التحدي؟')) return;
    try { await trainingApi.deleteChallenge(id); fetchData(); } catch (err) { console.error(err); }
  };

  if (loading) return <div className="tp-loading"><div className="spinner" /> جاري التحميل...</div>;
  if (!data) return <div className="tp-loading">فشل تحميل البيانات</div>;

  const weights = data.weight_chart;
  const firstW = weights[0]?.weight;
  const lastW = weights[weights.length - 1]?.weight;
  const change = firstW && lastW ? (parseFloat(lastW) - parseFloat(firstW)).toFixed(1) : null;
  const photos = data.photos || [];

  const fmtDate = (d) => new Date(d).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });

  return (
    <div className="tp">

      {/* Quick Stats */}
      <div className="tp-stats">
        <Tip block text={`من ${firstW || '--'} إلى ${lastW || '--'} كغ`}>
          <div className="tp-stat">
            <span className="tp-stat-v" style={{ color: '#993556' }}>{change ? `${change > 0 ? '+' : ''}${change}` : '--'}</span>
            <span className="tp-stat-l">تغيير الوزن</span>
          </div>
        </Tip>
        <Tip block text="عدد الأيام المتتالية اللي التزم فيها بالتمارين">
          <div className="tp-stat">
            <span className="tp-stat-v" style={{ color: '#f59e0b' }}>{data.streak.count}</span>
            <span className="tp-stat-l">يوم التزام</span>
          </div>
        </Tip>
        <Tip block text="نسبة التمارين المكتملة هالأسبوع">
          <div className="tp-stat">
            <span className="tp-stat-v" style={{ color: '#534AB7' }}>{data.report.exercise_rate}%</span>
            <span className="tp-stat-l">التزام التمارين</span>
          </div>
        </Tip>
        <Tip block text="معدل أكواب المي اليومية هالأسبوع">
          <div className="tp-stat">
            <span className="tp-stat-v" style={{ color: '#185FA5' }}>{data.report.avg_water}</span>
            <span className="tp-stat-l">معدل المي</span>
          </div>
        </Tip>
        <Tip block text={`${data.report.badges_earned} مكتسبة من ${data.report.badges_total}`}>
          <div className="tp-stat">
            <span className="tp-stat-v" style={{ color: '#854F0B' }}>{data.report.badges_earned}/{data.report.badges_total}</span>
            <span className="tp-stat-l">شارات</span>
          </div>
        </Tip>
      </div>

      <div className="tp-grid">

        {/* Weight Chart */}
        {weights.length > 0 && (
          <div className="tp-card tp-full">
            <div className="tp-card-t"><TrendingDown size={16} /> رحلة الوزن</div>
            <div className="tp-chart">
              {weights.map((w, i) => {
                const max = Math.max(...weights.map(x => parseFloat(x.weight)));
                const min = Math.min(...weights.map(x => parseFloat(x.weight)));
                const range = max - min || 1;
                const pct = ((parseFloat(w.weight) - min) / range) * 80 + 20;
                return (
                  <Tip block key={i} text={`${w.weight} كغ — ${fmtDate(w.logged_at)}`}>
                    <div className="tp-bar-g">
                      <span className="tp-bar-v">{w.weight}</span>
                      <div className="tp-bar-track">
                        <div className={`tp-bar ${i === weights.length - 1 ? 'cur' : ''}`} style={{ height: `${pct}%` }} />
                      </div>
                      <span className="tp-bar-l">{fmtDate(w.logged_at)}</span>
                    </div>
                  </Tip>
                );
              })}
            </div>
          </div>
        )}

        {/* Streak */}
        <div className="tp-card">
          <div className="tp-card-t"><Flame size={16} /> التزام الأسبوع</div>
          <div className="tp-streak">
            {data.streak.days.map((d, i) => (
              <Tip block key={i} text={`${dayNames[i]} — ${statusText[d.status]}`}>
                <div className={`tp-streak-d ${d.status}`}>
                  {d.status === 'done' && <Check size={12} />}
                  {d.status === 'missed' && <X size={12} />}
                  {d.status === 'today' && 'اليوم'}
                </div>
              </Tip>
            ))}
          </div>
        </div>

        {/* Water */}
        <div className="tp-card">
          <div className="tp-card-t"><Droplets size={16} /> المي — آخر 7 أيام</div>
          <div className="tp-water">
            {data.water_logs.map((w, i) => {
              const pct = w.goal > 0 ? Math.round((w.cups / w.goal) * 100) : 0;
              const dn = new Date(w.logged_at).toLocaleDateString('ar-EG', { weekday: 'short' });
              return (
                <Tip block key={i} text={`${dn}: ${w.cups}/${w.goal} أكواب (${pct}%)`}>
                  <div className="tp-water-day">
                    <div className="tp-water-bar-w">
                      <div className="tp-water-fill" style={{ height: `${(w.cups / w.goal) * 100}%` }} />
                    </div>
                    <span className="tp-water-v">{w.cups}</span>
                    <span className="tp-water-d">{dn}</span>
                  </div>
                </Tip>
              );
            })}
          </div>
        </div>

        {/* Challenges */}
        <div className="tp-card">
          <div className="tp-card-t">
            <Trophy size={16} /> التحديات
            <Tip text="إضافة تحدي جديد">
              <button className={`tp-add-btn ${showAddChallenge ? 'open' : ''}`} onClick={() => setShowAddChallenge(!showAddChallenge)}>
                <Plus size={14} />
              </button>
            </Tip>
          </div>

          {showAddChallenge && (
            <div className="tp-add-form">
              <div className="tp-add-row">
                <input placeholder="اسم التحدي بالعربي" dir="rtl" value={newChallenge.name_ar} onChange={e => setNewChallenge({ ...newChallenge, name_ar: e.target.value })} />
                <input placeholder="English name" dir="ltr" value={newChallenge.name_en} onChange={e => setNewChallenge({ ...newChallenge, name_en: e.target.value })} />
              </div>
              <div className="tp-add-row2">
                <span>المدة</span>
                <input type="number" value={newChallenge.duration_days} onChange={e => setNewChallenge({ ...newChallenge, duration_days: parseInt(e.target.value) || 30 })} />
                <span>يوم</span>
                <div className="tp-colors">
                  {colors.map(c => (
                    <div key={c} className={`tp-color ${newChallenge.color === c ? 'sel' : ''}`} style={{ background: c }} onClick={() => setNewChallenge({ ...newChallenge, color: c })} />
                  ))}
                </div>
              </div>
              <div className="tp-add-actions">
                <button className="tp-save-btn" onClick={handleCreateChallenge} disabled={saving}><Check size={14} /> حفظ</button>
                <button className="tp-cancel-btn" onClick={() => setShowAddChallenge(false)}>إلغاء</button>
              </div>
            </div>
          )}

          {data.challenges.length === 0 && !showAddChallenge ? (
            <p className="tp-empty">لا توجد تحديات بعد</p>
          ) : (
            data.challenges.map(ch => {
              const pct = ch.duration_days > 0 ? Math.round((ch.completed_days / ch.duration_days) * 100) : 0;
              const isEditing = editingChallenge?.id === ch.id;

              return isEditing ? (
                <div key={ch.id} className="tp-edit-form">
                  <div className="tp-add-row">
                    <input value={editingChallenge.name_ar} dir="rtl" onChange={e => setEditingChallenge({ ...editingChallenge, name_ar: e.target.value })} />
                    <input value={editingChallenge.name_en} dir="ltr" onChange={e => setEditingChallenge({ ...editingChallenge, name_en: e.target.value })} />
                  </div>
                  <div className="tp-add-row2">
                    <span>المدة</span>
                    <input type="number" value={editingChallenge.duration_days} onChange={e => setEditingChallenge({ ...editingChallenge, duration_days: parseInt(e.target.value) || 1 })} />
                    <span>يوم</span>
                    <div className="tp-colors">
                      {colors.map(c => (
                        <div key={c} className={`tp-color ${editingChallenge.color === c ? 'sel' : ''}`} style={{ background: c }} onClick={() => setEditingChallenge({ ...editingChallenge, color: c })} />
                      ))}
                    </div>
                  </div>
                  <div className="tp-add-actions">
                    <button className="tp-save-btn" onClick={handleUpdateChallenge} disabled={saving}><Check size={14} /> حفظ</button>
                    <button className="tp-cancel-btn" onClick={() => setEditingChallenge(null)}>إلغاء</button>
                  </div>
                </div>
              ) : (
                <div key={ch.id} className="tp-chal-row">
                  <div className="tp-chal-ic" style={{ background: ch.color + '22', color: ch.color }}><Trophy size={14} /></div>
                  <div className="tp-chal-info">
                    <Tip text={`${ch.name_en || ch.name_ar} — ${pct}%`}>
                      <span className="tp-chal-name">{ch.name_ar}</span>
                    </Tip>
                    <span className="tp-chal-prog">{ch.completed_days}/{ch.duration_days}</span>
                    <div className="tp-chal-bar"><div className="tp-chal-fill" style={{ width: `${pct}%`, background: ch.color }} /></div>
                  </div>
                  <span className="tp-chal-pct">{pct}%</span>
                  <Tip text="تعديل">
                    <button className="tp-icon-btn" onClick={() => setEditingChallenge({ id: ch.id, name_ar: ch.name_ar, name_en: ch.name_en, duration_days: ch.duration_days, color: ch.color })}><Edit size={14} /></button>
                  </Tip>
                  <Tip text="حذف">
                    <button className="tp-icon-btn danger" onClick={() => handleDeleteChallenge(ch.id)}><Trash2 size={14} /></button>
                  </Tip>
                </div>
              );
            })
          )}
        </div>

        {/* Badges */}
        <div className="tp-card">
          <div className="tp-card-t"><Award size={16} /> الشارات</div>
          <div className="tp-badges">
            {data.badges.map(b => (
              <Tip block  key={b.key} text={b.earned ? `مكتسبة — ${new Date(b.earned_at).toLocaleDateString('ar-EG')}` : 'لم تُكتسب — اضغط منح'}>
                <div className={`tp-badge ${b.earned ? 'earned' : 'locked'}`}>
                  <div className="tp-badge-ic">{b.earned ? <Award size={16} /> : <Lock size={14} />}</div>
                  <span className="tp-badge-n">{b.name_ar}</span>
                  {!b.earned ? (
                    <button className="tp-badge-btn" onClick={() => handleAwardBadge(b.id)}>منح</button>
                  ) : (
                    <button className="tp-badge-btn revoke" onClick={() => handleRevokeBadge(b.id)}>سحب</button>
                  )}
                </div>
              </Tip>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div className="tp-card tp-full">
          <div className="tp-card-t"><Camera size={16} /> صور التقدم</div>
          <div className="tp-photos">
            {photos.length === 0 ? (
              <p className="tp-empty">لا توجد صور بعد</p>
            ) : (
              photos.map((p, i) => (
                <Tip key={p.id} text={`أسبوع ${i + 1} — ${p.weight_at_photo || '--'} كغ`}>
                  <div className="tp-photo" onClick={() => setLightbox(i)}>
                    <img src={p.photo_url} alt="" loading="lazy" />
                    <div className="tp-photo-label">
                      أسبوع {i + 1}
                      {p.weight_at_photo && ` · ${p.weight_at_photo}`}
                    </div>
                  </div>
                </Tip>
              ))
            )}
          </div>

          <Tip text={data.marketing_consent ? 'وافق على استخدام صوره للتسويق' : 'لم يوافق على استخدام صوره'}>
            <div className={`tp-consent ${data.marketing_consent ? 'yes' : 'no'}`}>
              <Shield size={14} />
              <span>{data.marketing_consent ? 'وافق/ت على استخدام الصور تسويقياً' : 'لم يوافق/لم توافق على استخدام الصور تسويقياً'}</span>
            </div>
          </Tip>
        </div>

      </div>

      {/* Lightbox */}
      {lightbox !== null && photos[lightbox] && (
        <div className="tp-lightbox" onClick={() => setLightbox(null)}>
          <div className="tp-lb-content" onClick={e => e.stopPropagation()}>
            <button className="tp-lb-close" onClick={() => setLightbox(null)}><X size={22} /></button>

            {lightbox > 0 && (
              <button className="tp-lb-nav prev" onClick={() => setLightbox(lightbox - 1)}><ChevronRight size={18} /></button>
            )}

            <img src={photos[lightbox].photo_url} alt="" className="tp-lb-img" />

            {lightbox < photos.length - 1 && (
              <button className="tp-lb-nav next" onClick={() => setLightbox(lightbox + 1)}><ChevronLeft size={18} /></button>
            )}

            <div className="tp-lb-info">
              <span>أسبوع {lightbox + 1}</span>
              {photos[lightbox].weight_at_photo && <span> — {photos[lightbox].weight_at_photo} كغ</span>}
              {photos[lightbox].taken_at && (
                <span className="tp-lb-date">
                  {new Date(photos[lightbox].taken_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TraineeProgress;