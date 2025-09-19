"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Trophy,
  Send,
  Smile,
  Camera,
  Palette,
  BookOpen,
  Target,
  Clock,
  CheckCircle
} from "lucide-react";

interface FanMessage {
  id: number;
  content: string;
  type: 'MESSAGE' | 'ART' | 'PHOTO';
  createdAt: string;
  likes: { id: number; userId: number }[];
  user?: {
    name: string;
    avatar?: string;
  };
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
  scores?: { id: number; score: number; user?: { name: string }; completedAt: string }[];
}


export default function FanCommunity() {
  const [activeTab, setActiveTab] = useState<'wall' | 'polls' | 'quizzes' | 'leaderboard'>('wall');
  const [newMessage, setNewMessage] = useState('');
  const [selectedPoll, setSelectedPoll] = useState<number | null>(null);
  const [fanMessages, setFanMessages] = useState<FanMessage[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [messagesRes, pollsRes, quizzesRes] = await Promise.all([
          fetch('/api/fan-messages'),
          fetch('/api/polls'),
          fetch('/api/quizzes')
        ]);

        const [messagesData, pollsData, quizzesData] = await Promise.all([
          messagesRes.json(),
          pollsRes.json(),
          quizzesRes.json()
        ]);

        setFanMessages(messagesData);
        setPolls(pollsData);
        setQuizzes(quizzesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section id="community" className="py-20 bg-gradient-to-br from-uganda-red/5 to-uganda-gold/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uganda-gold mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading Fan Community...</p>
          </div>
        </div>
      </section>
    );
  }





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
            Connect with fellow fans, participate in polls and quizzes, and showcase your love for Uganda&apos;s beauty
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-background rounded-full p-2 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'wall' | 'polls' | 'quizzes' | 'leaderboard')}
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
                            <h4 className="font-semibold text-foreground">{message.user?.name || 'Anonymous'}</h4>
                            <span className="text-xs text-muted-foreground">{new Date(message.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {message.type === 'ART' && <Palette className="h-4 w-4 text-uganda-gold" />}
                            {message.type === 'PHOTO' && <Camera className="h-4 w-4 text-uganda-green" />}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{message.content}</p>
                        
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-2 px-3 py-1 rounded-lg transition-all bg-muted text-muted-foreground hover:bg-uganda-red hover:text-background">
                            <Heart className="h-4 w-4" />
                            <span className="text-sm">{message.likes?.length || 0}</span>
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
                      <span>Ends {new Date(poll.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {poll.options.map((option) => {
                      const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                      const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                      
                      return (
                        <div key={option.id} className="relative">
                          <button
                            onClick={() => handleVote(poll.id, option.id)}
                            disabled={selectedPoll === poll.id}
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              selectedPoll === poll.id
                                ? 'border-uganda-gold bg-uganda-gold/10'
                                : 'border-muted hover:border-uganda-green hover:bg-uganda-green/5'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-foreground">{option.text}</span>
                              <span className="text-sm text-muted-foreground">
                                {option.votes} votes ({percentage}%)
                              </span>
                            </div>
                            {selectedPoll === poll.id && (
                              <div className="mt-2 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-uganda-gold to-warm-gold h-2 rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Total votes: {poll.options.reduce((sum, opt) => sum + opt.votes, 0)}</span>
                    {selectedPoll === poll.id && (
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
                    {quiz.scores && quiz.scores.length > 0 && (
                      <div className="flex items-center space-x-1 text-uganda-green">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">{quiz.scores[0].score}%</span>
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
                    quiz.scores && quiz.scores.length > 0
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black hover:shadow-md'
                  }`}>
                    {quiz.scores && quiz.scores.length > 0 ? 'Completed' : 'Start Quiz'}
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
                    {quizzes.flatMap(quiz => quiz.scores || []).slice(0, 5).map((score, index) => (
                      <motion.div
                        key={score.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center space-x-4 p-4 rounded-lg ${
                          index < 3 ? 'bg-gradient-to-r from-uganda-gold/10 to-warm-gold/10' : 'bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-uganda-green to-deep-green text-background font-bold">
                          {index < 3 ? (
                            <Trophy className="h-6 w-6" />
                          ) : (
                            <span>#{index + 1}</span>
                          )}
                        </div>

                        <div className="w-12 h-12 bg-gradient-to-r from-uganda-gold to-warm-gold rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-uganda-black" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-foreground">{score.user?.name || 'Anonymous'}</h4>
                            <span className="bg-uganda-green/20 text-uganda-green px-2 py-1 rounded text-xs font-medium">
                              Quiz Master
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Score: {score.score}%</span>
                            <span>•</span>
                            <span>{new Date(score.completedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-uganda-gold">{score.score}</div>
                          <div className="text-sm text-muted-foreground">%</div>
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
