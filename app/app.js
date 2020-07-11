//it will be called when app is initialized
window.frsh_init().then(function (client) {

    window.client = client;

    client.instance.receive(
        function (event) {

            //it will get the data send by the modal (reply text content)
            var data = event.helper.getData();

            SendReply(data.message.reply_text);
        }
    );

    //get Ticket Requester name
    client.data.get('contact').then(function (data) {

        //get Ticket status
        client.data.get('ticket').then((ticket) => {

            $('#ticket-status').text(ticket.ticket.status_label);

            $('#requester-name').text(data.contact.name);

        }).catch((err) => {

            console.log('Error occurred as ' + err);
        });

    }).catch(function (e) {

        console.log('Exception - ', e);
    });
});

//this is executed to reply with content passed to it
function SendReply(text) {

    //get domain name which will be used in the URL
    client.data.get("domainName").then(

        function (data) {

            //get ticket id which will be used in the URL
            client.data.get("ticket").then(

                function (ticketData) {

                    var DomainName, ticketId;

                    DomainName = data.domainName;

                    ticketId = ticketData.ticket.id;

                    //create URL for reply ticket api
                    var url = 'https://' + DomainName + '/api/v2/tickets/' + ticketId + '/reply';

                    client.iparams.get('freshdesk_api_key').then(

                        function (data) {

                            var apiKey = data.freshdesk_api_key;

                            //encoding Freshdesk Api key to use in Authorization headers
                            var encodedApi = btoa(apiKey + ':X');

                            var header = {
                                'Authorization': 'Basic ' + encodedApi,
                                'Content-Type': 'application/json'
                            };

                            //it will call POST api for replying ticket
                            client.request.post(url, {
                                headers: header,
                                body: text
                            }).then(function () {

                                showNotification('success', 'Replied to the Ticket');

                            }).catch(function (error) {

                                console.log(error);

                                showNotification('danger', 'Unable to reply to the ticket');

                            });
                        },
                        function (error) {

                            console.log(error);
                        }
                    );

                },
                function (error) {

                    console.log(error);
                }
            );
        },
        function (error) {

            console.log(error);
        }
    );


}
function ShowReplyModal() {

    client.interface.trigger('showModal', {
        title: 'Reply Ticket',
        template: 'modal.html'
    });
}

//showing notification on replying ticket
function showNotification(status, message) {

    client.interface.trigger("showNotify", {
        type: `${status}`,
        message: `${message}`
    });
}
