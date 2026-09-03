let bannerMessageNum = "33" //7.0.3
const body = document.querySelector('body'),
sidebar = body.querySelector('nav'),
toggle = body.querySelector(".toggle"),
//searchBtn = body.querySelector(".search-box"),
modeSwitch = body.querySelector(".toggle-switch"),
modeText = body.querySelector(".mode-text");

body.style.display = "block"

// startup
let mode = localStorage.getItem("mode")
if(mode === null){
    mode === "Dark"
    localStorage.setItem("mode", "Dark")

    body.classList.toggle("dark");

    // if(body.classList.contains("dark")){
    //     modeText.innerText = "Light mode";
    // }else{
    //     modeText.innerText = "Dark mode";
    // }
} else {
    if(mode === "Dark" || mode === "Dark Themed" || mode === "Darker Dark"){
        body.classList.toggle("dark");

        // if(body.classList.contains("dark")){
        //     modeText.innerText = "Light mode";
        // }else{
        //     modeText.innerText = "Dark mode";
        // }
    }
}

// toggle.addEventListener("click" , () =>{
//     sidebar.classList.toggle("close");

//     if(sidebar.classList.value !== "sidebar close"){
//         document.getElementById("linkOptions").style.transform = "translate(240px, 0px)"
//     } else {
//         document.getElementById("linkOptions").style.transform = "translate(75px, 0px)"
//     }
// })

if(localStorage.getItem("openSidebar") === "true"){
    sidebar.classList.toggle("close")
    document.getElementById("linkOptions").style.transform = "translate(240px, -75px)"
}


// searchBtn.addEventListener("click" , () =>{
//     sidebar.classList.remove("close");
// })

// modeSwitch.addEventListener("click" , () =>{
//     body.classList.toggle("dark");

//     if(body.classList.contains("dark")){
//         modeText.innerText = "Light mode";
//         localStorage.setItem("mode", "dark")
//     }else{
//         modeText.innerText = "Dark mode";
//         localStorage.setItem("mode", "light")
//     }
// });

function gamepage(){
    document.getElementById("gameViewFullscreen").style.display = "none"
    document.getElementById("gamepage").style.display = "none"
    document.getElementById("mainpage").style.display = "block"
    document.getElementById("gameIframe").src = ""
    document.body.style.overflow = "visible"
    document.getElementById("importantMessage").style.display = "none"

    if(localStorage.getItem("openSidebar") === "true" && body.querySelector('nav').classList.value === "sidebar close") body.querySelector('nav').classList.toggle("close")

    trackGameData(null, "stop")
    window.location.hash = `#`
    exitFullscreen();
    exitWindowed();
    window.currentPlay = null;
}

var inFullscreen = false
function fullscreen(){
    document.getElementById("gameIframe").focus();
    if(window.location == window.parent.location){
        var elem = document.getElementById("fullscreenGame")
        if(elem.requestFullscreen){
            elem.requestFullscreen();
        } else if(elem.webkitRequestFullscreen){
            elem.webkitRequestFullscreen();
        } else if(elem.msRequestFullscreen){
            elem.msRequestFullscreen();
        }

        var iframe = document.getElementById("gameIframe")
        var fpscount = document.getElementById("FPSCount")
        var controlbar = document.getElementById("controlbar")

        elem.addEventListener("fullscreenchange", exitHandler, false)
        elem.addEventListener("mozfullscreenchange", exitHandler, false)
        elem.addEventListener("MSFullscreenChange", exitHandler, false)
        elem.addEventListener("webkitfullscreenchange", exitHandler, false)
        function exitHandler(){
            if(!document.webkitIsFullScreen && !document.MozFullScreen && !document.msFullscreenElement){
                iframe.classList = "gameIframe"
                fpscount.classList = "FPSCount"
                controlbar.classList = "controlBar"
                inFullscreen = false
                document.getElementById("cbfullscreen").onclick = function(){ fullscreen() }
                document.getElementById("cbfullscreenicon").classList = "bx bx-fullscreen cbicon"
                if(inRForm === false) document.body.style.overflow = "visible"                
                document.getElementById("cbOptionsMenu").style.transform = "translate(75px, -190px)"
                document.getElementById("hidebaroption").style.display = "none"
                showBar();
                resizeWidth();
                if(inWindowedFullscreen === true) windowedfullscreen()
                focusGame();
            } else {
                iframe.classList = "gameIframeFullscreen"
                fpscount.classList = "FPSCount FPSCountFullscreen"
                controlbar.classList = "controlBarFullscreen"
                inFullscreen = true
                document.getElementById("cbfullscreen").onclick = function(){ exitFullscreen() }
                document.getElementById("cbfullscreenicon").classList = "bx bx-exit-fullscreen cbicon"
                document.getElementById("cbOptionsMenu").style.transform = "translate(75px, -245px)"
                document.getElementById("hidebaroption").style.display = "block";
                focusGame();
            }
        }
    } else {
        // window.location = "gamepage-full.html"
    }
}

