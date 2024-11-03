let pyodide;
let editor;
let installedPackages = new Set();

// Load Pyodide and Monaco Editor
async function initialize() {
  pyodide = await loadPyodide();
  require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs" } });
  require(["vs/editor/editor.main"], function () {
    editor = monaco.editor.create(document.getElementById("editor-container"), {
      value: "# Write your Python code here",
      language: "python",
      theme: "vs-dark"
    });
  });
}

// Run Python code and handle output
async function runPythonCode() {
    const code = editor.getValue();
    console.log("Running code:", code); // Log the code being run
    try {
      // Clear previous output
      document.getElementById("output").innerText = "";
      
      // Redirect print statements to output area
      const originalPrint = pyodide.globals.get('print');
      pyodide.globals.set('print', (msg) => {
        const currentOutput = document.getElementById("output").innerText;
        document.getElementById("output").innerText = currentOutput + msg + "\n";
      });
  
      // Execute the code
      await pyodide.runPythonAsync(code);
    } catch (error) {
      console.error("Error running code:", error); // Log the error
      document.getElementById("output").innerText = error;
    } finally {
      // Restore original print function
      pyodide.globals.set('print', originalPrint);
    }
  }
  

// Manage Python packages
async function installPackage(packageName) {
  if (!installedPackages.has(packageName)) {
    await pyodide.loadPackage(packageName);
    installedPackages.add(packageName);
    // Removed the message after installation
  }
}

// Reset the environment
function resetEnvironment() {
  editor.setValue("# Resetting environment...");
  installedPackages.clear();
  document.getElementById("output").innerText = ""; // Clear output on reset
}

// Dialogue system with branching
let dialogues = {
  start: {
    character: "Alexo Wraith",
    text: "Ah, you must be the new agent! I'm Alexo Wraith, nice to meet ya. Have you programmed with Python before?",
    options: [
      { text: "Yes I have.", next: "activity2" },
      { text: "No I haven't", next: "activity1" }
    ]
  },
  activity1: {
    character: "Alexo Wraith",
    text: "No worries, we've all been there. I'll wall you through the basics. We use a custom Interactive Development Environment, or IDE for short, here. It's modeled after Visual Studio Code, so it's user-friently, even if you're a beginner. Let's get started with programming a script to detect anything suspicious lurking in our networks, shall we?",
    options: [{ text: "Continue", next: "activity1_start" }]
  },
  activity1_start: {
    character: "Guide",
    text: "Here is your starter code for detecting unauthorized access.",
    onEnter: () => editor.setValue("# Activity 1 starter code loading... This may take a while."),
    options: [{ text: "Begin", next: null }]
  },
  activity2: {
    character: "Alexo Wraith",
    text: "Good to know you've got some experience. That'll make this a breeze. Let's skip the basics and dive into identifying the sender of this suspicious email we received today.",
    onEnter: () => editor.setValue("# Activity 2 starter code loading... This may take a while."),
    options: [{ text: "Begin", next: null }]
  }
};

let currentDialogue = dialogues.start;

function showDialogue(dialogue) {
  document.getElementById("dialogue-box").style.display = "block";
  document.getElementById("dialogue-character").innerText = dialogue.character;
  document.getElementById("dialogue-text").innerText = dialogue.text;
  const optionsDiv = document.getElementById("dialogue-options");
  optionsDiv.innerHTML = "";
  dialogue.options.forEach(option => {
    const button = document.createElement("button");
    button.innerText = option.text;
    button.onclick = () => {
      currentDialogue = dialogues[option.next];
      if (currentDialogue.onEnter) currentDialogue.onEnter();
      showDialogue(currentDialogue);
    };
    optionsDiv.appendChild(button);
  });
}

// Start dialogue progression
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !currentDialogue.options) {
    currentDialogue = dialogues.start;
    showDialogue(currentDialogue);
  }
});

// Initialize the application and show the starting dialogue
initialize();
showDialogue(currentDialogue);

