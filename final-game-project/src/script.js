// Flappy Bird-like Game using Canvas and JavaScript

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("playButton");

// Scoreboard elements
const currentScoreElement = document.getElementById('currentScore');
const highScoreElement = document.getElementById('highScore');
const accumulatedScoreElement = document.getElementById('accumulatedScore');
const playerNameDisplay = document.getElementById('playerNameDisplay');

// Logical game dimensions (for game logic calculations, not actual canvas size)
const gameWidth = 600;
const gameHeight = 400;

let gameRunning = false;
let lastTime = 0;

// Player setup
const player = {
  x: 50,
  y: gameHeight / 2, // Use gameHeight here
  width: 30,
  height: 30,
  velocityY: 0,
  gravity: 600,
  jumpPower: -200
};

// Pipes setup
const pipes = [];
const pipeWidth = 80;
const pipeGap = 180;
const pipeSpeed = 350;

// Golden Booklets setup
const booklets = [];
let collectedBookletsCount = 0;
let questionsAnsweredCorrectly = 0;
const totalBooklets = 100; // Win condition

// Question related elements
const questionOverlay = document.getElementById('questionOverlay');
const questionTextElement = document.getElementById('questionText');
const questionOptionsContainer = document.getElementById('questionOptions');
const questionTimerDisplay = document.getElementById('questionTimer');
const messageContainer = document.getElementById('messageContainer');
const messageTextElement = document.getElementById('messageText');
const gameOverScreen = document.getElementById('gameOverScreen');
const gameOverTextElement = document.getElementById('gameOverText');
const restartButton = document.getElementById('restartButton');
const equianoEndingScreen = document.getElementById('equianoEndingScreen');
const equianoEndingTextElement = document.getElementById('equianoEndingText');
const restartButtonEnding = document.getElementById('restartButtonEnding');
const startScreen = document.getElementById('startScreen');
const howToPlayButton = document.getElementById('howToPlayButton');
const howToPlayOverlay = document.getElementById('howToPlayOverlay');
const closeHowToPlayButton = document.getElementById('closeHowToPlayButton');
const showLeaderboardButton = document.getElementById('showLeaderboardButton');
const leaderboardOverlay = document.getElementById('leaderboardOverlay');
const closeLeaderboardButton = document.getElementById('closeLeaderboardButton');
const fullLeaderboardListElement = document.getElementById('fullLeaderboardList');
const playerNameInput = document.getElementById('playerNameInput');
const saveNameButton = document.getElementById('saveNameButton');


let questionActive = false;
let questionTimerInterval;
let questionTimeLeft = 15;
let countdownInterval;
let countdownTime = 3;
let currentQuestion = null;
let currentTriggeredBooklet = null;
let showWinGlow = false;

// Background music setup
let backgroundMusic;

