// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    function get_onik_string(textEditor, titles='off', digits='', chletter='', chacute='') {
        let new_string;
                
        let text;
        const document = textEditor.document;
        let start;
        let end;
        let wordAtCursorRange;
        if (! textEditor.selection.isEmpty) {
            let selection = textEditor.selection;
            text = textEditor.document.getText(selection);
            start = selection.start;
            end = selection.end;
        }
        else {
            // цифры только в выделенном фрагменте
            // if (digits || titles == 'open'){
            if (titles == 'open'){
                return;
            }
            
            const cursor_position = textEditor.selection.active;
            wordAtCursorRange = document.getWordRangeAtPosition(cursor_position);
            
            if ( chacute || chletter) {
                text = textEditor.document.getText(wordAtCursorRange);
                start = wordAtCursorRange.start;
                end = wordAtCursorRange.end;
            }
            else{
                text = textEditor.document.getText();
                const lastLine = document.lineAt(document.lineCount - 1);
                start = new vscode.Position(0, 0);
                end = new vscode.Position(document.lineCount - 1, lastLine.text.length);  
            }
        }

        const range = new vscode.Range(start, end);

        const { execSync } = require('child_process');
        let param;
        if (titles) {
            param = ' -t ' + '\'' + titles + '\'';
        }
        if (digits) {
            param = (digits == 'to_letters') ? ' -l ' : ' -L' ;
        }
        if  (chletter) {
            param =  '\'' + chletter + '\'';
        }
        if (chacute) {
            param = '\'' + chacute + '\'';
        }

        param = param + ' \'' + text + '\'' 
        
        // vscode.window.showInformationMessage(param);
        // new_string = execSync('"$HOME/opt/scripts/py/OOnik/onik_run.py" ' + param).toString();
        new_string = execSync('"onik_run.py" ' + param).toString();
        // vscode.window.showInformationMessage(new_string);

        var out = {};

        if ( new_string ) {
            out.text = new_string;
            out.range = range;
            return out;
        }    

    }

    function replacer(textEditor, range, new_string) {
        if ( new_string ) {
            new_string = new_string.replace(/\n$/, "");
            //vscode.window.showInformationMessage(new_string);
            textEditor.edit((editBuilder) => {
                editBuilder.replace(range, new_string);
            });
        }
    }

    let ch_acute = vscode.commands.registerTextEditorCommand('extension.ch_acute', (textEditor) => {
        let onik_obj    = get_onik_string(textEditor, '', '', '', '--ch_acute');
        if (onik_obj){
            let new_string  = onik_obj.text;
            let range       = onik_obj.range;
            replacer(textEditor, range, new_string);
        }    
    });

    
    let chl_start = vscode.commands.registerTextEditorCommand('extension.chl_start', (textEditor) => {
        let onik_obj    = get_onik_string(textEditor, '', '', '--chlett_at_start');
        if (onik_obj){
            let new_string  = onik_obj.text;
            let range       = onik_obj.range;
            replacer(textEditor, range, new_string);
        }    
    });

    let chl_end_o = vscode.commands.registerTextEditorCommand('extension.chl_end_o', (textEditor) => {
        let onik_obj    = get_onik_string(textEditor, '', '', '--chlett_at_end_o');
        if (onik_obj){
            let new_string  = onik_obj.text;
            let range       = onik_obj.range;
            replacer(textEditor, range, new_string);
        }    
    });
    let chl_end_e = vscode.commands.registerTextEditorCommand('extension.chl_end_e', (textEditor) => {
        let onik_obj    = get_onik_string(textEditor, '', '', '--chlett_at_end_e');
        if (onik_obj){
            let new_string  = onik_obj.text;
            let range       = onik_obj.range;
            replacer(textEditor, range, new_string);
        }    
        
    });

    let titles_off = vscode.commands.registerTextEditorCommand('extension.onik', (textEditor) => {
        let onik_obj    = get_onik_string(textEditor, 'off');
        if (onik_obj){
            let new_string  = onik_obj.text;
            let range       = onik_obj.range;
            replacer(textEditor, range, new_string);
        }    
        
    });

    let titles_on = vscode.commands.registerTextEditorCommand('extension.onik_titled', (textEditor) => {

        let onik_obj    = get_onik_string(textEditor, 'on');
        if (onik_obj){
            let new_string  = onik_obj.text;
            let range       = onik_obj.range;
            replacer(textEditor, range, new_string);
        }    

    });

    let titles_open = vscode.commands.registerTextEditorCommand('extension.onik_titles_open', (textEditor) => {

        let onik_obj    = get_onik_string(textEditor, 'open');
        if (onik_obj){
            let new_string  = onik_obj.text;
            let range       = onik_obj.range;
            replacer(textEditor, range, new_string);
        }    
    });

    let digits = vscode.commands.registerTextEditorCommand('extension.onik_digits', (textEditor) => {

        let onik_obj    = get_onik_string(textEditor, '', 'to_letters');
        if (onik_obj){
            let new_string  = onik_obj.text;
            let range       = onik_obj.range;
            replacer(textEditor, range, new_string);
        }    
    });


    let ki = vscode.commands.registerTextEditorCommand('extension.ki', (textEditor) => {
        let new_string;
                
        let text;
        // const document = textEditor.document;
        let start;
        let end;
        if (! textEditor.selection.isEmpty) {
            let selection = textEditor.selection;
            text = textEditor.document.getText(selection);
            start = selection.start;
            end = selection.end;
        }
        else {
            return;
        } 
        const range = new vscode.Range(start, end);
        new_string = "\\Ki{" + text + "}"
        
        replacer(textEditor, range, new_string);

    });


    context.subscriptions.push(titles_off);
    context.subscriptions.push(titles_on);
    context.subscriptions.push(titles_open);
    context.subscriptions.push(digits);
    context.subscriptions.push(ki);
    context.subscriptions.push(chl_start);
    context.subscriptions.push(chl_end_o);
    context.subscriptions.push(chl_end_e);
    context.subscriptions.push(ch_acute);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;