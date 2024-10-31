const ViewTaskModal = ({ isOpen, onClose, task }) => {
    if (!isOpen || !task) return null; // Если модальное окно закрыто или задачи нет, не рендерим ничего
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-lg z-10 p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold">Task Details</h3>
          <p><strong>Title:</strong> <div className="break-words whitespace-pre-wrap max-h-80 overflow-y-auto">
            {task.title}
          </div></p>
          <p><strong>Description:</strong> <div className="break-words whitespace-pre-wrap max-h-80 overflow-y-auto">
            {task.description}
          </div></p>
          <p><strong>Status:</strong> <div className="break-words whitespace-pre-wrap max-h-80 overflow-y-auto">
            {task.status}
          </div></p>
          <p><strong>Priority:</strong><div className="break-words whitespace-pre-wrap max-h-80 overflow-y-auto">
            {task.priority}
          </div></p>
          <p><strong>Notes:</strong> <div className="break-words whitespace-pre-wrap max-h-80 overflow-y-auto">
            {task.notes}
          </div></p>
          <div className="flex justify-between mt-4">
            <button onClick={onClose} className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-300">Close</button>
          </div>
        </div>
      </div>
    );
  };

  export default ViewTaskModal;