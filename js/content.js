window.onload = function () {
    const btnsDivClassName = "Tmb7Fd";
    let btnsDiv = document.getElementsByClassName(btnsDivClassName)[0];
    
    let videosFound = {};
    let videosToPiP = [];
    let pipStarted = false;

    const pipvideo = document.createElement( "video" );
    pipvideo.onleavepictureinpicture = () => {
        cleanupPiP();
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
                            
                            addFullScreenBtn();
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
        addFullScreenBtn();
        addPipBtn();
    }


    function getVideos() {
        videosFound = {}; //reset videosFound
        
        const videos = document.getElementsByClassName("Gv1mTb-aTv5jf");
        
        //videos filter process
        if(videos !== null && videos !== undefined) {
            noNameCount = 1;
            for(let video of videos) {
                if(video.srcObject !== null && video.style.display !== "none") {
                    videosDetected = true;

                    const parentDiv = video.parentNode.parentNode.parentNode.parentNode;
                    const textDiv = parentDiv.getElementsByClassName("XEazBc adnwBd")[0];

                    if(textDiv !== undefined) {
                        videosFound[textDiv.innerText] = video;
                    } else {
                        videosFound[`Presentation ${noNameCount}`] = video;
                        noNameCount++;
                    }
                }
            }
        }
    }


    function addFullScreenBtn() {
        const container = document.createElement("div");
        container.classList.add("container");

        const fullScreenMenu = createFullScreenMenu();
        container.appendChild(fullScreenMenu);

        const fullScreenBtn = createFullScreenBtn();
        // fullScreenBtn.onclick = () => {
        //     if(fullScreenMenu.classList.contains("hide")) {
        //         const fullScreenMenuBody = fullScreenMenu.getElementsByClassName("fullScreenMenuBody")[0];
        //         getVideos(fullScreenMenuBody);
        //     }

        //     fullScreenMenu.classList.toggle("hide");
        // }
        container.appendChild(fullScreenBtn);

        btnsDiv.insertBefore(container, btnsDiv.children[0]);
    }


    function createFullScreenMenu() {
        const fullScreenMenu = document.createElement("div");
        fullScreenMenu.id = "fullScreenMenu";
        fullScreenMenu.classList.add("hide");

        fullScreenMenuHeader = document.createElement("div");
        fullScreenMenuHeader.classList.add("fullScreenMenuHeader");

        fullScreenMenuBody = document.createElement("div");
        fullScreenMenuBody.classList.add("fullScreenMenuBody");

        fullScreenMenuFooter = document.createElement("div");
        fullScreenMenuFooter.classList.add("fullScreenMenuFooter");
        
        const enterFullScreenBtn = document.createElement("button");
        enterFullScreenBtn.id = "enterFullScreenBtn";
        // enterFullScreenBtn.onclick = startPiP;

        fullScreenMenuFooter.appendChild(enterFullScreenBtn);

        fullScreenMenu.appendChild(fullScreenMenuHeader);
        fullScreenMenu.appendChild(fullScreenMenuBody);
        fullScreenMenu.appendChild(fullScreenMenuFooter);

        return fullScreenMenu;
    }


    function createFullScreenBtn() {
        const fullScreenBtn = document.createElement("div");
        fullScreenBtn.classList.add("fullScreenBtn");

        const fullScreenIcon = document.createElement("img");
        const imgSRC = chrome.runtime.getURL("./img/full_screen.png");
        fullScreenIcon.src = imgSRC;
        fullScreenIcon.alt = "Full Screen Icon";

        fullScreenBtn.appendChild(fullScreenIcon);

        return fullScreenBtn;
    }


    function addPipBtn() {
        const container = document.createElement("div");
        container.classList.add("container");

        const pipMenu = createPiPMenu();
        container.appendChild(pipMenu);

        const pipBtn = createPiPBtn();
        pipBtn.onclick = () => {
            if(pipMenu.classList.contains("hide")) {
                const pipMenuBody = pipMenu.getElementsByClassName("pipMenuBody")[0];
                getVideos();
                populatePiPMenu(pipMenuBody);
            }

            pipMenu.classList.toggle("hide");
        }
        container.appendChild(pipBtn);

        btnsDiv.insertBefore(container, btnsDiv.children[0]);
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


    function createPiPMenu() {
        const pipMenu = document.createElement("div");
        pipMenu.id = "pipMenu";
        pipMenu.classList.add("hide");

        pipMenuHeader = document.createElement("div");
        pipMenuHeader.classList.add("pipMenuHeader");

        pipMenuBody = document.createElement("div");
        pipMenuBody.classList.add("pipMenuBody");

        pipMenuFooter = document.createElement("div");
        pipMenuFooter.classList.add("pipMenuFooter");
        
        const startPipBtn = document.createElement("button");
        startPipBtn.id = "startPipBtn";
        startPipBtn.onclick = startPiP;
        startPipBtn.classList.add("hide");

        pipMenuFooter.appendChild(startPipBtn);

        pipMenu.appendChild(pipMenuHeader);
        pipMenu.appendChild(pipMenuBody);
        pipMenu.appendChild(pipMenuFooter);

        return pipMenu;
    }


    function populatePiPMenu(pipMenuBody) {
        pipMenuBody.innerHTML = ""; //clears content

        if(Object.entries(videosFound).length === 0) {
            pipMenuBody.innerText = "No videos detected.";
            startPipBtn.classList.add("hide");
        return;
        }

        const startPipBtn = document.getElementById("startPipBtn");
        startPipBtn.classList.remove("hide");
        if(pipStarted) {
            startPipBtn.innerText = "Stop PiP";
            return;
        } else {
            startPipBtn.innerText = "Start PiP";
        }

        for(let videoName in videosFound) {
            const listItem = document.createElement("div");
            listItem.classList.add("listItem");
            listItem.innerText = videoName

            listItem.onclick = () => {
                //adds or removes video
                const index = videosToPiP.indexOf(videosFound[videoName]);
                if(index === -1) {
                    if(videosToPiP.length < VIDEO_PIP_LIMIT) {
                        videosToPiP.push(videosFound[videoName]);
                        listItem.classList.toggle("selected");
                    }
                } else {
                    videosToPiP.splice(index, 1);
                    listItem.classList.toggle("selected");
                }
            }

            pipMenuBody.appendChild(listItem);
        }
    }


    async function startPiP() {
        const pipMenu = document.getElementById("pipMenu");
        pipMenu.classList.add("hide");

        if(videosToPiP.length === 0) {
            return;
        }

        if(pipStarted) {
            document.exitPictureInPicture();
            cleanupPiP();
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

    function cleanupPiP() {
        pipvideo.srcObject.getTracks().forEach(track => track.stop());
        videosToPiP = [];

        pipStarted = false;
    }
}