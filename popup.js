document.getElementById('actionIndentBtn').addEventListener('click', function(){ 
	chrome.tabs.getSelected(null, function(tab) {
  		chrome.tabs.sendMessage(tab.id, {
				action : true
			}, function(response) {} //이 코드 부분에서는 상위의 sendResponse가 반응하지 않는다.
		);
	});
});