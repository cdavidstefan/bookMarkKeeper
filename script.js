const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');



let bookmarks = [];

// Show Modal, Focus on Input

function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();

};


// function closeModal() {
//     modal.classList.remove('show-modal');
// };


// Modal Event Listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));



// Validate Form
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit value for both fields');
        return false;
    };
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web adress.');
        return false;
    };
    // Valid
    return true;
};

// Build Bookmarks DOM
function buildBookmarks() {
    // Remove all bookmark elements :::
    bookmarksContainer.textContent = '';
    // Build items ---- forEach(bookmark) - creates a local variable to represent each object in the array
    bookmarks.forEach((bookmark) => {

        // destructuring:
        const { name, url } = bookmark;

        // Creating HTML elements: starting with Item
        const item = document.createElement('div');
        item.classList.add('item');

        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);

        // Favicon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');

        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        // Appent to bookmarks container - building has to happen in a specific order
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
};


// Fetch Bookmarks from localStorage
function fetchBookmarks() {
    // Get bookmarks from localStorage if available
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks array in localStorage
        bookmarks = [
            {
                name: 'Default Google Bookmark',
                url: 'https://google.com',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    };
    buildBookmarks();
};


// Delete Bookmark
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            // i - index; 1 - delete one item
            bookmarks.splice(i, 1);
        };
    });
    // Update bookmarks arrya in localStorage, re-populate the DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
};


// Handle data form Form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    // includes() - method that can be used on any string 
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
        urlValue = `https://${urlValue}`;
    };

    if (!validate(nameValue, urlValue)) {
        return false;
    };
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
};

// by defaul a form it's something that is usually submitted to a web server so it usually makes a network request. e.preventDefault()


// Bookmark Store event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, fetch bookmarks
fetchBookmarks();