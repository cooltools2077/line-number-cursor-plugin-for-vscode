import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Line Number Cursor Plugin is now active!');

    let lastClickTime = 0;
    let lastClickLine = -1;
    let clickCount = 0;

    const disposable = vscode.window.onDidChangeTextEditorSelection((e) => {
        if (e.kind !== vscode.TextEditorSelectionChangeKind.Mouse) {
            return;
        }

        const selection = e.selections[0];
        if (e.selections.length > 1) {
            clickCount = 0;
            return;
        }

        const isLineSelection = selection.start.character === 0 &&
            selection.end.character === 0 &&
            selection.end.line === selection.start.line + 1;

        if (!isLineSelection) {
            return;
        }

        const currentLine = selection.start.line;
        const currentTime = Date.now();

        if (currentLine === lastClickLine && (currentTime - lastClickTime) < 5000) {
            clickCount++;
        } else {
            clickCount = 1;
        }

        lastClickLine = currentLine;
        lastClickTime = currentTime;

        const editor = e.textEditor;
        const doc = editor.document;

        if (clickCount === 1) {
            const newSelection = new vscode.Selection(currentLine, 0, currentLine, 0);
            editor.selection = newSelection;
        } else if (clickCount === 2) {
            const line = doc.lineAt(currentLine);
            const endPos = line.range.end;
            const newSelection = new vscode.Selection(endPos, endPos);
            editor.selection = newSelection;
        } else if (clickCount === 3) {
            const line = doc.lineAt(currentLine);
            const endPos = line.range.end;
            const newSelection = new vscode.Selection(currentLine, 0, currentLine, endPos.character);
            editor.selection = newSelection;
        } else if (clickCount >= 4) {
            clickCount = 0;
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
