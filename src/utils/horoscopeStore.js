const horoscopeData = {
  Aries: [
    "Today brings exciting opportunities. Your energy is contagious!",
    "Take bold steps toward your goals. Success is within reach.",
    "A surprise encounter could change your perspective today.",
    "Focus on personal growth. The universe supports your journey.",
    "Your leadership skills shine bright. Others look to you for guidance.",
    "Balance work and play. Joy awaits in unexpected places.",
    "Trust your instincts. They're guiding you toward something amazing."
  ],
  Taurus: [
    "Patience pays off today. Good things come to those who wait.",
    "Financial opportunities knock at your door. Stay alert.",
    "Your practical approach solves a long-standing problem.",
    "Comfort and security are highlighted. Nurture your relationships.",
    "A creative project brings satisfaction and recognition.",
    "Nature calls you. Spend time outdoors for rejuvenation.",
    "Your determination inspires others. Keep pushing forward."
  ],
  Gemini: [
    "Communication is your superpower today. Express yourself freely.",
    "Curiosity leads to fascinating discoveries. Keep learning.",
    "Social connections bring joy and new opportunities.",
    "Adaptability is key. Embrace change with open arms.",
    "A witty conversation brightens someone's day, including yours.",
    "Multitasking comes naturally. You accomplish more than expected.",
    "Your versatile nature opens unexpected doors."
  ],
  Cancer: [
    "Home and family take center stage. Cherish these moments.",
    "Your intuition is spot-on. Trust your emotional intelligence.",
    "Nurturing others brings deep satisfaction today.",
    "Past memories resurface, bringing valuable insights.",
    "Create a cozy sanctuary. Self-care is essential now.",
    "Your empathy heals someone who needs it most.",
    "Emotional security strengthens your foundations."
  ],
  Leo: [
    "Your charisma attracts positive attention. Shine bright!",
    "Creative expression flows effortlessly. Share your talents.",
    "Leadership opportunities arise. Step into the spotlight.",
    "Generosity returns to you tenfold. Give from the heart.",
    "Romance and passion color your day beautifully.",
    "Your confidence inspires others to believe in themselves.",
    "Celebrate your achievements. You've earned recognition."
  ],
  Virgo: [
    "Attention to detail pays dividends. Your precision impresses.",
    "Organization brings clarity to chaos. Systems serve you well.",
    "Health and wellness deserve focus. Small changes matter.",
    "Your analytical mind solves complex problems with ease.",
    "Service to others brings fulfillment and purpose.",
    "Perfectionism can wait. Progress is more important today.",
    "Practical solutions emerge from careful observation."
  ],
  Libra: [
    "Balance and harmony guide your decisions. Peace prevails.",
    "Relationships flourish under your diplomatic touch.",
    "Beauty surrounds you. Take time to appreciate aesthetics.",
    "Fair solutions emerge from open-minded discussions.",
    "Social grace opens doors to exciting collaborations.",
    "Partnership brings mutual benefits. Cooperation is key.",
    "Your charm wins hearts and minds effortlessly."
  ],
  Scorpio: [
    "Transformation is underway. Embrace deep changes within.",
    "Your intensity uncovers hidden truths. Trust your instincts.",
    "Passionate pursuits bring extraordinary results today.",
    "Mystery and intrigue add excitement to your routine.",
    "Emotional depth connects you meaningfully with others.",
    "Your resilience overcomes any obstacle in your path.",
    "Secrets revealed lead to powerful revelations."
  ],
  Sagittarius: [
    "Adventure calls! Your wanderlust leads to amazing experiences.",
    "Optimism attracts opportunities. Your positive outlook inspires.",
    "Learning and expansion broaden your horizons today.",
    "Freedom and independence fuel your spirit beautifully.",
    "Philosophical insights bring clarity to life's big questions.",
    "Your honesty refreshes those around you. Speak your truth.",
    "Exploration, whether mental or physical, rewards you richly."
  ],
  Capricorn: [
    "Hard work yields tangible results. Your discipline pays off.",
    "Long-term goals come into sharper focus. Stay committed.",
    "Professional recognition validates your efforts and expertise.",
    "Responsibility sits comfortably on your capable shoulders.",
    "Traditional approaches prove most effective today.",
    "Your ambition drives you toward impressive achievements.",
    "Structure and planning create success in all endeavors."
  ],
  Aquarius: [
    "Innovation and originality set you apart. Think differently.",
    "Humanitarian efforts bring satisfaction and positive change.",
    "Technology and progress align with your forward vision.",
    "Independence allows you to express your unique perspective.",
    "Friendships and community connections strengthen today.",
    "Your unconventional approach solves problems others can't.",
    "The future looks bright through your visionary lens."
  ],
  Pisces: [
    "Intuition and dreams guide you toward hidden truths.",
    "Compassion flows naturally. Your empathy touches many.",
    "Creative imagination knows no bounds today. Create freely.",
    "Spiritual connections deepen. Trust the unseen forces.",
    "Artistic expression brings joy and meaningful catharsis.",
    "Your sensitivity is a gift. Honor your gentle nature.",
    "Mystical experiences add wonder to your daily life."
  ]
};

function getDailyHoroscope(zodiacSign) {
  const horoscopes = horoscopeData[zodiacSign];
  const dayIndex = new Date().getDay();
  return horoscopes[dayIndex % 7];
}

module.exports = { getDailyHoroscope };
