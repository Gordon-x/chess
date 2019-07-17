(function (window, document) {
    function util(selector, one = true) {
        function Go() {
            let elem;
            let selectOne = function () {
                return document.querySelector(selector);
            };

            let selectAll = function () {
                return document.querySelectorAll(selector);
            };

            if (one) {
                elem = selectOne();
            } else {
                elem = selectAll();
            }

            let classList = elem.classList;

            this.html = function (content) {
                elem.innerHTML = content;
            };

            this.addClass = function (className) {
                classList.add(className);
            };

            this.removeClass = function (className) {
                classList.remove(className);
            };

            this.style = function (styles) {
                for (let s in styles) {
                    if (styles.hasOwnProperty(s) && elem.style.hasOwnProperty(s)) {
                        elem.style[s] = styles[s];
                    }
                }
            };

            this.show = function (hard = true) {
                if (hard) {
                    this.style({display: 'block'});
                } else {
                    this.style({visibility: 'visible'})
                }
            };

            this.hide = function (hard = true) {
                if (hard) {
                    this.style({display: 'none'});
                } else {
                    this.style({visibility: 'hidden'})
                }
            };

            this.elem = function () {
                return elem;
            }
        }

        return new Go();
    }

    window.G = util;
})(window, document);