import React, { useState } from 'react';
import { Task } from '../../App';

type Props = {
  tags: string[];
  task: Task;
  updateTask: (updatedTask: Task) => void;
  onClick: () => void;
};

const TaskComponent: React.FC<Props> = ({
  tags,
  task,
  updateTask,
  onClick,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>(task.tag);
  const [edit, setEdit] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState(task.description);
  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const toggleCompleted = (done: boolean) => {
    setIsCompleted(!isCompleted);
    updateTask({ ...task, completed: !isCompleted });
  };

  const decoder = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      updateTask({
        ...task,
        imgSrc: reader.result,
      });
    });
    if (event && event.target && event.target.files) {
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const saveChanges = () => {
    setEdit(false);
    updateTask({
      ...task,
      description: inputValue,
      tag: selectedTag,
    });
  };

  return (
    <div className={task.completed ? 'task__item done' : 'task__item'}>
      {edit ? (
        <span>
          <input
            className={edit ? 'task__text active' : 'task__text'}
            disabled={!edit}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </span>
      ) : (
        <span className="task__desc">{task.description}</span>
      )}

      <div className="upload__image">
        {selectedImage ? (
          <div>
            <img
              alt="not fount"
              width="250px"
              // @ts-ignore
              src={URL.createObjectURL(selectedImage)}
            />
            <br />
            <button
              className="button button--delete"
              onClick={() => setSelectedImage(null)}
            >
              remove
            </button>
          </div>
        ) : (
          <div style={{ display: !task.imgSrc ? 'none' : 'block' }}>
            <img
              alt="not found"
              width="250px"
              // @ts-ignore
              src={task.imgSrc}
            />
            <br />
            <button
              className="button button--delete"
              onClick={() => {
                updateTask({ ...task, imgSrc: null });
              }}
            >
              remove
            </button>
          </div>
        )}
      </div>

      {edit ? (
        <div className="button__wrapper">
          <select
            className="dropdown"
            value={selectedTag}
            name={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <button className="button button--save" onClick={() => saveChanges()}>
            save
          </button>
        </div>
      ) : (
        <div className="button__wrapper">
          <button className="button button--edit" onClick={() => setEdit(true)}>
            edit
          </button>

          <button className="button button--upload">
            <label htmlFor={task.description} className="upload">
              image
              <input
                name="myImage"
                id={task.description}
                style={{ display: 'none' }}
                type="file"
                onChange={(event) => {
                  if (event && event.target && event.target.files) {
                    setSelectedImage(event.target.files[0]);
                  }
                  decoder(event);
                }}
              />
            </label>
          </button>
          <button
            className="button button--completed"
            onClick={() => toggleCompleted(!isCompleted)}
          >
            {task.completed === false ? 'done' : 'undone'}
          </button>
          <button className="button button--remove" onClick={() => onClick()}>
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskComponent;
