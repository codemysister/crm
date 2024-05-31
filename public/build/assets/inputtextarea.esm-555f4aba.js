import{r as i,P as _,O as u,e as T,D as v}from"./app-183ca207.js";import{C as H,u as N,a as U}from"./ripple.esm-4b355069.js";import{K as b}from"./inputtext.esm-0c7f541c.js";import{T as C}from"./button.esm-d3cd2157.js";function g(){return g=Object.assign?Object.assign.bind():function(n){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(n[o]=r[o])}return n},g.apply(this,arguments)}function c(n){"@babel/helpers - typeof";return c=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},c(n)}function M(n,t){if(c(n)!=="object"||n===null)return n;var r=n[Symbol.toPrimitive];if(r!==void 0){var o=r.call(n,t||"default");if(c(o)!=="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(n)}function k(n){var t=M(n,"string");return c(t)==="symbol"?t:String(t)}function V(n,t,r){return t=k(t),t in n?Object.defineProperty(n,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[t]=r,n}var Y={root:function(t){var r=t.props,o=t.isFilled;return T("p-inputtextarea p-inputtext p-component",{"p-disabled":r.disabled,"p-filled":o,"p-inputtextarea-resizable":r.autoResize},r.className)}},$=`
@layer primereact {
    .p-inputtextarea-resizable {
        overflow: hidden;
        resize: none;
    }
    
    .p-fluid .p-inputtextarea {
        width: 100%;
    }
}
`,m=H.extend({defaultProps:{__TYPE:"InputTextarea",__parentMetadata:null,autoResize:!1,keyfilter:null,onBlur:null,onFocus:null,onBeforeInput:null,onInput:null,onKeyDown:null,onKeyUp:null,onPaste:null,tooltip:null,tooltipOptions:null,validateOnly:!1,children:void 0},css:{classes:Y,styles:$}});function h(n,t){var r=Object.keys(n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(n);t&&(o=o.filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})),r.push.apply(r,o)}return r}function O(n){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?h(Object(r),!0).forEach(function(o){V(n,o,r[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(r)):h(Object(r)).forEach(function(o){Object.defineProperty(n,o,Object.getOwnPropertyDescriptor(r,o))})}return n}var q=i.memo(i.forwardRef(function(n,t){var r=N(),o=i.useContext(_),e=m.getProps(n,o),p=i.useRef(t),y=i.useRef(0),d=m.setMetaData(O(O({props:e},e.__parentMetadata),{},{context:{disabled:e.disabled}})),P=d.ptm,x=d.cx,w=d.isUnstyled;U(m.css.styles,w,{name:"inputtextarea"});var I=function(l){e.autoResize&&f(),e.onFocus&&e.onFocus(l)},K=function(l){e.autoResize&&f(),e.onBlur&&e.onBlur(l)},j=function(l){e.autoResize&&f(),e.onKeyUp&&e.onKeyUp(l)},B=function(l){e.onKeyDown&&e.onKeyDown(l),e.keyfilter&&b.onKeyPress(l,e.keyfilter,e.validateOnly)},E=function(l){e.onBeforeInput&&e.onBeforeInput(l),e.keyfilter&&b.onBeforeInput(l,e.keyfilter,e.validateOnly)},F=function(l){e.onPaste&&e.onPaste(l),e.keyfilter&&b.onPaste(l,e.keyfilter,e.validateOnly)},R=function(l){var a=l.target;e.autoResize&&f(u.isEmpty(a.value)),e.onInput&&e.onInput(l),u.isNotEmpty(a.value)?v.addClass(a,"p-filled"):v.removeClass(a,"p-filled")},f=function(l){var a=p.current;a&&v.isVisible(a)&&(y.current||(y.current=a.scrollHeight,a.style.overflow="hidden"),(y.current!==a.scrollHeight||l)&&(a.style.height="",a.style.height=a.scrollHeight+"px",parseFloat(a.style.height)>=parseFloat(a.style.maxHeight)?(a.style.overflowY="scroll",a.style.height=a.style.maxHeight):a.style.overflow="hidden",y.current=a.scrollHeight))};i.useEffect(function(){u.combinedRefs(p,t)},[p,t]),i.useEffect(function(){e.autoResize&&f(!0)},[e.autoResize]);var z=i.useMemo(function(){return u.isNotEmpty(e.value)||u.isNotEmpty(e.defaultValue)},[e.value,e.defaultValue]),D=u.isNotEmpty(e.tooltip),S=r({ref:p,className:x("root",{isFilled:z}),onFocus:I,onBlur:K,onKeyUp:j,onKeyDown:B,onBeforeInput:E,onInput:R,onPaste:F},m.getOtherProps(e),P("root"));return i.createElement(i.Fragment,null,i.createElement("textarea",S),D&&i.createElement(C,g({target:p,content:e.tooltip,pt:P("tooltip")},e.tooltipOptions)))}));q.displayName="InputTextarea";export{q as I};