// Questions - 100 Trick Questions (Simplified for brevity, use the full list from previous response)
const allQuestions = [
    {
        question: "什麼有牙齒但不能咬？",
        answers: ["梳子", "刀子", "剪刀", "叉子"],
        correctAnswer: "梳子"
    },
    {
        question: "什麼有脖子但沒有頭，還戴著帽子？",
        answers: ["瓶子", "杯子", "罐子", "帽子"],
        correctAnswer: "瓶子"
    },
    {
        question: "我沒有生命，但我會長大。我沒有肺，但我需要空氣。我不是植物，但我需要水。我是什麼？",
        answers: ["火", "樹", "雲", "石頭"],
        correctAnswer: "火"
    },
    {
        question: "我會改變形狀但從不消失。我可以是固體、液體或氣體，我無處不在。我是什麼？",
        answers: ["水", "空氣", "光", "影子"],
        correctAnswer: "水"
    },
    {
        question: "我環遊世界，但從不離開角落。我是什麼？",
        answers: ["郵票", "地球儀", "地圖", "指南針"],
        correctAnswer: "郵票"
    },
    {
        question: "你可以在水星、地球、火星和木星中找到我，但不能在金星或海王星中找到我。我是什麼？",
        answers: ["字母“R”", "字母“E”", "字母“A”", "字母“O”"],
        correctAnswer: "字母“R”"
    },
    {
        question: "什麼東西可以從煙囪上來，但不能從煙囪下去？",
        answers: ["雨傘", "煙", "鳥", "蝙蝠"],
        correctAnswer: "雨傘"
    },
    {
        question: "我改變時會發出很大的聲音。當我改變時，我會變大但重量減輕。我是什麼？",
        answers: ["爆米花", "氣球", "麵包", "蛋糕"],
        correctAnswer: "爆米花"
    },
    {
        question: "一位公車司機在繁忙的城市街道上行駛。他經過三個停車標誌都沒有停車，逆行駛入單行道，還接了手機訊息。但這位公車司機沒有違反任何交通法規。為什麼？",
        answers: ["他當時在走路，不是開車。", "他開的是電動公車。", "他有特殊許可證。", "他當時在夢遊。"],
        correctAnswer: "他當時在走路，不是開車。"
    },
    {
        question: "它有鍵盤，但沒有鎖。它有空間，但沒有房間。你可以進入，但不能進去。它是什麼？",
        answers: ["鍵盤", "門", "盒子", "書"],
        correctAnswer: "鍵盤"
    },
    {
        question: "我可以充滿一個房間，但我卻不佔空間。我是什麼？",
        answers: ["光", "聲音", "空氣", "水"],
        correctAnswer: "光"
    },
    {
        question: "如果我有它，我就不分享它。如果我分享它，我就沒有它。它是什麼？",
        answers: ["秘密", "錢", "食物", "玩具"],
        correctAnswer: "秘密"
    },
    {
        question: "什麼東西一說出來就消失了？",
        answers: ["寂靜", "聲音", "想法", "夢"],
        correctAnswer: "寂靜"
    },
    {
        question: "一個沒有汽車的鐵路交叉口。你能在不使用任何“R”字母的情況下拼出那個詞嗎？",
        answers: ["T-H-A-T", "T-H-E", "T-R-A-I-N", "C-R-O-S-S"],
        correctAnswer: "T-H-A-T"
    },
    {
        question: "什麼東西會跑但不會走？",
        answers: ["水", "車", "時鐘", "風"],
        correctAnswer: "水"
    },
    {
        question: "什麼東西有嘴巴但不能說話？",
        answers: ["河流", "山", "石頭", "書"],
        correctAnswer: "河流"
    },
    {
        question: "什麼東西有一隻眼睛但看不見？",
        answers: ["針", "釘子", "螺絲", "鉤子"],
        correctAnswer: "針"
    },
    {
        question: "每個人都有我，但沒有人能失去我。我是什麼？",
        answers: ["影子", "名字", "生日", "記憶"],
        correctAnswer: "影子"
    },
    {
        question: "什麼東西以T開頭，以T結尾，並且裡面有T？",
        answers: ["茶壺", "桌子", "帳篷", "火車"],
        correctAnswer: "茶壺"
    },
    {
        question: "有一棟一層樓的房子。紅房子裡的一切都是紅色的，牆壁是紅色的，浴室是紅色的，地板是紅色的，廚房是紅色的，所有的臥室都是紅色的。那麼，樓梯是什麼顏色？",
        answers: ["沒有樓梯，這是一層樓的房子。", "紅色", "白色", "藍色"],
        correctAnswer: "沒有樓梯，這是一層樓的房子。"
    },
    {
        question: "你用左手能拿住什麼，但用右手卻拿不住？",
        answers: ["你的右肘", "你的左手", "你的鼻子", "你的耳朵"],
        correctAnswer: "你的右肘"
    },
    {
        question: "什麼樣的衣服只能在濕的時候穿上？",
        answers: ["油漆", "雨衣", "泳衣", "潛水服"],
        correctAnswer: "油漆"
    },
    {
        question: "如果一輛電動火車正向南行駛，煙會往哪個方向吹？",
        answers: ["沒有煙，因為是電動火車。", "向北", "向西", "向東"],
        correctAnswer: "沒有煙，因為是電動火車。"
    },
    {
        question: "什麼樣的房間沒有牆壁或角落？",
        answers: ["蘑菇", "帳篷", "洞穴", "圓形房間"],
        correctAnswer: "蘑菇"
    },
    {
        question: "數字11、69和88有什麼共同點？",
        answers: ["它們倒過來讀都一樣。", "它們都是偶數。", "它們都是奇數。", "它們都是質數。"],
        correctAnswer: "它們倒過來讀都一樣。"
    },
    {
        question: "我年輕時很高，但隨著年齡增長會變矮。我是什麼？",
        answers: ["蠟燭", "樹", "人", "建築物"],
        correctAnswer: "蠟燭"
    },
    {
        question: "我沒有翅膀，但我會飛。我沒有眼睛，但我會哭。我是什麼？",
        answers: ["雲", "鳥", "飛機", "風箏"],
        correctAnswer: "雲"
    },
    {
        question: "我輕如羽毛，但即使是世界上最強壯的人也無法將我舉起超過一分鐘。我是什麼？",
        answers: ["呼吸", "氣球", "羽毛", "泡沫"],
        correctAnswer: "呼吸"
    },
    {
        question: "什麼魚最貴？",
        answers: ["金魚", "鯊魚", "鯨魚", "鯉魚"],
        correctAnswer: "金魚"
    },
    {
        question: "什麼東西有城市但沒有房屋，有森林但沒有樹木，有河流但沒有水？",
        answers: ["地圖", "書", "地球儀", "夢"],
        correctAnswer: "地圖"
    },
    {
        question: "什麼東西有頭有尾但沒有爪子？",
        answers: ["硬幣", "蛇", "魚", "鳥"],
        correctAnswer: "硬幣"
    },
    {
        question: "什麼東西有一頭、一腳和四條腿？",
        answers: ["床", "椅子", "桌子", "沙發"],
        correctAnswer: "床"
    },
    {
        question: "一個女孩踢足球踢了十英尺，然後球自己回來了。這怎麼可能？",
        answers: ["她把球踢到了空中。", "她踢到了牆上。", "她踢到了彈簧上。", "她踢到了斜坡上。"],
        correctAnswer: "她把球踢到了空中。"
    },
    {
        question: "字母表中有多少個字母？",
        answers: ["10個字母：T-H-E-A-L-P-H-A-B-E-T", "26個字母", "24個字母", "28個字母"],
        correctAnswer: "10個字母：T-H-E-A-L-P-H-A-B-E-T"
    },
    {
        question: "什麼東西有五根手指但不是手？",
        answers: ["手套", "腳", "樹枝", "梳子"],
        correctAnswer: "手套"
    },
    {
        question: "什麼東西只會下降從不上升？",
        answers: ["雨", "雪", "冰雹", "瀑布"],
        correctAnswer: "雨"
    },
    {
        question: "字典裡哪個詞總是拼錯的？",
        answers: ["“錯字”", "“不正確地”", "“錯誤”", "“拼錯”"],
        correctAnswer: "“不正確地”"
    },
    {
        question: "你用右手能拿住什麼，但用左手卻拿不住？",
        answers: ["你的左手", "你的右手", "你的腳", "你的耳朵"],
        correctAnswer: "你的左手"
    },
    {
        question: "一群九隻鴕鳥在田野裡。如果三隻飛走了，田野裡還剩下多少隻？",
        answers: ["全部，鴕鳥不會飛。", "六隻", "三隻", "零隻"],
        correctAnswer: "全部，鴕鳥不會飛。"
    },
    {
        question: "他娶過很多男人，但從未結婚。他是誰？",
        answers: ["牧師", "律師", "醫生", "老師"],
        correctAnswer: "牧師"
    },
    {
        question: "什麼東西你可以拿住卻不用觸摸？",
        answers: ["你的呼吸", "你的影子", "你的想法", "你的夢"],
        correctAnswer: "你的呼吸"
    },
    {
        question: "什麼東西有手但不能拍手？",
        answers: ["時鐘", "雕像", "樹", "山"],
        correctAnswer: "時鐘"
    },
    {
        question: "什麼東西有文字但從不說話？",
        answers: ["書", "報紙", "雜誌", "字典"],
        correctAnswer: "書"
    },
    {
        question: "什麼東西你可以聽到但不能觸摸或看見？",
        answers: ["你的聲音", "風", "雷", "音樂"],
        correctAnswer: "你的聲音"
    },
    {
        question: "什麼樣的樂隊從不演奏音樂？",
        answers: ["橡皮筋", "髮帶", "膠帶", "繃帶"],
        correctAnswer: "橡皮筋"
    },
    {
        question: "什麼東西有心臟但不會跳動？",
        answers: ["朝鮮薊", "石頭", "木頭", "金屬"],
        correctAnswer: "朝鮮薊"
    },
    {
        question: "什麼東西遍布整個房子？",
        answers: ["屋頂", "牆壁", "地板", "天花板"],
        correctAnswer: "屋頂"
    },
    {
        question: "什麼東西移動得更快：熱還是冷？",
        answers: ["熱——因為你總能感冒。", "熱", "冷", "一樣快"],
        correctAnswer: "熱——因為你總能感冒。"
    },
    {
        question: "什麼東西繞著整個院子跑卻不動？",
        answers: ["籬笆", "圍牆", "路", "河流"],
        correctAnswer: "籬笆"
    },
    {
        question: "大多數人在雨天會帶什麼樣的雨傘？",
        answers: ["濕的", "紅色的", "黑色的", "壞掉的"],
        correctAnswer: "濕的"
    },
    {
        question: "什麼東西是黑白的，而且全身都是紅色的？",
        answers: ["曬傷的斑馬", "報紙", "熊貓", "企鵝"],
        correctAnswer: "曬傷的斑馬"
    },
    {
        question: "珍的媽媽有三個女兒。一個叫拉拉，另一個叫莎拉。第三個女兒叫什麼名字？",
        answers: ["珍", "瑪麗", "安娜", "露西"],
        correctAnswer: "珍"
    },
    {
        question: "如果我明天說：“前天是星期六”，那麼今天是星期幾？",
        answers: ["星期日", "星期一", "星期二", "星期三"],
        correctAnswer: "星期日"
    },
    {
        question: "什麼東西不能說話但總會回應？",
        answers: ["回聲", "鏡子", "影子", "書"],
        correctAnswer: "回聲"
    },
    {
        question: "一輛電動火車正以每小時100英里的速度向北行駛，風正以每小時10英里的速度向西吹。煙會往哪個方向吹？",
        answers: ["電動火車沒有煙。", "向北", "向西", "向東"],
        correctAnswer: "電動火車沒有煙。"
    },
    {
        question: "一個男人可以在密西西比州合法地娶他寡婦的妹妹嗎？",
        answers: ["不能——這個男人已經死了，所以他不能和任何人結婚。", "可以", "取決於州法律。", "只有在特定情況下。"],
        correctAnswer: "不能——這個男人已經死了，所以他不能和任何人結婚。"
    },
    {
        question: "什麼東西會落下但從不破裂，什麼東西會破裂但從不落下？",
        answers: ["夜幕降臨，天亮了。", "雨滴", "冰", "雪"],
        correctAnswer: "夜幕降臨，天亮了。"
    },
    {
        question: "說“蛋黃是白色的”或“蛋黃是白色的”哪一個是正確的？",
        answers: ["都不是。蛋黃是黃色的。", "蛋黃是白色的。", "蛋黃是白色的。", "兩者都正確。"],
        correctAnswer: "都不是。蛋黃是黃色的。"
    },
    {
        question: "沒有人能誠實地說“不”的問題是什麼？",
        answers: ["“你醒著嗎？”", "“你還好嗎？”", "“你快樂嗎？”", "“你喜歡這個遊戲嗎？”"],
        correctAnswer: "“你醒著嗎？”"
    },
    {
        question: "餐廳裡除了兩個人，所有人都生病了。這怎麼可能？",
        answers: ["這兩個人是一對夫婦，意思是他們不是單身。", "他們是醫生。", "他們是廚師。", "他們是服務員。"],
        correctAnswer: "這兩個人是一對夫婦，意思是他們不是單身。"
    },
    {
        question: "在“was”是“was”之前，“was”是什麼？",
        answers: ["是", "過去", "現在", "將來"],
        correctAnswer: "是"
    },
    {
        question: "我環遊世界，我一直醉醺醺的。我是誰？",
        answers: ["水", "風", "雲", "時間"],
        correctAnswer: "水"
    },
    {
        question: "什麼樣的奶酪是倒著做的？",
        answers: ["伊丹", "切達", "高達", "馬蘇里拉"],
        correctAnswer: "伊丹"
    },
    {
        question: "什麼發明讓你直接看穿牆壁？",
        answers: ["窗戶", "門", "鏡子", "望遠鏡"],
        correctAnswer: "窗戶"
    },
    {
        question: "什麼東西壞了更有用？",
        answers: ["雞蛋", "玻璃", "盤子", "杯子"],
        correctAnswer: "雞蛋"
    },
    {
        question: "什麼樣的弓不能打結？",
        answers: ["彩虹", "蝴蝶結", "弓箭", "髮帶"],
        correctAnswer: "彩虹"
    },
    {
        question: "什麼東西輕易拿起卻難以拋擲？",
        answers: ["羽毛", "氣球", "棉花", "泡沫"],
        correctAnswer: "羽毛"
    },
    {
        question: "什麼東西總是結束一切？",
        answers: ["字母“g”", "字母“e”", "字母“s”", "字母“t”"],
        correctAnswer: "字母“g”"
    },
    {
        question: "哪個英文單詞有三個連續的雙字母？",
        answers: ["Bookkeeper", "Committee", "Mississippi", "Possession"],
        correctAnswer: "Bookkeeper"
    },
    {
        question: "什麼東西如此脆弱，說出它的名字就會打破它？",
        answers: ["寂靜", "玻璃", "冰", "泡沫"],
        correctAnswer: "寂靜"
    },
    {
        question: "一個牛仔在星期五騎馬進城。他在城裡住了三天，然後在星期五騎馬離開。這怎麼可能？",
        answers: ["星期五是他的馬的名字。", "他騎的是一輛星期五牌的車。", "他星期五到達，然後在下一個星期五離開。", "這是不可能的。"],
        correctAnswer: "星期五是他的馬的名字。"
    },
    {
        question: "我是終結的開始，也是時間和空間的終結。我對創造至關重要，我環繞著每個地方。我是什麼？",
        answers: ["字母“e”", "字母“a”", "字母“z”", "字母“x”"],
        correctAnswer: "字母“e”"
    },
    {
        question: "比我構成的東西更輕，我被隱藏的部分比被看見的部分多。我是什麼？",
        answers: ["冰山", "雲", "霧", "煙"],
        correctAnswer: "冰山"
    },
    {
        question: "什麼東西會上下移動但停留在原地？",
        answers: ["樓梯", "電梯", "扶梯", "蹺蹺板"],
        correctAnswer: "樓梯"
    },
    {
        question: "我是一個神，一個行星，也是一個熱量測量器。我是誰？",
        answers: ["水星", "火星", "木星", "土星"],
        correctAnswer: "水星"
    },
    {
        question: "什麼東西有很多牙齒但不能咬？",
        answers: ["梳子", "鋸子", "拉鍊", "耙子"],
        correctAnswer: "梳子"
    },
    {
        question: "誰一天可以刮25次鬍子但仍然留著鬍子？",
        answers: ["理髮師", "演員", "模特", "畫家"],
        correctAnswer: "理髮師"
    },
    {
        question: "我知道一個三個字母的詞。加上兩個，就會變少。它是什麼？",
        answers: ["“少”這個詞 (few)", "“多”這個詞 (many)", "“大”這個詞 (big)", "“小”這個詞 (small)"],
        correctAnswer: "“少”這個詞 (few)"
    },
    {
        question: "你跑得越快，什麼東西越難追上？",
        answers: ["你的呼吸", "你的影子", "你的想法", "你的夢"],
        correctAnswer: "你的呼吸"
    },
    {
        question: "每天晚上我都被告知該做什麼，每天早上我都照做。但我仍然逃不過你的責罵。我是什麼？",
        answers: ["鬧鐘", "狗", "孩子", "員工"],
        correctAnswer: "鬧鐘"
    },
    {
        question: "我一直跟著你，模仿你的一舉一動，但你摸不到我也抓不住我。我是什麼？",
        answers: ["你的影子", "你的聲音", "你的想法", "你的夢"],
        correctAnswer: "你的影子"
    },
    {
        question: "人們買我來吃，但從不吃我。我是什麼？",
        answers: ["盤子和餐具", "桌子", "椅子", "鍋碗瓢盆"],
        correctAnswer: "盤子和餐具"
    },
    {
        question: "我年輕時很高，年老時變矮。我是什麼？",
        answers: ["蠟燭", "樹", "人", "建築物"],
        correctAnswer: "蠟燭"
    },
    {
        question: "我沒有腳，沒有手，沒有翅膀，但我卻能爬上天空。我是什麼？",
        answers: ["煙", "雲", "風箏", "飛機"],
        correctAnswer: "煙"
    },
    {
        question: "製造者不想要它。買家不使用它。使用者不知道它。我是什麼？",
        answers: ["棺材", "汽車", "房子", "衣服"],
        correctAnswer: "棺材"
    },
    {
        question: "一架飛機在墨西哥海岸墜毀，所有人都死了，但有兩名倖存者。這怎麼可能？",
        answers: ["這兩名倖存者是已婚夫婦。", "他們是醫生。", "他們是救援人員。", "他們是鬼魂。"],
        correctAnswer: "這兩名倖存者是已婚夫婦。"
    },
    {
        question: "什麼東西能跳得比建築物還高？",
        answers: ["任何能跳的東西，因為建築物不會跳。", "袋鼠", "兔子", "青蛙"],
        correctAnswer: "任何能跳的東西，因為建築物不會跳。"
    },
    {
        question: "一個男孩和一個醫生在釣魚。男孩是醫生的兒子，但醫生不是男孩的父親。這怎麼可能？",
        answers: ["醫生是男孩的母親。", "醫生是男孩的叔叔。", "醫生是男孩的祖父。", "醫生是男孩的教父。"],
        correctAnswer: "醫生是男孩的母親。"
    },
    {
        question: "西蒙的爸爸有四個兒子：三月、四月和五月。第四個兒子叫什麼名字？",
        answers: ["西蒙", "六月", "七月", "八月"],
        correctAnswer: "西蒙"
    },
    {
        question: "字典裡哪個詞拼錯了？",
        answers: ["“錯字”", "“不正確地”", "“錯誤”", "“拼錯”"],
        correctAnswer: "“錯字”"
    },
    {
        question: "什麼東西有一隻角並且會產奶？",
        answers: ["牛奶車", "牛", "羊", "獨角獸"],
        correctAnswer: "牛奶車"
    },
    {
        question: "雪人早餐吃什麼？",
        answers: ["冰脆片", "雪", "冰淇淋", "胡蘿蔔"],
        correctAnswer: "冰脆片"
    },
    {
        question: "我是一個三位數。我的第二位數字是第三位數字的四倍。我的第一位數字比我的第二位數字小三。這個數字是什麼？",
        answers: ["141", "282", "363", "484"],
        correctAnswer: "141"
    },
    {
        question: "兩位父親和兩位兒子坐在長凳上，但只有三個人坐著。怎麼回事？",
        answers: ["他們是祖父、父親和兒子。", "他們是兩對父子。", "他們是兄弟。", "他們是朋友。"],
        correctAnswer: "他們是祖父、父親和兒子。"
    },
    {
        question: "一個女孩的兄弟和姐妹一樣多，但每個兄弟的兄弟只有姐妹的一半。這個家庭有多少兄弟姐妹？",
        answers: ["四個姐妹和三個兄弟", "三個姐妹和兩個兄弟", "兩個姐妹和一個兄弟", "五個姐妹和四個兄弟"],
        correctAnswer: "四個姐妹和三個兄弟"
    },
    {
        question: "它充滿了鑰匙但打不開任何門。",
        answers: ["鋼琴", "鍵盤", "鎖", "保險箱"],
        correctAnswer: "鋼琴"
    },
    {
        question: "你在哪裡能找到星期五在星期四之前？",
        answers: ["字典裡", "日曆裡", "學校裡", "家裡"],
        correctAnswer: "字典裡"
    },
    {
        question: "如果你把一塊白色的石頭扔進紅海，會發生什麼？",
        answers: ["它會變濕。", "它會沉下去。", "它會漂浮起來。", "它會變紅。"],
        correctAnswer: "它會變濕。"
    },
    {
        question: "我整天飛，但哪兒也沒去。我是什麼？",
        answers: ["旗幟", "風箏", "鳥", "飛機"],
        correctAnswer: "旗幟"
    },
    {
        question: "什麼東西每分鐘出現一次，每時每刻出現兩次，但千年不出現？",
        answers: ["字母“m”", "字母“e”", "字母“t”", "字母“o”"],
        correctAnswer: "字母“m”"
    },
    {
        question: "什麼東西有頭有尾但沒有身體？",
        answers: ["硬幣", "蛇", "魚", "鳥"],
        correctAnswer: "硬幣"
    },
    {
        question: "什麼東西能環遊世界卻待在原地？",
        answers: ["郵票", "地球儀", "地圖", "指南針"],
        correctAnswer: "郵票"
    },
    {
        question: "什麼東西只有一隻腳，一個頭，四條腿？",
        answers: ["床", "椅子", "桌子", "沙發"],
        correctAnswer: "床"
    },
    {
        question: "字母表中有多少個字母？",
        answers: ["十一個。T-h-e-a-l-p-h-a-b-e-t。", "26個", "24個", "28個"],
        correctAnswer: "十一個。T-h-e-a-l-p-h-a-b-e-t。"
    },
    {
        question: "你如何讓數字一消失？",
        answers: ["在它後面加一個“g”，它就消失了。", "把它刪掉。", "把它塗掉。", "把它藏起來。"],
        correctAnswer: "在它後面加一個“g”，它就消失了。"
    },
    {
        question: "如果二為伴，三為眾，那麼四和五加起來是多少？",
        answers: ["九", "七", "八", "十"],
        correctAnswer: "九"
    },
    {
        question: "如果你在跑步比賽中超過了第二名，你現在是第幾名？",
        answers: ["第二名", "第一名", "第三名", "第四名"],
        correctAnswer: "第二名"
    },
    {
        question: "她嫁給過許多男人，但從未結過婚。她是誰？",
        answers: ["牧師", "律師", "醫生", "老師"],
        correctAnswer: "牧師"
    },
    {
        question: "用三個字母拼寫敵人。",
        answers: ["Foe", "Enm", "Emy", "Nmy"],
        correctAnswer: "Foe"
    },
    {
        question: "我位於昨天跟隨今天，明天在中間的地方。我是什麼？",
        answers: ["字典", "日曆", "時鐘", "地圖"],
        correctAnswer: "字典"
    },
    {
        question: "在哪裡你可以將2加到11得到1？",
        answers: ["時鐘", "計算器", "數學題", "遊戲"],
        correctAnswer: "時鐘"
    },
    {
        question: "摩西帶了多少隻動物上方舟？",
        answers: ["沒有。是諾亞建造並裝載方舟的。", "兩隻", "每種一對", "很多動物"],
        correctAnswer: "沒有。是諾亞建造並裝載方舟的。"
    },
    {
        question: "什麼東西有三隻腳但不能走路？",
        answers: ["碼尺", "三腳架", "桌子", "椅子"],
        correctAnswer: "碼尺"
    },
    {
        question: "說出四個以字母“T”開頭的星期幾。",
        answers: ["星期二、星期四、今天和明天。", "星期一、星期二、星期三、星期四", "星期五、星期六、星期日、星期一", "星期二、星期三、星期四、星期五"],
        correctAnswer: "星期二、星期四、今天和明天。"
    },
    {
        question: "哪個房間沒有牆壁？",
        answers: ["蘑菇", "帳篷", "洞穴", "圓形房間"],
        correctAnswer: "蘑菇"
    },
    {
        question: "什麼東西有四隻眼睛但看不見？",
        answers: ["密西西比", "眼鏡", "望遠鏡", "顯微鏡"],
        correctAnswer: "密西西比"
    },
    {
        question: "門什麼時候不是門？",
        answers: ["當它半開著的時候。", "當它關著的時候。", "當它打開的時候。", "當它壞掉的時候。"],
        correctAnswer: "當它半開著的時候。"
    },
    {
        question: "哪個詞以IS開頭，以AND結尾，中間有LA？",
        answers: ["Island", "Iceland", "Ireland", "India"],
        correctAnswer: "Island"
    },
    {
        question: "什麼東西有脖子但沒有頭？",
        answers: ["瓶子", "衣服", "吉他", "小提琴"],
        correctAnswer: "瓶子"
    },
    {
        question: "世界上最冷的國家是哪個？",
        answers: ["辣椒", "俄羅斯", "加拿大", "南極洲"],
        correctAnswer: "辣椒"
    },
    {
        question: "什麼東西移動得更快：熱還是冷？",
        answers: ["熱，因為你總能感冒。", "熱", "冷", "一樣快"],
        correctAnswer: "熱，因為你總能感冒。"
    },
    {
        question: "向前我很重，向後我不重。我是什麼？",
        answers: ["一噸", "一塊石頭", "一本書", "一個想法"],
        correctAnswer: "一噸"
    },
    {
        question: "什麼東西有很多鑰匙但打不開門？",
        answers: ["鋼琴", "鍵盤", "鎖", "保險箱"],
        correctAnswer: "鋼琴"
    },
    {
        question: "什麼樣的裙子永遠不能穿？",
        answers: ["地址", "紙裙", "空氣裙", "水裙"],
        correctAnswer: "地址"
    },
    {
        question: "什麼東西有一隻眼睛但看不見？",
        answers: ["針", "釘子", "螺絲", "鉤子"],
        correctAnswer: "針"
    },
    {
        question: "什麼東西從不提問但總會得到回答？",
        answers: ["電話", "書", "收音機", "電視"],
        correctAnswer: "電話"
    },
    {
        question: "什麼東西會破裂但從不落下，什麼東西會落下但從不破裂？",
        answers: ["天亮了，夜幕降臨。", "玻璃", "冰", "泡沫"],
        correctAnswer: "天亮了，夜幕降臨。"
    },
    {
        question: "什麼東西每分鐘出現一次，每時每刻出現兩次，但千年不出現？",
        answers: ["字母“m”", "字母“e”", "字母“t”", "字母“o”"],
        correctAnswer: "字母“m”"
    },
    {
        question: "一份報紙的單頁手工對折的最大次數是多少？",
        answers: ["一次", "兩次", "三次", "四次"],
        correctAnswer: "一次"
    },
    {
        question: "我如此脆弱，如果你說出我的名字，你就會打破我。我是什麼？",
        answers: ["寂靜", "玻璃", "冰", "泡沫"],
        correctAnswer: "寂靜"
    },
    {
        question: "如果公雞在穀倉屋頂上生了一個蛋，它會往哪個方向滾？",
        answers: ["公雞不會下蛋。", "向東", "向西", "向南"],
        correctAnswer: "公雞不會下蛋。"
    },
    {
        question: "哪個按鈕無法解開？",
        answers: ["肚臍", "衣服鈕扣", "門鈕", "遙控器按鈕"],
        correctAnswer: "肚臍"
    },
    {
        question: "什麼東西經常在地上卻從不臟或弄髒？",
        answers: ["影子", "灰塵", "泥土", "水"],
        correctAnswer: "影子"
    },
    {
        question: "世界上哪棟建築的故事比任何其他建築都多？",
        answers: ["圖書館", "博物館", "摩天大樓", "城堡"],
        correctAnswer: "圖書館"
    },
    {
        question: "什麼時候遇到白貓是壞運氣？",
        answers: ["當你是老鼠的時候。", "當你是狗的時候。", "當你是鳥的時候。", "當你是魚的時候。"],
        correctAnswer: "當你是老鼠的時候。"
    },
    {
        question: "MT_TF_S 缺少了什麼字母？為什麼？",
        answers: ["W和S，因為是星期幾。", "A和B", "C和D", "E和F"],
        correctAnswer: "W和S，因為是星期幾。"
    },
    {
        question: "熊貓有什麼是其他動物沒有的？",
        answers: ["小熊貓", "竹子", "黑白相間的皮毛", "大大的眼睛"],
        correctAnswer: "小熊貓"
    },
    {
        question: "我繞著城市跑，但我從不動。我是什麼？",
        answers: ["牆", "河流", "道路", "火車"],
        correctAnswer: "牆"
    },
    {
        question: "你如何將生雞蛋掉到水泥地上而不弄碎它？",
        answers: ["水泥地很難弄碎。", "用軟墊接住。", "把它放在碗裡。", "用手接住。"],
        correctAnswer: "水泥地很難弄碎。"
    },
    {
        question: "如果猴子、松鼠和鳥比賽爬椰子樹，誰會先拿到香蕉？",
        answers: ["椰子樹不長香蕉。", "猴子", "松鼠", "鳥"],
        correctAnswer: "椰子樹不長香蕉。"
    },
    {
        question: "我有牙齒但我不能吃，我是什麼？",
        answers: ["梳子", "鋸子", "拉鍊", "耙子"],
        correctAnswer: "梳子"
    }
];

