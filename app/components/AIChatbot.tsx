"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot
} from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI tourism guide. I can help you learn about Uganda's culture, destinations, and answer questions about Miss Tourism Uganda. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    "Tell me about Uganda's culture",
    "What are the best tourist destinations?",
    "Tell me about Miss Tourism Uganda",
    "What's the weather like in Uganda?",
    "What traditional foods should I try?"
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: generateBotResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('culture') || input.includes('traditional')) {
      return "Uganda has a rich cultural heritage with over 50 ethnic groups! The Baganda, Banyankole, and Acholi are some of the largest. Traditional dances like the Kiganda dance and cultural ceremonies are truly spectacular. The Queen often participates in cultural events to promote Uganda's heritage.";
    }
    
    if (input.includes('destination') || input.includes('tourist') || input.includes('visit')) {
      return "Uganda is called the 'Pearl of Africa' for good reason! Must-visit destinations include Murchison Falls National Park, Bwindi Impenetrable Forest for gorilla trekking, Lake Bunyonyi, and the Source of the Nile in Jinja. Each offers unique experiences that showcase Uganda's natural beauty.";
    }
    
    if (input.includes('miss tourism') || input.includes('queen')) {
      return "Miss Tourism Uganda represents the beauty, culture, and tourism potential of Uganda. The Queen travels across the country, promotes tourism, participates in cultural events, and serves as an ambassador for Uganda's rich heritage and natural wonders.";
    }
    
    if (input.includes('weather') || input.includes('climate')) {
      return "Uganda has a tropical climate with two dry seasons (December-February and June-August) and two wet seasons. The temperature is generally pleasant year-round, averaging 25-30°C. The dry seasons are perfect for wildlife viewing and outdoor activities!";
    }
    
    if (input.includes('food') || input.includes('eat') || input.includes('cuisine')) {
      return "Ugandan cuisine is delicious and diverse! Try matooke (steamed bananas), posho (maize meal), groundnut sauce, and rolex (chapati with eggs). Traditional dishes vary by region, and the Queen often shares her favorite local foods during her travels.";
    }
    
    if (input.includes('wildlife') || input.includes('animals') || input.includes('safari')) {
      return "Uganda is home to incredible wildlife! You can see the Big Five, mountain gorillas, chimpanzees, and over 1000 bird species. National parks like Queen Elizabeth, Murchison Falls, and Bwindi offer amazing safari experiences. The Queen frequently visits these parks to promote conservation tourism.";
    }
    
    return "That's a great question! Uganda is truly amazing with its diverse culture, stunning landscapes, and warm people. The Queen is passionate about sharing Uganda's beauty with the world. Is there something specific about Uganda you'd like to learn more about?";
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-uganda-gold to-warm-gold rounded-full shadow-lg hover:shadow-xl transition-all z-40 flex items-center justify-center"
      >
        <MessageCircle className="h-6 w-6 text-uganda-black" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-background rounded-xl shadow-2xl border border-uganda-gold/20 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-uganda-gold to-warm-gold p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-uganda-black" />
                <span className="font-semibold text-uganda-black">Tourism Guide</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-uganda-black hover:text-uganda-black/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isBot
                        ? 'bg-muted text-foreground'
                        : 'bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-uganda-gold rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-uganda-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-uganda-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="p-4 border-t border-muted">
                <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                <div className="space-y-1">
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="block w-full text-left text-xs text-uganda-green hover:text-uganda-gold transition-colors p-1"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-muted">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about Uganda..."
                  className="flex-1 p-2 border border-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-uganda-gold"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-gradient-to-r from-uganda-gold to-warm-gold rounded-lg hover:shadow-md transition-all"
                >
                  <Send className="h-4 w-4 text-uganda-black" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
