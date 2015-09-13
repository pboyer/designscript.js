var mark = function(n){
	var s = n.parserState;
	return cm.doc.markText(
		{ line: s.firstLine-1, ch : s.firstCol}, 
		{ line : s.lastLine-1, ch : s.lastCol}, 
		{ className : "highlight", readOnly : true});
};

var cont, marking;

function print(x){
	console.log(x);
}

function update(x){
	console.log(x);
}

var step = function(n, e, s, c){
	marking = mark(n);
	print(n);
	update(e);
	
	cont = function(){ 
		if (!running) {
			return; 
		}
		marking.clear();
		c();
	};
	
	if (!running) return;

	setTimeout(cont, 1000);
};

var ta = document.getElementById('codeInput');
var cm = CodeMirror.fromTextArea( ta, {
        matchBrackets: true,
        mode: "text/x-designscript"
      });

var runButton = document.getElementById('run'); 
var pauseButton = document.getElementById('pause'); 
var resetButton = document.getElementById('reset'); 

var interpreter, running = false;

runButton.disabled = false;
pauseButton.disabled = true;
resetButton.disabled = true;
	
runButton.addEventListener("click", function(){
	
	if (!running && interpreter){
		running = true;
		cont();
	} else {
		running = true;	
		interpreter = new designscript.Interpreter(step);
		interpreter.run( designscript.Parser.parse(cm.getValue()));
	}
	
	runButton.disabled = true;
	pauseButton.disabled = false;
	resetButton.disabled = false;
});

pauseButton.addEventListener("click", function(){
	running = false;
	
	runButton.disabled = false;
	pauseButton.disabled = true;
	resetButton.disabled = false;
});

resetButton.addEventListener("click", function(){
	interpreter = null;
	running = false;
	
	marking.clear();
	
	runButton.disabled = false;
	pauseButton.disabled = true;
	resetButton.disabled = true;
});