// Ensure we have enough questions for all booklets
if (allQuestions.length < totalBooklets) {
    console.error("Not enough questions for all booklets! Please add more questions.");
    while (allQuestions.length < totalBooklets) {
        allQuestions.push(allQuestions[Math.floor(Math.random() * allQuestions.length)]);
    }
}

/**
 * Shuffles an array in place (Fisher-Yates algorithm).
 * @param {Array} array - The array to shuffle.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Checks for overlap between two rectangles.
 * @param {object} rect1 - The first rectangle {x, y, width, height}.
 * @param {object} rect2 - The second rectangle {x, y, width, height}.
 * @returns {boolean} True if rectangles overlap, false otherwise.
 */
function isOverlapping(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}


function showMessage(message) {
    messageTextElement.textContent = message;
    messageContainer.classList.add('show');
    if (!message.startsWith('恢復中')) { // Updated for Chinese
        setTimeout(() => {
            messageContainer.classList.remove('show');
        }, 2000);
    }
}

function spawnPipe() {
  const topHeight = Math.floor(Math.random() * (gameHeight - pipeGap - 100)) + 20; // Use gameHeight
  pipes.push({
    x: gameWidth, // Use gameWidth
    topHeight: topHeight,
    bottomY: topHeight + pipeGap
  });

  const newPipe = pipes[pipes.length - 1]; // Get the newly created pipe

  // Attempt to place booklet randomly, avoiding overlap with pipes
  let bookletY;
  const bookletSize = 20;
  const maxAttempts = 100;
  let attempts = 0;
  let validPositionFound = false;

  while (!validPositionFound && attempts < maxAttempts) {
      // Random Y position across the entire gameHeight
      bookletY = Math.floor(Math.random() * (gameHeight - bookletSize)); // Use gameHeight

      const bookletRect = {
          x: newPipe.x + pipeWidth / 2 - (bookletSize / 2),
          y: bookletY,
          width: bookletSize,
          height: bookletSize
      };

      const topPipeRect = {
          x: newPipe.x,
          y: 0,
          width: pipeWidth,
          height: newPipe.topHeight
      };

      const bottomPipeRect = {
          x: newPipe.x,
          y: newPipe.bottomY,
          width: pipeWidth,
          height: gameHeight - newPipe.bottomY // Use gameHeight
      };

      // Check if booklet overlaps with the new top pipe or new bottom pipe
      if (!isOverlapping(bookletRect, topPipeRect) && !isOverlapping(bookletRect, bottomPipeRect)) {
          validPositionFound = true;
      }
      attempts++;
  }

  // Fallback to placing it in the pipe gap if no valid random position found
  if (!validPositionFound) {
      const minBookletYInGap = newPipe.topHeight + 10;
      const maxBookletYInGap = newPipe.topHeight + pipeGap - 10 - bookletSize;
      bookletY = Math.floor(Math.random() * (maxBookletYInGap - minBookletYInGap + 1)) + minBookletYInGap;
  }

  booklets.push({
      x: newPipe.x + pipeWidth / 2 - (bookletSize / 2),
      y: bookletY,
      size: bookletSize,
      status: 'uncollected',
      questionIndex: pipes.length - 1
  });
}

