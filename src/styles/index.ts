
// src/styles/index.ts

import { colors } from './colors';
import { typography, textStyles } from './typography';
import { commonStyles } from './common';
import { componentStyles } from './components';

// تصدير كل الأنماط
export { 
  colors, 
  typography, 
  textStyles, 
  commonStyles, 
  componentStyles 
};

// تصدير مجمع للراحة
export const styles = {
  colors,
  typography,
  common: commonStyles,
  components: componentStyles,
  text: textStyles,
};

export default styles;