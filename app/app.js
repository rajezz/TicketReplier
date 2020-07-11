/* $(document).ready( function() {
    app.initialized()
        .then(function(_client) {
          var client = _client;
          client.events.on('app.activated',
            function() {
                client.data.get('contact')
                    .then(function(data) {
                        $('#apptext').text("Ticket is requested by " + data.contact.name);
                    })
                    .catch(function(e) {
                        console.log('Exception - ', e);
                    });
        });
    });
});
 */

window.frsh_init().then(function (client) {
    window.client = client;
    client.instance.receive(
        function (event) {
            var data = event.helper.getData();
            SendReply(data.message.reply_text);
        }
    );
    client.data.get('contact')
        .then(function (data) {
            client.data.get('ticket').then((ticket) => {
                $('#ticket-status').text(ticket.ticket.status_label);
                $('#requester-name').text(data.contact.name);
            }).catch((err) => {
                console.log('Error occurred as ' + err);
            });
            
            
        })
        .catch(function (e) {
            console.log('Exception - ', e);
        });
});

function SendReply(message_text) {
    window.client.interface.trigger("click", { id: "reply", text: message_text })
        .then(function (data) {
        }).catch(function (error) {
            console.log('error occurred in replying' + error);
        });
}

function ShowReplyModal() {
    client.interface.trigger('showModal', {
        title: 'Reply Ticket Form',
        template: 'modal.html'
    })
        .then(
            function (data) {
                console.log('Parent:InterfaceAPI:showModal', data);
            },
            function (error) {
                console.log('Parent:InterfaceAPI:showModal', error);
            }
        );
}


function SubmitReplyForm() {
    var reply_text = $('input[name="reply-text"]').val();
    if (reply_text != null && reply_text != undefined) {
        window.client.interface.trigger("click", {
            id: "reply",
            text: reply_text,
        }).then(function (data) {
            console.log('replied success ' + data);
        }).catch(function (error) {
            console.log('replied failed ' + error);
        });
    } else {

    }
}