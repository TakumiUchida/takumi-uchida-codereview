const start = document.getElementById("start");
const question = document.getElementById("question");
const questionnum = document.getElementById("questionnum");
const category = document.getElementById("category");
const difficulty = document.getElementById("difficulty");
const resart = document.getElementById(`restart`);
const answers =document.getElementById("answers");
let quizIndex = 1;
let quizArray = 0;
let score = 0;

// ホーム画面作成
const home = () => {
    resart.style.display = "none";
    questionnum.innerHTML = "ようこそ";
    question.innerHTML = "以下のボタンをクリック";
    start.style.display = "block";
    // 値をすべてリセット
    quizIndex = 1;
    quizArray = 0;
    score = 0;
}
home();

// クイズスタート
start.addEventListener("click", async () => {
    start.style.display = "none";
    questionnum.innerHTML　= "取得中";
    question.innerHTML = "少々お待ちください";
    const responce = await fetch('https://opentdb.com/api.php?amount=10');
    const questions = await responce.json();
    const quizInstance = questions.results;
    
    // クイズをセットする関数
    const setupQuiz = () => {
        questionnum.innerHTML = `問題${quizIndex}`;
        category.innerHTML = `[ジャンル]${quizInstance[quizArray].category}`;    
        difficulty.innerHTML = `[難易度]${quizInstance[quizArray].difficulty}`; 
        question.innerHTML = quizInstance[quizArray].question;
        // answerボタンを作成
        while (answers.firstChild) {
            answers.removeChild(answers.firstChild);
        }
        
        const makeAnswers = () => {
            const quizAnswers = [quizInstance[quizArray].correct_answer, ...quizInstance[quizArray].incorrect_answers];
            return shuffle(quizAnswers);
        }
        const quizAnswers = makeAnswers();
        
        quizAnswers.forEach((quizAnswer) => {
            const li = document.createElement('li');
            answers.appendChild(li);
            const button = document.createElement('button');
            button.classList.add("answer");
            button.innerHTML = quizAnswer;
            li.appendChild(button);
            // 答えをクリックしたら次の問題へ進む
            button.addEventListener('click', (e) => {
                clickHandler(e);
            });
        }); 
    }
    setupQuiz();

    // 答えをクリックしたら次の問題へ進むか否かを判断する関数
    const clickHandler = (e) => {
        if (quizInstance[quizArray].correct_answer === e.target.innerText)  {
            score++;
        }
        quizIndex++
        quizArray++
        if (quizIndex <= questions.results.length) {
            setupQuiz();
        } else {
            questionnum.innerHTML = `あなたの正答数は${score}個でした！`;
            category.innerHTML = "";    
            difficulty.innerHTML = "";
            question.innerHTML = "もう一度チャレンジするには以下のボタンをクリック！";
            resart.style.display = "block";
            while (answers.firstChild) {
                answers.removeChild(answers.firstChild);
            }
        }
    }

});

// 「ホームに戻る」ボタンを押してリロードし、ホーム画面に戻る
const restart = document.getElementById("restart");
restart.addEventListener("click", () => {
    location.reload();
});

// 配列をシャッフルする関数
const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }       




