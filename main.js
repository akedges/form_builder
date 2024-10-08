document.getElementById("notifyText").textContent = "i notify you of things, but not rn...";

//const value


//          document.getElementById("littleButton").addEventListener("mouseover", hoverChange)
//document.getElementById("littleButton").style.border.


const pageData = {
    pageNumber: 0,
    question: "",
    options: ["test zebra", "test tiger", "test lion", "test hippo"],
    maxSelectable: 1,
    autoSubmit: true
}

const optionData = [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4"
]

const formData = {
    id: "mainBody",
    active: true, 
    activePageOb: {},
    activePage: 3,
    isSubmitted: false,
    includeIntro: false,
    includeOutro: false,
    isAdmin: false,
    pages: [page1 = {
            pageNumber: 0,
            question: "pikachu",
            options: ["interfere1", "interfere2", "interfere3", "interfere4"],
            maxSelectable: 1,
            autoSubmit: true
            },
            {},
            {},
            {},
        ],
    numOfPages: 0,

}

formData.numOfPage = formData.pages.length + 1;


const { pages : [...pages] } = formData;

console.log(pages)




const newForm = {...formData};     //apparently this is how to copy objects/arrays. Assigning just refers to OG.
const tempForm = {...newForm};

const editorStates = {
    loaded: newForm,
    tempVersion: tempForm, //this is the one that gets updated every time.
    activePage: 0,
    
    activePageOb: {},
    question: "iunno",
    options: ["u", "c", "l", "p"],
    autoSubmit: true,
    maxSelectable: 1,

    store: function() {     //do we actually want to clone all these, rather than re-assign? cause less issues myb.
        this.tempVersion.activePage = this.activePage;  //this needs to be handled differently.
        this.activePageOb.question = this.question;
        this.activePageOb.options = this.options;
        this.activePageOb.autoSubmit = this.autoSubmit;
        this.activePageOb.maxSelectable = this.maxSelectable;
        this.tempVersion.pages[this.activePage] = this.activePageOb;
    },
    load: function() {
        this.activePage = this.tempVersion.activePage;
        this.activePageOb = this.tempVersion.pages[this.activePage];
        this.question = this.activePageOb.question;
        this.options = this.activePageOb.options;
        this.autoSubmit = this.activePageOb.autoSubmit;
        this.maxSelectable = this.activePageOb.maxSelectable;
    },
    update: function(index, updatedEntry) {                         //update should fire each time a change is made
        this.tempVersion.pages[this.activePage].options[index] = updatedEntry
        console.log("the new option is" + updatedEntry)
    },
    refresh: function(...options) {
        const qInput = document.getElementById("question-input");           //you need to put "question-input" string as 1st arg when calling 
        qInput.value = this.question;

        const oInputs = document.querySelectorAll(".option-inputs");    //you need to use ...spread when calling 2nd arg
        for (let i = 0 ; i < options.length ; i++) {
            console.log(options.length)
            oInputs[i].value = options[i];
        };
        //this also needs autoSubmit + maxSelectable
    },


    save: function() {                                              //save should replace 'loaded'? .....but why?
        console.log("this saves stuff, lol")
    }
}


       //refresh = visual menu content    load = occupy editorState working memory     update = inputs into editorStates
       //store = oldActive into TempVersion






const newPageTrigger = document.getElementById("page-tab-adder")    //this adds a new page to DATA, but also handles render. maybe separate?
newPageTrigger.addEventListener("click", function() {
    newPageConstructor()
})

activeTab();


function formConstructor() {         // this creates the DATA structure, not the DOM/html content. You read from this.
    const newForm = formData;
    newForm.numOfPages = 4 // < this number will be a variable eventually, which you'll plug in. it'll control how  many pages are gen'd.
    for (let i = 0 ; i < 4 ; i++)
        newForm.pages.push(pageData) // I think this should add a new page[i] object to the pages array. hopefully
        newForm.pages[i].pageNumber = i + 1;
        // newForm.pages[i].options.map(pageConstructor) //this won't work yet, because 'options' is empty; there's nothing to map onto.
        newForm.pages[i].question = "This is a placeholder; answer anything!"
        newForm.pages[i].options = ["Option 1", "Option 2", "Option 3"] //this should be an input at some point
        console.log("formConstructor ran btw")
}
//const activeEditingPage = newForm.pages[newForm.activePage - 1]  //this should grab the active page's object?


function newPageConstructor() {      // this should edit the currently editing form/page/etc
    const newPage = pageData;
    newPage.pageNumber = newForm.pages.length + 1 //this should figure out the number of the page in relation to the others
    newForm.pages.push(newPage);
    //pageButtonUpdater();    Simplifying
    refreshTabs();
    console.log(newForm.pages.length)
}



function refreshTabs() {
    const container = document.getElementById("page-tabs-container");
    childDeleter(container);
    const pages = newForm.pages;
    for (let i = 0 ; i < pages.length ; i++) {
        const tab = document.createElement("div");
        tab.id = `page-tab${i}`;
        tab.classList.add("editor-page-tabs");
        tab.textContent = i + 1;
        container.appendChild(tab);
    }
}

function activeTab() {
    const container = document.getElementById("page-tabs-container");
    container.addEventListener("click", (event) => {
        if (event.target !== event.currentTarget) {
            const string = "active-editor-page-tab"
            const oldActive = document.querySelector(`.${string}`);
            editorStates.store(); //this should store the 'retiring' active page contents into it's object, then into TempVersion
            oldActive ? oldActive.classList.remove(string) : false;
            event.target.classList.add(string);
            editorStates.activePage = parseInt(event.target.textContent) - 1;
        }
    })
}

console.log("carrot" + newForm.activePage)

/*
//relates to the tabs, in that the page contents need to update on click
function optionUpdater(object) {                    //object is the active page
    const updatedOptions = object.options
    for (let i = 0; i < updatedOptions.length ; i++) {   //this transfers stored options into the inputs.
        const newOption = updatedOptions[i]
        const element = document.getElementById(`option-input${i + 1}`)
        element.value = newOption;
    }
} */         //this should just be for refreshing everything, not just the options.


function optionEditor() {          // instead of every keypress, changed to blur. Updates/saves when input loses focus
    const inputs = document.getElementsByClassName("option-inputs")
    for (let i = 0 ; i < inputs.length ; i++) {
        inputs[i].addEventListener("blur", function() {
            let updatedText = "it didn't update properly, lol"
            if (this.value === "") {         // this doesn't account for spaces.
                updatedText = `Option: ${i + 1}`
            } else {
                updatedText = this.value;    // if you declare the input before the reg. function, you can use it with an arrow func.
            }
            editorStates.update(i, updatedText)

            const targetOption = document.getElementById(`option-${i + 1}`);
            targetOption.textContent = updatedText;
            console.log("it did something?");
            console.log(this.value)
        })
    }
}

optionEditor();

function childDeleter(element) {
    let child = element.lastElementChild
    while (child) {
        element.removeChild(child)
        child = element.lastElementChild
    }
}


// i think this should add click function to any objec,t plus any necessary paramters.
function clickHandler(a, b, c, d, e, f, g) {          //i'm imagining, you pass in properties and it does stuff depending.
    const targetElement = this;
    targetElement.addEventListener("click", function() {})
}