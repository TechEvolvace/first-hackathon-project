let pyodide;
let editor;

// Initialize Pyodide for Python execution
async function loadPyodideAndPackages() {
    pyodide = await loadPyodide();
    console.log("Pyodide loaded.");
}

// Load Monaco Editor
require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs' }});
require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: '# Write your Python code here...',
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true
    });
    console.log("Monaco Editor initialized.");
});

// Function to run Python code from the editor
async function runPythonCode() {
    const code = editor.getValue(); // Get code from the editor
    const outputElement = document.getElementById('output');

    try {
        const result = await pyodide.runPythonAsync(code);
        outputElement.innerText = result;
        outputElement.style.color = 'black'; // Success message color
    } catch (error) {
        outputElement.innerText = `Error: ${error.message}`;
        outputElement.style.color = 'red'; // Error message color
        console.error("Execution error:", error);
    }
}

// Add event listener to "Run Code" button
document.getElementById('runCodeBtn').addEventListener('click', runPythonCode);

// Package installation simulation
const installedPackages = {};

async function installPackage(packageName) {
    const outputElement = document.getElementById('output');

    if (installedPackages[packageName]) {
        outputElement.innerText = `${packageName} is already installed.`;
        outputElement.style.color = 'blue';
        return;
    }

    try {
        await pyodide.loadPackage(packageName); // Load the package in Pyodide
        installedPackages[packageName] = true; // Mark package as installed
        outputElement.innerText = `${packageName} installed successfully.`;
        outputElement.style.color = 'green';

        // Update the button to show installed status
        document.querySelector(`[data-package="${packageName}"]`).innerText = "Installed";
    } catch (error) {
        outputElement.innerText = `Failed to install ${packageName}: ${error.message}`;
        outputElement.style.color = 'red';
        console.error("Installation error:", error);
    }
}

// Add event listeners to package install buttons
document.querySelectorAll('.install-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const packageName = event.target.getAttribute('data-package');
        installPackage(packageName);
    });
});

// Initialize Pyodide after loading
loadPyodideAndPackages();

