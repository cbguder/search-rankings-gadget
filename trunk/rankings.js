var prefs = new _IG_Prefs();
var results = _gel('results');

function getRank(query, url, tld, start, element, urlindex, keywordindex) {
	base = "http://www.google.com";
	if(tld != "us") { base += "." + tld; }
	queryURL = base + '/search?q=' + _esc(query);
	if(start > 0) { queryURL += "&start=" + start; }
	_IG_FetchContent(queryURL, function(responseText) {
		tmp = document.createElement("div");
		tmp.innerHTML = responseText;
		links = tmp.getElementsByTagName("a");
		pos = start;
		found = false;
		for(i = 0; i < links.length; i++) {
			if(links[i].className == "l") {
				pos++;
				if(links[i].href.indexOf(url) != -1) {
					found = true;
					break;
				}
			}
		}

		if(!found & start < 90) {
			getRank(query, url, tld, start + 10, urlindex, keywordindex);
		} else {
			if(!found) { pos = "-"; }
			_gel(urlindex + '_' + keywordindex + '_' + tld).innerHTML = pos;
		}
	});
}

function init() {
	tlds = ["us", "tr"];
	terms = prefs.getArray("terms");
	for(i = 0; i < terms.length; i++) {
		parts = terms[i].split(":");
		url = parts[0];
		keywords = parts[1].split(",");
		for(j = 0; j < keywords.length; j++) {
			for(k = 0; k < tlds.length; k++) {
				results.innerHTML += "<tr><td>" + url + "</td><td>" + keywords[j] + '</td><td><span id="' + i + '_' + j + '_' + tld+ '"></span></td><td><img src="http://search-rankings-gadget.googlecode.com/svn/trunk/images/flags/' + tlds[k] + '.png" /></td></tr>';				
				getRank(keywords[j], url, tlds[k], 0, i, j);
			}
		}
	}
	_IG_AdjustIFrameHeight();
}

_IG_RegisterOnloadHandler(init);