function exitFullscreen(){
    if(inFullscreen === false) return;
    if(document.exitFullscreen){
        document.exitFullscreen();
    } else if(document.webkitExitFullscreen){
        document.webkitExitFullscreen();
    } else if(document.msExitFullscreen){
        document.msExitFullscreen();
    }
}

var inWindowedFullscreen = false
function windowedfullscreen (){
    exitFullscreen();
    var iframe = document.getElementById("gameIframe")
    iframe.classList = "gameIframeFull"
    document.body.style.overflow = "hidden"
    window.scrollTo(0, 0)
    iframe.focus()
    var fpscount = document.getElementById("FPSCount")
    fpscount.classList = "FPSCount FPSCountFull"
    var controlbar = document.getElementById("controlbar")
    controlbar.classList = "controlBarFull"
    inWindowedFullscreen = true
    document.getElementById("cbfullscreen").onclick = function(){ exitWindowed() }
    document.getElementById("cbfullscreenicon").classList = "bx bx-exit-fullscreen cbicon"
    document.getElementById("cbwindowed").onclick = function(){ exitWindowed() }
    document.getElementById("cbwindowedtext").innerText = "Exit Windowed"
    document.getElementById("cbOptionsMenu").style.transform = "translate(75px, -245px)"
    document.getElementById("hidebaroption").style.display = "block";
    focusGame();
}

function exitWindowed(){
    var iframe = document.getElementById("gameIframe")
    var fpscount = document.getElementById("FPSCount")
    iframe.classList = "gameIframe"
    fpscount.classList = "FPSCount"
    var controlbar = document.getElementById("controlbar")
    controlbar.classList = "controlBar"
    document.body.style.overflow = "visible"
    document.getElementById("exitBtn").style.display = "none"
    inWindowedFullscreen = false
    document.getElementById("cbfullscreen").onclick = function(){ fullscreen() }
    document.getElementById("cbfullscreenicon").classList = "bx bx-fullscreen cbicon"
    document.getElementById("cbwindowed").onclick = function(){ windowedfullscreen() }
    document.getElementById("cbwindowedtext").innerText = "Windowed"
    document.getElementById("cbOptionsMenu").style.transform = "translate(75px, -190px)"
    document.getElementById("hidebaroption").style.display = "none"
    showBar();
    resizeWidth();
    focusGame();
}

setTimeout(() => {
    document.getElementById("loadingMessage").style.opacity = 1
}, 2000)

