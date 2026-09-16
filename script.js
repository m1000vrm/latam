let s=588;const el=document.getElementById('timer');setInterval(()=>{if(s<=0)s=588;s--;let m=Math.floor(s/60),x=s%60;el.textContent=String(m).padStart(2,'0')+':'+String(x).padStart(2,'0')},1000);
