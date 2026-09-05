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
// Above code is AI Generated 

//Below code is NOT AI Generated

const feedback_pop = document.getElementById("feedback-popup")

function feedback_show() {
    feedback_pop.showModal()
}
function close_feedback() {
    feedback_pop.close()
}

const publish_pop = document.getElementById("publish-popup")

function publish_show() {
    publish_pop.showModal()
}
function close_publish() {
    publish_pop.close()
}

const media_subpop = document.getElementById("media-popup")

function publish_back () {
    media_subpop.close()
    publish_pop.showModal()
}
function media_show() {
    media_subpop.showModal()
    publish_pop.close()
}
function media_close() {
    media_subpop.close()
}

const of_subpop = document.getElementById("of-popup")

function others_show() {
    of_subpop.showModal()
    publish_pop.close()
}
function publish_back_of() {
    of_subpop.close()
    publish_pop.showModal()    
}
function of_close() {
    of_subpop.close()
}