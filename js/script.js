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
    text: "Do you have experience with Python?",
    options: [
      { text: "Yes", next: "activity2" },
      { text: "No", next: "activity1" }
    ]
  },
  activity1: {
    character: "Alexo Wraith",
    text: "Let’s start with identifying unauthorized access.",
    options: [{ text: "Continue", next: "activity1_start" }]
  },
  activity1_start: {
    character: "Guide",
    text: "Here is your starter code for detecting unauthorized access.",
    onEnter: () => editor.setValue("# Activity 1 starter code...\nprint('Unauthorized access detected!')"),
    options: [{ text: "Begin", next: null }]
  },
  activity2: {
    character: "Alexo Wraith",
    text: "Let's look for the sender of the email.",
    onEnter: () => editor.setValue("# Activity 2 starter code...\nprint('Identifying email sender...')"),
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

