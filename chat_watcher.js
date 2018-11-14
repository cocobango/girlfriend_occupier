var messenger = class Messenger {

    constructor() {
        var jq = document.createElement('script');
        jq.onload = () => {
            jQuery.noConflict();
            setTimeout(this.main.bind(this), 3500);
        };
        jq.src = "//ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js";
        document.getElementsByTagName('head')[0].appendChild(jq);
    }

    main() {
        console.log("[WACB] Waiting for chat to load");
        jQuery("#pane-side").on("click", () => {
            setTimeout(this.listenToChat.bind(this), 350);
        });
    }

    listenToChat() {
        setInterval(this.analizeChat.bind(this), 100);
    }

    analizeChat() {
        console.log("[WACB] Listening to chat");
        if(this.lastSentBy() == 'someone else') {
            this.contemplateAnswer()
        }
        if (this.lastSentBy() == 'me') {
            console.log('i sent the last message')
        }
    }

    contemplateAnswer() {
        console.log('contemplating')
    }

    lastSentBy() {
        return this.getSentBy(this.getLastMessage())
    }

    getMessageDomElements() {
        return jQuery('#main > div._3zJZ2 > div > div > div._9tCEa ')[0].childNodes
    }

    getLastMessage() {
        let messages = this.getMessageDomElements()
        return jQuery(messages[messages.length-1])
    }

    getSentBy(message) {
        let my_message = message.find('.message-out').length > 0 
        let someone_message = message.find('.message-in').length > 0 
        if(someone_message) {
            return 'someone else';
        }

        if (my_message) {
            return 'me'
        }
        return 'system'
    }

    sendMessage(content) {
        this.placeInBox(content);
        this.submit();
    }

    sendWithDelay(content) {
        console.log('pausing for a bit before sending to allow formating');
        this.placeInBox(content);
        delay(5).then(() => this.submit());
    }

    placeInBox(content) {
        console.log('sending ' + content);
        window.InputEvent = window.Event || window.InputEvent;
        var event = new InputEvent('input', {bubbles: true});
        var textbox= document.querySelector('#main > footer > div._3pkkz > div._1Plpp > div > div._2S1VP.copyable-text.selectable-text');
        textbox.textContent = content;
        textbox.dispatchEvent(event);
    }   

    submit() {
        document.querySelector("#main > footer > div._3pkkz > div > button > span").click();
    }

}

lala = new messenger();