import{R as g,o as O,r as P,P as G,g as X,O as D}from"./app-183ca207.js";import{b as V}from"./ripple.esm-4b355069.js";import{_ as A,b as M,a as W}from"./inheritsLoose-2f6bfe9f.js";function F(r,s){return r.classList?!!s&&r.classList.contains(s):(" "+(r.className.baseVal||r.className)+" ").indexOf(" "+s+" ")!==-1}function K(r,s){r.classList?r.classList.add(s):F(r,s)||(typeof r.className=="string"?r.className=r.className+" "+s:r.setAttribute("class",(r.className&&r.className.baseVal||"")+" "+s))}function j(r,s){return r.replace(new RegExp("(^|\\s)"+s+"(?:\\s|$)","g"),"$1").replace(/\s+/g," ").replace(/^\s*|\s*$/g,"")}function B(r,s){r.classList?r.classList.remove(s):typeof r.className=="string"?r.className=j(r.className,s):r.setAttribute("class",j(r.className&&r.className.baseVal||"",s))}const L={disabled:!1},U=g.createContext(null);var I=function(s){return s.scrollTop},S="unmounted",m="exited",h="entering",b="entered",_="exiting",v=function(r){A(s,r);function s(t,o){var n;n=r.call(this,t,o)||this;var a=o,i=a&&!a.isMounting?t.enter:t.appear,u;return n.appearStatus=null,t.in?i?(u=m,n.appearStatus=h):u=b:t.unmountOnExit||t.mountOnEnter?u=S:u=m,n.state={status:u},n.nextCallback=null,n}s.getDerivedStateFromProps=function(o,n){var a=o.in;return a&&n.status===S?{status:m}:null};var e=s.prototype;return e.componentDidMount=function(){this.updateStatus(!0,this.appearStatus)},e.componentDidUpdate=function(o){var n=null;if(o!==this.props){var a=this.state.status;this.props.in?a!==h&&a!==b&&(n=h):(a===h||a===b)&&(n=_)}this.updateStatus(!1,n)},e.componentWillUnmount=function(){this.cancelNextCallback()},e.getTimeouts=function(){var o=this.props.timeout,n,a,i;return n=a=i=o,o!=null&&typeof o!="number"&&(n=o.exit,a=o.enter,i=o.appear!==void 0?o.appear:a),{exit:n,enter:a,appear:i}},e.updateStatus=function(o,n){if(o===void 0&&(o=!1),n!==null)if(this.cancelNextCallback(),n===h){if(this.props.unmountOnExit||this.props.mountOnEnter){var a=this.props.nodeRef?this.props.nodeRef.current:O.findDOMNode(this);a&&I(a)}this.performEnter(o)}else this.performExit();else this.props.unmountOnExit&&this.state.status===m&&this.setState({status:S})},e.performEnter=function(o){var n=this,a=this.props.enter,i=this.context?this.context.isMounting:o,u=this.props.nodeRef?[i]:[O.findDOMNode(this),i],p=u[0],l=u[1],c=this.getTimeouts(),E=i?c.appear:c.enter;if(!o&&!a||L.disabled){this.safeSetState({status:b},function(){n.props.onEntered(p)});return}this.props.onEnter(p,l),this.safeSetState({status:h},function(){n.props.onEntering(p,l),n.onTransitionEnd(E,function(){n.safeSetState({status:b},function(){n.props.onEntered(p,l)})})})},e.performExit=function(){var o=this,n=this.props.exit,a=this.getTimeouts(),i=this.props.nodeRef?void 0:O.findDOMNode(this);if(!n||L.disabled){this.safeSetState({status:m},function(){o.props.onExited(i)});return}this.props.onExit(i),this.safeSetState({status:_},function(){o.props.onExiting(i),o.onTransitionEnd(a.exit,function(){o.safeSetState({status:m},function(){o.props.onExited(i)})})})},e.cancelNextCallback=function(){this.nextCallback!==null&&(this.nextCallback.cancel(),this.nextCallback=null)},e.safeSetState=function(o,n){n=this.setNextCallback(n),this.setState(o,n)},e.setNextCallback=function(o){var n=this,a=!0;return this.nextCallback=function(i){a&&(a=!1,n.nextCallback=null,o(i))},this.nextCallback.cancel=function(){a=!1},this.nextCallback},e.onTransitionEnd=function(o,n){this.setNextCallback(n);var a=this.props.nodeRef?this.props.nodeRef.current:O.findDOMNode(this),i=o==null&&!this.props.addEndListener;if(!a||i){setTimeout(this.nextCallback,0);return}if(this.props.addEndListener){var u=this.props.nodeRef?[this.nextCallback]:[a,this.nextCallback],p=u[0],l=u[1];this.props.addEndListener(p,l)}o!=null&&setTimeout(this.nextCallback,o)},e.render=function(){var o=this.state.status;if(o===S)return null;var n=this.props,a=n.children;n.in,n.mountOnEnter,n.unmountOnExit,n.appear,n.enter,n.exit,n.timeout,n.addEndListener,n.onEnter,n.onEntering,n.onEntered,n.onExit,n.onExiting,n.onExited,n.nodeRef;var i=M(n,["children","in","mountOnEnter","unmountOnExit","appear","enter","exit","timeout","addEndListener","onEnter","onEntering","onEntered","onExit","onExiting","onExited","nodeRef"]);return g.createElement(U.Provider,{value:null},typeof a=="function"?a(o,i):g.cloneElement(g.Children.only(a),i))},s}(g.Component);v.contextType=U;v.propTypes={};function C(){}v.defaultProps={in:!1,mountOnEnter:!1,unmountOnExit:!1,appear:!1,enter:!0,exit:!0,onEnter:C,onEntering:C,onEntered:C,onExit:C,onExiting:C,onExited:C};v.UNMOUNTED=S;v.EXITED=m;v.ENTERING=h;v.ENTERED=b;v.EXITING=_;const H=v;var Y=function(s,e){return s&&e&&e.split(" ").forEach(function(t){return K(s,t)})},y=function(s,e){return s&&e&&e.split(" ").forEach(function(t){return B(s,t)})},w=function(r){A(s,r);function s(){for(var t,o=arguments.length,n=new Array(o),a=0;a<o;a++)n[a]=arguments[a];return t=r.call.apply(r,[this].concat(n))||this,t.appliedClasses={appear:{},enter:{},exit:{}},t.onEnter=function(i,u){var p=t.resolveArguments(i,u),l=p[0],c=p[1];t.removeClasses(l,"exit"),t.addClass(l,c?"appear":"enter","base"),t.props.onEnter&&t.props.onEnter(i,u)},t.onEntering=function(i,u){var p=t.resolveArguments(i,u),l=p[0],c=p[1],E=c?"appear":"enter";t.addClass(l,E,"active"),t.props.onEntering&&t.props.onEntering(i,u)},t.onEntered=function(i,u){var p=t.resolveArguments(i,u),l=p[0],c=p[1],E=c?"appear":"enter";t.removeClasses(l,E),t.addClass(l,E,"done"),t.props.onEntered&&t.props.onEntered(i,u)},t.onExit=function(i){var u=t.resolveArguments(i),p=u[0];t.removeClasses(p,"appear"),t.removeClasses(p,"enter"),t.addClass(p,"exit","base"),t.props.onExit&&t.props.onExit(i)},t.onExiting=function(i){var u=t.resolveArguments(i),p=u[0];t.addClass(p,"exit","active"),t.props.onExiting&&t.props.onExiting(i)},t.onExited=function(i){var u=t.resolveArguments(i),p=u[0];t.removeClasses(p,"exit"),t.addClass(p,"exit","done"),t.props.onExited&&t.props.onExited(i)},t.resolveArguments=function(i,u){return t.props.nodeRef?[t.props.nodeRef.current,i]:[i,u]},t.getClassNames=function(i){var u=t.props.classNames,p=typeof u=="string",l=p&&u?u+"-":"",c=p?""+l+i:u[i],E=p?c+"-active":u[i+"Active"],T=p?c+"-done":u[i+"Done"];return{baseClassName:c,activeClassName:E,doneClassName:T}},t}var e=s.prototype;return e.addClass=function(o,n,a){var i=this.getClassNames(n)[a+"ClassName"],u=this.getClassNames("enter"),p=u.doneClassName;n==="appear"&&a==="done"&&p&&(i+=" "+p),a==="active"&&o&&I(o),i&&(this.appliedClasses[n][a]=i,Y(o,i))},e.removeClasses=function(o,n){var a=this.appliedClasses[n],i=a.base,u=a.active,p=a.done;this.appliedClasses[n]={},i&&y(o,i),u&&y(o,u),p&&y(o,p)},e.render=function(){var o=this.props;o.classNames;var n=M(o,["classNames"]);return g.createElement(H,W({},n,{onEnter:this.onEnter,onEntered:this.onEntered,onEntering:this.onEntering,onExit:this.onExit,onExiting:this.onExiting,onExited:this.onExited}))},s}(g.Component);w.defaultProps={classNames:""};w.propTypes={};const q=w;function N(r){"@babel/helpers - typeof";return N=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(s){return typeof s}:function(s){return s&&typeof Symbol=="function"&&s.constructor===Symbol&&s!==Symbol.prototype?"symbol":typeof s},N(r)}function z(r,s){if(N(r)!=="object"||r===null)return r;var e=r[Symbol.toPrimitive];if(e!==void 0){var t=e.call(r,s||"default");if(N(t)!=="object")return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return(s==="string"?String:Number)(r)}function J(r){var s=z(r,"string");return N(s)==="symbol"?s:String(s)}function Q(r,s,e){return s=J(s),s in r?Object.defineProperty(r,s,{value:e,enumerable:!0,configurable:!0,writable:!0}):r[s]=e,r}var $={defaultProps:{__TYPE:"CSSTransition",children:void 0},getProps:function(s){return D.getMergedProps(s,$.defaultProps)},getOtherProps:function(s){return D.getDiffProps(s,$.defaultProps)}};function k(r,s){var e=Object.keys(r);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(r);s&&(t=t.filter(function(o){return Object.getOwnPropertyDescriptor(r,o).enumerable})),e.push.apply(e,t)}return e}function R(r){for(var s=1;s<arguments.length;s++){var e=arguments[s]!=null?arguments[s]:{};s%2?k(Object(e),!0).forEach(function(t){Q(r,t,e[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(e)):k(Object(e)).forEach(function(t){Object.defineProperty(r,t,Object.getOwnPropertyDescriptor(e,t))})}return r}var Z=P.forwardRef(function(r,s){var e=$.getProps(r),t=P.useContext(G),o=e.disabled||e.options&&e.options.disabled||t&&!t.cssTransition||!X.cssTransition,n=function(f,x){e.onEnter&&e.onEnter(f,x),e.options&&e.options.onEnter&&e.options.onEnter(f,x)},a=function(f,x){e.onEntering&&e.onEntering(f,x),e.options&&e.options.onEntering&&e.options.onEntering(f,x)},i=function(f,x){e.onEntered&&e.onEntered(f,x),e.options&&e.options.onEntered&&e.options.onEntered(f,x)},u=function(f){e.onExit&&e.onExit(f),e.options&&e.options.onExit&&e.options.onExit(f)},p=function(f){e.onExiting&&e.onExiting(f),e.options&&e.options.onExiting&&e.options.onExiting(f)},l=function(f){e.onExited&&e.onExited(f),e.options&&e.options.onExited&&e.options.onExited(f)};if(V(function(){if(o){var d=D.getRefElement(e.nodeRef);e.in?(n(d,!0),a(d,!0),i(d,!0)):(u(d),p(d),l(d))}},[e.in]),o)return e.in?e.children:null;var c={nodeRef:e.nodeRef,in:e.in,onEnter:n,onEntering:a,onEntered:i,onExit:u,onExiting:p,onExited:l},E={classNames:e.classNames,timeout:e.timeout,unmountOnExit:e.unmountOnExit},T=R(R(R({},E),e.options||{}),c);return P.createElement(q,T,e.children)});Z.displayName="CSSTransition";export{Z as C,U as T};
