import{r as m,W as g,j as s}from"./app-183ca207.js";import{I as n}from"./InputError-6be719bf.js";import{I as d}from"./InputLabel-20dd3c92.js";import{P as v}from"./PrimaryButton-d388c48b.js";import{T as p}from"./TextInput-a925e615.js";function P({className:l="",showSuccess:w,showError:f}){const c=m.useRef(),u=m.useRef(),{data:r,setData:e,errors:t,put:x,reset:o,processing:j,recentlySuccessful:_}=g({current_password:"",password:"",password_confirmation:""}),h=a=>{a.preventDefault(),x(route("password.update"),{preserveScroll:!0,onSuccess:()=>{o(),w("update")},onError:i=>{f("update"),i.password&&(o("password","password_confirmation"),c.current.focus()),i.current_password&&(o("current_password"),u.current.focus())}})};return s.jsxs("section",{className:l,children:[s.jsxs("header",{children:[s.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Perbaharui Kata Sandi"}),s.jsx("p",{className:"mt-1 text-sm text-gray-600",children:"Pastikan akun Anda menggunakan kata sandi yang panjang dan acak agar tetap ada."})]}),s.jsxs("form",{onSubmit:h,className:"mt-3 space-y-3",children:[s.jsxs("div",{children:[s.jsx(d,{htmlFor:"current_password",value:"Kata sandi saat ini"}),s.jsx(p,{id:"current_password",ref:u,value:r.current_password,onChange:a=>e("current_password",a.target.value),type:"password",className:"mt-1 h-[35px] block w-full",autoComplete:"current-password"}),s.jsx(n,{message:t.current_password,className:"mt-2"})]}),s.jsxs("div",{children:[s.jsx(d,{htmlFor:"password",value:"Kata sandi baru"}),s.jsx(p,{id:"password",ref:c,value:r.password,onChange:a=>e("password",a.target.value),type:"password",className:"mt-1 h-[35px] block w-full",autoComplete:"new-password"}),s.jsx(n,{message:t.password,className:"mt-2"})]}),s.jsxs("div",{children:[s.jsx(d,{htmlFor:"password_confirmation",value:"Konfirmasi kata sandi baru"}),s.jsx(p,{id:"password_confirmation",value:r.password_confirmation,onChange:a=>e("password_confirmation",a.target.value),type:"password",className:"mt-1 block w-full",autoComplete:"new-password"}),s.jsx(n,{message:t.password_confirmation,className:"mt-2"})]}),s.jsx("div",{className:"flex items-center gap-4",children:s.jsx(v,{disabled:j,children:"Submit"})})]})]})}export{P as default};