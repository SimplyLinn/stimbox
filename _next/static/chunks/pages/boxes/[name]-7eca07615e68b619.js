(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[859],{7833:function(e,t,n){var r={"./repulsion-balls/dist/index.js":[8045,994,903],"./tone-matrix/dist/index.js":[9150,243]};function o(e){if(!n.o(r,e))return Promise.resolve().then((function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=r[e],o=t[0];return Promise.all(t.slice(1).map(n.e)).then((function(){return n(o)}))}o.keys=function(){return Object.keys(r)},o.id=7833,e.exports=o},5151:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/boxes/[name]",function(){return n(597)}])},9906:function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},o=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),o.forEach((function(t){r(e,t,n[t])}))}return e}t.default=function(e,t){var n=u.default,r={loading:function(e){e.error,e.isLoading;return e.pastDelay,null}};i=e,l=Promise,(null!=l&&"undefined"!==typeof Symbol&&l[Symbol.hasInstance]?l[Symbol.hasInstance](i):i instanceof l)?r.loader=function(){return e}:"function"===typeof e?r.loader=e:"object"===typeof e&&(r=o({},r,e));var i,l;var s=r=o({},r,t);if(s.suspense)throw new Error("Invalid suspense option usage in next/dynamic. Read more: https://nextjs.org/docs/messages/invalid-dynamic-suspense");if(s.suspense)return n(s);r.loadableGenerated&&delete(r=o({},r,r.loadableGenerated)).loadableGenerated;if("boolean"===typeof r.ssr){if(!r.ssr)return delete r.ssr,a(n,r);delete r.ssr}return n(r)};i(n(7378));var u=i(n(2456));function i(e){return e&&e.__esModule?e:{default:e}}function a(e,t){return delete t.webpack,delete t.modules,e(t)}},7815:function(e,t,n){"use strict";var r;Object.defineProperty(t,"__esModule",{value:!0}),t.LoadableContext=void 0;var o=((r=n(7378))&&r.__esModule?r:{default:r}).default.createContext(null);t.LoadableContext=o},2456:function(e,t,n){"use strict";function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){o(e,t,n[t])}))}return e}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i,a=(i=n(7378))&&i.__esModule?i:{default:i},l=n(3247),s=n(7815);var c=[],f=[],d=!1;function p(e){var t=e(),n={loading:!0,loaded:null,error:null};return n.promise=t.then((function(e){return n.loading=!1,n.loaded=e,e})).catch((function(e){throw n.loading=!1,n.error=e,e})),n}var m=function(){function e(t,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this._loadFn=t,this._opts=n,this._callbacks=new Set,this._delay=null,this._timeout=null,this.retry()}var t,n,o;return t=e,(n=[{key:"promise",value:function(){return this._res.promise}},{key:"retry",value:function(){var e=this;this._clearTimeouts(),this._res=this._loadFn(this._opts.loader),this._state={pastDelay:!1,timedOut:!1};var t=this._res,n=this._opts;if(t.loading){if("number"===typeof n.delay)if(0===n.delay)this._state.pastDelay=!0;else{var r=this;this._delay=setTimeout((function(){r._update({pastDelay:!0})}),n.delay)}if("number"===typeof n.timeout){var o=this;this._timeout=setTimeout((function(){o._update({timedOut:!0})}),n.timeout)}}this._res.promise.then((function(){e._update({}),e._clearTimeouts()})).catch((function(t){e._update({}),e._clearTimeouts()})),this._update({})}},{key:"_update",value:function(e){this._state=u({},this._state,{error:this._res.error,loaded:this._res.loaded,loading:this._res.loading},e),this._callbacks.forEach((function(e){return e()}))}},{key:"_clearTimeouts",value:function(){clearTimeout(this._delay),clearTimeout(this._timeout)}},{key:"getCurrentValue",value:function(){return this._state}},{key:"subscribe",value:function(e){var t=this;return this._callbacks.add(e),function(){t._callbacks.delete(e)}}}])&&r(t.prototype,n),o&&r(t,o),e}();function h(e){return function(e,t){var n=function(){if(!o){var t=new m(e,r);o={getCurrentValue:t.getCurrentValue.bind(t),subscribe:t.subscribe.bind(t),retry:t.retry.bind(t),promise:t.promise.bind(t)}}return o.promise()},r=Object.assign({loader:null,loading:null,delay:200,timeout:null,webpack:null,modules:null,suspense:!1},t);r.suspense&&(r.lazy=a.default.lazy(r.loader));var o=null;if(!d&&!r.suspense){var i=r.webpack?r.webpack():r.modules;i&&f.push((function(e){var t=!0,r=!1,o=void 0;try{for(var u,a=i[Symbol.iterator]();!(t=(u=a.next()).done);t=!0){var l=u.value;if(-1!==e.indexOf(l))return n()}}catch(s){r=!0,o=s}finally{try{t||null==a.return||a.return()}finally{if(r)throw o}}}))}var c=r.suspense?function(e,t){return a.default.createElement(r.lazy,u({},e,{ref:t}))}:function(e,t){n();var u=a.default.useContext(s.LoadableContext),i=l.useSubscription(o);return a.default.useImperativeHandle(t,(function(){return{retry:o.retry}}),[]),u&&Array.isArray(r.modules)&&r.modules.forEach((function(e){u(e)})),a.default.useMemo((function(){return i.loading||i.error?a.default.createElement(r.loading,{isLoading:i.loading,pastDelay:i.pastDelay,timedOut:i.timedOut,error:i.error,retry:o.retry}):i.loaded?a.default.createElement(function(e){return e&&e.__esModule?e.default:e}(i.loaded),e):null}),[e,i])};return c.preload=function(){return!r.suspense&&n()},c.displayName="LoadableComponent",a.default.forwardRef(c)}(p,e)}function _(e,t){for(var n=[];e.length;){var r=e.pop();n.push(r(t))}return Promise.all(n).then((function(){if(e.length)return _(e,t)}))}h.preloadAll=function(){return new Promise((function(e,t){_(c).then(e,t)}))},h.preloadReady=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];return new Promise((function(t){var n=function(){return d=!0,t()};_(f,e).then(n,n)}))},window.__NEXT_PRELOADREADY=h.preloadReady;var y=h;t.default=y},616:function(e,t,n){"use strict";n.d(t,{Z:function(){return a}});var r=n(4246),o=(n(7378),n(1151)),u=n(9967),i=n.n(u);function a(e){var t=e.title,n=e.children;return(0,r.jsxs)("div",{className:i().root,children:[null!=t&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(o.Z,{children:t}),(0,r.jsx)("h1",{children:t})]}),n]})}},597:function(e,t,n){"use strict";n.r(t),n.d(t,{__N_SSG:function(){return h},default:function(){return _}});var r=n(4246),o=n(7378),u=n(5218),i=n(616),a=function(){var e=(0,o.useState)(!1),t=e[0],n=e[1];return(0,o.useEffect)((function(){var e=setTimeout((function(){n(!0)}),500);return function(){clearTimeout(e)}}),[]),(0,r.jsxs)(i.Z,{children:[(0,r.jsx)("noscript",{children:"You need JavaScript enabled to use Stimbox."}),t&&"Loading..."]})};function l(){return(0,r.jsx)(i.Z,{title:"Error",children:"Failed to load the stimbox-component"})}var s="@boxes/";var c={};function f(e,t){"string"!==typeof t||t in e||!/^[a-z_-]+$/.test(t)&&!/^@boxes\/[a-z_-]+$/.test(t)||(c[t]=function(e){var t;if(e.startsWith(s)){var r=e.substring(s.length);t=function(){return n(7833)("./".concat(r,"/dist/index.js"))}}else t=function(){return Promise.reject(new Error("Invalid box module"))};return(0,u.default)((function(){return t().catch((function(e){return console.error(e),l}))}),{ssr:!1,loading:a})}(t))}var d=new Proxy(c,{get:function(e,t,n){return f(e,t),Reflect.get(e,t,n)},has:function(e,t){return f(e,t),Reflect.has(e,t)},getOwnPropertyDescriptor:function(e,t){return f(e,t),Reflect.getOwnPropertyDescriptor(e,t)}}),p=n(1151);function m(e){var t=e.metadata,n=d[t.moduleName];return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(p.Z,{children:t.name}),(0,r.jsx)(n,{})]})}m.isBox=!0;var h=!0,_=m},9967:function(e){e.exports={root:"Page_root__iKRo3",mergeUp:"Page_mergeUp__WNBHm",mergeDown:"Page_mergeDown___5kuA"}},5218:function(e,t,n){e.exports=n(9906)}},function(e){e.O(0,[774,888,179],(function(){return t=5151,e(e.s=t);var t}));var t=e.O();_N_E=t}]);