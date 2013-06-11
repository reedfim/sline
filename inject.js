function looks_like_html(source) {
	var trimmed = source.replace(/^[ \t\n\r]+/, ''),
		comment_mark = '<' + '!-' + '-';

	return (trimmed && (trimmed.substring(0, 1) === '<' && trimmed.substring(0, 4) !== comment_mark));
}

function beautify(source) {
	if (source == null) return;

	var output;

	var opts = {
		indent_size: 1, //1,2,3,~~
		indent_char: '\t',
		max_preserve_newlines: 2,
		preserve_newlines: true,
		keep_array_indentation: false,
		break_chained_methods: false,
		indent_scripts: 'keep', //normal, separate
		brace_style: 'collapse', //exapnd, end-expand
		space_before_conditional: false,
		unescape_strings: false,
		wrap_line_length: 0, //40,70,80 ~~~
		space_after_anon_function: true
	};

	if (looks_like_html(source)) {
		output = html_beautify(source, opts);

	} else {
		output = js_beautify(source, opts);
	}

	return output;
}
function trimStr( str ) {
	var lre = /\s*((\S+\s*)*)/;
	var rre = /((\s*\S+)*)\s*/;

	return str.replace(lre, "$1").replace(rre, "$1");
}


var wi = {};
wi.backupTag = [];//{newcode}, {code}
wi.sources = null;


function indentTrigger( flagArr ) {
	var textArea = $('#markupTextarea');

	for (var i = 1, j=0, len = wi.sources.length; i < len; i += 2, j++) {
		if(flagArr[j]){
			wi.sources[i] = wi.backupTag[i - 1] + '\n' + trimStr(beautify(wi.sources[i])) + '\n' + wi.backupTag[i];	
		}else{
			wi.sources[i] = wi.backupTag[i - 1] + '\n' + trimStr(wi.sources[i]) + '\n' + wi.backupTag[i];	
		}
	}

	textArea.val(wi.sources.join('')); //결과 반영
	
	//초기화
	wi.sources = null;
	wi.backupTag = [];
}


function extractCodeBlock(){
	var textArea = $('#markupTextarea');

	if (textArea.length >= 1) {
		var markupText = textArea.val(),
			delim = '##removeline##',
			retArr = [];

		wi.sources = markupText.replace(/({\s*(new)?code.*})/gi, function(match, $1, $2) {
			wi.backupTag.push($1);
			return delim;
		}).split(delim);


		if (wi.sources.length % 2 === 1) {
			for (var i = 1, len = wi.sources.length; i < len; i += 2) {
				retArr.push(wi.sources[i].replace(/\t/g,'&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\n/g,'<br>'));
			}

			return retArr;

		} else {
			alert('어디선가 태그가 잘못되었습니다.');
			return null;
		}
	} else {
		alert('편집 모드가 아닙니다.');
		return null;
	}
}

//익스텐션 아이콘을 선택할때마다의 모드 체인지
chrome.runtime && chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		if(request.action === 'GET'){
			sendResponse({
				res : extractCodeBlock()
			});

		}else if(request.action === 'INDENT'){
			var arr = request.indexArr;
			indentTrigger(arr);
		}
	}
);

