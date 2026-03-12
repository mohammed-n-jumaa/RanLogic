import { motion } from 'framer-motion';
import ExerciseItem from './ExerciseItem';

const ExercisesList = ({ exercises, dayIndex, onToggleExercise }) => {
  return (
    <motion.div
      className="exercises-list"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {exercises.map((exercise, index) => (
        <ExerciseItem
          key={exercise.id}
          exercise={exercise}
          dayIndex={dayIndex}
          exerciseIndex={index}
          onToggleExercise={onToggleExercise}
        />
      ))}
    </motion.div>
  );
};

export default ExercisesList;