function update(deltaTime) {
    if (!gameRunning || questionActive) return;

    // Update player
    player.velocityY += player.gravity * deltaTime;
    player.y += player.velocityY * deltaTime;

    // Boundary checks for player (use gameHeight)
    if (player.y + player.height > gameHeight) {
        player.y = gameHeight - player.height;
        endGame("你撞到地面了！");
        return;
    }
    if (player.y < 0) {
        player.y = 0;
        player.velocityY = 0;
        endGame("你撞到天花板了！"); // Added explicit ceiling collision
        return;
    }

    // Update pipes
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed * deltaTime;
    }

    // Remove off-screen pipes
    while (pipes.length && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
    }

    // Spawn new pipe every ~250px (adjust as needed)
    if (pipes.length === 0 || pipes[pipes.length - 1].x < gameWidth - 250) { // Use gameWidth
        spawnPipe();
    }

    // Update booklets and check for collision
    booklets.forEach(booklet => {
        if (booklet.status === 'uncollected') {
            booklet.x -= pipeSpeed * deltaTime;

            // Check for booklet collision (player is a rectangle, booklet is a rectangle)
            if (player.x < booklet.x + booklet.size &&
                player.x + player.width > booklet.x &&
                player.y < booklet.y + booklet.size &&
                player.y + player.height > booklet.y) {
                booklet.status = 'pending_question';
                triggerQuestion(booklet.questionIndex, booklet);
                return;
            }
        }
    });

    // Collision detection with pipes (player is a rectangle, pipes are rectangles)
    for (let pipe of pipes) {
        // Top pipe collision
        if (player.x < pipe.x + pipeWidth &&
            player.x + player.width > pipe.x &&
            player.y < pipe.topHeight) {
            endGame("你撞到水管了！");
            return;
        }
        // Bottom pipe collision
        if (player.x < pipe.x + pipeWidth &&
            player.x + player.width > pipe.x &&
            player.y + player.height > pipe.bottomY) {
            endGame("你撞到水管了！");
            return;
        }
    }

    // Check for win condition (now based on totalBooklets = 100)
    if (collectedBookletsCount >= totalBooklets) {
        showWinGlow = true; // Activate glow
        showEquianoEnding();
    }
}

