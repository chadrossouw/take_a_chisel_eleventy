const modalHandlers = () => {
    class Modal {
        constructor(el) {
        this.el = el;
        console.log(this.el);
        this.el.active = false;
        this.modal = document.getElementById(this.el.dataset.modal_id);
        this.close = this.modal.querySelector(".close");
        [this.firstFocusable, this.lastFocusable] =
            this.getFirstAndLastFocusable();
        this.el.addEventListener("click", (e) => this.openModal(e));
        this.close.addEventListener("click", (e) => this.closeModal(e));
        }

        handleEvent(e) {
        switch (e.type) { 
            case "click":
                if (e.target === this.close) {
                    e.preventDefault();
                    this.closeModal();
                } else if (e.target === this.el) {
                    e.preventDefault();
                    this.openModal(e);
                }
            break;
            case "keydown":
                this.tabTrap(e);
            break;
            case "transitionend":
                this.handleTransitionEnd();
        }
        }

        openModal(e) {
            this.el.active = true;
            e.preventDefault();
            this.modal.style.display = "block";
            this.modal.classList.add("open");
            this.modal.classList.remove("close");
            document.documentElement.classList.add("scrolly_lock");
            this.firstFocusable.focus();
            this.modal.addEventListener("keydown", this);
            const event = new CustomEvent("modal_opened", {
                detail: {
                modal: this.modal,
                trigger: e.currentTarget,
                thisModal: this,
                },
            });
            window.dispatchEvent(event);
        }

        closeModal(e=null) {
            if(e){
                e.preventDefault();
            }
            if(!this.el.active) return;
            this.el.active = false;
            this.modal.classList.add("close");
            this.modal.classList.remove("open");
            document.documentElement.classList.remove("scrolly_lock");
            console.log(this.el);
            this.el.focus();
            this.modal.addEventListener(
                "transitionend",
                this
            );
            this.modal.removeEventListener("keydown", this);
        }

        handleTransitionEnd() {
            if (this.modal.classList.contains("close")) {
                this.modal.style.display = "none";
                this.modal.removeEventListener("transitionend", this);
            }
        }
        getFirstAndLastFocusable() {
            let focusable = [];
            let allDescendants = this.modal.querySelectorAll("*");
            allDescendants.forEach((child) => {
                if (this.isFocusable(child)) {
                focusable.push(child);
                }
            });
            return [focusable[0], focusable[focusable.length - 1]];
        }

        isFocusable(element) {
            if (element.tabIndex < 0) {
                return false;
            }

            if (element.disabled) {
                return false;
            }

            switch (element.nodeName) {
                case "A":
                return !!element.href && element.rel != "ignore";
                case "INPUT":
                return element.type != "hidden";
                case "BUTTON":
                case "SELECT":
                case "TEXTAREA":
                return true;
                default:
                return false;
            }
        }

        tabTrap(e) {
            if (e.code != "Tab") return;
            if (e.target == this.lastFocusable && !e.shiftKey) {
                console.log("last and no shift");
                e.preventDefault();
                this.firstFocusable.focus();
            } else if (e.target == this.firstFocusable && e.shiftKey) {
                console.log("first and shift");
                e.preventDefault();
                this.lastFocusable.focus();
            }
        }
    }
    const modals = document.querySelectorAll(".toggle_modal");
    modals.forEach((modal) => {
        new Modal(modal);
    });
}

export default modalHandlers;