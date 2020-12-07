class quizData {
    constructor(questions) {
        this.quizez = questions.results;
        this.correctAnswersNum = 0;
    }

    getQuizCategory(index) {
        return this.quizez[index - 1].category;
    }
    getQuizDifficulty(index) {
        return this.quizez[index - 1].difficulty;
    }
    getQuizquestion(index) {
        return this.quizez[index - 1].question;
    }
    getCorrectAnswer(index) {
        return this.quizez[index - 1].correct_answer;
    }
    getIncorrectAnswers(index) {
        return this.quizez[index - 1].incorrect_answers;
    }
    getNumOfQuizez() {
        return this.quizez.length;
    }
    countCorrectAnswers(index, quizAnswer) {
        const correctAnswer = this.quizez[index - 1].correct_answer;
        if (correctAnswer === quizAnswer) {
            return this.correctAnswersNum++;
        }
    }
    getCorrectAnswersNum() {
        return this.correctAnswersNum;
    }
}

const resart = document.getElementById(`restart`);
const question = document.getElementById("question");
const questionnum = document.getElementById("questionnum");
const category = document.getElementById("category");
const difficulty = document.getElementById("difficulty");
const start = document.getElementById("start");
const answers =document.getElementById("answers");

// クイズデータを取得する関数
const fetchQuizData = async(index) => {
    questionnum.innerHTML　= "取得中";
    question.innerHTML = "少々お待ちください";
    const responce = await fetch('https://opentdb.com/api.php?amount=10');
    const questions = await responce.json();
    const quizInstance = new quizData(questions);
    setupQuiz(quizInstance, index);
};
   
// クイズをセットする関数
const setupQuiz = (quizInstance, index) => {
    questionnum.innerHTML = `問題${index}`;
    category.innerHTML = `[ジャンル]${quizInstance.getQuizCategory(index)}`;    
    difficulty.innerHTML = `[難易度]${quizInstance.getQuizDifficulty(index)}`; 
    question.innerHTML = quizInstance.getQuizquestion(index);
    // answerボタンを作成
    const quizAnswers = makeAnswers(quizInstance, index);
    quizAnswers.forEach((quizAnswer) => {
        const li = document.createElement('li');
        answers.appendChild(li);
        const button = document.createElement('button');
        button.innerHTML = quizAnswer;
        li.appendChild(button);

        // 答えをクリックしたら次の問題へ進む
        button.addEventListener('click', () => {
            const a = quizInstance.countCorrectAnswers(index, quizAnswer);
            index++;
            clickHandler(quizInstance, index);
        });
    }); 
};

// 答えをクリックしたら次の問題へ進むか否かを判断する関数
const clickHandler = (quizInstance, index) => {
    while (answers.firstChild) {
        answers.removeChild(answers.firstChild);
    }
    if (index <= quizInstance.getNumOfQuizez()) {
        setupQuiz(quizInstance, index);
    } else {
        questionnum.innerHTML = `あなたの正答数は${quizInstance.getCorrectAnswersNum()}個でした！`;
        category.innerHTML = "";    
        difficulty.innerHTML = "";
        question.innerHTML = "もう一度チャレンジするには以下のボタンをクリック！";
        resart.style.display = "block";
    }
};

// クイズスタート
start.addEventListener('click', () => {
    start.style.display = "none";
    fetchQuizData(1);
});

// 「ホームに戻る」ボタンを押してリロードし、ホーム画面に戻る
restart.addEventListener("click", () => {
    location.reload();
});

// 答えの配列 
const makeAnswers = (quizInstance, index) => {
    const quizAnswers = [quizInstance.getCorrectAnswer(index), ...quizInstance.getIncorrectAnswers(index)];
    return shuffle(quizAnswers);
};
// 配列をシャッフルする関数
const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};


