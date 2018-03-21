// Algolia client. Mandatory to instantiate the Helper.
var algolia = algoliasearch('ITS0CN36L1', '1abb9727471ce464635a6071b3980302');

// Algolia Helper
var helper = algoliasearchHelper(algolia, 'Blogs', {
    // Facets need to be explicitly defined here
    facets: ['Blog.Name', 'Blog.BlogPost.email'],
    // Misc. configuration for the demo purpose 
    hitsPerPage: 5,
    maxValuesPerFacet: 5
});

// Bind the result event to a function that will update the results
helper.on("result", searchCallback);

// The different parts of the UI that we want to use in this example
var $hits = $('#hits');
var $facets = $('#facets');

$facets.on('click', handleFacetClick);

// Trigger a first search, so that we have a page with results
// from the start.
helper.search();

// Result event callback
function searchCallback(results) {
    if (results.hits.length === 0) {
        // If there is no result we display a friendly message
        // instead of an empty page.
        $hits.empty().html("No results :(");
        return;
    }

    // Hits/results rendering
    renderHits($hits, results);
    renderFacets($facets, results);
}

function renderHits($hits, results) {
    // Scan all hits and display them
    var hits = results.hits.map(function renderHit(hit) {
        // We rely on the highlighted attributes to know which attribute to display
        // This way our end-user will know where the results come from
        // This is configured in our index settings
        var highlighted = hit._highlightResult;
        var attributes = $.map(highlighted, function renderAttributes(attribute, name) {
            console.log(attribute);

            /*
             

             <div class="hit" onclick="getDetails(&quot;3813222&quot;)"><div class="attribute"><span>Blog: </span><em>C</em>onsumerSales - <span>Title: </span>Rapdudor  <em>C</em>ompany - <span>CommentText: </span>efficitur nec. nibh. <em>c</em>onsequat odio

Nam et - <span>CommentByUser: </span>dougcatcher - <span>CommentDate: </span>2017-02-14T17:16:55.78 - <span>UnixTime: </span>1487010600</div></div>

             */
            var html = '<div class="attribute">' +
                '<span>' + name + ': </span>' +
                attribute.Name.value;

            if (attribute.BlogPost.title.matchedWords.length > 0) {
                html += ' - <span>Title: </span>' + attribute.BlogPost.title.value;
            }

            var comment = attribute.BlogPost.Comment;
            if (comment.text.matchedWords.length > 0 || comment.username.matchedWords.length > 0 || comment.dateposted.matchedWords.length > 0) {
                html += ' - <span>CommentText: </span>' + attribute.BlogPost.Comment.text.value;
                html += ' - <span>CommentByUser: </span>' + attribute.BlogPost.Comment.username.value;
                html += ' - <span>CommentDate: </span>' + attribute.BlogPost.Comment.dateposted.value;
                html += ' - <span>UnixTime: </span>' + hit.Blog.BlogPost.Comment.DatePostedUnixTimestamp;
            }

            html += '</div>';

            return html;
        }).join('');
        return '<div class="hit panel" onclick=getDetails("' + hit.objectID + '")>' + attributes + '</div>';
    });
    $hits.html(hits);
}

function renderFacets($facets, results) {
    var facets = results.facets.map(function (facet) {
        var name = facet.name;
        var header = '<h4>' + name + '</h4>';
        var facetValues = results.getFacetValues(name);
        var facetsValuesList = $.map(facetValues, function (facetValue) {
            var facetValueClass = facetValue.isRefined ? 'refined' : '';
            var valueAndCount = '<a data-attribute="' + name + '" data-value="' + facetValue.name + '" href="#">' + facetValue.name + ' (' + facetValue.count + ')' + '</a>';
            return '<li class="' + facetValueClass + '">' + valueAndCount + '</li>';
        })
        return header + '<ul>' + facetsValuesList.join('') + '</ul>';
    });

    $facets.html(facets.join(''));
}

function handleFacetClick(e) {
    e.preventDefault();
    var target = e.target;
    var attribute = target.dataset.attribute;
    var value = target.dataset.value;
    if (!attribute || !value) return;
    helper.toggleRefine(attribute, value).search();
}