function resizeWidth(){
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width

    if(width < 1242){ document.getElementById("horLogoText").style.display = "none" } else { document.getElementById("horLogoText").style.display = "block" }
    //Other
    var container = document.getElementsByClassName("container")
    var soundboard = document.getElementsByClassName("soundboard")
    var gamebar = document.getElementById("gamebar")
    if(document.getElementById("gameIframe") !== null){
        let newHeight = `${document.querySelector("iframe").getBoundingClientRect().width / 1.778}px`
        if(inFullscreen !== true && inWindowedFullscreen !== true){
            var newnewHeight = document.querySelector("iframe").getBoundingClientRect().width / 1.778 - 60
            if(document.getElementById("navbar1").classList.value === "sidebar") newnewHeight = (document.querySelector("iframe").getBoundingClientRect().width + 162) / 1.778 - 60
            document.getElementById("gameIframe").style.height = newnewHeight + "px"
        }
        // document.getElementById("iframeFocus").style.height = newHeight
        document.getElementById("playbtnoverlay").style.height = newHeight
    }
    for(let i = 0; i < container.length; i++){
      var x = window.innerWidth * 90 / 100
      var y = Math.trunc(x / 225)
      var z = x / y - 26

        container[i].style.width = `${z}px`
        if(localStorage.getItem("gameIcon") !== "false") container[i].getElementsByClassName("game_img")[0].style.height = `${z * 0.5249}px`
        // container[i].style.marginLeft = `${z}px`
        gamebar.style.width = `calc(90% + ${7 * y})`
        document.getElementById("randomSelector").style.width = `${z}px`
        if(localStorage.getItem("gameIcon") !== "false") document.getElementById("randomSelector").getElementsByClassName("game_img")[0].style.height = `${z * 0.5249}px`
        let rec_containers = document.getElementsByClassName("rec_container")
        for(let j = 0; j < rec_containers.length; j++){
            rec_containers[j].style.width = `${z}px`
            if(localStorage.getItem("gameIcon") !== "false") rec_containers[j].getElementsByClassName("game_img")[0].style.height = `${z * 0.5249}px`
        }
    }
    for(let i = 0; i < soundboard.length; i++){
        var x = window.innerWidth * 90 / 100
        var y = Math.trunc(x / 350)
        var z = x / y - 39
        soundboard[i].style.width = `${z}px`
    }

    if(document.getElementsByClassName("homeSection0").length !== 0){
        var section = document.querySelector(".homeSection0")
        var textBox = document.querySelector(".homeTextBox")
        var img = document.querySelector(".homeSectionImg")

        textBox.style.top = `${(section.offsetHeight - textBox.offsetHeight) / 2}px`
        img.style.top = `${(section.offsetHeight - img.offsetHeight) / 2}px`
    }
}

window.addEventListener("resize", function(){ resizeWidth(); })

window.onload = (event) => {
    resizeWidth();

    document.getElementById("loader-wrapper").style.opacity = 0;
    document.body.style.overflow = "visible";
    setTimeout(() => {
        document.getElementById("loader-wrapper").style.display = "none";
    }, 250)

    if(localStorage.getItem("bannerMessageNum") !== bannerMessageNum || localStorage.getItem("bannerMessageNum") === null){
        if(document.getElementById("bannerMessage")) document.getElementById("bannerMessage").style.display = "block"
    }

    if(window.location.pathname.endsWith("games.html") || window.location.pathname.endsWith("games") || window.location.pathname.endsWith("blog.html") || window.location.pathname.endsWith("blog")) checkHash(true);
    if(localStorage.getItem("nav") === "Horizontal Bar" && localStorage.getItem("alwaysOnTop") !== "false") document.getElementById("alerts").style.bottom = "5%"
}

// window.onbeforeunload = function() {
//     document.querySelector("html").style.backgroundColor = "var(--body-color)"
//     document.querySelector("body").style.display = "none";
// }

function hideBanner(){
    document.getElementById("bannerMessage").style.display = "none"
    localStorage.setItem("bannerMessageNum", bannerMessageNum)
}

function optionsMenu(dropdown) {
	e = document.getElementById(dropdown)
	if(e.style.display === "none" || (e.style.display !== "none" && e.style.display !== "block")){
		e.style.display = "block"
	} else {
		e.style.display = "none"
	}
}

window.addEventListener("message", testLoop, false);

var lastFPSUpdate = null
function testLoop(event){
    if(localStorage.getItem("FPSCount") !== "true") return;
    if(!document.getElementById("FPSCount")) return;
    document.getElementById("FPSCount").style.display = "block"
    if(event.data.id === "sendFPSData") document.getElementById("FPSCount").innerText = event.data.count;
    lastFPSUpdate = Date.now()
}

