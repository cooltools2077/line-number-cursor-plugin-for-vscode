# Line Number Cursor Plugin

Enhance your coding workflow with intuitive line number interactions. This VS Code extension customizes cursor behavior when clicking on line numbers, making navigation and selection faster and more efficient.

## Features

Interact directly with the gutter (line numbers) to perform common cursor actions:

*   **Single Click**: Places the cursor at the **start** of the line (first non-whitespace character).
*   **Double Click**: Moves the cursor to the **end** of the line.
*   **Triple Click**: Selects the **entire line** without last line break.
*   **Quadruple Click**: Selects the **entire line** with last line break.

## Requirements

VS Code version 1.90.0 or higher.

## Extension Settings

Currently, this extension does not contribute any settings.

## Known Issues

None.

## Release Notes

### 0.0.1

Initial release of Line Number Cursor Plugin.


## SELF BUILD GUIDES

1. Package the Extension: Use the following command in your terminal: npx vsce package

2. Install the VSIX File in VS Code: In VS Code, go to the Extensions view, click the More Actions (...) menu, and select Install from VSIX... Choose the .vsix file you just built.
