var Hi=Object.defineProperty;var Vi=(i,e,t)=>e in i?Hi(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var b=(i,e,t)=>Vi(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();var m=(i=>(i[i.anweisung=0]="anweisung",i[i.verzweigung=1]="verzweigung",i[i.fallauswahl=2]="fallauswahl",i[i.forSchleife=3]="forSchleife",i[i.whileSchleife=4]="whileSchleife",i[i.doUntilSchleife=5]="doUntilSchleife",i[i.endlosschleife=6]="endlosschleife",i[i.aussprung=7]="aussprung",i[i.aufruf=8]="aufruf",i[i.leerElement=9]="leerElement",i))(m||{});function Gi(i){return i===3||i===4||i===5||i===6}function Fi(i){return i===1||i===2}function Y(i,e={}){return{type:i,zoomX:0,zoomY:0,textLines:[""],...e}}function Ri(i){const e=i.textLines;if(!e.every(t=>t.trim()===""))switch(i.type){case m.forSchleife:return e.length<=1?e:[Ui(e)];case m.verzweigung:return Be("if",e);case m.whileSchleife:return Be("while",e);case m.doUntilSchleife:return Be("while",$i(e));case m.fallauswahl:return Be("switch",e);default:return e}}function $i(i){if(i.length===0)return i;const e=i[0].trim(),t=e.toLowerCase(),n=[...i];if(t==="until")n[0]="";else if(t.startsWith("until "))n[0]=e.slice(6).trim();else if(t.startsWith("until("))n[0]=e.slice(5);else return i;return n}function Xt(i){const e=new Set(["if","for","while","until","switch"]),t=["input:","output:","print:"],n=i.trim(),s=n.toLowerCase();for(const l of t){if(s===l)return{keyword:n,rest:""};if(s.startsWith(l+" "))return{keyword:n.slice(0,l.length),rest:n.slice(l.length).trim()}}const r=n.indexOf(" ");if(r<0)return;const a=n.slice(0,r);if(e.has(a.toLowerCase()))return{keyword:a,rest:n.slice(r+1).trim()}}function Be(i,e){if(e.length===0)return e;const t=e[0].trim(),n=t.toLowerCase();if(n===i||n.startsWith(i+" "))return e;const s=[...e];return s[0]=i+" "+t,s}function Ui(i){let e=[...i];for(;e.length<3;)e.push("");e=e.slice(0,3);const t=s=>{let r=s.trim();for(;r.endsWith(";");)r=r.slice(0,-1).trim();return r},n=e.map(t).join("; ").trim();return n===""?"for":"for "+n}const $n={[m.anweisung]:"Anweisung",[m.verzweigung]:"Bedingung",[m.fallauswahl]:"Fallauswahl",[m.forSchleife]:"for 0 < i < anzahl",[m.whileSchleife]:"while …",[m.doUntilSchleife]:"while …",[m.endlosschleife]:"endless",[m.aussprung]:"break",[m.aufruf]:"Aufruf()",[m.leerElement]:"ø"};function Oi(i){Object.assign($n,i)}function Ct(i){return Ri(i)??[$n[i.type]]}class L extends Error{}const ie=i=>structuredClone(i);function _e(){return Y(m.anweisung,{textLines:["ø"]})}function Xi(){return{caption:"",elements:[_e()]}}function Pt(i){if(i.type===m.leerElement)return!0;if(i.type===m.anweisung){const e=i.textLines;return e.length===0||e.length===1&&e[0]==="ø"}return!1}function be(i,e){const t=J(i,e);return t!==void 0&&Pt(t)}function Ze(i,e){if(e.length===0)throw new L("Invalid element path.");const[t,...n]=e;if(t<0||t>=i.length)throw new L("Invalid element path.");if(n.length===0)return{list:i,index:t};const[s,...r]=n;if(r.length===0)throw new L("Invalid element path.");return Ze(Un(i[t],s),r)}function Un(i,e){if(Gi(i.type)){if(e!==0||!i.loopBody)throw new L("Invalid element path.");return i.loopBody}if(Fi(i.type)){if(!i.cases||e<0||e>=i.cases.length)throw new L("Invalid element path.");return i.cases[e].elements}throw new L("Invalid element path.")}function q(i,e){const{list:t,index:n}=Ze(i.elements,e);return t[n]}function J(i,e){try{return q(i,e)}catch{return}}function ue(i,e,t){const n=ie(i),{list:s,index:r}=Ze(n.elements,e);return s[r]=ie(t),n}function rt(i,e,t){const n=ie(q(i,e));return n.textLines=t.length===0?[""]:t,ue(i,e,n)}function at(i,e){return e.length===0?!1:e.length===1&&i.elements.length===1?!be(i,e):J(i,e)!==void 0}function De(i,e){const t=ie(i),{list:n,index:s}=Ze(t.elements,e);if(e.length===1&&n.length===1){if(Pt(n[0]))throw new L("The last root element cannot be deleted.");return n[0]=_e(),t}return n.splice(s,1),e.length>1&&n.length===0&&n.push(_e()),t}function ye(i,e,t,n){const s=ie(i);let r;if(e.length===0)r=s.elements;else{const a=e.slice(0,-1),l=e[e.length-1],{list:o,index:u}=Ze(s.elements,a);r=Un(o[u],l)}return r.splice(Math.min(Math.max(0,t),r.length),0,ie(n)),s}function On(i,e,t){if(t.length===0)throw new L("Invalid element path.");return ye(i,t.slice(0,-1),t[t.length-1],e)}function vt(i,e,t){if(t.length===0)throw new L("Invalid element path.");return ye(i,t.slice(0,-1),t[t.length-1]+1,e)}function Lt(i,e){return i.length<e.length&&i.every((t,n)=>e[n]===t)}function Tt(i,e){if(e.length===0)return i;const t=e[e.length-1],n=e.slice(0,-1);if(i.length<=n.length||!n.every((a,l)=>i[l]===a))return i;const s=n.length;if(i[s]<=t)return i;const r=[...i];return r[s]-=1,r}const Nt=(i,e)=>i.length===e.length&&i.every((t,n)=>t===e[n]);function Yi(i,e,t){if(Nt(e,t))return i;if(Lt(e,t))throw new L("Invalid element path.");const n=q(i,e),s=De(i,e);return On(s,n,Tt(t,e))}function Ji(i,e,t){if(Nt(e,t))return i;if(Lt(e,t))throw new L("Invalid element path.");const n=q(i,e),s=De(i,e);return vt(s,n,Tt(t,e))}function Ki(i,e,t){if(!be(i,t))throw new L("Invalid element path.");if(Nt(e,t))return i;if(Lt(e,t))throw new L("Invalid element path.");const n=q(i,e),s=De(i,e);return ue(s,Tt(t,e),n)}function Qi(i,e){const t=ie(q(i,e)),n=t.cases;if(t.type!==m.fallauswahl||!n||n.length===0)throw new L("Invalid element path.");const s=n[n.length-1].name.toLowerCase()==="default",r=s?n.length-1:n.length,a=String(s?n.length:n.length+1);return n.splice(r,0,{name:a,elements:[_e()]}),{doc:ue(i,e,t),path:[...e,r,0]}}function qi(i,e,t){const n=ie(q(i,e)),s=n.cases;if(n.type!==m.fallauswahl||!s)throw new L("Invalid element path.");if(s.length<=2)throw new L("A switch needs at least two cases.");if(t<0||t>=s.length)throw new L("Invalid element path.");s.splice(t,1);const r=Math.min(t,s.length-1);return{doc:ue(i,e,n),path:[...e,r,0]}}function es(i,e,t,n){const s=ie(q(i,e)),r=s.cases;if(s.type!==m.fallauswahl||!r)throw new L("Invalid element path.");if(t<0||t>=r.length)throw new L("Invalid element path.");const a=n.trim();if(a==="")throw new L("Invalid element path.");return r[t].name=a,ue(i,e,s)}function ts(i,e){var t;if(!(!i||i.length===0))for(let n=i.length;n>=1;n--){const s=i.slice(0,n);if(((t=J(e,s))==null?void 0:t.type)===m.fallauswahl)return s}}function ns(i,e){if(!(!i||i.length<=e.length))return i[e.length]}function Yt(i,e){if(e.elements.length!==0)return!i||!J(e,i)?[0]:i}const Xn=i=>i!==void 0&&/\s/.test(i);function Ue(i){const e=i.trim().toLowerCase();return e.startsWith("input:")?"input":e.startsWith("output:")||e.startsWith("print:")?"output":"statement"}function is(i){const e=i.trim(),t=e.toLowerCase();return t.startsWith("input:")?e.slice(6).trim():t.startsWith("output:")?e.slice(7).trim():t.startsWith("print:")?e.slice(6).trim():i}function Jt(i,e){const t=e.trim();return t===""?`${i} `:`${i} ${t}`}function ss(i,e){const t=is(e);switch(i){case"statement":return t;case"input":return Jt("input:",t);case"output":return Jt("output:",t)}}const He=i=>Xn(i[0])?i.slice(1):i;function rs(i){const e=i.replace(/^\s+/,""),t=e.toLowerCase();return t.startsWith("input:")?He(e.slice(6)):t.startsWith("output:")?He(e.slice(7)):t.startsWith("print:")?He(e.slice(6)):i}function Kt(i,e){const t=e.replace(/^\s+/,"");if(!t.toLowerCase().startsWith(i.toLowerCase()))return e;const n=t.slice(i.length);if(!(n===""||Xn(n[0])||n[0]==="("))return e;const s=He(n);return s.startsWith("(")&&s.endsWith(")")&&s.length>=2?s.slice(1,-1):s}function Qt(i,e){if(i==="input:"||i==="output:")return rs(e);const t=Kt(i,e);if(i==="while"&&t===e){const n=Kt("until",e);if(n!==e)return n}return t}function as(i,e){return e===""?`${i} `:`${i} ${e}`}function Yn(i){return i.replace(/[“”„«»]/g,'"').replace(/[’‘‚´]/g,"'")}function qt(i){const e=i.length===0?[""]:i.slice(0,3);for(;e.length<3;)e.push("");return e}function ls(i){let e=Yn(i);for(;;){const t=e.trim();if(!t.endsWith(";"))return e;e=t.slice(0,-1).trim()}}const qe='system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';function os(i,e){return`${e==="bold"?700:500} ${i}px ${qe}`}const Jn=(i,e,t)=>[...i].length*e*(t==="bold"?.68:.62);function us(){if(typeof document>"u"||!document.body)return;const i="http://www.w3.org/2000/svg",e=document.createElementNS(i,"svg");e.setAttribute("aria-hidden","true"),e.setAttribute("width","0"),e.setAttribute("height","0"),e.style.cssText="position:absolute;left:-9999px;top:0;visibility:hidden;overflow:hidden";const t=document.createElementNS(i,"text");if(t.setAttribute("font-family",qe),t.style.whiteSpace="pre",e.append(t),document.body.append(e),typeof t.getComputedTextLength!="function"||typeof t.getBBox!="function"){e.remove();return}if(t.textContent="Mg",t.setAttribute("font-size","20"),!(t.getComputedTextLength()>0)){e.remove();return}return t}let lt;function Kn(){return lt===void 0&&(lt=us()??null),lt??void 0}function Qn(i,e,t){i.setAttribute("font-size",String(e)),i.setAttribute("font-weight",t==="bold"?"700":"500")}function en(i,e){const t=`${i}|${e}`;let n=tn.get(t);if(!n){const s=Kn();if(n={ascent:i*.95,descent:i*.24},s){Qn(s,i,e),s.setAttribute("y","0"),s.textContent="Mg";const r=s.getBBox();r.height>0&&(n={ascent:-r.y,descent:r.height+r.y})}tn.set(t,n)}return n}const tn=new Map;function cs(){const i=Kn();if(i){const n=new Map;return(s,r,a)=>{const l=`${r}|${a}|${s}`;let o=n.get(l);return o===void 0&&(Qn(i,r,a),i.textContent=s,o=s===""?0:i.getComputedTextLength(),n.size>2e3&&n.clear(),n.set(l,o)),o}}const e=typeof document<"u"?document.createElement("canvas").getContext("2d"):null;if(!e)return Jn;const t=new Map;return(n,s,r)=>{const a=`${s}|${r}|${n}`;let l=t.get(a);return l===void 0&&(e.font=os(s,r),l=e.measureText(n).width,t.size>2e3&&t.clear(),t.set(a,l)),l}}const qn={fontSize:15,lineHeight:20,charWidth:7,baseHeaderExtra:20,minSidePadding:42,cellTextInsetY:15,doUntilDoLabelTopInset:2,doUntilFooterTopInset:6,doUntilFooterBottomInset:8};function ds(i){return{...qn,fontSize:14,lineHeight:21,charWidth:5.5*(14/12),baseHeaderExtra:21,minSidePadding:40}}const je=i=>i===m.forSchleife||i===m.whileSchleife||i===m.doUntilSchleife||i===m.endlosschleife,Ee=i=>i===m.fallauswahl||i===m.verzweigung;function We(i,e,t,n=0){return{idPath:i,element:e,frame:t,headerBandHeight:n,topBandHeight:0,loopBodyLeadingInset:0,caseColumnFrames:[],children:[]}}function F(i){return{...i,frame:{...i.frame}}}class ei{constructor(e=qn,t=Jn){this.metrics=e,this.measure=t}layout(e,t={left:28,top:28}){const s=this.layoutList(e.elements,t.left,t.top,[]).map(o=>this.stretchLoopBodiesVertically(o));let r=0,a=0;const l=o=>{r=Math.max(r,o.frame.x+o.frame.width),a=Math.max(a,o.frame.y+o.frame.height),o.children.forEach(l)};return s.forEach(l),{canvasSize:{width:r+t.left,height:a+t.top},elements:s}}lineWidth(e){return Math.ceil(this.measure(e,this.metrics.fontSize,"medium"))}lineWidthBold(e){return Math.ceil(this.measure(e,this.metrics.fontSize,"bold"))}layoutList(e,t,n,s){let r=[],a=n;e.forEach((o,u)=>{const d=this.layoutElement(o,t,a,[...s,u]);r.push(d),a+=d.frame.height});const l=Math.max(0,...r.map(o=>o.frame.width));return l>0&&(r=r.map(o=>this.stretchNodeTreeToWidth(o,l))),r}stretchMultiwayNodeToWidth(e,t){const n=F(e),s=n.frame.width;if(!(s>0)||n.caseColumnFrames.length===0)return n;const r=t/s;n.frame.width=t;let a=n.frame.x;const l=n.caseColumnFrames.map(o=>{const u=o.width*r,d={x:a,y:o.y,width:u,height:o.height};return a+=u,d});return n.caseColumnFrames=l,n.dividerX=l.length>0?l[l.length-1].x:n.frame.x+t,n.columns&&n.columns.length===l.length&&(n.columns=n.columns.map((o,u)=>{const d=l[u];return o.map(h=>{const g=F(h);return g.frame.x=d.x,g.frame.width=d.width,this.stretchDescendantsWidths(g,d.width)})}),n.children=n.columns.flat()),n}stretchLoopChildren(e,t){const n=this.effectiveLoopBodyLeading(e),s=Math.max(0,t-n);e.children=e.children.map(r=>{const a=F(r);return a.frame.x=e.frame.x+n,a.frame.width=s,this.stretchDescendantsWidths(a,s)})}stretchNodeTreeToWidth(e,t){const n=F(e);return n.frame.width>0?Ee(n.element.type)&&n.caseColumnFrames.length>0?this.stretchMultiwayNodeToWidth(n,t):(n.frame.width=t,je(n.element.type)?this.stretchLoopChildren(n,t):n.children=n.children.map(r=>this.stretchDescendantsWidths(r,t)),n):n}stretchDescendantsWidths(e,t){let n=F(e);return Ee(n.element.type)?n=this.stretchNodeTreeToWidth(n,t):je(n.element.type)?(n.frame.width=t,this.stretchLoopChildren(n,t)):(n.frame.width=t,n.children=n.children.map(s=>this.stretchDescendantsWidths(s,t))),n}stretchLoopBodiesVertically(e){const t=F(e);if(t.columns&&t.columns.length>0)return t.columns=t.columns.map(r=>r.map(a=>this.stretchLoopBodiesVertically(a))),t.children=t.columns.flat(),t;t.children=t.children.map(r=>this.stretchLoopBodiesVertically(r));const n=r=>r===m.anweisung||r===m.leerElement||r===m.aufruf||r===m.aussprung||je(r);let s;switch(t.element.type){case m.forSchleife:case m.whileSchleife:case m.endlosschleife:{const r=t.element.type===m.endlosschleife?40:0;s=t.frame.y+t.frame.height-r;break}case m.doUntilSchleife:s=t.frame.y+t.frame.height-t.headerBandHeight;break}if(s!==void 0&&t.children.length>0){const r=t.children.length-1;let a=F(t.children[r]);const l=s-(a.frame.y+a.frame.height);l>.5&&n(a.element.type)&&(a.frame.height+=l,a=this.stretchLoopBodiesVertically(a),t.children=[...t.children.slice(0,r),a])}return t}headerHeight(e){const t=this.metrics,n=Math.max(1,e.textLines.length);if(e.type===m.doUntilSchleife)return t.doUntilFooterTopInset+n*t.lineHeight+t.doUntilFooterBottomInset+e.zoomY;let s;switch(e.type){case m.fallauswahl:s=40;break;case m.verzweigung:s=20;break;case m.forSchleife:case m.whileSchleife:case m.endlosschleife:s=t.baseHeaderExtra+4;break;default:s=14}return s+n*t.lineHeight+e.zoomY}doUntilBodyLeadingInset(){return Math.max(20,this.lineWidthBold("do")+12)}effectiveLoopBodyLeading(e){return e.element.type===m.doUntilSchleife?e.loopBodyLeadingInset>0?e.loopBodyLeadingInset:this.doUntilBodyLeadingInset():20}horizontalPaddingInsideCell(e){return Ee(e)?Math.max(100,this.metrics.minSidePadding*2.45):this.metrics.minSidePadding}minWidth(e){const t=e.textLines.length===0?0:Math.max(...e.textLines.map(r=>this.lineWidth(r)));let n=t+e.zoomX+this.horizontalPaddingInsideCell(e.type);if(e.type===m.aufruf){const r=Math.max(68,this.metrics.minSidePadding*1.7),a=Math.max(8,this.metrics.minSidePadding*.2);n=Math.max(n,t+e.zoomX+r+a)}const s=e.type===m.leerElement?76:e.type===m.aufruf?104:72;return Math.max(s,n)}layoutElement(e,t,n,s){if(Ee(e.type))return this.layoutMultiway(e,t,n,s);if(je(e.type))return this.layoutLoop(e,t,n,s);const r=this.headerHeight(e);return We(s,e,{x:t,y:n,width:this.minWidth(e),height:r},r)}layoutLoop(e,t,n,s){const r=z=>z.reduce((I,_)=>I+_.frame.height,0),a=z=>Math.max(0,...z.map(I=>I.frame.width)),l=e.loopBody??[];if(e.type===m.doUntilSchleife){const z=this.doUntilBodyLeadingInset(),I=e.zoomY,_=this.headerHeight(e),V=this.layoutList(l,t+z,n+I,[...s,0]),D=Math.max(this.minWidth(e),a(V)+z),k=r(V)+_+I,A=Math.max(0,D-z),Z=We(s,e,{x:t,y:n,width:D,height:k},_);return Z.topBandHeight=I,Z.loopBodyLeadingInset=z,Z.children=V.map(j=>{const C=F(j);return C.frame.x=t+z,C.frame.width=A,this.stretchDescendantsWidths(C,A)}),Z}const o=20,u=this.headerHeight(e),d=e.type===m.endlosschleife?40:0,h=this.layoutList(l,t+o,n+u,[...s,0]),g=Math.max(this.minWidth(e),a(h)+o),p=u+d+r(h),f=Math.max(0,g-o),y=We(s,e,{x:t,y:n,width:g,height:p},u);return y.children=h.map(z=>{const I=F(z);return I.frame.x=t+o,I.frame.width=f,this.stretchDescendantsWidths(I,f)}),y}layoutMultiway(e,t,n,s){const r=this.headerHeight(e),a=e.cases??[],l=Math.max(1,a.length),o=Math.max(this.minWidth(e)/l,132);let u=[],d=[],h=0,g=0;if(a.forEach((z,I)=>{const _=t+h,V=this.layoutList(z.elements,_,n+r,[...s,I]),D=Math.max(0,...V.map(Z=>Z.frame.width));let k;e.type===m.verzweigung&&l===2?k=Math.max(D,(I===0?"true":"false").length*this.metrics.charWidth+24):k=Math.max(o,D);const A=V.reduce((Z,j)=>Z+j.frame.height,0);g=Math.max(g,A),u.push({x:_,y:n+r,width:k,height:A}),d.push(V.map(Z=>{const j=F(Z);return j.frame.x=_,j.frame.width=k,this.stretchDescendantsWidths(j,k)})),h+=k}),e.type===m.verzweigung&&l===2&&u.length===2){const z=Math.max(u[0].width,u[1].width),I=t,_=t+z,V=_-u[1].x;u[0]={...u[0],x:I,width:z},u[1]={...u[1],x:_,width:z},h=z*2,d[0]=d[0].map(D=>{const k=F(D);return k.frame.x=I,k.frame.width=z,this.stretchDescendantsWidths(k,z)}),d[1]=d[1].map(D=>{const k=St(D,V);return k.frame.width=z,this.stretchDescendantsWidths(k,z)})}if(d.length>0){const z=hs(d,n+r);d=z.columns.map(I=>I.map(_=>this.stretchLoopBodiesVertically(_)));for(let I=0;I<Math.min(u.length,z.columnHeights.length);I++)u[I]={...u[I],height:z.columnHeights[I]};g=z.columnHeights.length>0?Math.max(...z.columnHeights):g}let p=Math.max(h,this.minWidth(e));if(h>.5&&p>h+.5){const z=p/h;let I=t;const _=[],V=[];u.forEach((D,k)=>{const A=D.width*z;V.push(d[k].map(Z=>{const j=F(Z);return j.frame.x=I,j.frame.width=A,this.stretchDescendantsWidths(j,A)})),_.push({x:I,y:D.y,width:A,height:D.height}),I+=A}),u=_,d=V,h=I-t,p=h}const f=u.length>0?u[u.length-1].width:h/l,y=We(s,e,{x:t,y:n,width:p,height:r+g},r);return y.caseColumnFrames=u,y.dividerX=u.length>0?u[u.length-1].x:t+h-f,y.dividerYInset=e.type===m.fallauswahl?-20:0,y.columns=d,y.children=d.flat(),y}}function ti(i,e){if(Math.abs(e)<=1e-4)return i;const t=F(i),n=s=>{const r=F(s);return r.frame.y+=e,ti(r,e)};return t.columns?(t.columns=t.columns.map(s=>s.map(n)),t.children=t.columns.flat()):t.children=t.children.map(n),t}function St(i,e){if(Math.abs(e)<=1e-4)return i;const t=F(i);return t.frame.x+=e,t.columns?(t.columns=t.columns.map(n=>n.map(s=>St(s,e))),t.children=t.columns.flat()):t.children=t.children.map(n=>St(n,e)),t}function hs(i,e){if(i.length<2)return{columns:i,columnHeights:i.map(u=>u.reduce((d,h)=>d+h.frame.height,0))};const t=.5,n=[e];for(const u of i)for(const d of u)n.push(d.frame.y+d.frame.height);const s=Math.max(...n);n.push(s),n.sort((u,d)=>u-d);let r=[];for(const u of n)r.length>0&&Math.abs(u-r[r.length-1])<=t||r.push(u);(r.length===0||Math.abs(r[0]-e)>t)&&r.unshift(e),r.length===0?r=[e,s]:r[r.length-1]<s-1e-6?r.push(s):r[r.length-1]=s;const a=(u,d)=>{let h=Math.max(0,d);for(;h<r.length&&r[h]<u-t;)h++;return Math.min(h,r.length-1)},l=[],o=[];for(const u of i){if(u.length===0){l.push([]),o.push(0);continue}const d=[];let h=0;u.forEach((g,p)=>{let f=F(g);const y=r[h],z=g.frame.y+g.frame.height,I=p===u.length-1?r.length-1:a(z,h+1),_=r[I],V=y-f.frame.y;f.frame.y=y,f.frame.height=Math.max(0,_-y),f=ti(f,V),d.push(f),h=I}),l.push(d),o.push(r[r.length-1]-e)}return{columns:l,columnHeights:o}}const nn=[{item:"anweisung",label:"Anweisung"},{item:"verzweigung",label:"Verzweigung"},{item:"fallauswahl",label:"Fallauswahl"},{item:"forZaehlSchleife",label:"For-Schleife"},{item:"whileSchleife",label:"While-Schleife"},{item:"doUntilSchleife",label:"Do-while-Schleife"},{item:"endlosschleife",label:"Endlosschleife"},{item:"aufruf",label:"Aufruf"},{item:"aussprung",label:"Aussprung"}];function Ce(i){const e=_e;switch(i){case"anweisung":return Y(m.anweisung);case"verzweigung":return Y(m.verzweigung,{cases:[{name:"true",elements:[e()]},{name:"false",elements:[e()]}]});case"fallauswahl":return Y(m.fallauswahl,{cases:[{name:"1",elements:[e()]},{name:"2",elements:[e()]},{name:"default",elements:[e()]}]});case"forZaehlSchleife":return Y(m.forSchleife,{textLines:["","",""],loopBody:[e()]});case"whileSchleife":return Y(m.whileSchleife,{loopBody:[e()]});case"doUntilSchleife":return Y(m.doUntilSchleife,{loopBody:[e()]});case"endlosschleife":return Y(m.endlosschleife,{loopBody:[e()]});case"aussprung":return Y(m.aussprung);case"aufruf":return Y(m.aufruf)}}function Oe(i){if(i==="")return"-1;";let e="";for(const t of i)e+=t.codePointAt(0)+";";return e}function kt(i){const e=i.split(";").filter(n=>n!=="");if(e.length===1&&e[0]==="-1")return"";let t="";for(const n of e){if(!/^[+-]?\d+$/.test(n))continue;const s=Number(n);s!==-1&&(s<0||s>1114111||s>=55296&&s<=57343||(t+=String.fromCodePoint(s)))}return t}class sn extends Error{}function Ht(i){const e=new DOMParser().parseFromString(i,"application/xml");if(e.getElementsByTagName("parsererror").length>0)throw new sn("Could not read XML.");const t=e.documentElement;if(!t||t.tagName!=="struktogramm")throw new sn("Invalid XML: root element is not <struktogramm>.");const n={caption:an(t,"caption")??"",elements:Dt(t)},s=an(t,"fontfamily");s!==void 0&&(n.fontFamily=s);const r=ve(t,"fontsize");r!==void 0&&(n.fontSize=r);const a=ve(t,"fontstyle");return a!==void 0&&(n.fontStyle=a),t.getAttribute("pseudocode")==="true"&&(n.pseudocode=!0),n}function ot(i){const e=(n,s)=>s===void 0?"":` ${n}="${ni(s)}"`;let t=`<?xml version="1.0" encoding="UTF-8"?>
`;t+="<struktogramm",t+=e("fontfamily",i.fontFamily===void 0?void 0:Oe(i.fontFamily)),t+=e("fontstyle",i.fontStyle===void 0?void 0:String(i.fontStyle)),t+=e("fontsize",i.fontSize===void 0?void 0:String(i.fontSize)),t+=e("caption",Oe(i.caption)),t+=e("pseudocode",i.pseudocode?"true":void 0),t+=`>
`;for(const n of i.elements)t+=_t(n,"  ");return t+=`</struktogramm>
`,t}function _t(i,e){let t=`${e}<strelem typ="${i.type}" zx="${i.zoomX}" zy="${i.zoomY}"`;i.textColor&&(t+=` textcolor="${rn(i.textColor)}"`),i.backgroundColor&&(t+=` bgcolor="${rn(i.backgroundColor)}"`),t+=`>
`;for(const n of i.textLines)t+=`${e}  <text>${ms(Oe(n))}</text>
`;if(i.loopBody){t+=`${e}  <schleifeninhalt>
`;for(const n of i.loopBody)t+=_t(n,e+"    ");t+=`${e}  </schleifeninhalt>
`}if(i.cases)for(const n of i.cases){t+=`${e}  <fall fallname="${ni(Oe(n.name))}">
`;for(const s of n.elements)t+=_t(s,e+"    ");t+=`${e}  </fall>
`}return t+=`${e}</strelem>
`,t}function ni(i){return i.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function ms(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function rn(i){return String(i.a<<24|i.r<<16|i.g<<8|i.b|0)}function Ve(i,e){return Array.from(i.children).filter(t=>t.tagName===e)}function Dt(i){const e=[];for(const t of Ve(i,"strelem")){const n=gs(t);n&&e.push(n)}return e}function gs(i){const e=ve(i,"typ");if(e===void 0||m[e]===void 0)return;const t={type:e,zoomX:ve(i,"zx")??0,zoomY:ve(i,"zy")??0,textLines:Ve(i,"text").map(l=>kt((l.textContent??"").trim()))},n=ln(i.getAttribute("textcolor"));n&&(t.textColor=n);const s=ln(i.getAttribute("bgcolor"));s&&(t.backgroundColor=s),t.textLines.length===0&&(t.textLines=[""]);const r=Ve(i,"schleifeninhalt")[0];if(r){const l=Dt(r);l.length>0&&(t.loopBody=l)}const a=Ve(i,"fall").map(l=>({name:kt(l.getAttribute("fallname")??""),elements:Dt(l)}));return a.length>0&&(t.cases=a),t}function an(i,e){const t=i.getAttribute(e);return t===null?void 0:kt(t)}function ve(i,e){const t=i.getAttribute(e);if(!(t===null||!/^[+-]?\d+$/.test(t)))return Number(t)}function ln(i){if(i===null||!/^[+-]?\d+$/.test(i))return;const e=Number(i);if(e<-2147483648||e>2147483647)return;const t=e>>>0;return{a:t>>>24&255,r:t>>>16&255,g:t>>>8&255,b:t&255}}const ps="http://www.w3.org/2000/svg",T={diagramLineWidth:2,outerFrameLineWidth:2,selectionLineWidth:3.5,canvasOuterMargin:16,cellTextInsetX:18,cellTextInsetY:15,multiHeaderFirstLineY:14,branchLabelInsetX:10,fallauswahlCaseLabelBand:26,callSideBarInset:14,callTextInsetFromSideBar:20,loopBodyLeadingInset:20};function B(i,e={}){const t=document.createElementNS(ps,i);for(const[n,s]of Object.entries(e))t.setAttribute(n,String(s));return t}class ii{constructor(e,t){b(this,"usesSimulationHighlight",!1);this.metrics=e,this.measure=t}get lineHeight(){return this.metrics.lineHeight}get fontSize(){return this.metrics.fontSize}render(e,t,n,s=T.canvasOuterMargin){const r=B("svg",{width:t.width,height:t.height,viewBox:`0 0 ${t.width} ${t.height}`,"font-family":qe,"font-size":this.fontSize,class:"diagram"});r.append(B("rect",{x:0,y:0,width:t.width,height:t.height,fill:"#fafafa"}));const a=s;r.append(B("rect",{x:a,y:a,width:e.canvasSize.width-2*a-1,height:e.canvasSize.height-2*a-1,fill:"none",stroke:"black","stroke-width":T.outerFrameLineWidth}));const l=B("g");for(const o of e.elements)this.drawNode(o,l,n,{},void 0);return r.append(l),r}line(e,t){e.append(B("polyline",{points:t.map(n=>n.join(",")).join(" "),fill:"none",stroke:"black","stroke-width":T.diagramLineWidth,"stroke-linejoin":"miter"}))}strokeCellBorder(e,t,n){const s=t.x,r=t.y,a=t.x+t.width,l=t.y+t.height;if(!n.top&&!n.left&&!n.bottom&&!n.right){e.append(B("rect",{x:s,y:r,width:t.width,height:t.height,fill:"none",stroke:"black","stroke-width":T.diagramLineWidth}));return}n.top||this.line(e,[[s,r],[a,r]]),n.right||this.line(e,[[a,r],[a,l]]),n.bottom||this.line(e,[[a,l],[s,l]]),n.left||this.line(e,[[s,l],[s,r]])}textWidth(e){const t=Xt(e);return t?this.measure(t.keyword,this.fontSize,"bold")+(t.rest===""?0:this.measure(" "+t.rest,this.fontSize,"medium")):this.measure(e,this.fontSize,"medium")}drawKeywordLine(e,t,n,s){const r=B("text",{x:n,y:s+en(this.fontSize,"medium").ascent,"font-weight":500});r.style.whiteSpace="pre";const a=Xt(t);if(a){const l=B("tspan",{"font-weight":700});if(l.textContent=a.keyword,r.append(l),a.rest!==""){const o=B("tspan",{});o.textContent=" "+a.rest,r.append(o)}}else r.textContent=t;e.append(r)}drawLabel(e,t,n,s,r,a){const l=en(this.fontSize,r?"bold":"medium"),o=B("text",{x:n,y:a==="top"?s+l.ascent:s-l.descent,"font-weight":r?700:500});o.style.whiteSpace="pre",o.textContent=t,e.append(o)}roofMetrics(e,t,n,s){const r=t.y+n,a=e.dividerYInset??0,l=12,o=Math.max(e.element.textLines.length,1)*this.lineHeight,u=t.y+T.multiHeaderFirstLineY;if(e.element.type===m.fallauswahl){const h=Math.max(T.fallauswahlCaseLabelBand,this.lineHeight+10),g=r-h,p=Math.min(r+a,g-8),f=Math.max(p,u+o+6);return{apex:{x:s,y:f},maxTextBottom:g-l,roofBottom:r}}const d={x:s,y:r+a};return{apex:d,maxTextBottom:d.y-l,roofBottom:r}}drawNode(e,t,n,s,r){var V;const a=e.frame,l=e.element,o=a.x+a.width,u=a.y+a.height,d=l.type===m.verzweigung||l.type===m.fallauswahl,h=d?e.headerBandHeight:0,g=n!==void 0&&Mt(e.idPath,n),p=Ct(l),f=B("g",{"data-path":e.idPath.join(",")});t.append(f);const y=this.usesSimulationHighlight,z=g&&y?"rgba(199, 230, 255, 0.55)":"white";f.append(B("rect",{x:a.x,y:a.y,width:a.width,height:a.height,fill:z})),this.strokeCellBorder(f,a,s);const I=T.callSideBarInset;if(l.type===m.aufruf?(this.line(f,[[a.x+I,a.y],[a.x+I,u]]),this.line(f,[[o-I,a.y],[o-I,u]])):l.type===m.aussprung&&this.line(f,[[a.x+I,a.y],[a.x,a.y+a.height/2],[a.x+I,u]]),d&&e.dividerX!==void 0){const D=e.dividerX,k=this.roofMetrics(e,a,h,D),A=Math.max(p.length,1)*this.lineHeight,Z=a.y+T.multiHeaderFirstLineY;this.line(f,[[a.x,a.y],[k.apex.x,k.apex.y],[o,a.y]]),l.type===m.fallauswahl&&this.line(f,[[a.x,k.roofBottom],[o,k.roofBottom]]);let j;Z+A<=k.maxTextBottom?j=Z:j=Math.max(a.y+2,k.maxTextBottom-(Math.max(p.length,1)-1)*this.lineHeight-this.lineHeight),p.forEach((C,se)=>{const re=this.textWidth(C);let de;if(l.type===m.verzweigung){const st=a.x+T.cellTextInsetX,Ni=o-re-T.cellTextInsetX;de=Math.min(Math.max(D-re/2,st),Ni)}else de=a.x+a.width/2-re/2;this.drawKeywordLine(f,C,de,j+se*this.lineHeight)})}else if(l.type!==m.doUntilSchleife)if(l.type===m.anweisung||l.type===m.aufruf||l.type===m.aussprung){const D=T.cellTextInsetX;let k=a.x+D,A=o-D;l.type===m.aufruf?(k=a.x+I+T.callTextInsetFromSideBar,A=o-I-T.callTextInsetFromSideBar):l.type===m.aussprung&&(k=a.x+I+D);const Z=Math.max(0,A-k);let j=a.y+a.height/2-Math.max(1,p.length)*this.lineHeight/2;for(const C of p)this.drawKeywordLine(f,C,k+(Z-this.textWidth(C))/2,j),j+=this.lineHeight}else{const D=Math.max(1,p.length)*this.lineHeight;let k=r===m.doUntilSchleife?a.y+a.height/2-D/2:a.y+T.cellTextInsetY;for(const A of p)this.drawKeywordLine(f,A,a.x+T.cellTextInsetX,k),k+=this.lineHeight}e.children.forEach((D,k)=>{const A=l.type===m.doUntilSchleife&&k===0?{top:!0,left:!0}:{};this.drawNode(D,t,n,A,l.type)});const _=B("g");if(t.append(_),l.type===m.doUntilSchleife){const D=((V=e.children[0])==null?void 0:V.frame.x)??a.x+(e.loopBodyLeadingInset>0?e.loopBodyLeadingInset:T.loopBodyLeadingInset);this.drawLabel(_,"do",a.x+4,a.y+this.metrics.doUntilDoLabelTopInset,!0,"top");const k=u-e.headerBandHeight;this.line(_,[[D,k],[o,k]]),this.line(_,[[D,a.y],[D,k]]);let A=k+this.metrics.doUntilFooterTopInset;for(const Z of p)this.drawKeywordLine(_,Z,a.x+T.cellTextInsetX,A),A+=this.lineHeight}if(d&&e.dividerX!==void 0&&e.caseColumnFrames.length>1){const D=this.roofMetrics(e,a,h,e.dividerX),k=D.apex;e.caseColumnFrames.forEach((Z,j)=>{if(j>=e.caseColumnFrames.length-1)return;const C=Z.x+Z.width,se=fs(C,a,k),re=Number.isFinite(se)?Math.min(Math.max(se,a.y),u):a.y;this.line(_,[[C,u],[C,re]])});const A=l.cases;if(A&&A.length===e.caseColumnFrames.length){const Z=l.type===m.fallauswahl?D.roofBottom-6:a.y+h-8,j=T.branchLabelInsetX;if(l.type===m.verzweigung&&A.length===2){this.drawLabel(_,"true",a.x+j,Z,!0,"bottom");const C=e.caseColumnFrames[1],se=this.measure("false",this.fontSize,"bold");this.drawLabel(_,"false",C.x+C.width-j-se,Z,!0,"bottom")}else A.forEach((C,se)=>{const re=e.caseColumnFrames[se],de=["default","true","false"].includes(C.name.toLowerCase()),st=this.measure(C.name,this.fontSize,de?"bold":"medium");this.drawLabel(_,C.name,re.x+re.width/2-st/2,Z,de,"bottom")})}}g&&_.append(B("rect",{x:a.x,y:a.y,width:a.width,height:a.height,fill:"none",stroke:y?"rgba(66, 140, 242, 0.78)":"rgba(0, 122, 255, 0.9)","stroke-width":T.selectionLineWidth}))}}function fs(i,e,t){const n=e.y;if(i<=t.x){const r=t.x-e.x;return Math.abs(r)<.5?t.y:n+(t.y-n)/r*(i-e.x)}const s=e.x+e.width-t.x;return Math.abs(s)<.5?t.y:t.y+(n-t.y)/s*(i-t.x)}function Mt(i,e){return i.length===e.length&&i.every((t,n)=>t===e[n])}function bs(i){const e=[],t=n=>{e.push(n),n.children.forEach(t)};return i.forEach(t),e}function Xe(i){var e,t;return{...i,textLines:Ct(i),loopBody:(e=i.loopBody)==null?void 0:e.map(Xe),cases:(t=i.cases)==null?void 0:t.map(n=>({name:n.name,elements:n.elements.map(Xe)}))}}const xs="modulepreload",Is=function(i,e){return new URL(i,e).href},on={},S=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let a=function(d){return Promise.all(d.map(h=>Promise.resolve(h).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};const l=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),u=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=a(t.map(d=>{if(d=Is(d,n),d in on)return;on[d]=!0;const h=d.endsWith(".css"),g=h?'[rel="stylesheet"]':"";if(!!n)for(let y=l.length-1;y>=0;y--){const z=l[y];if(z.href===d&&(!h||z.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${g}`))return;const f=document.createElement("link");if(f.rel=h?"stylesheet":xs,h||(f.as="script"),f.crossOrigin="",f.href=d,u&&f.setAttribute("nonce",u),document.head.appendChild(f),h)return new Promise((y,z)=>{f.addEventListener("load",y),f.addEventListener("error",()=>z(new Error(`Unable to preload CSS for ${d}`)))})}))}function r(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return s.then(a=>{for(const l of a||[])l.status==="rejected"&&r(l.reason);return e().catch(r)})},Ge=[{code:"de",name:"Deutsch"},{code:"en",name:"English"},{code:"es",name:"Español"},{code:"fr",name:"Français"},{code:"it",name:"Italiano"},{code:"pl",name:"Polski"},{code:"tr",name:"Türkçe"},{code:"ko",name:"한국어"},{code:"ja",name:"日本語"},{code:"el",name:"Ελληνικά"},{code:"uk",name:"Українська"},{code:"ar",name:"العربية"},{code:"ru",name:"Русский"},{code:"he",name:"עברית"},{code:"nl",name:"Nederlands"},{code:"sv",name:"Svenska"},{code:"da",name:"Dansk"},{code:"nb",name:"Norsk bokmål"},{code:"zh-Hans",name:"中文（简体）"},{code:"zh-Hant",name:"中文（繁體）"},{code:"pt-PT",name:"Português"},{code:"java",name:"Java (Keywords)"}],ws=Object.assign({"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ar.lproj/Localizable.strings":()=>S(()=>import("./Localizable-CxCno28C.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/da.lproj/Localizable.strings":()=>S(()=>import("./Localizable-BAutdlBb.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/de.lproj/Localizable.strings":()=>S(()=>import("./Localizable-DZlyYK1P.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/el.lproj/Localizable.strings":()=>S(()=>import("./Localizable-rqA-20hM.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/en.lproj/Localizable.strings":()=>S(()=>import("./Localizable-Dj42XC1o.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/es.lproj/Localizable.strings":()=>S(()=>import("./Localizable-LSTVB2Q5.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/fr.lproj/Localizable.strings":()=>S(()=>import("./Localizable-ByPZS4RL.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/he.lproj/Localizable.strings":()=>S(()=>import("./Localizable-R-16GCrk.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/it.lproj/Localizable.strings":()=>S(()=>import("./Localizable-DXAPah1g.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ja.lproj/Localizable.strings":()=>S(()=>import("./Localizable-CkJEmEEP.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/java.lproj/Localizable.strings":()=>S(()=>import("./Localizable-a8HTzUdm.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ko.lproj/Localizable.strings":()=>S(()=>import("./Localizable-BudCXCER.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/nb.lproj/Localizable.strings":()=>S(()=>import("./Localizable-DSvkBkp-.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/nl.lproj/Localizable.strings":()=>S(()=>import("./Localizable-BJ55WGVD.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/pl.lproj/Localizable.strings":()=>S(()=>import("./Localizable-BYJK0mdR.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/pt-PT.lproj/Localizable.strings":()=>S(()=>import("./Localizable-D1vfmhD5.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ru.lproj/Localizable.strings":()=>S(()=>import("./Localizable-1QZ0wfvJ.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/sv.lproj/Localizable.strings":()=>S(()=>import("./Localizable-M33nNbEe.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/tr.lproj/Localizable.strings":()=>S(()=>import("./Localizable-BM86Igqt.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/uk.lproj/Localizable.strings":()=>S(()=>import("./Localizable-UGog_aku.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/zh-Hans.lproj/Localizable.strings":()=>S(()=>import("./Localizable-CaVEL1es.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/zh-Hant.lproj/Localizable.strings":()=>S(()=>import("./Localizable-DqIDp_hh.js"),[],import.meta.url).then(i=>i.default)}),zs=Object.assign({"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/Java.strings":()=>S(()=>import("./Java-C92fuLac.js"),[],import.meta.url).then(i=>i.default)}),ys=Object.assign({"../i18n/ar.strings":()=>S(()=>import("./ar-CgE2oaEN.js"),[],import.meta.url).then(i=>i.default),"../i18n/da.strings":()=>S(()=>import("./da-5XpWLwvw.js"),[],import.meta.url).then(i=>i.default),"../i18n/de.strings":()=>S(()=>import("./de-DB5D74e3.js"),[],import.meta.url).then(i=>i.default),"../i18n/el.strings":()=>S(()=>import("./el-BjteDhyy.js"),[],import.meta.url).then(i=>i.default),"../i18n/en.strings":()=>S(()=>import("./en-BIZrubj6.js"),[],import.meta.url).then(i=>i.default),"../i18n/es.strings":()=>S(()=>import("./es-xVz9Iu0K.js"),[],import.meta.url).then(i=>i.default),"../i18n/fr.strings":()=>S(()=>import("./fr-BN7lyk0a.js"),[],import.meta.url).then(i=>i.default),"../i18n/he.strings":()=>S(()=>import("./he-CBebaD44.js"),[],import.meta.url).then(i=>i.default),"../i18n/it.strings":()=>S(()=>import("./it-CCjqg2kX.js"),[],import.meta.url).then(i=>i.default),"../i18n/ja.strings":()=>S(()=>import("./ja-M4g49Haw.js"),[],import.meta.url).then(i=>i.default),"../i18n/ko.strings":()=>S(()=>import("./ko-CSEJ-ali.js"),[],import.meta.url).then(i=>i.default),"../i18n/nb.strings":()=>S(()=>import("./nb-otpbEZJ4.js"),[],import.meta.url).then(i=>i.default),"../i18n/nl.strings":()=>S(()=>import("./nl-CN2ZPH_z.js"),[],import.meta.url).then(i=>i.default),"../i18n/pl.strings":()=>S(()=>import("./pl-Cz72B5Ji.js"),[],import.meta.url).then(i=>i.default),"../i18n/pt-PT.strings":()=>S(()=>import("./pt-PT-BxGkxvyI.js"),[],import.meta.url).then(i=>i.default),"../i18n/ru.strings":()=>S(()=>import("./ru-NBrK4n_9.js"),[],import.meta.url).then(i=>i.default),"../i18n/sv.strings":()=>S(()=>import("./sv-nm0fda_v.js"),[],import.meta.url).then(i=>i.default),"../i18n/tr.strings":()=>S(()=>import("./tr-DjfQdU1I.js"),[],import.meta.url).then(i=>i.default),"../i18n/uk.strings":()=>S(()=>import("./uk-DQjeHCaU.js"),[],import.meta.url).then(i=>i.default),"../i18n/zh-Hans.strings":()=>S(()=>import("./zh-Hans-iuotT0AU.js"),[],import.meta.url).then(i=>i.default),"../i18n/zh-Hant.strings":()=>S(()=>import("./zh-Hant-BDp8zS8f.js"),[],import.meta.url).then(i=>i.default)});function ut(i,e){var t;return(t=Object.entries(i).find(([n])=>n.endsWith(e)))==null?void 0:t[1]}function vs(i){const e=new Map,t=i.replace(/\/\*[\s\S]*?\*\//g,"").replace(/^\s*\/\/.*$/gm,""),n=/"((?:[^"\\]|\\.)*)"\s*=\s*"((?:[^"\\]|\\.)*)"\s*;/g,s=r=>r.replace(/\\(u[0-9a-fA-F]{4}|.)/g,(a,l)=>l==="n"?`
`:l==="t"?"	":l.startsWith("u")&&l.length===5?String.fromCharCode(parseInt(l.slice(1),16)):l);for(const r of t.matchAll(n))e.set(s(r[1]),s(r[2]));return e}async function un(i){const e=i==="java"?ut(zs,"/Java.strings"):ut(ws,`/${i}.lproj/Localizable.strings`),t=ut(ys,`/${i}.strings`),n=new Map;for(const s of[e,t])if(s)for(const[r,a]of vs(await s()))n.set(r,a);return n}let si="en",ri=new Map,Fe=new Map;const ai="appLanguageCode";function Ss(){const i=new URLSearchParams(location.search).get("lang");if(i&&Ge.some(e=>e.code===i))return i;try{const e=localStorage.getItem(ai);if(e&&Ge.some(t=>t.code===e))return e}catch{}for(const e of navigator.languages??[navigator.language]){const t=e.toLowerCase();if(t.startsWith("zh"))return/hant|tw|hk|mo/.test(t)?"zh-Hant":"zh-Hans";if(t.startsWith("pt"))return"pt-PT";if(t.startsWith("no")||t.startsWith("nn"))return"nb";if(t.startsWith("iw"))return"he";const n=Ge.find(s=>s.code!=="java"&&s.code===t.split("-")[0]);if(n)return n.code}return"en"}async function li(i,e=!0){if(Fe.size===0&&(Fe=await un("en")),ri=i==="en"?Fe:await un(i),si=i,e)try{localStorage.setItem(ai,i)}catch{}const t=document.documentElement;t.lang=i==="java"?"en":i,t.dir=i==="ar"||i==="he"?"rtl":"ltr"}function At(){return si}function c(i,...e){const t=ri.get(i)??Fe.get(i)??i;if(e.length===0)return t;let n=0;return t.replace(/%(?:(\d+)\$)?[@d]/g,(s,r)=>String(e[r?Number(r)-1:n++]??""))}const oi={baseIndent:0,indentPerLevel:4,includeDiagramTextAsComments:!1,includeEmptyElseBranch:!0,pseudocodeNote:"Pseudocode – not a runnable program"};function ui(i,e,t={}){const n={...oi,...t,jsIntVariables:new Set,arrayElementTypes:Ws(i),stringVariables:Es(i)};let s="";e==="javascript"&&(s+=`"use strict";

`,n.jsIntVariables=dn(i)),e==="python"&&(n.jsIntVariables=dn(i)),e==="python"&&Ys(i)&&(s+=`import random

`),e==="java"&&wi(i)&&(s+=`// import java.util.Scanner;
`,s+=`Scanner scanner = new Scanner(System.in);

`),i.pseudocode&&(s+=(e==="python"?"# ":"// ")+n.pseudocodeNote+`

`);const r={out:s};for(const a of i.elements)$t(a,e,n,n.baseIndent,r);if(s=r.out,s.trim()===""){const a=ks(e);return e==="javascript"?`"use strict";

`+a:a}return qs(s.replace(/^[\n\r]+|[\n\r]+$/g,""),e)}const w=i=>i>0?" ".repeat(i):"";function W(i,e){const t=i.exec(e);return t?Array.from(t,n=>n??""):void 0}function ks(i,e){return i==="python"?"# empty element":"// empty element"}const Zt=i=>i.trim()==="ø";function ci(i,e){return w(i)+(e==="python"?`# empty element
`:`// empty element
`)}function _s(i){switch(i.type){case m.leerElement:return!0;case m.anweisung:case m.aufruf:return i.textLines.map(e=>e.trim()).every(e=>e===""||Zt(e));default:return!1}}function Ds(i){return i.every(_s)}function Vt(i,e,t){const n=i.map(s=>s.replace(/^[ \t]+|[ \t]+$/g,"")).filter(s=>s!=="");return n.length===0?"":e==="python"?w(t)+`"""
`+n.map(s=>w(t)+s+`
`).join("")+w(t)+`"""
`:n.length===1?w(t)+"/* "+n[0]+` */
`:w(t)+`/*
`+n.map(s=>w(t)+" * "+s+`
`).join("")+w(t)+` */
`}const Ms=i=>i==="java"||i==="javascript";function Ye(i){const e=i.trim();if(e==="")return"";if(e.startsWith("//")||e.startsWith("/*")||e.startsWith("*")||e.startsWith("#")||e.startsWith("{")||e.startsWith("}")||e.endsWith("{")||e.endsWith(";"))return e;const t=e.toLowerCase();for(const n of["if ","else","for ","while ","do ","switch ","case ","default"])if(t.startsWith(n))return e;return e+";"}function Re(i){const e=i.map(t=>t.trim()).filter(t=>t!=="");return As(e.length===0?"true":e.join(" "))}function As(i){const e=i.trim();for(const t of["if","while","until","switch"]){const n=di(t,e);if(n!==void 0)return n===""?"true":n}return e}function di(i,e){if(!e.toLowerCase().startsWith(i))return;const t=e.slice(i.length);if(!(t===""||/^\s/.test(t)||t[0]==="("))return;let n=t.trim();return n.startsWith("(")&&n.endsWith(")")&&n.length>=2&&(n=n.slice(1,-1).trim()),n}function xe(i){let e=i.trim();for(;e.endsWith(";");)e=e.slice(0,-1).trim();return e}function Zs(i){const e=i.trim(),t=e.toLowerCase();let n;if(t.startsWith("output:"))n=e.slice(7).trim();else if(t.startsWith("print:"))n=e.slice(6).trim();else return;return n===""?void 0:n}const et=i=>i.name.includes("[")&&i.name.includes("]");function Gt(i){const e=i.trim();if(e==="")return;const t=W(/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s+([a-zA-Z_]\w*(?:\s*\[[^\]]+\])?)(?:\s+"([^"]*)")?\s*$/i,e);if(t){const r=t[2].replaceAll(" ","");if(r==="")return;const a=(t[3]??"").trim();return{type:Je(t[1]),name:r,customPrompt:a===""?void 0:a}}const n=W(/^\s*([a-zA-Z_]\w*(?:\s*\[[^\]]+\])?)\s+"([^"]*)"\s*$/i,e);if(n){const r=n[1].replaceAll(" ","");return["int","integer","long","float","double","string","boolean","char","bool","void"].includes(r.toLowerCase())?void 0:{type:r.includes("[")?"String":"int",name:r,customPrompt:n[2].trim()}}const s=Bs(e);if(s)return{type:Je(s[0]),name:s[1]}}function Je(i){switch(i.trim().toLowerCase()){case"integer":case"int":return"int";case"long":return"long";case"float":return"float";case"double":return"double";case"string":return"String";case"boolean":case"bool":return"boolean";case"char":return"char";default:return i}}function Bs(i){const e=i.split(/[ \t]+/).filter(Boolean);if(e.length===0)return;if(e.length>=2)return[e[0],e[1]];if(!["int","double","string","boolean","char","long","float","short","byte","void","bool","integer"].includes(e[0].toLowerCase()))return["int",e[0]]}function js(i,e,t,n,s){const r=xe(i).trim();if(r.startsWith('"'))switch(e){case"java":return w(t)+"System.out.println("+r+`);
`;case"javascript":return w(t)+"console.log("+r+`);
`;case"python":return w(t)+"print("+Ae(r,n,s)+`)
`}}function Me(i){return i.replaceAll("\\","\\\\").replaceAll('"','\\"').replaceAll(`
`,"\\n").replaceAll("\r","\\r")}function Ft(i,e){const t=i.trim();if(!t.toLowerCase().startsWith("input:"))return;const n=t.slice(6).trim();if(n==="")return;const s=Gt(n);if(s&&et(s)&&!/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s/i.test(n)){const r=e.get(s.name.slice(0,s.name.indexOf("[")).trim());if(r)return{...s,type:r}}return s}function Es(i){const e=new Set;return ce(i.elements,t=>{for(const n of t.textLines){const s=n.trim();if(s.toLowerCase().startsWith("input:")){const a=Gt(s.slice(6).trim());(a==null?void 0:a.type)==="String"&&!et(a)&&e.add(a.name);continue}const r=W(/^\s*(?:const\s+)?string\s+([a-zA-Z_]\w*)\s*=/i,s);r&&e.add(r[1])}}),e}function Ws(i){const e=new Map;return ce(i.elements,t=>{for(const n of t.textLines){const s=W(/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s*\[\s*\]\s*([a-zA-Z_]\w*)/i,n)??W(/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s+([a-zA-Z_]\w*)\s*\[\s*\]/i,n);s&&e.set(s[2],Je(s[1]))}}),e}function Cs(i,e,t){const n=Ft(i,t);if(!n)return;const s=n.customPrompt?n.customPrompt:n.name+": ",r=w(e)+'System.out.println("'+Me(s)+`");
`,a=l=>et(n)?n.name:`${l} ${n.name}`;switch(n.type){case"int":return r+w(e)+`${a("int")} = scanner.nextInt();
`;case"double":return r+w(e)+`${a("double")} = scanner.nextDouble();
`;case"String":return r+w(e)+`${a("String")} = scanner.next();
`;case"boolean":return r+w(e)+`${a("boolean")} = scanner.nextBoolean();
`;default:return}}function Ps(i,e,t){const n=Ft(i,t);if(!n)return;const s=!!n.customPrompt,r=s?"":w(e)+'console.log("'+Me(n.name+": ")+`");
`,a=o=>{const u=s?n.customPrompt:n.name+": ";return`(prompt("${Me(u)}") ?? "${o}")`},l=et(n)?n.name:`let ${n.name}`;switch(n.type){case"int":return r+w(e)+`${l} = parseInt(${a("0")}, 10);
`;case"double":return r+w(e)+`${l} = Number(${a("0")});
`;case"String":return r+w(e)+`${l} = ${a("")};
`;case"boolean":return r+w(e)+`${l} = ${a("")}.trim().toLowerCase() === "true";
`;default:return}}function Ls(i,e,t){const n=Ft(i,t);if(!n)return;const s=!!n.customPrompt,r=s?"":w(e)+'print("'+Me(n.name+": ")+`")
`,a=`input("${Me(s?n.customPrompt:n.name+": ")}")`;switch(n.type){case"int":return r+w(e)+`${n.name} = int(${a})
`;case"double":return r+w(e)+`${n.name} = float(${a})
`;case"String":return r+w(e)+`${n.name} = ${a}
`;case"boolean":return r+w(e)+`${n.name} = ${a}.strip().lower() in ("true", "wahr")
`;default:return}}function Ts(i,e,t,n,s){const r=Zs(i);if(r!==void 0)switch(e){case"java":return w(t)+"System.out.println("+r+`);
`;case"javascript":return w(t)+"console.log("+r+`);
`;case"python":return w(t)+"print("+Ae(r,n,s)+`)
`}}function hi(i){const e=i.map(xe).filter(t=>t!=="");return e.length===0?";;":e.join("; ")}function Ns(i){const t=hi(i).split(";"),n=Hs(t[0]);return n!==void 0&&(t[0]=n),t.join(";")}function Hs(i){const e=W(/^(\s*)(?:integer|int|long|float|double|string|boolean|char|bool)\s+(\w+)(?:\s*=\s*(.*))?\s*$/i,i);if(!e)return;const t=e[2].trim();if(t==="")return;const n=(e[3]??"").trim();return i.includes("=")&&n!==""?e[1]+`let ${t} = ${n}`:e[1]+`let ${t}`}function Vs(i){const e=i.map(n=>xe(n).trim()).filter(n=>n!=="");let t=e;if(e.length===1){let n=e[0];const s=di("for",n);s!==void 0&&(n=s),t=n.split(";").map(r=>r.trim())}if(!(t.length!==3||t.some(n=>n==="")))return[t[0],t[1],t[2]]}function Gs(i,e){let t=W(/^\s*(\w+)\s*(\+\+|--)\s*$/,i)??W(/^\s*(\+\+|--)\s*(\w+)\s*$/,i);if(t){const[n,s]=t[1]==="++"||t[1]==="--"?[t[2],t[1]]:[t[1],t[2]];return n===e?s==="++"?1:-1:void 0}if(t=W(/^\s*(\w+)\s*(\+|-)=\s*(\d+)\s*$/,i),t)return t[1]===e?(t[2]==="+"?1:-1)*Number(t[3]):void 0;if(t=W(/^\s*(\w+)\s*=\s*(\w+)\s*(\+|-)\s*(\d+)\s*$/,i),t)return t[1]===e&&t[2]===e?(t[3]==="+"?1:-1)*Number(t[4]):void 0}function cn(i,e){if(/^-?\d+$/.test(i))return String(Number(i)+e);const t=/^[\w.()[\]]+$/.test(i)?i:`(${i})`;return e>0?`${t} + ${e}`:`${t} - ${-e}`}function Fs(i,e){const t=Vs(i);if(!t)return;const[n,s,r]=t,a=W(/^\s*(?:integer|int|long|short|byte|double|float)?\s*([a-zA-Z_]\w*)\s*=\s*(.+)$/i,n);if(!a)return;const l=a[1],o={variable:l,init:`${l} = ${R(a[2],e)}`,condition:s,increment:r},u=W(/^\s*(\w+)\s*(<=|<|>=|>)\s*(.+)$/,s),d=Gs(r,l);if(!u||u[1]!==l||d===void 0||d===0)return o;const h=R(a[2],e);let g=R(u[3],e);const p=u[2];if(d>0&&p==="<=")g=cn(g,1);else if(d<0&&p===">=")g=cn(g,-1);else if(!(d>0&&p==="<")&&!(d<0&&p===">"))return o;const f=d===1?h==="0"?[g]:[h,g]:[h,g,String(d)];return o.rangeLine=`for ${l} in range(${f.join(", ")}):`,o}function mi(i){const e=xe(i).trim();if(e==="")return;const t=W(/^\s*const\s+(integer|int|long|float|double|string|boolean|char|bool)\s+(\w+)(?:\s*=\s*(.*))?$/i,e);if(!t)return;const n=t[2].trim();if(n==="")return;if(!e.includes("="))return{rawType:t[1].trim(),name:n};const s=(t[3]??"").trim();if(s!=="")return{rawType:t[1].trim(),name:n,rhs:s}}function Rs(i,e,t,n){var l;const s=mi(i);if(!s)return;const r=Je(s.rawType),a=(l=s.rhs)==null?void 0:l.trim();switch(e){case"java":return w(t)+Ye(a?`final ${r} ${s.name} = ${a}`:`final ${r} ${s.name}`)+`
`;case"javascript":return a?w(t)+Ye(`const ${s.name} = ${a}`)+`
`:w(t)+`let ${s.name};  // from diagram: const ${r} ${s.name}
`;case"python":return a?w(t)+`${s.name} = ${nt(a,n)}  # const ${r}
`:w(t)+`${s.name} = None  # const ${r}, uninitialized
`}}function $s(i){const e=xe(i).trim();if(e==="")return;const t=W(/^\s*(?:integer|int|long|float|double|string|boolean|char|bool)(?:\s*\[\s*\]\s+(\w+)|\s+(\w+)(\s*\[\s*\])?)\s*=\s*(.*)$/i,e);if(!t)return;const n=t[1]===""?t[2]:t[1],s=t[4].trim();if(s!=="")return{name:n,rhs:s,isArray:t[1]!==""||t[3]!==""}}function tt(i){const e=W(/^\s*\(\s*int(?:eger)?\s*\)\s*\(?\s*(.+?)\s*\)?\s*$/i,i),t=e==null?void 0:e[1].trim();return t||void 0}function nt(i,e=new Set){const t=i.trim();if(t==="null")return"None";const n=tt(t);return n!==void 0?`int(${nt(n,e)})`:R(t,e)}function gi(i,e){let t="",n="",s=0;for(;s<i.length;){if(i[s]!=='"'){n+=i[s++];continue}t+=e(n),n="";let r=s+1;for(;r<i.length&&i[r]!=='"';)r+=i[r]==="\\"?2:1;t+=i.slice(s,r+1),s=r+1}return t+e(n)}function R(i,e){const t=i.replace(/\.equals\(\s*("(?:[^"\\]|\\.)*"|[^()"]*?)\s*\)/g," == $1"),n=s=>/^\d+$/.test(s)||e.has(s);return gi(t,s=>s.replace(/\bMath\.random\s*\(\s*\)/gi,"random.random()").replace(/===/g,"==").replace(/!==/g,"!=").replace(/\s*&&\s*/g," and ").replace(/\s*\|\|\s*/g," or ").replace(/!(?!=)\s*/g,"not ").replace(/\btrue\b/g,"True").replace(/\bfalse\b/g,"False").replace(/\bnull\b/g,"None").replace(new RegExp("(?<![\\w.])([a-zA-Z_]\\w*|\\d+)\\s*\\/\\s*([a-zA-Z_]\\w*|\\d+)(?![\\w.(\\[])","g"),(r,a,l)=>n(a)&&n(l)?`${a} // ${l}`:r))}function pi(i){const e=[];let t=0,n="",s=!1;for(let r=0;r<i.length;r++){const a=i[r];if(s){n+=a,a==="\\"&&r+1<i.length?n+=i[++r]:a==='"'&&(s=!1);continue}if(a==='"')s=!0;else if(a==="("||a==="[")t++;else if(a===")"||a==="]")t--;else if(a==="+"&&t===0){e.push(n.trim()),n="";continue}n+=a}return e.push(n.trim()),e}const Rt=i=>/^"(?:[^"\\]|\\.)*"$/.test(i);function Ae(i,e,t){const n=pi(i),s=r=>Rt(r)||t.has(r);return n.length<2||!n.some(s)||n.some(r=>r==="")?R(i,e):n.map(r=>s(r)?r:`str(${R(r,e)})`).join(" + ")}function fi(i,e,t=new Set){const n=xe(i).trim(),s=W(/^(\w+(?:\[[^\]]*\])?)\s*(\+\+|--)$/,n)??W(/^(\+\+|--)\s*(\w+(?:\[[^\]]*\])?)$/,n);if(s){const[l,o]=s[1]==="++"||s[1]==="--"?[s[2],s[1]]:[s[1],s[2]];return`${R(l,e)} ${o==="++"?"+=":"-="} 1`}const r=W(/^(\w+)\s*\/=\s*(.+)$/,n);if(r&&e.has(r[1]))return`${r[1]} //= ${R(r[2],e)}`;const a=W(/^([\w[\]. ]+?)\s*(=|\+=|-=|\*=|\/=|%=)\s*(.+)$/,n);if(a&&!a[3].startsWith("=")){const[,l,o,u]=a;let d;if(o==="+="&&t.has(l.trim())){const h=pi(u);d=Ae(`"" + ${u}`,e,t).replace(/^"" \+ /,""),h.length===1&&!Rt(u.trim())&&!t.has(u.trim())&&(d=`str(${R(u,e)})`)}else o==="="&&tt(u)===void 0&&u.trim()!=="null"?d=Ae(u,e,t):d=o==="="?nt(u,e):R(u,e);return`${l} ${o} ${d}`}return R(n,e)}const Us=i=>i.replace(/\bMath\.random\b(?!\s*\()/gi,"Math.random()");function bi(i){const e=i.trim();return e.startsWith("{")&&e.endsWith("}")?"["+e.slice(1,-1)+"]":i}function xi(i){const e=W(/^\s*new\s+(?:byte|short|int|long|float|double|boolean|char|string)\s*\[\s*(.+)\s*\]\s*$/i,i),t=e==null?void 0:e[1].trim();return t||void 0}function Ii(i,e){const t=i.trim();if(e){const s=xi(t);return s!==void 0?`new Array(${s})`:bi(t)}const n=tt(t);return n!==void 0?`Math.floor(${Ii(n,!1)})`:Us(t)}function Os(i,e,t){const n=i.trim();if(e){const s=xi(n);return s!==void 0?`[None] * ${s}`:R(bi(n),t)}return nt(n,t)}function Xs(i,e,t,n,s){if(e==="java")return;const r=$s(i);if(!r)return;if(e==="javascript")return w(t)+Ye(`let ${r.name} = ${Ii(r.rhs,r.isArray)}`)+`
`;const l=!r.isArray&&tt(r.rhs)===void 0&&r.rhs.trim()!=="null"?Ae(r.rhs,n,s):Os(r.rhs,r.isArray,n);return w(t)+`${r.name} = ${l}
`}function ce(i,e){for(const t of i){e(t),t.loopBody&&ce(t.loopBody,e);for(const n of t.cases??[])ce(n.elements,e)}}function dn(i){const e=n=>["int","integer","long","short","byte"].includes(n.trim().toLowerCase()),t=new Set;return ce(i.elements,n=>{for(const s of n.textLines){const r=s.trim();if(r==="")continue;if(r.toLowerCase().startsWith("input:")){const o=Gt(r.slice(6).trim());o&&e(o.type)&&!o.name.includes("[")&&t.add(o.name);continue}const a=mi(r);if(a&&e(a.rawType)){t.add(a.name);continue}const l=W(/^\s*(integer|int|long|short|byte)\s+([a-zA-Z_]\w*)\s*=/i,r);l&&t.add(l[2].trim())}}),t}function Bt(i,e){const t=n=>/^\d+$/.test(n)||e.has(n);return gi(i,n=>n.replace(new RegExp("(?<![\\w./])([a-zA-Z_]\\w*|\\d+)\\s*\\/\\s*([a-zA-Z_]\\w*|\\d+)(?![\\w.(\\[/])","g"),(s,r,a)=>t(r)&&t(a)?`Math.trunc(${r} / ${a})`:s).replace(new RegExp("(?<![\\w.])([a-zA-Z_]\\w*)\\s*\\/=\\s*([a-zA-Z_]\\w*|\\d+)(?![\\w.(\\[])","g"),(s,r,a)=>t(r)&&t(a)?`${r} = Math.trunc(${r} / ${a})`:s))}function wi(i){let e=!1;return ce(i.elements,t=>{t.type===m.anweisung&&t.textLines.some(n=>n.trim().toLowerCase().startsWith("input:"))&&(e=!0)}),e}function Ys(i){let e=!1;return ce(i.elements,t=>{t.textLines.some(n=>/\bMath\.random\s*\(/i.test(n))&&(e=!0)}),e}function ct(i,e){const t=i.trim();return t===""?e==="python"?'""':"0":e==="java"||new RegExp("^\\p{N}+$","u").test(t)||Rt(t)?t:'"'+t.replaceAll('"','\\"')+'"'}function dt(i,e){const t=i.trim();if(t==="")return"";switch(e){case"java":return"/* "+t+" */";case"python":return"  # "+t;case"javascript":return" /* "+t+" */"}}function Js(i,e,t,n,s){const r=i.map(a=>a.trim());if(!r.every(a=>a==="")){if(t.includeDiagramTextAsComments){const a=r.filter(l=>l!==""&&!Zt(l));a.length>0&&(s.out+=Vt(a,e,n))}for(const a of r){if(a==="")continue;if(Zt(a)){s.out+=ci(n,e);continue}const l=t.jsIntVariables??new Set,o=t.arrayElementTypes??new Map,u=t.stringVariables??new Set,d=(e==="java"?Cs(a,n,o):void 0)??(e==="javascript"?Ps(a,n,o):void 0)??(e==="python"?Ls(a,n,o):void 0)??Ts(a,e,n,l,u)??Rs(a,e,n,l)??Xs(a,e,n,l,u)??js(a,e,n,l,u);if(d!==void 0){s.out+=e==="javascript"?Bt(d,l):d;continue}let h=a;Ms(e)?h=Ye(e==="javascript"?Bt(a,l):a):e==="python"&&(h=fi(a,l,u)),h!==""&&(s.out+=w(n)+h+`
`)}}}function Ks(i,e,t,n,s,r,a){s.includeDiagramTextAsComments&&(a.out+=Vt(t,n,r));const l=Re(t),o=s.jsIntVariables??new Set,u=n==="python"?R(l,o):n==="javascript"?Bt(l,o):l;a.out+=w(r)+i+u+e}function Qs(i,e,t,n,s){const r=s.out.length;for(const l of i)$t(l,e,t,n,s);if(e!=="python")return;s.out.slice(r).split(`
`).map(l=>l.trim()).every(l=>l===""||l.startsWith("#"))&&(s.out+=w(n)+`pass
`)}function $t(i,e,t,n,s){const r=t.indentPerLevel,a=e==="python",l=(d,h)=>Qs(d,e,t,h,s),o=(d,h)=>Ks(d,h,i.textLines,e,t,n,s),u=(d=n)=>{t.includeDiagramTextAsComments&&(s.out+=Vt(i.textLines,e,d))};switch(i.type){case m.leerElement:s.out+=ci(n,e);return;case m.anweisung:case m.aufruf:Js(i.textLines,e,t,n,s);return;case m.aussprung:{const d=Re(i.textLines);i.textLines.some(h=>h.trim()!=="")&&u(),a?s.out+=w(n)+(d===""?`break
`:`break  # ${d}
`):s.out+=w(n)+(d===""?`break;
`:`break; // ${d}
`);return}case m.verzweigung:{const d=i.cases;if(!d||d.length<2)return;const h=!t.includeEmptyElseBranch&&Ds(d[1].elements);a?(o("if ",`:
`),l(d[0].elements,n+r),h||(s.out+=w(n)+`else:
`,l(d[1].elements,n+r))):(o("if (",`) {
`),l(d[0].elements,n+r),h||(s.out+=w(n)+`} else {
`,l(d[1].elements,n+r)),s.out+=w(n)+`}
`);return}case m.fallauswahl:{const d=i.cases;if(!d||d.length===0)return;o(a?"match ":"switch (",a?`:
`:`) {
`),d.forEach((h,g)=>{const p=g===d.length-1;if(e==="java"){const f=p?"default -> { "+dt(h.name,e)+`
`:"case "+ct(h.name,e)+` -> {
`;s.out+=w(n+r)+f,l(h.elements,n+r*2),s.out+=w(n+r)+`}
`}else if(a){const f=p?"case _:"+dt(h.name,e):"case "+ct(h.name,e)+":";s.out+=w(n+r)+f+`
`,l(h.elements,n+r*2)}else{const f=p?"default:"+dt(h.name,e):"case "+ct(h.name,e)+":";s.out+=w(n+r)+f+`
`,l(h.elements,n+r*2),s.out+=w(n+r*2)+`break;
`}}),a||(s.out+=w(n)+`}
`);return}case m.forSchleife:if(e==="java")u(),s.out+=w(n)+"for ("+hi(i.textLines)+`) {
`;else if(a){const d=t.jsIntVariables??new Set,h=Fs(i.textLines,d);if((h==null?void 0:h.rangeLine)!==void 0)u(),s.out+=w(n)+h.rangeLine+`
`;else if(h){u(),s.out+=w(n)+h.init+`
`,s.out+=w(n)+"while "+R(h.condition,d)+`:
`;for(const g of i.loopBody??[])$t(g,e,t,n+r,s);s.out+=w(n+r)+fi(h.increment,d)+`
`;return}else o("for ",`:
`)}else u(),s.out+=w(n)+"for ("+Ns(i.textLines)+`) {
`;l(i.loopBody??[],n+r),a||(s.out+=w(n)+`}
`);return;case m.whileSchleife:o(a?"while ":"while (",a?`:
`:`) {
`),l(i.loopBody??[],n+r),a||(s.out+=w(n)+`}
`);return;case m.doUntilSchleife:{const d=Re(i.textLines);if(a){s.out+=w(n)+`while True:
`;const h=n+r;l(i.loopBody??[],h),u(h),s.out+=w(h)+"if not ("+R(d,t.jsIntVariables??new Set)+`):
`,s.out+=w(h+r)+`break
`}else s.out+=w(n)+`do {
`,l(i.loopBody??[],n+r),u(),s.out+=w(n)+"} while ("+d+`);
`;return}case m.endlosschleife:{const d=Re(i.textLines),h=d===""||d==="true";h||u(),a?s.out+=w(n)+(h?`while True:
`:`while True:  # ${d}
`):s.out+=w(n)+(h?`while (true) {
`:`while (true) /* ${d} */ {
`),l(i.loopBody??[],n+r),a||(s.out+=w(n)+`}
`);return}}}function qs(i,e){switch(e){case"javascript":return i.replace(/\.length\(\)/g,".length");case"python":return i.replace(/\b([a-zA-Z_]\w*)\.length(?:\(\))?\b/g,"len($1)");case"java":return tr(i)}}function er(i){const e="(?:byte|short|int|long|float|double|boolean|char|String)",t=[new RegExp(`\\b(?:final\\s+)?${e}\\s*\\[\\s*\\]\\s+([a-zA-Z_]\\w*)\\b`,"g"),new RegExp(`\\b(?:final\\s+)?${e}\\s+([a-zA-Z_]\\w*)\\s*\\[\\s*\\]`,"g")],n=new Set;for(const s of t)for(const r of i.matchAll(s))n.add(r[1].toLowerCase());return n}function tr(i){const e=er(i);return i.replace(/\b([a-zA-Z_]\w*)\.length(?!\()/g,(t,n)=>e.has(n.toLowerCase())?t:`${n}.length()`)}const nr=new Set("abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null var record sealed permits yield module open opens requires exports to uses provides with transitive".split(" "));function zi(i){const e=i.trim();if(e==="")return"Main";let t="";return Array.from(e).forEach((n,s)=>{s===0?new RegExp("\\p{L}","u").test(n)||n==="_"||n==="$"?t+=n:new RegExp("\\p{Nd}","u").test(n)?t+="_"+n:t+="_":/[\p{L}\p{M}\p{N}]/u.test(n)||n==="_"||n==="$"?t+=n:t+="_"}),t=t.replace(/_{2,}/g,"_").replace(/^_+|_+$/g,""),t===""?"Main":(new RegExp("^\\p{Nd}","u").test(t)&&(t="_"+t),nr.has(t.toLowerCase())&&(t="_"+t),t)}function hn(i,e,t={}){const n={...oi,...t},s=zi(e),r=ui(i,"java",n),a=n.indentPerLevel*2,l=wi(i),o=l?ir(r):r,u=w(a),d=o.trim()===""?"":o.split(`
`).map(g=>g.trim()===""?u:u+g).join(`
`);let h="";return l&&(h+=`import java.util.Scanner;

`),h+=`public class ${s} {
`,h+=w(n.indentPerLevel)+`public static void main(String[] args) {
`,l&&(h+=w(a)+`Scanner scanner = new Scanner(System.in);
`,d!==""&&(h+=`
`)),h+=d,d!==""&&!d.endsWith(`
`)&&(h+=`
`),h+=w(n.indentPerLevel)+`}
`,h+=`}
`,h}function ir(i){const e=i.split(`
`);let t=0;for(e[t]==="// import java.util.Scanner;"&&t++;t<e.length&&e[t].trim()==="";)t++;for(e[t]==="Scanner scanner = new Scanner(System.in);"&&t++;t<e.length&&e[t].trim()==="";)t++;return t>=e.length?"":e.slice(t).join(`
`)}const ae={target:"visustruct.codegen.target",javaMode:"visustruct.codegen.javaOutputMode",comments:"visustruct.codegen.includeDiagramComments",emptyElse:"visustruct.codegen.includeEmptyElse"};function Pe(i){try{return localStorage.getItem(i)}catch{return null}}function Le(i,e){try{localStorage.setItem(i,e)}catch{}}const sr=()=>c("web_run_stopped_loop"),yi=()=>c("web_run_cancelled"),N=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function rr(i){let e=0;return i.replace(/^(\s*)while\s*\(\s*true\s*\)(?:\s*\/\*.*?\*\/)?\s*\{/gm,(t,n)=>{const s=`__visuStructLoopGuard${e++}`;return`${n}for (let ${s} = 0; ${s} < 100000 || (() => { throw new Error(${JSON.stringify(sr())}); })(); ${s}++) {`})}function ar(i){return rr(i).replace(/\bprompt\s*\(/g,"await __visuStructPrompt(")}const lr=`
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
  answer = (value) => (value === null ? reject(new Error(${JSON.stringify(yi())})) : resolve(value))
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
`,ht=2e3;class or{constructor(e,t,n,s){b(this,"element");b(this,"target");b(this,"javaMode");b(this,"comments");b(this,"emptyElse");b(this,"code","");b(this,"codeView");b(this,"javaModeRow");b(this,"runButton");b(this,"saveButton");b(this,"copyButton");b(this,"runner");b(this,"runOutput");b(this,"runInput");b(this,"pseudocodeBox");b(this,"pseudocodeHint");b(this,"worker");b(this,"outputLines",[]);b(this,"droppedLines",0);b(this,"outputFrame");b(this,"pendingAnswer");this.currentDocument=e,this.saveFile=t,this.onClose=n,this.setPseudocode=s;const r=Pe(ae.target);this.target=r==="python"||r==="javascript"?r:"java",this.javaMode=Pe(ae.javaMode)==="class"?"class":"snippet",this.comments=Pe(ae.comments)==="true",this.emptyElse=Pe(ae.emptyElse)!=="false",this.element=document.createElement("aside"),this.element.className="codepanel",this.build()}refresh(){const e=this.currentDocument(),t=this.options();this.code=this.target==="java"&&this.javaMode==="class"?hn(e,this.classStem(),t):ui(e,this.target,t),this.codeView.textContent=this.code,this.javaModeRow.hidden=this.target!=="java",this.saveButton.hidden=this.target!=="java",this.runButton.hidden=this.target!=="javascript"||!!e.pseudocode,this.runButton.hidden&&this.stopRun(!0),this.pseudocodeBox.checked=!!e.pseudocode,this.pseudocodeHint.hidden=!e.pseudocode;for(const n of this.element.querySelectorAll("[data-target]"))n.setAttribute("aria-pressed",String(n.dataset.target===this.target));for(const n of this.element.querySelectorAll("[data-java-mode]"))n.setAttribute("aria-pressed",String(n.dataset.javaMode===this.javaMode))}close(){this.stopRun(!0)}options(){return{includeDiagramTextAsComments:this.comments,includeEmptyElseBranch:this.emptyElse,pseudocodeNote:c("codegen_pseudocode_note")}}classStem(){return this.currentDocument().caption.trim()||"Main"}build(){this.element.innerHTML=`
      <div class="code-head">
        <h2>${N(c("codegen_placeholder_title"))}</h2>
        <button class="code-close" title="${N(c("menu_close"))}" aria-label="${N(c("menu_close"))}">✕</button>
      </div>
      <div class="segmented" role="group" aria-label="${N(c("web_codegen_language"))}">
        <button data-target="java">Java</button><button data-target="python">Python</button><button data-target="javascript">JavaScript</button>
      </div>
      <div class="segmented java-mode" role="group" aria-label="${N(c("codegen_java_output_mode"))}">
        <button data-java-mode="snippet">${N(c("codegen_java_output_snippet"))}</button><button data-java-mode="class">${N(c("codegen_java_output_class"))}</button>
      </div>
      <label class="check"><input type="checkbox" data-opt="comments" /> ${N(c("web_codegen_comments"))}</label>
      <label class="check"><input type="checkbox" data-opt="emptyElse" /> ${N(c("web_codegen_empty_else"))}</label>
      <label class="check"><input type="checkbox" data-opt="pseudocode" /> ${N(c("codegen_pseudocode_toggle"))}</label>
      <p class="hint pseudocode-hint" hidden>${N(c("codegen_pseudocode_hint"))}</p>
      <div class="code-actions">
        <button data-act="copy">${N(c("codegen_copy"))}</button>
        <button data-act="save">${N(c("codegen_save_java"))}</button>
        <button data-act="run" class="primary">${N(c("codegen_run_in_browser"))}</button>
      </div>
      <pre class="code-view" tabindex="0" dir="ltr"></pre>
      <div class="runner" hidden>
        <div class="runner-head"><h2>${N(c("simulation_output"))}</h2><button data-act="stop">${N(c("simulation_stop"))}</button></div>
        <pre class="runner-out" dir="ltr"></pre>
        <form class="runner-input" hidden>
          <label></label>
          <div class="sim-input-row"><input autocomplete="off" /><button type="submit">${N(c("simulation_input_submit"))}</button><button type="button" data-act="cancel">${N(c("close_unsaved_cancel"))}</button></div>
        </form>
      </div>
      <p class="hint">${N(c("codegen_generated_hint"))}</p>
    `;const e=s=>this.element.querySelector(s);this.codeView=e(".code-view"),this.javaModeRow=e(".java-mode"),this.runButton=e("[data-act=run]"),this.saveButton=e("[data-act=save]"),this.copyButton=e("[data-act=copy]"),this.runner=e(".runner"),this.runOutput=e(".runner-out"),this.runInput=e(".runner-input"),this.pseudocodeBox=e("[data-opt=pseudocode]"),this.pseudocodeHint=e(".pseudocode-hint"),this.pseudocodeBox.addEventListener("change",()=>this.setPseudocode(this.pseudocodeBox.checked)),e(".code-close").addEventListener("click",()=>this.onClose());for(const s of this.element.querySelectorAll("[data-target]"))s.addEventListener("click",()=>{this.target=s.dataset.target,Le(ae.target,this.target),this.refresh()});for(const s of this.element.querySelectorAll("[data-java-mode]"))s.addEventListener("click",()=>{this.javaMode=s.dataset.javaMode,Le(ae.javaMode,this.javaMode),this.refresh()});const t=e("[data-opt=comments]");t.checked=this.comments,t.addEventListener("change",()=>{this.comments=t.checked,Le(ae.comments,String(this.comments)),this.refresh()});const n=e("[data-opt=emptyElse]");n.checked=this.emptyElse,n.addEventListener("change",()=>{this.emptyElse=n.checked,Le(ae.emptyElse,String(this.emptyElse)),this.refresh()}),this.copyButton.addEventListener("click",()=>this.copy()),this.saveButton.addEventListener("click",()=>{const s=zi(this.classStem()),r=hn(this.currentDocument(),this.classStem(),this.options());this.saveFile(`${s}.java`,r)}),this.runButton.addEventListener("click",()=>this.run()),e("[data-act=stop]").addEventListener("click",()=>this.stopRun(!1)),e("[data-act=cancel]").addEventListener("click",()=>this.answer(null)),this.runInput.addEventListener("submit",s=>{s.preventDefault(),this.answer(this.runInput.querySelector("input").value)})}async copy(){var t;let e=!1;try{await navigator.clipboard.writeText(this.code),e=!0}catch{const n=document.createRange();n.selectNodeContents(this.codeView);const s=getSelection();s==null||s.removeAllRanges(),s==null||s.addRange(n),e=((t=document.execCommand)==null?void 0:t.call(document,"copy"))??!1}this.copyButton.textContent=c(e?"web_copied_check":"web_copy_manual"),setTimeout(()=>this.copyButton.textContent=c("codegen_copy"),2e3)}run(){this.stopRun(!0),this.runner.hidden=!1,this.runOutput.textContent="",this.outputLines=[],this.droppedLines=0,this.runOutput.classList.remove("error");const e=ar(this.code),t=n=>this.onRunnerMessage(n);try{const n=URL.createObjectURL(new Blob([lr],{type:"text/javascript"})),s=new Worker(n);URL.revokeObjectURL(n),s.onmessage=r=>t(r.data),s.onerror=r=>{r.preventDefault(),t({type:"error",text:r.message||c("web_run_error")})},s.postMessage({type:"run",code:e}),this.worker=s}catch{this.runInPage(e,t)}this.setRunning(!0)}runInPage(e,t){const n={log:(...a)=>t({type:"log",lines:[a.map(l=>typeof l=="string"?l:JSON.stringify(l)).join(" ")]})},s=a=>new Promise((l,o)=>{this.pendingAnswer=u=>u===null?o(new Error(yi())):l(u),t({type:"prompt",text:a})}),r=(async()=>{}).constructor;new r("__visuStructPrompt","console",e)(s,n).then(()=>t({type:"done"})).catch(a=>t({type:"error",text:String(a)}))}onRunnerMessage(e){switch(e.type){case"log":this.appendOutput(e.lines??[]);break;case"prompt":{this.runInput.hidden=!1,this.runInput.querySelector("label").textContent=e.text??"";const t=this.runInput.querySelector("input");t.value="",t.focus();break}case"error":this.appendOutput([e.text??""]),this.runOutput.classList.add("error"),this.stopRun(!1);break;case"done":this.stopRun(!1);break}}appendOutput(e){this.outputLines.push(...e),this.outputLines.length>ht&&(this.droppedLines+=this.outputLines.length-ht,this.outputLines.splice(0,this.outputLines.length-ht)),this.outputFrame===void 0&&(this.outputFrame=requestAnimationFrame(()=>{this.outputFrame=void 0;const t=this.droppedLines>0?c("web_run_dropped_fmt",this.droppedLines)+`
`:"";this.runOutput.textContent=t+this.outputLines.join(`
`)+(this.outputLines.length?`
`:""),this.runOutput.scrollTop=this.runOutput.scrollHeight}))}answer(e){var t;this.runInput.hidden=!0,this.worker?this.worker.postMessage({type:"answer",value:e}):(t=this.pendingAnswer)==null||t.call(this,e),this.pendingAnswer=void 0}stopRun(e){var t;(t=this.worker)==null||t.terminate(),this.worker=void 0,this.pendingAnswer=void 0,this.runInput&&(this.runInput.hidden=!0),e&&this.runner&&(this.runner.hidden=!0),this.setRunning(!1)}setRunning(e){const t=this.element.querySelector("[data-act=stop]");t&&(t.disabled=!e)}}const ur=100;function vi(i){switch(i.kind){case"finished":return"Simulation finished.";case"infiniteLoopWithoutBody":return"Infinite loop has no body.";case"unsupportedStatement":return`Unsupported statement: ${i.text}`;case"invalidExpression":return`Invalid expression: ${i.text}`;case"unknownVariable":return`Unknown variable: ${i.text}`;case"divisionByZero":return"Division by zero.";case"wholeNumberExpected":return"Please enter a whole number.";case"numberExpected":return"Please enter a number.";case"booleanExpected":return"Please enter true or false.";case"subprogramNotFound":return`No open diagram is called ${i.text}. The call was skipped.`;case"callTooDeep":return"Too many nested calls. Does a subprogram call itself?";case"other":return i.text}}class ne extends Error{constructor(e){super(vi(e)),this.notice=e}}const $=i=>new ne({kind:"unsupportedStatement",text:i}),M=i=>new ne({kind:"invalidExpression",text:i}),Ie=i=>new ne({kind:"unknownVariable",text:i}),cr=()=>new ne({kind:"divisionByZero"});function mn(i){return i instanceof ne?i.notice:{kind:"other",text:i instanceof Error?i.message:String(i)}}function dr(i){if(i===0)return"0";if(!Number.isFinite(i))return Number.isNaN(i)?"nan":i>0?"inf":"-inf";const e=Math.floor(Math.log10(Math.abs(Number(i.toPrecision(12)))));if(e<-4||e>=12){const[n,s]=i.toExponential(11).split("e"),r=n.includes(".")?n.replace(/0+$/,"").replace(/\.$/,""):n,a=Number(s);return`${r}e${a<0?"-":"+"}${String(Math.abs(a)).padStart(2,"0")}`}const t=i.toFixed(Math.max(0,11-e));return t.includes(".")?t.replace(/0+$/,"").replace(/\.$/,""):t}function gn(i){return Number.isFinite(i)&&Math.round(i)===i?i.toFixed(1):dr(i)}function O(i){switch(i.kind){case"int":return String(i.value);case"double":return gn(i.value);case"string":return i.value;case"boolean":return String(i.value);case"intArray":return"["+i.value.map(String).join(", ")+"]";case"doubleArray":return"["+i.value.map(gn).join(", ")+"]";case"stringArray":return"["+i.value.join(", ")+"]"}}function hr(i){return i.kind==="int"||i.kind==="double"?i.value:NaN}const ge=i=>({kind:"int",value:i}),ee=i=>({kind:"double",value:i}),Si=i=>i!==void 0&&/\s/u.test(i),Ke=i=>new RegExp("\\p{L}","u").test(i),we=i=>new RegExp("\\p{N}","u").test(i);function Se(i){const e=Array.from(i);return e.length===0||!(Ke(e[0])||e[0]==="_")?!1:e.every(t=>Ke(t)||we(t)||t==="_")}function he(i){switch(i.toLowerCase()){case"int":return"int";case"double":return"double";case"string":return"string";case"boolean":case"bool":return"boolean";default:return}}function mr(i){return i.kind==="int"?"int":i.kind==="double"?"double":i.kind==="boolean"?"boolean":"string"}function oe(i){const e=Array.from(i);if(!(e.length<2||e[0]!=='"'||e[e.length-1]!=='"'))return e.slice(1,-1).join("").replaceAll('\\"','"').replaceAll("\\n",`
`)}function pn(i){return i.replaceAll("(int)","").replaceAll("(double)","").trim()}function Ut(i){const e=new Array(i.length).fill(!1);let t=0,n=!1,s=!1;return i.forEach((r,a)=>{if(n){s?s=!1:r==="\\"?s=!0:r==='"'&&(n=!1);return}switch(r){case'"':n=!0;break;case"(":case"[":t+=1;break;case")":case"]":t-=1;break;default:e[a]=t===0}}),e}function fn(i,e){const t=Array.from(i),n=Array.from(e),s=Ut(t),r=[];let a=[],l=0;for(;l<t.length;){const o=l+n.length;if(o<=t.length&&n.every((u,d)=>t[l+d]===u)&&s.slice(l,o).every(Boolean)){r.push(a.join("").trim()),a=[],l=o;continue}a.push(t[l]),l+=1}return r.push(a.join("").trim()),r}function gr(i){const e=Array.from(i),t=Ut(e);for(let n=0;n<e.length;n++){if(!t[n])continue;let s;if(n+1<e.length&&t[n+1]){const l=e[n]+e[n+1];[">=","<=","==","!="].includes(l)&&(s=l)}if(s===void 0&&(e[n]==="<"||e[n]===">")&&(s=e[n]),s===void 0)continue;const r=e.slice(0,n).join("").trim(),a=e.slice(n+s.length).join("").trim();return{lhs:r,op:s,rhs:a}}}function ki(i,e){let t=0,n=!1,s=!1;for(let r=e;r<i.length;r++){const a=i[r];if(n){s?s=!1:a==="\\"?s=!0:a==='"'&&(n=!1);continue}if(a==='"')n=!0;else if(a==="(")t+=1;else if(a===")"&&(t-=1,t===0))return r}}function _i(i){const e=Array.from(i);if(!(e[0]!=="("||e[e.length-1]!==")"||ki(e,0)!==e.length-1))return e.slice(1,-1).join("").trim()}function pr(i){const e=Array.from(i),t=Array.from(".equals(");if(e[e.length-1]!==")")return;const n=Ut(e);for(let s=0;s<e.length;s++){if(!n[s]||s+t.length>e.length||!t.every((a,l)=>e[s+l]===a))continue;const r=s+t.length-1;if(ki(e,r)===e.length-1)return{lhs:e.slice(0,s).join("").trim(),rhs:e.slice(r+1,-1).join("").trim()}}}function Te(i){const e=i.trim();for(const t of["if","while","until","switch"]){if(!e.startsWith(t))continue;const n=e.slice(t.length);if(!(n===""||Si(n[0])||n[0]==="("))continue;let s=n.trim();const r=_i(s);return r!==void 0&&(s=r),s===""?"true":s}return e===""?"true":e}function $e(i){const e=i.trim(),t=e.indexOf("[");if(!e.endsWith("]")||t<0)return;const n=e.slice(0,t).trim();if(Se(n))return{arrayName:n,indexExpression:e.slice(t+1,-1)}}function bn(i){return Se(i)||$e(i)!==void 0}function xn(i){const e=[];let t="",n=!1,s=!1;for(const r of i){if(s){t+=r,s=!1;continue}if(r==="\\"){t+=r,s=!0;continue}if(r==='"'){n=!n,t+=r;continue}if(r==="+"&&!n){e.push(t),t="";continue}t+=r}if(n)throw M(i);return e.push(t),e}function In(i){const e=Array.from(i),t=[];let n=0;for(;n<e.length;){const s=e[n];if(Si(s)){n+=1;continue}if(we(s)||s==="."&&n+1<e.length&&we(e[n+1])){const r=n;let a=0;for(;n<e.length;){if(e[n]==="."){if(a+=1,a>1)throw M(i)}else if(!we(e[n]))break;n+=1}const l=e.slice(r,n).join("");if(l==="."||!/^[0-9]*\.?[0-9]*$/.test(l))throw M(i);t.push({t:"number",literal:l,value:Number(l)});continue}if(Ke(s)||s==="_"){const r=n;for(;n<e.length&&(Ke(e[n])||we(e[n])||e[n]==="_");)n+=1;t.push({t:"identifier",name:e.slice(r,n).join("")});continue}if("+-*/%.()[]".includes(s)){t.push({t:s}),n+=1;continue}throw M(i)}return t}class fr{constructor(e,t){b(this,"index",0);this.tokens=e,this.variables=t}parseInt(){const e=this.expression().v;if(this.index!==this.tokens.length||!Number.isFinite(e))throw M("");return Math.trunc(e)}parseDouble(){return this.parseNumber().v}parseNumber(){const e=this.expression();if(this.index!==this.tokens.length)throw M("");return e}get current(){return this.tokens[this.index]}kind(){var e;return(e=this.tokens[this.index])==null?void 0:e.t}isIdent(e){const t=this.current;return(t==null?void 0:t.t)==="identifier"&&t.name===e}expression(){let e=this.term();for(let t=this.current;t&&(t.t==="+"||t.t==="-");t=this.current){this.index+=1;const n=this.term();e={v:t.t==="+"?e.v+n.v:e.v-n.v,int:e.int&&n.int}}return e}term(){let e=this.factor();for(let t=this.current;t&&(t.t==="*"||t.t==="/"||t.t==="%");t=this.current){this.index+=1;const n=this.factor(),s=e.int&&n.int;if(t.t==="*")e={v:e.v*n.v,int:s};else{if(n.v===0)throw cr();e={v:t.t==="/"?s?Math.trunc(e.v/n.v):e.v/n.v:e.v%n.v,int:s}}}return e}factor(){const e=this.current;if(!e)throw M("");switch(this.index+=1,e.t){case"number":return{v:e.value,int:!e.literal.includes(".")};case"identifier":{const t=e.name;if(t==="Math"&&this.kind()==="."){if(this.index+=1,!this.isIdent("random"))throw M(t);if(this.index+=1,this.kind()!=="("||(this.index+=1,this.kind()!==")"))throw M("Math.random");return this.index+=1,{v:Math.random(),int:!1}}const n=this.variables.get(t);if(!n)throw Ie(t);if(this.kind()==="."){if(this.index+=1,!this.isIdent("length"))throw M(t);if(this.index+=1,this.kind()==="("){if(this.index+=1,this.kind()!==")")throw M(`${t}.length`);this.index+=1}if(n.kind==="intArray"||n.kind==="doubleArray"||n.kind==="stringArray")return{v:n.value.length,int:!0};throw M(t)}if(this.kind()==="["){this.index+=1;const r=Math.trunc(this.expression().v);if(this.kind()!=="]")throw M(t);if(this.index+=1,n.kind==="intArray"||n.kind==="doubleArray"){if(!(r>=0&&r<n.value.length))throw M(`${t}[${r}]`);return{v:n.value[r],int:n.kind==="intArray"}}throw M(t)}const s=hr(n);if(!Number.isFinite(s))throw M(t);return{v:s,int:n.kind==="int"}}case"-":{const t=this.factor();return{v:-t.v,int:t.int}}case"(":{const t=this.expression();if(this.kind()!==")")throw M("");return this.index+=1,t}default:throw M("")}}}function Di(i){let e=i.trim();for(;e.endsWith(";");)e=e.slice(0,-1).trim();return e}function wn(i){const e=i.slice(0,3);for(;e.length<3;)e.push("");return e}function jt(i){const e=i.map(t=>Di(t).trim());return e.length===1&&e[0].includes(";")?wn(e[0].split(";").map(t=>t.trim())):wn(e)}const U=i=>i.frame?{frame:i.frame,callPath:i.callPath}:{};function Q(i,e=[],t={}){const n=[],s=r=>n.push(t.frame?{...r,...t}:r);return i.forEach((r,a)=>{const l=[...e,a],o=r.textLines.join(" ").trim();switch(r.type){case m.anweisung:o!==""&&o!=="ø"&&s({path:l,text:o,kind:"statement"});break;case m.verzweigung:s({path:l,text:o||"true",kind:"branch",cases:r.cases});break;case m.fallauswahl:s({path:l,text:o||"0",kind:"switchSelection",cases:r.cases});break;case m.forSchleife:s({path:l,text:o,kind:"forLoopStart",loopBody:r.loopBody,forParts:jt(r.textLines)});break;case m.whileSchleife:s({path:l,text:o||"true",kind:"whileLoop",loopBody:r.loopBody});break;case m.doUntilSchleife:s({path:l,text:o||"true",kind:"doUntilLoop",loopBody:r.loopBody});break;case m.endlosschleife:s({path:l,text:o||"true",kind:"infiniteLoop",loopBody:r.loopBody});break;case m.aussprung:s({path:l,text:o,kind:"jump"});break;case m.aufruf:o!==""&&o!=="ø"&&s({path:l,text:o,kind:"call"});break}}),n}function br(i,e){const t=i.trim().replaceAll(",",".");switch(e){case"int":if(!/^[+-]?[0-9]+$/.test(t))throw new ne({kind:"wholeNumberExpected"});return ge(Number(t));case"double":if(!/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)([eE][+-]?[0-9]+)?$/.test(t))throw new ne({kind:"numberExpected"});return ee(Number(t));case"string":return{kind:"string",value:i};case"boolean":switch(t.toLowerCase()){case"true":case"wahr":return{kind:"boolean",value:!0};case"false":case"falsch":return{kind:"boolean",value:!1};default:throw new ne({kind:"booleanExpected"})}}}function zn(){return{stepIndex:0,variables:new Map,outputLines:[],isHalted:!1}}function xr(i,e){for(let t=0;t<e.length;t++){const n=e[t].name.trim();if(n.toLowerCase()!=="default"){if(i.kind==="int"){if(/^[+-]?[0-9]+$/.test(n)&&Number(n)===i.value)return t}else if(oe(n)===i.value||n===i.value)return t}}}function Ir(i){return i==="forLoopIncrement"||i==="forLoopCondition"||i==="whileLoop"||i==="doUntilCondition"||i==="infiniteLoop"}function wr(i,e){return(i.frame??0)===(e.frame??0)&&i.path.length===e.path.length&&i.path.every((t,n)=>t===e.path[n])}function Mi(i){return Di(i).replace(/\(\s*\)$/u,"").trim()}class Et{constructor(e,t=()=>{}){b(this,"steps");b(this,"state",zn());b(this,"nextFrame",1);b(this,"callDepth",0);this.resolveSubprogram=t,this.steps=Q(e.elements)}get currentStepPath(){const e=this.steps[this.state.stepIndex];return(e==null?void 0:e.callPath)??(e==null?void 0:e.path)}get canStep(){return!this.state.isHalted&&!this.state.inputRequest&&this.state.stepIndex<this.steps.length}get message(){return this.state.notice&&vi(this.state.notice)}reset(e){e&&(this.steps=Q(e.elements)),this.state=zn(),this.nextFrame=1,this.callDepth=0}step(){const e=this.state;if(!this.canStep){!e.inputRequest&&!e.isHalted&&(e.notice={kind:"finished"});return}const t=this.steps[e.stepIndex];try{switch(t.kind){case"statement":this.executeStatement(t.text);break;case"branch":return this.executeBranch(t);case"switchSelection":return this.executeSwitchSelection(t);case"forLoopStart":return this.executeForLoopStart(t);case"forLoopCondition":return this.executeForLoopCondition(t);case"forLoopIncrement":return this.executeForLoopIncrement(t);case"whileLoop":return this.executeWhileLoop(t);case"doUntilLoop":return this.enterDoUntilLoop(t);case"doUntilCondition":return this.executeDoUntilCondition(t);case"infiniteLoop":return this.enterInfiniteLoop(t);case"jump":return this.executeJump(t);case"call":return this.executeCall(t);case"callEnd":return this.executeCallEnd(t)}if(e.inputRequest){e.notice=void 0;return}e.stepIndex+=1,e.notice=this.finishedIfAtEnd()}catch(n){e.notice=mn(n),e.isHalted=!0}}provideInput(e){const t=this.state.inputRequest;if(t){try{const n=br(e,t.valueType);this.assignValue(n,t.variableName),this.state.lastTrace=`${t.variableName} = input -> ${O(n)}`}catch(n){this.state.inputErrorNotice=mn(n);return}this.state.inputRequest=void 0,this.state.inputErrorNotice=void 0,this.state.stepIndex+=1,this.state.notice=this.finishedIfAtEnd()}}finishedIfAtEnd(){return this.state.stepIndex>=this.steps.length?{kind:"finished"}:void 0}splice(e){this.steps.splice(this.state.stepIndex,1,...e)}noticeAfterEntering(e){return e.length>0?void 0:this.finishedIfAtEnd()}executeBranch(e){const t=e.cases;if(!t||t.length<2)throw $(e.text);const n=Te(e.text),s=this.evaluateBool(n),r=s?0:1,a=Q(t[r].elements,[...e.path,r],U(e));this.splice(a),this.state.lastTrace=`${n} -> ${s}`,this.state.notice=this.noticeAfterEntering(a)}executeSwitchSelection(e){const t=e.cases;if(!t||t.length===0)throw $(e.text);const n=Te(e.text),s=this.evaluateSwitchSelector(n),r=xr(s,t)??t.length-1,a=Q(t[r].elements,[...e.path,r],U(e));this.splice(a),this.state.lastTrace=`${n} -> ${t[r].name}`,this.state.notice=this.noticeAfterEntering(a)}executeForLoopStart(e){const t=jt(e.forParts??[e.text]);t[0]!==""&&this.executeStatement(t[0]),this.splice([{...U(e),path:e.path,text:t[1],kind:"forLoopCondition",loopBody:e.loopBody,forParts:t}])}executeForLoopCondition(e){const t=jt(e.forParts??[e.text]),n=t[1]===""?"true":t[1],s=this.evaluateBool(n);if(this.state.lastTrace=`${n} -> ${s}`,s){const r=Q(e.loopBody??[],[...e.path,0],U(e));this.splice([...r,{...U(e),path:e.path,text:t[2],kind:"forLoopIncrement",loopBody:e.loopBody,forParts:t},{...U(e),path:e.path,text:t[1],kind:"forLoopCondition",loopBody:e.loopBody,forParts:t}])}else this.splice([]),this.state.notice=this.finishedIfAtEnd()}executeForLoopIncrement(e){const t=e.text.trim();t!==""&&this.executeIncrement(t),this.splice([])}executeWhileLoop(e){const t=Te(e.text),n=this.evaluateBool(t);if(this.state.lastTrace=`${t} -> ${n}`,n){const s=Q(e.loopBody??[],[...e.path,0],U(e));this.splice([...s,{...U(e),path:e.path,text:e.text,kind:"whileLoop",loopBody:e.loopBody}]),this.state.notice=this.noticeAfterEntering(s)}else this.splice([]),this.state.notice=this.finishedIfAtEnd()}enterDoUntilLoop(e){const t=Q(e.loopBody??[],[...e.path,0],U(e));this.splice([...t,{...U(e),path:e.path,text:e.text,kind:"doUntilCondition",loopBody:e.loopBody}]),this.state.notice=this.noticeAfterEntering(t)}executeDoUntilCondition(e){const t=Te(e.text),n=this.evaluateBool(t);if(this.state.lastTrace=`${t} -> ${n}`,n){const s=Q(e.loopBody??[],[...e.path,0],U(e));this.splice([...s,{...U(e),path:e.path,text:e.text,kind:"doUntilCondition",loopBody:e.loopBody}])}else this.splice([]),this.state.notice=this.finishedIfAtEnd()}enterInfiniteLoop(e){const t=Q(e.loopBody??[],[...e.path,0],U(e));this.splice([...t,{...U(e),path:e.path,text:e.text,kind:"infiniteLoop",loopBody:e.loopBody}]),this.state.lastTrace="true -> true",this.state.notice=t.length>0?void 0:{kind:"infiniteLoopWithoutBody"}}executeJump(e){const t=e.frame??0,n=a=>a.length<e.path.length&&a.every((l,o)=>l===e.path[o]);let s=this.steps.length,r="end";for(let a=this.state.stepIndex+1;a<this.steps.length;a++){const l=this.steps[a];if((l.frame??0)===t){if(l.kind==="callEnd"){s=a+1,r="return";break}if(Ir(l.kind)&&n(l.path)){for(s=a+1;s<this.steps.length&&wr(this.steps[s],l);)s+=1;r="break";break}}}r==="return"&&(this.callDepth-=1),this.steps.splice(this.state.stepIndex,s-this.state.stepIndex),this.state.lastTrace=`${e.text||"break"} -> ${r}`,this.state.notice=this.finishedIfAtEnd()}executeCall(e){const t=e.text,n=this.resolveSubprogram(Mi(t));if(!n){this.splice([]),this.state.lastTrace=`${t} -> ?`,this.state.notice={kind:"subprogramNotFound",text:t},this.state.stepIndex>=this.steps.length&&(this.state.notice={kind:"finished"});return}if(this.callDepth>=ur)throw new ne({kind:"callTooDeep"});this.callDepth+=1;const s={frame:this.nextFrame++,callPath:e.callPath??e.path},r=Q(n.elements,[],s);this.splice([...r,{...s,path:e.path,text:t,kind:"callEnd"}]),this.state.lastTrace=`${t} -> call`}executeCallEnd(e){this.callDepth-=1,this.splice([]),this.state.lastTrace=`${e.text} -> return`,this.state.notice=this.finishedIfAtEnd()}executeStatement(e){const t=this.state,n=e.trim(),s=n.toLowerCase();if(s.startsWith("input:")){t.inputRequest=this.parseInputRequest(n),t.inputErrorNotice=void 0;return}if(s.startsWith("output:")||s.startsWith("print:")){const p=n.slice(s.startsWith("output:")?7:6),f=this.renderOutputExpression(p),y=this.evaluateOutputExpression(p);t.outputLines.push(y),t.lastTrace=`${f} -> ${y}`;return}if(n.endsWith("++")||n.endsWith("--")||n.includes("+=")||n.includes("-=")){this.executeIncrement(n);return}const r=n.indexOf("=");if(r<0)throw $(n);const a=n.slice(0,r).trim(),l=n.slice(r+1),o=this.parseArrayDeclaration(a,l);if(o){t.variables.set(o.name,o.value),t.lastTrace=`${o.name} = new ${o.typeName}[${o.count}]`;return}const u=this.parseAssignmentTarget(a);let d;try{d=this.renderNumericExpression(l)}catch{d=l.trim()}let h=u.valueType;if(!h)try{h=this.inferTargetValueType(u.variableName)}catch{h="int"}const g=this.evaluateExpression(l,h);this.assignValue(g,u.variableName),t.lastTrace=`${u.variableName} = ${d} -> ${O(g)}`}executeIncrement(e){const t=this.state.variables;for(const[n,s]of[["++",1],["--",-1]]){if(!e.endsWith(n))continue;const r=e.slice(0,-2).trim(),a=t.get(r);if(!Se(r)||!a)throw $(e);const l=s>0?"+":"-";if(a.kind==="int"){t.set(r,ge(a.value+s)),this.state.lastTrace=`${r} = ${a.value} ${l} 1 -> ${a.value+s}`;return}if(a.kind==="double"){const o=a.value+s;t.set(r,ee(o)),this.state.lastTrace=`${r} = ${O(a)} ${l} 1 -> ${O(ee(o))}`;return}throw $(e)}for(const[n,s]of[["+=",1],["-=",-1]]){const r=e.indexOf(n);if(r<0)continue;const a=e.slice(0,r).trim(),l=e.slice(r+2),o=t.get(a);if(!Se(a)||!o)throw $(e);const u=s>0?"+":"-";if(o.kind==="int"){const d=this.evaluateInt(l),h=o.value+s*d;t.set(a,ge(h)),this.state.lastTrace=`${a} = ${o.value} ${u} ${d} -> ${h}`;return}if(o.kind==="double"){const d=this.evaluateDouble(l),h=o.value+s*d;t.set(a,ee(h)),this.state.lastTrace=`${a} = ${O(o)} ${u} ${O(ee(d))} -> ${O(ee(h))}`;return}throw $(e)}this.executeStatement(e)}parseAssignmentTarget(e){const t=e.split(/\s+/u).filter(Boolean);let n,s;if(t.length===1)n=t[0];else if(t.length===2&&he(t[0]))n=t[1],s=he(t[0]);else if(t.length===3&&t[0]==="const"&&he(t[1]))n=t[2],s=he(t[1]);else throw $(e);if(!bn(n))throw $(e);return{variableName:n,valueType:s}}parseInputRequest(e){const t=e.slice(6).trim(),n=/^(\S+)(?:\s+(\S+))?(?:\s+([\s\S]*))?$/u.exec(t);if(!n)throw $(e);const s=[n[1],n[2],n[3]].filter(d=>d!==void 0);let r,a,l;const o=he(s[0]);if(s.length>=2&&o?(r=s[1],a=o,l=(s[2]??"").trim()):(r=s[0],a=this.inferTargetValueType(r),l=(s[1]??"").trim()),!bn(r))throw $(e);const u=oe(l)??l;return{variableName:r,valueType:a,prompt:u===""?`${r}:`:u}}parseArrayDeclaration(e,t){const n=e.split(/\s+/u).filter(Boolean);if(n.length!==2||!n[0].endsWith("[]"))return;const s=n[0].slice(0,-2),r=he(s),a=n[1];if(!r||r==="boolean"||!Se(a))throw $(e);const l=t.trim();if(l.startsWith("{")&&l.endsWith("}")){const g=l.slice(1,-1).split(",").map(f=>f.trim());let p;switch(r){case"int":p={kind:"intArray",value:g.map(f=>this.evaluateInt(f))};break;case"double":p={kind:"doubleArray",value:g.map(f=>this.evaluateDouble(f))};break;case"string":p={kind:"stringArray",value:g.map(f=>oe(f)??this.evaluateOutputExpression(f))};break}return{name:a,typeName:s,count:g.length,value:p}}const o=`new ${s}[`;if(!l.startsWith(o)||!l.endsWith("]"))throw $(t);const u=l.slice(o.length,-1),d=this.evaluateInt(u);if(d<0)throw M(u);const h=r==="int"?{kind:"intArray",value:new Array(d).fill(0)}:r==="double"?{kind:"doubleArray",value:new Array(d).fill(0)}:{kind:"stringArray",value:new Array(d).fill("")};return{name:a,typeName:s,count:d,value:h}}arrayIndex(e){const t=this.evaluateInt(e);if(t<0)throw M(e);return t}evaluateReference(e){const t=e.trim(),n=this.state.variables.get(t);if(n)return n;const s=$e(t);if(s)return this.valueInArray(s.arrayName,this.arrayIndex(s.indexExpression))}valueInArray(e,t){const n=this.state.variables.get(e);if(!n)throw Ie(e);if(n.kind!=="intArray"&&n.kind!=="doubleArray"&&n.kind!=="stringArray")throw M(e);if(t>=n.value.length)throw M(`${e}[${t}]`);switch(n.kind){case"intArray":return ge(n.value[t]);case"doubleArray":return ee(n.value[t]);case"stringArray":return{kind:"string",value:n.value[t]}}}inferTargetValueType(e){const t=e.trim(),n=this.state.variables.get(t);if(n)return mr(n);const s=$e(t);if(s){const r=this.state.variables.get(s.arrayName);if(!r)throw Ie(s.arrayName);if(r.kind==="intArray")return"int";if(r.kind==="doubleArray")return"double";if(r.kind==="stringArray")return"string";throw M(s.arrayName)}throw $(e)}assignValue(e,t){const n=t.trim(),s=$e(n);if(!s){this.state.variables.set(n,e);return}const r=this.arrayIndex(s.indexExpression),a=this.state.variables.get(s.arrayName);if(!a)throw Ie(s.arrayName);let l;if(a.kind==="intArray"&&e.kind==="int")l={kind:"intArray",value:[...a.value]};else if(a.kind==="doubleArray"&&(e.kind==="double"||e.kind==="int"))l={kind:"doubleArray",value:[...a.value]};else if(a.kind==="stringArray"&&e.kind==="string")l={kind:"stringArray",value:[...a.value]};else throw M(n);if(r>=l.value.length)throw M(n);l.value[r]=e.value,this.state.variables.set(s.arrayName,l)}evaluateOutputExpression(e){return xn(e).map(t=>{const n=t.trim(),s=oe(n);if(s!==void 0)return s;const r=this.evaluateReference(n);return O(r||this.evaluateNumeric(n))}).join("")}renderOutputExpression(e){return xn(e).map(t=>{const n=t.trim();if(oe(n)!==void 0)return n;const s=this.evaluateReference(n);if(s)return O(s);try{return this.renderNumericExpression(n)}catch{return n}}).join(" + ")}evaluateExpression(e,t){switch(t){case"int":return ge(this.evaluateInt(e));case"double":return ee(this.evaluateDouble(e));case"string":{const n=e.trim(),s=oe(n);if(s!==void 0)return{kind:"string",value:s};const r=this.evaluateReference(n);return r?{kind:"string",value:O(r)}:{kind:"string",value:this.evaluateOutputExpression(e)}}case"boolean":return{kind:"boolean",value:this.evaluateBool(e)}}}evaluateNumeric(e){const{v:t,int:n}=this.parser(e).parseNumber();return n||Number.isFinite(t)&&Math.round(t)===t?ge(t):ee(t)}parser(e){return new fr(In(pn(e)),this.state.variables)}evaluateInt(e){return this.parser(e).parseInt()}evaluateDouble(e){return this.parser(e).parseDouble()}evaluateBool(e){const t=e.trim();if(t==="true")return!0;if(t==="false")return!1;const n=this.evaluateReference(t);if((n==null?void 0:n.kind)==="boolean")return n.value;const s=fn(t,"||");if(s.length>1)return s.some(u=>this.evaluateBool(u));const r=fn(t,"&&");if(r.length>1)return r.every(u=>this.evaluateBool(u));if(t.startsWith("!")&&!t.startsWith("!="))return!this.evaluateBool(t.slice(1));const a=_i(t);if(a!==void 0)return this.evaluateBool(a);const l=pr(t);if(l)return this.evaluateComparison(l.lhs,"==",l.rhs);const o=gr(t);if(o)return this.evaluateComparison(o.lhs,o.op,o.rhs);if(this.stringOperand(t)!==void 0)throw M(t);return this.evaluateDouble(t)!==0}evaluateComparison(e,t,n){const s=this.booleanOperand(e),r=this.booleanOperand(n);if((s!==void 0||r!==void 0)&&(t==="=="||t==="!=")){const d=s??this.evaluateBool(e),h=r??this.evaluateBool(n);return t==="=="?d===h:d!==h}const a=this.stringOperand(e),l=this.stringOperand(n);let o,u;if(a!==void 0||l!==void 0){if(a===void 0||l===void 0)throw M(`${e} ${t} ${n}`);o=a,u=l}else o=this.evaluateDouble(e),u=this.evaluateDouble(n);switch(t){case"==":return o===u;case"!=":return o!==u;case"<":return o<u;case"<=":return o<=u;case">":return o>u;case">=":return o>=u;default:throw M(`${e} ${t} ${n}`)}}booleanOperand(e){const t=e.trim();if(t==="true")return!0;if(t==="false")return!1;const n=this.evaluateReference(t);return(n==null?void 0:n.kind)==="boolean"?n.value:void 0}stringOperand(e){const t=e.trim(),n=oe(t);if(n!==void 0)return n;const s=this.evaluateReference(t);return(s==null?void 0:s.kind)==="string"?s.value:void 0}evaluateSwitchSelector(e){const t=e.trim(),n=oe(t);if(n!==void 0)return{kind:"text",value:n};const s=this.state.variables.get(t);if(s)switch(s.kind){case"int":return{kind:"int",value:s.value};case"double":return{kind:"int",value:Math.trunc(s.value)};case"string":return{kind:"text",value:s.value};default:throw M(t)}return/^[+-]?[0-9]+$/.test(t)?{kind:"int",value:Number(t)}:{kind:"int",value:this.evaluateInt(t)}}renderNumericExpression(e){return In(pn(e)).map(t=>{if(t.t==="number")return t.literal;if(t.t==="identifier"){const n=this.state.variables.get(t.name);if(!n)throw Ie(t.name);return O(n)}return t.t}).join(" ").replaceAll("( ","(").replaceAll(" )",")").replaceAll(" . ",".").replaceAll("[ ","[").replaceAll(" ]","]")}}const zr=1e5;function yr(i,e,t){const n=new Et(i,t),s=[...e];for(let r=0;r<zr;r++){const{state:a}=n;if(a.inputRequest){const l=s.shift();if(l===void 0)return{outputs:[...a.outputLines],missingInput:!0};if(n.provideInput(l),a.inputErrorNotice)return{outputs:[...a.outputLines],error:a.inputErrorNotice};continue}if(a.isHalted)return{outputs:[...a.outputLines],error:a.notice};if(!n.canStep)return{outputs:[...a.outputLines],unusedInputs:s.length||void 0};n.step()}return{outputs:[...n.state.outputLines],tooManySteps:!0}}function vr(i,e){return i.length!==e.length?!1:i.every((t,n)=>yn(t)===yn(e[n]))}function yn(i){const e=i.trim().replace(/\s+/g," ");return/^-?\d+\.0+$/.test(e)?e.replace(/\.0+$/,""):e}function Sr(i,e,t){return e.map(n=>{const s=yr(i,n.inputs,t),r=!s.error&&!s.missingInput&&!s.tooManySteps&&vr(s.outputs,n.expected);return{test:n,result:s,passed:r}})}function kr(i){const e=new Set,t=n=>{for(const s of n){e.add(s.type),s.loopBody&&t(s.loopBody);for(const r of s.cases??[])t(r.elements)}};return t(i.elements),e}const _r=`---
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

## Erst die Struktur, dann der Code

Beim Programmieren passieren zwei Dinge gleichzeitig: Du musst dir den Ablauf überlegen und die Schreibweise der Programmiersprache beachten. Mit einem Struktogramm trennst du beides.

1. Du denkst zuerst über die **Logik** nach: Welche Schritte, welche Bedingungen, welche Wiederholungen?
2. Danach übersetzt du die fertige Struktur in **Java, Python oder JavaScript**. VisuStruct kann dir den Code sogar erzeugen.

Mit der **Simulation** kannst du dein Struktogramm außerdem Schritt für Schritt ausführen und prüfen, ob es wirklich tut, was es soll.

## Checkliste

::: checkliste
- Ich kann erklären, was ein Algorithmus ist. → Ein Algorithmus ist eine genaue Anleitung
- Ich weiß, dass ein Struktogramm von oben nach unten gelesen wird. → So liest du ein Struktogramm
- Ich kenne die drei Grundbausteine Sequenz, Verzweigung und Wiederholung. → Baustein 1: Die Sequenz
- Ich erkenne jeden Baustein im Struktogramm an seiner Form. → Alle drei zusammen
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
:::
`,Dr=`---
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
`,Mr=`---
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
`,Ar=`---
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
`,Zr=`---
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
`,Br=`---
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
- Ich kann das EVA-Prinzip erklären. → Das EVA-Prinzip
- Ich kann eine Eingabe mit Datentyp, Namen und Frage schreiben. → Eingabe mit input:
- Ich kann Text und Variablen in einer Ausgabe mit + verbinden. → Vorsicht mit + in der Ausgabe
- Ich rechne vor der Ausgabe in einer Variablen. → Vorsicht mit + in der Ausgabe
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
`,jr=`---
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
:::
`,Er=`---
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
`,Wr=`---
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
:::
`,Cr=`---
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
- Ich weiß, dass die While-Schleife ihre Bedingung vor jedem Durchlauf prüft. → Die Bedingung kommt zuerst
- Ich kann eine Zählvariable mit Startwert, Bedingung und Veränderung verwenden. → Eine Zählvariable
- Ich erkenne, wenn eine Schleife nie endet, und kann den Fehler beheben. → Vorsicht, Endlosschleife
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
`,Pr=`---
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
`,Lr=`---
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
`,Tr=`---
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
`,Nr=`---
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
:::
`,Hr=`---
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

> **In der Simulation:** Erreicht die Simulation einen Aufruf, sucht sie unter den offenen Reitern das Struktogramm mit diesem Titel und führt es aus. Danach macht sie im Hauptprogramm weiter. Solange das Unterprogramm läuft, bleibt der Aufruf-Kasten markiert. Hauptprogramm und Unterprogramme teilen sich dieselben Variablen. Gibt es keinen passenden Reiter, überspringt die Simulation den Aufruf und zeigt einen Hinweis.

## Übung: Aufruf einbauen

::: übung l15-titel
titel: Begrüßung mit Aufruf
auftrag: Stell dir vor, das Unterprogramm \`zeigeTitel()\` gibt es schon. Baue das Hauptprogramm: Es ruft zuerst \`zeigeTitel()\` auf. Danach fragt es nach dem Namen und gibt **Hallo** und den Namen aus.
  Bei der Eingabe Ada erscheint also **Hallo Ada**.
test: Ada -> Hallo Ada
test: Ben -> Hallo Ben
braucht: aufruf
tipp: Ziehe einen Aufruf aus dem Bereich Elemente ganz nach oben und schreibe \`zeigeTitel()\` hinein. Darunter kommen die Eingabe \`input: String name "Wie heißt du?"\` und die Ausgabe.
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

## Aussprung in der Simulation

Die Simulation führt den Aussprung aus wie \`break\`: Sie verlässt die innerste Schleife und macht nach ihr weiter. Steht ein Aussprung außerhalb jeder Schleife, endet das Unterprogramm, im Hauptprogramm das ganze Programm.

Oft geht es auch ganz ohne Aussprung: Du schreibst die Abbruchbedingung direkt in die Schleife. Das ist meist sogar übersichtlicher.

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
- Ich kann eine große Aufgabe in Teilprobleme zerlegen. → Große Aufgaben zerlegen
- Ich kann einen Aufruf einfügen und ein Unterprogramm in einem eigenen Reiter bauen. → Der Aufruf
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
:::
`,Vr=`---
titel: Simulation und Schreibtischtest
bereich: Vom Struktogramm zum Code
kurz: Ein Struktogramm Schritt für Schritt ausführen, von Hand nachrechnen und Fehler finden.
---

## Die Simulation starten

Mit [▶︎ Simulation](#zeige-simulation) in der Leiste führt VisuStruct dein Struktogramm aus. Solange die Simulation läuft, kannst du das Diagramm nicht bearbeiten. Mit **✎ Diagramm** an derselben Stelle kehrst du zum Bearbeiten zurück.

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

? Eine Schleife soll von 1 bis 5 zählen, läuft aber nur bis 4. Was ist der wahrscheinliche Fehler?
- [x] In der Bedingung steht i < 5 statt i <= 5.
- [ ] Die Schleife ist eine While-Schleife.
- [ ] Die Variable i heißt falsch.

? Im Feld Letzter Schritt steht \`zahl > 10 -> false\`. Was bedeutet das?
- [ ] Die Variable zahl hat den Wert false.
- [x] Die Bedingung zahl > 10 wurde geprüft und war falsch.
- [ ] Die Simulation hat einen Fehler gefunden.
:::
`,Gr=`---
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
`,Fr=`---
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
`,Rr=`Fachbegriffe für den Lernbereich. Kommt ein Begriff in einem Schritt vor, wird er dort einmal markiert und zeigt beim
Hovern oder Antippen seine Erklärung. Steht er im Schritt fett, wird er gerade erklärt und deshalb nicht markiert.
\`auch:\` nennt weitere Formen, die ebenfalls erkannt werden. Groß- und Kleinschreibung zählt.

### Algorithmus
auch: Algorithmen
Eine genaue Schritt-für-Schritt-Anleitung, mit der man eine Aufgabe löst. Jeder Schritt ist eindeutig.

### Struktogramm
auch: Struktogramme, Struktogramms, Struktogrammen
Ein Algorithmus als Bild aus Kästen. Es wird von oben nach unten gelesen.

### Anweisung
auch: Anweisungen
Ein einzelner Schritt im Struktogramm, zum Beispiel eine Rechnung, eine Eingabe oder eine Ausgabe.

### Sequenz
auch: Sequenzen
Schritte, die nacheinander von oben nach unten ausgeführt werden, jeder genau einmal.

### Verzweigung
auch: Verzweigungen
Ein Baustein, der mit einer Bedingung entscheidet, welcher von zwei Wegen ausgeführt wird.

### Zweig
auch: Zweige, Zweigen
Einer der beiden Wege einer Verzweigung: links für true, rechts für false.

### Schleife
auch: Schleifen, Wiederholung, Wiederholungen
Ein Baustein, der Schritte wiederholt, solange eine Bedingung gilt.

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

### Vergleichsoperator
auch: Vergleichsoperatoren
Ein Zeichen, das zwei Werte vergleicht, zum Beispiel == oder <. Das Ergebnis ist true oder false.

### Fallauswahl
Ein Baustein, der je nach Wert einer Variablen genau einen von mehreren Fällen ausführt.

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
Eine Reihe von Fächern mit einem gemeinsamen Namen und demselben Datentyp.

### Index
Die Nummer eines Fachs in einem Array. Gezählt wird ab 0.

### Unterprogramm
auch: Unterprogramme, Unterprogramms, Unterprogrammen
Ein eigenes Struktogramm für eine Teilaufgabe. Es wird mit einem Aufruf ausgeführt.

### Aussprung
Verlässt sofort die Schleife, in der er steht. Danach geht es unter der Schleife weiter.

### Schreibtischtest
auch: Schreibtischtests
Du führst ein Struktogramm auf Papier aus und notierst nach jedem Schritt die Werte der Variablen.
`,$r=`### Anweisung

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
`,Ur=`---
titel: Alter im Unterprogramm
nach: 15
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
tipp: Öffne die Übung im Editor und baue dort das Hauptprogramm mit dem Aufruf \`pruefeAlter()\`. Lege dann mit **+** einen neuen Reiter an und gib ihm den Titel \`pruefeAlter\`. Darin baust du die Eingabe und die Verzweigung. Prüfen findet das Unterprogramm über den Titel des Reiters.
lösung: aufgabe-alter-haupt-loesung.visustruct
unterprogramm: aufgabe-alter-unterprogramm-loesung.visustruct
:::
`,Or=`---
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
`,Xr=`---
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
`,Yr=`---
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
`,Jr=`---
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
`,Kr=`---
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
`,Qr=`---
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
`,qr=`---
titel: Speisekarte
nach: 9
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
tipp: Lies die Nummer mit \`input: int nummer "Welches Gericht?"\` ein. Die Fallauswahl prüft \`nummer\`, die Fälle heißen \`1\`, \`2\` und \`3\`. Alle anderen Nummern landen im Fall \`default\`.
lösung: aufgabe-speisekarte-loesung.visustruct
:::
`,e1=`---
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
`,t1=`---
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
`,n1='---\ntitel: Taschenrechner\nnach: 9\nstufe: 2\n---\n\nEin kleiner Taschenrechner: zwei Zahlen und ein Rechenzeichen eingeben, das Ergebnis erscheint.\n\n::: übung aufgabe-rechner\ntitel: Taschenrechner\nauftrag: Frage nach zwei ganzen Zahlen und danach nach einem Rechenzeichen als Text: `+`, `-` oder `*`. Gib das Ergebnis aus. Bei einem anderen Zeichen gib **Unbekanntes Rechenzeichen** aus.\ntest: 3, 4, + -> 7\ntest: 10, 4, - -> 6\ntest: 6, 7, * -> 42\ntest: 1, 2, x -> Unbekanntes Rechenzeichen\nbraucht: fallauswahl\ntipp: Das Rechenzeichen liest du mit `input: String zeichen "Rechenzeichen"` ein. Die Fallauswahl prüft `zeichen`, die Fälle heißen `"+"`, `"-"` und `"*"`, der letzte Fall ist `default`. Rechne in jedem Fall erst in einer Variablen und gib sie dann aus, sonst hängt `+` die Zahlen nur aneinander.\nlösung: aufgabe-rechner-loesung.visustruct\n:::\n',i1=`---
titel: Verleih-Menü
nach: 15
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
tipp: Nimm eine Endlosschleife. Darin steht zuerst die Eingabe \`input: int wahl "1 = E-Bike, 2 = E-Scooter, 0 = Ende"\`, danach eine Fallauswahl über \`wahl\` mit den Fällen \`0\`, \`1\`, \`2\` und \`default\`. Im Fall \`0\` stehen die Ausgabe und darunter der Aussprung.
lösung: aufgabe-verleih-loesung.visustruct
:::
`,s1=`---
titel: Volljährig?
nach: 7
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
tipp: Lies das Alter mit \`input: int alter "Wie alt bist du?"\` ein. Die Bedingung der Verzweigung lautet \`alter >= 18\`. Achte darauf, dass 18 schon volljährig ist.
lösung: aufgabe-volljaehrig-loesung.visustruct
:::
`,r1=`---
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
`,a1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,l1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,o1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,u1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,c1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,d1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,h1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,m1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,g1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,p1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,f1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,b1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,x1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,I1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,w1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,z1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,y1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,v1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,S1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,k1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,_1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,D1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,M1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,A1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Z1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,B1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,j1=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;101;107;117;110;100;101;110;32;117;109;114;101;99;104;110;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;101;107;117;110;100;101;110;32;61;32;50;48;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;109;105;110;117;116;101;110;32;43;32;34;32;77;105;110;117;116;101;110;32;117;110;100;32;34;32;43;32;114;101;115;116;32;43;32;34;32;83;101;107;117;110;100;101;110;34;</text>
  </strelem>
</struktogramm>
`,E1=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;101;103;114;252;223;117;110;103;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;83;116;114;105;110;103;32;110;97;109;101;32;34;87;105;101;32;104;101;105;223;116;32;100;117;63;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;97;108;108;111;32;34;32;43;32;110;97;109;101;32;43;32;34;33;34;</text>
  </strelem>
</struktogramm>
`,W1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,C1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,P1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,L1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,T1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,N1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,H1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,V1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,G1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,F1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,R1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,$1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,U1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,O1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,X1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Y1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,J1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,K1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Q1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,q1=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ea=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ta=`<?xml version="1.0" encoding="UTF-8"?>
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
`,na=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ia=`<?xml version="1.0" encoding="UTF-8"?>
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
`,sa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ra=`<?xml version="1.0" encoding="UTF-8"?>
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
`,aa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,la=`<?xml version="1.0" encoding="UTF-8"?>
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
`,oa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ua=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ca=`<?xml version="1.0" encoding="UTF-8"?>
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
`,da=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ha=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ma=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ga=`<?xml version="1.0" encoding="UTF-8"?>
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
`,pa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,fa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ba=`<?xml version="1.0" encoding="UTF-8"?>
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
`,xa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ia=`<?xml version="1.0" encoding="UTF-8"?>
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
`,wa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,za=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ya=`<?xml version="1.0" encoding="UTF-8"?>
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
`,va=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Sa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ka=`<?xml version="1.0" encoding="UTF-8"?>
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
`,_a=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Da=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ma=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Aa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Za=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="122;101;105;103;101;66;101;103;114;117;101;115;115;117;110;103;40;41;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;87;105;108;108;107;111;109;109;101;110;32;122;117;109;32;81;117;105;122;33;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;68;117;32;98;101;107;111;109;109;115;116;32;100;114;101;105;32;70;114;97;103;101;110;46;34;</text>
  </strelem>
</struktogramm>
`,Ba=`<?xml version="1.0" encoding="UTF-8"?>
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
`,ja=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ea=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Wa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ca=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Pa=`<?xml version="1.0" encoding="UTF-8"?>
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
`,La=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ta=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Na=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ha=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Va=`<?xml version="1.0" encoding="UTF-8"?>
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
`,Ga=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;101;103;114;252;223;117;110;103;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;71;117;116;101;110;32;77;111;114;103;101;110;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;101;117;116;101;32;108;101;114;110;101;110;32;119;105;114;32;83;116;114;117;107;116;111;103;114;97;109;109;101;46;34;</text>
  </strelem>
</struktogramm>
`,Fa=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="72;97;108;108;111;32;87;101;108;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;97;108;108;111;32;87;101;108;116;34;</text>
  </strelem>
</struktogramm>
`,Ra=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="90;119;101;105;32;90;101;105;108;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;97;108;108;111;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;73;99;104;32;108;101;114;110;101;32;83;116;114;117;107;116;111;103;114;97;109;109;101;34;</text>
  </strelem>
</struktogramm>
`,$a=""+new URL("ben-shneiderman-Cev5hrqS.jpg",import.meta.url).href,Ua=""+new URL("ike-nassi-D2w47gvX.jpg",import.meta.url).href,Oa="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMTkwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE5MCIgZmlsbD0iI2ZmZmZmZiIvPgogIDx0ZXh0IHg9IjIwIiB5PSIyNCIgZm9udC13ZWlnaHQ9IjYwMCI+V29oaW4gbGFuZGV0IGRhcyBFbGVtZW50PzwvdGV4dD4KICA8cmVjdCB4PSIyMCIgeT0iNDAiIHdpZHRoPSIxOTAiIGhlaWdodD0iMzUiIGZpbGw9IiNkYmVhZmUiLz4KICA8cmVjdCB4PSIyMCIgeT0iNzUiIHdpZHRoPSIxOTAiIGhlaWdodD0iMzUiIGZpbGw9IiNkY2ZjZTciLz4KICA8bGluZSB4MT0iMjAiIHkxPSI3NSIgeDI9IjIxMCIgeTI9Ijc1IiBzdHJva2U9IiM2ZTZlNzMiIHN0cm9rZS1kYXNoYXJyYXk9IjQgMyIvPgogIDxyZWN0IHg9IjIwIiB5PSI0MCIgd2lkdGg9IjE5MCIgaGVpZ2h0PSI3MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIxMTUiIHk9IjYyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMWQ0ZWQ4Ij5vYmVyZSBIw6RsZnRlPC90ZXh0PgogIDx0ZXh0IHg9IjExNSIgeT0iOTciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxNTgwM2QiPnVudGVyZSBIw6RsZnRlPC90ZXh0PgogIDx0ZXh0IHg9IjIyNCIgeT0iNjIiPuKGkiBrb21tdCA8dHNwYW4gZm9udC13ZWlnaHQ9IjYwMCI+ZGF2b3I8L3RzcGFuPjwvdGV4dD4KICA8dGV4dCB4PSIyMjQiIHk9Ijk3Ij7ihpIga29tbXQgPHRzcGFuIGZvbnQtd2VpZ2h0PSI2MDAiPmRhaGludGVyPC90c3Bhbj48L3RleHQ+CiAgPHJlY3QgeD0iMjAiIHk9IjEzMiIgd2lkdGg9IjE5MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2ZlZjNjNyIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIxMTUiIHk9IjE1NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNiI+w7g8L3RleHQ+CiAgPHRleHQgeD0iMjI0IiB5PSIxNTciPuKGkiA8dHNwYW4gZm9udC13ZWlnaHQ9IjYwMCI+ZXJzZXR6dDwvdHNwYW4+IGRlbiBQbGF0emhhbHRlcjwvdGV4dD4KPC9zdmc+Cg==",Xa="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjEwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIxMCIgZmlsbD0iI2ZmZmZmZiIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJ1aS1tb25vc3BhY2UsIE1lbmxvLCBDb25zb2xhcywgbW9ub3NwYWNlIiBmb250LXNpemU9IjE2Ij5pbnQgYWx0ZXIgPSAxNDwvdGV4dD4KICA8cGF0aCBkPSJNMTMwIDcwIEwxNzAgNTAgTDMwMCA1MCBMMjYwIDcwIFoiIGZpbGw9IiNjOThhM2MiIHN0cm9rZT0iIzhhNWExZiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHJlY3QgeD0iMTgwIiB5PSIzNCIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjUwIiByeD0iMyIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjNmU2ZTczIiBzdHJva2Utd2lkdGg9IjEuNSIvPgogIDx0ZXh0IHg9IjIwMiIgeT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSI3MDAiPjE0PC90ZXh0PgogIDxyZWN0IHg9IjEzMCIgeT0iNzAiIHdpZHRoPSIxMzAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZTliODcyIiBzdHJva2U9IiM4YTVhMWYiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxwYXRoIGQ9Ik0yNjAgNzAgTDMwMCA1MCBMMzAwIDE1MCBMMjYwIDE3MCBaIiBmaWxsPSIjZDQ5YTRjIiBzdHJva2U9IiM4YTVhMWYiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxyZWN0IHg9IjE1MCIgeT0iMTAwIiB3aWR0aD0iOTAiIGhlaWdodD0iMzAiIHJ4PSI0IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiM4YTVhMWYiLz4KICA8dGV4dCB4PSIxOTUiIHk9IjEyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+YWx0ZXI8L3RleHQ+CiAgPHJlY3QgeD0iMTM4IiB5PSIxNDIiIHdpZHRoPSIzNCIgaGVpZ2h0PSIyMCIgcng9IjEwIiBmaWxsPSIjMDA3YWZmIi8+CiAgPHRleHQgeD0iMTU1IiB5PSIxNTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmZmZmZmYiIGZvbnQtd2VpZ2h0PSI2MDAiPmludDwvdGV4dD4KICA8ZyBzdHJva2U9IiM2ZTZlNzMiPgogICAgPGxpbmUgeDE9IjMxMCIgeTE9IjQ4IiB4Mj0iMjI2IiB5Mj0iNTIiLz4KICAgIDxsaW5lIHgxPSIzMTAiIHkxPSIxMTUiIHgyPSIyNDIiIHkyPSIxMTUiLz4KICAgIDxsaW5lIHgxPSI4MCIgeTE9IjE1MiIgeDI9IjEzNCIgeTI9IjE1MiIvPgogIDwvZz4KICA8dGV4dCB4PSIzMTYiIHk9IjUyIj5XZXJ0PC90ZXh0PgogIDx0ZXh0IHg9IjMxNiIgeT0iMTE5Ij5OYW1lPC90ZXh0PgogIDx0ZXh0IHg9IjgiIHk9IjE1NiI+RGF0ZW50eXA8L3RleHQ+CiAgPHRleHQgeD0iMjAwIiB5PSIxOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2ZTZlNzMiPsOcYmVyIGRlbiBOYW1lbiBrb21tc3QgZHUgYW4gZGVuIFdlcnQuPC90ZXh0Pgo8L3N2Zz4K",Ya="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjAwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMDA3YWZmIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPGcgZm9udC1mYW1pbHk9InVpLW1vbm9zcGFjZSwgTWVubG8sIENvbnNvbGFzLCBtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjAiPgogICAgPHRleHQgeD0iNjAiIHk9IjExMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjcwMCI+cHVua3RlPC90ZXh0PgogICAgPHRleHQgeD0iMTI1IiB5PSIxMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMDdhZmYiIGZvbnQtd2VpZ2h0PSI3MDAiPj08L3RleHQ+CiAgICA8dGV4dCB4PSIyNjAiIHk9IjExMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+cHVua3RlICsgNTwvdGV4dD4KICA8L2c+CiAgPHJlY3QgeD0iMTgwIiB5PSI4NiIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzNCIgcng9IjYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzE1ODAzZCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMjYwIiB5PSIxNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxNTgwM2QiPuKRoCByZWNodHMgYXVzcmVjaG5lbjogMTAgKyA1ID0gMTU8L3RleHQ+CiAgPHBhdGggZD0iTTI1MCA4MiBDMjMwIDMwLCA5MCAzMCwgNjQgODQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwN2FmZiIgc3Ryb2tlLXdpZHRoPSIyLjUiIG1hcmtlci1lbmQ9InVybCgjYSkiLz4KICA8dGV4dCB4PSIxNjAiIHk9IjM2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDA3YWZmIj7ikaEgRXJnZWJuaXMgbGlua3Mgc3BlaWNoZXJuPC90ZXh0PgogIDxyZWN0IHg9IjIwIiB5PSIxNjQiIHdpZHRoPSIzNjAiIGhlaWdodD0iMjYiIHJ4PSI2IiBmaWxsPSIjZjJmMmY3Ii8+CiAgPHRleHQgeD0iMjAwIiB5PSIxODIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPnB1bmt0ZSB2b3JoZXI6IDx0c3BhbiBmb250LXdlaWdodD0iNzAwIj4xMDwvdHNwYW4+ICAg4oaSICAgcHVua3RlIG5hY2hoZXI6IDx0c3BhbiBmb250LXdlaWdodD0iNzAwIj4xNTwvdHNwYW4+PC90ZXh0Pgo8L3N2Zz4K",Ja="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjYwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjYwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPGcgc3Ryb2tlPSIjNmU2ZTczIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiPgogICAgPHBhdGggZD0iTTQwIDExMCBMNDggMTgwIEwxMDIgMTgwIEwxMTAgMTEwIi8+CiAgICA8cGF0aCBkPSJNMTY1IDExMCBMMTczIDE4MCBMMjI3IDE4MCBMMjM1IDExMCIvPgogICAgPHBhdGggZD0iTTI5MCAxMTAgTDI5OCAxODAgTDM1MiAxODAgTDM2MCAxMTAiLz4KICA8L2c+CiAgPHBhdGggZD0iTTQ0IDEzNSBMNDggMTgwIEwxMDIgMTgwIEwxMDYgMTM1IFoiIGZpbGw9IiNmZGJhNzQiLz4KICA8cGF0aCBkPSJNMjk0IDEzNSBMMjk4IDE4MCBMMzUyIDE4MCBMMzU2IDEzNSBaIiBmaWxsPSIjOTNjNWZkIi8+CiAgPHRleHQgeD0iNzUiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+bGlua3M8L3RleHQ+CiAgPHRleHQgeD0iNzUiIHk9IjIxNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+U2FmdDwvdGV4dD4KICA8dGV4dCB4PSIyMDAiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+aGlsZjwvdGV4dD4KICA8dGV4dCB4PSIyMDAiIHk9IjIxNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+bGVlcjwvdGV4dD4KICA8dGV4dCB4PSIzMjUiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+cmVjaHRzPC90ZXh0PgogIDx0ZXh0IHg9IjMyNSIgeT0iMjE3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5XYXNzZXI8L3RleHQ+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjEuOCIgbWFya2VyLWVuZD0idXJsKCNhKSI+CiAgICA8cGF0aCBkPSJNODggMTA0IEMxMTAgNzAsIDE2MCA3MCwgMTg2IDEwNCIvPgogICAgPHBhdGggZD0iTTMxOCAxMDQgQzI3MCAxNSwgMTMwIDE1LCA4MiAxMDQiLz4KICAgIDxwYXRoIGQ9Ik0yMTQgMTA0IEMyNDAgNzAsIDI5MCA3MCwgMzEyIDEwNCIvPgogIDwvZz4KICA8ZyBmb250LXdlaWdodD0iNzAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4KICAgIDxjaXJjbGUgY3g9IjEzNyIgY3k9IjgwIiByPSIxMSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMWMxYzFlIi8+PHRleHQgeD0iMTM3IiB5PSI4NSI+MTwvdGV4dD4KICAgIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjM4IiByPSIxMSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMWMxYzFlIi8+PHRleHQgeD0iMjAwIiB5PSI0MyI+MjwvdGV4dD4KICAgIDxjaXJjbGUgY3g9IjI2MyIgY3k9IjgwIiByPSIxMSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMWMxYzFlIi8+PHRleHQgeD0iMjYzIiB5PSI4NSI+MzwvdGV4dD4KICA8L2c+CiAgPGcgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InVpLW1vbm9zcGFjZSwgTWVubG8sIENvbnNvbGFzLCBtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTIiPgogICAgPHRleHQgeD0iNzAiIHk9IjI0NyI+MTogaGlsZiA9IGxpbmtzPC90ZXh0PgogICAgPHRleHQgeD0iMjAwIiB5PSIyNDciPjI6IGxpbmtzID0gcmVjaHRzPC90ZXh0PgogICAgPHRleHQgeD0iMzMwIiB5PSIyNDciPjM6IHJlY2h0cyA9IGhpbGY8L3RleHQ+CiAgPC9nPgo8L3N2Zz4K",Ka="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMTUwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2ZmZmZmZiIvPgogIDxyZWN0IHg9IjIwIiB5PSI1MCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjZmVlMmUyIi8+PHJlY3QgeD0iMzEwIiB5PSI1MCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjZmVlMmUyIi8+CiAgPHJlY3QgeD0iOTAiIHk9IjUwIiB3aWR0aD0iMjIwIiBoZWlnaHQ9IjI0IiBmaWxsPSIjZGNmY2U3Ii8+CiAgPGxpbmUgeDE9IjIwIiB5MT0iNzQiIHgyPSIzODAiIHkyPSI3NCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8bGluZSB4MT0iNDYiIHkxPSI2OCIgeDI9IjQ2IiB5Mj0iODAiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNDYiIHk9Ijk4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4wPC90ZXh0PgogIDxsaW5lIHgxPSI5MCIgeTE9IjY4IiB4Mj0iOTAiIHkyPSI4MCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI5MCIgeT0iOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjE8L3RleHQ+CiAgPGxpbmUgeDE9IjEzNCIgeTE9IjY4IiB4Mj0iMTM0IiB5Mj0iODAiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMTM0IiB5PSI5OCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MjwvdGV4dD4KICA8bGluZSB4MT0iMTc4IiB5MT0iNjgiIHgyPSIxNzgiIHkyPSI4MCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIxNzgiIHk9Ijk4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4zPC90ZXh0PgogIDxsaW5lIHgxPSIyMjIiIHkxPSI2OCIgeDI9IjIyMiIgeTI9IjgwIiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjIyMiIgeT0iOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjQ8L3RleHQ+CiAgPGxpbmUgeDE9IjI2NiIgeTE9IjY4IiB4Mj0iMjY2IiB5Mj0iODAiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMjY2IiB5PSI5OCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+NTwvdGV4dD4KICA8bGluZSB4MT0iMzEwIiB5MT0iNjgiIHgyPSIzMTAiIHkyPSI4MCIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIzMTAiIHk9Ijk4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj42PC90ZXh0PgogIDxsaW5lIHgxPSIzNTQiIHkxPSI2OCIgeDI9IjM1NCIgeTI9IjgwIiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjM1NCIgeT0iOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjc8L3RleHQ+CiAgPGNpcmNsZSBjeD0iOTAiIGN5PSI3NCIgcj0iNiIgZmlsbD0iIzE1ODAzZCIvPjxjaXJjbGUgY3g9IjMxMCIgY3k9Ijc0IiByPSI2IiBmaWxsPSIjMTU4MDNkIi8+CiAgPHRleHQgeD0iMjAwIiB5PSI0MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzE1ODAzZCIgZm9udC13ZWlnaHQ9IjYwMCI+Z8O8bHRpZzwvdGV4dD4KICA8dGV4dCB4PSI0MCIgeT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNiOTFjMWMiIGZvbnQtd2VpZ2h0PSI2MDAiPnVuZ8O8bHRpZzwvdGV4dD48dGV4dCB4PSIzNjAiIHk9IjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYjkxYzFjIiBmb250LXdlaWdodD0iNjAwIj51bmfDvGx0aWc8L3RleHQ+CiAgPGcgZm9udC1mYW1pbHk9InVpLW1vbm9zcGFjZSwgTWVubG8sIENvbnNvbGFzLCBtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPgogICAgPHRleHQgeD0iMjAwIiB5PSIxMjQiIGZpbGw9IiMxNTgwM2QiPm5vdGUgJmd0Oz0gMSAmYW1wOyZhbXA7IG5vdGUgJmx0Oz0gNjwvdGV4dD4KICAgIDx0ZXh0IHg9IjIwMCIgeT0iMTQyIiBmaWxsPSIjYjkxYzFjIj5ub3RlICZsdDsgMSB8fCBub3RlICZndDsgNjwvdGV4dD4KICA8L2c+Cjwvc3ZnPgo=",Qa="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjMwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjMwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHRleHQgeD0iMjAiIHk9IjI0IiBmb250LXdlaWdodD0iNjAwIj5BYmxhdWYgZGVyIFdoaWxlLVNjaGxlaWZlPC90ZXh0PgogIDxyZWN0IHg9IjEyMCIgeT0iNDQiIHdpZHRoPSIxNjAiIGhlaWdodD0iNDAiIHJ4PSIyMCIgZmlsbD0iI2ZlZjNjNyIgc3Ryb2tlPSIjYjQ1MzA5IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjY5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ikaAgQmVkaW5ndW5nIHByw7xmZW48L3RleHQ+CiAgPHJlY3QgeD0iMTIwIiB5PSIxMjgiIHdpZHRoPSIxNjAiIGhlaWdodD0iNDAiIHJ4PSI2IiBmaWxsPSIjZGJlYWZlIiBzdHJva2U9IiMxZDRlZDgiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTUzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ikaEgSW5oYWx0IGF1c2bDvGhyZW48L3RleHQ+CiAgPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjEuOCIgbWFya2VyLWVuZD0idXJsKCNhKSI+CiAgICA8bGluZSB4MT0iMjAwIiB5MT0iODQiIHgyPSIyMDAiIHkyPSIxMjYiLz4KICAgIDxwYXRoIGQ9Ik0xMjAgMTQ4IEM4MCAxNDgsIDgwIDY0LCAxMTggNjQiLz4KICAgIDxwYXRoIGQ9Ik0yODAgNjQgTDM0MCA2NCBMMzQwIDIwMCBMMjgyIDIwMCIvPgogIDwvZz4KICA8dGV4dCB4PSIyMDgiIHk9IjExMCIgZmlsbD0iIzE1ODAzZCIgZm9udC13ZWlnaHQ9IjYwMCI+dHJ1ZTwvdGV4dD4KICA8dGV4dCB4PSIzOCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj53aWVkZXI8L3RleHQ+CiAgPHRleHQgeD0iMzgiIHk9IjEyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+bmFjaCBvYmVuPC90ZXh0PgogIDx0ZXh0IHg9IjM0OCIgeT0iMTM0IiBmaWxsPSIjYjkxYzFjIiBmb250LXdlaWdodD0iNjAwIj5mYWxzZTwvdGV4dD4KICA8dGV4dCB4PSIyNzYiIHk9IjIwNSIgdGV4dC1hbmNob3I9ImVuZCI+d2VpdGVyIHVudGVyIGRlciBTY2hsZWlmZTwvdGV4dD4KPC9zdmc+Cg==",qa="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjMwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjMwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHRleHQgeD0iMTAwIiB5PSIyMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9IjYwMCI+a29wZmdlc3RldWVydCAoV2hpbGUpPC90ZXh0PgogIDx0ZXh0IHg9IjMwMCIgeT0iMjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSI2MDAiPmZ1w59nZXN0ZXVlcnQgKERvLXdoaWxlKTwvdGV4dD4KICA8bGluZSB4MT0iMjAwIiB5MT0iMTAiIHgyPSIyMDAiIHkyPSIyMjAiIHN0cm9rZT0iI2QxZDFkNiIvPgogIDxyZWN0IHg9IjM1IiB5PSI0NCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjE4IiBmaWxsPSIjZmVmM2M3IiBzdHJva2U9IiNiNDUzMDkiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNjciIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKRoCBCZWRpbmd1bmc8L3RleHQ+CiAgPHJlY3QgeD0iMzUiIHk9IjEyNCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjYiIGZpbGw9IiNkYmVhZmUiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMTAwIiB5PSIxNDciIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKRoSBJbmhhbHQ8L3RleHQ+CiAgPHJlY3QgeD0iMjM1IiB5PSI0NCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjYiIGZpbGw9IiNkYmVhZmUiIHN0cm9rZT0iIzFkNGVkOCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMzAwIiB5PSI2NyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGgIEluaGFsdDwvdGV4dD4KICA8cmVjdCB4PSIyMzUiIHk9IjEyNCIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIzNiIgcng9IjE4IiBmaWxsPSIjZmVmM2M3IiBzdHJva2U9IiNiNDUzMDkiIHN0cm9rZS13aWR0aD0iMiIvPgogIDx0ZXh0IHg9IjMwMCIgeT0iMTQ3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ikaEgQmVkaW5ndW5nPC90ZXh0PgogIDxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIxLjYiIG1hcmtlci1lbmQ9InVybCgjYSkiPgogICAgPGxpbmUgeDE9IjEwMCIgeTE9IjgwIiB4Mj0iMTAwIiB5Mj0iMTIyIi8+CiAgICA8cGF0aCBkPSJNMzUgMTQyIEM4IDE0MiwgOCA2MiwgMzMgNjIiLz4KICAgIDxsaW5lIHgxPSIzMDAiIHkxPSI4MCIgeDI9IjMwMCIgeTI9IjEyMiIvPgogICAgPHBhdGggZD0iTTM2NSAxNDIgQzM5MiAxNDIsIDM5MiA2MiwgMzY3IDYyIi8+CiAgPC9nPgogIDx0ZXh0IHg9IjEwNiIgeT0iMTA2IiBmaWxsPSIjMTU4MDNkIiBmb250LXdlaWdodD0iNjAwIj50cnVlPC90ZXh0PgogIDx0ZXh0IHg9IjM4MCIgeT0iMTA2IiB0ZXh0LWFuY2hvcj0iZW5kIiBmaWxsPSIjMTU4MDNkIiBmb250LXdlaWdodD0iNjAwIj50cnVlPC90ZXh0PgogIDx0ZXh0IHg9IjEwMCIgeT0iMTkwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5Jc3QgZGllIEJlZGluZ3VuZyBnbGVpY2ggZmFsc2UsPC90ZXh0PgogIDx0ZXh0IHg9IjEwMCIgeT0iMjA2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5sw6R1ZnQgZGVyIEluaGFsdCA8dHNwYW4gZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iIzFjMWMxZSI+bmllPC90c3Bhbj4uPC90ZXh0PgogIDx0ZXh0IHg9IjMwMCIgeT0iMTkwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj5EZXIgSW5oYWx0IGzDpHVmdCBpbW1lcjwvdGV4dD4KICA8dGV4dCB4PSIzMDAiIHk9IjIwNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+PHRzcGFuIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiMxYzFjMWUiPm1pbmRlc3RlbnMgZWlubWFsPC90c3Bhbj4uPC90ZXh0Pgo8L3N2Zz4K",el="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjUwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMWMxYzFlIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHJlY3QgeD0iMTIwIiB5PSIxNCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIzNCIgcng9IjYiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzZlNmU3MyIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMjAwIiB5PSIzNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGgIFN0YXJ0IDx0c3BhbiBmaWxsPSIjNmU2ZTczIj4obnVyIGVpbm1hbCk8L3RzcGFuPjwvdGV4dD4KICA8cmVjdCB4PSIxMjAiIHk9Ijc2IiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjM0IiByeD0iMTciIGZpbGw9IiNmZWYzYzciIHN0cm9rZT0iI2I0NTMwOSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMjAwIiB5PSI5OCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGhIEJlZGluZ3VuZyBwcsO8ZmVuPC90ZXh0PgogIDxyZWN0IHg9IjEyMCIgeT0iMTM4IiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjM0IiByeD0iNiIgZmlsbD0iI2RiZWFmZSIgc3Ryb2tlPSIjMWQ0ZWQ4IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjE2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGiIEluaGFsdCBhdXNmw7xocmVuPC90ZXh0PgogIDxyZWN0IHg9IjEyMCIgeT0iMjAwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjM0IiByeD0iNiIgZmlsbD0iI2RjZmNlNyIgc3Ryb2tlPSIjMTU4MDNkIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8dGV4dCB4PSIyMDAiIHk9IjIyMiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pGjIFNjaHJpdHQsIHouIEIuIGkrKzwvdGV4dD4KICA8ZyBmaWxsPSJub25lIiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMS44IiBtYXJrZXItZW5kPSJ1cmwoI2EpIj4KICAgIDxsaW5lIHgxPSIyMDAiIHkxPSI0OCIgeDI9IjIwMCIgeTI9Ijc0Ii8+CiAgICA8bGluZSB4MT0iMjAwIiB5MT0iMTEwIiB4Mj0iMjAwIiB5Mj0iMTM2Ii8+CiAgICA8bGluZSB4MT0iMjAwIiB5MT0iMTcyIiB4Mj0iMjAwIiB5Mj0iMTk4Ii8+CiAgICA8cGF0aCBkPSJNMTIwIDIxNyBDNjAgMjE3LCA2MCA5MywgMTE4IDkzIi8+CiAgICA8cGF0aCBkPSJNMjgwIDkzIEwzMzAgOTMiLz4KICA8L2c+CiAgPHRleHQgeD0iMjA4IiB5PSIxMjkiIGZpbGw9IiMxNTgwM2QiIGZvbnQtd2VpZ2h0PSI2MDAiPnRydWU8L3RleHQ+CiAgPHRleHQgeD0iNDgiIHk9IjE2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+enVyw7xjazwvdGV4dD4KICA8dGV4dCB4PSI0OCIgeT0iMTc2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmU2ZTczIj56dSDikaE8L3RleHQ+CiAgPHRleHQgeD0iMzAwIiB5PSI4NCIgZmlsbD0iI2I5MWMxYyIgZm9udC13ZWlnaHQ9IjYwMCI+ZmFsc2U8L3RleHQ+CiAgPHRleHQgeD0iMzM2IiB5PSI5OCI+ZmVydGlnPC90ZXh0Pgo8L3N2Zz4K",tl="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMTkwIiBmb250LWZhbWlseT0ic3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMWMxYzFlIj4KICA8ZGVmcz48bWFya2VyIGlkPSJhIiB2aWV3Qm94PSIwIDAgMTAgMTAiIHJlZlg9IjkiIHJlZlk9IjUiIG1hcmtlcldpZHRoPSI3IiBtYXJrZXJIZWlnaHQ9IjciIG9yaWVudD0iYXV0byI+PHBhdGggZD0iTTAgMCBMMTAgNSBMMCAxMCBaIiBmaWxsPSIjMDA3YWZmIi8+PC9tYXJrZXI+PC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMTkwIiBmaWxsPSIjZmZmZmZmIi8+CiAgPHRleHQgeD0iMjAiIHk9IjI0IiBmb250LWZhbWlseT0idWktbW9ub3NwYWNlLCBNZW5sbywgQ29uc29sYXMsIG1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCI+aW50W10gemFobGVuID0gezIsIDQsIDYsIDgsIDEwfTwvdGV4dD4KICA8dGV4dCB4PSIyMCIgeT0iNTQiIGZpbGw9IiM2ZTZlNzMiIGZvbnQtc2l6ZT0iMTIiPkluZGV4PC90ZXh0PgogIDx0ZXh0IHg9IjkwIiB5PSI1NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwN2FmZiIgZm9udC13ZWlnaHQ9IjcwMCI+MDwvdGV4dD48cmVjdCB4PSI2MCIgeT0iNjIiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0NiIgZmlsbD0iI2YyZjJmNyIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI5MCIgeT0iOTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI2MDAiPjI8L3RleHQ+CiAgPHRleHQgeD0iMTUwIiB5PSI1NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwN2FmZiIgZm9udC13ZWlnaHQ9IjcwMCI+MTwvdGV4dD48cmVjdCB4PSIxMjAiIHk9IjYyIiB3aWR0aD0iNjAiIGhlaWdodD0iNDYiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMTUwIiB5PSI5MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9IjYwMCI+NDwvdGV4dD4KICA8dGV4dCB4PSIyMTAiIHk9IjU0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMDA3YWZmIiBmb250LXdlaWdodD0iNzAwIj4yPC90ZXh0PjxyZWN0IHg9IjE4MCIgeT0iNjIiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0NiIgZmlsbD0iI2YyZjJmNyIgc3Ryb2tlPSIjMWMxYzFlIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIyMTAiIHk9IjkyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iNjAwIj42PC90ZXh0PgogIDx0ZXh0IHg9IjI3MCIgeT0iNTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMwMDdhZmYiIGZvbnQtd2VpZ2h0PSI3MDAiPjM8L3RleHQ+PHJlY3QgeD0iMjQwIiB5PSI2MiIgd2lkdGg9IjYwIiBoZWlnaHQ9IjQ2IiBmaWxsPSIjZjJmMmY3IiBzdHJva2U9IiMxYzFjMWUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjI3MCIgeT0iOTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI2MDAiPjg8L3RleHQ+CiAgPHRleHQgeD0iMzMwIiB5PSI1NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwN2FmZiIgZm9udC13ZWlnaHQ9IjcwMCI+NDwvdGV4dD48cmVjdCB4PSIzMDAiIHk9IjYyIiB3aWR0aD0iNjAiIGhlaWdodD0iNDYiIGZpbGw9IiNmMmYyZjciIHN0cm9rZT0iIzFjMWMxZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMzMwIiB5PSI5MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9IjYwMCI+MTA8L3RleHQ+CiAgPHRleHQgeD0iMjAiIHk9IjkwIiBmaWxsPSIjNmU2ZTczIiBmb250LXNpemU9IjEyIj5XZXJ0PC90ZXh0PgogIDxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwN2FmZiIgc3Ryb2tlLXdpZHRoPSIxLjgiIG1hcmtlci1lbmQ9InVybCgjYSkiPjxsaW5lIHgxPSI5MCIgeTE9IjE0MCIgeDI9IjkwIiB5Mj0iMTEyIi8+PGxpbmUgeDE9IjMzMCIgeTE9IjE0MCIgeDI9IjMzMCIgeTI9IjExMiIvPjwvZz4KICA8ZyBmb250LWZhbWlseT0idWktbW9ub3NwYWNlLCBNZW5sbywgQ29uc29sYXMsIG1vbm9zcGFjZSIgZm9udC1zaXplPSIxMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+PHRleHQgeD0iOTAiIHk9IjE1NiI+emFobGVuWzBdIGlzdCAyPC90ZXh0Pjx0ZXh0IHg9IjMzMCIgeT0iMTU2Ij56YWhsZW5bNF0gaXN0IDEwPC90ZXh0PjwvZz4KICA8dGV4dCB4PSIyMDAiIHk9IjE4MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZlNmU3MyI+NSBGw6RjaGVyLCBnZXrDpGhsdCB3aXJkIGFiIDA6IGRlciBsZXR6dGUgSW5kZXggaXN0IDQuPC90ZXh0Pgo8L3N2Zz4K";function nl(i){const e=[];for(const t of i.replace(/\r\n/g,`
`).split(`
`)){const n=/^###\s+(.+)$/.exec(t),s=e.at(-1);if(n){const r=n[1].trim();e.push({term:r,forms:[r],text:""})}else s&&/^auch:/i.test(t)?s.forms.push(...t.replace(/^auch:/i,"").split(",").map(r=>r.trim()).filter(Boolean)):s&&t.trim()!==""&&(s.text=(s.text+" "+t.trim()).trim())}return e.filter(t=>t.text!=="")}const il=i=>i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");function vn(i){const e=i.flatMap(t=>t.forms).sort((t,n)=>n.length-t.length);if(e.length!==0)return new RegExp(`(?<![\\p{L}\\p{N}_-])(?:${e.map(il).join("|")})(?![\\p{L}\\p{N}_-])`,"u")}function Sn(i,e){return i.find(t=>t.forms.includes(e))}class G extends Error{}function Ai(i,e){const t=/^---\n([\s\S]*?)\n---\n?/.exec(i.replace(/\r\n/g,`
`));if(!t)throw new G(`${e}: Kopfzeilen (--- … ---) fehlen.`);const n=new Map;for(const s of t[1].split(`
`)){const r=/^([a-zäöüß]+):\s*(.*)$/i.exec(s.trim());r&&n.set(r[1].toLowerCase(),r[2].trim())}return{meta:n,body:i.replace(/\r\n/g,`
`).slice(t[0].length)}}function sl(i,e){const t=i.split(/\s*(?:->|→)\s*/);if(t.length!==2)throw new G(`${e}: Test „${i}“ braucht genau ein „->“.`);const n=(s,r)=>s.trim()===""||s.trim()==="-"?[]:s.split(r).map(a=>a.trim());return{inputs:n(t[0],/\s*,\s*/),expected:n(t[1],/\s*\|\s*/)}}function rl(i,e,t){const n={id:i,title:"",task:"",tests:[],requires:[],subprograms:[]};let s;for(const r of e){const a=/^(titel|auftrag|start|test|braucht|tipp|lösung|loesung|unterprogramm):\s*(.*)$/i.exec(r.trim());if(a){const[,l,o]=a;switch(s=void 0,l.toLowerCase()){case"titel":n.title=o;break;case"auftrag":n.task=o,s="task";break;case"start":n.start=o;break;case"test":n.tests.push(sl(o,t));break;case"braucht":n.requires.push(...o.split(/\s*,\s*/).filter(Boolean));break;case"tipp":n.hint=o,s="hint";break;case"lösung":case"loesung":n.solution=o;break;case"unterprogramm":n.subprograms.push(...o.split(/\s*,\s*/).filter(Boolean));break}}else s&&r.trim()!==""?s==="task"?n.task+=`
`+r.trim():n.hint+=`
`+r.trim():r.trim()===""&&s==="task"&&(n.task+=`
`)}if(!n.title)throw new G(`${t}: Übung „${i}“ hat keinen Titel.`);if(!n.task.trim())throw new G(`${t}: Übung „${i}“ hat keinen Auftrag.`);return n.task=n.task.trim(),n}function al(i,e){const t=[];for(const n of i){const s=n.trim();if(s.startsWith("?"))t.push({question:s.slice(1).trim(),options:[]});else if(/^- \[[ xX]\]/.test(s)){const r=t.at(-1);if(!r)throw new G(`${e}: Antwort ohne Frage im Quiz.`);r.options.push({text:s.slice(5).trim(),correct:s[3].toLowerCase()==="x"})}else if(s.startsWith(">")){const r=t.at(-1);r&&(r.explanation=((r.explanation?r.explanation+" ":"")+s.slice(1).trim()).trim())}}for(const n of t)if(n.options.length<2||!n.options.some(s=>s.correct))throw new G(`${e}: Quizfrage „${n.question}“ braucht mindestens zwei Antworten, davon eine richtige.`);return t}function Zi(i,e){const t=[],n=i.split(`
`);let s=[];const r=()=>{const a=s.join(`
`).trim();a&&t.push({kind:"markdown",text:a}),s=[]};for(let a=0;a<n.length;a++){const l=/^:::\s*([a-zäöüß]+)\s*(.*)$/i.exec(n[a].trim());if(!l){s.push(n[a]);continue}r();const o=[];let u=a+1;for(;u<n.length&&n[u].trim()!==":::";)o.push(n[u++]);if(u>=n.length)throw new G(`${e}: Block „::: ${l[1]}“ wird nicht mit „:::“ geschlossen.`);const d=l[1].toLowerCase(),h=l[2].trim();switch(d){case"diagramm":if(!h)throw new G(`${e}: „::: diagramm“ braucht einen Dateinamen.`);t.push({kind:"diagram",file:h,caption:o.join(" ").trim()});break;case"übung":case"uebung":if(!h)throw new G(`${e}: „::: übung“ braucht eine Kennung.`);t.push({kind:"exercise",exercise:rl(h,o,e)});break;case"checkliste":t.push({kind:"checklist",items:o.map(g=>g.trim()).filter(g=>g.startsWith("- ")).map(g=>ll(g.slice(2).trim()))});break;case"quiz":t.push({kind:"quiz",questions:al(o,e)});break;case"bild":if(!h)throw new G(`${e}: „::: bild“ braucht einen Dateinamen.`);t.push({kind:"images",files:h.split(/\s+/),caption:o.join(" ").trim()});break;case"grafik":if(!h)throw new G(`${e}: „::: grafik“ braucht einen Dateinamen.`);t.push({kind:"graphic",file:h,caption:o.join(" ").trim()});break;case"angeberwissen":t.push({kind:"brag",text:o.join(`
`).trim()});break;default:throw new G(`${e}: Unbekannter Block „::: ${l[1]}“.`)}a=u}return r(),t}function ll(i){const e=/^(.*?)\s+→\s+(.+)$/.exec(i);return e?{text:e[1],ref:e[2].trim()}:{text:i}}function ol(i,e){const t=new Map(i.map((n,s)=>[n.title.toLowerCase(),s]));for(const n of i.flatMap(s=>s.blocks))if(n.kind==="checklist"){for(const s of n.items)if(s.ref!==void 0&&(s.step=t.get(s.ref.toLowerCase()),s.step===void 0))throw new G(`${e}: Checkliste verweist auf unbekannten Schritt „${s.ref}“.`)}}function ul(i,e){var h;const{meta:t,body:n}=Ai(i,e),s=e.replace(/^.*\//,"").replace(/\.md$/,""),r=Number((h=/^(\d+)/.exec(s))==null?void 0:h[1]);if(!Number.isFinite(r))throw new G(`${e}: Dateiname muss mit der Nummer beginnen (z. B. 01-…).`);const a=[];let l=[],o;const u=()=>{o&&a.push({title:o.title,blocks:Zi(o.lines.join(`
`),e)})};for(const g of n.split(`
`)){const p=/^##\s+(.*)$/.exec(g);p?(u(),o={title:p[1].trim(),lines:[]}):o?o.lines.push(g):l.push(g)}if(u(),a.length===0)throw new G(`${e}: Keine Schritte (## Überschrift) gefunden.`);ol(a,e);const d=t.get("titel");if(!d)throw new G(`${e}: „titel:“ fehlt.`);return{id:s,number:r,title:d,section:t.get("bereich")??"",summary:t.get("kurz")??l.join(" ").trim(),steps:a}}function cl(i,e){const{meta:t,body:n}=Ai(i,e),s=t.get("titel");if(!s)throw new G(`${e}: „titel:“ fehlt.`);const r=t.get("nach");return{id:e.replace(/^.*\//,"").replace(/\.md$/,""),title:s,after:r?Number(r):void 0,level:Number(t.get("stufe")??"1")||1,blocks:Zi(n,e)}}const Ot=Object.assign({"../../lessons/de/01-was-ist-ein-struktogramm.md":_r,"../../lessons/de/02-der-editor.md":Dr,"../../lessons/de/03-speichern-oeffnen-exportieren.md":Mr,"../../lessons/de/04-variablen-und-datentypen.md":Ar,"../../lessons/de/05-sequenz.md":Zr,"../../lessons/de/06-eingabe-und-ausgabe.md":Br,"../../lessons/de/07-verzweigung.md":jr,"../../lessons/de/08-bedingungen-verknuepfen.md":Er,"../../lessons/de/09-fallauswahl.md":Wr,"../../lessons/de/10-while-schleife.md":Cr,"../../lessons/de/11-do-while-schleife.md":Pr,"../../lessons/de/12-for-schleife.md":Lr,"../../lessons/de/13-verschachteln.md":Tr,"../../lessons/de/14-arrays.md":Nr,"../../lessons/de/15-aufruf-und-aussprung.md":Hr,"../../lessons/de/16-simulation-und-schreibtischtest.md":Vr,"../../lessons/de/17-java.md":Gr,"../../lessons/de/18-python-und-javascript.md":Fr,"../../lessons/de/begriffe.md":Rr,"../../lessons/de/nachschlagen.md":$r}),dl=Object.assign({"../../lessons/de/aufgaben/alter-unterprogramm.md":Ur,"../../lessons/de/aufgaben/binaerzahl.md":Or,"../../lessons/de/aufgaben/collatz.md":Xr,"../../lessons/de/aufgaben/fibonacci.md":Yr,"../../lessons/de/aufgaben/gerade-ungerade.md":Jr,"../../lessons/de/aufgaben/notendurchschnitt.md":Kr,"../../lessons/de/aufgaben/pin-pruefen.md":Qr,"../../lessons/de/aufgaben/speisekarte.md":qr,"../../lessons/de/aufgaben/summe-bilden.md":e1,"../../lessons/de/aufgaben/tafeldienst.md":t1,"../../lessons/de/aufgaben/taschenrechner.md":n1,"../../lessons/de/aufgaben/verleih-menue.md":i1,"../../lessons/de/aufgaben/volljaehrig.md":s1,"../../lessons/de/aufgaben/zahl-verdoppeln.md":r1}),hl=Object.assign({"../../lessons/diagramme/aufgabe-alter-haupt-loesung.visustruct":a1,"../../lessons/diagramme/aufgabe-alter-unterprogramm-loesung.visustruct":l1,"../../lessons/diagramme/aufgabe-binaer-loesung.visustruct":o1,"../../lessons/diagramme/aufgabe-collatz-loesung.visustruct":u1,"../../lessons/diagramme/aufgabe-durchschnitt-loesung.visustruct":c1,"../../lessons/diagramme/aufgabe-fibonacci-loesung.visustruct":d1,"../../lessons/diagramme/aufgabe-gerade-loesung.visustruct":h1,"../../lessons/diagramme/aufgabe-pin-loesung.visustruct":m1,"../../lessons/diagramme/aufgabe-rechner-loesung.visustruct":g1,"../../lessons/diagramme/aufgabe-speisekarte-loesung.visustruct":p1,"../../lessons/diagramme/aufgabe-summe-loesung.visustruct":f1,"../../lessons/diagramme/aufgabe-tafeldienst-loesung.visustruct":b1,"../../lessons/diagramme/aufgabe-verdoppeln-loesung.visustruct":x1,"../../lessons/diagramme/aufgabe-verleih-loesung.visustruct":I1,"../../lessons/diagramme/aufgabe-volljaehrig-loesung.visustruct":w1,"../../lessons/diagramme/l04-rechnen.visustruct":z1,"../../lessons/diagramme/l04-reihenfolge-loesung.visustruct":y1,"../../lessons/diagramme/l04-reihenfolge-start.visustruct":v1,"../../lessons/diagramme/l04-tauschen-loesung.visustruct":S1,"../../lessons/diagramme/l04-tauschen-start.visustruct":k1,"../../lessons/diagramme/l04-tauschen.visustruct":_1,"../../lessons/diagramme/l05-datentypen.visustruct":D1,"../../lessons/diagramme/l05-division.visustruct":M1,"../../lessons/diagramme/l05-einkauf-loesung.visustruct":A1,"../../lessons/diagramme/l05-rechteck-loesung.visustruct":Z1,"../../lessons/diagramme/l05-sekunden-loesung.visustruct":B1,"../../lessons/diagramme/l05-sekunden-start.visustruct":j1,"../../lessons/diagramme/l06-begruessung-loesung.visustruct":E1,"../../lessons/diagramme/l06-eva.visustruct":W1,"../../lessons/diagramme/l06-mittelwert-loesung.visustruct":C1,"../../lessons/diagramme/l06-rechner-loesung.visustruct":P1,"../../lessons/diagramme/l07-alter-pruefen.visustruct":L1,"../../lessons/diagramme/l07-betrag-loesung.visustruct":T1,"../../lessons/diagramme/l07-gerade-loesung.visustruct":N1,"../../lessons/diagramme/l07-maximum-loesung.visustruct":H1,"../../lessons/diagramme/l07-rabatt.visustruct":V1,"../../lessons/diagramme/l08-gueltig-loesung.visustruct":G1,"../../lessons/diagramme/l08-jugendticket.visustruct":F1,"../../lessons/diagramme/l08-note.visustruct":R1,"../../lessons/diagramme/l08-schaltjahr-loesung.visustruct":$1,"../../lessons/diagramme/l08-wochenende-loesung.visustruct":U1,"../../lessons/diagramme/l09-ampel.visustruct":O1,"../../lessons/diagramme/l09-automat.visustruct":X1,"../../lessons/diagramme/l09-note-loesung.visustruct":Y1,"../../lessons/diagramme/l09-rechner-loesung.visustruct":J1,"../../lessons/diagramme/l09-verschachtelt.visustruct":K1,"../../lessons/diagramme/l1-grundbausteine.visustruct":Q1,"../../lessons/diagramme/l1-sequenz.visustruct":q1,"../../lessons/diagramme/l1-tee.visustruct":ea,"../../lessons/diagramme/l1-verzweigung.visustruct":ta,"../../lessons/diagramme/l1-wiederholung.visustruct":na,"../../lessons/diagramme/l10-bis-n-loesung.visustruct":ia,"../../lessons/diagramme/l10-countdown.visustruct":sa,"../../lessons/diagramme/l10-endlos.visustruct":ra,"../../lessons/diagramme/l10-fakultaet.visustruct":aa,"../../lessons/diagramme/l10-verdoppeln-loesung.visustruct":la,"../../lessons/diagramme/l11-eingabe-pruefen.visustruct":oa,"../../lessons/diagramme/l11-einmal.visustruct":ua,"../../lessons/diagramme/l11-note-loesung.visustruct":ca,"../../lessons/diagramme/l11-summe-loesung.visustruct":da,"../../lessons/diagramme/l12-countdown-loesung.visustruct":ha,"../../lessons/diagramme/l12-einmaleins-loesung.visustruct":ma,"../../lessons/diagramme/l12-eins-bis-fuenf.visustruct":ga,"../../lessons/diagramme/l12-summe.visustruct":pa,"../../lessons/diagramme/l13-dreieck.visustruct":fa,"../../lessons/diagramme/l13-gerade-eingaben-loesung.visustruct":ba,"../../lessons/diagramme/l13-gerade-zaehlen.visustruct":xa,"../../lessons/diagramme/l13-rechteck-loesung.visustruct":Ia,"../../lessons/diagramme/l14-array-durchlaufen.visustruct":wa,"../../lessons/diagramme/l14-erster-letzter-loesung.visustruct":za,"../../lessons/diagramme/l14-namen-eingeben.visustruct":ya,"../../lessons/diagramme/l14-rueckwaerts-loesung.visustruct":va,"../../lessons/diagramme/l14-summe-max-loesung.visustruct":Sa,"../../lessons/diagramme/l14-summe-maximum.visustruct":ka,"../../lessons/diagramme/l15-bis-null-loesung.visustruct":_a,"../../lessons/diagramme/l15-endlos-aussprung.visustruct":Da,"../../lessons/diagramme/l15-hauptprogramm.visustruct":Ma,"../../lessons/diagramme/l15-titel-loesung.visustruct":Aa,"../../lessons/diagramme/l15-unterprogramm.visustruct":Za,"../../lessons/diagramme/l16-countdown-loesung.visustruct":Ba,"../../lessons/diagramme/l16-countdown-start.visustruct":ja,"../../lessons/diagramme/l16-schreibtisch.visustruct":Ea,"../../lessons/diagramme/l16-summe-loesung.visustruct":Wa,"../../lessons/diagramme/l16-summe-start.visustruct":Ca,"../../lessons/diagramme/l17-beispiel.visustruct":Pa,"../../lessons/diagramme/l17-fakultaet-loesung.visustruct":La,"../../lessons/diagramme/l17-ticket-loesung.visustruct":Ta,"../../lessons/diagramme/l18-beispiel.visustruct":Na,"../../lessons/diagramme/l18-js-loesung.visustruct":Ha,"../../lessons/diagramme/l18-python-loesung.visustruct":Va,"../../lessons/diagramme/l2-ausgabe.visustruct":Ga,"../../lessons/diagramme/l2-hallo-loesung.visustruct":Fa,"../../lessons/diagramme/l2-zwei-zeilen-loesung.visustruct":Ra}),ml=Object.assign({"../../lessons/bilder/ben-shneiderman.jpg":$a,"../../lessons/bilder/ike-nassi.jpg":Ua,"../../lessons/bilder/l02-einfuegen.svg":Oa,"../../lessons/bilder/l04-variable.svg":Xa,"../../lessons/bilder/l04-zuweisung.svg":Ya,"../../lessons/bilder/l05-tauschen.svg":Ja,"../../lessons/bilder/l08-zahlenstrahl.svg":Ka,"../../lessons/bilder/l10-kopfgesteuert.svg":Qa,"../../lessons/bilder/l11-vergleich.svg":qa,"../../lessons/bilder/l12-for-ablauf.svg":el,"../../lessons/bilder/l14-array.svg":tl}),it=i=>i.replace(/^.*\//,""),pe=Object.entries(Ot).filter(([i])=>/\/\d+[^/]*\.md$/.test(i)).map(([i,e])=>ul(e,it(i))).sort((i,e)=>i.number-e.number),mt=Object.entries(dl).map(([i,e])=>cl(e,it(i))).sort((i,e)=>(i.after??0)-(e.after??0)||i.level-e.level||i.title.localeCompare(e.title,"de"));var Fn;const gl=((Fn=Object.entries(Ot).find(([i])=>i.endsWith("/nachschlagen.md")))==null?void 0:Fn[1])??"";var Rn;const gt=nl(((Rn=Object.entries(Ot).find(([i])=>i.endsWith("/begriffe.md")))==null?void 0:Rn[1])??""),pl=new Map(Object.entries(hl).map(([i,e])=>[it(i),e]));function ze(i){const e=pl.get(i);return e===void 0?void 0:Ht(e)}const fl=new Map(Object.entries(ml).map(([i,e])=>[it(i),e]));function kn(i){return fl.get(i)}const Bi=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function K(i){const e=[];let t=Bi(i).replace(/`([^`]+)`/g,(n,s)=>(e.push(s),`\0${e.length-1}\0`));return t=t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/(^|[^*])\*([^*\s][^*]*?)\*/g,"$1<em>$2</em>").replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,(n,s,r)=>{const a=/^(https?:|mailto:|#|\.{0,2}\/)/.test(r)?r:"#",l=/^https?:/.test(a)?' target="_blank" rel="noopener noreferrer"':"";return`<a href="${a}"${l}>${s}</a>`}),t.replace(/\u0000(\d+)\u0000/g,(n,s)=>`<code>${e[Number(s)]}</code>`)}function fe(i){const e=[],t=i.replace(/\r\n/g,`
`).split(`
`);let n=0;for(;n<t.length;){const s=t[n];if(s.trim()===""){n++;continue}if(s.startsWith("```")){const l=[];for(n++;n<t.length&&!t[n].startsWith("```");)l.push(t[n++]);n++,e.push(`<pre class="lesson-code" dir="ltr"><code>${Bi(l.join(`
`))}</code></pre>`);continue}const r=/^(#{3,4})\s+(.*)$/.exec(s);if(r){const l=r[1].length;e.push(`<h${l}>${K(r[2])}</h${l}>`),n++;continue}if(/^\s*([-*]|\d+\.)\s+/.test(s)){const l=/^\s*\d+\./.test(s),o=[];for(;n<t.length&&/^\s*([-*]|\d+\.)\s+/.test(t[n]);){let u=t[n].replace(/^\s*([-*]|\d+\.)\s+/,"");for(n++;n<t.length&&/^\s{2,}\S/.test(t[n])&&!/^\s*([-*]|\d+\.)\s+/.test(t[n]);)u+=" "+t[n++].trim();o.push(`<li>${K(u)}</li>`)}e.push(l?`<ol>${o.join("")}</ol>`:`<ul>${o.join("")}</ul>`);continue}if(s.startsWith("|")&&/^\|?[\s:|-]*-{3,}[\s:|-]*$/.test(t[n+1]??"")){const l=d=>d.trim().replace(/^\|/,"").replace(/\|$/,"").split("|").map(h=>K(h.trim())),o=l(s);n+=2;const u=[];for(;n<t.length&&t[n].startsWith("|");)u.push(l(t[n++]));e.push(`<div class="lesson-table"><table><thead><tr>${o.map(d=>`<th>${d}</th>`).join("")}</tr></thead><tbody>${u.map(d=>`<tr>${d.map(h=>`<td>${h}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);continue}if(s.startsWith(">")){const l=[];for(;n<t.length&&t[n].startsWith(">");)l.push(t[n++].replace(/^>\s?/,""));e.push(`<aside class="lesson-note">${fe(l.join(`
`))}</aside>`);continue}const a=[];for(;n<t.length&&t[n].trim()!==""&&!/^(```|#{3,4}\s|>|\||\s*([-*]|\d+\.)\s+)/.test(t[n]);)a.push(t[n++].trim());e.push(`<p>${K(a.join(" "))}</p>`)}return e.join(`
`)}const bl=""+new URL("ludwig-Cus1i402.webp",import.meta.url).href,ji="visustruct.learn.progress",pt={"04-sequenz":"05-sequenz","05-variablen-und-datentypen":"04-variablen-und-datentypen"};function xl(i){var n;const e={...i.lessons};for(const[s,r]of Object.entries(pt))i.lessons[s]&&!i.lessons[r]&&(e[r]=i.lessons[s]),i.lessons[s]&&delete e[s];const t=(n=i.view)!=null&&n.lesson&&pt[i.view.lesson]?{...i.view,lesson:pt[i.view.lesson]}:i.view;return{...i,lessons:e,view:t}}function Ei(){try{const i=localStorage.getItem(ji);if(i){const e=JSON.parse(i);return xl({lessons:e.lessons??{},exercises:e.exercises??{},view:e.view})}}catch{}return{lessons:{},exercises:{}}}let te=Ei();function Ne(){try{localStorage.setItem(ji,JSON.stringify(te))}catch{}}const H={lesson(i){var e;return(e=te.lessons)[i]??(e[i]={step:0})},updateLesson(i,e){te.lessons[i]={...H.lesson(i),...e},Ne()},exercise(i){return te.exercises[i]??{}},updateExercise(i,e){te.exercises[i]={...H.exercise(i),...e},Ne()},resetExercise(i){delete te.exercises[i],Ne()},view(){return te.view},setView(i){te.view=i,Ne()},reload(){te=Ei()}};function Wt(i){switch(i.kind){case"finished":return c("sim_notice_finished");case"infiniteLoopWithoutBody":return c("sim_notice_infinite_loop_empty");case"unsupportedStatement":return c("sim_notice_unsupported_statement_fmt",i.text);case"invalidExpression":return c("sim_notice_invalid_expression_fmt",i.text);case"unknownVariable":return c("sim_notice_unknown_variable_fmt",i.text);case"divisionByZero":return c("sim_notice_division_by_zero");case"wholeNumberExpected":return c("sim_notice_whole_number_expected");case"numberExpected":return c("sim_notice_number_expected");case"booleanExpected":return c("sim_notice_boolean_expected");case"subprogramNotFound":return c("sim_notice_subprogram_not_found_fmt",i.text);case"callTooDeep":return c("sim_notice_call_too_deep");case"other":return i.text}}const P=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),_n=["0.2","0.5","1.0","1.5","2.0"],Il=i=>Number(i).toLocaleString(At()==="java"?"en":At(),{minimumFractionDigits:1}),ft="visustruct.simulation.stepDelay",Dn="visustruct.simulation.highlightMode";function bt(i){try{return localStorage.getItem(i)}catch{return null}}function Mn(i,e){try{localStorage.setItem(i,e)}catch{}}class wl{constructor(e,t,n=()=>{},s=()=>{}){b(this,"element");b(this,"engine");b(this,"isPlaying",!1);b(this,"playTimer");b(this,"wasPlayingBeforeInput",!1);b(this,"delay",_n.includes(bt(ft)??"")?bt(ft):"0.5");b(this,"highlightMode",bt(Dn)==="nextToExecute"?"nextToExecute":"lastExecuted");b(this,"buttons");b(this,"inputSection");b(this,"trace");b(this,"variables");b(this,"output");b(this,"notice");b(this,"editButton");this.currentDocument=e,this.onHighlight=t,this.findSubprogram=n,this.onEdit=s,this.engine=new Et(e(),n),this.element=document.createElement("aside"),this.element.className="simpanel",this.build()}begin(){this.pause(),this.restartEngine()}end(){this.pause()}step(){if(!this.engine.canStep){this.pause();return}const e=this.isPlaying,t=this.engine.currentStepPath;this.engine.step(),this.highlightMode==="nextToExecute"&&this.engine.canStep?this.onHighlight(this.engine.currentStepPath):this.onHighlight(t??this.engine.currentStepPath),this.engine.state.inputRequest&&e&&(this.wasPlayingBeforeInput=!0),this.engine.canStep||this.pause(),this.update()}reset(){this.pause(),this.restartEngine()}play(){if(this.isPlaying||!this.engine.canStep)return;this.isPlaying=!0;const e=()=>{this.playTimer=void 0,this.isPlaying&&(this.step(),this.isPlaying&&this.engine.canStep?this.playTimer=window.setTimeout(e,Number(this.delay)*1e3):(this.isPlaying=!1,this.update()))};e()}pause(){this.playTimer!==void 0&&window.clearTimeout(this.playTimer),this.playTimer=void 0,this.isPlaying=!1,this.update()}submitInput(e){const t=this.isPlaying||this.wasPlayingBeforeInput;this.pause(),this.engine.provideInput(e.value),this.engine.state.inputRequest||(e.value=""),this.onHighlight(this.engine.currentStepPath),t&&this.engine.canStep&&(this.wasPlayingBeforeInput=!1,this.play()),this.update()}restartEngine(){this.engine=new Et(this.currentDocument(),this.findSubprogram),this.wasPlayingBeforeInput=!1,this.onHighlight(this.engine.currentStepPath),this.update()}build(){this.element.innerHTML=`
      <section>
        <h2>${P(c("simulation_controls"))}</h2>
        <div class="sim-buttons">
          <button data-sim="play">▶︎ ${P(c("simulation_play"))}</button>
          <button data-sim="pause">⏸︎ ${P(c("simulation_pause"))}</button>
          <button data-sim="step">→ ${P(c("simulation_step"))}</button>
          <button data-sim="stop">■ ${P(c("simulation_stop"))}</button>
        </div>
        <label class="sim-option">${P(c("simulation_highlight_label"))}
          <select data-sim="highlight">
            <option value="lastExecuted">${P(c("simulation_highlight_last"))}</option>
            <option value="nextToExecute">${P(c("simulation_highlight_next"))}</option>
          </select>
        </label>
        <label class="sim-option">${P(c("web_sim_delay"))}
          <select data-sim="delay">${_n.map(s=>`<option value="${s}">${P(c("web_sim_delay_value_fmt",Il(s)))}</option>`).join("")}</select>
        </label>
      </section>
      <p class="sim-notice" role="status"></p>
      <button class="sim-edit primary" title="${P(c("web_simulation_end_title"))}" hidden>✎ ${P(c("action_diagram"))}</button>
      <section class="sim-input"><h2>${P(c("simulation_input"))}</h2><div></div></section>
      <section><h2>${P(c("simulation_trace"))}</h2><div class="sim-trace mono" dir="ltr"></div></section>
      <section><h2>${P(c("simulation_variables"))}</h2><div class="sim-vars" dir="ltr"></div></section>
      <section><h2>${P(c("simulation_output"))}</h2><div class="sim-output mono" dir="ltr"></div></section>
    `;const e=s=>this.element.querySelector(s);this.buttons={play:e("[data-sim=play]"),pause:e("[data-sim=pause]"),step:e("[data-sim=step]"),stop:e("[data-sim=stop]")},this.buttons.play.addEventListener("click",()=>this.play()),this.buttons.pause.addEventListener("click",()=>this.pause()),this.buttons.step.addEventListener("click",()=>this.step()),this.buttons.stop.addEventListener("click",()=>this.reset()),this.editButton=e(".sim-edit"),this.editButton.addEventListener("click",()=>this.onEdit());const t=e("[data-sim=highlight]");t.value=this.highlightMode,t.addEventListener("change",()=>{this.highlightMode=t.value,Mn(Dn,this.highlightMode)});const n=e("[data-sim=delay]");n.value=this.delay,n.addEventListener("change",()=>{this.delay=n.value,Mn(ft,this.delay)}),this.inputSection=e(".sim-input > div"),this.trace=e(".sim-trace"),this.variables=e(".sim-vars"),this.output=e(".sim-output"),this.notice=e(".sim-notice")}update(){if(!this.buttons)return;const{state:e,canStep:t}=this.engine;this.buttons.play.disabled=this.isPlaying||!t,this.buttons.pause.disabled=!this.isPlaying,this.buttons.step.disabled=this.isPlaying||!t,this.notice.textContent=e.notice?Wt(e.notice):"",this.notice.hidden=!e.notice,this.notice.classList.toggle("error",e.isHalted),this.editButton.hidden=!e.isHalted,this.updateInput(),this.trace.textContent=e.lastTrace??c("simulation_trace_placeholder"),this.trace.classList.toggle("placeholder",!e.lastTrace);const n=[...e.variables.keys()].sort((s,r)=>s.localeCompare(r));if(n.length===0)this.variables.innerHTML=`<p class="placeholder">${P(c("simulation_variables_placeholder"))}</p>`;else{const s=document.createElement("table");for(const r of n){const a=s.insertRow();a.insertCell().textContent=r,a.insertCell().textContent=O(e.variables.get(r))}this.variables.replaceChildren(s)}e.outputLines.length===0?this.output.innerHTML=`<p class="placeholder">${P(c("simulation_output_placeholder"))}</p>`:(this.output.replaceChildren(...e.outputLines.map(s=>{const r=document.createElement("div");return r.textContent=s,r})),this.output.scrollTop=this.output.scrollHeight)}updateInput(){const e=this.engine.state.inputRequest,t=this.inputSection;if(t.parentElement.classList.toggle("active",!!e),!e){t.innerHTML=`<p class="placeholder">${P(c("simulation_input_placeholder"))}</p>`;return}let n=t.querySelector("form");if(!n){n=document.createElement("form"),n.innerHTML=`<p class="sim-prompt"></p><div class="sim-input-row"><input autocomplete="off" /><button type="submit">${P(c("simulation_input_submit"))}</button></div><p class="sim-input-error"></p>`;const l=n.querySelector("input");n.addEventListener("submit",o=>{o.preventDefault(),this.submitInput(l)}),t.replaceChildren(n),requestAnimationFrame(()=>l.focus())}n.querySelector(".sim-prompt").textContent=e.prompt;const s=n.querySelector("input");s.inputMode=e.valueType==="string"||e.valueType==="boolean"?"text":"decimal";const r=this.engine.state.inputErrorNotice,a=n.querySelector(".sim-input-error");a.textContent=r?Wt(r):"",a.hidden=!r}}const zl="code, pre, a, button, h1, h2, h3, h4, strong, .term, .ui-pointer";function An(i,e){var r;const t=[...i.querySelectorAll(".learn-text")],n=new Set;for(const a of t.flatMap(l=>[...l.querySelectorAll("strong")])){const l=vn(e),o=l==null?void 0:l.exec(a.textContent??""),u=o?Sn(e,o[0]):void 0;u&&n.add(u)}let s=e.filter(a=>!n.has(a));for(const a of t){const l=document.createTreeWalker(a,NodeFilter.SHOW_TEXT),o=[];for(;l.nextNode();){const u=l.currentNode;(r=u.parentElement)!=null&&r.closest(zl)||o.push(u)}for(let u of o)for(;;){const d=vn(s),h=d==null?void 0:d.exec(u.data),g=h?Sn(s,h[0]):void 0;if(!h||!g)break;const p=u.splitText(h.index);u=p.splitText(h[0].length);const f=document.createElement("span");f.className="term",f.tabIndex=0,f.setAttribute("role","button"),f.setAttribute("aria-describedby","term-tip"),f.dataset.term=g.term,f.dataset.text=g.text,p.replaceWith(f),f.append(p),s=s.filter(y=>y!==g)}}}function yl(i){const e=document.createElement("div");e.id="term-tip",e.className="term-tip",e.setAttribute("role","tooltip"),e.hidden=!0,document.body.append(e);let t,n=!1;const s=l=>{t=l,e.replaceChildren();const o=document.createElement("strong");o.textContent=l.dataset.term??"",e.append(o,document.createTextNode(" "+(l.dataset.text??""))),e.hidden=!1;const u=l.getBoundingClientRect(),d=e.offsetWidth,h=e.offsetHeight,g=Math.max(8,Math.min(u.left,window.innerWidth-d-8)),p=u.bottom+6;e.style.left=`${g}px`,e.style.top=`${p+h>window.innerHeight-8?Math.max(8,u.top-h-6):p}px`,l.setAttribute("aria-expanded","true")},r=()=>{t==null||t.setAttribute("aria-expanded","false"),t=void 0,n=!1,e.hidden=!0},a=l=>{var o,u;return((u=(o=l.target)==null?void 0:o.closest)==null?void 0:u.call(o,".term"))??void 0};return i.addEventListener("pointerover",l=>{const o=a(l);o&&l.pointerType==="mouse"&&!n&&s(o)}),i.addEventListener("pointerout",l=>{a(l)&&l.pointerType==="mouse"&&!n&&r()}),i.addEventListener("click",l=>{const o=a(l);if(o){if(n&&t===o)return r();s(o),n=!0}}),i.addEventListener("focusin",l=>{const o=a(l);o&&!n&&s(o)}),i.addEventListener("focusout",l=>{a(l)&&!n&&r()}),i.addEventListener("keydown",l=>{const o=a(l);l.key==="Escape"&&t?r():o&&(l.key==="Enter"||l.key===" ")&&(l.preventDefault(),o.click())}),i.addEventListener("scroll",r,!0),document.addEventListener("pointerdown",l=>{t&&!a(l)&&!e.contains(l.target)&&r()}),{hide:r}}const Wi={leiste:".app > .toolbar",elemente:".palette",struktogramm:".canvas",objektinspektor:".inspector",reiter:".tabs",titel:".caption",neu:"[data-action=new]",oeffnen:"[data-action=open]",speichern:"[data-action=save]",exportieren:"[data-action=export]",rueckgaengig:"[data-action=undo]",textgroesse:"[data-action=zoom]",lernen:"[data-action=learn]",code:"[data-action=code]",simulation:"[data-action=simulate]"};function Zn(i){for(const e of i.querySelectorAll('a[href^="#zeige-"]')){const t=e.getAttribute("href").slice(7);if(!(t in Wi))continue;const n=document.createElement("span");n.className="ui-pointer",n.tabIndex=0,n.setAttribute("role","button"),n.dataset.target=t,n.append(...e.childNodes),e.replaceWith(n)}}function vl(i){let e,t;const n=()=>{e==null||e.classList.remove("ui-spot"),e=void 0,window.clearTimeout(t)},s=(a,l)=>{n();const o=document.querySelector(Wi[a.dataset.target??""]??":not(*)");!o||o.getClientRects().length===0||(e=o,o.classList.add("ui-spot"),l&&(t=window.setTimeout(n,2500)))},r=a=>{var l,o;return((o=(l=a.target)==null?void 0:l.closest)==null?void 0:o.call(l,".ui-pointer"))??void 0};return i.addEventListener("pointerover",a=>{const l=r(a);l&&a.pointerType==="mouse"&&s(l,!1)}),i.addEventListener("pointerout",a=>{r(a)&&a.pointerType==="mouse"&&n()}),i.addEventListener("click",a=>{const l=r(a);l&&s(l,!0)}),i.addEventListener("focusin",a=>{const l=r(a);l&&s(l,!1)}),i.addEventListener("focusout",a=>{r(a)&&n()}),i.addEventListener("keydown",a=>{const l=r(a);l&&(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),s(l,!0))}),{off:n}}const Sl=()=>{const i=[];for(const e of pe){const t=i.at(-1);t&&t.name===e.section?t.lessons.push(e):i.push({name:e.section,lessons:[e]})}return i};function x(i,e={},...t){const n=document.createElement(i);for(const[s,r]of Object.entries(e))n.setAttribute(s,r);return n.append(...t),n}function X(i,e,t){const n=x(i,e);return n.innerHTML=t,n}const kl=i=>c(`element_${m[i]}`);function _l(i){return{caption:i,elements:[Y(m.anweisung,{textLines:["ø"]})]}}function Bn(i){const e=i.start?ze(i.start):void 0;return e?{...e,caption:e.caption||i.title}:_l(i.title)}class Dl{constructor(e){b(this,"element");b(this,"tab","lessons");b(this,"returnTo");b(this,"lessonId");b(this,"taskId");b(this,"body");b(this,"tips");b(this,"pointers");this.host=e,this.element=x("aside",{class:"learn","aria-label":c("web_learn_title")}),this.tips=yl(this.element),this.pointers=vl(this.element);const t=H.view();t&&(this.tab=["lessons","tasks","reference"].find(n=>n===t.tab)??"lessons",this.lessonId=pe.some(n=>n.id===t.lesson)?t.lesson:void 0,this.taskId=mt.some(n=>n.id===t.task)?t.task:void 0),this.render()}render(){this.tips.hide(),this.pointers.off();const e=x("div",{class:"segmented learn-tabs",role:"tablist"});for(const[t,n]of[["lessons",c("web_learn_lessons")],["tasks",c("web_learn_tasks")],["reference",c("web_learn_reference")]]){const s=x("button",{role:"tab","aria-pressed":String(this.tab===t),"data-learn-tab":t},n);s.addEventListener("click",()=>{this.tab===t&&(t==="lessons"&&(this.lessonId=void 0),t==="tasks"&&(this.taskId=void 0)),this.tab=t,this.persist(),this.render()}),e.append(s)}if(this.body=x("div",{class:"learn-body"}),this.element.replaceChildren(e,this.body),this.tab==="lessons"){const t=pe.find(n=>n.id===this.lessonId);t?this.renderLesson(t):this.renderLessonList()}else if(this.tab==="tasks"){const t=mt.find(n=>n.id===this.taskId);t?this.renderTask(t):this.renderTaskList()}else{const t=gt.map(n=>`- **${n.term}:** ${n.text}`).join(`
`);this.body.append(X("div",{class:"learn-text learn-reference"},fe(`${gl}

### Fachbegriffe

${t}`)))}}persist(){H.setView({tab:this.tab,lesson:this.lessonId,task:this.taskId})}openLesson(e){this.tab="lessons",this.lessonId=e,this.returnTo=void 0,this.persist(),this.render(),this.body.scrollTop=0}renderLessonList(){this.body.append(x("p",{class:"hint"},c("web_learn_intro")));for(const e of Sl()){this.body.append(x("h3",{class:"learn-section"},e.name));const t=x("ol",{class:"learn-list"});for(const n of e.lessons){const s=H.lesson(n.id),r=s.done?"✓":s.step>0?c("web_learn_step_of_fmt",s.step+1,n.steps.length):"",a=x("button",{class:"learn-item"+(s.done?" done":""),"data-lesson":n.id},x("span",{class:"learn-num"},String(n.number)),x("span",{class:"learn-item-text"},x("strong",{},n.title),x("small",{},n.summary)),x("span",{class:"learn-status"},r));a.addEventListener("click",()=>this.openLesson(n.id)),t.append(x("li",{},a))}this.body.append(t)}}renderLesson(e){var h;const t=H.lesson(e.id),n=Math.min(t.step,e.steps.length-1),s=e.steps[n],r=x("button",{class:"learn-back"},`← ${c("web_learn_all_lessons")}`);r.addEventListener("click",()=>this.openLesson(void 0));const a=x("nav",{class:"learn-progress","aria-label":c("web_learn_step_of_fmt",n+1,e.steps.length)});a.append(...e.steps.map((g,p)=>{const f=c("web_learn_step_fmt",p+1,g.title),y=x("button",{class:p<n?"past":p===n?"current":"",title:f,"aria-label":f},String(p+1));return p===n&&y.setAttribute("aria-current","step"),y.addEventListener("click",()=>this.goToStep(e,p)),y})),this.body.append(r,x("p",{class:"learn-kicker"},`${c("web_learn_lesson_fmt",e.number)} · ${e.section}`),x("h2",{class:"learn-title"},e.title),a,x("h3",{class:"learn-step-title"},`${n+1}. ${s.title}`));const l=((h=this.returnTo)==null?void 0:h.lesson)===e.id&&this.returnTo.step!==n?this.returnTo:void 0,o=()=>{const g=x("button",{class:"learn-return"},`↩ ${c("web_learn_back_to_checklist")}`);return g.addEventListener("click",()=>{this.returnTo=void 0,this.goToStep(e,l.step),this.body.scrollTop=l.scroll}),g};l&&this.body.append(o()),s.blocks.forEach((g,p)=>this.body.append(this.renderBlock(g,`${n}-${p}`,e))),Zn(this.body),An(this.body,gt);const u=x("div",{class:"learn-nav"}),d=x("button",{},`← ${c("web_learn_back")}`);if(d.disabled=n===0,d.addEventListener("click",()=>this.goToStep(e,n-1)),u.append(d),n<e.steps.length-1){const g=x("button",{class:"primary"},`${c("web_learn_next")} →`);g.addEventListener("click",()=>this.goToStep(e,n+1)),u.append(g)}else{const g=x("button",{class:"primary"},t.done?`✓ ${c("web_learn_done")}`:c("web_learn_finish"));g.addEventListener("click",()=>{H.updateLesson(e.id,{done:!0});const p=pe.find(f=>f.number===e.number+1);this.openLesson(p==null?void 0:p.id)}),u.append(g)}this.body.append(u),l&&this.body.append(o())}goToStep(e,t){H.updateLesson(e.id,{step:t}),this.render(),this.body.scrollTop=0}renderTaskList(){this.body.append(x("p",{class:"hint"},c("web_learn_tasks_intro")));const e=x("ul",{class:"learn-list"});for(const t of mt){const n=this.taskExercises(t).every(a=>H.exercise(a.id).done),s=pe.find(a=>a.number===t.after),r=x("button",{class:"learn-item"+(n?" done":""),"data-task":t.id},x("span",{class:"learn-num","aria-label":c("web_learn_level_fmt",t.level)},"★".repeat(t.level)),x("span",{class:"learn-item-text"},x("strong",{},t.title),x("small",{},s?c("web_learn_after_fmt",s.number,s.title):"")),x("span",{class:"learn-status"},n?"✓":""));r.addEventListener("click",()=>{this.taskId=t.id,this.persist(),this.render(),this.body.scrollTop=0}),e.append(x("li",{},r))}this.body.append(e)}taskExercises(e){return e.blocks.flatMap(t=>t.kind==="exercise"?[t.exercise]:[])}renderTask(e){const t=x("button",{class:"learn-back"},`← ${c("web_learn_all_tasks")}`);t.addEventListener("click",()=>{this.taskId=void 0,this.persist(),this.render()});const n=pe.find(s=>s.number===e.after);if(this.body.append(t,x("h2",{class:"learn-title"},e.title)),n){const s=x("button",{class:"link-button"},c("web_learn_after_fmt",n.number,n.title));s.addEventListener("click",()=>this.openLesson(n.id)),this.body.append(x("p",{class:"learn-kicker"},s))}e.blocks.forEach((s,r)=>this.body.append(this.renderBlock(s,`task-${r}`,void 0,!0))),Zn(this.body),An(this.body,gt)}renderBlock(e,t,n,s=!1){switch(e.kind){case"markdown":return X("div",{class:"learn-text"},fe(e.text));case"diagram":return this.renderDiagram(e.file,e.caption);case"exercise":return this.renderExercise(e.exercise,s);case"checklist":return this.renderChecklist(e.items,t,n);case"quiz":return this.renderQuiz(e.questions,t,n);case"brag":return this.renderBrag(e.text);case"images":return this.renderImages(e.files,e.caption);case"graphic":return this.renderGraphic(e.file,e.caption)}}renderBrag(e){const t=x("aside",{class:"learn-brag"});t.append(x("img",{src:bl,alt:"",width:"48",height:"48"}));const n=x("div",{},x("p",{class:"learn-brag-title"},c("web_learn_brag")));return n.append(X("div",{class:"learn-text"},fe(e))),t.append(n),t}renderImages(e,t){const n=x("figure",{class:"learn-figure"}),s=x("div",{class:"learn-images"});for(const r of e){const a=kn(r);a&&s.append(x("img",{src:a,alt:"",loading:"lazy"}))}return n.append(s),t&&n.append(X("figcaption",{},K(t))),n}renderGraphic(e,t){const n=x("figure",{class:"learn-figure"}),s=kn(e);return s&&n.append(x("img",{class:"learn-graphic",src:s,alt:"",loading:"lazy"})),t&&n.append(X("figcaption",{},K(t))),n}renderDiagram(e,t){const n=ze(e),s=x("figure",{class:"learn-figure"});if(!n)return s;const r=this.host.preview(n);r&&s.append(x("div",{class:"learn-preview",dir:"ltr"},r)),t&&s.append(X("figcaption",{},K(t)));const a=x("button",{},c("web_learn_open_in_editor"));return a.addEventListener("click",()=>this.host.openDiagram(n,e)),s.append(a),s}renderExercise(e,t){const n=x("section",{class:"learn-exercise","data-exercise":e.id}),s=()=>H.exercise(e.id),r=x("span",{class:"learn-badge"},`✓ ${c("web_learn_solved")}`);r.hidden=!s().done,n.append(x("h4",{},`${c("web_learn_exercise")}: ${e.title}`,r),X("div",{class:"learn-text"},fe(e.task)));const a=x("div",{class:"learn-result",role:"status"}),l=X("aside",{class:"lesson-note"},fe(e.hint??""));l.hidden=!0;const o=x("div",{class:"group"}),u=x("button",{class:"primary"},c("web_learn_open_exercise"));u.addEventListener("click",()=>{const g=s().xml;let p=Bn(e);if(g)try{p=Ht(g)}catch{}this.host.openExercise(e,p)});const d=x("button",{},c("web_learn_check"));if(d.addEventListener("click",()=>{const g=this.host.exerciseDocument(e.id);if(!g){a.className="learn-result info",a.textContent=c("web_learn_open_first");return}if(g.elements.every(Pt)){a.className="learn-result info",a.textContent=c("web_learn_empty");return}this.host.stopSimulation();const p=Sr(g,e.tests,this.host.subprogramsFor(e.id)),f=kr(g),y=e.requires.map(I=>I==="forZaehlSchleife"?"forSchleife":I).filter(I=>I in m&&!f.has(m[I])),z=p.every(I=>I.passed)&&y.length===0;this.showResult(a,p,y,z),z&&(H.updateExercise(e.id,{done:!0}),r.hidden=!1)}),o.append(u,d),e.hint){const g=x("button",{"aria-expanded":"false"},c("web_learn_hint"));g.addEventListener("click",()=>{l.hidden=!l.hidden,g.setAttribute("aria-expanded",String(!l.hidden))}),o.append(g)}const h=x("button",{class:"danger-text"},c("web_learn_reset"));if(h.addEventListener("click",()=>{if(h.dataset.confirm!=="1"){h.dataset.confirm="1",h.textContent=c("web_learn_reset_confirm"),setTimeout(()=>{h.dataset.confirm="",h.textContent=c("web_learn_reset")},4e3);return}H.resetExercise(e.id),this.host.resetExercise(e.id,Bn(e)),r.hidden=!0,a.replaceChildren(),a.className="learn-result",h.dataset.confirm="",h.textContent=c("web_learn_reset")}),o.append(h),n.append(o,l,a),t&&e.solution){const g=ze(e.solution);if(g){const p=x("details",{class:"learn-solution"},x("summary",{},c("web_learn_solution")));p.addEventListener("toggle",()=>{if(!p.open||p.querySelector(".learn-preview"))return;const f=this.host.preview(g);f&&p.append(x("div",{class:"learn-preview",dir:"ltr"},f));const y=x("button",{},c("web_learn_open_in_editor"));y.addEventListener("click",()=>{this.host.openDiagram(g,e.solution);for(const z of e.subprograms){const I=ze(z);I&&this.host.openDiagram(I,z)}});for(const z of e.subprograms){const I=ze(z),_=I&&this.host.preview(I);_&&p.append(x("div",{class:"learn-preview",dir:"ltr"},_))}p.append(y)}),n.append(p)}}return n}showResult(e,t,n,s){e.className="learn-result "+(s?"ok":"fail"),e.replaceChildren(x("p",{class:"learn-result-head"},s?`🎉 ${c("web_learn_passed")}`:c("web_learn_failed")));for(const a of n)e.append(x("p",{},`✗ ${c("web_learn_missing_fmt",kl(m[a]))}`));const r=x("ul",{class:"learn-tests",dir:"auto"});for(const a of t){const l=a.test.inputs.length?c("web_learn_input_fmt",a.test.inputs.join(", ")):c("web_learn_no_input"),o=[`${a.passed?"✓":"✗"} ${l}`],u=x("div",{class:"learn-test-detail"});u.append(x("span",{},`${c("web_learn_expected")}: `,x("code",{},a.test.expected.join(" | ")||"–")),x("span",{},`${c("web_learn_actual")}: `,x("code",{},a.result.outputs.join(" | ")||"–"))),a.result.error&&u.append(x("span",{class:"learn-error"},Wt(a.result.error))),a.result.missingInput&&u.append(x("span",{class:"learn-error"},c("web_learn_missing_input"))),a.result.tooManySteps&&u.append(x("span",{class:"learn-error"},c("web_learn_too_many_steps"))),!a.passed&&a.result.unusedInputs&&u.append(x("span",{class:"learn-error"},c("web_learn_unused_input"))),r.append(x("li",{class:a.passed?"ok":"fail"},...o,u))}e.append(r)}renderChecklist(e,t,n){const s=x("ul",{class:"learn-checklist"});return e.forEach((r,a)=>{var h;const l=`${t}-${a}`,o=x("input",{type:"checkbox"});o.checked=!!(n&&((h=H.lesson(n.id).checks)!=null&&h[l])),o.addEventListener("change",()=>{if(!n)return;const g={...H.lesson(n.id).checks??{},[l]:o.checked};H.updateLesson(n.id,{checks:g})});const u=x("label",{},o);u.insertAdjacentHTML("beforeend"," "+K(r.text));const d=x("li",{},u);if(n&&r.step!==void 0){const g=r.step,p=c("web_learn_step_fmt",g+1,n.steps[g].title),f=x("button",{class:"link-button learn-check-link",title:p,"aria-label":`${c("web_learn_review")}: ${p}`},c("web_learn_review"));f.addEventListener("click",()=>{this.returnTo={lesson:n.id,step:H.lesson(n.id).step,scroll:this.body.scrollTop},this.goToStep(n,g)}),d.append(f)}s.append(d)}),s}renderQuiz(e,t,n){const s=x("div",{class:"learn-quiz"}),r=x("p",{class:"learn-score",role:"status"}),a=()=>n?H.lesson(n.id).quiz??{}:{},l=()=>{const o=a(),u=e.filter((h,g)=>o[`${t}-${g}`]!==void 0).length,d=e.filter((h,g)=>{var p;return(p=h.options[o[`${t}-${g}`]])==null?void 0:p.correct}).length;r.textContent=u===e.length?c("web_learn_score_fmt",d,e.length):""};return e.forEach((o,u)=>{const d=`${t}-${u}`,h=x("fieldset",{},X("legend",{},K(o.question))),g=X("p",{class:"learn-explanation"},K(o.explanation??"")),p=f=>{h.querySelectorAll("button").forEach((y,z)=>{y.classList.toggle("right",f!==void 0&&o.options[z].correct),y.classList.toggle("wrong",f===z&&!o.options[z].correct),y.setAttribute("aria-pressed",String(f===z))}),g.hidden=f===void 0||!o.explanation};o.options.forEach((f,y)=>{const z=X("button",{class:"learn-option"},K(f.text));z.addEventListener("click",()=>{n&&H.updateLesson(n.id,{quiz:{...a(),[d]:y}}),p(y),l()}),h.append(z)}),h.append(g),p(a()[d]),s.append(h)}),s.append(r),l(),s}}const Ml={left:12,top:10},Al=8,Qe=8e3,ke=16,xt=12,Ci="#fafafa";function Pi(i){const e=i.caption.trim();return e===""?c("diagram_title_placeholder"):e}function jn(i){let e=i.trim().replace(/\.visustruct$/i,"");if(e==="")return"";for(e=e.replace(/\s/g,"-").replace(/[/:\\*?"<>|]/g,"-");e.includes("--");)e=e.replace(/--/g,"-");return e=e.replace(/^-+|-+$/g,""),e.length>120&&(e=e.slice(0,120).replace(/^-+|-+$/g,"")),e}function Zl(i,e){return jn(i.caption)||jn(e)||"VisuStruct"}function Bl(i,e,t){const n=i.split(/\s+/),s=[];let r="";for(const a of n){const l=r?`${r} ${a}`:a;r&&t(l,ke,"bold")>e?(s.push(r),r=a):r=l}if(r&&s.push(r),s.length>2){let a=s.slice(1).join(" ");for(;a.length>1&&t(a+"…",ke,"bold")>e;)a=a.slice(0,-1);return[s[0],a+"…"]}return s}function En(i,e,t,n=320){const s={...i,elements:i.elements.map(Xe)},r=new ei(e,t).layout(s,Ml),a=Math.min(Qe,Math.max(n,r.canvasSize.width)),l=Math.min(Qe,Math.max(n,r.canvasSize.height));if(a<=2||l<=2)return;const o=Bl(Pi(i),a-2*xt,t),u=Math.ceil(ke*1.2),d=Math.min(56,o.length*u+2),h=d+l,g=new ii(e,t).render(r,{width:a,height:l},void 0,Al);g.setAttribute("y",String(d)),g.removeAttribute("class");const p=B("svg",{xmlns:"http://www.w3.org/2000/svg",width:a,height:h,viewBox:`0 0 ${a} ${h}`});p.append(B("rect",{x:0,y:0,width:a,height:h,fill:Ci}));const f=B("text",{x:xt,y:0,"font-family":qe,"font-size":ke,"font-weight":600,fill:"black"});return o.forEach((y,z)=>{const I=B("tspan",{x:xt,y:z*u+ke});I.textContent=y,f.append(I)}),p.append(f,g),{svg:p,width:a,height:h}}function Li(i){return`<?xml version="1.0" encoding="UTF-8"?>
`+new XMLSerializer().serializeToString(i.svg)}async function Wn(i,e){const t=Math.max(1,Math.min(e,Qe/i.width,Qe/i.height)),n=URL.createObjectURL(new Blob([Li(i)],{type:"image/svg+xml"}));try{const s=new Image;s.src=n,await s.decode();const r=document.createElement("canvas");r.width=Math.round(i.width*t),r.height=Math.round(i.height*t);const a=r.getContext("2d");return a.fillStyle=Ci,a.fillRect(0,0,r.width,r.height),a.drawImage(s,0,0,r.width,r.height),r}finally{URL.revokeObjectURL(n)}}function jl(i){return new Promise((e,t)=>i.toBlob(n=>n?e(n):t(new Error("PNG konnte nicht erzeugt werden.")),"image/png"))}function El(i,e){const s=Math.max(1,i),r=Math.max(1,e),a=y=>{const z=y.width-64,I=y.height-64;return{s:Math.min(z/s,I/r)*.98,cw:z,ch:I}},l={width:595,height:842},o={width:842,height:595},u=a(l),d=a(o),[h,g]=d.s>u.s?[o,d]:[l,u],p=s*g.s,f=r*g.s;return{page:h,draw:{x:32+(g.cw-p)/2,y:32+(g.ch-f)/2,width:p,height:f}}}async function Wl(i){const e=new Blob([i]).stream().pipeThrough(new CompressionStream("deflate"));return new Uint8Array(await new Response(e).arrayBuffer())}function Cn(i){let e="FEFF";for(let t=0;t<i.length;t++)e+=i.charCodeAt(t).toString(16).padStart(4,"0").toUpperCase();return`<${e}>`}async function Cl(i,e,t,n,s){const{page:r,draw:a}=El(n.width,n.height),l=await Wl(i),o=I=>(Math.round(I*100)/100).toString(),u=`q ${o(a.width)} 0 0 ${o(a.height)} ${o(a.x)} ${o(r.height-a.y-a.height)} cm /Im0 Do Q`,d=new TextEncoder,h=[["<< /Type /Catalog /Pages 2 0 R >>"],["<< /Type /Pages /Kids [3 0 R] /Count 1 >>"],[`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${r.width} ${r.height}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`],[`<< /Type /XObject /Subtype /Image /Width ${e} /Height ${t} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${l.length} >>
stream
`,l,`
endstream`],[`<< /Length ${u.length} >>
stream
${u}
endstream`],[`<< /Creator ${Cn("VisuStruct")} /Title ${Cn(s)} >>`]],g=[];let p=0;const f=I=>{const _=typeof I=="string"?d.encode(I):I;g.push(_),p+=_.length};f(`%PDF-1.4
%âãÏÓ
`);const y=[];h.forEach((I,_)=>{y.push(p),f(`${_+1} 0 obj
`),I.forEach(f),f(`
endobj
`)});const z=p;f(`xref
0 ${h.length+1}
0000000000 65535 f 
`);for(const I of y)f(`${String(I).padStart(10,"0")} 00000 n 
`);return f(`trailer
<< /Size ${h.length+1} /Root 1 0 R /Info ${h.length} 0 R >>
startxref
${z}
%%EOF
`),new Blob(g,{type:"application/pdf"})}function Pl(i){const{data:e}=i.getContext("2d").getImageData(0,0,i.width,i.height),t=new Uint8Array(i.width*i.height*3);for(let n=0,s=0;n<e.length;n+=4,s+=3)t[s]=e[n],t[s+1]=e[n+1],t[s+2]=e[n+2];return t}const Pn=()=>[{description:c("web_file_type"),accept:{"application/xml":[".visustruct",".strk"]}}],It=i=>c(`element_${m[i]}`),Ll={[m.verzweigung]:"age >= 18",[m.whileSchleife]:"i < 10",[m.doUntilSchleife]:"again == 1",[m.fallauswahl]:"day"},Tl={statement:'int number = 5  |  double x = 1.5  |  String text = "Your text"  |  boolean ok = true  |  const double PI = 3.14',input:'input: int age "Enter age"  |  input: double price "Enter price"  |  input: String name "Enter name"',output:'output: number  |  output: "Your text"  |  output: "Your age: " + age'};function Ln(i){switch(i.type){case m.anweisung:{const e=Ue(i.textLines.join(`
`));return e==="input"?"input:":e==="output"?"output:":void 0}case m.verzweigung:return"if";case m.whileSchleife:case m.doUntilSchleife:return"while";case m.fallauswahl:return"switch";default:return}}function Nl(i){switch(i.type){case m.anweisung:{const e=Ue(i.textLines.join(`
`));return e==="input"?'int age "Enter age"':e==="output"?'"Your age: " + age':c("inspector_placeholder_statement")}case m.verzweigung:case m.whileSchleife:case m.doUntilSchleife:case m.endlosschleife:return c("inspector_placeholder_condition");case m.fallauswahl:return c("inspector_placeholder_selector");case m.aufruf:return c("inspector_placeholder_call");case m.aussprung:return c("inspector_placeholder_break");default:return""}}function E(i,e={},...t){const n=document.createElement(i);for(const[s,r]of Object.entries(e))n.setAttribute(s,r);return n.append(...t),n}const Tn=[{value:1,label:"settings_ui_scale_small"},{value:1.22,label:"settings_ui_scale_medium"},{value:1.5,label:"settings_ui_scale_large"},{value:1.82,label:"settings_ui_scale_extra_large"}],Hl=/Mac|iPhone|iPad/.test(navigator.platform);function le(i,e=!1){return Hl?`${e?"⇧":""}⌘${i}`:[c("web_key_ctrl"),...e?[c("web_key_shift")]:[],i].join("+")}const v=Fl,Nn="visustruct.ui.scale.canvas",Hn="visustruct.learn.open",Vn="visustruct.learn.width",Vl=80;class Gl{constructor(e){b(this,"tabs",[]);b(this,"tabIndex",0);b(this,"nextTabSerial",1);b(this,"clipboard");b(this,"zoom",1);b(this,"simulating",!1);b(this,"exportSelect");b(this,"learn");b(this,"shell");b(this,"learning",!1);b(this,"learnButton");b(this,"exerciseSaveTimer");b(this,"resizeObserver");b(this,"renderedHostSize",{width:-1,height:-1});b(this,"simPath");b(this,"sim");b(this,"simButton");b(this,"coding",!1);b(this,"code");b(this,"codeButton");b(this,"measure",cs());b(this,"metrics",ds());b(this,"engine",new ei(this.metrics,this.measure));b(this,"renderer",new ii(this.metrics,this.measure));b(this,"layout");b(this,"flat",[]);b(this,"canvasHost");b(this,"svg");b(this,"overlay");b(this,"inspector");b(this,"captionInput");b(this,"undoButton");b(this,"redoButton");b(this,"deleteButton");b(this,"statusLine");b(this,"drag");b(this,"downloads",null);b(this,"inViewer","claude"in window);b(this,"tabStrip");this.root=e,this.tabs.push(this.makeTab()),this.learn=new Dl(this.learnHost()),this.shell=document.createElement("div"),this.shell.className="shell",e.replaceWith(this.shell),this.shell.append(this.learn.element,this.learnResizer(),e);const t=zt(Hn),n=new URLSearchParams(location.search).has("learn");this.setLearning(n||(t===null?window.innerWidth>1100:t==="1"),!1);const s=Number(zt(Nn));Tn.some(a=>a.value===s)&&(this.zoom=s),this.buildUI(),this.render(),window.addEventListener("pointermove",a=>this.onPointerMove(a)),window.addEventListener("pointerup",a=>this.onPointerUp(a)),window.addEventListener("pointercancel",()=>this.endDrag()),window.addEventListener("keydown",a=>this.onKeyDown(a)),window.addEventListener("beforeunload",a=>{this.tabs.some(l=>l.dirty&&!l.exerciseId)&&a.preventDefault()}),this.setupFileDrop();const r=window.claude;r==null||r.use("downloads").then(a=>this.downloads=a)}get tab(){return this.tabs[this.tabIndex]}get doc(){return this.tab.doc}set doc(e){this.tab.doc=e}get fileName(){return this.tab.fileName??`${me(this.tab)}.visustruct`}get fileHandle(){return this.tab.fileHandle}set fileHandle(e){this.tab.fileHandle=e}get dirty(){return this.tab.dirty}set dirty(e){this.tab.dirty=e}get undoStack(){return this.tab.undoStack}get redoStack(){return this.tab.redoStack}get selected(){return this.tab.selected}set selected(e){this.tab.selected=e}buildUI(){var l;this.root.className="app",this.root.innerHTML=`
      <header class="toolbar">
        <div class="brand"><span class="logo"></span>VisuStruct <small>${v(c("web_brand_suffix"))}</small></div>
        <div class="group">
          <button data-action="new" title="${v(c("a11y_new_diagram_tab"))}">${v(c("toolbar_new"))}</button>
          <button data-action="open" title="${v(c("menu_open"))} (${le("O")})">${v(c("menu_open"))}</button>
          <button data-action="save" title="${v(c("menu_save"))} (${le("S")})">${v(c("menu_save"))}</button>
          <select data-action="export" title="${v(c("web_export_title"))}">
            <option value="">${v(c("web_export"))}</option>
            <option value="png">${v(c("web_export_png"))}</option>
            <option value="svg">${v(c("web_export_svg"))}</option>
            <option value="pdf">${v(c("web_export_pdf"))}</option>
            <option value="print">${v(c("menu_print"))} (${le("P")})</option>
          </select>
        </div>
        <div class="group">
          <button data-action="undo" title="${v(c("toolbar_undo"))} (${le("Z")})" aria-label="${v(c("toolbar_undo"))}">↶</button>
          <button data-action="redo" title="${v(c("toolbar_redo"))} (${le("Z",!0)})" aria-label="${v(c("toolbar_redo"))}">↷</button>
          <button data-action="cut" title="${v(c("ctx_cut"))} (${le("X")})" aria-label="${v(c("ctx_cut"))}">✂︎</button>
          <button data-action="copy" title="${v(c("ctx_copy"))} (${le("C")})" aria-label="${v(c("ctx_copy"))}">⧉</button>
          <button data-action="paste" title="${v(c("ctx_paste"))} (${le("V")})" aria-label="${v(c("ctx_paste"))}">📋︎</button>
          <button data-action="delete" title="${v(c("action_delete_selection"))} (${v(c("web_key_delete"))})">${v(c("web_delete"))}</button>
        </div>
        <div class="group">
          <select data-action="zoom" title="${v(c("settings_ui_scale_section"))}">${Tn.map(o=>`<option value="${o.value}">${v(c("web_zoom_option_fmt",c(o.label)))}</option>`).join("")}</select>
          <select data-action="language" title="${v(c("web_language_title"))}" aria-label="${v(c("web_language_title"))}">${Ge.map(o=>`<option value="${o.code}" lang="${o.code==="java"?"en":o.code}">${v(o.name)}</option>`).join("")}</select>
        </div>
        <div class="group">
          <button data-action="learn" aria-pressed="false" title="${v(c("web_learn_toggle_title"))}">🎓 ${v(c("web_learn_title"))}</button>
          <button data-action="code" aria-pressed="false" title="${v(c("a11y_generate_code"))}">{ } Code</button>
          <button data-action="simulate" class="sim-toggle" aria-pressed="false" title="${v(c("web_simulation_start_title"))}">▶︎ ${v(c("action_simulation"))}</button>
        </div>
      </header>
      <aside class="palette">
        <h2>${v(c("palette_header"))}</h2>
        <p class="hint">${v(c("web_palette_hint"))}</p>
        <ul></ul>
      </aside>
      <main class="workspace">
        <nav class="tabs" aria-label="${v(c("web_tabs_label"))}"></nav>
        <input class="caption" placeholder="${v(c("diagram_title_placeholder"))}" aria-label="${v(c("diagram_title_label"))}" />
        <div class="canvas" dir="ltr"></div>
      </main>
      <aside class="inspector"></aside>
      <footer class="status"></footer>
      <input type="file" accept=".visustruct,.strk,.xml" hidden />
    `;const e=o=>this.root.querySelector(o);this.canvasHost=e(".canvas"),this.inspector=e(".inspector"),this.captionInput=e(".caption"),this.undoButton=e("[data-action=undo]"),this.redoButton=e("[data-action=redo]"),this.deleteButton=e("[data-action=delete]"),this.statusLine=e(".status"),this.simButton=e("[data-action=simulate]"),this.sim=new wl(()=>this.doc,o=>{this.simPath=o,this.simulating&&this.renderDiagramOnly(),this.scrollToSimPath()},o=>this.findSubprogram(o),()=>this.setSimulating(!1)),this.root.append(this.sim.element),this.simButton.addEventListener("click",()=>this.setSimulating(!this.simulating)),this.codeButton=e("[data-action=code]"),this.code=new or(()=>this.doc,(o,u)=>this.offerDownload(o,new Blob([u],{type:"text/plain"})),()=>this.setCoding(!1),o=>this.commit({...this.doc,pseudocode:o||void 0})),this.root.append(this.code.element),this.codeButton.addEventListener("click",()=>this.setCoding(!this.coding));const t=e(".palette ul");for(const{item:o}of nn){const u=It(Ce(o).type),d=document.createElement("li");d.className="palette-item",d.dataset.item=o,d.append(this.paletteIcon(o),document.createTextNode(u)),d.addEventListener("pointerdown",h=>this.beginDrag(h,{kind:"palette",item:o})),d.tabIndex=0,d.addEventListener("keydown",h=>{(h.key==="Enter"||h.key===" ")&&this.insertNearSelection(Ce(o))}),t.append(d)}this.learnButton=e("[data-action=learn]"),this.learnButton.addEventListener("click",()=>this.setLearning(!this.learning)),this.learnButton.setAttribute("aria-pressed",String(this.learning)),this.tabStrip=e(".tabs"),this.exportSelect=e("[data-action=export]"),this.exportSelect.addEventListener("change",()=>{const o=this.exportSelect.value;this.exportSelect.value="",o&&this.exportDiagram(o)});const n=e("[data-action=language]");n.value=At(),n.addEventListener("change",()=>void this.changeLanguage(n.value));const s=e("[data-action=zoom]");s.value=String(this.zoom),s.addEventListener("change",()=>{this.zoom=Number(s.value),yt(Nn,s.value),this.renderDiagramOnly()}),e("[data-action=cut]").addEventListener("click",()=>this.cutSelection()),e("[data-action=copy]").addEventListener("click",()=>this.copySelection()),e("[data-action=paste]").addEventListener("click",()=>this.paste());const r=e("input[type=file]");r.addEventListener("change",async()=>{var u;const o=(u=r.files)==null?void 0:u[0];r.value="",o&&this.loadXML(await o.text(),o.name)}),e("[data-action=new]").addEventListener("click",()=>this.addTab()),e("[data-action=open]").addEventListener("click",()=>this.open(r)),e("[data-action=save]").addEventListener("click",()=>this.save()),this.undoButton.addEventListener("click",()=>this.undo()),this.redoButton.addEventListener("click",()=>this.redo()),this.deleteButton.addEventListener("click",()=>this.deleteSelection());let a;this.captionInput.addEventListener("focus",()=>a=this.doc),this.captionInput.addEventListener("input",()=>{this.doc={...this.doc,caption:this.captionInput.value},this.dirty=!0,this.updateStatus()}),this.captionInput.addEventListener("change",()=>{a&&a.caption!==this.doc.caption&&this.pushUndo(a),a=this.doc}),this.canvasHost.addEventListener("pointerdown",o=>this.onCanvasPointerDown(o)),(l=this.resizeObserver)==null||l.disconnect(),this.resizeObserver=new ResizeObserver(()=>{const{clientWidth:o,clientHeight:u}=this.canvasHost;o===this.renderedHostSize.width&&u===this.renderedHostSize.height||this.renderDiagramOnly()}),this.resizeObserver.observe(this.canvasHost)}async changeLanguage(e){this.setSimulating(!1),this.setCoding(!1),await li(e),Ti(),this.sim.end(),this.buildUI(),this.render(),this.learn.render()}setLearning(e,t=!0){var n;this.learning=e,this.shell.classList.toggle("learning",e),(n=this.learnButton)==null||n.setAttribute("aria-pressed",String(e)),t&&yt(Hn,e?"1":"0"),this.canvasHost&&this.renderDiagramOnly()}learnHost(){return{openExercise:(e,t)=>{const n=this.tabs.findIndex(r=>r.exerciseId===e.id);if(n>=0){this.switchTab(n),this.setSimulating(!1);return}const s=this.makeTab();s.doc=t,s.exerciseId=e.id,s.selected=t.elements.length>0?[0]:void 0,this.isPristine(this.tab)?this.tabs[this.tabIndex]=s:this.tabs.push(s),this.tabIndex=this.tabs.indexOf(s),this.setSimulating(!1),this.render()},openDiagram:(e,t)=>{this.loadXML(ot(e),e.caption.trim()?`${e.caption.trim()}.visustruct`:t)},exerciseDocument:e=>{var t;return(t=this.tabs.find(n=>n.exerciseId===e))==null?void 0:t.doc},subprogramsFor:e=>{const t=this.tabs.find(n=>n.exerciseId===e);return n=>this.findSubprogram(n,t)},stopSimulation:()=>this.setSimulating(!1),resetExercise:(e,t)=>{const n=this.tabs.find(s=>s.exerciseId===e);n&&(n.undoStack.push(n.doc),n.doc=t,n.redoStack=[],n.selected=[0],n===this.tab&&this.render())},preview:e=>{const t=En(e,this.metrics,this.measure,0);if(!t)return;const n=t.svg.getAttribute("width");return n&&(t.svg.style.maxWidth=`${n}px`),t.svg.removeAttribute("width"),t.svg.removeAttribute("height"),t.svg}}}isPristine(e){return!e.dirty&&!e.fileName&&!e.exerciseId&&e.undoStack.length===0}rememberExercise(){const e=this.tab;e.exerciseId&&(clearTimeout(this.exerciseSaveTimer),this.exerciseSaveTimer=window.setTimeout(()=>{e.exerciseId&&H.updateExercise(e.exerciseId,{xml:ot(e.doc)})},300))}paletteIcon(e){const t=B("svg",{viewBox:"0 0 28 20",width:28,height:20,class:"icon"}),n={fill:"none",stroke:"currentColor","stroke-width":1.5};t.append(B("rect",{x:1,y:1,width:26,height:18,...n}));const s=r=>t.append(B("path",{d:r,...n}));switch(e){case"verzweigung":s("M1 1 L14 10 L27 1 M14 10 V19");break;case"fallauswahl":s("M1 1 L20 10 L27 1 M1 10 H27 M10 10 V19 M20 10 V19");break;case"forZaehlSchleife":case"whileSchleife":s("M7 7 H27 M7 7 V19");break;case"doUntilSchleife":s("M7 1 V13 H27");break;case"endlosschleife":s("M7 6 H27 M7 6 V14 H27");break;case"aufruf":s("M5 1 V19 M23 1 V19");break;case"aussprung":s("M6 1 L1 10 L6 19");break}return t}render(){const e={...this.doc,elements:this.doc.elements.map(Xe)};this.layout=this.engine.layout(e),this.flat=bs(this.layout.elements),this.selected&&!J(this.doc,this.selected)&&(this.selected=void 0);const t=this.zoom,n=this.canvasHost;this.renderedHostSize={width:n.clientWidth,height:n.clientHeight};const s={width:Math.max(320,this.layout.canvasSize.width,Math.floor(n.clientWidth/t)),height:Math.max(240,this.layout.canvasSize.height+60,Math.floor(n.clientHeight/t))};this.renderer.usesSimulationHighlight=this.simulating,this.svg=this.renderer.render(this.layout,s,this.simulating?this.simPath:this.selected),this.svg.setAttribute("width",String(Math.floor(s.width*t))),this.svg.setAttribute("height",String(Math.floor(s.height*t))),this.overlay=B("g",{class:"drop-overlay"}),this.svg.append(this.overlay),this.canvasHost.replaceChildren(this.svg),document.activeElement!==this.captionInput&&(this.captionInput.value=this.doc.caption),this.undoButton.disabled=this.simulating||this.undoStack.length===0,this.redoButton.disabled=this.simulating||this.redoStack.length===0,this.deleteButton.disabled=this.simulating||!this.selected||!at(this.doc,this.selected),this.captionInput.readOnly=this.simulating,this.codeButton.disabled=this.simulating,this.exportSelect.disabled=this.simulating,this.coding&&this.code.refresh(),this.renderTabs(),this.renderInspector(),this.updateStatus()}updateStatus(){this.rememberExercise(),document.title=`${this.dirty?"• ":""}${this.fileName} – VisuStruct Web`,this.statusLine.textContent=`${this.fileName}${this.dirty?` (${c("web_status_modified")})`:""}`}renderInspector(){const e=this.selected,t=e?J(this.doc,e):void 0,n=this.inspector;if(!e||!t){n.replaceChildren(E("h2",{},c("web_inspector_title")),E("p",{class:"hint"},c("inspector_no_selection")),E("p",{class:"hint"},c("web_inspector_help_drop")),E("p",{class:"hint"},c("web_inspector_help_files")));return}if(n.replaceChildren(E("h2",{},`${c("web_inspector_title")} · ${It(t.type)}`)),t.type===m.anweisung){const s=Ue(t.textLines.join(`
`)),r=E("div",{class:"segmented",role:"group","aria-label":c("inspector_io_mode_title")});for(const[a,l]of[["statement",c("inspector_io_mode_statement")],["input",c("inspector_io_mode_input")],["output",c("inspector_io_mode_output")]]){const o=E("button",{"aria-pressed":String(a===s)},l);o.addEventListener("click",()=>{var h,g;const u=((h=J(this.doc,e))==null?void 0:h.textLines.join(`
`))??"";if(a===Ue(u))return;const d=ss(a,u);this.commit(rt(this.doc,e,d.split(`
`))),(g=this.inspector.querySelector("textarea"))==null||g.focus()}),r.append(o)}n.append(r,E("p",{class:"hint mono-hint"},Tl[s]))}if(t.type===m.forSchleife){const s=E("div",{class:"for-fields"}),r=qt(t.textLines);[[c("inspector_for_init"),c("inspector_for_placeholder_init")],[c("inspector_for_condition"),c("inspector_for_placeholder_condition")],[c("inspector_for_step"),c("inspector_for_placeholder_step")]].forEach(([l,o],u)=>{const d=E("input",{placeholder:o,spellcheck:"false",autocomplete:"off"});d.value=r[u],this.liveEdit(d,h=>{const g=J(this.doc,e);if(!g)return;const p=qt(g.textLines);return p[u]=ls(h),rt(this.doc,e,p)}),s.append(E("label",{},l,d))}),n.append(s)}else if(t.type!==m.leerElement){const s=Ll[t.type];s&&n.append(E("p",{class:"hint mono-hint"},s));const r=Ln(t),a=E("textarea",{rows:"3",spellcheck:"false"}),l=t.textLines.join(`
`);a.value=r?Qt(r,l):l,a.placeholder=Nl(t),a.addEventListener("focus",()=>{a.value.trim()==="ø"&&a.select()}),this.liveEdit(a,u=>{const d=Ln(J(this.doc,e)??t),h=d?as(d,Qt(d,u)):u;return rt(this.doc,e,h.split(`
`))});const o=E("div",{class:"editor-row"});r&&o.append(E("span",{class:"fixed-prefix"},r)),o.append(a),n.append(o)}this.renderCaseControls(e)}renderCaseControls(e){var o;const t=ts(e,this.doc);if(!t)return;const n=((o=J(this.doc,t))==null?void 0:o.cases)??[],s=ns(e,t),r=E("div",{class:"case-controls"});if(s!==void 0&&n[s]){const u=E("input",{placeholder:c("web_case_name_placeholder"),spellcheck:"false",autocomplete:"off"});u.value=n[s].name,this.liveEdit(u,d=>d.trim()===""?void 0:es(this.doc,t,s,d)),r.append(E("label",{},c("web_case_name"),u))}const a=E("button",{},`＋ ${c("inspector_add_case")}`);a.addEventListener("click",()=>{const u=Qi(this.doc,t);this.commit(u.doc,u.path)});const l=E("button",{class:"danger-text"},`－ ${c("inspector_remove_case")}`);l.disabled=n.length<=2||s===void 0,l.addEventListener("click",()=>{if(s===void 0)return;const u=qi(this.doc,t,s);this.commit(u.doc,u.path)}),r.append(E("div",{class:"group"},a,l)),this.inspector.append(r)}liveEdit(e,t){let n;e.addEventListener("focus",()=>n=this.doc),e.addEventListener("input",()=>{const s=Yn(e.value);if(s!==e.value){const a=e.selectionStart;e.value=s,e.setSelectionRange(a,a)}const r=t(s);r&&(this.doc=r,this.dirty=!0,this.renderDiagramOnly())}),e.addEventListener("blur",()=>{n&&n!==this.doc&&this.pushUndo(n),n=void 0,this.renderDiagramOnly()})}renderDiagramOnly(){const e=this.selected,t=this.inspector,n=document.createElement("aside");this.inspector=n,this.render(),this.inspector=t,this.selected=e}setSimulating(e){e!==this.simulating&&(document.activeElement instanceof HTMLElement&&document.activeElement.blur(),this.endDrag(),this.simulating=e,this.root.classList.toggle("simulating",e),this.simButton.setAttribute("aria-pressed",String(e)),this.simButton.textContent=e?`✎ ${c("action_diagram")}`:`▶︎ ${c("action_simulation")}`,this.simButton.title=c(e?"web_simulation_end_title":"web_simulation_start_title"),e?(this.setCoding(!1),this.sim.begin()):(this.sim.end(),this.simPath=void 0,!this.selected&&this.doc.elements.length>0&&(this.selected=[0])),this.render())}setCoding(e){e!==this.coding&&(this.coding=e,this.root.classList.toggle("coding",e),this.codeButton.setAttribute("aria-pressed",String(e)),e?this.code.refresh():this.code.close(),this.renderDiagramOnly())}learnResizer(){const e=this.learn.element,t=E("div",{class:"learn-resizer",role:"separator","aria-orientation":"vertical",tabindex:"0",title:c("web_learn_resize")}),n=(a,l)=>{e.style.width=a===void 0?"":`${Gn(a)}px`,l&&yt(Vn,a===void 0?"":String(Gn(a)))},s=Number(zt(Vn));s>0&&n(s,!1);const r=()=>getComputedStyle(this.shell).direction==="rtl"?-1:1;return t.addEventListener("pointerdown",a=>{if(a.button!==0)return;a.preventDefault(),t.setPointerCapture(a.pointerId);const l=a.clientX,o=e.getBoundingClientRect().width,u=r();this.shell.classList.add("resizing");const d=g=>n(o+u*(g.clientX-l),!1),h=g=>{t.removeEventListener("pointermove",d),t.removeEventListener("pointerup",h),t.removeEventListener("pointercancel",h),this.shell.classList.remove("resizing"),n(o+u*(g.clientX-l),!0)};t.addEventListener("pointermove",d),t.addEventListener("pointerup",h),t.addEventListener("pointercancel",h)}),t.addEventListener("dblclick",()=>n(void 0,!0)),t.addEventListener("keydown",a=>{const l=a.key==="ArrowRight"?20:a.key==="ArrowLeft"?-20:0;l&&(a.preventDefault(),n(e.getBoundingClientRect().width+r()*l,!0))}),t}findSubprogram(e,t=this.tab){const n=wt(e);if(n==="")return;const s=this.tabs.find(r=>r!==t&&(wt(r.doc.caption)===n||wt(me(r))===n));return s==null?void 0:s.doc}scrollToSimPath(){const e=this.simPath;if(!this.simulating||!e)return;const t=this.flat.find(l=>Mt(l.idPath,e));if(!t)return;const n=this.canvasHost,s=this.zoom,r={x:t.frame.x*s,y:t.frame.y*s,width:t.frame.width*s,height:t.frame.height*s},a=24;r.y<n.scrollTop?n.scrollTop=Math.max(0,r.y-a):r.y+Math.min(r.height,n.clientHeight-2*a)>n.scrollTop+n.clientHeight&&(n.scrollTop=r.y-a),(r.x<n.scrollLeft||r.x>n.scrollLeft+n.clientWidth-a)&&(n.scrollLeft=Math.max(0,r.x-a))}commit(e,t){this.pushUndo(this.doc),this.doc=e,this.dirty=!0,t&&(this.selected=t),this.render()}pushUndo(e){for(this.undoStack.push(e);this.undoStack.length>Vl;)this.undoStack.shift();this.tab.redoStack=[]}undo(){const e=this.undoStack.pop();e&&(this.redoStack.push(this.doc),this.doc=e,this.dirty=!0,this.selected=Yt(this.selected,this.doc),this.render())}redo(){const e=this.redoStack.pop();e&&(this.undoStack.push(this.doc),this.doc=e,this.dirty=!0,this.selected=Yt(this.selected,this.doc),this.render())}resetHistory(){this.setSimulating(!1),this.tab.undoStack=[],this.tab.redoStack=[],this.selected=void 0,this.dirty=!1,this.render()}makeTab(){return{doc:Xi(),serial:this.nextTabSerial++,dirty:!1,undoStack:[],redoStack:[],selected:[0]}}addTab(e=this.makeTab()){this.setSimulating(!1),this.tabs.push(e),this.tabIndex=this.tabs.length-1,this.render()}switchTab(e){e===this.tabIndex||!this.tabs[e]||(document.activeElement instanceof HTMLElement&&document.activeElement.blur(),this.setSimulating(!1),this.tabIndex=e,this.render())}async closeTab(e){if(this.tabs.length<=1)return;const t=this.tabs[e];t.dirty&&!t.exerciseId&&(this.switchTab(e),!await this.confirmDiscard())||(this.setSimulating(!1),this.tabs.splice(e,1),(this.tabIndex>e||this.tabIndex>=this.tabs.length)&&(this.tabIndex=Math.max(0,this.tabIndex-1)),this.render())}renderTabs(){const e=this.tabStrip;e.replaceChildren(),this.tabs.forEach((n,s)=>{const r=document.createElement("div");r.className="tab"+(s===this.tabIndex?" active":""),r.setAttribute("role","tab"),r.setAttribute("aria-selected",String(s===this.tabIndex));const a=document.createElement("button");if(a.className="tab-label",a.textContent=(n.dirty?"• ":"")+me(n),a.title=n.fileName??me(n),a.addEventListener("click",()=>this.switchTab(s)),r.append(a),this.tabs.length>1){const l=document.createElement("button");l.className="tab-close",l.textContent="✕",l.title=c("a11y_close_tab"),l.setAttribute("aria-label",`${c("a11y_close_tab")}: ${me(n)}`),l.addEventListener("click",()=>this.closeTab(s)),r.append(l)}e.append(r)});const t=document.createElement("button");t.className="tab-add",t.textContent="+",t.title=c("a11y_new_diagram_tab"),t.setAttribute("aria-label",c("a11y_new_diagram_tab")),t.addEventListener("click",()=>this.addTab()),e.append(t)}copySelection(){const e=this.selected&&J(this.doc,this.selected);return e?(this.clipboard=structuredClone(e),this.showMessage(c("web_copied")),!0):!1}cutSelection(){this.selected&&at(this.doc,this.selected)&&this.copySelection()&&this.deleteSelection()}paste(){this.clipboard&&this.insertNearSelection(structuredClone(this.clipboard))}deleteSelection(){!this.selected||!at(this.doc,this.selected)||(this.commit(De(this.doc,this.selected)),this.selected=void 0,this.render())}insertNearSelection(e){const t=this.selected;if(t&&be(this.doc,t))return this.commit(ue(this.doc,t,e),t);if(t){const n=[...t.slice(0,-1),t[t.length-1]+1];return this.commit(vt(this.doc,e,t),n)}if(this.doc.elements.length===1&&be(this.doc,[0]))return this.commit(ue(this.doc,[0],e),[0]);this.commit(ye(this.doc,[],this.doc.elements.length,e),[this.doc.elements.length])}confirmDiscard(){return this.dirty?new Promise(e=>{const t=document.createElement("div");t.className="confirm",t.innerHTML=`<div class="confirm-card" role="alertdialog" aria-label="${v(c("close_unsaved_title"))}">
        <p><strong>${v(c("close_unsaved_title"))}</strong></p>
        <p class="hint">${v(c("web_discard_message_fmt",this.fileName))}</p>
        <div class="group"><button data-r="0">${v(c("close_unsaved_cancel"))}</button><button data-r="1" class="danger">${v(c("close_unsaved_discard"))}</button></div>
      </div>`,t.addEventListener("click",n=>{const s=n.target.dataset.r;s===void 0&&n.target!==t||(t.remove(),e(s==="1"))}),document.body.append(t),t.querySelector('[data-r="0"]').focus()}):Promise.resolve(!0)}showMessage(e){this.statusLine.textContent=e,this.statusLine.classList.add("message"),setTimeout(()=>{this.statusLine.classList.remove("message"),this.updateStatus()},6e3)}loadXML(e,t,n){let s;try{s=Ht(e)}catch(r){this.showMessage(c("web_err_unreadable_fmt",t,r.message));return}(this.dirty||this.tab.fileName||this.tab.exerciseId)&&this.addTab(),this.doc=s,this.tab.fileName=t.replace(/\.(strk|xml)$/i,".visustruct"),this.fileHandle=n&&/\.visustruct$/i.test(t)?n:void 0,this.resetHistory()}async open(e){const t=window;if(!t.showOpenFilePicker||this.inViewer)return e.click();try{const[n]=await t.showOpenFilePicker({types:Pn()}),s=await n.getFile();this.loadXML(await s.text(),s.name,n)}catch{}}async save(){var n,s;const e=new Blob([ot(this.doc)],{type:"application/xml"}),t=window;try{if(this.downloads){const r=this.fileName+".txt";await this.downloads.save({filename:r,data:e}),(n=this.tab).fileName??(n.fileName=this.fileName),this.dirty=!1,this.render(),this.showMessage(c("web_saved_txt_fmt",r));return}if(!this.fileHandle&&t.showSaveFilePicker&&!this.inViewer&&(this.fileHandle=await t.showSaveFilePicker({suggestedName:this.fileName,types:Pn()}),this.tab.fileName=this.fileHandle.name),this.fileHandle){const r=await this.fileHandle.createWritable();await r.write(e),await r.close()}else{const r=document.createElement("a");r.href=URL.createObjectURL(e),r.download=this.fileName,r.click(),setTimeout(()=>URL.revokeObjectURL(r.href),1e3)}(s=this.tab).fileName??(s.fileName=this.fileName),this.dirty=!1,this.render()}catch{}}async exportDiagram(e){const t=En(this.doc,this.metrics,this.measure);if(!t){this.showMessage(c(e==="print"?"err_diagram_too_small_print":"err_diagram_too_small_export"));return}const n=Zl(this.doc,me(this.tab)),s=Math.max(2,window.devicePixelRatio||1)*this.zoom;try{switch(e){case"svg":{t.svg.setAttribute("width",String(t.width*this.zoom)),t.svg.setAttribute("height",String(t.height*this.zoom)),await this.offerDownload(`${n}.svg`,new Blob([Li(t)],{type:"image/svg+xml"}));break}case"png":{const r=await Wn(t,s);await this.offerDownload(`${n}.png`,await jl(r));break}case"pdf":{const r=await Wn(t,Math.max(s,3)),a=await Cl(Pl(r),r.width,r.height,t,Pi(this.doc));await this.offerDownload(`${n}.pdf`,a);break}case"print":this.printDiagram(t);break}}catch(r){this.showMessage(c("web_export_failed_fmt",r instanceof Error?r.message:String(r)))}}printDiagram(e){const t=document.createElement("div");t.className="print-sheet",e.svg.removeAttribute("width"),e.svg.removeAttribute("height"),t.append(e.svg),document.body.append(t);const n=()=>t.remove();window.addEventListener("afterprint",n,{once:!0});try{window.print()}catch{n(),this.showMessage(`${c("err_print_unavailable")} ${c("web_print_hint")}`);return}setTimeout(n,6e4)}async offerDownload(e,t){try{if(this.downloads){try{await this.downloads.save({filename:e,data:t}),this.showMessage(c("web_saved_fmt",e))}catch{await this.downloads.save({filename:e+".txt",data:t}),this.showMessage(c("web_saved_txt_fmt",e+".txt"))}return}const n=document.createElement("a");n.href=URL.createObjectURL(t),n.download=e,n.click(),setTimeout(()=>URL.revokeObjectURL(n.href),1e3)}catch{this.showMessage(c("err_save_failed_fmt",e))}}setupFileDrop(){window.addEventListener("dragover",e=>{var t;(t=e.dataTransfer)!=null&&t.types.includes("Files")&&(e.preventDefault(),this.root.classList.add("file-drag"))}),window.addEventListener("dragleave",e=>{e.relatedTarget===null&&this.root.classList.remove("file-drag")}),window.addEventListener("drop",async e=>{var n;this.root.classList.remove("file-drag");const t=(n=e.dataTransfer)==null?void 0:n.files[0];t&&(e.preventDefault(),this.loadXML(await t.text(),t.name))})}onKeyDown(e){var s;const t=e.metaKey||e.ctrlKey,n=e.target instanceof HTMLTextAreaElement||e.target instanceof HTMLInputElement;if(t&&e.key.toLowerCase()==="s")e.preventDefault(),this.save();else if(t&&e.key.toLowerCase()==="p")e.preventDefault(),this.simulating||this.exportDiagram("print");else if(t&&e.key.toLowerCase()==="o")e.preventDefault(),this.open(this.root.querySelector("input[type=file]"));else{if(n||this.simulating)return;t&&e.key.toLowerCase()==="z"?(e.preventDefault(),e.shiftKey?this.redo():this.undo()):t&&e.key.toLowerCase()==="c"&&!((s=getSelection())!=null&&s.toString())?this.copySelection()&&e.preventDefault():t&&e.key.toLowerCase()==="x"?(e.preventDefault(),this.cutSelection()):t&&e.key.toLowerCase()==="v"?(e.preventDefault(),this.paste()):t&&e.key.toLowerCase()==="y"?(e.preventDefault(),this.redo()):e.key==="Delete"||e.key==="Backspace"?(e.preventDefault(),this.deleteSelection()):e.key==="Escape"&&(this.drag?this.endDrag():(this.selected=void 0,this.render()))}}svgPoint(e,t){if(!this.svg)return;const n=this.svg.getBoundingClientRect(),s=e-n.left,r=t-n.top;if(!(s<0||r<0||s>n.width||r>n.height))return{x:s/this.zoom,y:r/this.zoom}}nodeAt(e,t){for(let n=this.flat.length-1;n>=0;n--){const s=this.flat[n].frame;if(e>=s.x&&e<=s.x+s.width&&t>=s.y&&t<=s.y+s.height)return this.flat[n]}}onCanvasPointerDown(e){if(this.simulating)return;const t=this.svgPoint(e.clientX,e.clientY);if(!t)return;document.activeElement instanceof HTMLElement&&document.activeElement.blur();const n=this.nodeAt(t.x,t.y),s=n&&this.selected&&Mt(n.idPath,this.selected);this.selected=n==null?void 0:n.idPath,this.render(),n&&e.pointerType!=="touch"&&!(be(this.doc,n.idPath)&&!s)&&this.beginDrag(e,{kind:"move",path:n.idPath})}beginDrag(e,t){e.button!==0||this.simulating||(e.preventDefault(),this.drag={source:t,pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,active:!1})}onPointerMove(e){const t=this.drag;if(!t||e.pointerId!==t.pointerId)return;if(!t.active){if(Math.hypot(e.clientX-t.startX,e.clientY-t.startY)<5)return;t.active=!0,t.ghost=this.makeGhost(t.source),document.body.append(t.ghost),this.root.classList.add("dragging")}t.ghost.style.transform=`translate(${e.clientX+12}px, ${e.clientY+12}px)`,this.autoScroll(e.clientX,e.clientY);const n=this.svgPoint(e.clientX,e.clientY);t.target=n?this.dropTargetAt(n.x,n.y,t.source):void 0,this.showDropTarget(t.target)}onPointerUp(e){const t=this.drag;!t||e.pointerId!==t.pointerId||(t.active&&t.target?this.applyDrop(t.source,t.target):!t.active&&t.source.kind==="palette"&&this.insertNearSelection(Ce(t.source.item)),this.endDrag())}endDrag(){var e,t;(t=(e=this.drag)==null?void 0:e.ghost)==null||t.remove(),this.drag=void 0,this.root.classList.remove("dragging"),this.showDropTarget(void 0)}makeGhost(e){const t=document.createElement("div");if(t.className="drag-ghost",e.kind==="palette")t.textContent=nn.find(n=>n.item===e.item).label;else{const n=q(this.doc,e.path);t.textContent=`${It(n.type)}: ${Ct(n)[0]}`}return t}autoScroll(e,t){const n=this.canvasHost.getBoundingClientRect(),s=40,r=12;t>n.bottom-s&&t<n.bottom+s?this.canvasHost.scrollTop+=r:t<n.top+s&&t>n.top-s&&(this.canvasHost.scrollTop-=r),e>n.right-s&&e<n.right+s?this.canvasHost.scrollLeft+=r:e<n.left+s&&e>n.left-s&&(this.canvasHost.scrollLeft-=r)}dropTargetAt(e,t,n){var o;const s=((o=this.layout)==null?void 0:o.elements)??[],r=this.nodeAt(e,t);if(!r){const u=s[s.length-1];if(!u)return;const d=u.frame.y+u.frame.height;return t>d?n.kind==="move"&&n.path.length===1&&n.path[0]===s.length-1?void 0:{kind:"rootAppend",frame:{x:u.frame.x,y:d,width:u.frame.width,height:0}}:t<s[0].frame.y?{kind:"before",path:[0],frame:s[0].frame}:void 0}const a=r.idPath;return n.kind==="move"&&a.length>=n.path.length&&n.path.every((u,d)=>a[d]===u)?void 0:be(this.doc,a)?{kind:"replace",path:a,frame:r.frame}:{kind:t<r.frame.y+r.frame.height/2?"before":"after",path:a,frame:r.frame}}showDropTarget(e){if(!this.overlay||(this.overlay.replaceChildren(),!e))return;const t=e.frame;if(e.kind==="replace"){this.overlay.append(B("rect",{x:t.x+2,y:t.y+2,width:t.width-4,height:t.height-4,class:"drop-replace"}));return}const n=e.kind==="before"?t.y:t.y+t.height;this.overlay.append(B("rect",{x:t.x,y:n-3,width:t.width,height:6,rx:3,class:"drop-line"}))}applyDrop(e,t){const n=this.doc;try{if(e.kind==="palette"){const r=Ce(e.item);switch(t.kind){case"replace":return this.commit(ue(n,t.path,r),t.path);case"before":return this.commit(On(n,r,t.path),t.path);case"after":return this.commit(vt(n,r,t.path),[...t.path.slice(0,-1),t.path[t.path.length-1]+1]);case"rootAppend":return this.commit(ye(n,[],n.elements.length,r),[n.elements.length])}}const s=e.path;switch(t.kind){case"replace":return this.commit(Ki(n,s,t.path));case"before":return this.commit(Yi(n,s,t.path));case"after":return this.commit(Ji(n,s,t.path));case"rootAppend":{const r=q(n,s);return this.commit(ye(De(n,s),[],Number.MAX_SAFE_INTEGER,r))}}}catch(s){console.warn("Ablegen nicht möglich",s)}finally{e.kind==="move"&&(this.selected=void 0,this.render())}}}function Ti(){Oi({[m.anweisung]:c("canvas_stub_anweisung"),[m.verzweigung]:c("canvas_stub_condition"),[m.fallauswahl]:c("canvas_stub_fallauswahl"),[m.forSchleife]:c("canvas_stub_for"),[m.whileSchleife]:c("canvas_stub_while"),[m.doUntilSchleife]:c("canvas_stub_while"),[m.endlosschleife]:c("canvas_stub_endless"),[m.aussprung]:c("canvas_stub_break"),[m.aufruf]:c("canvas_stub_call")})}function wt(i){return Mi(i).toLowerCase()}function me(i){return i.fileName?i.fileName.replace(/\.(visustruct|strk)$/i,""):i.doc.caption.trim()||c("tab_title_format",i.serial)}function Gn(i){return Math.round(Math.max(260,Math.min(i,720,window.innerWidth-420)))}function zt(i){try{return localStorage.getItem(i)}catch{return null}}function yt(i,e){try{localStorage.setItem(i,e)}catch{}}function Fl(i){return i.replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e])}li(Ss(),!1).then(()=>{Ti(),new Gl(document.getElementById("app"))});
