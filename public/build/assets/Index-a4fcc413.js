import{r as i,W,j as e,R as q}from"./app-183ca207.js";import{H as G}from"./HeaderModule-b06ca799.js";import{D as S}from"./DashboardLayout-217cf030.js";import{B as o}from"./button.esm-d3cd2157.js";import{D as C,C as t}from"./column.esm-1f1d87c0.js";import{D}from"./dialog.esm-202fdef4.js";import{I as R}from"./inputtext.esm-0c7f541c.js";import{S as m}from"./skeleton.esm-b303042b.js";import{F as n,r as J,p as Q}from"./filepond.min-8386e795.js";import{T as X}from"./toast.esm-b97f2233.js";import{I as T}from"./image.esm-891e62e4.js";import{C as Y,c as Z}from"./confirmdialog.esm-3c4cbf5c.js";import{D as E}from"./dropdown.esm-0caba294.js";import"./Dropdown-b69220a2.js";import"./ripple.esm-4b355069.js";import"./portal.esm-545bb246.js";import"./inputnumber.esm-6c4b14f0.js";import"./index.esm-9ef49f43.js";import"./index.esm-dca36cda.js";import"./index.esm-64ce51d8.js";import"./csstransition.esm-03d4c013.js";import"./inheritsLoose-2f6bfe9f.js";import"./index.esm-80aa95ee.js";import"./index.esm-c27cbd20.js";import"./assertThisInitialized-081f9914.js";import"./index.esm-32ebe3f0.js";J(Q);function Re({auth:h,userAsReferralProp:I}){const[z,b]=i.useState(!1),[L,B]=i.useState(null),[j,ee]=i.useState(I),M=Array.from({length:5},(a,r)=>r),[A,U]=i.useState(!0),[P,c]=i.useState(!1),[H,u]=i.useState(!1),p=i.useRef(null);i.useState([]),i.useEffect(()=>{(async()=>{await d(),U(r=>!1)})()},[]);const{data:s,setData:l,post:y,put:ae,delete:K,reset:g,processing:k,errors:re}=W({user:{id:null,name:null},institution:null,logo:null,signature:null}),d=async()=>{b(!0);let r=await(await fetch("/api/referral")).json();B(F=>r),b(!1)};if(A)return e.jsx(e.Fragment,{children:e.jsx(S,{auth:h.user,className:"",children:e.jsx("div",{className:"card my-5",children:e.jsxs(C,{value:M,className:"p-datatable-striped dark:bg-slate-900",pt:{bodyRow:"dark:bg-transparent bg-transparent dark:text-gray-300",table:"dark:bg-transparent bg-white dark:text-gray-300",header:"dark:bg-transparent"},children:[e.jsx(t,{style:{width:"25%"},body:e.jsx(m,{}),headerClassName:"dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"}),e.jsx(t,{style:{width:"25%"},body:e.jsx(m,{}),headerClassName:"dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"}),e.jsx(t,{style:{width:"25%"},body:e.jsx(m,{}),headerClassName:"dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"}),e.jsx(t,{style:{width:"25%"},body:e.jsx(m,{}),headerClassName:"dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"})]})})})});const v=(a,r)=>a?e.jsx("div",{className:"flex align-items-center",children:e.jsx("div",{children:a.name})}):e.jsx("span",{children:r.placeholder}),N=a=>e.jsx("div",{className:"flex align-items-center",children:e.jsx("div",{children:a.name})}),x=a=>{p.current.show({severity:"success",summary:"Success",detail:`${a} data berhasil`,life:3e3})},f=a=>{p.current.show({severity:"error",summary:"Error",detail:`${a} data gagal`,life:3e3})},V=()=>e.jsx("i",{className:"pi pi-plus",style:{fontSize:"0.7rem",paddingRight:"5px"}}),w=(a,r)=>{a.preventDefault(),r==="tambah"?y("/referral",{onSuccess:()=>{x("Tambah"),c(F=>!1),d(),g()},onError:()=>{f("Tambah")},forceFormData:!0}):y("/referral/"+s.uuid,{onSuccess:()=>{x("Update"),u(F=>!1),d(),g()},onError:()=>{f("Update")},forceFormData:!0})},_=a=>{Z({message:"Apakah Anda yakin untuk menghapus ini?",header:"Konfirmasi hapus",icon:"pi pi-info-circle",acceptClassName:"p-button-danger",accept:async()=>{K("referral/"+a.uuid,{onSuccess:()=>{d(),x("Hapus")},onError:()=>{f("Hapus")}})}})},$=a=>{l(r=>({...r,uuid:a.uuid,user:{id:a.user.id,name:a.user.name},institution:a.institution,logo:a.logo,signature:a.signature})),u(!0)},O=a=>e.jsxs(q.Fragment,{children:[e.jsx(o,{icon:"pi pi-pencil",rounded:!0,outlined:!0,className:"mr-2",onClick:()=>$(a)}),e.jsx(o,{icon:"pi pi-trash",rounded:!0,outlined:!0,severity:"danger",onClick:()=>{_(a)}})]});return e.jsxs(S,{auth:h.user,children:[e.jsx(X,{ref:p}),e.jsx(Y,{}),e.jsx(G,{title:"Referral",children:e.jsx(o,{label:"Tambah",className:"bg-purple-600 text-sm shadow-md rounded-lg mr-2",icon:V,onClick:()=>{c(a=>!0),g()},"aria-controls":"popup_menu_right","aria-haspopup":!0})}),e.jsx("div",{className:"card flex justify-content-center",children:e.jsx(D,{header:"Referral",headerClassName:"dark:glass shadow-md dark:text-white",className:"bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white",contentClassName:" dark:glass dark:text-white",visible:P,onHide:()=>c(!1),children:e.jsxs("form",{onSubmit:a=>w(a,"tambah"),children:[e.jsxs("div",{className:"flex flex-col justify-around gap-4 mt-4",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"name",children:"Pilih Referral"}),e.jsx(E,{dataKey:"name",value:s.user,onChange:a=>{l(r=>({...r,user:{name:a.target.value.name,id:a.target.value.id}}))},options:j,optionLabel:"name",placeholder:"Pilih User",filter:!0,valueTemplate:v,itemTemplate:N,className:"w-full md:w-14rem"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"institution",children:"Lembaga"}),e.jsx(R,{value:s.institution,onChange:a=>l("institution",a.target.value),className:"dark:bg-gray-300",id:"institution","aria-describedby":"institution-help"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"logo",children:"Upload Logo"}),e.jsx("div",{className:"App",children:s.logo!==null&&typeof s.logo=="string"?e.jsx(e.Fragment,{children:e.jsx(n,{files:"/storage/"+s.logo,onaddfile:(a,r)=>{a||l("logo",r.file)},onremovefile:()=>{l("logo",null)},maxFileSize:"2mb",labelMaxFileSizeExceeded:"File terlalu besar",labelIdle:'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'})}):e.jsx(e.Fragment,{children:e.jsx(n,{onaddfile:(a,r)=>{a||l("logo",r.file)},onremovefile:()=>{l("logo",null)},maxFileSize:"2mb",labelMaxFileSizeExceeded:"File terlalu besar",labelIdle:'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'})})})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"signature",children:"Upload Tanda Tangan"}),e.jsx("div",{className:"App",children:s.signature!==null&&typeof s.signature=="string"?e.jsx(e.Fragment,{children:e.jsx(n,{files:"/storage/"+s.signature,onaddfile:(a,r)=>{a||l("signature",r.file)},onremovefile:()=>{l("signature",null)},maxFileSize:"2mb",labelMaxFileSizeExceeded:"File terlalu besar",labelIdle:'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'})}):e.jsx(e.Fragment,{children:e.jsx(n,{onaddfile:(a,r)=>{a||l("signature",r.file)},onremovefile:()=>{l("signature",null)},maxFileSize:"2mb",labelMaxFileSizeExceeded:"File terlalu besar",labelIdle:'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'})})})]})]}),e.jsx("div",{className:"flex justify-center my-5",children:e.jsx(o,{label:"Submit",disabled:k,className:"bg-purple-600 text-sm shadow-md rounded-lg"})})]})})}),e.jsx("div",{className:"card flex justify-content-center",children:e.jsx(D,{header:"Referral",headerClassName:"dark:glass shadow-md dark:text-white",className:"bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white",contentClassName:" dark:glass dark:text-white",visible:H,onHide:()=>u(!1),children:e.jsxs("form",{encType:"multipart-form",onSubmit:a=>w(a,"update"),children:[e.jsxs("div",{className:"flex flex-col justify-around gap-4 mt-4",children:[e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"referral",children:"Pilih Referral"}),e.jsx(E,{dataKey:"name",value:s.user,onChange:a=>{l(r=>({...r,user:{name:a.target.value.name,id:a.target.value.id}}))},options:j,optionLabel:"name",placeholder:"Pilih User",filter:!0,valueTemplate:v,itemTemplate:N,className:"w-full md:w-14rem"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"institution",children:"Lembaga"}),e.jsx(R,{value:s.institution,onChange:a=>l("institution",a.target.value),className:"dark:bg-gray-300",id:"institution","aria-describedby":"institution-help"})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"logo",children:"Upload Logo"}),e.jsx("div",{className:"App",children:s.logo!==null&&typeof s.logo=="string"?e.jsx(e.Fragment,{children:e.jsx(n,{files:[{source:"/storage"+s.logo,options:{type:"remote"}}],onaddfile:(a,r)=>{a||l("logo",r.file)},onremovefile:()=>{l("logo",null)},maxFileSize:"2mb",labelMaxFileSizeExceeded:"File terlalu besar",labelIdle:'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'})}):e.jsx(e.Fragment,{children:e.jsx(n,{onaddfile:(a,r)=>{a||l("logo",r.file)},onremovefile:()=>{l("logo",null)},maxFileSize:"2mb",labelMaxFileSizeExceeded:"File terlalu besar",labelIdle:'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'})})})]}),e.jsxs("div",{className:"flex flex-col",children:[e.jsx("label",{htmlFor:"signature",children:"Upload Tanda Tangan"}),e.jsx("div",{className:"App",children:s.signature!==null&&typeof s.signature=="string"?e.jsx(e.Fragment,{children:e.jsx(n,{files:[{source:"/storage/"+s.signature,options:{type:"remote"}}],onaddfile:(a,r)=>{a||l("signature",r.file)},onremovefile:()=>{l("signature",null)},maxFileSize:"2mb",labelMaxFileSizeExceeded:"File terlalu besar",labelIdle:'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'})}):e.jsx(e.Fragment,{children:e.jsx(n,{onaddfile:(a,r)=>{a||l("signature",r.file)},onremovefile:()=>{l("signature",null)},maxFileSize:"2mb",labelMaxFileSizeExceeded:"File terlalu besar",labelIdle:'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'})})})]})]}),e.jsx("div",{className:"flex justify-center my-5",children:e.jsx(o,{label:"Submit",disabled:k,className:"bg-purple-600 text-sm shadow-md rounded-lg"})})]})})}),e.jsx("div",{className:"flex mx-auto flex-col justify-center mt-5 gap-5",children:e.jsx("div",{className:"card p-fluid w-full h-full flex justify-center rounded-lg",children:e.jsxs(C,{loading:z,className:"w-full h-auto rounded-lg dark:glass border-none text-center shadow-md",pt:{bodyRow:"dark:bg-transparent bg-transparent dark:text-gray-300",table:"dark:bg-transparent bg-white dark:text-gray-300",header:""},paginator:!0,rows:5,emptyMessage:"Referral tidak ditemukan.",paginatorClassName:"dark:bg-transparent paginator-custome dark:text-gray-300 rounded-b-lg",globalFilterFields:["name"],value:L,dataKey:"id",children:[e.jsx(t,{header:"No",body:(a,{rowIndex:r})=>r+1,style:{width:"5%"},className:"dark:border-none pl-6",headerClassName:"dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300"}),e.jsx(t,{body:a=>a.user.name,header:"Nama",className:"dark:border-none pl-6",headerClassName:"dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300",style:{width:"10rem"}}),e.jsx(t,{field:"institution",header:"Lembaga",className:"dark:border-none pl-6",headerClassName:"dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300",style:{width:"10rem"}}),e.jsx(t,{field:"logo",header:"Logo",headerClassName:"dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300",body:a=>a.logo?e.jsx("div",{className:"flex justify-center",children:e.jsx(T,{src:"/storage/"+a.logo,alt:"Logo",width:"50%",height:"50%",preview:!0,downloadable:!0})}):"-",style:{width:"10rem"}}),e.jsx(t,{field:"signature",header:"Tanda Tangan",headerClassName:"dark:border-none pl-6 bg-transparent dark:bg-transparent dark:text-gray-300",body:a=>a.signature?e.jsx("div",{className:"flex justify-center",children:e.jsx(T,{src:"/storage/"+a.signature,alt:"signature",width:"50%",height:"50%",preview:!0,downloadable:!0})}):"-",style:{width:"10rem"}}),e.jsx(t,{header:"Action",body:O,style:{width:"max-content",whiteSpace:"nowrap"},className:"dark:border-none",headerClassName:"dark:border-none  bg-transparent dark:bg-transparent dark:text-gray-300"})]})})})]})}export{Re as default};