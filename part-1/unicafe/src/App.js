import React, { useState } from 'react';

const FeedbackButton = (props) => {

  return (
    <>
      <button onClick={props.clickHandler}>{props.text}</button>
    </>
  );
};

const Statistics = (props) => {
  const { good, neutral, bad } = props.feedbacks;

  const totalFeedbacks = () => {

    return (good + neutral + bad);
  };

  if (good === 0 && neutral === 0 && bad === 0) {

    return (<p>No feedback given</p>)
  }

  return (
    <table>
      <tbody>
      <Statistic text="good" value={good} />
      <Statistic text="neutral" value={neutral} />
      <Statistic text="bad" value={bad} />
      <Statistic text="all" value={totalFeedbacks()} />
      <Statistic
        text="average"
        value={((good - bad) / totalFeedbacks())} />
      <Statistic
        text="positive"
        value={`${((good / totalFeedbacks()) * 100)} %`}
      />
      </tbody>
    </table>
  );
};

const Statistic = (props) => {

  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);


  const addFeedback = (feedbackCount, changeFeedbackCount) => {
    const handler = () => {
      changeFeedbackCount(feedbackCount + 1)
    };

    return handler;
  };

  return (
    <div>
      <h1>give feedback</h1>
      <FeedbackButton
        clickHandler={addFeedback(good, setGood)}
        text="good"
      />
      <FeedbackButton
        clickHandler={addFeedback(neutral, setNeutral)}
        text="neutral"
      />
      <FeedbackButton
        clickHandler={addFeedback(bad, setBad)}
        text="bad"
      />
      
      <h1>statistics</h1>
      <Statistics
        feedbacks={{ "good": good, "neutral": neutral, "bad": bad }}
      />
    </div>

  );
};

export default App;
