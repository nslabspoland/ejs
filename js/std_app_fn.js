function deleteElement(element) {
	// Do not display element
	// @todo #5 
	let el = document.getElementById(element).style.display = "none";
}

export {deleteElement}