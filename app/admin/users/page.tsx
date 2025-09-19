"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Calendar, 
  Activity,
  Shield,
  UserCheck,
  UserX,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageCircle,
  Heart,
  Trophy,
  Target,
  BookOpen,
  X
} from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  emailVerified: string | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  provider: string;
  activity: {
    totalMessages: number;
    totalVotes: number;
    totalPollVotes: number;
    totalQuizScores: number;
    totalSubmissions: number;
    totalComments: number;
    totalRegistrations: number;
    totalLikes: number;
    totalActivity: number;
  };
}

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

function UserDetailModal({ user, isOpen, onClose }: UserDetailModalProps) {
  if (!user) return null;

  const activityItems = [
    { label: "Messages", count: user.activity.totalMessages, icon: MessageCircle, color: "text-blue-500" },
    { label: "Votes", count: user.activity.totalVotes, icon: Heart, color: "text-red-500" },
    { label: "Poll Votes", count: user.activity.totalPollVotes, icon: Target, color: "text-green-500" },
    { label: "Quiz Scores", count: user.activity.totalQuizScores, icon: BookOpen, color: "text-purple-500" },
    { label: "Submissions", count: user.activity.totalSubmissions, icon: Trophy, color: "text-yellow-500" },
    { label: "Comments", count: user.activity.totalComments, icon: MessageCircle, color: "text-blue-500" },
    { label: "Registrations", count: user.activity.totalRegistrations, icon: Calendar, color: "text-orange-500" },
    { label: "Likes", count: user.activity.totalLikes, icon: Heart, color: "text-red-500" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-muted">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-16 h-16 rounded-full border-2 border-uganda-gold object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-r from-uganda-gold to-warm-gold rounded-full flex items-center justify-center">
                      <span className="text-uganda-black font-bold text-xl">
                        {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {user.name || "Anonymous User"}
                    </h2>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.provider === 'google' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.provider}
                      </span>
                      {user.emailVerified ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Unverified</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Account Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since:</span>
                      <span className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Login:</span>
                      <span className="font-medium">
                        {user.lastLogin 
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Activity:</span>
                      <span className="font-medium text-uganda-gold">
                        {user.activity.totalActivity} actions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Activity Breakdown</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {activityItems.map((item) => (
                      <div key={item.label} className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        <span className="text-sm font-medium">{item.count}</span>
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 bg-uganda-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all">
                  <Mail className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
                <button className="flex items-center space-x-2 border border-uganda-green text-uganda-green px-4 py-2 rounded-lg font-semibold hover:bg-uganda-green hover:text-background transition-all">
                  <Edit className="h-4 w-4" />
                  <span>Edit User</span>
                </button>
                <button className="flex items-center space-x-2 border border-uganda-red text-uganda-red px-4 py-2 rounded-lg font-semibold hover:bg-uganda-red hover:text-background transition-all">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete User</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProvider, setFilterProvider] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "email" | "createdAt" | "activity">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
        alert('User deleted successfully');
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProvider = filterProvider === "all" || user.provider === filterProvider;
      
      return matchesSearch && matchesProvider;
    })
    .sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;
      
      switch (sortBy) {
        case "name":
          aValue = a.name || a.email;
          bValue = b.name || b.email;
          break;
        case "email":
          aValue = a.email;
          bValue = b.email;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "activity":
          aValue = a.activity.totalActivity;
          bValue = b.activity.totalActivity;
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const providers = Array.from(new Set(users.map(user => user.provider)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uganda-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage registered users and monitor their activity
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchUsers}
            className="flex items-center space-x-2 bg-uganda-gold text-uganda-black px-4 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 border border-uganda-green text-uganda-green px-4 py-2 rounded-lg font-semibold hover:bg-uganda-green hover:text-background transition-all">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-background rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground mt-1">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-uganda-green to-deep-green rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-background" />
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {users.filter(user => user.lastLogin && new Date(user.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-uganda-gold to-warm-gold rounded-lg flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-background" />
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Verified Users</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {users.filter(user => user.emailVerified).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-uganda-red to-rich-red rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-background" />
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Activity</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {users.reduce((sum, user) => sum + user.activity.totalActivity, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-earth-brown to-uganda-gold rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-background" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-background rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="px-4 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
            >
              <option value="all">All Providers</option>
              {providers.map(provider => (
                <option key={provider} value={provider}>
                  {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as "name" | "email" | "createdAt" | "activity");
                setSortOrder(order as "asc" | "desc");
              }}
              className="px-4 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="activity-desc">Most Active</option>
              <option value="activity-asc">Least Active</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-background rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {filteredAndSortedUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-muted/25 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="w-10 h-10 rounded-full border border-uganda-gold object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-uganda-gold to-warm-gold rounded-full flex items-center justify-center">
                          <span className="text-uganda-black font-bold text-sm">
                            {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {user.name || "Anonymous User"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.provider === 'google' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {user.emailVerified ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Unverified</span>
                        </span>
                      )}
                      {user.lastLogin && new Date(user.lastLogin) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex items-center space-x-1">
                          <UserX className="h-3 w-3" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">
                      {user.activity.totalActivity} actions
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.activity.totalMessages} messages, {user.activity.totalVotes} votes
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-uganda-gold hover:text-warm-gold transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-uganda-red hover:text-rich-red transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}
