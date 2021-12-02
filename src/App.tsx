/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import React, { useState, useRef, useEffect } from 'react';
import ProgressBar from '@ramonak/react-progress-bar';
import Button from './components/Button/Button';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

type Task = {
  name: string;
  completed: boolean;
  tag: string;
  edit: boolean;
};

const tags = ['today', 'this week', 'this month'];

// localStorage.setItem('tasks', JSON.stringify([]));
const App = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('toDoList') || '';
    if (saved) {
      return JSON.parse(saved);
    }

    return [];
  });

  const [inputValue, setInputValue] = useState('');
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [progressBar, setProgressBar] = useState(0);

  const [selectedImage, setSelectedImage] = useState<File | null>();

  useEffect(() => {
    localStorage.setItem('toDoList', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const doneTasks = [...tasks].filter((item) => item.completed).length;

    const progresBarCalculator = () => {
      if (!tasks.length) {
        return 0;
      }
      return Math.trunc((100 / tasks.length) * doneTasks);
    };
    setProgressBar(progresBarCalculator);
  }, [tasks]);

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  const addNewTask = () => {
    if (inputValue) {
      setTasks([
        ...tasks,
        {
          name: inputValue,
          completed: false,
          tag: tags[0],
          edit: false,
        },
      ]);
      setInputValue('');
    }
  };

  const editTask = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const cloneToDoList = [...tasks];
    cloneToDoList[index].name = event.target.value;
    setTasks(cloneToDoList);
  };

  const dropDownValue = (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const cloneToDoList = [...tasks];
    cloneToDoList[index].tag = event.target.value;
    setTasks(cloneToDoList);
  };

  const taskToShow = tasks.filter((task) => {
    if (showCompleted) {
      return task.completed;
    }
    return true;
  });

  const clearAll = () => {
    setTasks([]);
  };

  const editActive = (index: number) => {
    const cloneToDoList = [...tasks];
    if (cloneToDoList[index].edit === true) {
      cloneToDoList[index].edit = false;
    } else {
      cloneToDoList[index].edit = true;
    }

    setTasks(cloneToDoList);
  };
  const taskDone = (index: number) => {
    const cloneToDoList = [...tasks];
    if (cloneToDoList[index].completed === true) {
      cloneToDoList[index].completed = false;
    } else {
      cloneToDoList[index].completed = true;
    }

    setTasks(cloneToDoList);
  };

  const deleteTask = (index: number) => {
    const cloneToDoList = [...tasks];
    cloneToDoList.filter((task, i) => i !== index);
    setTasks(cloneToDoList);
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

  const showToday = () => {
    setAllTasks([...tasks]);
    const cloneToDoList = [...tasks];
    return setTasks(cloneToDoList.filter((item) => item.tag === tags[0]));
  };
  const showThisWeek = () => {
    setAllTasks([...tasks]);
    const cloneToDoList = [...tasks];
    return setTasks(cloneToDoList.filter((item) => item.tag === tags[1]));
  };
  const showThisMonth = () => {
    setAllTasks([...tasks]);
    const cloneToDoList = [...tasks];
    return setTasks(cloneToDoList.filter((item) => item.tag === tags[2]));
  };

  const showAll = () => setTasks([...allTasks]);
  return (
    <div className="container">
      <div className="todo">
        <div className="wrapper">
          <input
            className="input"
            type="text"
            ref={input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="main__buttons">
            {buttons.map(({ buttonName, onClick }) => (
              <Button key={buttonName} onClick={onClick}>
                {buttonName}
              </Button>
            ))}
          </div>
        </div>
        <div className="bar">
          <div className="checkbox">
            <input
              className="checkbox__input"
              type="checkbox"
              id="done"
              onChange={() => setShowCompleted(!showCompleted)}
            />
            <label className="checkbox__label" htmlFor="done">
              Completed tasks
            </label>
          </div>
          <div className="tags__buttons">
            <button className="button button--today" onClick={showToday}>
              today
            </button>
            <button className="button button--week" onClick={showThisWeek}>
              this week
            </button>
            <button className="button button--month" onClick={showThisMonth}>
              this month
            </button>
            <button className="button button--all" onClick={showAll}>
              All
            </button>
          </div>
        </div>
        <h1 className="progress__title">Progress bar</h1>
        <ProgressBar
          completed={progressBar}
          bgColor="#733e94"
          baseBgColor="#94944b"
          labelColor="#c33131"
        />
      </div>
      <div className="list__wrapper">
        {taskToShow.map((task, index) => (
          <div
            key={index}
            className={task.completed ? 'task__item done' : 'task__item'}
            style={{ background: '#DEB887' }}
          >
            <input
              type="text"
              value={task.name}
              disabled={!task.edit}
              onChange={(e) => editTask(e, index)}
            />
            <div>
              <h1>Upload and Display Image usign React Hooks</h1>
              {selectedImage && (
                <div>
                  <img
                    alt="not fount"
                    width="250px"
                    src={URL.createObjectURL(selectedImage)}
                  />
                  <br />
                  <button onClick={() => setSelectedImage(null)}>Remove</button>
                </div>
              )}
              <br />

              <br />
              <input
                type="file"
                name="myImage"
                onChange={(event) => {
                  if (event && event.target && event.target.files) {
                    setSelectedImage(event.target.files[0]);
                  }
                }}
              />
            </div>
            <div className="button__wrapper">
              <button
                onClick={() => {
                  editActive(index);
                }}
              >
                {task.edit ? 'save' : 'edit'}
              </button>
              <>
                <select
                  value={task.tag}
                  name={task.tag}
                  style={{
                    background: '#c02975',
                    color: 'white',
                    height: '30px',
                  }}
                  onChange={(e) => dropDownValue(e, index)}
                >
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </>
              <button
                className="button button--completed"
                onClick={() => taskDone(index)}
              >
                {task.completed === false ? 'done' : 'undone'}
              </button>
              <button
                key={index}
                className="button button--remove"
                onClick={() => deleteTask(index)}
              >
                X
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
