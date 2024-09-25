var siteNameInput = document.getElementById("siteName");
var siteUrlInput = document.getElementById("siteUrl");
var submitBtn = document.getElementById("submitBtn");
var updateBtn = document.getElementById("updateBtn");
var searchInput = document.getElementById("searchInput");
var tableBody = document.getElementById("tableBody");
var boxInfo = document.querySelector(".error-msg");
var counter = document.getElementById("bookmarkCount");
var bookmarks;
var updatedIndex;
var deletedBookmark;


function validateSiteName(siteName) {
    var regex = /^[A-Za-z]{3,}(?: [A-Za-z]{3,})*$/;
    return regex.test(siteName);
}



function validateUrl(url) {
    var urlValidate = /^(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9\.\-_]{3,}\.[a-zA-Z]{2,}(\/[a-zA-Z0-9\.\-_]*)*$/;
    return urlValidate.test(url);
}


function validateSiteNameInput() {
    var siteName = siteNameInput.value.trim();
    if (!validateSiteName(siteName)) {
        siteNameInput.classList.add("is-invalid");
    } else {
        siteNameInput.classList.remove("is-invalid");
        siteNameInput.classList.add("is-valid");
    }
}


function validateUrlInput() {
    var siteUrl = siteUrlInput.value.trim();
    if (!validateUrl(siteUrl)) {
        siteUrlInput.classList.add("is-invalid");
    } else {
        siteUrlInput.classList.remove("is-invalid");
        siteUrlInput.classList.add("is-valid");
    }
}


siteNameInput.addEventListener("input", validateSiteNameInput);
siteUrlInput.addEventListener("input", validateUrlInput);


function addSites() {
    var siteName = siteNameInput.value.trim();
    var siteUrl = siteUrlInput.value.trim();

 
    if (!validateSiteName(siteName) || !validateUrl(siteUrl)) {
        boxInfo.classList.remove("d-none");
        return; 
    }

  
    var bookmark = {
        name: siteName,
        url: siteUrl
    };

    bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    clearForm();
    displayBookmarks();
    updateCounter()
}
function errorMessageBox() {
    boxInfo.classList.toggle("d-none"); 
}



function clearForm() {
    siteNameInput.value = "";
    siteUrlInput.value = "";
    siteNameInput.classList.remove("is-valid", "is-invalid");
    siteUrlInput.classList.remove("is-valid", "is-invalid");
}


function displayBookmarks() {
    var rows = "";
    for (var i = 0; i < bookmarks.length; i++) {
        rows += `
            <tr>
                <td>${i + 1}</td>
                <td>${bookmarks[i].name}</td>
                <td><a href="${bookmarks[i].url}" target="_blank" class="btn btn-primary"><span><i class="fa-solid fa-eye"></i></span> Visit</a></td>
                <td><button onclick="deleteBookmark(${i})" class="btn btn-danger"><span><i class="fas fa-trash-alt"></i></span> Delete</button></td>
                <td><button onclick="updateBookmark(${i})" class="btn btn-warning"><span><i class="fas fa-pen-alt"></i></span> Edit</button></td>
            </tr>
        `;
    }
    tableBody.innerHTML = rows;
}


function deleteBookmark(index) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-danger",
          cancelButton: "btn btn-success mx-2"
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
            deletedBookmark = bookmarks.splice(index, 1)[0];
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
            displayBookmarks();
            updateCounter()
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your imaginary file is safe :)",
            icon: "error"
          });
        }
      });   
}

function updateBookmark(index) {
    updatedIndex = index;
    siteNameInput.value = bookmarks[index].name;
    siteUrlInput.value = bookmarks[index].url;
    updateBtn.classList.remove("d-none");
    submitBtn.classList.add("d-none");
}


function saveUpdatedBookmark() {
    var siteName = siteNameInput.value.trim();
    var siteUrl = siteUrlInput.value.trim();

    if (!validateSiteName(siteName) || !validateUrl(siteUrl)) {
        return; 
    }

    bookmarks[updatedIndex].name = siteName;
    bookmarks[updatedIndex].url = siteUrl;
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    clearForm();
    updateBtn.classList.add("d-none");
    submitBtn.classList.remove("d-none");
    displayBookmarks();
}


function searchBookmarks() {
    var term = searchInput.value.toLowerCase();
    var rows = "";
    for (var i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].name.toLowerCase().includes(term)) {
            rows += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${bookmarks[i].name}</td>
                    <td><a href="${bookmarks[i].url}" target="_blank" class="btn btn-primary"><span><i class="fa-solid fa-eye"></i></span> Visit</a></td>
                    <td><button onclick="deleteBookmark(${i})" class="btn btn-danger"><span><i class="fas fa-trash-alt"></i></span> Delete</button></td>
                    <td><button onclick="updateBookmark(${i})" class="btn btn-warning"><span><i class="fas fa-pen-alt"></i></span> Edit</button></td>
                </tr>
            `;
        }
    }
    tableBody.innerHTML = rows;
}

submitBtn.onclick = addSites;
updateBtn.onclick = saveUpdatedBookmark;
searchInput.onkeyup = searchBookmarks;

function updateCounter() {
    counter.textContent = bookmarks.length; 
    localStorage.setItem("bookmarkCounter", bookmarks.length);
}



if (localStorage.getItem("bookmarks") !== null) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    displayBookmarks();
} else {
    bookmarks = [];
}

if (localStorage.getItem("bookmarkCounter") !== null) {
    updateCounter(); 
} else {
    localStorage.setItem("bookmarkCounter", 0); 
}