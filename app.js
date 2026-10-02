var $=function(s){return document.querySelector(s)};
var storeKey='armin-os-v04';
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

function save(){localStorage.setItem(storeKey,JSON.stringify(state))}
function updateMeters(){
 $('#energyValue').textContent=state.energy+'/10';$('#moodValue').textContent=state.mood+'/10';
 $('#learnText').textContent=state.learnMin+' دقیقه';$('#robotText').textContent=state.robotMin+' دقیقه';
 $('#learnBar').style.width=Math.min(100,(state.learnMin/60)*100)+'%';
 $('#robotBar').style.width=Math.min(100,(state.robotMin/60)*100)+'%';
 $('#spendTotal').textContent=Number(state.spendTotal).toLocaleString('fa-IR');
 $('#waterCount').textContent=state.waterCount.toLocaleString('fa-IR');
 $('#cigaretteTotal').textContent=state.cigarettes.toLocaleString('fa-IR');
 var advice='فعلاً وضعیتت متوسط است؛ برنامه را سبک و پایدار نگه دار.';
 if(state.sleepHours<7){advice='خواب کم ثبت شده؛ امروز اولویت با غذا، آب و ریکاوری است.'}
 else if(state.energy<=4){advice='انرژی پایین است؛ امروز کار اصلی + تغذیه منظم + حداکثر 10 دقیقه یادگیری کافی است.'}
 else if(state.energy>=8 && state.sleepHours>=7){advice='انرژی خوب است؛ 20–30 دقیقه یادگیری یا ربات مناسب است.'}
 if(state.cigarettes>0){advice+=' سیگار را فعلاً فقط ثبت کن؛ بعداً برنامه کاهش/ترک را مرحله‌ای می‌سازیم.'}
 $('#energyAdvice').textContent=advice;
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
  p=[['06:00','بیداری + آب','گوشی را فقط برای چک‌این باز کن؛ بعد حرکت.'],
     ['06:20','صبحانه','پروتئین + نان سبوس‌دار + سبزی/میوه.'],
     ['07:40','ورود گیت ترام چاپ','تمرکز اصلی: کار دقیق، ایمنی، و ثبت نکات فنی.'],
     ['12:30','ناهار','نصف سبزیجات + یک‌چهارم پروتئین + یک‌چهارم برنج/نان.'],
     ['15:30','میان‌وعده','برای جلوگیری از افت انرژی: میوه + ماست/مغزها.'],
     ['17:00','پایان شیفت موقت','فعلاً تا پایان این دوره 8 ساعته.'],
     ['بعد کار','غذا + دوش + ریکاوری','اول بدن؛ بعد سراغ رشد.'],
     ['20–30د','یادگیری / ربات','فقط یک بلوک کوتاه؛ با انرژی پایین حتی 10 دقیقه کافی است.'],
     [state.sleepTime,'خواب','هدف پایه: حداقل 7 ساعت خواب شبانه.']];
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
 $('#headline').textContent=type==='off'?'امروز برای بازیابی و پیشروی آگاهانه است.':(type==='day'?'فردا: 07:40 تا 17:00؛ موفقیت یعنی کار دقیق + تغذیه منظم + ریکاوری + یک قدم رشد.':'امروز معیار موفقیت: حفظ انرژی + شیفت ایمن + یک قدم رشد.');
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
$('#learnMin').oninput=function(e){state.learnMin=Math.max(0,+e.target.value||0);updateMeters();save()};
$('#robotMin').oninput=function(e){state.robotMin=Math.max(0,+e.target.value||0);updateMeters();save()};
$('#waterPlus').onclick=function(){state.waterCount++;save();updateMeters()};
$('#waterReset').onclick=function(){state.waterCount=0;save();updateMeters()};
$('#saveCigs').onclick=function(){state.cigarettes=Math.max(0,+$('#cigarettes').value||0);save();updateMeters()};
$('#bowel').onchange=function(e){state.bowel=e.target.value;save()};
$('#stool').onchange=function(e){state.stool=e.target.value;save()};
$('#giPain').onchange=function(e){state.giPain=e.target.value;save()};
$('#addSpend').onclick=function(){var v=parseFloat(String($('#spendAmount').value).replace(/,/g,''));if(isNaN(v)||v<=0)return;state.spendTotal+=v;$('#spendAmount').value='';updateMeters();save()};
$('#saveNote').onclick=function(){state.note={text:$('#note').value,date:new Date().toISOString()};save();$('#saved').textContent='گزارش ذخیره شد.';setTimeout(function(){$('#saved').textContent=''},1800)};
$('#note').value=state.note.text||'';
$('#cigarettes').value=state.cigarettes;$('#bowel').value=state.bowel;$('#stool').value=state.stool;$('#giPain').value=state.giPain;
updateMeters();renderTasks();syncChecks();makePlan();