var fps2 = null
setInterval(() => {
    if(lastFPSUpdate + 5000 < Date.now()){ fps2 = true } else { fps2 = false };
}, 2000)

  const times = [];
  var updateTime = null
  var minimum = []
  var lastMin = { last: 0, num: 0 }
  let fps;

  function refreshLoop(){
      if(localStorage.getItem("FPSCount") !== "true") return;
      if(!document.getElementById("FPSCount")) return;
      document.getElementById("FPSCount").style.display = "block"
      window.requestAnimationFrame(() => {
          const now = performance.now();
          while (times.length > 0 && times[0] <= now - 1000){
              times.shift();
          }
          times.push(now);
          fps = times.length
          minimum.push(fps)
          if(updateTime === null || updateTime < Date.now()){
              if(lastMin.num === 10){
                  lastMin.last = minimum.sort((a, b) => a - b)[0]
                  lastMin.num = 0
                  minimum = []
              }
              if(fps2 === true) document.getElementById("FPSCount").innerText = `${fps - 1}/${lastMin.last - 1} FPS`
              updateTime = Date.now() + 100
              lastMin.num++
          }
          refreshLoop()
      })
  }

  refreshLoop()

  function createAlertBox(info){
      if(document.getElementsByClassName("alertBox").length > 3) return;
      var color = "var(--primary-color)"
      if(info.color === "green") color = "#0ed929"
      if(info.color === "red") color = "#f6290e"
      var time = info.time || 2000

      let length = 10
      const characters = "abcdefghikjlmnopqrstuvwxyz"
      let result = ""
      for(let i = 0; i < length; i++){
          result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      if(info.id) result = info.id

      var alertBox = document.createElement("div")
      alertBox.className = "alertBox"
      alertBox.id = result
      alertBox.style.opacity = "1"
      alertBox.style.boxShadow = `0px 0px 10px ${color}`

      var text = document.createElement("span")
      text.innerText = info.text
      alertBox.appendChild(text)

      document.getElementById("alerts").appendChild(alertBox)

      if(time === "never") return;
      setTimeout(() => {
          document.getElementById(result).style.opacity = "0"
          setTimeout(() => {
              document.getElementById(result).remove()
          }, 550)
      }, time)
  }

function instantLaunch(event){
    if(!window.location.pathname.endsWith("games.html") && !window.location.pathname.endsWith("games")) return;
    console.log(event)
    if(event.target.id === "container") playGame(event.target.firstChild.id);
    if(event.target.id === "title" || event.target.id === "genre") playGame(event.target.parentElement.id);
    if(event.target.id === "shadow") playGame(event.target.parentElement.id);
}

function toggleFPS(){
    if(!window.location.pathname.endsWith("games.html") && !window.location.pathname.endsWith("games")) return;
    if(localStorage.getItem("FPSCount") !== "true"){
        localStorage.setItem("FPSCount", "true")
        document.getElementById("FPSCount").style.display = "block"
        refreshLoop();
        createAlertBox({ color: "green", text: "FPS Count Enabled" })
        document.getElementById("cbfpstoggleicon").classList = "bx bx-toggle-right icon"
    } else {
        localStorage.setItem("FPSCount", "false")
        document.getElementById("FPSCount").style.display = "none"
        createAlertBox({ color: "red", text: "FPS Count Disabled" })
        document.getElementById("cbfpstoggleicon").classList = "bx bx-toggle-left icon"
    }
}

function random_game(){
    if(!window.location.pathname === "/games.html" && !window.location.pathname === "/games") return; 
    clickcount = 1
    if(document.getElementById("gamepage").style.display === "none") viewGame(data[Math.floor(Math.random() * data.length)].id);
}

var inRForm = false
function reportform(name){
    var form = document.getElementById("reportform")
    if(form.style.display === "block"){
        form.style.display = "none"
        if(document.getElementById("gameViewFullscreen").style.display !== "block") document.body.style.overflow = "visible";
        clearForm();
        inRForm = false
    } else {
        form.style.display = "block"
        if(name) document.getElementById("issue").value = name;
        exitFullscreen();
        exitWindowed();
        document.body.style.overflow = "hidden";
        document.getElementById("sform").style.display = "none"
        document.getElementById("brform").style.display = "block"
        document.getElementById("fform").style.display = "none"
        document.getElementById("form_title").innerText = "Bug Report"
        inRForm = true
    }
}

function suggestform(){
    var form = document.getElementById("reportform")
    if(form.style.display === "block"){
        form.style.display = "none"
        if(document.getElementById("gameViewFullscreen").style.display !== "block") document.body.style.overflow = "visible";
        clearForm();
        inRForm = false
    } else {
        form.style.display = "block"
        if(name) document.getElementById("issue").value = name;
        exitFullscreen();
        exitWindowed();
        document.body.style.overflow = "hidden";
        document.getElementById("sform").style.display = "block"
        document.getElementById("brform").style.display = "none"
        document.getElementById("fform").style.display = "none"
        document.getElementById("form_title").innerText = "Suggestion"
        inRForm = true
    }
}

function feedbackform(){
    var form = document.getElementById("reportform")
    if(form.style.display === "block"){
        form.style.display = "none"
        if(document.getElementById("gameViewFullscreen").style.display !== "block") document.body.style.overflow = "visible";
        clearForm();
        inRForm = false
    } else {
        form.style.display = "block"
        if(name) document.getElementById("issue").value = name;
        exitFullscreen();
        exitWindowed();
        document.body.style.overflow = "hidden";
        document.getElementById("fform").style.display = "block"
        document.getElementById("sform").style.display = "none"
        document.getElementById("brform").style.display = "none"
        document.getElementById("form_title").innerText = "Feedback"
        inRForm = true
    }
}

function clearForm(){
    document.getElementById("issue").value = "";
    document.getElementById("description").value = "";
    document.getElementById("reproduce").value = "";

    document.getElementById("suggestion").value = "";
    document.getElementById("information").value = "";

    document.getElementById("feedback").value = "";
    document.getElementById("improvement").value = "";
    document.getElementById("rating").value = "";
}

var sending = false //small backup just in case
function submitform(e, type){
    e.preventDefault();
    if(sending === true) return;
    sending = true
    createAlertBox({ text: "Please wait...", time: "never", id:"submitting" })
    document.getElementById("brform").style.opacity = 0.7
    document.getElementById("brform").style.pointerEvents = "none"
    document.getElementById("sform").style.opacity = 0.7
    document.getElementById("sform").style.pointerEvents = "none"
    document.getElementById("fform").style.opacity = 0.7
    document.getElementById("fform").style.pointerEvents = "none"
    var form = document.getElementById(type);
    var formData = {};
    for (const field of form.elements) {
        if (field.name) {
          formData[field.name] = field.value;
        }
    }
    if(type === "brform"){
        formData.device = OSDetails()
        formData.browser = browserDetails()
    }
    //56ade426936ca24343ca1bd09d53f608
    fetch('https://formsubmit.co/ajax/randomthing0320@gmail.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if(data.success === "true" || data.message.startsWith("This form needs Activation.")){
            reportform();
            createAlertBox({ color: "green", text: "Successfully Submitted", time: 5000 })
            document.getElementById("brform").style.opacity = 1
            document.getElementById("brform").style.pointerEvents = "auto"
            document.getElementById("sform").style.opacity = 1
            document.getElementById("sform").style.pointerEvents = "auto"
            document.getElementById("fform").style.opacity = 1
            document.getElementById("fform").style.pointerEvents = "auto"
            document.getElementById("submitting").remove()
            clearForm();
            sending = false
            inRForm = false
        } else {
            if(data.success === "false"){
                createAlertBox({ color: "red", text: "Unable to Submit", time: 5000 })
                document.getElementById("brform").style.opacity = 1
                document.getElementById("brform").style.pointerEvents = "auto"
                document.getElementById("sform").style.opacity = 1
                document.getElementById("sform").style.pointerEvents = "auto"
                document.getElementById("fform").style.opacity = 1
                document.getElementById("fform").style.pointerEvents = "auto"
                document.getElementById("submitting").remove()
                sending = false
            }
        }
      })
      .catch(error => {
        console.log(error);
        createAlertBox({ color: "red", text: "Unable to Submit", time: 5000 })
        document.getElementById("brform").style.opacity = 1
        document.getElementById("brform").style.pointerEvents = "auto"
        document.getElementById("sform").style.opacity = 1
        document.getElementById("sform").style.pointerEvents = "auto"
        document.getElementById("fform").style.opacity = 1
        document.getElementById("fform").style.pointerEvents = "auto"
        document.getElementById("submitting").remove()
        sending = false
      });
}

