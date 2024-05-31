import{r as l,W as Ce,F as Fe,j as e,a as Te,d as Re}from"./app-183ca207.js";import{I as p}from"./inputtext.esm-0c7f541c.js";import{C as Le}from"./card.esm-aad9a2fd.js";import{B as h}from"./button.esm-d3cd2157.js";import{D as Ve,C as j}from"./column.esm-1f1d87c0.js";import{D as U}from"./dialog.esm-202fdef4.js";import{D as R}from"./dropdown.esm-0caba294.js";import{T as Je}from"./toast.esm-b97f2233.js";import{B as Be}from"./badge.esm-c550247d.js";import{I as x}from"./inputnumber.esm-6c4b14f0.js";import{C as X}from"./calendar.esm-fe4692a5.js";import{B as Ee,L as He}from"./blockui.esm-74c21695.js";import{u as Y}from"./UppercaseEachWord-e9d7052e.js";import{a as Me,g as Oe}from"./getProvince-aa058a1f.js";import{D as Ke}from"./DialogInstitution-405a9aff.js";import"./ripple.esm-4b355069.js";import"./portal.esm-545bb246.js";import"./index.esm-9ef49f43.js";import"./index.esm-dca36cda.js";import"./index.esm-64ce51d8.js";import"./csstransition.esm-03d4c013.js";import"./inheritsLoose-2f6bfe9f.js";import"./index.esm-80aa95ee.js";import"./index.esm-c27cbd20.js";import"./assertThisInitialized-081f9914.js";import"./index.esm-d51fec0e.js";import"./progressspinner.esm-5c964cda.js";import"./formatNPWP-cf5b7efc.js";import"./HeaderDatatable-497e5508.js";const wa=({usersProp:Q,partnersProp:Z,productsProp:G,invoiceGeneral:n,signaturesProp:ee})=>{var A,q,W;l.useState(Q);const[ae,te]=l.useState(Z),[se,ze]=l.useState(G);l.useState(ee);const[le,y]=l.useState(!1),[re,L]=l.useState(!1),[ne,ie]=l.useState(null),[de,oe]=l.useState(!1),[ce,_]=l.useState(!1),[me,Ae]=l.useState(!0),[V,J]=l.useState([]),w=l.useRef(null),[pe,B]=l.useState(!1),ue=l.useRef(null),[he,xe]=l.useState([]),[fe,ge]=l.useState([]),[k,S]=l.useState(null),[E,qe]=l.useState(localStorage.theme);l.useEffect(()=>{E?localStorage.theme="dark":localStorage.removeItem("theme"),localStorage.theme==="dark"&&window.matchMedia("(prefers-color-scheme: dark)").matches?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")},[E]);const D=l.useRef(null),P=l.useRef(null),f=l.useRef(null),g=l.useRef(null),I=l.useRef(null),b=l.useRef(null),N=l.useRef(null),je=l.useRef(null),{data:t,setData:d,post:We,put:be,delete:$e,reset:Ne,processing:H,errors:M}=Ce({uuid:n.uuid,code:n.code,products:n.products,total:n.total,total_ppn:n.total_all_ppn,total_all_ppn:n.total_all_ppn,partner:{id:n.partner==null?n.lead.id:n.partner.id,uuid:n.partner==null?n.lead.uuid:n.partner.uuid,name:n.institution_name,province:n.institution_province,regency:n.institution_regency,phone_number:n.institution_phone_number,type:n.partner==null?"lead":"partner"},date:n.date,due_date:n.due_date,paid_off:n.paid_off,rest_of_bill:n.rest_of_bill,payment_metode:n.payment_metode,xendit_link:n.xendit_link,created_by:null,signature:{name:n.signature_name,image:n.signature_image}});l.useEffect(()=>{B(!!H)},[H]),l.useEffect(()=>{const a=async()=>{let s=await Me();xe(i=>s)};S(JSON.parse(t.partner.province).name),a(),v()},[]),l.useEffect(()=>{(async()=>{if(k){let s=await Oe(k);ge(i=>s)}})()},[k]),l.useEffect(()=>{v()},[t.paid_off]);const ve=()=>{let a=new Date;const s=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];let i=a.getDate(),r=a.getMonth(),u=a.getFullYear(),$=s[r];return i+" "+$+" "+u},O=a=>{if(!a)return null;const s=new Date(a),i=s.getFullYear(),r=String(s.getMonth()+1).padStart(2,"0");return`${String(s.getDate()).padStart(2,"0")}-${r}-${i}`},[C,K]=l.useState({global:{value:null,matchMode:Fe.CONTAINS}}),[ye,_e]=l.useState(""),we=a=>{const s=a.target.value;let i={...C};i.global.value=s,K(i),_e(s)};document.querySelector("body").classList.add("overflow-hidden");const z=a=>e.jsx(h,{label:"OK",icon:"pi pi-check",onClick:()=>{a!=="product"?(y(!1),v()):ke()}}),ke=()=>{let a=V.map(i=>({...i,ppn:0,quantity:1,total:i.price*1,total_ppn:0}));const s=[...t.products,...a];d("products",s),_(!1),J(i=>[])},o=a=>(a.current&&(a.current.classList.add("twinkle"),a.current.focus(),a.current.scrollIntoView({behavior:"smooth",block:"nearest"})),null),c=a=>(a.current.classList.remove("twinkle"),null),F=(a,s)=>a?e.jsx("div",{className:"flex align-items-center",children:e.jsx("div",{children:a.name})}):e.jsx("span",{children:s.placeholder}),T=a=>e.jsx("div",{className:"flex align-items-center",children:e.jsx("div",{children:a.name})}),Se=e.jsx("div",{className:"flex flex-row justify-left gap-2 align-items-center items-end",children:e.jsx("div",{className:"w-[30%]",children:e.jsxs("span",{className:"p-input-icon-left",children:[e.jsx("i",{className:"pi pi-search dark:text-white"}),e.jsx(p,{className:"dark:bg-transparent dark:placeholder-white",value:ye,onChange:we,placeholder:"Keyword Search"})]})})}),De=a=>{w.current.show({severity:"success",summary:"Success",detail:`${a} data berhasil`,life:3e3})},Pe=a=>{w.current.show({severity:"error",summary:"Error",detail:a,life:3e3})},m=(a,s,i)=>{const r=[...t.products];if(r[a][s]=i,s=="price"||s=="quantity"||s=="ppn"){let u=r[a].price*r[a].quantity;r[a].total=u,r[a].total_ppn=r[a].total*r[a].ppn/100}d("products",r)},v=()=>{let a=0,s=0;t.products.map(i=>{a+=i.total,s+=i.total_ppn}),d(i=>({...i,total:a,total_all_ppn:s,rest_of_bill:a+s-i.paid_off}))},Ie=a=>{a.preventDefault(),be("/invoice_generals/"+t.uuid,{onSuccess:s=>{De("Tambah"),window.location="/invoice_generals"},onError:s=>{Pe(s.error)}})};return e.jsxs(e.Fragment,{children:[e.jsx(Te,{title:"Invoice Umum"}),e.jsx(Je,{ref:w}),e.jsx(Ee,{blocked:pe,template:He,children:e.jsx("div",{className:"h-screen max-h-screen overflow-y-hidden dark:bg-slate-950",children:e.jsxs("div",{className:"flex flex-col h-screen max-h-screen overflow-hidden md:flex-row z-40 relative gap-5",children:[e.jsx("div",{className:"md:w-[30%] overflow-y-auto h-screen max-h-screen p-5",children:e.jsxs(Le,{children:[e.jsxs("div",{className:"flex justify-between items-center mb-4",children:[e.jsx("h1",{className:"font-bold text-2xl",children:"Invoice Umum"}),e.jsx(Re,{href:"/invoice_generals",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",class:"w-6 h-6",children:e.jsx("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"})})})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx(h,{label:"Tambah Produk",icon:"pi pi-external-link",onClick:()=>y(!0)}),e.jsx("div",{className:"flex flex-col mt-3",children:e.jsx(p,{value:t.code,onChange:a=>d("code",a.target.value),className:"dark:bg-gray-300",id:"code","aria-describedby":"code-help",hidden:!0})}),e.jsxs("div",{className:"flex flex-col mt-3",children:[e.jsx("label",{htmlFor:"lembaga",children:"Lembaga *"}),e.jsx(p,{value:t.partner.name,onFocus:()=>{o(D)},onBlur:()=>{c(D)},onClick:()=>{L(!0)},placeholder:"Pilih lembaga",className:"dark:bg-gray-300 cursor-pointer",id:"partner","aria-describedby":"partner-help"})]}),e.jsxs("div",{className:"flex flex-col mt-3",children:[e.jsx("label",{htmlFor:"number",children:"Nomor Telepon *"}),e.jsx(p,{value:t.partner.phone_number,onChange:a=>d("partner",{...t.partner,phone_number:a.target.value}),className:"dark:bg-gray-300",id:"number","aria-describedby":"number-help",onFocus:()=>{o(P)},onBlur:()=>{c(P)},keyfilter:"int"})]}),e.jsxs("div",{className:"flex flex-col mt-3",children:[e.jsx("label",{htmlFor:"province",children:"Provinsi *"}),e.jsx(R,{value:t.partner.province?JSON.parse(t.partner.province):null,onChange:a=>{S(s=>a.target.value.code),d("partner",{...t.partner,province:JSON.stringify(a.target.value),regency:null})},dataKey:"code",options:he,optionLabel:"name",placeholder:"Pilih Provinsi",filter:!0,valueTemplate:F,itemTemplate:T,className:"w-full md:w-14rem",onFocus:()=>{o(b)},onShow:()=>{o(b)},onHide:()=>{c(b)}})]}),e.jsxs("div",{className:"flex flex-col mt-3",children:[e.jsx("label",{htmlFor:"regency",children:"Kabupaten *"}),e.jsx(R,{value:t.partner.regency?JSON.parse(t.partner.regency):null,onChange:a=>{d("partner",{...t.partner,regency:JSON.stringify(a.target.value)})},onFocus:()=>{o(N)},onShow:()=>{o(N)},onHide:()=>{c(N)},options:fe,optionLabel:"name",dataKey:"code",placeholder:"Pilih Kabupaten",filter:!0,valueTemplate:F,itemTemplate:T,className:"w-full md:w-14rem"})]}),e.jsxs("div",{className:"flex flex-col mt-3",children:[e.jsx("label",{htmlFor:"date",children:"Tanggal *"}),e.jsx(X,{value:t.date?new Date(t.date):null,style:{height:"35px"},onChange:a=>{d("date",a.target.value)},onFocus:()=>{o(f)},onShow:()=>{o(f)},onHide:()=>{c(f)},onBlur:()=>{c(f)},showIcon:!0,dateFormat:"dd-mm-yy",className:`w-full md:w-14rem ${M.due_date&&"p-invalid"}`})]}),e.jsxs("div",{className:"flex flex-col mt-3",children:[e.jsx("label",{htmlFor:"due_date",children:"Jatuh Tempo *"}),e.jsx(X,{value:t.due_date?new Date(t.due_date):null,style:{height:"35px"},onChange:a=>{d("due_date",a.target.value)},onFocus:()=>{o(g)},onShow:()=>{o(g)},onHide:()=>{c(g)},onBlur:()=>{c(g)},showIcon:!0,dateFormat:"dd-mm-yy",className:`w-full md:w-14rem ${M.due_date&&"p-invalid"}`})]}),e.jsxs("div",{className:"flex flex-col mt-3",children:[e.jsx("label",{htmlFor:"paid_off",children:"Terbayarkan *"}),e.jsx(x,{value:t.paid_off,onChange:a=>{d(s=>({...s,paid_off:a.value}))},defaultValue:0,className:"dark:bg-gray-300",id:"partner_address","aria-describedby":"partner_address-help",locale:"id-ID"})]}),e.jsxs("div",{className:"flex flex-col mt-3",children:[e.jsx("label",{htmlFor:"payment_metode",children:"Metode Pembayaran *"}),e.jsx(R,{value:t.payment_metode,onChange:a=>{d("payment_metode",a.target.value)},onShow:()=>{o(I)},onHide:()=>{c(I)},options:[{name:"cazhbox"},{name:"payment link"}],optionLabel:"name",optionValue:"name",placeholder:"Pilih Metode Pembayaran",valueTemplate:F,itemTemplate:T,className:"w-full md:w-14rem",editable:!0})]}),t.payment_metode==="payment link"&&e.jsxs("div",{className:"flex flex-col mt-3",children:[e.jsx("label",{htmlFor:"partner_address",children:"Link Xendit *"}),e.jsx(p,{value:t.xendit_link,onChange:a=>d("xendit_link",a.target.value),className:"dark:bg-gray-300",id:"partner_address","aria-describedby":"partner_address-help"})]}),e.jsx("div",{className:"flex-flex-col mt-3",children:e.jsx("form",{onSubmit:Ie,children:e.jsx(h,{className:"mx-auto justify-center block",children:"Submit"})})})]})]})}),e.jsxs(U,{header:"Input Produk",visible:le,style:{width:"85vw"},maximizable:!0,modal:!0,contentStyle:{height:"550px"},onHide:()=>{y(!1),v()},footer:z,children:[e.jsxs("div",{className:"flex my-5 gap-3",children:[e.jsx(h,{label:"Tambah produk dari stock",icon:"pi pi-external-link",className:"text-xs md:text-base",onClick:()=>_(!0)}),e.jsx(h,{label:"Tambah Inputan Produk",icon:"pi pi-plus",className:"text-xs md:text-base",onClick:()=>{let a={name:"",price:0,quantity:1,description:null,total:0,ppn:0,total_ppn:0},s=[...t.products,a];d("products",s)}})]}),(A=t.products)==null?void 0:A.map((a,s)=>{const i=s+1;return e.jsxs("div",{className:"flex  w-full max-h-full gap-5 mt-2 items-center",children:[e.jsx("div",{children:e.jsx(Be,{value:i,size:"large"})}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"partner_address",children:"Produk *"}),e.jsx(p,{value:a.name,onChange:r=>m(s,"name",r.target.value),className:"dark:bg-gray-300",id:"partner_address","aria-describedby":"partner_address-help"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"partner_address",children:"Deskripsi *"}),e.jsx(p,{value:a.description,onChange:r=>m(s,"description",r.target.value),className:"dark:bg-gray-300",id:"partner_address","aria-describedby":"partner_address-help"})]}),e.jsx("div",{className:"flex",children:e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"partner_address",children:"Harga Satuan *"}),e.jsx(x,{value:a.price,onChange:r=>m(s,"price",r.value),defaultValue:0,className:"dark:bg-gray-300",id:"partner_address","aria-describedby":"partner_address-help",locale:"id-ID"})]})}),e.jsx("div",{className:"flex",children:e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"partner_address",children:"Kuantitas *"}),e.jsx(x,{value:a.quantity,onChange:r=>m(s,"quantity",r.value),defaultValue:1,className:"dark:bg-gray-300",id:"partner_address","aria-describedby":"partner_address-help",locale:"id-ID"})]})}),e.jsx("div",{className:"flex",children:e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"partner_address",children:"Pajak (%) *"}),e.jsx(x,{onChange:r=>{m(s,"ppn",r.value)},defaultValue:0,value:a.ppn,className:"dark:bg-gray-300",id:"partner_address","aria-describedby":"partner_address-help",locale:"id-ID"})]})}),e.jsx("div",{className:"flex",children:e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"partner_address",children:"Jumlah Harga *"}),e.jsx(x,{value:a.total,onChange:r=>{m(s,"total",r.value)},defaultValue:0,className:"dark:bg-gray-300",id:"partner_address","aria-describedby":"partner_address-help",locale:"id-ID",disabled:!0})]})}),e.jsx("div",{className:"flex",children:e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"partner_address",children:"Pajak *"}),e.jsx(x,{onChange:r=>{m(s,"total_ppn",r.value)},value:a.total_ppn,className:"dark:bg-gray-300",id:"partner_address","aria-describedby":"partner_address-help",locale:"id-ID",disabled:!0})]})}),e.jsx("div",{className:"flex self-center pt-4 ",children:e.jsx(h,{className:"bg-red-500 h-1 w-1 shadow-md rounded-full ",icon:()=>e.jsx("i",{className:"pi pi-minus",style:{fontSize:"0.7rem"}}),onClick:()=>{const r=[...t.products];r.splice(s,1),d(u=>({...u,products:r}))},"aria-controls":"popup_menu_right","aria-haspopup":!0})})]},a+s)}),e.jsx(U,{header:"Produk",visible:ce,style:{width:"75vw"},maximizable:!0,modal:!0,contentStyle:{height:"550px"},onHide:()=>{_(!1)},footer:()=>z("product"),children:e.jsxs(Ve,{value:se,paginator:!0,filters:C,rows:5,header:Se,scrollable:!0,scrollHeight:"flex",tableStyle:{minWidth:"50rem"},selectionMode:me?null:"checkbox",selection:V,onSelectionChange:a=>{J(a.value)},dataKey:"id",children:[e.jsx(j,{selectionMode:"multiple",headerStyle:{width:"3rem"}}),e.jsx(j,{field:"name",header:"Name",style:{minWidth:"5rem"}}),e.jsx(j,{field:"category",header:"Kategori",style:{minWidth:"5rem"}}),e.jsx(j,{field:"price",header:"Harga",style:{minWidth:"5rem"}}),e.jsx(j,{field:"description",header:"Deskripsi",style:{minWidth:"5rem"}})]})})]}),e.jsxs("div",{className:"md:w-[70%] hidden md:block text-sm h-screen max-h-screen overflow-y-auto p-5",children:[e.jsx("header",{children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("div",{className:"w-full flex flex-col text-xs text-purple-700",children:[e.jsx("img",{src:"/assets/img/cazh.png",alt:"",className:"float-left w-[40%] h-[40%]"}),e.jsx("p",{className:"mt-3",children:"PT CAZH TEKNOLOGI INOVASI"}),e.jsx("div",{className:"leading-2 mt-2 w-[80%]",children:"Bonavida Park D1, Jl. Raya Karanggintung, Sumbang Banyumas, Jawa Tengah, 53183 | hello@cazh.id"})]}),e.jsxs("div",{className:"w-full text-right text-xs",children:[e.jsx("h1",{className:"font-bold text-3xl text-purple-800",children:"INVOICE"}),e.jsx("p",{className:"mt-4",children:t.code}),e.jsxs("p",{ref:f,children:["Tanggal"," ",O(t.date)??"{{Tanggal Invoice}}"]}),e.jsxs("p",{ref:g,children:["Jatuh Tempo"," ",O(t.due_date)??"{{Jatuh Tempo}}"]})]})]})}),e.jsxs("div",{className:"mt-5",ref:ue,children:[e.jsx("h1",{children:"Ditagihkan Kepada:"}),e.jsx("h1",{className:"font-bold mt-3",ref:D,children:t.partner.name??"{{partner}}"}),e.jsxs("h1",{className:"mt-2",children:["di"," ",e.jsx("span",{ref:N,children:t.partner.regency?Y(JSON.parse(t.partner.regency).name):"{{kabupaten}}"}),", ",e.jsx("span",{ref:b,children:t.partner.province?Y(JSON.parse(t.partner.province).name):"{{provinsi}}"})]}),e.jsx("h1",{ref:P,children:t.partner.number??"{{nomor hp partner}}"})]}),e.jsx("div",{className:"w-full mt-5",children:e.jsxs("table",{className:"w-full border",children:[e.jsxs("thead",{className:"bg-purple-800 text-white text-center border",children:[e.jsx("th",{className:"p-1 border ",children:"Produk"}),e.jsx("th",{className:"p-1 border",children:"Deskripsi"}),e.jsx("th",{className:"p-1 border",children:"Kuantitas"}),e.jsx("th",{className:"p-1 border",children:"Harga Satuan"}),e.jsx("th",{className:"p-1 border",children:"Jumlah Harga"}),e.jsx("th",{className:"p-1 border",children:"Pajak"})]}),e.jsxs("tbody",{children:[((q=t.products)==null?void 0:q.length)==0&&e.jsx("tr",{className:"text-center border",children:e.jsx("td",{colSpan:6,children:"Produk belum ditambah"})}),(W=t.products)==null?void 0:W.map((a,s)=>e.jsxs("tr",{className:"border p-1",children:[e.jsx("td",{className:"border p-1",children:a.name}),e.jsx("td",{className:"border p-1",children:a.description}),e.jsx("td",{className:"border p-1 text-center",children:a.quantity}),e.jsxs("td",{className:"border p-1 text-right",children:["Rp",a.price?a.price.toLocaleString("id-ID"):0]}),e.jsxs("td",{className:"border p-1 text-right",children:["Rp",a.total?a.total.toLocaleString("id-ID"):0]}),e.jsxs("td",{className:"border p-1 text-right",children:["Rp",a.total_ppn?a.total_ppn.toLocaleString("id-ID"):0]})]},a.name+s))]})]})}),e.jsx("div",{className:"mt-5",children:e.jsx("div",{className:"w-full flex justify-end",children:e.jsxs("div",{className:"w-[35%]",children:[e.jsxs("div",{className:"flex gap-1",children:[e.jsx("p",{className:"w-[50%] text-right",children:"Total Harga"}),e.jsxs("p",{className:"text-right w-full",children:["Rp",t.total.toLocaleString("id-ID")??0]})]}),e.jsxs("div",{className:"flex gap-1",children:[e.jsx("p",{className:"w-[50%] text-right",children:"Pajak"}),e.jsxs("p",{className:"text-right w-full",children:["Rp",t.total_all_ppn.toLocaleString("id-ID")??0]})]}),e.jsxs("div",{className:"flex gap-1 mt-5",children:[e.jsx("p",{className:"w-[50%] text-right",children:"Terbayar"}),e.jsxs("div",{className:"w-full",children:[e.jsxs("p",{className:"text-right w-full",children:["Rp",t.paid_off?t.paid_off.toLocaleString("id-ID"):0]}),e.jsx("hr",{className:"h-[2px] bg-gray-500"})]})]}),e.jsxs("div",{className:"flex gap-1 font-bold mt-5",children:[e.jsx("p",{className:"w-[50%] text-right",children:"Sisa Tagihan"}),e.jsxs("p",{className:"text-right w-full",children:["Rp",t.rest_of_bill.toLocaleString("id-ID")??0]})]})]})})}),t.total_all_ppn==0&&e.jsxs("div",{className:"mt-16 w-full",children:[e.jsx("h1",{className:"font-bold underline",children:"Catatan"}),e.jsx("p",{className:"w-1/2",children:"Pajak akan ditanggung dan dibayarkan oleh lembaga secara mandiri."})]}),e.jsxs("div",{ref:I,className:"flex w-full mt-5 justify-between items-center",children:[e.jsxs("div",{className:"w-[50%] leading-6",children:[t.payment_metode==="payment link"&&e.jsxs("div",{children:[e.jsx("h1",{className:"font-bold underline",children:"Payment Link:"}),e.jsx("p",{children:"Pembayaran online* via link berikut:"}),e.jsx("p",{children:e.jsx("a",{className:"text-blue-500",href:t.xendit_link,children:t.xendit_link??"{{link}}"})}),e.jsx("p",{className:"text-xs mt-1",children:"*melalui m-Banking, ATM, QRIS, Minimarket dll."})]}),t.payment_metode==="cazhbox"&&e.jsxs("div",{children:[e.jsx("h1",{className:"font-bold underline",children:"Payment:"}),e.jsxs("p",{children:["Pembayaran akan dilakukan dengan mengurangi ",e.jsx("b",{children:"CazhBOX"})," ","lembaga Anda."]})]})]}),e.jsxs("div",{className:"flex flex-col text-center justify-start w-[30%]",ref:je,children:[e.jsx("p",{children:ve()}),e.jsxs("div",{className:"h-[100px] w-[170px] self-center py-2",children:[e.jsx("img",{src:t.signature.image,alt:"",className:"object-fill w-full h-full"}),e.jsx("p",{children:t.signature.name})]})]})]})]})]})})}),e.jsx(Ke,{dialogInstitutionVisible:re,setDialogInstitutionVisible:L,filters:C,setFilters:K,isLoadingData:de,setIsLoadingData:oe,leads:ne,setLeads:ie,partners:ae,setPartners:te,data:t,setData:d,setProvinceName:S,reset:Ne})]})};export{wa as default};
