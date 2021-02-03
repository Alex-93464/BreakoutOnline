/*
This file is for interacting with the database and any other miscellaneous code
 */

function accountList(count) {
    console.log("Invoked accountList()");
    let url="/account/list/"
    fetch(url, {                // Count as a path parameter
        method: "GET",
    }).then(response => {
        return response.json();                         //return response to JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) {         //checks if response from server has an "Error"
            alert(JSON.stringify(response));            // if it does, convert JSON object to string and alert
        } else {
            console.log(response)
        }
    });
}

function accountCreate() {
    console.log("Invoked AccountCreate()");
    const formData = new FormData(document.getElementById("signupForm"));
    let url = "/account/create";
    fetch(url, {
        method: "POST",
        body: formData,
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));
        } else {
            window.open("/client/index.html", "_self");
        }
    });
}
