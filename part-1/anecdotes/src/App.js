import React, { useState } from 'react';

function App() {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]
  const initialVotes = Array.apply(null, new Array(anecdotes.length))
    .map(Number.prototype.valueOf, 0);

  const [selected, setSelected] = useState(0);
  const [votes, changeVotes] = useState(initialVotes);


  const RandomAnecdote = () => {
    const anecdotesIndex = Math.floor(Math.random(1, 10) * (anecdotes.length));
    
    setSelected(anecdotesIndex);
  };

  const addVote = () => {
    const votes_copy = [...votes];
    votes_copy[selected] += 1;

    changeVotes(votes_copy);
  };


  return (
    <div>
      <h1>Anecdotes of the day</h1>
      {anecdotes[selected]}
      <br />
      has {votes[selected]} {(votes[selected] !== 1) ? "votes" : "vote"}
      <br />
      <button onClick={addVote}>vote</button>
      <button onClick={RandomAnecdote}>next anecdote</button>

      <h1>Anecdotes with most votes</h1>
      {anecdotes[votes.indexOf(Math.max(...votes))]}
    </div>
  )
}

export default App;
