
import React, { useEffect, useState } from "react";
import { api, setAuthToken } from "./api/client";
import DataState from "./components/DataState";
import Login from "./components/Login";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("list");

  const [rows, setRows] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [detail, setDetail] = useState(null);
  const [detailId, setDetailId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState("");
  const [form, setForm] = useState({
    csat_score: 5,
    nps_score: 9,
    comment: ""
  });

  async function handleLogin(username, password) {
    const result = await api.login(username, password);
    setAuthToken(result.token);
    setUser(result.user);
  }

  async function handleLogout() {
    try {
      await api.logout();
    } catch (err) {
      console.error("Không thể kết thúc phiên trên máy chủ:", err);
    } finally {
      setAuthToken(null);
      setUser(null);
      setPage("list");
      setRows([]);
      setTickets([]);
      setDetail(null);
      setDetailId(null);
      setSearch("");
      setError("");
      setNotice("");
    }
  }

  async function loadList() {
    setLoading(true);
    setError("");

    try {
      const data = await api.list();
      setRows(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadTickets() {
    setLoading(true);
    setError("");

    try {
      const data = await api.availableTickets();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function openDetail(id) {
    setPage("detail");
    setDetailId(id);
    setDetail(null);
    setLoading(true);
    setError("");

    try {
      const data = await api.detail(id);
      setDetail(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function navigate(next) {
    setPage(next);
    setError("");
    setNotice("");

    if (next === "list") {
      loadList();
    }

    if (next === "create") {
      loadTickets();
    }
  }

  useEffect(() => {
    if (user) {
      loadList();
    }
  }, [user]);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!selected) {
      setError("Vui lòng chọn phiếu đã đóng.");
      return;
    }

    setLoading(true);

    try {
      const saved = await api.create({
        ticket_id: Number(selected),
        csat_score: Number(form.csat_score),
        nps_score: Number(form.nps_score),
        comment: form.comment
      });

      setNotice(`Đã lưu khảo sát #${saved.response_id}`);
      setSelected("");
      setForm({
        csat_score: 5,
        nps_score: 9,
        comment: ""
      });

      const available = await api.availableTickets();
      setTickets(available);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const keyword = search.trim().toLowerCase();

  const filteredRows = rows.filter((row) => {
    if (!keyword) return true;

    return (
      String(row.response_id).includes(keyword) ||
      String(row.ticket_id).includes(keyword)
    );
  });

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <main>
      <header>
        <div>
          <small>MEKONG MOBILE / L8</small>
          <h1>Smart CRM · Khảo sát CSAT/NPS</h1>
          <p>
            Quản lý phản hồi sau khi phiếu bảo hành được đóng
          </p>
        </div>
      </header>

      <nav>
        <button type="button" onClick={handleLogout}>
          Đăng xuất ({user.username})
        </button>

        <button
          type="button"
          className={page === "list" ? "active" : ""}
          onClick={() => navigate("list")}
        >
          Danh sách khảo sát
        </button>

        <button
          type="button"
          className={page === "create" ? "active" : ""}
          onClick={() => navigate("create")}
        >
          Tiếp nhận khảo sát
        </button>
      </nav>

      {notice && (
        <p className="success" role="status">
          {notice}
        </p>
      )}

      {page === "list" && (
        <section>
          <div className="sectionHead">
            <h2>Danh sách phản hồi</h2>
            <button type="button" onClick={loadList}>
              Tải lại
            </button>
          </div>

          <DataState
            loading={loading}
            error={error}
            empty={rows.length === 0}
            emptyMessage="Chưa có phản hồi khảo sát nào trong hệ thống."
            onRetry={loadList}
          >
            <label>
              Tìm kiếm theo mã phản hồi hoặc mã phiếu
              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Nhập mã phản hồi hoặc mã phiếu..."
              />
            </label>

            {filteredRows.length === 0 ? (
              <div role="status" className="state">
                Không tìm thấy phản hồi phù hợp với từ khóa.
              </div>
            ) : (
              <div className="tableWrap">
                <table>
                  <thead>
                    <tr>
                      <th>Mã phản hồi</th>
                      <th>Phiếu</th>
                      <th>CSAT</th>
                      <th>NPS</th>
                      <th>Thời gian</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRows.map((row) => (
                      <tr key={row.response_id}>
                        <td>#{row.response_id}</td>
                        <td>#{row.ticket_id}</td>
                        <td>{row.csat_score}/5</td>
                        <td>{row.nps_score}/10</td>
                        <td>
                          {new Date(
                            row.responded_at
                          ).toLocaleString("vi-VN")}
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() =>
                              openDetail(row.response_id)
                            }
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DataState>
        </section>
      )}

      {page === "detail" && (
        <section>
          <div className="sectionHead">
            <h2>Chi tiết khảo sát</h2>
            <button
              type="button"
              onClick={() => navigate("list")}
            >
              ← Danh sách
            </button>
          </div>

          <DataState
            loading={loading}
            error={error}
            empty={!detail}
            emptyMessage="Không tìm thấy thông tin khảo sát."
            onRetry={() => openDetail(detailId)}
          >
            {detail && (
              <div className="details">
                <p>
                  <b>Mã phản hồi:</b> #{detail.response_id}
                </p>
                <p>
                  <b>Mã phiếu:</b> #{detail.ticket_id}
                </p>
                <p>
                  <b>CSAT:</b> {detail.csat_score}/5
                </p>
                <p>
                  <b>NPS:</b> {detail.nps_score}/10
                </p>
                <p>
                  <b>Nhận xét:</b>{" "}
                  {detail.comment || "Không có nhận xét"}
                </p>
                <p>
                  <b>Thời gian:</b>{" "}
                  {new Date(
                    detail.responded_at
                  ).toLocaleString("vi-VN")}
                </p>
              </div>
            )}
          </DataState>
        </section>
      )}

      {page === "create" && (
        <section>
          <h2>Tiếp nhận phản hồi mới</h2>

          <p>
            Chỉ những phiếu CLOSED chưa được khảo sát
            mới xuất hiện.
          </p>

          <DataState
            loading={loading}
            error={error}
            empty={tickets.length === 0}
            emptyMessage="Hiện không có phiếu CLOSED nào chưa được khảo sát."
            onRetry={loadTickets}
          >
            <form onSubmit={submit}>
              <label>
                Phiếu bảo hành
                <select
                  value={selected}
                  onChange={(event) =>
                    setSelected(event.target.value)
                  }
                  required
                >
                  <option value="">-- Chọn phiếu --</option>

                  {tickets.map((ticket) => (
                    <option
                      key={ticket.ticket_id}
                      value={ticket.ticket_id}
                    >
                      #{ticket.ticket_id} · {ticket.full_name} ·{" "}
                      {ticket.center_name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                CSAT (1–5)
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="1"
                  required
                  value={form.csat_score}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      csat_score: event.target.value
                    })
                  }
                />
              </label>

              <label>
                NPS (0–10)
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="1"
                  required
                  value={form.nps_score}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      nps_score: event.target.value
                    })
                  }
                />
              </label>

              <label>
                Nhận xét
                <textarea
                  value={form.comment}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      comment: event.target.value
                    })
                  }
                />
              </label>

              <button type="submit" disabled={loading}>
                Gửi khảo sát
              </button>
            </form>
          </DataState>
        </section>
      )}

      <footer>
        Smart CRM · Track SE · Mekong Mobile
      </footer>
    </main>
  );
}
