import{r as i,P as W,D as q,O as S,e as R,j as f}from"./app-183ca207.js";import{f as U}from"./formatNPWP-cf5b7efc.js";import{B as J}from"./badge.esm-c550247d.js";import{T as z,B as X}from"./button.esm-d3cd2157.js";import{D as Y,C as E}from"./column.esm-1f1d87c0.js";import{D as G}from"./dialog.esm-202fdef4.js";import{C as Q,u as L,R as Z}from"./ripple.esm-4b355069.js";import{H as ee}from"./HeaderDatatable-497e5508.js";function A(){return A=Object.assign?Object.assign.bind():function(e){for(var l=1;l<arguments.length;l++){var r=arguments[l];for(var s in r)Object.prototype.hasOwnProperty.call(r,s)&&(e[s]=r[s])}return e},A.apply(this,arguments)}function B(e,l){(l==null||l>e.length)&&(l=e.length);for(var r=0,s=new Array(l);r<l;r++)s[r]=e[r];return s}function te(e){if(Array.isArray(e))return B(e)}function ne(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function K(e,l){if(e){if(typeof e=="string")return B(e,l);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return B(e,l)}}function ae(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function F(e){return te(e)||ne(e)||K(e)||ae()}function re(e){if(Array.isArray(e))return e}function le(e,l){var r=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(r!=null){var s,n,y,b,v=[],p=!0,d=!1;try{if(y=(r=r.call(e)).next,l===0){if(Object(r)!==r)return;p=!1}else for(;!(p=(s=y.call(r)).done)&&(v.push(s.value),v.length!==l);p=!0);}catch(g){d=!0,n=g}finally{try{if(!p&&r.return!=null&&(b=r.return(),Object(b)!==b))return}finally{if(d)throw n}}return v}}function oe(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function H(e,l){return re(e)||le(e,l)||K(e,l)||oe()}var ie={root:function(l){var r=l.props;return R("p-selectbutton p-buttonset p-component",r.className)},button:function(l){var r=l.itemProps,s=l.focusedState;return R("p-button p-component",{"p-highlight":r.selected,"p-disabled":r.disabled,"p-focus":s})},label:"p-button-label p-c"},D=Q.extend({defaultProps:{__TYPE:"SelectButton",id:null,value:null,options:null,optionLabel:null,optionValue:null,optionDisabled:null,tabIndex:null,multiple:!1,unselectable:!0,allowEmpty:!0,disabled:!1,style:null,className:null,dataKey:null,tooltip:null,tooltipOptions:null,itemTemplate:null,onChange:null,children:void 0},css:{classes:ie}}),V=i.memo(function(e){var l=i.useState(!1),r=H(l,2),s=r[0],n=r[1],y=L(),b=e.ptm,v=e.cx,p=function(o){return b(o,{hostName:e.hostName,context:{selected:e.selected,disabled:e.disabled,option:e.option}})},d=function(o,x){e.setFocusedIndex(x),e.onClick&&e.onClick({originalEvent:o,option:e.option})},g=function(){n(!0)},_=function(){n(!1)},C=function(o,x){switch(o.code){case"Space":{d(o,x),o.preventDefault();break}case"ArrowDown":case"ArrowRight":{N(o,"next"),o.preventDefault();break}case"ArrowUp":case"ArrowLeft":{N(o,"prev"),o.preventDefault();break}}},N=function(o,x){for(var w,h,u=0;u<=e.elementRef.current.children.length-1;u++)e.elementRef.current.children[u].getAttribute("tabindex")==="0"&&(w={elem:e.elementRef.current.children[u],index:u});x==="prev"?w.index===0?h=e.elementRef.current.children.length-1:h=w.index-1:w.index===e.elementRef.current.children.length-1?h=0:h=w.index+1,e.setFocusedIndex(h),e.elementRef.current.children[h].focus()},j=function(){var o=y({className:v("label")},p("label"));return e.template?S.getJSXElement(e.template,e.option):i.createElement("span",o,e.label)},m=j(),O=y({className:R(e.className,v("button",{itemProps:e,focusedState:s})),role:"button","aria-label":e.label,"aria-pressed":e.selected,onClick:function(o){return d(o,e.index)},onKeyDown:function(o){return C(o,e.index)},tabIndex:e.tabIndex,"aria-disabled":e.disabled,onFocus:g,onBlur:_},p("button"));return i.createElement("div",O,m,!e.disabled&&i.createElement(Z,null))});V.displayName="SelectButtonItem";var $=i.memo(i.forwardRef(function(e,l){var r=L(),s=i.useContext(W),n=D.getProps(e,s),y=i.useState(0),b=H(y,2),v=b[0],p=b[1],d=i.useRef(null),g=D.setMetaData({props:n}),_=g.ptm,C=g.cx,N=function(t){if(!(n.disabled||O(t.option))){var c=a(t.option);if(!(c&&!(n.unselectable&&n.allowEmpty))){var k=m(t.option),P;if(n.multiple){var T=n.value?F(n.value):[];P=c?T.filter(function(I){return!S.equals(I,k,n.dataKey)}):[].concat(F(T),[k])}else P=c?null:k;n.onChange&&n.onChange({originalEvent:t.originalEvent,value:P,stopPropagation:function(){t.originalEvent.stopPropagation()},preventDefault:function(){t.originalEvent.preventDefault()},target:{name:n.name,id:n.id,value:P}})}}},j=function(t){return n.optionLabel?S.resolveFieldData(t,n.optionLabel):t&&t.label!==void 0?t.label:t},m=function(t){return n.optionValue?S.resolveFieldData(t,n.optionValue):t&&t.value!==void 0?t.value:t},O=function(t){return n.optionDisabled?S.isFunction(n.optionDisabled)?n.optionDisabled(t):S.resolveFieldData(t,n.optionDisabled):t&&t.disabled!==void 0?t.disabled:!1},a=function(t){var c=m(t);if(n.multiple){if(n.value&&n.value.length)return n.value.some(function(k){return S.equals(k,c,n.dataKey)})}else return S.equals(n.value,c,n.dataKey);return!1},o=function(){return n.options&&n.options.length?n.options.map(function(t,c){var k=n.disabled||O(t),P=j(t),T=n.disabled||c!==v?"-1":"0",I=a(t),M=P+"_"+c;return i.createElement(V,{hostName:"SelectButton",key:M,label:P,className:t.className,option:t,setFocusedIndex:p,onClick:N,template:n.itemTemplate,selected:I,tabIndex:T,index:c,disabled:k,ptm:_,cx:C,elementRef:d})}):null};i.useImperativeHandle(l,function(){return{props:n,focus:function(){return q.focusFirstElement(d.current)},getElement:function(){return d.current}}});var x=S.isNotEmpty(n.tooltip),w=o(),h=r({ref:d,id:n.id,className:C("root"),style:n.style,role:"group"},D.getOtherProps(n),_("root"));return i.createElement(i.Fragment,null,i.createElement("div",h,w),x&&i.createElement(z,A({target:d,content:n.tooltip,pt:_("tooltip")},n.tooltipOptions)))}));$.displayName="SelectButton";const ve=({dialogInstitutionVisible:e,setDialogInstitutionVisible:l,isLoadingData:r,setIsLoadingData:s,partners:n,setPartners:y,leads:b,setLeads:v,filters:p,setFilters:d,data:g,setData:_,setProvinceName:C,reset:N})=>{const[j]=i.useState([{label:"Partner",value:"partner"},{label:"Lead",value:"lead"}]),[m,O]=i.useState(j[0].value),[a,o]=i.useState([]);i.useEffect(()=>{o(g.partner)},[]),i.useEffect(()=>{m=="lead"?w():x()},[m]);const x=async()=>{s(!0);let c=await(await fetch("/api/partners")).json();y(k=>c.partners),s(!1)},w=async()=>{s(!0);let c=await(await fetch("/api/leads")).json();v(k=>c.leads),s(!1)},h=t=>f.jsx(X,{label:"OK",icon:"pi pi-check",onClick:()=>{N(),a!==null&&(m=="partner"?(_({...g,partner:{id:a.id,uuid:a.uuid,name:a.name,phone_number:a.phone_number,province:a.province,regency:a.regency,pic:a.pic?a.pic.name:null,pic_position:a.pic?a.pic.position:null,bank:a.bank?a.bank.bank:null,account_bank_number:a.bank?a.bank.account_bank_number:null,account_bank_name:a.bank?a.bank.account_bank_name:null,type:m},url_subdomain:a.accounts?a.accounts[0].subdomain:null}),C(c=>JSON.parse(a.province).name)):_("partner",{...g.partner,id:a.id,uuid:a.uuid,phone_number:a.phone_number,name:a.name,pic:a.pic,bank:null,province:null,regency:null,account_bank_number:null,account_bank_name:null,type:m})),l(!1)}}),u=()=>f.jsx(ee,{filters:p,setFilters:d,children:f.jsx($,{className:"w-full flex justify-end lg:text-md text-center",value:m,onChange:t=>O(t.value),options:j})});return f.jsx(G,{header:"Pilih Lembaga",visible:e,className:"w-[100vw] lg:w-[75vw]",maximizable:!0,modal:!0,onHide:()=>l(!1),footer:()=>h(),children:f.jsxs(Y,{value:m=="partner"?n:b,paginator:!0,filters:p,rowsPerPageOptions:[10,25,50,100],paginatorTemplate:"RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",currentPageReportTemplate:"{first} - {last} dari {totalRecords}",rows:10,header:u,globalFilterFields:["name","status","npwp","address","phone_number"],scrollable:!0,scrollHeight:"flex",tableStyle:{minWidth:"50rem"},selectionMode:"single",loading:r,selection:a,onSelectionChange:t=>o(t.value),dataKey:"uuid",children:[f.jsx(E,{selectionMode:"single",headerStyle:{width:"3rem"}}),f.jsx(E,{field:"name",header:"Nama",align:"left",style:{width:"max-content",whiteSpace:"nowrap"}}),f.jsx(E,{header:"Status",body:t=>f.jsx(J,{value:t.status.name,className:"text-white",style:{backgroundColor:"#"+t.status.color}}),className:"dark:border-none  lg:w-max lg:whitespace-nowrap",headerClassName:"dark:border-none  dark:bg-slate-900 dark:text-gray-300",align:"left",style:{width:"max-content",whiteSpace:"nowrap"}}),m=="partner"&&f.jsx(E,{header:"NPWP",body:t=>t.npwp!==null?U(t.npwp):"-",className:"dark:border-none",headerClassName:"dark:border-none  dark:bg-slate-900 dark:text-gray-300",align:"left",style:{width:"max-content",whiteSpace:"nowrap"}}),f.jsx(E,{field:"phone_number",body:t=>t.phone_number?t.phone_number:"-",className:"dark:border-none",headerClassName:"dark:border-none dark:bg-transparent dark:text-gray-300",header:"No. Telepon",align:"left",style:{width:"max-content",whiteSpace:"nowrap"}}),f.jsx(E,{field:"address",body:t=>t.address?t.address:"-",className:"dark:border-none",headerClassName:"dark:border-none dark:bg-transparent dark:text-gray-300",header:"Alamat",align:"left",style:{width:"max-content",whiteSpace:"nowrap"}})]})})};export{ve as D,$ as S};
