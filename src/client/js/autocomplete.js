/** Create suggested coutry items from the input and appends them to the list container.
 * @param {HTMLElement} parent - The list container element.
 * @param {Array} list - List of all the countries.
 * @param {String} value - The value of the input.
 */

const generateAutocompleteItems = (parent, value) => {
  if (!parent || !value) return;
  // This initialize a document fragment that will serve as container
  const fragment = new DocumentFragment();
  // The API call
  // FIXME: Exposed username
  const options = 'maxRows=5&fuzzy=1&username=anes';
  fetch(`http://api.geonames.org/searchJSON?q=&name_startsWith=${value}&${options}`)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      Object.values(data)[1].forEach((obj) => {
        // eslint-disable-next-line no-use-before-define
        emptyListContainer();
        const listItem = document.createElement('div');
        // TODO: for fuzzy search, add a fucntion that bolds the first coresponding letter.
        // eg: input = 'ben aous' output='<strong>ben a</strong>+ous'
        // This checks if country starts with same letters as the value.
        if (obj.name.substr(0, value.length).toLowerCase() === value.toLowerCase()) {
          // If same initials, print the initials in bold + the rest of the string.
          listItem.innerHTML = `<strong>${obj.name.substr(0, value.length)}</strong>\
${obj.name.substr(value.length)}, ${obj.countryName}`;
        } else {
          // Else, print the string.
          listItem.innerHTML = `${obj.name.substr(0, value.length)}${obj.name.substr(value.length)}, ${obj.countryName}`;
        }
        // This sets a data attr that will hold the value of the item.
        // Use split(',')[0] to get city's name.
        listItem.setAttribute('data-value', `${obj.name}, ${obj.countryName}`);
        // This gives the item a class.
        listItem.setAttribute('class', 'autocomplete-list-item');
        fragment.appendChild(listItem);
      });
      parent.appendChild(fragment);
    });
};

const emptyListContainer = () => {
  const element = document.querySelector('.autocomplete-items-list');
  if (!element) return;
  element.childNodes.forEach((child) => {
    element.removeChild(child);
  });
};

const removeListContainer = () => {
  const element = document.querySelector('.autocomplete-items-list');
  element.remove();
};

const itemListClickHandler = (event) => {
  if (event.target.classList.contains('autocomplete-list-item')) {
    document.querySelector('#country-input').value = event.target.dataset.value;
    removeListContainer();
  }
};

/**
 * Main handler of the autocomplete feature.
 * @param {HTMLElement} inputElm - Form's input element.
 * @see {@link https://www.w3schools.com/howto/howto_js_autocomplete.asp}.
 */
const autocomplete = (inputElm) => {
  let listContainer;
  // This will holds the parent node.
  const parent = inputElm.parentNode;
  //  This holds the value from the input.
  const { value } = inputElm;
  // This will check the DOM for existing listContainer.
  const hasListContainer = !!document.querySelector('.autocomplete-items-list');
  // If no value, empty list and return false.
  if (!value && hasListContainer) {
    emptyListContainer();
    removeListContainer();
    return;
  }
  if (hasListContainer) {
    listContainer = document.querySelector('.autocomplete-items-list');
  } else {
    /**
         * Else if listContainer doesn't exist, create it and attach an event
         * listener to it.
         * The event(click) listener is attached once we create listContainer.
         */
    // This creates a container to hold the list of suggested items.
    listContainer = document.createElement('div');
    // This gives listContainer a class.
    listContainer.setAttribute('class', 'autocomplete-items-list');
    // This appends listContainer to the input's parent.
    parent.appendChild(listContainer);
    // This adds click event to listen on the list items.
    listContainer.addEventListener('click', itemListClickHandler);
  }
  // This generates items for the listContainer.
  generateAutocompleteItems(listContainer, value);
};

export default autocomplete;
