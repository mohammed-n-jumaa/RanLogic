import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Landmark, MessageCircle, Bell, Receipt, CheckCircle2, RefreshCw, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { t, loc, isRTL } from '../../../i18n';
import { WidgetSkeleton, WidgetAvatar } from './widgetUtils';
import { timeAgo } from './timeAgo';
import './Widgets.scss';

const MAX_ITEMS = 4;

const Empty = ({ text }) => (
  <div className="dw-empty dw-empty--ok">
    <CheckCircle2 size={26} />
    <p>{text}</p>
  </div>
);

const Failed = ({ text, onRetry }) => (
  <div className="dw-empty">
    <p>{text}</p>
    {onRetry && <button type="button" className="ds-retry" onClick={onRetry}><RefreshCw size={14} /> {t('إعادة المحاولة')}</button>}
  </div>
);

const TransfersList = ({ state, onRetry }) => {
  const navigate = useNavigate();
  const goAll = () => navigate('/BankTransferSubscriptions');
  if (state.loading) return <WidgetSkeleton />;
  if (state.failed) return <Failed text={t('تعذر تحميل التحويلات')} onRetry={onRetry} />;
  if (!state.items.length) return <Empty text={t('لا توجد طلبات بانتظار الموافقة')} />;
  return (
    <>
      {state.items.slice(0, MAX_ITEMS).map((s) => (
        <div key={s.id} className="dw-item dw-item--amber" role="button" tabIndex={0} onClick={goAll}
          onKeyDown={(e) => { if (e.key === 'Enter') goAll(); }}>
          <span className="dw-item__icon"><Landmark size={16} /></span>
          <span className="dw-item__main">
            <strong>{s.user?.name || t('مستخدم')}</strong>
            <small>{[s.plan_type, s.created_at && timeAgo(s.created_at)].filter(Boolean).join(' · ')}</small>
          </span>
          {s.amount != null && (
            <span className="dw-item__amount">${Number(s.amount).toLocaleString(loc('en-US'), { maximumFractionDigits: 2 })}</span>
          )}
          {s.bank_receipt_url && (
            <a className="dw-item__action" href={s.bank_receipt_url} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} title={t('عرض الإيصال')} aria-label={t('عرض الإيصال')}>
              <Receipt size={15} />
            </a>
          )}
        </div>
      ))}
      {state.items.length > MAX_ITEMS && (
        <button type="button" className="dw-more" onClick={goAll}>{t('و{0} طلبات أخرى', state.items.length - MAX_ITEMS)}</button>
      )}
    </>
  );
};

const ChatsList = ({ state, onRetry }) => {
  const navigate = useNavigate();
  if (state.loading) return <WidgetSkeleton />;
  if (state.failed) return <Failed text={t('تعذر تحميل المحادثات')} onRetry={onRetry} />;
  if (!state.items.length) return <Empty text={t('لا توجد رسائل غير مقروءة')} />;
  return (
    <>
      {state.items.slice(0, MAX_ITEMS).map((chat) => {
        const client = chat.client || {};
        const id = chat.trainee_id || client.id;
        return (
          <button key={chat.id} type="button" className="dw-item dw-item--pink" onClick={() => navigate(`/chat/${id}`)}>
            <WidgetAvatar name={client.name} src={client.image || client.avatar_url || client.avatar} online={chat.is_online} />
            <span className="dw-item__main">
              <strong>{client.name || t('متدرب')}</strong>
              <small>{chat.last_message || t('مرفق')}</small>
            </span>
            <span className="dw-item__side">
              {chat.last_message_time && <small>{chat.last_message_time}</small>}
              <span className="dw-unread">{chat.unread_count > 99 ? '99+' : chat.unread_count}</span>
            </span>
          </button>
        );
      })}
      {state.items.length > MAX_ITEMS && (
        <button type="button" className="dw-more" onClick={() => navigate('/chat')}>{t('و{0} محادثات أخرى', state.items.length - MAX_ITEMS)}</button>
      )}
    </>
  );
};

const AlertsList = ({ alerts }) => {
  if (!alerts.length) return <Empty text={t('لا توجد تنبيهات')} />;
  return alerts.map((a) => (
    <div key={a.id} className={`dw-item dw-item--static dw-item--${a.color}`}>
      <span className="dw-item__icon"><Bell size={15} /></span>
      <span className="dw-item__main"><strong>{a.title}</strong></span>
      <span className="dw-item__amount">{a.count}</span>
    </div>
  ));
};

/**
 * Everything waiting on the coach, in one place.
 * Phones: one card with tabs. Wide screens: three columns.
 */
const ActionCenter = ({ tab, onTabChange, transfers, chats, alerts, onRetryTransfers, onRetryChats }) => {
  const navigate = useNavigate();
  const Arrow = isRTL ? ChevronLeft : ChevronRight;
  const unread = chats.items.reduce((sum, c) => sum + Number(c.unread_count || 0), 0);

  const panels = [
    {
      id: 'transfers', icon: Landmark, color: 'amber', label: t('تحويلات'), title: t('تحويلات بانتظار الموافقة'),
      count: transfers.items.length, link: { label: t('عرض الكل'), to: '/BankTransferSubscriptions' },
      body: <TransfersList state={transfers} onRetry={onRetryTransfers} />,
    },
    {
      id: 'chats', icon: MessageCircle, color: 'pink', label: t('رسائل'), title: t('رسائل جديدة'),
      count: unread, link: { label: t('كل المحادثات'), to: '/chat' },
      body: <ChatsList state={chats} onRetry={onRetryChats} />,
    },
    {
      id: 'alerts', icon: Bell, color: 'indigo', label: t('تنبيهات'), title: t('التنبيهات والأحداث'),
      count: alerts.length,
      body: <AlertsList alerts={alerts} />,
    },
  ];

  return (
    <div className="ac">
      {/* Phone tabs */}
      <div className="ac-tabs" role="tablist">
        {panels.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={tab === p.id}
            className={`ac-tab ac-tab--${p.color} ${tab === p.id ? 'is-active' : ''}`}
            onClick={() => onTabChange(p.id)}
          >
            <p.icon size={16} />
            <span>{p.label}</span>
            {p.count > 0 && <b>{p.count > 99 ? '99+' : p.count}</b>}
          </button>
        ))}
      </div>

      <div className="ac-panels">
        {panels.map((p) => (
          <div key={p.id} className={`ds-glass dw ac-panel ${tab === p.id ? 'is-active' : ''}`} role="tabpanel">
            <div className="ds-glass__head">
              <div className="ds-glass__title">
                <p.icon size={16} /> {p.title}
                {p.count > 0 && <span className={`dw-count dw-count--${p.color}`}>{p.count}</span>}
              </div>
              {p.link && (
                <button type="button" className="dw-link" onClick={() => navigate(p.link.to)}>
                  {p.link.label} <Arrow size={14} />
                </button>
              )}
            </div>
            <div className="dw-list">{p.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionCenter;
