import{r as s,P as le,e as ie,g as C,D as y,U as ce,Z as D,I as se,l as ue}from"./app-183ca207.js";import{C as pe,u as fe,a as ye,f as ve,m as de,n as me,E as be,d as ge,e as Oe,R as he}from"./ripple.esm-4b355069.js";import{C as Pe}from"./csstransition.esm-03d4c013.js";import{T as Ee}from"./index.esm-64ce51d8.js";import{O as j}from"./dropdown.esm-0caba294.js";import{P as xe}from"./portal.esm-545bb246.js";function T(){return T=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},T.apply(this,arguments)}function w(e){"@babel/helpers - typeof";return w=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},w(e)}function Se(e,n){if(w(e)!=="object"||e===null)return e;var t=e[Symbol.toPrimitive];if(t!==void 0){var r=t.call(e,n||"default");if(w(r)!=="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(e)}function Ce(e){var n=Se(e,"string");return w(n)==="symbol"?n:String(n)}function we(e,n,t){return n=Ce(n),n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function Ie(e){if(Array.isArray(e))return e}function ke(e,n){var t=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(t!=null){var r,a,I,g,u=[],v=!0,d=!1;try{if(I=(t=t.call(e)).next,n===0){if(Object(t)!==t)return;v=!1}else for(;!(v=(r=I.call(t)).done)&&(u.push(r.value),u.length!==n);v=!0);}catch(m){d=!0,a=m}finally{try{if(!v&&t.return!=null&&(g=t.return(),Object(g)!==g))return}finally{if(d)throw a}}return u}}function z(e,n){(n==null||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}function je(e,n){if(e){if(typeof e=="string")return z(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);if(t==="Object"&&e.constructor&&(t=e.constructor.name),t==="Map"||t==="Set")return Array.from(e);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return z(e,n)}}function Te(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function M(e,n){return Ie(e)||ke(e,n)||je(e,n)||Te()}var _e={root:function(n){var t=n.props,r=n.context;return ie("p-overlaypanel p-component",t.className,{"p-input-filled":r&&r.inputStyle==="filled"||C.inputStyle==="filled","p-ripple-disabled":r&&r.ripple===!1||C.ripple===!1})},closeIcon:"p-overlaypanel-close-icon",closeButton:"p-overlaypanel-close p-link",content:"p-overlaypanel-content",transition:"p-overlaypanel"},Re=`
@layer primereact {
    .p-overlaypanel {
        position: absolute;
        margin-top: 10px;
        /* Github #3122: Prevent animation flickering  */
        top: -9999px;
        left: -9999px;
    }
    
    .p-overlaypanel-flipped {
        margin-top: 0;
        margin-bottom: 10px;
    }
    
    .p-overlaypanel-close {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        position: relative;
    }
    
    /* Animation */
    .p-overlaypanel-enter {
        opacity: 0;
        transform: scaleY(0.8);
    }
    
    .p-overlaypanel-enter-active {
        opacity: 1;
        transform: scaleY(1);
        transition: transform .12s cubic-bezier(0, 0, 0.2, 1), opacity .12s cubic-bezier(0, 0, 0.2, 1);
    }
    
    .p-overlaypanel-enter-done {
        transform: none;
    }
    
    .p-overlaypanel-exit {
        opacity: 1;
    }
    
    .p-overlaypanel-exit-active {
        opacity: 0;
        transition: opacity .1s linear;
    }
    
    .p-overlaypanel:after, .p-overlaypanel:before {
        bottom: 100%;
        left: calc(var(--overlayArrowLeft, 0) + 1.25rem);
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }
    
    .p-overlaypanel:after {
        border-width: 8px;
        margin-left: -8px;
    }
    
    .p-overlaypanel:before {
        border-width: 10px;
        margin-left: -10px;
    }
    
    .p-overlaypanel-flipped:after, .p-overlaypanel-flipped:before {
        bottom: auto;
        top: 100%;
    }
    
    .p-overlaypanel.p-overlaypanel-flipped:after {
        border-bottom-color: transparent;
    }
    
    .p-overlaypanel.p-overlaypanel-flipped:before {
        border-bottom-color: transparent
    }
}
`,S=pe.extend({defaultProps:{__TYPE:"OverlayPanel",id:null,dismissable:!0,showCloseIcon:!1,closeIcon:null,style:null,className:null,appendTo:null,breakpoints:null,ariaCloseLabel:null,transitionOptions:null,onShow:null,onHide:null,children:void 0,closeOnEscape:!0},css:{classes:_e,styles:Re}});function Y(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),t.push.apply(t,r)}return t}function Ae(e){for(var n=1;n<arguments.length;n++){var t=arguments[n]!=null?arguments[n]:{};n%2?Y(Object(t),!0).forEach(function(r){we(e,r,t[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):Y(Object(t)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))})}return e}var Le=s.forwardRef(function(e,n){var t=fe(),r=s.useContext(le),a=S.getProps(e,r),I=s.useState(!1),g=M(I,2),u=g[0],v=g[1],d=S.setMetaData({props:a,state:{visible:u}}),m=d.ptm,O=d.cx;d.sx;var _=d.isUnstyled;ye(S.css.styles,_,{name:"overlaypanel"});var R=s.useRef(""),l=s.useRef(null),p=s.useRef(null),h=s.useRef(!1),P=s.useRef(null),b=s.useRef(null),K=ve({target:p,overlay:l,listener:function(o,i){var f=i.type,x=i.valid;if(x)switch(f){case"outside":a.dismissable&&!h.current&&E();break;case"resize":case"scroll":case"orientationchange":k();break}h.current=!1},when:u}),H=M(K,2),Z=H[0],$=H[1],U=de("overlay-panel",u);me({callback:function(){E()},when:u&&a.closeOnEscape&&U,priority:[be.OVERLAY_PANEL,U]});var G=function(o){return l&&l.current&&!(l.current.isSameNode(o)||l.current.contains(o))},V=function(o,i){return p.current!=null&&p.current!==(i||o.currentTarget||o.target)},q=function(o){E(),o.preventDefault()},J=function(o){h.current=!0,j.emit("overlay-click",{originalEvent:o,target:p.current})},B=function(){h.current=!0},W=function(o,i){u?(E(),V(o,i)&&(p.current=i||o.currentTarget||o.target,setTimeout(function(){A(o,p.current)},200))):A(o,i)},A=function(o,i){p.current=i||o.currentTarget||o.target,u?k():(v(!0),b.current=function(f){!G(f.target)&&(h.current=!0)},j.on("overlay-click",b.current))},E=function(){v(!1),j.off("overlay-click",b.current),b.current=null},X=function(){l.current.setAttribute(R.current,""),D.set("overlay",l.current,r&&r.autoZIndex||C.autoZIndex,r&&r.zIndex.overlay||C.zIndex.overlay),y.addStyles(l.current,{position:"absolute",top:"0",left:"0"}),k()},F=function(){Z(),a.onShow&&a.onShow()},Q=function(){$()},ee=function(){D.clear(l.current),a.onHide&&a.onHide()},k=function(){if(p.current&&l.current){y.absolutePosition(l.current,p.current);var o=y.getOffset(l.current),i=y.getOffset(p.current),f=0;o.left<i.left&&(f=i.left-o.left),l.current.style.setProperty("--overlayArrowLeft","".concat(f,"px")),o.top<i.top?(l.current.setAttribute("data-p-overlaypanel-flipped","true"),_&&y.addClass(l.current,"p-overlaypanel-flipped")):(l.current.setAttribute("data-p-overlaypanel-flipped","false"),_&&y.removeClass(l.current,"p-overlaypanel-flipped"))}},ne=function(){if(!P.current){P.current=y.createInlineStyle(r&&r.nonce||C.nonce,r&&r.styleContainer);var o="";for(var i in a.breakpoints)o+=`
                    @media screen and (max-width: `.concat(i,`) {
                        .p-overlaypanel[`).concat(R.current,`] {
                            width: `).concat(a.breakpoints[i],`;
                        }
                    }
                `);P.current.innerHTML=o}};ge(function(){R.current=ce(),a.breakpoints&&ne()}),Oe(function(){P.current=y.removeInlineStyle(P.current),b.current&&(j.off("overlay-click",b.current),b.current=null),D.clear(l.current)}),s.useImperativeHandle(n,function(){return{props:a,toggle:W,show:A,hide:E,align:k,getElement:function(){return l.current}}});var te=function(){var o=t({className:O("closeIcon"),"aria-hidden":!0},m("closeIcon")),i=a.closeIcon||s.createElement(Ee,o),f=se.getJSXIcon(i,Ae({},o),{props:a}),x=a.ariaCloseLabel||ue("close"),L=t({type:"button",className:O("closeButton"),onClick:function(ae){return q(ae)},"aria-label":x},m("closeButton"));return a.showCloseIcon?s.createElement("button",L,f,s.createElement(he,null)):null},re=function(){var o=te(),i=t({id:a.id,className:O("root",{context:r}),style:a.style,onClick:function(N){return J(N)}},S.getOtherProps(a),m("root")),f=t({className:O("content"),onClick:function(N){return B()},onMouseDown:B},S.getOtherProps(a),m("content")),x=t({classNames:O("transition"),in:u,timeout:{enter:120,exit:100},options:a.transitionOptions,unmountOnExit:!0,onEnter:X,onEntered:F,onExit:Q,onExited:ee},m("transition"));return s.createElement(Pe,T({nodeRef:l},x),s.createElement("div",T({ref:l},i),s.createElement("div",f,a.children),o))},oe=re();return s.createElement(xe,{element:oe,appendTo:a.appendTo})});Le.displayName="OverlayPanel";export{Le as O};