function browserDetails(){
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName  = navigator.appName;
    var fullVersion  = ''+parseFloat(navigator.appVersion); 
    var majorVersion = parseInt(navigator.appVersion,10);
    var nameOffset,verOffset,ix;

    // In Opera, the true version is after "OPR" or after "Version"
    if ((verOffset=nAgt.indexOf("OPR"))!=-1) {
     browserName = "Opera";
     fullVersion = nAgt.substring(verOffset+4);
     if ((verOffset=nAgt.indexOf("Version"))!=-1) 
       fullVersion = nAgt.substring(verOffset+8);
    }
    // In MS Edge, the true version is after "Edg" in userAgent
    else if ((verOffset=nAgt.indexOf("Edg"))!=-1) {
     browserName = "Microsoft Edge";
     fullVersion = nAgt.substring(verOffset+4);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
     browserName = "Microsoft Internet Explorer";
     fullVersion = nAgt.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
     browserName = "Chrome";
     fullVersion = nAgt.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
     browserName = "Safari";
     fullVersion = nAgt.substring(verOffset+7);
     if ((verOffset=nAgt.indexOf("Version"))!=-1) 
       fullVersion = nAgt.substring(verOffset+8);
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
     browserName = "Firefox";
     fullVersion = nAgt.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
              (verOffset=nAgt.lastIndexOf('/')) ) 
    {
     browserName = nAgt.substring(nameOffset,verOffset);
     fullVersion = nAgt.substring(verOffset+1);
     if (browserName.toLowerCase()==browserName.toUpperCase()) {
      browserName = navigator.appName;
     }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix=fullVersion.indexOf(";"))!=-1)
       fullVersion=fullVersion.substring(0,ix);
    if ((ix=fullVersion.indexOf(" "))!=-1)
       fullVersion=fullVersion.substring(0,ix);

    majorVersion = parseInt(''+fullVersion,10);
    if (isNaN(majorVersion)) {
     fullVersion  = ''+parseFloat(navigator.appVersion); 
     majorVersion = parseInt(navigator.appVersion,10);
    }

    return `${browserName}, ${fullVersion}, ${majorVersion}, ${navigator.appName}, ${navigator.userAgent}`;
}

function OSDetails(){
    var OSName="Unknown OS";
    if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
    if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
    if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
    if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

    return OSName
}

function generate(count) {
    var _sym = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var str = '';

    for(var i = 0; i < count; i++) {
        str += _sym[parseInt(Math.random() * (_sym.length))];
    }
    return str;
}

{
    let chat_id = localStorage.getItem("sgs_chat_id")
    if(!chat_id){
        localStorage.setItem("sgs_chat_id", generate(12))
    }
}

function about_blank(){
    var newWindow = window.open('about:blank', '_blank');
    newWindow.document.body.style.margin = '0';
    newWindow.document.body.style.height = '100vh';
    newWindow.document.body.style.minHeight = '100vh';
    var iframe = newWindow.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.minWidth = '100%';
    iframe.style.minHeight = '100%';
    iframe.style.margin = '0';
    iframe.src = `${window.location.origin}`;
    newWindow.document.body.appendChild(iframe);
}

function downloadFile(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}