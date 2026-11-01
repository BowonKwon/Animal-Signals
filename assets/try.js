(function(){
var ctx=null;function ac(){if(!ctx){var A=window.AudioContext||window.webkitAudioContext;if(!A)return null;ctx=new A()}if(ctx.state==="suspended")ctx.resume();return ctx}
function L(){return document.documentElement.className.indexOf("lang-en")>=0?"en":"ko"}
var node=document.getElementById("coda-data");
if(node){var D=JSON.parse(node.textContent);
var sel=document.getElementById("codatype"),len=document.getElementById("codalen"),lo=document.getElementById("codalenout"),
info=document.getElementById("codainfo"),svg=document.getElementById("codasvg");
D.types.forEach(function(t,i){var o=document.createElement("option");o.value=i;o.textContent=t.type+" ("+t.n_clicks+" clicks, n="+t.n+")";sel.appendChild(o)});
function cur(){return D.types[+sel.value]}
function times(){var t=cur(),T=+len.value,acc=0,out=[0];t.rhythm.forEach(function(r){acc+=r*T;out.push(acc)});return out}
function draw(){var ts=times(),T=2.0,w=600,s="";s+='<line x1="10" y1="45" x2="590" y2="45" stroke="#bbb"/>';
for(var x=0;x<=2.0001;x+=0.5){var px=10+580*x/T;s+='<line x1="'+px+'" y1="42" x2="'+px+'" y2="48" stroke="#999"/><text x="'+px+'" y="58" font-size="9" text-anchor="middle" fill="#666">'+x.toFixed(1)+'s</text>'}
ts.forEach(function(t){var px=10+580*t/T;s+='<line x1="'+px+'" y1="8" x2="'+px+'" y2="42" stroke="#1d4f73" stroke-width="3"/>'});svg.innerHTML=s;
lo.textContent=(+len.value).toFixed(2);var t=cur();
info.textContent=(L()==="ko"?("원 데이터 중앙값 길이 "+t.median_duration+"초, 코다 "+t.n+"개. 클릭 간격 비율 "):("Data median length "+t.median_duration+" s, "+t.n+" codas. Interval proportions "))+t.rhythm.map(function(r){return r.toFixed(3)}).join(" : ")}
function reset(){len.value=cur().median_duration;draw()}
sel.addEventListener("change",reset);len.addEventListener("input",draw);document.getElementById("codareset").addEventListener("click",reset);
document.getElementById("langbtn").addEventListener("click",function(){setTimeout(draw,0)});
document.getElementById("codaplay").addEventListener("click",function(){var c=ac();if(!c)return;var sr=c.sampleRate,n=Math.floor(sr*0.004),buf=c.createBuffer(1,n,sr),dd=buf.getChannelData(0);
for(var i=0;i<n;i++){dd[i]=(Math.random()*2-1)*Math.exp(-i/(sr*0.0006))}
var t0=c.currentTime+0.1;times().forEach(function(t){var s=c.createBufferSource();s.buffer=buf;var g=c.createGain();g.gain.value=0.8;s.connect(g);g.connect(c.destination);s.start(t0+t)})});
reset();
var bw=document.getElementById("bw"),bo=document.getElementById("bwout"),cv=document.getElementById("kde"),np=document.getElementById("npeaks"),pl=document.getElementById("peaklist");
var H=D.hist,grid=[];for(var g=0;g<=165;g++)grid.push(+(0.1+0.01*g).toFixed(2));
function kde(h){var out=[];for(var i=0;i<grid.length;i++){var s=0,x=grid[i];for(var j=0;j<H.counts.length;j++){var c=H.counts[j];if(!c)continue;var z=(x-(H.start+H.width*(j+0.5)))/h;if(z>6||z<-6)continue;s+=c*Math.exp(-0.5*z*z)}out.push(s/(H.total*h*Math.sqrt(2*Math.PI)))}return out}
function peaks(e){var p=[];for(var i=1;i<e.length-1;i++){if(e[i]>e[i-1]&&e[i]>e[i+1])p.push(grid[i])}return p}
function plot(){var h=+bw.value,e=kde(h),p=peaks(e);bo.textContent=h.toFixed(3);np.textContent=p.length;pl.textContent=p.map(function(x){return x.toFixed(2)}).join(", ")+(L()==="ko"?" 초":" s");
var c=cv.getContext("2d"),W=cv.width,Ht=cv.height,m=30;c.clearRect(0,0,W,Ht);
var hmax=0;H.counts.forEach(function(v){if(v>hmax)hmax=v});var emax=0;e.forEach(function(v){if(v>emax)emax=v});
function X(x){return m+(W-2*m)*(x-0.1)/1.65}
c.fillStyle="#dbe6ee";H.counts.forEach(function(v,j){var x0=H.start+H.width*j;var y=(Ht-m)*(v/hmax)*0.95;c.fillRect(X(x0),Ht-m-y,Math.max(1,X(x0+H.width)-X(x0)-0.5),y)});
c.strokeStyle="#888";c.setLineDash([3,4]);D.paper_peaks.forEach(function(x){c.beginPath();c.moveTo(X(x),8);c.lineTo(X(x),Ht-m);c.stroke()});c.setLineDash([]);
c.strokeStyle="#1d4f73";c.lineWidth=2;c.beginPath();e.forEach(function(v,i){var y=Ht-m-(Ht-m-10)*(v/emax);if(i===0)c.moveTo(X(grid[i]),y);else c.lineTo(X(grid[i]),y)});c.stroke();
c.fillStyle="#b23a3a";p.forEach(function(x){var i=grid.indexOf(x);var y=Ht-m-(Ht-m-10)*(e[i]/emax);c.beginPath();c.arc(X(x),y,4,0,6.3);c.fill()});
c.fillStyle="#555";c.font="12px sans-serif";c.textAlign="center";for(var t=0.2;t<=1.75;t+=0.2){c.fillText(t.toFixed(1),X(t),Ht-10)}
c.textAlign="right";c.fillText(L()==="ko"?"코다 길이(초)":"coda length (s)",W-m,Ht-m-6)}
bw.value=D.paper_bw;bw.addEventListener("input",plot);document.getElementById("bwpaper").addEventListener("click",function(){bw.value=D.paper_bw;plot()});
document.getElementById("langbtn").addEventListener("click",function(){setTimeout(plot,0)});plot()}
var st=document.getElementById("micstart"),sp=document.getElementById("micstop"),msg=document.getElementById("micmsg"),sc=document.getElementById("spec");
if(st&&sc){var stream=null,raf=0,an=null,src=null;
function stop(){if(raf)cancelAnimationFrame(raf);raf=0;if(stream){stream.getTracks().forEach(function(t){t.stop()})}stream=null;if(src){src.disconnect()}src=null;st.disabled=false;sp.disabled=true}
st.addEventListener("click",function(){var c=ac();if(!c||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){msg.textContent=L()==="ko"?"이 브라우저에서는 마이크를 쓸 수 없다.":"Microphone not available in this browser.";return}
navigator.mediaDevices.getUserMedia({audio:true}).then(function(s){stream=s;src=c.createMediaStreamSource(s);an=c.createAnalyser();an.fftSize=2048;an.smoothingTimeConstant=0;src.connect(an);
st.disabled=true;sp.disabled=false;msg.textContent="";var g=sc.getContext("2d"),W=sc.width,Ht=sc.height,bins=new Uint8Array(an.frequencyBinCount),
top=Math.min(bins.length,Math.floor(12000/(c.sampleRate/2)*bins.length));g.fillStyle="#fff";g.fillRect(0,0,W,Ht);
function frame(){an.getByteFrequencyData(bins);var img=g.getImageData(2,0,W-2,Ht);g.putImageData(img,0,0);
for(var y=0;y<Ht;y++){var k=Math.floor((Ht-1-y)/Ht*top),v=bins[k]/255,l=Math.round(255-v*230);g.fillStyle="rgb("+Math.round(l*0.85)+","+Math.round(l*0.92)+","+l+")";g.fillRect(W-2,y,2,1)}
raf=requestAnimationFrame(frame)}frame()}).catch(function(){msg.textContent=L()==="ko"?"마이크를 열지 못했다.":"Could not open the microphone."})});
sp.addEventListener("click",stop)}
})();
