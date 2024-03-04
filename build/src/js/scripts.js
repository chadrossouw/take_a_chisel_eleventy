import {navigation,dynamicVH } from "./navigation.js";
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import php from 'highlight.js/lib/languages/php';
import handlebars from 'highlight.js/lib/languages/handlebars';
import {lunrLoadIndex,lunrInit,lunrPageSearch} from "./lunr.js";
//import filters from "./filters.js";
import {altBlock} from "./accessibility.js";
import playerWithCover from "./player.js";

//import formHandler from "./forms.js";
//import swiper_init from "./swiper-init.js"; 
import accordion from "./accordion.js";
import modalHandlers from "./modal.js";
//import sharOnMobile from "./social.js";
//import tabHandlers from "./tabs.js";

dynamicVH();
navigation();
//languageSwitcher();
//switches();
altBlock();
//filters();
playerWithCover(); 
//formHandler();
//swiper_init();
accordion();
modalHandlers();
//sharOnMobile();
//tabHandlers();

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('php', php);
hljs.registerLanguage('handlebars', handlebars);
hljs.highlightAll();

lunrLoadIndex().then((data) => {
    const {idx, reference} = data;
    lunrInit(idx,reference);
    if(window.location.pathname === '/search.html'){
        lunrPageSearch(idx,reference);
    }
});