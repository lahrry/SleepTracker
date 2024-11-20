import React from 'react';
import Slider, { SliderProps } from '@mui/material/Slider';
import '../../styles/SleepSlider.css';
export const SleepSlider: React.FC<SliderProps> = (props) => {
  return <Slider {...props} className="sleep-slider" />;
};

export default SleepSlider;
