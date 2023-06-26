document.addEventListener('DOMContentLoaded', () => {


    // Fetch random article from API
    function fetchArticle(id) {
        let isRandom = false;
        if (!id || id < 1 || id > 161) {
            id = Math.floor(Math.random() * 161) + 1;
            isRandom = true;
        }


        const apiUrl = `/api/articles/${id}.json`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                window.articleId = id;
                if(isRandom) {
                    location.hash = "#";
                }
                const titleElement = document.getElementById('title');
                const descriptionElement = document.getElementById('description');

                titleElement.innerText = '';
                descriptionElement.innerText = '';
                descriptionElement.classList.remove('visible');
                typeWriterEffect(titleElement, data.title, () => {

                    document.getElementById('random-article-btn').disabled = false;
                    descriptionElement.innerHTML = data.description;
                    descriptionElement.classList.add('visible');
                });
            })
            .catch(error => {
                console.error('Error fetching article:', error);
            });
    }

    function showToast(message) {
        const toastElement = document.getElementById('toast');
        toastElement.innerText = message;
        toastElement.classList.add('visible');
        setTimeout(() => {
            toastElement.classList.remove('visible');
        }, 3000);
    }
    function typeWriterEffect(element, text, callback) {
        let index = 0;
        const speed = 10;
        if(window.typeWriterTimeout) {
            clearTimeout(window.typeWriterTimeout);
        }
        function typeWriter() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                window.typeWriterTimeout =  setTimeout(typeWriter, speed);
            } else {
                // Remove cursor effect after text is written
                element.classList.remove('typing-cursor');
                callback();
            }
        }

        // Add cursor effect class
        element.classList.add('typing-cursor');

        typeWriter();
    }

    // Event listener for random article button
    document.getElementById('random-article-btn').addEventListener('click', () => {
        fetchArticle();
    });
    document.getElementById('copy-link-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(location.href.replace(/#.*$/, '')  + '#' + window.articleId);
        showToast('Посилання скопійовано!')
    });
    document.getElementById('prev-article-btn').addEventListener('click', () => {
        if(window.articleId === 1) {
            return;
        }
        fetchArticle(window.articleId - 1);
    });
    document.getElementById('next-article-btn').addEventListener('click', () => {
        if(window.articleId === 161) {
            return;
        }
        fetchArticle(window.articleId + 1);
    });
    if (location.hash) {
        let articleNumber = parseInt(location.hash.replace('#', ''));
        fetchArticle(articleNumber);
        return;
    }

    fetchArticle();
    // Initial page load
});