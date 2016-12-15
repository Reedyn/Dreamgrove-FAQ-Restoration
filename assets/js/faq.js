var FAQ = (function () {

    /**
     * Run
     * Runs the script.
     */
    var initialize = function() {
        API.getData('1vbYagCkfotuqbpvBr_skmw7Sz43UoprmEiXKatTMp0E', function(data){
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

$(document).ready(function(){
    FAQ.initialize();
});