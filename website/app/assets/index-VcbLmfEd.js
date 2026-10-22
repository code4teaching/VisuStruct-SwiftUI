var ui=Object.defineProperty;var hi=(i,e,t)=>e in i?ui(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var I=(i,e,t)=>hi(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();var g=(i=>(i[i.anweisung=0]="anweisung",i[i.verzweigung=1]="verzweigung",i[i.fallauswahl=2]="fallauswahl",i[i.forSchleife=3]="forSchleife",i[i.whileSchleife=4]="whileSchleife",i[i.doUntilSchleife=5]="doUntilSchleife",i[i.endlosschleife=6]="endlosschleife",i[i.aussprung=7]="aussprung",i[i.aufruf=8]="aufruf",i[i.leerElement=9]="leerElement",i))(g||{});function mi(i){return i===3||i===4||i===5||i===6}function ci(i){return i===1||i===2}function K(i,e={}){return{type:i,zoomX:0,zoomY:0,textLines:[""],...e}}function di(i){const e=i.textLines;if(!e.every(t=>t.trim()===""))switch(i.type){case g.forSchleife:return e.length<=1?e:[pi(e)];case g.verzweigung:return Be("if",e);case g.whileSchleife:return Be("while",e);case g.doUntilSchleife:return Be("while",gi(e));case g.fallauswahl:return Be("switch",e);default:return e}}function gi(i){if(i.length===0)return i;const e=i[0].trim(),t=e.toLowerCase(),n=[...i];if(t==="until")n[0]="";else if(t.startsWith("until "))n[0]=e.slice(6).trim();else if(t.startsWith("until("))n[0]=e.slice(5);else return i;return n}function mn(i){const e=new Set(["if","for","while","until","switch"]),t=["input:","output:","print:"],n=i.trim(),s=n.toLowerCase();for(const l of t){if(s===l)return{keyword:n,rest:""};if(s.startsWith(l+" "))return{keyword:n.slice(0,l.length),rest:n.slice(l.length).trim()}}const r=n.indexOf(" ");if(r<0)return;const a=n.slice(0,r);if(e.has(a.toLowerCase()))return{keyword:a,rest:n.slice(r+1).trim()}}function Be(i,e){if(e.length===0)return e;const t=e[0].trim(),n=t.toLowerCase();if(n===i||n.startsWith(i+" "))return e;const s=[...e];return s[0]=i+" "+t,s}function pi(i){let e=[...i];for(;e.length<3;)e.push("");e=e.slice(0,3);const t=s=>{let r=s.trim();for(;r.endsWith(";");)r=r.slice(0,-1).trim();return r},n=e.map(t).join("; ").trim();return n===""?"for":"for "+n}const m1={[g.anweisung]:"Anweisung",[g.verzweigung]:"Bedingung",[g.fallauswahl]:"Fallauswahl",[g.forSchleife]:"for 0 < i < anzahl",[g.whileSchleife]:"while …",[g.doUntilSchleife]:"while …",[g.endlosschleife]:"endless",[g.aussprung]:"break",[g.aufruf]:"Aufruf()",[g.leerElement]:"ø"};function xi(i){Object.assign(m1,i)}function Ot(i){return di(i)??[m1[i.type]]}class N extends Error{}const re=i=>structuredClone(i);function Te(){return K(g.anweisung,{textLines:["ø"]})}function bi(){return{caption:"",elements:[Te()]}}function $t(i){if(i.type===g.leerElement)return!0;if(i.type===g.anweisung){const e=i.textLines;return e.length===0||e.length===1&&e[0]==="ø"}return!1}function ye(i,e){const t=q(i,e);return t!==void 0&&$t(t)}function Ce(i,e){if(e.length===0)throw new N("Invalid element path.");const[t,...n]=e;if(t<0||t>=i.length)throw new N("Invalid element path.");if(n.length===0)return{list:i,index:t};const[s,...r]=n;if(r.length===0)throw new N("Invalid element path.");return Ce(c1(i[t],s),r)}function c1(i,e){if(mi(i.type)){if(e!==0||!i.loopBody)throw new N("Invalid element path.");return i.loopBody}if(ci(i.type)){if(!i.cases||e<0||e>=i.cases.length)throw new N("Invalid element path.");return i.cases[e].elements}throw new N("Invalid element path.")}function ne(i,e){const{list:t,index:n}=Ce(i.elements,e);return t[n]}function q(i,e){try{return ne(i,e)}catch{return}}function ce(i,e,t){const n=re(i),{list:s,index:r}=Ce(n.elements,e);return s[r]=re(t),n}function pt(i,e,t){const n=re(ne(i,e));return n.textLines=t.length===0?[""]:t,ce(i,e,n)}function xt(i,e){return e.length===0?!1:e.length===1&&i.elements.length===1?!ye(i,e):q(i,e)!==void 0}function Ae(i,e){const t=re(i),{list:n,index:s}=Ce(t.elements,e);if(e.length===1&&n.length===1){if($t(n[0]))throw new N("The last root element cannot be deleted.");return n[0]=Te(),t}return n.splice(s,1),e.length>1&&n.length===0&&n.push(Te()),t}function Ze(i,e,t,n){const s=re(i);let r;if(e.length===0)r=s.elements;else{const a=e.slice(0,-1),l=e[e.length-1],{list:o,index:u}=Ce(s.elements,a);r=c1(o[u],l)}return r.splice(Math.min(Math.max(0,t),r.length),0,re(n)),s}function d1(i,e,t){if(t.length===0)throw new N("Invalid element path.");return Ze(i,t.slice(0,-1),t[t.length-1],e)}function At(i,e,t){if(t.length===0)throw new N("Invalid element path.");return Ze(i,t.slice(0,-1),t[t.length-1]+1,e)}function Kt(i,e){return i.length<e.length&&i.every((t,n)=>e[n]===t)}function qt(i,e){if(e.length===0)return i;const t=e[e.length-1],n=e.slice(0,-1);if(i.length<=n.length||!n.every((a,l)=>i[l]===a))return i;const s=n.length;if(i[s]<=t)return i;const r=[...i];return r[s]-=1,r}const en=(i,e)=>i.length===e.length&&i.every((t,n)=>t===e[n]);function fi(i,e,t){if(en(e,t))return i;if(Kt(e,t))throw new N("Invalid element path.");const n=ne(i,e),s=Ae(i,e);return d1(s,n,qt(t,e))}function Ii(i,e,t){if(en(e,t))return i;if(Kt(e,t))throw new N("Invalid element path.");const n=ne(i,e),s=Ae(i,e);return At(s,n,qt(t,e))}function yi(i,e,t){if(!ye(i,t))throw new N("Invalid element path.");if(en(e,t))return i;if(Kt(e,t))throw new N("Invalid element path.");const n=ne(i,e),s=Ae(i,e);return ce(s,qt(t,e),n)}function zi(i,e){const t=re(ne(i,e)),n=t.cases;if(t.type!==g.fallauswahl||!n||n.length===0)throw new N("Invalid element path.");const s=n[n.length-1].name.toLowerCase()==="default",r=s?n.length-1:n.length,a=String(s?n.length:n.length+1);return n.splice(r,0,{name:a,elements:[Te()]}),{doc:ce(i,e,t),path:[...e,r,0]}}function wi(i,e,t){const n=re(ne(i,e)),s=n.cases;if(n.type!==g.fallauswahl||!s)throw new N("Invalid element path.");if(s.length<=2)throw new N("A switch needs at least two cases.");if(t<0||t>=s.length)throw new N("Invalid element path.");s.splice(t,1);const r=Math.min(t,s.length-1);return{doc:ce(i,e,n),path:[...e,r,0]}}function vi(i,e,t,n){const s=re(ne(i,e)),r=s.cases;if(s.type!==g.fallauswahl||!r)throw new N("Invalid element path.");if(t<0||t>=r.length)throw new N("Invalid element path.");const a=n.trim();if(a==="")throw new N("Invalid element path.");return r[t].name=a,ce(i,e,s)}function ki(i,e){var t;if(!(!i||i.length===0))for(let n=i.length;n>=1;n--){const s=i.slice(0,n);if(((t=q(e,s))==null?void 0:t.type)===g.fallauswahl)return s}}function Si(i,e){if(!(!i||i.length<=e.length))return i[e.length]}function cn(i,e){if(e.elements.length!==0)return!i||!q(e,i)?[0]:i}const g1=i=>i!==void 0&&/\s/.test(i);function qe(i){const e=i.trim().toLowerCase();return e.startsWith("input:")?"input":e.startsWith("output:")||e.startsWith("print:")?"output":"statement"}function Zi(i){const e=i.trim(),t=e.toLowerCase();return t.startsWith("input:")?e.slice(6).trim():t.startsWith("output:")?e.slice(7).trim():t.startsWith("print:")?e.slice(6).trim():i}function dn(i,e){const t=e.trim();return t===""?`${i} `:`${i} ${t}`}function Mi(i,e){const t=Zi(e);switch(i){case"statement":return t;case"input":return dn("input:",t);case"output":return dn("output:",t)}}const Ye=i=>g1(i[0])?i.slice(1):i;function _i(i){const e=i.replace(/^\s+/,""),t=e.toLowerCase();return t.startsWith("input:")?Ye(e.slice(6)):t.startsWith("output:")?Ye(e.slice(7)):t.startsWith("print:")?Ye(e.slice(6)):i}function gn(i,e){const t=e.replace(/^\s+/,"");if(!t.toLowerCase().startsWith(i.toLowerCase()))return e;const n=t.slice(i.length);if(!(n===""||g1(n[0])||n[0]==="("))return e;const s=Ye(n);return s.startsWith("(")&&s.endsWith(")")&&s.length>=2?s.slice(1,-1):s}function pn(i,e){if(i==="input:"||i==="output:")return _i(e);const t=gn(i,e);if(i==="while"&&t===e){const n=gn("until",e);if(n!==e)return n}return t}function ji(i,e){return e===""?`${i} `:`${i} ${e}`}function p1(i){return i.replace(/[“”„«»]/g,'"').replace(/[’‘‚´]/g,"'")}function xn(i){const e=i.length===0?[""]:i.slice(0,3);for(;e.length<3;)e.push("");return e}function Ti(i){let e=p1(i);for(;;){const t=e.trim();if(!t.endsWith(";"))return e;e=t.slice(0,-1).trim()}}const ot='system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';function Ai(i,e){return`${e==="bold"?700:500} ${i}px ${ot}`}const x1=(i,e,t)=>[...i].length*e*(t==="bold"?.68:.62);function Di(){if(typeof document>"u"||!document.body)return;const i="http://www.w3.org/2000/svg",e=document.createElementNS(i,"svg");e.setAttribute("aria-hidden","true"),e.setAttribute("width","0"),e.setAttribute("height","0"),e.style.cssText="position:absolute;left:-9999px;top:0;visibility:hidden;overflow:hidden";const t=document.createElementNS(i,"text");if(t.setAttribute("font-family",ot),t.style.whiteSpace="pre",e.append(t),document.body.append(e),typeof t.getComputedTextLength!="function"||typeof t.getBBox!="function"){e.remove();return}if(t.textContent="Mg",t.setAttribute("font-size","20"),!(t.getComputedTextLength()>0)){e.remove();return}return t}let bt;function b1(){return bt===void 0&&(bt=Di()??null),bt??void 0}function f1(i,e,t){i.setAttribute("font-size",String(e)),i.setAttribute("font-weight",t==="bold"?"700":"500")}function bn(i,e){const t=`${i}|${e}`;let n=fn.get(t);if(!n){const s=b1();if(n={ascent:i*.95,descent:i*.24},s){f1(s,i,e),s.setAttribute("y","0"),s.textContent="Mg";const r=s.getBBox();r.height>0&&(n={ascent:-r.y,descent:r.height+r.y})}fn.set(t,n)}return n}const fn=new Map;function Pi(){const i=b1();if(i){const n=new Map;return(s,r,a)=>{const l=`${r}|${a}|${s}`;let o=n.get(l);return o===void 0&&(f1(i,r,a),i.textContent=s,o=s===""?0:i.getComputedTextLength(),n.size>2e3&&n.clear(),n.set(l,o)),o}}const e=typeof document<"u"?document.createElement("canvas").getContext("2d"):null;if(!e)return x1;const t=new Map;return(n,s,r)=>{const a=`${s}|${r}|${n}`;let l=t.get(a);return l===void 0&&(e.font=Ai(s,r),l=e.measureText(n).width,t.size>2e3&&t.clear(),t.set(a,l)),l}}const I1={fontSize:15,lineHeight:20,charWidth:7,baseHeaderExtra:20,minSidePadding:42,cellTextInsetY:15,doUntilDoLabelTopInset:2,doUntilFooterTopInset:6,doUntilFooterBottomInset:8};function Ci(i){return{...I1,fontSize:14,lineHeight:21,charWidth:5.5*(14/12),baseHeaderExtra:21,minSidePadding:40}}const He=i=>i===g.forSchleife||i===g.whileSchleife||i===g.doUntilSchleife||i===g.endlosschleife,Ge=i=>i===g.fallauswahl||i===g.verzweigung;function Ne(i,e,t,n=0){return{idPath:i,element:e,frame:t,headerBandHeight:n,topBandHeight:0,loopBodyLeadingInset:0,caseColumnFrames:[],children:[]}}function U(i){return{...i,frame:{...i.frame}}}class y1{constructor(e=I1,t=x1){this.metrics=e,this.measure=t}layout(e,t={left:28,top:28}){const s=this.layoutList(e.elements,t.left,t.top,[]).map(o=>this.stretchLoopBodiesVertically(o));let r=0,a=0;const l=o=>{r=Math.max(r,o.frame.x+o.frame.width),a=Math.max(a,o.frame.y+o.frame.height),o.children.forEach(l)};return s.forEach(l),{canvasSize:{width:r+t.left,height:a+t.top},elements:s}}lineWidth(e){return Math.ceil(this.measure(e,this.metrics.fontSize,"medium"))}lineWidthBold(e){return Math.ceil(this.measure(e,this.metrics.fontSize,"bold"))}layoutList(e,t,n,s){let r=[],a=n;e.forEach((o,u)=>{const h=this.layoutElement(o,t,a,[...s,u]);r.push(h),a+=h.frame.height});const l=Math.max(0,...r.map(o=>o.frame.width));return l>0&&(r=r.map(o=>this.stretchNodeTreeToWidth(o,l))),r}stretchMultiwayNodeToWidth(e,t){const n=U(e),s=n.frame.width;if(!(s>0)||n.caseColumnFrames.length===0)return n;const r=t/s;n.frame.width=t;let a=n.frame.x;const l=n.caseColumnFrames.map(o=>{const u=o.width*r,h={x:a,y:o.y,width:u,height:o.height};return a+=u,h});return n.caseColumnFrames=l,n.dividerX=l.length>0?l[l.length-1].x:n.frame.x+t,n.columns&&n.columns.length===l.length&&(n.columns=n.columns.map((o,u)=>{const h=l[u];return o.map(m=>{const d=U(m);return d.frame.x=h.x,d.frame.width=h.width,this.stretchDescendantsWidths(d,h.width)})}),n.children=n.columns.flat()),n}stretchLoopChildren(e,t){const n=this.effectiveLoopBodyLeading(e),s=Math.max(0,t-n);e.children=e.children.map(r=>{const a=U(r);return a.frame.x=e.frame.x+n,a.frame.width=s,this.stretchDescendantsWidths(a,s)})}stretchNodeTreeToWidth(e,t){const n=U(e);return n.frame.width>0?Ge(n.element.type)&&n.caseColumnFrames.length>0?this.stretchMultiwayNodeToWidth(n,t):(n.frame.width=t,He(n.element.type)?this.stretchLoopChildren(n,t):n.children=n.children.map(r=>this.stretchDescendantsWidths(r,t)),n):n}stretchDescendantsWidths(e,t){let n=U(e);return Ge(n.element.type)?n=this.stretchNodeTreeToWidth(n,t):He(n.element.type)?(n.frame.width=t,this.stretchLoopChildren(n,t)):(n.frame.width=t,n.children=n.children.map(s=>this.stretchDescendantsWidths(s,t))),n}stretchLoopBodiesVertically(e){const t=U(e);if(t.columns&&t.columns.length>0)return t.columns=t.columns.map(r=>r.map(a=>this.stretchLoopBodiesVertically(a))),t.children=t.columns.flat(),t;t.children=t.children.map(r=>this.stretchLoopBodiesVertically(r));const n=r=>r===g.anweisung||r===g.leerElement||r===g.aufruf||r===g.aussprung||He(r);let s;switch(t.element.type){case g.forSchleife:case g.whileSchleife:case g.endlosschleife:{const r=t.element.type===g.endlosschleife?40:0;s=t.frame.y+t.frame.height-r;break}case g.doUntilSchleife:s=t.frame.y+t.frame.height-t.headerBandHeight;break}if(s!==void 0&&t.children.length>0){const r=t.children.length-1;let a=U(t.children[r]);const l=s-(a.frame.y+a.frame.height);l>.5&&n(a.element.type)&&(a.frame.height+=l,a=this.stretchLoopBodiesVertically(a),t.children=[...t.children.slice(0,r),a])}return t}headerHeight(e){const t=this.metrics,n=Math.max(1,e.textLines.length);if(e.type===g.doUntilSchleife)return t.doUntilFooterTopInset+n*t.lineHeight+t.doUntilFooterBottomInset+e.zoomY;let s;switch(e.type){case g.fallauswahl:s=40;break;case g.verzweigung:s=20;break;case g.forSchleife:case g.whileSchleife:case g.endlosschleife:s=t.baseHeaderExtra+4;break;default:s=14}return s+n*t.lineHeight+e.zoomY}doUntilBodyLeadingInset(){return Math.max(20,this.lineWidthBold("do")+12)}effectiveLoopBodyLeading(e){return e.element.type===g.doUntilSchleife?e.loopBodyLeadingInset>0?e.loopBodyLeadingInset:this.doUntilBodyLeadingInset():20}horizontalPaddingInsideCell(e){return Ge(e)?Math.max(100,this.metrics.minSidePadding*2.45):this.metrics.minSidePadding}minWidth(e){const t=e.textLines.length===0?0:Math.max(...e.textLines.map(r=>this.lineWidth(r)));let n=t+e.zoomX+this.horizontalPaddingInsideCell(e.type);if(e.type===g.aufruf){const r=Math.max(68,this.metrics.minSidePadding*1.7),a=Math.max(8,this.metrics.minSidePadding*.2);n=Math.max(n,t+e.zoomX+r+a)}const s=e.type===g.leerElement?76:e.type===g.aufruf?104:72;return Math.max(s,n)}layoutElement(e,t,n,s){if(Ge(e.type))return this.layoutMultiway(e,t,n,s);if(He(e.type))return this.layoutLoop(e,t,n,s);const r=this.headerHeight(e);return Ne(s,e,{x:t,y:n,width:this.minWidth(e),height:r},r)}layoutLoop(e,t,n,s){const r=b=>b.reduce((z,v)=>z+v.frame.height,0),a=b=>Math.max(0,...b.map(z=>z.frame.width)),l=e.loopBody??[];if(e.type===g.doUntilSchleife){const b=this.doUntilBodyLeadingInset(),z=e.zoomY,v=this.headerHeight(e),j=this.layoutList(l,t+b,n+z,[...s,0]),_=Math.max(this.minWidth(e),a(j)+b),M=r(j)+v+z,T=Math.max(0,_-b),A=Ne(s,e,{x:t,y:n,width:_,height:M},v);return A.topBandHeight=z,A.loopBodyLeadingInset=b,A.children=j.map(C=>{const B=U(C);return B.frame.x=t+b,B.frame.width=T,this.stretchDescendantsWidths(B,T)}),A}const o=20,u=this.headerHeight(e),h=e.type===g.endlosschleife?40:0,m=this.layoutList(l,t+o,n+u,[...s,0]),d=Math.max(this.minWidth(e),a(m)+o),p=u+h+r(m),x=Math.max(0,d-o),y=Ne(s,e,{x:t,y:n,width:d,height:p},u);return y.children=m.map(b=>{const z=U(b);return z.frame.x=t+o,z.frame.width=x,this.stretchDescendantsWidths(z,x)}),y}layoutMultiway(e,t,n,s){const r=this.headerHeight(e),a=e.cases??[],l=Math.max(1,a.length),o=Math.max(this.minWidth(e)/l,132);let u=[],h=[],m=0,d=0;if(a.forEach((b,z)=>{const v=t+m,j=this.layoutList(b.elements,v,n+r,[...s,z]),_=Math.max(0,...j.map(A=>A.frame.width));let M;e.type===g.verzweigung&&l===2?M=Math.max(_,(z===0?"true":"false").length*this.metrics.charWidth+24):M=Math.max(o,_);const T=j.reduce((A,C)=>A+C.frame.height,0);d=Math.max(d,T),u.push({x:v,y:n+r,width:M,height:T}),h.push(j.map(A=>{const C=U(A);return C.frame.x=v,C.frame.width=M,this.stretchDescendantsWidths(C,M)})),m+=M}),e.type===g.verzweigung&&l===2&&u.length===2){const b=Math.max(u[0].width,u[1].width),z=t,v=t+b,j=v-u[1].x;u[0]={...u[0],x:z,width:b},u[1]={...u[1],x:v,width:b},m=b*2,h[0]=h[0].map(_=>{const M=U(_);return M.frame.x=z,M.frame.width=b,this.stretchDescendantsWidths(M,b)}),h[1]=h[1].map(_=>{const M=Dt(_,j);return M.frame.width=b,this.stretchDescendantsWidths(M,b)})}if(h.length>0){const b=Wi(h,n+r);h=b.columns.map(z=>z.map(v=>this.stretchLoopBodiesVertically(v)));for(let z=0;z<Math.min(u.length,b.columnHeights.length);z++)u[z]={...u[z],height:b.columnHeights[z]};d=b.columnHeights.length>0?Math.max(...b.columnHeights):d}let p=Math.max(m,this.minWidth(e));if(m>.5&&p>m+.5){const b=p/m;let z=t;const v=[],j=[];u.forEach((_,M)=>{const T=_.width*b;j.push(h[M].map(A=>{const C=U(A);return C.frame.x=z,C.frame.width=T,this.stretchDescendantsWidths(C,T)})),v.push({x:z,y:_.y,width:T,height:_.height}),z+=T}),u=v,h=j,m=z-t,p=m}const x=u.length>0?u[u.length-1].width:m/l,y=Ne(s,e,{x:t,y:n,width:p,height:r+d},r);return y.caseColumnFrames=u,y.dividerX=u.length>0?u[u.length-1].x:t+m-x,y.dividerYInset=e.type===g.fallauswahl?-20:0,y.columns=h,y.children=h.flat(),y}}function z1(i,e){if(Math.abs(e)<=1e-4)return i;const t=U(i),n=s=>{const r=U(s);return r.frame.y+=e,z1(r,e)};return t.columns?(t.columns=t.columns.map(s=>s.map(n)),t.children=t.columns.flat()):t.children=t.children.map(n),t}function Dt(i,e){if(Math.abs(e)<=1e-4)return i;const t=U(i);return t.frame.x+=e,t.columns?(t.columns=t.columns.map(n=>n.map(s=>Dt(s,e))),t.children=t.columns.flat()):t.children=t.children.map(n=>Dt(n,e)),t}function Wi(i,e){if(i.length<2)return{columns:i,columnHeights:i.map(u=>u.reduce((h,m)=>h+m.frame.height,0))};const t=.5,n=[e];for(const u of i)for(const h of u)n.push(h.frame.y+h.frame.height);const s=Math.max(...n);n.push(s),n.sort((u,h)=>u-h);let r=[];for(const u of n)r.length>0&&Math.abs(u-r[r.length-1])<=t||r.push(u);(r.length===0||Math.abs(r[0]-e)>t)&&r.unshift(e),r.length===0?r=[e,s]:r[r.length-1]<s-1e-6?r.push(s):r[r.length-1]=s;const a=(u,h)=>{let m=Math.max(0,h);for(;m<r.length&&r[m]<u-t;)m++;return Math.min(m,r.length-1)},l=[],o=[];for(const u of i){if(u.length===0){l.push([]),o.push(0);continue}const h=[];let m=0;u.forEach((d,p)=>{let x=U(d);const y=r[m],b=d.frame.y+d.frame.height,z=p===u.length-1?r.length-1:a(b,m+1),v=r[z],j=y-x.frame.y;x.frame.y=y,x.frame.height=Math.max(0,v-y),x=z1(x,j),h.push(x),m=z}),l.push(h),o.push(r[r.length-1]-e)}return{columns:l,columnHeights:o}}const In=[{item:"anweisung",label:"Anweisung"},{item:"verzweigung",label:"Verzweigung"},{item:"fallauswahl",label:"Fallauswahl"},{item:"forZaehlSchleife",label:"For-Schleife"},{item:"whileSchleife",label:"While-Schleife"},{item:"doUntilSchleife",label:"Do-while-Schleife"},{item:"endlosschleife",label:"Endlosschleife"},{item:"aufruf",label:"Aufruf"},{item:"aussprung",label:"Aussprung"}];function Ee(i){const e=Te;switch(i){case"anweisung":return K(g.anweisung);case"verzweigung":return K(g.verzweigung,{cases:[{name:"true",elements:[e()]},{name:"false",elements:[e()]}]});case"fallauswahl":return K(g.fallauswahl,{cases:[{name:"1",elements:[e()]},{name:"2",elements:[e()]},{name:"default",elements:[e()]}]});case"forZaehlSchleife":return K(g.forSchleife,{textLines:["","",""],loopBody:[e()]});case"whileSchleife":return K(g.whileSchleife,{loopBody:[e()]});case"doUntilSchleife":return K(g.doUntilSchleife,{loopBody:[e()]});case"endlosschleife":return K(g.endlosschleife,{loopBody:[e()]});case"aussprung":return K(g.aussprung);case"aufruf":return K(g.aufruf)}}function et(i){if(i==="")return"-1;";let e="";for(const t of i)e+=t.codePointAt(0)+";";return e}function Pt(i){const e=i.split(";").filter(n=>n!=="");if(e.length===1&&e[0]==="-1")return"";let t="";for(const n of e){if(!/^[+-]?\d+$/.test(n))continue;const s=Number(n);s!==-1&&(s<0||s>1114111||s>=55296&&s<=57343||(t+=String.fromCodePoint(s)))}return t}class yn extends Error{}function tn(i){const e=new DOMParser().parseFromString(i,"application/xml");if(e.getElementsByTagName("parsererror").length>0)throw new yn("Could not read XML.");const t=e.documentElement;if(!t||t.tagName!=="struktogramm")throw new yn("Invalid XML: root element is not <struktogramm>.");const n={caption:wn(t,"caption")??"",elements:Wt(t)},s=wn(t,"fontfamily");s!==void 0&&(n.fontFamily=s);const r=Me(t,"fontsize");r!==void 0&&(n.fontSize=r);const a=Me(t,"fontstyle");return a!==void 0&&(n.fontStyle=a),t.getAttribute("pseudocode")==="true"&&(n.pseudocode=!0),n}function ft(i){const e=(n,s)=>s===void 0?"":` ${n}="${w1(s)}"`;let t=`<?xml version="1.0" encoding="UTF-8"?>
`;t+="<struktogramm",t+=e("fontfamily",i.fontFamily===void 0?void 0:et(i.fontFamily)),t+=e("fontstyle",i.fontStyle===void 0?void 0:String(i.fontStyle)),t+=e("fontsize",i.fontSize===void 0?void 0:String(i.fontSize)),t+=e("caption",et(i.caption)),t+=e("pseudocode",i.pseudocode?"true":void 0),t+=`>
`;for(const n of i.elements)t+=Ct(n,"  ");return t+=`</struktogramm>
`,t}function Ct(i,e){let t=`${e}<strelem typ="${i.type}" zx="${i.zoomX}" zy="${i.zoomY}"`;i.textColor&&(t+=` textcolor="${zn(i.textColor)}"`),i.backgroundColor&&(t+=` bgcolor="${zn(i.backgroundColor)}"`),t+=`>
`;for(const n of i.textLines)t+=`${e}  <text>${Bi(et(n))}</text>
`;if(i.loopBody){t+=`${e}  <schleifeninhalt>
`;for(const n of i.loopBody)t+=Ct(n,e+"    ");t+=`${e}  </schleifeninhalt>
`}if(i.cases)for(const n of i.cases){t+=`${e}  <fall fallname="${w1(et(n.name))}">
`;for(const s of n.elements)t+=Ct(s,e+"    ");t+=`${e}  </fall>
`}return t+=`${e}</strelem>
`,t}function w1(i){return i.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Bi(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function zn(i){return String(i.a<<24|i.r<<16|i.g<<8|i.b|0)}function Xe(i,e){return Array.from(i.children).filter(t=>t.tagName===e)}function Wt(i){const e=[];for(const t of Xe(i,"strelem")){const n=Hi(t);n&&e.push(n)}return e}function Hi(i){const e=Me(i,"typ");if(e===void 0||g[e]===void 0)return;const t={type:e,zoomX:Me(i,"zx")??0,zoomY:Me(i,"zy")??0,textLines:Xe(i,"text").map(l=>Pt((l.textContent??"").trim()))},n=vn(i.getAttribute("textcolor"));n&&(t.textColor=n);const s=vn(i.getAttribute("bgcolor"));s&&(t.backgroundColor=s),t.textLines.length===0&&(t.textLines=[""]);const r=Xe(i,"schleifeninhalt")[0];if(r){const l=Wt(r);l.length>0&&(t.loopBody=l)}const a=Xe(i,"fall").map(l=>({name:Pt(l.getAttribute("fallname")??""),elements:Wt(l)}));return a.length>0&&(t.cases=a),t}function wn(i,e){const t=i.getAttribute(e);return t===null?void 0:Pt(t)}function Me(i,e){const t=i.getAttribute(e);if(!(t===null||!/^[+-]?\d+$/.test(t)))return Number(t)}function vn(i){if(i===null||!/^[+-]?\d+$/.test(i))return;const e=Number(i);if(e<-2147483648||e>2147483647)return;const t=e>>>0;return{a:t>>>24&255,r:t>>>16&255,g:t>>>8&255,b:t&255}}const Gi="http://www.w3.org/2000/svg",E={diagramLineWidth:2,outerFrameLineWidth:2,selectionLineWidth:3.5,canvasOuterMargin:16,cellTextInsetX:18,cellTextInsetY:15,multiHeaderFirstLineY:14,branchLabelInsetX:10,fallauswahlCaseLabelBand:26,callSideBarInset:14,callTextInsetFromSideBar:20,loopBodyLeadingInset:20};function D(i,e={}){const t=document.createElementNS(Gi,i);for(const[n,s]of Object.entries(e))t.setAttribute(n,String(s));return t}class v1{constructor(e,t){I(this,"usesSimulationHighlight",!1);this.metrics=e,this.measure=t}get lineHeight(){return this.metrics.lineHeight}get fontSize(){return this.metrics.fontSize}render(e,t,n,s=E.canvasOuterMargin){const r=D("svg",{width:t.width,height:t.height,viewBox:`0 0 ${t.width} ${t.height}`,"font-family":ot,"font-size":this.fontSize,class:"diagram"});r.append(D("rect",{x:0,y:0,width:t.width,height:t.height,fill:"#fafafa"}));const a=s;r.append(D("rect",{x:a,y:a,width:e.canvasSize.width-2*a-1,height:e.canvasSize.height-2*a-1,fill:"none",stroke:"black","stroke-width":E.outerFrameLineWidth}));const l=D("g");for(const o of e.elements)this.drawNode(o,l,n,{},void 0);return r.append(l),r}line(e,t){e.append(D("polyline",{points:t.map(n=>n.join(",")).join(" "),fill:"none",stroke:"black","stroke-width":E.diagramLineWidth,"stroke-linejoin":"miter"}))}strokeCellBorder(e,t,n){const s=t.x,r=t.y,a=t.x+t.width,l=t.y+t.height;if(!n.top&&!n.left&&!n.bottom&&!n.right){e.append(D("rect",{x:s,y:r,width:t.width,height:t.height,fill:"none",stroke:"black","stroke-width":E.diagramLineWidth}));return}n.top||this.line(e,[[s,r],[a,r]]),n.right||this.line(e,[[a,r],[a,l]]),n.bottom||this.line(e,[[a,l],[s,l]]),n.left||this.line(e,[[s,l],[s,r]])}textWidth(e){const t=mn(e);return t?this.measure(t.keyword,this.fontSize,"bold")+(t.rest===""?0:this.measure(" "+t.rest,this.fontSize,"medium")):this.measure(e,this.fontSize,"medium")}drawKeywordLine(e,t,n,s){const r=D("text",{x:n,y:s+bn(this.fontSize,"medium").ascent,"font-weight":500});r.style.whiteSpace="pre";const a=mn(t);if(a){const l=D("tspan",{"font-weight":700});if(l.textContent=a.keyword,r.append(l),a.rest!==""){const o=D("tspan",{});o.textContent=" "+a.rest,r.append(o)}}else r.textContent=t;e.append(r)}drawLabel(e,t,n,s,r,a){const l=bn(this.fontSize,r?"bold":"medium"),o=D("text",{x:n,y:a==="top"?s+l.ascent:s-l.descent,"font-weight":r?700:500});o.style.whiteSpace="pre",o.textContent=t,e.append(o)}roofMetrics(e,t,n,s){const r=t.y+n,a=e.dividerYInset??0,l=12,o=Math.max(e.element.textLines.length,1)*this.lineHeight,u=t.y+E.multiHeaderFirstLineY;if(e.element.type===g.fallauswahl){const m=Math.max(E.fallauswahlCaseLabelBand,this.lineHeight+10),d=r-m,p=Math.min(r+a,d-8),x=Math.max(p,u+o+6);return{apex:{x:s,y:x},maxTextBottom:d-l,roofBottom:r}}const h={x:s,y:r+a};return{apex:h,maxTextBottom:h.y-l,roofBottom:r}}drawNode(e,t,n,s,r){var j;const a=e.frame,l=e.element,o=a.x+a.width,u=a.y+a.height,h=l.type===g.verzweigung||l.type===g.fallauswahl,m=h?e.headerBandHeight:0,d=n!==void 0&&Bt(e.idPath,n),p=Ot(l),x=D("g",{"data-path":e.idPath.join(",")});t.append(x);const y=this.usesSimulationHighlight,b=d&&y?"rgba(199, 230, 255, 0.55)":"white";x.append(D("rect",{x:a.x,y:a.y,width:a.width,height:a.height,fill:b})),this.strokeCellBorder(x,a,s);const z=E.callSideBarInset;if(l.type===g.aufruf?(this.line(x,[[a.x+z,a.y],[a.x+z,u]]),this.line(x,[[o-z,a.y],[o-z,u]])):l.type===g.aussprung&&this.line(x,[[a.x+z,a.y],[a.x,a.y+a.height/2],[a.x+z,u]]),h&&e.dividerX!==void 0){const _=e.dividerX,M=this.roofMetrics(e,a,m,_),T=Math.max(p.length,1)*this.lineHeight,A=a.y+E.multiHeaderFirstLineY;this.line(x,[[a.x,a.y],[M.apex.x,M.apex.y],[o,a.y]]),l.type===g.fallauswahl&&this.line(x,[[a.x,M.roofBottom],[o,M.roofBottom]]);let C;A+T<=M.maxTextBottom?C=A:C=Math.max(a.y+2,M.maxTextBottom-(Math.max(p.length,1)-1)*this.lineHeight-this.lineHeight),p.forEach((B,ae)=>{const le=this.textWidth(B);let xe;if(l.type===g.verzweigung){const gt=a.x+E.cellTextInsetX,oi=o-le-E.cellTextInsetX;xe=Math.min(Math.max(_-le/2,gt),oi)}else xe=a.x+a.width/2-le/2;this.drawKeywordLine(x,B,xe,C+ae*this.lineHeight)})}else if(l.type!==g.doUntilSchleife)if(l.type===g.anweisung||l.type===g.aufruf||l.type===g.aussprung){const _=E.cellTextInsetX;let M=a.x+_,T=o-_;l.type===g.aufruf?(M=a.x+z+E.callTextInsetFromSideBar,T=o-z-E.callTextInsetFromSideBar):l.type===g.aussprung&&(M=a.x+z+_);const A=Math.max(0,T-M);let C=a.y+a.height/2-Math.max(1,p.length)*this.lineHeight/2;for(const B of p)this.drawKeywordLine(x,B,M+(A-this.textWidth(B))/2,C),C+=this.lineHeight}else{const _=Math.max(1,p.length)*this.lineHeight;let M=r===g.doUntilSchleife?a.y+a.height/2-_/2:a.y+E.cellTextInsetY;for(const T of p)this.drawKeywordLine(x,T,a.x+E.cellTextInsetX,M),M+=this.lineHeight}e.children.forEach((_,M)=>{const T=l.type===g.doUntilSchleife&&M===0?{top:!0,left:!0}:{};this.drawNode(_,t,n,T,l.type)});const v=D("g");if(t.append(v),l.type===g.doUntilSchleife){const _=((j=e.children[0])==null?void 0:j.frame.x)??a.x+(e.loopBodyLeadingInset>0?e.loopBodyLeadingInset:E.loopBodyLeadingInset);this.drawLabel(v,"do",a.x+4,a.y+this.metrics.doUntilDoLabelTopInset,!0,"top");const M=u-e.headerBandHeight;this.line(v,[[_,M],[o,M]]),this.line(v,[[_,a.y],[_,M]]);let T=M+this.metrics.doUntilFooterTopInset;for(const A of p)this.drawKeywordLine(v,A,a.x+E.cellTextInsetX,T),T+=this.lineHeight}if(h&&e.dividerX!==void 0&&e.caseColumnFrames.length>1){const _=this.roofMetrics(e,a,m,e.dividerX),M=_.apex;e.caseColumnFrames.forEach((A,C)=>{if(C>=e.caseColumnFrames.length-1)return;const B=A.x+A.width,ae=Ni(B,a,M),le=Number.isFinite(ae)?Math.min(Math.max(ae,a.y),u):a.y;this.line(v,[[B,u],[B,le]])});const T=l.cases;if(T&&T.length===e.caseColumnFrames.length){const A=l.type===g.fallauswahl?_.roofBottom-6:a.y+m-8,C=E.branchLabelInsetX;if(l.type===g.verzweigung&&T.length===2){this.drawLabel(v,"true",a.x+C,A,!0,"bottom");const B=e.caseColumnFrames[1],ae=this.measure("false",this.fontSize,"bold");this.drawLabel(v,"false",B.x+B.width-C-ae,A,!0,"bottom")}else T.forEach((B,ae)=>{const le=e.caseColumnFrames[ae],xe=["default","true","false"].includes(B.name.toLowerCase()),gt=this.measure(B.name,this.fontSize,xe?"bold":"medium");this.drawLabel(v,B.name,le.x+le.width/2-gt/2,A,xe,"bottom")})}}d&&v.append(D("rect",{x:a.x,y:a.y,width:a.width,height:a.height,fill:"none",stroke:y?"rgba(66, 140, 242, 0.78)":"rgba(0, 122, 255, 0.9)","stroke-width":E.selectionLineWidth}))}}function Ni(i,e,t){const n=e.y;if(i<=t.x){const r=t.x-e.x;return Math.abs(r)<.5?t.y:n+(t.y-n)/r*(i-e.x)}const s=e.x+e.width-t.x;return Math.abs(s)<.5?t.y:t.y+(n-t.y)/s*(i-t.x)}function Bt(i,e){return i.length===e.length&&i.every((t,n)=>t===e[n])}function Ei(i){const e=[],t=n=>{e.push(n),n.children.forEach(t)};return i.forEach(t),e}function tt(i){var e,t;return{...i,textLines:Ot(i),loopBody:(e=i.loopBody)==null?void 0:e.map(tt),cases:(t=i.cases)==null?void 0:t.map(n=>({name:n.name,elements:n.elements.map(tt)}))}}const Li="modulepreload",Vi=function(i,e){return new URL(i,e).href},kn={},Z=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let a=function(h){return Promise.all(h.map(m=>Promise.resolve(m).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const l=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),u=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=a(t.map(h=>{if(h=Vi(h,n),h in kn)return;kn[h]=!0;const m=h.endsWith(".css"),d=m?'[rel="stylesheet"]':"";if(!!n)for(let y=l.length-1;y>=0;y--){const b=l[y];if(b.href===h&&(!m||b.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${d}`))return;const x=document.createElement("link");if(x.rel=m?"stylesheet":Li,m||(x.as="script"),x.crossOrigin="",x.href=h,u&&x.setAttribute("nonce",u),document.head.appendChild(x),m)return new Promise((y,b)=>{x.addEventListener("load",y),x.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return s.then(a=>{for(const l of a||[])l.status==="rejected"&&r(l.reason);return e().catch(r)})},Qe=[{code:"de",name:"Deutsch"},{code:"en",name:"English"},{code:"es",name:"Español"},{code:"fr",name:"Français"},{code:"it",name:"Italiano"},{code:"pl",name:"Polski"},{code:"tr",name:"Türkçe"},{code:"ko",name:"한국어"},{code:"ja",name:"日本語"},{code:"el",name:"Ελληνικά"},{code:"uk",name:"Українська"},{code:"ar",name:"العربية"},{code:"ru",name:"Русский"},{code:"he",name:"עברית"},{code:"nl",name:"Nederlands"},{code:"sv",name:"Svenska"},{code:"da",name:"Dansk"},{code:"nb",name:"Norsk bokmål"},{code:"zh-Hans",name:"中文（简体）"},{code:"zh-Hant",name:"中文（繁體）"},{code:"pt-PT",name:"Português"},{code:"java",name:"Java (Keywords)"}],Fi=Object.assign({"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ar.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-CxCno28C.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/da.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-BAutdlBb.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/de.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-DZlyYK1P.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/el.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-rqA-20hM.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/en.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-Dj42XC1o.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/es.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-LSTVB2Q5.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/fr.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-ByPZS4RL.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/he.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-R-16GCrk.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/it.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-DXAPah1g.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ja.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-CkJEmEEP.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/java.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-a8HTzUdm.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ko.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-BudCXCER.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/nb.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-DSvkBkp-.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/nl.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-BJ55WGVD.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/pl.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-BYJK0mdR.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/pt-PT.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-D1vfmhD5.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ru.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-1QZ0wfvJ.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/sv.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-M33nNbEe.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/tr.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-BM86Igqt.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/uk.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-UGog_aku.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/zh-Hans.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-CaVEL1es.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/zh-Hant.lproj/Localizable.strings":()=>Z(()=>import("./Localizable-DqIDp_hh.js"),[],import.meta.url).then(i=>i.default)}),Ri=Object.assign({"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/Java.strings":()=>Z(()=>import("./Java-C92fuLac.js"),[],import.meta.url).then(i=>i.default)}),Ui=Object.assign({"../i18n/ar.strings":()=>Z(()=>import("./ar-B3H4SiuF.js"),[],import.meta.url).then(i=>i.default),"../i18n/da.strings":()=>Z(()=>import("./da-Dk5zomLA.js"),[],import.meta.url).then(i=>i.default),"../i18n/de.strings":()=>Z(()=>import("./de-BSmHs4T5.js"),[],import.meta.url).then(i=>i.default),"../i18n/el.strings":()=>Z(()=>import("./el-4Lc6ygls.js"),[],import.meta.url).then(i=>i.default),"../i18n/en.strings":()=>Z(()=>import("./en-BdgHaXaO.js"),[],import.meta.url).then(i=>i.default),"../i18n/es.strings":()=>Z(()=>import("./es-BoIFNkHZ.js"),[],import.meta.url).then(i=>i.default),"../i18n/fr.strings":()=>Z(()=>import("./fr-CRm3m9NP.js"),[],import.meta.url).then(i=>i.default),"../i18n/he.strings":()=>Z(()=>import("./he-CRSasNIg.js"),[],import.meta.url).then(i=>i.default),"../i18n/it.strings":()=>Z(()=>import("./it-D4_NZV9g.js"),[],import.meta.url).then(i=>i.default),"../i18n/ja.strings":()=>Z(()=>import("./ja-CjbHNWAf.js"),[],import.meta.url).then(i=>i.default),"../i18n/ko.strings":()=>Z(()=>import("./ko-FA6Bnlqw.js"),[],import.meta.url).then(i=>i.default),"../i18n/nb.strings":()=>Z(()=>import("./nb-B5-Ft19_.js"),[],import.meta.url).then(i=>i.default),"../i18n/nl.strings":()=>Z(()=>import("./nl-BJYYxoEI.js"),[],import.meta.url).then(i=>i.default),"../i18n/pl.strings":()=>Z(()=>import("./pl-0ZVIChVZ.js"),[],import.meta.url).then(i=>i.default),"../i18n/pt-PT.strings":()=>Z(()=>import("./pt-PT-BbYEYiOb.js"),[],import.meta.url).then(i=>i.default),"../i18n/ru.strings":()=>Z(()=>import("./ru-BSln9yTg.js"),[],import.meta.url).then(i=>i.default),"../i18n/sv.strings":()=>Z(()=>import("./sv-CS3rJy8a.js"),[],import.meta.url).then(i=>i.default),"../i18n/tr.strings":()=>Z(()=>import("./tr-B3eoycOW.js"),[],import.meta.url).then(i=>i.default),"../i18n/uk.strings":()=>Z(()=>import("./uk-D4lTLQ9_.js"),[],import.meta.url).then(i=>i.default),"../i18n/zh-Hans.strings":()=>Z(()=>import("./zh-Hans-JhWROkXM.js"),[],import.meta.url).then(i=>i.default),"../i18n/zh-Hant.strings":()=>Z(()=>import("./zh-Hant-DoW_8Sxy.js"),[],import.meta.url).then(i=>i.default)});function It(i,e){var t;return(t=Object.entries(i).find(([n])=>n.endsWith(e)))==null?void 0:t[1]}function Yi(i){const e=new Map,t=i.replace(/\/\*[\s\S]*?\*\//g,"").replace(/^\s*\/\/.*$/gm,""),n=/"((?:[^"\\]|\\.)*)"\s*=\s*"((?:[^"\\]|\\.)*)"\s*;/g,s=r=>r.replace(/\\(u[0-9a-fA-F]{4}|.)/g,(a,l)=>l==="n"?`
`:l==="t"?"	":l.startsWith("u")&&l.length===5?String.fromCharCode(parseInt(l.slice(1),16)):l);for(const r of t.matchAll(n))e.set(s(r[1]),s(r[2]));return e}async function Sn(i){const e=i==="java"?It(Ri,"/Java.strings"):It(Fi,`/${i}.lproj/Localizable.strings`),t=It(Ui,`/${i}.strings`),n=new Map;for(const s of[e,t])if(s)for(const[r,a]of Yi(await s()))n.set(r,a);return n}let k1="en",S1=new Map,Je=new Map;const Z1="appLanguageCode";function Xi(){const i=new URLSearchParams(location.search).get("lang");if(i&&Qe.some(e=>e.code===i))return i;try{const e=localStorage.getItem(Z1);if(e&&Qe.some(t=>t.code===e))return e}catch{}for(const e of navigator.languages??[navigator.language]){const t=e.toLowerCase();if(t.startsWith("zh"))return/hant|tw|hk|mo/.test(t)?"zh-Hant":"zh-Hans";if(t.startsWith("pt"))return"pt-PT";if(t.startsWith("no")||t.startsWith("nn"))return"nb";if(t.startsWith("iw"))return"he";const n=Qe.find(s=>s.code!=="java"&&s.code===t.split("-")[0]);if(n)return n.code}return"en"}async function M1(i,e=!0){if(Je.size===0&&(Je=await Sn("en")),S1=i==="en"?Je:await Sn(i),k1=i,e)try{localStorage.setItem(Z1,i)}catch{}const t=document.documentElement;t.lang=i==="java"?"en":i,t.dir=i==="ar"||i==="he"?"rtl":"ltr"}function ze(){return k1}function c(i,...e){const t=S1.get(i)??Je.get(i)??i;if(e.length===0)return t;let n=0;return t.replace(/%(?:(\d+)\$)?[@d]/g,(s,r)=>String(e[r?Number(r)-1:n++]??""))}const Qi=100;function _1(i){switch(i.kind){case"finished":return"Simulation finished.";case"infiniteLoopWithoutBody":return"Infinite loop has no body.";case"unsupportedStatement":return`Unsupported statement: ${i.text}`;case"invalidExpression":return`Invalid expression: ${i.text}`;case"unknownVariable":return`Unknown variable: ${i.text}`;case"divisionByZero":return"Division by zero.";case"wholeNumberExpected":return"Please enter a whole number.";case"numberExpected":return"Please enter a number.";case"booleanExpected":return"Please enter true or false.";case"subprogramNotFound":return`No open diagram is called ${i.text}. The call was skipped.`;case"callTooDeep":return"Too many nested calls. Does a subprogram call itself?";case"callArguments":return`The call does not match the header of ${i.text}. Check the values in the parentheses.`;case"missingReturn":return`${i.text} ended without returning a value with return.`;case"other":return i.text}}class O extends Error{constructor(e){super(_1(e)),this.notice=e}}const Y=i=>new O({kind:"unsupportedStatement",text:i}),k=i=>new O({kind:"invalidExpression",text:i}),we=i=>new O({kind:"unknownVariable",text:i}),Ji=()=>new O({kind:"divisionByZero"});function Zn(i){return i instanceof O?i.notice:{kind:"other",text:i instanceof Error?i.message:String(i)}}function Oi(i){if(i===0)return"0";if(!Number.isFinite(i))return Number.isNaN(i)?"nan":i>0?"inf":"-inf";const e=Math.floor(Math.log10(Math.abs(Number(i.toPrecision(12)))));if(e<-4||e>=12){const[n,s]=i.toExponential(11).split("e"),r=n.includes(".")?n.replace(/0+$/,"").replace(/\.$/,""):n,a=Number(s);return`${r}e${a<0?"-":"+"}${String(Math.abs(a)).padStart(2,"0")}`}const t=i.toFixed(Math.max(0,11-e));return t.includes(".")?t.replace(/0+$/,"").replace(/\.$/,""):t}function Mn(i){return Number.isFinite(i)&&Math.round(i)===i?i.toFixed(1):Oi(i)}function F(i){switch(i.kind){case"int":return String(i.value);case"double":return Mn(i.value);case"string":return i.value;case"boolean":return String(i.value);case"intArray":return"["+i.value.map(String).join(", ")+"]";case"doubleArray":return"["+i.value.map(Mn).join(", ")+"]";case"stringArray":return"["+i.value.join(", ")+"]";case"booleanArray":return"["+i.value.map(String).join(", ")+"]";case"grid":return"["+$i(i).join(", ")+"]"}}function $i(i){return i.value.map(e=>"["+e.map(t=>F(j1(i.elementType,t))).join(", ")+"]")}function j1(i,e){switch(i){case"int":return{kind:"int",value:e};case"double":return{kind:"double",value:e};case"string":return{kind:"string",value:e};case"boolean":return{kind:"boolean",value:e}}}function Ki(i){return i==="string"?"":i==="boolean"?!1:0}function Ht(i){return i.kind==="intArray"||i.kind==="doubleArray"||i.kind==="stringArray"||i.kind==="booleanArray"||i.kind==="grid"}function qi(i){return i.kind==="int"||i.kind==="double"?i.value:NaN}const he=i=>({kind:"int",value:i}),te=i=>({kind:"double",value:i}),nn=i=>i!==void 0&&/\s/u.test(i),nt=i=>new RegExp("\\p{L}","u").test(i),ve=i=>new RegExp("\\p{N}","u").test(i);function _e(i){const e=Array.from(i);return e.length===0||!(nt(e[0])||e[0]==="_")?!1:e.every(t=>nt(t)||ve(t)||t==="_")}function se(i){switch(i.toLowerCase()){case"int":return"int";case"double":return"double";case"string":return"string";case"char":return"string";case"boolean":case"bool":return"boolean";default:return}}function _n(i){return i.kind==="int"?"int":i.kind==="double"?"double":i.kind==="boolean"?"boolean":"string"}function $(i){const e=Array.from(i);if(e.length===3&&e[0]==="'"&&e[2]==="'")return e[1];if(!(e.length<2||e[0]!=='"'||e[e.length-1]!=='"'))return e.slice(1,-1).join("").replaceAll('\\"','"').replaceAll("\\n",`
`)}function jn(i){return i.replaceAll("(int)","").replaceAll("(double)","").trim()}function sn(i){const e=new Array(i.length).fill(!1);let t=0,n=!1,s=!1;return i.forEach((r,a)=>{if(n){s?s=!1:r==="\\"?s=!0:r==='"'&&(n=!1);return}switch(r){case'"':n=!0;break;case"(":case"[":t+=1;break;case")":case"]":t-=1;break;default:e[a]=t===0}}),e}function it(i,e){const t=Array.from(i),n=Array.from(e),s=sn(t),r=[];let a=[],l=0;for(;l<t.length;){const o=l+n.length;if(o<=t.length&&n.every((u,h)=>t[l+h]===u)&&s.slice(l,o).every(Boolean)){r.push(a.join("").trim()),a=[],l=o;continue}a.push(t[l]),l+=1}return r.push(a.join("").trim()),r}function es(i){const e=Array.from(i),t=sn(e);for(let n=0;n<e.length;n++){if(!t[n])continue;let s;if(n+1<e.length&&t[n+1]){const l=e[n]+e[n+1];[">=","<=","==","!="].includes(l)&&(s=l)}if(s===void 0&&(e[n]==="<"||e[n]===">")&&(s=e[n]),s===void 0)continue;const r=e.slice(0,n).join("").trim(),a=e.slice(n+s.length).join("").trim();return{lhs:r,op:s,rhs:a}}}function ut(i,e){let t=0,n=!1,s=!1;for(let r=e;r<i.length;r++){const a=i[r];if(n){s?s=!1:a==="\\"?s=!0:a==='"'&&(n=!1);continue}if(a==='"')n=!0;else if(a==="(")t+=1;else if(a===")"&&(t-=1,t===0))return r}}function T1(i){const e=Array.from(i);if(!(e[0]!=="("||e[e.length-1]!==")"||ut(e,0)!==e.length-1))return e.slice(1,-1).join("").trim()}function ts(i){const e=Array.from(i),t=Array.from(".equals(");if(e[e.length-1]!==")")return;const n=sn(e);for(let s=0;s<e.length;s++){if(!n[s]||s+t.length>e.length||!t.every((a,l)=>e[s+l]===a))continue;const r=s+t.length-1;if(ut(e,r)===e.length-1)return{lhs:e.slice(0,s).join("").trim(),rhs:e.slice(r+1,-1).join("").trim()}}}function Le(i){const e=i.trim();for(const t of["if","while","until","switch"]){if(!e.startsWith(t))continue;const n=e.slice(t.length);if(!(n===""||nn(n[0])||n[0]==="("))continue;let s=n.trim();const r=T1(s);return r!==void 0&&(s=r),s===""?"true":s}return e===""?"true":e}function fe(i){const e=i.trim(),t=e.indexOf("[");if(!e.endsWith("]")||t<0)return;const n=e.slice(0,t).trim();if(!_e(n))return;const s=[];let r=t;for(;r<e.length;){if(e[r]!=="[")return;let a=0,l=-1;for(let o=r;o<e.length;o++)if(e[o]==="[")a+=1;else if(e[o]==="]"&&--a===0){l=o;break}if(l<0)return;for(s.push(e.slice(r+1,l)),r=l+1;r<e.length&&nn(e[r]);)r+=1}if(!(s.length>2))return{arrayName:n,indexExpressions:s}}function ns(i){const e=i.trim();if(!e.endsWith(")"))return;const t=/^([A-Za-z_]\w*(?:\s*\[[^\[\]]*\])*|"(?:[^"\\]|\\.)*")\s*\.\s*([A-Za-z_]\w*)\s*\(/u.exec(e);if(!t)return;const n=Array.from(e),s=Array.from(t[0]).length-1;if(ut(n,s)!==n.length-1)return;const r=n.slice(s+1,-1).join("").trim();return{target:t[1],method:t[2],args:r===""?[]:it(r,",")}}function Tn(i){return _e(i)||fe(i)!==void 0}function An(i){const e=[];let t="",n=!1,s=!1,r=0;for(const a of i){if(s){t+=a,s=!1;continue}if(a==="\\"){t+=a,s=!0;continue}if(a==='"'){n=!n,t+=a;continue}if(!n&&a==="("&&(r+=1),!n&&a===")"&&(r-=1),a==="+"&&!n&&r===0){e.push(t),t="";continue}t+=a}if(n)throw k(i);return e.push(t),e}function is(i){const e=[];let t=0,n="";for(const s of i){if(s==="{"&&(t+=1),s==="}"&&(t-=1),s===","&&t===0){e.push(n),n="";continue}n+=s}return n.trim()!==""&&e.push(n),e}function Dn(i){const e=Array.from(i),t=[];let n=0;for(;n<e.length;){const s=e[n];if(nn(s)){n+=1;continue}if(ve(s)||s==="."&&n+1<e.length&&ve(e[n+1])){const r=n;let a=0;for(;n<e.length;){if(e[n]==="."){if(a+=1,a>1)throw k(i)}else if(!ve(e[n]))break;n+=1}const l=e.slice(r,n).join("");if(l==="."||!/^[0-9]*\.?[0-9]*$/.test(l))throw k(i);t.push({t:"number",literal:l,value:Number(l)});continue}if(nt(s)||s==="_"){const r=n;for(;n<e.length&&(nt(e[n])||ve(e[n])||e[n]==="_");)n+=1;t.push({t:"identifier",name:e.slice(r,n).join("")});continue}if("+-*/%.()[]".includes(s)){t.push({t:s}),n+=1;continue}throw k(i)}return t}class ss{constructor(e,t){I(this,"index",0);this.tokens=e,this.variables=t}parseInt(){const e=this.expression().v;if(this.index!==this.tokens.length||!Number.isFinite(e))throw k("");return Math.trunc(e)}parseDouble(){return this.parseNumber().v}parseNumber(){const e=this.expression();if(this.index!==this.tokens.length)throw k("");return e}get current(){return this.tokens[this.index]}kind(){var e;return(e=this.tokens[this.index])==null?void 0:e.t}isIdent(e){const t=this.current;return(t==null?void 0:t.t)==="identifier"&&t.name===e}expression(){let e=this.term();for(let t=this.current;t&&(t.t==="+"||t.t==="-");t=this.current){this.index+=1;const n=this.term();e={v:t.t==="+"?e.v+n.v:e.v-n.v,int:e.int&&n.int}}return e}term(){let e=this.factor();for(let t=this.current;t&&(t.t==="*"||t.t==="/"||t.t==="%");t=this.current){this.index+=1;const n=this.factor(),s=e.int&&n.int;if(t.t==="*")e={v:e.v*n.v,int:s};else{if(n.v===0)throw Ji();e={v:t.t==="/"?s?Math.trunc(e.v/n.v):e.v/n.v:e.v%n.v,int:s}}}return e}factor(){const e=this.current;if(!e)throw k("");switch(this.index+=1,e.t){case"number":return{v:e.value,int:!e.literal.includes(".")};case"identifier":{const t=e.name;if(t==="Math"&&this.kind()==="."){if(this.index+=1,!this.isIdent("random"))throw k(t);if(this.index+=1,this.kind()!=="("||(this.index+=1,this.kind()!==")"))throw k("Math.random");return this.index+=1,{v:Math.random(),int:!1}}const n=this.variables.get(t);if(!n)throw we(t);if(this.kind()==="."){if(this.index+=1,!this.isIdent("length"))throw k(t);if(this.index+=1,this.kind()==="("){if(this.index+=1,this.kind()!==")")throw k(`${t}.length`);this.index+=1}if(Ht(n))return{v:n.value.length,int:!0};throw k(t)}if(this.kind()==="["){this.index+=1;const r=Math.trunc(this.expression().v);if(this.kind()!=="]")throw k(t);if(this.index+=1,n.kind==="grid"){if(!(r>=0&&r<n.value.length))throw k(`${t}[${r}]`);const a=n.value[r];if(this.kind()==="."){if(this.index+=1,!this.isIdent("length"))throw k(t);if(this.index+=1,this.kind()==="("){if(this.index+=1,this.kind()!==")")throw k(`${t}.length`);this.index+=1}return{v:a.length,int:!0}}if(this.kind()!=="[")throw k(t);this.index+=1;const l=Math.trunc(this.expression().v);if(this.kind()!=="]")throw k(t);if(this.index+=1,!(l>=0&&l<a.length))throw k(`${t}[${r}][${l}]`);if(n.elementType!=="int"&&n.elementType!=="double")throw k(t);return{v:a[l],int:n.elementType==="int"}}if(n.kind==="intArray"||n.kind==="doubleArray"){if(!(r>=0&&r<n.value.length))throw k(`${t}[${r}]`);return{v:n.value[r],int:n.kind==="intArray"}}throw k(t)}const s=qi(n);if(!Number.isFinite(s))throw k(t);return{v:s,int:n.kind==="int"}}case"-":{const t=this.factor();return{v:-t.v,int:t.int}}case"(":{const t=this.expression();if(this.kind()!==")")throw k("");return this.index+=1,t}default:throw k("")}}}function We(i){let e=i.trim();for(;e.endsWith(";");)e=e.slice(0,-1).trim();return e}function Pn(i){const e=i.slice(0,3);for(;e.length<3;)e.push("");return e}function Gt(i){const e=i.map(t=>We(t).trim());return e.length===1&&e[0].includes(";")?Pn(e[0].split(";").map(t=>t.trim())):Pn(e)}const X=i=>i.frame?{frame:i.frame,callPath:i.callPath}:{};function ee(i,e=[],t={}){const n=[],s=r=>n.push(t.frame?{...r,...t}:r);return i.forEach((r,a)=>{const l=[...e,a],o=r.textLines.join(" ").trim();switch(r.type){case g.anweisung:o!==""&&o!=="ø"&&s({path:l,text:o,kind:"statement"});break;case g.verzweigung:s({path:l,text:o||"true",kind:"branch",cases:r.cases});break;case g.fallauswahl:s({path:l,text:o||"0",kind:"switchSelection",cases:r.cases});break;case g.forSchleife:s({path:l,text:o,kind:"forLoopStart",loopBody:r.loopBody,forParts:Gt(r.textLines)});break;case g.whileSchleife:s({path:l,text:o||"true",kind:"whileLoop",loopBody:r.loopBody});break;case g.doUntilSchleife:s({path:l,text:o||"true",kind:"doUntilLoop",loopBody:r.loopBody});break;case g.endlosschleife:s({path:l,text:o||"true",kind:"infiniteLoop",loopBody:r.loopBody});break;case g.aussprung:s({path:l,text:o,kind:"jump"});break;case g.aufruf:o!==""&&o!=="ø"&&s({path:l,text:o,kind:"call"});break}}),n}function rs(i,e){const t=i.trim().replaceAll(",",".");switch(e){case"int":if(!/^[+-]?[0-9]+$/.test(t))throw new O({kind:"wholeNumberExpected"});return he(Number(t));case"double":if(!/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)([eE][+-]?[0-9]+)?$/.test(t))throw new O({kind:"numberExpected"});return te(Number(t));case"string":return{kind:"string",value:i};case"boolean":switch(t.toLowerCase()){case"true":case"wahr":return{kind:"boolean",value:!0};case"false":case"falsch":return{kind:"boolean",value:!1};default:throw new O({kind:"booleanExpected"})}}}function Cn(){return{stepIndex:0,variables:new Map,outputLines:[],isHalted:!1}}function as(i,e){for(let t=0;t<e.length;t++){const n=e[t].name.trim();if(n.toLowerCase()!=="default"){if(i.kind==="int"){if(/^[+-]?[0-9]+$/.test(n)&&Number(n)===i.value)return t}else if($(n)===i.value||n===i.value)return t}}}function ls(i){return i==="forLoopIncrement"||i==="forLoopCondition"||i==="whileLoop"||i==="doUntilCondition"||i==="infiniteLoop"}function os(i,e){return(i.frame??0)===(e.frame??0)&&i.path.length===e.path.length&&i.path.every((t,n)=>t===e.path[n])}function de(i){const e=/^(void|int|double|String|boolean)\s+([A-Za-z_]\w*)\s*\((.*)\)$/u.exec(We(i));if(!e)return;const t=[];if(e[3].trim()!=="")for(const n of e[3].split(",")){const s=/^(int|double|String|boolean|char)\s*((?:\[\s*\]){0,2})\s+([A-Za-z_]\w*)$/u.exec(n.trim());if(!s)return;const r=(s[2].match(/\[/gu)??[]).length;t.push({type:se(s[1]),name:s[3],...r>0?{dims:r}:{}})}return{returnType:se(e[1]),name:e[2],params:t}}function A1(i){const e=/^(?:(?:(int|double|String|boolean)\s+)?([A-Za-z_]\w*)\s*=\s*)?([A-Za-z_]\w*)\s*\((.*)\)$/u.exec(We(i));if(e)return{targetType:e[1]?se(e[1]):void 0,target:e[2],name:e[3],args:e[4].trim()===""?[]:it(e[4],",")}}function st(i){var t,n;const e=We(i);return((t=de(e))==null?void 0:t.name)??((n=A1(e))==null?void 0:n.name)??e.replace(/\(\s*\)$/u,"").trim()}class Nt{constructor(e,t=()=>{}){I(this,"steps");I(this,"state",Cn());I(this,"nextFrame",1);I(this,"callDepth",0);I(this,"frames",new Map);this.resolveSubprogram=t,this.steps=ee(e.elements)}get currentStepPath(){const e=this.steps[this.state.stepIndex];return(e==null?void 0:e.callPath)??(e==null?void 0:e.path)}get canStep(){return!this.state.isHalted&&!this.state.inputRequest&&this.state.stepIndex<this.steps.length}get message(){return this.state.notice&&_1(this.state.notice)}reset(e){e&&(this.steps=ee(e.elements)),this.state=Cn(),this.nextFrame=1,this.callDepth=0,this.frames.clear()}step(){const e=this.state;if(!this.canStep){!e.inputRequest&&!e.isHalted&&(e.notice={kind:"finished"});return}const t=this.steps[e.stepIndex];try{switch(t.kind){case"statement":if(/^return\b/u.test(t.text))return this.executeReturn(t);this.executeStatement(t.text);break;case"branch":return this.executeBranch(t);case"switchSelection":return this.executeSwitchSelection(t);case"forLoopStart":return this.executeForLoopStart(t);case"forLoopCondition":return this.executeForLoopCondition(t);case"forLoopIncrement":return this.executeForLoopIncrement(t);case"whileLoop":return this.executeWhileLoop(t);case"doUntilLoop":return this.enterDoUntilLoop(t);case"doUntilCondition":return this.executeDoUntilCondition(t);case"infiniteLoop":return this.enterInfiniteLoop(t);case"jump":return this.executeJump(t);case"call":return this.executeCall(t);case"callEnd":return this.executeCallEnd(t)}if(e.inputRequest){e.notice=void 0;return}e.stepIndex+=1,e.notice=this.finishedIfAtEnd()}catch(n){e.notice=Zn(n),e.isHalted=!0}}provideInput(e){const t=this.state.inputRequest;if(t){try{const n=rs(e,t.valueType);this.assignValue(n,t.variableName),this.state.lastTrace=`${t.variableName} = input -> ${F(n)}`}catch(n){this.state.inputErrorNotice=Zn(n);return}this.state.inputRequest=void 0,this.state.inputErrorNotice=void 0,this.state.stepIndex+=1,this.state.notice=this.finishedIfAtEnd()}}finishedIfAtEnd(){return this.state.stepIndex>=this.steps.length?{kind:"finished"}:void 0}splice(e){this.steps.splice(this.state.stepIndex,1,...e)}noticeAfterEntering(e){return e.length>0?void 0:this.finishedIfAtEnd()}executeBranch(e){const t=e.cases;if(!t||t.length<2)throw Y(e.text);const n=Le(e.text),s=this.evaluateBool(n),r=s?0:1,a=ee(t[r].elements,[...e.path,r],X(e));this.splice(a),this.state.lastTrace=`${n} -> ${s}`,this.state.notice=this.noticeAfterEntering(a)}executeSwitchSelection(e){const t=e.cases;if(!t||t.length===0)throw Y(e.text);const n=Le(e.text),s=this.evaluateSwitchSelector(n),r=as(s,t)??t.length-1,a=ee(t[r].elements,[...e.path,r],X(e));this.splice(a),this.state.lastTrace=`${n} -> ${t[r].name}`,this.state.notice=this.noticeAfterEntering(a)}executeForLoopStart(e){const t=Gt(e.forParts??[e.text]);t[0]!==""&&this.executeStatement(t[0]),this.splice([{...X(e),path:e.path,text:t[1],kind:"forLoopCondition",loopBody:e.loopBody,forParts:t}])}executeForLoopCondition(e){const t=Gt(e.forParts??[e.text]),n=t[1]===""?"true":t[1],s=this.evaluateBool(n);if(this.state.lastTrace=`${n} -> ${s}`,s){const r=ee(e.loopBody??[],[...e.path,0],X(e));this.splice([...r,{...X(e),path:e.path,text:t[2],kind:"forLoopIncrement",loopBody:e.loopBody,forParts:t},{...X(e),path:e.path,text:t[1],kind:"forLoopCondition",loopBody:e.loopBody,forParts:t}])}else this.splice([]),this.state.notice=this.finishedIfAtEnd()}executeForLoopIncrement(e){const t=e.text.trim();t!==""&&this.executeIncrement(t),this.splice([])}executeWhileLoop(e){const t=Le(e.text),n=this.evaluateBool(t);if(this.state.lastTrace=`${t} -> ${n}`,n){const s=ee(e.loopBody??[],[...e.path,0],X(e));this.splice([...s,{...X(e),path:e.path,text:e.text,kind:"whileLoop",loopBody:e.loopBody}]),this.state.notice=this.noticeAfterEntering(s)}else this.splice([]),this.state.notice=this.finishedIfAtEnd()}enterDoUntilLoop(e){const t=ee(e.loopBody??[],[...e.path,0],X(e));this.splice([...t,{...X(e),path:e.path,text:e.text,kind:"doUntilCondition",loopBody:e.loopBody}]),this.state.notice=this.noticeAfterEntering(t)}executeDoUntilCondition(e){const t=Le(e.text),n=this.evaluateBool(t);if(this.state.lastTrace=`${t} -> ${n}`,n){const s=ee(e.loopBody??[],[...e.path,0],X(e));this.splice([...s,{...X(e),path:e.path,text:e.text,kind:"doUntilCondition",loopBody:e.loopBody}])}else this.splice([]),this.state.notice=this.finishedIfAtEnd()}enterInfiniteLoop(e){const t=ee(e.loopBody??[],[...e.path,0],X(e));this.splice([...t,{...X(e),path:e.path,text:e.text,kind:"infiniteLoop",loopBody:e.loopBody}]),this.state.lastTrace="true -> true",this.state.notice=t.length>0?void 0:{kind:"infiniteLoopWithoutBody"}}executeJump(e){const t=e.frame??0,n=l=>l.length<e.path.length&&l.every((o,u)=>o===e.path[u]);let s=this.steps.length,r="end";for(let l=this.state.stepIndex+1;l<this.steps.length;l++){const o=this.steps[l];if((o.frame??0)===t){if(o.kind==="callEnd"){s=l+1,r="return";break}if(ls(o.kind)&&n(o.path)){for(s=l+1;s<this.steps.length&&os(this.steps[s],o);)s+=1;r="break";break}}}const a=this.steps[s-1];r==="return"&&(this.callDepth-=1),this.steps.splice(this.state.stepIndex,s-this.state.stepIndex),this.state.lastTrace=`${e.text||"break"} -> ${r}`,r==="return"&&this.finishFrame(a),this.state.notice=this.finishedIfAtEnd()}executeCall(e){const t=e.text,n=this.resolveSubprogram(st(t));if(!n){this.splice([]),this.state.lastTrace=`${t} -> ?`,this.state.notice={kind:"subprogramNotFound",text:t},this.state.stepIndex>=this.steps.length&&(this.state.notice={kind:"finished"});return}const s=A1(t),r=de(n.caption);if(r?((s==null?void 0:s.args.length)??0)!==r.params.length||(s==null?void 0:s.target)!==void 0&&!r.returnType:s!==void 0&&(s.args.length>0||s.target!==void 0))throw new O({kind:"callArguments",text:(r==null?void 0:r.name)??st(t)});if(this.callDepth>=Qi)throw new O({kind:"callTooDeep"});const l=new Map,o=[];r==null||r.params.forEach((d,p)=>{const x=s.args[p].trim();if(!d.dims){l.set(d.name,this.evaluateExpression(x,d.type));return}const y=this.state.variables.get(x);if(!y)throw/^[A-Za-z_]\w*$/u.test(x)?new O({kind:"unknownVariable",text:x}):k(x);if(!(d.dims===1?y.kind===`${d.type}Array`:y.kind==="grid"&&y.elementType===d.type))throw k(x);l.set(d.name,y),o.push({param:d.name,callerName:x})}),this.callDepth+=1;const u={frame:this.nextFrame++,callPath:e.callPath??e.path};r&&(this.frames.set(u.frame,{saved:this.state.variables,header:r,call:s,references:o}),this.state.variables=l);const h=ee(n.elements,[],u);this.splice([...h,{...u,path:e.path,text:t,kind:"callEnd"}]);const m=r==null?void 0:r.params.map((d,p)=>`${d.name} = ${d.dims?s.args[p].trim():F(l.get(d.name))}`).join(", ");this.state.lastTrace=m?`${t} -> ${m}`:`${t} -> call`}executeCallEnd(e){this.callDepth-=1,this.splice([]),this.state.lastTrace=`${e.text} -> return`,this.finishFrame(e),this.state.notice=this.finishedIfAtEnd()}executeReturn(e){const t=e.frame??0,n=We(e.text).slice(6).trim(),s=this.frames.get(t);if(s&&n!==""){if(!s.header.returnType)throw k(e.text);s.returnValue=this.evaluateExpression(n,s.header.returnType)}const r=s!=null&&s.returnValue?`${e.text} -> ${F(s.returnValue)}`:`${e.text} -> return`;if(t===0){this.steps.splice(this.state.stepIndex),this.state.lastTrace=r,this.state.notice={kind:"finished"};return}let a=this.state.stepIndex+1;for(;a<this.steps.length&&!(this.steps[a].kind==="callEnd"&&this.steps[a].frame===t);)a++;const l=this.steps[a];this.steps.splice(this.state.stepIndex,a-this.state.stepIndex+1),this.callDepth-=1,this.state.lastTrace=r,l&&this.finishFrame(l),this.state.notice=this.finishedIfAtEnd()}finishFrame(e){var o,u;const t=this.frames.get(e.frame??0);if(!t)return;this.frames.delete(e.frame??0);const n=t.references.length>0?new Map(t.saved):t.saved;for(const h of t.references){const m=this.state.variables.get(h.param);m&&n.set(h.callerName,m)}this.state.variables=n;const s=t.returnValue;if(t.header.returnType&&!s)throw new O({kind:"missingReturn",text:t.header.name});const r=(o=t.call)==null?void 0:o.target;if(!r||!s)return;let a=(u=t.call)==null?void 0:u.targetType;if(!a)try{a=this.inferTargetValueType(r)}catch{a=t.header.returnType}const l=a==="double"&&s.kind==="int"?te(s.value):a==="string"?{kind:"string",value:F(s)}:s;if(_n(l)!==a)throw k(e.text);this.assignValue(l,r),this.state.lastTrace=`${r} = ${e.text.slice(e.text.indexOf("=")+1).trim()} -> ${F(l)}`}executeStatement(e){const t=this.state,n=e.trim(),s=n.toLowerCase();if(s.startsWith("input:")){t.inputRequest=this.parseInputRequest(n),t.inputErrorNotice=void 0;return}if(s.startsWith("output:")||s.startsWith("print:")){const p=n.slice(s.startsWith("output:")?7:6),x=this.renderOutputExpression(p),y=this.evaluateOutputExpression(p);t.outputLines.push(y),t.lastTrace=`${x} -> ${y}`;return}if(n.endsWith("++")||n.endsWith("--")||n.includes("+=")||n.includes("-=")){this.executeIncrement(n);return}const r=n.indexOf("=");if(r<0)throw Y(n);const a=n.slice(0,r).trim(),l=n.slice(r+1),o=this.parseArrayDeclaration(a,l);if(o){t.variables.set(o.name,o.value),t.lastTrace=`${o.name} = new ${o.typeName}[${o.count}]`;return}const u=this.parseAssignmentTarget(a);let h;try{h=this.renderNumericExpression(l)}catch{h=l.trim()}let m=u.valueType;if(!m)try{m=this.inferTargetValueType(u.variableName)}catch{m="int"}const d=this.evaluateExpression(l,m);this.assignValue(d,u.variableName),t.lastTrace=`${u.variableName} = ${h} -> ${F(d)}`}executeIncrement(e){const t=this.state.variables;for(const[n,s]of[["++",1],["--",-1]]){if(!e.endsWith(n))continue;const r=e.slice(0,-2).trim(),a=t.get(r);if(!_e(r)||!a)throw Y(e);const l=s>0?"+":"-";if(a.kind==="int"){t.set(r,he(a.value+s)),this.state.lastTrace=`${r} = ${a.value} ${l} 1 -> ${a.value+s}`;return}if(a.kind==="double"){const o=a.value+s;t.set(r,te(o)),this.state.lastTrace=`${r} = ${F(a)} ${l} 1 -> ${F(te(o))}`;return}throw Y(e)}for(const[n,s]of[["+=",1],["-=",-1]]){const r=e.indexOf(n);if(r<0)continue;const a=e.slice(0,r).trim(),l=e.slice(r+2),o=t.get(a);if(!_e(a)||!o)throw Y(e);const u=s>0?"+":"-";if(o.kind==="int"){const h=this.evaluateInt(l),m=o.value+s*h;t.set(a,he(m)),this.state.lastTrace=`${a} = ${o.value} ${u} ${h} -> ${m}`;return}if(o.kind==="double"){const h=this.evaluateDouble(l),m=o.value+s*h;t.set(a,te(m)),this.state.lastTrace=`${a} = ${F(o)} ${u} ${F(te(h))} -> ${F(te(m))}`;return}throw Y(e)}this.executeStatement(e)}parseAssignmentTarget(e){if(fe(e))return{variableName:e.trim()};const t=e.split(/\s+/u).filter(Boolean);let n,s;if(t.length===1)n=t[0];else if(t.length===2&&se(t[0]))n=t[1],s=se(t[0]);else if(t.length===3&&t[0]==="const"&&se(t[1]))n=t[2],s=se(t[1]);else throw Y(e);if(!Tn(n))throw Y(e);return{variableName:n,valueType:s}}parseInputRequest(e){const t=e.slice(6).trim(),n=/^(\S+)(?:\s+(\S+))?(?:\s+([\s\S]*))?$/u.exec(t);if(!n)throw Y(e);const s=[n[1],n[2],n[3]].filter(h=>h!==void 0);let r,a,l;const o=se(s[0]);if(s.length>=2&&o?(r=s[1],a=o,l=(s[2]??"").trim()):(r=s[0],a=this.inferTargetValueType(r),l=(s[1]??"").trim()),!Tn(r))throw Y(e);const u=$(l)??l;return{variableName:r,valueType:a,prompt:u===""?`${r}:`:u}}parseArrayDeclaration(e,t){const n=e.split(/\s+/u).filter(Boolean);if(n.length!==2||!n[0].endsWith("[]"))return;const s=n[0].endsWith("[][]"),r=n[0].slice(0,s?-4:-2),a=se(r),l=n[1];if(!a||!_e(l))throw Y(e);if(s)return this.parseGridDeclaration(l,r,a,t);const o=t.trim();if(o.startsWith("{")&&o.endsWith("}")){const p=o.slice(1,-1).split(",").map(y=>y.trim());let x;switch(a){case"int":x={kind:"intArray",value:p.map(y=>this.evaluateInt(y))};break;case"double":x={kind:"doubleArray",value:p.map(y=>this.evaluateDouble(y))};break;case"string":x={kind:"stringArray",value:p.map(y=>$(y)??this.evaluateOutputExpression(y))};break;case"boolean":x={kind:"booleanArray",value:p.map(y=>this.evaluateBool(y))};break}return{name:l,typeName:r,count:p.length,value:x}}const u=`new ${r}[`;if(!o.startsWith(u)){const p=this.evaluateStringMethod(o);if((p==null?void 0:p.kind)==="stringArray"&&a==="string")return{name:l,typeName:r,count:p.value.length,value:p}}if(!o.startsWith(u)||!o.endsWith("]"))throw Y(t);const h=o.slice(u.length,-1),m=this.evaluateInt(h);if(m<0)throw k(h);const d=a==="int"?{kind:"intArray",value:new Array(m).fill(0)}:a==="double"?{kind:"doubleArray",value:new Array(m).fill(0)}:a==="boolean"?{kind:"booleanArray",value:new Array(m).fill(!1)}:{kind:"stringArray",value:new Array(m).fill("")};return{name:l,typeName:r,count:m,value:d}}parseGridDeclaration(e,t,n,s){var m;const r=s.trim(),a=d=>{switch(n){case"int":return this.evaluateInt(d);case"double":return this.evaluateDouble(d);case"boolean":return this.evaluateBool(d);case"string":return $(d.trim())??this.evaluateOutputExpression(d)}};if(r.startsWith("{")&&r.endsWith("}")){const d=is(r.slice(1,-1)).map(p=>{const x=p.trim();if(!x.startsWith("{")||!x.endsWith("}"))throw k(x);return x.slice(1,-1).trim()===""?[]:x.slice(1,-1).split(",").map(y=>a(y.trim()))});return{name:e,typeName:t,count:`${d.length}][${((m=d[0])==null?void 0:m.length)??0}`,value:{kind:"grid",elementType:n,value:d}}}const l=new RegExp(String.raw`^new\s+${t}\s*\[(.+)\]\s*\[(.+)\]$`,"u").exec(r);if(!l)throw Y(s);const o=this.evaluateInt(l[1]),u=this.evaluateInt(l[2]);if(o<0)throw k(l[1]);if(u<0)throw k(l[2]);const h={kind:"grid",elementType:n,value:Array.from({length:o},()=>new Array(u).fill(Ki(n)))};return{name:e,typeName:t,count:`${o}][${u}`,value:h}}arrayIndex(e){const t=this.evaluateInt(e);if(t<0)throw k(e);return t}evaluateReference(e){const t=e.trim(),n=this.state.variables.get(t);if(n)return n;const s=this.evaluateStringMethod(t);if(s)return s;const r=fe(t);if(r)return this.valueInArray(r.arrayName,r.indexExpressions.map(a=>this.arrayIndex(a)))}evaluateStringMethod(e){const t=ns(e);if(!t)return;const n=$(t.target)??this.stringValueOf(t.target);if(n===void 0)return;const s=t.args,r=h=>{const m=s[h];if(m===void 0)throw k(e);const d=$(m.trim());if(d!==void 0)return d;const p=this.evaluateReference(m);if((p==null?void 0:p.kind)==="string")return p.value;throw k(m)},a=h=>{if(s[h]===void 0)throw k(e);return this.evaluateInt(s[h])},l=h=>{if(s.length!==h)throw k(e)},o=Array.from(n),u=(h,m)=>{if(h<0||h>m)throw k(e);return h};switch(t.method){case"length":return l(0),he(o.length);case"charAt":return l(1),{kind:"string",value:o[u(a(0),o.length-1)]};case"substring":{if(s.length!==1&&s.length!==2)throw k(e);const h=u(a(0),o.length),m=s.length===2?u(a(1),o.length):o.length;if(m<h)throw k(e);return{kind:"string",value:o.slice(h,m).join("")}}case"indexOf":{l(1);const h=n.indexOf(r(0));return he(h<0?-1:Array.from(n.slice(0,h)).length)}case"toUpperCase":return l(0),{kind:"string",value:n.toUpperCase()};case"toLowerCase":return l(0),{kind:"string",value:n.toLowerCase()};case"trim":return l(0),{kind:"string",value:n.trim()};case"contains":return l(1),{kind:"boolean",value:n.includes(r(0))};case"startsWith":return l(1),{kind:"boolean",value:n.startsWith(r(0))};case"endsWith":return l(1),{kind:"boolean",value:n.endsWith(r(0))};case"replace":return l(2),{kind:"string",value:n.replaceAll(r(0),r(1))};case"split":{l(1);const h=r(0),m=h===""?o:n.split(h);for(;m.length>0&&m[m.length-1]==="";)m.pop();return{kind:"stringArray",value:m}}default:return}}stringValueOf(e){const t=e.trim(),n=this.state.variables.get(t);if(n)return n.kind==="string"?n.value:void 0;const s=fe(t);if(!s)return;const r=this.valueInArray(s.arrayName,s.indexExpressions.map(a=>this.arrayIndex(a)));return r.kind==="string"?r.value:void 0}substituteStringCalls(e){if(!e.includes("("))return e;let t="",n=e;const s=/([A-Za-z_]\w*(?:\[[^\[\]]*\])*|"(?:[^"\\]|\\.)*")\s*\.\s*(length|indexOf)\s*\(/u;for(let r=s.exec(n);r;r=s.exec(n)){const a=r.index+r[0].length-1,l=ut(Array.from(n),Array.from(n.slice(0,a)).length);if(l===void 0)break;const o=Array.from(n),u=o.slice(Array.from(n.slice(0,r.index)).length,l+1).join(""),h=this.evaluateStringMethod(u),m=o.slice(0,Array.from(n.slice(0,r.index)).length).join("");(h==null?void 0:h.kind)==="int"?t+=m+String(h.value):t+=m+u,n=o.slice(l+1).join("")}return t+n}valueInArray(e,t){const n=this.state.variables.get(e);if(!n)throw we(e);const s=`${e}[${t.join("][")}]`;if(n.kind==="grid"){if(t.length!==2)throw k(s);const a=n.value[t[0]];if(!a||t[1]>=a.length)throw k(s);return j1(n.elementType,a[t[1]])}if(t.length!==1)throw k(s);const r=t[0];if(!Ht(n))throw k(e);if(r>=n.value.length)throw k(s);switch(n.kind){case"intArray":return he(n.value[r]);case"doubleArray":return te(n.value[r]);case"stringArray":return{kind:"string",value:n.value[r]};case"booleanArray":return{kind:"boolean",value:n.value[r]};default:throw k(e)}}inferTargetValueType(e){const t=e.trim(),n=this.state.variables.get(t);if(n)return _n(n);const s=fe(t);if(s){const r=this.state.variables.get(s.arrayName);if(!r)throw we(s.arrayName);if(r.kind==="intArray")return"int";if(r.kind==="doubleArray")return"double";if(r.kind==="stringArray")return"string";if(r.kind==="booleanArray")return"boolean";if(r.kind==="grid")return r.elementType;throw k(s.arrayName)}throw Y(e)}assignValue(e,t){const n=t.trim(),s=fe(n);if(!s){this.state.variables.set(n,e);return}const r=s.indexExpressions.map(u=>this.arrayIndex(u)),a=this.state.variables.get(s.arrayName);if(!a)throw we(s.arrayName);if(a.kind==="grid"){if(r.length!==2||r[0]>=a.value.length||r[1]>=a.value[r[0]].length)throw k(n);const u=a.elementType==="double"&&e.kind==="int"||e.kind===a.elementType?e.value:void 0;if(u===void 0||Ht(e))throw k(n);const h=a.value.map(m=>[...m]);h[r[0]][r[1]]=u,this.state.variables.set(s.arrayName,{...a,value:h});return}if(r.length!==1)throw k(n);const l=r[0];let o;if(a.kind==="intArray"&&e.kind==="int")o={kind:"intArray",value:[...a.value]};else if(a.kind==="doubleArray"&&(e.kind==="double"||e.kind==="int"))o={kind:"doubleArray",value:[...a.value]};else if(a.kind==="stringArray"&&e.kind==="string")o={kind:"stringArray",value:[...a.value]};else if(a.kind==="booleanArray"&&e.kind==="boolean")o={kind:"booleanArray",value:[...a.value]};else throw k(n);if(l>=o.value.length)throw k(n);o.value[l]=e.value,this.state.variables.set(s.arrayName,o)}evaluateOutputExpression(e){return An(e).map(t=>{const n=t.trim(),s=$(n);if(s!==void 0)return s;const r=this.evaluateReference(n);return F(r||this.evaluateNumeric(n))}).join("")}renderOutputExpression(e){return An(e).map(t=>{const n=t.trim();if($(n)!==void 0)return n;const s=this.evaluateReference(n);if(s)return F(s);try{return this.renderNumericExpression(n)}catch{return n}}).join(" + ")}evaluateExpression(e,t){switch(t){case"int":return he(this.evaluateInt(e));case"double":return te(this.evaluateDouble(e));case"string":{const n=e.trim(),s=$(n);if(s!==void 0)return{kind:"string",value:s};const r=this.evaluateReference(n);return r?{kind:"string",value:F(r)}:{kind:"string",value:this.evaluateOutputExpression(e)}}case"boolean":return{kind:"boolean",value:this.evaluateBool(e)}}}evaluateNumeric(e){const{v:t,int:n}=this.parser(e).parseNumber();return n||Number.isFinite(t)&&Math.round(t)===t?he(t):te(t)}parser(e){return new ss(Dn(jn(this.substituteStringCalls(e))),this.state.variables)}evaluateInt(e){return this.parser(e).parseInt()}evaluateDouble(e){return this.parser(e).parseDouble()}evaluateBool(e){const t=e.trim();if(t==="true")return!0;if(t==="false")return!1;const n=this.evaluateReference(t);if((n==null?void 0:n.kind)==="boolean")return n.value;const s=it(t,"||");if(s.length>1)return s.some(u=>this.evaluateBool(u));const r=it(t,"&&");if(r.length>1)return r.every(u=>this.evaluateBool(u));if(t.startsWith("!")&&!t.startsWith("!="))return!this.evaluateBool(t.slice(1));const a=T1(t);if(a!==void 0)return this.evaluateBool(a);const l=ts(t);if(l)return this.evaluateComparison(l.lhs,"==",l.rhs);const o=es(t);if(o)return this.evaluateComparison(o.lhs,o.op,o.rhs);if(this.stringOperand(t)!==void 0)throw k(t);return this.evaluateDouble(t)!==0}evaluateComparison(e,t,n){const s=this.booleanOperand(e),r=this.booleanOperand(n);if((s!==void 0||r!==void 0)&&(t==="=="||t==="!=")){const h=s??this.evaluateBool(e),m=r??this.evaluateBool(n);return t==="=="?h===m:h!==m}const a=this.stringOperand(e),l=this.stringOperand(n);let o,u;if(a!==void 0||l!==void 0){if(a===void 0||l===void 0)throw k(`${e} ${t} ${n}`);o=a,u=l}else o=this.evaluateDouble(e),u=this.evaluateDouble(n);switch(t){case"==":return o===u;case"!=":return o!==u;case"<":return o<u;case"<=":return o<=u;case">":return o>u;case">=":return o>=u;default:throw k(`${e} ${t} ${n}`)}}booleanOperand(e){const t=e.trim();if(t==="true")return!0;if(t==="false")return!1;const n=this.evaluateReference(t);return(n==null?void 0:n.kind)==="boolean"?n.value:void 0}stringOperand(e){const t=e.trim(),n=$(t);if(n!==void 0)return n;const s=this.evaluateReference(t);return(s==null?void 0:s.kind)==="string"?s.value:void 0}evaluateSwitchSelector(e){const t=e.trim(),n=$(t);if(n!==void 0)return{kind:"text",value:n};const s=this.state.variables.get(t);if(s)switch(s.kind){case"int":return{kind:"int",value:s.value};case"double":return{kind:"int",value:Math.trunc(s.value)};case"string":return{kind:"text",value:s.value};default:throw k(t)}return/^[+-]?[0-9]+$/.test(t)?{kind:"int",value:Number(t)}:{kind:"int",value:this.evaluateInt(t)}}renderNumericExpression(e){return Dn(jn(e)).map(t=>{if(t.t==="number")return t.literal;if(t.t==="identifier"){const n=this.state.variables.get(t.name);if(!n)throw we(t.name);return F(n)}return t.t}).join(" ").replaceAll("( ","(").replaceAll(" )",")").replaceAll(" . ",".").replaceAll("[ ","[").replaceAll(" ]","]")}}const D1={baseIndent:0,indentPerLevel:4,includeDiagramTextAsComments:!1,includeEmptyElseBranch:!0,pseudocodeNote:"Pseudocode – not a runnable program"};function P1(i,e,t={},n=[]){const s=C1(i,e,t);let r="";e==="javascript"&&(r+=`"use strict";

`);const a=[i,...e==="java"?[]:n];if(e==="python"&&a.some(Bs)&&(r+=`import random

`),e==="java"&&Ft(i)&&(r+=`// import java.util.Scanner;
`,r+=`Scanner scanner = new Scanner(System.in);

`),i.pseudocode&&(r+=(e==="python"?"# ":"// ")+s.pseudocodeNote+`

`),e!=="java")for(const u of n){if(u===i)continue;const h=de(u.caption);h&&(r+=Et(u,h,e,t,0)+`
`)}const l=de(i.caption),o={out:""};if(l)o.out=Et(i,l,e,t,s.baseIndent);else for(const u of i.elements)dt(u,e,s,s.baseIndent,o);if(r+=o.out,r.trim()===""){const u=us(e);return e==="javascript"?`"use strict";

`+u:u}return Ns(r.replace(/^[\n\r]+|[\n\r]+$/g,""),e)}function C1(i,e,t){const n={...D1,...t,jsIntVariables:new Set,arrayElementTypes:fs(i),stringVariables:bs(i)};return e!=="java"&&(n.jsIntVariables=Ws(i)),n}const Wn=i=>i==="string"?"String":i===void 0?"void":i;function Et(i,e,t,n,s){const r=C1(i,t,n);for(const o of e.params)o.dims||(o.type==="int"&&r.jsIntVariables.add(o.name),o.type==="string"&&r.stringVariables.add(o.name));const a=e.params.map(o=>o.name).join(", "),l={out:""};for(const o of i.elements)dt(o,t,r,s+r.indentPerLevel,l);switch(l.out.trim()===""&&(l.out=w(s+r.indentPerLevel)+(t==="python"?`pass
`:`
`)),t){case"java":{const o=e.params.map(u=>`${Wn(u.type)}${"[]".repeat(u.dims??0)} ${u.name}`).join(", ");return`${w(s)}public static ${Wn(e.returnType)} ${e.name}(${o}) {
${l.out}${w(s)}}
`}case"python":return`${w(s)}def ${e.name}(${a}):
${l.out}`;case"javascript":return`${w(s)}function ${e.name}(${a}) {
${l.out}${w(s)}}
`}}const w=i=>i>0?" ".repeat(i):"";function P(i,e){const t=i.exec(e);return t?Array.from(t,n=>n??""):void 0}function us(i,e){return i==="python"?"# empty element":"// empty element"}const Lt=i=>i.trim()==="ø";function W1(i,e){return w(i)+(e==="python"?`# empty element
`:`// empty element
`)}function hs(i){switch(i.type){case g.leerElement:return!0;case g.anweisung:case g.aufruf:return i.textLines.map(e=>e.trim()).every(e=>e===""||Lt(e));default:return!1}}function ms(i){return i.every(hs)}function rn(i,e,t){const n=i.map(s=>s.replace(/^[ \t]+|[ \t]+$/g,"")).filter(s=>s!=="");return n.length===0?"":e==="python"?w(t)+`"""
`+n.map(s=>w(t)+s+`
`).join("")+w(t)+`"""
`:n.length===1?w(t)+"/* "+n[0]+` */
`:w(t)+`/*
`+n.map(s=>w(t)+" * "+s+`
`).join("")+w(t)+` */
`}const cs=i=>i==="java"||i==="javascript";function rt(i){const e=i.trim();if(e==="")return"";if(e.startsWith("//")||e.startsWith("/*")||e.startsWith("*")||e.startsWith("#")||e.startsWith("{")||e.startsWith("}")||e.endsWith("{")||e.endsWith(";"))return e;const t=e.toLowerCase();for(const n of["if ","else","for ","while ","do ","switch ","case ","default"])if(t.startsWith(n))return e;return e+";"}function Oe(i){const e=i.map(t=>t.trim()).filter(t=>t!=="");return ds(e.length===0?"true":e.join(" "))}function ds(i){const e=i.trim();for(const t of["if","while","until","switch"]){const n=B1(t,e);if(n!==void 0)return n===""?"true":n}return e}function B1(i,e){if(!e.toLowerCase().startsWith(i))return;const t=e.slice(i.length);if(!(t===""||/^\s/.test(t)||t[0]==="("))return;let n=t.trim();return n.startsWith("(")&&n.endsWith(")")&&n.length>=2&&(n=n.slice(1,-1).trim()),n}function pe(i){let e=i.trim();for(;e.endsWith(";");)e=e.slice(0,-1).trim();return e}function gs(i){const e=i.trim(),t=e.toLowerCase();let n;if(t.startsWith("output:"))n=e.slice(7).trim();else if(t.startsWith("print:"))n=e.slice(6).trim();else return;return n===""?void 0:n}const ht=i=>i.name.includes("[")&&i.name.includes("]");function an(i){const e=i.trim();if(e==="")return;const t=P(/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s+([a-zA-Z_]\w*(?:\s*\[[^\]]+\])?)(?:\s+"([^"]*)")?\s*$/i,e);if(t){const r=t[2].replaceAll(" ","");if(r==="")return;const a=(t[3]??"").trim();return{type:at(t[1]),name:r,customPrompt:a===""?void 0:a}}const n=P(/^\s*([a-zA-Z_]\w*(?:\s*\[[^\]]+\])?)\s+"([^"]*)"\s*$/i,e);if(n){const r=n[1].replaceAll(" ","");return["int","integer","long","float","double","string","boolean","char","bool","void"].includes(r.toLowerCase())?void 0:{type:r.includes("[")?"String":"int",name:r,customPrompt:n[2].trim()}}const s=ps(e);if(s)return{type:at(s[0]),name:s[1]}}function at(i){switch(i.trim().toLowerCase()){case"integer":case"int":return"int";case"long":return"long";case"float":return"float";case"double":return"double";case"string":return"String";case"boolean":case"bool":return"boolean";case"char":return"char";default:return i}}function ps(i){const e=i.split(/[ \t]+/).filter(Boolean);if(e.length===0)return;if(e.length>=2)return[e[0],e[1]];if(!["int","double","string","boolean","char","long","float","short","byte","void","bool","integer"].includes(e[0].toLowerCase()))return["int",e[0]]}function xs(i,e,t,n,s){const r=pe(i).trim();if(r.startsWith('"'))switch(e){case"java":return w(t)+"System.out.println("+r+`);
`;case"javascript":return w(t)+"console.log("+r+`);
`;case"python":return w(t)+"print("+Pe(r,n,s)+`)
`}}function De(i){return i.replaceAll("\\","\\\\").replaceAll('"','\\"').replaceAll(`
`,"\\n").replaceAll("\r","\\r")}function ln(i,e){const t=i.trim();if(!t.toLowerCase().startsWith("input:"))return;const n=t.slice(6).trim();if(n==="")return;const s=an(n);if(s&&ht(s)&&!/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s/i.test(n)){const r=e.get(s.name.slice(0,s.name.indexOf("[")).trim());if(r)return{...s,type:r}}return s}function bs(i){const e=new Set;return ge(i.elements,t=>{for(const n of t.textLines){const s=n.trim();if(s.toLowerCase().startsWith("input:")){const l=an(s.slice(6).trim());(l==null?void 0:l.type)==="String"&&!ht(l)&&e.add(l.name);continue}const r=P(/^\s*(?:const\s+)?string\s+([a-zA-Z_]\w*)\s*=/i,s);r&&e.add(r[1]);const a=P(/^\s*string\s*\[\s*\]\s*([a-zA-Z_]\w*)\s*=/i,s);a&&e.add(a[1]+"[]")}}),e}function fs(i){const e=new Map;return ge(i.elements,t=>{for(const n of t.textLines){const s=P(/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s*\[\s*\]\s*([a-zA-Z_]\w*)/i,n)??P(/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s+([a-zA-Z_]\w*)\s*\[\s*\]/i,n);s&&e.set(s[2],at(s[1]))}}),e}function Is(i,e,t){const n=ln(i,t);if(!n)return;const s=n.customPrompt?n.customPrompt:n.name+": ",r=w(e)+'System.out.println("'+De(s)+`");
`,a=l=>ht(n)?n.name:`${l} ${n.name}`;switch(n.type){case"int":return r+w(e)+`${a("int")} = scanner.nextInt();
`;case"double":return r+w(e)+`${a("double")} = scanner.nextDouble();
`;case"String":return r+w(e)+`${a("String")} = scanner.next();
`;case"boolean":return r+w(e)+`${a("boolean")} = scanner.nextBoolean();
`;default:return}}function ys(i,e,t){const n=ln(i,t);if(!n)return;const s=!!n.customPrompt,r=s?"":w(e)+'console.log("'+De(n.name+": ")+`");
`,a=o=>{const u=s?n.customPrompt:n.name+": ";return`(prompt("${De(u)}") ?? "${o}")`},l=ht(n)?n.name:`let ${n.name}`;switch(n.type){case"int":return r+w(e)+`${l} = parseInt(${a("0")}, 10);
`;case"double":return r+w(e)+`${l} = Number(${a("0")});
`;case"String":return r+w(e)+`${l} = ${a("")};
`;case"boolean":return r+w(e)+`${l} = ${a("")}.trim().toLowerCase() === "true";
`;default:return}}function zs(i,e,t){const n=ln(i,t);if(!n)return;const s=!!n.customPrompt,r=s?"":w(e)+'print("'+De(n.name+": ")+`")
`,a=`input("${De(s?n.customPrompt:n.name+": ")}")`;switch(n.type){case"int":return r+w(e)+`${n.name} = int(${a})
`;case"double":return r+w(e)+`${n.name} = float(${a})
`;case"String":return r+w(e)+`${n.name} = ${a}
`;case"boolean":return r+w(e)+`${n.name} = ${a}.strip().lower() in ("true", "wahr")
`;default:return}}function ws(i,e,t,n,s){const r=gs(i);if(r!==void 0)switch(e){case"java":return w(t)+"System.out.println("+r+`);
`;case"javascript":return w(t)+"console.log("+r+`);
`;case"python":return w(t)+"print("+Pe(r,n,s)+`)
`}}function H1(i){const e=i.map(pe).filter(t=>t!=="");return e.length===0?";;":e.join("; ")}function vs(i){const t=H1(i).split(";"),n=ks(t[0]);return n!==void 0&&(t[0]=n),t.join(";")}function ks(i){const e=P(/^(\s*)(?:integer|int|long|float|double|string|boolean|char|bool)\s+(\w+)(?:\s*=\s*(.*))?\s*$/i,i);if(!e)return;const t=e[2].trim();if(t==="")return;const n=(e[3]??"").trim();return i.includes("=")&&n!==""?e[1]+`let ${t} = ${n}`:e[1]+`let ${t}`}function Ss(i){const e=i.map(n=>pe(n).trim()).filter(n=>n!=="");let t=e;if(e.length===1){let n=e[0];const s=B1("for",n);s!==void 0&&(n=s),t=n.split(";").map(r=>r.trim())}if(!(t.length!==3||t.some(n=>n==="")))return[t[0],t[1],t[2]]}function Zs(i,e){let t=P(/^\s*(\w+)\s*(\+\+|--)\s*$/,i)??P(/^\s*(\+\+|--)\s*(\w+)\s*$/,i);if(t){const[n,s]=t[1]==="++"||t[1]==="--"?[t[2],t[1]]:[t[1],t[2]];return n===e?s==="++"?1:-1:void 0}if(t=P(/^\s*(\w+)\s*(\+|-)=\s*(\d+)\s*$/,i),t)return t[1]===e?(t[2]==="+"?1:-1)*Number(t[3]):void 0;if(t=P(/^\s*(\w+)\s*=\s*(\w+)\s*(\+|-)\s*(\d+)\s*$/,i),t)return t[1]===e&&t[2]===e?(t[3]==="+"?1:-1)*Number(t[4]):void 0}function Bn(i,e){if(/^-?\d+$/.test(i))return String(Number(i)+e);const t=/^[\w.()[\]]+$/.test(i)?i:`(${i})`;return e>0?`${t} + ${e}`:`${t} - ${-e}`}function Ms(i,e){const t=Ss(i);if(!t)return;const[n,s,r]=t,a=P(/^\s*(?:integer|int|long|short|byte|double|float)?\s*([a-zA-Z_]\w*)\s*=\s*(.+)$/i,n);if(!a)return;const l=a[1],o={variable:l,init:`${l} = ${R(a[2],e)}`,condition:s,increment:r},u=P(/^\s*(\w+)\s*(<=|<|>=|>)\s*(.+)$/,s),h=Zs(r,l);if(!u||u[1]!==l||h===void 0||h===0)return o;const m=R(a[2],e);let d=R(u[3],e);const p=u[2];if(h>0&&p==="<=")d=Bn(d,1);else if(h<0&&p===">=")d=Bn(d,-1);else if(!(h>0&&p==="<")&&!(h<0&&p===">"))return o;const x=h===1?m==="0"?[d]:[m,d]:[m,d,String(h)];return o.rangeLine=`for ${l} in range(${x.join(", ")}):`,o}function G1(i){const e=pe(i).trim();if(e==="")return;const t=P(/^\s*const\s+(integer|int|long|float|double|string|boolean|char|bool)\s+(\w+)(?:\s*=\s*(.*))?$/i,e);if(!t)return;const n=t[2].trim();if(n==="")return;if(!e.includes("="))return{rawType:t[1].trim(),name:n};const s=(t[3]??"").trim();if(s!=="")return{rawType:t[1].trim(),name:n,rhs:s}}function _s(i,e,t,n){var l;const s=G1(i);if(!s)return;const r=at(s.rawType),a=(l=s.rhs)==null?void 0:l.trim();switch(e){case"java":return w(t)+rt(a?`final ${r} ${s.name} = ${a}`:`final ${r} ${s.name}`)+`
`;case"javascript":return a?w(t)+rt(`const ${s.name} = ${a}`)+`
`:w(t)+`let ${s.name};  // from diagram: const ${r} ${s.name}
`;case"python":return a?w(t)+`${s.name} = ${ct(a,n)}  # const ${r}
`:w(t)+`${s.name} = None  # const ${r}, uninitialized
`}}function js(i){const e=pe(i).trim();if(e===""||R1(e))return;const t=P(/^\s*(?:integer|int|long|float|double|string|boolean|char|bool)(?:\s*\[\s*\]\s+(\w+)|\s+(\w+)(\s*\[\s*\])?)\s*=\s*(.*)$/i,e);if(!t)return;const n=t[1]===""?t[2]:t[1],s=t[4].trim();if(s!=="")return{name:n,rhs:s,isArray:t[1]!==""||t[3]!==""}}function mt(i){const e=P(/^\s*\(\s*int(?:eger)?\s*\)\s*\(?\s*(.+?)\s*\)?\s*$/i,i),t=e==null?void 0:e[1].trim();return t||void 0}function ct(i,e=new Set){const t=i.trim();if(t==="null")return"None";const n=mt(t);return n!==void 0?`int(${ct(n,e)})`:R(t,e)}function N1(i,e){let t="",n="",s=0;for(;s<i.length;){if(i[s]!=='"'){n+=i[s++];continue}t+=e(n),n="";let r=s+1;for(;r<i.length&&i[r]!=='"';)r+=i[r]==="\\"?2:1;t+=i.slice(s,r+1),s=r+1}return t+e(n)}function R(i,e){const t=i.replace(/\.equals\(\s*("(?:[^"\\]|\\.)*"|[^()"]*?)\s*\)/g," == $1"),n=s=>/^\d+$/.test(s)||e.has(s);return N1(t,s=>s.replace(/\bMath\.random\s*\(\s*\)/gi,"random.random()").replace(/===/g,"==").replace(/!==/g,"!=").replace(/\s*&&\s*/g," and ").replace(/\s*\|\|\s*/g," or ").replace(/!(?!=)\s*/g,"not ").replace(/\btrue\b/g,"True").replace(/\bfalse\b/g,"False").replace(/\bnull\b/g,"None").replace(new RegExp("(?<![\\w.])([a-zA-Z_]\\w*|\\d+)\\s*\\/\\s*([a-zA-Z_]\\w*|\\d+)(?![\\w.(\\[])","g"),(r,a,l)=>n(a)&&n(l)?`${a} // ${l}`:r))}function E1(i){const e=[];let t=0,n="",s=!1;for(let r=0;r<i.length;r++){const a=i[r];if(s){n+=a,a==="\\"&&r+1<i.length?n+=i[++r]:a==='"'&&(s=!1);continue}if(a==='"')s=!0;else if(a==="("||a==="[")t++;else if(a===")"||a==="]")t--;else if(a==="+"&&t===0){e.push(n.trim()),n="";continue}n+=a}return e.push(n.trim()),e}const on=i=>/^"(?:[^"\\]|\\.)*"$/.test(i);function Pe(i,e,t){const n=E1(i),s=r=>on(r)||t.has(r)||t.has(r.replace(/^([A-Za-z_]\w*)\[[^[\]]*\]$/u,"$1[]"));return n.length<2||!n.some(s)||n.some(r=>r==="")?R(i,e):n.map(r=>s(r)?r:`str(${R(r,e)})`).join(" + ")}function L1(i,e,t=new Set){const n=pe(i).trim(),s=P(/^(\w+(?:\[[^\]]*\])?)\s*(\+\+|--)$/,n)??P(/^(\+\+|--)\s*(\w+(?:\[[^\]]*\])?)$/,n);if(s){const[l,o]=s[1]==="++"||s[1]==="--"?[s[2],s[1]]:[s[1],s[2]];return`${R(l,e)} ${o==="++"?"+=":"-="} 1`}const r=P(/^(\w+)\s*\/=\s*(.+)$/,n);if(r&&e.has(r[1]))return`${r[1]} //= ${R(r[2],e)}`;const a=P(/^([\w[\]. ]+?)\s*(=|\+=|-=|\*=|\/=|%=)\s*(.+)$/,n);if(a&&!a[3].startsWith("=")){const[,l,o,u]=a;let h;if(o==="+="&&t.has(l.trim())){const m=E1(u);h=Pe(`"" + ${u}`,e,t).replace(/^"" \+ /,""),m.length===1&&!on(u.trim())&&!t.has(u.trim())&&(h=`str(${R(u,e)})`)}else o==="="&&mt(u)===void 0&&u.trim()!=="null"?h=Pe(u,e,t):h=o==="="?ct(u,e):R(u,e);return`${l} ${o} ${h}`}return R(n,e)}const Ts=i=>i.replace(/\bMath\.random\b(?!\s*\()/gi,"Math.random()");function V1(i){const e=i.trim();return e.startsWith("{")&&e.endsWith("}")?"["+e.slice(1,-1)+"]":i}function F1(i){const e=P(/^\s*new\s+(?:byte|short|int|long|float|double|boolean|char|string)\s*\[\s*(.+)\s*\]\s*$/i,i),t=e==null?void 0:e[1].trim();return t||void 0}function R1(i){const e=P(/^\s*(int|double|string|boolean)\s*\[\s*\]\s*\[\s*\]\s*([a-zA-Z_]\w*)\s*=\s*(.+)$/i,pe(i).trim());return e?{elementType:e[1].toLowerCase(),name:e[2],rhs:e[3].trim()}:void 0}function As(i){const e=P(/^\s*new\s+(?:int|double|string|boolean)\s*\[\s*(.+?)\s*\]\s*\[\s*(.+?)\s*\]\s*$/i,i);return e?[e[1],e[2]]:void 0}const Hn=i=>i.replaceAll("{","[").replaceAll("}","]");function Gn(i,e){return i==="boolean"?e==="python"?"False":"false":i==="string"?'""':i==="double"?"0.0":"0"}function Ds(i,e,t){const n=As(i.rhs);return e==="javascript"?n?`Array.from({ length: ${n[0]} }, () => new Array(${n[1]}).fill(${Gn(i.elementType,e)}))`:Hn(i.rhs):n?`[[${Gn(i.elementType,e)}] * ${R(n[1],t)} for _ in range(${R(n[0],t)})]`:R(Hn(i.rhs),t)}function U1(i,e){const t=i.trim();if(e){const s=F1(t);return s!==void 0?`new Array(${s})`:V1(t)}const n=mt(t);return n!==void 0?`Math.floor(${U1(n,!1)})`:Ts(t)}function Ps(i,e,t){const n=i.trim();if(e){const s=F1(n);return s!==void 0?`[None] * ${s}`:R(V1(n),t)}return ct(n,t)}function Cs(i,e,t,n,s){if(e==="java")return;const r=R1(i);if(r){const u=Ds(r,e,n);return e==="javascript"?w(t)+`let ${r.name} = ${u};
`:w(t)+`${r.name} = ${u}
`}const a=js(i);if(!a)return;if(e==="javascript")return w(t)+rt(`let ${a.name} = ${U1(a.rhs,a.isArray)}`)+`
`;const o=!a.isArray&&mt(a.rhs)===void 0&&a.rhs.trim()!=="null"?Pe(a.rhs,n,s):Ps(a.rhs,a.isArray,n);return w(t)+`${a.name} = ${o}
`}function ge(i,e){for(const t of i){e(t),t.loopBody&&ge(t.loopBody,e);for(const n of t.cases??[])ge(n.elements,e)}}function Ws(i){const e=n=>["int","integer","long","short","byte"].includes(n.trim().toLowerCase()),t=new Set;return ge(i.elements,n=>{for(const s of n.textLines){const r=s.trim();if(r==="")continue;if(r.toLowerCase().startsWith("input:")){const o=an(r.slice(6).trim());o&&e(o.type)&&!o.name.includes("[")&&t.add(o.name);continue}const a=G1(r);if(a&&e(a.rawType)){t.add(a.name);continue}const l=P(/^\s*(integer|int|long|short|byte)\s+([a-zA-Z_]\w*)\s*=/i,r);l&&t.add(l[2].trim())}}),t}function Vt(i,e){const t=a=>/^\d+$/.test(a)||e.has(a),n=String.raw`(?:[a-zA-Z_]\w*|\d+(?:\.\d+)?)`,s=new RegExp(String.raw`(?<![\w.*/%]\s*)${n}(?:\s*[*/%]\s*${n})+(?![\w.(\[])`,"g"),r=a=>{const l=a.split(/\s*([*/%])\s*/);if(!l.some(h=>h==="/"))return a;let o=l[0],u=t(l[0]);for(let h=1;h<l.length;h+=2){const m=l[h],d=l[h+1];m==="/"&&u&&t(d)?o=`Math.trunc(${o} / ${d})`:o=`${o} ${m} ${d}`,u=u&&t(d)}return o};return N1(i,a=>a.replace(s,r).replace(new RegExp("(?<![\\w.])([a-zA-Z_]\\w*)\\s*\\/=\\s*([a-zA-Z_]\\w*|\\d+)(?![\\w.(\\[])","g"),(l,o,u)=>t(o)&&t(u)?`${o} = Math.trunc(${o} / ${u})`:l))}function Ft(i){let e=!1;return ge(i.elements,t=>{t.type===g.anweisung&&t.textLines.some(n=>n.trim().toLowerCase().startsWith("input:"))&&(e=!0)}),e}function Bs(i){let e=!1;return ge(i.elements,t=>{t.textLines.some(n=>/\bMath\.random\s*\(/i.test(n))&&(e=!0)}),e}function yt(i,e){const t=i.trim();return t===""?e==="python"?'""':"0":e==="java"||new RegExp("^\\p{N}+$","u").test(t)||on(t)?t:'"'+t.replaceAll('"','\\"')+'"'}function zt(i,e){const t=i.trim();if(t==="")return"";switch(e){case"java":return"/* "+t+" */";case"python":return"  # "+t;case"javascript":return" /* "+t+" */"}}function Hs(i,e,t,n,s){const r=i.map(a=>a.trim());if(!r.every(a=>a==="")){if(t.includeDiagramTextAsComments){const a=r.filter(l=>l!==""&&!Lt(l));a.length>0&&(s.out+=rn(a,e,n))}for(const a of r){if(a==="")continue;if(Lt(a)){s.out+=W1(n,e);continue}const l=t.jsIntVariables??new Set,o=t.arrayElementTypes??new Map,u=t.stringVariables??new Set,h=(e==="java"?Is(a,n,o):void 0)??(e==="javascript"?ys(a,n,o):void 0)??(e==="python"?zs(a,n,o):void 0)??ws(a,e,n,l,u)??_s(a,e,n,l)??Cs(a,e,n,l,u)??xs(a,e,n,l,u);if(h!==void 0){s.out+=e==="javascript"?Vt(h,l):h;continue}let m=a;cs(e)?m=rt(e==="javascript"?Vt(a,l):a):e==="python"&&(m=L1(a,l,u)),m!==""&&(s.out+=w(n)+m+`
`)}}}function Rt(i,e,t,n,s,r,a){s.includeDiagramTextAsComments&&(a.out+=rn(t,n,r));const l=Oe(t),o=s.jsIntVariables??new Set,u=n==="python"?R(l,o):n==="javascript"?Vt(l,o):l;a.out+=w(r)+i+u+e}function ke(i,e,t,n,s){const r=s.out.length;for(const l of i)dt(l,e,t,n,s);if(e!=="python")return;s.out.slice(r).split(`
`).map(l=>l.trim()).every(l=>l===""||l.startsWith("#"))&&(s.out+=w(n)+`pass
`)}function Gs(i,e){var n;if(e.includeDiagramTextAsComments||i.length!==1)return;const t=i[0];return t.type===g.verzweigung&&(((n=t.cases)==null?void 0:n.length)??0)>=2?t:void 0}function Ut(i,e,t,n,s,r){const a=i.cases;if(!a||a.length<2)return;const l=e==="python",o=n+t.indentPerLevel,u=!t.includeEmptyElseBranch&&ms(a[1].elements),h=u?void 0:Gs(a[1].elements,t);if(l){Rt(r?"elif ":"if ",`:
`,i.textLines,e,t,n,s),ke(a[0].elements,e,t,o,s),h?Ut(h,e,t,n,s,!0):u||(s.out+=w(n)+`else:
`,ke(a[1].elements,e,t,o,s));return}Rt(r?"} else if (":"if (",`) {
`,i.textLines,e,t,n,s),ke(a[0].elements,e,t,o,s),h?Ut(h,e,t,n,s,!0):(u||(s.out+=w(n)+`} else {
`,ke(a[1].elements,e,t,o,s)),s.out+=w(n)+`}
`)}function dt(i,e,t,n,s){const r=t.indentPerLevel,a=e==="python",l=(h,m)=>ke(h,e,t,m,s),o=(h,m)=>Rt(h,m,i.textLines,e,t,n,s),u=(h=n)=>{t.includeDiagramTextAsComments&&(s.out+=rn(i.textLines,e,h))};switch(i.type){case g.leerElement:s.out+=W1(n,e);return;case g.anweisung:case g.aufruf:Hs(i.textLines,e,t,n,s);return;case g.aussprung:{const h=Oe(i.textLines);i.textLines.some(m=>m.trim()!=="")&&u(),a?s.out+=w(n)+(h===""?`break
`:`break  # ${h}
`):s.out+=w(n)+(h===""?`break;
`:`break; // ${h}
`);return}case g.verzweigung:Ut(i,e,t,n,s,!1);return;case g.fallauswahl:{const h=i.cases;if(!h||h.length===0)return;o(a?"match ":"switch (",a?`:
`:`) {
`),h.forEach((m,d)=>{const p=d===h.length-1;if(e==="java"){const x=p?"default -> { "+zt(m.name,e)+`
`:"case "+yt(m.name,e)+` -> {
`;s.out+=w(n+r)+x,l(m.elements,n+r*2),s.out+=w(n+r)+`}
`}else if(a){const x=p?"case _:"+zt(m.name,e):"case "+yt(m.name,e)+":";s.out+=w(n+r)+x+`
`,l(m.elements,n+r*2)}else{const x=p?"default:"+zt(m.name,e):"case "+yt(m.name,e)+":";s.out+=w(n+r)+x+`
`,l(m.elements,n+r*2),s.out+=w(n+r*2)+`break;
`}}),a||(s.out+=w(n)+`}
`);return}case g.forSchleife:if(e==="java")u(),s.out+=w(n)+"for ("+H1(i.textLines)+`) {
`;else if(a){const h=t.jsIntVariables??new Set,m=Ms(i.textLines,h);if((m==null?void 0:m.rangeLine)!==void 0)u(),s.out+=w(n)+m.rangeLine+`
`;else if(m){u(),s.out+=w(n)+m.init+`
`,s.out+=w(n)+"while "+R(m.condition,h)+`:
`;for(const d of i.loopBody??[])dt(d,e,t,n+r,s);s.out+=w(n+r)+L1(m.increment,h)+`
`;return}else o("for ",`:
`)}else u(),s.out+=w(n)+"for ("+vs(i.textLines)+`) {
`;l(i.loopBody??[],n+r),a||(s.out+=w(n)+`}
`);return;case g.whileSchleife:o(a?"while ":"while (",a?`:
`:`) {
`),l(i.loopBody??[],n+r),a||(s.out+=w(n)+`}
`);return;case g.doUntilSchleife:{const h=Oe(i.textLines);if(a){s.out+=w(n)+`while True:
`;const m=n+r;l(i.loopBody??[],m),u(m),s.out+=w(m)+"if not ("+R(h,t.jsIntVariables??new Set)+`):
`,s.out+=w(m+r)+`break
`}else s.out+=w(n)+`do {
`,l(i.loopBody??[],n+r),u(),s.out+=w(n)+"} while ("+h+`);
`;return}case g.endlosschleife:{const h=Oe(i.textLines),m=h===""||h==="true";m||u(),a?s.out+=w(n)+(m?`while True:
`:`while True:  # ${h}
`):s.out+=w(n)+(m?`while (true) {
`:`while (true) /* ${h} */ {
`),l(i.loopBody??[],n+r),a||(s.out+=w(n)+`}
`);return}}}function Ns(i,e){switch(e){case"javascript":return i.replace(/\.length\(\)/g,".length").replace(/\.contains\(/g,".includes(");case"python":return Es(i).replace(/\b([a-zA-Z_]\w*(?:\[[^[\]]*\])?)\.length(?:\(\)|\b)/g,"len($1)");case"java":return Vs(i)}}function Es(i){for(let e=0;e<5;e++){const t=Y1(i);if(t===i)break;i=t}return i}function Y1(i){const e={indexOf:"find",toUpperCase:"upper",toLowerCase:"lower",trim:"strip",startsWith:"startswith",endsWith:"endswith"},t=/([A-Za-z_]\w*(?:\[[^[\]]*\]|\.\w+\(\))*|"(?:[^"\\]|\\.)*")\.(charAt|substring|contains|indexOf|toUpperCase|toLowerCase|trim|startsWith|endsWith)\(/g;let n="",s=0;for(let r=t.exec(i);r;r=t.exec(i)){const a=r.index+r[0].length-1;let l=0,o=-1;for(let d=a;d<i.length;d++)if(i[d]==="(")l+=1;else if(i[d]===")"&&--l===0){o=d;break}if(o<0)break;const u=r[1],h=Y1(i.slice(a+1,o));let m;switch(r[2]){case"charAt":m=`${u}[${h}]`;break;case"substring":{let d=0;const p=[...h].findIndex(y=>y==="("?(d+=1,!1):y===")"?(d-=1,!1):y===","&&d===0),x=p<0?[h]:[h.slice(0,p),h.slice(p+1)];m=x.length===2?`${u}[${x[0].trim()}:${x[1].trim()}]`:`${u}[${h.trim()}:]`;break}case"contains":m=`(${h.trim()} in ${u})`;break;default:m=`${u}.${e[r[2]]}(${h})`}n+=i.slice(s,r.index)+m,s=o+1,t.lastIndex=o+1}return n+i.slice(s)}function Ls(i){const e="(?:byte|short|int|long|float|double|boolean|char|String)",t=[new RegExp(`\\b(?:final\\s+)?${e}\\s*\\[\\s*\\](?:\\s*\\[\\s*\\])?\\s+([a-zA-Z_]\\w*)\\b`,"g"),new RegExp(`\\b(?:final\\s+)?${e}\\s+([a-zA-Z_]\\w*)\\s*\\[\\s*\\]`,"g")],n=new Set;for(const s of t)for(const r of i.matchAll(s))n.add(r[1].toLowerCase());return n}function Vs(i){const e=Ls(i);return i.replace(/\b([a-zA-Z_]\w*)\.length(?!\()/g,(t,n)=>e.has(n.toLowerCase())?t:`${n}.length()`)}const Fs=new Set("abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null var record sealed permits yield module open opens requires exports to uses provides with transitive".split(" "));function X1(i){const e=i.trim();if(e==="")return"Main";let t="";return Array.from(e).forEach((n,s)=>{s===0?new RegExp("\\p{L}","u").test(n)||n==="_"||n==="$"?t+=n:new RegExp("\\p{Nd}","u").test(n)?t+="_"+n:t+="_":/[\p{L}\p{M}\p{N}]/u.test(n)||n==="_"||n==="$"?t+=n:t+="_"}),t=t.replace(/_{2,}/g,"_").replace(/^_+|_+$/g,""),t===""?"Main":(new RegExp("^\\p{Nd}","u").test(t)&&(t="_"+t),Fs.has(t.toLowerCase())&&(t="_"+t),t)}function Nn(i,e,t={},n=[]){const s={...D1,...t},r=X1(e),a=[i,...n].filter((v,j,_)=>_.indexOf(v)===j).map(v=>({d:v,header:de(v.caption)})).filter(v=>v.header!==void 0),l=a.map(v=>Et(v.d,v.header,"java",t,s.indentPerLevel)),o=de(i.caption),u=a.some(v=>Ft(v.d)),h=P1(i,"java",s),m=s.indentPerLevel*2,d=Ft(i),p=d?Rs(h):h,x=w(m),y=p.trim()===""?"":p.split(`
`).map(v=>v.trim()===""?x:x+v).join(`
`);let b="";const z=l.length>0&&(d||u);(d||u)&&(b+=`import java.util.Scanner;

`),b+=`public class ${r} {
`,z&&(b+=w(s.indentPerLevel)+`static Scanner scanner = new Scanner(System.in);

`),o||(b+=w(s.indentPerLevel)+`public static void main(String[] args) {
`,d&&!z&&(b+=w(m)+`Scanner scanner = new Scanner(System.in);
`,y!==""&&(b+=`
`)),b+=y,y!==""&&!y.endsWith(`
`)&&(b+=`
`),b+=w(s.indentPerLevel)+`}
`);for(const[v,j]of l.entries())b+=(v>0||!o?`
`:"")+j;return b+=`}
`,b}function Rs(i){const e=i.split(`
`);let t=0;for(e[t]==="// import java.util.Scanner;"&&t++;t<e.length&&e[t].trim()==="";)t++;for(e[t]==="Scanner scanner = new Scanner(System.in);"&&t++;t<e.length&&e[t].trim()==="";)t++;return t>=e.length?"":e.slice(t).join(`
`)}const oe={target:"visustruct.codegen.target",javaMode:"visustruct.codegen.javaOutputMode",comments:"visustruct.codegen.includeDiagramComments",emptyElse:"visustruct.codegen.includeEmptyElse"};function Ve(i){try{return localStorage.getItem(i)}catch{return null}}function Fe(i,e){try{localStorage.setItem(i,e)}catch{}}const Us=()=>c("web_run_stopped_loop"),Q1=()=>c("web_run_cancelled"),L=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Ys(i){let e=0;return i.replace(/^(\s*)while\s*\(\s*true\s*\)(?:\s*\/\*.*?\*\/)?\s*\{/gm,(t,n)=>{const s=`__visuStructLoopGuard${e++}`;return`${n}for (let ${s} = 0; ${s} < 100000 || (() => { throw new Error(${JSON.stringify(Us())}); })(); ${s}++) {`})}function Xs(i){return Ys(i).replace(/\bprompt\s*\(/g,"await __visuStructPrompt(")}const Qs=`
let answer
let lines = []
const flush = () => {
  if (lines.length) postMessage({ type: 'log', lines })
  lines = []
}
const send = (type, text) => {
  flush()
  postMessage({ type, text })
}
const fmt = (a) => (typeof a === 'string' ? a : JSON.stringify(a))
// Ausgaben gesammelt senden, sonst bremsen viele kleine Nachrichten (z. B. in Endlosschleifen) die Seite aus.
console.log = (...args) => {
  lines.push(args.map(fmt).join(' '))
  if (lines.length >= 500) flush()
}
setInterval(flush, 50)
const __visuStructPrompt = (label) => new Promise((resolve, reject) => {
  answer = (value) => (value === null ? reject(new Error(${JSON.stringify(Q1())})) : resolve(value))
  send('prompt', String(label ?? ''))
})
onmessage = async (e) => {
  if (e.data.type === 'answer') return answer && answer(e.data.value)
  try {
    const AsyncFunction = (async () => {}).constructor
    await new AsyncFunction('__visuStructPrompt', e.data.code)(__visuStructPrompt)
    send('done')
  } catch (err) {
    send('error', String(err))
  }
}
`,wt=2e3;class Js{constructor(e,t,n,s,r=()=>[]){I(this,"element");I(this,"target");I(this,"javaMode");I(this,"comments");I(this,"emptyElse");I(this,"code","");I(this,"codeView");I(this,"javaModeRow");I(this,"runButton");I(this,"saveButton");I(this,"copyButton");I(this,"runner");I(this,"runOutput");I(this,"runInput");I(this,"pseudocodeBox");I(this,"pseudocodeHint");I(this,"worker");I(this,"outputLines",[]);I(this,"droppedLines",0);I(this,"outputFrame");I(this,"pendingAnswer");this.currentDocument=e,this.saveFile=t,this.onClose=n,this.setPseudocode=s,this.subprograms=r;const a=Ve(oe.target);this.target=a==="python"||a==="javascript"?a:"java",this.javaMode=Ve(oe.javaMode)==="class"?"class":"snippet",this.comments=Ve(oe.comments)==="true",this.emptyElse=Ve(oe.emptyElse)!=="false",this.element=document.createElement("aside"),this.element.className="codepanel",this.build()}refresh(){const e=this.currentDocument(),t=this.options();this.code=this.target==="java"&&this.javaMode==="class"?Nn(e,this.classStem(),t,this.subprograms()):P1(e,this.target,t,this.subprograms()),this.codeView.textContent=this.code,this.javaModeRow.hidden=this.target!=="java",this.saveButton.hidden=this.target!=="java",this.runButton.hidden=this.target!=="javascript"||!!e.pseudocode,this.runButton.hidden&&this.stopRun(!0),this.pseudocodeBox.checked=!!e.pseudocode,this.pseudocodeHint.hidden=!e.pseudocode;for(const n of this.element.querySelectorAll("[data-target]"))n.setAttribute("aria-pressed",String(n.dataset.target===this.target));for(const n of this.element.querySelectorAll("[data-java-mode]"))n.setAttribute("aria-pressed",String(n.dataset.javaMode===this.javaMode))}close(){this.stopRun(!0)}options(){return{includeDiagramTextAsComments:this.comments,includeEmptyElseBranch:this.emptyElse,pseudocodeNote:c("codegen_pseudocode_note")}}classStem(){return st(this.currentDocument().caption)||"Main"}build(){this.element.innerHTML=`
      <div class="code-head">
        <h2>${L(c("codegen_placeholder_title"))}</h2>
        <button class="code-close" title="${L(c("menu_close"))}" aria-label="${L(c("menu_close"))}">✕</button>
      </div>
      <div class="segmented" role="group" aria-label="${L(c("web_codegen_language"))}">
        <button data-target="java">Java</button><button data-target="python">Python</button><button data-target="javascript">JavaScript</button>
      </div>
      <div class="segmented java-mode" role="group" aria-label="${L(c("codegen_java_output_mode"))}">
        <button data-java-mode="snippet">${L(c("codegen_java_output_snippet"))}</button><button data-java-mode="class">${L(c("codegen_java_output_class"))}</button>
      </div>
      <label class="check"><input type="checkbox" data-opt="comments" /> ${L(c("web_codegen_comments"))}</label>
      <label class="check"><input type="checkbox" data-opt="emptyElse" /> ${L(c("web_codegen_empty_else"))}</label>
      <label class="check"><input type="checkbox" data-opt="pseudocode" /> ${L(c("codegen_pseudocode_toggle"))}</label>
      <p class="hint pseudocode-hint" hidden>${L(c("codegen_pseudocode_hint"))}</p>
      <div class="code-actions">
        <button data-act="copy">${L(c("codegen_copy"))}</button>
        <button data-act="save">${L(c("codegen_save_java"))}</button>
        <button data-act="run" class="primary">${L(c("codegen_run_in_browser"))}</button>
      </div>
      <pre class="code-view" tabindex="0" dir="ltr"></pre>
      <div class="runner" hidden>
        <div class="runner-head"><h2>${L(c("simulation_output"))}</h2><button data-act="stop">${L(c("simulation_stop"))}</button></div>
        <pre class="runner-out" dir="ltr"></pre>
        <form class="runner-input" hidden>
          <label></label>
          <div class="sim-input-row"><input autocomplete="off" /><button type="submit">${L(c("simulation_input_submit"))}</button><button type="button" data-act="cancel">${L(c("close_unsaved_cancel"))}</button></div>
        </form>
      </div>
      <p class="hint">${L(c("codegen_generated_hint"))}</p>
    `;const e=s=>this.element.querySelector(s);this.codeView=e(".code-view"),this.javaModeRow=e(".java-mode"),this.runButton=e("[data-act=run]"),this.saveButton=e("[data-act=save]"),this.copyButton=e("[data-act=copy]"),this.runner=e(".runner"),this.runOutput=e(".runner-out"),this.runInput=e(".runner-input"),this.pseudocodeBox=e("[data-opt=pseudocode]"),this.pseudocodeHint=e(".pseudocode-hint"),this.pseudocodeBox.addEventListener("change",()=>this.setPseudocode(this.pseudocodeBox.checked)),e(".code-close").addEventListener("click",()=>this.onClose());for(const s of this.element.querySelectorAll("[data-target]"))s.addEventListener("click",()=>{this.target=s.dataset.target,Fe(oe.target,this.target),this.refresh()});for(const s of this.element.querySelectorAll("[data-java-mode]"))s.addEventListener("click",()=>{this.javaMode=s.dataset.javaMode,Fe(oe.javaMode,this.javaMode),this.refresh()});const t=e("[data-opt=comments]");t.checked=this.comments,t.addEventListener("change",()=>{this.comments=t.checked,Fe(oe.comments,String(this.comments)),this.refresh()});const n=e("[data-opt=emptyElse]");n.checked=this.emptyElse,n.addEventListener("change",()=>{this.emptyElse=n.checked,Fe(oe.emptyElse,String(this.emptyElse)),this.refresh()}),this.copyButton.addEventListener("click",()=>this.copy()),this.saveButton.addEventListener("click",()=>{const s=X1(this.classStem()),r=Nn(this.currentDocument(),this.classStem(),this.options());this.saveFile(`${s}.java`,r)}),this.runButton.addEventListener("click",()=>this.run()),e("[data-act=stop]").addEventListener("click",()=>this.stopRun(!1)),e("[data-act=cancel]").addEventListener("click",()=>this.answer(null)),this.runInput.addEventListener("submit",s=>{s.preventDefault(),this.answer(this.runInput.querySelector("input").value)})}async copy(){var t;let e=!1;try{await navigator.clipboard.writeText(this.code),e=!0}catch{const n=document.createRange();n.selectNodeContents(this.codeView);const s=getSelection();s==null||s.removeAllRanges(),s==null||s.addRange(n),e=((t=document.execCommand)==null?void 0:t.call(document,"copy"))??!1}this.copyButton.textContent=c(e?"web_copied_check":"web_copy_manual"),setTimeout(()=>this.copyButton.textContent=c("codegen_copy"),2e3)}run(){this.stopRun(!0),this.runner.hidden=!1,this.runOutput.textContent="",this.outputLines=[],this.droppedLines=0,this.runOutput.classList.remove("error");const e=Xs(this.code),t=n=>this.onRunnerMessage(n);try{const n=URL.createObjectURL(new Blob([Qs],{type:"text/javascript"})),s=new Worker(n);URL.revokeObjectURL(n),s.onmessage=r=>t(r.data),s.onerror=r=>{r.preventDefault(),t({type:"error",text:r.message||c("web_run_error")})},s.postMessage({type:"run",code:e}),this.worker=s}catch{this.runInPage(e,t)}this.setRunning(!0)}runInPage(e,t){const n={log:(...a)=>t({type:"log",lines:[a.map(l=>typeof l=="string"?l:JSON.stringify(l)).join(" ")]})},s=a=>new Promise((l,o)=>{this.pendingAnswer=u=>u===null?o(new Error(Q1())):l(u),t({type:"prompt",text:a})}),r=(async()=>{}).constructor;new r("__visuStructPrompt","console",e)(s,n).then(()=>t({type:"done"})).catch(a=>t({type:"error",text:String(a)}))}onRunnerMessage(e){switch(e.type){case"log":this.appendOutput(e.lines??[]);break;case"prompt":{this.runInput.hidden=!1,this.runInput.querySelector("label").textContent=e.text??"";const t=this.runInput.querySelector("input");t.value="",t.focus();break}case"error":this.appendOutput([e.text??""]),this.runOutput.classList.add("error"),this.stopRun(!1);break;case"done":this.stopRun(!1);break}}appendOutput(e){this.outputLines.push(...e),this.outputLines.length>wt&&(this.droppedLines+=this.outputLines.length-wt,this.outputLines.splice(0,this.outputLines.length-wt)),this.outputFrame===void 0&&(this.outputFrame=requestAnimationFrame(()=>{this.outputFrame=void 0;const t=this.droppedLines>0?c("web_run_dropped_fmt",this.droppedLines)+`
`:"";this.runOutput.textContent=t+this.outputLines.join(`
`)+(this.outputLines.length?`
`:""),this.runOutput.scrollTop=this.runOutput.scrollHeight}))}answer(e){var t;this.runInput.hidden=!0,this.worker?this.worker.postMessage({type:"answer",value:e}):(t=this.pendingAnswer)==null||t.call(this,e),this.pendingAnswer=void 0}stopRun(e){var t;(t=this.worker)==null||t.terminate(),this.worker=void 0,this.pendingAnswer=void 0,this.runInput&&(this.runInput.hidden=!0),e&&this.runner&&(this.runner.hidden=!0),this.setRunning(!1)}setRunning(e){const t=this.element.querySelector("[data-act=stop]");t&&(t.disabled=!e)}}const Os=1e5;function $s(i,e,t){const n=new Nt(i,t),s=[...e];for(let r=0;r<Os;r++){const{state:a}=n;if(a.inputRequest){const l=s.shift();if(l===void 0)return{outputs:[...a.outputLines],missingInput:!0};if(n.provideInput(l),a.inputErrorNotice)return{outputs:[...a.outputLines],error:a.inputErrorNotice};continue}if(a.isHalted)return{outputs:[...a.outputLines],error:a.notice};if(!n.canStep)return{outputs:[...a.outputLines],unusedInputs:s.length||void 0};n.step()}return{outputs:[...n.state.outputLines],tooManySteps:!0}}function Ks(i,e){return i.length!==e.length?!1:i.every((t,n)=>En(t)===En(e[n]))}function En(i){const e=i.trim().replace(/\s+/g," ");return/^-?\d+\.0+$/.test(e)?e.replace(/\.0+$/,""):e}function qs(i,e,t){return e.map(n=>{const s=$s(i,n.inputs,t),r=!s.error&&!s.missingInput&&!s.tooManySteps&&Ks(s.outputs,n.expected);return{test:n,result:s,passed:r}})}function er(i){const e=new Set,t=n=>{for(const s of n){e.add(s.type),s.loopBody&&t(s.loopBody);for(const r of s.cases??[])t(r.elements)}};return t(i.elements),e}const tr=`---
titel: Was ist ein Struktogramm?
bereich: Erste Schritte
kurz: Algorithmen als Folge klarer Schritte darstellen und lesen.
---

## Ein Algorithmus ist eine genaue Anleitung

Ein **Algorithmus** beschreibt Schritt für Schritt, wie man eine Aufgabe löst. Jeder Schritt muss so eindeutig sein, dass ihn jemand ohne Nachfragen ausführen kann, ein Mensch genauso wie ein Computer.

Du kennst Algorithmen aus dem Alltag: ein Kochrezept, eine Wegbeschreibung oder die Anleitung für einen Schrank.

::: diagramm l1-tee.visustruct
Tee kochen als Struktogramm: Jeder Kasten ist ein Schritt.
:::

## So liest du ein Struktogramm

Ein Struktogramm wird **von oben nach unten** gelesen. Jeder Kasten ist ein Schritt. Erst wenn ein Schritt fertig ist, kommt der nächste dran.

Die Darstellung stammt von **Isaac Nassi und Ben Shneiderman** (1973). Deshalb heißt sie auch Nassi-Shneiderman-Diagramm. In Deutschland ist sie als DIN 66261 genormt.

::: bild ike-nassi.jpg ben-shneiderman.jpg
Links Isaac „Ike“ Nassi (Foto: [Ed Schipul](https://commons.wikimedia.org/wiki/File:Me_with_Ike_Nassi!!!!!_%286893328729%29.jpg), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/deed.de), zugeschnitten), rechts Ben Shneiderman (Foto: [Robert Kosara](https://commons.wikimedia.org/wiki/File:Ben_Shneiderman_at_UNCC_%283x4_cropped%29.jpg), CC0).
:::

> Ein Struktogramm hat immer genau einen Anfang (oben) und ein Ende (unten). Es gibt keine Pfeile und keine Sprünge kreuz und quer.

::: angeberwissen
Määäh, aufgepasst! 1972 waren Nassi und Shneiderman noch Doktoranden an der Stony Brook University bei New York, Shneiderman etwa 25 und Nassi etwa 23. Also quasi zwei Studis, die nebenbei Informatikgeschichte geschrieben haben.
:::

## Baustein 1: Die Sequenz

Jeder Algorithmus lässt sich aus nur **drei Grundbausteinen** zusammensetzen: **Sequenz**, **Verzweigung** und **Wiederholung**. In diesem und den nächsten beiden Schritten lernst du sie einzeln kennen.

Die **Sequenz** ist der einfachste Baustein: Mehrere Anweisungen werden **nacheinander** ausgeführt, jede genau einmal.

So sieht sie aus:

- Jede Anweisung ist ein **einfaches Rechteck**.
- Die Rechtecke stehen ohne Lücke **untereinander**.
- Ausgeführt wird von oben nach unten, eine Anweisung nach der anderen.

::: diagramm l1-sequenz.visustruct
Vier Anweisungen als Sequenz. Erst wird aufgestanden, dann Zähne geputzt und so weiter.
:::

> Auch das Tee-Beispiel von oben ist eine Sequenz.

::: angeberwissen
15 Minuten! So lange hat Shneiderman für die erste Skizze mit Sequenz, Verzweigung und Schleife gebraucht. Ich brauche länger, um mich zwischen Heu und Klee zu entscheiden.
:::

## Baustein 2: Die Verzweigung

Oft hängt der nächste Schritt von einer **Bedingung** ab. Eine Bedingung ist eine Frage, die man nur mit **ja oder nein** beantworten kann, zum Beispiel *Regnet es?* In VisuStruct heißt ja **true** (wahr) und nein **false** (falsch).

Für solche Entscheidungen gibt es die **Verzweigung**. So sieht sie aus:

- Oben steht die Bedingung in einem **Dreieck**.
- Darunter teilt sich der Kasten in **zwei Spalten**: links der Weg für **true**, rechts der Weg für **false**.
- Es wird **immer nur einer** der beiden Wege ausgeführt. Danach geht es unter der Verzweigung für beide gemeinsam weiter.

::: diagramm l1-verzweigung.visustruct
Regnet es, wird der linke Weg ausgeführt, sonst der rechte. Danach geht es in beiden Fällen mit „Losgehen“ weiter.
:::

> Soll in einem Fall nichts passieren, bleibt dieser Weg leer. Das zeigt das Zeichen **ø**.

::: angeberwissen
Rechtschreib-Alarm! Es heißt Shneiderman, ohne c. Wer „Schneiderman“ schreibt, bekommt von mir einen sanften Hornstupser. Er selbst weist übrigens darauf hin, dass ihm ständig ein c untergeschmuggelt wird.
:::

## Baustein 3: Die Wiederholung

Soll etwas **mehrmals** passieren, schreibt man es nicht mehrmals hin. Stattdessen benutzt man eine **Wiederholung**, auch **Schleife** genannt.

So sieht sie aus:

- Oben steht die Bedingung, zum Beispiel *Teller nicht leer*.
- Die Schritte, die wiederholt werden, stehen **eingerückt** darunter. Links bildet der Kasten eine **Klammer** um sie.
- Vor jedem Durchlauf wird die Bedingung geprüft. Solange sie **true** ist, werden die Schritte in der Klammer noch einmal ausgeführt. Ist sie **false**, geht es unter der Schleife weiter.

::: diagramm l1-wiederholung.visustruct
Solange der Teller nicht leer ist, wird ein Bissen gegessen. Danach wird der Teller abgeräumt.
:::

> Es gibt noch weitere Arten von Schleifen. Du lernst sie in späteren Lektionen kennen.

## Alle drei zusammen

Richtig nützlich werden die Bausteine, wenn man sie kombiniert. Das Diagramm enthält alle drei: eine Sequenz von oben nach unten, eine Verzweigung und eine Schleife.

::: diagramm l1-grundbausteine.visustruct
Die Verzweigung erkennst du am Dreieck, die Schleife an der Klammer links. Alles zusammen steht in einer Sequenz.
:::

Die Kästen können auch **ineinander geschachtelt** werden: In einer Schleife oder einem Zweig können wieder Sequenzen, Verzweigungen und Schleifen stehen.

::: angeberwissen
Trostpflaster für alle mit einer verpatzten Arbeit: Die berühmte Fachzeitschrift *Communications of the ACM* hat den Struktogramm-Artikel abgelehnt. Laut Nassi meinte der Gutachter sogar, sie sollten alle Exemplare einsammeln und verbrennen. Autsch! Er erschien 1973 dann in einem kleineren Heft und wird heute tausendfach zitiert. Ätsch! [Mehr Angeberwissen](https://visustruct.org/de/angeberwissen.html)
:::

## Andere Darstellungen: PAP und Pseudocode

Ein Struktogramm ist nicht die einzige Art, einen Algorithmus aufzuschreiben. Zwei weitere wirst du im Unterricht treffen. Hier siehst du dasselbe Tee-Beispiel wie oben in allen drei Formen.

### Programmablaufplan (PAP)

Der **Programmablaufplan**, kurz **PAP**, besteht aus Symbolen, die mit **Pfeilen** verbunden sind. Er ist nach DIN 66001 genormt. Eine Raute ist eine Verzweigung mit den Ausgängen ja und nein. Eine Schleife erkennst du daran, dass ein Pfeil **zurück nach oben** führt.

::: grafik l01-pap.svg
Das Tee-Beispiel als Programmablaufplan. Der Pfeil von „1 Minute warten“ zurück nach oben bildet die Schleife.
:::

### Pseudocode

**Pseudocode** ist Text, der wie ein Programm aussieht, aber in normaler Sprache geschrieben ist. Feste Wörter wie WENN und SOLANGE zeigen die Bausteine, die **Einrückung** zeigt, was dazugehört.

\`\`\`
Tasse auf den Tisch stellen
WENN Zucker gewünscht DANN
    Zucker hineingeben
ENDE WENN
SOLANGE Tee noch zu heiß
    1 Minute warten
ENDE SOLANGE
Tee trinken
\`\`\`

### Im Vergleich

- **Struktogramm:** Kästen ineinander, die Schleife ist eine Klammer links. Die Struktur siehst du auf einen Blick, wilde Sprünge sind unmöglich.
- **PAP:** Symbole mit Pfeilen, die Schleife ist ein Pfeil zurück nach oben. Sehr anschaulich, aber bei großen Plänen schnell unübersichtlich.
- **Pseudocode:** Text mit Einrückung, die Schleife steht zwischen SOLANGE und ENDE SOLANGE. Schnell geschrieben und schon nah am Programmcode.

> Alle drei beschreiben denselben Algorithmus. Wenn du eine Form lesen kannst, lernst du die anderen schnell.

::: angeberwissen
Nassi und Shneiderman wollten den Pfeilen an den Kragen! Ihr Artikel von 1973 hieß „Flowchart Techniques for Structured Programming“. Flowchart ist das englische Wort für Ablaufplan. Mit Pfeilen kann man nämlich kreuz und quer springen, bis der Plan aussieht wie ein Teller Spaghetti. Im Struktogramm geht das gar nicht. Mäh, so mag ich das: ordentlich, wie mein Stall.
:::

## Erst die Struktur, dann der Code

Beim Programmieren passieren zwei Dinge gleichzeitig: Du musst dir den Ablauf überlegen und die Schreibweise der Programmiersprache beachten. Mit einem Struktogramm trennst du beides.

1. Du denkst zuerst über die **Logik** nach: Welche Schritte, welche Bedingungen, welche Wiederholungen?
2. Danach übersetzt du die fertige Struktur in **Java, Python oder JavaScript**. VisuStruct kann dir den Code sogar erzeugen.

Mit der **Simulation** kannst du dein Struktogramm außerdem Schritt für Schritt ausführen und prüfen, ob es wirklich tut, was es soll.

::: angeberwissen
Programme, die kreuz und quer springen, heißen **Spaghetticode**: Wer einem Faden folgen will, verheddert sich wie in einem Teller Spaghetti. Schuld war früher der Befehl GOTO, also „springe zu Zeile …“. 1968 schrieb der Informatiker Edsger Dijkstra deshalb einen berühmten Brief: „Go To Statement Considered Harmful“, auf Deutsch „GOTO gilt als schädlich“. Seitdem baut man Programme nur noch aus Sequenz, Verzweigung und Wiederholung. In Java ist \`goto\` bis heute ein reserviertes Wort, benutzen darf man es aber nicht. Mäh, Spaghetti esse ich lieber, als sie zu programmieren.
:::

## Checkliste

::: checkliste
- Ich kann erklären, was ein Algorithmus ist. → Ein Algorithmus ist eine genaue Anleitung
- Ich weiß, dass ein Struktogramm von oben nach unten gelesen wird. → So liest du ein Struktogramm
- Ich kenne die drei Grundbausteine Sequenz, Verzweigung und Wiederholung. → Baustein 1: Die Sequenz
- Ich erkenne jeden Baustein im Struktogramm an seiner Form. → Alle drei zusammen
- Ich kann einen einfachen Algorithmus auch als PAP und als Pseudocode lesen. → Andere Darstellungen: PAP und Pseudocode
:::

## Wissenstest

::: quiz
? In welcher Richtung wird ein Struktogramm gelesen?
- [ ] Von links nach rechts
- [x] Von oben nach unten
- [ ] Von unten nach oben
> Jeder Kasten ist ein Schritt, und die Schritte folgen von oben nach unten aufeinander.

? Welcher Baustein gehört NICHT zu den drei Grundbausteinen?
- [ ] Sequenz
- [ ] Verzweigung
- [x] Sprung
- [ ] Wiederholung
> Sprünge gibt es im Struktogramm nicht. Sequenz, Verzweigung und Wiederholung reichen für jeden Algorithmus.

? Woran erkennst du im Struktogramm eine Verzweigung?
- [ ] An einer Klammer auf der linken Seite
- [x] An einem Dreieck mit der Bedingung und zwei Spalten darunter
- [ ] An mehreren Rechtecken untereinander
> Die Klammer gehört zur Schleife, Rechtecke untereinander sind eine Sequenz.

? Wann wird der Inhalt einer Schleife noch einmal ausgeführt?
- [x] Solange die Bedingung true ist
- [ ] Nur, wenn die Bedingung false ist
- [ ] Immer genau zweimal
> Vor jedem Durchlauf wird die Bedingung geprüft. Ist sie false, geht es unter der Schleife weiter.

? Was ist ein Algorithmus?
- [x] Eine eindeutige Schritt-für-Schritt-Anleitung zum Lösen einer Aufgabe
- [ ] Ein bestimmtes Programm in Java
- [ ] Ein Bild, das ein Programm erklärt
> Ein Algorithmus ist unabhängig von der Programmiersprache. Ein Struktogramm ist eine Möglichkeit, ihn aufzuschreiben.

? Woran erkennst du in einem Programmablaufplan (PAP) eine Schleife?
- [ ] An einer Klammer auf der linken Seite
- [x] An einem Pfeil, der zurück nach oben führt
- [ ] Am Wort SOLANGE
> Die Klammer gehört zum Struktogramm, SOLANGE zum Pseudocode.

? Ordne jedem Symbol im PAP seine Bedeutung zu.
= Oval -> Start oder Ende
= Rechteck -> Anweisung
= Raute -> Verzweigung
= Parallelogramm -> Ein- oder Ausgabe
> Die Raute hat zwei Ausgänge: ja und nein.

? Was zeigt im Pseudocode, welche Zeilen zu einer Schleife gehören?
- [ ] Die Farbe
- [x] Die Einrückung und das ENDE SOLANGE
- [ ] Ein Pfeil
> Alles zwischen SOLANGE und ENDE SOLANGE ist eingerückt und wird wiederholt.
:::
`,nr=`---
titel: Der Editor
bereich: Erste Schritte
kurz: Elemente einfügen, Text eingeben, verschieben und löschen.
---

## Die Oberfläche

Der Editor besteht aus vier Bereichen. Fahre mit der Maus über ein blaues Wort oder tippe es an, dann leuchtet der Bereich im Editor auf.

- **Oben die [Leiste](#zeige-leiste):** Neu, Öffnen, Speichern, Exportieren, Rückgängig, Kopieren und Einfügen, Textgröße, Code und Simulation.
- **Links die [Elemente](#zeige-elemente):** Hier liegen alle Bausteine, die du ins Struktogramm ziehen kannst. Manche nennen diesen Bereich auch Palette.
- **In der Mitte das [Struktogramm](#zeige-struktogramm):** Ein neues Diagramm enthält nur einen leeren Platzhalter, erkennbar an **ø**.
- **Unten der [Objektinspektor](#zeige-objektinspektor):** Hier bearbeitest du den Text des ausgewählten Elements.

> Diesen Lernbereich kannst du jederzeit über [Lernen](#zeige-lernen) in der Leiste ein- und ausblenden. Er bleibt neben dem Editor offen, damit du gleich ausprobieren kannst, was du liest.

## Ein Element einfügen

Ziehe ein Element aus dem Bereich **Elemente** auf das Struktogramm. Beim Ziehen zeigt eine blaue Linie, wo es landet:

- **Auf den Platzhalter ø:** Das Element ersetzt den Platzhalter.
- **Auf die obere Hälfte eines Kastens:** Das Element kommt davor.
- **Auf die untere Hälfte eines Kastens:** Das Element kommt dahinter.

::: grafik l02-einfuegen.svg
Wohin du ziehst, entscheidet, wo das neue Element landet.
:::

Du kannst auch ein Element im Bereich Elemente mit der Tastatur auswählen und **Enter** drücken. Dann wird es hinter dem ausgewählten Kasten eingefügt.

::: angeberwissen
Kästen packen und herumziehen, so wie du gerade, hat einen schicken Namen: **direkte Manipulation**. Den Begriff hat 1982 Ben Shneiderman geprägt, genau, der vom Struktogramm. Der Mann war fleißiger als ich beim Grasen. [Mehr über ihn](https://visustruct.org/de/angeberwissen.html)
:::

## Text eingeben

Klicke einen Kasten an. Er wird blau umrandet, und im Objektinspektor unter dem Diagramm erscheint sein Text. Was du dort tippst, siehst du sofort im Diagramm.

Der Kasten aus dem Bereich Elemente heißt **Anweisung**. Oben wählst du, welche Art von Anweisung er sein soll:

- **Anweisung:** etwas berechnen oder festlegen, z. B. \`int zahl = 5\`. Wie das geht, lernst du in Lektion 4.
- **Eingabe:** beim Ausführen einen Wert abfragen. Das kommt in Lektion 6.
- **Ausgabe:** etwas anzeigen. Im Diagramm steht dann \`output:\` davor, z. B. \`output: "Hallo"\`.

Für den Anfang brauchst du nur die Ausgabe. Texte, die genau so angezeigt werden sollen, schreibst du in **Anführungszeichen**.

::: diagramm l2-ausgabe.visustruct
Zwei Ausgaben nacheinander. Öffne das Diagramm im Editor und starte die Simulation, um die Ausgabe zu sehen.
:::

## Verschieben, kopieren, löschen

- **Verschieben:** Einen vorhandenen Kasten mit der Maus an eine neue Stelle ziehen.
- **Kopieren und Einfügen:** Kasten auswählen, dann Strg+C und Strg+V (am Mac ⌘C und ⌘V). Die Kopie kommt hinter den ausgewählten Kasten.
- **Löschen:** Kasten auswählen und Entf drücken.
- **Rückgängig:** Strg+Z macht den letzten Schritt rückgängig, Strg+Umschalt+Z stellt ihn wieder her.

## Übung: Hallo Welt

::: übung l2-hallo
titel: Hallo Welt
auftrag: Baue ein Struktogramm, das **Hallo Welt** ausgibt.
Ziehe eine Anweisung auf den Platzhalter, stelle sie im Objektinspektor auf **Ausgabe** und schreibe \`"Hallo Welt"\`.
test: - -> Hallo Welt
braucht: anweisung
tipp: Du brauchst nur einen einzigen Kasten. Der Text, der erscheinen soll, steht im Objektinspektor im Eingabefeld.
tipp: Achte auf die Anführungszeichen. Ohne sie sucht VisuStruct nach einer Variablen mit dem Namen Hallo.
lösung: l2-hallo-loesung.visustruct
:::

Klicke auf **Prüfen**, wenn du fertig bist. VisuStruct führt dein Struktogramm aus und vergleicht die Ausgabe.

## Übung: Zwei Zeilen

::: übung l2-zwei-zeilen
titel: Zwei Zeilen
auftrag: Gib zuerst **Hallo** und danach **Ich lerne Struktogramme** aus, jeweils in einer eigenen Zeile.
test: - -> Hallo | Ich lerne Struktogramme
tipp: Zwei Zeilen heißt: zwei Ausgaben. Die Kästen stehen untereinander und werden von oben nach unten ausgeführt.
tipp: Jede Ausgabe ist ein eigener Kasten. Ziehe die zweite Anweisung auf die untere Hälfte der ersten.
lösung: l2-zwei-zeilen-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann ein Element aus dem Bereich Elemente einfügen und einen Platzhalter ersetzen. → Ein Element einfügen
- Ich kann den Text eines Kastens ändern und zwischen Anweisung, Eingabe und Ausgabe umschalten. → Text eingeben
- Ich kann Kästen verschieben, kopieren, löschen und Schritte rückgängig machen. → Verschieben, kopieren, löschen
:::

## Wissenstest

::: quiz
? Was bedeutet das Zeichen ø in einem Kasten?
- [ ] Der Kasten enthält einen Fehler.
- [x] Hier ist noch ein leerer Platzhalter.
- [ ] Das Programm endet hier.
> Ein Platzhalter wird ersetzt, wenn du ein Element darauf ziehst.

? Du ziehst eine Anweisung auf die untere Hälfte eines Kastens. Wo landet sie?
- [ ] Davor
- [x] Dahinter
- [ ] Der Kasten wird ersetzt.

? Wie gibst du den Text Guten Tag genau so aus?
- [ ] output: Guten Tag
- [x] output: "Guten Tag"
- [ ] input: "Guten Tag"
> Ohne Anführungszeichen wird Guten Tag als Name einer Variablen verstanden.
:::
`,ir=`---
titel: Speichern, Öffnen, Exportieren
bereich: Erste Schritte
kurz: Dateien sichern, mehrere Diagramme öffnen und als Bild oder PDF weitergeben.
---

## Die Datei .visustruct

Struktogramme werden als **.visustruct**-Datei gespeichert. Dasselbe Format nutzen alle VisuStruct-Versionen: im Browser, auf Mac, iPad und iPhone und die Java-App am Rechner. Du kannst also in der Schule im Browser anfangen und zu Hause in der App weitermachen.

::: angeberwissen
Zu Nassis Studienzeit gab es keine Dateien zum Speichern, sondern Lochkarten. Nassi erzählt, dass ein Date am Samstagabend so aussah: seine spätere Frau saß mit ihm im Rechenzentrum und stanzte seine Lochkarten. Romantik, Informatik-Style!
:::

## Speichern und Öffnen

- **[Speichern](#zeige-speichern)** (Strg+S): Das Diagramm wird als Datei gespeichert. Je nach Browser fragt er nach dem Ort oder legt die Datei in den Download-Ordner.
- **[Öffnen](#zeige-oeffnen)** (Strg+O): Eine gespeicherte Datei wieder laden. Du kannst eine Datei auch einfach ins Browserfenster ziehen.

> Deine Übungen merkt sich der Browser automatisch. Das klappt aber nur in diesem Browser auf diesem Gerät. Wichtige Arbeiten solltest du deshalb immer zusätzlich als Datei speichern.

## Mehrere Diagramme in Reitern

Über dem Struktogramm siehst du die [Reiter](#zeige-reiter). Mit **+** oder [Neu](#zeige-neu) öffnest du ein weiteres, leeres Diagramm. Ein Punkt • vor dem Namen zeigt, dass es ungespeicherte Änderungen gibt.

Den [Titel](#zeige-titel) eines Diagramms trägst du in das Feld über dem Struktogramm ein. Er erscheint auch beim Exportieren und wird als Dateiname vorgeschlagen.

## Als Bild oder PDF weitergeben

Über [Exportieren …](#zeige-exportieren) in der Leiste gibst du dein Struktogramm weiter:

- **Bild (PNG):** zum Einfügen in ein Arbeitsblatt oder eine Präsentation
- **Vektorgrafik (SVG):** bleibt in jeder Größe scharf
- **PDF (A4):** eine Seite zum Abgeben oder Ausdrucken
- **Drucken** (Strg+P): direkt auf den Drucker

Mit [Text](#zeige-textgroesse) in der Leiste stellst du die Schriftgröße ein. Ein größerer Text wirkt auch beim Exportieren als Bild.

## Ausprobieren

Öffne eine deiner Übungen aus Lektion 2 und probiere Folgendes aus:

::: checkliste
- Ich habe dem Diagramm einen Titel gegeben. → Ausprobieren
- Ich habe das Diagramm als .visustruct-Datei gespeichert und wieder geöffnet. → Speichern und Öffnen
- Ich habe das Diagramm als Bild (PNG) oder PDF exportiert. → Als Bild oder PDF weitergeben
- Ich habe ein zweites Diagramm in einem neuen Reiter geöffnet. → Mehrere Diagramme in Reitern
:::

## Wissenstest

::: quiz
? Welche Datei kannst du in der Mac-App und in der Java-App wieder öffnen?
- [x] Die .visustruct-Datei
- [ ] Das exportierte PNG-Bild
- [ ] Das exportierte PDF
> Bilder und PDFs sind nur zum Ansehen. Weiterbearbeiten kannst du nur die .visustruct-Datei.

? Deine Übungen werden im Browser gemerkt. Warum solltest du trotzdem speichern?
- [ ] Weil die Übungen sonst nicht geprüft werden
- [x] Weil der Browser die Daten nur auf diesem Gerät behält und sie verloren gehen können
- [ ] Weil man ohne Speichern nicht exportieren kann
:::
`,sr=`---
titel: Variablen und Datentypen
bereich: Grundlagen
kurz: Werte speichern, die Datentypen int, double, String und boolean kennen und rechnen.
---

## Was ist eine Variable?

Eine **Variable** ist wie eine beschriftete Kiste. Sie hat einen **Namen**, einen **Datentyp** und einen **Wert**.

\`\`\`
int alter = 14
\`\`\`

Hier heißt die Variable \`alter\`, ihr Datentyp ist \`int\` (ganze Zahl), und ihr Wert ist 14. Über den Namen kannst du den Wert später wieder benutzen.

::: grafik l04-variable.svg
Die Variable als Kiste: Name auf dem Etikett, Datentyp als Aufkleber, Wert darin.
:::

> Variablennamen beginnen mit einem Buchstaben und enthalten keine Leerzeichen. Gute Namen sagen, was drinsteht: \`preis\` ist besser als \`p\`.

## Die vier Datentypen

Der Datentyp legt fest, welche Art von Wert in der Variablen stehen darf.

- **int:** ganze Zahlen, z. B. \`int anzahl = 3\` oder \`int temperatur = -5\`
- **double:** Kommazahlen, z. B. \`double preis = 2.5\`. Statt Komma schreibst du einen **Punkt**.
- **String:** Text, z. B. \`String name = "Mia"\`. Text steht in Anführungszeichen.
- **boolean:** Wahrheitswerte, nur \`true\` (wahr) oder \`false\` (falsch)

::: diagramm l05-datentypen.visustruct
Drei Variablen mit verschiedenen Datentypen. Öffne das Diagramm und starte die Simulation.
:::

Wahrheitswerte begegnen dir vor allem in **Bedingungen**: \`alter >= 18\` ist entweder \`true\` oder \`false\`. Darum geht es in Lektion 8. Du kannst das Ergebnis einer Bedingung auch in einer Variablen speichern:

\`\`\`
int alter = 15
boolean volljaehrig = alter >= 18
\`\`\`

Danach steht in \`volljaehrig\` der Wert \`false\`.

## Zuweisung mit =

Das Zeichen \`=\` heißt **Zuweisung**. Es bedeutet nicht „ist gleich“ wie in Mathe, sondern: Berechne die rechte Seite und speichere das Ergebnis in der Variablen links.

\`\`\`
int punkte = 10
punkte = punkte + 5
\`\`\`

In Mathe wäre die zweite Zeile falsch, denn keine Zahl ist gleich sich selbst plus 5. Beim Programmieren liest du sie so: Nimm den alten Wert 10, rechne plus 5 und speichere 15 in \`punkte\`. Den Datentyp schreibst du nur beim ersten Mal, wenn die Variable angelegt wird.

::: grafik l04-zuweisung.svg
Erst wird rechts gerechnet, dann landet das Ergebnis in der Variablen links.
:::

## Rechnen

Mit Zahlen kannst du rechnen:

- \`+\` plus, \`-\` minus, \`*\` mal, \`/\` geteilt
- \`%\` Rest beim Teilen, z. B. ist \`17 % 5\` gleich 2

Es gilt **Punkt vor Strich**, und Klammern werden zuerst ausgerechnet: \`2 * (3 + 4)\` ist 14.

## Übung: Rechteck

::: übung l05-rechteck
titel: Rechteck berechnen
auftrag: Ein Rechteck ist 7 lang und 4 breit. Lege die Variablen \`laenge\` und \`breite\` an. Berechne die Fläche und den Umfang in eigenen Variablen und gib beide aus, so wie hier:
\`Fläche: 28\` und in der nächsten Zeile \`Umfang: 22\`.
test: - -> Fläche: 28 | Umfang: 22
braucht: anweisung
tipp: Überlege zuerst, welche Variablen du brauchst: zwei für die Maße und zwei für die Ergebnisse. Alle sind ganze Zahlen.
tipp: Die Fläche ist Länge mal Breite, der Umfang ist 2 mal (Länge plus Breite). Für die Ausgabe schreibst du z. B. \`output: "Fläche: " + flaeche\`. Das \`+\` hängt dabei den Text und den Wert der Variablen aneinander.
lösung: l05-rechteck-loesung.visustruct
:::

## Ganzzahlige Division

Teilst du zwei ganze Zahlen und speicherst das Ergebnis in einer \`int\`-Variablen, fällt alles nach dem Komma weg. Es wird **nicht gerundet**.

\`\`\`
int x = 7 / 2      ergibt 3
int r = 7 % 2      ergibt 1 (der Rest)
double d = 7.0 / 2 ergibt 3.5
\`\`\`

Mit \`/\` und \`%\` zusammen kannst du gut umrechnen, zum Beispiel Minuten in Stunden und Minuten:

::: diagramm l05-division.visustruct
135 Minuten sind 2 Stunden (135 / 60) und 15 Minuten Rest (135 % 60).
:::

## Übung: Sekunden umrechnen

::: übung l05-sekunden
titel: Sekunden umrechnen
auftrag: 200 Sekunden sollen als Minuten und Sekunden ausgegeben werden. Die erste und die letzte Anweisung sind schon da. Füge dazwischen Anweisungen ein, die \`minuten\` und \`rest\` berechnen.
start: l05-sekunden-start.visustruct
test: - -> 3 Minuten und 20 Sekunden
braucht: anweisung
tipp: Wie viele ganze Minuten passen in 200 Sekunden, und wie viele Sekunden bleiben übrig? Rechne es erst im Kopf aus.
tipp: Eine Minute hat 60 Sekunden. Nutze \`/\` für die ganzen Minuten und \`%\` für den Rest. Beide Variablen sind vom Typ \`int\`.
lösung: l05-sekunden-loesung.visustruct
:::

## Übung: Einkauf

::: übung l05-einkauf
titel: Einkauf
auftrag: Du kaufst 3 Hefte zu je 2.5 Euro. Lege \`anzahl\` als \`int\` und \`preis\` als \`double\` an, berechne den Gesamtpreis in einer Variablen \`gesamt\` und gib \`Gesamt: 7.5 Euro\` aus.
test: - -> Gesamt: 7.5 Euro
braucht: anweisung
tipp: Anzahl mal Preis ergibt den Gesamtpreis. Überlege für jede Variable, ob sie eine ganze Zahl oder eine Kommazahl ist.
tipp: Der Gesamtpreis ist eine Kommazahl, also braucht \`gesamt\` den Typ \`double\`.
lösung: l05-einkauf-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann eine Variable mit Datentyp, Namen und Wert anlegen. → Was ist eine Variable?
- Ich kenne die Datentypen int, double, String und boolean. → Die vier Datentypen
- Ich weiß, dass = eine Zuweisung ist und kein Vergleich. → Zuweisung mit =
- Ich kann mit + - * / % rechnen und kenne die ganzzahlige Division. → Rechnen
:::

## Wissenstest

::: quiz
? Welcher Datentyp passt zu dem Wert 3.75?
- [ ] int
- [x] double
- [ ] String
- [ ] boolean
> Kommazahlen haben den Typ double. In VisuStruct schreibst du sie mit Punkt.

? Welchen Wert hat x nach \`int x = 17 / 5\`?
- [ ] 3.4
- [x] 3
- [ ] 4
> Bei ganzen Zahlen fällt alles nach dem Komma weg. Es wird nicht gerundet.

? Was ergibt \`17 % 5\`?
- [x] 2
- [ ] 3
- [ ] 3.4
> 17 geteilt durch 5 ist 3, Rest 2. Der Operator % liefert den Rest.

? Am Anfang ist \`int punkte = 10\`. Was steht nach \`punkte = punkte * 2\` in punkte?
- [ ] 10
- [ ] 12
- [x] 20
> Rechts wird mit dem alten Wert 10 gerechnet, das Ergebnis 20 wird in punkte gespeichert.
:::
`,rr=`---
titel: Sequenz
bereich: Grundlagen
kurz: Schritte nacheinander ausführen, auf die Reihenfolge achten und Werte tauschen.
---

## Schritt für Schritt

Eine **Sequenz** ist eine Folge von Schritten, die genau einmal und genau in dieser Reihenfolge ausgeführt werden. Im Struktogramm stehen die Kästen einfach untereinander.

Jeder Kasten wird erst begonnen, wenn der Kasten darüber fertig ist. Es wird nichts übersprungen und nichts wiederholt.

> Die Sequenz ist der einfachste der drei Grundbausteine. Fast jedes Struktogramm besteht zum größten Teil aus Sequenzen.

## Die Reihenfolge zählt

Beim Tee kochen merkst du sofort, wenn die Reihenfolge falsch ist. Bei Rechnungen ist es genauso, nur fällt es weniger auf.

::: diagramm l04-rechnen.visustruct
Erst verdoppeln, dann 1 addieren: Das Ergebnis ist 7. Tauschst du die beiden mittleren Kästen, kommt 8 heraus.
:::

Die Anweisung \`zahl = zahl * 2\` bedeutet: Nimm den Wert von \`zahl\`, rechne mal 2 und speichere das Ergebnis wieder in \`zahl\`. Was in \`zahl\` steht, hängt also davon ab, was vorher passiert ist.

::: angeberwissen
Struktogramme sind kein reiner Schulkram. Laut Shneiderman haben auch Firmen wie IBM und Siemens damit ihre Programme geplant. Du lernst hier also Profi-Zeug. Määäh-ga!
:::

## Übung: Reihenfolge ordnen

::: übung l04-reihenfolge
titel: Reihenfolge ordnen
auftrag: Im Startdiagramm stehen die richtigen Kästen, aber in der falschen Reihenfolge. Verschiebe sie so, dass am Ende **20** ausgegeben wird.
start: l04-reihenfolge-start.visustruct
test: - -> 20
braucht: anweisung
tipp: Lies jeden Kasten und frage dich: Welche Variable braucht er, und wo bekommt diese Variable ihren Wert?
tipp: Eine Variable muss zuerst angelegt werden, bevor du mit ihr rechnest. Die Ausgabe kommt ganz zum Schluss. Rechne im Kopf nach: (2 + 3) · 4 = 20.
lösung: l04-reihenfolge-loesung.visustruct
:::

## Zwei Werte tauschen

Stell dir zwei Gläser vor: eins mit Saft, eins mit Wasser. Willst du die Inhalte tauschen, brauchst du ein drittes, leeres Glas.

Mit Variablen ist es genauso. Schreibst du einfach \`a = b\` und danach \`b = a\`, ist der alte Wert von \`a\` schon verloren. Am Ende haben beide Variablen denselben Wert.

Die Lösung ist eine **Hilfsvariable**, die den alten Wert kurz aufbewahrt:

::: grafik l05-tauschen.svg
Drei Schritte mit einem leeren Glas: erst Saft in hilf, dann Wasser nach links, dann den Saft aus hilf nach rechts.
:::

::: diagramm l04-tauschen.visustruct
Zuerst wird a in hilf gemerkt. Dann bekommt a den Wert von b, und b bekommt den gemerkten Wert aus hilf.
:::

## Übung: Gläser tauschen

::: übung l04-glaeser-tauschen
titel: Gläser tauschen
auftrag: Im linken Glas ist Saft, im rechten Wasser. Tausche die Inhalte der Variablen \`links\` und \`rechts\`, bevor sie ausgegeben werden.
Ändere dazu nicht die ersten beiden Kästen, sondern füge dazwischen neue Anweisungen ein.
start: l04-tauschen-start.visustruct
test: - -> Links: Wasser | Rechts: Saft
braucht: anweisung
tipp: Wie tauschst du zwei volle Gläser im echten Leben? Du brauchst ein drittes, leeres Glas.
tipp: Lege mit \`String hilf = links\` eine Hilfsvariable an. Danach brauchst du noch zwei Zuweisungen.
lösung: l04-tauschen-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich weiß, dass eine Sequenz von oben nach unten ausgeführt wird. → Schritt für Schritt
- Ich kann erklären, warum die Reihenfolge der Schritte wichtig ist. → Die Reihenfolge zählt
- Ich kann zwei Werte mit einer Hilfsvariablen tauschen. → Zwei Werte tauschen
:::

## Wissenstest

::: quiz
? Wie oft wird jeder Kasten einer Sequenz ausgeführt?
- [ ] So oft, bis eine Bedingung falsch ist
- [x] Genau einmal
- [ ] Gar nicht, wenn er leer ist
> In einer Sequenz wird nichts wiederholt und nichts übersprungen. Für Wiederholungen gibt es Schleifen.

? Am Anfang ist a = 5 und b = 9. Danach wird \`a = b\` und dann \`b = a\` ausgeführt. Was steht am Ende in den Variablen?
- [ ] a = 9 und b = 5
- [x] a = 9 und b = 9
- [ ] a = 5 und b = 5
> Nach \`a = b\` ist der alte Wert 5 verloren. \`b = a\` kopiert dann nur die 9 zurück.

? Wozu brauchst du beim Tauschen eine Hilfsvariable?
- [x] Damit ein Wert nicht überschrieben wird, bevor er gebraucht wird
- [ ] Damit das Struktogramm länger wird
- [ ] Weil man Variablen sonst nicht ausgeben kann

? Was gibt die Sequenz \`int x = 4\`, \`x = x + 1\`, \`x = x * 3\`, \`output: x\` aus?
- [ ] 13
- [x] 15
- [ ] 4
> Erst wird x zu 5, dann zu 15.
:::
`,ar=`---
titel: Eingabe und Ausgabe
bereich: Grundlagen
kurz: Werte abfragen, Ergebnisse anzeigen und das EVA-Prinzip anwenden.
---

## Das EVA-Prinzip

Viele Programme arbeiten in drei Teilen:

1. **Eingabe:** Das Programm fragt Werte ab, z. B. zwei Zahlen.
2. **Verarbeitung:** Es rechnet mit den Werten.
3. **Ausgabe:** Es zeigt das Ergebnis an.

Die Anfangsbuchstaben ergeben **EVA**. Bisher standen die Werte fest im Struktogramm. Mit einer Eingabe kann bei jedem Durchlauf ein anderer Wert verwendet werden.

::: diagramm l06-eva.visustruct
Oben die Eingabe, in der Mitte die Verarbeitung, unten die Ausgabe. Starte die Simulation und probiere verschiedene Zahlen aus.
:::

## Eingabe mit input:

Eine Eingabe fragt beim Ausführen einen Wert ab und speichert ihn in einer Variablen. Du schreibst den **Datentyp**, den **Namen** und eine **Frage** in Anführungszeichen:

\`\`\`
input: int alter "Wie alt bist du?"
input: double preis "Preis in Euro?"
input: String name "Wie heißt du?"
\`\`\`

Im Editor wählst du bei einer Anweisung oben die Art **Eingabe**. Das Wort \`input:\` steht dann schon davor, und du tippst nur noch \`int alter "Wie alt bist du?"\`.

> Der Datentyp entscheidet, was eingegeben werden darf. Bei \`int\` meldet die Simulation einen Fehler, wenn jemand 2.5 oder Hallo eintippt.

## Ausgabe mit output:

Eine Ausgabe zeigt Text und Werte an. Text steht in Anführungszeichen, Variablen ohne. Mit \`+\` hängst du die Teile **aneinander**:

\`\`\`
output: "Hallo " + name + "!"
output: "Du bist " + alter + " Jahre alt."
\`\`\`

Achte auf die Leerzeichen innerhalb der Anführungszeichen. Ohne sie klebt alles zusammen, und du siehst \`HalloMia!\` statt \`Hallo Mia!\`.

## Übung: Begrüßung

::: übung l06-begruessung
titel: Begrüßung
auftrag: Frage nach dem Namen und begrüße die Person. Bei der Eingabe Ada soll **Hallo Ada!** ausgegeben werden.
test: Ada -> Hallo Ada!
test: Ben -> Hallo Ben!
braucht: anweisung
tipp: Zuerst kommt eine Eingabe für den Namen, danach eine Ausgabe, die den Namen benutzt.
tipp: Der Name ist Text, die Eingabe braucht also den Typ \`String\`. In der Ausgabe verbindest du \`"Hallo "\`, die Variable und \`"!"\` mit \`+\`.
lösung: l06-begruessung-loesung.visustruct
:::

## Vorsicht mit + in der Ausgabe

In einer Ausgabe hängt \`+\` die Teile **immer** aneinander, auch bei Zahlen. Sind \`a\` gleich 3 und \`b\` gleich 4, dann zeigt

\`\`\`
output: a + b
\`\`\`

nicht 7, sondern **34**. Rechne deshalb vorher in einer Variablen und gib dann die Variable aus:

\`\`\`
int summe = a + b
output: "Summe: " + summe
\`\`\`

Das passt auch zum EVA-Prinzip: Gerechnet wird in der Verarbeitung, nicht in der Ausgabe.

## Vom Aufgabentext zum Struktogramm

Bevor du den ersten Kasten ziehst, liest du die Aufgabe genau und zerlegst sie. Das nennt man **Problemanalyse**. Drei Fragen helfen dir dabei:

1. **Was ist gegeben?** Diese Werte werden zur **Eingabe**. Überlege auch den Datentyp.
2. **Was ist gesucht?** Das wird zur **Ausgabe**.
3. **Wie kommt man vom Gegebenen zum Gesuchten?** Das ist die **Verarbeitung**, oft eine Formel.

Ein Beispiel: *Eine Kinokarte kostet 9 €. Das Programm fragt, wie viele Karten jemand kauft, und zeigt den Gesamtpreis an.*

- Gegeben: die Anzahl der Karten → \`input: int anzahl "Wie viele Karten?"\`
- Gesucht: der Gesamtpreis → \`output: "Gesamtpreis: " + gesamt\`
- Weg: Anzahl mal 9 → \`int gesamt = anzahl * 9\`

Jetzt musst du die drei Teile nur noch in der Reihenfolge E, V, A untereinander setzen.

> Achte im Aufgabentext auf Signalwörter: *fragt*, *liest ein* oder *gibt ein* deuten auf eine Eingabe. *Zeigt*, *gibt aus* oder *meldet* deuten auf eine Ausgabe.

## Übung: Rechner

::: übung l06-rechner
titel: Summe und Produkt
auftrag: Frage zwei ganze Zahlen ab. Gib danach ihre Summe und ihr Produkt aus, jeweils in einer eigenen Zeile.
Bei 3 und 4 sieht das so aus: \`Summe: 7\` und \`Produkt: 12\`.
test: 3, 4 -> Summe: 7 | Produkt: 12
test: 10, -2 -> Summe: 8 | Produkt: -20
test: 0, 5 -> Summe: 5 | Produkt: 0
braucht: anweisung
tipp: Plane die Reihenfolge: erst beide Zahlen einlesen, dann rechnen, dann ausgeben.
tipp: Du brauchst zwei Eingaben, zwei Anweisungen zum Rechnen und zwei Ausgaben. Rechne die Summe in einer eigenen Variablen, sonst hängt \`+\` die Zahlen aneinander.
lösung: l06-rechner-loesung.visustruct
:::

## Übung: Mittelwert

::: übung l06-mittelwert
titel: Mittelwert
auftrag: Frage zwei Zahlen ab, die auch Kommazahlen sein dürfen. Gib ihren Mittelwert aus, bei 2 und 3 also \`Mittelwert: 2.5\`.
test: 2, 3 -> Mittelwert: 2.5
test: 4, 6 -> Mittelwert: 5.0
test: 1.5, 2 -> Mittelwert: 1.75
braucht: anweisung
tipp: Den Mittelwert zweier Zahlen bekommst du, wenn du sie addierst und das Ergebnis halbierst.
tipp: Für Kommazahlen nimmst du den Typ \`double\`. Der Mittelwert ist die Summe geteilt durch 2. Denk an die Klammern: \`(x + y) / 2\`.
lösung: l06-mittelwert-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann das EVA-Prinzip erklären. → Das EVA-Prinzip
- Ich kann eine Eingabe mit Datentyp, Namen und Frage schreiben. → Eingabe mit input:
- Ich kann Text und Variablen in einer Ausgabe mit + verbinden. → Vorsicht mit + in der Ausgabe
- Ich rechne vor der Ausgabe in einer Variablen. → Vorsicht mit + in der Ausgabe
- Ich kann aus einem Aufgabentext Eingabe, Verarbeitung und Ausgabe herauslesen. → Vom Aufgabentext zum Struktogramm
:::

## Wissenstest

::: quiz
? Wofür steht EVA?
- [x] Eingabe, Verarbeitung, Ausgabe
- [ ] Eingabe, Variable, Anweisung
- [ ] Erst Variablen anlegen
> Viele Programme fragen erst Werte ab, verarbeiten sie und zeigen dann das Ergebnis.

? Die Variablen a und b haben die Werte 3 und 4. Was zeigt \`output: a + b\`?
- [ ] 7
- [x] 34
- [ ] a + b
> In der Ausgabe hängt + die Teile aneinander. Rechne die Summe vorher in einer Variablen aus.

? Welche Eingabe passt, wenn ein Preis wie 4.99 eingegeben werden soll?
- [ ] input: int preis "Preis?"
- [x] input: double preis "Preis?"
- [ ] input: String "Preis?"
> 4.99 ist eine Kommazahl, also double. Außerdem braucht jede Eingabe einen Variablennamen.

? Was zeigt \`output: "Alter: " + alter\`, wenn alter den Wert 12 hat?
- [x] Alter: 12
- [ ] "Alter: " + 12
- [ ] Alter: alter

? Aufgabe: *Das Programm fragt nach dem Radius eines Kreises und zeigt seinen Umfang an.* Ordne jedem Teil des Textes zu, wohin er im EVA-Prinzip gehört.
= fragt nach dem Radius -> Eingabe
= Umfang = 2 * 3.14 * Radius -> Verarbeitung
= zeigt seinen Umfang an -> Ausgabe
> Gegeben ist der Radius, gesucht der Umfang. Die Formel verbindet beides.
:::
`,lr=`---
titel: Simulation und Schreibtischtest
bereich: Grundlagen
kurz: Ein Struktogramm Schritt für Schritt ausführen, von Hand nachrechnen und Fehler finden.
---

## Die Simulation starten

Bevor es mit Verzweigungen und Schleifen weitergeht, lernst du dein wichtigstes Werkzeug kennen. Mit der Simulation prüfst du ab jetzt jede Übung selbst.

Mit [▶︎ Simulation](#zeige-simulation) in der Leiste führt VisuStruct dein Struktogramm aus. Solange die Simulation läuft, kannst du das Diagramm nicht bearbeiten. Mit **✎ Diagramm** an derselben Stelle kehrst du zum Bearbeiten zurück.

Rechts erscheint die **Steuerung**:

- **Start** führt das Diagramm automatisch Schritt für Schritt aus. Wie lange zwischen zwei Schritten gewartet wird, stellst du bei **Pause pro Schritt** ein.
- **Pause** hält an. Danach geht es mit Start oder Schritt weiter.
- **Schritt** führt genau einen Schritt aus. So kannst du in Ruhe zuschauen.
- **Stopp** bricht ab und setzt alles auf den Anfang zurück.

Öffne das folgende Diagramm im Editor und gehe es mit **Schritt** durch:

::: diagramm sim-tausch.visustruct
Die Werte von a und b werden vertauscht. Die Variable hilf merkt sich dabei einen Wert.
:::

## Was die Simulation anzeigt

- **Markierung:** Ein Kasten im Diagramm ist farbig hervorgehoben. Bei **Letzter Schritt** ist es der Kasten, der gerade ausgeführt wurde. Bei **Nächster Schritt** ist es der Kasten, der als Nächstes drankommt.
- **Eingabe:** Fragt das Diagramm nach einem Wert, tippst du ihn hier ein und bestätigst mit **OK**.
- **Letzter Schritt:** Hier steht, was gerade passiert ist, z. B. \`a = 5 -> 5\` nach dem Kasten \`a = b\`. Links sind die Variablen schon durch ihre Werte ersetzt, rechts vom Pfeil steht das Ergebnis.
- **Variablen:** Alle Variablen mit ihren aktuellen Werten.
- **Ausgabe:** Alles, was mit \`output:\` ausgegeben wurde.

Am Ende erscheint **Simulation beendet**. Geht etwas schief, bleibt die Simulation auf dem fehlerhaften Kasten stehen und zeigt eine Meldung, z. B. **Unbekannte Variable: gesamt**.

## Der Schreibtischtest

Beim **Schreibtischtest** spielst du selbst den Computer. Du gehst das Struktogramm mit Stift und Papier durch und schreibst nach jedem Schritt die Werte der Variablen auf. Am besten machst du eine Tabelle: eine Spalte für den Schritt, eine für jede Variable und eine für die Ausgabe.

Für das Diagramm oben sieht die Tabelle so aus:

| Schritt | a | b | hilf | Ausgabe |
|---|---|---|---|---|
| \`int a = 3\` | 3 | – | – | |
| \`int b = 5\` | 3 | 5 | – | |
| \`int hilf = a\` | 3 | 5 | 3 | |
| \`a = b\` | 5 | 5 | 3 | |
| \`b = hilf\` | 5 | 3 | 3 | |
| \`output: "a = " + a\` | 5 | 3 | 3 | a = 5 |
| \`output: "b = " + b\` | 5 | 3 | 3 | b = 3 |

Vergleiche danach deine Tabelle mit der Simulation. Stimmen die Werte unter **Variablen** nach jedem Schritt mit deiner Zeile überein?

> Der Schreibtischtest lohnt sich besonders in Prüfungen. Dort hast du keinen Computer, aber du kannst trotzdem zeigen, was dein Struktogramm tut.

## Fehler finden

Gibt ein Struktogramm etwas Falsches aus, gehst du so vor:

1. **Erwartung aufschreiben:** Was soll bei einer bestimmten Eingabe herauskommen?
2. **Schritt für Schritt ausführen:** Starte die Simulation mit **Schritt** und beobachte die Variablen.
3. **Die Stelle finden:** Wo weicht ein Wert zum ersten Mal von deiner Erwartung ab? Genau dort steckt der Fehler.

Häufige Fehler in einer Sequenz sind:

- Die **Reihenfolge** stimmt nicht: Eine Variable wird benutzt, bevor sie einen Wert hat.
- Ein Wert wird **überschrieben**, bevor er gebraucht wird.
- **Klammern** fehlen: \`a + b / 2\` ist etwas anderes als \`(a + b) / 2\`.
- Zwei ganze Zahlen werden geteilt: \`7 / 2\` ergibt \`3\`, weil bei \`int\` die Nachkommastellen wegfallen.

> Später kommen Verzweigungen und Schleifen dazu. Dann zeigt dir die Simulation auch, welcher Weg genommen wird und wie oft eine Schleife läuft.

## Übung: Tauschen reparieren

::: übung sim-tausch
titel: Tauschen reparieren
auftrag: Das Struktogramm soll zwei Zahlen einlesen und sie vertauscht wieder ausgeben. Bei 3 und 5 soll also erst **5** und dann **3** erscheinen. Es gibt aber zweimal 5 aus.
  Mache einen Schreibtischtest oder nutze **Schritt** und repariere den Fehler.
start: sim-tausch-start.visustruct
test: 3, 5 -> 5 | 3
test: 1, 2 -> 2 | 1
test: 7, 7 -> 7 | 7
braucht: anweisung
tipp: Gehe das Diagramm mit **Schritt** durch und schreibe nach jedem Schritt die Werte von a und b auf. Wo verschwindet die 3?
tipp: Schau dir a nach dem Schritt \`a = b\` an. Wo ist der alte Wert von a geblieben? Merke ihn dir vorher in einer Hilfsvariablen, wie im Beispiel oben.
lösung: sim-tausch-loesung.visustruct
:::

## Übung: Kinokarten reparieren

::: übung sim-kino
titel: Kinokarten reparieren
auftrag: Eine Kinokarte kostet 8.50 €. Das Struktogramm soll nach der Anzahl fragen und den Gesamtpreis ausgeben, bei 2 Karten also \`Gesamt: 17.0\`.
  Starte die Simulation. Sie bleibt mit einer Fehlermeldung stehen. Finde heraus, warum, und repariere das Struktogramm.
start: sim-kino-start.visustruct
test: 2 -> Gesamt: 17.0
test: 3 -> Gesamt: 25.5
test: 0 -> Gesamt: 0.0
braucht: anweisung
tipp: Lies die Fehlermeldung der Simulation genau. Welche Variable kennt sie noch nicht?
tipp: Die Simulation führt die Kästen von oben nach unten aus. Hat gesamt schon einen Wert, wenn die Ausgabe drankommt? Du kannst Kästen mit der Maus verschieben.
lösung: sim-kino-loesung.visustruct
:::

> Läuft eine Simulation endlos weiter, klicke auf **Stopp**. Beim **Prüfen** einer Übung bricht VisuStruct nach sehr vielen Schritten von selbst ab.

## Checkliste

::: checkliste
- Ich kann die Simulation starten, anhalten, einzelne Schritte ausführen und stoppen. → Die Simulation starten
- Ich kann während der Simulation Variablen, Ausgabe und den letzten Schritt ablesen. → Was die Simulation anzeigt
- Ich kann einen Schreibtischtest als Tabelle von Hand durchführen. → Der Schreibtischtest
- Ich kann einen Fehler finden, indem ich die Werte mit meiner Erwartung vergleiche. → Fehler finden
:::

## Wissenstest

::: quiz
? Mit welchem Knopf führst du genau einen Schritt aus?
- [ ] Start
- [x] Schritt
- [ ] Stopp
> Start läuft automatisch weiter, Schritt führt nur einen Schritt aus.

? Was schreibst du beim Schreibtischtest nach jedem Schritt auf?
- [ ] Nur die Ausgabe am Ende
- [x] Die aktuellen Werte aller Variablen
- [ ] Den erzeugten Java-Code
> So siehst du genau, an welcher Stelle ein Wert anders ist als erwartet.

? Erst \`int a = 3\`, dann \`int b = 5\`, dann \`a = b\`. Welche Werte haben a und b danach?
- [ ] a = 5 und b = 3
- [x] a = 5 und b = 5
- [ ] a = 3 und b = 5
> Der alte Wert von a ist überschrieben. Darum braucht man beim Tauschen eine Hilfsvariable.

? Im Feld Letzter Schritt steht \`preis = 4 * 2.5 -> 10.0\`. Was bedeutet das?
- [ ] Die Variable preis hat jetzt den Wert 4.
- [x] 4 * 2.5 wurde ausgerechnet und das Ergebnis 10.0 in preis gespeichert.
- [ ] Die Simulation hat einen Fehler gefunden.

? Die Simulation meldet **Unbekannte Variable: summe**. Was ist ein wahrscheinlicher Grund?
- [x] summe wird benutzt, bevor sie einen Wert bekommen hat.
- [ ] summe ist zu groß.
- [ ] Das Struktogramm hat zu viele Kästen.
:::
`,or=`---
titel: Verzweigung
bereich: Grundlagen
kurz: Mit einer Bedingung entscheiden, welcher von zwei Wegen ausgeführt wird.
---

## Wenn, dann, sonst

Bisher wurden alle Kästen immer ausgeführt. Oft soll ein Programm aber **entscheiden**: Wenn eine Bedingung erfüllt ist, tue das eine, sonst das andere.

Dafür gibt es die **Verzweigung**. Oben im Dreieck steht die Bedingung. Darunter teilt sich das Struktogramm in zwei Zweige:

- **true** (links): wird ausgeführt, wenn die Bedingung wahr ist
- **false** (rechts): wird ausgeführt, wenn die Bedingung falsch ist

Es wird immer **genau einer** der beiden Zweige ausgeführt. Danach geht es unter der Verzweigung weiter.

::: diagramm l07-alter-pruefen.visustruct
Je nach eingegebenem Alter erscheint die eine oder die andere Meldung. Probiere in der Simulation 17 und 18 aus.
:::

## Eine Verzweigung einfügen

Ziehe die **Verzweigung** aus dem Bereich Elemente ins Struktogramm. Klicke das Dreieck an und schreibe im Objektinspektor die Bedingung, z. B. \`alter >= 18\`. Das Wort \`if\` steht schon davor.

In jedem Zweig liegt zuerst ein Platzhalter ø. Ziehe dort Anweisungen hinein. In einem Zweig dürfen auch mehrere Kästen untereinander stehen.

## Vergleichsoperatoren

Eine Bedingung ist meistens ein **Vergleich**. Sein Ergebnis ist immer \`true\` oder \`false\`.

- \`==\` gleich, z. B. \`zahl == 0\`
- \`!=\` ungleich, z. B. \`antwort != 42\`
- \`<\` kleiner, \`<=\` kleiner oder gleich
- \`>\` größer, \`>=\` größer oder gleich

> Verwechsle \`==\` nicht mit \`=\`. Ein einzelnes \`=\` ist eine Zuweisung und speichert einen Wert. Zum Vergleichen brauchst du zwei Gleichheitszeichen.

Mit \`%\` prüfst du, ob eine Zahl durch eine andere teilbar ist: \`zahl % 2 == 0\` ist wahr, wenn \`zahl\` gerade ist.

## Übung: Gerade oder ungerade

::: übung l07-gerade
titel: Gerade oder ungerade
auftrag: Frage eine ganze Zahl ab. Gib **gerade** aus, wenn sie gerade ist, und sonst **ungerade**.
test: 4 -> gerade
test: 7 -> ungerade
test: 0 -> gerade
braucht: verzweigung
tipp: Hier gibt es zwei Möglichkeiten, also brauchst du eine Verzweigung. Woran erkennst du eine gerade Zahl?
tipp: Eine Zahl ist gerade, wenn beim Teilen durch 2 kein Rest bleibt. Die Bedingung lautet \`zahl % 2 == 0\`.
lösung: l07-gerade-loesung.visustruct
:::

## Übung: Die größere Zahl

::: übung l07-maximum
titel: Die größere Zahl
auftrag: Frage zwei ganze Zahlen ab und gib nur die größere von beiden aus. Sind beide gleich, gib diese Zahl aus.
test: 3, 8 -> 8
test: 9, 2 -> 9
test: 5, 5 -> 5
braucht: verzweigung
tipp: Eine Verzweigung vergleicht die beiden Zahlen. In jedem Zweig steht genau eine Ausgabe.
tipp: Vergleiche mit \`a > b\`. Im true-Zweig gibst du \`a\` aus, im false-Zweig \`b\`.
lösung: l07-maximum-loesung.visustruct
:::

## Ein leerer Zweig

Manchmal soll nur dann etwas passieren, wenn die Bedingung wahr ist, und sonst gar nichts. Dann bleibt der false-Zweig **leer**. Im Struktogramm steht dort der Platzhalter **ø**.

::: diagramm l07-rabatt.visustruct
Ab 50 Euro gibt es 5 Euro Rabatt. Sonst passiert nichts, der false-Zweig ist leer. Die Ausgabe darunter wird in beiden Fällen ausgeführt.
:::

## Übung: Betrag

::: übung l07-betrag
titel: Betrag einer Zahl
auftrag: Frage eine ganze Zahl ab. Ist sie negativ, mache sie positiv. Gib danach die Zahl aus. Aus -5 wird also 5, und 7 bleibt 7.
Nutze eine Verzweigung mit einem leeren Zweig und nur **einer** Ausgabe unter der Verzweigung.
test: -5 -> 5
test: 7 -> 7
test: 0 -> 0
test: -12 -> 12
braucht: verzweigung
tipp: Nur negative Zahlen müssen verändert werden. Was passiert mit einer Zahl, wenn du sie mal -1 nimmst?
tipp: Die Bedingung ist \`zahl < 0\`. Im true-Zweig drehst du das Vorzeichen um, z. B. mit \`zahl = 0 - zahl\`. Der false-Zweig bleibt leer.
lösung: l07-betrag-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich weiß, dass bei einer Verzweigung genau ein Zweig ausgeführt wird. → Wenn, dann, sonst
- Ich kenne die Vergleichsoperatoren == != < <= > >=. → Vergleichsoperatoren
- Ich kann == und = unterscheiden. → Vergleichsoperatoren
- Ich kann eine Verzweigung mit einem leeren Zweig bauen. → Ein leerer Zweig
:::

## Wissenstest

::: quiz
? Welcher Zweig wird ausgeführt, wenn die Bedingung falsch ist?
- [ ] Der true-Zweig
- [x] Der false-Zweig
- [ ] Beide Zweige
- [ ] Keiner, das Programm endet
> Bei false wird der rechte Zweig ausgeführt. Danach geht es unter der Verzweigung weiter.

? Mit welcher Bedingung prüfst du, ob alter genau 18 ist?
- [ ] alter = 18
- [x] alter == 18
- [ ] alter >= 18
> Ein einzelnes = ist eine Zuweisung. Zum Vergleichen brauchst du ==.

? Was bedeutet ø in einem Zweig?
- [x] In diesem Fall passiert nichts.
- [ ] Das Programm endet hier.
- [ ] Die Bedingung ist falsch.

? Die Bedingung lautet \`punkte >= 50\`. Bei welchem Wert ist sie wahr?
- [ ] 49
- [x] 50
- [ ] 0
> >= heißt größer oder gleich. 50 gehört also dazu.

? In Schulbüchern hat die Verzweigung oft noch einen anderen Namen. Welchen?
- [ ] Mehrfachauswahl
- [x] Bedingte Anweisung
- [ ] Wiederholungsstruktur
> Die Anweisungen in einem Zweig werden nur unter einer Bedingung ausgeführt. Darum heißt sie auch bedingte Anweisung.
:::
`,ur=`---
titel: Bedingungen verknüpfen
bereich: Grundlagen
kurz: Mehrere Bedingungen mit und, oder und nicht verbinden und Wertebereiche prüfen.
---

## Und: &&

Manchmal reicht ein einzelner Vergleich nicht. Ein Jugendticket gibt es zum Beispiel nur, wenn jemand **mindestens 12 und jünger als 18** ist.

Mit \`&&\` (und) verbindest du zwei Bedingungen. Das Ergebnis ist nur dann \`true\`, wenn **beide** Bedingungen wahr sind.

::: diagramm l08-jugendticket.visustruct
Beide Vergleiche müssen stimmen. Probiere in der Simulation 11, 12, 17 und 18 aus.
:::

## Oder: ||

Mit \`||\` (oder) ist das Ergebnis \`true\`, wenn **mindestens eine** der Bedingungen wahr ist. Es dürfen auch beide wahr sein.

\`\`\`
tag == 6 || tag == 7
\`\`\`

Diese Bedingung ist wahr, wenn \`tag\` den Wert 6 oder den Wert 7 hat, also am Samstag oder Sonntag.

> Die beiden senkrechten Striche \`|\` tippst du auf vielen Tastaturen mit AltGr und der Taste \`<\`, am Mac mit Option und 7.

## Übung: Wochenende

::: übung l08-wochenende
titel: Wochenende
auftrag: Frage einen Wochentag als Zahl ab (1 ist Montag, 7 ist Sonntag). Gib **Wochenende** aus, wenn es Samstag oder Sonntag ist, sonst **Werktag**.
test: 6 -> Wochenende
test: 7 -> Wochenende
test: 1 -> Werktag
test: 5 -> Werktag
braucht: verzweigung
tipp: Wochenende ist, wenn der Tag 6 **oder** 7 ist. Dafür brauchst du zwei Vergleiche in einer Bedingung.
tipp: Samstag ist 6, Sonntag ist 7. Verbinde die beiden Vergleiche mit \`||\`.
lösung: l08-wochenende-loesung.visustruct
:::

## Wertebereiche prüfen

Schulnoten gehen von 1 bis 6. Ob eine Note **im Bereich** liegt, prüfst du mit zwei Vergleichen und \`&&\`:

\`\`\`
note >= 1 && note <= 6
\`\`\`

::: grafik l08-zahlenstrahl.svg
Gültig ist der grüne Bereich von 1 bis 6, beide Ränder gehören dazu.
:::

Umgekehrt ist eine Note **außerhalb** des Bereichs, wenn sie zu klein **oder** zu groß ist:

::: diagramm l08-note.visustruct
Eine Note kleiner als 1 oder größer als 6 gibt es nicht.
:::

> Die Schreibweise aus Mathe \`1 <= note <= 6\` funktioniert nicht. Du musst sie in zwei Vergleiche aufteilen und mit \`&&\` verbinden.

## Übung: Gültige Note

::: übung l08-note-gueltig
titel: Gültige Note
auftrag: Frage eine Note als ganze Zahl ab. Gib **gültig** aus, wenn sie zwischen 1 und 6 liegt (1 und 6 gehören dazu), sonst **ungültig**.
test: 1 -> gültig
test: 6 -> gültig
test: 3 -> gültig
test: 0 -> ungültig
test: 7 -> ungültig
braucht: verzweigung
tipp: Eine gültige Note muss zwei Dinge gleichzeitig erfüllen: nicht zu klein **und** nicht zu groß.
tipp: Die Note muss größer oder gleich 1 und gleichzeitig kleiner oder gleich 6 sein.
lösung: l08-gueltig-loesung.visustruct
:::

## Nicht und Klammern

Mit \`!\` (nicht) drehst du eine Bedingung um: Aus \`true\` wird \`false\` und umgekehrt.

\`\`\`
!(note >= 1 && note <= 6)
\`\`\`

Das ist wahr, wenn die Note **nicht** im Bereich liegt, und bedeutet dasselbe wie \`note < 1 || note > 6\`.

Kommen \`&&\` und \`||\` zusammen vor, wird \`&&\` zuerst ausgewertet, so wie Punkt vor Strich. Setze lieber **Klammern**, dann ist klar, was zusammengehört:

\`\`\`
(alter >= 12 && alter < 18) || schueler == 1
\`\`\`

## Übung: Schaltjahr

::: übung l08-schaltjahr
titel: Schaltjahr
auftrag: Ein Jahr ist ein Schaltjahr, wenn es durch 4 teilbar ist, aber nicht durch 100. Jahre, die durch 400 teilbar sind, sind trotzdem Schaltjahre.
Frage eine Jahreszahl ab und gib **Schaltjahr** oder **kein Schaltjahr** aus.
test: 2024 -> Schaltjahr
test: 2023 -> kein Schaltjahr
test: 1900 -> kein Schaltjahr
test: 2000 -> Schaltjahr
braucht: verzweigung
tipp: Prüfe die Regel zuerst an Beispielen: 2024 ist ein Schaltjahr, 1900 nicht, 2000 schon. Teilbar heißt: Der Rest ist 0.
tipp: Teilbar durch 4 heißt \`jahr % 4 == 0\`, nicht teilbar durch 100 heißt \`jahr % 100 != 0\`. Verbinde diese beiden mit \`&&\`, setze Klammern darum und hänge mit \`||\` den Fall für 400 an.
lösung: l08-schaltjahr-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich weiß, wann eine Verknüpfung mit && wahr ist. → Und: &&
- Ich weiß, wann eine Verknüpfung mit || wahr ist. → Oder: ||
- Ich kann eine Bedingung mit ! umdrehen. → Nicht und Klammern
- Ich kann prüfen, ob ein Wert in einem Bereich wie 1 bis 6 liegt. → Wertebereiche prüfen
:::

## Wissenstest

::: quiz
? Wann ist \`a && b\` wahr?
- [ ] Wenn a oder b wahr ist
- [x] Nur wenn a und b beide wahr sind
- [ ] Wenn genau eins von beiden wahr ist
> Bei && müssen beide Teile stimmen. Ist einer falsch, ist das Ganze falsch.

? Die Variable tag hat den Wert 6. Was ergibt \`tag == 6 || tag == 7\`?
- [x] true
- [ ] false
> Bei || reicht es, wenn eine Seite wahr ist.

? Mit welcher Bedingung prüfst du, ob zahl zwischen 10 und 20 liegt (beide eingeschlossen)?
- [ ] 10 <= zahl <= 20
- [ ] zahl >= 10 || zahl <= 20
- [x] zahl >= 10 && zahl <= 20
> Mit || wäre jede Zahl erlaubt, denn jede Zahl ist größer als 10 oder kleiner als 20.

? Was ergibt \`!(5 > 3)\`?
- [ ] true
- [x] false
> 5 > 3 ist wahr, und ! dreht das um.
:::
`,hr=`---
titel: Fallauswahl
bereich: Grundlagen
kurz: Je nach Wert einer Variablen einen von vielen Fällen ausführen.
---

## Viele Möglichkeiten, eine Variable

Ein Getränkeautomat hat drei Tasten: 1 für Wasser, 2 für Saft, 3 für Kakao. Mit Verzweigungen brauchst du dafür drei ineinander geschachtelte Kästen. Das wird schnell breit und unübersichtlich.

::: diagramm l09-verschachtelt.visustruct
Der Automat mit drei verschachtelten Verzweigungen. Jede Verzweigung prüft wieder dieselbe Variable wahl.
:::

Immer wenn du **eine Variable** mit **mehreren festen Werten** vergleichst, geht es einfacher: mit der **Fallauswahl**.

## So ist die Fallauswahl aufgebaut

Oben im Kasten steht die Variable, nach der ausgewählt wird. Darunter steht für jeden Fall eine eigene Spalte. Über jeder Spalte steht der Wert, zu dem sie gehört.

::: diagramm l09-automat.visustruct
Derselbe Automat als Fallauswahl. Hat wahl den Wert 2, wird nur die Spalte 2 ausgeführt.
:::

- Die Simulation sucht den Fall, dessen Name genau zum Wert passt.
- Passt kein Fall, wird **default** ausgeführt. Dieser Fall steht immer ganz rechts.
- Danach geht es unter der Fallauswahl weiter. Es wird immer nur **ein** Fall ausgeführt.

> Eine neue Fallauswahl hat die Fälle 1, 2 und default. Klicke einen Fall an, um im Objektinspektor seinen **Fallnamen** zu ändern. Mit **Weiteren Fall hinzufügen** bekommst du eine neue Spalte vor default.

## Fälle mit Texten

Die Fälle müssen keine Zahlen sein. Du kannst auch nach dem Inhalt einer \`String\`-Variablen auswählen. Als Fallname schreibst du dann den Text, zum Beispiel \`rot\`.

::: diagramm l09-ampel.visustruct
Eine Ampel: Je nach eingegebener Farbe erscheint ein anderer Hinweis. Probiere in der Simulation auch eine Farbe aus, die es nicht gibt.
:::

Groß- und Kleinschreibung zählt: \`Rot\` passt nicht zum Fall \`rot\`.

## Übung: Note in Worten

::: übung l09-note
titel: Note in Worten
auftrag: Frage eine Note als ganze Zahl ab und gib sie in Worten aus: 1 sehr gut, 2 gut, 3 befriedigend, 4 ausreichend, 5 mangelhaft, 6 ungenügend.
  Bei jeder anderen Zahl soll **Keine gültige Note** erscheinen.
test: 1 -> sehr gut
test: 4 -> ausreichend
test: 6 -> ungenügend
test: 9 -> Keine gültige Note
braucht: fallauswahl
tipp: Für viele feste Werte ist die Fallauswahl übersichtlicher als viele Verzweigungen. Jede Note bekommt ihren eigenen Fall.
tipp: Füge mit „Weiteren Fall hinzufügen“ so lange Fälle hinzu, bis du die Fälle 1 bis 6 und default hast. Oben in die Fallauswahl schreibst du \`note\`.
lösung: l09-note-loesung.visustruct
:::

## Übung: Taschenrechner

::: übung l09-rechner
titel: Taschenrechner
auftrag: Frage nacheinander eine ganze Zahl \`a\`, ein Rechenzeichen als \`String\` und eine zweite ganze Zahl \`b\` ab.
  Bei \`+\`, \`-\` und \`*\` gibst du das Ergebnis aus. Bei jedem anderen Zeichen erscheint **Unbekanntes Rechenzeichen**.
test: 3, +, 4 -> 7
test: 10, -, 4 -> 6
test: 6, *, 7 -> 42
test: 1, x, 2 -> Unbekanntes Rechenzeichen
braucht: fallauswahl
tipp: Lies erst alle drei Werte ein. Danach entscheidet eine Fallauswahl über das Rechenzeichen, was gerechnet wird.
tipp: Lege vor der Fallauswahl \`int ergebnis = 0\` an. In jedem Fall rechnest du zum Beispiel \`ergebnis = a + b\` und gibst danach \`ergebnis\` aus. Die Fallnamen sind einfach \`+\`, \`-\` und \`*\`.
lösung: l09-rechner-loesung.visustruct
:::

## Fallauswahl oder Verzweigung?

Die Fallauswahl prüft nur, ob ein Wert **genau gleich** einem Fallnamen ist. Daraus folgt:

- **Fallauswahl:** eine Variable, mehrere feste Werte. Beispiele: Menüauswahl, Wochentag als Zahl, Noten.
- **Verzweigung:** Bereiche und verknüpfte Bedingungen. Beispiele: \`alter >= 18\`, \`temperatur < 0 || temperatur > 30\`.

Für „Alter ab 18“ brauchst du also weiter die Verzweigung. Du kannst nicht für jedes mögliche Alter einen eigenen Fall anlegen.

## Checkliste

::: checkliste
- Ich kann eine Fallauswahl einfügen, Fälle hinzufügen und Fallnamen ändern. → So ist die Fallauswahl aufgebaut
- Ich weiß, wann der Fall default ausgeführt wird. → So ist die Fallauswahl aufgebaut
- Ich kann entscheiden, ob eine Fallauswahl oder eine Verzweigung besser passt. → Fallauswahl oder Verzweigung?
:::

## Wissenstest

::: quiz
? Die Variable tag hat den Wert 5. Es gibt die Fälle 1, 2, 3 und default. Was wird ausgeführt?
- [ ] Gar nichts
- [ ] Der Fall 3
- [x] Der Fall default
> Kein Fallname passt zu 5, deshalb greift default.

? Wie viele Fälle werden bei einem Durchlauf der Fallauswahl ausgeführt?
- [x] Genau einer
- [ ] Alle Fälle ab dem passenden
- [ ] Alle Fälle
> Nach dem passenden Fall geht es direkt unter der Fallauswahl weiter.

? Wofür ist eine Fallauswahl NICHT geeignet?
- [ ] Menüpunkt 1, 2 oder 3 auswählen
- [x] Prüfen, ob eine Temperatur über 30 Grad liegt
- [ ] Eine Farbe wie rot, gelb oder grün auswerten
> „Über 30“ ist ein Bereich. Dafür brauchst du eine Verzweigung mit einem Vergleich.

? Du gibst bei der Ampel \`Rot\` ein, der Fall heißt \`rot\`. Was passiert?
- [ ] Der Fall rot wird ausgeführt.
- [x] Der Fall default wird ausgeführt.
- [ ] Die Simulation meldet einen Fehler.
> Groß- und Kleinschreibung zählt. Rot und rot sind verschiedene Texte.

? Unter welchem Namen findest du die Fallauswahl auch in Schulbüchern?
- [ ] Bedingte Anweisung
- [ ] Sequenz
- [x] Mehrfachauswahl
> Aus vielen Fällen wird einer ausgewählt. Darum heißt sie auch Mehrfachauswahl.
:::
`,mr=`---
titel: While-Schleife
bereich: Grundlagen
kurz: Schritte wiederholen, solange eine Bedingung wahr ist.
---

## Wiederholen, solange etwas gilt

Oft soll ein Programm etwas mehrmals tun. Statt denselben Kasten fünfmal hinzuschreiben, nimmst du eine **Schleife**.

Die **While-Schleife** wiederholt ihren Inhalt, **solange** ihre Bedingung wahr ist. Die Bedingung steht oben im Kopf des Kastens. Der Inhalt steht eingerückt darunter, links von einer Klammer eingefasst.

::: diagramm l10-countdown.visustruct
Ein Countdown: Solange zahl größer als 0 ist, wird zahl ausgegeben und um 1 kleiner. Danach erscheint Start!
:::

## Die Bedingung kommt zuerst

Die While-Schleife ist **kopfgesteuert**. Vor **jedem** Durchlauf wird die Bedingung geprüft:

1. Bedingung prüfen.
2. Ist sie wahr, den Inhalt einmal ausführen und wieder bei 1 anfangen.
3. Ist sie falsch, geht es unter der Schleife weiter.

::: grafik l10-kopfgesteuert.svg
Nach jedem Durchlauf geht es zurück zur Bedingung. Erst wenn sie false ist, geht es unter der Schleife weiter.
:::

Im Countdown wird die Bedingung viermal geprüft: bei 3, 2 und 1 ist sie wahr, bei 0 ist sie falsch.

> Ist die Bedingung schon beim ersten Prüfen falsch, wird der Inhalt **kein einziges Mal** ausgeführt. Starte den Countdown mit \`int zahl = 0\`, dann erscheint nur Start!

## Eine Zählvariable

Viele Schleifen zählen mit. Dafür brauchst du drei Dinge:

- **Startwert vor der Schleife**, z. B. \`int i = 1\`
- **Bedingung im Kopf**, z. B. \`i <= 5\`
- **Veränderung im Inhalt**, z. B. \`i = i + 1\` (kurz \`i++\`)

Fehlt einer dieser Teile, zählt die Schleife falsch oder gar nicht.

::: angeberwissen
Zählschleifen sind uralt! Im Artikel von 1973 haben Nassi und Shneiderman ihre Idee unter anderem an der **Fakultät** gezeigt: 5! = 1 · 2 · 3 · 4 · 5 = 120. Hier ist meine Ziegen-Version davon. Probier sie mit **Schritt** in der Simulation aus und schau zu, wie \`fakultaet\` wächst. Määäh, das geht schnell!
:::

::: diagramm l10-fakultaet.visustruct
Die Fakultät mit einer Zählvariable \`i\`, nachgebaut nach einem Beispiel aus dem Artikel von 1973.
:::

## Übung: Zählen bis n

::: übung l10-bis-n
titel: Zählen bis n
auftrag: Frage eine ganze Zahl \`n\` ab und gib alle Zahlen von 1 bis \`n\` aus, jede in einer eigenen Zeile.
test: 3 -> 1 | 2 | 3
test: 5 -> 1 | 2 | 3 | 4 | 5
test: 1 -> 1
braucht: whileSchleife
tipp: Du brauchst eine Zählvariable, die bei 1 beginnt und in jedem Durchlauf um 1 wächst.
tipp: Lege vor der Schleife \`int i = 1\` an. Die Bedingung ist \`i <= n\`. Im Inhalt gibst du \`i\` aus und erhöhst danach \`i\` um 1.
lösung: l10-bis-n-loesung.visustruct
:::

## Vorsicht, Endlosschleife

Wenn sich im Inhalt nichts an der Bedingung ändert, bleibt sie für immer wahr. Die Schleife hört nie auf. Das nennt man **Endlosschleife**.

::: diagramm l10-endlos.visustruct
Hier fehlt zahl = zahl - 1. Die Schleife gibt immer wieder 3 aus und erreicht Start! nie.
:::

Frage dich bei jeder Schleife: **Was im Inhalt sorgt dafür, dass die Bedingung irgendwann falsch wird?** Beim Prüfen einer Übung bricht VisuStruct nach sehr vielen Schritten ab und meldet eine mögliche Endlosschleife.

## Übung: Verdoppeln bis 100

::: übung l10-verdoppeln
titel: Verdoppeln bis 100
auftrag: Frage eine ganze Zahl ab. Verdopple sie so lange, bis sie mindestens 100 ist.
  Gib am Ende aus, **wie oft** du verdoppelt hast.
test: 10 -> 4
test: 30 -> 2
test: 1 -> 7
test: 100 -> 0
braucht: whileSchleife
tipp: Die Schleife läuft, solange die Zahl noch zu klein ist. Zähle nebenbei mit, wie oft sie gelaufen ist.
tipp: Du brauchst eine zweite Variable \`int schritte = 0\`. Die Bedingung lautet \`zahl < 100\`. Im Inhalt verdoppelst du die Zahl mit \`zahl = zahl * 2\` und erhöhst \`schritte\` um 1. Ist die Zahl schon 100, läuft die Schleife gar nicht.
lösung: l10-verdoppeln-loesung.visustruct
:::

## Schleifen im Schreibtischtest

Bei einer Schleife wird der **Schreibtischtest** besonders wertvoll. Du siehst genau, wie oft die Schleife läuft und mit welchem Wert sie aufhört. Jede Prüfung der Bedingung bekommt eine eigene Zeile.

::: diagramm l16-schreibtisch.visustruct
Eine While-Schleife zählt die Zahlen 1, 2 und 3 zusammen.
:::

| Schritt | summe | i | Ausgabe |
|---|---|---|---|
| \`int summe = 0\` | 0 | – | |
| \`int i = 1\` | 0 | 1 | |
| \`i <= 3\` → wahr | 0 | 1 | |
| \`summe = summe + i\` | 1 | 1 | |
| \`i = i + 1\` | 1 | 2 | |
| \`i <= 3\` → wahr | 1 | 2 | |
| \`summe = summe + i\` | 3 | 2 | |
| \`i = i + 1\` | 3 | 3 | |
| \`i <= 3\` → wahr | 3 | 3 | |
| \`summe = summe + i\` | 6 | 3 | |
| \`i = i + 1\` | 6 | 4 | |
| \`i <= 3\` → falsch | 6 | 4 | |
| \`output: summe\` | 6 | 4 | 6 |

Häufige Fehler in Schleifen sind:

- Die Schleife läuft **einmal zu oft oder zu wenig**, z. B. \`<\` statt \`<=\`.
- Eine Variable wird in der Schleife **nicht verändert** oder in die falsche Richtung. Dann endet die Schleife nie.
- Eine Variable bekommt ihren Startwert **in** der Schleife statt davor und wird bei jedem Durchlauf zurückgesetzt.

## Übung: Countdown reparieren

::: übung l16-countdown
titel: Countdown reparieren
auftrag: Der Countdown soll vom Startwert herunterzählen und am Ende **Los!** ausgeben. Bei 3 also 3, 2, 1, Los!
  Im Startdiagramm stecken zwei Fehler. Finde und behebe beide.
start: l16-countdown-start.visustruct
test: 3 -> 3 | 2 | 1 | Los!
test: 1 -> 1 | Los!
test: 0 -> Los!
tipp: Es gibt zwei Fehler. Einer betrifft das Zählen, der andere die Ausgabe am Ende.
tipp: Starte die Simulation mit Startwert 3 und beobachte i unter Variablen. Wird i kleiner? Vergleiche außerdem die letzte Ausgabe genau mit dem Auftrag.
lösung: l16-countdown-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich weiß, dass die While-Schleife ihre Bedingung vor jedem Durchlauf prüft. → Die Bedingung kommt zuerst
- Ich kann eine Zählvariable mit Startwert, Bedingung und Veränderung verwenden. → Eine Zählvariable
- Ich erkenne, wenn eine Schleife nie endet, und kann den Fehler beheben. → Vorsicht, Endlosschleife
- Ich kann eine Schleife im Schreibtischtest Durchlauf für Durchlauf verfolgen. → Schleifen im Schreibtischtest
:::

## Wissenstest

::: quiz
? Was bedeutet kopfgesteuert?
- [x] Die Bedingung wird vor jedem Durchlauf geprüft.
- [ ] Die Bedingung wird nach jedem Durchlauf geprüft.
- [ ] Die Schleife läuft immer genau einmal.
> Der Kopf mit der Bedingung steht oben und wird zuerst ausgewertet.

? \`int i = 5\`, danach eine While-Schleife mit der Bedingung \`i < 3\`. Wie oft läuft der Inhalt?
- [x] Keinmal
- [ ] Einmal
- [ ] Dreimal
> Schon beim ersten Prüfen ist 5 < 3 falsch.

? Warum endet eine Schleife mit der Bedingung \`zahl > 0\` nie, wenn im Inhalt nur \`output: zahl\` steht?
- [ ] Weil output die Zahl vergrößert
- [x] Weil sich zahl nie ändert und die Bedingung wahr bleibt
- [ ] Weil die Bedingung falsch geschrieben ist
> Im Inhalt muss etwas passieren, das die Bedingung irgendwann falsch macht.

? Wie nennt man Schleifen in Schulbüchern auch?
- [x] Wiederholungsstrukturen
- [ ] Verzweigungen
- [ ] Unterprogramme
> Eine Schleife wiederholt Anweisungen. Darum heißt sie auch Wiederholungsstruktur.

? Eine Schleife soll von 1 bis 5 zählen, läuft aber nur bis 4. Was ist der wahrscheinliche Fehler?
- [x] In der Bedingung steht i < 5 statt i <= 5.
- [ ] Die Schleife ist eine While-Schleife.
- [ ] Die Variable i heißt falsch.
:::
`,cr=`---
titel: Do-while-Schleife
bereich: Grundlagen
kurz: Erst ausführen, dann prüfen: Schleifen mit mindestens einem Durchlauf.
---

## Erst machen, dann prüfen

Die **Do-while-Schleife** ist **fußgesteuert**. Die Bedingung steht unten im Fuß des Kastens. Der Ablauf ist:

1. Den Inhalt einmal ausführen.
2. Die Bedingung prüfen.
3. Ist sie wahr, wieder bei 1 anfangen. Ist sie falsch, geht es unter der Schleife weiter.

::: grafik l11-vergleich.svg
Links prüft die While-Schleife zuerst, rechts führt die Do-while-Schleife zuerst aus.
:::

Oben im Kasten steht \`do\`, unten im Fuß die Bedingung. Wenn du die Schleife anklickst, steht im Objektinspektor vor dem Textfeld das Wort \`while\`: Die Bedingung bedeutet „wiederhole, solange …“.

> Die Bedingung sagt wie bei der While-Schleife, **wann wiederholt wird**. Solange sie wahr ist, läuft die Schleife weiter.

## Mindestens ein Durchlauf

Weil die Bedingung erst am Ende geprüft wird, läuft der Inhalt **immer mindestens einmal**. Das ist der wichtigste Unterschied zur While-Schleife.

::: diagramm l11-einmal.visustruct
i ist 10 und damit nicht kleiner als 5. Trotzdem wird 10 einmal ausgegeben, denn geprüft wird erst danach.
:::

Mit einer While-Schleife und derselben Bedingung \`i < 5\` würde hier gar nichts ausgegeben.

## Typisch: Eingabe wiederholen

Die Do-while-Schleife passt immer dann, wenn etwas zuerst passieren muss, bevor man es prüfen kann. Das beste Beispiel ist eine Eingabe: Erst wenn jemand etwas eingegeben hat, weißt du, ob es gültig ist.

::: diagramm l11-eingabe-pruefen.visustruct
Die Frage kommt so lange wieder, bis eine Zahl von 1 bis 10 eingegeben wurde. Probiere in der Simulation zuerst 0 und dann 12 aus.
:::

Die Bedingung beschreibt hier die **ungültige** Eingabe: \`zahl < 1 || zahl > 10\`. Solange die Eingabe ungültig ist, wird noch einmal gefragt.

## Übung: Gültige Note

::: übung l11-note
titel: Gültige Note
auftrag: Frage eine Note ab. Ist sie nicht zwischen 1 und 6, frage noch einmal. Ist sie gültig, gib sie aus, zum Beispiel **Deine Note: 3**.
test: 3 -> Deine Note: 3
test: 0, 7, 2 -> Deine Note: 2
test: 9, 6 -> Deine Note: 6
test: -1, 1 -> Deine Note: 1
braucht: doUntilSchleife
tipp: Die Note wird mindestens einmal abgefragt. Danach entscheidet die Bedingung, ob noch einmal gefragt wird.
tipp: Lege vor der Schleife \`int note = 0\` an. In die Schleife kommt die Eingabe \`input: note "Note von 1 bis 6"\`. Die Bedingung lautet \`note < 1 || note > 6\`.
lösung: l11-note-loesung.visustruct
:::

## Übung: Summe bis 0

::: übung l11-summe
titel: Summe bis 0
auftrag: Frage so lange Zahlen ab, bis eine 0 eingegeben wird. Gib danach die Summe aller eingegebenen Zahlen aus.
test: 3, 4, 0 -> 7
test: 10, 0 -> 10
test: 5, 5, 5, 0 -> 15
test: 0 -> 0
braucht: doUntilSchleife
tipp: Du brauchst eine Variable für die Summe, die vor der Schleife bei 0 beginnt. In jedem Durchlauf kommt die neue Zahl dazu.
tipp: Lege vor der Schleife \`int summe = 0\` und \`int zahl = 0\` an. In der Schleife fragst du \`zahl\` ab und rechnest \`summe = summe + zahl\`. Die 0 zu addieren schadet nicht. Die Schleife läuft weiter, solange \`zahl != 0\` ist.
lösung: l11-summe-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich weiß, dass die Do-while-Schleife ihre Bedingung erst nach dem Inhalt prüft. → Erst machen, dann prüfen
- Ich weiß, dass der Inhalt mindestens einmal ausgeführt wird. → Mindestens ein Durchlauf
- Ich kann eine Eingabe so lange wiederholen lassen, bis sie gültig ist. → Typisch: Eingabe wiederholen
:::

## Wissenstest

::: quiz
? Was bedeutet fußgesteuert?
- [ ] Die Bedingung wird vor jedem Durchlauf geprüft.
- [x] Die Bedingung wird nach jedem Durchlauf geprüft.
- [ ] Die Schleife hat keine Bedingung.
> Die Bedingung steht im Fuß, also unten, und wird nach dem Inhalt ausgewertet.

? Die Bedingung einer Do-while-Schleife ist von Anfang an falsch. Wie oft läuft der Inhalt?
- [ ] Keinmal
- [x] Genau einmal
- [ ] Endlos
> Der Inhalt läuft zuerst. Erst danach merkt die Schleife, dass sie aufhören soll.

? Du willst eine Zahl von 1 bis 10 abfragen. Welche Bedingung gehört in den Fuß?
- [ ] \`zahl >= 1 && zahl <= 10\`
- [x] \`zahl < 1 || zahl > 10\`
- [ ] \`zahl == 10\`
> Wiederholt wird, solange die Eingabe ungültig ist, also kleiner als 1 oder größer als 10.

? Wann ist eine Do-while-Schleife besser als eine While-Schleife?
- [x] Wenn der Inhalt auf jeden Fall einmal laufen muss, z. B. bei einer Eingabe
- [ ] Wenn die Schleife vielleicht gar nicht laufen soll
- [ ] Wenn man genau bis 10 zählen will
:::
`,dr=`---
titel: For-Schleife
bereich: Grundlagen
kurz: Mit Start, Bedingung und Schritt eine feste Anzahl von Durchläufen zählen.
---

## Zählen mit festem Plan

In der While-Schleife hast du schon mitgezählt: Startwert vor der Schleife, Bedingung im Kopf, Veränderung im Inhalt. Die **For-Schleife** schreibt diese drei Teile zusammen in den Kopf. So siehst du auf einen Blick, wie gezählt wird.

Wenn du eine For-Schleife anklickst, hat sie rechts drei Felder:

- **Start:** \`int i = 1\` legt die Zählvariable an.
- **Bedingung:** \`i <= 5\` sagt, wie lange gezählt wird.
- **Schritt:** \`i++\` erhöht \`i\` nach jedem Durchlauf um 1.

::: diagramm l12-eins-bis-fuenf.visustruct
Eine For-Schleife, die die Zahlen von 1 bis 5 ausgibt.
:::

## In welcher Reihenfolge?

Die drei Teile kommen zu unterschiedlichen Zeiten dran:

1. **Start** wird genau einmal ausgeführt, ganz am Anfang.
2. **Bedingung** wird vor jedem Durchlauf geprüft. Ist sie falsch, ist die Schleife fertig.
3. Nach dem Inhalt kommt der **Schritt**, dann wieder die Bedingung.

::: grafik l12-for-ablauf.svg
Der Start kommt nur einmal dran. Danach wiederholen sich Bedingung, Inhalt und Schritt.
:::

Die For-Schleife ist also kopfgesteuert wie die While-Schleife. Gehe das Beispiel in der Simulation mit **Schritt** durch und beobachte, wie sich \`i\` verändert.

> Nimm die For-Schleife, wenn du schon vorher weißt, wie oft etwas passieren soll. Hängt das Ende von etwas ab, das erst während der Schleife passiert, zum Beispiel einer Eingabe, ist die While- oder Do-while-Schleife besser.

## Beispiel: Summe von 1 bis n

Eine For-Schleife eignet sich gut, um Zahlen aufzusummieren. Vor der Schleife steht \`int summe = 0\`. In jedem Durchlauf kommt die aktuelle Zahl \`i\` dazu.

::: diagramm l12-summe.visustruct
Bei n = 4 rechnet die Schleife 0 + 1 + 2 + 3 + 4. Am Ende wird 10 ausgegeben.
:::

## Andere Schritte

Der Schritt muss nicht immer \`i++\` sein:

- \`i--\` zählt rückwärts, zum Beispiel mit Start \`int i = 10\` und Bedingung \`i >= 1\`.
- \`i = i + 2\` springt in Zweierschritten, zum Beispiel 0, 2, 4, 6.

Achte darauf, dass Start, Bedingung und Schritt zusammenpassen. Mit Start \`int i = 1\`, Bedingung \`i >= 1\` und Schritt \`i++\` wird die Bedingung nie falsch.

::: übung l12-countdown
titel: Countdown
auftrag: Frage eine ganze Zahl \`n\` ab. Zähle mit einer For-Schleife von \`n\` rückwärts bis 1 und gib jede Zahl aus. Gib danach **Los!** aus.
test: 3 -> 3 | 2 | 1 | Los!
test: 5 -> 5 | 4 | 3 | 2 | 1 | Los!
test: 1 -> 1 | Los!
braucht: forSchleife
tipp: Diesmal zählt die For-Schleife rückwärts. Überlege, wo sie beginnt, wann sie aufhört und wie sie zählt.
tipp: Start ist \`int i = n\`, die Bedingung \`i >= 1\` und der Schritt \`i--\`. Die Ausgabe Los! steht unter der Schleife, nicht darin.
lösung: l12-countdown-loesung.visustruct
:::

## Übung: Einmaleins

::: übung l12-einmaleins
titel: Einmaleins
auftrag: Frage eine Zahl ab und gib ihre Einmaleins-Reihe von 1 bis 10 aus. Jede Zeile sieht so aus: **3 x 1 = 3**, **3 x 2 = 6** und so weiter.
test: 3 -> 3 x 1 = 3 | 3 x 2 = 6 | 3 x 3 = 9 | 3 x 4 = 12 | 3 x 5 = 15 | 3 x 6 = 18 | 3 x 7 = 21 | 3 x 8 = 24 | 3 x 9 = 27 | 3 x 10 = 30
test: 7 -> 7 x 1 = 7 | 7 x 2 = 14 | 7 x 3 = 21 | 7 x 4 = 28 | 7 x 5 = 35 | 7 x 6 = 42 | 7 x 7 = 49 | 7 x 8 = 56 | 7 x 9 = 63 | 7 x 10 = 70
braucht: forSchleife
tipp: Die Schleife zählt von 1 bis 10. In jedem Durchlauf gibst du eine Zeile der Reihe aus.
tipp: Rechne im Inhalt zuerst \`int produkt = zahl * i\`. Danach gibst du \`zahl + " x " + i + " = " + produkt\` aus. Denk an die Leerzeichen innerhalb der Anführungszeichen.
lösung: l12-einmaleins-loesung.visustruct
:::

## Übung: Summe reparieren

::: übung l16-summe
titel: Summe reparieren
auftrag: Das Struktogramm soll alle Zahlen von 1 bis n zusammenzählen. Bei n = 4 soll also 1 + 2 + 3 + 4 = **10** herauskommen. Es gibt aber 6 aus.
  Mache einen Schreibtischtest oder nutze **Schritt** und repariere den Fehler.
start: l16-summe-start.visustruct
test: 4 -> 10
test: 1 -> 1
test: 5 -> 15
braucht: forSchleife
tipp: Gehe die Schleife mit n = 4 im Kopf oder mit **Schritt** durch. Welche Zahlen werden wirklich addiert?
tipp: Schau, mit welchem Wert von i die Schleife zuletzt läuft. Bei n = 4 muss auch i = 4 noch dazugezählt werden.
lösung: l16-summe-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kenne die drei Teile Start, Bedingung und Schritt der For-Schleife. → Zählen mit festem Plan
- Ich weiß, in welcher Reihenfolge die drei Teile ausgeführt werden. → In welcher Reihenfolge?
- Ich kann mit einer For-Schleife vorwärts, rückwärts und in größeren Schritten zählen. → Andere Schritte
:::

## Wissenstest

::: quiz
? Wie oft wird der Start einer For-Schleife ausgeführt?
- [x] Genau einmal
- [ ] Vor jedem Durchlauf
- [ ] Nach jedem Durchlauf
> Der Start legt die Zählvariable einmal am Anfang an.

? Start \`int i = 0\`, Bedingung \`i < 3\`, Schritt \`i++\`. Welche Werte hat i im Inhalt?
- [ ] 1, 2, 3
- [x] 0, 1, 2
- [ ] 0, 1, 2, 3
> Bei i = 3 ist die Bedingung falsch, deshalb läuft der Inhalt dann nicht mehr.

? Start \`int i = 2\`, Bedingung \`i <= 10\`, Schritt \`i = i + 2\`. Wie oft läuft der Inhalt?
- [ ] 4-mal
- [x] 5-mal
- [ ] 10-mal
> i nimmt die Werte 2, 4, 6, 8 und 10 an.

? Wann passt eine For-Schleife am besten?
- [x] Wenn vorher feststeht, wie oft wiederholt wird
- [ ] Wenn so lange gefragt wird, bis eine Eingabe gültig ist
- [ ] Wenn nur ein einziger Wert geprüft wird
:::
`,gr=`---
titel: Verschachteln
bereich: Grundlagen
kurz: Verzweigungen in Schleifen und Schleifen in Schleifen kombinieren.
---

## Bausteine ineinander

Du kennst jetzt alle wichtigen Bausteine: Sequenz, Verzweigung, Fallauswahl und drei Arten von Schleifen. Richtig stark werden sie erst zusammen.

Jeder Zweig und jeder Schleifeninhalt ist selbst wieder eine Sequenz. Dort darfst du jedes Element einsetzen, auch weitere Verzweigungen und Schleifen. Das nennt man **Verschachteln**.

> Ziehe dazu ein Element einfach auf den Platzhalter ø im Inneren einer Schleife oder eines Zweigs.

## Verzweigung in der Schleife

Die Schleife geht alle Zahlen durch, die Verzweigung entscheidet bei jeder einzelnen Zahl, ob etwas passiert. So kannst du zum Beispiel zählen, wie viele gerade Zahlen es von 1 bis n gibt.

::: diagramm l13-gerade-zaehlen.visustruct
Bei jedem Durchlauf prüft die Verzweigung mit i % 2 == 0, ob i gerade ist. Nur dann wird anzahl um 1 erhöht. Der false-Zweig bleibt leer.
:::

Bei n = 7 sind das die Zahlen 2, 4 und 6, also wird 3 ausgegeben.

## Übung: Gerade Eingaben zählen

::: übung l13-gerade-eingaben
titel: Gerade Eingaben zählen
auftrag: Frage nacheinander genau **fünf** ganze Zahlen ab. Gib danach aus, wie viele davon gerade waren.
test: 1, 2, 3, 4, 5 -> 2
test: 2, 4, 6, 8, 10 -> 5
test: 1, 3, 5, 7, 9 -> 0
test: 10, 11, 0, 7, 8 -> 3
braucht: forSchleife, verzweigung
tipp: Fünfmal dasselbe tun heißt: Schleife. In jedem Durchlauf wird eine Zahl eingelesen und geprüft.
tipp: Eine For-Schleife von 1 bis 5. Im Inhalt steht zuerst die Eingabe \`input: int zahl "Zahl eingeben"\`, darunter eine Verzweigung mit \`zahl % 2 == 0\`. Im true-Zweig erhöhst du \`anzahl\` um 1.
lösung: l13-gerade-eingaben-loesung.visustruct
:::

## Schleife in der Schleife

Steht eine Schleife in einer anderen, läuft die **innere Schleife bei jedem Durchlauf der äußeren komplett durch**. Damit kannst du Muster aus Zeilen und Spalten bauen.

::: diagramm l13-dreieck.visustruct
Die äußere Schleife zählt die Zeilen. Die innere hängt so viele Sterne an den Text, wie die Zeilennummer angibt. Bei n = 3 entsteht ein Dreieck aus 1, 2 und 3 Sternen.
:::

Mit \`String text = ""\` beginnt jede Zeile leer. \`text = text + "*"\` hängt einen Stern an. Erst wenn die Zeile fertig ist, wird sie ausgegeben.

## Übung: Rechteck

::: übung l13-rechteck
titel: Rechteck
auftrag: Frage eine Breite und eine Höhe ab. Gib ein Rechteck aus \`#\` aus: so viele Zeilen wie die Höhe, und in jeder Zeile so viele \`#\` wie die Breite.
test: 3, 2 -> ### | ###
test: 1, 3 -> # | # | #
test: 4, 1 -> ####
test: 2, 2 -> ## | ##
braucht: forSchleife
tipp: Du brauchst zwei Schleifen ineinander: eine für die Zeilen und darin eine für die Zeichen einer Zeile.
tipp: Baue es wie das Dreieck. Der Unterschied: Die innere Schleife zählt immer bis \`breite\`, nicht bis zur Zeilennummer. Die äußere Schleife zählt bis \`hoehe\`.
lösung: l13-rechteck-loesung.visustruct
:::

## Den Überblick behalten

Bei verschachtelten Diagrammen hilft dir die Darstellung: Was weiter innen steht, ist eingerückt und von seiner Schleife oder seinem Zweig umschlossen.

- Lies von außen nach innen: Was wiederholt sich? Was wird bei jedem Durchlauf entschieden?
- Gib Zählvariablen sprechende Namen wie \`zeile\` und \`spalte\`. Zwei Schleifen dürfen nicht dieselbe Zählvariable verändern.
- Gehe ein Beispiel in der Simulation mit **Schritt** durch und beobachte die Variablen.

::: angeberwissen
Genau dafür wurde das Struktogramm erfunden. Shneiderman fragte sich: Wenn man auf GOTO verzichten soll, warum dann nicht gleich auf die Pfeile im Flussdiagramm? Ergebnis: kein Pfeil-Spaghetti, und jeder Block bleibt brav in seinem Gatter. [Die ganze Geschichte](https://visustruct.org/de/angeberwissen.html)
:::

## Checkliste

::: checkliste
- Ich kann eine Verzweigung in eine Schleife setzen. → Verzweigung in der Schleife
- Ich kann eine Schleife in eine andere Schleife setzen. → Schleife in der Schleife
- Ich weiß, dass die innere Schleife bei jedem Durchlauf der äußeren komplett durchläuft. → Schleife in der Schleife
:::

## Wissenstest

::: quiz
? Die äußere Schleife läuft 3-mal, die innere 4-mal. Wie oft wird der Inhalt der inneren Schleife insgesamt ausgeführt?
- [ ] 7-mal
- [x] 12-mal
- [ ] 4-mal
> Bei jedem der 3 äußeren Durchläufe läuft die innere Schleife 4-mal, also 3 · 4 = 12.

? Woran erkennst du, ob eine Zahl gerade ist?
- [ ] \`zahl / 2 == 0\`
- [x] \`zahl % 2 == 0\`
- [ ] \`zahl == 2\`
> % liefert den Rest beim Teilen. Bei geraden Zahlen ist der Rest beim Teilen durch 2 null.

? In einer For-Schleife steht eine Verzweigung. Wie oft wird die Bedingung der Verzweigung geprüft?
- [ ] Einmal
- [x] Einmal pro Durchlauf der Schleife
- [ ] Nur wenn sie wahr ist
> Die Verzweigung gehört zum Inhalt und kommt bei jedem Durchlauf dran.
:::
`,pr=`---
titel: Arrays
bereich: Grundlagen
kurz: Viele Werte unter einem Namen speichern, mit dem Index darauf zugreifen und sie mit einer Schleife durchlaufen.
---

## Viele Werte unter einem Namen

Stell dir vor, du willst die Punkte von fünf Tests speichern. Mit fünf Variablen \`punkte1\` bis \`punkte5\` wird das schnell unübersichtlich. Ein **Array** ist eine Reihe von Fächern, die alle denselben Namen und denselben Datentyp haben.

Du legst ein Array mit einer Anweisung an. Hinter den Datentyp schreibst du eckige Klammern \`[]\`:

\`\`\`
int[] zahlen = {2, 4, 6, 8, 10}
String[] namen = {"Ada", "Ben", "Cem"}
\`\`\`

Die Werte in den geschweiften Klammern stehen gleich in den Fächern. Du kannst auch ein leeres Array mit einer festen Anzahl von Fächern anlegen:

\`\`\`
int[] punkte = new int[5]
String[] namen = new String[3]
\`\`\`

Bei \`new int[5]\` stehen in allen fünf Fächern zuerst Nullen, bei \`new String[3]\` leere Texte.

## Der Index beginnt bei 0

Jedes Fach hat eine Nummer, den **Index**. Gezählt wird ab **0**. Bei \`int[] zahlen = {2, 4, 6, 8, 10}\` gilt also:

- \`zahlen[0]\` ist 2
- \`zahlen[1]\` ist 4
- \`zahlen[4]\` ist 10

::: grafik l14-array.svg
Fünf Fächer mit den Indizes 0 bis 4. Der Index steht über dem Fach, der Wert darin.
:::

**Warum beginnt man bei 0?** In der Informatik ist der Index kein „wievieltes Fach“, sondern der **Abstand vom Anfang**. Das erste Fach liegt direkt am Anfang, also 0 Schritte entfernt. Das zweite liegt 1 Schritt entfernt, das dritte 2 Schritte. Du kennst das aus dem Aufzug: Das Erdgeschoss ist die **0**, der erste Stock liegt eine Etage darüber.

Daraus folgt eine Regel, die du dir merken solltest: Bei 5 Fächern ist der **letzte Index 4**, also immer eins weniger als die Anzahl.

::: angeberwissen
Dass ab 0 gezählt wird, ist ziemlich alt. Schon die Programmiersprache C von 1972 rechnet so: Der Computer kennt die Adresse des ersten Fachs und rechnet für \`zahlen[i]\` einfach „Anfang plus i Fächer weiter“. Bei i = 0 bleibt er am Anfang stehen, das spart eine Rechnung. Java, Python und JavaScript haben das übernommen. Ich zähle meine Hörner übrigens auch ab 0: Horn 0 links, Horn 1 rechts.
:::

Mit dem Index liest du einen Wert oder schreibst einen neuen hinein:

\`\`\`
output: zahlen[0]
zahlen[1] = 99
\`\`\`

> Ein Array mit 5 Fächern hat die Indizes 0 bis 4. \`zahlen[5]\` gibt es nicht. Die Simulation meldet dann einen ungültigen Ausdruck.

## Die Länge eines Arrays

Wie viele Fächer ein Array hat, verrät \`zahlen.length\`. Bei fünf Werten ist das 5. Der **letzte** Index ist deshalb immer \`zahlen.length - 1\`:

\`\`\`
output: zahlen.length
output: zahlen[zahlen.length - 1]
\`\`\`

Die zweite Zeile gibt den letzten Wert aus, egal wie lang das Array ist. VisuStruct versteht auch die Schreibweise \`zahlen.length()\`.

::: übung l14-erster-letzter
titel: Erster und letzter Wert
auftrag: Lege das Array \`int[] werte = {4, 8, 15, 16, 23, 42}\` an. Gib danach in drei Zeilen aus: den ersten Wert, den letzten Wert und die Anzahl der Werte.
  Für den letzten Wert sollst du die Länge benutzen und nicht einfach den Index 5 hinschreiben.
test: - -> 4 | 42 | 6
braucht: anweisung
tipp: Gezählt wird ab 0. Das erste Fach hat also den Index 0. Und wie heißt der Index des letzten Fachs?
tipp: Der erste Wert ist \`werte[0]\`. Der letzte ist \`werte[werte.length - 1]\`. Die Anzahl ist \`werte.length\`.
lösung: l14-erster-letzter-loesung.visustruct
:::

## Ein Array mit der Schleife durchlaufen

Seine Stärke zeigt ein Array zusammen mit einer **For-Schleife**. Die Zählvariable \`i\` läuft von 0 bis zum letzten Index und dient als Index:

\`\`\`
int i = 0
i < zahlen.length
i++
\`\`\`

Im ersten Durchlauf ist \`i\` gleich 0, im letzten gleich 4. Weil die Bedingung \`i < zahlen.length\` lautet, passt die Schleife zu jeder Länge.

::: diagramm l14-array-durchlaufen.visustruct
Die For-Schleife gibt alle fünf Werte nacheinander aus. Schau in der Simulation unter Variablen zu, wie i von 0 bis 4 zählt.
:::

So füllst du ein leeres Array auch mit Eingaben. Als Ziel der Eingabe schreibst du das Fach \`namen[i]\`:

::: diagramm l14-namen-eingeben.visustruct
Drei Namen werden abgefragt und in die Fächer 0, 1 und 2 geschrieben.
:::

::: übung l14-rueckwaerts
titel: Rückwärts ausgeben
auftrag: Lege ein Array für 4 ganze Zahlen an und lies die 4 Zahlen mit einer Schleife ein. Gib sie danach in **umgekehrter** Reihenfolge aus, jede in einer eigenen Zeile.
test: 1, 2, 3, 4 -> 4 | 3 | 2 | 1
test: 7, 0, 5, 9 -> 9 | 5 | 0 | 7
braucht: forSchleife
tipp: Du brauchst zwei Schleifen: eine zum Einlesen von vorn nach hinten und eine zum Ausgeben von hinten nach vorn.
tipp: Mit \`int[] zahlen = new int[4]\` legst du das Array an. Die Eingabe lautet \`input: zahlen[i] "Zahl eingeben"\`. Für die zweite Schleife beginnst du bei \`int i = zahlen.length - 1\`, prüfst \`i >= 0\` und zählst mit \`i--\` herunter.
lösung: l14-rueckwaerts-loesung.visustruct
:::

## Summe und Maximum

Zwei Aufgaben kommen bei Arrays immer wieder vor:

- **Summe:** Du beginnst mit \`summe = 0\` und zählst in der Schleife jeden Wert dazu.
- **Maximum:** Du merkst dir zuerst den Wert im Fach 0 als bisher größten. In der Schleife prüfst du jeden Wert. Ist er größer, wird er das neue Maximum.

::: diagramm l14-summe-maximum.visustruct
Summe und Maximum in einem einzigen Durchlauf. Das Maximum beginnt mit punkte[0] und nicht mit 0, damit es auch bei negativen Zahlen stimmt.
:::

::: übung l14-summe-max
titel: Summe und Maximum
auftrag: Lies 5 ganze Zahlen in ein Array ein. Gib danach **Summe: …** und in der nächsten Zeile **Maximum: …** aus.
test: 3, 9, 2, 9, 1 -> Summe: 24 | Maximum: 9
test: 10, 20, 30, 40, 50 -> Summe: 150 | Maximum: 50
test: -5, -2, -9, -1, -3 -> Summe: -20 | Maximum: -1
braucht: forSchleife, verzweigung
tipp: Gehe das Array mit einer Schleife durch. Zähle jeden Wert zur Summe und merke dir den größten bisher gesehenen Wert.
tipp: Rechne Summe und Maximum in eigenen Variablen aus und gib sie erst am Ende aus, z. B. mit \`output: "Summe: " + summe\`. Beginnt dein Maximum bei 0, scheitert der dritte Test.
lösung: l14-summe-max-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann ein Array mit Werten oder mit \`new int[5]\` anlegen. → Viele Werte unter einem Namen
- Ich weiß, dass der Index bei 0 beginnt und der letzte Index \`length - 1\` ist. → Der Index beginnt bei 0
- Ich kann ein Array mit einer For-Schleife durchlaufen und füllen. → Ein Array mit der Schleife durchlaufen
- Ich kann die Summe und das Maximum eines Arrays berechnen. → Summe und Maximum
:::

## Wissenstest

::: quiz
? Was gibt \`output: zahlen[2]\` bei \`int[] zahlen = {5, 10, 15, 20}\` aus?
- [ ] 10
- [x] 15
- [ ] 20
> Gezählt wird ab 0: zahlen[0] ist 5, zahlen[1] ist 10, zahlen[2] ist 15.

? Ein Array hat 8 Fächer. Welcher Index ist der letzte?
- [ ] 8
- [x] 7
- [ ] 9
> Der letzte Index ist immer length - 1.

? Welche Bedingung passt in eine For-Schleife, die alle Werte von \`zahlen\` durchläuft und bei \`int i = 0\` beginnt?
- [x] i < zahlen.length
- [ ] i <= zahlen.length
- [ ] i > zahlen.length
> Mit <= würde die Schleife auch zahlen[length] lesen, und dieses Fach gibt es nicht.

? Womit sollte das Maximum beginnen, bevor die Schleife startet?
- [ ] Immer mit 0
- [x] Mit dem ersten Wert des Arrays
- [ ] Mit der Länge des Arrays
> Beginnt es mit 0, wäre bei lauter negativen Zahlen 0 das Ergebnis, obwohl 0 gar nicht im Array steht.

? Welches deutsche Wort wird oft für Array benutzt?
- [ ] Zweig
- [x] Feld
- [ ] Fall
> Ein Array heißt auf Deutsch oft Feld. Gemeint ist dasselbe: viele Fächer unter einem Namen.
:::
`,xr=`---
titel: Zweidimensionale Arrays
bereich: Grundlagen
kurz: Werte in Zeilen und Spalten speichern, wie die Sitze in einem Kinosaal, und mit zwei verschachtelten Schleifen durchlaufen.
---

## Ein Kinosaal als Tabelle

Ein Kinosaal hat mehrere **Reihen**, und jede Reihe hat mehrere **Plätze**. Für jeden Sitz wollen wir uns merken, ob die Karte schon verkauft ist. Das ist eine Ja-oder-nein-Frage, also passt der Datentyp \`boolean\`: \`true\` heißt verkauft, \`false\` heißt frei.

Ein normales Array ist eine einzige Reihe von Fächern. Für den Saal brauchen wir eine **Tabelle** mit Zeilen und Spalten. Das ist ein **zweidimensionales Array**, kurz 2D-Array. Du schreibst dafür zwei Paar eckige Klammern:

\`\`\`
boolean[][] sitze = new boolean[3][5]
\`\`\`

Das ergibt 3 Reihen mit je 5 Plätzen, also 15 Fächer. Am Anfang steht in allen Fächern \`false\`: Alle Plätze sind frei.

::: grafik kino-saal.svg
Der erste Index ist die Reihe, der zweite der Platz. Beide werden ab 0 gezählt.
:::

## Ein Fach ansprechen

Für ein Fach brauchst du jetzt **zwei** Indizes: zuerst die Reihe, dann den Platz.

\`\`\`
sitze[1][2] = true
\`\`\`

Damit ist in Reihe 1 der Platz 2 verkauft. Gelesen wird genauso: \`sitze[1][2]\` ist jetzt \`true\`.

Auch die Größe kannst du abfragen:

- \`sitze.length\` ist die Anzahl der **Reihen**, hier 3.
- \`sitze[0].length\` ist die Anzahl der **Plätze** in Reihe 0, hier 5.

::: diagramm kino-verkaufen.visustruct
Drei Karten werden verkauft. Danach gibt das Diagramm die Größe des Saals aus und ob Reihe 1, Platz 2 verkauft ist. Schau in der Simulation unter Variablen zu: sitze wird Zeile für Zeile angezeigt.
:::

> Wie beim normalen Array gibt es kein Fach \`sitze[3][0]\`, denn die Reihen heißen 0, 1 und 2. Die Simulation meldet dann einen ungültigen Ausdruck.

## Zwei Schleifen ineinander

Um **alle** Plätze anzusehen, brauchst du zwei For-Schleifen ineinander:

- Die **äußere Schleife** zählt die Reihe: \`reihe\` läuft von 0 bis 2.
- Die **innere Schleife** zählt den Platz: \`platz\` läuft von 0 bis 4.

::: grafik kino-schleifen.svg
Blau ist die äußere Schleife, Orange die innere. Die Zahlen zeigen, in welcher Reihenfolge die Plätze drankommen.
:::

Für jede Reihe läuft die innere Schleife einmal **komplett** durch. Erst wenn \`platz\` alle fünf Plätze besucht hat, zählt die äußere Schleife \`reihe\` um eins weiter. Danach beginnt \`platz\` wieder bei 0. So kommen alle 3 · 5 = 15 Plätze genau einmal dran.

Die Bedingungen lauten \`reihe < sitze.length\` und \`platz < sitze[reihe].length\`. So passen die Schleifen zu jeder Saalgröße.

::: diagramm kino-saalplan.visustruct
Der Saalplan: Für jede Reihe wird eine Zeile aus X (verkauft) und O (frei) zusammengesetzt und ausgegeben. Gehe es mit Schritt durch und beobachte, wie platz immer wieder von vorn beginnt, während reihe nur langsam weiterzählt.
:::

::: angeberwissen
Jedes Handyfoto ist ein 2D-Array! Ein Foto mit 4000 · 3000 Pixeln hat 3000 Zeilen mit je 4000 Fächern, also 12 Millionen Pixel. In jedem Fach steht die Farbe eines Punkts. Wenn du ein Foto heller machst, läuft das Handy mit zwei verschachtelten Schleifen über alle Pixel. Mein Profilbild hat übrigens nur ein Fach: braun.
:::

## Übung: Freie Plätze zählen

::: übung kino-frei
titel: Freie Plätze zählen
auftrag: Im Startdiagramm sind schon drei Karten verkauft. Zähle mit zwei verschachtelten Schleifen, wie viele Plätze noch **frei** sind, und gib z. B. \`Frei: 12\` aus.
start: kino-frei-start.visustruct
test: - -> Frei: 12
braucht: forSchleife, verzweigung
tipp: Du gehst wie beim Saalplan mit zwei Schleifen über alle Plätze. Statt etwas auszugeben, zählst du mit.
tipp: Lege vor den Schleifen \`int frei = 0\` an. Ein Platz ist frei, wenn \`sitze[reihe][platz]\` falsch ist. Die Bedingung dafür lautet \`!sitze[reihe][platz]\`.
lösung: kino-frei-loesung.visustruct
:::

## Übung: Karte verkaufen

::: übung kino-karte
titel: Karte verkaufen
auftrag: Das Startdiagramm fragt nach Reihe und Platz. Ist der Platz schon verkauft, gib \`Schon verkauft\` aus. Sonst markiere ihn als verkauft und gib z. B. \`Verkauft: Reihe 0, Platz 4\` aus.
start: kino-karte-start.visustruct
test: 1, 2 -> Schon verkauft
test: 0, 4 -> Verkauft: Reihe 0, Platz 4
test: 2, 0 -> Verkauft: Reihe 2, Platz 0
braucht: verzweigung
tipp: Zuerst wird geprüft, ob der Platz verkauft ist. Je nach Antwort passiert etwas anderes.
tipp: Hier brauchst du keine Schleife. Eine Verzweigung mit der Bedingung \`sitze[reihe][platz]\` genügt. Im false-Zweig setzt du das Fach auf \`true\`.
lösung: kino-karte-loesung.visustruct
:::

## Übung: Einmaleins-Tabelle

::: übung kino-einmaleins
titel: Einmaleins-Tabelle
auftrag: Lege \`int[][] tabelle = new int[10][10]\` an und fülle sie mit zwei Schleifen mit dem kleinen Einmaleins. Frage danach zwei Zahlen von 1 bis 10 ab und lies das Ergebnis aus der Tabelle, z. B. \`3 · 4 = 12\`.
test: 3, 4 -> 3 · 4 = 12
test: 7, 8 -> 7 · 8 = 56
test: 10, 10 -> 10 · 10 = 100
braucht: forSchleife
tipp: Erst füllen zwei verschachtelte Schleifen die Tabelle, danach liest du nur ein einziges Fach aus.
tipp: Die Indizes laufen von 0 bis 9, die Zahlen aber von 1 bis 10. Darum steht im Fach \`tabelle[i][j]\` der Wert \`(i + 1) * (j + 1)\`, und für 3 · 4 liest du \`tabelle[a - 1][b - 1]\`.
lösung: kino-einmaleins-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann ein 2D-Array anlegen und weiß, was die beiden Zahlen bedeuten. → Ein Kinosaal als Tabelle
- Ich kann ein Fach mit Reihe und Platz lesen und schreiben. → Ein Fach ansprechen
- Ich kenne den Unterschied zwischen \`sitze.length\` und \`sitze[0].length\`. → Ein Fach ansprechen
- Ich kann erklären, in welcher Reihenfolge zwei verschachtelte Schleifen die Fächer besuchen. → Zwei Schleifen ineinander
:::

## Wissenstest

::: quiz
? Wie viele Fächer hat \`boolean[][] sitze = new boolean[4][6]\`?
- [ ] 10
- [x] 24
- [ ] 46
> 4 Reihen mit je 6 Plätzen: 4 · 6 = 24.

? Was steht nach \`new boolean[3][5]\` in allen Fächern?
- [ ] true
- [x] false
- [ ] Nichts, die Fächer sind leer
> Ein neues boolean-Array ist mit false gefüllt. Im Kino heißt das: alle Plätze frei.

? Zwei verschachtelte Schleifen laufen über 3 Reihen mit 5 Plätzen. Wie oft wird der Inhalt der **inneren** Schleife ausgeführt?
- [ ] 3-mal
- [ ] 8-mal
- [x] 15-mal
> Für jede der 3 Reihen läuft die innere Schleife 5-mal: 3 · 5 = 15.

? Ordne zu, was der Ausdruck im Kinosaal bedeutet.
= sitze.length -> Anzahl der Reihen
= sitze[0].length -> Anzahl der Plätze in Reihe 0
= sitze[2][4] -> Reihe 2, Platz 4
= sitze[1][0] = true -> In Reihe 1 ist Platz 0 verkauft
:::
`,br=`---
titel: Zeichenketten
bereich: Grundlagen
kurz: Mit Texten arbeiten, also einzelne Zeichen lesen, Teile herausschneiden, suchen, vergleichen und zerlegen.
---

## Text ist eine Reihe von Zeichen

Einen \`String\` kennst du schon: \`String name = "Ludwig"\`. In der Informatik heißt so ein Text auch **Zeichenkette**, weil die Zeichen wie Perlen an einer Kette hintereinander hängen. Jedes Zeichen hat einen Platz mit einem Index, genau wie bei einem Array. Auch hier wird **ab 0 gezählt**: Das erste Zeichen ist 0 Schritte vom Anfang entfernt.

::: grafik zk-zeichen.svg
Die acht Zeichen von „Geißbock“ mit ihren Indizes 0 bis 7.
:::

Ein String bringt **Methoden** mit. Du schreibst den Namen der Variablen, einen Punkt und die Methode:

- \`wort.length()\` liefert die Anzahl der Zeichen, hier 8.
- \`wort.charAt(0)\` liefert das Zeichen mit dem Index 0, hier \`'G'\`.

> Bei Strings schreibst du \`length()\` **mit** Klammern, bei Arrays \`length\` **ohne**. Das ist in Java leider so.

Ein einzelnes Zeichen hat in Java den Datentyp \`char\`. Ein \`char\` steht in **einfachen** Anführungszeichen: \`'G'\`. Ein String steht in doppelten: \`"G"\`.

\`\`\`
char erster = wort.charAt(0)
char letzter = wort.charAt(wort.length() - 1)
\`\`\`

Das letzte Zeichen hat wie beim Array den Index \`length() - 1\`.

## Teile herausschneiden

Mit \`substring\` schneidest du einen Teil aus dem Text:

- \`wort.substring(0, 4)\` liefert die Zeichen von Index 0 **bis vor** Index 4, also \`"Geiß"\`.
- \`wort.substring(4)\` liefert alles ab Index 4 bis zum Ende, also \`"bock"\`.

Das Ende gehört **nicht** mehr dazu. Praktisch ist: \`substring(0, 4)\` liefert genau 4 Zeichen.

::: diagramm zk-zeichen.visustruct
Alle Methoden aus dieser Lektion an einem Beispiel. Gehe es in der Simulation durch und vergleiche jede Ausgabe mit der Grafik.
:::

## Suchen und vergleichen

Weitere Methoden, die du oft brauchst:

| Methode | Bedeutung | Beispiel mit \`"Geißbock"\` |
|---|---|---|
| \`indexOf("bock")\` | Wo beginnt der Text? | 4 |
| \`indexOf("x")\` | nicht gefunden | -1 |
| \`contains("eiß")\` | Kommt der Text vor? | true |
| \`toUpperCase()\` | alles groß | GEISSBOCK |
| \`toLowerCase()\` | alles klein | geißbock |
| \`equals("Geißbock")\` | gleicher Text? | true |

> Zwei Strings vergleichst du in Java mit \`equals\`, nicht mit \`==\`. Zwei einzelne Zeichen (\`char\`) vergleichst du dagegen mit \`==\`, z. B. \`wort.charAt(i) == 'e'\`.

::: angeberwissen
Probier mal \`"Geißbock".toUpperCase()\` aus. Heraus kommt GEISSBOCK, und das Wort ist plötzlich ein Zeichen **länger**! Ein großes ß gab es auf Schreibmaschinen nie, darum wird es zu SS. Erst seit 2017 ist das große ẞ offiziell erlaubt, aber Java bleibt beim SS. In meinem Namen kommt zum Glück kein ß vor, nur im Wort Geißbock.
:::

## Zeichen für Zeichen

Mit einer For-Schleife gehst du einen Text Zeichen für Zeichen durch. Der Index \`i\` läuft von 0 bis \`wort.length() - 1\`, genau wie bei einem Array:

::: diagramm zk-zaehlen.visustruct
Zählt, wie oft der Buchstabe e vorkommt. Probiere in der Simulation „Kaffeebecher“ aus und beobachte i und anzahl.
:::

## Zerlegen mit split

Oft stehen mehrere Angaben in einer einzigen Zeile, getrennt durch ein Zeichen, z. B. \`"Ludwig;Geißbock;7"\`. Mit \`split\` zerlegst du die Zeile an diesem Zeichen. Heraus kommt ein **String-Array**:

\`\`\`
String[] teile = zeile.split(";")
\`\`\`

Danach ist \`teile[0]\` gleich \`"Ludwig"\`, \`teile[1]\` gleich \`"Geißbock"\` und \`teile[2]\` gleich \`"7"\`. Mit \`teile.length\` erfährst du, wie viele Teile es sind.

::: diagramm zk-split.visustruct
Die Zeile wird am Semikolon zerlegt und jeder Teil mit seinem Index ausgegeben.
:::

> So sind auch CSV-Dateien aufgebaut, die du aus Tabellenkalkulationen kennst: eine Zeile pro Datensatz, die Werte durch Semikolon getrennt.

## Übung: Initialen

::: übung zk-initialen
titel: Initialen
auftrag: Frage nach Vorname und Nachname und gib die Initialen aus. Bei Ludwig Geißbock also \`L. G.\`
test: Ludwig, Geißbock -> L. G.
test: Ada, Lovelace -> A. L.
test: Ben, Shneiderman -> B. S.
braucht: anweisung
tipp: Die Initiale ist der erste Buchstabe eines Namens. Welche Methode liefert ein Zeichen an einer bestimmten Stelle?
tipp: Den ersten Buchstaben liefert \`vorname.charAt(0)\`. Die Ausgabe ist dann \`vorname.charAt(0) + ". " + nachname.charAt(0) + "."\`
lösung: zk-initialen-loesung.visustruct
:::

## Übung: Rückwärts

::: übung zk-rueckwaerts
titel: Rückwärts
auftrag: Frage nach einem Wort und gib es rückwärts aus. Aus Ludwig wird \`giwduL\`.
test: Ludwig -> giwduL
test: Anna -> annA
test: a -> a
braucht: forSchleife
tipp: Gehe das Wort Zeichen für Zeichen durch, aber von hinten nach vorn, und baue dabei einen neuen Text zusammen.
tipp: Lege \`String rueckwaerts = ""\` an. Die Schleife beginnt beim letzten Index \`wort.length() - 1\` und zählt mit \`i--\` bis 0 herunter. In jedem Durchlauf hängst du \`wort.charAt(i)\` hinten an.
lösung: zk-rueckwaerts-loesung.visustruct
:::

## Übung: Wörter zählen

::: übung zk-woerter
titel: Wörter zählen
auftrag: Frage nach einem Satz und gib aus, wie viele Wörter er hat, z. B. \`Wörter: 4\` bei „Ludwig ist ein Geißbock“. Die Wörter sind durch genau ein Leerzeichen getrennt.
test: Ludwig ist ein Geißbock -> Wörter: 4
test: Hallo -> Wörter: 1
test: Struktogramme machen Spaß -> Wörter: 3
braucht: anweisung
tipp: Zwischen den Wörtern steht immer ein Leerzeichen. Welche Methode zerlegt einen Text an einem Zeichen?
tipp: Zerlege den Satz mit \`satz.split(" ")\` in ein String-Array. Seine Länge ist die Anzahl der Wörter.
lösung: zk-woerter-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich weiß, dass auch die Zeichen eines Strings ab 0 gezählt werden. → Text ist eine Reihe von Zeichen
- Ich kann mit \`length()\` und \`charAt(i)\` arbeiten. → Text ist eine Reihe von Zeichen
- Ich kann mit \`substring\` einen Teil aus einem Text schneiden. → Teile herausschneiden
- Ich kenne \`indexOf\`, \`contains\`, \`toUpperCase\` und \`equals\`. → Suchen und vergleichen
- Ich kann einen Text mit einer Schleife Zeichen für Zeichen durchgehen. → Zeichen für Zeichen
- Ich kann einen Text mit \`split\` in ein String-Array zerlegen. → Zerlegen mit split
:::

## Wissenstest

::: quiz
? Was liefert \`"Ludwig".charAt(1)\`?
- [ ] L
- [x] u
- [ ] d
> Gezählt wird ab 0: L hat den Index 0, u den Index 1.

? Was liefert \`"Struktogramm".substring(0, 6)\`?
- [x] Strukt
- [ ] Struktog
- [ ] truktog
> Die Zeichen mit den Indizes 0 bis 5. Das Ende 6 gehört nicht mehr dazu.

? Ein Wort hat 7 Zeichen. Welchen Index hat das letzte Zeichen?
- [ ] 7
- [x] 6
- [ ] 8
> Wie beim Array: immer eins weniger als die Länge.

? Wie vergleichst du in Java zwei Strings auf gleichen Inhalt?
- [ ] a == b
- [x] a.equals(b)
- [ ] a = b

? Ordne jeder Methode zu, was sie bei \`"Geißbock"\` liefert.
= length() -> 8
= charAt(0) -> G
= indexOf("bock") -> 4
= substring(4) -> bock
:::
`,fr=`---
titel: Aufruf und Aussprung
bereich: Grundlagen
kurz: Große Aufgaben in Unterprogramme zerlegen und Schleifen vorzeitig verlassen.
---

## Große Aufgaben zerlegen

Lange Struktogramme werden schnell unübersichtlich. Deshalb zerlegst du eine große Aufgabe in **Teilprobleme**. Jedes Teilproblem bekommt einen eigenen Namen und ein eigenes Struktogramm, ein **Unterprogramm**.

Ein Quiz besteht zum Beispiel aus drei Teilen: begrüßen, Fragen stellen, Ergebnis zeigen. Das Hauptprogramm nennt nur noch diese drei Teile:

::: diagramm l15-hauptprogramm.visustruct
Das Hauptprogramm besteht nur aus drei Aufrufen. Was in jedem Teil passiert, steht in einem eigenen Struktogramm.
:::

So siehst du auf einen Blick, wie das Programm aufgebaut ist. Die Einzelheiten stehen woanders.

## Der Aufruf

Ein **Aufruf** ist ein Kasten mit doppelten senkrechten Linien links und rechts. Er bedeutet: Führe hier das Unterprogramm mit diesem Namen aus und mache danach weiter.

- Du ziehst **Aufruf** aus dem Bereich Elemente und schreibst den Namen hinein, z. B. \`zeigeBegruessung()\`.
- Die runden Klammern am Ende zeigen, dass es ein Unterprogramm ist. So schreibt man es auch in Java, Python und JavaScript.
- Das Unterprogramm selbst baust du als eigenes Struktogramm in einem neuen Reiter. Als Titel trägst du denselben Namen ein.

::: diagramm l15-unterprogramm.visustruct
Das Unterprogramm zeigeBegruessung() als eigenes Struktogramm.
:::

> **In der Simulation:** Erreicht die Simulation einen Aufruf, sucht sie unter den offenen Reitern das Struktogramm mit diesem Titel und führt es aus. Danach macht sie im Hauptprogramm weiter. Solange das Unterprogramm läuft, bleibt der Aufruf-Kasten markiert. Ein Unterprogramm wie dieses, nur mit Namen als Titel, teilt sich die Variablen mit dem Hauptprogramm. Wie ein Unterprogramm eigene Variablen bekommt, lernst du gleich. Gibt es keinen passenden Reiter, überspringt die Simulation den Aufruf und zeigt einen Hinweis.

::: angeberwissen
Warum sagt dein Lehrer bei Java immer „Methode“ und nie „Funktion“ oder „Prozedur“? Weil in Java jedes Unterprogramm zu einer Klasse gehören muss, und Unterprogramme einer Klasse heißen Methoden. Den Unterschied gibt es trotzdem: Liefert eine Methode ein Ergebnis zurück, ist sie eigentlich eine Funktion. Steht \`void\` davor, liefert sie nichts und ist eigentlich eine Prozedur. Java ist da einfach bequem und nennt beide Methode. Ich auch: Meine Methode heißt Fressen.
:::

## Übung: Aufruf einbauen

::: übung l15-titel
titel: Begrüßung mit Aufruf
auftrag: Stell dir vor, das Unterprogramm \`zeigeTitel()\` gibt es schon. Baue das Hauptprogramm: Es ruft zuerst \`zeigeTitel()\` auf. Danach fragt es nach dem Namen und gibt **Hallo** und den Namen aus.
  Bei der Eingabe Ada erscheint also **Hallo Ada**.
test: Ada -> Hallo Ada
test: Ben -> Hallo Ben
braucht: aufruf
tipp: Das Hauptprogramm hat drei Teile: den Aufruf, die Eingabe und die Ausgabe.
tipp: Ziehe einen Aufruf aus dem Bereich Elemente ganz nach oben und schreibe \`zeigeTitel()\` hinein. Darunter kommen die Eingabe \`input: String name "Wie heißt du?"\` und die Ausgabe.
lösung: l15-titel-loesung.visustruct
:::

## Werte übergeben: Parameter

Oft soll ein Unterprogramm mit Werten arbeiten, die erst beim Aufruf feststehen. Dann bekommt es als Titel eine **Kopfzeile**:

\`\`\`
void zeigeSumme(int a, int b)
\`\`\`

- \`void\` heißt: Das Unterprogramm liefert kein Ergebnis zurück.
- \`zeigeSumme\` ist der Name.
- In den Klammern stehen die **Parameter**: Variablen mit Datentyp, die beim Aufruf ihre Werte bekommen. Mehrere trennst du mit Komma.

::: diagramm l15-zeige-summe.visustruct
Das Unterprogramm mit der Kopfzeile als Titel. Es rechnet mit a und b, als wären es normale Variablen.
:::

Im Aufruf-Kasten schreibst du die Werte in die Klammern, z. B. \`zeigeSumme(3, 4)\`. Der erste Wert kommt in \`a\`, der zweite in \`b\`. Statt Zahlen gehen auch Variablen und Rechnungen wie \`zeigeSumme(x, x + 1)\`.

::: diagramm l15-zeige-summe-haupt.visustruct
Das Hauptprogramm ruft zeigeSumme zweimal mit anderen Werten auf. Öffne beide Diagramme und starte hier die Simulation.
:::

> **Lokale Variablen:** Die Parameter und alle Variablen, die im Unterprogramm entstehen, gehören nur dem Unterprogramm. Es bekommt **Kopien** der Werte, mehr dazu weiter unten bei der Wertübergabe (call by value). In der Simulation siehst du während des Aufrufs nur die Variablen des Unterprogramms.

## Ergebnis zurückgeben: return

Ein Unterprogramm kann auch ein Ergebnis liefern, den **Rückgabewert**. Dann steht in der Kopfzeile statt \`void\` der Datentyp des Ergebnisses:

\`\`\`
int quadrat(int x)
\`\`\`

Die Anweisung \`return ergebnis\` gibt den Wert zurück und beendet das Unterprogramm sofort. Beim Aufruf speicherst du das Ergebnis in einer Variablen: Nach \`int q = quadrat(5)\` steht in \`q\` der Wert 25.

::: diagramm l15-quadrat.visustruct
Das Unterprogramm quadrat rechnet und gibt das Ergebnis mit return zurück.
:::

::: diagramm l15-quadrat-haupt.visustruct
Das Hauptprogramm speichert den Rückgabewert in q. Öffne beide Diagramme und probiere die Simulation aus.
:::

> Ein Unterprogramm mit Rückgabewert muss mit \`return\` enden. Fehlt das return, meldet die Simulation einen Fehler.

In der **Code-Ansicht** wird aus der Kopfzeile eine Java-Methode (\`public static int quadrat(int x)\`), in Python ein \`def\` und in JavaScript eine \`function\`. Sind die Unterprogramme in anderen Reitern offen, stehen sie beim Hauptprogramm mit im Code.

## Übung: Fläche berechnen

::: übung l15-flaeche
titel: Fläche berechnen
auftrag: Baue zwei Diagramme. Das Unterprogramm \`int flaeche(int a, int b)\` gibt die Fläche eines Rechtecks zurück, also a mal b. Das Hauptprogramm fragt nach Länge und Breite, ruft \`flaeche\` auf und gibt **Fläche:** und das Ergebnis aus.
  Bei 3 und 4 erscheint **Fläche: 12**.
test: 3, 4 -> Fläche: 12
test: 5, 5 -> Fläche: 25
test: 7, 0 -> Fläche: 0
braucht: aufruf
tipp: Du baust zwei Diagramme: ein Unterprogramm, das nur rechnet und das Ergebnis zurückgibt, und ein Hauptprogramm für Eingabe und Ausgabe.
tipp: Lege mit **+** einen neuen Reiter an und gib ihm den Titel \`int flaeche(int a, int b)\`. Darin reicht eine Anweisung: \`return a * b\`. Im Hauptprogramm schreibst du in den Aufruf-Kasten \`int f = flaeche(laenge, breite)\`.
lösung: l15-flaeche-loesung.visustruct
unterprogramm: l15-flaeche-unterprogramm-loesung.visustruct
:::

## Kopie oder Original: call by value und call by reference

Was passiert, wenn ein Unterprogramm seinen Parameter verändert? Das hängt davon ab, **was** übergeben wird.

**Wertübergabe**, englisch **call by value**: Bei \`int\`, \`double\`, \`boolean\`, \`char\` und \`String\` bekommt das Unterprogramm eine **Kopie** des Werts. Ändert es seinen Parameter, bleibt die Variable des Aufrufers, wie sie war.

**Referenzübergabe**, englisch **call by reference**: Bei einem **Array** bekommt das Unterprogramm keine Kopie, sondern einen Verweis auf dasselbe Array. Ändert es ein Fach, ist das Fach auch beim Aufrufer geändert. Die Kopfzeile dafür sieht so aus:

\`\`\`
void leeren(boolean[] plaetze)
\`\`\`

::: grafik uebergabe.svg
Oben bekommt verdopple eine Kopie von zahl. Unten zeigen reihe und plaetze auf dasselbe Array.
:::

Probiere beides aus. Öffne die drei Diagramme und starte im Hauptprogramm die Simulation:

::: diagramm uebergabe-verdopple.visustruct
verdopple ändert nur seine Kopie x.
:::

::: diagramm uebergabe-leeren.visustruct
leeren setzt alle Plätze auf false, zum Beispiel wenn eine Vorstellung ausfällt.
:::

::: diagramm uebergabe-haupt.visustruct
zahl ist nach dem Aufruf immer noch 5. Die Plätze in reihe sind nach dem Aufruf dagegen frei.
:::

> Willst du mit einer Zahl aus einem Unterprogramm etwas zurückbekommen, nimmst du \`return\`, z. B. \`zahl = verdopple(zahl)\` mit der Kopfzeile \`int verdopple(int x)\`. Ein Array dagegen kann das Unterprogramm direkt verändern.

::: angeberwissen
Ganz genau genommen kennt Java nur die Wertübergabe, also call by value. Bei einem Array wird aber nicht das ganze Array kopiert, sondern nur seine **Adresse** im Speicher. Mit der kopierten Adresse findet das Unterprogramm dasselbe Array. Das ist so, als würde ich dir eine Kopie meines Schließfachschlüssels geben: Der Schlüssel ist kopiert, das Heu im Fach gibt es nur einmal.
:::

## Übung: Bonuspunkte

::: übung uebergabe-bonus
titel: Bonuspunkte
auftrag: Das Hauptprogramm ruft \`bonus(punkte)\` auf und gibt danach alle Punkte aus. Baue das Unterprogramm \`void bonus(int[] punkte)\`, das jede Punktzahl im Array um 1 erhöht. Statt 3, 5 und 8 erscheinen dann **4**, **6** und **9**.
start: uebergabe-bonus-start.visustruct
test: - -> 4 | 6 | 9
braucht: aufruf
tipp: Das Hauptprogramm ist schon fertig. Du baust nur das Unterprogramm in einem neuen Reiter.
tipp: Lege mit **+** einen neuen Reiter mit dem Titel \`void bonus(int[] punkte)\` an. Darin läuft eine For-Schleife über alle Fächer und rechnet \`punkte[i] = punkte[i] + 1\`. Ein return brauchst du nicht, denn das Array wird direkt geändert.
lösung: uebergabe-bonus-loesung.visustruct
unterprogramm: uebergabe-bonus-unterprogramm-loesung.visustruct
:::

## Der Aussprung

Manchmal soll eine Schleife **vorzeitig** enden, mitten im Rumpf. Dafür gibt es den **Aussprung**. Er verlässt sofort die Schleife, in der er steht. Das Programm macht mit dem ersten Kasten nach der Schleife weiter. In Java, Python und JavaScript heißt das \`break\`.

Den Aussprung erkennst du an der Spitze am linken Rand. In den Kasten kannst du einen kurzen Kommentar schreiben, z. B. \`Schleife verlassen\`. Er erscheint im Code als Kommentar hinter \`break\`.

Ein Aussprung steht fast immer in einer **Verzweigung**: Nur wenn eine Bedingung zutrifft, wird die Schleife verlassen.

Typisch ist die **Endlosschleife mit Aussprung**. Die Schleife selbst hat keine Bedingung. Sie läuft so lange, bis der Aussprung erreicht wird:

::: diagramm l15-endlos-aussprung.visustruct
Die Schleife fragt immer wieder nach einer Zahl. Bei 0 springt sie heraus, sonst zählt sie die Zahl zur Summe.
:::

Ohne Aussprung würde eine Endlosschleife wirklich nie enden.

## Aussprung in der Simulation

Die Simulation führt den Aussprung aus wie \`break\`: Sie verlässt die innerste Schleife und macht nach ihr weiter. Steht ein Aussprung außerhalb jeder Schleife, endet das Unterprogramm, im Hauptprogramm das ganze Programm. Dasselbe macht \`return\`.

Oft geht es auch ganz ohne Aussprung: Du schreibst die Abbruchbedingung direkt in die Schleife. Das ist meist sogar übersichtlicher.

## Übung: Summe bis 0

::: übung l15-bis-null
titel: Summe bis 0
auftrag: Baue das Programm „Summe bis 0“ **ohne** Aussprung nach. Es fragt so lange nach ganzen Zahlen, bis jemand 0 eingibt. Danach gibt es **Summe:** und die Summe aller eingegebenen Zahlen aus.
test: 3, 4, 0 -> Summe: 7
test: 0 -> Summe: 0
test: 10, -2, 5, 0 -> Summe: 13
tipp: Ohne Aussprung muss die Bedingung der Schleife selbst prüfen, ob die 0 eingegeben wurde.
tipp: Frage die erste Zahl schon vor der Schleife ab. Die While-Schleife läuft mit der Bedingung \`zahl != 0\`. Im Rumpf zählst du die Zahl zur Summe und fragst danach die nächste Zahl ab. Bei der zweiten Eingabe schreibst du nur \`input: zahl "…"\`, weil es \`zahl\` schon gibt.
lösung: l15-bis-null-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann eine große Aufgabe in Teilprobleme zerlegen. → Große Aufgaben zerlegen
- Ich kann einen Aufruf einfügen und ein Unterprogramm in einem eigenen Reiter bauen. → Der Aufruf
- Ich kann einem Unterprogramm mit Parametern Werte übergeben. → Werte übergeben: Parameter
- Ich kann mit return einen Rückgabewert liefern und ihn beim Aufruf speichern. → Ergebnis zurückgeben: return
- Ich kann erklären, warum ein Unterprogramm eine Zahl nicht verändern kann, ein Array aber schon. → Kopie oder Original: call by value und call by reference
- Ich weiß, was ein Aussprung macht und warum er in einer Verzweigung steht. → Der Aussprung
- Ich kann eine Schleife mit einem Aussprung oder über ihre Bedingung beenden. → Aussprung in der Simulation
:::

## Wissenstest

::: quiz
? Was bedeutet ein Aufruf-Kasten mit dem Text \`zeigeErgebnis()\`?
- [ ] Das Programm endet hier.
- [x] Hier wird das Unterprogramm zeigeErgebnis() ausgeführt, danach geht es weiter.
- [ ] Hier wird das Wort zeigeErgebnis() ausgegeben.

? Wo geht es nach einem Aussprung weiter?
- [ ] Am Anfang der Schleife
- [x] Beim ersten Kasten nach der Schleife
- [ ] Ganz am Anfang des Programms
> Der Aussprung verlässt die Schleife, in der er steht. In Java, Python und JavaScript heißt er break.

? Warum steht ein Aussprung meistens in einer Verzweigung?
- [x] Damit die Schleife nur verlassen wird, wenn eine Bedingung zutrifft
- [ ] Weil ein Aussprung sonst nicht gespeichert werden kann
- [ ] Weil eine Verzweigung selbst eine Schleife ist
> Ohne Verzweigung würde die Schleife schon im ersten Durchlauf verlassen.

? Wo findet die Simulation das Unterprogramm zu einem Aufruf \`zeigeErgebnis()\`?
- [ ] Es muss im selben Struktogramm stehen.
- [x] In einem offenen Reiter mit dem Titel zeigeErgebnis()
- [ ] Die Simulation kann keine Unterprogramme ausführen.
> Baue jedes Unterprogramm in einem eigenen Reiter und gib ihm als Titel den Namen aus dem Aufruf.

? Das Unterprogramm hat die Kopfzeile \`void zeigeSumme(int a, int b)\`. Welcher Aufruf passt?
- [ ] zeigeSumme()
- [x] zeigeSumme(3, 4)
- [ ] int s = zeigeSumme(3, 4)
> Zwei Parameter brauchen zwei Werte. Und \`void\` heißt: Es kommt nichts zurück, das man speichern könnte.

? Nach \`int q = quadrat(5)\` steht in q die 25. Was steht im Unterprogramm quadrat am Ende?
- [ ] output: x * x
- [x] return x * x
- [ ] q = x * x
> Mit return gibt das Unterprogramm den Wert an den Aufruf zurück. Eine Ausgabe würde ihn nur anzeigen.

? \`void verdopple(int x)\` rechnet \`x = x * 2\`. Im Hauptprogramm steht \`int zahl = 5\` und dann der Aufruf \`verdopple(zahl)\`. Welchen Wert hat zahl danach?
- [x] 5
- [ ] 10
- [ ] 0
> Wertübergabe (call by value): verdopple hat nur eine Kopie von zahl verändert.

? \`void leeren(boolean[] plaetze)\` setzt alle Fächer auf false. Was gilt nach \`leeren(reihe)\` für das Array reihe im Hauptprogramm?
- [ ] Es ist unverändert, weil das Unterprogramm eine Kopie bekommt.
- [x] Alle Fächer sind false, weil plaetze und reihe dasselbe Array sind.
- [ ] Das Array ist gelöscht.
> Referenzübergabe (call by reference): Ein Array wird als Referenz übergeben. Änderungen an den Fächern sieht auch der Aufrufer.

? Wie heißt ein Unterprogramm in Java?
- [ ] Klasse
- [x] Methode
- [ ] Schleife
> In Java ist ein Unterprogramm eine Methode, zum Beispiel die \`main\`-Methode. Je nach Art sagt man auch Prozedur oder Funktion.

? Viele Bausteine haben in Schulbüchern einen zweiten Namen. Ordne jedem Begriff aus VisuStruct den anderen Namen zu.
= Verzweigung -> Bedingte Anweisung
= Fallauswahl -> Mehrfachauswahl
= Schleife -> Wiederholungsstruktur
= Array -> Feld
= Unterprogramm -> Methode
> Beide Namen meinen dasselbe. Wenn du einen davon kennst, verstehst du auch den anderen.
:::
`,Ir=`---
titel: Suchen und Sortieren
bereich: Grundlagen
kurz: Mit Spielkarten verstehen, wie lineare und binäre Suche und Bubblesort arbeiten und warum manche Verfahren viel schneller sind.
---

## Eine Karte suchen

Du hast einen Stapel Spielkarten verdeckt in einer Reihe vor dir liegen. Gesucht ist die 9. Was machst du? Du drehst eine Karte nach der anderen um, bis du die 9 findest oder alle Karten umgedreht hast.

::: grafik ss-lineare-suche.svg
Die Karten liegen durcheinander. Jede umgedrehte Karte ist ein Vergleich: Ist das die 9?
:::

Genau so arbeitet die **lineare Suche**: Sie geht das Array vom Index 0 bis zum Ende durch und vergleicht jedes Fach mit dem gesuchten Wert. Sie funktioniert immer, auch wenn die Werte durcheinander liegen.

Im Array stehen unsere Karten als Zahlen. Bube, Dame und König lassen wir weg.

::: diagramm ss-lineare-suche.visustruct
Die Schleife läuft, bis die Karte gefunden ist oder kein Fach mehr übrig ist. Die Variable vergleiche zählt mit, wie oft verglichen wurde. Suche in der Simulation die 2, die 27 und die 4.
:::

> Ist die Karte nicht dabei, bleibt \`position\` bei **-1**. Einen Index -1 gibt es nicht, darum bedeutet -1 hier „nicht gefunden“.

## Übung: Karte suchen

::: übung ss-karte-suchen
titel: Karte suchen
auftrag: Lege das Array \`int[] karten = {8, 4, 11, 4, 6}\` an und frage nach einer Karte. Gib die Position der **ersten** passenden Karte aus, z. B. \`Position: 1\` bei der 4. Ist die Karte nicht dabei, gib \`Nicht gefunden\` aus.
test: 4 -> Position: 1
test: 6 -> Position: 4
test: 8 -> Position: 0
test: 9 -> Nicht gefunden
braucht: whileSchleife, verzweigung
tipp: Gehe das Array von vorn nach hinten durch und vergleiche jede Karte mit der gesuchten.
tipp: Baue das Beispiel oben nach. Die Variable vergleiche brauchst du hier nicht. Die Schleife muss aufhören, sobald \`position\` nicht mehr -1 ist, sonst findest du bei der 4 die zweite statt der ersten.
lösung: ss-karte-suchen-loesung.visustruct
:::

## Binäre Suche: sortiert geht es schneller

Jetzt liegen die Karten **sortiert** vor dir, von klein nach groß. Gesucht ist die 27. Du drehst nicht mehr vorne die erste Karte um, sondern die **mittlere**:

- Ist sie die gesuchte, bist du fertig.
- Ist sie kleiner, kann die gesuchte Karte nur noch rechts liegen. Die ganze linke Hälfte fällt weg.
- Ist sie größer, fällt die rechte Hälfte weg.

Mit dem Rest machst du dasselbe noch einmal. Bei jedem Vergleich halbiert sich der Stapel.

::: grafik ss-binaere-suche.svg
Drei Vergleiche statt vierzehn: Mit jeder Mitte fällt die Hälfte der übrigen Karten weg.
:::

Im Struktogramm merken sich zwei Variablen den Bereich, in dem noch gesucht wird: \`links\` und \`rechts\`. Die Mitte ist \`(links + rechts) / 2\`. Weil das eine Ganzzahldivision ist, kommt immer ein ganzer Index heraus.

::: diagramm ss-binaere-suche.visustruct
Dasselbe Array wie bei der linearen Suche. Suche in der Simulation wieder die 27 und vergleiche die Ausgabe Vergleiche mit der linearen Suche.
:::

> Die binäre Suche funktioniert **nur bei sortierten Werten**. Bei durcheinander liegenden Karten weißt du nach dem Blick auf die Mitte nicht, in welcher Hälfte du weitersuchen musst.

::: angeberwissen
Ich denke mir eine Zahl von 1 bis 100, du darfst raten und ich sage nur „größer“ oder „kleiner“. Mit der binären Suche brauchst du höchstens **7** Versuche. Bei einer Zahl bis eine Million sind es höchstens 20, bei einer Milliarde 30. Jede Verdopplung kostet nur einen einzigen Versuch mehr. So suchen auch Datenbanken in Millionen von Einträgen in Sekundenbruchteilen. Ich suche übrigens linear: Ich fresse die Wiese von links nach rechts ab.
:::

## Wie schnell ist das?

Wie gut ein Verfahren ist, misst man an der Zahl der Vergleiche, die es **im schlimmsten Fall** braucht. Bei der linearen Suche ist das der Fall, dass die Karte ganz hinten liegt oder fehlt.

::: grafik ss-vergleiche.svg
Bei 100 Karten braucht die lineare Suche bis zu 100 Vergleiche, die binäre höchstens 7.
:::

| Anzahl Karten | Lineare Suche | Binäre Suche |
|---|---|---|
| 10 | 10 | 4 |
| 100 | 100 | 7 |
| 1 000 | 1 000 | 10 |
| 1 000 000 | 1 000 000 | 20 |

Die lineare Suche wächst im gleichen Maß wie die Kartenzahl. Bei der binären Suche kommt bei doppelt so vielen Karten nur **ein** Vergleich dazu.

## Sortieren mit Bubblesort

Für die binäre Suche müssen die Werte sortiert sein. Eines der einfachsten Sortierverfahren ist **Bubblesort**. Du gehst die Reihe von links nach rechts durch und vergleichst immer **zwei Nachbarn**. Steht die größere Karte links, tauschst du die beiden.

::: grafik ss-bubblesort.svg
Nach einem Durchgang steht die größte Karte ganz rechts.
:::

Nach dem ersten Durchgang steht die größte Karte ganz rechts, wie eine Luftblase, die nach oben steigt. Daher kommt der Name. Danach wiederholst du den Durchgang für die übrigen Karten. Bei 5 Karten brauchst du 4 Durchgänge.

Im Struktogramm stecken zwei For-Schleifen ineinander. Die äußere zählt die Durchgänge, die innere vergleicht die Nachbarn \`karten[i]\` und \`karten[i + 1]\`. Das Tauschen kennst du schon: Es braucht eine **Hilfsvariable**.

::: diagramm ss-bubblesort.visustruct
Die innere Schleife wird mit jedem Durchgang kürzer, weil rechts schon die größten Karten richtig stehen. Gehe es in der Simulation mit Schritt durch und beobachte das Array unter Variablen.
:::

Bubblesort ist leicht zu verstehen, aber langsam. Bei n Karten braucht es bis zu n · (n − 1) / 2 Vergleiche: bei 10 Karten 45, bei 100 Karten schon 4 950 und bei 1 000 Karten fast eine halbe Million. Schnellere Verfahren wie Quicksort lernst du vielleicht später kennen.

## Übung: Absteigend sortieren

::: übung ss-absteigend
titel: Absteigend sortieren
auftrag: Das Startdiagramm liest 5 Karten ein und sortiert sie mit Bubblesort **aufsteigend**, also von klein nach groß. Ändere es so, dass die Karten **absteigend** ausgegeben werden, die größte zuerst.
start: ss-absteigend-start.visustruct
test: 3, 1, 4, 1, 5 -> 5 | 4 | 3 | 1 | 1
test: 10, 20, 30, 40, 50 -> 50 | 40 | 30 | 20 | 10
test: 2, 9, 2, 7, 6 -> 9 | 7 | 6 | 2 | 2
braucht: forSchleife, verzweigung
tipp: Schau dir die Bedingung in der Verzweigung an. Sie entscheidet, wann zwei Nachbarn getauscht werden.
tipp: Du musst nur ein einziges Zeichen ändern. Wann sollen zwei Nachbarn getauscht werden, wenn die größere Karte nach links soll?
lösung: ss-absteigend-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann erklären, wie die lineare Suche ein Array durchsucht. → Eine Karte suchen
- Ich kann eine lineare Suche als Struktogramm bauen. → Übung: Karte suchen
- Ich weiß, warum die binäre Suche nur bei sortierten Werten funktioniert. → Binäre Suche: sortiert geht es schneller
- Ich kann begründen, warum die binäre Suche bei vielen Werten viel schneller ist. → Wie schnell ist das?
- Ich kann einen Durchgang von Bubblesort mit Spielkarten vormachen. → Sortieren mit Bubblesort
:::

## Wissenstest

::: quiz
? Welche Voraussetzung braucht die binäre Suche?
- [ ] Das Array muss genau 100 Fächer haben.
- [x] Die Werte müssen sortiert sein.
- [ ] Der gesuchte Wert muss vorkommen.
> Nur bei sortierten Werten weißt du nach dem Blick auf die Mitte, in welcher Hälfte du weitersuchst.

? Ein sortiertes Array hat 1 000 Werte. Wie viele Vergleiche braucht die binäre Suche höchstens?
- [ ] 500
- [ ] 100
- [x] 10
> 1 000 → 500 → 250 → 125 → 63 → 32 → 16 → 8 → 4 → 2 → 1: Nach etwa 10 Halbierungen bleibt ein Wert übrig.

? Was vergleicht Bubblesort in jedem Schritt?
- [ ] Die erste und die letzte Karte
- [x] Zwei benachbarte Karten
- [ ] Jede Karte mit der Mitte
> Steht die größere Karte links, werden die Nachbarn getauscht.

? Wo steht nach dem ersten Durchgang von Bubblesort die größte Karte?
- [ ] Ganz links
- [ ] In der Mitte
- [x] Ganz rechts
> Sie wird bei jedem Vergleich weitergetauscht und steigt wie eine Blase nach rechts.

? Was bedeutet \`position = -1\` in der linearen Suche?
- [x] Die Karte wurde (noch) nicht gefunden.
- [ ] Die Karte liegt ganz hinten.
- [ ] Das Array ist leer.

? Ordne jedem Verfahren die passende Beschreibung zu.
= Lineare Suche -> eine Karte nach der anderen ansehen
= Binäre Suche -> die Mitte ansehen und eine Hälfte weglassen
= Bubblesort -> Nachbarn vergleichen und tauschen
:::
`,yr=`---
titel: Java
bereich: Vom Struktogramm zum Code
kurz: Java-Code aus dem Struktogramm erzeugen, lesen und umgekehrt Java-Code als Struktogramm nachbauen.
---

## Die Code-Ansicht

Ein Struktogramm beschreibt einen Ablauf. Damit ein Computer ihn ausführt, brauchst du ein Programm in einer Programmiersprache. VisuStruct schreibt diesen Code für dich.

Klicke in der Leiste auf [{ } Code](#zeige-code). Rechts erscheint der **Code-Generator**:

- Oben wählst du die Sprache: **Java**, **Python** oder **JavaScript**.
- Bei Java wählst du zusätzlich **Snippet** (nur die Anweisungen) oder **Class** (eine vollständige Java-Datei).
- **Diagramm-Text als Kommentare** schreibt den Text jedes Kastens als Kommentar über den Code.
- **Kopieren** legt den Code in die Zwischenablage, **Java speichern …** speichert eine \`.java\`-Datei.

Der Code ändert sich sofort mit, wenn du am Struktogramm etwas änderst.

::: angeberwissen
Nassi hat später an der Programmiersprache Ada mitgearbeitet und war bei Apple für Software zuständig. Wer Struktogramme erfindet, landet also nicht im Ziegenstall, sondern bei Apple.
:::

::: diagramm l17-beispiel.visustruct
Ein kleines Programm mit Eingabe, For-Schleife und Verzweigung. Öffne es und schau dir den Java-Code dazu an.
:::

## So sieht das Beispiel in Java aus

Für das Diagramm oben erzeugt VisuStruct als **Snippet** diesen Code:

\`\`\`
// import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Welche Reihe?");
int zahl = scanner.nextInt();
for (int i = 1; i <= 3; i++) {
    int ergebnis = zahl * i;
    System.out.println(i + " mal " + zahl + " = " + ergebnis);
}
if (zahl > 10) {
    System.out.println("Das war schwer!");
} else {
    System.out.println("Das war leicht.");
}
\`\`\`

Jede Anweisung endet in Java mit einem **Semikolon** \`;\`. Was in einem Kasten steht, steht in Java in **geschweiften Klammern** \`{ }\`. Die Einrückung zeigt dir, was zusammengehört.

## Die Elemente in Java

- **Anweisung:** \`int summe = 0\` wird zu \`int summe = 0;\`
- **Ausgabe:** \`output: summe\` wird zu \`System.out.println(summe);\`
- **Eingabe:** \`input: int zahl "Zahl?"\` wird zu zwei Zeilen: \`System.out.println("Zahl?");\` und \`int zahl = scanner.nextInt();\`. Für den \`Scanner\` steht oben einmal \`Scanner scanner = new Scanner(System.in);\`.
- **Verzweigung:** \`if (bedingung) { … } else { … }\`
- **Fallauswahl:** \`switch (wert) { case 1 -> { … } default -> { … } }\`
- **While-Schleife:** \`while (bedingung) { … }\`
- **Do-while-Schleife:** \`do { … } while (bedingung);\`
- **For-Schleife:** \`for (int i = 0; i < 5; i++) { … }\`, die drei Felder stehen mit Semikolon nacheinander in der Klammer.
- **Endlosschleife:** \`while (true) { … }\`
- **Aussprung:** \`break;\`
- **Aufruf:** \`berechne();\`

Ist der Nein-Zweig einer Verzweigung leer, erzeugt VisuStruct trotzdem einen \`else\`-Teil, in dem nur der Kommentar \`// empty element\` steht. Wenn du **Leeren else-Zweig im Code ausgeben** ausschaltest, fällt der leere \`else\`-Teil weg.

## Snippet oder Class

Ein **Snippet** kannst du in ein vorhandenes Java-Programm in die \`main\`-Methode einfügen. Mit **Class** bekommst du eine vollständige Datei, die du sofort übersetzen und starten kannst:

\`\`\`
import java.util.Scanner;

public class Einmaleins {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Welche Reihe?");
        int zahl = scanner.nextInt();
        ...
    }
}
\`\`\`

Der Name der Klasse kommt aus dem **Titel** des Diagramms. Die Datei muss genauso heißen, hier also \`Einmaleins.java\`. Das erledigt **Java speichern …** für dich.

> Der erzeugte Code ist ein guter Anfang, aber prüfe ihn. Legst du eine Variable zuerst an und liest sie später mit einer Eingabe neu ein, schreibt VisuStruct trotzdem \`int pin = scanner.nextInt();\`. Java meldet dann, dass es \`pin\` schon gibt. Lösche in dieser Zeile einfach das \`int\`.

## Der Java-Sprachmodus

In der Leiste kannst du die Sprache der Oberfläche umstellen. Neben Deutsch, Englisch und vielen weiteren gibt es **Java (Keywords)**. Dann heißen die Bausteine im Bereich Elemente so wie die Befehle in Java: \`if\`, \`switch\`, \`for\`, \`while\`, \`do\`, \`while(true)\`, \`break\` und \`call\`. Die Oberfläche ist dann auf Englisch.

Das hilft dir, die Kästen und die Java-Befehle einander zuzuordnen. Dein Diagramm selbst bleibt dabei unverändert.

## Übung: Java als Struktogramm

Jetzt andersherum: Hier ist ein Stück Java-Code. Baue es als Struktogramm nach.

\`\`\`
System.out.println("Zahl eingeben");
int n = scanner.nextInt();
int fakultaet = 1;
for (int i = 1; i <= n; i++) {
    fakultaet = fakultaet * i;
}
System.out.println(fakultaet);
\`\`\`

::: übung l17-fakultaet
titel: Fakultät aus Java
auftrag: Baue den Java-Code oben als Struktogramm nach. Das Programm liest eine Zahl n ein und gibt das Produkt 1 · 2 · … · n aus.
  Kontrolliere am Ende in der Code-Ansicht, ob dein Java-Code genauso aussieht.
test: 3 -> 6
test: 5 -> 120
test: 1 -> 1
braucht: forSchleife
tipp: Lies den Java-Code Zeile für Zeile und überlege, welcher Kasten zu jeder Zeile passt.
tipp: Die beiden ersten Java-Zeilen sind zusammen eine einzige Eingabe: \`input: int n "Zahl eingeben"\`. Die For-Schleife hat die drei Felder \`int i = 1\`, \`i <= n\` und \`i++\`.
lösung: l17-fakultaet-loesung.visustruct
:::

## Übung: else if

In Java schreibt man mehrere Fälle oft als \`else if\`:

\`\`\`
if (alter < 6) {
    System.out.println("Eintritt frei");
} else if (alter < 18) {
    System.out.println("Kinderticket: 4 Euro");
} else {
    System.out.println("Erwachsenenticket: 8 Euro");
}
\`\`\`

Im Struktogramm gibt es kein \`else if\`. Dort steckt eine zweite Verzweigung im Nein-Zweig der ersten. Steht im Nein-Zweig nur diese eine Verzweigung, macht VisuStruct beim Erzeugen des Codes daraus wieder \`else if\`, in Python \`elif\`.

::: übung l17-ticket
titel: Ticketpreis
auftrag: Frage nach dem Alter als ganze Zahl und baue den Java-Code oben als Struktogramm nach.
test: 5 -> Eintritt frei
test: 6 -> Kinderticket: 4 Euro
test: 17 -> Kinderticket: 4 Euro
test: 18 -> Erwachsenenticket: 8 Euro
braucht: verzweigung
tipp: Im Java-Code steckt in einem \`else\` ein weiteres \`if\`. Im Struktogramm ist das eine Verzweigung in einem Zweig.
tipp: Ziehe in den false-Zweig der ersten Verzweigung eine zweite Verzweigung mit der Bedingung \`alter < 18\`.
lösung: l17-ticket-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann die Code-Ansicht öffnen und Java als Sprache wählen. → Die Code-Ansicht
- Ich weiß, wie Ausgabe, Eingabe, Verzweigung und Schleifen in Java aussehen. → Die Elemente in Java
- Ich kenne den Unterschied zwischen Snippet und Class. → Snippet oder Class
- Ich kann ein kurzes Java-Programm als Struktogramm nachbauen. → Übung: Java als Struktogramm
:::

## Wissenstest

::: quiz
? Wie sieht \`output: "Hallo"\` in Java aus?
- [ ] print("Hallo")
- [x] System.out.println("Hallo");
- [ ] console.log("Hallo");
> print ist Python, console.log ist JavaScript.

? Woher kommt der Klassenname bei Class?
- [ ] Er heißt immer Main.
- [x] Aus dem Titel des Diagramms
- [ ] Aus dem ersten Kasten
> Ohne Titel heißt die Klasse Main.

? Welcher Java-Code gehört zu einer Do-while-Schleife?
- [ ] while (bedingung) { … }
- [x] do { … } while (bedingung);
- [ ] for (;;) { … }
> Bei do-while steht die Bedingung am Ende, deshalb läuft der Rumpf mindestens einmal.

? Was wird aus einem Aussprung im Java-Code?
- [x] break;
- [ ] return;
- [ ] exit();
:::
`,zr=`---
titel: Python und JavaScript
bereich: Vom Struktogramm zum Code
kurz: Python- und JavaScript-Code aus dem Struktogramm erzeugen und JavaScript direkt im Browser ausführen.
---

## Dasselbe Diagramm, drei Sprachen

In der Code-Ansicht (**{ } Code** in der Leiste) wählst du oben die Sprache. Das Struktogramm bleibt gleich, nur die Schreibweise ändert sich. So kannst du die Sprachen gut vergleichen.

::: diagramm l18-beispiel.visustruct
Eine Zahl wird so lange um 3 verkleinert, bis sie nicht mehr größer als 0 ist.
:::

## Python

Für das Diagramm oben erzeugt VisuStruct diesen Python-Code:

\`\`\`
zahl = int(input("Startwert?"))
while zahl > 0:
    print(zahl)
    zahl = zahl - 3
print("Ende")
\`\`\`

Was in Python anders ist als in Java:

- Es gibt **keine Semikolons** und **keine geschweiften Klammern**. Was zu einer Schleife oder Verzweigung gehört, erkennt Python allein an der **Einrückung**. Hinter \`while\`, \`if\` und \`else\` steht ein Doppelpunkt.
- Variablen bekommen **keinen Datentyp**: aus \`int zahl = 5\` wird \`zahl = 5\`.
- Die Ausgabe heißt \`print(…)\`, die Eingabe \`input(…)\`. Für eine Zahl steht \`int(…)\` darum herum.
- Arrays heißen in Python **Listen**: aus \`int[] zahlen = {2, 4, 6}\` wird \`zahlen = [2, 4, 6]\`, und aus \`zahlen.length\` wird \`len(zahlen)\`.
- Eine einfache For-Schleife wie \`int i = 0\`, \`i < 5\`, \`i++\` wird zu \`for i in range(5):\`.

## Worauf du bei Python achten musst

Python ist an einigen Stellen strenger als Java. VisuStruct übersetzt die Java-Schreibweise beim Export deshalb gleich mit:

- **Text und Zahl mit +:** \`"Summe: " + summe\` wird zu \`"Summe: " + str(summe)\`. Ohne \`str(…)\` bricht Python ab.
- **i++ gibt es nicht:** daraus wird \`i += 1\`.
- **&&, || und !** heißen in Python \`and\`, \`or\` und \`not\`, \`true\` und \`false\` werden zu \`True\` und \`False\`.
- **Ganzzahlige Division:** In Python ergibt \`7 / 2\` immer 3.5. Teilt das Struktogramm zwei \`int\`-Werte, schreibt VisuStruct deshalb \`7 // 2\`, das ergibt wie in Java 3.
- **For-Schleifen:** Zählschleifen werden zu \`for … in range(…)\`, auch mit \`i <= n\`, Rückwärtszählen oder Schritten wie \`i = i + 2\`. Passt eine Schleife nicht dazu, wird daraus eine \`while\`-Schleife.
- **do-while gibt es nicht:** daraus wird \`while True:\` mit \`if not (…): break\` am Ende.

Ist ein Diagramm als **Pseudocode** markiert, steht nur ein Hinweis über dem Code. Dann ist der Text eine Skizze und kein lauffähiges Programm.

## JavaScript

Dasselbe Diagramm in JavaScript:

\`\`\`
"use strict";

let zahl = parseInt((prompt("Startwert?") ?? "0"), 10);
while (zahl > 0) {
    console.log(zahl);
    zahl = zahl - 3;
}
console.log("Ende");
\`\`\`

JavaScript sieht Java ähnlich: geschweifte Klammern, Semikolons, \`while (…)\` und \`if (…)\`. Die Unterschiede:

- Variablen werden mit \`let\` angelegt, ohne Datentyp. Konstanten mit \`const\`.
- Die Ausgabe heißt \`console.log(…)\`, die Eingabe \`prompt(…)\`. Mit \`parseInt(…)\` wird aus der Eingabe eine ganze Zahl.
- Arrays stehen in eckigen Klammern: \`let zahlen = [2, 4, 6];\`.
- \`"use strict";\` ganz oben sorgt dafür, dass JavaScript bei Tippfehlern in Variablennamen meckert.
- JavaScript kennt nur einen Zahlentyp. Teilt das Struktogramm zwei \`int\`-Werte, schreibt VisuStruct \`Math.trunc(a / b)\`. Dann fallen die Nachkommastellen wie in Java weg.

## JavaScript im Browser ausführen

JavaScript ist die Sprache der Browser. Deshalb kann VisuStruct den Code **sofort ausführen**:

::: angeberwissen
Warum sind Links im Browser eigentlich blau? Ben Shneidermans Team hat 1985 untersucht, welche Farbe man gut sieht und die beim Lesen nicht stört. Gewonnen hat Hellblau. Rot fiel zwar mehr auf, aber man konnte sich den Text danach schlechter merken. [Mehr Angeberwissen](https://visustruct.org/de/angeberwissen.html)
:::

1. Wähle in der Code-Ansicht **JavaScript**.
2. Klicke auf **Im Browser testen**.
3. Unter **Ausgabe** erscheint, was \`console.log\` ausgibt. Fragt das Programm mit \`prompt\` nach einem Wert, tippst du ihn ein und klickst auf **OK**.
4. Mit **Stopp** brichst du das Programm ab.

Eine Endlosschleife \`while (true)\` hält VisuStruct nach 100 000 Durchläufen von selbst an und meldet **Ausführung gestoppt: mögliche Endlosschleife.**

> Ein **Aufruf** braucht im JavaScript-Code ein Unterprogramm mit diesem Namen, sonst meldet JavaScript einen Fehler. Anders als die Simulation sucht der Browser nicht in den anderen Reitern.

## Übung: Python als Struktogramm

Dieses Python-Programm gibt alle geraden Zahlen von 0 bis zu einer Grenze aus:

\`\`\`
grenze = int(input("Bis wohin?"))
for i in range(0, grenze + 1, 2):
    print(i)
\`\`\`

\`range(0, grenze + 1, 2)\` heißt: bei 0 anfangen, vor \`grenze + 1\` aufhören, in Zweierschritten zählen.

::: übung l18-python
titel: Gerade Zahlen
auftrag: Baue das Python-Programm oben als Struktogramm mit einer For-Schleife nach. Bei der Grenze 7 gibt es 0, 2, 4 und 6 aus.
test: 7 -> 0 | 2 | 4 | 6
test: 4 -> 0 | 2 | 4
test: 0 -> 0
braucht: forSchleife
tipp: \`range(0, grenze + 1, 2)\` zählt von 0 bis zur Grenze in Zweierschritten. Das ist eine For-Schleife.
tipp: Die drei Felder der For-Schleife sind \`int i = 0\`, \`i <= grenze\` und \`i = i + 2\`.
lösung: l18-python-loesung.visustruct
:::

## Übung: JavaScript als Struktogramm

\`\`\`
let alter = parseInt((prompt("Wie alt bist du?") ?? "0"), 10);
if (alter >= 16) {
    console.log("Du darfst wählen.");
} else {
    let jahre = 16 - alter;
    console.log("Noch " + jahre + " Jahre warten.");
}
\`\`\`

::: übung l18-js
titel: Wählen ab 16
auftrag: Baue den JavaScript-Code oben als Struktogramm nach. Teste danach in der Code-Ansicht mit **JavaScript** und **Im Browser testen**, ob dein Code dasselbe ausgibt wie die Simulation.
test: 12 -> Noch 4 Jahre warten.
test: 16 -> Du darfst wählen.
test: 13 -> Noch 3 Jahre warten.
test: 40 -> Du darfst wählen.
braucht: verzweigung
tipp: Lies den Code Zeile für Zeile. \`if\` und \`else\` werden zu einer Verzweigung.
tipp: \`prompt\` und \`parseInt\` sind zusammen eine Eingabe: \`input: int alter "Wie alt bist du?"\`. Im false-Zweig stehen zwei Kästen: erst \`int jahre = 16 - alter\`, dann die Ausgabe.
lösung: l18-js-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann Python und JavaScript in der Code-Ansicht auswählen und vergleichen. → Dasselbe Diagramm, drei Sprachen
- Ich weiß, dass Python Blöcke durch Einrückung bildet und keine Datentypen braucht. → Python
- Ich weiß, was VisuStruct beim Übersetzen nach Python anpasst. → Worauf du bei Python achten musst
- Ich kann JavaScript mit Im Browser testen ausführen. → JavaScript im Browser ausführen
:::

## Wissenstest

::: quiz
? Woran erkennt Python, welche Zeilen zu einer Schleife gehören?
- [ ] An den geschweiften Klammern
- [x] An der Einrückung
- [ ] Am Semikolon am Zeilenende

? Wie heißt \`output: summe\` in JavaScript?
- [ ] print(summe)
- [ ] System.out.println(summe);
- [x] console.log(summe);

? Welche Sprache kann VisuStruct direkt im Browser ausführen?
- [ ] Java
- [ ] Python
- [x] JavaScript
> Jeder Browser kann JavaScript ausführen. Für Java und Python brauchst du ein eigenes Programm.

? Was passiert in Python bei \`print("Summe: " + summe)\`, wenn summe die Zahl 7 ist?
- [ ] Es wird Summe: 7 ausgegeben.
- [x] Python meldet einen Fehler, weil Text und Zahl nicht mit + verbunden werden können.
- [ ] Es wird Summe: ausgegeben.
> Mit str(summe) wird aus der Zahl ein Text.
:::
`,wr=`Fachbegriffe für den Lernbereich. Kommt ein Begriff in einem Schritt vor, wird er dort einmal markiert und zeigt beim
Hovern oder Antippen seine Erklärung. Steht er im Schritt fett, wird er gerade erklärt und deshalb nicht markiert.
\`auch:\` nennt weitere Formen, die ebenfalls erkannt werden. Groß- und Kleinschreibung zählt.

### Algorithmus
auch: Algorithmen
Eine genaue Schritt-für-Schritt-Anleitung, mit der man eine Aufgabe löst. Jeder Schritt ist eindeutig.

### Struktogramm
auch: Struktogramme, Struktogramms, Struktogrammen
Ein Algorithmus als Bild aus Kästen. Es wird von oben nach unten gelesen.

### Programmablaufplan
auch: PAP, Programmablaufpläne, Programmablaufplans
Ein Algorithmus als Bild aus Symbolen, die mit Pfeilen verbunden sind (DIN 66001). Eine Raute ist eine Verzweigung.

### Pseudocode
Ein Algorithmus als Text in normaler Sprache mit festen Wörtern wie WENN und SOLANGE. Die Einrückung zeigt, was zusammengehört.

### Anweisung
auch: Anweisungen
Ein einzelner Schritt im Struktogramm, zum Beispiel eine Rechnung, eine Eingabe oder eine Ausgabe.

### Sequenz
auch: Sequenzen
Schritte, die nacheinander von oben nach unten ausgeführt werden, jeder genau einmal.

### Verzweigung
auch: Verzweigungen, bedingte Anweisung, bedingte Anweisungen
Ein Baustein, der mit einer Bedingung entscheidet, welcher von zwei Wegen ausgeführt wird. Im Lehrplan heißt sie auch bedingte Anweisung.

### Zweig
auch: Zweige, Zweigen
Einer der beiden Wege einer Verzweigung: links für true, rechts für false.

### Schleife
auch: Schleifen, Wiederholung, Wiederholungen, Wiederholungsstruktur, Wiederholungsstrukturen
Ein Baustein, der Schritte wiederholt, solange eine Bedingung gilt. Im Lehrplan heißt sie auch Wiederholungsstruktur.

### Rumpf
Der Inhalt einer Schleife, also die Schritte, die wiederholt werden.

### Durchlauf
auch: Durchläufe, Durchlaufs, Durchläufen
Ein einmaliges Ausführen des Inhalts einer Schleife.

### Bedingung
auch: Bedingungen
Eine Frage, die nur mit ja (true) oder nein (false) beantwortet wird, zum Beispiel alter >= 18.

### Platzhalter
Ein leerer Kasten mit dem Zeichen ø. Ziehst du ein Element darauf, wird er ersetzt.

### Objektinspektor
Der Bereich unter dem Diagramm. Hier bearbeitest du Text und Einstellungen des Kastens, den du gerade angeklickt hast.

### Simulation
Führt dein Struktogramm im Editor aus, auf Wunsch Schritt für Schritt. So siehst du, was passiert.

### Variable
auch: Variablen
Eine beschriftete Kiste für einen Wert. Sie hat einen Namen, einen Datentyp und einen Wert.

### Konstante
auch: Konstanten
Eine Variable, deren Wert nach dem Festlegen gleich bleibt. Man schreibt \`const\` davor, z. B. \`const double MWST = 0.19\`.

### Datentyp
auch: Datentypen, Datentyps
Legt fest, welche Art von Wert in eine Variable passt: int (ganze Zahl), double (Kommazahl), String (Text) oder boolean (true oder false).

### Zuweisung
auch: Zuweisungen
Das Zeichen =. Es rechnet die rechte Seite aus und speichert das Ergebnis in der Variablen links.

### Hilfsvariable
auch: Hilfsvariablen
Eine zusätzliche Variable, die einen Wert kurz aufbewahrt, zum Beispiel beim Tauschen.

### EVA-Prinzip
Eingabe, Verarbeitung, Ausgabe: erst Werte abfragen, dann rechnen, dann das Ergebnis anzeigen.

### Problemanalyse
Du liest eine Aufgabe genau und klärst, was gegeben ist, was gesucht ist und wie man vom einen zum anderen kommt.

### Vergleichsoperator
auch: Vergleichsoperatoren
Ein Zeichen, das zwei Werte vergleicht, zum Beispiel == oder <. Das Ergebnis ist true oder false.

### Fallauswahl
auch: Mehrfachauswahl
Ein Baustein, der je nach Wert einer Variablen genau einen von mehreren Fällen ausführt. Im Lehrplan heißt sie auch Mehrfachauswahl.

### kopfgesteuert
auch: kopfgesteuerte, kopfgesteuerten
Die Schleife prüft ihre Bedingung vor jedem Durchlauf. Ist sie gleich zu Beginn falsch, läuft die Schleife kein einziges Mal.

### fußgesteuert
auch: fußgesteuerte, fußgesteuerten
Die Schleife prüft ihre Bedingung erst nach jedem Durchlauf. Sie läuft also mindestens einmal.

### Zählvariable
auch: Zählvariablen
Eine Variable, die in einer Schleife mitzählt, meistens i.

### Endlosschleife
auch: Endlosschleifen
Eine Schleife, deren Bedingung nie falsch wird. Sie hört nie von selbst auf.

### Array
auch: Arrays
Eine Reihe von Fächern mit einem gemeinsamen Namen und demselben Datentyp. Im Lehrplan heißt es auch Feld.

### Index
Die Nummer eines Fachs in einem Array. Gezählt wird ab 0.

### Zeichenkette
auch: Zeichenketten
Ein Text, also eine Reihe von Zeichen. In Java heißt der Datentyp String. Die Zeichen werden ab 0 gezählt.

### 2D-Array
auch: 2D-Arrays, zweidimensionales Array, zweidimensionale Arrays
Ein Array mit Zeilen und Spalten, wie eine Tabelle. Ein Fach braucht zwei Indizes, z. B. \`sitze[1][2]\`.

### Unterprogramm
auch: Unterprogramme, Unterprogramms, Unterprogrammen, Methode, Methoden, Prozedur, Prozeduren, Funktion, Funktionen
Ein eigenes Struktogramm für eine Teilaufgabe. Es wird mit einem Aufruf ausgeführt. Im Lehrplan und in Java heißt es auch Methode, je nach Art auch Prozedur oder Funktion.

### Parameter
auch: Parametern
Eine Variable in der Kopfzeile eines Unterprogramms. Beim Aufruf bekommt sie den Wert aus den Klammern.

### Spaghetticode
Ein Programm, das so kreuz und quer springt, dass man den Ablauf kaum noch verfolgen kann. Struktogramme verhindern das.

### Wertübergabe
auch: call by value
Englisch call by value. Ein Unterprogramm bekommt eine Kopie des Werts. Ändert es seinen Parameter, bleibt die Variable des Aufrufers unverändert.

### Referenzübergabe
auch: call by reference
Englisch call by reference. Ein Unterprogramm bekommt einen Verweis auf dieselben Daten, z. B. auf ein Array. Ändert es ein Fach, sieht auch der Aufrufer die Änderung.

### Rückgabewert
auch: Rückgabewerte
Das Ergebnis, das ein Unterprogramm mit return an den Aufruf zurückgibt.

### Aussprung
Verlässt sofort die Schleife, in der er steht. Danach geht es unter der Schleife weiter.

### Schreibtischtest
auch: Schreibtischtests
Du führst ein Struktogramm auf Papier aus und notierst nach jedem Schritt die Werte der Variablen.

### lineare Suche
auch: Lineare Suche
Ein Suchverfahren, das alle Werte der Reihe nach mit dem gesuchten Wert vergleicht. Es funktioniert auch bei unsortierten Werten.

### binäre Suche
auch: Binäre Suche
Ein Suchverfahren für sortierte Werte. Es sieht sich die Mitte an und sucht nur in der passenden Hälfte weiter.

### Bubblesort
Ein einfaches Sortierverfahren. Es vergleicht immer zwei Nachbarn und tauscht sie, wenn sie falsch herum stehen.
`,vr=`### Anweisung

Ein einzelner Schritt. Damit legst du Variablen an oder rechnest.

\`\`\`
int zahl = 5
double preis = 2.5
String name = "Ada"
zahl = zahl + 1
\`\`\`

### Eingabe

Fragt beim Ausführen einen Wert ab und speichert ihn in einer Variablen. Der Text in Anführungszeichen ist die Frage.

\`\`\`
input: int alter "Wie alt bist du?"
input: double preis "Preis eingeben"
input: String name "Wie heißt du?"
\`\`\`

### Ausgabe

Zeigt einen Text oder einen Wert an. Texte stehen in Anführungszeichen, mit \`+\` verbindest du Text und Variablen.

\`\`\`
output: "Hallo"
output: summe
output: "Du bist " + alter + " Jahre alt."
\`\`\`

> In der Ausgabe hängt \`+\` die Teile immer aneinander: \`output: a + b\` zeigt bei 3 und 4 also 34. Rechne deshalb vorher in einer Variablen, z. B. \`int summe = a + b\`, und gib dann \`summe\` aus.

### Verzweigung

Prüft eine Bedingung. Ist sie wahr, wird der linke Zweig (true) ausgeführt, sonst der rechte (false).

\`\`\`
alter >= 18
zahl % 2 == 0
note < 1 || note > 6
\`\`\`

### Fallauswahl

Wählt je nach Wert einer Variablen einen von mehreren Fällen. Passt kein Fall, gilt \`default\`. Fälle fügst du rechts mit **Weiteren Fall hinzufügen** hinzu.

### While-Schleife

Wiederholt den Inhalt, **solange** die Bedingung wahr ist. Die Bedingung wird vor jedem Durchlauf geprüft.

\`\`\`
zahl != 1
i < 10
\`\`\`

### Do-while-Schleife

Führt den Inhalt **mindestens einmal** aus und prüft die Bedingung erst danach.

### For-Schleife

Zählt eine Variable von einem Startwert bis zu einer Grenze. Die drei Felder sind Start, Bedingung und Schritt.

\`\`\`
int i = 0
i < 5
i++
\`\`\`

### Endlosschleife

Wiederholt den Inhalt ohne Bedingung. Mit einem **Aussprung** im Inneren verlässt du sie.

### Aufruf

Steht für ein Unterprogramm, z. B. \`berechneSumme()\`. Mit Parametern und Rückgabewert hat das Unterprogramm eine Kopfzeile als Titel:

\`\`\`
int quadrat(int x)      Kopfzeile des Unterprogramms
return x * x            gibt das Ergebnis zurück
int q = quadrat(5)      Aufruf, q bekommt 25
zeigeSumme(3, 4)        Aufruf eines void-Unterprogramms
\`\`\`

### Aussprung

Verlässt die umgebende Schleife (\`break\`).

### Rechenzeichen und Vergleiche

- \`+ - * /\` Grundrechenarten
- \`%\` Rest beim Teilen (\`7 % 2\` ist 1)
- \`==\` gleich, \`!=\` ungleich
- \`<\` \`<=\` \`>\` \`>=\` kleiner, kleiner gleich, größer, größer gleich
- \`&&\` und, \`||\` oder

### Arrays

Mehrere Werte unter einem Namen. Gezählt wird ab 0.

\`\`\`
int[] zahlen = {3, 7, 1}
output: zahlen[0]
int[] leer = new int[5]
\`\`\`

Ein **2D-Array** ist eine Tabelle mit Zeilen und Spalten:

\`\`\`
boolean[][] sitze = new boolean[3][5]
sitze[1][4] = true
output: sitze.length + " Reihen, " + sitze[0].length + " Plätze"
\`\`\`
`,kr=`---
titel: What is a structure chart?
bereich: First steps
kurz: Show and read algorithms as a series of clear steps.
---

## An algorithm is an exact set of instructions

An **algorithm** describes step by step how to solve a task. Every step must be so clear that someone can carry it out without asking, a person just as well as a computer.

You know algorithms from everyday life: a recipe, directions to a place or the instructions for building a wardrobe.

::: diagramm l1-tee.visustruct
Making tea as a structure chart: every box is one step.
:::

## How to read a structure chart

You read a structure chart **from top to bottom**. Every box is one step. Only when a step is finished does the next one start.

This way of drawing was invented by **Isaac Nassi and Ben Shneiderman** (1973). That is why it is also called a Nassi-Shneiderman diagram. In Germany it is standardised as DIN 66261.

::: bild ike-nassi.jpg ben-shneiderman.jpg
Left: Isaac “Ike” Nassi (photo: [Ed Schipul](https://commons.wikimedia.org/wiki/File:Me_with_Ike_Nassi!!!!!_%286893328729%29.jpg), [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/), cropped), right: Ben Shneiderman (photo: [Robert Kosara](https://commons.wikimedia.org/wiki/File:Ben_Shneiderman_at_UNCC_%283x4_cropped%29.jpg), CC0).
:::

> A structure chart always has exactly one start (at the top) and one end (at the bottom). There are no arrows and no jumps all over the place.

::: angeberwissen
Baaah, listen up! In 1972 Nassi and Shneiderman were still PhD students at Stony Brook University near New York. Shneiderman was about 25 and Nassi about 23. So basically two students who wrote computer science history on the side.
:::

## Building block 1: the sequence

Every algorithm can be built from just **three basic building blocks**: **sequence**, **branch** and **loop**. In this step and the next two you get to know them one by one.

The **sequence** is the simplest building block: several statements run **one after another**, each exactly once.

This is what it looks like:

- Every statement is a **simple rectangle**.
- The rectangles sit **on top of each other** without a gap.
- They run from top to bottom, one statement after the other.

::: diagramm l1-sequenz.visustruct
Four statements as a sequence. First you get up, then you brush your teeth, and so on.
:::

> The tea example above is a sequence, too.

::: angeberwissen
15 minutes! That is how long Shneiderman needed for the first sketch with sequence, branch and loop. I need longer than that to choose between hay and clover.
:::

## Building block 2: the branch

Often the next step depends on a **condition**. A condition is a question you can only answer with **yes or no**, for example *Is it raining?* In VisuStruct yes is **true** and no is **false**.

For decisions like this there is the **branch**. This is what it looks like:

- At the top, the condition sits in a **triangle**.
- Below it, the box splits into **two columns**: on the left the path for **true**, on the right the path for **false**.
- **Only one** of the two paths ever runs. After that, both paths continue together below the branch.

::: diagramm l1-verzweigung.visustruct
If it is raining, the left path runs, otherwise the right one. After that, both cases continue with “Leave”.
:::

> If nothing should happen in one case, that path stays empty. The sign **ø** shows this.

::: angeberwissen
Spelling alert! It is Shneiderman, with no c. Anyone who writes “Schneiderman” gets a gentle nudge from my horns. He himself points out that people keep sneaking a c into his name.
:::

## Building block 3: the loop

If something should happen **several times**, you do not write it down several times. Instead you use a **loop**, also called repetition.

This is what it looks like:

- At the top is the condition, for example *Plate not empty*.
- The steps that are repeated are **indented** below it. On the left, the box forms a **bracket** around them.
- Before every pass the condition is checked. As long as it is **true**, the steps inside the bracket run once more. If it is **false**, the program continues below the loop.

::: diagramm l1-wiederholung.visustruct
As long as the plate is not empty, you take a bite. After that, the plate is cleared.
:::

> There are more kinds of loops. You will meet them in later lessons.

## All three together

The building blocks become really useful when you combine them. This diagram contains all three: a sequence from top to bottom, a branch and a loop.

::: diagramm l1-grundbausteine.visustruct
You recognise the branch by its triangle and the loop by the bracket on the left. Everything together sits in a sequence.
:::

The boxes can also be **nested** inside each other: a loop or a path can contain sequences, branches and loops again.

::: angeberwissen
Comfort for anyone who has messed up a test: the famous journal *Communications of the ACM* rejected the structure chart article. According to Nassi, the reviewer even said they should collect every copy and burn it. Ouch! It then appeared in 1973 in a smaller journal and today it is quoted thousands of times. Ha! [More fun facts](https://visustruct.org/en/angeberwissen.html)
:::

## Other ways to draw it: flowchart and pseudocode

A structure chart is not the only way to write down an algorithm. You will meet two more in class. Here you see the same tea example as above in all three forms.

### Flowchart

A **flowchart** is made of symbols joined by **arrows**. It is standardised as DIN 66001 (ISO 5807). A diamond is a decision with the exits yes and no. You recognise a loop by an arrow that leads **back up**.

::: grafik l01-pap.svg
The tea example as a flowchart. The arrow from “Wait 1 minute” back up forms the loop.
:::

### Pseudocode

**Pseudocode** is text that looks like a program but is written in plain language. Fixed words such as IF and WHILE show the building blocks, and the **indentation** shows what belongs to them.

\`\`\`
Put a cup on the table
IF sugar wanted THEN
    Add sugar
END IF
WHILE tea still too hot
    Wait 1 minute
END WHILE
Drink the tea
\`\`\`

### Compared

- **Structure chart:** boxes inside boxes, the loop is a bracket on the left. You see the structure at a glance, and wild jumps are impossible.
- **Flowchart:** symbols with arrows, the loop is an arrow back up. Very easy to picture, but big charts quickly get confusing.
- **Pseudocode:** text with indentation, the loop sits between WHILE and END WHILE. Quick to write and already close to program code.

> All three describe the same algorithm. Once you can read one form, you learn the others quickly.

::: angeberwissen
Nassi and Shneiderman were out to get the arrows! Their 1973 article was called “Flowchart Techniques for Structured Programming”. With arrows you can jump all over the place until the chart looks like a plate of spaghetti. In a structure chart that is simply impossible. Baah, that is how I like it: tidy, like my stable.
:::

## Structure first, then code

When you program, two things happen at once: you have to think about the steps and pay attention to how the programming language is written. A structure chart lets you keep the two apart.

1. First you think about the **logic**: which steps, which conditions, which repetitions?
2. Then you translate the finished structure into **Java, Python or JavaScript**. VisuStruct can even generate the code for you.

With the **simulation** you can also run your structure chart step by step and check whether it really does what it should.

::: angeberwissen
Programs that jump all over the place are called **spaghetti code**: if you try to follow one thread, you get tangled up like in a plate of spaghetti. In the old days the culprit was the GOTO command, meaning “jump to line …”. So in 1968 the computer scientist Edsger Dijkstra wrote a famous letter: “Go To Statement Considered Harmful”. Since then, programs are built only from sequence, branch and loop. In Java, \`goto\` is still a reserved word today, but you are not allowed to use it. Baah, I would rather eat spaghetti than program it.
:::

## Checklist

::: checkliste
- I can explain what an algorithm is. → An algorithm is an exact set of instructions
- I know that a structure chart is read from top to bottom. → How to read a structure chart
- I know the three basic building blocks: sequence, branch and loop. → Building block 1: the sequence
- I can recognise every building block in a structure chart by its shape. → All three together
- I can also read a simple algorithm as a flowchart and as pseudocode. → Other ways to draw it: flowchart and pseudocode
:::

## Quiz

::: quiz
? In which direction do you read a structure chart?
- [ ] From left to right
- [x] From top to bottom
- [ ] From bottom to top
> Every box is one step, and the steps follow each other from top to bottom.

? Which building block is NOT one of the three basic building blocks?
- [ ] Sequence
- [ ] Branch
- [x] Jump
- [ ] Loop
> There are no jumps in a structure chart. Sequence, branch and loop are enough for every algorithm.

? How do you recognise a branch in a structure chart?
- [ ] By a bracket on the left side
- [x] By a triangle with the condition and two columns below it
- [ ] By several rectangles on top of each other
> The bracket belongs to the loop, and rectangles on top of each other are a sequence.

? When does the inside of a loop run once more?
- [x] As long as the condition is true
- [ ] Only if the condition is false
- [ ] Always exactly twice
> The condition is checked before every pass. If it is false, the program continues below the loop.

? What is an algorithm?
- [x] Clear step-by-step instructions for solving a task
- [ ] A particular program in Java
- [ ] A picture that explains a program
> An algorithm does not depend on a programming language. A structure chart is one way to write it down.

? How do you recognise a loop in a flowchart?
- [ ] By a bracket on the left side
- [x] By an arrow that leads back up
- [ ] By the word WHILE
> The bracket belongs to the structure chart, and WHILE to pseudocode.

? Match each flowchart symbol to its meaning.
= Oval -> Start or end
= Rectangle -> Statement
= Diamond -> Decision
= Parallelogram -> Input or output
> The diamond has two exits: yes and no.

? In pseudocode, what shows which lines belong to a loop?
- [ ] The colour
- [x] The indentation and the END WHILE
- [ ] An arrow
> Everything between WHILE and END WHILE is indented and is repeated.
:::
`,Sr=`---
titel: The editor
bereich: First steps
kurz: Insert elements, type text, move and delete.
---

## The screen

The editor has four areas. Move the mouse over a blue word or tap it, and that area lights up in the editor.

- **At the top, the [toolbar](#zeige-leiste):** New, Open, Save, Export, Undo, Copy and Paste, text size, Code and Simulation.
- **On the left, the [Elements](#zeige-elemente):** Here are all the building blocks you can drag into the structure chart. Some people also call this area the palette.
- **In the middle, the [structure chart](#zeige-struktogramm):** A new diagram contains only an empty placeholder, marked with **ø**.
- **At the bottom, the [Object Inspector](#zeige-objektinspektor):** Here you edit the text of the selected element.

> You can show and hide this learning area at any time with [Learn](#zeige-lernen) in the toolbar. It stays open next to the editor so you can try out right away what you read.

## Insert an element

Drag an element from the **Elements** area onto the structure chart. While you drag, a blue line shows where it will land:

- **Onto the placeholder ø:** The element replaces the placeholder.
- **Onto the top half of a box:** The element goes in front of it.
- **Onto the bottom half of a box:** The element goes after it.

::: grafik l02-einfuegen.svg
Where you drop it decides where the new element lands.
:::

You can also select an element in the Elements area with the keyboard and press **Enter**. Then it is inserted after the selected box.

::: angeberwissen
Grabbing boxes and dragging them around, just like you are doing now, has a fancy name: **direct manipulation**. Ben Shneiderman coined the term in 1982. Yes, the structure chart guy. That man worked harder than I do when I graze. [More about him](https://visustruct.org/en/angeberwissen.html)
:::

## Type text

Click a box. It gets a blue outline, and its text appears in the Object Inspector below the diagram. Whatever you type there shows up in the diagram straight away.

The box from the Elements area is called a **Statement**. At the top of the Object Inspector you choose what sort of statement it should be:

- **Statement:** calculate or set something, e.g. \`int number = 5\`. You will learn how in lesson 4.
- **Input:** ask for a value while the chart runs. That comes in lesson 6.
- **Output:** show something. In the diagram it then has \`output:\` in front, e.g. \`output: "Hello"\`.

To start with, you only need Output. Texts that should be shown exactly as they are go in **quotation marks**.

::: diagramm l2-ausgabe.visustruct
Two outputs one after the other. Open the diagram in the editor and start the simulation to see the output.
:::

## Move, copy, delete

- **Move:** Drag an existing box to a new place with the mouse.
- **Copy and paste:** Select a box, then press Ctrl+C and Ctrl+V (on a Mac ⌘C and ⌘V). The copy goes after the selected box.
- **Delete:** Select a box and press Del.
- **Undo:** Ctrl+Z undoes the last step, Ctrl+Shift+Z brings it back.

## Exercise: Hello World

::: übung l2-hallo
titel: Hello World
auftrag: Build a structure chart that outputs **Hello World**.
Drag a Statement onto the placeholder, set it to **Output** in the Object Inspector and type \`"Hello World"\`.
test: - -> Hello World
braucht: anweisung
tipp: You only need one single box. The text that should appear goes into the text field in the Object Inspector.
tipp: Watch out for the quotation marks. Without them, VisuStruct looks for a variable called Hello.
lösung: l2-hallo-loesung.visustruct
:::

Click **Check** when you are done. VisuStruct runs your structure chart and compares the output.

## Exercise: Two lines

::: übung l2-zwei-zeilen
titel: Two lines
auftrag: First output **Hello** and then **I am learning structure charts**, each on its own line.
test: - -> Hello | I am learning structure charts
tipp: Two lines means two outputs. The boxes sit on top of each other and run from top to bottom.
tipp: Every output is a box of its own. Drag the second Statement onto the bottom half of the first one.
lösung: l2-zwei-zeilen-loesung.visustruct
:::

## Checklist

::: checkliste
- I can insert an element from the Elements area and replace a placeholder. → Insert an element
- I can change the text of a box and switch between Statement, Input and Output. → Type text
- I can move, copy and delete boxes and undo steps. → Move, copy, delete
:::

## Quiz

::: quiz
? What does the sign ø in a box mean?
- [ ] The box contains a mistake.
- [x] There is still an empty placeholder here.
- [ ] The program ends here.
> A placeholder is replaced when you drag an element onto it.

? You drag a Statement onto the bottom half of a box. Where does it land?
- [ ] In front of it
- [x] After it
- [ ] The box is replaced.

? How do you output the text Good morning exactly as it is?
- [ ] output: Good morning
- [x] output: "Good morning"
- [ ] input: "Good morning"
> Without quotation marks, Good morning is understood as the name of a variable.
:::
`,Zr=`---
titel: Save, open, export
bereich: First steps
kurz: Keep your files safe, open several diagrams and share them as an image or PDF.
---

## The .visustruct file

Structure charts are saved as **.visustruct** files. All versions of VisuStruct use the same format: in the browser, on Mac, iPad and iPhone, and the Java app on the computer. So you can start in the browser at school and carry on in the app at home.

::: angeberwissen
When Nassi was a student, there were no files to save. There were punched cards. Nassi says a Saturday night date looked like this: his future wife sat with him in the computer centre and punched his cards. Romance, computer science style!
:::

## Save and open

- **[Save](#zeige-speichern)** (Ctrl+S): The diagram is saved as a file. Depending on the browser, it asks where to put it or puts the file in your downloads folder.
- **[Open](#zeige-oeffnen)** (Ctrl+O): Load a saved file again. You can also simply drag a file into the browser window.

> The browser remembers your exercises automatically. But that only works in this browser on this device. So always save important work as a file as well.

## Several diagrams in tabs

Above the structure chart you see the [tabs](#zeige-reiter). With **+** or [New](#zeige-neu) you open another, empty diagram. A dot • in front of the name shows that there are unsaved changes.

You type the [title](#zeige-titel) of a diagram into the field above the structure chart. It also appears when you export and is suggested as the file name.

## Share as an image or PDF

With [Export…](#zeige-exportieren) in the toolbar you can share your structure chart:

- **Image (PNG):** to put into a worksheet or a presentation
- **Vector graphic (SVG):** stays sharp at any size
- **PDF (A4):** one page to hand in or print
- **Print** (Ctrl+P): straight to the printer

With [Text](#zeige-textgroesse) in the toolbar you set the font size. Larger text also shows when you export an image.

## Try it out

Open one of your exercises from lesson 2 and try the following:

::: checkliste
- I have given the diagram a title. → Try it out
- I have saved the diagram as a .visustruct file and opened it again. → Save and open
- I have exported the diagram as an image (PNG) or PDF. → Share as an image or PDF
- I have opened a second diagram in a new tab. → Several diagrams in tabs
:::

## Quiz

::: quiz
? Which file can you open again in the Mac app and in the Java app?
- [x] The .visustruct file
- [ ] The exported PNG image
- [ ] The exported PDF
> Images and PDFs are only for looking at. You can only keep editing the .visustruct file.

? The browser remembers your exercises. Why should you still save?
- [ ] Because otherwise the exercises are not checked
- [x] Because the browser only keeps the data on this device and it can get lost
- [ ] Because you cannot export without saving
:::
`,Mr=`---
titel: Variables and data types
bereich: Basics
kurz: Store values, get to know the data types int, double, String and boolean, and calculate.
---

## What is a variable?

A **variable** is like a labelled box. It has a **name**, a **data type** and a **value**.

\`\`\`
int age = 14
\`\`\`

Here the variable is called \`age\`, its data type is \`int\` (whole number), and its value is 14. You can use the value again later through its name.

::: grafik l04-variable.svg
The variable as a box: the name on the label, the data type as a sticker, the value inside.
:::

> Variable names start with a letter and contain no spaces. Good names say what is inside: \`price\` is better than \`p\`.

## The four data types

The data type says what kind of value may be stored in the variable.

- **int:** whole numbers, e.g. \`int count = 3\` or \`int temperature = -5\`
- **double:** decimal numbers, e.g. \`double price = 2.5\`. You write a **point**, never a comma.
- **String:** text, e.g. \`String name = "Mia"\`. Text goes in quotation marks.
- **boolean:** truth values, only \`true\` or \`false\`

::: diagramm l05-datentypen.visustruct
Three variables with different data types. Open the diagram and start the simulation.
:::

You mostly meet truth values in **conditions**: \`age >= 18\` is either \`true\` or \`false\`. That is what lesson 8 is about. You can also store the result of a condition in a variable:

\`\`\`
int age = 15
boolean adult = age >= 18
\`\`\`

After that, \`adult\` holds the value \`false\`.

## Assignment with =

The sign \`=\` is called an **assignment**. It does not mean “equals” as in maths. It means: work out the right-hand side and store the result in the variable on the left.

\`\`\`
int points = 10
points = points + 5
\`\`\`

In maths the second line would be wrong, because no number equals itself plus 5. In programming you read it like this: take the old value 10, add 5 and store 15 in \`points\`. You only write the data type the first time, when the variable is created.

::: grafik l04-zuweisung.svg
First the right-hand side is calculated, then the result lands in the variable on the left.
:::

## Calculating

You can calculate with numbers:

- \`+\` plus, \`-\` minus, \`*\` times, \`/\` divided by
- \`%\` remainder of a division, e.g. \`17 % 5\` is 2

**Multiplication and division come before addition and subtraction**, and brackets are worked out first: \`2 * (3 + 4)\` is 14.

## Exercise: Rectangle

::: übung l05-rechteck
titel: Work out a rectangle
auftrag: A rectangle is 7 long and 4 wide. Create the variables \`length\` and \`width\`. Calculate the area and the perimeter in variables of their own and output both, like this:
\`Area: 28\` and on the next line \`Perimeter: 22\`.
test: - -> Area: 28 | Perimeter: 22
braucht: anweisung
tipp: First think about which variables you need: two for the measurements and two for the results. They are all whole numbers.
tipp: The area is length times width, the perimeter is 2 times (length plus width). For the output you write e.g. \`output: "Area: " + area\`. The \`+\` joins the text and the value of the variable together.
lösung: l05-rechteck-loesung.visustruct
:::

## Whole-number division

If you divide two whole numbers and store the result in an \`int\` variable, everything after the decimal point is dropped. It is **not rounded**.

\`\`\`
int x = 7 / 2      gives 3
int r = 7 % 2      gives 1 (the remainder)
double d = 7.0 / 2 gives 3.5
\`\`\`

With \`/\` and \`%\` together you can convert things nicely, for example minutes into hours and minutes:

::: diagramm l05-division.visustruct
135 minutes are 2 hours (135 / 60) with 15 minutes left over (135 % 60).
:::

## Exercise: Convert seconds

::: übung l05-sekunden
titel: Convert seconds
auftrag: 200 seconds should be output as minutes and seconds. The first and the last statement are already there. Insert statements between them that calculate \`minutes\` and \`remainder\`.
start: l05-sekunden-start.visustruct
test: - -> 3 minutes and 20 seconds
braucht: anweisung
tipp: How many whole minutes fit into 200 seconds, and how many seconds are left over? Work it out in your head first.
tipp: A minute has 60 seconds. Use \`/\` for the whole minutes and \`%\` for the remainder. Both variables have the type \`int\`.
lösung: l05-sekunden-loesung.visustruct
:::

## Exercise: Shopping

::: übung l05-einkauf
titel: Shopping
auftrag: You buy 3 exercise books at 2.5 euros each. Create \`count\` as an \`int\` and \`price\` as a \`double\`, calculate the total price in a variable \`total\` and output \`Total: 7.5 euros\`.
test: - -> Total: 7.5 euros
braucht: anweisung
tipp: The count times the price gives the total price. For each variable, think about whether it is a whole number or a decimal number.
tipp: The total price is a decimal number, so \`total\` needs the type \`double\`.
lösung: l05-einkauf-loesung.visustruct
:::

## Checklist

::: checkliste
- I can create a variable with a data type, a name and a value. → What is a variable?
- I know the data types int, double, String and boolean. → The four data types
- I know that = is an assignment and not a comparison. → Assignment with =
- I can calculate with + - * / % and know whole-number division. → Calculating
:::

## Quiz

::: quiz
? Which data type fits the value 3.75?
- [ ] int
- [x] double
- [ ] String
- [ ] boolean
> Decimal numbers have the type double. In VisuStruct you write them with a point.

? What value does x have after \`int x = 17 / 5\`?
- [ ] 3.4
- [x] 3
- [ ] 4
> With whole numbers, everything after the decimal point is dropped. It is not rounded.

? What does \`17 % 5\` give?
- [x] 2
- [ ] 3
- [ ] 3.4
> 17 divided by 5 is 3, remainder 2. The operator % gives the remainder.

? At the start, \`int points = 10\`. What is in points after \`points = points * 2\`?
- [ ] 10
- [ ] 12
- [x] 20
> The right-hand side is calculated with the old value 10, and the result 20 is stored in points.
:::
`,_r=`---
titel: Sequence
bereich: Basics
kurz: Run steps one after another, watch the order and swap values.
---

## Step by step

A **sequence** is a series of steps that run exactly once and in exactly this order. In the structure chart the boxes simply sit on top of each other.

Each box only starts when the box above it is finished. Nothing is skipped and nothing is repeated.

> The sequence is the simplest of the three basic building blocks. Almost every structure chart is mostly made of sequences.

## Order matters

When you make tea, you notice straight away if the order is wrong. With calculations it is just the same, only it is harder to spot.

::: diagramm l04-rechnen.visustruct
First double, then add 1: the result is 7. If you swap the two middle boxes, you get 8.
:::

The statement \`number = number * 2\` means: take the value of \`number\`, multiply it by 2 and store the result in \`number\` again. So what is in \`number\` depends on what happened before.

::: angeberwissen
Structure charts are not just school stuff. According to Shneiderman, companies like IBM and Siemens planned their programs with them too. So you are learning pro stuff here. Baaa-mazing!
:::

## Exercise: Put in order

::: übung l04-reihenfolge
titel: Put in order
auftrag: The start diagram has the right boxes, but in the wrong order. Move them so that **20** is output at the end.
start: l04-reihenfolge-start.visustruct
test: - -> 20
braucht: anweisung
tipp: Read each box and ask yourself: which variable does it need, and where does that variable get its value?
tipp: A variable has to be created before you calculate with it. The output comes right at the end. Check in your head: (2 + 3) · 4 = 20.
lösung: l04-reihenfolge-loesung.visustruct
:::

## Swap two values

Imagine two glasses: one with juice, one with water. If you want to swap what is in them, you need a third, empty glass.

It is exactly the same with variables. If you simply write \`a = b\` and then \`b = a\`, the old value of \`a\` is already lost. In the end both variables have the same value.

The solution is a **temporary variable** that keeps the old value for a short time:

::: grafik l05-tauschen.svg
Three steps with an empty glass: first the juice into temp, then the water to the left, then the juice from temp to the right.
:::

::: diagramm l04-tauschen.visustruct
First a is kept in temp. Then a gets the value of b, and b gets the kept value from temp.
:::

## Exercise: Swap glasses

::: übung l04-glaeser-tauschen
titel: Swap glasses
auftrag: The left glass holds juice, the right one water. Swap the contents of the variables \`left\` and \`right\` before they are output.
Do not change the first two boxes. Insert new statements between them instead.
start: l04-tauschen-start.visustruct
test: - -> Left: water | Right: juice
braucht: anweisung
tipp: How do you swap two full glasses in real life? You need a third, empty glass.
tipp: Create a temporary variable with \`String temp = left\`. After that you need two more assignments.
lösung: l04-tauschen-loesung.visustruct
:::

## Checklist

::: checkliste
- I know that a sequence runs from top to bottom. → Step by step
- I can explain why the order of the steps matters. → Order matters
- I can swap two values with a temporary variable. → Swap two values
:::

## Quiz

::: quiz
? How often does each box of a sequence run?
- [ ] Until a condition is false
- [x] Exactly once
- [ ] Not at all if it is empty
> In a sequence nothing is repeated and nothing is skipped. Loops are there for repetition.

? At the start a = 5 and b = 9. Then \`a = b\` runs and after that \`b = a\`. What is in the variables at the end?
- [ ] a = 9 and b = 5
- [x] a = 9 and b = 9
- [ ] a = 5 and b = 5
> After \`a = b\` the old value 5 is lost. \`b = a\` then only copies the 9 back.

? Why do you need a temporary variable when swapping?
- [x] So that a value is not overwritten before it is needed
- [ ] So that the structure chart gets longer
- [ ] Because otherwise you cannot output variables

? What does the sequence \`int x = 4\`, \`x = x + 1\`, \`x = x * 3\`, \`output: x\` output?
- [ ] 13
- [x] 15
- [ ] 4
> First x becomes 5, then 15.
:::
`,jr=`---
titel: Input and output
bereich: Basics
kurz: Ask for values, show results and use the IPO model.
---

## The IPO model

Many programs work in three parts:

1. **Input:** The program asks for values, e.g. two numbers.
2. **Process:** It calculates with the values.
3. **Output:** It shows the result.

The first letters give **IPO**. So far the values were fixed in the structure chart. With an input, a different value can be used every time the chart runs.

::: diagramm l06-eva.visustruct
Input at the top, process in the middle, output at the bottom. Start the simulation and try different numbers.
:::

## Input with input:

An input asks for a value while the chart runs and stores it in a variable. You write the **data type**, the **name** and a **question** in quotation marks:

\`\`\`
input: int age "How old are you?"
input: double price "Price in euros?"
input: String name "What is your name?"
\`\`\`

In the editor you choose the kind **Input** at the top of a Statement. The word \`input:\` is then already in front, and you only type \`int age "How old are you?"\`.

> The data type decides what may be typed in. With \`int\`, the simulation reports an error if someone types 2.5 or Hello.

## Output with output:

An output shows text and values. Text goes in quotation marks, variables do not. With \`+\` you **join** the parts together:

\`\`\`
output: "Hello " + name + "!"
output: "You are " + age + " years old."
\`\`\`

Watch out for the spaces inside the quotation marks. Without them everything sticks together, and you see \`HelloMia!\` instead of \`Hello Mia!\`.

## Exercise: Greeting

::: übung l06-begruessung
titel: Greeting
auftrag: Ask for a name and greet the person. When Ada is typed in, **Hello Ada!** should be output.
test: Ada -> Hello Ada!
test: Ben -> Hello Ben!
braucht: anweisung
tipp: First comes an input for the name, then an output that uses the name.
tipp: The name is text, so the input needs the type \`String\`. In the output you join \`"Hello "\`, the variable and \`"!"\` with \`+\`.
lösung: l06-begruessung-loesung.visustruct
:::

## Careful with + in an output

In an output, \`+\` **always** joins the parts together, even with numbers. If \`a\` is 3 and \`b\` is 4, then

\`\`\`
output: a + b
\`\`\`

does not show 7 but **34**. So calculate in a variable first and then output the variable:

\`\`\`
int sum = a + b
output: "Sum: " + sum
\`\`\`

That also fits the IPO model: you calculate in the process part, not in the output.

## From the task to the structure chart

Before you drag the first box, read the task carefully and take it apart. This is called **problem analysis**. Three questions help you:

1. **What is given?** These values become the **input**. Also think about the data type.
2. **What are you looking for?** That becomes the **output**.
3. **How do you get from what is given to what you are looking for?** That is the **process**, often a formula.

An example: *A cinema ticket costs 9 euros. The program asks how many tickets someone buys and shows the total price.*

- Given: the number of tickets → \`input: int count "How many tickets?"\`
- Looking for: the total price → \`output: "Total price: " + total\`
- Way: count times 9 → \`int total = count * 9\`

Now you only have to put the three parts on top of each other in the order I, P, O.

> Look out for signal words in the task: *asks*, *reads in* or *enters* point to an input. *Shows*, *outputs* or *reports* point to an output.

## Exercise: Calculator

::: übung l06-rechner
titel: Sum and product
auftrag: Ask for two whole numbers. Then output their sum and their product, each on its own line.
With 3 and 4 it looks like this: \`Sum: 7\` and \`Product: 12\`.
test: 3, 4 -> Sum: 7 | Product: 12
test: 10, -2 -> Sum: 8 | Product: -20
test: 0, 5 -> Sum: 5 | Product: 0
braucht: anweisung
tipp: Plan the order: first read in both numbers, then calculate, then output.
tipp: You need two inputs, two statements for calculating and two outputs. Calculate the sum in a variable of its own, otherwise \`+\` joins the numbers together.
lösung: l06-rechner-loesung.visustruct
:::

## Exercise: Mean

::: übung l06-mittelwert
titel: Mean
auftrag: Ask for two numbers, which may also be decimal numbers. Output their mean, so for 2 and 3 that is \`Mean: 2.5\`.
test: 2, 3 -> Mean: 2.5
test: 4, 6 -> Mean: 5.0
test: 1.5, 2 -> Mean: 1.75
braucht: anweisung
tipp: You get the mean of two numbers by adding them and halving the result.
tipp: For decimal numbers you use the type \`double\`. The mean is the sum divided by 2. Remember the brackets: \`(x + y) / 2\`.
lösung: l06-mittelwert-loesung.visustruct
:::

## Checklist

::: checkliste
- I can explain the IPO model. → The IPO model
- I can write an input with a data type, a name and a question. → Input with input:
- I can join text and variables in an output with +. → Careful with + in an output
- I calculate in a variable before the output. → Careful with + in an output
- I can pick out input, process and output from a task. → From the task to the structure chart
:::

## Quiz

::: quiz
? What does IPO stand for?
- [x] Input, process, output
- [ ] Input, program, order
- [ ] Insert, paste, open
> Many programs first ask for values, process them and then show the result.

? The variables a and b have the values 3 and 4. What does \`output: a + b\` show?
- [ ] 7
- [x] 34
- [ ] a + b
> In an output, + joins the parts together. Calculate the sum in a variable first.

? Which input fits if a price such as 4.99 should be typed in?
- [ ] input: int price "Price?"
- [x] input: double price "Price?"
- [ ] input: String "Price?"
> 4.99 is a decimal number, so double. Also, every input needs a variable name.

? What does \`output: "Age: " + age\` show if age has the value 12?
- [x] Age: 12
- [ ] "Age: " + 12
- [ ] Age: age

? Task: *The program asks for the radius of a circle and shows its circumference.* Match each part of the text to where it belongs in the IPO model.
= asks for the radius -> Input
= circumference = 2 * 3.14 * radius -> Process
= shows its circumference -> Output
> The radius is given, the circumference is what you are looking for. The formula connects the two.
:::
`,Tr=`---
titel: Simulation and desk check
bereich: Basics
kurz: Run a structure chart step by step, work it out by hand and find mistakes.
---

## Start the simulation

Before branches and loops come along, you get to know your most important tool. From now on you can use the simulation to check every exercise yourself.

With [▶︎ Simulation](#zeige-simulation) in the toolbar, VisuStruct runs your structure chart. While the simulation is running, you cannot edit the diagram. With **✎ Diagram** in the same place you go back to editing.

On the right, the **Controls** appear:

- **Play** runs the diagram automatically, step by step. You set how long it waits between two steps under **Pause per step**.
- **Pause** stops for a moment. Then you carry on with Play or Step.
- **Step** runs exactly one step. That way you can watch calmly.
- **Stop** cancels and resets everything to the start.

Open the following diagram in the editor and go through it with **Step**:

::: diagramm sim-tausch.visustruct
The values of a and b are swapped. The variable temp keeps one value meanwhile.
:::

## What the simulation shows

- **Highlight:** One box in the diagram is coloured. With **Last step** it is the box that has just run. With **Next step** it is the box that comes next.
- **Input:** If the diagram asks for a value, you type it in here and confirm with **OK**.
- **Last Step:** Here you see what has just happened, e.g. \`a = 5 -> 5\` after the box \`a = b\`. On the left, the variables have already been replaced by their values; to the right of the arrow is the result.
- **Variables:** All variables with their current values.
- **Output:** Everything that was output with \`output:\`.

At the end, **Simulation finished.** appears. If something goes wrong, the simulation stops on the faulty box and shows a message, e.g. **Unknown variable: total**.

## The desk check

In a **desk check** you play the computer yourself. You go through the structure chart with pen and paper and write down the values of the variables after every step. It is best to make a table: one column for the step, one for each variable and one for the output.

For the diagram above, the table looks like this:

| Step | a | b | temp | Output |
|---|---|---|---|---|
| \`int a = 3\` | 3 | – | – | |
| \`int b = 5\` | 3 | 5 | – | |
| \`int temp = a\` | 3 | 5 | 3 | |
| \`a = b\` | 5 | 5 | 3 | |
| \`b = temp\` | 5 | 3 | 3 | |
| \`output: "a = " + a\` | 5 | 3 | 3 | a = 5 |
| \`output: "b = " + b\` | 5 | 3 | 3 | b = 3 |

Then compare your table with the simulation. Do the values under **Variables** match your row after every step?

> A desk check is especially useful in tests. There you have no computer, but you can still show what your structure chart does.

## Find mistakes

If a structure chart outputs something wrong, do this:

1. **Write down what you expect:** What should come out for a particular input?
2. **Run it step by step:** Start the simulation with **Step** and watch the variables.
3. **Find the spot:** Where does a value first differ from what you expected? That is exactly where the mistake is.

Common mistakes in a sequence are:

- The **order** is wrong: a variable is used before it has a value.
- A value is **overwritten** before it is needed.
- **Brackets** are missing: \`a + b / 2\` is not the same as \`(a + b) / 2\`.
- Two whole numbers are divided: \`7 / 2\` gives \`3\`, because with \`int\` everything after the decimal point is dropped.

> Later, branches and loops come along. Then the simulation also shows you which path is taken and how often a loop runs.

## Exercise: Fix the swap

::: übung sim-tausch
titel: Fix the swap
auftrag: The structure chart should read in two numbers and output them swapped. So with 3 and 5, first **5** and then **3** should appear. But it outputs 5 twice.
  Do a desk check or use **Step** and fix the mistake.
start: sim-tausch-start.visustruct
test: 3, 5 -> 5 | 3
test: 1, 2 -> 2 | 1
test: 7, 7 -> 7 | 7
braucht: anweisung
tipp: Go through the diagram with **Step** and write down the values of a and b after every step. Where does the 3 disappear?
tipp: Look at a after the step \`a = b\`. Where did the old value of a go? Keep it in a temporary variable first, as in the example above.
lösung: sim-tausch-loesung.visustruct
:::

## Exercise: Fix the cinema tickets

::: übung sim-kino
titel: Fix the cinema tickets
auftrag: A cinema ticket costs 8.50 euros. The structure chart should ask for the number of tickets and output the total price, so for 2 tickets \`Total: 17.0\`.
  Start the simulation. It stops with an error message. Find out why and fix the structure chart.
start: sim-kino-start.visustruct
test: 2 -> Total: 17.0
test: 3 -> Total: 25.5
test: 0 -> Total: 0.0
braucht: anweisung
tipp: Read the error message of the simulation carefully. Which variable does it not know yet?
tipp: The simulation runs the boxes from top to bottom. Does total already have a value when the output comes? You can move boxes with the mouse.
lösung: sim-kino-loesung.visustruct
:::

> If a simulation keeps running forever, click **Stop**. When you **Check** an exercise, VisuStruct stops by itself after a very large number of steps.

## Checklist

::: checkliste
- I can start the simulation, pause it, run single steps and stop it. → Start the simulation
- During the simulation I can read the variables, the output and the last step. → What the simulation shows
- I can do a desk check by hand as a table. → The desk check
- I can find a mistake by comparing the values with what I expect. → Find mistakes
:::

## Quiz

::: quiz
? Which button runs exactly one step?
- [ ] Play
- [x] Step
- [ ] Stop
> Play keeps going automatically, Step runs only one step.

? What do you write down after every step in a desk check?
- [ ] Only the output at the end
- [x] The current values of all variables
- [ ] The generated Java code
> That way you see exactly where a value is different from what you expected.

? First \`int a = 3\`, then \`int b = 5\`, then \`a = b\`. What values do a and b have afterwards?
- [ ] a = 5 and b = 3
- [x] a = 5 and b = 5
- [ ] a = 3 and b = 5
> The old value of a has been overwritten. That is why you need a temporary variable when swapping.

? The Last Step field shows \`price = 4 * 2.5 -> 10.0\`. What does that mean?
- [ ] The variable price now has the value 4.
- [x] 4 * 2.5 was worked out and the result 10.0 was stored in price.
- [ ] The simulation has found a mistake.

? The simulation reports **Unknown variable: sum**. What is a likely reason?
- [x] sum is used before it has been given a value.
- [ ] sum is too big.
- [ ] The structure chart has too many boxes.
:::
`,Ar=`---
titel: Branch
bereich: Basics
kurz: Use a condition to decide which of two paths runs.
---

## If, then, else

So far every box always ran. But often a program should **decide**: if a condition is met, do one thing, otherwise do the other.

That is what the **branch** is for. The condition sits in the triangle at the top. Below it, the structure chart splits into two paths:

- **true** (left): runs if the condition is true
- **false** (right): runs if the condition is false

Always **exactly one** of the two paths runs. After that, the program continues below the branch.

::: diagramm l07-alter-pruefen.visustruct
Depending on the age typed in, one message or the other appears. Try 17 and 18 in the simulation.
:::

## Insert a branch

Drag the **Branch** from the Elements area into the structure chart. Click the triangle and type the condition in the Object Inspector, e.g. \`age >= 18\`. The word \`if\` is already in front.

Each path starts with a placeholder ø. Drag statements into it. A path may also hold several boxes on top of each other.

## Comparison operators

A condition is usually a **comparison**. Its result is always \`true\` or \`false\`.

- \`==\` equal, e.g. \`number == 0\`
- \`!=\` not equal, e.g. \`answer != 42\`
- \`<\` less than, \`<=\` less than or equal
- \`>\` greater than, \`>=\` greater than or equal

> Do not mix up \`==\` and \`=\`. A single \`=\` is an assignment and stores a value. To compare, you need two equals signs.

With \`%\` you check whether a number can be divided by another: \`number % 2 == 0\` is true if \`number\` is even.

## Exercise: Even or odd

::: übung l07-gerade
titel: Even or odd
auftrag: Ask for a whole number. Output **even** if it is even, otherwise **odd**.
test: 4 -> even
test: 7 -> odd
test: 0 -> even
braucht: verzweigung
tipp: There are two possibilities here, so you need a branch. How do you recognise an even number?
tipp: A number is even if there is no remainder when you divide it by 2. The condition is \`number % 2 == 0\`.
lösung: l07-gerade-loesung.visustruct
:::

## Exercise: The larger number

::: übung l07-maximum
titel: The larger number
auftrag: Ask for two whole numbers and output only the larger one. If both are the same, output that number.
test: 3, 8 -> 8
test: 9, 2 -> 9
test: 5, 5 -> 5
braucht: verzweigung
tipp: A branch compares the two numbers. Each path holds exactly one output.
tipp: Compare with \`a > b\`. In the true path you output \`a\`, in the false path \`b\`.
lösung: l07-maximum-loesung.visustruct
:::

## An empty path

Sometimes something should only happen if the condition is true, and otherwise nothing at all. Then the false path stays **empty**. In the structure chart it shows the placeholder **ø**.

::: diagramm l07-rabatt.visustruct
From 50 euros on, you get 5 euros off. Otherwise nothing happens; the false path is empty. The output below runs in both cases.
:::

## Exercise: Absolute value

::: übung l07-betrag
titel: Absolute value of a number
auftrag: Ask for a whole number. If it is negative, make it positive. Then output the number. So -5 becomes 5, and 7 stays 7.
Use a branch with an empty path and only **one** output below the branch.
test: -5 -> 5
test: 7 -> 7
test: 0 -> 0
test: -12 -> 12
braucht: verzweigung
tipp: Only negative numbers need to be changed. What happens to a number if you multiply it by -1?
tipp: The condition is \`number < 0\`. In the true path you flip the sign, e.g. with \`number = 0 - number\`. The false path stays empty.
lösung: l07-betrag-loesung.visustruct
:::

## Checklist

::: checkliste
- I know that exactly one path of a branch runs. → If, then, else
- I know the comparison operators == != < <= > >=. → Comparison operators
- I can tell == and = apart. → Comparison operators
- I can build a branch with an empty path. → An empty path
:::

## Quiz

::: quiz
? Which path runs if the condition is false?
- [ ] The true path
- [x] The false path
- [ ] Both paths
- [ ] Neither, the program ends
> With false, the right path runs. After that, the program continues below the branch.

? Which condition checks whether age is exactly 18?
- [ ] age = 18
- [x] age == 18
- [ ] age >= 18
> A single = is an assignment. To compare, you need ==.

? What does ø in a path mean?
- [x] Nothing happens in this case.
- [ ] The program ends here.
- [ ] The condition is false.

? The condition is \`points >= 50\`. For which value is it true?
- [ ] 49
- [x] 50
- [ ] 0
> >= means greater than or equal. So 50 is included.

? In textbooks the branch often has another name. Which one?
- [ ] Multiple selection
- [x] Conditional statement
- [ ] Iteration
> The statements in a path only run under a condition. That is why it is also called a conditional statement.
:::
`,Dr=`---
titel: Combining conditions
bereich: Basics
kurz: Join several conditions with and, or and not, and check ranges of values.
---

## And: &&

Sometimes a single comparison is not enough. For example, you only get a youth ticket if you are **at least 12 and younger than 18**.

With \`&&\` (and) you join two conditions. The result is only \`true\` if **both** conditions are true.

::: diagramm l08-jugendticket.visustruct
Both comparisons must be right. Try 11, 12, 17 and 18 in the simulation.
:::

## Or: ||

With \`||\` (or) the result is \`true\` if **at least one** of the conditions is true. Both may be true as well.

\`\`\`
day == 6 || day == 7
\`\`\`

This condition is true if \`day\` has the value 6 or the value 7, so on Saturday or Sunday.

> On many keyboards you type the vertical bar \`|\` with Shift and the backslash key. On a German keyboard it is AltGr and \`<\`, on a Mac Option and 7.

## Exercise: Weekend

::: übung l08-wochenende
titel: Weekend
auftrag: Ask for a day of the week as a number (1 is Monday, 7 is Sunday). Output **Weekend** if it is Saturday or Sunday, otherwise **Weekday**.
test: 6 -> Weekend
test: 7 -> Weekend
test: 1 -> Weekday
test: 5 -> Weekday
braucht: verzweigung
tipp: It is the weekend if the day is 6 **or** 7. For that you need two comparisons in one condition.
tipp: Saturday is 6, Sunday is 7. Join the two comparisons with \`||\`.
lösung: l08-wochenende-loesung.visustruct
:::

## Check ranges of values

In German schools, grades go from 1 (best) to 6. You check whether a grade is **in the range** with two comparisons and \`&&\`:

\`\`\`
grade >= 1 && grade <= 6
\`\`\`

::: grafik l08-zahlenstrahl.svg
The green range from 1 to 6 is valid; both ends are included.
:::

The other way round, a grade is **outside** the range if it is too small **or** too big:

::: diagramm l08-note.visustruct
There is no grade smaller than 1 or bigger than 6.
:::

> The way you write it in maths, \`1 <= grade <= 6\`, does not work. You have to split it into two comparisons and join them with \`&&\`.

## Exercise: Valid grade

::: übung l08-note-gueltig
titel: Valid grade
auftrag: Ask for a grade as a whole number. Output **valid** if it is between 1 and 6 (1 and 6 are included), otherwise **invalid**.
test: 1 -> valid
test: 6 -> valid
test: 3 -> valid
test: 0 -> invalid
test: 7 -> invalid
braucht: verzweigung
tipp: A valid grade has to meet two things at once: not too small **and** not too big.
tipp: The grade must be greater than or equal to 1 and at the same time less than or equal to 6.
lösung: l08-gueltig-loesung.visustruct
:::

## Not and brackets

With \`!\` (not) you turn a condition round: \`true\` becomes \`false\` and the other way round.

\`\`\`
!(grade >= 1 && grade <= 6)
\`\`\`

This is true if the grade is **not** in the range, and it means the same as \`grade < 1 || grade > 6\`.

If \`&&\` and \`||\` appear together, \`&&\` is worked out first, just like multiplication before addition. It is better to use **brackets**; then it is clear what belongs together:

\`\`\`
(age >= 12 && age < 18) || student == 1
\`\`\`

## Exercise: Leap year

::: übung l08-schaltjahr
titel: Leap year
auftrag: A year is a leap year if it can be divided by 4 but not by 100. Years that can be divided by 400 are leap years anyway.
Ask for a year and output **Leap year** or **Not a leap year**.
test: 2024 -> Leap year
test: 2023 -> Not a leap year
test: 1900 -> Not a leap year
test: 2000 -> Leap year
braucht: verzweigung
tipp: Check the rule with examples first: 2024 is a leap year, 1900 is not, 2000 is. “Can be divided” means the remainder is 0.
tipp: Divisible by 4 means \`year % 4 == 0\`, not divisible by 100 means \`year % 100 != 0\`. Join these two with \`&&\`, put brackets around them and add the case for 400 with \`||\`.
lösung: l08-schaltjahr-loesung.visustruct
:::

## Checklist

::: checkliste
- I know when a combination with && is true. → And: &&
- I know when a combination with || is true. → Or: ||
- I can turn a condition round with !. → Not and brackets
- I can check whether a value is in a range such as 1 to 6. → Check ranges of values
:::

## Quiz

::: quiz
? When is \`a && b\` true?
- [ ] If a or b is true
- [x] Only if a and b are both true
- [ ] If exactly one of them is true
> With && both parts must be right. If one is false, the whole thing is false.

? The variable day has the value 6. What does \`day == 6 || day == 7\` give?
- [x] true
- [ ] false
> With || it is enough if one side is true.

? Which condition checks whether number is between 10 and 20 (both included)?
- [ ] 10 <= number <= 20
- [ ] number >= 10 || number <= 20
- [x] number >= 10 && number <= 20
> With || every number would be allowed, because every number is greater than 10 or less than 20.

? What does \`!(5 > 3)\` give?
- [ ] true
- [x] false
> 5 > 3 is true, and ! turns that round.
:::
`,Pr=`---
titel: Switch
bereich: Basics
kurz: Run one of many cases, depending on the value of a variable.
---

## Many possibilities, one variable

A drinks machine has three buttons: 1 for water, 2 for juice, 3 for cocoa. With branches you need three boxes nested inside each other. That quickly gets wide and confusing.

::: diagramm l09-verschachtelt.visustruct
The machine with three nested branches. Each branch checks the same variable choice again.
:::

Whenever you compare **one variable** with **several fixed values**, there is an easier way: the **switch**.

## How a switch is built

At the top of the box is the variable that decides. Below it there is a column of its own for every case. Above each column is the value it belongs to.

::: diagramm l09-automat.visustruct
The same machine as a switch. If choice has the value 2, only column 2 runs.
:::

- The simulation looks for the case whose name matches the value exactly.
- If no case matches, **default** runs. This case is always on the far right.
- After that, the program continues below the switch. Only **one** case ever runs.

> A new switch has the cases 1, 2 and default. Click a case to change its **Case name** in the Object Inspector. With **Add Case** you get a new column in front of default.

## Cases with text

The cases do not have to be numbers. You can also choose by the content of a \`String\` variable. Then you write the text as the case name, for example \`red\`.

::: diagramm l09-ampel.visustruct
A traffic light: depending on the colour typed in, a different message appears. In the simulation, also try a colour that does not exist.
:::

Upper and lower case matter: \`Red\` does not match the case \`red\`.

## Exercise: Grade in words

::: übung l09-note
titel: Grade in words
auftrag: Ask for a grade as a whole number and output it in words: 1 very good, 2 good, 3 satisfactory, 4 sufficient, 5 poor, 6 fail.
  For any other number, **Not a valid grade** should appear.
test: 1 -> very good
test: 4 -> sufficient
test: 6 -> fail
test: 9 -> Not a valid grade
braucht: fallauswahl
tipp: For many fixed values, a switch is clearer than lots of branches. Every grade gets a case of its own.
tipp: Keep using “Add Case” until you have the cases 1 to 6 and default. At the top of the switch you write \`grade\`.
lösung: l09-note-loesung.visustruct
:::

## Exercise: Calculator

::: übung l09-rechner
titel: Calculator
auftrag: Ask, one after another, for a whole number \`a\`, an operator as a \`String\` and a second whole number \`b\`.
  For \`+\`, \`-\` and \`*\` you output the result. For any other sign, **Unknown operator** appears.
test: 3, +, 4 -> 7
test: 10, -, 4 -> 6
test: 6, *, 7 -> 42
test: 1, x, 2 -> Unknown operator
braucht: fallauswahl
tipp: First read in all three values. After that, a switch on the operator decides what is calculated.
tipp: Before the switch, create \`int result = 0\`. In each case you calculate, for example, \`result = a + b\` and then output \`result\`. The case names are simply \`+\`, \`-\` and \`*\`.
lösung: l09-rechner-loesung.visustruct
:::

## Switch or branch?

The switch only checks whether a value is **exactly equal** to a case name. So:

- **Switch:** one variable, several fixed values. Examples: choosing from a menu, day of the week as a number, grades.
- **Branch:** ranges and combined conditions. Examples: \`age >= 18\`, \`temperature < 0 || temperature > 30\`.

So for “age 18 or older” you still need the branch. You cannot create a case of its own for every possible age.

## Checklist

::: checkliste
- I can insert a switch, add cases and change case names. → How a switch is built
- I know when the case default runs. → How a switch is built
- I can decide whether a switch or a branch fits better. → Switch or branch?
:::

## Quiz

::: quiz
? The variable day has the value 5. There are the cases 1, 2, 3 and default. What runs?
- [ ] Nothing at all
- [ ] The case 3
- [x] The case default
> No case name matches 5, so default applies.

? How many cases run each time the switch runs?
- [x] Exactly one
- [ ] All cases from the matching one on
- [ ] All cases
> After the matching case, the program continues straight below the switch.

? What is a switch NOT suitable for?
- [ ] Choosing menu item 1, 2 or 3
- [x] Checking whether a temperature is above 30 degrees
- [ ] Handling a colour such as red, yellow or green
> “Above 30” is a range. For that you need a branch with a comparison.

? At the traffic light you type \`Red\`, and the case is called \`red\`. What happens?
- [ ] The case red runs.
- [x] The case default runs.
- [ ] The simulation reports an error.
> Upper and lower case matter. Red and red are different texts.

? Under which name do you also find the switch in textbooks?
- [ ] Conditional statement
- [ ] Sequence
- [x] Multiple selection
> One of many cases is selected. That is why it is also called multiple selection.
:::
`,Cr=`---
titel: While loop
bereich: Basics
kurz: Repeat steps as long as a condition is true.
---

## Repeat as long as something holds

Often a program should do something several times. Instead of writing the same box five times, you use a **loop**.

The **while loop** repeats its inside **as long as** its condition is true. The condition is at the top, in the head of the box. The inside is indented below it, framed by a bracket on the left.

::: diagramm l10-countdown.visustruct
A countdown: as long as number is greater than 0, number is output and gets smaller by 1. After that, Start! appears.
:::

## The condition comes first

The while loop is a **pre-test loop**. Before **every** pass, the condition is checked:

1. Check the condition.
2. If it is true, run the inside once and start again at 1.
3. If it is false, the program continues below the loop.

::: grafik l10-kopfgesteuert.svg
After every pass it goes back to the condition. Only when it is false does the program continue below the loop.
:::

In the countdown the condition is checked four times: with 3, 2 and 1 it is true, with 0 it is false.

> If the condition is already false the first time it is checked, the inside runs **not even once**. Start the countdown with \`int number = 0\` and only Start! appears.

## A counter variable

Many loops count along. For that you need three things:

- **A start value before the loop**, e.g. \`int i = 1\`
- **A condition in the head**, e.g. \`i <= 5\`
- **A change inside**, e.g. \`i = i + 1\` (short: \`i++\`)

If one of these parts is missing, the loop counts wrongly or not at all.

::: angeberwissen
Counting loops are ancient! In their 1973 article, Nassi and Shneiderman showed their idea using the **factorial**, among other things: 5! = 1 · 2 · 3 · 4 · 5 = 120. Here is my goat version of it. Try it with **Step** in the simulation and watch \`factorial\` grow. Baaah, that goes fast!
:::

::: diagramm l10-fakultaet.visustruct
The factorial with a counter variable \`i\`, rebuilt from an example in the 1973 article.
:::

## Exercise: Count to n

::: übung l10-bis-n
titel: Count to n
auftrag: Ask for a whole number \`n\` and output all numbers from 1 to \`n\`, each on its own line.
test: 3 -> 1 | 2 | 3
test: 5 -> 1 | 2 | 3 | 4 | 5
test: 1 -> 1
braucht: whileSchleife
tipp: You need a counter variable that starts at 1 and grows by 1 in every pass.
tipp: Before the loop, create \`int i = 1\`. The condition is \`i <= n\`. Inside, you output \`i\` and then increase \`i\` by 1.
lösung: l10-bis-n-loesung.visustruct
:::

## Watch out: endless loop

If nothing inside the loop changes the condition, it stays true forever. The loop never stops. This is called an **endless loop**.

::: diagramm l10-endlos.visustruct
Here number = number - 1 is missing. The loop outputs 3 again and again and never reaches Start!
:::

Ask yourself for every loop: **What inside makes sure that the condition becomes false at some point?** When an exercise is checked, VisuStruct stops after a very large number of steps and reports a possible endless loop.

## Exercise: Double up to 100

::: übung l10-verdoppeln
titel: Double up to 100
auftrag: Ask for a whole number. Keep doubling it until it is at least 100.
  At the end, output **how often** you doubled it.
test: 10 -> 4
test: 30 -> 2
test: 1 -> 7
test: 100 -> 0
braucht: whileSchleife
tipp: The loop runs as long as the number is still too small. Count along how often it has run.
tipp: You need a second variable \`int steps = 0\`. The condition is \`number < 100\`. Inside, you double the number with \`number = number * 2\` and increase \`steps\` by 1. If the number is already 100, the loop does not run at all.
lösung: l10-verdoppeln-loesung.visustruct
:::

## Loops in a desk check

With a loop, the **desk check** is especially valuable. You see exactly how often the loop runs and with which value it stops. Every check of the condition gets a row of its own.

::: diagramm l16-schreibtisch.visustruct
A while loop adds up the numbers 1, 2 and 3.
:::

| Step | sum | i | Output |
|---|---|---|---|
| \`int sum = 0\` | 0 | – | |
| \`int i = 1\` | 0 | 1 | |
| \`i <= 3\` → true | 0 | 1 | |
| \`sum = sum + i\` | 1 | 1 | |
| \`i = i + 1\` | 1 | 2 | |
| \`i <= 3\` → true | 1 | 2 | |
| \`sum = sum + i\` | 3 | 2 | |
| \`i = i + 1\` | 3 | 3 | |
| \`i <= 3\` → true | 3 | 3 | |
| \`sum = sum + i\` | 6 | 3 | |
| \`i = i + 1\` | 6 | 4 | |
| \`i <= 3\` → false | 6 | 4 | |
| \`output: sum\` | 6 | 4 | 6 |

Common mistakes in loops are:

- The loop runs **once too often or once too few**, e.g. \`<\` instead of \`<=\`.
- A variable is **not changed** in the loop, or changed in the wrong direction. Then the loop never ends.
- A variable gets its start value **inside** the loop instead of before it and is reset in every pass.

## Exercise: Fix the countdown

::: übung l16-countdown
titel: Fix the countdown
auftrag: The countdown should count down from the start value and output **Go!** at the end. So with 3: 3, 2, 1, Go!
  The start diagram has two mistakes. Find and fix both.
start: l16-countdown-start.visustruct
test: 3 -> 3 | 2 | 1 | Go!
test: 1 -> 1 | Go!
test: 0 -> Go!
tipp: There are two mistakes. One is about counting, the other about the output at the end.
tipp: Start the simulation with start value 3 and watch i under Variables. Does i get smaller? Also compare the last output carefully with the task.
lösung: l16-countdown-loesung.visustruct
:::

## Checklist

::: checkliste
- I know that the while loop checks its condition before every pass. → The condition comes first
- I can use a counter variable with a start value, a condition and a change. → A counter variable
- I notice when a loop never ends and can fix the mistake. → Watch out: endless loop
- I can follow a loop pass by pass in a desk check. → Loops in a desk check
:::

## Quiz

::: quiz
? What does pre-test loop mean?
- [x] The condition is checked before every pass.
- [ ] The condition is checked after every pass.
- [ ] The loop always runs exactly once.
> The head with the condition is at the top and is worked out first.

? \`int i = 5\`, then a while loop with the condition \`i < 3\`. How often does the inside run?
- [x] Not at all
- [ ] Once
- [ ] Three times
> The very first time it is checked, 5 < 3 is false.

? Why does a loop with the condition \`number > 0\` never end if the inside only contains \`output: number\`?
- [ ] Because output makes the number bigger
- [x] Because number never changes and the condition stays true
- [ ] Because the condition is written wrongly
> Something has to happen inside that makes the condition false at some point.

? What else are loops called in textbooks?
- [x] Iteration or repetition
- [ ] Branches
- [ ] Subprograms
> A loop repeats statements. That is why it is also called iteration or repetition.

? A loop should count from 1 to 5, but it only goes up to 4. What is the likely mistake?
- [x] The condition says i < 5 instead of i <= 5.
- [ ] The loop is a while loop.
- [ ] The variable i has the wrong name.
:::
`,Wr=`---
titel: Do-while loop
bereich: Basics
kurz: Run first, check afterwards: loops with at least one pass.
---

## Do first, check afterwards

The **do-while loop** is a **post-test loop**. The condition is at the bottom, in the foot of the box. This is how it runs:

1. Run the inside once.
2. Check the condition.
3. If it is true, start again at 1. If it is false, the program continues below the loop.

::: grafik l11-vergleich.svg
On the left, the while loop checks first; on the right, the do-while loop runs first.
:::

At the top of the box is \`do\`, and the condition is in the foot. When you click the loop, the word \`while\` is in front of the text field in the Object Inspector: the condition means “repeat as long as …”.

> Just like with the while loop, the condition says **when the loop repeats**. As long as it is true, the loop keeps running.

## At least one pass

Because the condition is only checked at the end, the inside **always runs at least once**. That is the most important difference from the while loop.

::: diagramm l11-einmal.visustruct
i is 10 and so it is not less than 5. Still, 10 is output once, because the check only comes afterwards.
:::

With a while loop and the same condition \`i < 5\`, nothing at all would be output here.

## Typical use: repeat an input

The do-while loop fits whenever something has to happen first before you can check it. The best example is an input: only after someone has typed something do you know whether it is valid.

::: diagramm l11-eingabe-pruefen.visustruct
The question comes again until a number from 1 to 10 has been typed in. In the simulation, first try 0 and then 12.
:::

Here the condition describes the **invalid** input: \`number < 1 || number > 10\`. As long as the input is invalid, the question is asked again.

## Exercise: Valid grade

::: übung l11-note
titel: Valid grade
auftrag: Ask for a grade. If it is not between 1 and 6, ask again. If it is valid, output it, for example **Your grade: 3**.
test: 3 -> Your grade: 3
test: 0, 7, 2 -> Your grade: 2
test: 9, 6 -> Your grade: 6
test: -1, 1 -> Your grade: 1
braucht: doUntilSchleife
tipp: The grade is asked for at least once. After that, the condition decides whether to ask again.
tipp: Before the loop, create \`int grade = 0\`. The input \`input: grade "Grade from 1 to 6"\` goes inside the loop. The condition is \`grade < 1 || grade > 6\`.
lösung: l11-note-loesung.visustruct
:::

## Exercise: Sum until 0

::: übung l11-summe
titel: Sum until 0
auftrag: Keep asking for numbers until a 0 is typed in. Then output the sum of all the numbers typed in.
test: 3, 4, 0 -> 7
test: 10, 0 -> 10
test: 5, 5, 5, 0 -> 15
test: 0 -> 0
braucht: doUntilSchleife
tipp: You need a variable for the sum that starts at 0 before the loop. In every pass the new number is added.
tipp: Before the loop, create \`int sum = 0\` and \`int number = 0\`. In the loop you ask for \`number\` and calculate \`sum = sum + number\`. Adding the 0 does no harm. The loop keeps running as long as \`number != 0\`.
lösung: l11-summe-loesung.visustruct
:::

## Checklist

::: checkliste
- I know that the do-while loop only checks its condition after the inside. → Do first, check afterwards
- I know that the inside runs at least once. → At least one pass
- I can repeat an input until it is valid. → Typical use: repeat an input
:::

## Quiz

::: quiz
? What does post-test loop mean?
- [ ] The condition is checked before every pass.
- [x] The condition is checked after every pass.
- [ ] The loop has no condition.
> The condition is in the foot, at the bottom, and is worked out after the inside.

? The condition of a do-while loop is false from the start. How often does the inside run?
- [ ] Not at all
- [x] Exactly once
- [ ] Forever
> The inside runs first. Only then does the loop notice that it should stop.

? You want to ask for a number from 1 to 10. Which condition goes in the foot?
- [ ] \`number >= 1 && number <= 10\`
- [x] \`number < 1 || number > 10\`
- [ ] \`number == 10\`
> The loop repeats as long as the input is invalid, that is, less than 1 or greater than 10.

? When is a do-while loop better than a while loop?
- [x] When the inside has to run at least once, e.g. for an input
- [ ] When the loop might not need to run at all
- [ ] When you want to count exactly to 10
:::
`,Br=`---
titel: For loop
bereich: Basics
kurz: Count a fixed number of passes with Init, Condition and Step.
---

## Counting with a fixed plan

In the while loop you already counted along: a start value before the loop, a condition in the head, a change inside. The **for loop** puts these three parts together in the head. That way you see at a glance how it counts.

When you click a for loop, it has three fields on the right:

- **Init:** \`int i = 1\` creates the counter variable.
- **Condition:** \`i <= 5\` says how long to count.
- **Step:** \`i++\` increases \`i\` by 1 after every pass.

::: diagramm l12-eins-bis-fuenf.visustruct
A for loop that outputs the numbers from 1 to 5.
:::

## In which order?

The three parts run at different times:

1. **Init** runs exactly once, right at the start.
2. **Condition** is checked before every pass. If it is false, the loop is finished.
3. After the inside comes the **Step**, then the condition again.

::: grafik l12-for-ablauf.svg
Init only runs once. After that, condition, inside and step repeat.
:::

So the for loop is a pre-test loop, like the while loop. Go through the example in the simulation with **Step** and watch how \`i\` changes.

> Use the for loop when you know beforehand how often something should happen. If the end depends on something that only happens during the loop, for example an input, the while or do-while loop is better.

## Example: sum from 1 to n

A for loop is good for adding up numbers. Before the loop there is \`int sum = 0\`. In every pass the current number \`i\` is added.

::: diagramm l12-summe.visustruct
With n = 4 the loop calculates 0 + 1 + 2 + 3 + 4. At the end, 10 is output.
:::

## Other steps

The step does not always have to be \`i++\`:

- \`i--\` counts backwards, for example with Init \`int i = 10\` and Condition \`i >= 1\`.
- \`i = i + 2\` jumps in steps of two, for example 0, 2, 4, 6.

Make sure that Init, Condition and Step fit together. With Init \`int i = 1\`, Condition \`i >= 1\` and Step \`i++\`, the condition never becomes false.

::: übung l12-countdown
titel: Countdown
auftrag: Ask for a whole number \`n\`. Use a for loop to count backwards from \`n\` to 1 and output each number. Then output **Go!**.
test: 3 -> 3 | 2 | 1 | Go!
test: 5 -> 5 | 4 | 3 | 2 | 1 | Go!
test: 1 -> 1 | Go!
braucht: forSchleife
tipp: This time the for loop counts backwards. Think about where it starts, when it stops and how it counts.
tipp: Init is \`int i = n\`, the condition \`i >= 1\` and the step \`i--\`. The output Go! goes below the loop, not inside it.
lösung: l12-countdown-loesung.visustruct
:::

## Exercise: Times table

::: übung l12-einmaleins
titel: Times table
auftrag: Ask for a number and output its times table from 1 to 10. Each line looks like this: **3 x 1 = 3**, **3 x 2 = 6** and so on.
test: 3 -> 3 x 1 = 3 | 3 x 2 = 6 | 3 x 3 = 9 | 3 x 4 = 12 | 3 x 5 = 15 | 3 x 6 = 18 | 3 x 7 = 21 | 3 x 8 = 24 | 3 x 9 = 27 | 3 x 10 = 30
test: 7 -> 7 x 1 = 7 | 7 x 2 = 14 | 7 x 3 = 21 | 7 x 4 = 28 | 7 x 5 = 35 | 7 x 6 = 42 | 7 x 7 = 49 | 7 x 8 = 56 | 7 x 9 = 63 | 7 x 10 = 70
braucht: forSchleife
tipp: The loop counts from 1 to 10. In every pass you output one line of the table.
tipp: Inside, first calculate \`int product = number * i\`. Then output \`number + " x " + i + " = " + product\`. Remember the spaces inside the quotation marks.
lösung: l12-einmaleins-loesung.visustruct
:::

## Exercise: Fix the sum

::: übung l16-summe
titel: Fix the sum
auftrag: The structure chart should add up all numbers from 1 to n. So with n = 4 the result should be 1 + 2 + 3 + 4 = **10**. But it outputs 6.
  Do a desk check or use **Step** and fix the mistake.
start: l16-summe-start.visustruct
test: 4 -> 10
test: 1 -> 1
test: 5 -> 15
braucht: forSchleife
tipp: Go through the loop with n = 4 in your head or with **Step**. Which numbers are really added?
tipp: Look at the last value of i the loop runs with. With n = 4, i = 4 must be added too.
lösung: l16-summe-loesung.visustruct
:::

## Checklist

::: checkliste
- I know the three parts Init, Condition and Step of the for loop. → Counting with a fixed plan
- I know in which order the three parts run. → In which order?
- I can count forwards, backwards and in bigger steps with a for loop. → Other steps
:::

## Quiz

::: quiz
? How often does the Init of a for loop run?
- [x] Exactly once
- [ ] Before every pass
- [ ] After every pass
> Init creates the counter variable once at the start.

? Init \`int i = 0\`, Condition \`i < 3\`, Step \`i++\`. Which values does i have inside the loop?
- [ ] 1, 2, 3
- [x] 0, 1, 2
- [ ] 0, 1, 2, 3
> With i = 3 the condition is false, so the inside does not run any more.

? Init \`int i = 2\`, Condition \`i <= 10\`, Step \`i = i + 2\`. How often does the inside run?
- [ ] 4 times
- [x] 5 times
- [ ] 10 times
> i takes the values 2, 4, 6, 8 and 10.

? When does a for loop fit best?
- [x] When you know beforehand how often to repeat
- [ ] When you keep asking until an input is valid
- [ ] When only a single value is checked
:::
`,Hr=`---
titel: Nesting
bereich: Basics
kurz: Combine branches inside loops and loops inside loops.
---

## Building blocks inside each other

You now know all the important building blocks: sequence, branch, switch and three kinds of loops. They only get really powerful together.

Every path and every loop body is a sequence itself. You may put any element there, including more branches and loops. This is called **nesting**.

> To do this, simply drag an element onto the placeholder ø inside a loop or a path.

## A branch inside a loop

The loop goes through all the numbers, and the branch decides for each single number whether something happens. That way you can count, for example, how many even numbers there are from 1 to n.

::: diagramm l13-gerade-zaehlen.visustruct
In every pass the branch checks with i % 2 == 0 whether i is even. Only then is count increased by 1. The false path stays empty.
:::

With n = 7 these are the numbers 2, 4 and 6, so 3 is output.

## Exercise: Count even inputs

::: übung l13-gerade-eingaben
titel: Count even inputs
auftrag: Ask for exactly **five** whole numbers, one after another. Then output how many of them were even.
test: 1, 2, 3, 4, 5 -> 2
test: 2, 4, 6, 8, 10 -> 5
test: 1, 3, 5, 7, 9 -> 0
test: 10, 11, 0, 7, 8 -> 3
braucht: forSchleife, verzweigung
tipp: Doing the same thing five times means: loop. In every pass a number is read in and checked.
tipp: A for loop from 1 to 5. Inside, first comes the input \`input: int number "Enter a number"\`, below it a branch with \`number % 2 == 0\`. In the true path you increase \`count\` by 1.
lösung: l13-gerade-eingaben-loesung.visustruct
:::

## A loop inside a loop

If one loop sits inside another, the **inner loop runs all the way through in every pass of the outer one**. With this you can build patterns of rows and columns.

::: diagramm l13-dreieck.visustruct
The outer loop counts the lines. The inner one adds as many stars to the text as the line number says. With n = 3 you get a triangle of 1, 2 and 3 stars.
:::

With \`String text = ""\` every line starts empty. \`text = text + "*"\` adds a star. Only when the line is finished is it output.

## Exercise: Rectangle

::: übung l13-rechteck
titel: Rectangle
auftrag: Ask for a width and a height. Output a rectangle made of \`#\`: as many lines as the height, and in each line as many \`#\` as the width.
test: 3, 2 -> ### | ###
test: 1, 3 -> # | # | #
test: 4, 1 -> ####
test: 2, 2 -> ## | ##
braucht: forSchleife
tipp: You need two loops inside each other: one for the lines and inside it one for the characters of a line.
tipp: Build it like the triangle. The difference: the inner loop always counts up to \`width\`, not up to the line number. The outer loop counts up to \`height\`.
lösung: l13-rechteck-loesung.visustruct
:::

## Keep track

With nested diagrams, the drawing helps you: whatever is further inside is indented and surrounded by its loop or path.

- Read from the outside in: what repeats? What is decided in every pass?
- Give counter variables meaningful names such as \`line\` and \`column\`. Two loops must not change the same counter variable.
- Go through an example in the simulation with **Step** and watch the variables.

::: angeberwissen
This is exactly what the structure chart was invented for. Shneiderman asked himself: if we are supposed to do without GOTO, why not do without the arrows in the flowchart as well? The result: no arrow spaghetti, and every block stays nicely in its pen. [The whole story](https://visustruct.org/en/angeberwissen.html)
:::

## Checklist

::: checkliste
- I can put a branch inside a loop. → A branch inside a loop
- I can put a loop inside another loop. → A loop inside a loop
- I know that the inner loop runs all the way through in every pass of the outer one. → A loop inside a loop
:::

## Quiz

::: quiz
? The outer loop runs 3 times, the inner one 4 times. How often does the inside of the inner loop run in total?
- [ ] 7 times
- [x] 12 times
- [ ] 4 times
> In each of the 3 outer passes, the inner loop runs 4 times, so 3 · 4 = 12.

? How can you tell whether a number is even?
- [ ] \`number / 2 == 0\`
- [x] \`number % 2 == 0\`
- [ ] \`number == 2\`
> % gives the remainder of a division. For even numbers, the remainder when dividing by 2 is zero.

? There is a branch inside a for loop. How often is the condition of the branch checked?
- [ ] Once
- [x] Once per pass of the loop
- [ ] Only if it is true
> The branch is part of the inside and runs in every pass.
:::
`,Gr=`---
titel: Arrays
bereich: Basics
kurz: Store many values under one name, reach them with the index and go through them with a loop.
---

## Many values under one name

Imagine you want to store the points from five tests. With five variables \`points1\` to \`points5\` that quickly gets confusing. An **array** is a row of slots that all have the same name and the same data type.

You create an array with a statement. After the data type you write square brackets \`[]\`:

\`\`\`
int[] numbers = {2, 4, 6, 8, 10}
String[] names = {"Ada", "Ben", "Cem"}
\`\`\`

The values in the curly brackets go straight into the slots. You can also create an empty array with a fixed number of slots:

\`\`\`
int[] points = new int[5]
String[] names = new String[3]
\`\`\`

With \`new int[5]\` all five slots hold zeros at first, with \`new String[3]\` empty texts.

## The index starts at 0

Every slot has a number, the **index**. Counting starts at **0**. So with \`int[] numbers = {2, 4, 6, 8, 10}\`:

- \`numbers[0]\` is 2
- \`numbers[1]\` is 4
- \`numbers[4]\` is 10

::: grafik l14-array.svg
Five slots with the indices 0 to 4. The index is above the slot, the value inside it.
:::

**Why start at 0?** In computer science the index is not “which slot” but the **distance from the start**. The first slot is right at the start, so 0 steps away. The second is 1 step away, the third 2 steps. You know this from a lift: the ground floor is **0**, and the first floor is one level above it.

This gives you a rule worth remembering: with 5 slots the **last index is 4**, always one less than the number of slots.

::: angeberwissen
Counting from 0 is pretty old. The programming language C from 1972 already works like this: the computer knows the address of the first slot, and for \`numbers[i]\` it simply calculates “start plus i slots further”. With i = 0 it stays at the start, which saves a calculation. Java, Python and JavaScript took this over. By the way, I count my horns from 0 as well: horn 0 on the left, horn 1 on the right.
:::

With the index you read a value or write a new one into it:

\`\`\`
output: numbers[0]
numbers[1] = 99
\`\`\`

> An array with 5 slots has the indices 0 to 4. \`numbers[5]\` does not exist. The simulation then reports an invalid expression.

## The length of an array

\`numbers.length\` tells you how many slots an array has. With five values it is 5. So the **last** index is always \`numbers.length - 1\`:

\`\`\`
output: numbers.length
output: numbers[numbers.length - 1]
\`\`\`

The second line outputs the last value, however long the array is. VisuStruct also understands \`numbers.length()\`.

::: übung l14-erster-letzter
titel: First and last value
auftrag: Create the array \`int[] values = {4, 8, 15, 16, 23, 42}\`. Then output on three lines: the first value, the last value and the number of values.
  For the last value, use the length and do not simply write the index 5.
test: - -> 4 | 42 | 6
braucht: anweisung
tipp: Counting starts at 0, so the first slot has the index 0. And what is the index of the last slot?
tipp: The first value is \`values[0]\`. The last one is \`values[values.length - 1]\`. The number of values is \`values.length\`.
lösung: l14-erster-letzter-loesung.visustruct
:::

## Go through an array with a loop

An array shows its strength together with a **for loop**. The counter variable \`i\` runs from 0 to the last index and is used as the index:

\`\`\`
int i = 0
i < numbers.length
i++
\`\`\`

In the first pass \`i\` is 0, in the last one 4. Because the condition is \`i < numbers.length\`, the loop fits any length.

::: diagramm l14-array-durchlaufen.visustruct
The for loop outputs all five values one after another. Under Variables in the simulation, watch i count from 0 to 4.
:::

This is also how you fill an empty array with inputs. As the target of the input you write the slot \`names[i]\`:

::: diagramm l14-namen-eingeben.visustruct
Three names are asked for and written into the slots 0, 1 and 2.
:::

::: übung l14-rueckwaerts
titel: Print backwards
auftrag: Create an array for 4 whole numbers and read in the 4 numbers with a loop. Then output them in **reverse** order, each on its own line.
test: 1, 2, 3, 4 -> 4 | 3 | 2 | 1
test: 7, 0, 5, 9 -> 9 | 5 | 0 | 7
braucht: forSchleife
tipp: You need two loops: one for reading in from front to back and one for outputting from back to front.
tipp: You create the array with \`int[] numbers = new int[4]\`. The input is \`input: numbers[i] "Enter a number"\`. For the second loop you start at \`int i = numbers.length - 1\`, check \`i >= 0\` and count down with \`i--\`.
lösung: l14-rueckwaerts-loesung.visustruct
:::

## Sum and maximum

Two tasks come up with arrays again and again:

- **Sum:** You start with \`sum = 0\` and add every value in the loop.
- **Maximum:** First you remember the value in slot 0 as the largest so far. In the loop you check every value. If it is larger, it becomes the new maximum.

::: diagramm l14-summe-maximum.visustruct
Sum and maximum in one single pass. The maximum starts with points[0] and not with 0, so that it is also right for negative numbers.
:::

::: übung l14-summe-max
titel: Sum and maximum
auftrag: Read 5 whole numbers into an array. Then output **Sum: …** and on the next line **Maximum: …**.
test: 3, 9, 2, 9, 1 -> Sum: 24 | Maximum: 9
test: 10, 20, 30, 40, 50 -> Sum: 150 | Maximum: 50
test: -5, -2, -9, -1, -3 -> Sum: -20 | Maximum: -1
braucht: forSchleife, verzweigung
tipp: Go through the array with a loop. Add every value to the sum and remember the largest value seen so far.
tipp: Calculate the sum and the maximum in variables of their own and only output them at the end, e.g. with \`output: "Sum: " + sum\`. If your maximum starts at 0, the third test fails.
lösung: l14-summe-max-loesung.visustruct
:::

## Checklist

::: checkliste
- I can create an array with values or with \`new int[5]\`. → Many values under one name
- I know that the index starts at 0 and that the last index is \`length - 1\`. → The index starts at 0
- I can go through and fill an array with a for loop. → Go through an array with a loop
- I can calculate the sum and the maximum of an array. → Sum and maximum
:::

## Quiz

::: quiz
? What does \`output: numbers[2]\` output with \`int[] numbers = {5, 10, 15, 20}\`?
- [ ] 10
- [x] 15
- [ ] 20
> Counting starts at 0: numbers[0] is 5, numbers[1] is 10, numbers[2] is 15.

? An array has 8 slots. Which index is the last one?
- [ ] 8
- [x] 7
- [ ] 9
> The last index is always length - 1.

? Which condition fits a for loop that goes through all values of \`numbers\` and starts at \`int i = 0\`?
- [x] i < numbers.length
- [ ] i <= numbers.length
- [ ] i > numbers.length
> With <= the loop would also read numbers[length], and that slot does not exist.

? What should the maximum start with before the loop begins?
- [ ] Always with 0
- [x] With the first value of the array
- [ ] With the length of the array
> If it starts with 0, then with only negative numbers the result would be 0, although 0 is not in the array at all.

? What does \`output: numbers.length\` output with \`int[] numbers = {5, 10, 15, 20}\`?
- [ ] 3
- [x] 4
- [ ] 20
> length is the number of slots, not the last index and not the last value.
:::
`,Nr=`---
titel: Two-dimensional arrays
bereich: Basics
kurz: Store values in rows and columns, like the seats in a cinema, and go through them with two nested loops.
---

## A cinema as a table

A cinema has several **rows**, and every row has several **seats**. For every seat we want to remember whether its ticket has already been sold. That is a yes-or-no question, so the data type \`boolean\` fits: \`true\` means sold, \`false\` means free.

A normal array is one single row of slots. For the cinema we need a **table** with rows and columns. That is a **two-dimensional array**, 2D array for short. You write two pairs of square brackets for it:

\`\`\`
boolean[][] seats = new boolean[3][5]
\`\`\`

That gives 3 rows with 5 seats each, so 15 slots. At the start every slot holds \`false\`: all seats are free.

::: grafik kino-saal.svg
The first index is the row, the second the seat. Both are counted from 0.
:::

## Reach a slot

For a slot you now need **two** indices: first the row, then the seat.

\`\`\`
seats[1][2] = true
\`\`\`

Now seat 2 in row 1 is sold. Reading works the same way: \`seats[1][2]\` is now \`true\`.

You can also ask for the size:

- \`seats.length\` is the number of **rows**, here 3.
- \`seats[0].length\` is the number of **seats** in row 0, here 5.

::: diagramm kino-verkaufen.visustruct
Three tickets are sold. After that, the diagram outputs the size of the cinema and whether row 1, seat 2 is sold. Watch under Variables in the simulation: seats is shown row by row.
:::

> Just like with a normal array, there is no slot \`seats[3][0]\`, because the rows are called 0, 1 and 2. The simulation then reports an invalid expression.

## Two loops inside each other

To look at **all** seats, you need two for loops inside each other:

- The **outer loop** counts the row: \`row\` runs from 0 to 2.
- The **inner loop** counts the seat: \`seat\` runs from 0 to 4.

::: grafik kino-schleifen.svg
Blue is the outer loop, orange the inner one. The numbers show the order in which the seats come up.
:::

For every row, the inner loop runs **all the way** through once. Only when \`seat\` has visited all five seats does the outer loop move \`row\` on by one. Then \`seat\` starts at 0 again. That way all 3 · 5 = 15 seats come up exactly once.

The conditions are \`row < seats.length\` and \`seat < seats[row].length\`. That way the loops fit a cinema of any size.

::: diagramm kino-saalplan.visustruct
The seating plan: for every row, a line of X (sold) and O (free) is put together and output. Go through it with Step and watch how seat keeps starting again from the beginning while row only slowly counts on.
:::

::: angeberwissen
Every phone photo is a 2D array! A photo with 4000 · 3000 pixels has 3000 rows with 4000 slots each, so 12 million pixels. Every slot holds the colour of one dot. When you make a photo brighter, the phone runs over all the pixels with two nested loops. My profile picture, by the way, has only one slot: brown.
:::

## Exercise: Count free seats

::: übung kino-frei
titel: Count free seats
auftrag: In the start diagram three tickets have already been sold. Use two nested loops to count how many seats are still **free**, and output e.g. \`Free: 12\`.
start: kino-frei-start.visustruct
test: - -> Free: 12
braucht: forSchleife, verzweigung
tipp: Just like for the seating plan, you go over all seats with two loops. Instead of outputting something, you count.
tipp: Before the loops, create \`int free = 0\`. A seat is free if \`seats[row][seat]\` is false. The condition for that is \`!seats[row][seat]\`.
lösung: kino-frei-loesung.visustruct
:::

## Exercise: Sell a ticket

::: übung kino-karte
titel: Sell a ticket
auftrag: The start diagram asks for a row and a seat. If the seat is already sold, output \`Already sold\`. Otherwise mark it as sold and output e.g. \`Sold: row 0, seat 4\`.
start: kino-karte-start.visustruct
test: 1, 2 -> Already sold
test: 0, 4 -> Sold: row 0, seat 4
test: 2, 0 -> Sold: row 2, seat 0
braucht: verzweigung
tipp: First check whether the seat is sold. Depending on the answer, something different happens.
tipp: You do not need a loop here. A branch with the condition \`seats[row][seat]\` is enough. In the false path you set the slot to \`true\`.
lösung: kino-karte-loesung.visustruct
:::

## Exercise: Times table grid

::: übung kino-einmaleins
titel: Times table grid
auftrag: Create \`int[][] table = new int[10][10]\` and fill it with the times tables up to 10 using two loops. Then ask for two numbers from 1 to 10 and read the result from the table, e.g. \`3 · 4 = 12\`.
test: 3, 4 -> 3 · 4 = 12
test: 7, 8 -> 7 · 8 = 56
test: 10, 10 -> 10 · 10 = 100
braucht: forSchleife
tipp: First two nested loops fill the table; after that you read only one single slot.
tipp: The indices run from 0 to 9, but the numbers from 1 to 10. That is why the slot \`table[i][j]\` holds the value \`(i + 1) * (j + 1)\`, and for 3 · 4 you read \`table[a - 1][b - 1]\`.
lösung: kino-einmaleins-loesung.visustruct
:::

## Checklist

::: checkliste
- I can create a 2D array and know what the two numbers mean. → A cinema as a table
- I can read and write a slot with a row and a seat. → Reach a slot
- I know the difference between \`seats.length\` and \`seats[0].length\`. → Reach a slot
- I can explain in which order two nested loops visit the slots. → Two loops inside each other
:::

## Quiz

::: quiz
? How many slots does \`boolean[][] seats = new boolean[4][6]\` have?
- [ ] 10
- [x] 24
- [ ] 46
> 4 rows with 6 seats each: 4 · 6 = 24.

? What is in all slots after \`new boolean[3][5]\`?
- [ ] true
- [x] false
- [ ] Nothing, the slots are empty
> A new boolean array is filled with false. In the cinema that means: all seats are free.

? Two nested loops run over 3 rows with 5 seats. How often does the inside of the **inner** loop run?
- [ ] 3 times
- [ ] 8 times
- [x] 15 times
> For each of the 3 rows the inner loop runs 5 times: 3 · 5 = 15.

? Match what each expression means in the cinema.
= seats.length -> Number of rows
= seats[0].length -> Number of seats in row 0
= seats[2][4] -> Row 2, seat 4
= seats[1][0] = true -> Seat 0 in row 1 is sold
:::
`,Er=`---
titel: Strings
bereich: Basics
kurz: Work with text: read single characters, cut out parts, search, compare and split.
---

## Text is a row of characters

You already know \`String\`: \`String name = "Ludwig"\`. In computer science such a text is called a **string**, because the characters hang one after another like beads on a string. Every character has a place with an index, just like in an array. Here, too, **counting starts at 0**: the first character is 0 steps away from the start.

::: grafik zk-zeichen.svg
The nine characters of “Billygoat” with their indices 0 to 8.
:::

A String comes with **methods**. You write the name of the variable, a dot and the method:

- \`word.length()\` gives the number of characters, here 9.
- \`word.charAt(0)\` gives the character with the index 0, here \`'B'\`.

> With Strings you write \`length()\` **with** brackets, with arrays \`length\` **without**. Sadly, that is just how Java is.

In Java a single character has the data type \`char\`. A \`char\` goes in **single** quotation marks: \`'B'\`. A String goes in double ones: \`"B"\`.

\`\`\`
char first = word.charAt(0)
char last = word.charAt(word.length() - 1)
\`\`\`

Just like in an array, the last character has the index \`length() - 1\`.

## Cut out parts

With \`substring\` you cut a part out of the text:

- \`word.substring(0, 5)\` gives the characters from index 0 **up to just before** index 5, so \`"Billy"\`.
- \`word.substring(5)\` gives everything from index 5 to the end, so \`"goat"\`.

The end is **not** included. Handy: \`substring(0, 5)\` gives exactly 5 characters.

::: diagramm zk-zeichen.visustruct
All the methods from this lesson in one example. Go through it in the simulation and compare every output with the picture.
:::

## Search and compare

More methods you often need:

| Method | Meaning | Example with \`"Billygoat"\` |
|---|---|---|
| \`indexOf("goat")\` | Where does the text start? | 5 |
| \`indexOf("x")\` | not found | -1 |
| \`contains("lly")\` | Does the text appear? | true |
| \`toUpperCase()\` | all capitals | BILLYGOAT |
| \`toLowerCase()\` | all small letters | billygoat |
| \`equals("Billygoat")\` | same text? | true |

> In Java you compare two Strings with \`equals\`, not with \`==\`. Two single characters (\`char\`), on the other hand, you compare with \`==\`, e.g. \`word.charAt(i) == 'e'\`.

::: angeberwissen
Try \`"Billygoat".equals("billygoat")\`. The answer is false! For a computer, B and b are completely different characters. Inside, every character is stored as a number: B is 66 and b is 98. This numbering is called ASCII and dates from 1963. Baah, so for a computer Ludwig and ludwig are two different goats. I am the one with the capital L.
:::

## Character by character

With a for loop you go through a text character by character. The index \`i\` runs from 0 to \`word.length() - 1\`, just like with an array:

::: diagramm zk-zaehlen.visustruct
Counts how often the letter e appears. In the simulation, try “cheese” and watch i and count.
:::

## Split with split

Often several pieces of information sit in one single line, separated by a character, e.g. \`"Ludwig;billy goat;7"\`. With \`split\` you cut the line apart at this character. The result is a **String array**:

\`\`\`
String[] parts = line.split(";")
\`\`\`

After that, \`parts[0]\` is \`"Ludwig"\`, \`parts[1]\` is \`"billy goat"\` and \`parts[2]\` is \`"7"\`. With \`parts.length\` you find out how many parts there are.

::: diagramm zk-split.visustruct
The line is split at the semicolon, and every part is output with its index.
:::

> CSV files, which you know from spreadsheets, are built the same way: one line per record, the values separated by a comma or semicolon.

## Exercise: Initials

::: übung zk-initialen
titel: Initials
auftrag: Ask for a first name and a last name and output the initials. So for Ludwig Billygoat that is \`L. B.\`
test: Ludwig, Billygoat -> L. B.
test: Ada, Lovelace -> A. L.
test: Ben, Shneiderman -> B. S.
braucht: anweisung
tipp: The initial is the first letter of a name. Which method gives the character at a particular place?
tipp: \`firstName.charAt(0)\` gives the first letter. The output is then \`firstName.charAt(0) + ". " + lastName.charAt(0) + "."\`
lösung: zk-initialen-loesung.visustruct
:::

## Exercise: Backwards

::: übung zk-rueckwaerts
titel: Backwards
auftrag: Ask for a word and output it backwards. Ludwig becomes \`giwduL\`.
test: Ludwig -> giwduL
test: Anna -> annA
test: a -> a
braucht: forSchleife
tipp: Go through the word character by character, but from back to front, and build a new text as you go.
tipp: Create \`String backwards = ""\`. The loop starts at the last index \`word.length() - 1\` and counts down to 0 with \`i--\`. In every pass you add \`word.charAt(i)\` at the end.
lösung: zk-rueckwaerts-loesung.visustruct
:::

## Exercise: Count words

::: übung zk-woerter
titel: Count words
auftrag: Ask for a sentence and output how many words it has, e.g. \`Words: 4\` for “Ludwig is a goat”. The words are separated by exactly one space.
test: Ludwig is a goat -> Words: 4
test: Hello -> Words: 1
test: I like goats -> Words: 3
braucht: anweisung
tipp: There is always a space between the words. Which method splits a text at a character?
tipp: Split the sentence into a String array with \`sentence.split(" ")\`. Its length is the number of words.
lösung: zk-woerter-loesung.visustruct
:::

## Checklist

::: checkliste
- I know that the characters of a String are also counted from 0. → Text is a row of characters
- I can work with \`length()\` and \`charAt(i)\`. → Text is a row of characters
- I can cut a part out of a text with \`substring\`. → Cut out parts
- I know \`indexOf\`, \`contains\`, \`toUpperCase\` and \`equals\`. → Search and compare
- I can go through a text character by character with a loop. → Character by character
- I can split a text into a String array with \`split\`. → Split with split
:::

## Quiz

::: quiz
? What does \`"Ludwig".charAt(1)\` give?
- [ ] L
- [x] u
- [ ] d
> Counting starts at 0: L has the index 0, u the index 1.

? What does \`"Structure".substring(0, 6)\` give?
- [x] Struct
- [ ] Structu
- [ ] tructu
> The characters with the indices 0 to 5. The end 6 is not included.

? A word has 7 characters. Which index does the last character have?
- [ ] 7
- [x] 6
- [ ] 8
> Just like with an array: always one less than the length.

? How do you compare two Strings for the same content in Java?
- [ ] a == b
- [x] a.equals(b)
- [ ] a = b

? Match each method to what it gives for \`"Billygoat"\`.
= length() -> 9
= charAt(0) -> B
= indexOf("goat") -> 5
= substring(5) -> goat
:::
`,Lr=`---
titel: Call and break
bereich: Basics
kurz: Split big tasks into subprograms and leave loops early.
---

## Split big tasks

Long structure charts quickly get confusing. That is why you split a big task into **smaller problems**. Every smaller problem gets a name of its own and a structure chart of its own, a **subprogram**.

A quiz, for example, has three parts: greet, ask questions, show the result. The main program only names these three parts:

::: diagramm l15-hauptprogramm.visustruct
The main program is made of just three calls. What happens in each part is in a structure chart of its own.
:::

That way you see at a glance how the program is built. The details are somewhere else.

## The call

A **call** is a box with double vertical lines on the left and right. It means: run the subprogram with this name here, then carry on.

- You drag **Call** from the Elements area and type the name into it, e.g. \`showGreeting()\`.
- The round brackets at the end show that it is a subprogram. That is how you write it in Java, Python and JavaScript, too.
- You build the subprogram itself as a structure chart of its own in a new tab. As the title you type the same name.

::: diagramm l15-unterprogramm.visustruct
The subprogram showGreeting() as a structure chart of its own.
:::

> **In the simulation:** When the simulation reaches a call, it looks among the open tabs for the structure chart with this title and runs it. Then it carries on in the main program. While the subprogram is running, the call box stays highlighted. A subprogram like this one, with only a name as its title, shares its variables with the main program. You will soon learn how a subprogram gets variables of its own. If there is no matching tab, the simulation skips the call and shows a note.

::: angeberwissen
Why does your teacher always say “method” in Java and never “function” or “procedure”? Because in Java every subprogram has to belong to a class, and the subprograms of a class are called methods. The difference still exists, though: if a method hands back a result, it is really a function. If it has \`void\` in front, it hands back nothing and is really a procedure. Java just keeps it simple and calls both methods. So do I: my method is called Munching.
:::

## Exercise: Add a call

::: übung l15-titel
titel: Greeting with a call
auftrag: Imagine the subprogram \`showTitle()\` already exists. Build the main program: first it calls \`showTitle()\`. Then it asks for a name and outputs **Hello** and the name.
  So when Ada is typed in, **Hello Ada** appears.
test: Ada -> Hello Ada
test: Ben -> Hello Ben
braucht: aufruf
tipp: The main program has three parts: the call, the input and the output.
tipp: Drag a Call from the Elements area right to the top and type \`showTitle()\` into it. Below it come the input \`input: String name "What is your name?"\` and the output.
lösung: l15-titel-loesung.visustruct
:::

## Pass values: parameters

Often a subprogram should work with values that are only known when it is called. Then it gets a **header line** as its title:

\`\`\`
void showSum(int a, int b)
\`\`\`

- \`void\` means: the subprogram does not hand back a result.
- \`showSum\` is the name.
- The brackets hold the **parameters**: variables with a data type that get their values when the subprogram is called. You separate several of them with commas.

::: diagramm l15-zeige-summe.visustruct
The subprogram with the header line as its title. It calculates with a and b as if they were normal variables.
:::

In the call box you write the values in the brackets, e.g. \`showSum(3, 4)\`. The first value goes into \`a\`, the second into \`b\`. Instead of numbers you can also use variables and calculations such as \`showSum(x, x + 1)\`.

::: diagramm l15-zeige-summe-haupt.visustruct
The main program calls showSum twice with different values. Open both diagrams and start the simulation here.
:::

> **Local variables:** The parameters and all variables created in the subprogram belong only to the subprogram. It gets **copies** of the values; more on that below under call by value. During the call, the simulation only shows the variables of the subprogram.

## Hand back a result: return

A subprogram can also hand back a result, the **return value**. Then the header line has the data type of the result instead of \`void\`:

\`\`\`
int square(int x)
\`\`\`

The statement \`return result\` hands back the value and ends the subprogram straight away. When you call it, you store the result in a variable: after \`int q = square(5)\`, \`q\` holds the value 25.

::: diagramm l15-quadrat.visustruct
The subprogram square calculates and hands back the result with return.
:::

::: diagramm l15-quadrat-haupt.visustruct
The main program stores the return value in q. Open both diagrams and try the simulation.
:::

> A subprogram with a return value has to end with \`return\`. If the return is missing, the simulation reports an error.

In the **code view**, the header line becomes a Java method (\`public static int square(int x)\`), a \`def\` in Python and a \`function\` in JavaScript. If the subprograms are open in other tabs, they appear in the code together with the main program.

## Exercise: Calculate the area

::: übung l15-flaeche
titel: Calculate the area
auftrag: Build two diagrams. The subprogram \`int area(int a, int b)\` hands back the area of a rectangle, that is a times b. The main program asks for the length and the width, calls \`area\` and outputs **Area:** and the result.
  With 3 and 4, **Area: 12** appears.
test: 3, 4 -> Area: 12
test: 5, 5 -> Area: 25
test: 7, 0 -> Area: 0
braucht: aufruf
tipp: You build two diagrams: a subprogram that only calculates and hands back the result, and a main program for input and output.
tipp: Open a new tab with **+** and give it the title \`int area(int a, int b)\`. One statement is enough inside: \`return a * b\`. In the main program you type \`int f = area(length, width)\` into the call box.
lösung: l15-flaeche-loesung.visustruct
unterprogramm: l15-flaeche-unterprogramm-loesung.visustruct
:::

## Copy or original: call by value and call by reference

What happens if a subprogram changes its parameter? That depends on **what** is passed.

**Call by value:** With \`int\`, \`double\`, \`boolean\`, \`char\` and \`String\`, the subprogram gets a **copy** of the value. If it changes its parameter, the caller's variable stays as it was.

**Call by reference:** With an **array**, the subprogram does not get a copy but a reference to the same array. If it changes a slot, the slot is changed for the caller too. The header line for this looks like this:

\`\`\`
void clear(boolean[] seats)
\`\`\`

::: grafik uebergabe.svg
At the top, doubleIt gets a copy of number. At the bottom, row and seats point to the same array.
:::

Try out both. Open the three diagrams and start the simulation in the main program:

::: diagramm uebergabe-verdopple.visustruct
doubleIt only changes its copy x.
:::

::: diagramm uebergabe-leeren.visustruct
clear sets all seats to false, for example when a showing is cancelled.
:::

::: diagramm uebergabe-haupt.visustruct
number is still 5 after the call. The seats in row, on the other hand, are free after the call.
:::

> If you want to get a number back from a subprogram, use \`return\`, e.g. \`number = doubleIt(number)\` with the header line \`int doubleIt(int x)\`. An array, on the other hand, can be changed by the subprogram directly.

::: angeberwissen
Strictly speaking, Java only knows call by value. But with an array, the whole array is not copied, only its **address** in memory. With the copied address, the subprogram finds the same array. It is as if I gave you a copy of my locker key: the key is copied, but the hay in the locker only exists once.
:::

## Exercise: Bonus points

::: übung uebergabe-bonus
titel: Bonus points
auftrag: The main program calls \`bonus(points)\` and then outputs all the points. Build the subprogram \`void bonus(int[] points)\` that increases every score in the array by 1. Instead of 3, 5 and 8 you then see **4**, **6** and **9**.
start: uebergabe-bonus-start.visustruct
test: - -> 4 | 6 | 9
braucht: aufruf
tipp: The main program is already finished. You only build the subprogram in a new tab.
tipp: Open a new tab with **+** and the title \`void bonus(int[] points)\`. Inside, a for loop runs over all slots and calculates \`points[i] = points[i] + 1\`. You do not need a return, because the array is changed directly.
lösung: uebergabe-bonus-loesung.visustruct
unterprogramm: uebergabe-bonus-unterprogramm-loesung.visustruct
:::

## The break

Sometimes a loop should end **early**, in the middle of its body. That is what the **Break** is for. It leaves the loop it is in straight away. The program carries on with the first box after the loop. In Java, Python and JavaScript this is called \`break\`.

You recognise the Break by the point on its left edge. You can write a short comment into the box, e.g. \`Leave the loop\`. It appears in the code as a comment after \`break\`.

A Break almost always sits in a **branch**: the loop is only left if a condition is met.

A typical case is the **endless loop with a Break**. The loop itself has no condition. It runs until the Break is reached:

::: diagramm l15-endlos-aussprung.visustruct
The loop keeps asking for a number. With 0 it jumps out, otherwise it adds the number to the sum.
:::

Without a Break, an endless loop would really never end.

## Break in the simulation

The simulation runs the Break like \`break\`: it leaves the innermost loop and carries on after it. If a Break is outside every loop, the subprogram ends; in the main program, the whole program ends. \`return\` does the same.

Often you can do without a Break altogether: you write the stop condition straight into the loop. That is usually even clearer.

## Exercise: Sum until 0

::: übung l15-bis-null
titel: Sum until 0
auftrag: Rebuild the program “Sum until 0” **without** a Break. It keeps asking for whole numbers until someone types 0. Then it outputs **Sum:** and the sum of all the numbers typed in.
test: 3, 4, 0 -> Sum: 7
test: 0 -> Sum: 0
test: 10, -2, 5, 0 -> Sum: 13
tipp: Without a Break, the condition of the loop itself has to check whether 0 was typed in.
tipp: Ask for the first number before the loop. The while loop runs with the condition \`number != 0\`. In the body you add the number to the sum and then ask for the next number. For the second input you only write \`input: number "…"\`, because \`number\` already exists.
lösung: l15-bis-null-loesung.visustruct
:::

## Checklist

::: checkliste
- I can split a big task into smaller problems. → Split big tasks
- I can insert a call and build a subprogram in a tab of its own. → The call
- I can pass values to a subprogram with parameters. → Pass values: parameters
- I can hand back a return value with return and store it when calling. → Hand back a result: return
- I can explain why a subprogram cannot change a number but can change an array. → Copy or original: call by value and call by reference
- I know what a Break does and why it sits in a branch. → The break
- I can end a loop with a Break or through its condition. → Break in the simulation
:::

## Quiz

::: quiz
? What does a call box with the text \`showResult()\` mean?
- [ ] The program ends here.
- [x] The subprogram showResult() runs here, and then the program carries on.
- [ ] The word showResult() is output here.

? Where does the program carry on after a Break?
- [ ] At the start of the loop
- [x] At the first box after the loop
- [ ] Right at the start of the program
> The Break leaves the loop it is in. In Java, Python and JavaScript it is called break.

? Why does a Break usually sit in a branch?
- [x] So that the loop is only left if a condition is met
- [ ] Because otherwise a Break cannot be saved
- [ ] Because a branch is a loop itself
> Without a branch, the loop would be left in the very first pass.

? Where does the simulation find the subprogram for a call \`showResult()\`?
- [ ] It has to be in the same structure chart.
- [x] In an open tab with the title showResult()
- [ ] The simulation cannot run subprograms.
> Build every subprogram in a tab of its own and give it the name from the call as its title.

? The subprogram has the header line \`void showSum(int a, int b)\`. Which call fits?
- [ ] showSum()
- [x] showSum(3, 4)
- [ ] int s = showSum(3, 4)
> Two parameters need two values. And \`void\` means nothing comes back that you could store.

? After \`int q = square(5)\`, q holds 25. What is at the end of the subprogram square?
- [ ] output: x * x
- [x] return x * x
- [ ] q = x * x
> With return the subprogram hands the value back to the call. An output would only show it.

? \`void doubleIt(int x)\` calculates \`x = x * 2\`. The main program has \`int number = 5\` and then the call \`doubleIt(number)\`. What value does number have afterwards?
- [x] 5
- [ ] 10
- [ ] 0
> Call by value: doubleIt only changed a copy of number.

? \`void clear(boolean[] seats)\` sets all slots to false. What is true for the array row in the main program after \`clear(row)\`?
- [ ] It is unchanged, because the subprogram gets a copy.
- [x] All slots are false, because seats and row are the same array.
- [ ] The array is deleted.
> Call by reference: an array is passed as a reference. The caller sees changes to the slots too.

? What is a subprogram called in Java?
- [ ] Class
- [x] Method
- [ ] Loop
> In Java a subprogram is a method, for example the \`main\` method. Depending on its kind, it is also called a procedure or a function.

? Many building blocks have a second name in textbooks. Match each term from VisuStruct to its other name.
= Branch -> Conditional statement
= Switch -> Multiple selection
= Loop -> Iteration
= Subprogram -> Method
> Both names mean the same thing. If you know one of them, you understand the other as well.
:::
`,Vr=`---
titel: Searching and sorting
bereich: Basics
kurz: Use playing cards to understand how linear search, binary search and bubble sort work, and why some methods are much faster.
---

## Look for a card

A pile of playing cards lies face down in a row in front of you. You are looking for the 9. What do you do? You turn over one card after another until you find the 9 or have turned over all the cards.

::: grafik ss-lineare-suche.svg
The cards are mixed up. Every card you turn over is one comparison: is this the 9?
:::

This is exactly how **linear search** works: it goes through the array from index 0 to the end and compares every slot with the value it is looking for. It always works, even if the values are mixed up.

In the array our cards are numbers. We leave out jack, queen and king.

::: diagramm ss-lineare-suche.visustruct
The loop runs until the card is found or there is no slot left. The variable comparisons counts how often a comparison was made. In the simulation, look for the 2, the 27 and the 4.
:::

> If the card is not there, \`position\` stays at **-1**. There is no index -1, so here -1 means “not found”.

## Exercise: Find a card

::: übung ss-karte-suchen
titel: Find a card
auftrag: Create the array \`int[] cards = {8, 4, 11, 4, 6}\` and ask for a card. Output the position of the **first** matching card, e.g. \`Position: 1\` for the 4. If the card is not there, output \`Not found\`.
test: 4 -> Position: 1
test: 6 -> Position: 4
test: 8 -> Position: 0
test: 9 -> Not found
braucht: whileSchleife, verzweigung
tipp: Go through the array from front to back and compare every card with the one you are looking for.
tipp: Rebuild the example above. You do not need the variable comparisons here. The loop has to stop as soon as \`position\` is no longer -1, otherwise for the 4 you find the second one instead of the first.
lösung: ss-karte-suchen-loesung.visustruct
:::

## Binary search: sorted is faster

Now the cards lie in front of you **sorted**, from small to large. You are looking for the 27. You no longer turn over the first card at the front, but the **middle** one:

- If it is the one you are looking for, you are done.
- If it is smaller, the card you are looking for can only be on the right. The whole left half drops out.
- If it is larger, the right half drops out.

You do the same again with the rest. With every comparison the pile is halved.

::: grafik ss-binaere-suche.svg
Three comparisons instead of fourteen: with every middle, half of the remaining cards drop out.
:::

In the structure chart, two variables remember the range that is still being searched: \`left\` and \`right\`. The middle is \`(left + right) / 2\`. Because this is whole-number division, the result is always a whole index.

::: diagramm ss-binaere-suche.visustruct
The same array as for the linear search. In the simulation, look for the 27 again and compare the output Comparisons with the linear search.
:::

> Binary search **only works with sorted values**. With mixed-up cards, after looking at the middle you do not know which half to keep searching in.

::: angeberwissen
I think of a number from 1 to 100. You may guess, and I only say “higher” or “lower”. With binary search you need at most **7** guesses. For a number up to a million it is at most 20, for a billion 30. Every doubling costs only one single extra guess. This is how databases search millions of entries in a fraction of a second. I search linearly, by the way: I eat the meadow from left to right.
:::

## How fast is it?

How good a method is gets measured by the number of comparisons it needs **in the worst case**. For linear search, that is the case where the card is right at the back or missing.

::: grafik ss-vergleiche.svg
With 100 cards, linear search needs up to 100 comparisons, binary search at most 7.
:::

| Number of cards | Linear search | Binary search |
|---|---|---|
| 10 | 10 | 4 |
| 100 | 100 | 7 |
| 1,000 | 1,000 | 10 |
| 1,000,000 | 1,000,000 | 20 |

Linear search grows at the same rate as the number of cards. With binary search, twice as many cards add only **one** comparison.

## Sorting with bubble sort

For binary search the values must be sorted. One of the simplest ways of sorting is **bubble sort**. You go through the row from left to right and always compare **two neighbours**. If the larger card is on the left, you swap the two.

::: grafik ss-bubblesort.svg
After one round, the largest card is on the far right.
:::

After the first round the largest card is on the far right, like an air bubble rising to the top. That is where the name comes from. Then you repeat the round for the remaining cards. With 5 cards you need 4 rounds.

The structure chart has two for loops inside each other. The outer one counts the rounds, the inner one compares the neighbours \`cards[i]\` and \`cards[i + 1]\`. You already know how to swap: it needs a **temporary variable**.

::: diagramm ss-bubblesort.visustruct
The inner loop gets shorter with every round, because the largest cards on the right are already in the right place. Go through it in the simulation with Step and watch the array under Variables.
:::

Bubble sort is easy to understand, but slow. With n cards it needs up to n · (n − 1) / 2 comparisons: with 10 cards 45, with 100 cards already 4,950 and with 1,000 cards almost half a million. You may get to know faster methods such as quicksort later.

## Exercise: Sort descending

::: übung ss-absteigend
titel: Sort descending
auftrag: The start diagram reads in 5 cards and sorts them with bubble sort **ascending**, that is from small to large. Change it so that the cards are output **descending**, the largest first.
start: ss-absteigend-start.visustruct
test: 3, 1, 4, 1, 5 -> 5 | 4 | 3 | 1 | 1
test: 10, 20, 30, 40, 50 -> 50 | 40 | 30 | 20 | 10
test: 2, 9, 2, 7, 6 -> 9 | 7 | 6 | 2 | 2
braucht: forSchleife, verzweigung
tipp: Look at the condition in the branch. It decides when two neighbours are swapped.
tipp: You only need to change one single character. When should two neighbours be swapped if the larger card is supposed to go to the left?
lösung: ss-absteigend-loesung.visustruct
:::

## Checklist

::: checkliste
- I can explain how linear search goes through an array. → Look for a card
- I can build a linear search as a structure chart. → Exercise: Find a card
- I know why binary search only works with sorted values. → Binary search: sorted is faster
- I can explain why binary search is much faster with many values. → How fast is it?
- I can show one round of bubble sort with playing cards. → Sorting with bubble sort
:::

## Quiz

::: quiz
? What does binary search need?
- [ ] The array must have exactly 100 slots.
- [x] The values must be sorted.
- [ ] The value you are looking for must be there.
> Only with sorted values do you know, after looking at the middle, which half to keep searching in.

? A sorted array has 1,000 values. How many comparisons does binary search need at most?
- [ ] 500
- [ ] 100
- [x] 10
> 1,000 → 500 → 250 → 125 → 63 → 32 → 16 → 8 → 4 → 2 → 1: after about 10 halvings, one value is left.

? What does bubble sort compare in every step?
- [ ] The first and the last card
- [x] Two neighbouring cards
- [ ] Every card with the middle
> If the larger card is on the left, the neighbours are swapped.

? Where is the largest card after the first round of bubble sort?
- [ ] On the far left
- [ ] In the middle
- [x] On the far right
> It is swapped on with every comparison and rises to the right like a bubble.

? What does \`position = -1\` mean in linear search?
- [x] The card has not been found (yet).
- [ ] The card is right at the back.
- [ ] The array is empty.

? Match each method to the right description.
= Linear search -> look at one card after another
= Binary search -> look at the middle and drop one half
= Bubble sort -> compare neighbours and swap them
:::
`,Fr=`---
titel: Java
bereich: From structure chart to code
kurz: Generate and read Java code from the structure chart, and the other way round, rebuild Java code as a structure chart.
---

## The code view

A structure chart describes a process. For a computer to run it, you need a program in a programming language. VisuStruct writes this code for you.

Click [{ } Code](#zeige-code) in the toolbar. On the right, the **Code generator** appears:

- At the top you choose the language: **Java**, **Python** or **JavaScript**.
- For Java you also choose under **Java output** between **Snippet** (only the statements) and **Class** (a complete Java file).
- **Diagram text as comments** writes the text of every box as a comment above the code.
- **Copy** puts the code on the clipboard, **Save Java…** saves a \`.java\` file.

The code changes straight away whenever you change something in the structure chart.

::: angeberwissen
Later on, Nassi worked on the programming language Ada and was in charge of software at Apple. So if you invent structure charts, you do not end up in a goat shed, you end up at Apple.
:::

::: diagramm l17-beispiel.visustruct
A small program with an input, a for loop and a branch. Open it and look at the Java code for it.
:::

## This is the example in Java

For the diagram above, VisuStruct generates this code as a **Snippet**:

\`\`\`
// import java.util.Scanner;
Scanner scanner = new Scanner(System.in);

System.out.println("Which times table?");
int number = scanner.nextInt();
for (int i = 1; i <= 3; i++) {
    int result = number * i;
    System.out.println(i + " times " + number + " = " + result);
}
if (number > 10) {
    System.out.println("That was hard!");
} else {
    System.out.println("That was easy.");
}
\`\`\`

In Java every statement ends with a **semicolon** \`;\`. Whatever is inside a box goes in **curly brackets** \`{ }\` in Java. The indentation shows you what belongs together.

## The elements in Java

- **Statement:** \`int sum = 0\` becomes \`int sum = 0;\`
- **Output:** \`output: sum\` becomes \`System.out.println(sum);\`
- **Input:** \`input: int number "Number?"\` becomes two lines: \`System.out.println("Number?");\` and \`int number = scanner.nextInt();\`. For the \`Scanner\`, \`Scanner scanner = new Scanner(System.in);\` is written once at the top.
- **Branch:** \`if (condition) { … } else { … }\`
- **Switch:** \`switch (value) { case 1 -> { … } default -> { … } }\`
- **While loop:** \`while (condition) { … }\`
- **Do-while loop:** \`do { … } while (condition);\`
- **For loop:** \`for (int i = 0; i < 5; i++) { … }\`; the three fields go one after another in the brackets, separated by semicolons.
- **Endless loop:** \`while (true) { … }\`
- **Break:** \`break;\`
- **Call:** \`calculate();\`

If the false path of a branch is empty, VisuStruct still generates an \`else\` part that contains only the comment \`// empty element\`. If you switch off **Emit empty else branch in code**, the empty \`else\` part disappears.

## Snippet or Class

You can paste a **Snippet** into the \`main\` method of an existing Java program. With **Class** you get a complete file that you can compile and run straight away:

\`\`\`
import java.util.Scanner;

public class TimesTable {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Which times table?");
        int number = scanner.nextInt();
        ...
    }
}
\`\`\`

The name of the class comes from the **title** of the diagram. The file must have exactly the same name, so here \`TimesTable.java\`. **Save Java…** takes care of that for you.

> The generated code is a good start, but check it. If you first create a variable and later read it in again with an input, VisuStruct still writes \`int pin = scanner.nextInt();\`. Java then reports that \`pin\` already exists. Simply delete the \`int\` in that line.

## The Java language mode

In the toolbar you can change the language of the interface. Besides English, German and many others there is **Java (Keywords)**. Then the building blocks in the Elements area have the same names as the commands in Java: \`if\`, \`switch\`, \`for\`, \`while\`, \`do\`, \`while(true)\`, \`break\` and \`call\`. The rest of the interface is then in English.

This helps you match the boxes to the Java commands. Your diagram itself stays unchanged.

## Exercise: Java as a structure chart

Now the other way round: here is a piece of Java code. Rebuild it as a structure chart.

\`\`\`
System.out.println("Enter a number");
int n = scanner.nextInt();
int factorial = 1;
for (int i = 1; i <= n; i++) {
    factorial = factorial * i;
}
System.out.println(factorial);
\`\`\`

::: übung l17-fakultaet
titel: Factorial from Java
auftrag: Rebuild the Java code above as a structure chart. The program reads in a number n and outputs the product 1 · 2 · … · n.
  At the end, check in the code view whether your Java code looks the same.
test: 3 -> 6
test: 5 -> 120
test: 1 -> 1
braucht: forSchleife
tipp: Read the Java code line by line and think about which box fits each line.
tipp: The first two Java lines together are one single input: \`input: int n "Enter a number"\`. The for loop has the three fields \`int i = 1\`, \`i <= n\` and \`i++\`.
lösung: l17-fakultaet-loesung.visustruct
:::

## Exercise: else if

In Java, several cases are often written as \`else if\`:

\`\`\`
if (age < 6) {
    System.out.println("Free entry");
} else if (age < 18) {
    System.out.println("Child ticket: 4 euros");
} else {
    System.out.println("Adult ticket: 8 euros");
}
\`\`\`

There is no \`else if\` in a structure chart. There, a second branch sits in the false path of the first one. If the false path holds only this one branch, VisuStruct turns it back into \`else if\` when it generates the code, and into \`elif\` in Python.

::: übung l17-ticket
titel: Ticket price
auftrag: Ask for the age as a whole number and rebuild the Java code above as a structure chart.
test: 5 -> Free entry
test: 6 -> Child ticket: 4 euros
test: 17 -> Child ticket: 4 euros
test: 18 -> Adult ticket: 8 euros
braucht: verzweigung
tipp: In the Java code there is another \`if\` inside an \`else\`. In the structure chart that is a branch inside a path.
tipp: Drag a second branch with the condition \`age < 18\` into the false path of the first branch.
lösung: l17-ticket-loesung.visustruct
:::

## Checklist

::: checkliste
- I can open the code view and choose Java as the language. → The code view
- I know what output, input, branches and loops look like in Java. → The elements in Java
- I know the difference between Snippet and Class. → Snippet or Class
- I can rebuild a short Java program as a structure chart. → Exercise: Java as a structure chart
:::

## Quiz

::: quiz
? What does \`output: "Hello"\` look like in Java?
- [ ] print("Hello")
- [x] System.out.println("Hello");
- [ ] console.log("Hello");
> print is Python, console.log is JavaScript.

? Where does the class name come from with Class?
- [ ] It is always called Main.
- [x] From the title of the diagram
- [ ] From the first box
> Without a title, the class is called Main.

? Which Java code belongs to a do-while loop?
- [ ] while (condition) { … }
- [x] do { … } while (condition);
- [ ] for (;;) { … }
> With do-while the condition is at the end, so the body runs at least once.

? What does a Break become in Java code?
- [x] break;
- [ ] return;
- [ ] exit();
:::
`,Rr=`---
titel: Python and JavaScript
bereich: From structure chart to code
kurz: Generate Python and JavaScript code from the structure chart and run JavaScript straight in the browser.
---

## The same diagram, three languages

In the code view (**{ } Code** in the toolbar) you choose the language at the top. The structure chart stays the same; only the way it is written changes. That way you can compare the languages easily.

::: diagramm l18-beispiel.visustruct
A number is made smaller by 3 again and again until it is no longer greater than 0.
:::

## Python

For the diagram above, VisuStruct generates this Python code:

\`\`\`
number = int(input("Start value?"))
while number > 0:
    print(number)
    number = number - 3
print("End")
\`\`\`

What is different in Python compared with Java:

- There are **no semicolons** and **no curly brackets**. Python recognises what belongs to a loop or a branch by the **indentation** alone. After \`while\`, \`if\` and \`else\` there is a colon.
- Variables get **no data type**: \`int number = 5\` becomes \`number = 5\`.
- Output is called \`print(…)\`, input \`input(…)\`. For a number, \`int(…)\` goes around it.
- In Python, arrays are called **lists**: \`int[] numbers = {2, 4, 6}\` becomes \`numbers = [2, 4, 6]\`, and \`numbers.length\` becomes \`len(numbers)\`.
- A simple for loop such as \`int i = 0\`, \`i < 5\`, \`i++\` becomes \`for i in range(5):\`.

## What to watch out for in Python

In some places Python is stricter than Java. That is why VisuStruct translates the Java way of writing things when it exports:

- **Text and number with +:** \`"Sum: " + sum\` becomes \`"Sum: " + str(sum)\`. Without \`str(…)\`, Python stops with an error.
- **There is no i++:** it becomes \`i += 1\`.
- **&&, || and !** are called \`and\`, \`or\` and \`not\` in Python, and \`true\` and \`false\` become \`True\` and \`False\`.
- **Whole-number division:** In Python, \`7 / 2\` always gives 3.5. If the structure chart divides two \`int\` values, VisuStruct writes \`7 // 2\`, which gives 3, just like in Java.
- **For loops:** Counting loops become \`for … in range(…)\`, also with \`i <= n\`, counting backwards or steps such as \`i = i + 2\`. If a loop does not fit that pattern, it becomes a \`while\` loop.
- **There is no do-while:** it becomes \`while True:\` with \`if not (…): break\` at the end.

If a diagram is marked as **pseudocode**, only a note appears above the code. Then the text is a sketch and not a runnable program.

## JavaScript

The same diagram in JavaScript:

\`\`\`
"use strict";

let number = parseInt((prompt("Start value?") ?? "0"), 10);
while (number > 0) {
    console.log(number);
    number = number - 3;
}
console.log("End");
\`\`\`

JavaScript looks similar to Java: curly brackets, semicolons, \`while (…)\` and \`if (…)\`. The differences:

- Variables are created with \`let\`, without a data type. Constants with \`const\`.
- Output is called \`console.log(…)\`, input \`prompt(…)\`. \`parseInt(…)\` turns the input into a whole number.
- Arrays go in square brackets: \`let numbers = [2, 4, 6];\`.
- \`"use strict";\` at the very top makes JavaScript complain about typos in variable names.
- JavaScript has only one number type. If the structure chart divides two \`int\` values, VisuStruct writes \`Math.trunc(a / b)\`. Then the digits after the decimal point are dropped, just like in Java.

## Run JavaScript in the browser

JavaScript is the language of browsers. That is why VisuStruct can **run the code straight away**:

::: angeberwissen
Why are links in the browser blue, anyway? In 1985 Ben Shneiderman's team tested which colour is easy to see but does not get in the way when you read. Light blue won. Red stood out more, but people remembered the text less well afterwards. [More fun facts](https://visustruct.org/en/angeberwissen.html)
:::

1. Choose **JavaScript** in the code view.
2. Click **Test in browser**.
3. Whatever \`console.log\` outputs appears under **Output**. If the program asks for a value with \`prompt\`, type it in and click **OK**.
4. **Stop** cancels the program.

VisuStruct stops an endless loop \`while (true)\` by itself after 100,000 passes and reports **Execution stopped: possible infinite loop.**

> In JavaScript code, a **Call** needs a subprogram with that name, otherwise JavaScript reports an error. Unlike the simulation, the browser does not look in the other tabs.

## Exercise: Python as a structure chart

This Python program outputs all even numbers from 0 up to a limit:

\`\`\`
limit = int(input("Up to which number?"))
for i in range(0, limit + 1, 2):
    print(i)
\`\`\`

\`range(0, limit + 1, 2)\` means: start at 0, stop before \`limit + 1\`, count in steps of two.

::: übung l18-python
titel: Even numbers
auftrag: Rebuild the Python program above as a structure chart with a for loop. With the limit 7 it outputs 0, 2, 4 and 6.
test: 7 -> 0 | 2 | 4 | 6
test: 4 -> 0 | 2 | 4
test: 0 -> 0
braucht: forSchleife
tipp: \`range(0, limit + 1, 2)\` counts from 0 up to the limit in steps of two. That is a for loop.
tipp: The three fields of the for loop are \`int i = 0\`, \`i <= limit\` and \`i = i + 2\`.
lösung: l18-python-loesung.visustruct
:::

## Exercise: JavaScript as a structure chart

\`\`\`
let age = parseInt((prompt("How old are you?") ?? "0"), 10);
if (age >= 16) {
    console.log("You may vote.");
} else {
    let years = 16 - age;
    console.log("Wait " + years + " more years.");
}
\`\`\`

::: übung l18-js
titel: Voting from 16
auftrag: Rebuild the JavaScript code above as a structure chart. Then test in the code view with **JavaScript** and **Test in browser** whether your code outputs the same as the simulation.
test: 12 -> Wait 4 more years.
test: 16 -> You may vote.
test: 13 -> Wait 3 more years.
test: 40 -> You may vote.
braucht: verzweigung
tipp: Read the code line by line. \`if\` and \`else\` become a branch.
tipp: \`prompt\` and \`parseInt\` together are one input: \`input: int age "How old are you?"\`. The false path holds two boxes: first \`int years = 16 - age\`, then the output.
lösung: l18-js-loesung.visustruct
:::

## Checklist

::: checkliste
- I can choose and compare Python and JavaScript in the code view. → The same diagram, three languages
- I know that Python forms blocks by indentation and needs no data types. → Python
- I know what VisuStruct adjusts when translating to Python. → What to watch out for in Python
- I can run JavaScript with Test in browser. → Run JavaScript in the browser
:::

## Quiz

::: quiz
? How does Python recognise which lines belong to a loop?
- [ ] By the curly brackets
- [x] By the indentation
- [ ] By the semicolon at the end of the line

? What is \`output: sum\` in JavaScript?
- [ ] print(sum)
- [ ] System.out.println(sum);
- [x] console.log(sum);

? Which language can VisuStruct run straight in the browser?
- [ ] Java
- [ ] Python
- [x] JavaScript
> Every browser can run JavaScript. For Java and Python you need a program of its own.

? What happens in Python with \`print("Sum: " + sum)\` if sum is the number 7?
- [ ] Sum: 7 is output.
- [x] Python reports an error, because text and a number cannot be joined with +.
- [ ] Sum: is output.
> str(sum) turns the number into text.
:::
`,Ur=`Technical terms for the learning area. When a term appears in a step, it is marked there once and shows its explanation
on hover or tap. If it is in bold in that step, it is being explained right there and is not marked.
\`also:\` lists other forms that are recognised too. Upper and lower case matter.

### Algorithm
also: algorithm, algorithms, Algorithms
Exact step-by-step instructions for solving a task. Every step is clear.

### Structure chart
also: structure chart, structure charts, Structure charts, Nassi-Shneiderman diagram, Nassi-Shneiderman diagrams
An algorithm drawn as a picture made of boxes. You read it from top to bottom. It is also called a Nassi-Shneiderman diagram.

### Flowchart
also: flowchart, flowcharts, Flowcharts
An algorithm drawn as symbols joined by arrows (DIN 66001 / ISO 5807). A diamond is a decision.

### Pseudocode
also: pseudocode
An algorithm written as text in plain language with fixed words such as IF and WHILE. The indentation shows what belongs together.

### Statement
also: statement, statements, Statements
A single step in the structure chart, for example a calculation, an input or an output.

### Sequence
also: sequence, sequences, Sequences
Steps that run one after another from top to bottom, each exactly once.

### Branch
also: branch, branches, Branches, conditional statement, conditional statements
A block that uses a condition to decide which of two paths runs. It is also called a conditional statement.

### Path
also: path, paths
One of the two ways through a branch: left for true, right for false.

### Loop
also: loop, loops, Loops, iteration, repetition
A block that repeats steps as long as a condition holds.

### Loop body
also: loop body
The inside of a loop, that is, the steps that are repeated.

### Pass
also: passes
Running the inside of a loop once.

### Condition
also: condition, conditions, Conditions
A question that can only be answered with yes (true) or no (false), for example age >= 18.

### Placeholder
also: placeholder, placeholders
An empty box with the sign ø. If you drag an element onto it, the element replaces it.

### Object Inspector
The area below the diagram. Here you edit the text and settings of the box you just clicked.

### Simulation
also: simulation
Runs your structure chart in the editor, step by step if you like. That way you see what happens.

### Variable
also: variable, variables, Variables
A labelled box for a value. It has a name, a data type and a value.

### Constant
also: constant, constants, Constants
A variable whose value stays the same once it is set. You write \`const\` in front of it, e.g. \`const double VAT = 0.19\`.

### Data type
also: data type, data types, Data types
Says what kind of value fits into a variable: int (whole number), double (decimal number), String (text) or boolean (true or false).

### Assignment
also: assignment, assignments, Assignments
The sign =. It works out the right-hand side and stores the result in the variable on the left.

### Temporary variable
also: temporary variable, temporary variables, helper variable
An extra variable that keeps a value for a short time, for example when swapping.

### IPO model
also: input-process-output
Input, process, output: first ask for values, then calculate, then show the result.

### Problem analysis
also: problem analysis
You read a task carefully and work out what is given, what you are looking for and how to get from one to the other.

### Comparison operator
also: comparison operator, comparison operators, Comparison operators
A sign that compares two values, for example == or <. The result is true or false.

### Switch
also: switch, multiple selection
A block that runs exactly one of several cases, depending on the value of a variable. It is also called multiple selection.

### Pre-test loop
also: pre-test loop, pre-test loops, head-controlled
The loop checks its condition before every pass. If the condition is false right at the start, the loop does not run even once.

### Post-test loop
also: post-test loop, post-test loops, foot-controlled
The loop checks its condition only after every pass. So it always runs at least once.

### Counter variable
also: counter variable, counter variables, counter
A variable that counts along in a loop, usually i.

### Endless loop
also: endless loop, endless loops, infinite loop, infinite loops
A loop whose condition never becomes false. It never stops by itself.

### Array
also: array, arrays, Arrays
A row of slots with one shared name and the same data type.

### Index
also: index, indices, indexes
The number of a slot in an array. Counting starts at 0.

### String
also: strings, Strings
A text, that is, a row of characters. In Java the data type is called String. The characters are counted from 0.

### 2D array
also: 2D arrays, two-dimensional array, two-dimensional arrays
An array with rows and columns, like a table. A slot needs two indices, e.g. \`seats[1][2]\`.

### Subprogram
also: subprogram, subprograms, Subprograms, method, methods, Methods, procedure, procedures, function, functions, Functions
A structure chart of its own for part of a task. It runs when it is called. In Java it is called a method; depending on its kind also a procedure or a function.

### Parameter
also: parameter, parameters, Parameters
A variable in the header line of a subprogram. When it is called, it gets the value from the parentheses.

### Spaghetti code
also: spaghetti code
A program that jumps around so wildly that you can hardly follow what happens. Structure charts prevent that.

### Call by value
also: call by value
A subprogram gets a copy of the value. If it changes its parameter, the caller's variable stays the same.

### Call by reference
also: call by reference
A subprogram gets a reference to the same data, e.g. to an array. If it changes a slot, the caller sees the change too.

### Return value
also: return value, return values, Return values
The result that a subprogram hands back to the call with return.

### Break
A block that leaves the loop it is in straight away. Then the program continues below the loop.

### Desk check
also: desk check, desk checks, Desk checks
You run a structure chart on paper and write down the values of the variables after every step.

### Linear search
also: linear search
A way of searching that compares all values one after another with the value you are looking for. It also works with unsorted values.

### Binary search
also: binary search
A way of searching sorted values. It looks at the middle and keeps searching only in the matching half.

### Bubble sort
also: bubble sort, Bubblesort
A simple way of sorting. It always compares two neighbours and swaps them if they are the wrong way round.
`,Yr=`### Statement

A single step. You use it to create variables or to calculate.

\`\`\`
int number = 5
double price = 2.5
String name = "Ada"
number = number + 1
\`\`\`

### Input

Asks for a value while the chart runs and stores it in a variable. The text in quotation marks is the question.

\`\`\`
input: int age "How old are you?"
input: double price "Enter a price"
input: String name "What is your name?"
\`\`\`

### Output

Shows a text or a value. Texts go in quotation marks; you join text and variables with \`+\`.

\`\`\`
output: "Hello"
output: sum
output: "You are " + age + " years old."
\`\`\`

> In an output, \`+\` always joins the parts together: with 3 and 4, \`output: a + b\` shows 34. So calculate in a variable first, e.g. \`int sum = a + b\`, and then output \`sum\`.

### Branch

Checks a condition. If it is true, the left path (true) runs, otherwise the right one (false).

\`\`\`
age >= 18
number % 2 == 0
grade < 1 || grade > 6
\`\`\`

### Switch

Picks one of several cases, depending on the value of a variable. If no case fits, \`default\` applies. You add cases on the right with **Add Case**.

### While loop

Repeats its inside **as long as** the condition is true. The condition is checked before every pass.

\`\`\`
number != 1
i < 10
\`\`\`

### Do-while loop

Runs its inside **at least once** and checks the condition only afterwards.

### For loop

Counts a variable from a start value up to a limit. The three fields are Init, Condition and Step.

\`\`\`
int i = 0
i < 5
i++
\`\`\`

### Endless loop

Repeats its inside without a condition. A **Break** inside it lets you leave it.

### Call

Stands for a subprogram, e.g. \`calculateSum()\`. With parameters and a return value, the subprogram has a header line as its title:

\`\`\`
int square(int x)       header line of the subprogram
return x * x            hands back the result
int q = square(5)       call, q gets 25
showSum(3, 4)           call of a void subprogram
\`\`\`

### Break

Leaves the loop around it (\`break\`).

### Operators and comparisons

- \`+ - * /\` the four basic operations
- \`%\` remainder of a division (\`7 % 2\` is 1)
- \`==\` equal, \`!=\` not equal
- \`<\` \`<=\` \`>\` \`>=\` less than, less than or equal, greater than, greater than or equal
- \`&&\` and, \`||\` or

### Arrays

Several values under one name. Counting starts at 0.

\`\`\`
int[] numbers = {3, 7, 1}
output: numbers[0]
int[] empty = new int[5]
\`\`\`

A **2D array** is a table with rows and columns:

\`\`\`
boolean[][] seats = new boolean[3][5]
seats[1][4] = true
output: seats.length + " rows, " + seats[0].length + " seats"
\`\`\`
`,Xr=`---
titel: Alter im Unterprogramm
nach: 18
stufe: 2
---

Die Altersprüfung aus „Volljährig?“ wird jetzt ein eigenes Unterprogramm. Das Hauptprogramm ruft es nur noch auf.

::: übung aufgabe-alter-unterprogramm
titel: Alter im Unterprogramm
auftrag: Baue zwei Diagramme. Das Hauptprogramm gibt **Willkommen** aus, ruft dann \`pruefeAlter()\` auf und gibt zum Schluss **Auf Wiedersehen** aus.
  Das Unterprogramm \`pruefeAlter\` steht in einem eigenen Reiter: Es fragt nach dem Alter und gibt **volljährig** oder **minderjährig** aus.
test: 20 -> Willkommen | volljährig | Auf Wiedersehen
test: 18 -> Willkommen | volljährig | Auf Wiedersehen
test: 12 -> Willkommen | minderjährig | Auf Wiedersehen
braucht: aufruf
tipp: Das Hauptprogramm hat drei Kästen. Die eigentliche Arbeit macht das Unterprogramm.
tipp: Öffne die Übung im Editor und baue dort das Hauptprogramm mit dem Aufruf \`pruefeAlter()\`. Lege dann mit **+** einen neuen Reiter an und gib ihm den Titel \`pruefeAlter\`. Darin baust du die Eingabe und die Verzweigung. Prüfen findet das Unterprogramm über den Titel des Reiters.
lösung: aufgabe-alter-haupt-loesung.visustruct
unterprogramm: aufgabe-alter-unterprogramm-loesung.visustruct
:::
`,Qr=`---
titel: Binärzahl
nach: 11
stufe: 3
---

Computer rechnen mit nur zwei Ziffern: 0 und 1. So wandelst du eine Zahl ins **Binärsystem** um:

1. Teile die Zahl durch 2 und merke dir den Rest (0 oder 1).
2. Rechne mit dem Ergebnis ohne Rest weiter.
3. Wiederhole das, bis die Zahl 0 ist.

Die Reste von **unten nach oben** gelesen ergeben die Binärzahl. Bei 6 sind die Reste 0, 1, 1, also lautet die Binärzahl 110.

::: übung aufgabe-binaer
titel: Binärzahl
auftrag: Frage nach einer ganzen Zahl größer als 0 und gib sie als Binärzahl aus. Bei 6 lautet die Ausgabe **110**, bei 13 **1101**.
test: 6 -> 110
test: 13 -> 1101
test: 1 -> 1
test: 8 -> 1000
braucht: whileSchleife
tipp: Teile die Zahl immer wieder durch 2 und merke dir jeden Rest. Die Reste rückwärts gelesen ergeben die Binärzahl.
tipp: Sammle die Ziffern in einem Text: \`String binaer = ""\`. In der Schleife berechnest du \`int rest = zahl % 2\` und hängst den Rest **vorne** an: \`binaer = rest + binaer\`. Danach \`zahl = zahl / 2\`. Weil zahl eine ganze Zahl ist, fällt der Rest dabei weg.
lösung: aufgabe-binaer-loesung.visustruct
:::
`,Jr=`---
titel: Collatz-Folge
nach: 11
stufe: 2
---

Die Collatz-Folge ist ein berühmtes Rätsel der Mathematik. Du beginnst mit einer Zahl und wendest immer wieder dieselbe Regel an:

- Ist die Zahl **gerade**, teilst du sie durch 2.
- Ist sie **ungerade**, rechnest du mal 3 plus 1.

Bisher endet die Folge bei jeder ausprobierten Startzahl irgendwann bei 1. Ob das für alle Zahlen gilt, weiß bis heute niemand.

::: übung aufgabe-collatz
titel: Collatz-Folge
auftrag: Frage nach einer Startzahl. Wende die Regel so lange an, bis die Zahl 1 ist, und gib nach jedem Schritt die neue Zahl aus. Zähle dabei die Schritte mit und gib am Ende **Schritte:** und die Anzahl aus.
  Bei der Startzahl 6 lautet die Folge 3, 10, 5, 16, 8, 4, 2, 1. Das sind 8 Schritte.
test: 6 -> 3 | 10 | 5 | 16 | 8 | 4 | 2 | 1 | Schritte: 8
test: 3 -> 10 | 5 | 16 | 8 | 4 | 2 | 1 | Schritte: 7
test: 1 -> Schritte: 0
braucht: whileSchleife, verzweigung
tipp: Du weißt nicht, wie viele Schritte es werden. Darum passt eine While-Schleife besser als eine For-Schleife.
tipp: Die While-Schleife läuft, solange \`zahl != 1\` gilt. Ob eine Zahl gerade ist, prüfst du mit \`zahl % 2 == 0\`. Die Ausgabe und \`schritte++\` kommen nach der Verzweigung, aber noch in die Schleife.
lösung: aufgabe-collatz-loesung.visustruct
:::

::: angeberwissen
Mit dieser Aufgabe kann man reich werden! Der Mathematiker Paul Erdős setzte für einen Beweis 500 Dollar aus. 2021 legte die japanische Firma Bakuage noch einiges drauf: 120 Millionen Yen, damals umgerechnet rund eine Million Dollar, für einen Beweis oder ein Gegenbeispiel. Abgeholt hat das Geld bis heute niemand. Erfunden hat das Rätsel übrigens der deutsche Mathematiker Lothar Collatz im Jahr 1937. Ich rechne gleich mal los, für so viel Geld gibt es eine Menge Heu.
:::
`,Or=`---
titel: Fibonacci-Zahlen
nach: 13
stufe: 2
---

Bei den Fibonacci-Zahlen ist jede Zahl die Summe der beiden Zahlen davor. Die Folge beginnt mit 1 und 1:

1, 1, 2, 3, 5, 8, 13, 21, …

Diese Zahlen findest du erstaunlich oft in der Natur, zum Beispiel bei der Anordnung von Sonnenblumenkernen.

::: übung aufgabe-fibonacci
titel: Fibonacci-Zahlen
auftrag: Frage, wie viele Fibonacci-Zahlen ausgegeben werden sollen. Gib dann genau so viele aus, jede in einer eigenen Zeile. Du kannst davon ausgehen, dass mindestens 2 eingegeben wird.
test: 5 -> 1 | 1 | 2 | 3 | 5
test: 8 -> 1 | 1 | 2 | 3 | 5 | 8 | 13 | 21
test: 2 -> 1 | 1
braucht: forSchleife
tipp: Jede neue Zahl ist die Summe der beiden vorherigen. Du musst dir also immer die letzten zwei Zahlen merken.
tipp: Merke dir die beiden letzten Zahlen in \`zahl1\` und \`zahl2\` und gib beide vor der Schleife aus. Die Schleife beginnt bei \`int i = 2\`. Darin berechnest du \`int zahl3 = zahl1 + zahl2\`, gibst sie aus und schiebst dann weiter: \`zahl1 = zahl2\` und \`zahl2 = zahl3\`.
lösung: aufgabe-fibonacci-loesung.visustruct
:::
`,$r=`---
titel: Gerade oder ungerade
nach: 8
stufe: 1
---

Eine Zahl ist gerade, wenn beim Teilen durch 2 kein Rest bleibt. Den Rest berechnest du mit \`%\`: \`8 % 2\` ist 0, \`7 % 2\` ist 1.

::: übung aufgabe-gerade
titel: Gerade oder ungerade
auftrag: Frage nach einer ganzen Zahl. Gib aus, ob sie gerade oder ungerade ist. Bei 4 lautet die Ausgabe **4 ist gerade**, bei 7 **7 ist ungerade**.
test: 4 -> 4 ist gerade
test: 7 -> 7 ist ungerade
test: 0 -> 0 ist gerade
test: 15 -> 15 ist ungerade
braucht: verzweigung
tipp: Eine Verzweigung entscheidet zwischen gerade und ungerade. Gerade heißt: durch 2 teilbar ohne Rest.
tipp: Die Bedingung lautet \`zahl % 2 == 0\`. In der Ausgabe verbindest du die Zahl und den Text mit \`+\`, z. B. \`zahl + " ist gerade"\`.
lösung: aufgabe-gerade-loesung.visustruct
:::
`,Kr=`---
titel: Mehrwertsteuer
nach: 6
stufe: 1
---

Auf fast alles, was du kaufst, kommen 19 % **Mehrwertsteuer**. Der Laden rechnet mit dem Nettopreis (ohne Steuer) und schlägt die Steuer drauf. So entsteht der Bruttopreis, den du an der Kasse zahlst.

Ein Beispiel: Du kaufst ein Falt-Handy, das aufgeklappt zum Tablet wird. Auf dem Preisschild des Händlers stehen 1000 € netto. Dazu kommen 19 %, also 190 €. An der Kasse zahlst du 1190 €. Die 190 € darf der Händler nicht behalten: Er führt sie an das Finanzamt ab.

::: grafik aufgabe-mehrwertsteuer.svg
Nettopreis plus Mehrwertsteuer ergibt den Bruttopreis. Die Mehrwertsteuer geht an das Finanzamt.
:::

::: angeberwissen
Mäh, der Händler hat das Handy ja selbst eingekauft: beim Hersteller für 800 € plus 152 € Mehrwertsteuer. Diese 152 € heißen **Vorsteuer**, und die darf er von den 190 € abziehen. Ans Finanzamt überweist er also nur 38 €. Die ganze Steuer zahlt am Ende nur einer: der Kunde an der Kasse. Also du. Ich zahle übrigens gar keine, ich fresse nur Gras.
:::

Der Steuersatz ändert sich beim Rechnen nie. Darum legst du ihn als **Konstante** an: Das ist eine Variable, deren Wert nach dem Festlegen gleich bleibt. Du schreibst \`const\` davor, zum Beispiel \`const double MWST = 0.19\`. Namen von Konstanten schreibt man in Großbuchstaben, dann erkennt man sie sofort. Im Java-Code wird daraus \`final double MWST = 0.19;\`.

Wenn sich der Steuersatz einmal ändert, musst du nur diese eine Zeile anpassen.

::: übung aufgabe-mehrwertsteuer
titel: Mehrwertsteuer
auftrag: Lege die Konstante \`MWST\` mit dem Wert 0.19 an. Frage dann nach dem Nettopreis. Gib zuerst die Steuer und danach den Bruttopreis aus, jeweils nur die Zahl.
  Bei einem Nettopreis von 100 lauten die Ausgaben **19** und **119**.
test: 100 -> 19 | 119
test: 50 -> 9.5 | 59.5
test: 0 -> 0 | 0
tipp: Die Steuer ist 19 Prozent vom Nettopreis. Der Bruttopreis ist das, was man am Ende bezahlt.
tipp: Die Steuer ist \`nettopreis * MWST\`. Den Bruttopreis bekommst du, wenn du die Steuer zum Nettopreis addierst. Beide Werte sind Kommazahlen, also \`double\`.
lösung: aufgabe-mehrwertsteuer-loesung.visustruct
:::

::: quiz
? Warum legst du den Steuersatz als Konstante an?
- [ ] Weil Konstanten schneller gerechnet werden
- [x] Weil sich sein Wert im Programm nicht ändern soll
- [ ] Weil man Kommazahlen nur als Konstante speichern kann
> Eine Konstante behält ihren Wert. Ändert sich der Steuersatz einmal, passt du nur die eine Zeile mit \`const\` an.
:::
`,qr=`---
titel: Notendurchschnitt
nach: 13
stufe: 2
---

Wie gut war die letzte Zeit? Der Durchschnitt ist die Summe aller Noten geteilt durch ihre Anzahl.

::: übung aufgabe-durchschnitt
titel: Notendurchschnitt
auftrag: Frage zuerst, wie viele Noten eingegeben werden. Lies dann genau so viele Noten ein und gib den Durchschnitt aus, nur die Zahl.
  Bei den Noten 1 und 2 ist der Durchschnitt **1.5**.
test: 2, 1, 2 -> 1.5
test: 3, 1, 2, 3 -> 2
test: 4, 2, 2, 3, 4 -> 2.75
braucht: forSchleife
tipp: Du brauchst die Summe aller Noten und ihre Anzahl. Der Durchschnitt ist die Summe geteilt durch die Anzahl.
tipp: Die For-Schleife läuft von \`int i = 0\` bis \`i < anzahl\`. Darin liest du eine Note ein und zählst sie zur Summe. Den Durchschnitt speicherst du als Kommazahl: \`double schnitt = summe * 1.0 / anzahl\`. Das \`* 1.0\` sorgt dafür, dass auch in Java nicht ganzzahlig geteilt wird.
lösung: aufgabe-durchschnitt-loesung.visustruct
:::
`,ea=`---
titel: PIN prüfen
nach: 12
stufe: 2
---

Am Geldautomaten hast du drei Versuche für deine PIN. Gibst du dreimal eine falsche PIN ein, wird die Karte gesperrt.

::: übung aufgabe-pin
titel: PIN prüfen
auftrag: Die richtige PIN ist 1234. Frage so lange nach der PIN, bis sie richtig ist oder drei Versuche verbraucht sind. Gib danach **PIN richtig** oder **Karte gesperrt** aus.
test: 1234 -> PIN richtig
test: 1111, 1234 -> PIN richtig
test: 1, 2, 1234 -> PIN richtig
test: 1, 2, 3 -> Karte gesperrt
braucht: doUntilSchleife, verzweigung
tipp: Die Schleife endet in zwei Fällen: wenn die PIN stimmt oder wenn drei Versuche verbraucht sind. Zähle die Versuche mit.
tipp: Die PIN wird mindestens einmal abgefragt, deshalb passt eine Do-while-Schleife. Lege vorher \`int pin = 0\` und \`int versuche = 0\` an. Die Schleife wiederholt sich, solange \`pin != 1234 && versuche < 3\` gilt. Nach der Schleife entscheidet eine Verzweigung, was ausgegeben wird.
lösung: aufgabe-pin-loesung.visustruct
:::
`,ta=`---
titel: Schiffe versenken
nach: 16
stufe: 2
---

Beim Spiel Schiffe versenken ist das Meer ein Gitter. Die Spalten heißen A bis E, die Reihen 1 bis 5. Im Startdiagramm steht das Meer als 2D-Array \`meer\`: \`true\` heißt, auf diesem Feld liegt ein Teil eines Schiffs.

::: grafik schiffe-versenken.svg
Grau heißt \`true\`: Hier liegt ein Schiff. Die kleinen grauen Zahlen sind die Indizes im Array, sie beginnen bei 0. Im Spiel heißen die Felder dagegen A bis E und 1 bis 5.
:::

::: übung aufgabe-schiffe
titel: Schiffe versenken
auftrag: Gib alle Felder aus, auf denen ein Schiff liegt, jedes Feld in einer eigenen Zeile, z. B. **B1**. Gehe dafür mit zwei verschachtelten Schleifen Reihe für Reihe durch das Meer.
  Für das Startdiagramm erscheinen **B1**, **C1**, **D1**, **E3**, **E4** und **A5**.
start: aufgabe-schiffe-start.visustruct
test: - -> B1 | C1 | D1 | E3 | E4 | A5
braucht: forSchleife, verzweigung
tipp: Gehe das Meer wie den Kinosaal mit zwei verschachtelten Schleifen durch. Gib nur die Felder aus, auf denen \`true\` steht.
tipp: Die äußere Schleife zählt \`reihe\`, die innere \`spalte\`, beide ab 0. Liegt auf \`meer[reihe][spalte]\` ein Schiff, gibst du den Buchstaben aus \`spalten[spalte]\` und die Reihennummer aus: \`output: spalten[spalte] + (reihe + 1)\`. Das \`+ 1\` braucht es, weil das Spiel bei 1 zu zählen beginnt.
lösung: aufgabe-schiffe-loesung.visustruct
:::
`,na=`---
titel: Speisekarte
nach: 10
stufe: 1
---

In der Mensa bestellst du über eine Nummer. Das Programm sagt dir, welches Gericht zu der Nummer gehört.

::: übung aufgabe-speisekarte
titel: Speisekarte
auftrag: Frage nach einer Nummer. Gib bei 1 **Griechischer Salat**, bei 2 **Reis-Bowl** und bei 3 **Falafel-Wrap** aus. Bei jeder anderen Nummer gib **Bitte eine gültige Nummer wählen** aus.
test: 1 -> Griechischer Salat
test: 2 -> Reis-Bowl
test: 3 -> Falafel-Wrap
test: 7 -> Bitte eine gültige Nummer wählen
braucht: fallauswahl
tipp: Für mehrere feste Nummern passt eine Fallauswahl. Was passiert mit allen anderen Nummern?
tipp: Lies die Nummer mit \`input: int nummer "Welches Gericht?"\` ein. Die Fallauswahl prüft \`nummer\`, die Fälle heißen \`1\`, \`2\` und \`3\`. Alle anderen Nummern landen im Fall \`default\`.
lösung: aufgabe-speisekarte-loesung.visustruct
:::
`,ia=`---
titel: Summe bilden
nach: 2
stufe: 1
---

Lege zwei Zahlen fest, addiere sie und gib das Ergebnis aus.

::: übung aufgabe-summe
titel: Summe bilden
auftrag: Lege \`zahl1\` mit dem Wert 4 und \`zahl2\` mit dem Wert 3 fest. Berechne die Summe in einer dritten Variablen und gib nur die Summe aus.
test: - -> 7
tipp: Du brauchst drei Variablen: zwei für die Zahlen und eine für das Ergebnis.
tipp: Eine Variable legst du mit einer Anweisung wie \`int zahl1 = 4\` fest. Für die Ausgabe schreibst du den Namen der Variablen ohne Anführungszeichen.
lösung: aufgabe-summe-loesung.visustruct
:::
`,sa=`---
titel: Tafeldienst auslosen
nach: 15
stufe: 2
---

Wer hat diese Woche Tafeldienst? Fünf Namen kommen in ein Array, dann wird eine Losnummer gezogen.

::: übung aufgabe-tafeldienst
titel: Tafeldienst auslosen
auftrag: Lies fünf Namen in ein String-Array ein. Frage danach nach einer Losnummer von 1 bis 5 und gib **Tafeldienst:** und den passenden Namen aus.
  Die Losnummer 1 gehört zum ersten Namen, die 5 zum letzten.
test: Ada, Ben, Cem, Dana, Emil, 3 -> Tafeldienst: Cem
test: Ada, Ben, Cem, Dana, Emil, 1 -> Tafeldienst: Ada
test: Lea, Max, Nia, Ole, Pia, 5 -> Tafeldienst: Pia
braucht: forSchleife
tipp: Erst liest eine Schleife die fünf Namen ein. Danach brauchst du keine Schleife mehr, nur noch einen Zugriff auf ein Fach.
tipp: Mit \`String[] namen = new String[5]\` legst du das Array an. Achtung: Die Losnummer beginnt bei 1, der Index bei 0. Der Name steht also in \`namen[nummer - 1]\`.
lösung: aufgabe-tafeldienst-loesung.visustruct
:::

> Mit \`int nummer = (int) (Math.random() * 5) + 1\` kannst du die Losnummer auch vom Zufall ziehen lassen. Für die automatische Prüfung brauchen wir aber eine feste Eingabe.
`,ra='---\ntitel: Taschenrechner\nnach: 10\nstufe: 2\n---\n\nEin kleiner Taschenrechner: zwei Zahlen und ein Rechenzeichen eingeben, das Ergebnis erscheint.\n\n::: übung aufgabe-rechner\ntitel: Taschenrechner\nauftrag: Frage nach zwei ganzen Zahlen und danach nach einem Rechenzeichen als Text: `+`, `-` oder `*`. Gib das Ergebnis aus. Bei einem anderen Zeichen gib **Unbekanntes Rechenzeichen** aus.\ntest: 3, 4, + -> 7\ntest: 10, 4, - -> 6\ntest: 6, 7, * -> 42\ntest: 1, 2, x -> Unbekanntes Rechenzeichen\nbraucht: fallauswahl\ntipp: Lies alle drei Werte ein. Eine Fallauswahl über das Rechenzeichen entscheidet dann, was gerechnet wird.\ntipp: Das Rechenzeichen liest du mit `input: String zeichen "Rechenzeichen"` ein. Die Fallauswahl prüft `zeichen`, die Fälle heißen `"+"`, `"-"` und `"*"`, der letzte Fall ist `default`. Rechne in jedem Fall erst in einer Variablen und gib sie dann aus, sonst hängt `+` die Zahlen nur aneinander.\nlösung: aufgabe-rechner-loesung.visustruct\n:::\n',aa=`---
titel: Verleih-Menü
nach: 18
stufe: 2
---

Am Verleih-Automaten kannst du nacheinander mehrere Fahrzeuge buchen. Das Menü erscheint immer wieder, bis du **0** für Ende wählst.

::: übung aufgabe-verleih
titel: Verleih-Menü
auftrag: Frage immer wieder nach einer Auswahl: 1 = E-Bike, 2 = E-Scooter, 0 = Ende. Gib bei 1 **E-Bike gebucht** und bei 2 **E-Scooter gebucht** aus, bei jeder anderen Zahl **Ungültige Auswahl**.
  Bei 0 gibt das Programm **Tschüss** aus und verlässt die Schleife mit einem Aussprung.
test: 0 -> Tschüss
test: 1, 2, 0 -> E-Bike gebucht | E-Scooter gebucht | Tschüss
test: 2, 5, 1, 0 -> E-Scooter gebucht | Ungültige Auswahl | E-Bike gebucht | Tschüss
braucht: endlosschleife, aussprung
tipp: Das Menü läuft immer wieder, bis jemand 0 wählt. Dafür eignet sich eine Endlosschleife mit einem Aussprung.
tipp: Nimm eine Endlosschleife. Darin steht zuerst die Eingabe \`input: int wahl "1 = E-Bike, 2 = E-Scooter, 0 = Ende"\`, danach eine Fallauswahl über \`wahl\` mit den Fällen \`0\`, \`1\`, \`2\` und \`default\`. Im Fall \`0\` stehen die Ausgabe und darunter der Aussprung.
lösung: aufgabe-verleih-loesung.visustruct
:::
`,la=`---
titel: Volljährig?
nach: 8
stufe: 1
---

Im Kino, beim Führerschein oder bei der Wahl: Oft kommt es darauf an, ob jemand schon 18 ist.

::: übung aufgabe-volljaehrig
titel: Volljährig?
auftrag: Frage nach dem Alter. Ist die Person 18 oder älter, gib **volljährig** aus, sonst **minderjährig**.
test: 18 -> volljährig
test: 35 -> volljährig
test: 17 -> minderjährig
test: 6 -> minderjährig
braucht: verzweigung
tipp: Es gibt zwei mögliche Ausgaben, also brauchst du eine Verzweigung.
tipp: Lies das Alter mit \`input: int alter "Wie alt bist du?"\` ein. Die Bedingung der Verzweigung lautet \`alter >= 18\`. Achte darauf, dass 18 schon volljährig ist.
lösung: aufgabe-volljaehrig-loesung.visustruct
:::
`,oa=`---
titel: Zahl verdoppeln
nach: 2
stufe: 1
---

Eine Variable kann ihren Wert ändern. Hier wird eine Zahl verdoppelt.

::: übung aufgabe-verdoppeln
titel: Zahl verdoppeln
auftrag: Lege die Variable \`zahl\` mit dem Wert 4 fest. Verdopple sie in einer zweiten Anweisung, ohne eine neue Variable anzulegen. Gib danach **Verdoppelte Zahl: 8** aus, wobei die 8 aus der Variablen kommt.
test: - -> Verdoppelte Zahl: 8
tipp: Verdoppeln heißt: mal 2. Das Ergebnis speicherst du wieder in derselben Variablen.
tipp: \`zahl = zahl * 2\` rechnet mit dem alten Wert und speichert das Ergebnis wieder in \`zahl\`. Text und Variable verbindest du mit \`+\`.
lösung: aufgabe-verdoppeln-loesung.visustruct
:::
`,ua=`---
titel: Age in a subprogram
nach: 18
stufe: 2
---

The age check from “Adult?” now becomes a subprogram of its own. The main program only calls it.

::: übung aufgabe-alter-unterprogramm
titel: Age in a subprogram
auftrag: Build two diagrams. The main program outputs **Welcome**, then calls \`checkAge()\` and finally outputs **Goodbye**.
  The subprogram \`checkAge\` is in a tab of its own: it asks for the age and outputs **adult** or **minor**.
test: 20 -> Welcome | adult | Goodbye
test: 18 -> Welcome | adult | Goodbye
test: 12 -> Welcome | minor | Goodbye
braucht: aufruf
tipp: The main program has three boxes. The subprogram does the real work.
tipp: Open the exercise in the editor and build the main program there with the call \`checkAge()\`. Then open a new tab with **+** and give it the title \`checkAge\`. Build the input and the branch in it. Check finds the subprogram by the title of the tab.
lösung: aufgabe-alter-haupt-loesung.visustruct
unterprogramm: aufgabe-alter-unterprogramm-loesung.visustruct
:::
`,ha=`---
titel: Binary number
nach: 11
stufe: 3
---

Computers calculate with only two digits: 0 and 1. This is how you convert a number into the **binary system**:

1. Divide the number by 2 and remember the remainder (0 or 1).
2. Carry on with the result without the remainder.
3. Repeat this until the number is 0.

The remainders read **from bottom to top** give the binary number. For 6 the remainders are 0, 1, 1, so the binary number is 110.

::: übung aufgabe-binaer
titel: Binary number
auftrag: Ask for a whole number greater than 0 and output it as a binary number. For 6 the output is **110**, for 13 **1101**.
test: 6 -> 110
test: 13 -> 1101
test: 1 -> 1
test: 8 -> 1000
braucht: whileSchleife
tipp: Keep dividing the number by 2 and remember every remainder. The remainders read backwards give the binary number.
tipp: Collect the digits in a text: \`String binary = ""\`. In the loop you calculate \`int remainder = number % 2\` and add the remainder at the **front**: \`binary = remainder + binary\`. After that, \`number = number / 2\`. Because number is a whole number, the remainder is dropped.
lösung: aufgabe-binaer-loesung.visustruct
:::
`,ma=`---
titel: Collatz sequence
nach: 11
stufe: 2
---

The Collatz sequence is a famous puzzle in mathematics. You start with a number and apply the same rule again and again:

- If the number is **even**, you divide it by 2.
- If it is **odd**, you multiply it by 3 and add 1.

So far, for every start number anyone has tried, the sequence ends at 1 at some point. Whether this is true for all numbers, nobody knows to this day.

::: übung aufgabe-collatz
titel: Collatz sequence
auftrag: Ask for a start number. Apply the rule until the number is 1, and output the new number after every step. Count the steps as you go and output **Steps:** and the count at the end.
  With the start number 6 the sequence is 3, 10, 5, 16, 8, 4, 2, 1. That is 8 steps.
test: 6 -> 3 | 10 | 5 | 16 | 8 | 4 | 2 | 1 | Steps: 8
test: 3 -> 10 | 5 | 16 | 8 | 4 | 2 | 1 | Steps: 7
test: 1 -> Steps: 0
braucht: whileSchleife, verzweigung
tipp: You do not know how many steps there will be. That is why a while loop fits better than a for loop.
tipp: The while loop runs as long as \`number != 1\`. You check whether a number is even with \`number % 2 == 0\`. The output and \`steps++\` come after the branch, but still inside the loop.
lösung: aufgabe-collatz-loesung.visustruct
:::

::: angeberwissen
This task could make you rich! The mathematician Paul Erdős offered 500 dollars for a proof. In 2021 the Japanese company Bakuage added quite a bit more: 120 million yen, about a million dollars at the time, for a proof or a counterexample. Nobody has collected the money yet. By the way, the puzzle was invented by the German mathematician Lothar Collatz in 1937. I am going to start calculating right now; that much money buys a lot of hay.
:::
`,ca=`---
titel: Fibonacci numbers
nach: 13
stufe: 2
---

With the Fibonacci numbers, every number is the sum of the two numbers before it. The sequence starts with 1 and 1:

1, 1, 2, 3, 5, 8, 13, 21, …

You find these numbers surprisingly often in nature, for example in the way sunflower seeds are arranged.

::: übung aufgabe-fibonacci
titel: Fibonacci numbers
auftrag: Ask how many Fibonacci numbers should be output. Then output exactly that many, each on its own line. You can assume that at least 2 is typed in.
test: 5 -> 1 | 1 | 2 | 3 | 5
test: 8 -> 1 | 1 | 2 | 3 | 5 | 8 | 13 | 21
test: 2 -> 1 | 1
braucht: forSchleife
tipp: Every new number is the sum of the two before it. So you always have to remember the last two numbers.
tipp: Keep the last two numbers in \`number1\` and \`number2\` and output both before the loop. The loop starts at \`int i = 2\`. Inside it you calculate \`int number3 = number1 + number2\`, output it and then move on: \`number1 = number2\` and \`number2 = number3\`.
lösung: aufgabe-fibonacci-loesung.visustruct
:::
`,da=`---
titel: Even or odd
nach: 8
stufe: 1
---

A number is even if there is no remainder when you divide it by 2. You calculate the remainder with \`%\`: \`8 % 2\` is 0, \`7 % 2\` is 1.

::: übung aufgabe-gerade
titel: Even or odd
auftrag: Ask for a whole number. Output whether it is even or odd. For 4 the output is **4 is even**, for 7 **7 is odd**.
test: 4 -> 4 is even
test: 7 -> 7 is odd
test: 0 -> 0 is even
test: 15 -> 15 is odd
braucht: verzweigung
tipp: A branch decides between even and odd. Even means: can be divided by 2 without a remainder.
tipp: The condition is \`number % 2 == 0\`. In the output you join the number and the text with \`+\`, e.g. \`number + " is even"\`.
lösung: aufgabe-gerade-loesung.visustruct
:::
`,ga=`---
titel: Sales tax
nach: 6
stufe: 1
---

In Germany, 19 % **VAT** (value added tax, a kind of sales tax) is added to almost everything you buy. The shop calculates with the net price (without tax) and adds the tax on top. That gives the gross price you pay at the till.

An example: you buy a folding phone that opens up into a tablet. The shop's price tag says 1000 euros net. On top of that come 19 %, so 190 euros. At the till you pay 1190 euros. The shop is not allowed to keep the 190 euros: it passes them on to the tax office.

::: grafik aufgabe-mehrwertsteuer.svg
Net price plus VAT gives the gross price. The VAT goes to the tax office.
:::

::: angeberwissen
Baah, the shop bought the phone itself, of course: from the manufacturer for 800 euros plus 152 euros VAT. These 152 euros are called **input tax**, and the shop may subtract them from the 190 euros. So it only transfers 38 euros to the tax office. In the end only one person pays the whole tax: the customer at the till. That is you. I pay no tax at all, by the way. I just eat grass.
:::

The tax rate never changes while you calculate. That is why you create it as a **constant**: a variable whose value stays the same once it is set. You write \`const\` in front of it, for example \`const double VAT = 0.19\`. Names of constants are written in capital letters so you recognise them straight away. In Java code this becomes \`final double VAT = 0.19;\`.

If the tax rate ever changes, you only have to change this one line.

::: übung aufgabe-mehrwertsteuer
titel: Sales tax
auftrag: Create the constant \`VAT\` with the value 0.19. Then ask for the net price. First output the tax and then the gross price, only the number each time.
  For a net price of 100 the outputs are **19** and **119**.
test: 100 -> 19 | 119
test: 50 -> 9.5 | 59.5
test: 0 -> 0 | 0
tipp: The tax is 19 percent of the net price. The gross price is what you pay in the end.
tipp: The tax is \`netPrice * VAT\`. You get the gross price by adding the tax to the net price. Both values are decimal numbers, so \`double\`.
lösung: aufgabe-mehrwertsteuer-loesung.visustruct
:::

::: quiz
? Why do you create the tax rate as a constant?
- [ ] Because constants are calculated faster
- [x] Because its value should not change in the program
- [ ] Because decimal numbers can only be stored as constants
> A constant keeps its value. If the tax rate ever changes, you only change the one line with \`const\`.
:::
`,pa=`---
titel: Grade average
nach: 13
stufe: 2
---

How did you do lately? The average is the sum of all grades divided by how many there are.

::: übung aufgabe-durchschnitt
titel: Grade average
auftrag: First ask how many grades will be typed in. Then read in exactly that many grades and output the average, only the number.
  For the grades 1 and 2 the average is **1.5**.
test: 2, 1, 2 -> 1.5
test: 3, 1, 2, 3 -> 2
test: 4, 2, 2, 3, 4 -> 2.75
braucht: forSchleife
tipp: You need the sum of all grades and how many there are. The average is the sum divided by the count.
tipp: The for loop runs from \`int i = 0\` while \`i < count\`. Inside it you read in a grade and add it to the sum. You store the average as a decimal number: \`double average = sum * 1.0 / count\`. The \`* 1.0\` makes sure that Java does not do whole-number division either.
lösung: aufgabe-durchschnitt-loesung.visustruct
:::
`,xa=`---
titel: Check the PIN
nach: 12
stufe: 2
---

At a cash machine you have three tries for your PIN. If you type a wrong PIN three times, the card is blocked.

::: übung aufgabe-pin
titel: Check the PIN
auftrag: The right PIN is 1234. Keep asking for the PIN until it is right or three tries have been used. Then output **PIN correct** or **Card blocked**.
test: 1234 -> PIN correct
test: 1111, 1234 -> PIN correct
test: 1, 2, 1234 -> PIN correct
test: 1, 2, 3 -> Card blocked
braucht: doUntilSchleife, verzweigung
tipp: The loop ends in two cases: when the PIN is right or when three tries have been used. Count the tries.
tipp: The PIN is asked for at least once, so a do-while loop fits. Create \`int pin = 0\` and \`int attempts = 0\` before it. The loop repeats as long as \`pin != 1234 && attempts < 3\`. After the loop, a branch decides what is output.
lösung: aufgabe-pin-loesung.visustruct
:::
`,ba=`---
titel: Battleship
nach: 16
stufe: 2
---

In the game Battleship the sea is a grid. The columns are called A to E, the rows 1 to 5. In the start diagram the sea is the 2D array \`sea\`: \`true\` means that part of a ship is on this square.

::: grafik schiffe-versenken.svg
Grey means \`true\`: there is a ship here. The small grey numbers are the indices in the array; they start at 0. In the game, on the other hand, the squares are called A to E and 1 to 5.
:::

::: übung aufgabe-schiffe
titel: Battleship
auftrag: Output all squares that have a ship on them, each square on its own line, e.g. **B1**. Go through the sea row by row with two nested loops.
  For the start diagram, **B1**, **C1**, **D1**, **E3**, **E4** and **A5** appear.
start: aufgabe-schiffe-start.visustruct
test: - -> B1 | C1 | D1 | E3 | E4 | A5
braucht: forSchleife, verzweigung
tipp: Go through the sea with two nested loops, just like the cinema. Only output the squares that hold \`true\`.
tipp: The outer loop counts \`row\`, the inner one \`column\`, both from 0. If there is a ship on \`sea[row][column]\`, you output the letter from \`columns[column]\` and the row number: \`output: columns[column] + (row + 1)\`. You need the \`+ 1\` because the game starts counting at 1.
lösung: aufgabe-schiffe-loesung.visustruct
:::
`,fa=`---
titel: Menu
nach: 10
stufe: 1
---

In the school canteen you order by number. The program tells you which dish belongs to the number.

::: übung aufgabe-speisekarte
titel: Menu
auftrag: Ask for a number. For 1 output **Greek salad**, for 2 **Rice bowl** and for 3 **Falafel wrap**. For any other number output **Please choose a valid number**.
test: 1 -> Greek salad
test: 2 -> Rice bowl
test: 3 -> Falafel wrap
test: 7 -> Please choose a valid number
braucht: fallauswahl
tipp: A switch fits several fixed numbers. What happens with all the other numbers?
tipp: Read in the number with \`input: int pick "Which dish?"\`. The switch checks \`pick\`, and the cases are called \`1\`, \`2\` and \`3\`. All other numbers end up in the case \`default\`.
lösung: aufgabe-speisekarte-loesung.visustruct
:::
`,Ia=`---
titel: Add up
nach: 2
stufe: 1
---

Set two numbers, add them and output the result.

::: übung aufgabe-summe
titel: Add up
auftrag: Set \`number1\` to the value 4 and \`number2\` to the value 3. Calculate the sum in a third variable and output only the sum.
test: - -> 7
tipp: You need three variables: two for the numbers and one for the result.
tipp: You set a variable with a statement such as \`int number1 = 4\`. For the output you write the name of the variable without quotation marks.
lösung: aufgabe-summe-loesung.visustruct
:::
`,ya=`---
titel: Draw for board duty
nach: 15
stufe: 2
---

Who is on board duty this week, cleaning the board? Five names go into an array, then a number is drawn.

::: übung aufgabe-tafeldienst
titel: Draw for board duty
auftrag: Read five names into a String array. Then ask for a draw number from 1 to 5 and output **Board duty:** and the matching name.
  Draw number 1 belongs to the first name, 5 to the last one.
test: Ada, Ben, Cem, Dana, Emil, 3 -> Board duty: Cem
test: Ada, Ben, Cem, Dana, Emil, 1 -> Board duty: Ada
test: Lea, Max, Nia, Ole, Pia, 5 -> Board duty: Pia
braucht: forSchleife
tipp: First a loop reads in the five names. After that you do not need a loop any more, just one look into a slot.
tipp: You create the array with \`String[] names = new String[5]\`. Careful: the draw number starts at 1, the index at 0. So the name is in \`names[pick - 1]\`.
lösung: aufgabe-tafeldienst-loesung.visustruct
:::

> With \`int pick = (int) (Math.random() * 5) + 1\` you can also let chance draw the number. But for the automatic check we need a fixed input.
`,za='---\ntitel: Calculator\nnach: 10\nstufe: 2\n---\n\nA small calculator: type in two numbers and an operator, and the result appears.\n\n::: übung aufgabe-rechner\ntitel: Calculator\nauftrag: Ask for two whole numbers and then for an operator as text: `+`, `-` or `*`. Output the result. For any other sign output **Unknown operator**.\ntest: 3, 4, + -> 7\ntest: 10, 4, - -> 6\ntest: 6, 7, * -> 42\ntest: 1, 2, x -> Unknown operator\nbraucht: fallauswahl\ntipp: Read in all three values. A switch on the operator then decides what is calculated.\ntipp: You read in the operator with `input: String operator "Operator"`. The switch checks `operator`, the cases are called `"+"`, `"-"` and `"*"`, and the last case is `default`. In every case, first calculate in a variable and then output it, otherwise `+` only joins the numbers together.\nlösung: aufgabe-rechner-loesung.visustruct\n:::\n',wa=`---
titel: Rental menu
nach: 18
stufe: 2
---

At the rental machine you can book several vehicles one after another. The menu keeps coming back until you choose **0** to quit.

::: übung aufgabe-verleih
titel: Rental menu
auftrag: Keep asking for a choice: 1 = e-bike, 2 = e-scooter, 0 = quit. For 1 output **E-bike booked**, for 2 **E-scooter booked**, and for any other number **Invalid choice**.
  For 0 the program outputs **Bye** and leaves the loop with a Break.
test: 0 -> Bye
test: 1, 2, 0 -> E-bike booked | E-scooter booked | Bye
test: 2, 5, 1, 0 -> E-scooter booked | Invalid choice | E-bike booked | Bye
braucht: endlosschleife, aussprung
tipp: The menu runs again and again until someone chooses 0. An endless loop with a Break is good for that.
tipp: Use an endless loop. Inside it, first comes the input \`input: int choice "1 = e-bike, 2 = e-scooter, 0 = quit"\`, then a switch on \`choice\` with the cases \`0\`, \`1\`, \`2\` and \`default\`. The case \`0\` holds the output and, below it, the Break.
lösung: aufgabe-verleih-loesung.visustruct
:::
`,va=`---
titel: Adult?
nach: 8
stufe: 1
---

At the cinema, for a driving licence or for voting: it often matters whether someone is already 18.

::: übung aufgabe-volljaehrig
titel: Adult?
auftrag: Ask for the age. If the person is 18 or older, output **adult**, otherwise **minor**.
test: 18 -> adult
test: 35 -> adult
test: 17 -> minor
test: 6 -> minor
braucht: verzweigung
tipp: There are two possible outputs, so you need a branch.
tipp: Read in the age with \`input: int age "How old are you?"\`. The condition of the branch is \`age >= 18\`. Make sure that 18 already counts as adult.
lösung: aufgabe-volljaehrig-loesung.visustruct
:::
`,ka=`---
titel: Double a number
nach: 2
stufe: 1
---

A variable can change its value. Here a number is doubled.

::: übung aufgabe-verdoppeln
titel: Double a number
auftrag: Set the variable \`number\` to the value 4. Double it in a second statement without creating a new variable. Then output **Doubled number: 8**, where the 8 comes from the variable.
test: - -> Doubled number: 8
tipp: Doubling means: times 2. You store the result in the same variable again.
tipp: \`number = number * 2\` calculates with the old value and stores the result in \`number\` again. You join text and a variable with \`+\`.
lösung: aufgabe-verdoppeln-loesung.visustruct
:::
`,Sa=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="72;97;117;112;116;112;114;111;103;114;97;109;109;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;87;105;108;108;107;111;109;109;101;110;34;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>112;114;117;101;102;101;65;108;116;101;114;40;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;65;117;102;32;87;105;101;100;101;114;115;101;104;101;110;34;</text>
  </strelem>
</struktogramm>
`,Za=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="112;114;117;101;102;101;65;108;116;101;114;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;108;116;101;114;32;34;87;105;101;32;97;108;116;32;98;105;115;116;32;100;117;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>97;108;116;101;114;32;62;61;32;49;56;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;118;111;108;108;106;228;104;114;105;103;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;109;105;110;100;101;114;106;228;104;114;105;103;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Ma=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;105;110;228;114;122;97;104;108;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;71;97;110;122;101;32;90;97;104;108;32;101;105;110;103;101;98;101;110;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;98;105;110;97;101;114;32;61;32;34;34;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>122;97;104;108;32;62;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;114;101;115;116;32;61;32;122;97;104;108;32;37;32;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>98;105;110;97;101;114;32;61;32;114;101;115;116;32;43;32;98;105;110;97;101;114;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>122;97;104;108;32;61;32;122;97;104;108;32;47;32;50;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;98;105;110;97;101;114;</text>
  </strelem>
</struktogramm>
`,_a=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;108;108;97;116;122;45;70;111;108;103;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;83;116;97;114;116;122;97;104;108;32;101;105;110;103;101;98;101;110;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;99;104;114;105;116;116;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>122;97;104;108;32;33;61;32;49;</text>
    <schleifeninhalt>
      <strelem typ="1" zx="0" zy="0">
        <text>122;97;104;108;32;37;32;50;32;61;61;32;48;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>122;97;104;108;32;61;32;122;97;104;108;32;47;32;50;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>122;97;104;108;32;61;32;122;97;104;108;32;42;32;51;32;43;32;49;</text>
          </strelem>
        </fall>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;122;97;104;108;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>115;99;104;114;105;116;116;101;43;43;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;99;104;114;105;116;116;101;58;32;34;32;43;32;115;99;104;114;105;116;116;101;</text>
  </strelem>
</struktogramm>
`,ja=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="78;111;116;101;110;100;117;114;99;104;115;99;104;110;105;116;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;110;122;97;104;108;32;34;87;105;101;32;118;105;101;108;101;32;78;111;116;101;110;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;109;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;97;110;122;97;104;108;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;105;110;116;32;110;111;116;101;32;34;78;111;116;101;32;101;105;110;103;101;98;101;110;34;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;109;101;32;61;32;115;117;109;109;101;32;43;32;110;111;116;101;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;115;99;104;110;105;116;116;32;61;32;115;117;109;109;101;32;42;32;49;46;48;32;47;32;97;110;122;97;104;108;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;99;104;110;105;116;116;</text>
  </strelem>
</struktogramm>
`,Ta=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;105;98;111;110;97;99;99;105;45;90;97;104;108;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;110;122;97;104;108;32;34;87;105;101;32;118;105;101;108;101;32;90;97;104;108;101;110;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;122;97;104;108;49;32;61;32;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;122;97;104;108;50;32;61;32;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;122;97;104;108;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;122;97;104;108;50;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;50;</text>
    <text>105;32;60;32;97;110;122;97;104;108;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;122;97;104;108;51;32;61;32;122;97;104;108;49;32;43;32;122;97;104;108;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;122;97;104;108;51;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>122;97;104;108;49;32;61;32;122;97;104;108;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>122;97;104;108;50;32;61;32;122;97;104;108;51;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,Aa=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;101;114;97;100;101;32;111;100;101;114;32;117;110;103;101;114;97;100;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;90;97;104;108;32;101;105;110;103;101;98;101;110;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>122;97;104;108;32;37;32;50;32;61;61;32;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;122;97;104;108;32;43;32;34;32;105;115;116;32;103;101;114;97;100;101;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;122;97;104;108;32;43;32;34;32;105;115;116;32;117;110;103;101;114;97;100;101;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Da=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="77;101;104;114;119;101;114;116;115;116;101;117;101;114;">
  <strelem typ="0" zx="0" zy="0">
    <text>99;111;110;115;116;32;100;111;117;98;108;101;32;77;87;83;84;32;61;32;48;46;49;57;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;100;111;117;98;108;101;32;110;101;116;116;111;112;114;101;105;115;32;34;78;101;116;116;111;112;114;101;105;115;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;115;116;101;117;101;114;32;61;32;110;101;116;116;111;112;114;101;105;115;32;42;32;77;87;83;84;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;98;114;117;116;116;111;112;114;101;105;115;32;61;32;110;101;116;116;111;112;114;101;105;115;32;43;32;115;116;101;117;101;114;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;116;101;117;101;114;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;98;114;117;116;116;111;112;114;101;105;115;</text>
  </strelem>
</struktogramm>
`,Pa=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="80;73;78;32;112;114;252;102;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>99;111;110;115;116;32;105;110;116;32;80;73;78;32;61;32;49;50;51;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;112;105;110;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;118;101;114;115;117;99;104;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="5" zx="0" zy="0">
    <text>112;105;110;32;33;61;32;80;73;78;32;38;38;32;118;101;114;115;117;99;104;101;32;60;32;51;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;112;105;110;32;34;80;73;78;32;101;105;110;103;101;98;101;110;34;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>118;101;114;115;117;99;104;101;43;43;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>112;105;110;32;61;61;32;80;73;78;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;80;73;78;32;114;105;99;104;116;105;103;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;75;97;114;116;101;32;103;101;115;112;101;114;114;116;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Ca=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="84;97;115;99;104;101;110;114;101;99;104;110;101;114;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;49;32;34;69;114;115;116;101;32;90;97;104;108;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;50;32;34;90;119;101;105;116;101;32;90;97;104;108;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;122;101;105;99;104;101;110;32;34;82;101;99;104;101;110;122;101;105;99;104;101;110;32;40;43;44;32;45;32;111;100;101;114;32;42;41;34;</text>
  </strelem>
  <strelem typ="2" zx="0" zy="0">
    <text>122;101;105;99;104;101;110;</text>
    <fall fallname="34;43;34;">
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;101;114;103;101;98;110;105;115;32;61;32;122;97;104;108;49;32;43;32;122;97;104;108;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;101;114;103;101;98;110;105;115;</text>
      </strelem>
    </fall>
    <fall fallname="34;45;34;">
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;101;114;103;101;98;110;105;115;32;61;32;122;97;104;108;49;32;45;32;122;97;104;108;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;101;114;103;101;98;110;105;115;</text>
      </strelem>
    </fall>
    <fall fallname="34;42;34;">
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;101;114;103;101;98;110;105;115;32;61;32;122;97;104;108;49;32;42;32;122;97;104;108;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;101;114;103;101;98;110;105;115;</text>
      </strelem>
    </fall>
    <fall fallname="100;101;102;97;117;108;116;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;85;110;98;101;107;97;110;110;116;101;115;32;82;101;99;104;101;110;122;101;105;99;104;101;110;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Wa=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;99;104;105;102;102;101;32;118;101;114;115;101;110;107;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;109;101;101;114;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;53;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>109;101;101;114;91;48;93;91;49;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>109;101;101;114;91;48;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>109;101;101;114;91;48;93;91;51;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>109;101;101;114;91;50;93;91;52;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>109;101;101;114;91;51;93;91;52;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>109;101;101;114;91;52;93;91;48;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;91;93;32;115;112;97;108;116;101;110;32;61;32;123;34;65;34;44;32;34;66;34;44;32;34;67;34;44;32;34;68;34;44;32;34;69;34;125;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;114;101;105;104;101;32;61;32;48;</text>
    <text>114;101;105;104;101;32;60;32;109;101;101;114;46;108;101;110;103;116;104;</text>
    <text>114;101;105;104;101;43;43;</text>
    <schleifeninhalt>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;115;112;97;108;116;101;32;61;32;48;</text>
        <text>115;112;97;108;116;101;32;60;32;109;101;101;114;91;114;101;105;104;101;93;46;108;101;110;103;116;104;</text>
        <text>115;112;97;108;116;101;43;43;</text>
        <schleifeninhalt>
          <strelem typ="1" zx="0" zy="0">
            <text>109;101;101;114;91;114;101;105;104;101;93;91;115;112;97;108;116;101;93;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>111;117;116;112;117;116;58;32;115;112;97;108;116;101;110;91;115;112;97;108;116;101;93;32;43;32;40;114;101;105;104;101;32;43;32;49;41;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>248;</text>
              </strelem>
            </fall>
          </strelem>
        </schleifeninhalt>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,Ba=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;99;104;105;102;102;101;32;118;101;114;115;101;110;107;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;109;101;101;114;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;53;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>109;101;101;114;91;48;93;91;49;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>109;101;101;114;91;48;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>109;101;101;114;91;48;93;91;51;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>109;101;101;114;91;50;93;91;52;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>109;101;101;114;91;51;93;91;52;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>109;101;101;114;91;52;93;91;48;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;91;93;32;115;112;97;108;116;101;110;32;61;32;123;34;65;34;44;32;34;66;34;44;32;34;67;34;44;32;34;68;34;44;32;34;69;34;125;</text>
  </strelem>
</struktogramm>
`,Ha=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;112;101;105;115;101;107;97;114;116;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;109;101;114;32;34;87;101;108;99;104;101;115;32;71;101;114;105;99;104;116;63;32;40;49;44;32;50;32;111;100;101;114;32;51;41;34;</text>
  </strelem>
  <strelem typ="2" zx="0" zy="0">
    <text>110;117;109;109;101;114;</text>
    <fall fallname="49;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;71;114;105;101;99;104;105;115;99;104;101;114;32;83;97;108;97;116;34;</text>
      </strelem>
    </fall>
    <fall fallname="50;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;82;101;105;115;45;66;111;119;108;34;</text>
      </strelem>
    </fall>
    <fall fallname="51;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;70;97;108;97;102;101;108;45;87;114;97;112;34;</text>
      </strelem>
    </fall>
    <fall fallname="100;101;102;97;117;108;116;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;66;105;116;116;101;32;101;105;110;101;32;103;252;108;116;105;103;101;32;78;117;109;109;101;114;32;119;228;104;108;101;110;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Ga=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;109;101;32;98;105;108;100;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;122;97;104;108;49;32;61;32;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;122;97;104;108;50;32;61;32;51;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;109;101;32;61;32;122;97;104;108;49;32;43;32;122;97;104;108;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;117;109;109;101;</text>
  </strelem>
</struktogramm>
`,Na=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="84;97;102;101;108;100;105;101;110;115;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;91;93;32;110;97;109;101;110;32;61;32;110;101;119;32;83;116;114;105;110;103;91;53;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;110;97;109;101;110;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;110;97;109;101;110;91;105;93;32;34;78;97;109;101;32;101;105;110;103;101;98;101;110;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;109;101;114;32;34;76;111;115;110;117;109;109;101;114;32;40;49;32;98;105;115;32;53;41;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;84;97;102;101;108;100;105;101;110;115;116;58;32;34;32;43;32;110;97;109;101;110;91;110;117;109;109;101;114;32;45;32;49;93;</text>
  </strelem>
</struktogramm>
`,Ea=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="90;97;104;108;32;118;101;114;100;111;112;112;101;108;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;122;97;104;108;32;61;32;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>122;97;104;108;32;61;32;122;97;104;108;32;42;32;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;86;101;114;100;111;112;112;101;108;116;101;32;90;97;104;108;58;32;34;32;43;32;122;97;104;108;</text>
  </strelem>
</struktogramm>
`,La=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="86;101;114;108;101;105;104;">
  <strelem typ="6" zx="0" zy="0">
    <text></text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;105;110;116;32;119;97;104;108;32;34;49;32;61;32;69;45;66;105;107;101;44;32;50;32;61;32;69;45;83;99;111;111;116;101;114;44;32;48;32;61;32;69;110;100;101;34;</text>
      </strelem>
      <strelem typ="2" zx="0" zy="0">
        <text>119;97;104;108;</text>
        <fall fallname="48;">
          <strelem typ="0" zx="0" zy="0">
            <text>111;117;116;112;117;116;58;32;34;84;115;99;104;252;115;115;34;</text>
          </strelem>
          <strelem typ="7" zx="0" zy="0">
            <text>77;101;110;252;32;118;101;114;108;97;115;115;101;110;</text>
          </strelem>
        </fall>
        <fall fallname="49;">
          <strelem typ="0" zx="0" zy="0">
            <text>111;117;116;112;117;116;58;32;34;69;45;66;105;107;101;32;103;101;98;117;99;104;116;34;</text>
          </strelem>
        </fall>
        <fall fallname="50;">
          <strelem typ="0" zx="0" zy="0">
            <text>111;117;116;112;117;116;58;32;34;69;45;83;99;111;111;116;101;114;32;103;101;98;117;99;104;116;34;</text>
          </strelem>
        </fall>
        <fall fallname="100;101;102;97;117;108;116;">
          <strelem typ="0" zx="0" zy="0">
            <text>111;117;116;112;117;116;58;32;34;85;110;103;252;108;116;105;103;101;32;65;117;115;119;97;104;108;34;</text>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,Va=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="86;111;108;108;106;228;104;114;105;103;63;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;108;116;101;114;32;34;87;105;101;32;97;108;116;32;98;105;115;116;32;100;117;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>97;108;116;101;114;32;62;61;32;49;56;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;118;111;108;108;106;228;104;114;105;103;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;109;105;110;100;101;114;106;228;104;114;105;103;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Fa=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="77;97;105;110;32;112;114;111;103;114;97;109;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;87;101;108;99;111;109;101;34;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>99;104;101;99;107;65;103;101;40;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;71;111;111;100;98;121;101;34;</text>
  </strelem>
</struktogramm>
`,Ra=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="99;104;101;99;107;65;103;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;103;101;32;34;72;111;119;32;111;108;100;32;97;114;101;32;121;111;117;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>97;103;101;32;62;61;32;49;56;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;97;100;117;108;116;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;109;105;110;111;114;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Ua=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;105;110;97;114;121;32;110;117;109;98;101;114;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;32;34;69;110;116;101;114;32;97;32;119;104;111;108;101;32;110;117;109;98;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;98;105;110;97;114;121;32;61;32;34;34;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;62;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;114;101;109;97;105;110;100;101;114;32;61;32;110;117;109;98;101;114;32;37;32;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>98;105;110;97;114;121;32;61;32;114;101;109;97;105;110;100;101;114;32;43;32;98;105;110;97;114;121;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>110;117;109;98;101;114;32;61;32;110;117;109;98;101;114;32;47;32;50;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;98;105;110;97;114;121;</text>
  </strelem>
</struktogramm>
`,Ya=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;108;108;97;116;122;32;115;101;113;117;101;110;99;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;32;34;69;110;116;101;114;32;97;32;115;116;97;114;116;32;110;117;109;98;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;116;101;112;115;32;61;32;48;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;33;61;32;49;</text>
    <schleifeninhalt>
      <strelem typ="1" zx="0" zy="0">
        <text>110;117;109;98;101;114;32;37;32;50;32;61;61;32;48;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>110;117;109;98;101;114;32;61;32;110;117;109;98;101;114;32;47;32;50;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>110;117;109;98;101;114;32;61;32;110;117;109;98;101;114;32;42;32;51;32;43;32;49;</text>
          </strelem>
        </fall>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>115;116;101;112;115;43;43;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;116;101;112;115;58;32;34;32;43;32;115;116;101;112;115;</text>
  </strelem>
</struktogramm>
`,Xa=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;114;97;100;101;32;97;118;101;114;97;103;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;99;111;117;110;116;32;34;72;111;119;32;109;97;110;121;32;103;114;97;100;101;115;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;99;111;117;110;116;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;105;110;116;32;103;114;97;100;101;32;34;69;110;116;101;114;32;97;32;103;114;97;100;101;34;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;32;61;32;115;117;109;32;43;32;103;114;97;100;101;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;97;118;101;114;97;103;101;32;61;32;115;117;109;32;42;32;49;46;48;32;47;32;99;111;117;110;116;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;97;118;101;114;97;103;101;</text>
  </strelem>
</struktogramm>
`,Qa=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;105;98;111;110;97;99;99;105;32;110;117;109;98;101;114;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;99;111;117;110;116;32;34;72;111;119;32;109;97;110;121;32;110;117;109;98;101;114;115;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;49;32;61;32;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;50;32;61;32;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;50;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;50;</text>
    <text>105;32;60;32;99;111;117;110;116;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;110;117;109;98;101;114;51;32;61;32;110;117;109;98;101;114;49;32;43;32;110;117;109;98;101;114;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;51;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>110;117;109;98;101;114;49;32;61;32;110;117;109;98;101;114;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>110;117;109;98;101;114;50;32;61;32;110;117;109;98;101;114;51;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,Ja=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="69;118;101;110;32;111;114;32;111;100;100;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;32;34;69;110;116;101;114;32;97;32;110;117;109;98;101;114;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;37;32;50;32;61;61;32;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;32;43;32;34;32;105;115;32;101;118;101;110;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;32;43;32;34;32;105;115;32;111;100;100;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Oa=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;97;108;101;115;32;116;97;120;">
  <strelem typ="0" zx="0" zy="0">
    <text>99;111;110;115;116;32;100;111;117;98;108;101;32;86;65;84;32;61;32;48;46;49;57;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;100;111;117;98;108;101;32;110;101;116;80;114;105;99;101;32;34;78;101;116;32;112;114;105;99;101;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;116;97;120;32;61;32;110;101;116;80;114;105;99;101;32;42;32;86;65;84;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;103;114;111;115;115;80;114;105;99;101;32;61;32;110;101;116;80;114;105;99;101;32;43;32;116;97;120;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;116;97;120;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;103;114;111;115;115;80;114;105;99;101;</text>
  </strelem>
</struktogramm>
`,$a=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;104;101;99;107;32;116;104;101;32;80;73;78;">
  <strelem typ="0" zx="0" zy="0">
    <text>99;111;110;115;116;32;105;110;116;32;80;73;78;32;61;32;49;50;51;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;112;105;110;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;116;116;101;109;112;116;115;32;61;32;48;</text>
  </strelem>
  <strelem typ="5" zx="0" zy="0">
    <text>112;105;110;32;33;61;32;80;73;78;32;38;38;32;97;116;116;101;109;112;116;115;32;60;32;51;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;112;105;110;32;34;69;110;116;101;114;32;80;73;78;34;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>97;116;116;101;109;112;116;115;43;43;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>112;105;110;32;61;61;32;80;73;78;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;80;73;78;32;99;111;114;114;101;99;116;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;67;97;114;100;32;98;108;111;99;107;101;100;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Ka=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;97;108;99;117;108;97;116;111;114;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;49;32;34;70;105;114;115;116;32;110;117;109;98;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;50;32;34;83;101;99;111;110;100;32;110;117;109;98;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;111;112;101;114;97;116;111;114;32;34;79;112;101;114;97;116;111;114;32;40;43;44;32;45;32;111;114;32;42;41;34;</text>
  </strelem>
  <strelem typ="2" zx="0" zy="0">
    <text>111;112;101;114;97;116;111;114;</text>
    <fall fallname="34;43;34;">
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;114;101;115;117;108;116;32;61;32;110;117;109;98;101;114;49;32;43;32;110;117;109;98;101;114;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;114;101;115;117;108;116;</text>
      </strelem>
    </fall>
    <fall fallname="34;45;34;">
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;114;101;115;117;108;116;32;61;32;110;117;109;98;101;114;49;32;45;32;110;117;109;98;101;114;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;114;101;115;117;108;116;</text>
      </strelem>
    </fall>
    <fall fallname="34;42;34;">
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;114;101;115;117;108;116;32;61;32;110;117;109;98;101;114;49;32;42;32;110;117;109;98;101;114;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;114;101;115;117;108;116;</text>
      </strelem>
    </fall>
    <fall fallname="100;101;102;97;117;108;116;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;85;110;107;110;111;119;110;32;111;112;101;114;97;116;111;114;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,qa=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;97;116;116;108;101;115;104;105;112;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;115;101;97;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;53;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;91;48;93;91;49;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;91;48;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;91;48;93;91;51;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;91;50;93;91;52;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;91;51;93;91;52;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;91;52;93;91;48;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;91;93;32;99;111;108;117;109;110;115;32;61;32;123;34;65;34;44;32;34;66;34;44;32;34;67;34;44;32;34;68;34;44;32;34;69;34;125;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;114;111;119;32;61;32;48;</text>
    <text>114;111;119;32;60;32;115;101;97;46;108;101;110;103;116;104;</text>
    <text>114;111;119;43;43;</text>
    <schleifeninhalt>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;99;111;108;117;109;110;32;61;32;48;</text>
        <text>99;111;108;117;109;110;32;60;32;115;101;97;91;114;111;119;93;46;108;101;110;103;116;104;</text>
        <text>99;111;108;117;109;110;43;43;</text>
        <schleifeninhalt>
          <strelem typ="1" zx="0" zy="0">
            <text>115;101;97;91;114;111;119;93;91;99;111;108;117;109;110;93;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>111;117;116;112;117;116;58;32;99;111;108;117;109;110;115;91;99;111;108;117;109;110;93;32;43;32;40;114;111;119;32;43;32;49;41;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>248;</text>
              </strelem>
            </fall>
          </strelem>
        </schleifeninhalt>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,el=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;97;116;116;108;101;115;104;105;112;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;115;101;97;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;53;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;91;48;93;91;49;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;91;48;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;91;48;93;91;51;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;91;50;93;91;52;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;91;51;93;91;52;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;91;52;93;91;48;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;91;93;32;99;111;108;117;109;110;115;32;61;32;123;34;65;34;44;32;34;66;34;44;32;34;67;34;44;32;34;68;34;44;32;34;69;34;125;</text>
  </strelem>
</struktogramm>
`,tl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="77;101;110;117;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;112;105;99;107;32;34;87;104;105;99;104;32;100;105;115;104;63;32;40;49;44;32;50;32;111;114;32;51;41;34;</text>
  </strelem>
  <strelem typ="2" zx="0" zy="0">
    <text>112;105;99;107;</text>
    <fall fallname="49;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;71;114;101;101;107;32;115;97;108;97;100;34;</text>
      </strelem>
    </fall>
    <fall fallname="50;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;82;105;99;101;32;98;111;119;108;34;</text>
      </strelem>
    </fall>
    <fall fallname="51;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;70;97;108;97;102;101;108;32;119;114;97;112;34;</text>
      </strelem>
    </fall>
    <fall fallname="100;101;102;97;117;108;116;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;80;108;101;97;115;101;32;99;104;111;111;115;101;32;97;32;118;97;108;105;100;32;110;117;109;98;101;114;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,nl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="65;100;100;32;117;112;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;49;32;61;32;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;50;32;61;32;51;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;110;117;109;98;101;114;49;32;43;32;110;117;109;98;101;114;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;117;109;</text>
  </strelem>
</struktogramm>
`,il=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;111;97;114;100;32;100;117;116;121;">
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;91;93;32;110;97;109;101;115;32;61;32;110;101;119;32;83;116;114;105;110;103;91;53;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;110;97;109;101;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;110;97;109;101;115;91;105;93;32;34;69;110;116;101;114;32;97;32;110;97;109;101;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;112;105;99;107;32;34;68;114;97;119;32;110;117;109;98;101;114;32;40;49;32;116;111;32;53;41;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;66;111;97;114;100;32;100;117;116;121;58;32;34;32;43;32;110;97;109;101;115;91;112;105;99;107;32;45;32;49;93;</text>
  </strelem>
</struktogramm>
`,sl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="68;111;117;98;108;101;32;97;32;110;117;109;98;101;114;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;32;61;32;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;61;32;110;117;109;98;101;114;32;42;32;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;68;111;117;98;108;101;100;32;110;117;109;98;101;114;58;32;34;32;43;32;110;117;109;98;101;114;</text>
  </strelem>
</struktogramm>
`,rl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="82;101;110;116;97;108;">
  <strelem typ="6" zx="0" zy="0">
    <text></text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;105;110;116;32;99;104;111;105;99;101;32;34;49;32;61;32;101;45;98;105;107;101;44;32;50;32;61;32;101;45;115;99;111;111;116;101;114;44;32;48;32;61;32;113;117;105;116;34;</text>
      </strelem>
      <strelem typ="2" zx="0" zy="0">
        <text>99;104;111;105;99;101;</text>
        <fall fallname="48;">
          <strelem typ="0" zx="0" zy="0">
            <text>111;117;116;112;117;116;58;32;34;66;121;101;34;</text>
          </strelem>
          <strelem typ="7" zx="0" zy="0">
            <text>76;101;97;118;101;32;116;104;101;32;109;101;110;117;</text>
          </strelem>
        </fall>
        <fall fallname="49;">
          <strelem typ="0" zx="0" zy="0">
            <text>111;117;116;112;117;116;58;32;34;69;45;98;105;107;101;32;98;111;111;107;101;100;34;</text>
          </strelem>
        </fall>
        <fall fallname="50;">
          <strelem typ="0" zx="0" zy="0">
            <text>111;117;116;112;117;116;58;32;34;69;45;115;99;111;111;116;101;114;32;98;111;111;107;101;100;34;</text>
          </strelem>
        </fall>
        <fall fallname="100;101;102;97;117;108;116;">
          <strelem typ="0" zx="0" zy="0">
            <text>111;117;116;112;117;116;58;32;34;73;110;118;97;108;105;100;32;99;104;111;105;99;101;34;</text>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,al=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="65;100;117;108;116;63;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;103;101;32;34;72;111;119;32;111;108;100;32;97;114;101;32;121;111;117;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>97;103;101;32;62;61;32;49;56;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;97;100;117;108;116;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;109;105;110;111;114;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,ll=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="84;105;109;101;115;32;116;97;98;108;101;32;103;114;105;100;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;91;93;32;116;97;98;108;101;32;61;32;110;101;119;32;105;110;116;91;49;48;93;91;49;48;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;116;97;98;108;101;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;106;32;61;32;48;</text>
        <text>106;32;60;32;116;97;98;108;101;91;105;93;46;108;101;110;103;116;104;</text>
        <text>106;43;43;</text>
        <schleifeninhalt>
          <strelem typ="0" zx="0" zy="0">
            <text>116;97;98;108;101;91;105;93;91;106;93;32;61;32;40;105;32;43;32;49;41;32;42;32;40;106;32;43;32;49;41;</text>
          </strelem>
        </schleifeninhalt>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;32;34;70;105;114;115;116;32;110;117;109;98;101;114;32;40;49;32;116;111;32;49;48;41;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;32;34;83;101;99;111;110;100;32;110;117;109;98;101;114;32;40;49;32;116;111;32;49;48;41;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;97;32;43;32;34;32;183;32;34;32;43;32;98;32;43;32;34;32;61;32;34;32;43;32;116;97;98;108;101;91;97;32;45;32;49;93;91;98;32;45;32;49;93;</text>
  </strelem>
</struktogramm>
`,ol=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;114;101;101;32;115;101;97;116;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;115;101;97;116;115;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;51;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;48;93;91;48;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;49;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;50;93;91;51;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;102;114;101;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;114;111;119;32;61;32;48;</text>
    <text>114;111;119;32;60;32;115;101;97;116;115;46;108;101;110;103;116;104;</text>
    <text>114;111;119;43;43;</text>
    <schleifeninhalt>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;115;101;97;116;32;61;32;48;</text>
        <text>115;101;97;116;32;60;32;115;101;97;116;115;91;114;111;119;93;46;108;101;110;103;116;104;</text>
        <text>115;101;97;116;43;43;</text>
        <schleifeninhalt>
          <strelem typ="1" zx="0" zy="0">
            <text>33;115;101;97;116;115;91;114;111;119;93;91;115;101;97;116;93;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>102;114;101;101;32;61;32;102;114;101;101;32;43;32;49;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>248;</text>
              </strelem>
            </fall>
          </strelem>
        </schleifeninhalt>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;70;114;101;101;58;32;34;32;43;32;102;114;101;101;</text>
  </strelem>
</struktogramm>
`,ul=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;114;101;101;32;115;101;97;116;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;115;101;97;116;115;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;51;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;48;93;91;48;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;49;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;50;93;91;51;93;32;61;32;116;114;117;101;</text>
  </strelem>
</struktogramm>
`,hl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;101;108;108;32;97;32;116;105;99;107;101;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;115;101;97;116;115;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;51;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;49;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;49;93;91;51;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;114;111;119;32;34;82;111;119;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;115;101;97;116;32;34;83;101;97;116;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>115;101;97;116;115;91;114;111;119;93;91;115;101;97;116;93;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;65;108;114;101;97;100;121;32;115;111;108;100;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>115;101;97;116;115;91;114;111;119;93;91;115;101;97;116;93;32;61;32;116;114;117;101;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;83;111;108;100;58;32;114;111;119;32;34;32;43;32;114;111;119;32;43;32;34;44;32;115;101;97;116;32;34;32;43;32;115;101;97;116;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,ml=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;101;108;108;32;97;32;116;105;99;107;101;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;115;101;97;116;115;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;51;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;49;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;49;93;91;51;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;114;111;119;32;34;82;111;119;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;115;101;97;116;32;34;83;101;97;116;34;</text>
  </strelem>
</struktogramm>
`,cl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;101;97;116;105;110;103;32;112;108;97;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;115;101;97;116;115;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;51;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;48;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;49;93;91;49;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;49;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;114;111;119;32;61;32;48;</text>
    <text>114;111;119;32;60;32;115;101;97;116;115;46;108;101;110;103;116;104;</text>
    <text>114;111;119;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>83;116;114;105;110;103;32;108;105;110;101;32;61;32;34;34;</text>
      </strelem>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;115;101;97;116;32;61;32;48;</text>
        <text>115;101;97;116;32;60;32;115;101;97;116;115;91;114;111;119;93;46;108;101;110;103;116;104;</text>
        <text>115;101;97;116;43;43;</text>
        <schleifeninhalt>
          <strelem typ="1" zx="0" zy="0">
            <text>115;101;97;116;115;91;114;111;119;93;91;115;101;97;116;93;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>108;105;110;101;32;61;32;108;105;110;101;32;43;32;34;88;34;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>108;105;110;101;32;61;32;108;105;110;101;32;43;32;34;79;34;</text>
              </strelem>
            </fall>
          </strelem>
        </schleifeninhalt>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;108;105;110;101;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,dl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;105;110;101;109;97;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;115;101;97;116;115;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;51;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;48;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;49;93;91;49;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;101;97;116;115;91;49;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;82;111;119;115;58;32;34;32;43;32;115;101;97;116;115;46;108;101;110;103;116;104;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;101;97;116;115;32;112;101;114;32;114;111;119;58;32;34;32;43;32;115;101;97;116;115;91;48;93;46;108;101;110;103;116;104;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;82;111;119;32;49;44;32;115;101;97;116;32;50;32;115;111;108;100;63;32;34;32;43;32;115;101;97;116;115;91;49;93;91;50;93;</text>
  </strelem>
</struktogramm>
`,gl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="79;114;100;101;114;32;109;97;116;116;101;114;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;32;61;32;51;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;61;32;110;117;109;98;101;114;32;42;32;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;61;32;110;117;109;98;101;114;32;43;32;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;</text>
  </strelem>
</struktogramm>
`,pl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="79;114;100;101;114;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;32;61;32;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;61;32;110;117;109;98;101;114;32;43;32;51;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;61;32;110;117;109;98;101;114;32;42;32;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;</text>
  </strelem>
</struktogramm>
`,xl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="79;114;100;101;114;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;61;32;110;117;109;98;101;114;32;42;32;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;32;61;32;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;61;32;110;117;109;98;101;114;32;43;32;51;</text>
  </strelem>
</struktogramm>
`,bl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;119;97;112;32;103;108;97;115;115;101;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;108;101;102;116;32;61;32;34;106;117;105;99;101;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;114;105;103;104;116;32;61;32;34;119;97;116;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;116;101;109;112;32;61;32;108;101;102;116;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>108;101;102;116;32;61;32;114;105;103;104;116;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>114;105;103;104;116;32;61;32;116;101;109;112;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;76;101;102;116;58;32;34;32;43;32;108;101;102;116;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;82;105;103;104;116;58;32;34;32;43;32;114;105;103;104;116;</text>
  </strelem>
</struktogramm>
`,fl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;119;97;112;32;103;108;97;115;115;101;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;108;101;102;116;32;61;32;34;106;117;105;99;101;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;114;105;103;104;116;32;61;32;34;119;97;116;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;76;101;102;116;58;32;34;32;43;32;108;101;102;116;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;82;105;103;104;116;58;32;34;32;43;32;114;105;103;104;116;</text>
  </strelem>
</struktogramm>
`,Il=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;119;97;112;32;118;97;108;117;101;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;32;61;32;53;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;98;32;61;32;57;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;116;101;109;112;32;61;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>97;32;61;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>98;32;61;32;116;101;109;112;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;97;32;61;32;34;32;43;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;98;32;61;32;34;32;43;32;98;</text>
  </strelem>
</struktogramm>
`,yl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="68;97;116;97;32;116;121;112;101;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;103;101;32;61;32;49;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;104;101;105;103;104;116;32;61;32;49;46;54;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;110;97;109;101;32;61;32;34;77;105;97;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;110;97;109;101;32;43;32;34;32;105;115;32;34;32;43;32;97;103;101;32;43;32;34;32;121;101;97;114;115;32;111;108;100;46;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;101;105;103;104;116;58;32;34;32;43;32;104;101;105;103;104;116;32;43;32;34;32;109;34;</text>
  </strelem>
</struktogramm>
`,zl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;110;118;101;114;116;32;109;105;110;117;116;101;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;109;105;110;117;116;101;115;32;61;32;49;51;53;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;104;111;117;114;115;32;61;32;109;105;110;117;116;101;115;32;47;32;54;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;114;101;109;97;105;110;100;101;114;32;61;32;109;105;110;117;116;101;115;32;37;32;54;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;104;111;117;114;115;32;43;32;34;32;104;111;117;114;115;32;97;110;100;32;34;32;43;32;114;101;109;97;105;110;100;101;114;32;43;32;34;32;109;105;110;117;116;101;115;34;</text>
  </strelem>
</struktogramm>
`,wl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;104;111;112;112;105;110;103;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;99;111;117;110;116;32;61;32;51;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;112;114;105;99;101;32;61;32;50;46;53;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;116;111;116;97;108;32;61;32;99;111;117;110;116;32;42;32;112;114;105;99;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;84;111;116;97;108;58;32;34;32;43;32;116;111;116;97;108;32;43;32;34;32;101;117;114;111;115;34;</text>
  </strelem>
</struktogramm>
`,vl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="82;101;99;116;97;110;103;108;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;108;101;110;103;116;104;32;61;32;55;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;119;105;100;116;104;32;61;32;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;114;101;97;32;61;32;108;101;110;103;116;104;32;42;32;119;105;100;116;104;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;112;101;114;105;109;101;116;101;114;32;61;32;50;32;42;32;40;108;101;110;103;116;104;32;43;32;119;105;100;116;104;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;65;114;101;97;58;32;34;32;43;32;97;114;101;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;80;101;114;105;109;101;116;101;114;58;32;34;32;43;32;112;101;114;105;109;101;116;101;114;</text>
  </strelem>
</struktogramm>
`,kl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;110;118;101;114;116;32;115;101;99;111;110;100;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;101;99;111;110;100;115;32;61;32;50;48;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;109;105;110;117;116;101;115;32;61;32;115;101;99;111;110;100;115;32;47;32;54;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;114;101;109;97;105;110;100;101;114;32;61;32;115;101;99;111;110;100;115;32;37;32;54;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;109;105;110;117;116;101;115;32;43;32;34;32;109;105;110;117;116;101;115;32;97;110;100;32;34;32;43;32;114;101;109;97;105;110;100;101;114;32;43;32;34;32;115;101;99;111;110;100;115;34;</text>
  </strelem>
</struktogramm>
`,Sl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;110;118;101;114;116;32;115;101;99;111;110;100;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;101;99;111;110;100;115;32;61;32;50;48;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;109;105;110;117;116;101;115;32;43;32;34;32;109;105;110;117;116;101;115;32;97;110;100;32;34;32;43;32;114;101;109;97;105;110;100;101;114;32;43;32;34;32;115;101;99;111;110;100;115;34;</text>
  </strelem>
</struktogramm>
`,Zl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;114;101;101;116;105;110;103;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;110;97;109;101;32;34;87;104;97;116;32;105;115;32;121;111;117;114;32;110;97;109;101;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;101;108;108;111;32;34;32;43;32;110;97;109;101;32;43;32;34;33;34;</text>
  </strelem>
</struktogramm>
`,Ml=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;32;111;102;32;116;119;111;32;110;117;109;98;101;114;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;32;34;70;105;114;115;116;32;110;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;32;34;83;101;99;111;110;100;32;110;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;97;32;43;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;117;109;58;32;34;32;43;32;115;117;109;</text>
  </strelem>
</struktogramm>
`,_l=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="77;101;97;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;100;111;117;98;108;101;32;120;32;34;70;105;114;115;116;32;110;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;100;111;117;98;108;101;32;121;32;34;83;101;99;111;110;100;32;110;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;109;101;97;110;32;61;32;40;120;32;43;32;121;41;32;47;32;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;77;101;97;110;58;32;34;32;43;32;109;101;97;110;</text>
  </strelem>
</struktogramm>
`,jl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;97;108;99;117;108;97;116;111;114;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;32;34;70;105;114;115;116;32;110;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;32;34;83;101;99;111;110;100;32;110;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;97;32;43;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;112;114;111;100;117;99;116;32;61;32;97;32;42;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;117;109;58;32;34;32;43;32;115;117;109;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;80;114;111;100;117;99;116;58;32;34;32;43;32;112;114;111;100;117;99;116;</text>
  </strelem>
</struktogramm>
`,Tl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;104;101;99;107;32;97;103;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;103;101;32;34;72;111;119;32;111;108;100;32;97;114;101;32;121;111;117;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>97;103;101;32;62;61;32;49;56;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;89;111;117;32;97;114;101;32;97;110;32;97;100;117;108;116;46;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;89;111;117;32;97;114;101;32;110;111;116;32;97;110;32;97;100;117;108;116;32;121;101;116;46;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Al=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="65;98;115;111;108;117;116;101;32;118;97;108;117;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;32;34;78;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;60;32;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>110;117;109;98;101;114;32;61;32;48;32;45;32;110;117;109;98;101;114;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>248;</text>
      </strelem>
    </fall>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;</text>
  </strelem>
</struktogramm>
`,Dl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="69;118;101;110;32;111;114;32;111;100;100;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;32;34;78;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;37;32;50;32;61;61;32;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;101;118;101;110;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;111;100;100;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Pl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="76;97;114;103;101;114;32;110;117;109;98;101;114;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;32;34;70;105;114;115;116;32;110;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;32;34;83;101;99;111;110;100;32;110;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>97;32;62;32;98;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;97;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;98;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Cl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="68;105;115;99;111;117;110;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;100;111;117;98;108;101;32;112;114;105;99;101;32;34;80;114;105;99;101;32;105;110;32;101;117;114;111;115;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>112;114;105;99;101;32;62;32;53;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>112;114;105;99;101;32;61;32;112;114;105;99;101;32;45;32;53;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>248;</text>
      </strelem>
    </fall>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;84;111;32;112;97;121;58;32;34;32;43;32;112;114;105;99;101;32;43;32;34;32;101;117;114;111;115;34;</text>
  </strelem>
</struktogramm>
`,Wl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;114;97;100;101;32;118;97;108;105;100;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;103;114;97;100;101;32;34;71;114;97;100;101;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>103;114;97;100;101;32;62;61;32;49;32;38;38;32;103;114;97;100;101;32;60;61;32;54;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;118;97;108;105;100;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;105;110;118;97;108;105;100;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Bl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="89;111;117;116;104;32;116;105;99;107;101;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;103;101;32;34;72;111;119;32;111;108;100;32;97;114;101;32;121;111;117;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>97;103;101;32;62;61;32;49;50;32;38;38;32;97;103;101;32;60;32;49;56;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;89;111;117;116;104;32;116;105;99;107;101;116;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;78;111;32;121;111;117;116;104;32;116;105;99;107;101;116;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Hl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;104;101;99;107;32;116;104;101;32;103;114;97;100;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;103;114;97;100;101;32;34;71;114;97;100;101;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>103;114;97;100;101;32;60;32;49;32;124;124;32;103;114;97;100;101;32;62;32;54;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;84;104;105;115;32;103;114;97;100;101;32;100;111;101;115;32;110;111;116;32;101;120;105;115;116;46;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;71;114;97;100;101;32;34;32;43;32;103;114;97;100;101;32;43;32;34;32;105;115;32;118;97;108;105;100;46;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Gl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="76;101;97;112;32;121;101;97;114;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;121;101;97;114;32;34;89;101;97;114;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>40;121;101;97;114;32;37;32;52;32;61;61;32;48;32;38;38;32;121;101;97;114;32;37;32;49;48;48;32;33;61;32;48;41;32;124;124;32;121;101;97;114;32;37;32;52;48;48;32;61;61;32;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;76;101;97;112;32;121;101;97;114;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;78;111;116;32;97;32;108;101;97;112;32;121;101;97;114;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Nl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="87;101;101;107;101;110;100;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;100;97;121;32;34;68;97;121;32;40;49;32;116;111;32;55;41;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>100;97;121;32;61;61;32;54;32;124;124;32;100;97;121;32;61;61;32;55;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;87;101;101;107;101;110;100;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;87;101;101;107;100;97;121;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,El=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="84;114;97;102;102;105;99;32;108;105;103;104;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;99;111;108;111;114;32;34;87;104;97;116;32;99;111;108;111;114;32;105;115;32;116;104;101;32;116;114;97;102;102;105;99;32;108;105;103;104;116;63;34;</text>
  </strelem>
  <strelem typ="2" zx="0" zy="0">
    <text>99;111;108;111;114;</text>
    <fall fallname="114;101;100;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;83;116;111;112;34;</text>
      </strelem>
    </fall>
    <fall fallname="121;101;108;108;111;119;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;87;97;105;116;34;</text>
      </strelem>
    </fall>
    <fall fallname="103;114;101;101;110;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;87;97;108;107;34;</text>
      </strelem>
    </fall>
    <fall fallname="100;101;102;97;117;108;116;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;73;32;100;111;32;110;111;116;32;107;110;111;119;32;116;104;105;115;32;99;111;108;111;114;46;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Ll=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="68;114;105;110;107;115;32;109;97;99;104;105;110;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;99;104;111;105;99;101;32;34;49;32;119;97;116;101;114;44;32;50;32;106;117;105;99;101;44;32;51;32;99;111;99;111;97;34;</text>
  </strelem>
  <strelem typ="2" zx="0" zy="0">
    <text>99;104;111;105;99;101;</text>
    <fall fallname="49;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;72;101;114;101;32;105;115;32;121;111;117;114;32;119;97;116;101;114;46;34;</text>
      </strelem>
    </fall>
    <fall fallname="50;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;72;101;114;101;32;105;115;32;121;111;117;114;32;106;117;105;99;101;46;34;</text>
      </strelem>
    </fall>
    <fall fallname="51;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;72;101;114;101;32;105;115;32;121;111;117;114;32;99;111;99;111;97;46;34;</text>
      </strelem>
    </fall>
    <fall fallname="100;101;102;97;117;108;116;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;84;104;105;115;32;98;117;116;116;111;110;32;100;111;101;115;32;110;111;116;32;101;120;105;115;116;46;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Vl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;114;97;100;101;32;105;110;32;119;111;114;100;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;103;114;97;100;101;32;34;87;104;105;99;104;32;103;114;97;100;101;63;34;</text>
  </strelem>
  <strelem typ="2" zx="0" zy="0">
    <text>103;114;97;100;101;</text>
    <fall fallname="49;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;118;101;114;121;32;103;111;111;100;34;</text>
      </strelem>
    </fall>
    <fall fallname="50;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;103;111;111;100;34;</text>
      </strelem>
    </fall>
    <fall fallname="51;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;115;97;116;105;115;102;97;99;116;111;114;121;34;</text>
      </strelem>
    </fall>
    <fall fallname="52;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;115;117;102;102;105;99;105;101;110;116;34;</text>
      </strelem>
    </fall>
    <fall fallname="53;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;112;111;111;114;34;</text>
      </strelem>
    </fall>
    <fall fallname="54;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;102;97;105;108;34;</text>
      </strelem>
    </fall>
    <fall fallname="100;101;102;97;117;108;116;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;78;111;116;32;97;32;118;97;108;105;100;32;103;114;97;100;101;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Fl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;97;108;99;117;108;97;116;111;114;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;32;34;70;105;114;115;116;32;110;117;109;98;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;111;112;101;114;97;116;111;114;32;34;79;112;101;114;97;116;111;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;32;34;83;101;99;111;110;100;32;110;117;109;98;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;114;101;115;117;108;116;32;61;32;48;</text>
  </strelem>
  <strelem typ="2" zx="0" zy="0">
    <text>111;112;101;114;97;116;111;114;</text>
    <fall fallname="43;">
      <strelem typ="0" zx="0" zy="0">
        <text>114;101;115;117;108;116;32;61;32;97;32;43;32;98;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;114;101;115;117;108;116;</text>
      </strelem>
    </fall>
    <fall fallname="45;">
      <strelem typ="0" zx="0" zy="0">
        <text>114;101;115;117;108;116;32;61;32;97;32;45;32;98;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;114;101;115;117;108;116;</text>
      </strelem>
    </fall>
    <fall fallname="42;">
      <strelem typ="0" zx="0" zy="0">
        <text>114;101;115;117;108;116;32;61;32;97;32;42;32;98;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;114;101;115;117;108;116;</text>
      </strelem>
    </fall>
    <fall fallname="100;101;102;97;117;108;116;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;85;110;107;110;111;119;110;32;111;112;101;114;97;116;111;114;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Rl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="68;114;105;110;107;115;32;109;97;99;104;105;110;101;32;119;105;116;104;32;98;114;97;110;99;104;101;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;99;104;111;105;99;101;32;34;49;32;119;97;116;101;114;44;32;50;32;106;117;105;99;101;44;32;51;32;99;111;99;111;97;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>99;104;111;105;99;101;32;61;61;32;49;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;72;101;114;101;32;105;115;32;121;111;117;114;32;119;97;116;101;114;46;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="1" zx="0" zy="0">
        <text>99;104;111;105;99;101;32;61;61;32;50;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>111;117;116;112;117;116;58;32;34;72;101;114;101;32;105;115;32;121;111;117;114;32;106;117;105;99;101;46;34;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="1" zx="0" zy="0">
            <text>99;104;111;105;99;101;32;61;61;32;51;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>111;117;116;112;117;116;58;32;34;72;101;114;101;32;105;115;32;121;111;117;114;32;99;111;99;111;97;46;34;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>111;117;116;112;117;116;58;32;34;84;104;105;115;32;98;117;116;116;111;110;32;100;111;101;115;32;110;111;116;32;101;120;105;115;116;46;34;</text>
              </strelem>
            </fall>
          </strelem>
        </fall>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Ul=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="84;104;101;32;116;104;114;101;101;32;98;97;115;105;99;32;98;117;105;108;100;105;110;103;32;98;108;111;99;107;115;" pseudocode="true">
  <strelem typ="0" zx="0" zy="0">
    <text>80;117;116;32;97;32;99;117;112;32;111;110;32;116;104;101;32;116;97;98;108;101;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>83;117;103;97;114;32;119;97;110;116;101;100;63;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>65;100;100;32;115;117;103;97;114;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>248;</text>
      </strelem>
    </fall>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>84;101;97;32;115;116;105;108;108;32;116;111;111;32;104;111;116;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>87;97;105;116;32;49;32;109;105;110;117;116;101;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>68;114;105;110;107;32;116;104;101;32;116;101;97;</text>
  </strelem>
</struktogramm>
`,Yl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="73;110;32;116;104;101;32;109;111;114;110;105;110;103;" pseudocode="true">
  <strelem typ="0" zx="0" zy="0">
    <text>71;101;116;32;117;112;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>66;114;117;115;104;32;116;101;101;116;104;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>71;101;116;32;100;114;101;115;115;101;100;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>72;97;118;101;32;98;114;101;97;107;102;97;115;116;</text>
  </strelem>
</struktogramm>
`,Xl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="77;97;107;101;32;116;101;97;" pseudocode="true">
  <strelem typ="0" zx="0" zy="0">
    <text>70;105;108;108;32;116;104;101;32;107;101;116;116;108;101;32;119;105;116;104;32;119;97;116;101;114;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;119;105;116;99;104;32;111;110;32;116;104;101;32;107;101;116;116;108;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>80;117;116;32;97;32;116;101;97;32;98;97;103;32;105;110;32;116;104;101;32;99;117;112;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>80;111;117;114;32;104;111;116;32;119;97;116;101;114;32;105;110;116;111;32;116;104;101;32;99;117;112;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>87;97;105;116;32;51;32;109;105;110;117;116;101;115;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>84;97;107;101;32;111;117;116;32;116;104;101;32;116;101;97;32;98;97;103;</text>
  </strelem>
</struktogramm>
`,Ql=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;111;32;111;117;116;115;105;100;101;" pseudocode="true">
  <strelem typ="1" zx="0" zy="0">
    <text>73;115;32;105;116;32;114;97;105;110;105;110;103;63;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>80;97;99;107;32;97;110;32;117;109;98;114;101;108;108;97;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>80;97;99;107;32;115;117;110;103;108;97;115;115;101;115;</text>
      </strelem>
    </fall>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>76;101;97;118;101;</text>
  </strelem>
</struktogramm>
`,Jl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="69;97;116;" pseudocode="true">
  <strelem typ="4" zx="0" zy="0">
    <text>80;108;97;116;101;32;110;111;116;32;101;109;112;116;121;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>84;97;107;101;32;97;32;98;105;116;101;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>67;108;101;97;114;32;116;104;101;32;112;108;97;116;101;</text>
  </strelem>
</struktogramm>
`,Ol=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;117;110;116;32;116;111;32;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;67;111;117;110;116;32;117;112;32;116;111;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>105;32;60;61;32;110;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;32;61;32;105;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,$l=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;117;110;116;100;111;119;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;32;61;32;51;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;62;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>110;117;109;98;101;114;32;61;32;110;117;109;98;101;114;32;45;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;116;97;114;116;33;34;</text>
  </strelem>
</struktogramm>
`,Kl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;117;103;58;32;101;110;100;108;101;115;115;32;108;111;111;112;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;32;61;32;51;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;62;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;116;97;114;116;33;34;</text>
  </strelem>
</struktogramm>
`,ql=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;97;99;116;111;114;105;97;108;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;70;97;99;116;111;114;105;97;108;32;111;102;32;119;104;105;99;104;32;110;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;102;97;99;116;111;114;105;97;108;32;61;32;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>105;32;60;61;32;110;</text>
    <schleifeninhalt>
    <strelem typ="0" zx="0" zy="0">
      <text>102;97;99;116;111;114;105;97;108;32;61;32;102;97;99;116;111;114;105;97;108;32;42;32;105;</text>
    </strelem>
    <strelem typ="0" zx="0" zy="0">
      <text>105;32;61;32;105;32;43;32;49;</text>
    </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;110;32;43;32;34;33;32;61;32;34;32;43;32;102;97;99;116;111;114;105;97;108;</text>
  </strelem>
</struktogramm>
`,e0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="68;111;117;98;108;101;32;117;112;32;116;111;32;49;48;48;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;32;34;83;116;97;114;116;32;110;117;109;98;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;116;101;112;115;32;61;32;48;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;60;32;49;48;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>110;117;109;98;101;114;32;61;32;110;117;109;98;101;114;32;42;32;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>115;116;101;112;115;32;61;32;115;116;101;112;115;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;116;101;112;115;</text>
  </strelem>
</struktogramm>
`,t0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;104;101;99;107;32;116;104;101;32;105;110;112;117;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;32;61;32;48;</text>
  </strelem>
  <strelem typ="5" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;60;32;49;32;124;124;32;110;117;109;98;101;114;32;62;32;49;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;110;117;109;98;101;114;32;34;78;117;109;98;101;114;32;102;114;111;109;32;49;32;116;111;32;49;48;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;84;104;97;110;107;32;121;111;117;33;34;</text>
  </strelem>
</struktogramm>
`,n0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="65;116;32;108;101;97;115;116;32;111;110;99;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;48;</text>
  </strelem>
  <strelem typ="5" zx="0" zy="0">
    <text>105;32;60;32;53;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;32;61;32;105;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,i0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="86;97;108;105;100;32;103;114;97;100;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;103;114;97;100;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="5" zx="0" zy="0">
    <text>103;114;97;100;101;32;60;32;49;32;124;124;32;103;114;97;100;101;32;62;32;54;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;103;114;97;100;101;32;34;71;114;97;100;101;32;102;114;111;109;32;49;32;116;111;32;54;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;89;111;117;114;32;103;114;97;100;101;58;32;34;32;43;32;103;114;97;100;101;</text>
  </strelem>
</struktogramm>
`,s0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;32;117;110;116;105;108;32;48;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;32;61;32;48;</text>
  </strelem>
  <strelem typ="5" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;33;61;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;110;117;109;98;101;114;32;34;78;117;109;98;101;114;32;40;48;32;115;116;111;112;115;41;34;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;32;61;32;115;117;109;32;43;32;110;117;109;98;101;114;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;117;109;</text>
  </strelem>
</struktogramm>
`,r0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;117;110;116;100;111;119;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;83;116;97;114;116;32;110;117;109;98;101;114;34;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;110;</text>
    <text>105;32;62;61;32;49;</text>
    <text>105;45;45;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;71;111;33;34;</text>
  </strelem>
</struktogramm>
`,a0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="84;105;109;101;115;32;116;97;98;108;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;32;34;87;104;105;99;104;32;116;105;109;101;115;32;116;97;98;108;101;63;34;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;49;48;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;112;114;111;100;117;99;116;32;61;32;110;117;109;98;101;114;32;42;32;105;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;32;43;32;34;32;120;32;34;32;43;32;105;32;43;32;34;32;61;32;34;32;43;32;112;114;111;100;117;99;116;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,l0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;117;110;116;32;102;114;111;109;32;49;32;116;111;32;53;">
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;53;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,o0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;32;102;114;111;109;32;49;32;116;111;32;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;85;112;32;116;111;32;119;104;105;99;104;32;110;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;110;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;32;61;32;115;117;109;32;43;32;105;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;117;109;</text>
  </strelem>
</struktogramm>
`,u0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;116;97;114;32;116;114;105;97;110;103;108;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;72;111;119;32;109;97;110;121;32;108;105;110;101;115;63;34;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;108;105;110;101;32;61;32;49;</text>
    <text>108;105;110;101;32;60;61;32;110;</text>
    <text>108;105;110;101;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>83;116;114;105;110;103;32;116;101;120;116;32;61;32;34;34;</text>
      </strelem>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;115;116;97;114;32;61;32;49;</text>
        <text>115;116;97;114;32;60;61;32;108;105;110;101;</text>
        <text>115;116;97;114;43;43;</text>
        <schleifeninhalt>
          <strelem typ="0" zx="0" zy="0">
            <text>116;101;120;116;32;61;32;116;101;120;116;32;43;32;34;42;34;</text>
          </strelem>
        </schleifeninhalt>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;116;101;120;116;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,h0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;117;110;116;32;101;118;101;110;32;105;110;112;117;116;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;99;111;117;110;116;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;53;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;32;34;69;110;116;101;114;32;97;32;110;117;109;98;101;114;34;</text>
      </strelem>
      <strelem typ="1" zx="0" zy="0">
        <text>110;117;109;98;101;114;32;37;32;50;32;61;61;32;48;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>99;111;117;110;116;43;43;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>248;</text>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;99;111;117;110;116;</text>
  </strelem>
</struktogramm>
`,m0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;117;110;116;32;101;118;101;110;32;110;117;109;98;101;114;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;85;112;32;116;111;32;119;104;105;99;104;32;110;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;99;111;117;110;116;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;110;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="1" zx="0" zy="0">
        <text>105;32;37;32;50;32;61;61;32;48;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>99;111;117;110;116;43;43;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>248;</text>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;99;111;117;110;116;</text>
  </strelem>
</struktogramm>
`,c0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="82;101;99;116;97;110;103;108;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;119;105;100;116;104;32;34;87;105;100;116;104;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;104;101;105;103;104;116;32;34;72;101;105;103;104;116;34;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;108;105;110;101;32;61;32;49;</text>
    <text>108;105;110;101;32;60;61;32;104;101;105;103;104;116;</text>
    <text>108;105;110;101;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>83;116;114;105;110;103;32;116;101;120;116;32;61;32;34;34;</text>
      </strelem>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;99;111;108;117;109;110;32;61;32;49;</text>
        <text>99;111;108;117;109;110;32;60;61;32;119;105;100;116;104;</text>
        <text>99;111;108;117;109;110;43;43;</text>
        <schleifeninhalt>
          <strelem typ="0" zx="0" zy="0">
            <text>116;101;120;116;32;61;32;116;101;120;116;32;43;32;34;35;34;</text>
          </strelem>
        </schleifeninhalt>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;116;101;120;116;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,d0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="76;111;111;112;32;116;104;114;111;117;103;104;32;97;110;32;97;114;114;97;121;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;110;117;109;98;101;114;115;32;61;32;123;50;44;32;52;44;32;54;44;32;56;44;32;49;48;125;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;110;117;109;98;101;114;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;115;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,g0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;105;114;115;116;32;97;110;100;32;108;97;115;116;32;118;97;108;117;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;118;97;108;117;101;115;32;61;32;123;52;44;32;56;44;32;49;53;44;32;49;54;44;32;50;51;44;32;52;50;125;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;118;97;108;117;101;115;91;48;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;118;97;108;117;101;115;91;118;97;108;117;101;115;46;108;101;110;103;116;104;32;45;32;49;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;118;97;108;117;101;115;46;108;101;110;103;116;104;</text>
  </strelem>
</struktogramm>
`,p0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="69;110;116;101;114;32;110;97;109;101;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;91;93;32;110;97;109;101;115;32;61;32;110;101;119;32;83;116;114;105;110;103;91;51;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;110;97;109;101;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;110;97;109;101;115;91;105;93;32;34;69;110;116;101;114;32;97;32;110;97;109;101;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;70;105;114;115;116;32;110;97;109;101;58;32;34;32;43;32;110;97;109;101;115;91;48;93;</text>
  </strelem>
</struktogramm>
`,x0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="80;114;105;110;116;32;98;97;99;107;119;97;114;100;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;110;117;109;98;101;114;115;32;61;32;110;101;119;32;105;110;116;91;52;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;110;117;109;98;101;114;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;110;117;109;98;101;114;115;91;105;93;32;34;69;110;116;101;114;32;97;32;110;117;109;98;101;114;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;110;117;109;98;101;114;115;46;108;101;110;103;116;104;32;45;32;49;</text>
    <text>105;32;62;61;32;48;</text>
    <text>105;45;45;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;115;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,b0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;32;97;110;100;32;109;97;120;105;109;117;109;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;110;117;109;98;101;114;115;32;61;32;110;101;119;32;105;110;116;91;53;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;110;117;109;98;101;114;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;110;117;109;98;101;114;115;91;105;93;32;34;69;110;116;101;114;32;97;32;110;117;109;98;101;114;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;109;97;120;32;61;32;110;117;109;98;101;114;115;91;48;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;110;117;109;98;101;114;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;32;61;32;115;117;109;32;43;32;110;117;109;98;101;114;115;91;105;93;</text>
      </strelem>
      <strelem typ="1" zx="0" zy="0">
        <text>110;117;109;98;101;114;115;91;105;93;32;62;32;109;97;120;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>109;97;120;32;61;32;110;117;109;98;101;114;115;91;105;93;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>248;</text>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;117;109;58;32;34;32;43;32;115;117;109;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;77;97;120;105;109;117;109;58;32;34;32;43;32;109;97;120;</text>
  </strelem>
</struktogramm>
`,f0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;32;97;110;100;32;109;97;120;105;109;117;109;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;112;111;105;110;116;115;32;61;32;123;49;50;44;32;55;44;32;49;57;44;32;52;125;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;109;97;120;32;61;32;112;111;105;110;116;115;91;48;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;112;111;105;110;116;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;32;61;32;115;117;109;32;43;32;112;111;105;110;116;115;91;105;93;</text>
      </strelem>
      <strelem typ="1" zx="0" zy="0">
        <text>112;111;105;110;116;115;91;105;93;32;62;32;109;97;120;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>109;97;120;32;61;32;112;111;105;110;116;115;91;105;93;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>248;</text>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;117;109;58;32;34;32;43;32;115;117;109;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;77;97;120;105;109;117;109;58;32;34;32;43;32;109;97;120;</text>
  </strelem>
</struktogramm>
`,I0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;32;117;110;116;105;108;32;48;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;32;34;69;110;116;101;114;32;97;32;110;117;109;98;101;114;32;40;48;32;61;32;115;116;111;112;41;34;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;33;61;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;32;61;32;115;117;109;32;43;32;110;117;109;98;101;114;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;110;117;109;98;101;114;32;34;69;110;116;101;114;32;97;32;110;117;109;98;101;114;32;40;48;32;61;32;115;116;111;112;41;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;117;109;58;32;34;32;43;32;115;117;109;</text>
  </strelem>
</struktogramm>
`,y0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;32;117;110;116;105;108;32;48;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;48;</text>
  </strelem>
  <strelem typ="6" zx="0" zy="0">
    <text></text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;32;34;69;110;116;101;114;32;97;32;110;117;109;98;101;114;32;40;48;32;61;32;115;116;111;112;41;34;</text>
      </strelem>
      <strelem typ="1" zx="0" zy="0">
        <text>110;117;109;98;101;114;32;61;61;32;48;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="7" zx="0" zy="0">
            <text>76;101;97;118;101;32;116;104;101;32;108;111;111;112;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>115;117;109;32;61;32;115;117;109;32;43;32;110;117;109;98;101;114;</text>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;117;109;58;32;34;32;43;32;115;117;109;</text>
  </strelem>
</struktogramm>
`,z0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="82;101;99;116;97;110;103;108;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;108;101;110;103;116;104;32;34;76;101;110;103;116;104;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;119;105;100;116;104;32;34;87;105;100;116;104;63;34;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>105;110;116;32;102;32;61;32;97;114;101;97;40;108;101;110;103;116;104;44;32;119;105;100;116;104;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;65;114;101;97;58;32;34;32;43;32;102;</text>
  </strelem>
</struktogramm>
`,w0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="105;110;116;32;97;114;101;97;40;105;110;116;32;97;44;32;105;110;116;32;98;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>114;101;116;117;114;110;32;97;32;42;32;98;</text>
  </strelem>
</struktogramm>
`,v0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="81;117;105;122;">
  <strelem typ="8" zx="0" zy="0">
    <text>115;104;111;119;71;114;101;101;116;105;110;103;40;41;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>97;115;107;81;117;101;115;116;105;111;110;115;40;41;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>115;104;111;119;82;101;115;117;108;116;40;41;</text>
  </strelem>
</struktogramm>
`,k0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;113;117;97;114;101;32;110;117;109;98;101;114;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;32;34;87;104;105;99;104;32;110;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>105;110;116;32;113;32;61;32;115;113;117;97;114;101;40;110;117;109;98;101;114;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;84;104;101;32;115;113;117;97;114;101;32;105;115;32;34;32;43;32;113;</text>
  </strelem>
</struktogramm>
`,S0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="105;110;116;32;115;113;117;97;114;101;40;105;110;116;32;120;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;114;101;115;117;108;116;32;61;32;120;32;42;32;120;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>114;101;116;117;114;110;32;114;101;115;117;108;116;</text>
  </strelem>
</struktogramm>
`,Z0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;114;101;101;116;105;110;103;32;119;105;116;104;32;97;32;99;97;108;108;">
  <strelem typ="8" zx="0" zy="0">
    <text>115;104;111;119;84;105;116;108;101;40;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;110;97;109;101;32;34;87;104;97;116;32;105;115;32;121;111;117;114;32;110;97;109;101;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;101;108;108;111;32;34;32;43;32;110;97;109;101;</text>
  </strelem>
</struktogramm>
`,M0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="115;104;111;119;71;114;101;101;116;105;110;103;40;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;87;101;108;99;111;109;101;32;116;111;32;116;104;101;32;113;117;105;122;33;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;89;111;117;32;103;101;116;32;116;104;114;101;101;32;113;117;101;115;116;105;111;110;115;46;34;</text>
  </strelem>
</struktogramm>
`,_0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;104;111;119;32;115;117;109;115;">
  <strelem typ="8" zx="0" zy="0">
    <text>115;104;111;119;83;117;109;40;51;44;32;52;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;120;32;61;32;49;48;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>115;104;111;119;83;117;109;40;120;44;32;120;32;43;32;49;41;</text>
  </strelem>
</struktogramm>
`,j0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="118;111;105;100;32;115;104;111;119;83;117;109;40;105;110;116;32;97;44;32;105;110;116;32;98;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;97;32;43;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;97;32;43;32;34;32;43;32;34;32;43;32;98;32;43;32;34;32;61;32;34;32;43;32;115;117;109;</text>
  </strelem>
</struktogramm>
`,T0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;117;110;116;100;111;119;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;115;116;97;114;116;32;34;83;116;97;114;116;32;118;97;108;117;101;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;115;116;97;114;116;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>105;32;62;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;32;61;32;105;32;45;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;71;111;33;34;</text>
  </strelem>
</struktogramm>
`,A0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;117;110;116;100;111;119;110;32;40;119;105;116;104;32;97;32;98;117;103;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;115;116;97;114;116;32;34;83;116;97;114;116;32;118;97;108;117;101;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;115;116;97;114;116;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>105;32;62;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;32;61;32;105;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;71;111;34;</text>
  </strelem>
</struktogramm>
`,D0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="68;101;115;107;32;99;104;101;99;107;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>105;32;60;61;32;51;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;32;61;32;115;117;109;32;43;32;105;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;32;61;32;105;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;117;109;</text>
  </strelem>
</struktogramm>
`,P0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;32;117;112;32;116;111;32;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;85;112;32;116;111;32;119;104;105;99;104;32;110;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;110;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;32;61;32;115;117;109;32;43;32;105;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;117;109;</text>
  </strelem>
</struktogramm>
`,C0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;32;117;112;32;116;111;32;110;32;40;119;105;116;104;32;97;32;98;117;103;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;85;112;32;116;111;32;119;104;105;99;104;32;110;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;32;110;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;32;61;32;115;117;109;32;43;32;105;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;117;109;</text>
  </strelem>
</struktogramm>
`,W0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="84;105;109;101;115;84;97;98;108;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;32;34;87;104;105;99;104;32;116;105;109;101;115;32;116;97;98;108;101;63;34;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;51;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;114;101;115;117;108;116;32;61;32;110;117;109;98;101;114;32;42;32;105;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;32;43;32;34;32;116;105;109;101;115;32;34;32;43;32;110;117;109;98;101;114;32;43;32;34;32;61;32;34;32;43;32;114;101;115;117;108;116;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;62;32;49;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;84;104;97;116;32;119;97;115;32;104;97;114;100;33;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;84;104;97;116;32;119;97;115;32;101;97;115;121;46;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,B0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;97;99;116;111;114;105;97;108;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;69;110;116;101;114;32;97;32;110;117;109;98;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;102;97;99;116;111;114;105;97;108;32;61;32;49;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;110;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>102;97;99;116;111;114;105;97;108;32;61;32;102;97;99;116;111;114;105;97;108;32;42;32;105;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;102;97;99;116;111;114;105;97;108;</text>
  </strelem>
</struktogramm>
`,H0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="84;105;99;107;101;116;32;112;114;105;99;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;103;101;32;34;72;111;119;32;111;108;100;32;97;114;101;32;121;111;117;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>97;103;101;32;60;32;54;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;70;114;101;101;32;101;110;116;114;121;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="1" zx="0" zy="0">
        <text>97;103;101;32;60;32;49;56;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>111;117;116;112;117;116;58;32;34;67;104;105;108;100;32;116;105;99;107;101;116;58;32;52;32;101;117;114;111;115;34;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>111;117;116;112;117;116;58;32;34;65;100;117;108;116;32;116;105;99;107;101;116;58;32;56;32;101;117;114;111;115;34;</text>
          </strelem>
        </fall>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,G0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;116;101;112;115;32;111;102;32;116;104;114;101;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;32;34;83;116;97;114;116;32;118;97;108;117;101;63;34;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;62;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>110;117;109;98;101;114;32;61;32;110;117;109;98;101;114;32;45;32;51;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;69;110;100;34;</text>
  </strelem>
</struktogramm>
`,N0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="86;111;116;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;103;101;32;34;72;111;119;32;111;108;100;32;97;114;101;32;121;111;117;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>97;103;101;32;62;61;32;49;54;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;89;111;117;32;109;97;121;32;118;111;116;101;46;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;121;101;97;114;115;32;61;32;49;54;32;45;32;97;103;101;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;87;97;105;116;32;34;32;43;32;121;101;97;114;115;32;43;32;34;32;109;111;114;101;32;121;101;97;114;115;46;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,E0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="69;118;101;110;32;110;117;109;98;101;114;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;108;105;109;105;116;32;34;85;112;32;116;111;32;119;104;105;99;104;32;110;117;109;98;101;114;63;34;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;61;32;108;105;109;105;116;</text>
    <text>105;32;61;32;105;32;43;32;50;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,L0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;114;101;101;116;105;110;103;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;71;111;111;100;32;109;111;114;110;105;110;103;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;84;111;100;97;121;32;119;101;32;108;101;97;114;110;32;115;116;114;117;99;116;117;114;101;32;99;104;97;114;116;115;46;34;</text>
  </strelem>
</struktogramm>
`,V0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="72;101;108;108;111;32;87;111;114;108;100;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;101;108;108;111;32;87;111;114;108;100;34;</text>
  </strelem>
</struktogramm>
`,F0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="84;119;111;32;108;105;110;101;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;101;108;108;111;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;73;32;97;109;32;108;101;97;114;110;105;110;103;32;115;116;114;117;99;116;117;114;101;32;99;104;97;114;116;115;34;</text>
  </strelem>
</struktogramm>
`,R0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;105;110;101;109;97;32;116;105;99;107;101;116;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;99;111;117;110;116;32;34;72;111;119;32;109;97;110;121;32;116;105;99;107;101;116;115;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;116;111;116;97;108;32;61;32;99;111;117;110;116;32;42;32;56;46;53;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;84;111;116;97;108;58;32;34;32;43;32;116;111;116;97;108;</text>
  </strelem>
</struktogramm>
`,U0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;105;110;101;109;97;32;116;105;99;107;101;116;115;32;40;119;105;116;104;32;97;32;98;117;103;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;99;111;117;110;116;32;34;72;111;119;32;109;97;110;121;32;116;105;99;107;101;116;115;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;84;111;116;97;108;58;32;34;32;43;32;116;111;116;97;108;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;116;111;116;97;108;32;61;32;99;111;117;110;116;32;42;32;56;46;53;</text>
  </strelem>
</struktogramm>
`,Y0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;119;97;112;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;32;34;70;105;114;115;116;32;110;117;109;98;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;32;34;83;101;99;111;110;100;32;110;117;109;98;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;116;101;109;112;32;61;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>97;32;61;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>98;32;61;32;116;101;109;112;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;98;</text>
  </strelem>
</struktogramm>
`,X0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;119;97;112;32;40;119;105;116;104;32;97;32;98;117;103;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;32;34;70;105;114;115;116;32;110;117;109;98;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;32;34;83;101;99;111;110;100;32;110;117;109;98;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>97;32;61;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>98;32;61;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;98;</text>
  </strelem>
</struktogramm>
`,Q0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;119;97;112;32;118;97;108;117;101;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;32;61;32;51;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;98;32;61;32;53;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;116;101;109;112;32;61;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>97;32;61;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>98;32;61;32;116;101;109;112;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;97;32;61;32;34;32;43;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;98;32;61;32;34;32;43;32;98;</text>
  </strelem>
</struktogramm>
`,J0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;111;114;116;32;100;101;115;99;101;110;100;105;110;103;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;99;97;114;100;115;32;61;32;110;101;119;32;105;110;116;91;53;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;99;97;114;100;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;99;97;114;100;115;91;105;93;32;34;69;110;116;101;114;32;97;32;99;97;114;100;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;114;111;117;110;100;32;61;32;49;</text>
    <text>114;111;117;110;100;32;60;32;99;97;114;100;115;46;108;101;110;103;116;104;</text>
    <text>114;111;117;110;100;43;43;</text>
    <schleifeninhalt>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;105;32;61;32;48;</text>
        <text>105;32;60;32;99;97;114;100;115;46;108;101;110;103;116;104;32;45;32;114;111;117;110;100;</text>
        <text>105;43;43;</text>
        <schleifeninhalt>
          <strelem typ="1" zx="0" zy="0">
            <text>99;97;114;100;115;91;105;93;32;60;32;99;97;114;100;115;91;105;32;43;32;49;93;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>105;110;116;32;116;101;109;112;32;61;32;99;97;114;100;115;91;105;93;</text>
              </strelem>
              <strelem typ="0" zx="0" zy="0">
                <text>99;97;114;100;115;91;105;93;32;61;32;99;97;114;100;115;91;105;32;43;32;49;93;</text>
              </strelem>
              <strelem typ="0" zx="0" zy="0">
                <text>99;97;114;100;115;91;105;32;43;32;49;93;32;61;32;116;101;109;112;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>248;</text>
              </strelem>
            </fall>
          </strelem>
        </schleifeninhalt>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;99;97;114;100;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;99;97;114;100;115;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,O0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;111;114;116;32;100;101;115;99;101;110;100;105;110;103;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;99;97;114;100;115;32;61;32;110;101;119;32;105;110;116;91;53;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;99;97;114;100;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;99;97;114;100;115;91;105;93;32;34;69;110;116;101;114;32;97;32;99;97;114;100;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;114;111;117;110;100;32;61;32;49;</text>
    <text>114;111;117;110;100;32;60;32;99;97;114;100;115;46;108;101;110;103;116;104;</text>
    <text>114;111;117;110;100;43;43;</text>
    <schleifeninhalt>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;105;32;61;32;48;</text>
        <text>105;32;60;32;99;97;114;100;115;46;108;101;110;103;116;104;32;45;32;114;111;117;110;100;</text>
        <text>105;43;43;</text>
        <schleifeninhalt>
          <strelem typ="1" zx="0" zy="0">
            <text>99;97;114;100;115;91;105;93;32;62;32;99;97;114;100;115;91;105;32;43;32;49;93;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>105;110;116;32;116;101;109;112;32;61;32;99;97;114;100;115;91;105;93;</text>
              </strelem>
              <strelem typ="0" zx="0" zy="0">
                <text>99;97;114;100;115;91;105;93;32;61;32;99;97;114;100;115;91;105;32;43;32;49;93;</text>
              </strelem>
              <strelem typ="0" zx="0" zy="0">
                <text>99;97;114;100;115;91;105;32;43;32;49;93;32;61;32;116;101;109;112;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>248;</text>
              </strelem>
            </fall>
          </strelem>
        </schleifeninhalt>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;99;97;114;100;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;99;97;114;100;115;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,$0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;105;110;97;114;121;32;115;101;97;114;99;104;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;99;97;114;100;115;32;61;32;123;50;44;32;51;44;32;53;44;32;55;44;32;56;44;32;49;48;44;32;49;50;44;32;49;51;44;32;49;53;44;32;49;56;44;32;50;48;44;32;50;49;44;32;50;52;44;32;50;55;44;32;51;48;125;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;116;97;114;103;101;116;32;34;87;104;105;99;104;32;99;97;114;100;32;97;114;101;32;121;111;117;32;108;111;111;107;105;110;103;32;102;111;114;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;112;111;115;105;116;105;111;110;32;61;32;45;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;99;111;109;112;97;114;105;115;111;110;115;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;108;101;102;116;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;114;105;103;104;116;32;61;32;99;97;114;100;115;46;108;101;110;103;116;104;32;45;32;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;109;105;100;100;108;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>112;111;115;105;116;105;111;110;32;61;61;32;45;49;32;38;38;32;108;101;102;116;32;60;61;32;114;105;103;104;116;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>109;105;100;100;108;101;32;61;32;40;108;101;102;116;32;43;32;114;105;103;104;116;41;32;47;32;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>99;111;109;112;97;114;105;115;111;110;115;32;61;32;99;111;109;112;97;114;105;115;111;110;115;32;43;32;49;</text>
      </strelem>
      <strelem typ="1" zx="0" zy="0">
        <text>99;97;114;100;115;91;109;105;100;100;108;101;93;32;61;61;32;116;97;114;103;101;116;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>112;111;115;105;116;105;111;110;32;61;32;109;105;100;100;108;101;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="1" zx="0" zy="0">
            <text>99;97;114;100;115;91;109;105;100;100;108;101;93;32;60;32;116;97;114;103;101;116;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>108;101;102;116;32;61;32;109;105;100;100;108;101;32;43;32;49;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>114;105;103;104;116;32;61;32;109;105;100;100;108;101;32;45;32;49;</text>
              </strelem>
            </fall>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>112;111;115;105;116;105;111;110;32;62;61;32;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;70;111;117;110;100;32;97;116;32;112;111;115;105;116;105;111;110;32;34;32;43;32;112;111;115;105;116;105;111;110;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;78;111;116;32;102;111;117;110;100;34;</text>
      </strelem>
    </fall>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;67;111;109;112;97;114;105;115;111;110;115;58;32;34;32;43;32;99;111;109;112;97;114;105;115;111;110;115;</text>
  </strelem>
</struktogramm>
`,K0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;117;98;98;108;101;32;115;111;114;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;99;97;114;100;115;32;61;32;123;55;44;32;51;44;32;49;48;44;32;53;44;32;50;125;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;114;111;117;110;100;32;61;32;49;</text>
    <text>114;111;117;110;100;32;60;32;99;97;114;100;115;46;108;101;110;103;116;104;</text>
    <text>114;111;117;110;100;43;43;</text>
    <schleifeninhalt>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;105;32;61;32;48;</text>
        <text>105;32;60;32;99;97;114;100;115;46;108;101;110;103;116;104;32;45;32;114;111;117;110;100;</text>
        <text>105;43;43;</text>
        <schleifeninhalt>
          <strelem typ="1" zx="0" zy="0">
            <text>99;97;114;100;115;91;105;93;32;62;32;99;97;114;100;115;91;105;32;43;32;49;93;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>105;110;116;32;116;101;109;112;32;61;32;99;97;114;100;115;91;105;93;</text>
              </strelem>
              <strelem typ="0" zx="0" zy="0">
                <text>99;97;114;100;115;91;105;93;32;61;32;99;97;114;100;115;91;105;32;43;32;49;93;</text>
              </strelem>
              <strelem typ="0" zx="0" zy="0">
                <text>99;97;114;100;115;91;105;32;43;32;49;93;32;61;32;116;101;109;112;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>248;</text>
              </strelem>
            </fall>
          </strelem>
        </schleifeninhalt>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;99;97;114;100;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;99;97;114;100;115;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,q0=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;105;110;100;32;97;32;99;97;114;100;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;99;97;114;100;115;32;61;32;123;56;44;32;52;44;32;49;49;44;32;52;44;32;54;125;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;116;97;114;103;101;116;32;34;87;104;105;99;104;32;99;97;114;100;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;112;111;115;105;116;105;111;110;32;61;32;45;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>112;111;115;105;116;105;111;110;32;61;61;32;45;49;32;38;38;32;105;32;60;32;99;97;114;100;115;46;108;101;110;103;116;104;</text>
    <schleifeninhalt>
      <strelem typ="1" zx="0" zy="0">
        <text>99;97;114;100;115;91;105;93;32;61;61;32;116;97;114;103;101;116;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>112;111;115;105;116;105;111;110;32;61;32;105;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>248;</text>
          </strelem>
        </fall>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;32;61;32;105;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>112;111;115;105;116;105;111;110;32;62;61;32;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;80;111;115;105;116;105;111;110;58;32;34;32;43;32;112;111;115;105;116;105;111;110;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;78;111;116;32;102;111;117;110;100;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,eo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="76;105;110;101;97;114;32;115;101;97;114;99;104;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;99;97;114;100;115;32;61;32;123;50;44;32;51;44;32;53;44;32;55;44;32;56;44;32;49;48;44;32;49;50;44;32;49;51;44;32;49;53;44;32;49;56;44;32;50;48;44;32;50;49;44;32;50;52;44;32;50;55;44;32;51;48;125;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;116;97;114;103;101;116;32;34;87;104;105;99;104;32;99;97;114;100;32;97;114;101;32;121;111;117;32;108;111;111;107;105;110;103;32;102;111;114;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;112;111;115;105;116;105;111;110;32;61;32;45;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;99;111;109;112;97;114;105;115;111;110;115;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>112;111;115;105;116;105;111;110;32;61;61;32;45;49;32;38;38;32;105;32;60;32;99;97;114;100;115;46;108;101;110;103;116;104;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>99;111;109;112;97;114;105;115;111;110;115;32;61;32;99;111;109;112;97;114;105;115;111;110;115;32;43;32;49;</text>
      </strelem>
      <strelem typ="1" zx="0" zy="0">
        <text>99;97;114;100;115;91;105;93;32;61;61;32;116;97;114;103;101;116;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>112;111;115;105;116;105;111;110;32;61;32;105;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>248;</text>
          </strelem>
        </fall>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;32;61;32;105;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>112;111;115;105;116;105;111;110;32;62;61;32;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;70;111;117;110;100;32;97;116;32;112;111;115;105;116;105;111;110;32;34;32;43;32;112;111;115;105;116;105;111;110;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;78;111;116;32;102;111;117;110;100;34;</text>
      </strelem>
    </fall>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;67;111;109;112;97;114;105;115;111;110;115;58;32;34;32;43;32;99;111;109;112;97;114;105;115;111;110;115;</text>
  </strelem>
</struktogramm>
`,to=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="77;97;105;110;32;112;114;111;103;114;97;109;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;112;111;105;110;116;115;32;61;32;123;51;44;32;53;44;32;56;125;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>98;111;110;117;115;40;112;111;105;110;116;115;41;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;112;111;105;110;116;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;112;111;105;110;116;115;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,no=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="77;97;105;110;32;112;114;111;103;114;97;109;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;112;111;105;110;116;115;32;61;32;123;51;44;32;53;44;32;56;125;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>98;111;110;117;115;40;112;111;105;110;116;115;41;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;112;111;105;110;116;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;112;111;105;110;116;115;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,io=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="118;111;105;100;32;98;111;110;117;115;40;105;110;116;91;93;32;112;111;105;110;116;115;41;">
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;112;111;105;110;116;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>112;111;105;110;116;115;91;105;93;32;61;32;112;111;105;110;116;115;91;105;93;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,so=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="77;97;105;110;32;112;114;111;103;114;97;109;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;32;61;32;53;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>100;111;117;98;108;101;73;116;40;110;117;109;98;101;114;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;73;110;32;116;104;101;32;109;97;105;110;32;112;114;111;103;114;97;109;58;32;110;117;109;98;101;114;32;61;32;34;32;43;32;110;117;109;98;101;114;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;32;114;111;119;32;61;32;123;116;114;117;101;44;32;116;114;117;101;44;32;102;97;108;115;101;44;32;116;114;117;101;125;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;66;101;102;111;114;101;58;32;34;32;43;32;114;111;119;91;48;93;32;43;32;34;44;32;34;32;43;32;114;111;119;91;49;93;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>99;108;101;97;114;40;114;111;119;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;65;102;116;101;114;58;32;34;32;43;32;114;111;119;91;48;93;32;43;32;34;44;32;34;32;43;32;114;111;119;91;49;93;</text>
  </strelem>
</struktogramm>
`,ro=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="118;111;105;100;32;99;108;101;97;114;40;98;111;111;108;101;97;110;91;93;32;115;101;97;116;115;41;">
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;115;101;97;116;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>115;101;97;116;115;91;105;93;32;61;32;102;97;108;115;101;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,ao=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="118;111;105;100;32;100;111;117;98;108;101;73;116;40;105;110;116;32;120;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>120;32;61;32;120;32;42;32;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;73;110;32;116;104;101;32;115;117;98;112;114;111;103;114;97;109;58;32;120;32;61;32;34;32;43;32;120;</text>
  </strelem>
</struktogramm>
`,lo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="73;110;105;116;105;97;108;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;102;105;114;115;116;78;97;109;101;32;34;70;105;114;115;116;32;110;97;109;101;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;108;97;115;116;78;97;109;101;32;34;76;97;115;116;32;110;97;109;101;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;102;105;114;115;116;78;97;109;101;46;99;104;97;114;65;116;40;48;41;32;43;32;34;46;32;34;32;43;32;108;97;115;116;78;97;109;101;46;99;104;97;114;65;116;40;48;41;32;43;32;34;46;34;</text>
  </strelem>
</struktogramm>
`,oo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;97;99;107;119;97;114;100;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;119;111;114;100;32;34;69;110;116;101;114;32;97;32;119;111;114;100;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;98;97;99;107;119;97;114;100;115;32;61;32;34;34;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;119;111;114;100;46;108;101;110;103;116;104;40;41;32;45;32;49;</text>
    <text>105;32;62;61;32;48;</text>
    <text>105;45;45;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>98;97;99;107;119;97;114;100;115;32;61;32;98;97;99;107;119;97;114;100;115;32;43;32;119;111;114;100;46;99;104;97;114;65;116;40;105;41;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;98;97;99;107;119;97;114;100;115;</text>
  </strelem>
</struktogramm>
`,uo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;112;108;105;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;108;105;110;101;32;61;32;34;76;117;100;119;105;103;59;98;105;108;108;121;32;103;111;97;116;59;55;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;91;93;32;112;97;114;116;115;32;61;32;108;105;110;101;46;115;112;108;105;116;40;34;59;34;41;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;112;97;114;116;115;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;32;43;32;34;58;32;34;32;43;32;112;97;114;116;115;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,ho=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;117;110;116;32;119;111;114;100;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;115;101;110;116;101;110;99;101;32;34;69;110;116;101;114;32;97;32;115;101;110;116;101;110;99;101;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;91;93;32;119;111;114;100;115;32;61;32;115;101;110;116;101;110;99;101;46;115;112;108;105;116;40;34;32;34;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;87;111;114;100;115;58;32;34;32;43;32;119;111;114;100;115;46;108;101;110;103;116;104;</text>
  </strelem>
</struktogramm>
`,mo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;117;110;116;32;108;101;116;116;101;114;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;119;111;114;100;32;34;69;110;116;101;114;32;97;32;119;111;114;100;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;99;111;117;110;116;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;119;111;114;100;46;108;101;110;103;116;104;40;41;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="1" zx="0" zy="0">
        <text>119;111;114;100;46;99;104;97;114;65;116;40;105;41;32;61;61;32;39;101;39;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>99;111;117;110;116;32;61;32;99;111;117;110;116;32;43;32;49;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>248;</text>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;78;117;109;98;101;114;32;111;102;32;101;58;32;34;32;43;32;99;111;117;110;116;</text>
  </strelem>
</struktogramm>
`,co=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;116;114;105;110;103;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;119;111;114;100;32;61;32;34;66;105;108;108;121;103;111;97;116;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;119;111;114;100;46;108;101;110;103;116;104;40;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;119;111;114;100;46;99;104;97;114;65;116;40;48;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;119;111;114;100;46;115;117;98;115;116;114;105;110;103;40;48;44;32;53;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;119;111;114;100;46;115;117;98;115;116;114;105;110;103;40;53;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;119;111;114;100;46;105;110;100;101;120;79;102;40;34;103;111;97;116;34;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;119;111;114;100;46;116;111;85;112;112;101;114;67;97;115;101;40;41;</text>
  </strelem>
</struktogramm>
`,go=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="69;105;110;109;97;108;101;105;110;115;45;84;97;98;101;108;108;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;91;93;32;116;97;98;101;108;108;101;32;61;32;110;101;119;32;105;110;116;91;49;48;93;91;49;48;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;116;97;98;101;108;108;101;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;106;32;61;32;48;</text>
        <text>106;32;60;32;116;97;98;101;108;108;101;91;105;93;46;108;101;110;103;116;104;</text>
        <text>106;43;43;</text>
        <schleifeninhalt>
          <strelem typ="0" zx="0" zy="0">
            <text>116;97;98;101;108;108;101;91;105;93;91;106;93;32;61;32;40;105;32;43;32;49;41;32;42;32;40;106;32;43;32;49;41;</text>
          </strelem>
        </schleifeninhalt>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;32;34;69;114;115;116;101;32;90;97;104;108;32;40;49;32;98;105;115;32;49;48;41;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;32;34;90;119;101;105;116;101;32;90;97;104;108;32;40;49;32;98;105;115;32;49;48;41;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;97;32;43;32;34;32;183;32;34;32;43;32;98;32;43;32;34;32;61;32;34;32;43;32;116;97;98;101;108;108;101;91;97;32;45;32;49;93;91;98;32;45;32;49;93;</text>
  </strelem>
</struktogramm>
`,po=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;114;101;105;101;32;80;108;228;116;122;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;115;105;116;122;101;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;51;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;48;93;91;48;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;49;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;50;93;91;51;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;102;114;101;105;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;114;101;105;104;101;32;61;32;48;</text>
    <text>114;101;105;104;101;32;60;32;115;105;116;122;101;46;108;101;110;103;116;104;</text>
    <text>114;101;105;104;101;43;43;</text>
    <schleifeninhalt>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;112;108;97;116;122;32;61;32;48;</text>
        <text>112;108;97;116;122;32;60;32;115;105;116;122;101;91;114;101;105;104;101;93;46;108;101;110;103;116;104;</text>
        <text>112;108;97;116;122;43;43;</text>
        <schleifeninhalt>
          <strelem typ="1" zx="0" zy="0">
            <text>33;115;105;116;122;101;91;114;101;105;104;101;93;91;112;108;97;116;122;93;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>102;114;101;105;32;61;32;102;114;101;105;32;43;32;49;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>248;</text>
              </strelem>
            </fall>
          </strelem>
        </schleifeninhalt>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;70;114;101;105;58;32;34;32;43;32;102;114;101;105;</text>
  </strelem>
</struktogramm>
`,xo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;114;101;105;101;32;80;108;228;116;122;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;115;105;116;122;101;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;51;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;48;93;91;48;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;49;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;50;93;91;51;93;32;61;32;116;114;117;101;</text>
  </strelem>
</struktogramm>
`,bo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="75;97;114;116;101;32;118;101;114;107;97;117;102;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;115;105;116;122;101;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;51;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;49;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;49;93;91;51;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;114;101;105;104;101;32;34;82;101;105;104;101;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;112;108;97;116;122;32;34;80;108;97;116;122;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>115;105;116;122;101;91;114;101;105;104;101;93;91;112;108;97;116;122;93;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;83;99;104;111;110;32;118;101;114;107;97;117;102;116;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>115;105;116;122;101;91;114;101;105;104;101;93;91;112;108;97;116;122;93;32;61;32;116;114;117;101;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;86;101;114;107;97;117;102;116;58;32;82;101;105;104;101;32;34;32;43;32;114;101;105;104;101;32;43;32;34;44;32;80;108;97;116;122;32;34;32;43;32;112;108;97;116;122;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,fo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="75;97;114;116;101;32;118;101;114;107;97;117;102;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;115;105;116;122;101;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;51;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;49;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;49;93;91;51;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;114;101;105;104;101;32;34;82;101;105;104;101;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;112;108;97;116;122;32;34;80;108;97;116;122;34;</text>
  </strelem>
</struktogramm>
`,Io=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;97;97;108;112;108;97;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;115;105;116;122;101;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;51;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;48;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;49;93;91;49;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;49;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;114;101;105;104;101;32;61;32;48;</text>
    <text>114;101;105;104;101;32;60;32;115;105;116;122;101;46;108;101;110;103;116;104;</text>
    <text>114;101;105;104;101;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>83;116;114;105;110;103;32;122;101;105;108;101;32;61;32;34;34;</text>
      </strelem>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;112;108;97;116;122;32;61;32;48;</text>
        <text>112;108;97;116;122;32;60;32;115;105;116;122;101;91;114;101;105;104;101;93;46;108;101;110;103;116;104;</text>
        <text>112;108;97;116;122;43;43;</text>
        <schleifeninhalt>
          <strelem typ="1" zx="0" zy="0">
            <text>115;105;116;122;101;91;114;101;105;104;101;93;91;112;108;97;116;122;93;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>122;101;105;108;101;32;61;32;122;101;105;108;101;32;43;32;34;88;34;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>122;101;105;108;101;32;61;32;122;101;105;108;101;32;43;32;34;79;34;</text>
              </strelem>
            </fall>
          </strelem>
        </schleifeninhalt>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;122;101;105;108;101;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,yo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="75;105;110;111;115;97;97;108;">
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;91;93;32;115;105;116;122;101;32;61;32;110;101;119;32;98;111;111;108;101;97;110;91;51;93;91;53;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;48;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;49;93;91;49;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>115;105;116;122;101;91;49;93;91;50;93;32;61;32;116;114;117;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;82;101;105;104;101;110;58;32;34;32;43;32;115;105;116;122;101;46;108;101;110;103;116;104;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;80;108;228;116;122;101;32;112;114;111;32;82;101;105;104;101;58;32;34;32;43;32;115;105;116;122;101;91;48;93;46;108;101;110;103;116;104;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;82;101;105;104;101;32;49;44;32;80;108;97;116;122;32;50;32;118;101;114;107;97;117;102;116;63;32;34;32;43;32;115;105;116;122;101;91;49;93;91;50;93;</text>
  </strelem>
</struktogramm>
`,zo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="82;101;105;104;101;110;102;111;108;103;101;32;122;228;104;108;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;122;97;104;108;32;61;32;51;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>122;97;104;108;32;61;32;122;97;104;108;32;42;32;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>122;97;104;108;32;61;32;122;97;104;108;32;43;32;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;122;97;104;108;</text>
  </strelem>
</struktogramm>
`,wo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="82;101;105;104;101;110;102;111;108;103;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;122;97;104;108;32;61;32;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>122;97;104;108;32;61;32;122;97;104;108;32;43;32;51;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>122;97;104;108;32;61;32;122;97;104;108;32;42;32;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;122;97;104;108;</text>
  </strelem>
</struktogramm>
`,vo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="82;101;105;104;101;110;102;111;108;103;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;122;97;104;108;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>122;97;104;108;32;61;32;122;97;104;108;32;42;32;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;122;97;104;108;32;61;32;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>122;97;104;108;32;61;32;122;97;104;108;32;43;32;51;</text>
  </strelem>
</struktogramm>
`,ko=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;108;228;115;101;114;32;116;97;117;115;99;104;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;108;105;110;107;115;32;61;32;34;83;97;102;116;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;114;101;99;104;116;115;32;61;32;34;87;97;115;115;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;104;105;108;102;32;61;32;108;105;110;107;115;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>108;105;110;107;115;32;61;32;114;101;99;104;116;115;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>114;101;99;104;116;115;32;61;32;104;105;108;102;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;76;105;110;107;115;58;32;34;32;43;32;108;105;110;107;115;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;82;101;99;104;116;115;58;32;34;32;43;32;114;101;99;104;116;115;</text>
  </strelem>
</struktogramm>
`,So=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;108;228;115;101;114;32;116;97;117;115;99;104;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;108;105;110;107;115;32;61;32;34;83;97;102;116;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;114;101;99;104;116;115;32;61;32;34;87;97;115;115;101;114;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;76;105;110;107;115;58;32;34;32;43;32;108;105;110;107;115;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;82;101;99;104;116;115;58;32;34;32;43;32;114;101;99;104;116;115;</text>
  </strelem>
</struktogramm>
`,Zo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="87;101;114;116;101;32;116;97;117;115;99;104;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;32;61;32;53;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;98;32;61;32;57;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;104;105;108;102;32;61;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>97;32;61;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>98;32;61;32;104;105;108;102;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;97;32;61;32;34;32;43;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;98;32;61;32;34;32;43;32;98;</text>
  </strelem>
</struktogramm>
`,Mo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="68;97;116;101;110;116;121;112;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;108;116;101;114;32;61;32;49;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;103;114;111;101;115;115;101;32;61;32;49;46;54;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;110;97;109;101;32;61;32;34;77;105;97;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;110;97;109;101;32;43;32;34;32;105;115;116;32;34;32;43;32;97;108;116;101;114;32;43;32;34;32;74;97;104;114;101;32;97;108;116;46;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;71;114;246;223;101;58;32;34;32;43;32;103;114;111;101;115;115;101;32;43;32;34;32;109;34;</text>
  </strelem>
</struktogramm>
`,_o=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="77;105;110;117;116;101;110;32;117;109;114;101;99;104;110;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;109;105;110;117;116;101;110;32;61;32;49;51;53;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;116;117;110;100;101;110;32;61;32;109;105;110;117;116;101;110;32;47;32;54;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;114;101;115;116;32;61;32;109;105;110;117;116;101;110;32;37;32;54;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;116;117;110;100;101;110;32;43;32;34;32;83;116;117;110;100;101;110;32;117;110;100;32;34;32;43;32;114;101;115;116;32;43;32;34;32;77;105;110;117;116;101;110;34;</text>
  </strelem>
</struktogramm>
`,jo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="69;105;110;107;97;117;102;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;110;122;97;104;108;32;61;32;51;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;112;114;101;105;115;32;61;32;50;46;53;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;103;101;115;97;109;116;32;61;32;97;110;122;97;104;108;32;42;32;112;114;101;105;115;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;71;101;115;97;109;116;58;32;34;32;43;32;103;101;115;97;109;116;32;43;32;34;32;69;117;114;111;34;</text>
  </strelem>
</struktogramm>
`,To=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="82;101;99;104;116;101;99;107;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;108;97;101;110;103;101;32;61;32;55;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;98;114;101;105;116;101;32;61;32;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;102;108;97;101;99;104;101;32;61;32;108;97;101;110;103;101;32;42;32;98;114;101;105;116;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;117;109;102;97;110;103;32;61;32;50;32;42;32;40;108;97;101;110;103;101;32;43;32;98;114;101;105;116;101;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;70;108;228;99;104;101;58;32;34;32;43;32;102;108;97;101;99;104;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;85;109;102;97;110;103;58;32;34;32;43;32;117;109;102;97;110;103;</text>
  </strelem>
</struktogramm>
`,Ao=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;101;107;117;110;100;101;110;32;117;109;114;101;99;104;110;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;101;107;117;110;100;101;110;32;61;32;50;48;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;109;105;110;117;116;101;110;32;61;32;115;101;107;117;110;100;101;110;32;47;32;54;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;114;101;115;116;32;61;32;115;101;107;117;110;100;101;110;32;37;32;54;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;109;105;110;117;116;101;110;32;43;32;34;32;77;105;110;117;116;101;110;32;117;110;100;32;34;32;43;32;114;101;115;116;32;43;32;34;32;83;101;107;117;110;100;101;110;34;</text>
  </strelem>
</struktogramm>
`,Do=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;101;107;117;110;100;101;110;32;117;109;114;101;99;104;110;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;101;107;117;110;100;101;110;32;61;32;50;48;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;109;105;110;117;116;101;110;32;43;32;34;32;77;105;110;117;116;101;110;32;117;110;100;32;34;32;43;32;114;101;115;116;32;43;32;34;32;83;101;107;117;110;100;101;110;34;</text>
  </strelem>
</struktogramm>
`,Po=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;101;103;114;252;223;117;110;103;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;110;97;109;101;32;34;87;105;101;32;104;101;105;223;116;32;100;117;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;97;108;108;111;32;34;32;43;32;110;97;109;101;32;43;32;34;33;34;</text>
  </strelem>
</struktogramm>
`,Co=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;109;101;32;122;119;101;105;101;114;32;90;97;104;108;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;32;34;69;114;115;116;101;32;90;97;104;108;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;32;34;90;119;101;105;116;101;32;90;97;104;108;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;109;101;32;61;32;97;32;43;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;117;109;109;101;58;32;34;32;43;32;115;117;109;109;101;</text>
  </strelem>
</struktogramm>
`,Wo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="77;105;116;116;101;108;119;101;114;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;100;111;117;98;108;101;32;120;32;34;69;114;115;116;101;32;90;97;104;108;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;100;111;117;98;108;101;32;121;32;34;90;119;101;105;116;101;32;90;97;104;108;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;109;105;116;116;101;108;32;61;32;40;120;32;43;32;121;41;32;47;32;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;77;105;116;116;101;108;119;101;114;116;58;32;34;32;43;32;109;105;116;116;101;108;</text>
  </strelem>
</struktogramm>
`,Bo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="82;101;99;104;110;101;114;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;32;34;69;114;115;116;101;32;90;97;104;108;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;32;34;90;119;101;105;116;101;32;90;97;104;108;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;109;101;32;61;32;97;32;43;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;112;114;111;100;117;107;116;32;61;32;97;32;42;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;117;109;109;101;58;32;34;32;43;32;115;117;109;109;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;80;114;111;100;117;107;116;58;32;34;32;43;32;112;114;111;100;117;107;116;</text>
  </strelem>
</struktogramm>
`,Ho=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="65;108;116;101;114;32;112;114;252;102;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;108;116;101;114;32;34;87;105;101;32;97;108;116;32;98;105;115;116;32;100;117;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>97;108;116;101;114;32;62;61;32;49;56;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;68;117;32;98;105;115;116;32;118;111;108;108;106;228;104;114;105;103;46;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;68;117;32;98;105;115;116;32;110;111;99;104;32;110;105;99;104;116;32;118;111;108;108;106;228;104;114;105;103;46;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Go=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;101;116;114;97;103;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;90;97;104;108;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>122;97;104;108;32;60;32;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>122;97;104;108;32;61;32;48;32;45;32;122;97;104;108;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>248;</text>
      </strelem>
    </fall>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;122;97;104;108;</text>
  </strelem>
</struktogramm>
`,No=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;101;114;97;100;101;32;111;100;101;114;32;117;110;103;101;114;97;100;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;90;97;104;108;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>122;97;104;108;32;37;32;50;32;61;61;32;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;103;101;114;97;100;101;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;117;110;103;101;114;97;100;101;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Eo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;114;246;223;101;114;101;32;90;97;104;108;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;32;34;69;114;115;116;101;32;90;97;104;108;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;32;34;90;119;101;105;116;101;32;90;97;104;108;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>97;32;62;32;98;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;97;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;98;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Lo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="82;97;98;97;116;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;100;111;117;98;108;101;32;112;114;101;105;115;32;34;80;114;101;105;115;32;105;110;32;69;117;114;111;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>112;114;101;105;115;32;62;32;53;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>112;114;101;105;115;32;61;32;112;114;101;105;115;32;45;32;53;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>248;</text>
      </strelem>
    </fall>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;90;117;32;122;97;104;108;101;110;58;32;34;32;43;32;112;114;101;105;115;32;43;32;34;32;69;117;114;111;34;</text>
  </strelem>
</struktogramm>
`,Vo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="78;111;116;101;32;103;252;108;116;105;103;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;111;116;101;32;34;78;111;116;101;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>110;111;116;101;32;62;61;32;49;32;38;38;32;110;111;116;101;32;60;61;32;54;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;103;252;108;116;105;103;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;117;110;103;252;108;116;105;103;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Fo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="74;117;103;101;110;100;116;105;99;107;101;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;108;116;101;114;32;34;87;105;101;32;97;108;116;32;98;105;115;116;32;100;117;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>97;108;116;101;114;32;62;61;32;49;50;32;38;38;32;97;108;116;101;114;32;60;32;49;56;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;74;117;103;101;110;100;116;105;99;107;101;116;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;75;101;105;110;32;74;117;103;101;110;100;116;105;99;107;101;116;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Ro=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="78;111;116;101;32;112;114;252;102;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;111;116;101;32;34;78;111;116;101;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>110;111;116;101;32;60;32;49;32;124;124;32;110;111;116;101;32;62;32;54;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;68;105;101;115;101;32;78;111;116;101;32;103;105;98;116;32;101;115;32;110;105;99;104;116;46;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;78;111;116;101;32;34;32;43;32;110;111;116;101;32;43;32;34;32;105;115;116;32;103;252;108;116;105;103;46;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Uo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;99;104;97;108;116;106;97;104;114;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;106;97;104;114;32;34;74;97;104;114;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>40;106;97;104;114;32;37;32;52;32;61;61;32;48;32;38;38;32;106;97;104;114;32;37;32;49;48;48;32;33;61;32;48;41;32;124;124;32;106;97;104;114;32;37;32;52;48;48;32;61;61;32;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;83;99;104;97;108;116;106;97;104;114;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;107;101;105;110;32;83;99;104;97;108;116;106;97;104;114;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Yo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="87;111;99;104;101;110;101;110;100;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;116;97;103;32;34;84;97;103;32;40;49;32;98;105;115;32;55;41;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>116;97;103;32;61;61;32;54;32;124;124;32;116;97;103;32;61;61;32;55;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;87;111;99;104;101;110;101;110;100;101;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;87;101;114;107;116;97;103;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Xo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="65;109;112;101;108;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;102;97;114;98;101;32;34;87;101;108;99;104;101;32;70;97;114;98;101;32;104;97;116;32;100;105;101;32;65;109;112;101;108;63;34;</text>
  </strelem>
  <strelem typ="2" zx="0" zy="0">
    <text>102;97;114;98;101;</text>
    <fall fallname="114;111;116;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;83;116;101;104;101;110;32;98;108;101;105;98;101;110;34;</text>
      </strelem>
    </fall>
    <fall fallname="103;101;108;98;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;87;97;114;116;101;110;34;</text>
      </strelem>
    </fall>
    <fall fallname="103;114;252;110;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;71;101;104;101;110;34;</text>
      </strelem>
    </fall>
    <fall fallname="100;101;102;97;117;108;116;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;68;105;101;115;101;32;70;97;114;98;101;32;107;101;110;110;101;32;105;99;104;32;110;105;99;104;116;46;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Qo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;101;116;114;228;110;107;101;97;117;116;111;109;97;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;119;97;104;108;32;34;49;32;87;97;115;115;101;114;44;32;50;32;83;97;102;116;44;32;51;32;75;97;107;97;111;34;</text>
  </strelem>
  <strelem typ="2" zx="0" zy="0">
    <text>119;97;104;108;</text>
    <fall fallname="49;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;72;105;101;114;32;105;115;116;32;100;101;105;110;32;87;97;115;115;101;114;46;34;</text>
      </strelem>
    </fall>
    <fall fallname="50;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;72;105;101;114;32;105;115;116;32;100;101;105;110;32;83;97;102;116;46;34;</text>
      </strelem>
    </fall>
    <fall fallname="51;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;72;105;101;114;32;105;115;116;32;100;101;105;110;32;75;97;107;97;111;46;34;</text>
      </strelem>
    </fall>
    <fall fallname="100;101;102;97;117;108;116;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;68;105;101;115;101;32;84;97;115;116;101;32;103;105;98;116;32;101;115;32;110;105;99;104;116;46;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Jo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="78;111;116;101;32;105;110;32;87;111;114;116;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;111;116;101;32;34;87;101;108;99;104;101;32;78;111;116;101;63;34;</text>
  </strelem>
  <strelem typ="2" zx="0" zy="0">
    <text>110;111;116;101;</text>
    <fall fallname="49;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;115;101;104;114;32;103;117;116;34;</text>
      </strelem>
    </fall>
    <fall fallname="50;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;103;117;116;34;</text>
      </strelem>
    </fall>
    <fall fallname="51;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;98;101;102;114;105;101;100;105;103;101;110;100;34;</text>
      </strelem>
    </fall>
    <fall fallname="52;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;97;117;115;114;101;105;99;104;101;110;100;34;</text>
      </strelem>
    </fall>
    <fall fallname="53;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;109;97;110;103;101;108;104;97;102;116;34;</text>
      </strelem>
    </fall>
    <fall fallname="54;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;117;110;103;101;110;252;103;101;110;100;34;</text>
      </strelem>
    </fall>
    <fall fallname="100;101;102;97;117;108;116;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;75;101;105;110;101;32;103;252;108;116;105;103;101;32;78;111;116;101;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Oo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="84;97;115;99;104;101;110;114;101;99;104;110;101;114;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;32;34;69;114;115;116;101;32;90;97;104;108;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;122;101;105;99;104;101;110;32;34;82;101;99;104;101;110;122;101;105;99;104;101;110;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;32;34;90;119;101;105;116;101;32;90;97;104;108;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;101;114;103;101;98;110;105;115;32;61;32;48;</text>
  </strelem>
  <strelem typ="2" zx="0" zy="0">
    <text>122;101;105;99;104;101;110;</text>
    <fall fallname="43;">
      <strelem typ="0" zx="0" zy="0">
        <text>101;114;103;101;98;110;105;115;32;61;32;97;32;43;32;98;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;101;114;103;101;98;110;105;115;</text>
      </strelem>
    </fall>
    <fall fallname="45;">
      <strelem typ="0" zx="0" zy="0">
        <text>101;114;103;101;98;110;105;115;32;61;32;97;32;45;32;98;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;101;114;103;101;98;110;105;115;</text>
      </strelem>
    </fall>
    <fall fallname="42;">
      <strelem typ="0" zx="0" zy="0">
        <text>101;114;103;101;98;110;105;115;32;61;32;97;32;42;32;98;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;101;114;103;101;98;110;105;115;</text>
      </strelem>
    </fall>
    <fall fallname="100;101;102;97;117;108;116;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;85;110;98;101;107;97;110;110;116;101;115;32;82;101;99;104;101;110;122;101;105;99;104;101;110;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,$o=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;101;116;114;228;110;107;101;97;117;116;111;109;97;116;32;109;105;116;32;86;101;114;122;119;101;105;103;117;110;103;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;119;97;104;108;32;34;49;32;87;97;115;115;101;114;44;32;50;32;83;97;102;116;44;32;51;32;75;97;107;97;111;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>119;97;104;108;32;61;61;32;49;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;72;105;101;114;32;105;115;116;32;100;101;105;110;32;87;97;115;115;101;114;46;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="1" zx="0" zy="0">
        <text>119;97;104;108;32;61;61;32;50;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>111;117;116;112;117;116;58;32;34;72;105;101;114;32;105;115;116;32;100;101;105;110;32;83;97;102;116;46;34;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="1" zx="0" zy="0">
            <text>119;97;104;108;32;61;61;32;51;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>111;117;116;112;117;116;58;32;34;72;105;101;114;32;105;115;116;32;100;101;105;110;32;75;97;107;97;111;46;34;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>111;117;116;112;117;116;58;32;34;68;105;101;115;101;32;84;97;115;116;101;32;103;105;98;116;32;101;115;32;110;105;99;104;116;46;34;</text>
              </strelem>
            </fall>
          </strelem>
        </fall>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Ko=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="68;105;101;32;100;114;101;105;32;71;114;117;110;100;98;97;117;115;116;101;105;110;101;" pseudocode="true">
  <strelem typ="0" zx="0" zy="0">
    <text>84;97;115;115;101;32;97;117;102;32;100;101;110;32;84;105;115;99;104;32;115;116;101;108;108;101;110;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>90;117;99;107;101;114;32;103;101;119;252;110;115;99;104;116;63;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>90;117;99;107;101;114;32;104;105;110;101;105;110;103;101;98;101;110;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>248;</text>
      </strelem>
    </fall>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>84;101;101;32;110;111;99;104;32;122;117;32;104;101;105;223;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>49;32;77;105;110;117;116;101;32;119;97;114;116;101;110;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>84;101;101;32;116;114;105;110;107;101;110;</text>
  </strelem>
</struktogramm>
`,qo=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="77;111;114;103;101;110;115;" pseudocode="true">
  <strelem typ="0" zx="0" zy="0">
    <text>65;117;102;115;116;101;104;101;110;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>90;228;104;110;101;32;112;117;116;122;101;110;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>65;110;122;105;101;104;101;110;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>70;114;252;104;115;116;252;99;107;101;110;</text>
  </strelem>
</struktogramm>
`,eu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="84;101;101;32;107;111;99;104;101;110;" pseudocode="true">
  <strelem typ="0" zx="0" zy="0">
    <text>87;97;115;115;101;114;32;105;110;32;100;101;110;32;87;97;115;115;101;114;107;111;99;104;101;114;32;102;252;108;108;101;110;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>87;97;115;115;101;114;107;111;99;104;101;114;32;101;105;110;115;99;104;97;108;116;101;110;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>84;101;101;98;101;117;116;101;108;32;105;110;32;100;105;101;32;84;97;115;115;101;32;108;101;103;101;110;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>72;101;105;223;101;115;32;87;97;115;115;101;114;32;105;110;32;100;105;101;32;84;97;115;115;101;32;103;105;101;223;101;110;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>51;32;77;105;110;117;116;101;110;32;119;97;114;116;101;110;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>84;101;101;98;101;117;116;101;108;32;104;101;114;97;117;115;110;101;104;109;101;110;</text>
  </strelem>
</struktogramm>
`,tu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="82;97;117;115;103;101;104;101;110;" pseudocode="true">
  <strelem typ="1" zx="0" zy="0">
    <text>82;101;103;110;101;116;32;101;115;63;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>82;101;103;101;110;115;99;104;105;114;109;32;101;105;110;112;97;99;107;101;110;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>83;111;110;110;101;110;98;114;105;108;108;101;32;101;105;110;112;97;99;107;101;110;</text>
      </strelem>
    </fall>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>76;111;115;103;101;104;101;110;</text>
  </strelem>
</struktogramm>
`,nu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="69;115;115;101;110;" pseudocode="true">
  <strelem typ="4" zx="0" zy="0">
    <text>84;101;108;108;101;114;32;110;105;99;104;116;32;108;101;101;114;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>69;105;110;101;110;32;66;105;115;115;101;110;32;101;115;115;101;110;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>84;101;108;108;101;114;32;97;98;114;228;117;109;101;110;</text>
  </strelem>
</struktogramm>
`,iu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="90;228;104;108;101;110;32;98;105;115;32;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;66;105;115;32;119;111;104;105;110;32;122;228;104;108;101;110;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>105;32;60;61;32;110;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;32;61;32;105;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,su=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;117;110;116;100;111;119;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;122;97;104;108;32;61;32;51;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>122;97;104;108;32;62;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;122;97;104;108;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>122;97;104;108;32;61;32;122;97;104;108;32;45;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;116;97;114;116;33;34;</text>
  </strelem>
</struktogramm>
`,ru=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;101;104;108;101;114;58;32;69;110;100;108;111;115;115;99;104;108;101;105;102;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;122;97;104;108;32;61;32;51;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>122;97;104;108;32;62;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;122;97;104;108;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;116;97;114;116;33;34;</text>
  </strelem>
</struktogramm>
`,au=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;97;107;117;108;116;228;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;70;97;107;117;108;116;228;116;32;118;111;110;32;119;101;108;99;104;101;114;32;90;97;104;108;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;102;97;107;117;108;116;97;101;116;32;61;32;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>105;32;60;61;32;110;</text>
    <schleifeninhalt>
    <strelem typ="0" zx="0" zy="0">
      <text>102;97;107;117;108;116;97;101;116;32;61;32;102;97;107;117;108;116;97;101;116;32;42;32;105;</text>
    </strelem>
    <strelem typ="0" zx="0" zy="0">
      <text>105;32;61;32;105;32;43;32;49;</text>
    </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;110;32;43;32;34;33;32;61;32;34;32;43;32;102;97;107;117;108;116;97;101;116;</text>
  </strelem>
</struktogramm>
`,lu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="86;101;114;100;111;112;112;101;108;110;32;98;105;115;32;49;48;48;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;83;116;97;114;116;122;97;104;108;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;99;104;114;105;116;116;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>122;97;104;108;32;60;32;49;48;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>122;97;104;108;32;61;32;122;97;104;108;32;42;32;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>115;99;104;114;105;116;116;101;32;61;32;115;99;104;114;105;116;116;101;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;99;104;114;105;116;116;101;</text>
  </strelem>
</struktogramm>
`,ou=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="69;105;110;103;97;98;101;32;112;114;252;102;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;122;97;104;108;32;61;32;48;</text>
  </strelem>
  <strelem typ="5" zx="0" zy="0">
    <text>122;97;104;108;32;60;32;49;32;124;124;32;122;97;104;108;32;62;32;49;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;122;97;104;108;32;34;90;97;104;108;32;118;111;110;32;49;32;98;105;115;32;49;48;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;68;97;110;107;101;33;34;</text>
  </strelem>
</struktogramm>
`,uu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="77;105;110;100;101;115;116;101;110;115;32;101;105;110;109;97;108;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;48;</text>
  </strelem>
  <strelem typ="5" zx="0" zy="0">
    <text>105;32;60;32;53;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;32;61;32;105;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,hu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;252;108;116;105;103;101;32;78;111;116;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;111;116;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="5" zx="0" zy="0">
    <text>110;111;116;101;32;60;32;49;32;124;124;32;110;111;116;101;32;62;32;54;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;110;111;116;101;32;34;78;111;116;101;32;118;111;110;32;49;32;98;105;115;32;54;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;68;101;105;110;101;32;78;111;116;101;58;32;34;32;43;32;110;111;116;101;</text>
  </strelem>
</struktogramm>
`,mu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;109;101;32;98;105;115;32;48;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;109;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;122;97;104;108;32;61;32;48;</text>
  </strelem>
  <strelem typ="5" zx="0" zy="0">
    <text>122;97;104;108;32;33;61;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;122;97;104;108;32;34;90;97;104;108;32;40;48;32;98;101;101;110;100;101;116;41;34;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;109;101;32;61;32;115;117;109;109;101;32;43;32;122;97;104;108;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;117;109;109;101;</text>
  </strelem>
</struktogramm>
`,cu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;117;110;116;100;111;119;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;83;116;97;114;116;122;97;104;108;34;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;110;</text>
    <text>105;32;62;61;32;49;</text>
    <text>105;45;45;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;76;111;115;33;34;</text>
  </strelem>
</struktogramm>
`,du=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="69;105;110;109;97;108;101;105;110;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;87;101;108;99;104;101;32;82;101;105;104;101;63;34;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;49;48;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;112;114;111;100;117;107;116;32;61;32;122;97;104;108;32;42;32;105;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;122;97;104;108;32;43;32;34;32;120;32;34;32;43;32;105;32;43;32;34;32;61;32;34;32;43;32;112;114;111;100;117;107;116;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,gu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="90;228;104;108;101;110;32;118;111;110;32;49;32;98;105;115;32;53;">
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;53;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,pu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;109;101;32;118;111;110;32;49;32;98;105;115;32;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;66;105;115;32;122;117;32;119;101;108;99;104;101;114;32;90;97;104;108;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;109;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;110;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;109;101;32;61;32;115;117;109;109;101;32;43;32;105;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;117;109;109;101;</text>
  </strelem>
</struktogramm>
`,xu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;116;101;114;110;101;110;100;114;101;105;101;99;107;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;87;105;101;32;118;105;101;108;101;32;90;101;105;108;101;110;63;34;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;122;101;105;108;101;32;61;32;49;</text>
    <text>122;101;105;108;101;32;60;61;32;110;</text>
    <text>122;101;105;108;101;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>83;116;114;105;110;103;32;116;101;120;116;32;61;32;34;34;</text>
      </strelem>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;115;116;101;114;110;32;61;32;49;</text>
        <text>115;116;101;114;110;32;60;61;32;122;101;105;108;101;</text>
        <text>115;116;101;114;110;43;43;</text>
        <schleifeninhalt>
          <strelem typ="0" zx="0" zy="0">
            <text>116;101;120;116;32;61;32;116;101;120;116;32;43;32;34;42;34;</text>
          </strelem>
        </schleifeninhalt>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;116;101;120;116;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,bu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;101;114;97;100;101;32;69;105;110;103;97;98;101;110;32;122;228;104;108;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;110;122;97;104;108;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;53;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;90;97;104;108;32;101;105;110;103;101;98;101;110;34;</text>
      </strelem>
      <strelem typ="1" zx="0" zy="0">
        <text>122;97;104;108;32;37;32;50;32;61;61;32;48;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>97;110;122;97;104;108;43;43;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>248;</text>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;97;110;122;97;104;108;</text>
  </strelem>
</struktogramm>
`,fu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;101;114;97;100;101;32;90;97;104;108;101;110;32;122;228;104;108;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;66;105;115;32;122;117;32;119;101;108;99;104;101;114;32;90;97;104;108;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;110;122;97;104;108;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;110;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="1" zx="0" zy="0">
        <text>105;32;37;32;50;32;61;61;32;48;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>97;110;122;97;104;108;43;43;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>248;</text>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;97;110;122;97;104;108;</text>
  </strelem>
</struktogramm>
`,Iu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="82;101;99;104;116;101;99;107;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;114;101;105;116;101;32;34;66;114;101;105;116;101;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;104;111;101;104;101;32;34;72;246;104;101;34;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;122;101;105;108;101;32;61;32;49;</text>
    <text>122;101;105;108;101;32;60;61;32;104;111;101;104;101;</text>
    <text>122;101;105;108;101;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>83;116;114;105;110;103;32;116;101;120;116;32;61;32;34;34;</text>
      </strelem>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;115;112;97;108;116;101;32;61;32;49;</text>
        <text>115;112;97;108;116;101;32;60;61;32;98;114;101;105;116;101;</text>
        <text>115;112;97;108;116;101;43;43;</text>
        <schleifeninhalt>
          <strelem typ="0" zx="0" zy="0">
            <text>116;101;120;116;32;61;32;116;101;120;116;32;43;32;34;35;34;</text>
          </strelem>
        </schleifeninhalt>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;116;101;120;116;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,yu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="65;114;114;97;121;32;100;117;114;99;104;108;97;117;102;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;122;97;104;108;101;110;32;61;32;123;50;44;32;52;44;32;54;44;32;56;44;32;49;48;125;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;122;97;104;108;101;110;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;122;97;104;108;101;110;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,zu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="69;114;115;116;101;114;32;117;110;100;32;108;101;116;122;116;101;114;32;87;101;114;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;119;101;114;116;101;32;61;32;123;52;44;32;56;44;32;49;53;44;32;49;54;44;32;50;51;44;32;52;50;125;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;119;101;114;116;101;91;48;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;119;101;114;116;101;91;119;101;114;116;101;46;108;101;110;103;116;104;32;45;32;49;93;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;119;101;114;116;101;46;108;101;110;103;116;104;</text>
  </strelem>
</struktogramm>
`,wu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="78;97;109;101;110;32;101;105;110;103;101;98;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;91;93;32;110;97;109;101;110;32;61;32;110;101;119;32;83;116;114;105;110;103;91;51;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;110;97;109;101;110;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;110;97;109;101;110;91;105;93;32;34;78;97;109;101;32;101;105;110;103;101;98;101;110;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;69;114;115;116;101;114;32;78;97;109;101;58;32;34;32;43;32;110;97;109;101;110;91;48;93;</text>
  </strelem>
</struktogramm>
`,vu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="82;252;99;107;119;228;114;116;115;32;97;117;115;103;101;98;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;122;97;104;108;101;110;32;61;32;110;101;119;32;105;110;116;91;52;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;122;97;104;108;101;110;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;122;97;104;108;101;110;91;105;93;32;34;90;97;104;108;32;101;105;110;103;101;98;101;110;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;122;97;104;108;101;110;46;108;101;110;103;116;104;32;45;32;49;</text>
    <text>105;32;62;61;32;48;</text>
    <text>105;45;45;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;122;97;104;108;101;110;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,ku=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;109;101;32;117;110;100;32;77;97;120;105;109;117;109;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;122;97;104;108;101;110;32;61;32;110;101;119;32;105;110;116;91;53;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;122;97;104;108;101;110;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;122;97;104;108;101;110;91;105;93;32;34;90;97;104;108;32;101;105;110;103;101;98;101;110;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;109;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;109;97;120;32;61;32;122;97;104;108;101;110;91;48;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;122;97;104;108;101;110;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;109;101;32;61;32;115;117;109;109;101;32;43;32;122;97;104;108;101;110;91;105;93;</text>
      </strelem>
      <strelem typ="1" zx="0" zy="0">
        <text>122;97;104;108;101;110;91;105;93;32;62;32;109;97;120;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>109;97;120;32;61;32;122;97;104;108;101;110;91;105;93;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>248;</text>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;117;109;109;101;58;32;34;32;43;32;115;117;109;109;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;77;97;120;105;109;117;109;58;32;34;32;43;32;109;97;120;</text>
  </strelem>
</struktogramm>
`,Su=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;109;101;32;117;110;100;32;77;97;120;105;109;117;109;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;112;117;110;107;116;101;32;61;32;123;49;50;44;32;55;44;32;49;57;44;32;52;125;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;109;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;109;97;120;32;61;32;112;117;110;107;116;101;91;48;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;112;117;110;107;116;101;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;109;101;32;61;32;115;117;109;109;101;32;43;32;112;117;110;107;116;101;91;105;93;</text>
      </strelem>
      <strelem typ="1" zx="0" zy="0">
        <text>112;117;110;107;116;101;91;105;93;32;62;32;109;97;120;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>109;97;120;32;61;32;112;117;110;107;116;101;91;105;93;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>248;</text>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;117;109;109;101;58;32;34;32;43;32;115;117;109;109;101;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;77;97;120;105;109;117;109;58;32;34;32;43;32;109;97;120;</text>
  </strelem>
</struktogramm>
`,Zu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;109;101;32;98;105;115;32;48;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;109;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;90;97;104;108;32;101;105;110;103;101;98;101;110;32;40;48;32;61;32;69;110;100;101;41;34;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>122;97;104;108;32;33;61;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;109;101;32;61;32;115;117;109;109;101;32;43;32;122;97;104;108;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;122;97;104;108;32;34;90;97;104;108;32;101;105;110;103;101;98;101;110;32;40;48;32;61;32;69;110;100;101;41;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;117;109;109;101;58;32;34;32;43;32;115;117;109;109;101;</text>
  </strelem>
</struktogramm>
`,Mu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;109;101;32;98;105;115;32;48;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;109;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="6" zx="0" zy="0">
    <text></text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;90;97;104;108;32;101;105;110;103;101;98;101;110;32;40;48;32;61;32;69;110;100;101;41;34;</text>
      </strelem>
      <strelem typ="1" zx="0" zy="0">
        <text>122;97;104;108;32;61;61;32;48;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="7" zx="0" zy="0">
            <text>83;99;104;108;101;105;102;101;32;118;101;114;108;97;115;115;101;110;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>115;117;109;109;101;32;61;32;115;117;109;109;101;32;43;32;122;97;104;108;</text>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;117;109;109;101;58;32;34;32;43;32;115;117;109;109;101;</text>
  </strelem>
</struktogramm>
`,_u=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="82;101;99;104;116;101;99;107;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;108;97;101;110;103;101;32;34;76;228;110;103;101;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;114;101;105;116;101;32;34;66;114;101;105;116;101;63;34;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>105;110;116;32;102;32;61;32;102;108;97;101;99;104;101;40;108;97;101;110;103;101;44;32;98;114;101;105;116;101;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;70;108;228;99;104;101;58;32;34;32;43;32;102;</text>
  </strelem>
</struktogramm>
`,ju=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="105;110;116;32;102;108;97;101;99;104;101;40;105;110;116;32;97;44;32;105;110;116;32;98;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>114;101;116;117;114;110;32;97;32;42;32;98;</text>
  </strelem>
</struktogramm>
`,Tu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="81;117;105;122;">
  <strelem typ="8" zx="0" zy="0">
    <text>122;101;105;103;101;66;101;103;114;117;101;115;115;117;110;103;40;41;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>115;116;101;108;108;101;70;114;97;103;101;110;40;41;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>122;101;105;103;101;69;114;103;101;98;110;105;115;40;41;</text>
  </strelem>
</struktogramm>
`,Au=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="81;117;97;100;114;97;116;122;97;104;108;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;87;101;108;99;104;101;32;90;97;104;108;63;34;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>105;110;116;32;113;32;61;32;113;117;97;100;114;97;116;40;122;97;104;108;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;68;97;115;32;81;117;97;100;114;97;116;32;105;115;116;32;34;32;43;32;113;</text>
  </strelem>
</struktogramm>
`,Du=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="105;110;116;32;113;117;97;100;114;97;116;40;105;110;116;32;120;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;101;114;103;101;98;110;105;115;32;61;32;120;32;42;32;120;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>114;101;116;117;114;110;32;101;114;103;101;98;110;105;115;</text>
  </strelem>
</struktogramm>
`,Pu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;101;103;114;252;223;117;110;103;32;109;105;116;32;65;117;102;114;117;102;">
  <strelem typ="8" zx="0" zy="0">
    <text>122;101;105;103;101;84;105;116;101;108;40;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;110;97;109;101;32;34;87;105;101;32;104;101;105;223;116;32;100;117;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;97;108;108;111;32;34;32;43;32;110;97;109;101;</text>
  </strelem>
</struktogramm>
`,Cu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="122;101;105;103;101;66;101;103;114;117;101;115;115;117;110;103;40;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;87;105;108;108;107;111;109;109;101;110;32;122;117;109;32;81;117;105;122;33;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;68;117;32;98;101;107;111;109;109;115;116;32;100;114;101;105;32;70;114;97;103;101;110;46;34;</text>
  </strelem>
</struktogramm>
`,Wu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;109;101;110;32;122;101;105;103;101;110;">
  <strelem typ="8" zx="0" zy="0">
    <text>122;101;105;103;101;83;117;109;109;101;40;51;44;32;52;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;120;32;61;32;49;48;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>122;101;105;103;101;83;117;109;109;101;40;120;44;32;120;32;43;32;49;41;</text>
  </strelem>
</struktogramm>
`,Bu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="118;111;105;100;32;122;101;105;103;101;83;117;109;109;101;40;105;110;116;32;97;44;32;105;110;116;32;98;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;109;101;32;61;32;97;32;43;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;97;32;43;32;34;32;43;32;34;32;43;32;98;32;43;32;34;32;61;32;34;32;43;32;115;117;109;109;101;</text>
  </strelem>
</struktogramm>
`,Hu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;117;110;116;100;111;119;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;115;116;97;114;116;32;34;83;116;97;114;116;119;101;114;116;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;115;116;97;114;116;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>105;32;62;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;32;61;32;105;32;45;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;76;111;115;33;34;</text>
  </strelem>
</struktogramm>
`,Gu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;117;110;116;100;111;119;110;32;40;102;101;104;108;101;114;104;97;102;116;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;115;116;97;114;116;32;34;83;116;97;114;116;119;101;114;116;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;115;116;97;114;116;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>105;32;62;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;32;61;32;105;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;76;111;115;34;</text>
  </strelem>
</struktogramm>
`,Nu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;99;104;114;101;105;98;116;105;115;99;104;116;101;115;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;109;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>105;32;60;61;32;51;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;109;101;32;61;32;115;117;109;109;101;32;43;32;105;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;32;61;32;105;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;117;109;109;101;</text>
  </strelem>
</struktogramm>
`,Eu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;109;101;32;98;105;115;32;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;66;105;115;32;119;111;104;105;110;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;109;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;110;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;109;101;32;61;32;115;117;109;109;101;32;43;32;105;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;117;109;109;101;</text>
  </strelem>
</struktogramm>
`,Lu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;117;109;109;101;32;98;105;115;32;110;32;40;102;101;104;108;101;114;104;97;102;116;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;66;105;115;32;119;111;104;105;110;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;109;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;32;110;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>115;117;109;109;101;32;61;32;115;117;109;109;101;32;43;32;105;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;115;117;109;109;101;</text>
  </strelem>
</struktogramm>
`,Vu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="69;105;110;109;97;108;101;105;110;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;87;101;108;99;104;101;32;82;101;105;104;101;63;34;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;51;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;101;114;103;101;98;110;105;115;32;61;32;122;97;104;108;32;42;32;105;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;32;43;32;34;32;109;97;108;32;34;32;43;32;122;97;104;108;32;43;32;34;32;61;32;34;32;43;32;101;114;103;101;98;110;105;115;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>122;97;104;108;32;62;32;49;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;68;97;115;32;119;97;114;32;115;99;104;119;101;114;33;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;68;97;115;32;119;97;114;32;108;101;105;99;104;116;46;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Fu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;97;107;117;108;116;228;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;32;34;90;97;104;108;32;101;105;110;103;101;98;101;110;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;102;97;107;117;108;116;97;101;116;32;61;32;49;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;49;</text>
    <text>105;32;60;61;32;110;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>102;97;107;117;108;116;97;101;116;32;61;32;102;97;107;117;108;116;97;101;116;32;42;32;105;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;102;97;107;117;108;116;97;101;116;</text>
  </strelem>
</struktogramm>
`,Ru=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="84;105;99;107;101;116;112;114;101;105;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;108;116;101;114;32;34;87;105;101;32;97;108;116;32;98;105;115;116;32;100;117;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>97;108;116;101;114;32;60;32;54;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;69;105;110;116;114;105;116;116;32;102;114;101;105;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="1" zx="0" zy="0">
        <text>97;108;116;101;114;32;60;32;49;56;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>111;117;116;112;117;116;58;32;34;75;105;110;100;101;114;116;105;99;107;101;116;58;32;52;32;69;117;114;111;34;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>111;117;116;112;117;116;58;32;34;69;114;119;97;99;104;115;101;110;101;110;116;105;99;107;101;116;58;32;56;32;69;117;114;111;34;</text>
          </strelem>
        </fall>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Uu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="68;114;101;105;101;114;115;99;104;114;105;116;116;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;83;116;97;114;116;119;101;114;116;63;34;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>122;97;104;108;32;62;32;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;122;97;104;108;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>122;97;104;108;32;61;32;122;97;104;108;32;45;32;51;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;69;110;100;101;34;</text>
  </strelem>
</struktogramm>
`,Yu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="87;228;104;108;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;108;116;101;114;32;34;87;105;101;32;97;108;116;32;98;105;115;116;32;100;117;63;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>97;108;116;101;114;32;62;61;32;49;54;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;68;117;32;100;97;114;102;115;116;32;119;228;104;108;101;110;46;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;106;97;104;114;101;32;61;32;49;54;32;45;32;97;108;116;101;114;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;78;111;99;104;32;34;32;43;32;106;97;104;114;101;32;43;32;34;32;74;97;104;114;101;32;119;97;114;116;101;110;46;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Xu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="71;101;114;97;100;101;32;90;97;104;108;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;103;114;101;110;122;101;32;34;66;105;115;32;119;111;104;105;110;63;34;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;61;32;103;114;101;110;122;101;</text>
    <text>105;32;61;32;105;32;43;32;50;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,Qu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;101;103;114;252;223;117;110;103;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;71;117;116;101;110;32;77;111;114;103;101;110;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;101;117;116;101;32;108;101;114;110;101;110;32;119;105;114;32;83;116;114;117;107;116;111;103;114;97;109;109;101;46;34;</text>
  </strelem>
</struktogramm>
`,Ju=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="72;97;108;108;111;32;87;101;108;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;97;108;108;111;32;87;101;108;116;34;</text>
  </strelem>
</struktogramm>
`,Ou=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="90;119;101;105;32;90;101;105;108;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;97;108;108;111;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;73;99;104;32;108;101;114;110;101;32;83;116;114;117;107;116;111;103;114;97;109;109;101;34;</text>
  </strelem>
</struktogramm>
`,$u=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="75;105;110;111;107;97;114;116;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;110;122;97;104;108;32;34;87;105;101;32;118;105;101;108;101;32;75;97;114;116;101;110;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;103;101;115;97;109;116;32;61;32;97;110;122;97;104;108;32;42;32;56;46;53;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;71;101;115;97;109;116;58;32;34;32;43;32;103;101;115;97;109;116;</text>
  </strelem>
</struktogramm>
`,Ku=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="75;105;110;111;107;97;114;116;101;110;32;40;102;101;104;108;101;114;104;97;102;116;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;110;122;97;104;108;32;34;87;105;101;32;118;105;101;108;101;32;75;97;114;116;101;110;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;71;101;115;97;109;116;58;32;34;32;43;32;103;101;115;97;109;116;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>100;111;117;98;108;101;32;103;101;115;97;109;116;32;61;32;97;110;122;97;104;108;32;42;32;56;46;53;</text>
  </strelem>
</struktogramm>
`,qu=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="84;97;117;115;99;104;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;32;34;69;114;115;116;101;32;90;97;104;108;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;32;34;90;119;101;105;116;101;32;90;97;104;108;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;104;105;108;102;32;61;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>97;32;61;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>98;32;61;32;104;105;108;102;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;98;</text>
  </strelem>
</struktogramm>
`,eh=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="84;97;117;115;99;104;101;110;32;40;102;101;104;108;101;114;104;97;102;116;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;32;34;69;114;115;116;101;32;90;97;104;108;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;98;32;34;90;119;101;105;116;101;32;90;97;104;108;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>97;32;61;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>98;32;61;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;98;</text>
  </strelem>
</struktogramm>
`,th=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="87;101;114;116;101;32;116;97;117;115;99;104;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;32;61;32;51;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;98;32;61;32;53;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;104;105;108;102;32;61;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>97;32;61;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>98;32;61;32;104;105;108;102;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;97;32;61;32;34;32;43;32;97;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;98;32;61;32;34;32;43;32;98;</text>
  </strelem>
</struktogramm>
`,nh=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="65;98;115;116;101;105;103;101;110;100;32;115;111;114;116;105;101;114;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;107;97;114;116;101;110;32;61;32;110;101;119;32;105;110;116;91;53;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;107;97;114;116;101;110;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;107;97;114;116;101;110;91;105;93;32;34;75;97;114;116;101;32;101;105;110;103;101;98;101;110;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;114;117;110;100;101;32;61;32;49;</text>
    <text>114;117;110;100;101;32;60;32;107;97;114;116;101;110;46;108;101;110;103;116;104;</text>
    <text>114;117;110;100;101;43;43;</text>
    <schleifeninhalt>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;105;32;61;32;48;</text>
        <text>105;32;60;32;107;97;114;116;101;110;46;108;101;110;103;116;104;32;45;32;114;117;110;100;101;</text>
        <text>105;43;43;</text>
        <schleifeninhalt>
          <strelem typ="1" zx="0" zy="0">
            <text>107;97;114;116;101;110;91;105;93;32;60;32;107;97;114;116;101;110;91;105;32;43;32;49;93;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>105;110;116;32;104;105;108;102;32;61;32;107;97;114;116;101;110;91;105;93;</text>
              </strelem>
              <strelem typ="0" zx="0" zy="0">
                <text>107;97;114;116;101;110;91;105;93;32;61;32;107;97;114;116;101;110;91;105;32;43;32;49;93;</text>
              </strelem>
              <strelem typ="0" zx="0" zy="0">
                <text>107;97;114;116;101;110;91;105;32;43;32;49;93;32;61;32;104;105;108;102;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>248;</text>
              </strelem>
            </fall>
          </strelem>
        </schleifeninhalt>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;107;97;114;116;101;110;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;107;97;114;116;101;110;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,ih=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="65;98;115;116;101;105;103;101;110;100;32;115;111;114;116;105;101;114;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;107;97;114;116;101;110;32;61;32;110;101;119;32;105;110;116;91;53;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;107;97;114;116;101;110;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;107;97;114;116;101;110;91;105;93;32;34;75;97;114;116;101;32;101;105;110;103;101;98;101;110;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;114;117;110;100;101;32;61;32;49;</text>
    <text>114;117;110;100;101;32;60;32;107;97;114;116;101;110;46;108;101;110;103;116;104;</text>
    <text>114;117;110;100;101;43;43;</text>
    <schleifeninhalt>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;105;32;61;32;48;</text>
        <text>105;32;60;32;107;97;114;116;101;110;46;108;101;110;103;116;104;32;45;32;114;117;110;100;101;</text>
        <text>105;43;43;</text>
        <schleifeninhalt>
          <strelem typ="1" zx="0" zy="0">
            <text>107;97;114;116;101;110;91;105;93;32;62;32;107;97;114;116;101;110;91;105;32;43;32;49;93;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>105;110;116;32;104;105;108;102;32;61;32;107;97;114;116;101;110;91;105;93;</text>
              </strelem>
              <strelem typ="0" zx="0" zy="0">
                <text>107;97;114;116;101;110;91;105;93;32;61;32;107;97;114;116;101;110;91;105;32;43;32;49;93;</text>
              </strelem>
              <strelem typ="0" zx="0" zy="0">
                <text>107;97;114;116;101;110;91;105;32;43;32;49;93;32;61;32;104;105;108;102;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>248;</text>
              </strelem>
            </fall>
          </strelem>
        </schleifeninhalt>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;107;97;114;116;101;110;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;107;97;114;116;101;110;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,sh=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;105;110;228;114;101;32;83;117;99;104;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;107;97;114;116;101;110;32;61;32;123;50;44;32;51;44;32;53;44;32;55;44;32;56;44;32;49;48;44;32;49;50;44;32;49;51;44;32;49;53;44;32;49;56;44;32;50;48;44;32;50;49;44;32;50;52;44;32;50;55;44;32;51;48;125;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;103;101;115;117;99;104;116;32;34;87;101;108;99;104;101;32;75;97;114;116;101;32;115;117;99;104;115;116;32;100;117;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;112;111;115;105;116;105;111;110;32;61;32;45;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;118;101;114;103;108;101;105;99;104;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;108;105;110;107;115;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;114;101;99;104;116;115;32;61;32;107;97;114;116;101;110;46;108;101;110;103;116;104;32;45;32;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;109;105;116;116;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>112;111;115;105;116;105;111;110;32;61;61;32;45;49;32;38;38;32;108;105;110;107;115;32;60;61;32;114;101;99;104;116;115;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>109;105;116;116;101;32;61;32;40;108;105;110;107;115;32;43;32;114;101;99;104;116;115;41;32;47;32;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>118;101;114;103;108;101;105;99;104;101;32;61;32;118;101;114;103;108;101;105;99;104;101;32;43;32;49;</text>
      </strelem>
      <strelem typ="1" zx="0" zy="0">
        <text>107;97;114;116;101;110;91;109;105;116;116;101;93;32;61;61;32;103;101;115;117;99;104;116;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>112;111;115;105;116;105;111;110;32;61;32;109;105;116;116;101;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="1" zx="0" zy="0">
            <text>107;97;114;116;101;110;91;109;105;116;116;101;93;32;60;32;103;101;115;117;99;104;116;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>108;105;110;107;115;32;61;32;109;105;116;116;101;32;43;32;49;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>114;101;99;104;116;115;32;61;32;109;105;116;116;101;32;45;32;49;</text>
              </strelem>
            </fall>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>112;111;115;105;116;105;111;110;32;62;61;32;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;71;101;102;117;110;100;101;110;32;97;110;32;80;111;115;105;116;105;111;110;32;34;32;43;32;112;111;115;105;116;105;111;110;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;78;105;99;104;116;32;103;101;102;117;110;100;101;110;34;</text>
      </strelem>
    </fall>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;86;101;114;103;108;101;105;99;104;101;58;32;34;32;43;32;118;101;114;103;108;101;105;99;104;101;</text>
  </strelem>
</struktogramm>
`,rh=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;117;98;98;108;101;115;111;114;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;107;97;114;116;101;110;32;61;32;123;55;44;32;51;44;32;49;48;44;32;53;44;32;50;125;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;114;117;110;100;101;32;61;32;49;</text>
    <text>114;117;110;100;101;32;60;32;107;97;114;116;101;110;46;108;101;110;103;116;104;</text>
    <text>114;117;110;100;101;43;43;</text>
    <schleifeninhalt>
      <strelem typ="3" zx="0" zy="0">
        <text>105;110;116;32;105;32;61;32;48;</text>
        <text>105;32;60;32;107;97;114;116;101;110;46;108;101;110;103;116;104;32;45;32;114;117;110;100;101;</text>
        <text>105;43;43;</text>
        <schleifeninhalt>
          <strelem typ="1" zx="0" zy="0">
            <text>107;97;114;116;101;110;91;105;93;32;62;32;107;97;114;116;101;110;91;105;32;43;32;49;93;</text>
            <fall fallname="116;114;117;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>105;110;116;32;104;105;108;102;32;61;32;107;97;114;116;101;110;91;105;93;</text>
              </strelem>
              <strelem typ="0" zx="0" zy="0">
                <text>107;97;114;116;101;110;91;105;93;32;61;32;107;97;114;116;101;110;91;105;32;43;32;49;93;</text>
              </strelem>
              <strelem typ="0" zx="0" zy="0">
                <text>107;97;114;116;101;110;91;105;32;43;32;49;93;32;61;32;104;105;108;102;</text>
              </strelem>
            </fall>
            <fall fallname="102;97;108;115;101;">
              <strelem typ="0" zx="0" zy="0">
                <text>248;</text>
              </strelem>
            </fall>
          </strelem>
        </schleifeninhalt>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;107;97;114;116;101;110;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;107;97;114;116;101;110;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,ah=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="75;97;114;116;101;32;115;117;99;104;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;107;97;114;116;101;110;32;61;32;123;56;44;32;52;44;32;49;49;44;32;52;44;32;54;125;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;103;101;115;117;99;104;116;32;34;87;101;108;99;104;101;32;75;97;114;116;101;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;112;111;115;105;116;105;111;110;32;61;32;45;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>112;111;115;105;116;105;111;110;32;61;61;32;45;49;32;38;38;32;105;32;60;32;107;97;114;116;101;110;46;108;101;110;103;116;104;</text>
    <schleifeninhalt>
      <strelem typ="1" zx="0" zy="0">
        <text>107;97;114;116;101;110;91;105;93;32;61;61;32;103;101;115;117;99;104;116;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>112;111;115;105;116;105;111;110;32;61;32;105;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>248;</text>
          </strelem>
        </fall>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;32;61;32;105;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>112;111;115;105;116;105;111;110;32;62;61;32;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;80;111;115;105;116;105;111;110;58;32;34;32;43;32;112;111;115;105;116;105;111;110;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;78;105;99;104;116;32;103;101;102;117;110;100;101;110;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,lh=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="76;105;110;101;97;114;101;32;83;117;99;104;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;107;97;114;116;101;110;32;61;32;123;50;44;32;51;44;32;53;44;32;55;44;32;56;44;32;49;48;44;32;49;50;44;32;49;51;44;32;49;53;44;32;49;56;44;32;50;48;44;32;50;49;44;32;50;52;44;32;50;55;44;32;51;48;125;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;103;101;115;117;99;104;116;32;34;87;101;108;99;104;101;32;75;97;114;116;101;32;115;117;99;104;115;116;32;100;117;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;112;111;115;105;116;105;111;110;32;61;32;45;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;118;101;114;103;108;101;105;99;104;101;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>112;111;115;105;116;105;111;110;32;61;61;32;45;49;32;38;38;32;105;32;60;32;107;97;114;116;101;110;46;108;101;110;103;116;104;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>118;101;114;103;108;101;105;99;104;101;32;61;32;118;101;114;103;108;101;105;99;104;101;32;43;32;49;</text>
      </strelem>
      <strelem typ="1" zx="0" zy="0">
        <text>107;97;114;116;101;110;91;105;93;32;61;61;32;103;101;115;117;99;104;116;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>112;111;115;105;116;105;111;110;32;61;32;105;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>248;</text>
          </strelem>
        </fall>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>105;32;61;32;105;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>112;111;115;105;116;105;111;110;32;62;61;32;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;71;101;102;117;110;100;101;110;32;97;110;32;80;111;115;105;116;105;111;110;32;34;32;43;32;112;111;115;105;116;105;111;110;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;78;105;99;104;116;32;103;101;102;117;110;100;101;110;34;</text>
      </strelem>
    </fall>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;86;101;114;103;108;101;105;99;104;101;58;32;34;32;43;32;118;101;114;103;108;101;105;99;104;101;</text>
  </strelem>
</struktogramm>
`,oh=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="72;97;117;112;116;112;114;111;103;114;97;109;109;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;112;117;110;107;116;101;32;61;32;123;51;44;32;53;44;32;56;125;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>98;111;110;117;115;40;112;117;110;107;116;101;41;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;112;117;110;107;116;101;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;112;117;110;107;116;101;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,uh=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="72;97;117;112;116;112;114;111;103;114;97;109;109;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;112;117;110;107;116;101;32;61;32;123;51;44;32;53;44;32;56;125;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>98;111;110;117;115;40;112;117;110;107;116;101;41;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;112;117;110;107;116;101;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;112;117;110;107;116;101;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,hh=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="118;111;105;100;32;98;111;110;117;115;40;105;110;116;91;93;32;112;117;110;107;116;101;41;">
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;112;117;110;107;116;101;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>112;117;110;107;116;101;91;105;93;32;61;32;112;117;110;107;116;101;91;105;93;32;43;32;49;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,mh=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="72;97;117;112;116;112;114;111;103;114;97;109;109;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;122;97;104;108;32;61;32;53;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>118;101;114;100;111;112;112;108;101;40;122;97;104;108;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;73;109;32;72;97;117;112;116;112;114;111;103;114;97;109;109;58;32;122;97;104;108;32;61;32;34;32;43;32;122;97;104;108;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>98;111;111;108;101;97;110;91;93;32;114;101;105;104;101;32;61;32;123;116;114;117;101;44;32;116;114;117;101;44;32;102;97;108;115;101;44;32;116;114;117;101;125;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;86;111;114;104;101;114;58;32;34;32;43;32;114;101;105;104;101;91;48;93;32;43;32;34;44;32;34;32;43;32;114;101;105;104;101;91;49;93;</text>
  </strelem>
  <strelem typ="8" zx="0" zy="0">
    <text>108;101;101;114;101;110;40;114;101;105;104;101;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;78;97;99;104;104;101;114;58;32;34;32;43;32;114;101;105;104;101;91;48;93;32;43;32;34;44;32;34;32;43;32;114;101;105;104;101;91;49;93;</text>
  </strelem>
</struktogramm>
`,ch=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="118;111;105;100;32;108;101;101;114;101;110;40;98;111;111;108;101;97;110;91;93;32;112;108;97;101;116;122;101;41;">
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;112;108;97;101;116;122;101;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>112;108;97;101;116;122;101;91;105;93;32;61;32;102;97;108;115;101;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,dh=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="118;111;105;100;32;118;101;114;100;111;112;112;108;101;40;105;110;116;32;120;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>120;32;61;32;120;32;42;32;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;73;109;32;85;110;116;101;114;112;114;111;103;114;97;109;109;58;32;120;32;61;32;34;32;43;32;120;</text>
  </strelem>
</struktogramm>
`,gh=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="73;110;105;116;105;97;108;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;118;111;114;110;97;109;101;32;34;86;111;114;110;97;109;101;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;110;97;99;104;110;97;109;101;32;34;78;97;99;104;110;97;109;101;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;118;111;114;110;97;109;101;46;99;104;97;114;65;116;40;48;41;32;43;32;34;46;32;34;32;43;32;110;97;99;104;110;97;109;101;46;99;104;97;114;65;116;40;48;41;32;43;32;34;46;34;</text>
  </strelem>
</struktogramm>
`,ph=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="82;252;99;107;119;228;114;116;115;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;119;111;114;116;32;34;87;111;114;116;32;101;105;110;103;101;98;101;110;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;114;117;101;99;107;119;97;101;114;116;115;32;61;32;34;34;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;119;111;114;116;46;108;101;110;103;116;104;40;41;32;45;32;49;</text>
    <text>105;32;62;61;32;48;</text>
    <text>105;45;45;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>114;117;101;99;107;119;97;101;114;116;115;32;61;32;114;117;101;99;107;119;97;101;114;116;115;32;43;32;119;111;114;116;46;99;104;97;114;65;116;40;105;41;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;114;117;101;99;107;119;97;101;114;116;115;</text>
  </strelem>
</struktogramm>
`,xh=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="90;101;114;108;101;103;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;122;101;105;108;101;32;61;32;34;76;117;100;119;105;103;59;71;101;105;223;98;111;99;107;59;55;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;91;93;32;116;101;105;108;101;32;61;32;122;101;105;108;101;46;115;112;108;105;116;40;34;59;34;41;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;116;101;105;108;101;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;32;43;32;34;58;32;34;32;43;32;116;101;105;108;101;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,bh=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="87;246;114;116;101;114;32;122;228;104;108;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;115;97;116;122;32;34;83;97;116;122;32;101;105;110;103;101;98;101;110;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;91;93;32;119;111;101;114;116;101;114;32;61;32;115;97;116;122;46;115;112;108;105;116;40;34;32;34;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;87;246;114;116;101;114;58;32;34;32;43;32;119;111;101;114;116;101;114;46;108;101;110;103;116;104;</text>
  </strelem>
</struktogramm>
`,fh=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;117;99;104;115;116;97;98;101;110;32;122;228;104;108;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;119;111;114;116;32;34;87;111;114;116;32;101;105;110;103;101;98;101;110;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;110;122;97;104;108;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;119;111;114;116;46;108;101;110;103;116;104;40;41;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="1" zx="0" zy="0">
        <text>119;111;114;116;46;99;104;97;114;65;116;40;105;41;32;61;61;32;39;101;39;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>97;110;122;97;104;108;32;61;32;97;110;122;97;104;108;32;43;32;49;</text>
          </strelem>
        </fall>
        <fall fallname="102;97;108;115;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>248;</text>
          </strelem>
        </fall>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;65;110;122;97;104;108;32;101;58;32;34;32;43;32;97;110;122;97;104;108;</text>
  </strelem>
</struktogramm>
`,Ih=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="90;101;105;99;104;101;110;107;101;116;116;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;119;111;114;116;32;61;32;34;71;101;105;223;98;111;99;107;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;119;111;114;116;46;108;101;110;103;116;104;40;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;119;111;114;116;46;99;104;97;114;65;116;40;48;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;119;111;114;116;46;115;117;98;115;116;114;105;110;103;40;48;44;32;52;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;119;111;114;116;46;115;117;98;115;116;114;105;110;103;40;52;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;119;111;114;116;46;105;110;100;101;120;79;102;40;34;98;111;99;107;34;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;119;111;114;116;46;116;111;85;112;112;101;114;67;97;115;101;40;41;</text>
  </strelem>
</struktogramm>
`,yh=""+new URL("aufgabe-mehrwertsteuer-C-TFTrWz.svg",import.meta.url).href,zh=""+new URL("ben-shneiderman-Cev5hrqS.jpg",import.meta.url).href,wh=""+new URL("aufgabe-mehrwertsteuer-CnrZ00ny.svg",import.meta.url).href,vh=""+new URL("kino-saal-C8zaJk4X.svg",import.meta.url).href,kh=""+new URL("kino-schleifen-D7sfo9iK.svg",import.meta.url).href,Sh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDkyIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDkyIiBmaWxsPSIjZmZmZmZmIi8+CiAgPGcgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiPgogICAgPCEtLSBTdGFydCAtLT4KICAgIDxyZWN0IHg9IjEwMCIgeT0iMTAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMjgiIHJ4PSIxNCIgZmlsbD0iI2QxZjJkOSIvPgogICAgPGxpbmUgeDE9IjE1MCIgeTE9IjM4IiB4Mj0iMTUwIiB5Mj0iNTQiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICAgIDwhLS0gQW53ZWlzdW5nIC0tPgogICAgPHJlY3QgeD0iNTAiIHk9IjU2IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZTVmMGZmIi8+CiAgICA8bGluZSB4MT0iMTUwIiB5MT0iODYiIHgyPSIxNTAiIHkyPSI5OCIgbWFya2VyLWVuZD0idXJsKCNhKSIvPgogICAgPCEtLSBSYXV0ZSAxIC0tPgogICAgPHBhdGggZD0iTTE1MCAxMDAgTDIzNSAxMjggTDE1MCAxNTYgTDY1IDEyOCBaIiBmaWxsPSIjZmZmNGQ2Ii8+CiAgICA8bGluZSB4MT0iMTUwIiB5MT0iMTU2IiB4Mj0iMTUwIiB5Mj0iMTcyIiBtYXJrZXItZW5kPSJ1cmwoI2EpIi8+CiAgICA8cmVjdCB4PSI1MCIgeT0iMTc0IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZTVmMGZmIi8+CiAgICA8bGluZSB4MT0iMTUwIiB5MT0iMjA0IiB4Mj0iMTUwIiB5Mj0iMjUwIiBtYXJrZXItZW5kPSJ1cmwoI2EpIi8+CiAgICA8IS0tIG5laW4tV2VnIHVtIGRlbiBLYXN0ZW4gaGVydW0gLS0+CiAgICA8cG9seWxpbmUgcG9pbnRzPSIyMzUsMTI4IDI4NSwxMjggMjg1LDIyMiAxNTAsMjIyIiBmaWxsPSJub25lIiBtYXJrZXItZW5kPSJ1cmwoI2EpIi8+CiAgICA8IS0tIFJhdXRlIDIgLS0+CiAgICA8cGF0aCBkPSJNMTUwIDI1MiBMMjM1IDI4MCBMMTUwIDMwOCBMNjUgMjgwIFoiIGZpbGw9IiNmZmY0ZDYiLz4KICAgIDxsaW5lIHgxPSIyMzUiIHkxPSIyODAiIHgyPSIyNjgiIHkyPSIyODAiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICAgIDxyZWN0IHg9IjI3MCIgeT0iMjY1IiB3aWR0aD0iMTE1IiBoZWlnaHQ9IjMwIiBmaWxsPSIjZTVmMGZmIi8+CiAgICA8IS0tIHp1csO8Y2sgenVyIFByw7xmdW5nIC0tPgogICAgPHBvbHlsaW5lIHBvaW50cz0iMzI3LDI2NSAzMjcsMjM4IDE1MCwyMzgiIGZpbGw9Im5vbmUiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICAgIDxsaW5lIHgxPSIxNTAiIHkxPSIzMDgiIHgyPSIxNTAiIHkyPSIzMjYiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICAgIDxyZWN0IHg9IjUwIiB5PSIzMjgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMzAiIGZpbGw9IiNlNWYwZmYiLz4KICAgIDxsaW5lIHgxPSIxNTAiIHkxPSIzNTgiIHgyPSIxNTAiIHkyPSIzNzQiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICAgIDwhLS0gRW5kZSAtLT4KICAgIDxyZWN0IHg9IjEwMCIgeT0iMzc2IiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjI4IiByeD0iMTQiIGZpbGw9IiNkMWYyZDkiLz4KICA8L2c+CiAgPGcgdGV4dC1hbmNob3I9Im1pZGRsZSI+CiAgICA8dGV4dCB4PSIxNTAiIHk9IjI5Ij5TdGFydDwvdGV4dD4KICAgIDx0ZXh0IHg9IjE1MCIgeT0iNzYiPlB1dCBhIGN1cCBvbiB0aGUgdGFibGU8L3RleHQ+CiAgICA8dGV4dCB4PSIxNTAiIHk9IjEzMyI+U3VnYXIgd2FudGVkPzwvdGV4dD4KICAgIDx0ZXh0IHg9IjE1MCIgeT0iMTk0Ij5BZGQgc3VnYXI8L3RleHQ+CiAgICA8dGV4dCB4PSIxNTAiIHk9IjI4NSI+VGVhIHN0aWxsIHRvbyBob3Q/PC90ZXh0PgogICAgPHRleHQgeD0iMzI3LjUiIHk9IjI4NSI+V2FpdCAxIG1pbnV0ZTwvdGV4dD4KICAgIDx0ZXh0IHg9IjE1MCIgeT0iMzQ4Ij5EcmluayB0aGUgdGVhPC90ZXh0PgogICAgPHRleHQgeD0iMTUwIiB5PSIzOTUiPkVuZDwvdGV4dD4KICA8L2c+CiAgPGcgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9IjYwMCI+CiAgICA8dGV4dCB4PSIxNTYiIHk9IjE2OCIgZmlsbD0iIzI0OGEzZCI+eWVzPC90ZXh0PgogICAgPHRleHQgeD0iMjQyIiB5PSIxMjIiIGZpbGw9IiNkNzAwMTUiPm5vPC90ZXh0PgogICAgPHRleHQgeD0iMjQwIiB5PSIyNzQiIGZpbGw9IiMyNDhhM2QiPnllczwvdGV4dD4KICAgIDx0ZXh0IHg9IjE1NiIgeT0iMzIwIiBmaWxsPSIjZDcwMDE1Ij5ubzwvdGV4dD4KICA8L2c+CiAgPCEtLSBMZWdlbmRlIC0tPgogIDxsaW5lIHgxPSIxMCIgeTE9IjQxOCIgeDI9IjM5MCIgeTI9IjQxOCIgc3Ryb2tlPSIjZDFkMWQ2Ii8+CiAgPGcgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjEuNSI+CiAgICA8cmVjdCB4PSI0MCIgeT0iNDMwIiB3aWR0aD0iMzYiIGhlaWdodD0iMTgiIHJ4PSI5IiBmaWxsPSIjZDFmMmQ5Ii8+CiAgICA8cmVjdCB4PSIyMjAiIHk9IjQzMCIgd2lkdGg9IjM2IiBoZWlnaHQ9IjE4IiBmaWxsPSIjZTVmMGZmIi8+CiAgICA8cGF0aCBkPSJNNTggNDU4IEw3NiA0NjkgTDU4IDQ4MCBMNDAgNDY5IFoiIGZpbGw9IiNmZmY0ZDYiLz4KICAgIDxwYXRoIGQ9Ik0yMjYgNDYwIEwyNTYgNDYwIEwyNTAgNDc4IEwyMjAgNDc4IFoiIGZpbGw9IiNmMmU2ZmYiLz4KICA8L2c+CiAgPGcgZm9udC1zaXplPSIxMiIgZmlsbD0iIzNhM2EzYyI+CiAgICA8dGV4dCB4PSI4NiIgeT0iNDQzIj5TdGFydCBvciBlbmQ8L3RleHQ+CiAgICA8dGV4dCB4PSIyNjYiIHk9IjQ0MyI+U3RhdGVtZW50PC90ZXh0PgogICAgPHRleHQgeD0iODYiIHk9IjQ3MyI+RGVjaXNpb248L3RleHQ+CiAgICA8dGV4dCB4PSIyNjYiIHk9IjQ3MyI+SW5wdXQgb3Igb3V0cHV0PC90ZXh0PgogIDwvZz4KPC9zdmc+Cg==",Zh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMTkwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE5MCIgZmlsbD0iI2ZmZmZmZiIvPgogIDx0ZXh0IHg9IjIwIiB5PSIyNCIgZm9udC13ZWlnaHQ9IjYwMCI+V2hlcmUgZG9lcyB0aGUgZWxlbWVudCBsYW5kPzwvdGV4dD4KICA8cmVjdCB4PSIyMCIgeT0iNDAiIHdpZHRoPSIxOTAiIGhlaWdodD0iMzUiIGZpbGw9IiNkYmVhZmUiLz4KICA8cmVjdCB4PSIyMCIgeT0iNzUiIHdpZHRoPSIxOTAiIGhlaWdodD0iMzUiIGZpbGw9IiNkY2ZjZTciLz4KICA8bGluZSB4MT0iMjAiIHkxPSI3NSIgeDI9IjIxMCIgeTI9Ijc1IiBzdHJva2U9IiM2ZTZlNzMiIHN0cm9rZS1kYXNoYXJyYXk9IjQgMyIvPgogIDxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjE5MCIgaGVpZ2h0PSI3MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIxMTUiIHk9IjYyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMWQ0ZWQ4Ij50b3AgaGFsZjwvdGV4dD4KICA8dGV4dCB4PSIxMTUiIHk9Ijk3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMTU4MDNkIj5ib3R0b20gaGFsZjwvdGV4dD4KICA8dGV4dCB4PSIyMjQiIHk9IjYyIj7ihpIgZ29lcyA8dHNwYW4gZm9udC13ZWlnaHQ9IjYwMCI+aW4gZnJvbnQ8L3RzcGFuPjwvdGV4dD4KICA8dGV4dCB4PSIyMjQiIHk9Ijk3Ij7ihpIgZ29lcyA8dHNwYW4gZm9udC13ZWlnaHQ9IjYwMCI+YWZ0ZXI8L3RzcGFuPjwvdGV4dD4KICA8cmVjdCB4PSIyMCIgeT0iMTMyIiB3aWR0aD0iMTkwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZmVmM2M3IiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjExNSIgeT0iMTU3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2Ij7DuDwvdGV4dD4KICA8dGV4dCB4PSIyMjQiIHk9IjE1NyI+4oaSIDx0c3BhbiBmb250LXdlaWdodD0iNjAwIj5yZXBsYWNlczwvdHNwYW4+IGl0PC90ZXh0Pgo8L3N2Zz4K",Mh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjEwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIxMCIgZmlsbD0iI2ZmZmZmZiIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJ1aS1tb25vc3BhY2UsIE1lbmxvLCBDb25zb2xhcywgbW9ub3NwYWNlIiBmb250LXNpemU9IjE2Ij5pbnQgYWdlID0gMTQ8L3RleHQ+CiAgPHBhdGggZD0iTTEzMCA3MCBMMTcwIDUwIEwzMDAgNTAgTDI2MCA3MCBaIiBmaWxsPSIjYzk4YTNjIiBzdHJva2U9IiM4YTVhMWYiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxyZWN0IHg9IjE4MCIgeT0iMzQiIHdpZHRoPSI0NCIgaGVpZ2h0PSI1MCIgcng9IjMiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzZlNmU3MyIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KICA8dGV4dCB4PSIyMDIiIHk9IjYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iNzAwIj4xNDwvdGV4dD4KICA8cmVjdCB4PSIxMzAiIHk9IjcwIiB3aWR0aD0iMTMwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U5Yjg3MiIgc3Ryb2tlPSIjOGE1YTFmIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBkPSJNMjYwIDcwIEwzMDAgNTAgTDMwMCAxNTAgTDI2MCAxNzAgWiIgZmlsbD0iI2Q0OWE0YyIgc3Ryb2tlPSIjOGE1YTFmIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cmVjdCB4PSIxNTAiIHk9IjEwMCIgd2lkdGg9IjkwIiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjOGE1YTFmIi8+CiAgPHRleHQgeD0iMTk1IiB5PSIxMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSI2MDAiPmFnZTwvdGV4dD4KICA8cmVjdCB4PSIxMzgiIHk9IjE0MiIgd2lkdGg9IjM0IiBoZWlnaHQ9IjIwIiByeD0iMTAiIGZpbGw9IiMwMDdhZmYiLz4KICA8dGV4dCB4PSIxNTUiIHk9IjE1NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZmZmZiIgZm9udC13ZWlnaHQ9IjYwMCI+aW50PC90ZXh0PgogIDxnIHN0cm9rZT0iIzZlNmU3MyI+CiAgICA8bGluZSB4MT0iMzEwIiB5MT0iNDgiIHgyPSIyMjYiIHkyPSI1MiIvPgogICAgPGxpbmUgeDE9IjMxMCIgeTE9IjExNSIgeDI9IjI0MiIgeTI9IjExNSIvPgogICAgPGxpbmUgeDE9IjgwIiB5MT0iMTUyIiB4Mj0iMTM0IiB5Mj0iMTUyIi8+CiAgPC9nPgogIDx0ZXh0IHg9IjMxNiIgeT0iNTIiPlZhbHVlPC90ZXh0PgogIDx0ZXh0IHg9IjMxNiIgeT0iMTE5Ij5OYW1lPC90ZXh0PgogIDx0ZXh0IHg9IjgiIHk9IjE1NiI+RGF0YSB0eXBlPC90ZXh0PgogIDx0ZXh0IHg9IjIwMCIgeT0iMTk4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5UaGUgbmFtZSBnZXRzIHlvdSB0byB0aGUgdmFsdWUuPC90ZXh0Pgo8L3N2Zz4K",_h="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjAwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMDA3YWZmIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPGcgZm9udC1mYW1pbHk9InVpLW1vbm9zcGFjZSwgTWVubG8sIENvbnNvbGFzLCBtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjAiPgogICAgPHRleHQgeD0iNjAiIHk9IjExMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjcwMCI+cG9pbnRzPC90ZXh0PgogICAgPHRleHQgeD0iMTI1IiB5PSIxMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMDdhZmYiIGZvbnQtd2VpZ2h0PSI3MDAiPj08L3RleHQ+CiAgICA8dGV4dCB4PSIyNjAiIHk9IjExMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+cG9pbnRzICsgNTwvdGV4dD4KICA8L2c+CiAgPHJlY3QgeD0iMTgwIiB5PSI4NiIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzNCIgcng9IjYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzE1ODAzZCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMjYwIiB5PSIxNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxNTgwM2QiPuKRoCB3b3JrIG91dCB0aGUgcmlnaHQ6IDEwICsgNSA9IDE1PC90ZXh0PgogIDxwYXRoIGQ9Ik0yNTAgODIgQzIzMCAzMCwgOTAgMzAsIDY0IDg0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDdhZmYiIHN0cm9rZS13aWR0aD0iMi41IiBtYXJrZXItZW5kPSJ1cmwoI2EpIi8+CiAgPHRleHQgeD0iMTYwIiB5PSIzNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwN2FmZiI+4pGhIHN0b3JlIHRoZSByZXN1bHQgb24gdGhlIGxlZnQ8L3RleHQ+CiAgPHJlY3QgeD0iMjAiIHk9IjE2NCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIyNiIgcng9IjYiIGZpbGw9IiNmMmYyZjciLz4KICA8dGV4dCB4PSIyMDAiIHk9IjE4MiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+cG9pbnRzIGJlZm9yZTogPHRzcGFuIGZvbnQtd2VpZ2h0PSI3MDAiPjEwPC90c3Bhbj4gICDihpIgICBwb2ludHMgYWZ0ZXI6IDx0c3BhbiBmb250LXdlaWdodD0iNzAwIj4xNTwvdHNwYW4+PC90ZXh0Pgo8L3N2Zz4K",jh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjYwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjYwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPGcgc3Ryb2tlPSIjNmU2ZTczIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiPgogICAgPHBhdGggZD0iTTQwIDExMCBMNDggMTgwIEwxMDIgMTgwIEwxMTAgMTEwIi8+CiAgICA8cGF0aCBkPSJNMTY1IDExMCBMMTczIDE4MCBMMjI3IDE4MCBMMjM1IDExMCIvPgogICAgPHBhdGggZD0iTTI5MCAxMTAgTDI5OCAxODAgTDM1MiAxODAgTDM2MCAxMTAiLz4KICA8L2c+CiAgPHBhdGggZD0iTTQ0IDEzNSBMNDggMTgwIEwxMDIgMTgwIEwxMDYgMTM1IFoiIGZpbGw9IiNmZGJhNzQiLz4KICA8cGF0aCBkPSJNMjk0IDEzNSBMMjk4IDE4MCBMMzUyIDE4MCBMMzU2IDEzNSBaIiBmaWxsPSIjOTNjNWZkIi8+CiAgPHRleHQgeD0iNzUiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+bGVmdDwvdGV4dD4KICA8dGV4dCB4PSI3NSIgeT0iMjE3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5qdWljZTwvdGV4dD4KICA8dGV4dCB4PSIyMDAiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+dGVtcDwvdGV4dD4KICA8dGV4dCB4PSIyMDAiIHk9IjIxNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+ZW1wdHk8L3RleHQ+CiAgPHRleHQgeD0iMzI1IiB5PSIyMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSI2MDAiPnJpZ2h0PC90ZXh0PgogIDx0ZXh0IHg9IjMyNSIgeT0iMjE3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj53YXRlcjwvdGV4dD4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMS44IiBtYXJrZXItZW5kPSJ1cmwoI2EpIj4KICAgIDxwYXRoIGQ9Ik04OCAxMDQgQzExMCA3MCwgMTYwIDcwLCAxODYgMTA0Ii8+CiAgICA8cGF0aCBkPSJNMzE4IDEwNCBDMjcwIDE1LCAxMzAgMTUsIDgyIDEwNCIvPgogICAgPHBhdGggZD0iTTIxNCAxMDQgQzI0MCA3MCwgMjkwIDcwLCAzMTIgMTA0Ii8+CiAgPC9nPgogIDxnIGZvbnQtd2VpZ2h0PSI3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPgogICAgPGNpcmNsZSBjeD0iMTM3IiBjeT0iODAiIHI9IjExIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMxYzFjMWUiLz48dGV4dCB4PSIxMzciIHk9Ijg1Ij4xPC90ZXh0PgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMzgiIHI9IjExIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMxYzFjMWUiLz48dGV4dCB4PSIyMDAiIHk9IjQzIj4yPC90ZXh0PgogICAgPGNpcmNsZSBjeD0iMjYzIiBjeT0iODAiIHI9IjExIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMxYzFjMWUiLz48dGV4dCB4PSIyNjMiIHk9Ijg1Ij4zPC90ZXh0PgogIDwvZz4KICA8ZyB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0idWktbW9ub3NwYWNlLCBNZW5sbywgQ29uc29sYXMsIG1vbm9zcGFjZSIgZm9udC1zaXplPSIxMiI+CiAgICA8dGV4dCB4PSI3MCIgeT0iMjQ3Ij4xOiB0ZW1wID0gbGVmdDwvdGV4dD4KICAgIDx0ZXh0IHg9IjIwMCIgeT0iMjQ3Ij4yOiBsZWZ0ID0gcmlnaHQ8L3RleHQ+CiAgICA8dGV4dCB4PSIzMzAiIHk9IjI0NyI+MzogcmlnaHQgPSB0ZW1wPC90ZXh0PgogIDwvZz4KPC9zdmc+Cg==",Th="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMTUwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2ZmZmZmZiIvPgogIDxyZWN0IHg9IjIwIiB5PSI1MCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjZmVlMmUyIi8+PHJlY3QgeD0iMzEwIiB5PSI1MCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjZmVlMmUyIi8+CiAgPHJlY3QgeD0iOTAiIHk9IjUwIiB3aWR0aD0iMjIwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjZGNmY2U3Ii8+CiAgPGxpbmUgeDE9IjIwIiB5MT0iNzQiIHgyPSIzODAiIHkyPSI3NCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8bGluZSB4MT0iNDYiIHkxPSI2OCIgeDI9IjQ2IiB5Mj0iODAiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNDYiIHk9Ijk4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4wPC90ZXh0PgogIDxsaW5lIHgxPSI5MCIgeTE9IjY4IiB4Mj0iOTAiIHkyPSI4MCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI5MCIgeT0iOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjE8L3RleHQ+CiAgPGxpbmUgeDE9IjEzNCIgeTE9IjY4IiB4Mj0iMTM0IiB5Mj0iODAiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMTM0IiB5PSI5OCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MjwvdGV4dD4KICA8bGluZSB4MT0iMTc4IiB5MT0iNjgiIHgyPSIxNzgiIHkyPSI4MCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxNzgiIHk9Ijk4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4zPC90ZXh0PgogIDxsaW5lIHgxPSIyMjIiIHkxPSI2OCIgeDI9IjIyMiIgeTI9IjgwIiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjIyMiIgeT0iOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjQ8L3RleHQ+CiAgPGxpbmUgeDE9IjI2NiIgeTE9IjY4IiB4Mj0iMjY2IiB5Mj0iODAiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMjY2IiB5PSI5OCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+NTwvdGV4dD4KICA8bGluZSB4MT0iMzEwIiB5MT0iNjgiIHgyPSIzMTAiIHkyPSI4MCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIzMTAiIHk9Ijk4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj42PC90ZXh0PgogIDxsaW5lIHgxPSIzNTQiIHkxPSI2OCIgeDI9IjM1NCIgeTI9IjgwIiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjM1NCIgeT0iOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjc8L3RleHQ+CiAgPGNpcmNsZSBjeD0iOTAiIGN5PSI3NCIgcj0iNiIgZmlsbD0iIzE1ODAzZCIvPjxjaXJjbGUgY3g9IjMxMCIgY3k9Ijc0IiByPSI2IiBmaWxsPSIjMTU4MDNkIi8+CiAgPHRleHQgeD0iMjAwIiB5PSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzE1ODAzZCIgZm9udC13ZWlnaHQ9IjYwMCI+dmFsaWQ8L3RleHQ+CiAgPHRleHQgeD0iNDAiIHk9IjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYjkxYzFjIiBmb250LXdlaWdodD0iNjAwIj5pbnZhbGlkPC90ZXh0Pjx0ZXh0IHg9IjM2MCIgeT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNiOTFjMWMiIGZvbnQtd2VpZ2h0PSI2MDAiPmludmFsaWQ8L3RleHQ+CiAgPGcgZm9udC1mYW1pbHk9InVpLW1vbm9zcGFjZSwgTWVubG8sIENvbnNvbGFzLCBtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPgogICAgPHRleHQgeD0iMjAwIiB5PSIxMjQiIGZpbGw9IiMxNTgwM2QiPmdyYWRlICZndDs9IDEgJmFtcDsmYW1wOyBncmFkZSAmbHQ7PSA2PC90ZXh0PgogICAgPHRleHQgeD0iMjAwIiB5PSIxNDIiIGZpbGw9IiNiOTFjMWMiPmdyYWRlICZsdDsgMSB8fCBncmFkZSAmZ3Q7IDY8L3RleHQ+CiAgPC9nPgo8L3N2Zz4K",Ah="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjMwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjMwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHRleHQgeD0iMjAiIHk9IjI0IiBmb250LXdlaWdodD0iNjAwIj5Ib3cgdGhlIHdoaWxlIGxvb3AgcnVuczwvdGV4dD4KICA8cmVjdCB4PSIxMjAiIHk9IjQ0IiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNmZWYzYzciIHN0cm9rZT0iI2I0NTMwOSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMjAwIiB5PSI2OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGgIGNoZWNrIHRoZSBjb25kaXRpb248L3RleHQ+CiAgPHJlY3QgeD0iMTIwIiB5PSIxMjgiIHdpZHRoPSIxNjAiIGhlaWdodD0iNDAiIHJ4PSI2IiBmaWxsPSIjZGJlYWZlIiBzdHJva2U9IiMxZDRlZDgiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTUzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ikaEgcnVuIHRoZSBpbnNpZGU8L3RleHQ+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjEuOCIgbWFya2VyLWVuZD0idXJsKCNhKSI+CiAgICA8bGluZSB4MT0iMjAwIiB5MT0iODQiIHgyPSIyMDAiIHkyPSIxMjYiLz4KICAgIDxwYXRoIGQ9Ik0xMjAgMTQ4IEM4MCAxNDgsIDgwIDY0LCAxMTggNjQiLz4KICAgIDxwYXRoIGQ9Ik0yODAgNjQgTDM0MCA2NCBMMzQwIDIwMCBMMjgyIDIwMCIvPgogIDwvZz4KICA8dGV4dCB4PSIyMDgiIHk9IjExMCIgZmlsbD0iIzE1ODAzZCIgZm9udC13ZWlnaHQ9IjYwMCI+dHJ1ZTwvdGV4dD4KICA8dGV4dCB4PSIzOCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5iYWNrPC90ZXh0PgogIDx0ZXh0IHg9IjM4IiB5PSIxMjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2ZTZlNzMiPnRvIHRoZSB0b3A8L3RleHQ+CiAgPHRleHQgeD0iMzQ4IiB5PSIxMzQiIGZpbGw9IiNiOTFjMWMiIGZvbnQtd2VpZ2h0PSI2MDAiPmZhbHNlPC90ZXh0PgogIDx0ZXh0IHg9IjI3NiIgeT0iMjA1IiB0ZXh0LWFuY2hvcj0iZW5kIj5jb250aW51ZSBiZWxvdyB0aGUgbG9vcDwvdGV4dD4KPC9zdmc+Cg==",Dh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjMwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjMwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHRleHQgeD0iMTAwIiB5PSIyMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+cHJlLXRlc3QgKHdoaWxlKTwvdGV4dD4KICA8dGV4dCB4PSIzMDAiIHk9IjIyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXdlaWdodD0iNjAwIj5wb3N0LXRlc3QgKGRvLXdoaWxlKTwvdGV4dD4KICA8bGluZSB4MT0iMjAwIiB5MT0iMTAiIHgyPSIyMDAiIHkyPSIyMjAiIHN0cm9rZT0iI2QxZDFkNiIvPgogIDxyZWN0IHg9IjM1IiB5PSI0NCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjE4IiBmaWxsPSIjZmVmM2M3IiBzdHJva2U9IiNiNDUzMDkiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKRoCBjb25kaXRpb248L3RleHQ+CiAgPHJlY3QgeD0iMzUiIHk9IjEyNCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjYiIGZpbGw9IiNkYmVhZmUiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMTAwIiB5PSIxNDciIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKRoSBpbnNpZGU8L3RleHQ+CiAgPHJlY3QgeD0iMjM1IiB5PSI0NCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjYiIGZpbGw9IiNkYmVhZmUiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMzAwIiB5PSI2NyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGgIGluc2lkZTwvdGV4dD4KICA8cmVjdCB4PSIyMzUiIHk9IjEyNCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjE4IiBmaWxsPSIjZmVmM2M3IiBzdHJva2U9IiNiNDUzMDkiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjMwMCIgeT0iMTQ3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ikaEgY29uZGl0aW9uPC90ZXh0PgogIDxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIxLjYiIG1hcmtlci1lbmQ9InVybCgjYSkiPgogICAgPGxpbmUgeDE9IjEwMCIgeTE9IjgwIiB4Mj0iMTAwIiB5Mj0iMTIyIi8+CiAgICA8cGF0aCBkPSJNMzUgMTQyIEM4IDE0MiwgOCA2MiwgMzMgNjIiLz4KICAgIDxsaW5lIHgxPSIzMDAiIHkxPSI4MCIgeDI9IjMwMCIgeTI9IjEyMiIvPgogICAgPHBhdGggZD0iTTM2NSAxNDIgQzM5MiAxNDIsIDM5MiA2MiwgMzY3IDYyIi8+CiAgPC9nPgogIDx0ZXh0IHg9IjEwNiIgeT0iMTA2IiBmaWxsPSIjMTU4MDNkIiBmb250LXdlaWdodD0iNjAwIj50cnVlPC90ZXh0PgogIDx0ZXh0IHg9IjM4MCIgeT0iMTA2IiB0ZXh0LWFuY2hvcj0iZW5kIiBmaWxsPSIjMTU4MDNkIiBmb250LXdlaWdodD0iNjAwIj50cnVlPC90ZXh0PgogIDx0ZXh0IHg9IjEwMCIgeT0iMTkwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5JZiB0aGUgY29uZGl0aW9uIGlzIGZhbHNlIGF0IG9uY2UsPC90ZXh0PgogIDx0ZXh0IHg9IjEwMCIgeT0iMjA2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj50aGUgaW5zaWRlIHJ1bnMgPHRzcGFuIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiMxYzFjMWUiPm5ldmVyPC90c3Bhbj4uPC90ZXh0PgogIDx0ZXh0IHg9IjMwMCIgeT0iMTkwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5UaGUgaW5zaWRlIGFsd2F5cyBydW5zPC90ZXh0PgogIDx0ZXh0IHg9IjMwMCIgeT0iMjA2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj48dHNwYW4gZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFjMWMxZSI+YXQgbGVhc3Qgb25jZTwvdHNwYW4+LjwvdGV4dD4KPC9zdmc+Cg==",Ph="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjUwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHJlY3QgeD0iMTIwIiB5PSIxNCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzNCIgcng9IjYiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzZlNmU3MyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMjAwIiB5PSIzNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGgIFN0YXJ0IDx0c3BhbiBmaWxsPSIjNmU2ZTczIj4ob25seSBvbmNlKTwvdHNwYW4+PC90ZXh0PgogIDxyZWN0IHg9IjEyMCIgeT0iNzYiIHdpZHRoPSIxNjAiIGhlaWdodD0iMzQiIHJ4PSIxNyIgZmlsbD0iI2ZlZjNjNyIgc3Ryb2tlPSIjYjQ1MzA5IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIyMDAiIHk9Ijk4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ikaEgY2hlY2sgdGhlIGNvbmRpdGlvbjwvdGV4dD4KICA8cmVjdCB4PSIxMjAiIHk9IjEzOCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzNCIgcng9IjYiIGZpbGw9IiNkYmVhZmUiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMjAwIiB5PSIxNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKRoiBydW4gdGhlIGluc2lkZTwvdGV4dD4KICA8cmVjdCB4PSIxMjAiIHk9IjIwMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzNCIgcng9IjYiIGZpbGw9IiNkY2ZjZTciIHN0cm9rZT0iIzE1ODAzZCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMjAwIiB5PSIyMjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKRoyBzdGVwLCBlLmcuIGkrKzwvdGV4dD4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMS44IiBtYXJrZXItZW5kPSJ1cmwoI2EpIj4KICAgIDxsaW5lIHgxPSIyMDAiIHkxPSI0OCIgeDI9IjIwMCIgeTI9Ijc0Ii8+CiAgICA8bGluZSB4MT0iMjAwIiB5MT0iMTEwIiB4Mj0iMjAwIiB5Mj0iMTM2Ii8+CiAgICA8bGluZSB4MT0iMjAwIiB5MT0iMTcyIiB4Mj0iMjAwIiB5Mj0iMTk4Ii8+CiAgICA8cGF0aCBkPSJNMTIwIDIxNyBDNjAgMjE3LCA2MCA5MywgMTE4IDkzIi8+CiAgICA8cGF0aCBkPSJNMjgwIDkzIEwzMzAgOTMiLz4KICA8L2c+CiAgPHRleHQgeD0iMjA4IiB5PSIxMjkiIGZpbGw9IiMxNTgwM2QiIGZvbnQtd2VpZ2h0PSI2MDAiPnRydWU8L3RleHQ+CiAgPHRleHQgeD0iNDgiIHk9IjE2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+YmFjazwvdGV4dD4KICA8dGV4dCB4PSI0OCIgeT0iMTc2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj50byDikaE8L3RleHQ+CiAgPHRleHQgeD0iMzAwIiB5PSI4NCIgZmlsbD0iI2I5MWMxYyIgZm9udC13ZWlnaHQ9IjYwMCI+ZmFsc2U8L3RleHQ+CiAgPHRleHQgeD0iMzM2IiB5PSI5OCI+ZG9uZTwvdGV4dD4KPC9zdmc+Cg==",Ch="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMTkwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMDA3YWZmIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMTkwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHRleHQgeD0iMjAiIHk9IjI0IiBmb250LWZhbWlseT0idWktbW9ub3NwYWNlLCBNZW5sbywgQ29uc29sYXMsIG1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCI+aW50W10gbnVtYmVycyA9IHsyLCA0LCA2LCA4LCAxMH08L3RleHQ+CiAgPHRleHQgeD0iMjAiIHk9IjU0IiBmaWxsPSIjNmU2ZTczIiBmb250LXNpemU9IjEyIj5JbmRleDwvdGV4dD4KICA8dGV4dCB4PSI5MCIgeT0iNTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMDdhZmYiIGZvbnQtd2VpZ2h0PSI3MDAiPjA8L3RleHQ+PHJlY3QgeD0iNjAiIHk9IjYyIiB3aWR0aD0iNjAiIGhlaWdodD0iNDYiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iOTAiIHk9IjkyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iNjAwIj4yPC90ZXh0PgogIDx0ZXh0IHg9IjE1MCIgeT0iNTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMDdhZmYiIGZvbnQtd2VpZ2h0PSI3MDAiPjE8L3RleHQ+PHJlY3QgeD0iMTIwIiB5PSI2MiIgd2lkdGg9IjYwIiBoZWlnaHQ9IjQ2IiBmaWxsPSIjZjJmMmY3IiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjE1MCIgeT0iOTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI2MDAiPjQ8L3RleHQ+CiAgPHRleHQgeD0iMjEwIiB5PSI1NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwN2FmZiIgZm9udC13ZWlnaHQ9IjcwMCI+MjwvdGV4dD48cmVjdCB4PSIxODAiIHk9IjYyIiB3aWR0aD0iNjAiIGhlaWdodD0iNDYiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMjEwIiB5PSI5MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9IjYwMCI+NjwvdGV4dD4KICA8dGV4dCB4PSIyNzAiIHk9IjU0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDA3YWZmIiBmb250LXdlaWdodD0iNzAwIj4zPC90ZXh0PjxyZWN0IHg9IjI0MCIgeT0iNjIiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0NiIgZmlsbD0iI2YyZjJmNyIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIyNzAiIHk9IjkyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iNjAwIj44PC90ZXh0PgogIDx0ZXh0IHg9IjMzMCIgeT0iNTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMDdhZmYiIGZvbnQtd2VpZ2h0PSI3MDAiPjQ8L3RleHQ+PHJlY3QgeD0iMzAwIiB5PSI2MiIgd2lkdGg9IjYwIiBoZWlnaHQ9IjQ2IiBmaWxsPSIjZjJmMmY3IiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjMzMCIgeT0iOTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI2MDAiPjEwPC90ZXh0PgogIDx0ZXh0IHg9IjIwIiB5PSI5MCIgZmlsbD0iIzZlNmU3MyIgZm9udC1zaXplPSIxMiI+VmFsdWU8L3RleHQ+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDA3YWZmIiBzdHJva2Utd2lkdGg9IjEuOCIgbWFya2VyLWVuZD0idXJsKCNhKSI+PGxpbmUgeDE9IjkwIiB5MT0iMTQwIiB4Mj0iOTAiIHkyPSIxMTIiLz48bGluZSB4MT0iMzMwIiB5MT0iMTQwIiB4Mj0iMzMwIiB5Mj0iMTEyIi8+PC9nPgogIDxnIGZvbnQtZmFtaWx5PSJ1aS1tb25vc3BhY2UsIE1lbmxvLCBDb25zb2xhcywgbW9ub3NwYWNlIiBmb250LXNpemU9IjEzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj48dGV4dCB4PSI5MCIgeT0iMTU2Ij5udW1iZXJzWzBdIGlzIDI8L3RleHQ+PHRleHQgeD0iMzMwIiB5PSIxNTYiPm51bWJlcnNbNF0gaXMgMTA8L3RleHQ+PC9nPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTgyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj41IHNsb3RzLCBjb3VudGluZyBzdGFydHMgYXQgMDogdGhlIGxhc3QgaW5kZXggaXMgNC48L3RleHQ+Cjwvc3ZnPgo=",Wh=""+new URL("ss-binaere-suche-D02W1TH_.svg",import.meta.url).href,Bh=""+new URL("ss-bubblesort-CmKEoNfO.svg",import.meta.url).href,Hh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDQgMTk2IiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjMWMxYzFlIj4KPHJlY3Qgd2lkdGg9IjQwNCIgaGVpZ2h0PSIxOTYiIGZpbGw9IiNmZmZmZmYiLz4KPHRleHQgeD0iMTQiIHk9IjI0IiBmb250LXdlaWdodD0iNjAwIiBmb250LXNpemU9IjE1Ij5Mb29raW5nIGZvciB0aGUgOS4gVGhlIGNhcmRzIGFyZSBtaXhlZCB1cC48L3RleHQ+CjxnPjxyZWN0IHg9IjE0IiB5PSI1MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjU2IiByeD0iNSIgZmlsbD0iI2YyZjJmNyIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSIzNC4wIiB5PSI3NS4yIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjZGMyNjI2Ij43PC90ZXh0Pjx0ZXh0IHg9IjM0LjAiIHk9Ijk1LjkxOTk5OTk5OTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE1IiBmaWxsPSIjZGMyNjI2Ij7imaU8L3RleHQ+PC9nPgo8dGV4dCB4PSIzNC4wIiB5PSIxMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiNkYzI2MjYiPuKclzwvdGV4dD4KPHRleHQgeD0iMzQuMCIgeT0iMTQ4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjEzIiBmaWxsPSIjNmU2ZTczIj4xLjwvdGV4dD4KPGc+PHJlY3QgeD0iNjIiIHk9IjUwIiB3aWR0aD0iNDAiIGhlaWdodD0iNTYiIHJ4PSI1IiBmaWxsPSIjZjJmMmY3IiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMSIvPjx0ZXh0IHg9IjgyLjAiIHk9Ijc1LjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiMxYzFjMWUiPjM8L3RleHQ+PHRleHQgeD0iODIuMCIgeT0iOTUuOTE5OTk5OTk5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTUiIGZpbGw9IiMxYzFjMWUiPuKZoDwvdGV4dD48L2c+Cjx0ZXh0IHg9IjgyLjAiIHk9IjEzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0iI2RjMjYyNiI+4pyXPC90ZXh0Pgo8dGV4dCB4PSI4Mi4wIiB5PSIxNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiM2ZTZlNzMiPjIuPC90ZXh0Pgo8Zz48cmVjdCB4PSIxMTAiIHk9IjUwIiB3aWR0aD0iNDAiIGhlaWdodD0iNTYiIHJ4PSI1IiBmaWxsPSIjZjJmMmY3IiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMSIvPjx0ZXh0IHg9IjEzMC4wIiB5PSI3NS4yIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjZGMyNjI2Ij4xMDwvdGV4dD48dGV4dCB4PSIxMzAuMCIgeT0iOTUuOTE5OTk5OTk5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTUiIGZpbGw9IiNkYzI2MjYiPuKZpjwvdGV4dD48L2c+Cjx0ZXh0IHg9IjEzMC4wIiB5PSIxMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiNkYzI2MjYiPuKclzwvdGV4dD4KPHRleHQgeD0iMTMwLjAiIHk9IjE0OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZlNmU3MyI+My48L3RleHQ+CjxnPjxyZWN0IHg9IjE1OCIgeT0iNTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI1NiIgcng9IjUiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHRleHQgeD0iMTc4LjAiIHk9Ijc1LjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiMxYzFjMWUiPjU8L3RleHQ+PHRleHQgeD0iMTc4LjAiIHk9Ijk1LjkxOTk5OTk5OTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE1IiBmaWxsPSIjMWMxYzFlIj7imaM8L3RleHQ+PC9nPgo8dGV4dCB4PSIxNzguMCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjZGMyNjI2Ij7inJc8L3RleHQ+Cjx0ZXh0IHg9IjE3OC4wIiB5PSIxNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiM2ZTZlNzMiPjQuPC90ZXh0Pgo8Zz48cmVjdCB4PSIyMDYiIHk9IjUwIiB3aWR0aD0iNDAiIGhlaWdodD0iNTYiIHJ4PSI1IiBmaWxsPSIjZGNmY2U3IiBzdHJva2U9IiMxNTgwM2QiIHN0cm9rZS13aWR0aD0iMyIvPjx0ZXh0IHg9IjIyNi4wIiB5PSI3NS4yIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjMWMxYzFlIj45PC90ZXh0Pjx0ZXh0IHg9IjIyNi4wIiB5PSI5NS45MTk5OTk5OTk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNSIgZmlsbD0iIzFjMWMxZSI+4pmgPC90ZXh0PjwvZz4KPHRleHQgeD0iMjI2LjAiIHk9IjEzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0iIzE1ODAzZCI+4pyTPC90ZXh0Pgo8dGV4dCB4PSIyMjYuMCIgeT0iMTQ4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjEzIiBmaWxsPSIjNmU2ZTczIj41LjwvdGV4dD4KPGc+PHJlY3QgeD0iMjU0IiB5PSI1MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjU2IiByeD0iNSIgZmlsbD0iIzFkNGVkOCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSIyNTgiIHk9IjU0IiB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHJ4PSIzIiBmaWxsPSJub25lIiBzdHJva2U9IiM5M2M1ZmQiIHN0cm9rZS13aWR0aD0iMS4yIiBzdHJva2UtZGFzaGFycmF5PSIzIDIiLz48L2c+CjxnPjxyZWN0IHg9IjMwMiIgeT0iNTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI1NiIgcng9IjUiIGZpbGw9IiMxZDRlZDgiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHJlY3QgeD0iMzA2IiB5PSI1NCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjQ4IiByeD0iMyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTNjNWZkIiBzdHJva2Utd2lkdGg9IjEuMiIgc3Ryb2tlLWRhc2hhcnJheT0iMyAyIi8+PC9nPgo8Zz48cmVjdCB4PSIzNTAiIHk9IjUwIiB3aWR0aD0iNDAiIGhlaWdodD0iNTYiIHJ4PSI1IiBmaWxsPSIjMWQ0ZWQ4IiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMSIvPjxyZWN0IHg9IjM1NCIgeT0iNTQiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0OCIgcng9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzkzYzVmZCIgc3Ryb2tlLXdpZHRoPSIxLjIiIHN0cm9rZS1kYXNoYXJyYXk9IjMgMiIvPjwvZz4KPHRleHQgeD0iMTQiIHk9IjE2OCIgZm9udC1zaXplPSIxNSIgZmlsbD0iIzZlNmU3MyI+VHVybiB0aGVtIG92ZXIgZnJvbSBsZWZ0IHRvIHJpZ2h0OjwvdGV4dD48dGV4dCB4PSIxNCIgeT0iMTg4IiBmb250LXNpemU9IjE1IiBmaWxsPSIjNmU2ZTczIj5BZnRlciA1IGNvbXBhcmlzb25zIHRoZSA5IGlzIGZvdW5kLjwvdGV4dD4KPC9zdmc+Cg==",Gh=""+new URL("ss-vergleiche-UczNldcC.svg",import.meta.url).href,Nh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MjAgNDUwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KPGRlZnM+PG1hcmtlciBpZD0iayIgdmlld0JveD0iMCAwIDEwIDEwIiByZWZYPSI5IiByZWZZPSI1IiBtYXJrZXJXaWR0aD0iNiIgbWFya2VySGVpZ2h0PSI2IiBvcmllbnQ9ImF1dG8iPjxwYXRoIGQ9Ik0wIDAgTDEwIDUgTDAgMTAgWiIgZmlsbD0iIzFjMWMxZSIvPjwvbWFya2VyPjxtYXJrZXIgaWQ9ImIiIHZpZXdCb3g9IjAgMCAxMCAxMCIgcmVmWD0iOSIgcmVmWT0iNSIgbWFya2VyV2lkdGg9IjYiIG1hcmtlckhlaWdodD0iNiIgb3JpZW50PSJhdXRvIj48cGF0aCBkPSJNMCAwIEwxMCA1IEwwIDEwIFoiIGZpbGw9IiMxZDRlZDgiLz48L21hcmtlcj48bWFya2VyIGlkPSJvIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI2IiBtYXJrZXJIZWlnaHQ9IjYiIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjYjQ1MzA5Ii8+PC9tYXJrZXI+PC9kZWZzPgo8cmVjdCB3aWR0aD0iNDIwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iI2ZmZmZmZiIvPgo8dGV4dCB4PSIxMCIgeT0iMjIiIGZvbnQtc2l6ZT0iMTUiIGZvbnQtd2VpZ2h0PSI3MDAiPkNhbGwgYnkgdmFsdWU6IGEgY29weTwvdGV4dD4KPHJlY3QgeD0iMTAiIHk9IjM4IiB3aWR0aD0iMTYwIiBoZWlnaHQ9Ijg2IiByeD0iOCIgZmlsbD0iI2VmZjZmZiIgc3Ryb2tlPSIjMWQ0ZWQ4IiBzdHJva2Utd2lkdGg9IjEuNSIvPgo8dGV4dCB4PSIyMCIgeT0iNTgiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiMxZDRlZDgiPk1haW4gcHJvZ3JhbTwvdGV4dD4KPHRleHQgeD0iMTYiIHk9Ijk4IiBmb250LXNpemU9IjEyIj5udW1iZXI8L3RleHQ+CjxyZWN0IHg9IjcwIiB5PSI3OCIgd2lkdGg9IjU2IiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMWMxYzFlIi8+Cjx0ZXh0IHg9Ijk4IiB5PSI5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjcwMCI+NTwvdGV4dD4KPHJlY3QgeD0iMjUwIiB5PSIzOCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI4NiIgcng9IjgiIGZpbGw9IiNmZmY3ZWQiIHN0cm9rZT0iI2I0NTMwOSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHRleHQgeD0iMjYwIiB5PSI1OCIgZm9udC1zaXplPSIxMyIgZmlsbD0iI2I0NTMwOSI+ZG91YmxlSXQ8L3RleHQ+Cjx0ZXh0IHg9IjI2MCIgeT0iOTgiPng8L3RleHQ+CjxyZWN0IHg9IjI4MCIgeT0iNzgiIHdpZHRoPSI4MCIgaGVpZ2h0PSIzMCIgcng9IjQiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzFjMWMxZSIvPgo8dGV4dCB4PSIzMjAiIHk9Ijk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj48dHNwYW4gZmlsbD0iIzZlNmU3MyIgdGV4dC1kZWNvcmF0aW9uPSJsaW5lLXRocm91Z2giPjU8L3RzcGFuPiA8dHNwYW4gZm9udC13ZWlnaHQ9IjcwMCI+MTA8L3RzcGFuPjwvdGV4dD4KPGxpbmUgeDE9IjEyOCIgeTE9IjkzIiB4Mj0iMjQ4IiB5Mj0iOTMiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1kYXNoYXJyYXk9IjUgNCIgbWFya2VyLWVuZD0idXJsKCNrKSIvPgo8dGV4dCB4PSIyMTAiIHk9Ijg0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjEzIj5jb3B5PC90ZXh0Pgo8dGV4dCB4PSIxMCIgeT0iMTUwIiBmb250LXNpemU9IjEzIiBmaWxsPSIjNmU2ZTczIj54IGJlY29tZXMgMTAsIGJ1dCBudW1iZXIgc3RheXMgNS48L3RleHQ+Cjx0ZXh0IHg9IjEwIiB5PSIxNjgiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiM2ZTZlNzMiPkxpa2UgYSBwaG90b2NvcHk6IHdyaXRpbmcgb24gdGhlIGNvcHk8L3RleHQ+Cjx0ZXh0IHg9IjEwIiB5PSIxODYiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiM2ZTZlNzMiPmRvZXMgbm90IGNoYW5nZSB0aGUgb3JpZ2luYWwuPC90ZXh0Pgo8bGluZSB4MT0iMTAiIHkxPSIyMDgiIHgyPSI0MTAiIHkyPSIyMDgiIHN0cm9rZT0iI2QxZDFkNiIvPgo8dGV4dCB4PSIxMCIgeT0iMjM2IiBmb250LXNpemU9IjE1IiBmb250LXdlaWdodD0iNzAwIj5DYWxsIGJ5IHJlZmVyZW5jZTogdGhlIHNhbWUgYXJyYXk8L3RleHQ+CjxyZWN0IHg9IjEwIiB5PSIyNTIiIHdpZHRoPSIxNjAiIGhlaWdodD0iNjIiIHJ4PSI4IiBmaWxsPSIjZWZmNmZmIiBzdHJva2U9IiMxZDRlZDgiIHN0cm9rZS13aWR0aD0iMS41Ii8+Cjx0ZXh0IHg9IjIwIiB5PSIyNzIiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiMxZDRlZDgiPk1haW4gcHJvZ3JhbTwvdGV4dD4KPHRleHQgeD0iMjAiIHk9IjMwMCI+cm93PC90ZXh0Pgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIyOTUiIHI9IjUiIGZpbGw9IiMxZDRlZDgiLz4KPHJlY3QgeD0iMjUwIiB5PSIyNTIiIHdpZHRoPSIxNjAiIGhlaWdodD0iNjIiIHJ4PSI4IiBmaWxsPSIjZmZmN2VkIiBzdHJva2U9IiNiNDUzMDkiIHN0cm9rZS13aWR0aD0iMS41Ii8+Cjx0ZXh0IHg9IjI2MCIgeT0iMjcyIiBmb250LXNpemU9IjEzIiBmaWxsPSIjYjQ1MzA5Ij5jbGVhcjwvdGV4dD4KPHRleHQgeD0iMjYwIiB5PSIzMDAiPnNlYXRzPC90ZXh0Pgo8Y2lyY2xlIGN4PSIzOTAiIGN5PSIyOTUiIHI9IjUiIGZpbGw9IiNiNDUzMDkiLz4KPHBhdGggZD0iTTE1MCAzMDAgTDE1MCAzNDAgTDE0MCAzNTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG1hcmtlci1lbmQ9InVybCgjYikiLz4KPHBhdGggZD0iTTM5MCAzMDAgTDM5MCAzNDAgTDMyMiAzNTQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2I0NTMwOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIG1hcmtlci1lbmQ9InVybCgjbykiLz4KPHJlY3QgeD0iOTAiIHk9IjM1OCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjMyIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMxYzFjMWUiLz4KPHJlY3QgeD0iMTUwIiB5PSIzNTgiIHdpZHRoPSI2MCIgaGVpZ2h0PSIzMiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMWMxYzFlIi8+CjxyZWN0IHg9IjIxMCIgeT0iMzU4IiB3aWR0aD0iNjAiIGhlaWdodD0iMzIiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzFjMWMxZSIvPgo8cmVjdCB4PSIyNzAiIHk9IjM1OCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjMyIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMxYzFjMWUiLz4KPHRleHQgeD0iMTIwIiB5PSIzNzkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTMiPmZhbHNlPC90ZXh0Pgo8dGV4dCB4PSIxODAiIHk9IjM3OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMyI+ZmFsc2U8L3RleHQ+Cjx0ZXh0IHg9IjI0MCIgeT0iMzc5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjEzIj5mYWxzZTwvdGV4dD4KPHRleHQgeD0iMzAwIiB5PSIzNzkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTMiPmZhbHNlPC90ZXh0Pgo8dGV4dCB4PSIxMCIgeT0iNDE2IiBmb250LXNpemU9IjEzIiBmaWxsPSIjNmU2ZTczIj5UaGVyZSBpcyBvbmx5IG9uZSBhcnJheS4gV2hhdCBjbGVhciBjaGFuZ2VzIHRocm91Z2ggc2VhdHMsPC90ZXh0Pgo8dGV4dCB4PSIxMCIgeT0iNDM0IiBmb250LXNpemU9IjEzIiBmaWxsPSIjNmU2ZTczIj50aGUgbWFpbiBwcm9ncmFtIHNlZXMgdW5kZXIgcm93LjwvdGV4dD4KPC9zdmc+Cg==",Eh=""+new URL("zk-zeichen-CgUEhNoK.svg",import.meta.url).href,Lh=""+new URL("ike-nassi-D2w47gvX.jpg",import.meta.url).href,Vh=""+new URL("kino-saal-CYMOok4_.svg",import.meta.url).href,Fh=""+new URL("kino-schleifen-DrTQV7dq.svg",import.meta.url).href,Rh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDkyIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDkyIiBmaWxsPSIjZmZmZmZmIi8+CiAgPGcgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiPgogICAgPCEtLSBTdGFydCAtLT4KICAgIDxyZWN0IHg9IjEwMCIgeT0iMTAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMjgiIHJ4PSIxNCIgZmlsbD0iI2QxZjJkOSIvPgogICAgPGxpbmUgeDE9IjE1MCIgeTE9IjM4IiB4Mj0iMTUwIiB5Mj0iNTQiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICAgIDwhLS0gQW53ZWlzdW5nIC0tPgogICAgPHJlY3QgeD0iNTAiIHk9IjU2IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZTVmMGZmIi8+CiAgICA8bGluZSB4MT0iMTUwIiB5MT0iODYiIHgyPSIxNTAiIHkyPSI5OCIgbWFya2VyLWVuZD0idXJsKCNhKSIvPgogICAgPCEtLSBSYXV0ZSAxIC0tPgogICAgPHBhdGggZD0iTTE1MCAxMDAgTDIzNSAxMjggTDE1MCAxNTYgTDY1IDEyOCBaIiBmaWxsPSIjZmZmNGQ2Ii8+CiAgICA8bGluZSB4MT0iMTUwIiB5MT0iMTU2IiB4Mj0iMTUwIiB5Mj0iMTcyIiBtYXJrZXItZW5kPSJ1cmwoI2EpIi8+CiAgICA8cmVjdCB4PSI1MCIgeT0iMTc0IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZTVmMGZmIi8+CiAgICA8bGluZSB4MT0iMTUwIiB5MT0iMjA0IiB4Mj0iMTUwIiB5Mj0iMjUwIiBtYXJrZXItZW5kPSJ1cmwoI2EpIi8+CiAgICA8IS0tIG5laW4tV2VnIHVtIGRlbiBLYXN0ZW4gaGVydW0gLS0+CiAgICA8cG9seWxpbmUgcG9pbnRzPSIyMzUsMTI4IDI4NSwxMjggMjg1LDIyMiAxNTAsMjIyIiBmaWxsPSJub25lIiBtYXJrZXItZW5kPSJ1cmwoI2EpIi8+CiAgICA8IS0tIFJhdXRlIDIgLS0+CiAgICA8cGF0aCBkPSJNMTUwIDI1MiBMMjM1IDI4MCBMMTUwIDMwOCBMNjUgMjgwIFoiIGZpbGw9IiNmZmY0ZDYiLz4KICAgIDxsaW5lIHgxPSIyMzUiIHkxPSIyODAiIHgyPSIyNjgiIHkyPSIyODAiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICAgIDxyZWN0IHg9IjI3MCIgeT0iMjY1IiB3aWR0aD0iMTE1IiBoZWlnaHQ9IjMwIiBmaWxsPSIjZTVmMGZmIi8+CiAgICA8IS0tIHp1csO8Y2sgenVyIFByw7xmdW5nIC0tPgogICAgPHBvbHlsaW5lIHBvaW50cz0iMzI3LDI2NSAzMjcsMjM4IDE1MCwyMzgiIGZpbGw9Im5vbmUiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICAgIDxsaW5lIHgxPSIxNTAiIHkxPSIzMDgiIHgyPSIxNTAiIHkyPSIzMjYiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICAgIDxyZWN0IHg9IjUwIiB5PSIzMjgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMzAiIGZpbGw9IiNlNWYwZmYiLz4KICAgIDxsaW5lIHgxPSIxNTAiIHkxPSIzNTgiIHgyPSIxNTAiIHkyPSIzNzQiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICAgIDwhLS0gRW5kZSAtLT4KICAgIDxyZWN0IHg9IjEwMCIgeT0iMzc2IiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjI4IiByeD0iMTQiIGZpbGw9IiNkMWYyZDkiLz4KICA8L2c+CiAgPGcgdGV4dC1hbmNob3I9Im1pZGRsZSI+CiAgICA8dGV4dCB4PSIxNTAiIHk9IjI5Ij5TdGFydDwvdGV4dD4KICAgIDx0ZXh0IHg9IjE1MCIgeT0iNzYiPlRhc3NlIGF1ZiBkZW4gVGlzY2ggc3RlbGxlbjwvdGV4dD4KICAgIDx0ZXh0IHg9IjE1MCIgeT0iMTMzIj5adWNrZXIgZ2V3w7xuc2NodD88L3RleHQ+CiAgICA8dGV4dCB4PSIxNTAiIHk9IjE5NCI+WnVja2VyIGhpbmVpbmdlYmVuPC90ZXh0PgogICAgPHRleHQgeD0iMTUwIiB5PSIyODUiPlRlZSBub2NoIHp1IGhlacOfPzwvdGV4dD4KICAgIDx0ZXh0IHg9IjMyNy41IiB5PSIyODUiPjEgTWludXRlIHdhcnRlbjwvdGV4dD4KICAgIDx0ZXh0IHg9IjE1MCIgeT0iMzQ4Ij5UZWUgdHJpbmtlbjwvdGV4dD4KICAgIDx0ZXh0IHg9IjE1MCIgeT0iMzk1Ij5FbmRlPC90ZXh0PgogIDwvZz4KICA8ZyBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iNjAwIj4KICAgIDx0ZXh0IHg9IjE1NiIgeT0iMTY4IiBmaWxsPSIjMjQ4YTNkIj5qYTwvdGV4dD4KICAgIDx0ZXh0IHg9IjI0MiIgeT0iMTIyIiBmaWxsPSIjZDcwMDE1Ij5uZWluPC90ZXh0PgogICAgPHRleHQgeD0iMjQwIiB5PSIyNzQiIGZpbGw9IiMyNDhhM2QiPmphPC90ZXh0PgogICAgPHRleHQgeD0iMTU2IiB5PSIzMjAiIGZpbGw9IiNkNzAwMTUiPm5laW48L3RleHQ+CiAgPC9nPgogIDwhLS0gTGVnZW5kZSAtLT4KICA8bGluZSB4MT0iMTAiIHkxPSI0MTgiIHgyPSIzOTAiIHkyPSI0MTgiIHN0cm9rZT0iI2QxZDFkNiIvPgogIDxnIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIxLjUiPgogICAgPHJlY3QgeD0iNDAiIHk9IjQzMCIgd2lkdGg9IjM2IiBoZWlnaHQ9IjE4IiByeD0iOSIgZmlsbD0iI2QxZjJkOSIvPgogICAgPHJlY3QgeD0iMjIwIiB5PSI0MzAiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxOCIgZmlsbD0iI2U1ZjBmZiIvPgogICAgPHBhdGggZD0iTTU4IDQ1OCBMNzYgNDY5IEw1OCA0ODAgTDQwIDQ2OSBaIiBmaWxsPSIjZmZmNGQ2Ii8+CiAgICA8cGF0aCBkPSJNMjI2IDQ2MCBMMjU2IDQ2MCBMMjUwIDQ3OCBMMjIwIDQ3OCBaIiBmaWxsPSIjZjJlNmZmIi8+CiAgPC9nPgogIDxnIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzYTNhM2MiPgogICAgPHRleHQgeD0iODYiIHk9IjQ0MyI+U3RhcnQgb2RlciBFbmRlPC90ZXh0PgogICAgPHRleHQgeD0iMjY2IiB5PSI0NDMiPkFud2Vpc3VuZzwvdGV4dD4KICAgIDx0ZXh0IHg9Ijg2IiB5PSI0NzMiPlZlcnp3ZWlndW5nPC90ZXh0PgogICAgPHRleHQgeD0iMjY2IiB5PSI0NzMiPkVpbi0gb2RlciBBdXNnYWJlPC90ZXh0PgogIDwvZz4KPC9zdmc+Cg==",Uh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMTkwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE5MCIgZmlsbD0iI2ZmZmZmZiIvPgogIDx0ZXh0IHg9IjIwIiB5PSIyNCIgZm9udC13ZWlnaHQ9IjYwMCI+V29oaW4gbGFuZGV0IGRhcyBFbGVtZW50PzwvdGV4dD4KICA8cmVjdCB4PSIyMCIgeT0iNDAiIHdpZHRoPSIxOTAiIGhlaWdodD0iMzUiIGZpbGw9IiNkYmVhZmUiLz4KICA8cmVjdCB4PSIyMCIgeT0iNzUiIHdpZHRoPSIxOTAiIGhlaWdodD0iMzUiIGZpbGw9IiNkY2ZjZTciLz4KICA8bGluZSB4MT0iMjAiIHkxPSI3NSIgeDI9IjIxMCIgeTI9Ijc1IiBzdHJva2U9IiM2ZTZlNzMiIHN0cm9rZS1kYXNoYXJyYXk9IjQgMyIvPgogIDxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjE5MCIgaGVpZ2h0PSI3MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIxMTUiIHk9IjYyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMWQ0ZWQ4Ij5vYmVyZSBIw6RsZnRlPC90ZXh0PgogIDx0ZXh0IHg9IjExNSIgeT0iOTciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxNTgwM2QiPnVudGVyZSBIw6RsZnRlPC90ZXh0PgogIDx0ZXh0IHg9IjIyNCIgeT0iNjIiPuKGkiBrb21tdCA8dHNwYW4gZm9udC13ZWlnaHQ9IjYwMCI+ZGF2b3I8L3RzcGFuPjwvdGV4dD4KICA8dGV4dCB4PSIyMjQiIHk9Ijk3Ij7ihpIga29tbXQgPHRzcGFuIGZvbnQtd2VpZ2h0PSI2MDAiPmRhaGludGVyPC90c3Bhbj48L3RleHQ+CiAgPHJlY3QgeD0iMjAiIHk9IjEzMiIgd2lkdGg9IjE5MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2ZlZjNjNyIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIxMTUiIHk9IjE1NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiI+w7g8L3RleHQ+CiAgPHRleHQgeD0iMjI0IiB5PSIxNTciPuKGkiA8dHNwYW4gZm9udC13ZWlnaHQ9IjYwMCI+ZXJzZXR6dDwvdHNwYW4+IGRlbiBQbGF0emhhbHRlcjwvdGV4dD4KPC9zdmc+Cg==",Yh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjEwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIxMCIgZmlsbD0iI2ZmZmZmZiIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJ1aS1tb25vc3BhY2UsIE1lbmxvLCBDb25zb2xhcywgbW9ub3NwYWNlIiBmb250LXNpemU9IjE2Ij5pbnQgYWx0ZXIgPSAxNDwvdGV4dD4KICA8cGF0aCBkPSJNMTMwIDcwIEwxNzAgNTAgTDMwMCA1MCBMMjYwIDcwIFoiIGZpbGw9IiNjOThhM2MiIHN0cm9rZT0iIzhhNWExZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHJlY3QgeD0iMTgwIiB5PSIzNCIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjUwIiByeD0iMyIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjNmU2ZTczIiBzdHJva2Utd2lkdGg9IjEuNSIvPgogIDx0ZXh0IHg9IjIwMiIgeT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiPjE0PC90ZXh0PgogIDxyZWN0IHg9IjEzMCIgeT0iNzAiIHdpZHRoPSIxMzAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZTliODcyIiBzdHJva2U9IiM4YTVhMWYiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxwYXRoIGQ9Ik0yNjAgNzAgTDMwMCA1MCBMMzAwIDE1MCBMMjYwIDE3MCBaIiBmaWxsPSIjZDQ5YTRjIiBzdHJva2U9IiM4YTVhMWYiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxyZWN0IHg9IjE1MCIgeT0iMTAwIiB3aWR0aD0iOTAiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiM4YTVhMWYiLz4KICA8dGV4dCB4PSIxOTUiIHk9IjEyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+YWx0ZXI8L3RleHQ+CiAgPHJlY3QgeD0iMTM4IiB5PSIxNDIiIHdpZHRoPSIzNCIgaGVpZ2h0PSIyMCIgcng9IjEwIiBmaWxsPSIjMDA3YWZmIi8+CiAgPHRleHQgeD0iMTU1IiB5PSIxNTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmZmZmYiIGZvbnQtd2VpZ2h0PSI2MDAiPmludDwvdGV4dD4KICA8ZyBzdHJva2U9IiM2ZTZlNzMiPgogICAgPGxpbmUgeDE9IjMxMCIgeTE9IjQ4IiB4Mj0iMjI2IiB5Mj0iNTIiLz4KICAgIDxsaW5lIHgxPSIzMTAiIHkxPSIxMTUiIHgyPSIyNDIiIHkyPSIxMTUiLz4KICAgIDxsaW5lIHgxPSI4MCIgeTE9IjE1MiIgeDI9IjEzNCIgeTI9IjE1MiIvPgogIDwvZz4KICA8dGV4dCB4PSIzMTYiIHk9IjUyIj5XZXJ0PC90ZXh0PgogIDx0ZXh0IHg9IjMxNiIgeT0iMTE5Ij5OYW1lPC90ZXh0PgogIDx0ZXh0IHg9IjgiIHk9IjE1NiI+RGF0ZW50eXA8L3RleHQ+CiAgPHRleHQgeD0iMjAwIiB5PSIxOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2ZTZlNzMiPsOcYmVyIGRlbiBOYW1lbiBrb21tc3QgZHUgYW4gZGVuIFdlcnQuPC90ZXh0Pgo8L3N2Zz4K",Xh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjAwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMDA3YWZmIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPGcgZm9udC1mYW1pbHk9InVpLW1vbm9zcGFjZSwgTWVubG8sIENvbnNvbGFzLCBtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjAiPgogICAgPHRleHQgeD0iNjAiIHk9IjExMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjcwMCI+cHVua3RlPC90ZXh0PgogICAgPHRleHQgeD0iMTI1IiB5PSIxMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMDdhZmYiIGZvbnQtd2VpZ2h0PSI3MDAiPj08L3RleHQ+CiAgICA8dGV4dCB4PSIyNjAiIHk9IjExMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+cHVua3RlICsgNTwvdGV4dD4KICA8L2c+CiAgPHJlY3QgeD0iMTgwIiB5PSI4NiIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzNCIgcng9IjYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzE1ODAzZCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMjYwIiB5PSIxNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxNTgwM2QiPuKRoCByZWNodHMgYXVzcmVjaG5lbjogMTAgKyA1ID0gMTU8L3RleHQ+CiAgPHBhdGggZD0iTTI1MCA4MiBDMjMwIDMwLCA5MCAzMCwgNjQgODQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwN2FmZiIgc3Ryb2tlLXdpZHRoPSIyLjUiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICA8dGV4dCB4PSIxNjAiIHk9IjM2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDA3YWZmIj7ikaEgRXJnZWJuaXMgbGlua3Mgc3BlaWNoZXJuPC90ZXh0PgogIDxyZWN0IHg9IjIwIiB5PSIxNjQiIHdpZHRoPSIzNjAiIGhlaWdodD0iMjYiIHJ4PSI2IiBmaWxsPSIjZjJmMmY3Ii8+CiAgPHRleHQgeD0iMjAwIiB5PSIxODIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPnB1bmt0ZSB2b3JoZXI6IDx0c3BhbiBmb250LXdlaWdodD0iNzAwIj4xMDwvdHNwYW4+ICAg4oaSICAgcHVua3RlIG5hY2hoZXI6IDx0c3BhbiBmb250LXdlaWdodD0iNzAwIj4xNTwvdHNwYW4+PC90ZXh0Pgo8L3N2Zz4K",Qh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjYwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjYwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPGcgc3Ryb2tlPSIjNmU2ZTczIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiPgogICAgPHBhdGggZD0iTTQwIDExMCBMNDggMTgwIEwxMDIgMTgwIEwxMTAgMTEwIi8+CiAgICA8cGF0aCBkPSJNMTY1IDExMCBMMTczIDE4MCBMMjI3IDE4MCBMMjM1IDExMCIvPgogICAgPHBhdGggZD0iTTI5MCAxMTAgTDI5OCAxODAgTDM1MiAxODAgTDM2MCAxMTAiLz4KICA8L2c+CiAgPHBhdGggZD0iTTQ0IDEzNSBMNDggMTgwIEwxMDIgMTgwIEwxMDYgMTM1IFoiIGZpbGw9IiNmZGJhNzQiLz4KICA8cGF0aCBkPSJNMjk0IDEzNSBMMjk4IDE4MCBMMzUyIDE4MCBMMzU2IDEzNSBaIiBmaWxsPSIjOTNjNWZkIi8+CiAgPHRleHQgeD0iNzUiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+bGlua3M8L3RleHQ+CiAgPHRleHQgeD0iNzUiIHk9IjIxNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+U2FmdDwvdGV4dD4KICA8dGV4dCB4PSIyMDAiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+aGlsZjwvdGV4dD4KICA8dGV4dCB4PSIyMDAiIHk9IjIxNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+bGVlcjwvdGV4dD4KICA8dGV4dCB4PSIzMjUiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+cmVjaHRzPC90ZXh0PgogIDx0ZXh0IHg9IjMyNSIgeT0iMjE3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5XYXNzZXI8L3RleHQ+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjEuOCIgbWFya2VyLWVuZD0idXJsKCNhKSI+CiAgICA8cGF0aCBkPSJNODggMTA0IEMxMTAgNzAsIDE2MCA3MCwgMTg2IDEwNCIvPgogICAgPHBhdGggZD0iTTMxOCAxMDQgQzI3MCAxNSwgMTMwIDE1LCA4MiAxMDQiLz4KICAgIDxwYXRoIGQ9Ik0yMTQgMTA0IEMyNDAgNzAsIDI5MCA3MCwgMzEyIDEwNCIvPgogIDwvZz4KICA8ZyBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIDxjaXJjbGUgY3g9IjEzNyIgY3k9IjgwIiByPSIxMSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMWMxYzFlIi8+PHRleHQgeD0iMTM3IiB5PSI4NSI+MTwvdGV4dD4KICAgIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjM4IiByPSIxMSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMWMxYzFlIi8+PHRleHQgeD0iMjAwIiB5PSI0MyI+MjwvdGV4dD4KICAgIDxjaXJjbGUgY3g9IjI2MyIgY3k9IjgwIiByPSIxMSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMWMxYzFlIi8+PHRleHQgeD0iMjYzIiB5PSI4NSI+MzwvdGV4dD4KICA8L2c+CiAgPGcgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InVpLW1vbm9zcGFjZSwgTWVubG8sIENvbnNvbGFzLCBtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTIiPgogICAgPHRleHQgeD0iNzAiIHk9IjI0NyI+MTogaGlsZiA9IGxpbmtzPC90ZXh0PgogICAgPHRleHQgeD0iMjAwIiB5PSIyNDciPjI6IGxpbmtzID0gcmVjaHRzPC90ZXh0PgogICAgPHRleHQgeD0iMzMwIiB5PSIyNDciPjM6IHJlY2h0cyA9IGhpbGY8L3RleHQ+CiAgPC9nPgo8L3N2Zz4K",Jh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMTUwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2ZmZmZmZiIvPgogIDxyZWN0IHg9IjIwIiB5PSI1MCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjZmVlMmUyIi8+PHJlY3QgeD0iMzEwIiB5PSI1MCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjZmVlMmUyIi8+CiAgPHJlY3QgeD0iOTAiIHk9IjUwIiB3aWR0aD0iMjIwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjZGNmY2U3Ii8+CiAgPGxpbmUgeDE9IjIwIiB5MT0iNzQiIHgyPSIzODAiIHkyPSI3NCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8bGluZSB4MT0iNDYiIHkxPSI2OCIgeDI9IjQ2IiB5Mj0iODAiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNDYiIHk9Ijk4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4wPC90ZXh0PgogIDxsaW5lIHgxPSI5MCIgeTE9IjY4IiB4Mj0iOTAiIHkyPSI4MCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI5MCIgeT0iOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjE8L3RleHQ+CiAgPGxpbmUgeDE9IjEzNCIgeTE9IjY4IiB4Mj0iMTM0IiB5Mj0iODAiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMTM0IiB5PSI5OCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MjwvdGV4dD4KICA8bGluZSB4MT0iMTc4IiB5MT0iNjgiIHgyPSIxNzgiIHkyPSI4MCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxNzgiIHk9Ijk4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4zPC90ZXh0PgogIDxsaW5lIHgxPSIyMjIiIHkxPSI2OCIgeDI9IjIyMiIgeTI9IjgwIiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjIyMiIgeT0iOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjQ8L3RleHQ+CiAgPGxpbmUgeDE9IjI2NiIgeTE9IjY4IiB4Mj0iMjY2IiB5Mj0iODAiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMjY2IiB5PSI5OCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+NTwvdGV4dD4KICA8bGluZSB4MT0iMzEwIiB5MT0iNjgiIHgyPSIzMTAiIHkyPSI4MCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIzMTAiIHk9Ijk4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj42PC90ZXh0PgogIDxsaW5lIHgxPSIzNTQiIHkxPSI2OCIgeDI9IjM1NCIgeTI9IjgwIiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjM1NCIgeT0iOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjc8L3RleHQ+CiAgPGNpcmNsZSBjeD0iOTAiIGN5PSI3NCIgcj0iNiIgZmlsbD0iIzE1ODAzZCIvPjxjaXJjbGUgY3g9IjMxMCIgY3k9Ijc0IiByPSI2IiBmaWxsPSIjMTU4MDNkIi8+CiAgPHRleHQgeD0iMjAwIiB5PSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzE1ODAzZCIgZm9udC13ZWlnaHQ9IjYwMCI+Z8O8bHRpZzwvdGV4dD4KICA8dGV4dCB4PSI0MCIgeT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNiOTFjMWMiIGZvbnQtd2VpZ2h0PSI2MDAiPnVuZ8O8bHRpZzwvdGV4dD48dGV4dCB4PSIzNjAiIHk9IjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYjkxYzFjIiBmb250LXdlaWdodD0iNjAwIj51bmfDvGx0aWc8L3RleHQ+CiAgPGcgZm9udC1mYW1pbHk9InVpLW1vbm9zcGFjZSwgTWVubG8sIENvbnNvbGFzLCBtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPgogICAgPHRleHQgeD0iMjAwIiB5PSIxMjQiIGZpbGw9IiMxNTgwM2QiPm5vdGUgJmd0Oz0gMSAmYW1wOyZhbXA7IG5vdGUgJmx0Oz0gNjwvdGV4dD4KICAgIDx0ZXh0IHg9IjIwMCIgeT0iMTQyIiBmaWxsPSIjYjkxYzFjIj5ub3RlICZsdDsgMSB8fCBub3RlICZndDsgNjwvdGV4dD4KICA8L2c+Cjwvc3ZnPgo=",Oh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjMwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjMwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHRleHQgeD0iMjAiIHk9IjI0IiBmb250LXdlaWdodD0iNjAwIj5BYmxhdWYgZGVyIFdoaWxlLVNjaGxlaWZlPC90ZXh0PgogIDxyZWN0IHg9IjEyMCIgeT0iNDQiIHdpZHRoPSIxNjAiIGhlaWdodD0iNDAiIHJ4PSIyMCIgZmlsbD0iI2ZlZjNjNyIgc3Ryb2tlPSIjYjQ1MzA5IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjY5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ikaAgQmVkaW5ndW5nIHByw7xmZW48L3RleHQ+CiAgPHJlY3QgeD0iMTIwIiB5PSIxMjgiIHdpZHRoPSIxNjAiIGhlaWdodD0iNDAiIHJ4PSI2IiBmaWxsPSIjZGJlYWZlIiBzdHJva2U9IiMxZDRlZDgiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTUzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ikaEgSW5oYWx0IGF1c2bDvGhyZW48L3RleHQ+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjEuOCIgbWFya2VyLWVuZD0idXJsKCNhKSI+CiAgICA8bGluZSB4MT0iMjAwIiB5MT0iODQiIHgyPSIyMDAiIHkyPSIxMjYiLz4KICAgIDxwYXRoIGQ9Ik0xMjAgMTQ4IEM4MCAxNDgsIDgwIDY0LCAxMTggNjQiLz4KICAgIDxwYXRoIGQ9Ik0yODAgNjQgTDM0MCA2NCBMMzQwIDIwMCBMMjgyIDIwMCIvPgogIDwvZz4KICA8dGV4dCB4PSIyMDgiIHk9IjExMCIgZmlsbD0iIzE1ODAzZCIgZm9udC13ZWlnaHQ9IjYwMCI+dHJ1ZTwvdGV4dD4KICA8dGV4dCB4PSIzOCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj53aWVkZXI8L3RleHQ+CiAgPHRleHQgeD0iMzgiIHk9IjEyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+bmFjaCBvYmVuPC90ZXh0PgogIDx0ZXh0IHg9IjM0OCIgeT0iMTM0IiBmaWxsPSIjYjkxYzFjIiBmb250LXdlaWdodD0iNjAwIj5mYWxzZTwvdGV4dD4KICA8dGV4dCB4PSIyNzYiIHk9IjIwNSIgdGV4dC1hbmNob3I9ImVuZCI+d2VpdGVyIHVudGVyIGRlciBTY2hsZWlmZTwvdGV4dD4KPC9zdmc+Cg==",$h="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjMwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjMwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHRleHQgeD0iMTAwIiB5PSIyMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+a29wZmdlc3RldWVydCAoV2hpbGUpPC90ZXh0PgogIDx0ZXh0IHg9IjMwMCIgeT0iMjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSI2MDAiPmZ1w59nZXN0ZXVlcnQgKERvLXdoaWxlKTwvdGV4dD4KICA8bGluZSB4MT0iMjAwIiB5MT0iMTAiIHgyPSIyMDAiIHkyPSIyMjAiIHN0cm9rZT0iI2QxZDFkNiIvPgogIDxyZWN0IHg9IjM1IiB5PSI0NCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjE4IiBmaWxsPSIjZmVmM2M3IiBzdHJva2U9IiNiNDUzMDkiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKRoCBCZWRpbmd1bmc8L3RleHQ+CiAgPHJlY3QgeD0iMzUiIHk9IjEyNCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjYiIGZpbGw9IiNkYmVhZmUiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMTAwIiB5PSIxNDciIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKRoSBJbmhhbHQ8L3RleHQ+CiAgPHJlY3QgeD0iMjM1IiB5PSI0NCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjYiIGZpbGw9IiNkYmVhZmUiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMzAwIiB5PSI2NyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGgIEluaGFsdDwvdGV4dD4KICA8cmVjdCB4PSIyMzUiIHk9IjEyNCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjE4IiBmaWxsPSIjZmVmM2M3IiBzdHJva2U9IiNiNDUzMDkiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjMwMCIgeT0iMTQ3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ikaEgQmVkaW5ndW5nPC90ZXh0PgogIDxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIxLjYiIG1hcmtlci1lbmQ9InVybCgjYSkiPgogICAgPGxpbmUgeDE9IjEwMCIgeTE9IjgwIiB4Mj0iMTAwIiB5Mj0iMTIyIi8+CiAgICA8cGF0aCBkPSJNMzUgMTQyIEM4IDE0MiwgOCA2MiwgMzMgNjIiLz4KICAgIDxsaW5lIHgxPSIzMDAiIHkxPSI4MCIgeDI9IjMwMCIgeTI9IjEyMiIvPgogICAgPHBhdGggZD0iTTM2NSAxNDIgQzM5MiAxNDIsIDM5MiA2MiwgMzY3IDYyIi8+CiAgPC9nPgogIDx0ZXh0IHg9IjEwNiIgeT0iMTA2IiBmaWxsPSIjMTU4MDNkIiBmb250LXdlaWdodD0iNjAwIj50cnVlPC90ZXh0PgogIDx0ZXh0IHg9IjM4MCIgeT0iMTA2IiB0ZXh0LWFuY2hvcj0iZW5kIiBmaWxsPSIjMTU4MDNkIiBmb250LXdlaWdodD0iNjAwIj50cnVlPC90ZXh0PgogIDx0ZXh0IHg9IjEwMCIgeT0iMTkwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5Jc3QgZGllIEJlZGluZ3VuZyBnbGVpY2ggZmFsc2UsPC90ZXh0PgogIDx0ZXh0IHg9IjEwMCIgeT0iMjA2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5sw6R1ZnQgZGVyIEluaGFsdCA8dHNwYW4gZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFjMWMxZSI+bmllPC90c3Bhbj4uPC90ZXh0PgogIDx0ZXh0IHg9IjMwMCIgeT0iMTkwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5EZXIgSW5oYWx0IGzDpHVmdCBpbW1lcjwvdGV4dD4KICA8dGV4dCB4PSIzMDAiIHk9IjIwNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+PHRzcGFuIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiMxYzFjMWUiPm1pbmRlc3RlbnMgZWlubWFsPC90c3Bhbj4uPC90ZXh0Pgo8L3N2Zz4K",Kh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjUwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHJlY3QgeD0iMTIwIiB5PSIxNCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzNCIgcng9IjYiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzZlNmU3MyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMjAwIiB5PSIzNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGgIFN0YXJ0IDx0c3BhbiBmaWxsPSIjNmU2ZTczIj4obnVyIGVpbm1hbCk8L3RzcGFuPjwvdGV4dD4KICA8cmVjdCB4PSIxMjAiIHk9Ijc2IiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjM0IiByeD0iMTciIGZpbGw9IiNmZWYzYzciIHN0cm9rZT0iI2I0NTMwOSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMjAwIiB5PSI5OCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGhIEJlZGluZ3VuZyBwcsO8ZmVuPC90ZXh0PgogIDxyZWN0IHg9IjEyMCIgeT0iMTM4IiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjM0IiByeD0iNiIgZmlsbD0iI2RiZWFmZSIgc3Ryb2tlPSIjMWQ0ZWQ4IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjE2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGiIEluaGFsdCBhdXNmw7xocmVuPC90ZXh0PgogIDxyZWN0IHg9IjEyMCIgeT0iMjAwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjM0IiByeD0iNiIgZmlsbD0iI2RjZmNlNyIgc3Ryb2tlPSIjMTU4MDNkIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjIyMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGjIFNjaHJpdHQsIHouIEIuIGkrKzwvdGV4dD4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMS44IiBtYXJrZXItZW5kPSJ1cmwoI2EpIj4KICAgIDxsaW5lIHgxPSIyMDAiIHkxPSI0OCIgeDI9IjIwMCIgeTI9Ijc0Ii8+CiAgICA8bGluZSB4MT0iMjAwIiB5MT0iMTEwIiB4Mj0iMjAwIiB5Mj0iMTM2Ii8+CiAgICA8bGluZSB4MT0iMjAwIiB5MT0iMTcyIiB4Mj0iMjAwIiB5Mj0iMTk4Ii8+CiAgICA8cGF0aCBkPSJNMTIwIDIxNyBDNjAgMjE3LCA2MCA5MywgMTE4IDkzIi8+CiAgICA8cGF0aCBkPSJNMjgwIDkzIEwzMzAgOTMiLz4KICA8L2c+CiAgPHRleHQgeD0iMjA4IiB5PSIxMjkiIGZpbGw9IiMxNTgwM2QiIGZvbnQtd2VpZ2h0PSI2MDAiPnRydWU8L3RleHQ+CiAgPHRleHQgeD0iNDgiIHk9IjE2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+enVyw7xjazwvdGV4dD4KICA8dGV4dCB4PSI0OCIgeT0iMTc2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj56dSDikaE8L3RleHQ+CiAgPHRleHQgeD0iMzAwIiB5PSI4NCIgZmlsbD0iI2I5MWMxYyIgZm9udC13ZWlnaHQ9IjYwMCI+ZmFsc2U8L3RleHQ+CiAgPHRleHQgeD0iMzM2IiB5PSI5OCI+ZmVydGlnPC90ZXh0Pgo8L3N2Zz4K",qh="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMTkwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMDA3YWZmIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMTkwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHRleHQgeD0iMjAiIHk9IjI0IiBmb250LWZhbWlseT0idWktbW9ub3NwYWNlLCBNZW5sbywgQ29uc29sYXMsIG1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCI+aW50W10gemFobGVuID0gezIsIDQsIDYsIDgsIDEwfTwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iNTQiIGZpbGw9IiM2ZTZlNzMiIGZvbnQtc2l6ZT0iMTIiPkluZGV4PC90ZXh0PgogIDx0ZXh0IHg9IjkwIiB5PSI1NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwN2FmZiIgZm9udC13ZWlnaHQ9IjcwMCI+MDwvdGV4dD48cmVjdCB4PSI2MCIgeT0iNjIiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0NiIgZmlsbD0iI2YyZjJmNyIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI5MCIgeT0iOTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI2MDAiPjI8L3RleHQ+CiAgPHRleHQgeD0iMTUwIiB5PSI1NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwN2FmZiIgZm9udC13ZWlnaHQ9IjcwMCI+MTwvdGV4dD48cmVjdCB4PSIxMjAiIHk9IjYyIiB3aWR0aD0iNjAiIGhlaWdodD0iNDYiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMTUwIiB5PSI5MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9IjYwMCI+NDwvdGV4dD4KICA8dGV4dCB4PSIyMTAiIHk9IjU0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDA3YWZmIiBmb250LXdlaWdodD0iNzAwIj4yPC90ZXh0PjxyZWN0IHg9IjE4MCIgeT0iNjIiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0NiIgZmlsbD0iI2YyZjJmNyIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIyMTAiIHk9IjkyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iNjAwIj42PC90ZXh0PgogIDx0ZXh0IHg9IjI3MCIgeT0iNTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMDdhZmYiIGZvbnQtd2VpZ2h0PSI3MDAiPjM8L3RleHQ+PHJlY3QgeD0iMjQwIiB5PSI2MiIgd2lkdGg9IjYwIiBoZWlnaHQ9IjQ2IiBmaWxsPSIjZjJmMmY3IiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjI3MCIgeT0iOTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI2MDAiPjg8L3RleHQ+CiAgPHRleHQgeD0iMzMwIiB5PSI1NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwN2FmZiIgZm9udC13ZWlnaHQ9IjcwMCI+NDwvdGV4dD48cmVjdCB4PSIzMDAiIHk9IjYyIiB3aWR0aD0iNjAiIGhlaWdodD0iNDYiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMzMwIiB5PSI5MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9IjYwMCI+MTA8L3RleHQ+CiAgPHRleHQgeD0iMjAiIHk9IjkwIiBmaWxsPSIjNmU2ZTczIiBmb250LXNpemU9IjEyIj5XZXJ0PC90ZXh0PgogIDxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwN2FmZiIgc3Ryb2tlLXdpZHRoPSIxLjgiIG1hcmtlci1lbmQ9InVybCgjYSkiPjxsaW5lIHgxPSI5MCIgeTE9IjE0MCIgeDI9IjkwIiB5Mj0iMTEyIi8+PGxpbmUgeDE9IjMzMCIgeTE9IjE0MCIgeDI9IjMzMCIgeTI9IjExMiIvPjwvZz4KICA8ZyBmb250LWZhbWlseT0idWktbW9ub3NwYWNlLCBNZW5sbywgQ29uc29sYXMsIG1vbm9zcGFjZSIgZm9udC1zaXplPSIxMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+PHRleHQgeD0iOTAiIHk9IjE1NiI+emFobGVuWzBdIGlzdCAyPC90ZXh0Pjx0ZXh0IHg9IjMzMCIgeT0iMTU2Ij56YWhsZW5bNF0gaXN0IDEwPC90ZXh0PjwvZz4KICA8dGV4dCB4PSIyMDAiIHk9IjE4MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+NSBGw6RjaGVyLCBnZXrDpGhsdCB3aXJkIGFiIDA6IGRlciBsZXR6dGUgSW5kZXggaXN0IDQuPC90ZXh0Pgo8L3N2Zz4K",em=""+new URL("schiffe-versenken-CXt1SF0S.svg",import.meta.url).href,tm=""+new URL("ss-binaere-suche-CPsLGldq.svg",import.meta.url).href,nm=""+new URL("ss-bubblesort-Dic2ZfaT.svg",import.meta.url).href,im="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDQgMTk2IiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjMWMxYzFlIj4KPHJlY3Qgd2lkdGg9IjQwNCIgaGVpZ2h0PSIxOTYiIGZpbGw9IiNmZmZmZmYiLz4KPHRleHQgeD0iMTQiIHk9IjI0IiBmb250LXdlaWdodD0iNjAwIiBmb250LXNpemU9IjE1Ij5HZXN1Y2h0OiBkaWUgOS4gRGllIEthcnRlbiBzaW5kIGdlbWlzY2h0LjwvdGV4dD4KPGc+PHJlY3QgeD0iMTQiIHk9IjUwIiB3aWR0aD0iNDAiIGhlaWdodD0iNTYiIHJ4PSI1IiBmaWxsPSIjZjJmMmY3IiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMSIvPjx0ZXh0IHg9IjM0LjAiIHk9Ijc1LjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNkYzI2MjYiPjc8L3RleHQ+PHRleHQgeD0iMzQuMCIgeT0iOTUuOTE5OTk5OTk5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTUiIGZpbGw9IiNkYzI2MjYiPuKZpTwvdGV4dD48L2c+Cjx0ZXh0IHg9IjM0LjAiIHk9IjEzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0iI2RjMjYyNiI+4pyXPC90ZXh0Pgo8dGV4dCB4PSIzNC4wIiB5PSIxNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiM2ZTZlNzMiPjEuPC90ZXh0Pgo8Zz48cmVjdCB4PSI2MiIgeT0iNTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI1NiIgcng9IjUiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHRleHQgeD0iODIuMCIgeT0iNzUuMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFjMWMxZSI+MzwvdGV4dD48dGV4dCB4PSI4Mi4wIiB5PSI5NS45MTk5OTk5OTk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNSIgZmlsbD0iIzFjMWMxZSI+4pmgPC90ZXh0PjwvZz4KPHRleHQgeD0iODIuMCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjZGMyNjI2Ij7inJc8L3RleHQ+Cjx0ZXh0IHg9IjgyLjAiIHk9IjE0OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZlNmU3MyI+Mi48L3RleHQ+CjxnPjxyZWN0IHg9IjExMCIgeT0iNTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI1NiIgcng9IjUiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHRleHQgeD0iMTMwLjAiIHk9Ijc1LjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNkYzI2MjYiPjEwPC90ZXh0Pjx0ZXh0IHg9IjEzMC4wIiB5PSI5NS45MTk5OTk5OTk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNSIgZmlsbD0iI2RjMjYyNiI+4pmmPC90ZXh0PjwvZz4KPHRleHQgeD0iMTMwLjAiIHk9IjEzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0iI2RjMjYyNiI+4pyXPC90ZXh0Pgo8dGV4dCB4PSIxMzAuMCIgeT0iMTQ4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjEzIiBmaWxsPSIjNmU2ZTczIj4zLjwvdGV4dD4KPGc+PHJlY3QgeD0iMTU4IiB5PSI1MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjU2IiByeD0iNSIgZmlsbD0iI2YyZjJmNyIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSIxNzguMCIgeT0iNzUuMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFjMWMxZSI+NTwvdGV4dD48dGV4dCB4PSIxNzguMCIgeT0iOTUuOTE5OTk5OTk5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTUiIGZpbGw9IiMxYzFjMWUiPuKZozwvdGV4dD48L2c+Cjx0ZXh0IHg9IjE3OC4wIiB5PSIxMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiNkYzI2MjYiPuKclzwvdGV4dD4KPHRleHQgeD0iMTc4LjAiIHk9IjE0OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZlNmU3MyI+NC48L3RleHQ+CjxnPjxyZWN0IHg9IjIwNiIgeT0iNTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI1NiIgcng9IjUiIGZpbGw9IiNkY2ZjZTciIHN0cm9rZT0iIzE1ODAzZCIgc3Ryb2tlLXdpZHRoPSIzIi8+PHRleHQgeD0iMjI2LjAiIHk9Ijc1LjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiMxYzFjMWUiPjk8L3RleHQ+PHRleHQgeD0iMjI2LjAiIHk9Ijk1LjkxOTk5OTk5OTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE1IiBmaWxsPSIjMWMxYzFlIj7imaA8L3RleHQ+PC9nPgo8dGV4dCB4PSIyMjYuMCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjMTU4MDNkIj7inJM8L3RleHQ+Cjx0ZXh0IHg9IjIyNi4wIiB5PSIxNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiM2ZTZlNzMiPjUuPC90ZXh0Pgo8Zz48cmVjdCB4PSIyNTQiIHk9IjUwIiB3aWR0aD0iNDAiIGhlaWdodD0iNTYiIHJ4PSI1IiBmaWxsPSIjMWQ0ZWQ4IiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMSIvPjxyZWN0IHg9IjI1OCIgeT0iNTQiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0OCIgcng9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzkzYzVmZCIgc3Ryb2tlLXdpZHRoPSIxLjIiIHN0cm9rZS1kYXNoYXJyYXk9IjMgMiIvPjwvZz4KPGc+PHJlY3QgeD0iMzAyIiB5PSI1MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjU2IiByeD0iNSIgZmlsbD0iIzFkNGVkOCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSIzMDYiIHk9IjU0IiB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHJ4PSIzIiBmaWxsPSJub25lIiBzdHJva2U9IiM5M2M1ZmQiIHN0cm9rZS13aWR0aD0iMS4yIiBzdHJva2UtZGFzaGFycmF5PSIzIDIiLz48L2c+CjxnPjxyZWN0IHg9IjM1MCIgeT0iNTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI1NiIgcng9IjUiIGZpbGw9IiMxZDRlZDgiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHJlY3QgeD0iMzU0IiB5PSI1NCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjQ4IiByeD0iMyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTNjNWZkIiBzdHJva2Utd2lkdGg9IjEuMiIgc3Ryb2tlLWRhc2hhcnJheT0iMyAyIi8+PC9nPgo8dGV4dCB4PSIxNCIgeT0iMTY4IiBmb250LXNpemU9IjE1IiBmaWxsPSIjNmU2ZTczIj5Wb24gbGlua3MgbmFjaCByZWNodHMgdW1kcmVoZW46PC90ZXh0Pjx0ZXh0IHg9IjE0IiB5PSIxODgiIGZvbnQtc2l6ZT0iMTUiIGZpbGw9IiM2ZTZlNzMiPk5hY2ggNSBWZXJnbGVpY2hlbiBpc3QgZGllIDkgZ2VmdW5kZW4uPC90ZXh0Pgo8L3N2Zz4K",sm=""+new URL("ss-vergleiche-DRqzU2TZ.svg",import.meta.url).href,rm="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MjAgNDUwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KPGRlZnM+PG1hcmtlciBpZD0iayIgdmlld0JveD0iMCAwIDEwIDEwIiByZWZYPSI5IiByZWZZPSI1IiBtYXJrZXJXaWR0aD0iNiIgbWFya2VySGVpZ2h0PSI2IiBvcmllbnQ9ImF1dG8iPjxwYXRoIGQ9Ik0wIDAgTDEwIDUgTDAgMTAgWiIgZmlsbD0iIzFjMWMxZSIvPjwvbWFya2VyPjxtYXJrZXIgaWQ9ImIiIHZpZXdCb3g9IjAgMCAxMCAxMCIgcmVmWD0iOSIgcmVmWT0iNSIgbWFya2VyV2lkdGg9IjYiIG1hcmtlckhlaWdodD0iNiIgb3JpZW50PSJhdXRvIj48cGF0aCBkPSJNMCAwIEwxMCA1IEwwIDEwIFoiIGZpbGw9IiMxZDRlZDgiLz48L21hcmtlcj48bWFya2VyIGlkPSJvIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI2IiBtYXJrZXJIZWlnaHQ9IjYiIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjYjQ1MzA5Ii8+PC9tYXJrZXI+PC9kZWZzPgo8cmVjdCB3aWR0aD0iNDIwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iI2ZmZmZmZiIvPgo8dGV4dCB4PSIxMCIgeT0iMjIiIGZvbnQtc2l6ZT0iMTUiIGZvbnQtd2VpZ2h0PSI3MDAiPldlcnTDvGJlcmdhYmU6IGVpbmUgS29waWU8L3RleHQ+CjxyZWN0IHg9IjEwIiB5PSIzOCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI4NiIgcng9IjgiIGZpbGw9IiNlZmY2ZmYiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHRleHQgeD0iMjAiIHk9IjU4IiBmb250LXNpemU9IjEzIiBmaWxsPSIjMWQ0ZWQ4Ij5IYXVwdHByb2dyYW1tPC90ZXh0Pgo8dGV4dCB4PSIyMCIgeT0iOTgiPnphaGw8L3RleHQ+CjxyZWN0IHg9IjcwIiB5PSI3OCIgd2lkdGg9IjU2IiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMWMxYzFlIi8+Cjx0ZXh0IHg9Ijk4IiB5PSI5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjcwMCI+NTwvdGV4dD4KPHJlY3QgeD0iMjUwIiB5PSIzOCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI4NiIgcng9IjgiIGZpbGw9IiNmZmY3ZWQiIHN0cm9rZT0iI2I0NTMwOSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHRleHQgeD0iMjYwIiB5PSI1OCIgZm9udC1zaXplPSIxMyIgZmlsbD0iI2I0NTMwOSI+dmVyZG9wcGxlPC90ZXh0Pgo8dGV4dCB4PSIyNjAiIHk9Ijk4Ij54PC90ZXh0Pgo8cmVjdCB4PSIyODAiIHk9Ijc4IiB3aWR0aD0iODAiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMxYzFjMWUiLz4KPHRleHQgeD0iMzIwIiB5PSI5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+PHRzcGFuIGZpbGw9IiM2ZTZlNzMiIHRleHQtZGVjb3JhdGlvbj0ibGluZS10aHJvdWdoIj41PC90c3Bhbj4gPHRzcGFuIGZvbnQtd2VpZ2h0PSI3MDAiPjEwPC90c3Bhbj48L3RleHQ+CjxsaW5lIHgxPSIxMjgiIHkxPSI5MyIgeDI9IjI0OCIgeTI9IjkzIiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSI1IDQiIG1hcmtlci1lbmQ9InVybCgjaykiLz4KPHRleHQgeD0iMjEwIiB5PSI4NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMyI+S29waWU8L3RleHQ+Cjx0ZXh0IHg9IjEwIiB5PSIxNTAiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiM2ZTZlNzMiPnggd2lyZCAxMCwgYWJlciB6YWhsIGJsZWlidCA1LjwvdGV4dD4KPHRleHQgeD0iMTAiIHk9IjE2OCIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZlNmU3MyI+V2llIGJlaSBlaW5lciBGb3Rva29waWU6IFdlciBhdWYgZGVyIEtvcGllIHNjaHJlaWJ0LDwvdGV4dD4KPHRleHQgeD0iMTAiIHk9IjE4NiIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZlNmU3MyI+w6RuZGVydCBkYXMgT3JpZ2luYWwgbmljaHQuPC90ZXh0Pgo8bGluZSB4MT0iMTAiIHkxPSIyMDgiIHgyPSI0MTAiIHkyPSIyMDgiIHN0cm9rZT0iI2QxZDFkNiIvPgo8dGV4dCB4PSIxMCIgeT0iMjM2IiBmb250LXNpemU9IjE1IiBmb250LXdlaWdodD0iNzAwIj5SZWZlcmVuesO8YmVyZ2FiZTogZGFzc2VsYmUgQXJyYXk8L3RleHQ+CjxyZWN0IHg9IjEwIiB5PSIyNTIiIHdpZHRoPSIxNjAiIGhlaWdodD0iNjIiIHJ4PSI4IiBmaWxsPSIjZWZmNmZmIiBzdHJva2U9IiMxZDRlZDgiIHN0cm9rZS13aWR0aD0iMS41Ii8+Cjx0ZXh0IHg9IjIwIiB5PSIyNzIiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiMxZDRlZDgiPkhhdXB0cHJvZ3JhbW08L3RleHQ+Cjx0ZXh0IHg9IjIwIiB5PSIzMDAiPnJlaWhlPC90ZXh0Pgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIyOTUiIHI9IjUiIGZpbGw9IiMxZDRlZDgiLz4KPHJlY3QgeD0iMjUwIiB5PSIyNTIiIHdpZHRoPSIxNjAiIGhlaWdodD0iNjIiIHJ4PSI4IiBmaWxsPSIjZmZmN2VkIiBzdHJva2U9IiNiNDUzMDkiIHN0cm9rZS13aWR0aD0iMS41Ii8+Cjx0ZXh0IHg9IjI2MCIgeT0iMjcyIiBmb250LXNpemU9IjEzIiBmaWxsPSIjYjQ1MzA5Ij5sZWVyZW48L3RleHQ+Cjx0ZXh0IHg9IjI2MCIgeT0iMzAwIj5wbGFldHplPC90ZXh0Pgo8Y2lyY2xlIGN4PSIzOTAiIGN5PSIyOTUiIHI9IjUiIGZpbGw9IiNiNDUzMDkiLz4KPHBhdGggZD0iTTE1MCAzMDAgTDE1MCAzNDAgTDE0MCAzNTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG1hcmtlci1lbmQ9InVybCgjYikiLz4KPHBhdGggZD0iTTM5MCAzMDAgTDM5MCAzNDAgTDMyMiAzNTQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2I0NTMwOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIG1hcmtlci1lbmQ9InVybCgjbykiLz4KPHJlY3QgeD0iOTAiIHk9IjM1OCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjMyIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMxYzFjMWUiLz4KPHJlY3QgeD0iMTUwIiB5PSIzNTgiIHdpZHRoPSI2MCIgaGVpZ2h0PSIzMiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMWMxYzFlIi8+CjxyZWN0IHg9IjIxMCIgeT0iMzU4IiB3aWR0aD0iNjAiIGhlaWdodD0iMzIiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzFjMWMxZSIvPgo8cmVjdCB4PSIyNzAiIHk9IjM1OCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjMyIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMxYzFjMWUiLz4KPHRleHQgeD0iMTIwIiB5PSIzNzkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTMiPmZhbHNlPC90ZXh0Pgo8dGV4dCB4PSIxODAiIHk9IjM3OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMyI+ZmFsc2U8L3RleHQ+Cjx0ZXh0IHg9IjI0MCIgeT0iMzc5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjEzIj5mYWxzZTwvdGV4dD4KPHRleHQgeD0iMzAwIiB5PSIzNzkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTMiPmZhbHNlPC90ZXh0Pgo8dGV4dCB4PSIxMCIgeT0iNDE2IiBmb250LXNpemU9IjEzIiBmaWxsPSIjNmU2ZTczIj5FcyBnaWJ0IG51ciBlaW4gQXJyYXkuIFdhcyBsZWVyZW4gw7xiZXIgcGxhZXR6ZSDDpG5kZXJ0LDwvdGV4dD4KPHRleHQgeD0iMTAiIHk9IjQzNCIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZlNmU3MyI+c2llaHQgZGFzIEhhdXB0cHJvZ3JhbW0gdW50ZXIgcmVpaGUuPC90ZXh0Pgo8L3N2Zz4K",am=""+new URL("zk-zeichen-vYvc3iJg.svg",import.meta.url).href;function lm(i){const e=[];for(const t of i.replace(/\r\n/g,`
`).split(`
`)){const n=/^###\s+(.+)$/.exec(t),s=e.at(-1);if(n){const r=n[1].trim();e.push({term:r,forms:[r],text:""})}else s&&/^(auch|also):/i.test(t)?s.forms.push(...t.replace(/^(auch|also):/i,"").split(",").map(r=>r.trim()).filter(Boolean)):s&&t.trim()!==""&&(s.text=(s.text+" "+t.trim()).trim())}return e.filter(t=>t.text!=="")}const om=i=>i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");function Ln(i){const e=i.flatMap(t=>t.forms).sort((t,n)=>n.length-t.length);if(e.length!==0)return new RegExp(`(?<![\\p{L}\\p{N}_-])(?:${e.map(om).join("|")})(?![\\p{L}\\p{N}_-])`,"u")}function Vn(i,e){return i.find(t=>t.forms.includes(e))}class V extends Error{}function J1(i,e){const t=/^---\n([\s\S]*?)\n---\n?/.exec(i.replace(/\r\n/g,`
`));if(!t)throw new V(`${e}: Kopfzeilen (--- … ---) fehlen.`);const n=new Map;for(const s of t[1].split(`
`)){const r=/^([a-zäöüß]+):\s*(.*)$/i.exec(s.trim());r&&n.set(r[1].toLowerCase(),r[2].trim())}return{meta:n,body:i.replace(/\r\n/g,`
`).slice(t[0].length)}}function um(i,e){const t=i.split(/\s*(?:->|→)\s*/);if(t.length!==2)throw new V(`${e}: Test „${i}“ braucht genau ein „->“.`);const n=(s,r)=>s.trim()===""||s.trim()==="-"?[]:s.split(r).map(a=>a.trim());return{inputs:n(t[0],/\s*,\s*/),expected:n(t[1],/\s*\|\s*/)}}function hm(i,e,t){const n={id:i,title:"",task:"",tests:[],requires:[],hints:[],subprograms:[]};let s;for(const r of e){const a=/^(titel|auftrag|start|test|braucht|tipp|lösung|loesung|unterprogramm):\s*(.*)$/i.exec(r.trim());if(a){const[,l,o]=a;switch(s=void 0,l.toLowerCase()){case"titel":n.title=o;break;case"auftrag":n.task=o,s="task";break;case"start":n.start=o;break;case"test":n.tests.push(um(o,t));break;case"braucht":n.requires.push(...o.split(/\s*,\s*/).filter(Boolean));break;case"tipp":n.hints.push(o),s="hint";break;case"lösung":case"loesung":n.solution=o;break;case"unterprogramm":n.subprograms.push(...o.split(/\s*,\s*/).filter(Boolean));break}}else s&&r.trim()!==""?s==="task"?n.task+=`
`+r.trim():n.hints[n.hints.length-1]+=`
`+r.trim():r.trim()===""&&s==="task"&&(n.task+=`
`)}if(!n.title)throw new V(`${t}: Übung „${i}“ hat keinen Titel.`);if(!n.task.trim())throw new V(`${t}: Übung „${i}“ hat keinen Auftrag.`);return n.task=n.task.trim(),n}function mm(i,e){const t=[];for(const n of i){const s=n.trim();if(s.startsWith("?"))t.push({question:s.slice(1).trim(),options:[]});else if(/^- \[[ xX]\]/.test(s)){const r=t.at(-1);if(!r)throw new V(`${e}: Antwort ohne Frage im Quiz.`);r.options.push({text:s.slice(5).trim(),correct:s[3].toLowerCase()==="x"})}else if(s.startsWith("= ")){const r=t.at(-1),a=/^=\s+(.+?)\s+->\s+(.+)$/.exec(s);if(!r||!a)throw new V(`${e}: Zuordnung „${s}“ braucht die Form „= links -> rechts“ nach einer Frage.`);(r.pairs??(r.pairs=[])).push({left:a[1].trim(),right:a[2].trim()})}else if(s.startsWith(">")){const r=t.at(-1);r&&(r.explanation=((r.explanation?r.explanation+" ":"")+s.slice(1).trim()).trim())}}for(const n of t){if(n.pairs){const s=new Set(n.pairs.map(r=>r.right));if(n.options.length>0||n.pairs.length<2||s.size!==n.pairs.length)throw new V(`${e}: Zuordnung „${n.question}“ braucht mindestens zwei Paare mit verschiedenen rechten Seiten und keine Antworten.`);continue}if(n.options.length<2||!n.options.some(s=>s.correct))throw new V(`${e}: Quizfrage „${n.question}“ braucht mindestens zwei Antworten, davon eine richtige.`)}return t}function O1(i,e){const t=[],n=i.split(`
`);let s=[];const r=()=>{const a=s.join(`
`).trim();a&&t.push({kind:"markdown",text:a}),s=[]};for(let a=0;a<n.length;a++){const l=/^:::\s*([a-zäöüß]+)\s*(.*)$/i.exec(n[a].trim());if(!l){s.push(n[a]);continue}r();const o=[];let u=a+1;for(;u<n.length&&n[u].trim()!==":::";)o.push(n[u++]);if(u>=n.length)throw new V(`${e}: Block „::: ${l[1]}“ wird nicht mit „:::“ geschlossen.`);const h=l[1].toLowerCase(),m=l[2].trim();switch(h){case"diagramm":if(!m)throw new V(`${e}: „::: diagramm“ braucht einen Dateinamen.`);t.push({kind:"diagram",file:m,caption:o.join(" ").trim()});break;case"übung":case"uebung":if(!m)throw new V(`${e}: „::: übung“ braucht eine Kennung.`);t.push({kind:"exercise",exercise:hm(m,o,e)});break;case"checkliste":t.push({kind:"checklist",items:o.map(d=>d.trim()).filter(d=>d.startsWith("- ")).map(d=>cm(d.slice(2).trim()))});break;case"quiz":t.push({kind:"quiz",questions:mm(o,e)});break;case"bild":if(!m)throw new V(`${e}: „::: bild“ braucht einen Dateinamen.`);t.push({kind:"images",files:m.split(/\s+/),caption:o.join(" ").trim()});break;case"grafik":if(!m)throw new V(`${e}: „::: grafik“ braucht einen Dateinamen.`);t.push({kind:"graphic",file:m,caption:o.join(" ").trim()});break;case"angeberwissen":t.push({kind:"brag",text:o.join(`
`).trim()});break;default:throw new V(`${e}: Unbekannter Block „::: ${l[1]}“.`)}a=u}return r(),t}function cm(i){const e=/^(.*?)\s+→\s+(.+)$/.exec(i);return e?{text:e[1],ref:e[2].trim()}:{text:i}}function dm(i,e){const t=new Map(i.map((n,s)=>[n.title.toLowerCase(),s]));for(const n of i.flatMap(s=>s.blocks))if(n.kind==="checklist"){for(const s of n.items)if(s.ref!==void 0&&(s.step=t.get(s.ref.toLowerCase()),s.step===void 0))throw new V(`${e}: Checkliste verweist auf unbekannten Schritt „${s.ref}“.`)}}function gm(i,e){var m;const{meta:t,body:n}=J1(i,e),s=e.replace(/^.*\//,"").replace(/\.md$/,""),r=Number((m=/^(\d+)/.exec(s))==null?void 0:m[1]);if(!Number.isFinite(r))throw new V(`${e}: Dateiname muss mit der Nummer beginnen (z. B. 01-…).`);const a=[];let l=[],o;const u=()=>{o&&a.push({title:o.title,blocks:O1(o.lines.join(`
`),e)})};for(const d of n.split(`
`)){const p=/^##\s+(.*)$/.exec(d);p?(u(),o={title:p[1].trim(),lines:[]}):o?o.lines.push(d):l.push(d)}if(u(),a.length===0)throw new V(`${e}: Keine Schritte (## Überschrift) gefunden.`);dm(a,e);const h=t.get("titel");if(!h)throw new V(`${e}: „titel:“ fehlt.`);return{id:s,number:r,title:h,section:t.get("bereich")??"",summary:t.get("kurz")??l.join(" ").trim(),steps:a}}function pm(i,e){const{meta:t,body:n}=J1(i,e),s=t.get("titel");if(!s)throw new V(`${e}: „titel:“ fehlt.`);const r=t.get("nach");return{id:e.replace(/^.*\//,"").replace(/\.md$/,""),title:s,after:r?Number(r):void 0,level:Number(t.get("stufe")??"1")||1,blocks:O1(n,e)}}const xm=Object.assign({"../../lessons/de/01-was-ist-ein-struktogramm.md":tr,"../../lessons/de/02-der-editor.md":nr,"../../lessons/de/03-speichern-oeffnen-exportieren.md":ir,"../../lessons/de/04-variablen-und-datentypen.md":sr,"../../lessons/de/05-sequenz.md":rr,"../../lessons/de/06-eingabe-und-ausgabe.md":ar,"../../lessons/de/07-simulation-und-schreibtischtest.md":lr,"../../lessons/de/08-verzweigung.md":or,"../../lessons/de/09-bedingungen-verknuepfen.md":ur,"../../lessons/de/10-fallauswahl.md":hr,"../../lessons/de/11-while-schleife.md":mr,"../../lessons/de/12-do-while-schleife.md":cr,"../../lessons/de/13-for-schleife.md":dr,"../../lessons/de/14-verschachteln.md":gr,"../../lessons/de/15-arrays.md":pr,"../../lessons/de/16-zweidimensionale-arrays.md":xr,"../../lessons/de/17-zeichenketten.md":br,"../../lessons/de/18-aufruf-und-aussprung.md":fr,"../../lessons/de/19-suchen-und-sortieren.md":Ir,"../../lessons/de/20-java.md":yr,"../../lessons/de/21-python-und-javascript.md":zr,"../../lessons/de/begriffe.md":wr,"../../lessons/de/nachschlagen.md":vr,"../../lessons/en/01-was-ist-ein-struktogramm.md":kr,"../../lessons/en/02-der-editor.md":Sr,"../../lessons/en/03-speichern-oeffnen-exportieren.md":Zr,"../../lessons/en/04-variablen-und-datentypen.md":Mr,"../../lessons/en/05-sequenz.md":_r,"../../lessons/en/06-eingabe-und-ausgabe.md":jr,"../../lessons/en/07-simulation-und-schreibtischtest.md":Tr,"../../lessons/en/08-verzweigung.md":Ar,"../../lessons/en/09-bedingungen-verknuepfen.md":Dr,"../../lessons/en/10-fallauswahl.md":Pr,"../../lessons/en/11-while-schleife.md":Cr,"../../lessons/en/12-do-while-schleife.md":Wr,"../../lessons/en/13-for-schleife.md":Br,"../../lessons/en/14-verschachteln.md":Hr,"../../lessons/en/15-arrays.md":Gr,"../../lessons/en/16-zweidimensionale-arrays.md":Nr,"../../lessons/en/17-zeichenketten.md":Er,"../../lessons/en/18-aufruf-und-aussprung.md":Lr,"../../lessons/en/19-suchen-und-sortieren.md":Vr,"../../lessons/en/20-java.md":Fr,"../../lessons/en/21-python-und-javascript.md":Rr,"../../lessons/en/begriffe.md":Ur,"../../lessons/en/nachschlagen.md":Yr}),bm=Object.assign({"../../lessons/de/aufgaben/alter-unterprogramm.md":Xr,"../../lessons/de/aufgaben/binaerzahl.md":Qr,"../../lessons/de/aufgaben/collatz.md":Jr,"../../lessons/de/aufgaben/fibonacci.md":Or,"../../lessons/de/aufgaben/gerade-ungerade.md":$r,"../../lessons/de/aufgaben/mehrwertsteuer.md":Kr,"../../lessons/de/aufgaben/notendurchschnitt.md":qr,"../../lessons/de/aufgaben/pin-pruefen.md":ea,"../../lessons/de/aufgaben/schiffe-versenken.md":ta,"../../lessons/de/aufgaben/speisekarte.md":na,"../../lessons/de/aufgaben/summe-bilden.md":ia,"../../lessons/de/aufgaben/tafeldienst.md":sa,"../../lessons/de/aufgaben/taschenrechner.md":ra,"../../lessons/de/aufgaben/verleih-menue.md":aa,"../../lessons/de/aufgaben/volljaehrig.md":la,"../../lessons/de/aufgaben/zahl-verdoppeln.md":oa,"../../lessons/en/aufgaben/alter-unterprogramm.md":ua,"../../lessons/en/aufgaben/binaerzahl.md":ha,"../../lessons/en/aufgaben/collatz.md":ma,"../../lessons/en/aufgaben/fibonacci.md":ca,"../../lessons/en/aufgaben/gerade-ungerade.md":da,"../../lessons/en/aufgaben/mehrwertsteuer.md":ga,"../../lessons/en/aufgaben/notendurchschnitt.md":pa,"../../lessons/en/aufgaben/pin-pruefen.md":xa,"../../lessons/en/aufgaben/schiffe-versenken.md":ba,"../../lessons/en/aufgaben/speisekarte.md":fa,"../../lessons/en/aufgaben/summe-bilden.md":Ia,"../../lessons/en/aufgaben/tafeldienst.md":ya,"../../lessons/en/aufgaben/taschenrechner.md":za,"../../lessons/en/aufgaben/verleih-menue.md":wa,"../../lessons/en/aufgaben/volljaehrig.md":va,"../../lessons/en/aufgaben/zahl-verdoppeln.md":ka}),fm=Object.assign({"../../lessons/diagramme/aufgabe-alter-haupt-loesung.visustruct":Sa,"../../lessons/diagramme/aufgabe-alter-unterprogramm-loesung.visustruct":Za,"../../lessons/diagramme/aufgabe-binaer-loesung.visustruct":Ma,"../../lessons/diagramme/aufgabe-collatz-loesung.visustruct":_a,"../../lessons/diagramme/aufgabe-durchschnitt-loesung.visustruct":ja,"../../lessons/diagramme/aufgabe-fibonacci-loesung.visustruct":Ta,"../../lessons/diagramme/aufgabe-gerade-loesung.visustruct":Aa,"../../lessons/diagramme/aufgabe-mehrwertsteuer-loesung.visustruct":Da,"../../lessons/diagramme/aufgabe-pin-loesung.visustruct":Pa,"../../lessons/diagramme/aufgabe-rechner-loesung.visustruct":Ca,"../../lessons/diagramme/aufgabe-schiffe-loesung.visustruct":Wa,"../../lessons/diagramme/aufgabe-schiffe-start.visustruct":Ba,"../../lessons/diagramme/aufgabe-speisekarte-loesung.visustruct":Ha,"../../lessons/diagramme/aufgabe-summe-loesung.visustruct":Ga,"../../lessons/diagramme/aufgabe-tafeldienst-loesung.visustruct":Na,"../../lessons/diagramme/aufgabe-verdoppeln-loesung.visustruct":Ea,"../../lessons/diagramme/aufgabe-verleih-loesung.visustruct":La,"../../lessons/diagramme/aufgabe-volljaehrig-loesung.visustruct":Va,"../../lessons/diagramme/en/aufgabe-alter-haupt-loesung.visustruct":Fa,"../../lessons/diagramme/en/aufgabe-alter-unterprogramm-loesung.visustruct":Ra,"../../lessons/diagramme/en/aufgabe-binaer-loesung.visustruct":Ua,"../../lessons/diagramme/en/aufgabe-collatz-loesung.visustruct":Ya,"../../lessons/diagramme/en/aufgabe-durchschnitt-loesung.visustruct":Xa,"../../lessons/diagramme/en/aufgabe-fibonacci-loesung.visustruct":Qa,"../../lessons/diagramme/en/aufgabe-gerade-loesung.visustruct":Ja,"../../lessons/diagramme/en/aufgabe-mehrwertsteuer-loesung.visustruct":Oa,"../../lessons/diagramme/en/aufgabe-pin-loesung.visustruct":$a,"../../lessons/diagramme/en/aufgabe-rechner-loesung.visustruct":Ka,"../../lessons/diagramme/en/aufgabe-schiffe-loesung.visustruct":qa,"../../lessons/diagramme/en/aufgabe-schiffe-start.visustruct":el,"../../lessons/diagramme/en/aufgabe-speisekarte-loesung.visustruct":tl,"../../lessons/diagramme/en/aufgabe-summe-loesung.visustruct":nl,"../../lessons/diagramme/en/aufgabe-tafeldienst-loesung.visustruct":il,"../../lessons/diagramme/en/aufgabe-verdoppeln-loesung.visustruct":sl,"../../lessons/diagramme/en/aufgabe-verleih-loesung.visustruct":rl,"../../lessons/diagramme/en/aufgabe-volljaehrig-loesung.visustruct":al,"../../lessons/diagramme/en/kino-einmaleins-loesung.visustruct":ll,"../../lessons/diagramme/en/kino-frei-loesung.visustruct":ol,"../../lessons/diagramme/en/kino-frei-start.visustruct":ul,"../../lessons/diagramme/en/kino-karte-loesung.visustruct":hl,"../../lessons/diagramme/en/kino-karte-start.visustruct":ml,"../../lessons/diagramme/en/kino-saalplan.visustruct":cl,"../../lessons/diagramme/en/kino-verkaufen.visustruct":dl,"../../lessons/diagramme/en/l04-rechnen.visustruct":gl,"../../lessons/diagramme/en/l04-reihenfolge-loesung.visustruct":pl,"../../lessons/diagramme/en/l04-reihenfolge-start.visustruct":xl,"../../lessons/diagramme/en/l04-tauschen-loesung.visustruct":bl,"../../lessons/diagramme/en/l04-tauschen-start.visustruct":fl,"../../lessons/diagramme/en/l04-tauschen.visustruct":Il,"../../lessons/diagramme/en/l05-datentypen.visustruct":yl,"../../lessons/diagramme/en/l05-division.visustruct":zl,"../../lessons/diagramme/en/l05-einkauf-loesung.visustruct":wl,"../../lessons/diagramme/en/l05-rechteck-loesung.visustruct":vl,"../../lessons/diagramme/en/l05-sekunden-loesung.visustruct":kl,"../../lessons/diagramme/en/l05-sekunden-start.visustruct":Sl,"../../lessons/diagramme/en/l06-begruessung-loesung.visustruct":Zl,"../../lessons/diagramme/en/l06-eva.visustruct":Ml,"../../lessons/diagramme/en/l06-mittelwert-loesung.visustruct":_l,"../../lessons/diagramme/en/l06-rechner-loesung.visustruct":jl,"../../lessons/diagramme/en/l07-alter-pruefen.visustruct":Tl,"../../lessons/diagramme/en/l07-betrag-loesung.visustruct":Al,"../../lessons/diagramme/en/l07-gerade-loesung.visustruct":Dl,"../../lessons/diagramme/en/l07-maximum-loesung.visustruct":Pl,"../../lessons/diagramme/en/l07-rabatt.visustruct":Cl,"../../lessons/diagramme/en/l08-gueltig-loesung.visustruct":Wl,"../../lessons/diagramme/en/l08-jugendticket.visustruct":Bl,"../../lessons/diagramme/en/l08-note.visustruct":Hl,"../../lessons/diagramme/en/l08-schaltjahr-loesung.visustruct":Gl,"../../lessons/diagramme/en/l08-wochenende-loesung.visustruct":Nl,"../../lessons/diagramme/en/l09-ampel.visustruct":El,"../../lessons/diagramme/en/l09-automat.visustruct":Ll,"../../lessons/diagramme/en/l09-note-loesung.visustruct":Vl,"../../lessons/diagramme/en/l09-rechner-loesung.visustruct":Fl,"../../lessons/diagramme/en/l09-verschachtelt.visustruct":Rl,"../../lessons/diagramme/en/l1-grundbausteine.visustruct":Ul,"../../lessons/diagramme/en/l1-sequenz.visustruct":Yl,"../../lessons/diagramme/en/l1-tee.visustruct":Xl,"../../lessons/diagramme/en/l1-verzweigung.visustruct":Ql,"../../lessons/diagramme/en/l1-wiederholung.visustruct":Jl,"../../lessons/diagramme/en/l10-bis-n-loesung.visustruct":Ol,"../../lessons/diagramme/en/l10-countdown.visustruct":$l,"../../lessons/diagramme/en/l10-endlos.visustruct":Kl,"../../lessons/diagramme/en/l10-fakultaet.visustruct":ql,"../../lessons/diagramme/en/l10-verdoppeln-loesung.visustruct":e0,"../../lessons/diagramme/en/l11-eingabe-pruefen.visustruct":t0,"../../lessons/diagramme/en/l11-einmal.visustruct":n0,"../../lessons/diagramme/en/l11-note-loesung.visustruct":i0,"../../lessons/diagramme/en/l11-summe-loesung.visustruct":s0,"../../lessons/diagramme/en/l12-countdown-loesung.visustruct":r0,"../../lessons/diagramme/en/l12-einmaleins-loesung.visustruct":a0,"../../lessons/diagramme/en/l12-eins-bis-fuenf.visustruct":l0,"../../lessons/diagramme/en/l12-summe.visustruct":o0,"../../lessons/diagramme/en/l13-dreieck.visustruct":u0,"../../lessons/diagramme/en/l13-gerade-eingaben-loesung.visustruct":h0,"../../lessons/diagramme/en/l13-gerade-zaehlen.visustruct":m0,"../../lessons/diagramme/en/l13-rechteck-loesung.visustruct":c0,"../../lessons/diagramme/en/l14-array-durchlaufen.visustruct":d0,"../../lessons/diagramme/en/l14-erster-letzter-loesung.visustruct":g0,"../../lessons/diagramme/en/l14-namen-eingeben.visustruct":p0,"../../lessons/diagramme/en/l14-rueckwaerts-loesung.visustruct":x0,"../../lessons/diagramme/en/l14-summe-max-loesung.visustruct":b0,"../../lessons/diagramme/en/l14-summe-maximum.visustruct":f0,"../../lessons/diagramme/en/l15-bis-null-loesung.visustruct":I0,"../../lessons/diagramme/en/l15-endlos-aussprung.visustruct":y0,"../../lessons/diagramme/en/l15-flaeche-loesung.visustruct":z0,"../../lessons/diagramme/en/l15-flaeche-unterprogramm-loesung.visustruct":w0,"../../lessons/diagramme/en/l15-hauptprogramm.visustruct":v0,"../../lessons/diagramme/en/l15-quadrat-haupt.visustruct":k0,"../../lessons/diagramme/en/l15-quadrat.visustruct":S0,"../../lessons/diagramme/en/l15-titel-loesung.visustruct":Z0,"../../lessons/diagramme/en/l15-unterprogramm.visustruct":M0,"../../lessons/diagramme/en/l15-zeige-summe-haupt.visustruct":_0,"../../lessons/diagramme/en/l15-zeige-summe.visustruct":j0,"../../lessons/diagramme/en/l16-countdown-loesung.visustruct":T0,"../../lessons/diagramme/en/l16-countdown-start.visustruct":A0,"../../lessons/diagramme/en/l16-schreibtisch.visustruct":D0,"../../lessons/diagramme/en/l16-summe-loesung.visustruct":P0,"../../lessons/diagramme/en/l16-summe-start.visustruct":C0,"../../lessons/diagramme/en/l17-beispiel.visustruct":W0,"../../lessons/diagramme/en/l17-fakultaet-loesung.visustruct":B0,"../../lessons/diagramme/en/l17-ticket-loesung.visustruct":H0,"../../lessons/diagramme/en/l18-beispiel.visustruct":G0,"../../lessons/diagramme/en/l18-js-loesung.visustruct":N0,"../../lessons/diagramme/en/l18-python-loesung.visustruct":E0,"../../lessons/diagramme/en/l2-ausgabe.visustruct":L0,"../../lessons/diagramme/en/l2-hallo-loesung.visustruct":V0,"../../lessons/diagramme/en/l2-zwei-zeilen-loesung.visustruct":F0,"../../lessons/diagramme/en/sim-kino-loesung.visustruct":R0,"../../lessons/diagramme/en/sim-kino-start.visustruct":U0,"../../lessons/diagramme/en/sim-tausch-loesung.visustruct":Y0,"../../lessons/diagramme/en/sim-tausch-start.visustruct":X0,"../../lessons/diagramme/en/sim-tausch.visustruct":Q0,"../../lessons/diagramme/en/ss-absteigend-loesung.visustruct":J0,"../../lessons/diagramme/en/ss-absteigend-start.visustruct":O0,"../../lessons/diagramme/en/ss-binaere-suche.visustruct":$0,"../../lessons/diagramme/en/ss-bubblesort.visustruct":K0,"../../lessons/diagramme/en/ss-karte-suchen-loesung.visustruct":q0,"../../lessons/diagramme/en/ss-lineare-suche.visustruct":eo,"../../lessons/diagramme/en/uebergabe-bonus-loesung.visustruct":to,"../../lessons/diagramme/en/uebergabe-bonus-start.visustruct":no,"../../lessons/diagramme/en/uebergabe-bonus-unterprogramm-loesung.visustruct":io,"../../lessons/diagramme/en/uebergabe-haupt.visustruct":so,"../../lessons/diagramme/en/uebergabe-leeren.visustruct":ro,"../../lessons/diagramme/en/uebergabe-verdopple.visustruct":ao,"../../lessons/diagramme/en/zk-initialen-loesung.visustruct":lo,"../../lessons/diagramme/en/zk-rueckwaerts-loesung.visustruct":oo,"../../lessons/diagramme/en/zk-split.visustruct":uo,"../../lessons/diagramme/en/zk-woerter-loesung.visustruct":ho,"../../lessons/diagramme/en/zk-zaehlen.visustruct":mo,"../../lessons/diagramme/en/zk-zeichen.visustruct":co,"../../lessons/diagramme/kino-einmaleins-loesung.visustruct":go,"../../lessons/diagramme/kino-frei-loesung.visustruct":po,"../../lessons/diagramme/kino-frei-start.visustruct":xo,"../../lessons/diagramme/kino-karte-loesung.visustruct":bo,"../../lessons/diagramme/kino-karte-start.visustruct":fo,"../../lessons/diagramme/kino-saalplan.visustruct":Io,"../../lessons/diagramme/kino-verkaufen.visustruct":yo,"../../lessons/diagramme/l04-rechnen.visustruct":zo,"../../lessons/diagramme/l04-reihenfolge-loesung.visustruct":wo,"../../lessons/diagramme/l04-reihenfolge-start.visustruct":vo,"../../lessons/diagramme/l04-tauschen-loesung.visustruct":ko,"../../lessons/diagramme/l04-tauschen-start.visustruct":So,"../../lessons/diagramme/l04-tauschen.visustruct":Zo,"../../lessons/diagramme/l05-datentypen.visustruct":Mo,"../../lessons/diagramme/l05-division.visustruct":_o,"../../lessons/diagramme/l05-einkauf-loesung.visustruct":jo,"../../lessons/diagramme/l05-rechteck-loesung.visustruct":To,"../../lessons/diagramme/l05-sekunden-loesung.visustruct":Ao,"../../lessons/diagramme/l05-sekunden-start.visustruct":Do,"../../lessons/diagramme/l06-begruessung-loesung.visustruct":Po,"../../lessons/diagramme/l06-eva.visustruct":Co,"../../lessons/diagramme/l06-mittelwert-loesung.visustruct":Wo,"../../lessons/diagramme/l06-rechner-loesung.visustruct":Bo,"../../lessons/diagramme/l07-alter-pruefen.visustruct":Ho,"../../lessons/diagramme/l07-betrag-loesung.visustruct":Go,"../../lessons/diagramme/l07-gerade-loesung.visustruct":No,"../../lessons/diagramme/l07-maximum-loesung.visustruct":Eo,"../../lessons/diagramme/l07-rabatt.visustruct":Lo,"../../lessons/diagramme/l08-gueltig-loesung.visustruct":Vo,"../../lessons/diagramme/l08-jugendticket.visustruct":Fo,"../../lessons/diagramme/l08-note.visustruct":Ro,"../../lessons/diagramme/l08-schaltjahr-loesung.visustruct":Uo,"../../lessons/diagramme/l08-wochenende-loesung.visustruct":Yo,"../../lessons/diagramme/l09-ampel.visustruct":Xo,"../../lessons/diagramme/l09-automat.visustruct":Qo,"../../lessons/diagramme/l09-note-loesung.visustruct":Jo,"../../lessons/diagramme/l09-rechner-loesung.visustruct":Oo,"../../lessons/diagramme/l09-verschachtelt.visustruct":$o,"../../lessons/diagramme/l1-grundbausteine.visustruct":Ko,"../../lessons/diagramme/l1-sequenz.visustruct":qo,"../../lessons/diagramme/l1-tee.visustruct":eu,"../../lessons/diagramme/l1-verzweigung.visustruct":tu,"../../lessons/diagramme/l1-wiederholung.visustruct":nu,"../../lessons/diagramme/l10-bis-n-loesung.visustruct":iu,"../../lessons/diagramme/l10-countdown.visustruct":su,"../../lessons/diagramme/l10-endlos.visustruct":ru,"../../lessons/diagramme/l10-fakultaet.visustruct":au,"../../lessons/diagramme/l10-verdoppeln-loesung.visustruct":lu,"../../lessons/diagramme/l11-eingabe-pruefen.visustruct":ou,"../../lessons/diagramme/l11-einmal.visustruct":uu,"../../lessons/diagramme/l11-note-loesung.visustruct":hu,"../../lessons/diagramme/l11-summe-loesung.visustruct":mu,"../../lessons/diagramme/l12-countdown-loesung.visustruct":cu,"../../lessons/diagramme/l12-einmaleins-loesung.visustruct":du,"../../lessons/diagramme/l12-eins-bis-fuenf.visustruct":gu,"../../lessons/diagramme/l12-summe.visustruct":pu,"../../lessons/diagramme/l13-dreieck.visustruct":xu,"../../lessons/diagramme/l13-gerade-eingaben-loesung.visustruct":bu,"../../lessons/diagramme/l13-gerade-zaehlen.visustruct":fu,"../../lessons/diagramme/l13-rechteck-loesung.visustruct":Iu,"../../lessons/diagramme/l14-array-durchlaufen.visustruct":yu,"../../lessons/diagramme/l14-erster-letzter-loesung.visustruct":zu,"../../lessons/diagramme/l14-namen-eingeben.visustruct":wu,"../../lessons/diagramme/l14-rueckwaerts-loesung.visustruct":vu,"../../lessons/diagramme/l14-summe-max-loesung.visustruct":ku,"../../lessons/diagramme/l14-summe-maximum.visustruct":Su,"../../lessons/diagramme/l15-bis-null-loesung.visustruct":Zu,"../../lessons/diagramme/l15-endlos-aussprung.visustruct":Mu,"../../lessons/diagramme/l15-flaeche-loesung.visustruct":_u,"../../lessons/diagramme/l15-flaeche-unterprogramm-loesung.visustruct":ju,"../../lessons/diagramme/l15-hauptprogramm.visustruct":Tu,"../../lessons/diagramme/l15-quadrat-haupt.visustruct":Au,"../../lessons/diagramme/l15-quadrat.visustruct":Du,"../../lessons/diagramme/l15-titel-loesung.visustruct":Pu,"../../lessons/diagramme/l15-unterprogramm.visustruct":Cu,"../../lessons/diagramme/l15-zeige-summe-haupt.visustruct":Wu,"../../lessons/diagramme/l15-zeige-summe.visustruct":Bu,"../../lessons/diagramme/l16-countdown-loesung.visustruct":Hu,"../../lessons/diagramme/l16-countdown-start.visustruct":Gu,"../../lessons/diagramme/l16-schreibtisch.visustruct":Nu,"../../lessons/diagramme/l16-summe-loesung.visustruct":Eu,"../../lessons/diagramme/l16-summe-start.visustruct":Lu,"../../lessons/diagramme/l17-beispiel.visustruct":Vu,"../../lessons/diagramme/l17-fakultaet-loesung.visustruct":Fu,"../../lessons/diagramme/l17-ticket-loesung.visustruct":Ru,"../../lessons/diagramme/l18-beispiel.visustruct":Uu,"../../lessons/diagramme/l18-js-loesung.visustruct":Yu,"../../lessons/diagramme/l18-python-loesung.visustruct":Xu,"../../lessons/diagramme/l2-ausgabe.visustruct":Qu,"../../lessons/diagramme/l2-hallo-loesung.visustruct":Ju,"../../lessons/diagramme/l2-zwei-zeilen-loesung.visustruct":Ou,"../../lessons/diagramme/sim-kino-loesung.visustruct":$u,"../../lessons/diagramme/sim-kino-start.visustruct":Ku,"../../lessons/diagramme/sim-tausch-loesung.visustruct":qu,"../../lessons/diagramme/sim-tausch-start.visustruct":eh,"../../lessons/diagramme/sim-tausch.visustruct":th,"../../lessons/diagramme/ss-absteigend-loesung.visustruct":nh,"../../lessons/diagramme/ss-absteigend-start.visustruct":ih,"../../lessons/diagramme/ss-binaere-suche.visustruct":sh,"../../lessons/diagramme/ss-bubblesort.visustruct":rh,"../../lessons/diagramme/ss-karte-suchen-loesung.visustruct":ah,"../../lessons/diagramme/ss-lineare-suche.visustruct":lh,"../../lessons/diagramme/uebergabe-bonus-loesung.visustruct":oh,"../../lessons/diagramme/uebergabe-bonus-start.visustruct":uh,"../../lessons/diagramme/uebergabe-bonus-unterprogramm-loesung.visustruct":hh,"../../lessons/diagramme/uebergabe-haupt.visustruct":mh,"../../lessons/diagramme/uebergabe-leeren.visustruct":ch,"../../lessons/diagramme/uebergabe-verdopple.visustruct":dh,"../../lessons/diagramme/zk-initialen-loesung.visustruct":gh,"../../lessons/diagramme/zk-rueckwaerts-loesung.visustruct":ph,"../../lessons/diagramme/zk-split.visustruct":xh,"../../lessons/diagramme/zk-woerter-loesung.visustruct":bh,"../../lessons/diagramme/zk-zaehlen.visustruct":fh,"../../lessons/diagramme/zk-zeichen.visustruct":Ih}),Im=Object.assign({"../../lessons/bilder/aufgabe-mehrwertsteuer.svg":yh,"../../lessons/bilder/ben-shneiderman.jpg":zh,"../../lessons/bilder/en/aufgabe-mehrwertsteuer.svg":wh,"../../lessons/bilder/en/kino-saal.svg":vh,"../../lessons/bilder/en/kino-schleifen.svg":kh,"../../lessons/bilder/en/l01-pap.svg":Sh,"../../lessons/bilder/en/l02-einfuegen.svg":Zh,"../../lessons/bilder/en/l04-variable.svg":Mh,"../../lessons/bilder/en/l04-zuweisung.svg":_h,"../../lessons/bilder/en/l05-tauschen.svg":jh,"../../lessons/bilder/en/l08-zahlenstrahl.svg":Th,"../../lessons/bilder/en/l10-kopfgesteuert.svg":Ah,"../../lessons/bilder/en/l11-vergleich.svg":Dh,"../../lessons/bilder/en/l12-for-ablauf.svg":Ph,"../../lessons/bilder/en/l14-array.svg":Ch,"../../lessons/bilder/en/ss-binaere-suche.svg":Wh,"../../lessons/bilder/en/ss-bubblesort.svg":Bh,"../../lessons/bilder/en/ss-lineare-suche.svg":Hh,"../../lessons/bilder/en/ss-vergleiche.svg":Gh,"../../lessons/bilder/en/uebergabe.svg":Nh,"../../lessons/bilder/en/zk-zeichen.svg":Eh,"../../lessons/bilder/ike-nassi.jpg":Lh,"../../lessons/bilder/kino-saal.svg":Vh,"../../lessons/bilder/kino-schleifen.svg":Fh,"../../lessons/bilder/l01-pap.svg":Rh,"../../lessons/bilder/l02-einfuegen.svg":Uh,"../../lessons/bilder/l04-variable.svg":Yh,"../../lessons/bilder/l04-zuweisung.svg":Xh,"../../lessons/bilder/l05-tauschen.svg":Qh,"../../lessons/bilder/l08-zahlenstrahl.svg":Jh,"../../lessons/bilder/l10-kopfgesteuert.svg":Oh,"../../lessons/bilder/l11-vergleich.svg":$h,"../../lessons/bilder/l12-for-ablauf.svg":Kh,"../../lessons/bilder/l14-array.svg":qh,"../../lessons/bilder/schiffe-versenken.svg":em,"../../lessons/bilder/ss-binaere-suche.svg":tm,"../../lessons/bilder/ss-bubblesort.svg":nm,"../../lessons/bilder/ss-lineare-suche.svg":im,"../../lessons/bilder/ss-vergleiche.svg":sm,"../../lessons/bilder/uebergabe.svg":rm,"../../lessons/bilder/zk-zeichen.svg":am}),ym=i=>i.replace(/^.*\//,"");function Fn(i,e,t){const n=r=>new Map(Object.entries(i).filter(([a])=>{var l;return((l=e.exec(a))==null?void 0:l[1])===r}).map(([a,l])=>[ym(a),l]));return[...new Map([...n("en"),...t==="en"?[]:n(t)])]}function Rn(i){return i==="de"?"de":"en"}let Yt="en",me=[],$e=[],$1="",Ke=[];function Xt(i){var t,n;if(i===Yt&&me.length>0)return;Yt=i;const e=Fn(xm,/\/lessons\/([^/]+)\/[^/]+\.md$/,i);me=e.filter(([s])=>/^\d+/.test(s)).map(([s,r])=>gm(r,`${i}/${s}`)).sort((s,r)=>s.number-r.number),$e=Fn(bm,/\/lessons\/([^/]+)\/aufgaben\/[^/]+\.md$/,i).map(([s,r])=>pm(r,`${i}/aufgaben/${s}`)).sort((s,r)=>(s.after??0)-(r.after??0)||s.level-r.level||s.title.localeCompare(r.title,i)),$1=((t=e.find(([s])=>s==="nachschlagen.md"))==null?void 0:t[1])??"",Ke=lm(((n=e.find(([s])=>s==="begriffe.md"))==null?void 0:n[1])??"")}Xt("en");function K1(i,e){return Yt==="de"?i.get(e)??i.get(`en/${e}`):i.get(`en/${e}`)??i.get(e)}const q1=(i,e)=>i.slice(i.indexOf(e)+e.length),zm=new Map(Object.entries(fm).map(([i,e])=>[q1(i,"/diagramme/"),e]));function Se(i){const e=K1(zm,i);return e===void 0?void 0:tn(e)}const wm=new Map(Object.entries(Im).map(([i,e])=>[q1(i,"/bilder/"),e]));function Un(i){return K1(wm,i)}const ei=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function J(i){const e=[];let t=ei(i).replace(/`([^`]+)`/g,(n,s)=>(e.push(s),`\0${e.length-1}\0`));return t=t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/(^|[^*])\*([^*\s][^*]*?)\*/g,"$1<em>$2</em>").replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,(n,s,r)=>{const a=/^(https?:|mailto:|#|\.{0,2}\/)/.test(r)?r:"#",l=/^https?:/.test(a)?' target="_blank" rel="noopener noreferrer"':"";return`<a href="${a}"${l}>${s}</a>`}),t.replace(/\u0000(\d+)\u0000/g,(n,s)=>`<code>${e[Number(s)]}</code>`)}function Ie(i){const e=[],t=i.replace(/\r\n/g,`
`).split(`
`);let n=0;for(;n<t.length;){const s=t[n];if(s.trim()===""){n++;continue}if(s.startsWith("```")){const l=[];for(n++;n<t.length&&!t[n].startsWith("```");)l.push(t[n++]);n++,e.push(`<pre class="lesson-code" dir="ltr"><code>${ei(l.join(`
`))}</code></pre>`);continue}const r=/^(#{3,4})\s+(.*)$/.exec(s);if(r){const l=r[1].length;e.push(`<h${l}>${J(r[2])}</h${l}>`),n++;continue}if(/^\s*([-*]|\d+\.)\s+/.test(s)){const l=/^\s*\d+\./.test(s),o=[];for(;n<t.length&&/^\s*([-*]|\d+\.)\s+/.test(t[n]);){let u=t[n].replace(/^\s*([-*]|\d+\.)\s+/,"");for(n++;n<t.length&&/^\s{2,}\S/.test(t[n])&&!/^\s*([-*]|\d+\.)\s+/.test(t[n]);)u+=" "+t[n++].trim();o.push(`<li>${J(u)}</li>`)}e.push(l?`<ol>${o.join("")}</ol>`:`<ul>${o.join("")}</ul>`);continue}if(s.startsWith("|")&&/^\|?[\s:|-]*-{3,}[\s:|-]*$/.test(t[n+1]??"")){const l=h=>h.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(m=>J(m.trim())),o=l(s);n+=2;const u=[];for(;n<t.length&&t[n].startsWith("|");)u.push(l(t[n++]));e.push(`<div class="lesson-table"><table><thead><tr>${o.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${u.map(h=>`<tr>${h.map(m=>`<td>${m}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);continue}if(s.startsWith(">")){const l=[];for(;n<t.length&&t[n].startsWith(">");)l.push(t[n++].replace(/^>\s?/,""));e.push(`<aside class="lesson-note">${Ie(l.join(`
`))}</aside>`);continue}const a=[];for(;n<t.length&&t[n].trim()!==""&&!/^(```|#{3,4}\s|>|\||\s*([-*]|\d+\.)\s+)/.test(t[n]);)a.push(t[n++].trim());e.push(`<p>${J(a.join(" "))}</p>`)}return e.join(`
`)}const vm=""+new URL("ludwig-Cus1i402.webp",import.meta.url).href,ti="visustruct.learn.progress",vt={"04-sequenz":"05-sequenz","05-variablen-und-datentypen":"04-variablen-und-datentypen","07-verzweigung":"08-verzweigung","08-bedingungen-verknuepfen":"09-bedingungen-verknuepfen","09-fallauswahl":"10-fallauswahl","10-while-schleife":"11-while-schleife","11-do-while-schleife":"12-do-while-schleife","12-for-schleife":"13-for-schleife","13-verschachteln":"14-verschachteln","14-arrays":"15-arrays","15-aufruf-und-aussprung":"18-aufruf-und-aussprung","16-aufruf-und-aussprung":"18-aufruf-und-aussprung","17-aufruf-und-aussprung":"18-aufruf-und-aussprung","17-suchen-und-sortieren":"19-suchen-und-sortieren","18-suchen-und-sortieren":"19-suchen-und-sortieren","16-simulation-und-schreibtischtest":"07-simulation-und-schreibtischtest","17-java":"20-java","18-java":"20-java","19-java":"20-java","18-python-und-javascript":"21-python-und-javascript","19-python-und-javascript":"21-python-und-javascript","20-python-und-javascript":"21-python-und-javascript"};function km(i){var n;const e={...i.lessons};for(const[s,r]of Object.entries(vt))i.lessons[s]&&!i.lessons[r]&&(e[r]=i.lessons[s]),i.lessons[s]&&delete e[s];const t=(n=i.view)!=null&&n.lesson&&vt[i.view.lesson]?{...i.view,lesson:vt[i.view.lesson]}:i.view;return{...i,lessons:e,view:t}}function ni(){try{const i=localStorage.getItem(ti);if(i){const e=JSON.parse(i);return km({lessons:e.lessons??{},exercises:e.exercises??{},view:e.view})}}catch{}return{lessons:{},exercises:{}}}let ie=ni();function Re(){try{localStorage.setItem(ti,JSON.stringify(ie))}catch{}}const G={lesson(i){var e;return(e=ie.lessons)[i]??(e[i]={step:0})},updateLesson(i,e){ie.lessons[i]={...G.lesson(i),...e},Re()},exercise(i){return ie.exercises[i]??{}},updateExercise(i,e){ie.exercises[i]={...G.exercise(i),...e},Re()},resetExercise(i){delete ie.exercises[i],Re()},view(){return ie.view},setView(i){ie.view=i,Re()},reload(){ie=ni()}},Qt="f4ecc8e489ae7865308288c7d0fa313333cf2be3ff529b23bc214bee010310e0",un="visustruct.learn.teacher";let hn=!1;function Yn(){if(hn)return!0;try{return localStorage.getItem(un)===Qt}catch{return!1}}async function Sm(i){const e=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(i));return[...new Uint8Array(e)].map(t=>t.toString(16).padStart(2,"0")).join("")}async function Zm(i){let e=!1;try{e=await Sm(i.trim())===Qt}catch{return!1}if(e){hn=!0;try{localStorage.setItem(un,Qt)}catch{}}return e}function Mm(){hn=!1;try{localStorage.removeItem(un)}catch{}}function Jt(i){switch(i.kind){case"finished":return c("sim_notice_finished");case"infiniteLoopWithoutBody":return c("sim_notice_infinite_loop_empty");case"unsupportedStatement":return c("sim_notice_unsupported_statement_fmt",i.text);case"invalidExpression":return c("sim_notice_invalid_expression_fmt",i.text);case"unknownVariable":return c("sim_notice_unknown_variable_fmt",i.text);case"divisionByZero":return c("sim_notice_division_by_zero");case"wholeNumberExpected":return c("sim_notice_whole_number_expected");case"numberExpected":return c("sim_notice_number_expected");case"booleanExpected":return c("sim_notice_boolean_expected");case"subprogramNotFound":return c("sim_notice_subprogram_not_found_fmt",i.text);case"callTooDeep":return c("sim_notice_call_too_deep");case"callArguments":return c("web_sim_call_arguments_fmt",i.text);case"missingReturn":return c("web_sim_missing_return_fmt",i.text);case"other":return i.text}}const H=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Xn=["0.2","0.5","1.0","1.5","2.0"],_m=i=>Number(i).toLocaleString(ze()==="java"?"en":ze(),{minimumFractionDigits:1}),kt="visustruct.simulation.stepDelay",Qn="visustruct.simulation.highlightMode";function St(i){try{return localStorage.getItem(i)}catch{return null}}function Jn(i,e){try{localStorage.setItem(i,e)}catch{}}class jm{constructor(e,t,n=()=>{},s=()=>{}){I(this,"element");I(this,"engine");I(this,"isPlaying",!1);I(this,"playTimer");I(this,"wasPlayingBeforeInput",!1);I(this,"delay",Xn.includes(St(kt)??"")?St(kt):"0.5");I(this,"highlightMode",St(Qn)==="nextToExecute"?"nextToExecute":"lastExecuted");I(this,"buttons");I(this,"inputSection");I(this,"trace");I(this,"variables");I(this,"output");I(this,"notice");I(this,"editButton");this.currentDocument=e,this.onHighlight=t,this.findSubprogram=n,this.onEdit=s,this.engine=new Nt(e(),n),this.element=document.createElement("aside"),this.element.className="simpanel",this.build()}begin(){this.pause(),this.restartEngine()}end(){this.pause()}step(){if(!this.engine.canStep){this.pause();return}const e=this.isPlaying,t=this.engine.currentStepPath;this.engine.step(),this.highlightMode==="nextToExecute"&&this.engine.canStep?this.onHighlight(this.engine.currentStepPath):this.onHighlight(t??this.engine.currentStepPath),this.engine.state.inputRequest&&e&&(this.wasPlayingBeforeInput=!0),this.engine.canStep||this.pause(),this.update()}reset(){this.pause(),this.restartEngine()}play(){if(this.isPlaying||!this.engine.canStep)return;this.isPlaying=!0;const e=()=>{this.playTimer=void 0,this.isPlaying&&(this.step(),this.isPlaying&&this.engine.canStep?this.playTimer=window.setTimeout(e,Number(this.delay)*1e3):(this.isPlaying=!1,this.update()))};e()}pause(){this.playTimer!==void 0&&window.clearTimeout(this.playTimer),this.playTimer=void 0,this.isPlaying=!1,this.update()}submitInput(e){const t=this.isPlaying||this.wasPlayingBeforeInput;this.pause(),this.engine.provideInput(e.value),this.engine.state.inputRequest||(e.value=""),this.onHighlight(this.engine.currentStepPath),t&&this.engine.canStep&&(this.wasPlayingBeforeInput=!1,this.play()),this.update()}restartEngine(){this.engine=new Nt(this.currentDocument(),this.findSubprogram),this.wasPlayingBeforeInput=!1,this.onHighlight(this.engine.currentStepPath),this.update()}build(){this.element.innerHTML=`
      <section>
        <h2>${H(c("simulation_controls"))}</h2>
        <div class="sim-buttons">
          <button data-sim="play">▶︎ ${H(c("simulation_play"))}</button>
          <button data-sim="pause">⏸︎ ${H(c("simulation_pause"))}</button>
          <button data-sim="step">→ ${H(c("simulation_step"))}</button>
          <button data-sim="stop">■ ${H(c("simulation_stop"))}</button>
        </div>
        <label class="sim-option">${H(c("simulation_highlight_label"))}
          <select data-sim="highlight">
            <option value="lastExecuted">${H(c("simulation_highlight_last"))}</option>
            <option value="nextToExecute">${H(c("simulation_highlight_next"))}</option>
          </select>
        </label>
        <label class="sim-option">${H(c("web_sim_delay"))}
          <select data-sim="delay">${Xn.map(s=>`<option value="${s}">${H(c("web_sim_delay_value_fmt",_m(s)))}</option>`).join("")}</select>
        </label>
      </section>
      <p class="sim-notice" role="status"></p>
      <button class="sim-edit primary" title="${H(c("web_simulation_end_title"))}" hidden>✎ ${H(c("action_diagram"))}</button>
      <section class="sim-input"><h2>${H(c("simulation_input"))}</h2><div></div></section>
      <section><h2>${H(c("simulation_trace"))}</h2><div class="sim-trace mono" dir="ltr"></div></section>
      <section><h2>${H(c("simulation_variables"))}</h2><div class="sim-vars" dir="ltr"></div></section>
      <section><h2>${H(c("simulation_output"))}</h2><div class="sim-output mono" dir="ltr"></div></section>
    `;const e=s=>this.element.querySelector(s);this.buttons={play:e("[data-sim=play]"),pause:e("[data-sim=pause]"),step:e("[data-sim=step]"),stop:e("[data-sim=stop]")},this.buttons.play.addEventListener("click",()=>this.play()),this.buttons.pause.addEventListener("click",()=>this.pause()),this.buttons.step.addEventListener("click",()=>this.step()),this.buttons.stop.addEventListener("click",()=>this.reset()),this.editButton=e(".sim-edit"),this.editButton.addEventListener("click",()=>this.onEdit());const t=e("[data-sim=highlight]");t.value=this.highlightMode,t.addEventListener("change",()=>{this.highlightMode=t.value,Jn(Qn,this.highlightMode)});const n=e("[data-sim=delay]");n.value=this.delay,n.addEventListener("change",()=>{this.delay=n.value,Jn(kt,this.delay)}),this.inputSection=e(".sim-input > div"),this.trace=e(".sim-trace"),this.variables=e(".sim-vars"),this.output=e(".sim-output"),this.notice=e(".sim-notice")}update(){if(!this.buttons)return;const{state:e,canStep:t}=this.engine;this.buttons.play.disabled=this.isPlaying||!t,this.buttons.pause.disabled=!this.isPlaying,this.buttons.step.disabled=this.isPlaying||!t,this.notice.textContent=e.notice?Jt(e.notice):"",this.notice.hidden=!e.notice,this.notice.classList.toggle("error",e.isHalted),this.editButton.hidden=!e.isHalted,this.updateInput(),this.trace.textContent=e.lastTrace??c("simulation_trace_placeholder"),this.trace.classList.toggle("placeholder",!e.lastTrace);const n=[...e.variables.keys()].sort((s,r)=>s.localeCompare(r));if(n.length===0)this.variables.innerHTML=`<p class="placeholder">${H(c("simulation_variables_placeholder"))}</p>`;else{const s=document.createElement("table");for(const r of n){const a=s.insertRow();a.insertCell().textContent=r;const l=e.variables.get(r),o=a.insertCell();l.kind==="grid"?o.append(Tm(l)):o.textContent=F(l)}this.variables.replaceChildren(s)}e.outputLines.length===0?this.output.innerHTML=`<p class="placeholder">${H(c("simulation_output_placeholder"))}</p>`:(this.output.replaceChildren(...e.outputLines.map(s=>{const r=document.createElement("div");return r.textContent=s,r})),this.output.scrollTop=this.output.scrollHeight)}updateInput(){const e=this.engine.state.inputRequest,t=this.inputSection;if(t.parentElement.classList.toggle("active",!!e),!e){t.innerHTML=`<p class="placeholder">${H(c("simulation_input_placeholder"))}</p>`;return}let n=t.querySelector("form");if(!n){n=document.createElement("form"),n.innerHTML=`<p class="sim-prompt"></p><div class="sim-input-row"><input autocomplete="off" /><button type="submit">${H(c("simulation_input_submit"))}</button></div><p class="sim-input-error"></p>`;const l=n.querySelector("input");n.addEventListener("submit",o=>{o.preventDefault(),this.submitInput(l)}),t.replaceChildren(n),requestAnimationFrame(()=>l.focus())}n.querySelector(".sim-prompt").textContent=e.prompt;const s=n.querySelector("input");s.inputMode=e.valueType==="string"||e.valueType==="boolean"?"text":"decimal";const r=this.engine.state.inputErrorNotice,a=n.querySelector(".sim-input-error");a.textContent=r?Jt(r):"",a.hidden=!r}}function Tm(i){const e=document.createElement("table");e.className="sim-grid";for(const t of i.value){const n=e.insertRow();for(const s of t){const r=n.insertCell();r.textContent=String(s),s===!0&&(r.className="sim-grid-true")}}return e}const Am="code, pre, a, button, h1, h2, h3, h4, strong, .term, .ui-pointer";function On(i,e){var r;const t=[...i.querySelectorAll(".learn-text")],n=new Set;for(const a of t.flatMap(l=>[...l.querySelectorAll("strong")])){const l=Ln(e),o=l==null?void 0:l.exec(a.textContent??""),u=o?Vn(e,o[0]):void 0;u&&n.add(u)}let s=e.filter(a=>!n.has(a));for(const a of t){const l=document.createTreeWalker(a,NodeFilter.SHOW_TEXT),o=[];for(;l.nextNode();){const u=l.currentNode;(r=u.parentElement)!=null&&r.closest(Am)||o.push(u)}for(let u of o)for(;;){const h=Ln(s),m=h==null?void 0:h.exec(u.data),d=m?Vn(s,m[0]):void 0;if(!m||!d)break;const p=u.splitText(m.index);u=p.splitText(m[0].length);const x=document.createElement("span");x.className="term",x.tabIndex=0,x.setAttribute("role","button"),x.setAttribute("aria-describedby","term-tip"),x.dataset.term=d.term,x.dataset.text=d.text,p.replaceWith(x),x.append(p),s=s.filter(y=>y!==d)}}}function Dm(i){const e=document.createElement("div");e.id="term-tip",e.className="term-tip",e.setAttribute("role","tooltip"),e.hidden=!0,document.body.append(e);let t,n=!1;const s=l=>{t=l,e.replaceChildren();const o=document.createElement("strong");o.textContent=l.dataset.term??"",e.append(o,document.createTextNode(" "+(l.dataset.text??""))),e.hidden=!1;const u=l.getBoundingClientRect(),h=e.offsetWidth,m=e.offsetHeight,d=Math.max(8,Math.min(u.left,window.innerWidth-h-8)),p=u.bottom+6;e.style.left=`${d}px`,e.style.top=`${p+m>window.innerHeight-8?Math.max(8,u.top-m-6):p}px`,l.setAttribute("aria-expanded","true")},r=()=>{t==null||t.setAttribute("aria-expanded","false"),t=void 0,n=!1,e.hidden=!0},a=l=>{var o,u;return((u=(o=l.target)==null?void 0:o.closest)==null?void 0:u.call(o,".term"))??void 0};return i.addEventListener("pointerover",l=>{const o=a(l);o&&l.pointerType==="mouse"&&!n&&s(o)}),i.addEventListener("pointerout",l=>{a(l)&&l.pointerType==="mouse"&&!n&&r()}),i.addEventListener("click",l=>{const o=a(l);if(o){if(n&&t===o)return r();s(o),n=!0}}),i.addEventListener("focusin",l=>{const o=a(l);o&&!n&&s(o)}),i.addEventListener("focusout",l=>{a(l)&&!n&&r()}),i.addEventListener("keydown",l=>{const o=a(l);l.key==="Escape"&&t?r():o&&(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),o.click())}),i.addEventListener("scroll",r,!0),document.addEventListener("pointerdown",l=>{t&&!a(l)&&!e.contains(l.target)&&r()}),{hide:r}}const ii={leiste:".app > .toolbar",elemente:".palette",struktogramm:".canvas",objektinspektor:".inspector",reiter:".tabs",titel:".caption",neu:"[data-action=new]",oeffnen:"[data-action=open]",speichern:"[data-action=save]",exportieren:"[data-action=export]",rueckgaengig:"[data-action=undo]",textgroesse:"[data-action=zoom]",lernen:"[data-action=learn]",code:"[data-action=code]",simulation:"[data-action=simulate]"};function $n(i){for(const e of i.querySelectorAll('a[href^="#zeige-"]')){const t=e.getAttribute("href").slice(7);if(!(t in ii))continue;const n=document.createElement("span");n.className="ui-pointer",n.tabIndex=0,n.setAttribute("role","button"),n.dataset.target=t,n.append(...e.childNodes),e.replaceWith(n)}}function Pm(i){let e,t;const n=()=>{e==null||e.classList.remove("ui-spot"),e=void 0,window.clearTimeout(t)},s=(a,l)=>{n();const o=document.querySelector(ii[a.dataset.target??""]??":not(*)");!o||o.getClientRects().length===0||(e=o,o.classList.add("ui-spot"),l&&(t=window.setTimeout(n,2500)))},r=a=>{var l,o;return((o=(l=a.target)==null?void 0:l.closest)==null?void 0:o.call(l,".ui-pointer"))??void 0};return i.addEventListener("pointerover",a=>{const l=r(a);l&&a.pointerType==="mouse"&&s(l,!1)}),i.addEventListener("pointerout",a=>{r(a)&&a.pointerType==="mouse"&&n()}),i.addEventListener("click",a=>{const l=r(a);l&&s(l,!0)}),i.addEventListener("focusin",a=>{const l=r(a);l&&s(l,!1)}),i.addEventListener("focusout",a=>{r(a)&&n()}),i.addEventListener("keydown",a=>{const l=r(a);l&&(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),s(l,!0))}),{off:n}}const Cm=()=>{const i=[];for(const e of me){const t=i.at(-1);t&&t.name===e.section?t.lessons.push(e):i.push({name:e.section,lessons:[e]})}return i};function f(i,e={},...t){const n=document.createElement(i);for(const[s,r]of Object.entries(e))n.setAttribute(s,r);return n.append(...t),n}function Q(i,e,t){const n=f(i,e);return n.innerHTML=t,n}const Wm=i=>c(`element_${g[i]}`);function Bm(i){return{caption:i,elements:[K(g.anweisung,{textLines:["ø"]})]}}function Kn(i){const e=i.start?Se(i.start):void 0;return e?{...e,caption:e.caption||i.title}:Bm(i.title)}class Hm{constructor(e){I(this,"element");I(this,"tab","lessons");I(this,"returnTo");I(this,"lessonId");I(this,"taskId");I(this,"body");I(this,"tips");I(this,"pointers");this.host=e,this.element=f("aside",{class:"learn","aria-label":c("web_learn_title")}),this.tips=Dm(this.element),this.pointers=Pm(this.element),Xt(Rn(ze()));const t=G.view();t&&(this.tab=["lessons","tasks","reference"].find(n=>n===t.tab)??"lessons",this.lessonId=me.some(n=>n.id===t.lesson)?t.lesson:void 0,this.taskId=$e.some(n=>n.id===t.task)?t.task:void 0),this.render()}render(){this.tips.hide(),this.pointers.off(),Xt(Rn(ze()));const e=f("div",{class:"segmented learn-tabs",role:"tablist"});for(const[t,n]of[["lessons",c("web_learn_lessons")],["tasks",c("web_learn_tasks")],["reference",c("web_learn_reference")]]){const s=f("button",{role:"tab","aria-pressed":String(this.tab===t),"data-learn-tab":t},n);s.addEventListener("click",()=>{this.tab===t&&(t==="lessons"&&(this.lessonId=void 0),t==="tasks"&&(this.taskId=void 0)),this.tab=t,this.persist(),this.render()}),e.append(s)}if(this.body=f("div",{class:"learn-body"}),this.element.replaceChildren(e,this.body),this.tab==="lessons"){const t=me.find(n=>n.id===this.lessonId);t?this.renderLesson(t):this.renderLessonList()}else if(this.tab==="tasks"){const t=$e.find(n=>n.id===this.taskId);t?this.renderTask(t):this.renderTaskList()}else{const t=Ke.map(n=>`- **${n.term}:** ${n.text}`).join(`
`);this.body.append(Q("div",{class:"learn-text learn-reference"},Ie(`${$1}

### ${c("web_learn_terms")}

${t}`)))}}persist(){G.setView({tab:this.tab,lesson:this.lessonId,task:this.taskId})}openLesson(e){this.tab="lessons",this.lessonId=e,this.returnTo=void 0,this.persist(),this.render(),this.body.scrollTop=0}renderLessonList(){this.body.append(f("p",{class:"hint"},c("web_learn_intro")));for(const e of Cm()){this.body.append(f("h3",{class:"learn-section"},e.name));const t=f("ol",{class:"learn-list"});for(const n of e.lessons){const s=G.lesson(n.id),r=s.done?"✓":s.step>0?c("web_learn_step_of_fmt",s.step+1,n.steps.length):"",a=f("button",{class:"learn-item"+(s.done?" done":""),"data-lesson":n.id},f("span",{class:"learn-num"},String(n.number)),f("span",{class:"learn-item-text"},f("strong",{},n.title),f("small",{},n.summary)),f("span",{class:"learn-status"},r));a.addEventListener("click",()=>this.openLesson(n.id)),t.append(f("li",{},a))}this.body.append(t)}this.body.append(this.renderTeacherBox())}renderLesson(e){var m;const t=G.lesson(e.id),n=Math.min(t.step,e.steps.length-1),s=e.steps[n],r=f("button",{class:"learn-back"},`← ${c("web_learn_all_lessons")}`);r.addEventListener("click",()=>this.openLesson(void 0));const a=f("nav",{class:"learn-progress","aria-label":c("web_learn_step_of_fmt",n+1,e.steps.length)});a.append(...e.steps.map((d,p)=>{const x=c("web_learn_step_fmt",p+1,d.title),y=f("button",{class:p<n?"past":p===n?"current":"",title:x,"aria-label":x},String(p+1));return p===n&&y.setAttribute("aria-current","step"),y.addEventListener("click",()=>this.goToStep(e,p)),y})),this.body.append(r,f("p",{class:"learn-kicker"},`${c("web_learn_lesson_fmt",e.number)} · ${e.section}`),f("h2",{class:"learn-title"},e.title),a,f("h3",{class:"learn-step-title"},`${n+1}. ${s.title}`));const l=((m=this.returnTo)==null?void 0:m.lesson)===e.id&&this.returnTo.step!==n?this.returnTo:void 0,o=()=>{const d=f("button",{class:"learn-return"},`↩ ${c("web_learn_back_to_checklist")}`);return d.addEventListener("click",()=>{this.returnTo=void 0,this.goToStep(e,l.step),this.body.scrollTop=l.scroll}),d};l&&this.body.append(o()),s.blocks.forEach((d,p)=>this.body.append(this.renderBlock(d,`${n}-${p}`,e))),$n(this.body),On(this.body,Ke);const u=f("div",{class:"learn-nav"}),h=f("button",{},`← ${c("web_learn_back")}`);if(h.disabled=n===0,h.addEventListener("click",()=>this.goToStep(e,n-1)),u.append(h),n<e.steps.length-1){const d=f("button",{class:"primary"},`${c("web_learn_next")} →`);d.addEventListener("click",()=>this.goToStep(e,n+1)),u.append(d)}else{const d=f("button",{class:"primary"},t.done?`✓ ${c("web_learn_done")}`:c("web_learn_finish"));d.addEventListener("click",()=>{G.updateLesson(e.id,{done:!0});const p=me.find(x=>x.number===e.number+1);this.openLesson(p==null?void 0:p.id)}),u.append(d)}this.body.append(u),l&&this.body.append(o())}goToStep(e,t){G.updateLesson(e.id,{step:t}),this.render(),this.body.scrollTop=0}renderTaskList(){this.body.append(f("p",{class:"hint"},c("web_learn_tasks_intro")));const e=f("ul",{class:"learn-list"});for(const t of $e){const n=this.taskExercises(t).every(a=>G.exercise(a.id).done),s=me.find(a=>a.number===t.after),r=f("button",{class:"learn-item"+(n?" done":""),"data-task":t.id},f("span",{class:"learn-num","aria-label":c("web_learn_level_fmt",t.level)},"★".repeat(t.level)),f("span",{class:"learn-item-text"},f("strong",{},t.title),f("small",{},s?c("web_learn_after_fmt",s.number,s.title):"")),f("span",{class:"learn-status"},n?"✓":""));r.addEventListener("click",()=>{this.taskId=t.id,this.persist(),this.render(),this.body.scrollTop=0}),e.append(f("li",{},r))}this.body.append(e,this.renderTeacherBox())}renderTeacherBox(){const e=f("details",{class:"learn-teacher"},f("summary",{},c("web_learn_teacher")));if(Yn()){e.setAttribute("open","");const r=f("button",{},c("web_learn_teacher_off"));return r.addEventListener("click",()=>{Mm(),this.render()}),e.append(f("p",{},c("web_learn_teacher_on")),r),e}const t=f("input",{type:"password",autocomplete:"off","aria-label":c("web_learn_teacher_code"),placeholder:c("web_learn_teacher_code")}),n=f("p",{class:"learn-result",role:"status"}),s=f("form",{class:"group"},t,f("button",{type:"submit"},c("web_learn_teacher_unlock")));return s.addEventListener("submit",async r=>{r.preventDefault(),await Zm(t.value)?this.render():(n.className="learn-result info",n.textContent=c("web_learn_teacher_wrong"))}),e.append(f("p",{class:"hint"},c("web_learn_teacher_intro")),s,n),e}taskExercises(e){return e.blocks.flatMap(t=>t.kind==="exercise"?[t.exercise]:[])}renderTask(e){const t=f("button",{class:"learn-back"},`← ${c("web_learn_all_tasks")}`);t.addEventListener("click",()=>{this.taskId=void 0,this.persist(),this.render()});const n=me.find(s=>s.number===e.after);if(this.body.append(t,f("h2",{class:"learn-title"},e.title)),n){const s=f("button",{class:"link-button"},c("web_learn_after_fmt",n.number,n.title));s.addEventListener("click",()=>this.openLesson(n.id)),this.body.append(f("p",{class:"learn-kicker"},s))}e.blocks.forEach((s,r)=>this.body.append(this.renderBlock(s,`task-${r}`))),$n(this.body),On(this.body,Ke)}renderBlock(e,t,n){switch(e.kind){case"markdown":return Q("div",{class:"learn-text"},Ie(e.text));case"diagram":return this.renderDiagram(e.file,e.caption);case"exercise":return this.renderExercise(e.exercise);case"checklist":return this.renderChecklist(e.items,t,n);case"quiz":return this.renderQuiz(e.questions,t,n);case"brag":return this.renderBrag(e.text);case"images":return this.renderImages(e.files,e.caption);case"graphic":return this.renderGraphic(e.file,e.caption)}}renderBrag(e){const t=f("aside",{class:"learn-brag"});t.append(f("img",{src:vm,alt:"",width:"48",height:"48"}));const n=f("div",{},f("p",{class:"learn-brag-title"},c("web_learn_brag")));return n.append(Q("div",{class:"learn-text"},Ie(e))),t.append(n),t}renderImages(e,t){const n=f("figure",{class:"learn-figure"}),s=f("div",{class:"learn-images"});for(const r of e){const a=Un(r);a&&s.append(f("img",{src:a,alt:"",loading:"lazy"}))}return n.append(s),t&&n.append(Q("figcaption",{},J(t))),n}renderGraphic(e,t){const n=f("figure",{class:"learn-figure"}),s=Un(e);return s&&n.append(f("img",{class:"learn-graphic",src:s,alt:"",loading:"lazy"})),t&&n.append(Q("figcaption",{},J(t))),n}renderDiagram(e,t){const n=Se(e),s=f("figure",{class:"learn-figure"});if(!n)return s;const r=this.host.preview(n);r&&s.append(f("div",{class:"learn-preview",dir:"ltr"},r)),t&&s.append(Q("figcaption",{},J(t)));const a=f("button",{},c("web_learn_open_in_editor"));return a.addEventListener("click",()=>this.host.openDiagram(n,e)),s.append(a),s}renderExercise(e){const t=f("section",{class:"learn-exercise","data-exercise":e.id}),n=()=>G.exercise(e.id),s=f("span",{class:"learn-badge"},`✓ ${c("web_learn_solved")}`);s.hidden=!n().done,t.append(f("h4",{},`${c("web_learn_exercise")}: ${e.title}`,s),Q("div",{class:"learn-text"},Ie(e.task)));const r=f("div",{class:"learn-result",role:"status"}),a=f("div",{class:"learn-hints"}),l=f("div",{class:"group"}),o=f("button",{class:"primary"},c("web_learn_open_exercise"));o.addEventListener("click",()=>{const m=n().xml;let d=Kn(e);if(m)try{d=tn(m)}catch{}this.host.openExercise(e,d)});const u=f("button",{},c("web_learn_check"));if(u.addEventListener("click",()=>{const m=this.host.exerciseDocument(e.id);if(!m){r.className="learn-result info",r.textContent=c("web_learn_open_first");return}if(m.elements.every($t)){r.className="learn-result info",r.textContent=c("web_learn_empty");return}this.host.stopSimulation();const d=qs(m,e.tests,this.host.subprogramsFor(e.id)),p=er(m),x=e.requires.map(b=>b==="forZaehlSchleife"?"forSchleife":b).filter(b=>b in g&&!p.has(g[b])),y=d.every(b=>b.passed)&&x.length===0;this.showResult(r,d,x,y),y&&(G.updateExercise(e.id,{done:!0}),s.hidden=!1)}),l.append(o,u),e.hints.length>0){const m=f("button",{},c("web_learn_hint"));m.addEventListener("click",()=>{const d=a.children.length;if(d>=e.hints.length)return;const p=e.hints.length>1?`**${c("web_learn_hint_fmt",d+1,e.hints.length)}:** `:"";a.append(Q("aside",{class:"lesson-note"},Ie(p+e.hints[d]))),m.textContent=c("web_learn_hint_more"),m.toggleAttribute("disabled",d+1>=e.hints.length)}),l.append(m)}const h=f("button",{class:"danger-text"},c("web_learn_reset"));if(h.addEventListener("click",()=>{if(h.dataset.confirm!=="1"){h.dataset.confirm="1",h.textContent=c("web_learn_reset_confirm"),setTimeout(()=>{h.dataset.confirm="",h.textContent=c("web_learn_reset")},4e3);return}G.resetExercise(e.id),this.host.resetExercise(e.id,Kn(e)),s.hidden=!0,r.replaceChildren(),r.className="learn-result",h.dataset.confirm="",h.textContent=c("web_learn_reset")}),l.append(h),t.append(l,a,r),Yn()&&e.solution){const m=Se(e.solution);if(m){const d=f("details",{class:"learn-solution"},f("summary",{},c("web_learn_solution")));d.addEventListener("toggle",()=>{if(!d.open||d.querySelector(".learn-preview"))return;const p=this.host.preview(m);p&&d.append(f("div",{class:"learn-preview",dir:"ltr"},p));const x=f("button",{},c("web_learn_open_in_editor"));x.addEventListener("click",()=>{this.host.openDiagram(m,e.solution);for(const y of e.subprograms){const b=Se(y);b&&this.host.openDiagram(b,y)}});for(const y of e.subprograms){const b=Se(y),z=b&&this.host.preview(b);z&&d.append(f("div",{class:"learn-preview",dir:"ltr"},z))}d.append(x)}),t.append(d)}}return t}showResult(e,t,n,s){e.className="learn-result "+(s?"ok":"fail"),e.replaceChildren(f("p",{class:"learn-result-head"},s?`🎉 ${c("web_learn_passed")}`:c("web_learn_failed")));for(const a of n)e.append(f("p",{},`✗ ${c("web_learn_missing_fmt",Wm(g[a]))}`));const r=f("ul",{class:"learn-tests",dir:"auto"});for(const a of t){const l=a.test.inputs.length?c("web_learn_input_fmt",a.test.inputs.join(", ")):c("web_learn_no_input"),o=[`${a.passed?"✓":"✗"} ${l}`],u=f("div",{class:"learn-test-detail"});u.append(f("span",{},`${c("web_learn_expected")}: `,f("code",{},a.test.expected.join(" | ")||"–")),f("span",{},`${c("web_learn_actual")}: `,f("code",{},a.result.outputs.join(" | ")||"–"))),a.result.error&&u.append(f("span",{class:"learn-error"},Jt(a.result.error))),a.result.missingInput&&u.append(f("span",{class:"learn-error"},c("web_learn_missing_input"))),a.result.tooManySteps&&u.append(f("span",{class:"learn-error"},c("web_learn_too_many_steps"))),!a.passed&&a.result.unusedInputs&&u.append(f("span",{class:"learn-error"},c("web_learn_unused_input"))),r.append(f("li",{class:a.passed?"ok":"fail"},...o,u))}e.append(r)}renderChecklist(e,t,n){const s=f("ul",{class:"learn-checklist"});return e.forEach((r,a)=>{var m;const l=`${t}-${a}`,o=f("input",{type:"checkbox"});o.checked=!!(n&&((m=G.lesson(n.id).checks)!=null&&m[l])),o.addEventListener("change",()=>{if(!n)return;const d={...G.lesson(n.id).checks??{},[l]:o.checked};G.updateLesson(n.id,{checks:d})});const u=f("label",{},o);u.insertAdjacentHTML("beforeend"," "+J(r.text));const h=f("li",{},u);if(n&&r.step!==void 0){const d=r.step,p=c("web_learn_step_fmt",d+1,n.steps[d].title),x=f("button",{class:"link-button learn-check-link",title:p,"aria-label":`${c("web_learn_review")}: ${p}`},c("web_learn_review"));x.addEventListener("click",()=>{this.returnTo={lesson:n.id,step:G.lesson(n.id).step,scroll:this.body.scrollTop},this.goToStep(n,d)}),h.append(x)}s.append(h)}),s}renderQuiz(e,t,n){const s=f("div",{class:"learn-quiz"}),r=f("p",{class:"learn-score",role:"status"}),a=()=>n?G.lesson(n.id).quiz??{}:{},l=()=>{const o=a(),u=(p,x)=>p.pairs?p.pairs.every((y,b)=>o[`${t}-${x}-${b}`]!==void 0):o[`${t}-${x}`]!==void 0,h=(p,x)=>{var y;return p.pairs?p.pairs.every((b,z)=>qn(p)[o[`${t}-${x}-${z}`]]===p.pairs[z].right):(y=p.options[o[`${t}-${x}`]])==null?void 0:y.correct},m=e.filter(u).length,d=e.filter(h).length;r.textContent=m===e.length?c("web_learn_score_fmt",d,e.length):""};return e.forEach((o,u)=>{const h=`${t}-${u}`,m=f("fieldset",{},Q("legend",{},J(o.question))),d=Q("p",{class:"learn-explanation"},J(o.explanation??""));if(o.pairs){m.append(this.renderMatch(o,h,a,n,d,l),d),s.append(m);return}const p=x=>{m.querySelectorAll("button").forEach((y,b)=>{y.classList.toggle("right",x!==void 0&&o.options[b].correct),y.classList.toggle("wrong",x===b&&!o.options[b].correct),y.setAttribute("aria-pressed",String(x===b))}),d.hidden=x===void 0||!o.explanation};o.options.forEach((x,y)=>{const b=Q("button",{class:"learn-option"},J(x.text));b.addEventListener("click",()=>{n&&G.updateLesson(n.id,{quiz:{...a(),[h]:y}}),p(y),l()}),m.append(b)}),m.append(d),p(a()[h]),s.append(m)}),s.append(r),l(),s}renderMatch(e,t,n,s,r,a){const l=e.pairs,o=qn(e),u=f("div",{class:"learn-match"});let h={};const m=()=>s?n():h,d=b=>s?G.updateLesson(s.id,{quiz:b}):h=b,p=b=>m()[`${t}-${b}`],x=l.map(b=>{const z=f("select",{class:"learn-match-select"});z.append(f("option",{value:""},"–")),o.forEach((j,_)=>z.append(f("option",{value:String(_)},j)));const v=Q("label",{class:"learn-match-left"},J(b.left));return v.append(z),u.append(v),z}),y=()=>{const b=l.every((z,v)=>p(v)!==void 0);x.forEach((z,v)=>{const j=p(v);z.value=j===void 0?"":String(j),z.classList.toggle("right",b&&o[j]===l[v].right),z.classList.toggle("wrong",b&&o[j]!==l[v].right)}),r.hidden=!b||!e.explanation};return x.forEach((b,z)=>b.addEventListener("change",()=>{const v={...m()};b.value===""?delete v[`${t}-${z}`]:v[`${t}-${z}`]=Number(b.value),d(v),y(),a()})),y(),u}}function qn(i){return(i.pairs??[]).map(e=>e.right).sort((e,t)=>e.localeCompare(t,"de"))}const Gm={left:12,top:10},Nm=8,lt=8e3,je=16,Zt=12,si="#fafafa";function ri(i){const e=i.caption.trim();return e===""?c("diagram_title_placeholder"):e}function e1(i){let e=i.trim().replace(/\.visustruct$/i,"");if(e==="")return"";for(e=e.replace(/\s/g,"-").replace(/[/:\\*?"<>|]/g,"-");e.includes("--");)e=e.replace(/--/g,"-");return e=e.replace(/^-+|-+$/g,""),e.length>120&&(e=e.slice(0,120).replace(/^-+|-+$/g,"")),e}function Em(i,e){return e1(i.caption)||e1(e)||"VisuStruct"}function Lm(i,e,t){const n=i.split(/\s+/),s=[];let r="";for(const a of n){const l=r?`${r} ${a}`:a;r&&t(l,je,"bold")>e?(s.push(r),r=a):r=l}if(r&&s.push(r),s.length>2){let a=s.slice(1).join(" ");for(;a.length>1&&t(a+"…",je,"bold")>e;)a=a.slice(0,-1);return[s[0],a+"…"]}return s}function t1(i,e,t,n=320){const s={...i,elements:i.elements.map(tt)},r=new y1(e,t).layout(s,Gm),a=Math.min(lt,Math.max(n,r.canvasSize.width)),l=Math.min(lt,Math.max(n,r.canvasSize.height));if(a<=2||l<=2)return;const o=Lm(ri(i),a-2*Zt,t),u=Math.ceil(je*1.2),h=Math.min(56,o.length*u+2),m=h+l,d=new v1(e,t).render(r,{width:a,height:l},void 0,Nm);d.setAttribute("y",String(h)),d.removeAttribute("class");const p=D("svg",{xmlns:"http://www.w3.org/2000/svg",width:a,height:m,viewBox:`0 0 ${a} ${m}`});p.append(D("rect",{x:0,y:0,width:a,height:m,fill:si}));const x=D("text",{x:Zt,y:0,"font-family":ot,"font-size":je,"font-weight":600,fill:"black"});return o.forEach((y,b)=>{const z=D("tspan",{x:Zt,y:b*u+je});z.textContent=y,x.append(z)}),p.append(x,d),{svg:p,width:a,height:m}}function ai(i){return`<?xml version="1.0" encoding="UTF-8"?>
`+new XMLSerializer().serializeToString(i.svg)}async function n1(i,e){const t=Math.max(1,Math.min(e,lt/i.width,lt/i.height)),n=URL.createObjectURL(new Blob([ai(i)],{type:"image/svg+xml"}));try{const s=new Image;s.src=n,await s.decode();const r=document.createElement("canvas");r.width=Math.round(i.width*t),r.height=Math.round(i.height*t);const a=r.getContext("2d");return a.fillStyle=si,a.fillRect(0,0,r.width,r.height),a.drawImage(s,0,0,r.width,r.height),r}finally{URL.revokeObjectURL(n)}}function Vm(i){return new Promise((e,t)=>i.toBlob(n=>n?e(n):t(new Error("PNG konnte nicht erzeugt werden.")),"image/png"))}function Fm(i,e){const s=Math.max(1,i),r=Math.max(1,e),a=y=>{const b=y.width-64,z=y.height-64;return{s:Math.min(b/s,z/r)*.98,cw:b,ch:z}},l={width:595,height:842},o={width:842,height:595},u=a(l),h=a(o),[m,d]=h.s>u.s?[o,h]:[l,u],p=s*d.s,x=r*d.s;return{page:m,draw:{x:32+(d.cw-p)/2,y:32+(d.ch-x)/2,width:p,height:x}}}async function Rm(i){const e=new Blob([i]).stream().pipeThrough(new CompressionStream("deflate"));return new Uint8Array(await new Response(e).arrayBuffer())}function i1(i){let e="FEFF";for(let t=0;t<i.length;t++)e+=i.charCodeAt(t).toString(16).padStart(4,"0").toUpperCase();return`<${e}>`}async function Um(i,e,t,n,s){const{page:r,draw:a}=Fm(n.width,n.height),l=await Rm(i),o=z=>(Math.round(z*100)/100).toString(),u=`q ${o(a.width)} 0 0 ${o(a.height)} ${o(a.x)} ${o(r.height-a.y-a.height)} cm /Im0 Do Q`,h=new TextEncoder,m=[["<< /Type /Catalog /Pages 2 0 R >>"],["<< /Type /Pages /Kids [3 0 R] /Count 1 >>"],[`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${r.width} ${r.height}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`],[`<< /Type /XObject /Subtype /Image /Width ${e} /Height ${t} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${l.length} >>
stream
`,l,`
endstream`],[`<< /Length ${u.length} >>
stream
${u}
endstream`],[`<< /Creator ${i1("VisuStruct")} /Title ${i1(s)} >>`]],d=[];let p=0;const x=z=>{const v=typeof z=="string"?h.encode(z):z;d.push(v),p+=v.length};x(`%PDF-1.4
%âãÏÓ
`);const y=[];m.forEach((z,v)=>{y.push(p),x(`${v+1} 0 obj
`),z.forEach(x),x(`
endobj
`)});const b=p;x(`xref
0 ${m.length+1}
0000000000 65535 f 
`);for(const z of y)x(`${String(z).padStart(10,"0")} 00000 n 
`);return x(`trailer
<< /Size ${m.length+1} /Root 1 0 R /Info ${m.length} 0 R >>
startxref
${b}
%%EOF
`),new Blob(d,{type:"application/pdf"})}function Ym(i){const{data:e}=i.getContext("2d").getImageData(0,0,i.width,i.height),t=new Uint8Array(i.width*i.height*3);for(let n=0,s=0;n<e.length;n+=4,s+=3)t[s]=e[n],t[s+1]=e[n+1],t[s+2]=e[n+2];return t}const s1=()=>[{description:c("web_file_type"),accept:{"application/xml":[".visustruct",".strk"]}}],Mt=i=>c(`element_${g[i]}`),Xm={[g.verzweigung]:"age >= 18",[g.whileSchleife]:"i < 10",[g.doUntilSchleife]:"again == 1",[g.fallauswahl]:"day"},Qm={statement:'int number = 5  |  double x = 1.5  |  String text = "Your text"  |  boolean ok = true  |  const double PI = 3.14',input:'input: int age "Enter age"  |  input: double price "Enter price"  |  input: String name "Enter name"',output:'output: number  |  output: "Your text"  |  output: "Your age: " + age'};function r1(i){switch(i.type){case g.anweisung:{const e=qe(i.textLines.join(`
`));return e==="input"?"input:":e==="output"?"output:":void 0}case g.verzweigung:return"if";case g.whileSchleife:case g.doUntilSchleife:return"while";case g.fallauswahl:return"switch";default:return}}function Jm(i){switch(i.type){case g.anweisung:{const e=qe(i.textLines.join(`
`));return e==="input"?'int age "Enter age"':e==="output"?'"Your age: " + age':c("inspector_placeholder_statement")}case g.verzweigung:case g.whileSchleife:case g.doUntilSchleife:case g.endlosschleife:return c("inspector_placeholder_condition");case g.fallauswahl:return c("inspector_placeholder_selector");case g.aufruf:return c("inspector_placeholder_call");case g.aussprung:return c("inspector_placeholder_break");default:return""}}function W(i,e={},...t){const n=document.createElement(i);for(const[s,r]of Object.entries(e))n.setAttribute(s,r);return n.append(...t),n}const a1=[{value:1,label:"settings_ui_scale_small"},{value:1.22,label:"settings_ui_scale_medium"},{value:1.5,label:"settings_ui_scale_large"},{value:1.82,label:"settings_ui_scale_extra_large"}],Om=/Mac|iPhone|iPad/.test(navigator.platform);function Ue(i){const e=ze(),t=e==="pt-PT"?"pt":["de","es","fr"].includes(e)?e:"en";return`${/\/app\/(index\.html)?$/.test(location.pathname)?"../":"https://visustruct.org/"}${t}/index.html${i?`#${i}`:""}`}function ue(i,e=!1){return Om?`${e?"⇧":""}⌘${i}`:[c("web_key_ctrl"),...e?[c("web_key_shift")]:[],i].join("+")}const S=qm,l1="visustruct.ui.scale.canvas",o1="visustruct.learn.open",u1="visustruct.learn.width",$m=80;class Km{constructor(e){I(this,"tabs",[]);I(this,"tabIndex",0);I(this,"nextTabSerial",1);I(this,"clipboard");I(this,"zoom",1);I(this,"simulating",!1);I(this,"exportSelect");I(this,"learn");I(this,"shell");I(this,"learning",!1);I(this,"learnButton");I(this,"exerciseSaveTimer");I(this,"resizeObserver");I(this,"renderedHostSize",{width:-1,height:-1});I(this,"simPath");I(this,"sim");I(this,"simButton");I(this,"coding",!1);I(this,"code");I(this,"codeButton");I(this,"measure",Pi());I(this,"metrics",Ci());I(this,"engine",new y1(this.metrics,this.measure));I(this,"renderer",new v1(this.metrics,this.measure));I(this,"layout");I(this,"flat",[]);I(this,"canvasHost");I(this,"svg");I(this,"overlay");I(this,"inspector");I(this,"captionInput");I(this,"undoButton");I(this,"redoButton");I(this,"deleteButton");I(this,"statusLine");I(this,"drag");I(this,"downloads",null);I(this,"inViewer","claude"in window);I(this,"tabStrip");this.root=e,this.tabs.push(this.makeTab()),this.learn=new Hm(this.learnHost()),this.shell=document.createElement("div"),this.shell.className="shell",e.replaceWith(this.shell),this.shell.append(this.learn.element,this.learnResizer(),e);const t=jt(o1),n=new URLSearchParams(location.search).has("learn");this.setLearning(n||(t===null?window.innerWidth>1100:t==="1"),!1);const s=Number(jt(l1));a1.some(a=>a.value===s)&&(this.zoom=s),this.buildUI(),this.render(),window.addEventListener("pointermove",a=>this.onPointerMove(a)),window.addEventListener("pointerup",a=>this.onPointerUp(a)),window.addEventListener("pointercancel",()=>this.endDrag()),window.addEventListener("keydown",a=>this.onKeyDown(a)),window.addEventListener("beforeunload",a=>{this.tabs.some(l=>l.dirty&&!l.exerciseId)&&a.preventDefault()}),this.setupFileDrop();const r=window.claude;r==null||r.use("downloads").then(a=>this.downloads=a)}get tab(){return this.tabs[this.tabIndex]}get doc(){return this.tab.doc}set doc(e){this.tab.doc=e}get fileName(){return this.tab.fileName??`${be(this.tab)}.visustruct`}get fileHandle(){return this.tab.fileHandle}set fileHandle(e){this.tab.fileHandle=e}get dirty(){return this.tab.dirty}set dirty(e){this.tab.dirty=e}get undoStack(){return this.tab.undoStack}get redoStack(){return this.tab.redoStack}get selected(){return this.tab.selected}set selected(e){this.tab.selected=e}buildUI(){var l;this.root.className="app",this.root.innerHTML=`
      <header class="toolbar">
        <a class="brand" href="${S(Ue())}" title="${S(c("web_site_home"))}"><span class="logo"></span>VisuStruct <small>${S(c("web_brand_suffix"))}</small></a>
        <div class="group">
          <button data-action="new" title="${S(c("a11y_new_diagram_tab"))}">${S(c("toolbar_new"))}</button>
          <button data-action="open" title="${S(c("menu_open"))} (${ue("O")})">${S(c("menu_open"))}</button>
          <button data-action="save" title="${S(c("menu_save"))} (${ue("S")})">${S(c("menu_save"))}</button>
          <select data-action="export" title="${S(c("web_export_title"))}">
            <option value="">${S(c("web_export"))}</option>
            <option value="png">${S(c("web_export_png"))}</option>
            <option value="svg">${S(c("web_export_svg"))}</option>
            <option value="pdf">${S(c("web_export_pdf"))}</option>
            <option value="print">${S(c("menu_print"))} (${ue("P")})</option>
          </select>
        </div>
        <div class="group">
          <button data-action="undo" title="${S(c("toolbar_undo"))} (${ue("Z")})" aria-label="${S(c("toolbar_undo"))}">↶</button>
          <button data-action="redo" title="${S(c("toolbar_redo"))} (${ue("Z",!0)})" aria-label="${S(c("toolbar_redo"))}">↷</button>
          <button data-action="cut" title="${S(c("ctx_cut"))} (${ue("X")})" aria-label="${S(c("ctx_cut"))}">✂︎</button>
          <button data-action="copy" title="${S(c("ctx_copy"))} (${ue("C")})" aria-label="${S(c("ctx_copy"))}">⧉</button>
          <button data-action="paste" title="${S(c("ctx_paste"))} (${ue("V")})" aria-label="${S(c("ctx_paste"))}">📋︎</button>
          <button data-action="delete" title="${S(c("action_delete_selection"))} (${S(c("web_key_delete"))})">${S(c("web_delete"))}</button>
        </div>
        <div class="group">
          <select data-action="zoom" title="${S(c("settings_ui_scale_section"))}">${a1.map(o=>`<option value="${o.value}">${S(c("web_zoom_option_fmt",c(o.label)))}</option>`).join("")}</select>
          <select data-action="language" title="${S(c("web_language_title"))}" aria-label="${S(c("web_language_title"))}">${Qe.map(o=>`<option value="${o.code}" lang="${o.code==="java"?"en":o.code}">${S(o.name)}</option>`).join("")}</select>
        </div>
        <div class="group">
          <button data-action="learn" aria-pressed="false" title="${S(c("web_learn_toggle_title"))}">🎓 ${S(c("web_learn_title"))}</button>
          <button data-action="code" aria-pressed="false" title="${S(c("a11y_generate_code"))}">{ } Code</button>
          <button data-action="simulate" class="sim-toggle" aria-pressed="false" title="${S(c("web_simulation_start_title"))}">▶︎ ${S(c("action_simulation"))}</button>
        </div>
      </header>
      <aside class="palette">
        <h2>${S(c("palette_header"))}</h2>
        <p class="hint">${S(c("web_palette_hint"))}</p>
        <ul></ul>
      </aside>
      <main class="workspace">
        <nav class="tabs" aria-label="${S(c("web_tabs_label"))}"></nav>
        <input class="caption" placeholder="${S(c("diagram_title_placeholder"))}" aria-label="${S(c("diagram_title_label"))}" />
        <div class="canvas" dir="ltr"></div>
      </main>
      <aside class="inspector"></aside>
      <footer class="statusbar">
        <span class="status"></span>
        <nav class="site-links" aria-label="VisuStruct">
          <a href="${S(Ue())}">${S(c("web_site_home"))}</a>
          <a href="${S(Ue("contact"))}" target="_blank" rel="noopener">${S(c("web_site_imprint"))}</a>
          <a href="${S(Ue("privacy"))}" target="_blank" rel="noopener">${S(c("web_site_privacy"))}</a>
        </nav>
      </footer>
      <input type="file" accept=".visustruct,.strk,.xml" hidden />
    `;const e=o=>this.root.querySelector(o);this.canvasHost=e(".canvas"),this.inspector=e(".inspector"),this.captionInput=e(".caption"),this.undoButton=e("[data-action=undo]"),this.redoButton=e("[data-action=redo]"),this.deleteButton=e("[data-action=delete]"),this.statusLine=e(".status"),this.simButton=e("[data-action=simulate]"),this.sim=new jm(()=>this.doc,o=>{this.simPath=o,this.simulating&&this.renderDiagramOnly(),this.scrollToSimPath()},o=>this.findSubprogram(o),()=>this.setSimulating(!1)),this.root.append(this.sim.element),this.simButton.addEventListener("click",()=>this.setSimulating(!this.simulating)),this.codeButton=e("[data-action=code]"),this.code=new Js(()=>this.doc,(o,u)=>this.offerDownload(o,new Blob([u],{type:"text/plain"})),()=>this.setCoding(!1),o=>this.commit({...this.doc,pseudocode:o||void 0}),()=>this.tabs.filter(o=>o!==this.tab&&de(o.doc.caption)).map(o=>o.doc)),this.root.append(this.code.element),this.codeButton.addEventListener("click",()=>this.setCoding(!this.coding));const t=e(".palette ul");for(const{item:o}of In){const u=Mt(Ee(o).type),h=document.createElement("li");h.className="palette-item",h.dataset.item=o,h.append(this.paletteIcon(o),document.createTextNode(u)),h.addEventListener("pointerdown",m=>this.beginDrag(m,{kind:"palette",item:o})),h.tabIndex=0,h.addEventListener("keydown",m=>{(m.key==="Enter"||m.key===" ")&&this.insertNearSelection(Ee(o))}),t.append(h)}this.learnButton=e("[data-action=learn]"),this.learnButton.addEventListener("click",()=>this.setLearning(!this.learning)),this.learnButton.setAttribute("aria-pressed",String(this.learning)),this.tabStrip=e(".tabs"),this.exportSelect=e("[data-action=export]"),this.exportSelect.addEventListener("change",()=>{const o=this.exportSelect.value;this.exportSelect.value="",o&&this.exportDiagram(o)});const n=e("[data-action=language]");n.value=ze(),n.addEventListener("change",()=>void this.changeLanguage(n.value));const s=e("[data-action=zoom]");s.value=String(this.zoom),s.addEventListener("change",()=>{this.zoom=Number(s.value),Tt(l1,s.value),this.renderDiagramOnly()}),e("[data-action=cut]").addEventListener("click",()=>this.cutSelection()),e("[data-action=copy]").addEventListener("click",()=>this.copySelection()),e("[data-action=paste]").addEventListener("click",()=>this.paste());const r=e("input[type=file]");r.addEventListener("change",async()=>{var u;const o=(u=r.files)==null?void 0:u[0];r.value="",o&&this.loadXML(await o.text(),o.name)}),e("[data-action=new]").addEventListener("click",()=>this.addTab()),e("[data-action=open]").addEventListener("click",()=>this.open(r)),e("[data-action=save]").addEventListener("click",()=>this.save()),this.undoButton.addEventListener("click",()=>this.undo()),this.redoButton.addEventListener("click",()=>this.redo()),this.deleteButton.addEventListener("click",()=>this.deleteSelection());let a;this.captionInput.addEventListener("focus",()=>a=this.doc),this.captionInput.addEventListener("input",()=>{this.doc={...this.doc,caption:this.captionInput.value},this.dirty=!0,this.updateStatus()}),this.captionInput.addEventListener("change",()=>{a&&a.caption!==this.doc.caption&&this.pushUndo(a),a=this.doc}),this.canvasHost.addEventListener("pointerdown",o=>this.onCanvasPointerDown(o)),(l=this.resizeObserver)==null||l.disconnect(),this.resizeObserver=new ResizeObserver(()=>{const{clientWidth:o,clientHeight:u}=this.canvasHost;o===this.renderedHostSize.width&&u===this.renderedHostSize.height||this.renderDiagramOnly()}),this.resizeObserver.observe(this.canvasHost)}async changeLanguage(e){this.setSimulating(!1),this.setCoding(!1),await M1(e),li(),this.sim.end(),this.buildUI(),this.render(),this.learn.render()}setLearning(e,t=!0){var n;this.learning=e,this.shell.classList.toggle("learning",e),(n=this.learnButton)==null||n.setAttribute("aria-pressed",String(e)),t&&Tt(o1,e?"1":"0"),this.canvasHost&&this.renderDiagramOnly()}learnHost(){return{openExercise:(e,t)=>{const n=this.tabs.findIndex(r=>r.exerciseId===e.id);if(n>=0){this.switchTab(n),this.setSimulating(!1);return}const s=this.makeTab();s.doc=t,s.exerciseId=e.id,s.selected=t.elements.length>0?[0]:void 0,this.isPristine(this.tab)?this.tabs[this.tabIndex]=s:this.tabs.push(s),this.tabIndex=this.tabs.indexOf(s),this.setSimulating(!1),this.render()},openDiagram:(e,t)=>{this.loadXML(ft(e),e.caption.trim()?`${e.caption.trim()}.visustruct`:t)},exerciseDocument:e=>{var t;return(t=this.tabs.find(n=>n.exerciseId===e))==null?void 0:t.doc},subprogramsFor:e=>{const t=this.tabs.find(n=>n.exerciseId===e);return n=>this.findSubprogram(n,t)},stopSimulation:()=>this.setSimulating(!1),resetExercise:(e,t)=>{const n=this.tabs.find(s=>s.exerciseId===e);n&&(n.undoStack.push(n.doc),n.doc=t,n.redoStack=[],n.selected=[0],n===this.tab&&this.render())},preview:e=>{const t=t1(e,this.metrics,this.measure,0);if(!t)return;const n=t.svg.getAttribute("width");return n&&(t.svg.style.maxWidth=`${n}px`),t.svg.removeAttribute("width"),t.svg.removeAttribute("height"),t.svg}}}isPristine(e){return!e.dirty&&!e.fileName&&!e.exerciseId&&e.undoStack.length===0}rememberExercise(){const e=this.tab;e.exerciseId&&(clearTimeout(this.exerciseSaveTimer),this.exerciseSaveTimer=window.setTimeout(()=>{e.exerciseId&&G.updateExercise(e.exerciseId,{xml:ft(e.doc)})},300))}paletteIcon(e){const t=D("svg",{viewBox:"0 0 28 20",width:28,height:20,class:"icon"}),n={fill:"none",stroke:"currentColor","stroke-width":1.5};t.append(D("rect",{x:1,y:1,width:26,height:18,...n}));const s=r=>t.append(D("path",{d:r,...n}));switch(e){case"verzweigung":s("M1 1 L14 10 L27 1 M14 10 V19");break;case"fallauswahl":s("M1 1 L20 10 L27 1 M1 10 H27 M10 10 V19 M20 10 V19");break;case"forZaehlSchleife":case"whileSchleife":s("M7 7 H27 M7 7 V19");break;case"doUntilSchleife":s("M7 1 V13 H27");break;case"endlosschleife":s("M7 6 H27 M7 6 V14 H27");break;case"aufruf":s("M5 1 V19 M23 1 V19");break;case"aussprung":s("M6 1 L1 10 L6 19");break}return t}render(){const e={...this.doc,elements:this.doc.elements.map(tt)};this.layout=this.engine.layout(e),this.flat=Ei(this.layout.elements),this.selected&&!q(this.doc,this.selected)&&(this.selected=void 0);const t=this.zoom,n=this.canvasHost;this.renderedHostSize={width:n.clientWidth,height:n.clientHeight};const s={width:Math.max(320,this.layout.canvasSize.width,Math.floor(n.clientWidth/t)),height:Math.max(240,this.layout.canvasSize.height+60,Math.floor(n.clientHeight/t))};this.renderer.usesSimulationHighlight=this.simulating,this.svg=this.renderer.render(this.layout,s,this.simulating?this.simPath:this.selected),this.svg.setAttribute("width",String(Math.floor(s.width*t))),this.svg.setAttribute("height",String(Math.floor(s.height*t))),this.overlay=D("g",{class:"drop-overlay"}),this.svg.append(this.overlay),this.canvasHost.replaceChildren(this.svg),document.activeElement!==this.captionInput&&(this.captionInput.value=this.doc.caption),this.undoButton.disabled=this.simulating||this.undoStack.length===0,this.redoButton.disabled=this.simulating||this.redoStack.length===0,this.deleteButton.disabled=this.simulating||!this.selected||!xt(this.doc,this.selected),this.captionInput.readOnly=this.simulating,this.codeButton.disabled=this.simulating,this.exportSelect.disabled=this.simulating,this.coding&&this.code.refresh(),this.renderTabs(),this.renderInspector(),this.updateStatus()}updateStatus(){this.rememberExercise(),document.title=`${this.dirty?"• ":""}${this.fileName} – VisuStruct Web`,this.statusLine.textContent=`${this.fileName}${this.dirty?` (${c("web_status_modified")})`:""}`}renderInspector(){const e=this.selected,t=e?q(this.doc,e):void 0,n=this.inspector;if(!e||!t){n.replaceChildren(W("h2",{},c("web_inspector_title")),W("p",{class:"hint"},c("inspector_no_selection")),W("p",{class:"hint"},c("web_inspector_help_drop")),W("p",{class:"hint"},c("web_inspector_help_files")));return}if(n.replaceChildren(W("h2",{},`${c("web_inspector_title")} · ${Mt(t.type)}`)),t.type===g.anweisung){const s=qe(t.textLines.join(`
`)),r=W("div",{class:"segmented",role:"group","aria-label":c("inspector_io_mode_title")});for(const[a,l]of[["statement",c("inspector_io_mode_statement")],["input",c("inspector_io_mode_input")],["output",c("inspector_io_mode_output")]]){const o=W("button",{"aria-pressed":String(a===s)},l);o.addEventListener("click",()=>{var m,d;const u=((m=q(this.doc,e))==null?void 0:m.textLines.join(`
`))??"";if(a===qe(u))return;const h=Mi(a,u);this.commit(pt(this.doc,e,h.split(`
`))),(d=this.inspector.querySelector("textarea"))==null||d.focus()}),r.append(o)}n.append(r,W("p",{class:"hint mono-hint"},Qm[s]))}if(t.type===g.forSchleife){const s=W("div",{class:"for-fields"}),r=xn(t.textLines);[[c("inspector_for_init"),c("inspector_for_placeholder_init")],[c("inspector_for_condition"),c("inspector_for_placeholder_condition")],[c("inspector_for_step"),c("inspector_for_placeholder_step")]].forEach(([l,o],u)=>{const h=W("input",{placeholder:o,spellcheck:"false",autocomplete:"off"});h.value=r[u],this.liveEdit(h,m=>{const d=q(this.doc,e);if(!d)return;const p=xn(d.textLines);return p[u]=Ti(m),pt(this.doc,e,p)}),s.append(W("label",{},l,h))}),n.append(s)}else if(t.type!==g.leerElement){const s=Xm[t.type];s&&n.append(W("p",{class:"hint mono-hint"},s));const r=r1(t),a=W("textarea",{rows:"3",spellcheck:"false"}),l=t.textLines.join(`
`);a.value=r?pn(r,l):l,a.placeholder=Jm(t),a.addEventListener("focus",()=>{a.value.trim()==="ø"&&a.select()}),this.liveEdit(a,u=>{const h=r1(q(this.doc,e)??t),m=h?ji(h,pn(h,u)):u;return pt(this.doc,e,m.split(`
`))});const o=W("div",{class:"editor-row"});r&&o.append(W("span",{class:"fixed-prefix"},r)),o.append(a),n.append(o)}this.renderCaseControls(e)}renderCaseControls(e){var o;const t=ki(e,this.doc);if(!t)return;const n=((o=q(this.doc,t))==null?void 0:o.cases)??[],s=Si(e,t),r=W("div",{class:"case-controls"});if(s!==void 0&&n[s]){const u=W("input",{placeholder:c("web_case_name_placeholder"),spellcheck:"false",autocomplete:"off"});u.value=n[s].name,this.liveEdit(u,h=>h.trim()===""?void 0:vi(this.doc,t,s,h)),r.append(W("label",{},c("web_case_name"),u))}const a=W("button",{},`＋ ${c("inspector_add_case")}`);a.addEventListener("click",()=>{const u=zi(this.doc,t);this.commit(u.doc,u.path)});const l=W("button",{class:"danger-text"},`－ ${c("inspector_remove_case")}`);l.disabled=n.length<=2||s===void 0,l.addEventListener("click",()=>{if(s===void 0)return;const u=wi(this.doc,t,s);this.commit(u.doc,u.path)}),r.append(W("div",{class:"group"},a,l)),this.inspector.append(r)}liveEdit(e,t){let n;e.addEventListener("focus",()=>n=this.doc),e.addEventListener("input",()=>{const s=p1(e.value);if(s!==e.value){const a=e.selectionStart;e.value=s,e.setSelectionRange(a,a)}const r=t(s);r&&(this.doc=r,this.dirty=!0,this.renderDiagramOnly())}),e.addEventListener("blur",()=>{n&&n!==this.doc&&this.pushUndo(n),n=void 0,this.renderDiagramOnly()})}renderDiagramOnly(){const e=this.selected,t=this.inspector,n=document.createElement("aside");this.inspector=n,this.render(),this.inspector=t,this.selected=e}setSimulating(e){e!==this.simulating&&(document.activeElement instanceof HTMLElement&&document.activeElement.blur(),this.endDrag(),this.simulating=e,this.root.classList.toggle("simulating",e),this.simButton.setAttribute("aria-pressed",String(e)),this.simButton.textContent=e?`✎ ${c("action_diagram")}`:`▶︎ ${c("action_simulation")}`,this.simButton.title=c(e?"web_simulation_end_title":"web_simulation_start_title"),e?(this.setCoding(!1),this.sim.begin()):(this.sim.end(),this.simPath=void 0,!this.selected&&this.doc.elements.length>0&&(this.selected=[0])),this.render())}setCoding(e){e!==this.coding&&(this.coding=e,this.root.classList.toggle("coding",e),this.codeButton.setAttribute("aria-pressed",String(e)),e?this.code.refresh():this.code.close(),this.renderDiagramOnly())}learnResizer(){const e=this.learn.element,t=W("div",{class:"learn-resizer",role:"separator","aria-orientation":"vertical",tabindex:"0",title:c("web_learn_resize")}),n=(a,l)=>{e.style.width=a===void 0?"":`${h1(a)}px`,l&&Tt(u1,a===void 0?"":String(h1(a)))},s=Number(jt(u1));s>0&&n(s,!1);const r=()=>getComputedStyle(this.shell).direction==="rtl"?-1:1;return t.addEventListener("pointerdown",a=>{if(a.button!==0)return;a.preventDefault(),t.setPointerCapture(a.pointerId);const l=a.clientX,o=e.getBoundingClientRect().width,u=r();this.shell.classList.add("resizing");const h=d=>n(o+u*(d.clientX-l),!1),m=d=>{t.removeEventListener("pointermove",h),t.removeEventListener("pointerup",m),t.removeEventListener("pointercancel",m),this.shell.classList.remove("resizing"),n(o+u*(d.clientX-l),!0)};t.addEventListener("pointermove",h),t.addEventListener("pointerup",m),t.addEventListener("pointercancel",m)}),t.addEventListener("dblclick",()=>n(void 0,!0)),t.addEventListener("keydown",a=>{const l=a.key==="ArrowRight"?20:a.key==="ArrowLeft"?-20:0;l&&(a.preventDefault(),n(e.getBoundingClientRect().width+r()*l,!0))}),t}findSubprogram(e,t=this.tab){const n=_t(e);if(n==="")return;const s=this.tabs.find(r=>r!==t&&(_t(r.doc.caption)===n||_t(be(r))===n));return s==null?void 0:s.doc}scrollToSimPath(){const e=this.simPath;if(!this.simulating||!e)return;const t=this.flat.find(l=>Bt(l.idPath,e));if(!t)return;const n=this.canvasHost,s=this.zoom,r={x:t.frame.x*s,y:t.frame.y*s,width:t.frame.width*s,height:t.frame.height*s},a=24;r.y<n.scrollTop?n.scrollTop=Math.max(0,r.y-a):r.y+Math.min(r.height,n.clientHeight-2*a)>n.scrollTop+n.clientHeight&&(n.scrollTop=r.y-a),(r.x<n.scrollLeft||r.x>n.scrollLeft+n.clientWidth-a)&&(n.scrollLeft=Math.max(0,r.x-a))}commit(e,t){this.pushUndo(this.doc),this.doc=e,this.dirty=!0,t&&(this.selected=t),this.render()}pushUndo(e){for(this.undoStack.push(e);this.undoStack.length>$m;)this.undoStack.shift();this.tab.redoStack=[]}undo(){const e=this.undoStack.pop();e&&(this.redoStack.push(this.doc),this.doc=e,this.dirty=!0,this.selected=cn(this.selected,this.doc),this.render())}redo(){const e=this.redoStack.pop();e&&(this.undoStack.push(this.doc),this.doc=e,this.dirty=!0,this.selected=cn(this.selected,this.doc),this.render())}resetHistory(){this.setSimulating(!1),this.tab.undoStack=[],this.tab.redoStack=[],this.selected=void 0,this.dirty=!1,this.render()}makeTab(){return{doc:bi(),serial:this.nextTabSerial++,dirty:!1,undoStack:[],redoStack:[],selected:[0]}}addTab(e=this.makeTab()){this.setSimulating(!1),this.tabs.push(e),this.tabIndex=this.tabs.length-1,this.render()}switchTab(e){e===this.tabIndex||!this.tabs[e]||(document.activeElement instanceof HTMLElement&&document.activeElement.blur(),this.setSimulating(!1),this.tabIndex=e,this.render())}async closeTab(e){if(this.tabs.length<=1)return;const t=this.tabs[e];t.dirty&&!t.exerciseId&&(this.switchTab(e),!await this.confirmDiscard())||(this.setSimulating(!1),this.tabs.splice(e,1),(this.tabIndex>e||this.tabIndex>=this.tabs.length)&&(this.tabIndex=Math.max(0,this.tabIndex-1)),this.render())}renderTabs(){const e=this.tabStrip;e.replaceChildren(),this.tabs.forEach((n,s)=>{const r=document.createElement("div");r.className="tab"+(s===this.tabIndex?" active":""),r.setAttribute("role","tab"),r.setAttribute("aria-selected",String(s===this.tabIndex));const a=document.createElement("button");if(a.className="tab-label",a.textContent=(n.dirty?"• ":"")+be(n),a.title=n.fileName??be(n),a.addEventListener("click",()=>this.switchTab(s)),r.append(a),this.tabs.length>1){const l=document.createElement("button");l.className="tab-close",l.textContent="✕",l.title=c("a11y_close_tab"),l.setAttribute("aria-label",`${c("a11y_close_tab")}: ${be(n)}`),l.addEventListener("click",()=>this.closeTab(s)),r.append(l)}e.append(r)});const t=document.createElement("button");t.className="tab-add",t.textContent="+",t.title=c("a11y_new_diagram_tab"),t.setAttribute("aria-label",c("a11y_new_diagram_tab")),t.addEventListener("click",()=>this.addTab()),e.append(t)}copySelection(){const e=this.selected&&q(this.doc,this.selected);return e?(this.clipboard=structuredClone(e),this.showMessage(c("web_copied")),!0):!1}cutSelection(){this.selected&&xt(this.doc,this.selected)&&this.copySelection()&&this.deleteSelection()}paste(){this.clipboard&&this.insertNearSelection(structuredClone(this.clipboard))}deleteSelection(){!this.selected||!xt(this.doc,this.selected)||(this.commit(Ae(this.doc,this.selected)),this.selected=void 0,this.render())}insertNearSelection(e){const t=this.selected;if(t&&ye(this.doc,t))return this.commit(ce(this.doc,t,e),t);if(t){const n=[...t.slice(0,-1),t[t.length-1]+1];return this.commit(At(this.doc,e,t),n)}if(this.doc.elements.length===1&&ye(this.doc,[0]))return this.commit(ce(this.doc,[0],e),[0]);this.commit(Ze(this.doc,[],this.doc.elements.length,e),[this.doc.elements.length])}confirmDiscard(){return this.dirty?new Promise(e=>{const t=document.createElement("div");t.className="confirm",t.innerHTML=`<div class="confirm-card" role="alertdialog" aria-label="${S(c("close_unsaved_title"))}">
        <p><strong>${S(c("close_unsaved_title"))}</strong></p>
        <p class="hint">${S(c("web_discard_message_fmt",this.fileName))}</p>
        <div class="group"><button data-r="0">${S(c("close_unsaved_cancel"))}</button><button data-r="1" class="danger">${S(c("close_unsaved_discard"))}</button></div>
      </div>`,t.addEventListener("click",n=>{const s=n.target.dataset.r;s===void 0&&n.target!==t||(t.remove(),e(s==="1"))}),document.body.append(t),t.querySelector('[data-r="0"]').focus()}):Promise.resolve(!0)}showMessage(e){this.statusLine.textContent=e,this.statusLine.classList.add("message"),setTimeout(()=>{this.statusLine.classList.remove("message"),this.updateStatus()},6e3)}loadXML(e,t,n){let s;try{s=tn(e)}catch(r){this.showMessage(c("web_err_unreadable_fmt",t,r.message));return}(this.dirty||this.tab.fileName||this.tab.exerciseId)&&this.addTab(),this.doc=s,this.tab.fileName=t.replace(/\.(strk|xml)$/i,".visustruct"),this.fileHandle=n&&/\.visustruct$/i.test(t)?n:void 0,this.resetHistory()}async open(e){const t=window;if(!t.showOpenFilePicker||this.inViewer)return e.click();try{const[n]=await t.showOpenFilePicker({types:s1()}),s=await n.getFile();this.loadXML(await s.text(),s.name,n)}catch{}}async save(){var n,s;const e=new Blob([ft(this.doc)],{type:"application/xml"}),t=window;try{if(this.downloads){const r=this.fileName+".txt";await this.downloads.save({filename:r,data:e}),(n=this.tab).fileName??(n.fileName=this.fileName),this.dirty=!1,this.render(),this.showMessage(c("web_saved_txt_fmt",r));return}if(!this.fileHandle&&t.showSaveFilePicker&&!this.inViewer&&(this.fileHandle=await t.showSaveFilePicker({suggestedName:this.fileName,types:s1()}),this.tab.fileName=this.fileHandle.name),this.fileHandle){const r=await this.fileHandle.createWritable();await r.write(e),await r.close()}else{const r=document.createElement("a");r.href=URL.createObjectURL(e),r.download=this.fileName,r.click(),setTimeout(()=>URL.revokeObjectURL(r.href),1e3)}(s=this.tab).fileName??(s.fileName=this.fileName),this.dirty=!1,this.render()}catch{}}async exportDiagram(e){const t=t1(this.doc,this.metrics,this.measure);if(!t){this.showMessage(c(e==="print"?"err_diagram_too_small_print":"err_diagram_too_small_export"));return}const n=Em(this.doc,be(this.tab)),s=Math.max(2,window.devicePixelRatio||1)*this.zoom;try{switch(e){case"svg":{t.svg.setAttribute("width",String(t.width*this.zoom)),t.svg.setAttribute("height",String(t.height*this.zoom)),await this.offerDownload(`${n}.svg`,new Blob([ai(t)],{type:"image/svg+xml"}));break}case"png":{const r=await n1(t,s);await this.offerDownload(`${n}.png`,await Vm(r));break}case"pdf":{const r=await n1(t,Math.max(s,3)),a=await Um(Ym(r),r.width,r.height,t,ri(this.doc));await this.offerDownload(`${n}.pdf`,a);break}case"print":this.printDiagram(t);break}}catch(r){this.showMessage(c("web_export_failed_fmt",r instanceof Error?r.message:String(r)))}}printDiagram(e){const t=document.createElement("div");t.className="print-sheet",e.svg.removeAttribute("width"),e.svg.removeAttribute("height"),t.append(e.svg),document.body.append(t);const n=()=>t.remove();window.addEventListener("afterprint",n,{once:!0});try{window.print()}catch{n(),this.showMessage(`${c("err_print_unavailable")} ${c("web_print_hint")}`);return}setTimeout(n,6e4)}async offerDownload(e,t){try{if(this.downloads){try{await this.downloads.save({filename:e,data:t}),this.showMessage(c("web_saved_fmt",e))}catch{await this.downloads.save({filename:e+".txt",data:t}),this.showMessage(c("web_saved_txt_fmt",e+".txt"))}return}const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),setTimeout(()=>URL.revokeObjectURL(n.href),1e3)}catch{this.showMessage(c("err_save_failed_fmt",e))}}setupFileDrop(){window.addEventListener("dragover",e=>{var t;(t=e.dataTransfer)!=null&&t.types.includes("Files")&&(e.preventDefault(),this.root.classList.add("file-drag"))}),window.addEventListener("dragleave",e=>{e.relatedTarget===null&&this.root.classList.remove("file-drag")}),window.addEventListener("drop",async e=>{var n;this.root.classList.remove("file-drag");const t=(n=e.dataTransfer)==null?void 0:n.files[0];t&&(e.preventDefault(),this.loadXML(await t.text(),t.name))})}onKeyDown(e){var s;const t=e.metaKey||e.ctrlKey,n=e.target instanceof HTMLTextAreaElement||e.target instanceof HTMLInputElement;if(t&&e.key.toLowerCase()==="s")e.preventDefault(),this.save();else if(t&&e.key.toLowerCase()==="p")e.preventDefault(),this.simulating||this.exportDiagram("print");else if(t&&e.key.toLowerCase()==="o")e.preventDefault(),this.open(this.root.querySelector("input[type=file]"));else{if(n||this.simulating)return;t&&e.key.toLowerCase()==="z"?(e.preventDefault(),e.shiftKey?this.redo():this.undo()):t&&e.key.toLowerCase()==="c"&&!((s=getSelection())!=null&&s.toString())?this.copySelection()&&e.preventDefault():t&&e.key.toLowerCase()==="x"?(e.preventDefault(),this.cutSelection()):t&&e.key.toLowerCase()==="v"?(e.preventDefault(),this.paste()):t&&e.key.toLowerCase()==="y"?(e.preventDefault(),this.redo()):e.key==="Delete"||e.key==="Backspace"?(e.preventDefault(),this.deleteSelection()):e.key==="Escape"&&(this.drag?this.endDrag():(this.selected=void 0,this.render()))}}svgPoint(e,t){if(!this.svg)return;const n=this.svg.getBoundingClientRect(),s=e-n.left,r=t-n.top;if(!(s<0||r<0||s>n.width||r>n.height))return{x:s/this.zoom,y:r/this.zoom}}nodeAt(e,t){for(let n=this.flat.length-1;n>=0;n--){const s=this.flat[n].frame;if(e>=s.x&&e<=s.x+s.width&&t>=s.y&&t<=s.y+s.height)return this.flat[n]}}onCanvasPointerDown(e){if(this.simulating)return;const t=this.svgPoint(e.clientX,e.clientY);if(!t)return;document.activeElement instanceof HTMLElement&&document.activeElement.blur();const n=this.nodeAt(t.x,t.y),s=n&&this.selected&&Bt(n.idPath,this.selected);this.selected=n==null?void 0:n.idPath,this.render(),n&&e.pointerType!=="touch"&&!(ye(this.doc,n.idPath)&&!s)&&this.beginDrag(e,{kind:"move",path:n.idPath})}beginDrag(e,t){e.button!==0||this.simulating||(e.preventDefault(),this.drag={source:t,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,active:!1})}onPointerMove(e){const t=this.drag;if(!t||e.pointerId!==t.pointerId)return;if(!t.active){if(Math.hypot(e.clientX-t.startX,e.clientY-t.startY)<5)return;t.active=!0,t.ghost=this.makeGhost(t.source),document.body.append(t.ghost),this.root.classList.add("dragging")}t.ghost.style.transform=`translate(${e.clientX+12}px, ${e.clientY+12}px)`,this.autoScroll(e.clientX,e.clientY);const n=this.svgPoint(e.clientX,e.clientY);t.target=n?this.dropTargetAt(n.x,n.y,t.source):void 0,this.showDropTarget(t.target)}onPointerUp(e){const t=this.drag;!t||e.pointerId!==t.pointerId||(t.active&&t.target?this.applyDrop(t.source,t.target):!t.active&&t.source.kind==="palette"&&this.insertNearSelection(Ee(t.source.item)),this.endDrag())}endDrag(){var e,t;(t=(e=this.drag)==null?void 0:e.ghost)==null||t.remove(),this.drag=void 0,this.root.classList.remove("dragging"),this.showDropTarget(void 0)}makeGhost(e){const t=document.createElement("div");if(t.className="drag-ghost",e.kind==="palette")t.textContent=In.find(n=>n.item===e.item).label;else{const n=ne(this.doc,e.path);t.textContent=`${Mt(n.type)}: ${Ot(n)[0]}`}return t}autoScroll(e,t){const n=this.canvasHost.getBoundingClientRect(),s=40,r=12;t>n.bottom-s&&t<n.bottom+s?this.canvasHost.scrollTop+=r:t<n.top+s&&t>n.top-s&&(this.canvasHost.scrollTop-=r),e>n.right-s&&e<n.right+s?this.canvasHost.scrollLeft+=r:e<n.left+s&&e>n.left-s&&(this.canvasHost.scrollLeft-=r)}dropTargetAt(e,t,n){var o;const s=((o=this.layout)==null?void 0:o.elements)??[],r=this.nodeAt(e,t);if(!r){const u=s[s.length-1];if(!u)return;const h=u.frame.y+u.frame.height;return t>h?n.kind==="move"&&n.path.length===1&&n.path[0]===s.length-1?void 0:{kind:"rootAppend",frame:{x:u.frame.x,y:h,width:u.frame.width,height:0}}:t<s[0].frame.y?{kind:"before",path:[0],frame:s[0].frame}:void 0}const a=r.idPath;return n.kind==="move"&&a.length>=n.path.length&&n.path.every((u,h)=>a[h]===u)?void 0:ye(this.doc,a)?{kind:"replace",path:a,frame:r.frame}:{kind:t<r.frame.y+r.frame.height/2?"before":"after",path:a,frame:r.frame}}showDropTarget(e){if(!this.overlay||(this.overlay.replaceChildren(),!e))return;const t=e.frame;if(e.kind==="replace"){this.overlay.append(D("rect",{x:t.x+2,y:t.y+2,width:t.width-4,height:t.height-4,class:"drop-replace"}));return}const n=e.kind==="before"?t.y:t.y+t.height;this.overlay.append(D("rect",{x:t.x,y:n-3,width:t.width,height:6,rx:3,class:"drop-line"}))}applyDrop(e,t){const n=this.doc;try{if(e.kind==="palette"){const r=Ee(e.item);switch(t.kind){case"replace":return this.commit(ce(n,t.path,r),t.path);case"before":return this.commit(d1(n,r,t.path),t.path);case"after":return this.commit(At(n,r,t.path),[...t.path.slice(0,-1),t.path[t.path.length-1]+1]);case"rootAppend":return this.commit(Ze(n,[],n.elements.length,r),[n.elements.length])}}const s=e.path;switch(t.kind){case"replace":return this.commit(yi(n,s,t.path));case"before":return this.commit(fi(n,s,t.path));case"after":return this.commit(Ii(n,s,t.path));case"rootAppend":{const r=ne(n,s);return this.commit(Ze(Ae(n,s),[],Number.MAX_SAFE_INTEGER,r))}}}catch(s){console.warn("Ablegen nicht möglich",s)}finally{e.kind==="move"&&(this.selected=void 0,this.render())}}}function li(){xi({[g.anweisung]:c("canvas_stub_anweisung"),[g.verzweigung]:c("canvas_stub_condition"),[g.fallauswahl]:c("canvas_stub_fallauswahl"),[g.forSchleife]:c("canvas_stub_for"),[g.whileSchleife]:c("canvas_stub_while"),[g.doUntilSchleife]:c("canvas_stub_while"),[g.endlosschleife]:c("canvas_stub_endless"),[g.aussprung]:c("canvas_stub_break"),[g.aufruf]:c("canvas_stub_call")})}function _t(i){return st(i).toLowerCase()}function be(i){return i.fileName?i.fileName.replace(/\.(visustruct|strk)$/i,""):i.doc.caption.trim()||c("tab_title_format",i.serial)}function h1(i){return Math.round(Math.max(260,Math.min(i,720,window.innerWidth-420)))}function jt(i){try{return localStorage.getItem(i)}catch{return null}}function Tt(i,e){try{localStorage.setItem(i,e)}catch{}}function qm(i){return i.replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}M1(Xi(),!1).then(()=>{li(),new Km(document.getElementById("app"))});
