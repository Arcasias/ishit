!function(){return function e(t,n,o){function s(r,a){if(!n[r]){if(!t[r]){var l="function"==typeof require&&require;if(!a&&l)return l(r,!0);if(i)return i(r,!0);var c=new Error("Cannot find module '"+r+"'");throw c.code="MODULE_NOT_FOUND",c}var d=n[r]={exports:{}};t[r][0].call(d.exports,function(e){return s(t[r][1][e]||e)},d,d.exports,e,t,n,o)}return n[r].exports}for(var i="function"==typeof require&&require,r=0;r<o.length;r++)s(o[r]);return s}}()({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});const o=e("@odoo/owl"),s=e("./classes/Environment"),i=e("./components/App");o.Component.env=s.env,(new i.default).mount(document.body)},{"./classes/Environment":3,"./components/App":5,"@odoo/owl":11}],2:[function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))(function(s,i){function r(e){try{l(o.next(e))}catch(e){i(e)}}function a(e){try{l(o.throw(e))}catch(e){i(e)}}function l(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n(function(e){e(t)})).then(r,a)}l((o=o.apply(e,t||[])).next())})};Object.defineProperty(n,"__esModule",{value:!0});n.default=class{constructor(e){this.entries={},this.operation=e}load(e){e&&Object.assign(this.entries,Object.fromEntries(e))}get(e){return o(this,void 0,void 0,function*(){return e in this.entries||(this.entries[e]=yield this.operation(e)),this.entries[e]})}getKeys(){return Object.keys(this.entries)}invalidate(e=null){null===e?this.entries={}:delete this.entries[e]}}},{}],3:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.env=void 0;const o=e("@odoo/owl"),{electron:s}=window,i=null!=s?s:{send(){},on(){}},r=Boolean(s);n.env=Object.assign({},o.Component.env,{api:i,isDesktop:r})},{"@odoo/owl":11}],4:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.StorageManager=void 0;n.StorageManager=class{constructor(e,{parse:t,serialize:n}={}){this.entries={};const o=new RegExp(`^${e}:(.*)$`);this.getKey=(t=>`${e}:${t}`),this.findKey=(e=>e.match(o)),this.parse=t||(e=>e),this.serialize=n||(e=>e)}clear(){for(const e in this.entries)this.remove(e)}get(e,t=null){return this.has(e)?this.entries[e]:null!==t?this.set(e,t):null}has(e){return e in this.entries}keys(){return Object.keys(this.entries)}load(){for(const[e,t]of Object.entries(localStorage)){const n=this.findKey(e);n&&(this.entries[n[1]]=this.parse(t))}return Object.entries(this.entries)}remove(e){return!!this.has(e)&&(localStorage.removeItem(this.getKey(e)),delete this.entries[e],!0)}set(e,t){return this.entries[e]=t,localStorage.setItem(this.getKey(e),this.serialize(t)),t}}},{}],5:[function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))(function(s,i){function r(e){try{l(o.next(e))}catch(e){i(e)}}function a(e){try{l(o.throw(e))}catch(e){i(e)}}function l(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n(function(e){e(t)})).then(r,a)}l((o=o.apply(e,t||[])).next())})};Object.defineProperty(n,"__esModule",{value:!0});const s=e("@odoo/owl"),i=e("../../common/utils"),r=e("../../package.min.json"),a=e("../classes/Cache"),l=e("../classes/StorageManager"),c=e("./Dropdown"),d=e("./ImageComponent"),u=e("./WindowControls"),{xml:h,css:p}=s.tags,{useExternalListener:f,useRef:m,useState:g}=s.hooks,v=["all","gif","png"],_=["png","jpg","jpeg"],w=5,b=5,y=/"https:\/\/[\w\/\.-]+\.(png|jpg|jpeg|gif)"/gi,$=/(image|text)\/(\w+);?/i,x=/\b(gif|png)\b/gi,C="https://",E=2500,L={downloadPath:{key:"downloadPath",text:"Download path",type:"text",defaultValue:null,apiEventKey:"set-download-path",format:e=>e.replace(/['"]+/g,"").trim()},tolerance:{key:"tolerance",text:"Background removal tolerance",type:"range",defaultValue:20,min:1,max:255,format:e=>Number(e)},contiguous:{key:"contiguous",text:"Remove contiguous pixels",type:"checkbox",defaultValue:!0,format:e=>Boolean(e)}};function N(e){return e.toLowerCase().replace(x,"").replace(/['"\<\>]+/g,"").replace(/[\s\n_-]+/g," ").trim()}function k(e,t){const n=m(e),o=g({value:null}),i=`${t}-enter`,r=`${t}-leave`;let a=!1;return s.hooks.onPatched(()=>{if(a&&n.el){a=!1;let e=!0;n.el.addEventListener("animationend",()=>{n.el&&(e?(n.el.classList.remove(i),e=!1):(n.el.classList.remove(r),o.value=null))}),n.el.classList.add(i)}}),{get value(){return o.value},set value(e){var t;null===e?null===(t=n.el)||void 0===t||t.classList.add(r):(o.value=e,n.el||(a=!0))}}}function I(e,t){const n=m(e);let o=!1,i=null;function r(){o&&!n.el?o=!1:!o&&n.el&&(o=!0,i||(i=t(n.el)),n.el.setAttribute("style",i))}s.hooks.onMounted(r),s.hooks.onPatched(r);let a=0;f(window,"resize",()=>{i=null,o=!1,window.clearTimeout(a),a=window.setTimeout(r,250)})}class S extends s.Component{constructor(){super(...arguments),this.state=g({activeSuggestion:null,ext:"all",imageMetadata:{},pageIndex:0,query:"",searching:!1,showSuggestions:!1,updateId:0,urls:[]}),this.currentSearch="",this.configManager=new l.StorageManager("cfg"),this.favoritesManager=new l.StorageManager("fav",{parse:e=>e.split(",").map(e=>C+e),serialize:e=>e.map(e=>e.slice(C.length)).join(",")}),this.focusedImage=null,this.hasClipboardAccess=!1,this.hoveredImage=null,this.imageData={},this.imageMimeTypes={},this.modalManager=k("settings","slide-top"),this.notifyTimeout=0,this.notificationManager=k("notification","slide-right"),this.toFocus=null,this.searchCache=new a.default(e=>this.fetchUrls(e)),this.searchInputRef=m("search-input"),this.filteredConfigItems=Object.values(L).filter(e=>this.env.isDesktop||!e.apiEventKey),this.previewCanvasRef=m("preview-canvas"),this.willUpdateCanvas=!1,this.extensionItems=v.map(e=>({id:e,value:e.toUpperCase()})),this.cols=w,this.rows=b,I("image-gallery",e=>{const{x:t,y:n}=e.getBoundingClientRect();return`height: ${window.innerHeight-n-t}px;`}),I("image-preview",e=>{const{x:t,y:n,width:o}=e.getBoundingClientRect(),s=e.previousElementSibling.getBoundingClientRect(),i=e.nextElementSibling.getBoundingClientRect(),r=n-(s.y+s.height),a=window.innerWidth-t-o;return`height: ${window.innerHeight-n-i.height-r-a}px;`}),f(window,"keydown",this.onWindowKeydown)}get activeImage(){return this.hoveredImage||this.focusedImage}get pageCount(){return Math.ceil(this.state.urls.length/(this.cols*this.rows))}willStart(){return o(this,void 0,void 0,function*(){const e=this.favoritesManager.load();if(this.searchCache.load(e),this.configManager.load(),this.env.isDesktop)for(const e of Object.values(L))if(e.apiEventKey){const t=this.configGet(e.key);null!==t&&this.env.api.send(e.apiEventKey,t)}const t=yield navigator.permissions.query({name:"clipboard-write"});this.hasClipboardAccess="granted"===t.state})}mounted(){document.title=r.name,this.focusSearchBar()}patched(){const e=this.activeImage;this.willUpdateCanvas&&e&&this.previewCanvasRef.el&&(this.willUpdateCanvas=!1,e.complete?this.drawPreview():e.addEventListener("load",()=>this.drawPreview(),{once:!0})),null!==this.toFocus&&this.focusImage(this.toFocus)}applyFavorite({detail:e}){this.state.query=e.value,this.state.ext=e.badge?e.badge.toLowerCase():"all",this.search()}applySearchExtension({detail:e}){this.state.ext=e.id}clearFavorites(){this.favoritesManager.clear(),this.state.query="",this.forceUpdate()}closeSettings(){this.modalManager.value&&(this.modalManager.value=null,this.forceUpdate(!0))}configGet(e){const{format:t,key:n,defaultValue:o}=L[e];return t(this.configManager.get(n,o))}configSet(e,t,n){const o=L[e],s=n.target,i="checkbox"===o.type?"checked":"value";if(s[i]=o.format(s[i]),this.configManager.set(o.key,s[i]),o.apiEventKey)this.env.api.send(o.apiEventKey,s[i]);else{const e=Boolean(this.activeImage&&this.imageData[this.activeImage.src]);this.imageData={},t===this.activeImage&&e&&(this.drawPreview(),this.toggleBackground())}}copyActiveImage(){return o(this,void 0,void 0,function*(){if(!this.activeImage||!this.hasClipboardAccess)return;if(!this.isActiveImageEditable())return this.copyActiveImageUrl();if(!this.previewCanvasRef.el)return;const e=this.previewCanvasRef.el,t=yield new Promise(t=>e.toBlob(e=>t(e),"image/png")),n=[new ClipboardItem({"image/png":t})];yield navigator.clipboard.write(n),this.notify("Image copied!")})}copyActiveImageUrl(){return o(this,void 0,void 0,function*(){const e=this.activeImage;e&&this.hasClipboardAccess&&(yield navigator.clipboard.writeText(e.src),this.notify("URL copied!"))})}drawPreview(){const e=this.activeImage,t=this.previewCanvasRef.el;if(!e||!t)return;t.width=e.naturalWidth,t.height=e.naturalHeight;const n=t.getContext("2d"),o=this.imageData[e.src];o?n.putImageData(o,0,0):n.drawImage(e,0,0)}fetchUrls(e){return o(this,void 0,void 0,function*(){const t=Date.now(),n=(0,i.getGoogleImageUrl)(e),{response:o}=yield(0,i.ajax)(n,{type:"text"}),s=o.match(y)||[],r=Date.now()-t;return(0,i.log)(`Search query {{#00d000}}"${e}"{{inherit}} finished for a total of ${s.length} results in {{#ff0080}}${r}{{inherit}}ms`),s.map(e=>e.slice(1,-1))})}focusImage(e,t=!1){if(t)return void(this.toFocus=e);const n=this.el.querySelectorAll(".image-gallery .image-wrapper")[e];n&&(this.setFocusedImage(!0,n),this.focusedImage&&(n.focus(),this.toFocus=null))}focusSearchBar(){var e;return null===(e=this.searchInputRef.el)||void 0===e?void 0:e.focus()}forceUpdate(e=!1){e&&(this.willUpdateCanvas=!0),this.state.updateId++}getActiveImageExtension(){const e=this.activeImage;let t=null;if(e){const n=this.state.imageMetadata[e.src];if(null==n?void 0:n.mimetype){const e=n.mimetype.match($);e&&"image"===e[1]&&(t=e[2])}t||(t=e.src.split(".").pop()||null)}return t||"unknown"}getActiveImageSize(){const{src:e}=this.activeImage,t=this.state.imageMetadata[e];return t?`${t.size[0]}x${t.size[1]}`:"loading..."}getCurrentPageUrls(){const e=this.rows*this.cols,t=this.state.pageIndex*e;return this.state.urls.slice(t,t+e)}getFavorites(){return this.favoritesManager.keys().map(e=>{let t=null;return{id:e,value:e.replace(x,e=>(t=e.toUpperCase(),"")).trim(),badge:t}})}getFullQuery(e=!0){let t=e?N(this.state.query):this.state.query;return t&&"all"!==this.state.ext&&(t+=" "+this.state.ext),t}getImage(e){return e instanceof Event&&(e=e.target),e instanceof HTMLImageElement?e:e.querySelector("img")}getPagerValue(){const e=this.cols*this.rows,t=this.state.urls.length,n=this.state.pageIndex*e;return`${n+1}-${Math.min(n+e,t)} / ${t}`}getSuggestions(){const e=N(this.state.query);return e?[...new Set(this.searchCache.getKeys().map(N).filter(Boolean))].filter(t=>t!==e&&t.startsWith(e)):[]}isActiveImageEditable(){return _.includes(this.getActiveImageExtension())}notify(e){this.notificationManager.value=e,window.clearTimeout(this.notifyTimeout),this.notifyTimeout=window.setTimeout(()=>{this.notificationManager.value=null},E)}onImageKeydown(e,t){const n=t.target,o=this.rows*this.cols;switch(t.key){case"ArrowUp":{const t=e-this.cols;return void(t>=0&&this.focusImage(t))}case"ArrowDown":{const t=e+this.cols;return void(t<o&&this.focusImage(t))}case"ArrowRight":{const t=e+1;return void(t<o?this.focusImage(t):this.pageNext())}case"ArrowLeft":{const t=e-1;return void(t>=0?this.focusImage(t):this.pagePrev())}case"Escape":return void n.blur();case"c":return void(t.ctrlKey&&this.copyActiveImage())}}onImageReady(e){const{img:t,contentType:n}=e.detail;this.state.imageMetadata[t.src]={size:[t.naturalWidth,t.naturalHeight],mimetype:n}}onSearchKeydown(e){const{activeSuggestion:t}=this.state,n=null!==t;switch(e.key){case"ArrowUp":return e.preventDefault(),void(n&&t>0?this.state.activeSuggestion--:this.state.activeSuggestion=this.getSuggestions().length-1);case"ArrowDown":{e.preventDefault();const o=this.getSuggestions();return void(n&&t<o.length-1?this.state.activeSuggestion++:this.state.activeSuggestion=0)}case"Enter":if(n){const e=this.getSuggestions()[t];e&&(this.state.query=e)}return void this.search();case"Escape":return void(this.state.query="")}}onWindowKeydown({key:e,ctrlKey:t}){switch(e){case"F12":return void this.env.api.send("toggle-dev-tools");case"F5":return void location.reload();case"Escape":return this.state.showSuggestions=!1,this.closeSettings(),void this.focusSearchBar();case"Enter":{const e=document.activeElement;return void((e===document.body||(null==e?void 0:e.classList.contains("image-wrapper")))&&this.copyActiveImage())}case"f":return void(t&&this.focusSearchBar());case"I":return void(t&&this.env.api.send("toggle-dev-tools"));case"r":return void(t&&location.reload())}}openSettings(){this.modalManager.value=!0}pageNext(){return this.pageSet(this.state.pageIndex+1)}pagePrev(){return this.pageSet(this.state.pageIndex-1,this.rows*this.cols-1)}pageSet(e,t=0){e<0||e>=this.pageCount||this.state.pageIndex===e||(this.state.pageIndex=e,this.focusImage(t,!0))}range(e){return(0,i.range)(e)}toggleBackground(){if(!this.previewCanvasRef.el||!this.activeImage)return;if(this.imageData[this.activeImage.src])return delete this.imageData[this.activeImage.src],void this.forceUpdate(!0);const e=this.previewCanvasRef.el,{width:t,height:n}=e,o=e.getContext("2d"),s=o.getImageData(0,0,t,n),r=s.data,a=[0,4*t,t*n*4-4*t,t*n*4],l=[];for(const e of a){if(0===r[e+3])return void this.notify("Background is already transparent!");if(l.length)break;for(const t of a){if(e===t)continue;const n=r.slice(t,t+3),o=r.slice(e,e+3);if(n.every((e,t)=>e===o[t])){l.push(...n);break}}}const[c,d,u]=l.length?l:r,h=this.configGet("contiguous"),p=this.configGet("tolerance");if((0,i.log)(`Replacing color: rgb(${c}, ${d}, ${u}) / tolerance: ${p} / apply to contiguous: ${h}`),h)for(const e of a)(0,i.floodFillPixels)(r,e,t,[c,d,u],p);else for(const e of a)(0,i.fullFillPixels)(r,e,[c,d,u],p);this.imageData[this.activeImage.src]=s,o.putImageData(s,0,0),this.forceUpdate()}removeFavorite({detail:e}){this.favoritesManager.remove(e.id),this.forceUpdate()}reset(...e){const t={activeSuggestion:null,ext:"all",imageMetadata:{},pageIndex:0,query:"",searching:!1,showSuggestions:!1,updateId:0,urls:[]};for(const n of e)delete t[n];Object.assign(this.state,t),this.currentSearch="",this.imageData={}}search(){return o(this,void 0,void 0,function*(){const e=this.state.query.match(x);e&&(this.state.ext=e[0]),this.state.query=N(this.state.query);const t=this.getFullQuery(!1);if(t===this.currentSearch)return;if(this.reset("query","ext"),this.currentSearch=t,!t.length)return void(this.state.urls=[]);let n=null,o=null;this.state.searching=!0;try{n=yield this.searchCache.get(t)}catch(e){o=e}if(t===this.currentSearch){if(!n)throw o;this.state.urls=n,this.focusImage(0,!0),this.state.searching=!1}})}setFocusedImage(e,t){this.focusedImage=e?this.getImage(t):null,this.forceUpdate(!0)}setHoveredImage(e,t){this.hoveredImage=e?this.getImage(t):null,this.forceUpdate(!0)}toggleFavorite(){const e=this.currentSearch;this.favoritesManager.remove(e)||this.favoritesManager.set(e,this.state.urls),this.forceUpdate()}}n.default=S,S.components={ImageComponent:d.default,Dropdown:c.default,WindowControls:u.default},S.template=h`
    <div class="app">
      <t t-set="favorites" t-value="getFavorites()" />
      <t t-set="suggestions" t-value="getSuggestions()" />
      <t t-if="modalManager.value">
        <div class="modal-backdrop"></div>
        <div class="modal" tabindex="-1" role="dialog">
          <div class="modal-dialog slide-top" role="document" t-ref="settings">
            <div class="modal-content">
              <header class="modal-header">
                <h5 class="modal-title">Settings</h5>
                <button
                  type="button"
                  class="btn btn-sm"
                  t-on-click="closeSettings"
                >
                  <i class="fas fa-times"></i>
                </button>
              </header>
              <main class="modal-body">
                <div
                  t-foreach="filteredConfigItems"
                  t-as="item"
                  t-key="item.key"
                  t-att-class="{ 'mb-3': !item_last, 'form-check': item.type === 'checkbox' }"
                  t-on-change="configSet(item.key, true)"
                >
                  <label
                    t-attf-class="form{{ item.type === 'checkbox' ? '-check' : '' }}-label"
                    t-esc="item.text"
                  ></label>
                  <input
                    t-if="item.type === 'checkbox'"
                    t-att-id="item.key"
                    type="checkbox"
                    class="form-check-input"
                    t-att-checked="configGet(item.key)"
                  />
                  <input
                    t-elif="item.type === 'range'"
                    type="range"
                    class="form-range h-100"
                    t-att-min="item.min"
                    t-att-max="item.max"
                    step="1"
                    t-att-value="configGet(item.key)"
                  />
                  <input
                    t-else=""
                    t-att-type="item.type"
                    class="form-control"
                    t-att-value="configGet(item.key)"
                  />
                </div>
              </main>
              <footer class="modal-footer">
                <span class="form-text text-muted fst-italic me-auto">
                  Changes are saved automatically
                </span>
                <button
                  type="button"
                  class="btn btn-primary"
                  t-on-click="closeSettings"
                >
                  Ok
                </button>
              </footer>
            </div>
          </div>
        </div>
      </t>
      <WindowControls t-if="env.isDesktop" />
      <div
        t-if="notificationManager.value"
        class="notification slide-right alert alert-success"
        role="alert"
        t-ref="notification"
        t-esc="notificationManager.value"
      ></div>
      <header class="header">
        <nav class="navbar">
          <div class="container-fluid">
            <h5 class="navbar-brand m-0">
              <span class="text-primary">i</span>mage
              <span class="text-primary">S</span>earch from
              <span class="text-primary">H</span>uman
              <span class="text-primary">I</span>nput
              <span class="text-primary">T</span>ext
            </h5>
            <button
              type="button"
              class="btn btn-outline-primary"
              t-on-click="openSettings"
            >
              <i class="fas fa-cog"></i>
            </button>
          </div>
        </nav>
        <nav class="navbar">
          <div class="container-fluid flex-nowrap">
            <Dropdown
              t-if="favorites.length"
              class="me-2"
              title="'Favorites'"
              items="favorites"
              deletable="true"
              t-on-select.stop="applyFavorite"
              t-on-clear.stop="clearFavorites"
              t-on-remove.stop="removeFavorite"
            />
            <div class="input-group">
              <div class="input-wrapper form-control bg-white">
                <input
                  type="text"
                  class="me-2"
                  placeholder="Search on Google Image"
                  aria-label="Search"
                  t-ref="search-input"
                  t-model="state.query"
                  t-on-focus="state.showSuggestions = true"
                  t-on-blur="state.showSuggestions = false"
                  t-on-keydown="onSearchKeydown"
                />
                <div
                  t-if="state.showSuggestions and suggestions.length"
                  class="dropdown-menu"
                >
                  <a
                    t-foreach="suggestions"
                    t-as="query"
                    t-key="query_index"
                    t-att-class="{ active: state.activeSuggestion === query_index }"
                    class="dropdown-item"
                    href="#"
                    t-esc="query"
                  ></a>
                </div>
                <button
                  t-if="currentSearch"
                  class="btn badge text-warning me-2 p-0"
                  type="button"
                  t-on-click="toggleFavorite"
                >
                  <i
                    t-attf-class="{{ favoritesManager.has(currentSearch) ? 'fas' : 'far' }} fa-star text-warning"
                  ></i>
                </button>
                <Dropdown
                  title="state.ext.toUpperCase()"
                  small="true"
                  items="extensionItems"
                  t-on-select.stop="applySearchExtension"
                />
              </div>
              <button
                t-attf-class="btn btn{{ getFullQuery() === currentSearch ? '-outline' : '' }}-primary"
                t-on-click="search"
              >
                Search
              </button>
              <button class="btn text-primary" t-on-click="reset">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </nav>
      </header>
      <main class="main container-fluid">
        <t t-if="state.urls.length">
          <section class="col me-2">
            <nav class="pager nav mb-2">
              <ul class="pagination m-0 me-auto">
                <li class="page-item" t-on-click.prevent="pagePrev()">
                  <button
                    class="page-link"
                    t-att-disabled="state.pageIndex lte 0"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                </li>
                <li
                  t-foreach="range(pageCount)"
                  t-as="page"
                  t-key="page"
                  class="page-item"
                  t-att-class="{ active: state.pageIndex === page }"
                  t-on-click.prevent="pageSet(page)"
                >
                  <button class="page-link" t-esc="page + 1"></button>
                </li>
                <li class="page-item" t-on-click.prevent="pageNext()">
                  <button
                    class="page-link"
                    t-att-disabled="state.pageIndex gte pageCount - 1"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
              <span
                class="input-group-text ms-auto"
                t-esc="getPagerValue()"
              ></span>
            </nav>
            <ul class="image-gallery" t-ref="image-gallery">
              <li
                t-foreach="getCurrentPageUrls()"
                t-as="url"
                t-key="url_index"
                class="image-wrapper"
                tabindex="1"
                t-att-class="{ empty: !url, selected: focusedImage and focusedImage.src === url }"
                t-on-mouseenter="setHoveredImage(true)"
                t-on-mouseleave="setHoveredImage(false)"
                t-on-focus="setFocusedImage(true)"
                t-on-click="copyActiveImage"
                t-on-keydown="onImageKeydown(url_index)"
              >
                <ImageComponent src="url" t-on-ready.stop="onImageReady" />
              </li>
            </ul>
          </section>
          <section class="col">
            <div class="preview me-0" t-if="activeImage">
              <div class="btn-toolbar">
                <a
                  class="btn btn-outline-primary me-2"
                  title="Download"
                  download="download"
                  t-att-href="activeImage.src"
                  ><i class="fas fa-download"></i
                ></a>
                <div class="btn-group">
                  <button
                    class="btn btn-outline-primary"
                    title="Copy image"
                    t-on-click="copyActiveImage"
                  >
                    <i class="fas fa-copy"></i>
                  </button>
                  <button
                    class="btn btn-outline-primary"
                    title="Copy URL"
                    t-on-click="copyActiveImageUrl"
                  >
                    <i class="fas fa-code"></i>
                  </button>
                </div>
                <div class="image-badges ms-auto">
                  <span
                    class="badge border border-primary text-secondary me-2"
                    t-esc="getActiveImageSize()"
                  ></span>
                  <span
                    class="badge border border-primary text-secondary"
                    t-esc="getActiveImageExtension().toUpperCase()"
                  ></span>
                </div>
              </div>
              <div
                class="image-wrapper my-2"
                t-ref="image-preview"
                t-on-click="copyActiveImage"
              >
                <canvas
                  t-if="isActiveImageEditable()"
                  t-ref="preview-canvas"
                ></canvas>
                <ImageComponent
                  t-else=""
                  src="activeImage.src"
                  alt="'Image preview'"
                  preload="false"
                />
              </div>
              <div t-if="isActiveImageEditable()" class="input-group">
                <button
                  class="btn btn-outline-primary"
                  t-on-click="toggleBackground"
                >
                  Background
                  <i
                    t-attf-class="fas fa-toggle-{{ imageData[activeImage.src] ? 'off' : 'on' }}"
                  ></i>
                </button>
                <div class="form-control">
                  <input
                    type="range"
                    class="form-range h-100"
                    title="Tolerance"
                    min="${L.tolerance.min}"
                    max="${L.tolerance.max}"
                    step="1"
                    t-att-value="configGet('tolerance')"
                    t-on-change="configSet('tolerance', activeImage)"
                  />
                </div>
                <label for="contiguous" class="input-group-text">
                  <input
                    id="contiguous"
                    type="checkbox"
                    class="form-check-input"
                    title="Remove contiguous pixels"
                    t-att-checked="configGet('contiguous')"
                    t-on-change="configSet('contiguous', activeImage)"
                  />
                </label>
              </div>
              <div t-else="" class="input-group">
                <span class="input-group-text w-100">No actions available</span>
              </div>
            </div>
            <div t-else="" class="default-message">
              <span class="message text-muted">Source unavailable</span>
            </div>
          </section>
        </t>
        <div t-elif="state.searching" class="default-message">
          <span class="message text-muted">Searching ...</span>
        </div>
        <div t-else="" class="default-message">
          <span class="message text-muted me-3">No images to display</span>
        </div>
      </main>
    </div>
  `,S.style=p`
    .app {
      display: flex;
      flex-direction: column;
      height: 100%;

      .main {
        flex: 1;
        display: flex;
        justify-content: center;
        position: relative;
      }

      .notification {
        position: absolute;
        top: 3rem;
        opacity: 0.9;
        z-index: 9999;
      }
    }

    .input-wrapper {
      display: flex;
      align-items: center;

      input {
        flex: 1 1 auto;
        background: inherit;
        color: inherit;
        border: none;
        outline: none;
      }
    }

    .image-gallery {
      display: grid;
      grid-template-columns: repeat(${w}, ${100/w}%);
      grid-template-rows: repeat(${b}, ${100/b}%);
    }

    .image-badges {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
    }

    .preview {
      height: 100%;
      display: flex;
      flex-flow: column nowrap;

      .image-wrapper {
        overflow-y: auto;

        img {
          height: initial;
        }

        canvas {
          width: 100%;
        }
      }
    }

    .image-wrapper {
      outline: none;
      border: 3px solid transparent;

      &:not(.empty) {
        cursor: pointer;

        &.selected,
        &:hover {
          border-color: ${"#ff0080"};
          border-radius: 3px;
        }
      }
    }

    .default-message {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .message {
        text-align: center;
        font-size: 2rem;
        font-style: italic;
      }
    }

    .page-link[disabled] {
      opacity: 0.4;
    }
  `},{"../../common/utils":9,"../../package.min.json":10,"../classes/Cache":2,"../classes/StorageManager":4,"./Dropdown":6,"./ImageComponent":7,"./WindowControls":8,"@odoo/owl":11}],6:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});const o=e("@odoo/owl"),{xml:s,css:i}=o.tags,{useExternalListener:r,useRef:a,useState:l}=o.hooks;class c extends o.Component{constructor(){super(...arguments),this.buttonRef=a("main-button"),this.state=l({show:!1,promptClear:!1}),r(window,"click",this.onWindowClick),r(window,"keydown",this.onWindowKeydown)}close(){this.state.show=!1,this.state.promptClear=!1}focusNext(e){let t=e.nextSibling;for(;null==t?void 0:t.classList.contains("dropdown-divider");)t=t.nextSibling;(null==t?void 0:t.classList.contains("dropdown-item"))&&t.focus()}focusPrevious(e){let t=e.previousSibling;for(;null==t?void 0:t.classList.contains("dropdown-divider");)t=t.previousSibling;(null==t?void 0:t.classList.contains("dropdown-item"))?t.focus():this.buttonRef.el.focus()}onButtonKeydown({key:e}){var t;switch(e){case"ArrowDown":return void(null===(t=this.el.querySelector(".dropdown-item"))||void 0===t||t.focus())}}onItemKeydown(e,t){const n=t.target;switch(t.key){case"ArrowUp":return this.focusPrevious(n);case"ArrowDown":return this.focusNext(n);case"Delete":return void(e&&(this.focusPrevious(n),this.trigger("remove",e)))}}onSelect(e){this.trigger("select",e),this.close()}onWindowClick(e){var t;(null===(t=this.el)||void 0===t?void 0:t.contains(e.target))||this.close()}onWindowKeydown({key:e}){"Escape"===e&&this.close()}open(){this.state.show=!0}toggle(){this.state.show?this.close():this.open()}}n.default=c,c.template=s`
    <div class="dropdown">
      <button
        class="dropdown-button btn"
        t-att-class="props.small ? 'badge border border-primary text-primary' : 'btn-outline-primary'"
        t-on-click="toggle()"
        t-on-keydown="onButtonKeydown"
        t-ref="main-button"
      >
        <t t-esc="props.title" />
        <i
          t-attf-class="fas fa-caret-{{ state.show ? 'up' : 'down' }} ms-2"
        ></i>
      </button>
      <ul t-if="state.show" class="dropdown-menu">
        <a
          t-foreach="props.items"
          t-as="item"
          t-key="item.id"
          href="#"
          class="dropdown-item"
          t-on-click="onSelect(item)"
          t-on-keydown="onItemKeydown(item)"
        >
          <span class="item-value">
            <t t-esc="item.value" />
            <span
              t-if="item.badge"
              class="badge rounded-pill border border-primary text-primary ms-2"
              t-esc="item.badge"
            ></span>
          </span>
          <span t-if="props.deletable" class="item-controls ms-2">
            <span
              class="remove-item dropdown-action"
              t-on-click.stop="trigger('remove', item)"
            >
              <i class="fas fa-times text-secondary"></i>
            </span>
          </span>
        </a>
        <t t-if="props.deletable">
          <div class="dropdown-divider"></div>
          <div t-if="state.promptClear" class="dropdown-item">
            <button
              class="dropdown-action btn btn-sm text-success"
              t-on-click.stop="trigger('clear')"
            >
              Yes
              <i class="fas fa-check ms-2"></i>
            </button>
            <button
              class="dropdown-action btn btn-sm text-danger"
              t-on-click.stop="state.promptClear = false"
            >
              No
              <i class="fas fa-times ms-2"></i>
            </button>
          </div>
          <button
            t-else=""
            class="dropdown-item dropdown-action btn text-danger"
            t-on-click.stop="state.promptClear = true"
            t-on-keydown="onItemKeydown(null)"
          >
            Clear <i class="fas fa-trash-alt"></i>
          </button>
        </t>
      </ul>
    </div>
  `,c.style=i`
    .dropdown-button {
      display: flex;
      align-items: center;
    }

    .dropdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `},{"@odoo/owl":11}],7:[function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))(function(s,i){function r(e){try{l(o.next(e))}catch(e){i(e)}}function a(e){try{l(o.throw(e))}catch(e){i(e)}}function l(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n(function(e){e(t)})).then(r,a)}l((o=o.apply(e,t||[])).next())})};Object.defineProperty(n,"__esModule",{value:!0});const s=e("@odoo/owl"),i=e("../../common/utils"),{xml:r,css:a}=s.tags,l=/.*\/(.*)\.\w+$/;class c extends s.Component{constructor(){super(...arguments),this.contentType=null,this.state=(0,s.useState)({error:!1,src:this.props.preload?null:this.props.src})}get alt(){return this.props.alt||this.state.src.match(l)[1]}get isLoaded(){return Boolean(this.state.src&&!this.state.error)}willStart(){return o(this,void 0,void 0,function*(){this.props.src&&(yield this.load(this.props.src))})}willUpdateProps(e){return o(this,void 0,void 0,function*(){e.src!==this.props.src&&(this.state.error=!1,this.state.src=e.preload?null:e.src,e.src&&(yield this.load(e.src)))})}load(e){return o(this,void 0,void 0,function*(){this.props.preload?(0,i.ajax)(e,{type:"blob"}).then(t=>{this.contentType=t.getResponseHeader("content-type"),this.state.src=e}).catch(()=>this.onError()):this.state.src=e})}onError(){this.state.error=!0}onLoad(e){const t=e.target;this.state.error=!1,this.trigger("ready",{img:t,contentType:this.contentType})}}n.default=c,c.props={src:String,alt:String,preload:Boolean},c.defaultProps={preload:!0},c.template=r`
    <div class="img-component" t-att-class="{ 'no-image': !isLoaded }">
      <img
        t-if="isLoaded"
        t-att-src="state.src"
        t-att-alt="alt"
        t-on-load="onLoad"
        t-on-error="onError"
      />
      <i t-elif="state.error" class="far fa-frown"></i>
      <i t-else="" class="fas fa-circle-notch loading"></i>
    </div>
  `,c.style=a`
    .img-component {
      width: 100%;
      height: 100%;

      &.no-image {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8vh;
        color: #484858;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .loading {
        animation: spin ease-in-out 1s infinite;
      }
    }
  `},{"../../common/utils":9,"@odoo/owl":11}],8:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});const o=e("@odoo/owl"),s=e("../../package.min.json"),{xml:i,css:r}=o.tags;class a extends o.Component{}n.default=a,a.template=i`
    <nav class="window-controls nav">
      <div class="text-black-50 ms-2">${s.name} v${s.version}</div>
      <ul class="buttons">
        <li>
          <button
            class="btn btn-sm text-secondary"
            tabindex="-1"
            t-on-mousedown.prevent=""
            t-on-click.prevent="env.api.send('window-minimize')"
          >
            <i class="fas fa-minus"></i>
          </button>
        </li>
        <li>
          <button
            class="btn btn-sm text-secondary"
            tabindex="-1"
            t-on-mousedown.prevent=""
            t-on-click.prevent="env.api.send('window-maximize')"
          >
            <i class="far fa-square"></i>
          </button>
        </li>
        <li>
          <button
            class="btn btn-sm text-danger"
            tabindex="-1"
            t-on-mousedown.prevent=""
            t-on-click.prevent="env.api.send('window-close')"
          >
            <i class="fas fa-times"></i>
          </button>
        </li>
      </ul>
    </nav>
  `,a.style=r`
    .window-controls {
      align-items: center;
      justify-content: space-between;
      background-color: rgba(0, 0, 0, 0.3);
      user-select: none;
      -webkit-app-region: drag;

      .buttons {
        display: flex;
        margin: 0;
        -webkit-app-region: no-drag;

        .btn:focus {
          box-shadow: none;
        }
      }
    }
  `},{"../../package.min.json":10,"@odoo/owl":11}],9:[function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))(function(s,i){function r(e){try{l(o.next(e))}catch(e){i(e)}}function a(e){try{l(o.throw(e))}catch(e){i(e)}}function l(e){var t;e.done?s(e.value):(t=e.value,t instanceof n?t:new n(function(e){e(t)})).then(r,a)}l((o=o.apply(e,t||[])).next())})};function s(...e){const t=[],n=e.join(" ").replace(/\{\{([\w\s#\(\),)]+)\}\}/g,(e,n)=>(t.push(`color:${n}`),"%c"));console.log(n,...t)}Object.defineProperty(n,"__esModule",{value:!0}),n.range=n.log=n.ipcRendererLog=n.ipcMainLog=n.getGoogleImageUrl=n.floodFillPixels=n.fullFillPixels=n.ajax=void 0,n.ajax=function(e,t={}){return o(this,void 0,void 0,function*(){return new Promise((n,o)=>{var s,i;const r=new XMLHttpRequest;r.responseType=null!==(s=t.type)&&void 0!==s?s:"json",r.onload=(()=>n(r)),r.onerror=(()=>o(r)),r.open(null!==(i=t.method)&&void 0!==i?i:"GET",e),r.send()})})},n.fullFillPixels=function(e,t,[n,o,s],i){const r=i/2,[a,l]=[n-r,n+r],[c,d]=[s-r,s+r],[u,h]=[o-r,o+r];for(let n=t;n<e.length;n+=4)e[n+3]&&e[n]>a&&e[n]<=l&&e[n+1]>u&&e[n+1]<=h&&e[n+2]>c&&e[n+2]<=d&&(e[n+3]=0)},n.floodFillPixels=function(e,t,n,[o,s,i],r){const a=[t],l=r/2,[c,d]=[o-l,o+l],[u,h]=[i-l,i+l],[p,f]=[s-l,s+l];for(;a.length;){const t=a.shift();e[t+3]&&e[t]>c&&e[t]<=d&&e[t+1]>p&&e[t+1]<=f&&e[t+2]>u&&e[t+2]<=h&&(e[t+3]=0,a.push(t+4,t-4,t+4*n,t-4*n))}},n.getGoogleImageUrl=function(e){return`https://www.google.com/search?q=${e.replace(/\s+/g,"+")}&tbm=isch`},n.ipcMainLog=function(...e){s("{{#6610f2}}[IPC-MAIN]{{inherit}}",...e)},n.ipcRendererLog=function(...e){s("{{#007bff}}[IPC-RENDERER]{{inherit}}",...e)},n.log=s,n.range=function(e){return[...new Array(e)].map((e,t)=>t)}},{}],10:[function(e,t,n){t.exports={name:"ishit",version:"0.0.7"}},{}],11:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});class o{constructor(){this.subscriptions={}}on(e,t,n){if(!n)throw new Error("Missing callback");this.subscriptions[e]||(this.subscriptions[e]=[]),this.subscriptions[e].push({owner:t,callback:n})}off(e,t){const n=this.subscriptions[e];n&&(this.subscriptions[e]=n.filter(e=>e.owner!==t))}trigger(e,...t){const n=this.subscriptions[e]||[];for(let e=0,o=n.length;e<o;e++){const o=n[e];o.callback.call(o.owner,...t)}}clear(){this.subscriptions={}}}class s{constructor(){this.rev=1,this.allowMutations=!0,this.weakMap=new WeakMap}notifyCB(){}observe(e,t){if(null===e||"object"!=typeof e||e instanceof Date||e instanceof Promise)return e;return(this.weakMap.get(e)||this._observe(e,t)).proxy}revNumber(e){const t=this.weakMap.get(e);return t?t.rev:0}_observe(e,t){var n=this;const o=new Proxy(e,{get(t,o){const s=t[o];return n.observe(s,e)},set(e,t,o){if(o!==e[t]){if(!n.allowMutations)throw new Error(`Observed state cannot be changed here! (key: "${t}", val: "${o}")`);n._updateRevNumber(e),e[t]=o,n.notifyCB()}return!0},deleteProperty:(e,t)=>(t in e&&(delete e[t],n._updateRevNumber(e),n.notifyCB()),!0)}),s={value:e,proxy:o,rev:this.rev,parent:t};return this.weakMap.set(e,s),this.weakMap.set(s.proxy,s),s}_updateRevNumber(e){this.rev++;let t=this.weakMap.get(e),n=e;do{(t=this.weakMap.get(n)).rev++}while((n=t.parent)&&n!==e)}}const i="true,false,NaN,null,undefined,debugger,console,window,in,instanceof,new,function,return,this,eval,void,Math,RegExp,Array,Object,Date".split(","),r=Object.assign(Object.create(null),{and:"&&",or:"||",gt:">",gte:">=",lt:"<",lte:"<="}),a=Object.assign(Object.create(null),{"{":"LEFT_BRACE","}":"RIGHT_BRACE","[":"LEFT_BRACKET","]":"RIGHT_BRACKET",":":"COLON",",":"COMMA","(":"LEFT_PAREN",")":"RIGHT_PAREN"}),l="...,.,===,==,+,!==,!=,!,||,&&,>=,>,<=,<,?,-,*,/,%,typeof ,=>,=,;,in ".split(",");const c=[function(e){let t=e[0],n=t;if("'"!==t&&'"'!==t)return!1;let o,s=1;for(;e[s]&&e[s]!==n;){if(t+=o=e[s],"\\"===o){if(!(o=e[++s]))throw new Error("Invalid expression");t+=o}s++}if(e[s]!==n)throw new Error("Invalid expression");return{type:"VALUE",value:t+=n}},function(e){let t=e[0];if(t&&t.match(/[0-9]/)){let n=1;for(;e[n]&&e[n].match(/[0-9]|\./);)t+=e[n],n++;return{type:"VALUE",value:t}}return!1},function(e){for(let t of l)if(e.startsWith(t))return{type:"OPERATOR",value:t};return!1},function(e){let t=e[0];if(t&&t.match(/[a-zA-Z_\$]/)){let n=1;for(;e[n]&&e[n].match(/\w/);)t+=e[n],n++;return t in r?{type:"OPERATOR",value:r[t],size:t.length}:{type:"SYMBOL",value:t}}return!1},function(e){const t=e[0];return!!(t&&t in a)&&{type:a[t],value:t}}];function d(e,t){t=Object.create(t);const n=function(e){const t=[];let n=!0;for(;n;)if(e=e.trim()){for(let o of c)if(n=o(e)){t.push(n),e=e.slice(n.size||n.value.length);break}}else n=!1;if(e.length)throw new Error(`Tokenizer error: could not tokenize "${e}"`);return t}(e);for(let e=0;e<n.length;e++){let o=n[e],s=n[e-1],r=n[e+1],a="SYMBOL"===o.type&&!i.includes(o.value);if("SYMBOL"!==o.type||i.includes(o.value)||s&&("OPERATOR"===s.type&&"."===s.value?a=!1:"LEFT_BRACE"!==s.type&&"COMMA"!==s.type||r&&"COLON"===r.type&&(a=!1)),r&&"OPERATOR"===r.type&&"=>"===r.value)if("RIGHT_PAREN"===o.type){let o=e-1;for(;o>0&&"LEFT_PAREN"!==n[o].type;)"SYMBOL"===n[o].type&&n[o].originalValue&&(n[o].value=n[o].originalValue,t[n[o].value]={id:n[o].value,expr:n[o].value}),o--}else t[o.value]={id:o.value,expr:o.value};a&&(o.varName=o.value,o.value in t&&"id"in t[o.value]?o.value=t[o.value].expr:(o.originalValue=o.value,o.value=`scope['${o.value}']`))}return n}const u=/\{\{.*?\}\}/g;class h{constructor(e){this.code=[],this.variables={},this.escaping=!1,this.parentNode=null,this.parentTextNode=null,this.rootNode=null,this.indentLevel=0,this.shouldDefineParent=!1,this.shouldDefineScope=!1,this.protectedScopeNumber=0,this.shouldDefineQWeb=!1,this.shouldDefineUtils=!1,this.shouldDefineRefs=!1,this.shouldDefineResult=!0,this.loopNumber=0,this.inPreTag=!1,this.allowMultipleRoots=!1,this.hasParentWidget=!1,this.hasKey0=!1,this.keyStack=[],this.rootContext=this,this.templateName=e||"noname",this.addLine("let h = this.h;")}generateID(){return h.nextID++}generateTemplateKey(e=""){const t=this.generateID();if(0===this.loopNumber&&!this.hasKey0)return`'${e}__${t}__'`;let n=`\`${e}__${t}__`;for(let e=this.hasKey0?0:1;e<this.loopNumber+1;e++)n+=`\${key${e}}__`;return this.addLine(`let k${t} = ${n}\`;`),`k${t}`}generateCode(){return this.shouldDefineResult&&this.code.unshift("    let result;"),this.shouldDefineScope&&this.code.unshift("    let scope = Object.create(context);"),this.shouldDefineRefs&&this.code.unshift("    context.__owl__.refs = context.__owl__.refs || {};"),this.shouldDefineParent&&(this.hasParentWidget?this.code.unshift("    let parent = extra.parent;"):this.code.unshift("    let parent = context;")),this.shouldDefineQWeb&&this.code.unshift("    let QWeb = this.constructor;"),this.shouldDefineUtils&&this.code.unshift("    let utils = this.constructor.utils;"),this.code}withParent(e){if(!this.allowMultipleRoots&&this===this.rootContext&&(this.parentNode||this.parentTextNode))throw new Error("A template should not have more than one root node");return this.rootContext.rootNode||(this.rootContext.rootNode=e),!this.parentNode&&this.rootContext.shouldDefineResult&&this.addLine(`result = vn${e};`),this.subContext("parentNode",e)}subContext(e,t){const n=Object.create(this);return n[e]=t,n}indent(){this.rootContext.indentLevel++}dedent(){this.rootContext.indentLevel--}addLine(e){const t=new Array(this.indentLevel+2).join("    ");return this.code.push(t+e),this.code.length-1}addIf(e){this.addLine(`if (${e}) {`),this.indent()}addElse(){this.dedent(),this.addLine("} else {"),this.indent()}closeIf(){this.dedent(),this.addLine("}")}getValue(e){return e in this.variables?this.getValue(this.variables[e]):e}formatExpression(e){return this.rootContext.shouldDefineScope=!0,function(e,t){return d(e,t).map(e=>e.value).join("")}(e,this.variables)}captureExpression(e){this.rootContext.shouldDefineScope=!0;const t=this.generateID(),n=d(e,this.variables),o=new Set;return n.map(e=>(e.varName&&(o.has(e.varName)||(o.add(e.varName),this.addLine(`const ${e.varName}_${t} = ${e.value};`)),e.value=`${e.varName}_${t}`),e.value)).join("")}interpolate(e){let t=e.match(u);return t&&t[0].length===e.length?`(${this.formatExpression(e.slice(2,-2))})`:"`"+e.replace(/\{\{.*?\}\}/g,e=>"${"+this.formatExpression(e.slice(2,-2))+"}")+"`"}startProtectScope(e){const t=this.generateID();this.rootContext.protectedScopeNumber++,this.rootContext.shouldDefineScope=!0;return this.addLine(`let _origScope${t} = scope;`),this.addLine("scope = Object.create(scope);"),e||this.addLine("scope.__access_mode__ = 'ro';"),t}stopProtectScope(e){this.rootContext.protectedScopeNumber--,this.addLine(`scope = _origScope${e};`)}}function p(e,t){var n,o,s=t.elm,i=e.data.props,r=t.data.props;if((i||r)&&i!==r){for(n in r=r||{},i=i||{})r[n]||delete s[n];for(n in r)o=r[n],i[n]===o||"value"===n&&s[n]===o||(s[n]=o)}}h.nextID=1;const f={create:p,update:p};function m(e,t,n){if("function"==typeof e)e.call(t,n,t);else if("object"==typeof e)if("function"==typeof e[0])if(2===e.length)e[0].call(t,e[1],n,t);else{var o=e.slice(1);o.push(n),o.push(t),e[0].apply(t,o)}else for(let o=0,s=e.length;o<s;o++)m(e[o],t,n)}function g(){return function e(t){!function(e,t){var n=e.type,o=t.data.on;o&&(o[n]?m(o[n],t,e):o["!"+n]&&m(o["!"+n],t,e))}(t,e.vnode)}}function v(e,t){var n,o=e.data.on,s=e.listener,i=e.elm,r=t&&t.data.on,a=t&&t.elm;if(o!==r){if(o&&s)if(r){for(n in o)if(!r[n]){const e="!"===n.charAt(0);n=e?n.slice(1):n,i.removeEventListener(n,s,e)}}else for(n in o){const e="!"===n.charAt(0);n=e?n.slice(1):n,i.removeEventListener(n,s,e)}if(r){var l=t.listener=e.listener||g();if(l.vnode=t,o){for(n in r)if(!o[n]){const e="!"===n.charAt(0);n=e?n.slice(1):n,a.addEventListener(n,l,e)}}else for(n in r){const e="!"===n.charAt(0);n=e?n.slice(1):n,a.addEventListener(n,l,e)}}}}const _={create:v,update:v,destroy:v},w="http://www.w3.org/1999/xlink",b="http://www.w3.org/XML/1998/namespace",y=58,$=120;function x(e,t){var n,o=t.elm,s=e.data.attrs,i=t.data.attrs;if((s||i)&&s!==i){for(n in s=s||{},i=i||{}){const e=i[n];s[n]!==e&&(!0===e?o.setAttribute(n,""):!1===e?o.removeAttribute(n):n.charCodeAt(0)!==$?o.setAttribute(n,e):n.charCodeAt(3)===y?o.setAttributeNS(b,n,e):n.charCodeAt(5)===y?o.setAttributeNS(w,n,e):o.setAttribute(n,e))}for(n in s)n in i||o.removeAttribute(n)}}const C={create:x,update:x};function E(e,t){var n,o,s,i=e.data.class,r=t.data.class;if((i||r)&&i!==r){for(o in i=i||{},r=r||{},s=t.elm,i)o&&!r[o]&&s.classList.remove(o);for(o in r)(n=r[o])!==i[o]&&s.classList[n?"add":"remove"](o)}}const L={create:E,update:E};function N(e,t,n,o,s){return{sel:e,data:t,children:n,text:o,elm:s,key:void 0===t?void 0:t.key}}function k(e){return void 0===e}function I(e){return void 0!==e}const S=N("",{},[],void 0,void 0);function D(e,t){return e.key===t.key&&e.sel===t.sel}function A(e,t,n){let o,s,i,r={};for(o=t;o<=n;++o)null!=(i=e[o])&&void 0!==(s=i.key)&&(r[s]=o);return r}const P=["create","update","remove","destroy","pre","post"];const T=Array.isArray;function R(e){return"string"==typeof e||"number"==typeof e}const M={createElement:function(e){return document.createElement(e)},createElementNS:function(e,t){return document.createElementNS(e,t)},createTextNode:function(e){return document.createTextNode(e)},createComment:function(e){return document.createComment(e)},insertBefore:function(e,t,n){e.insertBefore(t,n)},removeChild:function(e,t){e.removeChild(t)},appendChild:function(e,t){e.appendChild(t)},parentNode:function(e){return e.parentNode},nextSibling:function(e){return e.nextSibling},tagName:function(e){return e.tagName},setTextContent:function(e,t){e.textContent=t}};function O(e,t,n){if("dummy"!==n&&(e.ns="http://www.w3.org/2000/svg","foreignObject"!==n&&void 0!==t))for(let e=0,n=t.length;e<n;++e){const n=t[e];let o=n.data;void 0!==o&&O(o,n.children,n.sel)}}function j(e,t,n){var o,s,i,r,a={};if(void 0!==n?(a=t,T(n)?o=n:R(n)?s=n:n&&n.sel&&(o=[n])):void 0!==t&&(T(t)?o=t:R(t)?s=t:t&&t.sel?o=[t]:a=t),void 0!==o)for(i=0,r=o.length;i<r;++i)R(o[i])&&(o[i]=N(void 0,void 0,void 0,o[i],void 0));return N(e,a,o,s,void 0)}const U=function(e,t){let n,o,s={};const i=void 0!==t?t:M;for(n=0;n<P.length;++n)for(s[P[n]]=[],o=0;o<e.length;++o){const t=e[o][P[n]];void 0!==t&&s[P[n]].push(t)}function r(e){const t=e.id?"#"+e.id:"",n=e.className?"."+e.className.split(" ").join("."):"";return N(i.tagName(e).toLowerCase()+t+n,{},[],void 0,e)}function a(e,t){return function(){if(0==--t){const t=i.parentNode(e);i.removeChild(t,e)}}}function l(e,t){let n,o,r=e.data;void 0!==r&&I(n=r.hook)&&I(n=n.init)&&(n(e),r=e.data);let a=e.children,c=e.sel;if("!"===c)k(e.text)&&(e.text=""),e.elm=i.createComment(e.text);else if(void 0!==c){const d=e.elm||(e.elm=I(r)&&I(n=r.ns)?i.createElementNS(n,c):i.createElement(c));for(n=0,o=s.create.length;n<o;++n)s.create[n](S,e);if(T(a))for(n=0,o=a.length;n<o;++n){const e=a[n];null!=e&&i.appendChild(d,l(e,t))}else R(e.text)&&i.appendChild(d,i.createTextNode(e.text));I(n=e.data.hook)&&(n.create&&n.create(S,e),n.insert&&t.push(e))}else e.elm=i.createTextNode(e.text);return e.elm}function c(e,t,n,o,s,r){for(;o<=s;++o){const s=n[o];null!=s&&i.insertBefore(e,l(s,r),t)}}function d(e){let t,n,o,i,r=e.data;if(void 0!==r){for(I(t=r.hook)&&I(t=t.destroy)&&t(e),t=0,n=s.destroy.length;t<n;++t)s.destroy[t](e);if(void 0!==e.children)for(o=0,i=e.children.length;o<i;++o)null!=(t=e.children[o])&&"string"!=typeof t&&d(t)}}function u(e,t,n,o){for(;n<=o;++n){let o,r,l,c,u=t[n];if(null!=u)if(I(u.sel)){for(d(u),l=s.remove.length+1,c=a(u.elm,l),o=0,r=s.remove.length;o<r;++o)s.remove[o](u,c);I(o=u.data)&&I(o=o.hook)&&I(o=o.remove)?o(u,c):c()}else i.removeChild(e,u.elm)}}function h(e,t,n){let o,r,a;I(o=t.data)&&I(a=o.hook)&&I(o=a.prepatch)&&o(e,t);const d=t.elm=e.elm;let p=e.children,f=t.children;if(e!==t){if(void 0!==t.data){for(o=0,r=s.update.length;o<r;++o)s.update[o](e,t);I(o=t.data.hook)&&I(o=o.update)&&o(e,t)}k(t.text)?I(p)&&I(f)?p!==f&&function(e,t,n,o){let s,r,a,d,p=0,f=0,m=t.length-1,g=t[0],v=t[m],_=n.length-1,w=n[0],b=n[_];for(;p<=m&&f<=_;)null==g?g=t[++p]:null==v?v=t[--m]:null==w?w=n[++f]:null==b?b=n[--_]:D(g,w)?(h(g,w,o),g=t[++p],w=n[++f]):D(v,b)?(h(v,b,o),v=t[--m],b=n[--_]):D(g,b)?(h(g,b,o),i.insertBefore(e,g.elm,i.nextSibling(v.elm)),g=t[++p],b=n[--_]):D(v,w)?(h(v,w,o),i.insertBefore(e,v.elm,g.elm),v=t[--m],w=n[++f]):(void 0===s&&(s=A(t,p,m)),k(r=s[w.key])?(i.insertBefore(e,l(w,o),g.elm),w=n[++f]):((a=t[r]).sel!==w.sel?i.insertBefore(e,l(w,o),g.elm):(h(a,w,o),t[r]=void 0,i.insertBefore(e,a.elm,g.elm)),w=n[++f]));(p<=m||f<=_)&&(p>m?c(e,d=null==n[_+1]?null:n[_+1].elm,n,f,_,o):u(e,t,p,m))}(d,p,f,n):I(f)?(I(e.text)&&i.setTextContent(d,""),c(d,null,f,0,f.length-1,n)):I(p)?u(d,p,0,p.length-1):I(e.text)&&i.setTextContent(d,""):e.text!==t.text&&(I(p)&&u(d,p,0,p.length-1),i.setTextContent(d,t.text)),I(a)&&I(o=a.postpatch)&&o(e,t)}}return function(e,t){let n,o,a,c;const d=[];for(n=0,o=s.pre.length;n<o;++n)s.pre[n]();for(function(e){return void 0!==e.sel}(e)||(e=r(e)),D(e,t)?h(e,t,d):(a=e.elm,c=i.parentNode(a),l(t,d),null!==c&&(i.insertBefore(c,t.elm,i.nextSibling(a)),u(c,[e],0,0))),n=0,o=d.length;n<o;++n)d[n].data.hook.insert(d[n]);for(n=0,o=s.post.length;n<o;++n)s.post[n]();return t}}([_,C,f,L]);let F=null;const B={setTimeout:window.setTimeout.bind(window),clearTimeout:window.clearTimeout.bind(window),setInterval:window.setInterval.bind(window),clearInterval:window.clearInterval.bind(window),requestAnimationFrame:window.requestAnimationFrame.bind(window),random:Math.random,Date:window.Date,fetch:(window.fetch||(()=>{})).bind(window),get localStorage(){return F||window.localStorage},set localStorage(e){F=e}};const q={};function K(e){if(void 0===e)return"";if("number"==typeof e)return String(e);const t=document.createElement("p");return t.textContent=e,t.innerHTML}function W(e,t){for(let n in e)if(e[n]!==t[n])return!1;return!0}var z=Object.freeze({__proto__:null,whenReady:function(e){return new Promise(function(e){"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e,!1)}).then(e||function(){})},loadJS:function(e){if(e in q)return q[e];const t=new Promise(function(t,n){const o=document.createElement("script");o.type="text/javascript",o.src=e,o.onload=function(){t()},o.onerror=function(){n(`Error loading file '${e}'`)},(document.head||document.getElementsByTagName("head")[0]).appendChild(o)});return q[e]=t,t},loadFile:async function(e){const t=await B.fetch(e);if(!t.ok)throw new Error("Error while fetching xml templates");return await t.text()},escape:K,debounce:function(e,t,n){let o;return function(){const s=this,i=arguments,r=n&&!o;B.clearTimeout(o),o=B.setTimeout(function(){o=null,n||e.apply(s,i)},t),r&&e.apply(s,i)}},shallowEqual:W});const V=["label","title","placeholder","alt"],H=/[\r\n]/,G=/\s+/g,Q=/^(\s*)([\s\S]+?)(\s*)$/,Y={create:"(_, n)",insert:"vn",remove:"(vn, rm)",destroy:"()"};function Z(e){return e&&e.hasOwnProperty("__owl__")}function X(e){return e.map(e=>{if(e.sel){const t=document.createElement(e.sel);return U(t,e).elm.outerHTML}return e.text}).join("")}const J={zero:Symbol("zero"),toObj(e){if("string"==typeof e){if(!(e=e.trim()))return{};let t=e.split(/\s+/),n={};for(let e=0;e<t.length;e++)n[t[e]]=!0;return n}return e},shallowEqual:W,addNameSpace(e){O(e.data,e.children,e.sel)},VDomArray:class extends Array{toString(){return X(this)}},vDomToString:X,getComponent(e){for(;e&&!Z(e);)e=e.__proto__;return e},getScope(e,t){const n=e;for(;e&&!e.hasOwnProperty(t)&&(!e.hasOwnProperty("__access_mode__")||"ro"!==e.__access_mode__);){const t=e.__proto__;if(!t||Z(t))return n;e=t}return e}};function ee(e){const t=(new DOMParser).parseFromString(e,"text/xml");if(t.getElementsByTagName("parsererror").length){let n="Invalid XML in template.";const o=t.getElementsByTagName("parsererror")[0].textContent;if(o){n+="\nThe parser has produced the following error message:\n"+o;const t=/\d+/g,s=t.exec(o);if(s){const i=Number(s[0]),r=e.split("\n")[i-1],a=t.exec(o);if(r&&a){const e=Number(a[0])-1;r[e]&&(n+=`\nThe error might be located at xml line ${i} column ${e}\n`+`${r}\n${"-".repeat(e-1)}^`)}}}throw new Error(n)}return t}function te(e){return e.replace(/\'/g,"\\'")}class ne extends o{constructor(e={}){super(),this.h=j,this.subTemplates={},this.isUpdating=!1,this.templates=Object.create(ne.TEMPLATES),e.templates&&this.addTemplates(e.templates),e.translateFn&&(this.translateFn=e.translateFn)}static addDirective(e){if(e.name in ne.DIRECTIVE_NAMES)throw new Error(`Directive "${e.name} already registered`);ne.DIRECTIVES.push(e),ne.DIRECTIVE_NAMES[e.name]=1,ne.DIRECTIVES.sort((e,t)=>e.priority-t.priority),e.extraNames&&e.extraNames.forEach(e=>ne.DIRECTIVE_NAMES[e]=1)}static registerComponent(e,t){if(ne.components[e])throw new Error(`Component '${e}' has already been registered`);ne.components[e]=t}static registerTemplate(e,t){if(ne.TEMPLATES[e])throw new Error(`Template '${e}' has already been registered`);const n=new ne;n.addTemplate(e,t),ne.TEMPLATES[e]=n.templates[e]}addTemplate(e,t,n){if(n&&e in this.templates)return;const o=ee(t);if(!o.firstChild)throw new Error("Invalid template (should not be empty)");this._addTemplate(e,o.firstChild)}addTemplates(e){const t=("string"==typeof e?ee(e):e).getElementsByTagName("templates")[0];if(t)for(let e of t.children){const t=e.getAttribute("t-name");this._addTemplate(t,e)}}_addTemplate(e,t){if(e in this.templates)throw new Error(`Template ${e} already defined`);this._processTemplate(t);const n={elem:t,fn:function(t,o){const s=this._compile(e);return n.fn=s,s.call(this,t,o)}};this.templates[e]=n}_processTemplate(e){let t=e.querySelectorAll("[t-elif], [t-else]");for(let e=0,n=t.length;e<n;e++){let n=t[e],o=n.previousElementSibling,s=function(e){return o.getAttribute(e)},i=function(e){return+!!n.getAttribute(e)};if(!o||!s("t-if")&&!s("t-elif"))throw new Error("t-elif and t-else directives must be preceded by a t-if or t-elif directive");{if(s("t-foreach"))throw new Error("t-if cannot stay at the same level as t-foreach when using t-elif or t-else");if(["t-if","t-elif","t-else"].map(i).reduce(function(e,t){return e+t})>1)throw new Error("Only one conditional branching directive is allowed per node");let e;for(;(e=n.previousSibling)!==o;){if(e.nodeValue.trim().length&&8!==e.nodeType)throw new Error("text is not allowed between branching directives");e.remove()}}}}render(e,t={},n=null){const o=this.templates[e];if(!o)throw new Error(`Template ${e} does not exist`);return o.fn.call(this,t,n)}renderToString(e,t={},n){const o=this.render(e,t,n);if(void 0===o.sel)return o.text;const s=document.createElement(o.sel),i=U(s,o).elm;return function e(t){3===t.nodeType&&(t.textContent=K(t.textContent));for(let n of t.childNodes)e(n)}(i),i.outerHTML}forceUpdate(){this.isUpdating=!0,Promise.resolve().then(()=>{this.isUpdating&&(this.isUpdating=!1,this.trigger("update"))})}_compile(e,t={}){const n=t.elem||this.templates[e].elem,o=n.attributes.hasOwnProperty("t-debug"),s=new h(e);if("t"!==n.tagName&&(s.shouldDefineResult=!1),t.hasParent&&(s.variables=Object.create(null),s.parentNode=s.generateID(),s.allowMultipleRoots=!0,s.hasParentWidget=!0,s.shouldDefineResult=!1,s.addLine(`let c${s.parentNode} = extra.parentNode;`),t.defineKey&&(s.addLine('let key0 = extra.key || "";'),s.hasKey0=!0)),this._compileNode(n,s),!t.hasParent)if(s.shouldDefineResult)s.addLine("return result;");else{if(!s.rootNode)throw new Error(`A template should have one root node (${s.templateName})`);s.addLine(`return vn${s.rootNode};`)}let i=s.generateCode();const r=s.templateName.replace(/`/g,"'").slice(0,200);let a;i.unshift(`    // Template name: "${r}"`);try{a=new Function("context, extra",i.join("\n"))}catch(e){throw console.groupCollapsed(`Invalid Code generated by ${r}`),console.warn(i.join("\n")),console.groupEnd(),new Error(`Invalid generated code while compiling template '${r}': ${e.message}`)}if(o){const t=this.templates[e];if(t){const e=`Template: ${t.elem.outerHTML}\nCompiled code:\n${a.toString()}`;console.log(e)}}return a}_compileNode(e,t){if(!(e instanceof Element)){let n=e.textContent;if(!t.inPreTag){if(H.test(n)&&!n.trim())return;n=n.replace(G," ")}if(this.translateFn&&"off"!==e.parentNode.getAttribute("t-translation")){const e=Q.exec(n);n=e[1]+this.translateFn(e[2])+e[3]}if(t.parentNode)3===e.nodeType?t.addLine(`c${t.parentNode}.push({text: \`${n}\`});`):8===e.nodeType&&t.addLine(`c${t.parentNode}.push(h('!', \`${n}\`));`);else if(t.parentTextNode)t.addLine(`vn${t.parentTextNode}.text += \`${n}\`;`);else{let e=t.generateID();t.addLine(`let vn${e} = {text: \`${n}\`};`),t.addLine(`result = vn${e};`),t.rootContext.rootNode=e,t.rootContext.parentTextNode=e}return}if("t"!==e.tagName&&e.hasAttribute("t-call")){const t=document.createElement("t");t.setAttribute("t-call",e.getAttribute("t-call")),e.removeAttribute("t-call"),e.prepend(t)}const n=e.tagName[0];if(n===n.toUpperCase())e.setAttribute("t-component",e.tagName);else if("t"!==e.tagName&&e.hasAttribute("t-component"))throw new Error(`Directive 't-component' can only be used on <t> nodes (used on a <${e.tagName}>)`);const o=e.attributes,s=[],i=[];for(let t=0;t<o.length;t++){let n=o[t].name;if(n.startsWith("t-")){if(!(n.slice(2).split(/-|\./)[0]in ne.DIRECTIVE_NAMES))throw new Error(`Unknown QWeb directive: '${n}'`);if("t"!==e.tagName&&("t-esc"===n||"t-raw"===n)){const t=document.createElement("t");t.setAttribute(n,e.getAttribute(n));for(let n of Array.from(e.childNodes))t.appendChild(n);e.appendChild(t),e.removeAttribute(n)}}}const r=ne.DIRECTIVES.length,a=o.length;let l=!1;for(let e=0;e<r;e++){let t,n,i=ne.DIRECTIVES[e];for(let e=0;e<a;e++){const r=o[e].name;(r==="t-"+i.name||r.startsWith("t-"+i.name+"-")||r.startsWith("t-"+i.name+"."))&&(t=r,n=o[e].textContent,s.push({directive:i,value:n,fullName:t}),"on"!==i.name&&"model"!==i.name||(l=!0))}}for(let{directive:n,value:o,fullName:r}of s)if(n.finalize&&i.push({directive:n,value:o,fullName:r}),n.atNodeEncounter){if(n.atNodeEncounter({node:e,qweb:this,ctx:t,fullName:r,value:o})){for(let{directive:n,value:o,fullName:s}of i)n.finalize({node:e,qweb:this,ctx:t,fullName:s,value:o});return}}if("t"!==e.nodeName){let n=this._compileGenericNode(e,t,l);t=t.withParent(n);let o={},i=function(e,t){o[e]=o[e]||[],o[e].push(t)};for(let{directive:o,value:r,fullName:a}of s)o.atNodeCreation&&o.atNodeCreation({node:e,qweb:this,ctx:t,fullName:a,value:r,nodeID:n,addNodeHook:i});if(Object.keys(o).length){t.addLine(`p${n}.hook = {`);for(let e in o){t.addLine(`  ${e}: ${Y[e]} => {`);for(let n of o[e])t.addLine(`    ${n}`);t.addLine("  },")}t.addLine("};")}}"pre"===e.nodeName&&(t=t.subContext("inPreTag",!0)),this._compileChildren(e,t),("svg"===e.nodeName||"g"===e.nodeName&&t.rootNode===t.parentNode)&&(t.rootContext.shouldDefineUtils=!0,t.addLine(`utils.addNameSpace(vn${t.parentNode});`));for(let{directive:n,value:o,fullName:s}of i)n.finalize({node:e,qweb:this,ctx:t,fullName:s,value:o})}_compileGenericNode(e,t,n=!0){if(1!==e.nodeType)throw new Error("unsupported node type");const o=e.attributes,s=[],i=[],r=[];function a(t,n){let o=!1;switch(e.nodeName){case"input":let n=e.getAttribute("type");"checkbox"!==n&&"radio"!==n||"checked"!==t&&"indeterminate"!==t||(o=!0),"value"!==t&&"readonly"!==t&&"disabled"!==t||(o=!0);break;case"option":o="selected"===t||"disabled"===t;break;case"textarea":o="readonly"===t||"disabled"===t;break;case"button":case"select":case"optgroup":o="disabled"===t}o&&i.push(`${t}: _${n}`)}let l="";for(let n=0;n<o.length;n++){let i=o[n].name,c=o[n].textContent;if(this.translateFn&&V.includes(i)&&(c=this.translateFn(c)),!i.startsWith("t-")&&!e.getAttribute("t-attf-"+i)){const e=t.generateID();if("class"===i){if(c=c.trim()){let e=c.split(/\s+/).map(e=>`'${te(e)}':true`).join(",");l?t.addLine(`Object.assign(${l}, {${e}})`):(l=`_${t.generateID()}`,t.addLine(`let ${l} = {${e}};`))}}else t.addLine(`let _${e} = '${te(c)}';`),i.match(/^[a-zA-Z]+$/)||(i='"'+i+'"'),s.push(`${i}: _${e}`),a(i,e)}if(i.startsWith("t-att-")){let n=i.slice(6);const o=t.getValue(c);let r="string"==typeof o?t.formatExpression(o):`scope.${o.id}`;if("class"===n)t.rootContext.shouldDefineUtils=!0,r=`utils.toObj(${r})`,l?t.addLine(`Object.assign(${l}, ${r})`):(l=`_${t.generateID()}`,t.addLine(`let ${l} = ${r};`));else{const o=t.generateID();n.match(/^[a-zA-Z]+$/)||(n='"'+n+'"');const i=e.getAttribute(n);if(i){const e=t.generateID();t.addLine(`let _${e} = ${r};`),r=`'${i}' + (_${e} ? ' ' + _${e} : '')`;const o=s.findIndex(e=>e.startsWith(n+":"));s.splice(o,1)}t.addLine(`let _${o} = ${r};`),s.push(`${n}: _${o}`),a(n,o)}}if(i.startsWith("t-attf-")){let n=i.slice(7);n.match(/^[a-zA-Z]+$/)||(n='"'+n+'"');const o=t.interpolate(c),r=t.generateID();let a=e.getAttribute(n);a?t.addLine(`let _${r} = '${a} ' + ${o};`):t.addLine(`let _${r} = ${o};`),s.push(`${n}: _${r}`)}if("t-att"===i){let e=t.generateID();t.addLine(`let _${e} = ${t.formatExpression(c)};`),r.push(e)}}let c=t.generateID();const d=[`key:${t.loopNumber||t.hasKey0?`\`\${key${t.loopNumber}}_${c}\``:c}`];s.length+r.length>0&&d.push(`attrs:{${s.join(",")}}`),i.length>0&&d.push(`props:{${i.join(",")}}`),l&&d.push(`class:${l}`),n&&d.push("on:{}"),t.addLine(`let c${c} = [], p${c} = {${d.join(",")}};`);for(let e of r)t.addIf(`_${e} instanceof Array`),t.addLine(`p${c}.attrs[_${e}[0]] = _${e}[1];`),t.addElse(),t.addLine(`for (let key in _${e}) {`),t.indent(),t.addLine(`p${c}.attrs[key] = _${e}[key];`),t.dedent(),t.addLine("}"),t.closeIf();return t.addLine(`let vn${c} = h('${e.nodeName}', p${c}, c${c});`),t.parentNode?t.addLine(`c${t.parentNode}.push(vn${c});`):(t.loopNumber||t.hasKey0)&&(t.rootContext.shouldDefineResult=!0,t.addLine(`result = vn${c};`)),c}_compileChildren(e,t){if(e.childNodes.length>0)for(let n of Array.from(e.childNodes))this._compileNode(n,t)}}ne.utils=J,ne.components=Object.create(null),ne.DIRECTIVE_NAMES={name:1,att:1,attf:1,translation:1},ne.DIRECTIVES=[],ne.TEMPLATES={},ne.nextId=1,ne.dev=!1,ne.enableTransitions=!0,ne.slots={},ne.nextSlotId=1,ne.subTemplates={};const oe=new DOMParser;function se(e){if(!(e instanceof Element))return e instanceof Comment?j("!",e.textContent):{text:e.textContent};const t={};for(let n of e.attributes)t[n.name]=n.textContent;const n=[];for(let t of e.childNodes)n.push(se(t));const o=j(e.tagName,{attrs:t},n);return"svg"===o.sel&&O(o.data,o.children,o.sel),o}function ie(e,t,n,o){if(o.rootContext.shouldDefineScope=!0,"0"===e){if(o.parentNode){o.rootContext.shouldDefineUtils=!0;const e=o.escaping?"{text: utils.vDomToString(scope[utils.zero])}":"...scope[utils.zero]";o.addLine(`c${o.parentNode}.push(${e});`)}return}let s;if("string"==typeof e?(s=`_${o.generateID()}`,o.addLine(`let ${s} = ${o.formatExpression(e)};`)):s=`scope.${e.id}`,o.addIf(`${s} != null`),o.escaping){let t;if(e.hasBody&&(o.rootContext.shouldDefineUtils=!0,t=o.startProtectScope(),o.addLine(`${s} = ${s} instanceof utils.VDomArray ? utils.vDomToString(${s}) : ${s};`)),o.parentTextNode)o.addLine(`vn${o.parentTextNode}.text += ${s};`);else if(o.parentNode)o.addLine(`c${o.parentNode}.push({text: ${s}});`);else{let e=o.generateID();o.rootContext.rootNode=e,o.rootContext.parentTextNode=e,o.addLine(`let vn${e} = {text: ${s}};`),o.rootContext.shouldDefineResult&&o.addLine(`result = vn${e}`)}e.hasBody&&o.stopProtectScope(t)}else o.rootContext.shouldDefineUtils=!0,e.hasBody?(o.addLine(`const vnodeArray = ${s} instanceof utils.VDomArray ? ${s} : utils.htmlToVDOM(${s});`),o.addLine(`c${o.parentNode}.push(...vnodeArray);`)):o.addLine(`c${o.parentNode}.push(...utils.htmlToVDOM(${s}));`);t.childNodes.length&&(o.addElse(),n._compileChildren(t,o)),o.closeIf()}ne.utils.htmlToVDOM=function(e){const t=oe.parseFromString(e,"text/html"),n=[];for(let e of t.body.childNodes)n.push(se(e));return n},ne.addDirective({name:"esc",priority:70,atNodeEncounter:({node:e,qweb:t,ctx:n})=>(ie(n.getValue(e.getAttribute("t-esc")),e,t,n.subContext("escaping",!0)),!0)}),ne.addDirective({name:"raw",priority:80,atNodeEncounter:({node:e,qweb:t,ctx:n})=>(ie(n.getValue(e.getAttribute("t-raw")),e,t,n),!0)}),ne.addDirective({name:"set",extraNames:["value"],priority:60,atNodeEncounter({node:e,qweb:t,ctx:n}){n.rootContext.shouldDefineScope=!0;const o=e.getAttribute("t-set");let s=e.getAttribute("t-value");n.variables[o]=n.variables[o]||{};let i=n.variables[o];const r=e.hasChildNodes();if(i.id=o,i.expr=`scope.${o}`,s){const e=n.formatExpression(s);let t="scope";n.protectedScopeNumber&&(n.rootContext.shouldDefineUtils=!0,t=`utils.getScope(scope, '${o}')`),n.addLine(`${t}.${o} = ${e};`),i.value=e}if(r){n.rootContext.shouldDefineUtils=!0,s&&n.addIf(`!(${i.expr})`);const o=n.generateID(),r=n.parentNode;n.parentNode=o,n.addLine(`let c${o} = new utils.VDomArray();`);const a=e.cloneNode(!0);for(let e of["t-set","t-value","t-if","t-else","t-elif"])a.removeAttribute(e);t._compileNode(a,n),n.addLine(`${i.expr} = c${o}`),i.value=`c${o}`,i.hasBody=!0,n.parentNode=r,s&&n.closeIf()}return!0}}),ne.addDirective({name:"if",priority:20,atNodeEncounter({node:e,ctx:t}){let n=t.getValue(e.getAttribute("t-if"));return t.addIf("string"==typeof n?t.formatExpression(n):`scope.${n.id}`),!1},finalize({ctx:e}){e.closeIf()}}),ne.addDirective({name:"elif",priority:30,atNodeEncounter({node:e,ctx:t}){let n=t.getValue(e.getAttribute("t-elif"));return t.addLine(`else if (${"string"==typeof n?t.formatExpression(n):`scope.${n.id}`}) {`),t.indent(),!1},finalize({ctx:e}){e.closeIf()}}),ne.addDirective({name:"else",priority:40,atNodeEncounter:({ctx:e})=>(e.addLine("else {"),e.indent(),!1),finalize({ctx:e}){e.closeIf()}}),ne.addDirective({name:"call",priority:50,atNodeEncounter({node:e,qweb:t,ctx:n}){n.rootContext.shouldDefineScope=!0,n.rootContext.shouldDefineUtils=!0;const o=e.getAttribute("t-call"),s=u.test(o),i=t.templates[o];if(!s&&!i)throw new Error(`Cannot find template "${o}" (t-call)`);let r;if(s){const e=n.generateID();n.addLine(`let tname${e} = ${n.interpolate(o)};`),n.addLine(`let tid${e} = this.subTemplates[tname${e}];`),n.addIf(`!tid${e}`),n.addLine(`tid${e} = this.constructor.nextId++;`),n.addLine(`this.subTemplates[tname${e}] = tid${e};`),n.addLine(`this.constructor.subTemplates[tid${e}] = this._compile(tname${e}, {hasParent: true, defineKey: true});`),n.closeIf(),r=`tid${e}`}else{let e=t.subTemplates[o];if(!e){e=ne.nextId++,t.subTemplates[o]=e;const n=t._compile(o,{hasParent:!0,defineKey:!0});ne.subTemplates[e]=n}r=`'${e}'`}let a=e.hasChildNodes();const l=n.startProtectScope();if(a){n.addLine("{"),n.indent();const o=e.cloneNode(!0);for(let e of["t-if","t-else","t-elif","t-call"])o.removeAttribute(e);n.addLine("{"),n.indent(),n.addLine("let c__0 = [];"),t._compileNode(o,n.subContext("parentNode","__0")),n.rootContext.shouldDefineUtils=!0,n.addLine("scope[utils.zero] = c__0;"),n.dedent(),n.addLine("}")}const c=n.generateTemplateKey(),d=`Object.assign({}, extra, {parentNode: ${n.parentNode?`c${n.parentNode}`:"result"}, parent: utils.getComponent(context), key: ${c}})`;return n.parentNode?n.addLine(`this.constructor.subTemplates[${r}].call(this, scope, ${d});`):(n.rootContext.shouldDefineResult=!0,n.addLine("result = []"),n.addLine(`this.constructor.subTemplates[${r}].call(this, scope, ${d});`),n.addLine("result = result[0]")),a&&(n.dedent(),n.addLine("}")),n.stopProtectScope(l),!0}}),ne.addDirective({name:"foreach",extraNames:["as"],priority:10,atNodeEncounter({node:e,qweb:t,ctx:n}){n.rootContext.shouldDefineScope=!0,n=n.subContext("loopNumber",n.loopNumber+1);const o=e.getAttribute("t-foreach"),s=e.getAttribute("t-as");let i=n.generateID();n.addLine(`let _${i} = ${n.formatExpression(o)};`),n.addLine(`if (!_${i}) { throw new Error('QWeb error: Invalid loop expression')}`);let r=n.generateID(),a=n.generateID();n.addLine(`let _${r} = _${a} = _${i};`),n.addIf(`!(_${i} instanceof Array)`),n.addLine(`_${r} = Object.keys(_${i});`),n.addLine(`_${a} = Object.values(_${i});`),n.closeIf(),n.addLine(`let _length${r} = _${r}.length;`);let l=n.startProtectScope(!0);const c=`i${n.loopNumber}`;n.addLine(`for (let ${c} = 0; ${c} < _length${r}; ${c}++) {`),n.indent(),n.addLine(`scope.${s}_first = ${c} === 0`),n.addLine(`scope.${s}_last = ${c} === _length${r} - 1`),n.addLine(`scope.${s}_index = ${c}`),n.addLine(`scope.${s} = _${r}[${c}]`),n.addLine(`scope.${s}_value = _${a}[${c}]`);const d=e.cloneNode(!0);if(!d.hasAttribute("t-key")&&1===e.children.length&&"t"!==e.children[0].tagName&&!e.children[0].hasAttribute("t-key")&&console.warn(`Directive t-foreach should always be used with a t-key! (in template: '${n.templateName}')`),d.hasAttribute("t-key")){const e=n.formatExpression(d.getAttribute("t-key"));n.addLine(`let key${n.loopNumber} = ${e};`),d.removeAttribute("t-key")}else n.addLine(`let key${n.loopNumber} = i${n.loopNumber};`);return d.removeAttribute("t-foreach"),t._compileNode(d,n),n.dedent(),n.addLine("}"),n.stopProtectScope(l),!0}}),ne.addDirective({name:"debug",priority:1,atNodeEncounter({ctx:e}){e.addLine("debugger;")}}),ne.addDirective({name:"log",priority:1,atNodeEncounter({ctx:e,value:t}){const n=e.formatExpression(t);e.addLine(`console.log(${n})`)}});const re={prevent:"e.preventDefault();",self:"if (e.target !== this.elm) {return}",stop:"e.stopPropagation();"},ae=/^[$A-Z_][0-9A-Z_$]*$/i;function le(e,t,n,o,s=re){let i,[r,...a]=t.slice(5).split(".");if(a.includes("capture")&&(r="!"+r),!r)throw new Error("Missing event name with t-on directive");let l="";const c=n.replace(/\(.*\)/,function(e){return l=e.slice(1,-1),""});if(c.match(ae)){e.rootContext.shouldDefineUtils=!0;const t="utils.getComponent(context)";if(l){const n=e.generateID();e.addLine(`let args${n} = [${e.formatExpression(l)}];`),i=`${t}['${c}'](...args${n}, e);`,o=!1}else i=`${t}['${c}'](e);`}else o=!1,i=e.captureExpression(n);let d=`function (e) {if (context.__owl__.status === 5){return}${a.map(e=>s[e]).join("")}${i}}`;if(o){const t=e.generateTemplateKey(r);e.addLine(`extra.handlers[${t}] = extra.handlers[${t}] || ${d};`),d=`extra.handlers[${t}]`}return{event:r,handler:d}}function ce(e){return 1e3*Number(e.slice(0,-1).replace(",","."))}function de(e,t){if(!e.parentNode)return;const n=window.getComputedStyle(e);(function(e,t){for(;e.length<t.length;)e=e.concat(e);return Math.max.apply(null,t.map((t,n)=>ce(t)+ce(e[n])))})((n.transitionDelay||"").split(", "),(n.transitionDuration||"").split(", "))>0?e.addEventListener("transitionend",t,{once:!0}):t()}ne.addDirective({name:"on",priority:90,atNodeCreation({ctx:e,fullName:t,value:n,nodeID:o}){const{event:s,handler:i}=le(e,t,n,!0);e.addLine(`p${o}.on['${s}'] = ${i};`)}}),ne.addDirective({name:"ref",priority:95,atNodeCreation({ctx:e,value:t,addNodeHook:n}){e.rootContext.shouldDefineRefs=!0;const o=`ref${e.generateID()}`;e.addLine(`const ${o} = ${e.interpolate(t)};`),n("create",`context.__owl__.refs[${o}] = n.elm;`),n("destroy",`delete context.__owl__.refs[${o}];`)}}),ne.utils.nextFrame=function(e){requestAnimationFrame(()=>requestAnimationFrame(e))},ne.utils.transitionInsert=function(e,t){const n=e.elm,o=n.parentElement&&n.parentElement.querySelector(`*[data-owl-key='${e.key}']`);o&&o.remove(),n.classList.add(t+"-enter"),n.classList.add(t+"-enter-active"),n.classList.remove(t+"-leave-active"),n.classList.remove(t+"-leave-to");const s=()=>{n.classList.remove(t+"-enter-active"),n.classList.remove(t+"-enter-to")};this.nextFrame(()=>{n.classList.remove(t+"-enter"),n.classList.add(t+"-enter-to"),de(n,s)})},ne.utils.transitionRemove=function(e,t,n){const o=e.elm;o.setAttribute("data-owl-key",e.key),o.classList.add(t+"-leave"),o.classList.add(t+"-leave-active");const s=()=>{o.classList.contains(t+"-leave-active")&&(o.classList.remove(t+"-leave-active"),o.classList.remove(t+"-leave-to"),n())};this.nextFrame(()=>{o.classList.remove(t+"-leave"),o.classList.add(t+"-leave-to"),de(o,s)})},ne.addDirective({name:"transition",priority:96,atNodeCreation({ctx:e,value:t,addNodeHook:n}){if(!ne.enableTransitions)return;e.rootContext.shouldDefineUtils=!0;const o={insert:`utils.transitionInsert(vn, '${t}');`,remove:`utils.transitionRemove(vn, '${t}', rm);`};for(let e in o)n(e,o[e])}}),ne.addDirective({name:"slot",priority:80,atNodeEncounter({ctx:e,value:t,node:n,qweb:o}){const s=e.generateID(),i=t.match(u)?e.interpolate(t):`'${t}'`;e.addLine(`const slot${s} = this.constructor.slots[context.__owl__.slotId + '_' + ${i}];`),e.addIf(`slot${s}`);let r=`c${e.parentNode}`;if(e.parentNode||(e.rootContext.shouldDefineResult=!0,e.rootContext.shouldDefineUtils=!0,r=`children${e.generateID()}`,e.addLine(`let ${r}= []`),e.addLine("result = {}")),e.addLine(`slot${s}.call(this, context.__owl__.scope, Object.assign({}, extra, {parentNode: ${r}, parent: extra.parent || context}));`),e.parentNode||e.addLine(`utils.defineProxy(result, ${r}[0]);`),n.hasChildNodes()){e.addElse();const t=n.cloneNode(!0);t.removeAttribute("t-slot"),o._compileNode(t,e)}return e.closeIf(),!0}}),ne.utils.toNumber=function(e){const t=parseFloat(e);return isNaN(t)?e:t};const ue=/\.[\w_]+\s*$/,he=/\[[^\[]+\]\s*$/;ne.addDirective({name:"model",priority:42,atNodeCreation({ctx:e,nodeID:t,value:n,node:o,fullName:s,addNodeHook:i}){const r=o.getAttribute("type");let a,l,c,d=s.includes(".lazy")?"change":"input";if(ue.test(n)){const o=n.lastIndexOf(".");c=n.slice(0,o),e.addLine(`let expr${t} = ${e.formatExpression(c)};`),l=`expr${t}${n.slice(o)}`}else{if(!he.test(n))throw new Error(`Invalid t-model expression: "${n}" (it should be assignable)`);{const o=n.lastIndexOf("[");c=n.slice(0,o),e.addLine(`let expr${t} = ${e.formatExpression(c)};`);let s=n.trimRight().slice(o+1,-1);e.addLine(`let exprKey${t} = ${e.formatExpression(s)};`),l=`expr${t}[exprKey${t}]`}}const u=e.generateTemplateKey();if("select"===o.tagName)e.addLine(`p${t}.props = {value: ${l}};`),i("create",`n.elm.value=${l};`),d="change",a=`(ev) => {${l} = ev.target.value}`;else if("checkbox"===r)e.addLine(`p${t}.props = {checked: ${l}};`),a=`(ev) => {${l} = ev.target.checked}`;else if("radio"===r){const n=o.getAttribute("value");e.addLine(`p${t}.props = {checked:${l} === '${n}'};`),a=`(ev) => {${l} = ev.target.value}`,d="click"}else{e.addLine(`p${t}.props = {value: ${l}};`);let n=`ev.target.value${s.includes(".trim")?".trim()":""}`;s.includes(".number")&&(e.rootContext.shouldDefineUtils=!0,n=`utils.toNumber(${n})`),a=`(ev) => {${l} = ${n}}`}e.addLine(`extra.handlers[${u}] = extra.handlers[${u}] || (${a});`),e.addLine(`p${t}.on['${d}'] = extra.handlers[${u}];`)}}),ne.addDirective({name:"key",priority:45,atNodeEncounter({ctx:e,value:t,node:n}){0===e.loopNumber&&(e.keyStack.push(e.rootContext.hasKey0),e.rootContext.hasKey0=!0),e.addLine("{"),e.indent(),e.addLine(`let key${e.loopNumber} = ${e.formatExpression(t)};`)},finalize({ctx:e}){e.dedent(),e.addLine("}"),0===e.loopNumber&&(e.rootContext.hasKey0=e.keyStack.pop())}});const pe={};Object.defineProperty(pe,"mode",{get:()=>ne.dev?"dev":"prod",set(e){if(ne.dev="dev"===e,ne.dev){const e="https://github.com/odoo/owl/blob/master/doc/reference/config.md#mode";console.warn(`Owl is running in 'dev' mode.  This is not suitable for production use. See ${e} for more information.`)}else console.log("Owl is now running in 'prod' mode.")}}),Object.defineProperty(pe,"enableTransitions",{get:()=>ne.enableTransitions,set(e){ne.enableTransitions=e}});class fe extends CustomEvent{constructor(e,t,n){super(t,n),this.originalComponent=e}}const me=Object.assign({},re,{self:"if (e.target !== vn.elm) {return}"});ne.utils.defineProxy=function(e,t){for(let n in t)Object.defineProperty(e,n,{get:()=>t[n],set(e){t[n]=e}})},ne.utils.assignHooks=function(e,t){if("hook"in e){const n=e.hook;for(let e in t){const o=n[e],s=t[e];n[e]=o?(...e)=>{o(...e),s(...e)}:s}}else e.hook=t},ne.addDirective({name:"component",extraNames:["props"],priority:100,atNodeEncounter({ctx:e,value:t,node:n,qweb:o}){e.addLine(`// Component '${t}'`),e.rootContext.shouldDefineQWeb=!0,e.rootContext.shouldDefineParent=!0,e.rootContext.shouldDefineUtils=!0,e.rootContext.shouldDefineScope=!0;let s=!!n.getAttribute("t-props");const i=[];let r="";const a=n.attributes,l={};for(let t=0;t<a.length;t++){const n=a[t].name,o=a[t].textContent;n.startsWith("t-on-")?i.push([n,o]):"t-transition"===n?ne.enableTransitions&&(r=o):n.startsWith("t-")||"class"!==n&&"style"!==n&&(l[n]=e.formatExpression(o)||"undefined")}let c=Object.keys(l).map(e=>e+":"+l[e]).join(","),d=e.generateID();const h=e.generateTemplateKey();let p=n.getAttribute("t-ref"),f="",m="";p&&(e.rootContext.shouldDefineRefs=!0,m=`ref${e.generateID()}`,e.addLine(`const ${m} = ${e.interpolate(p)};`),f=`context.__owl__.refs[${m}] = w${d};`);let g=`w${d}.destroy();`;p&&(g+=`delete context.__owl__.refs[${m}];`),r&&(g=`let finalize = () => {\n          ${g}\n        };\n        delete w${d}.__owl__.transitionInserted;\n        utils.transitionRemove(vn, '${r}', finalize);`);let v="",_=n.getAttribute("class"),w=n.getAttribute("t-att-class"),b=n.getAttribute("style"),y=n.getAttribute("t-att-style");if(y){const t=`_${e.generateID()}`;e.addLine(`const ${t} = ${e.formatExpression(y)};`),y=t}let $="";if(_||w||b||y||i.length){if(_){let t=_.trim().split(/\s+/).map(e=>`'${e}':true`).join(",");$=`_${e.generateID()}`,e.addLine(`let ${$} = {${t}};`)}if(w){let t=e.formatExpression(w);"{"===t[0]&&"}"===t[t.length-1]||(t=`utils.toObj(${t})`),_?e.addLine(`Object.assign(${$}, ${t})`):($=`_${e.generateID()}`,e.addLine(`let ${$} = ${t};`))}const t=y||!!b&&`'${b}'`;v=`utils.assignHooks(vnode.data, {create(_, vn){${t?`vn.elm.style = ${t};`:""}${i.map(function([t,n]){const o=t.match(/\.capture/);t=o?t.replace(/\.capture/,""):t;const{event:s,handler:i}=le(e,t,n,!1,me);return o?`vn.elm.addEventListener('${s}', ${i}, true);`:`vn.elm.addEventListener('${s}', ${i});`}).join("")}}});`}e.addLine(`let w${d} = ${h} in parent.__owl__.cmap ? parent.__owl__.children[parent.__owl__.cmap[${h}]] : false;`);let x=!e.parentNode;if(x){let t=e.generateID();e.rootContext.rootNode=t,x=!0,e.rootContext.shouldDefineResult=!0,e.addLine(`let vn${t} = {};`),e.addLine(`result = vn${t};`)}if(s){const t=e.formatExpression(n.getAttribute("t-props"));e.addLine(`let props${d} = Object.assign({${c}}, ${t});`)}else e.addLine(`let props${d} = {${c}};`);e.addIf(`w${d} && w${d}.__owl__.currentFiber && !w${d}.__owl__.vnode`),e.addLine(`w${d}.destroy();`),e.addLine(`w${d} = false;`),e.closeIf();let C="";x&&(C=`utils.defineProxy(vn${e.rootNode}, pvnode);`);const E=n.childNodes.length;let L=E?"Object.assign(Object.create(context), scope)":"undefined";e.addIf(`w${d}`);let N="";y&&(N=`.then(()=>{if (w${d}.__owl__.status === 5) {return};w${d}.el.style=${y};});`),e.addLine(`w${d}.__updateProps(props${d}, extra.fiber, ${L})${N};`),e.addLine(`let pvnode = w${d}.__owl__.pvnode;`),C&&e.addLine(C),e.parentNode&&e.addLine(`c${e.parentNode}.push(pvnode);`),e.addElse();let k="";t.match(u)||(k=`|| ${e.formatExpression(t)}`);const I=e.interpolate(t);if(e.addLine(`let componentKey${d} = ${I};`),e.addLine(`let W${d} = context.constructor.components[componentKey${d}] || QWeb.components[componentKey${d}]${k};`),e.addLine(`if (!W${d}) {throw new Error('Cannot find the definition of component "' + componentKey${d} + '"')}`),e.addLine(`w${d} = new W${d}(parent, props${d});`),r&&(e.addLine(`const __patch${d} = w${d}.__patch;`),e.addLine(`w${d}.__patch = (t, vn) => {__patch${d}.call(w${d}, t, vn); if(!w${d}.__owl__.transitionInserted){w${d}.__owl__.transitionInserted = true;utils.transitionInsert(w${d}.__owl__.vnode, '${r}');}};`)),e.addLine(`parent.__owl__.cmap[${h}] = w${d}.__owl__.id;`),E){const t=n.cloneNode(!0);for(let e of t.children)e.hasAttribute("t-set")&&e.hasChildNodes()&&(e.setAttribute("t-set-slot",e.getAttribute("t-set")),e.removeAttribute("t-set"));const s=Array.from(t.querySelectorAll("[t-set-slot]")),i=new Set,r=ne.nextSlotId++;if(e.addLine(`w${d}.__owl__.slotId = ${r};`),s.length)for(let e=0,n=s.length;e<n;e++){const n=s[e];let a=n.parentElement,l=!1;for(;a!==t;){if(a.hasAttribute("t-component")||a.tagName[0]===a.tagName[0].toUpperCase()){l=!0;break}a=a.parentElement}if(l)continue;let c=n.getAttribute("t-set-slot");if(i.has(c))continue;i.add(c),n.removeAttribute("t-set-slot"),n.parentElement.removeChild(n);const d=o._compile(`slot_${c}_template`,{elem:n,hasParent:!0});ne.slots[`${r}_${c}`]=d}if(t.childNodes.length){const e=t.ownerDocument.createElement("t");for(let n of Object.values(t.childNodes))e.appendChild(n);const n=o._compile("slot_default_template",{elem:e,hasParent:!0});ne.slots[`${r}_default`]=n}}e.addLine(`let fiber = w${d}.__prepare(extra.fiber, ${L}, () => { const vnode = fiber.vnode; pvnode.sel = vnode.sel; ${v}});`);const S=f?`insert(vn) {${f}},`:"";return e.addLine(`let pvnode = h('dummy', {key: ${h}, hook: {${S}remove() {},destroy(vn) {${g}}}});`),C&&e.addLine(C),e.parentNode&&e.addLine(`c${e.parentNode}.push(pvnode);`),e.addLine(`w${d}.__owl__.pvnode = pvnode;`),e.closeIf(),$&&e.addLine(`w${d}.__owl__.classObj=${$};`),e.addLine(`w${d}.__owl__.parentLastFiberId = extra.fiber.id;`),!0}});const ge=new class{constructor(e){this.tasks=[],this.isRunning=!1,this.requestAnimationFrame=e}start(){this.isRunning=!0,this.scheduleTasks()}stop(){this.isRunning=!1}addFiber(e){return e=e.root,new Promise((t,n)=>{if(e.error)return n(e.error);this.tasks.push({fiber:e,callback:()=>{if(e.error)return n(e.error);t()}}),this.isRunning||this.start()})}rejectFiber(e,t){e=e.root;const n=this.tasks.findIndex(t=>t.fiber===e);if(n>=0){const[o]=this.tasks.splice(n,1);e.cancel(),e.error=new Error(t),o.callback()}}flush(){let e=this.tasks;this.tasks=[],e=e.filter(e=>{if(e.fiber.isCompleted)return e.callback(),!1;if(0===e.fiber.counter){if(!e.fiber.error)try{e.fiber.complete()}catch(t){e.fiber.handleError(t)}return e.callback(),!1}return!0}),this.tasks=e.concat(this.tasks),0===this.tasks.length&&this.stop()}scheduleTasks(){this.requestAnimationFrame(()=>{this.flush(),this.isRunning&&this.scheduleTasks()})}}(B.requestAnimationFrame);class ve{constructor(e,t,n,o,s){this.id=ve.nextId++,this.isCompleted=!1,this.shouldPatch=!0,this.isRendered=!1,this.counter=0,this.vnode=null,this.child=null,this.sibling=null,this.lastChild=null,this.parent=null,this.component=t,this.force=n,this.target=o,this.position=s;const i=t.__owl__;this.scope=i.scope,this.root=e?e.root:this,this.parent=e;let r=i.currentFiber;if(r&&!r.isCompleted){if(this.force=!0,r.root===r&&!e)return this._reuseFiber(r),r;this._remapFiber(r)}this.root.counter++,i.currentFiber=this}_reuseFiber(e){e.cancel(),e.target=this.target||e.target,e.position=this.position||e.position,e.isCompleted=!1,e.isRendered=!1,e.child&&(e.child.parent=null,e.child=null,e.lastChild=null),e.counter=1,e.id=ve.nextId++}_remapFiber(e){if(e.cancel(),this.shouldPatch=e.shouldPatch,e===e.root&&e.counter++,e.parent&&!this.parent)if(this.parent=e.parent,this.root=this.parent.root,this.sibling=e.sibling,this.parent.lastChild===e&&(this.parent.lastChild=this),this.parent.child===e)this.parent.child=this;else{let t=this.parent.child;for(;;){if(t.sibling===e){t.sibling=this;break}t=t.sibling}}}_walk(e){let t=this,n=this;for(;;){const o=e(n);if(o)n=o;else{if(n===t)return;for(;!n.sibling;){if(!n.parent||n.parent===t)return;n=n.parent}n=n.sibling}}}complete(){let e=this.component;this.isCompleted=!0;const t=e.__owl__.status;if(5===t)return;const n=[];this._walk(function(e){return n.push(e),e.child});const o=n.length;if(3===t)for(let t=0;t<o;t++){const o=n[t];o.shouldPatch&&((e=o.component).__owl__.willPatchCB&&e.__owl__.willPatchCB(),e.willPatch())}for(let t=o-1;t>=0;t--){const o=n[t];if(e=o.component,o.target&&0===t){let t;if("self"===o.position){if((t=o.target).tagName.toLowerCase()!==o.vnode.sel)throw new Error(`Cannot attach '${e.constructor.name}' to target node (not same tag name)`);const n=o.vnode.data?{key:o.vnode.data.key}:{},s=j(o.vnode.sel,n);s.elm=t,t=s}else t=e.__owl__.vnode||document.createElement(o.vnode.sel);e.__patch(t,o.vnode)}else o.shouldPatch?(e.__patch(e.__owl__.vnode,o.vnode),e.__owl__.pvnode&&(e.__owl__.pvnode.elm=e.__owl__.vnode.elm)):(e.__patch(document.createElement(o.vnode.sel),o.vnode),e.__owl__.pvnode.elm=e.__owl__.vnode.elm);const s=e.__owl__;o===s.currentFiber&&(s.currentFiber=null)}let s=!1;if(this.target){switch(this.position){case"first-child":this.target.prepend(this.component.el);break;case"last-child":this.target.appendChild(this.component.el)}s=document.body.contains(this.component.el),this.component.env.qweb.trigger("dom-appended")}if(3===t||s)for(let t=o-1;t>=0;t--){const o=n[t];e=o.component,o.shouldPatch&&!this.target?(e.patched(),e.__owl__.patchedCB&&e.__owl__.patchedCB()):e.__callMounted()}else for(let t=o-1;t>=0;t--){(e=n[t].component).__owl__.status=4}}cancel(){this._walk(e=>(e.isRendered||e.root.counter--,e.isCompleted=!0,e.child))}handleError(e){let t=this.component;this.vnode=t.__owl__.vnode||j("div");const n=t.env.qweb;let o=t,s=!1;for(;t&&!(s=!!t.catchError);)o=t,t=t.__owl__.parent;n.trigger("error",e),s?t.catchError(e):(this.root.counter=0,this.root.error=e,ge.flush(),o.destroy())}}function _e(e,t){if(!0===t)return!0;if("function"==typeof t)return"object"==typeof e?e instanceof t:typeof e===t.name.toLowerCase();if(t instanceof Array){let n=!1;for(let o=0,s=t.length;o<s;o++)n=n||_e(e,t[o]);return n}if(t.optional&&void 0===e)return!0;let n=!t.type||_e(e,t.type);if(t.validate&&(n=n&&t.validate(e)),t.type===Array&&t.element)for(let o=0,s=e.length;o<s;o++)n=n&&_e(e[o],t.element);if(t.type===Object&&t.shape){const o=t.shape;for(let t in o)n=n&&_e(e[t],o[t]);if(n)for(let t in e)if(!(t in o))throw new Error(`unknown prop '${t}'`)}return n}ve.nextId=1,ne.utils.validateProps=function(e,t){const n=e.props;if(n instanceof Array){for(let o=0,s=n.length;o<s;o++){const s=n[o];if("?"===s[s.length-1])break;if(!(s in t))throw new Error(`Missing props '${n[o]}' (component '${e.name}')`)}for(let o in t)if(!n.includes(o)&&!n.includes(o+"?"))throw new Error(`Unknown prop '${o}' given to component '${e.name}'`)}else if(n){for(let o in n){if(void 0===t[o]){if(n[o]&&!n[o].optional)throw new Error(`Missing props '${o}' (component '${e.name}')`);continue}let s;try{s=_e(t[o],n[o])}catch(t){throw t.message=`Invalid prop '${o}' in component ${e.name} (${t.message})`,t}if(!s)throw new Error(`Invalid Prop '${o}' in component '${e.name}'`)}for(let o in t)if(!(o in n))throw new Error(`Unknown prop '${o}' given to component '${e.name}'`)}};const we={};function be(e){const t=e.split(/(\{|\}|;)/).map(e=>e.trim()),n=[],o=[];let s=[];function i(){s.length&&(o.push(function e(t,o){const s=[];for(const i of n[t]){let r=o&&o+" "+i||i;r.includes("&")&&(r=i.replace(/&/g,o||"")),t<n.length-1&&(r=e(t+1,r)),s.push(r)}return s.join(", ")}(0)+" {"),o.push(...s),o.push("}"),s=[])}for(;t.length;){let e=t.shift();"}"===e?(i(),n.pop()):("{"===t[0]&&(i(),n.push(e.split(/\s*,\s*/)),t.shift()),";"===t[0]&&s.push("  "+e+";"))}return o.join("\n")}function ye(e,t){const n=we[e];if(!n)throw new Error(`Invalid css stylesheet for component '${t}'. Did you forget to use the 'css' tag helper?`);n.setAttribute("component",t),document.head.appendChild(n)}var $e;!function(e){e[e.CREATED=0]="CREATED",e[e.WILLSTARTED=1]="WILLSTARTED",e[e.RENDERED=2]="RENDERED",e[e.MOUNTED=3]="MOUNTED",e[e.UNMOUNTED=4]="UNMOUNTED",e[e.DESTROYED=5]="DESTROYED"}($e||($e={}));const xe=Symbol("portal");let Ce=1;class Ee{constructor(e,t){Ee.current=this;let n=this.constructor;const o=n.defaultProps;o&&(t=t||{},this.__applyDefaultProps(t,o)),this.props=t,ne.dev&&ne.utils.validateProps(n,this.props);const s=Ce++;let i;if(e){this.env=e.env;const t=e.__owl__;t.children[s]=this,i=t.depth+1}else this.env=this.constructor.env,this.env.qweb||(this.env.qweb=new ne),this.env.browser||(this.env.browser=B),this.env.qweb.on("update",this,()=>{switch(this.__owl__.status){case 3:this.render(!0);break;case 5:this.env.qweb.off("update",this)}}),i=0;const r=this.env.qweb,a=n.template||this.__getTemplate(r);this.__owl__={id:s,depth:i,vnode:null,pvnode:null,status:0,parent:e||null,children:{},cmap:{},currentFiber:null,parentLastFiberId:0,boundHandlers:{},mountedCB:null,willUnmountCB:null,willPatchCB:null,patchedCB:null,willStartCB:null,willUpdatePropsCB:null,observer:null,renderFn:r.render.bind(r,a),classObj:null,refs:null,scope:null},n.style&&this.__applyStyles(n),this.setup()}get el(){return this.__owl__.vnode?this.__owl__.vnode.elm:null}setup(){}async willStart(){}mounted(){}async willUpdateProps(e){}willPatch(){}patched(){}willUnmount(){}async mount(e,t={}){if(!(e instanceof HTMLElement||e instanceof DocumentFragment)){let e=`Component '${this.constructor.name}' cannot be mounted: the target is not a valid DOM node.`;throw new Error(e+="\nMaybe the DOM is not ready yet? (in that case, you can use owl.utils.whenReady)")}const n=t.position||"last-child",o=this.__owl__,s=o.currentFiber;switch(o.status){case 0:{const t=new ve(null,this,!0,e,n);return t.shouldPatch=!1,this.__prepareAndRender(t,()=>{}),ge.addFiber(t)}case 1:case 2:return s.target=e,s.position=n,ge.addFiber(s);case 4:{const t=new ve(null,this,!0,e,n);return t.shouldPatch=!1,this.__render(t),ge.addFiber(t)}case 3:if("self"!==n&&this.el.parentNode!==e){const t=new ve(null,this,!0,e,n);return t.shouldPatch=!1,this.__render(t),ge.addFiber(t)}return Promise.resolve();case 5:throw new Error("Cannot mount a destroyed component")}}unmount(){3===this.__owl__.status&&(this.__callWillUnmount(),this.el.remove())}async render(e=!1){const t=this.__owl__,n=t.currentFiber;if(!t.vnode&&!n)return;if(n&&!n.isRendered&&!n.isCompleted)return ge.addFiber(n.root);const o=t.status,s=new ve(null,this,e,null,null);return Promise.resolve().then(()=>{if(3===t.status||3!==o){if(s.isCompleted||s.isRendered)return;this.__render(s)}else s.isCompleted=!0,t.currentFiber=null}),ge.addFiber(s)}destroy(){const e=this.__owl__;if(5!==e.status){const t=this.el;this.__destroy(e.parent),t&&t.remove()}}shouldUpdate(e){return!0}trigger(e,t){this.__trigger(this,e,t)}__destroy(e){const t=this.__owl__;3===t.status&&(t.willUnmountCB&&t.willUnmountCB(),this.willUnmount(),t.status=4);const n=t.children;for(let e in n)n[e].__destroy(this);if(e){let n=t.id;delete e.__owl__.children[n],t.parent=null}t.status=5,delete t.vnode,t.currentFiber&&(t.currentFiber.isCompleted=!0)}__callMounted(){const e=this.__owl__;e.status=3,e.currentFiber=null,this.mounted(),e.mountedCB&&e.mountedCB()}__callWillUnmount(){const e=this.__owl__;e.willUnmountCB&&e.willUnmountCB(),this.willUnmount(),e.status=4,e.currentFiber&&(e.currentFiber.isCompleted=!0,e.currentFiber.root.counter=0);const t=e.children;for(let e in t){const n=t[e];3===n.__owl__.status&&n.__callWillUnmount()}}__trigger(e,t,n){if(this.el){const o=new fe(e,t,{bubbles:!0,cancelable:!0,detail:n}),s=this.env[xe];s&&s(o),this.el.dispatchEvent(o)}}async __updateProps(e,t,n){if(this.__owl__.scope=n,t.force||this.shouldUpdate(e)){const n=this.__owl__,o=new ve(t,this,t.force,null,null);t.child?t.lastChild.sibling=o:t.child=o,t.lastChild=o;const s=this.constructor.defaultProps;if(s&&this.__applyDefaultProps(e,s),ne.dev&&ne.utils.validateProps(this.constructor,e),await Promise.all([this.willUpdateProps(e),n.willUpdatePropsCB&&n.willUpdatePropsCB(e)]),o.isCompleted)return;this.props=e,this.__render(o)}}__patch(e,t){this.__owl__.vnode=U(e,t)}__prepare(e,t,n){this.__owl__.scope=t;const o=new ve(e,this,e.force,null,null);return o.shouldPatch=!1,e.child?e.lastChild.sibling=o:e.child=o,e.lastChild=o,this.__prepareAndRender(o,n),o}__applyStyles(e){for(;e&&e.style;)e.hasOwnProperty("style")&&(ye(e.style,e.name),delete e.style),e=e.__proto__}__getTemplate(e){let t=this.constructor;if(!t.hasOwnProperty("_template")){let n=t.name;for(;!(n in e.templates)&&t!==Ee;)n=(t=t.__proto__).name;if(t===Ee)throw new Error(`Could not find template for component "${this.constructor.name}"`);t._template=n}return t._template}async __prepareAndRender(e,t){try{const t=Promise.all([this.willStart(),this.__owl__.willStartCB&&this.__owl__.willStartCB()]);if(this.__owl__.status=1,await t,5===this.__owl__.status)return Promise.resolve()}catch(t){return e.handleError(t),Promise.resolve()}e.isCompleted||(this.__render(e),this.__owl__.status=2,t())}__render(e){const t=this.__owl__;let n;t.observer&&(t.observer.allowMutations=!1);try{let o=t.renderFn(this,{handlers:t.boundHandlers,fiber:e});for(let n in t.children){const o=t.children[n],s=o.__owl__;3!==s.status&&s.parentLastFiberId<e.id&&(o.__destroy(s.parent),s.pvnode&&(delete s.pvnode.key,delete s.pvnode.data.hook.remove))}if(!o)throw new Error(`Rendering '${this.constructor.name}' did not return anything`);if(e.vnode=o,t.classObj){const e=o.data;e.class=Object.assign(e.class||{},t.classObj)}}catch(e){n=e}t.observer&&(t.observer.allowMutations=!0),e.root.counter--,e.isRendered=!0,n&&e.handleError(n)}__applyDefaultProps(e,t){for(let n in t)void 0===e[n]&&(e[n]=t[n])}}Ee.template=null,Ee._template=null,Ee.current=null,Ee.components={},Ee.env={},Ee.scheduler=ge;class Le extends o{constructor(e={}){super(),this.rev=1,this.mapping={},this.observer=new s,this.observer.notifyCB=(()=>{let e=this.rev;return Promise.resolve().then(()=>{e===this.rev&&this.__notifyComponents()})}),this.state=this.observer.observe(e),this.subscriptions.update=[]}async __notifyComponents(){const e=++this.rev,t=function(e,t){let n,o=!1;return e.reduce((e,s)=>{let i=t(s);return o&&(i===n?o.push(s):o=!1),o||(o=[s],e.push(o)),n=i,e},[])}(this.subscriptions.update,e=>e.owner?e.owner.__owl__.depth:-1);for(let n of t){const t=n.map(t=>t.callback.call(t.owner,e));ge.flush(),await Promise.all(t)}}}function Ne(e,t,n){const o=t.__owl__,i=o.id,r=e.mapping;if(i in r)return e.state;o.observer||(o.observer=new s,o.observer.notifyCB=t.render.bind(t)),r[i]=0;const a=o.renderFn;o.renderFn=function(t,n){return r[i]=e.rev,a(t,n)},e.on("update",t,async e=>{r[i]<e&&(r[i]=e,await n())});const l=t.__destroy;return t.__destroy=(n=>{e.off("update",t),delete r[i],l.call(t,n)}),e.state}function ke(e){const t=Ee.current,n=t.__owl__;return n.observer||(n.observer=new s,n.observer.notifyCB=t.render.bind(t)),n.observer.observe(e)}function Ie(e,t=!1){return t?function(t){const n=Ee.current;if(n.__owl__[e]){const o=n.__owl__[e];n.__owl__[e]=function(){o.call(n),t.call(n)}}else n.__owl__[e]=t}:function(t){const n=Ee.current;if(n.__owl__[e]){const o=n.__owl__[e];n.__owl__[e]=function(){t.call(n),o.call(n)}}else n.__owl__[e]=t}}function Se(e){return function(t){const n=Ee.current;if(n.__owl__[e]){const o=n.__owl__[e];n.__owl__[e]=function(...e){return Promise.all([o.call(n,...e),t.call(n,...e)])}}else n.__owl__[e]=t}}const De=Ie("mountedCB",!0),Ae=Ie("willUnmountCB"),Pe=Ie("willPatchCB"),Te=Ie("patchedCB",!0),Re=Se("willStartCB"),Me=Se("willUpdatePropsCB");function Oe(e){const t=Ee.current;t.env=Object.assign(Object.create(t.env),e)}var je=Object.freeze({__proto__:null,useState:ke,onMounted:De,onWillUnmount:Ae,onWillPatch:Pe,onPatched:Te,onWillStart:Re,onWillUpdateProps:Me,useRef:function(e){const t=Ee.current.__owl__;return{get el(){const n=t.refs&&t.refs[e];return n instanceof HTMLElement?n:n instanceof Ee?n.el:null},get comp(){const n=t.refs&&t.refs[e];return n instanceof Ee?n:null}}},useComponent:function(){return Ee.current},useEnv:function(){return Ee.current.env},useSubEnv:Oe,useExternalListener:function(e,t,n,o){const s=n.bind(Ee.current);De(()=>e.addEventListener(t,s,o)),Ae(()=>e.removeEventListener(t,s,o))}});class Ue extends Le{constructor(e){if(super(e.state),this.actions=e.actions,this.env=e.env,this.getters={},this.updateFunctions=[],e.getters){const t={state:this.state,getters:this.getters};for(let n in e.getters)this.getters[n]=e.getters[n].bind(this,t)}}dispatch(e,...t){if(!this.actions[e])throw new Error(`[Error] action ${e} is undefined`);return this.actions[e]({dispatch:this.dispatch.bind(this),env:this.env,state:this.state,getters:this.getters},...t)}__notifyComponents(){return this.trigger("before-update"),super.__notifyComponents()}}const Fe=(e,t)=>e===t;function Be(e,...t){const n=`__template__${ne.nextId++}`,o=String.raw(e,...t);return ne.registerTemplate(n,o),n}var qe=Object.freeze({__proto__:null,xml:Be,css:function(e,...t){const n=`__sheet__${ne.nextId++}`;return function(e,t){const n=document.createElement("style");n.innerHTML=be(t),we[e]=n}(n,String.raw(e,...t)),n}});class Ke extends Ee{async __updateProps(e,t){this.render(t.force)}}Ke.template=Be`<t t-slot="default"/>`;class We extends Ee{constructor(e,t){super(e,t),this.doTargetLookUp=!0,this._handledEvents=new Set,this._handlerTunnel=(e=>{e.stopPropagation(),this.__trigger(e.originalComponent,e.type,e.detail)}),this.parentEnv=null,this.portal=null,this.target=null,this.parentEnv=e?e.env:{},Oe({[xe]:e=>{this._handledEvents.has(e.type)||(this.portal.elm.addEventListener(e.type,this._handlerTunnel),this._handledEvents.add(e.type))}})}__callWillUnmount(){super.__callWillUnmount(),this.el.appendChild(this.portal.elm),this.doTargetLookUp=!0}__checkVNodeStructure(e){const t=e.children;let n=0;for(let e of t)e.sel&&n++;if(1!==n)throw new Error(`Portal must have exactly one non-text child (has ${n})`)}__checkTargetPresence(){if(!this.target||!document.contains(this.target))throw new Error(`Could not find any match for "${this.props.target}"`)}__deployPortal(){this.__checkTargetPresence(),this.target.appendChild(this.portal.elm)}__destroy(e){if(this.portal&&this.portal.elm){const e=this.portal.elm,t=e.parentNode;t&&t.removeChild(e)}super.__destroy(e)}__patch(e,t){if(this.doTargetLookUp){const e=document.querySelector(this.props.target);e?(this.doTargetLookUp=!1,this.target=e):this.env.qweb.on("dom-appended",this,()=>{this.doTargetLookUp=!1,this.env.qweb.off("dom-appended",this),this.target=document.querySelector(this.props.target),this.__deployPortal()})}this.__checkVNodeStructure(t);const n=(!this.portal||this.el.contains(this.portal.elm))&&!this.doTargetLookUp;this.doTargetLookUp||n||this.__checkTargetPresence();const o=this.portal?this.portal:document.createElement(t.children[0].sel);this.portal=U(o,t.children[0]),t.children=[],super.__patch(e,t),n&&this.__deployPortal()}__trigger(e,t,n){const o=this.env;this.env=this.parentEnv,super.__trigger(e,t,n),this.env=o}}We.template=Be`<portal><t t-slot="default"/></portal>`,We.props={target:{type:String}};class ze extends Ee{constructor(){super(...arguments),this.href=this.env.router.destToPath(this.props)}async willUpdateProps(e){this.href=this.env.router.destToPath(e)}get isActive(){return"hash"===this.env.router.mode?document.location.hash===this.href:document.location.pathname===this.href}navigate(e){if(!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey||void 0!==e.button&&0!==e.button)){if(e.currentTarget&&e.currentTarget.getAttribute){const t=e.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(t))return}e.preventDefault(),this.env.router.navigate(this.props)}}}ze.template=Be`
    <a  t-att-class="{'router-link-active': isActive }"
        t-att-href="href"
        t-on-click="navigate">
        <t t-slot="default"/>
    </a>
  `;class Ve extends Ee{get routeComponent(){return this.env.router.currentRoute&&this.env.router.currentRoute.component}}Ve.template=Be`
    <t>
        <t
            t-if="routeComponent"
            t-component="routeComponent"
            t-key="env.router.currentRouteName"
            t-props="env.router.currentParams" />
    </t>
  `;const He=/\{\{(.*?)\}\}/;function Ge(e){const t=/\{\{(.*?)\}\}/g,n=[];let o;do{(o=t.exec(e))&&n.push(o[1].split(".")[0])}while(o);return n}const Qe=Le,Ye=ke,Ze={EventBus:o,Observer:s},Xe={Router:class{constructor(e,t,n={mode:"history"}){this.currentRoute=null,this.currentParams=null,e.router=this,this.mode=n.mode,this.env=e,this.routes={},this.routeIds=[];let o=1;for(let e of t)e.name||(e.name="__route__"+o++),e.component&&ne.registerComponent("__component__"+e.name,e.component),e.redirect&&this.validateDestination(e.redirect),e.params=e.path?Ge(e.path):[],this.routes[e.name]=e,this.routeIds.push(e.name)}async start(){this._listener=(e=>this._navigate(this.currentPath(),e)),window.addEventListener("popstate",this._listener),"hash"===this.mode&&window.addEventListener("hashchange",this._listener);const e=await this.matchAndApplyRules(this.currentPath());if("match"===e.type){this.currentRoute=e.route,this.currentParams=e.params;const t=this.routeToPath(e.route,e.params);t!==this.currentPath()&&this.setUrlFromPath(t)}}async navigate(e){const t=this.destToPath(e);return this._navigate(t)}async _navigate(e,t){const n=this.currentRouteName,o=this.currentParams,s=await this.matchAndApplyRules(e);if("match"===s.type){const e=this.routeToPath(s.route,s.params);t&&t instanceof PopStateEvent||this.setUrlFromPath(e),this.currentRoute=s.route,this.currentParams=s.params}else"nomatch"===s.type&&(this.currentRoute=null,this.currentParams=null);return!(this.currentRouteName===n&&W(this.currentParams,o)||(this.env.qweb.forceUpdate(),0))}destToPath(e){return this.validateDestination(e),e.path||this.routeToPath(this.routes[e.to],e.params)}get currentRouteName(){return this.currentRoute&&this.currentRoute.name}setUrlFromPath(e){const t="hash"===this.mode?location.pathname:"",n=location.origin+t+e;n!==window.location.href&&window.history.pushState({},e,n)}validateDestination(e){if(!e.path&&!e.to||e.path&&e.to)throw new Error(`Invalid destination: ${JSON.stringify(e)}`)}routeToPath(e,t){const n=e.path.split("/"),o=n.length;for(let e=0;e<o;e++){const o=n[e].match(He);if(o){const s=o[1].split(".")[0];n[e]=t[s]}}return("hash"===this.mode?"#":"")+n.join("/")}currentPath(){return("history"===this.mode?window.location.pathname:window.location.hash.slice(1))||"/"}match(e){for(let t of this.routeIds){let n=this.routes[t],o=this.getRouteParams(n,e);if(o)return{type:"match",route:n,params:o}}return{type:"nomatch"}}async matchAndApplyRules(e){const t=this.match(e);return"match"===t.type?this.applyRules(t):t}async applyRules(e){const t=e.route;if(t.redirect){const e=this.destToPath(t.redirect);return this.matchAndApplyRules(e)}if(t.beforeRouteEnter){const e=await t.beforeRouteEnter({env:this.env,from:this.currentRoute,to:t});if(!1===e)return{type:"cancelled"};if(!0!==e){const t=this.destToPath(e);return this.matchAndApplyRules(t)}}return e}getRouteParams(e,t){if("*"===e.path)return{};t.startsWith("#")&&(t=t.slice(1));const n=e.path.split("/"),o=t.split("/"),s=n.length;if(s!==o.length)return!1;const i={};for(let e=0;e<s;e++){const t=n[e];let s=o[e];const r=t.match(He);if(r){const[e,t]=r[1].split(".");"number"===t&&(s=parseInt(s,10)),i[e]=s}else if(t!==s)return!1}return i}},RouteComponent:Ve,Link:ze},Je=Ue,et=z,tt=qe,nt={AsyncRoot:Ke,Portal:We},ot=Object.assign({},je,{useContext:function(e){const t=Ee.current;return Ne(e,t,t.render.bind(t))},useDispatch:function(e){return(e=e||Ee.current.env.store).dispatch.bind(e)},useGetters:function(e){return(e=e||Ee.current.env.store).getters},useStore:function(e,t={}){const n=Ee.current,o=n.__owl__.id,s=t.store||n.env.store;if(!(s instanceof Ue))throw new Error(`No store found when connecting '${n.constructor.name}'`);let i=e(s.state,n.props);const r=s.observer.revNumber.bind(s.observer);let a=r(i);const l=t.isEqual||Fe;function c(t,n){const o=i;i=e(t,n);const s=r(i);return(s>0&&a!==s||!l(o,i))&&(a=s,!0)}s.updateFunctions[o]||(s.updateFunctions[o]=[]),t.onUpdate&&s.on("before-update",n,()=>{const o=e(s.state,n.props);t.onUpdate(o)}),s.updateFunctions[o].push(function(){return c(s.state,n.props)}),Ne(s,n,function(){let e=!1;for(let t of s.updateFunctions[o])e=t()||e;if(e)return n.render()}),Me(e=>{c(s.state,e)});const d=n.__destroy;return n.__destroy=(e=>{delete s.updateFunctions[o],t.onUpdate&&s.off("before-update",n),d.call(n,e)}),"object"!=typeof i||null===i?i:new Proxy(i,{get:(e,t)=>i[t],set(e,t,n){throw new Error("Store state should only be modified through actions")},has:(e,t)=>t in i})}}),st={};n.Component=Ee,n.Context=Qe,n.QWeb=ne,n.Store=Je,n.__info__=st,n.browser=B,n.config=pe,n.core=Ze,n.hooks=ot,n.misc=nt,n.mount=async function(e,t){const{env:n,props:o,target:s}=t;let i=e.hasOwnProperty("env")?e.env:null;n&&(e.env=n);const r=new e(null,o);i?e.env=i:delete e.env;const a=t.position||"last-child";return await r.mount(s,{position:a}),r},n.router=Xe,n.tags=tt,n.useState=Ye,n.utils=et,st.version="1.2.4",st.date="2021-02-10T13:24:15.236Z",st.hash="985e985",st.url="https://github.com/odoo/owl"},{}]},{},[1]);