const accordion = () => {
    class Accordion {
        constructor(el) {
            // Store the <details> element
            this.el = el;
            // Store the <summary> element
            if(this.el.open){
                this.el.classList.add("open");
            }
            this.summary = el.querySelector("summary");

            // Store the <div class="content"> element
            this.content = el.querySelector(".content");
            if(!this.content){
                this.content = el.querySelector(".panel");
            }

            // Store the animation object (so we can cancel it if needed)
            this.animation = null;
            this.contentAnimation = null;
            // Store if the element is closing
            this.isClosing = false;
            // Store if the element is expanding
            this.isExpanding = false;
            // Detect user clicks on the summary element
            this.summary.addEventListener("click", (e) => this.onClick(e));
        }

        onClick(e) {
            // Stop default behaviour from the browser
            e.preventDefault();
            // Add an overflow on the <details> to avoid content overflowing
            this.el.style.overflow = "hidden";
            // Check if the element is being closed or is already closed
            this.el.classList.toggle("open");
            if (this.isClosing || !this.el.open) {
                this.open();
                // Check if the element is being openned or is already open
            } else if (this.isExpanding || this.el.open) {
                this.shrink();
            }
        }

        shrink() {
            // Set the element as "being closed"
            this.isClosing = true;

            // Store the current height of the element
            const startHeight = `${this.getHeight(this.el)}px`;
            // Calculate the height of the summary and add padding from the details
            const endHeight = `${this.getHeight(this.summary) + this.getRemInPx(2)}px`;
            console.log(startHeight, endHeight);

            // If there is already an animation running
            if (this.animation) {
                // Cancel the current animation
                this.animation.cancel();
                this.contentAnimation.cancel();
            }

            // Start a WAAPI animation
            this.animation = this.el.animate(
                {
                    // Set the keyframes from the startHeight to endHeight
                    height: [startHeight, endHeight],
                },
                {
                    duration: 400,
                    easing: "ease",
                }
            );

            this.contentAnimation = this.content.animate(
                {
                    // Set the keyframes from the startHeight to endHeight
                    filter: ["opacity(1)", "opacity(0)"],
                },
                {
                    duration: 400,
                    easing: "ease",
                }
            ); 

            // When the animation is complete, call onAnimationFinish()
            this.animation.onfinish = () => this.onAnimationFinish(false);
            // If the animation is cancelled, isClosing variable is set to false
            this.animation.oncancel = () => (this.isClosing = false);
        }

        open() {
            // Apply a fixed height on the element
            this.el.style.height = `${this.getHeight(this.el)}px`;
            // Force the [open] attribute on the details element
            this.el.open = true;
            // Wait for the next frame to call the expand function
            window.requestAnimationFrame(() => this.expand());
        }

        expand() {
            // Set the element as "being expanding"
            this.isExpanding = true;
            // Get the current fixed height of the element
            const startHeight = `${this.getHeight(this.el)}px`;
            // Calculate the open height of the element (summary height + content height)
            const endHeight = `${
                this.getHeight(this.summary) + this.getHeight(this.content) + this.getRemInPx(2)
            }px`;
            console.log(startHeight, endHeight);
            // If there is already an animation running
            if (this.animation) {
                // Cancel the current animation
                this.animation.cancel();
                this.contentAnimation.cancel();
            }

            // Start a WAAPI animation
            this.animation = this.el.animate(
                {
                    // Set the keyframes from the startHeight to endHeight
                    height: [startHeight, endHeight],
                },
                {
                    duration: 600,
                    easing: "ease",
                }
            );

            this.contentAnimation = this.content.animate(
                {
                    // Set the keyframes from the startHeight to endHeight
                    filter: ["opacity(0)", "opacity(1)"],
                },
                {
                    duration: 400,
                    easing: "ease",
                }
            ); 
            
            // When the animation is complete, call onAnimationFinish()
            this.animation.onfinish = () => this.onAnimationFinish(true);
            // If the animation is cancelled, isExpanding variable is set to false
            this.animation.oncancel = () => (this.isExpanding = false);
        }

        onAnimationFinish(open) {
            // Set the open attribute based on the parameter
            this.el.open = open;
            // Clear the stored animation
            this.animation = null;
            this.contentAnimation = null;
            // Reset isClosing & isExpanding
            this.isClosing = false;
            this.isExpanding = false;
            // Remove the overflow hidden and the fixed height
            this.el.style.height = this.el.style.overflow = "";
        }

        getHeight(el){
            // Get the height of the element
            let offSetHeight = el.getBoundingClientRect().height;
            let computedStyle = window.getComputedStyle(el);
            let marginHeights =  ["top", "bottom"]
            .map(function(side) {
            return parseInt(computedStyle['margin-' + side], 10)
            })
            .reduce(function(total, side) {
            return total + side
            }, offSetHeight);
            return marginHeights;
        }
        getRemInPx(rem){
            return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
        }
    }
    const prefersReduced =  window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||window.matchMedia("(prefers-reduced-motion: reduce)").matches ==true;
    if(!prefersReduced){
        document.querySelectorAll("details").forEach((el) => {
            new Accordion(el);
        });
    }
}

export default accordion;