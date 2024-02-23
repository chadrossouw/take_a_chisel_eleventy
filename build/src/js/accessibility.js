const switches = () => {
    const colorSwitchers = document.querySelectorAll('.switch');
    const textSwitcher = document.querySelectorAll('.text_sizer_button');
    let fontSize = document.cookie
    .split("; ")
    .find((row) => row.startsWith("size="))
    ?.split("=")[1];
    fontSize = fontSize?parseInt(fontSize):100;
    if(!colorSwitchers.length||!textSwitcher.length) return;
    
    colorSwitchers.forEach(colorSwitcher=>{
        colorSwitcher.addEventListener('click', toggleSwitch);
    })
    const body = document.body;
    function toggleSwitch(e){
        e.preventDefault();
        colorSwitchers.forEach(button=>{
            if(button.hasAttribute('aria-pressed')){
                button.removeAttribute('aria-pressed');
                button.setAttribute('aria-label','Switch to muted mode');
                document.cookie=`mode=vivid;path=/;`;
            }
            else{
                button.setAttribute('aria-pressed', 'true');
                button.setAttribute('aria-label','Switch to vivid mode');
                document.cookie=`mode=muted;path=/;`;
            }
        });
        
        body.classList.toggle('muted');
    }

    textSwitcher.forEach(button=>{
        button.addEventListener('click', changeTextSize);
    });

    function changeTextSize(e){

        if(e.currentTarget.dataset.size == "larger"&&fontSize<200){
            fontSize+=10;
            
            document.documentElement.style.fontSize=`${fontSize}%`;
        }
        else if(e.currentTarget.dataset.size == "smaller"&&fontSize>100){
            fontSize-=10;
            document.documentElement.style.fontSize=`${fontSize}%`;
        }
        else if(e.currentTarget.dataset.size == "reset"){
            fontSize = 100;
            document.documentElement.style.fontSize=`${fontSize}%`;
        }
        if(fontSize==200){
            textSwitcher.forEach(button=>{
                if(button.dataset.size == "larger"){
                    button.setAttribute('disabled','true');
                }
            });
        
        }
        else if (fontSize==100){
            textSwitcher.forEach(button=>{
                if(button.dataset.size != "larger"){
                    button.setAttribute('disabled','true');
                }
                else{
                    button.removeAttribute('disabled');
                }
            });
        }
        else if(fontSize>100){
            textSwitcher.forEach(button=>{
                button.removeAttribute('disabled');
            });
        }
        document.cookie=`size=${fontSize}; path=/;`;
    }

}

const altBlock = (container = false) => {
    let blockTriggers =[];
    if(!container){
        blockTriggers = document.querySelectorAll('.alt_trigger');
    }
    else{
        blockTriggers = container.querySelectorAll('.alt_trigger');
    }
    if(!blockTriggers.length) return;
    blockTriggers.forEach(trigger=>{
        const closer = trigger.nextElementSibling.querySelector('.close');
        if(closer){
            closer.trigger = trigger;
            closer.addEventListener('click',closeAltBlock);
        }
        trigger.closer = closer;
        trigger.addEventListener('click', openAltBlock);
    });

}

const openAltBlock = (e) => {
    e.preventDefault();
    const target = e.currentTarget;
    const block = target.parentNode;
    console.log(block);
    block.classList.add('open');   
    target.closer.focus(); 
    block.closer = target.closer;
    block.target = target;
    block.addEventListener("keydown", altKeyHandler);
}

const closeAltBlock = (e) => {
    const target = e.currentTarget;
    const block = target.parentNode.parentNode;
    block.classList.remove('open');
    target.trigger.focus();
    block.removeEventListener("keydown", altKeyHandler);
}

const altKeyHandler = (e) => {
    if(e.key == "Escape" ){
        e.preventDefault();
        e.currentTarget.classList.remove('open');
        e.currentTarget.target.focus();
        e.currentTarget.removeEventListener("keydown", altKeyHandler);
    }
    if(e.key=='Tab'){
        e.preventDefault();
        e.currentTarget.closer.focus();
    }
}

const languageSwitcher = () => {
    const toggle = document.querySelector('.wpml-ls-item-toggle');
    if(!toggle) return;
    const container = document.querySelector('.wpml-ls-legacy-dropdown-click');
    let currentLanguage = toggle.querySelector('.wpml-ls-native');
    currentLanguage = currentLanguage?currentLanguage.textContent:'';
    toggle.setAttribute('aria-label',`Open language menu. Current language is ${currentLanguage}`);
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('role','button');
    let span = document.createElement('span');
    span.classList.add('screen-reader-text');
    span.innerHTML = 'Open language menu';
    toggle.appendChild(span);
    container.toggle = toggle;
    container.addEventListener('click',toggleLanguageMenuAria);

    const languageMenu = document.querySelector('.wpml-ls-sub-menu');
    languageMenu.setAttribute('aria-label','Language menu');
    languageMenu.id = 'language_menu';
    toggle.setAttribute('aria-controls','language_menu');

    const languageList = document.querySelectorAll('.wpml-ls-sub-menu a');
    languageList.forEach(language=>{
        let currentLangSpan = language.querySelector('.wpml-ls-native');
        //let currentLang = currentLangSpan?currentLangSpan.textContent:'';
        //language.setAttribute('aria-label',`Switch language to ${currentLang}`);
        let span = document.createElement('span');
        span.classList.add('screen-reader-text');
        span.innerHTML = `Switch language to`;
        currentLangSpan.insertAdjacentElement('beforebegin',span);
    });
}

const toggleLanguageMenuAria = (e) => {
    const target = e.currentTarget.toggle;
    if(target.getAttribute('aria-expanded')=='true'){
        target.setAttribute('aria-expanded','false');
    }
    else{
        target.setAttribute('aria-expanded','true');
    }
    e.currentTarget.addEventListener('focusout',closeLanguageMenu);
}

const closeLanguageMenu = (e) => {
    console.log(e);
    const target = e.currentTarget;
    if(e.relatedTarget&&(e.relatedTarget.classList.contains('switch')||e.relatedTarget.classList.contains('skip-link'))){
        target.firstElementChild.click();
        e.currentTarget.removeEventListener('focusout',closeLanguageMenu);
    }
}

const cookieBanner = () => {
    const banner = document.querySelector('.cky-consent-container');
    if(!banner){
        return false;
    }
    banner.setAttribute('role','dialog');
    banner.removeAttribute('tabindex');
    const headings = banner.querySelectorAll('.cky-title,.cky-preference-title');
    if(headings.length){
        headings.forEach(heading=>{
            heading.setAttribute('aria-level','2');
        });
    }

    const ckyBtn = document.querySelector('.cky-btn-revisit');
    ckyBtn.setAttribute('aria-label','Update cookie preferences');
    ckyBtn.firstElementChild.remove();
    ckyBtn.innerHTML = 'Manage cookie preferences';
    const ckyBtnWrapper = ckyBtn.parentNode;
    ckyBtnWrapper.setAttribute('data-tooltip','Update cookie preferences');
    return true;
}
export {switches,altBlock,languageSwitcher,cookieBanner}