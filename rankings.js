function getRank(query, url, tld, start, element) {
	base = "http://www.google.com";
	if(tld != "") { base += "." + tld; }
	queryURL = base + '/search?q=' + _esc(query);
	if(start > 0) { queryURL += "&start=" + start; }
	_IG_FetchContent(queryURL, function(responseText) {
		tmp = document.createElement("div");
		tmp.innerHTML = responseText;
		links = tmp.getElementsByTagName("a");
		pos = start;
		found = false;
		for(i=0; i < links.length; i++) {
			if(links[i].className == "l") {
				pos++;
				if(links[i].href.indexOf(url) != -1) {
					found = true;
					break;
				}
			}
		}

		if(!found & start < 90) {
			getRank(query, url, tld, start + 10, element);
		} else {
			if(tld == "") { tld = "us"; }
			if(!found) { pos = "-"; }
			element.innerHTML += "<tr><td>" + url + "</td><td>" + query + "</td><td>" + pos + '</td><td><img src="http://search-rankings-gadget.googlecode.com/svn/trunk/images/flags/' + tld + '.png" /></td></tr>';
			_IG_AdjustIFrameHeight();
		}
	});
};

getRank("main tur", "maintur.com", "", 0, _gel("results"));
getRank("cruise tur", "cruisetur.com", "", 0, _gel("results"));
getRank("chocolate its", "chocolateits.com", "", 0, _gel("results"));

getRank("main tur", "maintur.com", "tr", 0, _gel("results"));
getRank("cruise tur", "cruisetur.com", "tr", 0, _gel("results"));
getRank("chocolate its", "chocolateits.com", "tr", 0, _gel("results"));