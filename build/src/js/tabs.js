const tabHandlers = () => {
    const tabbeds = document.querySelectorAll('.tabbed');

    if(tabbeds.length>0){
        tabbeds.forEach(tabbed=>{
            const tablist = tabbed?.querySelector('ul');
            const tabs = tablist?.querySelectorAll('a');
            const panels = tabbed?.querySelectorAll('.tab_panel');
            const tabLinks =tabbed?.querySelectorAll('.tab_panel a');
            tabs.forEach(tab => {
                // Handle clicking of tabs for mouse users
                tab.addEventListener('click', e => {
                    e.preventDefault();
                    let currentTab = tablist.querySelector('[aria-selected=true]');
                    if (e.currentTarget !== currentTab) {
                        e.currentTarget.focus();
                        switchTab(currentTab, e.currentTarget, tabs, panels);
                    }
                    else{
                        closeTabs(tabs,panels);
                    }
                });	
                tab.addEventListener('blur',e=>{
                    if(!e.relatedTarget){
                        closeTabs(tabs,panels);
                        return;
                    }
                    if(!e.relatedTarget.parentNode.classList.contains('tabbed')&&!e.relatedTarget.closest('.tabbed')){
                        closeTabs(tabs,panels)
                    }
                    
                })
                tabLinks[tabLinks.length -1].addEventListener('blur',e=>{
                    if(!e.relatedTarget){
                        closeTabs(tabs,panels);
                        return;
                    }
                    if(!e.relatedTarget.parentNode.classList.contains('tabbed')&&!e.relatedTarget.closest('.tabbed')){
                        closeTabs(tabs,panels)
                    }
                    
                })

                // Handle keydown events for keyboard users
            /*  tab.addEventListener('keydown', e => {
                // Get the index of the current tab in the tabs node list
                let index = Array.prototype.indexOf.call(tabs, e.currentTarget);
                // Work out which key the user is pressing and
                // Calculate the new tab's index where appropriate
                let dir = e.code === 'ArrowLeft' ? index - 1 : e.code === 'ArrowRight' ? index + 1 : e.code === 'ArrowDown' ? 'down' : null;
                if (dir !== null) {
                    e.preventDefault();
                    // If the down key is pressed, move focus to the open panel,
                    // otherwise switch to the adjacent tab
                    dir === 'down' ? openTab(tabs[dir],panels[index]) : tabs[dir] ? switchTab(e.currentTarget, tabs[dir],tabs, panels) : void 0;
                }
                }); */
            });
        })
    }	
            // The tab switching function
    function switchTab(oldTab, newTab, tabs, panels){
        newTab.focus();
        // Make the active tab focusable by the user (Tab key)
        newTab.removeAttribute('tabindex');
        // Set the selected state
        newTab.setAttribute('aria-selected', 'true');
        newTab.parentNode.classList.add('active');
        oldTab?.removeAttribute('aria-selected');
        oldTab?.setAttribute('tabindex', '-1');
        oldTab?.parentNode.classList.remove('active');
        // Get the indices of the new and old tabs to find the correct
        // tab panels to show and hide
        let index = Array.prototype.indexOf.call(tabs, newTab);
        let oldIndex = Array.prototype.indexOf.call(tabs, oldTab);
        panels[oldIndex]?.classList.remove('active');
        panels[index].classList.add('active');
        let nextTab = tabs[index+1]?tabs[index+1]:null;
        let previousTab = tabs[index-1]?tabs[index-1]:null;
        tabTabTrap(newTab,tabs[index+1],tabs[index-1],panels[index]);
    }

    function openTab(tab,panel){
        tab.removeAttribute('tabindex');
        tab.setAttribute('aria-selected', 'true');
        tab.parentNode.classList.add('active');
        panel.classList.add('active');
        tabTabTrap(tab,panel)
    }
    function closeTabs(tabs,panels){
        tabs.forEach(tab=>{tab.parentElement.classList.remove('active');tab.removeAttribute('aria-selected');});
        panels.forEach(panel=>panel.classList.remove('active'));
    }

    function tabTabTrap(tab,nextTab,previousTab,panel){
        const tabIndexes = panel.querySelectorAll('a[href], button, input, textarea, select, details');
        let first = tabIndexes[0];
        let last = tabIndexes[tabIndexes.length - 1];
        [tab,panel].forEach(el=>{
            el.addEventListener('keydown',(e)=>{
                if (e.key === 'Tab') {
                    if ( e.shiftKey ) /* shift + tab */ {
                    if (document.activeElement === tab) {
                        if(previousTab){
                            previousTab.focus();
                            e.preventDefault();
                        }
                    }
                    else if(document.activeElement === first){
                        tab.focus();
                        e.preventDefault();
                    }
                    } else /* tab */ {
                    if (document.activeElement ===last) {
                        if(nextTab){
                            nextTab.focus();
                            e.preventDefault();
                        }
                    }
                    else if(document.activeElement === tab){
                        if(panel.classList.contains('active')){
                            first.focus();
                            e.preventDefault();
                        }
                    }
                    }
                }
            });
        })
    }
}

export default tabHandlers;