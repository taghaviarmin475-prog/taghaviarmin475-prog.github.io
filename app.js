var $=function(s){return document.querySelector(s)};
var storeKey='armin-os-v02';
var state;
try{state=JSON.parse(localStorage.getItem(storeKey)||'{}')}catch(e){state={}}
state.tasks=state.tasks||[];
state.energy=state.energy||5;
state.mood=state.mood||5;
state.sleepQuality=state.sleepQuality||5;
state.learnMin=state.learnMin||20;
state.robotMin=state.robotMin||20;
state.spendTotal=state.spendTotal||0;
state.dayType=state.dayType||'day';
state.sleepTime=state.sleepTime||'23:30';
state.wakeTime=state.wakeTime||'06:00';
state.note=state.note||'';

function save(){localStorage.setItem(storeKey,JSON.stringify(state))}
function updateMeters(){
  $('#energyValue').textContent=state.energy+'/10';
  $('#moodValue').textContent=state.mood+'/10';
  $('#sleepValue').textContent=state.sleepQuality+'/10';
  $('#learnText').textContent=state.learnMin+' دقیقه';
  $('#robotText').textContent=state.robotMin+' دقیقه';
  $('#learnBar').style.width=Math.min(100,(state.learnMin/60)*100)+'%';
  $('#robotBar').style.width=Math.min(100,(state.robotMin/60)*100)+'%';
  $('#spendTotal').textContent=Number(state.spendTotal).toLocaleString('fa-IR');
}
function renderTasks(){
  var box=$('#tasks'); box.innerHTML='';
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
function makePlan(){
  var type=state.dayType;
  var p=[];
  if(type==='day'){
    p=[['06:00','بیداری + آب + آماده‌شدن','با توجه به ورود 07:40 به گیت، صبح را فشرده و بدون کار سنگین شروع کن.'],
       ['06:20','صبحانه','یک صبحانه ساده و قابل‌تحمل؛ هدف امروز حفظ انرژی در شرکت است.'],
       ['07:40','ورود گیت ترام چاپ','از اینجا تا 17:00، اولویت با کار دقیق، ایمنی و ثبت نکات فنی است.'],
       ['17:00','پایان شیفت موقت 8ساعته','فعلاً تا پایان این دوره کوتاه؛ بعد از برگشت مستقیماً سراغ ریکاوری برو.'],
       ['بعد کار','غذا + دوش + ریکاوری','قبل از هر یادگیری، بدن را جمع کن.'],
       ['20–30د','رشد','فقط یک بلوک کوتاه برای یادگیری یا پروژه ربات.'],
       [state.sleepTime,'خاموشی روز','گزارش کوتاه و خواب.']];
  }else if(type==='night'){
    p=[['07:40','ورود گیت ترام چاپ','شیفت موقت 8ساعته امروز: کار دقیق، ایمنی و ثبت مشکلات فنی.'],
       ['قبل شیفت','مرور سه کار اصلی','یک هدف کاری و یک هدف شخصی کافی است.'],
       ['شیفت','کار اصلی','امنیت و دقت؛ یادداشت مشکلات فنی برای تحلیل بعدی.'],
       ['بعد شیفت','خواب / ریکاوری','اول خواب؛ کارهای سنگین را عقب بینداز.'],
       ['بعد بیداری','20دقیقه رشد','بلوک کوتاه و قابل‌اجرا برای ربات یا یادگیری.']];
  }else{
    p=[['صبح','شروع بدون عجله','خواب کافی، آب و صبحانه.'],
       ['بلوک 1','کار عمیق','یک کار مهم زندگی یا پروژه.'],
       ['بلوک 2','یادگیری / ربات','30–60 دقیقه کار واقعی، نه صرفاً تماشا.'],
       ['عصر','طبیعت / حرکت / زندگی','بدن و ذهن را از حالت کار خارج کن.'],
       ['شب','برنامه فردا','سه اولویت را مشخص کن و روز را ببند.']];
  }
  var box=$('#plan');box.innerHTML='';
  p.forEach(function(x){
    var d=document.createElement('div');d.className='plan-item';
    d.innerHTML='<div class="plan-time"></div><div><b></b><div class="plan-note"></div></div>';
    d.querySelector('.plan-time').textContent=x[0];
    d.querySelector('b').textContent=x[1];
    d.querySelector('.plan-note').textContent=x[2];
    box.appendChild(d);
  });
  $('#headline').textContent=type==='off'?'امروز برای بازیابی و پیشروی آگاهانه است.':(type==='day'?'فردا: ورود گیت 07:40 تا پایان موقت 17:00؛ معیار موفقیت، کار دقیق + حفظ انرژی + ریکاوری + یک قدم رشد.':'امروز معیار موفقیت: حفظ انرژی + شیفت ایمن + یک قدم رشد.');
}
var date=new Date();
$('#today').textContent=new Intl.DateTimeFormat('fa-IR',{weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(date);
$('#dayType').value=state.dayType;
$('#sleepTime').value=state.sleepTime;$('#wakeTime').value=state.wakeTime;
$('#energy').value=state.energy;$('#mood').value=state.mood;$('#sleepQuality').value=state.sleepQuality;
$('#learnMin').value=state.learnMin;$('#robotMin').value=state.robotMin;$('#note').value=state.note;

$('#addTask').onclick=function(){var v=$('#taskInput').value.trim();if(!v||state.tasks.length>=3)return;if(state.tasks.length<3){state.tasks.push({text:v,done:false});$('#taskInput').value='';save();renderTasks()}};
$('#focusBtn').onclick=function(){$('#headline').textContent='الان فقط مهم‌ترین کار ناتمام را 20 دقیقه جلو ببر.'};
$('#buildPlan').onclick=function(){makePlan();window.scrollTo({top:0,behavior:'smooth'})};
$('#dayType').onchange=function(e){state.dayType=e.target.value;save();makePlan()};
$('#sleepTime').onchange=function(e){state.sleepTime=e.target.value;save();makePlan()};
$('#wakeTime').onchange=function(e){state.wakeTime=e.target.value;save();makePlan()};
$('#energy').oninput=function(e){state.energy=+e.target.value;updateMeters();save()};
$('#mood').oninput=function(e){state.mood=+e.target.value;updateMeters();save()};
$('#sleepQuality').oninput=function(e){state.sleepQuality=+e.target.value;updateMeters();save()};
$('#learnMin').oninput=function(e){state.learnMin=Math.max(0,+e.target.value||0);updateMeters();save()};
$('#robotMin').oninput=function(e){state.robotMin=Math.max(0,+e.target.value||0);updateMeters();save()};
$('#addSpend').onclick=function(){var v=parseFloat(String($('#spendAmount').value).replace(/,/g,''));if(isNaN(v)||v<=0)return;state.spendTotal+=v;$('#spendAmount').value='';updateMeters();save()};
$('#saveNote').onclick=function(){state.note=$('#note').value;state.noteDate=new Date().toISOString();save();$('#saved').textContent='گزارش ذخیره شد.';setTimeout(function(){$('#saved').textContent=''},1800)};

updateMeters();renderTasks();makePlan();