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
                titleElement.classList.remove('small');
                titleElement.classList.remove('smaller');
                if(data.title.length > 200 && data.title.length < 360) {
                    titleElement.classList.add('smaller');
                } else if(data.title.length >= 360) {
                    titleElement.classList.add('small');
                }
                titleElement.innerText = '';
                descriptionElement.innerText = '';
                descriptionElement.classList.remove('visible');
                typeWriterEffect(titleElement, data.title, () => {

                    document.getElementById('random-article-btn').disabled = false;
                    descriptionElement.innerHTML = data.description;
                    descriptionElement.classList.add('visible');
                });
                document.getElementById('article-dropdown').value = id;
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
                element.classList.remove('typing-cursor');
                callback();
            }
        }
        element.classList.add('typing-cursor');

        typeWriter();
    };
    function createDropdown() {
        var dropdown = document.getElementById("article-dropdown");

        for (var i = 1; i <= 161; i++) {
            var option = document.createElement("option");
            option.text = i;
            option.value = i;
            dropdown.appendChild(option);
        }
    };


    document.getElementById('random-article-btn').addEventListener('click', () => {
        fetchArticle();
    });
    document.getElementById('copy-link-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(location.href.replace(/#.*$/, '')  + '#' + window.articleId);
        showToast('Посилання скопійовано!')
    });
    document.getElementById('prev-article-btn').addEventListener('click', () => {
        if(window.articleId == 1) {
            return;
        }
        fetchArticle(window.articleId - 1);
    });
    document.getElementById('next-article-btn').addEventListener('click', () => {
        if(window.articleId == 161) {
            return;
        }
        fetchArticle(window.articleId + 1);
    });
    document.getElementById('article-dropdown').addEventListener('change', (event) => {
        fetchArticle(event.target.value);
    });
    if (location.hash) {
        let articleNumber = parseInt(location.hash.replace('#', ''));
        fetchArticle(articleNumber);
        return;
    }
    createDropdown();
    fetchArticle();

    // Initial page load
});