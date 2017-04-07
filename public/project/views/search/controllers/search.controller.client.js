(function () {
    angular
        .module('TheNewsNetwork')
        .controller("SearchController",SearchController);
    
    function SearchController(SearchNewsService) {
        var vm = this;
        $('select').selectize({
            options:[
                {value:"abc-news-au", text:"ABC News"},
                {value:"al-jazeera-english", text:"Al Jazeera"},
                {value:"ars-technica", text:"Ars Technica"},
                {value:"associated-press", text:"Associated Press"},
                {value:"bbc-news", text:"BBC News"},
                {value:"bbc-sport", text:"BBC Sports"},
                {value:"bild", text:"Bild"},
                {value:"bloomberg", text:"Bloomberd"},
                {value:"breitbart-news", text:"Breitbart News"},
                {value:"business-insider", text:"Business Insider"},
                {value:"business-insider-uk", text:"Business Insider UK"},
                {value:"buzzfeed", text:"Buzzfeed"},
                {value:"cnbc", text:"CNBC"},
                {value:"cnn", text:"CNN"},
                {value:"daily-mail", text:"Daily Mail"},
                {value:"der-tagesspiegel", text:"der-tagesspiegel"},
                {value:"die-zeit", text:"die-zeit"},
                {value:"engadget", text:"Engadget"},
                {value:"entertainment-weekly", text:"Entertainment Weekly"},
                {value:"espn", text:"ESPN"},
                {value:"espn-cric-info", text:"ESPN Cricket Info"},
                {value:"financial-times", text:"Financial Times"},
                {value:"focus", text:"Focus"},
                {value:"football-italia", text:"Football Italia"},
                {value:"fortune", text:"Fortune"},
                {value:"four-four-two", text:"Four Four Two"},
                {value:"fox-sports", text:"Fox Sports"},
                {value:"google-news", text:"Google News"},
                {value:"gruenderszene", text:"gruenderszene"},
                {value:"hacker-news", text:"Hacker News"},
                {value:"handelsblatt", text:"Handelsblatt"},
                {value:"ign", text:"IGN"},
                {value:"independent", text:"Independent"},
                {value:"mashable", text:"Mashable"},
                {value:"metro", text:"Metro"},
                {value:"mirror", text:"Mirror"},
                {value:"mtv-news", text:"MTV News"},
                {value:"mtv-news-uk", text:"MTV News UK"},
                {value:"national-geographic", text:"National Geographic"},
                {value:"new-scientist", text:"New Scientist"},
                {value:"newsweek", text:"Newsweek"},
                {value:"new-york-magazine", text:"NY Magazine"},
                {value:"nfl-news", text:"NFL News"},
                {value:"polygon", text:"Polygon"},
                {value:"recode", text:"Recode"},
                {value:"reddit-r-all", text:"Reddit"},
                {value:"reuters", text:"Reuters"},
                {value:"sky-news", text:"Sky News"},
                {value:"sky-sports-news", text:"Sky sports news"},
                {value:"spiegel-online", text:"Spiegel Online"},
                {value:"t3n", text:"T3N"},
                {value:"talksport", text:"Talksport"},
                {value:"techcrunch", text:"TechCrunch"},
                {value:"techradar", text:"Tech Radar"},
                {value:"the-economist", text:"The Economist"},
                {value:"the-guardian-au", text:"The Guardian AU"},
                {value:"the-guardian-uk", text:"The Guardian UK"},
                {value:"the-hindu", text:"The Hindu"},
                {value:"the-huffington-post", text:"The Huffington Post"},
                {value:"the-lad-bible", text:"The Lad Bible"},
                {value:"the-new-york-times", text:"The New York Times"},
                {value:"the-next-web", text:"The Next Web"},
                {value:"the-sport-bible", text:"The Sport Bible"},
                {value:"the-telegraph", text:"The Telegraph"},
                {value:"the-times-of-india", text:"The Times of India"},
                {value:"the-verge", text:"The Verge"},
                {value:"the-wall-street-journ", text:"The Wall Street Journal"},
                {value:"the-washington-post", text:"The Washington Post"},
                {value:"time", text:"Time"},
                {value:"usa-today", text:"USA Today"},
                {value:"wired-de", text:"Wired DE"},
                {value:"wirtschafts-woche", text:"Wirtschafts-Woche"}
            ],
            create: false,
            sortField: 'text',
            placeholder: "Select a news source"
        });
        vm.searchNewsFromSource = searchNewsFromSource;
        
        function searchNewsFromSource(source){
            SearchNewsService
                .searchNews(source)
                .then(function(response) {
                    vm.searchNews = response.data.articles;
                });

        }
    }
})();
