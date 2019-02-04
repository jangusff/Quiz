'use strict';

let totalQuestions = 0;
let currentQuestion = 0;
let currentScore = 0;

const possAnswerTemplate = `<input type="radio" id="mult-choice-@@num@@" name="poss-answers" value="@@qval@@" required>\
                <label for="mult-choice-@@num@@">@@qval@@</label>\
                <br>`;
const btnSubmitAnswerHtml = `<button class="btn-submit-answer" type="submit">Submit Answer</button>`;

const positiveFeedback = [
  "Yes!  You got it right!!",
  "Well done!  That IS the correct answer!",
  "Way to go!   You're RIGHT!",
];

const negativeFeedback = [
  "Sorry. That is not the correct answer.",
  "Nope.  Sorry.",
  "No. Unfortunately, your answer was INCORRECT.",
];

function resetQuizCounters() {
  totalQuestions = ITEMBANK.length;
  currentQuestion = 0;
  currentScore = 0;
}


function updateProgress() {
  let qNumForDisplay = currentQuestion + 1;
  $('.quiz-progress-indicator').text(`Question ${qNumForDisplay.toString()} of ${totalQuestions.toString()}`);
  $('.quiz-current-score').text(`Your score: ${currentScore.toString()}`);
}

function setActiveQuizPhase(targetPhase) {
  $('.quiz-phase').removeClass("toggle__active");
  targetPhase.addClass("toggle__active");
}

function btnHndlr_BeginQuiz() {
  $('#quiz-start').on('click', `.btn-begin-quiz`, event => {
    resetQuizCounters();
    $(".current-image").attr("src","");
    updateProgress();
    $("fieldset").html(renderQuestion(currentQuestion));
    setActiveQuizPhase($('#quiz-in-progress'));
  });
}

function provideFeedback(fbakType, corrAns) {
  let feedbackText = "";
  let rnd = function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  };

  $('.answer-feedback').addClass(fbakType);

  if (fbakType === "correct") {
    feedbackText = positiveFeedback[rnd(positiveFeedback.length)];
    $('.answer-feedback').text(feedbackText);
    console.log(feedbackText);
  } else {
    feedbackText = negativeFeedback[rnd(negativeFeedback.length)];
    $('.answer-feedback').html(`${feedbackText} <br><br>The correct answer was "${corrAns}".`);
    console.log(feedbackText);
  }
}


function btnHndlr_SubmitAnswer() {
  $('form').on('submit', function (event) {
      event.preventDefault();
      let selected = $('input[name="poss-answers"]:checked');
      let answer = $(selected).val();
      let correctAnswer = `${ITEMBANK[currentQuestion].correctAnswer}`;
      console.log(`Selected: ${selected}. Answer: ${answer}. CorrAnswer: ${correctAnswer}.`);

      $(".current-image").attr({
        src: ITEMBANK[currentQuestion].displayImg,
        alt: ITEMBANK[currentQuestion].alt
      });

/**************
      document.getElementById("myBtn").disabled = true;
 */

      if (answer === correctAnswer) {
        currentScore++;
        provideFeedback("correct");
      } else {
        provideFeedback("incorrect", correctAnswer);
      }

      if (currentQuestion + 1 === totalQuestions) {
        setActiveQuizPhase($('#quiz-complete'));
      } else {
        $('.advance-to-next').addClass("toggle__active");
      }
      

    });
}

function btnHndlr_Next() {
  $('#quiz-in-progress').on('click', `.btn-next`, event => {
    updateProgress();
    currentQuestion++;

    console.log(`Next btn. Score now: ${currentScore}. QNum now: ${currentQuestion}.`);

    $('.advance-to-next').removeClass("toggle__active");
    $(".current-image").attr("src","");
    $("fieldset").html(renderQuestion(currentQuestion));
  });
}


function handleRestartQuiz() {
  $('#quiz-complete').on('click', `#btn-quiz-restart`, event => {
    console.log('`handleRestartQuiz` ran');
    
    resetQuizCounters();
    setActiveQuizPhase($('#quiz-in-progress'));
    
  });
}



function renderQuestion(questionNum) {
    let regexNum2Replace = /@@num@@/gi;
    let regexqVal2Replace = /@@qval@@/gi;

    let possAnswersHtml = "";
    let questionText = "<legend>" + ITEMBANK[questionNum].question + "</legend>";
    
    ITEMBANK[questionNum].answers.forEach(function(possAnswer, index) {
        possAnswersHtml += possAnswerTemplate.replace(regexNum2Replace, index).replace(regexqVal2Replace, possAnswer);
    });

    return questionText + possAnswersHtml + btnSubmitAnswerHtml;
}

/*
function presentQuiz() {
  for (currentQuestion = 0; i < ITEMBANK.length; i++ ) {
    let questionFieldSet = renderQuestion(currentQuestion);
    $("fieldset").html(questionFieldSet);
  }
}
*/

function quizIntro() {
  $(".current-image").attr({
    src: "images/Pong.jpg",
    alt: "pong video game image"
  });
  $('.quiz-progress-indicator').text("");
  $('.quiz-current-score').text("");
   setActiveQuizPhase($('#quiz-start'));
}

function launchQuiz() {
  
  console.log('Started.');
  quizIntro();
  btnHndlr_BeginQuiz();
  btnHndlr_SubmitAnswer();
 
  /*
  handleRestartQuiz();
  */

}

// when the page loads, call `handleShoppingList`
$(launchQuiz);