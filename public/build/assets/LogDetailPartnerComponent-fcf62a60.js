import{r as l,j as r}from"./app-183ca207.js";import"./HeaderDatatable-497e5508.js";import"./SkeletonDatatable-07c9c4e2.js";import{f as j}from"./formatDate-5c964a42.js";import{B as w}from"./badge.esm-c550247d.js";import{B as N}from"./button.esm-d3cd2157.js";import{D as k,C as i}from"./column.esm-1f1d87c0.js";import{M as d}from"./message.esm-4bbe4c64.js";import{O as y}from"./overlaypanel.esm-9c3ae74e.js";const A=({objectKeyToIndo:n,fetchUrl:c,selectedData:f})=>{const[x,o]=l.useState(!1),[e,m]=l.useState(null);l.useState(null),l.useState(!1),l.useState(!0);const[g,h]=l.useState(null),u=l.useRef(),b=async()=>{o(!0);let t=c.replace("{partner:id}",f.partner_id),a=await(await fetch(t)).json();h(s=>a),o(!1)};return l.useEffect(()=>{(async()=>{await b()})()},[]),r.jsxs("div",{className:"flex mx-auto flex-col justify-center mt-5 gap-5",children:[r.jsx("div",{className:"card p-fluid w-full h-full flex justify-center rounded-lg",children:r.jsxs(k,{id:"tablelog",loading:x,className:"table-log w-full h-auto rounded-lg dark:glass border-none text-center ",pt:{bodyRow:"dark:bg-transparent bg-transparent dark:text-gray-300",table:"dark:bg-transparent bg-white dark:text-gray-300",header:""},paginator:!0,rowsPerPageOptions:[5,10,25,50],paginatorTemplate:"RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",currentPageReportTemplate:"{first} - {last} dari {totalRecords}",rows:10,emptyMessage:"Log tidak ditemukan.",paginatorClassName:"dark:bg-transparent shadow-none paginator-custome dark:text-gray-300 rounded-b-lg",globalFilterFields:["name","category","causer.name"],value:g,dataKey:"id",children:[r.jsx(i,{field:"causer",hidden:!0,className:"dark:border-none",headerClassName:"dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300",align:"left",style:{width:"max-content",whiteSpace:"nowrap"},body:t=>t.causer.name}),r.jsx(i,{field:"uuid",hidden:!0,className:"dark:border-none",headerClassName:"dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300",align:"left",style:{width:"max-content",whiteSpace:"nowrap"}}),r.jsx(i,{className:"dark:border-none",headerClassName:"dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300",header:"Aktivitas",align:"left",style:{width:"max-content",whiteSpace:"nowrap"},body:t=>{let p=t.causer?t.causer.name:"",a="",s="";return t.event=="created"?(a="tambah",s="success"):t.event=="restored"?(a="pulihkan",s="success"):t.event=="deleted"?(a="hapus",s="error"):t.event=="updated"?(a="edit",s="info"):t.event=="onboarding"?(a="onboarding",s="info"):t.event=="force"&&(a="hapus permanent",s="error"),r.jsxs("div",{className:"flex justify-between w-full",children:[r.jsxs("div",{className:"flex gap-10",children:[r.jsx(w,{value:a,severity:s=="error"?"danger":s,className:"w-28"}),r.jsx("p",{children:j(t.created_at)+", "+p+" "+t.description})]}),r.jsx("div",{children:r.jsx(N,{label:"detail",className:"p-0 underline bg-transparent text-blue-700 text-left",onClick:v=>{u.current.toggle(v),m(P=>({properties:t.properties,event:t.event}))},"aria-controls":"popup_menu_right","aria-haspopup":!0})})]})}})]})}),r.jsx(y,{className:"w-[80%] md:max-w-[60%]  dark:bg-slate-900 dark:text-gray-300",ref:u,showCloseIcon:!0,children:r.jsxs("div",{className:"flex flex-wrap gap-2",children:[(e==null?void 0:e.event)=="created"||(e==null?void 0:e.event)=="onboarding"||(e==null?void 0:e.event)=="updated"||(e==null?void 0:e.event)=="restored"?r.jsx("div",{className:"flex-1 w-1/2",children:r.jsx(d,{className:"bg-green-300 text-green-800 rounded-md w-full",severity:"success",content:r.jsx("div",{className:"flex justify-between w-full max-h-[250px] overflow-y-scroll",children:r.jsxs("div",{className:"flex w-full flex-col gap-2",children:[((e==null?void 0:e.event)==="created"||(e==null?void 0:e.event)==="onboarding"||(e==null?void 0:e.event)==="restored")&&e!==null?Object.keys(e.properties.attributes).map(t=>t==="status.color"||e.properties.attributes[t]===null?null:r.jsxs(r.Fragment,{children:[e.properties.attributes[t]!==null&&r.jsxs("p",{children:[n(t)," ",":"," ",e.properties.attributes[t]]}),r.jsx("hr",{className:"w-full bg-slate-300"})]})):null,(e==null?void 0:e.event)==="updated"&&e!==null?Object.keys(e.properties.attributes).map(t=>e.properties.attributes[t]!==e.properties.old[t]&&r.jsxs(r.Fragment,{children:[r.jsxs("p",{children:[n(t)," ",":"," ",e.properties.attributes[t]]}),r.jsx("hr",{className:"w-full bg-slate-300"})]})):null]})})})}):null,(e==null?void 0:e.event)=="updated"?r.jsx("div",{className:"flex-1 w-1/2",children:r.jsx(d,{className:"bg-red-300 text-red-800 rounded-md w-full",severity:"success",content:r.jsx("div",{className:"flex justify-between w-full max-h-[250px] overflow-y-scroll",children:r.jsx("div",{className:"flex w-full flex-col gap-2",children:e!==null?Object.keys(e.properties.old).map(t=>t==="status.color"?null:e.properties.attributes[t]!==e.properties.old[t]&&r.jsxs(r.Fragment,{children:[r.jsxs("p",{children:[n(t)," ",":"," ",e.properties.old[t]]}),r.jsx("hr",{className:" w-full bg-slate-300"})]})):null})})})}):null,(e==null?void 0:e.event)=="deleted"||(e==null?void 0:e.event)=="force"?r.jsx("div",{className:"flex-1 ",children:r.jsx(d,{className:"bg-red-300 text-red-800 rounded-md w-full",severity:"success",content:r.jsx("div",{className:"flex justify-between w-full max-h-[250px] overflow-y-scroll",children:r.jsx("div",{className:"flex w-full flex-col gap-2",children:Object.keys(e.properties.old).map(t=>t==="status.color"?null:r.jsxs(r.Fragment,{children:[r.jsxs("p",{children:[n(t)," ",":"," ",e.properties.old[t]]}),r.jsx("hr",{className:" w-full bg-slate-300"})]}))})})})}):null]})})]})};export{A as L};