'use strict';

var REGEXP_SUBSTR = />([a-zа-я0-9]+)</ig;
var REGEXP_ENDSUBSTR = /[a-zа-я0-9]+$/ig;
var formulas = window.formulas;

var resultElements = [
    {
        name: 'firewater',
        path: 'src/img/redwater.jpg'
    },
    {
        name: 'dust',
        path: 'src/img/dust.png'
    },
    {
        name: 'lava',
        path: 'src/img/lava.png'
    },
    {
        name: 'steam',
        path: 'src/img/steam.png'
    },
    {
        name: 'swamp',
        path: 'src/img/swamp.png'
    },
    {
        name: 'ash',
        path: 'src/img/ash.png'
    },
    {
        name: 'life',
        path: 'src/img/life.png'
    },
    {
        name: 'plasma',
        path: 'src/img/plasma.png'
    },
    {
        name: 'stone',
        path: 'src/img/stone.png'
    },
    {
        name: 'storm',
        path: 'src/img/storm.svg'
    },
    {
        name: 'bakteria',
        path: 'src/img/bakteria.png'
    },
    {
        name: 'egg',
        path: 'src/img/egg.png'
    },
    {
        name: 'ghost',
        path: 'src/img/ghost.png'
    },
    {
        name: 'metall',
        path: 'src/img/metall.png'
    },
    {
        name: 'sand',
        path: 'src/img/sand.png'
    },
    {
        name: 'grass',
        path: 'src/img/grass.png'
    },
    {
        name: 'bird',
        path: 'src/img/bird.png'
    },
    {
        name: 'cat',
        path: 'src/img/cat.png'
    }
];
var currentSet = [];
var currentStr = '';
var isSetExists = null;
var selectedElement = null;
var resetBtn = document.getElementById('resetElements');
var inputField = document.getElementById('ingredients_field');
var ingredientsBox = document.querySelector('.ingredients');
var receivingArea = document.querySelector('.field');
var resultArea = document.querySelector('.field__result');
var elementTemplate = document.querySelector('.elementTemplate');
var finalElement = null;

formulas.forEach((set) => {
    set.elements.sort();
})

resetBtn.addEventListener('click', (event) => {
    if (!currentSet) {
        return;
    }

    finalElement = null;
    var resultSet = [].slice.call(resultArea.children, 0);
    resultSet.forEach((child) => {
        resultArea.removeChild(child);
    });

    currentSet.forEach((itemName) => {
        var itemInBox = [].find.call(ingredientsBox.children, (child) => {
            return child.dataset.element === itemName;
        });

        itemInBox.classList.remove('hideElement');
    })

    currentSet = [];

}, false);

inputField.addEventListener('input', (event) => {
    var ingredients = ingredientsBox.querySelectorAll('.ingredients__element');
    [].forEach.call(ingredients, function (ingredient) {
        selectLetters(event, ingredient);
    });
}, false);

ingredientsBox.addEventListener('click', selectHandler, false);
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mousemove', onMoveMouse, false);
document.addEventListener('mouseup', onMouseUp, false);

function onMoveMouse(event) {
    if (!selectedElement) {
        return;
    }

    selectedElement.style.width = '80px';
    selectedElement.style.height = '80px';
    selectedElement.style.zIndex = 2000;
    selectedElement.parentElement.style.position = 'absolute';
    selectedElement.parentElement.style.left = event.pageX - selectedElement.parentElement.offsetWidth / 2 + 'px';
    selectedElement.parentElement.style.top = event.pageY - selectedElement.parentElement.offsetHeight / 2 + 'px';
}

function onMouseUp(event) {
    if (!selectedElement) {
        return;
    }

    if (selectedElement.parentElement.style.left.slice(0, -2) > receivingArea.offsetLeft) {
        resetPositionProperties(selectedElement);
        setElementInArea(selectedElement);
    }

    resetPositionProperties(selectedElement);
    selectedElement = null;
}

function onMouseDown(eventItem) {
    selectedElement = eventItem.target.closest('.ingredients__element__img');
    if (event.which !== 1 || !selectedElement) {
        return;
    }

    selectedElement.ondragstart = () => {
        return false;
    }
}

function selectHandler(event) {
    if (event.target.className !== 'ingredients__element__img') {
        return;
    }

    setElementInArea(event.target);
    selectedElement = null;
}

