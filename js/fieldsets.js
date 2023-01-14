function preventClicksOnDisabledElements() {
	let target = Event && Event.AT_TARGET ? Event.AT_TARGET : document;
	let fieldsets = target.querySelectorAll('fs');
	for (let i = 0; i < fieldsets.length; i++) {
		let self = fieldsets[i];
		if (self.getAttribute('disabled') == true) {
			self.style.pointerEvents = 'none';
			let btns = document.querySelectorAll('button');
			for (let index = 0; index < btns.length; index++) {
				btns[index].classList.add('disabled');
			}
		}
	}
}

function toTop() {
	let backToTop = document.createElement('button');
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		backToTop.classList.add('visible');
	}
}

window.onscroll = function () {
	toTop();
}

toTop.addEventListener('click', function (Event) {
	window.scrollTo(0, 0);
})

// Add fieldset class if not existent in definition
if (!document.head.querySelector('fieldset')) {
	document.classList.add('fieldset');
}