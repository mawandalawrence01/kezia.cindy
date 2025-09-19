import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'sarah@example.com' },
      update: {},
      create: {
        email: 'sarah@example.com',
        name: 'Sarah M.',
        avatar: '/api/placeholder/40/40',
      },
    }),
    prisma.user.upsert({
      where: { email: 'david@example.com' },
      update: {},
      create: {
        email: 'david@example.com',
        name: 'David K.',
        avatar: '/api/placeholder/40/40',
      },
    }),
    prisma.user.upsert({
      where: { email: 'grace@example.com' },
      update: {},
      create: {
        email: 'grace@example.com',
        name: 'Grace L.',
        avatar: '/api/placeholder/40/40',
      },
    }),
  ])

  console.log('✅ Created users')

  // Create daily quotes
  const quotes = await Promise.all([
    prisma.dailyQuote.upsert({
      where: { date: new Date('2024-01-15') },
      update: {},
      create: {
        text: "The Pearl of Africa awaits your discovery",
        author: "Winston Churchill",
        date: new Date('2024-01-15'),
      },
    }),
    prisma.dailyQuote.upsert({
      where: { date: new Date('2024-01-16') },
      update: {},
      create: {
        text: "Beauty is found in the heart of Uganda",
        author: "Ugandan Proverb",
        date: new Date('2024-01-16'),
      },
    }),
    prisma.dailyQuote.upsert({
      where: { date: new Date('2024-01-17') },
      update: {},
      create: {
        text: "Every journey begins with a single step",
        author: "Chinese Proverb",
        date: new Date('2024-01-17'),
      },
    }),
    prisma.dailyQuote.upsert({
      where: { date: new Date('2024-01-18') },
      update: {},
      create: {
        text: "Culture is the soul of a nation",
        author: "African Proverb",
        date: new Date('2024-01-18'),
      },
    }),
  ])

  console.log('✅ Created daily quotes')

  // Create destinations
  const destinations = await Promise.all([
    prisma.destination.upsert({
      where: { id: 'murchison-falls' },
      update: {},
      create: {
        id: 'murchison-falls',
        name: "Murchison Falls National Park",
        region: "Northern Uganda",
        type: 'NATIONAL_PARK',
        description: "Home to the spectacular Murchison Falls where the Nile River forces its way through a narrow gorge, creating one of the most powerful waterfalls in the world.",
        highlights: ["Boat cruise to the falls", "Big game viewing", "Bird watching", "Chimpanzee tracking"],
        bestTime: "December - February",
        duration: "2-3 days",
        difficulty: 'MEDIUM',
        rating: 4.9,
        coordinates: { x: 30, y: 25 },
        hasAudio: true,
        has360: true,
        image: "/api/placeholder/400/300",
      },
    }),
    prisma.destination.upsert({
      where: { id: 'bwindi-forest' },
      update: {},
      create: {
        id: 'bwindi-forest',
        name: "Bwindi Impenetrable Forest",
        region: "Southwestern Uganda",
        type: 'NATIONAL_PARK',
        description: "A UNESCO World Heritage Site and home to half of the world's remaining mountain gorillas. Experience the magic of gorilla trekking in this ancient forest.",
        highlights: ["Gorilla trekking", "Bird watching", "Cultural experiences", "Nature walks"],
        bestTime: "June - September",
        duration: "3-4 days",
        difficulty: 'HARD',
        rating: 4.8,
        coordinates: { x: 15, y: 70 },
        hasAudio: true,
        has360: false,
        image: "/api/placeholder/400/300",
      },
    }),
    prisma.destination.upsert({
      where: { id: 'source-nile' },
      update: {},
      create: {
        id: 'source-nile',
        name: "Source of the Nile",
        region: "Eastern Uganda",
        type: 'WATERFALL',
        description: "Where the world's longest river begins its journey. Visit the exact spot where John Hanning Speke first identified the source of the Nile in 1862.",
        highlights: ["Boat rides", "Water sports", "Historical significance", "Sunset views"],
        bestTime: "Year-round",
        duration: "1 day",
        difficulty: 'EASY',
        rating: 4.6,
        coordinates: { x: 75, y: 40 },
        hasAudio: true,
        has360: true,
        image: "/api/placeholder/400/300",
      },
    }),
    prisma.destination.upsert({
      where: { id: 'lake-bunyonyi' },
      update: {},
      create: {
        id: 'lake-bunyonyi',
        name: "Lake Bunyonyi",
        region: "Southwestern Uganda",
        type: 'LAKE',
        description: "Known as the 'Switzerland of Africa', this beautiful lake is dotted with 29 islands and offers stunning views and peaceful relaxation.",
        highlights: ["Island hopping", "Canoeing", "Bird watching", "Cultural tours"],
        bestTime: "Year-round",
        duration: "2-3 days",
        difficulty: 'EASY',
        rating: 4.7,
        coordinates: { x: 20, y: 75 },
        hasAudio: false,
        has360: true,
        image: "/api/placeholder/400/300",
      },
    }),
    prisma.destination.upsert({
      where: { id: 'kampala' },
      update: {},
      create: {
        id: 'kampala',
        name: "Kampala",
        region: "Central Uganda",
        type: 'CITY',
        description: "Uganda's vibrant capital city, a melting pot of cultures, history, and modern development. Experience the heart of Uganda's urban life.",
        highlights: ["Cultural sites", "Markets", "Nightlife", "Museums"],
        bestTime: "Year-round",
        duration: "2-3 days",
        difficulty: 'EASY',
        rating: 4.4,
        coordinates: { x: 50, y: 50 },
        hasAudio: true,
        has360: false,
        image: "/api/placeholder/400/300",
      },
    }),
  ])

  console.log('✅ Created destinations')

  // Create stories
  const stories = await Promise.all([
    prisma.story.upsert({
      where: { id: 'murchison-story' },
      update: {},
      create: {
        id: 'murchison-story',
        title: "The Power of Murchison Falls",
        destinationName: "Murchison Falls National Park",
        duration: "5:30",
        audioUrl: "/api/audio/murchison-falls-story.mp3",
        transcript: "As I stood at the edge of Murchison Falls, the raw power of the Nile River was overwhelming. The water thunders through a narrow 7-meter gorge, creating a mist that catches the sunlight like diamonds...",
        destinationId: 'murchison-falls',
      },
    }),
    prisma.story.upsert({
      where: { id: 'gorilla-story' },
      update: {},
      create: {
        id: 'gorilla-story',
        title: "Meeting the Gentle Giants",
        destinationName: "Bwindi Impenetrable Forest",
        duration: "7:15",
        audioUrl: "/api/audio/gorilla-trekking-story.mp3",
        transcript: "The moment I locked eyes with the silverback gorilla, time seemed to stand still. His gentle gaze held centuries of wisdom, and I felt honored to be in the presence of such magnificent creatures...",
        destinationId: 'bwindi-forest',
      },
    }),
    prisma.story.upsert({
      where: { id: 'nile-story' },
      update: {},
      create: {
        id: 'nile-story',
        title: "Where the Nile Begins",
        destinationName: "Source of the Nile",
        duration: "4:45",
        audioUrl: "/api/audio/nile-source-story.mp3",
        transcript: "Standing at the source of the Nile, I felt connected to history itself. This is where explorers once stood, where the world's longest river begins its incredible journey to the Mediterranean...",
        destinationId: 'source-nile',
      },
    }),
  ])

  console.log('✅ Created stories')

  // Create updates
  const updates = await Promise.all([
    prisma.update.upsert({
      where: { id: 'nile-update' },
      update: {},
      create: {
        id: 'nile-update',
        title: "Exploring the Source of the Nile",
        content: "Today I had the incredible opportunity to visit the Source of the Nile in Jinja. The power and beauty of this legendary river left me speechless. Standing where explorers once stood, I felt connected to Uganda's rich history and natural wonders.",
        type: 'TRAVEL',
        location: "Jinja, Uganda",
        image: "/api/placeholder/400/300",
        publishedAt: new Date('2024-01-15'),
      },
    }),
    prisma.update.upsert({
      where: { id: 'cultural-update' },
      update: {},
      create: {
        id: 'cultural-update',
        title: "Cultural Exchange with Local Communities",
        content: "Spent the day learning traditional dances and crafts from the Baganda community. Their warmth and hospitality remind me why Uganda is truly the Pearl of Africa. Every interaction teaches me something new about our beautiful culture.",
        type: 'EXPERIENCE',
        location: "Kampala, Uganda",
        image: "/api/placeholder/400/300",
        publishedAt: new Date('2024-01-12'),
      },
    }),
    prisma.update.upsert({
      where: { id: 'tourism-week-update' },
      update: {},
      create: {
        id: 'tourism-week-update',
        title: "Upcoming Tourism Week Events",
        content: "Excited to announce that I'll be participating in the National Tourism Week celebrations! Join me for cultural performances, tourism exhibitions, and community outreach programs across different regions of Uganda.",
        type: 'UPDATE',
        location: "Kampala, Uganda",
        image: "/api/placeholder/400/300",
        publishedAt: new Date('2024-01-10'),
      },
    }),
  ])

  console.log('✅ Created updates')

  // Create travel diaries
  const travelDiaries = await Promise.all([
    prisma.travelDiary.upsert({
      where: { id: 'murchison-diary' },
      update: {},
      create: {
        id: 'murchison-diary',
        title: "Murchison Falls Adventure",
        location: "Murchison Falls National Park",
        content: "An unforgettable safari experience where I witnessed the raw power of nature. The falls were absolutely breathtaking, and the wildlife encounters were beyond my wildest dreams.",
        images: ["/api/placeholder/400/300", "/api/placeholder/400/300", "/api/placeholder/400/300"],
        highlights: ["Boat cruise to the falls", "Elephant encounters", "Traditional dance performance"],
        rating: 5,
        date: new Date('2024-01-08'),
      },
    }),
    prisma.travelDiary.upsert({
      where: { id: 'bwindi-diary' },
      update: {},
      create: {
        id: 'bwindi-diary',
        title: "Bwindi Impenetrable Forest",
        location: "Bwindi, Uganda",
        content: "Meeting the mountain gorillas was a life-changing experience. These gentle giants reminded me of the importance of conservation and our responsibility to protect Uganda's natural heritage.",
        images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
        highlights: ["Gorilla trekking", "Community visit", "Cultural storytelling"],
        rating: 5,
        date: new Date('2024-01-05'),
      },
    }),
  ])

  console.log('✅ Created travel diaries')

  // Create experiences
  const experiences = await Promise.all([
    prisma.experience.upsert({
      where: { id: 'cooking-experience' },
      update: {},
      create: {
        id: 'cooking-experience',
        title: "Learning Traditional Cooking",
        description: "Mastered the art of preparing matooke and groundnut sauce with local chefs",
        category: "Culinary",
        duration: "3 hours",
        participants: 12,
        rating: 5,
      },
    }),
    prisma.experience.upsert({
      where: { id: 'basket-weaving' },
      update: {},
      create: {
        id: 'basket-weaving',
        title: "Basket Weaving Workshop",
        description: "Created beautiful traditional baskets while learning about their cultural significance",
        category: "Crafts",
        duration: "2 hours",
        participants: 8,
        rating: 5,
      },
    }),
    prisma.experience.upsert({
      where: { id: 'drumming-circle' },
      update: {},
      create: {
        id: 'drumming-circle',
        title: "Drumming Circle",
        description: "Learned traditional Ugandan rhythms and their meanings in cultural ceremonies",
        category: "Music",
        duration: "1.5 hours",
        participants: 15,
        rating: 5,
      },
    }),
  ])

  console.log('✅ Created experiences')

  // Create photos
  const photos = await Promise.all([
    prisma.photo.upsert({
      where: { id: 'sunset-murchison' },
      update: {},
      create: {
        id: 'sunset-murchison',
        title: "Sunset at Murchison Falls",
        description: "The golden hour at one of Uganda's most spectacular natural wonders",
        image: "/api/placeholder/400/600",
        category: 'NATURE',
        location: "Murchison Falls National Park",
        date: new Date('2024-01-15'),
      },
    }),
    prisma.photo.upsert({
      where: { id: 'traditional-dance' },
      update: {},
      create: {
        id: 'traditional-dance',
        title: "Traditional Dance Performance",
        description: "Capturing the vibrant energy of Ugandan cultural dances",
        image: "/api/placeholder/400/600",
        category: 'CULTURE',
        location: "Kampala Cultural Center",
        date: new Date('2024-01-12'),
      },
    }),
    prisma.photo.upsert({
      where: { id: 'evening-gown' },
      update: {},
      create: {
        id: 'evening-gown',
        title: "Elegant Evening Gown",
        description: "Showcasing modern African fashion with traditional influences",
        image: "/api/placeholder/400/600",
        category: 'FASHION',
        location: "Kampala Fashion Week",
        date: new Date('2024-01-10'),
      },
    }),
    prisma.photo.upsert({
      where: { id: 'tourism-week-opening' },
      update: {},
      create: {
        id: 'tourism-week-opening',
        title: "Tourism Week Opening",
        description: "Celebrating Uganda's tourism potential with local communities",
        image: "/api/placeholder/400/600",
        category: 'EVENTS',
        location: "National Theatre, Kampala",
        date: new Date('2024-01-08'),
      },
    }),
    prisma.photo.upsert({
      where: { id: 'gorilla-encounter' },
      update: {},
      create: {
        id: 'gorilla-encounter',
        title: "Gorilla Encounter",
        description: "A magical moment with Uganda's gentle giants",
        image: "/api/placeholder/400/600",
        category: 'NATURE',
        location: "Bwindi Impenetrable Forest",
        date: new Date('2024-01-05'),
      },
    }),
    prisma.photo.upsert({
      where: { id: 'market-colors' },
      update: {},
      create: {
        id: 'market-colors',
        title: "Market Day Colors",
        description: "The vibrant colors and energy of local markets",
        image: "/api/placeholder/400/600",
        category: 'CULTURE',
        location: "Owino Market, Kampala",
        date: new Date('2024-01-03'),
      },
    }),
  ])

  console.log('✅ Created photos')

  // Create outfits
  const outfits = await Promise.all([
    prisma.outfit.upsert({
      where: { id: 'elegant-gomesi' },
      update: {},
      create: {
        id: 'elegant-gomesi',
        title: "Elegant Gomesi",
        description: "Traditional Ugandan dress with modern elegance, perfect for cultural ceremonies and formal events",
        category: 'TRADITIONAL',
        image: "/api/placeholder/400/600",
        designer: "Kampala Fashion House",
        occasion: "Cultural Ceremonies",
        culturalSignificance: "The Gomesi represents the rich heritage of the Baganda people and is worn during important cultural events",
        tags: ["traditional", "gomesi", "cultural", "elegant"],
        location: "Kampala Cultural Center",
        date: new Date('2024-01-15'),
      },
    }),
    prisma.outfit.upsert({
      where: { id: 'modern-african-print' },
      update: {},
      create: {
        id: 'modern-african-print',
        title: "Modern African Print",
        description: "Contemporary design featuring vibrant African prints with a modern silhouette",
        category: 'MODERN',
        image: "/api/placeholder/400/600",
        designer: "African Couture",
        occasion: "Fashion Week",
        culturalSignificance: "Celebrates modern African identity while honoring traditional textile patterns",
        tags: ["modern", "african print", "contemporary", "vibrant"],
        location: "Kampala Fashion Week",
        date: new Date('2024-01-12'),
      },
    }),
    prisma.outfit.upsert({
      where: { id: 'royal-evening-gown' },
      update: {},
      create: {
        id: 'royal-evening-gown',
        title: "Royal Evening Gown",
        description: "Stunning evening gown with intricate beadwork and elegant draping",
        category: 'FORMAL',
        image: "/api/placeholder/400/600",
        designer: "Royal Designs",
        occasion: "Pageant Events",
        culturalSignificance: "Represents the grace and dignity of Miss Tourism Uganda",
        tags: ["formal", "evening gown", "beadwork", "elegant"],
        location: "National Theatre",
        date: new Date('2024-01-10'),
      },
    }),
    prisma.outfit.upsert({
      where: { id: 'casual-safari-chic' },
      update: {},
      create: {
        id: 'casual-safari-chic',
        title: "Casual Safari Chic",
        description: "Comfortable yet stylish outfit perfect for tourism activities and outdoor adventures",
        category: 'CASUAL',
        image: "/api/placeholder/400/600",
        designer: "Safari Style",
        occasion: "Tourism Activities",
        culturalSignificance: "Practical fashion that celebrates Uganda's natural beauty and adventure tourism",
        tags: ["casual", "safari", "comfortable", "outdoor"],
        location: "Murchison Falls",
        date: new Date('2024-01-08'),
      },
    }),
    prisma.outfit.upsert({
      where: { id: 'cultural-dance-attire' },
      update: {},
      create: {
        id: 'cultural-dance-attire',
        title: "Cultural Dance Attire",
        description: "Traditional dance costume with vibrant colors and flowing fabrics",
        category: 'CULTURAL',
        image: "/api/placeholder/400/600",
        designer: "Cultural Heritage",
        occasion: "Cultural Performances",
        culturalSignificance: "Honors the traditional dances and cultural expressions of Uganda's diverse communities",
        tags: ["cultural", "dance", "traditional", "vibrant"],
        location: "Cultural Festival",
        date: new Date('2024-01-05'),
      },
    }),
  ])

  console.log('✅ Created outfits')

  // Create events
  const events = await Promise.all([
    prisma.event.upsert({
      where: { id: 'tourism-week-opening' },
      update: {},
      create: {
        id: 'tourism-week-opening',
        title: "National Tourism Week Opening",
        description: "Join us for the grand opening of National Tourism Week with cultural performances, exhibitions, and community outreach programs",
        date: new Date('2024-02-15'),
        time: "10:00 AM",
        location: "National Theatre, Kampala",
        type: 'TOURISM',
        status: 'UPCOMING',
        attendees: 1250,
        highlights: ["Cultural performances", "Tourism exhibitions", "Community outreach", "Networking opportunities"],
        image: "/api/placeholder/400/300",
      },
    }),
    prisma.event.upsert({
      where: { id: 'miss-tourism-pageant' },
      update: {},
      create: {
        id: 'miss-tourism-pageant',
        title: "Miss Tourism Uganda Pageant",
        description: "The prestigious Miss Tourism Uganda pageant showcasing beauty, intelligence, and cultural awareness",
        date: new Date('2024-03-20'),
        time: "7:00 PM",
        location: "Kampala Serena Hotel",
        type: 'PAGEANT',
        status: 'UPCOMING',
        attendees: 500,
        highlights: ["Beauty pageant", "Cultural showcase", "Talent competition", "Awards ceremony"],
        image: "/api/placeholder/400/300",
      },
    }),
    prisma.event.upsert({
      where: { id: 'cultural-heritage-festival' },
      update: {},
      create: {
        id: 'cultural-heritage-festival',
        title: "Cultural Heritage Festival",
        description: "Celebrating Uganda's rich cultural diversity with traditional dances, crafts, and storytelling",
        date: new Date('2024-02-28'),
        time: "2:00 PM",
        location: "Uganda Museum",
        type: 'CULTURAL',
        status: 'UPCOMING',
        attendees: 800,
        highlights: ["Traditional dances", "Craft exhibitions", "Storytelling sessions", "Cultural workshops"],
        image: "/api/placeholder/400/300",
      },
    }),
    prisma.event.upsert({
      where: { id: 'wildlife-conservation-summit' },
      update: {},
      create: {
        id: 'wildlife-conservation-summit',
        title: "Wildlife Conservation Summit",
        description: "A live discussion on wildlife conservation efforts and sustainable tourism practices",
        date: new Date('2024-01-25'),
        time: "3:00 PM",
        location: "Online Event",
        type: 'TOURISM',
        status: 'LIVE',
        attendees: 320,
        highlights: ["Expert panel discussion", "Q&A session", "Conservation strategies", "Networking"],
        image: "/api/placeholder/400/300",
      },
    }),
  ])

  console.log('✅ Created events')

  // Create competitions
  const competitions = await Promise.all([
    prisma.competition.upsert({
      where: { id: 'photo-contest' },
      update: {},
      create: {
        id: 'photo-contest',
        title: "Best Tourism Photo Contest",
        description: "Capture the beauty of Uganda and share your best tourism photos for a chance to win amazing prizes",
        category: 'PHOTO',
        endDate: new Date('2024-02-20'),
        prize: "Professional camera + Tourism package",
      },
    }),
    prisma.competition.upsert({
      where: { id: 'art-challenge' },
      update: {},
      create: {
        id: 'art-challenge',
        title: "Ugandan Culture Art Challenge",
        description: "Create digital or traditional art inspired by Ugandan culture and traditions",
        category: 'ART',
        endDate: new Date('2024-03-01'),
        prize: "Art supplies + Exhibition opportunity",
      },
    }),
    prisma.competition.upsert({
      where: { id: 'poetry-competition' },
      update: {},
      create: {
        id: 'poetry-competition',
        title: "Tourism Poetry Competition",
        description: "Write poems celebrating Uganda's natural beauty, culture, and tourism potential",
        category: 'POETRY',
        endDate: new Date('2024-02-25'),
        prize: "Publishing opportunity + Cash prize",
      },
    }),
    prisma.competition.upsert({
      where: { id: 'vlog-challenge' },
      update: {},
      create: {
        id: 'vlog-challenge',
        title: "Travel Vlog Challenge",
        description: "Create engaging travel vlogs showcasing Uganda's hidden gems and tourist attractions",
        category: 'VIDEO',
        endDate: new Date('2024-03-10'),
        prize: "Video equipment + Tourism sponsorship",
      },
    }),
  ])

  console.log('✅ Created competitions')

  // Create polls
  const poll = await prisma.poll.upsert({
    where: { id: 'outfit-poll' },
    update: {},
    create: {
      id: 'outfit-poll',
      question: "What should the Queen wear for the next cultural event?",
      description: "Help choose the perfect outfit for the upcoming National Cultural Festival",
      endDate: new Date('2024-01-25'),
    },
  })

  // Create poll options
  const pollOptions = await Promise.all([
    prisma.pollOption.upsert({
      where: { id: 'gomesi-option' },
      update: {},
      create: {
        id: 'gomesi-option',
        text: "Traditional Gomesi",
        pollId: poll.id,
        votes: 234,
      },
    }),
    prisma.pollOption.upsert({
      where: { id: 'african-print-option' },
      update: {},
      create: {
        id: 'african-print-option',
        text: "Modern African Print",
        pollId: poll.id,
        votes: 189,
      },
    }),
    prisma.pollOption.upsert({
      where: { id: 'evening-gown-option' },
      update: {},
      create: {
        id: 'evening-gown-option',
        text: "Elegant Evening Gown",
        pollId: poll.id,
        votes: 98,
      },
    }),
  ])

  console.log('✅ Created polls')

  // Create quizzes
  const quizzes = await Promise.all([
    prisma.quiz.upsert({
      where: { id: 'cultural-heritage-quiz' },
      update: {},
      create: {
        id: 'cultural-heritage-quiz',
        title: "Uganda's Cultural Heritage",
        description: "Test your knowledge about Uganda's rich cultural traditions and history",
        questions: 15,
        difficulty: 'MEDIUM',
        category: 'Culture',
      },
    }),
    prisma.quiz.upsert({
      where: { id: 'wildlife-quiz' },
      update: {},
      create: {
        id: 'wildlife-quiz',
        title: "Wildlife of Uganda",
        description: "How well do you know Uganda's amazing wildlife and national parks?",
        questions: 20,
        difficulty: 'HARD',
        category: 'Nature',
      },
    }),
    prisma.quiz.upsert({
      where: { id: 'cuisine-quiz' },
      update: {},
      create: {
        id: 'cuisine-quiz',
        title: "Ugandan Cuisine",
        description: "Discover the flavors and dishes that make Ugandan food special",
        questions: 12,
        difficulty: 'EASY',
        category: 'Food',
      },
    }),
  ])

  console.log('✅ Created quizzes')

  // Create fan messages
  const fanMessages = await Promise.all([
    prisma.fanMessage.upsert({
      where: { id: 'sarah-message' },
      update: {},
      create: {
        id: 'sarah-message',
        content: "The Queen's visit to Murchison Falls was absolutely magical! Her passion for Uganda's beauty is truly inspiring. 🇺🇬✨",
        type: 'MESSAGE',
        userId: users[0].id,
      },
    }),
    prisma.fanMessage.upsert({
      where: { id: 'david-message' },
      update: {},
      create: {
        id: 'david-message',
        content: "Created this digital art inspired by the Queen's traditional dance performance. Hope you like it!",
        type: 'ART',
        userId: users[1].id,
      },
    }),
    prisma.fanMessage.upsert({
      where: { id: 'grace-message' },
      update: {},
      create: {
        id: 'grace-message',
        content: "Took this photo during the cultural festival. The Queen's elegance truly represents Uganda's beauty!",
        type: 'PHOTO',
        userId: users[2].id,
      },
    }),
  ])

  console.log('✅ Created fan messages')

  console.log('🎉 Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
