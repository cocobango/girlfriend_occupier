/*
feature list:
make schedule more accurate
make more conversation types
choose random from array with priority to some of the array elements
answer questions
send media

*/

var delay = t => new Promise(resolve => setTimeout(resolve, t * 1000));
var randInt = function(min, max) { return (Math.floor(Math.random() * (max - min) ) + min) };
var messenger = class Messenger {

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
            addition = addition + randInt(min, max);
        }
    }

    runAt(hour) {
        let now = new Date();
        let display_time = new Date();
        if (hour <= this.end_hour && hour >= this.start_hour) {
            console.log(`accepted hour ${hour}`);
            let seconds = (((hour - now.getHours()) * 60 ) + randInt(0, 60) )* 60;
            console.log(`running in ${display_time.setSeconds(display_time.getSeconds() + seconds)} seconds`);
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
        return ['מה קורה?', 'מה המצב?', 'מה שלומך?', 'מה העניינים?', 'יום טוב לך', 'שלום לך גבירתי', 'שלום מתוקה', 'הי חמודה', 'שלום חמודה', 'מה המצב?', 'מה הולך?', 'שלום אשת חיל', 'שלום שוקובו', 'שלום גומיגם'];
    }

    getCompliments() {
        return ['איזו יפה את!', 'המתיקות נשפכת ממך', 'הכוכבים והירח ביחד לא זוהרים כמוך', 'אם לא היית קיימת היה צריך להמציא אותך', 'את סוכרייה על מקל את', 'אין כמוך בעולם', 'משמחת לבב אנוש שכמוך', 'יראת שמיים', 'כמה שאת חכמה', 'פיך מפיק מרגליות', 'סננית', 'את בנאדם מעניין', 'לא יודע איך לאכול אותך', 'איזה עיניים', 'יא אללה שלך', 'דובשנייה שלי',];
    }

    getQuestions() {
        return ['מה אכלת היום?', 'מה את לובשת?', 'מה את לובשת מתחת למה שאת לובשת?', 'מה עשית היום?', 'את ערה?', 'איך עובר היום?', 'איך היום שלך?', 'מתי פעם אחרונה פגשת את אורטלית?', 'מה שלום אמא שלך?', 'מה שלום אורטלית?', 'מה שלום הסגנית שלך?',];
    }

    getTalkLaters() {
        return ['נדבר עוד מעט', 'אני באמצע, אני אחזור אלייך', 'נדבר מתוקה', 'אחזור אלייך עוד מעט',];
    }

    getKisses() {
        return ['😘', '😍', '❤', '😘', '😍', '❤', '😘', '😍', '❤',         '❣', '💕', '💞', '💓', '💗', '💖', '💝'];
    }

    getMantras() {
        return ['*איש המערות לא מפחד מעטלף*', '*זמן הוא אשליה של האדם הלבן שנועדה לשעבד אותנו*', '*את חזקה ועצמאית כמו ביונסה*', '*אין מה לפחד אלא מהפחד עצמו*', '*גם את*', '*סנדלר חכם לא הולך יחף*', '*עם הנצח לא מפחד מדרך ארוכה*', ]
    }

    getSongs() {
        return ['https://www.youtube.com/watch?v=9aFz_aLuFhI', 'https://www.youtube.com/watch?v=94BIxqTYJzU', 'https://www.youtube.com/watch?v=cRGrIn2VHTE', 'https://www.youtube.com/watch?v=Vj0GqUeUstM', 'https://www.youtube.com/watch?v=UPnLRL1mfF0', 'https://www.youtube.com/watch?v=lo4Trkb0cFk', 'https://www.youtube.com/watch?v=m5HXWKvKN5Y',]
    }

    getConversations() {
        return [
            { value: 'mantra', weight: 8},
            { value: 'sing', weight: 1},
            { value: 'question', weight: 3},
        ]
    }

    getReminderPrefix() {
        return 'תזכורת:'
    }

    getSongPrefix() {
        return 'שיר שחשבתי לחלוק איתך (אני יודע שכבר שמעת) -';
    }

    rand(arr) {
        return arr[Math.floor(Math.random()*arr.length)];
    }

    randByWeight(arr) {
        let sum = 0;
        let vals_arr = [];
        for (var i = 0; i < arr.length; i++) {
            sum = sum + arr[i].weight;
            for (var j = 0; j < arr[i].weight; j++) {
                vals_arr.push(arr[i].value);
            }
        }
        return this.rand(vals_arr);
    }

    randSeconds() {
        let max = 15;
        let min = 0;
        return Math.floor(Math.random() * (max - min) ) + min;
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
        return this.randByWeight(conversations);
    }

    mantra() {
        let mantra = this.rand(this.getMantras());
        this.remind(mantra);
    }

    sing() {
        let song = this.rand(this.getSongs());
        this.sendMessage(`${this.getSongPrefix()} ${song}`, 'delay');
    }

    remind(phrase) {
        this.sendMessage(`${this.getReminderPrefix()} ${phrase}`);
    }

    question() {
        let seconds = this.randSeconds() + 2;
        this.greet();
        delay(seconds).then(() =>this.kiss());
        seconds = seconds + this.randSeconds() + 10;
        delay(seconds).then(() =>this.ask());
        seconds = seconds + this.randSeconds() + 10;
        delay(seconds).then(() =>this.compliment());
        seconds = seconds + this.randSeconds() + 4;
        delay(seconds).then(() =>this.later());
        seconds = seconds + this.randSeconds() +  4;
        delay(seconds).then(() =>this.kiss());
    }

    invite() {
        // billiards
        // dance
        // standup
        // sport game
        // bowling
        // observatory
        // trip
        // beach
        // sex on the beach
        let seconds = this.randSeconds() + 2;
        this.greet();
        delay(seconds).then(() =>this.kiss());
        seconds = seconds + this.randSeconds() + 10;
    }

    fight() {
        // השמנת
        // מי זו החברה הזאת שלך היפה ההיא
        // את בדיוק כמו אמא שלך
    }

    task() {
        // walk with dog
        // give hug to bear
        // cook
        // gym
        // clean
        // selfie
        // buy me a [bicycle, ball, playstation]
    }

    greet() {
        let greet_message = this.rand(this.getGreetings());
        this.sendMessage(greet_message);
    }

    compliment() {
        let compliment_message = this.rand(this.getCompliments());
        this.sendMessage(compliment_message);
    }

    ask() {
        let ask_message = this.rand(this.getQuestions());
        this.sendMessage(ask_message);
    }

    later() {
        let later_message = this.rand(this.getTalkLaters());
        this.sendMessage(later_message);
    }

    kiss() {
        let kiss_message = this.rand(this.getKisses());
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

