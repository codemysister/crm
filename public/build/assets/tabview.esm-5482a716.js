import{O as E,r as u,P as Et,e as L,D as p,U as xt,I as D,f as De}from"./app-183ca207.js";import{C as je,u as Ot,a as At,d as Nt,b as Be,R as G}from"./ripple.esm-4b355069.js";import{C as kt}from"./index.esm-d51fec0e.js";import{C as Dt}from"./index.esm-dca36cda.js";import{T as Bt}from"./index.esm-64ce51d8.js";function Z(n,t){(t==null||t>n.length)&&(t=n.length);for(var r=0,s=new Array(t);r<t;r++)s[r]=n[r];return s}function Rt(n){if(Array.isArray(n))return Z(n)}function _t(n){if(typeof Symbol<"u"&&n[Symbol.iterator]!=null||n["@@iterator"]!=null)return Array.from(n)}function He(n,t){if(n){if(typeof n=="string")return Z(n,t);var r=Object.prototype.toString.call(n).slice(8,-1);if(r==="Object"&&n.constructor&&(r=n.constructor.name),r==="Map"||r==="Set")return Array.from(n);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return Z(n,t)}}function jt(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Ht(n){return Rt(n)||_t(n)||He(n)||jt()}function R(n){"@babel/helpers - typeof";return R=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},R(n)}function Kt(n,t){if(R(n)!=="object"||n===null)return n;var r=n[Symbol.toPrimitive];if(r!==void 0){var s=r.call(n,t||"default");if(R(s)!=="object")return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(n)}function Ut(n){var t=Kt(n,"string");return R(t)==="symbol"?t:String(t)}function Ke(n,t,r){return t=Ut(t),t in n?Object.defineProperty(n,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[t]=r,n}function Lt(n){if(Array.isArray(n))return n}function $t(n,t){var r=n==null?null:typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"];if(r!=null){var s,l,b,y,d=[],P=!0,_=!1;try{if(b=(r=r.call(n)).next,t===0){if(Object(r)!==r)return;P=!1}else for(;!(P=(s=b.call(r)).done)&&(d.push(s.value),d.length!==t);P=!0);}catch(j){_=!0,l=j}finally{try{if(!P&&r.return!=null&&(y=r.return(),Object(y)!==y))return}finally{if(_)throw l}}return d}}function Vt(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function B(n,t){return Lt(n)||$t(n,t)||He(n,t)||Vt()}function Re(n,t){var r=Object.keys(n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(n);t&&(s=s.filter(function(l){return Object.getOwnPropertyDescriptor(n,l).enumerable})),r.push.apply(r,s)}return r}function $(n){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?Re(Object(r),!0).forEach(function(s){Ke(n,s,r[s])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(r)):Re(Object(r)).forEach(function(s){Object.defineProperty(n,s,Object.getOwnPropertyDescriptor(r,s))})}return n}var Wt={navcontent:"p-tabview-nav-content",nav:"p-tabview-nav",inkbar:"p-tabview-ink-bar",panelcontainer:function(t){var r=t.props;return L("p-tabview-panels",r.panelContainerClassName)},prevbutton:"p-tabview-nav-prev p-tabview-nav-btn p-link",nextbutton:"p-tabview-nav-next p-tabview-nav-btn p-link",root:function(t){var r=t.props;return L("p-tabview p-component",{"p-tabview-scrollable":r.scrollable},r.className)},navcontainer:"p-tabview-nav-container",tab:{header:function(t){var r=t.selected,s=t.disabled,l=t.headerClassName,b=t._className;return L("p-unselectable-text",{"p-tabview-selected p-highlight":r,"p-disabled":s},l,b)},headertitle:"p-tabview-title",headeraction:"p-tabview-nav-link",content:function(t){var r=t.props,s=t.selected,l=t.getTabProp,b=t.tab,y=t.isSelected,d=t.shouldUseTab,P=t.index;return d(b,P)&&(!r.renderActiveOnly||y(P))?L(l(b,"contentClassName"),l(b,"className"),"p-tabview-panel",{"p-hidden":!s}):void 0}}},Ft=`
@layer primereact {
    .p-tabview-nav-container {
        position: relative;
    }
    
    .p-tabview-scrollable .p-tabview-nav-container {
        overflow: hidden;
    }
    
    .p-tabview-nav-content {
        overflow-x: auto;
        overflow-y: hidden;
        scroll-behavior: smooth;
        scrollbar-width: none;
        overscroll-behavior: contain auto;
        position: relative;
    }
    
    .p-tabview-nav {
        display: flex;
        margin: 0;
        padding: 0;
        list-style-type: none;
        flex: 1 1 auto;
    }
    
    .p-tabview-nav-link {
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        position: relative;
        text-decoration: none;
        overflow: hidden;
    }
    
    .p-tabview-ink-bar {
        display: none;
        z-index: 1;
    }
    
    .p-tabview-nav-link:focus {
        z-index: 1;
    }
    
    .p-tabview-close {
        z-index: 1;
    }
    
    .p-tabview-title {
        line-height: 1;
        white-space: nowrap;
    }
    
    .p-tabview-nav-btn {
        position: absolute;
        top: 0;
        z-index: 2;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .p-tabview-nav-prev {
        left: 0;
    }
    
    .p-tabview-nav-next {
        right: 0;
    }
    
    .p-tabview-nav-content::-webkit-scrollbar {
        display: none;
    }
}
`,Jt={tab:{header:function(t){var r=t.headerStyle,s=t._style;return $($({},r||{}),s||{})},content:function(t){var r=t.props,s=t.getTabProp,l=t.tab,b=t.isSelected,y=t.shouldUseTab,d=t.index;return y(l,d)&&(!r.renderActiveOnly||b(d))?$($({},s(l,"contentStyle")||{}),s(l,"style")||{}):void 0}}},V=je.extend({defaultProps:{__TYPE:"TabView",id:null,activeIndex:0,className:null,onBeforeTabChange:null,onBeforeTabClose:null,onTabChange:null,onTabClose:null,panelContainerClassName:null,panelContainerStyle:null,renderActiveOnly:!0,scrollable:!1,style:null,children:void 0},css:{classes:Wt,styles:Ft,inlineStyles:Jt}}),x=je.extend({defaultProps:{__TYPE:"TabPanel",children:void 0,className:null,closable:!1,closeIcon:null,contentClassName:null,contentStyle:null,disabled:!1,header:null,headerClassName:null,headerStyle:null,headerTemplate:null,leftIcon:null,nextButton:null,prevButton:null,rightIcon:null,style:null,visible:!0},getCProp:function(t,r){return E.getComponentProp(t,r,x.defaultProps)},getCProps:function(t){return E.getComponentProps(t,x.defaultProps)},getCOtherProps:function(t){return E.getComponentDiffProps(t,x.defaultProps)}});function _e(n,t){var r=Object.keys(n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(n);t&&(s=s.filter(function(l){return Object.getOwnPropertyDescriptor(n,l).enumerable})),r.push.apply(r,s)}return r}function Q(n){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?_e(Object(r),!0).forEach(function(s){Ke(n,s,r[s])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(r)):_e(Object(r)).forEach(function(s){Object.defineProperty(n,s,Object.getOwnPropertyDescriptor(r,s))})}return n}var Mt=function(){},Xt=u.forwardRef(function(n,t){var r=Ot(),s=u.useContext(Et),l=V.getProps(n,s),b=u.useState(l.id),y=B(b,2),d=y[0],P=y[1],_=u.useState(!0),j=B(_,2),ee=j[0],te=j[1],Ue=u.useState(!1),ne=B(Ue,2),re=ne[0],ae=ne[1],Le=u.useState([]),oe=B(Le,2),T=oe[0],le=oe[1],$e=u.useState(l.activeIndex),ie=B($e,2),H=ie[0],ce=ie[1],se=u.useRef(null),g=u.useRef(null),K=u.useRef(null),W=u.useRef(null),ue=u.useRef(null),de=u.useRef(null),F=u.useRef({}),J=l.onTabChange?l.activeIndex:H,pe=u.Children.count(l.children),ve={props:l,state:{id:d,isPrevButtonDisabled:ee,isNextButtonDisabled:re,hiddenTabsState:T,activeIndex:H}},O=V.setMetaData(Q({},ve)),v=O.ptm,Ve=O.ptmo,m=O.cx,fe=O.sx,We=O.isUnstyled;At(V.css.styles,We,{name:"tabview"});var S=function(e,a,o){var i={props:e.props,parent:ve,context:{index:o,count:pe,first:o===0,last:o===pe-1,active:o==H,disabled:w(e,"disabled")}};return r(v("tab.".concat(a),{tab:i}),v("tabpanel.".concat(a),{tabpanel:i}),v("tabpanel.".concat(a),i),Ve(w(e,"pt"),a,i))},A=function(e){return e===J},w=function(e,a){return x.getCProp(e,a)},N=function(e){return e&&w(e,"visible")&&E.isValidChild(e,"TabPanel")&&T.every(function(a){return a!==e.key})},Fe=function(e){var a=u.Children.map(l.children,function(o,i){if(N(o))return{tab:o,index:i}});return a.find(function(o){var i=o.tab,h=o.index;return!w(i,"disabled")&&h>=e})||a.reverse().find(function(o){var i=o.tab,h=o.index;return!w(i,"disabled")&&e>h})},be=function(e,a){e.preventDefault();var o=l.onBeforeTabClose,i=l.onTabClose,h=l.children,C=h[a].key;o&&o({originalEvent:e,index:a})===!1||(le([].concat(Ht(T),[C])),i&&i({originalEvent:e,index:a}))},M=function(e,a,o){me(e,a,o)},me=function(e,a,o){if(e&&e.preventDefault(),!w(a,"disabled")){if(l.onBeforeTabChange&&l.onBeforeTabChange({originalEvent:e,index:o})===!1)return;l.onTabChange?l.onTabChange({originalEvent:e,index:o}):ce(o)}k({index:o})},he=function(e,a,o){switch(e.code){case"ArrowLeft":Me(e);break;case"ArrowRight":Je(e);break;case"Home":ye(e);break;case"End":ge(e);break;case"PageDown":Xe(e);break;case"PageUp":ze(e);break;case"Enter":case"Space":Ye(e,a,o);break}},Je=function(e){var a=we(e.target.parentElement);a?U(a):ye(e),e.preventDefault()},Me=function(e){var a=Pe(e.target.parentElement);a?U(a):ge(e),e.preventDefault()},ye=function(e){var a=qe();U(a),e.preventDefault()},ge=function(e){var a=Ge();U(a),e.preventDefault()},Xe=function(e){k({index:u.Children.count(l.children)-1}),e.preventDefault()},ze=function(e){k({index:0}),e.preventDefault()},Ye=function(e,a,o){me(e,a,o),e.preventDefault()},we=function c(e){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,o=a?e:e.nextElementSibling;return o?p.getAttribute(o,"data-p-disabled")||p.getAttribute(o,"data-pc-section")==="inkbar"?c(o):p.findSingle(o,'[data-pc-section="headeraction"]'):null},Pe=function c(e){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,o=a?e:e.previousElementSibling;return o?p.getAttribute(o,"data-p-disabled")||p.getAttribute(o,"data-pc-section")==="inkbar"?c(o):p.findSingle(o,'[data-pc-section="headeraction"]'):null},qe=function(){return we(K.current.firstElementChild,!0)},Ge=function(){return Pe(K.current.lastElementChild,!0)},U=function(e){e&&(p.focus(e),k({element:e}))},Qe=function(){var e=F.current["tab_".concat(J)];W.current.style.width=p.getWidth(e)+"px",W.current.style.left=p.getOffset(e).left-p.getOffset(K.current).left+"px"},k=function(e){var a=e.index,o=e.element,i=o||F.current["tab_".concat(a)];i&&i.scrollIntoView&&i.scrollIntoView({block:"nearest"})},Te=function(){var e=g.current,a=e.scrollLeft,o=e.scrollWidth,i=p.getWidth(g.current);te(a===0),ae(a===o-i)},Ze=function(e){l.scrollable&&Te(),e.preventDefault()},Ce=function(){return[ue.current,de.current].reduce(function(e,a){return a?e+p.getWidth(a):e},0)},et=function(){var e=p.getWidth(g.current)-Ce(),a=g.current.scrollLeft-e;g.current.scrollLeft=a<=0?0:a},tt=function(){var e=p.getWidth(g.current)-Ce(),a=g.current.scrollLeft+e,o=g.current.scrollWidth-e;g.current.scrollLeft=a>=o?o:a},nt=function(){te(!0),ae(!1),le([]),l.onTabChange?l.onTabChange({index:J}):ce(l.activeIndex)};u.useEffect(function(){Qe(),Te()}),Nt(function(){d||P(xt())}),Be(function(){if(E.isNotEmpty(T)){var c=Fe(T[T.length-1]);c&&M(null,c.tab,c.index)}},[T]),Be(function(){l.activeIndex!==H&&k({index:l.activeIndex})},[l.activeIndex]),u.useImperativeHandle(t,function(){return{props:l,reset:nt,getElement:function(){return se.current}}});var rt=function(e,a){var o=A(a),i=x.getCProps(e),h=i.headerStyle,C=i.headerClassName,X=i.style,z=i.className,Y=i.disabled,Se=i.leftIcon,Ie=i.rightIcon,bt=i.header,Ee=i.headerTemplate,mt=i.closable,ht=i.closeIcon,yt=d+"_header_"+a,xe=d+a+"_content",gt=Y||!o?-1:0,Oe=Se&&D.getJSXIcon(Se,void 0,{props:l}),wt=r({className:m("tab.headertitle")},S(e,"headertitle",a)),Ae=u.createElement("span",wt,bt),Ne=Ie&&D.getJSXIcon(Ie,void 0,{props:l}),ke="p-tabview-close",Pt=ht||u.createElement(Bt,{className:ke,onClick:function(f){return be(f,a)}}),Tt=mt?D.getJSXIcon(Pt,{className:ke,onClick:function(f){return be(f,a)}},{props:l}):null,Ct=r({id:yt,role:"tab",className:m("tab.headeraction"),tabIndex:gt,"aria-controls":xe,"aria-selected":o,"aria-disabled":Y,onClick:function(f){return M(f,e,a)},onKeyDown:function(f){return he(f,e,a)}},S(e,"headeraction",a)),q=u.createElement("a",Ct,Oe,Ae,Ne,Tt,u.createElement(G,null));if(Ee){var St={className:"p-tabview-nav-link",titleClassName:"p-tabview-title",onClick:function(f){return M(f,e,a)},onKeyDown:function(f){return he(f,e,a)},leftIconElement:Oe,titleElement:Ae,rightIconElement:Ne,element:q,props:l,index:a,selected:o,ariaControls:xe};q=E.getJSXElement(Ee,St)}var It=r({ref:function(f){return F.current["tab_".concat(a)]=f},className:m("tab.header",{selected:o,disabled:Y,headerClassName:C,_className:z}),style:fe("tab.header",{headerStyle:h,_style:X}),role:"presentation"},S(e,"root",a),S(e,"header",a));return u.createElement("li",It,q)},at=function(){return u.Children.map(l.children,function(e,a){if(N(e))return rt(e,a)})},ot=function(){var e=at(),a=r({id:d,ref:g,className:m("navcontent"),style:l.style,onScroll:Ze},v("navcontent")),o=r({ref:K,className:m("nav"),role:"tablist"},v("nav")),i=r({ref:W,"aria-hidden":"true",role:"presentation",className:m("inkbar")},v("inkbar"));return u.createElement("div",a,u.createElement("ul",o,e,u.createElement("li",i)))},lt=function(){var e=r({className:m("panelcontainer"),style:l.panelContainerStyle},v("panelcontainer")),a=u.Children.map(l.children,function(o,i){if(N(o)&&(!l.renderActiveOnly||A(i))){var h=A(i),C=d+i+"_content",X=d+"_header_"+i,z=r({id:C,className:m("tab.content",{props:l,selected:h,getTabProp:w,tab:o,isSelected:A,shouldUseTab:N,index:i}),style:fe("tab.content",{props:l,getTabProp:w,tab:o,isSelected:A,shouldUseTab:N,index:i}),role:"tabpanel","aria-labelledby":X},x.getCOtherProps(o),S(o,"root",i),S(o,"content",i));return u.createElement("div",z,l.renderActiveOnly?h&&w(o,"children"):w(o,"children"))}});return u.createElement("div",e,a)},it=function(){var e=r({"aria-hidden":"true"},v("previcon")),a=l.prevButton||u.createElement(kt,e),o=D.getJSXIcon(a,Q({},e),{props:l}),i=r({ref:ue,type:"button",className:m("prevbutton"),"aria-label":De("previousPageLabel"),onClick:function(C){return et()}},v("prevbutton"));return l.scrollable&&!ee?u.createElement("button",i,o,u.createElement(G,null)):null},ct=function(){var e=r({"aria-hidden":"true"},v("nexticon")),a=l.nextButton||u.createElement(Dt,e),o=D.getJSXIcon(a,Q({},e),{props:l}),i=r({ref:de,type:"button",className:m("nextbutton"),"aria-label":De("nextPageLabel"),onClick:function(C){return tt()}},v("nextbutton"));if(l.scrollable&&!re)return u.createElement("button",i,o,u.createElement(G,null))},st=r({id:d,ref:se,style:l.style,className:m("root")},V.getOtherProps(l),v("root")),ut=r({className:m("navcontainer")},v("navcontainer")),dt=ot(),pt=lt(),vt=it(),ft=ct();return u.createElement("div",st,u.createElement("div",ut,vt,dt,ft),pt)});Mt.displayName="TabPanel";Xt.displayName="TabView";export{Xt as T,Mt as a};
