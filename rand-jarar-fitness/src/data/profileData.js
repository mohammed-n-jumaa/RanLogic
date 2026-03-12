// Helper function to generate meal data
const generateMeal = (id, name, time, calories, protein, carbs, fats, items, pdfUrl = null) => ({
  id,
  name,
  time,
  calories,
  protein,
  carbs,
  fats,
  items,
  checked: false,
  pdfUrl,
  instructions: 'Follow the preparation instructions in the PDF for best results.'
});

// Helper function to generate day data
const generateDay = (dayNumber) => {
  const date = new Date(2024, 0, dayNumber); // January 2024
  const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  const meals = [
    generateMeal(
      `${dayNumber}-1`,
      'Breakfast',
      '07:00 AM',
      450,
      30,
      45,
      15,
      ['3 boiled eggs', 'Whole wheat toast (2 slices)', 'Half avocado', 'Black coffee'],
      `/pdfs/day${dayNumber}-breakfast.pdf`
    ),
    generateMeal(
      `${dayNumber}-2`,
      'Morning Snack',
      '10:30 AM',
      200,
      15,
      25,
      8,
      ['Low-fat Greek yogurt', 'Handful of almonds (10 pieces)'],
      `/pdfs/day${dayNumber}-morning-snack.pdf`
    ),
    generateMeal(
      `${dayNumber}-3`,
      'Lunch',
      '01:00 PM',
      600,
      45,
      60,
      20,
      ['Grilled chicken breast (200g)', 'Basmati rice (1 cup)', 'Green salad', 'Olive oil (1 tablespoon)'],
      `/pdfs/day${dayNumber}-lunch.pdf`
    ),
    generateMeal(
      `${dayNumber}-4`,
      'Afternoon Snack',
      '04:30 PM',
      250,
      20,
      30,
      8,
      ['Protein shake', 'Medium banana'],
      `/pdfs/day${dayNumber}-afternoon-snack.pdf`
    ),
    generateMeal(
      `${dayNumber}-5`,
      'Dinner',
      '07:00 PM',
      300,
      25,
      20,
      9,
      ['Grilled salmon (150g)', 'Grilled vegetables', 'Salad'],
      `/pdfs/day${dayNumber}-dinner.pdf`
    )
  ];

  // Calculate totals
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const protein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const carbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const fats = meals.reduce((sum, meal) => sum + meal.fats, 0);

  return {
    dayNumber,
    date: dateString,
    totalCalories,
    protein,
    carbs,
    fats,
    meals
  };
};

export const userData = {
  name: 'Sarah Ahmed',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  height: 165,
  weight: 65,
  age: 28,
  goal: 'Weight Loss & Toning',
  program: 'Golden Transformation Program',
  price: 299,
  duration: '3 months',
  paymentStatus: 'paid',
  startDate: '2024-01-01',
  endDate: '2024-04-01',
  progress: 65,
  daysLeft: 45
};

// Updated nutrition plan with 10 days
export const nutritionPlan = {
  monthlyPdfUrl: '/pdfs/monthly-nutrition-plan-january-2024.pdf',
  days: Array.from({ length: 10 }, (_, i) => generateDay(i + 1))
};

