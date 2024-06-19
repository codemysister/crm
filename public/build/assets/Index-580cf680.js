import{r,F as Le,W,j as e,d as Ie,y as Ee,R as Re,_ as q}from"./app-183ca207.js";import{D as Y,C as i}from"./column.esm-1f1d87c0.js";import{T as Be}from"./toast.esm-b97f2233.js";import{B as d}from"./button.esm-d3cd2157.js";import{D as Ke}from"./DashboardLayout-217cf030.js";import{H as Me}from"./HeaderModule-b06ca799.js";import{D as G}from"./dialog.esm-202fdef4.js";import{I as Ue}from"./inputtext.esm-0c7f541c.js";import{D as Ve}from"./dropdown.esm-0caba294.js";import{I as He}from"./inputtextarea.esm-555f4aba.js";import{C as J,c as Oe}from"./confirmdialog.esm-3c4cbf5c.js";import{C as Q}from"./calendar.esm-fe4692a5.js";import{F as Z,r as Xe,p as $e}from"./filepond.min-8386e795.js";import{O as ee}from"./overlaypanel.esm-9c3ae74e.js";import{I as We}from"./image.esm-891e62e4.js";import{S as qe}from"./SkeletonDatatable-07c9c4e2.js";import{g as Ye}from"./getViewportSize-e6da2c0c.js";import{H as Ge}from"./HeaderDatatable-497e5508.js";import{S as Je}from"./sidebar.esm-1f854c9b.js";import{T as Qe,a as P}from"./tabview.esm-5482a716.js";import{f as T}from"./formatDate-5c964a42.js";import{h as Ze}from"./handleSelectedDetailInstitution-5c7c27d9.js";import{P as ea}from"./PermissionErrorDialog-eff24ba6.js";import{L as aa,A as ta}from"./ArsipComponent-6d496fd7.js";import"./ripple.esm-4b355069.js";import"./inputnumber.esm-6c4b14f0.js";import"./index.esm-9ef49f43.js";import"./index.esm-dca36cda.js";import"./index.esm-64ce51d8.js";import"./csstransition.esm-03d4c013.js";import"./inheritsLoose-2f6bfe9f.js";import"./index.esm-80aa95ee.js";import"./portal.esm-545bb246.js";import"./index.esm-c27cbd20.js";import"./assertThisInitialized-081f9914.js";import"./Dropdown-b69220a2.js";import"./index.esm-d51fec0e.js";import"./index.esm-32ebe3f0.js";import"./skeleton.esm-b303042b.js";import"./badge.esm-c550247d.js";import"./message.esm-4bbe4c64.js";Xe($e);function Ga({auth:h}){const[D,A]=r.useState(""),[j,ae]=r.useState(""),[te,F]=r.useState(null),[ra,re]=r.useState(""),[u,se]=r.useState(0),[le,b]=r.useState(!1),[ie,L]=r.useState(!1),[ne,I]=r.useState("sla"),[w,oe]=r.useState(null),[E,de]=r.useState(null),[ce,pe]=r.useState(!0),[me,v]=r.useState(!1),n=Ye().width<992,R=r.useRef(null),N=r.useRef(null),B=r.useRef(null);r.useRef(null);const K=r.useRef(null),[M,c]=r.useState(!1),[ue,S]=r.useState(!1),[he,U]=r.useState(!1);r.useState(null),r.useState(!1),r.useRef(null);const{data:_,roles:la,permissions:k}=h.user,[C,fe]=r.useState({global:{value:null,matchMode:Le.CONTAINS}}),{data:p,setData:m,post:V,put:ia,delete:ge,reset:H,processing:xe,errors:na}=W({id:"",sla_id:"",activity:"",cazh_pic:"",duration:"",estimation_date:"",realization_date:"",realization:null,information:null}),{data:o,setData:z,reset:be}=W({user:null,input_date:{start:null,end:null}});r.useEffect(()=>{(async()=>{try{await Promise.all([y()]),c(!1),pe(t=>t=!1)}catch(t){console.error("Error fetching data:",t)}})()},[]),r.useEffect(()=>{u==0&&y()},[u]),r.useState("");const y=async()=>{c(!0);let t=await(await fetch("/api/sla")).json();A(s=>t.sla),re(s=>t.roles),ae(s=>t.users),c(!1)},we=async a=>{c(!0);let s=await(await fetch("/api/activity/"+a)).json();F(l=>s),c(!1)},ke=a=>{Oe({message:"Apakah Anda yakin untuk menghapus ini?",header:"Konfirmasi hapus",icon:"pi pi-info-circle",acceptClassName:"p-button-danger",accept:()=>{L(!0)}})},ye=async a=>{a.preventDefault(),c(!0);const t={user:o.user,input_date:o.input_date},s=document.querySelector('meta[name="csrf-token"]').getAttribute("content"),x=(await axios.post("/sla/filter",t,{headers:{"Content-Type":"application/json","X-CSRF-TOKEN":s}})).data;A(x),v(!1),c(!1)},je=(a,t)=>a?e.jsx("div",{className:"flex align-items-center",children:e.jsx("div",{children:a.name})}):e.jsx("span",{children:t.placeholder}),ve=a=>e.jsx("div",{className:"flex align-items-center",children:e.jsx("div",{children:a.name})}),Ne=()=>e.jsx("i",{className:"pi pi-filter",style:{fontSize:"0.7rem",paddingRight:"5px"}}),Se=()=>e.jsx("i",{className:`pi pi-file-excel
                `,style:{fontSize:"0.8rem",paddingRight:"5px"}}),f=a=>{N.current.show({severity:"success",summary:"Success",detail:`${a} data berhasil`,life:3e3})},g=a=>{N.current.show({severity:"error",summary:"Error",detail:`${a} data gagal`,life:3e3})},_e=()=>{const a=D.map(t=>({Kode:t.code??"-",Lembaga:t.partner?t.partner.name:"-",Link_Dokumen:{v:window.location.origin+"/"+t.sla_doc,h:"link",l:{Target:window.location.origin+"/"+t.sla_doc,Tooltip:"Klik untuk membuka dokumen"}},Tanggal_Pembuatan:T(t.created_at)}));q(()=>import("./xlsx-6ed613d4.js"),[]).then(t=>{const l={Sheets:{data:t.utils.json_to_sheet(a)},SheetNames:["data"]},x=t.write(l,{bookType:"xlsx",type:"array"});Ce(x,"SLA"+T(new Date))})},Ce=(a,t)=>{q(()=>import("./FileSaver.min-a64440ff.js").then(s=>s.F),["assets/FileSaver.min-a64440ff.js","assets/app-183ca207.js","assets/app-22bdcf69.css"]).then(s=>{if(s&&s.default){let l="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",x=".xlsx";const Fe=new Blob([a],{type:l});s.default.saveAs(Fe,t+x)}})},O=a=>e.jsx(Re.Fragment,{children:e.jsx("i",{className:"pi pi-ellipsis-h pointer cursor-pointer",onClick:t=>{ne=="sla"?(oe(a),F(a.sla_activities),B.current.toggle(t)):(de(a),K.current.toggle(t))}})}),ze=a=>{m(t=>({...t,uuid:a.uuid,sla_id:a.sla_id,activity:a.activity,cazh_pic:a.cazh_pic,duration:a.duration,estimation_date:a.estimation_date,realization_date:a.realization_date,realization:a.realization,information:a.information})),S(!0)},Pe=a=>{let t;const l=a.split(".")[0];return l=="partner_name"?t="Lembaga":l=="partner_phone_number"?t="Nomor Lembaga":l=="code"?t="Kode":l=="partner_pic"?t="PIC":l=="partner_pic_email"?t="Email PIC":l=="partner_pic_number"?t="Nomor PIC":l=="referral_name"?t="Referral":l=="signature_name"?t="Tanda Tangan":l=="activities"&&(t="Aktivitas"),t},Te=()=>{ge("sla/"+w.uuid,{onSuccess:()=>{y(),f("Hapus")},onError:()=>{g("Hapus")}})},X=[{field:"code",header:"Kode",frozen:!n,style:n?null:{width:"max-content",whiteSpace:"nowrap"}},{header:"Lembaga",frozen:!n,style:{width:"max-content",whiteSpace:"nowrap"},body:a=>e.jsx("button",{onClick:()=>Ze(a),className:"hover:text-blue-700 text-left",children:a.partner_name})},{field:"sla_doc",header:"Dokumen",frozen:!n,style:n?null:{width:"max-content",whiteSpace:"nowrap"},body:a=>e.jsx("div",{className:"flex w-full h-full items-center justify-center",children:e.jsx("a",{href:a.sla_doc,download:`SLA_${a.partner_name}`,class:"font-bold  w-full h-full text-center rounded-full ",children:e.jsx("i",{className:"pi pi-file-pdf",style:{width:"100%",height:"100%",fontSize:"1.5rem"}})})})}],De=(()=>e.jsxs(Ge,{filters:C,setFilters:fe,children:[e.jsx(d,{icon:Ne,className:"shadow-md border border-slate-600 bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 rounded-lg",label:"filter",onClick:()=>v(!0)}),e.jsx(d,{icon:Se,className:"shadow-md bg-transparent text-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:border rounded-lg",label:"export",onClick:_e,"data-pr-tooltip":"XLS"})]}))(),Ae=(a,t)=>{a.preventDefault(),t==="tambah"?V("/products",{onSuccess:()=>{f("Tambah"),setModalProductIsVisible(s=>!1),getProducts(),H("name","category","price","unit","description")},onError:()=>{g("Tambah")}}):V(`activity/${p.uuid}`,{onSuccess:()=>{f("Update"),S(s=>!1),y(),we(p.sla_id),H()},onError:()=>{g("Update")}})},$=["code","partner.name","partner.npwp","created_at.name"];return ce?e.jsx(qe,{auth:h}):e.jsxs(Ke,{auth:h.user,className:"",children:[e.jsx(Be,{ref:N}),e.jsx(ea,{dialogIsVisible:le,setDialogVisible:b}),e.jsx(Me,{title:"Service Level Agreement",children:k.includes("tambah sla")&&e.jsxs(Ie,{href:"/sla/create",className:"bg-purple-600 block text-white py-2 px-3 font-semibold text-sm shadow-md rounded-lg mr-2",children:[e.jsx("i",{className:"pi pi-plus",style:{fontSize:"0.7rem",paddingRight:"5px"}}),"Tambah"]})}),e.jsx(Je,{header:"Filter",visible:me,className:"w-full md:w-[30%] px-3 dark:glass dark:text-white",position:"right",onHide:()=>v(!1),children:e.jsxs("form",{onSubmit:ye,children:[e.jsxs("div",{className:"flex flex-col mt-3",children:[e.jsx("label",{htmlFor:"name",children:"Berdasarkan penginput"}),e.jsx(Ve,{optionLabel:"name",dataKey:"id",value:o.user,onChange:a=>z("user",a.target.value),options:j,placeholder:"Pilih User",filter:!0,showClear:!0,valueTemplate:je,itemTemplate:ve,className:"flex justify-center  dark:text-gray-400   "})]}),e.jsxs("div",{className:"flex flex-col mt-3",children:[e.jsx("label",{htmlFor:"",children:"Tanggal Input"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(Q,{value:o.input_date.start?new Date(o.input_date.start):null,style:{height:"35px"},onChange:a=>{z("input_date",{...o.input_date,start:a.target.value})},placeholder:"mulai",showIcon:!0,dateFormat:"dd/mm/yy"}),e.jsx("span",{children:"-"}),e.jsx(Q,{value:o.input_date.end?new Date(o.input_date.end):null,style:{height:"35px"},onChange:a=>{z("input_date",{...o.input_date,end:a.target.value})},placeholder:"selesai",showIcon:!0,dateFormat:"dd/mm/yy"})]})]}),e.jsxs("div",{className:"flex flex-row mt-5",children:[e.jsx(d,{ref:R,label:"Terapkan",className:"bg-purple-600 text-sm shadow-md rounded-lg mr-2"}),e.jsx(d,{type:"button",label:"Reset",onClick:a=>{be(),setTimeout(()=>{R.current.click()},500)},className:"outline-purple-600 outline-1 outline-dotted bg-transparent text-slate-700  text-sm shadow-md rounded-lg mr-2"})]})]})}),e.jsxs(Qe,{activeIndex:u,onTabChange:a=>{se(a.index)},className:"mt-2",children:[e.jsx(P,{header:"Semua SLA",children:u==0&&e.jsxs(e.Fragment,{children:[e.jsx(J,{}),e.jsx(J,{group:"declarative",visible:ie,onHide:()=>L(!1),message:"Konfirmasi kembali jika anda yakin!",header:"Konfirmasi kembali",icon:"pi pi-info-circle",accept:Te}),e.jsx("div",{className:"flex mx-auto flex-col justify-center mt-5 gap-5",children:e.jsx("div",{className:"card p-fluid w-full h-full flex justify-center rounded-lg",children:e.jsxs(Y,{loading:M,className:"w-full h-auto rounded-lg dark:glass border-none text-center shadow-md",pt:{bodyRow:"dark:bg-transparent bg-transparent dark:text-gray-300",table:"dark:bg-transparent bg-white dark:text-gray-300",header:""},paginator:!0,rowsPerPageOptions:[5,10,25,50],paginatorTemplate:"RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",currentPageReportTemplate:"{first} - {last} dari {totalRecords}",filters:C,rows:10,emptyMessage:"SLA tidak ditemukan.",paginatorClassName:"dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg",header:De,globalFilterFields:$,value:D,dataKey:"id",scrollable:!0,children:[e.jsx(i,{header:"Aksi",body:O,align:"center",frozen:!0,style:n?null:{width:"max-content",whiteSpace:"nowrap"},className:"dark:border-none text-center lg:w-max bg-white lg:whitespace-nowrap ",headerClassName:"dark:border-none text-center bg-white dark:bg-slate-900 dark:text-gray-300"}),e.jsx(i,{field:"uuid",hidden:!0,className:"dark:border-none",headerClassName:"dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300",header:"Nama",align:"left",style:{width:"max-content",whiteSpace:"nowrap"}}),X.map(a=>e.jsx(i,{field:a.field,header:a.header,body:a.body,style:a.style,frozen:a.frozen,align:"left",className:"dark:border-none bg-white",headerClassName:"dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"})),e.jsx(i,{header:"Diinput Oleh",body:a=>a.created_by.name,className:"dark:border-none",headerClassName:"dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300",align:"left",frozen:!n,style:{width:"max-content",whiteSpace:"nowrap"}}),e.jsx(i,{header:"Diinput Pada",body:a=>T(a.created_at),className:"dark:border-none",headerClassName:"dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300",align:"left",frozen:!n,style:{width:"max-content",whiteSpace:"nowrap"}})]})})})]})}),e.jsx(P,{header:"Log",children:u==1&&e.jsx(aa,{auth:h,fetchUrl:"/api/sla/logs",filterUrl:"/sla/logs/filter",deleteUrl:"/sla/logs",objectKeyToIndo:Pe,users:j,showSuccess:f,showError:g})}),e.jsx(P,{header:"Arsip",children:u==2&&e.jsx(ta,{auth:h,users:j,fetchUrl:"/api/sla/arsip",forceDeleteUrl:"/sla/{id}/force",restoreUrl:"/sla/{id}/restore",filterUrl:"/sla/arsip/filter",columns:X,showSuccess:f,showError:g,globalFilterFields:$})})]}),e.jsx("div",{className:"card flex justify-content-center",children:e.jsx(G,{header:"Aktivitas",headerClassName:"dark:glass shadow-md dark:text-white",className:"bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white",contentClassName:" dark:glass dark:text-white",visible:ue,onHide:()=>S(!1),children:e.jsxs("form",{onSubmit:a=>Ae(a,"update"),children:[e.jsxs("div",{className:"flex flex-col justify-around gap-4 mt-4",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"activity",children:"Aktivitas"}),e.jsx(Ue,{value:p.activity,onChange:a=>m("activity",a.target.value),disabled:!0,className:"dark:bg-gray-300",id:"activity","aria-describedby":"activity-help"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"realization",children:"Bukti (foto)"}),e.jsx("div",{className:"App",children:p.realization!==null&&typeof p.realization=="string"?e.jsx(e.Fragment,{children:e.jsx(Z,{files:"/storage/"+p.realization,onaddfile:(a,t)=>{a||m("realization",t.file)},onremovefile:()=>{m("realization",null)},maxFileSize:"2mb",labelMaxFileSizeExceeded:"File terlalu besar",labelIdle:'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'})}):e.jsx(e.Fragment,{children:e.jsx(Z,{onaddfile:(a,t)=>{a||m("realization",t.file)},onremovefile:()=>{m("realization",null)},maxFileSize:"2mb",labelMaxFileSizeExceeded:"File terlalu besar",labelIdle:'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'})})})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"information",children:"Catatan"}),e.jsx(He,{value:p.information,onChange:a=>m("information",a.target.value),rows:5,cols:30})]})]}),e.jsx("div",{className:"flex justify-center mt-5",children:e.jsx(d,{label:"Submit",disabled:xe,className:"bg-purple-600 text-sm shadow-md rounded-lg"})})]})})}),e.jsx(ee,{className:" shadow-md p-1 dark:bg-slate-900 dark:text-gray-300",ref:B,children:e.jsxs("div",{className:"flex flex-col flex-wrap w-full",children:[e.jsx(d,{icon:"pi pi-check-circle",label:"Aktivitas",className:"bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400",onClick:a=>{U(!0),I("activity")}}),e.jsx(d,{icon:"pi pi-pencil",label:"edit",className:"bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400",onClick:()=>{k.includes("edit sla")&&w.created_by.id==_.id?Ee.get("sla/"+w.uuid):b(a=>!0)}}),e.jsx(d,{icon:"pi pi-trash",label:"hapus",className:"bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400",onClick:()=>{k.includes("hapus sla")&&w.created_by.id==_.id?ke():b(a=>!0)}})]})}),e.jsx(ee,{className:" shadow-md p-1 dark:bg-slate-900 dark:text-gray-300",ref:K,children:e.jsx("div",{className:"flex flex-col flex-wrap w-full",children:e.jsx(d,{icon:"pi pi-pencil",label:"edit",className:"bg-transparent hover:bg-slate-200 w-full text-slate-500 border-b-2 border-slate-400",onClick:()=>{k.includes("edit sla")&&E.user_id==_.id?ze(E):b(a=>!0)}})})}),e.jsx(G,{header:"Aktivitas",visible:he,maximizable:!0,className:"w-full lg:w-[70vw]",onHide:()=>{U(!1),I("sla")},children:e.jsx("div",{className:"flex mx-auto flex-col justify-center mt-5 gap-5",children:e.jsx("div",{className:"card p-fluid w-full h-full flex justify-center rounded-lg",children:e.jsxs(Y,{loading:M,className:"w-full h-auto rounded-lg dark:glass border-none text-center",pt:{bodyRow:"dark:bg-transparent bg-transparent dark:text-gray-300",table:"dark:bg-transparent bg-white dark:text-gray-300",header:""},paginator:!0,rowsPerPageOptions:[10,25,50],paginatorTemplate:"RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",currentPageReportTemplate:"{first} - {last} dari {totalRecords}",filters:C,rows:25,emptyMessage:"SLA tidak ditemukan.",paginatorClassName:"dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg",globalFilterFields:["activity","cazh_pic"],value:te,dataKey:"id",scrollable:!0,children:[e.jsx(i,{header:"Aksi",body:O,style:n?null:{width:"max-content",whiteSpace:"nowrap"},align:"center",className:"dark:border-none lg:w-max bg-white lg:whitespace-nowrap ",headerClassName:"dark:border-none bg-white dark:bg-slate-900 dark:text-gray-300"}),e.jsx(i,{field:"uuid",hidden:!0,className:"dark:border-none",headerClassName:"dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300",header:"Nama",align:"left",style:{width:"max-content",whiteSpace:"nowrap"}}),e.jsx(i,{field:"activity",className:"dark:border-none",headerClassName:"dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300",header:"Tahapan",align:"left",style:{width:"max-content",whiteSpace:"nowrap"}}),e.jsx(i,{field:"cazh_pic",className:"dark:border-none",headerClassName:"dark:border-none bg-transparent dark:bg-transparent dark:text-gray-300",header:"Penanggungjawab",align:"left",style:{width:"max-content",whiteSpace:"nowrap"}}),e.jsx(i,{field:"duration",header:"Estimasi Waktu",style:{width:"max-content",whiteSpace:"nowrap"},headerClassName:"dark:border-none bg-white dark:bg-transparent dark:text-gray-300"}),e.jsx(i,{field:"estimation_date",header:"Tanggal",body:a=>new Date(a.estimation_date).toLocaleDateString("id"),style:{width:"max-content",whiteSpace:"nowrap"},headerClassName:"dark:border-none bg-white dark:bg-transparent dark:text-gray-300"}),e.jsx(i,{field:"realization_date",header:"Realisasi",body:a=>a.realization_date!==null?new Date(a.realization_date).toLocaleDateString("id"):"-",style:{width:"max-content",whiteSpace:"nowrap"},headerClassName:"dark:border-none bg-white dark:bg-transparent dark:text-gray-300"}),e.jsx(i,{field:"realization",header:"Bukti",body:a=>a.realization?e.jsx("div",{className:"flex justify-center",children:e.jsx(We,{src:"/storage/"+a.realization,alt:"Bukti",width:"50%",height:"50%",preview:!0,downloadable:!0})}):"-",style:{width:"8rem"},headerClassName:"dark:border-none bg-white dark:bg-transparent dark:text-gray-300"}),e.jsx(i,{field:"realization",header:"Catatan",body:a=>a.information??"-",style:{width:"max-content",whiteSpace:"nowrap"},headerClassName:"dark:border-none bg-white dark:bg-transparent dark:text-gray-300"})]})})})})]})}export{Ga as default};