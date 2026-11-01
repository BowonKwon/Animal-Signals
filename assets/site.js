(function(){
var d=document.documentElement;
function lang(){return d.className.indexOf("lang-en")>=0?"en":"ko"}
function setLang(l){d.className="lang-"+l;d.lang=l;try{localStorage.setItem("as-lang",l)}catch(e){}
var ph=document.querySelectorAll("[data-ph-ko]");for(var i=0;i<ph.length;i++){ph[i].placeholder=ph[i].getAttribute("data-ph-"+l)}}
var b=document.getElementById("langbtn");if(b){b.addEventListener("click",function(){setLang(lang()==="ko"?"en":"ko")})}
setLang(lang());
function parseHash(){var h=location.hash.replace(/^#/,""),o={};if(h.indexOf("=")<0){return {id:h}}
h.split("&").forEach(function(kv){var p=kv.split("=");o[decodeURIComponent(p[0])]=decodeURIComponent(p[1]||"")});return o}
function setup(formId,listSel,countId,noneId,match){
var f=document.getElementById(formId);if(!f)return;
var items=document.querySelectorAll(listSel);
function apply(push){var v={};var els=f.elements;for(var i=0;i<els.length;i++){if(els[i].name)v[els[i].name]=els[i].value.trim()}
var n=0;for(var j=0;j<items.length;j++){var ok=match(items[j],v);items[j].hidden=!ok;if(ok)n++}
var c=document.getElementById(countId);if(c)c.querySelector(".n").textContent=n;
var z=document.getElementById(noneId);if(z)z.hidden=n>0;
if(push){var parts=[];for(var k in v){if(v[k])parts.push(encodeURIComponent(k)+"="+encodeURIComponent(v[k]))}
history.replaceState(null,"",parts.length?"#"+parts.join("&"):location.pathname)}}
f.addEventListener("input",function(){apply(true)});f.addEventListener("change",function(){apply(true)});
var h=parseHash();
if(h.id){apply(false);var el=document.getElementById(h.id);if(el){var det=el.querySelector("details");if(det)det.open=true;el.scrollIntoView()}}
else{for(var k in h){if(f.elements[k])f.elements[k].value=h[k]}apply(false)}}
setup("cfilter",".claim","ccount","cnone",function(el,v){
if(v.channel&&el.getAttribute("data-channel")!==v.channel)return false;
if(v.taxon&&el.getAttribute("data-taxon")!==v.taxon)return false;
if(v.grade&&el.getAttribute("data-grade")!==v.grade)return false;
if(v.type&&el.getAttribute("data-type")!==v.type)return false;
if(v.flag&&(";"+el.getAttribute("data-flags")+";").indexOf(";"+v.flag+";")<0)return false;
if(v.q){var q=v.q.toLowerCase();if(el.getAttribute("data-text").indexOf(q)<0&&el.textContent.toLowerCase().indexOf(q)<0)return false}
return true});
setup("pfilter",".prow","pcount","pnone",function(el,v){
if(v.lang&&el.getAttribute("data-lang")!==v.lang)return false;
if(v.gap&&(";"+el.getAttribute("data-gaps")+";").indexOf(";"+v.gap+";")<0)return false;
return true});
if(!document.getElementById("cfilter")&&!document.getElementById("pfilter")){var h2=location.hash.replace(/^#/,"");
if(h2){var e2=document.getElementById(h2);if(e2){var dt=e2.querySelector("details");if(dt)dt.open=true}}}
})();
