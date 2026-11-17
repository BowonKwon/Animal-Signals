(function(){
var ctx=null;function ac(){if(!ctx){var A=window.AudioContext||window.webkitAudioContext;if(!A)return null;ctx=new A()}if(ctx.state==="suspended")ctx.resume();return ctx}
function L(){return document.documentElement.className.indexOf("lang-en")>=0?"en":"ko"}
function PAL(){var dk=getComputedStyle(document.documentElement).getPropertyValue("--card").trim().toLowerCase()!=="#ffffff";return dk?{ink:"#b0aea8",line:"#e3eef8",bar:"#627889",peak:"#ffd0d0",dash:"#ffd27a",bg:"#232529"}:{ink:"#5d6771",line:"#12354f",bar:"#7896ae",peak:"#7f1a1a",dash:"#4f3300",bg:"#ffffff"}}
function onTheme(f){var tb=document.getElementById("themebtn");if(tb)tb.addEventListener("click",function(){setTimeout(f,0)});if(window.matchMedia){var mq=window.matchMedia("(prefers-color-scheme: dark)");if(mq.addEventListener)mq.addEventListener("change",f)}}
var node=document.getElementById("coda-data");
if(node){var D=JSON.parse(node.textContent);
var sel=document.getElementById("codatype"),len=document.getElementById("codalen"),lo=document.getElementById("codalenout"),
info=document.getElementById("codainfo"),svg=document.getElementById("codasvg");
D.types.forEach(function(t,i){var o=document.createElement("option");o.value=i;o.setAttribute("data-ko",t.type+" (클릭 "+t.n_clicks+"개, n="+t.n+")");o.setAttribute("data-en",t.type+" ("+t.n_clicks+" clicks, n="+t.n+")");o.textContent=o.getAttribute(document.documentElement.className.indexOf("lang-en")>=0?"data-en":"data-ko");sel.appendChild(o)});
function cur(){return D.types[+sel.value]}
function times(){var t=cur(),T=+len.value,acc=0,out=[0];t.rhythm.forEach(function(r){acc+=r*T;out.push(acc)});return out}
function draw(){var ts=times(),T=2.0,w=600,s="",cw=svg.clientWidth||600,ch=svg.clientHeight||58,fs=9,P=PAL();
function VH(f){return 50+f+Math.ceil(f*0.35)}while(fs<60&&fs*Math.min(cw/600,ch/VH(fs))<10.5){fs++}var vh=VH(fs),ty=50+fs;svg.setAttribute("viewBox","0 0 600 "+vh);
s+='<line x1="10" y1="45" x2="590" y2="45" stroke="'+P.ink+'"/>';
for(var x=0;x<=2.0001;x+=0.5){var px=10+580*x/T,an=x<0.01?"start":(x>1.99?"end":"middle");s+='<line x1="'+px+'" y1="42" x2="'+px+'" y2="48" stroke="'+P.ink+'"/><text x="'+px+'" y="'+ty+'" font-size="'+fs+'" text-anchor="'+an+'" fill="'+P.ink+'">'+x.toFixed(1)+'s</text>'}
ts.forEach(function(t){var px=10+580*t/T;s+='<line x1="'+px+'" y1="8" x2="'+px+'" y2="42" stroke="'+P.line+'" stroke-width="3"/>'});svg.innerHTML=s;
lo.textContent=(+len.value).toFixed(2);var t=cur();
info.textContent=(L()==="ko"?("원 데이터 중앙값 길이 "+t.median_duration+"초, 코다 "+t.n+"개. 클릭 간격 비율 "):("Median length in the data "+t.median_duration+" s; "+t.n+" codas. Click-interval proportions "))+t.rhythm.map(function(r){return r.toFixed(3)}).join(" : ")}
function reset(){len.value=cur().median_duration;draw()}
sel.addEventListener("change",reset);len.addEventListener("input",draw);document.getElementById("codareset").addEventListener("click",reset);
document.getElementById("langbtn").addEventListener("click",function(){setTimeout(draw,0)});window.addEventListener("resize",draw);onTheme(draw);
document.getElementById("codaplay").addEventListener("click",function(){var c=ac();if(!c)return;var sr=c.sampleRate,n=Math.floor(sr*0.004),buf=c.createBuffer(1,n,sr),dd=buf.getChannelData(0);
for(var i=0;i<n;i++){dd[i]=(Math.random()*2-1)*Math.exp(-i/(sr*0.0006))}
var t0=c.currentTime+0.1;times().forEach(function(t){var s=c.createBufferSource();s.buffer=buf;var g=c.createGain();g.gain.value=0.8;s.connect(g);g.connect(c.destination);s.start(t0+t)})});
reset();
var bw=document.getElementById("bw"),bo=document.getElementById("bwout"),cv=document.getElementById("kde"),np=document.getElementById("npeaks"),pl=document.getElementById("peaklist");
var H=D.hist,grid=[];for(var g=0;g<=165;g++)grid.push(+(0.1+0.01*g).toFixed(2));
function kde(h){var out=[];for(var i=0;i<grid.length;i++){var s=0,x=grid[i];for(var j=0;j<H.counts.length;j++){var c=H.counts[j];if(!c)continue;var z=(x-(H.start+H.width*(j+0.5)))/h;if(z>6||z<-6)continue;s+=c*Math.exp(-0.5*z*z)}out.push(s/(H.total*h*Math.sqrt(2*Math.PI)))}return out}
function peaks(e){var p=[];for(var i=1;i<e.length-1;i++){if(e[i]>e[i-1]&&e[i]>e[i+1])p.push(grid[i])}return p}
function plot(){var h=+bw.value,e=kde(h),p=peaks(e);bo.textContent=h.toFixed(3);np.textContent=p.length;pl.textContent=p.map(function(x){return x.toFixed(2)}).join(", ")+(L()==="ko"?" 초":" s");
var c=cv.getContext("2d"),W=cv.width,Ht=cv.height,m=30,fs=Math.max(12,Math.ceil(10.5*W/(cv.clientWidth||W))),mb=Math.max(m,fs+14),P=PAL();c.clearRect(0,0,W,Ht);
var hmax=0;H.counts.forEach(function(v){if(v>hmax)hmax=v});var emax=0;e.forEach(function(v){if(v>emax)emax=v});
function X(x){return m+(W-2*m)*(x-0.1)/1.65}
c.fillStyle=P.bar;H.counts.forEach(function(v,j){var x0=H.start+H.width*j;var y=(Ht-mb)*(v/hmax)*0.95;c.fillRect(X(x0),Ht-mb-y,Math.max(1,X(x0+H.width)-X(x0)-0.5),y)});
c.strokeStyle=P.dash;c.setLineDash([3,4]);D.paper_peaks.forEach(function(x){c.beginPath();c.moveTo(X(x),8);c.lineTo(X(x),Ht-mb);c.stroke()});c.setLineDash([]);
c.beginPath();e.forEach(function(v,i){var y=Ht-mb-(Ht-mb-10)*(v/emax);if(i===0)c.moveTo(X(grid[i]),y);else c.lineTo(X(grid[i]),y)});c.strokeStyle=P.bg;c.lineWidth=6;c.stroke();c.strokeStyle=P.line;c.lineWidth=2;c.stroke();
c.fillStyle=P.peak;p.forEach(function(x){var i=grid.indexOf(x);var y=Ht-mb-(Ht-mb-10)*(e[i]/emax);c.beginPath();c.arc(X(x),y,4,0,6.3);c.fill();c.strokeStyle=P.bg;c.lineWidth=2;c.stroke()});
c.fillStyle=P.ink;c.font=fs+"px sans-serif";c.textAlign="center";for(var t=0.2;t<=1.75;t+=0.2){c.fillText(t.toFixed(1),X(t),Ht-8)}
c.textAlign="right";var ttl=L()==="ko"?"코다 길이(초)":"coda length (s)";c.strokeStyle=P.bg;c.lineWidth=Math.max(4,Math.round(fs/4));c.lineJoin="round";c.strokeText(ttl,W-m,Ht-mb-6);c.fillText(ttl,W-m,Ht-mb-6)}
bw.value=D.paper_bw;bw.addEventListener("input",plot);document.getElementById("bwpaper").addEventListener("click",function(){bw.value=D.paper_bw;plot()});
document.getElementById("langbtn").addEventListener("click",function(){setTimeout(plot,0)});window.addEventListener("resize",plot);onTheme(plot);plot()}
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
