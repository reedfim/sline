document.getElementById('codePanel').innerHTML = '';

var getBtn = document.getElementById('actionGetBtn');
var indentBtn = document.getElementById('actionIndentBtn');

getBtn.addEventListener('click', function(){ 
	chrome.tabs.getSelected(null, function(tab) {
  		chrome.tabs.sendMessage(tab.id, {
				action : 'GET'
			}, function(response) {
				var res = response.res;
				if(res != null){
					getAndShow(res);
				}else{
					alert('여기가 아닌가 봐요~~');
				}
			} 
		);
	});
});

indentBtn.addEventListener('click', function(){ 
	chrome.tabs.getSelected(null, function(tab) {
  		chrome.tabs.sendMessage(tab.id, {
				action : 'INDENT',
				indexArr : getCheckedBox()
			}, function(response) {} 
		);
		
		getBtn.style.display = 'block';
		indentBtn.style.display = 'none';
		document.getElementById('codePanel').innerHTML = '';
	});
});

function getAndShow( res ){
	var panel = document.getElementById('codePanel');
	panel.innerHTML = '';

	var ul = document.createElement('ul');
	for(var i=0, len=res.length; i<len; i++){
		var li = document.createElement('li');
		li.innerHTML = '<div class="alert alert-success"><input type="checkbox" value="'+i+'">'+decodeURIComponent(res[i])+'</div>';
		ul.appendChild(li);
	}

	panel.appendChild(ul);

	getBtn.style.display = 'none';
	indentBtn.style.display = 'block';
}

function getCheckedBox(){
	var retArr = [];
	var inputs = document.querySelectorAll('#codePanel input');
	for(var i=0,len = inputs.length; i<len; i++){
		if(inputs[i].checked){
			retArr.push(true);
		}else{
			retArr.push(false);
		}
	}

	return retArr;
}