import { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import API from './api';
import { AuthContext } from './context/AuthContext';

const CreateTask = ({ currentUser }) => {
  const { auth } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedUserIds, setAssignedUserIds] = useState([]);
  const [notes, setNotes] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await API.get(`/api/User/${currentUser.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        setError(err.response?.data || 'Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await API.get('/api/User/all', {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    if (auth.role === 'admin' || auth.role === 'manager') {
      fetchUsers();
    }
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = {
      title,
      description,
      deadline,
      priority,
      status: 'Issued',
      notes: notes.length > 0 ? notes : 'EMPTY...',
      assignedUserIds: assignedUserIds.length > 0 ? assignedUserIds : [0],
    };

    try {
      const response = await API.post('/api/Tasks', newTask, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      console.log('Task created:', response.data);
    } catch (error) {
      console.log(newTask);
      console.error('Failed to create task', error);
    }
  };

  const handleUserSelect = (selectedOptions) => {
    const ids = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setAssignedUserIds(ids);
  };

  const groupUsersByDepartment = () => {
    const departments = {};
    const filteredUsers = auth.role === 'manager'
      ? users.filter(user => user.status === 'worker' && user.department === userData.department)
      : users;

    filteredUsers.forEach(user => {
      if (!departments[user.department]) {
        departments[user.department] = [];
      }
      departments[user.department].push({ value: user.id, label: `${user.username} (${user.status})` });
    });

    return departments;
  };

  const departments = groupUsersByDepartment();

  const options = Object.keys(departments).map(department => ({
    label: department,
    options: departments[department],
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Create Task</h2>
      <div>
        <label className="block">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block">Deadline</label>
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
          className="border p-2 w-full"
        >
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <div>
        <label className="block">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block mb-2 font-semibold">Assign To</label>
        <Select
          isMulti
          options={options}
          value={assignedUserIds.map(id => options.flatMap(option => option.options).find(user => user.value === id))}
          onChange={handleUserSelect}
          className="basic-multi-select"
          classNamePrefix="select"
          menuPlacement="top" // Меню будет выпадать вверх
          styles={{
            control: (base) => ({
              ...base,
              borderColor: '#ccc',
              boxShadow: 'none',
              '&:hover': {
                borderColor: '#blue',
              },
            }),
            menu: (base) => ({
              ...base,
              maxHeight: '150px', // Ограничиваем высоту меню
              overflowY: 'auto',  // Добавляем прокрутку
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: '#e0f7fa',
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: '#00796b',
            }),
            multiValueRemove: (base) => ({
              ...base,
              ':hover': {
                backgroundColor: '#f44336',
                color: 'white',
              },
            }),
          }}
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Create Task
      </button>
    </form>
  );
};

export default CreateTask;
