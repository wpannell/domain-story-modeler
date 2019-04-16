'use strict';

import { initializeAllIcons, getAllIconDictioary, deleteFromSelectedWorkObjectDictionary, deleteFromSelectedActorDictionary, getIconSource, addToSelectedActors, addToSelectedWorkObjects, selectedCitionariesAreNotEmpty } from './dictionaries';
import { isInActorIconDictionary } from '../../language/actorIconDictionary';
import { isInWorkObjectIconDictionary } from '../../language/workObjectIconDictionary';
import { ACTOR, WORKOBJECT } from '../../language/elementTypes';

var htmlList = document.getElementById('allIconsList');
var selectedActorsList = document.getElementById('selectedActorsList');
var selectedWorkObjectList = document. getElementById('selectedWorkObjectsList');

const iconSize = 15;

export function createListOfAllIcons() {

  initializeAllIcons();

  var allIconDictionary = getAllIconDictioary();

  var allIconNames = allIconDictionary.keysArray();
  allIconNames.forEach(name => {
    var listElement = createListElement(name);
    htmlList.appendChild(listElement);
  });
}

export function createListElement(name) {
  var iconSRC = getIconSource(name);

  var listElement = document.createElement('li');
  var nameElement = document.createElement('text');
  var imageElement = document.createElement('img');
  var radioElement = document.createElement('div');

  var inputRadioNone = document.createElement('input');
  var inputRadioActor = document.createElement('input');
  var inputRadioWorkObject = document.createElement('input');

  var unselectedText = document.createElement('text');
  var actorText = document.createElement('text');
  var workObjectText = document.createElement('text');

  unselectedText.innerHTML = ' ';
  actorText.innerHTML='Actor';
  workObjectText.innerHTML='WorkObject';

  radioElement.style.display = 'inline';

  inputRadioNone.setAttribute('type', 'radio');
  inputRadioNone.setAttribute('name', name);
  inputRadioNone.setAttribute('value', 'none');

  inputRadioActor.setAttribute('type', 'radio');
  inputRadioActor.setAttribute('name', name);
  inputRadioActor.setAttribute('value', 'actor');

  inputRadioWorkObject.setAttribute('type', 'radio');
  inputRadioWorkObject.setAttribute('name', name);
  inputRadioWorkObject.setAttribute('value', 'workObject');

  if (isInActorIconDictionary(ACTOR +name)) {
    inputRadioActor.checked = true;
    createListElementInSeletionList(name, getIconSource(name), selectedActorsList);
    addToSelectedActors(name, getIconSource(name));
  } else if (isInWorkObjectIconDictionary(WORKOBJECT + name)) {
    inputRadioWorkObject.checked = true;
    createListElementInSeletionList(name, getIconSource(name), selectedWorkObjectList);
    addToSelectedWorkObjects(name, getIconSource(name));
  }
  else {
    inputRadioNone.checked = true;
  }

  imageElement.width = iconSize;
  imageElement.heigth = iconSize;
  if (iconSRC.startsWith('data')) {
    imageElement.src= iconSRC;
  } else {
    imageElement.src= ('data:image/svg+xml,' + iconSRC);
  }

  nameElement.innerHTML = name;

  radioElement.appendChild(inputRadioNone);
  radioElement.appendChild(unselectedText);
  radioElement.appendChild(inputRadioActor);
  radioElement.appendChild(actorText);
  radioElement.appendChild(inputRadioWorkObject);
  radioElement.appendChild(workObjectText);

  radioElement.addEventListener('click', function() {
    var children = radioElement.children;
    var actorButton = children[2];
    var workObjectButton = children[4];

    var currentSelectionName = actorButton.name;
    var addToActors = false;
    var addToWorkObjects = false;
    if (actorButton.checked) {
      addToActors = true;
    }
    else if (workObjectButton.checked) {
      addToWorkObjects = true;
    }
    updateSelectedWorkObjectsAndActors(currentSelectionName, addToActors, addToWorkObjects);
  });

  listElement.appendChild(imageElement);
  listElement.appendChild(nameElement);
  listElement.appendChild(radioElement);

  return listElement;
}

export function createListElementInSeletionList(name, src, list) {
  var listElement = document.createElement('li');
  var nameElement = document.createElement('text');
  var imageElement = document.createElement('img');

  imageElement.width = iconSize;
  imageElement.heigth = iconSize;
  if (src.startsWith('data')) {
    imageElement.src= src;
  } else {
    imageElement.src= ('data:image/svg+xml,' + src);
  }

  nameElement.innerHTML = name;

  listElement.appendChild(imageElement);
  listElement.appendChild(nameElement);

  list.appendChild(listElement);
}

function removeListEntry(name, list) {
  var children = list.children;
  var wantedChild;
  for (var i=0; i<children.length; i++) {
    var child = children[i];
    var innerText = child.innerText;
    if (innerText.includes(name)) {
      wantedChild = child;
    }
  }
  if (wantedChild) {
    list.removeChild(wantedChild);
  }
}

function updateSelectedWorkObjectsAndActors(currentSelectionName, addToActors, addToWorkObjects) {

  deleteFromSelectedWorkObjectDictionary(currentSelectionName);
  if (deleteFromSelectedActorDictionary(currentSelectionName)) {
    removeListEntry(currentSelectionName, selectedActorsList);
  } else {
    removeListEntry(currentSelectionName, selectedWorkObjectList);
  }

  var iconSRC = getIconSource(currentSelectionName);
  if (addToActors) {
    addToSelectedActors(currentSelectionName, iconSRC);
    createListElementInSeletionList(currentSelectionName, iconSRC, selectedActorsList);
  }
  else if (addToWorkObjects) {
    addToSelectedWorkObjects(currentSelectionName, iconSRC);
    createListElementInSeletionList(currentSelectionName, iconSRC, selectedWorkObjectList);
  }

  var exportConfigurationButton = document.getElementById('exportConfigurationButton');
  var customIconConfigSaveButton = document.getElementById('customIconConfigSaveButton');

  if (selectedCitionariesAreNotEmpty()) {
    exportConfigurationButton.disabled = false;
    exportConfigurationButton.style.opacity = 1;

    customIconConfigSaveButton.disabled = false;
    customIconConfigSaveButton.style.opacity = 1;
  } else {
    exportConfigurationButton.disabled = true;
    exportConfigurationButton.style.opacity = 0.5;

    customIconConfigSaveButton.disabled = true;
    customIconConfigSaveButton.style.opacity = 0.5;
  }
}