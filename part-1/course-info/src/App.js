import React from 'react';


const Header = (props) => {

  return (
    <>
      <h1>{props.courseName}</h1>
    </>
  );
}

const Content = (props) => {
  const { parts } = props;

  return (
    <>
      <Part partName={parts[0].name} exercises={parts[0].exercises} />
      <Part partName={parts[1].name} exercises={parts[1].exercises} />
      <Part partName={parts[2].name} exercises={parts[2].exercises} />
    </>
  );
}

const Total = (props) => {
  const { parts } = props;
  const exercise1 = parts[0].exercises;
  const exercise2 = parts[1].exercises;
  const exercise3 = parts[2].exercises;

  return (
    <>
      <p>
        Number of exercises {exercise1 + exercise2 + exercise3}
      </p>
    </>
  );
}

const Part = (props) => {
  
  return (
    <>
      <p>
        {props.partName} {props.exercises}
      </p>
    </>
  );
}

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10
      },
      {
        name: "Using props to pass data",
        exercises: 7
      },
      {
        name: "State of a component",
        exercises: 14
      }
    ]
  };

  return (

    <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
}

export default App;
