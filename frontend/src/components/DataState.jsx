import React from "react";

export default function DataState({
  loading,
  error,
  empty,
  children,
  onRetry,
}) {
  if (loading) {
    return <div role="status" className="state">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return (
      <div role="alert" className="state error">
        {error}
        {onRetry && (
          <button onClick={onRetry}>Thử lại</button>
        )}
      </div>
    );
  }

  if (empty) {
    return <div className="state">Chưa có dữ liệu để hiển thị.</div>;
  }

  return children;
}