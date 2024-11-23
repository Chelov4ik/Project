import { useState } from 'react';

// Компонент для редактирования задачи
const EditTaskModal = ({ isOpen, onClose, task, onSave }) => {
  const [status, setStatus] = useState(task?.progressPercentage > 0 ? task?.status : 'Issued');
  const [progressPercentage, setProgress] = useState(task?.progressPercentage || 0); // Прогресс по умолчанию 0

  const handleSave = () => {
    onSave({ ...task, status, progressPercentage}); // Сохраняем только статус и прогресс
    onClose(); // Закрыть модальное окно после сохранения
    console.log(task);
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg z-10 p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold">Edit Task</h3>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          className="border rounded px-3 py-1 mt-2 w-full"
        >
          <option value="Issued">Issued</option>
          <option value="InProgress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="NotCompleted">Not Completed</option>
        </select>

        <input 
          type="number"
          value={progressPercentage}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="border rounded px-3 py-1 mt-2 w-full"
          placeholder="Progress (%)"
          min="0"
          max="100"
        />

        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-300">Close</button>
          <button onClick={handleSave} className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 transition duration-300">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
