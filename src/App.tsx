/* eslint-disable no-param-reassign */
/* eslint-disable react/no-array-index-key */
import { useState, useRef, useEffect } from 'react';
import Button from './components/Button/Button';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

type Task = {
  name: string;
  completed: boolean;
};

const App = () => {
  const [inputValue, setInputValue] = useState('');

  const [showCompleted, setShowCompleted] = useState(false);
  const [toDoList, setToDoList] = useState<Task[]>([]);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);

  const addNewTask = () => {
    if (inputValue) {
      setToDoList([...toDoList, { name: inputValue, completed: false }]);
      setInputValue('');
    }
  };

  const taskToShow = toDoList.filter((task) => {
    if (showCompleted) {
      return task.completed;
    }
    return true;
  });

  const clearAll = () => {
    setToDoList([]);
  };

  const taskDone = (index: number) => {
    const cloneToDoList = [...toDoList];
    if (cloneToDoList[index].completed === true) {
      cloneToDoList[index].completed = false;
    } else {
      cloneToDoList[index].completed = true;
    }

    setToDoList(cloneToDoList);
  };

  const deleteTask = (index: number) => {
    const newArr = toDoList.filter((task, i) => i !== index);
    setToDoList(newArr);
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
      <div className="wrapper">
        <input
          className="input"
          type="text"
          ref={input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {buttons.map(({ buttonName, onClick }) => (
          <Button key={buttonName} onClick={onClick}>
            {buttonName}
          </Button>
        ))}

      </div>
      <label htmlFor="done">
        <input type="checkbox" id="done" onChange={() => setShowCompleted(!showCompleted)} />
        {showCompleted ? ' Completed tasks' : 'All tasks' }
      </label>

      <div className="list__wrapper">
        {taskToShow.map((task, index) => (
          <div
            key={index}
            className={task.completed ? 'task__item done' : 'task__item'}
            style={{ background: '#DEB887' }}
          >
            {task.name}
            <div className="button__wrapper">
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
