"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Trophy,
  Star,
  Award,
  Send,
  Smile,
  Camera,
  Palette,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";

interface FanMessage {
  id: number;
  name: string;
  message: string;
  avatar: string;
  likes: number;
  isLiked: boolean;
  timestamp: string;
  type: 'message' | 'art' | 'photo';
}

interface Poll {
  id: number;
  question: string;
  options: { id: number; text: string; votes: number; percentage: number }[];
  totalVotes: number;
  endDate: string;
  isVoted: boolean;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: number;
  participants: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  isCompleted: boolean;
  score?: number;
}

interface LeaderboardEntry {
  id: number;
  name: string;
  avatar: string;
  score: number;
  rank: number;
  badge: string;
  level: number;
}

export default function FanCommunity() {
  const [activeTab, setActiveTab] = useState<'wall' | 'polls' | 'quizzes' | 'leaderboard'>('wall');
  const [newMessage, setNewMessage] = useState('');
  const [selectedPoll, setSelectedPoll] = useState<number | null>(null);

  const fanMessages: FanMessage[] = [
    {
      id: 1,
      name: "Sarah M.",
      message: "The Queen's visit to Murchison Falls was absolutely magical! Her passion for Uganda's beauty is truly inspiring. 🇺🇬✨",
      avatar: "/api/placeholder/40/40",
      likes: 23,
      isLiked: false,
      timestamp: "2 hours ago",
      type: 'message'
    },
    {
      id: 2,
      name: "David K.",
      message: "Created this digital art inspired by the Queen's traditional dance performance. Hope you like it!",
      avatar: "/api/placeholder/40/40",
      likes: 45,
      isLiked: true,
      timestamp: "4 hours ago",
      type: 'art'
    },
    {
      id: 3,
      name: "Grace L.",
      message: "Took this photo during the cultural festival. The Queen's elegance truly represents Uganda's beauty!",
      avatar: "/api/placeholder/40/40",
      likes: 67,
      isLiked: false,
      timestamp: "6 hours ago",
      type: 'photo'
    }
  ];

  const polls: Poll[] = [
    {
      id: 1,
      question: "What should the Queen wear for the next cultural event?",
      options: [
        { id: 1, text: "Traditional Gomesi", votes: 234, percentage: 45 },
        { id: 2, text: "Modern African Print", votes: 189, percentage: 36 },
        { id: 3, text: "Elegant Evening Gown", votes: 98, percentage: 19 }
      ],
      totalVotes: 521,
      endDate: "2024-01-25",
      isVoted: false
    },
    {
      id: 2,
      question: "Which Ugandan destination should the Queen visit next?",
      options: [
        { id: 1, text: "Kibale National Park", votes: 156, percentage: 38 },
        { id: 2, text: "Sipi Falls", votes: 134, percentage: 33 },
        { id: 3, text: "Lake Bunyonyi", votes: 120, percentage: 29 }
      ],
      totalVotes: 410,
      endDate: "2024-01-30",
      isVoted: true
    }
  ];

  const quizzes: Quiz[] = [
    {
      id: 1,
      title: "Uganda's Cultural Heritage",
      description: "Test your knowledge about Uganda's rich cultural traditions and history",
      questions: 15,
      participants: 1247,
      difficulty: 'medium',
      category: 'Culture',
      isCompleted: false
    },
    {
      id: 2,
      title: "Wildlife of Uganda",
      description: "How well do you know Uganda's amazing wildlife and national parks?",
      questions: 20,
      participants: 892,
      difficulty: 'hard',
      category: 'Nature',
      isCompleted: true,
      score: 85
    },
    {
      id: 3,
      title: "Ugandan Cuisine",
      description: "Discover the flavors and dishes that make Ugandan food special",
      questions: 12,
      participants: 567,
      difficulty: 'easy',
      category: 'Food',
      isCompleted: false
    }
  ];

  const leaderboard: LeaderboardEntry[] = [
    { id: 1, name: "Sarah M.", avatar: "/api/placeholder/40/40", score: 2450, rank: 1, badge: "Queen's Champion", level: 15 },
    { id: 2, name: "David K.", avatar: "/api/placeholder/40/40", score: 2230, rank: 2, badge: "Cultural Expert", level: 14 },
    { id: 3, name: "Grace L.", avatar: "/api/placeholder/40/40", score: 1980, rank: 3, badge: "Tourism Guide", level: 13 },
    { id: 4, name: "Michael T.", avatar: "/api/placeholder/40/40", score: 1850, rank: 4, badge: "Nature Lover", level: 12 },
    { id: 5, name: "Aisha N.", avatar: "/api/placeholder/40/40", score: 1720, rank: 5, badge: "Community Star", level: 11 }
  ];

  const tabs = [
    { id: 'wall', label: 'Fan Wall', icon: MessageCircle },
    { id: 'polls', label: 'Polls', icon: Target },
    { id: 'quizzes', label: 'Quizzes', icon: BookOpen },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the server
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleVote = (pollId: number, optionId: number) => {
    // In a real app, this would submit the vote
    console.log(`Voted for poll ${pollId}, option ${optionId}`);
    setSelectedPoll(pollId);
  };

  return (
    <section id="community" className="py-20 bg-gradient-to-br from-uganda-red/5 to-uganda-gold/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-uganda-green mb-4">
            Fan Community Hub
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with fellow fans, participate in polls and quizzes, and showcase your love for Uganda's beauty
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-background rounded-full p-2 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black shadow-md'
                    : 'text-muted-foreground hover:text-uganda-green'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'wall' && (
            <motion.div
              key="wall"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              {/* Message Input */}
              <div className="bg-background rounded-xl p-6 shadow-lg mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-uganda-gold to-warm-gold rounded-full flex items-center justify-center">
                    <Smile className="h-5 w-5 text-uganda-black" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Share your thoughts, fan art, or photos with the community..."
                      className="w-full p-3 border border-muted rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-uganda-gold"
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-muted-foreground hover:text-uganda-green transition-colors">
                          <Camera className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-uganda-gold transition-colors">
                          <Palette className="h-5 w-5" />
                        </button>
                      </div>
                      <button
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-6 py-2 rounded-lg font-semibold hover:shadow-md transition-all"
                      >
                        <Send className="h-4 w-4 inline mr-2" />
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fan Messages */}
              <div className="space-y-6">
                {fanMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-background rounded-xl p-6 shadow-lg"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-uganda-green to-deep-green rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-background" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-foreground">{message.name}</h4>
                            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {message.type === 'art' && <Palette className="h-4 w-4 text-uganda-gold" />}
                            {message.type === 'photo' && <Camera className="h-4 w-4 text-uganda-green" />}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{message.message}</p>
                        
                        <div className="flex items-center space-x-4">
                          <button className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-all ${
                            message.isLiked
                              ? 'bg-uganda-red text-background'
                              : 'bg-muted text-muted-foreground hover:bg-uganda-red hover:text-background'
                          }`}>
                            <Heart className={`h-4 w-4 ${message.isLiked ? 'fill-current' : ''}`} />
                            <span className="text-sm">{message.likes}</span>
                          </button>
                          <button className="flex items-center space-x-2 text-muted-foreground hover:text-uganda-green transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'polls' && (
            <motion.div
              key="polls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {polls.map((poll, index) => (
                <motion.div
                  key={poll.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-foreground">{poll.question}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Ends {poll.endDate}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {poll.options.map((option) => (
                      <div key={option.id} className="relative">
                        <button
                          onClick={() => handleVote(poll.id, option.id)}
                          disabled={poll.isVoted || selectedPoll === poll.id}
                          className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                            poll.isVoted || selectedPoll === poll.id
                              ? 'border-uganda-gold bg-uganda-gold/10'
                              : 'border-muted hover:border-uganda-green hover:bg-uganda-green/5'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{option.text}</span>
                            <span className="text-sm text-muted-foreground">
                              {option.votes} votes ({option.percentage}%)
                            </span>
                          </div>
                          {poll.isVoted && (
                            <div className="mt-2 bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-uganda-gold to-warm-gold h-2 rounded-full transition-all"
                                style={{ width: `${option.percentage}%` }}
                              ></div>
                            </div>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Total votes: {poll.totalVotes}</span>
                    {poll.isVoted && (
                      <div className="flex items-center space-x-1 text-uganda-green">
                        <CheckCircle className="h-4 w-4" />
                        <span>You voted!</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'quizzes' && (
            <motion.div
              key="quizzes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {quizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      quiz.difficulty === 'easy' ? 'bg-uganda-green/20 text-uganda-green' :
                      quiz.difficulty === 'medium' ? 'bg-uganda-gold/20 text-uganda-gold' :
                      'bg-uganda-red/20 text-uganda-red'
                    }`}>
                      {quiz.difficulty}
                    </span>
                    {quiz.isCompleted && (
                      <div className="flex items-center space-x-1 text-uganda-green">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">{quiz.score}%</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2">{quiz.title}</h3>
                  <p className="text-muted-foreground mb-4">{quiz.description}</p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Questions:</span>
                      <span className="font-medium">{quiz.questions}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Participants:</span>
                      <span className="font-medium">{quiz.participants}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium text-uganda-green">{quiz.category}</span>
                    </div>
                  </div>

                  <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                    quiz.isCompleted
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black hover:shadow-md'
                  }`}>
                    {quiz.isCompleted ? 'Completed' : 'Start Quiz'}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-background rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-uganda-gold to-warm-gold p-6">
                  <h3 className="text-2xl font-bold text-uganda-black text-center">Community Leaderboard</h3>
                  <p className="text-uganda-black/80 text-center mt-2">Top contributors and active fans</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {leaderboard.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center space-x-4 p-4 rounded-lg ${
                          entry.rank <= 3 ? 'bg-gradient-to-r from-uganda-gold/10 to-warm-gold/10' : 'bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-uganda-green to-deep-green text-background font-bold">
                          {entry.rank <= 3 ? (
                            <Trophy className="h-6 w-6" />
                          ) : (
                            <span>#{entry.rank}</span>
                          )}
                        </div>

                        <div className="w-12 h-12 bg-gradient-to-r from-uganda-gold to-warm-gold rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-uganda-black" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-foreground">{entry.name}</h4>
                            <span className="bg-uganda-green/20 text-uganda-green px-2 py-1 rounded text-xs font-medium">
                              {entry.badge}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Level {entry.level}</span>
                            <span>•</span>
                            <span>{entry.score} points</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-uganda-gold">{entry.score}</div>
                          <div className="text-sm text-muted-foreground">points</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <button className="bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-6 py-3 rounded-lg font-semibold hover:shadow-md transition-all">
                      View Full Leaderboard
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
