(function() {
    var MENU_NAME = [
            "낚시 명소",
            "파고, 유속, 유향, 해무 정보",
            "조위, 수온, 기온, 풍량, 풍속 정보",
            "실시간 해양 관광 정보",
            "서핑",
            "Fish count"
        ],
        MAIN_DATA_IMAGE = [ 
            "./image/fish3.svg",
            "./image/wave.svg",
            "./image/wind.svg",
            "./image/travel2.svg",
            "./image/surfing3.svg",
            "./image/다운로드.png"
        ],
        HEADER_DATA = {
            "NONE": {
                "top": "-41px"
            },
            "HALF": {
                "top": "11px"
            },
            "FULL": {
                "top": "51px"
            }
        },

        ANIM_DURATION = 400,

        animRequest = 0,
        animStartTime = 0;
    	
    var fish_count = [
              "우럭", "농어", "광어",
              "민물고기", "돔"
            ];
    
    function emptyElement(elm) {
        while (elm.firstChild) {
            elm.removeChild(elm.firstChild);
        }

        return elm;
    }

    function createPageChangeFunc(data) {
        return function() {
            var elmName = document.querySelector("#name-contact"),
                elmNum = document.querySelector("#number-contact");

            emptyElement(elmName).appendChild(document.createTextNode(MENU_NAME[data]));
            if(data == 0){
            	pageController.movePage("page-fish");
            }else if(data == 1){
            	location.href = "info.html";
            }else if(data == 2){
            	location.href = "info2.html";
            }else if(data == 3){
            	location.href = "trip.html";
            }else if(data == 5){
            	window.onload = init1();
            }
        };
    }

    
    
    function pushData() {
        var i;
        for (i = 0; i < MENU_NAME.length; i++) {
            if (MAIN_DATA_IMAGE[i]) {
                listController.addData(MENU_NAME[i], MAIN_DATA_IMAGE[i], createPageChangeFunc(i));
            } else {
                listController.addData(MENU_NAME[i], null, createPageChangeFunc(i));
            }
        }
        
    }
    
    function pushData1() {
        var i;
        for (i = 0; i < fish_count.length; i++) {
            if (fish_count[i]) {
                listController.addData(fish_count[i], null, createPageChangeFunc(i));
            } else {
                listController.addData(MENU_NAME[i], null, createPageChangeFunc(i));
            }
        }
        
    }


    function keyEventHandler(ev) {
        if (ev.keyName === "back") {
            if (pageController.isPageMain() === true) {
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {}
            } else {
                pageController.moveBackPage();
            }
        }
    }

    function setAnimationStyle(elm, origPos, destPos, ratio) {
        var valOrigStyle,
            valDestStyle,
            valAnimStyle;

        if (ratio > 1) {
            ratio = 1;
        }

        Object.keys(HEADER_DATA[origPos]).forEach(function(key) {
            switch (key) {
                case "top":
                    valOrigStyle = parseFloat(HEADER_DATA[origPos][key]);
                    valDestStyle = parseFloat(HEADER_DATA[destPos][key]);
                    valAnimStyle = (valOrigStyle + (valDestStyle - valOrigStyle) * ratio) + "px";
                    break;
                default:
                    break;
            }

            elm.style[key] = valAnimStyle;
        });
    }

    function drawAnimationFrame(animStart, animEnd, timestamp) {
        var elmHeader = document.querySelector(".header"),
            progress;

        if (!animStartTime) {
            animStartTime = timestamp;
        }
        progress = timestamp - animStartTime;

        setAnimationStyle(elmHeader, animStart, animEnd, progress / ANIM_DURATION);

        if (progress < ANIM_DURATION) {
            animRequest = window.requestAnimationFrame(drawAnimationFrame.bind(this, animStart, animEnd));
        } else {
            animRequest = 0;
            animStartTime = 0;
        }
    }

    
    function setHeaderAnimation(start, end) {
        if (animRequest) {
            window.cancelAnimationFrame(animRequest);
        }
        animRequest = window.requestAnimationFrame(drawAnimationFrame.bind(this, start, end));
    }

    function scrollDownCallbackHeader(focusPos, diff) {
        switch (focusPos) {
            case 0:
                if (diff === 1) {
                    setHeaderAnimation("FULL", "HALF");
                } else {
                    setHeaderAnimation("FULL", "NONE");
                }
                break;
            case 1:
                setHeaderAnimation("HALF", "NONE");
                break;
            default:
                break;
        }
    }

    function scrollUpCallbackHeader(focusPos, diff) {
        if (pageController.isPageMain() === true) {
            switch (focusPos) {
                case 1:
                    setHeaderAnimation("HALF", "FULL");
                    break;
                default:
                    if (focusPos + diff === 1) {
                        setHeaderAnimation("NONE", "HALF");
                    } else if (focusPos + diff === 0) {
                        setHeaderAnimation("NONE", "FULL");
                    }
                    break;
            }
        }
    }

    function init() {
        listController.init("list-buddy");
        pushData();
        window.addEventListener("tizenhwkey", keyEventHandler);
        pageController.addPage("page-main");
        
        pageController.addPage("page-fish");
        pageController.addPage("page-info");
        
        listController.setScrollUpCallback(scrollUpCallbackHeader);
        listController.setScrollDownCallback(scrollDownCallbackHeader);
    }
    	
    function init1() {
    	listController.init("list-buddy");
        pushData1();
        window.addEventListener("tizenhwkey", keyEventHandler);
        pageController.addPage("fish count");
        
       
        listController.setScrollUpCallback(scrollUpCallbackHeader);
        listController.setScrollDownCallback(scrollDownCallbackHeader);
    }
    window.onload = init();
}());