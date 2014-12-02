// Uses local storage to add a note
function storeToLocalStorage(note){
    localStorage.setItem(note.storageKey, JSON.stringify(note));
    PinPoint.NoteController.storeNote(note);
}

// Array of notes in string format
var notes = [];

// Array of note objects to pass to controller
var noteObjects = [];

// Parses all strigified objects into JSON objects
function parseLocalStorage(){
    for (i in notes) {
        var key = notes[i]
        var retrievedObject = localStorage.getItem(key);
        noteObjects.push(JSON.parse(retrievedObject));
    }
}

// Searches the keys in LocalStorage and returns an array of matches
function searchLocalStorage(url){
    var key = url + "/";
    for (i in localStorage) {
        if (i.match(/^\w+\:\/\/www.youtube.com\/watch\?v=.+\//) == key) {
            notes.push(i);
        }
    }
    parseLocalStorage();
}

var createButton = document.getElementById("create");
var form = document.getElementById("add-note");
createButton.addEventListener('click', function(){
  createButton.style.display = "none";
  form.style.display = "inline";
  chrome.runtime.getBackgroundPage(function(eventPage) {
    eventPage.getPageDetails(PinPoint.NoteController.getTime);
    });
});


// Event listener for the create note button
var saveButton = document.getElementById("save");
saveButton.addEventListener('click', function(){
  saveButton.style.display = "none";
  note = new PinPoint.Note();
  PinPoint.NoteController.run(note);
});

window.addEventListener('load', function() {

  PinPoint.NoteController.getUrl();
  searchLocalStorage(localStorage["url"]);
  controller = new PinPoint.NoteController(noteObjects);
  controller.defineView(new PinPoint.View());
  controller.redraw();

  var links = document.getElementsByClassName("link");
  for(var i=0;i< links.length; i++) {
    links[i].addEventListener("click", tabUpdate(i));
   };

  function tabUpdate(i) {
      return function(){
        chrome.tabs.update(null, {url: links[i].href});
      };
  };

  chrome.browserAction.setBadgeText({text: noteObjects.length.toString()});
  //This gives us a nice light-ish purple
  chrome.browserAction.setBadgeBackgroundColor({color:[140, 5, 220, 170]});
  //COLOR OPTION 2: This gives us a nice golden orange color
  // chrome.browserAction.setBadgeBackgroundColor({color:[235, 105, 5, 220]});
});


