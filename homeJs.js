const guidelineContainer = document.getElementsByClassName('guideline-container')[0];

async function fetchGuidelines() {
    try {
        const response = await fetch('homeGuidelines.json');
        if (!response.ok) throw new Error('Error with the network');

        const data = await response.json();
        displayGuideline(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayGuideline(data) {
    data.forEach(item => {
        const containerDiv = document.createElement('div');
        containerDiv.classList.add('guidelineExpanded');

        const guidelineName = document.createElement('p');
        guidelineName.innerHTML = `<strong>Title: ${item.title}</strong>`;
        guidelineName.setAttribute("data-title", item.title.toLowerCase());

        const guidelineDate = document.createElement('p');
        guidelineDate.innerHTML = `<strong>Last Updated: ${item.Updated}</strong>`;

        const guidelineContent = document.createElement('p');
        guidelineContent.textContent = `Content: ${item.content}`;

        const guidelineTags = document.createElement('p');
        guidelineTags.innerHTML = `<strong>Tags: ${item.Tags}</strong>`;
        guidelineTags.setAttribute("data-tags", item.Tags.toLowerCase());

        containerDiv.appendChild(guidelineName);
        containerDiv.appendChild(guidelineDate);
        containerDiv.appendChild(guidelineContent);
        containerDiv.appendChild(guidelineTags);

        guidelineContainer.appendChild(containerDiv);
    });
}

fetchGuidelines();

// Search function
function searchGuidelines() {
    const searchBar = document.getElementById("search-input");
    const filter = searchBar.value.toLowerCase();
    const gContainers = document.getElementsByClassName("guidelineExpanded");

    if (filter === "") {
        // Show all containers if the search input is empty
        for (let i = 0; i < gContainers.length; i++) {
            gContainers[i].style.display = "";
        }
        return; // Exit the function early
    }

    for (let i = 0; i < gContainers.length; i++) {
        const gName = gContainers[i].querySelector('[data-title]').getAttribute("data-title");
        const gTags = gContainers[i].querySelector('[data-tags]').getAttribute("data-tags");

        if (gName.includes(filter) || gTags.includes(filter)) {
            gContainers[i].style.display = "";
        } else {
            gContainers[i].style.display = "none";
        }
    }
}
 

// Trigger search on Enter key press
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchGuidelines();
    }
});
