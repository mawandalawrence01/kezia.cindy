"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Save, 
  ArrowLeft, 
  X,
  Loader2,
  MapPin,
  Clock,
  Play,
  Volume2
} from "lucide-react";

interface Destination {
  id: string;
  name: string;
  region: string;
  type: string;
}

export default function NewStoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    destinationId: "",
    duration: "",
    transcript: ""
  });

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/destinations');
        const data = await response.json();
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, []);

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/ogg'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'];
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
        alert('Please select a valid audio file (MP3, WAV, M4A, AAC, OGG, FLAC)');
        return;
      }
      
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }
      
      console.log('Audio file selected:', {
        name: file.name,
        size: file.size,
        type: file.type,
        extension: fileExtension
      });
      
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioPreview(url);
    }
  };

  const removeAudio = () => {
    setAudioFile(null);
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
      setAudioPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('destinationId', formData.destinationId);
      submitData.append('duration', formData.duration);
      submitData.append('transcript', formData.transcript);
      
      if (audioFile) {
        submitData.append('audio', audioFile);
      }

      const response = await fetch('/api/admin/stories', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        router.push('/admin/stories');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  const selectedDestination = destinations.find(d => d.id === formData.destinationId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Story</h1>
          <p className="text-muted-foreground mt-2">
            Add a new narrated story for a destination
          </p>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background rounded-xl p-6 shadow-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              placeholder="Enter story title"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Destination */}
            <div className="space-y-2">
              <label htmlFor="destinationId" className="text-sm font-medium text-foreground">
                Destination *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  id="destinationId"
                  value={formData.destinationId}
                  onChange={(e) => setFormData({ ...formData, destinationId: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                  required
                >
                  <option value="">Select a destination</option>
                  {destinations.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                      {destination.name} - {destination.region}
                    </option>
                  ))}
                </select>
              </div>
              {selectedDestination && (
                <p className="text-sm text-muted-foreground">
                  {selectedDestination.type} • {selectedDestination.region}
                </p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium text-foreground">
                Duration *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
                  placeholder="e.g., 5:30, 10 min"
                  required
                />
              </div>
            </div>
          </div>

          {/* Audio Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Audio File
            </label>
            {!audioPreview ? (
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-uganda-gold transition-colors">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="hidden"
                  id="audio-upload"
                />
                <label
                  htmlFor="audio-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Volume2 className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Click to upload audio file
                    </p>
                    <p className="text-xs text-muted-foreground">
                      MP3, WAV, M4A up to 50MB
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative">
                <div className="flex items-center space-x-4 p-4 bg-uganda-gold/10 rounded-lg">
                  <Play className="h-8 w-8 text-uganda-gold" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Audio file uploaded</p>
                    <p className="text-sm text-muted-foreground">
                      {audioFile?.name} • {audioFile && (audioFile.size / 1024 / 1024).toFixed(1)}MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeAudio}
                    className="p-1 text-uganda-red hover:bg-uganda-red/10 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <audio controls className="w-full mt-2">
                  <source src={audioPreview} type={audioFile?.type} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>

          {/* Transcript */}
          <div className="space-y-2">
            <label htmlFor="transcript" className="text-sm font-medium text-foreground">
              Transcript *
            </label>
            <textarea
              id="transcript"
              value={formData.transcript}
              onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 border border-muted rounded-lg focus:ring-2 focus:ring-uganda-gold focus:border-transparent"
              placeholder="Write the full transcript of the story..."
              required
            />
            <p className="text-xs text-muted-foreground">
              This will be used for accessibility and search purposes.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-gradient-to-r from-uganda-gold to-warm-gold text-uganda-black px-6 py-2 rounded-lg font-semibold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Create Story</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
