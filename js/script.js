let editor;
let pyodide;
const activityFiles = {
    1: "print('Detect unauthorized access')",
    2: "print('Identify email sender')",
    3: "print('Stop DDoS attack')"
};
const installedPackages = JSON.parse(localStorage.getItem('installedPackages')) || {};

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs' } });
require(['vs/editor/editor.main'], async function() {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: '',
        language: 'python',
        theme: 'vs-dark'
    });
    await initializePyodide();
    loadActivity(1); // Load first activity by default
});

// Initialize Pyodide
async function initializePyodide() {
    pyodide = await loadPyodide();
}

async function loadActivity(activityNumber) {
    editor.setValue(activityFiles[activityNumber]);
    document.getElementById('output').textContent = ''; // Clear output
}

async function runCode() {
    const code = editor.getValue();
    try {
        let output = await pyodide.runPythonAsync(code);
        document.getElementById('output').textContent = output;
    } catch (error) {
        document.getElementById('output').textContent = `Error: ${error.message}`;
    }
}

function installPackage(packageName) {
    if (!installedPackages[packageName]) {
        installedPackages[packageName] = true;
        localStorage.setItem('installedPackages', JSON.stringify(installedPackages));
        alert(`${packageName} installed successfully.`);
    } else {
        alert(`${packageName} is already installed.`);
    }
}

function resetIDE() {
    localStorage.clear(); // Clear installed packages
    loadActivity(1); // Reset to activity 1
    alert("IDE reset to default state.");
    document.getElementById('output').textContent = ''; // Clear output
}

  
  