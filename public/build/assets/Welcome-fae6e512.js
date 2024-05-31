import{r as a,e as J,P as te,U as ne,O as x,I as re,j as s,a as ae}from"./app-183ca207.js";import{I as le,C as oe,u as se,a as ie,d as ce,R as pe}from"./ripple.esm-4b355069.js";import{C as de}from"./csstransition.esm-03d4c013.js";import{P as ue}from"./index.esm-80aa95ee.js";import"./inheritsLoose-2f6bfe9f.js";function I(){return I=Object.assign?Object.assign.bind():function(n){for(var r=1;r<arguments.length;r++){var e=arguments[r];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o])}return n},I.apply(this,arguments)}var X=a.memo(a.forwardRef(function(n,r){var e=le.getPTI(n);return a.createElement("svg",I({ref:r,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e),a.createElement("path",{d:"M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z",fill:"currentColor"}))}));X.displayName="MinusIcon";function N(){return N=Object.assign?Object.assign.bind():function(n){for(var r=1;r<arguments.length;r++){var e=arguments[r];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o])}return n},N.apply(this,arguments)}function ge(n){if(Array.isArray(n))return n}function fe(n,r){var e=n==null?null:typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"];if(e!=null){var o,t,b,m,i=[],h=!0,y=!1;try{if(b=(e=e.call(n)).next,r===0){if(Object(e)!==e)return;h=!1}else for(;!(h=(o=b.call(e)).done)&&(i.push(o.value),i.length!==r);h=!0);}catch(C){y=!0,t=C}finally{try{if(!h&&e.return!=null&&(m=e.return(),Object(m)!==m))return}finally{if(y)throw t}}return i}}function $(n,r){(r==null||r>n.length)&&(r=n.length);for(var e=0,o=new Array(r);e<r;e++)o[e]=n[e];return o}function me(n,r){if(n){if(typeof n=="string")return $(n,r);var e=Object.prototype.toString.call(n).slice(8,-1);if(e==="Object"&&n.constructor&&(e=n.constructor.name),e==="Map"||e==="Set")return Array.from(n);if(e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return $(n,r)}}function he(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function D(n,r){return ge(n)||fe(n,r)||me(n,r)||he()}var S=oe.extend({defaultProps:{__TYPE:"Panel",id:null,header:null,headerTemplate:null,footer:null,footerTemplate:null,toggleable:null,style:null,className:null,collapsed:null,expandIcon:null,collapseIcon:null,icons:null,transitionOptions:null,onExpand:null,onCollapse:null,onToggle:null,children:void 0},css:{classes:{root:function(r){var e=r.props;return J("p-panel p-component",{"p-panel-toggleable":e.toggleable})},header:"p-panel-header",title:"p-panel-title",icons:"p-panel-icons",toggler:"p-panel-header-icon p-panel-toggler p-link",togglerIcon:"p-panel-header-icon p-panel-toggler p-link",toggleableContent:"p-toggleable-content",content:"p-panel-content",footer:"p-panel-footer",transition:"p-toggleable-content"},styles:`
        @layer primereact {
            .p-panel-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .p-panel-title {
              line-height: 1;
            }
            
            .p-panel-header-icon {
              display: inline-flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              text-decoration: none;
              overflow: hidden;
              position: relative;
            }
        }
        `}}),j=a.forwardRef(function(n,r){var e=se(),o=a.useContext(te),t=S.getProps(n,o),b=a.useState(t.id),m=D(b,2),i=m[0],h=m[1],y=a.useState(t.collapsed),C=D(y,2),B=C[0],O=C[1],_=a.useRef(null),w=a.useRef(null),u=t.toggleable?t.onToggle?t.collapsed:B:!1,R=i+"_header",A=i+"_content",P=S.setMetaData({props:t,state:{id:i,collapsed:u}}),p=P.ptm,d=P.cx,F=P.isUnstyled;ie(S.css.styles,F,{name:"panel"});var T=function(l){t.toggleable&&(u?k(l):H(l),l&&(t.onToggle&&t.onToggle({originalEvent:l,value:!u}),l.preventDefault()))},k=function(l){t.onToggle||O(!1),t.onExpand&&l&&t.onExpand(l)},H=function(l){t.onToggle||O(!0),t.onCollapse&&l&&t.onCollapse(l)};a.useImperativeHandle(r,function(){return{props:t,toggle:T,expand:k,collapse:H,getElement:function(){return _.current},getContent:function(){return w.current}}}),ce(function(){i||h(ne())});var W=function(){if(t.toggleable){var l=i+"_label",f=e({className:d("toggler"),onClick:T,id:l,"aria-controls":A,"aria-expanded":!u,type:"button",role:"button","aria-label":t.header},p("toggler")),c=e(p("togglericon")),v=u?t.expandIcon||a.createElement(ue,c):t.collapseIcon||a.createElement(X,c),E=re.getJSXIcon(v,c,{props:t,collapsed:u});return a.createElement("button",f,E,a.createElement(pe,null))}return null},V=function(){var l=x.getJSXElement(t.header,t),f=x.getJSXElement(t.icons,t),c=W(),v=e({id:R,className:d("title")},p("title")),E=a.createElement("span",v,l),K=e({className:d("icons")},p("icons")),M=a.createElement("div",K,f,c),Q=e({className:d("header")},p("header")),U=a.createElement("div",Q,E,M);if(t.headerTemplate){var ee={className:"p-panel-header",titleClassName:"p-panel-title",iconsClassName:"p-panel-icons",togglerClassName:"p-panel-header-icon p-panel-toggler p-link",onTogglerClick:T,titleElement:E,iconsElement:M,togglerElement:c,element:U,id:i+"_header",props:t,collapsed:u};return x.getJSXElement(t.headerTemplate,ee)}else if(t.header||t.toggleable)return U;return null},q=function(){var l=x.getJSXElement(t.footer,t),f=e({className:d("footer")},p("footer")),c=a.createElement("div",f,l);if(t.footerTemplate){var v={className:d("footer"),element:c,props:t};return x.getJSXElement(t.footerTemplate,v)}else if(t.footer)return c;return null},L=function(){var l=e({ref:w,className:d("toggleableContent"),"aria-hidden":u,role:"region",id:A,"aria-labelledby":R},p("toggleablecontent")),f=e({className:d("content")},p("content")),c=e({classNames:d("transition"),timeout:{enter:1e3,exit:450},in:!u,unmountOnExit:!0,options:t.transitionOptions},p("transition"));return a.createElement(de,N({nodeRef:w},c),a.createElement("div",l,a.createElement("div",f,t.children)))},Y=e({id:i,ref:_,style:t.style,className:J(t.className,d("root"))},S.getOtherProps(t),p("root")),Z=V(),z=L(),G=q();return a.createElement("div",Y,Z,z,G)});j.displayName="Panel";function Ee({auth:n,laravelVersion:r,phpVersion:e}){return s.jsxs(s.Fragment,{children:[s.jsx(ae,{title:"Welcome"}),s.jsxs("div",{className:`
          bg-white
          dark:bg-gray-800
          p-10
          rounded-xl
          flex flex-col
          gap-8
          max-w-3xl
        `,children:[s.jsx("h1",{className:"text-4xl text-black dark:text-white font-bold text-center",children:"Tailwind CSS + PrimeReact"}),s.jsx(j,{header:"Default Preset",children:s.jsx("p",{children:"First panel component uses the global pass through preset from the Tailwind CSS based implementation of PrimeOne Design 2023."})}),s.jsx(j,{header:"Custom Header",pt:{header:"p-5 flex items-center justify-between border border-indigo-300 bg-indigo-500 text-indigo-50 rounded-tl-lg rounded-tr-lg dark:bg-indigo-900 dark:border-indigo-900/40 dark:text-white/80"},children:s.jsx("p",{children:"Second panel overrides the header section with custom a custom style."})}),s.jsx(j,{header:"Custom Design",ptOptions:{mergeSections:!1},pt:{header:"flex items-center justify-center p-5 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 rounded-tl-2xl rounded-tr-2xl text-white",title:"leading-none font-bold uppercase text-2xl",content:"bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 px-5 pb-8 pt-3 text-white text-center rounded-bl-2xl rounded-br-2xl text-xl"},children:s.jsxs("p",{children:["Third panel ignores the default preset with",s.jsx("b",{children:" mergeSections: false"})," and applies a custom style to all elements of the panel instead."]})})]})]})}export{Ee as default};
