const TYPE_LABELS={invoices:'Invoice',support:'Support',projects:'Project',sales:'Sales'};
function normalize(type,row){
  const required=['id','account','action','owner'];
  const missing=required.filter(k=>!String(row[k]??'').trim());
  const validDate=/^\d{4}-\d{2}-\d{2}$/.test(String(row.due||''));
  const validPriority=['HIGH','MEDIUM','LOW'].includes(String(row.priority||'').toUpperCase());
  const review=missing.length||!validDate||!validPriority;
  const reasons=[];
  if(missing.length) reasons.push('missing '+missing.join(', '));
  if(!validDate) reasons.push('due date unresolved');
  if(!validPriority) reasons.push('priority unresolved');
  return {
    source_type:type, source_record_id:row.id||'(missing id)',
    original_fields:{...row}, normalized_fields:{account:row.account||'',action:row.action||'',owner:row.owner||'',due:validDate?row.due:null,priority:validPriority?row.priority.toUpperCase():null},
    mapping_status:review?'REVIEW':'MAPPED', mapping_reason:review?reasons.join('; '):'deterministic field map',
    preserved_source_reference:`${type}:${row.id||'unknown'}`
  };
}
function combine(data){return Object.entries(data).flatMap(([t,rows])=>rows.map(r=>normalize(t,r))).sort((a,b)=>{
  if(a.mapping_status!==b.mapping_status)return a.mapping_status==='REVIEW'?1:-1;
  const p={HIGH:0,MEDIUM:1,LOW:2,null:3}; return (p[a.normalized_fields.priority]??3)-(p[b.normalized_fields.priority]??3)||String(a.normalized_fields.due||'9999').localeCompare(String(b.normalized_fields.due||'9999'));
});}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function render(items){
  const el=document.querySelector('#board'); el.innerHTML='';
  items.forEach(i=>{const n=i.normalized_fields; const card=document.createElement('article');card.className='card '+i.mapping_status.toLowerCase();card.innerHTML=`<div class="top"><span class="type">${esc(TYPE_LABELS[i.source_type])}</span><span class="status">${esc(i.mapping_status)}</span></div><h2>${esc(n.action||'Unresolved action')}</h2><p class="account">${esc(n.account||'Unknown account')}</p><dl><div><dt>Owner</dt><dd>${esc(n.owner||'REVIEW')}</dd></div><div><dt>Due</dt><dd>${esc(n.due||'REVIEW')}</dd></div><div><dt>Priority</dt><dd>${esc(n.priority||'REVIEW')}</dd></div></dl><details><summary>Source & mapping</summary><p><b>Source:</b> ${esc(i.preserved_source_reference)}</p><p><b>Reason:</b> ${esc(i.mapping_reason)}</p></details>`;el.appendChild(card)});
  document.querySelector('#mapped').textContent=items.filter(x=>x.mapping_status==='MAPPED').length;
  document.querySelector('#review').textContent=items.filter(x=>x.mapping_status==='REVIEW').length;
  document.querySelector('#types').textContent=new Set(items.map(x=>x.source_type)).size;
}
async function main(){const data=await fetch('./data/sources.json').then(r=>r.json()); const items=combine(data); render(items); window.DAY07={normalize,combine,items};}
if(typeof window!=='undefined') main();
if(typeof module!=='undefined') module.exports={normalize,combine};
