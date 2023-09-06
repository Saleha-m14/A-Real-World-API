const API_KEY = "xkRwLaW1G4e8dBjQ6InHSGeCiG0";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));
async function postForm(e) {
    const form = new FormData(document.getElementById("checksform"));
    // this will make a request using post method authorize it with the key
    //and attach the form to the body
    const response = await fetch(API_URL, {
                                method: "POST",
                                headers: {
                                            "Authorization": API_KEY,
        },
                                body: form,
    });
    const data = await response.json();
    if (response.ok) {
        displayError(data.error);
    } else {
        throw new Error(data.error);
    }

    /*this will print the key and value pairs in console
    for (let el of form.entries()) {
        console.log(el);
    }*/
}

function displayError(data) {
    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported</div>`;   
    } else {
        // template literals
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }

    }

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

// We need two functions a function to make a request and a function to display the data
async function getStatus(e) {
    // this has the same forma as:
    //https://ci-jshint.herokuapp.com/api?api_key=thisismykey
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    // json method also returns a promise so we need to a await that too
    const data = await response.json();
    // in this stage of our function we can assume that we'll have some data back:
    // it can be a key expiry date or an error
    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }

}

function displayStatus(data) {

    let heading = "API Key Status";
    let results =  `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
        
    resultsModal.show();

}
