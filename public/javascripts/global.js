// Userlist data array for filling in info box
var userListData = []; //need better scope for this situation

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the posts on initial page load
    populateTable();



    // Add User button click
    $('#btnAddPost').on('click', addPost);

    // Delete User link click
    $(document).on('click', 'a.linkdeletepost', deletePost);


});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON TODO: make page logic dynamic based on pagination links
    $.getJSON('/users/postings/' + 1, function(data) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function() {
          
            tableContent += '<div id="postcontainer">' + '<div id="posttitle">' + this.title + '<br><span>' + this.date + '</span></div> <div id="postbody"> <a href="#" class="linkdeletepost" rel="' + this._id + '">delete post</a><br>' + this.post + '</div></div>';
            
        });

        // Inject the whole content string into our existing HTML 
        $('#posts').html(tableContent);
    });
};


// Add 
function addPost(event) {
    event.preventDefault();

    var d = new Date();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addPost input').each(function(index, val) {
        if ($(this).val() === '') {
            errorCount++;
        }
    });

    // Check and make sure errorCount's still at zero
    if (errorCount === 0) {
        var postID;
        $.ajaxSetup({
            async: false
        });
        $.getJSON('/users/getlastid', function(data) {


            $.each(data, function() {
                postID = this.postid;
            });

        });
        $.ajaxSetup({
            async: true
        });


        //alert("sup.");
        
        if (isNaN(postID)) {
            postID = 1;
        } else {
            postID++;
        }
       



        // If it is, compile all post info into one object
        var newPost = {
            'title': $('#addPost fieldset input#inputTitle').val(),
            'post': $('#addPost fieldset textarea#inputPost').val(),
            'date': Date(),
            'postid': Number(postID) //for paging
        }

        // Use AJAX to post the object to our addpost service
        $.ajax({
            type: 'POST', //THIS IS AN HTTP POST
            data: newPost, //take data from var above
            url: '/users/addpost', //References routine in users.js
            dataType: 'JSON'
        }).done(function(response) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addPost fieldset input').val('');

                // Update the table
                populateTable();

            } else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    } else {
        // If errorCount is more than 0, error out
        alert('Post must have a subject and body.');
        return false;
    }
};

// Delete 
function deletePost(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this post?');

    // Check and make sure the delete is confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deletepost/' + $(this).attr('rel')
        }).done(function(response) {

            // Check for a successful (blank) response
            if (response.msg === '') {} else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    } else {

        // If they said no to the confirm, do nothing
        return false;

    }

};