class ApiError extends Error {
  constructor(error) {
    const message = error.response?.data?.message || error.message || 'حدث خطأ غير متوقع';
    super(message);
    this.name = 'ApiError';
    this.status = error.response?.status || 0;
    this.errors = error.response?.data?.errors || null;
  }
}

export default ApiError;