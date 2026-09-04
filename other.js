const contentEl = document.getElementById('main-content');
const links = document.querySelectorAll('.sidebar a[data-page]');

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    const template = document.getElementById(`page-${page}`);

    if (template) {
      contentEl.innerHTML = '';
      contentEl.appendChild(template.content.cloneNode(true));
    }
  });
});