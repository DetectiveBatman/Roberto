function showMessage(id) {
  $("#message-subject").text(msgs[id].subject);
  $("#message-sender").text(msgs[id].name);
  $("#message-email").text(msgs[id].email);
  $("#message-text").text(msgs[id].text);
  $("#messages-list").hide();
  $("#message").show();
}

var msgs = {};

$(document).ready(() => {
  $.post('/api/message', {getMessages: true}, (resp) => {
    if (resp.ok == true) {
      let messages = resp.res;
      for (let i = 0; i < messages.length; i++) {
        let message = messages[i];
        let element = `
        <li onClick="showMessage('${message.id}')">
          <span class="messages-id">${message.id}</span>
          <span class="messages-subject">${message.subject}</span>
          <span class="messages-sender">${message.name}</span>
          <span style="border: none; margin-right: 20px;" class="messages-preview">${message.text.substr(0, 100)}...</span>
        </li>
        `;
        $("#messages-list ul").append(element);
        msgs[message.id] = message;
      }
    }
  });

  $("#back").click(() => {
    $("#message").hide();
    $("#messages-list").show();
  });
});