function resizeCanvas() {
    // Get the actual rendered size of the canvas element
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save(); // Save the current state of the context

  // Calculate scaling factor to map logical game coordinates (gameWidth x gameHeight)
  // to the actual canvas drawing surface size.
  const scaleX = canvas.width / gameWidth;
  const scaleY = canvas.height / gameHeight;
  ctx.scale(scaleX, scaleY);

  // Now all drawing commands operate in the gameWidth x gameHeight logical space
  // and will be scaled to fit the actual canvas element's size.

  // Draw the white glow if active (using gameWidth here)
  if (showWinGlow) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Semi-transparent white
      ctx.fillRect(gameWidth - 50, 0, 50, gameHeight); // A white bar on the right
  }

  // Draw player as an animated pink brain (pulsing circle with fissure)
  ctx.fillStyle = '#FF69B4'; // Hot pink color for the brain
  ctx.strokeStyle = '#C71585'; // Medium Violet Red for border
  ctx.lineWidth = 2; // This linewidth will also be scaled

  const pulseFactor = 1 + Math.sin(performance.now() * 0.005) * 0.05; // Subtle pulsing effect
  const brainRadius = (player.width / 2) * pulseFactor;
  const brainCenterX = player.x + player.width / 2;
  const brainCenterY = player.y + player.height / 2;

  ctx.beginPath();
  ctx.arc(brainCenterX, brainCenterY, brainRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Add a simple central fissure line
  ctx.beginPath();
  ctx.moveTo(brainCenterX, brainCenterY - brainRadius * 0.8);
  ctx.lineTo(brainCenterX, brainCenterY + brainRadius * 0.8);
  ctx.stroke();


  // Draw pipes
  ctx.fillStyle = '#228B22'; // Forest green pipes
  ctx.strokeStyle = '#1a6a1a';
  for (let pipe of pipes) {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight); // Top pipe
    ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.topHeight);
    ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, gameHeight - pipe.bottomY); // Bottom pipe (use gameHeight)
    ctx.strokeRect(pipe.x, pipe.bottomY, pipeWidth, gameHeight - pipe.bottomY); // (use gameHeight)
  }

  // Draw booklets (now Golden Booklets)
  booklets.forEach(booklet => {
      if (booklet.status === 'uncollected') {
          ctx.fillStyle = '#FFD700'; // Golden Yellow for booklet
          ctx.fillRect(booklet.x, booklet.y, booklet.size, booklet.size);
          ctx.strokeStyle = '#B8860B'; // Darker gold border
          ctx.strokeRect(booklet.x, booklet.y, booklet.size, booklet.size);
      }
  });

  ctx.restore(); // Restore the context to its original state (remove scaling)
}

