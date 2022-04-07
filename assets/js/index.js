"use strict";

/*========== CART FUNCTIONALITY ==========*/

// NAV MENU LINKS
const navMenu = document.querySelector(".nav-menu");
// ALL SECTIONS ID's
const sections = document.querySelectorAll("section[id]");
// HEADER
const headerActive = document.getElementById("header");
// CART BTN
const cartBtn = document.getElementById("cart-btn");
// SHOW || HIDE CART CONTAINER
const cartContainer = document.querySelector(".cart-container");
// CART LIST
const cartList = document.querySelector(".cart-list");
// CART TOTAL PRICE
const cartPrice = document.getElementById("cart-total-price");
// CART ITEM COUNT
const cartCountInfo = document.getElementById("cart-count-info");
// DISHES CONTAINER
const dishContainer = document.querySelector(".dishes-container");
// BURGER BTN
const burgerBtn = document.querySelector(".nav-burger");
// OVERLAY
const bodyOverlay = document.querySelector(".body-overlay");
// SEARCH
const searchForm = document.getElementById("search-form");
const searchIconBtn = document.getElementById("search-icon");
const closeForm = document.getElementById("close-form");

// EVENT LISTENERS
eventListeners();

// STARTER ID
let cartItemId = 1;

// ALL EVENT LISTENERS
function eventListeners() {
  // LOAD JSON CONTENT
  window.addEventListener("DOMContentLoaded", () => {
    loadJSON();
    loadCart();
  });
  // SEARCH FORM SHOW/HIDE
  searchIconBtn.addEventListener("click", showHideSearch);
  // CART SHOW/HIDE
  cartBtn.addEventListener("click", showHideCart);

  // DISH FUNCTION ADD TO CART
  dishContainer.addEventListener("click", purchaseDish);

  // REMOVE FUNCTION REMOVE FROM CART
  cartList.addEventListener("click", deleteDish);

  // SCROLL ACTIVE HEADER
  window.addEventListener("scroll", headerScroll);

  // SCROLL ACTIVE LINK NAV LINKS
  window.addEventListener("scroll", scrollActive);

  // SCROLL TO TOP
  window.addEventListener("scroll", calcScrollValue);
  window.addEventListener("load", calcScrollValue);
}

// HEADER FUNCTIONALITY
function headerScroll() {
  this.scrollY >= 50
    ? headerActive.classList.add("active-header")
    : headerActive.classList.remove("active-header");
}

// SHOW/HIDE CART, SHOW/HIDE OVERLAY
function showHideCart() {
  cartContainer.classList.toggle("container-active");
  bodyOverlay.classList.toggle("body-overlay__hidden");

  document.addEventListener("keydown", (e) => {
    /*If the ESC key is pressed, and cart does 
    not contain the hidden class then close the modal */
    if (e.key === "Escape" && !cartBtn.classList.contains("body__hidden")) {
      cartContainer.classList.remove("container-active");
      bodyOverlay.classList.add("body-overlay__hidden");
    }
  });
  // If the overlay is clicked remove overlay and cart container
  bodyOverlay.onclick = () => {
    bodyOverlay.classList.add("body-overlay__hidden");
    cartContainer.classList.remove("container-active");
  };
}

// SHOW/HIDE SEARCH FORM
function showHideSearch() {
  // console.log("clicked");
  searchForm.classList.toggle("active");
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchForm.classList.contains("active")) {
      searchForm.classList.remove("active");
    }
  });
  // close on button click
  closeForm.onclick = () => {
    searchForm.classList.remove("active");
  };
}

// SCROLL TO TOP
function calcScrollValue() {
  let scrollProgress = document.getElementById("progress");
  let pos = document.documentElement.scrollTop;
  let calcHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrollValue = Math.round((pos * 100) / calcHeight);

  pos > 100
    ? (scrollProgress.style.display = "grid")
    : (scrollProgress.style.display = "none");
  scrollProgress.addEventListener("click", () => {
    document.documentElement.scrollTop = 0;
  });
  scrollProgress.style.background = `conic-gradient(var(--first-color-light) ${scrollValue}%, var(--opacity-2) ${scrollValue}%)`;
}

