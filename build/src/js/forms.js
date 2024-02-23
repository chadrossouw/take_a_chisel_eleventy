const formHandler = () => {
    const form = document.querySelector('#signupform');
    if(!form) return;

    const formResponse = document.querySelector('#form_response');
    const submitButton = form.querySelector('input[type="submit"]');
    form.validateForm = () => {
        let errors = 0;
        let requiredFields = form.querySelectorAll('[aria-required]');
        formResponse.setAttribute('aria-live','polite');
        formResponse.innerHTML = '';
        requiredFields.forEach(field=>{ 
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
            field.classList.remove('error');
            let error = document.querySelector(`#${field.id}_error`);
            if(error){
                error.remove();
            }
            let isValid = true;
            let isCheckbox = field.type=='checkbox';
            if(isCheckbox&&!field.checked){
                isValid = false;
            }
            else if(!field.value){
                isValid = false;
            }
            if(!isValid){
                errors ++;
                field.setAttribute('aria-invalid','true');
                field.setAttribute('aria-describedby',field.id + '_error');
                field.classList.add('error');
                let span = document.createElement('span');
                span.id=field.id + '_error';
                span.classList.add('error_message');
                console.log(field.labels[0].firstChild);
                span.innerHTML = `${field.labels[0].firstChild.wholeText} is required`;
                if(!isCheckbox){
                    field.insertAdjacentElement('afterend',span);
                }
                else{
                    field.parentNode.appendChild(span);
                }
            }
        });
        if(errors>0){
            let pError = document.createElement('p');
            pError.innerHTML = `Failed to submit because ${errors} ${errors>1?'fields are':'field is'} invalid. Please correct the errors below`;
            formResponse.appendChild(pError);
            formResponse.classList.add('error');
            formResponse.setAttribute('aria-live','assertive');
            return false;
        }
        else{
            return true;
        }
    }
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let validate = e.target.validateForm();
        if(!validate) return;
        let formData = new FormData(form);
        formData = JSON.stringify(Object.fromEntries(formData));
        form.classList.add('loading');
        submitButton.disabled = true;
        form.setAttribute('aria-busy', 'true');
        fetch(FORMURL,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',     
                'X-WP-Nonce': REST_NONCE,           
             },
            body: formData
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if(data.success){
                formResponse.innerHTML = FORMMESSAGE;
                formResponse.classList.add('success');
                submitButton.disabled = false;
                form.reset();
                form.classList.remove('loading');
                form.setAttribute('aria-busy', 'false');
            }else{
                formResponse.innerHTML = data.error;
                submitButton.disabled = false;
                formResponse.classList.add('error');
                form.classList.remove('loading');
                form.setAttribute('aria-busy', 'false');
            }
        })
        .catch((error) => {
            console.log(error);
            submitButton.disabled = false;
            formResponse.innerHTML = 'Something went wrong. Please try again later.';
            formResponse.classList.add('error');
        })
    });
}

export default formHandler;