// Central place for environment-driven URLs.
// Values are trimmed and stripped of trailing slashes so a stray space or "/"
// in .env can never produce a broken URL.
const clean = (value, fallback) => (value || fallback).trim().replace(/\/+$/, '');

// REST API root, e.g. https://api.ranlogic.com/api
export const API_BASE_URL = clean(import.meta.env.VITE_API_BASE_URL, 'https://api.ranlogic.com/api');

// Backend root (storage files, broadcasting auth), e.g. https://api.ranlogic.com
export const BACKEND_URL = clean(import.meta.env.VITE_BACKEND_URL, 'https://api.ranlogic.com');

export const STORAGE_URL = clean(import.meta.env.VITE_STORAGE_URL, `${BACKEND_URL}/storage`);
