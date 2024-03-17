// Import the clientList element from the HTML document
const clientList = document.querySelector("#client-list");

// Function to create a client card based on the client object
function makeClientCard(client) {
  // Extract the phone number from the client object
  const phoneNumber = client["phone_number"];
  // Format the phone number in (XXX)XXX-XXXX format
  const displayPhoneNumber = `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;

  // Create the client card HTML markup
  const clientCard = `<div class="card">
        <h2>${client["first_name"]} ${client["last_name"]}</h2>
        <h3>${displayPhoneNumber} | ${client["email"]}</h3>
        <p>${client["address"]}, ${client["city"]}, ${client["state"]} ${client["zip_code"]}</p>
    </div>`;

  // Return the client card markup
  return clientCard;
}

// Function to get all clients from the server and display them
function getAllClients() {
  // Make a GET request to the server to fetch all clients
  axios
    .get("http://localhost:8765/clients")
    .then((res) => {
      // Iterate over each client in the response data
      res.data.forEach((client) => {
        // Create a client card for each client
        const clientCard = makeClientCard(client);

        // Append the client card to the clientList element
        clientList.innerHTML += clientCard;
      });
    })
    .catch((err) => console.log(err));
}

// Call the getAllClients function to fetch and display all clients
getAllClients();
