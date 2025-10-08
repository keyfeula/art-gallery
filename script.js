const button = document.querySelector("button");
const img = document.querySelector("img");
const frame = document.querySelector(".frame");
const artTitle = document.querySelector(".title");
const artistName = document.querySelector(".artist");
const yearCompleted = document.querySelector(".year");
const smallImg = document.querySelector("picture source");
let galleryIDs;

const artPiece = {
    artistName: "",
    yearCompleted: "",
    name: "",
    medium: "",
    imageURL: "",
    smallImgURL: ""
}

async function getGalleryIDs() {
    try {
        const response = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11");
        if (!response.ok) {
            throw new Error("Error: " + response.statusText);
        }
        const json = await response.json();
        galleryIDs = json.objectIDs;
    }
    catch(error) {
        console.log(error);
    }
}

async function getArt() {
    try {
        const randomIndex = Math.floor(Math.random() * (galleryIDs.length - 1));
        const response = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects/" + galleryIDs[randomIndex]);
        if (!response.ok) {
            throw new Error("Error: " + response.statusText);
        }

        const json = await response.json();

        if (!json.primaryImage || !json.primaryImageSmall) {
            getArt();
        }

        artPiece.artistName = json.artistDisplayName;
        artPiece.yearCompleted = json.objectEndDate;
        artPiece.name = json.title;
        artPiece.medium = json.medium;
        artPiece.smallImgURL = json.primaryImageSmall;
        artPiece.imageURL = json.primaryImage;

        img.src = artPiece.imageURL;
        img.alt = artPiece.name;
        smallImg.srcset = artPiece.smallImgURL;
        artTitle.textContent = '"' + artPiece.name + '"';
        artistName.textContent = artPiece.artistName;
        yearCompleted.textContent = artPiece.yearCompleted;
    }
    catch(error) {
        console.log(error);
    }
}

async function initializeGallery() {
    await getGalleryIDs();
    await getArt();

    button.addEventListener("click", (e) => getArt());
}

initializeGallery();