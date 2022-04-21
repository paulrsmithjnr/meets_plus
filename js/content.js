console.log("On a Meets Call! - content");
window.onload = function () {
    console.log("Fully loaded!");
    const contentDivClassName = "MCcOAc IqBfM ecJEib EWZcud d8Etdd cjGgHb LcUz9d";
    const div = document.getElementsByClassName(contentDivClassName);
    console.log("This is the div:", div[0]);

    const btnsDivClassName = "Tmb7Fd";
    const btnsDiv = document.getElementsByClassName(btnsDivClassName)[0];

    var pipBtn = document.createElement("div");
    pipBtn.classList.add("pipBtn");

    // var pipIcon = document.createElement("img");

    // const imgSRC = chrome.runtime.getURL("./img/meets_plus_icon.png");
    // console.log("imgSRC:", imgSRC);

    // pipIcon.src = imgSRC;
    // pipIcon.alt = "Pip Icon";
    // pipBtn.appendChild(pipIcon);

    btnsDiv.insertBefore(pipBtn, btnsDiv.children[0]);

    console.log("btnsDiv:", btnsDiv);
}