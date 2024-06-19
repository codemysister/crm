import{r as p,F as S,j as t,_ as m}from"./app-183ca207.js";import{H as P}from"./HeaderDatatable-497e5508.js";import{g as C}from"./getViewportSize-e6da2c0c.js";import{B as E}from"./badge.esm-c550247d.js";import{B as c}from"./button.esm-d3cd2157.js";import{D as v,C as n}from"./column.esm-1f1d87c0.js";import{f as L}from"./formatDate-5c964a42.js";import{h as T}from"./handleSelectedDetailInstitution-5c7c27d9.js";import"./ripple.esm-4b355069.js";import"./inputtext.esm-0c7f541c.js";import"./portal.esm-545bb246.js";import"./inputnumber.esm-6c4b14f0.js";import"./dropdown.esm-0caba294.js";import"./index.esm-64ce51d8.js";import"./csstransition.esm-03d4c013.js";import"./inheritsLoose-2f6bfe9f.js";import"./index.esm-9ef49f43.js";import"./index.esm-dca36cda.js";import"./index.esm-80aa95ee.js";const Z=p.memo(({children:h,isLoadingData:u,leads:i,action:x,setSelectedLead:b,setSidebarFilter:g})=>{const s=C().width<992,[d,f]=p.useState({global:{value:null,matchMode:S.CONTAINS}}),w=()=>{const e=i.map(a=>({Nama:a.name,Status:a.status?a.status.name:"-",NPWP:a.npwp?a.npwp:"-",Jumlah_Member:a.total_members?a.total_members:"-",Nomor_Telepon_Lembaga:a.phone_number?a.phone_number:"-",Sales:a.sales?a.sales.name:"-",PIC:a.pic??"-"}));m(()=>import("./xlsx-6ed613d4.js"),[]).then(a=>{const o={Sheets:{data:a.utils.json_to_sheet(e)},SheetNames:["data"]},l=a.write(o,{bookType:"xlsx",type:"array"});k(l,"lead")})},k=(e,a)=>{m(()=>import("./FileSaver.min-a64440ff.js").then(r=>r.F),["assets/FileSaver.min-a64440ff.js","assets/app-183ca207.js","assets/app-22bdcf69.css"]).then(r=>{if(r&&r.default){let o="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",l=".xlsx";const j=new Blob([e],{type:o});r.default.saveAs(j,a+l)}})},y=e=>t.jsx(t.Fragment,{children:t.jsx("div",{className:"flex justify-center",children:t.jsx("i",{className:"pi pi-ellipsis-h pointer cursor-pointer",onClick:a=>{b(e),x.current.toggle(a)}})})}),N=[{field:"name",header:"Lembaga",frozen:!s,style:{width:"max-content",whiteSpace:"nowrap"},body:e=>t.jsx("button",{onClick:()=>T(e),className:"hover:text-blue-700 text-left",children:e.name})},{field:"status",header:"Status",frozen:!s,style:{width:"max-content",whiteSpace:"nowrap"},body:e=>t.jsx(E,{value:e.status.name,className:"text-white",style:{backgroundColor:"#"+e.status.color}})},{field:"sales",header:"Sales",style:{width:"max-content",whiteSpace:"nowrap"},body:e=>e.sales?e.sales.name:"-"},{field:"phone_number",header:"Nomor Telepon",style:{width:"max-content",whiteSpace:"nowrap"}},{field:"address",header:"Alamat",style:{width:"max-content",whiteSpace:"nowrap"}},{field:"pic",header:"PIC",style:{width:"max-content",whiteSpace:"nowrap"}}],_=()=>t.jsxs(P,{filters:d,setFilters:f,children:[t.jsx(c,{className:"shadow-md w-[10px] lg:w-[90px] border border-slate-600 bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-lg",onClick:()=>g(!0),children:t.jsxs("span",{className:"w-full flex justify-center items-center gap-1",children:[t.jsx("i",{className:"pi pi-filter",style:{fontSize:"0.7rem"}})," ",!s&&t.jsx("span",{children:"filter"})]})}),t.jsx(c,{className:"shadow-md w-[10px] lg:w-[90px] bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:border rounded-lg",onClick:w,"data-pr-tooltip":"XLS",children:t.jsxs("span",{className:"w-full flex items-center justify-center gap-1",children:[t.jsx("i",{className:"pi pi-file-excel",style:{fontSize:"0.8rem"}})," ",!s&&t.jsx("span",{children:"export"})]})})]});return t.jsxs(v,{loading:u,className:"w-full h-auto rounded-lg dark:glass border-none text-center shadow-md",pt:{bodyRow:"dark:bg-transparent  dark:text-gray-300",table:"dark:bg-transparent bg-white dark:text-gray-300"},paginator:!0,rowsPerPageOptions:[5,10,25,50],paginatorTemplate:"RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",currentPageReportTemplate:"{first} - {last} dari {totalRecords}",children:h,rows:10,filter:!0,filters:d,scrollable:!0,globalFilterFields:["name","status.name","address","phone_number","pic"],emptyMessage:"Lead tidak ditemukan.",paginatorClassName:"dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg",header:_,value:i,dataKey:"id",children:[t.jsx(n,{header:"Aksi",frozen:!0,body:y,className:"dark:border-none lg:w-max lg:whitespace-nowrap",headerClassName:"dark:border-none dark:bg-slate-900 dark:text-gray-300"}),N.map(e=>t.jsx(n,{field:e.field,header:e.header,body:e.body,style:e.style,frozen:e.frozen,align:"left",className:"dark:border-none bg-white",headerClassName:"dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"})),t.jsx(n,{field:"created_by",className:"dark:border-none",headerClassName:"dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300",header:"Diinput Oleh",align:"left",style:{width:"max-content",whiteSpace:"nowrap"},body:e=>e.created_by.name}),t.jsx(n,{field:"created_at",className:"dark:border-none",headerClassName:"dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300",header:"Diinput Pada",align:"left",style:{width:"max-content",whiteSpace:"nowrap"},body:e=>L(e.created_at)})]})});export{Z as DatatableLead};