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

let searchCounts = JSON.parse(localStorage.getItem('searchCounts')) || {};

function updateMostSearched() {
    const mostSearchedList = document.getElementById('most-searched-list');
    mostSearchedList.innerHTML = ""; // Clear the list

    // Get top 5 most searched terms
    const sortedSearches = Object.entries(searchCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    sortedSearches.forEach(([term, count]) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${term} (${count})`;
        mostSearchedList.appendChild(listItem);
    });
}

function searchGuidelines() {
    const searchBar = document.getElementById("search-input");
    const filter = searchBar.value.toLowerCase();

    if (filter) {
        // Track the search term
        searchCounts[filter] = (searchCounts[filter] || 0) + 1;
        localStorage.setItem('searchCounts', JSON.stringify(searchCounts));
    }

    // Perform the existing search logic
    const gContainers = document.getElementsByClassName("guidelineExpanded");

    if (filter === "") {
        for (let i = 0; i < gContainers.length; i++) {
            gContainers[i].style.display = "";
        }
        return;
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

    // Update the "Most Searched" section
    updateMostSearched();
}

// Initialize the "Most Searched" section on load
updateMostSearched();

function sortGuidelines() {
    const sortOption = document.getElementById("sort-options").value;

    fetch('homeGuidelines.json')
        .then(response => response.json())
        .then(data => {
            if (sortOption === "title") {
                data.sort((a, b) => a.title.localeCompare(b.title));
            } else if (sortOption === "date") {
                data.sort((a, b) => new Date(b.Updated) - new Date(a.Updated));
            }

            // Clear the container and redisplay guidelines
            guidelineContainer.innerHTML = "";
            displayGuideline(data);
        })
        .catch(error => console.error('Error fetching or sorting data:', error));
}
