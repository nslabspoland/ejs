function deleteElement(element) {
	// Do not display element
	let el = document.getElementById(element).style.display = "none";
}

export {deleteElement}