// LOAD JSON CONTENT
function loadJSON() {
  fetch("../../assets/js/json/dishes.json")
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      data.forEach((dish) => {
        html += `
            <div class="dish">
              <a href="#" class="fas fa-heart dish-icon dish-icon-heart"></a>
              <a href="#" class="fas fa-eye dish-icon dish-icon-eye"></a>
              <img
                src="${dish.imgSrc}"
                alt="dish-1"
                class="dish-img"
              />
              <div class="dish-details center-text">
                <span class="dish-category">${dish.category}</span>
                <span class="dish-name">${dish.name}</span>
                <div class="dish-rating">
                  <i class='bx bxs-star'></i>
                  <i class='bx bxs-star'></i>
                  <i class='bx bxs-star'></i>
                  <i class='bx bxs-star'></i>
                  <i class='bx bxs-star'></i>
                </div>
                <span class="dish-price">$${dish.price}</span>
              </div>
              <button class="dish-btn">
                <svg class="dish-btn__icon">
                  <use xlink:href="assets/img/sprite.svg#icon-cart"></use>
                </svg>
                Add To Cart
              </button>
            </div>
        `;
      });
      dishContainer.innerHTML = html;
    })
    .catch((error) => {
      // URL scheme must be "http" or "https" for CORS request
      alert(`User live server or local host`);
    });
}

// UPDATE CART INFO
function updateCartInfo() {
  let cartInfo = findCartInfo();
  // console.log(cartInfo);
  cartCountInfo.textContent = cartInfo.dishCount;
  cartPrice.textContent = cartInfo.total;
}

// PURCHASE FUNCTIONALITY
function purchaseDish(e) {
  if (e.target.classList.contains("dish-btn")) {
    let dish = e.target.parentElement;
    getDishInfo(dish);
  }
}

// GET DISH INFO AFTER ADDING TO CART
function getDishInfo(dish) {
  let dishInfo = {
    id: cartItemId,
    imgSrc: dish.querySelector(".dish-img").src,
    name: dish.querySelector(".dish-name").textContent,
    category: dish.querySelector(".dish-category").textContent,
    price: dish.querySelector(".dish-price").textContent,
  };
  // INCREMENT ID ON ADD
  cartItemId++;
  // console.log(dishInfo);
  addToCartList(dishInfo);
  // SAVE DISH IN STORAGE
  saveDishInStorage(dishInfo);
}

// ADD THE SELECTED DISH TO THE CART LIST
function addToCartList(dish) {
  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItem.setAttribute("data-id", `${dish.id}`);
  cartItem.innerHTML = ` 
                  <img
                    src="${dish.imgSrc}"
                    alt=""
                    class="cart-item__img"
                  />
                  <div class="cart-info">
                    <p class="cart-info__name">
                      <span>Name:</span>${dish.name}
                    </p>
                    <p class="cart-info__category">
                      <span>Category:</span>${dish.category}
                    </p>
                    <p class="cart-info__price"><span>Price:</span>${dish.price}</p>
                  </div>
                  <button type="button" class="nav-icon cart-delete__btn">
                   <i class='bx bxs-trash cart-delete__icon'></i>
                  </button>
                `;
  cartList.appendChild(cartItem);
}

// SAVE THE DISH IN THE LOCAL STORAGE
function saveDishInStorage(item) {
  let dishes = getDishFromStorage();
  // console.log(dishes);
  dishes.push(item);
  localStorage.setItem("dishes", JSON.stringify(dishes));
  updateCartInfo();
}

/* GET ALL THE DISHES INFO IF
 THERE IS ANY IN THE LOCAL STORAGE */
function getDishFromStorage() {
  // return dish if any, else return empty array
  return localStorage.getItem("dishes")
    ? JSON.parse(localStorage.getItem("dishes"))
    : [];
}