export const workoutPlan = [
  {
    day: 'Sunday',
    title: 'Upper Body Workout',
    exercises: [
      { 
        name: 'Bench Press', 
        sets: 4, 
        reps: '10-12', 
        videoUrl: 'https://example.com/bench.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
        checked: true 
      },
      { 
        name: 'Shoulder Press', 
        sets: 3, 
        reps: '12-15', 
        videoUrl: 'https://example.com/shoulder.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
        checked: true 
      },
      { 
        name: 'Tricep Dips', 
        sets: 3, 
        reps: '12-15', 
        videoUrl: 'https://example.com/tricep.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=6kALZikXxLc',
        checked: false 
      },
      { 
        name: 'Bicep Curls', 
        sets: 3, 
        reps: '12-15', 
        videoUrl: 'https://example.com/bicep.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
        checked: false 
      }
    ]
  },
  {
    day: 'Monday',
    title: 'Cardio & Core',
    exercises: [
      { 
        name: 'Running', 
        sets: 1, 
        reps: '30 min', 
        videoUrl: 'https://example.com/run.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=brFHyOtTwH4',
        checked: false 
      },
      { 
        name: 'Plank', 
        sets: 3, 
        reps: '60 sec', 
        videoUrl: 'https://example.com/plank.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
        checked: false 
      },
      { 
        name: 'Russian Twists', 
        sets: 3, 
        reps: '20', 
        videoUrl: 'https://example.com/twist.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI',
        checked: false 
      }
    ]
  },
  {
    day: 'Tuesday',
    title: 'Active Rest',
    exercises: [
      { 
        name: 'Walking', 
        sets: 1, 
        reps: '45 min', 
        videoUrl: '',
        youtubeUrl: 'https://www.youtube.com/watch?v=gLEiyZHHtvU',
        checked: false 
      },
      { 
        name: 'Stretching', 
        sets: 1, 
        reps: '15 min', 
        videoUrl: '',
        youtubeUrl: 'https://www.youtube.com/watch?v=g_tea8ZNk5A',
        checked: false 
      }
    ]
  },
  {
    day: 'Wednesday',
    title: 'Lower Body Workout',
    exercises: [
      { 
        name: 'Squats', 
        sets: 4, 
        reps: '12-15', 
        videoUrl: 'https://example.com/squat.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
        checked: false 
      },
      { 
        name: 'Lunges', 
        sets: 3, 
        reps: '12 each', 
        videoUrl: 'https://example.com/lunge.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
        checked: false 
      },
      { 
        name: 'Leg Press', 
        sets: 4, 
        reps: '12-15', 
        videoUrl: 'https://example.com/legpress.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
        checked: false 
      },
      { 
        name: 'Calf Raises', 
        sets: 3, 
        reps: '15-20', 
        videoUrl: 'https://example.com/calf.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=gwLzBJYoWlI',
        checked: false 
      }
    ]
  },
  {
    day: 'Thursday',
    title: 'HIIT Training',
    exercises: [
      { 
        name: 'Burpees', 
        sets: 4, 
        reps: '15', 
        videoUrl: 'https://example.com/burpee.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
        checked: false 
      },
      { 
        name: 'Mountain Climbers', 
        sets: 4, 
        reps: '20', 
        videoUrl: 'https://example.com/mountain.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
        checked: false 
      },
      { 
        name: 'Jump Squats', 
        sets: 4, 
        reps: '15', 
        videoUrl: 'https://example.com/jumpsquat.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=A-cFYWvaHr0',
        checked: false 
      }
    ]
  },
  {
    day: 'Friday',
    title: 'Full Body',
    exercises: [
      { 
        name: 'Deadlifts', 
        sets: 4, 
        reps: '10-12', 
        videoUrl: 'https://example.com/deadlift.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
        checked: false 
      },
      { 
        name: 'Pull-ups', 
        sets: 3, 
        reps: '8-10', 
        videoUrl: 'https://example.com/pullup.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
        checked: false 
      },
      { 
        name: 'Push-ups', 
        sets: 3, 
        reps: '15-20', 
        videoUrl: 'https://example.com/pushup.mp4',
        youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
        checked: false 
      }
    ]
  },
  {
    day: 'Saturday',
    title: 'Rest Day',
    exercises: []
  }
];

export const messages = [
  {
    id: 1,
    sender: 'trainer',
    name: 'Rand Jarrar',
    avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop',
    message: 'Hello Sarah! How are you today?',
    time: '10:30 AM',
    date: '2024-01-15'
  },
  {
    id: 2,
    sender: 'user',
    message: 'I\'m doing great! I completed today\'s workout 💪',
    time: '10:45 AM',
    date: '2024-01-15'
  },
  {
    id: 3,
    sender: 'trainer',
    name: 'Rand Jarrar',
    avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop',
    message: 'Excellent! Keep up this level. I noticed your amazing commitment to the nutrition plan',
    time: '10:50 AM',
    date: '2024-01-15'
  },
  {
    id: 4,
    sender: 'user',
    message: 'Thank you! I have a question about the evening meal',
    time: '11:00 AM',
    date: '2024-01-15'
  }
];