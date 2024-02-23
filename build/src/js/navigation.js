/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */

const dynamicVH = () =>{
	setDocHeight();
	window.addEventListener("resize", setDocHeight);
	window.addEventListener("orientationchange", setDocHeight);

	function setDocHeight() {
		console.log('set doc height');
		document.documentElement.style.setProperty(
			
			"--vh",
			`${window.innerHeight / 100}px`
		);
	}
}
const navigation = () => {
	

	const siteNavigation = document.getElementById("site-navigation");
	const buttonHamburger = document.getElementById("hamburger");

	class NavMenu {

		constructor(menu, button) {
			this.menu = menu;
			this.button = button;
			this.firstFocusable = button;
			this.lastFocusable = this.getLastFocusable();
			this.button.addEventListener("click", this.toggleMenu.bind(this));
			this.menuIsOpen = false;
			this.transitionEndIsAdded = false;
			this.prefersReduced =  window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||window.matchMedia("(prefers-reduced-motion: reduce)").matches ==true;
		}

		toggleMenu() {
			if (this.menuIsOpen) {
				this.closeMenu();
			} else {
				this.openMenu();
			}
		}

		openMenu(){
			this.menuIsOpen = true;
			this.menu.style.visibility = "visible";
			this.menu.classList.add("toggled");
			this.button.classList.add("is-active");
			this.button.setAttribute("aria-expanded", "true");
			this.firstFocusable.focus();
			document.documentElement.classList.add("scroll-lock");
			this.menu.addEventListener("focusout", this.focusHandler.bind(this));
			this.menu.addEventListener("keydown", this.escHandler.bind(this));
		}

		closeMenu(){
			this.menuIsOpen = false;
			this.menu.classList.remove("toggled");
			this.button.classList.remove("is-active");
			this.button.setAttribute("aria-expanded", "false");
			this.button.focus();
			document.documentElement.classList.remove("scroll-lock");
			this.menu.removeEventListener("focusout", this.focusHandler.bind(this));
			this.menu.removeEventListener("keydown", this.escHandler.bind(this));
			if(this.prefersReduced){
				this.hideVisibilityOnEnd();
				return;
			};
			if(!this.transitionEndIsAdded){
				this.menu.addEventListener("transitionend", this.hideVisibilityOnEnd.bind(this));
			}

		}
		
		hideVisibilityOnEnd(){
			if(this.menuIsOpen) return;
			this.menu.style.visibility = "hidden";
		}

		closeMenuClean(){
			this.menu.classList.remove("toggled");
			this.button.classList.remove("is-active");
			this.button.setAttribute("aria-expanded", "false");
			document.documentElement.classList.remove("scroll-lock");
			if(this.prefersReduced){
				this.hideVisibilityOnEnd();
				return;
			};
		}

		getLastFocusable() {
			let focusable = [];
			let allDescendants = this.menu.querySelectorAll("*");
			allDescendants.forEach((child) => {
				if (this.isFocusable(child)) {
					focusable.push(child);
				}
			});
			return focusable[focusable.length - 1];
		}

		isFocusable(element) {
			if (element.tabIndex < 0) {
				return false;
			}

			if (element.disabled) {
				return false;
			}
			if(!element.offsetParent){
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

		focusHandler(e) {
			if(e.target == this.lastFocusable && !this.menu.contains(e.relatedTarget)){
				e.preventDefault();
				this.firstFocusable.focus();
			}
		}

		escHandler(e){
			if(e.key == "Escape"){
				this.closeMenu();
			}
		}
	
	}

	let navMenu = new NavMenu(siteNavigation, buttonHamburger);
	let navHeaderJumpLinks = document.querySelectorAll(".header-jump-link,#masthead .bsl a, #site-registration a");
	if(navHeaderJumpLinks.length){
		navHeaderJumpLinks.forEach(link=>{
			link.addEventListener('click',navMenu.closeMenuClean.bind(navMenu));
		});
	}

	/* if (window.innerWidth > 700) {
		if (document.body.scrollHeight > 1000) {
			const btt = document.querySelector(".back-to-top");
			btt.classList.add("active");
		}
	}
 */
	

	const mobileSubNav = document.querySelector("#nav_select");
	if(mobileSubNav){
		mobileSubNav.addEventListener("change", (e) => {
			if(e.target.value){
			 window.location.href = e.target.value;
			}
		});
	}
};

export {dynamicVH,navigation};