// LOAD CART ITEMS
function loadCart() {
  let dishes = getDishFromStorage();
  // if there are no items in storage
  if (dishes.length < 1) {
    cartItemId = 1;
    // console.log("No items in cart");
    // else get the id of the last item and increase it by 1
  } else {
    cartItemId = dishes[dishes.length - 1].id;
    cartItemId++;
  }
  // console.log(cartItemId);
  // save the items in cart
  dishes.forEach((dish) => addToCartList(dish));
  // calculate and update UI of cart info
  updateCartInfo();
}

// GET ITEMS INFO FROM CART, AND THE TOTAL PRICE
function findCartInfo() {
  let dishes = getDishFromStorage();
  // console.log(dishes);
  let total = dishes.reduce((acc, dish) => {
    // remove dollar sign
    let price = parseFloat(dish.price.substr(1));
    // add all of the prices
    return acc + price;
  }, 0);
  // console.log(total);
  return {
    total: total.toFixed(2),
    // return dishes count
    dishCount: dishes.length,
  };
}

// DELETE DISH FROM CART FUNCTIONALITY
function deleteDish(e) {
  let cartItem;
  if (e.target.tagName === "BUTTON") {
    cartItem = e.target.parentElement;
    cartItem.remove(); // this removes from the DOM only
  } else if (e.target.tagName === "I") {
    cartItem = e.target.parentElement.parentElement;
    cartItem.remove(); // this removes from the DOM only
  }

  // console.log(cartItem);
  let dishes = getDishFromStorage();
  let updatedDishes = dishes.filter((dish) => {
    return dish.id !== parseInt(cartItem.dataset.id);
  });

  // update the cart list after the deletion
  localStorage.setItem("dishes", JSON.stringify(updatedDishes));
  updateCartInfo();
  // console.log(dishes);
  // console.log(updatedDishes);
}

/* ======= SHOW || HIDE NAVBAR MENU ======= */

// TOGGLE ON NAV MENU
burgerBtn.addEventListener("click", () => {
  burgerBtn.classList.toggle("active");
  navMenu.classList.toggle("active");
});
// TOGGLE OFF NAV MENU WHEN CLICK ON LINK
document.querySelectorAll(".nav-link").forEach((e) => {
  e.addEventListener("click", () => {
    burgerBtn.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

/*========== COPYRIGHT ==========*/

const year = new Date().getFullYear();

document.getElementById("year").textContent = year;

/*========== SCROLL ACTIVE SECTION ==========*/

function scrollActive() {
  scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 200;
    const sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav-menu a[href*=" + sectionId + "]")
        .classList.add("nav-link__active");
    } else {
      document
        .querySelector(".nav-menu a[href*=" + sectionId + "]")
        .classList.remove("nav-link__active");
    }
  });
}

/*========== PRELOADER ==========*/

function preloader() {
  document.querySelector(".preloader").classList.add("fade-out");
}

function fadeOut() {
  setInterval(preloader, 2000);
}

window.onload = fadeOut;

/*========== * EXTERNAL LIBRARY * ==========*/

/*========== SWIPER FUNCTIONALITY ==========*/

let swiperAbout = new Swiper(".about-container", {
  slidesPerView: 2,
  spaceBetween: 30,
  slidesPerGroup: 2,
  loop: true,
  clickable: true,
  mousewheel: true,
  keyboard: true,
  grabCursor: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      slidesPerGroup: 1,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
      slidesPerGroup: 2,
    },
  },
});

let reviewAbout = new Swiper(".review-container", {
  spaceBetween: 30,
  loop: true,
  clickable: true,
  mousewheel: true,
  keyboard: true,
  grabCursor: true,
  autoplay: {
    delay: 7500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    },
  },
});

/*========== SCROLL REVEAL ANIMATION ==========*/

AOS.init({
  offset: 400,
  duration: 1000,
  easing: "ease",
  once: true,
});
