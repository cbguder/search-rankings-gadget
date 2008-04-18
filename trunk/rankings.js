var prefs = new _IG_Prefs();

function getRank(query, url, tld, start, urlindex, keywordindex) {
	queryURL = 'http://' + tld + '/search?q=' + _esc(query);
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
			_gel(urlindex + '_' + keywordindex + '_' + image_name(tld)).appendChild(document.createTextNode(pos));
		}
	});
}

function init() {
	tlds = ["us", "tr"];
	results = _gel('results');
	terms = prefs.getArray("terms");
	tlds = prefs.getArray("google_domains");

	for(k = 0; k < tlds.length; k++) {
		for(i = 0; i < terms.length; i++) {
			parts = terms[i].split(":");
			url = parts[0];
			keywords = parts[1].split(",");
			for(j = 0; j < keywords.length; j++) {
				row = document.createElement("tr");
				cell = document.createElement("td");
				cell.appendChild(document.createTextNode(url));
				row.appendChild(cell);
				
				cell = document.createElement("td");
				cell.appendChild(document.createTextNode(keywords[j]));
				row.appendChild(cell);
				
				cell = document.createElement("td");
				cell.setAttribute('id', i + '_' + j + '_' + image_name(tlds[k]));
				cell.className = "centered";
				row.appendChild(cell);
				
				cell = document.createElement("td");
				cell.className = "centered";
				img = document.createElement("img");
				img.setAttribute('src', 'http://search-rankings-gadget.googlecode.com/svn/trunk/images/flags/' + image_name(tlds[k]) + '.png');
				cell.appendChild(img);
				row.appendChild(cell);
				
				results.appendChild(row);
				
				getRank(keywords[j], url, tlds[k], 0, i, j);
			}
		}
	}
	_IG_AdjustIFrameHeight();
}

function image_name(tld) {
	i = tld.indexOf("google.co");
	if(i = -1) { return "us"; }
	r = tld.substring(i, tld.length - 1);
	if(r[0] == "m") { return r.substring(2, r.length - 1); }
	else { return r.substring(1, r.length - 1); }
}

_IG_RegisterOnloadHandler(init);