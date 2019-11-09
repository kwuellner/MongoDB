// scrape
$(document).on("click", ".scrape", function () {
    $.get("/scrape", function (req, res) {
        console.log(res);
    }).then(function (data) {
        window.location.href = "/";
    });
});

$(document).on("click", ".home", function () {
    $.get("/", function (req, res) {
        console.log(res);
    }).then(function (data) {
        window.location.href = "/";
    });
});

// save
$(document).on("click", ".save", function () {
    $(this).parent().remove();
    let artId = $(this).attr("data-id");
    $.ajax({
        url: '/save/' + artId,
        type: "POST"
    }).done(function (data) {
        $(".article").filter("[data-id='" + artId + "']").remove();
    });
});

// view saved article
$(document).on("click", ".saved", function () {
    $.get("/saved", function (req, res) {
        console.log(res);
    }).then(function (data) {
        window.location.href = "/saved";
    });
});

// delete saved article
$(document).on("click", ".unsave", function () {
    $(this).parent().remove();
    let artId = $(this).attr("data-id");

    $.ajax({
        url: "/unsave/" + artId,
        type: "POST"
    }).done(function (data) {
        $(".article").filter("[data-id='" + artId + "']").remove();
    });
});


// creating note
$(document).on("click", '#savenote', function () {
    let noteId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/creatNote/" + noteId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    }).then(function (data) {
        console.log(data);
        $("#notes").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val("");
    $("#noteModal").modal("hide");
});

// opening notes
$(document).on("click", ".addNote", function (e) {
    $("#notes").empty();
    let noteId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/getNotes/" + noteId
    }).then(function (data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<h3 id='notetitle'></h3>");
        $("#notes").append("<p id='notebody'</p>");
        $("#notes").append("<div class='form-group'><label for='title'>Title: </label><input id='titleinput' class='form-control' name='title'></div>");
        $("#notes").append("<div class='form-group'><label for='body'>Note: </label><input id='bodyinput' class='form-control' name='body'></div>");
        $("#notes").append("<button class='btn-btn-default' data-id='" + data._id + "' id='savenote'>Save Note</button>");

        if (data.note) {
            $("#notetitle").text(data.note.title);
            $("#notebody").text(data.note.body);
        }
    });
});
