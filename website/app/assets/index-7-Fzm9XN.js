var ri=Object.defineProperty;var ai=(i,e,t)=>e in i?ri(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var I=(i,e,t)=>ai(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();var g=(i=>(i[i.anweisung=0]="anweisung",i[i.verzweigung=1]="verzweigung",i[i.fallauswahl=2]="fallauswahl",i[i.forSchleife=3]="forSchleife",i[i.whileSchleife=4]="whileSchleife",i[i.doUntilSchleife=5]="doUntilSchleife",i[i.endlosschleife=6]="endlosschleife",i[i.aussprung=7]="aussprung",i[i.aufruf=8]="aufruf",i[i.leerElement=9]="leerElement",i))(g||{});function li(i){return i===3||i===4||i===5||i===6}function oi(i){return i===1||i===2}function Q(i,e={}){return{type:i,zoomX:0,zoomY:0,textLines:[""],...e}}function ui(i){const e=i.textLines;if(!e.every(t=>t.trim()===""))switch(i.type){case g.forSchleife:return e.length<=1?e:[di(e)];case g.verzweigung:return Ce("if",e);case g.whileSchleife:return Ce("while",e);case g.doUntilSchleife:return Ce("while",ci(e));case g.fallauswahl:return Ce("switch",e);default:return e}}function ci(i){if(i.length===0)return i;const e=i[0].trim(),t=e.toLowerCase(),n=[...i];if(t==="until")n[0]="";else if(t.startsWith("until "))n[0]=e.slice(6).trim();else if(t.startsWith("until("))n[0]=e.slice(5);else return i;return n}function cn(i){const e=new Set(["if","for","while","until","switch"]),t=["input:","output:","print:"],n=i.trim(),s=n.toLowerCase();for(const l of t){if(s===l)return{keyword:n,rest:""};if(s.startsWith(l+" "))return{keyword:n.slice(0,l.length),rest:n.slice(l.length).trim()}}const r=n.indexOf(" ");if(r<0)return;const a=n.slice(0,r);if(e.has(a.toLowerCase()))return{keyword:a,rest:n.slice(r+1).trim()}}function Ce(i,e){if(e.length===0)return e;const t=e[0].trim(),n=t.toLowerCase();if(n===i||n.startsWith(i+" "))return e;const s=[...e];return s[0]=i+" "+t,s}function di(i){let e=[...i];for(;e.length<3;)e.push("");e=e.slice(0,3);const t=s=>{let r=s.trim();for(;r.endsWith(";");)r=r.slice(0,-1).trim();return r},n=e.map(t).join("; ").trim();return n===""?"for":"for "+n}const c1={[g.anweisung]:"Anweisung",[g.verzweigung]:"Bedingung",[g.fallauswahl]:"Fallauswahl",[g.forSchleife]:"for 0 < i < anzahl",[g.whileSchleife]:"while …",[g.doUntilSchleife]:"while …",[g.endlosschleife]:"endless",[g.aussprung]:"break",[g.aufruf]:"Aufruf()",[g.leerElement]:"ø"};function hi(i){Object.assign(c1,i)}function Yt(i){return ui(i)??[c1[i.type]]}class H extends Error{}const re=i=>structuredClone(i);function Me(){return Q(g.anweisung,{textLines:["ø"]})}function mi(){return{caption:"",elements:[Me()]}}function Ot(i){if(i.type===g.leerElement)return!0;if(i.type===g.anweisung){const e=i.textLines;return e.length===0||e.length===1&&e[0]==="ø"}return!1}function ze(i,e){const t=q(i,e);return t!==void 0&&Ot(t)}function Be(i,e){if(e.length===0)throw new H("Invalid element path.");const[t,...n]=e;if(t<0||t>=i.length)throw new H("Invalid element path.");if(n.length===0)return{list:i,index:t};const[s,...r]=n;if(r.length===0)throw new H("Invalid element path.");return Be(d1(i[t],s),r)}function d1(i,e){if(li(i.type)){if(e!==0||!i.loopBody)throw new H("Invalid element path.");return i.loopBody}if(oi(i.type)){if(!i.cases||e<0||e>=i.cases.length)throw new H("Invalid element path.");return i.cases[e].elements}throw new H("Invalid element path.")}function ne(i,e){const{list:t,index:n}=Be(i.elements,e);return t[n]}function q(i,e){try{return ne(i,e)}catch{return}}function de(i,e,t){const n=re(i),{list:s,index:r}=Be(n.elements,e);return s[r]=re(t),n}function ht(i,e,t){const n=re(ne(i,e));return n.textLines=t.length===0?[""]:t,de(i,e,n)}function mt(i,e){return e.length===0?!1:e.length===1&&i.elements.length===1?!ze(i,e):q(i,e)!==void 0}function Ae(i,e){const t=re(i),{list:n,index:s}=Be(t.elements,e);if(e.length===1&&n.length===1){if(Ot(n[0]))throw new H("The last root element cannot be deleted.");return n[0]=Me(),t}return n.splice(s,1),e.length>1&&n.length===0&&n.push(Me()),t}function ke(i,e,t,n){const s=re(i);let r;if(e.length===0)r=s.elements;else{const a=e.slice(0,-1),l=e[e.length-1],{list:o,index:u}=Be(s.elements,a);r=d1(o[u],l)}return r.splice(Math.min(Math.max(0,t),r.length),0,re(n)),s}function h1(i,e,t){if(t.length===0)throw new H("Invalid element path.");return ke(i,t.slice(0,-1),t[t.length-1],e)}function At(i,e,t){if(t.length===0)throw new H("Invalid element path.");return ke(i,t.slice(0,-1),t[t.length-1]+1,e)}function Kt(i,e){return i.length<e.length&&i.every((t,n)=>e[n]===t)}function Jt(i,e){if(e.length===0)return i;const t=e[e.length-1],n=e.slice(0,-1);if(i.length<=n.length||!n.every((a,l)=>i[l]===a))return i;const s=n.length;if(i[s]<=t)return i;const r=[...i];return r[s]-=1,r}const Qt=(i,e)=>i.length===e.length&&i.every((t,n)=>t===e[n]);function gi(i,e,t){if(Qt(e,t))return i;if(Kt(e,t))throw new H("Invalid element path.");const n=ne(i,e),s=Ae(i,e);return h1(s,n,Jt(t,e))}function pi(i,e,t){if(Qt(e,t))return i;if(Kt(e,t))throw new H("Invalid element path.");const n=ne(i,e),s=Ae(i,e);return At(s,n,Jt(t,e))}function fi(i,e,t){if(!ze(i,t))throw new H("Invalid element path.");if(Qt(e,t))return i;if(Kt(e,t))throw new H("Invalid element path.");const n=ne(i,e),s=Ae(i,e);return de(s,Jt(t,e),n)}function bi(i,e){const t=re(ne(i,e)),n=t.cases;if(t.type!==g.fallauswahl||!n||n.length===0)throw new H("Invalid element path.");const s=n[n.length-1].name.toLowerCase()==="default",r=s?n.length-1:n.length,a=String(s?n.length:n.length+1);return n.splice(r,0,{name:a,elements:[Me()]}),{doc:de(i,e,t),path:[...e,r,0]}}function xi(i,e,t){const n=re(ne(i,e)),s=n.cases;if(n.type!==g.fallauswahl||!s)throw new H("Invalid element path.");if(s.length<=2)throw new H("A switch needs at least two cases.");if(t<0||t>=s.length)throw new H("Invalid element path.");s.splice(t,1);const r=Math.min(t,s.length-1);return{doc:de(i,e,n),path:[...e,r,0]}}function Ii(i,e,t,n){const s=re(ne(i,e)),r=s.cases;if(s.type!==g.fallauswahl||!r)throw new H("Invalid element path.");if(t<0||t>=r.length)throw new H("Invalid element path.");const a=n.trim();if(a==="")throw new H("Invalid element path.");return r[t].name=a,de(i,e,s)}function zi(i,e){var t;if(!(!i||i.length===0))for(let n=i.length;n>=1;n--){const s=i.slice(0,n);if(((t=q(e,s))==null?void 0:t.type)===g.fallauswahl)return s}}function wi(i,e){if(!(!i||i.length<=e.length))return i[e.length]}function dn(i,e){if(e.elements.length!==0)return!i||!q(e,i)?[0]:i}const m1=i=>i!==void 0&&/\s/.test(i);function Oe(i){const e=i.trim().toLowerCase();return e.startsWith("input:")?"input":e.startsWith("output:")||e.startsWith("print:")?"output":"statement"}function yi(i){const e=i.trim(),t=e.toLowerCase();return t.startsWith("input:")?e.slice(6).trim():t.startsWith("output:")?e.slice(7).trim():t.startsWith("print:")?e.slice(6).trim():i}function hn(i,e){const t=e.trim();return t===""?`${i} `:`${i} ${t}`}function vi(i,e){const t=yi(e);switch(i){case"statement":return t;case"input":return hn("input:",t);case"output":return hn("output:",t)}}const Re=i=>m1(i[0])?i.slice(1):i;function Si(i){const e=i.replace(/^\s+/,""),t=e.toLowerCase();return t.startsWith("input:")?Re(e.slice(6)):t.startsWith("output:")?Re(e.slice(7)):t.startsWith("print:")?Re(e.slice(6)):i}function mn(i,e){const t=e.replace(/^\s+/,"");if(!t.toLowerCase().startsWith(i.toLowerCase()))return e;const n=t.slice(i.length);if(!(n===""||m1(n[0])||n[0]==="("))return e;const s=Re(n);return s.startsWith("(")&&s.endsWith(")")&&s.length>=2?s.slice(1,-1):s}function gn(i,e){if(i==="input:"||i==="output:")return Si(e);const t=mn(i,e);if(i==="while"&&t===e){const n=mn("until",e);if(n!==e)return n}return t}function ki(i,e){return e===""?`${i} `:`${i} ${e}`}function g1(i){return i.replace(/[“”„«»]/g,'"').replace(/[’‘‚´]/g,"'")}function pn(i){const e=i.length===0?[""]:i.slice(0,3);for(;e.length<3;)e.push("");return e}function _i(i){let e=g1(i);for(;;){const t=e.trim();if(!t.endsWith(";"))return e;e=t.slice(0,-1).trim()}}const st='system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';function Zi(i,e){return`${e==="bold"?700:500} ${i}px ${st}`}const p1=(i,e,t)=>[...i].length*e*(t==="bold"?.68:.62);function Di(){if(typeof document>"u"||!document.body)return;const i="http://www.w3.org/2000/svg",e=document.createElementNS(i,"svg");e.setAttribute("aria-hidden","true"),e.setAttribute("width","0"),e.setAttribute("height","0"),e.style.cssText="position:absolute;left:-9999px;top:0;visibility:hidden;overflow:hidden";const t=document.createElementNS(i,"text");if(t.setAttribute("font-family",st),t.style.whiteSpace="pre",e.append(t),document.body.append(e),typeof t.getComputedTextLength!="function"||typeof t.getBBox!="function"){e.remove();return}if(t.textContent="Mg",t.setAttribute("font-size","20"),!(t.getComputedTextLength()>0)){e.remove();return}return t}let gt;function f1(){return gt===void 0&&(gt=Di()??null),gt??void 0}function b1(i,e,t){i.setAttribute("font-size",String(e)),i.setAttribute("font-weight",t==="bold"?"700":"500")}function fn(i,e){const t=`${i}|${e}`;let n=bn.get(t);if(!n){const s=f1();if(n={ascent:i*.95,descent:i*.24},s){b1(s,i,e),s.setAttribute("y","0"),s.textContent="Mg";const r=s.getBBox();r.height>0&&(n={ascent:-r.y,descent:r.height+r.y})}bn.set(t,n)}return n}const bn=new Map;function Mi(){const i=f1();if(i){const n=new Map;return(s,r,a)=>{const l=`${r}|${a}|${s}`;let o=n.get(l);return o===void 0&&(b1(i,r,a),i.textContent=s,o=s===""?0:i.getComputedTextLength(),n.size>2e3&&n.clear(),n.set(l,o)),o}}const e=typeof document<"u"?document.createElement("canvas").getContext("2d"):null;if(!e)return p1;const t=new Map;return(n,s,r)=>{const a=`${s}|${r}|${n}`;let l=t.get(a);return l===void 0&&(e.font=Zi(s,r),l=e.measureText(n).width,t.size>2e3&&t.clear(),t.set(a,l)),l}}const x1={fontSize:15,lineHeight:20,charWidth:7,baseHeaderExtra:20,minSidePadding:42,cellTextInsetY:15,doUntilDoLabelTopInset:2,doUntilFooterTopInset:6,doUntilFooterBottomInset:8};function Ai(i){return{...x1,fontSize:14,lineHeight:21,charWidth:5.5*(14/12),baseHeaderExtra:21,minSidePadding:40}}const Te=i=>i===g.forSchleife||i===g.whileSchleife||i===g.doUntilSchleife||i===g.endlosschleife,Ee=i=>i===g.fallauswahl||i===g.verzweigung;function Le(i,e,t,n=0){return{idPath:i,element:e,frame:t,headerBandHeight:n,topBandHeight:0,loopBodyLeadingInset:0,caseColumnFrames:[],children:[]}}function U(i){return{...i,frame:{...i.frame}}}class I1{constructor(e=x1,t=p1){this.metrics=e,this.measure=t}layout(e,t={left:28,top:28}){const s=this.layoutList(e.elements,t.left,t.top,[]).map(o=>this.stretchLoopBodiesVertically(o));let r=0,a=0;const l=o=>{r=Math.max(r,o.frame.x+o.frame.width),a=Math.max(a,o.frame.y+o.frame.height),o.children.forEach(l)};return s.forEach(l),{canvasSize:{width:r+t.left,height:a+t.top},elements:s}}lineWidth(e){return Math.ceil(this.measure(e,this.metrics.fontSize,"medium"))}lineWidthBold(e){return Math.ceil(this.measure(e,this.metrics.fontSize,"bold"))}layoutList(e,t,n,s){let r=[],a=n;e.forEach((o,u)=>{const c=this.layoutElement(o,t,a,[...s,u]);r.push(c),a+=c.frame.height});const l=Math.max(0,...r.map(o=>o.frame.width));return l>0&&(r=r.map(o=>this.stretchNodeTreeToWidth(o,l))),r}stretchMultiwayNodeToWidth(e,t){const n=U(e),s=n.frame.width;if(!(s>0)||n.caseColumnFrames.length===0)return n;const r=t/s;n.frame.width=t;let a=n.frame.x;const l=n.caseColumnFrames.map(o=>{const u=o.width*r,c={x:a,y:o.y,width:u,height:o.height};return a+=u,c});return n.caseColumnFrames=l,n.dividerX=l.length>0?l[l.length-1].x:n.frame.x+t,n.columns&&n.columns.length===l.length&&(n.columns=n.columns.map((o,u)=>{const c=l[u];return o.map(d=>{const m=U(d);return m.frame.x=c.x,m.frame.width=c.width,this.stretchDescendantsWidths(m,c.width)})}),n.children=n.columns.flat()),n}stretchLoopChildren(e,t){const n=this.effectiveLoopBodyLeading(e),s=Math.max(0,t-n);e.children=e.children.map(r=>{const a=U(r);return a.frame.x=e.frame.x+n,a.frame.width=s,this.stretchDescendantsWidths(a,s)})}stretchNodeTreeToWidth(e,t){const n=U(e);return n.frame.width>0?Ee(n.element.type)&&n.caseColumnFrames.length>0?this.stretchMultiwayNodeToWidth(n,t):(n.frame.width=t,Te(n.element.type)?this.stretchLoopChildren(n,t):n.children=n.children.map(r=>this.stretchDescendantsWidths(r,t)),n):n}stretchDescendantsWidths(e,t){let n=U(e);return Ee(n.element.type)?n=this.stretchNodeTreeToWidth(n,t):Te(n.element.type)?(n.frame.width=t,this.stretchLoopChildren(n,t)):(n.frame.width=t,n.children=n.children.map(s=>this.stretchDescendantsWidths(s,t))),n}stretchLoopBodiesVertically(e){const t=U(e);if(t.columns&&t.columns.length>0)return t.columns=t.columns.map(r=>r.map(a=>this.stretchLoopBodiesVertically(a))),t.children=t.columns.flat(),t;t.children=t.children.map(r=>this.stretchLoopBodiesVertically(r));const n=r=>r===g.anweisung||r===g.leerElement||r===g.aufruf||r===g.aussprung||Te(r);let s;switch(t.element.type){case g.forSchleife:case g.whileSchleife:case g.endlosschleife:{const r=t.element.type===g.endlosschleife?40:0;s=t.frame.y+t.frame.height-r;break}case g.doUntilSchleife:s=t.frame.y+t.frame.height-t.headerBandHeight;break}if(s!==void 0&&t.children.length>0){const r=t.children.length-1;let a=U(t.children[r]);const l=s-(a.frame.y+a.frame.height);l>.5&&n(a.element.type)&&(a.frame.height+=l,a=this.stretchLoopBodiesVertically(a),t.children=[...t.children.slice(0,r),a])}return t}headerHeight(e){const t=this.metrics,n=Math.max(1,e.textLines.length);if(e.type===g.doUntilSchleife)return t.doUntilFooterTopInset+n*t.lineHeight+t.doUntilFooterBottomInset+e.zoomY;let s;switch(e.type){case g.fallauswahl:s=40;break;case g.verzweigung:s=20;break;case g.forSchleife:case g.whileSchleife:case g.endlosschleife:s=t.baseHeaderExtra+4;break;default:s=14}return s+n*t.lineHeight+e.zoomY}doUntilBodyLeadingInset(){return Math.max(20,this.lineWidthBold("do")+12)}effectiveLoopBodyLeading(e){return e.element.type===g.doUntilSchleife?e.loopBodyLeadingInset>0?e.loopBodyLeadingInset:this.doUntilBodyLeadingInset():20}horizontalPaddingInsideCell(e){return Ee(e)?Math.max(100,this.metrics.minSidePadding*2.45):this.metrics.minSidePadding}minWidth(e){const t=e.textLines.length===0?0:Math.max(...e.textLines.map(r=>this.lineWidth(r)));let n=t+e.zoomX+this.horizontalPaddingInsideCell(e.type);if(e.type===g.aufruf){const r=Math.max(68,this.metrics.minSidePadding*1.7),a=Math.max(8,this.metrics.minSidePadding*.2);n=Math.max(n,t+e.zoomX+r+a)}const s=e.type===g.leerElement?76:e.type===g.aufruf?104:72;return Math.max(s,n)}layoutElement(e,t,n,s){if(Ee(e.type))return this.layoutMultiway(e,t,n,s);if(Te(e.type))return this.layoutLoop(e,t,n,s);const r=this.headerHeight(e);return Le(s,e,{x:t,y:n,width:this.minWidth(e),height:r},r)}layoutLoop(e,t,n,s){const r=b=>b.reduce((w,v)=>w+v.frame.height,0),a=b=>Math.max(0,...b.map(w=>w.frame.width)),l=e.loopBody??[];if(e.type===g.doUntilSchleife){const b=this.doUntilBodyLeadingInset(),w=e.zoomY,v=this.headerHeight(e),M=this.layoutList(l,t+b,n+w,[...s,0]),D=Math.max(this.minWidth(e),a(M)+b),Z=r(M)+v+w,A=Math.max(0,D-b),j=Le(s,e,{x:t,y:n,width:D,height:Z},v);return j.topBandHeight=w,j.loopBodyLeadingInset=b,j.children=M.map(W=>{const T=U(W);return T.frame.x=t+b,T.frame.width=A,this.stretchDescendantsWidths(T,A)}),j}const o=20,u=this.headerHeight(e),c=e.type===g.endlosschleife?40:0,d=this.layoutList(l,t+o,n+u,[...s,0]),m=Math.max(this.minWidth(e),a(d)+o),p=u+c+r(d),f=Math.max(0,m-o),z=Le(s,e,{x:t,y:n,width:m,height:p},u);return z.children=d.map(b=>{const w=U(b);return w.frame.x=t+o,w.frame.width=f,this.stretchDescendantsWidths(w,f)}),z}layoutMultiway(e,t,n,s){const r=this.headerHeight(e),a=e.cases??[],l=Math.max(1,a.length),o=Math.max(this.minWidth(e)/l,132);let u=[],c=[],d=0,m=0;if(a.forEach((b,w)=>{const v=t+d,M=this.layoutList(b.elements,v,n+r,[...s,w]),D=Math.max(0,...M.map(j=>j.frame.width));let Z;e.type===g.verzweigung&&l===2?Z=Math.max(D,(w===0?"true":"false").length*this.metrics.charWidth+24):Z=Math.max(o,D);const A=M.reduce((j,W)=>j+W.frame.height,0);m=Math.max(m,A),u.push({x:v,y:n+r,width:Z,height:A}),c.push(M.map(j=>{const W=U(j);return W.frame.x=v,W.frame.width=Z,this.stretchDescendantsWidths(W,Z)})),d+=Z}),e.type===g.verzweigung&&l===2&&u.length===2){const b=Math.max(u[0].width,u[1].width),w=t,v=t+b,M=v-u[1].x;u[0]={...u[0],x:w,width:b},u[1]={...u[1],x:v,width:b},d=b*2,c[0]=c[0].map(D=>{const Z=U(D);return Z.frame.x=w,Z.frame.width=b,this.stretchDescendantsWidths(Z,b)}),c[1]=c[1].map(D=>{const Z=jt(D,M);return Z.frame.width=b,this.stretchDescendantsWidths(Z,b)})}if(c.length>0){const b=ji(c,n+r);c=b.columns.map(w=>w.map(v=>this.stretchLoopBodiesVertically(v)));for(let w=0;w<Math.min(u.length,b.columnHeights.length);w++)u[w]={...u[w],height:b.columnHeights[w]};m=b.columnHeights.length>0?Math.max(...b.columnHeights):m}let p=Math.max(d,this.minWidth(e));if(d>.5&&p>d+.5){const b=p/d;let w=t;const v=[],M=[];u.forEach((D,Z)=>{const A=D.width*b;M.push(c[Z].map(j=>{const W=U(j);return W.frame.x=w,W.frame.width=A,this.stretchDescendantsWidths(W,A)})),v.push({x:w,y:D.y,width:A,height:D.height}),w+=A}),u=v,c=M,d=w-t,p=d}const f=u.length>0?u[u.length-1].width:d/l,z=Le(s,e,{x:t,y:n,width:p,height:r+m},r);return z.caseColumnFrames=u,z.dividerX=u.length>0?u[u.length-1].x:t+d-f,z.dividerYInset=e.type===g.fallauswahl?-20:0,z.columns=c,z.children=c.flat(),z}}function z1(i,e){if(Math.abs(e)<=1e-4)return i;const t=U(i),n=s=>{const r=U(s);return r.frame.y+=e,z1(r,e)};return t.columns?(t.columns=t.columns.map(s=>s.map(n)),t.children=t.columns.flat()):t.children=t.children.map(n),t}function jt(i,e){if(Math.abs(e)<=1e-4)return i;const t=U(i);return t.frame.x+=e,t.columns?(t.columns=t.columns.map(n=>n.map(s=>jt(s,e))),t.children=t.columns.flat()):t.children=t.children.map(n=>jt(n,e)),t}function ji(i,e){if(i.length<2)return{columns:i,columnHeights:i.map(u=>u.reduce((c,d)=>c+d.frame.height,0))};const t=.5,n=[e];for(const u of i)for(const c of u)n.push(c.frame.y+c.frame.height);const s=Math.max(...n);n.push(s),n.sort((u,c)=>u-c);let r=[];for(const u of n)r.length>0&&Math.abs(u-r[r.length-1])<=t||r.push(u);(r.length===0||Math.abs(r[0]-e)>t)&&r.unshift(e),r.length===0?r=[e,s]:r[r.length-1]<s-1e-6?r.push(s):r[r.length-1]=s;const a=(u,c)=>{let d=Math.max(0,c);for(;d<r.length&&r[d]<u-t;)d++;return Math.min(d,r.length-1)},l=[],o=[];for(const u of i){if(u.length===0){l.push([]),o.push(0);continue}const c=[];let d=0;u.forEach((m,p)=>{let f=U(m);const z=r[d],b=m.frame.y+m.frame.height,w=p===u.length-1?r.length-1:a(b,d+1),v=r[w],M=z-f.frame.y;f.frame.y=z,f.frame.height=Math.max(0,v-z),f=z1(f,M),c.push(f),d=w}),l.push(c),o.push(r[r.length-1]-e)}return{columns:l,columnHeights:o}}const xn=[{item:"anweisung",label:"Anweisung"},{item:"verzweigung",label:"Verzweigung"},{item:"fallauswahl",label:"Fallauswahl"},{item:"forZaehlSchleife",label:"For-Schleife"},{item:"whileSchleife",label:"While-Schleife"},{item:"doUntilSchleife",label:"Do-while-Schleife"},{item:"endlosschleife",label:"Endlosschleife"},{item:"aufruf",label:"Aufruf"},{item:"aussprung",label:"Aussprung"}];function He(i){const e=Me;switch(i){case"anweisung":return Q(g.anweisung);case"verzweigung":return Q(g.verzweigung,{cases:[{name:"true",elements:[e()]},{name:"false",elements:[e()]}]});case"fallauswahl":return Q(g.fallauswahl,{cases:[{name:"1",elements:[e()]},{name:"2",elements:[e()]},{name:"default",elements:[e()]}]});case"forZaehlSchleife":return Q(g.forSchleife,{textLines:["","",""],loopBody:[e()]});case"whileSchleife":return Q(g.whileSchleife,{loopBody:[e()]});case"doUntilSchleife":return Q(g.doUntilSchleife,{loopBody:[e()]});case"endlosschleife":return Q(g.endlosschleife,{loopBody:[e()]});case"aussprung":return Q(g.aussprung);case"aufruf":return Q(g.aufruf)}}function Ke(i){if(i==="")return"-1;";let e="";for(const t of i)e+=t.codePointAt(0)+";";return e}function Pt(i){const e=i.split(";").filter(n=>n!=="");if(e.length===1&&e[0]==="-1")return"";let t="";for(const n of e){if(!/^[+-]?\d+$/.test(n))continue;const s=Number(n);s!==-1&&(s<0||s>1114111||s>=55296&&s<=57343||(t+=String.fromCodePoint(s)))}return t}class In extends Error{}function qt(i){const e=new DOMParser().parseFromString(i,"application/xml");if(e.getElementsByTagName("parsererror").length>0)throw new In("Could not read XML.");const t=e.documentElement;if(!t||t.tagName!=="struktogramm")throw new In("Invalid XML: root element is not <struktogramm>.");const n={caption:wn(t,"caption")??"",elements:Wt(t)},s=wn(t,"fontfamily");s!==void 0&&(n.fontFamily=s);const r=_e(t,"fontsize");r!==void 0&&(n.fontSize=r);const a=_e(t,"fontstyle");return a!==void 0&&(n.fontStyle=a),t.getAttribute("pseudocode")==="true"&&(n.pseudocode=!0),n}function pt(i){const e=(n,s)=>s===void 0?"":` ${n}="${w1(s)}"`;let t=`<?xml version="1.0" encoding="UTF-8"?>
`;t+="<struktogramm",t+=e("fontfamily",i.fontFamily===void 0?void 0:Ke(i.fontFamily)),t+=e("fontstyle",i.fontStyle===void 0?void 0:String(i.fontStyle)),t+=e("fontsize",i.fontSize===void 0?void 0:String(i.fontSize)),t+=e("caption",Ke(i.caption)),t+=e("pseudocode",i.pseudocode?"true":void 0),t+=`>
`;for(const n of i.elements)t+=Bt(n,"  ");return t+=`</struktogramm>
`,t}function Bt(i,e){let t=`${e}<strelem typ="${i.type}" zx="${i.zoomX}" zy="${i.zoomY}"`;i.textColor&&(t+=` textcolor="${zn(i.textColor)}"`),i.backgroundColor&&(t+=` bgcolor="${zn(i.backgroundColor)}"`),t+=`>
`;for(const n of i.textLines)t+=`${e}  <text>${Pi(Ke(n))}</text>
`;if(i.loopBody){t+=`${e}  <schleifeninhalt>
`;for(const n of i.loopBody)t+=Bt(n,e+"    ");t+=`${e}  </schleifeninhalt>
`}if(i.cases)for(const n of i.cases){t+=`${e}  <fall fallname="${w1(Ke(n.name))}">
`;for(const s of n.elements)t+=Bt(s,e+"    ");t+=`${e}  </fall>
`}return t+=`${e}</strelem>
`,t}function w1(i){return i.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Pi(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function zn(i){return String(i.a<<24|i.r<<16|i.g<<8|i.b|0)}function Ue(i,e){return Array.from(i.children).filter(t=>t.tagName===e)}function Wt(i){const e=[];for(const t of Ue(i,"strelem")){const n=Bi(t);n&&e.push(n)}return e}function Bi(i){const e=_e(i,"typ");if(e===void 0||g[e]===void 0)return;const t={type:e,zoomX:_e(i,"zx")??0,zoomY:_e(i,"zy")??0,textLines:Ue(i,"text").map(l=>Pt((l.textContent??"").trim()))},n=yn(i.getAttribute("textcolor"));n&&(t.textColor=n);const s=yn(i.getAttribute("bgcolor"));s&&(t.backgroundColor=s),t.textLines.length===0&&(t.textLines=[""]);const r=Ue(i,"schleifeninhalt")[0];if(r){const l=Wt(r);l.length>0&&(t.loopBody=l)}const a=Ue(i,"fall").map(l=>({name:Pt(l.getAttribute("fallname")??""),elements:Wt(l)}));return a.length>0&&(t.cases=a),t}function wn(i,e){const t=i.getAttribute(e);return t===null?void 0:Pt(t)}function _e(i,e){const t=i.getAttribute(e);if(!(t===null||!/^[+-]?\d+$/.test(t)))return Number(t)}function yn(i){if(i===null||!/^[+-]?\d+$/.test(i))return;const e=Number(i);if(e<-2147483648||e>2147483647)return;const t=e>>>0;return{a:t>>>24&255,r:t>>>16&255,g:t>>>8&255,b:t&255}}const Wi="http://www.w3.org/2000/svg",N={diagramLineWidth:2,outerFrameLineWidth:2,selectionLineWidth:3.5,canvasOuterMargin:16,cellTextInsetX:18,cellTextInsetY:15,multiHeaderFirstLineY:14,branchLabelInsetX:10,fallauswahlCaseLabelBand:26,callSideBarInset:14,callTextInsetFromSideBar:20,loopBodyLeadingInset:20};function P(i,e={}){const t=document.createElementNS(Wi,i);for(const[n,s]of Object.entries(e))t.setAttribute(n,String(s));return t}class y1{constructor(e,t){I(this,"usesSimulationHighlight",!1);this.metrics=e,this.measure=t}get lineHeight(){return this.metrics.lineHeight}get fontSize(){return this.metrics.fontSize}render(e,t,n,s=N.canvasOuterMargin){const r=P("svg",{width:t.width,height:t.height,viewBox:`0 0 ${t.width} ${t.height}`,"font-family":st,"font-size":this.fontSize,class:"diagram"});r.append(P("rect",{x:0,y:0,width:t.width,height:t.height,fill:"#fafafa"}));const a=s;r.append(P("rect",{x:a,y:a,width:e.canvasSize.width-2*a-1,height:e.canvasSize.height-2*a-1,fill:"none",stroke:"black","stroke-width":N.outerFrameLineWidth}));const l=P("g");for(const o of e.elements)this.drawNode(o,l,n,{},void 0);return r.append(l),r}line(e,t){e.append(P("polyline",{points:t.map(n=>n.join(",")).join(" "),fill:"none",stroke:"black","stroke-width":N.diagramLineWidth,"stroke-linejoin":"miter"}))}strokeCellBorder(e,t,n){const s=t.x,r=t.y,a=t.x+t.width,l=t.y+t.height;if(!n.top&&!n.left&&!n.bottom&&!n.right){e.append(P("rect",{x:s,y:r,width:t.width,height:t.height,fill:"none",stroke:"black","stroke-width":N.diagramLineWidth}));return}n.top||this.line(e,[[s,r],[a,r]]),n.right||this.line(e,[[a,r],[a,l]]),n.bottom||this.line(e,[[a,l],[s,l]]),n.left||this.line(e,[[s,l],[s,r]])}textWidth(e){const t=cn(e);return t?this.measure(t.keyword,this.fontSize,"bold")+(t.rest===""?0:this.measure(" "+t.rest,this.fontSize,"medium")):this.measure(e,this.fontSize,"medium")}drawKeywordLine(e,t,n,s){const r=P("text",{x:n,y:s+fn(this.fontSize,"medium").ascent,"font-weight":500});r.style.whiteSpace="pre";const a=cn(t);if(a){const l=P("tspan",{"font-weight":700});if(l.textContent=a.keyword,r.append(l),a.rest!==""){const o=P("tspan",{});o.textContent=" "+a.rest,r.append(o)}}else r.textContent=t;e.append(r)}drawLabel(e,t,n,s,r,a){const l=fn(this.fontSize,r?"bold":"medium"),o=P("text",{x:n,y:a==="top"?s+l.ascent:s-l.descent,"font-weight":r?700:500});o.style.whiteSpace="pre",o.textContent=t,e.append(o)}roofMetrics(e,t,n,s){const r=t.y+n,a=e.dividerYInset??0,l=12,o=Math.max(e.element.textLines.length,1)*this.lineHeight,u=t.y+N.multiHeaderFirstLineY;if(e.element.type===g.fallauswahl){const d=Math.max(N.fallauswahlCaseLabelBand,this.lineHeight+10),m=r-d,p=Math.min(r+a,m-8),f=Math.max(p,u+o+6);return{apex:{x:s,y:f},maxTextBottom:m-l,roofBottom:r}}const c={x:s,y:r+a};return{apex:c,maxTextBottom:c.y-l,roofBottom:r}}drawNode(e,t,n,s,r){var M;const a=e.frame,l=e.element,o=a.x+a.width,u=a.y+a.height,c=l.type===g.verzweigung||l.type===g.fallauswahl,d=c?e.headerBandHeight:0,m=n!==void 0&&Ct(e.idPath,n),p=Yt(l),f=P("g",{"data-path":e.idPath.join(",")});t.append(f);const z=this.usesSimulationHighlight,b=m&&z?"rgba(199, 230, 255, 0.55)":"white";f.append(P("rect",{x:a.x,y:a.y,width:a.width,height:a.height,fill:b})),this.strokeCellBorder(f,a,s);const w=N.callSideBarInset;if(l.type===g.aufruf?(this.line(f,[[a.x+w,a.y],[a.x+w,u]]),this.line(f,[[o-w,a.y],[o-w,u]])):l.type===g.aussprung&&this.line(f,[[a.x+w,a.y],[a.x,a.y+a.height/2],[a.x+w,u]]),c&&e.dividerX!==void 0){const D=e.dividerX,Z=this.roofMetrics(e,a,d,D),A=Math.max(p.length,1)*this.lineHeight,j=a.y+N.multiHeaderFirstLineY;this.line(f,[[a.x,a.y],[Z.apex.x,Z.apex.y],[o,a.y]]),l.type===g.fallauswahl&&this.line(f,[[a.x,Z.roofBottom],[o,Z.roofBottom]]);let W;j+A<=Z.maxTextBottom?W=j:W=Math.max(a.y+2,Z.maxTextBottom-(Math.max(p.length,1)-1)*this.lineHeight-this.lineHeight),p.forEach((T,ae)=>{const le=this.textWidth(T);let pe;if(l.type===g.verzweigung){const dt=a.x+N.cellTextInsetX,si=o-le-N.cellTextInsetX;pe=Math.min(Math.max(D-le/2,dt),si)}else pe=a.x+a.width/2-le/2;this.drawKeywordLine(f,T,pe,W+ae*this.lineHeight)})}else if(l.type!==g.doUntilSchleife)if(l.type===g.anweisung||l.type===g.aufruf||l.type===g.aussprung){const D=N.cellTextInsetX;let Z=a.x+D,A=o-D;l.type===g.aufruf?(Z=a.x+w+N.callTextInsetFromSideBar,A=o-w-N.callTextInsetFromSideBar):l.type===g.aussprung&&(Z=a.x+w+D);const j=Math.max(0,A-Z);let W=a.y+a.height/2-Math.max(1,p.length)*this.lineHeight/2;for(const T of p)this.drawKeywordLine(f,T,Z+(j-this.textWidth(T))/2,W),W+=this.lineHeight}else{const D=Math.max(1,p.length)*this.lineHeight;let Z=r===g.doUntilSchleife?a.y+a.height/2-D/2:a.y+N.cellTextInsetY;for(const A of p)this.drawKeywordLine(f,A,a.x+N.cellTextInsetX,Z),Z+=this.lineHeight}e.children.forEach((D,Z)=>{const A=l.type===g.doUntilSchleife&&Z===0?{top:!0,left:!0}:{};this.drawNode(D,t,n,A,l.type)});const v=P("g");if(t.append(v),l.type===g.doUntilSchleife){const D=((M=e.children[0])==null?void 0:M.frame.x)??a.x+(e.loopBodyLeadingInset>0?e.loopBodyLeadingInset:N.loopBodyLeadingInset);this.drawLabel(v,"do",a.x+4,a.y+this.metrics.doUntilDoLabelTopInset,!0,"top");const Z=u-e.headerBandHeight;this.line(v,[[D,Z],[o,Z]]),this.line(v,[[D,a.y],[D,Z]]);let A=Z+this.metrics.doUntilFooterTopInset;for(const j of p)this.drawKeywordLine(v,j,a.x+N.cellTextInsetX,A),A+=this.lineHeight}if(c&&e.dividerX!==void 0&&e.caseColumnFrames.length>1){const D=this.roofMetrics(e,a,d,e.dividerX),Z=D.apex;e.caseColumnFrames.forEach((j,W)=>{if(W>=e.caseColumnFrames.length-1)return;const T=j.x+j.width,ae=Ci(T,a,Z),le=Number.isFinite(ae)?Math.min(Math.max(ae,a.y),u):a.y;this.line(v,[[T,u],[T,le]])});const A=l.cases;if(A&&A.length===e.caseColumnFrames.length){const j=l.type===g.fallauswahl?D.roofBottom-6:a.y+d-8,W=N.branchLabelInsetX;if(l.type===g.verzweigung&&A.length===2){this.drawLabel(v,"true",a.x+W,j,!0,"bottom");const T=e.caseColumnFrames[1],ae=this.measure("false",this.fontSize,"bold");this.drawLabel(v,"false",T.x+T.width-W-ae,j,!0,"bottom")}else A.forEach((T,ae)=>{const le=e.caseColumnFrames[ae],pe=["default","true","false"].includes(T.name.toLowerCase()),dt=this.measure(T.name,this.fontSize,pe?"bold":"medium");this.drawLabel(v,T.name,le.x+le.width/2-dt/2,j,pe,"bottom")})}}m&&v.append(P("rect",{x:a.x,y:a.y,width:a.width,height:a.height,fill:"none",stroke:z?"rgba(66, 140, 242, 0.78)":"rgba(0, 122, 255, 0.9)","stroke-width":N.selectionLineWidth}))}}function Ci(i,e,t){const n=e.y;if(i<=t.x){const r=t.x-e.x;return Math.abs(r)<.5?t.y:n+(t.y-n)/r*(i-e.x)}const s=e.x+e.width-t.x;return Math.abs(s)<.5?t.y:t.y+(n-t.y)/s*(i-t.x)}function Ct(i,e){return i.length===e.length&&i.every((t,n)=>t===e[n])}function Ti(i){const e=[],t=n=>{e.push(n),n.children.forEach(t)};return i.forEach(t),e}function Je(i){var e,t;return{...i,textLines:Yt(i),loopBody:(e=i.loopBody)==null?void 0:e.map(Je),cases:(t=i.cases)==null?void 0:t.map(n=>({name:n.name,elements:n.elements.map(Je)}))}}const Ei="modulepreload",Li=function(i,e){return new URL(i,e).href},vn={},_=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let a=function(c){return Promise.all(c.map(d=>Promise.resolve(d).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};const l=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),u=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=a(t.map(c=>{if(c=Li(c,n),c in vn)return;vn[c]=!0;const d=c.endsWith(".css"),m=d?'[rel="stylesheet"]':"";if(!!n)for(let z=l.length-1;z>=0;z--){const b=l[z];if(b.href===c&&(!d||b.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${c}"]${m}`))return;const f=document.createElement("link");if(f.rel=d?"stylesheet":Ei,d||(f.as="script"),f.crossOrigin="",f.href=c,u&&f.setAttribute("nonce",u),document.head.appendChild(f),d)return new Promise((z,b)=>{f.addEventListener("load",z),f.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return s.then(a=>{for(const l of a||[])l.status==="rejected"&&r(l.reason);return e().catch(r)})},$e=[{code:"de",name:"Deutsch"},{code:"en",name:"English"},{code:"es",name:"Español"},{code:"fr",name:"Français"},{code:"it",name:"Italiano"},{code:"pl",name:"Polski"},{code:"tr",name:"Türkçe"},{code:"ko",name:"한국어"},{code:"ja",name:"日本語"},{code:"el",name:"Ελληνικά"},{code:"uk",name:"Українська"},{code:"ar",name:"العربية"},{code:"ru",name:"Русский"},{code:"he",name:"עברית"},{code:"nl",name:"Nederlands"},{code:"sv",name:"Svenska"},{code:"da",name:"Dansk"},{code:"nb",name:"Norsk bokmål"},{code:"zh-Hans",name:"中文（简体）"},{code:"zh-Hant",name:"中文（繁體）"},{code:"pt-PT",name:"Português"},{code:"java",name:"Java (Keywords)"}],Hi=Object.assign({"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ar.lproj/Localizable.strings":()=>_(()=>import("./Localizable-CxCno28C.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/da.lproj/Localizable.strings":()=>_(()=>import("./Localizable-BAutdlBb.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/de.lproj/Localizable.strings":()=>_(()=>import("./Localizable-DZlyYK1P.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/el.lproj/Localizable.strings":()=>_(()=>import("./Localizable-rqA-20hM.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/en.lproj/Localizable.strings":()=>_(()=>import("./Localizable-Dj42XC1o.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/es.lproj/Localizable.strings":()=>_(()=>import("./Localizable-LSTVB2Q5.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/fr.lproj/Localizable.strings":()=>_(()=>import("./Localizable-ByPZS4RL.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/he.lproj/Localizable.strings":()=>_(()=>import("./Localizable-R-16GCrk.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/it.lproj/Localizable.strings":()=>_(()=>import("./Localizable-DXAPah1g.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ja.lproj/Localizable.strings":()=>_(()=>import("./Localizable-CkJEmEEP.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/java.lproj/Localizable.strings":()=>_(()=>import("./Localizable-a8HTzUdm.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ko.lproj/Localizable.strings":()=>_(()=>import("./Localizable-BudCXCER.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/nb.lproj/Localizable.strings":()=>_(()=>import("./Localizable-DSvkBkp-.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/nl.lproj/Localizable.strings":()=>_(()=>import("./Localizable-BJ55WGVD.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/pl.lproj/Localizable.strings":()=>_(()=>import("./Localizable-BYJK0mdR.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/pt-PT.lproj/Localizable.strings":()=>_(()=>import("./Localizable-D1vfmhD5.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ru.lproj/Localizable.strings":()=>_(()=>import("./Localizable-1QZ0wfvJ.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/sv.lproj/Localizable.strings":()=>_(()=>import("./Localizable-M33nNbEe.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/tr.lproj/Localizable.strings":()=>_(()=>import("./Localizable-BM86Igqt.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/uk.lproj/Localizable.strings":()=>_(()=>import("./Localizable-UGog_aku.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/zh-Hans.lproj/Localizable.strings":()=>_(()=>import("./Localizable-CaVEL1es.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/zh-Hant.lproj/Localizable.strings":()=>_(()=>import("./Localizable-DqIDp_hh.js"),[],import.meta.url).then(i=>i.default)}),Ni=Object.assign({"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/Java.strings":()=>_(()=>import("./Java-C92fuLac.js"),[],import.meta.url).then(i=>i.default)}),Gi=Object.assign({"../i18n/ar.strings":()=>_(()=>import("./ar-BHrons2q.js"),[],import.meta.url).then(i=>i.default),"../i18n/da.strings":()=>_(()=>import("./da-BNMQzARH.js"),[],import.meta.url).then(i=>i.default),"../i18n/de.strings":()=>_(()=>import("./de-BXWfFuwJ.js"),[],import.meta.url).then(i=>i.default),"../i18n/el.strings":()=>_(()=>import("./el-DL4dhSmr.js"),[],import.meta.url).then(i=>i.default),"../i18n/en.strings":()=>_(()=>import("./en-CKhr26rp.js"),[],import.meta.url).then(i=>i.default),"../i18n/es.strings":()=>_(()=>import("./es-CRL2bp19.js"),[],import.meta.url).then(i=>i.default),"../i18n/fr.strings":()=>_(()=>import("./fr-B1VUTARw.js"),[],import.meta.url).then(i=>i.default),"../i18n/he.strings":()=>_(()=>import("./he-t4APJEsl.js"),[],import.meta.url).then(i=>i.default),"../i18n/it.strings":()=>_(()=>import("./it-8Z2wAjgV.js"),[],import.meta.url).then(i=>i.default),"../i18n/ja.strings":()=>_(()=>import("./ja-rZUVYb9l.js"),[],import.meta.url).then(i=>i.default),"../i18n/ko.strings":()=>_(()=>import("./ko-Ctx9eaHC.js"),[],import.meta.url).then(i=>i.default),"../i18n/nb.strings":()=>_(()=>import("./nb-CbR2zkEA.js"),[],import.meta.url).then(i=>i.default),"../i18n/nl.strings":()=>_(()=>import("./nl-B-ZqK9at.js"),[],import.meta.url).then(i=>i.default),"../i18n/pl.strings":()=>_(()=>import("./pl-Ceou8JqW.js"),[],import.meta.url).then(i=>i.default),"../i18n/pt-PT.strings":()=>_(()=>import("./pt-PT-CokqToap.js"),[],import.meta.url).then(i=>i.default),"../i18n/ru.strings":()=>_(()=>import("./ru-CHGe-Klk.js"),[],import.meta.url).then(i=>i.default),"../i18n/sv.strings":()=>_(()=>import("./sv-DlBLWDSF.js"),[],import.meta.url).then(i=>i.default),"../i18n/tr.strings":()=>_(()=>import("./tr-BlKnEm-z.js"),[],import.meta.url).then(i=>i.default),"../i18n/uk.strings":()=>_(()=>import("./uk-U8i7VeK_.js"),[],import.meta.url).then(i=>i.default),"../i18n/zh-Hans.strings":()=>_(()=>import("./zh-Hans-Xg6uXXL-.js"),[],import.meta.url).then(i=>i.default),"../i18n/zh-Hant.strings":()=>_(()=>import("./zh-Hant-CurgUAf9.js"),[],import.meta.url).then(i=>i.default)});function ft(i,e){var t;return(t=Object.entries(i).find(([n])=>n.endsWith(e)))==null?void 0:t[1]}function Vi(i){const e=new Map,t=i.replace(/\/\*[\s\S]*?\*\//g,"").replace(/^\s*\/\/.*$/gm,""),n=/"((?:[^"\\]|\\.)*)"\s*=\s*"((?:[^"\\]|\\.)*)"\s*;/g,s=r=>r.replace(/\\(u[0-9a-fA-F]{4}|.)/g,(a,l)=>l==="n"?`
`:l==="t"?"	":l.startsWith("u")&&l.length===5?String.fromCharCode(parseInt(l.slice(1),16)):l);for(const r of t.matchAll(n))e.set(s(r[1]),s(r[2]));return e}async function Sn(i){const e=i==="java"?ft(Ni,"/Java.strings"):ft(Hi,`/${i}.lproj/Localizable.strings`),t=ft(Gi,`/${i}.strings`),n=new Map;for(const s of[e,t])if(s)for(const[r,a]of Vi(await s()))n.set(r,a);return n}let v1="en",S1=new Map,Xe=new Map;const k1="appLanguageCode";function Fi(){const i=new URLSearchParams(location.search).get("lang");if(i&&$e.some(e=>e.code===i))return i;try{const e=localStorage.getItem(k1);if(e&&$e.some(t=>t.code===e))return e}catch{}for(const e of navigator.languages??[navigator.language]){const t=e.toLowerCase();if(t.startsWith("zh"))return/hant|tw|hk|mo/.test(t)?"zh-Hant":"zh-Hans";if(t.startsWith("pt"))return"pt-PT";if(t.startsWith("no")||t.startsWith("nn"))return"nb";if(t.startsWith("iw"))return"he";const n=$e.find(s=>s.code!=="java"&&s.code===t.split("-")[0]);if(n)return n.code}return"en"}async function _1(i,e=!0){if(Xe.size===0&&(Xe=await Sn("en")),S1=i==="en"?Xe:await Sn(i),v1=i,e)try{localStorage.setItem(k1,i)}catch{}const t=document.documentElement;t.lang=i==="java"?"en":i,t.dir=i==="ar"||i==="he"?"rtl":"ltr"}function Tt(){return v1}function h(i,...e){const t=S1.get(i)??Xe.get(i)??i;if(e.length===0)return t;let n=0;return t.replace(/%(?:(\d+)\$)?[@d]/g,(s,r)=>String(e[r?Number(r)-1:n++]??""))}const Ri=100;function Z1(i){switch(i.kind){case"finished":return"Simulation finished.";case"infiniteLoopWithoutBody":return"Infinite loop has no body.";case"unsupportedStatement":return`Unsupported statement: ${i.text}`;case"invalidExpression":return`Invalid expression: ${i.text}`;case"unknownVariable":return`Unknown variable: ${i.text}`;case"divisionByZero":return"Division by zero.";case"wholeNumberExpected":return"Please enter a whole number.";case"numberExpected":return"Please enter a number.";case"booleanExpected":return"Please enter true or false.";case"subprogramNotFound":return`No open diagram is called ${i.text}. The call was skipped.`;case"callTooDeep":return"Too many nested calls. Does a subprogram call itself?";case"callArguments":return`The call does not match the header of ${i.text}. Check the values in the parentheses.`;case"missingReturn":return`${i.text} ended without returning a value with return.`;case"other":return i.text}}class K extends Error{constructor(e){super(Z1(e)),this.notice=e}}const $=i=>new K({kind:"unsupportedStatement",text:i}),S=i=>new K({kind:"invalidExpression",text:i}),we=i=>new K({kind:"unknownVariable",text:i}),Ui=()=>new K({kind:"divisionByZero"});function kn(i){return i instanceof K?i.notice:{kind:"other",text:i instanceof Error?i.message:String(i)}}function $i(i){if(i===0)return"0";if(!Number.isFinite(i))return Number.isNaN(i)?"nan":i>0?"inf":"-inf";const e=Math.floor(Math.log10(Math.abs(Number(i.toPrecision(12)))));if(e<-4||e>=12){const[n,s]=i.toExponential(11).split("e"),r=n.includes(".")?n.replace(/0+$/,"").replace(/\.$/,""):n,a=Number(s);return`${r}e${a<0?"-":"+"}${String(Math.abs(a)).padStart(2,"0")}`}const t=i.toFixed(Math.max(0,11-e));return t.includes(".")?t.replace(/0+$/,"").replace(/\.$/,""):t}function _n(i){return Number.isFinite(i)&&Math.round(i)===i?i.toFixed(1):$i(i)}function F(i){switch(i.kind){case"int":return String(i.value);case"double":return _n(i.value);case"string":return i.value;case"boolean":return String(i.value);case"intArray":return"["+i.value.map(String).join(", ")+"]";case"doubleArray":return"["+i.value.map(_n).join(", ")+"]";case"stringArray":return"["+i.value.join(", ")+"]";case"booleanArray":return"["+i.value.map(String).join(", ")+"]";case"grid":return"["+Xi(i).join(", ")+"]"}}function Xi(i){return i.value.map(e=>"["+e.map(t=>F(D1(i.elementType,t))).join(", ")+"]")}function D1(i,e){switch(i){case"int":return{kind:"int",value:e};case"double":return{kind:"double",value:e};case"string":return{kind:"string",value:e};case"boolean":return{kind:"boolean",value:e}}}function Yi(i){return i==="string"?"":i==="boolean"?!1:0}function Et(i){return i.kind==="intArray"||i.kind==="doubleArray"||i.kind==="stringArray"||i.kind==="booleanArray"||i.kind==="grid"}function Oi(i){return i.kind==="int"||i.kind==="double"?i.value:NaN}const ce=i=>({kind:"int",value:i}),te=i=>({kind:"double",value:i}),en=i=>i!==void 0&&/\s/u.test(i),Qe=i=>new RegExp("\\p{L}","u").test(i),ye=i=>new RegExp("\\p{N}","u").test(i);function Ze(i){const e=Array.from(i);return e.length===0||!(Qe(e[0])||e[0]==="_")?!1:e.every(t=>Qe(t)||ye(t)||t==="_")}function se(i){switch(i.toLowerCase()){case"int":return"int";case"double":return"double";case"string":return"string";case"char":return"string";case"boolean":case"bool":return"boolean";default:return}}function Zn(i){return i.kind==="int"?"int":i.kind==="double"?"double":i.kind==="boolean"?"boolean":"string"}function J(i){const e=Array.from(i);if(e.length===3&&e[0]==="'"&&e[2]==="'")return e[1];if(!(e.length<2||e[0]!=='"'||e[e.length-1]!=='"'))return e.slice(1,-1).join("").replaceAll('\\"','"').replaceAll("\\n",`
`)}function Dn(i){return i.replaceAll("(int)","").replaceAll("(double)","").trim()}function tn(i){const e=new Array(i.length).fill(!1);let t=0,n=!1,s=!1;return i.forEach((r,a)=>{if(n){s?s=!1:r==="\\"?s=!0:r==='"'&&(n=!1);return}switch(r){case'"':n=!0;break;case"(":case"[":t+=1;break;case")":case"]":t-=1;break;default:e[a]=t===0}}),e}function qe(i,e){const t=Array.from(i),n=Array.from(e),s=tn(t),r=[];let a=[],l=0;for(;l<t.length;){const o=l+n.length;if(o<=t.length&&n.every((u,c)=>t[l+c]===u)&&s.slice(l,o).every(Boolean)){r.push(a.join("").trim()),a=[],l=o;continue}a.push(t[l]),l+=1}return r.push(a.join("").trim()),r}function Ki(i){const e=Array.from(i),t=tn(e);for(let n=0;n<e.length;n++){if(!t[n])continue;let s;if(n+1<e.length&&t[n+1]){const l=e[n]+e[n+1];[">=","<=","==","!="].includes(l)&&(s=l)}if(s===void 0&&(e[n]==="<"||e[n]===">")&&(s=e[n]),s===void 0)continue;const r=e.slice(0,n).join("").trim(),a=e.slice(n+s.length).join("").trim();return{lhs:r,op:s,rhs:a}}}function rt(i,e){let t=0,n=!1,s=!1;for(let r=e;r<i.length;r++){const a=i[r];if(n){s?s=!1:a==="\\"?s=!0:a==='"'&&(n=!1);continue}if(a==='"')n=!0;else if(a==="(")t+=1;else if(a===")"&&(t-=1,t===0))return r}}function M1(i){const e=Array.from(i);if(!(e[0]!=="("||e[e.length-1]!==")"||rt(e,0)!==e.length-1))return e.slice(1,-1).join("").trim()}function Ji(i){const e=Array.from(i),t=Array.from(".equals(");if(e[e.length-1]!==")")return;const n=tn(e);for(let s=0;s<e.length;s++){if(!n[s]||s+t.length>e.length||!t.every((a,l)=>e[s+l]===a))continue;const r=s+t.length-1;if(rt(e,r)===e.length-1)return{lhs:e.slice(0,s).join("").trim(),rhs:e.slice(r+1,-1).join("").trim()}}}function Ne(i){const e=i.trim();for(const t of["if","while","until","switch"]){if(!e.startsWith(t))continue;const n=e.slice(t.length);if(!(n===""||en(n[0])||n[0]==="("))continue;let s=n.trim();const r=M1(s);return r!==void 0&&(s=r),s===""?"true":s}return e===""?"true":e}function be(i){const e=i.trim(),t=e.indexOf("[");if(!e.endsWith("]")||t<0)return;const n=e.slice(0,t).trim();if(!Ze(n))return;const s=[];let r=t;for(;r<e.length;){if(e[r]!=="[")return;let a=0,l=-1;for(let o=r;o<e.length;o++)if(e[o]==="[")a+=1;else if(e[o]==="]"&&--a===0){l=o;break}if(l<0)return;for(s.push(e.slice(r+1,l)),r=l+1;r<e.length&&en(e[r]);)r+=1}if(!(s.length>2))return{arrayName:n,indexExpressions:s}}function Qi(i){const e=i.trim();if(!e.endsWith(")"))return;const t=/^([A-Za-z_]\w*(?:\s*\[[^\[\]]*\])*|"(?:[^"\\]|\\.)*")\s*\.\s*([A-Za-z_]\w*)\s*\(/u.exec(e);if(!t)return;const n=Array.from(e),s=Array.from(t[0]).length-1;if(rt(n,s)!==n.length-1)return;const r=n.slice(s+1,-1).join("").trim();return{target:t[1],method:t[2],args:r===""?[]:qe(r,",")}}function Mn(i){return Ze(i)||be(i)!==void 0}function An(i){const e=[];let t="",n=!1,s=!1,r=0;for(const a of i){if(s){t+=a,s=!1;continue}if(a==="\\"){t+=a,s=!0;continue}if(a==='"'){n=!n,t+=a;continue}if(!n&&a==="("&&(r+=1),!n&&a===")"&&(r-=1),a==="+"&&!n&&r===0){e.push(t),t="";continue}t+=a}if(n)throw S(i);return e.push(t),e}function qi(i){const e=[];let t=0,n="";for(const s of i){if(s==="{"&&(t+=1),s==="}"&&(t-=1),s===","&&t===0){e.push(n),n="";continue}n+=s}return n.trim()!==""&&e.push(n),e}function jn(i){const e=Array.from(i),t=[];let n=0;for(;n<e.length;){const s=e[n];if(en(s)){n+=1;continue}if(ye(s)||s==="."&&n+1<e.length&&ye(e[n+1])){const r=n;let a=0;for(;n<e.length;){if(e[n]==="."){if(a+=1,a>1)throw S(i)}else if(!ye(e[n]))break;n+=1}const l=e.slice(r,n).join("");if(l==="."||!/^[0-9]*\.?[0-9]*$/.test(l))throw S(i);t.push({t:"number",literal:l,value:Number(l)});continue}if(Qe(s)||s==="_"){const r=n;for(;n<e.length&&(Qe(e[n])||ye(e[n])||e[n]==="_");)n+=1;t.push({t:"identifier",name:e.slice(r,n).join("")});continue}if("+-*/%.()[]".includes(s)){t.push({t:s}),n+=1;continue}throw S(i)}return t}class es{constructor(e,t){I(this,"index",0);this.tokens=e,this.variables=t}parseInt(){const e=this.expression().v;if(this.index!==this.tokens.length||!Number.isFinite(e))throw S("");return Math.trunc(e)}parseDouble(){return this.parseNumber().v}parseNumber(){const e=this.expression();if(this.index!==this.tokens.length)throw S("");return e}get current(){return this.tokens[this.index]}kind(){var e;return(e=this.tokens[this.index])==null?void 0:e.t}isIdent(e){const t=this.current;return(t==null?void 0:t.t)==="identifier"&&t.name===e}expression(){let e=this.term();for(let t=this.current;t&&(t.t==="+"||t.t==="-");t=this.current){this.index+=1;const n=this.term();e={v:t.t==="+"?e.v+n.v:e.v-n.v,int:e.int&&n.int}}return e}term(){let e=this.factor();for(let t=this.current;t&&(t.t==="*"||t.t==="/"||t.t==="%");t=this.current){this.index+=1;const n=this.factor(),s=e.int&&n.int;if(t.t==="*")e={v:e.v*n.v,int:s};else{if(n.v===0)throw Ui();e={v:t.t==="/"?s?Math.trunc(e.v/n.v):e.v/n.v:e.v%n.v,int:s}}}return e}factor(){const e=this.current;if(!e)throw S("");switch(this.index+=1,e.t){case"number":return{v:e.value,int:!e.literal.includes(".")};case"identifier":{const t=e.name;if(t==="Math"&&this.kind()==="."){if(this.index+=1,!this.isIdent("random"))throw S(t);if(this.index+=1,this.kind()!=="("||(this.index+=1,this.kind()!==")"))throw S("Math.random");return this.index+=1,{v:Math.random(),int:!1}}const n=this.variables.get(t);if(!n)throw we(t);if(this.kind()==="."){if(this.index+=1,!this.isIdent("length"))throw S(t);if(this.index+=1,this.kind()==="("){if(this.index+=1,this.kind()!==")")throw S(`${t}.length`);this.index+=1}if(Et(n))return{v:n.value.length,int:!0};throw S(t)}if(this.kind()==="["){this.index+=1;const r=Math.trunc(this.expression().v);if(this.kind()!=="]")throw S(t);if(this.index+=1,n.kind==="grid"){if(!(r>=0&&r<n.value.length))throw S(`${t}[${r}]`);const a=n.value[r];if(this.kind()==="."){if(this.index+=1,!this.isIdent("length"))throw S(t);if(this.index+=1,this.kind()==="("){if(this.index+=1,this.kind()!==")")throw S(`${t}.length`);this.index+=1}return{v:a.length,int:!0}}if(this.kind()!=="[")throw S(t);this.index+=1;const l=Math.trunc(this.expression().v);if(this.kind()!=="]")throw S(t);if(this.index+=1,!(l>=0&&l<a.length))throw S(`${t}[${r}][${l}]`);if(n.elementType!=="int"&&n.elementType!=="double")throw S(t);return{v:a[l],int:n.elementType==="int"}}if(n.kind==="intArray"||n.kind==="doubleArray"){if(!(r>=0&&r<n.value.length))throw S(`${t}[${r}]`);return{v:n.value[r],int:n.kind==="intArray"}}throw S(t)}const s=Oi(n);if(!Number.isFinite(s))throw S(t);return{v:s,int:n.kind==="int"}}case"-":{const t=this.factor();return{v:-t.v,int:t.int}}case"(":{const t=this.expression();if(this.kind()!==")")throw S("");return this.index+=1,t}default:throw S("")}}}function We(i){let e=i.trim();for(;e.endsWith(";");)e=e.slice(0,-1).trim();return e}function Pn(i){const e=i.slice(0,3);for(;e.length<3;)e.push("");return e}function Lt(i){const e=i.map(t=>We(t).trim());return e.length===1&&e[0].includes(";")?Pn(e[0].split(";").map(t=>t.trim())):Pn(e)}const X=i=>i.frame?{frame:i.frame,callPath:i.callPath}:{};function ee(i,e=[],t={}){const n=[],s=r=>n.push(t.frame?{...r,...t}:r);return i.forEach((r,a)=>{const l=[...e,a],o=r.textLines.join(" ").trim();switch(r.type){case g.anweisung:o!==""&&o!=="ø"&&s({path:l,text:o,kind:"statement"});break;case g.verzweigung:s({path:l,text:o||"true",kind:"branch",cases:r.cases});break;case g.fallauswahl:s({path:l,text:o||"0",kind:"switchSelection",cases:r.cases});break;case g.forSchleife:s({path:l,text:o,kind:"forLoopStart",loopBody:r.loopBody,forParts:Lt(r.textLines)});break;case g.whileSchleife:s({path:l,text:o||"true",kind:"whileLoop",loopBody:r.loopBody});break;case g.doUntilSchleife:s({path:l,text:o||"true",kind:"doUntilLoop",loopBody:r.loopBody});break;case g.endlosschleife:s({path:l,text:o||"true",kind:"infiniteLoop",loopBody:r.loopBody});break;case g.aussprung:s({path:l,text:o,kind:"jump"});break;case g.aufruf:o!==""&&o!=="ø"&&s({path:l,text:o,kind:"call"});break}}),n}function ts(i,e){const t=i.trim().replaceAll(",",".");switch(e){case"int":if(!/^[+-]?[0-9]+$/.test(t))throw new K({kind:"wholeNumberExpected"});return ce(Number(t));case"double":if(!/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)([eE][+-]?[0-9]+)?$/.test(t))throw new K({kind:"numberExpected"});return te(Number(t));case"string":return{kind:"string",value:i};case"boolean":switch(t.toLowerCase()){case"true":case"wahr":return{kind:"boolean",value:!0};case"false":case"falsch":return{kind:"boolean",value:!1};default:throw new K({kind:"booleanExpected"})}}}function Bn(){return{stepIndex:0,variables:new Map,outputLines:[],isHalted:!1}}function ns(i,e){for(let t=0;t<e.length;t++){const n=e[t].name.trim();if(n.toLowerCase()!=="default"){if(i.kind==="int"){if(/^[+-]?[0-9]+$/.test(n)&&Number(n)===i.value)return t}else if(J(n)===i.value||n===i.value)return t}}}function is(i){return i==="forLoopIncrement"||i==="forLoopCondition"||i==="whileLoop"||i==="doUntilCondition"||i==="infiniteLoop"}function ss(i,e){return(i.frame??0)===(e.frame??0)&&i.path.length===e.path.length&&i.path.every((t,n)=>t===e.path[n])}function he(i){const e=/^(void|int|double|String|boolean)\s+([A-Za-z_]\w*)\s*\((.*)\)$/u.exec(We(i));if(!e)return;const t=[];if(e[3].trim()!=="")for(const n of e[3].split(",")){const s=/^(int|double|String|boolean|char)\s*((?:\[\s*\]){0,2})\s+([A-Za-z_]\w*)$/u.exec(n.trim());if(!s)return;const r=(s[2].match(/\[/gu)??[]).length;t.push({type:se(s[1]),name:s[3],...r>0?{dims:r}:{}})}return{returnType:se(e[1]),name:e[2],params:t}}function A1(i){const e=/^(?:(?:(int|double|String|boolean)\s+)?([A-Za-z_]\w*)\s*=\s*)?([A-Za-z_]\w*)\s*\((.*)\)$/u.exec(We(i));if(e)return{targetType:e[1]?se(e[1]):void 0,target:e[2],name:e[3],args:e[4].trim()===""?[]:qe(e[4],",")}}function et(i){var t,n;const e=We(i);return((t=he(e))==null?void 0:t.name)??((n=A1(e))==null?void 0:n.name)??e.replace(/\(\s*\)$/u,"").trim()}class Ht{constructor(e,t=()=>{}){I(this,"steps");I(this,"state",Bn());I(this,"nextFrame",1);I(this,"callDepth",0);I(this,"frames",new Map);this.resolveSubprogram=t,this.steps=ee(e.elements)}get currentStepPath(){const e=this.steps[this.state.stepIndex];return(e==null?void 0:e.callPath)??(e==null?void 0:e.path)}get canStep(){return!this.state.isHalted&&!this.state.inputRequest&&this.state.stepIndex<this.steps.length}get message(){return this.state.notice&&Z1(this.state.notice)}reset(e){e&&(this.steps=ee(e.elements)),this.state=Bn(),this.nextFrame=1,this.callDepth=0,this.frames.clear()}step(){const e=this.state;if(!this.canStep){!e.inputRequest&&!e.isHalted&&(e.notice={kind:"finished"});return}const t=this.steps[e.stepIndex];try{switch(t.kind){case"statement":if(/^return\b/u.test(t.text))return this.executeReturn(t);this.executeStatement(t.text);break;case"branch":return this.executeBranch(t);case"switchSelection":return this.executeSwitchSelection(t);case"forLoopStart":return this.executeForLoopStart(t);case"forLoopCondition":return this.executeForLoopCondition(t);case"forLoopIncrement":return this.executeForLoopIncrement(t);case"whileLoop":return this.executeWhileLoop(t);case"doUntilLoop":return this.enterDoUntilLoop(t);case"doUntilCondition":return this.executeDoUntilCondition(t);case"infiniteLoop":return this.enterInfiniteLoop(t);case"jump":return this.executeJump(t);case"call":return this.executeCall(t);case"callEnd":return this.executeCallEnd(t)}if(e.inputRequest){e.notice=void 0;return}e.stepIndex+=1,e.notice=this.finishedIfAtEnd()}catch(n){e.notice=kn(n),e.isHalted=!0}}provideInput(e){const t=this.state.inputRequest;if(t){try{const n=ts(e,t.valueType);this.assignValue(n,t.variableName),this.state.lastTrace=`${t.variableName} = input -> ${F(n)}`}catch(n){this.state.inputErrorNotice=kn(n);return}this.state.inputRequest=void 0,this.state.inputErrorNotice=void 0,this.state.stepIndex+=1,this.state.notice=this.finishedIfAtEnd()}}finishedIfAtEnd(){return this.state.stepIndex>=this.steps.length?{kind:"finished"}:void 0}splice(e){this.steps.splice(this.state.stepIndex,1,...e)}noticeAfterEntering(e){return e.length>0?void 0:this.finishedIfAtEnd()}executeBranch(e){const t=e.cases;if(!t||t.length<2)throw $(e.text);const n=Ne(e.text),s=this.evaluateBool(n),r=s?0:1,a=ee(t[r].elements,[...e.path,r],X(e));this.splice(a),this.state.lastTrace=`${n} -> ${s}`,this.state.notice=this.noticeAfterEntering(a)}executeSwitchSelection(e){const t=e.cases;if(!t||t.length===0)throw $(e.text);const n=Ne(e.text),s=this.evaluateSwitchSelector(n),r=ns(s,t)??t.length-1,a=ee(t[r].elements,[...e.path,r],X(e));this.splice(a),this.state.lastTrace=`${n} -> ${t[r].name}`,this.state.notice=this.noticeAfterEntering(a)}executeForLoopStart(e){const t=Lt(e.forParts??[e.text]);t[0]!==""&&this.executeStatement(t[0]),this.splice([{...X(e),path:e.path,text:t[1],kind:"forLoopCondition",loopBody:e.loopBody,forParts:t}])}executeForLoopCondition(e){const t=Lt(e.forParts??[e.text]),n=t[1]===""?"true":t[1],s=this.evaluateBool(n);if(this.state.lastTrace=`${n} -> ${s}`,s){const r=ee(e.loopBody??[],[...e.path,0],X(e));this.splice([...r,{...X(e),path:e.path,text:t[2],kind:"forLoopIncrement",loopBody:e.loopBody,forParts:t},{...X(e),path:e.path,text:t[1],kind:"forLoopCondition",loopBody:e.loopBody,forParts:t}])}else this.splice([]),this.state.notice=this.finishedIfAtEnd()}executeForLoopIncrement(e){const t=e.text.trim();t!==""&&this.executeIncrement(t),this.splice([])}executeWhileLoop(e){const t=Ne(e.text),n=this.evaluateBool(t);if(this.state.lastTrace=`${t} -> ${n}`,n){const s=ee(e.loopBody??[],[...e.path,0],X(e));this.splice([...s,{...X(e),path:e.path,text:e.text,kind:"whileLoop",loopBody:e.loopBody}]),this.state.notice=this.noticeAfterEntering(s)}else this.splice([]),this.state.notice=this.finishedIfAtEnd()}enterDoUntilLoop(e){const t=ee(e.loopBody??[],[...e.path,0],X(e));this.splice([...t,{...X(e),path:e.path,text:e.text,kind:"doUntilCondition",loopBody:e.loopBody}]),this.state.notice=this.noticeAfterEntering(t)}executeDoUntilCondition(e){const t=Ne(e.text),n=this.evaluateBool(t);if(this.state.lastTrace=`${t} -> ${n}`,n){const s=ee(e.loopBody??[],[...e.path,0],X(e));this.splice([...s,{...X(e),path:e.path,text:e.text,kind:"doUntilCondition",loopBody:e.loopBody}])}else this.splice([]),this.state.notice=this.finishedIfAtEnd()}enterInfiniteLoop(e){const t=ee(e.loopBody??[],[...e.path,0],X(e));this.splice([...t,{...X(e),path:e.path,text:e.text,kind:"infiniteLoop",loopBody:e.loopBody}]),this.state.lastTrace="true -> true",this.state.notice=t.length>0?void 0:{kind:"infiniteLoopWithoutBody"}}executeJump(e){const t=e.frame??0,n=l=>l.length<e.path.length&&l.every((o,u)=>o===e.path[u]);let s=this.steps.length,r="end";for(let l=this.state.stepIndex+1;l<this.steps.length;l++){const o=this.steps[l];if((o.frame??0)===t){if(o.kind==="callEnd"){s=l+1,r="return";break}if(is(o.kind)&&n(o.path)){for(s=l+1;s<this.steps.length&&ss(this.steps[s],o);)s+=1;r="break";break}}}const a=this.steps[s-1];r==="return"&&(this.callDepth-=1),this.steps.splice(this.state.stepIndex,s-this.state.stepIndex),this.state.lastTrace=`${e.text||"break"} -> ${r}`,r==="return"&&this.finishFrame(a),this.state.notice=this.finishedIfAtEnd()}executeCall(e){const t=e.text,n=this.resolveSubprogram(et(t));if(!n){this.splice([]),this.state.lastTrace=`${t} -> ?`,this.state.notice={kind:"subprogramNotFound",text:t},this.state.stepIndex>=this.steps.length&&(this.state.notice={kind:"finished"});return}const s=A1(t),r=he(n.caption);if(r?((s==null?void 0:s.args.length)??0)!==r.params.length||(s==null?void 0:s.target)!==void 0&&!r.returnType:s!==void 0&&(s.args.length>0||s.target!==void 0))throw new K({kind:"callArguments",text:(r==null?void 0:r.name)??et(t)});if(this.callDepth>=Ri)throw new K({kind:"callTooDeep"});const l=new Map,o=[];r==null||r.params.forEach((m,p)=>{const f=s.args[p].trim();if(!m.dims){l.set(m.name,this.evaluateExpression(f,m.type));return}const z=this.state.variables.get(f);if(!z)throw/^[A-Za-z_]\w*$/u.test(f)?new K({kind:"unknownVariable",text:f}):S(f);if(!(m.dims===1?z.kind===`${m.type}Array`:z.kind==="grid"&&z.elementType===m.type))throw S(f);l.set(m.name,z),o.push({param:m.name,callerName:f})}),this.callDepth+=1;const u={frame:this.nextFrame++,callPath:e.callPath??e.path};r&&(this.frames.set(u.frame,{saved:this.state.variables,header:r,call:s,references:o}),this.state.variables=l);const c=ee(n.elements,[],u);this.splice([...c,{...u,path:e.path,text:t,kind:"callEnd"}]);const d=r==null?void 0:r.params.map((m,p)=>`${m.name} = ${m.dims?s.args[p].trim():F(l.get(m.name))}`).join(", ");this.state.lastTrace=d?`${t} -> ${d}`:`${t} -> call`}executeCallEnd(e){this.callDepth-=1,this.splice([]),this.state.lastTrace=`${e.text} -> return`,this.finishFrame(e),this.state.notice=this.finishedIfAtEnd()}executeReturn(e){const t=e.frame??0,n=We(e.text).slice(6).trim(),s=this.frames.get(t);if(s&&n!==""){if(!s.header.returnType)throw S(e.text);s.returnValue=this.evaluateExpression(n,s.header.returnType)}const r=s!=null&&s.returnValue?`${e.text} -> ${F(s.returnValue)}`:`${e.text} -> return`;if(t===0){this.steps.splice(this.state.stepIndex),this.state.lastTrace=r,this.state.notice={kind:"finished"};return}let a=this.state.stepIndex+1;for(;a<this.steps.length&&!(this.steps[a].kind==="callEnd"&&this.steps[a].frame===t);)a++;const l=this.steps[a];this.steps.splice(this.state.stepIndex,a-this.state.stepIndex+1),this.callDepth-=1,this.state.lastTrace=r,l&&this.finishFrame(l),this.state.notice=this.finishedIfAtEnd()}finishFrame(e){var o,u;const t=this.frames.get(e.frame??0);if(!t)return;this.frames.delete(e.frame??0);const n=t.references.length>0?new Map(t.saved):t.saved;for(const c of t.references){const d=this.state.variables.get(c.param);d&&n.set(c.callerName,d)}this.state.variables=n;const s=t.returnValue;if(t.header.returnType&&!s)throw new K({kind:"missingReturn",text:t.header.name});const r=(o=t.call)==null?void 0:o.target;if(!r||!s)return;let a=(u=t.call)==null?void 0:u.targetType;if(!a)try{a=this.inferTargetValueType(r)}catch{a=t.header.returnType}const l=a==="double"&&s.kind==="int"?te(s.value):a==="string"?{kind:"string",value:F(s)}:s;if(Zn(l)!==a)throw S(e.text);this.assignValue(l,r),this.state.lastTrace=`${r} = ${e.text.slice(e.text.indexOf("=")+1).trim()} -> ${F(l)}`}executeStatement(e){const t=this.state,n=e.trim(),s=n.toLowerCase();if(s.startsWith("input:")){t.inputRequest=this.parseInputRequest(n),t.inputErrorNotice=void 0;return}if(s.startsWith("output:")||s.startsWith("print:")){const p=n.slice(s.startsWith("output:")?7:6),f=this.renderOutputExpression(p),z=this.evaluateOutputExpression(p);t.outputLines.push(z),t.lastTrace=`${f} -> ${z}`;return}if(n.endsWith("++")||n.endsWith("--")||n.includes("+=")||n.includes("-=")){this.executeIncrement(n);return}const r=n.indexOf("=");if(r<0)throw $(n);const a=n.slice(0,r).trim(),l=n.slice(r+1),o=this.parseArrayDeclaration(a,l);if(o){t.variables.set(o.name,o.value),t.lastTrace=`${o.name} = new ${o.typeName}[${o.count}]`;return}const u=this.parseAssignmentTarget(a);let c;try{c=this.renderNumericExpression(l)}catch{c=l.trim()}let d=u.valueType;if(!d)try{d=this.inferTargetValueType(u.variableName)}catch{d="int"}const m=this.evaluateExpression(l,d);this.assignValue(m,u.variableName),t.lastTrace=`${u.variableName} = ${c} -> ${F(m)}`}executeIncrement(e){const t=this.state.variables;for(const[n,s]of[["++",1],["--",-1]]){if(!e.endsWith(n))continue;const r=e.slice(0,-2).trim(),a=t.get(r);if(!Ze(r)||!a)throw $(e);const l=s>0?"+":"-";if(a.kind==="int"){t.set(r,ce(a.value+s)),this.state.lastTrace=`${r} = ${a.value} ${l} 1 -> ${a.value+s}`;return}if(a.kind==="double"){const o=a.value+s;t.set(r,te(o)),this.state.lastTrace=`${r} = ${F(a)} ${l} 1 -> ${F(te(o))}`;return}throw $(e)}for(const[n,s]of[["+=",1],["-=",-1]]){const r=e.indexOf(n);if(r<0)continue;const a=e.slice(0,r).trim(),l=e.slice(r+2),o=t.get(a);if(!Ze(a)||!o)throw $(e);const u=s>0?"+":"-";if(o.kind==="int"){const c=this.evaluateInt(l),d=o.value+s*c;t.set(a,ce(d)),this.state.lastTrace=`${a} = ${o.value} ${u} ${c} -> ${d}`;return}if(o.kind==="double"){const c=this.evaluateDouble(l),d=o.value+s*c;t.set(a,te(d)),this.state.lastTrace=`${a} = ${F(o)} ${u} ${F(te(c))} -> ${F(te(d))}`;return}throw $(e)}this.executeStatement(e)}parseAssignmentTarget(e){if(be(e))return{variableName:e.trim()};const t=e.split(/\s+/u).filter(Boolean);let n,s;if(t.length===1)n=t[0];else if(t.length===2&&se(t[0]))n=t[1],s=se(t[0]);else if(t.length===3&&t[0]==="const"&&se(t[1]))n=t[2],s=se(t[1]);else throw $(e);if(!Mn(n))throw $(e);return{variableName:n,valueType:s}}parseInputRequest(e){const t=e.slice(6).trim(),n=/^(\S+)(?:\s+(\S+))?(?:\s+([\s\S]*))?$/u.exec(t);if(!n)throw $(e);const s=[n[1],n[2],n[3]].filter(c=>c!==void 0);let r,a,l;const o=se(s[0]);if(s.length>=2&&o?(r=s[1],a=o,l=(s[2]??"").trim()):(r=s[0],a=this.inferTargetValueType(r),l=(s[1]??"").trim()),!Mn(r))throw $(e);const u=J(l)??l;return{variableName:r,valueType:a,prompt:u===""?`${r}:`:u}}parseArrayDeclaration(e,t){const n=e.split(/\s+/u).filter(Boolean);if(n.length!==2||!n[0].endsWith("[]"))return;const s=n[0].endsWith("[][]"),r=n[0].slice(0,s?-4:-2),a=se(r),l=n[1];if(!a||!Ze(l))throw $(e);if(s)return this.parseGridDeclaration(l,r,a,t);const o=t.trim();if(o.startsWith("{")&&o.endsWith("}")){const p=o.slice(1,-1).split(",").map(z=>z.trim());let f;switch(a){case"int":f={kind:"intArray",value:p.map(z=>this.evaluateInt(z))};break;case"double":f={kind:"doubleArray",value:p.map(z=>this.evaluateDouble(z))};break;case"string":f={kind:"stringArray",value:p.map(z=>J(z)??this.evaluateOutputExpression(z))};break;case"boolean":f={kind:"booleanArray",value:p.map(z=>this.evaluateBool(z))};break}return{name:l,typeName:r,count:p.length,value:f}}const u=`new ${r}[`;if(!o.startsWith(u)){const p=this.evaluateStringMethod(o);if((p==null?void 0:p.kind)==="stringArray"&&a==="string")return{name:l,typeName:r,count:p.value.length,value:p}}if(!o.startsWith(u)||!o.endsWith("]"))throw $(t);const c=o.slice(u.length,-1),d=this.evaluateInt(c);if(d<0)throw S(c);const m=a==="int"?{kind:"intArray",value:new Array(d).fill(0)}:a==="double"?{kind:"doubleArray",value:new Array(d).fill(0)}:a==="boolean"?{kind:"booleanArray",value:new Array(d).fill(!1)}:{kind:"stringArray",value:new Array(d).fill("")};return{name:l,typeName:r,count:d,value:m}}parseGridDeclaration(e,t,n,s){var d;const r=s.trim(),a=m=>{switch(n){case"int":return this.evaluateInt(m);case"double":return this.evaluateDouble(m);case"boolean":return this.evaluateBool(m);case"string":return J(m.trim())??this.evaluateOutputExpression(m)}};if(r.startsWith("{")&&r.endsWith("}")){const m=qi(r.slice(1,-1)).map(p=>{const f=p.trim();if(!f.startsWith("{")||!f.endsWith("}"))throw S(f);return f.slice(1,-1).trim()===""?[]:f.slice(1,-1).split(",").map(z=>a(z.trim()))});return{name:e,typeName:t,count:`${m.length}][${((d=m[0])==null?void 0:d.length)??0}`,value:{kind:"grid",elementType:n,value:m}}}const l=new RegExp(String.raw`^new\s+${t}\s*\[(.+)\]\s*\[(.+)\]$`,"u").exec(r);if(!l)throw $(s);const o=this.evaluateInt(l[1]),u=this.evaluateInt(l[2]);if(o<0)throw S(l[1]);if(u<0)throw S(l[2]);const c={kind:"grid",elementType:n,value:Array.from({length:o},()=>new Array(u).fill(Yi(n)))};return{name:e,typeName:t,count:`${o}][${u}`,value:c}}arrayIndex(e){const t=this.evaluateInt(e);if(t<0)throw S(e);return t}evaluateReference(e){const t=e.trim(),n=this.state.variables.get(t);if(n)return n;const s=this.evaluateStringMethod(t);if(s)return s;const r=be(t);if(r)return this.valueInArray(r.arrayName,r.indexExpressions.map(a=>this.arrayIndex(a)))}evaluateStringMethod(e){const t=Qi(e);if(!t)return;const n=J(t.target)??this.stringValueOf(t.target);if(n===void 0)return;const s=t.args,r=c=>{const d=s[c];if(d===void 0)throw S(e);const m=J(d.trim());if(m!==void 0)return m;const p=this.evaluateReference(d);if((p==null?void 0:p.kind)==="string")return p.value;throw S(d)},a=c=>{if(s[c]===void 0)throw S(e);return this.evaluateInt(s[c])},l=c=>{if(s.length!==c)throw S(e)},o=Array.from(n),u=(c,d)=>{if(c<0||c>d)throw S(e);return c};switch(t.method){case"length":return l(0),ce(o.length);case"charAt":return l(1),{kind:"string",value:o[u(a(0),o.length-1)]};case"substring":{if(s.length!==1&&s.length!==2)throw S(e);const c=u(a(0),o.length),d=s.length===2?u(a(1),o.length):o.length;if(d<c)throw S(e);return{kind:"string",value:o.slice(c,d).join("")}}case"indexOf":{l(1);const c=n.indexOf(r(0));return ce(c<0?-1:Array.from(n.slice(0,c)).length)}case"toUpperCase":return l(0),{kind:"string",value:n.toUpperCase()};case"toLowerCase":return l(0),{kind:"string",value:n.toLowerCase()};case"trim":return l(0),{kind:"string",value:n.trim()};case"contains":return l(1),{kind:"boolean",value:n.includes(r(0))};case"startsWith":return l(1),{kind:"boolean",value:n.startsWith(r(0))};case"endsWith":return l(1),{kind:"boolean",value:n.endsWith(r(0))};case"replace":return l(2),{kind:"string",value:n.replaceAll(r(0),r(1))};case"split":{l(1);const c=r(0),d=c===""?o:n.split(c);for(;d.length>0&&d[d.length-1]==="";)d.pop();return{kind:"stringArray",value:d}}default:return}}stringValueOf(e){const t=e.trim(),n=this.state.variables.get(t);if(n)return n.kind==="string"?n.value:void 0;const s=be(t);if(!s)return;const r=this.valueInArray(s.arrayName,s.indexExpressions.map(a=>this.arrayIndex(a)));return r.kind==="string"?r.value:void 0}substituteStringCalls(e){if(!e.includes("("))return e;let t="",n=e;const s=/([A-Za-z_]\w*(?:\[[^\[\]]*\])*|"(?:[^"\\]|\\.)*")\s*\.\s*(length|indexOf)\s*\(/u;for(let r=s.exec(n);r;r=s.exec(n)){const a=r.index+r[0].length-1,l=rt(Array.from(n),Array.from(n.slice(0,a)).length);if(l===void 0)break;const o=Array.from(n),u=o.slice(Array.from(n.slice(0,r.index)).length,l+1).join(""),c=this.evaluateStringMethod(u),d=o.slice(0,Array.from(n.slice(0,r.index)).length).join("");(c==null?void 0:c.kind)==="int"?t+=d+String(c.value):t+=d+u,n=o.slice(l+1).join("")}return t+n}valueInArray(e,t){const n=this.state.variables.get(e);if(!n)throw we(e);const s=`${e}[${t.join("][")}]`;if(n.kind==="grid"){if(t.length!==2)throw S(s);const a=n.value[t[0]];if(!a||t[1]>=a.length)throw S(s);return D1(n.elementType,a[t[1]])}if(t.length!==1)throw S(s);const r=t[0];if(!Et(n))throw S(e);if(r>=n.value.length)throw S(s);switch(n.kind){case"intArray":return ce(n.value[r]);case"doubleArray":return te(n.value[r]);case"stringArray":return{kind:"string",value:n.value[r]};case"booleanArray":return{kind:"boolean",value:n.value[r]};default:throw S(e)}}inferTargetValueType(e){const t=e.trim(),n=this.state.variables.get(t);if(n)return Zn(n);const s=be(t);if(s){const r=this.state.variables.get(s.arrayName);if(!r)throw we(s.arrayName);if(r.kind==="intArray")return"int";if(r.kind==="doubleArray")return"double";if(r.kind==="stringArray")return"string";if(r.kind==="booleanArray")return"boolean";if(r.kind==="grid")return r.elementType;throw S(s.arrayName)}throw $(e)}assignValue(e,t){const n=t.trim(),s=be(n);if(!s){this.state.variables.set(n,e);return}const r=s.indexExpressions.map(u=>this.arrayIndex(u)),a=this.state.variables.get(s.arrayName);if(!a)throw we(s.arrayName);if(a.kind==="grid"){if(r.length!==2||r[0]>=a.value.length||r[1]>=a.value[r[0]].length)throw S(n);const u=a.elementType==="double"&&e.kind==="int"||e.kind===a.elementType?e.value:void 0;if(u===void 0||Et(e))throw S(n);const c=a.value.map(d=>[...d]);c[r[0]][r[1]]=u,this.state.variables.set(s.arrayName,{...a,value:c});return}if(r.length!==1)throw S(n);const l=r[0];let o;if(a.kind==="intArray"&&e.kind==="int")o={kind:"intArray",value:[...a.value]};else if(a.kind==="doubleArray"&&(e.kind==="double"||e.kind==="int"))o={kind:"doubleArray",value:[...a.value]};else if(a.kind==="stringArray"&&e.kind==="string")o={kind:"stringArray",value:[...a.value]};else if(a.kind==="booleanArray"&&e.kind==="boolean")o={kind:"booleanArray",value:[...a.value]};else throw S(n);if(l>=o.value.length)throw S(n);o.value[l]=e.value,this.state.variables.set(s.arrayName,o)}evaluateOutputExpression(e){return An(e).map(t=>{const n=t.trim(),s=J(n);if(s!==void 0)return s;const r=this.evaluateReference(n);return F(r||this.evaluateNumeric(n))}).join("")}renderOutputExpression(e){return An(e).map(t=>{const n=t.trim();if(J(n)!==void 0)return n;const s=this.evaluateReference(n);if(s)return F(s);try{return this.renderNumericExpression(n)}catch{return n}}).join(" + ")}evaluateExpression(e,t){switch(t){case"int":return ce(this.evaluateInt(e));case"double":return te(this.evaluateDouble(e));case"string":{const n=e.trim(),s=J(n);if(s!==void 0)return{kind:"string",value:s};const r=this.evaluateReference(n);return r?{kind:"string",value:F(r)}:{kind:"string",value:this.evaluateOutputExpression(e)}}case"boolean":return{kind:"boolean",value:this.evaluateBool(e)}}}evaluateNumeric(e){const{v:t,int:n}=this.parser(e).parseNumber();return n||Number.isFinite(t)&&Math.round(t)===t?ce(t):te(t)}parser(e){return new es(jn(Dn(this.substituteStringCalls(e))),this.state.variables)}evaluateInt(e){return this.parser(e).parseInt()}evaluateDouble(e){return this.parser(e).parseDouble()}evaluateBool(e){const t=e.trim();if(t==="true")return!0;if(t==="false")return!1;const n=this.evaluateReference(t);if((n==null?void 0:n.kind)==="boolean")return n.value;const s=qe(t,"||");if(s.length>1)return s.some(u=>this.evaluateBool(u));const r=qe(t,"&&");if(r.length>1)return r.every(u=>this.evaluateBool(u));if(t.startsWith("!")&&!t.startsWith("!="))return!this.evaluateBool(t.slice(1));const a=M1(t);if(a!==void 0)return this.evaluateBool(a);const l=Ji(t);if(l)return this.evaluateComparison(l.lhs,"==",l.rhs);const o=Ki(t);if(o)return this.evaluateComparison(o.lhs,o.op,o.rhs);if(this.stringOperand(t)!==void 0)throw S(t);return this.evaluateDouble(t)!==0}evaluateComparison(e,t,n){const s=this.booleanOperand(e),r=this.booleanOperand(n);if((s!==void 0||r!==void 0)&&(t==="=="||t==="!=")){const c=s??this.evaluateBool(e),d=r??this.evaluateBool(n);return t==="=="?c===d:c!==d}const a=this.stringOperand(e),l=this.stringOperand(n);let o,u;if(a!==void 0||l!==void 0){if(a===void 0||l===void 0)throw S(`${e} ${t} ${n}`);o=a,u=l}else o=this.evaluateDouble(e),u=this.evaluateDouble(n);switch(t){case"==":return o===u;case"!=":return o!==u;case"<":return o<u;case"<=":return o<=u;case">":return o>u;case">=":return o>=u;default:throw S(`${e} ${t} ${n}`)}}booleanOperand(e){const t=e.trim();if(t==="true")return!0;if(t==="false")return!1;const n=this.evaluateReference(t);return(n==null?void 0:n.kind)==="boolean"?n.value:void 0}stringOperand(e){const t=e.trim(),n=J(t);if(n!==void 0)return n;const s=this.evaluateReference(t);return(s==null?void 0:s.kind)==="string"?s.value:void 0}evaluateSwitchSelector(e){const t=e.trim(),n=J(t);if(n!==void 0)return{kind:"text",value:n};const s=this.state.variables.get(t);if(s)switch(s.kind){case"int":return{kind:"int",value:s.value};case"double":return{kind:"int",value:Math.trunc(s.value)};case"string":return{kind:"text",value:s.value};default:throw S(t)}return/^[+-]?[0-9]+$/.test(t)?{kind:"int",value:Number(t)}:{kind:"int",value:this.evaluateInt(t)}}renderNumericExpression(e){return jn(Dn(e)).map(t=>{if(t.t==="number")return t.literal;if(t.t==="identifier"){const n=this.state.variables.get(t.name);if(!n)throw we(t.name);return F(n)}return t.t}).join(" ").replaceAll("( ","(").replaceAll(" )",")").replaceAll(" . ",".").replaceAll("[ ","[").replaceAll(" ]","]")}}const j1={baseIndent:0,indentPerLevel:4,includeDiagramTextAsComments:!1,includeEmptyElseBranch:!0,pseudocodeNote:"Pseudocode – not a runnable program"};function P1(i,e,t={},n=[]){const s=B1(i,e,t);let r="";e==="javascript"&&(r+=`"use strict";

`);const a=[i,...e==="java"?[]:n];if(e==="python"&&a.some(Ps)&&(r+=`import random

`),e==="java"&&Ft(i)&&(r+=`// import java.util.Scanner;
`,r+=`Scanner scanner = new Scanner(System.in);

`),i.pseudocode&&(r+=(e==="python"?"# ":"// ")+s.pseudocodeNote+`

`),e!=="java")for(const u of n){if(u===i)continue;const c=he(u.caption);c&&(r+=Nt(u,c,e,t,0)+`
`)}const l=he(i.caption),o={out:""};if(l)o.out=Nt(i,l,e,t,s.baseIndent);else for(const u of i.elements)ut(u,e,s,s.baseIndent,o);if(r+=o.out,r.trim()===""){const u=rs(e);return e==="javascript"?`"use strict";

`+u:u}return Cs(r.replace(/^[\n\r]+|[\n\r]+$/g,""),e)}function B1(i,e,t){const n={...j1,...t,jsIntVariables:new Set,arrayElementTypes:gs(i),stringVariables:ms(i)};return e!=="java"&&(n.jsIntVariables=js(i)),n}const Wn=i=>i==="string"?"String":i===void 0?"void":i;function Nt(i,e,t,n,s){const r=B1(i,t,n);for(const o of e.params)o.dims||(o.type==="int"&&r.jsIntVariables.add(o.name),o.type==="string"&&r.stringVariables.add(o.name));const a=e.params.map(o=>o.name).join(", "),l={out:""};for(const o of i.elements)ut(o,t,r,s+r.indentPerLevel,l);switch(l.out.trim()===""&&(l.out=y(s+r.indentPerLevel)+(t==="python"?`pass
`:`
`)),t){case"java":{const o=e.params.map(u=>`${Wn(u.type)}${"[]".repeat(u.dims??0)} ${u.name}`).join(", ");return`${y(s)}public static ${Wn(e.returnType)} ${e.name}(${o}) {
${l.out}${y(s)}}
`}case"python":return`${y(s)}def ${e.name}(${a}):
${l.out}`;case"javascript":return`${y(s)}function ${e.name}(${a}) {
${l.out}${y(s)}}
`}}const y=i=>i>0?" ".repeat(i):"";function B(i,e){const t=i.exec(e);return t?Array.from(t,n=>n??""):void 0}function rs(i,e){return i==="python"?"# empty element":"// empty element"}const Gt=i=>i.trim()==="ø";function W1(i,e){return y(i)+(e==="python"?`# empty element
`:`// empty element
`)}function as(i){switch(i.type){case g.leerElement:return!0;case g.anweisung:case g.aufruf:return i.textLines.map(e=>e.trim()).every(e=>e===""||Gt(e));default:return!1}}function ls(i){return i.every(as)}function nn(i,e,t){const n=i.map(s=>s.replace(/^[ \t]+|[ \t]+$/g,"")).filter(s=>s!=="");return n.length===0?"":e==="python"?y(t)+`"""
`+n.map(s=>y(t)+s+`
`).join("")+y(t)+`"""
`:n.length===1?y(t)+"/* "+n[0]+` */
`:y(t)+`/*
`+n.map(s=>y(t)+" * "+s+`
`).join("")+y(t)+` */
`}const os=i=>i==="java"||i==="javascript";function tt(i){const e=i.trim();if(e==="")return"";if(e.startsWith("//")||e.startsWith("/*")||e.startsWith("*")||e.startsWith("#")||e.startsWith("{")||e.startsWith("}")||e.endsWith("{")||e.endsWith(";"))return e;const t=e.toLowerCase();for(const n of["if ","else","for ","while ","do ","switch ","case ","default"])if(t.startsWith(n))return e;return e+";"}function Ye(i){const e=i.map(t=>t.trim()).filter(t=>t!=="");return us(e.length===0?"true":e.join(" "))}function us(i){const e=i.trim();for(const t of["if","while","until","switch"]){const n=C1(t,e);if(n!==void 0)return n===""?"true":n}return e}function C1(i,e){if(!e.toLowerCase().startsWith(i))return;const t=e.slice(i.length);if(!(t===""||/^\s/.test(t)||t[0]==="("))return;let n=t.trim();return n.startsWith("(")&&n.endsWith(")")&&n.length>=2&&(n=n.slice(1,-1).trim()),n}function ge(i){let e=i.trim();for(;e.endsWith(";");)e=e.slice(0,-1).trim();return e}function cs(i){const e=i.trim(),t=e.toLowerCase();let n;if(t.startsWith("output:"))n=e.slice(7).trim();else if(t.startsWith("print:"))n=e.slice(6).trim();else return;return n===""?void 0:n}const at=i=>i.name.includes("[")&&i.name.includes("]");function sn(i){const e=i.trim();if(e==="")return;const t=B(/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s+([a-zA-Z_]\w*(?:\s*\[[^\]]+\])?)(?:\s+"([^"]*)")?\s*$/i,e);if(t){const r=t[2].replaceAll(" ","");if(r==="")return;const a=(t[3]??"").trim();return{type:nt(t[1]),name:r,customPrompt:a===""?void 0:a}}const n=B(/^\s*([a-zA-Z_]\w*(?:\s*\[[^\]]+\])?)\s+"([^"]*)"\s*$/i,e);if(n){const r=n[1].replaceAll(" ","");return["int","integer","long","float","double","string","boolean","char","bool","void"].includes(r.toLowerCase())?void 0:{type:r.includes("[")?"String":"int",name:r,customPrompt:n[2].trim()}}const s=ds(e);if(s)return{type:nt(s[0]),name:s[1]}}function nt(i){switch(i.trim().toLowerCase()){case"integer":case"int":return"int";case"long":return"long";case"float":return"float";case"double":return"double";case"string":return"String";case"boolean":case"bool":return"boolean";case"char":return"char";default:return i}}function ds(i){const e=i.split(/[ \t]+/).filter(Boolean);if(e.length===0)return;if(e.length>=2)return[e[0],e[1]];if(!["int","double","string","boolean","char","long","float","short","byte","void","bool","integer"].includes(e[0].toLowerCase()))return["int",e[0]]}function hs(i,e,t,n,s){const r=ge(i).trim();if(r.startsWith('"'))switch(e){case"java":return y(t)+"System.out.println("+r+`);
`;case"javascript":return y(t)+"console.log("+r+`);
`;case"python":return y(t)+"print("+Pe(r,n,s)+`)
`}}function je(i){return i.replaceAll("\\","\\\\").replaceAll('"','\\"').replaceAll(`
`,"\\n").replaceAll("\r","\\r")}function rn(i,e){const t=i.trim();if(!t.toLowerCase().startsWith("input:"))return;const n=t.slice(6).trim();if(n==="")return;const s=sn(n);if(s&&at(s)&&!/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s/i.test(n)){const r=e.get(s.name.slice(0,s.name.indexOf("[")).trim());if(r)return{...s,type:r}}return s}function ms(i){const e=new Set;return me(i.elements,t=>{for(const n of t.textLines){const s=n.trim();if(s.toLowerCase().startsWith("input:")){const l=sn(s.slice(6).trim());(l==null?void 0:l.type)==="String"&&!at(l)&&e.add(l.name);continue}const r=B(/^\s*(?:const\s+)?string\s+([a-zA-Z_]\w*)\s*=/i,s);r&&e.add(r[1]);const a=B(/^\s*string\s*\[\s*\]\s*([a-zA-Z_]\w*)\s*=/i,s);a&&e.add(a[1]+"[]")}}),e}function gs(i){const e=new Map;return me(i.elements,t=>{for(const n of t.textLines){const s=B(/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s*\[\s*\]\s*([a-zA-Z_]\w*)/i,n)??B(/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s+([a-zA-Z_]\w*)\s*\[\s*\]/i,n);s&&e.set(s[2],nt(s[1]))}}),e}function ps(i,e,t){const n=rn(i,t);if(!n)return;const s=n.customPrompt?n.customPrompt:n.name+": ",r=y(e)+'System.out.println("'+je(s)+`");
`,a=l=>at(n)?n.name:`${l} ${n.name}`;switch(n.type){case"int":return r+y(e)+`${a("int")} = scanner.nextInt();
`;case"double":return r+y(e)+`${a("double")} = scanner.nextDouble();
`;case"String":return r+y(e)+`${a("String")} = scanner.next();
`;case"boolean":return r+y(e)+`${a("boolean")} = scanner.nextBoolean();
`;default:return}}function fs(i,e,t){const n=rn(i,t);if(!n)return;const s=!!n.customPrompt,r=s?"":y(e)+'console.log("'+je(n.name+": ")+`");
`,a=o=>{const u=s?n.customPrompt:n.name+": ";return`(prompt("${je(u)}") ?? "${o}")`},l=at(n)?n.name:`let ${n.name}`;switch(n.type){case"int":return r+y(e)+`${l} = parseInt(${a("0")}, 10);
`;case"double":return r+y(e)+`${l} = Number(${a("0")});
`;case"String":return r+y(e)+`${l} = ${a("")};
`;case"boolean":return r+y(e)+`${l} = ${a("")}.trim().toLowerCase() === "true";
`;default:return}}function bs(i,e,t){const n=rn(i,t);if(!n)return;const s=!!n.customPrompt,r=s?"":y(e)+'print("'+je(n.name+": ")+`")
`,a=`input("${je(s?n.customPrompt:n.name+": ")}")`;switch(n.type){case"int":return r+y(e)+`${n.name} = int(${a})
`;case"double":return r+y(e)+`${n.name} = float(${a})
`;case"String":return r+y(e)+`${n.name} = ${a}
`;case"boolean":return r+y(e)+`${n.name} = ${a}.strip().lower() in ("true", "wahr")
`;default:return}}function xs(i,e,t,n,s){const r=cs(i);if(r!==void 0)switch(e){case"java":return y(t)+"System.out.println("+r+`);
`;case"javascript":return y(t)+"console.log("+r+`);
`;case"python":return y(t)+"print("+Pe(r,n,s)+`)
`}}function T1(i){const e=i.map(ge).filter(t=>t!=="");return e.length===0?";;":e.join("; ")}function Is(i){const t=T1(i).split(";"),n=zs(t[0]);return n!==void 0&&(t[0]=n),t.join(";")}function zs(i){const e=B(/^(\s*)(?:integer|int|long|float|double|string|boolean|char|bool)\s+(\w+)(?:\s*=\s*(.*))?\s*$/i,i);if(!e)return;const t=e[2].trim();if(t==="")return;const n=(e[3]??"").trim();return i.includes("=")&&n!==""?e[1]+`let ${t} = ${n}`:e[1]+`let ${t}`}function ws(i){const e=i.map(n=>ge(n).trim()).filter(n=>n!=="");let t=e;if(e.length===1){let n=e[0];const s=C1("for",n);s!==void 0&&(n=s),t=n.split(";").map(r=>r.trim())}if(!(t.length!==3||t.some(n=>n==="")))return[t[0],t[1],t[2]]}function ys(i,e){let t=B(/^\s*(\w+)\s*(\+\+|--)\s*$/,i)??B(/^\s*(\+\+|--)\s*(\w+)\s*$/,i);if(t){const[n,s]=t[1]==="++"||t[1]==="--"?[t[2],t[1]]:[t[1],t[2]];return n===e?s==="++"?1:-1:void 0}if(t=B(/^\s*(\w+)\s*(\+|-)=\s*(\d+)\s*$/,i),t)return t[1]===e?(t[2]==="+"?1:-1)*Number(t[3]):void 0;if(t=B(/^\s*(\w+)\s*=\s*(\w+)\s*(\+|-)\s*(\d+)\s*$/,i),t)return t[1]===e&&t[2]===e?(t[3]==="+"?1:-1)*Number(t[4]):void 0}function Cn(i,e){if(/^-?\d+$/.test(i))return String(Number(i)+e);const t=/^[\w.()[\]]+$/.test(i)?i:`(${i})`;return e>0?`${t} + ${e}`:`${t} - ${-e}`}function vs(i,e){const t=ws(i);if(!t)return;const[n,s,r]=t,a=B(/^\s*(?:integer|int|long|short|byte|double|float)?\s*([a-zA-Z_]\w*)\s*=\s*(.+)$/i,n);if(!a)return;const l=a[1],o={variable:l,init:`${l} = ${R(a[2],e)}`,condition:s,increment:r},u=B(/^\s*(\w+)\s*(<=|<|>=|>)\s*(.+)$/,s),c=ys(r,l);if(!u||u[1]!==l||c===void 0||c===0)return o;const d=R(a[2],e);let m=R(u[3],e);const p=u[2];if(c>0&&p==="<=")m=Cn(m,1);else if(c<0&&p===">=")m=Cn(m,-1);else if(!(c>0&&p==="<")&&!(c<0&&p===">"))return o;const f=c===1?d==="0"?[m]:[d,m]:[d,m,String(c)];return o.rangeLine=`for ${l} in range(${f.join(", ")}):`,o}function E1(i){const e=ge(i).trim();if(e==="")return;const t=B(/^\s*const\s+(integer|int|long|float|double|string|boolean|char|bool)\s+(\w+)(?:\s*=\s*(.*))?$/i,e);if(!t)return;const n=t[2].trim();if(n==="")return;if(!e.includes("="))return{rawType:t[1].trim(),name:n};const s=(t[3]??"").trim();if(s!=="")return{rawType:t[1].trim(),name:n,rhs:s}}function Ss(i,e,t,n){var l;const s=E1(i);if(!s)return;const r=nt(s.rawType),a=(l=s.rhs)==null?void 0:l.trim();switch(e){case"java":return y(t)+tt(a?`final ${r} ${s.name} = ${a}`:`final ${r} ${s.name}`)+`
`;case"javascript":return a?y(t)+tt(`const ${s.name} = ${a}`)+`
`:y(t)+`let ${s.name};  // from diagram: const ${r} ${s.name}
`;case"python":return a?y(t)+`${s.name} = ${ot(a,n)}  # const ${r}
`:y(t)+`${s.name} = None  # const ${r}, uninitialized
`}}function ks(i){const e=ge(i).trim();if(e===""||F1(e))return;const t=B(/^\s*(?:integer|int|long|float|double|string|boolean|char|bool)(?:\s*\[\s*\]\s+(\w+)|\s+(\w+)(\s*\[\s*\])?)\s*=\s*(.*)$/i,e);if(!t)return;const n=t[1]===""?t[2]:t[1],s=t[4].trim();if(s!=="")return{name:n,rhs:s,isArray:t[1]!==""||t[3]!==""}}function lt(i){const e=B(/^\s*\(\s*int(?:eger)?\s*\)\s*\(?\s*(.+?)\s*\)?\s*$/i,i),t=e==null?void 0:e[1].trim();return t||void 0}function ot(i,e=new Set){const t=i.trim();if(t==="null")return"None";const n=lt(t);return n!==void 0?`int(${ot(n,e)})`:R(t,e)}function L1(i,e){let t="",n="",s=0;for(;s<i.length;){if(i[s]!=='"'){n+=i[s++];continue}t+=e(n),n="";let r=s+1;for(;r<i.length&&i[r]!=='"';)r+=i[r]==="\\"?2:1;t+=i.slice(s,r+1),s=r+1}return t+e(n)}function R(i,e){const t=i.replace(/\.equals\(\s*("(?:[^"\\]|\\.)*"|[^()"]*?)\s*\)/g," == $1"),n=s=>/^\d+$/.test(s)||e.has(s);return L1(t,s=>s.replace(/\bMath\.random\s*\(\s*\)/gi,"random.random()").replace(/===/g,"==").replace(/!==/g,"!=").replace(/\s*&&\s*/g," and ").replace(/\s*\|\|\s*/g," or ").replace(/!(?!=)\s*/g,"not ").replace(/\btrue\b/g,"True").replace(/\bfalse\b/g,"False").replace(/\bnull\b/g,"None").replace(new RegExp("(?<![\\w.])([a-zA-Z_]\\w*|\\d+)\\s*\\/\\s*([a-zA-Z_]\\w*|\\d+)(?![\\w.(\\[])","g"),(r,a,l)=>n(a)&&n(l)?`${a} // ${l}`:r))}function H1(i){const e=[];let t=0,n="",s=!1;for(let r=0;r<i.length;r++){const a=i[r];if(s){n+=a,a==="\\"&&r+1<i.length?n+=i[++r]:a==='"'&&(s=!1);continue}if(a==='"')s=!0;else if(a==="("||a==="[")t++;else if(a===")"||a==="]")t--;else if(a==="+"&&t===0){e.push(n.trim()),n="";continue}n+=a}return e.push(n.trim()),e}const an=i=>/^"(?:[^"\\]|\\.)*"$/.test(i);function Pe(i,e,t){const n=H1(i),s=r=>an(r)||t.has(r)||t.has(r.replace(/^([A-Za-z_]\w*)\[[^[\]]*\]$/u,"$1[]"));return n.length<2||!n.some(s)||n.some(r=>r==="")?R(i,e):n.map(r=>s(r)?r:`str(${R(r,e)})`).join(" + ")}function N1(i,e,t=new Set){const n=ge(i).trim(),s=B(/^(\w+(?:\[[^\]]*\])?)\s*(\+\+|--)$/,n)??B(/^(\+\+|--)\s*(\w+(?:\[[^\]]*\])?)$/,n);if(s){const[l,o]=s[1]==="++"||s[1]==="--"?[s[2],s[1]]:[s[1],s[2]];return`${R(l,e)} ${o==="++"?"+=":"-="} 1`}const r=B(/^(\w+)\s*\/=\s*(.+)$/,n);if(r&&e.has(r[1]))return`${r[1]} //= ${R(r[2],e)}`;const a=B(/^([\w[\]. ]+?)\s*(=|\+=|-=|\*=|\/=|%=)\s*(.+)$/,n);if(a&&!a[3].startsWith("=")){const[,l,o,u]=a;let c;if(o==="+="&&t.has(l.trim())){const d=H1(u);c=Pe(`"" + ${u}`,e,t).replace(/^"" \+ /,""),d.length===1&&!an(u.trim())&&!t.has(u.trim())&&(c=`str(${R(u,e)})`)}else o==="="&&lt(u)===void 0&&u.trim()!=="null"?c=Pe(u,e,t):c=o==="="?ot(u,e):R(u,e);return`${l} ${o} ${c}`}return R(n,e)}const _s=i=>i.replace(/\bMath\.random\b(?!\s*\()/gi,"Math.random()");function G1(i){const e=i.trim();return e.startsWith("{")&&e.endsWith("}")?"["+e.slice(1,-1)+"]":i}function V1(i){const e=B(/^\s*new\s+(?:byte|short|int|long|float|double|boolean|char|string)\s*\[\s*(.+)\s*\]\s*$/i,i),t=e==null?void 0:e[1].trim();return t||void 0}function F1(i){const e=B(/^\s*(int|double|string|boolean)\s*\[\s*\]\s*\[\s*\]\s*([a-zA-Z_]\w*)\s*=\s*(.+)$/i,ge(i).trim());return e?{elementType:e[1].toLowerCase(),name:e[2],rhs:e[3].trim()}:void 0}function Zs(i){const e=B(/^\s*new\s+(?:int|double|string|boolean)\s*\[\s*(.+?)\s*\]\s*\[\s*(.+?)\s*\]\s*$/i,i);return e?[e[1],e[2]]:void 0}const Tn=i=>i.replaceAll("{","[").replaceAll("}","]");function En(i,e){return i==="boolean"?e==="python"?"False":"false":i==="string"?'""':i==="double"?"0.0":"0"}function Ds(i,e,t){const n=Zs(i.rhs);return e==="javascript"?n?`Array.from({ length: ${n[0]} }, () => new Array(${n[1]}).fill(${En(i.elementType,e)}))`:Tn(i.rhs):n?`[[${En(i.elementType,e)}] * ${R(n[1],t)} for _ in range(${R(n[0],t)})]`:R(Tn(i.rhs),t)}function R1(i,e){const t=i.trim();if(e){const s=V1(t);return s!==void 0?`new Array(${s})`:G1(t)}const n=lt(t);return n!==void 0?`Math.floor(${R1(n,!1)})`:_s(t)}function Ms(i,e,t){const n=i.trim();if(e){const s=V1(n);return s!==void 0?`[None] * ${s}`:R(G1(n),t)}return ot(n,t)}function As(i,e,t,n,s){if(e==="java")return;const r=F1(i);if(r){const u=Ds(r,e,n);return e==="javascript"?y(t)+`let ${r.name} = ${u};
`:y(t)+`${r.name} = ${u}
`}const a=ks(i);if(!a)return;if(e==="javascript")return y(t)+tt(`let ${a.name} = ${R1(a.rhs,a.isArray)}`)+`
`;const o=!a.isArray&&lt(a.rhs)===void 0&&a.rhs.trim()!=="null"?Pe(a.rhs,n,s):Ms(a.rhs,a.isArray,n);return y(t)+`${a.name} = ${o}
`}function me(i,e){for(const t of i){e(t),t.loopBody&&me(t.loopBody,e);for(const n of t.cases??[])me(n.elements,e)}}function js(i){const e=n=>["int","integer","long","short","byte"].includes(n.trim().toLowerCase()),t=new Set;return me(i.elements,n=>{for(const s of n.textLines){const r=s.trim();if(r==="")continue;if(r.toLowerCase().startsWith("input:")){const o=sn(r.slice(6).trim());o&&e(o.type)&&!o.name.includes("[")&&t.add(o.name);continue}const a=E1(r);if(a&&e(a.rawType)){t.add(a.name);continue}const l=B(/^\s*(integer|int|long|short|byte)\s+([a-zA-Z_]\w*)\s*=/i,r);l&&t.add(l[2].trim())}}),t}function Vt(i,e){const t=a=>/^\d+$/.test(a)||e.has(a),n=String.raw`(?:[a-zA-Z_]\w*|\d+(?:\.\d+)?)`,s=new RegExp(String.raw`(?<![\w.*/%]\s*)${n}(?:\s*[*/%]\s*${n})+(?![\w.(\[])`,"g"),r=a=>{const l=a.split(/\s*([*/%])\s*/);if(!l.some(c=>c==="/"))return a;let o=l[0],u=t(l[0]);for(let c=1;c<l.length;c+=2){const d=l[c],m=l[c+1];d==="/"&&u&&t(m)?o=`Math.trunc(${o} / ${m})`:o=`${o} ${d} ${m}`,u=u&&t(m)}return o};return L1(i,a=>a.replace(s,r).replace(new RegExp("(?<![\\w.])([a-zA-Z_]\\w*)\\s*\\/=\\s*([a-zA-Z_]\\w*|\\d+)(?![\\w.(\\[])","g"),(l,o,u)=>t(o)&&t(u)?`${o} = Math.trunc(${o} / ${u})`:l))}function Ft(i){let e=!1;return me(i.elements,t=>{t.type===g.anweisung&&t.textLines.some(n=>n.trim().toLowerCase().startsWith("input:"))&&(e=!0)}),e}function Ps(i){let e=!1;return me(i.elements,t=>{t.textLines.some(n=>/\bMath\.random\s*\(/i.test(n))&&(e=!0)}),e}function bt(i,e){const t=i.trim();return t===""?e==="python"?'""':"0":e==="java"||new RegExp("^\\p{N}+$","u").test(t)||an(t)?t:'"'+t.replaceAll('"','\\"')+'"'}function xt(i,e){const t=i.trim();if(t==="")return"";switch(e){case"java":return"/* "+t+" */";case"python":return"  # "+t;case"javascript":return" /* "+t+" */"}}function Bs(i,e,t,n,s){const r=i.map(a=>a.trim());if(!r.every(a=>a==="")){if(t.includeDiagramTextAsComments){const a=r.filter(l=>l!==""&&!Gt(l));a.length>0&&(s.out+=nn(a,e,n))}for(const a of r){if(a==="")continue;if(Gt(a)){s.out+=W1(n,e);continue}const l=t.jsIntVariables??new Set,o=t.arrayElementTypes??new Map,u=t.stringVariables??new Set,c=(e==="java"?ps(a,n,o):void 0)??(e==="javascript"?fs(a,n,o):void 0)??(e==="python"?bs(a,n,o):void 0)??xs(a,e,n,l,u)??Ss(a,e,n,l)??As(a,e,n,l,u)??hs(a,e,n,l,u);if(c!==void 0){s.out+=e==="javascript"?Vt(c,l):c;continue}let d=a;os(e)?d=tt(e==="javascript"?Vt(a,l):a):e==="python"&&(d=N1(a,l,u)),d!==""&&(s.out+=y(n)+d+`
`)}}}function Rt(i,e,t,n,s,r,a){s.includeDiagramTextAsComments&&(a.out+=nn(t,n,r));const l=Ye(t),o=s.jsIntVariables??new Set,u=n==="python"?R(l,o):n==="javascript"?Vt(l,o):l;a.out+=y(r)+i+u+e}function ve(i,e,t,n,s){const r=s.out.length;for(const l of i)ut(l,e,t,n,s);if(e!=="python")return;s.out.slice(r).split(`
`).map(l=>l.trim()).every(l=>l===""||l.startsWith("#"))&&(s.out+=y(n)+`pass
`)}function Ws(i,e){var n;if(e.includeDiagramTextAsComments||i.length!==1)return;const t=i[0];return t.type===g.verzweigung&&(((n=t.cases)==null?void 0:n.length)??0)>=2?t:void 0}function Ut(i,e,t,n,s,r){const a=i.cases;if(!a||a.length<2)return;const l=e==="python",o=n+t.indentPerLevel,u=!t.includeEmptyElseBranch&&ls(a[1].elements),c=u?void 0:Ws(a[1].elements,t);if(l){Rt(r?"elif ":"if ",`:
`,i.textLines,e,t,n,s),ve(a[0].elements,e,t,o,s),c?Ut(c,e,t,n,s,!0):u||(s.out+=y(n)+`else:
`,ve(a[1].elements,e,t,o,s));return}Rt(r?"} else if (":"if (",`) {
`,i.textLines,e,t,n,s),ve(a[0].elements,e,t,o,s),c?Ut(c,e,t,n,s,!0):(u||(s.out+=y(n)+`} else {
`,ve(a[1].elements,e,t,o,s)),s.out+=y(n)+`}
`)}function ut(i,e,t,n,s){const r=t.indentPerLevel,a=e==="python",l=(c,d)=>ve(c,e,t,d,s),o=(c,d)=>Rt(c,d,i.textLines,e,t,n,s),u=(c=n)=>{t.includeDiagramTextAsComments&&(s.out+=nn(i.textLines,e,c))};switch(i.type){case g.leerElement:s.out+=W1(n,e);return;case g.anweisung:case g.aufruf:Bs(i.textLines,e,t,n,s);return;case g.aussprung:{const c=Ye(i.textLines);i.textLines.some(d=>d.trim()!=="")&&u(),a?s.out+=y(n)+(c===""?`break
`:`break  # ${c}
`):s.out+=y(n)+(c===""?`break;
`:`break; // ${c}
`);return}case g.verzweigung:Ut(i,e,t,n,s,!1);return;case g.fallauswahl:{const c=i.cases;if(!c||c.length===0)return;o(a?"match ":"switch (",a?`:
`:`) {
`),c.forEach((d,m)=>{const p=m===c.length-1;if(e==="java"){const f=p?"default -> { "+xt(d.name,e)+`
`:"case "+bt(d.name,e)+` -> {
`;s.out+=y(n+r)+f,l(d.elements,n+r*2),s.out+=y(n+r)+`}
`}else if(a){const f=p?"case _:"+xt(d.name,e):"case "+bt(d.name,e)+":";s.out+=y(n+r)+f+`
`,l(d.elements,n+r*2)}else{const f=p?"default:"+xt(d.name,e):"case "+bt(d.name,e)+":";s.out+=y(n+r)+f+`
`,l(d.elements,n+r*2),s.out+=y(n+r*2)+`break;
`}}),a||(s.out+=y(n)+`}
`);return}case g.forSchleife:if(e==="java")u(),s.out+=y(n)+"for ("+T1(i.textLines)+`) {
`;else if(a){const c=t.jsIntVariables??new Set,d=vs(i.textLines,c);if((d==null?void 0:d.rangeLine)!==void 0)u(),s.out+=y(n)+d.rangeLine+`
`;else if(d){u(),s.out+=y(n)+d.init+`
`,s.out+=y(n)+"while "+R(d.condition,c)+`:
`;for(const m of i.loopBody??[])ut(m,e,t,n+r,s);s.out+=y(n+r)+N1(d.increment,c)+`
`;return}else o("for ",`:
`)}else u(),s.out+=y(n)+"for ("+Is(i.textLines)+`) {
`;l(i.loopBody??[],n+r),a||(s.out+=y(n)+`}
`);return;case g.whileSchleife:o(a?"while ":"while (",a?`:
`:`) {
`),l(i.loopBody??[],n+r),a||(s.out+=y(n)+`}
`);return;case g.doUntilSchleife:{const c=Ye(i.textLines);if(a){s.out+=y(n)+`while True:
`;const d=n+r;l(i.loopBody??[],d),u(d),s.out+=y(d)+"if not ("+R(c,t.jsIntVariables??new Set)+`):
`,s.out+=y(d+r)+`break
`}else s.out+=y(n)+`do {
`,l(i.loopBody??[],n+r),u(),s.out+=y(n)+"} while ("+c+`);
`;return}case g.endlosschleife:{const c=Ye(i.textLines),d=c===""||c==="true";d||u(),a?s.out+=y(n)+(d?`while True:
`:`while True:  # ${c}
`):s.out+=y(n)+(d?`while (true) {
`:`while (true) /* ${c} */ {
`),l(i.loopBody??[],n+r),a||(s.out+=y(n)+`}
`);return}}}function Cs(i,e){switch(e){case"javascript":return i.replace(/\.length\(\)/g,".length").replace(/\.contains\(/g,".includes(");case"python":return Ts(i).replace(/\b([a-zA-Z_]\w*(?:\[[^[\]]*\])?)\.length(?:\(\)|\b)/g,"len($1)");case"java":return Ls(i)}}function Ts(i){for(let e=0;e<5;e++){const t=U1(i);if(t===i)break;i=t}return i}function U1(i){const e={indexOf:"find",toUpperCase:"upper",toLowerCase:"lower",trim:"strip",startsWith:"startswith",endsWith:"endswith"},t=/([A-Za-z_]\w*(?:\[[^[\]]*\]|\.\w+\(\))*|"(?:[^"\\]|\\.)*")\.(charAt|substring|contains|indexOf|toUpperCase|toLowerCase|trim|startsWith|endsWith)\(/g;let n="",s=0;for(let r=t.exec(i);r;r=t.exec(i)){const a=r.index+r[0].length-1;let l=0,o=-1;for(let m=a;m<i.length;m++)if(i[m]==="(")l+=1;else if(i[m]===")"&&--l===0){o=m;break}if(o<0)break;const u=r[1],c=U1(i.slice(a+1,o));let d;switch(r[2]){case"charAt":d=`${u}[${c}]`;break;case"substring":{let m=0;const p=[...c].findIndex(z=>z==="("?(m+=1,!1):z===")"?(m-=1,!1):z===","&&m===0),f=p<0?[c]:[c.slice(0,p),c.slice(p+1)];d=f.length===2?`${u}[${f[0].trim()}:${f[1].trim()}]`:`${u}[${c.trim()}:]`;break}case"contains":d=`(${c.trim()} in ${u})`;break;default:d=`${u}.${e[r[2]]}(${c})`}n+=i.slice(s,r.index)+d,s=o+1,t.lastIndex=o+1}return n+i.slice(s)}function Es(i){const e="(?:byte|short|int|long|float|double|boolean|char|String)",t=[new RegExp(`\\b(?:final\\s+)?${e}\\s*\\[\\s*\\](?:\\s*\\[\\s*\\])?\\s+([a-zA-Z_]\\w*)\\b`,"g"),new RegExp(`\\b(?:final\\s+)?${e}\\s+([a-zA-Z_]\\w*)\\s*\\[\\s*\\]`,"g")],n=new Set;for(const s of t)for(const r of i.matchAll(s))n.add(r[1].toLowerCase());return n}function Ls(i){const e=Es(i);return i.replace(/\b([a-zA-Z_]\w*)\.length(?!\()/g,(t,n)=>e.has(n.toLowerCase())?t:`${n}.length()`)}const Hs=new Set("abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null var record sealed permits yield module open opens requires exports to uses provides with transitive".split(" "));function $1(i){const e=i.trim();if(e==="")return"Main";let t="";return Array.from(e).forEach((n,s)=>{s===0?new RegExp("\\p{L}","u").test(n)||n==="_"||n==="$"?t+=n:new RegExp("\\p{Nd}","u").test(n)?t+="_"+n:t+="_":/[\p{L}\p{M}\p{N}]/u.test(n)||n==="_"||n==="$"?t+=n:t+="_"}),t=t.replace(/_{2,}/g,"_").replace(/^_+|_+$/g,""),t===""?"Main":(new RegExp("^\\p{Nd}","u").test(t)&&(t="_"+t),Hs.has(t.toLowerCase())&&(t="_"+t),t)}function Ln(i,e,t={},n=[]){const s={...j1,...t},r=$1(e),a=[i,...n].filter((v,M,D)=>D.indexOf(v)===M).map(v=>({d:v,header:he(v.caption)})).filter(v=>v.header!==void 0),l=a.map(v=>Nt(v.d,v.header,"java",t,s.indentPerLevel)),o=he(i.caption),u=a.some(v=>Ft(v.d)),c=P1(i,"java",s),d=s.indentPerLevel*2,m=Ft(i),p=m?Ns(c):c,f=y(d),z=p.trim()===""?"":p.split(`
`).map(v=>v.trim()===""?f:f+v).join(`
`);let b="";const w=l.length>0&&(m||u);(m||u)&&(b+=`import java.util.Scanner;

`),b+=`public class ${r} {
`,w&&(b+=y(s.indentPerLevel)+`static Scanner scanner = new Scanner(System.in);

`),o||(b+=y(s.indentPerLevel)+`public static void main(String[] args) {
`,m&&!w&&(b+=y(d)+`Scanner scanner = new Scanner(System.in);
`,z!==""&&(b+=`
`)),b+=z,z!==""&&!z.endsWith(`
`)&&(b+=`
`),b+=y(s.indentPerLevel)+`}
`);for(const[v,M]of l.entries())b+=(v>0||!o?`
`:"")+M;return b+=`}
`,b}function Ns(i){const e=i.split(`
`);let t=0;for(e[t]==="// import java.util.Scanner;"&&t++;t<e.length&&e[t].trim()==="";)t++;for(e[t]==="Scanner scanner = new Scanner(System.in);"&&t++;t<e.length&&e[t].trim()==="";)t++;return t>=e.length?"":e.slice(t).join(`
`)}const oe={target:"visustruct.codegen.target",javaMode:"visustruct.codegen.javaOutputMode",comments:"visustruct.codegen.includeDiagramComments",emptyElse:"visustruct.codegen.includeEmptyElse"};function Ge(i){try{return localStorage.getItem(i)}catch{return null}}function Ve(i,e){try{localStorage.setItem(i,e)}catch{}}const Gs=()=>h("web_run_stopped_loop"),X1=()=>h("web_run_cancelled"),G=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Vs(i){let e=0;return i.replace(/^(\s*)while\s*\(\s*true\s*\)(?:\s*\/\*.*?\*\/)?\s*\{/gm,(t,n)=>{const s=`__visuStructLoopGuard${e++}`;return`${n}for (let ${s} = 0; ${s} < 100000 || (() => { throw new Error(${JSON.stringify(Gs())}); })(); ${s}++) {`})}function Fs(i){return Vs(i).replace(/\bprompt\s*\(/g,"await __visuStructPrompt(")}const Rs=`
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
  answer = (value) => (value === null ? reject(new Error(${JSON.stringify(X1())})) : resolve(value))
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
`,It=2e3;class Us{constructor(e,t,n,s,r=()=>[]){I(this,"element");I(this,"target");I(this,"javaMode");I(this,"comments");I(this,"emptyElse");I(this,"code","");I(this,"codeView");I(this,"javaModeRow");I(this,"runButton");I(this,"saveButton");I(this,"copyButton");I(this,"runner");I(this,"runOutput");I(this,"runInput");I(this,"pseudocodeBox");I(this,"pseudocodeHint");I(this,"worker");I(this,"outputLines",[]);I(this,"droppedLines",0);I(this,"outputFrame");I(this,"pendingAnswer");this.currentDocument=e,this.saveFile=t,this.onClose=n,this.setPseudocode=s,this.subprograms=r;const a=Ge(oe.target);this.target=a==="python"||a==="javascript"?a:"java",this.javaMode=Ge(oe.javaMode)==="class"?"class":"snippet",this.comments=Ge(oe.comments)==="true",this.emptyElse=Ge(oe.emptyElse)!=="false",this.element=document.createElement("aside"),this.element.className="codepanel",this.build()}refresh(){const e=this.currentDocument(),t=this.options();this.code=this.target==="java"&&this.javaMode==="class"?Ln(e,this.classStem(),t,this.subprograms()):P1(e,this.target,t,this.subprograms()),this.codeView.textContent=this.code,this.javaModeRow.hidden=this.target!=="java",this.saveButton.hidden=this.target!=="java",this.runButton.hidden=this.target!=="javascript"||!!e.pseudocode,this.runButton.hidden&&this.stopRun(!0),this.pseudocodeBox.checked=!!e.pseudocode,this.pseudocodeHint.hidden=!e.pseudocode;for(const n of this.element.querySelectorAll("[data-target]"))n.setAttribute("aria-pressed",String(n.dataset.target===this.target));for(const n of this.element.querySelectorAll("[data-java-mode]"))n.setAttribute("aria-pressed",String(n.dataset.javaMode===this.javaMode))}close(){this.stopRun(!0)}options(){return{includeDiagramTextAsComments:this.comments,includeEmptyElseBranch:this.emptyElse,pseudocodeNote:h("codegen_pseudocode_note")}}classStem(){return et(this.currentDocument().caption)||"Main"}build(){this.element.innerHTML=`
      <div class="code-head">
        <h2>${G(h("codegen_placeholder_title"))}</h2>
        <button class="code-close" title="${G(h("menu_close"))}" aria-label="${G(h("menu_close"))}">✕</button>
      </div>
      <div class="segmented" role="group" aria-label="${G(h("web_codegen_language"))}">
        <button data-target="java">Java</button><button data-target="python">Python</button><button data-target="javascript">JavaScript</button>
      </div>
      <div class="segmented java-mode" role="group" aria-label="${G(h("codegen_java_output_mode"))}">
        <button data-java-mode="snippet">${G(h("codegen_java_output_snippet"))}</button><button data-java-mode="class">${G(h("codegen_java_output_class"))}</button>
      </div>
      <label class="check"><input type="checkbox" data-opt="comments" /> ${G(h("web_codegen_comments"))}</label>
      <label class="check"><input type="checkbox" data-opt="emptyElse" /> ${G(h("web_codegen_empty_else"))}</label>
      <label class="check"><input type="checkbox" data-opt="pseudocode" /> ${G(h("codegen_pseudocode_toggle"))}</label>
      <p class="hint pseudocode-hint" hidden>${G(h("codegen_pseudocode_hint"))}</p>
      <div class="code-actions">
        <button data-act="copy">${G(h("codegen_copy"))}</button>
        <button data-act="save">${G(h("codegen_save_java"))}</button>
        <button data-act="run" class="primary">${G(h("codegen_run_in_browser"))}</button>
      </div>
      <pre class="code-view" tabindex="0" dir="ltr"></pre>
      <div class="runner" hidden>
        <div class="runner-head"><h2>${G(h("simulation_output"))}</h2><button data-act="stop">${G(h("simulation_stop"))}</button></div>
        <pre class="runner-out" dir="ltr"></pre>
        <form class="runner-input" hidden>
          <label></label>
          <div class="sim-input-row"><input autocomplete="off" /><button type="submit">${G(h("simulation_input_submit"))}</button><button type="button" data-act="cancel">${G(h("close_unsaved_cancel"))}</button></div>
        </form>
      </div>
      <p class="hint">${G(h("codegen_generated_hint"))}</p>
    `;const e=s=>this.element.querySelector(s);this.codeView=e(".code-view"),this.javaModeRow=e(".java-mode"),this.runButton=e("[data-act=run]"),this.saveButton=e("[data-act=save]"),this.copyButton=e("[data-act=copy]"),this.runner=e(".runner"),this.runOutput=e(".runner-out"),this.runInput=e(".runner-input"),this.pseudocodeBox=e("[data-opt=pseudocode]"),this.pseudocodeHint=e(".pseudocode-hint"),this.pseudocodeBox.addEventListener("change",()=>this.setPseudocode(this.pseudocodeBox.checked)),e(".code-close").addEventListener("click",()=>this.onClose());for(const s of this.element.querySelectorAll("[data-target]"))s.addEventListener("click",()=>{this.target=s.dataset.target,Ve(oe.target,this.target),this.refresh()});for(const s of this.element.querySelectorAll("[data-java-mode]"))s.addEventListener("click",()=>{this.javaMode=s.dataset.javaMode,Ve(oe.javaMode,this.javaMode),this.refresh()});const t=e("[data-opt=comments]");t.checked=this.comments,t.addEventListener("change",()=>{this.comments=t.checked,Ve(oe.comments,String(this.comments)),this.refresh()});const n=e("[data-opt=emptyElse]");n.checked=this.emptyElse,n.addEventListener("change",()=>{this.emptyElse=n.checked,Ve(oe.emptyElse,String(this.emptyElse)),this.refresh()}),this.copyButton.addEventListener("click",()=>this.copy()),this.saveButton.addEventListener("click",()=>{const s=$1(this.classStem()),r=Ln(this.currentDocument(),this.classStem(),this.options());this.saveFile(`${s}.java`,r)}),this.runButton.addEventListener("click",()=>this.run()),e("[data-act=stop]").addEventListener("click",()=>this.stopRun(!1)),e("[data-act=cancel]").addEventListener("click",()=>this.answer(null)),this.runInput.addEventListener("submit",s=>{s.preventDefault(),this.answer(this.runInput.querySelector("input").value)})}async copy(){var t;let e=!1;try{await navigator.clipboard.writeText(this.code),e=!0}catch{const n=document.createRange();n.selectNodeContents(this.codeView);const s=getSelection();s==null||s.removeAllRanges(),s==null||s.addRange(n),e=((t=document.execCommand)==null?void 0:t.call(document,"copy"))??!1}this.copyButton.textContent=h(e?"web_copied_check":"web_copy_manual"),setTimeout(()=>this.copyButton.textContent=h("codegen_copy"),2e3)}run(){this.stopRun(!0),this.runner.hidden=!1,this.runOutput.textContent="",this.outputLines=[],this.droppedLines=0,this.runOutput.classList.remove("error");const e=Fs(this.code),t=n=>this.onRunnerMessage(n);try{const n=URL.createObjectURL(new Blob([Rs],{type:"text/javascript"})),s=new Worker(n);URL.revokeObjectURL(n),s.onmessage=r=>t(r.data),s.onerror=r=>{r.preventDefault(),t({type:"error",text:r.message||h("web_run_error")})},s.postMessage({type:"run",code:e}),this.worker=s}catch{this.runInPage(e,t)}this.setRunning(!0)}runInPage(e,t){const n={log:(...a)=>t({type:"log",lines:[a.map(l=>typeof l=="string"?l:JSON.stringify(l)).join(" ")]})},s=a=>new Promise((l,o)=>{this.pendingAnswer=u=>u===null?o(new Error(X1())):l(u),t({type:"prompt",text:a})}),r=(async()=>{}).constructor;new r("__visuStructPrompt","console",e)(s,n).then(()=>t({type:"done"})).catch(a=>t({type:"error",text:String(a)}))}onRunnerMessage(e){switch(e.type){case"log":this.appendOutput(e.lines??[]);break;case"prompt":{this.runInput.hidden=!1,this.runInput.querySelector("label").textContent=e.text??"";const t=this.runInput.querySelector("input");t.value="",t.focus();break}case"error":this.appendOutput([e.text??""]),this.runOutput.classList.add("error"),this.stopRun(!1);break;case"done":this.stopRun(!1);break}}appendOutput(e){this.outputLines.push(...e),this.outputLines.length>It&&(this.droppedLines+=this.outputLines.length-It,this.outputLines.splice(0,this.outputLines.length-It)),this.outputFrame===void 0&&(this.outputFrame=requestAnimationFrame(()=>{this.outputFrame=void 0;const t=this.droppedLines>0?h("web_run_dropped_fmt",this.droppedLines)+`
`:"";this.runOutput.textContent=t+this.outputLines.join(`
`)+(this.outputLines.length?`
`:""),this.runOutput.scrollTop=this.runOutput.scrollHeight}))}answer(e){var t;this.runInput.hidden=!0,this.worker?this.worker.postMessage({type:"answer",value:e}):(t=this.pendingAnswer)==null||t.call(this,e),this.pendingAnswer=void 0}stopRun(e){var t;(t=this.worker)==null||t.terminate(),this.worker=void 0,this.pendingAnswer=void 0,this.runInput&&(this.runInput.hidden=!0),e&&this.runner&&(this.runner.hidden=!0),this.setRunning(!1)}setRunning(e){const t=this.element.querySelector("[data-act=stop]");t&&(t.disabled=!e)}}const $s=1e5;function Xs(i,e,t){const n=new Ht(i,t),s=[...e];for(let r=0;r<$s;r++){const{state:a}=n;if(a.inputRequest){const l=s.shift();if(l===void 0)return{outputs:[...a.outputLines],missingInput:!0};if(n.provideInput(l),a.inputErrorNotice)return{outputs:[...a.outputLines],error:a.inputErrorNotice};continue}if(a.isHalted)return{outputs:[...a.outputLines],error:a.notice};if(!n.canStep)return{outputs:[...a.outputLines],unusedInputs:s.length||void 0};n.step()}return{outputs:[...n.state.outputLines],tooManySteps:!0}}function Ys(i,e){return i.length!==e.length?!1:i.every((t,n)=>Hn(t)===Hn(e[n]))}function Hn(i){const e=i.trim().replace(/\s+/g," ");return/^-?\d+\.0+$/.test(e)?e.replace(/\.0+$/,""):e}function Os(i,e,t){return e.map(n=>{const s=Xs(i,n.inputs,t),r=!s.error&&!s.missingInput&&!s.tooManySteps&&Ys(s.outputs,n.expected);return{test:n,result:s,passed:r}})}function Ks(i){const e=new Set,t=n=>{for(const s of n){e.add(s.type),s.loopBody&&t(s.loopBody);for(const r of s.cases??[])t(r.elements)}};return t(i.elements),e}const Js=`---
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
`,Qs=`---
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
`,qs=`---
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
`,er=`---
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
`,tr=`---
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
`,nr=`---
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
`,ir=`---
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
`,sr=`---
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
`,rr=`---
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
`,ar=`---
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
`,lr=`---
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
`,or=`---
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
`,ur=`---
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
`,cr=`---
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
`,dr=`---
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
`,hr=`---
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
`,mr=`---
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
`,gr=`---
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
`,pr=`---
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
`,fr=`---
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
`,br=`---
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
`,xr=`Fachbegriffe für den Lernbereich. Kommt ein Begriff in einem Schritt vor, wird er dort einmal markiert und zeigt beim
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
`,Ir=`### Anweisung

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
`,zr=`---
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
`,wr=`---
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
`,yr=`---
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
`,vr=`---
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
`,Sr=`---
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
`,kr=`---
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
`,_r=`---
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
`,Zr=`---
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
`,Dr=`---
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
`,Mr=`---
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
`,Ar=`---
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
`,jr=`---
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
`,Pr='---\ntitel: Taschenrechner\nnach: 10\nstufe: 2\n---\n\nEin kleiner Taschenrechner: zwei Zahlen und ein Rechenzeichen eingeben, das Ergebnis erscheint.\n\n::: übung aufgabe-rechner\ntitel: Taschenrechner\nauftrag: Frage nach zwei ganzen Zahlen und danach nach einem Rechenzeichen als Text: `+`, `-` oder `*`. Gib das Ergebnis aus. Bei einem anderen Zeichen gib **Unbekanntes Rechenzeichen** aus.\ntest: 3, 4, + -> 7\ntest: 10, 4, - -> 6\ntest: 6, 7, * -> 42\ntest: 1, 2, x -> Unbekanntes Rechenzeichen\nbraucht: fallauswahl\ntipp: Lies alle drei Werte ein. Eine Fallauswahl über das Rechenzeichen entscheidet dann, was gerechnet wird.\ntipp: Das Rechenzeichen liest du mit `input: String zeichen "Rechenzeichen"` ein. Die Fallauswahl prüft `zeichen`, die Fälle heißen `"+"`, `"-"` und `"*"`, der letzte Fall ist `default`. Rechne in jedem Fall erst in einer Variablen und gib sie dann aus, sonst hängt `+` die Zahlen nur aneinander.\nlösung: aufgabe-rechner-loesung.visustruct\n:::\n',Br=`---
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
`,Wr=`---
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
`,Cr=`---
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
`,Tr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Er=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Lr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Hr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Nr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Gr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Vr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Fr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Rr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ur=`<?xml version="1.0" encoding="UTF-8"?>
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
`,$r=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Xr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Yr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Or=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Kr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Jr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Qr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,qr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ea=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ta=`<?xml version="1.0" encoding="UTF-8"?>
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
`,na=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ia=`<?xml version="1.0" encoding="UTF-8"?>
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
`,sa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ra=`<?xml version="1.0" encoding="UTF-8"?>
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
`,aa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,la=`<?xml version="1.0" encoding="UTF-8"?>
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
`,oa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ua=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ca=`<?xml version="1.0" encoding="UTF-8"?>
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
`,da=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ha=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ma=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ga=`<?xml version="1.0" encoding="UTF-8"?>
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
`,pa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,fa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ba=`<?xml version="1.0" encoding="UTF-8"?>
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
`,xa=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;101;107;117;110;100;101;110;32;117;109;114;101;99;104;110;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;101;107;117;110;100;101;110;32;61;32;50;48;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;109;105;110;117;116;101;110;32;43;32;34;32;77;105;110;117;116;101;110;32;117;110;100;32;34;32;43;32;114;101;115;116;32;43;32;34;32;83;101;107;117;110;100;101;110;34;</text>
  </strelem>
</struktogramm>
`,Ia=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;101;103;114;252;223;117;110;103;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;110;97;109;101;32;34;87;105;101;32;104;101;105;223;116;32;100;117;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;97;108;108;111;32;34;32;43;32;110;97;109;101;32;43;32;34;33;34;</text>
  </strelem>
</struktogramm>
`,za=`<?xml version="1.0" encoding="UTF-8"?>
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
`,wa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ya=`<?xml version="1.0" encoding="UTF-8"?>
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
`,va=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Sa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ka=`<?xml version="1.0" encoding="UTF-8"?>
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
`,_a=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Za=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Da=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ma=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Aa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ja=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Pa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ba=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Wa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ca=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ta=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ea=`<?xml version="1.0" encoding="UTF-8"?>
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
`,La=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ha=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Na=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ga=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Va=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Fa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ra=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ua=`<?xml version="1.0" encoding="UTF-8"?>
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
`,$a=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Xa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ya=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Oa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ka=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ja=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Qa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,qa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,el=`<?xml version="1.0" encoding="UTF-8"?>
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
`,tl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,nl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,il=`<?xml version="1.0" encoding="UTF-8"?>
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
`,sl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,rl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,al=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ll=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ol=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ul=`<?xml version="1.0" encoding="UTF-8"?>
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
`,cl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,dl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,hl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ml=`<?xml version="1.0" encoding="UTF-8"?>
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
`,gl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,pl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="105;110;116;32;102;108;97;101;99;104;101;40;105;110;116;32;97;44;32;105;110;116;32;98;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>114;101;116;117;114;110;32;97;32;42;32;98;</text>
  </strelem>
</struktogramm>
`,fl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,bl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,xl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="105;110;116;32;113;117;97;100;114;97;116;40;105;110;116;32;120;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;101;114;103;101;98;110;105;115;32;61;32;120;32;42;32;120;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>114;101;116;117;114;110;32;101;114;103;101;98;110;105;115;</text>
  </strelem>
</struktogramm>
`,Il=`<?xml version="1.0" encoding="UTF-8"?>
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
`,zl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="122;101;105;103;101;66;101;103;114;117;101;115;115;117;110;103;40;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;87;105;108;108;107;111;109;109;101;110;32;122;117;109;32;81;117;105;122;33;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;68;117;32;98;101;107;111;109;109;115;116;32;100;114;101;105;32;70;114;97;103;101;110;46;34;</text>
  </strelem>
</struktogramm>
`,wl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,yl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="118;111;105;100;32;122;101;105;103;101;83;117;109;109;101;40;105;110;116;32;97;44;32;105;110;116;32;98;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;109;101;32;61;32;97;32;43;32;98;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;97;32;43;32;34;32;43;32;34;32;43;32;98;32;43;32;34;32;61;32;34;32;43;32;115;117;109;109;101;</text>
  </strelem>
</struktogramm>
`,vl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Sl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,kl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,_l=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Zl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Dl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ml=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Al=`<?xml version="1.0" encoding="UTF-8"?>
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
`,jl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Pl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Bl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Wl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;101;103;114;252;223;117;110;103;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;71;117;116;101;110;32;77;111;114;103;101;110;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;101;117;116;101;32;108;101;114;110;101;110;32;119;105;114;32;83;116;114;117;107;116;111;103;114;97;109;109;101;46;34;</text>
  </strelem>
</struktogramm>
`,Cl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="72;97;108;108;111;32;87;101;108;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;97;108;108;111;32;87;101;108;116;34;</text>
  </strelem>
</struktogramm>
`,Tl=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="90;119;101;105;32;90;101;105;108;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;97;108;108;111;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;73;99;104;32;108;101;114;110;101;32;83;116;114;117;107;116;111;103;114;97;109;109;101;34;</text>
  </strelem>
</struktogramm>
`,El=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ll=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Hl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Nl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Gl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Vl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Fl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Rl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ul=`<?xml version="1.0" encoding="UTF-8"?>
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
`,$l=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Xl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Yl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ol=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Kl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Jl=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ql=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ql=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="118;111;105;100;32;118;101;114;100;111;112;112;108;101;40;105;110;116;32;120;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>120;32;61;32;120;32;42;32;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;73;109;32;85;110;116;101;114;112;114;111;103;114;97;109;109;58;32;120;32;61;32;34;32;43;32;120;</text>
  </strelem>
</struktogramm>
`,e0=`<?xml version="1.0" encoding="UTF-8"?>
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
`,t0=`<?xml version="1.0" encoding="UTF-8"?>
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
`,n0=`<?xml version="1.0" encoding="UTF-8"?>
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
`,i0=`<?xml version="1.0" encoding="UTF-8"?>
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
`,s0=`<?xml version="1.0" encoding="UTF-8"?>
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
`,r0=`<?xml version="1.0" encoding="UTF-8"?>
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
`,a0=""+new URL("aufgabe-mehrwertsteuer-C-TFTrWz.svg",import.meta.url).href,l0=""+new URL("ben-shneiderman-Cev5hrqS.jpg",import.meta.url).href,o0=""+new URL("ike-nassi-D2w47gvX.jpg",import.meta.url).href,u0=""+new URL("kino-saal-CYMOok4_.svg",import.meta.url).href,c0=""+new URL("kino-schleifen-DrTQV7dq.svg",import.meta.url).href,d0="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDkyIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDkyIiBmaWxsPSIjZmZmZmZmIi8+CiAgPGcgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiPgogICAgPCEtLSBTdGFydCAtLT4KICAgIDxyZWN0IHg9IjEwMCIgeT0iMTAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMjgiIHJ4PSIxNCIgZmlsbD0iI2QxZjJkOSIvPgogICAgPGxpbmUgeDE9IjE1MCIgeTE9IjM4IiB4Mj0iMTUwIiB5Mj0iNTQiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICAgIDwhLS0gQW53ZWlzdW5nIC0tPgogICAgPHJlY3QgeD0iNTAiIHk9IjU2IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZTVmMGZmIi8+CiAgICA8bGluZSB4MT0iMTUwIiB5MT0iODYiIHgyPSIxNTAiIHkyPSI5OCIgbWFya2VyLWVuZD0idXJsKCNhKSIvPgogICAgPCEtLSBSYXV0ZSAxIC0tPgogICAgPHBhdGggZD0iTTE1MCAxMDAgTDIzNSAxMjggTDE1MCAxNTYgTDY1IDEyOCBaIiBmaWxsPSIjZmZmNGQ2Ii8+CiAgICA8bGluZSB4MT0iMTUwIiB5MT0iMTU2IiB4Mj0iMTUwIiB5Mj0iMTcyIiBtYXJrZXItZW5kPSJ1cmwoI2EpIi8+CiAgICA8cmVjdCB4PSI1MCIgeT0iMTc0IiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZTVmMGZmIi8+CiAgICA8bGluZSB4MT0iMTUwIiB5MT0iMjA0IiB4Mj0iMTUwIiB5Mj0iMjUwIiBtYXJrZXItZW5kPSJ1cmwoI2EpIi8+CiAgICA8IS0tIG5laW4tV2VnIHVtIGRlbiBLYXN0ZW4gaGVydW0gLS0+CiAgICA8cG9seWxpbmUgcG9pbnRzPSIyMzUsMTI4IDI4NSwxMjggMjg1LDIyMiAxNTAsMjIyIiBmaWxsPSJub25lIiBtYXJrZXItZW5kPSJ1cmwoI2EpIi8+CiAgICA8IS0tIFJhdXRlIDIgLS0+CiAgICA8cGF0aCBkPSJNMTUwIDI1MiBMMjM1IDI4MCBMMTUwIDMwOCBMNjUgMjgwIFoiIGZpbGw9IiNmZmY0ZDYiLz4KICAgIDxsaW5lIHgxPSIyMzUiIHkxPSIyODAiIHgyPSIyNjgiIHkyPSIyODAiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICAgIDxyZWN0IHg9IjI3MCIgeT0iMjY1IiB3aWR0aD0iMTE1IiBoZWlnaHQ9IjMwIiBmaWxsPSIjZTVmMGZmIi8+CiAgICA8IS0tIHp1csO8Y2sgenVyIFByw7xmdW5nIC0tPgogICAgPHBvbHlsaW5lIHBvaW50cz0iMzI3LDI2NSAzMjcsMjM4IDE1MCwyMzgiIGZpbGw9Im5vbmUiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICAgIDxsaW5lIHgxPSIxNTAiIHkxPSIzMDgiIHgyPSIxNTAiIHkyPSIzMjYiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICAgIDxyZWN0IHg9IjUwIiB5PSIzMjgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMzAiIGZpbGw9IiNlNWYwZmYiLz4KICAgIDxsaW5lIHgxPSIxNTAiIHkxPSIzNTgiIHgyPSIxNTAiIHkyPSIzNzQiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICAgIDwhLS0gRW5kZSAtLT4KICAgIDxyZWN0IHg9IjEwMCIgeT0iMzc2IiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjI4IiByeD0iMTQiIGZpbGw9IiNkMWYyZDkiLz4KICA8L2c+CiAgPGcgdGV4dC1hbmNob3I9Im1pZGRsZSI+CiAgICA8dGV4dCB4PSIxNTAiIHk9IjI5Ij5TdGFydDwvdGV4dD4KICAgIDx0ZXh0IHg9IjE1MCIgeT0iNzYiPlRhc3NlIGF1ZiBkZW4gVGlzY2ggc3RlbGxlbjwvdGV4dD4KICAgIDx0ZXh0IHg9IjE1MCIgeT0iMTMzIj5adWNrZXIgZ2V3w7xuc2NodD88L3RleHQ+CiAgICA8dGV4dCB4PSIxNTAiIHk9IjE5NCI+WnVja2VyIGhpbmVpbmdlYmVuPC90ZXh0PgogICAgPHRleHQgeD0iMTUwIiB5PSIyODUiPlRlZSBub2NoIHp1IGhlacOfPzwvdGV4dD4KICAgIDx0ZXh0IHg9IjMyNy41IiB5PSIyODUiPjEgTWludXRlIHdhcnRlbjwvdGV4dD4KICAgIDx0ZXh0IHg9IjE1MCIgeT0iMzQ4Ij5UZWUgdHJpbmtlbjwvdGV4dD4KICAgIDx0ZXh0IHg9IjE1MCIgeT0iMzk1Ij5FbmRlPC90ZXh0PgogIDwvZz4KICA8ZyBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iNjAwIj4KICAgIDx0ZXh0IHg9IjE1NiIgeT0iMTY4IiBmaWxsPSIjMjQ4YTNkIj5qYTwvdGV4dD4KICAgIDx0ZXh0IHg9IjI0MiIgeT0iMTIyIiBmaWxsPSIjZDcwMDE1Ij5uZWluPC90ZXh0PgogICAgPHRleHQgeD0iMjQwIiB5PSIyNzQiIGZpbGw9IiMyNDhhM2QiPmphPC90ZXh0PgogICAgPHRleHQgeD0iMTU2IiB5PSIzMjAiIGZpbGw9IiNkNzAwMTUiPm5laW48L3RleHQ+CiAgPC9nPgogIDwhLS0gTGVnZW5kZSAtLT4KICA8bGluZSB4MT0iMTAiIHkxPSI0MTgiIHgyPSIzOTAiIHkyPSI0MTgiIHN0cm9rZT0iI2QxZDFkNiIvPgogIDxnIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIxLjUiPgogICAgPHJlY3QgeD0iNDAiIHk9IjQzMCIgd2lkdGg9IjM2IiBoZWlnaHQ9IjE4IiByeD0iOSIgZmlsbD0iI2QxZjJkOSIvPgogICAgPHJlY3QgeD0iMjIwIiB5PSI0MzAiIHdpZHRoPSIzNiIgaGVpZ2h0PSIxOCIgZmlsbD0iI2U1ZjBmZiIvPgogICAgPHBhdGggZD0iTTU4IDQ1OCBMNzYgNDY5IEw1OCA0ODAgTDQwIDQ2OSBaIiBmaWxsPSIjZmZmNGQ2Ii8+CiAgICA8cGF0aCBkPSJNMjI2IDQ2MCBMMjU2IDQ2MCBMMjUwIDQ3OCBMMjIwIDQ3OCBaIiBmaWxsPSIjZjJlNmZmIi8+CiAgPC9nPgogIDxnIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzYTNhM2MiPgogICAgPHRleHQgeD0iODYiIHk9IjQ0MyI+U3RhcnQgb2RlciBFbmRlPC90ZXh0PgogICAgPHRleHQgeD0iMjY2IiB5PSI0NDMiPkFud2Vpc3VuZzwvdGV4dD4KICAgIDx0ZXh0IHg9Ijg2IiB5PSI0NzMiPlZlcnp3ZWlndW5nPC90ZXh0PgogICAgPHRleHQgeD0iMjY2IiB5PSI0NzMiPkVpbi0gb2RlciBBdXNnYWJlPC90ZXh0PgogIDwvZz4KPC9zdmc+Cg==",h0="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMTkwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE5MCIgZmlsbD0iI2ZmZmZmZiIvPgogIDx0ZXh0IHg9IjIwIiB5PSIyNCIgZm9udC13ZWlnaHQ9IjYwMCI+V29oaW4gbGFuZGV0IGRhcyBFbGVtZW50PzwvdGV4dD4KICA8cmVjdCB4PSIyMCIgeT0iNDAiIHdpZHRoPSIxOTAiIGhlaWdodD0iMzUiIGZpbGw9IiNkYmVhZmUiLz4KICA8cmVjdCB4PSIyMCIgeT0iNzUiIHdpZHRoPSIxOTAiIGhlaWdodD0iMzUiIGZpbGw9IiNkY2ZjZTciLz4KICA8bGluZSB4MT0iMjAiIHkxPSI3NSIgeDI9IjIxMCIgeTI9Ijc1IiBzdHJva2U9IiM2ZTZlNzMiIHN0cm9rZS1kYXNoYXJyYXk9IjQgMyIvPgogIDxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjE5MCIgaGVpZ2h0PSI3MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIxMTUiIHk9IjYyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMWQ0ZWQ4Ij5vYmVyZSBIw6RsZnRlPC90ZXh0PgogIDx0ZXh0IHg9IjExNSIgeT0iOTciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxNTgwM2QiPnVudGVyZSBIw6RsZnRlPC90ZXh0PgogIDx0ZXh0IHg9IjIyNCIgeT0iNjIiPuKGkiBrb21tdCA8dHNwYW4gZm9udC13ZWlnaHQ9IjYwMCI+ZGF2b3I8L3RzcGFuPjwvdGV4dD4KICA8dGV4dCB4PSIyMjQiIHk9Ijk3Ij7ihpIga29tbXQgPHRzcGFuIGZvbnQtd2VpZ2h0PSI2MDAiPmRhaGludGVyPC90c3Bhbj48L3RleHQ+CiAgPHJlY3QgeD0iMjAiIHk9IjEzMiIgd2lkdGg9IjE5MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2ZlZjNjNyIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIxMTUiIHk9IjE1NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiI+w7g8L3RleHQ+CiAgPHRleHQgeD0iMjI0IiB5PSIxNTciPuKGkiA8dHNwYW4gZm9udC13ZWlnaHQ9IjYwMCI+ZXJzZXR6dDwvdHNwYW4+IGRlbiBQbGF0emhhbHRlcjwvdGV4dD4KPC9zdmc+Cg==",m0="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjEwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIxMCIgZmlsbD0iI2ZmZmZmZiIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJ1aS1tb25vc3BhY2UsIE1lbmxvLCBDb25zb2xhcywgbW9ub3NwYWNlIiBmb250LXNpemU9IjE2Ij5pbnQgYWx0ZXIgPSAxNDwvdGV4dD4KICA8cGF0aCBkPSJNMTMwIDcwIEwxNzAgNTAgTDMwMCA1MCBMMjYwIDcwIFoiIGZpbGw9IiNjOThhM2MiIHN0cm9rZT0iIzhhNWExZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHJlY3QgeD0iMTgwIiB5PSIzNCIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjUwIiByeD0iMyIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjNmU2ZTczIiBzdHJva2Utd2lkdGg9IjEuNSIvPgogIDx0ZXh0IHg9IjIwMiIgeT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiPjE0PC90ZXh0PgogIDxyZWN0IHg9IjEzMCIgeT0iNzAiIHdpZHRoPSIxMzAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZTliODcyIiBzdHJva2U9IiM4YTVhMWYiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxwYXRoIGQ9Ik0yNjAgNzAgTDMwMCA1MCBMMzAwIDE1MCBMMjYwIDE3MCBaIiBmaWxsPSIjZDQ5YTRjIiBzdHJva2U9IiM4YTVhMWYiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxyZWN0IHg9IjE1MCIgeT0iMTAwIiB3aWR0aD0iOTAiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiM4YTVhMWYiLz4KICA8dGV4dCB4PSIxOTUiIHk9IjEyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+YWx0ZXI8L3RleHQ+CiAgPHJlY3QgeD0iMTM4IiB5PSIxNDIiIHdpZHRoPSIzNCIgaGVpZ2h0PSIyMCIgcng9IjEwIiBmaWxsPSIjMDA3YWZmIi8+CiAgPHRleHQgeD0iMTU1IiB5PSIxNTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmZmZmYiIGZvbnQtd2VpZ2h0PSI2MDAiPmludDwvdGV4dD4KICA8ZyBzdHJva2U9IiM2ZTZlNzMiPgogICAgPGxpbmUgeDE9IjMxMCIgeTE9IjQ4IiB4Mj0iMjI2IiB5Mj0iNTIiLz4KICAgIDxsaW5lIHgxPSIzMTAiIHkxPSIxMTUiIHgyPSIyNDIiIHkyPSIxMTUiLz4KICAgIDxsaW5lIHgxPSI4MCIgeTE9IjE1MiIgeDI9IjEzNCIgeTI9IjE1MiIvPgogIDwvZz4KICA8dGV4dCB4PSIzMTYiIHk9IjUyIj5XZXJ0PC90ZXh0PgogIDx0ZXh0IHg9IjMxNiIgeT0iMTE5Ij5OYW1lPC90ZXh0PgogIDx0ZXh0IHg9IjgiIHk9IjE1NiI+RGF0ZW50eXA8L3RleHQ+CiAgPHRleHQgeD0iMjAwIiB5PSIxOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2ZTZlNzMiPsOcYmVyIGRlbiBOYW1lbiBrb21tc3QgZHUgYW4gZGVuIFdlcnQuPC90ZXh0Pgo8L3N2Zz4K",g0="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjAwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMDA3YWZmIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPGcgZm9udC1mYW1pbHk9InVpLW1vbm9zcGFjZSwgTWVubG8sIENvbnNvbGFzLCBtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjAiPgogICAgPHRleHQgeD0iNjAiIHk9IjExMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjcwMCI+cHVua3RlPC90ZXh0PgogICAgPHRleHQgeD0iMTI1IiB5PSIxMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMDdhZmYiIGZvbnQtd2VpZ2h0PSI3MDAiPj08L3RleHQ+CiAgICA8dGV4dCB4PSIyNjAiIHk9IjExMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+cHVua3RlICsgNTwvdGV4dD4KICA8L2c+CiAgPHJlY3QgeD0iMTgwIiB5PSI4NiIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzNCIgcng9IjYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzE1ODAzZCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMjYwIiB5PSIxNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxNTgwM2QiPuKRoCByZWNodHMgYXVzcmVjaG5lbjogMTAgKyA1ID0gMTU8L3RleHQ+CiAgPHBhdGggZD0iTTI1MCA4MiBDMjMwIDMwLCA5MCAzMCwgNjQgODQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwN2FmZiIgc3Ryb2tlLXdpZHRoPSIyLjUiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICA8dGV4dCB4PSIxNjAiIHk9IjM2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDA3YWZmIj7ikaEgRXJnZWJuaXMgbGlua3Mgc3BlaWNoZXJuPC90ZXh0PgogIDxyZWN0IHg9IjIwIiB5PSIxNjQiIHdpZHRoPSIzNjAiIGhlaWdodD0iMjYiIHJ4PSI2IiBmaWxsPSIjZjJmMmY3Ii8+CiAgPHRleHQgeD0iMjAwIiB5PSIxODIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPnB1bmt0ZSB2b3JoZXI6IDx0c3BhbiBmb250LXdlaWdodD0iNzAwIj4xMDwvdHNwYW4+ICAg4oaSICAgcHVua3RlIG5hY2hoZXI6IDx0c3BhbiBmb250LXdlaWdodD0iNzAwIj4xNTwvdHNwYW4+PC90ZXh0Pgo8L3N2Zz4K",p0="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjYwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjYwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPGcgc3Ryb2tlPSIjNmU2ZTczIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiPgogICAgPHBhdGggZD0iTTQwIDExMCBMNDggMTgwIEwxMDIgMTgwIEwxMTAgMTEwIi8+CiAgICA8cGF0aCBkPSJNMTY1IDExMCBMMTczIDE4MCBMMjI3IDE4MCBMMjM1IDExMCIvPgogICAgPHBhdGggZD0iTTI5MCAxMTAgTDI5OCAxODAgTDM1MiAxODAgTDM2MCAxMTAiLz4KICA8L2c+CiAgPHBhdGggZD0iTTQ0IDEzNSBMNDggMTgwIEwxMDIgMTgwIEwxMDYgMTM1IFoiIGZpbGw9IiNmZGJhNzQiLz4KICA8cGF0aCBkPSJNMjk0IDEzNSBMMjk4IDE4MCBMMzUyIDE4MCBMMzU2IDEzNSBaIiBmaWxsPSIjOTNjNWZkIi8+CiAgPHRleHQgeD0iNzUiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+bGlua3M8L3RleHQ+CiAgPHRleHQgeD0iNzUiIHk9IjIxNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+U2FmdDwvdGV4dD4KICA8dGV4dCB4PSIyMDAiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+aGlsZjwvdGV4dD4KICA8dGV4dCB4PSIyMDAiIHk9IjIxNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+bGVlcjwvdGV4dD4KICA8dGV4dCB4PSIzMjUiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+cmVjaHRzPC90ZXh0PgogIDx0ZXh0IHg9IjMyNSIgeT0iMjE3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5XYXNzZXI8L3RleHQ+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjEuOCIgbWFya2VyLWVuZD0idXJsKCNhKSI+CiAgICA8cGF0aCBkPSJNODggMTA0IEMxMTAgNzAsIDE2MCA3MCwgMTg2IDEwNCIvPgogICAgPHBhdGggZD0iTTMxOCAxMDQgQzI3MCAxNSwgMTMwIDE1LCA4MiAxMDQiLz4KICAgIDxwYXRoIGQ9Ik0yMTQgMTA0IEMyNDAgNzAsIDI5MCA3MCwgMzEyIDEwNCIvPgogIDwvZz4KICA8ZyBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIDxjaXJjbGUgY3g9IjEzNyIgY3k9IjgwIiByPSIxMSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMWMxYzFlIi8+PHRleHQgeD0iMTM3IiB5PSI4NSI+MTwvdGV4dD4KICAgIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjM4IiByPSIxMSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMWMxYzFlIi8+PHRleHQgeD0iMjAwIiB5PSI0MyI+MjwvdGV4dD4KICAgIDxjaXJjbGUgY3g9IjI2MyIgY3k9IjgwIiByPSIxMSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMWMxYzFlIi8+PHRleHQgeD0iMjYzIiB5PSI4NSI+MzwvdGV4dD4KICA8L2c+CiAgPGcgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InVpLW1vbm9zcGFjZSwgTWVubG8sIENvbnNvbGFzLCBtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTIiPgogICAgPHRleHQgeD0iNzAiIHk9IjI0NyI+MTogaGlsZiA9IGxpbmtzPC90ZXh0PgogICAgPHRleHQgeD0iMjAwIiB5PSIyNDciPjI6IGxpbmtzID0gcmVjaHRzPC90ZXh0PgogICAgPHRleHQgeD0iMzMwIiB5PSIyNDciPjM6IHJlY2h0cyA9IGhpbGY8L3RleHQ+CiAgPC9nPgo8L3N2Zz4K",f0="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMTUwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2ZmZmZmZiIvPgogIDxyZWN0IHg9IjIwIiB5PSI1MCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjZmVlMmUyIi8+PHJlY3QgeD0iMzEwIiB5PSI1MCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjZmVlMmUyIi8+CiAgPHJlY3QgeD0iOTAiIHk9IjUwIiB3aWR0aD0iMjIwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjZGNmY2U3Ii8+CiAgPGxpbmUgeDE9IjIwIiB5MT0iNzQiIHgyPSIzODAiIHkyPSI3NCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8bGluZSB4MT0iNDYiIHkxPSI2OCIgeDI9IjQ2IiB5Mj0iODAiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNDYiIHk9Ijk4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4wPC90ZXh0PgogIDxsaW5lIHgxPSI5MCIgeTE9IjY4IiB4Mj0iOTAiIHkyPSI4MCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI5MCIgeT0iOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjE8L3RleHQ+CiAgPGxpbmUgeDE9IjEzNCIgeTE9IjY4IiB4Mj0iMTM0IiB5Mj0iODAiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMTM0IiB5PSI5OCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MjwvdGV4dD4KICA8bGluZSB4MT0iMTc4IiB5MT0iNjgiIHgyPSIxNzgiIHkyPSI4MCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxNzgiIHk9Ijk4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4zPC90ZXh0PgogIDxsaW5lIHgxPSIyMjIiIHkxPSI2OCIgeDI9IjIyMiIgeTI9IjgwIiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjIyMiIgeT0iOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjQ8L3RleHQ+CiAgPGxpbmUgeDE9IjI2NiIgeTE9IjY4IiB4Mj0iMjY2IiB5Mj0iODAiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMjY2IiB5PSI5OCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+NTwvdGV4dD4KICA8bGluZSB4MT0iMzEwIiB5MT0iNjgiIHgyPSIzMTAiIHkyPSI4MCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIzMTAiIHk9Ijk4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj42PC90ZXh0PgogIDxsaW5lIHgxPSIzNTQiIHkxPSI2OCIgeDI9IjM1NCIgeTI9IjgwIiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjM1NCIgeT0iOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjc8L3RleHQ+CiAgPGNpcmNsZSBjeD0iOTAiIGN5PSI3NCIgcj0iNiIgZmlsbD0iIzE1ODAzZCIvPjxjaXJjbGUgY3g9IjMxMCIgY3k9Ijc0IiByPSI2IiBmaWxsPSIjMTU4MDNkIi8+CiAgPHRleHQgeD0iMjAwIiB5PSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzE1ODAzZCIgZm9udC13ZWlnaHQ9IjYwMCI+Z8O8bHRpZzwvdGV4dD4KICA8dGV4dCB4PSI0MCIgeT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNiOTFjMWMiIGZvbnQtd2VpZ2h0PSI2MDAiPnVuZ8O8bHRpZzwvdGV4dD48dGV4dCB4PSIzNjAiIHk9IjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYjkxYzFjIiBmb250LXdlaWdodD0iNjAwIj51bmfDvGx0aWc8L3RleHQ+CiAgPGcgZm9udC1mYW1pbHk9InVpLW1vbm9zcGFjZSwgTWVubG8sIENvbnNvbGFzLCBtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPgogICAgPHRleHQgeD0iMjAwIiB5PSIxMjQiIGZpbGw9IiMxNTgwM2QiPm5vdGUgJmd0Oz0gMSAmYW1wOyZhbXA7IG5vdGUgJmx0Oz0gNjwvdGV4dD4KICAgIDx0ZXh0IHg9IjIwMCIgeT0iMTQyIiBmaWxsPSIjYjkxYzFjIj5ub3RlICZsdDsgMSB8fCBub3RlICZndDsgNjwvdGV4dD4KICA8L2c+Cjwvc3ZnPgo=",b0="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjMwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjMwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHRleHQgeD0iMjAiIHk9IjI0IiBmb250LXdlaWdodD0iNjAwIj5BYmxhdWYgZGVyIFdoaWxlLVNjaGxlaWZlPC90ZXh0PgogIDxyZWN0IHg9IjEyMCIgeT0iNDQiIHdpZHRoPSIxNjAiIGhlaWdodD0iNDAiIHJ4PSIyMCIgZmlsbD0iI2ZlZjNjNyIgc3Ryb2tlPSIjYjQ1MzA5IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjY5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ikaAgQmVkaW5ndW5nIHByw7xmZW48L3RleHQ+CiAgPHJlY3QgeD0iMTIwIiB5PSIxMjgiIHdpZHRoPSIxNjAiIGhlaWdodD0iNDAiIHJ4PSI2IiBmaWxsPSIjZGJlYWZlIiBzdHJva2U9IiMxZDRlZDgiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTUzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ikaEgSW5oYWx0IGF1c2bDvGhyZW48L3RleHQ+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjEuOCIgbWFya2VyLWVuZD0idXJsKCNhKSI+CiAgICA8bGluZSB4MT0iMjAwIiB5MT0iODQiIHgyPSIyMDAiIHkyPSIxMjYiLz4KICAgIDxwYXRoIGQ9Ik0xMjAgMTQ4IEM4MCAxNDgsIDgwIDY0LCAxMTggNjQiLz4KICAgIDxwYXRoIGQ9Ik0yODAgNjQgTDM0MCA2NCBMMzQwIDIwMCBMMjgyIDIwMCIvPgogIDwvZz4KICA8dGV4dCB4PSIyMDgiIHk9IjExMCIgZmlsbD0iIzE1ODAzZCIgZm9udC13ZWlnaHQ9IjYwMCI+dHJ1ZTwvdGV4dD4KICA8dGV4dCB4PSIzOCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj53aWVkZXI8L3RleHQ+CiAgPHRleHQgeD0iMzgiIHk9IjEyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+bmFjaCBvYmVuPC90ZXh0PgogIDx0ZXh0IHg9IjM0OCIgeT0iMTM0IiBmaWxsPSIjYjkxYzFjIiBmb250LXdlaWdodD0iNjAwIj5mYWxzZTwvdGV4dD4KICA8dGV4dCB4PSIyNzYiIHk9IjIwNSIgdGV4dC1hbmNob3I9ImVuZCI+d2VpdGVyIHVudGVyIGRlciBTY2hsZWlmZTwvdGV4dD4KPC9zdmc+Cg==",x0="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjMwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjMwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHRleHQgeD0iMTAwIiB5PSIyMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+a29wZmdlc3RldWVydCAoV2hpbGUpPC90ZXh0PgogIDx0ZXh0IHg9IjMwMCIgeT0iMjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSI2MDAiPmZ1w59nZXN0ZXVlcnQgKERvLXdoaWxlKTwvdGV4dD4KICA8bGluZSB4MT0iMjAwIiB5MT0iMTAiIHgyPSIyMDAiIHkyPSIyMjAiIHN0cm9rZT0iI2QxZDFkNiIvPgogIDxyZWN0IHg9IjM1IiB5PSI0NCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjE4IiBmaWxsPSIjZmVmM2M3IiBzdHJva2U9IiNiNDUzMDkiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKRoCBCZWRpbmd1bmc8L3RleHQ+CiAgPHJlY3QgeD0iMzUiIHk9IjEyNCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjYiIGZpbGw9IiNkYmVhZmUiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMTAwIiB5PSIxNDciIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKRoSBJbmhhbHQ8L3RleHQ+CiAgPHJlY3QgeD0iMjM1IiB5PSI0NCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjYiIGZpbGw9IiNkYmVhZmUiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMzAwIiB5PSI2NyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGgIEluaGFsdDwvdGV4dD4KICA8cmVjdCB4PSIyMzUiIHk9IjEyNCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjE4IiBmaWxsPSIjZmVmM2M3IiBzdHJva2U9IiNiNDUzMDkiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjMwMCIgeT0iMTQ3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ikaEgQmVkaW5ndW5nPC90ZXh0PgogIDxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIxLjYiIG1hcmtlci1lbmQ9InVybCgjYSkiPgogICAgPGxpbmUgeDE9IjEwMCIgeTE9IjgwIiB4Mj0iMTAwIiB5Mj0iMTIyIi8+CiAgICA8cGF0aCBkPSJNMzUgMTQyIEM4IDE0MiwgOCA2MiwgMzMgNjIiLz4KICAgIDxsaW5lIHgxPSIzMDAiIHkxPSI4MCIgeDI9IjMwMCIgeTI9IjEyMiIvPgogICAgPHBhdGggZD0iTTM2NSAxNDIgQzM5MiAxNDIsIDM5MiA2MiwgMzY3IDYyIi8+CiAgPC9nPgogIDx0ZXh0IHg9IjEwNiIgeT0iMTA2IiBmaWxsPSIjMTU4MDNkIiBmb250LXdlaWdodD0iNjAwIj50cnVlPC90ZXh0PgogIDx0ZXh0IHg9IjM4MCIgeT0iMTA2IiB0ZXh0LWFuY2hvcj0iZW5kIiBmaWxsPSIjMTU4MDNkIiBmb250LXdlaWdodD0iNjAwIj50cnVlPC90ZXh0PgogIDx0ZXh0IHg9IjEwMCIgeT0iMTkwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5Jc3QgZGllIEJlZGluZ3VuZyBnbGVpY2ggZmFsc2UsPC90ZXh0PgogIDx0ZXh0IHg9IjEwMCIgeT0iMjA2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5sw6R1ZnQgZGVyIEluaGFsdCA8dHNwYW4gZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFjMWMxZSI+bmllPC90c3Bhbj4uPC90ZXh0PgogIDx0ZXh0IHg9IjMwMCIgeT0iMTkwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5EZXIgSW5oYWx0IGzDpHVmdCBpbW1lcjwvdGV4dD4KICA8dGV4dCB4PSIzMDAiIHk9IjIwNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+PHRzcGFuIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiMxYzFjMWUiPm1pbmRlc3RlbnMgZWlubWFsPC90c3Bhbj4uPC90ZXh0Pgo8L3N2Zz4K",I0="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjUwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHJlY3QgeD0iMTIwIiB5PSIxNCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzNCIgcng9IjYiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzZlNmU3MyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMjAwIiB5PSIzNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGgIFN0YXJ0IDx0c3BhbiBmaWxsPSIjNmU2ZTczIj4obnVyIGVpbm1hbCk8L3RzcGFuPjwvdGV4dD4KICA8cmVjdCB4PSIxMjAiIHk9Ijc2IiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjM0IiByeD0iMTciIGZpbGw9IiNmZWYzYzciIHN0cm9rZT0iI2I0NTMwOSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMjAwIiB5PSI5OCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGhIEJlZGluZ3VuZyBwcsO8ZmVuPC90ZXh0PgogIDxyZWN0IHg9IjEyMCIgeT0iMTM4IiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjM0IiByeD0iNiIgZmlsbD0iI2RiZWFmZSIgc3Ryb2tlPSIjMWQ0ZWQ4IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjE2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGiIEluaGFsdCBhdXNmw7xocmVuPC90ZXh0PgogIDxyZWN0IHg9IjEyMCIgeT0iMjAwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjM0IiByeD0iNiIgZmlsbD0iI2RjZmNlNyIgc3Ryb2tlPSIjMTU4MDNkIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjIyMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGjIFNjaHJpdHQsIHouIEIuIGkrKzwvdGV4dD4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMS44IiBtYXJrZXItZW5kPSJ1cmwoI2EpIj4KICAgIDxsaW5lIHgxPSIyMDAiIHkxPSI0OCIgeDI9IjIwMCIgeTI9Ijc0Ii8+CiAgICA8bGluZSB4MT0iMjAwIiB5MT0iMTEwIiB4Mj0iMjAwIiB5Mj0iMTM2Ii8+CiAgICA8bGluZSB4MT0iMjAwIiB5MT0iMTcyIiB4Mj0iMjAwIiB5Mj0iMTk4Ii8+CiAgICA8cGF0aCBkPSJNMTIwIDIxNyBDNjAgMjE3LCA2MCA5MywgMTE4IDkzIi8+CiAgICA8cGF0aCBkPSJNMjgwIDkzIEwzMzAgOTMiLz4KICA8L2c+CiAgPHRleHQgeD0iMjA4IiB5PSIxMjkiIGZpbGw9IiMxNTgwM2QiIGZvbnQtd2VpZ2h0PSI2MDAiPnRydWU8L3RleHQ+CiAgPHRleHQgeD0iNDgiIHk9IjE2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+enVyw7xjazwvdGV4dD4KICA8dGV4dCB4PSI0OCIgeT0iMTc2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj56dSDikaE8L3RleHQ+CiAgPHRleHQgeD0iMzAwIiB5PSI4NCIgZmlsbD0iI2I5MWMxYyIgZm9udC13ZWlnaHQ9IjYwMCI+ZmFsc2U8L3RleHQ+CiAgPHRleHQgeD0iMzM2IiB5PSI5OCI+ZmVydGlnPC90ZXh0Pgo8L3N2Zz4K",z0="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMTkwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMDA3YWZmIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMTkwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHRleHQgeD0iMjAiIHk9IjI0IiBmb250LWZhbWlseT0idWktbW9ub3NwYWNlLCBNZW5sbywgQ29uc29sYXMsIG1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCI+aW50W10gemFobGVuID0gezIsIDQsIDYsIDgsIDEwfTwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iNTQiIGZpbGw9IiM2ZTZlNzMiIGZvbnQtc2l6ZT0iMTIiPkluZGV4PC90ZXh0PgogIDx0ZXh0IHg9IjkwIiB5PSI1NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwN2FmZiIgZm9udC13ZWlnaHQ9IjcwMCI+MDwvdGV4dD48cmVjdCB4PSI2MCIgeT0iNjIiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0NiIgZmlsbD0iI2YyZjJmNyIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI5MCIgeT0iOTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI2MDAiPjI8L3RleHQ+CiAgPHRleHQgeD0iMTUwIiB5PSI1NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwN2FmZiIgZm9udC13ZWlnaHQ9IjcwMCI+MTwvdGV4dD48cmVjdCB4PSIxMjAiIHk9IjYyIiB3aWR0aD0iNjAiIGhlaWdodD0iNDYiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMTUwIiB5PSI5MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9IjYwMCI+NDwvdGV4dD4KICA8dGV4dCB4PSIyMTAiIHk9IjU0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDA3YWZmIiBmb250LXdlaWdodD0iNzAwIj4yPC90ZXh0PjxyZWN0IHg9IjE4MCIgeT0iNjIiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0NiIgZmlsbD0iI2YyZjJmNyIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIyMTAiIHk9IjkyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iNjAwIj42PC90ZXh0PgogIDx0ZXh0IHg9IjI3MCIgeT0iNTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMDdhZmYiIGZvbnQtd2VpZ2h0PSI3MDAiPjM8L3RleHQ+PHJlY3QgeD0iMjQwIiB5PSI2MiIgd2lkdGg9IjYwIiBoZWlnaHQ9IjQ2IiBmaWxsPSIjZjJmMmY3IiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjI3MCIgeT0iOTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI2MDAiPjg8L3RleHQ+CiAgPHRleHQgeD0iMzMwIiB5PSI1NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwN2FmZiIgZm9udC13ZWlnaHQ9IjcwMCI+NDwvdGV4dD48cmVjdCB4PSIzMDAiIHk9IjYyIiB3aWR0aD0iNjAiIGhlaWdodD0iNDYiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMzMwIiB5PSI5MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9IjYwMCI+MTA8L3RleHQ+CiAgPHRleHQgeD0iMjAiIHk9IjkwIiBmaWxsPSIjNmU2ZTczIiBmb250LXNpemU9IjEyIj5XZXJ0PC90ZXh0PgogIDxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwN2FmZiIgc3Ryb2tlLXdpZHRoPSIxLjgiIG1hcmtlci1lbmQ9InVybCgjYSkiPjxsaW5lIHgxPSI5MCIgeTE9IjE0MCIgeDI9IjkwIiB5Mj0iMTEyIi8+PGxpbmUgeDE9IjMzMCIgeTE9IjE0MCIgeDI9IjMzMCIgeTI9IjExMiIvPjwvZz4KICA8ZyBmb250LWZhbWlseT0idWktbW9ub3NwYWNlLCBNZW5sbywgQ29uc29sYXMsIG1vbm9zcGFjZSIgZm9udC1zaXplPSIxMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+PHRleHQgeD0iOTAiIHk9IjE1NiI+emFobGVuWzBdIGlzdCAyPC90ZXh0Pjx0ZXh0IHg9IjMzMCIgeT0iMTU2Ij56YWhsZW5bNF0gaXN0IDEwPC90ZXh0PjwvZz4KICA8dGV4dCB4PSIyMDAiIHk9IjE4MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+NSBGw6RjaGVyLCBnZXrDpGhsdCB3aXJkIGFiIDA6IGRlciBsZXR6dGUgSW5kZXggaXN0IDQuPC90ZXh0Pgo8L3N2Zz4K",w0=""+new URL("schiffe-versenken-CXt1SF0S.svg",import.meta.url).href,y0=""+new URL("ss-binaere-suche-CPsLGldq.svg",import.meta.url).href,v0=""+new URL("ss-bubblesort-Dic2ZfaT.svg",import.meta.url).href,S0="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDQgMTk2IiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjMWMxYzFlIj4KPHJlY3Qgd2lkdGg9IjQwNCIgaGVpZ2h0PSIxOTYiIGZpbGw9IiNmZmZmZmYiLz4KPHRleHQgeD0iMTQiIHk9IjI0IiBmb250LXdlaWdodD0iNjAwIiBmb250LXNpemU9IjE1Ij5HZXN1Y2h0OiBkaWUgOS4gRGllIEthcnRlbiBzaW5kIGdlbWlzY2h0LjwvdGV4dD4KPGc+PHJlY3QgeD0iMTQiIHk9IjUwIiB3aWR0aD0iNDAiIGhlaWdodD0iNTYiIHJ4PSI1IiBmaWxsPSIjZjJmMmY3IiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMSIvPjx0ZXh0IHg9IjM0LjAiIHk9Ijc1LjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNkYzI2MjYiPjc8L3RleHQ+PHRleHQgeD0iMzQuMCIgeT0iOTUuOTE5OTk5OTk5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTUiIGZpbGw9IiNkYzI2MjYiPuKZpTwvdGV4dD48L2c+Cjx0ZXh0IHg9IjM0LjAiIHk9IjEzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0iI2RjMjYyNiI+4pyXPC90ZXh0Pgo8dGV4dCB4PSIzNC4wIiB5PSIxNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiM2ZTZlNzMiPjEuPC90ZXh0Pgo8Zz48cmVjdCB4PSI2MiIgeT0iNTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI1NiIgcng9IjUiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHRleHQgeD0iODIuMCIgeT0iNzUuMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFjMWMxZSI+MzwvdGV4dD48dGV4dCB4PSI4Mi4wIiB5PSI5NS45MTk5OTk5OTk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNSIgZmlsbD0iIzFjMWMxZSI+4pmgPC90ZXh0PjwvZz4KPHRleHQgeD0iODIuMCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjZGMyNjI2Ij7inJc8L3RleHQ+Cjx0ZXh0IHg9IjgyLjAiIHk9IjE0OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZlNmU3MyI+Mi48L3RleHQ+CjxnPjxyZWN0IHg9IjExMCIgeT0iNTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI1NiIgcng9IjUiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHRleHQgeD0iMTMwLjAiIHk9Ijc1LjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNkYzI2MjYiPjEwPC90ZXh0Pjx0ZXh0IHg9IjEzMC4wIiB5PSI5NS45MTk5OTk5OTk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNSIgZmlsbD0iI2RjMjYyNiI+4pmmPC90ZXh0PjwvZz4KPHRleHQgeD0iMTMwLjAiIHk9IjEzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9IjYwMCIgZmlsbD0iI2RjMjYyNiI+4pyXPC90ZXh0Pgo8dGV4dCB4PSIxMzAuMCIgeT0iMTQ4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjEzIiBmaWxsPSIjNmU2ZTczIj4zLjwvdGV4dD4KPGc+PHJlY3QgeD0iMTU4IiB5PSI1MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjU2IiByeD0iNSIgZmlsbD0iI2YyZjJmNyIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjEiLz48dGV4dCB4PSIxNzguMCIgeT0iNzUuMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFjMWMxZSI+NTwvdGV4dD48dGV4dCB4PSIxNzguMCIgeT0iOTUuOTE5OTk5OTk5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTUiIGZpbGw9IiMxYzFjMWUiPuKZozwvdGV4dD48L2c+Cjx0ZXh0IHg9IjE3OC4wIiB5PSIxMzAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiNkYzI2MjYiPuKclzwvdGV4dD4KPHRleHQgeD0iMTc4LjAiIHk9IjE0OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZlNmU3MyI+NC48L3RleHQ+CjxnPjxyZWN0IHg9IjIwNiIgeT0iNTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI1NiIgcng9IjUiIGZpbGw9IiNkY2ZjZTciIHN0cm9rZT0iIzE1ODAzZCIgc3Ryb2tlLXdpZHRoPSIzIi8+PHRleHQgeD0iMjI2LjAiIHk9Ijc1LjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiMxYzFjMWUiPjk8L3RleHQ+PHRleHQgeD0iMjI2LjAiIHk9Ijk1LjkxOTk5OTk5OTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE1IiBmaWxsPSIjMWMxYzFlIj7imaA8L3RleHQ+PC9nPgo8dGV4dCB4PSIyMjYuMCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iNjAwIiBmaWxsPSIjMTU4MDNkIj7inJM8L3RleHQ+Cjx0ZXh0IHg9IjIyNi4wIiB5PSIxNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiM2ZTZlNzMiPjUuPC90ZXh0Pgo8Zz48cmVjdCB4PSIyNTQiIHk9IjUwIiB3aWR0aD0iNDAiIGhlaWdodD0iNTYiIHJ4PSI1IiBmaWxsPSIjMWQ0ZWQ4IiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMSIvPjxyZWN0IHg9IjI1OCIgeT0iNTQiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0OCIgcng9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzkzYzVmZCIgc3Ryb2tlLXdpZHRoPSIxLjIiIHN0cm9rZS1kYXNoYXJyYXk9IjMgMiIvPjwvZz4KPGc+PHJlY3QgeD0iMzAyIiB5PSI1MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjU2IiByeD0iNSIgZmlsbD0iIzFkNGVkOCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSIzMDYiIHk9IjU0IiB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHJ4PSIzIiBmaWxsPSJub25lIiBzdHJva2U9IiM5M2M1ZmQiIHN0cm9rZS13aWR0aD0iMS4yIiBzdHJva2UtZGFzaGFycmF5PSIzIDIiLz48L2c+CjxnPjxyZWN0IHg9IjM1MCIgeT0iNTAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI1NiIgcng9IjUiIGZpbGw9IiMxZDRlZDgiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHJlY3QgeD0iMzU0IiB5PSI1NCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjQ4IiByeD0iMyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTNjNWZkIiBzdHJva2Utd2lkdGg9IjEuMiIgc3Ryb2tlLWRhc2hhcnJheT0iMyAyIi8+PC9nPgo8dGV4dCB4PSIxNCIgeT0iMTY4IiBmb250LXNpemU9IjE1IiBmaWxsPSIjNmU2ZTczIj5Wb24gbGlua3MgbmFjaCByZWNodHMgdW1kcmVoZW46PC90ZXh0Pjx0ZXh0IHg9IjE0IiB5PSIxODgiIGZvbnQtc2l6ZT0iMTUiIGZpbGw9IiM2ZTZlNzMiPk5hY2ggNSBWZXJnbGVpY2hlbiBpc3QgZGllIDkgZ2VmdW5kZW4uPC90ZXh0Pgo8L3N2Zz4K",k0=""+new URL("ss-vergleiche-DRqzU2TZ.svg",import.meta.url).href,_0="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MjAgNDUwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KPGRlZnM+PG1hcmtlciBpZD0iayIgdmlld0JveD0iMCAwIDEwIDEwIiByZWZYPSI5IiByZWZZPSI1IiBtYXJrZXJXaWR0aD0iNiIgbWFya2VySGVpZ2h0PSI2IiBvcmllbnQ9ImF1dG8iPjxwYXRoIGQ9Ik0wIDAgTDEwIDUgTDAgMTAgWiIgZmlsbD0iIzFjMWMxZSIvPjwvbWFya2VyPjxtYXJrZXIgaWQ9ImIiIHZpZXdCb3g9IjAgMCAxMCAxMCIgcmVmWD0iOSIgcmVmWT0iNSIgbWFya2VyV2lkdGg9IjYiIG1hcmtlckhlaWdodD0iNiIgb3JpZW50PSJhdXRvIj48cGF0aCBkPSJNMCAwIEwxMCA1IEwwIDEwIFoiIGZpbGw9IiMxZDRlZDgiLz48L21hcmtlcj48bWFya2VyIGlkPSJvIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI2IiBtYXJrZXJIZWlnaHQ9IjYiIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjYjQ1MzA5Ii8+PC9tYXJrZXI+PC9kZWZzPgo8cmVjdCB3aWR0aD0iNDIwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iI2ZmZmZmZiIvPgo8dGV4dCB4PSIxMCIgeT0iMjIiIGZvbnQtc2l6ZT0iMTUiIGZvbnQtd2VpZ2h0PSI3MDAiPldlcnTDvGJlcmdhYmU6IGVpbmUgS29waWU8L3RleHQ+CjxyZWN0IHg9IjEwIiB5PSIzOCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI4NiIgcng9IjgiIGZpbGw9IiNlZmY2ZmYiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHRleHQgeD0iMjAiIHk9IjU4IiBmb250LXNpemU9IjEzIiBmaWxsPSIjMWQ0ZWQ4Ij5IYXVwdHByb2dyYW1tPC90ZXh0Pgo8dGV4dCB4PSIyMCIgeT0iOTgiPnphaGw8L3RleHQ+CjxyZWN0IHg9IjcwIiB5PSI3OCIgd2lkdGg9IjU2IiBoZWlnaHQ9IjMwIiByeD0iNCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMWMxYzFlIi8+Cjx0ZXh0IHg9Ijk4IiB5PSI5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjcwMCI+NTwvdGV4dD4KPHJlY3QgeD0iMjUwIiB5PSIzOCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI4NiIgcng9IjgiIGZpbGw9IiNmZmY3ZWQiIHN0cm9rZT0iI2I0NTMwOSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz4KPHRleHQgeD0iMjYwIiB5PSI1OCIgZm9udC1zaXplPSIxMyIgZmlsbD0iI2I0NTMwOSI+dmVyZG9wcGxlPC90ZXh0Pgo8dGV4dCB4PSIyNjAiIHk9Ijk4Ij54PC90ZXh0Pgo8cmVjdCB4PSIyODAiIHk9Ijc4IiB3aWR0aD0iODAiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMxYzFjMWUiLz4KPHRleHQgeD0iMzIwIiB5PSI5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+PHRzcGFuIGZpbGw9IiM2ZTZlNzMiIHRleHQtZGVjb3JhdGlvbj0ibGluZS10aHJvdWdoIj41PC90c3Bhbj4gPHRzcGFuIGZvbnQtd2VpZ2h0PSI3MDAiPjEwPC90c3Bhbj48L3RleHQ+CjxsaW5lIHgxPSIxMjgiIHkxPSI5MyIgeDI9IjI0OCIgeTI9IjkzIiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSI1IDQiIG1hcmtlci1lbmQ9InVybCgjaykiLz4KPHRleHQgeD0iMjEwIiB5PSI4NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMyI+S29waWU8L3RleHQ+Cjx0ZXh0IHg9IjEwIiB5PSIxNTAiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiM2ZTZlNzMiPnggd2lyZCAxMCwgYWJlciB6YWhsIGJsZWlidCA1LjwvdGV4dD4KPHRleHQgeD0iMTAiIHk9IjE2OCIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZlNmU3MyI+V2llIGJlaSBlaW5lciBGb3Rva29waWU6IFdlciBhdWYgZGVyIEtvcGllIHNjaHJlaWJ0LDwvdGV4dD4KPHRleHQgeD0iMTAiIHk9IjE4NiIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZlNmU3MyI+w6RuZGVydCBkYXMgT3JpZ2luYWwgbmljaHQuPC90ZXh0Pgo8bGluZSB4MT0iMTAiIHkxPSIyMDgiIHgyPSI0MTAiIHkyPSIyMDgiIHN0cm9rZT0iI2QxZDFkNiIvPgo8dGV4dCB4PSIxMCIgeT0iMjM2IiBmb250LXNpemU9IjE1IiBmb250LXdlaWdodD0iNzAwIj5SZWZlcmVuesO8YmVyZ2FiZTogZGFzc2VsYmUgQXJyYXk8L3RleHQ+CjxyZWN0IHg9IjEwIiB5PSIyNTIiIHdpZHRoPSIxNjAiIGhlaWdodD0iNjIiIHJ4PSI4IiBmaWxsPSIjZWZmNmZmIiBzdHJva2U9IiMxZDRlZDgiIHN0cm9rZS13aWR0aD0iMS41Ii8+Cjx0ZXh0IHg9IjIwIiB5PSIyNzIiIGZvbnQtc2l6ZT0iMTMiIGZpbGw9IiMxZDRlZDgiPkhhdXB0cHJvZ3JhbW08L3RleHQ+Cjx0ZXh0IHg9IjIwIiB5PSIzMDAiPnJlaWhlPC90ZXh0Pgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIyOTUiIHI9IjUiIGZpbGw9IiMxZDRlZDgiLz4KPHJlY3QgeD0iMjUwIiB5PSIyNTIiIHdpZHRoPSIxNjAiIGhlaWdodD0iNjIiIHJ4PSI4IiBmaWxsPSIjZmZmN2VkIiBzdHJva2U9IiNiNDUzMDkiIHN0cm9rZS13aWR0aD0iMS41Ii8+Cjx0ZXh0IHg9IjI2MCIgeT0iMjcyIiBmb250LXNpemU9IjEzIiBmaWxsPSIjYjQ1MzA5Ij5sZWVyZW48L3RleHQ+Cjx0ZXh0IHg9IjI2MCIgeT0iMzAwIj5wbGFldHplPC90ZXh0Pgo8Y2lyY2xlIGN4PSIzOTAiIGN5PSIyOTUiIHI9IjUiIGZpbGw9IiNiNDUzMDkiLz4KPHBhdGggZD0iTTE1MCAzMDAgTDE1MCAzNDAgTDE0MCAzNTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIxLjUiIG1hcmtlci1lbmQ9InVybCgjYikiLz4KPHBhdGggZD0iTTM5MCAzMDAgTDM5MCAzNDAgTDMyMiAzNTQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2I0NTMwOSIgc3Ryb2tlLXdpZHRoPSIxLjUiIG1hcmtlci1lbmQ9InVybCgjbykiLz4KPHJlY3QgeD0iOTAiIHk9IjM1OCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjMyIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMxYzFjMWUiLz4KPHJlY3QgeD0iMTUwIiB5PSIzNTgiIHdpZHRoPSI2MCIgaGVpZ2h0PSIzMiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMWMxYzFlIi8+CjxyZWN0IHg9IjIxMCIgeT0iMzU4IiB3aWR0aD0iNjAiIGhlaWdodD0iMzIiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzFjMWMxZSIvPgo8cmVjdCB4PSIyNzAiIHk9IjM1OCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjMyIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMxYzFjMWUiLz4KPHRleHQgeD0iMTIwIiB5PSIzNzkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTMiPmZhbHNlPC90ZXh0Pgo8dGV4dCB4PSIxODAiIHk9IjM3OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxMyI+ZmFsc2U8L3RleHQ+Cjx0ZXh0IHg9IjI0MCIgeT0iMzc5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjEzIj5mYWxzZTwvdGV4dD4KPHRleHQgeD0iMzAwIiB5PSIzNzkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTMiPmZhbHNlPC90ZXh0Pgo8dGV4dCB4PSIxMCIgeT0iNDE2IiBmb250LXNpemU9IjEzIiBmaWxsPSIjNmU2ZTczIj5FcyBnaWJ0IG51ciBlaW4gQXJyYXkuIFdhcyBsZWVyZW4gw7xiZXIgcGxhZXR6ZSDDpG5kZXJ0LDwvdGV4dD4KPHRleHQgeD0iMTAiIHk9IjQzNCIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZlNmU3MyI+c2llaHQgZGFzIEhhdXB0cHJvZ3JhbW0gdW50ZXIgcmVpaGUuPC90ZXh0Pgo8L3N2Zz4K",Z0=""+new URL("zk-zeichen-vYvc3iJg.svg",import.meta.url).href;function D0(i){const e=[];for(const t of i.replace(/\r\n/g,`
`).split(`
`)){const n=/^###\s+(.+)$/.exec(t),s=e.at(-1);if(n){const r=n[1].trim();e.push({term:r,forms:[r],text:""})}else s&&/^auch:/i.test(t)?s.forms.push(...t.replace(/^auch:/i,"").split(",").map(r=>r.trim()).filter(Boolean)):s&&t.trim()!==""&&(s.text=(s.text+" "+t.trim()).trim())}return e.filter(t=>t.text!=="")}const M0=i=>i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");function Nn(i){const e=i.flatMap(t=>t.forms).sort((t,n)=>n.length-t.length);if(e.length!==0)return new RegExp(`(?<![\\p{L}\\p{N}_-])(?:${e.map(M0).join("|")})(?![\\p{L}\\p{N}_-])`,"u")}function Gn(i,e){return i.find(t=>t.forms.includes(e))}class V extends Error{}function Y1(i,e){const t=/^---\n([\s\S]*?)\n---\n?/.exec(i.replace(/\r\n/g,`
`));if(!t)throw new V(`${e}: Kopfzeilen (--- … ---) fehlen.`);const n=new Map;for(const s of t[1].split(`
`)){const r=/^([a-zäöüß]+):\s*(.*)$/i.exec(s.trim());r&&n.set(r[1].toLowerCase(),r[2].trim())}return{meta:n,body:i.replace(/\r\n/g,`
`).slice(t[0].length)}}function A0(i,e){const t=i.split(/\s*(?:->|→)\s*/);if(t.length!==2)throw new V(`${e}: Test „${i}“ braucht genau ein „->“.`);const n=(s,r)=>s.trim()===""||s.trim()==="-"?[]:s.split(r).map(a=>a.trim());return{inputs:n(t[0],/\s*,\s*/),expected:n(t[1],/\s*\|\s*/)}}function j0(i,e,t){const n={id:i,title:"",task:"",tests:[],requires:[],hints:[],subprograms:[]};let s;for(const r of e){const a=/^(titel|auftrag|start|test|braucht|tipp|lösung|loesung|unterprogramm):\s*(.*)$/i.exec(r.trim());if(a){const[,l,o]=a;switch(s=void 0,l.toLowerCase()){case"titel":n.title=o;break;case"auftrag":n.task=o,s="task";break;case"start":n.start=o;break;case"test":n.tests.push(A0(o,t));break;case"braucht":n.requires.push(...o.split(/\s*,\s*/).filter(Boolean));break;case"tipp":n.hints.push(o),s="hint";break;case"lösung":case"loesung":n.solution=o;break;case"unterprogramm":n.subprograms.push(...o.split(/\s*,\s*/).filter(Boolean));break}}else s&&r.trim()!==""?s==="task"?n.task+=`
`+r.trim():n.hints[n.hints.length-1]+=`
`+r.trim():r.trim()===""&&s==="task"&&(n.task+=`
`)}if(!n.title)throw new V(`${t}: Übung „${i}“ hat keinen Titel.`);if(!n.task.trim())throw new V(`${t}: Übung „${i}“ hat keinen Auftrag.`);return n.task=n.task.trim(),n}function P0(i,e){const t=[];for(const n of i){const s=n.trim();if(s.startsWith("?"))t.push({question:s.slice(1).trim(),options:[]});else if(/^- \[[ xX]\]/.test(s)){const r=t.at(-1);if(!r)throw new V(`${e}: Antwort ohne Frage im Quiz.`);r.options.push({text:s.slice(5).trim(),correct:s[3].toLowerCase()==="x"})}else if(s.startsWith("= ")){const r=t.at(-1),a=/^=\s+(.+?)\s+->\s+(.+)$/.exec(s);if(!r||!a)throw new V(`${e}: Zuordnung „${s}“ braucht die Form „= links -> rechts“ nach einer Frage.`);(r.pairs??(r.pairs=[])).push({left:a[1].trim(),right:a[2].trim()})}else if(s.startsWith(">")){const r=t.at(-1);r&&(r.explanation=((r.explanation?r.explanation+" ":"")+s.slice(1).trim()).trim())}}for(const n of t){if(n.pairs){const s=new Set(n.pairs.map(r=>r.right));if(n.options.length>0||n.pairs.length<2||s.size!==n.pairs.length)throw new V(`${e}: Zuordnung „${n.question}“ braucht mindestens zwei Paare mit verschiedenen rechten Seiten und keine Antworten.`);continue}if(n.options.length<2||!n.options.some(s=>s.correct))throw new V(`${e}: Quizfrage „${n.question}“ braucht mindestens zwei Antworten, davon eine richtige.`)}return t}function O1(i,e){const t=[],n=i.split(`
`);let s=[];const r=()=>{const a=s.join(`
`).trim();a&&t.push({kind:"markdown",text:a}),s=[]};for(let a=0;a<n.length;a++){const l=/^:::\s*([a-zäöüß]+)\s*(.*)$/i.exec(n[a].trim());if(!l){s.push(n[a]);continue}r();const o=[];let u=a+1;for(;u<n.length&&n[u].trim()!==":::";)o.push(n[u++]);if(u>=n.length)throw new V(`${e}: Block „::: ${l[1]}“ wird nicht mit „:::“ geschlossen.`);const c=l[1].toLowerCase(),d=l[2].trim();switch(c){case"diagramm":if(!d)throw new V(`${e}: „::: diagramm“ braucht einen Dateinamen.`);t.push({kind:"diagram",file:d,caption:o.join(" ").trim()});break;case"übung":case"uebung":if(!d)throw new V(`${e}: „::: übung“ braucht eine Kennung.`);t.push({kind:"exercise",exercise:j0(d,o,e)});break;case"checkliste":t.push({kind:"checklist",items:o.map(m=>m.trim()).filter(m=>m.startsWith("- ")).map(m=>B0(m.slice(2).trim()))});break;case"quiz":t.push({kind:"quiz",questions:P0(o,e)});break;case"bild":if(!d)throw new V(`${e}: „::: bild“ braucht einen Dateinamen.`);t.push({kind:"images",files:d.split(/\s+/),caption:o.join(" ").trim()});break;case"grafik":if(!d)throw new V(`${e}: „::: grafik“ braucht einen Dateinamen.`);t.push({kind:"graphic",file:d,caption:o.join(" ").trim()});break;case"angeberwissen":t.push({kind:"brag",text:o.join(`
`).trim()});break;default:throw new V(`${e}: Unbekannter Block „::: ${l[1]}“.`)}a=u}return r(),t}function B0(i){const e=/^(.*?)\s+→\s+(.+)$/.exec(i);return e?{text:e[1],ref:e[2].trim()}:{text:i}}function W0(i,e){const t=new Map(i.map((n,s)=>[n.title.toLowerCase(),s]));for(const n of i.flatMap(s=>s.blocks))if(n.kind==="checklist"){for(const s of n.items)if(s.ref!==void 0&&(s.step=t.get(s.ref.toLowerCase()),s.step===void 0))throw new V(`${e}: Checkliste verweist auf unbekannten Schritt „${s.ref}“.`)}}function C0(i,e){var d;const{meta:t,body:n}=Y1(i,e),s=e.replace(/^.*\//,"").replace(/\.md$/,""),r=Number((d=/^(\d+)/.exec(s))==null?void 0:d[1]);if(!Number.isFinite(r))throw new V(`${e}: Dateiname muss mit der Nummer beginnen (z. B. 01-…).`);const a=[];let l=[],o;const u=()=>{o&&a.push({title:o.title,blocks:O1(o.lines.join(`
`),e)})};for(const m of n.split(`
`)){const p=/^##\s+(.*)$/.exec(m);p?(u(),o={title:p[1].trim(),lines:[]}):o?o.lines.push(m):l.push(m)}if(u(),a.length===0)throw new V(`${e}: Keine Schritte (## Überschrift) gefunden.`);W0(a,e);const c=t.get("titel");if(!c)throw new V(`${e}: „titel:“ fehlt.`);return{id:s,number:r,title:c,section:t.get("bereich")??"",summary:t.get("kurz")??l.join(" ").trim(),steps:a}}function T0(i,e){const{meta:t,body:n}=Y1(i,e),s=t.get("titel");if(!s)throw new V(`${e}: „titel:“ fehlt.`);const r=t.get("nach");return{id:e.replace(/^.*\//,"").replace(/\.md$/,""),title:s,after:r?Number(r):void 0,level:Number(t.get("stufe")??"1")||1,blocks:O1(n,e)}}const ln=Object.assign({"../../lessons/de/01-was-ist-ein-struktogramm.md":Js,"../../lessons/de/02-der-editor.md":Qs,"../../lessons/de/03-speichern-oeffnen-exportieren.md":qs,"../../lessons/de/04-variablen-und-datentypen.md":er,"../../lessons/de/05-sequenz.md":tr,"../../lessons/de/06-eingabe-und-ausgabe.md":nr,"../../lessons/de/07-simulation-und-schreibtischtest.md":ir,"../../lessons/de/08-verzweigung.md":sr,"../../lessons/de/09-bedingungen-verknuepfen.md":rr,"../../lessons/de/10-fallauswahl.md":ar,"../../lessons/de/11-while-schleife.md":lr,"../../lessons/de/12-do-while-schleife.md":or,"../../lessons/de/13-for-schleife.md":ur,"../../lessons/de/14-verschachteln.md":cr,"../../lessons/de/15-arrays.md":dr,"../../lessons/de/16-zweidimensionale-arrays.md":hr,"../../lessons/de/17-zeichenketten.md":mr,"../../lessons/de/18-aufruf-und-aussprung.md":gr,"../../lessons/de/19-suchen-und-sortieren.md":pr,"../../lessons/de/20-java.md":fr,"../../lessons/de/21-python-und-javascript.md":br,"../../lessons/de/begriffe.md":xr,"../../lessons/de/nachschlagen.md":Ir}),E0=Object.assign({"../../lessons/de/aufgaben/alter-unterprogramm.md":zr,"../../lessons/de/aufgaben/binaerzahl.md":wr,"../../lessons/de/aufgaben/collatz.md":yr,"../../lessons/de/aufgaben/fibonacci.md":vr,"../../lessons/de/aufgaben/gerade-ungerade.md":Sr,"../../lessons/de/aufgaben/mehrwertsteuer.md":kr,"../../lessons/de/aufgaben/notendurchschnitt.md":_r,"../../lessons/de/aufgaben/pin-pruefen.md":Zr,"../../lessons/de/aufgaben/schiffe-versenken.md":Dr,"../../lessons/de/aufgaben/speisekarte.md":Mr,"../../lessons/de/aufgaben/summe-bilden.md":Ar,"../../lessons/de/aufgaben/tafeldienst.md":jr,"../../lessons/de/aufgaben/taschenrechner.md":Pr,"../../lessons/de/aufgaben/verleih-menue.md":Br,"../../lessons/de/aufgaben/volljaehrig.md":Wr,"../../lessons/de/aufgaben/zahl-verdoppeln.md":Cr}),L0=Object.assign({"../../lessons/diagramme/aufgabe-alter-haupt-loesung.visustruct":Tr,"../../lessons/diagramme/aufgabe-alter-unterprogramm-loesung.visustruct":Er,"../../lessons/diagramme/aufgabe-binaer-loesung.visustruct":Lr,"../../lessons/diagramme/aufgabe-collatz-loesung.visustruct":Hr,"../../lessons/diagramme/aufgabe-durchschnitt-loesung.visustruct":Nr,"../../lessons/diagramme/aufgabe-fibonacci-loesung.visustruct":Gr,"../../lessons/diagramme/aufgabe-gerade-loesung.visustruct":Vr,"../../lessons/diagramme/aufgabe-mehrwertsteuer-loesung.visustruct":Fr,"../../lessons/diagramme/aufgabe-pin-loesung.visustruct":Rr,"../../lessons/diagramme/aufgabe-rechner-loesung.visustruct":Ur,"../../lessons/diagramme/aufgabe-schiffe-loesung.visustruct":$r,"../../lessons/diagramme/aufgabe-schiffe-start.visustruct":Xr,"../../lessons/diagramme/aufgabe-speisekarte-loesung.visustruct":Yr,"../../lessons/diagramme/aufgabe-summe-loesung.visustruct":Or,"../../lessons/diagramme/aufgabe-tafeldienst-loesung.visustruct":Kr,"../../lessons/diagramme/aufgabe-verdoppeln-loesung.visustruct":Jr,"../../lessons/diagramme/aufgabe-verleih-loesung.visustruct":Qr,"../../lessons/diagramme/aufgabe-volljaehrig-loesung.visustruct":qr,"../../lessons/diagramme/kino-einmaleins-loesung.visustruct":ea,"../../lessons/diagramme/kino-frei-loesung.visustruct":ta,"../../lessons/diagramme/kino-frei-start.visustruct":na,"../../lessons/diagramme/kino-karte-loesung.visustruct":ia,"../../lessons/diagramme/kino-karte-start.visustruct":sa,"../../lessons/diagramme/kino-saalplan.visustruct":ra,"../../lessons/diagramme/kino-verkaufen.visustruct":aa,"../../lessons/diagramme/l04-rechnen.visustruct":la,"../../lessons/diagramme/l04-reihenfolge-loesung.visustruct":oa,"../../lessons/diagramme/l04-reihenfolge-start.visustruct":ua,"../../lessons/diagramme/l04-tauschen-loesung.visustruct":ca,"../../lessons/diagramme/l04-tauschen-start.visustruct":da,"../../lessons/diagramme/l04-tauschen.visustruct":ha,"../../lessons/diagramme/l05-datentypen.visustruct":ma,"../../lessons/diagramme/l05-division.visustruct":ga,"../../lessons/diagramme/l05-einkauf-loesung.visustruct":pa,"../../lessons/diagramme/l05-rechteck-loesung.visustruct":fa,"../../lessons/diagramme/l05-sekunden-loesung.visustruct":ba,"../../lessons/diagramme/l05-sekunden-start.visustruct":xa,"../../lessons/diagramme/l06-begruessung-loesung.visustruct":Ia,"../../lessons/diagramme/l06-eva.visustruct":za,"../../lessons/diagramme/l06-mittelwert-loesung.visustruct":wa,"../../lessons/diagramme/l06-rechner-loesung.visustruct":ya,"../../lessons/diagramme/l07-alter-pruefen.visustruct":va,"../../lessons/diagramme/l07-betrag-loesung.visustruct":Sa,"../../lessons/diagramme/l07-gerade-loesung.visustruct":ka,"../../lessons/diagramme/l07-maximum-loesung.visustruct":_a,"../../lessons/diagramme/l07-rabatt.visustruct":Za,"../../lessons/diagramme/l08-gueltig-loesung.visustruct":Da,"../../lessons/diagramme/l08-jugendticket.visustruct":Ma,"../../lessons/diagramme/l08-note.visustruct":Aa,"../../lessons/diagramme/l08-schaltjahr-loesung.visustruct":ja,"../../lessons/diagramme/l08-wochenende-loesung.visustruct":Pa,"../../lessons/diagramme/l09-ampel.visustruct":Ba,"../../lessons/diagramme/l09-automat.visustruct":Wa,"../../lessons/diagramme/l09-note-loesung.visustruct":Ca,"../../lessons/diagramme/l09-rechner-loesung.visustruct":Ta,"../../lessons/diagramme/l09-verschachtelt.visustruct":Ea,"../../lessons/diagramme/l1-grundbausteine.visustruct":La,"../../lessons/diagramme/l1-sequenz.visustruct":Ha,"../../lessons/diagramme/l1-tee.visustruct":Na,"../../lessons/diagramme/l1-verzweigung.visustruct":Ga,"../../lessons/diagramme/l1-wiederholung.visustruct":Va,"../../lessons/diagramme/l10-bis-n-loesung.visustruct":Fa,"../../lessons/diagramme/l10-countdown.visustruct":Ra,"../../lessons/diagramme/l10-endlos.visustruct":Ua,"../../lessons/diagramme/l10-fakultaet.visustruct":$a,"../../lessons/diagramme/l10-verdoppeln-loesung.visustruct":Xa,"../../lessons/diagramme/l11-eingabe-pruefen.visustruct":Ya,"../../lessons/diagramme/l11-einmal.visustruct":Oa,"../../lessons/diagramme/l11-note-loesung.visustruct":Ka,"../../lessons/diagramme/l11-summe-loesung.visustruct":Ja,"../../lessons/diagramme/l12-countdown-loesung.visustruct":Qa,"../../lessons/diagramme/l12-einmaleins-loesung.visustruct":qa,"../../lessons/diagramme/l12-eins-bis-fuenf.visustruct":el,"../../lessons/diagramme/l12-summe.visustruct":tl,"../../lessons/diagramme/l13-dreieck.visustruct":nl,"../../lessons/diagramme/l13-gerade-eingaben-loesung.visustruct":il,"../../lessons/diagramme/l13-gerade-zaehlen.visustruct":sl,"../../lessons/diagramme/l13-rechteck-loesung.visustruct":rl,"../../lessons/diagramme/l14-array-durchlaufen.visustruct":al,"../../lessons/diagramme/l14-erster-letzter-loesung.visustruct":ll,"../../lessons/diagramme/l14-namen-eingeben.visustruct":ol,"../../lessons/diagramme/l14-rueckwaerts-loesung.visustruct":ul,"../../lessons/diagramme/l14-summe-max-loesung.visustruct":cl,"../../lessons/diagramme/l14-summe-maximum.visustruct":dl,"../../lessons/diagramme/l15-bis-null-loesung.visustruct":hl,"../../lessons/diagramme/l15-endlos-aussprung.visustruct":ml,"../../lessons/diagramme/l15-flaeche-loesung.visustruct":gl,"../../lessons/diagramme/l15-flaeche-unterprogramm-loesung.visustruct":pl,"../../lessons/diagramme/l15-hauptprogramm.visustruct":fl,"../../lessons/diagramme/l15-quadrat-haupt.visustruct":bl,"../../lessons/diagramme/l15-quadrat.visustruct":xl,"../../lessons/diagramme/l15-titel-loesung.visustruct":Il,"../../lessons/diagramme/l15-unterprogramm.visustruct":zl,"../../lessons/diagramme/l15-zeige-summe-haupt.visustruct":wl,"../../lessons/diagramme/l15-zeige-summe.visustruct":yl,"../../lessons/diagramme/l16-countdown-loesung.visustruct":vl,"../../lessons/diagramme/l16-countdown-start.visustruct":Sl,"../../lessons/diagramme/l16-schreibtisch.visustruct":kl,"../../lessons/diagramme/l16-summe-loesung.visustruct":_l,"../../lessons/diagramme/l16-summe-start.visustruct":Zl,"../../lessons/diagramme/l17-beispiel.visustruct":Dl,"../../lessons/diagramme/l17-fakultaet-loesung.visustruct":Ml,"../../lessons/diagramme/l17-ticket-loesung.visustruct":Al,"../../lessons/diagramme/l18-beispiel.visustruct":jl,"../../lessons/diagramme/l18-js-loesung.visustruct":Pl,"../../lessons/diagramme/l18-python-loesung.visustruct":Bl,"../../lessons/diagramme/l2-ausgabe.visustruct":Wl,"../../lessons/diagramme/l2-hallo-loesung.visustruct":Cl,"../../lessons/diagramme/l2-zwei-zeilen-loesung.visustruct":Tl,"../../lessons/diagramme/sim-kino-loesung.visustruct":El,"../../lessons/diagramme/sim-kino-start.visustruct":Ll,"../../lessons/diagramme/sim-tausch-loesung.visustruct":Hl,"../../lessons/diagramme/sim-tausch-start.visustruct":Nl,"../../lessons/diagramme/sim-tausch.visustruct":Gl,"../../lessons/diagramme/ss-absteigend-loesung.visustruct":Vl,"../../lessons/diagramme/ss-absteigend-start.visustruct":Fl,"../../lessons/diagramme/ss-binaere-suche.visustruct":Rl,"../../lessons/diagramme/ss-bubblesort.visustruct":Ul,"../../lessons/diagramme/ss-karte-suchen-loesung.visustruct":$l,"../../lessons/diagramme/ss-lineare-suche.visustruct":Xl,"../../lessons/diagramme/uebergabe-bonus-loesung.visustruct":Yl,"../../lessons/diagramme/uebergabe-bonus-start.visustruct":Ol,"../../lessons/diagramme/uebergabe-bonus-unterprogramm-loesung.visustruct":Kl,"../../lessons/diagramme/uebergabe-haupt.visustruct":Jl,"../../lessons/diagramme/uebergabe-leeren.visustruct":Ql,"../../lessons/diagramme/uebergabe-verdopple.visustruct":ql,"../../lessons/diagramme/zk-initialen-loesung.visustruct":e0,"../../lessons/diagramme/zk-rueckwaerts-loesung.visustruct":t0,"../../lessons/diagramme/zk-split.visustruct":n0,"../../lessons/diagramme/zk-woerter-loesung.visustruct":i0,"../../lessons/diagramme/zk-zaehlen.visustruct":s0,"../../lessons/diagramme/zk-zeichen.visustruct":r0}),H0=Object.assign({"../../lessons/bilder/aufgabe-mehrwertsteuer.svg":a0,"../../lessons/bilder/ben-shneiderman.jpg":l0,"../../lessons/bilder/ike-nassi.jpg":o0,"../../lessons/bilder/kino-saal.svg":u0,"../../lessons/bilder/kino-schleifen.svg":c0,"../../lessons/bilder/l01-pap.svg":d0,"../../lessons/bilder/l02-einfuegen.svg":h0,"../../lessons/bilder/l04-variable.svg":m0,"../../lessons/bilder/l04-zuweisung.svg":g0,"../../lessons/bilder/l05-tauschen.svg":p0,"../../lessons/bilder/l08-zahlenstrahl.svg":f0,"../../lessons/bilder/l10-kopfgesteuert.svg":b0,"../../lessons/bilder/l11-vergleich.svg":x0,"../../lessons/bilder/l12-for-ablauf.svg":I0,"../../lessons/bilder/l14-array.svg":z0,"../../lessons/bilder/schiffe-versenken.svg":w0,"../../lessons/bilder/ss-binaere-suche.svg":y0,"../../lessons/bilder/ss-bubblesort.svg":v0,"../../lessons/bilder/ss-lineare-suche.svg":S0,"../../lessons/bilder/ss-vergleiche.svg":k0,"../../lessons/bilder/uebergabe.svg":_0,"../../lessons/bilder/zk-zeichen.svg":Z0}),ct=i=>i.replace(/^.*\//,""),xe=Object.entries(ln).filter(([i])=>/\/\d+[^/]*\.md$/.test(i)).map(([i,e])=>C0(e,ct(i))).sort((i,e)=>i.number-e.number),zt=Object.entries(E0).map(([i,e])=>T0(e,ct(i))).sort((i,e)=>(i.after??0)-(e.after??0)||i.level-e.level||i.title.localeCompare(e.title,"de"));var o1;const N0=((o1=Object.entries(ln).find(([i])=>i.endsWith("/nachschlagen.md")))==null?void 0:o1[1])??"";var u1;const wt=D0(((u1=Object.entries(ln).find(([i])=>i.endsWith("/begriffe.md")))==null?void 0:u1[1])??""),G0=new Map(Object.entries(L0).map(([i,e])=>[ct(i),e]));function Se(i){const e=G0.get(i);return e===void 0?void 0:qt(e)}const V0=new Map(Object.entries(H0).map(([i,e])=>[ct(i),e]));function Vn(i){return V0.get(i)}const K1=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function O(i){const e=[];let t=K1(i).replace(/`([^`]+)`/g,(n,s)=>(e.push(s),`\0${e.length-1}\0`));return t=t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/(^|[^*])\*([^*\s][^*]*?)\*/g,"$1<em>$2</em>").replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,(n,s,r)=>{const a=/^(https?:|mailto:|#|\.{0,2}\/)/.test(r)?r:"#",l=/^https?:/.test(a)?' target="_blank" rel="noopener noreferrer"':"";return`<a href="${a}"${l}>${s}</a>`}),t.replace(/\u0000(\d+)\u0000/g,(n,s)=>`<code>${e[Number(s)]}</code>`)}function Ie(i){const e=[],t=i.replace(/\r\n/g,`
`).split(`
`);let n=0;for(;n<t.length;){const s=t[n];if(s.trim()===""){n++;continue}if(s.startsWith("```")){const l=[];for(n++;n<t.length&&!t[n].startsWith("```");)l.push(t[n++]);n++,e.push(`<pre class="lesson-code" dir="ltr"><code>${K1(l.join(`
`))}</code></pre>`);continue}const r=/^(#{3,4})\s+(.*)$/.exec(s);if(r){const l=r[1].length;e.push(`<h${l}>${O(r[2])}</h${l}>`),n++;continue}if(/^\s*([-*]|\d+\.)\s+/.test(s)){const l=/^\s*\d+\./.test(s),o=[];for(;n<t.length&&/^\s*([-*]|\d+\.)\s+/.test(t[n]);){let u=t[n].replace(/^\s*([-*]|\d+\.)\s+/,"");for(n++;n<t.length&&/^\s{2,}\S/.test(t[n])&&!/^\s*([-*]|\d+\.)\s+/.test(t[n]);)u+=" "+t[n++].trim();o.push(`<li>${O(u)}</li>`)}e.push(l?`<ol>${o.join("")}</ol>`:`<ul>${o.join("")}</ul>`);continue}if(s.startsWith("|")&&/^\|?[\s:|-]*-{3,}[\s:|-]*$/.test(t[n+1]??"")){const l=c=>c.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(d=>O(d.trim())),o=l(s);n+=2;const u=[];for(;n<t.length&&t[n].startsWith("|");)u.push(l(t[n++]));e.push(`<div class="lesson-table"><table><thead><tr>${o.map(c=>`<th>${c}</th>`).join("")}</tr></thead><tbody>${u.map(c=>`<tr>${c.map(d=>`<td>${d}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);continue}if(s.startsWith(">")){const l=[];for(;n<t.length&&t[n].startsWith(">");)l.push(t[n++].replace(/^>\s?/,""));e.push(`<aside class="lesson-note">${Ie(l.join(`
`))}</aside>`);continue}const a=[];for(;n<t.length&&t[n].trim()!==""&&!/^(```|#{3,4}\s|>|\||\s*([-*]|\d+\.)\s+)/.test(t[n]);)a.push(t[n++].trim());e.push(`<p>${O(a.join(" "))}</p>`)}return e.join(`
`)}const F0=""+new URL("ludwig-Cus1i402.webp",import.meta.url).href,J1="visustruct.learn.progress",yt={"04-sequenz":"05-sequenz","05-variablen-und-datentypen":"04-variablen-und-datentypen","07-verzweigung":"08-verzweigung","08-bedingungen-verknuepfen":"09-bedingungen-verknuepfen","09-fallauswahl":"10-fallauswahl","10-while-schleife":"11-while-schleife","11-do-while-schleife":"12-do-while-schleife","12-for-schleife":"13-for-schleife","13-verschachteln":"14-verschachteln","14-arrays":"15-arrays","15-aufruf-und-aussprung":"18-aufruf-und-aussprung","16-aufruf-und-aussprung":"18-aufruf-und-aussprung","17-aufruf-und-aussprung":"18-aufruf-und-aussprung","17-suchen-und-sortieren":"19-suchen-und-sortieren","18-suchen-und-sortieren":"19-suchen-und-sortieren","16-simulation-und-schreibtischtest":"07-simulation-und-schreibtischtest","17-java":"20-java","18-java":"20-java","19-java":"20-java","18-python-und-javascript":"21-python-und-javascript","19-python-und-javascript":"21-python-und-javascript","20-python-und-javascript":"21-python-und-javascript"};function R0(i){var n;const e={...i.lessons};for(const[s,r]of Object.entries(yt))i.lessons[s]&&!i.lessons[r]&&(e[r]=i.lessons[s]),i.lessons[s]&&delete e[s];const t=(n=i.view)!=null&&n.lesson&&yt[i.view.lesson]?{...i.view,lesson:yt[i.view.lesson]}:i.view;return{...i,lessons:e,view:t}}function Q1(){try{const i=localStorage.getItem(J1);if(i){const e=JSON.parse(i);return R0({lessons:e.lessons??{},exercises:e.exercises??{},view:e.view})}}catch{}return{lessons:{},exercises:{}}}let ie=Q1();function Fe(){try{localStorage.setItem(J1,JSON.stringify(ie))}catch{}}const L={lesson(i){var e;return(e=ie.lessons)[i]??(e[i]={step:0})},updateLesson(i,e){ie.lessons[i]={...L.lesson(i),...e},Fe()},exercise(i){return ie.exercises[i]??{}},updateExercise(i,e){ie.exercises[i]={...L.exercise(i),...e},Fe()},resetExercise(i){delete ie.exercises[i],Fe()},view(){return ie.view},setView(i){ie.view=i,Fe()},reload(){ie=Q1()}},$t="f4ecc8e489ae7865308288c7d0fa313333cf2be3ff529b23bc214bee010310e0",on="visustruct.learn.teacher";let un=!1;function Fn(){if(un)return!0;try{return localStorage.getItem(on)===$t}catch{return!1}}async function U0(i){const e=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(i));return[...new Uint8Array(e)].map(t=>t.toString(16).padStart(2,"0")).join("")}async function $0(i){let e=!1;try{e=await U0(i.trim())===$t}catch{return!1}if(e){un=!0;try{localStorage.setItem(on,$t)}catch{}}return e}function X0(){un=!1;try{localStorage.removeItem(on)}catch{}}function Xt(i){switch(i.kind){case"finished":return h("sim_notice_finished");case"infiniteLoopWithoutBody":return h("sim_notice_infinite_loop_empty");case"unsupportedStatement":return h("sim_notice_unsupported_statement_fmt",i.text);case"invalidExpression":return h("sim_notice_invalid_expression_fmt",i.text);case"unknownVariable":return h("sim_notice_unknown_variable_fmt",i.text);case"divisionByZero":return h("sim_notice_division_by_zero");case"wholeNumberExpected":return h("sim_notice_whole_number_expected");case"numberExpected":return h("sim_notice_number_expected");case"booleanExpected":return h("sim_notice_boolean_expected");case"subprogramNotFound":return h("sim_notice_subprogram_not_found_fmt",i.text);case"callTooDeep":return h("sim_notice_call_too_deep");case"callArguments":return h("web_sim_call_arguments_fmt",i.text);case"missingReturn":return h("web_sim_missing_return_fmt",i.text);case"other":return i.text}}const E=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Rn=["0.2","0.5","1.0","1.5","2.0"],Y0=i=>Number(i).toLocaleString(Tt()==="java"?"en":Tt(),{minimumFractionDigits:1}),vt="visustruct.simulation.stepDelay",Un="visustruct.simulation.highlightMode";function St(i){try{return localStorage.getItem(i)}catch{return null}}function $n(i,e){try{localStorage.setItem(i,e)}catch{}}class O0{constructor(e,t,n=()=>{},s=()=>{}){I(this,"element");I(this,"engine");I(this,"isPlaying",!1);I(this,"playTimer");I(this,"wasPlayingBeforeInput",!1);I(this,"delay",Rn.includes(St(vt)??"")?St(vt):"0.5");I(this,"highlightMode",St(Un)==="nextToExecute"?"nextToExecute":"lastExecuted");I(this,"buttons");I(this,"inputSection");I(this,"trace");I(this,"variables");I(this,"output");I(this,"notice");I(this,"editButton");this.currentDocument=e,this.onHighlight=t,this.findSubprogram=n,this.onEdit=s,this.engine=new Ht(e(),n),this.element=document.createElement("aside"),this.element.className="simpanel",this.build()}begin(){this.pause(),this.restartEngine()}end(){this.pause()}step(){if(!this.engine.canStep){this.pause();return}const e=this.isPlaying,t=this.engine.currentStepPath;this.engine.step(),this.highlightMode==="nextToExecute"&&this.engine.canStep?this.onHighlight(this.engine.currentStepPath):this.onHighlight(t??this.engine.currentStepPath),this.engine.state.inputRequest&&e&&(this.wasPlayingBeforeInput=!0),this.engine.canStep||this.pause(),this.update()}reset(){this.pause(),this.restartEngine()}play(){if(this.isPlaying||!this.engine.canStep)return;this.isPlaying=!0;const e=()=>{this.playTimer=void 0,this.isPlaying&&(this.step(),this.isPlaying&&this.engine.canStep?this.playTimer=window.setTimeout(e,Number(this.delay)*1e3):(this.isPlaying=!1,this.update()))};e()}pause(){this.playTimer!==void 0&&window.clearTimeout(this.playTimer),this.playTimer=void 0,this.isPlaying=!1,this.update()}submitInput(e){const t=this.isPlaying||this.wasPlayingBeforeInput;this.pause(),this.engine.provideInput(e.value),this.engine.state.inputRequest||(e.value=""),this.onHighlight(this.engine.currentStepPath),t&&this.engine.canStep&&(this.wasPlayingBeforeInput=!1,this.play()),this.update()}restartEngine(){this.engine=new Ht(this.currentDocument(),this.findSubprogram),this.wasPlayingBeforeInput=!1,this.onHighlight(this.engine.currentStepPath),this.update()}build(){this.element.innerHTML=`
      <section>
        <h2>${E(h("simulation_controls"))}</h2>
        <div class="sim-buttons">
          <button data-sim="play">▶︎ ${E(h("simulation_play"))}</button>
          <button data-sim="pause">⏸︎ ${E(h("simulation_pause"))}</button>
          <button data-sim="step">→ ${E(h("simulation_step"))}</button>
          <button data-sim="stop">■ ${E(h("simulation_stop"))}</button>
        </div>
        <label class="sim-option">${E(h("simulation_highlight_label"))}
          <select data-sim="highlight">
            <option value="lastExecuted">${E(h("simulation_highlight_last"))}</option>
            <option value="nextToExecute">${E(h("simulation_highlight_next"))}</option>
          </select>
        </label>
        <label class="sim-option">${E(h("web_sim_delay"))}
          <select data-sim="delay">${Rn.map(s=>`<option value="${s}">${E(h("web_sim_delay_value_fmt",Y0(s)))}</option>`).join("")}</select>
        </label>
      </section>
      <p class="sim-notice" role="status"></p>
      <button class="sim-edit primary" title="${E(h("web_simulation_end_title"))}" hidden>✎ ${E(h("action_diagram"))}</button>
      <section class="sim-input"><h2>${E(h("simulation_input"))}</h2><div></div></section>
      <section><h2>${E(h("simulation_trace"))}</h2><div class="sim-trace mono" dir="ltr"></div></section>
      <section><h2>${E(h("simulation_variables"))}</h2><div class="sim-vars" dir="ltr"></div></section>
      <section><h2>${E(h("simulation_output"))}</h2><div class="sim-output mono" dir="ltr"></div></section>
    `;const e=s=>this.element.querySelector(s);this.buttons={play:e("[data-sim=play]"),pause:e("[data-sim=pause]"),step:e("[data-sim=step]"),stop:e("[data-sim=stop]")},this.buttons.play.addEventListener("click",()=>this.play()),this.buttons.pause.addEventListener("click",()=>this.pause()),this.buttons.step.addEventListener("click",()=>this.step()),this.buttons.stop.addEventListener("click",()=>this.reset()),this.editButton=e(".sim-edit"),this.editButton.addEventListener("click",()=>this.onEdit());const t=e("[data-sim=highlight]");t.value=this.highlightMode,t.addEventListener("change",()=>{this.highlightMode=t.value,$n(Un,this.highlightMode)});const n=e("[data-sim=delay]");n.value=this.delay,n.addEventListener("change",()=>{this.delay=n.value,$n(vt,this.delay)}),this.inputSection=e(".sim-input > div"),this.trace=e(".sim-trace"),this.variables=e(".sim-vars"),this.output=e(".sim-output"),this.notice=e(".sim-notice")}update(){if(!this.buttons)return;const{state:e,canStep:t}=this.engine;this.buttons.play.disabled=this.isPlaying||!t,this.buttons.pause.disabled=!this.isPlaying,this.buttons.step.disabled=this.isPlaying||!t,this.notice.textContent=e.notice?Xt(e.notice):"",this.notice.hidden=!e.notice,this.notice.classList.toggle("error",e.isHalted),this.editButton.hidden=!e.isHalted,this.updateInput(),this.trace.textContent=e.lastTrace??h("simulation_trace_placeholder"),this.trace.classList.toggle("placeholder",!e.lastTrace);const n=[...e.variables.keys()].sort((s,r)=>s.localeCompare(r));if(n.length===0)this.variables.innerHTML=`<p class="placeholder">${E(h("simulation_variables_placeholder"))}</p>`;else{const s=document.createElement("table");for(const r of n){const a=s.insertRow();a.insertCell().textContent=r;const l=e.variables.get(r),o=a.insertCell();l.kind==="grid"?o.append(K0(l)):o.textContent=F(l)}this.variables.replaceChildren(s)}e.outputLines.length===0?this.output.innerHTML=`<p class="placeholder">${E(h("simulation_output_placeholder"))}</p>`:(this.output.replaceChildren(...e.outputLines.map(s=>{const r=document.createElement("div");return r.textContent=s,r})),this.output.scrollTop=this.output.scrollHeight)}updateInput(){const e=this.engine.state.inputRequest,t=this.inputSection;if(t.parentElement.classList.toggle("active",!!e),!e){t.innerHTML=`<p class="placeholder">${E(h("simulation_input_placeholder"))}</p>`;return}let n=t.querySelector("form");if(!n){n=document.createElement("form"),n.innerHTML=`<p class="sim-prompt"></p><div class="sim-input-row"><input autocomplete="off" /><button type="submit">${E(h("simulation_input_submit"))}</button></div><p class="sim-input-error"></p>`;const l=n.querySelector("input");n.addEventListener("submit",o=>{o.preventDefault(),this.submitInput(l)}),t.replaceChildren(n),requestAnimationFrame(()=>l.focus())}n.querySelector(".sim-prompt").textContent=e.prompt;const s=n.querySelector("input");s.inputMode=e.valueType==="string"||e.valueType==="boolean"?"text":"decimal";const r=this.engine.state.inputErrorNotice,a=n.querySelector(".sim-input-error");a.textContent=r?Xt(r):"",a.hidden=!r}}function K0(i){const e=document.createElement("table");e.className="sim-grid";for(const t of i.value){const n=e.insertRow();for(const s of t){const r=n.insertCell();r.textContent=String(s),s===!0&&(r.className="sim-grid-true")}}return e}const J0="code, pre, a, button, h1, h2, h3, h4, strong, .term, .ui-pointer";function Xn(i,e){var r;const t=[...i.querySelectorAll(".learn-text")],n=new Set;for(const a of t.flatMap(l=>[...l.querySelectorAll("strong")])){const l=Nn(e),o=l==null?void 0:l.exec(a.textContent??""),u=o?Gn(e,o[0]):void 0;u&&n.add(u)}let s=e.filter(a=>!n.has(a));for(const a of t){const l=document.createTreeWalker(a,NodeFilter.SHOW_TEXT),o=[];for(;l.nextNode();){const u=l.currentNode;(r=u.parentElement)!=null&&r.closest(J0)||o.push(u)}for(let u of o)for(;;){const c=Nn(s),d=c==null?void 0:c.exec(u.data),m=d?Gn(s,d[0]):void 0;if(!d||!m)break;const p=u.splitText(d.index);u=p.splitText(d[0].length);const f=document.createElement("span");f.className="term",f.tabIndex=0,f.setAttribute("role","button"),f.setAttribute("aria-describedby","term-tip"),f.dataset.term=m.term,f.dataset.text=m.text,p.replaceWith(f),f.append(p),s=s.filter(z=>z!==m)}}}function Q0(i){const e=document.createElement("div");e.id="term-tip",e.className="term-tip",e.setAttribute("role","tooltip"),e.hidden=!0,document.body.append(e);let t,n=!1;const s=l=>{t=l,e.replaceChildren();const o=document.createElement("strong");o.textContent=l.dataset.term??"",e.append(o,document.createTextNode(" "+(l.dataset.text??""))),e.hidden=!1;const u=l.getBoundingClientRect(),c=e.offsetWidth,d=e.offsetHeight,m=Math.max(8,Math.min(u.left,window.innerWidth-c-8)),p=u.bottom+6;e.style.left=`${m}px`,e.style.top=`${p+d>window.innerHeight-8?Math.max(8,u.top-d-6):p}px`,l.setAttribute("aria-expanded","true")},r=()=>{t==null||t.setAttribute("aria-expanded","false"),t=void 0,n=!1,e.hidden=!0},a=l=>{var o,u;return((u=(o=l.target)==null?void 0:o.closest)==null?void 0:u.call(o,".term"))??void 0};return i.addEventListener("pointerover",l=>{const o=a(l);o&&l.pointerType==="mouse"&&!n&&s(o)}),i.addEventListener("pointerout",l=>{a(l)&&l.pointerType==="mouse"&&!n&&r()}),i.addEventListener("click",l=>{const o=a(l);if(o){if(n&&t===o)return r();s(o),n=!0}}),i.addEventListener("focusin",l=>{const o=a(l);o&&!n&&s(o)}),i.addEventListener("focusout",l=>{a(l)&&!n&&r()}),i.addEventListener("keydown",l=>{const o=a(l);l.key==="Escape"&&t?r():o&&(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),o.click())}),i.addEventListener("scroll",r,!0),document.addEventListener("pointerdown",l=>{t&&!a(l)&&!e.contains(l.target)&&r()}),{hide:r}}const q1={leiste:".app > .toolbar",elemente:".palette",struktogramm:".canvas",objektinspektor:".inspector",reiter:".tabs",titel:".caption",neu:"[data-action=new]",oeffnen:"[data-action=open]",speichern:"[data-action=save]",exportieren:"[data-action=export]",rueckgaengig:"[data-action=undo]",textgroesse:"[data-action=zoom]",lernen:"[data-action=learn]",code:"[data-action=code]",simulation:"[data-action=simulate]"};function Yn(i){for(const e of i.querySelectorAll('a[href^="#zeige-"]')){const t=e.getAttribute("href").slice(7);if(!(t in q1))continue;const n=document.createElement("span");n.className="ui-pointer",n.tabIndex=0,n.setAttribute("role","button"),n.dataset.target=t,n.append(...e.childNodes),e.replaceWith(n)}}function q0(i){let e,t;const n=()=>{e==null||e.classList.remove("ui-spot"),e=void 0,window.clearTimeout(t)},s=(a,l)=>{n();const o=document.querySelector(q1[a.dataset.target??""]??":not(*)");!o||o.getClientRects().length===0||(e=o,o.classList.add("ui-spot"),l&&(t=window.setTimeout(n,2500)))},r=a=>{var l,o;return((o=(l=a.target)==null?void 0:l.closest)==null?void 0:o.call(l,".ui-pointer"))??void 0};return i.addEventListener("pointerover",a=>{const l=r(a);l&&a.pointerType==="mouse"&&s(l,!1)}),i.addEventListener("pointerout",a=>{r(a)&&a.pointerType==="mouse"&&n()}),i.addEventListener("click",a=>{const l=r(a);l&&s(l,!0)}),i.addEventListener("focusin",a=>{const l=r(a);l&&s(l,!1)}),i.addEventListener("focusout",a=>{r(a)&&n()}),i.addEventListener("keydown",a=>{const l=r(a);l&&(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),s(l,!0))}),{off:n}}const eo=()=>{const i=[];for(const e of xe){const t=i.at(-1);t&&t.name===e.section?t.lessons.push(e):i.push({name:e.section,lessons:[e]})}return i};function x(i,e={},...t){const n=document.createElement(i);for(const[s,r]of Object.entries(e))n.setAttribute(s,r);return n.append(...t),n}function Y(i,e,t){const n=x(i,e);return n.innerHTML=t,n}const to=i=>h(`element_${g[i]}`);function no(i){return{caption:i,elements:[Q(g.anweisung,{textLines:["ø"]})]}}function On(i){const e=i.start?Se(i.start):void 0;return e?{...e,caption:e.caption||i.title}:no(i.title)}class io{constructor(e){I(this,"element");I(this,"tab","lessons");I(this,"returnTo");I(this,"lessonId");I(this,"taskId");I(this,"body");I(this,"tips");I(this,"pointers");this.host=e,this.element=x("aside",{class:"learn","aria-label":h("web_learn_title")}),this.tips=Q0(this.element),this.pointers=q0(this.element);const t=L.view();t&&(this.tab=["lessons","tasks","reference"].find(n=>n===t.tab)??"lessons",this.lessonId=xe.some(n=>n.id===t.lesson)?t.lesson:void 0,this.taskId=zt.some(n=>n.id===t.task)?t.task:void 0),this.render()}render(){this.tips.hide(),this.pointers.off();const e=x("div",{class:"segmented learn-tabs",role:"tablist"});for(const[t,n]of[["lessons",h("web_learn_lessons")],["tasks",h("web_learn_tasks")],["reference",h("web_learn_reference")]]){const s=x("button",{role:"tab","aria-pressed":String(this.tab===t),"data-learn-tab":t},n);s.addEventListener("click",()=>{this.tab===t&&(t==="lessons"&&(this.lessonId=void 0),t==="tasks"&&(this.taskId=void 0)),this.tab=t,this.persist(),this.render()}),e.append(s)}if(this.body=x("div",{class:"learn-body"}),this.element.replaceChildren(e,this.body),this.tab==="lessons"){const t=xe.find(n=>n.id===this.lessonId);t?this.renderLesson(t):this.renderLessonList()}else if(this.tab==="tasks"){const t=zt.find(n=>n.id===this.taskId);t?this.renderTask(t):this.renderTaskList()}else{const t=wt.map(n=>`- **${n.term}:** ${n.text}`).join(`
`);this.body.append(Y("div",{class:"learn-text learn-reference"},Ie(`${N0}

### Fachbegriffe

${t}`)))}}persist(){L.setView({tab:this.tab,lesson:this.lessonId,task:this.taskId})}openLesson(e){this.tab="lessons",this.lessonId=e,this.returnTo=void 0,this.persist(),this.render(),this.body.scrollTop=0}renderLessonList(){this.body.append(x("p",{class:"hint"},h("web_learn_intro")));for(const e of eo()){this.body.append(x("h3",{class:"learn-section"},e.name));const t=x("ol",{class:"learn-list"});for(const n of e.lessons){const s=L.lesson(n.id),r=s.done?"✓":s.step>0?h("web_learn_step_of_fmt",s.step+1,n.steps.length):"",a=x("button",{class:"learn-item"+(s.done?" done":""),"data-lesson":n.id},x("span",{class:"learn-num"},String(n.number)),x("span",{class:"learn-item-text"},x("strong",{},n.title),x("small",{},n.summary)),x("span",{class:"learn-status"},r));a.addEventListener("click",()=>this.openLesson(n.id)),t.append(x("li",{},a))}this.body.append(t)}this.body.append(this.renderTeacherBox())}renderLesson(e){var d;const t=L.lesson(e.id),n=Math.min(t.step,e.steps.length-1),s=e.steps[n],r=x("button",{class:"learn-back"},`← ${h("web_learn_all_lessons")}`);r.addEventListener("click",()=>this.openLesson(void 0));const a=x("nav",{class:"learn-progress","aria-label":h("web_learn_step_of_fmt",n+1,e.steps.length)});a.append(...e.steps.map((m,p)=>{const f=h("web_learn_step_fmt",p+1,m.title),z=x("button",{class:p<n?"past":p===n?"current":"",title:f,"aria-label":f},String(p+1));return p===n&&z.setAttribute("aria-current","step"),z.addEventListener("click",()=>this.goToStep(e,p)),z})),this.body.append(r,x("p",{class:"learn-kicker"},`${h("web_learn_lesson_fmt",e.number)} · ${e.section}`),x("h2",{class:"learn-title"},e.title),a,x("h3",{class:"learn-step-title"},`${n+1}. ${s.title}`));const l=((d=this.returnTo)==null?void 0:d.lesson)===e.id&&this.returnTo.step!==n?this.returnTo:void 0,o=()=>{const m=x("button",{class:"learn-return"},`↩ ${h("web_learn_back_to_checklist")}`);return m.addEventListener("click",()=>{this.returnTo=void 0,this.goToStep(e,l.step),this.body.scrollTop=l.scroll}),m};l&&this.body.append(o()),s.blocks.forEach((m,p)=>this.body.append(this.renderBlock(m,`${n}-${p}`,e))),Yn(this.body),Xn(this.body,wt);const u=x("div",{class:"learn-nav"}),c=x("button",{},`← ${h("web_learn_back")}`);if(c.disabled=n===0,c.addEventListener("click",()=>this.goToStep(e,n-1)),u.append(c),n<e.steps.length-1){const m=x("button",{class:"primary"},`${h("web_learn_next")} →`);m.addEventListener("click",()=>this.goToStep(e,n+1)),u.append(m)}else{const m=x("button",{class:"primary"},t.done?`✓ ${h("web_learn_done")}`:h("web_learn_finish"));m.addEventListener("click",()=>{L.updateLesson(e.id,{done:!0});const p=xe.find(f=>f.number===e.number+1);this.openLesson(p==null?void 0:p.id)}),u.append(m)}this.body.append(u),l&&this.body.append(o())}goToStep(e,t){L.updateLesson(e.id,{step:t}),this.render(),this.body.scrollTop=0}renderTaskList(){this.body.append(x("p",{class:"hint"},h("web_learn_tasks_intro")));const e=x("ul",{class:"learn-list"});for(const t of zt){const n=this.taskExercises(t).every(a=>L.exercise(a.id).done),s=xe.find(a=>a.number===t.after),r=x("button",{class:"learn-item"+(n?" done":""),"data-task":t.id},x("span",{class:"learn-num","aria-label":h("web_learn_level_fmt",t.level)},"★".repeat(t.level)),x("span",{class:"learn-item-text"},x("strong",{},t.title),x("small",{},s?h("web_learn_after_fmt",s.number,s.title):"")),x("span",{class:"learn-status"},n?"✓":""));r.addEventListener("click",()=>{this.taskId=t.id,this.persist(),this.render(),this.body.scrollTop=0}),e.append(x("li",{},r))}this.body.append(e,this.renderTeacherBox())}renderTeacherBox(){const e=x("details",{class:"learn-teacher"},x("summary",{},h("web_learn_teacher")));if(Fn()){e.setAttribute("open","");const r=x("button",{},h("web_learn_teacher_off"));return r.addEventListener("click",()=>{X0(),this.render()}),e.append(x("p",{},h("web_learn_teacher_on")),r),e}const t=x("input",{type:"password",autocomplete:"off","aria-label":h("web_learn_teacher_code"),placeholder:h("web_learn_teacher_code")}),n=x("p",{class:"learn-result",role:"status"}),s=x("form",{class:"group"},t,x("button",{type:"submit"},h("web_learn_teacher_unlock")));return s.addEventListener("submit",async r=>{r.preventDefault(),await $0(t.value)?this.render():(n.className="learn-result info",n.textContent=h("web_learn_teacher_wrong"))}),e.append(x("p",{class:"hint"},h("web_learn_teacher_intro")),s,n),e}taskExercises(e){return e.blocks.flatMap(t=>t.kind==="exercise"?[t.exercise]:[])}renderTask(e){const t=x("button",{class:"learn-back"},`← ${h("web_learn_all_tasks")}`);t.addEventListener("click",()=>{this.taskId=void 0,this.persist(),this.render()});const n=xe.find(s=>s.number===e.after);if(this.body.append(t,x("h2",{class:"learn-title"},e.title)),n){const s=x("button",{class:"link-button"},h("web_learn_after_fmt",n.number,n.title));s.addEventListener("click",()=>this.openLesson(n.id)),this.body.append(x("p",{class:"learn-kicker"},s))}e.blocks.forEach((s,r)=>this.body.append(this.renderBlock(s,`task-${r}`))),Yn(this.body),Xn(this.body,wt)}renderBlock(e,t,n){switch(e.kind){case"markdown":return Y("div",{class:"learn-text"},Ie(e.text));case"diagram":return this.renderDiagram(e.file,e.caption);case"exercise":return this.renderExercise(e.exercise);case"checklist":return this.renderChecklist(e.items,t,n);case"quiz":return this.renderQuiz(e.questions,t,n);case"brag":return this.renderBrag(e.text);case"images":return this.renderImages(e.files,e.caption);case"graphic":return this.renderGraphic(e.file,e.caption)}}renderBrag(e){const t=x("aside",{class:"learn-brag"});t.append(x("img",{src:F0,alt:"",width:"48",height:"48"}));const n=x("div",{},x("p",{class:"learn-brag-title"},h("web_learn_brag")));return n.append(Y("div",{class:"learn-text"},Ie(e))),t.append(n),t}renderImages(e,t){const n=x("figure",{class:"learn-figure"}),s=x("div",{class:"learn-images"});for(const r of e){const a=Vn(r);a&&s.append(x("img",{src:a,alt:"",loading:"lazy"}))}return n.append(s),t&&n.append(Y("figcaption",{},O(t))),n}renderGraphic(e,t){const n=x("figure",{class:"learn-figure"}),s=Vn(e);return s&&n.append(x("img",{class:"learn-graphic",src:s,alt:"",loading:"lazy"})),t&&n.append(Y("figcaption",{},O(t))),n}renderDiagram(e,t){const n=Se(e),s=x("figure",{class:"learn-figure"});if(!n)return s;const r=this.host.preview(n);r&&s.append(x("div",{class:"learn-preview",dir:"ltr"},r)),t&&s.append(Y("figcaption",{},O(t)));const a=x("button",{},h("web_learn_open_in_editor"));return a.addEventListener("click",()=>this.host.openDiagram(n,e)),s.append(a),s}renderExercise(e){const t=x("section",{class:"learn-exercise","data-exercise":e.id}),n=()=>L.exercise(e.id),s=x("span",{class:"learn-badge"},`✓ ${h("web_learn_solved")}`);s.hidden=!n().done,t.append(x("h4",{},`${h("web_learn_exercise")}: ${e.title}`,s),Y("div",{class:"learn-text"},Ie(e.task)));const r=x("div",{class:"learn-result",role:"status"}),a=x("div",{class:"learn-hints"}),l=x("div",{class:"group"}),o=x("button",{class:"primary"},h("web_learn_open_exercise"));o.addEventListener("click",()=>{const d=n().xml;let m=On(e);if(d)try{m=qt(d)}catch{}this.host.openExercise(e,m)});const u=x("button",{},h("web_learn_check"));if(u.addEventListener("click",()=>{const d=this.host.exerciseDocument(e.id);if(!d){r.className="learn-result info",r.textContent=h("web_learn_open_first");return}if(d.elements.every(Ot)){r.className="learn-result info",r.textContent=h("web_learn_empty");return}this.host.stopSimulation();const m=Os(d,e.tests,this.host.subprogramsFor(e.id)),p=Ks(d),f=e.requires.map(b=>b==="forZaehlSchleife"?"forSchleife":b).filter(b=>b in g&&!p.has(g[b])),z=m.every(b=>b.passed)&&f.length===0;this.showResult(r,m,f,z),z&&(L.updateExercise(e.id,{done:!0}),s.hidden=!1)}),l.append(o,u),e.hints.length>0){const d=x("button",{},h("web_learn_hint"));d.addEventListener("click",()=>{const m=a.children.length;if(m>=e.hints.length)return;const p=e.hints.length>1?`**${h("web_learn_hint_fmt",m+1,e.hints.length)}:** `:"";a.append(Y("aside",{class:"lesson-note"},Ie(p+e.hints[m]))),d.textContent=h("web_learn_hint_more"),d.toggleAttribute("disabled",m+1>=e.hints.length)}),l.append(d)}const c=x("button",{class:"danger-text"},h("web_learn_reset"));if(c.addEventListener("click",()=>{if(c.dataset.confirm!=="1"){c.dataset.confirm="1",c.textContent=h("web_learn_reset_confirm"),setTimeout(()=>{c.dataset.confirm="",c.textContent=h("web_learn_reset")},4e3);return}L.resetExercise(e.id),this.host.resetExercise(e.id,On(e)),s.hidden=!0,r.replaceChildren(),r.className="learn-result",c.dataset.confirm="",c.textContent=h("web_learn_reset")}),l.append(c),t.append(l,a,r),Fn()&&e.solution){const d=Se(e.solution);if(d){const m=x("details",{class:"learn-solution"},x("summary",{},h("web_learn_solution")));m.addEventListener("toggle",()=>{if(!m.open||m.querySelector(".learn-preview"))return;const p=this.host.preview(d);p&&m.append(x("div",{class:"learn-preview",dir:"ltr"},p));const f=x("button",{},h("web_learn_open_in_editor"));f.addEventListener("click",()=>{this.host.openDiagram(d,e.solution);for(const z of e.subprograms){const b=Se(z);b&&this.host.openDiagram(b,z)}});for(const z of e.subprograms){const b=Se(z),w=b&&this.host.preview(b);w&&m.append(x("div",{class:"learn-preview",dir:"ltr"},w))}m.append(f)}),t.append(m)}}return t}showResult(e,t,n,s){e.className="learn-result "+(s?"ok":"fail"),e.replaceChildren(x("p",{class:"learn-result-head"},s?`🎉 ${h("web_learn_passed")}`:h("web_learn_failed")));for(const a of n)e.append(x("p",{},`✗ ${h("web_learn_missing_fmt",to(g[a]))}`));const r=x("ul",{class:"learn-tests",dir:"auto"});for(const a of t){const l=a.test.inputs.length?h("web_learn_input_fmt",a.test.inputs.join(", ")):h("web_learn_no_input"),o=[`${a.passed?"✓":"✗"} ${l}`],u=x("div",{class:"learn-test-detail"});u.append(x("span",{},`${h("web_learn_expected")}: `,x("code",{},a.test.expected.join(" | ")||"–")),x("span",{},`${h("web_learn_actual")}: `,x("code",{},a.result.outputs.join(" | ")||"–"))),a.result.error&&u.append(x("span",{class:"learn-error"},Xt(a.result.error))),a.result.missingInput&&u.append(x("span",{class:"learn-error"},h("web_learn_missing_input"))),a.result.tooManySteps&&u.append(x("span",{class:"learn-error"},h("web_learn_too_many_steps"))),!a.passed&&a.result.unusedInputs&&u.append(x("span",{class:"learn-error"},h("web_learn_unused_input"))),r.append(x("li",{class:a.passed?"ok":"fail"},...o,u))}e.append(r)}renderChecklist(e,t,n){const s=x("ul",{class:"learn-checklist"});return e.forEach((r,a)=>{var d;const l=`${t}-${a}`,o=x("input",{type:"checkbox"});o.checked=!!(n&&((d=L.lesson(n.id).checks)!=null&&d[l])),o.addEventListener("change",()=>{if(!n)return;const m={...L.lesson(n.id).checks??{},[l]:o.checked};L.updateLesson(n.id,{checks:m})});const u=x("label",{},o);u.insertAdjacentHTML("beforeend"," "+O(r.text));const c=x("li",{},u);if(n&&r.step!==void 0){const m=r.step,p=h("web_learn_step_fmt",m+1,n.steps[m].title),f=x("button",{class:"link-button learn-check-link",title:p,"aria-label":`${h("web_learn_review")}: ${p}`},h("web_learn_review"));f.addEventListener("click",()=>{this.returnTo={lesson:n.id,step:L.lesson(n.id).step,scroll:this.body.scrollTop},this.goToStep(n,m)}),c.append(f)}s.append(c)}),s}renderQuiz(e,t,n){const s=x("div",{class:"learn-quiz"}),r=x("p",{class:"learn-score",role:"status"}),a=()=>n?L.lesson(n.id).quiz??{}:{},l=()=>{const o=a(),u=(p,f)=>p.pairs?p.pairs.every((z,b)=>o[`${t}-${f}-${b}`]!==void 0):o[`${t}-${f}`]!==void 0,c=(p,f)=>{var z;return p.pairs?p.pairs.every((b,w)=>Kn(p)[o[`${t}-${f}-${w}`]]===p.pairs[w].right):(z=p.options[o[`${t}-${f}`]])==null?void 0:z.correct},d=e.filter(u).length,m=e.filter(c).length;r.textContent=d===e.length?h("web_learn_score_fmt",m,e.length):""};return e.forEach((o,u)=>{const c=`${t}-${u}`,d=x("fieldset",{},Y("legend",{},O(o.question))),m=Y("p",{class:"learn-explanation"},O(o.explanation??""));if(o.pairs){d.append(this.renderMatch(o,c,a,n,m,l),m),s.append(d);return}const p=f=>{d.querySelectorAll("button").forEach((z,b)=>{z.classList.toggle("right",f!==void 0&&o.options[b].correct),z.classList.toggle("wrong",f===b&&!o.options[b].correct),z.setAttribute("aria-pressed",String(f===b))}),m.hidden=f===void 0||!o.explanation};o.options.forEach((f,z)=>{const b=Y("button",{class:"learn-option"},O(f.text));b.addEventListener("click",()=>{n&&L.updateLesson(n.id,{quiz:{...a(),[c]:z}}),p(z),l()}),d.append(b)}),d.append(m),p(a()[c]),s.append(d)}),s.append(r),l(),s}renderMatch(e,t,n,s,r,a){const l=e.pairs,o=Kn(e),u=x("div",{class:"learn-match"});let c={};const d=()=>s?n():c,m=b=>s?L.updateLesson(s.id,{quiz:b}):c=b,p=b=>d()[`${t}-${b}`],f=l.map(b=>{const w=x("select",{class:"learn-match-select"});w.append(x("option",{value:""},"–")),o.forEach((M,D)=>w.append(x("option",{value:String(D)},M)));const v=Y("label",{class:"learn-match-left"},O(b.left));return v.append(w),u.append(v),w}),z=()=>{const b=l.every((w,v)=>p(v)!==void 0);f.forEach((w,v)=>{const M=p(v);w.value=M===void 0?"":String(M),w.classList.toggle("right",b&&o[M]===l[v].right),w.classList.toggle("wrong",b&&o[M]!==l[v].right)}),r.hidden=!b||!e.explanation};return f.forEach((b,w)=>b.addEventListener("change",()=>{const v={...d()};b.value===""?delete v[`${t}-${w}`]:v[`${t}-${w}`]=Number(b.value),m(v),z(),a()})),z(),u}}function Kn(i){return(i.pairs??[]).map(e=>e.right).sort((e,t)=>e.localeCompare(t,"de"))}const so={left:12,top:10},ro=8,it=8e3,De=16,kt=12,ei="#fafafa";function ti(i){const e=i.caption.trim();return e===""?h("diagram_title_placeholder"):e}function Jn(i){let e=i.trim().replace(/\.visustruct$/i,"");if(e==="")return"";for(e=e.replace(/\s/g,"-").replace(/[/:\\*?"<>|]/g,"-");e.includes("--");)e=e.replace(/--/g,"-");return e=e.replace(/^-+|-+$/g,""),e.length>120&&(e=e.slice(0,120).replace(/^-+|-+$/g,"")),e}function ao(i,e){return Jn(i.caption)||Jn(e)||"VisuStruct"}function lo(i,e,t){const n=i.split(/\s+/),s=[];let r="";for(const a of n){const l=r?`${r} ${a}`:a;r&&t(l,De,"bold")>e?(s.push(r),r=a):r=l}if(r&&s.push(r),s.length>2){let a=s.slice(1).join(" ");for(;a.length>1&&t(a+"…",De,"bold")>e;)a=a.slice(0,-1);return[s[0],a+"…"]}return s}function Qn(i,e,t,n=320){const s={...i,elements:i.elements.map(Je)},r=new I1(e,t).layout(s,so),a=Math.min(it,Math.max(n,r.canvasSize.width)),l=Math.min(it,Math.max(n,r.canvasSize.height));if(a<=2||l<=2)return;const o=lo(ti(i),a-2*kt,t),u=Math.ceil(De*1.2),c=Math.min(56,o.length*u+2),d=c+l,m=new y1(e,t).render(r,{width:a,height:l},void 0,ro);m.setAttribute("y",String(c)),m.removeAttribute("class");const p=P("svg",{xmlns:"http://www.w3.org/2000/svg",width:a,height:d,viewBox:`0 0 ${a} ${d}`});p.append(P("rect",{x:0,y:0,width:a,height:d,fill:ei}));const f=P("text",{x:kt,y:0,"font-family":st,"font-size":De,"font-weight":600,fill:"black"});return o.forEach((z,b)=>{const w=P("tspan",{x:kt,y:b*u+De});w.textContent=z,f.append(w)}),p.append(f,m),{svg:p,width:a,height:d}}function ni(i){return`<?xml version="1.0" encoding="UTF-8"?>
`+new XMLSerializer().serializeToString(i.svg)}async function qn(i,e){const t=Math.max(1,Math.min(e,it/i.width,it/i.height)),n=URL.createObjectURL(new Blob([ni(i)],{type:"image/svg+xml"}));try{const s=new Image;s.src=n,await s.decode();const r=document.createElement("canvas");r.width=Math.round(i.width*t),r.height=Math.round(i.height*t);const a=r.getContext("2d");return a.fillStyle=ei,a.fillRect(0,0,r.width,r.height),a.drawImage(s,0,0,r.width,r.height),r}finally{URL.revokeObjectURL(n)}}function oo(i){return new Promise((e,t)=>i.toBlob(n=>n?e(n):t(new Error("PNG konnte nicht erzeugt werden.")),"image/png"))}function uo(i,e){const s=Math.max(1,i),r=Math.max(1,e),a=z=>{const b=z.width-64,w=z.height-64;return{s:Math.min(b/s,w/r)*.98,cw:b,ch:w}},l={width:595,height:842},o={width:842,height:595},u=a(l),c=a(o),[d,m]=c.s>u.s?[o,c]:[l,u],p=s*m.s,f=r*m.s;return{page:d,draw:{x:32+(m.cw-p)/2,y:32+(m.ch-f)/2,width:p,height:f}}}async function co(i){const e=new Blob([i]).stream().pipeThrough(new CompressionStream("deflate"));return new Uint8Array(await new Response(e).arrayBuffer())}function e1(i){let e="FEFF";for(let t=0;t<i.length;t++)e+=i.charCodeAt(t).toString(16).padStart(4,"0").toUpperCase();return`<${e}>`}async function ho(i,e,t,n,s){const{page:r,draw:a}=uo(n.width,n.height),l=await co(i),o=w=>(Math.round(w*100)/100).toString(),u=`q ${o(a.width)} 0 0 ${o(a.height)} ${o(a.x)} ${o(r.height-a.y-a.height)} cm /Im0 Do Q`,c=new TextEncoder,d=[["<< /Type /Catalog /Pages 2 0 R >>"],["<< /Type /Pages /Kids [3 0 R] /Count 1 >>"],[`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${r.width} ${r.height}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`],[`<< /Type /XObject /Subtype /Image /Width ${e} /Height ${t} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${l.length} >>
stream
`,l,`
endstream`],[`<< /Length ${u.length} >>
stream
${u}
endstream`],[`<< /Creator ${e1("VisuStruct")} /Title ${e1(s)} >>`]],m=[];let p=0;const f=w=>{const v=typeof w=="string"?c.encode(w):w;m.push(v),p+=v.length};f(`%PDF-1.4
%âãÏÓ
`);const z=[];d.forEach((w,v)=>{z.push(p),f(`${v+1} 0 obj
`),w.forEach(f),f(`
endobj
`)});const b=p;f(`xref
0 ${d.length+1}
0000000000 65535 f 
`);for(const w of z)f(`${String(w).padStart(10,"0")} 00000 n 
`);return f(`trailer
<< /Size ${d.length+1} /Root 1 0 R /Info ${d.length} 0 R >>
startxref
${b}
%%EOF
`),new Blob(m,{type:"application/pdf"})}function mo(i){const{data:e}=i.getContext("2d").getImageData(0,0,i.width,i.height),t=new Uint8Array(i.width*i.height*3);for(let n=0,s=0;n<e.length;n+=4,s+=3)t[s]=e[n],t[s+1]=e[n+1],t[s+2]=e[n+2];return t}const t1=()=>[{description:h("web_file_type"),accept:{"application/xml":[".visustruct",".strk"]}}],_t=i=>h(`element_${g[i]}`),go={[g.verzweigung]:"age >= 18",[g.whileSchleife]:"i < 10",[g.doUntilSchleife]:"again == 1",[g.fallauswahl]:"day"},po={statement:'int number = 5  |  double x = 1.5  |  String text = "Your text"  |  boolean ok = true  |  const double PI = 3.14',input:'input: int age "Enter age"  |  input: double price "Enter price"  |  input: String name "Enter name"',output:'output: number  |  output: "Your text"  |  output: "Your age: " + age'};function n1(i){switch(i.type){case g.anweisung:{const e=Oe(i.textLines.join(`
`));return e==="input"?"input:":e==="output"?"output:":void 0}case g.verzweigung:return"if";case g.whileSchleife:case g.doUntilSchleife:return"while";case g.fallauswahl:return"switch";default:return}}function fo(i){switch(i.type){case g.anweisung:{const e=Oe(i.textLines.join(`
`));return e==="input"?'int age "Enter age"':e==="output"?'"Your age: " + age':h("inspector_placeholder_statement")}case g.verzweigung:case g.whileSchleife:case g.doUntilSchleife:case g.endlosschleife:return h("inspector_placeholder_condition");case g.fallauswahl:return h("inspector_placeholder_selector");case g.aufruf:return h("inspector_placeholder_call");case g.aussprung:return h("inspector_placeholder_break");default:return""}}function C(i,e={},...t){const n=document.createElement(i);for(const[s,r]of Object.entries(e))n.setAttribute(s,r);return n.append(...t),n}const i1=[{value:1,label:"settings_ui_scale_small"},{value:1.22,label:"settings_ui_scale_medium"},{value:1.5,label:"settings_ui_scale_large"},{value:1.82,label:"settings_ui_scale_extra_large"}],bo=/Mac|iPhone|iPad/.test(navigator.platform);function ue(i,e=!1){return bo?`${e?"⇧":""}⌘${i}`:[h("web_key_ctrl"),...e?[h("web_key_shift")]:[],i].join("+")}const k=zo,s1="visustruct.ui.scale.canvas",r1="visustruct.learn.open",a1="visustruct.learn.width",xo=80;class Io{constructor(e){I(this,"tabs",[]);I(this,"tabIndex",0);I(this,"nextTabSerial",1);I(this,"clipboard");I(this,"zoom",1);I(this,"simulating",!1);I(this,"exportSelect");I(this,"learn");I(this,"shell");I(this,"learning",!1);I(this,"learnButton");I(this,"exerciseSaveTimer");I(this,"resizeObserver");I(this,"renderedHostSize",{width:-1,height:-1});I(this,"simPath");I(this,"sim");I(this,"simButton");I(this,"coding",!1);I(this,"code");I(this,"codeButton");I(this,"measure",Mi());I(this,"metrics",Ai());I(this,"engine",new I1(this.metrics,this.measure));I(this,"renderer",new y1(this.metrics,this.measure));I(this,"layout");I(this,"flat",[]);I(this,"canvasHost");I(this,"svg");I(this,"overlay");I(this,"inspector");I(this,"captionInput");I(this,"undoButton");I(this,"redoButton");I(this,"deleteButton");I(this,"statusLine");I(this,"drag");I(this,"downloads",null);I(this,"inViewer","claude"in window);I(this,"tabStrip");this.root=e,this.tabs.push(this.makeTab()),this.learn=new io(this.learnHost()),this.shell=document.createElement("div"),this.shell.className="shell",e.replaceWith(this.shell),this.shell.append(this.learn.element,this.learnResizer(),e);const t=Dt(r1),n=new URLSearchParams(location.search).has("learn");this.setLearning(n||(t===null?window.innerWidth>1100:t==="1"),!1);const s=Number(Dt(s1));i1.some(a=>a.value===s)&&(this.zoom=s),this.buildUI(),this.render(),window.addEventListener("pointermove",a=>this.onPointerMove(a)),window.addEventListener("pointerup",a=>this.onPointerUp(a)),window.addEventListener("pointercancel",()=>this.endDrag()),window.addEventListener("keydown",a=>this.onKeyDown(a)),window.addEventListener("beforeunload",a=>{this.tabs.some(l=>l.dirty&&!l.exerciseId)&&a.preventDefault()}),this.setupFileDrop();const r=window.claude;r==null||r.use("downloads").then(a=>this.downloads=a)}get tab(){return this.tabs[this.tabIndex]}get doc(){return this.tab.doc}set doc(e){this.tab.doc=e}get fileName(){return this.tab.fileName??`${fe(this.tab)}.visustruct`}get fileHandle(){return this.tab.fileHandle}set fileHandle(e){this.tab.fileHandle=e}get dirty(){return this.tab.dirty}set dirty(e){this.tab.dirty=e}get undoStack(){return this.tab.undoStack}get redoStack(){return this.tab.redoStack}get selected(){return this.tab.selected}set selected(e){this.tab.selected=e}buildUI(){var l;this.root.className="app",this.root.innerHTML=`
      <header class="toolbar">
        <div class="brand"><span class="logo"></span>VisuStruct <small>${k(h("web_brand_suffix"))}</small></div>
        <div class="group">
          <button data-action="new" title="${k(h("a11y_new_diagram_tab"))}">${k(h("toolbar_new"))}</button>
          <button data-action="open" title="${k(h("menu_open"))} (${ue("O")})">${k(h("menu_open"))}</button>
          <button data-action="save" title="${k(h("menu_save"))} (${ue("S")})">${k(h("menu_save"))}</button>
          <select data-action="export" title="${k(h("web_export_title"))}">
            <option value="">${k(h("web_export"))}</option>
            <option value="png">${k(h("web_export_png"))}</option>
            <option value="svg">${k(h("web_export_svg"))}</option>
            <option value="pdf">${k(h("web_export_pdf"))}</option>
            <option value="print">${k(h("menu_print"))} (${ue("P")})</option>
          </select>
        </div>
        <div class="group">
          <button data-action="undo" title="${k(h("toolbar_undo"))} (${ue("Z")})" aria-label="${k(h("toolbar_undo"))}">↶</button>
          <button data-action="redo" title="${k(h("toolbar_redo"))} (${ue("Z",!0)})" aria-label="${k(h("toolbar_redo"))}">↷</button>
          <button data-action="cut" title="${k(h("ctx_cut"))} (${ue("X")})" aria-label="${k(h("ctx_cut"))}">✂︎</button>
          <button data-action="copy" title="${k(h("ctx_copy"))} (${ue("C")})" aria-label="${k(h("ctx_copy"))}">⧉</button>
          <button data-action="paste" title="${k(h("ctx_paste"))} (${ue("V")})" aria-label="${k(h("ctx_paste"))}">📋︎</button>
          <button data-action="delete" title="${k(h("action_delete_selection"))} (${k(h("web_key_delete"))})">${k(h("web_delete"))}</button>
        </div>
        <div class="group">
          <select data-action="zoom" title="${k(h("settings_ui_scale_section"))}">${i1.map(o=>`<option value="${o.value}">${k(h("web_zoom_option_fmt",h(o.label)))}</option>`).join("")}</select>
          <select data-action="language" title="${k(h("web_language_title"))}" aria-label="${k(h("web_language_title"))}">${$e.map(o=>`<option value="${o.code}" lang="${o.code==="java"?"en":o.code}">${k(o.name)}</option>`).join("")}</select>
        </div>
        <div class="group">
          <button data-action="learn" aria-pressed="false" title="${k(h("web_learn_toggle_title"))}">🎓 ${k(h("web_learn_title"))}</button>
          <button data-action="code" aria-pressed="false" title="${k(h("a11y_generate_code"))}">{ } Code</button>
          <button data-action="simulate" class="sim-toggle" aria-pressed="false" title="${k(h("web_simulation_start_title"))}">▶︎ ${k(h("action_simulation"))}</button>
        </div>
      </header>
      <aside class="palette">
        <h2>${k(h("palette_header"))}</h2>
        <p class="hint">${k(h("web_palette_hint"))}</p>
        <ul></ul>
      </aside>
      <main class="workspace">
        <nav class="tabs" aria-label="${k(h("web_tabs_label"))}"></nav>
        <input class="caption" placeholder="${k(h("diagram_title_placeholder"))}" aria-label="${k(h("diagram_title_label"))}" />
        <div class="canvas" dir="ltr"></div>
      </main>
      <aside class="inspector"></aside>
      <footer class="status"></footer>
      <input type="file" accept=".visustruct,.strk,.xml" hidden />
    `;const e=o=>this.root.querySelector(o);this.canvasHost=e(".canvas"),this.inspector=e(".inspector"),this.captionInput=e(".caption"),this.undoButton=e("[data-action=undo]"),this.redoButton=e("[data-action=redo]"),this.deleteButton=e("[data-action=delete]"),this.statusLine=e(".status"),this.simButton=e("[data-action=simulate]"),this.sim=new O0(()=>this.doc,o=>{this.simPath=o,this.simulating&&this.renderDiagramOnly(),this.scrollToSimPath()},o=>this.findSubprogram(o),()=>this.setSimulating(!1)),this.root.append(this.sim.element),this.simButton.addEventListener("click",()=>this.setSimulating(!this.simulating)),this.codeButton=e("[data-action=code]"),this.code=new Us(()=>this.doc,(o,u)=>this.offerDownload(o,new Blob([u],{type:"text/plain"})),()=>this.setCoding(!1),o=>this.commit({...this.doc,pseudocode:o||void 0}),()=>this.tabs.filter(o=>o!==this.tab&&he(o.doc.caption)).map(o=>o.doc)),this.root.append(this.code.element),this.codeButton.addEventListener("click",()=>this.setCoding(!this.coding));const t=e(".palette ul");for(const{item:o}of xn){const u=_t(He(o).type),c=document.createElement("li");c.className="palette-item",c.dataset.item=o,c.append(this.paletteIcon(o),document.createTextNode(u)),c.addEventListener("pointerdown",d=>this.beginDrag(d,{kind:"palette",item:o})),c.tabIndex=0,c.addEventListener("keydown",d=>{(d.key==="Enter"||d.key===" ")&&this.insertNearSelection(He(o))}),t.append(c)}this.learnButton=e("[data-action=learn]"),this.learnButton.addEventListener("click",()=>this.setLearning(!this.learning)),this.learnButton.setAttribute("aria-pressed",String(this.learning)),this.tabStrip=e(".tabs"),this.exportSelect=e("[data-action=export]"),this.exportSelect.addEventListener("change",()=>{const o=this.exportSelect.value;this.exportSelect.value="",o&&this.exportDiagram(o)});const n=e("[data-action=language]");n.value=Tt(),n.addEventListener("change",()=>void this.changeLanguage(n.value));const s=e("[data-action=zoom]");s.value=String(this.zoom),s.addEventListener("change",()=>{this.zoom=Number(s.value),Mt(s1,s.value),this.renderDiagramOnly()}),e("[data-action=cut]").addEventListener("click",()=>this.cutSelection()),e("[data-action=copy]").addEventListener("click",()=>this.copySelection()),e("[data-action=paste]").addEventListener("click",()=>this.paste());const r=e("input[type=file]");r.addEventListener("change",async()=>{var u;const o=(u=r.files)==null?void 0:u[0];r.value="",o&&this.loadXML(await o.text(),o.name)}),e("[data-action=new]").addEventListener("click",()=>this.addTab()),e("[data-action=open]").addEventListener("click",()=>this.open(r)),e("[data-action=save]").addEventListener("click",()=>this.save()),this.undoButton.addEventListener("click",()=>this.undo()),this.redoButton.addEventListener("click",()=>this.redo()),this.deleteButton.addEventListener("click",()=>this.deleteSelection());let a;this.captionInput.addEventListener("focus",()=>a=this.doc),this.captionInput.addEventListener("input",()=>{this.doc={...this.doc,caption:this.captionInput.value},this.dirty=!0,this.updateStatus()}),this.captionInput.addEventListener("change",()=>{a&&a.caption!==this.doc.caption&&this.pushUndo(a),a=this.doc}),this.canvasHost.addEventListener("pointerdown",o=>this.onCanvasPointerDown(o)),(l=this.resizeObserver)==null||l.disconnect(),this.resizeObserver=new ResizeObserver(()=>{const{clientWidth:o,clientHeight:u}=this.canvasHost;o===this.renderedHostSize.width&&u===this.renderedHostSize.height||this.renderDiagramOnly()}),this.resizeObserver.observe(this.canvasHost)}async changeLanguage(e){this.setSimulating(!1),this.setCoding(!1),await _1(e),ii(),this.sim.end(),this.buildUI(),this.render(),this.learn.render()}setLearning(e,t=!0){var n;this.learning=e,this.shell.classList.toggle("learning",e),(n=this.learnButton)==null||n.setAttribute("aria-pressed",String(e)),t&&Mt(r1,e?"1":"0"),this.canvasHost&&this.renderDiagramOnly()}learnHost(){return{openExercise:(e,t)=>{const n=this.tabs.findIndex(r=>r.exerciseId===e.id);if(n>=0){this.switchTab(n),this.setSimulating(!1);return}const s=this.makeTab();s.doc=t,s.exerciseId=e.id,s.selected=t.elements.length>0?[0]:void 0,this.isPristine(this.tab)?this.tabs[this.tabIndex]=s:this.tabs.push(s),this.tabIndex=this.tabs.indexOf(s),this.setSimulating(!1),this.render()},openDiagram:(e,t)=>{this.loadXML(pt(e),e.caption.trim()?`${e.caption.trim()}.visustruct`:t)},exerciseDocument:e=>{var t;return(t=this.tabs.find(n=>n.exerciseId===e))==null?void 0:t.doc},subprogramsFor:e=>{const t=this.tabs.find(n=>n.exerciseId===e);return n=>this.findSubprogram(n,t)},stopSimulation:()=>this.setSimulating(!1),resetExercise:(e,t)=>{const n=this.tabs.find(s=>s.exerciseId===e);n&&(n.undoStack.push(n.doc),n.doc=t,n.redoStack=[],n.selected=[0],n===this.tab&&this.render())},preview:e=>{const t=Qn(e,this.metrics,this.measure,0);if(!t)return;const n=t.svg.getAttribute("width");return n&&(t.svg.style.maxWidth=`${n}px`),t.svg.removeAttribute("width"),t.svg.removeAttribute("height"),t.svg}}}isPristine(e){return!e.dirty&&!e.fileName&&!e.exerciseId&&e.undoStack.length===0}rememberExercise(){const e=this.tab;e.exerciseId&&(clearTimeout(this.exerciseSaveTimer),this.exerciseSaveTimer=window.setTimeout(()=>{e.exerciseId&&L.updateExercise(e.exerciseId,{xml:pt(e.doc)})},300))}paletteIcon(e){const t=P("svg",{viewBox:"0 0 28 20",width:28,height:20,class:"icon"}),n={fill:"none",stroke:"currentColor","stroke-width":1.5};t.append(P("rect",{x:1,y:1,width:26,height:18,...n}));const s=r=>t.append(P("path",{d:r,...n}));switch(e){case"verzweigung":s("M1 1 L14 10 L27 1 M14 10 V19");break;case"fallauswahl":s("M1 1 L20 10 L27 1 M1 10 H27 M10 10 V19 M20 10 V19");break;case"forZaehlSchleife":case"whileSchleife":s("M7 7 H27 M7 7 V19");break;case"doUntilSchleife":s("M7 1 V13 H27");break;case"endlosschleife":s("M7 6 H27 M7 6 V14 H27");break;case"aufruf":s("M5 1 V19 M23 1 V19");break;case"aussprung":s("M6 1 L1 10 L6 19");break}return t}render(){const e={...this.doc,elements:this.doc.elements.map(Je)};this.layout=this.engine.layout(e),this.flat=Ti(this.layout.elements),this.selected&&!q(this.doc,this.selected)&&(this.selected=void 0);const t=this.zoom,n=this.canvasHost;this.renderedHostSize={width:n.clientWidth,height:n.clientHeight};const s={width:Math.max(320,this.layout.canvasSize.width,Math.floor(n.clientWidth/t)),height:Math.max(240,this.layout.canvasSize.height+60,Math.floor(n.clientHeight/t))};this.renderer.usesSimulationHighlight=this.simulating,this.svg=this.renderer.render(this.layout,s,this.simulating?this.simPath:this.selected),this.svg.setAttribute("width",String(Math.floor(s.width*t))),this.svg.setAttribute("height",String(Math.floor(s.height*t))),this.overlay=P("g",{class:"drop-overlay"}),this.svg.append(this.overlay),this.canvasHost.replaceChildren(this.svg),document.activeElement!==this.captionInput&&(this.captionInput.value=this.doc.caption),this.undoButton.disabled=this.simulating||this.undoStack.length===0,this.redoButton.disabled=this.simulating||this.redoStack.length===0,this.deleteButton.disabled=this.simulating||!this.selected||!mt(this.doc,this.selected),this.captionInput.readOnly=this.simulating,this.codeButton.disabled=this.simulating,this.exportSelect.disabled=this.simulating,this.coding&&this.code.refresh(),this.renderTabs(),this.renderInspector(),this.updateStatus()}updateStatus(){this.rememberExercise(),document.title=`${this.dirty?"• ":""}${this.fileName} – VisuStruct Web`,this.statusLine.textContent=`${this.fileName}${this.dirty?` (${h("web_status_modified")})`:""}`}renderInspector(){const e=this.selected,t=e?q(this.doc,e):void 0,n=this.inspector;if(!e||!t){n.replaceChildren(C("h2",{},h("web_inspector_title")),C("p",{class:"hint"},h("inspector_no_selection")),C("p",{class:"hint"},h("web_inspector_help_drop")),C("p",{class:"hint"},h("web_inspector_help_files")));return}if(n.replaceChildren(C("h2",{},`${h("web_inspector_title")} · ${_t(t.type)}`)),t.type===g.anweisung){const s=Oe(t.textLines.join(`
`)),r=C("div",{class:"segmented",role:"group","aria-label":h("inspector_io_mode_title")});for(const[a,l]of[["statement",h("inspector_io_mode_statement")],["input",h("inspector_io_mode_input")],["output",h("inspector_io_mode_output")]]){const o=C("button",{"aria-pressed":String(a===s)},l);o.addEventListener("click",()=>{var d,m;const u=((d=q(this.doc,e))==null?void 0:d.textLines.join(`
`))??"";if(a===Oe(u))return;const c=vi(a,u);this.commit(ht(this.doc,e,c.split(`
`))),(m=this.inspector.querySelector("textarea"))==null||m.focus()}),r.append(o)}n.append(r,C("p",{class:"hint mono-hint"},po[s]))}if(t.type===g.forSchleife){const s=C("div",{class:"for-fields"}),r=pn(t.textLines);[[h("inspector_for_init"),h("inspector_for_placeholder_init")],[h("inspector_for_condition"),h("inspector_for_placeholder_condition")],[h("inspector_for_step"),h("inspector_for_placeholder_step")]].forEach(([l,o],u)=>{const c=C("input",{placeholder:o,spellcheck:"false",autocomplete:"off"});c.value=r[u],this.liveEdit(c,d=>{const m=q(this.doc,e);if(!m)return;const p=pn(m.textLines);return p[u]=_i(d),ht(this.doc,e,p)}),s.append(C("label",{},l,c))}),n.append(s)}else if(t.type!==g.leerElement){const s=go[t.type];s&&n.append(C("p",{class:"hint mono-hint"},s));const r=n1(t),a=C("textarea",{rows:"3",spellcheck:"false"}),l=t.textLines.join(`
`);a.value=r?gn(r,l):l,a.placeholder=fo(t),a.addEventListener("focus",()=>{a.value.trim()==="ø"&&a.select()}),this.liveEdit(a,u=>{const c=n1(q(this.doc,e)??t),d=c?ki(c,gn(c,u)):u;return ht(this.doc,e,d.split(`
`))});const o=C("div",{class:"editor-row"});r&&o.append(C("span",{class:"fixed-prefix"},r)),o.append(a),n.append(o)}this.renderCaseControls(e)}renderCaseControls(e){var o;const t=zi(e,this.doc);if(!t)return;const n=((o=q(this.doc,t))==null?void 0:o.cases)??[],s=wi(e,t),r=C("div",{class:"case-controls"});if(s!==void 0&&n[s]){const u=C("input",{placeholder:h("web_case_name_placeholder"),spellcheck:"false",autocomplete:"off"});u.value=n[s].name,this.liveEdit(u,c=>c.trim()===""?void 0:Ii(this.doc,t,s,c)),r.append(C("label",{},h("web_case_name"),u))}const a=C("button",{},`＋ ${h("inspector_add_case")}`);a.addEventListener("click",()=>{const u=bi(this.doc,t);this.commit(u.doc,u.path)});const l=C("button",{class:"danger-text"},`－ ${h("inspector_remove_case")}`);l.disabled=n.length<=2||s===void 0,l.addEventListener("click",()=>{if(s===void 0)return;const u=xi(this.doc,t,s);this.commit(u.doc,u.path)}),r.append(C("div",{class:"group"},a,l)),this.inspector.append(r)}liveEdit(e,t){let n;e.addEventListener("focus",()=>n=this.doc),e.addEventListener("input",()=>{const s=g1(e.value);if(s!==e.value){const a=e.selectionStart;e.value=s,e.setSelectionRange(a,a)}const r=t(s);r&&(this.doc=r,this.dirty=!0,this.renderDiagramOnly())}),e.addEventListener("blur",()=>{n&&n!==this.doc&&this.pushUndo(n),n=void 0,this.renderDiagramOnly()})}renderDiagramOnly(){const e=this.selected,t=this.inspector,n=document.createElement("aside");this.inspector=n,this.render(),this.inspector=t,this.selected=e}setSimulating(e){e!==this.simulating&&(document.activeElement instanceof HTMLElement&&document.activeElement.blur(),this.endDrag(),this.simulating=e,this.root.classList.toggle("simulating",e),this.simButton.setAttribute("aria-pressed",String(e)),this.simButton.textContent=e?`✎ ${h("action_diagram")}`:`▶︎ ${h("action_simulation")}`,this.simButton.title=h(e?"web_simulation_end_title":"web_simulation_start_title"),e?(this.setCoding(!1),this.sim.begin()):(this.sim.end(),this.simPath=void 0,!this.selected&&this.doc.elements.length>0&&(this.selected=[0])),this.render())}setCoding(e){e!==this.coding&&(this.coding=e,this.root.classList.toggle("coding",e),this.codeButton.setAttribute("aria-pressed",String(e)),e?this.code.refresh():this.code.close(),this.renderDiagramOnly())}learnResizer(){const e=this.learn.element,t=C("div",{class:"learn-resizer",role:"separator","aria-orientation":"vertical",tabindex:"0",title:h("web_learn_resize")}),n=(a,l)=>{e.style.width=a===void 0?"":`${l1(a)}px`,l&&Mt(a1,a===void 0?"":String(l1(a)))},s=Number(Dt(a1));s>0&&n(s,!1);const r=()=>getComputedStyle(this.shell).direction==="rtl"?-1:1;return t.addEventListener("pointerdown",a=>{if(a.button!==0)return;a.preventDefault(),t.setPointerCapture(a.pointerId);const l=a.clientX,o=e.getBoundingClientRect().width,u=r();this.shell.classList.add("resizing");const c=m=>n(o+u*(m.clientX-l),!1),d=m=>{t.removeEventListener("pointermove",c),t.removeEventListener("pointerup",d),t.removeEventListener("pointercancel",d),this.shell.classList.remove("resizing"),n(o+u*(m.clientX-l),!0)};t.addEventListener("pointermove",c),t.addEventListener("pointerup",d),t.addEventListener("pointercancel",d)}),t.addEventListener("dblclick",()=>n(void 0,!0)),t.addEventListener("keydown",a=>{const l=a.key==="ArrowRight"?20:a.key==="ArrowLeft"?-20:0;l&&(a.preventDefault(),n(e.getBoundingClientRect().width+r()*l,!0))}),t}findSubprogram(e,t=this.tab){const n=Zt(e);if(n==="")return;const s=this.tabs.find(r=>r!==t&&(Zt(r.doc.caption)===n||Zt(fe(r))===n));return s==null?void 0:s.doc}scrollToSimPath(){const e=this.simPath;if(!this.simulating||!e)return;const t=this.flat.find(l=>Ct(l.idPath,e));if(!t)return;const n=this.canvasHost,s=this.zoom,r={x:t.frame.x*s,y:t.frame.y*s,width:t.frame.width*s,height:t.frame.height*s},a=24;r.y<n.scrollTop?n.scrollTop=Math.max(0,r.y-a):r.y+Math.min(r.height,n.clientHeight-2*a)>n.scrollTop+n.clientHeight&&(n.scrollTop=r.y-a),(r.x<n.scrollLeft||r.x>n.scrollLeft+n.clientWidth-a)&&(n.scrollLeft=Math.max(0,r.x-a))}commit(e,t){this.pushUndo(this.doc),this.doc=e,this.dirty=!0,t&&(this.selected=t),this.render()}pushUndo(e){for(this.undoStack.push(e);this.undoStack.length>xo;)this.undoStack.shift();this.tab.redoStack=[]}undo(){const e=this.undoStack.pop();e&&(this.redoStack.push(this.doc),this.doc=e,this.dirty=!0,this.selected=dn(this.selected,this.doc),this.render())}redo(){const e=this.redoStack.pop();e&&(this.undoStack.push(this.doc),this.doc=e,this.dirty=!0,this.selected=dn(this.selected,this.doc),this.render())}resetHistory(){this.setSimulating(!1),this.tab.undoStack=[],this.tab.redoStack=[],this.selected=void 0,this.dirty=!1,this.render()}makeTab(){return{doc:mi(),serial:this.nextTabSerial++,dirty:!1,undoStack:[],redoStack:[],selected:[0]}}addTab(e=this.makeTab()){this.setSimulating(!1),this.tabs.push(e),this.tabIndex=this.tabs.length-1,this.render()}switchTab(e){e===this.tabIndex||!this.tabs[e]||(document.activeElement instanceof HTMLElement&&document.activeElement.blur(),this.setSimulating(!1),this.tabIndex=e,this.render())}async closeTab(e){if(this.tabs.length<=1)return;const t=this.tabs[e];t.dirty&&!t.exerciseId&&(this.switchTab(e),!await this.confirmDiscard())||(this.setSimulating(!1),this.tabs.splice(e,1),(this.tabIndex>e||this.tabIndex>=this.tabs.length)&&(this.tabIndex=Math.max(0,this.tabIndex-1)),this.render())}renderTabs(){const e=this.tabStrip;e.replaceChildren(),this.tabs.forEach((n,s)=>{const r=document.createElement("div");r.className="tab"+(s===this.tabIndex?" active":""),r.setAttribute("role","tab"),r.setAttribute("aria-selected",String(s===this.tabIndex));const a=document.createElement("button");if(a.className="tab-label",a.textContent=(n.dirty?"• ":"")+fe(n),a.title=n.fileName??fe(n),a.addEventListener("click",()=>this.switchTab(s)),r.append(a),this.tabs.length>1){const l=document.createElement("button");l.className="tab-close",l.textContent="✕",l.title=h("a11y_close_tab"),l.setAttribute("aria-label",`${h("a11y_close_tab")}: ${fe(n)}`),l.addEventListener("click",()=>this.closeTab(s)),r.append(l)}e.append(r)});const t=document.createElement("button");t.className="tab-add",t.textContent="+",t.title=h("a11y_new_diagram_tab"),t.setAttribute("aria-label",h("a11y_new_diagram_tab")),t.addEventListener("click",()=>this.addTab()),e.append(t)}copySelection(){const e=this.selected&&q(this.doc,this.selected);return e?(this.clipboard=structuredClone(e),this.showMessage(h("web_copied")),!0):!1}cutSelection(){this.selected&&mt(this.doc,this.selected)&&this.copySelection()&&this.deleteSelection()}paste(){this.clipboard&&this.insertNearSelection(structuredClone(this.clipboard))}deleteSelection(){!this.selected||!mt(this.doc,this.selected)||(this.commit(Ae(this.doc,this.selected)),this.selected=void 0,this.render())}insertNearSelection(e){const t=this.selected;if(t&&ze(this.doc,t))return this.commit(de(this.doc,t,e),t);if(t){const n=[...t.slice(0,-1),t[t.length-1]+1];return this.commit(At(this.doc,e,t),n)}if(this.doc.elements.length===1&&ze(this.doc,[0]))return this.commit(de(this.doc,[0],e),[0]);this.commit(ke(this.doc,[],this.doc.elements.length,e),[this.doc.elements.length])}confirmDiscard(){return this.dirty?new Promise(e=>{const t=document.createElement("div");t.className="confirm",t.innerHTML=`<div class="confirm-card" role="alertdialog" aria-label="${k(h("close_unsaved_title"))}">
        <p><strong>${k(h("close_unsaved_title"))}</strong></p>
        <p class="hint">${k(h("web_discard_message_fmt",this.fileName))}</p>
        <div class="group"><button data-r="0">${k(h("close_unsaved_cancel"))}</button><button data-r="1" class="danger">${k(h("close_unsaved_discard"))}</button></div>
      </div>`,t.addEventListener("click",n=>{const s=n.target.dataset.r;s===void 0&&n.target!==t||(t.remove(),e(s==="1"))}),document.body.append(t),t.querySelector('[data-r="0"]').focus()}):Promise.resolve(!0)}showMessage(e){this.statusLine.textContent=e,this.statusLine.classList.add("message"),setTimeout(()=>{this.statusLine.classList.remove("message"),this.updateStatus()},6e3)}loadXML(e,t,n){let s;try{s=qt(e)}catch(r){this.showMessage(h("web_err_unreadable_fmt",t,r.message));return}(this.dirty||this.tab.fileName||this.tab.exerciseId)&&this.addTab(),this.doc=s,this.tab.fileName=t.replace(/\.(strk|xml)$/i,".visustruct"),this.fileHandle=n&&/\.visustruct$/i.test(t)?n:void 0,this.resetHistory()}async open(e){const t=window;if(!t.showOpenFilePicker||this.inViewer)return e.click();try{const[n]=await t.showOpenFilePicker({types:t1()}),s=await n.getFile();this.loadXML(await s.text(),s.name,n)}catch{}}async save(){var n,s;const e=new Blob([pt(this.doc)],{type:"application/xml"}),t=window;try{if(this.downloads){const r=this.fileName+".txt";await this.downloads.save({filename:r,data:e}),(n=this.tab).fileName??(n.fileName=this.fileName),this.dirty=!1,this.render(),this.showMessage(h("web_saved_txt_fmt",r));return}if(!this.fileHandle&&t.showSaveFilePicker&&!this.inViewer&&(this.fileHandle=await t.showSaveFilePicker({suggestedName:this.fileName,types:t1()}),this.tab.fileName=this.fileHandle.name),this.fileHandle){const r=await this.fileHandle.createWritable();await r.write(e),await r.close()}else{const r=document.createElement("a");r.href=URL.createObjectURL(e),r.download=this.fileName,r.click(),setTimeout(()=>URL.revokeObjectURL(r.href),1e3)}(s=this.tab).fileName??(s.fileName=this.fileName),this.dirty=!1,this.render()}catch{}}async exportDiagram(e){const t=Qn(this.doc,this.metrics,this.measure);if(!t){this.showMessage(h(e==="print"?"err_diagram_too_small_print":"err_diagram_too_small_export"));return}const n=ao(this.doc,fe(this.tab)),s=Math.max(2,window.devicePixelRatio||1)*this.zoom;try{switch(e){case"svg":{t.svg.setAttribute("width",String(t.width*this.zoom)),t.svg.setAttribute("height",String(t.height*this.zoom)),await this.offerDownload(`${n}.svg`,new Blob([ni(t)],{type:"image/svg+xml"}));break}case"png":{const r=await qn(t,s);await this.offerDownload(`${n}.png`,await oo(r));break}case"pdf":{const r=await qn(t,Math.max(s,3)),a=await ho(mo(r),r.width,r.height,t,ti(this.doc));await this.offerDownload(`${n}.pdf`,a);break}case"print":this.printDiagram(t);break}}catch(r){this.showMessage(h("web_export_failed_fmt",r instanceof Error?r.message:String(r)))}}printDiagram(e){const t=document.createElement("div");t.className="print-sheet",e.svg.removeAttribute("width"),e.svg.removeAttribute("height"),t.append(e.svg),document.body.append(t);const n=()=>t.remove();window.addEventListener("afterprint",n,{once:!0});try{window.print()}catch{n(),this.showMessage(`${h("err_print_unavailable")} ${h("web_print_hint")}`);return}setTimeout(n,6e4)}async offerDownload(e,t){try{if(this.downloads){try{await this.downloads.save({filename:e,data:t}),this.showMessage(h("web_saved_fmt",e))}catch{await this.downloads.save({filename:e+".txt",data:t}),this.showMessage(h("web_saved_txt_fmt",e+".txt"))}return}const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),setTimeout(()=>URL.revokeObjectURL(n.href),1e3)}catch{this.showMessage(h("err_save_failed_fmt",e))}}setupFileDrop(){window.addEventListener("dragover",e=>{var t;(t=e.dataTransfer)!=null&&t.types.includes("Files")&&(e.preventDefault(),this.root.classList.add("file-drag"))}),window.addEventListener("dragleave",e=>{e.relatedTarget===null&&this.root.classList.remove("file-drag")}),window.addEventListener("drop",async e=>{var n;this.root.classList.remove("file-drag");const t=(n=e.dataTransfer)==null?void 0:n.files[0];t&&(e.preventDefault(),this.loadXML(await t.text(),t.name))})}onKeyDown(e){var s;const t=e.metaKey||e.ctrlKey,n=e.target instanceof HTMLTextAreaElement||e.target instanceof HTMLInputElement;if(t&&e.key.toLowerCase()==="s")e.preventDefault(),this.save();else if(t&&e.key.toLowerCase()==="p")e.preventDefault(),this.simulating||this.exportDiagram("print");else if(t&&e.key.toLowerCase()==="o")e.preventDefault(),this.open(this.root.querySelector("input[type=file]"));else{if(n||this.simulating)return;t&&e.key.toLowerCase()==="z"?(e.preventDefault(),e.shiftKey?this.redo():this.undo()):t&&e.key.toLowerCase()==="c"&&!((s=getSelection())!=null&&s.toString())?this.copySelection()&&e.preventDefault():t&&e.key.toLowerCase()==="x"?(e.preventDefault(),this.cutSelection()):t&&e.key.toLowerCase()==="v"?(e.preventDefault(),this.paste()):t&&e.key.toLowerCase()==="y"?(e.preventDefault(),this.redo()):e.key==="Delete"||e.key==="Backspace"?(e.preventDefault(),this.deleteSelection()):e.key==="Escape"&&(this.drag?this.endDrag():(this.selected=void 0,this.render()))}}svgPoint(e,t){if(!this.svg)return;const n=this.svg.getBoundingClientRect(),s=e-n.left,r=t-n.top;if(!(s<0||r<0||s>n.width||r>n.height))return{x:s/this.zoom,y:r/this.zoom}}nodeAt(e,t){for(let n=this.flat.length-1;n>=0;n--){const s=this.flat[n].frame;if(e>=s.x&&e<=s.x+s.width&&t>=s.y&&t<=s.y+s.height)return this.flat[n]}}onCanvasPointerDown(e){if(this.simulating)return;const t=this.svgPoint(e.clientX,e.clientY);if(!t)return;document.activeElement instanceof HTMLElement&&document.activeElement.blur();const n=this.nodeAt(t.x,t.y),s=n&&this.selected&&Ct(n.idPath,this.selected);this.selected=n==null?void 0:n.idPath,this.render(),n&&e.pointerType!=="touch"&&!(ze(this.doc,n.idPath)&&!s)&&this.beginDrag(e,{kind:"move",path:n.idPath})}beginDrag(e,t){e.button!==0||this.simulating||(e.preventDefault(),this.drag={source:t,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,active:!1})}onPointerMove(e){const t=this.drag;if(!t||e.pointerId!==t.pointerId)return;if(!t.active){if(Math.hypot(e.clientX-t.startX,e.clientY-t.startY)<5)return;t.active=!0,t.ghost=this.makeGhost(t.source),document.body.append(t.ghost),this.root.classList.add("dragging")}t.ghost.style.transform=`translate(${e.clientX+12}px, ${e.clientY+12}px)`,this.autoScroll(e.clientX,e.clientY);const n=this.svgPoint(e.clientX,e.clientY);t.target=n?this.dropTargetAt(n.x,n.y,t.source):void 0,this.showDropTarget(t.target)}onPointerUp(e){const t=this.drag;!t||e.pointerId!==t.pointerId||(t.active&&t.target?this.applyDrop(t.source,t.target):!t.active&&t.source.kind==="palette"&&this.insertNearSelection(He(t.source.item)),this.endDrag())}endDrag(){var e,t;(t=(e=this.drag)==null?void 0:e.ghost)==null||t.remove(),this.drag=void 0,this.root.classList.remove("dragging"),this.showDropTarget(void 0)}makeGhost(e){const t=document.createElement("div");if(t.className="drag-ghost",e.kind==="palette")t.textContent=xn.find(n=>n.item===e.item).label;else{const n=ne(this.doc,e.path);t.textContent=`${_t(n.type)}: ${Yt(n)[0]}`}return t}autoScroll(e,t){const n=this.canvasHost.getBoundingClientRect(),s=40,r=12;t>n.bottom-s&&t<n.bottom+s?this.canvasHost.scrollTop+=r:t<n.top+s&&t>n.top-s&&(this.canvasHost.scrollTop-=r),e>n.right-s&&e<n.right+s?this.canvasHost.scrollLeft+=r:e<n.left+s&&e>n.left-s&&(this.canvasHost.scrollLeft-=r)}dropTargetAt(e,t,n){var o;const s=((o=this.layout)==null?void 0:o.elements)??[],r=this.nodeAt(e,t);if(!r){const u=s[s.length-1];if(!u)return;const c=u.frame.y+u.frame.height;return t>c?n.kind==="move"&&n.path.length===1&&n.path[0]===s.length-1?void 0:{kind:"rootAppend",frame:{x:u.frame.x,y:c,width:u.frame.width,height:0}}:t<s[0].frame.y?{kind:"before",path:[0],frame:s[0].frame}:void 0}const a=r.idPath;return n.kind==="move"&&a.length>=n.path.length&&n.path.every((u,c)=>a[c]===u)?void 0:ze(this.doc,a)?{kind:"replace",path:a,frame:r.frame}:{kind:t<r.frame.y+r.frame.height/2?"before":"after",path:a,frame:r.frame}}showDropTarget(e){if(!this.overlay||(this.overlay.replaceChildren(),!e))return;const t=e.frame;if(e.kind==="replace"){this.overlay.append(P("rect",{x:t.x+2,y:t.y+2,width:t.width-4,height:t.height-4,class:"drop-replace"}));return}const n=e.kind==="before"?t.y:t.y+t.height;this.overlay.append(P("rect",{x:t.x,y:n-3,width:t.width,height:6,rx:3,class:"drop-line"}))}applyDrop(e,t){const n=this.doc;try{if(e.kind==="palette"){const r=He(e.item);switch(t.kind){case"replace":return this.commit(de(n,t.path,r),t.path);case"before":return this.commit(h1(n,r,t.path),t.path);case"after":return this.commit(At(n,r,t.path),[...t.path.slice(0,-1),t.path[t.path.length-1]+1]);case"rootAppend":return this.commit(ke(n,[],n.elements.length,r),[n.elements.length])}}const s=e.path;switch(t.kind){case"replace":return this.commit(fi(n,s,t.path));case"before":return this.commit(gi(n,s,t.path));case"after":return this.commit(pi(n,s,t.path));case"rootAppend":{const r=ne(n,s);return this.commit(ke(Ae(n,s),[],Number.MAX_SAFE_INTEGER,r))}}}catch(s){console.warn("Ablegen nicht möglich",s)}finally{e.kind==="move"&&(this.selected=void 0,this.render())}}}function ii(){hi({[g.anweisung]:h("canvas_stub_anweisung"),[g.verzweigung]:h("canvas_stub_condition"),[g.fallauswahl]:h("canvas_stub_fallauswahl"),[g.forSchleife]:h("canvas_stub_for"),[g.whileSchleife]:h("canvas_stub_while"),[g.doUntilSchleife]:h("canvas_stub_while"),[g.endlosschleife]:h("canvas_stub_endless"),[g.aussprung]:h("canvas_stub_break"),[g.aufruf]:h("canvas_stub_call")})}function Zt(i){return et(i).toLowerCase()}function fe(i){return i.fileName?i.fileName.replace(/\.(visustruct|strk)$/i,""):i.doc.caption.trim()||h("tab_title_format",i.serial)}function l1(i){return Math.round(Math.max(260,Math.min(i,720,window.innerWidth-420)))}function Dt(i){try{return localStorage.getItem(i)}catch{return null}}function Mt(i,e){try{localStorage.setItem(i,e)}catch{}}function zo(i){return i.replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}_1(Fi(),!1).then(()=>{ii(),new Io(document.getElementById("app"))});
