import{r as c,P as Ce,l as oe,D as j,e as C,g as D,O as h,Z as X,I as xe}from"./app-183ca207.js";import{B as ae}from"./button.esm-d3cd2157.js";import{C as we,u as Ne,a as Re,m as Ie,n as _e,f as Be,b as Le,e as Ae,E as Te}from"./ripple.esm-4b355069.js";import{C as ce}from"./csstransition.esm-03d4c013.js";import{O as P}from"./dropdown.esm-0caba294.js";import{P as Ve}from"./portal.esm-545bb246.js";function H(){return H=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var t=arguments[r];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},H.apply(this,arguments)}function ke(e){if(Array.isArray(e))return e}function De(e,r){var t=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(t!=null){var o,l,w,E,f=[],y=!0,N=!1;try{if(w=(t=t.call(e)).next,r===0){if(Object(t)!==t)return;y=!1}else for(;!(y=(o=w.call(t)).done)&&(f.push(o.value),f.length!==r);y=!0);}catch(R){N=!0,l=R}finally{try{if(!y&&t.return!=null&&(E=t.return(),Object(E)!==E))return}finally{if(N)throw l}}return f}}function le(e,r){(r==null||r>e.length)&&(r=e.length);for(var t=0,o=new Array(r);t<r;t++)o[t]=e[t];return o}function He(e,r){if(e){if(typeof e=="string")return le(e,r);var t=Object.prototype.toString.call(e).slice(8,-1);if(t==="Object"&&e.constructor&&(t=e.constructor.name),t==="Map"||t==="Set")return Array.from(e);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return le(e,r)}}function Ue(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Z(e,r){return ke(e)||De(e,r)||He(e,r)||Ue()}function x(e){"@babel/helpers - typeof";return x=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(r){return typeof r}:function(r){return r&&typeof Symbol=="function"&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},x(e)}function Fe(e,r){if(x(e)!=="object"||e===null)return e;var t=e[Symbol.toPrimitive];if(t!==void 0){var o=t.call(e,r||"default");if(x(o)!=="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(r==="string"?String:Number)(e)}function Ke(e){var r=Fe(e,"string");return x(r)==="symbol"?r:String(r)}function $e(e,r,t){return r=Ke(r),r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}var Je=`
@layer primereact {
    .p-confirm-popup-flipped {
        margin-top: 0;
        margin-bottom: 10px;
    }
    
    .p-confirm-popup:after, .p-confirm-popup:before {
        bottom: 100%;
        left: calc(var(--overlayArrowLeft, 0) + 1.25rem);
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }
    
    .p-confirm-popup:after {
        border-width: 8px;
        margin-left: -8px;
    }
    
    .p-confirm-popup:before {
        border-width: 10px;
        margin-left: -10px;
    }
    
    .p-confirm-popup-flipped:after, .p-confirm-popup-flipped:before {
        bottom: auto;
        top: 100%;
    }
    
    .p-confirm-popup.p-confirm-popup-flipped:after {
        border-bottom-color: transparent;
    }
    
    .p-confirm-popup.p-confirm-popup-flipped:before {
        border-bottom-color: transparent
    }
    
    .p-confirm-popup .p-confirm-popup-content {
        display: flex;
        align-items: center;
    }
}
`,Me={root:function(r){var t=r.context,o=r.getPropValue;return C("p-confirm-popup p-component",o("className"),{"p-input-filled":t&&t.inputStyle==="filled"||D.inputStyle==="filled","p-ripple-disabled":t&&t.ripple===!1||D.ripple===!1})},acceptButton:function(r){var t=r.getPropValue;return C("p-confirm-popup-accept p-button-sm",t("acceptClassName"))},rejectButton:function(r){var t=r.getPropValue;return C("p-confirm-popup-reject p-button-sm",{"p-button-text":!t("rejectClassName")},t("rejectClassName"))},content:"p-confirm-popup-content",icon:"p-confirm-popup-icon",message:"p-confirm-popup-message",footer:"p-confirm-popup-footer",transition:"p-connected-overlay"},k=we.extend({defaultProps:{__TYPE:"ConfirmPopup",accept:null,acceptClassName:null,acceptIcon:null,acceptLabel:null,appendTo:null,children:void 0,className:null,closeOnEscape:!0,defaultFocus:"accept",dismissable:!0,footer:null,icon:null,message:null,onHide:null,onShow:null,reject:null,rejectClassName:null,rejectIcon:null,rejectLabel:null,style:null,tagKey:void 0,target:null,transitionOptions:null,visible:!1},css:{classes:Me,styles:Je}});function ie(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter(function(l){return Object.getOwnPropertyDescriptor(e,l).enumerable})),t.push.apply(t,o)}return t}function Xe(e){for(var r=1;r<arguments.length;r++){var t=arguments[r]!=null?arguments[r]:{};r%2?ie(Object(t),!0).forEach(function(o){$e(e,o,t[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ie(Object(t)).forEach(function(o){Object.defineProperty(e,o,Object.getOwnPropertyDescriptor(t,o))})}return e}var Ze=c.memo(c.forwardRef(function(e,r){var t=Ne(),o=c.useContext(Ce),l=k.getProps(e,o),w=c.useState(l.visible),E=Z(w,2),f=E[0],y=E[1],N=c.useState(!1),R=Z(N,2),U=R[0],G=R[1],F={props:l,state:{visible:f,reshow:U}},K=k.setMetaData(F),d=K.ptm,b=K.cx,z=K.isUnstyled;Re(k.css.styles,z,{name:"confirmpopup"});var u=c.useRef(null),I=c.useRef(null),_=c.useRef(null),O=c.useRef(!1),g=c.useRef(null),B=c.useRef(null),$=c.useRef(null),S=c.useRef(!1),L=function(){return B.current||l},a=function(n){return(B.current||l)[n]},A=function(n){for(var i=arguments.length,p=new Array(i>1?i-1:0),m=1;m<i;m++)p[m-1]=arguments[m];return h.getPropValue(a(n),p)},Y=a("acceptLabel")||oe("accept"),W=a("rejectLabel")||oe("reject"),q=Ie("dialog",f);_e({callback:function(){l.dismissable&&l.closeOnEscape&&v("hide")},when:f&&q,priority:[Te.DIALOG,q]});var se=Be({target:a("target"),overlay:u,listener:function(n,i){var p=i.type,m=i.valid;m&&(p==="outside"?l.dismissable&&!O.current&&v("hide"):v("hide")),O.current=!1},when:f}),Q=Z(se,2),ue=Q[0],pe=Q[1],fe=function(n){O.current=!0,P.emit("overlay-click",{originalEvent:n,target:a("target")})},ee=function(){S.current||(S.current=!0,A("accept"),v("accept"))},te=function(){S.current||(S.current=!0,A("reject"),v("reject"))},J=function(){var n=L();G(!1),n.group===l.group&&(y(!0),S.current=!1,g.current=function(i){!ge(i.target)&&(O.current=!0)},P.on("overlay-click",g.current),$.current=document.activeElement)},v=function(n){y(!1),P.off("overlay-click",g.current),g.current=null,n&&A("onHide",n),j.focus($.current),$.current=null},me=function(){X.set("overlay",u.current,o&&o.autoZIndex||D.autoZIndex,o&&o.zIndex.overlay||D.zIndex.overlay),j.addStyles(u.current,{position:"absolute",top:"50%",left:"50%",marginTop:"10px"}),ye()},ve=function(){ue();var n=a("defaultFocus");(n===void 0||n==="accept")&&I.current&&I.current.focus(),n==="reject"&&_.current&&_.current.focus(),A("onShow")},de=function(){pe()},be=function(){X.clear(u.current),O.current=!1},ye=function(){if(a("target")){j.absolutePosition(u.current,a("target"));var n=j.getOffset(u.current),i=j.getOffset(a("target")),p=0;n.left<i.left&&(p=i.left-n.left),u.current.style.setProperty("--overlayArrowLeft","".concat(p,"px")),n.top<i.top&&!z()&&j.addClass(u.current,"p-confirm-popup-flipped")}},ge=function(n){return u&&u.current&&!(u.current.isSameNode(n)||u.current.contains(n))},T=function(n){if(n.tagKey===l.tagKey){var i=f!==n.visible,p=a("target")!==n.target;p&&!l.target?(v(),B.current=n,G(!0)):i&&(B.current=n,n.visible?J():v())}};c.useEffect(function(){l.visible?J():v()},[l.visible]),c.useEffect(function(){return!l.target&&!l.message&&P.on("confirm-popup",T),function(){P.off("confirm-popup",T)}},[l.target]),Le(function(){U&&J()},[U]),Ae(function(){g.current&&(P.off("overlay-click",g.current),g.current=null),P.off("confirm-popup",T),X.clear(u.current)}),c.useImperativeHandle(r,function(){return{props:l,confirm:T}});var Pe=function(){var n=L(),i=h.getJSXElement(a("message"),n),p=t({className:b("icon")},d("icon")),m=xe.getJSXIcon(a("icon"),Xe({},p),{props:n}),M=t({className:b("message")},d("message")),V=t({className:b("content")},d("content"));return c.createElement("div",V,m,c.createElement("span",M,i))},Ee=function(){var n=C("p-confirm-popup-accept p-button-sm",a("acceptClassName")),i=C("p-confirm-popup-reject p-button-sm",{"p-button-text":!a("rejectClassName")},a("rejectClassName")),p=t({className:b("footer")},d("footer")),m=t({ref:_,label:W,icon:a("rejectIcon"),className:b("rejectButton",{getPropValue:a}),onClick:te,pt:d("rejectButton"),unstyled:l.unstyled,__parentMetadata:{parent:F}}),M=t({ref:I,label:Y,icon:a("acceptIcon"),className:b("acceptButton",{getPropValue:a}),onClick:ee,pt:d("acceptButton"),unstyled:l.unstyled,__parentMetadata:{parent:F}}),V=c.createElement("div",p,c.createElement(ae,m),c.createElement(ae,M));if(a("footer")){var he={accept:ee,reject:te,className:"p-confirm-popup-footer",acceptClassName:n,rejectClassName:i,acceptLabel:Y,rejectLabel:W,element:V,props:L()};return h.getJSXElement(a("footer"),he)}return V},re=t({ref:u,id:a("id"),className:b("root",{context:o,getPropValue:a}),style:a("style"),onClick:fe},k.getOtherProps(l),d("root")),ne=t({classNames:b("transition"),in:f,timeout:{enter:120,exit:100},options:a("transitionOptions"),unmountOnExit:!0,onEnter:me,onEntered:ve,onExit:de,onExited:be},d("transition")),je=function(){var n=L(),i=h.getJSXElement(a("message"),n),p={message:i,acceptBtnRef:I,rejectBtnRef:_,hide:v};return c.createElement(ce,H({nodeRef:u},ne),c.createElement("div",re,h.getJSXElement(e.content,p)))},Oe=function(){var n=Pe(),i=Ee();return c.createElement(ce,H({nodeRef:u},ne),c.createElement("div",re,n,i))},Se=e!=null&&e.content?je():Oe();return c.createElement(Ve,{element:Se,appendTo:a("appendTo"),visible:a("visible")})}));Ze.displayName="ConfirmPopup";export{Ze as C};