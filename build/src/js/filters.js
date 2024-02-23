import { altBlock } from "./accessibility";
const filters = () => {
    const filters = document.querySelector('#filter');
    if(!filters) return;
    const container = document.getElementById('response');
    const action = container.dataset.action;
    const currentFilters = document.querySelector('#current_filters');
    const clearFilters = document.querySelector('#clear');
    const filterOpen = document.querySelector('#open_filters');
    const filterDiv = document.querySelector('#filter_list');
    //const filtersReset = filters.querySelector('input[type="reset"]');
    const prefersReduced =  window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||window.matchMedia("(prefers-reduced-motion: reduce)").matches ==true;
    let isFilterOpenerHidden = window.getComputedStyle(filterOpen).display === 'none';
    let hasTransitionEnd = false;
    let isOpen = false;
    if(!isFilterOpenerHidden){
        filterDiv.style.visibility='hidden';
    }
    filters.addEventListener('change', filterOrgs);
    filters.addEventListener('reset', clearAllFilters);
    clearFilters.addEventListener('click', clearAllFilters);
    filterOpen.addEventListener('click', (e)=>{
        filterDiv.classList.toggle('open');
        if(e.currentTarget.getAttribute('aria-expanded')=='false'){
            e.currentTarget.setAttribute('aria-expanded','true');
            filterDiv.style.visibility='visible';
            isOpen = true;
        }
        else{
            e.currentTarget.setAttribute('aria-expanded','false');
            isOpen = false;
            if(prefersReduced){
                if(isOpen) return;
                filterDiv.style.visibility='hidden';
                return;
            }
            if(!hasTransitionEnd){
                filterDiv.addEventListener('transitionend',()=>{
                    if(isOpen) return;
                    hasTransitionEnd = true;
                    filterDiv.style.visibility='hidden';
                });
            }
        }
    });
    function filterOrgs(e){
        let urlParams='';
        addActiveFilter(e.target);
        urlParams = new URLSearchParams(new FormData(filters)).toString();
        if(urlParams){
            currentFilters.parentNode.classList.remove('hide');
        }
        else{
            currentFilters.parentNode.classList.add('hide');
        }
        history.pushState('','',`?${urlParams}`);
        container.classList.add('loading');
        container.setAttribute('aria-busy', 'true');
         fetch(`${action}?${urlParams}`)
            .then(response=>response.json())
            .then(data => changeResponse(data))
            .catch(error=>{
                console.log(error);
                container.classList.remove('loading');
                container.setAttribute('aria-busy', 'false');
            });   
    }
    
    function clearAllFilters(){
        filters.reset();
        filters.querySelectorAll('input[type="checkbox"]').forEach(input=>{
            input.checked=false;
            /*This weirdness is because for some reason the checked=false wasn't working on inputs set by php*/
            input.removeAttribute('checked');
        });
        currentFilters.innerHTML = '';
        history.pushState('','','?');
        container.classList.add('loading');
        fetch(`${action}`)
            .then(response=>response.json())
            .then(data => changeResponse(data))
            .catch(error=>{
                console.log(error);
                container.classList.remove('loading');
            });
        currentFilters.parentNode.classList.add('hide');
    }

    function changeResponse(data){
        container.innerHTML = data;
        container.classList.remove('loading');
        container.setAttribute('aria-busy', 'false');
        altBlock(container);
    }

    function addActiveFilter(target){
        if(target.checked){
            let li = document.createElement('li');
            li.dataset.name = target.value;
            li.innerHTML = target.dataset.name
            currentFilters.append(li);
        }
        else{
            let li = currentFilters.querySelector(`li[data-name="${target.value}"]`);
            li.remove();
        }
    }
};

export default filters;