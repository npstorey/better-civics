document.addEventListener('DOMContentLoaded', () => {
    const playButtons = document.querySelectorAll('.play-button');
    const interactiveElements = document.querySelectorAll('button, a, .process, .ulurp-box, .option');
    const newsletterForm = document.querySelector('.newsletter-form');

    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const videoTitle = button.closest('.panel').querySelector('h4').textContent;
            alert(`Video player for "${videoTitle}" - Coming soon!`);
        });
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.opacity = '0.8';
        });
        element.addEventListener('mouseleave', () => {
            element.style.opacity = '1';
        });
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--primary-color)';
        });
        element.addEventListener('blur', () => {
            element.style.outline = 'none';
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Newsletter form submission
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        alert(`Subscribed with email: ${email}`);
        newsletterForm.reset();
    });

    let allRows = [];
    const rowsPerPage = 3;
    let currentPage = 1;

    function populateCivicProcessesTable() {
        fetch('civic_engagement_processes.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                console.log('Raw CSV data:', data); // Debugging line
                allRows = data.trim().split('\n').slice(1);  // Remove header and trim whitespace
                console.log('Parsed rows:', allRows); // Debugging line

                displayTable(currentPage);
                setupPagination();
            })
            .catch(error => {
                console.error('Error loading civic processes:', error);
                const tableBody = document.querySelector('#civic-processes-table tbody');
                const tr = document.createElement('tr');
                tr.innerHTML = '<td colspan="3">Error loading data. Please try again later.</td>';
                tableBody.appendChild(tr);
            });
    }

    function displayTable(page) {
        const tableBody = document.querySelector('#civic-processes-table tbody');
        tableBody.innerHTML = '';
        
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedRows = allRows.slice(start, end);

        if (paginatedRows.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="3">No data available</td>';
            tableBody.appendChild(tr);
            return;
        }

        paginatedRows.forEach(row => {
            const [chapter, section, content] = row.split(',');
            if (chapter && section && content) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${chapter}</td>
                    <td>${section}</td>
                    <td>${content}</td>
                `;
                tableBody.appendChild(tr);
            } else {
                console.error('Invalid row data:', row);
            }
        });
    }

    function setupPagination() {
        const totalPages = Math.ceil(allRows.length / rowsPerPage);
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination';
        paginationContainer.innerHTML = `
            <button id="prevPage">Previous</button>
            <span id="pageInfo">Page ${currentPage} of ${totalPages}</span>
            <button id="nextPage">Next</button>
        `;

        const tableContainer = document.querySelector('.charter-processes');
        tableContainer.appendChild(paginationContainer);

        const prevButton = document.getElementById('prevPage');
        const nextButton = document.getElementById('nextPage');
        const pageInfo = document.getElementById('pageInfo');

        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayTable(currentPage);
                updatePaginationInfo();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayTable(currentPage);
                updatePaginationInfo();
            }
        });

        function updatePaginationInfo() {
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === totalPages;
        }

        updatePaginationInfo();
    }

    // Add ULURP process graphic placeholder
    const ulurpGraphic = document.getElementById('ulurp-graphic');
    ulurpGraphic.textContent = 'ULURP Process Graphic Placeholder';

    // Call populateCivicProcessesTable when the DOM is loaded
    populateCivicProcessesTable();
});