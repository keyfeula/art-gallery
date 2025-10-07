const button = document.querySelector("button");
const img = document.querySelector("img");
const frame = document.querySelector(".frame");

let galleryIDs;

const artPiece = {
    artistName: "",
    yearCompleted: "",
    name: "",
    medium: "",
    imageURL: "",
    smallImgURL: ""
}

async function getGalleryObjects() {
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

async function getImage() {
    try {
        const randomIndex = Math.floor(Math.random() * (galleryIDs.length - 1));
        const response = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects/" + galleryIDs[randomIndex]);
        if (!response.ok) {
            throw new Error("Error: " + response.statusText);
        }

        const json = await response.json();

        if (!json.primaryImage) {
            await getImage();
        }

        artPiece.artistName = json.artistDisplayName;
        artPiece.yearCompleted = json.objectEndDate;
        artPiece.name = json.title;
        artPiece.medium = json.medium;
        artPiece.smallImgURL = json.primaryImageSmall;
        artPiece.imageURL = json.primaryImage;

        img.src = artPiece.smallImgURL;
    }
    catch(error) {
        console.log(error);
    }
}

async function initialize() {
    await getGalleryObjects();
    await getImage();
}

initialize();

button.addEventListener("click", (event) => {
    getImage();
});
