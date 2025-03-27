import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, ArrowLeft } from 'lucide-react';
import { useSnackbar } from 'notistack';


interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState<UserData | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchUser();
    }
  }, [id, navigate]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`https://reqres.in/api/users/${id}`);
      const userData: UserData = response.data.data;
      setUser(userData);
      setFirstName(userData.first_name);
      setLastName(userData.last_name);
      setEmail(userData.email);
      setIsLoading(false);
    } catch (err) {
        enqueueSnackbar('Failed to fetch user data', { 
            variant: 'error',
            autoHideDuration: 3000 
          });
        
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`https://reqres.in/api/users/${id}`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
      });
      enqueueSnackbar('User updated successfully', { 
        variant: 'success',
        autoHideDuration: 3000 
      });
      navigate('/users');
    } catch (err) {
        enqueueSnackbar('Failed to update user', { 
            variant: 'error',
            autoHideDuration: 3000 
          });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "easeInOut" 
          }}
          className="w-16 h-16 bg-indigo-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-3xl w-full max-w-md overflow-hidden"
      >
        <div className="p-8 space-y-6">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4 mb-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/users')}
              className="text-indigo-600 hover:text-indigo-800"
            >
              <ArrowLeft size={24} />
            </motion.button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-800">
              Edit Employee
            </h1>
          </motion.div>

          {user && (
            <div className="flex justify-center mb-6">
              <img
                src={user.avatar}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-24 h-24 rounded-full border-4 border-indigo-100"
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <label className="block text-indigo-700 mb-2 flex items-center">
                <User className="mr-2 text-indigo-400" size={20} />
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-indigo-50"
                required
                placeholder="Enter first name"
              />
            </motion.div>

            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <label className="block text-indigo-700 mb-2 flex items-center">
                <User className="mr-2 text-indigo-400" size={20} />
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-indigo-50"
                required
                placeholder="Enter last name"
              />
            </motion.div>

            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <label className="block text-indigo-700 mb-2 flex items-center">
                <Mail className="mr-2 text-indigo-400" size={20} />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-indigo-50"
                required
                placeholder="Enter email address"
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Update Employee
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default EditUser;