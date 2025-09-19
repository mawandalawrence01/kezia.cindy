"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Camera,
  Star,
  Navigation,
  TreePine,
  Waves,
  Building,
  X
} from "lucide-react";

interface Destination {
  id: number;
  name: string;
  region: string;
  type: 'national_park' | 'waterfall' | 'lake' | 'city' | 'cultural_site';
  description: string;
  highlights: string[];
  bestTime: string;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rating: number;
  coordinates: { x: number; y: number };
  hasAudio: boolean;
  has360: boolean;
  image: string;
  stories?: { id: number; title: string; content: string; author: string; date: string }[];
}

interface Story {
  id: number;
  title: string;
  destination: string;
  duration: string;
  audioUrl: string;
  transcript: string;
  isPlaying: boolean;
}

export default function TourismExplorer() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [speechRate, setSpeechRate] = useState(0.9);
  const [speechPitch, setSpeechPitch] = useState(1.0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destinationsRes] = await Promise.all([
          fetch('/api/destinations'),
          fetch('/api/destinations') // Stories are included in destinations
        ]);

        const [destinationsData] = await Promise.all([
          destinationsRes.json(),
        ]);

        setDestinations(destinationsData);
        setStories(destinationsData.flatMap((dest: Destination) => dest.stories || []));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize speech synthesis and load voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      setSpeechSynthesis(synth);
      
      // Load voices
      const loadVoices = () => {
        const voices = synth.getVoices();
        setAvailableVoices(voices);
        
        // Set default voice (prefer female voices)
        if (voices.length > 0 && !selectedVoice) {
          const femaleVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('woman') ||
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('karen') ||
            voice.name.toLowerCase().includes('susan') ||
            voice.name.toLowerCase().includes('zira') ||
            voice.name.toLowerCase().includes('hazel')
          );
          
          setSelectedVoice(femaleVoice || voices[0]);
        }
      };
      
      // Load voices immediately if available
      loadVoices();
      
      // Some browsers load voices asynchronously
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
      }
    }
  }, [selectedVoice]);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (currentUtterance) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentUtterance]);

  if (loading) {
    return (
      <section id="tourism" className="py-20 bg-gradient-to-br from-uganda-green/5 to-earth-brown/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uganda-gold mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading Tourism Explorer...</p>
          </div>
        </div>
      </section>
    );
  }



  const getIconForType = (type: string) => {
    switch (type) {
      case 'national_park': return TreePine;
      case 'waterfall': return Waves;
      case 'lake': return Waves;
      case 'city': return Building;
      case 'cultural_site': return Building;
      default: return MapPin;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-uganda-green';
      case 'medium': return 'text-uganda-gold';
      case 'hard': return 'text-uganda-red';
      default: return 'text-muted-foreground';
    }
  };

  const handlePlayStory = (story: Story) => {
    setActiveStory(story);
    startTextToSpeech(story);
  };

  const startTextToSpeech = (story: Story) => {
    if (!speechSynthesis) {
      alert('Text-to-speech is not supported in your browser. Please try a modern browser like Chrome, Firefox, or Safari.');
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(story.transcript);
    
    // Configure speech settings
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.volume = isMuted ? 0 : 1.0;
    
    // Use the selected voice
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Set up event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      console.log('Started reading story:', story.title);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
      console.log('Finished reading story:', story.title);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setCurrentUtterance(null);
      alert('Sorry, there was an error reading the story. Please try again.');
    };

    utterance.onpause = () => {
      setIsPlaying(false);
    };

    utterance.onresume = () => {
      setIsPlaying(true);
    };

    // Store current utterance for control
    setCurrentUtterance(utterance);
    
    // Start speaking
    speechSynthesis.speak(utterance);
  };

  const handlePlayPause = () => {
    if (!speechSynthesis || !currentUtterance) return;

    if (isPlaying) {
      speechSynthesis.pause();
    } else {
      speechSynthesis.resume();
    }
  };

  const handleStop = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
    }
  };

  const handleMuteToggle = () => {
    if (currentUtterance) {
      currentUtterance.volume = isMuted ? 1.0 : 0;
    }
    setIsMuted(!isMuted);
  };

  const handleVoiceChange = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    
    // If currently playing, restart with new voice
    if (isPlaying && activeStory) {
      handleStop();
      setTimeout(() => {
        startTextToSpeech(activeStory);
      }, 100);
    }
  };

  return (
    <>
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FCD34D;
          cursor: pointer;
          border: 2px solid #1F2937;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #FCD34D;
          cursor: pointer;
          border: 2px solid #1F2937;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-webkit-slider-track {
          background: #E5E7EB;
          border-radius: 8px;
        }
        
        .slider::-moz-range-track {
          background: #E5E7EB;
          border-radius: 8px;
          height: 8px;
        }
      `}</style>
      <section id="tourism" className="py-20 bg-gradient-to-br from-uganda-green/5 to-earth-brown/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-uganda-green mb-4">
            Tourism Explorer
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover Uganda&apos;s hidden gems through interactive maps, narrated stories, and 360° experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-background rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">Interactive Uganda Map</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Navigation className="h-4 w-4" />
                  <span>Click on destinations to explore</span>
                </div>
              </div>

              {/* Map Container */}
              <div className="relative bg-gradient-to-br from-uganda-green/20 to-deep-green/20 rounded-lg h-96 overflow-hidden">
                {/* Simplified map representation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl text-uganda-green/30">
                    🇺🇬
                  </div>
                </div>

                {/* Destination Markers */}
                {destinations.map((destination) => {
                  const IconComponent = getIconForType(destination.type);
                  return (
                    <motion.button
                      key={destination.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: destination.id * 0.1 }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedDestination(destination)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                        selectedDestination?.id === destination.id
                          ? 'z-10'
                          : 'z-0'
                      }`}
                      style={{
                        left: `${destination.coordinates.x}%`,
                        top: `${destination.coordinates.y}%`
                      }}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        selectedDestination?.id === destination.id
                          ? 'bg-uganda-gold text-uganda-black scale-125'
                          : 'bg-uganda-green text-background hover:bg-uganda-gold hover:text-uganda-black'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Map Legend */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { type: 'national_park', label: 'National Parks', icon: TreePine, color: 'text-uganda-green' },
                  { type: 'waterfall', label: 'Waterfalls', icon: Waves, color: 'text-uganda-gold' },
                  { type: 'lake', label: 'Lakes', icon: Waves, color: 'text-uganda-gold' },
                  { type: 'city', label: 'Cities', icon: Building, color: 'text-uganda-red' },
                  { type: 'cultural_site', label: 'Cultural Sites', icon: Building, color: 'text-earth-brown' }
                ].map((item) => (
                  <div key={item.type} className="flex items-center space-x-2">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Destination Details */}
          <div className="space-y-6">
            {selectedDestination ? (
              <motion.div
                key={selectedDestination.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-background rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground">{selectedDestination.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-uganda-gold text-uganda-gold" />
                    <span className="text-sm font-medium">{selectedDestination.rating}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-uganda-green mb-4">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{selectedDestination.region}</span>
                </div>

                <p className="text-muted-foreground mb-4 text-sm">{selectedDestination.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Best Time:</span>
                    <span className="font-medium">{selectedDestination.bestTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{selectedDestination.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span className={`font-medium ${getDifficultyColor(selectedDestination.difficulty)}`}>
                      {selectedDestination.difficulty}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <h4 className="font-semibold text-foreground">Highlights:</h4>
                  <ul className="space-y-1">
                    {selectedDestination.highlights.map((highlight, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-uganda-gold rounded-full"></div>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2">
                  {selectedDestination.hasAudio && (
                    <button className="flex-1 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black py-2 px-4 rounded-lg font-semibold hover:shadow-md transition-all">
                      <Play className="h-4 w-4 inline mr-2" />
                      Audio Story
                    </button>
                  )}
                  {selectedDestination.has360 && (
                    <button className="flex-1 border border-uganda-green text-uganda-green py-2 px-4 rounded-lg font-semibold hover:bg-uganda-green hover:text-background transition-all">
                      <Camera className="h-4 w-4 inline mr-2" />
                      360° Tour
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-background rounded-xl shadow-lg p-6 text-center"
              >
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Select a Destination</h3>
                <p className="text-muted-foreground text-sm">
                  Click on any marker on the map to explore Uganda&apos;s amazing destinations
                </p>
              </motion.div>
            )}

            {/* Narrated Stories */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-background rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-foreground mb-4">Narrated Stories</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Listen to the Queen&apos;s personal experiences and insights about Uganda&apos;s destinations
              </p>

              <div className="space-y-4">
                {stories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-muted rounded-lg p-4 hover:border-uganda-gold transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{story.title}</h4>
                      <span className="text-sm text-muted-foreground">{story.duration}</span>
                    </div>
                    
                    <p className="text-sm text-uganda-green mb-3">{story.destination}</p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{story.transcript}</p>
                    
                    <button
                      onClick={() => handlePlayStory(story)}
                      className={`flex items-center space-x-2 transition-colors ${
                        activeStory?.id === story.id && isPlaying
                          ? 'text-uganda-red'
                          : 'text-uganda-gold hover:text-warm-gold'
                      }`}
                    >
                      {activeStory?.id === story.id && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">
                        {activeStory?.id === story.id && isPlaying ? 'Reading...' : 'Play Story'}
                      </span>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Audio Player Modal */}
        <AnimatePresence>
          {activeStory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => {
                handleStop();
                setActiveStory(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background rounded-xl max-w-2xl w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-foreground">{activeStory.title}</h3>
                  <button
                    onClick={() => {
                      handleStop();
                      setActiveStory(null);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="bg-gradient-to-r from-uganda-gold/20 to-warm-gold/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-2">{activeStory.destination}</p>
                  <p className="text-foreground">{activeStory.transcript}</p>
                </div>

                {/* Voice Selector */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      Voice Selection
                    </label>
                    <button
                      onClick={() => {
                        if (selectedVoice && speechSynthesis) {
                          const testUtterance = new SpeechSynthesisUtterance("Hello, this is a voice preview.");
                          testUtterance.voice = selectedVoice;
                          testUtterance.rate = speechRate;
                          testUtterance.pitch = speechPitch;
                          speechSynthesis.speak(testUtterance);
                        }
                      }}
                      className="text-xs bg-uganda-green text-background px-2 py-1 rounded hover:bg-uganda-green/80 transition-colors"
                      disabled={!selectedVoice}
                    >
                      Test Voice
                    </button>
                  </div>
                  <select
                    value={selectedVoice?.name || ''}
                    onChange={(e) => {
                      const voice = availableVoices.find(v => v.name === e.target.value);
                      if (voice) handleVoiceChange(voice);
                    }}
                    className="w-full p-3 border border-muted rounded-lg bg-background text-foreground focus:border-uganda-gold focus:ring-2 focus:ring-uganda-gold/20 transition-all"
                    disabled={!availableVoices.length}
                  >
                    {availableVoices.length === 0 ? (
                      <option value="">Loading voices...</option>
                    ) : (
                      availableVoices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name} {voice.lang && `(${voice.lang})`}
                        </option>
                      ))
                    )}
                  </select>
                  {availableVoices.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {availableVoices.length} voice{availableVoices.length !== 1 ? 's' : ''} available
                    </p>
                  )}
                </div>

                {/* Speech Settings */}
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Speech Rate: {speechRate.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={speechRate}
                      onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Slow (0.5x)</span>
                      <span>Normal (1.0x)</span>
                      <span>Fast (2.0x)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Voice Pitch: {speechPitch.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={speechPitch}
                      onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Low (0.5)</span>
                      <span>Normal (1.0)</span>
                      <span>High (2.0)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handlePlayPause}
                      className="w-12 h-12 bg-gradient-to-r from-uganda-gold to-warm-gold rounded-full flex items-center justify-center hover:shadow-md transition-all"
                      disabled={!currentUtterance}
                    >
                      {isPlaying ? <Pause className="h-6 w-6 text-uganda-black" /> : <Play className="h-6 w-6 text-uganda-black" />}
                    </button>
                    
                    <button
                      onClick={handleStop}
                      className="w-10 h-10 bg-uganda-red text-background rounded-full flex items-center justify-center hover:shadow-md transition-all"
                      disabled={!currentUtterance}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={handleMuteToggle}
                      className="p-2 text-muted-foreground hover:text-uganda-gold transition-colors"
                      disabled={!currentUtterance}
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {isPlaying ? 'Reading...' : 'Ready to read'} • Duration: {activeStory.duration}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
    </>
  );
}
