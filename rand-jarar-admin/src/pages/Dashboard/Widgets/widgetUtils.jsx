import React, { useState } from 'react';
import { BACKEND_URL } from '../../../config';

export const WidgetSkeleton = ({ rows = 3 }) =>
  Array.from({ length: rows }, (_, i) => <div key={i} className="dw-skeleton" />);

const imageUrl = (path) => {
  if (!path || String(path).includes('default-avatar')) return null;
  return String(path).startsWith('http') ? path : `${BACKEND_URL}/storage/${path}`;
};

const initials = (name = '') =>
  name.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';

export const WidgetAvatar = ({ name, src, online }) => {
  const [broken, setBroken] = useState(false);
  const url = imageUrl(src);
  return (
    <span className="dw-avatar">
      {url && !broken ? <img src={url} alt="" loading="lazy" onError={() => setBroken(true)} /> : <span>{initials(name)}</span>}
      {online && <i className="dw-avatar__online" aria-hidden="true" />}
    </span>
  );
};
