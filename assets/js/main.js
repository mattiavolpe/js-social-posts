/*
Descrizione
Ricreiamo un feed social aggiungendo al layout di base fornito, il nostro script JS in cui:

Milestone 1
Creiamo il nostro array di oggetti che rappresentano ciascun post.
Ogni post dovrà avere le informazioni necessarie per stampare la relativa card:
id del post, numero progressivo da 1 a n
nome autore,
foto autore,
data in formato americano (mm-gg-yyyy),
testo del post,
immagine (non tutti i post devono avere una immagine),
numero di likes.
Non è necessario creare date casuali Per le immagini va bene utilizzare qualsiasi servizio di placeholder ad es. Unsplash (https://unsplash.it/300/300?image=<id>)

Milestone 2
Prendendo come riferimento il layout di esempio presente nell'html, stampiamo i post del nostro feed.

BONUS
Se clicchiamo sul tasto "Mi Piace" cambiamo il colore al testo del bottone e incrementiamo il counter dei likes relativo.
Salviamo in un secondo array gli id dei post ai quali abbiamo messo il like.
Formattare le date in formato italiano (gg/mm/aaaa).
Gestire l'assenza dell'immagine profilo con un elemento di fallback che contiene le iniziali dell'utente (es. Luca Formicola > LF).
Al click su un pulsante "Mi Piace" di un post, se abbiamo già cliccato dobbiamo decrementare il contatore e cambiare il colore del bottone.
*/

// List of posts objects
const posts = [
  {
    "id": 1,
    "content": "Placeat libero ipsa nobis ipsum quibusdam quas harum ut. Distinctio minima iusto. Ad ad maiores et sint voluptate recusandae architecto. Et nihil ullam aut alias.",
    "media": "https://unsplash.it/600/300?image=171",
    "author": {
      "name": "Phil Mangione",
      "image": "https://unsplash.it/300/300?image=15"
    },
    "likes": 80,
    "created": "2021-06-25"
  },
  {
    "id": 2,
    "content": "Placeat libero ipsa nobis ipsum quibusdam quas harum ut. Distinctio minima iusto. Ad ad maiores et sint voluptate recusandae architecto. Et nihil ullam aut alias.",
    "media": "https://unsplash.it/600/400?image=112",
    "author": {
      "name": "Sofia Perlari",
      "image": "https://unsplash.it/300/300?image=10"
    },
    "likes": 120,
    "created": "2021-09-03"
  },
  {
    "id": 3,
    "content": "Placeat libero ipsa nobis ipsum quibusdam quas harum ut. Distinctio minima iusto. Ad ad maiores et sint voluptate recusandae architecto. Et nihil ullam aut alias.",
    "media": "https://unsplash.it/600/400?image=234",
    "author": {
      "name": "Chiara Passaro",
      "image": "https://unsplash.it/300/300?image=20"
    },
    "likes": 78,
    "created": "2021-05-15"
  },
  {
    "id": 4,
    "content": "Placeat libero ipsa nobis ipsum quibusdam quas harum ut. Distinctio minima iusto. Ad ad maiores et sint voluptate recusandae architecto. Et nihil ullam aut alias.",
    "media": "https://unsplash.it/600/400?image=24",
    "author": {
      "name": "Luca Formicola",
      "image": null
    },
    "likes": 56,
    "created": "2021-04-03"
  },
  {
    "id": 5,
    "content": "Placeat libero ipsa nobis ipsum quibusdam quas harum ut. Distinctio minima iusto. Ad ad maiores et sint voluptate recusandae architecto. Et nihil ullam aut alias.",
    "media": "https://unsplash.it/600/400?image=534",
    "author": {
      "name": "Alessandro Sainato",
      "image": "https://unsplash.it/300/300?image=29"
    },
    "likes": 95,
    "created": "2021-03-05"
  }
];

// Select from the DOM the element that will contain all the posts
const postsListElement = document.querySelector(".posts-list");

// Generate posts and append them into the DOM
posts.forEach(post => {
  const singlePostMarkup = generateSinglePostMarkup(post);
  postsListElement.insertAdjacentElement("beforeend", singlePostMarkup);
});

// Select from the DOM the list of like buttons
const likeButtons = document.querySelectorAll(".like-button");

// Create an array that will contain the list of liked posts ID
const likedPostsList = [];

// Cycle through the array of like button to create a click event listener for each one of them
likeButtons.forEach(likeButton => {
  likeButton.addEventListener("click", function(e) {
    e.preventDefault();
    // Gets the liked post ID
    const currentPostId = likeButton.getAttribute("data-postid");

    // Select from the DOM the element containing the number of likes for the liked post
    const currentPostLikesNumberElement = document.getElementById(`like-counter-${currentPostId}`);

    // Increase / decrease the likes counter and save / remove the post ID to the array of liked posts
    manageLikeBehavior(likeButton, currentPostLikesNumberElement, likedPostsList, currentPostId);
  });
})

/**
 * Provides the HTML markup for a single post, taking data from the single post object
 * @param {object} postObject The object containing the properties of a single post
 * @returns {HTMLElement} The element containing the HTML markup of the post
 */
