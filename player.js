//adding jQuery script to html
var script = document.createElement('script');script.src = "https://code.jquery.com/jquery-3.4.1.js"
integrity="sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU="
crossorigin="anonymous";

script.onload = function(){
    start();
}
document.getElementsByTagName('head')[0].appendChild(script);  

function start(){

    // gets the json file 
    var script = document.createElement('script');
    script.src = 'https://guidedlearning.oracle.com/player/latest/api/scenario/get/v_IlPvRLRWObwLnV5sTOaw/5szm2kaj/?callback=__5szm2kaj&refresh=true&env=dev&type=startPanel&vars%5Btype%5D=startPanel&sid=none&_=1582203987867?callback=__5szm2kaj';
    
    document.getElementsByTagName('head')[0].appendChild(script);
}

function __5szm2kaj(data)
{
    // checks the json opened successfully
    console.log(data.data);
    
    // setting the json file
    json = data.data;
    numberOfSteps = json.structure.steps.length;
    
    // ----------- adding the css file to google html ----------- //
    addsCSS(json.css);
    
    // ----------- render first tip ----------- ֿֿ//
    renderTip(json.structure.steps[0]);
    
}

// render tip
function renderTip(tip){

    var id = tip.id;
    var type = tip.action.type;
    var text = tip.action.contents["#content"];
    var stepNum = tip.action.stepOrdinal;

    // ----- finding the classes ----- //
    var tipClasses = classes(tip);

    // ----- creating the divs ----- //
    var sttip = document.createElement("div");
    var tooltip = document.createElement("div")
    var panelContainer = document.createElement("div");
    var guideContent = document.createElement("div");
    var popoverInner = document.createElement("div");

    // bulding the divs
    buildDivs(tip, sttip, tooltip, panelContainer, guideContent, popoverInner);
    
    // ----- choosing the correct type and inserts to the html ----- // 
    var tiplates = json.tiplates;
    // if it returns false - no more tips - nothing to render
    if(!insertType(type, tiplates, popoverInner)){
        return;
    }

    // render on screen
    document.querySelector("body").appendChild(sttip);

    // adding tip text
    addText(text);

    // adding step num out of number of steps 
    addStepsCounter(stepNum, numberOfSteps)

    // adding the close btn 
    var closeBtn = document.querySelector("[data-iridize-role='closeBt']");
    closeBtn.addEventListener("click", function(){
        close(sttip);
    });
    var tryLaterBtn = document.querySelector("[data-iridize-role='laterBt']");
    tryLaterBtn.addEventListener("click", function(){
        close(sttip);
    });

    // next btn 
    var nextbtn = document.querySelector("[data-iridize-role='nextBt']");
    nextbtn.setAttribute("href", `javascript:nextTip(${id});`);

}

// next tip 
function nextTip(id){
    console.log(id);
}

// closing the window
function close(sttip){
    sttip.parentNode.removeChild(sttip);
}

//adds stpes counter
function addStepsCounter(stepNum, numberOfSteps){
    var stepsCounter = document.querySelector("[data-iridize-role='stepCount']");
    stepsCounter.textContent = stepNum;
    document.querySelector("span [data-iridize-role='stepCount']+span").textContent = numberOfSteps;
}



// builds the divs
function buildDivs(tip, sttip, tooltip, panelContainer, guideContent, popoverInner){
    
    // adding classes
    sttip.classList.add("sttip");

    // classes are the tip classes
    tooltip.setAttribute("class", `tooltip in ${classes(tip)}`);

    panelContainer.classList.add("panel-container");
    guideContent.classList.add("guide-content");
    popoverInner.classList.add("popover-inner");

    // appending the divs
    guideContent.appendChild(popoverInner);
    panelContainer.appendChild(guideContent);
    tooltip.appendChild(panelContainer);
    sttip.appendChild(tooltip);
}

// adding tip text
function addText(text){
    var contentDiv = document.querySelector("[data-iridize-id='content']");
    contentDiv.innerHTML = text;
}

// choosing the correct type and inserting the html
//if no type matches - it is the last tip - return false
function insertType(type, tiplates, popoverInner){
    // get the types names
    var keys = Object.keys(tiplates);

    // search which type is tip type
    for(var i = 0; i < keys.length; i++){
        // this is the type
        if(type == keys[i]){
            // add type pattern to div
            popoverInner.innerHTML = tiplates[keys[i]];
            return true;
        }
    }
    return false;
}

// adds the css to google html
function addsCSS(css){
    var node = document.createElement("style");
    node.appendChild(document.createTextNode(css));
    document.querySelector("head").appendChild(node);
}

// return all tip classes in a string
function classes(tip){
    var str = tip.action.placement.concat(` ${tip.action.classes}`);
    return str;
}

