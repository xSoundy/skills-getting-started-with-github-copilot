document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activityDropdown = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Fetch and display activities
  fetch("/activities")
    .then((response) => response.json())
    .then((activities) => {
      activitiesList.innerHTML = "";
      activityDropdown.innerHTML = '<option value="">-- Select an activity --</option>';
      for (const [name, details] of Object.entries(activities)) {
        // Populate activity cards
        const card = document.createElement("div");
        card.className = "activity-card";
        card.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Max Participants:</strong> ${details.max_participants}</p>
          <div>
            <strong>Participants:</strong>
            <ul>
              ${details.participants.map((participant) => `<li>${participant}</li>`).join("")}
            </ul>
          </div>
        `;
        activitiesList.appendChild(card);

        // Populate activity dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activityDropdown.appendChild(option);
      }
    })
    .catch((error) => {
      activitiesList.innerHTML = `<p class="error">Failed to load activities. Please try again later.</p>`;
      console.error("Error fetching activities:", error);
    });

  // Handle form submission
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const activity = activityDropdown.value;

    if (!email || !activity) {
      messageDiv.textContent = "Please fill out all fields.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      return;
    }

    fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, activity }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to sign up.");
        }
        return response.json();
      })
      .then((data) => {
        messageDiv.textContent = "Successfully signed up!";
        messageDiv.className = "success";
        messageDiv.classList.remove("hidden");
        signupForm.reset();
      })
      .catch((error) => {
        messageDiv.textContent = "Error signing up. Please try again.";
        messageDiv.className = "error";
        messageDiv.classList.remove("hidden");
        console.error("Error during signup:", error);
      });
  });
});
