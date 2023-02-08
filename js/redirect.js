export const homeUrl = document.URL;

function toHome(homeUrl) {
  window.location.replace(homeUrl);
}

export {toHome};