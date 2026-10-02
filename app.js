var $=function(s){return document.querySelector(s)};
var storeKey='armin-os-v06';
var state;
try{state=JSON.parse(localStorage.getItem(storeKey)||'{}')}catch(e){state={}}
state.tasks=state.tasks||[];
state.energy=state.energy||5;
state.mood=state.mood||5;
state.sleepHours=state.sleepHours||7.25;
state.learnMin=state.learnMin||20;
state.robotMin=state.robotMin||20;
state.spendTotal=state.spendTotal||0;
state.waterCount=state.waterCount||0;
state.cigarettes=state.cigarettes||0;
state.bowel=state.bowel||'0';
state.stool=state.stool||'hard';
state.giPain=state.giPain||'0';
state.dayType=state.dayType||'day';
state.sleepTime=state.sleepTime||'22:45';
state.wakeTime=state.wakeTime||'06:00';
state.note=state.note||{};
state.events=state.events||[];
state.hunger=state.hunger||5;
state.thirst=state.thirst||5;
state.waterMl=state.waterMl||0;
state.dayKey=state.dayKey||new Date().toISOString().slice(0,10);
var todayKey=new Date().toISOString().slice(0,10);
if(state.dayKey!==todayKey){state.dayKey=todayKey;state.tasks=[];state.energy=5;state.mood=5;state.sleepHours=7;state.learnMin=0;state.robotMin=0;state.spendTotal=0;state.waterMl=0;state.cigarettes=0;state.bowel='0';state.stool='hard';state.giPain='0';state.events=[];state.note={};state.hunger=5;state.thirst=5;}

