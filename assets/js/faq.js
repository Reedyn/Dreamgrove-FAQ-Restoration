var FAQ = (function () {
    /**
     * Run
     * Runs the script.
     */
    var initialize = function(callback) {
        API.getData(function(FAQEntries){
            var FAQList = $('#faq-list');
            for(var i = 0; i < FAQEntries.length; i++) {
                if(true/*FAQEntries[i].status === 'Published'*/){
                    FAQList.append('\
                    <article class="faq-entry" id="'+FAQEntries[i].id+'">\
                        <span class="faq-entry--tags" style="display: none;" data-tags="'+FAQEntries[i].tags+'"></span>\
                        <h2 class="faq-entry--question">'+FAQEntries[i].question+'</h2>\
                        <section class="faq-entry--answer">'+FAQEntries[i].answer+'</section>\
                    </article>');
                }
            }
            callback();
        });
    };

    var API = (function() {
        var documentId = '1vbYagCkfotuqbpvBr_skmw7Sz43UoprmEiXKatTMp0E';
        var getData = function(callback){
            "use strict";
            var sheetID = 'od6';
            var requestURL = 'https://spreadsheets.google.com/feeds/list/'+documentId+'/'+sheetID+'/public/full?hl=en_US&alt=json';
            $.getJSON(requestURL, function(data){
                _formatData(data, callback);
            });
        };

        var _getWoWHeadLinks = function(callback){
            var sheetID = 'o8v3ew1';
            var requestURL = 'https://spreadsheets.google.com/feeds/list/'+documentId+'/'+sheetID+'/public/full?hl=en_US&alt=json';
            $.getJSON(requestURL, function(data){
                var WoWHeadLinks = [];
                for(var i = 0; i < data.feed.entry.length; i++){
                    WoWHeadLinks.push({
                        linkify: data.feed.entry[i].gsx$linkify.$t,
                        url: data.feed.entry[i].gsx$wowheadlink.$t
                    });
                }
                callback(WoWHeadLinks);
            });
        };

        var _formatData = function(data, callback){
            var FAQEntries = [];

            _getWoWHeadLinks(function(WoWHeadLinks) {
                var converter = new showdown.Converter();
                converter.setOption('omitExtraWLInCodeBlocks', 'true');
                converter.setOption('prefixHeaderId', 'true');
                converter.setOption('simplifiedAutoLink', 'true');
                converter.setOption('excludeTrailingPunctuationFromURLs', 'true');
                converter.setOption('literalMidWordUnderscores', 'true');
                converter.setOption('strikethrough', 'true');
                converter.setOption('tables', 'true');
                converter.setOption('ghCodeBlocks', 'true');

                for(var i = 0; i < data.feed.entry.length; i++){
                    var answer = data.feed.entry[i].gsx$answer.$t;
                    for(var w = 0; w < WoWHeadLinks.length; w++){
                        answer = answer.split('['+WoWHeadLinks[w].linkify+']').join('['+WoWHeadLinks[w].linkify+']('+WoWHeadLinks[w].url+')')
                    }
                    var entry = {
                        id: data.feed.entry[i].id.$t.substring(data.feed.entry[i].id.$t.lastIndexOf("/") + 1),
                        status: data.feed.entry[i].gsx$status.$t,
                        question: converter.makeHtml(data.feed.entry[i].gsx$question.$t),
                        answer: converter.makeHtml(answer),
                        tags: data.feed.entry[i].gsx$tags.$t
                    };
                    FAQEntries.push(entry);
                }
                callback(FAQEntries);
            });
        };



        // Make the functions public
        return {
            getData: getData,
        };
    })();

    // Make the functions public
    return {
        initialize: initialize,
        init: initialize
    };
})();
$.holdReady(true);
FAQ.initialize(function(){
    $.holdReady(false);
    var options = {
        item: '<article class="faq-entry"><h2 class="faq-entry--question"></h2><section class="faq-entry--answer"></section></article>',
        valueNames: ['faq-entry--question', 'faq-entry', {name: 'faq-entry--tags', attr: 'data-tags'}],
        plugins: [ListFuzzySearch()],
        searchClass: 'search',
    };
    FAQList = new List('body', options);
});

$(document).ready(function(){
    $('.faq-entry--question').click(function(){
        $(this).parent().toggleClass('active');
    })
});
var FAQList = "";