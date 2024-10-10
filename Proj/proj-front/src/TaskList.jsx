const TaskList = ({ tasks }) => {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return <div className="text-gray-600">No tasks available.</div>; // Или любое другое сообщение
    }
  
    return (
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-gray-500">Status: <span className={`font-medium ${task.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>{task.status}</span></p>
            <p className="text-gray-500">Priority: <span className={`font-medium ${task.priority === 'High' ? 'text-red-600' : task.priority === 'Medium' ? 'text-yellow-500' : 'text-gray-500'}`}>{task.priority}</span></p>
            <p className="text-gray-500">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    );
  };
  
  export default TaskList;
  