function generateSinglePostMarkup(postObject) {
  const singlePostElement = document.createElement("div");
  singlePostElement.classList.add("post");

  // Generate the markup for every single section of the post
  singlePostElement.innerHTML += generatePostHeader(postObject) + generatePostText(postObject.content) + generatePostImage(postObject.media) + generatePostFooter(postObject);
  return singlePostElement;
}

/**
 * Provides the HTML markup for the header section of a single post, taking care of a missing profile image
 * @param {object} postObject The object containing the properties of a single post
 * @returns {string} The string containing the markup for the header section of the post
 */
function generatePostHeader(postObject) {
  let headerMarkup = `
  <div class="post__header">
    <div class="post-meta">                    
      <div class="post-meta__icon">`;
  if (postObject.author.image != null && postObject.author.image != undefined && postObject.author.image != "") {
    headerMarkup += `
        <img class="profile-pic" src="${postObject.author.image}" alt="${postObject.author.name}">`
  }
  else {
    headerMarkup += `
        <div class="profile-pic-default">
          <span>${recoverAuthorInitials(postObject.author.name)}</span>
        </div>`
  }
  headerMarkup += `
      </div>
      <div class="post-meta__data">
        <div class="post-meta__author">${postObject.author.name}</div>
        <div class="post-meta__time">${new Date(postObject.created).toLocaleDateString("it-IT", {day: "2-digit", month: "2-digit", year: "numeric"})}</div>
      </div>                    
    </div>
  </div>`;
  return headerMarkup;
}

/**
 * Provides the post's author initials in case it has not a profile image
 * @param {string} authorName The string containing the name of the post's author
 * @returns {string} The string containing the initials of the post's author
 */
function recoverAuthorInitials(authorName) {
  const authorNameArray = authorName.split(" ");
  const authorInitialsArray = authorNameArray.map(elements => {
    return elements.charAt(0).toUpperCase();
  });
  const authorInitialsString = authorInitialsArray.join("");
  return authorInitialsString;
}

/**
 * Provides the HTML markup for the textual content section of a single post, taking care of a missing textual content
 * @param {string} postTextualContent The string containing the textual content of the post
 * @returns {string} The string containing the markup for the textual section of the post
 */
function generatePostText(postTextualContent) {
  if (postTextualContent != undefined && postTextualContent != "") {
    let textMarkup = `<div class="post__text">${postTextualContent}</div>`;
  return textMarkup;
  }
  return "";
}

/**
 * Provides the HTML markup for the image section of a single post, taking care of a missing image
 * @param {string} postImage The string containing the path to the image of the post
 * @returns {string} The string containing the markup for the image section of the post
 */
function generatePostImage(postImage) {
  if (postImage != undefined && postImage != "") {
    let imageMarkup = `
    <div class="post__image">
      <img src="${postImage}" alt="Post image">
    </div>`;
    return imageMarkup;
  }
  return "";
}

/**
 * Provides the HTML markup for the footer section of a single post, taking care of a missing likes record
 * @param {object} postObject The object containing the properties of a single post
 * @returns {string} The string containing the markup for the image section of the post
 */
function generatePostFooter(postObject) {
  let footerMarkup = `
  <div class="post__footer">
    <div class="likes js-likes">
      <div class="likes__cta">
        <a class="like-button  js-like-button" href="#" data-postid="${postObject.id}">
          <i class="like-button__icon fas fa-thumbs-up" aria-hidden="true"></i>
          <span class="like-button__label">Mi Piace</span>
        </a>
      </div>
      <div class="likes__counter">
        Piace a <b id="like-counter-${postObject.id}" class="js-likes-counter">${postObject.likes != undefined && postObject.likes != "" ? postObject.likes : 0}</b> persone
      </div>
    </div> 
  </div>`;
  return footerMarkup;
}

/**
 * Increases / decreases the number of likes, changes the like button style and saves / removes the id of the liked post from the array of liked posts id
 * @param {HTMLElement} likeButton The like button the user has clicked
 * @param {HTMLElement} currentPostLikesNumberElement The element of the DOM containing the number of likes for the liked post
 * @param {number[]} likedPostsList The array containing the list of liked posts ID
 * @param {number} currentPostId The id of the post the user has clicked
 */
function manageLikeBehavior(likeButton, currentPostLikesNumberElement, likedPostsList, currentPostId) {
  // Checks if the post is already liked or not
  if (!likeButton.classList.contains("like-button--liked")) {
    // If not, increases the likes counter, sets it color and save the post ID to the array of liked posts IDs
    currentPostLikesNumberElement.innerHTML = Number(currentPostLikesNumberElement.innerHTML) + 1;
    currentPostLikesNumberElement.style.color = "#055c87";
    likedPostsList.push(currentPostId);
  } else {
    // Otherwise decreases the likes counter, resets its color and removes the post ID from the array of liked posts IDs
    currentPostLikesNumberElement.innerHTML = Number(currentPostLikesNumberElement.innerHTML) - 1;
    currentPostLikesNumberElement.style.color = "unset";
    likedPostsList.splice(likedPostsList.indexOf(currentPostId), 1);
  }
  // Toggles the class for the number of likes to apply an animation in case of a new like
  currentPostLikesNumberElement.classList.toggle("likedcounter");
  // Toggles the class for the liked post
  likeButton.classList.toggle("like-button--liked");
  // Shows the list of liked posts IDs
  console.log(likedPostsList);
}