function gameLoop(timestamp) {
  if (!gameRunning) return;

  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  update(deltaTime);
  draw();
  requestAnimationFrame(gameLoop);
}

// New array to hold questions available for the current game session
let availableQuestions = [];

function initGame() {
    // Set initial values from global window variables
    playerNameInput.value = window.currentUserName;
    playerNameDisplay.textContent = window.currentUserName;
    highScoreElement.textContent = window.getUserHighScore();
    accumulatedScoreElement.textContent = window.getUserAccumulatedScore();

    // Enable player name input and save button
    playerNameInput.disabled = false;
    saveNameButton.disabled = false;

    // Set initial disabled state for play button based on current name
    playButton.disabled = playerNameInput.value.trim() === '';

    // Always enable the how to play and leaderboard buttons
    howToPlayButton.disabled = false;
    showLeaderboardButton.disabled = false;

    // Event listener for name input to enable/disable play button
    playerNameInput.addEventListener('input', () => {
        playButton.disabled = playerNameInput.value.trim() === '';
    });

    // Event listener for save name button
    saveNameButton.addEventListener('click', async () => {
        const newName = playerNameInput.value.trim();
        if (newName) {
            window.currentUserName = newName;
            playerNameDisplay.textContent = newName;
            if (window.getIsAuthReady()) { // Only update Firebase if authenticated
                await window.updateUserData(window.getCurrentUserId(), window.getUserHighScore(), 0);
                showMessage("名字已儲存！");
            } else {
                showMessage("名字已儲存 (離線模式)！"); // Inform user if offline
            }
            playButton.disabled = false; // Ensure play button is enabled after saving name
        } else {
            showMessage("請輸入一個名字。");
            playButton.disabled = true;
        }
    });
}


