import React,{useEffect,useState} from 'react';
import {api} from './api/client';
import DataState from './components/DataState';

export default function App(){
 const [page,setPage]=useState('list');
 const [rows,setRows]=useState([]),[tickets,setTickets]=useState([]),[detail,setDetail]=useState(null);
 const [loading,setLoading]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [selected,setSelected]=useState('');
 const [form,setForm]=useState({csat_score:5,nps_score:9,comment:''});
 async function loadList(){setLoading(true);setError('');try{setRows(await api.list());}catch(e){setError(e.message);}finally{setLoading(false);}}
 async function loadTickets(){setLoading(true);setError('');try{setTickets(await api.availableTickets());}catch(e){setError(e.message);}finally{setLoading(false);}}
 async function openDetail(id){setPage('detail');setLoading(true);setError('');setDetail(null);try{setDetail(await api.detail(id));}catch(e){setError(e.message);}finally{setLoading(false);}}
 function navigate(next){setPage(next);setError('');setNotice('');if(next==='list')loadList();if(next==='create')loadTickets();}
 useEffect(()=>{loadList();},[]);
 async function submit(e){e.preventDefault();setError('');setNotice('');if(!selected){setError('Vui lòng chọn phiếu đã đóng.');return;}
 setLoading(true);try{const saved=await api.create({ticket_id:Number(selected),csat_score:Number(form.csat_score),nps_score:Number(form.nps_score),comment:form.comment});setNotice(`Đã lưu khảo sát #${saved.response_id}`);setSelected('');setForm({csat_score:5,nps_score:9,comment:''});await loadTickets();}catch(e){setError(e.message);}finally{setLoading(false);}}
 return <main><header><div><small>MEKONG MOBILE / L8</small><h1>Smart CRM · Khảo sát CSAT/NPS</h1><p>Quản lý phản hồi sau khi phiếu bảo hành được đóng</p></div></header>
 <nav><button className={page==='list'?'active':''} onClick={()=>navigate('list')}>Danh sách khảo sát</button><button className={page==='create'?'active':''} onClick={()=>navigate('create')}>Tiếp nhận khảo sát</button></nav>
 {notice&&<p className="success" role="status">{notice}</p>}
 {page==='list'&&<section><div className="sectionHead"><h2>Danh sách phản hồi</h2><button onClick={loadList}>Tải lại</button></div><DataState loading={loading} error={error} empty={!rows.length} onRetry={loadList}><div className="tableWrap"><table><thead><tr><th>Mã phản hồi</th><th>Phiếu</th><th>CSAT</th><th>NPS</th><th>Thời gian</th><th></th></tr></thead><tbody>{rows.map(r=><tr key={r.response_id}><td>#{r.response_id}</td><td>#{r.ticket_id}</td><td>{r.csat_score}/5</td><td>{r.nps_score}/10</td><td>{new Date(r.responded_at).toLocaleString('vi-VN')}</td><td><button onClick={()=>openDetail(r.response_id)}>Xem chi tiết</button></td></tr>)}</tbody></table></div></DataState></section>}
 {page==='detail'&&<section><div className="sectionHead"><h2>Chi tiết khảo sát</h2><button onClick={()=>navigate('list')}>← Danh sách</button></div><DataState loading={loading} error={error} empty={!detail} onRetry={()=>navigate('list')}>{detail&&<div className="details"><p><b>Mã phản hồi:</b> #{detail.response_id}</p><p><b>Mã phiếu:</b> #{detail.ticket_id}</p><p><b>CSAT:</b> {detail.csat_score}/5</p><p><b>NPS:</b> {detail.nps_score}/10</p><p><b>Nhận xét:</b> {detail.comment||'Không có nhận xét'}</p><p><b>Thời gian:</b> {new Date(detail.responded_at).toLocaleString('vi-VN')}</p></div>}</DataState></section>}
 {page==='create'&&<section><h2>Tiếp nhận phản hồi mới</h2><p>Chỉ những phiếu CLOSED chưa được khảo sát mới xuất hiện.</p><DataState loading={loading} error={error} empty={!tickets.length} onRetry={loadTickets}><form onSubmit={submit}><label>Phiếu bảo hành<select value={selected} onChange={e=>setSelected(e.target.value)} required><option value="">-- Chọn phiếu --</option>{tickets.map(t=><option key={t.ticket_id} value={t.ticket_id}>#{t.ticket_id} · {t.full_name} · {t.center_name}</option>)}</select></label><label>CSAT (1–5)<input type="number" min="1" max="5" step="1" required value={form.csat_score} onChange={e=>setForm({...form,csat_score:e.target.value})}/></label><label>NPS (0–10)<input type="number" min="0" max="10" step="1" required value={form.nps_score} onChange={e=>setForm({...form,nps_score:e.target.value})}/></label><label>Nhận xét<textarea value={form.comment} onChange={e=>setForm({...form,comment:e.target.value})}/></label><button type="submit" disabled={loading}>Gửi khảo sát</button></form></DataState></section>}
 <footer>Smart CRM · Track SE · Mekong Mobile</footer></main>;
}