function removeElemHandler(event) {
    [].forEach.call([].slice.call(ingredientsBox.children, 1), (child) => {
        if (child.dataset.element !== event.target.dataset.element) {
            return;
        }

        deleteElemFromSet(event);
        var parentBlock = event.target.parentElement;
        var plus = parentBlock.previousSibling ||
            parentBlock.nextSibling;
        if (plus) {
            parentBlock.parentElement.removeChild(plus);
        }
        parentBlock.parentElement.removeChild(parentBlock);
        var childLabel = child.querySelector('.ingredients__element__label');
        childLabel.innerHTML = child.dataset.element;
        selectLetters(event, child);
        child.classList.remove('hideElement');

        isSetExists = formulas.find(findSuitableSet);
        if (!isSetExists && finalElement) {
            resultArea.removeChild(finalElement);
            finalElement = null;
            return;
        } else if(isSetExists) {
            appendFinalElement();
        }
    })

    event.stopPropagation();
}

function setElementInArea(element) {
    var parent = element.parentElement;
    parent.classList.add('hideElement');
    currentSet.push(element.dataset.element);
    currentSet.sort();
    isSetExists = formulas.find(findSuitableSet);

    var addedIngredient = createIngredient(element);
    addedIngredient.querySelector('.ingredient').addEventListener('click', removeElemHandler, false);
    finalElement
        ?   resultArea.insertBefore(addedIngredient, finalElement)
        :   resultArea.appendChild(addedIngredient);

    if (!isSetExists) {
        if (finalElement) {
            resultArea.removeChild(finalElement);
            finalElement = null;
        }
    } else {
        appendFinalElement();
    }
}

function resetPositionProperties(element) {
    element.parentElement.style.position = 'relative';
    element.parentElement.style.left = 0;
    element.parentElement.style.top = 0;
    element.style.width = '60px';
    element.style.height = '60px';
}

function createIngredient(event) {
    var newIngredient = document.createDocumentFragment();
    var ingredient = document.createElement('div');
    var genImg = document.createElement('img');
    var genLabel = document.createElement('p');
    if (resultArea.innerHTML) {
        var plus = document.createElement('p');
        plus.classList.add('ingredient__plus');
        plus.innerHTML = '✚';
        plus.dataset.element = 'plus';
        newIngredient.appendChild(plus);
    }
    ingredient.classList.add('ingredient');
    genImg.dataset.element = event.dataset.element;
    genImg.classList.add('ingredient__img');
    genImg.src = event.src;
    genLabel.classList.add('ingredient__label');
    genLabel.innerHTML = event.dataset.element;
    ingredient.appendChild(genImg);
    ingredient.appendChild(genLabel);
    newIngredient.appendChild(ingredient);

    return newIngredient;
}

function createFinalElement(set) {
    var generatedElement = document.createElement('div');
    var arrowDown = document.createElement('p');
    var genImg = document.createElement('img');
    var genLabel = document.createElement('p');
    generatedElement.classList.add('finalElement');
    arrowDown.classList.add('finalElement__arrowDown');
    arrowDown.innerHTML = '↓';
    genImg.classList.add('finalElement__img');
    genImg.setAttribute('src', set.path);
    genLabel.classList.add('finalElement__label');
    genLabel.innerHTML = set.name;
    generatedElement.appendChild(arrowDown);
    generatedElement.appendChild(genImg);
    generatedElement.appendChild(genLabel);
    return generatedElement;
}

function selectLetters(event, ingredient) {
    var label = ingredient.querySelector('.ingredients__element__label');
    var currentStr = inputField.value;
    var regExp_subStr = new RegExp('^(' + currentStr + ')', 'ig');
    if (!ingredient.dataset.element.startsWith(currentStr)) {
        ingredient.classList.add('hideElement');
        return;
    }

    if (isElementInResultArea(ingredient.dataset.element)) {
        return;
    }

    ingredient.classList.remove('hideElement');
    label.innerHTML = currentStr
        ? label.textContent.replace(regExp_subStr, '<font color="#787777">$1</font>')
        : label.textContent;
}

function appendFinalElement() {
    var foundedSet = resultElements.find((element) => {
        return isSetExists.result === element.name;
    })

    var resultElement = createFinalElement(foundedSet);
    finalElement
        ?   resultArea.replaceChild(resultElement, finalElement)
        :   resultArea.appendChild(resultElement);

    finalElement = resultArea.querySelector('.finalElement');
}

function findSuitableSet(set) {
    return set.elements.every((elem, i) => {
        return currentSet[i] === elem;
    }) && set.elements.length === currentSet.length;
}

function deleteElemFromSet(event) {
    currentSet.splice(currentSet.indexOf(event.target.dataset.element), 1);
}

function isElementInResultArea(label) {
    return [].find.call(resultArea.children, (ingredient) => {
        var ingredientLabel = ingredient.querySelector('.ingredient__label');

        return ingredientLabel
            ? ingredientLabel.textContent === label
            : false;
    });
}
