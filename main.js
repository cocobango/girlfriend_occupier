/*
feature list:
make schedule more accurate
make more conversation types
answer questions
*/

var delay = t => new Promise(resolve => setTimeout(resolve, t * 1000));
var rand = {
    
    int: function (min, max) {
        return (Math.floor(Math.random() * (max - min) ) + min);
    },
  
    float: function(min, max) {
        return Math.random() * (max - min) + min;
    },
  
    element: function(arr) {
        return arr[Math.floor(Math.random()*arr.length)];
    },
  
    elementByWeight: function(arr) {
        let sum = 0;
        for (var i = 0; i < arr.length; i++) {
            sum = sum + arr[i].weight;
            arr[i].commulative_weight = sum;
        }
        let rand_float = rand.float(0, sum);
        for (var i = 0; i < arr.length; i++) {
            if(arr[i].commulative_weight >= rand_float){
                return arr[i].value;
            }
        }
    },

    seconds: function() {
        let max = 15;
        let min = 0;
        return Math.floor(Math.random() * (max - min) ) + min;
    },
}

var messenger = class Messenger {

    constructor() {
        let self = this;
        var jq = document.createElement('script');
        jq.onload = function() {
            jQuery.noConflict();
            console.log('jQuery loaded');
            setTimeout(self.main, 3500);
        };
        jq.src = "//ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js";
        document.getElementsByTagName('head')[0].appendChild(jq);
    }

    main() {
        let self = this;
        console.log("[WACB] Waiting for chat to load");
        jQuery("#pane-side").on("click", function() {
            setTimeout(self.listenToChat, 350);
        });
    }

    listenToChat() {
        console.log("[WACB] Listening to chat");
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

var occupier = class GirlfriendOccupier {
    
    constructor(min_message_gap, max_message_gap, start_hour, end_hour) {
        this.min_message_gap = min_message_gap; // hours
        this.max_message_gap = max_message_gap; // hours
        this.start_hour = start_hour; //time of day
        this.end_hour = end_hour; // time of day
        this.talker = new talker();
    }

    schedule() {
        let min = this.min_message_gap;
        let max = this.max_message_gap;
        let now = new Date();
        console.log(`starting at ${now}`);
        let addition = 0;
        for (let i = 0; i < 5; i++) {
            this.runAt(now.getHours() + addition);
            addition = addition + rand.int(min, max);
        }
    }

    runAt(hour) {
        let now = new Date();
        let display_time = new Date();
        if (hour <= this.end_hour && hour >= this.start_hour) {
            console.log(`accepted hour ${hour}`);
            let seconds = (((hour - now.getHours()) * 60 ) + rand.int(0, 60) )* 60;
            display_time.setSeconds(display_time.getSeconds() + seconds);
            console.log(`running in ${seconds} seconds`);
            console.log(`at: ${display_time.getHours()}:${display_time.getMinutes()}`);
            delay(seconds).then(() => this.talk());
        } else {
            console.log(`rejected hour ${hour}`);
        }
    }

    talk() {
        this.talker.talk();
    }
    
}
var talker = class Talker {
    
    constructor() {
        this.messenger = new messenger();
    }

    getGreetings() {
        return [
            { value: 'מה קורה?', weight: 10}, 
            { value: 'מה המצב?', weight: 10}, 
            { value: 'מה שלומך?', weight: 10}, 
            { value: 'מה העניינים?', weight: 10}, 
            { value: 'יום טוב לך', weight: 10}, 
            { value: 'שלום לך גבירתי', weight: 10}, 
            { value: 'שלום מתוקה', weight: 10}, 
            { value: 'הי חמודה', weight: 10}, 
            { value: 'שלום חמודה', weight: 10}, 
            { value: 'מה המצב?', weight: 10}, 
            { value: 'מה הולך?', weight: 10}, 
            { value: 'שלום אשת חיל', weight: 10}, 
            { value: 'שלום שוקובו', weight: 10}, 
            { value: 'שלום גומיגם', weight: 10},
        ];
    }

    getCompliments() {
        return [
            {value: 'איזו יפה את!', weight: 10},
            {value: 'המתיקות נשפכת ממך', weight: 10},
            {value: 'הכוכבים והירח ביחד לא זוהרים כמוך', weight: 10},
            {value: 'אם לא היית קיימת היה צריך להמציא אותך', weight: 10},
            {value: 'את סוכרייה על מקל את', weight: 10},
            {value: 'אין כמוך בעולם', weight: 10},
            {value: 'משמחת לבב אנוש שכמוך', weight: 10},
            {value: 'יראת שמיים שכמוך', weight: 10},
            {value: 'כמה שאת חכמה', weight: 10},
            {value: 'פיך מפיק מרגליות', weight: 10},
            {value: 'סננית', weight: 10},
            {value: 'את בנאדם מעניין', weight: 10},
            {value: 'לא יודע איך לאכול אותך', weight: 10},
            {value: 'איזה עיניים', weight: 10},
            {value: 'יא אללה שלך', weight: 10},
            {value: 'דובשנייה שלי', weight: 10},
        ];
    }

    getQuestions() {
        return [
            {value: 'מה אכלת היום?', weight: 10},
            {value: 'מה את לובשת?', weight: 10},
            {value: 'מה את לובשת מתחת למה שאת לובשת?', weight: 10},
            {value: 'מה עשית היום?', weight: 10},
            {value: 'את ערה?', weight: 10},
            {value: 'איך עובר היום?', weight: 10},
            {value: 'איך היום שלך?', weight: 10},
            {value: 'מתי פעם אחרונה פגשת את אורטלית?', weight: 10},
            {value: 'מה שלום אמא שלך?', weight: 10},
            {value: 'מה שלום אורטלית?', weight: 10},
            {value: 'מה שלום הסגנית שלך?', weight: 10},
        ];
    }

    getTalkLaters() {
        return [
            {value: 'נדבר עוד מעט', weight: 10},
            {value: 'אני באמצע, אני אחזור אלייך', weight: 10},
            {value: 'נדבר מתוקה', weight: 10},
            {value: 'אחזור אלייך עוד מעט', weight: 10},
        ];
    }

    getKisses() {
        return [
            {value: '😘', weight: 4},
            {value: '😍', weight: 4},
            {value: '❤', weight: 4},
            {value: '❣', weight: 1},
            {value: '💕', weight: 1},
            {value: '💞', weight: 1},
            {value: '💓', weight: 1},
            {value: '💗', weight: 1},
            {value: '💖', weight: 1},
            {value: '💝', weight: 1},
        ];
    }

    getMantras() {
        return [
            { value: 'איש המערות לא מפחד מעטלף', weight: 3},
            { value: 'זמן הוא אשליה של האדם הלבן שנועדה לשעבד אותנו', weight: 30},
            { value: 'את חזקה ועצמאית כמו ביונסה', weight: 15},
            { value: 'אין מה לפחד אלא מהפחד עצמו', weight: 10},
            { value: 'גם את', weight: 10},
            { value: 'סנדלר חכם לא הולך יחף', weight: 3},
            { value: 'עם הנצח לא מפחד מדרך ארוכה', weight: 6},
            { value: 'תזמון זה עניין של טיימינג', weight: 10},
         ]
    }

    getInvitations() {
        return [
            { value: 'נלך לשחק סנוקר', weight: 10},
            { value: 'נצא לרקוד', weight: 10},
            { value: 'נלך לסטנדאפ', weight: 4},
            { value: 'נלך לאיזה משחק', weight: 1},
            { value: 'נלך לבאולינג', weight: 7},
            { value: 'נלך לצפות בכוכבים', weight: 10},
            { value: 'נצא לטיול', weight: 10},
            { value: 'נלך לחוף', weight: 2},
            { value: 'נתעלס במקום אקזוטי', weight: 14},
         ]
    }

    getSongs() {
        return [
            { value: 'https://www.youtube.com/watch?v=9aFz_aLuFhI', weight: 10},
            { value: 'https://www.youtube.com/watch?v=94BIxqTYJzU', weight: 10},
            { value: 'https://www.youtube.com/watch?v=cRGrIn2VHTE', weight: 10},
            { value: 'https://www.youtube.com/watch?v=Vj0GqUeUstM', weight: 10},
            { value: 'https://www.youtube.com/watch?v=UPnLRL1mfF0', weight: 10},
            { value: 'https://www.youtube.com/watch?v=lo4Trkb0cFk', weight: 10},
            { value: 'https://www.youtube.com/watch?v=m5HXWKvKN5Y', weight: 10},
         ]
    }

    getConversations() {
        return [
            { value: 'mantra', weight: 12},
            { value: 'sing', weight: 1},
            { value: 'question', weight: 3},
            { value: 'fight', weight: 0.2},
            { value: 'invite', weight: 3},
            { value: 'task', weight: 5},
        ]
    }

    getFights() {
        return [
            { value: 'השמנת', weight: 8.87},
            { value: 'תזכירי לי איך קוראים לחברה היפה הזו שלך', weight: 1},
            { value: 'את בדיוק כמו אמא שלך', weight: 3},
            { value: 'את קצת מזניחה את עצמך וחבל', weight: 3},
        ]
    }

    getTasks() {
        return [
            { value: 'מתי את יוצאת לעוד סיבוב עם לאקי?', weight: 7},
            { value: 'מתי פעם אחרונה נתת איזה חיבוק לדוביבי?', weight: 15},
            { value: 'בא לך להכין לנו ארוחה טובה?', weight: 15},
            { value: 'מתי פקדת את המכון לאחרונה?', weight: 3},
            { value: 'ניקית את החדר?', weight: 10},
            { value: 'אולי תשלחי לי איזו תמונה של ההתרחשות?', weight: 4},
            { value: 'אולי תקני לי אופניים?', weight: 10},
            { value: 'אולי תקני לי כדורסל?', weight: 10},
            { value: 'אולי תקני לי פלייסטיישן?', weight: 10},
        ]
    }

    getReminderPrefix() {
        return 'תזכורת: *';
    }

    getReminderSuffix() {
        return '*';
    }

    getSongPrefix() {
        return 'שיר שחשבתי לחלוק איתך (אני יודע שכבר שמעת) -';
    }

    talk() {
        let conversation = this.chooseConversation();
        try {
            this[conversation]();
        }
        catch(err) {
            console.log('no conversation chosen');
            console.log('error: ');
            console.log(err);
            this.kiss();
        }
    }

    chooseConversation() {
        let conversations = this.getConversations();
        return rand.elementByWeight(conversations);
    }

    mantra() {
        let mantra = rand.elementByWeight(this.getMantras());
        this.remind(mantra);
    }

    sing() {
        let song = rand.elementByWeight(this.getSongs());
        this.sendMessage(`${this.getSongPrefix()} ${song}`, 'delay');
    }

    remind(phrase) {
        this.sendMessage(`${this.getReminderPrefix()}${phrase}${this.getReminderSuffix()}`);
    }

    question() {
        let seconds = rand.seconds() + 2;
        this.greet();
        delay(seconds).then(() =>this.kiss());
        seconds = seconds + rand.seconds() + 10;
        delay(seconds).then(() =>this.ask());
        seconds = seconds + rand.seconds() + 10;
        delay(seconds).then(() =>this.compliment());
        seconds = seconds + rand.seconds() + 4;
        delay(seconds).then(() =>this.later());
        seconds = seconds + rand.seconds() +  4;
        delay(seconds).then(() =>this.kiss());
    }

    invite() {
        let invitation = rand.elementByWeight(this.getInvitations());
        this.sendMessage('מה את אומרת');
        let seconds = rand.seconds() + 7;
        delay(seconds).then(() =>this.sendMessage(`אולי ${invitation}`));
    }

    fight() {
        let fight_message = rand.elementByWeight(this.getFights());
        this.sendMessage(fight_message);
    }

    task() {
        let task_message = rand.elementByWeight(this.getTasks());
        this.sendMessage('תגידי');
        let seconds = rand.seconds() + 12;
        delay(seconds).then(() =>this.sendMessage(task_message));
    }

    greet() {
        let greet_message = rand.elementByWeight(this.getGreetings());
        this.sendMessage(greet_message);
    }

    compliment() {
        let compliment_message = rand.elementByWeight(this.getCompliments());
        this.sendMessage(compliment_message);
    }

    ask() {
        let ask_message = rand.elementByWeight(this.getQuestions());
        this.sendMessage(ask_message);
    }

    later() {
        let later_message = rand.elementByWeight(this.getTalkLaters());
        this.sendMessage(later_message);
    }

    kiss() {
        let kiss_message = rand.elementByWeight(this.getKisses());
        this.sendMessage(kiss_message);
    }

    sendMessage(content, is_delay) {
        if (is_delay == 'delay') {
            this.messenger.sendWithDelay(content);
            return;
        }
        this.messenger.sendMessage(content);
    }

}
var min_hours_message_gap = 2; 
var max_hours_message_gap = 5;
var start_hour = 8;
var end_hour = 22;

var starter = new occupier(min_hours_message_gap, max_hours_message_gap, start_hour, end_hour);
starter.schedule();

