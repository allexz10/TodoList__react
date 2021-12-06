/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useRef, useEffect } from 'react';
import ProgressBar from '@ramonak/react-progress-bar';

import './App.scss';
import TaskComponent from './components/Task/TaskComponent';

export type Task = {
  description: string;
  completed: boolean;
  tag: string;
  edit: boolean;
  imgSrc: string | ArrayBuffer | null;
};

const tags = ['today', 'this week', 'this month', 'all'];

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('toDoList') || '';
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [progressBar, setProgressBar] = useState(0);
  const [errorMsg, setErrorMsg] = useState(false);

  useEffect(() => {
    localStorage.setItem('toDoList', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const doneTasks = [...tasks].filter((item) => item.completed).length;

    const progressBarCalculator = () => {
      if (!tasks.length) {
        return 0;
      }
      return Math.trunc((100 / tasks.length) * doneTasks);
    };
    setProgressBar(progressBarCalculator);
  }, [tasks]);

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  const addNewTask = () => {
    const inputValid = tasks.find((task) => task.description === inputValue);
    if (inputValid === undefined && inputValue.trim()) {
      setErrorMsg(false);
      setTasks([
        ...tasks,
        {
          description: inputValue,
          completed: false,
          tag: tags[0],
          edit: false,
          imgSrc: null,
        },
      ]);
      setInputValue('');
    } else {
      setErrorMsg(true);
    }
  };

  const deleteTask = (index: number) => {
    setTasks(tasks.filter((task, i) => i !== index));
  };

  const updateTask = (updatedTask: Task, description: string) => {
    const newTasks = [...tasks].map((task) => {
      if (task.description === description) {
        return updatedTask;
      }
      return task;
    });
    setTasks(newTasks);
  };

  const clearAll = () => {
    setTasks([]);
    setInputValue('');
    setErrorMsg(false);
  };

  const buttons = [
    {
      buttonName: 'Add',
      onClick: () => {
        addNewTask();
      },
    },
    {
      buttonName: 'Clear All',
      onClick: () => {
        clearAll();
      },
    },
  ];

  return (
    <div className="container">
      <div className="todo">
        <span className={errorMsg ? 'error__message active' : 'error__message'}>
          Empty field or duplicated task
        </span>
        <div className="wrapper">
          <input
            className={errorMsg ? 'input error' : 'input'}
            type="text"
            ref={input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="main__buttons">
            {buttons.map((button) => (
              <button
                className="button"
                key={button.buttonName}
                onClick={button.onClick}
              >
                {button.buttonName}
              </button>
            ))}
          </div>
        </div>

        <div className="bar">
          <div className="checkbox">
            <input
              id="done"
              className="checkbox__input"
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => {
                e.stopPropagation();
                setShowCompleted((e.target as HTMLInputElement).checked);
              }}
            />
            <label className="checkbox__label" htmlFor="done">
              Completed tasks
            </label>
          </div>

          <div className="tags__buttons">
            {tags.map((tag) => (
              <button
                key={tag}
                className="button button--tags"
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <h1 className="progress__title">Progress bar</h1>
        <ProgressBar
          completed={progressBar}
          bgColor="#bd5a96"
          baseBgColor="#6b5862"
          labelColor="#ffffff"
        />
      </div>
      <div className="list__wrapper">
        {tasks
          .filter((task) => (activeTag === 'all' ? task : task.tag === activeTag))
          .filter((task) => (showCompleted ? task.completed : task))
          .map((task, index) => (
            <TaskComponent
              key={index}
              tags={tags}
              task={task}
              updateTask={(updatedTask) => updateTask(updatedTask, task.description)}
              onClick={() => deleteTask(index)}
            />
          ))}
      </div>
    </div>
  );
};

export default App;
