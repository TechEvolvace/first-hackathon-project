// Global variables
let pyodide;
let editor;

// Initialize Monaco Editor
function initMonacoEditor() {
    require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs' }});
    require(['vs/editor/editor.main'], function () {
        editor = monaco.editor.create(document.getElementById('editor-container'), {
            value: '# Type your Python code here\nprint("Hello, World!")',
            language: 'python',
            theme: 'vs-dark',
            automaticLayout: true
        });
    });
}

// Initialize Pyodide and load packages
async function initPyodideAndLoadPackages() {
    pyodide = await loadPyodide();
    console.log("Pyodide loaded with version:", pyodide.version);

    // Redirect Python's stdout and stderr
    pyodide.runPython(`
        import sys
        class ConsoleCapture:
            def __init__(self):
                self.output = []
            
            def write(self, text):
                if text != '\\n':  # Filter out empty lines
                    self.output.append(text)
                    # Use JS function to print to the game's console
                    self.flush()
            
            def flush(self):
                import js
                js.displayOutput("\\n".join(self.output))
                self.output = []
        
        sys.stdout = ConsoleCapture()
        sys.stderr = ConsoleCapture()
    `);

    displayOutput("Pyodide initialized.");
}

// Run Python code
async function runPythonCode() {
    const code = editor.getValue();
    try {
        await pyodide.runPythonAsync(code);
        displayOutput("Code executed successfully.");
    } catch (error) {
        displayOutput(`Error: ${error}`);
    }
}

// Display output in the custom console
function displayOutput(message) {
    const outputEl = document.getElementById("output-container");
    outputEl.innerText += message + "\n";
    outputEl.scrollTop = outputEl.scrollHeight;
}

// Install a Python package
async function installPackage(packageName) {
    try {
        displayOutput(`Installing ${packageName}...`);
        await pyodide.runPythonAsync(`import micropip; await micropip.install('${packageName}')`);
        displayOutput(`Package ${packageName} installed.`);
    } catch (error) {
        displayOutput(`Error installing ${packageName}: ${error}`);
    }
}

// Uninstall a Python package
async function uninstallPackage(packageName) {
    try {
        displayOutput(`Uninstalling ${packageName}...`);
        await pyodide.runPythonAsync(`
            import micropip
            micropip.uninstall('${packageName}')
        `);
        displayOutput(`Package ${packageName} uninstalled.`);
    } catch (error) {
        displayOutput(`Error uninstalling ${packageName}: ${error}`);
    }
}

// Initialize Monaco Editor and Pyodide on page load
window.onload = async function () {
    initMonacoEditor();
    await initPyodideAndLoadPackages();
};