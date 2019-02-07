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
  "Sorry. That was not the correct answer.",
  "Close, but not correct.",
  "No. Unfortunately, your answer was incorrect.",
];

function randomizeQuestionOrder() {
  Array.prototype.shuffle = function() {
      var input = this;
      
      for (var i = input.length-1; i >=0; i--) {
      
          var randomIndex = Math.floor(Math.random()*(i+1)); 
          var itemAtIndex = input[randomIndex]; 
          
          input[randomIndex] = input[i]; 
          input[i] = itemAtIndex;
      }
      return input;
  }
  ITEMBANK.shuffle();
}

function resetQuizCounters() {
  totalQuestions = ITEMBANK.length;
  currentQuestion = 0;
  currentScore = 0;
}

function updateProgress() {
  let qNumForDisplay = currentQuestion + 1;
  let currScoreMsg = `Your score: ${currentScore}`
  $('.quiz-progress-indicator').text(`Question ${qNumForDisplay} of ${totalQuestions}...`);
  $('.quiz-current-score').text(currScoreMsg);
  $('.lower-score-display').text(currScoreMsg);
}

function setActiveQuizPhase(targetPhase) {
  $('.quiz-phase').removeClass("toggle__active");
  targetPhase.addClass("toggle__active");
}

function quizIntro() {
  $(".current-image").attr({
    src: "images/Pong.jpg",
    alt: "pong video game image"
  });
  $('.quiz-progress-indicator').text("");
  $('.quiz-current-score').text("");
   setActiveQuizPhase($('#quiz-start'));
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

function provideFeedback(feedbackType, corrAns) {
  let feedbackText = "";
  let rnd = function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  };

  if (feedbackType === "correct") {
    $('.answer-feedback').addClass("correct");
    $('.answer-feedback').removeClass("incorrect");
    feedbackText = positiveFeedback[rnd(positiveFeedback.length)];
    $('.answer-feedback').html(`<p>${feedbackText}</p>`);
  } else {
    $('.answer-feedback').addClass("incorrect");
    $('.answer-feedback').removeClass("correct");
    feedbackText = negativeFeedback[rnd(negativeFeedback.length)];
    $('.answer-feedback').html(`<p>${feedbackText} <br><br>The correct answer was "${corrAns}".</p>`);
  }
}

function presentSummary() {
    $("[class^=col-]").css("display", "none");
    setActiveQuizPhase($('#quiz-complete'));
}

function btnHndlr_BeginQuiz() {
  $('#quiz-start').on('click', `.btn-begin-quiz`, event => {
    event.preventDefault();
    resetQuizCounters();
    $(".current-image").attr({
        src: "",
        alt: "",
    });
    updateProgress();
    $("fieldset").html(renderQuestion(currentQuestion));
    $(".btn-submit-answer").toggleClass("toggle__active");
    setActiveQuizPhase($('#quiz-in-progress'));
  });
}

function btnHndlr_SubmitAnswer() {
  $('form').on('submit', function (event) {
    event.preventDefault();
    let selected = $('input[name="poss-answers"]:checked');
    let answer = $(selected).val();
    let correctAnswer = `${ITEMBANK[currentQuestion].correctAnswer}`;
    
    $(".btn-submit-answer").toggleClass("toggle__active");

    $(".current-image").attr({
      src: ITEMBANK[currentQuestion].displayImg,
      alt: ITEMBANK[currentQuestion].alt
    });

    if (answer === correctAnswer) {
      currentScore++;
      updateProgress();
      provideFeedback("correct");
    } else {
      provideFeedback("incorrect", correctAnswer);
    }

    $('.advance-to-next').addClass("toggle__active");
    
  });
}

function btnHndlr_Next() {
  $('#quiz-in-progress').on('click', `.btn-next`, event => {
    event.preventDefault();

    if (currentQuestion + 1 === totalQuestions) {
      presentSummary();
    } else {
      currentQuestion++;
      updateProgress();
      
      $('.advance-to-next').removeClass("toggle__active");
      $(".current-image").attr({
          src: "",
          alt: "",
      });

      $('.answer-feedback').empty();

      $("fieldset").html(renderQuestion(currentQuestion));
      $(".btn-submit-answer").toggleClass("toggle__active");
    }
  });
}

function btnHndlr_RestartQuiz() {
  $('#quiz-complete').on('click', `.btn-quiz-restart`, event => {
    event.preventDefault();

    console.log("btnHndlr_RestartQuiz ran");
    
    resetQuizCounters();
    $("[class^=col-]").css("display", "flex");
    $('.answer-feedback').empty();
    $('.advance-to-next').removeClass("toggle__active");
    quizIntro();    
  });
}

function launchQuiz() {
  randomizeQuestionOrder();
  quizIntro();
  btnHndlr_BeginQuiz();
  btnHndlr_SubmitAnswer();
  btnHndlr_Next();
  btnHndlr_RestartQuiz();
}

// when the page loads, call `launchQuiz`
$(launchQuiz);