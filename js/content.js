window.onload = function () {
    const btnsDivClassName = "Tmb7Fd";
    let btnsDiv = document.getElementsByClassName(btnsDivClassName)[0];
    
    let videosToPiP = [];
    let pipStarted = false;

    const pipvideo = document.createElement( "video" );
    pipvideo.onleavepictureinpicture = () => {
        pipStarted = false;
    }
    pipvideo.onenterpictureinpicture = (event) => {
        pipStarted = true;

        // const pipWindow = event.pictureInPictureWindow;
        // console.log(`The floating window dimensions are: ${pipWindow.width}x${pipWindow.height}px`);
    }

    //global constants
    const VIDEO_PIP_LIMIT = 3;
    const CANVAS_VIDEO_HEIGHT = 146;
    const CANVAS_VIDEO_WIDTH = 260;


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

        const popupMenu = createPopUpMenu();
        container.appendChild(popupMenu);

        const pipBtn = createPiPBtn();
        pipBtn.onclick = () => {
            if(popupMenu.classList.contains("hide")) {
                const popupMenuBody = popupMenu.getElementsByClassName("popupMenuBody")[0];
                getVideos(popupMenuBody);
            }

            popupMenu.classList.toggle("hide");
        }
        container.appendChild(pipBtn);

        btnsDiv.insertBefore(container, btnsDiv.children[0]);
    }


    function createPopUpMenu() {
        const popupMenu = document.createElement("div");
        popupMenu.id = "popupMenu";
        popupMenu.classList.add("hide");

        popupMenuHeader = document.createElement("div");
        popupMenuHeader.classList.add("popupMenuHeader");

        popupMenuBody = document.createElement("div");
        popupMenuBody.classList.add("popupMenuBody");

        popupMenuFooter = document.createElement("div");
        popupMenuFooter.classList.add("popupMenuFooter");
        
        const startPipBtn = document.createElement("button");
        startPipBtn.innerText = "Start PiP";
        startPipBtn.onclick = startPiP;

        popupMenuFooter.appendChild(startPipBtn);

        popupMenu.appendChild(popupMenuHeader);
        popupMenu.appendChild(popupMenuBody);
        popupMenu.appendChild(popupMenuFooter);

        return popupMenu;
    }


    function createPiPBtn() {
        const pipBtn = document.createElement("div");
        pipBtn.classList.add("pipBtn");

        const pipIcon = document.createElement("img");
        const imgSRC = chrome.runtime.getURL("./img/meets_plus_icon.png");
        pipIcon.src = imgSRC;
        pipIcon.alt = "PiP Icon";

        pipBtn.appendChild(pipIcon);

        return pipBtn;
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
                        //adds or removes video
                        const index = videosToPiP.indexOf(video);
                        if(index === -1) {
                            if(videosToPiP.length < VIDEO_PIP_LIMIT) {
                                videosToPiP.push(video);
                                listItem.classList.toggle("selected");
                            }
                        } else {
                            videosToPiP.splice(index, 1);
                            listItem.classList.toggle("selected");
                        }
                    }

                    popupMenuBody.appendChild(listItem); 
                }
            }

            if(!videosDetected) {
                popupMenuBody.innerText = "No videos detected.";
            }
        }
    }


    async function startPiP() {
        if(videosToPiP.length === 0) {
            return;
        }

        if(pipStarted) {
            document.exitPictureInPicture()
            pipvideo.srcObject.getTracks().forEach(track => track.stop());
        } else {
            const canvas = document.createElement( "canvas" );
            
            canvas.height = CANVAS_VIDEO_HEIGHT * videosToPiP.length;
            canvas.width = CANVAS_VIDEO_WIDTH;
            const ctx = canvas.getContext( "2d" );
            
            pipvideo.srcObject = canvas.captureStream();

            addVideosToPiPCanvas();
            await pipvideo.play();
            pipvideo.requestPictureInPicture();

            function addVideosToPiPCanvas() {
                for(let i = 0; i < videosToPiP.length; i++) {
                    ctx.drawImage(videosToPiP[i], 0, CANVAS_VIDEO_HEIGHT * i, CANVAS_VIDEO_WIDTH, CANVAS_VIDEO_HEIGHT);
                }
                requestAnimationFrame(addVideosToPiPCanvas);
            }
        }
    }
}