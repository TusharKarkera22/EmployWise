import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchUsers();
    }
  }, [currentPage, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${currentPage}`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
      enqueueSnackbar('Users loaded successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Failed to fetch users', { variant: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      enqueueSnackbar('User deleted successfully', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Failed to delete user', { variant: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    enqueueSnackbar('Logged out successfully', { variant: 'info' });
    navigate('/login');
  };

  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden"
      >
        <div className="p-6 sm:p-10">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex justify-between items-center"
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-800">
              Employee List
            </h1>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors flex items-center"
            >
              <LogOut size={20} className="mr-2" /> Logout
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 relative"
          >
            <input
              type="text"
              placeholder="Search employees by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-indigo-50"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <motion.div 
                key={user.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-indigo-100 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="p-6 text-center">
                  <img
                    src={user.avatar}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-indigo-100"
                  />
                  <h2 className="text-lg font-bold text-indigo-800 mb-2">
                    {user.first_name} {user.last_name}
                  </h2>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  <div className="flex justify-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                       
                        navigate(`/users/edit/${user.id}`);
                      }}
                      className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition-colors"
                    >
                      <Edit size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex justify-center items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
              
              }}
              disabled={currentPage === 1}
              className="bg-indigo-500 text-white p-2 rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={24} />
            </motion.button>
            
            <span className="text-indigo-800 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                
              }}
              disabled={currentPage === totalPages}
              className="bg-indigo-500 text-white p-2 rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UsersList;