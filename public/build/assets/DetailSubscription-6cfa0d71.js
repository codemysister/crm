import{r as d,W as z,j as l}from"./app-183ca207.js";import{I as o}from"./InputError-6be719bf.js";import{L as U}from"./LogDetailPartnerComponent-fcf62a60.js";import{B as c}from"./button.esm-d3cd2157.js";import{D as x}from"./dialog.esm-202fdef4.js";import{D as H}from"./dropdown.esm-0caba294.js";import{I as n}from"./inputnumber.esm-6c4b14f0.js";import{I as k}from"./inputtext.esm-0c7f541c.js";import"./HeaderDatatable-497e5508.js";import"./ripple.esm-4b355069.js";import"./SkeletonDatatable-07c9c4e2.js";import"./DashboardLayout-217cf030.js";import"./Dropdown-b69220a2.js";import"./column.esm-1f1d87c0.js";import"./index.esm-9ef49f43.js";import"./index.esm-dca36cda.js";import"./index.esm-64ce51d8.js";import"./csstransition.esm-03d4c013.js";import"./inheritsLoose-2f6bfe9f.js";import"./index.esm-80aa95ee.js";import"./portal.esm-545bb246.js";import"./skeleton.esm-b303042b.js";import"./formatDate-5c964a42.js";import"./badge.esm-c550247d.js";import"./message.esm-4bbe4c64.js";import"./index.esm-c27cbd20.js";import"./overlaypanel.esm-9c3ae74e.js";const xl=({partner:i,partners:I,handleSelectedDetailPartner:u,showSuccess:h,showError:j,currentUser:g,permissions:f,permissionErrorIsVisible:M,setPermissionErrorIsVisible:v})=>{const[C,p]=d.useState(!1),[D,m]=d.useState(!1),[_,N]=d.useState(!1);d.useRef(null);const{data:a,setData:t,post:T,put:y,delete:B,reset:b,processing:w,errors:r}=z({uuid:"",partner:{},nominal:0,period:null,price_card:{price:"",type:""},ppn:0,total_bill:0,price_training_online:null,price_training_offline:null,price_lanyard:null,price_subscription_system:null,fee_purchase_cazhpoin:null,fee_bill_cazhpoin:null,fee_topup_cazhpos:null,fee_withdraw_cazhpos:null,fee_bill_saldokartu:null}),S=(e,s)=>{e.preventDefault(),s!="update"?T("/subscriptions/",{onSuccess:()=>{h("Update"),p(V=>!1),u(a.partner),b()},onError:()=>{j("Update")}}):y("/subscriptions/"+a.uuid,{onSuccess:()=>{h("Update"),m(V=>!1),u(a.partner),b()},onError:()=>{j("Update")}})},F=e=>{t(s=>({...s,uuid:e.uuid,partner:i,bill:e.bill,nominal:e.nominal,total_bill:e.total_bill,ppn:e.ppn,total_ppn:e.total_ppn})),m(!0)},L=e=>{let s;return e=="bill"?s="Tagihan":e=="nominal"?s="Nominal":e=="ppn"?s="Pajak":e=="total_ppn"?s="Total Pajak":e=="total_bill"&&(s="Total tagihan"),s},P=(e,s)=>e?l.jsx("div",{className:"flex align-items-center",children:l.jsx("div",{children:e.name})}):l.jsx("span",{children:s.placeholder}),E=e=>l.jsx("div",{className:"flex align-items-center",children:l.jsx("div",{children:e.name})});return l.jsxs(l.Fragment,{children:[i.subscription!==null?l.jsxs(l.Fragment,{children:[l.jsxs("table",{class:"w-full dark:text-slate-300 dark:bg-slate-700",children:[l.jsxs("tr",{class:"border-b",children:[l.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Tagihan"}),l.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),l.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.subscription.bill})]}),l.jsxs("tr",{class:"border-b",children:[l.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Nominal"}),l.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),l.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.subscription.nominal.toLocaleString("id-ID")})]}),l.jsxs("tr",{class:"border-b",children:[l.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"PPN"}),l.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),l.jsxs("td",{class:"pt-2 pb-1  text-base w-7/12",children:[i.subscription.ppn!=null?i.subscription.ppn:"","%"]})]}),l.jsxs("tr",{class:"border-b",children:[l.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Total Tagihan (nominal + ppn)"}),l.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),l.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:i.subscription.total_bill.toLocaleString("id-ID")})]}),l.jsxs("tr",{class:"border-b",children:[l.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Log"}),l.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),l.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:l.jsx(c,{onClick:()=>{N(!0)},className:"bg-transparent p-0 cursor-pointer text-blue-700 underline ",children:"logs"})})]}),l.jsxs("tr",{class:"border-b",children:[l.jsx("td",{class:"pt-2 pb-1  text-base font-bold w-1/5",children:"Aksi"}),l.jsx("td",{class:"pt-2 pb-1  text-base w-[2%]",children:":"}),l.jsx("td",{class:"pt-2 pb-1  text-base w-7/12",children:l.jsx(c,{label:"edit",className:"p-0 underline bg-transparent text-blue-700 text-left",onClick:()=>{f.includes("tambah langganan partner")&&i.account_manager_id==g.id?F(i.subscription):v(e=>!0)}})})]})]}),l.jsx("div",{className:"card flex justify-content-center",children:l.jsx(x,{header:"Langganan",headerClassName:"dark:glass dark:text-white",className:"bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white",contentClassName:"dark:glass dark:text-white",visible:D,onHide:()=>m(!1),children:l.jsxs("form",{onSubmit:e=>S(e,"update"),children:[l.jsxs("div",{className:"flex flex-col justify-around gap-4 mt-1",children:[l.jsxs("div",{className:"flex flex-col mt-3",children:[l.jsx("label",{htmlFor:"bill",children:"Tagihan *"}),l.jsx(k,{value:a.bill,onChange:e=>t({...a,bill:e.target.value}),className:"dark:bg-gray-300",id:"bill","aria-describedby":"bill-help"})]}),l.jsxs("div",{className:"flex flex-col",children:[l.jsx("label",{htmlFor:"nominal",children:"Nominal Langganan *"}),l.jsx(n,{value:a.nominal,onChange:e=>{const s=e.value*a.ppn/100;t({...a,nominal:e.value,total_ppn:s,total_bill:a.ppn===0?e.value:s+e.value})},locale:"id-ID"})]}),l.jsxs("div",{className:"flex flex-col",children:[l.jsx("label",{htmlFor:"ppn",children:"Pajak (%)"}),l.jsx(n,{value:a.ppn,onChange:e=>{const s=e.value*a.nominal/100;t({...a,ppn:e.value,total_ppn:s,total_bill:a.nominal+s})},locale:"id-ID"})]}),l.jsxs("div",{className:"flex flex-col",children:[l.jsx("label",{htmlFor:"ppn",children:"Jumlah PPN"}),l.jsx(n,{value:a.total_ppn,onChange:e=>{t({...a,total_ppn:e.target.value})},locale:"id-ID"})]}),l.jsxs("div",{className:"flex flex-col",children:[l.jsx("label",{htmlFor:"ppn",children:"Total Tagihan(nominal + ppn) *"}),l.jsx(n,{value:a.total_bill,onChange:e=>{t({...a,total_ppn:e.target.value})},locale:"id-ID"})]})]}),l.jsx("div",{className:"flex justify-center mt-5",children:l.jsx(c,{label:"Submit",disabled:w,className:"bg-purple-600 text-sm shadow-md rounded-lg"})})]})})})]}):l.jsx("div",{class:"w-full h-full min-h-[300px] -mt-4 flex items-center justify-center",children:l.jsxs("p",{class:"text-center",children:["Tidak ada data langganan",l.jsx(c,{onClick:()=>{f.includes("tambah langganan partner")&&i.account_manager_id==g.id?(b(),t("partner",i),p(!0)):v(e=>!0)},className:"bg-transparent p-0 cursor-pointer text-blue-700 underline ",children:", tambah langganan"})]})}),l.jsx("div",{className:"card flex justify-content-center",children:l.jsx(x,{header:"Langganan",headerClassName:"dark:glass dark:text-white",className:"bg-white w-[80%] md:w-[60%] lg:w-[35%] dark:glass dark:text-white",contentClassName:"dark:glass dark:text-white",visible:C,onHide:()=>p(!1),children:l.jsxs("form",{onSubmit:e=>S(e,"tambah"),children:[l.jsxs("div",{className:"flex flex-col justify-around gap-4 mt-1",children:[l.jsxs("div",{className:"flex flex-col mt-3",children:[l.jsx("label",{htmlFor:"partner_subcription",children:"Partner"}),l.jsx(H,{optionLabel:"name",value:a.partner,onChange:e=>t("partner",e.target.value),dataKey:"id",disabled:!0,options:I,placeholder:"Pilih Partner",filter:!0,valueTemplate:P,itemTemplate:E,className:"w-full md:w-14rem"}),l.jsx(o,{message:r.partner,className:"mt-2"})]}),l.jsxs("div",{className:"flex flex-col",children:[l.jsx("label",{htmlFor:"bill",children:"Tagihan *"}),l.jsx(k,{value:a.bill,onChange:e=>t("bill",e.target.value),className:"dark:bg-gray-300",id:"bill","aria-describedby":"bill-help"}),l.jsx(o,{message:r.bill,className:"mt-2"})]}),l.jsxs("div",{className:"flex flex-col",children:[l.jsx("label",{htmlFor:"nominal",children:"Nominal Langganan *"}),l.jsx(n,{value:a.nominal,onChange:e=>{const s=e.value*a.ppn/100;t({...a,nominal:e.value,total_ppn:s,total_bill:a.ppn===0?e.value:s})},locale:"id-ID"}),l.jsx(o,{message:r.nominal,className:"mt-2"})]}),l.jsxs("div",{className:"flex flex-col",children:[l.jsx("label",{htmlFor:"ppn",children:"PPN(%)"}),l.jsx(n,{value:a.ppn,onChange:e=>{const s=e.value*a.nominal/100;t({...a,ppn:e.value,total_ppn:s,total_bill:a.nominal+s})},locale:"id-ID"}),l.jsx(o,{message:r.ppn,className:"mt-2"})]}),l.jsxs("div",{className:"flex flex-col",children:[l.jsx("label",{htmlFor:"ppn",children:"Jumlah Pajak"}),l.jsx(n,{value:a.total_ppn,onChange:e=>{t({...a,total_ppn:e.value})},locale:"id-ID"}),l.jsx(o,{message:r.total_ppn,className:"mt-2"})]}),l.jsxs("div",{className:"flex flex-col",children:[l.jsx("label",{htmlFor:"ppn",children:"Total Tagihan(nominal + pajak)"}),l.jsx(n,{value:a.total_bill,onChange:e=>{t({...a,total_bill:e.value})},locale:"id-ID"}),l.jsx(o,{message:r.total_bill,className:"mt-2"})]})]}),l.jsx("div",{className:"flex justify-center mt-5",children:l.jsx(c,{label:"Submit",disabled:w,className:"bg-purple-600 text-sm shadow-md rounded-lg"})})]})})}),l.jsx(x,{header:"Log Langganan",visible:_,maximizable:!0,className:"w-[90vw] lg:w-[50vw]",onHide:()=>{N(!1)},children:_&&l.jsx(U,{selectedData:i.subscription,fetchUrl:"/api/subscriptions/{partner:id}/logs",objectKeyToIndo:L})})]})};export{xl as default};