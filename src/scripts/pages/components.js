require('@styles/pages/components.scss');
require('@templates/pages/components.pug');

document.getElementById('copy-install-cmd')
    .addEventListener('click', ({target}) => {
        navigator.clipboard.writeText(target.value)
            .then(() => target.innerText = 'copied');
    });