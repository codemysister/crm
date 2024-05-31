import{r as m,P as be,D as A,O as xe,e as he,W as ve,j as e}from"./app-183ca207.js";import{D as S}from"./dropdown.esm-0caba294.js";import{B as je}from"./badge.esm-c550247d.js";import{M as we}from"./menu.esm-1df6c872.js";import{C as _e}from"./card.esm-aad9a2fd.js";import{B as re}from"./button.esm-d3cd2157.js";import{D as oe}from"./dialog.esm-202fdef4.js";import{I as z}from"./inputtext.esm-0c7f541c.js";import{C as ne}from"./calendar.esm-fe4692a5.js";import{I as ce}from"./inputtextarea.esm-555f4aba.js";import{P as ye}from"./progressspinner.esm-5c964cda.js";import{I as Ne}from"./image.esm-891e62e4.js";import ke from"./DetailPIC-dd4997be.js";import Ce from"./DetailBank-c0d5abf8.js";import De from"./DetailSubscription-6cfa0d71.js";import{r as Pe,p as Fe,F as ue}from"./filepond.min-8386e795.js";import Ie from"./DetailPriceList-71439488.js";import{I as K}from"./InputError-6be719bf.js";import{C as Se,d as Oe,b as de}from"./ripple.esm-4b355069.js";import Te from"./DetailStatusLog-05c53e1f.js";import Le from"./DetailLog-954a31e2.js";import{u as me}from"./UppercaseEachWord-e9d7052e.js";import Me from"./DetailAccount-8f648035.js";import{P as Ee}from"./PermissionErrorDialog-eff24ba6.js";function se(){return se=Object.assign?Object.assign.bind():function(V){for(var v=1;v<arguments.length;v++){var C=arguments[v];for(var l in C)Object.prototype.hasOwnProperty.call(C,l)&&(V[l]=C[l])}return V},se.apply(this,arguments)}var pe=Se.extend({defaultProps:{__TYPE:"InputMask",autoClear:!0,autoFocus:!1,className:null,disabled:!1,id:null,mask:null,maxLength:null,name:null,onBlur:null,onChange:null,onComplete:null,onFocus:null,placeholder:null,readOnly:!1,required:!1,size:null,slotChar:"_",style:null,tabIndex:null,tooltip:null,tooltipOptions:null,type:"text",unmask:!1,value:null,children:void 0}}),fe=m.memo(m.forwardRef(function(V,v){var C=m.useContext(be),l=pe.getProps(V,C),o=m.useRef(null),D=m.useRef(null),J=m.useRef(0),p=m.useRef([]),f=m.useRef([]),x=m.useRef(0),U=m.useRef(null),W=m.useRef(!1),O=m.useRef(null),q=m.useRef(null),T=m.useRef(null),i=m.useRef(null),Z=m.useRef(null),b=m.useRef(!1),y={props:l},h=function(a,n){var r,s,u,d=o.current;return!d||!d.offsetParent||d!==document.activeElement?null:(typeof a=="number"?(s=a,u=typeof n=="number"?n:s,d.setSelectionRange?d.setSelectionRange(s,u):d.createTextRange&&(r=d.createTextRange(),r.collapse(!0),r.moveEnd("character",u),r.moveStart("character",s),r.select())):d.setSelectionRange?(s=d.selectionStart,u=d.selectionEnd):document.selection&&document.selection.createRange&&(r=document.selection.createRange(),s=0-r.duplicate().moveStart("character",-1e5),u=s+r.text.length),{begin:s,end:u})},E=function(){for(var a=D.current;a<=J.current;a++)if(p.current[a]&&f.current[a]===N(a))return!1;return!0},N=m.useCallback(function(t){return t<l.slotChar.length?l.slotChar.charAt(t):l.slotChar.charAt(0)},[l.slotChar]),R=function(){return l.unmask?w():o.current&&o.current.value},j=function(a){for(;++a<x.current&&!p.current[a];);return a},P=function(a){for(;--a>=0&&!p.current[a];);return a},ee=function(a,n){var r,s;if(!(a<0)){for(r=a,s=j(n);r<x.current;r++)if(p.current[r]){if(s<x.current&&p.current[r].test(f.current[s]))f.current[r]=f.current[s],f.current[s]=N(s);else break;s=j(s)}M(),h(Math.max(D.current,a))}},B=function(a){var n,r,s,u;for(n=a,r=N(a);n<x.current;n++)if(p.current[n])if(s=j(n),u=f.current[n],f.current[n]=r,s<x.current&&p.current[s].test(u))r=u;else break},L=function(a){var n=o.current.value,r=h();if(r){if(U.current.length&&U.current.length>n.length){for(F(!0);r.begin>0&&!p.current[r.begin-1];)r.begin--;if(r.begin===0)for(;r.begin<D.current&&!p.current[r.begin];)r.begin++;h(r.begin,r.begin)}else{for(F(!0);r.begin<x.current&&!p.current[r.begin];)r.begin++;h(r.begin,r.begin)}l.onComplete&&E()&&l.onComplete({originalEvent:a,value:R()}),k(a)}},c=function(a){if(W.current=!1,F(),k(a),_(),l.onBlur&&l.onBlur(a),o.current.value!==O.current){var n=document.createEvent("HTMLEvents");n.initEvent("change",!0,!1),o.current.dispatchEvent(n)}},g=function(a){if(!l.readOnly){var n=a.which||a.keyCode,r,s,u;if(U.current=o.current.value,n===8||n===46||A.isIOS()&&n===127){if(r=h(),!r)return;s=r.begin,u=r.end,u-s===0&&(s=n!==46?P(s):u=j(s-1),u=n===46?j(u):u),$(s,u),ee(s,u-1),k(a),a.preventDefault()}else n===13?(c(a),k(a)):n===27&&(o.current.value=O.current,h(0,F()),k(a),a.preventDefault())}},te=function(a){if(!l.readOnly){var n=h();if(n){var r=a.which||a.keyCode,s,u,d,ie;if(!(a.ctrlKey||a.altKey||a.metaKey||r<32)){if(r&&r!==13){if(n.end-n.begin!==0&&($(n.begin,n.end),ee(n.begin,n.end-1)),s=j(n.begin-1),s<x.current&&(u=String.fromCharCode(r),p.current[s].test(u))){if(B(s),f.current[s]=u,M(),d=j(s),A.isAndroid()){var ge=function(){h(d)};setTimeout(ge,0)}else h(d);n.begin<=J.current&&(ie=E())}a.preventDefault()}k(a),l.onComplete&&ie&&l.onComplete({originalEvent:a,value:R()})}}}},$=function(a,n){var r;for(r=a;r<n&&r<x.current;r++)p.current[r]&&(f.current[r]=N(r))},M=function(){o.current&&(o.current.value=f.current.join(""))},F=function(a){q.current=!0;var n=o.current&&o.current.value,r=-1,s,u,d;for(s=0,d=0;s<x.current;s++)if(p.current[s]){for(f.current[s]=N(s);d++<n.length;)if(u=n.charAt(d-1),p.current[s].test(u)){f.current[s]=u,r=s;break}if(d>n.length){$(s+1,x.current);break}}else f.current[s]===n.charAt(d)&&d++,s<T.current&&(r=s);return a?M():r+1<T.current?l.autoClear||f.current.join("")===i.current?(o.current&&o.current.value&&(o.current.value=""),$(0,x.current)):M():(M(),o.current&&(o.current.value=o.current.value.substring(0,r+1))),T.current?s:D.current},ae=function(a){if(!l.readOnly){W.current=!0,clearTimeout(Z.current);var n;o.current?O.current=o.current.value:O.current="",n=F()||0,Z.current=setTimeout(function(){o.current===document.activeElement&&(M(),n===l.mask.replace("?","").length?h(0,n):h(n),_())},100),l.onFocus&&l.onFocus(a)}},I=function(a){b.current?L(a):Y(a)},Y=function(a){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(!l.readOnly){if(!n){var r=F(!0);h(r)}k(a),l.onComplete&&E()&&l.onComplete({originalEvent:a,value:R()})}},w=m.useCallback(function(){for(var t=[],a=0;a<f.current.length;a++){var n=f.current[a];p.current[a]&&n!==N(a)&&t.push(n)}return t.join("")},[N]),k=function(a){if(l.onChange){var n=l.unmask?w():a&&a.target.value;l.onChange({originalEvent:a,value:i.current!==n?n:"",stopPropagation:function(){a.stopPropagation()},preventDefault:function(){a.preventDefault()},target:{name:l.name,id:l.id,value:i.current!==n?n:""}})}},_=function(){o.current&&o.current.value&&o.current.value.length>0?A.addClass(o.current,"p-filled"):A.removeClass(o.current,"p-filled")},H=function(a){var n;return o.current&&(l.value==null?o.current.value="":(o.current.value=l.value,n=F(a),setTimeout(function(){if(o.current)return M(),F(a)},10)),O.current=o.current.value),_(),n},G=m.useCallback(function(){return l.unmask?l.value!==w():i.current!==o.current.value&&o.current.value!==l.value},[l.unmask,l.value,w]),Q=function(){if(l.mask){p.current=[],T.current=l.mask.length,x.current=l.mask.length,D.current=null;var a={9:"[0-9]",a:"[A-Za-z]","*":"[A-Za-z0-9]"};b.current=A.isChrome()&&A.isAndroid();for(var n=l.mask.split(""),r=0;r<n.length;r++){var s=n[r];s==="?"?(x.current--,T.current=r):a[s]?(p.current.push(new RegExp(a[s])),D.current===null&&(D.current=p.current.length-1),r<T.current&&(J.current=p.current.length-1)):p.current.push(null)}f.current=[];for(var u=0;u<n.length;u++){var d=n[u];d!=="?"&&(a[d]?f.current.push(N(u)):f.current.push(d))}i.current=f.current.join("")}};m.useImperativeHandle(v,function(){return{props:l,focus:function(){return A.focus(o.current)},getElement:function(){return o.current}}}),m.useEffect(function(){xe.combinedRefs(o,v)},[o,v]),Oe(function(){Q(),H()}),de(function(){Q(),h(H(!0)),l.unmask&&k()},[l.mask]),de(function(){G()&&H()},[G]);var le=pe.getOtherProps(l),X=he("p-inputmask",l.className);return m.createElement(z,se({ref:o,autoFocus:l.autoFocus,id:l.id,type:l.type,name:l.name,style:l.style,className:X},le,{placeholder:l.placeholder,size:l.size,maxLength:l.maxLength,tabIndex:l.tabIndex,disabled:l.disabled,readOnly:l.readOnly,onFocus:ae,onBlur:c,onKeyDown:g,onKeyPress:te,onInput:I,onPaste:function(a){return Y(a,!0)},required:l.required,tooltip:l.tooltip,tooltipOptions:l.tooltipOptions,pt:l.pt,unstyled:l.unstyled,__parentMetadata:{parent:y}}))}));fe.displayName="InputMask";Pe(Fe);const Re=({auth:V,partners:v,detailPartner:C,handleSelectedDetailPartner:l,sales:o,status:D,account_managers:J,showSuccess:p,showError:f,provinces:x,regencys:U,subdistricts:W,setProvinceName:O,setRegencyName:q,isLoading:T})=>{var X;const[i,Z]=m.useState(C),[b,y]=m.useState("lembaga"),[h,E]=m.useState(!1),[N,R]=m.useState(!1),[j,P]=m.useState(!1),{roles:ee,permissions:B,data:L}=V.user;m.useEffect(()=>{Z(t=>C)},[C]);const{data:c,setData:g,post:te,put:$,delete:M,reset:F,processing:ae,errors:I}=ve({uuid:"",sales:{},account_manager:{name:null,id:null},name:"",logo:null,npwp:null,password:null,phone_number:null,province:null,regency:null,subdistrict:null,address:null,onboarding_date:null,onboarding_age:null,live_date:null,live_age:null,monitoring_date_after_3_month_live:null,period:null,payment_metode:null,status:"",note_status:null,excell:null});let Y=[{label:"Lembaga",className:`${b=="lembaga"?"p-menuitem-active":""}`,command:()=>{y(t=>"lembaga")}},{label:"PIC",className:`${b=="pic"?"p-menuitem-active":""}`,command:()=>{y(t=>"pic")}},{label:"Bank",className:`${b=="bank"?"p-menuitem-active":""}`,command:()=>{y(t=>"bank")}},{label:"Akun Setting",className:`${b=="account"?"p-menuitem-active":""}`,command:()=>{y(t=>"account")}},{label:"Langganan",className:`${b=="langganan"?"p-menuitem-active":""}`,command:()=>{y(t=>"langganan")}},{label:"Harga",className:`${b=="price_list"?"p-menuitem-active":""}`,command:()=>{y(t=>"price_list")}},{label:"Log",className:`${b=="log"?"p-menuitem-active":""}`,command:()=>{y(t=>"log")}},{label:"Status Log",className:`${b=="log_status"?"p-menuitem-active":""}`,command:()=>{y(t=>"log_status")}}];const w=(t,a)=>t?e.jsx("div",{className:"flex align-items-center",children:e.jsx("div",{children:t.name})}):e.jsx("span",{children:a.placeholder}),k=[{name:"kartu/bulan"},{name:"kartu/tahun"},{name:"lembaga/bulan"},{name:"lembaga/tahun"}],_=t=>e.jsx("div",{className:"flex align-items-center",children:e.jsx("div",{children:t.name})}),H=()=>e.jsx(e.Fragment,{children:e.jsxs("div",{className:"flex flex-col lg:flex-row w-full gap-5 items-center ",children:[e.jsx(S,{optionLabel:"name",dataKey:"id",value:i,onChange:t=>l(t.target.value),options:v,placeholder:"Pilih Partner",filter:!0,valueTemplate:w,itemTemplate:_,style:{color:"#CBD5E1"},className:"w-full md:min-w-[28%] md:w-[28%] md:max-w-[28%] flex justify-center rounded-lg shadow-md border-none dark:text-slate-300 dark:bg-slate-700"}),e.jsxs("div",{className:"text-center w-full flex items-center gap-2 justify-center",children:[i!=null&&i.logo?e.jsx(Ne,{src:`storage/${i.logo}`,alt:"Image",width:"40",preview:!0}):null,e.jsx("h1",{className:"dark:text-white",children:i==null?void 0:i.name})]})]})}),G=t=>{g(a=>({...a,uuid:t.uuid,name:t.name,npwp:t.npwp,password:t.password,logo:t.logo,phone_number:t.phone_number,sales:t.sales,account_manager:t.account_manager,onboarding_date:t.onboarding_date,onboarding_age:t.onboarding_age,live_age:t.live_age,monitoring_date_after_3_month_live:t.monitoring_date_after_3_month_live,live_date:t.live_date,province:t.province,regency:t.regency,subdistrict:t.subdistrict,address:t.address,status:t.status})),t.regency&&q(a=>JSON.parse(t.regency).name),t.regency&&O(a=>JSON.parse(t.province).name),R(!0)},Q=t=>{t.preventDefault(),te("api/partner/detail/"+c.uuid,{onSuccess:()=>{p("Update"),R(a=>!1),l(c)},onError:()=>{f("Update")}})},le=(t,a)=>{const n=new Date(t),r=new Date(a),s=[1,2,3,4,5];let u=0,d=n;for(;d<=r;)s.includes(d.getDay())&&u++,d.setDate(d.getDate()+1);return u};return e.jsxs(e.Fragment,{children:[e.jsx(Ee,{dialogIsVisible:j,setDialogVisible:P}),e.jsx(_e,{title:H,className:"mt-5 mx-auto p-3 rounded-lg",children:e.jsxs("div",{className:"flex flex-col lg:flex-row gap-5 min-h-[300px]",children:[e.jsx("div",{className:"w-full lg:w-[40%]",children:e.jsx(we,{model:Y,className:"w-full rounded-lg dark:text-slate-300 dark:bg-slate-700"})}),e.jsx("div",{class:"w-full rounded-lg bg-gray-50/50 dark:text-slate-300 dark:bg-slate-700 overflow-y-auto min-h-[300px] max-h-[300px] h-full  p-4",children:i?e.jsx(e.Fragment,{children:T?e.jsx("div",{class:"w-full h-full min-h-[300px] flex items-center justify-center",children:e.jsx(ye,{style:{width:"50px",height:"50px"},strokeWidth:"8",fill:"var(--surface-ground)",animationDuration:".5s"})}):e.jsxs(e.Fragment,{children:[b==="lembaga"&&e.jsxs("table",{class:"w-full",children:[e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Nama"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.name})]}),e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Status"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:e.jsx(je,{value:i.status.name,className:"text-white",style:{backgroundColor:"#"+i.status.color}})})]}),e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"NPWP"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.npwp?i.npwp:"-"})]}),e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Nomor Telepon"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.phone_number?i.phone_number:"-"})]}),e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Provinsi"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.province?me(JSON.parse(i.province).name):"-"})]}),e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Kabupaten"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.regency?me(JSON.parse(i.regency).name):"-"})]}),e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Kecamatan"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.subdistrict?JSON.parse(i.subdistrict).name:"-"})]}),e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Alamat"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.address?i.address:"-"})]}),e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Sales"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:(X=i.sales)!=null&&X.name?i.sales.name:"-"})]}),e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Account Manager"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.account_manager!==null?i.account_manager.name:"-"})]}),e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Tanggal Onboarding"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.onboarding_date?new Date(i.onboarding_date).toLocaleDateString("id"):"-"})]}),e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Umur Onboarding"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.onboarding_age?i.onboarding_age:"-"})]}),e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Tanggal Live"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.live_date?new Date(i.live_date).toLocaleDateString("id"):"-"})]}),e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Umur Live"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.live_age?i.live_age:"-"})]}),e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Tanggal Monitoring setelah 3 bulan live"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.monitoring_date_after_3_month_live?new Date(i.monitoring_date_after_3_month_live).toLocaleDateString("id"):"-"})]}),e.jsxs("tr",{class:"border-b",children:[e.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Aksi"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),e.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:e.jsx(re,{label:"edit",className:"p-0 underline bg-transparent text-blue-700 text-left",onClick:()=>{i.created_by==L.id?G(i):P(t=>!0)}})})]})]}),b==="bank"&&e.jsx(Ce,{partner:i,partners:v,handleSelectedDetailPartner:l,showSuccess:p,showError:f,permissions:B,currentUser:L,permissionErrorIsVisible:j,setPermissionErrorIsVisible:P}),b==="account"&&e.jsx(Me,{partner:i,partners:v,handleSelectedDetailPartner:l,currentUser:L,showSuccess:p,showError:f,permissions:B,permissionErrorIsVisible:j,setPermissionErrorIsVisible:P}),b==="pic"&&e.jsx(ke,{partner:i,partners:v,handleSelectedDetailPartner:l,currentUser:L,permissions:B,showSuccess:p,showError:f,permissionErrorIsVisible:j,setPermissionErrorIsVisible:P}),b==="langganan"&&e.jsx(De,{partner:i,partners:v,handleSelectedDetailPartner:l,currentUser:L,showSuccess:p,showError:f,permissions:B,permissionErrorIsVisible:j,setPermissionErrorIsVisible:P}),b==="price_list"&&e.jsx(Ie,{partner:i,partners:v,handleSelectedDetailPartner:l,currentUser:L,showSuccess:p,showError:f,permissions:B,permissionErrorIsVisible:j,setPermissionErrorIsVisible:P}),b==="log"&&e.jsx(Le,{partner:i,handleSelectedDetailPartner:l}),b==="log_status"&&e.jsx(Te,{partner:i,handleSelectedDetailPartner:l})]})}):e.jsx("div",{class:"w-full h-full min-h-[300px] flex items-center justify-center",children:e.jsx("p",{class:"text-center",children:"Pilih partner terlebih dahulu"})})})]})}),e.jsx("div",{className:"card flex justify-content-center",children:e.jsx(oe,{header:"Partner",headerClassName:"dark:glass shadow-md z-20 dark:text-white",className:"bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white",contentClassName:" dark:glass dark:text-white",visible:N,onHide:()=>R(!1),children:e.jsxs("form",{onSubmit:t=>Q(t),enctype:"multipart/form-data",children:[e.jsxs("div",{className:"flex flex-col justify-around gap-4 mt-1",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"name",children:"Nama *"}),e.jsx(z,{value:c.name,onChange:t=>g("name",t.target.value),className:"dark:bg-gray-300",id:"name",required:!0,"aria-describedby":"name-help"}),e.jsx(K,{message:I.name,className:"mt-2"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"name",children:"Logo"}),e.jsx("div",{className:"App",children:c.logo!==null&&typeof c.logo=="string"?e.jsx(e.Fragment,{children:e.jsx(ue,{files:"storage/"+c.logo,onaddfile:(t,a)=>{g("logo",a.file)},onremovefile:()=>{g("logo",null)},maxFileSize:"2mb",labelMaxFileSizeExceeded:"File terlalu besar",labelIdle:'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'})}):e.jsx(e.Fragment,{children:e.jsx(ue,{onaddfile:(t,a)=>{g("logo",a.file)},onremovefile:()=>{g("logo",null)},maxFileSize:"2mb",labelMaxFileSizeExceeded:"File terlalu besar",labelIdle:'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'})})}),e.jsx(K,{message:I.logo,className:"mt-2"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"name",children:"NPWP"}),e.jsx(fe,{keyfilter:"int",value:c.npwp,onChange:t=>g("npwp",t.target.value),placeholder:"99.999.999.9-999.999",mask:"99.999.999.9-999.999",className:"dark:bg-gray-300",id:"npwp","aria-describedby":"npwp-help"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"name",children:"Password"}),e.jsx(z,{value:c.password,onChange:t=>g("password",t.target.value),className:"dark:bg-gray-300",id:"password","aria-describedby":"password-help"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"name",children:"Nomor Telepon"}),e.jsx(z,{keyfilter:"int",value:c.phone_number,onChange:t=>g("phone_number",t.target.value),className:"dark:bg-gray-300",id:"phone_number","aria-describedby":"phone_number-help"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"sales",children:"Sales"}),e.jsx(S,{value:c.sales,onChange:t=>g("sales",t.target.value),options:o,optionLabel:"name",placeholder:"Pilih Sales",filter:!0,valueTemplate:w,itemTemplate:_,className:"w-full md:w-14rem"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"account_manager",children:"Account Manager (AM)"}),e.jsx(S,{value:c.account_manager,onChange:t=>g("account_manager",t.target.value),options:J,optionLabel:"name",placeholder:"Pilih Account Manager (AM)",filter:!0,valueTemplate:w,itemTemplate:_,className:"w-full md:w-14rem"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"province",children:"Provinsi"}),e.jsx(S,{dataKey:"code",value:c.province?JSON.parse(c.province):null,onChange:t=>{O(a=>t.target.value.name),g("province",JSON.stringify(t.target.value))},options:x,optionLabel:"name",placeholder:"Pilih Provinsi",filter:!0,valueTemplate:w,itemTemplate:_,className:"w-full md:w-14rem"}),e.jsx(K,{message:I.province,className:"mt-2"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"regency",children:"Kabupaten"}),e.jsx(S,{dataKey:"code",value:c.regency?JSON.parse(c.regency):null,onChange:t=>{q(a=>t.target.value.name),g("regency",JSON.stringify(t.target.value))},options:U,optionLabel:"name",placeholder:"Pilih Kabupaten",filter:!0,valueTemplate:w,itemTemplate:_,className:"w-full md:w-14rem"}),e.jsx(K,{message:I.regency,className:"mt-2"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"subdistrict",children:"Kecamatan"}),e.jsx(S,{dataKey:"code",value:c.subdistrict?JSON.parse(c.subdistrict):null,onChange:t=>g("subdistrict",JSON.stringify(t.target.value)),options:W,optionLabel:"name",placeholder:"Pilih Kecamatan",filter:!0,valueTemplate:w,itemTemplate:_,className:"w-full md:w-14rem"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"register_date",children:"Tanggal Onboarding"}),e.jsx(ne,{value:c.onboarding_date?new Date(c.onboarding_date):null,style:{height:"35px"},onChange:t=>{g("onboarding_date",t.target.value)},showIcon:!0,dateFormat:"dd/mm/yy"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"live_date",children:"Tanggal Live"}),e.jsx(ne,{value:c.live_date?new Date(c.live_date):null,style:{height:"35px"},onChange:t=>{const a=Math.ceil((t.target.value-new Date(c.onboarding_date))/864e5),n=Math.ceil((new Date-t.target.value)/(1e3*60*60*24));let r=t.target.value,s=new Date(new Date().setDate(new Date().getDate()+90)),u=le(r,s)-1;const d=new Date(t.target.value).setDate(new Date(t.target.value).getDate()+u);g({...c,live_date:t.target.value,onboarding_age:a,live_age:n,monitoring_date_after_3_month_live:new Date(d)})},showIcon:!0,dateFormat:"dd/mm/yy"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"name",children:"Umur Onboarding (hari)"}),e.jsx(z,{value:c.onboarding_age,onChange:t=>g("onboarding_age",t.target.value),className:"dark:bg-gray-300",id:"onboarding_age","aria-describedby":"onboarding_age-help"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"name",children:"Umur Live (hari)"}),e.jsx(z,{value:c.live_age,onChange:t=>g("live_age",t.target.value),className:"dark:bg-gray-300",id:"live_age","aria-describedby":"live_age-help"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"live_date",children:"Tanggal Monitoring 3 Bulan After Live"}),e.jsx(ne,{value:c.monitoring_date_after_3_month_live?new Date(c.monitoring_date_after_3_month_live):null,style:{height:"35px"},onChange:t=>{g("monitoring_date_after_3_month_live",t.target.value)},showIcon:!0,dateFormat:"dd/mm/yy"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"address",children:"Alamat"}),e.jsx(ce,{value:c.address,onChange:t=>g("address",t.target.value),rows:5,cols:30})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"period",children:"Periode Langganan"}),e.jsx(S,{dataKey:"name",value:c.period,onChange:t=>{g("period",t.target.value)},options:k,optionLabel:"name",placeholder:"Langganan Per-",valueTemplate:w,itemTemplate:_,editable:!0,className:`w-full md:w-14rem 
                                        `}),e.jsx(K,{message:I["partner.period"],className:"mt-2"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"payment_metode",children:"Metode Pembayaran"}),e.jsx(S,{value:c.payment_metode,onChange:t=>{g("payment_metode",t.target.value)},options:[{name:"cazhbox"},{name:"payment link"}],optionLabel:"name",optionValue:"name",placeholder:"Pilih Metode Pembayaran",valueTemplate:w,itemTemplate:_,className:"w-full md:w-14rem",editable:!0}),e.jsx(K,{message:I.payment_metode,className:"mt-2"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"status",children:"Status *"}),e.jsx(S,{value:c.status,onChange:t=>{g({...c,status:t.target.value,note_status:null}),E(a=>!0)},options:D,optionLabel:"name",placeholder:"Pilih Status",className:"w-full md:w-14rem"}),e.jsx(K,{message:I.status,className:"mt-2"})]})]}),e.jsx("div",{className:"flex justify-center mt-5",children:e.jsx(re,{label:"Submit",disabled:ae,className:"bg-purple-600 text-sm shadow-md rounded-lg"})})]})})}),e.jsx(oe,{header:"Edit status",headerClassName:"dark:bg-slate-900 dark:text-white",className:"bg-white h-[250px] max-h-[80%] w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white",contentClassName:"dark:bg-slate-900 dark:text-white",visible:h,modal:!1,closable:!1,onHide:()=>E(!1),children:e.jsxs("div",{className:"flex flex-col justify-around gap-4 mt-3",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"note_status",children:"Keterangan"}),e.jsx(ce,{value:c.note_status,onChange:t=>g("note_status",t.target.value),rows:5,cols:30})]}),e.jsx("div",{className:"flex justify-center mt-3",children:e.jsx(re,{type:"button",label:"oke",disabled:c.note_status==null||c.note_status=="",onClick:()=>E(!1),className:"bg-purple-600 text-sm shadow-md rounded-lg"})})]})})]})},Be=Re,ut=Object.freeze(Object.defineProperty({__proto__:null,default:Be},Symbol.toStringTag,{value:"Module"}));export{Be as D,fe as I,ut as a};
