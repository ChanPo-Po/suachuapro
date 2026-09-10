let USER=null, MASTERS={}, ACTIVE_TAB='overview', PROGRESS_STATE={status:'',from:'',to:'',branch:'',technician:'',q:'',page:1,limit:30}, LIST_STATE={q:'',status:'',from:'',to:'',page:1,limit:30};
const ROLE_TABS={
  admin:['overview','progress','services','customers','weekly','repairs','cost'],
  department_head:['overview','progress','repairs','cost'],
  tech_manager:['progress','repairs'],
  tech:['progress','repairs'],
  store:['repairs']
};
const TITLES={overview:'Tổng quan điều hành',progress:'Tiến độ sửa chữa',services:'Dịch vụ & dòng máy',customers:'Cơ cấu loại dịch vụ',weekly:'Tổng quan theo tuần',repairs:'Danh sách đơn',cost:'Chi phí & lợi nhuận đơn'};

function dashboardApi(payload, options){
  return apiCall(payload, options).then(function(res){
    if (!res || res.success === false) {
      let msg = (res && res.message) || 'API không xử lý được yêu cầu.';
      if (res && (res.code === 'UNKNOWN_ACTION' || /Unknown action/i.test(msg))) {
        msg += ' — Apps Script đang chạy khác phiên bản frontend. Deploy lại appscript/Code.gs trong đúng gói này rồi thử lại.';
      }
      throw new Error(msg);
    }
    const needsData = ['getMasters','adminOverview','progressList','repairListPaged','serviceAnalytics','serviceTypeAnalytics','weeklyAnalytics','getDetail','systemCheck'];
    if (payload && needsData.includes(payload.action) && res.data === undefined) {
      throw new Error('API trả success nhưng thiếu data cho '+payload.action+'. Response: '+JSON.stringify(res).slice(0,260));
    }
    return res;
  });
}

function initDashboard(){
  USER=requireLogin();
  if(!USER) return;
  document.getElementById('userName').textContent=USER.name||USER.username||'Người dùng';
  document.getElementById('userRole').textContent=(ROLE_LABELS&&ROLE_LABELS[USER.role])||USER.role;
  const today=isoDate(new Date()); PROGRESS_STATE.to=today; const d30=new Date(); d30.setDate(d30.getDate()-30); LIST_STATE.from=isoDate(d30); LIST_STATE.to=today;
  setupRoleUI();
  const target=defaultTab();
  const targetEl=document.getElementById(target); if(targetEl) targetEl.innerHTML=skeleton(4);
  dashboardApi({action:'getMasters'}).then(function(r){
    MASTERS=r.data||{};
    return dashboardApi({action:'systemCheck'},{timeoutMs:35000});
  }).then(function(check){
    window.REPAIR_SYSTEM_CHECK=check.data||{};
    openTab(target);
  }).catch(function(err){
    if(targetEl) targetEl.innerHTML='<div class="v15-error"><b>Không tải được dữ liệu hệ thống</b><br>'+esc(err.message||err)+'</div>';
    showToast(err.message||'Không tải được dữ liệu hệ thống','error');
  });
}
function defaultTab(){const a=ROLE_TABS[USER.role]||['repairs'];return a.includes(USER.home)?USER.home:a[0];}
function setupRoleUI(){
  const allowed=ROLE_TABS[USER.role]||['repairs'];
  document.querySelectorAll('#v15Nav button').forEach(b=>{if(!allowed.includes(b.dataset.tab)) b.remove(); else b.onclick=()=>openTab(b.dataset.tab);});
  const nav=document.getElementById('mobileBottomNav'); nav.innerHTML=allowed.slice(0,5).map(t=>`<button data-tab="${t}" onclick="openTab('${t}')"><span>${iconFor(t)}</span><b>${shortTitle(t)}</b></button>`).join('');
}
function iconFor(t){return {overview:'⌂',progress:'⌁',services:'▦',customers:'◉',weekly:'▥',repairs:'☷',cost:'₫'}[t]||'•'}
function shortTitle(t){return {overview:'Tổng quan',progress:'Tiến độ',services:'Dịch vụ',customers:'Loại DV',weekly:'Tuần',repairs:'Đơn',cost:'Chi phí'}[t]||t}
function openTab(tab){
  const allowed=ROLE_TABS[USER.role]||['repairs']; if(!allowed.includes(tab)) tab=allowed[0]; ACTIVE_TAB=tab;
  document.querySelectorAll('.v15-tab').forEach(x=>x.classList.toggle('active',x.id===tab));
  document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));
  document.getElementById('pageTitle').textContent=TITLES[tab]||tab;
  if(tab==='overview') loadAdminOverview();
  if(tab==='progress') loadProgress();
  if(tab==='services') loadServiceAnalytics();
  if(tab==='customers') loadCustomerAnalytics();
  if(tab==='weekly') loadWeeklyAnalytics();
  if(tab==='repairs') loadRepairList();
  if(tab==='cost') loadCostList();
  window.scrollTo({top:0,behavior:'smooth'});
}
function refreshCurrent(){openTab(ACTIVE_TAB)}
function isoDate(d){return d.toISOString().slice(0,10)}
function fmtNum(v){return Number(v||0).toLocaleString('vi-VN')}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function statusName(s){return String(s||'').replace(/^\d+\.\s*/,'')}
function pct(a,b){return b?Math.round(a*1000/b)/10:0}
function showToast(msg,type){const t=document.getElementById('toast');t.textContent=msg;t.className='toast show '+(type||'');setTimeout(()=>t.classList.remove('show'),2200)}
function skeleton(n=4){return `<div class="v15-skeletons">${Array.from({length:n},()=>'<div class="v15-skeleton"></div>').join('')}</div>`}

