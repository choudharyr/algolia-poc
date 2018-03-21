/**
         * This example uses the raw JavaScript client to build an instant search result page.
         * If you plan on building such a UI, we strongly encourage you to try our instantsearch.js library instead.
         * It is a set of UI widgets that you can mix and match to build instant search result pages, including facet filtering,
         * highlighting and custom themes.
         * More information, examples and documentation on https://community.algolia.com/instantsearch.js/
        **/

function searchCallback(err, content) {
    if (err) {
        // error
        return;
    }

    if (content.query !== $('#q').val()) {
        // do not take out-dated answers into account
        return;
    }

    if (content.hits.length === 0) {
        // no results
        $('#hits').empty();
        return;
    }

    // Scan all hits and display them
    var html = '';
    for (var i = 0; i < content.hits.length; ++i) {
        var hit = content.hits[i];
        //console.log(hit);
        html += '<div class="hit" onclick=getDetails("' + hit.objectID + '")>';
        for (var attribute in hit._highlightResult) {
            //console.log("attribute: " + attribute);
            //console.log(hit._highlightResult[attribute]);
            //console.log(hit._highlightResult[attribute].Name);
            html += '<div class="attribute">' +
                '<span>' + attribute + ': </span>' +
                hit._highlightResult[attribute].Name.value;

            if (hit._highlightResult[attribute].BlogPost.title.matchedWords.length > 0) {
                html += ' - <span>Title: </span>' + hit._highlightResult[attribute].BlogPost.title.value;
            }

            var comment = hit._highlightResult[attribute].BlogPost.Comment;
            if (comment.text.matchedWords.length > 0 || comment.username.matchedWords.length > 0 || comment.dateposted.matchedWords.length > 0) {
                html += ' - <span>CommentText: </span>' + hit._highlightResult[attribute].BlogPost.Comment.text.value;
                html += ' - <span>CommentByUser: </span>' + hit._highlightResult[attribute].BlogPost.Comment.username.value;
                html += ' - <span>CommentDate: </span>' + hit._highlightResult[attribute].BlogPost.Comment.dateposted.value;
                html += ' - <span>UnixTime: </span>' + hit.Blog.BlogPost.Comment.DatePostedUnixTimestamp;
            }

            html += '</div>';
        }
        html += '</div>';
    }
    $('#hits').html(html);
}

function addFacetItem(elemId, facetValue) {
    var ul = document.getElementById(elemId); //ul
    var li = document.createElement('li');//li

    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.value = facetValue;

    li.appendChild(checkbox);

    li.appendChild(document.createTextNode(facetValue));
    ul.appendChild(li);
}

function getFacetValues(err, content) {
    if (err == null) {
        var json = content.facets;
        var names = json["Blog.Name"];
        for (var n in names) {
            if (names.hasOwnProperty(n)) {
                var txt = n + " (" + names[n] + ")";
                //addFacetItem("ulEmails", txt);
            }
        }
    }
}

var index;
var $inputfield;
$(document).ready(function () {
    $inputfield = $('#q');

    // Replace the following values by your ApplicationID and ApiKey.
    var client = algoliasearch('ITS0CN36L1', '1abb9727471ce464635a6071b3980302');
    // Replace the following value by the name of the index you want to query.
    index = client.initIndex('Blogs');

    index.search('', { facets: '*', hitsPerPage: 0 }, getFacetValues);

    $inputfield.keyup(function () {
        if ($.trim($inputfield.val()).length > 0) {
            var filter = "";
            if ($("#dt").val()) {
                var unixDt = moment($("#dt").val()).unix();
                filter = "Blog.BlogPost.Comment.DatePostedUnixTimestamp = " + unixDt;
            }
            index.search({
                query: $inputfield.val(),
                facets: ['*'],
                filters: filter
            }, searchCallback);
        }
    }).focus().closest('form').on('submit', function () {
        // on form submit, store the query string in the anchor
        location.replace('#q=' + encodeURIComponent($inputfield.val()));
        return false;
    });

    // check if there is a query in the anchor: http://example.org/#q=my+query
    if (location.hash && location.hash.indexOf('#q=') === 0) {
        console.log(location.hash);
        var q = decodeURIComponent(location.hash.substring(3));
        $inputfield.val(q).trigger('keyup');
    }
});

function getDetails(objectId) {
    index.getObject(objectId, function (err, content) {
        console.log(content);
    });
}

$("#btnSearch").on("click", function () {
    $inputfield.trigger('keyup');
});