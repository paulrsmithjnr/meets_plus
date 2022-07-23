window.onload = function () {


    ///////////////////////////////////////////// INITIALIZATIONS /////////////////////////////////////////////

    const btnsDivClassName = "Tmb7Fd";
    let btnsDiv = document.getElementsByClassName(btnsDivClassName)[0];
    
    let videosFound = {};
    let videosToPiP = [];
    let pipStarted = false;

    let videoToFullScreen;
    let startPiPOnFullScreen = true;
    let fullScreenClickCountdown = 2;
    let isInFullScreen = false;    

    const pipvideo = document.createElement( "video" );
    pipvideo.onleavepictureinpicture = () => {
        cleanupPiP();
    }
    pipvideo.onenterpictureinpicture = (event) => {
        pipStarted = true;
    }

    document.onfullscreenchange = () => {
        if(isInFullScreen && pipStarted) {
            document.exitPictureInPicture();
        }

        fullScreenClickCountdown = 2;
        isInFullScreen = !isInFullScreen;
    }

    //global constants
    const VIDEO_PIP_LIMIT = 3;
    const CANVAS_VIDEO_HEIGHT = 146;
    const CANVAS_VIDEO_WIDTH = 260;

    ///////////////////////////////////////////// INITIALIZATIONS /////////////////////////////////////////////




    ///////////////////////////////////////////// ADDS CUSTOM BUTTONS TO SCREEN /////////////////////////////////////////////

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

    ///////////////////////////////////////////// ADDS CUSTOM BUTTONS TO SCREEN /////////////////////////////////////////////




    ///////////////////////////////////////////// FETCHES ALL VIDEOS ON PAGE /////////////////////////////////////////////

    function refreshVideos() {
        videosFound = {}; //reset videosFound
        videoToFullScreen = undefined;
        if(!pipStarted) {
            videosToPiP = [];
        }
        
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
                        const keys = Object.keys(videosFound);
                        let videoName = textDiv.innerText;

                        let nameAlreadyExists = keys.indexOf(videoName) !== -1;
                        if(nameAlreadyExists) {
                            let nameCount = 2;
                            let newVideoName = `${videoName} (${nameCount})`;

                            let nameAlreadyExists = keys.indexOf(newVideoName) !== -1;
                            while(nameAlreadyExists) {
                                nameCount++;
                                newVideoName = `${videoName} (${nameCount})`;

                                nameAlreadyExists = keys.indexOf(newVideoName) !== -1;
                            }
                            videoName = newVideoName;
                        }

                        videosFound[videoName] = video;
                    } else {
                        videosFound[`Presentation ${noNameCount}`] = video;
                        noNameCount++;
                    }
                }
            }
        }
    }

    ///////////////////////////////////////////// FETCHES ALL VIDEOS ON PAGE /////////////////////////////////////////////




    ///////////////////////////////////////////// FUNCTIONS RELATED TO THE FULL SCREEN FEATURE /////////////////////////////////////////////

    function addFullScreenBtn() {
        const container = document.createElement("div");
        container.classList.add("container");

        const fullScreenMenu = createFullScreenMenu();
        container.appendChild(fullScreenMenu);

        const fullScreenBtn = createFullScreenBtn();
        fullScreenBtn.onclick = () => {
            const fullScreenVideosDiv = fullScreenMenu.getElementsByClassName("videosDiv")[0];
            refreshVideos();
            populateFullScreenMenu(fullScreenVideosDiv);

            const pipMenu = document.getElementById("pipMenu");
            pipMenu.classList.add("hide");

            const numberOfVideosFound = Object.entries(videosFound).length;
            const enterFullScreenBtn = document.getElementById("enterFullScreenBtn");
            if(startPiPOnFullScreen && (fullScreenClickCountdown == 2) && (numberOfVideosFound > 1)) {
                enterFullScreenBtn.innerText = `Enter full screen (2)`;
            } else {
                enterFullScreenBtn.innerText = `Enter full screen`;
            }
            fullScreenMenu.classList.toggle("hide");
        }
        container.appendChild(fullScreenBtn);

        btnsDiv.insertBefore(container, btnsDiv.children[0]);
    }


    function createFullScreenBtn() {
        const fullScreenBtn = document.createElement("div");
        fullScreenBtn.classList.add("fullScreenBtn");

        const fullScreenIcon = document.createElement("img");
        const imgSRC = chrome.runtime.getURL("img/full_screen.png");
        fullScreenIcon.src = imgSRC;
        fullScreenIcon.alt = "Full Screen Icon";

        fullScreenBtn.appendChild(fullScreenIcon);

        return fullScreenBtn;
    }


    function createFullScreenMenu() {
        const fullScreenMenu = document.createElement("div");
        fullScreenMenu.id = "fullScreenMenu";
        fullScreenMenu.classList.add("hide");
        fullScreenMenu.classList.add("popup-menu");

        fullScreenMenuHeader = document.createElement("div");
        fullScreenMenuHeader.classList.add("fullScreenMenuHeader");
        fullScreenMenuHeader.innerHTML = '<h4 class="title">Meets+ (Full Screen)</h4>'
                                        +'<span class="instructions">Select the participant to show in fullscreen.</span>'
                                        +'<hr/>';

        fullScreenMenuBody = document.createElement("div");
        fullScreenMenuBody.classList.add("fullScreenMenuBody");

        const checkboxDiv = document.createElement("div");
        checkboxDiv.id = "checkboxDiv";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = startPiPOnFullScreen;

        const label = document.createElement("label");
        label.innerHTML = "Automatically start PiP <small>(click the button below twice)</small>";

        const videosDiv = document.createElement("div");
        videosDiv.classList.add("videosDiv");

        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(label);

        fullScreenMenuBody.appendChild(checkboxDiv);
        fullScreenMenuBody.appendChild(videosDiv);

        fullScreenMenuFooter = document.createElement("div");
        fullScreenMenuFooter.classList.add("fullScreenMenuFooter");
        
        const enterFullScreenBtn = document.createElement("button");
        enterFullScreenBtn.id = "enterFullScreenBtn";

        const numberOfVideosFound = Object.entries(videosFound).length;
        enterFullScreenBtn.innerText = numberOfVideosFound > 1 ?
            `Enter full screen (2)`:
            `Enter full screen`;

        checkbox.onchange = () => {
            startPiPOnFullScreen = checkbox.checked;
            
            const currentNumberOfVideosFound = Object.entries(videosFound).length;
            if(startPiPOnFullScreen && (currentNumberOfVideosFound > 1)) {
                enterFullScreenBtn.innerText = `Enter full screen (${fullScreenClickCountdown})`;
            } else {
                enterFullScreenBtn.innerText = "Enter full screen";
            }
        }
        
        enterFullScreenBtn.onclick = enterFullScreen;
        enterFullScreenBtn.classList.add("hide");

        fullScreenMenuFooter.appendChild(enterFullScreenBtn);

        fullScreenMenu.appendChild(fullScreenMenuHeader);
        fullScreenMenu.appendChild(fullScreenMenuBody);
        fullScreenMenu.appendChild(fullScreenMenuFooter);

        return fullScreenMenu;
    }


    function populateFullScreenMenu(fullScreenVideosDiv) {
        fullScreenVideosDiv.innerHTML = ""; //clears content

        const enterFullScreenBtn = document.getElementById("enterFullScreenBtn");
        if(Object.entries(videosFound).length === 0) {
            fullScreenVideosDiv.innerText = "No videos detected.";
            
            enterFullScreenBtn.classList.add("hide");
            return;
        }

        enterFullScreenBtn.classList.remove("hide");

        for(let videoName in videosFound) {
            const listItem = document.createElement("div");
            listItem.classList.add("listItem");
            listItem.innerText = videoName

            listItem.onclick = () => {
                //adds or removes video
                videoToFullScreen = videosFound[videoName];

                deselectListItems();
                listItem.classList.toggle("selected");
            }

            fullScreenVideosDiv.appendChild(listItem);
        }
    }

    function deselectListItems() {
        const listItems = document.getElementsByClassName("listItem");
        for(let listItem of listItems) {
            listItem.classList.remove("selected");
        }
    }


    function enterFullScreen() {
        if(videoToFullScreen === undefined) {
            return;
        }

        const enterFullScreenBtn = document.getElementById("enterFullScreenBtn");
        const numberOfVideosFound = Object.entries(videosFound).length;
        if((startPiPOnFullScreen) && (numberOfVideosFound !== 0) && (!pipStarted)) {
            if((fullScreenClickCountdown == 2) && (numberOfVideosFound !==1)) {
                addRandomVideosToPip();
                startPiP();
                fullScreenClickCountdown--;
                enterFullScreenBtn.innerText = `Enter full screen (${fullScreenClickCountdown})`;
            } else {
                makeVideoFullScreen();
            }
        } else {
            makeVideoFullScreen();
        }
    }

    function makeVideoFullScreen() {
        const fullScreenMenu = document.getElementById("fullScreenMenu");
        fullScreenMenu.classList.add("hide");

        videoToFullScreen.requestFullscreen();
        videoToFullScreen = undefined;
    }


    function addRandomVideosToPip() {
        const videosKeys = Object.keys(videosFound); 
        const length = videosKeys.length;
        

        let videoCount = 0;
        while((videoCount < VIDEO_PIP_LIMIT) && (videoCount < length-1)) {
            let randomIndex = Math.floor(Math.random() * length);
            let randomVideoName = videosKeys[randomIndex]

            let videoToAdd = videosFound[randomVideoName]
            if((!isInVideosToPiPArray(videoToAdd)) && (videoToAdd !== videoToFullScreen)) {
                videosToPiP.push(videoToAdd);
                videoCount++;
            }
        }
    }

    ///////////////////////////////////////////// FUNCTIONS RELATED TO THE FULL SCREEN FEATURE /////////////////////////////////////////////




    ///////////////////////////////////////////// FUNCTIONS RELATED TO THE PICTURE IN PICTURE FEATURE /////////////////////////////////////////////

    function addPipBtn() {
        const container = document.createElement("div");
        container.classList.add("container");

        const pipMenu = createPiPMenu();
        container.appendChild(pipMenu);

        const pipBtn = createPiPBtn();
        pipBtn.onclick = () => {
            const pipMenuBody = pipMenu.getElementsByClassName("pipMenuBody")[0];
            refreshVideos();
            populatePiPMenu(pipMenuBody);

            const fullScreenMenu = document.getElementById("fullScreenMenu");
            fullScreenMenu.classList.add("hide");

            pipMenu.classList.toggle("hide");
        }
        container.appendChild(pipBtn);

        btnsDiv.insertBefore(container, btnsDiv.children[0]);
    }


    function createPiPBtn() {
        const pipBtn = document.createElement("div");
        pipBtn.classList.add("pipBtn");

        const pipIcon = document.createElement("img");
        const imgSRC = chrome.runtime.getURL("img/meets_plus_icon.png");
        pipIcon.src = imgSRC;
        pipIcon.alt = "PiP Icon";

        pipBtn.appendChild(pipIcon);

        return pipBtn;
    }


    function createPiPMenu() {
        const pipMenu = document.createElement("div");
        pipMenu.id = "pipMenu";
        pipMenu.classList.add("hide");
        pipMenu.classList.add("popup-menu");

        pipMenuHeader = document.createElement("div");
        pipMenuHeader.classList.add("pipMenuHeader");
        pipMenuHeader.innerHTML = '<h4 class="title">Meets+ (Picture-in-Picture)</h4>'
                                        +'<span class="instructions">Select the participant(s) to open in PiP window.</span>'
                                        +'<hr/>';

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

        const startPipBtn = document.getElementById("startPipBtn");
        if(Object.entries(videosFound).length === 0) {
            pipMenuBody.innerText = "No videos detected.";
            
            startPipBtn.classList.add("hide");
            return;
        }

        startPipBtn.classList.remove("hide");
        if(pipStarted) {
            startPipBtn.innerText = "Stop PiP";
            return;
        } else {
            startPipBtn.innerText = "Start PiP";
        }

        const countDiv = document.createElement("div");
        countDiv.id = "countDiv";
        countDiv.innerText = `Selected 0 participants (the limit is ${VIDEO_PIP_LIMIT})`;
        pipMenuBody.appendChild(countDiv);

        for(let videoName in videosFound) {
            const listItem = document.createElement("div");
            listItem.classList.add("listItem");
            listItem.innerText = videoName

            listItem.onclick = () => {
                //adds or removes video
                if(!isInVideosToPiPArray(videosFound[videoName])) {
                    if(videosToPiP.length < VIDEO_PIP_LIMIT) {
                        videosToPiP.push(videosFound[videoName]);
                        listItem.classList.toggle("selected");
                    }
                } else {
                    const index = videosToPiP.indexOf(videosFound[videoName]);
                    videosToPiP.splice(index, 1);
                    listItem.classList.toggle("selected");
                }
                countDiv.innerText = videosToPiP.length === 1 ? 
                    `Selected 1 participant (the limit is ${VIDEO_PIP_LIMIT})` :
                    `Selected ${videosToPiP.length} participants (the limit is ${VIDEO_PIP_LIMIT})`;
            }

            pipMenuBody.appendChild(listItem);
        }
    }


    function startPiP() {
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

            var playPromise = pipvideo.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    pipvideo.requestPictureInPicture();
            
                });
            }

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

    ///////////////////////////////////////////// FUNCTIONS RELATED TO THE PICTURE IN PICTURE FEATURE /////////////////////////////////////////////



    ///////////////////////////////////////////// COMMON FUNCTIONS /////////////////////////////////////////////

    function isInVideosToPiPArray(video) {
        const index = videosToPiP.indexOf(video);
        return index !== -1;
    }
    
    ///////////////////////////////////////////// COMMON FUNCTIONS /////////////////////////////////////////////


}