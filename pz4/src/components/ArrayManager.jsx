import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import './ArrayManager.css';

const ArrayManager = ({ items, onItemsChange }) => {
  const [draggedItem, setDraggedItem] = React.useState(null);
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [editValue, setEditValue] = React.useState('');
  const editInputRef = useRef(null);

  // Фокус на поле ввода при редактировании
  React.useEffect(() => {
    if (editingIndex !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingIndex]);

  // Начало редактирования
  const startEditing = (index) => {
    setEditingIndex(index);
    setEditValue(items[index]);
  };

  // Сохранение редактирования
  const saveEditing = (index) => {
    if (editValue.trim() !== '') {
      const newItems = [...items];
      newItems[index] = editValue;
      onItemsChange(newItems);
    }
    setEditingIndex(null);
  };

  // Drag and Drop логика
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newItems = [...items];
    const item = newItems[draggedItem];
    newItems.splice(draggedItem, 1);
    newItems.splice(index, 0, item);

    onItemsChange(newItems);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // Удаление элемента
  const deleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  return (
    <div className="array-manager">
      {/* Горизонтальный список элементов */}
      <div className="items-container">
        {items.map((item, index) => (
          <div
            key={index}
            className={`item ${draggedItem === index ? 'dragging' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
          >
            {editingIndex === index ? (
              <input
                ref={editInputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEditing(index)}
                onKeyPress={(e) => e.key === 'Enter' && saveEditing(index)}
                className="edit-input"
              />
            ) : (
              <>
                <span onClick={() => startEditing(index)}>
                  {item}
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(index);
                  }}
                  className="delete-btn"
                >
                  ×
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && <p className="empty-message">Массив пуст.</p>}
      {items.length > 0 && <p className="items-count">Всего элементов: {items.length}</p>}
    </div>
  );
};

ArrayManager.propTypes = {
  items: PropTypes.array.isRequired,
  onItemsChange: PropTypes.func.isRequired
};

export default ArrayManager;