function loadAdminOverview(){
  const el=document.getElementById('overview'); el.innerHTML=skeleton(6);
  if(USER.role!=='admin'&&USER.role!=='department_head'){el.innerHTML='<div class="v15-empty">Tài khoản này không có dashboard tài chính.</div>';return;}
  dashboardApi({action:'adminOverview',from:monthStart(),to:isoDate(new Date())},{timeoutMs:35000}).then(r=>renderAdminOverview(r.data||{})).catch(e=>el.innerHTML=`<div class="v15-error">${esc(e.message)}</div>`);
}
function monthStart(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`}
function renderAdminOverview(d){
  const full=USER.role==='admin';
  let html=''; const chk=window.REPAIR_SYSTEM_CHECK||{}; if((d.orders||0)===0 && (chk.parsedRows||0)>0){ html+=`<div class="v15-callout"><b>DATA có ${fmtNum(chk.parsedRows)} đơn nhưng kỳ đang chọn không ra dữ liệu</b><p>Kiểm tra cột Ngày nhận hoặc định dạng ngày. Sample API: ${esc(JSON.stringify((chk.sample||[]).slice(0,2)))}</p></div>`;} html+=`<div class="v15-filter-card"><div><b>Tính từ đầu tháng đến hôm nay</b><small>${esc(d.periodLabel||'')}</small></div><button onclick="loadAdminOverview()">Làm mới</button></div>`;
  html+=`<div class="v15-kpi-grid money-grid">
    <div class="v15-kpi"><small>Doanh thu</small><b>${fmtMoney(d.revenue||0)}</b><span>${fmtNum(d.orders||0)} đơn</span></div>
    <div class="v15-kpi"><small>Chi phí</small><b>${fmtMoney(d.cost||0)}</b><span>Vật tư + công thợ</span></div>
    <div class="v15-kpi profit"><small>Lợi nhuận</small><b>${fmtMoney(d.profit||0)}</b><span>Biên ${pct(d.profit||0,d.revenue||0)}%</span></div>
    <div class="v15-kpi"><small>LN / đơn</small><b>${fmtMoney(d.orders?(d.profit/d.orders):0)}</b><span>Bình quân</span></div>
  </div>`;
  html+=`<div class="v15-section"><div class="v15-section-head"><div><h2>Số đơn theo thợ</h2><p>Nhìn nhanh ai đang giữ nhiều việc và tỷ lệ hoàn thành</p></div></div><div class="tech-grid">${(d.technicians||[]).map(t=>`<button class="tech-card" onclick="goTech('${esc(t.name)}')"><div><b>${esc(t.name||'Chưa gán')}</b><span>${fmtNum(t.total)} đơn</span></div><strong>${fmtNum(t.done)}</strong><small>đã xong · ${fmtNum(t.pending)} còn treo</small><i style="--p:${Math.min(100,pct(t.done,t.total))}%"></i></button>`).join('')||'<div class="v15-empty">Chưa có dữ liệu</div>'}</div></div>`;
  html+=`<div class="v15-section"><div class="v15-section-head"><div><h2>Cảnh báo vận hành</h2><p>Các nhóm cần xử lý trước</p></div></div><div class="alert-grid">
    <button onclick="goStatus('overdue')"><b>${fmtNum(d.overdue||0)}</b><span>Quá hẹn</span></button>
    <button onclick="goStatus('unassigned')"><b>${fmtNum(d.unassigned||0)}</b><span>Chưa gán thợ</span></button>
    <button onclick="goStatus('3. Chờ báo giá')"><b>${fmtNum(d.waitQuote||0)}</b><span>Chờ báo giá</span></button>
    <button onclick="goStatus('6. Chờ linh kiện')"><b>${fmtNum(d.waitParts||0)}</b><span>Chờ linh kiện</span></button>
  </div></div>`;
  if(full) html+=`<div class="v15-section"><div class="v15-section-head"><div><h2>Đi nhanh</h2><p>Không cần mở danh sách tổng</p></div></div><div class="quick-links"><button onclick="openTab('services')">Dịch vụ & dòng máy</button><button onclick="openTab('customers')">Loại dịch vụ</button><button onclick="openTab('weekly')">Báo cáo tuần</button></div></div>`;
  document.getElementById('overview').innerHTML=html;
}
function goTech(name){PROGRESS_STATE.technician=name;PROGRESS_STATE.status='';openTab('progress')}
function goStatus(s){PROGRESS_STATE.status=s;openTab('progress')}

function progressFilters(){
 const sts=(MASTERS.trangThai||[]).filter(s=>!String(s).startsWith('8.')&&!String(s).startsWith('11.'));
 return `<div class="v15-filter-stack"><div class="date-row"><label>Từ ngày<input type="date" id="pgFrom" value="${esc(PROGRESS_STATE.from)}"></label><label>Đến ngày<input type="date" id="pgTo" value="${esc(PROGRESS_STATE.to)}"></label></div><div class="filter-row-v15"><select id="pgTech"><option value="">Tất cả thợ</option>${(MASTERS.kyThuat||[]).map(x=>`<option ${PROGRESS_STATE.technician===x.name?'selected':''}>${esc(x.name)}</option>`).join('')}</select><input id="pgQ" placeholder="Mã sửa / IMEI / SĐT" value="${esc(PROGRESS_STATE.q)}"><button onclick="applyProgressFilters()">Lọc</button></div></div><div class="status-pills"><button class="${!PROGRESS_STATE.status?'active':''}" onclick="setProgressStatus('')">Tất cả pending</button><button class="${PROGRESS_STATE.status==='overdue'?'active':''}" onclick="setProgressStatus('overdue')">Quá hẹn</button><button class="${PROGRESS_STATE.status==='unassigned'?'active':''}" onclick="setProgressStatus('unassigned')">Chưa gán</button>${sts.map(s=>`<button class="${PROGRESS_STATE.status===s?'active':''}" onclick="setProgressStatus('${esc(s)}')">${esc(statusName(s))}</button>`).join('')}</div>`;
}
function loadProgress(){const el=document.getElementById('progress');el.innerHTML=progressFilters()+skeleton(4); dashboardApi({action:'progressList',...PROGRESS_STATE},{timeoutMs:35000}).then(r=>renderProgress(r)).catch(e=>el.innerHTML+=`<div class="v15-error">${esc(e.message)}</div>`)}
function applyProgressFilters(){PROGRESS_STATE.from=document.getElementById('pgFrom').value;PROGRESS_STATE.to=document.getElementById('pgTo').value;PROGRESS_STATE.technician=document.getElementById('pgTech').value;PROGRESS_STATE.q=document.getElementById('pgQ').value;PROGRESS_STATE.page=1;loadProgress()}
function setProgressStatus(s){PROGRESS_STATE.status=s;PROGRESS_STATE.page=1;loadProgress()}
function renderProgress(res){const el=document.getElementById('progress'), rows=res.data||[], meta=res.meta||{};el.innerHTML=progressFilters()+`<div class="v15-summary-line"><b>${fmtNum(meta.total||rows.length)} đơn</b><span>Chỉ hiển thị dữ liệu phù hợp bộ lọc</span></div><div class="repair-card-list">${rows.map(r=>repairCard(r,true)).join('')||'<div class="v15-empty">Không có đơn phù hợp.</div>'}</div>${pager(meta,'progress')}`}
function repairCard(r,allowUpdate){return `<article class="repair-card-v15 ${String(r.overdue).toLowerCase()==='có'?'overdue':''}"><div class="repair-card-head"><div><b>${esc(r.repairId)}</b><span>${esc(r.product||'')}</span></div><em>${esc(statusName(r.status))}</em></div><div class="repair-info"><span>IMEI <b>${esc(r.imei||'')}</b></span><span>Khách <b>${esc(r.customer||'')}</b></span><span>Thợ <b>${esc(r.technician||'Chưa gán')}</b></span><span>Hẹn <b>${esc(dateOnly(r.appointment)||'--')}</b></span></div><div class="repair-service">${esc(r.repairService||r.request||'Chưa có dịch vụ')}</div><div class="repair-actions"><button onclick="viewDetail('${esc(r.repairId)}')">Chi tiết</button>${allowUpdate&&USER.role!=='store'?`<button class="primary" onclick="editStatus('${esc(r.repairId)}')">Cập nhật</button>`:''}${USER.role==='store'?`<button class="primary" onclick="viewDetail('${esc(r.repairId)}')">${fmtMoney(r.actualRevenue||0)}</button>`:''}</div></article>`}
function pager(meta,type){if(!meta||meta.pages<=1)return'';return `<div class="v15-pager"><button ${meta.page<=1?'disabled':''} onclick="changePage('${type}',-1)">←</button><span>${meta.page}/${meta.pages}</span><button ${meta.page>=meta.pages?'disabled':''} onclick="changePage('${type}',1)">→</button></div>`}
function changePage(type,d){if(type==='progress'){PROGRESS_STATE.page+=d;loadProgress()}else{LIST_STATE.page+=d;loadRepairList()}window.scrollTo({top:0,behavior:'smooth'})}

function loadServiceAnalytics(){const el=document.getElementById('services');el.innerHTML=analyticsFilter('svc')+skeleton(5);callAnalytics('serviceAnalytics','svc').then(r=>{const d=r.data||{};el.innerHTML=analyticsFilter('svc')+`<div class="v15-section"><div class="v15-section-head"><div><h2>Dịch vụ × dòng máy</h2><p>Số lần phát sinh trong kỳ</p></div></div><div class="analytics-list">${(d.rows||[]).map((x,i)=>`<div class="analytics-row"><strong>${i+1}</strong><div><b>${esc(x.service)}</b><span>${esc(x.model)}</span></div><em>${fmtNum(x.count)}</em><small>${pct(x.count,d.total)}%</small></div>`).join('')||'<div class="v15-empty">Chưa có dữ liệu</div>'}</div></div><div class="v15-section"><div class="v15-section-head"><div><h2>Vật tư thực tế đã dùng</h2><p>Đếm từ CT_VAT_TU để hỗ trợ quyết định nhập thêm</p></div></div><div class="analytics-list">${(d.materials||[]).map((x,i)=>`<div class="analytics-row"><strong>${i+1}</strong><div><b>${esc(x.material)}</b><span>${esc(x.model)} · ${fmtNum(x.repairCount)} đơn</span></div><em>${fmtNum(x.qty)}</em><small>SL</small></div>`).join('')||'<div class="v15-empty">Chưa có dữ liệu vật tư</div>'}</div></div>`}).catch(e=>el.innerHTML+=`<div class="v15-error">${esc(e.message)}</div>`)}
function loadCustomerAnalytics(){const el=document.getElementById('customers');el.innerHTML=analyticsFilter('cust')+skeleton(4);callAnalytics('serviceTypeAnalytics','cust').then(r=>{const d=r.data||{};el.innerHTML=analyticsFilter('cust')+`<div class="v15-kpi-grid">${(d.rows||[]).map(x=>`<div class="v15-kpi"><small>${esc(x.name)}</small><b>${fmtNum(x.count)}</b><span>${pct(x.count,d.total)}%</span></div>`).join('')}</div><div class="v15-section"><div class="v15-section-head"><div><h2>Khách mới / cũ / bảo hành</h2><p>Suy ra theo SĐT và loại dịch vụ</p></div></div><div class="customer-bars">${(d.customerGroups||[]).map(x=>`<div><label><b>${esc(x.name)}</b><span>${fmtNum(x.count)} · ${pct(x.count,d.customerTotal)}%</span></label><i><u style="width:${pct(x.count,d.customerTotal)}%"></u></i></div>`).join('')}</div></div>`}).catch(e=>el.innerHTML+=`<div class="v15-error">${esc(e.message)}</div>`)}
function loadWeeklyAnalytics(){const el=document.getElementById('weekly');el.innerHTML=skeleton(5);dashboardApi({action:'weeklyAnalytics',weeks:8},{timeoutMs:35000}).then(r=>{const d=r.data||{};el.innerHTML=`<div class="v15-section"><div class="v15-section-head"><div><h2>8 tuần gần nhất</h2><p>Số đơn · doanh thu · chi phí · lợi nhuận</p></div></div><div class="week-list">${(d.rows||[]).map(x=>`<div class="week-card"><div><b>${esc(x.label)}</b><span>${fmtNum(x.orders)} đơn</span></div><div><small>Doanh thu</small><b>${fmtMoney(x.revenue)}</b></div><div><small>Chi phí</small><b>${fmtMoney(x.cost)}</b></div><div><small>Lợi nhuận</small><b>${fmtMoney(x.profit)}</b></div></div>`).join('')||'<div class="v15-empty">Chưa có dữ liệu</div>'}</div></div>`}).catch(e=>el.innerHTML=`<div class="v15-error">${esc(e.message)}</div>`)}
function analyticsFilter(prefix){return `<div class="v15-filter-stack"><div class="date-row"><label>Từ ngày<input type="date" id="${prefix}From" value="${monthStart()}"></label><label>Đến ngày<input type="date" id="${prefix}To" value="${isoDate(new Date())}"></label></div><button onclick="${prefix==='svc'?'loadServiceAnalytics()':'loadCustomerAnalytics()'}">Áp dụng</button></div>`}
function callAnalytics(action,prefix){const f=document.getElementById(prefix+'From'),t=document.getElementById(prefix+'To');return dashboardApi({action,from:f?f.value:monthStart(),to:t?t.value:isoDate(new Date())},{timeoutMs:35000})}

function loadRepairList(){const el=document.getElementById('repairs');el.innerHTML=listFilters()+skeleton(5);dashboardApi({action:'repairListPaged',...LIST_STATE},{timeoutMs:35000}).then(r=>{el.innerHTML=listFilters()+`<div class="v15-summary-line"><b>${fmtNum((r.meta||{}).total||0)} đơn</b><span>30 đơn/trang, không tải toàn bộ DATA</span></div><div class="repair-card-list">${(r.data||[]).map(x=>repairCard(x,USER.role!=='store')).join('')||'<div class="v15-empty">Không có dữ liệu.</div>'}</div>${pager(r.meta||{},'list')}`}).catch(e=>el.innerHTML+=`<div class="v15-error">${esc(e.message)}</div>`)}
function listFilters(){return `<div class="v15-filter-stack"><input id="lsQ" placeholder="Tìm mã sửa / IMEI / SĐT / khách" value="${esc(LIST_STATE.q)}"><div class="date-row"><label>Từ ngày<input id="lsFrom" type="date" value="${esc(LIST_STATE.from)}"></label><label>Đến ngày<input id="lsTo" type="date" value="${esc(LIST_STATE.to)}"></label></div><div class="filter-row-v15"><select id="lsStatus"><option value="">Tất cả trạng thái</option>${(MASTERS.trangThai||[]).map(s=>`<option ${LIST_STATE.status===s?'selected':''}>${esc(statusName(s))}</option>`).join('')}</select><button onclick="applyListFilters()">Tìm</button></div></div>`}
function applyListFilters(){LIST_STATE.q=document.getElementById('lsQ').value;LIST_STATE.from=document.getElementById('lsFrom').value;LIST_STATE.to=document.getElementById('lsTo').value;LIST_STATE.status=document.getElementById('lsStatus').value;LIST_STATE.page=1;if(ACTIVE_TAB==='cost')loadCostList();else loadRepairList()}

function loadCostList(){if(!['admin','department_head'].includes(USER.role))return; const el=document.getElementById('cost');el.innerHTML=`<div class="v15-callout"><b>Chi phí đơn</b><p>Tìm đơn trước rồi mới cập nhật. Không tải toàn bộ dữ liệu tài chính.</p></div>${listFilters()}${skeleton(4)}`;dashboardApi({action:'repairListPaged',...LIST_STATE,includeMoney:true},{timeoutMs:35000}).then(r=>{el.innerHTML=`<div class="v15-callout"><b>Chi phí đơn</b><p>Tìm đơn trước rồi mới cập nhật. Không tải toàn bộ dữ liệu tài chính.</p></div>${listFilters()}<div class="repair-card-list">${(r.data||[]).map(x=>costCard(x)).join('')}</div>`})}
function costCard(r){return `<article class="repair-card-v15"><div class="repair-card-head"><div><b>${esc(r.repairId)}</b><span>${esc(r.product||'')}</span></div><em>${esc(statusName(r.status))}</em></div><div class="money-mini"><span>Thu khách<b>${fmtMoney(r.actualRevenue||0)}</b></span><span>Chi phí<b>${fmtMoney(r.totalCost||0)}</b></span><span>Lợi nhuận<b>${fmtMoney(r.profit||0)}</b></span></div><div class="repair-actions"><button onclick="viewDetail('${esc(r.repairId)}')">Chi tiết</button><button class="primary" onclick="editCost('${esc(r.repairId)}')">Cập nhật chi phí</button></div></article>`}

function viewDetail(id){dashboardApi({action:'getDetail',repairId:id}).then(r=>{const x=r.data||{};showModal(`<div class="modal-head"><div><small>${esc(x.repairId)}</small><h2>${esc(x.product||'Chi tiết đơn')}</h2></div><button onclick="closeModal()">×</button></div><div class="detail-grid"><span>Khách<b>${esc(x.customer||'')}</b></span><span>SĐT<b>${esc(x.phone||'')}</b></span><span>IMEI<b>${esc(x.imei||'')}</b></span><span>Trạng thái<b>${esc(statusName(x.status))}</b></span><span>Kỹ thuật<b>${esc(x.technician||'Chưa gán')}</b></span><span>Dịch vụ<b>${esc(x.repairService||'')}</b></span><span>Hẹn trả<b>${esc(dateTime(x.appointment)||'--')}</b></span>${['admin','department_head','store'].includes(USER.role)?`<span>Thu khách<b>${fmtMoney(x.actualRevenue||0)}</b></span>`:''}</div>`)});}
function editStatus(id){dashboardApi({action:'getDetail',repairId:id}).then(r=>{const x=r.data||{}, statuses=(MASTERS.trangThai||[]);showModal(`<div class="modal-head"><div><small>${esc(id)}</small><h2>Cập nhật xử lý</h2></div><button onclick="closeModal()">×</button></div><div class="modal-form"><label>Trạng thái<select id="mStatus">${statuses.map(s=>`<option value="${esc(s)}" ${s===x.status?'selected':''}>${esc(statusName(s))}</option>`).join('')}</select></label><label>Kỹ thuật<select id="mTech"><option value="">Chưa gán</option>${(MASTERS.kyThuat||[]).map(t=>`<option value="${esc(t.name)}" ${t.name===x.technician?'selected':''}>${esc(t.name)}</option>`).join('')}</select></label><label>Dịch vụ sửa chữa<input id="mService" value="${esc(x.repairService||'')}" placeholder="VD: Thay pin, ép kính"></label><label>Ghi chú kỹ thuật<textarea id="mNote">${esc(x.techNote||'')}</textarea></label><button class="modal-primary" onclick="saveStatus('${esc(id)}')">Lưu cập nhật</button></div>`)});}
function saveStatus(id){const d={status:document.getElementById('mStatus').value,technician:document.getElementById('mTech').value,repairService:document.getElementById('mService').value,techNote:document.getElementById('mNote').value};dashboardApi({action:'updateStatus',repairId:id,data:d}).then(r=>{if(r.success===false)return;closeModal();showToast('Đã cập nhật');refreshCurrent()})}
function editCost(id){dashboardApi({action:'getDetail',repairId:id}).then(r=>{const x=r.data||{};showModal(`<div class="modal-head"><div><small>${esc(id)}</small><h2>Chi phí & lợi nhuận</h2></div><button onclick="closeModal()">×</button></div><div class="modal-form"><label>Vật tư<input id="cMat" value="${esc(x.materialName||'')}"></label><label>Giá vật tư<input id="cMatCost" inputmode="numeric" value="${x.materialCost||0}"></label><label>Công thợ<input id="cLabor" inputmode="numeric" value="${x.laborCost||0}"></label><label>Thực thu<input id="cRevenue" inputmode="numeric" value="${x.actualRevenue||0}"></label><button class="modal-primary" onclick="saveCost('${esc(id)}')">Lưu chi phí</button></div>`)});}
function saveCost(id){dashboardApi({action:'updateCost',repairId:id,data:{materials:[{name:document.getElementById('cMat').value,qty:1,unitPrice:parseMoneyValue(document.getElementById('cMatCost').value),amount:parseMoneyValue(document.getElementById('cMatCost').value)}],laborCost:parseMoneyValue(document.getElementById('cLabor').value),actualRevenue:parseMoneyValue(document.getElementById('cRevenue').value)}}).then(r=>{if(r.success===false)return;closeModal();showToast('Đã cập nhật chi phí');refreshCurrent()})}
function showModal(html){document.getElementById('modalRoot').innerHTML=`<div class="modal-backdrop" onclick="if(event.target===this)closeModal()"><div class="modal-sheet">${html}</div></div>`;document.body.classList.add('modal-open')}
function closeModal(){document.getElementById('modalRoot').innerHTML='';document.body.classList.remove('modal-open')}

document.addEventListener('DOMContentLoaded',initDashboard);
