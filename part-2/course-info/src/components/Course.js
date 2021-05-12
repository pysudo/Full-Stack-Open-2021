import React from 'react';


const Header = ({ course }) => {

    return (
        <h1>{course.name}</h1>
    )
};

const Content = ({ course }) => {

    return (
        <div>
            {course.parts.map(part =>
                <Part key={part.id} part={part} />
            )}
        </div>
    );
};

const Part = ({ part }) => {
    const { name, exercises } = part;

    return (
        <p>
            {name} {exercises}
        </p>
    );
};

const Total = ({ course }) => {
    const { parts } = course;
    const sum = parts.reduce((exercises, part) => {
        return (part.exercises + exercises);
    }, 0);

    return (
        <p><b>Number of exercises {sum}</b></p>
    );
};


const Course = ({ course }) => {

    return (
        <div>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
        </div>
    );
};


export default Course;