function startGame() {
  player.y = gameHeight / 2; // Reset player to center Y (use gameHeight)
  player.velocityY = 0;
  pipes.length = 0;
  booklets.length = 0; // Clear booklets as well
  collectedBookletsCount = 0;
  questionsAnsweredCorrectly = 0;
  gameRunning = true;
  questionActive = false; // Ensure no question is active at start
  showWinGlow = false; // Reset glow state

  startScreen.style.display = 'none';
  gameOverScreen.style.display = 'none';
  equianoEndingScreen.style.display = 'none';
  howToPlayOverlay.style.display = 'none'; // Hide instructions
  leaderboardOverlay.style.display = 'none'; // Hide leaderboard
  canvas.style.display = 'block';

  // Update current score display to 0 for a new game
  currentScoreElement.textContent = 0;

  // Populate and shuffle availableQuestions for the new game
  availableQuestions = [...allQuestions]; // Create a shallow copy
  shuffleArray(availableQuestions);

  // Initialize and start background music (Van Halen - Jump approximation)
  if (!backgroundMusic) {
      const synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: {
              type: "triangle"
          }
      }).toDestination();

      const jumpNotes = [
          { time: "0:0", note: "C4", duration: "8n" },
          { time: "0:0.5", note: "E4", duration: "8n" },
          { time: "0:1", note: "G4", duration: "8n" },
          { time: "0:1.5", note: "C5", duration: "8n" },
          { time: "0:2", note: "Bb4", duration: "8n" },
          { time: "0:2.5", note: "G4", duration: "8n" },
          { time: "0:3", note: "E4", duration: "8n" },
          { time: "0:3.5", note: "C4", duration: "8n" },
          { time: "0:4", note: "D4", duration: "8n" },
          { time: "0:4.5", note: "F4", duration: "8n" },
          { time: "0:5", note: "A4", duration: "8n" },
          { time: "0:5.5", note: "D5", duration: "8n" },
          { time: "0:6", note: "C5", duration: "8n" },
          { time: "0:6.5", note: "A4", duration: "8n" },
          { time: "0:7", note: "F4", duration: "8n" },
          { time: "0:7.5", note: "D4", duration: "8n" }
      ];

      backgroundMusic = new Tone.Sequence((time, note) => {
          synth.triggerAttackRelease(note.note, note.duration, time);
      }, jumpNotes, "8n").start(0);

      Tone.Transport.bpm.value = 120; // Set a reasonable tempo
  }
  Tone.Transport.start();

  // Generate initial pipes and booklet
  spawnPipe();

  lastTime = performance.now();
  requestAnimationFrame(gameLoop);
}

function jump() {
  if (gameRunning && !questionActive) {
    player.velocityY = player.jumpPower;
  }
}

