var FAQ = (function () {

    /**
     * Run
     * Runs the script.
     */
    var initialize = function(callback) {
        API.getData('1vbYagCkfotuqbpvBr_skmw7Sz43UoprmEiXKatTMp0E', function(FAQEntries){
            var FAQList = $('#faq-list');
            for(var i = 0; i < FAQEntries.length; i++) {
                if(true/*FAQEntries[i].status === 'Published'*/){
                    FAQList.append('\
                    <article class="faq-entry" id="'+FAQEntries[i].id+'" data-tags="'+FAQEntries[i].tags+'">\
                        <h2 class="faq-entry--question">'+markdown.toHTML(FAQEntries[i].question)+'</h2>\
                        <section class="faq-entry--answer">'+markdown.toHTML(FAQEntries[i].answer)+'</section>\
                    </article>');
                }
            }
            callback();
        });

    };

    var API = (function() {
        var _getData = function(documentId, callback){
            "use strict";
            var requestURL = 'https://spreadsheets.google.com/feeds/list/'+documentId+'/od6/public/full?hl=en_US&alt=json';
            $.getJSON(requestURL, function(data){
                console.table(_formatData(data));
                callback(_formatData(data));
            });
        };

        var _formatData = function(data){
            var FAQEntries = [];
            for(var i = 0; i < data.feed.entry.length; i++){
                FAQEntries.push({
                    id: data.feed.entry[i].id.$t.substring(data.feed.entry[i].id.$t.lastIndexOf("/") + 1),
                    status: data.feed.entry[i].gsx$status.$t,
                    question: data.feed.entry[i].gsx$question.$t,
                    answer: data.feed.entry[i].gsx$answer.$t,
                    tags: data.feed.entry[i].gsx$tags.$t
                });
            }
            return FAQEntries;
        };

        // Make the functions public
        return {
            getData: _getData
        };
    })();

    // Make the functions public
    return {
        initialize: initialize,
        init: initialize
    };
})();
var FAQList = "";
$(document).ready(function(){
    FAQ.initialize(function(){
        var options = {
            item: '<article class="faq-entry"><h2 class="faq-entry--question"></h2><section class="faq-entry--answer"></section></article>',
            valueNames: ['faq-entry--question', 'faq-entry'],
            plugins: [ListFuzzySearch()],
            searchClass: 'search'
        };
        FAQList = new List('main', options);
    });

});