function save(){localStorage.setItem(storeKey,JSON.stringify(state))}
function updateMeters(){
 $('#energyValue').textContent=state.energy+'/10';$('#moodValue').textContent=state.mood+'/10';
 $('#learnText').textContent=state.learnMin+' دقیقه';$('#robotText').textContent=state.robotMin+' دقیقه';
 $('#learnBar').style.width=Math.min(100,(state.learnMin/60)*100)+'%';
 $('#robotBar').style.width=Math.min(100,(state.robotMin/60)*100)+'%';
 $('#spendTotal').textContent=Number(state.spendTotal).toLocaleString('fa-IR');
 $('#waterCount').textContent=state.waterMl.toLocaleString('fa-IR');
 $('#cigaretteTotal').textContent=state.cigarettes.toLocaleString('fa-IR');
 $('#hunger').value=state.hunger;$('#thirst').value=state.thirst;
 renderEvents();
 var advice='فعلاً وضعیتت متوسط است؛ برنامه را سبک و پایدار نگه دار.';
 if(state.sleepHours<7){advice='خواب کم ثبت شده؛ امروز اولویت با غذا، آب و ریکاوری است.'}
 else if(state.energy<=4){advice='انرژی پایین است؛ امروز کار اصلی + تغذیه منظم + حداکثر 10 دقیقه یادگیری کافی است.'}
 else if(state.energy>=8 && state.sleepHours>=7){advice='انرژی خوب است؛ 20–30 دقیقه یادگیری یا ربات مناسب است.'}
 if(state.cigarettes>0){advice+=' سیگار را فعلاً فقط ثبت کن؛ بعداً برنامه کاهش/ترک را مرحله‌ای می‌سازیم.'}
 $('#energyAdvice').textContent=advice;
}
function renderEvents(){
 var box=$('#eventLog');if(!box)return;box.innerHTML='';
 if(!state.events.length){box.innerHTML='<p class="muted small">هنوز ثبت سریع انجام نشده.</p>';return}
 state.events.slice(-8).reverse().forEach(function(ev){
  var d=document.createElement('div');d.className='event-row';
  d.innerHTML='<b></b><span></span><small></small>';
  d.querySelector('b').textContent=ev.time+' — '+ev.event;
  d.querySelector('span').textContent='انرژی '+ev.energy+'/10 | گرسنگی '+ev.hunger+'/10 | تشنگی '+ev.thirst+'/10 | آب '+ev.waterMl+'ml';
  d.querySelector('small').textContent=ev.cigarettes+' نخ سیگار';
  box.appendChild(d);
 });
}
function logEvent(eventName){
 var now=new Date();
 var time=new Intl.DateTimeFormat('fa-IR',{hour:'2-digit',minute:'2-digit'}).format(now);
 state.events.push({time:time,event:eventName,energy:state.energy,hunger:state.hunger,thirst:state.thirst,waterMl:state.waterMl,cigarettes:state.cigarettes});
 save();renderEvents();
}
function buildReport(){
 var dateFa=new Intl.DateTimeFormat('fa-IR',{weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(new Date());
 var tasksDone=state.tasks.filter(function(t){return t.done}).length;
 var tasksAll=state.tasks.length;
 var events=state.events.map(function(e){return e.time+' | '+e.event+' | انرژی '+e.energy+'/10 | گرسنگی '+e.hunger+'/10 | تشنگی '+e.thirst+'/10 | آب '+e.waterMl+'ml | سیگار '+e.cigarettes+' نخ'}).join('\n')||'ثبت نشده';
 return 'گزارش ARMIN OS — '+dateFa+'\n'+
 'شیفت شرکت: 07:40 ورود | 08:00 شروع تولید | 10:00 استراحت | 12:45 ناهار | 15:00 استراحت | 17:00 پایان/نظافت\n'+
 'خواب: '+state.sleepHours+' ساعت | انرژی پایان/فعلی: '+state.energy+'/10 | حال: '+state.mood+'/10\n'+
 'آب: '+state.waterMl+' ml | سیگار: '+state.cigarettes+' نخ\n'+
 'گوارش: دفع='+state.bowel+' | مدفوع='+state.stool+' | نفخ/درد='+state.giPain+'\n'+
 'غذا: صبحانه='+!!state.breakfast+' | ناهار='+!!state.lunch+' | شام='+!!state.dinner+' | میوه='+!!state.fruit+' | سبزی='+!!state.veg+' | پروتئین='+!!state.protein+'\n'+
 'رشد: یادگیری '+state.learnMin+' دقیقه | ربات '+state.robotMin+' دقیقه\n'+
 'کارها: '+tasksDone+'/'+tasksAll+' انجام شد\n'+
 'رویدادها:\n'+events+'\n'+
 'گزارش شب: '+(state.note.text||'ثبت نشده');
}
function renderTasks(){
 var box=$('#tasks');box.innerHTML='';
 if(!state.tasks.length){box.innerHTML='<p class="muted">هنوز کاری ثبت نشده. فقط سه کار واقعاً مهم را اضافه کن.</p>';return}
 state.tasks.forEach(function(t,i){
  var row=document.createElement('div');row.className='item'+(t.done?' done':'');
  row.innerHTML='<input type="checkbox" '+(t.done?'checked':'')+'><span></span><button aria-label="حذف">×</button>';
  row.querySelector('span').textContent=t.text;
  row.querySelector('input').onchange=function(e){t.done=e.target.checked;save();renderTasks()};
  row.querySelector('button').onclick=function(){state.tasks.splice(i,1);save();renderTasks()};
  box.appendChild(row);
 });
}
function syncChecks(){
 ['breakfast','lunch','dinner','fruit','veg','protein'].forEach(function(id){
  $('#'+id).checked=!!state[id];
  $('#'+id).onchange=function(e){state[id]=e.target.checked;save()};
 });
}
function makePlan(){
 var type=state.dayType,p=[];
 if(type==='day'){
  p=[['06:00','بیداری + آب','چک‌این سریع؛ بعد آماده‌شدن بدون کار سنگین.'],
     ['06:20','صبحانه','۲ تخم‌مرغ + نان سبوس‌دار + خیار/گوجه + یک میوه.'],
     ['07:40','ورود گیت','آماده‌شدن برای سالن؛ تا 08:00 وارد تولید شو.'],
     ['08:00–10:00','تولید','فقط کار اصلی؛ هر نکته فنی مهم را سریع ثبت کن.'],
     ['10:00–10:15','استراحت ۱','آب + میوه؛ در صورت گرسنگی ماست/مقداری مغزها.'],
     ['10:15–12:45','تولید','حفظ ریتم و آب‌رسانی بدون زیاده‌روی.'],
     ['12:45–13:20','ناهار','غذای شرکت؛ اول پروتئین و سبزیجات، سپس مقدار متعادل برنج/نان.'],
     ['13:20–15:00','تولید','بعد از ناهار آرام و دقیق جلو برو.'],
     ['15:00–15:15','استراحت ۲','آب + یک میوه یا میان‌وعده کوچک.'],
     ['15:15–17:00','تولید','بلوک آخر؛ فقط کارهای لازم و ثبت نکات فنی.'],
     ['17:00–خروج','نظافت + خروج','پایان کار؛ بعد از برگشت اول ریکاوری.'],
     ['بعد کار','غذا + دوش + استراحت','قبل از رشد، بدن را جمع کن.'],
     ['20–30د','یادگیری / ربات','۲۰ دقیقه کافی است؛ با انرژی پایین ۱۰ دقیقه.'],
     [state.sleepTime,'خواب','هدف پایه: ۷+ ساعت خواب.']];
 }else if(type==='night'){
  p=[['بعد بیداری','آب + غذا + چک‌این','اول وضعیت انرژی را بسنج.'],['قبل شیفت','سه اولویت','یک هدف کاری و یک هدف شخصی کافی است.'],['شیفت','کار اصلی','ایمنی، دقت و ثبت مشکلات فنی.'],['بعد شیفت','خواب / ریکاوری','اول خواب؛ کارهای سنگین را عقب بینداز.'],['بعد بیداری','20دقیقه رشد','بلوک کوتاه برای ربات یا یادگیری.']];
 }else{
  p=[['صبح','شروع بدون عجله','خواب کافی، آب و صبحانه.'],['بلوک 1','کار عمیق','یک کار مهم زندگی یا پروژه.'],['بلوک 2','یادگیری / ربات','30–60 دقیقه کار واقعی.'],['عصر','طبیعت / حرکت / زندگی','بدن را از حالت کار خارج کن.'],['شب','برنامه فردا','سه اولویت را مشخص کن.']];
 }
 var box=$('#plan');box.innerHTML='';
 p.forEach(function(x){
  var d=document.createElement('div');d.className='plan-item';
  d.innerHTML='<div class="plan-time"></div><div><b></b><div class="plan-note"></div></div>';
  d.querySelector('.plan-time').textContent=x[0];d.querySelector('b').textContent=x[1];d.querySelector('.plan-note').textContent=x[2];box.appendChild(d);
 });
 $('#headline').textContent=type==='off'?'امروز برای بازیابی و پیشروی آگاهانه است.':(type==='day'?'برنامه شرکت قفل شد: 07:40 ورود، 10:00 استراحت، 12:45 ناهار، 15:00 استراحت، 17:00 پایان.':'امروز معیار موفقیت: حفظ انرژی + شیفت ایمن + یک قدم رشد.');
}
var date=new Date();
$('#today').textContent=new Intl.DateTimeFormat('fa-IR',{weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(date);
$('#dayType').value=state.dayType;$('#sleepTime').value=state.sleepTime;$('#wakeTime').value=state.wakeTime;
$('#energy').value=state.energy;$('#mood').value=state.mood;$('#sleepHours').value=state.sleepHours;
$('#learnMin').value=state.learnMin;$('#robotMin').value=state.robotMin;
$('#addTask').onclick=function(){var v=$('#taskInput').value.trim();if(!v||state.tasks.length>=3)return;state.tasks.push({text:v,done:false});$('#taskInput').value='';save();renderTasks()};
$('#focusBtn').onclick=function(){$('#headline').textContent='الان فقط مهم‌ترین کار ناتمام را 20 دقیقه جلو ببر.'};
$('#buildPlan').onclick=function(){makePlan();window.scrollTo(0,0)};
$('#dayType').onchange=function(e){state.dayType=e.target.value;save();makePlan()};
$('#sleepTime').onchange=function(e){state.sleepTime=e.target.value;save();makePlan()};
$('#wakeTime').onchange=function(e){state.wakeTime=e.target.value;save();makePlan()};
$('#energy').oninput=function(e){state.energy=+e.target.value;updateMeters();save()};
$('#mood').oninput=function(e){state.mood=+e.target.value;updateMeters();save()};
$('#sleepHours').oninput=function(e){state.sleepHours=Math.max(0,+e.target.value||0);updateMeters();save()};
$('#hunger').oninput=function(e){state.hunger=+e.target.value;save()};
$('#thirst').oninput=function(e){state.thirst=+e.target.value;save()};
$('#learnMin').oninput=function(e){state.learnMin=Math.max(0,+e.target.value||0);updateMeters();save()};
$('#robotMin').oninput=function(e){state.robotMin=Math.max(0,+e.target.value||0);updateMeters();save()};
$('#water100').onclick=function(){state.waterMl+=100;save();updateMeters()};
$('#water300').onclick=function(){state.waterMl+=300;save();updateMeters()};
$('#water600').onclick=function(){state.waterMl+=600;save();updateMeters()};
$('#waterReset').onclick=function(){state.waterMl=0;save();updateMeters()};
$('#saveCigs').onclick=function(){state.cigarettes=Math.max(0,+$('#cigarettes').value||0);save();updateMeters()};
$('#bowel').onchange=function(e){state.bowel=e.target.value;save()};
$('#stool').onchange=function(e){state.stool=e.target.value;save()};
$('#giPain').onchange=function(e){state.giPain=e.target.value;save()};
$('#addSpend').onclick=function(){var v=parseFloat(String($('#spendAmount').value).replace(/,/g,''));if(isNaN(v)||v<=0)return;state.spendTotal+=v;$('#spendAmount').value='';updateMeters();save()};
$('#saveNote').onclick=function(){state.note={text:$('#note').value,date:new Date().toISOString()};save();$('#saved').textContent='گزارش ذخیره شد.';setTimeout(function(){$('#saved').textContent=''},1800)};
Array.prototype.forEach.call(document.querySelectorAll('.event-btn'),function(btn){btn.onclick=function(){logEvent(btn.getAttribute('data-event'))}});
$('#exportReport').onclick=function(){var report=buildReport();if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(report).then(function(){$('#saved').textContent='گزارش کامل کپی شد؛ آن را همین‌جا برای ChatGPT بفرست.'}).catch(function(){prompt('گزارش را کپی کن و در ChatGPT بفرست:',report)})}else{prompt('گزارش را کپی کن و در ChatGPT بفرست:',report)}};
$('#note').value=state.note.text||'';
$('#cigarettes').value=state.cigarettes;$('#bowel').value=state.bowel;$('#stool').value=state.stool;$('#giPain').value=state.giPain;
updateMeters();renderTasks();syncChecks();makePlan();