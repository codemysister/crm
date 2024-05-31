import{q as y,W as S,r as p,j as e,y as _}from"./app-183ca207.js";import{I as u}from"./InputError-6be719bf.js";import{I as i}from"./InputLabel-20dd3c92.js";import{P as w}from"./PrimaryButton-d388c48b.js";import{T as c}from"./TextInput-a925e615.js";import{F as d,r as k,p as P}from"./filepond.min-8386e795.js";k(P);function q({className:x="",showSuccess:g,showError:f}){const s=y().props.auth.user,{data:r,setData:t,post:b,errors:n,processing:h,recentlySuccessful:E}=S({name:s.data.name,email:s.data.email,number:s.data.number,profile_picture:s.data.profile_picture,signature:s.data.signature}),[j,v]=p.useState(r.profile_picture??"/assets/img/user_profile_img.png"),[N,F]=p.useState(r.signature??"/assets/img/user_profile_img.png"),I=a=>{a.preventDefault(),b(route("profile.update"),{onSuccess:()=>{_.get("/profile"),g("update")},onError:m=>{f("update")}})};return e.jsxs("section",{className:x,children:[e.jsxs("header",{children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Biodata"}),e.jsx("p",{className:"mt-1 text-sm text-gray-600",children:"Perbarui profil Anda untuk memastikan semua informasi tetap akurat dan terupdate."})]}),e.jsxs("form",{onSubmit:I,className:"mt-3 space-y-3",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"rounded-lg bg-no-repeat w-[120px] bg-contain bg-center h-[80px]",style:{backgroundImage:`url(${j})`}}),e.jsxs("div",{className:"w-full h-full",children:[e.jsx(i,{htmlFor:"name",value:"Foto"}),e.jsx(d,{onaddfile:(a,m)=>{if(!a){const l=m.file,o=URL.createObjectURL(l);v(o),t("profile_picture",l)}},className:"h-full",onremovefile:()=>{t("profile_picture",null)},maxFileSize:"2mb",labelMaxFileSizeExceeded:"File terlalu besar",labelIdle:'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'})]})]}),(s.data.roles[0].name==="account executive"||s.data.roles[0].name==="account manager")&&e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"rounded-lg bg-no-repeat w-[120px] bg-contain bg-center h-[80px]",style:{backgroundImage:`url(${N})`}}),e.jsxs("div",{className:"w-full h-full",children:[e.jsx(i,{htmlFor:"signature",value:"Tanda tangan"}),e.jsx(d,{onaddfile:(a,m)=>{if(!a){const l=m.file,o=URL.createObjectURL(l);F(o),t("signature",l)}},className:"h-full",onremovefile:()=>{t("signature",null)},maxFileSize:"2mb",labelMaxFileSizeExceeded:"File terlalu besar",labelIdle:'Drag & Drop your files or <span class="filepond--label-action">Browse</span>'})]})]}),e.jsxs("div",{children:[e.jsx(i,{htmlFor:"name",value:"Nama"}),e.jsx(c,{id:"name",className:"mt-1 text-sm h-[35px] block w-full",value:r.name,onChange:a=>t("name",a.target.value),required:!0,isFocused:!0,autoComplete:"name"}),e.jsx(u,{className:"mt-2",message:n.name})]}),e.jsxs("div",{children:[e.jsx(i,{htmlFor:"email",value:"Email"}),e.jsx(c,{id:"email",type:"email",className:"mt-1 text-sm h-[35px] block w-full",value:r.email,onChange:a=>t("email",a.target.value),required:!0,autoComplete:"username"}),e.jsx(u,{className:"mt-2",message:n.email})]}),e.jsxs("div",{children:[e.jsx(i,{htmlFor:"number",value:"Nomor Telepon"}),e.jsx(c,{id:"number",className:"mt-1 text-sm h-[35px] block w-full",value:r.number,onChange:a=>t("number",a.target.value),type:"number",required:!0,isFocused:!0,autoComplete:"number"}),e.jsx(u,{className:"mt-2",message:n.phone_number})]}),e.jsx("div",{className:"flex items-center gap-4",children:e.jsx(w,{disabled:h,children:"Submit"})})]})]})}export{q as default};
