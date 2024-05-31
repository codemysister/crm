import{r as s,P as me,e as C,g as P,D as j,Z as R,O as D,l as ve,I as ye}from"./app-183ca207.js";import{C as he,u as ge,a as xe,m as Se,n as Ee,E as we,c as ke,d as Ie,b as _,e as Oe,R as Pe}from"./ripple.esm-4b355069.js";import{C as $}from"./csstransition.esm-03d4c013.js";import{T as Ce}from"./index.esm-64ce51d8.js";import{P as je}from"./portal.esm-545bb246.js";function y(){return y=Object.assign?Object.assign.bind():function(n){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(n[a]=e[a])}return n},y.apply(this,arguments)}function S(n){"@babel/helpers - typeof";return S=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},S(n)}function Re(n,t){if(S(n)!=="object"||n===null)return n;var e=n[Symbol.toPrimitive];if(e!==void 0){var a=e.call(n,t||"default");if(S(a)!=="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(n)}function De(n){var t=Re(n,"string");return S(t)==="symbol"?t:String(t)}function _e(n,t,e){return t=De(t),t in n?Object.defineProperty(n,t,{value:e,enumerable:!0,configurable:!0,writable:!0}):n[t]=e,n}function Te(n){if(Array.isArray(n))return n}function Ne(n,t){var e=n==null?null:typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"];if(e!=null){var a,r,m,p,l=[],d=!0,E=!1;try{if(m=(e=e.call(n)).next,t===0){if(Object(e)!==e)return;d=!1}else for(;!(d=(a=m.call(e)).done)&&(l.push(a.value),l.length!==t);d=!0);}catch(w){E=!0,r=w}finally{try{if(!d&&e.return!=null&&(p=e.return(),Object(p)!==p))return}finally{if(E)throw r}}return l}}function z(n,t){(t==null||t>n.length)&&(t=n.length);for(var e=0,a=new Array(t);e<t;e++)a[e]=n[e];return a}function Ae(n,t){if(n){if(typeof n=="string")return z(n,t);var e=Object.prototype.toString.call(n).slice(8,-1);if(e==="Object"&&n.constructor&&(e=n.constructor.name),e==="Map"||e==="Set")return Array.from(n);if(e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e))return z(n,t)}}function Me(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function T(n,t){return Te(n)||Ne(n,t)||Ae(n,t)||Me()}var Be={closeButton:"p-sidebar-close p-sidebar-icon p-link",closeIcon:"p-sidebar-close-icon",mask:function(t){var e=t.props,a=t.maskVisibleState,r=["left","right","top","bottom"],m=r.find(function(p){return p===e.position});return C("p-sidebar-mask",m&&!e.fullScreen?"p-sidebar-".concat(m):"",{"p-component-overlay p-component-overlay-enter":e.modal,"p-sidebar-mask-scrollblocker":e.blockScroll,"p-sidebar-visible":a,"p-sidebar-full":e.fullScreen},e.maskClassName)},header:function(t){var e=t.props;return C("p-sidebar-header",{"p-sidebar-custom-header":e.header})},content:"p-sidebar-content",icons:"p-sidebar-icons",root:function(t){var e=t.props,a=t.context;return C("p-sidebar p-component",e.className,{"p-input-filled":a&&a.inputStyle==="filled"||P.inputStyle==="filled","p-ripple-disabled":a&&a.ripple===!1||P.ripple===!1})},transition:"p-sidebar"},Le=`
@layer primereact {
    .p-sidebar-mask {
        display: none;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        background-color: transparent;
        transition-property: background-color;
    }
    
    .p-sidebar-visible {
        display: flex;
    }
    
    .p-sidebar-mask.p-component-overlay {
        pointer-events: auto;
    }
    
    .p-sidebar {
        display: flex;
        flex-direction: column;
        pointer-events: auto;
        transform: translate3d(0px, 0px, 0px);
        position: relative;
    }
    
    .p-sidebar-content {
        overflow-y: auto;
        flex-grow: 1;
    }
    
    .p-sidebar-header {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    
    .p-sidebar-custom-header {
        justify-content: space-between;
    }
    
    .p-sidebar-icons {
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }
    
    .p-sidebar-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
    }
    
    .p-sidebar-full .p-sidebar {
        transition: none;
        transform: none;
        width: 100vw;
        height: 100vh;
        max-height: 100%;
        top: 0px;
        left: 0px;
    }
    
    /* Animation */
    /* Top, Bottom, Left and Right */
    .p-sidebar-top .p-sidebar-enter,
    .p-sidebar-top .p-sidebar-exit-active {
        transform: translate3d(0px, -100%, 0px);
    }
    
    .p-sidebar-bottom .p-sidebar-enter,
    .p-sidebar-bottom .p-sidebar-exit-active {
        transform: translate3d(0px, 100%, 0px);
    }
    
    .p-sidebar-left .p-sidebar-enter,
    .p-sidebar-left .p-sidebar-exit-active {
        transform: translate3d(-100%, 0px, 0px);
    }
    
    .p-sidebar-right .p-sidebar-enter,
    .p-sidebar-right .p-sidebar-exit-active {
        transform: translate3d(100%, 0px, 0px);
    }
    
    .p-sidebar-top .p-sidebar-enter-active,
    .p-sidebar-bottom .p-sidebar-enter-active,
    .p-sidebar-left .p-sidebar-enter-active,
    .p-sidebar-right .p-sidebar-enter-active {
        transform: translate3d(0px, 0px, 0px);
        transition: all 0.3s;
    }
    
    .p-sidebar-top .p-sidebar-enter-done,
    .p-sidebar-bottom .p-sidebar-enter-done,
    .p-sidebar-left .p-sidebar-enter-done,
    .p-sidebar-right .p-sidebar-enter-done {
        transform: none;
    }
    
    .p-sidebar-top .p-sidebar-exit-active,
    .p-sidebar-bottom .p-sidebar-exit-active,
    .p-sidebar-left .p-sidebar-exit-active,
    .p-sidebar-right .p-sidebar-exit-active {
        transition: all 0.3s;
    }
    
    /* Full */
    .p-sidebar-full .p-sidebar-enter {
        opacity: 0;
        transform: scale(0.5);
    }
    
    .p-sidebar-full .p-sidebar-enter-active {
        opacity: 1;
        transform: scale(1);
        transition: all 0.15s cubic-bezier(0, 0, 0.2, 1);
    }
    
    .p-sidebar-full .p-sidebar-enter-done {
        transform: none;
    }
    
    .p-sidebar-full .p-sidebar-exit-active {
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Size */
    .p-sidebar-left .p-sidebar {
        width: 20rem;
        height: 100%;
    }
    
    .p-sidebar-right .p-sidebar {
        width: 20rem;
        height: 100%;
    }
    
    .p-sidebar-top .p-sidebar {
        height: 10rem;
        width: 100%;
    }
    
    .p-sidebar-bottom .p-sidebar {
        height: 10rem;
        width: 100%;
    }
    
    .p-sidebar-left .p-sidebar-sm,
    .p-sidebar-right .p-sidebar-sm {
        width: 20rem;
    }
    
    .p-sidebar-left .p-sidebar-md,
    .p-sidebar-right .p-sidebar-md {
        width: 40rem;
    }
    
    .p-sidebar-left .p-sidebar-lg,
    .p-sidebar-right .p-sidebar-lg {
        width: 60rem;
    }
    
    .p-sidebar-top .p-sidebar-sm,
    .p-sidebar-bottom .p-sidebar-sm {
        height: 10rem;
    }
    
    .p-sidebar-top .p-sidebar-md,
    .p-sidebar-bottom .p-sidebar-md {
        height: 20rem;
    }
    
    .p-sidebar-top .p-sidebar-lg,
    .p-sidebar-bottom .p-sidebar-lg {
        height: 30rem;
    }
    
    .p-sidebar-left .p-sidebar-view,
    .p-sidebar-right .p-sidebar-view,
    .p-sidebar-top .p-sidebar-view,
    .p-sidebar-bottom .p-sidebar-view {
        width: 100%;
        height: 100%;
    }
    
    .p-sidebar-left .p-sidebar-content,
    .p-sidebar-right .p-sidebar-content,
    .p-sidebar-top .p-sidebar-content,
    .p-sidebar-bottom .p-sidebar-content {
        width: 100%;
        height: 100%;
    }
    
    @media screen and (max-width: 64em) {
        .p-sidebar-left .p-sidebar-lg,
        .p-sidebar-left .p-sidebar-md,
        .p-sidebar-right .p-sidebar-lg,
        .p-sidebar-right .p-sidebar-md {
            width: 20rem;
        }
    }        
}
`,He={mask:function(t){var e=t.props;return{position:"fixed",height:"100%",width:"100%",left:0,top:0,display:"flex",justifyContent:e.position==="left"?"flex-start":e.position==="right"?"flex-end":"center",alignItems:e.position==="top"?"flex-start":e.position==="bottom"?"flex-end":"center"}}},O=he.extend({defaultProps:{__TYPE:"Sidebar",appendTo:null,ariaCloseLabel:null,baseZIndex:0,blockScroll:!1,children:void 0,className:null,closeIcon:null,closeOnEscape:!0,content:null,dismissable:!0,fullScreen:!1,header:null,icons:null,id:null,maskClassName:null,maskStyle:null,modal:!0,onHide:null,onShow:null,position:"left",showCloseIcon:!0,style:null,transitionOptions:null,visible:!1},css:{classes:Be,styles:Le,inlineStyles:He}});function J(n,t){var e=Object.keys(n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);t&&(a=a.filter(function(r){return Object.getOwnPropertyDescriptor(n,r).enumerable})),e.push.apply(e,a)}return e}function Ue(n){for(var t=1;t<arguments.length;t++){var e=arguments[t]!=null?arguments[t]:{};t%2?J(Object(e),!0).forEach(function(a){_e(n,a,e[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(e)):J(Object(e)).forEach(function(a){Object.defineProperty(n,a,Object.getOwnPropertyDescriptor(e,a))})}return n}var Ve=s.forwardRef(function(n,t){var e=ge(),a=s.useContext(me),r=O.getProps(n,a),m=s.useState(!1),p=T(m,2),l=p[0],d=p[1],E=s.useState(!1),w=T(E,2),v=w[0],N=w[1],k=O.setMetaData({props:r,state:{containerVisible:l}}),u=k.ptm,b=k.cx,K=k.sx,X=k.isUnstyled;xe(O.css.styles,X,{name:"sidebar"});var c=s.useRef(null),f=s.useRef(null),h=s.useRef(null),A=Se("sidebar",v);Ee({callback:function(i){g(i)},when:v&&r.closeOnEscape&&A,priority:[we.SIDEBAR,A]});var G=ke({type:"click",listener:function(i){i.button===0&&Y(i)&&g(i)}}),M=T(G,2),B=M[0],L=M[1],Y=function(i){return c&&c.current&&!c.current.contains(i.target)},F=function(){var i=document.activeElement,x=i&&c&&c.current.contains(i);!x&&r.showCloseIcon&&h.current&&h.current.focus()},W=function(i){r.dismissable&&r.modal&&f.current===i.target&&g(i)},g=function(i){r.onHide(),i.preventDefault()},q=function(){r.onShow&&r.onShow(),F(),ne()},Q=function(){r.modal&&j.addClass(f.current,"p-component-overlay-leave")},ee=function(){R.clear(f.current),d(!1),H()},ne=function(){r.dismissable&&!r.modal&&B(),r.blockScroll&&j.blockBodyScroll()},H=function(){L(),r.blockScroll&&j.unblockBodyScroll()};s.useImperativeHandle(t,function(){return{props:r,getElement:function(){return c.current},gteMask:function(){return f.current},getCloseIcon:function(){return h.current}}}),Ie(function(){r.visible&&d(!0)}),_(function(){r.visible&&!l&&d(!0),r.visible!==v&&l&&N(r.visible)}),_(function(){l&&(R.set("modal",f.current,a&&a.autoZIndex||P.autoZIndex,r.baseZIndex||a&&a.zIndex.modal||P.zIndex.modal),N(!0))},[l]),_(function(){v&&(L(),r.dismissable&&!r.modal&&B())},[r.dismissable,r.modal,v]),Oe(function(){H(),f.current&&R.clear(f.current)});var te=function(){var i=r.ariaCloseLabel||ve("close"),x=e({type:"button",ref:h,className:b("closeButton"),onClick:function(fe){return g(fe)},"aria-label":i},u("closeButton")),I=e({className:b("closeIcon")},u("closeIcon")),ue=r.closeIcon||s.createElement(Ce,I),be=ye.getJSXIcon(ue,Ue({},I),{props:r});return r.showCloseIcon?s.createElement("button",x,be,s.createElement(Pe,null)):null},re=function(){return r.header?D.getJSXElement(r.header,r):null},ae=function(){return r.icons?D.getJSXElement(r.icons,r):null},U=e({ref:f,style:K("mask"),className:b("mask",{maskVisibleState:l}),onMouseDown:function(i){return W(i)}},u("mask")),V=e({id:r.id,className:b("root",{context:a}),style:r.style,role:"complementary"},O.getOtherProps(r),u("root")),ie=e({className:b("header")},u("header")),se=e({className:b("content")},u("content")),oe=e({className:b("icons")},u("icons")),le={enter:r.fullScreen?150:300,exit:r.fullScreen?150:300},Z=e({classNames:b("transition"),in:v,timeout:le,options:r.transitionOptions,unmountOnExit:!0,onEntered:q,onExiting:Q,onExited:ee},u("transition")),ce=function(){var i={closeIconRef:h,hide:g};return s.createElement("div",U,s.createElement($,y({nodeRef:c},Z),s.createElement("div",y({ref:c},V),D.getJSXElement(n.content,i))))},pe=function(){var i=te(),x=ae(),I=re();return s.createElement("div",U,s.createElement($,y({nodeRef:c},Z),s.createElement("div",y({ref:c},V),s.createElement("div",ie,I,s.createElement("div",oe,x,i)),s.createElement("div",se,r.children))))},de=function(){var i=n!=null&&n.content?ce():pe();return s.createElement(je,{element:i,appendTo:r.appendTo,visible:!0})};return l&&de()});Ve.displayName="Sidebar";export{Ve as S};
