// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    function replacer(textEditor, range, new_string) {
        if ( new_string ) {
            new_string = new_string.replace(/\n$/, "");
            textEditor.edit((editBuilder) => {
                editBuilder.replace(range, new_string);
            });
        }
    }

    function oniker(name, option){
        
        function get_onik_string_inner(textEditor, flags) {
            
            function exec_onik_script(command_str){
                const { execSync } = require('child_process');
                try {
                    return execSync(command_str).toString();
                } catch (error) {
                    vscode.window.showInformationMessage('!Error run onik_run.py!');
                }
            }

            var new_string;

            let text;
            const document = textEditor.document;
            let start;
            let end;
            let wordAtCursorRange;
            // если есть выделение
            if (! textEditor.selection.isEmpty) {
                let selection = textEditor.selection;
                text = textEditor.document.getText(selection);
                start = selection.start;
                end = selection.end;
            }
            // Если нет выделения
            else {
                // цифры только в выделенном фрагменте
                if (flags == '-t=open'){
                    return;
                }
                
                const cursor_position = textEditor.selection.active;
                wordAtCursorRange = document.getWordRangeAtPosition(cursor_position);
                
                // Для слова под курсором
                if ( 
                    flags == '--new_oxia' ||
                    flags == '--ch_acute' || 
                    flags == '--move_acute_end' ||
                    flags == '--move_acute_backward' ||
                    flags == '--move_acute_forward' ||
                    flags == '--chlett_at_start' ||
                    flags == '--chlett_at_end_e' ||
                    flags == '--chlett_at_end_o' ||
                    flags == '--chlett_e' ||
                    flags == '--chlett_i' ||
                    flags == '--chlett_i_pluralis'
                ) {
                    text = textEditor.document.getText(wordAtCursorRange);
                    start = wordAtCursorRange.start;
                    end = wordAtCursorRange.end;
                }
                // для всего текста
                else{
                    text = textEditor.document.getText();
                    const lastLine = document.lineAt(document.lineCount - 1);
                    start = new vscode.Position(0, 0);
                    end = new vscode.Position(document.lineCount - 1, lastLine.text.length);  
                };
            };
    
            const range = new vscode.Range(start, end);
    
            let param;
            param = flags + ' \'' + text + '\''; 
            
            // vscode.window.showInformationMessage(param);
            let command = "onik_run.py " + param;
            
            new_string =  exec_onik_script(command);

            var out = {};
    
            if ( new_string ) {
                out.text = new_string;
                out.range = range;
                return out;
            }    
    
        }

        function replacer_inner(textEditor, range, new_string) {
            if ( new_string ) {
                new_string = new_string.replace(/\n$/, "");
                textEditor.edit((editBuilder) => {
                    editBuilder.replace(range, new_string);
                });
            }
        }
    

        let full_name = 'vs-onik.'+name
        vscode.commands.registerTextEditorCommand(full_name, (textEditor) => {
            let onik_obj    = get_onik_string_inner(textEditor, option);
            if (onik_obj){
                let new_string  = onik_obj.text;
                let range       = onik_obj.range;
                replacer_inner(textEditor, range, new_string);
            };    
        });
    };

    
    let dig_to_l = oniker('onik_digits', '--digits_to_letters');
    let l_to_dig = oniker('onik_let2dig', '--digits_from_letters');

    let chl_start = oniker('chl_start', '--chlett_at_start');
    let chl_end_o = oniker('chl_end_o', '--chlett_at_end_o');
    let chl_end_e = oniker('chl_end_e', '--chlett_at_end_e');
    let chl_e = oniker('chl_e', '--chlett_e');
    let chl_i = oniker('chl_i', '--chlett_i');
    let chl_i_plur = oniker('chl_i_plur', '--chlett_i_pluralis');

    let titles_off = oniker('onik', '-t=off');
    let titles_on = oniker('onik_titled', '-t=on');
    let titles_open = oniker('onik_titles_open', '-t=open');

    let ch_acute = oniker('ch_acute', '--ch_acute')
    let mac_left = oniker('mac_left', '--move_acute_backward');
    let mac_right = oniker('mac_right', '--move_acute_forward');
    let mac_end = oniker('mac_end', '--move_acute_end');
    let new_oxia = oniker('new_oxia', '--new_oxia');

    let csl_to_ru = oniker('csl_to_ru', '--csl_to_russian');
    
    let ki = vscode.commands.registerTextEditorCommand('vs-onik.ki', (textEditor) => {
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

    context.subscriptions.push(ki);

    context.subscriptions.push(titles_off);
    context.subscriptions.push(titles_on);
    context.subscriptions.push(titles_open);

    context.subscriptions.push(dig_to_l);
    context.subscriptions.push(l_to_dig);

    context.subscriptions.push(chl_start);
    context.subscriptions.push(chl_end_o);
    context.subscriptions.push(chl_end_e);
    context.subscriptions.push(chl_e);
    context.subscriptions.push(chl_i);
    context.subscriptions.push(chl_i_plur);

    context.subscriptions.push(ch_acute);
    context.subscriptions.push(mac_left);
    context.subscriptions.push(mac_right);
    context.subscriptions.push(mac_end);
    context.subscriptions.push(new_oxia);

    context.subscriptions.push(csl_to_ru);

    context.subscriptions.push();
    context.subscriptions.push();
    context.subscriptions.push();
    context.subscriptions.push();
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;