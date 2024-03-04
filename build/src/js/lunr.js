import lunr from "lunr"

const lunrLoadIndex = async () => {
    const file =  await fetch('/lunrIndex.json');
    const data = await file.json();
    const doc = await fetch('/lunr.json');
    let reference = await doc.json();
    reference = reference.reduce(function (memo, doc) {
        memo[doc.index] = doc
        return memo
      }, {});
    const idx = lunr.Index.load(data);
    return {idx, reference};
}

const lunrInit = (idx,reference) => {
    const searchInput = document.getElementById('search_input');
    const searchResults = document.getElementById('search_results');
    const searchTerm = document.getElementById('search_term');
    searchInput.addEventListener('input', debounce(() => {
        if(searchInput.value.length < 3) return;
        searchTerm.textContent = 'Searching...';
        const results = idx.search(searchInput.value);
        searchResults.innerHTML = '';
        if(results.length == 0){
            searchResults.innerHTML = '<li>No results found</li>';
        }
        else{
            
            for(let i = 0; i < 5; i++){
                const item = buildSearchResults(reference[results[i].ref]);
                searchResults.appendChild(item);
            }
            if(results.length > 5){
                const more = document.createElement('a');
                more.textContent = 'More results...';
                more.href = `/search.html?q=${searchInput.value}`;
                searchResults.appendChild(more);
            }
            const event = new CustomEvent("search_results_returned");
            window.dispatchEvent(event);
        }
        searchTerm.textContent = `Search results for: ${searchInput.value}`;
    }, 500));
}

const lunrPageSearch = (idx,reference) => {
    const term = new URLSearchParams(window.location.search).get('q');
    const searchResults = document.getElementById('search_results_page');
    const searchTerm = document.getElementById('search_term_page');
    const searchInput = document.getElementById('search_input_page');
    searchTerm.textContent = term;
    searchInput.value = term;
    const results = idx.search(term);
    searchResults.innerHTML = '';
    if(results.length == 0){
        searchResults.innerHTML = '<li>No results found</li>';
    }
    else{
        results.forEach((result) => {
            const item = buildSearchResults(reference[result.ref]);
            searchResults.appendChild(item);
        });
    }
    searchInput.addEventListener('input', debounce(() => {
        searchTerm.textContent = 'Searching...';
        const results = idx.search(searchInput.value);
        searchResults.innerHTML = '';
        if(results.length == 0){
            searchResults.innerHTML = '<li>No results found</li>';
        }
        else{
            
            for(let i = 0; i < 6; i++){
                const item = buildSearchResults(reference[results[i].ref]);
                searchResults.appendChild(item);
            }
            if(results.length > 6){
                const more = document.createElement('a');
                more.textContent = 'More results...';
                more.href = `/search.html?q=${searchInput.value}`;
                searchResults.appendChild(more);
            }
            const event = new CustomEvent("search_results_returned");
            window.dispatchEvent(event);
        }
        searchTerm.textContent = `Search results for: ${searchInput.value}`
    }, 500));
}

const debounce = (callback, delay = 1000) => {
    var time;
  
    return (...args) => {
      clearTimeout(time);
      time = setTimeout(() => {
        callback(...args);
      }, delay);
    };
}

const buildSearchResults =  (doc) => {
    const li = document.createElement('li'),
        anchor = document.createElement('a'),
        h3 = document.createElement('h3'),
        p = document.createElement('p'),
        txtContainer = document.createElement('div'),
        imgContainer = document.createElement('div'),
        img = document.createElement('img');
    h3.textContent = doc.title;
    p.textContent = doc.excerpt;
    img.src = doc.image;
    anchor.href = doc.url;
    anchor.classList.add('card');

    li.classList.add('flex_item');
    
    p.classList.add('small');

    imgContainer.classList.add('container');
    imgContainer.classList.add('container--sixteennine');

    txtContainer.classList.add('card_text');
    txtContainer.appendChild(h3);
    txtContainer.appendChild(p);

    li.appendChild(anchor);
    imgContainer.appendChild(img);
    anchor.appendChild(imgContainer);
    anchor.appendChild(txtContainer)

    return li;
}

export {lunrLoadIndex,lunrInit,lunrPageSearch};