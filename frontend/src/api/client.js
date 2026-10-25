const BASE = import.meta.env.VITE_API_BASE_URL || '/api';
async function request(path, options={}) {
 let response;
 try { response=await fetch(`${BASE}${path}`,{...options,headers:{'Content-Type':'application/json',...(options.headers||{})}}); }
 catch { throw new Error('Không kết nối được máy chủ. Vui lòng thử lại.'); }
 let data;
 try { data=await response.json(); } catch { throw new Error('Máy chủ trả về dữ liệu không hợp lệ.'); }
 if(!response.ok) throw new Error(data.error || `Lỗi HTTP ${response.status}`);
 return data;
}
export const api={
 list:()=>request('/survey-responses'),
 detail:(id)=>request(`/survey-responses/${encodeURIComponent(id)}`),
 availableTickets:()=>request('/tickets/available'),
 create:(payload)=>request('/survey-responses',{method:'POST',body:JSON.stringify(payload)})
};
