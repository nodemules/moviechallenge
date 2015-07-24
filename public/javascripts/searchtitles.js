  $( document ).ready(function() {
        $("#loadmovie").click(function() {
            getImdbInfo($("#movieTitle").val(), $("#movieYear").val(), 1);
        })
        
        $("#loadmovie2").click(function() {
            getImdbInfo($("#movieTitle2").val(), $("#movieYear2").val(), 2);
        })

    });


    function getImdbInfo(title, year, contender) {
        $.ajax({
          url: "http://www.omdbapi.com/?t=" + title + "&y=" + year + "&plot=short&r=json",
          cache: false,
          dataType: "json",
          success: function(data) {
                

               var str = '<div>';
               str += "Title: " + data.Title + "<br>";
               str += "Year: " + data.Year + "<br>";
               str += "Director: " + data.Director + "<br>";
               str += "Rating: " + data.imdbRating + "<br>";
               str += "Plot: " + data.Plot + "<br>";
               str += '</div>';

                // insert the html
                $("#result" + contender).html(str);
          },
          error: function (request, status, error) { alert(status + ", " + error); }
        });
    }