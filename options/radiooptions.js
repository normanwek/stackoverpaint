function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    color: document.querySelector('input[name=theme]:checked').value
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
	var chosenColor = result.color || "purple";
	document.getElementById(chosenColor).checked = true;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("color");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);