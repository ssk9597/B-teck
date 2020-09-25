"use strict";

const btn = document.querySelector("#btn");

btn.addEventListener("click", () => {
  /* HTMLの要素をJSで修正できるように */
  const headline = document.querySelector("#headline");
  const genre = document.querySelector("#genre");
  const difficulty = document.querySelector("#difficulty");
  const message = document.querySelector("#message");
  const btnWrapper = document.querySelector(".btn-wrapper");
  const homeWrapperABtn = document.querySelector(".home-wrapper > a > button");
  const answerWrapper = document.querySelector(".answer-wrapper");
  let answersActive = document.getElementsByClassName("active");

  //問題をこの配列に代入する
  const quizArray = [];

  //arrayの0番目を取り出す、count_up
  let quizNum = 0;

  //正答数を管理する変数
  let score = 0;

  let questionsArry = [];

  /* -------------------------- */
  /*  取得中の画面を出力させる  */
  const acquiring = () => {
    //h2の内容を書き換え
    headline.innerHTML = "取得中";
    //h3の内容を書き換え
    message.innerHTML = "少々お待ちください";
    //.btn-wrapperの中身をすべて消す
    while (btnWrapper.firstChild) {
      btnWrapper.removeChild(btnWrapper.firstChild);
    }
  };
  /* -------------------------- */

  /* -------------------------- */
  /*  問題を非同期通信で取得  */
  async function callAPI() {
    const res = await fetch("https://opentdb.com/api.php?amount=10");
    const questions = await res.json();
    //check
    console.log(questions);

    //10問を１つずつに分解する
    for (let i = 0; i < questions.results.length; i++) {
      //関数outputIncorrectAnswerの実行
      /* 目的 */
      /* quizArrayのincorrect_answersに値を代入する */
      const outputAnswerCatalog = () => {
        const answersArray = [];

        for (
          let v = 0;
          v < questions.results[i].incorrect_answers.length;
          v++
        ) {
          const buttonText = document.createTextNode(
            questions.results[i].incorrect_answers[v]
          );
          answersArray.push(buttonText);
        }

        //正解の回答もこちらに代入しておく
        answersArray.push(questions.results[i].correct_answer);

        return answersArray;
      };
      /* -------------------------- */

      //配列objectにまとめて、配列quizArrayに代入、これを繰り返す
      const object = {
        category: "[ジャンル] " + questions.results[i].category,
        correct_answer: questions.results[i].correct_answer,
        difficulty: "[難易度]  " + questions.results[i].difficulty,
        incorrect_answers: outputAnswerCatalog(),
        question: questions.results[i].question,
      };
      quizArray.push(object);
    }

    //check
    console.log(quizArray);

    //回答をシャッフルする
    function shuffle(arry) {
      for (let i = arry.length - 1; i > 0; i--) {
        const r = Math.floor(Math.random() * (i + 1));
        //rとiを入れ替える
        [arry[r], arry[i]] = [arry[i], arry[r]];
      }
      //そのarryをreturnで返す
      return arry;
    }

    function createQuestionsArray() {
      //シャッフルさせる
      const shuffleAnswers = shuffle(quizArray[quizNum].incorrect_answers);

      questionsArry = [];
      //回答ボタンを出力
      for (let i = 0; i < quizArray[quizNum].incorrect_answers.length; i++) {
        //correct_answerとincorrect_answersで取り出し方が異なるため標準化する
        if (shuffleAnswers[i].data) {
          questionsArry.push(shuffleAnswers[i].data);
        } else {
          questionsArry.push(shuffleAnswers[i]);
        }
      }

      console.log(questionsArry);
      return questionsArry;
    }

    //問題を出力する関数outputQuiz
    function outputQuiz() {
      //問題番号を出力
      headline.innerHTML = "問題" + (quizNum + 1);
      //問題文を出力
      message.innerHTML = quizArray[quizNum].question;
      //ジャンルを出力
      genre.innerHTML = quizArray[quizNum].category;
      //難易度を出力
      difficulty.innerHTML = quizArray[quizNum].difficulty;

      //activeクラスを削除する
      console.log(answersActive);
      for (let i = 0; i < answersActive.length; i++) {
        answersActive[i].style.display = "none";
      }

      //回答ボタンを出力
      for (let i = 0; i < questionsArry.length; i++) {
        //ボタンタグを作る
        const button = document.createElement("button");
        //そのボタンに.answerをつける
        button.classList.add("active");

        //correct_answerとincorrect_answersで取り出し方が異なるため標準化する
        button.textContent = questionsArry[i];

        //.answer-wrapperの中に配置させる
        answerWrapper.append(button);
      }
    }

    createQuestionsArray();
    outputQuiz();

    //10問終わった後の画面出力の内容
    function announceResult() {
      //出力すべき内容
      headline.innerHTML = `あなたの正解数は、${score}です`;
      message.innerHTML = "再度チャレンジしたい場合は以下のボタンをクリック";
      homeWrapperABtn.classList.remove("hidden");

      //いらないもの
      while (answerWrapper.firstChild) {
        answerWrapper.removeChild(answerWrapper.firstChild);
      }
      genre.innerHTML = "";
      difficulty.innerHTML = "";
    }

    for (let i = 0; i < answersActive.length; i++) {
      //回答の正誤をチェック、正しければscoreに+1
      function checkAnswer() {
        if (answersActive[i].innerHTML === quizArray[quizNum].correct_answer) {
          score++;
          console.log(score);
        } else {
          console.log(score);
        }
      }

      answersActive[i].addEventListener("click", () => {
        checkAnswer();

        if (quizNum === quizArray.length - 1) {
          announceResult();
        } else {
          quizNum++;
          createQuestionsArray();
          outputQuiz();
        }
      });
    }
  }

  acquiring();

  callAPI();
});