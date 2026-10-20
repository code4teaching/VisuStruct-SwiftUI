var Si=Object.defineProperty;var _i=(i,e,t)=>e in i?Si(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var p=(i,e,t)=>_i(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();var m=(i=>(i[i.anweisung=0]="anweisung",i[i.verzweigung=1]="verzweigung",i[i.fallauswahl=2]="fallauswahl",i[i.forSchleife=3]="forSchleife",i[i.whileSchleife=4]="whileSchleife",i[i.doUntilSchleife=5]="doUntilSchleife",i[i.endlosschleife=6]="endlosschleife",i[i.aussprung=7]="aussprung",i[i.aufruf=8]="aufruf",i[i.leerElement=9]="leerElement",i))(m||{});function ki(i){return i===3||i===4||i===5||i===6}function Ei(i){return i===1||i===2}function K(i,e={}){return{type:i,zoomX:0,zoomY:0,textLines:[""],...e}}function Di(i){const e=i.textLines;if(!e.every(t=>t.trim()===""))switch(i.type){case m.forSchleife:return e.length<=1?e:[Ai(e)];case m.verzweigung:return Ae("if",e);case m.whileSchleife:return Ae("while",e);case m.doUntilSchleife:return Ae("while",Li(e));case m.fallauswahl:return Ae("switch",e);default:return e}}function Li(i){if(i.length===0)return i;const e=i[0].trim(),t=e.toLowerCase(),n=[...i];if(t==="until")n[0]="";else if(t.startsWith("until "))n[0]=e.slice(6).trim();else if(t.startsWith("until("))n[0]=e.slice(5);else return i;return n}function jt(i){const e=new Set(["if","for","while","until","switch"]),t=["input:","output:","print:"],n=i.trim(),s=n.toLowerCase();for(const l of t){if(s===l)return{keyword:n,rest:""};if(s.startsWith(l+" "))return{keyword:n.slice(0,l.length),rest:n.slice(l.length).trim()}}const r=n.indexOf(" ");if(r<0)return;const a=n.slice(0,r);if(e.has(a.toLowerCase()))return{keyword:a,rest:n.slice(r+1).trim()}}function Ae(i,e){if(e.length===0)return e;const t=e[0].trim(),n=t.toLowerCase();if(n===i||n.startsWith(i+" "))return e;const s=[...e];return s[0]=i+" "+t,s}function Ai(i){let e=[...i];for(;e.length<3;)e.push("");e=e.slice(0,3);const t=s=>{let r=s.trim();for(;r.endsWith(";");)r=r.slice(0,-1).trim();return r},n=e.map(t).join("; ").trim();return n===""?"for":"for "+n}const Bn={[m.anweisung]:"Anweisung",[m.verzweigung]:"Bedingung",[m.fallauswahl]:"Fallauswahl",[m.forSchleife]:"for 0 < i < anzahl",[m.whileSchleife]:"while …",[m.doUntilSchleife]:"while …",[m.endlosschleife]:"endless",[m.aussprung]:"break",[m.aufruf]:"Aufruf()",[m.leerElement]:"ø"};function Ii(i){Object.assign(Bn,i)}function Dt(i){return Di(i)??[Bn[i.type]]}class V extends Error{}const Q=i=>structuredClone(i);function _e(){return K(m.anweisung,{textLines:["ø"]})}function Bi(){return{caption:"",elements:[_e()]}}function Lt(i){if(i.type===m.leerElement)return!0;if(i.type===m.anweisung){const e=i.textLines;return e.length===0||e.length===1&&e[0]==="ø"}return!1}function pe(i,e){const t=J(i,e);return t!==void 0&&Lt(t)}function Le(i,e){if(e.length===0)throw new V("Invalid element path.");const[t,...n]=e;if(t<0||t>=i.length)throw new V("Invalid element path.");if(n.length===0)return{list:i,index:t};const[s,...r]=n;if(r.length===0)throw new V("Invalid element path.");return Le($n(i[t],s),r)}function $n(i,e){if(ki(i.type)){if(e!==0||!i.loopBody)throw new V("Invalid element path.");return i.loopBody}if(Ei(i.type)){if(!i.cases||e<0||e>=i.cases.length)throw new V("Invalid element path.");return i.cases[e].elements}throw new V("Invalid element path.")}function G(i,e){const{list:t,index:n}=Le(i.elements,e);return t[n]}function J(i,e){try{return G(i,e)}catch{return}}function le(i,e,t){const n=Q(i),{list:s,index:r}=Le(n.elements,e);return s[r]=Q(t),n}function nt(i,e,t){const n=Q(G(i,e));return n.textLines=t.length===0?[""]:t,le(i,e,n)}function it(i,e){return e.length===0?!1:e.length===1&&i.elements.length===1?!pe(i,e):J(i,e)!==void 0}function ke(i,e){const t=Q(i),{list:n,index:s}=Le(t.elements,e);if(e.length===1&&n.length===1){if(Lt(n[0]))throw new V("The last root element cannot be deleted.");return n[0]=_e(),t}return n.splice(s,1),e.length>1&&n.length===0&&n.push(_e()),t}function ye(i,e,t,n){const s=Q(i);let r;if(e.length===0)r=s.elements;else{const a=e.slice(0,-1),l=e[e.length-1],{list:o,index:u}=Le(s.elements,a);r=$n(o[u],l)}return r.splice(Math.min(Math.max(0,t),r.length),0,Q(n)),s}function Tn(i,e,t){if(t.length===0)throw new V("Invalid element path.");return ye(i,t.slice(0,-1),t[t.length-1],e)}function pt(i,e,t){if(t.length===0)throw new V("Invalid element path.");return ye(i,t.slice(0,-1),t[t.length-1]+1,e)}function At(i,e){return i.length<e.length&&i.every((t,n)=>e[n]===t)}function It(i,e){if(e.length===0)return i;const t=e[e.length-1],n=e.slice(0,-1);if(i.length<=n.length||!n.every((a,l)=>i[l]===a))return i;const s=n.length;if(i[s]<=t)return i;const r=[...i];return r[s]-=1,r}const Bt=(i,e)=>i.length===e.length&&i.every((t,n)=>t===e[n]);function $i(i,e,t){if(Bt(e,t))return i;if(At(e,t))throw new V("Invalid element path.");const n=G(i,e),s=ke(i,e);return Tn(s,n,It(t,e))}function Ti(i,e,t){if(Bt(e,t))return i;if(At(e,t))throw new V("Invalid element path.");const n=G(i,e),s=ke(i,e);return pt(s,n,It(t,e))}function Wi(i,e,t){if(!pe(i,t))throw new V("Invalid element path.");if(Bt(e,t))return i;if(At(e,t))throw new V("Invalid element path.");const n=G(i,e),s=ke(i,e);return le(s,It(t,e),n)}function Fi(i,e){const t=Q(G(i,e)),n=t.cases;if(t.type!==m.fallauswahl||!n||n.length===0)throw new V("Invalid element path.");const s=n[n.length-1].name.toLowerCase()==="default",r=s?n.length-1:n.length,a=String(s?n.length:n.length+1);return n.splice(r,0,{name:a,elements:[_e()]}),{doc:le(i,e,t),path:[...e,r,0]}}function Vi(i,e,t){const n=Q(G(i,e)),s=n.cases;if(n.type!==m.fallauswahl||!s)throw new V("Invalid element path.");if(s.length<=2)throw new V("A switch needs at least two cases.");if(t<0||t>=s.length)throw new V("Invalid element path.");s.splice(t,1);const r=Math.min(t,s.length-1);return{doc:le(i,e,n),path:[...e,r,0]}}function Pi(i,e,t,n){const s=Q(G(i,e)),r=s.cases;if(s.type!==m.fallauswahl||!r)throw new V("Invalid element path.");if(t<0||t>=r.length)throw new V("Invalid element path.");const a=n.trim();if(a==="")throw new V("Invalid element path.");return r[t].name=a,le(i,e,s)}function Mi(i,e){var t;if(!(!i||i.length===0))for(let n=i.length;n>=1;n--){const s=i.slice(0,n);if(((t=J(e,s))==null?void 0:t.type)===m.fallauswahl)return s}}function Ci(i,e){if(!(!i||i.length<=e.length))return i[e.length]}function Nt(i,e){if(e.elements.length!==0)return!i||!J(e,i)?[0]:i}const Wn=i=>i!==void 0&&/\s/.test(i);function Oe(i){const e=i.trim().toLowerCase();return e.startsWith("input:")?"input":e.startsWith("output:")||e.startsWith("print:")?"output":"statement"}function ji(i){const e=i.trim(),t=e.toLowerCase();return t.startsWith("input:")?e.slice(6).trim():t.startsWith("output:")?e.slice(7).trim():t.startsWith("print:")?e.slice(6).trim():i}function Zt(i,e){const t=e.trim();return t===""?`${i} `:`${i} ${t}`}function Ni(i,e){const t=ji(e);switch(i){case"statement":return t;case"input":return Zt("input:",t);case"output":return Zt("output:",t)}}const Me=i=>Wn(i[0])?i.slice(1):i;function Zi(i){const e=i.replace(/^\s+/,""),t=e.toLowerCase();return t.startsWith("input:")?Me(e.slice(6)):t.startsWith("output:")?Me(e.slice(7)):t.startsWith("print:")?Me(e.slice(6)):i}function Rt(i,e){const t=e.replace(/^\s+/,"");if(!t.toLowerCase().startsWith(i.toLowerCase()))return e;const n=t.slice(i.length);if(!(n===""||Wn(n[0])||n[0]==="("))return e;const s=Me(n);return s.startsWith("(")&&s.endsWith(")")&&s.length>=2?s.slice(1,-1):s}function Ot(i,e){if(i==="input:"||i==="output:")return Zi(e);const t=Rt(i,e);if(i==="while"&&t===e){const n=Rt("until",e);if(n!==e)return n}return t}function Ri(i,e){return e===""?`${i} `:`${i} ${e}`}function Fn(i){return i.replace(/[“”„«»]/g,'"').replace(/[’‘‚´]/g,"'")}function Ht(i){const e=i.length===0?[""]:i.slice(0,3);for(;e.length<3;)e.push("");return e}function Oi(i){let e=Fn(i);for(;;){const t=e.trim();if(!t.endsWith(";"))return e;e=t.slice(0,-1).trim()}}const Xe='system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';function Hi(i,e){return`${e==="bold"?700:500} ${i}px ${Xe}`}const Vn=(i,e,t)=>[...i].length*e*(t==="bold"?.68:.62);function Ui(){if(typeof document>"u"||!document.body)return;const i="http://www.w3.org/2000/svg",e=document.createElementNS(i,"svg");e.setAttribute("aria-hidden","true"),e.setAttribute("width","0"),e.setAttribute("height","0"),e.style.cssText="position:absolute;left:-9999px;top:0;visibility:hidden;overflow:hidden";const t=document.createElementNS(i,"text");if(t.setAttribute("font-family",Xe),t.style.whiteSpace="pre",e.append(t),document.body.append(e),typeof t.getComputedTextLength!="function"||typeof t.getBBox!="function"){e.remove();return}if(t.textContent="Mg",t.setAttribute("font-size","20"),!(t.getComputedTextLength()>0)){e.remove();return}return t}let st;function Pn(){return st===void 0&&(st=Ui()??null),st??void 0}function Mn(i,e,t){i.setAttribute("font-size",String(e)),i.setAttribute("font-weight",t==="bold"?"700":"500")}function Ut(i,e){const t=`${i}|${e}`;let n=Kt.get(t);if(!n){const s=Pn();if(n={ascent:i*.95,descent:i*.24},s){Mn(s,i,e),s.setAttribute("y","0"),s.textContent="Mg";const r=s.getBBox();r.height>0&&(n={ascent:-r.y,descent:r.height+r.y})}Kt.set(t,n)}return n}const Kt=new Map;function Ki(){const i=Pn();if(i){const n=new Map;return(s,r,a)=>{const l=`${r}|${a}|${s}`;let o=n.get(l);return o===void 0&&(Mn(i,r,a),i.textContent=s,o=s===""?0:i.getComputedTextLength(),n.size>2e3&&n.clear(),n.set(l,o)),o}}const e=typeof document<"u"?document.createElement("canvas").getContext("2d"):null;if(!e)return Vn;const t=new Map;return(n,s,r)=>{const a=`${s}|${r}|${n}`;let l=t.get(a);return l===void 0&&(e.font=Hi(s,r),l=e.measureText(n).width,t.size>2e3&&t.clear(),t.set(a,l)),l}}const Cn={fontSize:15,lineHeight:20,charWidth:7,baseHeaderExtra:20,minSidePadding:42,cellTextInsetY:15,doUntilDoLabelTopInset:2,doUntilFooterTopInset:6,doUntilFooterBottomInset:8};function Ji(i){return{...Cn,fontSize:14,lineHeight:21,charWidth:5.5*(14/12),baseHeaderExtra:21,minSidePadding:40}}const Ie=i=>i===m.forSchleife||i===m.whileSchleife||i===m.doUntilSchleife||i===m.endlosschleife,Be=i=>i===m.fallauswahl||i===m.verzweigung;function $e(i,e,t,n=0){return{idPath:i,element:e,frame:t,headerBandHeight:n,topBandHeight:0,loopBodyLeadingInset:0,caseColumnFrames:[],children:[]}}function Z(i){return{...i,frame:{...i.frame}}}class jn{constructor(e=Cn,t=Vn){this.metrics=e,this.measure=t}layout(e,t={left:28,top:28}){const s=this.layoutList(e.elements,t.left,t.top,[]).map(o=>this.stretchLoopBodiesVertically(o));let r=0,a=0;const l=o=>{r=Math.max(r,o.frame.x+o.frame.width),a=Math.max(a,o.frame.y+o.frame.height),o.children.forEach(l)};return s.forEach(l),{canvasSize:{width:r+t.left,height:a+t.top},elements:s}}lineWidth(e){return Math.ceil(this.measure(e,this.metrics.fontSize,"medium"))}lineWidthBold(e){return Math.ceil(this.measure(e,this.metrics.fontSize,"bold"))}layoutList(e,t,n,s){let r=[],a=n;e.forEach((o,u)=>{const h=this.layoutElement(o,t,a,[...s,u]);r.push(h),a+=h.frame.height});const l=Math.max(0,...r.map(o=>o.frame.width));return l>0&&(r=r.map(o=>this.stretchNodeTreeToWidth(o,l))),r}stretchMultiwayNodeToWidth(e,t){const n=Z(e),s=n.frame.width;if(!(s>0)||n.caseColumnFrames.length===0)return n;const r=t/s;n.frame.width=t;let a=n.frame.x;const l=n.caseColumnFrames.map(o=>{const u=o.width*r,h={x:a,y:o.y,width:u,height:o.height};return a+=u,h});return n.caseColumnFrames=l,n.dividerX=l.length>0?l[l.length-1].x:n.frame.x+t,n.columns&&n.columns.length===l.length&&(n.columns=n.columns.map((o,u)=>{const h=l[u];return o.map(d=>{const g=Z(d);return g.frame.x=h.x,g.frame.width=h.width,this.stretchDescendantsWidths(g,h.width)})}),n.children=n.columns.flat()),n}stretchLoopChildren(e,t){const n=this.effectiveLoopBodyLeading(e),s=Math.max(0,t-n);e.children=e.children.map(r=>{const a=Z(r);return a.frame.x=e.frame.x+n,a.frame.width=s,this.stretchDescendantsWidths(a,s)})}stretchNodeTreeToWidth(e,t){const n=Z(e);return n.frame.width>0?Be(n.element.type)&&n.caseColumnFrames.length>0?this.stretchMultiwayNodeToWidth(n,t):(n.frame.width=t,Ie(n.element.type)?this.stretchLoopChildren(n,t):n.children=n.children.map(r=>this.stretchDescendantsWidths(r,t)),n):n}stretchDescendantsWidths(e,t){let n=Z(e);return Be(n.element.type)?n=this.stretchNodeTreeToWidth(n,t):Ie(n.element.type)?(n.frame.width=t,this.stretchLoopChildren(n,t)):(n.frame.width=t,n.children=n.children.map(s=>this.stretchDescendantsWidths(s,t))),n}stretchLoopBodiesVertically(e){const t=Z(e);if(t.columns&&t.columns.length>0)return t.columns=t.columns.map(r=>r.map(a=>this.stretchLoopBodiesVertically(a))),t.children=t.columns.flat(),t;t.children=t.children.map(r=>this.stretchLoopBodiesVertically(r));const n=r=>r===m.anweisung||r===m.leerElement||r===m.aufruf||r===m.aussprung||Ie(r);let s;switch(t.element.type){case m.forSchleife:case m.whileSchleife:case m.endlosschleife:{const r=t.element.type===m.endlosschleife?40:0;s=t.frame.y+t.frame.height-r;break}case m.doUntilSchleife:s=t.frame.y+t.frame.height-t.headerBandHeight;break}if(s!==void 0&&t.children.length>0){const r=t.children.length-1;let a=Z(t.children[r]);const l=s-(a.frame.y+a.frame.height);l>.5&&n(a.element.type)&&(a.frame.height+=l,a=this.stretchLoopBodiesVertically(a),t.children=[...t.children.slice(0,r),a])}return t}headerHeight(e){const t=this.metrics,n=Math.max(1,e.textLines.length);if(e.type===m.doUntilSchleife)return t.doUntilFooterTopInset+n*t.lineHeight+t.doUntilFooterBottomInset+e.zoomY;let s;switch(e.type){case m.fallauswahl:s=40;break;case m.verzweigung:s=20;break;case m.forSchleife:case m.whileSchleife:case m.endlosschleife:s=t.baseHeaderExtra+4;break;default:s=14}return s+n*t.lineHeight+e.zoomY}doUntilBodyLeadingInset(){return Math.max(20,this.lineWidthBold("do")+12)}effectiveLoopBodyLeading(e){return e.element.type===m.doUntilSchleife?e.loopBodyLeadingInset>0?e.loopBodyLeadingInset:this.doUntilBodyLeadingInset():20}horizontalPaddingInsideCell(e){return Be(e)?Math.max(100,this.metrics.minSidePadding*2.45):this.metrics.minSidePadding}minWidth(e){const t=e.textLines.length===0?0:Math.max(...e.textLines.map(r=>this.lineWidth(r)));let n=t+e.zoomX+this.horizontalPaddingInsideCell(e.type);if(e.type===m.aufruf){const r=Math.max(68,this.metrics.minSidePadding*1.7),a=Math.max(8,this.metrics.minSidePadding*.2);n=Math.max(n,t+e.zoomX+r+a)}const s=e.type===m.leerElement?76:e.type===m.aufruf?104:72;return Math.max(s,n)}layoutElement(e,t,n,s){if(Be(e.type))return this.layoutMultiway(e,t,n,s);if(Ie(e.type))return this.layoutLoop(e,t,n,s);const r=this.headerHeight(e);return $e(s,e,{x:t,y:n,width:this.minWidth(e),height:r},r)}layoutLoop(e,t,n,s){const r=z=>z.reduce((y,E)=>y+E.frame.height,0),a=z=>Math.max(0,...z.map(y=>y.frame.width)),l=e.loopBody??[];if(e.type===m.doUntilSchleife){const z=this.doUntilBodyLeadingInset(),y=e.zoomY,E=this.headerHeight(e),N=this.layoutList(l,t+z,n+y,[...s,0]),D=Math.max(this.minWidth(e),a(N)+z),k=r(N)+E+y,A=Math.max(0,D-z),I=$e(s,e,{x:t,y:n,width:D,height:k},E);return I.topBandHeight=y,I.loopBodyLeadingInset=z,I.children=N.map($=>{const F=Z($);return F.frame.x=t+z,F.frame.width=A,this.stretchDescendantsWidths(F,A)}),I}const o=20,u=this.headerHeight(e),h=e.type===m.endlosschleife?40:0,d=this.layoutList(l,t+o,n+u,[...s,0]),g=Math.max(this.minWidth(e),a(d)+o),x=u+h+r(d),f=Math.max(0,g-o),v=$e(s,e,{x:t,y:n,width:g,height:x},u);return v.children=d.map(z=>{const y=Z(z);return y.frame.x=t+o,y.frame.width=f,this.stretchDescendantsWidths(y,f)}),v}layoutMultiway(e,t,n,s){const r=this.headerHeight(e),a=e.cases??[],l=Math.max(1,a.length),o=Math.max(this.minWidth(e)/l,132);let u=[],h=[],d=0,g=0;if(a.forEach((z,y)=>{const E=t+d,N=this.layoutList(z.elements,E,n+r,[...s,y]),D=Math.max(0,...N.map(I=>I.frame.width));let k;e.type===m.verzweigung&&l===2?k=Math.max(D,(y===0?"true":"false").length*this.metrics.charWidth+24):k=Math.max(o,D);const A=N.reduce((I,$)=>I+$.frame.height,0);g=Math.max(g,A),u.push({x:E,y:n+r,width:k,height:A}),h.push(N.map(I=>{const $=Z(I);return $.frame.x=E,$.frame.width=k,this.stretchDescendantsWidths($,k)})),d+=k}),e.type===m.verzweigung&&l===2&&u.length===2){const z=Math.max(u[0].width,u[1].width),y=t,E=t+z,N=E-u[1].x;u[0]={...u[0],x:y,width:z},u[1]={...u[1],x:E,width:z},d=z*2,h[0]=h[0].map(D=>{const k=Z(D);return k.frame.x=y,k.frame.width=z,this.stretchDescendantsWidths(k,z)}),h[1]=h[1].map(D=>{const k=ft(D,N);return k.frame.width=z,this.stretchDescendantsWidths(k,z)})}if(h.length>0){const z=Gi(h,n+r);h=z.columns.map(y=>y.map(E=>this.stretchLoopBodiesVertically(E)));for(let y=0;y<Math.min(u.length,z.columnHeights.length);y++)u[y]={...u[y],height:z.columnHeights[y]};g=z.columnHeights.length>0?Math.max(...z.columnHeights):g}let x=Math.max(d,this.minWidth(e));if(d>.5&&x>d+.5){const z=x/d;let y=t;const E=[],N=[];u.forEach((D,k)=>{const A=D.width*z;N.push(h[k].map(I=>{const $=Z(I);return $.frame.x=y,$.frame.width=A,this.stretchDescendantsWidths($,A)})),E.push({x:y,y:D.y,width:A,height:D.height}),y+=A}),u=E,h=N,d=y-t,x=d}const f=u.length>0?u[u.length-1].width:d/l,v=$e(s,e,{x:t,y:n,width:x,height:r+g},r);return v.caseColumnFrames=u,v.dividerX=u.length>0?u[u.length-1].x:t+d-f,v.dividerYInset=e.type===m.fallauswahl?-20:0,v.columns=h,v.children=h.flat(),v}}function Nn(i,e){if(Math.abs(e)<=1e-4)return i;const t=Z(i),n=s=>{const r=Z(s);return r.frame.y+=e,Nn(r,e)};return t.columns?(t.columns=t.columns.map(s=>s.map(n)),t.children=t.columns.flat()):t.children=t.children.map(n),t}function ft(i,e){if(Math.abs(e)<=1e-4)return i;const t=Z(i);return t.frame.x+=e,t.columns?(t.columns=t.columns.map(n=>n.map(s=>ft(s,e))),t.children=t.columns.flat()):t.children=t.children.map(n=>ft(n,e)),t}function Gi(i,e){if(i.length<2)return{columns:i,columnHeights:i.map(u=>u.reduce((h,d)=>h+d.frame.height,0))};const t=.5,n=[e];for(const u of i)for(const h of u)n.push(h.frame.y+h.frame.height);const s=Math.max(...n);n.push(s),n.sort((u,h)=>u-h);let r=[];for(const u of n)r.length>0&&Math.abs(u-r[r.length-1])<=t||r.push(u);(r.length===0||Math.abs(r[0]-e)>t)&&r.unshift(e),r.length===0?r=[e,s]:r[r.length-1]<s-1e-6?r.push(s):r[r.length-1]=s;const a=(u,h)=>{let d=Math.max(0,h);for(;d<r.length&&r[d]<u-t;)d++;return Math.min(d,r.length-1)},l=[],o=[];for(const u of i){if(u.length===0){l.push([]),o.push(0);continue}const h=[];let d=0;u.forEach((g,x)=>{let f=Z(g);const v=r[d],z=g.frame.y+g.frame.height,y=x===u.length-1?r.length-1:a(z,d+1),E=r[y],N=v-f.frame.y;f.frame.y=v,f.frame.height=Math.max(0,E-v),f=Nn(f,N),h.push(f),d=y}),l.push(h),o.push(r[r.length-1]-e)}return{columns:l,columnHeights:o}}const Jt=[{item:"anweisung",label:"Anweisung"},{item:"verzweigung",label:"Verzweigung"},{item:"fallauswahl",label:"Fallauswahl"},{item:"forZaehlSchleife",label:"For-Schleife"},{item:"whileSchleife",label:"While-Schleife"},{item:"doUntilSchleife",label:"Do-while-Schleife"},{item:"endlosschleife",label:"Endlosschleife"},{item:"aufruf",label:"Aufruf"},{item:"aussprung",label:"Aussprung"}];function Te(i){const e=_e;switch(i){case"anweisung":return K(m.anweisung);case"verzweigung":return K(m.verzweigung,{cases:[{name:"true",elements:[e()]},{name:"false",elements:[e()]}]});case"fallauswahl":return K(m.fallauswahl,{cases:[{name:"1",elements:[e()]},{name:"2",elements:[e()]},{name:"default",elements:[e()]}]});case"forZaehlSchleife":return K(m.forSchleife,{textLines:["","",""],loopBody:[e()]});case"whileSchleife":return K(m.whileSchleife,{loopBody:[e()]});case"doUntilSchleife":return K(m.doUntilSchleife,{loopBody:[e()]});case"endlosschleife":return K(m.endlosschleife,{loopBody:[e()]});case"aussprung":return K(m.aussprung);case"aufruf":return K(m.aufruf)}}function He(i){if(i==="")return"-1;";let e="";for(const t of i)e+=t.codePointAt(0)+";";return e}function bt(i){const e=i.split(";").filter(n=>n!=="");if(e.length===1&&e[0]==="-1")return"";let t="";for(const n of e){if(!/^[+-]?\d+$/.test(n))continue;const s=Number(n);s!==-1&&(s<0||s>1114111||s>=55296&&s<=57343||(t+=String.fromCodePoint(s)))}return t}class Gt extends Error{}function $t(i){const e=new DOMParser().parseFromString(i,"application/xml");if(e.getElementsByTagName("parsererror").length>0)throw new Gt("Could not read XML.");const t=e.documentElement;if(!t||t.tagName!=="struktogramm")throw new Gt("Invalid XML: root element is not <struktogramm>.");const n={caption:Xt(t,"caption")??"",elements:wt(t)},s=Xt(t,"fontfamily");s!==void 0&&(n.fontFamily=s);const r=ze(t,"fontsize");r!==void 0&&(n.fontSize=r);const a=ze(t,"fontstyle");return a!==void 0&&(n.fontStyle=a),t.getAttribute("pseudocode")==="true"&&(n.pseudocode=!0),n}function rt(i){const e=(n,s)=>s===void 0?"":` ${n}="${Zn(s)}"`;let t=`<?xml version="1.0" encoding="UTF-8"?>
`;t+="<struktogramm",t+=e("fontfamily",i.fontFamily===void 0?void 0:He(i.fontFamily)),t+=e("fontstyle",i.fontStyle===void 0?void 0:String(i.fontStyle)),t+=e("fontsize",i.fontSize===void 0?void 0:String(i.fontSize)),t+=e("caption",He(i.caption)),t+=e("pseudocode",i.pseudocode?"true":void 0),t+=`>
`;for(const n of i.elements)t+=xt(n,"  ");return t+=`</struktogramm>
`,t}function xt(i,e){let t=`${e}<strelem typ="${i.type}" zx="${i.zoomX}" zy="${i.zoomY}"`;i.textColor&&(t+=` textcolor="${qt(i.textColor)}"`),i.backgroundColor&&(t+=` bgcolor="${qt(i.backgroundColor)}"`),t+=`>
`;for(const n of i.textLines)t+=`${e}  <text>${qi(He(n))}</text>
`;if(i.loopBody){t+=`${e}  <schleifeninhalt>
`;for(const n of i.loopBody)t+=xt(n,e+"    ");t+=`${e}  </schleifeninhalt>
`}if(i.cases)for(const n of i.cases){t+=`${e}  <fall fallname="${Zn(He(n.name))}">
`;for(const s of n.elements)t+=xt(s,e+"    ");t+=`${e}  </fall>
`}return t+=`${e}</strelem>
`,t}function Zn(i){return i.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function qi(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function qt(i){return String(i.a<<24|i.r<<16|i.g<<8|i.b|0)}function Ce(i,e){return Array.from(i.children).filter(t=>t.tagName===e)}function wt(i){const e=[];for(const t of Ce(i,"strelem")){const n=Xi(t);n&&e.push(n)}return e}function Xi(i){const e=ze(i,"typ");if(e===void 0||m[e]===void 0)return;const t={type:e,zoomX:ze(i,"zx")??0,zoomY:ze(i,"zy")??0,textLines:Ce(i,"text").map(l=>bt((l.textContent??"").trim()))},n=Yt(i.getAttribute("textcolor"));n&&(t.textColor=n);const s=Yt(i.getAttribute("bgcolor"));s&&(t.backgroundColor=s),t.textLines.length===0&&(t.textLines=[""]);const r=Ce(i,"schleifeninhalt")[0];if(r){const l=wt(r);l.length>0&&(t.loopBody=l)}const a=Ce(i,"fall").map(l=>({name:bt(l.getAttribute("fallname")??""),elements:wt(l)}));return a.length>0&&(t.cases=a),t}function Xt(i,e){const t=i.getAttribute(e);return t===null?void 0:bt(t)}function ze(i,e){const t=i.getAttribute(e);if(!(t===null||!/^[+-]?\d+$/.test(t)))return Number(t)}function Yt(i){if(i===null||!/^[+-]?\d+$/.test(i))return;const e=Number(i);if(e<-2147483648||e>2147483647)return;const t=e>>>0;return{a:t>>>24&255,r:t>>>16&255,g:t>>>8&255,b:t&255}}const Yi="http://www.w3.org/2000/svg",P={diagramLineWidth:2,outerFrameLineWidth:2,selectionLineWidth:3.5,canvasOuterMargin:16,cellTextInsetX:18,cellTextInsetY:15,multiHeaderFirstLineY:14,branchLabelInsetX:10,fallauswahlCaseLabelBand:26,callSideBarInset:14,callTextInsetFromSideBar:20,loopBodyLeadingInset:20};function B(i,e={}){const t=document.createElementNS(Yi,i);for(const[n,s]of Object.entries(e))t.setAttribute(n,String(s));return t}class Rn{constructor(e,t){p(this,"usesSimulationHighlight",!1);this.metrics=e,this.measure=t}get lineHeight(){return this.metrics.lineHeight}get fontSize(){return this.metrics.fontSize}render(e,t,n,s=P.canvasOuterMargin){const r=B("svg",{width:t.width,height:t.height,viewBox:`0 0 ${t.width} ${t.height}`,"font-family":Xe,"font-size":this.fontSize,class:"diagram"});r.append(B("rect",{x:0,y:0,width:t.width,height:t.height,fill:"#fafafa"}));const a=s;r.append(B("rect",{x:a,y:a,width:e.canvasSize.width-2*a-1,height:e.canvasSize.height-2*a-1,fill:"none",stroke:"black","stroke-width":P.outerFrameLineWidth}));const l=B("g");for(const o of e.elements)this.drawNode(o,l,n,{},void 0);return r.append(l),r}line(e,t){e.append(B("polyline",{points:t.map(n=>n.join(",")).join(" "),fill:"none",stroke:"black","stroke-width":P.diagramLineWidth,"stroke-linejoin":"miter"}))}strokeCellBorder(e,t,n){const s=t.x,r=t.y,a=t.x+t.width,l=t.y+t.height;if(!n.top&&!n.left&&!n.bottom&&!n.right){e.append(B("rect",{x:s,y:r,width:t.width,height:t.height,fill:"none",stroke:"black","stroke-width":P.diagramLineWidth}));return}n.top||this.line(e,[[s,r],[a,r]]),n.right||this.line(e,[[a,r],[a,l]]),n.bottom||this.line(e,[[a,l],[s,l]]),n.left||this.line(e,[[s,l],[s,r]])}textWidth(e){const t=jt(e);return t?this.measure(t.keyword,this.fontSize,"bold")+(t.rest===""?0:this.measure(" "+t.rest,this.fontSize,"medium")):this.measure(e,this.fontSize,"medium")}drawKeywordLine(e,t,n,s){const r=B("text",{x:n,y:s+Ut(this.fontSize,"medium").ascent,"font-weight":500});r.style.whiteSpace="pre";const a=jt(t);if(a){const l=B("tspan",{"font-weight":700});if(l.textContent=a.keyword,r.append(l),a.rest!==""){const o=B("tspan",{});o.textContent=" "+a.rest,r.append(o)}}else r.textContent=t;e.append(r)}drawLabel(e,t,n,s,r,a){const l=Ut(this.fontSize,r?"bold":"medium"),o=B("text",{x:n,y:a==="top"?s+l.ascent:s-l.descent,"font-weight":r?700:500});o.style.whiteSpace="pre",o.textContent=t,e.append(o)}roofMetrics(e,t,n,s){const r=t.y+n,a=e.dividerYInset??0,l=12,o=Math.max(e.element.textLines.length,1)*this.lineHeight,u=t.y+P.multiHeaderFirstLineY;if(e.element.type===m.fallauswahl){const d=Math.max(P.fallauswahlCaseLabelBand,this.lineHeight+10),g=r-d,x=Math.min(r+a,g-8),f=Math.max(x,u+o+6);return{apex:{x:s,y:f},maxTextBottom:g-l,roofBottom:r}}const h={x:s,y:r+a};return{apex:h,maxTextBottom:h.y-l,roofBottom:r}}drawNode(e,t,n,s,r){var N;const a=e.frame,l=e.element,o=a.x+a.width,u=a.y+a.height,h=l.type===m.verzweigung||l.type===m.fallauswahl,d=h?e.headerBandHeight:0,g=n!==void 0&&yt(e.idPath,n),x=Dt(l),f=B("g",{"data-path":e.idPath.join(",")});t.append(f);const v=this.usesSimulationHighlight,z=g&&v?"rgba(199, 230, 255, 0.55)":"white";f.append(B("rect",{x:a.x,y:a.y,width:a.width,height:a.height,fill:z})),this.strokeCellBorder(f,a,s);const y=P.callSideBarInset;if(l.type===m.aufruf?(this.line(f,[[a.x+y,a.y],[a.x+y,u]]),this.line(f,[[o-y,a.y],[o-y,u]])):l.type===m.aussprung&&this.line(f,[[a.x+y,a.y],[a.x,a.y+a.height/2],[a.x+y,u]]),h&&e.dividerX!==void 0){const D=e.dividerX,k=this.roofMetrics(e,a,d,D),A=Math.max(x.length,1)*this.lineHeight,I=a.y+P.multiHeaderFirstLineY;this.line(f,[[a.x,a.y],[k.apex.x,k.apex.y],[o,a.y]]),l.type===m.fallauswahl&&this.line(f,[[a.x,k.roofBottom],[o,k.roofBottom]]);let $;I+A<=k.maxTextBottom?$=I:$=Math.max(a.y+2,k.maxTextBottom-(Math.max(x.length,1)-1)*this.lineHeight-this.lineHeight),x.forEach((F,ee)=>{const te=this.textWidth(F);let he;if(l.type===m.verzweigung){const tt=a.x+P.cellTextInsetX,vi=o-te-P.cellTextInsetX;he=Math.min(Math.max(D-te/2,tt),vi)}else he=a.x+a.width/2-te/2;this.drawKeywordLine(f,F,he,$+ee*this.lineHeight)})}else if(l.type!==m.doUntilSchleife)if(l.type===m.anweisung||l.type===m.aufruf||l.type===m.aussprung){const D=P.cellTextInsetX;let k=a.x+D,A=o-D;l.type===m.aufruf?(k=a.x+y+P.callTextInsetFromSideBar,A=o-y-P.callTextInsetFromSideBar):l.type===m.aussprung&&(k=a.x+y+D);const I=Math.max(0,A-k);let $=a.y+a.height/2-Math.max(1,x.length)*this.lineHeight/2;for(const F of x)this.drawKeywordLine(f,F,k+(I-this.textWidth(F))/2,$),$+=this.lineHeight}else{const D=Math.max(1,x.length)*this.lineHeight;let k=r===m.doUntilSchleife?a.y+a.height/2-D/2:a.y+P.cellTextInsetY;for(const A of x)this.drawKeywordLine(f,A,a.x+P.cellTextInsetX,k),k+=this.lineHeight}e.children.forEach((D,k)=>{const A=l.type===m.doUntilSchleife&&k===0?{top:!0,left:!0}:{};this.drawNode(D,t,n,A,l.type)});const E=B("g");if(t.append(E),l.type===m.doUntilSchleife){const D=((N=e.children[0])==null?void 0:N.frame.x)??a.x+(e.loopBodyLeadingInset>0?e.loopBodyLeadingInset:P.loopBodyLeadingInset);this.drawLabel(E,"do",a.x+4,a.y+this.metrics.doUntilDoLabelTopInset,!0,"top");const k=u-e.headerBandHeight;this.line(E,[[D,k],[o,k]]),this.line(E,[[D,a.y],[D,k]]);let A=k+this.metrics.doUntilFooterTopInset;for(const I of x)this.drawKeywordLine(E,I,a.x+P.cellTextInsetX,A),A+=this.lineHeight}if(h&&e.dividerX!==void 0&&e.caseColumnFrames.length>1){const D=this.roofMetrics(e,a,d,e.dividerX),k=D.apex;e.caseColumnFrames.forEach((I,$)=>{if($>=e.caseColumnFrames.length-1)return;const F=I.x+I.width,ee=Qi(F,a,k),te=Number.isFinite(ee)?Math.min(Math.max(ee,a.y),u):a.y;this.line(E,[[F,u],[F,te]])});const A=l.cases;if(A&&A.length===e.caseColumnFrames.length){const I=l.type===m.fallauswahl?D.roofBottom-6:a.y+d-8,$=P.branchLabelInsetX;if(l.type===m.verzweigung&&A.length===2){this.drawLabel(E,"true",a.x+$,I,!0,"bottom");const F=e.caseColumnFrames[1],ee=this.measure("false",this.fontSize,"bold");this.drawLabel(E,"false",F.x+F.width-$-ee,I,!0,"bottom")}else A.forEach((F,ee)=>{const te=e.caseColumnFrames[ee],he=["default","true","false"].includes(F.name.toLowerCase()),tt=this.measure(F.name,this.fontSize,he?"bold":"medium");this.drawLabel(E,F.name,te.x+te.width/2-tt/2,I,he,"bottom")})}}g&&E.append(B("rect",{x:a.x,y:a.y,width:a.width,height:a.height,fill:"none",stroke:v?"rgba(66, 140, 242, 0.78)":"rgba(0, 122, 255, 0.9)","stroke-width":P.selectionLineWidth}))}}function Qi(i,e,t){const n=e.y;if(i<=t.x){const r=t.x-e.x;return Math.abs(r)<.5?t.y:n+(t.y-n)/r*(i-e.x)}const s=e.x+e.width-t.x;return Math.abs(s)<.5?t.y:t.y+(n-t.y)/s*(i-t.x)}function yt(i,e){return i.length===e.length&&i.every((t,n)=>t===e[n])}function es(i){const e=[],t=n=>{e.push(n),n.children.forEach(t)};return i.forEach(t),e}function Ue(i){var e,t;return{...i,textLines:Dt(i),loopBody:(e=i.loopBody)==null?void 0:e.map(Ue),cases:(t=i.cases)==null?void 0:t.map(n=>({name:n.name,elements:n.elements.map(Ue)}))}}const ts="modulepreload",ns=function(i,e){return new URL(i,e).href},Qt={},_=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let a=function(h){return Promise.all(h.map(d=>Promise.resolve(d).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};const l=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),u=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=a(t.map(h=>{if(h=ns(h,n),h in Qt)return;Qt[h]=!0;const d=h.endsWith(".css"),g=d?'[rel="stylesheet"]':"";if(!!n)for(let v=l.length-1;v>=0;v--){const z=l[v];if(z.href===h&&(!d||z.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${h}"]${g}`))return;const f=document.createElement("link");if(f.rel=d?"stylesheet":ts,d||(f.as="script"),f.crossOrigin="",f.href=h,u&&f.setAttribute("nonce",u),document.head.appendChild(f),d)return new Promise((v,z)=>{f.addEventListener("load",v),f.addEventListener("error",()=>z(new Error(`Unable to preload CSS for ${h}`)))})}))}function r(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return s.then(a=>{for(const l of a||[])l.status==="rejected"&&r(l.reason);return e().catch(r)})},je=[{code:"de",name:"Deutsch"},{code:"en",name:"English"},{code:"es",name:"Español"},{code:"fr",name:"Français"},{code:"it",name:"Italiano"},{code:"pl",name:"Polski"},{code:"tr",name:"Türkçe"},{code:"ko",name:"한국어"},{code:"ja",name:"日本語"},{code:"el",name:"Ελληνικά"},{code:"uk",name:"Українська"},{code:"ar",name:"العربية"},{code:"ru",name:"Русский"},{code:"he",name:"עברית"},{code:"nl",name:"Nederlands"},{code:"sv",name:"Svenska"},{code:"da",name:"Dansk"},{code:"nb",name:"Norsk bokmål"},{code:"zh-Hans",name:"中文（简体）"},{code:"zh-Hant",name:"中文（繁體）"},{code:"pt-PT",name:"Português"},{code:"java",name:"Java (Keywords)"}],is=Object.assign({"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ar.lproj/Localizable.strings":()=>_(()=>import("./Localizable-z5VAaalk.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/da.lproj/Localizable.strings":()=>_(()=>import("./Localizable-BpIR7ewY.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/de.lproj/Localizable.strings":()=>_(()=>import("./Localizable-B8JKPCKK.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/el.lproj/Localizable.strings":()=>_(()=>import("./Localizable-BCPGYvWZ.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/en.lproj/Localizable.strings":()=>_(()=>import("./Localizable-6J6zyq9h.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/es.lproj/Localizable.strings":()=>_(()=>import("./Localizable-rSO8GWz0.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/fr.lproj/Localizable.strings":()=>_(()=>import("./Localizable-DwJ6DjY0.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/he.lproj/Localizable.strings":()=>_(()=>import("./Localizable-BNKoKnOS.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/it.lproj/Localizable.strings":()=>_(()=>import("./Localizable-DaQXKQht.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ja.lproj/Localizable.strings":()=>_(()=>import("./Localizable-DnWi38aS.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/java.lproj/Localizable.strings":()=>_(()=>import("./Localizable-Ci3CbmUn.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ko.lproj/Localizable.strings":()=>_(()=>import("./Localizable-DShKoxUB.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/nb.lproj/Localizable.strings":()=>_(()=>import("./Localizable-D1jSslYV.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/nl.lproj/Localizable.strings":()=>_(()=>import("./Localizable-w6MBqGyy.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/pl.lproj/Localizable.strings":()=>_(()=>import("./Localizable-CAr7U7vV.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/pt-PT.lproj/Localizable.strings":()=>_(()=>import("./Localizable-BnvYUnuf.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ru.lproj/Localizable.strings":()=>_(()=>import("./Localizable-W3LHUtIu.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/sv.lproj/Localizable.strings":()=>_(()=>import("./Localizable-D2c2a7ki.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/tr.lproj/Localizable.strings":()=>_(()=>import("./Localizable-4YnTNQI_.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/uk.lproj/Localizable.strings":()=>_(()=>import("./Localizable-dODiIt72.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/zh-Hans.lproj/Localizable.strings":()=>_(()=>import("./Localizable-DwhiU4_z.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/zh-Hant.lproj/Localizable.strings":()=>_(()=>import("./Localizable-CcDcb3m7.js"),[],import.meta.url).then(i=>i.default)}),ss=Object.assign({"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/Java.strings":()=>_(()=>import("./Java-C92fuLac.js"),[],import.meta.url).then(i=>i.default)}),rs=Object.assign({"../i18n/ar.strings":()=>_(()=>import("./ar-CgE2oaEN.js"),[],import.meta.url).then(i=>i.default),"../i18n/da.strings":()=>_(()=>import("./da-5XpWLwvw.js"),[],import.meta.url).then(i=>i.default),"../i18n/de.strings":()=>_(()=>import("./de-g7QZNJWb.js"),[],import.meta.url).then(i=>i.default),"../i18n/el.strings":()=>_(()=>import("./el-BjteDhyy.js"),[],import.meta.url).then(i=>i.default),"../i18n/en.strings":()=>_(()=>import("./en-C_fO-FiW.js"),[],import.meta.url).then(i=>i.default),"../i18n/es.strings":()=>_(()=>import("./es-xVz9Iu0K.js"),[],import.meta.url).then(i=>i.default),"../i18n/fr.strings":()=>_(()=>import("./fr-BN7lyk0a.js"),[],import.meta.url).then(i=>i.default),"../i18n/he.strings":()=>_(()=>import("./he-CBebaD44.js"),[],import.meta.url).then(i=>i.default),"../i18n/it.strings":()=>_(()=>import("./it-CCjqg2kX.js"),[],import.meta.url).then(i=>i.default),"../i18n/ja.strings":()=>_(()=>import("./ja-M4g49Haw.js"),[],import.meta.url).then(i=>i.default),"../i18n/ko.strings":()=>_(()=>import("./ko-CSEJ-ali.js"),[],import.meta.url).then(i=>i.default),"../i18n/nb.strings":()=>_(()=>import("./nb-otpbEZJ4.js"),[],import.meta.url).then(i=>i.default),"../i18n/nl.strings":()=>_(()=>import("./nl-CN2ZPH_z.js"),[],import.meta.url).then(i=>i.default),"../i18n/pl.strings":()=>_(()=>import("./pl-Cz72B5Ji.js"),[],import.meta.url).then(i=>i.default),"../i18n/pt-PT.strings":()=>_(()=>import("./pt-PT-BxGkxvyI.js"),[],import.meta.url).then(i=>i.default),"../i18n/ru.strings":()=>_(()=>import("./ru-NBrK4n_9.js"),[],import.meta.url).then(i=>i.default),"../i18n/sv.strings":()=>_(()=>import("./sv-nm0fda_v.js"),[],import.meta.url).then(i=>i.default),"../i18n/tr.strings":()=>_(()=>import("./tr-DjfQdU1I.js"),[],import.meta.url).then(i=>i.default),"../i18n/uk.strings":()=>_(()=>import("./uk-DQjeHCaU.js"),[],import.meta.url).then(i=>i.default),"../i18n/zh-Hans.strings":()=>_(()=>import("./zh-Hans-iuotT0AU.js"),[],import.meta.url).then(i=>i.default),"../i18n/zh-Hant.strings":()=>_(()=>import("./zh-Hant-BDp8zS8f.js"),[],import.meta.url).then(i=>i.default)});function at(i,e){var t;return(t=Object.entries(i).find(([n])=>n.endsWith(e)))==null?void 0:t[1]}function as(i){const e=new Map,t=i.replace(/\/\*[\s\S]*?\*\//g,"").replace(/^\s*\/\/.*$/gm,""),n=/"((?:[^"\\]|\\.)*)"\s*=\s*"((?:[^"\\]|\\.)*)"\s*;/g,s=r=>r.replace(/\\(u[0-9a-fA-F]{4}|.)/g,(a,l)=>l==="n"?`
`:l==="t"?"	":l.startsWith("u")&&l.length===5?String.fromCharCode(parseInt(l.slice(1),16)):l);for(const r of t.matchAll(n))e.set(s(r[1]),s(r[2]));return e}async function en(i){const e=i==="java"?at(ss,"/Java.strings"):at(is,`/${i}.lproj/Localizable.strings`),t=at(rs,`/${i}.strings`),n=new Map;for(const s of[e,t])if(s)for(const[r,a]of as(await s()))n.set(r,a);return n}let On="en",Hn=new Map,Ne=new Map;const Un="appLanguageCode";function ls(){const i=new URLSearchParams(location.search).get("lang");if(i&&je.some(e=>e.code===i))return i;try{const e=localStorage.getItem(Un);if(e&&je.some(t=>t.code===e))return e}catch{}for(const e of navigator.languages??[navigator.language]){const t=e.toLowerCase();if(t.startsWith("zh"))return/hant|tw|hk|mo/.test(t)?"zh-Hant":"zh-Hans";if(t.startsWith("pt"))return"pt-PT";if(t.startsWith("no")||t.startsWith("nn"))return"nb";if(t.startsWith("iw"))return"he";const n=je.find(s=>s.code!=="java"&&s.code===t.split("-")[0]);if(n)return n.code}return"en"}async function Kn(i,e=!0){if(Ne.size===0&&(Ne=await en("en")),Hn=i==="en"?Ne:await en(i),On=i,e)try{localStorage.setItem(Un,i)}catch{}const t=document.documentElement;t.lang=i==="java"?"en":i,t.dir=i==="ar"||i==="he"?"rtl":"ltr"}function zt(){return On}function c(i,...e){const t=Hn.get(i)??Ne.get(i)??i;if(e.length===0)return t;let n=0;return t.replace(/%(?:(\d+)\$)?[@d]/g,(s,r)=>String(e[r?Number(r)-1:n++]??""))}const Jn={baseIndent:0,indentPerLevel:4,includeDiagramTextAsComments:!1,includeEmptyElseBranch:!0,pseudocodeNote:"Pseudocode – not a runnable program"};function Gn(i,e,t={}){const n={...Jn,...t,jsIntVariables:new Set,arrayElementTypes:bs(i),stringVariables:fs(i)};let s="";e==="javascript"&&(s+=`"use strict";

`,n.jsIntVariables=nn(i)),e==="python"&&(n.jsIntVariables=nn(i)),e==="python"&&Ws(i)&&(s+=`import random

`),e==="java"&&ri(i)&&(s+=`// import java.util.Scanner;
`,s+=`Scanner scanner = new Scanner(System.in);

`),i.pseudocode&&(s+=(e==="python"?"# ":"// ")+n.pseudocodeNote+`

`);const r={out:s};for(const a of i.elements)Pt(a,e,n,n.baseIndent,r);if(s=r.out,s.trim()===""){const a=os(e);return e==="javascript"?`"use strict";

`+a:a}return Ms(s.replace(/^[\n\r]+|[\n\r]+$/g,""),e)}const w=i=>i>0?" ".repeat(i):"";function T(i,e){const t=i.exec(e);return t?Array.from(t,n=>n??""):void 0}function os(i,e){return i==="python"?"# empty element":"// empty element"}const vt=i=>i.trim()==="ø";function qn(i,e){return w(i)+(e==="python"?`# empty element
`:`// empty element
`)}function us(i){switch(i.type){case m.leerElement:return!0;case m.anweisung:case m.aufruf:return i.textLines.map(e=>e.trim()).every(e=>e===""||vt(e));default:return!1}}function cs(i){return i.every(us)}function Tt(i,e,t){const n=i.map(s=>s.replace(/^[ \t]+|[ \t]+$/g,"")).filter(s=>s!=="");return n.length===0?"":e==="python"?w(t)+`"""
`+n.map(s=>w(t)+s+`
`).join("")+w(t)+`"""
`:n.length===1?w(t)+"/* "+n[0]+` */
`:w(t)+`/*
`+n.map(s=>w(t)+" * "+s+`
`).join("")+w(t)+` */
`}const hs=i=>i==="java"||i==="javascript";function Ke(i){const e=i.trim();if(e==="")return"";if(e.startsWith("//")||e.startsWith("/*")||e.startsWith("*")||e.startsWith("#")||e.startsWith("{")||e.startsWith("}")||e.endsWith("{")||e.endsWith(";"))return e;const t=e.toLowerCase();for(const n of["if ","else","for ","while ","do ","switch ","case ","default"])if(t.startsWith(n))return e;return e+";"}function Ze(i){const e=i.map(t=>t.trim()).filter(t=>t!=="");return ds(e.length===0?"true":e.join(" "))}function ds(i){const e=i.trim();for(const t of["if","while","until","switch"]){const n=Xn(t,e);if(n!==void 0)return n===""?"true":n}return e}function Xn(i,e){if(!e.toLowerCase().startsWith(i))return;const t=e.slice(i.length);if(!(t===""||/^\s/.test(t)||t[0]==="("))return;let n=t.trim();return n.startsWith("(")&&n.endsWith(")")&&n.length>=2&&(n=n.slice(1,-1).trim()),n}function ce(i){let e=i.trim();for(;e.endsWith(";");)e=e.slice(0,-1).trim();return e}function ms(i){const e=i.trim(),t=e.toLowerCase();let n;if(t.startsWith("output:"))n=e.slice(7).trim();else if(t.startsWith("print:"))n=e.slice(6).trim();else return;return n===""?void 0:n}const Ye=i=>i.name.includes("[")&&i.name.includes("]");function Wt(i){const e=i.trim();if(e==="")return;const t=T(/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s+([a-zA-Z_]\w*(?:\s*\[[^\]]+\])?)(?:\s+"([^"]*)")?\s*$/i,e);if(t){const r=t[2].replaceAll(" ","");if(r==="")return;const a=(t[3]??"").trim();return{type:Je(t[1]),name:r,customPrompt:a===""?void 0:a}}const n=T(/^\s*([a-zA-Z_]\w*(?:\s*\[[^\]]+\])?)\s+"([^"]*)"\s*$/i,e);if(n){const r=n[1].replaceAll(" ","");return["int","integer","long","float","double","string","boolean","char","bool","void"].includes(r.toLowerCase())?void 0:{type:r.includes("[")?"String":"int",name:r,customPrompt:n[2].trim()}}const s=gs(e);if(s)return{type:Je(s[0]),name:s[1]}}function Je(i){switch(i.trim().toLowerCase()){case"integer":case"int":return"int";case"long":return"long";case"float":return"float";case"double":return"double";case"string":return"String";case"boolean":case"bool":return"boolean";case"char":return"char";default:return i}}function gs(i){const e=i.split(/[ \t]+/).filter(Boolean);if(e.length===0)return;if(e.length>=2)return[e[0],e[1]];if(!["int","double","string","boolean","char","long","float","short","byte","void","bool","integer"].includes(e[0].toLowerCase()))return["int",e[0]]}function ps(i,e,t,n,s){const r=ce(i).trim();if(r.startsWith('"'))switch(e){case"java":return w(t)+"System.out.println("+r+`);
`;case"javascript":return w(t)+"console.log("+r+`);
`;case"python":return w(t)+"print("+De(r,n,s)+`)
`}}function Ee(i){return i.replaceAll("\\","\\\\").replaceAll('"','\\"').replaceAll(`
`,"\\n").replaceAll("\r","\\r")}function Ft(i,e){const t=i.trim();if(!t.toLowerCase().startsWith("input:"))return;const n=t.slice(6).trim();if(n==="")return;const s=Wt(n);if(s&&Ye(s)&&!/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s/i.test(n)){const r=e.get(s.name.slice(0,s.name.indexOf("[")).trim());if(r)return{...s,type:r}}return s}function fs(i){const e=new Set;return ue(i.elements,t=>{for(const n of t.textLines){const s=n.trim();if(s.toLowerCase().startsWith("input:")){const a=Wt(s.slice(6).trim());(a==null?void 0:a.type)==="String"&&!Ye(a)&&e.add(a.name);continue}const r=T(/^\s*(?:const\s+)?string\s+([a-zA-Z_]\w*)\s*=/i,s);r&&e.add(r[1])}}),e}function bs(i){const e=new Map;return ue(i.elements,t=>{for(const n of t.textLines){const s=T(/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s*\[\s*\]\s*([a-zA-Z_]\w*)/i,n)??T(/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s+([a-zA-Z_]\w*)\s*\[\s*\]/i,n);s&&e.set(s[2],Je(s[1]))}}),e}function xs(i,e,t){const n=Ft(i,t);if(!n)return;const s=n.customPrompt?n.customPrompt:n.name+": ",r=w(e)+'System.out.println("'+Ee(s)+`");
`,a=l=>Ye(n)?n.name:`${l} ${n.name}`;switch(n.type){case"int":return r+w(e)+`${a("int")} = scanner.nextInt();
`;case"double":return r+w(e)+`${a("double")} = scanner.nextDouble();
`;case"String":return r+w(e)+`${a("String")} = scanner.next();
`;case"boolean":return r+w(e)+`${a("boolean")} = scanner.nextBoolean();
`;default:return}}function ws(i,e,t){const n=Ft(i,t);if(!n)return;const s=!!n.customPrompt,r=s?"":w(e)+'console.log("'+Ee(n.name+": ")+`");
`,a=o=>{const u=s?n.customPrompt:n.name+": ";return`(prompt("${Ee(u)}") ?? "${o}")`},l=Ye(n)?n.name:`let ${n.name}`;switch(n.type){case"int":return r+w(e)+`${l} = parseInt(${a("0")}, 10);
`;case"double":return r+w(e)+`${l} = Number(${a("0")});
`;case"String":return r+w(e)+`${l} = ${a("")};
`;case"boolean":return r+w(e)+`${l} = ${a("")}.trim().toLowerCase() === "true";
`;default:return}}function ys(i,e,t){const n=Ft(i,t);if(!n)return;const s=!!n.customPrompt,r=s?"":w(e)+'print("'+Ee(n.name+": ")+`")
`,a=`input("${Ee(s?n.customPrompt:n.name+": ")}")`;switch(n.type){case"int":return r+w(e)+`${n.name} = int(${a})
`;case"double":return r+w(e)+`${n.name} = float(${a})
`;case"String":return r+w(e)+`${n.name} = ${a}
`;case"boolean":return r+w(e)+`${n.name} = ${a}.strip().lower() in ("true", "wahr")
`;default:return}}function zs(i,e,t,n,s){const r=ms(i);if(r!==void 0)switch(e){case"java":return w(t)+"System.out.println("+r+`);
`;case"javascript":return w(t)+"console.log("+r+`);
`;case"python":return w(t)+"print("+De(r,n,s)+`)
`}}function Yn(i){const e=i.map(ce).filter(t=>t!=="");return e.length===0?";;":e.join("; ")}function vs(i){const t=Yn(i).split(";"),n=Ss(t[0]);return n!==void 0&&(t[0]=n),t.join(";")}function Ss(i){const e=T(/^(\s*)(?:integer|int|long|float|double|string|boolean|char|bool)\s+(\w+)(?:\s*=\s*(.*))?\s*$/i,i);if(!e)return;const t=e[2].trim();if(t==="")return;const n=(e[3]??"").trim();return i.includes("=")&&n!==""?e[1]+`let ${t} = ${n}`:e[1]+`let ${t}`}function _s(i){const e=i.map(n=>ce(n).trim()).filter(n=>n!=="");let t=e;if(e.length===1){let n=e[0];const s=Xn("for",n);s!==void 0&&(n=s),t=n.split(";").map(r=>r.trim())}if(!(t.length!==3||t.some(n=>n==="")))return[t[0],t[1],t[2]]}function ks(i,e){let t=T(/^\s*(\w+)\s*(\+\+|--)\s*$/,i)??T(/^\s*(\+\+|--)\s*(\w+)\s*$/,i);if(t){const[n,s]=t[1]==="++"||t[1]==="--"?[t[2],t[1]]:[t[1],t[2]];return n===e?s==="++"?1:-1:void 0}if(t=T(/^\s*(\w+)\s*(\+|-)=\s*(\d+)\s*$/,i),t)return t[1]===e?(t[2]==="+"?1:-1)*Number(t[3]):void 0;if(t=T(/^\s*(\w+)\s*=\s*(\w+)\s*(\+|-)\s*(\d+)\s*$/,i),t)return t[1]===e&&t[2]===e?(t[3]==="+"?1:-1)*Number(t[4]):void 0}function tn(i,e){if(/^-?\d+$/.test(i))return String(Number(i)+e);const t=/^[\w.()[\]]+$/.test(i)?i:`(${i})`;return e>0?`${t} + ${e}`:`${t} - ${-e}`}function Es(i,e){const t=_s(i);if(!t)return;const[n,s,r]=t,a=T(/^\s*(?:integer|int|long|short|byte|double|float)?\s*([a-zA-Z_]\w*)\s*=\s*(.+)$/i,n);if(!a)return;const l=a[1],o={variable:l,init:`${l} = ${R(a[2],e)}`,condition:s,increment:r},u=T(/^\s*(\w+)\s*(<=|<|>=|>)\s*(.+)$/,s),h=ks(r,l);if(!u||u[1]!==l||h===void 0||h===0)return o;const d=R(a[2],e);let g=R(u[3],e);const x=u[2];if(h>0&&x==="<=")g=tn(g,1);else if(h<0&&x===">=")g=tn(g,-1);else if(!(h>0&&x==="<")&&!(h<0&&x===">"))return o;const f=h===1?d==="0"?[g]:[d,g]:[d,g,String(h)];return o.rangeLine=`for ${l} in range(${f.join(", ")}):`,o}function Qn(i){const e=ce(i).trim();if(e==="")return;const t=T(/^\s*const\s+(integer|int|long|float|double|string|boolean|char|bool)\s+(\w+)(?:\s*=\s*(.*))?$/i,e);if(!t)return;const n=t[2].trim();if(n==="")return;if(!e.includes("="))return{rawType:t[1].trim(),name:n};const s=(t[3]??"").trim();if(s!=="")return{rawType:t[1].trim(),name:n,rhs:s}}function Ds(i,e,t,n){var l;const s=Qn(i);if(!s)return;const r=Je(s.rawType),a=(l=s.rhs)==null?void 0:l.trim();switch(e){case"java":return w(t)+Ke(a?`final ${r} ${s.name} = ${a}`:`final ${r} ${s.name}`)+`
`;case"javascript":return a?w(t)+Ke(`const ${s.name} = ${a}`)+`
`:w(t)+`let ${s.name};  // from diagram: const ${r} ${s.name}
`;case"python":return a?w(t)+`${s.name} = ${et(a,n)}  # const ${r}
`:w(t)+`${s.name} = None  # const ${r}, uninitialized
`}}function Ls(i){const e=ce(i).trim();if(e==="")return;const t=T(/^\s*(?:integer|int|long|float|double|string|boolean|char|bool)(?:\s*\[\s*\]\s+(\w+)|\s+(\w+)(\s*\[\s*\])?)\s*=\s*(.*)$/i,e);if(!t)return;const n=t[1]===""?t[2]:t[1],s=t[4].trim();if(s!=="")return{name:n,rhs:s,isArray:t[1]!==""||t[3]!==""}}function Qe(i){const e=T(/^\s*\(\s*int(?:eger)?\s*\)\s*\(?\s*(.+?)\s*\)?\s*$/i,i),t=e==null?void 0:e[1].trim();return t||void 0}function et(i,e=new Set){const t=i.trim();if(t==="null")return"None";const n=Qe(t);return n!==void 0?`int(${et(n,e)})`:R(t,e)}function As(i,e){let t="",n="",s=0;for(;s<i.length;){if(i[s]!=='"'){n+=i[s++];continue}t+=e(n),n="";let r=s+1;for(;r<i.length&&i[r]!=='"';)r+=i[r]==="\\"?2:1;t+=i.slice(s,r+1),s=r+1}return t+e(n)}function R(i,e){const t=i.replace(/\.equals\(\s*("(?:[^"\\]|\\.)*"|[^()"]*?)\s*\)/g," == $1"),n=s=>/^\d+$/.test(s)||e.has(s);return As(t,s=>s.replace(/\bMath\.random\s*\(\s*\)/gi,"random.random()").replace(/===/g,"==").replace(/!==/g,"!=").replace(/\s*&&\s*/g," and ").replace(/\s*\|\|\s*/g," or ").replace(/!(?!=)\s*/g,"not ").replace(/\btrue\b/g,"True").replace(/\bfalse\b/g,"False").replace(/\bnull\b/g,"None").replace(new RegExp("(?<![\\w.])([a-zA-Z_]\\w*|\\d+)\\s*\\/\\s*([a-zA-Z_]\\w*|\\d+)(?![\\w.(\\[])","g"),(r,a,l)=>n(a)&&n(l)?`${a} // ${l}`:r))}function ei(i){const e=[];let t=0,n="",s=!1;for(let r=0;r<i.length;r++){const a=i[r];if(s){n+=a,a==="\\"&&r+1<i.length?n+=i[++r]:a==='"'&&(s=!1);continue}if(a==='"')s=!0;else if(a==="("||a==="[")t++;else if(a===")"||a==="]")t--;else if(a==="+"&&t===0){e.push(n.trim()),n="";continue}n+=a}return e.push(n.trim()),e}const Vt=i=>/^"(?:[^"\\]|\\.)*"$/.test(i);function De(i,e,t){const n=ei(i),s=r=>Vt(r)||t.has(r);return n.length<2||!n.some(s)||n.some(r=>r==="")?R(i,e):n.map(r=>s(r)?r:`str(${R(r,e)})`).join(" + ")}function ti(i,e,t=new Set){const n=ce(i).trim(),s=T(/^(\w+(?:\[[^\]]*\])?)\s*(\+\+|--)$/,n)??T(/^(\+\+|--)\s*(\w+(?:\[[^\]]*\])?)$/,n);if(s){const[l,o]=s[1]==="++"||s[1]==="--"?[s[2],s[1]]:[s[1],s[2]];return`${R(l,e)} ${o==="++"?"+=":"-="} 1`}const r=T(/^(\w+)\s*\/=\s*(.+)$/,n);if(r&&e.has(r[1]))return`${r[1]} //= ${R(r[2],e)}`;const a=T(/^([\w[\]. ]+?)\s*(=|\+=|-=|\*=|\/=|%=)\s*(.+)$/,n);if(a&&!a[3].startsWith("=")){const[,l,o,u]=a;let h;if(o==="+="&&t.has(l.trim())){const d=ei(u);h=De(`"" + ${u}`,e,t).replace(/^"" \+ /,""),d.length===1&&!Vt(u.trim())&&!t.has(u.trim())&&(h=`str(${R(u,e)})`)}else o==="="&&Qe(u)===void 0&&u.trim()!=="null"?h=De(u,e,t):h=o==="="?et(u,e):R(u,e);return`${l} ${o} ${h}`}return R(n,e)}const Is=i=>i.replace(/\bMath\.random\b(?!\s*\()/gi,"Math.random()");function ni(i){const e=i.trim();return e.startsWith("{")&&e.endsWith("}")?"["+e.slice(1,-1)+"]":i}function ii(i){const e=T(/^\s*new\s+(?:byte|short|int|long|float|double|boolean|char|string)\s*\[\s*(.+)\s*\]\s*$/i,i),t=e==null?void 0:e[1].trim();return t||void 0}function si(i,e){const t=i.trim();if(e){const s=ii(t);return s!==void 0?`new Array(${s})`:ni(t)}const n=Qe(t);return n!==void 0?`Math.floor(${si(n,!1)})`:Is(t)}function Bs(i,e,t){const n=i.trim();if(e){const s=ii(n);return s!==void 0?`[None] * ${s}`:R(ni(n),t)}return et(n,t)}function $s(i,e,t,n,s){if(e==="java")return;const r=Ls(i);if(!r)return;if(e==="javascript")return w(t)+Ke(`let ${r.name} = ${si(r.rhs,r.isArray)}`)+`
`;const l=!r.isArray&&Qe(r.rhs)===void 0&&r.rhs.trim()!=="null"?De(r.rhs,n,s):Bs(r.rhs,r.isArray,n);return w(t)+`${r.name} = ${l}
`}function ue(i,e){for(const t of i){e(t),t.loopBody&&ue(t.loopBody,e);for(const n of t.cases??[])ue(n.elements,e)}}function nn(i){const e=n=>["int","integer","long","short","byte"].includes(n.trim().toLowerCase()),t=new Set;return ue(i.elements,n=>{for(const s of n.textLines){const r=s.trim();if(r==="")continue;if(r.toLowerCase().startsWith("input:")){const o=Wt(r.slice(6).trim());o&&e(o.type)&&!o.name.includes("[")&&t.add(o.name);continue}const a=Qn(r);if(a&&e(a.rawType)){t.add(a.name);continue}const l=T(/^\s*(integer|int|long|short|byte)\s+([a-zA-Z_]\w*)\s*=/i,r);l&&t.add(l[2].trim())}}),t}function Ts(i,e){const t=ce(i).trim();if(t==="")return;const n=T(/^\s*([a-zA-Z_]\w*)\s*=\s*([a-zA-Z_]\w*|\d+)\s*\/\s*([a-zA-Z_]\w*|\d+)\s*$/,t);if(n){const[,r,a,l]=n;return!e.has(r)||r!==a?void 0:`${r} = Math.floor(${a} / ${l})`}const s=T(/^\s*([a-zA-Z_]\w*)\s*\/=\s*([a-zA-Z_]\w*|\d+)\s*$/,t);if(s&&e.has(s[1]))return`${s[1]} = Math.floor(${s[1]} / ${s[2]})`}function ri(i){let e=!1;return ue(i.elements,t=>{t.type===m.anweisung&&t.textLines.some(n=>n.trim().toLowerCase().startsWith("input:"))&&(e=!0)}),e}function Ws(i){let e=!1;return ue(i.elements,t=>{t.textLines.some(n=>/\bMath\.random\s*\(/i.test(n))&&(e=!0)}),e}function lt(i,e){const t=i.trim();return t===""?e==="python"?'""':"0":e==="java"||new RegExp("^\\p{N}+$","u").test(t)||Vt(t)?t:'"'+t.replaceAll('"','\\"')+'"'}function ot(i,e){const t=i.trim();if(t==="")return"";switch(e){case"java":return"/* "+t+" */";case"python":return"  # "+t;case"javascript":return" /* "+t+" */"}}function Fs(i,e,t,n,s){const r=i.map(a=>a.trim());if(!r.every(a=>a==="")){if(t.includeDiagramTextAsComments){const a=r.filter(l=>l!==""&&!vt(l));a.length>0&&(s.out+=Tt(a,e,n))}for(const a of r){if(a==="")continue;if(vt(a)){s.out+=qn(n,e);continue}const l=t.jsIntVariables??new Set,o=t.arrayElementTypes??new Map,u=t.stringVariables??new Set,h=(e==="java"?xs(a,n,o):void 0)??(e==="javascript"?ws(a,n,o):void 0)??(e==="python"?ys(a,n,o):void 0)??zs(a,e,n,l,u)??Ds(a,e,n,l)??$s(a,e,n,l,u)??ps(a,e,n,l,u);if(h!==void 0){s.out+=h;continue}let d=a;if(hs(e)){const g=e==="javascript"?Ts(a,t.jsIntVariables??new Set):void 0;d=Ke(g??a)}else e==="python"&&(d=ti(a,l,u));d!==""&&(s.out+=w(n)+d+`
`)}}}function Vs(i,e,t,n,s,r,a){s.includeDiagramTextAsComments&&(a.out+=Tt(t,n,r));const l=Ze(t),o=n==="python"?R(l,s.jsIntVariables??new Set):l;a.out+=w(r)+i+o+e}function Ps(i,e,t,n,s){const r=s.out.length;for(const l of i)Pt(l,e,t,n,s);if(e!=="python")return;s.out.slice(r).split(`
`).map(l=>l.trim()).every(l=>l===""||l.startsWith("#"))&&(s.out+=w(n)+`pass
`)}function Pt(i,e,t,n,s){const r=t.indentPerLevel,a=e==="python",l=(h,d)=>Ps(h,e,t,d,s),o=(h,d)=>Vs(h,d,i.textLines,e,t,n,s),u=(h=n)=>{t.includeDiagramTextAsComments&&(s.out+=Tt(i.textLines,e,h))};switch(i.type){case m.leerElement:s.out+=qn(n,e);return;case m.anweisung:case m.aufruf:Fs(i.textLines,e,t,n,s);return;case m.aussprung:{const h=Ze(i.textLines);i.textLines.some(d=>d.trim()!=="")&&u(),a?s.out+=w(n)+(h===""?`break
`:`break  # ${h}
`):s.out+=w(n)+(h===""?`break;
`:`break; // ${h}
`);return}case m.verzweigung:{const h=i.cases;if(!h||h.length<2)return;const d=!t.includeEmptyElseBranch&&cs(h[1].elements);a?(o("if ",`:
`),l(h[0].elements,n+r),d||(s.out+=w(n)+`else:
`,l(h[1].elements,n+r))):(o("if (",`) {
`),l(h[0].elements,n+r),d||(s.out+=w(n)+`} else {
`,l(h[1].elements,n+r)),s.out+=w(n)+`}
`);return}case m.fallauswahl:{const h=i.cases;if(!h||h.length===0)return;o(a?"match ":"switch (",a?`:
`:`) {
`),h.forEach((d,g)=>{const x=g===h.length-1;if(e==="java"){const f=x?"default -> { "+ot(d.name,e)+`
`:"case "+lt(d.name,e)+` -> {
`;s.out+=w(n+r)+f,l(d.elements,n+r*2),s.out+=w(n+r)+`}
`}else if(a){const f=x?"case _:"+ot(d.name,e):"case "+lt(d.name,e)+":";s.out+=w(n+r)+f+`
`,l(d.elements,n+r*2)}else{const f=x?"default:"+ot(d.name,e):"case "+lt(d.name,e)+":";s.out+=w(n+r)+f+`
`,l(d.elements,n+r*2),s.out+=w(n+r*2)+`break;
`}}),a||(s.out+=w(n)+`}
`);return}case m.forSchleife:if(e==="java")u(),s.out+=w(n)+"for ("+Yn(i.textLines)+`) {
`;else if(a){const h=t.jsIntVariables??new Set,d=Es(i.textLines,h);if((d==null?void 0:d.rangeLine)!==void 0)u(),s.out+=w(n)+d.rangeLine+`
`;else if(d){u(),s.out+=w(n)+d.init+`
`,s.out+=w(n)+"while "+R(d.condition,h)+`:
`;for(const g of i.loopBody??[])Pt(g,e,t,n+r,s);s.out+=w(n+r)+ti(d.increment,h)+`
`;return}else o("for ",`:
`)}else u(),s.out+=w(n)+"for ("+vs(i.textLines)+`) {
`;l(i.loopBody??[],n+r),a||(s.out+=w(n)+`}
`);return;case m.whileSchleife:o(a?"while ":"while (",a?`:
`:`) {
`),l(i.loopBody??[],n+r),a||(s.out+=w(n)+`}
`);return;case m.doUntilSchleife:{const h=Ze(i.textLines);if(a){s.out+=w(n)+`while True:
`;const d=n+r;l(i.loopBody??[],d),u(d),s.out+=w(d)+"if not ("+R(h,t.jsIntVariables??new Set)+`):
`,s.out+=w(d+r)+`break
`}else s.out+=w(n)+`do {
`,l(i.loopBody??[],n+r),u(),s.out+=w(n)+"} while ("+h+`);
`;return}case m.endlosschleife:{const h=Ze(i.textLines),d=h===""||h==="true";d||u(),a?s.out+=w(n)+(d?`while True:
`:`while True:  # ${h}
`):s.out+=w(n)+(d?`while (true) {
`:`while (true) /* ${h} */ {
`),l(i.loopBody??[],n+r),a||(s.out+=w(n)+`}
`);return}}}function Ms(i,e){switch(e){case"javascript":return i.replace(/\.length\(\)/g,".length");case"python":return i.replace(/\b([a-zA-Z_]\w*)\.length(?:\(\))?\b/g,"len($1)");case"java":return js(i)}}function Cs(i){const e="(?:byte|short|int|long|float|double|boolean|char|String)",t=[new RegExp(`\\b(?:final\\s+)?${e}\\s*\\[\\s*\\]\\s+([a-zA-Z_]\\w*)\\b`,"g"),new RegExp(`\\b(?:final\\s+)?${e}\\s+([a-zA-Z_]\\w*)\\s*\\[\\s*\\]`,"g")],n=new Set;for(const s of t)for(const r of i.matchAll(s))n.add(r[1].toLowerCase());return n}function js(i){const e=Cs(i);return i.replace(/\b([a-zA-Z_]\w*)\.length(?!\()/g,(t,n)=>e.has(n.toLowerCase())?t:`${n}.length()`)}const Ns=new Set("abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null var record sealed permits yield module open opens requires exports to uses provides with transitive".split(" "));function ai(i){const e=i.trim();if(e==="")return"Main";let t="";return Array.from(e).forEach((n,s)=>{s===0?new RegExp("\\p{L}","u").test(n)||n==="_"||n==="$"?t+=n:new RegExp("\\p{Nd}","u").test(n)?t+="_"+n:t+="_":/[\p{L}\p{M}\p{N}]/u.test(n)||n==="_"||n==="$"?t+=n:t+="_"}),t=t.replace(/_{2,}/g,"_").replace(/^_+|_+$/g,""),t===""?"Main":(new RegExp("^\\p{Nd}","u").test(t)&&(t="_"+t),Ns.has(t.toLowerCase())&&(t="_"+t),t)}function sn(i,e,t={}){const n={...Jn,...t},s=ai(e),r=Gn(i,"java",n),a=n.indentPerLevel*2,l=ri(i),o=l?Zs(r):r,u=w(a),h=o.trim()===""?"":o.split(`
`).map(g=>g.trim()===""?u:u+g).join(`
`);let d="";return l&&(d+=`import java.util.Scanner;

`),d+=`public class ${s} {
`,d+=w(n.indentPerLevel)+`public static void main(String[] args) {
`,l&&(d+=w(a)+`Scanner scanner = new Scanner(System.in);
`,h!==""&&(d+=`
`)),d+=h,h!==""&&!h.endsWith(`
`)&&(d+=`
`),d+=w(n.indentPerLevel)+`}
`,d+=`}
`,d}function Zs(i){const e=i.split(`
`);let t=0;for(e[t]==="// import java.util.Scanner;"&&t++;t<e.length&&e[t].trim()==="";)t++;for(e[t]==="Scanner scanner = new Scanner(System.in);"&&t++;t<e.length&&e[t].trim()==="";)t++;return t>=e.length?"":e.slice(t).join(`
`)}const ne={target:"visustruct.codegen.target",javaMode:"visustruct.codegen.javaOutputMode",comments:"visustruct.codegen.includeDiagramComments",emptyElse:"visustruct.codegen.includeEmptyElse"};function We(i){try{return localStorage.getItem(i)}catch{return null}}function Fe(i,e){try{localStorage.setItem(i,e)}catch{}}const Rs=()=>c("web_run_stopped_loop"),li=()=>c("web_run_cancelled"),M=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Os(i){let e=0;return i.replace(/^(\s*)while\s*\(\s*true\s*\)(?:\s*\/\*.*?\*\/)?\s*\{/gm,(t,n)=>{const s=`__visuStructLoopGuard${e++}`;return`${n}for (let ${s} = 0; ${s} < 100000 || (() => { throw new Error(${JSON.stringify(Rs())}); })(); ${s}++) {`})}function Hs(i){return Os(i).replace(/\bprompt\s*\(/g,"await __visuStructPrompt(")}const Us=`
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
  answer = (value) => (value === null ? reject(new Error(${JSON.stringify(li())})) : resolve(value))
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
`,ut=2e3;class Ks{constructor(e,t,n,s){p(this,"element");p(this,"target");p(this,"javaMode");p(this,"comments");p(this,"emptyElse");p(this,"code","");p(this,"codeView");p(this,"javaModeRow");p(this,"runButton");p(this,"saveButton");p(this,"copyButton");p(this,"runner");p(this,"runOutput");p(this,"runInput");p(this,"pseudocodeBox");p(this,"pseudocodeHint");p(this,"worker");p(this,"outputLines",[]);p(this,"droppedLines",0);p(this,"outputFrame");p(this,"pendingAnswer");this.currentDocument=e,this.saveFile=t,this.onClose=n,this.setPseudocode=s;const r=We(ne.target);this.target=r==="python"||r==="javascript"?r:"java",this.javaMode=We(ne.javaMode)==="class"?"class":"snippet",this.comments=We(ne.comments)==="true",this.emptyElse=We(ne.emptyElse)!=="false",this.element=document.createElement("aside"),this.element.className="codepanel",this.build()}refresh(){const e=this.currentDocument(),t=this.options();this.code=this.target==="java"&&this.javaMode==="class"?sn(e,this.classStem(),t):Gn(e,this.target,t),this.codeView.textContent=this.code,this.javaModeRow.hidden=this.target!=="java",this.saveButton.hidden=this.target!=="java",this.runButton.hidden=this.target!=="javascript"||!!e.pseudocode,this.runButton.hidden&&this.stopRun(!0),this.pseudocodeBox.checked=!!e.pseudocode,this.pseudocodeHint.hidden=!e.pseudocode;for(const n of this.element.querySelectorAll("[data-target]"))n.setAttribute("aria-pressed",String(n.dataset.target===this.target));for(const n of this.element.querySelectorAll("[data-java-mode]"))n.setAttribute("aria-pressed",String(n.dataset.javaMode===this.javaMode))}close(){this.stopRun(!0)}options(){return{includeDiagramTextAsComments:this.comments,includeEmptyElseBranch:this.emptyElse,pseudocodeNote:c("codegen_pseudocode_note")}}classStem(){return this.currentDocument().caption.trim()||"Main"}build(){this.element.innerHTML=`
      <div class="code-head">
        <h2>${M(c("codegen_placeholder_title"))}</h2>
        <button class="code-close" title="${M(c("menu_close"))}" aria-label="${M(c("menu_close"))}">✕</button>
      </div>
      <div class="segmented" role="group" aria-label="${M(c("web_codegen_language"))}">
        <button data-target="java">Java</button><button data-target="python">Python</button><button data-target="javascript">JavaScript</button>
      </div>
      <div class="segmented java-mode" role="group" aria-label="${M(c("codegen_java_output_mode"))}">
        <button data-java-mode="snippet">${M(c("codegen_java_output_snippet"))}</button><button data-java-mode="class">${M(c("codegen_java_output_class"))}</button>
      </div>
      <label class="check"><input type="checkbox" data-opt="comments" /> ${M(c("web_codegen_comments"))}</label>
      <label class="check"><input type="checkbox" data-opt="emptyElse" /> ${M(c("web_codegen_empty_else"))}</label>
      <label class="check"><input type="checkbox" data-opt="pseudocode" /> ${M(c("codegen_pseudocode_toggle"))}</label>
      <p class="hint pseudocode-hint" hidden>${M(c("codegen_pseudocode_hint"))}</p>
      <div class="code-actions">
        <button data-act="copy">${M(c("codegen_copy"))}</button>
        <button data-act="save">${M(c("codegen_save_java"))}</button>
        <button data-act="run" class="primary">${M(c("codegen_run_in_browser"))}</button>
      </div>
      <pre class="code-view" tabindex="0" dir="ltr"></pre>
      <div class="runner" hidden>
        <div class="runner-head"><h2>${M(c("simulation_output"))}</h2><button data-act="stop">${M(c("simulation_stop"))}</button></div>
        <pre class="runner-out" dir="ltr"></pre>
        <form class="runner-input" hidden>
          <label></label>
          <div class="sim-input-row"><input autocomplete="off" /><button type="submit">${M(c("simulation_input_submit"))}</button><button type="button" data-act="cancel">${M(c("close_unsaved_cancel"))}</button></div>
        </form>
      </div>
      <p class="hint">${M(c("codegen_generated_hint"))}</p>
    `;const e=s=>this.element.querySelector(s);this.codeView=e(".code-view"),this.javaModeRow=e(".java-mode"),this.runButton=e("[data-act=run]"),this.saveButton=e("[data-act=save]"),this.copyButton=e("[data-act=copy]"),this.runner=e(".runner"),this.runOutput=e(".runner-out"),this.runInput=e(".runner-input"),this.pseudocodeBox=e("[data-opt=pseudocode]"),this.pseudocodeHint=e(".pseudocode-hint"),this.pseudocodeBox.addEventListener("change",()=>this.setPseudocode(this.pseudocodeBox.checked)),e(".code-close").addEventListener("click",()=>this.onClose());for(const s of this.element.querySelectorAll("[data-target]"))s.addEventListener("click",()=>{this.target=s.dataset.target,Fe(ne.target,this.target),this.refresh()});for(const s of this.element.querySelectorAll("[data-java-mode]"))s.addEventListener("click",()=>{this.javaMode=s.dataset.javaMode,Fe(ne.javaMode,this.javaMode),this.refresh()});const t=e("[data-opt=comments]");t.checked=this.comments,t.addEventListener("change",()=>{this.comments=t.checked,Fe(ne.comments,String(this.comments)),this.refresh()});const n=e("[data-opt=emptyElse]");n.checked=this.emptyElse,n.addEventListener("change",()=>{this.emptyElse=n.checked,Fe(ne.emptyElse,String(this.emptyElse)),this.refresh()}),this.copyButton.addEventListener("click",()=>this.copy()),this.saveButton.addEventListener("click",()=>{const s=ai(this.classStem()),r=sn(this.currentDocument(),this.classStem(),this.options());this.saveFile(`${s}.java`,r)}),this.runButton.addEventListener("click",()=>this.run()),e("[data-act=stop]").addEventListener("click",()=>this.stopRun(!1)),e("[data-act=cancel]").addEventListener("click",()=>this.answer(null)),this.runInput.addEventListener("submit",s=>{s.preventDefault(),this.answer(this.runInput.querySelector("input").value)})}async copy(){var t;let e=!1;try{await navigator.clipboard.writeText(this.code),e=!0}catch{const n=document.createRange();n.selectNodeContents(this.codeView);const s=getSelection();s==null||s.removeAllRanges(),s==null||s.addRange(n),e=((t=document.execCommand)==null?void 0:t.call(document,"copy"))??!1}this.copyButton.textContent=c(e?"web_copied_check":"web_copy_manual"),setTimeout(()=>this.copyButton.textContent=c("codegen_copy"),2e3)}run(){this.stopRun(!0),this.runner.hidden=!1,this.runOutput.textContent="",this.outputLines=[],this.droppedLines=0,this.runOutput.classList.remove("error");const e=Hs(this.code),t=n=>this.onRunnerMessage(n);try{const n=URL.createObjectURL(new Blob([Us],{type:"text/javascript"})),s=new Worker(n);URL.revokeObjectURL(n),s.onmessage=r=>t(r.data),s.onerror=r=>{r.preventDefault(),t({type:"error",text:r.message||c("web_run_error")})},s.postMessage({type:"run",code:e}),this.worker=s}catch{this.runInPage(e,t)}this.setRunning(!0)}runInPage(e,t){const n={log:(...a)=>t({type:"log",lines:[a.map(l=>typeof l=="string"?l:JSON.stringify(l)).join(" ")]})},s=a=>new Promise((l,o)=>{this.pendingAnswer=u=>u===null?o(new Error(li())):l(u),t({type:"prompt",text:a})}),r=(async()=>{}).constructor;new r("__visuStructPrompt","console",e)(s,n).then(()=>t({type:"done"})).catch(a=>t({type:"error",text:String(a)}))}onRunnerMessage(e){switch(e.type){case"log":this.appendOutput(e.lines??[]);break;case"prompt":{this.runInput.hidden=!1,this.runInput.querySelector("label").textContent=e.text??"";const t=this.runInput.querySelector("input");t.value="",t.focus();break}case"error":this.appendOutput([e.text??""]),this.runOutput.classList.add("error"),this.stopRun(!1);break;case"done":this.stopRun(!1);break}}appendOutput(e){this.outputLines.push(...e),this.outputLines.length>ut&&(this.droppedLines+=this.outputLines.length-ut,this.outputLines.splice(0,this.outputLines.length-ut)),this.outputFrame===void 0&&(this.outputFrame=requestAnimationFrame(()=>{this.outputFrame=void 0;const t=this.droppedLines>0?c("web_run_dropped_fmt",this.droppedLines)+`
`:"";this.runOutput.textContent=t+this.outputLines.join(`
`)+(this.outputLines.length?`
`:""),this.runOutput.scrollTop=this.runOutput.scrollHeight}))}answer(e){var t;this.runInput.hidden=!0,this.worker?this.worker.postMessage({type:"answer",value:e}):(t=this.pendingAnswer)==null||t.call(this,e),this.pendingAnswer=void 0}stopRun(e){var t;(t=this.worker)==null||t.terminate(),this.worker=void 0,this.pendingAnswer=void 0,this.runInput&&(this.runInput.hidden=!0),e&&this.runner&&(this.runner.hidden=!0),this.setRunning(!1)}setRunning(e){const t=this.element.querySelector("[data-act=stop]");t&&(t.disabled=!e)}}function oi(i){switch(i.kind){case"finished":return"Simulation finished.";case"infiniteLoopWithoutBody":return"Infinite loop has no body.";case"unsupportedStatement":return`Unsupported statement: ${i.text}`;case"invalidExpression":return`Invalid expression: ${i.text}`;case"unknownVariable":return`Unknown variable: ${i.text}`;case"divisionByZero":return"Division by zero.";case"wholeNumberExpected":return"Please enter a whole number.";case"numberExpected":return"Please enter a number.";case"booleanExpected":return"Please enter true or false.";case"other":return i.text}}class oe extends Error{constructor(e){super(oi(e)),this.notice=e}}const O=i=>new oe({kind:"unsupportedStatement",text:i}),L=i=>new oe({kind:"invalidExpression",text:i}),be=i=>new oe({kind:"unknownVariable",text:i}),Js=()=>new oe({kind:"divisionByZero"});function rn(i){return i instanceof oe?i.notice:{kind:"other",text:i instanceof Error?i.message:String(i)}}function Gs(i){if(i===0)return"0";if(!Number.isFinite(i))return Number.isNaN(i)?"nan":i>0?"inf":"-inf";const e=Math.floor(Math.log10(Math.abs(Number(i.toPrecision(12)))));if(e<-4||e>=12){const[n,s]=i.toExponential(11).split("e"),r=n.includes(".")?n.replace(/0+$/,"").replace(/\.$/,""):n,a=Number(s);return`${r}e${a<0?"-":"+"}${String(Math.abs(a)).padStart(2,"0")}`}const t=i.toFixed(Math.max(0,11-e));return t.includes(".")?t.replace(/0+$/,"").replace(/\.$/,""):t}function an(i){return Number.isFinite(i)&&Math.round(i)===i?i.toFixed(1):Gs(i)}function U(i){switch(i.kind){case"int":return String(i.value);case"double":return an(i.value);case"string":return i.value;case"boolean":return String(i.value);case"intArray":return"["+i.value.map(String).join(", ")+"]";case"doubleArray":return"["+i.value.map(an).join(", ")+"]";case"stringArray":return"["+i.value.join(", ")+"]"}}function qs(i){return i.kind==="int"||i.kind==="double"?i.value:NaN}const me=i=>({kind:"int",value:i}),X=i=>({kind:"double",value:i}),ui=i=>i!==void 0&&/\s/u.test(i),Ge=i=>new RegExp("\\p{L}","u").test(i),xe=i=>new RegExp("\\p{N}","u").test(i);function ve(i){const e=Array.from(i);return e.length===0||!(Ge(e[0])||e[0]==="_")?!1:e.every(t=>Ge(t)||xe(t)||t==="_")}function de(i){switch(i.toLowerCase()){case"int":return"int";case"double":return"double";case"string":return"string";case"boolean":case"bool":return"boolean";default:return}}function Xs(i){return i.kind==="int"?"int":i.kind==="double"?"double":i.kind==="boolean"?"boolean":"string"}function re(i){const e=Array.from(i);if(!(e.length<2||e[0]!=='"'||e[e.length-1]!=='"'))return e.slice(1,-1).join("").replaceAll('\\"','"').replaceAll("\\n",`
`)}function ln(i){return i.replaceAll("(int)","").replaceAll("(double)","").trim()}function Mt(i){const e=new Array(i.length).fill(!1);let t=0,n=!1,s=!1;return i.forEach((r,a)=>{if(n){s?s=!1:r==="\\"?s=!0:r==='"'&&(n=!1);return}switch(r){case'"':n=!0;break;case"(":case"[":t+=1;break;case")":case"]":t-=1;break;default:e[a]=t===0}}),e}function on(i,e){const t=Array.from(i),n=Array.from(e),s=Mt(t),r=[];let a=[],l=0;for(;l<t.length;){const o=l+n.length;if(o<=t.length&&n.every((u,h)=>t[l+h]===u)&&s.slice(l,o).every(Boolean)){r.push(a.join("").trim()),a=[],l=o;continue}a.push(t[l]),l+=1}return r.push(a.join("").trim()),r}function Ys(i){const e=Array.from(i),t=Mt(e);for(let n=0;n<e.length;n++){if(!t[n])continue;let s;if(n+1<e.length&&t[n+1]){const l=e[n]+e[n+1];[">=","<=","==","!="].includes(l)&&(s=l)}if(s===void 0&&(e[n]==="<"||e[n]===">")&&(s=e[n]),s===void 0)continue;const r=e.slice(0,n).join("").trim(),a=e.slice(n+s.length).join("").trim();return{lhs:r,op:s,rhs:a}}}function ci(i,e){let t=0,n=!1,s=!1;for(let r=e;r<i.length;r++){const a=i[r];if(n){s?s=!1:a==="\\"?s=!0:a==='"'&&(n=!1);continue}if(a==='"')n=!0;else if(a==="(")t+=1;else if(a===")"&&(t-=1,t===0))return r}}function hi(i){const e=Array.from(i);if(!(e[0]!=="("||e[e.length-1]!==")"||ci(e,0)!==e.length-1))return e.slice(1,-1).join("").trim()}function Qs(i){const e=Array.from(i),t=Array.from(".equals(");if(e[e.length-1]!==")")return;const n=Mt(e);for(let s=0;s<e.length;s++){if(!n[s]||s+t.length>e.length||!t.every((a,l)=>e[s+l]===a))continue;const r=s+t.length-1;if(ci(e,r)===e.length-1)return{lhs:e.slice(0,s).join("").trim(),rhs:e.slice(r+1,-1).join("").trim()}}}function Ve(i){const e=i.trim();for(const t of["if","while","until","switch"]){if(!e.startsWith(t))continue;const n=e.slice(t.length);if(!(n===""||ui(n[0])||n[0]==="("))continue;let s=n.trim();const r=hi(s);return r!==void 0&&(s=r),s===""?"true":s}return e===""?"true":e}function Re(i){const e=i.trim(),t=e.indexOf("[");if(!e.endsWith("]")||t<0)return;const n=e.slice(0,t).trim();if(ve(n))return{arrayName:n,indexExpression:e.slice(t+1,-1)}}function un(i){return ve(i)||Re(i)!==void 0}function cn(i){const e=[];let t="",n=!1,s=!1;for(const r of i){if(s){t+=r,s=!1;continue}if(r==="\\"){t+=r,s=!0;continue}if(r==='"'){n=!n,t+=r;continue}if(r==="+"&&!n){e.push(t),t="";continue}t+=r}if(n)throw L(i);return e.push(t),e}function hn(i){const e=Array.from(i),t=[];let n=0;for(;n<e.length;){const s=e[n];if(ui(s)){n+=1;continue}if(xe(s)||s==="."&&n+1<e.length&&xe(e[n+1])){const r=n;let a=0;for(;n<e.length;){if(e[n]==="."){if(a+=1,a>1)throw L(i)}else if(!xe(e[n]))break;n+=1}const l=e.slice(r,n).join("");if(l==="."||!/^[0-9]*\.?[0-9]*$/.test(l))throw L(i);t.push({t:"number",literal:l,value:Number(l)});continue}if(Ge(s)||s==="_"){const r=n;for(;n<e.length&&(Ge(e[n])||xe(e[n])||e[n]==="_");)n+=1;t.push({t:"identifier",name:e.slice(r,n).join("")});continue}if("+-*/%.()[]".includes(s)){t.push({t:s}),n+=1;continue}throw L(i)}return t}class e1{constructor(e,t){p(this,"index",0);this.tokens=e,this.variables=t}parseInt(){const e=this.expression();if(this.index!==this.tokens.length||!Number.isFinite(e))throw L("");return Math.trunc(e)}parseDouble(){const e=this.expression();if(this.index!==this.tokens.length)throw L("");return e}get current(){return this.tokens[this.index]}kind(){var e;return(e=this.tokens[this.index])==null?void 0:e.t}isIdent(e){const t=this.current;return(t==null?void 0:t.t)==="identifier"&&t.name===e}expression(){let e=this.term();for(let t=this.current;t&&(t.t==="+"||t.t==="-");t=this.current){this.index+=1;const n=this.term();e=t.t==="+"?e+n:e-n}return e}term(){let e=this.factor();for(let t=this.current;t&&(t.t==="*"||t.t==="/"||t.t==="%");t=this.current){this.index+=1;const n=this.factor();if(t.t==="*")e*=n;else{if(n===0)throw Js();e=t.t==="/"?e/n:e%n}}return e}factor(){const e=this.current;if(!e)throw L("");switch(this.index+=1,e.t){case"number":return e.value;case"identifier":{const t=e.name;if(t==="Math"&&this.kind()==="."){if(this.index+=1,!this.isIdent("random"))throw L(t);if(this.index+=1,this.kind()!=="("||(this.index+=1,this.kind()!==")"))throw L("Math.random");return this.index+=1,Math.random()}const n=this.variables.get(t);if(!n)throw be(t);if(this.kind()==="."){if(this.index+=1,!this.isIdent("length"))throw L(t);if(this.index+=1,this.kind()==="("){if(this.index+=1,this.kind()!==")")throw L(`${t}.length`);this.index+=1}if(n.kind==="intArray"||n.kind==="doubleArray"||n.kind==="stringArray")return n.value.length;throw L(t)}if(this.kind()==="["){this.index+=1;const r=Math.trunc(this.expression());if(this.kind()!=="]")throw L(t);if(this.index+=1,n.kind==="intArray"||n.kind==="doubleArray"){if(!(r>=0&&r<n.value.length))throw L(`${t}[${r}]`);return n.value[r]}throw L(t)}const s=qs(n);if(!Number.isFinite(s))throw L(t);return s}case"-":return-this.factor();case"(":{const t=this.expression();if(this.kind()!==")")throw L("");return this.index+=1,t}default:throw L("")}}}function t1(i){let e=i.trim();for(;e.endsWith(";");)e=e.slice(0,-1).trim();return e}function dn(i){const e=i.slice(0,3);for(;e.length<3;)e.push("");return e}function St(i){const e=i.map(t=>t1(t).trim());return e.length===1&&e[0].includes(";")?dn(e[0].split(";").map(t=>t.trim())):dn(e)}function q(i,e=[]){const t=[];return i.forEach((n,s)=>{const r=[...e,s],a=n.textLines.join(" ").trim();switch(n.type){case m.anweisung:a!==""&&a!=="ø"&&t.push({path:r,text:a,kind:"statement"});break;case m.verzweigung:t.push({path:r,text:a||"true",kind:"branch",cases:n.cases});break;case m.fallauswahl:t.push({path:r,text:a||"0",kind:"switchSelection",cases:n.cases});break;case m.forSchleife:t.push({path:r,text:a,kind:"forLoopStart",loopBody:n.loopBody,forParts:St(n.textLines)});break;case m.whileSchleife:t.push({path:r,text:a||"true",kind:"whileLoop",loopBody:n.loopBody});break;case m.doUntilSchleife:t.push({path:r,text:a||"true",kind:"doUntilLoop",loopBody:n.loopBody});break;case m.endlosschleife:t.push({path:r,text:a||"true",kind:"infiniteLoop",loopBody:n.loopBody});break}}),t}function n1(i,e){const t=i.trim().replaceAll(",",".");switch(e){case"int":if(!/^[+-]?[0-9]+$/.test(t))throw new oe({kind:"wholeNumberExpected"});return me(Number(t));case"double":if(!/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)([eE][+-]?[0-9]+)?$/.test(t))throw new oe({kind:"numberExpected"});return X(Number(t));case"string":return{kind:"string",value:i};case"boolean":switch(t.toLowerCase()){case"true":case"wahr":return{kind:"boolean",value:!0};case"false":case"falsch":return{kind:"boolean",value:!1};default:throw new oe({kind:"booleanExpected"})}}}function mn(){return{stepIndex:0,variables:new Map,outputLines:[],isHalted:!1}}function i1(i,e){for(let t=0;t<e.length;t++){const n=e[t].name.trim();if(n.toLowerCase()!=="default"){if(i.kind==="int"){if(/^[+-]?[0-9]+$/.test(n)&&Number(n)===i.value)return t}else if(re(n)===i.value||n===i.value)return t}}}class _t{constructor(e){p(this,"steps");p(this,"state",mn());this.steps=q(e.elements)}get currentStepPath(){var e;return(e=this.steps[this.state.stepIndex])==null?void 0:e.path}get canStep(){return!this.state.isHalted&&!this.state.inputRequest&&this.state.stepIndex<this.steps.length}get message(){return this.state.notice&&oi(this.state.notice)}reset(e){e&&(this.steps=q(e.elements)),this.state=mn()}step(){const e=this.state;if(!this.canStep){!e.inputRequest&&!e.isHalted&&(e.notice={kind:"finished"});return}const t=this.steps[e.stepIndex];try{switch(t.kind){case"statement":this.executeStatement(t.text);break;case"branch":return this.executeBranch(t);case"switchSelection":return this.executeSwitchSelection(t);case"forLoopStart":return this.executeForLoopStart(t);case"forLoopCondition":return this.executeForLoopCondition(t);case"forLoopIncrement":return this.executeForLoopIncrement(t);case"whileLoop":return this.executeWhileLoop(t);case"doUntilLoop":return this.enterDoUntilLoop(t);case"doUntilCondition":return this.executeDoUntilCondition(t);case"infiniteLoop":return this.enterInfiniteLoop(t)}if(e.inputRequest){e.notice=void 0;return}e.stepIndex+=1,e.notice=this.finishedIfAtEnd()}catch(n){e.notice=rn(n),e.isHalted=!0}}provideInput(e){const t=this.state.inputRequest;if(t){try{const n=n1(e,t.valueType);this.assignValue(n,t.variableName),this.state.lastTrace=`${t.variableName} = input -> ${U(n)}`}catch(n){this.state.inputErrorNotice=rn(n);return}this.state.inputRequest=void 0,this.state.inputErrorNotice=void 0,this.state.stepIndex+=1,this.state.notice=this.finishedIfAtEnd()}}finishedIfAtEnd(){return this.state.stepIndex>=this.steps.length?{kind:"finished"}:void 0}splice(e){this.steps.splice(this.state.stepIndex,1,...e)}noticeAfterEntering(e){return e.length>0?void 0:this.finishedIfAtEnd()}executeBranch(e){const t=e.cases;if(!t||t.length<2)throw O(e.text);const n=Ve(e.text),s=this.evaluateBool(n),r=s?0:1,a=q(t[r].elements,[...e.path,r]);this.splice(a),this.state.lastTrace=`${n} -> ${s}`,this.state.notice=this.noticeAfterEntering(a)}executeSwitchSelection(e){const t=e.cases;if(!t||t.length===0)throw O(e.text);const n=Ve(e.text),s=this.evaluateSwitchSelector(n),r=i1(s,t)??t.length-1,a=q(t[r].elements,[...e.path,r]);this.splice(a),this.state.lastTrace=`${n} -> ${t[r].name}`,this.state.notice=this.noticeAfterEntering(a)}executeForLoopStart(e){const t=St(e.forParts??[e.text]);t[0]!==""&&this.executeStatement(t[0]),this.splice([{path:e.path,text:t[1],kind:"forLoopCondition",loopBody:e.loopBody,forParts:t}])}executeForLoopCondition(e){const t=St(e.forParts??[e.text]),n=t[1]===""?"true":t[1],s=this.evaluateBool(n);if(this.state.lastTrace=`${n} -> ${s}`,s){const r=q(e.loopBody??[],[...e.path,0]);this.splice([...r,{path:e.path,text:t[2],kind:"forLoopIncrement",loopBody:e.loopBody,forParts:t},{path:e.path,text:t[1],kind:"forLoopCondition",loopBody:e.loopBody,forParts:t}])}else this.splice([]),this.state.notice=this.finishedIfAtEnd()}executeForLoopIncrement(e){const t=e.text.trim();t!==""&&this.executeIncrement(t),this.splice([])}executeWhileLoop(e){const t=Ve(e.text),n=this.evaluateBool(t);if(this.state.lastTrace=`${t} -> ${n}`,n){const s=q(e.loopBody??[],[...e.path,0]);this.splice([...s,{path:e.path,text:e.text,kind:"whileLoop",loopBody:e.loopBody}]),this.state.notice=this.noticeAfterEntering(s)}else this.splice([]),this.state.notice=this.finishedIfAtEnd()}enterDoUntilLoop(e){const t=q(e.loopBody??[],[...e.path,0]);this.splice([...t,{path:e.path,text:e.text,kind:"doUntilCondition",loopBody:e.loopBody}]),this.state.notice=this.noticeAfterEntering(t)}executeDoUntilCondition(e){const t=Ve(e.text),n=this.evaluateBool(t);if(this.state.lastTrace=`${t} -> ${n}`,n){const s=q(e.loopBody??[],[...e.path,0]);this.splice([...s,{path:e.path,text:e.text,kind:"doUntilCondition",loopBody:e.loopBody}])}else this.splice([]),this.state.notice=this.finishedIfAtEnd()}enterInfiniteLoop(e){const t=q(e.loopBody??[],[...e.path,0]);this.splice([...t,{path:e.path,text:e.text,kind:"infiniteLoop",loopBody:e.loopBody}]),this.state.lastTrace="true -> true",this.state.notice=t.length>0?void 0:{kind:"infiniteLoopWithoutBody"}}executeStatement(e){const t=this.state,n=e.trim(),s=n.toLowerCase();if(s.startsWith("input:")){t.inputRequest=this.parseInputRequest(n),t.inputErrorNotice=void 0;return}if(s.startsWith("output:")||s.startsWith("print:")){const x=n.slice(s.startsWith("output:")?7:6),f=this.renderOutputExpression(x),v=this.evaluateOutputExpression(x);t.outputLines.push(v),t.lastTrace=`${f} -> ${v}`;return}if(n.endsWith("++")||n.endsWith("--")||n.includes("+=")||n.includes("-=")){this.executeIncrement(n);return}const r=n.indexOf("=");if(r<0)throw O(n);const a=n.slice(0,r).trim(),l=n.slice(r+1),o=this.parseArrayDeclaration(a,l);if(o){t.variables.set(o.name,o.value),t.lastTrace=`${o.name} = new ${o.typeName}[${o.count}]`;return}const u=this.parseAssignmentTarget(a);let h;try{h=this.renderNumericExpression(l)}catch{h=l.trim()}let d=u.valueType;if(!d)try{d=this.inferTargetValueType(u.variableName)}catch{d="int"}const g=this.evaluateExpression(l,d);this.assignValue(g,u.variableName),t.lastTrace=`${u.variableName} = ${h} -> ${U(g)}`}executeIncrement(e){const t=this.state.variables;for(const[n,s]of[["++",1],["--",-1]]){if(!e.endsWith(n))continue;const r=e.slice(0,-2).trim(),a=t.get(r);if(!ve(r)||!a)throw O(e);const l=s>0?"+":"-";if(a.kind==="int"){t.set(r,me(a.value+s)),this.state.lastTrace=`${r} = ${a.value} ${l} 1 -> ${a.value+s}`;return}if(a.kind==="double"){const o=a.value+s;t.set(r,X(o)),this.state.lastTrace=`${r} = ${U(a)} ${l} 1 -> ${U(X(o))}`;return}throw O(e)}for(const[n,s]of[["+=",1],["-=",-1]]){const r=e.indexOf(n);if(r<0)continue;const a=e.slice(0,r).trim(),l=e.slice(r+2),o=t.get(a);if(!ve(a)||!o)throw O(e);const u=s>0?"+":"-";if(o.kind==="int"){const h=this.evaluateInt(l),d=o.value+s*h;t.set(a,me(d)),this.state.lastTrace=`${a} = ${o.value} ${u} ${h} -> ${d}`;return}if(o.kind==="double"){const h=this.evaluateDouble(l),d=o.value+s*h;t.set(a,X(d)),this.state.lastTrace=`${a} = ${U(o)} ${u} ${U(X(h))} -> ${U(X(d))}`;return}throw O(e)}this.executeStatement(e)}parseAssignmentTarget(e){const t=e.split(/\s+/u).filter(Boolean);let n,s;if(t.length===1)n=t[0];else if(t.length===2&&de(t[0]))n=t[1],s=de(t[0]);else if(t.length===3&&t[0]==="const"&&de(t[1]))n=t[2],s=de(t[1]);else throw O(e);if(!un(n))throw O(e);return{variableName:n,valueType:s}}parseInputRequest(e){const t=e.slice(6).trim(),n=/^(\S+)(?:\s+(\S+))?(?:\s+([\s\S]*))?$/u.exec(t);if(!n)throw O(e);const s=[n[1],n[2],n[3]].filter(h=>h!==void 0);let r,a,l;const o=de(s[0]);if(s.length>=2&&o?(r=s[1],a=o,l=(s[2]??"").trim()):(r=s[0],a=this.inferTargetValueType(r),l=(s[1]??"").trim()),!un(r))throw O(e);const u=re(l)??l;return{variableName:r,valueType:a,prompt:u===""?`${r}:`:u}}parseArrayDeclaration(e,t){const n=e.split(/\s+/u).filter(Boolean);if(n.length!==2||!n[0].endsWith("[]"))return;const s=n[0].slice(0,-2),r=de(s),a=n[1];if(!r||r==="boolean"||!ve(a))throw O(e);const l=t.trim();if(l.startsWith("{")&&l.endsWith("}")){const g=l.slice(1,-1).split(",").map(f=>f.trim());let x;switch(r){case"int":x={kind:"intArray",value:g.map(f=>this.evaluateInt(f))};break;case"double":x={kind:"doubleArray",value:g.map(f=>this.evaluateDouble(f))};break;case"string":x={kind:"stringArray",value:g.map(f=>re(f)??this.evaluateOutputExpression(f))};break}return{name:a,typeName:s,count:g.length,value:x}}const o=`new ${s}[`;if(!l.startsWith(o)||!l.endsWith("]"))throw O(t);const u=l.slice(o.length,-1),h=this.evaluateInt(u);if(h<0)throw L(u);const d=r==="int"?{kind:"intArray",value:new Array(h).fill(0)}:r==="double"?{kind:"doubleArray",value:new Array(h).fill(0)}:{kind:"stringArray",value:new Array(h).fill("")};return{name:a,typeName:s,count:h,value:d}}arrayIndex(e){const t=this.evaluateInt(e);if(t<0)throw L(e);return t}evaluateReference(e){const t=e.trim(),n=this.state.variables.get(t);if(n)return n;const s=Re(t);if(s)return this.valueInArray(s.arrayName,this.arrayIndex(s.indexExpression))}valueInArray(e,t){const n=this.state.variables.get(e);if(!n)throw be(e);if(n.kind!=="intArray"&&n.kind!=="doubleArray"&&n.kind!=="stringArray")throw L(e);if(t>=n.value.length)throw L(`${e}[${t}]`);switch(n.kind){case"intArray":return me(n.value[t]);case"doubleArray":return X(n.value[t]);case"stringArray":return{kind:"string",value:n.value[t]}}}inferTargetValueType(e){const t=e.trim(),n=this.state.variables.get(t);if(n)return Xs(n);const s=Re(t);if(s){const r=this.state.variables.get(s.arrayName);if(!r)throw be(s.arrayName);if(r.kind==="intArray")return"int";if(r.kind==="doubleArray")return"double";if(r.kind==="stringArray")return"string";throw L(s.arrayName)}throw O(e)}assignValue(e,t){const n=t.trim(),s=Re(n);if(!s){this.state.variables.set(n,e);return}const r=this.arrayIndex(s.indexExpression),a=this.state.variables.get(s.arrayName);if(!a)throw be(s.arrayName);let l;if(a.kind==="intArray"&&e.kind==="int")l={kind:"intArray",value:[...a.value]};else if(a.kind==="doubleArray"&&(e.kind==="double"||e.kind==="int"))l={kind:"doubleArray",value:[...a.value]};else if(a.kind==="stringArray"&&e.kind==="string")l={kind:"stringArray",value:[...a.value]};else throw L(n);if(r>=l.value.length)throw L(n);l.value[r]=e.value,this.state.variables.set(s.arrayName,l)}evaluateOutputExpression(e){return cn(e).map(t=>{const n=t.trim(),s=re(n);if(s!==void 0)return s;const r=this.evaluateReference(n);return U(r||this.evaluateNumeric(n))}).join("")}renderOutputExpression(e){return cn(e).map(t=>{const n=t.trim();if(re(n)!==void 0)return n;const s=this.evaluateReference(n);if(s)return U(s);try{return this.renderNumericExpression(n)}catch{return n}}).join(" + ")}evaluateExpression(e,t){switch(t){case"int":return me(this.evaluateInt(e));case"double":return X(this.evaluateDouble(e));case"string":{const n=e.trim(),s=re(n);if(s!==void 0)return{kind:"string",value:s};const r=this.evaluateReference(n);return r?{kind:"string",value:U(r)}:{kind:"string",value:this.evaluateOutputExpression(e)}}case"boolean":return{kind:"boolean",value:this.evaluateBool(e)}}}evaluateNumeric(e){const t=this.evaluateDouble(e);return Number.isFinite(t)&&Math.round(t)===t?me(t):X(t)}parser(e){return new e1(hn(ln(e)),this.state.variables)}evaluateInt(e){return this.parser(e).parseInt()}evaluateDouble(e){return this.parser(e).parseDouble()}evaluateBool(e){const t=e.trim();if(t==="true")return!0;if(t==="false")return!1;const n=this.evaluateReference(t);if((n==null?void 0:n.kind)==="boolean")return n.value;const s=on(t,"||");if(s.length>1)return s.some(u=>this.evaluateBool(u));const r=on(t,"&&");if(r.length>1)return r.every(u=>this.evaluateBool(u));if(t.startsWith("!")&&!t.startsWith("!="))return!this.evaluateBool(t.slice(1));const a=hi(t);if(a!==void 0)return this.evaluateBool(a);const l=Qs(t);if(l)return this.evaluateComparison(l.lhs,"==",l.rhs);const o=Ys(t);if(o)return this.evaluateComparison(o.lhs,o.op,o.rhs);if(this.stringOperand(t)!==void 0)throw L(t);return this.evaluateDouble(t)!==0}evaluateComparison(e,t,n){const s=this.booleanOperand(e),r=this.booleanOperand(n);if((s!==void 0||r!==void 0)&&(t==="=="||t==="!=")){const h=s??this.evaluateBool(e),d=r??this.evaluateBool(n);return t==="=="?h===d:h!==d}const a=this.stringOperand(e),l=this.stringOperand(n);let o,u;if(a!==void 0||l!==void 0){if(a===void 0||l===void 0)throw L(`${e} ${t} ${n}`);o=a,u=l}else o=this.evaluateDouble(e),u=this.evaluateDouble(n);switch(t){case"==":return o===u;case"!=":return o!==u;case"<":return o<u;case"<=":return o<=u;case">":return o>u;case">=":return o>=u;default:throw L(`${e} ${t} ${n}`)}}booleanOperand(e){const t=e.trim();if(t==="true")return!0;if(t==="false")return!1;const n=this.evaluateReference(t);return(n==null?void 0:n.kind)==="boolean"?n.value:void 0}stringOperand(e){const t=e.trim(),n=re(t);if(n!==void 0)return n;const s=this.evaluateReference(t);return(s==null?void 0:s.kind)==="string"?s.value:void 0}evaluateSwitchSelector(e){const t=e.trim(),n=re(t);if(n!==void 0)return{kind:"text",value:n};const s=this.state.variables.get(t);if(s)switch(s.kind){case"int":return{kind:"int",value:s.value};case"double":return{kind:"int",value:Math.trunc(s.value)};case"string":return{kind:"text",value:s.value};default:throw L(t)}return/^[+-]?[0-9]+$/.test(t)?{kind:"int",value:Number(t)}:{kind:"int",value:this.evaluateInt(t)}}renderNumericExpression(e){return hn(ln(e)).map(t=>{if(t.t==="number")return t.literal;if(t.t==="identifier"){const n=this.state.variables.get(t.name);if(!n)throw be(t.name);return U(n)}return t.t}).join(" ").replaceAll("( ","(").replaceAll(" )",")").replaceAll(" . ",".").replaceAll("[ ","[").replaceAll(" ]","]")}}const s1=1e5;function r1(i,e){const t=new _t(i),n=[...e];for(let s=0;s<s1;s++){const{state:r}=t;if(r.inputRequest){const a=n.shift();if(a===void 0)return{outputs:[...r.outputLines],missingInput:!0};if(t.provideInput(a),r.inputErrorNotice)return{outputs:[...r.outputLines],error:r.inputErrorNotice};continue}if(r.isHalted)return{outputs:[...r.outputLines],error:r.notice};if(!t.canStep)return{outputs:[...r.outputLines],unusedInputs:n.length||void 0};t.step()}return{outputs:[...t.state.outputLines],tooManySteps:!0}}function a1(i,e){return i.length!==e.length?!1:i.every((t,n)=>gn(t)===gn(e[n]))}function gn(i){const e=i.trim().replace(/\s+/g," ");return/^-?\d+\.0+$/.test(e)?e.replace(/\.0+$/,""):e}function l1(i,e){return e.map(t=>{const n=r1(i,t.inputs),s=!n.error&&!n.missingInput&&!n.tooManySteps&&a1(n.outputs,t.expected);return{test:t,result:n,passed:s}})}function o1(i){const e=new Set,t=n=>{for(const s of n){e.add(s.type),s.loopBody&&t(s.loopBody);for(const r of s.cases??[])t(r.elements)}};return t(i.elements),e}const u1=`---
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

> Ein Struktogramm hat immer genau einen Anfang (oben) und ein Ende (unten). Es gibt keine Pfeile und keine Sprünge kreuz und quer.

## Drei Grundbausteine reichen

Jeder Algorithmus lässt sich aus nur drei Bausteinen zusammensetzen:

- **Sequenz:** Schritte, die nacheinander ausgeführt werden.
- **Verzweigung:** Je nach Bedingung wird der eine oder der andere Weg ausgeführt.
- **Wiederholung (Schleife):** Schritte werden wiederholt, solange eine Bedingung gilt.

::: diagramm l1-grundbausteine.visustruct
Alle drei Bausteine in einem Diagramm. Die Verzweigung erkennst du am Dreieck, die Schleife an der Klammer links.
:::

Die Kästen werden **ineinander geschachtelt**: In einer Schleife oder einem Zweig können wieder Sequenzen, Verzweigungen und Schleifen stehen.

## Erst die Struktur, dann der Code

Beim Programmieren passieren zwei Dinge gleichzeitig: Du musst dir den Ablauf überlegen und die Schreibweise der Programmiersprache beachten. Mit einem Struktogramm trennst du beides.

1. Du denkst zuerst über die **Logik** nach: Welche Schritte, welche Bedingungen, welche Wiederholungen?
2. Danach übersetzt du die fertige Struktur in **Java, Python oder JavaScript**. VisuStruct kann dir den Code sogar erzeugen.

Mit der **Simulation** kannst du dein Struktogramm außerdem Schritt für Schritt ausführen und prüfen, ob es wirklich tut, was es soll.

## Checkliste

::: checkliste
- Ich kann erklären, was ein Algorithmus ist.
- Ich weiß, dass ein Struktogramm von oben nach unten gelesen wird.
- Ich kenne die drei Grundbausteine Sequenz, Verzweigung und Wiederholung.
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

? Was ist ein Algorithmus?
- [x] Eine eindeutige Schritt-für-Schritt-Anleitung zum Lösen einer Aufgabe
- [ ] Ein bestimmtes Programm in Java
- [ ] Ein Bild, das ein Programm erklärt
> Ein Algorithmus ist unabhängig von der Programmiersprache. Ein Struktogramm ist eine Möglichkeit, ihn aufzuschreiben.
:::
`,c1=`---
titel: Der Editor
bereich: Erste Schritte
kurz: Elemente einfügen, Text eingeben, verschieben und löschen.
---

## Die Oberfläche

Der Editor besteht aus vier Bereichen:

- **Oben die Leiste:** Neu, Öffnen, Speichern, Exportieren, Rückgängig, Kopieren und Einfügen, Textgröße, Code und Simulation.
- **Links die Palette:** Hier liegen alle Elemente, die du ins Struktogramm ziehen kannst.
- **In der Mitte das Struktogramm:** Ein neues Diagramm enthält nur einen leeren Platzhalter, erkennbar an **ø**.
- **Rechts die Eigenschaften:** Hier bearbeitest du den Text des ausgewählten Elements.

> Diesen Lernbereich kannst du jederzeit über **Lernen** in der Leiste ein- und ausblenden. Er bleibt neben dem Editor offen, damit du gleich ausprobieren kannst, was du liest.

## Ein Element einfügen

Ziehe ein Element aus der Palette auf das Struktogramm. Beim Ziehen zeigt eine blaue Linie, wo es landet:

- **Auf den Platzhalter ø:** Das Element ersetzt den Platzhalter.
- **Auf die obere Hälfte eines Kastens:** Das Element kommt davor.
- **Auf die untere Hälfte eines Kastens:** Das Element kommt dahinter.

Du kannst auch ein Element in der Palette mit der Tastatur auswählen und **Enter** drücken. Dann wird es hinter dem ausgewählten Kasten eingefügt.

## Text eingeben

Klicke einen Kasten an. Er wird blau umrandet, und rechts erscheint sein Text. Was du dort tippst, siehst du sofort im Diagramm.

Bei einer **Anweisung** wählst du oben die Art:

- **Anweisung:** etwas berechnen oder festlegen, z. B. \`int zahl = 5\`
- **Eingabe:** einen Wert abfragen, z. B. \`int alter "Wie alt bist du?"\`
- **Ausgabe:** etwas anzeigen, z. B. \`"Hallo"\` oder \`zahl\`

Texte, die genau so angezeigt werden sollen, schreibst du in **Anführungszeichen**.

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
Ziehe eine Anweisung auf den Platzhalter, stelle sie rechts auf **Ausgabe** und schreibe \`"Hallo Welt"\`.
test: - -> Hallo Welt
braucht: anweisung
tipp: Achte auf die Anführungszeichen. Ohne sie sucht VisuStruct nach einer Variablen mit dem Namen Hallo.
lösung: l2-hallo-loesung.visustruct
:::

Klicke auf **Prüfen**, wenn du fertig bist. VisuStruct führt dein Struktogramm aus und vergleicht die Ausgabe.

## Übung: Zwei Zeilen

::: übung l2-zwei-zeilen
titel: Zwei Zeilen
auftrag: Gib zuerst **Hallo** und danach **Ich lerne Struktogramme** aus, jeweils in einer eigenen Zeile.
test: - -> Hallo | Ich lerne Struktogramme
tipp: Jede Ausgabe ist ein eigener Kasten. Ziehe die zweite Anweisung auf die untere Hälfte der ersten.
lösung: l2-zwei-zeilen-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann ein Element aus der Palette einfügen und einen Platzhalter ersetzen.
- Ich kann den Text eines Kastens ändern und zwischen Anweisung, Eingabe und Ausgabe umschalten.
- Ich kann Kästen verschieben, kopieren, löschen und Schritte rückgängig machen.
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
`,h1=`---
titel: Speichern, Öffnen, Exportieren
bereich: Erste Schritte
kurz: Dateien sichern, mehrere Diagramme öffnen und als Bild oder PDF weitergeben.
---

## Die Datei .visustruct

Struktogramme werden als **.visustruct**-Datei gespeichert. Dasselbe Format nutzen alle VisuStruct-Versionen: im Browser, auf Mac, iPad und iPhone und die Java-App am Rechner. Du kannst also in der Schule im Browser anfangen und zu Hause in der App weitermachen.

## Speichern und Öffnen

- **Speichern** (Strg+S): Das Diagramm wird als Datei gespeichert. Je nach Browser fragt er nach dem Ort oder legt die Datei in den Download-Ordner.
- **Öffnen** (Strg+O): Eine gespeicherte Datei wieder laden. Du kannst eine Datei auch einfach ins Browserfenster ziehen.

> Deine Übungen merkt sich der Browser automatisch. Das klappt aber nur in diesem Browser auf diesem Gerät. Wichtige Arbeiten solltest du deshalb immer zusätzlich als Datei speichern.

## Mehrere Diagramme in Reitern

Über dem Struktogramm siehst du die **Reiter**. Mit **+** oder **Neu** öffnest du ein weiteres, leeres Diagramm. Ein Punkt • vor dem Namen zeigt, dass es ungespeicherte Änderungen gibt.

Den **Titel** eines Diagramms trägst du in das Feld über dem Struktogramm ein. Er erscheint auch beim Exportieren und wird als Dateiname vorgeschlagen.

## Als Bild oder PDF weitergeben

Über **Exportieren …** in der Leiste gibst du dein Struktogramm weiter:

- **Bild (PNG):** zum Einfügen in ein Arbeitsblatt oder eine Präsentation
- **Vektorgrafik (SVG):** bleibt in jeder Größe scharf
- **PDF (A4):** eine Seite zum Abgeben oder Ausdrucken
- **Drucken** (Strg+P): direkt auf den Drucker

Mit **Text** in der Leiste stellst du die Schriftgröße ein. Ein größerer Text wirkt auch beim Exportieren als Bild.

## Ausprobieren

Öffne eine deiner Übungen aus Lektion 2 und probiere Folgendes aus:

::: checkliste
- Ich habe dem Diagramm einen Titel gegeben.
- Ich habe das Diagramm als .visustruct-Datei gespeichert und wieder geöffnet.
- Ich habe das Diagramm als Bild (PNG) oder PDF exportiert.
- Ich habe ein zweites Diagramm in einem neuen Reiter geöffnet.
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
`,d1=`---
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

## Übung: Reihenfolge ordnen

::: übung l04-reihenfolge
titel: Reihenfolge ordnen
auftrag: Im Startdiagramm stehen die richtigen Kästen, aber in der falschen Reihenfolge. Verschiebe sie so, dass am Ende **20** ausgegeben wird.
start: l04-reihenfolge-start.visustruct
test: - -> 20
braucht: anweisung
tipp: Eine Variable muss zuerst angelegt werden, bevor du mit ihr rechnest. Die Ausgabe kommt ganz zum Schluss. Rechne im Kopf nach: (2 + 3) · 4 = 20.
lösung: l04-reihenfolge-loesung.visustruct
:::

## Zwei Werte tauschen

Stell dir zwei Gläser vor: eins mit Saft, eins mit Wasser. Willst du die Inhalte tauschen, brauchst du ein drittes, leeres Glas.

Mit Variablen ist es genauso. Schreibst du einfach \`a = b\` und danach \`b = a\`, ist der alte Wert von \`a\` schon verloren. Am Ende haben beide Variablen denselben Wert.

Die Lösung ist eine **Hilfsvariable**, die den alten Wert kurz aufbewahrt:

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
tipp: Lege mit \`String hilf = links\` eine Hilfsvariable an. Danach brauchst du noch zwei Zuweisungen.
lösung: l04-tauschen-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich weiß, dass eine Sequenz von oben nach unten ausgeführt wird.
- Ich kann erklären, warum die Reihenfolge der Schritte wichtig ist.
- Ich kann zwei Werte mit einer Hilfsvariablen tauschen.
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
`,m1=`---
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

Wahrheitswerte begegnen dir vor allem in **Bedingungen**: \`alter >= 18\` ist entweder \`true\` oder \`false\`. Darum geht es in Lektion 7. Du kannst das Ergebnis einer Bedingung auch in einer Variablen speichern:

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

Die zweite Zeile liest du so: Nimm den alten Wert 10, rechne plus 5 und speichere 15 in \`punkte\`. Den Datentyp schreibst du nur beim ersten Mal, wenn die Variable angelegt wird.

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
tipp: Die Fläche ist Länge mal Breite, der Umfang ist 2 mal (Länge plus Breite). Für die Ausgabe schreibst du z. B. \`output: "Fläche: " + flaeche\`.
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
tipp: Eine Minute hat 60 Sekunden. Nutze \`/\` für die ganzen Minuten und \`%\` für den Rest. Beide Variablen sind vom Typ \`int\`.
lösung: l05-sekunden-loesung.visustruct
:::

## Übung: Einkauf

::: übung l05-einkauf
titel: Einkauf
auftrag: Du kaufst 3 Hefte zu je 2.5 Euro. Lege \`anzahl\` als \`int\` und \`preis\` als \`double\` an, berechne den Gesamtpreis in einer Variablen \`gesamt\` und gib \`Gesamt: 7.5 Euro\` aus.
test: - -> Gesamt: 7.5 Euro
braucht: anweisung
tipp: Der Gesamtpreis ist eine Kommazahl, also braucht \`gesamt\` den Typ \`double\`.
lösung: l05-einkauf-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann eine Variable mit Datentyp, Namen und Wert anlegen.
- Ich kenne die Datentypen int, double, String und boolean.
- Ich weiß, dass = eine Zuweisung ist und kein Vergleich.
- Ich kann mit + - * / % rechnen und kenne die ganzzahlige Division.
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
`,g1=`---
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

## Übung: Rechner

::: übung l06-rechner
titel: Summe und Produkt
auftrag: Frage zwei ganze Zahlen ab. Gib danach ihre Summe und ihr Produkt aus, jeweils in einer eigenen Zeile.
Bei 3 und 4 sieht das so aus: \`Summe: 7\` und \`Produkt: 12\`.
test: 3, 4 -> Summe: 7 | Produkt: 12
test: 10, -2 -> Summe: 8 | Produkt: -20
test: 0, 5 -> Summe: 5 | Produkt: 0
braucht: anweisung
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
tipp: Für Kommazahlen nimmst du den Typ \`double\`. Der Mittelwert ist die Summe geteilt durch 2. Denk an die Klammern: \`(x + y) / 2\`.
lösung: l06-mittelwert-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann das EVA-Prinzip erklären.
- Ich kann eine Eingabe mit Datentyp, Namen und Frage schreiben.
- Ich kann Text und Variablen in einer Ausgabe mit + verbinden.
- Ich rechne vor der Ausgabe in einer Variablen.
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
:::
`,p1=`---
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

Ziehe die **Verzweigung** aus der Palette ins Struktogramm. Klicke das Dreieck an und schreibe rechts die Bedingung, z. B. \`alter >= 18\`. Das Wort \`if\` steht schon davor.

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
tipp: Die Bedingung ist \`zahl < 0\`. Im true-Zweig drehst du das Vorzeichen um, z. B. mit \`zahl = 0 - zahl\`. Der false-Zweig bleibt leer.
lösung: l07-betrag-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich weiß, dass bei einer Verzweigung genau ein Zweig ausgeführt wird.
- Ich kenne die Vergleichsoperatoren == != < <= > >=.
- Ich kann == und = unterscheiden.
- Ich kann eine Verzweigung mit einem leeren Zweig bauen.
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
:::
`,f1=`---
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
tipp: Samstag ist 6, Sonntag ist 7. Verbinde die beiden Vergleiche mit \`||\`.
lösung: l08-wochenende-loesung.visustruct
:::

## Wertebereiche prüfen

Schulnoten gehen von 1 bis 6. Ob eine Note **im Bereich** liegt, prüfst du mit zwei Vergleichen und \`&&\`:

\`\`\`
note >= 1 && note <= 6
\`\`\`

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
tipp: Teilbar durch 4 heißt \`jahr % 4 == 0\`, nicht teilbar durch 100 heißt \`jahr % 100 != 0\`. Verbinde diese beiden mit \`&&\`, setze Klammern darum und hänge mit \`||\` den Fall für 400 an.
lösung: l08-schaltjahr-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich weiß, wann eine Verknüpfung mit && wahr ist.
- Ich weiß, wann eine Verknüpfung mit || wahr ist.
- Ich kann eine Bedingung mit ! umdrehen.
- Ich kann prüfen, ob ein Wert in einem Bereich wie 1 bis 6 liegt.
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
`,b1=`---
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

> Eine neue Fallauswahl hat die Fälle 1, 2 und default. Klicke einen Fall an, um rechts seinen **Fallnamen** zu ändern. Mit **Weiteren Fall hinzufügen** bekommst du eine neue Spalte vor default.

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
- Ich kann eine Fallauswahl einfügen, Fälle hinzufügen und Fallnamen ändern.
- Ich weiß, wann der Fall default ausgeführt wird.
- Ich kann entscheiden, ob eine Fallauswahl oder eine Verzweigung besser passt.
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
:::
`,x1=`---
titel: While-Schleife
bereich: Grundlagen
kurz: Schritte wiederholen, solange eine Bedingung wahr ist.
---

## Wiederholen, solange etwas gilt

Oft soll ein Programm etwas mehrmals tun. Statt denselben Kasten fünfmal hinzuschreiben, nimmst du eine **Schleife**.

Die **While-Schleife** wiederholt ihren Inhalt, **solange** ihre Bedingung wahr ist. Die Bedingung steht oben im Kopf des Kastens. Der Inhalt steht eingerückt darunter, links von einem Balken eingefasst.

::: diagramm l10-countdown.visustruct
Ein Countdown: Solange zahl größer als 0 ist, wird zahl ausgegeben und um 1 kleiner. Danach erscheint Start!
:::

## Die Bedingung kommt zuerst

Die While-Schleife ist **kopfgesteuert**. Vor **jedem** Durchlauf wird die Bedingung geprüft:

1. Bedingung prüfen.
2. Ist sie wahr, den Inhalt einmal ausführen und wieder bei 1 anfangen.
3. Ist sie falsch, geht es unter der Schleife weiter.

Im Countdown wird die Bedingung viermal geprüft: bei 3, 2 und 1 ist sie wahr, bei 0 ist sie falsch.

> Ist die Bedingung schon beim ersten Prüfen falsch, wird der Inhalt **kein einziges Mal** ausgeführt. Starte den Countdown mit \`int zahl = 0\`, dann erscheint nur Start!

## Eine Zählvariable

Viele Schleifen zählen mit. Dafür brauchst du drei Dinge:

- **Startwert vor der Schleife**, z. B. \`int i = 1\`
- **Bedingung im Kopf**, z. B. \`i <= 5\`
- **Veränderung im Inhalt**, z. B. \`i = i + 1\` (kurz \`i++\`)

Fehlt einer dieser Teile, zählt die Schleife falsch oder gar nicht.

## Übung: Zählen bis n

::: übung l10-bis-n
titel: Zählen bis n
auftrag: Frage eine ganze Zahl \`n\` ab und gib alle Zahlen von 1 bis \`n\` aus, jede in einer eigenen Zeile.
test: 3 -> 1 | 2 | 3
test: 5 -> 1 | 2 | 3 | 4 | 5
test: 1 -> 1
braucht: whileSchleife
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
tipp: Du brauchst eine zweite Variable \`int schritte = 0\`. Die Bedingung lautet \`zahl < 100\`. Im Inhalt verdoppelst du die Zahl mit \`zahl = zahl * 2\` und erhöhst \`schritte\` um 1. Ist die Zahl schon 100, läuft die Schleife gar nicht.
lösung: l10-verdoppeln-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich weiß, dass die While-Schleife ihre Bedingung vor jedem Durchlauf prüft.
- Ich kann eine Zählvariable mit Startwert, Bedingung und Veränderung verwenden.
- Ich erkenne, wenn eine Schleife nie endet, und kann den Fehler beheben.
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
:::
`,w1=`---
titel: Do-while-Schleife
bereich: Grundlagen
kurz: Erst ausführen, dann prüfen: Schleifen mit mindestens einem Durchlauf.
---

## Erst machen, dann prüfen

Die **Do-while-Schleife** ist **fußgesteuert**. Die Bedingung steht unten im Fuß des Kastens. Der Ablauf ist:

1. Den Inhalt einmal ausführen.
2. Die Bedingung prüfen.
3. Ist sie wahr, wieder bei 1 anfangen. Ist sie falsch, geht es unter der Schleife weiter.

Oben im Kasten steht \`do\`, unten im Fuß die Bedingung. Wenn du die Schleife anklickst, steht rechts vor dem Eingabefeld das Wort \`while\`: Die Bedingung bedeutet „wiederhole, solange …“.

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
tipp: Lege vor der Schleife \`int summe = 0\` und \`int zahl = 0\` an. In der Schleife fragst du \`zahl\` ab und rechnest \`summe = summe + zahl\`. Die 0 zu addieren schadet nicht. Die Schleife läuft weiter, solange \`zahl != 0\` ist.
lösung: l11-summe-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich weiß, dass die Do-while-Schleife ihre Bedingung erst nach dem Inhalt prüft.
- Ich weiß, dass der Inhalt mindestens einmal ausgeführt wird.
- Ich kann eine Eingabe so lange wiederholen lassen, bis sie gültig ist.
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
`,y1=`---
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
tipp: Rechne im Inhalt zuerst \`int produkt = zahl * i\`. Danach gibst du \`zahl + " x " + i + " = " + produkt\` aus. Denk an die Leerzeichen innerhalb der Anführungszeichen.
lösung: l12-einmaleins-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kenne die drei Teile Start, Bedingung und Schritt der For-Schleife.
- Ich weiß, in welcher Reihenfolge die drei Teile ausgeführt werden.
- Ich kann mit einer For-Schleife vorwärts, rückwärts und in größeren Schritten zählen.
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
`,z1=`---
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
tipp: Baue es wie das Dreieck. Der Unterschied: Die innere Schleife zählt immer bis \`breite\`, nicht bis zur Zeilennummer. Die äußere Schleife zählt bis \`hoehe\`.
lösung: l13-rechteck-loesung.visustruct
:::

## Den Überblick behalten

Bei verschachtelten Diagrammen hilft dir die Darstellung: Was weiter innen steht, ist eingerückt und von seiner Schleife oder seinem Zweig umschlossen.

- Lies von außen nach innen: Was wiederholt sich? Was wird bei jedem Durchlauf entschieden?
- Gib Zählvariablen sprechende Namen wie \`zeile\` und \`spalte\`. Zwei Schleifen dürfen nicht dieselbe Zählvariable verändern.
- Gehe ein Beispiel in der Simulation mit **Schritt** durch und beobachte die Variablen.

## Checkliste

::: checkliste
- Ich kann eine Verzweigung in eine Schleife setzen.
- Ich kann eine Schleife in eine andere Schleife setzen.
- Ich weiß, dass die innere Schleife bei jedem Durchlauf der äußeren komplett durchläuft.
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
`,v1=`---
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
tipp: Rechne Summe und Maximum in eigenen Variablen aus und gib sie erst am Ende aus, z. B. mit \`output: "Summe: " + summe\`. Beginnt dein Maximum bei 0, scheitert der dritte Test.
lösung: l14-summe-max-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann ein Array mit Werten oder mit \`new int[5]\` anlegen.
- Ich weiß, dass der Index bei 0 beginnt und der letzte Index \`length - 1\` ist.
- Ich kann ein Array mit einer For-Schleife durchlaufen und füllen.
- Ich kann die Summe und das Maximum eines Arrays berechnen.
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
:::
`,S1=`---
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

- Du ziehst **Aufruf** aus der Palette und schreibst den Namen hinein, z. B. \`zeigeBegruessung()\`.
- Die runden Klammern am Ende zeigen, dass es ein Unterprogramm ist. So schreibt man es auch in Java, Python und JavaScript.
- Das Unterprogramm selbst baust du als eigenes Struktogramm in einem neuen Reiter. Als Titel trägst du denselben Namen ein.

::: diagramm l15-unterprogramm.visustruct
Das Unterprogramm zeigeBegruessung() als eigenes Struktogramm.
:::

> Die Simulation führt immer nur das Diagramm im aktuellen Reiter aus. Einen Aufruf-Kasten **überspringt** sie. Willst du ein Unterprogramm testen, öffne seinen Reiter und starte dort die Simulation.

## Übung: Aufruf einbauen

::: übung l15-titel
titel: Begrüßung mit Aufruf
auftrag: Stell dir vor, das Unterprogramm \`zeigeTitel()\` gibt es schon. Baue das Hauptprogramm: Es ruft zuerst \`zeigeTitel()\` auf. Danach fragt es nach dem Namen und gibt **Hallo** und den Namen aus.
  Bei der Eingabe Ada erscheint also **Hallo Ada**.
test: Ada -> Hallo Ada
test: Ben -> Hallo Ben
braucht: aufruf
tipp: Ziehe einen Aufruf aus der Palette ganz nach oben und schreibe \`zeigeTitel()\` hinein. Darunter kommen die Eingabe \`input: String name "Wie heißt du?"\` und die Ausgabe.
lösung: l15-titel-loesung.visustruct
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

## Achtung in der Simulation

Die Simulation in VisuStruct führt den **Aussprung nicht aus**. Sie überspringt den Kasten wie einen Aufruf. Das Diagramm oben würde in der Simulation also endlos weiter nach Zahlen fragen.

So testest du ein Diagramm mit Aussprung trotzdem:

- Öffne über **Code** den erzeugten Code. Dort steht an der Stelle des Aussprungs \`break\`.
- Wähle **JavaScript** und klicke auf **Im Browser testen**. Dort funktioniert der Aussprung.

Oft geht es auch ganz ohne Aussprung: Du schreibst die Abbruchbedingung direkt in die Schleife. Das ist meist sogar übersichtlicher, und die Simulation kann es prüfen.

## Übung: Summe bis 0

::: übung l15-bis-null
titel: Summe bis 0
auftrag: Baue das Programm „Summe bis 0“ **ohne** Aussprung nach. Es fragt so lange nach ganzen Zahlen, bis jemand 0 eingibt. Danach gibt es **Summe:** und die Summe aller eingegebenen Zahlen aus.
test: 3, 4, 0 -> Summe: 7
test: 0 -> Summe: 0
test: 10, -2, 5, 0 -> Summe: 13
tipp: Frage die erste Zahl schon vor der Schleife ab. Die While-Schleife läuft mit der Bedingung \`zahl != 0\`. Im Rumpf zählst du die Zahl zur Summe und fragst danach die nächste Zahl ab. Bei der zweiten Eingabe schreibst du nur \`input: zahl "…"\`, weil es \`zahl\` schon gibt.
lösung: l15-bis-null-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann eine große Aufgabe in Teilprobleme zerlegen.
- Ich kann einen Aufruf einfügen und ein Unterprogramm in einem eigenen Reiter bauen.
- Ich weiß, was ein Aussprung macht und warum er in einer Verzweigung steht.
- Ich weiß, dass die Simulation Aufruf und Aussprung überspringt, und kann eine Schleife auch über ihre Bedingung beenden.
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

? Was macht die Simulation in VisuStruct mit einem Aussprung?
- [ ] Sie beendet das ganze Programm.
- [x] Sie überspringt ihn.
- [ ] Sie meldet einen Fehler.
> Teste Diagramme mit Aussprung deshalb über den Code mit Im Browser testen.
:::
`,_1=`---
titel: Simulation und Schreibtischtest
bereich: Vom Struktogramm zum Code
kurz: Ein Struktogramm Schritt für Schritt ausführen, von Hand nachrechnen und Fehler finden.
---

## Die Simulation starten

Mit **▶︎ Simulation** in der Leiste führt VisuStruct dein Struktogramm aus. Solange die Simulation läuft, kannst du das Diagramm nicht bearbeiten. Mit **✎ Diagramm** an derselben Stelle kehrst du zum Bearbeiten zurück.

Rechts erscheint die **Steuerung**:

- **Start** führt das Diagramm automatisch Schritt für Schritt aus. Wie lange zwischen zwei Schritten gewartet wird, stellst du bei **Pause pro Schritt** ein.
- **Pause** hält an. Danach geht es mit Start oder Schritt weiter.
- **Schritt** führt genau einen Schritt aus. So kannst du in Ruhe zuschauen.
- **Stopp** bricht ab und setzt alles auf den Anfang zurück.

Öffne das folgende Diagramm im Editor und gehe es mit **Schritt** durch:

::: diagramm l16-schreibtisch.visustruct
Eine While-Schleife zählt die Zahlen 1, 2 und 3 zusammen.
:::

## Was die Simulation anzeigt

- **Markierung:** Ein Kasten im Diagramm ist farbig hervorgehoben. Bei **Letzter Schritt** ist es der Kasten, der gerade ausgeführt wurde. Bei **Nächster Schritt** ist es der Kasten, der als Nächstes drankommt.
- **Eingabe:** Fragt das Diagramm nach einem Wert, tippst du ihn hier ein und bestätigst mit **OK**.
- **Letzter Schritt:** Hier steht, was gerade passiert ist, z. B. \`summe = 0 + 1 -> 1\` oder \`i <= 3 -> true\`. Bei einer Bedingung siehst du, ob sie wahr (true) oder falsch (false) war.
- **Variablen:** Alle Variablen mit ihren aktuellen Werten.
- **Ausgabe:** Alles, was mit \`output:\` ausgegeben wurde.

Am Ende erscheint **Simulation beendet**. Geht etwas schief, bleibt die Simulation auf dem fehlerhaften Kasten stehen und zeigt eine Meldung, z. B. **Unbekannte Variable: summe**.

## Der Schreibtischtest

Beim **Schreibtischtest** spielst du selbst den Computer. Du gehst das Struktogramm mit Stift und Papier durch und schreibst nach jedem Schritt die Werte der Variablen auf. Am besten machst du eine Tabelle: eine Spalte für den Schritt, eine für jede Variable und eine für die Ausgabe.

Für das Diagramm oben sieht die Tabelle so aus:

\`\`\`
Schritt               summe   i   Ausgabe
int summe = 0           0     -
int i = 1               0     1
i <= 3  -> wahr         0     1
summe = summe + i       1     1
i = i + 1               1     2
i <= 3  -> wahr         1     2
summe = summe + i       3     2
i = i + 1               3     3
i <= 3  -> wahr         3     3
summe = summe + i       6     3
i = i + 1               6     4
i <= 3  -> falsch       6     4
output: summe           6     4    6
\`\`\`

Vergleiche danach deine Tabelle mit der Simulation. Stimmen die Werte unter **Variablen** nach jedem Schritt mit deiner Zeile überein?

> Der Schreibtischtest lohnt sich besonders in Prüfungen. Dort hast du keinen Computer, aber du kannst trotzdem zeigen, was dein Struktogramm tut.

## Fehler finden

Gibt ein Struktogramm etwas Falsches aus, gehst du so vor:

1. **Erwartung aufschreiben:** Was soll bei einer bestimmten Eingabe herauskommen?
2. **Schritt für Schritt ausführen:** Starte die Simulation mit **Schritt** und beobachte die Variablen.
3. **Die Stelle finden:** Wo weicht ein Wert zum ersten Mal von deiner Erwartung ab? Genau dort steckt der Fehler.

Häufige Fehler sind:

- Die Schleife läuft **einmal zu oft oder zu wenig**, z. B. \`<\` statt \`<=\`.
- Eine Variable wird in der Schleife **nicht verändert** oder in die falsche Richtung. Dann endet die Schleife nie.
- Eine Variable bekommt ihren Startwert **in** der Schleife statt davor und wird bei jedem Durchlauf zurückgesetzt.

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
tipp: Schau, mit welchem Wert von i die Schleife zuletzt läuft. Bei n = 4 muss auch i = 4 noch dazugezählt werden.
lösung: l16-summe-loesung.visustruct
:::

## Übung: Countdown reparieren

::: übung l16-countdown
titel: Countdown reparieren
auftrag: Der Countdown soll vom Startwert herunterzählen und am Ende **Los!** ausgeben. Bei 3 also 3, 2, 1, Los!
  Im Startdiagramm stecken zwei Fehler. Finde und behebe beide.
start: l16-countdown-start.visustruct
test: 3 -> 3 | 2 | 1 | Los!
test: 1 -> 1 | Los!
test: 0 -> Los!
tipp: Starte die Simulation mit Startwert 3 und beobachte i unter Variablen. Wird i kleiner? Vergleiche außerdem die letzte Ausgabe genau mit dem Auftrag.
lösung: l16-countdown-loesung.visustruct
:::

> Läuft eine Simulation endlos weiter, klicke auf **Stopp**. Beim **Prüfen** einer Übung bricht VisuStruct nach sehr vielen Schritten von selbst ab.

## Checkliste

::: checkliste
- Ich kann die Simulation starten, anhalten, einzelne Schritte ausführen und stoppen.
- Ich kann während der Simulation Variablen, Ausgabe und den letzten Schritt ablesen.
- Ich kann einen Schreibtischtest als Tabelle von Hand durchführen.
- Ich kann einen Fehler finden, indem ich die Werte mit meiner Erwartung vergleiche.
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

? Eine Schleife soll von 1 bis 5 zählen, läuft aber nur bis 4. Was ist der wahrscheinliche Fehler?
- [x] In der Bedingung steht i < 5 statt i <= 5.
- [ ] Die Schleife ist eine While-Schleife.
- [ ] Die Variable i heißt falsch.

? Im Feld Letzter Schritt steht \`zahl > 10 -> false\`. Was bedeutet das?
- [ ] Die Variable zahl hat den Wert false.
- [x] Die Bedingung zahl > 10 wurde geprüft und war falsch.
- [ ] Die Simulation hat einen Fehler gefunden.
:::
`,k1=`---
titel: Java
bereich: Vom Struktogramm zum Code
kurz: Java-Code aus dem Struktogramm erzeugen, lesen und umgekehrt Java-Code als Struktogramm nachbauen.
---

## Die Code-Ansicht

Ein Struktogramm beschreibt einen Ablauf. Damit ein Computer ihn ausführt, brauchst du ein Programm in einer Programmiersprache. VisuStruct schreibt diesen Code für dich.

Klicke in der Leiste auf **{ } Code**. Rechts erscheint der **Code-Generator**:

- Oben wählst du die Sprache: **Java**, **Python** oder **JavaScript**.
- Bei Java wählst du zusätzlich **Snippet** (nur die Anweisungen) oder **Class** (eine vollständige Java-Datei).
- **Diagramm-Text als Kommentare** schreibt den Text jedes Kastens als Kommentar über den Code.
- **Kopieren** legt den Code in die Zwischenablage, **Java speichern …** speichert eine \`.java\`-Datei.

Der Code ändert sich sofort mit, wenn du am Struktogramm etwas änderst.

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

In der Leiste kannst du die Sprache der Oberfläche umstellen. Neben Deutsch, Englisch und vielen weiteren gibt es **Java (Keywords)**. Dann heißen die Elemente in der Palette so wie die Befehle in Java: \`if\`, \`switch\`, \`for\`, \`while\`, \`do\`, \`while(true)\`, \`break\` und \`call\`. Die Oberfläche ist dann auf Englisch.

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

Im Struktogramm gibt es kein \`else if\`. Dort steckt eine zweite Verzweigung im Nein-Zweig der ersten.

::: übung l17-ticket
titel: Ticketpreis
auftrag: Frage nach dem Alter als ganze Zahl und baue den Java-Code oben als Struktogramm nach.
test: 5 -> Eintritt frei
test: 6 -> Kinderticket: 4 Euro
test: 17 -> Kinderticket: 4 Euro
test: 18 -> Erwachsenenticket: 8 Euro
braucht: verzweigung
tipp: Ziehe in den false-Zweig der ersten Verzweigung eine zweite Verzweigung mit der Bedingung \`alter < 18\`.
lösung: l17-ticket-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann die Code-Ansicht öffnen und Java als Sprache wählen.
- Ich weiß, wie Ausgabe, Eingabe, Verzweigung und Schleifen in Java aussehen.
- Ich kenne den Unterschied zwischen Snippet und Class.
- Ich kann ein kurzes Java-Programm als Struktogramm nachbauen.
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
`,E1=`---
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

Python ist an einigen Stellen strenger. Der erzeugte Code läuft dann nicht sofort, und du musst ihn von Hand anpassen:

- **Text und Zahl mit +:** \`print("Summe: " + summe)\` führt in Python zu einem Fehler, wenn \`summe\` eine Zahl ist. Schreibe \`print("Summe: " + str(summe))\` oder \`print("Summe:", summe)\`.
- **i++ gibt es nicht:** Schreibe im Struktogramm lieber \`i = i + 1\`. Das versteht jede Sprache.
- **&& und ||** heißen in Python \`and\` und \`or\`.
- **Ganzzahlige Division:** In Python ergibt \`7 / 2\` immer 3.5. Für 3 schreibst du \`7 // 2\`.
- **Komplizierte For-Schleifen:** Nur einfache Zählschleifen werden zu \`for … in range(…)\`. Bei einer Grenze wie \`i <= n\` oder einem Schritt wie \`i = i + 2\` musst du die Zeile selbst umschreiben, z. B. zu \`for i in range(1, n + 1):\`.

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

## JavaScript im Browser ausführen

JavaScript ist die Sprache der Browser. Deshalb kann VisuStruct den Code **sofort ausführen**:

1. Wähle in der Code-Ansicht **JavaScript**.
2. Klicke auf **Im Browser testen**.
3. Unter **Ausgabe** erscheint, was \`console.log\` ausgibt. Fragt das Programm mit \`prompt\` nach einem Wert, tippst du ihn ein und klickst auf **OK**.
4. Mit **Stopp** brichst du das Programm ab.

Eine Endlosschleife \`while (true)\` hält VisuStruct nach 100 000 Durchläufen von selbst an und meldet **Ausführung gestoppt: mögliche Endlosschleife.**

> Hier funktionieren auch **Aussprung** und **Aufruf** wie in einem echten Programm. Ein Aufruf braucht dann aber ein Unterprogramm mit diesem Namen, sonst meldet JavaScript einen Fehler.

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
tipp: \`prompt\` und \`parseInt\` sind zusammen eine Eingabe: \`input: int alter "Wie alt bist du?"\`. Im false-Zweig stehen zwei Kästen: erst \`int jahre = 16 - alter\`, dann die Ausgabe.
lösung: l18-js-loesung.visustruct
:::

## Checkliste

::: checkliste
- Ich kann Python und JavaScript in der Code-Ansicht auswählen und vergleichen.
- Ich weiß, dass Python Blöcke durch Einrückung bildet und keine Datentypen braucht.
- Ich kenne Stellen, an denen ich Python-Code von Hand anpassen muss.
- Ich kann JavaScript mit Im Browser testen ausführen.
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
`,D1=`### Anweisung

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

Steht für ein Unterprogramm, z. B. \`berechneSumme()\`.

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
`,L1=`---
titel: Binärzahl
nach: 10
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
tipp: Sammle die Ziffern in einem Text: \`String binaer = ""\`. In der Schleife berechnest du \`int rest = zahl % 2\` und hängst den Rest **vorne** an: \`binaer = rest + binaer\`. Danach \`zahl = zahl / 2\`. Weil zahl eine ganze Zahl ist, fällt der Rest dabei weg.
lösung: aufgabe-binaer-loesung.visustruct
:::
`,A1=`---
titel: Collatz-Folge
nach: 10
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
tipp: Die While-Schleife läuft, solange \`zahl != 1\` gilt. Ob eine Zahl gerade ist, prüfst du mit \`zahl % 2 == 0\`. Die Ausgabe und \`schritte++\` kommen nach der Verzweigung, aber noch in die Schleife.
lösung: aufgabe-collatz-loesung.visustruct
:::
`,I1=`---
titel: Fibonacci-Zahlen
nach: 12
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
tipp: Merke dir die beiden letzten Zahlen in \`zahl1\` und \`zahl2\` und gib beide vor der Schleife aus. Die Schleife beginnt bei \`int i = 2\`. Darin berechnest du \`int zahl3 = zahl1 + zahl2\`, gibst sie aus und schiebst dann weiter: \`zahl1 = zahl2\` und \`zahl2 = zahl3\`.
lösung: aufgabe-fibonacci-loesung.visustruct
:::
`,B1=`---
titel: Gerade oder ungerade
nach: 7
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
tipp: Die Bedingung lautet \`zahl % 2 == 0\`. In der Ausgabe verbindest du die Zahl und den Text mit \`+\`, z. B. \`zahl + " ist gerade"\`.
lösung: aufgabe-gerade-loesung.visustruct
:::
`,$1=`---
titel: Notendurchschnitt
nach: 12
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
tipp: Die For-Schleife läuft von \`int i = 0\` bis \`i < anzahl\`. Darin liest du eine Note ein und zählst sie zur Summe. Den Durchschnitt speicherst du als Kommazahl: \`double schnitt = summe * 1.0 / anzahl\`. Das \`* 1.0\` sorgt dafür, dass auch in Java nicht ganzzahlig geteilt wird.
lösung: aufgabe-durchschnitt-loesung.visustruct
:::
`,T1=`---
titel: PIN prüfen
nach: 11
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
tipp: Die PIN wird mindestens einmal abgefragt, deshalb passt eine Do-while-Schleife. Lege vorher \`int pin = 0\` und \`int versuche = 0\` an. Die Schleife wiederholt sich, solange \`pin != 1234 && versuche < 3\` gilt. Nach der Schleife entscheidet eine Verzweigung, was ausgegeben wird.
lösung: aufgabe-pin-loesung.visustruct
:::
`,W1=`---
titel: Summe bilden
nach: 2
stufe: 1
---

Lege zwei Zahlen fest, addiere sie und gib das Ergebnis aus.

::: übung aufgabe-summe
titel: Summe bilden
auftrag: Lege \`zahl1\` mit dem Wert 4 und \`zahl2\` mit dem Wert 3 fest. Berechne die Summe in einer dritten Variablen und gib nur die Summe aus.
test: - -> 7
tipp: Eine Variable legst du mit einer Anweisung wie \`int zahl1 = 4\` fest. Für die Ausgabe schreibst du den Namen der Variablen ohne Anführungszeichen.
lösung: aufgabe-summe-loesung.visustruct
:::
`,F1=`---
titel: Tafeldienst auslosen
nach: 14
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
tipp: Mit \`String[] namen = new String[5]\` legst du das Array an. Achtung: Die Losnummer beginnt bei 1, der Index bei 0. Der Name steht also in \`namen[nummer - 1]\`.
lösung: aufgabe-tafeldienst-loesung.visustruct
:::

> Mit \`int nummer = (int) (Math.random() * 5) + 1\` kannst du die Losnummer auch vom Zufall ziehen lassen. Für die automatische Prüfung brauchen wir aber eine feste Eingabe.
`,V1='---\ntitel: Taschenrechner\nnach: 9\nstufe: 2\n---\n\nEin kleiner Taschenrechner: zwei Zahlen und ein Rechenzeichen eingeben, das Ergebnis erscheint.\n\n::: übung aufgabe-rechner\ntitel: Taschenrechner\nauftrag: Frage nach zwei ganzen Zahlen und danach nach einem Rechenzeichen als Text: `+`, `-` oder `*`. Gib das Ergebnis aus. Bei einem anderen Zeichen gib **Unbekanntes Rechenzeichen** aus.\ntest: 3, 4, + -> 7\ntest: 10, 4, - -> 6\ntest: 6, 7, * -> 42\ntest: 1, 2, x -> Unbekanntes Rechenzeichen\nbraucht: fallauswahl\ntipp: Das Rechenzeichen liest du mit `input: String zeichen "Rechenzeichen"` ein. Die Fallauswahl prüft `zeichen`, die Fälle heißen `"+"`, `"-"` und `"*"`, der letzte Fall ist `default`. Rechne in jedem Fall erst in einer Variablen und gib sie dann aus, sonst hängt `+` die Zahlen nur aneinander.\nlösung: aufgabe-rechner-loesung.visustruct\n:::\n',P1=`---
titel: Zahl verdoppeln
nach: 2
stufe: 1
---

Eine Variable kann ihren Wert ändern. Hier wird eine Zahl verdoppelt.

::: übung aufgabe-verdoppeln
titel: Zahl verdoppeln
auftrag: Lege die Variable \`zahl\` mit dem Wert 4 fest. Verdopple sie in einer zweiten Anweisung, ohne eine neue Variable anzulegen. Gib danach **Verdoppelte Zahl: 8** aus, wobei die 8 aus der Variablen kommt.
test: - -> Verdoppelte Zahl: 8
tipp: \`zahl = zahl * 2\` rechnet mit dem alten Wert und speichert das Ergebnis wieder in \`zahl\`. Text und Variable verbindest du mit \`+\`.
lösung: aufgabe-verdoppeln-loesung.visustruct
:::
`,M1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,C1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,j1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,N1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Z1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,R1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,O1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,H1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,U1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,K1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,J1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,G1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,q1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,X1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Y1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Q1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,er=`<?xml version="1.0" encoding="UTF-8"?>
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
`,tr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,nr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ir=`<?xml version="1.0" encoding="UTF-8"?>
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
`,sr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,rr=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;101;107;117;110;100;101;110;32;117;109;114;101;99;104;110;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;101;107;117;110;100;101;110;32;61;32;50;48;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;109;105;110;117;116;101;110;32;43;32;34;32;77;105;110;117;116;101;110;32;117;110;100;32;34;32;43;32;114;101;115;116;32;43;32;34;32;83;101;107;117;110;100;101;110;34;</text>
  </strelem>
</struktogramm>
`,ar=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;101;103;114;252;223;117;110;103;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;110;97;109;101;32;34;87;105;101;32;104;101;105;223;116;32;100;117;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;97;108;108;111;32;34;32;43;32;110;97;109;101;32;43;32;34;33;34;</text>
  </strelem>
</struktogramm>
`,lr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,or=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ur=`<?xml version="1.0" encoding="UTF-8"?>
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
`,cr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,hr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,dr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,mr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,gr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,pr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,fr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,br=`<?xml version="1.0" encoding="UTF-8"?>
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
`,xr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,wr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,yr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,zr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,vr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Sr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,_r=`<?xml version="1.0" encoding="UTF-8"?>
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
`,kr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Er=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Dr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Lr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ar=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ir=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Br=`<?xml version="1.0" encoding="UTF-8"?>
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
`,$r=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Tr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Wr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Fr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Vr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Pr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Mr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Cr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,jr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Nr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Zr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Rr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Or=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Hr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ur=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Kr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Jr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Gr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,qr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Xr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Yr=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Qr=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="122;101;105;103;101;66;101;103;114;117;101;115;115;117;110;103;40;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;87;105;108;108;107;111;109;109;101;110;32;122;117;109;32;81;117;105;122;33;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;68;117;32;98;101;107;111;109;109;115;116;32;100;114;101;105;32;70;114;97;103;101;110;46;34;</text>
  </strelem>
</struktogramm>
`,ea=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ta=`<?xml version="1.0" encoding="UTF-8"?>
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
`,na=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ia=`<?xml version="1.0" encoding="UTF-8"?>
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
`,sa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ra=`<?xml version="1.0" encoding="UTF-8"?>
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
`,aa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,la=`<?xml version="1.0" encoding="UTF-8"?>
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
`,oa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ua=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ca=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ha=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;101;103;114;252;223;117;110;103;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;71;117;116;101;110;32;77;111;114;103;101;110;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;101;117;116;101;32;108;101;114;110;101;110;32;119;105;114;32;83;116;114;117;107;116;111;103;114;97;109;109;101;46;34;</text>
  </strelem>
</struktogramm>
`,da=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="72;97;108;108;111;32;87;101;108;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;97;108;108;111;32;87;101;108;116;34;</text>
  </strelem>
</struktogramm>
`,ma=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="90;119;101;105;32;90;101;105;108;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;97;108;108;111;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;73;99;104;32;108;101;114;110;101;32;83;116;114;117;107;116;111;103;114;97;109;109;101;34;</text>
  </strelem>
</struktogramm>
`;class H extends Error{}function di(i,e){const t=/^---\n([\s\S]*?)\n---\n?/.exec(i.replace(/\r\n/g,`
`));if(!t)throw new H(`${e}: Kopfzeilen (--- … ---) fehlen.`);const n=new Map;for(const s of t[1].split(`
`)){const r=/^([a-zäöüß]+):\s*(.*)$/i.exec(s.trim());r&&n.set(r[1].toLowerCase(),r[2].trim())}return{meta:n,body:i.replace(/\r\n/g,`
`).slice(t[0].length)}}function ga(i,e){const t=i.split(/\s*(?:->|→)\s*/);if(t.length!==2)throw new H(`${e}: Test „${i}“ braucht genau ein „->“.`);const n=(s,r)=>s.trim()===""||s.trim()==="-"?[]:s.split(r).map(a=>a.trim());return{inputs:n(t[0],/\s*,\s*/),expected:n(t[1],/\s*\|\s*/)}}function pa(i,e,t){const n={id:i,title:"",task:"",tests:[],requires:[]};let s;for(const r of e){const a=/^(titel|auftrag|start|test|braucht|tipp|lösung|loesung):\s*(.*)$/i.exec(r.trim());if(a){const[,l,o]=a;switch(s=void 0,l.toLowerCase()){case"titel":n.title=o;break;case"auftrag":n.task=o,s="task";break;case"start":n.start=o;break;case"test":n.tests.push(ga(o,t));break;case"braucht":n.requires.push(...o.split(/\s*,\s*/).filter(Boolean));break;case"tipp":n.hint=o,s="hint";break;case"lösung":case"loesung":n.solution=o;break}}else s&&r.trim()!==""?s==="task"?n.task+=`
`+r.trim():n.hint+=`
`+r.trim():r.trim()===""&&s==="task"&&(n.task+=`
`)}if(!n.title)throw new H(`${t}: Übung „${i}“ hat keinen Titel.`);if(!n.task.trim())throw new H(`${t}: Übung „${i}“ hat keinen Auftrag.`);return n.task=n.task.trim(),n}function fa(i,e){const t=[];for(const n of i){const s=n.trim();if(s.startsWith("?"))t.push({question:s.slice(1).trim(),options:[]});else if(/^- \[[ xX]\]/.test(s)){const r=t.at(-1);if(!r)throw new H(`${e}: Antwort ohne Frage im Quiz.`);r.options.push({text:s.slice(5).trim(),correct:s[3].toLowerCase()==="x"})}else if(s.startsWith(">")){const r=t.at(-1);r&&(r.explanation=((r.explanation?r.explanation+" ":"")+s.slice(1).trim()).trim())}}for(const n of t)if(n.options.length<2||!n.options.some(s=>s.correct))throw new H(`${e}: Quizfrage „${n.question}“ braucht mindestens zwei Antworten, davon eine richtige.`);return t}function mi(i,e){const t=[],n=i.split(`
`);let s=[];const r=()=>{const a=s.join(`
`).trim();a&&t.push({kind:"markdown",text:a}),s=[]};for(let a=0;a<n.length;a++){const l=/^:::\s*([a-zäöüß]+)\s*(.*)$/i.exec(n[a].trim());if(!l){s.push(n[a]);continue}r();const o=[];let u=a+1;for(;u<n.length&&n[u].trim()!==":::";)o.push(n[u++]);if(u>=n.length)throw new H(`${e}: Block „::: ${l[1]}“ wird nicht mit „:::“ geschlossen.`);const h=l[1].toLowerCase(),d=l[2].trim();switch(h){case"diagramm":if(!d)throw new H(`${e}: „::: diagramm“ braucht einen Dateinamen.`);t.push({kind:"diagram",file:d,caption:o.join(" ").trim()});break;case"übung":case"uebung":if(!d)throw new H(`${e}: „::: übung“ braucht eine Kennung.`);t.push({kind:"exercise",exercise:pa(d,o,e)});break;case"checkliste":t.push({kind:"checklist",items:o.map(g=>g.trim()).filter(g=>g.startsWith("- ")).map(g=>g.slice(2).trim())});break;case"quiz":t.push({kind:"quiz",questions:fa(o,e)});break;default:throw new H(`${e}: Unbekannter Block „::: ${l[1]}“.`)}a=u}return r(),t}function ba(i,e){var d;const{meta:t,body:n}=di(i,e),s=e.replace(/^.*\//,"").replace(/\.md$/,""),r=Number((d=/^(\d+)/.exec(s))==null?void 0:d[1]);if(!Number.isFinite(r))throw new H(`${e}: Dateiname muss mit der Nummer beginnen (z. B. 01-…).`);const a=[];let l=[],o;const u=()=>{o&&a.push({title:o.title,blocks:mi(o.lines.join(`
`),e)})};for(const g of n.split(`
`)){const x=/^##\s+(.*)$/.exec(g);x?(u(),o={title:x[1].trim(),lines:[]}):o?o.lines.push(g):l.push(g)}if(u(),a.length===0)throw new H(`${e}: Keine Schritte (## Überschrift) gefunden.`);const h=t.get("titel");if(!h)throw new H(`${e}: „titel:“ fehlt.`);return{id:s,number:r,title:h,section:t.get("bereich")??"",summary:t.get("kurz")??l.join(" ").trim(),steps:a}}function xa(i,e){const{meta:t,body:n}=di(i,e),s=t.get("titel");if(!s)throw new H(`${e}: „titel:“ fehlt.`);const r=t.get("nach");return{id:e.replace(/^.*\//,"").replace(/\.md$/,""),title:s,after:r?Number(r):void 0,level:Number(t.get("stufe")??"1")||1,blocks:mi(n,e)}}const gi=Object.assign({"../../lessons/de/01-was-ist-ein-struktogramm.md":u1,"../../lessons/de/02-der-editor.md":c1,"../../lessons/de/03-speichern-oeffnen-exportieren.md":h1,"../../lessons/de/04-sequenz.md":d1,"../../lessons/de/05-variablen-und-datentypen.md":m1,"../../lessons/de/06-eingabe-und-ausgabe.md":g1,"../../lessons/de/07-verzweigung.md":p1,"../../lessons/de/08-bedingungen-verknuepfen.md":f1,"../../lessons/de/09-fallauswahl.md":b1,"../../lessons/de/10-while-schleife.md":x1,"../../lessons/de/11-do-while-schleife.md":w1,"../../lessons/de/12-for-schleife.md":y1,"../../lessons/de/13-verschachteln.md":z1,"../../lessons/de/14-arrays.md":v1,"../../lessons/de/15-aufruf-und-aussprung.md":S1,"../../lessons/de/16-simulation-und-schreibtischtest.md":_1,"../../lessons/de/17-java.md":k1,"../../lessons/de/18-python-und-javascript.md":E1,"../../lessons/de/nachschlagen.md":D1}),wa=Object.assign({"../../lessons/de/aufgaben/binaerzahl.md":L1,"../../lessons/de/aufgaben/collatz.md":A1,"../../lessons/de/aufgaben/fibonacci.md":I1,"../../lessons/de/aufgaben/gerade-ungerade.md":B1,"../../lessons/de/aufgaben/notendurchschnitt.md":$1,"../../lessons/de/aufgaben/pin-pruefen.md":T1,"../../lessons/de/aufgaben/summe-bilden.md":W1,"../../lessons/de/aufgaben/tafeldienst.md":F1,"../../lessons/de/aufgaben/taschenrechner.md":V1,"../../lessons/de/aufgaben/zahl-verdoppeln.md":P1}),ya=Object.assign({"../../lessons/diagramme/aufgabe-binaer-loesung.visustruct":M1,"../../lessons/diagramme/aufgabe-collatz-loesung.visustruct":C1,"../../lessons/diagramme/aufgabe-durchschnitt-loesung.visustruct":j1,"../../lessons/diagramme/aufgabe-fibonacci-loesung.visustruct":N1,"../../lessons/diagramme/aufgabe-gerade-loesung.visustruct":Z1,"../../lessons/diagramme/aufgabe-pin-loesung.visustruct":R1,"../../lessons/diagramme/aufgabe-rechner-loesung.visustruct":O1,"../../lessons/diagramme/aufgabe-summe-loesung.visustruct":H1,"../../lessons/diagramme/aufgabe-tafeldienst-loesung.visustruct":U1,"../../lessons/diagramme/aufgabe-verdoppeln-loesung.visustruct":K1,"../../lessons/diagramme/l04-rechnen.visustruct":J1,"../../lessons/diagramme/l04-reihenfolge-loesung.visustruct":G1,"../../lessons/diagramme/l04-reihenfolge-start.visustruct":q1,"../../lessons/diagramme/l04-tauschen-loesung.visustruct":X1,"../../lessons/diagramme/l04-tauschen-start.visustruct":Y1,"../../lessons/diagramme/l04-tauschen.visustruct":Q1,"../../lessons/diagramme/l05-datentypen.visustruct":er,"../../lessons/diagramme/l05-division.visustruct":tr,"../../lessons/diagramme/l05-einkauf-loesung.visustruct":nr,"../../lessons/diagramme/l05-rechteck-loesung.visustruct":ir,"../../lessons/diagramme/l05-sekunden-loesung.visustruct":sr,"../../lessons/diagramme/l05-sekunden-start.visustruct":rr,"../../lessons/diagramme/l06-begruessung-loesung.visustruct":ar,"../../lessons/diagramme/l06-eva.visustruct":lr,"../../lessons/diagramme/l06-mittelwert-loesung.visustruct":or,"../../lessons/diagramme/l06-rechner-loesung.visustruct":ur,"../../lessons/diagramme/l07-alter-pruefen.visustruct":cr,"../../lessons/diagramme/l07-betrag-loesung.visustruct":hr,"../../lessons/diagramme/l07-gerade-loesung.visustruct":dr,"../../lessons/diagramme/l07-maximum-loesung.visustruct":mr,"../../lessons/diagramme/l07-rabatt.visustruct":gr,"../../lessons/diagramme/l08-gueltig-loesung.visustruct":pr,"../../lessons/diagramme/l08-jugendticket.visustruct":fr,"../../lessons/diagramme/l08-note.visustruct":br,"../../lessons/diagramme/l08-schaltjahr-loesung.visustruct":xr,"../../lessons/diagramme/l08-wochenende-loesung.visustruct":wr,"../../lessons/diagramme/l09-ampel.visustruct":yr,"../../lessons/diagramme/l09-automat.visustruct":zr,"../../lessons/diagramme/l09-note-loesung.visustruct":vr,"../../lessons/diagramme/l09-rechner-loesung.visustruct":Sr,"../../lessons/diagramme/l09-verschachtelt.visustruct":_r,"../../lessons/diagramme/l1-grundbausteine.visustruct":kr,"../../lessons/diagramme/l1-tee.visustruct":Er,"../../lessons/diagramme/l10-bis-n-loesung.visustruct":Dr,"../../lessons/diagramme/l10-countdown.visustruct":Lr,"../../lessons/diagramme/l10-endlos.visustruct":Ar,"../../lessons/diagramme/l10-verdoppeln-loesung.visustruct":Ir,"../../lessons/diagramme/l11-eingabe-pruefen.visustruct":Br,"../../lessons/diagramme/l11-einmal.visustruct":$r,"../../lessons/diagramme/l11-note-loesung.visustruct":Tr,"../../lessons/diagramme/l11-summe-loesung.visustruct":Wr,"../../lessons/diagramme/l12-countdown-loesung.visustruct":Fr,"../../lessons/diagramme/l12-einmaleins-loesung.visustruct":Vr,"../../lessons/diagramme/l12-eins-bis-fuenf.visustruct":Pr,"../../lessons/diagramme/l12-summe.visustruct":Mr,"../../lessons/diagramme/l13-dreieck.visustruct":Cr,"../../lessons/diagramme/l13-gerade-eingaben-loesung.visustruct":jr,"../../lessons/diagramme/l13-gerade-zaehlen.visustruct":Nr,"../../lessons/diagramme/l13-rechteck-loesung.visustruct":Zr,"../../lessons/diagramme/l14-array-durchlaufen.visustruct":Rr,"../../lessons/diagramme/l14-erster-letzter-loesung.visustruct":Or,"../../lessons/diagramme/l14-namen-eingeben.visustruct":Hr,"../../lessons/diagramme/l14-rueckwaerts-loesung.visustruct":Ur,"../../lessons/diagramme/l14-summe-max-loesung.visustruct":Kr,"../../lessons/diagramme/l14-summe-maximum.visustruct":Jr,"../../lessons/diagramme/l15-bis-null-loesung.visustruct":Gr,"../../lessons/diagramme/l15-endlos-aussprung.visustruct":qr,"../../lessons/diagramme/l15-hauptprogramm.visustruct":Xr,"../../lessons/diagramme/l15-titel-loesung.visustruct":Yr,"../../lessons/diagramme/l15-unterprogramm.visustruct":Qr,"../../lessons/diagramme/l16-countdown-loesung.visustruct":ea,"../../lessons/diagramme/l16-countdown-start.visustruct":ta,"../../lessons/diagramme/l16-schreibtisch.visustruct":na,"../../lessons/diagramme/l16-summe-loesung.visustruct":ia,"../../lessons/diagramme/l16-summe-start.visustruct":sa,"../../lessons/diagramme/l17-beispiel.visustruct":ra,"../../lessons/diagramme/l17-fakultaet-loesung.visustruct":aa,"../../lessons/diagramme/l17-ticket-loesung.visustruct":la,"../../lessons/diagramme/l18-beispiel.visustruct":oa,"../../lessons/diagramme/l18-js-loesung.visustruct":ua,"../../lessons/diagramme/l18-python-loesung.visustruct":ca,"../../lessons/diagramme/l2-ausgabe.visustruct":ha,"../../lessons/diagramme/l2-hallo-loesung.visustruct":da,"../../lessons/diagramme/l2-zwei-zeilen-loesung.visustruct":ma}),Ct=i=>i.replace(/^.*\//,""),ge=Object.entries(gi).filter(([i])=>/\/\d+[^/]*\.md$/.test(i)).map(([i,e])=>ba(e,Ct(i))).sort((i,e)=>i.number-e.number),ct=Object.entries(wa).map(([i,e])=>xa(e,Ct(i))).sort((i,e)=>(i.after??0)-(e.after??0)||i.level-e.level||i.title.localeCompare(e.title,"de"));var In;const za=((In=Object.entries(gi).find(([i])=>i.endsWith("/nachschlagen.md")))==null?void 0:In[1])??"",va=new Map(Object.entries(ya).map(([i,e])=>[Ct(i),e]));function kt(i){const e=va.get(i);return e===void 0?void 0:$t(e)}const pi=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function ae(i){const e=[];let t=pi(i).replace(/`([^`]+)`/g,(n,s)=>(e.push(s),`\0${e.length-1}\0`));return t=t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/(^|[^*])\*([^*\s][^*]*?)\*/g,"$1<em>$2</em>").replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,(n,s,r)=>{const a=/^(https?:|mailto:|#|\.{0,2}\/)/.test(r)?r:"#",l=/^https?:/.test(a)?' target="_blank" rel="noopener noreferrer"':"";return`<a href="${a}"${l}>${s}</a>`}),t.replace(/\u0000(\d+)\u0000/g,(n,s)=>`<code>${e[Number(s)]}</code>`)}function we(i){const e=[],t=i.replace(/\r\n/g,`
`).split(`
`);let n=0;for(;n<t.length;){const s=t[n];if(s.trim()===""){n++;continue}if(s.startsWith("```")){const l=[];for(n++;n<t.length&&!t[n].startsWith("```");)l.push(t[n++]);n++,e.push(`<pre class="lesson-code" dir="ltr"><code>${pi(l.join(`
`))}</code></pre>`);continue}const r=/^(#{3,4})\s+(.*)$/.exec(s);if(r){const l=r[1].length;e.push(`<h${l}>${ae(r[2])}</h${l}>`),n++;continue}if(/^\s*([-*]|\d+\.)\s+/.test(s)){const l=/^\s*\d+\./.test(s),o=[];for(;n<t.length&&/^\s*([-*]|\d+\.)\s+/.test(t[n]);){let u=t[n].replace(/^\s*([-*]|\d+\.)\s+/,"");for(n++;n<t.length&&/^\s{2,}\S/.test(t[n])&&!/^\s*([-*]|\d+\.)\s+/.test(t[n]);)u+=" "+t[n++].trim();o.push(`<li>${ae(u)}</li>`)}e.push(l?`<ol>${o.join("")}</ol>`:`<ul>${o.join("")}</ul>`);continue}if(s.startsWith(">")){const l=[];for(;n<t.length&&t[n].startsWith(">");)l.push(t[n++].replace(/^>\s?/,""));e.push(`<aside class="lesson-note">${we(l.join(`
`))}</aside>`);continue}const a=[];for(;n<t.length&&t[n].trim()!==""&&!/^(```|#{3,4}\s|>|\s*([-*]|\d+\.)\s+)/.test(t[n]);)a.push(t[n++].trim());e.push(`<p>${ae(a.join(" "))}</p>`)}return e.join(`
`)}const fi="visustruct.learn.progress";function bi(){try{const i=localStorage.getItem(fi);if(i){const e=JSON.parse(i);return{lessons:e.lessons??{},exercises:e.exercises??{},view:e.view}}}catch{}return{lessons:{},exercises:{}}}let Y=bi();function Pe(){try{localStorage.setItem(fi,JSON.stringify(Y))}catch{}}const j={lesson(i){var e;return(e=Y.lessons)[i]??(e[i]={step:0})},updateLesson(i,e){Y.lessons[i]={...j.lesson(i),...e},Pe()},exercise(i){return Y.exercises[i]??{}},updateExercise(i,e){Y.exercises[i]={...j.exercise(i),...e},Pe()},resetExercise(i){delete Y.exercises[i],Pe()},view(){return Y.view},setView(i){Y.view=i,Pe()},reload(){Y=bi()}};function Et(i){switch(i.kind){case"finished":return c("sim_notice_finished");case"infiniteLoopWithoutBody":return c("sim_notice_infinite_loop_empty");case"unsupportedStatement":return c("sim_notice_unsupported_statement_fmt",i.text);case"invalidExpression":return c("sim_notice_invalid_expression_fmt",i.text);case"unknownVariable":return c("sim_notice_unknown_variable_fmt",i.text);case"divisionByZero":return c("sim_notice_division_by_zero");case"wholeNumberExpected":return c("sim_notice_whole_number_expected");case"numberExpected":return c("sim_notice_number_expected");case"booleanExpected":return c("sim_notice_boolean_expected");case"other":return i.text}}const C=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),pn=["0.2","0.5","1.0","1.5","2.0"],Sa=i=>Number(i).toLocaleString(zt()==="java"?"en":zt(),{minimumFractionDigits:1}),ht="visustruct.simulation.stepDelay",fn="visustruct.simulation.highlightMode";function dt(i){try{return localStorage.getItem(i)}catch{return null}}function bn(i,e){try{localStorage.setItem(i,e)}catch{}}class _a{constructor(e,t){p(this,"element");p(this,"engine");p(this,"isPlaying",!1);p(this,"playTimer");p(this,"wasPlayingBeforeInput",!1);p(this,"delay",pn.includes(dt(ht)??"")?dt(ht):"0.5");p(this,"highlightMode",dt(fn)==="nextToExecute"?"nextToExecute":"lastExecuted");p(this,"buttons");p(this,"inputSection");p(this,"trace");p(this,"variables");p(this,"output");p(this,"notice");this.currentDocument=e,this.onHighlight=t,this.engine=new _t(e()),this.element=document.createElement("aside"),this.element.className="simpanel",this.build()}begin(){this.pause(),this.restartEngine()}end(){this.pause()}step(){if(!this.engine.canStep){this.pause();return}const e=this.isPlaying,t=this.engine.currentStepPath;this.engine.step(),this.highlightMode==="nextToExecute"&&this.engine.canStep?this.onHighlight(this.engine.currentStepPath):this.onHighlight(t??this.engine.currentStepPath),this.engine.state.inputRequest&&e&&(this.wasPlayingBeforeInput=!0),this.engine.canStep||this.pause(),this.update()}reset(){this.pause(),this.restartEngine()}play(){if(this.isPlaying||!this.engine.canStep)return;this.isPlaying=!0;const e=()=>{this.playTimer=void 0,this.isPlaying&&(this.step(),this.isPlaying&&this.engine.canStep?this.playTimer=window.setTimeout(e,Number(this.delay)*1e3):(this.isPlaying=!1,this.update()))};e()}pause(){this.playTimer!==void 0&&window.clearTimeout(this.playTimer),this.playTimer=void 0,this.isPlaying=!1,this.update()}submitInput(e){const t=this.isPlaying||this.wasPlayingBeforeInput;this.pause(),this.engine.provideInput(e.value),this.engine.state.inputRequest||(e.value=""),this.onHighlight(this.engine.currentStepPath),t&&this.engine.canStep&&(this.wasPlayingBeforeInput=!1,this.play()),this.update()}restartEngine(){this.engine=new _t(this.currentDocument()),this.wasPlayingBeforeInput=!1,this.onHighlight(this.engine.currentStepPath),this.update()}build(){this.element.innerHTML=`
      <section>
        <h2>${C(c("simulation_controls"))}</h2>
        <div class="sim-buttons">
          <button data-sim="play">▶︎ ${C(c("simulation_play"))}</button>
          <button data-sim="pause">⏸︎ ${C(c("simulation_pause"))}</button>
          <button data-sim="step">→ ${C(c("simulation_step"))}</button>
          <button data-sim="stop">■ ${C(c("simulation_stop"))}</button>
        </div>
        <label class="sim-option">${C(c("simulation_highlight_label"))}
          <select data-sim="highlight">
            <option value="lastExecuted">${C(c("simulation_highlight_last"))}</option>
            <option value="nextToExecute">${C(c("simulation_highlight_next"))}</option>
          </select>
        </label>
        <label class="sim-option">${C(c("web_sim_delay"))}
          <select data-sim="delay">${pn.map(s=>`<option value="${s}">${C(c("web_sim_delay_value_fmt",Sa(s)))}</option>`).join("")}</select>
        </label>
      </section>
      <p class="sim-notice" role="status"></p>
      <section class="sim-input"><h2>${C(c("simulation_input"))}</h2><div></div></section>
      <section><h2>${C(c("simulation_trace"))}</h2><div class="sim-trace mono" dir="ltr"></div></section>
      <section><h2>${C(c("simulation_variables"))}</h2><div class="sim-vars" dir="ltr"></div></section>
      <section><h2>${C(c("simulation_output"))}</h2><div class="sim-output mono" dir="ltr"></div></section>
    `;const e=s=>this.element.querySelector(s);this.buttons={play:e("[data-sim=play]"),pause:e("[data-sim=pause]"),step:e("[data-sim=step]"),stop:e("[data-sim=stop]")},this.buttons.play.addEventListener("click",()=>this.play()),this.buttons.pause.addEventListener("click",()=>this.pause()),this.buttons.step.addEventListener("click",()=>this.step()),this.buttons.stop.addEventListener("click",()=>this.reset());const t=e("[data-sim=highlight]");t.value=this.highlightMode,t.addEventListener("change",()=>{this.highlightMode=t.value,bn(fn,this.highlightMode)});const n=e("[data-sim=delay]");n.value=this.delay,n.addEventListener("change",()=>{this.delay=n.value,bn(ht,this.delay)}),this.inputSection=e(".sim-input > div"),this.trace=e(".sim-trace"),this.variables=e(".sim-vars"),this.output=e(".sim-output"),this.notice=e(".sim-notice")}update(){if(!this.buttons)return;const{state:e,canStep:t}=this.engine;this.buttons.play.disabled=this.isPlaying||!t,this.buttons.pause.disabled=!this.isPlaying,this.buttons.step.disabled=this.isPlaying||!t,this.notice.textContent=e.notice?Et(e.notice):"",this.notice.hidden=!e.notice,this.notice.classList.toggle("error",e.isHalted),this.updateInput(),this.trace.textContent=e.lastTrace??c("simulation_trace_placeholder"),this.trace.classList.toggle("placeholder",!e.lastTrace);const n=[...e.variables.keys()].sort((s,r)=>s.localeCompare(r));if(n.length===0)this.variables.innerHTML=`<p class="placeholder">${C(c("simulation_variables_placeholder"))}</p>`;else{const s=document.createElement("table");for(const r of n){const a=s.insertRow();a.insertCell().textContent=r,a.insertCell().textContent=U(e.variables.get(r))}this.variables.replaceChildren(s)}e.outputLines.length===0?this.output.innerHTML=`<p class="placeholder">${C(c("simulation_output_placeholder"))}</p>`:(this.output.replaceChildren(...e.outputLines.map(s=>{const r=document.createElement("div");return r.textContent=s,r})),this.output.scrollTop=this.output.scrollHeight)}updateInput(){const e=this.engine.state.inputRequest,t=this.inputSection;if(t.parentElement.classList.toggle("active",!!e),!e){t.innerHTML=`<p class="placeholder">${C(c("simulation_input_placeholder"))}</p>`;return}let n=t.querySelector("form");if(!n){n=document.createElement("form"),n.innerHTML=`<p class="sim-prompt"></p><div class="sim-input-row"><input autocomplete="off" /><button type="submit">${C(c("simulation_input_submit"))}</button></div><p class="sim-input-error"></p>`;const l=n.querySelector("input");n.addEventListener("submit",o=>{o.preventDefault(),this.submitInput(l)}),t.replaceChildren(n),requestAnimationFrame(()=>l.focus())}n.querySelector(".sim-prompt").textContent=e.prompt;const s=n.querySelector("input");s.inputMode=e.valueType==="string"||e.valueType==="boolean"?"text":"decimal";const r=this.engine.state.inputErrorNotice,a=n.querySelector(".sim-input-error");a.textContent=r?Et(r):"",a.hidden=!r}}const ka=()=>{const i=[];for(const e of ge){const t=i.at(-1);t&&t.name===e.section?t.lessons.push(e):i.push({name:e.section,lessons:[e]})}return i};function b(i,e={},...t){const n=document.createElement(i);for(const[s,r]of Object.entries(e))n.setAttribute(s,r);return n.append(...t),n}function ie(i,e,t){const n=b(i,e);return n.innerHTML=t,n}const Ea=i=>c(`element_${m[i]}`);function Da(i){return{caption:i,elements:[K(m.anweisung,{textLines:["ø"]})]}}function xn(i){const e=i.start?kt(i.start):void 0;return e?{...e,caption:e.caption||i.title}:Da(i.title)}class La{constructor(e){p(this,"element");p(this,"tab","lessons");p(this,"lessonId");p(this,"taskId");p(this,"body");this.host=e,this.element=b("aside",{class:"learn","aria-label":c("web_learn_title")});const t=j.view();t&&(this.tab=["lessons","tasks","reference"].find(n=>n===t.tab)??"lessons",this.lessonId=ge.some(n=>n.id===t.lesson)?t.lesson:void 0,this.taskId=ct.some(n=>n.id===t.task)?t.task:void 0),this.render()}render(){const e=b("div",{class:"segmented learn-tabs",role:"tablist"});for(const[t,n]of[["lessons",c("web_learn_lessons")],["tasks",c("web_learn_tasks")],["reference",c("web_learn_reference")]]){const s=b("button",{role:"tab","aria-pressed":String(this.tab===t),"data-learn-tab":t},n);s.addEventListener("click",()=>{this.tab===t&&(t==="lessons"&&(this.lessonId=void 0),t==="tasks"&&(this.taskId=void 0)),this.tab=t,this.persist(),this.render()}),e.append(s)}if(this.body=b("div",{class:"learn-body"}),this.element.replaceChildren(e,this.body),this.tab==="lessons"){const t=ge.find(n=>n.id===this.lessonId);t?this.renderLesson(t):this.renderLessonList()}else if(this.tab==="tasks"){const t=ct.find(n=>n.id===this.taskId);t?this.renderTask(t):this.renderTaskList()}else this.body.append(ie("div",{class:"learn-text learn-reference"},we(za)))}persist(){j.setView({tab:this.tab,lesson:this.lessonId,task:this.taskId})}openLesson(e){this.tab="lessons",this.lessonId=e,this.persist(),this.render(),this.body.scrollTop=0}renderLessonList(){this.body.append(b("p",{class:"hint"},c("web_learn_intro")));for(const e of ka()){this.body.append(b("h3",{class:"learn-section"},e.name));const t=b("ol",{class:"learn-list"});for(const n of e.lessons){const s=j.lesson(n.id),r=s.done?"✓":s.step>0?c("web_learn_step_of_fmt",s.step+1,n.steps.length):"",a=b("button",{class:"learn-item"+(s.done?" done":""),"data-lesson":n.id},b("span",{class:"learn-num"},String(n.number)),b("span",{class:"learn-item-text"},b("strong",{},n.title),b("small",{},n.summary)),b("span",{class:"learn-status"},r));a.addEventListener("click",()=>this.openLesson(n.id)),t.append(b("li",{},a))}this.body.append(t)}}renderLesson(e){const t=j.lesson(e.id),n=Math.min(t.step,e.steps.length-1),s=e.steps[n],r=b("button",{class:"learn-back"},`← ${c("web_learn_all_lessons")}`);r.addEventListener("click",()=>this.openLesson(void 0));const a=b("div",{class:"learn-progress",role:"progressbar","aria-valuemin":"1","aria-valuemax":String(e.steps.length),"aria-valuenow":String(n+1)});a.append(...e.steps.map((u,h)=>b("span",{class:h<n?"past":h===n?"current":""}))),this.body.append(r,b("p",{class:"learn-kicker"},`${c("web_learn_lesson_fmt",e.number)} · ${e.section}`),b("h2",{class:"learn-title"},e.title),a,b("h3",{class:"learn-step-title"},`${n+1}. ${s.title}`)),s.blocks.forEach((u,h)=>this.body.append(this.renderBlock(u,`${n}-${h}`,e)));const l=b("div",{class:"learn-nav"}),o=b("button",{},`← ${c("web_learn_back")}`);if(o.disabled=n===0,o.addEventListener("click",()=>this.goToStep(e,n-1)),l.append(o),n<e.steps.length-1){const u=b("button",{class:"primary"},`${c("web_learn_next")} →`);u.addEventListener("click",()=>this.goToStep(e,n+1)),l.append(u)}else{const u=b("button",{class:"primary"},t.done?`✓ ${c("web_learn_done")}`:c("web_learn_finish"));u.addEventListener("click",()=>{j.updateLesson(e.id,{done:!0});const h=ge.find(d=>d.number===e.number+1);this.openLesson(h==null?void 0:h.id)}),l.append(u)}this.body.append(l)}goToStep(e,t){j.updateLesson(e.id,{step:t}),this.render(),this.body.scrollTop=0}renderTaskList(){this.body.append(b("p",{class:"hint"},c("web_learn_tasks_intro")));const e=b("ul",{class:"learn-list"});for(const t of ct){const n=this.taskExercises(t).every(a=>j.exercise(a.id).done),s=ge.find(a=>a.number===t.after),r=b("button",{class:"learn-item"+(n?" done":""),"data-task":t.id},b("span",{class:"learn-num","aria-label":c("web_learn_level_fmt",t.level)},"★".repeat(t.level)),b("span",{class:"learn-item-text"},b("strong",{},t.title),b("small",{},s?c("web_learn_after_fmt",s.number,s.title):"")),b("span",{class:"learn-status"},n?"✓":""));r.addEventListener("click",()=>{this.taskId=t.id,this.persist(),this.render(),this.body.scrollTop=0}),e.append(b("li",{},r))}this.body.append(e)}taskExercises(e){return e.blocks.flatMap(t=>t.kind==="exercise"?[t.exercise]:[])}renderTask(e){const t=b("button",{class:"learn-back"},`← ${c("web_learn_all_tasks")}`);t.addEventListener("click",()=>{this.taskId=void 0,this.persist(),this.render()});const n=ge.find(s=>s.number===e.after);if(this.body.append(t,b("h2",{class:"learn-title"},e.title)),n){const s=b("button",{class:"link-button"},c("web_learn_after_fmt",n.number,n.title));s.addEventListener("click",()=>this.openLesson(n.id)),this.body.append(b("p",{class:"learn-kicker"},s))}e.blocks.forEach((s,r)=>this.body.append(this.renderBlock(s,`task-${r}`,void 0,!0)))}renderBlock(e,t,n,s=!1){switch(e.kind){case"markdown":return ie("div",{class:"learn-text"},we(e.text));case"diagram":return this.renderDiagram(e.file,e.caption);case"exercise":return this.renderExercise(e.exercise,s);case"checklist":return this.renderChecklist(e.items,t,n);case"quiz":return this.renderQuiz(e.questions,t,n)}}renderDiagram(e,t){const n=kt(e),s=b("figure",{class:"learn-figure"});if(!n)return s;const r=this.host.preview(n);r&&s.append(b("div",{class:"learn-preview",dir:"ltr"},r)),t&&s.append(ie("figcaption",{},ae(t)));const a=b("button",{},c("web_learn_open_in_editor"));return a.addEventListener("click",()=>this.host.openDiagram(n,e)),s.append(a),s}renderExercise(e,t){const n=b("section",{class:"learn-exercise","data-exercise":e.id}),s=()=>j.exercise(e.id),r=b("span",{class:"learn-badge"},`✓ ${c("web_learn_solved")}`);r.hidden=!s().done,n.append(b("h4",{},`${c("web_learn_exercise")}: ${e.title}`,r),ie("div",{class:"learn-text"},we(e.task)));const a=b("div",{class:"learn-result",role:"status"}),l=ie("aside",{class:"lesson-note"},we(e.hint??""));l.hidden=!0;const o=b("div",{class:"group"}),u=b("button",{class:"primary"},c("web_learn_open_exercise"));u.addEventListener("click",()=>{const g=s().xml;let x=xn(e);if(g)try{x=$t(g)}catch{}this.host.openExercise(e,x)});const h=b("button",{},c("web_learn_check"));if(h.addEventListener("click",()=>{const g=this.host.exerciseDocument(e.id);if(!g){a.className="learn-result info",a.textContent=c("web_learn_open_first");return}if(g.elements.every(Lt)){a.className="learn-result info",a.textContent=c("web_learn_empty");return}const x=l1(g,e.tests),f=o1(g),v=e.requires.map(y=>y==="forZaehlSchleife"?"forSchleife":y).filter(y=>y in m&&!f.has(m[y])),z=x.every(y=>y.passed)&&v.length===0;this.showResult(a,x,v,z),z&&(j.updateExercise(e.id,{done:!0}),r.hidden=!1)}),o.append(u,h),e.hint){const g=b("button",{"aria-expanded":"false"},c("web_learn_hint"));g.addEventListener("click",()=>{l.hidden=!l.hidden,g.setAttribute("aria-expanded",String(!l.hidden))}),o.append(g)}const d=b("button",{class:"danger-text"},c("web_learn_reset"));if(d.addEventListener("click",()=>{if(d.dataset.confirm!=="1"){d.dataset.confirm="1",d.textContent=c("web_learn_reset_confirm"),setTimeout(()=>{d.dataset.confirm="",d.textContent=c("web_learn_reset")},4e3);return}j.resetExercise(e.id),this.host.resetExercise(e.id,xn(e)),r.hidden=!0,a.replaceChildren(),a.className="learn-result",d.dataset.confirm="",d.textContent=c("web_learn_reset")}),o.append(d),n.append(o,l,a),t&&e.solution){const g=kt(e.solution);if(g){const x=b("details",{class:"learn-solution"},b("summary",{},c("web_learn_solution")));x.addEventListener("toggle",()=>{if(!x.open||x.querySelector(".learn-preview"))return;const f=this.host.preview(g);f&&x.append(b("div",{class:"learn-preview",dir:"ltr"},f));const v=b("button",{},c("web_learn_open_in_editor"));v.addEventListener("click",()=>this.host.openDiagram(g,e.solution)),x.append(v)}),n.append(x)}}return n}showResult(e,t,n,s){e.className="learn-result "+(s?"ok":"fail"),e.replaceChildren(b("p",{class:"learn-result-head"},s?`🎉 ${c("web_learn_passed")}`:c("web_learn_failed")));for(const a of n)e.append(b("p",{},`✗ ${c("web_learn_missing_fmt",Ea(m[a]))}`));const r=b("ul",{class:"learn-tests",dir:"auto"});for(const a of t){const l=a.test.inputs.length?c("web_learn_input_fmt",a.test.inputs.join(", ")):c("web_learn_no_input"),o=[`${a.passed?"✓":"✗"} ${l}`],u=b("div",{class:"learn-test-detail"});u.append(b("span",{},`${c("web_learn_expected")}: `,b("code",{},a.test.expected.join(" | ")||"–")),b("span",{},`${c("web_learn_actual")}: `,b("code",{},a.result.outputs.join(" | ")||"–"))),a.result.error&&u.append(b("span",{class:"learn-error"},Et(a.result.error))),a.result.missingInput&&u.append(b("span",{class:"learn-error"},c("web_learn_missing_input"))),a.result.tooManySteps&&u.append(b("span",{class:"learn-error"},c("web_learn_too_many_steps"))),!a.passed&&a.result.unusedInputs&&u.append(b("span",{class:"learn-error"},c("web_learn_unused_input"))),r.append(b("li",{class:a.passed?"ok":"fail"},...o,u))}e.append(r)}renderChecklist(e,t,n){const s=b("ul",{class:"learn-checklist"});return e.forEach((r,a)=>{var h;const l=`${t}-${a}`,o=b("input",{type:"checkbox"});o.checked=!!(n&&((h=j.lesson(n.id).checks)!=null&&h[l])),o.addEventListener("change",()=>{if(!n)return;const d={...j.lesson(n.id).checks??{},[l]:o.checked};j.updateLesson(n.id,{checks:d})});const u=b("label",{},o);u.insertAdjacentHTML("beforeend"," "+ae(r)),s.append(b("li",{},u))}),s}renderQuiz(e,t,n){const s=b("div",{class:"learn-quiz"}),r=b("p",{class:"learn-score",role:"status"}),a=()=>n?j.lesson(n.id).quiz??{}:{},l=()=>{const o=a(),u=e.filter((d,g)=>o[`${t}-${g}`]!==void 0).length,h=e.filter((d,g)=>{var x;return(x=d.options[o[`${t}-${g}`]])==null?void 0:x.correct}).length;r.textContent=u===e.length?c("web_learn_score_fmt",h,e.length):""};return e.forEach((o,u)=>{const h=`${t}-${u}`,d=b("fieldset",{},ie("legend",{},ae(o.question))),g=ie("p",{class:"learn-explanation"},ae(o.explanation??"")),x=f=>{d.querySelectorAll("button").forEach((v,z)=>{v.classList.toggle("right",f!==void 0&&o.options[z].correct),v.classList.toggle("wrong",f===z&&!o.options[z].correct),v.setAttribute("aria-pressed",String(f===z))}),g.hidden=f===void 0||!o.explanation};o.options.forEach((f,v)=>{const z=ie("button",{class:"learn-option"},ae(f.text));z.addEventListener("click",()=>{n&&j.updateLesson(n.id,{quiz:{...a(),[h]:v}}),x(v),l()}),d.append(z)}),d.append(g),x(a()[h]),s.append(d)}),s.append(r),l(),s}}const Aa={left:12,top:10},Ia=8,qe=8e3,Se=16,mt=12,xi="#fafafa";function wi(i){const e=i.caption.trim();return e===""?c("diagram_title_placeholder"):e}function wn(i){let e=i.trim().replace(/\.visustruct$/i,"");if(e==="")return"";for(e=e.replace(/\s/g,"-").replace(/[/:\\*?"<>|]/g,"-");e.includes("--");)e=e.replace(/--/g,"-");return e=e.replace(/^-+|-+$/g,""),e.length>120&&(e=e.slice(0,120).replace(/^-+|-+$/g,"")),e}function Ba(i,e){return wn(i.caption)||wn(e)||"VisuStruct"}function $a(i,e,t){const n=i.split(/\s+/),s=[];let r="";for(const a of n){const l=r?`${r} ${a}`:a;r&&t(l,Se,"bold")>e?(s.push(r),r=a):r=l}if(r&&s.push(r),s.length>2){let a=s.slice(1).join(" ");for(;a.length>1&&t(a+"…",Se,"bold")>e;)a=a.slice(0,-1);return[s[0],a+"…"]}return s}function yn(i,e,t,n=320){const s={...i,elements:i.elements.map(Ue)},r=new jn(e,t).layout(s,Aa),a=Math.min(qe,Math.max(n,r.canvasSize.width)),l=Math.min(qe,Math.max(n,r.canvasSize.height));if(a<=2||l<=2)return;const o=$a(wi(i),a-2*mt,t),u=Math.ceil(Se*1.2),h=Math.min(56,o.length*u+2),d=h+l,g=new Rn(e,t).render(r,{width:a,height:l},void 0,Ia);g.setAttribute("y",String(h)),g.removeAttribute("class");const x=B("svg",{xmlns:"http://www.w3.org/2000/svg",width:a,height:d,viewBox:`0 0 ${a} ${d}`});x.append(B("rect",{x:0,y:0,width:a,height:d,fill:xi}));const f=B("text",{x:mt,y:0,"font-family":Xe,"font-size":Se,"font-weight":600,fill:"black"});return o.forEach((v,z)=>{const y=B("tspan",{x:mt,y:z*u+Se});y.textContent=v,f.append(y)}),x.append(f,g),{svg:x,width:a,height:d}}function yi(i){return`<?xml version="1.0" encoding="UTF-8"?>
`+new XMLSerializer().serializeToString(i.svg)}async function zn(i,e){const t=Math.max(1,Math.min(e,qe/i.width,qe/i.height)),n=URL.createObjectURL(new Blob([yi(i)],{type:"image/svg+xml"}));try{const s=new Image;s.src=n,await s.decode();const r=document.createElement("canvas");r.width=Math.round(i.width*t),r.height=Math.round(i.height*t);const a=r.getContext("2d");return a.fillStyle=xi,a.fillRect(0,0,r.width,r.height),a.drawImage(s,0,0,r.width,r.height),r}finally{URL.revokeObjectURL(n)}}function Ta(i){return new Promise((e,t)=>i.toBlob(n=>n?e(n):t(new Error("PNG konnte nicht erzeugt werden.")),"image/png"))}function Wa(i,e){const s=Math.max(1,i),r=Math.max(1,e),a=v=>{const z=v.width-64,y=v.height-64;return{s:Math.min(z/s,y/r)*.98,cw:z,ch:y}},l={width:595,height:842},o={width:842,height:595},u=a(l),h=a(o),[d,g]=h.s>u.s?[o,h]:[l,u],x=s*g.s,f=r*g.s;return{page:d,draw:{x:32+(g.cw-x)/2,y:32+(g.ch-f)/2,width:x,height:f}}}async function Fa(i){const e=new Blob([i]).stream().pipeThrough(new CompressionStream("deflate"));return new Uint8Array(await new Response(e).arrayBuffer())}function vn(i){let e="FEFF";for(let t=0;t<i.length;t++)e+=i.charCodeAt(t).toString(16).padStart(4,"0").toUpperCase();return`<${e}>`}async function Va(i,e,t,n,s){const{page:r,draw:a}=Wa(n.width,n.height),l=await Fa(i),o=y=>(Math.round(y*100)/100).toString(),u=`q ${o(a.width)} 0 0 ${o(a.height)} ${o(a.x)} ${o(r.height-a.y-a.height)} cm /Im0 Do Q`,h=new TextEncoder,d=[["<< /Type /Catalog /Pages 2 0 R >>"],["<< /Type /Pages /Kids [3 0 R] /Count 1 >>"],[`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${r.width} ${r.height}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`],[`<< /Type /XObject /Subtype /Image /Width ${e} /Height ${t} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${l.length} >>
stream
`,l,`
endstream`],[`<< /Length ${u.length} >>
stream
${u}
endstream`],[`<< /Creator ${vn("VisuStruct")} /Title ${vn(s)} >>`]],g=[];let x=0;const f=y=>{const E=typeof y=="string"?h.encode(y):y;g.push(E),x+=E.length};f(`%PDF-1.4
%âãÏÓ
`);const v=[];d.forEach((y,E)=>{v.push(x),f(`${E+1} 0 obj
`),y.forEach(f),f(`
endobj
`)});const z=x;f(`xref
0 ${d.length+1}
0000000000 65535 f 
`);for(const y of v)f(`${String(y).padStart(10,"0")} 00000 n 
`);return f(`trailer
<< /Size ${d.length+1} /Root 1 0 R /Info ${d.length} 0 R >>
startxref
${z}
%%EOF
`),new Blob(g,{type:"application/pdf"})}function Pa(i){const{data:e}=i.getContext("2d").getImageData(0,0,i.width,i.height),t=new Uint8Array(i.width*i.height*3);for(let n=0,s=0;n<e.length;n+=4,s+=3)t[s]=e[n],t[s+1]=e[n+1],t[s+2]=e[n+2];return t}const Sn=()=>[{description:c("web_file_type"),accept:{"application/xml":[".visustruct",".strk"]}}],gt=i=>c(`element_${m[i]}`),Ma={[m.verzweigung]:"age >= 18",[m.whileSchleife]:"i < 10",[m.doUntilSchleife]:"again == 1",[m.fallauswahl]:"day"},Ca={statement:'int number = 5  |  double x = 1.5  |  String text = "Your text"  |  boolean ok = true  |  const double PI = 3.14',input:'input: int age "Enter age"  |  input: double price "Enter price"  |  input: String name "Enter name"',output:'output: number  |  output: "Your text"  |  output: "Your age: " + age'};function _n(i){switch(i.type){case m.anweisung:{const e=Oe(i.textLines.join(`
`));return e==="input"?"input:":e==="output"?"output:":void 0}case m.verzweigung:return"if";case m.whileSchleife:case m.doUntilSchleife:return"while";case m.fallauswahl:return"switch";default:return}}function ja(i){switch(i.type){case m.anweisung:{const e=Oe(i.textLines.join(`
`));return e==="input"?'int age "Enter age"':e==="output"?'"Your age: " + age':c("inspector_placeholder_statement")}case m.verzweigung:case m.whileSchleife:case m.doUntilSchleife:case m.endlosschleife:return c("inspector_placeholder_condition");case m.fallauswahl:return c("inspector_placeholder_selector");case m.aufruf:return c("inspector_placeholder_call");case m.aussprung:return c("inspector_placeholder_break");default:return""}}function W(i,e={},...t){const n=document.createElement(i);for(const[s,r]of Object.entries(e))n.setAttribute(s,r);return n.append(...t),n}const kn=[{value:1,label:"settings_ui_scale_small"},{value:1.22,label:"settings_ui_scale_medium"},{value:1.5,label:"settings_ui_scale_large"},{value:1.82,label:"settings_ui_scale_extra_large"}],Na=/Mac|iPhone|iPad/.test(navigator.platform);function se(i,e=!1){return Na?`${e?"⇧":""}⌘${i}`:[c("web_key_ctrl"),...e?[c("web_key_shift")]:[],i].join("+")}const S=Oa,En="visustruct.ui.scale.canvas",Dn="visustruct.learn.open",Za=80;class Ra{constructor(e){p(this,"tabs",[]);p(this,"tabIndex",0);p(this,"nextTabSerial",1);p(this,"clipboard");p(this,"zoom",1);p(this,"simulating",!1);p(this,"exportSelect");p(this,"learn");p(this,"shell");p(this,"learning",!1);p(this,"learnButton");p(this,"exerciseSaveTimer");p(this,"resizeObserver");p(this,"simPath");p(this,"sim");p(this,"simButton");p(this,"coding",!1);p(this,"code");p(this,"codeButton");p(this,"measure",Ki());p(this,"metrics",Ji());p(this,"engine",new jn(this.metrics,this.measure));p(this,"renderer",new Rn(this.metrics,this.measure));p(this,"layout");p(this,"flat",[]);p(this,"canvasHost");p(this,"svg");p(this,"overlay");p(this,"inspector");p(this,"captionInput");p(this,"undoButton");p(this,"redoButton");p(this,"deleteButton");p(this,"statusLine");p(this,"drag");p(this,"downloads",null);p(this,"inViewer","claude"in window);p(this,"tabStrip");this.root=e,this.tabs.push(this.makeTab()),this.learn=new La(this.learnHost()),this.shell=document.createElement("div"),this.shell.className="shell",e.replaceWith(this.shell),this.shell.append(this.learn.element,e);const t=Ln(Dn),n=new URLSearchParams(location.search).has("learn");this.setLearning(n||(t===null?window.innerWidth>1100:t==="1"),!1);const s=Number(Ln(En));kn.some(a=>a.value===s)&&(this.zoom=s),this.buildUI(),this.render(),window.addEventListener("pointermove",a=>this.onPointerMove(a)),window.addEventListener("pointerup",a=>this.onPointerUp(a)),window.addEventListener("pointercancel",()=>this.endDrag()),window.addEventListener("keydown",a=>this.onKeyDown(a)),window.addEventListener("beforeunload",a=>{this.tabs.some(l=>l.dirty&&!l.exerciseId)&&a.preventDefault()}),this.setupFileDrop();const r=window.claude;r==null||r.use("downloads").then(a=>this.downloads=a)}get tab(){return this.tabs[this.tabIndex]}get doc(){return this.tab.doc}set doc(e){this.tab.doc=e}get fileName(){return this.tab.fileName??`${fe(this.tab)}.visustruct`}get fileHandle(){return this.tab.fileHandle}set fileHandle(e){this.tab.fileHandle=e}get dirty(){return this.tab.dirty}set dirty(e){this.tab.dirty=e}get undoStack(){return this.tab.undoStack}get redoStack(){return this.tab.redoStack}get selected(){return this.tab.selected}set selected(e){this.tab.selected=e}buildUI(){var l;this.root.className="app",this.root.innerHTML=`
      <header class="toolbar">
        <div class="brand"><span class="logo"></span>VisuStruct <small>${S(c("web_brand_suffix"))}</small></div>
        <div class="group">
          <button data-action="new" title="${S(c("a11y_new_diagram_tab"))}">${S(c("toolbar_new"))}</button>
          <button data-action="open" title="${S(c("menu_open"))} (${se("O")})">${S(c("menu_open"))}</button>
          <button data-action="save" title="${S(c("menu_save"))} (${se("S")})">${S(c("menu_save"))}</button>
          <select data-action="export" title="${S(c("web_export_title"))}">
            <option value="">${S(c("web_export"))}</option>
            <option value="png">${S(c("web_export_png"))}</option>
            <option value="svg">${S(c("web_export_svg"))}</option>
            <option value="pdf">${S(c("web_export_pdf"))}</option>
            <option value="print">${S(c("menu_print"))} (${se("P")})</option>
          </select>
        </div>
        <div class="group">
          <button data-action="undo" title="${S(c("toolbar_undo"))} (${se("Z")})" aria-label="${S(c("toolbar_undo"))}">↶</button>
          <button data-action="redo" title="${S(c("toolbar_redo"))} (${se("Z",!0)})" aria-label="${S(c("toolbar_redo"))}">↷</button>
          <button data-action="cut" title="${S(c("ctx_cut"))} (${se("X")})" aria-label="${S(c("ctx_cut"))}">✂︎</button>
          <button data-action="copy" title="${S(c("ctx_copy"))} (${se("C")})" aria-label="${S(c("ctx_copy"))}">⧉</button>
          <button data-action="paste" title="${S(c("ctx_paste"))} (${se("V")})" aria-label="${S(c("ctx_paste"))}">📋︎</button>
          <button data-action="delete" title="${S(c("action_delete_selection"))} (${S(c("web_key_delete"))})">${S(c("web_delete"))}</button>
        </div>
        <div class="group">
          <select data-action="zoom" title="${S(c("settings_ui_scale_section"))}">${kn.map(o=>`<option value="${o.value}">${S(c("web_zoom_option_fmt",c(o.label)))}</option>`).join("")}</select>
          <select data-action="language" title="${S(c("web_language_title"))}" aria-label="${S(c("web_language_title"))}">${je.map(o=>`<option value="${o.code}" lang="${o.code==="java"?"en":o.code}">${S(o.name)}</option>`).join("")}</select>
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
      <footer class="status"></footer>
      <input type="file" accept=".visustruct,.strk,.xml" hidden />
    `;const e=o=>this.root.querySelector(o);this.canvasHost=e(".canvas"),this.inspector=e(".inspector"),this.captionInput=e(".caption"),this.undoButton=e("[data-action=undo]"),this.redoButton=e("[data-action=redo]"),this.deleteButton=e("[data-action=delete]"),this.statusLine=e(".status"),this.simButton=e("[data-action=simulate]"),this.sim=new _a(()=>this.doc,o=>{this.simPath=o,this.simulating&&this.renderDiagramOnly(),this.scrollToSimPath()}),this.root.append(this.sim.element),this.simButton.addEventListener("click",()=>this.setSimulating(!this.simulating)),this.codeButton=e("[data-action=code]"),this.code=new Ks(()=>this.doc,(o,u)=>this.offerDownload(o,new Blob([u],{type:"text/plain"})),()=>this.setCoding(!1),o=>this.commit({...this.doc,pseudocode:o||void 0})),this.root.append(this.code.element),this.codeButton.addEventListener("click",()=>this.setCoding(!this.coding));const t=e(".palette ul");for(const{item:o}of Jt){const u=gt(Te(o).type),h=document.createElement("li");h.className="palette-item",h.dataset.item=o,h.append(this.paletteIcon(o),document.createTextNode(u)),h.addEventListener("pointerdown",d=>this.beginDrag(d,{kind:"palette",item:o})),h.tabIndex=0,h.addEventListener("keydown",d=>{(d.key==="Enter"||d.key===" ")&&this.insertNearSelection(Te(o))}),t.append(h)}this.learnButton=e("[data-action=learn]"),this.learnButton.addEventListener("click",()=>this.setLearning(!this.learning)),this.learnButton.setAttribute("aria-pressed",String(this.learning)),this.tabStrip=e(".tabs"),this.exportSelect=e("[data-action=export]"),this.exportSelect.addEventListener("change",()=>{const o=this.exportSelect.value;this.exportSelect.value="",o&&this.exportDiagram(o)});const n=e("[data-action=language]");n.value=zt(),n.addEventListener("change",()=>void this.changeLanguage(n.value));const s=e("[data-action=zoom]");s.value=String(this.zoom),s.addEventListener("change",()=>{this.zoom=Number(s.value),An(En,s.value),this.renderDiagramOnly()}),e("[data-action=cut]").addEventListener("click",()=>this.cutSelection()),e("[data-action=copy]").addEventListener("click",()=>this.copySelection()),e("[data-action=paste]").addEventListener("click",()=>this.paste());const r=e("input[type=file]");r.addEventListener("change",async()=>{var u;const o=(u=r.files)==null?void 0:u[0];r.value="",o&&this.loadXML(await o.text(),o.name)}),e("[data-action=new]").addEventListener("click",()=>this.addTab()),e("[data-action=open]").addEventListener("click",()=>this.open(r)),e("[data-action=save]").addEventListener("click",()=>this.save()),this.undoButton.addEventListener("click",()=>this.undo()),this.redoButton.addEventListener("click",()=>this.redo()),this.deleteButton.addEventListener("click",()=>this.deleteSelection());let a;this.captionInput.addEventListener("focus",()=>a=this.doc),this.captionInput.addEventListener("input",()=>{this.doc={...this.doc,caption:this.captionInput.value},this.dirty=!0,this.updateStatus()}),this.captionInput.addEventListener("change",()=>{a&&a.caption!==this.doc.caption&&this.pushUndo(a),a=this.doc}),this.canvasHost.addEventListener("pointerdown",o=>this.onCanvasPointerDown(o)),(l=this.resizeObserver)==null||l.disconnect(),this.resizeObserver=new ResizeObserver(()=>this.renderDiagramOnly()),this.resizeObserver.observe(this.canvasHost)}async changeLanguage(e){this.setSimulating(!1),this.setCoding(!1),await Kn(e),zi(),this.sim.end(),this.buildUI(),this.render(),this.learn.render()}setLearning(e,t=!0){var n;this.learning=e,this.shell.classList.toggle("learning",e),(n=this.learnButton)==null||n.setAttribute("aria-pressed",String(e)),t&&An(Dn,e?"1":"0"),this.canvasHost&&this.renderDiagramOnly()}learnHost(){return{openExercise:(e,t)=>{const n=this.tabs.findIndex(r=>r.exerciseId===e.id);if(n>=0){this.switchTab(n);return}const s=this.makeTab();s.doc=t,s.exerciseId=e.id,s.selected=t.elements.length>0?[0]:void 0,this.isPristine(this.tab)?this.tabs[this.tabIndex]=s:this.tabs.push(s),this.tabIndex=this.tabs.indexOf(s),this.setSimulating(!1),this.render()},openDiagram:(e,t)=>{this.loadXML(rt(e),e.caption.trim()?`${e.caption.trim()}.visustruct`:t)},exerciseDocument:e=>{var t;return(t=this.tabs.find(n=>n.exerciseId===e))==null?void 0:t.doc},resetExercise:(e,t)=>{const n=this.tabs.find(s=>s.exerciseId===e);n&&(n.undoStack.push(n.doc),n.doc=t,n.redoStack=[],n.selected=[0],n===this.tab&&this.render())},preview:e=>{const t=yn(e,this.metrics,this.measure,0);if(t)return t.svg.removeAttribute("width"),t.svg.removeAttribute("height"),t.svg}}}isPristine(e){return!e.dirty&&!e.fileName&&!e.exerciseId&&e.undoStack.length===0}rememberExercise(){const e=this.tab;e.exerciseId&&(clearTimeout(this.exerciseSaveTimer),this.exerciseSaveTimer=window.setTimeout(()=>{e.exerciseId&&j.updateExercise(e.exerciseId,{xml:rt(e.doc)})},300))}paletteIcon(e){const t=B("svg",{viewBox:"0 0 28 20",width:28,height:20,class:"icon"}),n={fill:"none",stroke:"currentColor","stroke-width":1.5};t.append(B("rect",{x:1,y:1,width:26,height:18,...n}));const s=r=>t.append(B("path",{d:r,...n}));switch(e){case"verzweigung":s("M1 1 L14 10 L27 1 M14 10 V19");break;case"fallauswahl":s("M1 1 L20 10 L27 1 M1 10 H27 M10 10 V19 M20 10 V19");break;case"forZaehlSchleife":case"whileSchleife":s("M7 7 H27 M7 7 V19");break;case"doUntilSchleife":s("M7 1 V13 H27");break;case"endlosschleife":s("M7 6 H27 M7 6 V14 H27");break;case"aufruf":s("M5 1 V19 M23 1 V19");break;case"aussprung":s("M6 1 L1 10 L6 19");break}return t}render(){const e={...this.doc,elements:this.doc.elements.map(Ue)};this.layout=this.engine.layout(e),this.flat=es(this.layout.elements),this.selected&&!J(this.doc,this.selected)&&(this.selected=void 0);const t=this.zoom,n={width:Math.max(320,this.layout.canvasSize.width,this.canvasHost.clientWidth/t),height:Math.max(240,this.layout.canvasSize.height+60,this.canvasHost.clientHeight/t)};this.renderer.usesSimulationHighlight=this.simulating,this.svg=this.renderer.render(this.layout,n,this.simulating?this.simPath:this.selected),this.svg.setAttribute("width",String(n.width*t)),this.svg.setAttribute("height",String(n.height*t)),this.overlay=B("g",{class:"drop-overlay"}),this.svg.append(this.overlay),this.canvasHost.replaceChildren(this.svg),document.activeElement!==this.captionInput&&(this.captionInput.value=this.doc.caption),this.undoButton.disabled=this.simulating||this.undoStack.length===0,this.redoButton.disabled=this.simulating||this.redoStack.length===0,this.deleteButton.disabled=this.simulating||!this.selected||!it(this.doc,this.selected),this.captionInput.readOnly=this.simulating,this.codeButton.disabled=this.simulating,this.exportSelect.disabled=this.simulating,this.coding&&this.code.refresh(),this.renderTabs(),this.renderInspector(),this.updateStatus()}updateStatus(){this.rememberExercise(),document.title=`${this.dirty?"• ":""}${this.fileName} – VisuStruct Web`,this.statusLine.textContent=`${this.fileName}${this.dirty?` (${c("web_status_modified")})`:""}`}renderInspector(){const e=this.selected,t=e?J(this.doc,e):void 0,n=this.inspector;if(!e||!t){n.replaceChildren(W("h2",{},c("web_inspector_title")),W("p",{class:"hint"},c("inspector_no_selection")),W("p",{class:"hint"},c("web_inspector_help_drop")),W("p",{class:"hint"},c("web_inspector_help_files")));return}if(n.replaceChildren(W("h2",{},gt(t.type))),t.type===m.anweisung){const s=Oe(t.textLines.join(`
`)),r=W("div",{class:"segmented",role:"group","aria-label":c("inspector_io_mode_title")});for(const[a,l]of[["statement",c("inspector_io_mode_statement")],["input",c("inspector_io_mode_input")],["output",c("inspector_io_mode_output")]]){const o=W("button",{"aria-pressed":String(a===s)},l);o.addEventListener("click",()=>{var d,g;const u=((d=J(this.doc,e))==null?void 0:d.textLines.join(`
`))??"";if(a===Oe(u))return;const h=Ni(a,u);this.commit(nt(this.doc,e,h.split(`
`))),(g=this.inspector.querySelector("textarea"))==null||g.focus()}),r.append(o)}n.append(r,W("p",{class:"hint mono-hint"},Ca[s]))}if(t.type===m.forSchleife){const s=W("div",{class:"for-fields"}),r=Ht(t.textLines);[[c("inspector_for_init"),c("inspector_for_placeholder_init")],[c("inspector_for_condition"),c("inspector_for_placeholder_condition")],[c("inspector_for_step"),c("inspector_for_placeholder_step")]].forEach(([l,o],u)=>{const h=W("input",{placeholder:o,spellcheck:"false",autocomplete:"off"});h.value=r[u],this.liveEdit(h,d=>{const g=J(this.doc,e);if(!g)return;const x=Ht(g.textLines);return x[u]=Oi(d),nt(this.doc,e,x)}),s.append(W("label",{},l,h))}),n.append(s)}else if(t.type!==m.leerElement){const s=Ma[t.type];s&&n.append(W("p",{class:"hint mono-hint"},s));const r=_n(t),a=W("textarea",{rows:"3",spellcheck:"false"}),l=t.textLines.join(`
`);a.value=r?Ot(r,l):l,a.placeholder=ja(t),a.addEventListener("focus",()=>{a.value.trim()==="ø"&&a.select()}),this.liveEdit(a,u=>{const h=_n(J(this.doc,e)??t),d=h?Ri(h,Ot(h,u)):u;return nt(this.doc,e,d.split(`
`))});const o=W("div",{class:"editor-row"});r&&o.append(W("span",{class:"fixed-prefix"},r)),o.append(a),n.append(o)}this.renderCaseControls(e)}renderCaseControls(e){var o;const t=Mi(e,this.doc);if(!t)return;const n=((o=J(this.doc,t))==null?void 0:o.cases)??[],s=Ci(e,t),r=W("div",{class:"case-controls"});if(s!==void 0&&n[s]){const u=W("input",{placeholder:c("web_case_name_placeholder"),spellcheck:"false",autocomplete:"off"});u.value=n[s].name,this.liveEdit(u,h=>h.trim()===""?void 0:Pi(this.doc,t,s,h)),r.append(W("label",{},c("web_case_name"),u))}const a=W("button",{},`＋ ${c("inspector_add_case")}`);a.addEventListener("click",()=>{const u=Fi(this.doc,t);this.commit(u.doc,u.path)});const l=W("button",{class:"danger-text"},`－ ${c("inspector_remove_case")}`);l.disabled=n.length<=2||s===void 0,l.addEventListener("click",()=>{if(s===void 0)return;const u=Vi(this.doc,t,s);this.commit(u.doc,u.path)}),r.append(W("div",{class:"group"},a,l)),this.inspector.append(r)}liveEdit(e,t){let n;e.addEventListener("focus",()=>n=this.doc),e.addEventListener("input",()=>{const s=Fn(e.value);if(s!==e.value){const a=e.selectionStart;e.value=s,e.setSelectionRange(a,a)}const r=t(s);r&&(this.doc=r,this.dirty=!0,this.renderDiagramOnly())}),e.addEventListener("blur",()=>{n&&n!==this.doc&&this.pushUndo(n),n=void 0,this.renderDiagramOnly()})}renderDiagramOnly(){const e=this.selected,t=this.inspector,n=document.createElement("aside");this.inspector=n,this.render(),this.inspector=t,this.selected=e}setSimulating(e){e!==this.simulating&&(document.activeElement instanceof HTMLElement&&document.activeElement.blur(),this.endDrag(),this.simulating=e,this.root.classList.toggle("simulating",e),this.simButton.setAttribute("aria-pressed",String(e)),this.simButton.textContent=e?`✎ ${c("action_diagram")}`:`▶︎ ${c("action_simulation")}`,this.simButton.title=c(e?"web_simulation_end_title":"web_simulation_start_title"),e?(this.setCoding(!1),this.sim.begin()):(this.sim.end(),this.simPath=void 0,!this.selected&&this.doc.elements.length>0&&(this.selected=[0])),this.render())}setCoding(e){e!==this.coding&&(this.coding=e,this.root.classList.toggle("coding",e),this.codeButton.setAttribute("aria-pressed",String(e)),e?this.code.refresh():this.code.close(),this.renderDiagramOnly())}scrollToSimPath(){const e=this.simPath;if(!this.simulating||!e)return;const t=this.flat.find(l=>yt(l.idPath,e));if(!t)return;const n=this.canvasHost,s=this.zoom,r={x:t.frame.x*s,y:t.frame.y*s,width:t.frame.width*s,height:t.frame.height*s},a=24;r.y<n.scrollTop?n.scrollTop=Math.max(0,r.y-a):r.y+Math.min(r.height,n.clientHeight-2*a)>n.scrollTop+n.clientHeight&&(n.scrollTop=r.y-a),(r.x<n.scrollLeft||r.x>n.scrollLeft+n.clientWidth-a)&&(n.scrollLeft=Math.max(0,r.x-a))}commit(e,t){this.pushUndo(this.doc),this.doc=e,this.dirty=!0,t&&(this.selected=t),this.render()}pushUndo(e){for(this.undoStack.push(e);this.undoStack.length>Za;)this.undoStack.shift();this.tab.redoStack=[]}undo(){const e=this.undoStack.pop();e&&(this.redoStack.push(this.doc),this.doc=e,this.dirty=!0,this.selected=Nt(this.selected,this.doc),this.render())}redo(){const e=this.redoStack.pop();e&&(this.undoStack.push(this.doc),this.doc=e,this.dirty=!0,this.selected=Nt(this.selected,this.doc),this.render())}resetHistory(){this.setSimulating(!1),this.tab.undoStack=[],this.tab.redoStack=[],this.selected=void 0,this.dirty=!1,this.render()}makeTab(){return{doc:Bi(),serial:this.nextTabSerial++,dirty:!1,undoStack:[],redoStack:[],selected:[0]}}addTab(e=this.makeTab()){this.setSimulating(!1),this.tabs.push(e),this.tabIndex=this.tabs.length-1,this.render()}switchTab(e){e===this.tabIndex||!this.tabs[e]||(document.activeElement instanceof HTMLElement&&document.activeElement.blur(),this.setSimulating(!1),this.tabIndex=e,this.render())}async closeTab(e){if(this.tabs.length<=1)return;const t=this.tabs[e];t.dirty&&!t.exerciseId&&(this.switchTab(e),!await this.confirmDiscard())||(this.setSimulating(!1),this.tabs.splice(e,1),(this.tabIndex>e||this.tabIndex>=this.tabs.length)&&(this.tabIndex=Math.max(0,this.tabIndex-1)),this.render())}renderTabs(){const e=this.tabStrip;e.replaceChildren(),this.tabs.forEach((n,s)=>{const r=document.createElement("div");r.className="tab"+(s===this.tabIndex?" active":""),r.setAttribute("role","tab"),r.setAttribute("aria-selected",String(s===this.tabIndex));const a=document.createElement("button");if(a.className="tab-label",a.textContent=(n.dirty?"• ":"")+fe(n),a.title=n.fileName??fe(n),a.addEventListener("click",()=>this.switchTab(s)),r.append(a),this.tabs.length>1){const l=document.createElement("button");l.className="tab-close",l.textContent="✕",l.title=c("a11y_close_tab"),l.setAttribute("aria-label",`${c("a11y_close_tab")}: ${fe(n)}`),l.addEventListener("click",()=>this.closeTab(s)),r.append(l)}e.append(r)});const t=document.createElement("button");t.className="tab-add",t.textContent="+",t.title=c("a11y_new_diagram_tab"),t.setAttribute("aria-label",c("a11y_new_diagram_tab")),t.addEventListener("click",()=>this.addTab()),e.append(t)}copySelection(){const e=this.selected&&J(this.doc,this.selected);return e?(this.clipboard=structuredClone(e),this.showMessage(c("web_copied")),!0):!1}cutSelection(){this.selected&&it(this.doc,this.selected)&&this.copySelection()&&this.deleteSelection()}paste(){this.clipboard&&this.insertNearSelection(structuredClone(this.clipboard))}deleteSelection(){!this.selected||!it(this.doc,this.selected)||(this.commit(ke(this.doc,this.selected)),this.selected=void 0,this.render())}insertNearSelection(e){const t=this.selected;if(t&&pe(this.doc,t))return this.commit(le(this.doc,t,e),t);if(t){const n=[...t.slice(0,-1),t[t.length-1]+1];return this.commit(pt(this.doc,e,t),n)}if(this.doc.elements.length===1&&pe(this.doc,[0]))return this.commit(le(this.doc,[0],e),[0]);this.commit(ye(this.doc,[],this.doc.elements.length,e),[this.doc.elements.length])}confirmDiscard(){return this.dirty?new Promise(e=>{const t=document.createElement("div");t.className="confirm",t.innerHTML=`<div class="confirm-card" role="alertdialog" aria-label="${S(c("close_unsaved_title"))}">
        <p><strong>${S(c("close_unsaved_title"))}</strong></p>
        <p class="hint">${S(c("web_discard_message_fmt",this.fileName))}</p>
        <div class="group"><button data-r="0">${S(c("close_unsaved_cancel"))}</button><button data-r="1" class="danger">${S(c("close_unsaved_discard"))}</button></div>
      </div>`,t.addEventListener("click",n=>{const s=n.target.dataset.r;s===void 0&&n.target!==t||(t.remove(),e(s==="1"))}),document.body.append(t),t.querySelector('[data-r="0"]').focus()}):Promise.resolve(!0)}showMessage(e){this.statusLine.textContent=e,this.statusLine.classList.add("message"),setTimeout(()=>{this.statusLine.classList.remove("message"),this.updateStatus()},6e3)}loadXML(e,t,n){let s;try{s=$t(e)}catch(r){this.showMessage(c("web_err_unreadable_fmt",t,r.message));return}(this.dirty||this.tab.fileName)&&this.addTab(),this.doc=s,this.tab.fileName=t.replace(/\.(strk|xml)$/i,".visustruct"),this.fileHandle=n&&/\.visustruct$/i.test(t)?n:void 0,this.resetHistory()}async open(e){const t=window;if(!t.showOpenFilePicker||this.inViewer)return e.click();try{const[n]=await t.showOpenFilePicker({types:Sn()}),s=await n.getFile();this.loadXML(await s.text(),s.name,n)}catch{}}async save(){var n,s;const e=new Blob([rt(this.doc)],{type:"application/xml"}),t=window;try{if(this.downloads){const r=this.fileName+".txt";await this.downloads.save({filename:r,data:e}),(n=this.tab).fileName??(n.fileName=this.fileName),this.dirty=!1,this.render(),this.showMessage(c("web_saved_txt_fmt",r));return}if(!this.fileHandle&&t.showSaveFilePicker&&!this.inViewer&&(this.fileHandle=await t.showSaveFilePicker({suggestedName:this.fileName,types:Sn()}),this.tab.fileName=this.fileHandle.name),this.fileHandle){const r=await this.fileHandle.createWritable();await r.write(e),await r.close()}else{const r=document.createElement("a");r.href=URL.createObjectURL(e),r.download=this.fileName,r.click(),setTimeout(()=>URL.revokeObjectURL(r.href),1e3)}(s=this.tab).fileName??(s.fileName=this.fileName),this.dirty=!1,this.render()}catch{}}async exportDiagram(e){const t=yn(this.doc,this.metrics,this.measure);if(!t){this.showMessage(c(e==="print"?"err_diagram_too_small_print":"err_diagram_too_small_export"));return}const n=Ba(this.doc,fe(this.tab)),s=Math.max(2,window.devicePixelRatio||1)*this.zoom;try{switch(e){case"svg":{t.svg.setAttribute("width",String(t.width*this.zoom)),t.svg.setAttribute("height",String(t.height*this.zoom)),await this.offerDownload(`${n}.svg`,new Blob([yi(t)],{type:"image/svg+xml"}));break}case"png":{const r=await zn(t,s);await this.offerDownload(`${n}.png`,await Ta(r));break}case"pdf":{const r=await zn(t,Math.max(s,3)),a=await Va(Pa(r),r.width,r.height,t,wi(this.doc));await this.offerDownload(`${n}.pdf`,a);break}case"print":this.printDiagram(t);break}}catch(r){this.showMessage(c("web_export_failed_fmt",r instanceof Error?r.message:String(r)))}}printDiagram(e){const t=document.createElement("div");t.className="print-sheet",e.svg.removeAttribute("width"),e.svg.removeAttribute("height"),t.append(e.svg),document.body.append(t);const n=()=>t.remove();window.addEventListener("afterprint",n,{once:!0});try{window.print()}catch{n(),this.showMessage(`${c("err_print_unavailable")} ${c("web_print_hint")}`);return}setTimeout(n,6e4)}async offerDownload(e,t){try{if(this.downloads){try{await this.downloads.save({filename:e,data:t}),this.showMessage(c("web_saved_fmt",e))}catch{await this.downloads.save({filename:e+".txt",data:t}),this.showMessage(c("web_saved_txt_fmt",e+".txt"))}return}const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),setTimeout(()=>URL.revokeObjectURL(n.href),1e3)}catch{this.showMessage(c("err_save_failed_fmt",e))}}setupFileDrop(){window.addEventListener("dragover",e=>{var t;(t=e.dataTransfer)!=null&&t.types.includes("Files")&&(e.preventDefault(),this.root.classList.add("file-drag"))}),window.addEventListener("dragleave",e=>{e.relatedTarget===null&&this.root.classList.remove("file-drag")}),window.addEventListener("drop",async e=>{var n;this.root.classList.remove("file-drag");const t=(n=e.dataTransfer)==null?void 0:n.files[0];t&&(e.preventDefault(),this.loadXML(await t.text(),t.name))})}onKeyDown(e){var s;const t=e.metaKey||e.ctrlKey,n=e.target instanceof HTMLTextAreaElement||e.target instanceof HTMLInputElement;if(t&&e.key.toLowerCase()==="s")e.preventDefault(),this.save();else if(t&&e.key.toLowerCase()==="p")e.preventDefault(),this.simulating||this.exportDiagram("print");else if(t&&e.key.toLowerCase()==="o")e.preventDefault(),this.open(this.root.querySelector("input[type=file]"));else{if(n||this.simulating)return;t&&e.key.toLowerCase()==="z"?(e.preventDefault(),e.shiftKey?this.redo():this.undo()):t&&e.key.toLowerCase()==="c"&&!((s=getSelection())!=null&&s.toString())?this.copySelection()&&e.preventDefault():t&&e.key.toLowerCase()==="x"?(e.preventDefault(),this.cutSelection()):t&&e.key.toLowerCase()==="v"?(e.preventDefault(),this.paste()):t&&e.key.toLowerCase()==="y"?(e.preventDefault(),this.redo()):e.key==="Delete"||e.key==="Backspace"?(e.preventDefault(),this.deleteSelection()):e.key==="Escape"&&(this.drag?this.endDrag():(this.selected=void 0,this.render()))}}svgPoint(e,t){if(!this.svg)return;const n=this.svg.getBoundingClientRect(),s=e-n.left,r=t-n.top;if(!(s<0||r<0||s>n.width||r>n.height))return{x:s/this.zoom,y:r/this.zoom}}nodeAt(e,t){for(let n=this.flat.length-1;n>=0;n--){const s=this.flat[n].frame;if(e>=s.x&&e<=s.x+s.width&&t>=s.y&&t<=s.y+s.height)return this.flat[n]}}onCanvasPointerDown(e){if(this.simulating)return;const t=this.svgPoint(e.clientX,e.clientY);if(!t)return;document.activeElement instanceof HTMLElement&&document.activeElement.blur();const n=this.nodeAt(t.x,t.y),s=n&&this.selected&&yt(n.idPath,this.selected);this.selected=n==null?void 0:n.idPath,this.render(),n&&e.pointerType!=="touch"&&!(pe(this.doc,n.idPath)&&!s)&&this.beginDrag(e,{kind:"move",path:n.idPath})}beginDrag(e,t){e.button!==0||this.simulating||(e.preventDefault(),this.drag={source:t,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,active:!1})}onPointerMove(e){const t=this.drag;if(!t||e.pointerId!==t.pointerId)return;if(!t.active){if(Math.hypot(e.clientX-t.startX,e.clientY-t.startY)<5)return;t.active=!0,t.ghost=this.makeGhost(t.source),document.body.append(t.ghost),this.root.classList.add("dragging")}t.ghost.style.transform=`translate(${e.clientX+12}px, ${e.clientY+12}px)`,this.autoScroll(e.clientX,e.clientY);const n=this.svgPoint(e.clientX,e.clientY);t.target=n?this.dropTargetAt(n.x,n.y,t.source):void 0,this.showDropTarget(t.target)}onPointerUp(e){const t=this.drag;!t||e.pointerId!==t.pointerId||(t.active&&t.target?this.applyDrop(t.source,t.target):!t.active&&t.source.kind==="palette"&&this.insertNearSelection(Te(t.source.item)),this.endDrag())}endDrag(){var e,t;(t=(e=this.drag)==null?void 0:e.ghost)==null||t.remove(),this.drag=void 0,this.root.classList.remove("dragging"),this.showDropTarget(void 0)}makeGhost(e){const t=document.createElement("div");if(t.className="drag-ghost",e.kind==="palette")t.textContent=Jt.find(n=>n.item===e.item).label;else{const n=G(this.doc,e.path);t.textContent=`${gt(n.type)}: ${Dt(n)[0]}`}return t}autoScroll(e,t){const n=this.canvasHost.getBoundingClientRect(),s=40,r=12;t>n.bottom-s&&t<n.bottom+s?this.canvasHost.scrollTop+=r:t<n.top+s&&t>n.top-s&&(this.canvasHost.scrollTop-=r),e>n.right-s&&e<n.right+s?this.canvasHost.scrollLeft+=r:e<n.left+s&&e>n.left-s&&(this.canvasHost.scrollLeft-=r)}dropTargetAt(e,t,n){var o;const s=((o=this.layout)==null?void 0:o.elements)??[],r=this.nodeAt(e,t);if(!r){const u=s[s.length-1];if(!u)return;const h=u.frame.y+u.frame.height;return t>h?n.kind==="move"&&n.path.length===1&&n.path[0]===s.length-1?void 0:{kind:"rootAppend",frame:{x:u.frame.x,y:h,width:u.frame.width,height:0}}:t<s[0].frame.y?{kind:"before",path:[0],frame:s[0].frame}:void 0}const a=r.idPath;return n.kind==="move"&&a.length>=n.path.length&&n.path.every((u,h)=>a[h]===u)?void 0:pe(this.doc,a)?{kind:"replace",path:a,frame:r.frame}:{kind:t<r.frame.y+r.frame.height/2?"before":"after",path:a,frame:r.frame}}showDropTarget(e){if(!this.overlay||(this.overlay.replaceChildren(),!e))return;const t=e.frame;if(e.kind==="replace"){this.overlay.append(B("rect",{x:t.x+2,y:t.y+2,width:t.width-4,height:t.height-4,class:"drop-replace"}));return}const n=e.kind==="before"?t.y:t.y+t.height;this.overlay.append(B("rect",{x:t.x,y:n-3,width:t.width,height:6,rx:3,class:"drop-line"}))}applyDrop(e,t){const n=this.doc;try{if(e.kind==="palette"){const r=Te(e.item);switch(t.kind){case"replace":return this.commit(le(n,t.path,r),t.path);case"before":return this.commit(Tn(n,r,t.path),t.path);case"after":return this.commit(pt(n,r,t.path),[...t.path.slice(0,-1),t.path[t.path.length-1]+1]);case"rootAppend":return this.commit(ye(n,[],n.elements.length,r),[n.elements.length])}}const s=e.path;switch(t.kind){case"replace":return this.commit(Wi(n,s,t.path));case"before":return this.commit($i(n,s,t.path));case"after":return this.commit(Ti(n,s,t.path));case"rootAppend":{const r=G(n,s);return this.commit(ye(ke(n,s),[],Number.MAX_SAFE_INTEGER,r))}}}catch(s){console.warn("Ablegen nicht möglich",s)}finally{e.kind==="move"&&(this.selected=void 0,this.render())}}}function zi(){Ii({[m.anweisung]:c("canvas_stub_anweisung"),[m.verzweigung]:c("canvas_stub_condition"),[m.fallauswahl]:c("canvas_stub_fallauswahl"),[m.forSchleife]:c("canvas_stub_for"),[m.whileSchleife]:c("canvas_stub_while"),[m.doUntilSchleife]:c("canvas_stub_while"),[m.endlosschleife]:c("canvas_stub_endless"),[m.aussprung]:c("canvas_stub_break"),[m.aufruf]:c("canvas_stub_call")})}function fe(i){return i.fileName?i.fileName.replace(/\.(visustruct|strk)$/i,""):i.doc.caption.trim()||c("tab_title_format",i.serial)}function Ln(i){try{return localStorage.getItem(i)}catch{return null}}function An(i,e){try{localStorage.setItem(i,e)}catch{}}function Oa(i){return i.replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}Kn(ls(),!1).then(()=>{zi(),new Ra(document.getElementById("app"))});