function triggerQuestion(qIndex, booklet) {
    // Check if there are available questions
    if (availableQuestions.length === 0) {
        showMessage("所有問題都已回答！");
        questionActive = false; // Allow game to continue without questions
        // If all questions are answered, and we haven't reached totalBooklets,
        // the game might continue without new questions. Consider game ending here.
        if (collectedBookletsCount < totalBooklets) {
             // If all unique questions exhausted before reaching target, end game
             showEquianoEnding(); // Or a different ending for question exhaustion
        }
        return;
    }

    questionActive = true;
    // Get the next question from the shuffled availableQuestions and remove it
    currentQuestion = availableQuestions.shift(); // This ensures no repeats within a game session
    currentTriggeredBooklet = booklet;

    player.velocityY = 0; // Reset player velocity when question is triggered

    questionTextElement.textContent = currentQuestion.question;
    questionOptionsContainer.innerHTML = '';

    currentQuestion.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.classList.add('question-option');
        button.textContent = answer;
        button.addEventListener('click', () => handleAnswer(answer, currentQuestion.correctAnswer, button));
        questionOptionsContainer.appendChild(button);
    });

    questionTimeLeft = 15;
    questionTimerDisplay.textContent = `時間：${questionTimeLeft}秒`;
    clearInterval(questionTimerInterval);
    questionTimerInterval = setInterval(updateQuestionTimer, 1000);

    questionOverlay.style.display = 'flex';
}

function updateQuestionTimer() {
    if (questionTimeLeft > 0) {
        questionTimeLeft--;
        questionTimerDisplay.textContent = `時間：${questionTimeLeft}秒`;
    } else {
        clearInterval(questionTimerInterval);
        handleAnswer("TIME_OUT", currentQuestion.correctAnswer, null);
    }
}

function handleAnswer(selectedAnswer, correctAnswer, clickedButton) {
    clearInterval(questionTimerInterval);

    Array.from(questionOptionsContainer.children).forEach(button => button.disabled = true);

    if (selectedAnswer === correctAnswer) {
        questionsAnsweredCorrectly++;
        collectedBookletsCount++;
        currentScoreElement.textContent = collectedBookletsCount; // Update current score display
        showMessage("正確！");
        if (clickedButton) clickedButton.classList.add('correct');
    } else {
        showMessage("錯誤！未收集黃金小冊子。");
        currentTriggeredBooklet.status = 'failed_question';
        if (clickedButton) clickedButton.classList.add('incorrect');
        Array.from(questionOptionsContainer.children).forEach(button => {
            if (button.textContent === correctAnswer) {
                button.classList.add('correct');
            }
        });
    }

    questionOverlay.style.display = 'none';

    countdownTime = 3;
    showMessage(`恢復中 ${countdownTime}...`);
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        countdownTime--;
        if (countdownTime > 0) {
            showMessage(`恢復中 ${countdownTime}...`);
        } else {
            clearInterval(countdownInterval);
            messageContainer.classList.remove('show');
            questionActive = false;
            player.velocityY = 0; // Ensure player starts from a consistent state after countdown
            if (!gameRunning) {
                requestAnimationFrame(gameLoop);
            }
        }
    }, 1000);
}

/**
 * Returns a score-based message.
 * @param {number} score - The number of correctly answered questions.
 * @returns {string} The corresponding message.
 */
function getScoreMessage(score) {
    if (score >= 0 && score <= 10) {
        return "你...需要加油了。";
    } else if (score >= 11 && score <= 20) {
        return "好，至少你還有一點智商。";
    } else if (score >= 21 && score <= 30) {
        return "還不錯喔！是個一般智商的民眾。";
    } else if (score >= 31 && score <= 40) {
        return "哇，你非常有潛能當個高智商人。";
    } else if (score >= 41 && score <= 50) {
        return "你是個高智商人。不要再玩遊戲了。去經營你的成功人生。";
    } else if (score > 50) {
        return "可以教我怎麼變成你嗎？";
    }
    return ""; // Default empty string if score is out of expected range
}

function endGame(reason) {
    gameRunning = false;
    Tone.Transport.stop(); // Stop background music
    gameOverScreen.style.display = 'flex';
    
    const scoreMessage = getScoreMessage(questionsAnsweredCorrectly);
    gameOverTextElement.textContent = `${reason} 你答對了 ${questionsAnsweredCorrectly} 個問題。${scoreMessage}`;

    // Update Firebase scores
    if (window.getIsAuthReady()) {
        const currentHighScore = window.getUserHighScore();
        const newHighScore = Math.max(currentHighScore, questionsAnsweredCorrectly); // Use questionsAnsweredCorrectly for high score
        window.updateUserData(window.getCurrentUserId(), newHighScore, questionsAnsweredCorrectly);
    }
}

function showEquianoEnding() {
    gameRunning = false;
    Tone.Transport.stop(); // Stop background music
    equianoEndingScreen.style.display = 'flex';
    
    const scoreMessage = getScoreMessage(questionsAnsweredCorrectly);
    equianoEndingTextElement.textContent = `恭喜你完成挑戰！你答對了 ${questionsAnsweredCorrectly} 個問題。${scoreMessage}`; // Updated message

    // Update Firebase scores for win condition
    if (window.getIsAuthReady()) {
        const currentHighScore = window.getUserHighScore();
        const newHighScore = Math.max(currentHighScore, questionsAnsweredCorrectly); // Use questionsAnsweredCorrectly for high score
        window.updateUserData(window.getCurrentUserId(), newHighScore, questionsAnsweredCorrectly);
    }
}

// Event Listeners for new buttons
howToPlayButton.addEventListener('click', () => {
    howToPlayOverlay.style.display = 'flex';
});

closeHowToPlayButton.addEventListener('click', () => {
    howToPlayOverlay.style.display = 'none';
});

showLeaderboardButton.addEventListener('click', () => {
    leaderboardOverlay.style.display = 'flex';
});

closeLeaderboardButton.addEventListener('click', () => {
    leaderboardOverlay.style.display = 'none';
});


startButton.addEventListener("click", () => {
    startGame();
});

restartButton.addEventListener('click', () => {
    startScreen.style.display = 'flex'; // Show start screen on restart
    startGame();
});
restartButtonEnding.addEventListener('click', () => {
    startScreen.style.display = 'flex'; // Show start screen on restart
    startGame();
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

// Initial draw to set up the start screen
draw();

// Call initGame once Firebase is ready
window.addEventListener('load', () => {
    // Wait for Firebase auth to be ready before initializing game elements
    const checkFirebaseReady = setInterval(() => {
        if (window.getIsAuthReady()) {
            clearInterval(checkFirebaseReady);
            initGame();
            resizeCanvas(); // Call resizeCanvas after initGame
        }
    }, 100);
});

window.addEventListener('resize', resizeCanvas); // Add resize listener
