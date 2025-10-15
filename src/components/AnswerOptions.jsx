import React, { useState, useEffect } from 'react';

function AnswerOptions({ options, answer, userAnswer, onAnswer, isLocked }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(userAnswer || null);
  }, [userAnswer]);

  const handleClick = (opt) => {
    if (!isLocked) {
      setSelected(opt);
      onAnswer(opt);
    }
  };

  const getOptionClass = (opt) => {
    let classes = ['answer-option-enhanced'];
    
    if (!isLocked) {
      if (selected === opt) classes.push('selected');
    } else {
      if (opt === answer) classes.push('correct');
      else if (opt === selected && selected !== answer) classes.push('incorrect');
    }
    
    return classes.join(' ');
  };

  return (
    <div className="answer-options-enhanced">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => handleClick(opt)}
          className={getOptionClass(opt)}
          disabled={isLocked}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default AnswerOptions;

