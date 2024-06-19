import{r as n,F as v,j as e}from"./app-183ca207.js";import"./HeaderDatatable-497e5508.js";import{B as w}from"./badge.esm-c550247d.js";import{B as N}from"./button.esm-d3cd2157.js";import{D as y,C as d}from"./column.esm-1f1d87c0.js";import{M as o}from"./message.esm-4bbe4c64.js";import{O as S}from"./overlaypanel.esm-9c3ae74e.js";import{f as k}from"./formatDate-5c964a42.js";import"./ripple.esm-4b355069.js";import"./inputtext.esm-0c7f541c.js";import"./portal.esm-545bb246.js";import"./inputnumber.esm-6c4b14f0.js";import"./dropdown.esm-0caba294.js";import"./index.esm-64ce51d8.js";import"./csstransition.esm-03d4c013.js";import"./inheritsLoose-2f6bfe9f.js";import"./index.esm-9ef49f43.js";import"./index.esm-dca36cda.js";import"./index.esm-80aa95ee.js";import"./index.esm-c27cbd20.js";const Z=({lead:u,handleSelectedDetailPartner:C,showSuccess:F,showError:O})=>{const[m,c]=n.useState(!1),[t,f]=n.useState(null),[x,h]=n.useState(null),p=n.useRef(),[g,I]=n.useState({global:{value:null,matchMode:v.CONTAINS}});n.useState("");const b=async()=>{c(!0);let a=await(await fetch("/api/leads/logs?lead="+u.id)).json();h(l=>a),c(!1)};n.useEffect(()=>{(async()=>{await b()})()},[]);const i=s=>{let a;const r=s.split(".")[0];return r=="name"?a="Nama":r=="total_members"?a="Jumlah member":r=="status"?a="Status":r=="pic"?a="PIC":a="Alamat",a};return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"flex mx-auto flex-col justify-center gap-5",children:[e.jsx("div",{className:"card p-fluid w-full h-full flex justify-center rounded-lg",children:e.jsxs(y,{id:"tablelog",loading:m,className:"w-full h-full rounded-lg border-none text-center",pt:{bodyRow:"dark:bg-transparent bg-transparent dark:text-gray-300 h-full",table:"dark:bg-transparent bg-white dark:text-gray-300 h-full",header:"",thead:"hidden"},style:{height:"300px"},showGridlines:!0,paginator:!0,filters:g,rows:10,emptyMessage:"Log tidak ditemukan.",paginatorClassName:"dark:bg-transparent paginator-status-log dark:text-gray-300 rounded-b-lg",globalFilterFields:["name","category","causer.name"],value:x,dataKey:"id",children:[e.jsx(d,{field:"causer",hidden:!0,className:"border-none",headerClassName:"border-none bg-transparent dark:bg-transparent dark:text-gray-300",align:"left",style:{width:"max-content",whiteSpace:"nowrap"},body:s=>s.causer.name}),e.jsx(d,{field:"uuid",hidden:!0,className:"border-none",headerClassName:"border-none bg-transparent dark:bg-transparent dark:text-gray-300",align:"left",style:{width:"max-content",whiteSpace:"nowrap"}}),e.jsx(d,{className:"border-none",headerClassName:"border-none bg-transparent dark:bg-transparent dark:text-gray-300",align:"left",style:{width:"max-content",whiteSpace:"nowrap"},body:s=>{let a=s.causer?s.causer.name:"",l="",r="";return s.event=="created"?(l="tambah",r="success"):s.event=="restored"?(l="pulihkan",r="success"):s.event=="deleted"?(l="hapus",r="error"):s.event=="updated"&&(l="edit",r="info"),e.jsxs("div",{className:"flex justify-between w-full",children:[e.jsxs("div",{className:"flex gap-4",children:[e.jsx(w,{value:l,severity:r=="error"?"danger":r,className:"w-20"}),e.jsx("p",{children:k(s.created_at)+", "+a+" "+s.description})]}),e.jsx("div",{children:e.jsx(N,{label:"detail",className:"p-0 underline bg-transparent text-blue-700 text-left",onClick:j=>{p.current.toggle(j),f(M=>({properties:s.properties,event:s.event}))},"aria-controls":"popup_menu_right","aria-haspopup":!0})})]})}})]})}),e.jsx(S,{className:"w-[40%] shadow-md md:max-w-[50%] dark:bg-slate-900 dark:text-gray-300",ref:p,showCloseIcon:!0,children:e.jsxs("div",{className:"flex flex-wrap gap-2",children:[(t==null?void 0:t.event)=="created"||(t==null?void 0:t.event)=="updated"||(t==null?void 0:t.event)=="restored"?e.jsx("div",{className:"flex-1 w-1/2",children:e.jsx(o,{className:"bg-green-300 text-green-800 rounded-md w-full",severity:"success",content:e.jsx("div",{className:"flex justify-between w-full max-h-[250px] overflow-y-scroll",children:e.jsxs("div",{className:"flex w-full flex-col gap-2",children:[((t==null?void 0:t.event)==="created"||(t==null?void 0:t.event)==="restored")&&t!==null?Object.keys(t.properties.attributes).map(s=>{if(s!="status.color")return e.jsxs(e.Fragment,{children:[e.jsxs("p",{children:[i(s)," ",":"," ",t.properties.attributes[s]]}),e.jsx("hr",{className:" w-full bg-slate-300"})]})}):null,(t==null?void 0:t.event)=="updated"&&(t!==null?Object.keys(t.properties.attributes).map(s=>{if(s!="status.color")return t.properties.attributes[s]!==t.properties.old[s]&&e.jsxs(e.Fragment,{children:[e.jsxs("p",{children:[i(s)," ",":"," ",t.properties.attributes[s]]}),e.jsx("hr",{className:" w-full bg-slate-300"})]})}):null)]})})})}):null,(t==null?void 0:t.event)=="updated"?e.jsx("div",{className:"flex-1 w-1/2",children:e.jsx(o,{className:"bg-red-300 text-red-800 rounded-md w-full",severity:"success",content:e.jsx("div",{className:"flex justify-between w-full max-h-[250px] overflow-y-scroll",children:e.jsx("div",{className:"flex w-full flex-col gap-2",children:t!==null?Object.keys(t.properties.old).map(s=>{if(s!="status.color")return t.properties.attributes[s]!==t.properties.old[s]&&e.jsxs(e.Fragment,{children:[e.jsxs("p",{children:[i(s)," ",":"," ",t.properties.old[s]]}),e.jsx("hr",{className:" w-full bg-slate-300"})]})}):null})})})}):null,(t==null?void 0:t.event)=="deleted"?e.jsx("div",{className:"flex-1 ",children:e.jsx(o,{className:"bg-red-300 text-red-800 rounded-md w-full",severity:"success",content:e.jsx("div",{className:"flex justify-between w-full max-h-[250px] overflow-y-scroll",children:e.jsx("div",{className:"flex w-full flex-col gap-2",children:Object.keys(t.properties.old).map(s=>e.jsxs(e.Fragment,{children:[e.jsxs("p",{children:[i(s)," ",":"," ",t.properties.old[s]]}),e.jsx("hr",{className:" w-full bg-slate-300"})]}))})})})}):null]})})]})})};export{Z as default};