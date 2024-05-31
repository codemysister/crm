import{r as W,t as oe,_ as m,u as je,c as N,v as He}from"./app-183ca207.js";import{p as ze}from"./index-387d7a00.js";var Ve=function(t,r,a){var n=document.head||document.getElementsByTagName("head")[0],o=document.createElement("script");typeof r=="function"&&(a=r,r={}),r=r||{},a=a||function(){},o.type=r.type||"text/javascript",o.charset=r.charset||"utf8",o.async="async"in r?!!r.async:!0,o.src=t,r.attrs&&Be(o,r.attrs),r.text&&(o.text=""+r.text);var _="onload"in o?G:Fe;_(o,a),o.onload||G(o,a),n.appendChild(o)};function Be(e,t){for(var r in t)e.setAttribute(r,t[r])}function G(e,t){e.onload=function(){this.onerror=this.onload=null,t(null,e)},e.onerror=function(){this.onerror=this.onload=null,t(new Error("Failed to load "+this.src),e)}}function Fe(e,t){e.onreadystatechange=function(){this.readyState!="complete"&&this.readyState!="loaded"||(this.onreadystatechange=null,t(null,e))}}var Ke=Object.create,$=Object.defineProperty,We=Object.getOwnPropertyDescriptor,Xe=Object.getOwnPropertyNames,Ye=Object.getPrototypeOf,qe=Object.prototype.hasOwnProperty,Je=(e,t)=>{for(var r in t)$(e,r,{get:t[r],enumerable:!0})},ie=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of Xe(t))!qe.call(e,n)&&n!==r&&$(e,n,{get:()=>t[n],enumerable:!(a=We(t,n))||a.enumerable});return e},X=(e,t,r)=>(r=e!=null?Ke(Ye(e)):{},ie(t||!e||!e.__esModule?$(r,"default",{value:e,enumerable:!0}):r,e)),Ze=e=>ie($({},"__esModule",{value:!0}),e),se={};Je(se,{callPlayer:()=>yt,getConfig:()=>ct,getSDK:()=>pt,isBlobUrl:()=>_t,isMediaStream:()=>dt,lazy:()=>tt,omit:()=>ft,parseEndTime:()=>st,parseStartTime:()=>it,queryString:()=>ut,randomString:()=>lt,supportsWebKitPresentationMode:()=>ht});var D=Ze(se),Qe=X(W),Ge=X(Ve),et=X(oe);const tt=e=>Qe.default.lazy(async()=>{const t=await e();return typeof t.default=="function"?t:t.default}),rt=/[?&#](?:start|t)=([0-9hms]+)/,at=/[?&#]end=([0-9hms]+)/,V=/(\d+)(h|m|s)/g,nt=/^\d+$/;function le(e,t){if(e instanceof Array)return;const r=e.match(t);if(r){const a=r[1];if(a.match(V))return ot(a);if(nt.test(a))return parseInt(a)}}function ot(e){let t=0,r=V.exec(e);for(;r!==null;){const[,a,n]=r;n==="h"&&(t+=parseInt(a,10)*60*60),n==="m"&&(t+=parseInt(a,10)*60),n==="s"&&(t+=parseInt(a,10)),r=V.exec(e)}return t}function it(e){return le(e,rt)}function st(e){return le(e,at)}function lt(){return Math.random().toString(36).substr(2,5)}function ut(e){return Object.keys(e).map(t=>`${t}=${e[t]}`).join("&")}function j(e){return window[e]?window[e]:window.exports&&window.exports[e]?window.exports[e]:window.module&&window.module.exports&&window.module.exports[e]?window.module.exports[e]:null}const w={},pt=function(t,r,a=null,n=()=>!0,o=Ge.default){const _=j(r);return _&&n(_)?Promise.resolve(_):new Promise((h,f)=>{if(w[t]){w[t].push({resolve:h,reject:f});return}w[t]=[{resolve:h,reject:f}];const g=O=>{w[t].forEach(E=>E.resolve(O))};if(a){const O=window[a];window[a]=function(){O&&O(),g(j(r))}}o(t,O=>{O?(w[t].forEach(E=>E.reject(O)),w[t]=null):a||g(j(r))})})};function ct(e,t){return(0,et.default)(t.config,e.config)}function ft(e,...t){const r=[].concat(...t),a={},n=Object.keys(e);for(const o of n)r.indexOf(o)===-1&&(a[o]=e[o]);return a}function yt(e,...t){if(!this.player||!this.player[e]){let r=`ReactPlayer: ${this.constructor.displayName} player could not call %c${e}%c – `;return this.player?this.player[e]||(r+="The method was not available"):r+="The player was not available",console.warn(r,"font-weight: bold",""),null}return this.player[e](...t)}function dt(e){return typeof window<"u"&&typeof window.MediaStream<"u"&&e instanceof window.MediaStream}function _t(e){return/^blob:/.test(e)}function ht(e=document.createElement("video")){const t=/iPhone|iPod/.test(navigator.userAgent)===!1;return e.webkitSupportsPresentationMode&&typeof e.webkitSetPresentationMode=="function"&&t}var Y=Object.defineProperty,Pt=Object.getOwnPropertyDescriptor,mt=Object.getOwnPropertyNames,vt=Object.prototype.hasOwnProperty,Ot=(e,t)=>{for(var r in t)Y(e,r,{get:t[r],enumerable:!0})},gt=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of mt(t))!vt.call(e,n)&&n!==r&&Y(e,n,{get:()=>t[n],enumerable:!(a=Pt(t,n))||a.enumerable});return e},wt=e=>gt(Y({},"__esModule",{value:!0}),e),ue={};Ot(ue,{AUDIO_EXTENSIONS:()=>q,DASH_EXTENSIONS:()=>be,FLV_EXTENSIONS:()=>Te,HLS_EXTENSIONS:()=>Z,MATCH_URL_DAILYMOTION:()=>ve,MATCH_URL_FACEBOOK:()=>ye,MATCH_URL_FACEBOOK_WATCH:()=>de,MATCH_URL_KALTURA:()=>we,MATCH_URL_MIXCLOUD:()=>Oe,MATCH_URL_MUX:()=>fe,MATCH_URL_SOUNDCLOUD:()=>pe,MATCH_URL_STREAMABLE:()=>_e,MATCH_URL_TWITCH_CHANNEL:()=>me,MATCH_URL_TWITCH_VIDEO:()=>Pe,MATCH_URL_VIDYARD:()=>ge,MATCH_URL_VIMEO:()=>ce,MATCH_URL_WISTIA:()=>he,MATCH_URL_YOUTUBE:()=>B,VIDEO_EXTENSIONS:()=>J,canPlay:()=>Tt});var bt=wt(ue),ee=D;const B=/(?:youtu\.be\/|youtube(?:-nocookie|education)?\.com\/(?:embed\/|v\/|watch\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))((\w|-){11})|youtube\.com\/playlist\?list=|youtube\.com\/user\//,pe=/(?:soundcloud\.com|snd\.sc)\/[^.]+$/,ce=/vimeo\.com\/(?!progressive_redirect).+/,fe=/stream\.mux\.com\/(?!\w+\.m3u8)(\w+)/,ye=/^https?:\/\/(www\.)?facebook\.com.*\/(video(s)?|watch|story)(\.php?|\/).+$/,de=/^https?:\/\/fb\.watch\/.+$/,_e=/streamable\.com\/([a-z0-9]+)$/,he=/(?:wistia\.(?:com|net)|wi\.st)\/(?:medias|embed)\/(?:iframe\/)?([^?]+)/,Pe=/(?:www\.|go\.)?twitch\.tv\/videos\/(\d+)($|\?)/,me=/(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+)($|\?)/,ve=/^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?(?:[\w.#_-]+)?/,Oe=/mixcloud\.com\/([^/]+\/[^/]+)/,ge=/vidyard.com\/(?:watch\/)?([a-zA-Z0-9-_]+)/,we=/^https?:\/\/[a-zA-Z]+\.kaltura.(com|org)\/p\/([0-9]+)\/sp\/([0-9]+)00\/embedIframeJs\/uiconf_id\/([0-9]+)\/partner_id\/([0-9]+)(.*)entry_id.([a-zA-Z0-9-_].*)$/,q=/\.(m4a|m4b|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i,J=/\.(mp4|og[gv]|webm|mov|m4v)(#t=[,\d+]+)?($|\?)/i,Z=/\.(m3u8)($|\?)/i,be=/\.(mpd)($|\?)/i,Te=/\.(flv)($|\?)/i,F=e=>{if(e instanceof Array){for(const t of e)if(typeof t=="string"&&F(t)||F(t.src))return!0;return!1}return(0,ee.isMediaStream)(e)||(0,ee.isBlobUrl)(e)?!0:q.test(e)||J.test(e)||Z.test(e)||be.test(e)||Te.test(e)},Tt={youtube:e=>e instanceof Array?e.every(t=>B.test(t)):B.test(e),soundcloud:e=>pe.test(e)&&!q.test(e),vimeo:e=>ce.test(e)&&!J.test(e)&&!Z.test(e),mux:e=>fe.test(e),facebook:e=>ye.test(e)||de.test(e),streamable:e=>_e.test(e),wistia:e=>he.test(e),twitch:e=>Pe.test(e)||me.test(e),dailymotion:e=>ve.test(e),mixcloud:e=>Oe.test(e),vidyard:e=>ge.test(e),kaltura:e=>we.test(e),file:F};var Q=Object.defineProperty,Et=Object.getOwnPropertyDescriptor,St=Object.getOwnPropertyNames,At=Object.prototype.hasOwnProperty,Rt=(e,t)=>{for(var r in t)Q(e,r,{get:t[r],enumerable:!0})},Ct=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of St(t))!At.call(e,n)&&n!==r&&Q(e,n,{get:()=>t[n],enumerable:!(a=Et(t,n))||a.enumerable});return e},It=e=>Ct(Q({},"__esModule",{value:!0}),e),Ee={};Rt(Ee,{default:()=>Mt});var Lt=It(Ee),P=D,y=bt,Mt=[{key:"youtube",name:"YouTube",canPlay:y.canPlay.youtube,lazyPlayer:(0,P.lazy)(()=>m(()=>import("./YouTube-3def32a8.js").then(e=>e.Y),["assets/YouTube-3def32a8.js","assets/app-183ca207.js","assets/app-22bdcf69.css"]))},{key:"soundcloud",name:"SoundCloud",canPlay:y.canPlay.soundcloud,lazyPlayer:(0,P.lazy)(()=>m(()=>import("./SoundCloud-771d2286.js").then(e=>e.S),["assets/SoundCloud-771d2286.js","assets/app-183ca207.js","assets/app-22bdcf69.css"]))},{key:"vimeo",name:"Vimeo",canPlay:y.canPlay.vimeo,lazyPlayer:(0,P.lazy)(()=>m(()=>import("./Vimeo-eb64dd99.js").then(e=>e.V),["assets/Vimeo-eb64dd99.js","assets/app-183ca207.js","assets/app-22bdcf69.css"]))},{key:"mux",name:"Mux",canPlay:y.canPlay.mux,lazyPlayer:(0,P.lazy)(()=>m(()=>import("./Mux-355500b9.js").then(e=>e.M),["assets/Mux-355500b9.js","assets/app-183ca207.js","assets/app-22bdcf69.css"]))},{key:"facebook",name:"Facebook",canPlay:y.canPlay.facebook,lazyPlayer:(0,P.lazy)(()=>m(()=>import("./Facebook-eb4d260f.js").then(e=>e.F),["assets/Facebook-eb4d260f.js","assets/app-183ca207.js","assets/app-22bdcf69.css"]))},{key:"streamable",name:"Streamable",canPlay:y.canPlay.streamable,lazyPlayer:(0,P.lazy)(()=>m(()=>import("./Streamable-96162653.js").then(e=>e.S),["assets/Streamable-96162653.js","assets/app-183ca207.js","assets/app-22bdcf69.css"]))},{key:"wistia",name:"Wistia",canPlay:y.canPlay.wistia,lazyPlayer:(0,P.lazy)(()=>m(()=>import("./Wistia-fc01c33c.js").then(e=>e.W),["assets/Wistia-fc01c33c.js","assets/app-183ca207.js","assets/app-22bdcf69.css"]))},{key:"twitch",name:"Twitch",canPlay:y.canPlay.twitch,lazyPlayer:(0,P.lazy)(()=>m(()=>import("./Twitch-8eb39326.js").then(e=>e.T),["assets/Twitch-8eb39326.js","assets/app-183ca207.js","assets/app-22bdcf69.css"]))},{key:"dailymotion",name:"DailyMotion",canPlay:y.canPlay.dailymotion,lazyPlayer:(0,P.lazy)(()=>m(()=>import("./DailyMotion-3ef386c4.js").then(e=>e.D),["assets/DailyMotion-3ef386c4.js","assets/app-183ca207.js","assets/app-22bdcf69.css"]))},{key:"mixcloud",name:"Mixcloud",canPlay:y.canPlay.mixcloud,lazyPlayer:(0,P.lazy)(()=>m(()=>import("./Mixcloud-dc4b8399.js").then(e=>e.M),["assets/Mixcloud-dc4b8399.js","assets/app-183ca207.js","assets/app-22bdcf69.css"]))},{key:"vidyard",name:"Vidyard",canPlay:y.canPlay.vidyard,lazyPlayer:(0,P.lazy)(()=>m(()=>import("./Vidyard-ac085756.js").then(e=>e.V),["assets/Vidyard-ac085756.js","assets/app-183ca207.js","assets/app-22bdcf69.css"]))},{key:"kaltura",name:"Kaltura",canPlay:y.canPlay.kaltura,lazyPlayer:(0,P.lazy)(()=>m(()=>import("./Kaltura-7f5c7288.js").then(e=>e.K),["assets/Kaltura-7f5c7288.js","assets/app-183ca207.js","assets/app-22bdcf69.css"]))},{key:"file",name:"FilePlayer",canPlay:y.canPlay.file,canEnablePIP:e=>y.canPlay.file(e)&&(document.pictureInPictureEnabled||(0,P.supportsWebKitPresentationMode)())&&!y.AUDIO_EXTENSIONS.test(e),lazyPlayer:(0,P.lazy)(()=>m(()=>import("./FilePlayer-8590ffa7.js").then(e=>e.F),["assets/FilePlayer-8590ffa7.js","assets/app-183ca207.js","assets/app-22bdcf69.css"]))}],te=Number.isNaN||function(t){return typeof t=="number"&&t!==t};function $t(e,t){return!!(e===t||te(e)&&te(t))}function Dt(e,t){if(e.length!==t.length)return!1;for(var r=0;r<e.length;r++)if(!$t(e[r],t[r]))return!1;return!0}function kt(e,t){t===void 0&&(t=Dt);var r,a=[],n,o=!1;function _(){for(var h=[],f=0;f<arguments.length;f++)h[f]=arguments[f];return o&&r===this&&t(h,a)||(n=e.apply(this,h),o=!0,r=this,a=h),n}return _}const Ut=Object.freeze(Object.defineProperty({__proto__:null,default:kt},Symbol.toStringTag,{value:"Module"})),xt=je(Ut);var Nt=typeof Element<"u",jt=typeof Map=="function",Ht=typeof Set=="function",zt=typeof ArrayBuffer=="function"&&!!ArrayBuffer.isView;function M(e,t){if(e===t)return!0;if(e&&t&&typeof e=="object"&&typeof t=="object"){if(e.constructor!==t.constructor)return!1;var r,a,n;if(Array.isArray(e)){if(r=e.length,r!=t.length)return!1;for(a=r;a--!==0;)if(!M(e[a],t[a]))return!1;return!0}var o;if(jt&&e instanceof Map&&t instanceof Map){if(e.size!==t.size)return!1;for(o=e.entries();!(a=o.next()).done;)if(!t.has(a.value[0]))return!1;for(o=e.entries();!(a=o.next()).done;)if(!M(a.value[1],t.get(a.value[0])))return!1;return!0}if(Ht&&e instanceof Set&&t instanceof Set){if(e.size!==t.size)return!1;for(o=e.entries();!(a=o.next()).done;)if(!t.has(a.value[0]))return!1;return!0}if(zt&&ArrayBuffer.isView(e)&&ArrayBuffer.isView(t)){if(r=e.length,r!=t.length)return!1;for(a=r;a--!==0;)if(e[a]!==t[a])return!1;return!0}if(e.constructor===RegExp)return e.source===t.source&&e.flags===t.flags;if(e.valueOf!==Object.prototype.valueOf&&typeof e.valueOf=="function"&&typeof t.valueOf=="function")return e.valueOf()===t.valueOf();if(e.toString!==Object.prototype.toString&&typeof e.toString=="function"&&typeof t.toString=="function")return e.toString()===t.toString();if(n=Object.keys(e),r=n.length,r!==Object.keys(t).length)return!1;for(a=r;a--!==0;)if(!Object.prototype.hasOwnProperty.call(t,n[a]))return!1;if(Nt&&e instanceof Element)return!1;for(a=r;a--!==0;)if(!((n[a]==="_owner"||n[a]==="__v"||n[a]==="__o")&&e.$$typeof)&&!M(e[n[a]],t[n[a]]))return!1;return!0}return e!==e&&t!==t}var Se=function(t,r){try{return M(t,r)}catch(a){if((a.message||"").match(/stack|recursion/i))return console.warn("react-fast-compare cannot handle circular refs"),!1;throw a}},Vt=Object.create,k=Object.defineProperty,Bt=Object.getOwnPropertyDescriptor,Ft=Object.getOwnPropertyNames,Kt=Object.getPrototypeOf,Wt=Object.prototype.hasOwnProperty,Xt=(e,t)=>{for(var r in t)k(e,r,{get:t[r],enumerable:!0})},Ae=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of Ft(t))!Wt.call(e,n)&&n!==r&&k(e,n,{get:()=>t[n],enumerable:!(a=Bt(t,n))||a.enumerable});return e},Yt=(e,t,r)=>(r=e!=null?Vt(Kt(e)):{},Ae(t||!e||!e.__esModule?k(r,"default",{value:e,enumerable:!0}):r,e)),qt=e=>Ae(k({},"__esModule",{value:!0}),e),Re={};Xt(Re,{defaultProps:()=>Qt,propTypes:()=>Zt});var Ce=qt(Re),Jt=Yt(ze);const{string:u,bool:d,number:b,array:H,oneOfType:S,shape:v,object:c,func:l,node:re}=Jt.default,Zt={url:S([u,H,c]),playing:d,loop:d,controls:d,volume:b,muted:d,playbackRate:b,width:S([u,b]),height:S([u,b]),style:c,progressInterval:b,playsinline:d,pip:d,stopOnUnmount:d,light:S([d,u,c]),playIcon:re,previewTabIndex:b,previewAriaLabel:u,fallback:re,oEmbedUrl:u,wrapper:S([u,l,v({render:l.isRequired})]),config:v({soundcloud:v({options:c}),youtube:v({playerVars:c,embedOptions:c,onUnstarted:l}),facebook:v({appId:u,version:u,playerId:u,attributes:c}),dailymotion:v({params:c}),vimeo:v({playerOptions:c,title:u}),mux:v({attributes:c,version:u}),file:v({attributes:c,tracks:H,forceVideo:d,forceAudio:d,forceHLS:d,forceSafariHLS:d,forceDisableHls:d,forceDASH:d,forceFLV:d,hlsOptions:c,hlsVersion:u,dashVersion:u,flvVersion:u}),wistia:v({options:c,playerId:u,customControls:H}),mixcloud:v({options:c}),twitch:v({options:c,playerId:u}),vidyard:v({options:c})}),onReady:l,onStart:l,onPlay:l,onPause:l,onBuffer:l,onBufferEnd:l,onEnded:l,onError:l,onDuration:l,onSeek:l,onPlaybackRateChange:l,onPlaybackQualityChange:l,onProgress:l,onClickPreview:l,onEnablePIP:l,onDisablePIP:l},p=()=>{},Qt={playing:!1,loop:!1,controls:!1,volume:null,muted:!1,playbackRate:1,width:"640px",height:"360px",style:{},progressInterval:1e3,playsinline:!1,pip:!1,stopOnUnmount:!0,light:!1,fallback:null,wrapper:"div",previewTabIndex:0,previewAriaLabel:"",oEmbedUrl:"https://noembed.com/embed?url={url}",config:{soundcloud:{options:{visual:!0,buying:!1,liking:!1,download:!1,sharing:!1,show_comments:!1,show_playcount:!1}},youtube:{playerVars:{playsinline:1,showinfo:0,rel:0,iv_load_policy:3,modestbranding:1},embedOptions:{},onUnstarted:p},facebook:{appId:"1309697205772819",version:"v3.3",playerId:null,attributes:{}},dailymotion:{params:{api:1,"endscreen-enable":!1}},vimeo:{playerOptions:{autopause:!1,byline:!1,portrait:!1,title:!1},title:null},mux:{attributes:{},version:"2"},file:{attributes:{},tracks:[],forceVideo:!1,forceAudio:!1,forceHLS:!1,forceDASH:!1,forceFLV:!1,hlsOptions:{},hlsVersion:"1.1.4",dashVersion:"3.1.3",flvVersion:"1.5.0",forceDisableHls:!1},wistia:{options:{},playerId:null,customControls:null},mixcloud:{options:{hide_cover:1}},twitch:{options:{},playerId:null},vidyard:{options:{}}},onReady:p,onStart:p,onPlay:p,onPause:p,onBuffer:p,onBufferEnd:p,onEnded:p,onError:p,onDuration:p,onSeek:p,onPlaybackRateChange:p,onPlaybackQualityChange:p,onProgress:p,onClickPreview:p,onEnablePIP:p,onDisablePIP:p};var Gt=Object.create,C=Object.defineProperty,er=Object.getOwnPropertyDescriptor,tr=Object.getOwnPropertyNames,rr=Object.getPrototypeOf,ar=Object.prototype.hasOwnProperty,nr=(e,t,r)=>t in e?C(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,or=(e,t)=>{for(var r in t)C(e,r,{get:t[r],enumerable:!0})},Ie=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of tr(t))!ar.call(e,n)&&n!==r&&C(e,n,{get:()=>t[n],enumerable:!(a=er(t,n))||a.enumerable});return e},Le=(e,t,r)=>(r=e!=null?Gt(rr(e)):{},Ie(t||!e||!e.__esModule?C(r,"default",{value:e,enumerable:!0}):r,e)),ir=e=>Ie(C({},"__esModule",{value:!0}),e),s=(e,t,r)=>(nr(e,typeof t!="symbol"?t+"":t,r),r),Me={};or(Me,{default:()=>U});var sr=ir(Me),ae=Le(W),lr=Le(Se),$e=Ce,ur=D;const pr=5e3;class U extends ae.Component{constructor(){super(...arguments),s(this,"mounted",!1),s(this,"isReady",!1),s(this,"isPlaying",!1),s(this,"isLoading",!0),s(this,"loadOnReady",null),s(this,"startOnPlay",!0),s(this,"seekOnPlay",null),s(this,"onDurationCalled",!1),s(this,"handlePlayerMount",t=>{if(this.player){this.progress();return}this.player=t,this.player.load(this.props.url),this.progress()}),s(this,"getInternalPlayer",t=>this.player?this.player[t]:null),s(this,"progress",()=>{if(this.props.url&&this.player&&this.isReady){const t=this.getCurrentTime()||0,r=this.getSecondsLoaded(),a=this.getDuration();if(a){const n={playedSeconds:t,played:t/a};r!==null&&(n.loadedSeconds=r,n.loaded=r/a),(n.playedSeconds!==this.prevPlayed||n.loadedSeconds!==this.prevLoaded)&&this.props.onProgress(n),this.prevPlayed=n.playedSeconds,this.prevLoaded=n.loadedSeconds}}this.progressTimeout=setTimeout(this.progress,this.props.progressFrequency||this.props.progressInterval)}),s(this,"handleReady",()=>{if(!this.mounted)return;this.isReady=!0,this.isLoading=!1;const{onReady:t,playing:r,volume:a,muted:n}=this.props;t(),!n&&a!==null&&this.player.setVolume(a),this.loadOnReady?(this.player.load(this.loadOnReady,!0),this.loadOnReady=null):r&&this.player.play(),this.handleDurationCheck()}),s(this,"handlePlay",()=>{this.isPlaying=!0,this.isLoading=!1;const{onStart:t,onPlay:r,playbackRate:a}=this.props;this.startOnPlay&&(this.player.setPlaybackRate&&a!==1&&this.player.setPlaybackRate(a),t(),this.startOnPlay=!1),r(),this.seekOnPlay&&(this.seekTo(this.seekOnPlay),this.seekOnPlay=null),this.handleDurationCheck()}),s(this,"handlePause",t=>{this.isPlaying=!1,this.isLoading||this.props.onPause(t)}),s(this,"handleEnded",()=>{const{activePlayer:t,loop:r,onEnded:a}=this.props;t.loopOnEnded&&r&&this.seekTo(0),r||(this.isPlaying=!1,a())}),s(this,"handleError",(...t)=>{this.isLoading=!1,this.props.onError(...t)}),s(this,"handleDurationCheck",()=>{clearTimeout(this.durationCheckTimeout);const t=this.getDuration();t?this.onDurationCalled||(this.props.onDuration(t),this.onDurationCalled=!0):this.durationCheckTimeout=setTimeout(this.handleDurationCheck,100)}),s(this,"handleLoaded",()=>{this.isLoading=!1})}componentDidMount(){this.mounted=!0}componentWillUnmount(){clearTimeout(this.progressTimeout),clearTimeout(this.durationCheckTimeout),this.isReady&&this.props.stopOnUnmount&&(this.player.stop(),this.player.disablePIP&&this.player.disablePIP()),this.mounted=!1}componentDidUpdate(t){if(!this.player)return;const{url:r,playing:a,volume:n,muted:o,playbackRate:_,pip:h,loop:f,activePlayer:g,disableDeferredLoading:O}=this.props;if(!(0,lr.default)(t.url,r)){if(this.isLoading&&!g.forceLoad&&!O&&!(0,ur.isMediaStream)(r)){console.warn(`ReactPlayer: the attempt to load ${r} is being deferred until the player has loaded`),this.loadOnReady=r;return}this.isLoading=!0,this.startOnPlay=!0,this.onDurationCalled=!1,this.player.load(r,this.isReady)}!t.playing&&a&&!this.isPlaying&&this.player.play(),t.playing&&!a&&this.isPlaying&&this.player.pause(),!t.pip&&h&&this.player.enablePIP&&this.player.enablePIP(),t.pip&&!h&&this.player.disablePIP&&this.player.disablePIP(),t.volume!==n&&n!==null&&this.player.setVolume(n),t.muted!==o&&(o?this.player.mute():(this.player.unmute(),n!==null&&setTimeout(()=>this.player.setVolume(n)))),t.playbackRate!==_&&this.player.setPlaybackRate&&this.player.setPlaybackRate(_),t.loop!==f&&this.player.setLoop&&this.player.setLoop(f)}getDuration(){return this.isReady?this.player.getDuration():null}getCurrentTime(){return this.isReady?this.player.getCurrentTime():null}getSecondsLoaded(){return this.isReady?this.player.getSecondsLoaded():null}seekTo(t,r,a){if(!this.isReady){t!==0&&(this.seekOnPlay=t,setTimeout(()=>{this.seekOnPlay=null},pr));return}if(r?r==="fraction":t>0&&t<1){const o=this.player.getDuration();if(!o){console.warn("ReactPlayer: could not seek using fraction – duration not yet available");return}this.player.seekTo(o*t,a);return}this.player.seekTo(t,a)}render(){const t=this.props.activePlayer;return t?ae.default.createElement(t,{...this.props,onMount:this.handlePlayerMount,onReady:this.handleReady,onPlay:this.handlePlay,onPause:this.handlePause,onEnded:this.handleEnded,onLoaded:this.handleLoaded,onError:this.handleError}):null}}s(U,"displayName","Player");s(U,"propTypes",$e.propTypes);s(U,"defaultProps",$e.defaultProps);var cr=Object.create,I=Object.defineProperty,fr=Object.getOwnPropertyDescriptor,yr=Object.getOwnPropertyNames,dr=Object.getPrototypeOf,_r=Object.prototype.hasOwnProperty,hr=(e,t,r)=>t in e?I(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,Pr=(e,t)=>{for(var r in t)I(e,r,{get:t[r],enumerable:!0})},De=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of yr(t))!_r.call(e,n)&&n!==r&&I(e,n,{get:()=>t[n],enumerable:!(a=fr(t,n))||a.enumerable});return e},L=(e,t,r)=>(r=e!=null?cr(dr(e)):{},De(t||!e||!e.__esModule?I(r,"default",{value:e,enumerable:!0}):r,e)),mr=e=>De(I({},"__esModule",{value:!0}),e),i=(e,t,r)=>(hr(e,typeof t!="symbol"?t+"":t,r),r),ke={};Pr(ke,{createReactPlayer:()=>Ar});var vr=mr(ke),T=L(W),Or=L(oe),z=L(xt),ne=L(Se),R=Ce,Ue=D,gr=L(sr);const wr=(0,Ue.lazy)(()=>m(()=>import("./Preview-7135e6ce.js").then(e=>e.P),["assets/Preview-7135e6ce.js","assets/app-183ca207.js","assets/app-22bdcf69.css"])),br=typeof window<"u"&&window.document&&typeof document<"u",Tr=typeof N<"u"&&N.window&&N.window.document,Er=Object.keys(R.propTypes),Sr=br||Tr?T.Suspense:()=>null,A=[],Ar=(e,t)=>{var r;return r=class extends T.Component{constructor(){super(...arguments),i(this,"state",{showPreview:!!this.props.light}),i(this,"references",{wrapper:a=>{this.wrapper=a},player:a=>{this.player=a}}),i(this,"handleClickPreview",a=>{this.setState({showPreview:!1}),this.props.onClickPreview(a)}),i(this,"showPreview",()=>{this.setState({showPreview:!0})}),i(this,"getDuration",()=>this.player?this.player.getDuration():null),i(this,"getCurrentTime",()=>this.player?this.player.getCurrentTime():null),i(this,"getSecondsLoaded",()=>this.player?this.player.getSecondsLoaded():null),i(this,"getInternalPlayer",(a="player")=>this.player?this.player.getInternalPlayer(a):null),i(this,"seekTo",(a,n,o)=>{if(!this.player)return null;this.player.seekTo(a,n,o)}),i(this,"handleReady",()=>{this.props.onReady(this)}),i(this,"getActivePlayer",(0,z.default)(a=>{for(const n of[...A,...e])if(n.canPlay(a))return n;return t||null})),i(this,"getConfig",(0,z.default)((a,n)=>{const{config:o}=this.props;return Or.default.all([R.defaultProps.config,R.defaultProps.config[n]||{},o,o[n]||{}])})),i(this,"getAttributes",(0,z.default)(a=>(0,Ue.omit)(this.props,Er))),i(this,"renderActivePlayer",a=>{if(!a)return null;const n=this.getActivePlayer(a);if(!n)return null;const o=this.getConfig(a,n.key);return T.default.createElement(gr.default,{...this.props,key:n.key,ref:this.references.player,config:o,activePlayer:n.lazyPlayer||n,onReady:this.handleReady})})}shouldComponentUpdate(a,n){return!(0,ne.default)(this.props,a)||!(0,ne.default)(this.state,n)}componentDidUpdate(a){const{light:n}=this.props;!a.light&&n&&this.setState({showPreview:!0}),a.light&&!n&&this.setState({showPreview:!1})}renderPreview(a){if(!a)return null;const{light:n,playIcon:o,previewTabIndex:_,oEmbedUrl:h,previewAriaLabel:f}=this.props;return T.default.createElement(wr,{url:a,light:n,playIcon:o,previewTabIndex:_,previewAriaLabel:f,oEmbedUrl:h,onClick:this.handleClickPreview})}render(){const{url:a,style:n,width:o,height:_,fallback:h,wrapper:f}=this.props,{showPreview:g}=this.state,O=this.getAttributes(a),E=typeof f=="string"?this.references.wrapper:void 0;return T.default.createElement(f,{ref:E,style:{...n,width:o,height:_},...O},T.default.createElement(Sr,{fallback:h},g?this.renderPreview(a):this.renderActivePlayer(a)))}},i(r,"displayName","ReactPlayer"),i(r,"propTypes",R.propTypes),i(r,"defaultProps",R.defaultProps),i(r,"addCustomPlayer",a=>{A.push(a)}),i(r,"removeCustomPlayers",()=>{A.length=0}),i(r,"canPlay",a=>{for(const n of[...A,...e])if(n.canPlay(a))return!0;return!1}),i(r,"canEnablePIP",a=>{for(const n of[...A,...e])if(n.canEnablePIP&&n.canEnablePIP(a))return!0;return!1}),r};var Rr=Object.create,x=Object.defineProperty,Cr=Object.getOwnPropertyDescriptor,Ir=Object.getOwnPropertyNames,Lr=Object.getPrototypeOf,Mr=Object.prototype.hasOwnProperty,$r=(e,t)=>{for(var r in t)x(e,r,{get:t[r],enumerable:!0})},xe=(e,t,r,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of Ir(t))!Mr.call(e,n)&&n!==r&&x(e,n,{get:()=>t[n],enumerable:!(a=Cr(t,n))||a.enumerable});return e},Dr=(e,t,r)=>(r=e!=null?Rr(Lr(e)):{},xe(t||!e||!e.__esModule?x(r,"default",{value:e,enumerable:!0}):r,e)),kr=e=>xe(x({},"__esModule",{value:!0}),e),Ne={};$r(Ne,{default:()=>jr});var Ur=kr(Ne),K=Dr(Lt),xr=vr;const Nr=K.default[K.default.length-1];var jr=(0,xr.createReactPlayer)(K.default,Nr);const Vr=He(Ur);export{Vr as R,bt as p,D as u};
