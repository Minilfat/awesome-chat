function addMessage() {
    var input = $('#messages-body-id');
    console.log(input)
    var i = 0;

    input.append("<div id=\'" + (i++) + "\' class=\"message col-sm-7\">\n" +
        "        <div>\n" +
        "            <img class=\"inline contact-photo\" src=\"images/ellipse.svg\">\n" +
        "            <div class=\"inline message-text\">\n" +
        "                <p>text</p></div></div></div>")
}

function chooseChat(el, id) {
    var activeElements = document.getElementsByClassName("contact active")
    Array.prototype.forEach.call(activeElements, function(el) {
        el.classList.remove("active")
    });

    console.log("Id:", id)
    console.log("Element:", el)
    document.getElementById(id).classList.add("active");
    $('#' + id).unbind('mouseout');
}
