# React quiz app

This project is my third project in my react learning journey in **React - The Complete Guide By Maximilian Shwarzmuller** , in this project the main goal was to expose myself and practice the following topics and hooks :

- Complex state handling in react and how to derive from states.
- Usage of useEffect() and useCallback().
- The concept of creating timers in react.

## App.jsx

```
function App() {
  return (
    <>
      <Header />
      <main>
        <Quiz />
      </main>
    </>
  );
}
```

This is the App.jsx where the application starts , using two Components **Header** which is a static one , and **Quiz** that is the engine of this project.

## Quiz.jsx

```
// Goal in this component is to show the current active question and when question answered switch to another question
import { act, useCallback, useState } from "react";
import { QUESTIONS } from "../../questions";
import Question from "../Question/Question";
import Summary from "../Summary/Summary";

export default function Quiz() {
  const [userAnswers, setUserAnswers] = useState([]);

  const activeQuestionIndex = userAnswers.length;
  const quizIsComplete = activeQuestionIndex === QUESTIONS.length;

  const handleSelectAnswer = useCallback(function handleSelectAnswer(
    selectedAnswer,
  ) {
    setUserAnswers((previousAnswers) => [...previousAnswers, selectedAnswer]);
  }, []);

  const handleSkipAnswer = useCallback(
    () => handleSelectAnswer(null),
    [handleSelectAnswer],
  );

  if (quizIsComplete) {
    return <Summary userAnswers={userAnswers} />;
  }

  return (
    <div id="quiz">
      <Question
        key={activeQuestionIndex}
        questionIndex={activeQuestionIndex}
        onSelectAnswer={handleSelectAnswer}
        onSkipAnswer={handleSkipAnswer}
      />
    </div>
  );
}
```

Using only **userAnswers** state this project runs

- **Deriving values:**
  - We first get the active question index based on how many answers there are
  - To know if the quiz is complete we check if index is equal to the length of our QUESTIONS array.

- **useCallback():**
  - We use useCallback to ensure handleSelectAnswer never get redefined again and this is to block the timer from running repeatedly and cause infinite loops

## Question.jsx

```
import QuestionTimer from "../QuestionTimer/QuestionTimer";
import Answers from "../Answers/Answers";
import { useState } from "react";
import { QUESTIONS } from "../../questions";

export default function Question({
  questionIndex,
  onSelectAnswer,
  onSkipAnswer,
}) {
  const [answer, setAnswer] = useState({
    selectedAnswer: "",
    isCorrect: null,
  });

  let timer = 10000;

  if (answer.selectedAnswer) {
    timer = 1000;
  }

  if (answer.isCorrect !== null) {
    timer = 2000;
  }

  function handleSelectAnswer(answer) {
    setAnswer({
      selectedAnswer: answer,
      isCorrect: null,
    });

    setTimeout(() => {
      setAnswer({
        selectedAnswer: answer,
        isCorrect: QUESTIONS[questionIndex].answers[0] === answer,
      });

      setTimeout(() => {
        onSelectAnswer(answer);
      }, 2000);
    }, 1000);
  }

  let answerState = "";

  if (answer.selectedAnswer && answer.isCorrect !== null) {
    answerState = answer.isCorrect ? "correct" : "wrong";
  } else if (answer.selectedAnswer) {
    answerState = "answered";
  }

  return (
    <div id="question">
      {" "}
      <QuestionTimer
        key={timer}
        timeout={timer}
        onTimeout={answer.selectedAnswer === "" ? onSkipAnswer : null}
        mode={answerState}
      />
      <h2>{QUESTIONS[questionIndex].text}</h2>
      <Answers
        answers={QUESTIONS[questionIndex].answers}
        selectedAnswer={answer.selectedAnswer}
        answerState={answerState}
        onSelect={handleSelectAnswer}
      />
    </div>
  );
}
```

In **Question.jsx** is where the quiz and time logic take place , we first use answerState so we can control the timer more , and block the bug if user pick an answer late

When he pick an answer we set selectedAnswer to 'Answer' and isCorrect is **null** and we set a time of 1 second to see if answer is right and after two seconds we display next question.

## QuestionTimer.jsx

```
import { useEffect, useState } from "react";

export default function QuestionTimer({ timeout, onTimeout, mode }) {
  const [remainingTime, setRemainingTime] = useState(timeout);

  // This will set a timer that run after a specific amount of time
  // We wrapped this around useEffect because when interval works the
  //  elemnet will be rendered again and we dont want setTimounout to work mutiple times
  useEffect(() => {
    console.log("SETTING TIMEOUT");
    const timer = setTimeout(onTimeout, timeout);

    return () => {
      clearTimeout(timer);
    };
  }, [onTimeout, timeout]);

  // This set something that runs repeatedly
  useEffect(() => {
    console.log("SETTING INTERVAL");
    const interval = setInterval(() => {
      setRemainingTime((previousTime) => previousTime - 100);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <progress
      value={remainingTime}
      max={timeout}
      id="question-time"
      className={mode}
    ></progress>
  );
}
```

Another main component of my project is the QuestionTimer , where this component is the Progress bar that represent the timer of the quiz
