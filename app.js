const $=s=>document.querySelector(s);
const storeKey='armin-os-v01';
const state=JSON.parse(localStorage.getItem(storeKey)||'{}');
state.tasks=state.tasks||[];
state.energy=state.energy||5;
state.mood=state.mood||5;
state.note=state.note||'';

const date=new Date();
$('#today').textContent=new Intl.DateTimeFormat('fa-IR',{weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(date);
$('#energy').value=state.energy; $('#mood').value=state.mood; $('#note').value=state.note;
function save(){localStorage.setItem(storeKey,JSON.stringify(state));}
function render(){
  const box=$('#tasks'); box.innerHTML='';
  state.tasks.forEach((t,i)=>{
    const row=document.createElement('div'); row.className='item'+(t.done?' done':'');
    row.innerHTML='<input type="checkbox" '+(t.done?'checked':'')+'><span></span><button aria-label="حذف">×</button>';
    row.querySelector('span').textContent=t.text;
    row.querySelector('input').onchange=e=>{t.done=e.target.checked;save();render();};
    row.querySelector('button').onclick=()=>{state.tasks.splice(i,1);save();render();};
    box.appendChild(row);
  });
}
$('#addTask').onclick=()=>{
  const v=$('#taskInput').value.trim(); if(!v)return;
  if(state.tasks.length<3){state.tasks.push({text:v,done:false});$('#taskInput').value='';save();render();}
};
$('#focusBtn').onclick=()=>$('#focusText').textContent='الان فقط مهم‌ترین کار ناتمام را 20 دقیقه جلو ببر.';
$('#energy').oninput=e=>{$('#energyValue').textContent=e.target.value+'/10';state.energy=+e.target.value;save();};
$('#mood').oninput=e=>{$('#moodValue').textContent=e.target.value+'/10';state.mood=+e.target.value;save();};
$('#saveNote').onclick=()=>{state.note=$('#note').value;state.noteDate=new Date().toISOString();save();$('#saved').textContent='گزارش ذخیره شد.';setTimeout(()=>$('#saved').textContent='',1800)};
render();