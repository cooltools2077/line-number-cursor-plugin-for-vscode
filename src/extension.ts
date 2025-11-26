import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Line Number Cursor Plugin is now active!');

    let lastClickTime = 0;
    let lastClickLine = -1;
    let clickCount = 0;

    // Dispose the previous listener if it exists (though activate is called once)
    // We'll register a selection change listener
    const disposable = vscode.window.onDidChangeTextEditorSelection((e) => {
        if (e.kind !== vscode.TextEditorSelectionChangeKind.Mouse) {
            return;
        }

        const selection = e.selections[0];
        if (e.selections.length > 1) {
            // Multi-cursor, ignore or reset
            clickCount = 0;
            return;
        }

        // Check if it looks like a line selection (gutter click)
        // A gutter click usually selects the entire line: start char 0 to next line start char 0
        const isLineSelection = selection.start.character === 0 &&
            selection.end.character === 0 &&
            selection.end.line === selection.start.line + 1;

        if (!isLineSelection) {
            // If the user clicked somewhere else in the text, reset
            // But wait, if we just moved the cursor to start (Action 1), the next event will be a simple cursor placement.
            // But this event handler is for the *trigger*.
            // If the user clicks the gutter, we get isLineSelection = true.
            // If we then move the cursor programmatically, that's NOT a Mouse event (usually Command or undefined), 
            // but even if it was, we filter by Kind.Mouse.
            // So we only care about Mouse interactions.

            // However, if the user clicks inside the text, that's also a Mouse event.
            // We should reset if it's not a line selection.
            // clickCount = 0; 
            // Actually, we should be careful. 
            return;
        }

        const currentLine = selection.start.line;
        const currentTime = Date.now();

        // Check if this is a consecutive click on the same line
        if (currentLine === lastClickLine && (currentTime - lastClickTime) < 500) {
            clickCount++;
        } else {
            clickCount = 1;
        }

        lastClickLine = currentLine;
        lastClickTime = currentTime;

        const editor = e.textEditor;
        const doc = editor.document;

        if (clickCount === 1) {
            // 1. First click: Place cursor on the first of the line
            // We need to override the selection.
            const newSelection = new vscode.Selection(currentLine, 0, currentLine, 0);
            editor.selection = newSelection;
            // Note: Setting editor.selection triggers onDidChangeTextEditorSelection again, 
            // but with kind != Mouse (usually), so we won't loop.
        } else if (clickCount === 2) {
            // 2. Double click: Select whole line text
            // The default gutter click ALREADY did this (isLineSelection is true).
            // So we just ensure it stays that way.
            // However, if we previously changed it to a single point in step 1, 
            // the user's second click on the gutter will trigger another "Select Line" event from VS Code.
            // So we are currently in "Select Line" state.
            // We just let it be.

            // Wait, if we moved cursor to 0,0 in step 1.
            // User clicks gutter again. VS Code selects line 0.
            // We detect isLineSelection = true. clickCount becomes 2.
            // We do nothing, effectively leaving the whole line selected.

            // BUT, we might want to ensure it is *exactly* the whole line including newline?
            // "Select whole line text".
            // VS Code default selects including the newline (to next line start).
            // If "text" implies excluding newline, we might need to adjust.
            // Usually "Select whole line" implies what VS Code does. I'll stick to default for now.
        } else if (clickCount === 3) {
            // 3. Triple click: Move cursor to the end of the line
            const line = doc.lineAt(currentLine);
            const endPos = line.range.end;
            const newSelection = new vscode.Selection(endPos, endPos);
            editor.selection = newSelection;

            // Reset click count? Or allow quadruple click?
            // Usually triple click is the end of the chain.
            clickCount = 0;
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
