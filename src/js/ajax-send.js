document.addEventListener('DOMContentLoaded', () => {

  const ajaxSend = (formData) => {
    fetch('mail.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })
      .then(response => console.log('Сообщение отправлено методом fetch'))
      .catch(error => console.error(error))
  };

  const forms = document.getElementsByTagName('form');
  for (let i = 0; i < forms.length; i++) {
    forms[i].addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      ajaxSend(formData);
      console.log(formData);
      this.reset();
    });
  }
});