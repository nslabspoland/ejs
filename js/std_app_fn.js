import { currentDate } from "../config/dev-env";

function deleteElement(element) {
  document.body.classList.remove(element);
}

function reformatDate() {
  let formattedDate = currentDate.replace("/", "-");
  return formattedDate;
}

export { deleteElement, reformatDate };
