window.onload = function () {
    const btnsDivClassName = "Tmb7Fd";
    let btnsDiv = document.getElementsByClassName(btnsDivClassName)[0];


    if (btnsDiv === null || btnsDiv === undefined) {

        //checks all new additions to the page until the div holding the btns are found
        var observer = new MutationObserver(function(mutations) {

            mutations.every(mutation => {
                for(var i=0; i<mutation.addedNodes.length; i++) {

                    //if the node is an html element node...
                    if(mutation.addedNodes[i].nodeType === 1) {
                        if(mutation.addedNodes[i].classList.contains(btnsDivClassName)) {
                            btnsDiv = mutation.addedNodes[i];
                            
                            addPipBtn();

                            observer.disconnect();
                            return false; //breaks out of "every" callback function
                        }
                    }
                }

                return true //"every" callback function moves to the next iteration
            });

        });
        
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    } else {
        addPipBtn();
    }


    function addPipBtn() {
        const container = document.createElement("div");
        container.id = "container";

        const popupMenu = document.createElement("div");
        popupMenu.id = "popupMenu";
        popupMenu.classList.add("hide");

        popupMenuHeader = document.createElement("div");
        popupMenuHeader.classList.add("popupMenuHeader");

        popupMenuBody = document.createElement("div");
        popupMenuBody.classList.add("popupMenuBody");

        popupMenu.appendChild(popupMenuHeader);
        popupMenu.appendChild(popupMenuBody);

        container.appendChild(popupMenu);

        const pipBtn = document.createElement("div");
        pipBtn.classList.add("pipBtn");

        const pipIcon = document.createElement("img");
        const imgSRC = chrome.runtime.getURL("./img/meets_plus_icon.png");
        pipIcon.src = imgSRC;
        pipIcon.alt = "Pip Icon";

        pipBtn.onclick = () => {
            if(popupMenu.classList.contains("hide")) {
                getVideos(popupMenuBody);
            }
            
            popupMenu.classList.toggle("hide");
        }

        pipBtn.appendChild(pipIcon);
        container.appendChild(pipBtn);

        btnsDiv.insertBefore(container, btnsDiv.children[0]);
    }


    function getVideos(popupMenuBody) {
        popupMenuBody.innerHTML = ""; //clears content

        let videosDetected = false;

        const videos = document.getElementsByClassName("Gv1mTb-aTv5jf");
        if(videos !== null && videos !== undefined) {
            for(let video of videos) {
                if(video.srcObject !== null) {
                    videosDetected = true;

                    const parentDiv = video.parentNode.parentNode.parentNode.parentNode;
                    const textDiv = parentDiv.getElementsByClassName("XEazBc adnwBd")[0];

                    const listItem = document.createElement("div");
                    listItem.classList.add("listItem");
                    listItem.innerText = textDiv.innerText;

                    listItem.onclick = () => {
                        video.requestPictureInPicture();
                    }

                    popupMenuBody.appendChild(listItem); 
                }
            }

            if(!videosDetected) {
                popupMenuBody.innerText = "No videos detected.";
            }
        }
    }
}