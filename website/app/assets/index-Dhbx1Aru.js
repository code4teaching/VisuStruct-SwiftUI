var jn=Object.defineProperty;var On=(i,t,e)=>t in i?jn(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var p=(i,t,e)=>On(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();var d=(i=>(i[i.anweisung=0]="anweisung",i[i.verzweigung=1]="verzweigung",i[i.fallauswahl=2]="fallauswahl",i[i.forSchleife=3]="forSchleife",i[i.whileSchleife=4]="whileSchleife",i[i.doUntilSchleife=5]="doUntilSchleife",i[i.endlosschleife=6]="endlosschleife",i[i.aussprung=7]="aussprung",i[i.aufruf=8]="aufruf",i[i.leerElement=9]="leerElement",i))(d||{});function Nn(i){return i===3||i===4||i===5||i===6}function Fn(i){return i===1||i===2}function W(i,t={}){return{type:i,zoomX:0,zoomY:0,textLines:[""],...t}}function Rn(i){const t=i.textLines;if(!t.every(e=>e.trim()===""))switch(i.type){case d.forSchleife:return t.length<=1?t:[Wn(t)];case d.verzweigung:return vt("if",t);case d.whileSchleife:return vt("while",t);case d.doUntilSchleife:return vt("while",Hn(t));case d.fallauswahl:return vt("switch",t);default:return t}}function Hn(i){if(i.length===0)return i;const t=i[0].trim(),e=t.toLowerCase(),n=[...i];if(e==="until")n[0]="";else if(e.startsWith("until "))n[0]=t.slice(6).trim();else if(e.startsWith("until("))n[0]=t.slice(5);else return i;return n}function fe(i){const t=new Set(["if","for","while","until","switch"]),e=["input:","output:","print:"],n=i.trim(),s=n.toLowerCase();for(const a of e){if(s===a)return{keyword:n,rest:""};if(s.startsWith(a+" "))return{keyword:n.slice(0,a.length),rest:n.slice(a.length).trim()}}const r=n.indexOf(" ");if(r<0)return;const o=n.slice(0,r);if(t.has(o.toLowerCase()))return{keyword:o,rest:n.slice(r+1).trim()}}function vt(i,t){if(t.length===0)return t;const e=t[0].trim(),n=e.toLowerCase();if(n===i||n.startsWith(i+" "))return t;const s=[...t];return s[0]=i+" "+e,s}function Wn(i){let t=[...i];for(;t.length<3;)t.push("");t=t.slice(0,3);const e=s=>{let r=s.trim();for(;r.endsWith(";");)r=r.slice(0,-1).trim();return r},n=t.map(e).join("; ").trim();return n===""?"for":"for "+n}const Ze={[d.anweisung]:"Anweisung",[d.verzweigung]:"Bedingung",[d.fallauswahl]:"Fallauswahl",[d.forSchleife]:"for 0 < i < anzahl",[d.whileSchleife]:"while …",[d.doUntilSchleife]:"while …",[d.endlosschleife]:"endless",[d.aussprung]:"break",[d.aufruf]:"Aufruf()",[d.leerElement]:"ø"};function Un(i){Object.assign(Ze,i)}function oe(i){return Rn(i)??[Ze[i.type]]}class M extends Error{}const J=i=>structuredClone(i);function pt(){return W(d.anweisung,{textLines:["ø"]})}function Xn(){return{caption:"",elements:[pt()]}}function Ge(i){if(i.type===d.leerElement)return!0;if(i.type===d.anweisung){const t=i.textLines;return t.length===0||t.length===1&&t[0]==="ø"}return!1}function rt(i,t){const e=H(i,t);return e!==void 0&&Ge(e)}function xt(i,t){if(t.length===0)throw new M("Invalid element path.");const[e,...n]=t;if(e<0||e>=i.length)throw new M("Invalid element path.");if(n.length===0)return{list:i,index:e};const[s,...r]=n;if(r.length===0)throw new M("Invalid element path.");return xt(Qe(i[e],s),r)}function Qe(i,t){if(Nn(i.type)){if(t!==0||!i.loopBody)throw new M("Invalid element path.");return i.loopBody}if(Fn(i.type)){if(!i.cases||t<0||t>=i.cases.length)throw new M("Invalid element path.");return i.cases[t].elements}throw new M("Invalid element path.")}function U(i,t){const{list:e,index:n}=xt(i.elements,t);return e[n]}function H(i,t){try{return U(i,t)}catch{return}}function tt(i,t,e){const n=J(i),{list:s,index:r}=xt(n.elements,t);return s[r]=J(e),n}function Nt(i,t,e){const n=J(U(i,t));return n.textLines=e.length===0?[""]:e,tt(i,t,n)}function Ft(i,t){return t.length===0?!1:t.length===1&&i.elements.length===1?!rt(i,t):H(i,t)!==void 0}function ft(i,t){const e=J(i),{list:n,index:s}=xt(e.elements,t);if(t.length===1&&n.length===1){if(Ge(n[0]))throw new M("The last root element cannot be deleted.");return n[0]=pt(),e}return n.splice(s,1),t.length>1&&n.length===0&&n.push(pt()),e}function ut(i,t,e,n){const s=J(i);let r;if(t.length===0)r=s.elements;else{const o=t.slice(0,-1),a=t[t.length-1],{list:h,index:l}=xt(s.elements,o);r=Qe(h[l],a)}return r.splice(Math.min(Math.max(0,e),r.length),0,J(n)),s}function tn(i,t,e){if(e.length===0)throw new M("Invalid element path.");return ut(i,e.slice(0,-1),e[e.length-1],t)}function Kt(i,t,e){if(e.length===0)throw new M("Invalid element path.");return ut(i,e.slice(0,-1),e[e.length-1]+1,t)}function ae(i,t){return i.length<t.length&&i.every((e,n)=>t[n]===e)}function le(i,t){if(t.length===0)return i;const e=t[t.length-1],n=t.slice(0,-1);if(i.length<=n.length||!n.every((o,a)=>i[a]===o))return i;const s=n.length;if(i[s]<=e)return i;const r=[...i];return r[s]-=1,r}const ce=(i,t)=>i.length===t.length&&i.every((e,n)=>e===t[n]);function qn(i,t,e){if(ce(t,e))return i;if(ae(t,e))throw new M("Invalid element path.");const n=U(i,t),s=ft(i,t);return tn(s,n,le(e,t))}function Jn(i,t,e){if(ce(t,e))return i;if(ae(t,e))throw new M("Invalid element path.");const n=U(i,t),s=ft(i,t);return Kt(s,n,le(e,t))}function Yn(i,t,e){if(!rt(i,e))throw new M("Invalid element path.");if(ce(t,e))return i;if(ae(t,e))throw new M("Invalid element path.");const n=U(i,t),s=ft(i,t);return tt(s,le(e,t),n)}function Kn(i,t){const e=J(U(i,t)),n=e.cases;if(e.type!==d.fallauswahl||!n||n.length===0)throw new M("Invalid element path.");const s=n[n.length-1].name.toLowerCase()==="default",r=s?n.length-1:n.length,o=String(s?n.length:n.length+1);return n.splice(r,0,{name:o,elements:[pt()]}),{doc:tt(i,t,e),path:[...t,r,0]}}function Zn(i,t,e){const n=J(U(i,t)),s=n.cases;if(n.type!==d.fallauswahl||!s)throw new M("Invalid element path.");if(s.length<=2)throw new M("A switch needs at least two cases.");if(e<0||e>=s.length)throw new M("Invalid element path.");s.splice(e,1);const r=Math.min(e,s.length-1);return{doc:tt(i,t,n),path:[...t,r,0]}}function Gn(i,t,e,n){const s=J(U(i,t)),r=s.cases;if(s.type!==d.fallauswahl||!r)throw new M("Invalid element path.");if(e<0||e>=r.length)throw new M("Invalid element path.");const o=n.trim();if(o==="")throw new M("Invalid element path.");return r[e].name=o,tt(i,t,s)}function Qn(i,t){var e;if(!(!i||i.length===0))for(let n=i.length;n>=1;n--){const s=i.slice(0,n);if(((e=H(t,s))==null?void 0:e.type)===d.fallauswahl)return s}}function ti(i,t){if(!(!i||i.length<=t.length))return i[t.length]}function ge(i,t){if(t.elements.length!==0)return!i||!H(t,i)?[0]:i}const en=i=>i!==void 0&&/\s/.test(i);function Bt(i){const t=i.trim().toLowerCase();return t.startsWith("input:")?"input":t.startsWith("output:")||t.startsWith("print:")?"output":"statement"}function ei(i){const t=i.trim(),e=t.toLowerCase();return e.startsWith("input:")?t.slice(6).trim():e.startsWith("output:")?t.slice(7).trim():e.startsWith("print:")?t.slice(6).trim():i}function ye(i,t){const e=t.trim();return e===""?`${i} `:`${i} ${e}`}function ni(i,t){const e=ei(t);switch(i){case"statement":return e;case"input":return ye("input:",e);case"output":return ye("output:",e)}}const $t=i=>en(i[0])?i.slice(1):i;function ii(i){const t=i.replace(/^\s+/,""),e=t.toLowerCase();return e.startsWith("input:")?$t(t.slice(6)):e.startsWith("output:")?$t(t.slice(7)):e.startsWith("print:")?$t(t.slice(6)):i}function xe(i,t){const e=t.replace(/^\s+/,"");if(!e.toLowerCase().startsWith(i.toLowerCase()))return t;const n=e.slice(i.length);if(!(n===""||en(n[0])||n[0]==="("))return t;const s=$t(n);return s.startsWith("(")&&s.endsWith(")")&&s.length>=2?s.slice(1,-1):s}function ve(i,t){if(i==="input:"||i==="output:")return ii(t);const e=xe(i,t);if(i==="while"&&e===t){const n=xe("until",t);if(n!==t)return n}return e}function si(i,t){return t===""?`${i} `:`${i} ${t}`}function nn(i){return i.replace(/[“”„«»]/g,'"').replace(/[’‘‚´]/g,"'")}function we(i){const t=i.length===0?[""]:i.slice(0,3);for(;t.length<3;)t.push("");return t}function ri(i){let t=nn(i);for(;;){const e=t.trim();if(!e.endsWith(";"))return t;t=e.slice(0,-1).trim()}}const ue='system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';function oi(i,t){return`${t==="bold"?700:500} ${i}px ${ue}`}const sn=(i,t,e)=>[...i].length*t*(e==="bold"?.68:.62);function ai(){const i=typeof document<"u"?document.createElement("canvas").getContext("2d"):null;if(!i)return sn;const t=new Map;return(e,n,s)=>{const r=`${n}|${s}|${e}`;let o=t.get(r);return o===void 0&&(i.font=oi(n,s),o=i.measureText(e).width,t.size>2e3&&t.clear(),t.set(r,o)),o}}const rn={fontSize:15,lineHeight:20,charWidth:7,baseHeaderExtra:20,minSidePadding:42,cellTextInsetY:15,doUntilDoLabelTopInset:2,doUntilFooterTopInset:6,doUntilFooterBottomInset:8};function li(i){return{...rn,fontSize:14,lineHeight:21,charWidth:5.5*(14/12),baseHeaderExtra:21,minSidePadding:40}}const wt=i=>i===d.forSchleife||i===d.whileSchleife||i===d.doUntilSchleife||i===d.endlosschleife,bt=i=>i===d.fallauswahl||i===d.verzweigung;function _t(i,t,e,n=0){return{idPath:i,element:t,frame:e,headerBandHeight:n,topBandHeight:0,loopBodyLeadingInset:0,caseColumnFrames:[],children:[]}}function O(i){return{...i,frame:{...i.frame}}}class on{constructor(t=rn,e=sn){this.metrics=t,this.measure=e}layout(t,e={left:28,top:28}){const s=this.layoutList(t.elements,e.left,e.top,[]).map(h=>this.stretchLoopBodiesVertically(h));let r=0,o=0;const a=h=>{r=Math.max(r,h.frame.x+h.frame.width),o=Math.max(o,h.frame.y+h.frame.height),h.children.forEach(a)};return s.forEach(a),{canvasSize:{width:r+e.left,height:o+e.top},elements:s}}lineWidth(t){return Math.ceil(this.measure(t,this.metrics.fontSize,"medium"))}lineWidthBold(t){return Math.ceil(this.measure(t,this.metrics.fontSize,"bold"))}layoutList(t,e,n,s){let r=[],o=n;t.forEach((h,l)=>{const u=this.layoutElement(h,e,o,[...s,l]);r.push(u),o+=u.frame.height});const a=Math.max(0,...r.map(h=>h.frame.width));return a>0&&(r=r.map(h=>this.stretchNodeTreeToWidth(h,a))),r}stretchMultiwayNodeToWidth(t,e){const n=O(t),s=n.frame.width;if(!(s>0)||n.caseColumnFrames.length===0)return n;const r=e/s;n.frame.width=e;let o=n.frame.x;const a=n.caseColumnFrames.map(h=>{const l=h.width*r,u={x:o,y:h.y,width:l,height:h.height};return o+=l,u});return n.caseColumnFrames=a,n.dividerX=a.length>0?a[a.length-1].x:n.frame.x+e,n.columns&&n.columns.length===a.length&&(n.columns=n.columns.map((h,l)=>{const u=a[l];return h.map(m=>{const g=O(m);return g.frame.x=u.x,g.frame.width=u.width,this.stretchDescendantsWidths(g,u.width)})}),n.children=n.columns.flat()),n}stretchLoopChildren(t,e){const n=this.effectiveLoopBodyLeading(t),s=Math.max(0,e-n);t.children=t.children.map(r=>{const o=O(r);return o.frame.x=t.frame.x+n,o.frame.width=s,this.stretchDescendantsWidths(o,s)})}stretchNodeTreeToWidth(t,e){const n=O(t);return n.frame.width>0?bt(n.element.type)&&n.caseColumnFrames.length>0?this.stretchMultiwayNodeToWidth(n,e):(n.frame.width=e,wt(n.element.type)?this.stretchLoopChildren(n,e):n.children=n.children.map(r=>this.stretchDescendantsWidths(r,e)),n):n}stretchDescendantsWidths(t,e){let n=O(t);return bt(n.element.type)?n=this.stretchNodeTreeToWidth(n,e):wt(n.element.type)?(n.frame.width=e,this.stretchLoopChildren(n,e)):(n.frame.width=e,n.children=n.children.map(s=>this.stretchDescendantsWidths(s,e))),n}stretchLoopBodiesVertically(t){const e=O(t);if(e.columns&&e.columns.length>0)return e.columns=e.columns.map(r=>r.map(o=>this.stretchLoopBodiesVertically(o))),e.children=e.columns.flat(),e;e.children=e.children.map(r=>this.stretchLoopBodiesVertically(r));const n=r=>r===d.anweisung||r===d.leerElement||r===d.aufruf||r===d.aussprung||wt(r);let s;switch(e.element.type){case d.forSchleife:case d.whileSchleife:case d.endlosschleife:{const r=e.element.type===d.endlosschleife?40:0;s=e.frame.y+e.frame.height-r;break}case d.doUntilSchleife:s=e.frame.y+e.frame.height-e.headerBandHeight;break}if(s!==void 0&&e.children.length>0){const r=e.children.length-1;let o=O(e.children[r]);const a=s-(o.frame.y+o.frame.height);a>.5&&n(o.element.type)&&(o.frame.height+=a,o=this.stretchLoopBodiesVertically(o),e.children=[...e.children.slice(0,r),o])}return e}headerHeight(t){const e=this.metrics,n=Math.max(1,t.textLines.length);if(t.type===d.doUntilSchleife)return e.doUntilFooterTopInset+n*e.lineHeight+e.doUntilFooterBottomInset+t.zoomY;let s;switch(t.type){case d.fallauswahl:s=40;break;case d.verzweigung:s=20;break;case d.forSchleife:case d.whileSchleife:case d.endlosschleife:s=e.baseHeaderExtra+4;break;default:s=14}return s+n*e.lineHeight+t.zoomY}doUntilBodyLeadingInset(){return Math.max(20,this.lineWidthBold("do")+12)}effectiveLoopBodyLeading(t){return t.element.type===d.doUntilSchleife?t.loopBodyLeadingInset>0?t.loopBodyLeadingInset:this.doUntilBodyLeadingInset():20}horizontalPaddingInsideCell(t){return bt(t)?Math.max(100,this.metrics.minSidePadding*2.45):this.metrics.minSidePadding}minWidth(t){const e=t.textLines.length===0?0:Math.max(...t.textLines.map(r=>this.lineWidth(r)));let n=e+t.zoomX+this.horizontalPaddingInsideCell(t.type);if(t.type===d.aufruf){const r=Math.max(68,this.metrics.minSidePadding*1.7),o=Math.max(8,this.metrics.minSidePadding*.2);n=Math.max(n,e+t.zoomX+r+o)}const s=t.type===d.leerElement?76:t.type===d.aufruf?104:72;return Math.max(s,n)}layoutElement(t,e,n,s){if(bt(t.type))return this.layoutMultiway(t,e,n,s);if(wt(t.type))return this.layoutLoop(t,e,n,s);const r=this.headerHeight(t);return _t(s,t,{x:e,y:n,width:this.minWidth(t),height:r},r)}layoutLoop(t,e,n,s){const r=v=>v.reduce((x,z)=>x+z.frame.height,0),o=v=>Math.max(0,...v.map(x=>x.frame.width)),a=t.loopBody??[];if(t.type===d.doUntilSchleife){const v=this.doUntilBodyLeadingInset(),x=t.zoomY,z=this.headerHeight(t),V=this.layoutList(a,e+v,n+x,[...s,0]),k=Math.max(this.minWidth(t),o(V)+v),S=r(V)+z+x,E=Math.max(0,k-v),I=_t(s,t,{x:e,y:n,width:k,height:S},z);return I.topBandHeight=x,I.loopBodyLeadingInset=v,I.children=V.map(A=>{const B=O(A);return B.frame.x=e+v,B.frame.width=E,this.stretchDescendantsWidths(B,E)}),I}const h=20,l=this.headerHeight(t),u=t.type===d.endlosschleife?40:0,m=this.layoutList(a,e+h,n+l,[...s,0]),g=Math.max(this.minWidth(t),o(m)+h),b=l+u+r(m),y=Math.max(0,g-h),L=_t(s,t,{x:e,y:n,width:g,height:b},l);return L.children=m.map(v=>{const x=O(v);return x.frame.x=e+h,x.frame.width=y,this.stretchDescendantsWidths(x,y)}),L}layoutMultiway(t,e,n,s){const r=this.headerHeight(t),o=t.cases??[],a=Math.max(1,o.length),h=Math.max(this.minWidth(t)/a,132);let l=[],u=[],m=0,g=0;if(o.forEach((v,x)=>{const z=e+m,V=this.layoutList(v.elements,z,n+r,[...s,x]),k=Math.max(0,...V.map(I=>I.frame.width));let S;t.type===d.verzweigung&&a===2?S=Math.max(k,(x===0?"true":"false").length*this.metrics.charWidth+24):S=Math.max(h,k);const E=V.reduce((I,A)=>I+A.frame.height,0);g=Math.max(g,E),l.push({x:z,y:n+r,width:S,height:E}),u.push(V.map(I=>{const A=O(I);return A.frame.x=z,A.frame.width=S,this.stretchDescendantsWidths(A,S)})),m+=S}),t.type===d.verzweigung&&a===2&&l.length===2){const v=Math.max(l[0].width,l[1].width),x=e,z=e+v,V=z-l[1].x;l[0]={...l[0],x,width:v},l[1]={...l[1],x:z,width:v},m=v*2,u[0]=u[0].map(k=>{const S=O(k);return S.frame.x=x,S.frame.width=v,this.stretchDescendantsWidths(S,v)}),u[1]=u[1].map(k=>{const S=Zt(k,V);return S.frame.width=v,this.stretchDescendantsWidths(S,v)})}if(u.length>0){const v=ci(u,n+r);u=v.columns.map(x=>x.map(z=>this.stretchLoopBodiesVertically(z)));for(let x=0;x<Math.min(l.length,v.columnHeights.length);x++)l[x]={...l[x],height:v.columnHeights[x]};g=v.columnHeights.length>0?Math.max(...v.columnHeights):g}let b=Math.max(m,this.minWidth(t));if(m>.5&&b>m+.5){const v=b/m;let x=e;const z=[],V=[];l.forEach((k,S)=>{const E=k.width*v;V.push(u[S].map(I=>{const A=O(I);return A.frame.x=x,A.frame.width=E,this.stretchDescendantsWidths(A,E)})),z.push({x,y:k.y,width:E,height:k.height}),x+=E}),l=z,u=V,m=x-e,b=m}const y=l.length>0?l[l.length-1].width:m/a,L=_t(s,t,{x:e,y:n,width:b,height:r+g},r);return L.caseColumnFrames=l,L.dividerX=l.length>0?l[l.length-1].x:e+m-y,L.dividerYInset=t.type===d.fallauswahl?-20:0,L.columns=u,L.children=u.flat(),L}}function an(i,t){if(Math.abs(t)<=1e-4)return i;const e=O(i),n=s=>{const r=O(s);return r.frame.y+=t,an(r,t)};return e.columns?(e.columns=e.columns.map(s=>s.map(n)),e.children=e.columns.flat()):e.children=e.children.map(n),e}function Zt(i,t){if(Math.abs(t)<=1e-4)return i;const e=O(i);return e.frame.x+=t,e.columns?(e.columns=e.columns.map(n=>n.map(s=>Zt(s,t))),e.children=e.columns.flat()):e.children=e.children.map(n=>Zt(n,t)),e}function ci(i,t){if(i.length<2)return{columns:i,columnHeights:i.map(l=>l.reduce((u,m)=>u+m.frame.height,0))};const e=.5,n=[t];for(const l of i)for(const u of l)n.push(u.frame.y+u.frame.height);const s=Math.max(...n);n.push(s),n.sort((l,u)=>l-u);let r=[];for(const l of n)r.length>0&&Math.abs(l-r[r.length-1])<=e||r.push(l);(r.length===0||Math.abs(r[0]-t)>e)&&r.unshift(t),r.length===0?r=[t,s]:r[r.length-1]<s-1e-6?r.push(s):r[r.length-1]=s;const o=(l,u)=>{let m=Math.max(0,u);for(;m<r.length&&r[m]<l-e;)m++;return Math.min(m,r.length-1)},a=[],h=[];for(const l of i){if(l.length===0){a.push([]),h.push(0);continue}const u=[];let m=0;l.forEach((g,b)=>{let y=O(g);const L=r[m],v=g.frame.y+g.frame.height,x=b===l.length-1?r.length-1:o(v,m+1),z=r[x],V=L-y.frame.y;y.frame.y=L,y.frame.height=Math.max(0,z-L),y=an(y,V),u.push(y),m=x}),a.push(u),h.push(r[r.length-1]-t)}return{columns:a,columnHeights:h}}const be=[{item:"anweisung",label:"Anweisung"},{item:"verzweigung",label:"Verzweigung"},{item:"fallauswahl",label:"Fallauswahl"},{item:"forZaehlSchleife",label:"For-Schleife"},{item:"whileSchleife",label:"While-Schleife"},{item:"doUntilSchleife",label:"Do-while-Schleife"},{item:"endlosschleife",label:"Endlosschleife"},{item:"aufruf",label:"Aufruf"},{item:"aussprung",label:"Aussprung"}];function St(i){const t=pt;switch(i){case"anweisung":return W(d.anweisung);case"verzweigung":return W(d.verzweigung,{cases:[{name:"true",elements:[t()]},{name:"false",elements:[t()]}]});case"fallauswahl":return W(d.fallauswahl,{cases:[{name:"1",elements:[t()]},{name:"2",elements:[t()]},{name:"default",elements:[t()]}]});case"forZaehlSchleife":return W(d.forSchleife,{textLines:["","",""],loopBody:[t()]});case"whileSchleife":return W(d.whileSchleife,{loopBody:[t()]});case"doUntilSchleife":return W(d.doUntilSchleife,{loopBody:[t()]});case"endlosschleife":return W(d.endlosschleife,{loopBody:[t()]});case"aussprung":return W(d.aussprung);case"aufruf":return W(d.aufruf)}}function Mt(i){if(i==="")return"-1;";let t="";for(const e of i)t+=e.codePointAt(0)+";";return t}function Gt(i){const t=i.split(";").filter(n=>n!=="");if(t.length===1&&t[0]==="-1")return"";let e="";for(const n of t){if(!/^[+-]?\d+$/.test(n))continue;const s=Number(n);s!==-1&&(s<0||s>1114111||s>=55296&&s<=57343||(e+=String.fromCodePoint(s)))}return e}class _e extends Error{}function ui(i){const t=new DOMParser().parseFromString(i,"application/xml");if(t.getElementsByTagName("parsererror").length>0)throw new _e("Could not read XML.");const e=t.documentElement;if(!e||e.tagName!=="struktogramm")throw new _e("Invalid XML: root element is not <struktogramm>.");const n={caption:ze(e,"caption")??"",elements:te(e)},s=ze(e,"fontfamily");s!==void 0&&(n.fontFamily=s);const r=ht(e,"fontsize");r!==void 0&&(n.fontSize=r);const o=ht(e,"fontstyle");return o!==void 0&&(n.fontStyle=o),n}function hi(i){const t=(n,s)=>s===void 0?"":` ${n}="${ln(s)}"`;let e=`<?xml version="1.0" encoding="UTF-8"?>
`;e+="<struktogramm",e+=t("fontfamily",i.fontFamily===void 0?void 0:Mt(i.fontFamily)),e+=t("fontstyle",i.fontStyle===void 0?void 0:String(i.fontStyle)),e+=t("fontsize",i.fontSize===void 0?void 0:String(i.fontSize)),e+=t("caption",Mt(i.caption)),e+=`>
`;for(const n of i.elements)e+=Qt(n,"  ");return e+=`</struktogramm>
`,e}function Qt(i,t){let e=`${t}<strelem typ="${i.type}" zx="${i.zoomX}" zy="${i.zoomY}"`;i.textColor&&(e+=` textcolor="${Se(i.textColor)}"`),i.backgroundColor&&(e+=` bgcolor="${Se(i.backgroundColor)}"`),e+=`>
`;for(const n of i.textLines)e+=`${t}  <text>${di(Mt(n))}</text>
`;if(i.loopBody){e+=`${t}  <schleifeninhalt>
`;for(const n of i.loopBody)e+=Qt(n,t+"    ");e+=`${t}  </schleifeninhalt>
`}if(i.cases)for(const n of i.cases){e+=`${t}  <fall fallname="${ln(Mt(n.name))}">
`;for(const s of n.elements)e+=Qt(s,t+"    ");e+=`${t}  </fall>
`}return e+=`${t}</strelem>
`,e}function ln(i){return i.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function di(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Se(i){return String(i.a<<24|i.r<<16|i.g<<8|i.b|0)}function Et(i,t){return Array.from(i.children).filter(e=>e.tagName===t)}function te(i){const t=[];for(const e of Et(i,"strelem")){const n=mi(e);n&&t.push(n)}return t}function mi(i){const t=ht(i,"typ");if(t===void 0||d[t]===void 0)return;const e={type:t,zoomX:ht(i,"zx")??0,zoomY:ht(i,"zy")??0,textLines:Et(i,"text").map(a=>Gt((a.textContent??"").trim()))},n=Le(i.getAttribute("textcolor"));n&&(e.textColor=n);const s=Le(i.getAttribute("bgcolor"));s&&(e.backgroundColor=s),e.textLines.length===0&&(e.textLines=[""]);const r=Et(i,"schleifeninhalt")[0];if(r){const a=te(r);a.length>0&&(e.loopBody=a)}const o=Et(i,"fall").map(a=>({name:Gt(a.getAttribute("fallname")??""),elements:te(a)}));return o.length>0&&(e.cases=o),e}function ze(i,t){const e=i.getAttribute(t);return e===null?void 0:Gt(e)}function ht(i,t){const e=i.getAttribute(t);if(!(e===null||!/^[+-]?\d+$/.test(e)))return Number(e)}function Le(i){if(i===null||!/^[+-]?\d+$/.test(i))return;const t=Number(i);if(t<-2147483648||t>2147483647)return;const e=t>>>0;return{a:e>>>24&255,r:e>>>16&255,g:e>>>8&255,b:e&255}}const pi=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;104;101;99;107;80;105;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;110;122;97;104;108;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>99;111;110;115;116;32;105;110;116;32;80;73;78;32;61;32;49;50;51;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;112;105;110;32;61;32;48;</text>
  </strelem>
  <strelem typ="5" zx="0" zy="0">
    <text>80;73;78;32;33;61;32;112;105;110;32;38;38;32;97;110;122;97;104;108;32;60;32;51;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;105;110;116;32;112;105;110;32;34;80;105;110;32;101;105;110;103;101;98;101;110;34;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>97;110;122;97;104;108;43;43;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>80;73;78;32;61;61;32;112;105;110;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>112;114;105;110;116;58;32;34;82;105;99;104;116;105;103;101;32;80;105;110;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>112;114;105;110;116;58;32;34;70;97;108;115;99;104;101;32;80;105;110;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,fi=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;108;108;97;116;122;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;32;61;32;49;57;</text>
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
        <text>112;114;105;110;116;58;32;110;117;109;98;101;114;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,gi=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;105;98;111;110;97;99;99;105;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;110;122;97;104;108;32;61;32;49;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;49;32;61;32;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>112;114;105;110;116;58;32;110;117;109;98;101;114;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;50;32;61;32;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>112;114;105;110;116;58;32;110;117;109;98;101;114;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;51;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;50;</text>
    <text>105;60;97;110;122;97;104;108;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>110;117;109;98;101;114;51;32;61;32;110;117;109;98;101;114;49;32;43;32;110;117;109;98;101;114;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>112;114;105;110;116;58;32;110;117;109;98;101;114;51;</text>
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
`,yi=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="78;117;109;98;101;114;69;118;101;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;110;117;109;98;101;114;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>110;117;109;98;101;114;32;37;32;50;32;61;61;32;48;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>112;114;105;110;116;58;32;34;110;117;109;98;101;114;32;105;115;32;101;118;101;110;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>112;114;105;110;116;58;32;34;110;117;109;98;101;114;32;105;115;32;111;100;100;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,xi=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="-1;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;122;97;104;108;101;110;32;61;32;123;50;44;52;44;54;44;56;44;49;48;125;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;122;97;104;108;101;110;46;108;101;110;103;116;104;40;41;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;122;97;104;108;101;110;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,vi=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="50;48;50;54;45;48;52;45;50;54;45;65;114;114;97;121;76;105;116;101;114;97;108;83;121;110;116;97;120;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;91;93;32;115;101;113;117;101;110;99;101;32;61;32;123;50;44;52;44;54;44;56;44;49;48;125;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;115;101;113;117;101;110;99;101;46;108;101;110;103;116;104;40;41;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;115;101;113;117;101;110;99;101;91;105;93;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,wi=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;111;97;114;100;68;117;116;121;">
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;91;93;32;115;116;117;100;101;110;116;32;61;32;110;101;119;32;83;116;114;105;110;103;91;53;93;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;32;60;32;115;116;117;100;101;110;116;46;108;101;110;103;116;104;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;115;116;117;100;101;110;116;91;105;93;32;34;83;116;117;100;101;110;116;32;110;97;109;101;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;99;104;111;105;99;101;32;61;32;40;105;110;116;41;32;40;77;97;116;104;46;114;97;110;100;111;109;40;41;42;115;116;117;100;101;110;116;46;108;101;110;103;116;104;41;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;83;116;117;100;101;110;116;58;32;34;32;43;32;115;116;117;100;101;110;116;91;99;104;111;105;99;101;93;</text>
  </strelem>
</struktogramm>
`,bi=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="65;100;100;105;116;105;111;110;">
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
`,_i=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="66;105;110;228;114;122;97;104;108;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;71;97;110;122;101;122;97;104;108;32;101;105;110;103;101;98;101;110;58;32;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>83;116;114;105;110;103;32;98;105;110;97;101;114;122;97;104;108;32;61;32;34;34;</text>
  </strelem>
  <strelem typ="4" zx="0" zy="0">
    <text>122;97;104;108;62;48;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;116;32;114;101;115;116;32;61;32;122;97;104;108;32;37;32;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>98;105;110;97;101;114;122;97;104;108;32;61;32;114;101;115;116;32;43;32;98;105;110;97;101;114;122;97;104;108;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>122;97;104;108;32;61;32;122;97;104;108;32;47;32;50;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;98;105;110;97;101;114;122;97;104;108;</text>
  </strelem>
</struktogramm>
`,Si=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;104;101;99;107;80;105;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;110;122;97;104;108;32;61;32;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>99;111;110;115;116;32;105;110;116;32;80;73;78;32;61;32;49;50;51;52;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;112;105;110;32;61;32;48;</text>
  </strelem>
  <strelem typ="5" zx="0" zy="0">
    <text>80;73;78;32;33;61;32;112;105;110;32;38;38;32;97;110;122;97;104;108;32;60;32;51;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;105;110;116;32;112;105;110;32;34;80;105;110;32;101;105;110;103;101;98;101;110;34;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>97;110;122;97;104;108;43;43;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>80;73;78;32;61;61;32;112;105;110;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>112;114;105;110;116;58;32;34;82;105;99;104;116;105;103;101;32;80;105;110;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>112;114;105;110;116;58;32;34;70;97;108;115;99;104;101;32;80;105;110;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,zi=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="67;111;108;108;97;116;122;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;32;61;32;49;57;</text>
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
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,Li=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="68;101;99;105;115;116;105;111;110;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;103;101;32;34;89;111;117;114;32;97;103;101;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>65;114;101;32;121;111;117;116;32;49;56;32;111;114;32;111;118;101;114;63;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;89;111;117;114;32;97;114;101;32;97;110;32;97;100;117;108;116;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;32;32;32;32;89;111;117;39;114;101;32;115;116;105;108;108;32;97;32;109;105;110;111;114;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,ki=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;105;98;111;110;97;99;99;105;">
  <strelem typ="0" zx="0" zy="0">
    <text>86;97;114;105;97;98;108;101;32;122;97;104;108;49;32;97;108;115;32;103;97;110;122;122;97;104;108;32;100;101;102;105;110;105;101;114;101;110;32;117;110;100;32;109;105;116;32;49;32;105;110;105;116;105;97;108;105;115;105;101;114;101;110;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;122;97;104;108;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>86;97;114;105;97;98;108;101;32;122;97;104;108;50;32;97;108;115;32;103;97;110;122;122;97;104;108;32;100;101;102;105;110;105;101;114;101;110;32;117;110;100;32;109;105;116;32;49;32;105;110;105;116;105;97;108;105;115;105;101;114;101;110;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;122;97;104;108;50;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>115;116;97;114;116;32;100;101;114;32;86;97;114;105;97;98;108;101;32;105;32;109;105;116;32;50;</text>
    <text>115;111;108;97;110;103;101;32;105;32;107;108;101;105;110;101;114;32;49;48;32;105;115;116;</text>
    <text>101;114;104;246;104;101;32;105;32;117;109;32;49;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>100;101;107;108;97;114;97;116;105;111;110;32;100;101;114;32;103;97;110;122;122;97;104;108;32;86;97;114;105;97;98;108;101;32;122;97;104;108;51;46;32;220;98;101;114;103;101;98;101;32;100;105;101;32;83;117;109;109;101;32;97;117;115;32;122;97;104;108;49;32;117;110;100;32;122;97;104;108;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;122;97;104;108;51;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>86;97;114;105;97;98;101;108;32;122;97;104;108;49;32;98;101;107;111;109;109;116;32;100;101;110;32;87;101;114;116;32;118;111;110;32;122;97;104;108;50;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>86;97;114;105;97;98;108;101;32;122;97;104;108;50;32;98;101;107;111;109;109;116;32;100;101;110;32;87;101;114;116;32;118;111;110;32;122;97;104;108;51;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,$i=`<?xml version="1.0" encoding="UTF-8"?>\r
<struktogramm fontfamily="77;101;110;108;111;" fontstyle="0" fontsize="15" caption="-1;">\r
  <strelem typ="0" zx="0" zy="0">\r
    <text>105;110;116;32;122;97;104;108;49;32;61;32;49;</text>\r
  </strelem>\r
  <strelem typ="0" zx="0" zy="0">\r
    <text>111;117;116;112;117;116;58;32;122;97;104;108;49;</text>\r
  </strelem>\r
  <strelem typ="0" zx="0" zy="0">\r
    <text>105;110;116;32;122;97;104;108;50;32;61;32;49;</text>\r
  </strelem>\r
  <strelem typ="0" zx="0" zy="0">\r
    <text>111;117;116;112;117;116;58;32;122;97;104;108;50;</text>\r
  </strelem>\r
  <strelem typ="3" zx="0" zy="0">\r
    <text>105;110;116;32;105;32;61;32;50;</text>\r
    <text>105;32;60;32;49;48;</text>\r
    <text>105;43;43;</text>\r
    <schleifeninhalt>\r
      <strelem typ="0" zx="0" zy="0">\r
        <text>105;110;116;32;122;97;104;108;51;32;61;32;122;97;104;108;49;32;43;32;122;97;104;108;50;</text>\r
      </strelem>\r
      <strelem typ="0" zx="0" zy="0">\r
        <text>111;117;116;112;117;116;58;32;122;97;104;108;51;</text>\r
      </strelem>\r
      <strelem typ="0" zx="0" zy="0">\r
        <text>122;97;104;108;49;32;61;32;122;97;104;108;50;</text>\r
      </strelem>\r
      <strelem typ="0" zx="0" zy="0">\r
        <text>122;97;104;108;50;32;61;32;122;97;104;108;51;</text>\r
      </strelem>\r
    </schleifeninhalt>\r
  </strelem>\r
</struktogramm>\r
`,Ei=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="70;105;98;111;110;97;99;99;105;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;110;122;97;104;108;32;61;32;49;48;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;49;32;61;32;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;50;32;61;32;49;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;110;117;109;98;101;114;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;110;117;109;98;101;114;51;32;61;32;48;</text>
  </strelem>
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;50;</text>
    <text>105;60;97;110;122;97;104;108;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>110;117;109;98;101;114;51;32;61;32;110;117;109;98;101;114;49;32;43;32;110;117;109;98;101;114;50;</text>
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
`,Ii=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="72;101;108;108;111;32;87;111;114;108;100;">
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;72;101;108;108;111;32;87;111;114;108;100;34;</text>
  </strelem>
</struktogramm>
`,Ti=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="80;114;252;102;117;110;103;32;111;98;32;90;97;104;108;32;103;101;114;97;100;101;32;105;115;116;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;90;97;104;108;32;101;105;110;103;101;98;101;110;34;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>122;97;104;108;32;103;101;114;97;100;101;63;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;90;97;104;108;32;105;115;116;32;103;101;114;97;100;101;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;90;97;104;108;32;105;115;116;32;117;110;103;101;114;97;100;101;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Ai=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="65;103;101;32;99;104;101;99;107;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;97;103;101;32;61;32;50;49;</text>
  </strelem>
  <strelem typ="1" zx="0" zy="0">
    <text>65;103;101;32;49;56;32;111;114;32;111;118;101;114;63;</text>
    <fall fallname="116;114;117;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;65;100;117;108;116;34;</text>
      </strelem>
    </fall>
    <fall fallname="102;97;108;115;101;">
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;77;105;110;111;114;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Ci=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="68;105;97;103;114;97;109;109;45;49;48;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;52;32;43;32;53;</text>
  </strelem>
</struktogramm>
`,Bi=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="68;111;32;119;104;105;108;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>99;111;110;115;116;32;105;110;116;32;80;73;78;32;61;32;49;50;51;52;</text>
  </strelem>
  <strelem typ="5" zx="0" zy="0">
    <text>112;105;110;32;33;61;32;80;73;78;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>105;110;112;117;116;58;32;105;110;116;32;112;105;110;32;34;101;110;116;101;114;32;112;105;110;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,Mi=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="69;110;100;108;111;115;32;83;99;104;108;101;105;102;101;">
  <strelem typ="6" zx="0" zy="0">
    <text>-1;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;73;32;119;105;108;108;32;110;101;118;101;114;32;101;110;100;34;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,Di=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;101;113;117;101;110;122;">
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
`,Pi=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="83;101;113;117;101;110;122;50;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;122;97;104;108;32;34;90;97;104;108;32;101;105;110;103;101;98;101;110;34;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>122;97;104;108;32;61;32;122;97;104;108;32;42;32;50;</text>
  </strelem>
  <strelem typ="0" zx="0" zy="0">
    <text>111;117;116;112;117;116;58;32;34;86;101;114;100;111;112;112;101;108;116;101;32;90;97;104;108;58;32;34;32;43;32;122;97;104;108;</text>
  </strelem>
</struktogramm>
`,Vi=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="68;105;97;103;114;97;109;109;45;49;48;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;116;32;115;117;109;32;61;32;52;32;43;32;53;</text>
  </strelem>
</struktogramm>
`,ji=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="97;103;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;97;103;101;32;34;101;110;116;101;114;32;97;103;101;34;</text>
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
`,Oi=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="97;117;102;114;117;102;">
  <strelem typ="8" zx="0" zy="0">
    <text>99;104;101;99;107;65;103;101;40;41;</text>
  </strelem>
</struktogramm>
`,Ni=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="98;114;101;97;107;">
  <strelem typ="6" zx="0" zy="0">
    <text>-1;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;67;104;111;111;115;101;32;97;110;32;111;112;116;105;111;110;58;32;34;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;49;45;69;66;105;107;101;34;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;50;45;69;83;99;111;111;116;101;114;34;</text>
      </strelem>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;34;48;45;69;120;105;116;34;</text>
      </strelem>
      <strelem typ="1" zx="0" zy="0">
        <text>99;104;111;105;99;101;32;61;61;61;32;48;</text>
        <fall fallname="116;114;117;101;">
          <strelem typ="0" zx="0" zy="0">
            <text>111;117;116;112;117;116;58;32;34;71;111;111;100;98;121;34;</text>
          </strelem>
          <strelem typ="7" zx="0" zy="0">
            <text>-1;</text>
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
</struktogramm>
`,Fi=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="102;111;114;32;108;111;111;112;">
  <strelem typ="3" zx="0" zy="0">
    <text>105;110;116;32;105;32;61;32;48;</text>
    <text>105;60;53;</text>
    <text>105;43;43;</text>
    <schleifeninhalt>
      <strelem typ="0" zx="0" zy="0">
        <text>111;117;116;112;117;116;58;32;105;</text>
      </strelem>
    </schleifeninhalt>
  </strelem>
</struktogramm>
`,Ri=`<?xml version="1.0" encoding="UTF-8"?>
<struktogramm caption="115;119;105;116;99;104;32;99;97;115;101;">
  <strelem typ="0" zx="0" zy="0">
    <text>105;110;112;117;116;58;32;105;110;116;32;99;104;111;105;99;101;32;34;99;104;111;115;101;32;97;110;32;111;112;116;105;111;110;34;</text>
  </strelem>
  <strelem typ="2" zx="0" zy="0">
    <text>99;104;111;105;99;101;</text>
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
        <text>111;117;116;112;117;116;58;32;34;80;108;101;97;99;101;32;115;101;108;101;99;116;32;97;32;118;97;108;105;100;32;105;116;101;109;34;</text>
      </strelem>
    </fall>
  </strelem>
</struktogramm>
`,Hi=Object.assign({"../../../VisuStruct-Dateien/2026-04-23-CheckPin.visustruct":pi,"../../../VisuStruct-Dateien/2026-04-23-Collatz.visustruct":fi,"../../../VisuStruct-Dateien/2026-04-23-Fibonacci.visustruct":gi,"../../../VisuStruct-Dateien/2026-04-23-NumberEven.visustruct":yi,"../../../VisuStruct-Dateien/2026-04-26-ArrayKurzschreibweise.visustruct":xi,"../../../VisuStruct-Dateien/2026-04-26-ArrayLiteralSyntax.visustruct":vi,"../../../VisuStruct-Dateien/2026-04-26-BoardDuty.visustruct":wi,"../../../VisuStruct-Dateien/Addition.visustruct":bi,"../../../VisuStruct-Dateien/Binärzahl.visustruct":_i,"../../../VisuStruct-Dateien/CheckPin.visustruct":Si,"../../../VisuStruct-Dateien/Collatz.visustruct":zi,"../../../VisuStruct-Dateien/Decistion-Text.visustruct":Li,"../../../VisuStruct-Dateien/Fibonacci-Deutsch-Pseudocode.visustruct":ki,"../../../VisuStruct-Dateien/Fibonacci-Deutsch.visustruct":$i,"../../../VisuStruct-Dateien/Fibonacci.visustruct":Ei,"../../../VisuStruct-Dateien/Hello-World.visustruct":Ii,"../../../VisuStruct-Dateien/Prüfung-ob-Zahl-gerade-ist.visustruct":Ti,"../../../VisuStruct-Dateien/SummeBilden/Age-check.visustruct":Ai,"../../../VisuStruct-Dateien/SummeBilden/Diagramm-10.visustruct":Ci,"../../../VisuStruct-Dateien/SummeBilden/Do-while.visustruct":Bi,"../../../VisuStruct-Dateien/SummeBilden/Endlos-Schleife.visustruct":Mi,"../../../VisuStruct-Dateien/SummeBilden/Sequenz.visustruct":Di,"../../../VisuStruct-Dateien/SummeBilden/Sequenz2.visustruct":Pi,"../../../VisuStruct-Dateien/SummeBilden/SummeBilden.visustruct":Vi,"../../../VisuStruct-Dateien/SummeBilden/age.visustruct":ji,"../../../VisuStruct-Dateien/SummeBilden/aufruf.visustruct":Oi,"../../../VisuStruct-Dateien/SummeBilden/break.visustruct":Ni,"../../../VisuStruct-Dateien/SummeBilden/for-loop.visustruct":Fi,"../../../VisuStruct-Dateien/SummeBilden/switch-case.visustruct":Ri}),ke=Object.entries(Hi).map(([i,t])=>({name:i.replace(/^.*VisuStruct-Dateien\//,"").replace(/\.visustruct$/,""),xml:t})).sort((i,t)=>i.name.localeCompare(t.name,"de")),Wi="http://www.w3.org/2000/svg",D={diagramLineWidth:2,outerFrameLineWidth:2,selectionLineWidth:3.5,canvasOuterMargin:16,cellTextInsetX:18,cellTextInsetY:15,multiHeaderFirstLineY:14,branchLabelInsetX:10,fallauswahlCaseLabelBand:26,callSideBarInset:14,callTextInsetFromSideBar:20,loopBodyLeadingInset:20};function T(i,t={}){const e=document.createElementNS(Wi,i);for(const[n,s]of Object.entries(t))e.setAttribute(n,String(s));return e}class cn{constructor(t,e){p(this,"usesSimulationHighlight",!1);this.metrics=t,this.measure=e}get lineHeight(){return this.metrics.lineHeight}get fontSize(){return this.metrics.fontSize}render(t,e,n,s=D.canvasOuterMargin){const r=T("svg",{width:e.width,height:e.height,viewBox:`0 0 ${e.width} ${e.height}`,"font-family":ue,"font-size":this.fontSize,class:"diagram"});r.append(T("rect",{x:0,y:0,width:e.width,height:e.height,fill:"#fafafa"}));const o=s;r.append(T("rect",{x:o,y:o,width:t.canvasSize.width-2*o-1,height:t.canvasSize.height-2*o-1,fill:"none",stroke:"black","stroke-width":D.outerFrameLineWidth}));const a=T("g");for(const h of t.elements)this.drawNode(h,a,n,{},void 0);return r.append(a),r}line(t,e){t.append(T("polyline",{points:e.map(n=>n.join(",")).join(" "),fill:"none",stroke:"black","stroke-width":D.diagramLineWidth,"stroke-linejoin":"miter"}))}strokeCellBorder(t,e,n){const s=e.x,r=e.y,o=e.x+e.width,a=e.y+e.height;if(!n.top&&!n.left&&!n.bottom&&!n.right){t.append(T("rect",{x:s,y:r,width:e.width,height:e.height,fill:"none",stroke:"black","stroke-width":D.diagramLineWidth}));return}n.top||this.line(t,[[s,r],[o,r]]),n.right||this.line(t,[[o,r],[o,a]]),n.bottom||this.line(t,[[o,a],[s,a]]),n.left||this.line(t,[[s,a],[s,r]])}textWidth(t){const e=fe(t);return e?this.measure(e.keyword,this.fontSize,"bold")+(e.rest===""?0:this.measure(" "+e.rest,this.fontSize,"medium")):this.measure(t,this.fontSize,"medium")}drawKeywordLine(t,e,n,s){const r=T("text",{x:n,y:s,"dominant-baseline":"text-before-edge","font-weight":500});r.style.whiteSpace="pre";const o=fe(e);if(o){const a=T("tspan",{"font-weight":700});if(a.textContent=o.keyword,r.append(a),o.rest!==""){const h=T("tspan",{x:n+this.measure(o.keyword,this.fontSize,"bold")});h.textContent=" "+o.rest,r.append(h)}}else r.textContent=e;t.append(r)}drawLabel(t,e,n,s,r,o){const a=T("text",{x:n,y:s,"dominant-baseline":o==="top"?"text-before-edge":"text-after-edge","font-weight":r?700:500});a.style.whiteSpace="pre",a.textContent=e,t.append(a)}roofMetrics(t,e,n,s){const r=e.y+n,o=t.dividerYInset??0,a=12,h=Math.max(t.element.textLines.length,1)*this.lineHeight,l=e.y+D.multiHeaderFirstLineY;if(t.element.type===d.fallauswahl){const m=Math.max(D.fallauswahlCaseLabelBand,this.lineHeight+10),g=r-m,b=Math.min(r+o,g-8),y=Math.max(b,l+h+6);return{apex:{x:s,y},maxTextBottom:g-a,roofBottom:r}}const u={x:s,y:r+o};return{apex:u,maxTextBottom:u.y-a,roofBottom:r}}drawNode(t,e,n,s,r){var V;const o=t.frame,a=t.element,h=o.x+o.width,l=o.y+o.height,u=a.type===d.verzweigung||a.type===d.fallauswahl,m=u?t.headerBandHeight:0,g=n!==void 0&&ee(t.idPath,n),b=oe(a),y=T("g",{"data-path":t.idPath.join(",")});e.append(y);const L=this.usesSimulationHighlight,v=g&&L?"rgba(199, 230, 255, 0.55)":"white";y.append(T("rect",{x:o.x,y:o.y,width:o.width,height:o.height,fill:v})),this.strokeCellBorder(y,o,s);const x=D.callSideBarInset;if(a.type===d.aufruf?(this.line(y,[[o.x+x,o.y],[o.x+x,l]]),this.line(y,[[h-x,o.y],[h-x,l]])):a.type===d.aussprung&&this.line(y,[[o.x+x,o.y],[o.x,o.y+o.height/2],[o.x+x,l]]),u&&t.dividerX!==void 0){const k=t.dividerX,S=this.roofMetrics(t,o,m,k),E=Math.max(b.length,1)*this.lineHeight,I=o.y+D.multiHeaderFirstLineY;this.line(y,[[o.x,o.y],[S.apex.x,S.apex.y],[h,o.y]]),a.type===d.fallauswahl&&this.line(y,[[o.x,S.roofBottom],[h,S.roofBottom]]);let A;I+E<=S.maxTextBottom?A=I:A=Math.max(o.y+2,S.maxTextBottom-(Math.max(b.length,1)-1)*this.lineHeight-this.lineHeight),b.forEach((B,Y)=>{const K=this.textWidth(B);let nt;if(a.type===d.verzweigung){const Ot=o.x+D.cellTextInsetX,Vn=h-K-D.cellTextInsetX;nt=Math.min(Math.max(k-K/2,Ot),Vn)}else nt=o.x+o.width/2-K/2;this.drawKeywordLine(y,B,nt,A+Y*this.lineHeight)})}else if(a.type!==d.doUntilSchleife)if(a.type===d.anweisung||a.type===d.aufruf||a.type===d.aussprung){const k=D.cellTextInsetX;let S=o.x+k,E=h-k;a.type===d.aufruf?(S=o.x+x+D.callTextInsetFromSideBar,E=h-x-D.callTextInsetFromSideBar):a.type===d.aussprung&&(S=o.x+x+k);const I=Math.max(0,E-S);let A=o.y+o.height/2-Math.max(1,b.length)*this.lineHeight/2;for(const B of b)this.drawKeywordLine(y,B,S+(I-this.textWidth(B))/2,A),A+=this.lineHeight}else{const k=Math.max(1,b.length)*this.lineHeight;let S=r===d.doUntilSchleife?o.y+o.height/2-k/2:o.y+D.cellTextInsetY;for(const E of b)this.drawKeywordLine(y,E,o.x+D.cellTextInsetX,S),S+=this.lineHeight}t.children.forEach((k,S)=>{const E=a.type===d.doUntilSchleife&&S===0?{top:!0,left:!0}:{};this.drawNode(k,e,n,E,a.type)});const z=T("g");if(e.append(z),a.type===d.doUntilSchleife){const k=((V=t.children[0])==null?void 0:V.frame.x)??o.x+(t.loopBodyLeadingInset>0?t.loopBodyLeadingInset:D.loopBodyLeadingInset);this.drawLabel(z,"do",o.x+4,o.y+this.metrics.doUntilDoLabelTopInset,!0,"top");const S=l-t.headerBandHeight;this.line(z,[[k,S],[h,S]]),this.line(z,[[k,o.y],[k,S]]);let E=S+this.metrics.doUntilFooterTopInset;for(const I of b)this.drawKeywordLine(z,I,o.x+D.cellTextInsetX,E),E+=this.lineHeight}if(u&&t.dividerX!==void 0&&t.caseColumnFrames.length>1){const k=this.roofMetrics(t,o,m,t.dividerX),S=k.apex;t.caseColumnFrames.forEach((I,A)=>{if(A>=t.caseColumnFrames.length-1)return;const B=I.x+I.width,Y=Ui(B,o,S),K=Number.isFinite(Y)?Math.min(Math.max(Y,o.y),l):o.y;this.line(z,[[B,l],[B,K]])});const E=a.cases;if(E&&E.length===t.caseColumnFrames.length){const I=a.type===d.fallauswahl?k.roofBottom-6:o.y+m-8,A=D.branchLabelInsetX;if(a.type===d.verzweigung&&E.length===2){this.drawLabel(z,"true",o.x+A,I,!0,"bottom");const B=t.caseColumnFrames[1],Y=this.measure("false",this.fontSize,"bold");this.drawLabel(z,"false",B.x+B.width-A-Y,I,!0,"bottom")}else E.forEach((B,Y)=>{const K=t.caseColumnFrames[Y],nt=["default","true","false"].includes(B.name.toLowerCase()),Ot=this.measure(B.name,this.fontSize,nt?"bold":"medium");this.drawLabel(z,B.name,K.x+K.width/2-Ot/2,I,nt,"bottom")})}}g&&z.append(T("rect",{x:o.x,y:o.y,width:o.width,height:o.height,fill:"none",stroke:L?"rgba(66, 140, 242, 0.78)":"rgba(0, 122, 255, 0.9)","stroke-width":D.selectionLineWidth}))}}function Ui(i,t,e){const n=t.y;if(i<=e.x){const r=e.x-t.x;return Math.abs(r)<.5?e.y:n+(e.y-n)/r*(i-t.x)}const s=t.x+t.width-e.x;return Math.abs(s)<.5?e.y:e.y+(n-e.y)/s*(i-e.x)}function ee(i,t){return i.length===t.length&&i.every((e,n)=>e===t[n])}function Xi(i){const t=[],e=n=>{t.push(n),n.children.forEach(e)};return i.forEach(e),t}function Dt(i){var t,e;return{...i,textLines:oe(i),loopBody:(t=i.loopBody)==null?void 0:t.map(Dt),cases:(e=i.cases)==null?void 0:e.map(n=>({name:n.name,elements:n.elements.map(Dt)}))}}const qi="modulepreload",Ji=function(i,t){return new URL(i,t).href},$e={},_=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){let o=function(u){return Promise.all(u.map(m=>Promise.resolve(m).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};const a=document.getElementsByTagName("link"),h=document.querySelector("meta[property=csp-nonce]"),l=(h==null?void 0:h.nonce)||(h==null?void 0:h.getAttribute("nonce"));s=o(e.map(u=>{if(u=Ji(u,n),u in $e)return;$e[u]=!0;const m=u.endsWith(".css"),g=m?'[rel="stylesheet"]':"";if(!!n)for(let L=a.length-1;L>=0;L--){const v=a[L];if(v.href===u&&(!m||v.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${g}`))return;const y=document.createElement("link");if(y.rel=m?"stylesheet":qi,m||(y.as="script"),y.crossOrigin="",y.href=u,l&&y.setAttribute("nonce",l),document.head.appendChild(y),m)return new Promise((L,v)=>{y.addEventListener("load",L),y.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&r(a.reason);return t().catch(r)})},It=[{code:"de",name:"Deutsch"},{code:"en",name:"English"},{code:"es",name:"Español"},{code:"fr",name:"Français"},{code:"it",name:"Italiano"},{code:"pl",name:"Polski"},{code:"tr",name:"Türkçe"},{code:"ko",name:"한국어"},{code:"ja",name:"日本語"},{code:"el",name:"Ελληνικά"},{code:"uk",name:"Українська"},{code:"ar",name:"العربية"},{code:"ru",name:"Русский"},{code:"he",name:"עברית"},{code:"nl",name:"Nederlands"},{code:"sv",name:"Svenska"},{code:"da",name:"Dansk"},{code:"nb",name:"Norsk bokmål"},{code:"zh-Hans",name:"中文（简体）"},{code:"zh-Hant",name:"中文（繁體）"},{code:"pt-PT",name:"Português"},{code:"java",name:"Java (Keywords)"}],Yi=Object.assign({"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ar.lproj/Localizable.strings":()=>_(()=>import("./Localizable-BbyaXHAR.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/da.lproj/Localizable.strings":()=>_(()=>import("./Localizable-IMH9XLsx.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/de.lproj/Localizable.strings":()=>_(()=>import("./Localizable-D0-8agZT.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/el.lproj/Localizable.strings":()=>_(()=>import("./Localizable-CQDuTeFr.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/en.lproj/Localizable.strings":()=>_(()=>import("./Localizable-mc1L3X1i.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/es.lproj/Localizable.strings":()=>_(()=>import("./Localizable-CcbsJ2f_.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/fr.lproj/Localizable.strings":()=>_(()=>import("./Localizable-D4H9sUk1.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/he.lproj/Localizable.strings":()=>_(()=>import("./Localizable-2IK10ZaR.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/it.lproj/Localizable.strings":()=>_(()=>import("./Localizable-ENN15QiA.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ja.lproj/Localizable.strings":()=>_(()=>import("./Localizable-CJxJMMj8.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/java.lproj/Localizable.strings":()=>_(()=>import("./Localizable-Ci3CbmUn.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ko.lproj/Localizable.strings":()=>_(()=>import("./Localizable-D77jhC_I.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/nb.lproj/Localizable.strings":()=>_(()=>import("./Localizable-C9oe-MzY.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/nl.lproj/Localizable.strings":()=>_(()=>import("./Localizable-xGFqg3RX.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/pl.lproj/Localizable.strings":()=>_(()=>import("./Localizable-BJbCLI9P.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/pt-PT.lproj/Localizable.strings":()=>_(()=>import("./Localizable-GV7RLOjS.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/ru.lproj/Localizable.strings":()=>_(()=>import("./Localizable-C6DmhcQP.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/sv.lproj/Localizable.strings":()=>_(()=>import("./Localizable-BIGKVHUy.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/tr.lproj/Localizable.strings":()=>_(()=>import("./Localizable-DfZ_1xSh.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/uk.lproj/Localizable.strings":()=>_(()=>import("./Localizable-kzbwhE5h.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/zh-Hans.lproj/Localizable.strings":()=>_(()=>import("./Localizable-Bm7qfm_c.js"),[],import.meta.url).then(i=>i.default),"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/zh-Hant.lproj/Localizable.strings":()=>_(()=>import("./Localizable-BzxB11-K.js"),[],import.meta.url).then(i=>i.default)}),Ki=Object.assign({"../../../VisuStruct-iOS/VisuStructXcodeOpen/VisuStruct/Java.strings":()=>_(()=>import("./Java-C92fuLac.js"),[],import.meta.url).then(i=>i.default)}),Zi=Object.assign({"../i18n/ar.strings":()=>_(()=>import("./ar-CCAKfXB5.js"),[],import.meta.url).then(i=>i.default),"../i18n/da.strings":()=>_(()=>import("./da-CkTKTBmn.js"),[],import.meta.url).then(i=>i.default),"../i18n/de.strings":()=>_(()=>import("./de-C7C1mtyW.js"),[],import.meta.url).then(i=>i.default),"../i18n/el.strings":()=>_(()=>import("./el-BbuMj83H.js"),[],import.meta.url).then(i=>i.default),"../i18n/en.strings":()=>_(()=>import("./en-Cge5TutW.js"),[],import.meta.url).then(i=>i.default),"../i18n/es.strings":()=>_(()=>import("./es-ztGczOEt.js"),[],import.meta.url).then(i=>i.default),"../i18n/fr.strings":()=>_(()=>import("./fr-DBppMm2_.js"),[],import.meta.url).then(i=>i.default),"../i18n/he.strings":()=>_(()=>import("./he-CPaZSI7D.js"),[],import.meta.url).then(i=>i.default),"../i18n/it.strings":()=>_(()=>import("./it-Cbwh6Lwj.js"),[],import.meta.url).then(i=>i.default),"../i18n/ja.strings":()=>_(()=>import("./ja-DnIrr4De.js"),[],import.meta.url).then(i=>i.default),"../i18n/ko.strings":()=>_(()=>import("./ko-C6b8u_rX.js"),[],import.meta.url).then(i=>i.default),"../i18n/nb.strings":()=>_(()=>import("./nb-DfZXVvQd.js"),[],import.meta.url).then(i=>i.default),"../i18n/nl.strings":()=>_(()=>import("./nl-DTaj13nR.js"),[],import.meta.url).then(i=>i.default),"../i18n/pl.strings":()=>_(()=>import("./pl-tc2Mpaw2.js"),[],import.meta.url).then(i=>i.default),"../i18n/pt-PT.strings":()=>_(()=>import("./pt-PT-YfTIUaJ3.js"),[],import.meta.url).then(i=>i.default),"../i18n/ru.strings":()=>_(()=>import("./ru-CiTrt_s7.js"),[],import.meta.url).then(i=>i.default),"../i18n/sv.strings":()=>_(()=>import("./sv-ZlFFg1rq.js"),[],import.meta.url).then(i=>i.default),"../i18n/tr.strings":()=>_(()=>import("./tr-CoViURAK.js"),[],import.meta.url).then(i=>i.default),"../i18n/uk.strings":()=>_(()=>import("./uk-CvM2phhD.js"),[],import.meta.url).then(i=>i.default),"../i18n/zh-Hans.strings":()=>_(()=>import("./zh-Hans-m7rOpCpM.js"),[],import.meta.url).then(i=>i.default),"../i18n/zh-Hant.strings":()=>_(()=>import("./zh-Hant-CifDPWZe.js"),[],import.meta.url).then(i=>i.default)});function Rt(i,t){var e;return(e=Object.entries(i).find(([n])=>n.endsWith(t)))==null?void 0:e[1]}function Gi(i){const t=new Map,e=i.replace(/\/\*[\s\S]*?\*\//g,"").replace(/^\s*\/\/.*$/gm,""),n=/"((?:[^"\\]|\\.)*)"\s*=\s*"((?:[^"\\]|\\.)*)"\s*;/g,s=r=>r.replace(/\\(u[0-9a-fA-F]{4}|.)/g,(o,a)=>a==="n"?`
`:a==="t"?"	":a.startsWith("u")&&a.length===5?String.fromCharCode(parseInt(a.slice(1),16)):a);for(const r of e.matchAll(n))t.set(s(r[1]),s(r[2]));return t}async function Ee(i){const t=i==="java"?Rt(Ki,"/Java.strings"):Rt(Yi,`/${i}.lproj/Localizable.strings`),e=Rt(Zi,`/${i}.strings`),n=new Map;for(const s of[t,e])if(s)for(const[r,o]of Gi(await s()))n.set(r,o);return n}let un="en",hn=new Map,Tt=new Map;const dn="appLanguageCode";function Qi(){const i=new URLSearchParams(location.search).get("lang");if(i&&It.some(t=>t.code===i))return i;try{const t=localStorage.getItem(dn);if(t&&It.some(e=>e.code===t))return t}catch{}for(const t of navigator.languages??[navigator.language]){const e=t.toLowerCase();if(e.startsWith("zh"))return/hant|tw|hk|mo/.test(e)?"zh-Hant":"zh-Hans";if(e.startsWith("pt"))return"pt-PT";if(e.startsWith("no")||e.startsWith("nn"))return"nb";if(e.startsWith("iw"))return"he";const n=It.find(s=>s.code!=="java"&&s.code===e.split("-")[0]);if(n)return n.code}return"en"}async function mn(i,t=!0){if(Tt.size===0&&(Tt=await Ee("en")),hn=i==="en"?Tt:await Ee(i),un=i,t)try{localStorage.setItem(dn,i)}catch{}const e=document.documentElement;e.lang=i==="java"?"en":i,e.dir=i==="ar"||i==="he"?"rtl":"ltr"}function ne(){return un}function c(i,...t){const e=hn.get(i)??Tt.get(i)??i;if(t.length===0)return e;let n=0;return e.replace(/%(?:(\d+)\$)?[@d]/g,(s,r)=>String(t[r?Number(r)-1:n++]??""))}const pn={baseIndent:0,indentPerLevel:4,includeDiagramTextAsComments:!1,includeEmptyElseBranch:!0};function fn(i,t,e={}){const n={...pn,...e,jsIntVariables:new Set};let s="";t==="javascript"&&(s+=`"use strict";

`,n.jsIntVariables=zs(i)),t==="python"&&ks(i)&&(s+=`import random

`),t==="java"&&Ln(i)&&(s+=`// import java.util.Scanner;
`,s+=`Scanner scanner = new Scanner(System.in);

`);const r={out:s};for(const o of i.elements)kn(o,t,n,n.baseIndent,r);if(s=r.out,s.trim()===""){const o=ts(t);return t==="javascript"?`"use strict";

`+o:o}return Ts(s.replace(/^[\n\r]+|[\n\r]+$/g,""),t)}const f=i=>i>0?" ".repeat(i):"";function N(i,t){const e=i.exec(t);return e?Array.from(e,n=>n??""):void 0}function ts(i,t){return i==="python"?"# empty element":"// empty element"}const ie=i=>i.trim()==="ø";function gn(i,t){return f(i)+(t==="python"?`# empty element
`:`// empty element
`)}function es(i){switch(i.type){case d.leerElement:return!0;case d.anweisung:case d.aufruf:return i.textLines.map(t=>t.trim()).every(t=>t===""||ie(t));default:return!1}}function ns(i){return i.every(es)}function he(i,t,e){const n=i.map(s=>s.replace(/^[ \t]+|[ \t]+$/g,"")).filter(s=>s!=="");return n.length===0?"":t==="python"?f(e)+`"""
`+n.map(s=>f(e)+s+`
`).join("")+f(e)+`"""
`:n.length===1?f(e)+"/* "+n[0]+` */
`:f(e)+`/*
`+n.map(s=>f(e)+" * "+s+`
`).join("")+f(e)+` */
`}const is=i=>i==="java"||i==="javascript";function Pt(i){const t=i.trim();if(t==="")return"";if(t.startsWith("//")||t.startsWith("/*")||t.startsWith("*")||t.startsWith("#")||t.startsWith("{")||t.startsWith("}")||t.endsWith("{")||t.endsWith(";"))return t;const e=t.toLowerCase();for(const n of["if ","else","for ","while ","do ","switch ","case ","default"])if(e.startsWith(n))return t;return t+";"}function At(i){const t=i.map(e=>e.trim()).filter(e=>e!=="");return ss(t.length===0?"true":t.join(" "))}function ss(i){const t=i.trim();for(const e of["if","while","until","switch"]){const n=rs(e,t);if(n!==void 0)return n===""?"true":n}return t}function rs(i,t){if(!t.toLowerCase().startsWith(i))return;const e=t.slice(i.length);if(!(e===""||/^\s/.test(e)||e[0]==="("))return;let n=e.trim();return n.startsWith("(")&&n.endsWith(")")&&n.length>=2&&(n=n.slice(1,-1).trim()),n}function ot(i){let t=i.trim();for(;t.endsWith(";");)t=t.slice(0,-1).trim();return t}function os(i){const t=i.trim(),e=t.toLowerCase();let n;if(e.startsWith("output:"))n=t.slice(7).trim();else if(e.startsWith("print:"))n=t.slice(6).trim();else return;return n===""?void 0:n}const yn=i=>i.name.includes("[")&&i.name.includes("]");function xn(i){const t=i.trim();if(t==="")return;const e=N(/^\s*(integer|int|long|float|double|string|boolean|char|bool)\s+([a-zA-Z_]\w*(?:\s*\[[^\]]+\])?)(?:\s+"([^"]*)")?\s*$/i,t);if(e){const r=e[2].replaceAll(" ","");if(r==="")return;const o=(e[3]??"").trim();return{type:se(e[1]),name:r,customPrompt:o===""?void 0:o}}const n=N(/^\s*([a-zA-Z_]\w*(?:\s*\[[^\]]+\])?)\s+"([^"]*)"\s*$/i,t);if(n){const r=n[1].replaceAll(" ","");return["int","integer","long","float","double","string","boolean","char","bool","void"].includes(r.toLowerCase())?void 0:{type:r.includes("[")?"String":"int",name:r,customPrompt:n[2].trim()}}const s=as(t);if(s)return{type:se(s[0]),name:s[1]}}function se(i){switch(i.trim().toLowerCase()){case"integer":case"int":return"int";case"long":return"long";case"float":return"float";case"double":return"double";case"string":return"String";case"boolean":case"bool":return"boolean";case"char":return"char";default:return i}}function as(i){const t=i.split(/[ \t]+/).filter(Boolean);if(t.length===0)return;if(t.length>=2)return[t[0],t[1]];if(!["int","double","string","boolean","char","long","float","short","byte","void","bool","integer"].includes(t[0].toLowerCase()))return["int",t[0]]}function ls(i,t,e){const n=ot(i).trim();if(n.startsWith('"'))switch(t){case"java":return f(e)+"System.out.println("+n+`);
`;case"javascript":return f(e)+"console.log("+n+`);
`;case"python":return f(e)+"print("+n+`)
`}}function gt(i){return i.replaceAll("\\","\\\\").replaceAll('"','\\"').replaceAll(`
`,"\\n").replaceAll("\r","\\r")}function de(i){const t=i.trim();if(!t.toLowerCase().startsWith("input:"))return;const e=t.slice(6).trim();if(e!=="")return xn(e)}function cs(i,t){const e=de(i);if(!e)return;const n=e.customPrompt?e.customPrompt:e.name+": ",s=f(t)+'System.out.println("'+gt(n)+`");
`,r=o=>yn(e)?e.name:`${o} ${e.name}`;switch(e.type){case"int":return s+f(t)+`${r("int")} = scanner.nextInt();
`;case"double":return s+f(t)+`${r("double")} = scanner.nextDouble();
`;case"String":return s+f(t)+`${r("String")} = scanner.next();
`;default:return}}function us(i,t){const e=de(i);if(!e)return;const n=!!e.customPrompt,s=n?"":f(t)+'console.log("'+gt(e.name+": ")+`");
`,r=a=>{const h=n?e.customPrompt:e.name+": ";return`(prompt("${gt(h)}") ?? "${a}")`},o=yn(e)?e.name:`let ${e.name}`;switch(e.type){case"int":return s+f(t)+`${o} = parseInt(${r("0")}, 10);
`;case"double":return s+f(t)+`${o} = Number(${r("0")});
`;case"String":return s+f(t)+`${o} = ${r("")};
`;default:return}}function hs(i,t){const e=de(i);if(!e)return;const n=!!e.customPrompt,s=n?"":f(t)+'print("'+gt(e.name+": ")+`")
`,r=`input("${gt(n?e.customPrompt:e.name+": ")}")`;switch(e.type){case"int":return s+f(t)+`${e.name} = int(${r})
`;case"double":return s+f(t)+`${e.name} = float(${r})
`;case"String":return s+f(t)+`${e.name} = ${r}
`;default:return}}function ds(i,t,e){const n=os(i);if(n!==void 0)switch(t){case"java":return f(e)+"System.out.println("+n+`);
`;case"javascript":return f(e)+"console.log("+n+`);
`;case"python":return f(e)+"print("+n+`)
`}}function vn(i){const t=i.map(ot).filter(e=>e!=="");return t.length===0?";;":t.join("; ")}function ms(i){const e=vn(i).split(";"),n=ps(e[0]);return n!==void 0&&(e[0]=n),e.join(";")}function ps(i){const t=N(/^(\s*)(?:integer|int|long|float|double|string|boolean|char|bool)\s+(\w+)(?:\s*=\s*(.*))?\s*$/i,i);if(!t)return;const e=t[2].trim();if(e==="")return;const n=(t[3]??"").trim();return i.includes("=")&&n!==""?t[1]+`let ${e} = ${n}`:t[1]+`let ${e}`}function fs(i){for(const t of[/^\s*(?:int|long)\s+(\w+)\s*=\s*(-?\d+)\s*$/,/^\s*(\w+)\s*=\s*(-?\d+)\s*$/]){const e=N(t,i);if(e)return{name:e[1],value:Number(e[2])}}}function gs(i,t){let e=N(/^\s*(\w+)\s*<\s*(\d+)\s*$/,i);if(e&&e[1]===t)return String(Number(e[2]));if(e=N(/^\s*(\w+)\s*<=\s*(\d+)\s*$/,i),e&&e[1]===t)return String(Number(e[2])+1);if(e=N(/^\s*(\w+)\s*<\s*([a-zA-Z_]\w*)\.length(?:\(\))?\s*$/,i),e&&e[1]===t)return`len(${e[2]})`}function ys(i,t){const e=N(/^\s*(\w+)\s*\+\+\s*$/,i)??N(/^\s*(\w+)\s*\+=\s*1\s*$/,i);return(e==null?void 0:e[1])===t}function xs(i){const t=i.map(h=>ot(h).trim());if(t.filter(h=>h!=="").length<=1)return;const e=t.slice(0,3);for(;e.length<3;)e.push("");const[n,s,r]=e;if(n===""||s===""||r==="")return;const o=fs(n);if(!o)return;const a=gs(s,o.name);if(!(a===void 0||!ys(r,o.name)))return o.value===0?`for ${o.name} in range(${a}):`:`for ${o.name} in range(${o.value}, ${a}):`}function wn(i){const t=ot(i).trim();if(t==="")return;const e=N(/^\s*const\s+(integer|int|long|float|double|string|boolean|char|bool)\s+(\w+)(?:\s*=\s*(.*))?$/i,t);if(!e)return;const n=e[2].trim();if(n==="")return;if(!t.includes("="))return{rawType:e[1].trim(),name:n};const s=(e[3]??"").trim();if(s!=="")return{rawType:e[1].trim(),name:n,rhs:s}}function vs(i,t,e){var o;const n=wn(i);if(!n)return;const s=se(n.rawType),r=(o=n.rhs)==null?void 0:o.trim();switch(t){case"java":return f(e)+Pt(r?`final ${s} ${n.name} = ${r}`:`final ${s} ${n.name}`)+`
`;case"javascript":return r?f(e)+Pt(`const ${n.name} = ${r}`)+`
`:f(e)+`let ${n.name};  // from diagram: const ${s} ${n.name}
`;case"python":return r?f(e)+`${n.name} = ${me(r)}  # const ${s}
`:f(e)+`${n.name} = None  # const ${s}, uninitialized
`}}function ws(i){const t=ot(i).trim();if(t==="")return;const e=N(/^\s*(?:integer|int|long|float|double|string|boolean|char|bool)(?:\s*\[\s*\]\s+(\w+)|\s+(\w+)(\s*\[\s*\])?)\s*=\s*(.*)$/i,t);if(!e)return;const n=e[1]===""?e[2]:e[1],s=e[4].trim();if(s!=="")return{name:n,rhs:s,isArray:e[1]!==""||e[3]!==""}}function bn(i){const t=N(/^\s*\(\s*int(?:eger)?\s*\)\s*\(?\s*(.+?)\s*\)?\s*$/i,i),e=t==null?void 0:t[1].trim();return e||void 0}function me(i){const t=i.trim();if(t==="null")return"None";const e=bn(t);return e!==void 0?`int(${me(e)})`:t.replace(/\bMath\.random\s*\(\s*\)/gi,"random.random()")}const bs=i=>i.replace(/\bMath\.random\b(?!\s*\()/gi,"Math.random()");function _n(i){const t=i.trim();return t.startsWith("{")&&t.endsWith("}")?"["+t.slice(1,-1)+"]":i}function Sn(i){const t=N(/^\s*new\s+(?:byte|short|int|long|float|double|boolean|char|string)\s*\[\s*(.+)\s*\]\s*$/i,i),e=t==null?void 0:t[1].trim();return e||void 0}function zn(i,t){const e=i.trim();if(t){const s=Sn(e);return s!==void 0?`new Array(${s})`:_n(e)}const n=bn(e);return n!==void 0?`Math.floor(${zn(n,!1)})`:bs(e)}function _s(i,t){const e=i.trim();if(t){const n=Sn(e);return n!==void 0?`[None] * ${n}`:_n(e)}return me(e)}function Ss(i,t,e){if(t==="java")return;const n=ws(i);if(n)return t==="javascript"?f(e)+Pt(`let ${n.name} = ${zn(n.rhs,n.isArray)}`)+`
`:f(e)+`${n.name} = ${_s(n.rhs,n.isArray)}
`}function yt(i,t){for(const e of i){t(e),e.loopBody&&yt(e.loopBody,t);for(const n of e.cases??[])yt(n.elements,t)}}function zs(i){const t=n=>["int","integer","long","short","byte"].includes(n.trim().toLowerCase()),e=new Set;return yt(i.elements,n=>{for(const s of n.textLines){const r=s.trim();if(r==="")continue;if(r.toLowerCase().startsWith("input:")){const h=xn(r.slice(6).trim());h&&t(h.type)&&!h.name.includes("[")&&e.add(h.name);continue}const o=wn(r);if(o&&t(o.rawType)){e.add(o.name);continue}const a=N(/^\s*(integer|int|long|short|byte)\s+([a-zA-Z_]\w*)\s*=/i,r);a&&e.add(a[2].trim())}}),e}function Ls(i,t){const e=ot(i).trim();if(e==="")return;const n=N(/^\s*([a-zA-Z_]\w*)\s*=\s*([a-zA-Z_]\w*|\d+)\s*\/\s*([a-zA-Z_]\w*|\d+)\s*$/,e);if(n){const[,r,o,a]=n;return!t.has(r)||r!==o?void 0:`${r} = Math.floor(${o} / ${a})`}const s=N(/^\s*([a-zA-Z_]\w*)\s*\/=\s*([a-zA-Z_]\w*|\d+)\s*$/,e);if(s&&t.has(s[1]))return`${s[1]} = Math.floor(${s[1]} / ${s[2]})`}function Ln(i){let t=!1;return yt(i.elements,e=>{e.type===d.anweisung&&e.textLines.some(n=>n.trim().toLowerCase().startsWith("input:"))&&(t=!0)}),t}function ks(i){let t=!1;return yt(i.elements,e=>{e.textLines.some(n=>/\bMath\.random\s*\(/i.test(n))&&(t=!0)}),t}function Ht(i,t){const e=i.trim();return e===""?t==="python"?'""':"0":t==="java"||new RegExp("^\\p{N}+$","u").test(e)?e:'"'+e.replaceAll('"','\\"')+'"'}function Wt(i,t){const e=i.trim();if(e==="")return"";switch(t){case"java":return"/* "+e+" */";case"python":return"  # "+e;case"javascript":return" /* "+e+" */"}}function $s(i,t,e,n,s){const r=i.map(o=>o.trim());if(!r.every(o=>o==="")){if(e.includeDiagramTextAsComments){const o=r.filter(a=>a!==""&&!ie(a));o.length>0&&(s.out+=he(o,t,n))}for(const o of r){if(o==="")continue;if(ie(o)){s.out+=gn(n,t);continue}const a=(t==="java"?cs(o,n):void 0)??(t==="javascript"?us(o,n):void 0)??(t==="python"?hs(o,n):void 0)??ds(o,t,n)??vs(o,t,n)??Ss(o,t,n)??ls(o,t,n);if(a!==void 0){s.out+=a;continue}let h=o;if(is(t)){const l=t==="javascript"?Ls(o,e.jsIntVariables??new Set):void 0;h=Pt(l??o)}h!==""&&(s.out+=f(n)+h+`
`)}}}function Es(i,t,e,n,s,r,o){s.includeDiagramTextAsComments&&(o.out+=he(e,n,r)),o.out+=f(r)+i+At(e)+t}function Is(i,t,e,n,s){if(i.length===0){t==="python"&&(s.out+=f(n)+`pass
`);return}for(const r of i)kn(r,t,e,n,s)}function kn(i,t,e,n,s){const r=e.indentPerLevel,o=t==="python",a=(u,m)=>Is(u,t,e,m,s),h=(u,m)=>Es(u,m,i.textLines,t,e,n,s),l=(u=n)=>{e.includeDiagramTextAsComments&&(s.out+=he(i.textLines,t,u))};switch(i.type){case d.leerElement:s.out+=gn(n,t);return;case d.anweisung:case d.aufruf:$s(i.textLines,t,e,n,s);return;case d.aussprung:{const u=At(i.textLines);i.textLines.some(m=>m.trim()!=="")&&l(),o?s.out+=f(n)+(u===""?`break
`:`break  # ${u}
`):s.out+=f(n)+(u===""?`break;
`:`break; // ${u}
`);return}case d.verzweigung:{const u=i.cases;if(!u||u.length<2)return;const m=!e.includeEmptyElseBranch&&ns(u[1].elements);o?(h("if ",`:
`),a(u[0].elements,n+r),m||(s.out+=f(n)+`else:
`,a(u[1].elements,n+r))):(h("if (",`) {
`),a(u[0].elements,n+r),m||(s.out+=f(n)+`} else {
`,a(u[1].elements,n+r)),s.out+=f(n)+`}
`);return}case d.fallauswahl:{const u=i.cases;if(!u||u.length===0)return;h(o?"match ":"switch (",o?`:
`:`) {
`),u.forEach((m,g)=>{const b=g===u.length-1;if(t==="java"){const y=b?"default -> { "+Wt(m.name,t)+`
`:"case "+Ht(m.name,t)+` -> {
`;s.out+=f(n+r)+y,a(m.elements,n+r*2),s.out+=f(n+r)+`}
`}else if(o){const y=b?"case _:"+Wt(m.name,t):"case "+Ht(m.name,t)+":";s.out+=f(n+r)+y+`
`,a(m.elements,n+r*2)}else{const y=b?"default:"+Wt(m.name,t):"case "+Ht(m.name,t)+":";s.out+=f(n+r)+y+`
`,a(m.elements,n+r*2),s.out+=f(n+r*2)+`break;
`}}),o||(s.out+=f(n)+`}
`);return}case d.forSchleife:if(t==="java")l(),s.out+=f(n)+"for ("+vn(i.textLines)+`) {
`;else if(o){const u=xs(i.textLines);u!==void 0?(l(),s.out+=f(n)+u+`
`):h("for ",`:
`)}else l(),s.out+=f(n)+"for ("+ms(i.textLines)+`) {
`;a(i.loopBody??[],n+r),o||(s.out+=f(n)+`}
`);return;case d.whileSchleife:h(o?"while ":"while (",o?`:
`:`) {
`),a(i.loopBody??[],n+r),o||(s.out+=f(n)+`}
`);return;case d.doUntilSchleife:{const u=At(i.textLines);if(o){s.out+=f(n)+`while True:
`;const m=n+r;a(i.loopBody??[],m),l(m),s.out+=f(m)+"if not ("+u+`):
`,s.out+=f(m+r)+`break
`}else s.out+=f(n)+`do {
`,a(i.loopBody??[],n+r),l(),s.out+=f(n)+"} while ("+u+`);
`;return}case d.endlosschleife:{const u=At(i.textLines),m=u===""||u==="true";m||l(),o?s.out+=f(n)+(m?`while True:
`:`while True:  # ${u}
`):s.out+=f(n)+(m?`while (true) {
`:`while (true) /* ${u} */ {
`),a(i.loopBody??[],n+r),o||(s.out+=f(n)+`}
`);return}}}function Ts(i,t){switch(t){case"javascript":return i.replace(/\.length\(\)/g,".length");case"python":return i.replace(/\b([a-zA-Z_]\w*)\.length(?:\(\))?\b/g,"len($1)");case"java":return Cs(i)}}function As(i){const t="(?:byte|short|int|long|float|double|boolean|char|String)",e=[new RegExp(`\\b(?:final\\s+)?${t}\\s*\\[\\s*\\]\\s+([a-zA-Z_]\\w*)\\b`,"g"),new RegExp(`\\b(?:final\\s+)?${t}\\s+([a-zA-Z_]\\w*)\\s*\\[\\s*\\]`,"g")],n=new Set;for(const s of e)for(const r of i.matchAll(s))n.add(r[1].toLowerCase());return n}function Cs(i){const t=As(i);return i.replace(/\b([a-zA-Z_]\w*)\.length(?!\()/g,(e,n)=>t.has(n.toLowerCase())?e:`${n}.length()`)}const Bs=new Set("abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null var record sealed permits yield module open opens requires exports to uses provides with transitive".split(" "));function $n(i){const t=i.trim();if(t==="")return"Main";let e="";return Array.from(t).forEach((n,s)=>{s===0?new RegExp("\\p{L}","u").test(n)||n==="_"||n==="$"?e+=n:new RegExp("\\p{Nd}","u").test(n)?e+="_"+n:e+="_":/[\p{L}\p{M}\p{N}]/u.test(n)||n==="_"||n==="$"?e+=n:e+="_"}),e=e.replace(/_{2,}/g,"_").replace(/^_+|_+$/g,""),e===""?"Main":(new RegExp("^\\p{Nd}","u").test(e)&&(e="_"+e),Bs.has(e.toLowerCase())&&(e="_"+e),e)}function Ie(i,t,e={}){const n={...pn,...e},s=$n(t),r=fn(i,"java",n),o=n.indentPerLevel*2,a=Ln(i),h=a?Ms(r):r,l=f(o),u=h.trim()===""?"":h.split(`
`).map(g=>g.trim()===""?l:l+g).join(`
`);let m="";return a&&(m+=`import java.util.Scanner;

`),m+=`public class ${s} {
`,m+=f(n.indentPerLevel)+`public static void main(String[] args) {
`,a&&(m+=f(o)+`Scanner scanner = new Scanner(System.in);
`,u!==""&&(m+=`
`)),m+=u,u!==""&&!u.endsWith(`
`)&&(m+=`
`),m+=f(n.indentPerLevel)+`}
`,m+=`}
`,m}function Ms(i){const t=i.split(`
`);let e=0;for(t[e]==="// import java.util.Scanner;"&&e++;e<t.length&&t[e].trim()==="";)e++;for(t[e]==="Scanner scanner = new Scanner(System.in);"&&e++;e<t.length&&t[e].trim()==="";)e++;return e>=t.length?"":t.slice(e).join(`
`)}const Z={target:"visustruct.codegen.target",javaMode:"visustruct.codegen.javaOutputMode",comments:"visustruct.codegen.includeDiagramComments",emptyElse:"visustruct.codegen.includeEmptyElse"};function zt(i){try{return localStorage.getItem(i)}catch{return null}}function Lt(i,t){try{localStorage.setItem(i,t)}catch{}}const Ds=()=>c("web_run_stopped_loop"),En=()=>c("web_run_cancelled"),j=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Ps(i){let t=0;return i.replace(/^(\s*)while\s*\(\s*true\s*\)(?:\s*\/\*.*?\*\/)?\s*\{/gm,(e,n)=>{const s=`__visuStructLoopGuard${t++}`;return`${n}for (let ${s} = 0; ${s} < 100000 || (() => { throw new Error(${JSON.stringify(Ds())}); })(); ${s}++) {`})}function Vs(i){return Ps(i).replace(/\bprompt\s*\(/g,"await __visuStructPrompt(")}const js=`
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
  answer = (value) => (value === null ? reject(new Error(${JSON.stringify(En())})) : resolve(value))
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
`,Ut=2e3;class Os{constructor(t,e,n){p(this,"element");p(this,"target");p(this,"javaMode");p(this,"comments");p(this,"emptyElse");p(this,"code","");p(this,"codeView");p(this,"javaModeRow");p(this,"runButton");p(this,"saveButton");p(this,"copyButton");p(this,"runner");p(this,"runOutput");p(this,"runInput");p(this,"worker");p(this,"outputLines",[]);p(this,"droppedLines",0);p(this,"outputFrame");p(this,"pendingAnswer");this.currentDocument=t,this.saveFile=e,this.onClose=n;const s=zt(Z.target);this.target=s==="python"||s==="javascript"?s:"java",this.javaMode=zt(Z.javaMode)==="class"?"class":"snippet",this.comments=zt(Z.comments)==="true",this.emptyElse=zt(Z.emptyElse)!=="false",this.element=document.createElement("aside"),this.element.className="codepanel",this.build()}refresh(){const t=this.currentDocument(),e={includeDiagramTextAsComments:this.comments,includeEmptyElseBranch:this.emptyElse};this.code=this.target==="java"&&this.javaMode==="class"?Ie(t,this.classStem(),e):fn(t,this.target,e),this.codeView.textContent=this.code,this.javaModeRow.hidden=this.target!=="java",this.saveButton.hidden=this.target!=="java",this.runButton.hidden=this.target!=="javascript",this.target!=="javascript"&&this.stopRun(!0);for(const n of this.element.querySelectorAll("[data-target]"))n.setAttribute("aria-pressed",String(n.dataset.target===this.target));for(const n of this.element.querySelectorAll("[data-java-mode]"))n.setAttribute("aria-pressed",String(n.dataset.javaMode===this.javaMode))}close(){this.stopRun(!0)}classStem(){return this.currentDocument().caption.trim()||"Main"}build(){this.element.innerHTML=`
      <div class="code-head">
        <h2>${j(c("codegen_placeholder_title"))}</h2>
        <button class="code-close" title="${j(c("menu_close"))}" aria-label="${j(c("menu_close"))}">✕</button>
      </div>
      <div class="segmented" role="group" aria-label="${j(c("web_codegen_language"))}">
        <button data-target="java">Java</button><button data-target="python">Python</button><button data-target="javascript">JavaScript</button>
      </div>
      <div class="segmented java-mode" role="group" aria-label="${j(c("codegen_java_output_mode"))}">
        <button data-java-mode="snippet">${j(c("codegen_java_output_snippet"))}</button><button data-java-mode="class">${j(c("codegen_java_output_class"))}</button>
      </div>
      <label class="check"><input type="checkbox" data-opt="comments" /> ${j(c("web_codegen_comments"))}</label>
      <label class="check"><input type="checkbox" data-opt="emptyElse" /> ${j(c("web_codegen_empty_else"))}</label>
      <div class="code-actions">
        <button data-act="copy">${j(c("codegen_copy"))}</button>
        <button data-act="save">${j(c("codegen_save_java"))}</button>
        <button data-act="run" class="primary">${j(c("codegen_run_in_browser"))}</button>
      </div>
      <pre class="code-view" tabindex="0" dir="ltr"></pre>
      <div class="runner" hidden>
        <div class="runner-head"><h2>${j(c("simulation_output"))}</h2><button data-act="stop">${j(c("simulation_stop"))}</button></div>
        <pre class="runner-out" dir="ltr"></pre>
        <form class="runner-input" hidden>
          <label></label>
          <div class="sim-input-row"><input autocomplete="off" /><button type="submit">${j(c("simulation_input_submit"))}</button><button type="button" data-act="cancel">${j(c("close_unsaved_cancel"))}</button></div>
        </form>
      </div>
      <p class="hint">${j(c("codegen_generated_hint"))}</p>
    `;const t=s=>this.element.querySelector(s);this.codeView=t(".code-view"),this.javaModeRow=t(".java-mode"),this.runButton=t("[data-act=run]"),this.saveButton=t("[data-act=save]"),this.copyButton=t("[data-act=copy]"),this.runner=t(".runner"),this.runOutput=t(".runner-out"),this.runInput=t(".runner-input"),t(".code-close").addEventListener("click",()=>this.onClose());for(const s of this.element.querySelectorAll("[data-target]"))s.addEventListener("click",()=>{this.target=s.dataset.target,Lt(Z.target,this.target),this.refresh()});for(const s of this.element.querySelectorAll("[data-java-mode]"))s.addEventListener("click",()=>{this.javaMode=s.dataset.javaMode,Lt(Z.javaMode,this.javaMode),this.refresh()});const e=t("[data-opt=comments]");e.checked=this.comments,e.addEventListener("change",()=>{this.comments=e.checked,Lt(Z.comments,String(this.comments)),this.refresh()});const n=t("[data-opt=emptyElse]");n.checked=this.emptyElse,n.addEventListener("change",()=>{this.emptyElse=n.checked,Lt(Z.emptyElse,String(this.emptyElse)),this.refresh()}),this.copyButton.addEventListener("click",()=>this.copy()),this.saveButton.addEventListener("click",()=>{const s=$n(this.classStem()),r=Ie(this.currentDocument(),this.classStem(),{includeDiagramTextAsComments:this.comments,includeEmptyElseBranch:this.emptyElse});this.saveFile(`${s}.java`,r)}),this.runButton.addEventListener("click",()=>this.run()),t("[data-act=stop]").addEventListener("click",()=>this.stopRun(!1)),t("[data-act=cancel]").addEventListener("click",()=>this.answer(null)),this.runInput.addEventListener("submit",s=>{s.preventDefault(),this.answer(this.runInput.querySelector("input").value)})}async copy(){var e;let t=!1;try{await navigator.clipboard.writeText(this.code),t=!0}catch{const n=document.createRange();n.selectNodeContents(this.codeView);const s=getSelection();s==null||s.removeAllRanges(),s==null||s.addRange(n),t=((e=document.execCommand)==null?void 0:e.call(document,"copy"))??!1}this.copyButton.textContent=c(t?"web_copied_check":"web_copy_manual"),setTimeout(()=>this.copyButton.textContent=c("codegen_copy"),2e3)}run(){this.stopRun(!0),this.runner.hidden=!1,this.runOutput.textContent="",this.outputLines=[],this.droppedLines=0,this.runOutput.classList.remove("error");const t=Vs(this.code),e=n=>this.onRunnerMessage(n);try{const n=URL.createObjectURL(new Blob([js],{type:"text/javascript"})),s=new Worker(n);URL.revokeObjectURL(n),s.onmessage=r=>e(r.data),s.onerror=r=>{r.preventDefault(),e({type:"error",text:r.message||c("web_run_error")})},s.postMessage({type:"run",code:t}),this.worker=s}catch{this.runInPage(t,e)}this.setRunning(!0)}runInPage(t,e){const n={log:(...o)=>e({type:"log",lines:[o.map(a=>typeof a=="string"?a:JSON.stringify(a)).join(" ")]})},s=o=>new Promise((a,h)=>{this.pendingAnswer=l=>l===null?h(new Error(En())):a(l),e({type:"prompt",text:o})}),r=(async()=>{}).constructor;new r("__visuStructPrompt","console",t)(s,n).then(()=>e({type:"done"})).catch(o=>e({type:"error",text:String(o)}))}onRunnerMessage(t){switch(t.type){case"log":this.appendOutput(t.lines??[]);break;case"prompt":{this.runInput.hidden=!1,this.runInput.querySelector("label").textContent=t.text??"";const e=this.runInput.querySelector("input");e.value="",e.focus();break}case"error":this.appendOutput([t.text??""]),this.runOutput.classList.add("error"),this.stopRun(!1);break;case"done":this.stopRun(!1);break}}appendOutput(t){this.outputLines.push(...t),this.outputLines.length>Ut&&(this.droppedLines+=this.outputLines.length-Ut,this.outputLines.splice(0,this.outputLines.length-Ut)),this.outputFrame===void 0&&(this.outputFrame=requestAnimationFrame(()=>{this.outputFrame=void 0;const e=this.droppedLines>0?c("web_run_dropped_fmt",this.droppedLines)+`
`:"";this.runOutput.textContent=e+this.outputLines.join(`
`)+(this.outputLines.length?`
`:""),this.runOutput.scrollTop=this.runOutput.scrollHeight}))}answer(t){var e;this.runInput.hidden=!0,this.worker?this.worker.postMessage({type:"answer",value:t}):(e=this.pendingAnswer)==null||e.call(this,t),this.pendingAnswer=void 0}stopRun(t){var e;(e=this.worker)==null||e.terminate(),this.worker=void 0,this.pendingAnswer=void 0,this.runInput&&(this.runInput.hidden=!0),t&&this.runner&&(this.runner.hidden=!0),this.setRunning(!1)}setRunning(t){const e=this.element.querySelector("[data-act=stop]");e&&(e.disabled=!t)}}const Ns={left:12,top:10},Fs=8,Vt=8e3,dt=16,Xt=12,In="#fafafa";function Tn(i){const t=i.caption.trim();return t===""?c("diagram_title_placeholder"):t}function Te(i){let t=i.trim().replace(/\.visustruct$/i,"");if(t==="")return"";for(t=t.replace(/\s/g,"-").replace(/[/:\\*?"<>|]/g,"-");t.includes("--");)t=t.replace(/--/g,"-");return t=t.replace(/^-+|-+$/g,""),t.length>120&&(t=t.slice(0,120).replace(/^-+|-+$/g,"")),t}function Rs(i,t){return Te(i.caption)||Te(t)||"VisuStruct"}function Hs(i,t,e){const n=i.split(/\s+/),s=[];let r="";for(const o of n){const a=r?`${r} ${o}`:o;r&&e(a,dt,"bold")>t?(s.push(r),r=o):r=a}if(r&&s.push(r),s.length>2){let o=s.slice(1).join(" ");for(;o.length>1&&e(o+"…",dt,"bold")>t;)o=o.slice(0,-1);return[s[0],o+"…"]}return s}function Ws(i,t,e){const n={...i,elements:i.elements.map(Dt)},s=new on(t,e).layout(n,Ns),r=Math.min(Vt,Math.max(320,s.canvasSize.width)),o=Math.min(Vt,Math.max(320,s.canvasSize.height));if(r<=2||o<=2)return;const a=Hs(Tn(i),r-2*Xt,e),h=Math.ceil(dt*1.2),l=Math.min(56,a.length*h+2),u=l+o,m=new cn(t,e).render(s,{width:r,height:o},void 0,Fs);m.setAttribute("y",String(l)),m.removeAttribute("class");const g=T("svg",{xmlns:"http://www.w3.org/2000/svg",width:r,height:u,viewBox:`0 0 ${r} ${u}`});g.append(T("rect",{x:0,y:0,width:r,height:u,fill:In}));const b=T("text",{x:Xt,y:0,"font-family":ue,"font-size":dt,"font-weight":600,fill:"black"});return a.forEach((y,L)=>{const v=T("tspan",{x:Xt,y:L*h+dt});v.textContent=y,b.append(v)}),g.append(b,m),{svg:g,width:r,height:u}}function An(i){return`<?xml version="1.0" encoding="UTF-8"?>
`+new XMLSerializer().serializeToString(i.svg)}async function Ae(i,t){const e=Math.max(1,Math.min(t,Vt/i.width,Vt/i.height)),n=URL.createObjectURL(new Blob([An(i)],{type:"image/svg+xml"}));try{const s=new Image;s.src=n,await s.decode();const r=document.createElement("canvas");r.width=Math.round(i.width*e),r.height=Math.round(i.height*e);const o=r.getContext("2d");return o.fillStyle=In,o.fillRect(0,0,r.width,r.height),o.drawImage(s,0,0,r.width,r.height),r}finally{URL.revokeObjectURL(n)}}function Us(i){return new Promise((t,e)=>i.toBlob(n=>n?t(n):e(new Error("PNG konnte nicht erzeugt werden.")),"image/png"))}function Xs(i,t){const s=Math.max(1,i),r=Math.max(1,t),o=L=>{const v=L.width-64,x=L.height-64;return{s:Math.min(v/s,x/r)*.98,cw:v,ch:x}},a={width:595,height:842},h={width:842,height:595},l=o(a),u=o(h),[m,g]=u.s>l.s?[h,u]:[a,l],b=s*g.s,y=r*g.s;return{page:m,draw:{x:32+(g.cw-b)/2,y:32+(g.ch-y)/2,width:b,height:y}}}async function qs(i){const t=new Blob([i]).stream().pipeThrough(new CompressionStream("deflate"));return new Uint8Array(await new Response(t).arrayBuffer())}function Ce(i){let t="FEFF";for(let e=0;e<i.length;e++)t+=i.charCodeAt(e).toString(16).padStart(4,"0").toUpperCase();return`<${t}>`}async function Js(i,t,e,n,s){const{page:r,draw:o}=Xs(n.width,n.height),a=await qs(i),h=x=>(Math.round(x*100)/100).toString(),l=`q ${h(o.width)} 0 0 ${h(o.height)} ${h(o.x)} ${h(r.height-o.y-o.height)} cm /Im0 Do Q`,u=new TextEncoder,m=[["<< /Type /Catalog /Pages 2 0 R >>"],["<< /Type /Pages /Kids [3 0 R] /Count 1 >>"],[`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${r.width} ${r.height}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`],[`<< /Type /XObject /Subtype /Image /Width ${t} /Height ${e} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /FlateDecode /Length ${a.length} >>
stream
`,a,`
endstream`],[`<< /Length ${l.length} >>
stream
${l}
endstream`],[`<< /Creator ${Ce("VisuStruct")} /Title ${Ce(s)} >>`]],g=[];let b=0;const y=x=>{const z=typeof x=="string"?u.encode(x):x;g.push(z),b+=z.length};y(`%PDF-1.4
%âãÏÓ
`);const L=[];m.forEach((x,z)=>{L.push(b),y(`${z+1} 0 obj
`),x.forEach(y),y(`
endobj
`)});const v=b;y(`xref
0 ${m.length+1}
0000000000 65535 f 
`);for(const x of L)y(`${String(x).padStart(10,"0")} 00000 n 
`);return y(`trailer
<< /Size ${m.length+1} /Root 1 0 R /Info ${m.length} 0 R >>
startxref
${v}
%%EOF
`),new Blob(g,{type:"application/pdf"})}function Ys(i){const{data:t}=i.getContext("2d").getImageData(0,0,i.width,i.height),e=new Uint8Array(i.width*i.height*3);for(let n=0,s=0;n<t.length;n+=4,s+=3)e[s]=t[n],e[s+1]=t[n+1],e[s+2]=t[n+2];return e}function Cn(i){switch(i.kind){case"finished":return"Simulation finished.";case"infiniteLoopWithoutBody":return"Infinite loop has no body.";case"unsupportedStatement":return`Unsupported statement: ${i.text}`;case"invalidExpression":return`Invalid expression: ${i.text}`;case"unknownVariable":return`Unknown variable: ${i.text}`;case"divisionByZero":return"Division by zero.";case"wholeNumberExpected":return"Please enter a whole number.";case"numberExpected":return"Please enter a number.";case"other":return i.text}}class et extends Error{constructor(t){super(Cn(t)),this.notice=t}}const F=i=>new et({kind:"unsupportedStatement",text:i}),$=i=>new et({kind:"invalidExpression",text:i}),lt=i=>new et({kind:"unknownVariable",text:i}),Ks=()=>new et({kind:"divisionByZero"});function Be(i){return i instanceof et?i.notice:{kind:"other",text:i instanceof Error?i.message:String(i)}}function Zs(i){if(i===0)return"0";if(!Number.isFinite(i))return Number.isNaN(i)?"nan":i>0?"inf":"-inf";const t=Math.floor(Math.log10(Math.abs(Number(i.toPrecision(12)))));if(t<-4||t>=12){const[n,s]=i.toExponential(11).split("e"),r=n.includes(".")?n.replace(/0+$/,"").replace(/\.$/,""):n,o=Number(s);return`${r}e${o<0?"-":"+"}${String(Math.abs(o)).padStart(2,"0")}`}const e=i.toFixed(Math.max(0,11-t));return e.includes(".")?e.replace(/0+$/,"").replace(/\.$/,""):e}function Me(i){return Number.isFinite(i)&&Math.round(i)===i?i.toFixed(1):Zs(i)}function R(i){switch(i.kind){case"int":return String(i.value);case"double":return Me(i.value);case"string":return i.value;case"intArray":return"["+i.value.map(String).join(", ")+"]";case"doubleArray":return"["+i.value.map(Me).join(", ")+"]";case"stringArray":return"["+i.value.join(", ")+"]"}}function Gs(i){return i.kind==="int"||i.kind==="double"?i.value:NaN}const st=i=>({kind:"int",value:i}),q=i=>({kind:"double",value:i}),Bn=i=>i!==void 0&&/\s/u.test(i),jt=i=>new RegExp("\\p{L}","u").test(i),ct=i=>new RegExp("\\p{N}","u").test(i);function mt(i){const t=Array.from(i);return t.length===0||!(jt(t[0])||t[0]==="_")?!1:t.every(e=>jt(e)||ct(e)||e==="_")}function it(i){switch(i.toLowerCase()){case"int":return"int";case"double":return"double";case"string":return"string";default:return}}function Qs(i){return i.kind==="int"?"int":i.kind==="double"?"double":"string"}function Q(i){const t=Array.from(i);if(!(t.length<2||t[0]!=='"'||t[t.length-1]!=='"'))return t.slice(1,-1).join("").replaceAll('\\"','"').replaceAll("\\n",`
`)}function De(i){return i.replaceAll("(int)","").replaceAll("(double)","").trim()}function pe(i){const t=new Array(i.length).fill(!1);let e=0,n=!1,s=!1;return i.forEach((r,o)=>{if(n){s?s=!1:r==="\\"?s=!0:r==='"'&&(n=!1);return}switch(r){case'"':n=!0;break;case"(":case"[":e+=1;break;case")":case"]":e-=1;break;default:t[o]=e===0}}),t}function Pe(i,t){const e=Array.from(i),n=Array.from(t),s=pe(e),r=[];let o=[],a=0;for(;a<e.length;){const h=a+n.length;if(h<=e.length&&n.every((l,u)=>e[a+u]===l)&&s.slice(a,h).every(Boolean)){r.push(o.join("").trim()),o=[],a=h;continue}o.push(e[a]),a+=1}return r.push(o.join("").trim()),r}function tr(i){const t=Array.from(i),e=pe(t);for(let n=0;n<t.length;n++){if(!e[n])continue;let s;if(n+1<t.length&&e[n+1]){const a=t[n]+t[n+1];[">=","<=","==","!="].includes(a)&&(s=a)}if(s===void 0&&(t[n]==="<"||t[n]===">")&&(s=t[n]),s===void 0)continue;const r=t.slice(0,n).join("").trim(),o=t.slice(n+s.length).join("").trim();return{lhs:r,op:s,rhs:o}}}function Mn(i,t){let e=0,n=!1,s=!1;for(let r=t;r<i.length;r++){const o=i[r];if(n){s?s=!1:o==="\\"?s=!0:o==='"'&&(n=!1);continue}if(o==='"')n=!0;else if(o==="(")e+=1;else if(o===")"&&(e-=1,e===0))return r}}function Dn(i){const t=Array.from(i);if(!(t[0]!=="("||t[t.length-1]!==")"||Mn(t,0)!==t.length-1))return t.slice(1,-1).join("").trim()}function er(i){const t=Array.from(i),e=Array.from(".equals(");if(t[t.length-1]!==")")return;const n=pe(t);for(let s=0;s<t.length;s++){if(!n[s]||s+e.length>t.length||!e.every((o,a)=>t[s+a]===o))continue;const r=s+e.length-1;if(Mn(t,r)===t.length-1)return{lhs:t.slice(0,s).join("").trim(),rhs:t.slice(r+1,-1).join("").trim()}}}function kt(i){const t=i.trim();for(const e of["if","while","until","switch"]){if(!t.startsWith(e))continue;const n=t.slice(e.length);if(!(n===""||Bn(n[0])||n[0]==="("))continue;let s=n.trim();const r=Dn(s);return r!==void 0&&(s=r),s===""?"true":s}return t===""?"true":t}function Ct(i){const t=i.trim(),e=t.indexOf("[");if(!t.endsWith("]")||e<0)return;const n=t.slice(0,e).trim();if(mt(n))return{arrayName:n,indexExpression:t.slice(e+1,-1)}}function Ve(i){return mt(i)||Ct(i)!==void 0}function je(i){const t=[];let e="",n=!1,s=!1;for(const r of i){if(s){e+=r,s=!1;continue}if(r==="\\"){e+=r,s=!0;continue}if(r==='"'){n=!n,e+=r;continue}if(r==="+"&&!n){t.push(e),e="";continue}e+=r}if(n)throw $(i);return t.push(e),t}function Oe(i){const t=Array.from(i),e=[];let n=0;for(;n<t.length;){const s=t[n];if(Bn(s)){n+=1;continue}if(ct(s)||s==="."&&n+1<t.length&&ct(t[n+1])){const r=n;let o=0;for(;n<t.length;){if(t[n]==="."){if(o+=1,o>1)throw $(i)}else if(!ct(t[n]))break;n+=1}const a=t.slice(r,n).join("");if(a==="."||!/^[0-9]*\.?[0-9]*$/.test(a))throw $(i);e.push({t:"number",literal:a,value:Number(a)});continue}if(jt(s)||s==="_"){const r=n;for(;n<t.length&&(jt(t[n])||ct(t[n])||t[n]==="_");)n+=1;e.push({t:"identifier",name:t.slice(r,n).join("")});continue}if("+-*/%.()[]".includes(s)){e.push({t:s}),n+=1;continue}throw $(i)}return e}class nr{constructor(t,e){p(this,"index",0);this.tokens=t,this.variables=e}parseInt(){const t=this.expression();if(this.index!==this.tokens.length||!Number.isFinite(t))throw $("");return Math.trunc(t)}parseDouble(){const t=this.expression();if(this.index!==this.tokens.length)throw $("");return t}get current(){return this.tokens[this.index]}kind(){var t;return(t=this.tokens[this.index])==null?void 0:t.t}isIdent(t){const e=this.current;return(e==null?void 0:e.t)==="identifier"&&e.name===t}expression(){let t=this.term();for(let e=this.current;e&&(e.t==="+"||e.t==="-");e=this.current){this.index+=1;const n=this.term();t=e.t==="+"?t+n:t-n}return t}term(){let t=this.factor();for(let e=this.current;e&&(e.t==="*"||e.t==="/"||e.t==="%");e=this.current){this.index+=1;const n=this.factor();if(e.t==="*")t*=n;else{if(n===0)throw Ks();t=e.t==="/"?t/n:t%n}}return t}factor(){const t=this.current;if(!t)throw $("");switch(this.index+=1,t.t){case"number":return t.value;case"identifier":{const e=t.name;if(e==="Math"&&this.kind()==="."){if(this.index+=1,!this.isIdent("random"))throw $(e);if(this.index+=1,this.kind()!=="("||(this.index+=1,this.kind()!==")"))throw $("Math.random");return this.index+=1,Math.random()}const n=this.variables.get(e);if(!n)throw lt(e);if(this.kind()==="."){if(this.index+=1,!this.isIdent("length"))throw $(e);if(this.index+=1,this.kind()==="("){if(this.index+=1,this.kind()!==")")throw $(`${e}.length`);this.index+=1}if(n.kind==="intArray"||n.kind==="doubleArray"||n.kind==="stringArray")return n.value.length;throw $(e)}if(this.kind()==="["){this.index+=1;const r=Math.trunc(this.expression());if(this.kind()!=="]")throw $(e);if(this.index+=1,n.kind==="intArray"||n.kind==="doubleArray"){if(!(r>=0&&r<n.value.length))throw $(`${e}[${r}]`);return n.value[r]}throw $(e)}const s=Gs(n);if(!Number.isFinite(s))throw $(e);return s}case"-":return-this.factor();case"(":{const e=this.expression();if(this.kind()!==")")throw $("");return this.index+=1,e}default:throw $("")}}}function ir(i){let t=i.trim();for(;t.endsWith(";");)t=t.slice(0,-1).trim();return t}function Ne(i){const t=i.slice(0,3);for(;t.length<3;)t.push("");return t}function re(i){const t=i.map(e=>ir(e).trim());return t.length===1&&t[0].includes(";")?Ne(t[0].split(";").map(e=>e.trim())):Ne(t)}function X(i,t=[]){const e=[];return i.forEach((n,s)=>{const r=[...t,s],o=n.textLines.join(" ").trim();switch(n.type){case d.anweisung:o!==""&&e.push({path:r,text:o,kind:"statement"});break;case d.verzweigung:e.push({path:r,text:o||"true",kind:"branch",cases:n.cases});break;case d.fallauswahl:e.push({path:r,text:o||"0",kind:"switchSelection",cases:n.cases});break;case d.forSchleife:e.push({path:r,text:o,kind:"forLoopStart",loopBody:n.loopBody,forParts:re(n.textLines)});break;case d.whileSchleife:e.push({path:r,text:o||"true",kind:"whileLoop",loopBody:n.loopBody});break;case d.doUntilSchleife:e.push({path:r,text:o||"true",kind:"doUntilLoop",loopBody:n.loopBody});break;case d.endlosschleife:e.push({path:r,text:o||"true",kind:"infiniteLoop",loopBody:n.loopBody});break}}),e}function sr(i,t){const e=i.trim().replaceAll(",",".");switch(t){case"int":if(!/^[+-]?[0-9]+$/.test(e))throw new et({kind:"wholeNumberExpected"});return st(Number(e));case"double":if(!/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)([eE][+-]?[0-9]+)?$/.test(e))throw new et({kind:"numberExpected"});return q(Number(e));case"string":return{kind:"string",value:i}}}function Fe(){return{stepIndex:0,variables:new Map,outputLines:[],isHalted:!1}}function rr(i,t){for(let e=0;e<t.length;e++){const n=t[e].name.trim();if(n.toLowerCase()!=="default"){if(i.kind==="int"){if(/^[+-]?[0-9]+$/.test(n)&&Number(n)===i.value)return e}else if(Q(n)===i.value||n===i.value)return e}}}class Re{constructor(t){p(this,"steps");p(this,"state",Fe());this.steps=X(t.elements)}get currentStepPath(){var t;return(t=this.steps[this.state.stepIndex])==null?void 0:t.path}get canStep(){return!this.state.isHalted&&!this.state.inputRequest&&this.state.stepIndex<this.steps.length}get message(){return this.state.notice&&Cn(this.state.notice)}reset(t){t&&(this.steps=X(t.elements)),this.state=Fe()}step(){const t=this.state;if(!this.canStep){!t.inputRequest&&!t.isHalted&&(t.notice={kind:"finished"});return}const e=this.steps[t.stepIndex];try{switch(e.kind){case"statement":this.executeStatement(e.text);break;case"branch":return this.executeBranch(e);case"switchSelection":return this.executeSwitchSelection(e);case"forLoopStart":return this.executeForLoopStart(e);case"forLoopCondition":return this.executeForLoopCondition(e);case"forLoopIncrement":return this.executeForLoopIncrement(e);case"whileLoop":return this.executeWhileLoop(e);case"doUntilLoop":return this.enterDoUntilLoop(e);case"doUntilCondition":return this.executeDoUntilCondition(e);case"infiniteLoop":return this.enterInfiniteLoop(e)}if(t.inputRequest){t.notice=void 0;return}t.stepIndex+=1,t.notice=this.finishedIfAtEnd()}catch(n){t.notice=Be(n),t.isHalted=!0}}provideInput(t){const e=this.state.inputRequest;if(e){try{const n=sr(t,e.valueType);this.assignValue(n,e.variableName),this.state.lastTrace=`${e.variableName} = input -> ${R(n)}`}catch(n){this.state.inputErrorNotice=Be(n);return}this.state.inputRequest=void 0,this.state.inputErrorNotice=void 0,this.state.stepIndex+=1,this.state.notice=this.finishedIfAtEnd()}}finishedIfAtEnd(){return this.state.stepIndex>=this.steps.length?{kind:"finished"}:void 0}splice(t){this.steps.splice(this.state.stepIndex,1,...t)}noticeAfterEntering(t){return t.length>0?void 0:this.finishedIfAtEnd()}executeBranch(t){const e=t.cases;if(!e||e.length<2)throw F(t.text);const n=kt(t.text),s=this.evaluateBool(n),r=s?0:1,o=X(e[r].elements,[...t.path,r]);this.splice(o),this.state.lastTrace=`${n} -> ${s}`,this.state.notice=this.noticeAfterEntering(o)}executeSwitchSelection(t){const e=t.cases;if(!e||e.length===0)throw F(t.text);const n=kt(t.text),s=this.evaluateSwitchSelector(n),r=rr(s,e)??e.length-1,o=X(e[r].elements,[...t.path,r]);this.splice(o),this.state.lastTrace=`${n} -> ${e[r].name}`,this.state.notice=this.noticeAfterEntering(o)}executeForLoopStart(t){const e=re(t.forParts??[t.text]);e[0]!==""&&this.executeStatement(e[0]),this.splice([{path:t.path,text:e[1],kind:"forLoopCondition",loopBody:t.loopBody,forParts:e}])}executeForLoopCondition(t){const e=re(t.forParts??[t.text]),n=e[1]===""?"true":e[1],s=this.evaluateBool(n);if(this.state.lastTrace=`${n} -> ${s}`,s){const r=X(t.loopBody??[],[...t.path,0]);this.splice([...r,{path:t.path,text:e[2],kind:"forLoopIncrement",loopBody:t.loopBody,forParts:e},{path:t.path,text:e[1],kind:"forLoopCondition",loopBody:t.loopBody,forParts:e}])}else this.splice([]),this.state.notice=this.finishedIfAtEnd()}executeForLoopIncrement(t){const e=t.text.trim();e!==""&&this.executeIncrement(e),this.splice([])}executeWhileLoop(t){const e=kt(t.text),n=this.evaluateBool(e);if(this.state.lastTrace=`${e} -> ${n}`,n){const s=X(t.loopBody??[],[...t.path,0]);this.splice([...s,{path:t.path,text:t.text,kind:"whileLoop",loopBody:t.loopBody}]),this.state.notice=this.noticeAfterEntering(s)}else this.splice([]),this.state.notice=this.finishedIfAtEnd()}enterDoUntilLoop(t){const e=X(t.loopBody??[],[...t.path,0]);this.splice([...e,{path:t.path,text:t.text,kind:"doUntilCondition",loopBody:t.loopBody}]),this.state.notice=this.noticeAfterEntering(e)}executeDoUntilCondition(t){const e=kt(t.text),n=this.evaluateBool(e);if(this.state.lastTrace=`${e} -> ${n}`,n){const s=X(t.loopBody??[],[...t.path,0]);this.splice([...s,{path:t.path,text:t.text,kind:"doUntilCondition",loopBody:t.loopBody}])}else this.splice([]),this.state.notice=this.finishedIfAtEnd()}enterInfiniteLoop(t){const e=X(t.loopBody??[],[...t.path,0]);this.splice([...e,{path:t.path,text:t.text,kind:"infiniteLoop",loopBody:t.loopBody}]),this.state.lastTrace="true -> true",this.state.notice=e.length>0?void 0:{kind:"infiniteLoopWithoutBody"}}executeStatement(t){const e=this.state,n=t.trim(),s=n.toLowerCase();if(s.startsWith("input:")){e.inputRequest=this.parseInputRequest(n),e.inputErrorNotice=void 0;return}if(s.startsWith("output:")||s.startsWith("print:")){const b=n.slice(s.startsWith("output:")?7:6),y=this.renderOutputExpression(b),L=this.evaluateOutputExpression(b);e.outputLines.push(L),e.lastTrace=`${y} -> ${L}`;return}if(n.endsWith("++")||n.endsWith("--")||n.includes("+=")||n.includes("-=")){this.executeIncrement(n);return}const r=n.indexOf("=");if(r<0)throw F(n);const o=n.slice(0,r).trim(),a=n.slice(r+1),h=this.parseArrayDeclaration(o,a);if(h){e.variables.set(h.name,h.value),e.lastTrace=`${h.name} = new ${h.typeName}[${h.count}]`;return}const l=this.parseAssignmentTarget(o);let u;try{u=this.renderNumericExpression(a)}catch{u=a.trim()}let m=l.valueType;if(!m)try{m=this.inferTargetValueType(l.variableName)}catch{m="int"}const g=this.evaluateExpression(a,m);this.assignValue(g,l.variableName),e.lastTrace=`${l.variableName} = ${u} -> ${R(g)}`}executeIncrement(t){const e=this.state.variables;for(const[n,s]of[["++",1],["--",-1]]){if(!t.endsWith(n))continue;const r=t.slice(0,-2).trim(),o=e.get(r);if(!mt(r)||!o)throw F(t);const a=s>0?"+":"-";if(o.kind==="int"){e.set(r,st(o.value+s)),this.state.lastTrace=`${r} = ${o.value} ${a} 1 -> ${o.value+s}`;return}if(o.kind==="double"){const h=o.value+s;e.set(r,q(h)),this.state.lastTrace=`${r} = ${R(o)} ${a} 1 -> ${R(q(h))}`;return}throw F(t)}for(const[n,s]of[["+=",1],["-=",-1]]){const r=t.indexOf(n);if(r<0)continue;const o=t.slice(0,r).trim(),a=t.slice(r+2),h=e.get(o);if(!mt(o)||!h)throw F(t);const l=s>0?"+":"-";if(h.kind==="int"){const u=this.evaluateInt(a),m=h.value+s*u;e.set(o,st(m)),this.state.lastTrace=`${o} = ${h.value} ${l} ${u} -> ${m}`;return}if(h.kind==="double"){const u=this.evaluateDouble(a),m=h.value+s*u;e.set(o,q(m)),this.state.lastTrace=`${o} = ${R(h)} ${l} ${R(q(u))} -> ${R(q(m))}`;return}throw F(t)}this.executeStatement(t)}parseAssignmentTarget(t){const e=t.split(/\s+/u).filter(Boolean);let n,s;if(e.length===1)n=e[0];else if(e.length===2&&it(e[0]))n=e[1],s=it(e[0]);else if(e.length===3&&e[0]==="const"&&it(e[1]))n=e[2],s=it(e[1]);else throw F(t);if(!Ve(n))throw F(t);return{variableName:n,valueType:s}}parseInputRequest(t){const e=t.slice(6).trim(),n=/^(\S+)(?:\s+(\S+))?(?:\s+([\s\S]*))?$/u.exec(e);if(!n)throw F(t);const s=[n[1],n[2],n[3]].filter(u=>u!==void 0);let r,o,a;const h=it(s[0]);if(s.length>=2&&h?(r=s[1],o=h,a=(s[2]??"").trim()):(r=s[0],o=this.inferTargetValueType(r),a=(s[1]??"").trim()),!Ve(r))throw F(t);const l=Q(a)??a;return{variableName:r,valueType:o,prompt:l===""?`${r}:`:l}}parseArrayDeclaration(t,e){const n=t.split(/\s+/u).filter(Boolean);if(n.length!==2||!n[0].endsWith("[]"))return;const s=n[0].slice(0,-2),r=it(s),o=n[1];if(!r||!mt(o))throw F(t);const a=e.trim();if(a.startsWith("{")&&a.endsWith("}")){const g=a.slice(1,-1).split(",").map(y=>y.trim());let b;switch(r){case"int":b={kind:"intArray",value:g.map(y=>this.evaluateInt(y))};break;case"double":b={kind:"doubleArray",value:g.map(y=>this.evaluateDouble(y))};break;case"string":b={kind:"stringArray",value:g.map(y=>Q(y)??this.evaluateOutputExpression(y))};break}return{name:o,typeName:s,count:g.length,value:b}}const h=`new ${s}[`;if(!a.startsWith(h)||!a.endsWith("]"))throw F(e);const l=a.slice(h.length,-1),u=this.evaluateInt(l);if(u<0)throw $(l);const m=r==="int"?{kind:"intArray",value:new Array(u).fill(0)}:r==="double"?{kind:"doubleArray",value:new Array(u).fill(0)}:{kind:"stringArray",value:new Array(u).fill("")};return{name:o,typeName:s,count:u,value:m}}arrayIndex(t){const e=this.evaluateInt(t);if(e<0)throw $(t);return e}evaluateReference(t){const e=t.trim(),n=this.state.variables.get(e);if(n)return n;const s=Ct(e);if(s)return this.valueInArray(s.arrayName,this.arrayIndex(s.indexExpression))}valueInArray(t,e){const n=this.state.variables.get(t);if(!n)throw lt(t);if(n.kind!=="intArray"&&n.kind!=="doubleArray"&&n.kind!=="stringArray")throw $(t);if(e>=n.value.length)throw $(`${t}[${e}]`);switch(n.kind){case"intArray":return st(n.value[e]);case"doubleArray":return q(n.value[e]);case"stringArray":return{kind:"string",value:n.value[e]}}}inferTargetValueType(t){const e=t.trim(),n=this.state.variables.get(e);if(n)return Qs(n);const s=Ct(e);if(s){const r=this.state.variables.get(s.arrayName);if(!r)throw lt(s.arrayName);if(r.kind==="intArray")return"int";if(r.kind==="doubleArray")return"double";if(r.kind==="stringArray")return"string";throw $(s.arrayName)}throw F(t)}assignValue(t,e){const n=e.trim(),s=Ct(n);if(!s){this.state.variables.set(n,t);return}const r=this.arrayIndex(s.indexExpression),o=this.state.variables.get(s.arrayName);if(!o)throw lt(s.arrayName);let a;if(o.kind==="intArray"&&t.kind==="int")a={kind:"intArray",value:[...o.value]};else if(o.kind==="doubleArray"&&(t.kind==="double"||t.kind==="int"))a={kind:"doubleArray",value:[...o.value]};else if(o.kind==="stringArray"&&t.kind==="string")a={kind:"stringArray",value:[...o.value]};else throw $(n);if(r>=a.value.length)throw $(n);a.value[r]=t.value,this.state.variables.set(s.arrayName,a)}evaluateOutputExpression(t){return je(t).map(e=>{const n=e.trim(),s=Q(n);if(s!==void 0)return s;const r=this.evaluateReference(n);return R(r||this.evaluateNumeric(n))}).join("")}renderOutputExpression(t){return je(t).map(e=>{const n=e.trim();if(Q(n)!==void 0)return n;const s=this.evaluateReference(n);if(s)return R(s);try{return this.renderNumericExpression(n)}catch{return n}}).join(" + ")}evaluateExpression(t,e){switch(e){case"int":return st(this.evaluateInt(t));case"double":return q(this.evaluateDouble(t));case"string":{const n=t.trim(),s=Q(n);if(s!==void 0)return{kind:"string",value:s};const r=this.evaluateReference(n);return r?{kind:"string",value:R(r)}:{kind:"string",value:this.evaluateOutputExpression(t)}}}}evaluateNumeric(t){const e=this.evaluateDouble(t);return Number.isFinite(e)&&Math.round(e)===e?st(e):q(e)}parser(t){return new nr(Oe(De(t)),this.state.variables)}evaluateInt(t){return this.parser(t).parseInt()}evaluateDouble(t){return this.parser(t).parseDouble()}evaluateBool(t){const e=t.trim();if(e==="true")return!0;if(e==="false")return!1;const n=Pe(e,"||");if(n.length>1)return n.some(h=>this.evaluateBool(h));const s=Pe(e,"&&");if(s.length>1)return s.every(h=>this.evaluateBool(h));if(e.startsWith("!")&&!e.startsWith("!="))return!this.evaluateBool(e.slice(1));const r=Dn(e);if(r!==void 0)return this.evaluateBool(r);const o=er(e);if(o)return this.evaluateComparison(o.lhs,"==",o.rhs);const a=tr(e);if(a)return this.evaluateComparison(a.lhs,a.op,a.rhs);if(this.stringOperand(e)!==void 0)throw $(e);return this.evaluateDouble(e)!==0}evaluateComparison(t,e,n){const s=this.stringOperand(t),r=this.stringOperand(n);let o,a;if(s!==void 0||r!==void 0){if(s===void 0||r===void 0)throw $(`${t} ${e} ${n}`);o=s,a=r}else o=this.evaluateDouble(t),a=this.evaluateDouble(n);switch(e){case"==":return o===a;case"!=":return o!==a;case"<":return o<a;case"<=":return o<=a;case">":return o>a;case">=":return o>=a;default:throw $(`${t} ${e} ${n}`)}}stringOperand(t){const e=t.trim(),n=Q(e);if(n!==void 0)return n;const s=this.evaluateReference(e);return(s==null?void 0:s.kind)==="string"?s.value:void 0}evaluateSwitchSelector(t){const e=t.trim(),n=Q(e);if(n!==void 0)return{kind:"text",value:n};const s=this.state.variables.get(e);if(s)switch(s.kind){case"int":return{kind:"int",value:s.value};case"double":return{kind:"int",value:Math.trunc(s.value)};case"string":return{kind:"text",value:s.value};default:throw $(e)}return/^[+-]?[0-9]+$/.test(e)?{kind:"int",value:Number(e)}:{kind:"int",value:this.evaluateInt(e)}}renderNumericExpression(t){return Oe(De(t)).map(e=>{if(e.t==="number")return e.literal;if(e.t==="identifier"){const n=this.state.variables.get(e.name);if(!n)throw lt(e.name);return R(n)}return e.t}).join(" ").replaceAll("( ","(").replaceAll(" )",")").replaceAll(" . ",".").replaceAll("[ ","[").replaceAll(" ]","]")}}function He(i){switch(i.kind){case"finished":return c("sim_notice_finished");case"infiniteLoopWithoutBody":return c("sim_notice_infinite_loop_empty");case"unsupportedStatement":return c("sim_notice_unsupported_statement_fmt",i.text);case"invalidExpression":return c("sim_notice_invalid_expression_fmt",i.text);case"unknownVariable":return c("sim_notice_unknown_variable_fmt",i.text);case"divisionByZero":return c("sim_notice_division_by_zero");case"wholeNumberExpected":return c("sim_notice_whole_number_expected");case"numberExpected":return c("sim_notice_number_expected");case"other":return i.text}}const P=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),We=["0.2","0.5","1.0","1.5","2.0"],or=i=>Number(i).toLocaleString(ne()==="java"?"en":ne(),{minimumFractionDigits:1}),qt="visustruct.simulation.stepDelay",Ue="visustruct.simulation.highlightMode";function Jt(i){try{return localStorage.getItem(i)}catch{return null}}function Xe(i,t){try{localStorage.setItem(i,t)}catch{}}class ar{constructor(t,e){p(this,"element");p(this,"engine");p(this,"isPlaying",!1);p(this,"playTimer");p(this,"wasPlayingBeforeInput",!1);p(this,"delay",We.includes(Jt(qt)??"")?Jt(qt):"0.5");p(this,"highlightMode",Jt(Ue)==="nextToExecute"?"nextToExecute":"lastExecuted");p(this,"buttons");p(this,"inputSection");p(this,"trace");p(this,"variables");p(this,"output");p(this,"notice");this.currentDocument=t,this.onHighlight=e,this.engine=new Re(t()),this.element=document.createElement("aside"),this.element.className="simpanel",this.build()}begin(){this.pause(),this.restartEngine()}end(){this.pause()}step(){if(!this.engine.canStep){this.pause();return}const t=this.isPlaying,e=this.engine.currentStepPath;this.engine.step(),this.highlightMode==="nextToExecute"&&this.engine.canStep?this.onHighlight(this.engine.currentStepPath):this.onHighlight(e??this.engine.currentStepPath),this.engine.state.inputRequest&&t&&(this.wasPlayingBeforeInput=!0),this.engine.canStep||this.pause(),this.update()}reset(){this.pause(),this.restartEngine()}play(){if(this.isPlaying||!this.engine.canStep)return;this.isPlaying=!0;const t=()=>{this.playTimer=void 0,this.isPlaying&&(this.step(),this.isPlaying&&this.engine.canStep?this.playTimer=window.setTimeout(t,Number(this.delay)*1e3):(this.isPlaying=!1,this.update()))};t()}pause(){this.playTimer!==void 0&&window.clearTimeout(this.playTimer),this.playTimer=void 0,this.isPlaying=!1,this.update()}submitInput(t){const e=this.isPlaying||this.wasPlayingBeforeInput;this.pause(),this.engine.provideInput(t.value),this.engine.state.inputRequest||(t.value=""),this.onHighlight(this.engine.currentStepPath),e&&this.engine.canStep&&(this.wasPlayingBeforeInput=!1,this.play()),this.update()}restartEngine(){this.engine=new Re(this.currentDocument()),this.wasPlayingBeforeInput=!1,this.onHighlight(this.engine.currentStepPath),this.update()}build(){this.element.innerHTML=`
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
          <select data-sim="delay">${We.map(s=>`<option value="${s}">${P(c("web_sim_delay_value_fmt",or(s)))}</option>`).join("")}</select>
        </label>
      </section>
      <p class="sim-notice" role="status"></p>
      <section class="sim-input"><h2>${P(c("simulation_input"))}</h2><div></div></section>
      <section><h2>${P(c("simulation_trace"))}</h2><div class="sim-trace mono" dir="ltr"></div></section>
      <section><h2>${P(c("simulation_variables"))}</h2><div class="sim-vars" dir="ltr"></div></section>
      <section><h2>${P(c("simulation_output"))}</h2><div class="sim-output mono" dir="ltr"></div></section>
    `;const t=s=>this.element.querySelector(s);this.buttons={play:t("[data-sim=play]"),pause:t("[data-sim=pause]"),step:t("[data-sim=step]"),stop:t("[data-sim=stop]")},this.buttons.play.addEventListener("click",()=>this.play()),this.buttons.pause.addEventListener("click",()=>this.pause()),this.buttons.step.addEventListener("click",()=>this.step()),this.buttons.stop.addEventListener("click",()=>this.reset());const e=t("[data-sim=highlight]");e.value=this.highlightMode,e.addEventListener("change",()=>{this.highlightMode=e.value,Xe(Ue,this.highlightMode)});const n=t("[data-sim=delay]");n.value=this.delay,n.addEventListener("change",()=>{this.delay=n.value,Xe(qt,this.delay)}),this.inputSection=t(".sim-input > div"),this.trace=t(".sim-trace"),this.variables=t(".sim-vars"),this.output=t(".sim-output"),this.notice=t(".sim-notice")}update(){if(!this.buttons)return;const{state:t,canStep:e}=this.engine;this.buttons.play.disabled=this.isPlaying||!e,this.buttons.pause.disabled=!this.isPlaying,this.buttons.step.disabled=this.isPlaying||!e,this.notice.textContent=t.notice?He(t.notice):"",this.notice.hidden=!t.notice,this.notice.classList.toggle("error",t.isHalted),this.updateInput(),this.trace.textContent=t.lastTrace??c("simulation_trace_placeholder"),this.trace.classList.toggle("placeholder",!t.lastTrace);const n=[...t.variables.keys()].sort((s,r)=>s.localeCompare(r));if(n.length===0)this.variables.innerHTML=`<p class="placeholder">${P(c("simulation_variables_placeholder"))}</p>`;else{const s=document.createElement("table");for(const r of n){const o=s.insertRow();o.insertCell().textContent=r,o.insertCell().textContent=R(t.variables.get(r))}this.variables.replaceChildren(s)}t.outputLines.length===0?this.output.innerHTML=`<p class="placeholder">${P(c("simulation_output_placeholder"))}</p>`:(this.output.replaceChildren(...t.outputLines.map(s=>{const r=document.createElement("div");return r.textContent=s,r})),this.output.scrollTop=this.output.scrollHeight)}updateInput(){const t=this.engine.state.inputRequest,e=this.inputSection;if(e.parentElement.classList.toggle("active",!!t),!t){e.innerHTML=`<p class="placeholder">${P(c("simulation_input_placeholder"))}</p>`;return}let n=e.querySelector("form");if(!n){n=document.createElement("form"),n.innerHTML=`<p class="sim-prompt"></p><div class="sim-input-row"><input autocomplete="off" /><button type="submit">${P(c("simulation_input_submit"))}</button></div><p class="sim-input-error"></p>`;const a=n.querySelector("input");n.addEventListener("submit",h=>{h.preventDefault(),this.submitInput(a)}),e.replaceChildren(n),requestAnimationFrame(()=>a.focus())}n.querySelector(".sim-prompt").textContent=t.prompt;const s=n.querySelector("input");s.inputMode=t.valueType==="string"?"text":"decimal";const r=this.engine.state.inputErrorNotice,o=n.querySelector(".sim-input-error");o.textContent=r?He(r):"",o.hidden=!r}}const qe=()=>[{description:c("web_file_type"),accept:{"application/xml":[".visustruct",".strk"]}}],Yt=i=>c(`element_${d[i]}`),lr={[d.verzweigung]:"age >= 18",[d.whileSchleife]:"i < 10",[d.doUntilSchleife]:"again == 1",[d.fallauswahl]:"day"},cr={statement:'int number = 5  |  double x = 1.5  |  String text = "Your text"  |  boolean ok = true  |  const double PI = 3.14',input:'input: int age "Enter age"  |  input: double price "Enter price"  |  input: String name "Enter name"',output:'output: number  |  output: "Your text"  |  output: "Your age: " + age'};function Je(i){switch(i.type){case d.anweisung:{const t=Bt(i.textLines.join(`
`));return t==="input"?"input:":t==="output"?"output:":void 0}case d.verzweigung:return"if";case d.whileSchleife:case d.doUntilSchleife:return"while";case d.fallauswahl:return"switch";default:return}}function ur(i){switch(i.type){case d.anweisung:{const t=Bt(i.textLines.join(`
`));return t==="input"?'int age "Enter age"':t==="output"?'"Your age: " + age':c("inspector_placeholder_statement")}case d.verzweigung:case d.whileSchleife:case d.doUntilSchleife:case d.endlosschleife:return c("inspector_placeholder_condition");case d.fallauswahl:return c("inspector_placeholder_selector");case d.aufruf:return c("inspector_placeholder_call");case d.aussprung:return c("inspector_placeholder_break");default:return""}}function C(i,t={},...e){const n=document.createElement(i);for(const[s,r]of Object.entries(t))n.setAttribute(s,r);return n.append(...e),n}const Ye=[{value:1,label:"settings_ui_scale_small"},{value:1.22,label:"settings_ui_scale_medium"},{value:1.5,label:"settings_ui_scale_large"},{value:1.82,label:"settings_ui_scale_extra_large"}],hr=/Mac|iPhone|iPad/.test(navigator.platform);function G(i,t=!1){return hr?`${t?"⇧":""}⌘${i}`:[c("web_key_ctrl"),...t?[c("web_key_shift")]:[],i].join("+")}const w=gr,Ke="visustruct.ui.scale.canvas",dr=80;class mr{constructor(t){p(this,"tabs",[]);p(this,"tabIndex",0);p(this,"nextTabSerial",1);p(this,"clipboard");p(this,"zoom",1);p(this,"simulating",!1);p(this,"exportSelect");p(this,"resizeObserver");p(this,"simPath");p(this,"sim");p(this,"simButton");p(this,"coding",!1);p(this,"code");p(this,"codeButton");p(this,"measure",ai());p(this,"metrics",li());p(this,"engine",new on(this.metrics,this.measure));p(this,"renderer",new cn(this.metrics,this.measure));p(this,"layout");p(this,"flat",[]);p(this,"canvasHost");p(this,"svg");p(this,"overlay");p(this,"inspector");p(this,"captionInput");p(this,"undoButton");p(this,"redoButton");p(this,"deleteButton");p(this,"statusLine");p(this,"drag");p(this,"downloads",null);p(this,"inViewer","claude"in window);p(this,"tabStrip");this.root=t,this.tabs.push(this.makeTab());const e=Number(pr(Ke));Ye.some(s=>s.value===e)&&(this.zoom=e),this.buildUI(),this.render(),window.addEventListener("pointermove",s=>this.onPointerMove(s)),window.addEventListener("pointerup",s=>this.onPointerUp(s)),window.addEventListener("pointercancel",()=>this.endDrag()),window.addEventListener("keydown",s=>this.onKeyDown(s)),window.addEventListener("beforeunload",s=>{this.tabs.some(r=>r.dirty)&&s.preventDefault()}),this.setupFileDrop();const n=window.claude;n==null||n.use("downloads").then(s=>this.downloads=s)}get tab(){return this.tabs[this.tabIndex]}get doc(){return this.tab.doc}set doc(t){this.tab.doc=t}get fileName(){return this.tab.fileName??`${at(this.tab)}.visustruct`}get fileHandle(){return this.tab.fileHandle}set fileHandle(t){this.tab.fileHandle=t}get dirty(){return this.tab.dirty}set dirty(t){this.tab.dirty=t}get undoStack(){return this.tab.undoStack}get redoStack(){return this.tab.redoStack}get selected(){return this.tab.selected}set selected(t){this.tab.selected=t}buildUI(){var h;this.root.className="app",this.root.innerHTML=`
      <header class="toolbar">
        <div class="brand"><span class="logo"></span>VisuStruct <small>${w(c("web_brand_suffix"))}</small></div>
        <div class="group">
          <button data-action="new" title="${w(c("a11y_new_diagram_tab"))}">${w(c("toolbar_new"))}</button>
          <button data-action="open" title="${w(c("menu_open"))} (${G("O")})">${w(c("menu_open"))}</button>
          <select data-action="example" title="${w(c("web_examples_title"))}"><option value="">${w(c("web_examples"))}</option></select>
          <button data-action="save" title="${w(c("menu_save"))} (${G("S")})">${w(c("menu_save"))}</button>
          <select data-action="export" title="${w(c("web_export_title"))}">
            <option value="">${w(c("web_export"))}</option>
            <option value="png">${w(c("web_export_png"))}</option>
            <option value="svg">${w(c("web_export_svg"))}</option>
            <option value="pdf">${w(c("web_export_pdf"))}</option>
            <option value="print">${w(c("menu_print"))} (${G("P")})</option>
          </select>
        </div>
        <div class="group">
          <button data-action="undo" title="${w(c("toolbar_undo"))} (${G("Z")})" aria-label="${w(c("toolbar_undo"))}">↶</button>
          <button data-action="redo" title="${w(c("toolbar_redo"))} (${G("Z",!0)})" aria-label="${w(c("toolbar_redo"))}">↷</button>
          <button data-action="cut" title="${w(c("ctx_cut"))} (${G("X")})" aria-label="${w(c("ctx_cut"))}">✂︎</button>
          <button data-action="copy" title="${w(c("ctx_copy"))} (${G("C")})" aria-label="${w(c("ctx_copy"))}">⧉</button>
          <button data-action="paste" title="${w(c("ctx_paste"))} (${G("V")})" aria-label="${w(c("ctx_paste"))}">📋︎</button>
          <button data-action="delete" title="${w(c("action_delete_selection"))} (${w(c("web_key_delete"))})">${w(c("web_delete"))}</button>
        </div>
        <div class="group">
          <select data-action="zoom" title="${w(c("settings_ui_scale_section"))}">${Ye.map(l=>`<option value="${l.value}">${w(c("web_zoom_option_fmt",c(l.label)))}</option>`).join("")}</select>
          <select data-action="language" title="${w(c("web_language_title"))}" aria-label="${w(c("web_language_title"))}">${It.map(l=>`<option value="${l.code}" lang="${l.code==="java"?"en":l.code}">${w(l.name)}</option>`).join("")}</select>
        </div>
        <div class="group">
          <button data-action="code" aria-pressed="false" title="${w(c("a11y_generate_code"))}">{ } Code</button>
          <button data-action="simulate" class="sim-toggle" aria-pressed="false" title="${w(c("web_simulation_start_title"))}">▶︎ ${w(c("action_simulation"))}</button>
        </div>
      </header>
      <aside class="palette">
        <h2>${w(c("palette_header"))}</h2>
        <p class="hint">${w(c("web_palette_hint"))}</p>
        <ul></ul>
      </aside>
      <main class="workspace">
        <nav class="tabs" aria-label="${w(c("web_tabs_label"))}"></nav>
        <input class="caption" placeholder="${w(c("diagram_title_placeholder"))}" aria-label="${w(c("diagram_title_label"))}" />
        <div class="canvas" dir="ltr"></div>
      </main>
      <aside class="inspector"></aside>
      <footer class="status"></footer>
      <input type="file" accept=".visustruct,.strk,.xml" hidden />
    `;const t=l=>this.root.querySelector(l);this.canvasHost=t(".canvas"),this.inspector=t(".inspector"),this.captionInput=t(".caption"),this.undoButton=t("[data-action=undo]"),this.redoButton=t("[data-action=redo]"),this.deleteButton=t("[data-action=delete]"),this.statusLine=t(".status"),this.simButton=t("[data-action=simulate]"),this.sim=new ar(()=>this.doc,l=>{this.simPath=l,this.simulating&&this.renderDiagramOnly(),this.scrollToSimPath()}),this.root.append(this.sim.element),this.simButton.addEventListener("click",()=>this.setSimulating(!this.simulating)),this.codeButton=t("[data-action=code]"),this.code=new Os(()=>this.doc,(l,u)=>this.offerDownload(l,new Blob([u],{type:"text/plain"})),()=>this.setCoding(!1)),this.root.append(this.code.element),this.codeButton.addEventListener("click",()=>this.setCoding(!this.coding));const e=t(".palette ul");for(const{item:l}of be){const u=Yt(St(l).type),m=document.createElement("li");m.className="palette-item",m.dataset.item=l,m.append(this.paletteIcon(l),document.createTextNode(u)),m.addEventListener("pointerdown",g=>this.beginDrag(g,{kind:"palette",item:l})),m.tabIndex=0,m.addEventListener("keydown",g=>{(g.key==="Enter"||g.key===" ")&&this.insertNearSelection(St(l))}),e.append(m)}const n=t("[data-action=example]");for(const l of ke)n.append(new Option(l.name,l.name));n.addEventListener("change",()=>{const l=ke.find(u=>u.name===n.value);n.value="",l&&this.loadXML(l.xml,l.name.split("/").pop()+".visustruct")}),this.tabStrip=t(".tabs"),this.exportSelect=t("[data-action=export]"),this.exportSelect.addEventListener("change",()=>{const l=this.exportSelect.value;this.exportSelect.value="",l&&this.exportDiagram(l)});const s=t("[data-action=language]");s.value=ne(),s.addEventListener("change",()=>void this.changeLanguage(s.value));const r=t("[data-action=zoom]");r.value=String(this.zoom),r.addEventListener("change",()=>{this.zoom=Number(r.value),fr(Ke,r.value),this.renderDiagramOnly()}),t("[data-action=cut]").addEventListener("click",()=>this.cutSelection()),t("[data-action=copy]").addEventListener("click",()=>this.copySelection()),t("[data-action=paste]").addEventListener("click",()=>this.paste());const o=t("input[type=file]");o.addEventListener("change",async()=>{var u;const l=(u=o.files)==null?void 0:u[0];o.value="",l&&this.loadXML(await l.text(),l.name)}),t("[data-action=new]").addEventListener("click",()=>this.addTab()),t("[data-action=open]").addEventListener("click",()=>this.open(o)),t("[data-action=save]").addEventListener("click",()=>this.save()),this.undoButton.addEventListener("click",()=>this.undo()),this.redoButton.addEventListener("click",()=>this.redo()),this.deleteButton.addEventListener("click",()=>this.deleteSelection());let a;this.captionInput.addEventListener("focus",()=>a=this.doc),this.captionInput.addEventListener("input",()=>{this.doc={...this.doc,caption:this.captionInput.value},this.dirty=!0,this.updateStatus()}),this.captionInput.addEventListener("change",()=>{a&&a.caption!==this.doc.caption&&this.pushUndo(a),a=this.doc}),this.canvasHost.addEventListener("pointerdown",l=>this.onCanvasPointerDown(l)),(h=this.resizeObserver)==null||h.disconnect(),this.resizeObserver=new ResizeObserver(()=>this.renderDiagramOnly()),this.resizeObserver.observe(this.canvasHost)}async changeLanguage(t){this.setSimulating(!1),this.setCoding(!1),await mn(t),Pn(),this.sim.end(),this.buildUI(),this.render()}paletteIcon(t){const e=T("svg",{viewBox:"0 0 28 20",width:28,height:20,class:"icon"}),n={fill:"none",stroke:"currentColor","stroke-width":1.5};e.append(T("rect",{x:1,y:1,width:26,height:18,...n}));const s=r=>e.append(T("path",{d:r,...n}));switch(t){case"verzweigung":s("M1 1 L14 10 L27 1 M14 10 V19");break;case"fallauswahl":s("M1 1 L20 10 L27 1 M1 10 H27 M10 10 V19 M20 10 V19");break;case"forZaehlSchleife":case"whileSchleife":s("M7 7 H27 M7 7 V19");break;case"doUntilSchleife":s("M7 1 V13 H27");break;case"endlosschleife":s("M7 6 H27 M7 6 V14 H27");break;case"aufruf":s("M5 1 V19 M23 1 V19");break;case"aussprung":s("M6 1 L1 10 L6 19");break}return e}render(){const t={...this.doc,elements:this.doc.elements.map(Dt)};this.layout=this.engine.layout(t),this.flat=Xi(this.layout.elements),this.selected&&!H(this.doc,this.selected)&&(this.selected=void 0);const e=this.zoom,n={width:Math.max(320,this.layout.canvasSize.width,this.canvasHost.clientWidth/e),height:Math.max(240,this.layout.canvasSize.height+60,this.canvasHost.clientHeight/e)};this.renderer.usesSimulationHighlight=this.simulating,this.svg=this.renderer.render(this.layout,n,this.simulating?this.simPath:this.selected),this.svg.setAttribute("width",String(n.width*e)),this.svg.setAttribute("height",String(n.height*e)),this.overlay=T("g",{class:"drop-overlay"}),this.svg.append(this.overlay),this.canvasHost.replaceChildren(this.svg),document.activeElement!==this.captionInput&&(this.captionInput.value=this.doc.caption),this.undoButton.disabled=this.simulating||this.undoStack.length===0,this.redoButton.disabled=this.simulating||this.redoStack.length===0,this.deleteButton.disabled=this.simulating||!this.selected||!Ft(this.doc,this.selected),this.captionInput.readOnly=this.simulating,this.codeButton.disabled=this.simulating,this.exportSelect.disabled=this.simulating,this.coding&&this.code.refresh(),this.renderTabs(),this.renderInspector(),this.updateStatus()}updateStatus(){document.title=`${this.dirty?"• ":""}${this.fileName} – VisuStruct Web`,this.statusLine.textContent=`${this.fileName}${this.dirty?` (${c("web_status_modified")})`:""}`}renderInspector(){const t=this.selected,e=t?H(this.doc,t):void 0,n=this.inspector;if(!t||!e){n.replaceChildren(C("h2",{},c("web_inspector_title")),C("p",{class:"hint"},c("inspector_no_selection")),C("p",{class:"hint"},c("web_inspector_help_drop")),C("p",{class:"hint"},c("web_inspector_help_files")));return}if(n.replaceChildren(C("h2",{},Yt(e.type))),e.type===d.anweisung){const s=Bt(e.textLines.join(`
`)),r=C("div",{class:"segmented",role:"group","aria-label":c("inspector_io_mode_title")});for(const[o,a]of[["statement",c("inspector_io_mode_statement")],["input",c("inspector_io_mode_input")],["output",c("inspector_io_mode_output")]]){const h=C("button",{"aria-pressed":String(o===s)},a);h.addEventListener("click",()=>{var m,g;const l=((m=H(this.doc,t))==null?void 0:m.textLines.join(`
`))??"";if(o===Bt(l))return;const u=ni(o,l);this.commit(Nt(this.doc,t,u.split(`
`))),(g=this.inspector.querySelector("textarea"))==null||g.focus()}),r.append(h)}n.append(r,C("p",{class:"hint mono-hint"},cr[s]))}if(e.type===d.forSchleife){const s=C("div",{class:"for-fields"}),r=we(e.textLines);[[c("inspector_for_init"),c("inspector_for_placeholder_init")],[c("inspector_for_condition"),c("inspector_for_placeholder_condition")],[c("inspector_for_step"),c("inspector_for_placeholder_step")]].forEach(([a,h],l)=>{const u=C("input",{placeholder:h,spellcheck:"false",autocomplete:"off"});u.value=r[l],this.liveEdit(u,m=>{const g=H(this.doc,t);if(!g)return;const b=we(g.textLines);return b[l]=ri(m),Nt(this.doc,t,b)}),s.append(C("label",{},a,u))}),n.append(s)}else if(e.type!==d.leerElement){const s=lr[e.type];s&&n.append(C("p",{class:"hint mono-hint"},s));const r=Je(e),o=C("textarea",{rows:"3",spellcheck:"false"}),a=e.textLines.join(`
`);o.value=r?ve(r,a):a,o.placeholder=ur(e),o.addEventListener("focus",()=>{o.value.trim()==="ø"&&o.select()}),this.liveEdit(o,l=>{const u=Je(H(this.doc,t)??e),m=u?si(u,ve(u,l)):l;return Nt(this.doc,t,m.split(`
`))});const h=C("div",{class:"editor-row"});r&&h.append(C("span",{class:"fixed-prefix"},r)),h.append(o),n.append(h)}this.renderCaseControls(t)}renderCaseControls(t){var h;const e=Qn(t,this.doc);if(!e)return;const n=((h=H(this.doc,e))==null?void 0:h.cases)??[],s=ti(t,e),r=C("div",{class:"case-controls"});if(s!==void 0&&n[s]){const l=C("input",{placeholder:c("web_case_name_placeholder"),spellcheck:"false",autocomplete:"off"});l.value=n[s].name,this.liveEdit(l,u=>u.trim()===""?void 0:Gn(this.doc,e,s,u)),r.append(C("label",{},c("web_case_name"),l))}const o=C("button",{},`＋ ${c("inspector_add_case")}`);o.addEventListener("click",()=>{const l=Kn(this.doc,e);this.commit(l.doc,l.path)});const a=C("button",{class:"danger-text"},`－ ${c("inspector_remove_case")}`);a.disabled=n.length<=2||s===void 0,a.addEventListener("click",()=>{if(s===void 0)return;const l=Zn(this.doc,e,s);this.commit(l.doc,l.path)}),r.append(C("div",{class:"group"},o,a)),this.inspector.append(r)}liveEdit(t,e){let n;t.addEventListener("focus",()=>n=this.doc),t.addEventListener("input",()=>{const s=nn(t.value);if(s!==t.value){const o=t.selectionStart;t.value=s,t.setSelectionRange(o,o)}const r=e(s);r&&(this.doc=r,this.dirty=!0,this.renderDiagramOnly())}),t.addEventListener("blur",()=>{n&&n!==this.doc&&this.pushUndo(n),n=void 0,this.renderDiagramOnly()})}renderDiagramOnly(){const t=this.selected,e=this.inspector,n=document.createElement("aside");this.inspector=n,this.render(),this.inspector=e,this.selected=t}setSimulating(t){t!==this.simulating&&(document.activeElement instanceof HTMLElement&&document.activeElement.blur(),this.endDrag(),this.simulating=t,this.root.classList.toggle("simulating",t),this.simButton.setAttribute("aria-pressed",String(t)),this.simButton.textContent=t?`✎ ${c("action_diagram")}`:`▶︎ ${c("action_simulation")}`,this.simButton.title=c(t?"web_simulation_end_title":"web_simulation_start_title"),t?(this.setCoding(!1),this.sim.begin()):(this.sim.end(),this.simPath=void 0,!this.selected&&this.doc.elements.length>0&&(this.selected=[0])),this.render())}setCoding(t){t!==this.coding&&(this.coding=t,this.root.classList.toggle("coding",t),this.codeButton.setAttribute("aria-pressed",String(t)),t?this.code.refresh():this.code.close(),this.renderDiagramOnly())}scrollToSimPath(){const t=this.simPath;if(!this.simulating||!t)return;const e=this.flat.find(a=>ee(a.idPath,t));if(!e)return;const n=this.canvasHost,s=this.zoom,r={x:e.frame.x*s,y:e.frame.y*s,width:e.frame.width*s,height:e.frame.height*s},o=24;r.y<n.scrollTop?n.scrollTop=Math.max(0,r.y-o):r.y+Math.min(r.height,n.clientHeight-2*o)>n.scrollTop+n.clientHeight&&(n.scrollTop=r.y-o),(r.x<n.scrollLeft||r.x>n.scrollLeft+n.clientWidth-o)&&(n.scrollLeft=Math.max(0,r.x-o))}commit(t,e){this.pushUndo(this.doc),this.doc=t,this.dirty=!0,e&&(this.selected=e),this.render()}pushUndo(t){for(this.undoStack.push(t);this.undoStack.length>dr;)this.undoStack.shift();this.tab.redoStack=[]}undo(){const t=this.undoStack.pop();t&&(this.redoStack.push(this.doc),this.doc=t,this.dirty=!0,this.selected=ge(this.selected,this.doc),this.render())}redo(){const t=this.redoStack.pop();t&&(this.undoStack.push(this.doc),this.doc=t,this.dirty=!0,this.selected=ge(this.selected,this.doc),this.render())}resetHistory(){this.setSimulating(!1),this.tab.undoStack=[],this.tab.redoStack=[],this.selected=void 0,this.dirty=!1,this.render()}makeTab(){return{doc:Xn(),serial:this.nextTabSerial++,dirty:!1,undoStack:[],redoStack:[],selected:[0]}}addTab(t=this.makeTab()){this.setSimulating(!1),this.tabs.push(t),this.tabIndex=this.tabs.length-1,this.render()}switchTab(t){t===this.tabIndex||!this.tabs[t]||(document.activeElement instanceof HTMLElement&&document.activeElement.blur(),this.setSimulating(!1),this.tabIndex=t,this.render())}async closeTab(t){this.tabs.length<=1||this.tabs[t].dirty&&(this.switchTab(t),!await this.confirmDiscard())||(this.setSimulating(!1),this.tabs.splice(t,1),(this.tabIndex>t||this.tabIndex>=this.tabs.length)&&(this.tabIndex=Math.max(0,this.tabIndex-1)),this.render())}renderTabs(){const t=this.tabStrip;t.replaceChildren(),this.tabs.forEach((n,s)=>{const r=document.createElement("div");r.className="tab"+(s===this.tabIndex?" active":""),r.setAttribute("role","tab"),r.setAttribute("aria-selected",String(s===this.tabIndex));const o=document.createElement("button");if(o.className="tab-label",o.textContent=(n.dirty?"• ":"")+at(n),o.title=n.fileName??at(n),o.addEventListener("click",()=>this.switchTab(s)),r.append(o),this.tabs.length>1){const a=document.createElement("button");a.className="tab-close",a.textContent="✕",a.title=c("a11y_close_tab"),a.setAttribute("aria-label",`${c("a11y_close_tab")}: ${at(n)}`),a.addEventListener("click",()=>this.closeTab(s)),r.append(a)}t.append(r)});const e=document.createElement("button");e.className="tab-add",e.textContent="+",e.title=c("a11y_new_diagram_tab"),e.setAttribute("aria-label",c("a11y_new_diagram_tab")),e.addEventListener("click",()=>this.addTab()),t.append(e)}copySelection(){const t=this.selected&&H(this.doc,this.selected);return t?(this.clipboard=structuredClone(t),this.showMessage(c("web_copied")),!0):!1}cutSelection(){this.selected&&Ft(this.doc,this.selected)&&this.copySelection()&&this.deleteSelection()}paste(){this.clipboard&&this.insertNearSelection(structuredClone(this.clipboard))}deleteSelection(){!this.selected||!Ft(this.doc,this.selected)||(this.commit(ft(this.doc,this.selected)),this.selected=void 0,this.render())}insertNearSelection(t){const e=this.selected;if(e&&rt(this.doc,e))return this.commit(tt(this.doc,e,t),e);if(e){const n=[...e.slice(0,-1),e[e.length-1]+1];return this.commit(Kt(this.doc,t,e),n)}if(this.doc.elements.length===1&&rt(this.doc,[0]))return this.commit(tt(this.doc,[0],t),[0]);this.commit(ut(this.doc,[],this.doc.elements.length,t),[this.doc.elements.length])}confirmDiscard(){return this.dirty?new Promise(t=>{const e=document.createElement("div");e.className="confirm",e.innerHTML=`<div class="confirm-card" role="alertdialog" aria-label="${w(c("close_unsaved_title"))}">
        <p><strong>${w(c("close_unsaved_title"))}</strong></p>
        <p class="hint">${w(c("web_discard_message_fmt",this.fileName))}</p>
        <div class="group"><button data-r="0">${w(c("close_unsaved_cancel"))}</button><button data-r="1" class="danger">${w(c("close_unsaved_discard"))}</button></div>
      </div>`,e.addEventListener("click",n=>{const s=n.target.dataset.r;s===void 0&&n.target!==e||(e.remove(),t(s==="1"))}),document.body.append(e),e.querySelector('[data-r="0"]').focus()}):Promise.resolve(!0)}showMessage(t){this.statusLine.textContent=t,this.statusLine.classList.add("message"),setTimeout(()=>{this.statusLine.classList.remove("message"),this.updateStatus()},6e3)}loadXML(t,e,n){let s;try{s=ui(t)}catch(r){this.showMessage(c("web_err_unreadable_fmt",e,r.message));return}(this.dirty||this.tab.fileName)&&this.addTab(),this.doc=s,this.tab.fileName=e.replace(/\.(strk|xml)$/i,".visustruct"),this.fileHandle=n&&/\.visustruct$/i.test(e)?n:void 0,this.resetHistory()}async open(t){const e=window;if(!e.showOpenFilePicker||this.inViewer)return t.click();try{const[n]=await e.showOpenFilePicker({types:qe()}),s=await n.getFile();this.loadXML(await s.text(),s.name,n)}catch{}}async save(){var n,s;const t=new Blob([hi(this.doc)],{type:"application/xml"}),e=window;try{if(this.downloads){const r=this.fileName+".txt";await this.downloads.save({filename:r,data:t}),(n=this.tab).fileName??(n.fileName=this.fileName),this.dirty=!1,this.render(),this.showMessage(c("web_saved_txt_fmt",r));return}if(!this.fileHandle&&e.showSaveFilePicker&&!this.inViewer&&(this.fileHandle=await e.showSaveFilePicker({suggestedName:this.fileName,types:qe()}),this.tab.fileName=this.fileHandle.name),this.fileHandle){const r=await this.fileHandle.createWritable();await r.write(t),await r.close()}else{const r=document.createElement("a");r.href=URL.createObjectURL(t),r.download=this.fileName,r.click(),setTimeout(()=>URL.revokeObjectURL(r.href),1e3)}(s=this.tab).fileName??(s.fileName=this.fileName),this.dirty=!1,this.render()}catch{}}async exportDiagram(t){const e=Ws(this.doc,this.metrics,this.measure);if(!e){this.showMessage(c(t==="print"?"err_diagram_too_small_print":"err_diagram_too_small_export"));return}const n=Rs(this.doc,at(this.tab)),s=Math.max(2,window.devicePixelRatio||1)*this.zoom;try{switch(t){case"svg":{e.svg.setAttribute("width",String(e.width*this.zoom)),e.svg.setAttribute("height",String(e.height*this.zoom)),await this.offerDownload(`${n}.svg`,new Blob([An(e)],{type:"image/svg+xml"}));break}case"png":{const r=await Ae(e,s);await this.offerDownload(`${n}.png`,await Us(r));break}case"pdf":{const r=await Ae(e,Math.max(s,3)),o=await Js(Ys(r),r.width,r.height,e,Tn(this.doc));await this.offerDownload(`${n}.pdf`,o);break}case"print":this.printDiagram(e);break}}catch(r){this.showMessage(c("web_export_failed_fmt",r instanceof Error?r.message:String(r)))}}printDiagram(t){const e=document.createElement("div");e.className="print-sheet",t.svg.removeAttribute("width"),t.svg.removeAttribute("height"),e.append(t.svg),document.body.append(e);const n=()=>e.remove();window.addEventListener("afterprint",n,{once:!0});try{window.print()}catch{n(),this.showMessage(`${c("err_print_unavailable")} ${c("web_print_hint")}`);return}setTimeout(n,6e4)}async offerDownload(t,e){try{if(this.downloads){try{await this.downloads.save({filename:t,data:e}),this.showMessage(c("web_saved_fmt",t))}catch{await this.downloads.save({filename:t+".txt",data:e}),this.showMessage(c("web_saved_txt_fmt",t+".txt"))}return}const n=document.createElement("a");n.href=URL.createObjectURL(e),n.download=t,n.click(),setTimeout(()=>URL.revokeObjectURL(n.href),1e3)}catch{this.showMessage(c("err_save_failed_fmt",t))}}setupFileDrop(){window.addEventListener("dragover",t=>{var e;(e=t.dataTransfer)!=null&&e.types.includes("Files")&&(t.preventDefault(),this.root.classList.add("file-drag"))}),window.addEventListener("dragleave",t=>{t.relatedTarget===null&&this.root.classList.remove("file-drag")}),window.addEventListener("drop",async t=>{var n;this.root.classList.remove("file-drag");const e=(n=t.dataTransfer)==null?void 0:n.files[0];e&&(t.preventDefault(),this.loadXML(await e.text(),e.name))})}onKeyDown(t){var s;const e=t.metaKey||t.ctrlKey,n=t.target instanceof HTMLTextAreaElement||t.target instanceof HTMLInputElement;if(e&&t.key.toLowerCase()==="s")t.preventDefault(),this.save();else if(e&&t.key.toLowerCase()==="p")t.preventDefault(),this.simulating||this.exportDiagram("print");else if(e&&t.key.toLowerCase()==="o")t.preventDefault(),this.open(this.root.querySelector("input[type=file]"));else{if(n||this.simulating)return;e&&t.key.toLowerCase()==="z"?(t.preventDefault(),t.shiftKey?this.redo():this.undo()):e&&t.key.toLowerCase()==="c"&&!((s=getSelection())!=null&&s.toString())?this.copySelection()&&t.preventDefault():e&&t.key.toLowerCase()==="x"?(t.preventDefault(),this.cutSelection()):e&&t.key.toLowerCase()==="v"?(t.preventDefault(),this.paste()):e&&t.key.toLowerCase()==="y"?(t.preventDefault(),this.redo()):t.key==="Delete"||t.key==="Backspace"?(t.preventDefault(),this.deleteSelection()):t.key==="Escape"&&(this.drag?this.endDrag():(this.selected=void 0,this.render()))}}svgPoint(t,e){if(!this.svg)return;const n=this.svg.getBoundingClientRect(),s=t-n.left,r=e-n.top;if(!(s<0||r<0||s>n.width||r>n.height))return{x:s/this.zoom,y:r/this.zoom}}nodeAt(t,e){for(let n=this.flat.length-1;n>=0;n--){const s=this.flat[n].frame;if(t>=s.x&&t<=s.x+s.width&&e>=s.y&&e<=s.y+s.height)return this.flat[n]}}onCanvasPointerDown(t){if(this.simulating)return;const e=this.svgPoint(t.clientX,t.clientY);if(!e)return;document.activeElement instanceof HTMLElement&&document.activeElement.blur();const n=this.nodeAt(e.x,e.y),s=n&&this.selected&&ee(n.idPath,this.selected);this.selected=n==null?void 0:n.idPath,this.render(),n&&t.pointerType!=="touch"&&!(rt(this.doc,n.idPath)&&!s)&&this.beginDrag(t,{kind:"move",path:n.idPath})}beginDrag(t,e){t.button!==0||this.simulating||(t.preventDefault(),this.drag={source:e,pointerId:t.pointerId,startX:t.clientX,startY:t.clientY,active:!1})}onPointerMove(t){const e=this.drag;if(!e||t.pointerId!==e.pointerId)return;if(!e.active){if(Math.hypot(t.clientX-e.startX,t.clientY-e.startY)<5)return;e.active=!0,e.ghost=this.makeGhost(e.source),document.body.append(e.ghost),this.root.classList.add("dragging")}e.ghost.style.transform=`translate(${t.clientX+12}px, ${t.clientY+12}px)`,this.autoScroll(t.clientX,t.clientY);const n=this.svgPoint(t.clientX,t.clientY);e.target=n?this.dropTargetAt(n.x,n.y,e.source):void 0,this.showDropTarget(e.target)}onPointerUp(t){const e=this.drag;!e||t.pointerId!==e.pointerId||(e.active&&e.target?this.applyDrop(e.source,e.target):!e.active&&e.source.kind==="palette"&&this.insertNearSelection(St(e.source.item)),this.endDrag())}endDrag(){var t,e;(e=(t=this.drag)==null?void 0:t.ghost)==null||e.remove(),this.drag=void 0,this.root.classList.remove("dragging"),this.showDropTarget(void 0)}makeGhost(t){const e=document.createElement("div");if(e.className="drag-ghost",t.kind==="palette")e.textContent=be.find(n=>n.item===t.item).label;else{const n=U(this.doc,t.path);e.textContent=`${Yt(n.type)}: ${oe(n)[0]}`}return e}autoScroll(t,e){const n=this.canvasHost.getBoundingClientRect(),s=40,r=12;e>n.bottom-s&&e<n.bottom+s?this.canvasHost.scrollTop+=r:e<n.top+s&&e>n.top-s&&(this.canvasHost.scrollTop-=r),t>n.right-s&&t<n.right+s?this.canvasHost.scrollLeft+=r:t<n.left+s&&t>n.left-s&&(this.canvasHost.scrollLeft-=r)}dropTargetAt(t,e,n){var h;const s=((h=this.layout)==null?void 0:h.elements)??[],r=this.nodeAt(t,e);if(!r){const l=s[s.length-1];if(!l)return;const u=l.frame.y+l.frame.height;return e>u?n.kind==="move"&&n.path.length===1&&n.path[0]===s.length-1?void 0:{kind:"rootAppend",frame:{x:l.frame.x,y:u,width:l.frame.width,height:0}}:e<s[0].frame.y?{kind:"before",path:[0],frame:s[0].frame}:void 0}const o=r.idPath;return n.kind==="move"&&o.length>=n.path.length&&n.path.every((l,u)=>o[u]===l)?void 0:rt(this.doc,o)?{kind:"replace",path:o,frame:r.frame}:{kind:e<r.frame.y+r.frame.height/2?"before":"after",path:o,frame:r.frame}}showDropTarget(t){if(!this.overlay||(this.overlay.replaceChildren(),!t))return;const e=t.frame;if(t.kind==="replace"){this.overlay.append(T("rect",{x:e.x+2,y:e.y+2,width:e.width-4,height:e.height-4,class:"drop-replace"}));return}const n=t.kind==="before"?e.y:e.y+e.height;this.overlay.append(T("rect",{x:e.x,y:n-3,width:e.width,height:6,rx:3,class:"drop-line"}))}applyDrop(t,e){const n=this.doc;try{if(t.kind==="palette"){const r=St(t.item);switch(e.kind){case"replace":return this.commit(tt(n,e.path,r),e.path);case"before":return this.commit(tn(n,r,e.path),e.path);case"after":return this.commit(Kt(n,r,e.path),[...e.path.slice(0,-1),e.path[e.path.length-1]+1]);case"rootAppend":return this.commit(ut(n,[],n.elements.length,r),[n.elements.length])}}const s=t.path;switch(e.kind){case"replace":return this.commit(Yn(n,s,e.path));case"before":return this.commit(qn(n,s,e.path));case"after":return this.commit(Jn(n,s,e.path));case"rootAppend":{const r=U(n,s);return this.commit(ut(ft(n,s),[],Number.MAX_SAFE_INTEGER,r))}}}catch(s){console.warn("Ablegen nicht möglich",s)}finally{t.kind==="move"&&(this.selected=void 0,this.render())}}}function Pn(){Un({[d.anweisung]:c("canvas_stub_anweisung"),[d.verzweigung]:c("canvas_stub_condition"),[d.fallauswahl]:c("canvas_stub_fallauswahl"),[d.forSchleife]:c("canvas_stub_for"),[d.whileSchleife]:c("canvas_stub_while"),[d.doUntilSchleife]:c("canvas_stub_while"),[d.endlosschleife]:c("canvas_stub_endless"),[d.aussprung]:c("canvas_stub_break"),[d.aufruf]:c("canvas_stub_call")})}function at(i){return i.fileName?i.fileName.replace(/\.(visustruct|strk)$/i,""):i.doc.caption.trim()||c("tab_title_format",i.serial)}function pr(i){try{return localStorage.getItem(i)}catch{return null}}function fr(i,t){try{localStorage.setItem(i,t)}catch{}}function gr(i){return i.replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t])}mn(Qi(),!1).then(()=>{Pn(),new mr(document.getElementById("app"))});
