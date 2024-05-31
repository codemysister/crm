import{e as b,r as a,P as S,O as g,I}from"./app-183ca207.js";import{C,u as M,a as _}from"./ripple.esm-4b355069.js";import{C as N}from"./index.esm-9ef49f43.js";import{T as D,E as T,I as R}from"./index.esm-c27cbd20.js";function f(){return f=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},f.apply(this,arguments)}function l(t){"@babel/helpers - typeof";return l=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l(t)}function U(t,e){if(l(t)!=="object"||t===null)return t;var n=t[Symbol.toPrimitive];if(n!==void 0){var r=n.call(t,e||"default");if(l(r)!=="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(t)}function B(t){var e=U(t,"string");return l(e)==="symbol"?e:String(e)}function J(t,e,n){return e=B(e),e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var c=C.extend({defaultProps:{__TYPE:"Message",id:null,className:null,style:null,text:null,icon:null,severity:"info",content:null,children:void 0},css:{classes:{root:function(e){var n=e.props;return b("p-inline-message p-component",{"p-inline-message-info":n.severity==="info","p-inline-message-warn":n.severity==="warn","p-inline-message-error":n.severity==="error","p-inline-message-success":n.severity==="success","p-inline-message-icon-only":!n.text})},icon:"p-inline-message-icon",text:"p-inline-message-text"},styles:`
        @layer primereact {
            .p-inline-message {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                vertical-align: top;
            }

            .p-inline-message-icon {
                flex-shrink: 0;
            }
            
            .p-inline-message-icon-only .p-inline-message-text {
                visibility: hidden;
                width: 0;
            }
            
            .p-fluid .p-inline-message {
                display: flex;
            }        
        }
        `}});function v(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(s){return Object.getOwnPropertyDescriptor(t,s).enumerable})),n.push.apply(n,r)}return n}function X(t){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?v(Object(n),!0).forEach(function(r){J(t,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):v(Object(n)).forEach(function(r){Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(n,r))})}return t}var k=a.memo(a.forwardRef(function(t,e){var n=M(),r=a.useContext(S),s=c.getProps(t,r),y=a.useRef(null),p=c.setMetaData({props:s}),m=p.ptm,u=p.cx,d=p.isUnstyled;_(c.css.styles,d,{name:"message"});var P=function(){if(s.content)return g.getJSXElement(s.content,s);var j=g.getJSXElement(s.text,s),o=n({className:u("icon")},m("icon")),i=s.icon;if(!i)switch(s.severity){case"info":i=a.createElement(R,o);break;case"warn":i=a.createElement(T,o);break;case"error":i=a.createElement(D,o);break;case"success":i=a.createElement(N,o);break}var w=I.getJSXIcon(i,X({},o),{props:s}),h=n({className:u("text")},m("text"));return a.createElement(a.Fragment,null,w,a.createElement("span",h,j))};a.useImperativeHandle(e,function(){return{props:s,getElement:function(){return y.current}}});var O=P(),x=n({className:b(s.className,u("root")),style:s.style,role:"alert","aria-live":"polite","aria-atomic":"true"},c.getOtherProps(s),m("root"));return a.createElement("div",f({id:s.id,ref:y},x),O)}));k.displayName="Message";export{k as M};
